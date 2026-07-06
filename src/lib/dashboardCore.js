// ╔══════════════════════════════════════════════════════════════╗
// ║  仪表板「纯计算核心」：解析 CSV + 聚合成绩。                    ║
// ║  无副作用、不依赖 Node/浏览器专有 API，也不 import 配置。        ║
// ║  构建端（dashboard.js）与浏览器端实时刷新脚本共用同一套算法。   ║
// ╚══════════════════════════════════════════════════════════════╝

export function parseCSV(text) {
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

export function rowsToObjects(text) {
  const rows = parseCSV(text).filter((r) => r.some((c) => c.trim() !== ''));
  if (rows.length < 2) return [];
  const headers = rows[0].map((h) => h.trim());
  return rows.slice(1).map((r) => {
    const o = {};
    headers.forEach((h, i) => { o[h] = (r[i] || '').trim(); });
    return o;
  });
}

const num = (v) => {
  const n = parseFloat(String(v).replace(/[, %]/g, ''));
  return isNaN(n) ? 0 : n;
};
const g = (o, ...keys) => { for (const k of keys) if (o[k] != null && o[k] !== '') return String(o[k]).trim(); return ''; };

// ── 计算整个仪表板 ──
// 入参：{ coRows, candRows, totalSeats, registeredVoters, colors }
//   coRows/candRows：rowsToObjects() 的结果；colors：{阵营代号: 颜色} 映射
export function computeDashboard({ coRows = [], candRows = [], totalSeats = 0, registeredVoters = '', colors = {} } = {}) {
  const colorFor = (name, override) => override || colors[name] || '#888888';

  // 阵营颜色/名称覆盖（可选）
  const colorMap = {}, nameMap = {};
  for (const r of coRows) {
    const name = g(r, 'coalition', '阵营', 'name', '名称');
    if (!name) continue;
    const col = g(r, 'color', '颜色'); if (col) colorMap[name] = col;
    const party = g(r, 'party', '政党'); if (party) nameMap[name] = party;
  }

  // 候选人行 → 按选区分组
  const seatOrder = [], seatMap = new Map();
  for (const r of candRows) {
    const seatName = g(r, 'seat', '选区', '议席');
    const seatCode = g(r, 'seatCode', 'seatcode', '编号', '代号');
    const key = seatCode || seatName;
    if (!key) continue;
    if (!seatMap.has(key)) {
      seatMap.set(key, { seatCode, seat: seatName, seatEn: g(r, 'seatEn', 'seaten', '选区EN'), status: g(r, 'status', '状态'), candidates: [] });
      seatOrder.push(key);
    }
    const s = seatMap.get(key);
    if (!s.status) s.status = g(r, 'status', '状态');
    const coalition = g(r, 'coalition', '阵营');
    s.candidates.push({
      candidate: g(r, 'candidate', '候选人'),
      party: g(r, 'party', '政党'),
      coalition,
      color: colorFor(coalition, colorMap[coalition] || g(r, 'color', '颜色')),
      votes: num(g(r, 'votes', '得票')),
    });
  }

  const seats = seatOrder.map((k) => {
    const s = seatMap.get(k);
    const total = s.candidates.reduce((a, c) => a + c.votes, 0);
    s.candidates.sort((a, b) => b.votes - a.votes);
    s.candidates.forEach((c) => { c.votePct = total > 0 ? +(c.votes / total * 100).toFixed(1) : null; });
    s.totalVotes = total;
    s.declared = total > 0;
    if (s.declared) {
      const win = s.candidates[0];
      s.winnerCoalition = win.coalition; s.winnerParty = win.party; s.winnerCandidate = win.candidate;
      s.majority = win.votes - (s.candidates[1]?.votes || 0);
      if (!s.status) s.status = '已公布';
    } else if (!s.status) { s.status = '待公布'; }
    return s;
  });

  // 由候选人数据汇总阵营（席位=胜出场次，得票=候选人得票之和）
  const cMap = new Map();
  for (const s of seats) {
    for (const c of s.candidates) {
      if (!c.coalition) continue;
      const cur = cMap.get(c.coalition) || { name: c.coalition, party: nameMap[c.coalition] || '', color: colorFor(c.coalition, colorMap[c.coalition]), seats: 0, votes: 0, votePct: null };
      cur.votes += c.votes;
      cMap.set(c.coalition, cur);
    }
    if (s.declared && s.winnerCoalition) { const cur = cMap.get(s.winnerCoalition); if (cur) cur.seats += 1; }
  }
  let coalitions = [...cMap.values()];

  if (!coalitions.length && coRows.length) {
    coalitions = coRows.map((r) => {
      const name = g(r, 'coalition', '阵营', 'name', '名称');
      return {
        name, party: g(r, 'party', '政党'), color: colorFor(name, g(r, 'color', '颜色')),
        seats: num(g(r, 'seats', '席位', '议席')), votes: num(g(r, 'votes', '得票')),
        votePct: g(r, 'votePct', 'votepct', '得票率') ? num(g(r, 'votePct', 'votepct', '得票率')) : null,
      };
    }).filter((c) => c.name);
  }

  coalitions.sort((a, b) => b.seats - a.seats || b.votes - a.votes);

  const totalVotes = coalitions.reduce((s, c) => s + c.votes, 0);
  if (totalVotes > 0) for (const c of coalitions) if (c.votePct == null) c.votePct = +(c.votes / totalVotes * 100).toFixed(1);

  const seatsDeclared = coalitions.reduce((s, c) => s + c.seats, 0);
  const tSeats = totalSeats || seats.length || 0;
  const majority = tSeats ? Math.floor(tSeats / 2) + 1 : 0;
  const leader = coalitions[0] || null;
  const hasResults = seats.some((s) => s.declared) || seatsDeclared > 0;

  let turnout = null;
  const reg = num(registeredVoters);
  if (totalVotes > 0 && reg > 0) turnout = +(totalVotes / reg * 100).toFixed(1);

  return { coalitions, seats, totalVotes, seatsDeclared, totalSeats: tSeats, majority, leader, hasResults, turnout };
}
