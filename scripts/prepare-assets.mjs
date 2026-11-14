import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const RAW_DIR = path.join(ROOT_DIR, 'raw-assets');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const OUT_IMAGES_DIR = path.join(PUBLIC_DIR, 'images');

fs.mkdirSync(OUT_IMAGES_DIR, { recursive: true });

const PROJECT_IMAGES = [
  { key: 'torre-panorama-1', raw: 'images_Torre_panorama1.png' },
  { key: 'torre-panorama-2', raw: 'images_Torre_panorama_2.png' },
  { key: 'asian-teppanyaki-1', raw: 'images_Asian_Teppanyaki_1.png' },
  { key: 'asian-teppanyaki-2', raw: 'images_Asian_Teppanyaki2.png' },
  { key: 'bayshore-villa-1', raw: 'images_bayshore_villa1.png' },
  { key: 'bayshore-villa-2', raw: 'images_bayshore_villa2.png' },
  { key: 'canamar-1', raw: 'images_Canamar1.png' },
  { key: 'canamar-2', raw: 'images_Canamar2.png' },
];

async function processLogo() {
  const logoPath = path.join(RAW_DIR, 'images_logo1.png');
  if (!fs.existsSync(logoPath)) {
    throw new Error(`Missing raw logo file: ${logoPath}`);
  }

  // Trim transparent outer margins while keeping original proportions
  const trimmedBuf = await sharp(logoPath)
    .trim({ threshold: 5 })
    .toBuffer();

  const whiteResized = sharp(trimmedBuf).resize({
    width: 800,
    withoutEnlargement: true,
    kernel: sharp.kernel.lanczos3,
  });

  const whiteMeta = await whiteResized.clone().webp({ quality: 95, alphaQuality: 100 }).toFile(
    path.join(OUT_IMAGES_DIR, 'vac-logo-white.webp'),
  );
  await whiteResized.clone().png({ compressionLevel: 9 }).toFile(
    path.join(OUT_IMAGES_DIR, 'vac-logo-white.png'),
  );

  // Create dark (#111111) logo variant preserving the exact alpha channel
  const { data, info } = await whiteResized
    .clone()
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const darkPixels = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    darkPixels[i] = 17;      // #11
    darkPixels[i + 1] = 17;  // #11
    darkPixels[i + 2] = 17;  // #11
    darkPixels[i + 3] = data[i + 3]; // original alpha
  }

  const darkSharp = sharp(darkPixels, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  });

  await darkSharp.clone().webp({ quality: 95, alphaQuality: 100 }).toFile(
    path.join(OUT_IMAGES_DIR, 'vac-logo-dark.webp'),
  );
  await darkSharp.clone().png({ compressionLevel: 9 }).toFile(
    path.join(OUT_IMAGES_DIR, 'vac-logo-dark.png'),
  );

  // Geometric architectural favicon SVG & PNG
  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="VAC">
  <rect width="64" height="64" fill="#111111"/>
  <rect x="6" y="6" width="52" height="52" fill="none" stroke="#FFFFFF" stroke-opacity="0.22" stroke-width="1"/>
  <text x="32" y="38.5" text-anchor="middle" font-family="Manrope, Arial, sans-serif" font-weight="700" font-size="20" letter-spacing="1.8" fill="#FFFFFF">VAC</text>
</svg>
`;
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.svg'), faviconSvg, 'utf8');
  await sharp(Buffer.from(faviconSvg))
    .resize(64, 64)
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT_IMAGES_DIR, 'favicon.png'));

  return {
    width: whiteMeta.width,
    height: whiteMeta.height,
  };
}

async function processInstitutionalImage() {
  const srcPath = path.join(RAW_DIR, 'images_pc_layout.png');
  if (!fs.existsSync(srcPath)) {
    throw new Error(`Missing raw institutional image: ${srcPath}`);
  }

  // Native size is 1059x744; never upscale
  const base = sharp(srcPath).flatten({ background: '#111111' });

  await base
    .clone()
    .resize(1059, 744, { fit: 'cover', kernel: sharp.kernel.lanczos3 })
    .modulate({ brightness: 1.02, saturation: 1.02 })
    .sharpen({ sigma: 0.52, m1: 0.65, m2: 1.15 })
    .webp({ quality: 92 })
    .toFile(path.join(OUT_IMAGES_DIR, 'institucional-vac-1059.webp'));

  await base
    .clone()
    .resize(1059, 744, { fit: 'cover', kernel: sharp.kernel.lanczos3 })
    .modulate({ brightness: 1.02, saturation: 1.02 })
    .sharpen({ sigma: 0.52, m1: 0.65, m2: 1.15 })
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(path.join(OUT_IMAGES_DIR, 'institucional-vac-1059.jpg'));

  await base
    .clone()
    .resize(760, 534, { fit: 'cover', kernel: sharp.kernel.lanczos3 })
    .modulate({ brightness: 1.02, saturation: 1.02 })
    .sharpen({ sigma: 0.52, m1: 0.65, m2: 1.15 })
    .webp({ quality: 90 })
    .toFile(path.join(OUT_IMAGES_DIR, 'institucional-vac-760.webp'));

  return { width: 1059, height: 744 };
}

async function processProjectImages() {
  for (const item of PROJECT_IMAGES) {
    const srcPath = path.join(RAW_DIR, item.raw);
    if (!fs.existsSync(srcPath)) {
      throw new Error(`Missing raw project image: ${srcPath}`);
    }

    const base = sharp(srcPath).flatten({ background: '#111111' });

    // Native 548x730 (3:4 portrait aspect ratio)
    await base
      .clone()
      .resize(548, 730, { fit: 'cover', kernel: sharp.kernel.lanczos3 })
      .modulate({ brightness: 1.02, saturation: 1.02 })
      .sharpen({ sigma: 0.52, m1: 0.65, m2: 1.15 })
      .webp({ quality: 92 })
      .toFile(path.join(OUT_IMAGES_DIR, `${item.key}.webp`));

    await base
      .clone()
      .resize(548, 730, { fit: 'cover', kernel: sharp.kernel.lanczos3 })
      .modulate({ brightness: 1.02, saturation: 1.02 })
      .sharpen({ sigma: 0.52, m1: 0.65, m2: 1.15 })
      .jpeg({ quality: 90, mozjpeg: true })
      .toFile(path.join(OUT_IMAGES_DIR, `${item.key}.jpg`));

    // Responsive 420x560 derivative
    await base
      .clone()
      .resize(420, 560, { fit: 'cover', kernel: sharp.kernel.lanczos3 })
      .modulate({ brightness: 1.02, saturation: 1.02 })
      .sharpen({ sigma: 0.52, m1: 0.65, m2: 1.15 })
      .webp({ quality: 88 })
      .toFile(path.join(OUT_IMAGES_DIR, `${item.key}-420.webp`));
  }
  return { width: 548, height: 730 };
}

async function processHeroImages() {
  const master4kPath = path.join(RAW_DIR, 'images_habitat_villas_master_4k.png');
  const mobile4kPath = path.join(RAW_DIR, 'images_habitat_villas_mobile_4k.png');
  const widePath = path.join(RAW_DIR, 'images_habitat_villas_v3_wide.jpg');
  const uploadedV3Path = path.join(RAW_DIR, 'images_habitat_villas_uploaded_v3.jpg');

  const desktopSrcPath = fs.existsSync(master4kPath) ? master4kPath : widePath;
  const mobileSrcPath = fs.existsSync(mobile4kPath) ? mobile4kPath : uploadedV3Path;

  if (!fs.existsSync(desktopSrcPath)) {
    throw new Error(`Missing 4K hero desktop source in ${RAW_DIR}`);
  }
  if (!fs.existsSync(mobileSrcPath)) {
    throw new Error(`Missing 4K hero mobile source in ${RAW_DIR}`);
  }

  const staleFiles = [
    'hero-habitat-1280.webp',
    'hero-habitat-1920.webp',
    'hero-habitat-1920.jpg',
    'hero-habitat-2188.webp',
    'hero-habitat-mobile-720.webp',
    'hero-habitat-mobile-1080.webp',
    'hero-habitat-mobile-1080.jpg',
  ];
  for (const stale of staleFiles) {
    const stalePath = path.join(OUT_IMAGES_DIR, stale);
    if (fs.existsSync(stalePath)) {
      fs.unlinkSync(stalePath);
    }
  }

  const desktopBuffer = await sharp(desktopSrcPath)
    .flatten({ background: '#111111' })
    .resize(3840, 2160, { fit: 'cover', kernel: sharp.kernel.lanczos3 })
    .png()
    .toBuffer();

  const desktopBase = sharp(desktopBuffer);

  // Desktop 4K UHD (16:9) variants
  await desktopBase
    .clone()
    .sharpen({ sigma: 0.55, m1: 0.7, m2: 1.25 })
    .webp({ quality: 92 })
    .toFile(path.join(OUT_IMAGES_DIR, 'hero-habitat-v3-4k-3840.webp'));

  await desktopBase
    .clone()
    .resize(2560, 1440, { fit: 'cover', kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 0.55, m1: 0.7, m2: 1.25 })
    .webp({ quality: 92 })
    .toFile(path.join(OUT_IMAGES_DIR, 'hero-habitat-v3-4k-2560.webp'));

  await desktopBase
    .clone()
    .resize(1920, 1080, { fit: 'cover', kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 0.58, m1: 0.72, m2: 1.3 })
    .webp({ quality: 92 })
    .toFile(path.join(OUT_IMAGES_DIR, 'hero-habitat-v3-4k-1920.webp'));

  await desktopBase
    .clone()
    .resize(1920, 1080, { fit: 'cover', kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 0.58, m1: 0.72, m2: 1.3 })
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(path.join(OUT_IMAGES_DIR, 'hero-habitat-v3-4k-1920.jpg'));

  // Mobile 3:4 portrait variants directly from native uploaded v3 master
  const mobileBuffer = await sharp(mobileSrcPath)
    .flatten({ background: '#111111' })
    .resize(1440, 1920, { fit: 'cover', kernel: sharp.kernel.lanczos3 })
    .png()
    .toBuffer();

  const mobileBase = sharp(mobileBuffer);

  await mobileBase
    .clone()
    .sharpen({ sigma: 0.55, m1: 0.7, m2: 1.25 })
    .webp({ quality: 92 })
    .toFile(path.join(OUT_IMAGES_DIR, 'hero-habitat-v3-mobile-1440.webp'));

  await mobileBase
    .clone()
    .resize(1080, 1440, { fit: 'cover', kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 0.58, m1: 0.72, m2: 1.3 })
    .webp({ quality: 92 })
    .toFile(path.join(OUT_IMAGES_DIR, 'hero-habitat-v3-mobile-1080.webp'));

  await mobileBase
    .clone()
    .resize(1080, 1440, { fit: 'cover', kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 0.58, m1: 0.72, m2: 1.3 })
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(path.join(OUT_IMAGES_DIR, 'hero-habitat-v3-mobile-1080.jpg'));

  return {
    heroDesktop: { width: 3840, height: 2160 },
    heroMobile: { width: 1440, height: 1920 },
  };
}

async function main() {
  const logoDims = await processLogo();
  const heroDims = await processHeroImages();
  const institutionalDims = await processInstitutionalImage();
  const projectDims = await processProjectImages();

  const manifestTs = `// Archivo generado automáticamente por scripts/prepare-assets.mjs
export const ASSET_DIMENSIONS = {
  logo: { width: ${logoDims.width}, height: ${logoDims.height} },
  heroDesktop: { width: ${heroDims.heroDesktop.width}, height: ${heroDims.heroDesktop.height} },
  heroMobile: { width: ${heroDims.heroMobile.width}, height: ${heroDims.heroMobile.height} },
  institutional: { width: ${institutionalDims.width}, height: ${institutionalDims.height} },
  projectPlate: { width: ${projectDims.width}, height: ${projectDims.height} },
} as const;
`;
  fs.writeFileSync(path.join(ROOT_DIR, 'src/data/assetManifest.ts'), manifestTs, 'utf8');
  console.log('[prepare-assets] Assets generated successfully:', {
    logoDims,
    heroDims,
    institutionalDims,
    projectDims,
    totalProjectSets: PROJECT_IMAGES.length,
  });
}

main().catch((err) => {
  console.error('[prepare-assets] Error:', err);
  process.exit(1);
});
