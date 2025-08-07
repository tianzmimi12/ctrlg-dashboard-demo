import * as XLSX from "xlsx";

// ================= ฟังก์ชันช่วย =================
function excelSerialDateToYMD(serial) {
  if (!serial || isNaN(serial)) return "";
  const date = new Date(Math.round((serial - 25569) * 86400 * 1000));
  const yyyy = date.getFullYear();
  const mm   = String(date.getMonth() + 1).padStart(2, "0");
  const dd   = String(date.getDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`;
}

function parseDate(value) {
  if (!value) return "";
  if (typeof value === "number" && value > 40000 && value < 60000) {
    return excelSerialDateToYMD(value);
  }
  const s = typeof value === "number" ? String(value) : String(value).trim();
  if (/^\d{7}$/.test(s)) {
    let d, m, y;
    if (parseInt(s.slice(0, 2), 10) >= 10) {
      d = s.slice(0, 2); m = s.slice(2, 4); y = s.slice(4, 8);
    } else {
      d = s.slice(0, 1); m = s.slice(1, 3); y = s.slice(3, 7);
    }
    return `${y}${m.padStart(2, "0")}${d.padStart(2, "0")}`;
  }
  if (/^\d{8}$/.test(s)) return s;
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) {
    const [d, m, y] = s.split("/");
    return `${y}${m}${d}`;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const [y, m, d] = s.split("-");
    return `${y}${m}${d}`;
  }
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(s)) {
    const [d, m, y] = s.split("/");
    return `${y}${m.padStart(2, "0")}${d.padStart(2, "0")}`;
  }
  return "";
}

function formatDateShort(str) {
  if (!str || str.length !== 8) return "ไม่พบข้อมูล";
  const yyyy = str.slice(0, 4);
  const mm   = str.slice(4, 6);
  const dd   = str.slice(6, 8);
  return `${dd}/${mm}/${yyyy.slice(2)}`;
}

function buildWeekMap(dates) {
  return [...new Set(dates)].sort().reduce((map, d, i) => {
    map[d] = `W${i + 1}`; return map;
  }, {});
}

function cleanHero(name) {
  const s = String(name || "").trim();
  if (!s || s.toLowerCase() === "nan" || s.includes("ผลรวม")) return "";
  return s;
}

// ================== parseScrimStatsFromExcel ==================
export function parseScrimStatsFromExcel(file, setGames) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const data      = new Uint8Array(e.target.result);
    const workbook  = XLSX.read(data, { type: "array" });
    const sheets    = workbook.SheetNames;
    const sheetName = sheets.includes("Winter_Scrim_Stats")
      ? "Winter_Scrim_Stats"
      : "All_Scrim_Stats";
    const ws   = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

    const idx = {
      date:       0,
      competitor: 2,
      matchWin:   4,
      type:       6,
      side:       3,
      endType:    7,
      time:       8,
      fsBan:      [10,11,12,13],
      fsPick:     [14,15,16,17,18],
    };

    const mainRows = rows.slice(1).map(r => ({
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

    const parsed = mainRows
      .map(r => {
        const D     = parseDate(r.Date);
        const week  = weekMap[D] || "-";
        let result  = "Lose", win = 0, lose = 1;
        if (["FS","Win","1",1].includes(r.MatchWin)) {
          result = "Win"; win = 1; lose = 0;
        }
        return {
          Date:       D,
          dateStr:    formatDateShort(D),
          week,
          side:       r.Side || "",
          competitor: r.Competitor || "ไม่พบข้อมูล",
          type:       r.Type || "ไม่พบข้อมูล",
          endType:    r.EndType || "",
          time:       r.TIME || "",
          fsBan:      r.fsBanArr.join(", "),
          result,
          win,
          lose,
          match:      r.MatchWin,
          raw:        r.raw,
        };
      })
      .filter(x => x.Date && x.competitor);

    setGames(parsed);
  };
  reader.readAsArrayBuffer(file);
}

// ================== parseGamesFromExcel ==================
export function parseGamesFromExcel(file, setGames, setTierData) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const data      = new Uint8Array(e.target.result);
    const workbook  = XLSX.read(data, { type: "array" });
    const sheets    = workbook.SheetNames;
    const sheetName = sheets.includes("Winter_Scrim_Stats")
      ? "Winter_Scrim_Stats"
      : "All_Scrim_Stats";
    const ws   = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

    const mainRows = rows.slice(1).map(r => {
      const fsPickArr = [];
      const fsPosArr  = [];
      for (let i = 0; i < 5; i++) {
        fsPickArr.push(cleanHero(r[14 + i]));
        fsPosArr.push(r[19 + i] ? String(r[19 + i]).trim() : "");
      }
      return {
        Date:          r[0],
        Competitor:    r[2],
        "Match Win":   r[4],
        Type:          r[6],
        TIME:          r[8],
        Side:          r[3],
        EndType:       r[7],
        fsPick:        fsPickArr,
        fsPosition:    fsPosArr,
        raw:           r,
      };
    });

    const allDates = mainRows.map(r => parseDate(r.Date)).filter(Boolean);
    const weekMap  = buildWeekMap(allDates);

    const parsedGames = mainRows
      .map(r => {
        const D     = parseDate(r.Date);
        const week  = weekMap[D] || "-";
        let result  = "Lose", win = 0, lose = 1;
        if (["FS","Win","1",1].includes(r["Match Win"])) {
          result = "Win"; win = 1; lose = 0;
        }
        return {
          Date:       D,
          dateStr:    formatDateShort(D),
          week,
          side:       (r.Side || "").toLowerCase(),
          competitor: r.Competitor || "ไม่พบข้อมูล",
          type:       r.Type || "ไม่พบข้อมูล",
          endType:    r.EndType || "",
          time:       r.TIME || "",
          fsPick:     r.fsPick,
          fsPosition: r.fsPosition,
          result,
          win,
          lose,
          match:      r["Match Win"],
          raw:        r.raw,
        };
      })
      .filter(x => x.Date && x.competitor);

    setGames(parsedGames);

    if (setTierData) {
      const heroMap = {};
      parsedGames.forEach(g => {
        const add = (name, type, w, l) => {
          if (!name) return;
          if (!heroMap[name]) heroMap[name] = { win:0, lose:0, type };
          heroMap[name].win  += w;
          heroMap[name].lose += l;
        };
        g.fsPick.forEach(h => add(h.trim(), "1-hero", g.win, g.lose));
        add(g.competitor.trim(), "team", g.win, g.lose);
      });
      const tierData = Object.entries(heroMap).map(([name,v]) => {
        const total = v.win + v.lose;
        return {
          name,
          win:      v.win,
          lose:     v.lose,
          type:     v.type,
          total,
          winrate: total > 0 ? ((v.win/total)*100).toFixed(1) : "0.0",
        };
      });
      setTierData(tierData);
    }
  };
  reader.readAsArrayBuffer(file);
}

// ================== parseComboStatsFromExcel ==================
// ดึง 2-heroes Mid+Roam (B-F), DSL+Jug (AF-AJ), 3-heroes (Q-V)
// ================== parseComboStatsFromExcel ==================
export function parseComboStatsFromExcel(file, setComboStats, setDropdowns) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const data      = new Uint8Array(e.target.result);
    const wb        = XLSX.read(data, { type: "array" });
    const name      = wb.SheetNames.find(n => n.toLowerCase().includes("combo"));
    if (!name) {
      console.warn("ไม่พบชีท ComboStats");
         setComboStats({
             combo2: [...combo2MidRoam, ...combo2DslJug],
             combo2MidRoam,
             combo2DslJug,
             combo3
           });      if (setDropdowns) setDropdowns({ dates: [] });
      return;
    }

    const ws       = wb.Sheets[name];
    const sheetArr = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

    // 2-heroes (MID+Roaming): คอลัมน์ I (idx 8) ถึง N (idx 13), แถว 35-134 (idx 34–133)
    const combo2MidRoam = [];
    for (let i = 35; i < 134; ++i) {
      const row = sheetArr[i] || [];
      const h1  = row[8];   // I
      const h2  = row[9];   // J
      if (h1 && h2) {
        const total  = Number(row[11]) || 0;  // K
        const win    = Number(row[12]) || 0;  // L
        const losses = total - win;
        combo2MidRoam.push({
                 combo:     `${h1} + ${h2}`,
                 win,
                 total,
                 losses:    total - win,
                 comboType: "2-heroes (Mid+Roaming)"
               });
      }
    }

    // 2-heroes (DSL+Jungle): คอลัมน์ AM (idx 38) ถึง AR (idx 43), แถว 35-134 (idx 34–133)
    const combo2DslJug = [];
    for (let i = 35; i < 134; ++i) {
      const row = sheetArr[i] || [];
      const h1  = row[38];  // AM
      const h2  = row[39];  // AN
      if (h1 && h2) {
        const total  = Number(row[41]) || 0;  // AO
        const win    = Number(row[42]) || 0;  // AP
        const losses = total - win;
        combo2DslJug.push({
                 combo:     `${h1} + ${h2}`,
                 win,
                 total,
                 losses:    total - win,
                 comboType: "2-heroes (DSL+Jungle)"
               });
      }
    }

    // 3-heroes: คอลัมน์ X (idx 23) ถึง AD (idx 29), แถว 36-137 (idx 35–136)
    const combo3 = [];
    for (let i = 35; i < 137; ++i) {
      const row = sheetArr[i] || [];
      const h1  = row[23];  // X
      const h2  = row[24];  // Y
      const h3  = row[25];  // Z
      if (h1 && h2 && h3) {
        const total  = Number(row[26]) || 0;  // AA
        const win    = Number(row[27]) || 0;  // AB
        const losses = total - win;
        combo3.push({
          combo: `${h1} + ${h2} + ${h3}`,
          win,
          total,
          losses
        });
      }
    }

     setComboStats({
         combo2:         [...combo2MidRoam, ...combo2DslJug], // สร้าง array กลาง
         combo2MidRoam,
         combo2DslJug,
         combo3
       });
  };
  reader.readAsArrayBuffer(file);
}


// ================== parseFiltersFromAllScrimStats ==================
export function parseFiltersFromAllScrimStats(file, setFilterOptions) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const data      = new Uint8Array(e.target.result);
    const workbook  = XLSX.read(data, { type: "array" });
    const sheets    = workbook.SheetNames;
    const sheetName = sheets.includes("Winter_Scrim_Stats")
      ? "Winter_Scrim_Stats"
      : "All_Scrim_Stats";
    const ws   = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

    const dates = [];
    const teams = [];
    for (let i = 1; i < rows.length; i++) {
      const d = parseDate(rows[i][0]);
      const t = rows[i][2];
      if (d) dates.push(d);
      if (t) teams.push(String(t).trim());
    }
    setFilterOptions({
      dates: [...new Set(dates)].sort(),
      teams: [...new Set(teams)].sort(),
    });
  };
  reader.readAsArrayBuffer(file);
}

// ================== parseComboStatsSheet ==================
export function parseComboStatsSheet(sheet, sheetName) {
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

  let startRow, endRow;
  let posCols = {};

  if (sheetName === "TLN") {
    startRow = 44; endRow = 59;
    posCols = {
      DSL: [0,1,2,3],
      JUG: [5,6,7,8],
      MID: [10,11,12,13],
      ADL: [15,16,17,18],
      SUP: [20,21,22,23],
    };
  } else if (sheetName === "BRU") {
    startRow = 44; endRow = 57;
    posCols = {
      DSL: [0,1,2,3],
      JUG: [5,6,7,8],
      MID: [10,11,12,13],
      ADL: [15,16,17,18],
      SUP: [20,21,22,23],
    };
  } else {
    return { oneHero: [], combo2: [], combo3: [], totalGames: 0 };
  }

  const oneHero = [];
  let totalGames = 0;

  Object.entries(posCols).forEach(([position, [hCol, tCol, wCol, wrCol]]) => {
    for (let r = startRow; r <= endRow; r++) {
      const row = rows[r]; if (!row) continue;
      const h = row[hCol]; if (!h || !String(h).trim()) continue;
      const total = Number(row[tCol]) || 0;
      const win   = Number(row[wCol]) || 0;
      let winrate = Number(row[wrCol]);
      if (winrate <= 1) {
        winrate = total > 0 ? ((win/total)*100).toFixed(1) : 0;
      }
      totalGames += total;
      oneHero.push({
        hero:     String(h).trim(),
        total,
        win,
        winrate,
        position,
      });
    }
  });

  return { oneHero, combo2: [], combo3: [], totalGames };
}
