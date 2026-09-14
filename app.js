import { repositoryIds, validateSnapshot, totalDownloads } from './stats.js';
const paths = {
  arrow: '<path d="M4 12h15m-5-5 5 5-5 5"/>',
  external: '<path d="M14 4h6v6m0-6L10 14M10 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5"/>',
  database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v7c0 4 16 4 16 0V5M4 12v7c0 4 16 4 16 0v-7"/>',
  paper: '<path d="M6 3h8l4 4v14H6zM14 3v5h4M9 12h6M9 16h6"/>',
  layers: '<path d="m12 3 10 6-10 6L2 9zm-10 11 10 6 10-6M2 18l10 6 10-6" transform="translate(0 -1) scale(1 .92)"/>',
  scan: '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m8 0h5v-5M7 7h10v10H7z"/>',
  chat: '<path d="M4 4h16v12H9l-5 4zM8 8h8M8 12h5"/>',
  galaxy: '<ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-40 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(40 12 12)"/><circle cx="12" cy="12" r="1"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
  link: '<path d="m10 7 2-2a5 5 0 0 1 7 7l-2 2M14 17l-2 2a5 5 0 0 1-7-7l2-2m2 5 6-6"/>',
  refresh: '<path d="M20 11a8 8 0 0 0-14-5L3 9m0-6v6h6M4 13a8 8 0 0 0 14 5l3-3m-6 0h6v6"/>',
  copy: '<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M15 8V3H3v13h5"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  zoom: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6M7 10h6m-3-3v6"/>',
  github: '<path d="M9 20c-5 2-5-3-7-3m14 5v-4c0-1-.4-2-1-2 3-.4 6-1.5 6-6a5 5 0 0 0-1.5-3.5A5 5 0 0 0 19 3s-1 0-3.5 1.5a13 13 0 0 0-7 0C6 3 5 3 5 3a5 5 0 0 0-.5 3.5A5 5 0 0 0 3 10c0 4.5 3 5.6 6 6-.6.4-1 1-1 2v4"/>'
};
const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.arrow}</svg>`;
function hydrateIcons(root = document) { root.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); }); }
hydrateIcons();
const menu = document.querySelector('.menu-button');
const nav = document.querySelector('#navigation');
menu.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? '关闭导航' : '打开导航'); });
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', '打开导航'); }));
document.addEventListener('keydown', e => { if (e.key === 'Escape') { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); } });
const observer = new IntersectionObserver(entries => { for (const entry of entries) if (entry.isIntersecting) nav.querySelectorAll('a').forEach(a => a.classList.toggle('active', a.hash === '#' + entry.target.id)); }, { rootMargin: '-15% 0px -60% 0px' });
['overview', 'updates', 'datasets', 'explore', 'research'].forEach(id => observer.observe(document.getElementById(id)));

let snapshot;
const period = 'downloadsAllTime';
const format = value => new Intl.NumberFormat('en-US').format(value);
const repoNames = ['ChartGalaxy', 'DAD', 'InfoDet', 'InfoChartQA'];
const colors = ['#517848', '#c4aa66', '#799abb', '#ae94b5'];
function renderStats() {
  if (!snapshot) return;
  const total = totalDownloads(snapshot, period);
  const maximum = Math.max(...snapshot.repositories.map(r => r[period]), 1);
  document.querySelector('#download-total').innerHTML = `${format(total)}<span>次</span>`;
  document.querySelector('#total-label').textContent = '4 个仓库 · 历史累计下载';
  document.querySelector('#download-rows').innerHTML = repositoryIds.map((id, i) => {
    const row = snapshot.repositories.find(r => r.id === id);
    return `<div class="download-row" style="--bar-color:${colors[i]}"><div class="download-row-heading"><a href="https://huggingface.co/datasets/${id}" target="_blank" rel="noopener noreferrer"><span class="repo-dot"></span>${repoNames[i]}</a><strong>${format(row[period])}</strong></div><div class="download-bar" aria-hidden="true"><span style="width:${row[period] / maximum * 100}%"></span></div></div>`;
  }).join('');
  document.querySelector('#stats-date').textContent = `快照 · ${new Date(snapshot.fetchedAt).toISOString().slice(0, 16).replace('T', ' ')} UTC`;
}
try {
  const response = await fetch('./data/downloads.json');
  if (!response.ok) throw new Error('Snapshot unavailable');
  snapshot = validateSnapshot(await response.json());
  renderStats();
} catch { document.querySelector('#stats-status').textContent = '统计快照暂时无法读取。可点击刷新重试，或访问各数据集官方页面。'; }
document.querySelector('#refresh-stats').addEventListener('click', async event => {
  const button = event.currentTarget;
  button.disabled = true;
  const status = document.querySelector('#stats-status');
  status.textContent = '正在查询 4 个官方仓库的最新统计…';
  try {
    const repositories = await Promise.all(repositoryIds.map(async id => {
      const response = await fetch(`https://huggingface.co/api/datasets/${id}?expand[]=downloads&expand[]=downloadsAllTime`, { signal: AbortSignal.timeout(15000) });
      if (!response.ok) throw new Error('Request failed');
      const data = await response.json();
      return { id, downloads: data.downloads, downloadsAllTime: data.downloadsAllTime };
    }));
    snapshot = validateSnapshot({ fetchedAt: new Date().toISOString(), repositories });
    renderStats();
    status.textContent = '已同步 4 个仓库。合计为仓库下载次数，不代表去重用户数。';
  } catch { status.textContent = snapshot ? '暂时无法连接 Hugging Face，已保留上方标注时间的完整快照，请稍后重试。' : '暂时无法连接 Hugging Face，请稍后重试或访问官方仓库。'; }
  finally { button.disabled = false; }
});

const galleryGrid = document.querySelector('#example-grid');
const galleryStatus = document.querySelector('#gallery-status');
const galleryPlane = galleryGrid.querySelector('.gallery-plane');
const galleryDialog = document.querySelector('#gallery-dialog');
let galleryItems = [];
let activeExampleId = null;
let detailRequest = 0;
let detailController;
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
function renderGallery() {
  const matches = galleryItems;
  galleryPlane.innerHTML = matches.map(item => `<button class="example-card" data-example-id="${item.id}" aria-label="查看 ${escapeHTML(item.title)} 的图表与配套数据"><span class="example-image"><img src="${item.thumbnail}" alt="${escapeHTML(item.title)} · ${escapeHTML(item.chartType)}" loading="lazy" decoding="async" width="${item.thumbnailWidth}" height="${item.thumbnailHeight}" /><span class="example-caption"><span class="example-type">${escapeHTML(item.chartType)} · #${String(item.id).padStart(2, '0')}</span><strong>${escapeHTML(item.title)}</strong><span class="example-meta">${item.rowCount} 条数据 · ${item.columnCount} 个字段</span><span class="example-open">${icon('zoom')}查看详情</span></span></span></button>`).join('');
  layoutGallery();
}

// Fit all 24 examples into the full-width gallery, keeping every edge tile accessible.
function layoutGallery() {
  const cards = [...galleryPlane.children];
  const available = galleryGrid.clientWidth;
  if (!cards.length || !available) return;
  const compact = window.matchMedia('(max-width: 640px)').matches;
  const columns = Math.min(cards.length, compact ? 3 : 6);
  const rows = Math.ceil(cards.length / columns);
  const angle = -7;
  const flatten = .92;
  const radians = Math.abs(angle) * Math.PI / 180;
  const unitWidth = columns + (rows > 1 ? .5 : 0);
  const unitHeight = (1 + (rows - 1) * .75) / Math.cos(Math.PI / 6);
  const rotatedWidth = unitWidth * Math.cos(radians) + unitHeight * flatten * Math.sin(radians);
  const tileWidth = Math.min(250, (available - 20) / rotatedWidth);
  const tileHeight = tileWidth / Math.cos(Math.PI / 6);
  const wallWidth = unitWidth * tileWidth;
  const wallHeight = unitHeight * tileWidth;
  const rotatedHeight = wallWidth * Math.sin(radians) + wallHeight * flatten * Math.cos(radians);
  galleryGrid.style.height = `${Math.ceil(rotatedHeight + 32)}px`;
  galleryPlane.style.width = `${wallWidth}px`;
  galleryPlane.style.height = `${wallHeight}px`;
  galleryPlane.style.setProperty('--wall-angle', `${angle}deg`);
  galleryPlane.style.setProperty('--wall-flatten', flatten);
  cards.forEach((card, index) => {
    const row = Math.floor(index / columns);
    card.style.width = `${tileWidth}px`;
    card.style.height = `${tileHeight}px`;
    card.style.left = `${(index % columns + (row % 2) * .5) * tileWidth}px`;
    card.style.top = `${row * tileHeight * .75}px`;
  });
}
new ResizeObserver(layoutGallery).observe(galleryGrid);
function setDetailTab(tab) {
  document.querySelectorAll('[data-detail-tab]').forEach(button => {
    const selected = button.dataset.detailTab === tab;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-selected', String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  document.querySelector('#image-panel').hidden = tab !== 'image';
  document.querySelector('#data-panel').hidden = tab !== 'data';
}
const detailTabs = [...document.querySelectorAll('[data-detail-tab]')];
detailTabs.forEach((button, index) => {
  button.addEventListener('click', () => setDetailTab(button.dataset.detailTab));
  button.addEventListener('keydown', event => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const target = event.key === 'Home' ? 0 : event.key === 'End' ? detailTabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + detailTabs.length) % detailTabs.length;
    setDetailTab(detailTabs[target].dataset.detailTab);
    detailTabs[target].focus();
  });
});
async function openGalleryExample(id) {
  const item = galleryItems.find(item => item.id === id);
  if (!item) return;
  activeExampleId = id;
  const request = ++detailRequest;
  detailController?.abort();
  detailController = new AbortController();
  const image = document.querySelector('#gallery-detail-image');
  image.src = item.image;
  image.alt = `${item.title}，ChartGalaxy 官方样例`;
  document.querySelector('#gallery-title').textContent = item.title;
  document.querySelector('#gallery-detail-label').textContent = `${item.chartType} · ${item.rowCount} 条数据 · ${item.columnCount} 个字段`;
  document.querySelector('#gallery-image-source').href = item.imageSource;
  document.querySelector('#gallery-json').href = item.dataSource;
  const note = document.querySelector('#data-detail-note');
  const table = document.querySelector('#example-data-table');
  note.textContent = '正在读取官方配套数据…';
  table.replaceChildren();
  setDetailTab('image');
  const matches = galleryItems;
  const index = matches.findIndex(item => item.id === id);
  document.querySelector('#gallery-position').textContent = `${index + 1} / ${matches.length}`;
  document.querySelector('#example-previous').disabled = index <= 0;
  document.querySelector('#example-next').disabled = index >= matches.length - 1;
  if (!galleryDialog.open) galleryDialog.showModal();
  try {
    const response = await fetch(item.dataFile, { signal: detailController.signal });
    if (!response.ok) throw new Error('Data unavailable');
    const raw = await response.json();
    if (request !== detailRequest) return;
    const data = item.dataKey ? raw.chart_data?.[item.dataKey] : raw;
    if (!Array.isArray(data?.data) || !Array.isArray(data?.columns) || !data.columns.every(c => typeof c.name === 'string')) throw new Error('Unsupported data');
    const columns = data.columns;
    table.innerHTML = `<caption>${escapeHTML(item.title)} · 配套数据</caption><thead><tr>${columns.map(c => `<th scope="col">${escapeHTML(c.name)}<small>${escapeHTML(c.type)}</small></th>`).join('')}</tr></thead><tbody>${data.data.map(row => `<tr>${columns.map(c => `<td>${row[c.name] == null ? '—' : escapeHTML(typeof row[c.name] === 'object' ? JSON.stringify(row[c.name]) : row[c.name])}</td>`).join('')}</tr>`).join('')}</tbody>`;
    note.textContent = `${data.data.length} 条数据 · 保留官方字段与数值。${item.dataKey ? `本样例取自原始汇总文件中的 ${item.dataKey}。` : ''}${data.data.some(row => columns.some(c => row[c.name] == null)) ? '— 表示原文件中的空值。' : ''}`;
  } catch (error) {
    if (request === detailRequest && error.name !== 'AbortError') note.textContent = '配套数据暂时无法读取，请使用下方链接查看官方原始 JSON。';
  }
}
galleryGrid.addEventListener('click', event => {
  const card = event.target.closest('[data-example-id]');
  if (card) openGalleryExample(Number(card.dataset.exampleId));
});
function stepExample(offset) {
  const matches = galleryItems;
  const next = matches[matches.findIndex(item => item.id === activeExampleId) + offset];
  if (next) openGalleryExample(next.id);
}
document.querySelector('#example-previous').addEventListener('click', () => stepExample(-1));
document.querySelector('#example-next').addEventListener('click', () => stepExample(1));
galleryDialog.addEventListener('close', () => { detailRequest++; detailController?.abort(); });
try {
  const response = await fetch('./data/gallery.json');
  if (!response.ok) throw new Error('Gallery unavailable');
  const data = await response.json();
  if (!Array.isArray(data.items) || !data.items.every(item => Number.isInteger(item.id) && item.id > 0 && item.id <= 24)) throw new Error('Invalid gallery');
  galleryItems = data.items;
  renderGallery();
} catch {
  galleryStatus.hidden = false;
  galleryStatus.innerHTML = '样例暂时无法加载。<a href="https://github.com/ChartGalaxy/ChartGalaxy/tree/main/examples" target="_blank" rel="noopener noreferrer">查看官方图表示例 ↗</a>';
}

const citations = await fetch('./data/citations.json').then(r => { if (!r.ok) throw new Error('Unavailable'); return r.json(); }).catch(() => null);
document.querySelectorAll('[data-cite]').forEach(button => button.addEventListener('click', () => {
  if (!citations) { window.open(button.closest('.paper').querySelector('h4 a').href, '_blank', 'noopener'); return; }
  const key = button.dataset.cite;
  document.querySelector('#citation-title').textContent = `${({ galaxy: 'ChartGalaxy', det: 'InfoDet', qa: 'InfoChartQA' })[key]} · BibTeX`;
  document.querySelector('#citation-text').textContent = citations[key];
  document.querySelector('#copy-status').textContent = '';
  document.querySelector('#citation-dialog').showModal();
}));
document.querySelector('#copy-citation').addEventListener('click', async () => {
  const code = document.querySelector('#citation-text');
  try { await navigator.clipboard.writeText(code.textContent); document.querySelector('#copy-status').textContent = '已复制，可粘贴到论文引用文件。'; }
  catch { const range = document.createRange(); range.selectNodeContents(code); const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); document.querySelector('#copy-status').textContent = '已选中引用，请按 Ctrl+C（Mac 为 ⌘C）复制。'; }
});
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
});
