---
name: be-development
description: "ChordLens BE 개발 가이드. FastAPI 라우터, Pydantic 모델, 서비스 레이어, Supabase 접근 구현 시 반드시 사용. chordlens-be repo 작업. 오디오 파이프라인(autochord/librosa), yt-dlp 처리 패턴 포함."
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

## 오디오 파이프라인 — autochord / librosa

ChordLens는 YouTube 오디오에서 기타 코드를 추출하는 파이프라인을 사용한다.

### autochord (메인)

```python
import autochord

# autochord는 오디오 파일 경로를 받아 (time, chord) 리스트 반환
chords = autochord.recognize(audio_path, lab_fmt=False)
# 반환 형식: [(start_time: float, end_time: float, chord: str), ...]
# chord 예시: "N" (no chord), "C:maj", "A:min", "G:7"
```

**코드 출력 포맷 정규화:**

```python
def normalize_chord(raw: str) -> str:
    """autochord 출력을 FE ChordData 형식으로 변환"""
    if raw == "N":
        return None  # 코드 없음 구간은 제외
    # "C:maj" → "C", "A:min" → "Am", "G:7" → "G7"
    root, *quality = raw.split(":")
    quality_str = quality[0] if quality else "maj"
    quality_map = {"maj": "", "min": "m", "7": "7", "maj7": "maj7", "min7": "m7"}
    return root + quality_map.get(quality_str, quality_str)
```

### librosa (폴백)

autochord 실패 또는 결과 신뢰도 낮을 때 librosa로 폴백:

```python
import librosa
import numpy as np

def extract_chords_librosa(audio_path: str) -> list[tuple]:
    y, sr = librosa.load(audio_path, sr=22050)
    # chromagram 기반 코드 추정 (단순 버전)
    chroma = librosa.feature.chroma_cqt(y=y, sr=sr)
    # 프레임별 최강 음정으로 루트 노트 추정
    # 실제 구현은 app/services/chord_utils.py 참조
    ...
```

**폴백 전략:**

```python
async def extract(audio_path: str) -> list[ChordSegment]:
    try:
        raw = autochord.recognize(audio_path, lab_fmt=False)
        if len(raw) < 3:  # 결과 너무 적으면 신뢰도 낮음
            raise ValueError("autochord result too sparse")
        return [normalize(r) for r in raw if r[2] != "N"]
    except Exception:
        # librosa 폴백
        return extract_chords_librosa(audio_path)
```

## yt-dlp — YouTube 오디오 다운로드

### URL 유효성 검증

```python
import re

YOUTUBE_PATTERNS = [
    r'(?:https?://)?(?:www\.)?youtube\.com/watch\?v=[\w-]+',
    r'(?:https?://)?youtu\.be/[\w-]+',
    r'(?:https?://)?(?:www\.)?youtube\.com/shorts/[\w-]+',
]

def validate_youtube_url(url: str) -> str:
    """유효한 YouTube URL이면 video ID 반환, 아니면 ValueError"""
    for pattern in YOUTUBE_PATTERNS:
        if re.match(pattern, url):
            # video ID 추출
            match = re.search(r'(?:v=|youtu\.be/|shorts/)([\w-]+)', url)
            if match:
                return match.group(1)
    raise ValueError(f"Invalid YouTube URL: {url}")
```

### 포맷 선택 및 다운로드

```python
import yt_dlp
import tempfile
import os

def download_audio(url: str) -> str:
    """오디오를 임시 파일로 다운로드, 파일 경로 반환"""
    tmp = tempfile.mktemp(suffix=".mp3")
    ydl_opts = {
        "format": "bestaudio/best",           # 최고 품질 오디오
        "outtmpl": tmp.replace(".mp3", ""),
        "postprocessors": [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
            "preferredquality": "192",
        }],
        "quiet": True,
        "no_warnings": True,
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])
    return tmp
```

### 에러 처리 — 차단 영상

```python
from yt_dlp.utils import DownloadError, ExtractorError

async def safe_download(url: str) -> str:
    try:
        return download_audio(url)
    except DownloadError as e:
        msg = str(e).lower()
        if "private" in msg or "unavailable" in msg:
            raise HTTPException(status_code=400, detail="Video is private or unavailable")
        if "age" in msg or "sign in" in msg:
            raise HTTPException(status_code=400, detail="Age-restricted video cannot be processed")
        if "copyright" in msg or "blocked" in msg:
            raise HTTPException(status_code=400, detail="Video is blocked in this region")
        raise HTTPException(status_code=500, detail="Failed to download video")
    except ExtractorError:
        raise HTTPException(status_code=400, detail="Cannot extract video info")
    finally:
        # 임시 파일 정리는 호출자 책임
        pass
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
- [ ] yt-dlp 에러 케이스 (private/age-restricted/blocked) 처리
