---
name: be-development
description: "ChordLens BE 개발 가이드. FastAPI 라우터, Pydantic 모델, 서비스 레이어, Supabase 접근 구현 시 반드시 사용. chordlens-be repo 작업. 라우터 생성, 서비스 분리, 환경 변수 접근 패턴 포함."
---

# ChordLens BE Development

chordlens-be FastAPI 백엔드 개발 규칙.

## 기술 스택

- Python 3.11
- FastAPI 0.111
- Supabase (PostgreSQL)
- Docker

## 디렉토리 구조

```
app/
├── routers/      ← FastAPI 라우터 (엔드포인트 정의만)
├── models/       ← Pydantic 모델 (요청/응답 스키마)
├── services/     ← 비즈니스 로직
├── db.py         ← Supabase 싱글턴
└── core/
    └── config.py ← 환경 변수 접근
```

## 라우터 작성

```python
# app/routers/extract.py
from fastapi import APIRouter, HTTPException
from app.models.extract import ExtractRequest, ExtractResponse
from app.services.extract import ExtractService

router = APIRouter()

@router.post("/extract", response_model=ExtractResponse)
async def extract_chords(request: ExtractRequest):
    try:
        return await ExtractService.extract(request.url)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
```

**금지:**

- 라우터에 비즈니스 로직 직접 작성 — 반드시 services/로 분리
- `os.environ` 직접 접근

## Pydantic 모델

```python
# app/models/extract.py
from pydantic import BaseModel

class ExtractRequest(BaseModel):
    url: str

class ExtractResponse(BaseModel):
    chords: list[ChordData]
```

## 서비스 레이어

```python
# app/services/extract.py
from app.db import get_db
from app.core.config import settings

class ExtractService:
    @staticmethod
    async def extract(url: str):
        db = get_db()
        # 비즈니스 로직
```

## 환경 변수 접근

```python
from app.core.config import settings  # O
import os; os.environ["KEY"]          # X
```

## 엔드포인트

- `POST /extract` — YouTube URL로 코드 추출
- `GET /health` — 헬스체크

## 작업 완료 전 체크

- [ ] 비즈니스 로직이 services/에 있음
- [ ] 모델이 models/에 Pydantic으로 선언
- [ ] `os.environ` 직접 접근 없음
- [ ] HTTPException 에러 처리 (400/500)
- [ ] Supabase 접근은 `app/db.py` 경유
