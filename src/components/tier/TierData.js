import React, { useState, useEffect, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import styled from "styled-components";
import {
  FiSearch,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiStar,
  FiChevronUp
} from "react-icons/fi";
import Tilt from "react-parallax-tilt";
import Select from "react-select";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
  ArcElement
);

const theme = {
  main: "#8e6dff",
  accent: "#00e7b5",
  green: "#18d6a0",
  card: "rgba(36,41,54,0.97)",
  cardGlass: "rgba(44, 54, 86, 0.60)",
  bg: "#181c29",
  font: "'Prompt','Noto Sans Thai','Inter',sans-serif",
  gold: "#FFD700",
  silver: "#B3B3B3",
  bronze: "#E5A76B",
  neon: "#34ffde",
  white: "#ECECEC",
  text: "#ECECEC",
  secondary: "#B0BEC5",
  success: "#34ffb8",
  danger: "#ff526f",
  warn: "#ffd166",
  blue: "#64b5ff"
};

const Bg = styled.div`
  min-height: 100vh;
  font-family: ${theme.font};
  background: linear-gradient(140deg,#131d23 0%,#19e4bb 20%,#7B1FA2 60%,#191c2b 100%);
  position: relative;
  color: #fff;
  overflow-x: hidden;
`;

const GlassNav = styled.div`
  display: flex;
  gap: 18px;
  justify-content: center;
  align-items: center;
  margin: 0 auto 28px;
  padding: 10px 0;
  background: rgba(44,54,86,0.54);
  border-radius: 26px;
  box-shadow: 0 2px 18px #16ffb335;
  backdrop-filter: blur(6px);
  width: 90%;
  max-width: 1200px;
`;

const TabBtn = styled.button`
  border: none;
  outline: none;
  cursor: pointer;
  background: ${({ active }) =>
    active ? `linear-gradient(90deg,${theme.main},${theme.accent})` : "transparent"};
  color: ${({ active }) => (active ? "#fff" : theme.main)};
  font-weight: 900;
  font-size: 1.12rem;
  padding: 11px 34px;
  border-radius: 21px;
  transition: background .19s, color .17s;
`;

const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin: 0 auto 22px;
  padding: 15px 18px;
  background: linear-gradient(110deg,#1c2e36 60%,#30ffc4 120%);
  border-radius: 20px;
  box-shadow: 0 1px 12px #3DF2B233;
  width: 90%;
  max-width: 1120px;
`;

const FilterLabel = styled.div`
  font-weight: 900;
  color: #3DF2B2;
  margin-bottom: 7px;
  font-size: 1.05rem;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-width: 140px;
`;

const BtnGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const FilterBtn = styled.button`
  background: ${({ active }) =>
    active ? "linear-gradient(92deg,#7B1FA2 60%,#3DF2B2 99%)" : "#242e38"};
  color: ${({ active }) => (active ? "#fff" : "#23dac3")};
  font-weight: 900;
  font-size: 1.04rem;
  border: none;
  border-radius: 13px;
  padding: 10px 19px;
  cursor: pointer;
  transition: all .16s;
  &:hover {
    background: linear-gradient(92deg,#7B1FA2 40%,#3DF2B2 99%);
  }
`;

const InputRange = styled.input`
  width: 50px;
  background: #232a35;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 4px;
  text-align: center;
`;

const SearchWrap = styled.div`
  display: flex;
  align-items: center;
  background: #232a35;
  border-radius: 13px;
  padding: 0 7px;
  flex: 1;
`;

const SearchInput = styled.input`
  background: transparent;
  border: none;
  outline: none;
  font-size: 1.18rem;
  color: #fff;
  font-weight: 900;
  padding: 12px;
  &::placeholder {
    color: #3DF2B299;
  }
`;

const ComboGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit,minmax(350px,1fr));
  gap: 30px;
  margin: 38px auto 48px;
  max-width: 1200px;
  @media(max-width:700px){ gap: 15px; }
`;

const ComboCard = styled.div`
  background: ${theme.card};
  border-radius: 24px;
  border: 2px solid #3d274540;
  box-shadow: 0 2px 14px #5a70ff18;
  padding: 30px 19px 22px;
  text-align: center;
  position: relative;
  transition: box-shadow .25s, transform .23s;
  &:hover {
    box-shadow: 0 12px 60px #7b1fa225;
    transform: scale(1.02);
  }
`;

const HeroRow = styled.div`
  display: flex;
  gap: 9px;
  justify-content: center;
  margin-bottom: 14px;
`;

const NeonHero = styled.div`
  width: 76px;
  height: 76px;
  border-radius: 50%;
  overflow: hidden;
  background: #1e1337;
  border: 2.2px solid #3DF2B2;
  box-shadow: 0 0 0 3px #3DF2B255, 0 6px 16px #7b1fa240;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ComboTitle = styled.div`
  font-size: 1.22rem;
  font-weight: 900;
  color: ${theme.main};
  margin-bottom: 5px;
`;

const ComboDetail = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 6px;
  font-weight: 800;
  font-size: 1.12rem;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 16px;
`;

const ShineBtn = styled.button`
  background: ${theme.main};
  color: #fff;
  font-weight: 900;
  border: none;
  border-radius: 13px;
  padding: 11px 20px;
  display: flex;
  align-items: center;
  gap: 7px;
  cursor: pointer;
  transition: background .21s;
  &:hover {
    background: linear-gradient(90deg,${theme.main},${theme.accent});
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(21,24,32,0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 199;
`;

const ModalContent = styled.div`
  background: ${theme.card};
  border-radius: 28px;
  padding: 32px 18px 26px;
  max-width: 500px;
  width: 96vw;
  max-height: 94vh;
  overflow-y: auto;
  border: 2.5px solid #7B1FA2;
  position: relative;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 17px;
  right: 22px;
  font-size: 2rem;
  color: ${theme.gold};
  background: none;
  border: none;
  cursor: pointer;
`;

const Toast = styled.div`
  position: fixed;
  bottom: 3.3rem;
  left: 50%;
  transform: translateX(-50%);
  background: ${theme.main};
  color: #fff;
  padding: 17px 32px;
  border-radius: 13px;
  font-weight: 900;
  z-index: 1020;
`;

const ScrollTopBtn = styled.button`
  position: fixed;
  bottom: 35px;
  right: 30px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(90deg,${theme.main},${theme.accent});
  color: #fff;
  font-size: 1.6rem;
  border: none;
  cursor: pointer;
`;

function normalizeName(str) {
  return (str||"").toLowerCase().trim()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/['’"“”]/g,"").replace(/\s+/g," ")
    .replace(/-/g," ").replace(/[^a-z0-9ก-๙ ]/gi,"");
}
function normalizePosition(pos) {
  if (!pos) return "";
  const s = pos.toLowerCase().replace(/\s+/g,"");
  if (["fsdsl","dsl","ds","fsds"].includes(s)) return "FS DSL";
  if (["mid","fsmid"].includes(s)) return "FS Mid";
  if (["adl","fsadl"].includes(s)) return "FS ADL";
  if (["jungle","fsjungle","jg"].includes(s)) return "FS Jungle";
  if (["roaming","fsroaming","roam"].includes(s)) return "FS Roaming";
  return pos.trim();
}

const getHeroImage = heroName => {
  if (!heroName) return `${process.env.PUBLIC_URL}/heroimages/default.jpg`;
  const formatted = heroName
    .toLowerCase().trim().normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .replace(/\s+/g,"-")
    .replace(/[^\w-]/g,"")
    .replace(/-+/g,"-")
    .replace(/^-+|-+$/g,"");
  return `${process.env.PUBLIC_URL}/heroimages/${formatted}.jpg`;
};
const renderHeroImage = (src, alt) => (
  <img
    src={src}
    alt={alt}
    style={{ width:"100%", height:"100%", objectFit:"cover" }}
    onError={e => {
      e.target.onerror = null;
      e.target.src = `${process.env.PUBLIC_URL}/heroimages/default.jpg`;
    }}
  />
);

function buildWeekMap(dates) {
  const sorted = [...new Set(dates)].sort();
  return sorted.reduce((m,d,i)=>(m[d]=`W${i+1}`,m),{});
}

export default function TierData({ comboStats, games, dropdownDates = [] }) {
  const [comboType, setComboType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("mostWins");
  const [positionFilter, setPositionFilter] = useState([]);
  const [dateType, setDateType] = useState("day");
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState({ from:"", to:"" });
  const [selectedWeeks, setSelectedWeeks] = useState([]);
  const [selectedWeekRange, setSelectedWeekRange] = useState({ from:"", to:"" });
  const [teamFilter, setTeamFilter] = useState([]);
  const [savedCombos, setSavedCombos] = useState([]);
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [showToast, setShowToast] = useState({ visible:false, message:"" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Prepare raw data
  const allOneHero = comboStats?.oneHero || [];
  const allCombo2   = comboStats?.combo2   || [];
  const allCombo3   = comboStats?.combo3   || [];

  const allOneHeroSplitted = allOneHero.flatMap(h => {
    if (!h.hero || !h.position) return [];
    return [{
      hero: h.hero,
      position: normalizePosition(h.position),
      win: h.win,
      losses: h.losses,
      total: h.total,
      date: h.date
    }];
  });

  const uniqueHeroPositions = [...new Set(allOneHeroSplitted.map(h => `${h.hero}|||${h.position}`))];
  const uniqueCombo2Names   = [...new Set(allCombo2.map(c => c.combo).filter(Boolean))];
  const uniqueCombo3Names   = [...new Set(allCombo3.map(c => c.combo).filter(Boolean))];

  const dateOptions = useMemo(() => (
    dropdownDates.length > 0
      ? dropdownDates
      : [...new Set((games||[]).map(g => g.Date).filter(Boolean))].sort()
  ), [dropdownDates, games]);

  const weekMap     = useMemo(() => buildWeekMap(dateOptions), [dateOptions]);
  const weekOptions = useMemo(() => [...new Set(Object.values(weekMap))].sort((a,b)=>+a.slice(1)-+b.slice(1)), [weekMap]);
  const teamOptions     = useMemo(() => [...new Set((games||[]).map(g=>g.competitor).filter(Boolean))].sort(), [games]);
  const positionOptions = useMemo(() => [...new Set(allOneHeroSplitted.map(h=>h.position))].sort(), [allOneHeroSplitted]);

  const dateOptionsForSelect = dateOptions.map(d=>({ value:d, label:d }));
  const weekOptionsForSelect = weekOptions.map(w=>({ value:w, label:w }));
  const teamOptionsForSelect = teamOptions.map(t=>({ value:t, label:t }));

  function filterByPeriodAndTeam(arr) {
    let res = arr;
    if (dateType === "day") {
      if (selectedDates.length) {
        res = res.filter(g => selectedDates.includes(g.Date));
      } else if (selectedDateRange.from && selectedDateRange.to) {
        const { from, to } = selectedDateRange;
        res = res.filter(g => g.Date >= from && g.Date <= to);
      }
    } else {
      if (selectedWeeks.length) {
        res = res.filter(g => selectedWeeks.includes(weekMap[g.Date]));
      } else if (selectedWeekRange.from && selectedWeekRange.to) {
        const slice = weekOptions.slice(
          weekOptions.indexOf(selectedWeekRange.from),
          weekOptions.indexOf(selectedWeekRange.to) + 1
        );
        res = res.filter(g => slice.includes(weekMap[g.Date]));
      }
    }
    if (teamFilter.length) {
      res = res.filter(g => teamFilter.includes(g.competitor));
    }
    return res;
  }

  const isDateRangeIncomplete = dateType === "day" && selectedDateRange.from && !selectedDateRange.to;
  const isWeekRangeIncomplete = dateType === "week" && selectedWeekRange.from && !selectedWeekRange.to;

  // Build lists
  const heroList = uniqueHeroPositions.map(key => {
    const [heroName, position] = key.split("|||");
    const raw = allOneHeroSplitted.find(h => h.hero===heroName && h.position===position) || {};
    const filtering = !!(
      selectedDates.length ||
      selectedDateRange.from ||
      selectedWeeks.length ||
      selectedWeekRange.from ||
      teamFilter.length
    );
    let wins = filtering ? 0 : raw.win || 0;
    let total = filtering ? 0 : raw.total || 0;
    let losses = filtering ? 0 : raw.losses || 0;
    if (filtering) {
      const filtered = filterByPeriodAndTeam((games||[]).filter(g =>
        (g.fsPick||[]).some((h, i) =>
          normalizeName(h) === normalizeName(heroName) &&
          normalizePosition(g.fsPosition?.[i]) === position
        )
      ));
      total = filtered.length;
      wins = filtered.filter(g => g.win === 1).length;
      losses = total - wins;
    }
    const winRate = total>0 ? Number(((wins/total)*100).toFixed(1)) : 0;
    const loseRate = Math.round(100 - winRate);
    return {
      name: heroName,
      position,
      comboType: "1-hero",
      characters: [heroName],
      images: [getHeroImage(heroName)],
      wins,
      totalGames: total,
      losses,
      winRate,
      loseRate
    };
  });

  const combo2List = uniqueCombo2Names.map(comboName => {
    const chars = comboName.split(" + ").map(s => s.trim());
    const raw = allCombo2.find(c => c.combo===comboName) || {};
    let wins = raw.win || 0;
    let total = raw.total || 0;
    let losses = raw.losses || 0;
    const filtering = !!(
      selectedDates.length ||
      selectedDateRange.from ||
      selectedWeeks.length ||
      selectedWeekRange.from ||
      teamFilter.length
    );
    if (filtering) {
      const filtered = filterByPeriodAndTeam((games||[]).filter(g =>
        chars.every(h => (g.fsPick||[]).map(normalizeName).includes(normalizeName(h)))
      ));
      total = filtered.length;
      wins = filtered.filter(g => g.win === 1).length;
      losses = total - wins;
    }
    const winRate = total>0 ? Number(((wins/total)*100).toFixed(1)) : 0;
    const loseRate = Math.round(100 - winRate);
    return {
      name: comboName,
      comboType: "2-heroes",
      characters: chars,
      images: chars.map(getHeroImage),
      wins,
      totalGames: total,
      losses,
      winRate,
      loseRate
    };
  });

  const combo3List = uniqueCombo3Names.map(comboName => {
    const chars = comboName.split(" + ").map(s => s.trim());
    const raw = allCombo3.find(c => c.combo===comboName) || {};
    let wins = raw.win || 0;
    let total = raw.total || 0;
    let losses = raw.losses || 0;
    const filtering = !!(
      selectedDates.length ||
      selectedDateRange.from ||
      selectedWeeks.length ||
      selectedWeekRange.from ||
      teamFilter.length
    );
    if (filtering) {
      const filtered = filterByPeriodAndTeam((games||[]).filter(g =>
        chars.every(h => (g.fsPick||[]).map(normalizeName).includes(normalizeName(h)))
      ));
      total = filtered.length;
      wins = filtered.filter(g => g.win === 1).length;
      losses = total - wins;
    }
    const winRate = total>0 ? Number(((wins/total)*100).toFixed(1)) : 0;
    const loseRate = Math.round(100 - winRate);
    return {
      name: comboName,
      comboType: "3-heroes",
      characters: chars,
      images: chars.map(getHeroImage),
      wins,
      totalGames: total,
      losses,
      winRate,
      loseRate
    };
  });

  let combos = [...heroList, ...combo2List, ...combo3List];

  // Apply comboType filter
  let showCombos = combos;
  if (comboType === "1-hero") showCombos = heroList;
  else if (comboType === "2-heroes") showCombos = combo2List;
  else if (comboType === "3-heroes") showCombos = combo3List;

  // Position filter
  if (comboType === "1-hero" && positionFilter.length) {
    showCombos = showCombos.filter(c => positionFilter.includes(c.position));
  }

  // Search filter
  showCombos = showCombos.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort
  showCombos.sort((a, b) => {
    if (sortBy === "winRate") return b.winRate - a.winRate;
    if (sortBy === "loseRate") return b.loseRate - a.loseRate;
    if (sortBy === "totalGames") return b.totalGames - a.totalGames;
    if (sortBy === "mostLosses") return b.losses - a.losses;
    return b.wins - a.wins; // mostWins
  });

  // Paginate
  const currentCombos = showCombos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Chart data
  const top5Wins = [...showCombos].sort((a,b)=>b.wins-a.wins).slice(0,5);
  const winChartData = {
    labels: top5Wins.map(c=>c.name),
    datasets:[{
      label: comboType==="1-hero"?"Win (Hero)":"Win (Combo)",
      data: top5Wins.map(c=>c.wins),
      backgroundColor: theme.neon,
      borderColor: theme.main,
      borderWidth: 2
    }]
  };
  const top5Games = [...showCombos].sort((a,b)=>b.totalGames-a.totalGames).slice(0,5);
  const totalGamesChartData = {
    labels: top5Games.map(c=>c.name),
    datasets:[{
      label:"Total Games",
      data: top5Games.map(c=>c.totalGames),
      backgroundColor: theme.blue,
      borderColor: theme.main,
      borderWidth: 2
    }]
  };

  // Save / Remove
  const saveCombo = combo => {
    if (!savedCombos.some(c => c.name===combo.name && c.position===combo.position)) {
      const updated = [...savedCombos, combo];
      setSavedCombos(updated);
      localStorage.setItem("savedCombos", JSON.stringify(updated));
      setShowToast({ visible: true, message: `Saved "${combo.name}"` });
      setTimeout(() => setShowToast({ visible: false }), 1300);
    }
  };
  const removeCombo = (name, pos) => {
    const updated = savedCombos.filter(c => !(c.name===name && c.position===pos));
    setSavedCombos(updated);
    localStorage.setItem("savedCombos", JSON.stringify(updated));
    setShowToast({ visible: true, message: `Removed "${name}"` });
    setTimeout(() => setShowToast({ visible: false }), 1000);
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedCombos") || "[]");
    setSavedCombos(saved);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    comboType,
    searchTerm,
    selectedDates,
    selectedDateRange,
    selectedWeeks,
    selectedWeekRange,
    teamFilter,
    positionFilter,
    sortBy
  ]);

  const togglePosition = pos => {
    setPositionFilter(ps =>
      ps.includes(pos) ? ps.filter(x => x !== pos) : [...ps, pos]
    );
  };

  return (
    <Bg>
      <GlassNav>
        <TabBtn active={comboType==="all"} onClick={()=>setComboType("all")}>All</TabBtn>
        <TabBtn active={comboType==="1-hero"} onClick={()=>setComboType("1-hero")}>Hero</TabBtn>
        <TabBtn active={comboType==="2-heroes"} onClick={()=>setComboType("2-heroes")}>2-Heroes</TabBtn>
        <TabBtn active={comboType==="3-heroes"} onClick={()=>setComboType("3-heroes")}>3-Heroes</TabBtn>
      </GlassNav>

      <FilterBar>
        {/* Sort By */}
        <FilterGroup>
          <FilterLabel>Sort By</FilterLabel>
          <BtnGroup>
            <FilterBtn active={sortBy==="totalGames"} onClick={()=>setSortBy("totalGames")}>Total Games</FilterBtn>
            <FilterBtn active={sortBy==="mostWins"} onClick={()=>setSortBy("mostWins")}>Most Wins</FilterBtn>
            <FilterBtn active={sortBy==="mostLosses"} onClick={()=>setSortBy("mostLosses")}>Most Losses</FilterBtn>
            <FilterBtn active={sortBy==="winRate"} onClick={()=>setSortBy("winRate")}>Win Rate</FilterBtn>
            <FilterBtn active={sortBy==="loseRate"} onClick={()=>setSortBy("loseRate")}>Lose Rate</FilterBtn>
          </BtnGroup>
        </FilterGroup>

        {/* Period Type */}
        <FilterGroup>
          <FilterLabel>ชนิดช่วง</FilterLabel>
          <BtnGroup>
            <FilterBtn active={dateType==="day"} onClick={()=>{
              setDateType("day");
              setSelectedWeeks([]);
              setSelectedWeekRange({ from:"", to:"" });
            }}>วันที่</FilterBtn>
            <FilterBtn active={dateType==="week"} onClick={()=>{
              setDateType("week");
              setSelectedDates([]);
              setSelectedDateRange({ from:"", to:"" });
            }}>สัปดาห์</FilterBtn>
          </BtnGroup>
        </FilterGroup>

        {/* Date Filter */}
        {dateType==="day" ? (
          <FilterGroup style={{ minWidth:320, maxWidth:400 }}>
            <FilterLabel>เลือกวัน (Multi หรือ ช่วง)</FilterLabel>
            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              <div style={{ flex:1 }}>
                <Select
                  options={dateOptionsForSelect}
                  isMulti
                  placeholder="เลือกหลายวัน..."
                  value={selectedDates.map(d=>({ value:d, label:d }))}
                  onChange={vals=>{
                    setSelectedDates(vals.map(v=>v.value));
                    setSelectedDateRange({ from:"", to:"" });
                  }}
                  styles={{
                    control: s=>({...s, minHeight:40, background:"#232a35", color:"#fff", fontWeight:900}),
                    menu: s=>({...s, background:"#232a35", color:"#fff"}),
                    multiValue: s=>({...s, background:"#3DF2B2", color:"#191c2b"}),
                    input: s=>({...s, color:"#fff"})
                  }}
                />
              </div>
              <span style={{ color:theme.accent, fontWeight:900 }}>หรือ</span>
              <Select
                options={dateOptionsForSelect}
                placeholder="จาก"
                isClearable
                value={selectedDateRange.from ? { value:selectedDateRange.from, label:selectedDateRange.from } : null}
                onChange={val=>{
                  setSelectedDateRange(r=>({...r, from:val?.value||""}));
                  setSelectedDates([]);
                }}
                styles={{
                  control: s=>({...s, minWidth:80, minHeight:40, background:"#232a35", color:"#fff", fontWeight:900}),
                  menu: s=>({...s, background:"#232a35", color:"#fff"}),
                  input: s=>({...s, color:"#fff"})
                }}
              />
              <Select
                options={dateOptionsForSelect}
                placeholder="ถึง"
                isClearable
                value={selectedDateRange.to ? { value:selectedDateRange.to, label:selectedDateRange.to } : null}
                onChange={val=>{
                  setSelectedDateRange(r=>({...r, to:val?.value||""}));
                  setSelectedDates([]);
                }}
                styles={{
                  control: s=>({...s, minWidth:80, minHeight:40, background:"#232a35", color:"#fff", fontWeight:900}),
                  menu: s=>({...s, background:"#232a35", color:"#fff"}),
                  input: s=>({...s, color:"#fff"})
                }}
              />
            </div>
          </FilterGroup>
        ) : (
          /* Week Filter */
          <FilterGroup style={{ minWidth:280, maxWidth:340 }}>
            <FilterLabel>เลือกสัปดาห์ (Multi หรือ ช่วง)</FilterLabel>
            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              <div style={{ flex:1 }}>
                <Select
                  options={weekOptionsForSelect}
                  isMulti
                  placeholder="เลือกหลายสัปดาห์..."                 
                  value={selectedWeeks.map(w=>({ value:w, label:w }))}
                  onChange={vals=>{ 
                    setSelectedWeeks(vals.map(v=>v.value));
                    setSelectedWeekRange({ from:"", to:"" });
                  }}
                  styles={{
                    control: s=>({...s, minHeight:40, background:"#232a35", color:"#fff", fontWeight:900}),
                    menu: s=>({...s, background:"#232a35", color:"#fff"}),
                    multiValue: s=>({...s, background:"#3DF2B2", color:"#191c2b"}),
                    input: s=>({...s, color:"#fff"})
                  }}
                />
              </div>
              <span style={{ color:theme.accent, fontWeight:900 }}>หรือ</span>
              <Select
                options={weekOptionsForSelect}
                placeholder="จาก"
                isClearable
                value={selectedWeekRange.from ? { value:selectedWeekRange.from, label:selectedWeekRange.from } : null}
                onChange={val=>{
                  setSelectedWeekRange(r=>({...r, from:val?.value||""}));
                  setSelectedWeeks([]);
                }}
                styles={{
                  control: s=>({...s, minWidth:80, minHeight:40, background:"#232a35", color:"#fff", fontWeight:900}),
                  menu: s=>({...s, background:"#232a35", color:"#fff"}),
                  input: s=>({...s, color:"#fff"})
                }}
              />
              <Select
                options={weekOptionsForSelect}
                placeholder="ถึง"
                isClearable
                value={selectedWeekRange.to ? { value:selectedWeekRange.to, label:selectedWeekRange.to } : null}
                onChange={val=>{
                  setSelectedWeekRange(r=>({...r, to:val?.value||""}));
                  setSelectedWeeks([]);
                }}
                styles={{
                  control: s=>({...s, minWidth:80, minHeight:40, background:"#232a35", color:"#fff", fontWeight:900}),
                  menu: s=>({...s, background:"#232a35", color:"#fff"}),
                  input: s=>({...s, color:"#fff"})
                }}
              />
            </div>
          </FilterGroup>
        )}

        {/* Team Filter */}
        <FilterGroup style={{ minWidth:200 }}>
          <FilterLabel>ทีม</FilterLabel>
          <Select
            options={teamOptionsForSelect}
            isMulti
            placeholder="เลือกหลายทีม..."
            value={teamFilter.map(t=>({ value:t, label:t }))}
            onChange={vals=>setTeamFilter(vals.map(v=>v.value))}
            styles={{
              control: s=>({...s, minHeight:40, background:"#232a35", color:"#fff", fontWeight:900}),
              menu: s=>({...s, background:"#232a35", color:"#fff"}),
              multiValue: s=>({...s, background:"#3DF2B2", color:"#191c2b"}),
              input: s=>({...s, color:"#fff"})
            }}
          />
        </FilterGroup>

        {/* Position Filter */}
        {comboType==="1-hero" && (
          <FilterGroup style={{ minWidth:150 }}> 
            <FilterLabel>ตำแหน่ง</FilterLabel>
            <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
              {positionOptions.map(pos => (
                <FilterBtn
                  key={pos}
                  active={positionFilter.includes(pos)}
                  onClick={()=>togglePosition(pos)}
                  style={{ fontSize:"0.99rem", padding:"8px 12px", minWidth:44 }}
                >
                  {pos}
                </FilterBtn>
              ))}
            </div>
          </FilterGroup>
        )}

        {/* Search */}
        <FilterGroup style={{ flex:1, minWidth:220 }}>
          <FilterLabel>Search</FilterLabel>
          <SearchWrap>
            <FiSearch style={{ fontSize: 22, color: "#3DF2B2", marginRight: 3 }}/>
            <SearchInput
              placeholder="ค้นหาฮีโร่ หรือ combo..."
              value={searchTerm}
              onChange={e=>setSearchTerm(e.target.value)}
            />
          </SearchWrap>
        </FilterGroup>
      </FilterBar>

      {/* Charts */}
      <div style={{
        display:"flex", gap:48, flexWrap:"wrap",
        justifyContent:"center", margin:"0 auto 38px",
        maxWidth:1280
      }}>
        <div style={{
          width:340, background:"#181b2d", borderRadius:16,
          padding:"17px 14px 24px", boxShadow:"0 1px 18px #3df2b218"
        }}>
          <div style={{
            fontWeight:900, fontSize:"1.13rem",
            color:theme.accent, marginBottom:9
          }}>
            Top 10 by Wins
          </div>
          <Bar
            data={winChartData}
            options={{
              plugins:{ legend:{ display:false }, datalabels:{ display:false } },
              responsive:true,
              scales:{
                y:{ beginAtZero:true, ticks:{ color:theme.neon } },
                x:{ ticks:{ color:theme.neon } }
              },
              indexAxis:"y",
              elements:{ bar:{ borderRadius:10 } }
            }}
          />
        </div>
        <div style={{
          width:340, background:"#181b2d", borderRadius:16,
          padding:"17px 14px 24px", boxShadow:"0 1px 18px #7b1fa218"
        }}>
          <div style={{
            fontWeight:900, fontSize:"1.13rem",
            color:theme.main, marginBottom:9
          }}>
            Top 10 by Total Games
          </div>
          <Bar
            data={totalGamesChartData}
            options={{
              plugins:{ legend:{ display:false }, datalabels:{ display:false } },
              responsive:true,
              scales:{
                y:{ beginAtZero:true, ticks:{ color:theme.blue } },
                x:{ ticks:{ color:theme.blue } }
              },
              indexAxis:"y",
              elements:{ bar:{ borderRadius:10 } }
            }}
          />
        </div>
      </div>

      {/* Combos Grid */}
      <div style={{ maxWidth:1250, margin:"0 auto", padding:"0 15px" }}>
        {(isDateRangeIncomplete || isWeekRangeIncomplete) ? (
          <div style={{
            background:"#242e38",
            borderRadius:18,
            boxShadow:"0 2px 16px #ef476f44",
            margin:"40px auto",
            maxWidth:500,
            padding:"40px 18px",
            textAlign:"center",
            fontWeight:900,
            fontSize:"1.32rem",
            color:theme.warn,
            border:`2.5px solid ${theme.warn}`
          }}>
            กรุณาใส่ข้อมูลช่อง <span style={{ color:theme.accent }}>ถึง</span> ให้ครบ
          </div>
        ) : (
          <ComboGrid>
            {currentCombos.map((combo, i) => (
              <Tilt glareEnable glareMaxOpacity={0.18} glareColor="#00FFC2" glarePosition="all" key={combo.name + (combo.position||"") + i}>
                <ComboCard onClick={()=>setSelectedCombo(combo)}>
                  <HeroRow>
                    {combo.images.map((img, idx) => (
                      <NeonHero key={idx}>{renderHeroImage(img, combo.characters[idx])}</NeonHero>
                    ))}
                  </HeroRow>
                  <ComboTitle>
                    {combo.name}
                    {combo.position && <span style={{ color:theme.accent }}> ({combo.position})</span>}
                  </ComboTitle>
                  <ComboDetail>
                    <span style={{ color:theme.success }}>ชนะ {combo.wins}</span>
                    <span style={{ color:theme.main }}> / {combo.totalGames}เกม</span>
                    <span style={{ color:theme.danger }}> / แพ้ {combo.losses}</span>
                    <span style={{
                      marginLeft:8,
                      color: sortBy==="loseRate" ? theme.danger : theme.success
                    }}>
                      {sortBy==="loseRate"
                        ? `${combo.loseRate}% แพ้`
                        : `${combo.winRate}% ชนะ`}
                    </span>
                  </ComboDetail>
                  <ActionRow>
                    {!savedCombos.some(c => c.name===combo.name && c.position===combo.position) ? (
                      <ShineBtn onClick={e=>{ e.stopPropagation(); saveCombo(combo); }}>
                        <FiStar/> Save
                      </ShineBtn>
                    ) : (
                      <ShineBtn style={{ background:theme.danger }} onClick={e=>{ e.stopPropagation(); removeCombo(combo.name, combo.position); }}>
                        <FiTrash2/> Remove
                      </ShineBtn>
                    )}
                  </ActionRow>
                </ComboCard>
              </Tilt>
            ))}
          </ComboGrid>
        )}

        <div style={{
          display:"flex", gap:22, alignItems:"center",
          justifyContent:"center", margin:"38px 0 42px"
        }}>
          <button
            onClick={()=>setCurrentPage(p=>Math.max(1,p-1))}
            disabled={currentPage===1}
            style={{
              background:theme.card,
              color:theme.main,
              border:"none",
              borderRadius:11,
              fontSize:22,
              padding:"7px 15px",
              cursor:"pointer",
              fontWeight:900
            }}
          >
            <FiChevronLeft/>
          </button>
          <span style={{ fontWeight:900, color:theme.main }}>Page {currentPage}</span>
          <button
            onClick={()=>setCurrentPage(p=>p+1)}
            disabled={currentPage*itemsPerPage>=showCombos.length}
            style={{
              background:theme.card,
              color:theme.main,
              border:"none",
              borderRadius:11,
              fontSize:22,
              padding:"7px 15px",
              cursor:"pointer",
              fontWeight:900
            }}
          >
            <FiChevronRight/>
          </button>
        </div>
      </div>

      {/* Modal with full details */}
      {selectedCombo && (
        <ModalOverlay onClick={()=>setSelectedCombo(null)}>
          <ModalContent onClick={e=>e.stopPropagation()}>
            <CloseBtn onClick={()=>setSelectedCombo(null)}>&times;</CloseBtn>

            <div style={{ textAlign:"center", marginBottom:24 }}>
              {/* Hero images */}
              <div style={{ display:"flex", justifyContent:"center", gap:8, marginBottom:16 }}>
                {selectedCombo.images.map((img, idx) => (
                  <div key={idx} style={{
                    width:100, height:100, borderRadius:50, overflow:"hidden",
                    boxShadow:`0 0 12px ${theme.neon}`
                  }}>
                    {renderHeroImage(img, selectedCombo.characters[idx])}
                  </div>
                ))}
              </div>

              {/* Name and position */}
              <div style={{
                fontSize:"2rem", fontWeight:900,
                color:theme.main, marginBottom:12
              }}>
                {selectedCombo.name}
                {selectedCombo.position && (
                  <span style={{ fontSize:"1.2rem", color:theme.accent, marginLeft:6 }}>
                    ({selectedCombo.position})
                  </span>
                )}
              </div>
              {/* Summary stats */}
              <div style={{
                display:"flex", justifyContent:"center", gap:20,
                flexWrap:"wrap", marginBottom:16,
                fontSize:"1.1rem", fontWeight:700
              }}>
                <div><b style={{ color:theme.success }}>{selectedCombo.winRate}%</b> Win Rate</div>
                <div><b style={{ color:theme.danger }}>{selectedCombo.loseRate}%</b> Lose Rate</div>
                <div><b style={{ color:theme.warn }}>{selectedCombo.totalGames}</b> Total Games</div>
              </div>

              {/* Detailed wins/losses */}
              <div style={{ fontSize:"1rem", color:theme.white }}>
                <div>Wins: <b style={{ color:theme.success }}>{selectedCombo.wins}</b></div>
                <div>Losses: <b style={{ color:theme.danger }}>{selectedCombo.losses}</b></div>
              </div>
            </div>

          </ModalContent>
        </ModalOverlay>
      )}

      {/* Toast */}
      {showToast.visible && <Toast>{showToast.message}</Toast>}

      {/* Scroll to top */}
      <ScrollTopBtn onClick={()=>window.scrollTo({ top:0, behavior:"smooth" })}>
        <FiChevronUp/>
      </ScrollTopBtn>
    </Bg>
  );
}