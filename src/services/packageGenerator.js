import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const A4 = [595.28, 841.89];

function safeText(str) {
  return (str || '')
    .split('')
    .map((ch) => (ch.charCodeAt(0) < 256 ? ch : '?'))
    .join('');
}

async function drawCover(doc, { tenderId, rows, generatedAt }) {
  const page = doc.addPage(A4);
  const { width, height } = page.getSize();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  page.drawRectangle({
    x: 0,
    y: height - 160,
    width,
    height: 160,
    color: rgb(0.145, 0.388, 0.922),
  });

  page.drawText('TENDER DOCUMENT PACKAGE', {
    x: 50,
    y: height - 95,
    size: 24,
    font: bold,
    color: rgb(1, 1, 1),
  });

  page.drawText('Documents submitted in response to tender', {
    x: 50,
    y: height - 122,
    size: 12,
    font,
    color: rgb(0.86, 0.91, 0.99),
  });

  let y = height - 210;
  page.drawText('Tender ID:', { x: 50, y, size: 12, font: bold, color: rgb(0.2, 0.25, 0.35) });
  page.drawText(safeText(tenderId || '-'), { x: 140, y, size: 12, font, color: rgb(0.1, 0.15, 0.25) });

  y -= 24;
  page.drawText('Generated on:', { x: 50, y, size: 12, font: bold, color: rgb(0.2, 0.25, 0.35) });
  page.drawText(generatedAt, { x: 140, y, size: 12, font, color: rgb(0.1, 0.15, 0.25) });

  y -= 48;
  page.drawText('DOCUMENT INDEX', { x: 50, y, size: 14, font: bold, color: rgb(0.1, 0.15, 0.25) });
  y -= 26;

  rows.forEach((row, i) => {
    const label = `${i + 1}. ${safeText(row.doc.title_en || row.doc.id)}`;
    page.drawText(label, { x: 60, y, size: 11, font, color: rgb(0.15, 0.2, 0.3) });
    const pagesLabel = `${row.upload.pageCount} page(s)`;
    page.drawText(pagesLabel, {
      x: width - 50 - font.widthOfTextAtSize(pagesLabel, 11),
      y,
      size: 11,
      font,
      color: rgb(0.4, 0.45, 0.55),
    });
    y -= 20;
    if (y < 80) y = 80;
  });
}

export async function generatePackage({ tenderId, rows, t }) {
  const usable = rows.filter((r) => r.upload && !r.upload.parseError);

  if (usable.length === 0) {
    throw new Error('No documents available to include');
  }

  const main = await PDFDocument.create();

  const coverDoc = await PDFDocument.create();
  await drawCover(coverDoc, {
    tenderId,
    rows: usable,
    generatedAt: new Date().toISOString().slice(0, 10),
  });
  const [coverPage] = await main.copyPages(coverDoc, [0]);
  main.addPage(coverPage);

  for (const row of usable) {
    const src = await PDFDocument.load(row.upload.bytes, {
      ignoreEncryption: true,
    });
    const copied = await main.copyPages(src, src.getPageIndices());
    for (const p of copied) main.addPage(p);
  }

  const font = await main.embedFont(StandardFonts.Helvetica);
  const total = main.getPageCount();
  const safeId = safeText(tenderId || '-');

  main.getPages().forEach((page, i) => {
    const label = `${safeId} | Page ${i + 1} of ${total}`;
    const size = 9;
    const w = font.widthOfTextAtSize(label, size);
    page.drawText(label, {
      x: (page.getWidth() - w) / 2,
      y: 22,
      size,
      font,
      color: rgb(0.35, 0.4, 0.48),
    });
  });

  const bytes = await main.save();
  return { bytes, pageCount: total, docCount: usable.length };
}

export function downloadPdf(bytes, fileName) {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
