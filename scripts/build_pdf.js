// Genera docs/Growth-Video-Generator.pdf a partir de docs/0*.md (pandoc + Chromium/Playwright).
// Uso: node scripts/build_pdf.js
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..');
const docs = fs.readdirSync(path.join(ROOT, 'docs')).filter(f => /^0.*\.md$/.test(f)).sort().map(f => path.join(ROOT, 'docs', f));
const css = fs.readFileSync(path.join(ROOT, 'scripts', 'pdf.css'), 'utf8');
const body = execFileSync('pandoc', ['-f', 'gfm', '-t', 'html5', ...docs], { encoding: 'utf8' });
const today = new Date().toLocaleDateString('es-ES');
const cover = `<section class="cover"><div class="kicker">Documento de arquitectura y plan de ejecución</div>
<div class="title">Growth Video Generator</div>
<p class="subtitle">Sistema de subagentes para crear, evaluar, publicar y medir vídeo corto a escala en Instagram, LinkedIn y YouTube</p>
<p class="meta">Versión 1.0 · ${today}</p></section>`;
const toc = '<section class="toc"><h2>Índice</h2><ol>' + docs.map(d =>
  `<li>${fs.readFileSync(d, 'utf8').split('\n')[0].replace(/^#\s*\d+\.\s*/, '')}</li>`).join('') + '</ol></section>';
const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>${css}</style></head><body>${cover}${toc}<main>${body}</main></body></html>`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.setContent(html, { waitUntil: 'load' });
  await p.pdf({ path: path.join(ROOT, 'docs', 'Growth-Video-Generator.pdf'), format: 'A4', printBackground: true,
    margin: { top: '18mm', bottom: '18mm', left: '16mm', right: '16mm' }, displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: "<div style='font-size:8px;width:100%;text-align:center;color:#888'>Growth Video Generator · <span class='pageNumber'></span>/<span class='totalPages'></span></div>" });
  await b.close(); console.log('OK');
})();
