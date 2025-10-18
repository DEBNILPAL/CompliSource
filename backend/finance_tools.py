from typing import List, Dict, Optional

FINANCE_KEYWORDS = [
    'gst','tax','tds','invoice','hsn','sac','turnover','gstr','itc','input tax credit','cash limit','compliance score'
]

def is_finance_query(q: str) -> bool:
    t = (q or '').lower()
    return any(k in t for k in FINANCE_KEYWORDS)


def answer_finance(q: str, violations: List[Dict] | None = None, score: Optional[int] = None) -> str:
    t = (q or '').lower()
    v = violations or []
    if 'score' in t or 'compliance' in t:
        # Prefer provided analyzed score if available; otherwise approximate from violations
        score = int(score) if score is not None else max(0, 100 - len(v) * 5)
        return (
            f"Your current compliance score is {score}%. "
            + ("Excellent compliance." if score >= 90 else ("Good, but review violations." if score >= 70 else "Needs improvement. Address the listed violations."))
        )
    if 'gst' in t or 'tax' in t:
        gst_count = sum(1 for it in v if 'gst' in str(it.get('type','')).lower())
        return (
            "GST overview: common issues include incorrect rates, invalid GSTIN formats, and wrong HSN/SAC. "
            f"I see {gst_count} GST-related issues in your data. Validate HSN/SAC and update invoices."
        )
    if 'cash' in t:
        return 'Cash transaction limit reference: in India, cash transactions above INR 200,000 are restricted. Prefer banking channels for large amounts.'
    if 'fix' in t or 'resolve' in t or 'solve' in t:
        return (
            'Resolution steps: 1) Correct GST rates via HSN/SAC. 2) Ensure TDS where applicable. '
            '3) Keep cash below threshold or use digital payments. 4) Fix dates/duplicate invoices.'
        )
    return 'I can help with GST rules, TDS, cash limits, invoices, and your compliance score. Ask something specific or say "generate report" after analysis.'
