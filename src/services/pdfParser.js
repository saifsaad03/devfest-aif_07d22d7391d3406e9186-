import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export async function extractPdfInfo(file) {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer.slice(0));
  const doc = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) })
    .promise;

  let text = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((it) => it.str).join(' ') + '\n';
  }
  const pageCount = doc.numPages;
  await doc.destroy();

  return { pageCount, text, bytes };
}
