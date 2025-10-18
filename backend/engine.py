from typing import List, Dict, Tuple
from model import predict_score

def run_engine(records: List[Dict[str, str]]) -> Tuple[int, List[dict]]:
    """
    Very simple rule checks on CSV rows plus an ML-derived score.
    Expected optional columns: amount, gstin, tds, mode
    Returns: (score 0-100, violations list)
    """
    import re
    from datetime import datetime

    violations: List[dict] = []
    cash_limit = 200000  # example policy threshold

    # Precompile GSTIN regex (India): 2 digits + 5 letters + 4 digits + 1 letter + 1 entity (alnum) + 1 'Z' default + 1 checksum (alnum)
    gstin_regex = re.compile(r"^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[0-9A-Z]{1}$", re.IGNORECASE)

    # For duplicate detection, we'll use invoice identifiers if present
    seen_keys = set()
    dup_candidates = {}

    # Helper: parse amount
    def to_float(v):
        try:
            if v is None:
                return None
            s = str(v).replace(',', '').strip()
            if not s:
                return None
            return float(s)
        except Exception:
            return None

    # Helper: parse date (support common formats)
    def parse_date(v):
        if not v:
            return None
        s = str(v).strip()
        for fmt in ("%Y-%m-%d", "%d-%m-%Y", "%d/%m/%Y", "%m/%d/%Y", "%Y/%m/%d"):
            try:
                return datetime.strptime(s, fmt).date()
            except Exception:
                continue
        return None

    amounts_cash = []
    below_threshold_cash = 0

    for idx, r in enumerate(records):
        rowv = {"row": idx + 1}
        # Amount checks
        amt = to_float(r.get('amount'))
        if 'amount' in r and r.get('amount') and amt is None:
            violations.append({**rowv, "type": "amount_parse_error", "detail": r.get('amount')})

        mode = str(r.get('mode', '')).lower().strip()
        if amt is not None and mode == 'cash':
            amounts_cash.append(amt)
        if amt is not None and amt > cash_limit and mode == 'cash':
            violations.append({**rowv, "type": "cash_limit_exceeded", "amount": amt})

        # Structuring pattern: many cash tx just below limit (e.g., within 10%)
        if amt is not None and mode == 'cash' and (cash_limit * 0.8) < amt < cash_limit:
            below_threshold_cash += 1

        # GSTIN format checks
        gstin = (r.get('gstin') or '').strip()
        if gstin:
            if len(gstin) != 15:
                violations.append({**rowv, "type": "gstin_invalid_length", "gstin": gstin})
            elif not gstin_regex.match(gstin):
                violations.append({**rowv, "type": "gstin_format_invalid", "gstin": gstin})

        # TDS presence check
        if amt is not None and amt > 50000 and not (r.get('tds') or '').strip():
            violations.append({**rowv, "type": "tds_missing_for_high_amount", "amount": amt})

        # Date sanity checks
        dt = parse_date(r.get('date') or r.get('txn_date') or r.get('invoice_date'))
        if (r.get('date') or r.get('txn_date') or r.get('invoice_date')) and dt is None:
            violations.append({**rowv, "type": "date_parse_error", "detail": r.get('date') or r.get('txn_date') or r.get('invoice_date')})
        if dt is not None:
            today = datetime.utcnow().date()
            if dt > today:
                violations.append({**rowv, "type": "date_in_future", "date": str(dt)})
            # Optional: very old records (over 10 years) flagged informationally
            try:
                if (today - dt).days > 365 * 10:
                    violations.append({**rowv, "type": "date_unusually_old", "date": str(dt)})
            except Exception:
                pass

        # Duplicate invoice detection using common fields
        inv = (r.get('invoice') or r.get('invoice_no') or r.get('invoice_number') or '').strip()
        party = (r.get('party') or r.get('vendor') or r.get('counterparty') or '').strip().lower()
        key = None
        if inv:
            # Stabilize key on invoice + party + approx amount
            approx_amt = int(amt) if amt is not None else None
            key = (inv.lower(), party, approx_amt)
            if key in seen_keys:
                violations.append({**rowv, "type": "duplicate_invoice", "invoice": inv, "party": party})
            else:
                seen_keys.add(key)
                dup_candidates.setdefault(inv.lower(), []).append(idx + 1)

    # Post-loop: structuring summary violation if many below-threshold cash tx
    if below_threshold_cash >= 5 and len(amounts_cash) >= 8:
        violations.append({"type": "cash_structuring_suspected", "count": below_threshold_cash, "window": len(amounts_cash), "threshold": cash_limit})

    score = predict_score(records, violations)
    return score, violations
