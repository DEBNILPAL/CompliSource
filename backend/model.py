from typing import List, Dict

# Placeholder ML/DL scoring function
# In a real setup, you might load a trained model (e.g., sklearn, PyTorch, TF)
# and compute a probability/score. Here we derive a stable score using simple
# heuristics so the system is runnable without heavy dependencies.

import os
import math
from statistics import mean, pstdev

_ONNX_SESSION = None
_ONNX_INPUT_NAME = None

def _try_load_onnx():
    global _ONNX_SESSION, _ONNX_INPUT_NAME
    if _ONNX_SESSION is not None:
        return _ONNX_SESSION
    model_path = os.getenv("MODEL_ONNX_PATH", os.path.join(os.path.dirname(__file__), "model.onnx"))
    try:
        import onnxruntime as ort  # type: ignore
        if os.path.exists(model_path):
            _ONNX_SESSION = ort.InferenceSession(model_path, providers=["CPUExecutionProvider"])  # noqa: F401
            _ONNX_INPUT_NAME = _ONNX_SESSION.get_inputs()[0].name
            return _ONNX_SESSION
    except Exception:
        return None
    return None

def _to_float(v):
    try:
        if v is None:
            return None
        s = str(v).replace(",", "").strip()
        if not s:
            return None
        return float(s)
    except Exception:
        return None

def _compute_features(records: List[Dict[str, str]], violations: List[dict]):
    n = max(1, len(records))
    v = len(violations)
    amounts = []
    cash_cnt = 0
    high_amt_cnt = 0
    tds_missing_cnt = 0
    gst_invalid_cnt = 0

    # index violations for quick checks
    v_types = [vi.get("type") for vi in violations]
    for r in records:
        amt = _to_float(r.get("amount"))
        mode = (r.get("mode") or "").strip().lower()
        if amt is not None:
            amounts.append(amt)
            if amt > 50000:
                high_amt_cnt += 1
        if mode == "cash":
            cash_cnt += 1
    # count violation types
    gst_invalid_cnt = sum(1 for t in v_types if t in ("gstin_invalid_length", "gstin_format_invalid"))
    tds_missing_cnt = sum(1 for t in v_types if t == "tds_missing_for_high_amount")

    avg_amt = mean(amounts) if amounts else 0.0
    std_amt = pstdev(amounts) if amounts else 0.0

    features = [
        float(len(records)),
        float(v) / float(n),
        float(cash_cnt) / float(n),
        float(high_amt_cnt) / float(n),
        float(gst_invalid_cnt) / float(n),
        float(tds_missing_cnt) / float(n),
        float(avg_amt),
        float(std_amt),
    ]
    return features

def _heuristic_score(records: List[Dict[str, str]], violations: List[dict]) -> int:
    n = max(1, len(records))
    v = len(violations)
    density = v / n
    # base penalty from density
    penalty = min(80, int(density * 120))
    # additional small penalty for cash dominance and high average amounts
    feats = _compute_features(records, violations)
    cash_ratio = feats[2]
    avg_amt = feats[6]
    penalty += int(min(10, cash_ratio * 15))
    if avg_amt > 100000:
        penalty += 5
    score = max(0, 100 - penalty)
    return score

def predict_score(records: List[Dict[str, str]], violations: List[dict]) -> int:
    sess = _try_load_onnx()
    if sess is not None:
        try:
            import numpy as np  # type: ignore
            feats = _compute_features(records, violations)
            x = np.array(feats, dtype=np.float32).reshape(1, -1)
            inp = {_ONNX_INPUT_NAME: x}
            out = sess.run(None, inp)[0]
            prob = float(out.ravel()[0])
            if math.isnan(prob) or math.isinf(prob):
                return _heuristic_score(records, violations)
            score = int(max(0.0, min(1.0, prob)) * 100.0)
            return score
        except Exception:
            return _heuristic_score(records, violations)
    return _heuristic_score(records, violations)
