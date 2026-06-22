from fastapi import HTTPException

MAX_SIZE_BYTES = 10 * 1024 * 1024  # 10MB

# Magic bytes pentru formate acceptate
MAGIC = {
    b"\xff\xd8\xff": "image/jpeg",
    b"\x89PNG\r\n\x1a\n": "image/png",
    b"GIF87a": "image/gif",
    b"GIF89a": "image/gif",
    b"BM": "image/bmp",
}


def validate_image(data: bytes) -> None:
    if len(data) > MAX_SIZE_BYTES:
        raise HTTPException(status_code=400, detail="Imaginea depășește limita de 10MB.")

    if len(data) < 8:
        raise HTTPException(status_code=400, detail="Fișier invalid.")

    # WEBP: bytes 0-3 = RIFF, bytes 8-11 = WEBP
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return

    for magic, _ in MAGIC.items():
        if data[: len(magic)] == magic:
            return

    raise HTTPException(status_code=400, detail="Format imagine neacceptat. Folosește JPG, PNG, WEBP sau GIF.")
