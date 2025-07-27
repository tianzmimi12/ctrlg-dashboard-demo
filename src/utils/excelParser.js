import * as XLSX from "xlsx";

// ================= ฟังก์ชันช่วย =================
function parseDate(value) {
  if (!value) return "";
  const s = typeof value === "number" ? String(value) : value.trim();
  if (/^\d{8}$/.test(s)) return s;
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) {
    const [d, m, y] = s.split("/");
    return `${y}${m.padStart(2, "0")}${d.padStart(2, "0")}`;
  }
  return "";
}
function formatDateShort(str) {
  if (!str || str.length !== 8) return "ไม่พบข้อมูล";
  const yyyy = str.slice(0, 4);
  const mm = str.slice(4, 6);
  const dd = str.slice(6, 8);
  return `${dd}/${mm}/${yyyy.slice(2)}`;
}
function buildWeekMap(dates) {
  const sorted = [...new Set(dates)].sort();
  const map = {};
  sorted.forEach((d, i) => {
    map[d] = `W${i + 1}`;
  });
  return map;
}
function isValidNumber(val) {
  return !isNaN(val) && typeof val === "number";
}
function cleanHero(name) {
  const s = String(name || "").trim();
  if (!s || s.toLowerCase() === "nan" || s.includes("ผลรวม")) return "";
  return s;
}
function excelSerialDateToYMD(serial) {
  if (!serial || isNaN(serial)) return "";
  const date = new Date(Math.round((serial - 25569) * 86400 * 1000));
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`;
}

// ================== สำหรับ HomePage.jsx เดิม (ห้ามแตะ) ==================
export function parseScrimStatsFromExcel(file, setGames) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    const ws = workbook.Sheets["All_Scrim_Stats"];
    const rowsArr = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

    const idx = {
      date: 0,
      competitor: 2,
      matchWin: 4,
      type: 6,
      side: 3,
      endType: 7,
      fsBan: [9, 10, 11, 12], // J,K,L,M
      fsPick: [13, 14, 15, 16, 17], // N,O,P,Q,R
    };

    const mainRows = rowsArr.slice(1).map(arr => ({
      Date: arr[idx.date],
      Competitor: arr[idx.competitor],
      MatchWin: arr[idx.matchWin],
      Type: arr[idx.type],
      TIME: arr[9],
      Side: arr[idx.side],
      EndType: arr[idx.endType],
      fsBanArr: idx.fsBan.map(i => (arr[i] || "").trim()).filter(Boolean),
      fsPickArr: idx.fsPick.map(i => (arr[i] || "").trim()).filter(Boolean),
      raw: arr,
    }));

    const allDates = mainRows.map(r => parseDate(r.Date)).filter(Boolean);
    const weekMap = buildWeekMap(allDates);

    function mapRow(row, weekMap) {
      const Date = parseDate(row.Date);
      const week = weekMap[Date] || "-";
      const side = row.Side || "";
      const competitor = row.Competitor || "ไม่พบข้อมูล";
      const matchRaw = row.MatchWin || "";
      const type = row.Type || "ไม่พบข้อมูล";
      const time = row.TIME || "";
      const endType = row.EndType || "";
      const fsBanArr = row.fsBanArr || [];

      let result = "Lose", win = 0, lose = 1;
      if (["FS", "Win", "1", 1].includes(matchRaw)) {
        result = "Win"; win = 1; lose = 0;
      }

      return {
        Date,
        dateStr: formatDateShort(Date),
        week,
        side,
        competitor,
        type,
        endType,
        time,
        fsBan: fsBanArr.join(", "),
        result,
        win,
        lose,
        match: matchRaw,
        raw: row.raw
      };
    }

    const parsedGames = mainRows
      .map(row => mapRow(row, weekMap))
      .filter(r => r.Date && r.competitor);

    setGames(parsedGames); // เฉพาะ All_Scrim_Stats
  };
  reader.readAsArrayBuffer(file);
}

// ================== สำหรับ TierData.js (สำหรับข้อมูล hero+position) ==================
export function parseGamesFromExcel(file, setGames, setTierData) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    // ----------- 1-Hero: All_Scrim_Stats -----------
    const mainSheet = "All_Scrim_Stats";
    const ws = workbook.Sheets[mainSheet];
    const rowsArr = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

    const idx = {
      date: 0,
      competitor: 2,
      matchWin: 4,
      type: 6,
      side: 3,
      endType: 7,
      // FS Pick 1-5: O=14, P=15, Q=16, R=17, S=18
      // FS Position 1-5: T=19, U=20, V=21, W=22, X=23
    };

    // ======= จุดที่แก้ไข (push ทุก index) =======
    const mainRows = rowsArr.slice(1).map(arr => {
      const fsPickArr = [];
      const fsPositionArr = [];
      for (let i = 0; i < 5; i++) {
        const hero = cleanHero(arr[14 + i]);
        const pos = arr[19 + i] ? String(arr[19 + i]).trim() : "";
        fsPickArr.push(hero);     // <<== push แม้ "" ก็ push
        fsPositionArr.push(pos);  // <<== push แม้ "" ก็ push
      }
      return {
        Date: arr[idx.date],
        Competitor: arr[idx.competitor],
        "Match Win": arr[idx.matchWin],
        Type: arr[idx.type],
        TIME: arr[9],
        Side: arr[idx.side],
        EndType: arr[idx.endType],
        fsPickArr,
        fsPositionArr,
        raw: arr,
      };
    });

    const allDates = mainRows.map(r => parseDate(r.Date)).filter(Boolean);
    const weekMap = buildWeekMap(allDates);

    function mapRow(row, weekMap) {
      const Date = parseDate(row.Date);
      const week = weekMap[Date] || "-";
      const side = (row.Side || "").toLowerCase();
      const competitor = row.Competitor || "ไม่พบข้อมูล";
      const matchRaw = row["Match Win"] || "";
      const type = row.Type || "ไม่พบข้อมูล";
      const time = row.TIME || "";
      const endType = row.EndType || "";
      const fsPickArr = row.fsPickArr || [];
      const fsPositionArr = row.fsPositionArr || [];

      let result = "Lose", win = 0, lose = 1;
      if (["FS", "Win", "1", 1].includes(matchRaw)) {
        result = "Win"; win = 1; lose = 0;
      }

      return {
        Date,
        dateStr: formatDateShort(Date),
        week,
        side,
        competitor,
        type,
        endType,
        time,
        fsPick: fsPickArr,
        fsPosition: fsPositionArr,
        result,
        win,
        lose,
        match: matchRaw,
        raw: row.raw
      };
    }

    const parsedGames = mainRows
      .map(row => mapRow(row, weekMap))
      .filter(r => r.Date && r.competitor);

    setGames(parsedGames);

    // ======= TIER DATA =======
    if (setTierData) {
      const heroMap = {};
      parsedGames.forEach(g => {
        const add = (name, type, win, lose) => {
          if (!name) return;
          if (!heroMap[name]) heroMap[name] = { win: 0, lose: 0, type };
          heroMap[name].win += win || 0;
          heroMap[name].lose += lose || 0;
        };

        (g.fsPick || []).forEach(h => add(h.trim(), "1-hero", g.win, g.lose));
        if (g.competitor) add(g.competitor.trim(), "team", g.win, g.lose);
      });

      const tierData = Object.entries(heroMap).map(([name, val]) => {
        const total = val.win + val.lose;
        const winrate = total > 0 ? ((val.win / total) * 100).toFixed(1) : "0.0";
        return {
          name,
          ...val,
          total,
          winrate,
          comboType: val.type || "unknown"
        };
      });

      setTierData(tierData);
    }
  };
  reader.readAsArrayBuffer(file);
}

// ==================== สำหรับ TierData.js: ComboStats ====================
export function parseComboStatsFromExcel(file, setComboStats, setDropdowns) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets["ComboStats"], { header: 1, defval: "" });

    // ----------- ดึง dropdownDates จาก ComboStats -----------
    const heroCols = [1, 6, 11, 16, 22]; // B, G, L, Q, W
    let dropdownDates = [];
    for (let col of heroCols) {
      for (let row = 5; row < 100; row++) {
        let val = sheet[row]?.[col];
        if (/^\d{8}$/.test(val) && !dropdownDates.includes(val)) {
          dropdownDates.push(val);
        }
      }
    }
    // combo2: B32 ลงไป
    for (let row = 32; row < 100; row++) {
      let val = sheet[row]?.[1];
      if (/^\d{8}$/.test(val) && !dropdownDates.includes(val)) {
        dropdownDates.push(val);
      }
    }
    // combo3: P32 ลงไป
    for (let row = 32; row < 100; row++) {
      let val = sheet[row]?.[15];
      if (/^\d{8}$/.test(val) && !dropdownDates.includes(val)) {
        dropdownDates.push(val);
      }
    }
    dropdownDates = dropdownDates.sort();

    // ----------- 1-Hero: map วันที่ -----------
    const heroDates = [
      sheet[1]?.[1] || "",
      sheet[1]?.[6] || "",
      sheet[1]?.[11] || "",
      sheet[1]?.[16] || "",
      sheet[1]?.[22] || "",
    ];

    const oneHero = [];
    const heroGroup = [
      { heroCol: 0, gamesCol: 1, winCol: 2, winrateCol: 3, position: sheet[4]?.[0], date: heroDates[0] },
      { heroCol: 5, gamesCol: 6, winCol: 7, winrateCol: 8, position: sheet[4]?.[5], date: heroDates[1] },
      { heroCol: 10, gamesCol: 11, winCol: 12, winrateCol: 13, position: sheet[4]?.[10], date: heroDates[2] },
      { heroCol: 15, gamesCol: 16, winCol: 17, winrateCol: 18, position: sheet[4]?.[15], date: heroDates[3] },
      { heroCol: 21, gamesCol: 22, winCol: 23, winrateCol: 24, position: sheet[4]?.[21], date: heroDates[4] },
    ];
    heroGroup.forEach(({ heroCol, gamesCol, winCol, winrateCol, position, date }) => {
      let row = 5;
      while (
        sheet[row] &&
        sheet[row][heroCol] &&
        sheet[row][heroCol] !== "" &&
        !String(sheet[row][heroCol]).includes("ผลรวม")
      ) {
        const hero = sheet[row][heroCol];
        const games = Number(sheet[row][gamesCol]) || 0;
        const win = Number(sheet[row][winCol]) || 0;
        const rawWinrate = sheet[row][winrateCol];
        const winrate =
          Number(rawWinrate) > 1
            ? Number(rawWinrate).toFixed(2)
            : (Number(rawWinrate) * 100).toFixed(2);
        const lose = games - win;
        oneHero.push({
          hero,
          win,
          total: games,
          winrate,
          losses: lose,
          position: position || "",
          date: date || "",
        });
        row++;
      }
    });

    // ----------- 2-heroes: วันที่อยู่ที่บรรทัด 30, คอลัมน์ B -----------
    const combo2Date = sheet[30]?.[1] || "";
    const combo2 = [];
    let row = 33;
    while (
      sheet[row] &&
      sheet[row][7] &&
      sheet[row][7] !== ""
    ) {
      const mid = sheet[row][7];
      const roam = sheet[row][8];
      const pick = Number(sheet[row][9]) || 0;
      const win = Number(sheet[row][10]) || 0;
      combo2.push({
        combo: `${mid} + ${roam}`,
        win,
        total: pick,
        winrate: pick > 0 ? ((win / pick) * 100).toFixed(1) : "0.0",
        losses: pick - win,
        date: combo2Date,
      });
      row++;
    }
    // ----------- 3-heroes: วันที่อยู่ที่บรรทัด 31, คอลัมน์ P -----------
    const combo3Date = sheet[31]?.[15] || "";
    const combo3 = [];
    row = 33;
    while (
      sheet[row] &&
      sheet[row][21] &&
      sheet[row][21] !== ""
    ) {
      const jungle = sheet[row][21];
      const mid = sheet[row][22];
      const roam = sheet[row][23];
      const pick = Number(sheet[row][24]) || 0;
      const win = Number(sheet[row][25]) || 0;
      combo3.push({
        combo: `${jungle} + ${mid} + ${roam}`,
        win,
        total: pick,
        winrate: pick > 0 ? ((win / pick) * 100).toFixed(1) : "0.0",
        losses: pick - win,
        date: combo3Date,
      });
      row++;
    }

    setComboStats({ oneHero, combo2, combo3 });
    if (setDropdowns) setDropdowns({ dates: dropdownDates });
  };
  reader.readAsArrayBuffer(file);
}

// ================== ดึงวันที่/ทีม จาก All_Scrim_Stats (ไม่กระทบ HomePage.jsx) ==================
export function parseFiltersFromAllScrimStats(file, setFilterOptions) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const ws = workbook.Sheets["All_Scrim_Stats"];
    const rowsArr = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

    // index date = 0, competitor = 2 (A=0, C=2)
    const dateCol = 0;
    const competitorCol = 2;

    const dateList = [];
    const competitorList = [];

    for (let i = 1; i < rowsArr.length; i++) {
      const row = rowsArr[i];
      let dateValue = row[dateCol];
      const teamValue = row[competitorCol];

      // === แปลง excel serial date หรือ string date ให้ standardized ===
      if (typeof dateValue === "number" && dateValue > 40000 && dateValue < 60000) {
        dateValue = excelSerialDateToYMD(dateValue);
      }
      if (typeof dateValue === "string" && /^\d{2}\/\d{2}\/\d{4}$/.test(dateValue)) {
        const [d, m, y] = dateValue.split("/");
        dateValue = `${y}${m.padStart(2, "0")}${d.padStart(2, "0")}`;
      }

      if (dateValue) dateList.push(String(dateValue).trim());
      if (teamValue) competitorList.push(String(teamValue).trim());
    }
    const dates = [...new Set(dateList)].filter(Boolean);
    const teams = [...new Set(competitorList)].filter(Boolean);

    setFilterOptions({ dates, teams });
  };
  reader.readAsArrayBuffer(file);
}
