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
  lines.forEach((l, i) => ctx.fillText(l, x, y + i * lineHeight));
}

export function downloadCertificate(opts: { nickname: string; title: string; color: string; score: number; badge: boolean }) {
  const canvas = document.createElement("canvas");
  canvas.width = 1000;
  canvas.height = 720;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = "#fffdf8";
  ctx.fillRect(0, 0, 1000, 720);

  ctx.strokeStyle = opts.color;
  ctx.lineWidth = 6;
  ctx.strokeRect(24, 24, 952, 672);
  ctx.strokeStyle = "#D2A548";
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, 920, 640);

  ctx.textAlign = "center";
  ctx.fillStyle = opts.color;
  ctx.font = "26px Georgia, serif";
  ctx.fillText("CERTIFICATE OF ICONIC SURVIVAL", 500, 130);

  ctx.font = "bold 56px Georgia, serif";
  ctx.fillStyle = "#1a1a1a";
  ctx.fillText(opts.title, 500, 220);

  ctx.font = "italic 26px Georgia, serif";
  ctx.fillStyle = "#444";
  wrapText(ctx, `This certifies that ${opts.nickname} ran a full ER, stayed completely unbothered, and cleared every shift.`, 500, 300, 700, 38);

  ctx.font = "22px Georgia, serif";
  ctx.fillStyle = opts.color;
  ctx.fillText(`Final score: ${opts.score}${opts.badge ? "  ·  🥇 Gold Stethoscope Badge" : ""}`, 500, 440);

  ctx.font = "20px Georgia, serif";
  ctx.fillStyle = "#777";
  ctx.fillText(new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }), 500, 480);

  ctx.font = "italic 28px Georgia, serif";
  ctx.fillStyle = "#1a1a1a";
  ctx.fillText("signed: Chaitanya 🌸", 500, 600);

  const link = document.createElement("a");
  link.download = `${opts.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-certificate.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
