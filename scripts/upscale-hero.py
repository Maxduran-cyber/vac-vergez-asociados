"""Build the master high-resolution hero image from the best verified source."""

from pathlib import Path
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
V3_WIDE_SRC = ROOT / "raw-assets" / "images_habitat_villas_v3_wide.jpg"
V3_MOBILE_SRC = ROOT / "raw-assets" / "images_habitat_villas_uploaded_v3.jpg"
V2_SRC = ROOT / "raw-assets" / "images_habitat_villas_uploaded_v2.jpg"
AI_SRC = ROOT / "raw-assets" / "images_habitat_villas_ai_1264.jpg"
UPLOADED_SRC = ROOT / "raw-assets" / "images_habitat_villas_uploaded.jpg"
OUT_MASTER_4K = ROOT / "raw-assets" / "images_habitat_villas_master_4k.png"
OUT_MOBILE_4K = ROOT / "raw-assets" / "images_habitat_villas_mobile_4k.png"

TARGET_W = 3840
TARGET_H = 2160
MOBILE_W = 2160
MOBILE_H = 2880


def box_blur_2d(channel: np.ndarray, radius: int) -> np.ndarray:
    h, w = channel.shape
    pad = np.pad(channel, ((radius, radius), (radius, radius)), mode="edge")
    csum = np.cumsum(np.cumsum(pad, axis=0), axis=1)
    csum = np.pad(csum, ((1, 0), (1, 0)), mode="constant", constant_values=0.0)
    k = 2 * radius + 1
    total = (
        csum[k : k + h, k : k + w]
        - csum[0:h, k : k + w]
        - csum[k : k + h, 0:w]
        + csum[0:h, 0:w]
    )
    return total / float(k * k)


def enhance_tone(img: Image.Image) -> Image.Image:
    """Apply clean daylight balance, subtle brightness lift, and contrast crispness."""
    lifted = ImageEnhance.Brightness(img).enhance(1.04)
    contrasted = ImageEnhance.Contrast(lifted).enhance(1.06)
    balanced = ImageEnhance.Color(contrasted).enhance(1.04)
    return balanced


def edge_guided_sharpen(img: Image.Image) -> Image.Image:
    """Apply multi-scale edge-aware crispness without introducing halos or synthetic grain."""
    arr = np.asarray(img, dtype=np.float32)
    lum = 0.299 * arr[:, :, 0] + 0.587 * arr[:, :, 1] + 0.114 * arr[:, :, 2]

    gx = np.abs(np.gradient(lum, axis=1))
    gy = np.abs(np.gradient(lum, axis=0))
    grad = np.hypot(gx, gy)
    edge_mask = np.clip((grad - 4.0) / 16.0, 0.0, 1.0)
    edge_mask = box_blur_2d(edge_mask, radius=2)[:, :, None]

    blur_fine = np.asarray(img.filter(ImageFilter.GaussianBlur(radius=0.95)), dtype=np.float32)
    blur_mid = np.asarray(img.filter(ImageFilter.GaussianBlur(radius=2.1)), dtype=np.float32)
    detail_fine = arr - blur_fine
    detail_mid = blur_fine - blur_mid

    sharpened = arr + detail_fine * (0.28 + 0.56 * edge_mask) + detail_mid * (0.14 * edge_mask)
    return Image.fromarray(np.clip(sharpened, 0, 255).astype(np.uint8), mode="RGB")


def main() -> None:
    if V3_WIDE_SRC.exists():
        desktop_src = V3_WIDE_SRC
    elif V2_SRC.exists():
        desktop_src = V2_SRC
    elif AI_SRC.exists():
        desktop_src = AI_SRC
    else:
        desktop_src = UPLOADED_SRC

    if not desktop_src.exists():
        raise FileNotFoundError(f"Missing hero source image: {desktop_src}")

    desktop_img = Image.open(desktop_src).convert("RGB")
    desktop_toned = enhance_tone(desktop_img)
    desktop_resized = desktop_toned.resize((TARGET_W, TARGET_H), Image.Resampling.LANCZOS)
    desktop_master = edge_guided_sharpen(desktop_resized)
    desktop_master.save(OUT_MASTER_4K, format="PNG", optimize=True)
    print(f"[upscale-hero] Saved 4K desktop master {OUT_MASTER_4K} from {desktop_src.name} ({desktop_master.width}x{desktop_master.height})")

    mobile_src = V3_MOBILE_SRC if V3_MOBILE_SRC.exists() else desktop_src
    mobile_img = Image.open(mobile_src).convert("RGB")
    mobile_toned = enhance_tone(mobile_img)
    mobile_resized = mobile_toned.resize((MOBILE_W, MOBILE_H), Image.Resampling.LANCZOS)
    mobile_master = edge_guided_sharpen(mobile_resized)
    mobile_master.save(OUT_MOBILE_4K, format="PNG", optimize=True)
    print(f"[upscale-hero] Saved 4K mobile master {OUT_MOBILE_4K} from {mobile_src.name} ({mobile_master.width}x{mobile_master.height})")


if __name__ == "__main__":
    main()
