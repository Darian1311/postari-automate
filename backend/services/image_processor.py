from PIL import Image, ImageDraw, ImageFont
import io
import base64

_BOLD_FONTS = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    "/usr/share/fonts/truetype/ubuntu/Ubuntu-B.ttf",
]
_REGULAR_FONTS = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    "/usr/share/fonts/truetype/ubuntu/Ubuntu-R.ttf",
]


def _font(size: int, bold: bool = True) -> ImageFont.FreeTypeFont:
    for path in (_BOLD_FONTS if bold else _REGULAR_FONTS):
        try:
            return ImageFont.truetype(path, size)
        except (IOError, OSError):
            continue
    return ImageFont.load_default(size=size)


def process_promotion_image(image_bytes: bytes, pret: float, discount: int) -> str:
    pret_nou = round(pret * (1 - discount / 100), 2)
    W, H = 1080, 1080

    # Warm gradient background
    bg = Image.new('RGBA', (W, H))
    draw_bg = ImageDraw.Draw(bg)
    for y in range(H):
        t = y / H
        r = int(255 - t * 20)
        g = int(145 - t * 65)
        b = int(10 + t * 10)
        draw_bg.line([(0, y), (W, y)], fill=(r, g, b, 255))

    # Product image
    try:
        product = Image.open(io.BytesIO(image_bytes)).convert('RGBA')
    except Exception:
        return base64.b64encode(image_bytes).decode()

    product.thumbnail((820, 630), Image.LANCZOS)
    px = (W - product.width) // 2
    py = 55 + (630 - product.height) // 2
    bg.paste(product, (px, py), product)

    # White price panel
    panel = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(panel).rounded_rectangle(
        [30, 720, W - 30, H - 68], radius=28, fill=(255, 255, 255, 238)
    )
    bg = Image.alpha_composite(bg, panel)

    final = bg.convert('RGB')
    draw = ImageDraw.Draw(final)

    # Fonts
    f_price = _font(88)
    f_label = _font(36)
    f_old = _font(44)
    f_disc = _font(44)
    f_disc_s = _font(27)
    f_brand = _font(31)

    # New price
    draw.text((W // 2, 800), f"{pret_nou:.2f} lei", font=f_price, fill=(205, 30, 30), anchor="mm")
    draw.text((W // 2, 868), "PREȚ NOU", font=f_label, fill=(205, 30, 30), anchor="mm")

    # Old price strikethrough
    old_y = 925
    draw.text((W // 2, old_y), f"{pret:.2f} lei", font=f_old, fill=(155, 155, 155), anchor="mm")
    bb = draw.textbbox((W // 2, old_y), f"{pret:.2f} lei", font=f_old, anchor="mm")
    mid = (bb[1] + bb[3]) // 2
    draw.line([(bb[0] - 2, mid), (bb[2] + 2, mid)], fill=(155, 155, 155), width=3)

    # Discount badge
    cx, cy, rb = W - 132, 132, 112
    draw.ellipse([cx - rb, cy - rb, cx + rb, cy + rb], fill=(205, 30, 30))
    draw.text((cx, cy - 22), f"-{discount}%", font=f_disc, fill=(255, 255, 255), anchor="mm")
    draw.text((cx, cy + 32), "REDUCERE", font=f_disc_s, fill=(255, 215, 215), anchor="mm")

    # Miomar Universal bar
    draw.rectangle([0, H - 65, W, H], fill=(15, 80, 170))
    draw.text((W // 2, H - 32), "MIOMAR UNIVERSAL", font=f_brand, fill=(255, 255, 255), anchor="mm")

    buf = io.BytesIO()
    final.save(buf, format='JPEG', quality=92)
    return base64.b64encode(buf.getvalue()).decode()
