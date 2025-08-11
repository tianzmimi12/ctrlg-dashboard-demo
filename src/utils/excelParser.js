// src/utils/excelParser.js
import * as XLSX from "xlsx";

/* =========================== ฟังก์ชันช่วยเรื่องวันที่ =========================== */
function ymdFromDate(d) {
  // ใช้ UTC กัน timezone เพี้ยน
  const yyyy = d.getUTCFullYear();
  const mm   = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd   = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`;
}

// robust: รองรับ Excel serial + แก้ leap year bug 1900
function excelSerialDateToYMD(serial) {
  if (serial == null || serial === "" || Number.isNaN(Number(serial))) return "";
  const n = Number(serial);
  const p = XLSX.SSF?.parse_date_code ? XLSX.SSF.parse_date_code(n) : null;
  if (!p || !p.y || !p.m || !p.d) return "";
  const d = new Date(Date.UTC(p.y, p.m - 1, p.d));
  return ymdFromDate(d);
}

function parseDate(value) {
  if (value == null || value === "") return "";

  // รับ Date object ตรงๆ
  if (value instanceof Date && !isNaN(value)) {
    return ymdFromDate(new Date(Date.UTC(
      value.getFullYear(),
      value.getMonth(),
      value.getDate()
    )));
  }

  // Excel serial date (ช่วงที่พบบ่อย)
  if (typeof value === "number") {
    if (value > 20000 && value < 80000) {
      return excelSerialDateToYMD(value);
    }
  }

  const s = String(value).trim();

  // 8 หลัก: yyyyMMdd หรือ ddMMyyyy
  if (/^\d{8}$/.test(s)) {
    const y2 = +s.slice(0,4), m2 = +s.slice(4,6), d2 = +s.slice(6,8);
    const d1 = +s.slice(0,2), m1 = +s.slice(2,4), y1 = +s.slice(4,8);

    // ลอง yyyyMMdd ก่อน
    if (y2 >= 2000 && y2 <= 2100 && m2 >= 1 && m2 <= 12 && d2 >= 1 && d2 <= 31) {
      return s;
    }
    // แล้วค่อย ddMMyyyy
    if (d1 >= 1 && d1 <= 31 && m1 >= 1 && m1 <= 12 && y1 >= 2000 && y1 <= 2100) {
      return `${y1}${String(m1).padStart(2,"0")}${String(d1).padStart(2,"0")}`;
    }
    return "";
  }

  // 7 หลัก: dMMyyyy
  if (/^\d{7}$/.test(s)) {
    const d = +s.slice(0,1), m = +s.slice(1,3), y = +s.slice(3,7);
    if (d>=1&&d<=31&&m>=1&&m<=12&&y>=2000&&y<=2100) {
      return `${y}${String(m).padStart(2,"0")}${String(d).padStart(2,"0")}`;
    }
    return "";
  }

  // dd/mm/yyyy หรือ d/m/yyyy
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(s)) {
    const [d,m,y] = s.split("/").map(Number);
    if (d>=1&&d<=31&&m>=1&&m<=12&&y>=2000&&y<=2100) {
      return `${y}${String(m).padStart(2,"0")}${String(d).padStart(2,"0")}`;
    }
    return "";
  }

  // yyyy-m-d / yyyy-mm-dd (ยอมเลขหลักเดียว)
  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(s)) {
    const [y,m,d] = s.split("-").map(Number);
    if (d>=1&&d<=31&&m>=1&&m<=12&&y>=2000&&y<=2100) {
      return `${y}${String(m).padStart(2,"0")}${String(d).padStart(2,"0")}`;
    }
    return "";
  }

  return "";
}

function formatDateShort(str) {
  if (!str || str.length !== 8) return "-";
  const yyyy = str.slice(0,4), mm = str.slice(4,6), dd = str.slice(6,8);
  return `${dd}/${mm}/${yyyy.slice(2)}`;
}

function buildWeekMap(dates) {
  return [...new Set(dates.filter(Boolean))].sort().reduce((map, d, i) => {
    map[d] = `W${i+1}`;
    return map;
  }, {});
}

function cleanHero(name) {
  const s = String(name ?? "").trim();
  const lower = s.toLowerCase();
  if (!s || lower === "nan" || lower.includes("sum") || s.includes("ผลรวม")) return "";
  return s;
}

/* ====================== parseScrimStatsFromExcel ====================== */
export function parseScrimStatsFromExcel(file, setGames) {
  const reader = new FileReader();
  reader.onload = e => {
    const data     = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheets   = workbook.SheetNames || [];
    const sheetName = sheets.includes("Winter_Scrim_Stats")
      ? "Winter_Scrim_Stats"
      : (sheets.includes("All_Scrim_Stats") ? "All_Scrim_Stats" : "");
    if (!sheetName) {
      console.warn("ไม่พบชีท Winter_Scrim_Stats/All_Scrim_Stats");
      setGames([]);
      return;
    }

    const ws   = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

    const idx = {
      date:0, competitor:2, matchWin:4, type:6,
      side:3, endType:7, time:8,
      fsBan: [10,11,12,13],
      fsPick:[14,15,16,17,18]
    };

    const mainRows = rows.slice(1).map(r=>({
      Date:       r[idx.date],
      Competitor: r[idx.competitor],
      MatchWin:   r[idx.matchWin],
      Type:       r[idx.type],
      TIME:       r[idx.time],
      Side:       r[idx.side],
      EndType:    r[idx.endType],
      fsBanArr:   idx.fsBan.map(i => (r[i]||"").trim()).filter(Boolean),
      fsPickArr:  idx.fsPick.map(i => (r[i]||"").trim()).filter(Boolean),
      raw:        r,
    }));

    const allDates = mainRows.map(r => parseDate(r.Date)).filter(Boolean);
    const weekMap  = buildWeekMap(allDates);

    const parsed = mainRows.map(r=>{
      const D    = parseDate(r.Date);
      const week = weekMap[D]||"-";
      let result="Lose", win=0, lose=1;
      if (["FS","Win","1",1,"win","WIN"].includes(r.MatchWin)) {
        result="Win"; win=1; lose=0;
      }
      return {
        Date:    D,
        dateStr: formatDateShort(D),
        week,
        side:       r.Side||"",
        competitor: r.Competitor||"ไม่พบข้อมูล",
        type:       r.Type||"ไม่พบข้อมูล",
        endType:    r.EndType||"",
        time:       r.TIME||"",
        fsBan:      r.fsBanArr.join(", "),
        result, win, lose,
        match: r.MatchWin,
        raw:   r.raw,
      };
    }).filter(x=>x.Date && x.competitor);

    setGames(parsed);
  };
  reader.readAsArrayBuffer(file);
}

/* ======================== parseGamesFromExcel ======================== */
export function parseGamesFromExcel(file, setGames, setTierData) {
  const reader = new FileReader();
  reader.onload = e => {
    const data     = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheets   = workbook.SheetNames || [];
    const sheetName = sheets.includes("Winter_Scrim_Stats")
      ? "Winter_Scrim_Stats"
      : (sheets.includes("All_Scrim_Stats") ? "All_Scrim_Stats" : "");
    if (!sheetName) {
      console.warn("ไม่พบชีท Winter_Scrim_Stats/All_Scrim_Stats");
      setGames([]);
      if (setTierData) setTierData([]);
      return;
    }

    const ws   = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

    const mainRows = rows.slice(1).map(r=>{
      const fsPickArr = [], fsPosArr = [];
      for (let i=0; i<5; i++){
        fsPickArr.push(cleanHero(r[14+i]));
        fsPosArr.push(r[19+i] ? String(r[19+i]).trim() : "");
      }
      const side = String(r[3] || "").trim().toLowerCase(); // red/blue -> lower
      return {
        Date:       r[0],
        Competitor: r[2],
        "Match Win":r[4],
        Type:       r[6],
        TIME:       r[8],
        Side:       side,
        EndType:    r[7],
        fsPick:     fsPickArr,
        fsPosition: fsPosArr,
        raw:        r,
      };
    });

    const allDates = mainRows.map(r=>parseDate(r.Date)).filter(Boolean);
    const weekMap  = buildWeekMap(allDates);

    const parsedGames = mainRows.map(r=>{
      const D    = parseDate(r.Date);
      const week = weekMap[D]||"-";
      let result="Lose", win=0, lose=1;
      if (["FS","Win","1",1,"win","WIN"].includes(r["Match Win"])) {
        result="Win"; win=1; lose=0;
      }
      return {
        Date:       D,
        dateStr:    formatDateShort(D),
        week,
        side:       r.Side,
        competitor: r.Competitor||"ไม่พบข้อมูล",
        type:       r.Type||"ไม่พบข้อมูล",
        endType:    r.EndType||"",
        time:       r.TIME||"",
        fsPick:     r.fsPick,
        fsPosition: r.fsPosition,
        result, win, lose,
        match:      r["Match Win"],
        raw:        r.raw,
      };
    }).filter(x=>x.Date && x.competitor);

    setGames(parsedGames);

    if (setTierData) {
      const heroMap = {};
      parsedGames.forEach(g=>{
        const add = (name,type,w,l)=>{
          if (!name) return;
          if (!heroMap[name]) heroMap[name]={ win:0,lose:0,type };
          heroMap[name].win  += w;
          heroMap[name].lose += l;
        };
        g.fsPick.forEach(h=>add(h.trim(),"1-hero",g.win,g.lose));
        add(g.competitor.trim(),"team",g.win,g.lose);
      });
      const tierData = Object.entries(heroMap).map(([name,v])=>{
        const total = v.win + v.lose;
        return {
          name,
          win:      v.win,
          lose:     v.lose,
          type:     v.type,
          total,
          winrate: total>0 ? ((v.win/total)*100).toFixed(1) : "0.0",
        };
      }).sort((a,b)=> Number(b.winrate) - Number(a.winrate) || b.total - a.total);
      setTierData(tierData);
    }
  };
  reader.readAsArrayBuffer(file);
}

/* ====================== parseComboStatsFromExcel ====================== */
// ใช้ชีท "ComboStats" เป็นแหล่ง combo ที่เชื่อถือได้ (ตำแหน่งคอลัมน์จากไฟล์จริง)
export function parseComboStatsFromExcel(file, setComboStats, setDropdowns) {
  const reader = new FileReader();
  reader.onload = e => {
    const data      = new Uint8Array(e.target.result);
    const wb        = XLSX.read(data, { type: "array" });
    const sheetName = wb.SheetNames.find(n => n.toLowerCase().includes("combstats") || n.toLowerCase().includes("combo"));
    if (!sheetName) {
      console.warn("ไม่พบชีท ComboStats");
      setComboStats({ combo2:[], combo2MidRoam:[], combo2DslJug:[], combo3:[] });
      if (setDropdowns) setDropdowns({ dates: [] });
      return;
    }
    const ws       = wb.Sheets[sheetName];
    const sheetArr = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

    // ===== Mapping ตามไฟล์จริง =====
    // Mid+Roam: Date=8, H1=9, H2=10, Total=11, Win=12
    const combo2MidRoam = [];
    for (let i = 35; i < sheetArr.length; i++) {
      const row = sheetArr[i] || [];
      const h1  = row[9], h2 = row[10];
      if (h1 && h2) {
        const total = Number(row[11]) || 0;
        const win   = Number(row[12]) || 0;
        combo2MidRoam.push({
          combo: `${String(h1).trim()} + ${String(h2).trim()}`,
          win, total, losses: Math.max(0, total - win),
          comboType: "2-heroes (Mid+Roaming)"
        });
      }
    }

    // DSL+Jungle: Date=38, H1=39, H2=40, Total=41, Win=42
    const combo2DslJug = [];
    for (let i = 35; i < sheetArr.length; i++) {
      const row = sheetArr[i] || [];
      const h1  = row[39], h2 = row[40];
      if (h1 && h2) {
        const total = Number(row[41]) || 0;
        const win   = Number(row[42]) || 0;
        combo2DslJug.push({
          combo: `${String(h1).trim()} + ${String(h2).trim()}`,
          win, total, losses: Math.max(0, total - win),
          comboType: "2-heroes (DSL+Jungle)"
        });
      }
    }

    // 3-heroes: Date=23, H1=24, H2=25, H3=26, Total=27, Win=28
    const combo3 = [];
    for (let i = 35; i < sheetArr.length; i++) {
      const row = sheetArr[i] || [];
      const h1  = row[24], h2 = row[25], h3 = row[26];
      if (h1 && h2 && h3) {
        const total = Number(row[27]) || 0;
        const win   = Number(row[28]) || 0;
        combo3.push({
          combo: `${String(h1).trim()} + ${String(h2).trim()} + ${String(h3).trim()}`,
          win, total, losses: Math.max(0, total - win)
        });
      }
    }

    setComboStats({
      combo2: [...combo2MidRoam, ...combo2DslJug],
      combo2MidRoam,
      combo2DslJug,
      combo3
    });

    // สร้าง dropdown date แบบคร่าว ๆ จากหลายคอลัมน์วันที่ที่เกี่ยวข้อง
    if (setDropdowns) {
      const dateCols = [0, 8, 23, 38]; // 0 บางไฟล์มี date รวม, 8/23/38 คือ date ของบล็อก
      const dates = new Set();
      sheetArr.slice(1).forEach(r => {
        dateCols.forEach(c => {
          const d = parseDate(r[c]);
          if (d) dates.add(d);
        });
      });
      setDropdowns({ dates: [...dates].sort() });
    }
  };
  reader.readAsArrayBuffer(file);
}

/* ================= parseFiltersFromAllScrimStats ================= */
export function parseFiltersFromAllScrimStats(file, setFilterOptions) {
  const reader = new FileReader();
  reader.onload = e => {
    const data      = new Uint8Array(e.target.result);
    const workbook  = XLSX.read(data, { type: "array" });
    const sheets    = workbook.SheetNames || [];
    const sheetName = sheets.includes("Winter_Scrim_Stats")
      ? "Winter_Scrim_Stats"
      : (sheets.includes("All_Scrim_Stats") ? "All_Scrim_Stats" : "");
    if (!sheetName) {
      console.warn("ไม่พบชีท Winter_Scrim_Stats/All_Scrim_Stats");
      setFilterOptions({ dates: [], teams: [] });
      return;
    }

    const ws   = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

    const dates = [], teams = [];
    for (let i=1; i<rows.length; i++){
      const d = parseDate(rows[i][0]);
      const t = rows[i][2];
      if (d) dates.push(d);
      if (t) teams.push(String(t).trim());
    }
    setFilterOptions({
      dates: [...new Set(dates)].sort(),
      teams: [...new Set(teams)].sort()
    });
  };
  reader.readAsArrayBuffer(file);
}

/* ======================== parseComboStatsSheet ======================== */
/** อ่านชีททีม (เช่น TLN/BRU/...) เพื่อดึง one-hero ต่อ role
 *  หมายเหตุ: จากไฟล์จริง ส่วน combo2/combo3 ไม่อยู่ในชีททีม → คืนว่าง
 */
export function parseComboStatsSheet(sheet, sheetName) {
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

  let startRow, endRow;
  if (["TLN","BRU","PSG","KOG","HD","BAC","EA"].includes(sheetName)) {
    startRow = 44;
    endRow   = (sheetName === "BRU" ? 57 : 59);
  } else {
    return { oneHero:[], combo2:[], combo3:[], totalGames:0 };
  }

  // oneHero mapping จากไฟล์จริง (ต่อบล็อก role)
  const posCols = {
    DSL: [0,1,2,3],     // [Hero, Total, Win, Rate]
    JUG: [5,6,7,8],
    MID: [10,11,12,13],
    ADL: [15,16,17,18],
    SUP: [20,21,22,23],
  };

  const oneHero = [];
  let totalGames = 0;

  Object.entries(posCols).forEach(([position, [hCol, tCol, wCol, wrCol]]) => {
    // ข้ามหัวบล็อก (row startRow คือ header/label)
    for (let r = startRow + 1; r <= endRow; r++) {
      const row = rows[r];
      if (!row) continue;

      const h = row[hCol];
      if (!h) continue;
      const hStr = String(h).trim();
      if (!hStr || hStr.toLowerCase().includes("grand total")) continue;

      const total   = Number(row[tCol]) || 0;
      const win     = Number(row[wCol]) || 0;
      let winrate   = Number(row[wrCol]);
      if (!Number.isFinite(winrate)) winrate = 0;
      if (winrate > 0 && winrate <= 1) winrate = (winrate * 100).toFixed(1);
      if (winrate === 0 && total > 0) winrate = ((win / total) * 100).toFixed(1);

      totalGames += total;
      oneHero.push({
        hero: hStr,
        total,
        win,
        winrate,
        position
      });
    }
  });

  // ชีททีมไม่มี combo2/combo3 ในรูปแบบเดียวกับ ComboStats
  return { oneHero, combo2: [], combo3: [], totalGames };
}
