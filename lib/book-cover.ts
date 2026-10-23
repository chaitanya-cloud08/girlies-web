function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(" ");
  let line = "";
  const lines: string[] = [];
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  const startY = y - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((l, i) => ctx.fillText(l, x, startY + i * lineHeight));
}

export function downloadBookCover(opts: { title: string; tagline: string; glyph: string; color: string; nickname: string }) {
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 1200;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const grad = ctx.createLinearGradient(0, 0, 800, 1200);
  grad.addColorStop(0, opts.color);
  grad.addColorStop(1, "#2a2026");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 800, 1200);

  ctx.strokeStyle = "rgba(255,255,255,0.5)";
  ctx.lineWidth = 3;
  ctx.strokeRect(40, 40, 720, 1120);

  ctx.textAlign = "center";
  ctx.font = "160px serif";
  ctx.fillStyle = "#fff";
  ctx.fillText(opts.glyph, 400, 320);

  ctx.font = "bold 58px Georgia, serif";
  ctx.fillStyle = "#fff";
  wrapText(ctx, opts.title, 400, 470, 620, 66);

  ctx.font = "italic 30px Georgia, serif";
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  wrapText(ctx, opts.tagline, 400, 630, 560, 42);

  ctx.font = "24px Georgia, serif";
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.fillText("CASE STUDY: LOVE", 400, 1050);
  ctx.font = "22px Georgia, serif";
  ctx.fillText(`starring ${opts.nickname}`, 400, 1085);

  const link = document.createElement("a");
  link.download = `case-study-love-${opts.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
