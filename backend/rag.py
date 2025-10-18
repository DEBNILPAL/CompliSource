import os
from typing import List, Tuple

# Minimal TF-IDF retriever over local docs
try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
except Exception as e:
    TfidfVectorizer = None
    cosine_similarity = None

_DOCS: List[Tuple[str, str]] = []  # (path, text)
_VECT = None
_MATRIX = None

INCLUDE_EXTS = {'.md', '.txt'}


def _read_file(p: str) -> str:
    try:
        with open(p, 'r', encoding='utf-8', errors='ignore') as f:
            return f.read()
    except Exception:
        return ''


def discover_corpus(base_dir: str) -> List[Tuple[str, str]]:
    docs: List[Tuple[str, str]] = []
    for root, _, files in os.walk(base_dir):
        for fn in files:
            ext = os.path.splitext(fn)[1].lower()
            if ext in INCLUDE_EXTS:
                p = os.path.join(root, fn)
                # Avoid node_modules and build artifacts
                if 'node_modules' in p or '.git' in p or 'dist' in p or 'build' in p:
                    continue
                txt = _read_file(p)
                if txt.strip():
                    docs.append((p, txt))
    return docs


def build_index(base_dir: str) -> None:
    global _DOCS, _VECT, _MATRIX
    if TfidfVectorizer is None:
        _DOCS = []
        _VECT = None
        _MATRIX = None
        return
    _DOCS = discover_corpus(base_dir)
    texts = [t for _, t in _DOCS]
    if not texts:
        _VECT = None
        _MATRIX = None
        return
    _VECT = TfidfVectorizer(stop_words='english', max_df=0.9)
    _MATRIX = _VECT.fit_transform(texts)


def retrieve(query: str, k: int = 3) -> List[Tuple[str, str, float]]:
    """Returns list of (path, snippet, score)"""
    if not query or _VECT is None or _MATRIX is None or cosine_similarity is None or not _DOCS:
        return []
    qv = _VECT.transform([query])
    sims = cosine_similarity(qv, _MATRIX)[0]
    idxs = sims.argsort()[::-1][:k]
    out: List[Tuple[str, str, float]] = []
    for i in idxs:
        path, text = _DOCS[i]
        score = float(sims[i])
        snippet = text[:800].strip().replace('\n', ' ')
        out.append((path, snippet, score))
    return out
