/**
 * Share utilities — generates Instagram Story images and handles sharing/download
 */

export interface StoryImageOptions {
  image: string;        // URL or data URL of the photo
  title: string;        // e.g., "Settle In and Rest"
  note?: string;        // user's journal note
  caption?: string;     // image caption
  location?: string;    // e.g., "Arrival / Atlas Mountains"
  day?: string;         // e.g., "Day 1"
  headerText?: string;  // e.g., "FDV CONCIERGE — MOROCCO 2026"
}

function safeLetterSpacing(ctx: CanvasRenderingContext2D, value: string) {
  try { (ctx as any).letterSpacing = value; } catch {}
}

export async function generateStoryImage(options: StoryImageOptions): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d')!;

  // Background — warm parchment
  ctx.fillStyle = '#faf8f5';
  ctx.fillRect(0, 0, 1080, 1920);

  // Header: "FDV CONCIERGE — MOROCCO 2026"
  ctx.fillStyle = '#2c2416';
  ctx.font = '500 24px Inter, sans-serif';
  ctx.textAlign = 'center';
  safeLetterSpacing(ctx, '0.15em');
  ctx.fillText((options.headerText || 'FDV CONCIERGE — MOROCCO 2026').toUpperCase(), 540, 120);

  // Day label
  if (options.day) {
    ctx.font = '400 20px Inter, sans-serif';
    ctx.fillStyle = '#8a7e6b';
    safeLetterSpacing(ctx, '0.1em');
    ctx.fillText(options.day.toUpperCase(), 540, 180);
  }

  // Photo — centered, large
  let textStartY = 1300; // fallback if no image
  if (options.image) {
    try {
      const img = new Image();
      // ONLY set crossOrigin for non-data URLs (data URLs don't need CORS)
      if (!options.image.startsWith('data:')) {
        img.crossOrigin = 'anonymous';
      }
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Image load failed'));
        img.src = options.image;
      });

      // Scale to fit within 900×1000 area, centered
      const maxW = 900;
      const maxH = 1000;
      const scale = Math.min(maxW / img.width, maxH / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      const x = (1080 - w) / 2;
      const y = 240;
      ctx.drawImage(img, x, y, w, h);
      textStartY = y + h + 60;
    } catch {
      // If image fails to load, just skip it
      textStartY = 300;
    }
  }

  // Title below photo
  ctx.fillStyle = '#2c2416';
  ctx.font = 'italic 500 36px Lora, Georgia, serif';
  ctx.textAlign = 'center';
  safeLetterSpacing(ctx, '0em');
  ctx.fillText(options.title || '', 540, textStartY);

  // Location
  if (options.location) {
    ctx.font = '400 22px Inter, sans-serif';
    ctx.fillStyle = '#8a7e6b';
    safeLetterSpacing(ctx, '0.05em');
    ctx.fillText(options.location, 540, textStartY + 50);
  }

  // Note/caption — word-wrapped
  const noteText = options.note || options.caption || '';
  if (noteText) {
    ctx.font = 'italic 400 28px Lora, Georgia, serif';
    ctx.fillStyle = '#2c2416';
    safeLetterSpacing(ctx, '0em');
    const words = noteText.split(' ');
    let line = '';
    let lineY = textStartY + 110;
    const maxWidth = 800;
    for (const word of words) {
      const testLine = line + (line ? ' ' : '') + word;
      if (ctx.measureText(testLine).width > maxWidth) {
        ctx.fillText(line, 540, lineY);
        line = word;
        lineY += 40;
      } else {
        line = testLine;
      }
    }
    if (line) ctx.fillText(line, 540, lineY);
  }

  // Footer — gold FIL DE VIE
  ctx.font = '400 18px Inter, sans-serif';
  ctx.fillStyle = '#c9a84c';
  ctx.textAlign = 'center';
  safeLetterSpacing(ctx, '0.2em');
  ctx.fillText('FIL DE VIE', 540, 1860);

  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to generate image — canvas may be tainted'));
      }
    }, 'image/png');
  });
}

export async function shareImage(blob: Blob, title: string): Promise<boolean> {
  const file = new File([blob], 'fdv-travel-log.png', { type: 'image/png' });

  // Only use Web Share API on mobile (touch devices)
  // macOS Safari supports navigator.share but the UX is unreliable —
  // the share sheet can flash/dismiss, causing AbortError with no fallback
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile && navigator.share && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: title,
        text: `${title} — FDV Concierge`,
      });
      return true;
    } catch (e) {
      if ((e as Error).name === 'AbortError') return false;
      // Fall through to download
    }
  }

  // Desktop: always download the file
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'fdv-travel-log.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return true;
}
