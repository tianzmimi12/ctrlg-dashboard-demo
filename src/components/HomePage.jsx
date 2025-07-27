import React, { useState, useMemo } from "react";
import { Bar, Pie, Line, Radar } from "react-chartjs-2";
import { motion, AnimatePresence } from "framer-motion";
import ReactSelect from "react-select";
import { useNavigate } from "react-router-dom";
import { Scatter } from 'react-chartjs-2';
import Chart from 'chart.js/auto';                      // สำหรับ matrix chart
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';


import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend,
  ChartDataLabels,
  MatrixController,
  MatrixElement
);

const theme = {
  primary: "#7B1FA2",
  secondary: "#00FFA3",
  accent: "#fae100",
  success: "#00c47a",
  danger: "#FF4B4B",
  blue: "#1976d2",
  red: "#e53935",
  card: "#fff",
  tableHeader: "#ede6fa",
  shadow: "0 8px 42px 0 rgba(123,31,162,0.16)",
  glow: "0 0 60px 12px #d5b3ff70",
  bgGradient: "linear-gradient(120deg,#fff7f9 0%,#D0FFFC 70%,#f8d2ff 100%)",
  tag: "#f3ecff",
  chartGlow: "0 0 34px #aa63ff50",
  chartBorder: "2px solid #ddc6ff",
  purpleGradient: "linear-gradient(135deg, #7B1FA2 0%, #9C27B0 100%)",
  tealGradient: "linear-gradient(135deg, #00B4DB 0%, #0083B0 100%)",
};

const icons = {
  win: "✅",
  lose: "❌",
  fire: "🔥",
  blue: "🔵",
  red: "🔴",
  hero: "🦸‍♂️",
  clock: "⏰",
  chart: "📈",
  trend: "📊",
  trophy: "🏆",
  sword: "⚔️",
  timer: "⏱️",
  search: "🔍",
  filter: "⚙️",
  stats: "📊",
  team: "👥",
  calendar: "📅",
  menu: "☰",
};

function formatDateShort(str) {
  if (!str) return "ไม่พบข้อมูล";
  const s = String(str);
  if (s.length !== 8) return "ไม่พบข้อมูล";
  const yyyy = s.slice(0, 4),
    mm = s.slice(4, 6),
    dd = s.slice(6, 8);
  return `${dd}/${mm}/${yyyy.slice(2)}`;
}

function formatTime(t) {
  if (!t || t === "" || isNaN(Number(t))) return "-";
  return Number(t).toFixed(1);
}

function buildWeekMap(games) {
  const dates = [
    ...new Set(
      games
        .map((g) => g.Date)
        .filter((d) => typeof d === "string" && d.length === 8)
    ),
  ].sort(); // YYYYMMDD ascending
  const weekMap = {};
  dates.forEach((d, i) => (weekMap[d] = `W${i + 1}`));
  return weekMap;
}

function getMatchResult(matchValue) {
  if (!matchValue)
    return { label: "ไม่พบข้อมูล", color: "#aaa", status: "unknown", icon: "❓" };
  if (String(matchValue).toUpperCase() === "FS")
    return { label: "Win", color: theme.success, status: "win", icon: icons.win };
  return { label: "Lose", color: theme.danger, status: "lose", icon: icons.lose };
}

const matchBgColors = [
  "#f8fff2",
  "#fff6f6",
  "#f6f8ff",
  "#fcf7ff",
  "#f7ffff",
  "#f9f4ff",
];
const heroColors = [
  theme.primary,
  theme.secondary,
  theme.blue,
  theme.red,
  theme.accent,
];

function hexToRgba(hex, alpha = 0.7) {
  const r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function HomePage({ games = [] }) {
  const navigate = useNavigate();

  // Filter States
  const [filter, setFilter] = useState({
    result: "all",
    side: "all",
    competitor: "all",
  });
  const [search, setSearch] = useState("");
  const [competitors, setCompetitors] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [page, setPage] = useState(1);
  const [showSidebar, setShowSidebar] = useState(false);
  const [filterMode, setFilterMode] = useState("date");
  const [selectedWeeks, setSelectedWeeks] = useState([]);
  const [selectedWeekRange, setSelectedWeekRange] = useState({
    from: "",
    to: "",
  });
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState({
    from: "20250602",
    to: "",
  });

  const rowsPerPage = 15;

  // Preprocess data
  const validGames = useMemo(
    () => games.filter((g) => g.Date && String(g.Date).length === 8),
    [games]
  );
  const weekMap = useMemo(() => buildWeekMap(validGames), [validGames]);

  // Labels & options
  const weekLabels = [...new Set(Object.values(weekMap))].sort(
    (a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1))
  );

  // —— ปรับตรงนี้: สร้าง dateOptions จากค่า Date แล้ว sort ตาม YYYYMMDD ——
  const dateOptions = Array.from(
    new Set(
      validGames
        .map((g) => g.Date)
        .filter((d) => typeof d === "string" && d.length === 8)
    )
  )
    .sort() // จากเก่า→ใหม่; ถ้าต้องการใหม่→เก่า ให้ .reverse()
    .map((date) => ({
      value: date,
      label: formatDateShort(date),
    }));

  const types = useMemo(
    () =>
      [
        ...new Set(
          validGames.map((g) => g.type).filter((x) => x && x !== "ไม่พบข้อมูล")
        ),
      ],
    [validGames]
  );
  const allCompetitors = useMemo(
    () => [...new Set(validGames.map((g) => g.competitor).filter(Boolean))],
    [validGames]
  );
  const weekOptions = weekLabels.map((w) => ({ value: w, label: w }));

  // Hero types
  const heroTypes = useMemo(() => {
    const counts = {};
    validGames.forEach((g) => {
      const t = g.type || g.Type || "ไม่พบข้อมูล";
      counts[t] = (counts[t] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([t]) => t);
  }, [validGames]);

  // Filtered for table (sorted by Date desc)
  const filteredGames = useMemo(() => {
    let arr = validGames;
    if (filter.result !== "all") {
      arr = arr.filter(
        (g) =>
          (String(g.match || g["Match Win"] || "").toUpperCase() === "FS") ===
          (filter.result === "Win")
      );
    }
    if (filter.side !== "all") {
      arr = arr.filter(
        (g) => (g.side || g.Side || "").toLowerCase() === filter.side
      );
    }
    if (filter.competitor !== "all") {
      arr = arr.filter((g) => g.competitor === filter.competitor);
    }
    if (competitors.length > 0) {
      const sel = competitors.map((x) => x.value);
      arr = arr.filter((g) => sel.includes(g.competitor));
    }
    if (selectedTypes.length > 0) {
      const sel = selectedTypes.map((x) => x.value);
      arr = arr.filter((g) => sel.includes(g.type));
    }
    if (filterMode === "week") {
      if (selectedWeeks.length > 0) {
        arr = arr.filter((g) => selectedWeeks.includes(weekMap[g.Date]));
      } else if (selectedWeekRange.from && selectedWeekRange.to) {
        const f = weekLabels.indexOf(selectedWeekRange.from),
          t = weekLabels.indexOf(selectedWeekRange.to);
        if (f !== -1 && t !== -1) {
          const sl = weekLabels.slice(
            Math.min(f, t),
            Math.max(f, t) + 1
          );
          arr = arr.filter((g) => sl.includes(weekMap[g.Date]));
        }
      }
    } else {
      if (selectedDates.length > 0) {
        arr = arr.filter((g) => selectedDates.includes(g.Date));
      }
      if (selectedDateRange.from) {
        arr = arr.filter((g) => g.Date >= selectedDateRange.from);
      }
      if (selectedDateRange.to) {
        arr = arr.filter((g) => g.Date <= selectedDateRange.to);
      }
    }
    if (search.trim()) {
      const txt = search.trim().toLowerCase();
      arr = arr.filter(
        (g) =>
          (g.competitor &&
            g.competitor.toLowerCase().includes(txt)) ||
          (g.type && g.type.toLowerCase().includes(txt)) ||
          (g.endType && g.endType.toLowerCase().includes(txt)) ||
          (g.Date && formatDateShort(g.Date).includes(txt))
      );
    }
    return [...arr].sort((a, b) =>
      String(b.Date).localeCompare(String(a.Date))
    );
  }, [
    validGames,
    filter,
    search,
    competitors,
    selectedTypes,
    filterMode,
    selectedWeeks,
    selectedWeekRange,
    selectedDates,
    selectedDateRange,
    weekMap,
    weekLabels,
  ]);

  // Filtered for charts (unchanged)
  const filteredGamesForCharts = useMemo(() => {
    let arr = validGames;
    if (filter.result !== "all") {
      arr = arr.filter(
        (g) =>
          (String(g.match || g["Match Win"] || "").toUpperCase() === "FS") ===
          (filter.result === "Win")
      );
    }
    if (filter.side !== "all") {
      arr = arr.filter(
        (g) => (g.side || g.Side || "").toLowerCase() === filter.side
      );
    }
    if (filter.competitor !== "all") {
      arr = arr.filter((g) => g.competitor === filter.competitor);
    }
    if (competitors.length > 0) {
      const sel = competitors.map((x) => x.value);
      arr = arr.filter((g) => sel.includes(g.competitor));
    }
    if (selectedTypes.length > 0) {
      const sel = selectedTypes.map((x) => x.value);
      arr = arr.filter((g) => sel.includes(g.type));
    }
    if (filterMode === "week") {
      if (selectedWeeks.length > 0) {
        arr = arr.filter((g) => selectedWeeks.includes(weekMap[g.Date]));
      } else if (selectedWeekRange.from && selectedWeekRange.to) {
        const f = weekLabels.indexOf(selectedWeekRange.from),
          t = weekLabels.indexOf(selectedWeekRange.to);
        if (f !== -1 && t !== -1) {
          const sl = weekLabels.slice(
            Math.min(f, t),
            Math.max(f, t) + 1
          );
          arr = arr.filter((g) => sl.includes(weekMap[g.Date]));
        }
      }
    } else {
      if (selectedDates.length > 0) {
        arr = arr.filter((g) => selectedDates.includes(g.Date));
      }
      if (selectedDateRange.from) {
        arr = arr.filter((g) => g.Date >= selectedDateRange.from);
      }
      if (selectedDateRange.to) {
        arr = arr.filter((g) => g.Date <= selectedDateRange.to);
      }
    }
    if (search.trim()) {
      const txt = search.trim().toLowerCase();
      arr = arr.filter(
        (g) =>
          (g.competitor &&
            g.competitor.toLowerCase().includes(txt)) ||
          (g.type && g.type.toLowerCase().includes(txt)) ||
          (g.endType && g.endType.toLowerCase().includes(txt)) ||
          (g.Date && formatDateShort(g.Date).includes(txt))
      );
    }
    return arr;
  }, [
    validGames,
    filter,
    search,
    competitors,
    selectedTypes,
    filterMode,
    selectedWeeks,
    selectedWeekRange,
    selectedDates,
    selectedDateRange,
    weekMap,
    weekLabels,
  ]);

  // --- CHARTS DATA ---

  // 1. Pie Win/Lose
  const totalWin = filteredGamesForCharts.filter(
    (g) =>
      String(g.match || g["Match Win"] || "").toUpperCase() === "FS"
  ).length;
  const totalLose = filteredGamesForCharts.length - totalWin;
  const pieWinLose = {
    labels: ["Lose", "Win"],
    datasets: [
      {
        data: [totalLose, totalWin],
        backgroundColor: [theme.danger, theme.success],
        borderWidth: 2,
        borderColor: "#fff",
        hoverBorderWidth: 3,
        hoverOffset: 15,
      },
    ],
  };
  const pieWinLoseOptions = {
    rotation: -Math.PI,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          font: { size: 18, weight: "bold" },
          color: "#673AB7",
          usePointStyle: true,
          padding: 20,
          pointStyle: "circle",
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#fff",
        titleColor: "#673AB7",
        bodyColor: "#424242",
        borderColor: "#c7a2ff",
        borderWidth: 1,
        titleFont: { size: 16, weight: "bold" },
        bodyFont: { size: 16 },
        callbacks: {
          label: (ctx) => {
            const v = ctx.raw || 0;
            const tot = ctx.dataset.data.reduce((a, b) => a + b, 0);
            return `${ctx.label}: ${v} (${Math.round((v / tot) * 100)}%)`;
          },
        },
      },
      datalabels: {
        display: true,
        color: "#fff",
        font: { size: 22, weight: "bold" },
        borderRadius: 8,
        backgroundColor: (ctx) => ctx.dataset.backgroundColor[ctx.dataIndex],
        padding: 8,
        formatter: (v, ctx) => {
          const tot = ctx.dataset.data.reduce((a, b) => a + b, 0);
          return `${Math.round((v / tot) * 100)}%`;
        },
      },
    },
    cutout: "72%",
    layout: { padding: 20 },
    animation: { animateScale: true, animateRotate: true },
  };
  

  // --- Dynamic week labels for Radar chart ---
  const dynamicWeekLabels = useMemo(() => {
    const weeks = [
      ...new Set(filteredGamesForCharts.map((g) => weekMap[g.Date])),
    ];
    return weeks
      .filter(Boolean)
      .sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)));
  }, [filteredGamesForCharts, weekMap]);

  // 2. Hero Performance by Week (Radar)
  const heroRadarData = useMemo(() => {
    const topHeroes = heroTypes.slice(0, 5);
    return {
      labels: dynamicWeekLabels,
      datasets: topHeroes.map((hero, idx) => {
        const data = dynamicWeekLabels.map((w) => {
          const gamesIn = filteredGamesForCharts.filter(
            (g) => weekMap[g.Date] === w && g.type === hero
          );
          const wins = gamesIn.filter(
            (g) =>
              String(g.match || g["Match Win"] || "").toUpperCase() === "FS"
          ).length;
          return gamesIn.length
            ? Number(((wins / gamesIn.length) * 100).toFixed(1))
            : 0;
        });
        const color = heroColors[idx % heroColors.length];
        return {
          label: hero,
          data,
          borderColor: color,
          backgroundColor: hexToRgba(color, 0.3),
          pointBackgroundColor: color,
          pointBorderColor: "#fff",
          pointRadius: 5,
          fill: true,
          tension: 0.3,
        };
      }),
    };
  }, [dynamicWeekLabels, heroTypes, filteredGamesForCharts, weekMap]);

  const heroRadarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: { color: "#e3daff", lineWidth: 2 },
        grid: { color: "#f3ecff" },
        suggestedMin: 0,
        suggestedMax: 100,
        pointLabels: {
          color: "#7B1FA2",
          font: { size: 18, weight: "bold" },
          padding: 8,
        },
        ticks: {
          color: "#8157c6",
          font: { size: 14, weight: "bold" },
          showLabelBackdrop: false,
          stepSize: 20,
          callback: (v) => `${v}%`,
        },
      },
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: { size: 16, weight: "bold" },
          color: "#7B1FA2",
          usePointStyle: true,
          padding: 20,
          pointStyle: "rectRounded",
        },
      },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#7B1FA2",
        bodyColor: "#222",
        bodyFont: { size: 17, weight: "bold" },
        borderColor: "#bdb8d7",
        borderWidth: 1.5,
        callbacks: {
          // แสดงหัวข้อเป็นชื่อ Hero
          title: (tooltipItems) => tooltipItems[0].dataset.label,
          // แสดง WinRate พร้อมคำว่า "(WinRate)"
          label: (tooltipItem) => `WinRate: ${tooltipItem.raw}%`,
        },
      },
      datalabels: { display: false },
    },
    layout: { padding: 12 },
  };
  

  // 3. End Type Distribution (Pie)
  const endTypeMap = {};
  filteredGames.forEach((g) => {
    const k = g.endType || g.EndType || "ไม่พบข้อมูล";
    endTypeMap[k] = (endTypeMap[k] || 0) + 1;
  });
  const endTypeLabels = Object.keys(endTypeMap);
  const endTypePie = {
    labels: endTypeLabels,
    datasets: [
      {
        data: Object.values(endTypeMap),
        backgroundColor: endTypeLabels.map(
          (_, i) => `hsl(${(i * 360) / endTypeLabels.length},85%,68%)`
        ),
        borderWidth: 2,
        borderColor: "#fff",
        hoverBorderWidth: 3,
        hoverOffset: 15,
      },
    ],
  };
  const endTypePieOptions = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: { weight: "bold", size: 15 },
          padding: 18,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        bodyFont: { size: 16 },
        callbacks: {
          label: (ctx) => {
            const v = ctx.raw || 0;
            const tot = ctx.dataset.data.reduce((a, b) => a + b, 0);
            return `${ctx.label}: ${v} (${Math.round((v / tot) * 100)}%)`;
          },
        },
      },
      datalabels: {
        display: true,
        color: "#333",
        font: { size: 16, weight: "bold" },
        formatter: (v, ctx) => {
          const tot = ctx.dataset.data.reduce((a, b) => a + b, 0);
          return `${Math.round((v / tot) * 100)}%`;
        },
      },
    },
    cutout: "68%",
    animation: { animateScale: true, animateRotate: true },
  };

  // 4. Win/Lose by Rival (Line)
  const rivals = [
    ...new Set(
      filteredGamesForCharts.map((g) => g.competitor).filter(Boolean)
    ),
  ];
  const winByRival = {},
    loseByRival = {};
  rivals.forEach((r) => {
    winByRival[r] = filteredGamesForCharts.filter(
      (g) =>
        g.competitor === r &&
        String(g.match || g["Match Win"] || "").toUpperCase() === "FS"
    ).length;
    loseByRival[r] = filteredGamesForCharts.filter(
      (g) =>
        g.competitor === r &&
        String(g.match || g["Match Win"] || "").toUpperCase() !== "FS"
    ).length;
  });
  const rivalLineData = {
    labels: rivals,
    datasets: [
      {
        label: "Win",
        data: rivals.map((r) => winByRival[r]),
        borderColor: theme.success,
        backgroundColor: `${theme.success}44`,
        tension: 0.38,
        pointRadius: 6,
        pointBackgroundColor: "#fff",
        pointBorderWidth: 2,
        fill: false,
      },
      {
        label: "Lose",
        data: rivals.map((r) => loseByRival[r]),
        borderColor: theme.danger,
        backgroundColor: `${theme.danger}55`,
        tension: 0.38,
        pointRadius: 6,
        pointBackgroundColor: "#fff",
        pointBorderWidth: 2,
        fill: false,
      },
    ],
  };
  const rivalLineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: { size: 17, weight: "bold" },
          color: "#7B1FA2",
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#1976d2",
        bodyColor: "#333",
        borderColor: "#bdb8d7",
        borderWidth: 1.5,
        bodyFont: { size: 16 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "#f7f2ff", borderDash: [4, 6] },
        ticks: {
          color: "#7B1FA2",
          font: { size: 16, weight: "bold" },
        },
      },
      x: {
        grid: { display: false },
        ticks: {
          color: "#1976d2",
          font: { size: 16, weight: "bold" },
        },
      },
    },
  };

  // 5. Dual Pie for Game Duration
  const shortGames = filteredGames.filter(
    (g) => !isNaN(+g.time) && Number(g.time) < 15
  );
  const longGames = filteredGames.filter(
    (g) => !isNaN(+g.time) && Number(g.time) >= 15
  );
  const shortWinList = shortGames
    .filter(
      (g) =>
        String(g.match || g["Match Win"] || "").toUpperCase() === "FS"
    )
    .map((g) => `${weekMap[g.Date]} (${formatTime(g.time)} นาที)`);
  const shortLoseList = shortGames
    .filter(
      (g) =>
        String(g.match || g["Match Win"] || "").toUpperCase() !== "FS"
    )
    .map((g) => `${weekMap[g.Date]} (${formatTime(g.time)} นาที)`);
  const longWinList = longGames
    .filter(
      (g) =>
        String(g.match || g["Match Win"] || "").toUpperCase() === "FS"
    )
    .map((g) => `${weekMap[g.Date]} (${formatTime(g.time)} นาที)`);
  const longLoseList = longGames
    .filter(
      (g) =>
        String(g.match || g["Match Win"] || "").toUpperCase() !== "FS"
    )
    .map((g) => `${weekMap[g.Date]} (${formatTime(g.time)} นาที)`);
  const pieShortData = {
    labels: ["Lose", "Win"],
    datasets: [
      {
        data: [shortLoseList.length, shortWinList.length],
        backgroundColor: [theme.danger, theme.success],
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };
  const pieLongData = {
    labels: ["Lose", "Win"],
    datasets: [
      {
        data: [longLoseList.length, longWinList.length],
        backgroundColor: [theme.danger, theme.success],
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };
  const pieSimpleOptions = {
    plugins: {
      legend: { position: "bottom", labels: { font: { size: 14, weight: "bold" } } },
      tooltip: {
        mode: "nearest",
        intersect: false,
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.raw} เกม`,
          afterBody: (ctxArr) => {
            const idx = ctxArr[0].dataIndex;
            const isShort = ctxArr[0].dataset === pieShortData.datasets[0];
            const list = isShort
              ? (idx === 1 ? shortWinList : shortLoseList)
              : (idx === 1 ? longWinList : longLoseList);
            return ["สัปดาห์/เวลา:", ...list.map((it) => `• ${it}`)];
          },
        },
      },
    },
  };

  // Reset pagination on filter changes
  React.useEffect(() => setPage(1), [
    search,
    filter,
    competitors,
    selectedTypes,
    filterMode,
    selectedWeeks,
    selectedWeekRange,
    selectedDates,
    selectedDateRange,
    validGames.length,
  ]);

  // Styles
  const chartTitleStyle = {
    color: "#8B27C6",
    fontWeight: 900,
    fontSize: "1.18rem",
    marginBottom: 12,
    letterSpacing: 0.6,
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  };
  const thStyle = {
    background: theme.tableHeader,
    color: "#7B1FA2",
    padding: "12px 8px",
    fontWeight: 800,
    textAlign: "center",
    fontSize: "1.08rem",
    borderBottom: "2.5px solid #e1b6ff",
    position: "sticky",
    top: 0,
    zIndex: 1,
  };
  const tdStyle = {
    padding: "12px 8px",
    borderBottom: "1px solid #eee",
    textAlign: "center",
    fontWeight: 700,
    transition: "all 0.2s",
  };
  const inputStyle = {
    background: "#fff",
    border: "1.5px solid #c5b8d6",
    borderRadius: 12,
    padding: "8px 12px 8px 36px",
    fontWeight: 500,
    fontSize: "1.01rem",
    color: "#23223c",
    outline: "none",
    minWidth: 100,
    boxShadow: "0 1.5px 7px #ede6fa55",
    transition: "all 0.2s",
  };
  const clearBtnStyle = {
    background: "#7B1FA2",
    color: "#fff",
    fontWeight: 800,
    border: "none",
    borderRadius: 12,
    padding: "8px 18px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "all 0.2s",
  };
  const reactSelectStyle = {
    control: (provided, state) => ({
      ...provided,
      borderRadius: 13,
      minHeight: 38,
      border: state.isFocused
        ? "2.2px solid #7B1FA2"
        : "1.4px solid #bdb8d7",
      boxShadow: state.isFocused
        ? "0 0 0 2px #b19fff33"
        : "0 2px 12px #f3eaff22",
      fontWeight: 700,
      fontSize: "1rem",
      color: "#7B1FA2",
      background: "#fff",
      outline: "none",
    }),
    multiValue: (provided) => ({
      ...provided,
      background: "#ede6fa",
      color: "#7B1FA2",
      fontWeight: 700,
      borderRadius: 8,
    }),
    option: (provided, state) => ({
      ...provided,
      background: state.isSelected
        ? "#7B1FA2"
        : state.isFocused
        ? "#f1ecff"
        : "#fff",
      color: state.isSelected ? "#fff" : "#7B1FA2",
      fontWeight: 700,
    }),
  };
  const selectTheme = (t) => ({
    ...t,
    colors: {
      ...t.colors,
      primary: "#7B1FA2",
      primary25: "#f3ecff",
      neutral0: "#fff",
      neutral80: "#7B1FA2",
    },
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.bgGradient,
        fontFamily: "'Kanit',sans-serif",
        paddingBottom: 90,
        position: "relative",
      }}
    >
      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))",
          gap: 14,
          margin: "28px auto 8px auto",
          maxWidth: 1100,
        }}
      >
        <SummaryCard
          icon={icons.trophy}
          label="Win Rate"
          value={
            filteredGames.length === 0
              ? "0%"
              : (
                  (filteredGames.filter(
                    (g) =>
                      String(g.match || g["Match Win"] || "").toUpperCase() ===
                      "FS"
                  ).length /
                    filteredGames.length) *
                  100
                ).toFixed(2) + "%"
          }
          color={theme.secondary}
          gradient={theme.tealGradient}
        />
        <SummaryCard
          icon={icons.chart}
          label="Total Matches"
          value={filteredGames.length}
          color="#b692ff"
          gradient={theme.purpleGradient}
        />
        <SummaryCard
          icon={icons.fire}
          label="Best Week"
          value={(() => {
            const wk = {};
            filteredGames.forEach((g) => {
              const w = weekMap[g.Date] || "-";
              wk[w] = wk[w] || { win: 0, lose: 0 };
              if (
                String(g.match || g["Match Win"] || "").toUpperCase() === "FS"
              )
                wk[w].win++;
              else wk[w].lose++;
            });
            return Object.entries(wk).sort((a, b) => b[1].win - a[1].win)[0]?.[0] || "-";
          })()}
          color="#f99d0e"
          gradient="linear-gradient(135deg,#FFB347 0%,#FF8C00 100%)"
        />
        <SummaryCard
          icon={icons.sword}
          label="คู่แข่ง"
          value={
            filter.competitor !== "all"
              ? filter.competitor
              : competitors.length > 0
              ? competitors.map((c) => c.label).join(", ")
              : "-"
          }
          color="#e53935"
          gradient="linear-gradient(135deg,#ffe4e4 0%,#f7ecff 100%)"
        />
        <SummaryCard
          icon={icons.calendar}
          label="Last Updated"
          value={
            filteredGames.length > 0 && filteredGames[0].timestamp
              ? String(filteredGames[0].timestamp).substring(0, 10)
              : "-"
          }
          color="#65dfc9"
          gradient="linear-gradient(135deg,#00B4DB 0%,#0083B0 100%)"
        />
      </motion.div>

      {/* Sidebar Toggle */}
      <div
        style={{
          position: "fixed",
          top: 30,
          right: 30,
          zIndex: 120,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        {!showSidebar && (
          <motion.button
            onClick={() => setShowSidebar(true)}
            whileHover={{ scale: 1.1 }}
            style={{
              background: "#fff",
              border: "2.5px solid #7B1FA2",
              color: "#7B1FA2",
              borderRadius: 17,
              fontWeight: 800,
              fontSize: 23,
              boxShadow: "0 4px 24px #c2b3e7bb",
              cursor: "pointer",
              padding: "6px 15px",
              transition: "all 0.15s",
            }}
            title="เปิดฟิลเตอร์"
          >
            {icons.menu} ฟิลเตอร์
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {showSidebar && (
          <motion.div
            key="sidebar"
            initial={{ x: 340, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 360, opacity: 0 }}
            transition={{ type: "spring", stiffness: 110, damping: 16 }}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              height: "100vh",
              width: 350,
              background: "rgba(255,255,255,0.98)",
              borderLeft: "2px solid #ede6fa",
              boxShadow: "0 0 38px 0 #e1d2fd85",
              zIndex: 200,
              display: "flex",
              flexDirection: "column",
              padding: "0px",
              overflowY: "auto",
            }}
          >
            {/* Header + Close */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#f8f1ff",
                padding: "18px 22px 10px 18px",
                borderBottom: "1.5px solid #ede6fa",
              }}
            >
              <div style={{ fontWeight: 900, color: "#7B1FA2", fontSize: 22 }}>ฟิลเตอร์ข้อมูล</div>
              <motion.button
                onClick={() => setShowSidebar(false)}
                whileHover={{ scale: 1.2, rotate: 90 }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#e53935",
                  fontWeight: 900,
                  fontSize: "1.8rem",
                  cursor: "pointer",
                  marginLeft: 5,
                  marginRight: -8,
                }}
                title="ย่อกลับ"
              >
                ⏩
              </motion.button>
            </div>

            {/* Clear All */}
            <div
              style={{
                padding: "12px 18px 7px 18px",
                borderBottom: "1.5px solid #ede6fa",
                background: "#fff",
              }}
            >
              <button
                style={{
                  ...clearBtnStyle,
                  background: "linear-gradient(135deg,#f5f7fa 0%,#c3cfe2 100%)",
                  color: "#7B1FA2",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  width: "100%",
                  fontSize: "1.1rem",
                  padding: "11px 0",
                  marginBottom: 2,
                }}
                onClick={() => {
                  setFilter({ result: "all", side: "all", competitor: "all" });
                  setSearch("");
                  setCompetitors([]);
                  setSelectedTypes([]);
                  setFilterMode("week");
                  setSelectedWeeks([]);
                  setSelectedWeekRange({ from: "", to: "" });
                  setSelectedDates([]);
                  setSelectedDateRange({ from: "", to: "" });
                }}
              >
                <span>ล้างกรองทั้งหมด</span>
                <span style={{ fontSize: "1.25rem" }}>🔄</span>
              </button>
            </div>

            {/* Week/Date Filter */}
            <div
              style={{
                padding: "16px 18px 6px 18px",
                background: "#fff",
                borderBottom: "1.5px solid #ede6fa",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  marginBottom: 8,
                  fontWeight: 700,
                  color: "#7B1FA2",
                }}
              >
                <span>{icons.calendar}</span>
                <span>เลือกโหมดฟิลเตอร์:</span>
                <button
                  style={{
                    marginLeft: 8,
                    background: filterMode === "week" ? theme.purpleGradient : "#ede6fa",
                    color: filterMode === "week" ? "#fff" : "#7B1FA2",
                    fontWeight: 800,
                    border: "none",
                    borderRadius: 8,
                    padding: "7px 14px",
                    cursor: "pointer",
                  }}
                  onClick={() => setFilterMode("week")}
                >
                  สัปดาห์
                </button>
                <button
                  style={{
                    background: filterMode === "date" ? theme.purpleGradient : "#ede6fa",
                    color: filterMode === "date" ? "#fff" : "#7B1FA2",
                    fontWeight: 800,
                    border: "none",
                    borderRadius: 8,
                    padding: "7px 14px",
                    cursor: "pointer",
                  }}
                  onClick={() => setFilterMode("date")}
                >
                  วันที่
                </button>
              </div>

              {filterMode === "week" && (
                <>
                  <div style={{ fontWeight: 700, color: "#7B1FA2", margin: "8px 0 4px" }}>
                    เลือกสัปดาห์ (หลายรายการ)
                  </div>
                  <ReactSelect
                    isMulti
                    value={weekOptions.filter((w) => selectedWeeks.includes(w.value))}
                    onChange={(opts) => {
                      setSelectedWeeks(opts ? opts.map((w) => w.value) : []);
                      setSelectedWeekRange({ from: "", to: "" });
                    }}
                    options={weekOptions}
                    placeholder="เลือกสัปดาห์"
                    styles={reactSelectStyle}
                    theme={selectTheme}
                    isClearable
                  />
                  <div style={{ fontWeight: 700, color: "#7B1FA2", margin: "10px 0 4px" }}>
                    หรือช่วงสัปดาห์
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <select
                      style={{ ...inputStyle, minWidth: 80, fontWeight: 700 }}
                      value={selectedWeekRange.from}
                      onChange={(e) => {
                        setSelectedWeekRange((r) => ({ ...r, from: e.target.value }));
                        setSelectedWeeks([]);
                      }}
                    >
                      <option value="">จาก</option>
                      {weekOptions.map((w) => (
                        <option key={w.value} value={w.value}>
                          {w.label}
                        </option>
                      ))}
                    </select>
                    <select
                      style={{ ...inputStyle, minWidth: 80, fontWeight: 700 }}
                      value={selectedWeekRange.to}
                      onChange={(e) => {
                        setSelectedWeekRange((r) => ({ ...r, to: e.target.value }));
                        setSelectedWeeks([]);
                      }}
                    >
                      <option value="">ถึง</option>
                      {weekOptions.map((w) => (
                        <option key={w.value} value={w.value}>
                          {w.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {filterMode === "date" && (
                <>
                  <div style={{ fontWeight: 700, color: "#7B1FA2", margin: "8px 0 4px" }}>
                    เลือกวันที่ (หลายรายการ)
                  </div>
                  <ReactSelect
                    isMulti
                    value={dateOptions.filter((d) => selectedDates.includes(d.value))}
                    onChange={(opts) => {
                      setSelectedDates(opts ? opts.map((d) => d.value) : []);
                      setSelectedDateRange({ from: "", to: "" });
                    }}
                    options={dateOptions}
                    placeholder="เลือกวันที่"
                    styles={reactSelectStyle}
                    theme={selectTheme}
                    isClearable
                  />
                  <div style={{ fontWeight: 700, color: "#7B1FA2", margin: "10px 0 4px" }}>
                    หรือช่วงวันที่
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <select
                      style={{ ...inputStyle, minWidth: 100, fontWeight: 700 }}
                      value={selectedDateRange.from}
                      onChange={(e) => {
                        setSelectedDateRange((r) => ({ ...r, from: e.target.value }));
                        setSelectedDates([]);
                      }}
                    >
                      <option value="">จาก</option>
                      {dateOptions.map((d) => (
                        <option key={d.value} value={d.value}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                    <select
                      style={{ ...inputStyle, minWidth: 100, fontWeight: 700 }}
                      value={selectedDateRange.to}
                      onChange={(e) => {
                        setSelectedDateRange((r) => ({ ...r, to: e.target.value }));
                        setSelectedDates([]);
                      }}
                    >
                      <option value="">ถึง</option>
                      {dateOptions.map((d) => (
                        <option key={d.value} value={d.value}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* Main Filters */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                padding: "18px 18px 8px 18px",
                background: "#fff",
              }}
            >
              {/* Match Result */}
              <div>
                <div style={{ fontWeight: 700, color: "#7B1FA2", marginBottom: 6, fontSize: 15 }}>
                  ผลการแข่งขัน
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <FilterTag
                    label="All"
                    active={filter.result === "all"}
                    onClick={() => setFilter((f) => ({ ...f, result: "all" }))}
                    color="#ede6fa"
                    icon={icons.filter}
                  />
                  <FilterTag
                    label="Win"
                    icon={icons.win}
                    active={filter.result === "Win"}
                    onClick={() => setFilter((f) => ({ ...f, result: f.result === "Win" ? "all" : "Win" }))}
                    color={theme.success}
                  />
                  <FilterTag
                    label="Lose"
                    icon={icons.lose}
                    active={filter.result === "Lose"}
                    onClick={() => setFilter((f) => ({ ...f, result: f.result === "Lose" ? "all" : "Lose" }))}
                    color={theme.danger}
                  />
                </div>
              </div>
              <hr style={{ margin: "8px 0", border: "none", borderTop: "1px dashed #e4d3ff" }} />

              {/* Side Filter */}
              <div>
                <div style={{ fontWeight: 700, color: "#7B1FA2", marginBottom: 6, fontSize: 15 }}>
                  ฝั่งที่เล่น
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <FilterTag
                    label="Red Side"
                    icon={icons.red}
                    active={filter.side === "red"}
                    onClick={() => setFilter((f) => ({ ...f, side: f.side === "red" ? "all" : "red" }))}
                    color={theme.red}
                  />
                  <FilterTag
                    label="Blue Side"
                    icon={icons.blue}
                    active={filter.side === "blue"}
                    onClick={() => setFilter((f) => ({ ...f, side: f.side === "blue" ? "all" : "blue" }))}
                    color={theme.blue}
                  />
                </div>
              </div>
              <hr style={{ margin: "8px 0", border: "none", borderTop: "1px dashed #e4d3ff" }} />

              {/* Multi-select competitor */}
              <div>
                <div style={{ fontWeight: 700, color: "#7B1FA2", marginBottom: 6, fontSize: 15 }}>
                  เลือกคู่แข่ง (เลือกหลาย)
                </div>
                <ReactSelect
                  isMulti
                  value={competitors}
                  onChange={setCompetitors}
                  options={allCompetitors.map((c) => ({ value: c, label: c }))}
                  placeholder="เลือกหลายคู่แข่ง"
                  styles={reactSelectStyle}
                  theme={selectTheme}
                  isClearable
                />
              </div>
              <hr style={{ margin: "8px 0", border: "none", borderTop: "1px dashed #e4d3ff" }} />

              {/* Multi-select Type */}
              <div>
                <div style={{ fontWeight: 700, color: "#7B1FA2", marginBottom: 6, fontSize: 15 }}>
                  เลือก Type (เลือกหลาย)
                </div>
                <ReactSelect
                  isMulti
                  value={selectedTypes}
                  onChange={setSelectedTypes}
                  options={types.map((t) => ({ value: t, label: t }))}
                  placeholder="เลือกหลาย Type"
                  styles={reactSelectStyle}
                  theme={selectTheme}
                  isClearable
                />
              </div>
              <hr style={{ margin: "8px 0", border: "none", borderTop: "1px dashed #e4d3ff" }} />

              {/* Single-select competitor */}
              <div>
                <div style={{ fontWeight: 700, color: "#7B1FA2", marginBottom: 6, fontSize: 15 }}>
                  เลือกคู่แข่ง (เลือกเดียว)
                </div>
                <select
                  value={filter.competitor}
                  onChange={(e) => setFilter((f) => ({ ...f, competitor: e.target.value }))}
                  style={{
                    background: "#fff",
                    border: "1.5px solid #c5b8d6",
                    borderRadius: 12,
                    padding: "8px 16px",
                    fontWeight: 700,
                    fontSize: "1.01rem",
                    color: "#7B1FA2",
                    outline: "none",
                    minWidth: 110,
                    boxShadow: "0 1.5px 7px #ede6fa55",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    marginBottom: 2,
                  }}
                >
                  <option value="all">ทุกคู่แข่ง</option>
                  {allCompetitors.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search */}
              <div>
                <div style={{ fontWeight: 700, color: "#7B1FA2", marginBottom: 5, fontSize: 15 }}>
                  ค้นหาข้อมูล
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    placeholder="ค้นหาคู่แข่งหรือคำอื่นๆ"
                    style={{
                      ...inputStyle,
                      paddingLeft: 36,
                      minWidth: 180,
                    }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "1.2rem", 
                      opacity: 0.6,
                    }}
                  >
                    {icons.search}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ flex: 1 }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Charts Section */}
      <div style={{ maxWidth: 1100, margin: "0 auto", marginTop: 8 }}>
        {/* Pie Win/Lose & Pool Heroes */}
        <motion.div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 20,
            marginBottom: 18,
            boxShadow: theme.shadow,
            maxWidth: 410,
            margin: "auto",
            cursor: "pointer",
            border: "2px solid #e6e9fa",
          }}
          whileHover={{ scale: 1.07, boxShadow: "0 0 22px #00c47a44" }}
          onClick={() => navigate("/win-rate")}
          title="คลิกเพื่อดู Pool Heroes & รายละเอียด Winrate"
        >
          <div
            style={{
              ...chartTitleStyle,
              marginBottom: 7,
              color: "#8B27C6",
              fontWeight: 900,
              fontSize: "1.28rem",
            }}
          >
            <span style={{ fontSize: 28 }}>{icons.win}</span>
            <span
              style={{
                marginLeft: 8,
                letterSpacing: 0.5,
                textShadow: "0 1px 0 #fff",
              }}
            >
              Win/Lose Ratio & Pool Heroes
            </span>
          </div>
          <Pie data={pieWinLose} options={{ ...pieWinLoseOptions, rotation: Math.PI / 2 }} />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 28,
              marginTop: 5,
              fontWeight: 700,
              fontSize: "1.08rem",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span
                style={{
                  display: "inline-block",
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: theme.success,
                  marginRight: 2,
                  border: "1.5px solid #fff",
                }}
              />
              <span style={{ color: theme.success }}>Win</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span
                style={{
                  display: "inline-block",
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: theme.danger,
                  marginRight: 2,
                  border: "1.5px solid #fff",
                }}
              />
              <span style={{ color: theme.danger }}>Lose</span>
            </div>
          </div>
          <div
            style={{
              textAlign: "center",
              marginTop: 10,
              fontWeight: 800,
              color: "#8B1FA2",
              fontSize: "1.09em",
            }}
          >
            Pool Heroes:
          </div>
          <div
            style={{
              color: "#4a3567",
              fontSize: "0.99em",
              textAlign: "center",
              fontWeight: 600,
              marginBottom: 2,
            }}
          >
            คลิกกราฟนี้เพื่อดูรายชื่อและสถิติ Winrate ของ Pool Heroes ที่ทีมเลือกใช้ตลอดซีซัน!
          </div>
        </motion.div>

        {/* Hero Performance by Week (Radar) */}
        <motion.div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 24,
            marginBottom: 18,
            boxShadow: theme.shadow,
            maxWidth: 880,
            margin: "auto",
          }}
          whileHover={{ scale: 1.02, boxShadow: "0 0 12px #b7a9ff66" }}
        >
          <div style={{ ...chartTitleStyle, marginBottom: 8, fontSize: "1.3rem" }}>
            {icons.trend} Team Performance by Week
          </div>
          <div style={{ position: "relative", height: 400 }}>
            <Radar data={heroRadarData} options={heroRadarOptions} />
          </div>
        </motion.div>

        {/* End Type Distribution */}
        <motion.div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 24,
            marginBottom: 22,
            boxShadow: theme.shadow,
            maxWidth: 520,
            margin: "auto",
          }}
          whileHover={{ scale: 1.04, boxShadow: "0 0 16px #b7a9ff66" }}
        >
          <div style={{ ...chartTitleStyle, marginBottom: 8 }}>
            {icons.sword} End Type Distribution
          </div>
          <Pie data={endTypePie} options={endTypePieOptions} />
        </motion.div>

        {/* Win/Lose by Rival */}
        <motion.div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 32,
            margin: "0 auto 18px auto",
            boxShadow: theme.shadow,
            maxWidth: 1050,
            minHeight: 400,
          }}
          whileHover={{ scale: 1.03, boxShadow: "0 0 18px #7B1FA244" }}
        >
          <div style={{ ...chartTitleStyle, marginBottom: 8 }}>{icons.stats} Win/Lose by คู่แข่ง</div>
          <Line data={rivalLineData} options={rivalLineOptions} />
        </motion.div>

        {/* Dual Pie for Duration */}
        <motion.div
          style={{
            display: "flex",
            gap: 24,
            justifyContent: "center", 
            marginBottom: 22,
          }}
          whileHover={{ scale: 1.02 }}
        >
          <div style={{ width: 300, textAlign: "center" }}>
            <div style={chartTitleStyle}>
              <span>{icons.timer}</span> จบเกมก่อน 15 นาที
            </div>
            <Pie data={pieShortData} options={pieSimpleOptions} />
          </div>
          <div style={{ width: 300, textAlign: "center" }}>
            <div style={chartTitleStyle}>
              <span>{icons.timer}</span> จบเกมหลัง 15 นาทีขึ้นไป
            </div>
            <Pie data={pieLongData} options={pieSimpleOptions} />
          </div>
        </motion.div>
      </div>

      {/* Table Section */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: "#fff",
          borderRadius: 18,
          boxShadow: theme.shadow,
          padding: "24px 20px 8px 20px",
          margin: "24px auto 32px auto",
          maxWidth: 1100,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <h3
            style={{
              color: "#7B1FA2",
              fontWeight: 800,
              letterSpacing: 1,
              fontSize: "1.18rem",
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                background: "linear-gradient(135deg,#7B1FA2 0%,#9C27B0 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {icons.chart}
            </span>
            ข้อมูลการแข่งขันล่าสุด ({filteredGames.length} รายการ)
          </h3>
          {filteredGames.length > rowsPerPage && (
            <div
              style={{
                color: "#7B1FA2",
                fontWeight: 700,
                fontSize: "0.95rem",
                background: "#f3ecff",
                padding: "6px 12px",
                borderRadius: 12,
              }}
            >
              Showing {Math.min(rowsPerPage, filteredGames.length)} of {filteredGames.length} matches
            </div>
          )}
        </div>
        <div
          style={{
            maxHeight: 460,
            overflowY: "auto",
            borderRadius: 12,
            boxShadow: "0 1.5px 11px #e2daee20",
            position: "relative",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "950px",
              background: "#fff",
            }}
          >
            <thead>
              <tr>
                <th style={thStyle}>สัปดาห์</th>
                <th style={thStyle}>วันที่</th>
                <th style={thStyle}>เวลา</th> 
                <th style={thStyle}>คู่แข่ง</th>
                <th style={thStyle}>Side & Match Win</th>
                <th style={thStyle}>End Type</th>
                <th style={thStyle}>Type</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredGames.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      style={{
                        textAlign: "center", 
                        padding: "22px", 
                        color: "#bbb",
                        fontStyle: "italic",
                      }}
                    >
                      {search.trim() ? "No matches found for your search" : "ยังไม่มีข้อมูล"}
                    </td>
                  </tr>
                ) : (
                  filteredGames
                    .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                    .map((g, idx) => {
                      const week = weekMap[g.Date] || "-",
                        dateStr = formatDateShort(g.Date),
                        time = formatTime(g.time),
                        comp = g.competitor || "ไม่พบข้อมูล",
                        matchVal = g.match || g["Match Win"] || "",
                        mr = getMatchResult(matchVal),
                        endType = g.endType || g.EndType || "ไม่พบข้อมูล",
                        type = g.type || g.Type || "ไม่พบข้อมูล",
                        bg =
                          matchBgColors[
                            Math.abs(
                              matchVal
                                ? [...String(matchVal)].reduce((a, c) => a + c.charCodeAt(0), 0)
                                : idx
                            ) % matchBgColors.length
                          ];
                      return (
                        <motion.tr
                          key={`${g.Date}-${comp}-${idx}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 12 }}
                          transition={{ delay: 0.04 + idx * 0.01 }}
                          style={{
                            background: bg,
                            fontWeight: 500,
                            borderBottom: "1px solid #eee",
                            transition: "all 0.19s",
                            ":hover": { background: "#f9f5ff", transform: "scale(1.002)" },
                          }}
                        >
                          <td style={tdStyle}>{week}</td>
                          <td style={tdStyle}>{dateStr}</td>
                          <td style={tdStyle}>{time}</td>
                          <td style={tdStyle}>{comp}</td>
                          <td
                            style={{
                              ...tdStyle,
                              fontWeight: 700,
                              color: mr.color,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 2,
                            }}
                          >
                            <div style={{ color: "#7B1FA2", fontWeight: 800 }}>
                              {g.side || g.Side || "ไม่พบข้อมูล"}
                            </div>
                            <div style={{ color: mr.color, fontWeight: 900, fontSize: "1.06em" }}>
                              <span style={{ fontSize: "1.1em", marginRight: 2 }}>{mr.icon}</span>
                              {mr.label}
                            </div>
                          </td>
                          <td style={tdStyle}>{endType}</td>
                          <td style={tdStyle}>{type}</td>
                        </motion.tr>
                      );
                    })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredGames.length > rowsPerPage && (
          <motion.div
            style={{
              marginTop: 14,
              display: "flex",
              gap: 8,
              justifyContent: "center",
              alignItems: "center",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <PageBtn onClick={() => setPage(1)} disabled={page === 1} aria-label="First page">
              ⏪
            </PageBtn>
            <PageBtn
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
            >
              ◀️
            </PageBtn>
            <span
              style={{
                fontWeight: 700,
                color: "#975dcf",
                fontSize: "1.07rem",
                letterSpacing: 1,
                background: "#f7f2ff",
                borderRadius: 6,
                padding: "3px 13px",
                minWidth: 90,
                textAlign: "center",
              }}
            >
              {page} / {Math.ceil(filteredGames.length / rowsPerPage)}
            </span>
            <PageBtn
              onClick={() => setPage(Math.min(Math.ceil(filteredGames.length / rowsPerPage), page + 1))}
              disabled={page === Math.ceil(filteredGames.length / rowsPerPage)}
              aria-label="Next page"
            >
              ▶️
            </PageBtn>
            <PageBtn
              onClick={() => setPage(Math.ceil(filteredGames.length / rowsPerPage))}
              disabled={page === Math.ceil(filteredGames.length / rowsPerPage)}
              aria-label="Last page"
            >
              ⏪
            </PageBtn>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

function SummaryCard({ icon, label, value, color, gradient }) {
  return (
    <motion.div
      whileHover={{ scale: 1.12, boxShadow: `0 0 24px ${color}44` }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 200, damping: 12 }}
      style={{
        background: "linear-gradient(120deg,#fff,#f3e9ff 90%)",
        borderRadius: 22,
        boxShadow: theme.glow,
        padding: "24px 16px 19px 16px",
        minWidth: 170,
        minHeight: 87,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        border: `2.5px solid ${color}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: gradient || color,
          opacity: 0.1,
          zIndex: 0,
        }}
      />
      <div style={{ fontSize: "2.15rem", marginBottom: 8, textShadow: "0 3px 11px #e8e0f7", zIndex: 1 }}>
        {icon}
      </div>
      <div style={{ color: color, fontWeight: 900, fontSize: "1.45rem", letterSpacing: 1, zIndex: 1 }}>
        {value}
      </div>
      <div style={{ color: "#7B1FA2", fontWeight: 700, fontSize: "1rem", opacity: 0.85, zIndex: 1 }}>
        {label}
      </div>
    </motion.div>
  );
}

function FilterTag({ label, active, onClick, color, icon }) {
  return (
    <motion.button
      whileHover={{ scale: 1.13, boxShadow: `0 0 10px ${color}88` }}
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      style={{
        background: active ? color : theme.tag,
        color: active ? "#fff" : "#7B1FA2",
        fontWeight: 900,
        border: "none",
        borderRadius: 16,
        padding: "8px 21px",
        margin: "2px 0",
        fontSize: "1.07rem",
        cursor: "pointer",
        outline: "none",
        boxShadow: active ? `0 0 15px ${color}44` : undefined,
        transition: "all 0.17s",
        display: "flex",
        alignItems: "center",
        gap: 6,
        border: active ? `2px solid ${color}` : "2px solid transparent",
    
      }}
    >
      {icon && <span style={{ fontSize: "1.1em", filter: active ? "brightness(1.2)" : undefined }}>{icon}</span>}
      {label}
    </motion.button>
  );
}

function PageBtn({ onClick, disabled, children, "aria-label": ariaLabel }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: "#ede6fa",
        color: "#8657c7",
        border: "none",
        borderRadius: 7,
        padding: "5px 11px",
        fontWeight: 700,
        fontSize: "1.1rem",
        margin: "0 2px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "all .18s",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 40,
        minHeight: 40,
      }}
      whileHover={!disabled ? { scale: 1.1, background: "#e0d4f8" } : {}}
      whileTap={!disabled ? { scale: 0.9 } : {}}
      aria-label={ariaLabel}
    >
      {children}
    </motion.button>
  );
}

