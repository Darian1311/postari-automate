import requests
import os
import base64

PAGE_ID = os.getenv("FACEBOOK_PAGE_ID")
PAGE_TOKEN = os.getenv("FACEBOOK_PAGE_ACCESS_TOKEN")
GRAPH_URL = "https://graph.facebook.com/v19.0"


def post_photo(image_base64: str, message: str) -> dict:
    image_bytes = base64.b64decode(image_base64)

    response = requests.post(
        f"{GRAPH_URL}/{PAGE_ID}/photos",
        data={
            "message": message,
            "published": "true",
            "access_token": PAGE_TOKEN,
        },
        files={"source": ("post.jpg", image_bytes, "image/jpeg")},
        timeout=60,
    )

    result = response.json()
    if "error" in result:
        raise Exception(result["error"]["message"])

    return result
