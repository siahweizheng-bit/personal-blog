// ╔══════════════════════════════════════════════════════════════╗
// ║  文章来源：Google 表格（你直接把整篇文章粘进一行）              ║
// ║  无 token、不会失效；网站构建时读取「发布到网页」的 CSV。        ║
// ║  没设表格或读不到时，自动回退到本地 src/posts/*.md，网站永不空。 ║
// ╚══════════════════════════════════════════════════════════════╝
import { marked } from 'marked';

// ① 在 Google 表格：文件 → 共享 → 发布到网页 → 选「逗号分隔值 (.csv)」→ 发布。
// ② 把它给的网址（…/pub?output=csv 结尾）粘到下面引号里。留空则用本地 md。
const ARTICLES_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSc_26jEWOAhFHYJViXHwgcD6OdqWNeHueDawHzTUJs0jl3uyc6XTYH9GXR8X6JVGLMO4Nvduz3fgjc/pub?gid=0&single=true&output=csv';

// 兼容旧页面判断；恒为 true（不再显示「示例文章」提示）
export const isNotionConfigured = true;

// 判断一篇文章属于哪个分类：
// - 「会员专享」分类（memberOnly）按 access 判定，自动收录所有会员文章；
// - 会员文章只归入「会员专享」，不重复出现在主题分类里；
// - 其余分类按标签（tags）判定。
export function inCategory(post, category) {
  if (category && category.memberOnly) return post.access === 'member';
  if (post.access === 'member') return false;
  return post.tags.includes(category.name);
}

// ── 本地 md 回退（构建时打包，无网络）──
const files = import.meta.glob('../posts/*.md', { query: '?raw', import: 'default', eager: true });

function slugify(s) {
  return (s || 'untitled').toLowerCase().replace(/[^\w一-龥]+/g, '-').replace(/^-+|-+$/g, '');
}

function normalize(data) {
  // 容忍中英文列名
  const g = (...keys) => { for (const k of keys) if (data[k] != null && data[k] !== '') return data[k]; return ''; };
  const tagsRaw = g('tags', '标签');
  const tags = String(tagsRaw).split(/[,，、]/).map((t) => t.trim()).filter(Boolean);
  const tagsEnRaw = g('tagsEn', 'tags_en', '标签EN', '英文标签');
  const tagsEn = tagsEnRaw ? String(tagsEnRaw).split(/[,，、]/).map((t) => t.trim()).filter(Boolean) : [];
  const access = /(member|会员|付费|paid)/i.test(g('access', '权限', '会员')) ? 'member' : 'free';
  const pub = String(g('published', '发布') || 'true').toLowerCase();
  const published = pub !== 'false' && pub !== 'no' && pub !== '否' && pub !== '0';
  const title = g('title', '标题');
  return {
    id: g('slug', '网址') || slugify(title),
    slug: g('slug', '网址') || slugify(title),
    title: title || '无标题',
    titleEn: g('titleEn', 'titleen', '标题EN', '英文标题'),
    summary: g('summary', '摘要', '简介'),
    summaryEn: g('summaryEn', 'summaryen', '摘要EN', '英文摘要'),
    date: g('date', '日期'),
    tags, tagsEn, access, published,
    cover: g('cover', '封面'),
    _body: g('body', 'content', '正文', '内容'),
    _bodyEn: g('bodyEn', 'body_en', '正文EN', '英文正文'),
  };
}

// ── 本地 md：解析 frontmatter ──
function fromMarkdown(path, raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  const data = {};
  let body = raw;
  if (m) {
    body = m[2];
    for (const line of m[1].split(/\r?\n/)) {
      const i = line.indexOf(':');
      if (i === -1) continue;
      let v = line.slice(i + 1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
      data[line.slice(0, i).trim()] = v;
    }
  }
  data.slug = data.slug || path.split('/').pop().replace(/\.md$/, '');
  data.body = body;
  return normalize(data);
}
const localPosts = Object.entries(files).map(([p, raw]) => fromMarkdown(p, raw)).filter((p) => p.published);

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

function csvToPosts(text) {
  const rows = parseCSV(text).filter((r) => r.some((c) => c.trim() !== ''));
  if (rows.length < 2) return [];
  const headers = rows[0].map((h) => h.trim());
  return rows.slice(1).map((r) => {
    const data = {};
    headers.forEach((h, i) => { data[h] = (r[i] || '').trim(); });
    return normalize(data);
  }).filter((p) => p.published && p.title !== '无标题');
}

export async function getPosts() {
  if (ARTICLES_CSV) {
    try {
      const res = await fetch(ARTICLES_CSV);
      if (res.ok) {
        const posts = csvToPosts(await res.text());
        if (posts.length) return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
      } else {
        console.warn('[articles] CSV 状态码', res.status, '，改用本地 md');
      }
    } catch (e) {
      console.warn('[articles] CSV 读取失败，改用本地 md：', e.message);
    }
  }
  return [...localPosts].sort((a, b) => (a.date < b.date ? 1 : -1));
}

// 会员付费墙分隔：正文里用一行「===LOCK===」（或 ===会员=== / ===MEMBER===）
// 把「免费试读」与「会员续读」分开。试读之前的内容对所有人公开；
// 之后的深度内容只交付给会员（不会出现在公开 HTML 里）。
const LOCK_RE = /^\s*={3,}\s*(?:LOCK|MEMBER|会员续读|会员)\s*={3,}\s*$/im;

// 拆出中／英文两段 Markdown（兼容 ===EN=== 行内分隔 与 bodyEn 独立列）
function splitLang(post) {
  const body = post?._body || '';
  const [zhMd, inlineEn = ''] = body.split(/^\s*={3,}\s*EN\s*={3,}\s*$/im);
  const enMd = post?._bodyEn?.trim() || inlineEn.trim();
  return { zhMd: zhMd.trim(), enMd: enMd.trim() };
}

// 支持两种双语方式：
// 1. 在 body 列用一行「===EN===」分隔中英文
// 2. 在单独的 bodyEn 列填写英文正文
export async function getPostHtml(post) {
  const { zhMd, enMd } = splitLang(post);
  // 非付费墙场景：去掉分隔标记，正常渲染全文
  const zhClean = zhMd.replace(LOCK_RE, '').trim();
  const enClean = enMd.replace(LOCK_RE, '').trim();
  return { zh: marked.parse(zhClean), en: enClean ? marked.parse(enClean) : '' };
}

// 会员文章的「免费试读」：只返回 ===LOCK=== 之前的部分。
// 若没有标记，则视为全文加锁（返回空），避免付费内容意外公开。
export function getPostTeaser(post) {
  const { zhMd, enMd } = splitLang(post);
  const hasLock = LOCK_RE.test(zhMd) || LOCK_RE.test(enMd);
  if (!hasLock) return { zh: '', en: '', hasLock: false };
  const zhTeaser = zhMd.split(LOCK_RE)[0].trim();
  const enTeaser = enMd.split(LOCK_RE)[0].trim();
  return {
    zh: zhTeaser ? marked.parse(zhTeaser) : '',
    en: enTeaser ? marked.parse(enTeaser) : '',
    hasLock: true,
  };
}

// 会员文章的「续读」部分：===LOCK=== 之后的内容（构建时加密后交付）。
// 若没有分隔标记，则整篇视为加锁内容（与 getPostTeaser 的行为一致）。
export function getPostLocked(post) {
  const { zhMd, enMd } = splitLang(post);
  const zhParts = zhMd.split(LOCK_RE);
  const enParts = enMd.split(LOCK_RE);
  const zhLocked = (zhParts.length > 1 ? zhParts.slice(1).join('\n\n') : zhMd).trim();
  const enLocked = (enParts.length > 1 ? enParts.slice(1).join('\n\n') : enMd).trim();
  return {
    zh: zhLocked ? marked.parse(zhLocked) : '',
    en: enLocked ? marked.parse(enLocked) : '',
  };
}

// 完整正文的字数（用于会员付费墙上「完整版约 N 分钟」的诱因），
// 仅统计长度、不输出正文内容。
export function fullReadStats(post) {
  const { zhMd, enMd } = splitLang(post);
  const text = (zhMd + ' ' + enMd).replace(LOCK_RE, ' ');
  const zhChars = (text.match(/[一-鿿㐀-䶿]/g) || []).length;
  const enWords = (text.replace(/[一-鿿㐀-䶿]/g, ' ').match(/\b[a-zA-Z]+\b/g) || []).length;
  const minutes = Math.max(1, Math.round(zhChars / 350 + enWords / 200));
  return { zhChars, enWords, minutes };
}

export function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;
}
