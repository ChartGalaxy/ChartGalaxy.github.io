// Chinese/English switching. Chinese static text lives in index.html and is captured
// from the DOM on first use; English static text and all script messages live here.
const STORAGE_KEY = 'cg-lang';
const languages = ['zh', 'en'];

const staticEn = {
  'meta.title': 'ChartGalaxy Series · Infographic Chart Datasets and Benchmarks',
  'meta.description': 'The ChartGalaxy series: large-scale datasets and a benchmark for infographic chart understanding and generation, including the foundation dataset ChartGalaxy, the annotation datasets ChartGalaxy++, DAD and InfoDet, and the benchmark InfoChartQA.',
  'skip': 'Skip to main content',
  'brand.home': 'ChartGalaxy series home',
  'brand.logo': 'Official ChartGalaxy logo',
  'brand.name': 'ChartGalaxy <b>Series</b>',
  'nav.label': 'Main navigation',
  'nav.overview': 'Overview',
  'nav.news': 'News <i class="nav-news-dot"></i>',
  'nav.datasets': 'Datasets',
  'nav.explore': 'Examples',
  'nav.research': 'Papers',
  'hero.announcement': '<span class="status-dot"></span>Released Nov 2026 <span>New ChartGalaxy++ scene-graph dataset</span><span data-icon="arrow"></span>',
  'hero.title': 'ChartGalaxy <span>Series</span>',
  'hero.subtitle': 'Large-scale datasets and benchmarks for infographic chart understanding and generation',
  'hero.description': 'From charts and their data, to elements, layers and scene graphs, to multimodal question answering. <br />Three complementary parts offer open data for graphic intelligence and design automation.',
  'hero.browse': 'Browse examples <span data-icon="arrow"></span>',
  'hero.papers': '<span data-icon="paper"></span>Papers',
  'metrics.label': 'Dataset scale',
  'metrics.galaxy': '1.88<span>M+</span>',
  'metrics.galaxy.label': 'ChartGalaxy infographic charts',
  'metrics.pp': '39.99<span>M</span>',
  'metrics.pp.label': 'ChartGalaxy++ scene-graph relations',
  'metrics.det': '14.22<span>M+</span>',
  'metrics.det.label': 'InfoDet element-level annotations',
  'metrics.qa.label': 'InfoChartQA question-answer pairs',
  'gallery.label': 'ChartGalaxy chart examples',
  'news.title': 'News<i class="status-dot"></i>',
  'news.changelog': 'Official changelog <span data-icon="external"></span>',
  'news.latest': 'New release',
  'news.expansion': 'Data expansion',
  'news.quality': 'Quality update',
  'news.1.title': '<strong>ChartGalaxy++</strong> dataset released',
  'news.1.text': '217,195 charts paired with scene-graph nodes and hierarchical and spatial relation annotations.',
  'news.2.title': '<strong>14,809</strong> infographic charts added',
  'news.2.text': 'More complex layouts and richer visual variants.',
  'news.3.title': '<strong>108,208</strong> infographic charts added',
  'news.3.text': 'More varied title designs, with improved overall layout and readability.',
  'news.4.title': '<strong>19,458</strong> infographic charts added',
  'news.4.text': 'Greater design diversity, with ambiguous layouts fixed.',
  'datasets.title': 'Three parts, unifying understanding and generation<span class="green-dot">.</span>',
  'datasets.note': '5 datasets · Click a row to open it on Hugging Face ↗',
  'group.foundation': 'Foundation dataset',
  'group.foundation.text': 'Charts and their data',
  'group.annotations': 'Annotation datasets',
  'group.annotations.text': 'Elements, layers, scene graphs',
  'group.benchmark': 'Benchmark',
  'group.benchmark.text': 'Multimodal reasoning',
  'resource.galaxy': 'Chart images paired with data tables, supporting infographic chart understanding, chart-to-code conversion and generation.<span>1,880,687 charts · 75 chart types · 440 variants · 68 layout templates</span>',
  'resource.pp': 'Scene graphs link visual elements to semantic groups and make hierarchical membership and spatial relations explicit, supporting structure prediction, question answering and structural evaluation of generated charts.<span>217,195 charts (56,744 real + 160,451 synthetic) · 18.90M nodes · 39.99M relations</span>',
  'resource.dad': 'Separate RGBA layers with element bounding boxes and types, supporting element replacement and editable design.<span>1,100,666 layered samples · 1,000,683 element-replacement designs + 99,983 layered charts</span>',
  'resource.det': 'Localization annotations for charts, text and recognizable visual objects, supporting detection and layout understanding.<span>101,264 infographic charts · 14,227,680 element-level bounding boxes</span>',
  'resource.qa': 'Evaluates how well large models understand infographic charts through text, visual-element and visual-metaphor questions.<span>58,857 questions · 50,920 text + 7,475 basic visual + 462 visual metaphor</span>',
  'downloads.title': 'ChartGalaxy Series Downloads',
  'downloads.method': 'Hugging Face download statistics method <span data-icon="external"></span>',
  'downloads.byDataset': 'All-time downloads by dataset',
  'downloads.refresh': '<span data-icon="refresh"></span>Refresh',
  'downloads.totalLabel': '5 repositories · All-time downloads',
  'downloads.loading': 'Loading snapshot…',
  'research.title': 'Papers<span class="green-dot">.</span>',
  'research.note': '5 papers · Full text and BibTeX',
  'research.cite': '<span data-icon="copy"></span>Cite (BibTeX)',
  'footer.contact': 'Contact us ↗',
  'footer.top': 'Back to top ↑',
  'sources.summary': 'Data sources and usage notes',
  'sources.1': 'Scale and task descriptions come from each dataset’s official dataset card. Download counts use the downloadsAllTime (all-time cumulative) field of the Hugging Face API and cover only the 5 repositories on this page. If a refresh fails, the complete dated snapshot is kept. Repository downloads are not unique users, and resource sizes are not deduplicated image totals.',
  'sources.2': 'The 18,897,483 scene-graph nodes and 39,989,150 relation records of ChartGalaxy++ correspond to 217,195 infographic charts; the 14,227,680 bounding-box annotations of InfoDet correspond to 101,264 infographic charts. The chart collections of ChartGalaxy++ and DAD are both derived in part from ChartGalaxy, so neither should be added to the foundation data.',
  'sources.3': 'The license of each repository takes precedence. ChartGalaxy metadata lists CC BY-NC 4.0 while its text mentions Apache 2.0, so please confirm which applies to data and code before use. The scene-graph annotations contributed by ChartGalaxy++ are released under CC BY-NC 4.0 (third-party chart content keeps its original rights). InfoDet lists CC BY-NC 4.0, InfoChartQA lists CC BY 4.0, and DAD uses per-source licensing (see LICENSE.md in its repository).',
  'sources.4': 'The chart examples on this page and their JSON files come from the <a href="https://github.com/ChartGalaxy/ChartGalaxy/tree/main/examples" target="_blank" rel="noopener noreferrer">official examples directory</a>; the logo is the <a href="https://github.com/ChartGalaxy/ChartGalaxy/raw/main/assets/logo.png" target="_blank" rel="noopener noreferrer">official logo.png</a>.',
  'sources.json': 'Download statistics snapshot (JSON) ↗',
  'footer.copy': '© 2026 ChartGalaxy Series · Open data for visual intelligence.',
  'gallery.close': 'Close chart details',
  'gallery.tabs': 'Example view',
  'gallery.tab.image': 'Chart',
  'gallery.tab.data': 'Data',
  'gallery.table': 'Example data table',
  'gallery.json': 'View the official raw JSON ↗',
  'gallery.source': 'Original image on GitHub <span data-icon="external"></span>',
  'gallery.previous': 'Previous example',
  'gallery.next': 'Next example',
  'citation.close': 'Close citation',
  'citation.title': 'Citation',
  'citation.copy': '<span data-icon="copy"></span>Copy BibTeX',
  'lang.toggle': '中文',
  'lang.toggle.label': '切换到中文'
};

const messages = {
  zh: {
    'lang.toggle': 'EN',
    'lang.toggle.label': 'Switch to English',
    menuOpen: '打开导航',
    menuClose: '关闭导航',
    downloadUnit: '<span>次</span>',
    totalLabel: '5 个仓库 · 历史累计下载',
    snapshot: date => `快照 · ${date} 北京时间（UTC+8）`,
    statsDefault: '来源：Hugging Face API。合计为 5 个仓库的下载次数，不代表去重用户数。',
    snapshotUnavailable: '快照暂不可用',
    statsUnavailable: '统计快照暂时无法读取。可点击刷新重试，或访问各数据集官方页面。',
    statsQuerying: '正在查询 5 个官方仓库的最新统计…',
    statsSynced: '已同步 5 个仓库。合计为仓库下载次数，不代表去重用户数。',
    statsFailKept: '暂时无法连接 Hugging Face，已保留上方标注时间的完整快照，请稍后重试。',
    statsFail: '暂时无法连接 Hugging Face，请稍后重试或访问官方仓库。',
    cardLabel: title => `查看 ${title} 的图表与配套数据`,
    rowsFields: (rows, columns) => `${rows} 条数据 · ${columns} 个字段`,
    viewDetails: '查看详情',
    exampleAlt: title => `${title}，ChartGalaxy 官方样例`,
    dataLoading: '正在读取官方配套数据…',
    dataCaption: title => `${title} · 配套数据`,
    dataNote: (rows, key, hasNull) => `${rows} 条数据 · 保留官方字段与数值。${key ? `本样例取自原始汇总文件中的 ${key}。` : ''}${hasNull ? '— 表示原文件中的空值。' : ''}`,
    dataFail: '配套数据暂时无法读取，请使用下方链接查看官方原始 JSON。',
    galleryFail: '样例暂时无法加载。<a href="https://github.com/ChartGalaxy/ChartGalaxy/tree/main/examples" target="_blank" rel="noopener noreferrer">查看官方图表示例 ↗</a>',
    copied: '已复制，可粘贴到论文引用文件。',
    selectToCopy: '已选中引用，请按 Ctrl+C（Mac 为 ⌘C）复制。'
  },
  en: {
    menuOpen: 'Open navigation',
    menuClose: 'Close navigation',
    downloadUnit: '',
    totalLabel: '5 repositories · All-time downloads',
    snapshot: date => `Snapshot · ${date} Beijing time (UTC+8)`,
    statsDefault: 'Source: Hugging Face API. The total counts repository downloads across 5 repositories, not unique users.',
    snapshotUnavailable: 'Snapshot unavailable',
    statsUnavailable: 'The statistics snapshot is temporarily unavailable. Click Refresh to try again, or visit the official dataset pages.',
    statsQuerying: 'Fetching the latest statistics for the 5 official repositories…',
    statsSynced: 'All 5 repositories synced. The total counts repository downloads, not unique users.',
    statsFailKept: 'Could not reach Hugging Face. The complete snapshot dated above is kept; please try again later.',
    statsFail: 'Could not reach Hugging Face. Please try again later or visit the official repositories.',
    cardLabel: title => `View the chart and data for ${title}`,
    rowsFields: (rows, columns) => `${rows} ${rows === 1 ? 'row' : 'rows'} · ${columns} ${columns === 1 ? 'field' : 'fields'}`,
    viewDetails: 'View details',
    exampleAlt: title => `${title}, an official ChartGalaxy example`,
    dataLoading: 'Loading the official data…',
    dataCaption: title => `${title} · Data`,
    dataNote: (rows, key, hasNull) => `${rows} ${rows === 1 ? 'row' : 'rows'} · Official fields and values are kept as published.${key ? ` This example is taken from ${key} in the original combined file.` : ''}${hasNull ? ' — marks a null value in the original file.' : ''}`,
    dataFail: 'The data is temporarily unavailable. Use the link below to view the official raw JSON.',
    galleryFail: 'Examples could not be loaded. <a href="https://github.com/ChartGalaxy/ChartGalaxy/tree/main/examples" target="_blank" rel="noopener noreferrer">View the official chart examples ↗</a>',
    copied: 'Copied. You can paste it into your bibliography file.',
    selectToCopy: 'Citation selected. Press Ctrl+C (⌘C on Mac) to copy.'
  }
};

const zhStatic = new Map();
const zhAttributes = new WeakMap();
const listeners = [];
let current = document.documentElement.dataset.lang === 'en' ? 'en' : 'zh';

export const getLang = () => current;
export function t(key, ...args) {
  const value = messages[current][key] ?? messages.zh[key];
  return typeof value === 'function' ? value(...args) : value;
}
export const localized = (item, field) => (current === 'en' && item[`${field}En`]) || item[field];
export const onLangChange = callback => listeners.push(callback);

function staticText(key, fallback) {
  if (current === 'en') return staticEn[key] ?? fallback;
  return messages.zh[key] ?? fallback;
}

// data-i18n="key" replaces innerHTML; data-i18n-attr="attr:key;attr:key" replaces attributes.
function applyStatic(afterReplace) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (!zhStatic.has(el)) zhStatic.set(el, el.innerHTML);
    const html = staticText(key, zhStatic.get(el));
    if (el.innerHTML !== html) { el.innerHTML = html; afterReplace?.(el); }
  });
  document.querySelectorAll('[data-i18n-attr]').forEach(el => {
    if (!zhAttributes.has(el)) zhAttributes.set(el, {});
    const saved = zhAttributes.get(el);
    for (const pair of el.dataset.i18nAttr.split(';')) {
      const [attr, key] = pair.split(':');
      if (!(attr in saved)) saved[attr] = el.getAttribute(attr) ?? '';
      el.setAttribute(attr, staticText(key, saved[attr]));
    }
  });
  document.documentElement.lang = current === 'en' ? 'en' : 'zh-CN';
  document.documentElement.dataset.lang = current;
  const toggle = document.querySelector('#lang-toggle');
  if (toggle) {
    toggle.textContent = current === 'en' ? staticEn['lang.toggle'] : messages.zh['lang.toggle'];
    toggle.setAttribute('aria-label', current === 'en' ? staticEn['lang.toggle.label'] : messages.zh['lang.toggle.label']);
    toggle.setAttribute('lang', current === 'en' ? 'zh-CN' : 'en');
  }
  document.documentElement.classList.remove('i18n-pending');
}

export function initI18n(afterReplace) {
  // Capture the Chinese text before anything is replaced.
  document.querySelectorAll('[data-i18n]').forEach(el => zhStatic.set(el, el.innerHTML));
  applyStatic(afterReplace);
  document.querySelector('#lang-toggle')?.addEventListener('click', () => setLang(current === 'en' ? 'zh' : 'en', afterReplace));
}

export function setLang(lang, afterReplace) {
  if (!languages.includes(lang) || lang === current) return;
  current = lang;
  try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
  const url = new URL(location.href);
  url.searchParams.set('lang', lang);
  history.replaceState(null, '', url);
  applyStatic(afterReplace);
  listeners.forEach(callback => callback(lang));
}
