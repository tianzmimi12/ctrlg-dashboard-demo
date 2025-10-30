// Utilities to load hero pool CSV and compute pick/ban stats
import Papa from 'papaparse';

export async function loadHeroPool(csvPath = `${process.env.PUBLIC_URL}/heropool.csv`) {
  const res = await fetch(csvPath);
  if (!res.ok) throw new Error(`Failed to load ${csvPath}`);
  const text = await res.text();
  const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
  return parsed.data; // rows: { hero, team, action, matchId, time, ...}
}

export function countByHero(rows) {
  const acc = {};
  for (const r of rows) {
    const hero = r.hero || 'Unknown';
    acc[hero] = acc[hero] || { pick: 0, ban: 0 };
    if (String(r.action).toLowerCase() === 'pick') acc[hero].pick += 1;
    if (String(r.action).toLowerCase() === 'ban') acc[hero].ban += 1;
  }
  return acc; // {Hero: {pick, ban}}
}

export function toArray(stats) {
  return Object.entries(stats).map(([hero, v]) => ({ hero, ...v }));
}
