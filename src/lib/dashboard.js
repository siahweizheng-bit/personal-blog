// ╔══════════════════════════════════════════════════════════════╗
// ║  州选仪表板数据（构建端）：抓 Google 表格 CSV → 交给纯计算核心。║
// ║  算法在 dashboardCore.js，浏览器端实时刷新脚本共用同一套逻辑。 ║
// ╚══════════════════════════════════════════════════════════════╝
import { site } from '../config.js';
import { rowsToObjects, computeDashboard } from './dashboardCore.js';

async function fetchCsv(url) {
  if (!url) return [];
  try {
    const res = await fetch(url);
    if (!res.ok) { console.warn('[dashboard] CSV 状态码', res.status, url); return []; }
    return rowsToObjects(await res.text());
  } catch (e) {
    console.warn('[dashboard] CSV 读取失败：', e.message);
    return [];
  }
}

export async function getDashboard(cfg) {
  const [coRows, candRows] = await Promise.all([
    fetchCsv(cfg.coalitionsCsv),
    fetchCsv(cfg.seatsCsv),
  ]);
  return computeDashboard({
    coRows, candRows,
    totalSeats: cfg.totalSeats,
    registeredVoters: cfg.registeredVoters,
    colors: site.coalitionColors || {},
  });
}
