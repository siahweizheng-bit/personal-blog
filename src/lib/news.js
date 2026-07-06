// ╔══════════════════════════════════════════════════════════════╗
// ║  新闻来源：Google 表格（和文章一样，一行 = 一篇新闻）          ║
// ║  每行可含正文 body / bodyEn，网站会为每篇生成 /news/<slug> 详情页。║
// ║  无 token、不会失效；构建时读取「发布到网页」的 CSV。          ║
// ║  没设表格或读不到时，回退到下面的本地默认条目，页面永不空。     ║
// ╚══════════════════════════════════════════════════════════════╝
import { marked } from 'marked';

// ① Google 表格列名建议（中/英任填一种即可）：
//    slug(网址) · date(日期) · tag(标签) · tagEn(标签EN) · title(标题) · titleEn(标题EN)
//    summary(摘要) · summaryEn(摘要EN) · body(正文) · bodyEn(正文EN) · href(外链,可选) · published(发布)
//    · 正文 body 支持 Markdown；双语可用单独的 bodyEn 列，或在 body 里用一行「===EN===」分隔中英文。
//    · 若填了 href（外部链接），卡片会直接跳到该链接，不生成详情页。
// ② 文件 → 共享 → 发布到网页 → 选「逗号分隔值 (.csv)」→ 发布。
// ③ 把它给的网址（…/pub?...&output=csv）粘到下面引号里。留空则用本地默认条目。
const NEWS_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTIm29tWR0r7bKhUDIu7jvn5Gh2-nGfge8aqHUpHlX9kt_PvhvUSuVOWVv1reaEaPC7OG494JHfc0pe/pub?gid=0&single=true&output=csv';

// ── 本地默认条目（CSV 读不到时回退，保证页面不空）──
const FALLBACK = [
  {
    slug: 'news-launch',
    date: '2026-06-28',
    tag: '公告', tagEn: 'Notice',
    title: '「新闻」栏目正式上线', titleEn: 'The News section is now live',
    summary: '我们新增了新闻栏目，用中立、易懂的方式追踪马来西亚的时事与公共议题。',
    summaryEn: 'We launched a News section to follow Malaysian current affairs neutrally.',
    href: '',
    _body: '我们新增了**新闻**栏目，用中立、易懂的方式追踪马来西亚的时事与公共议题。\n\n订阅后，重点解析会直接送到你的信箱。',
    _bodyEn: 'We just launched a **News** section to follow Malaysian current affairs in a neutral, easy-to-read way.\n\nSubscribe and key explainers land straight in your inbox.',
  },
];

function slugify(s) {
  return (s || 'news').toLowerCase().replace(/[^\w一-龥]+/g, '-').replace(/^-+|-+$/g, '') || 'news';
}

// ── CSV 解析（支持单元格内换行 / 逗号 / 双引号转义）──
function parseCSV(text) {
  const rows = []; let row = [], field = '', inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else inQ = false; }
      else field += c;
    } else if (c === '"') inQ = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\r') { /* skip */ }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

function normalize(data) {
  const g = (...keys) => { for (const k of keys) if (data[k] != null && data[k] !== '') return String(data[k]).trim(); return ''; };
  const pub = (g('published', '发布') || 'true').toLowerCase();
  const published = pub !== 'false' && pub !== 'no' && pub !== '否' && pub !== '0';
  const title = g('title', '标题');
  const body = g('body', 'content', '正文', '内容');
  const bodyEn = g('bodyEn', 'body_en', '正文EN', '英文正文');
  return {
    slug: g('slug', '网址') || slugify(title),
    date: g('date', '日期'),
    tag: g('tag', '标签') || '时事',
    tagEn: g('tagEn', 'tagen', '标签EN', '英文标签') || g('tag', '标签') || 'News',
    title,
    titleEn: g('titleEn', 'titleen', '标题EN', '英文标题'),
    summary: g('summary', '摘要', '简介'),
    summaryEn: g('summaryEn', 'summaryen', '摘要EN', '英文摘要'),
    href: g('href', '链接', 'url', 'link'),
    published,
    hasBody: Boolean(body || bodyEn),
    _body: body,
    _bodyEn: bodyEn,
  };
}

function csvToNews(text) {
  const rows = parseCSV(text).filter((r) => r.some((c) => c.trim() !== ''));
  if (rows.length < 2) return [];
  const headers = rows[0].map((h) => h.trim());
  return rows.slice(1).map((r) => {
    const data = {};
    headers.forEach((h, i) => { data[h] = (r[i] || '').trim(); });
    return normalize(data);
  }).filter((n) => n.published && n.title);
}

export async function getNews() {
  if (NEWS_CSV) {
    try {
      const res = await fetch(NEWS_CSV);
      if (res.ok) {
        const items = csvToNews(await res.text());
        if (items.length) return items.sort((a, b) => (a.date < b.date ? 1 : -1));
      } else {
        console.warn('[news] CSV 状态码', res.status, '，改用本地默认条目');
      }
    } catch (e) {
      console.warn('[news] CSV 读取失败，改用本地默认条目：', e.message);
    }
  }
  return [...FALLBACK].map(normalizeFallback).sort((a, b) => (a.date < b.date ? 1 : -1));
}

// 让本地回退条目也具备 hasBody 等字段
function normalizeFallback(n) {
  return { ...n, hasBody: Boolean(n._body || n._bodyEn) };
}

// 每篇新闻是否应有独立详情页（有正文、且没有指定外部链接）
export function hasNewsPage(n) {
  return n.hasBody && !n.href;
}

// 渲染正文为 HTML（支持 body 里「===EN===」分隔，或单独 bodyEn 列）
export function getNewsHtml(n) {
  const body = n?._body || '';
  const [zhMd, inlineEn = ''] = body.split(/^\s*={3,}\s*EN\s*={3,}\s*$/im);
  const enMd = (n?._bodyEn || '').trim() || inlineEn.trim();
  return { zh: marked.parse(zhMd.trim()), en: enMd ? marked.parse(enMd) : '' };
}
