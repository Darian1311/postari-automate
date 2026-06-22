import urllib.parse
import requests
import base64


def generate_job_image(post: str) -> str:
    """Generate hiring image via Pollinations AI (free, no API key). Returns base64."""
    prompt = (
        f"professional job hiring poster, {post} position, friendly Romanian grocery store, "
        "warm welcoming atmosphere, modern clean store, diverse team smiling, "
        "bright colors, high quality professional photo, no text overlays"
    )
    encoded = urllib.parse.quote(prompt)
    url = f"https://image.pollinations.ai/prompt/{encoded}?width=1080&height=1080&nologo=true"

    response = requests.get(url, timeout=120)
    response.raise_for_status()

    return base64.b64encode(response.content).decode("utf-8")
