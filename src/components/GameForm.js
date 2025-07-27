import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import styled from "styled-components";
import { FiSearch, FiSave, FiTrash2, FiChevronLeft, FiChevronRight, FiStar } from "react-icons/fi";
import Tilt from 'react-parallax-tilt';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels, ArcElement);

const theme = {
  main: "#7B1FA2",
  accent: "#3DF2B2",
  green: "#16ffb3",
  card: "rgba(32,38,54,0.92)",
  cardGlass: "rgba(44, 54, 86, 0.58)",
  bg: "#191c2b",
  font: "'Prompt','Noto Sans Thai','Inter',sans-serif",
  gold: "#FFD700",
  silver: "#B3B3B3",
  bronze: "#E5A76B",
  neon: "#00FFC2",
  white: "#fff",
  success: "#4ee1b6",
  danger: "#ef476f",
  warn: "#ffd166",
  blue: "#5A70FF",
  badgeFont: "'Russo One', 'Prompt', sans-serif",
};

// ===== styled-components (เดิม) =====
const Bg = styled.div`
  min-height:100vh;
  font-family:${theme.font};
  background: linear-gradient(140deg, #131d23 0%, #19e4bb 20%, #7B1FA2 60%, #191c2b 100%);
  position:relative;z-index:0;overflow-x:hidden;
`;

const GlassNav = styled.div`
  display:flex;gap:18px;justify-content:center;align-items:center;
  margin:0 auto 28px auto;padding:10px 0 9px 0;
  background:rgba(44,54,86,0.54);
  border-radius:26px;box-shadow:0 2px 18px #16ffb335;
  position:relative;z-index:2;backdrop-filter: blur(6px);
  width: 90%;
  max-width: 1200px;
`;

const TabBtn = styled.button`
  border:none;outline:none;cursor:pointer;
  background:${p=>p.active?`linear-gradient(90deg,${theme.main},${theme.accent})`:"transparent"};
  color:${p=>p.active?"#fff":theme.main};
  font-weight:900;font-size:1.12rem;
  padding:11px 34px;border-radius:21px;
  transition:background .19s,color .17s;
  box-shadow:${p=>p.active?"0 2px 12px #7b1fa255":"none"};
`;

const FilterBar = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  margin: 0 auto 22px auto;
  max-width: 1120px;
  align-items: center;
  justify-content: center;
  background: linear-gradient(110deg, #1c2e36 60%, #30ffc4 120%);
  border-radius: 20px;
  box-shadow: 0 1px 12px #3DF2B233;
  padding: 15px 18px;
  width: 90%;
  z-index: 10;
  position: relative;
`;

const FilterLabel = styled.div`
  font-weight: 900; color: #3DF2B2; margin-bottom: 7px; font-size: 1.09rem;
`;

const FilterGroup = styled.div`
  display: flex; flex-direction: column; align-items: stretch; min-width: 125px;
`;

const BtnGroup = styled.div`
  display: flex; gap: 10px; justify-content: flex-start;
`;

const FilterBtn = styled.button`
  background: ${({ active }) => active ? "linear-gradient(92deg, #7B1FA2 60%, #3DF2B2 99%)" : "#242e38"};
  color: ${({ active }) => active ? "#fff" : "#23dac3"};
  font-weight: 900; font-size: 1.04rem;
  border: none;
  border-radius: 13px;
  padding: 10px 19px;
  cursor: pointer;
  transition: all .16s;
  box-shadow: ${({ active }) => active ? "0 2px 12px #7b1fa266" : "none"};
  outline: none;
  &:hover { background:linear-gradient(92deg, #7B1FA2 40%, #3DF2B2 99%); color:#fff; }
`;

const SearchWrap = styled.div`
  display: flex; align-items: center; background: #232a35; border-radius: 13px; padding: 0 7px;
  box-shadow:0 1px 7px #16ffb321;
  min-width:220px; flex:1;
`;

const SearchInput = styled.input`
  background: transparent; border: none; outline: none;
  font-size: 1.08rem; color: #fff; font-weight: 900;
  padding: 12px 7px 12px 11px;
  width: 100%;
  &::placeholder {
    color: #3DF2B299;
  }
`;

const ComboGrid = styled.div`
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(350px,1fr));
  gap:30px;
  margin:38px auto 48px auto;max-width:1200px;
  @media(max-width:700px){gap:15px;}
`;

const ComboCardWrap = styled.div`perspective:1300px;`;

const TopCardWrap = styled.div`
  .special-card {
    border: 2.6px solid ${({rank}) =>
      rank === 1 ? theme.gold : rank === 2 ? theme.silver : theme.bronze};
    box-shadow: 0 0 30px
      ${({rank}) =>
        rank === 1 ? "#FFD70088"
        : rank === 2 ? "#B3B3B388"
        : "#E5A76B77"};
    position:relative;
    &:after {
      content: "${({rank}) =>
        rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}";
      position: absolute;
      top: -21px; left: 50%;
      transform: translateX(-50%);
      font-size: 2rem;
      filter: drop-shadow(0 4px 11px #191c2b44);
      pointer-events: none;
      z-index:10;
    }
  }
`;

const ComboCard = styled.div`
  background:${theme.card};
  border-radius:24px;
  box-shadow:0 2px 14px #5a70ff18;
  border:2px solid #3d274540;
  padding:30px 19px 22px 19px;
  text-align:center;position:relative;z-index:2;
  transition:box-shadow .25s,transform .23s;
  &:hover{box-shadow:0 12px 60px #7b1fa225,0 3px 12px #3df2b255;transform:scale(1.024);}
`;

const HeroRow = styled.div`
  display:flex;gap:9px;justify-content:center;margin-bottom:14px;z-index:3;position:relative;
`;

const NeonHero = styled.div`
  width:76px;height:76px;border-radius:50%;overflow:hidden;
  box-shadow:0 0 0 3px #3DF2B255,0 6px 16px #7b1fa240;
  border:2.2px solid #3DF2B2;
  background:#1e1337;display:flex;align-items:center;justify-content:center;
  position:relative;z-index:2;
  transition:box-shadow .19s,transform .21s;
  &:hover{box-shadow:0 0 24px 6px #7b1fa2,0 4px 16px #3DF2B2;transform:scale(1.11) rotateZ(6deg);}
`;

const ComboTitle = styled.div`
  font-size:1.23rem;font-weight:900;color:${theme.main};margin-bottom:5px;letter-spacing:.01em;
  text-shadow:0 1px 3px #3225b2;cursor:pointer;
  transition:.13s;
`;

const ComboDetail = styled.div`
  display:flex;justify-content:center;gap:16px;
  margin-bottom:6px;flex-wrap:wrap;
  color:#bff7ec;font-weight:800;
`;

const ActionRow = styled.div`
  display:flex;gap:10px;justify-content:center;margin-top:16px;
`;

const ShineBtn = styled.button`
  position:relative;overflow:hidden;
  background:${theme.main};color:#fff;font-weight:900;
  border:none;border-radius:13px;padding:11px 20px;
  font-size:1.04rem;box-shadow:0 2px 9px #7b1fa217;
  display:flex;align-items:center;gap:7px;cursor:pointer;
  transition:background .21s,color .17s;
  &:hover {
    background:linear-gradient(90deg,${theme.main},${theme.accent});
    color:#fff;
  }
`;

const ModalOverlay = styled.div`
  position:fixed;inset:0;z-index:199;background:rgba(21,24,32,0.95);
  display:flex;align-items:center;justify-content:center;
  backdrop-filter: blur(8px);
`;

const ModalContent = styled.div`
  background:${theme.card};
  border-radius:28px;
  max-width:500px;width:96vw;max-height:94vh;
  box-shadow:0 20px 80px #7b1fa21c,0 2px 13px #3df2b211;
  border:2.5px solid #7B1FA2;
  padding:32px 18px 26px 18px;
  overflow-y:auto;
  position:relative;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const CloseBtn = styled.button`
  position:absolute;top:17px;right:22px;z-index:4;
  font-size:2rem;color:${theme.gold};
  background:none;border:none;font-weight:900;cursor:pointer;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.2);
  }
`;

const Toast = styled.div`
  position:fixed;bottom:3.3rem;left:50%;transform:translateX(-50%);
  background:${theme.main};
  color:#fff;
  padding:17px 32px;border-radius:13px;
  font-size:1rem;font-weight:900;
  box-shadow:0 8px 28px #7b1fa216;
  z-index:1020;letter-spacing:.04em;
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from { opacity: 0; transform: translateX(-50%) translateY(20px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
`;

const ScrollTopBtn = styled.button`
  position:fixed;bottom:35px;right:30px;
  background:linear-gradient(90deg,${theme.main},${theme.accent} 100%);
  color:#fff;width:56px;height:56px;border-radius:50%;
  border:none;font-size:1.6rem;z-index:160;
  box-shadow:0 8px 24px #7b1fa215,0 2px 8px #3df2b216;cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.1);
  }
`;

const HeroImageLarge = styled.div`
  width: 110px; height: 110px; border-radius: 50%;
  overflow: hidden; margin: 0 auto 16px auto;
  box-shadow: 0 0 22px #3df2b299, 0 2px 12px #0009;
  border: 3px solid ${theme.main};
  background: #1a1e33;
  display: flex; align-items: center; justify-content: center;
`;

// ========= Multi & Single Select =========
const MultiSelect = ({ options, value, onChange, placeholder }) => (
  <div style={{ minWidth: 160, maxWidth: 340, background: "#222b3a", borderRadius: 10, padding: 4 }}>
    <select
      multiple
      style={{ width: "100%", background: "transparent", color: theme.accent, border: "none", fontWeight: "900", fontSize: "1.03rem", outline: "none", height: 32 + Math.min(options.length, 7) * 30, borderRadius: 8, padding: 5 }}
      value={value}
      onChange={e => {
        const vals = Array.from(e.target.selectedOptions, o => o.value);
        onChange(vals);
      }}
    >
      {options.map(opt =>
        <option value={opt} key={opt} style={{ background: "#232e3c", color: "#fff" }}>
          {opt}
        </option>
      )}
    </select>
    <div style={{ color: "#999", fontSize: 13, marginTop: 1 }}>{placeholder}</div>
  </div>
);

const SingleSelect = ({ options, value, onChange, placeholder }) => (
  <div style={{ minWidth: 160, maxWidth: 340, background: "#222b3a", borderRadius: 10, padding: 4 }}>
    <select
      style={{ width: "100%", background: "transparent", color: theme.accent, border: "none", fontWeight: "900", fontSize: "1.03rem", outline: "none", height: 38, borderRadius: 8, padding: 5 }}
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      <option value="">{placeholder}</option>
      {options.map(opt =>
        <option value={opt} key={opt} style={{ background: "#232e3c", color: "#fff" }}>
          {opt}
        </option>
      )}
    </select>
  </div>
);

// ========== HERO IMAGE MAPPING ==========
const getHeroImage = (heroName) => {
  if (!heroName) return `${process.env.PUBLIC_URL}/heroimages/default.jpg`;
  const specialMappings = {"tel'annas": "telannas", "y'bneth": "ybneth" };
  if (specialMappings[heroName?.toLowerCase?.()]) {
    return `${process.env.PUBLIC_URL}/heroimages/${specialMappings[heroName.toLowerCase()]}.jpg`;
  }
  const formatImageName = (name) => {
    return name
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  };
  try {
    const formattedName = formatImageName(heroName);
    const imagePath = `${process.env.PUBLIC_URL}/heroimages/${formattedName}.jpg`;
    return imagePath;
  } catch {
    return `${process.env.PUBLIC_URL}/heroimages/default.jpg`;
  }
};

const renderHeroImage = (imageSrc, altText) => (
  <img
    src={imageSrc}
    alt={altText}
    style={{ width: "100%", height: "100%", objectFit: "cover", backgroundColor: "transparent" }}
    onError={(e) => {
      e.target.onerror = null;
      e.target.src = `${process.env.PUBLIC_URL}/heroimages/default.jpg`;
    }}
  />
);

// ================== COMPONENT ==================
export default function TierData({ games, comboStats }) {
  // สร้าง state filter ใหม่
  const [comboType, setComboType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("winRate");
  const [currentPage, setCurrentPage] = useState(1);
  const [savedCombos, setSavedCombos] = useState([]);
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [showToast, setShowToast] = useState({ visible: false, message: "", type: "" });

  // ==== Filter สำหรับวันที่/ทีม/ตำแหน่ง ====
  const allOneHero = comboStats?.oneHero || [];
  const allCombo2 = comboStats?.combo2 || [];
  const allCombo3 = comboStats?.combo3 || [];
  const dateOptions = [...new Set([
    ...allOneHero.map(c => c.date).filter(Boolean),
    ...allCombo2.map(c => c.date).filter(Boolean),
    ...allCombo3.map(c => c.date).filter(Boolean)
  ])].sort();
  const teamOptions = [...new Set([
    ...allOneHero.map(c => c.competitor).filter(Boolean),
    ...allCombo2.map(c => c.competitor).filter(Boolean),
    ...allCombo3.map(c => c.competitor).filter(Boolean)
  ])].sort();
  const positionOptions = [...new Set([
    ...allOneHero.map(c => c.position).filter(Boolean),
    ...allCombo2.map(c => c.position).filter(Boolean),
    ...allCombo3.map(c => c.position).filter(Boolean)
  ])].sort();

  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [teamFilter, setTeamFilter] = useState([]);
  const [positionFilter, setPositionFilter] = useState([]);
  const itemsPerPage = 12;

  // ========== DATA MAP ==========
  let heroList = (allOneHero || []).map(h => ({
    name: h.hero,
    comboType: "1-hero",
    characters: [h.hero],
    images: [getHeroImage(h.hero)],
    wins: h.win,
    totalGames: h.total,
    winRate: Number(h.winrate),
    losses: h.losses ?? (h.total - h.win),
    position: h.position,
    date: h.date,
    competitor: h.competitor,
  }));

  let combo2List = (allCombo2 || []).map(c => {
    const chars = c.combo.split(" + ").map(s => s.trim());
    return {
      name: c.combo,
      comboType: "2-heroes",
      characters: chars,
      images: chars.map(getHeroImage),
      wins: c.win,
      totalGames: c.total,
      winRate: Number(c.winrate),
      losses: c.losses ?? (c.total - c.win),
      position: c.position,
      date: c.date,
      competitor: c.competitor,
    }
  });

  let combo3List = (allCombo3 || []).map(c => {
    const chars = c.combo.split(" + ").map(s => s.trim());
    return {
      name: c.combo,
      comboType: "3-heroes",
      characters: chars,
      images: chars.map(getHeroImage),
      wins: c.win,
      totalGames: c.total,
      winRate: Number(c.winrate),
      losses: c.losses ?? (c.total - c.win),
      position: c.position,
      date: c.date,
      competitor: c.competitor,
    } 
  });

  // รวมทุก combo
  let combos = [...heroList, ...combo2List, ...combo3List];

  // ========== FILTER ==========
  let showCombos = combos;
  if (comboType === "1-hero") showCombos = heroList;
  else if (comboType === "2-heroes") showCombos = combo2List;
  else if (comboType === "3-heroes") showCombos = combo3List;
  if (searchTerm) showCombos = showCombos.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  if (dateStart && dateEnd) {
    showCombos = showCombos.filter(c => c.date && c.date >= dateStart && c.date <= dateEnd);
  } else if (dateStart) {
    showCombos = showCombos.filter(c => c.date && c.date === dateStart);
  }
  if (teamFilter.length > 0) {
    showCombos = showCombos.filter(c => teamFilter.includes(c.competitor));
  }
  if (positionFilter.length > 0) {
    showCombos = showCombos.filter(c => positionFilter.some(pos => c.position && c.position.includes(pos)));
  }
  showCombos.sort((a, b) =>
    sortBy === "winRate" ? b.winRate - a.winRate
      : sortBy === "totalGames" ? b.totalGames - a.totalGames
      : b.wins - a.wins
  );
  const currentCombos = showCombos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // ==== Chart: Top 10 By Wins ====
  const top10Wins = [...showCombos].sort((a, b) => b.wins - a.wins).slice(0, 10);
  const winChartData = {
    labels: top10Wins.map(c => c.name),
    datasets: [{
      label: (comboType === "1-hero" ? "Win (Hero)" : "Win (Combo)"),
      data: top10Wins.map(c => c.wins),
      backgroundColor: "#3DF2B2"
    }]
  };
  const top10Games = [...showCombos].sort((a, b) => b.totalGames - a.totalGames).slice(0, 10);
  const totalGamesChartData = {
    labels: top10Games.map(c => c.name),
    datasets: [{ label: "Total Games", data: top10Games.map(c => c.totalGames), backgroundColor: "#7B1FA2" }]
  };

  // ========== Chart Option ==========
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false, labels: { color: "#fff", font: { size: 18 } } },
      datalabels: { color: "#fff", font: { weight: 'bold', size: 16 } }
    },
    scales: {
      x: { ticks: { color: "#fff", font: { size: 16 } } },
      y: { ticks: { color: "#fff", font: { size: 16 } } }
    }
  };

  // ========== Action ==========
  const saveCombo = combo => {
    if (!savedCombos.some(c => c.name === combo.name)) {
      const updated = [...savedCombos, combo];
      setSavedCombos(updated);
      localStorage.setItem("savedCombos", JSON.stringify(updated));
      setShowToast({ visible: true, message: `Saved "${combo.name}"`, type: "success" });
      setTimeout(() => setShowToast({ visible: false }), 1300);
    }
  };
  const removeCombo = comboName => {
    const updated = savedCombos.filter(c => c.name !== comboName);
    setSavedCombos(updated);
    localStorage.setItem("savedCombos", JSON.stringify(updated));
    setShowToast({ visible: true, message: `Removed "${comboName}"`, type: "success" });
    setTimeout(() => setShowToast({ visible: false }), 1000);
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedCombos") || "[]");
    setSavedCombos(saved);
  }, []);
  useEffect(() => { setCurrentPage(1); }, [comboType, searchTerm, dateStart, dateEnd, teamFilter, positionFilter]);

  // ========== UI ==============
  return (
    <Bg>
      <GlassNav>
        <TabBtn active={comboType==="all"} onClick={()=>setComboType("all")}>All</TabBtn>
        <TabBtn active={comboType==="1-hero"} onClick={()=>setComboType("1-hero")}>Hero</TabBtn>
        <TabBtn active={comboType==="2-heroes"} onClick={()=>setComboType("2-heroes")}>2-Heroes</TabBtn>
        <TabBtn active={comboType==="3-heroes"} onClick={()=>setComboType("3-heroes")}>3-Heroes</TabBtn>
      </GlassNav>
      <FilterBar>
        <FilterGroup>
          <FilterLabel>Sort By</FilterLabel>
          <BtnGroup>
            <FilterBtn active={sortBy==="winRate"} onClick={()=>setSortBy("winRate")}>Winrate</FilterBtn>
            <FilterBtn active={sortBy==="totalGames"} onClick={()=>setSortBy("totalGames")}>Total Games</FilterBtn>
            <FilterBtn active={sortBy==="mostWins"} onClick={()=>setSortBy("mostWins")}>Most Wins</FilterBtn>
          </BtnGroup>
        </FilterGroup>
        <FilterGroup style={{ minWidth: 180 }}>
          <FilterLabel>วันที่ (เริ่ม)</FilterLabel>
          <SingleSelect
            options={dateOptions}
            value={dateStart}
            onChange={setDateStart}
            placeholder="เลือกวันที่เริ่ม"
          />
        </FilterGroup>
        <FilterGroup style={{ minWidth: 180 }}>
          <FilterLabel>วันที่ (ถึง)</FilterLabel>
          <SingleSelect
            options={dateOptions}
            value={dateEnd}
            onChange={setDateEnd}
            placeholder="เลือกวันที่ถึง"
          />
        </FilterGroup>
        <FilterGroup>
          <FilterLabel>ทีมที่เจอ</FilterLabel>
          <MultiSelect
            options={teamOptions}
            value={teamFilter}
            onChange={setTeamFilter}
            placeholder="เลือกได้หลายทีม"
          />
        </FilterGroup>
        <FilterGroup>
          <FilterLabel>ตำแหน่ง</FilterLabel>
          <MultiSelect
            options={positionOptions}
            value={positionFilter}
            onChange={setPositionFilter}
            placeholder="เลือกได้หลายตำแหน่ง"
          />
        </FilterGroup>
        <FilterGroup style={{ minWidth: 220, maxWidth: 350, flex: 1 }}>
          <FilterLabel>Search</FilterLabel>
          <SearchWrap>
            <FiSearch style={{ marginRight: 7, color: "#3DF2B2", fontSize: 19 }} />
            <SearchInput
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder={`Search ${comboType === "1-hero" ? "hero" : "combo"}...`}
            />
          </SearchWrap>
        </FilterGroup>
      </FilterBar>
      <ComboGrid>
        {currentCombos.length === 0 ?
          <ComboCard style={{ gridColumn: "1/-1", textAlign: "center", padding: "64px 10px" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 17 }}>🔍</div>
            <div style={{ color: theme.accent, fontWeight: 900, fontSize: 23 }}>No {comboType === "1-hero" ? "hero" : "combo"} found</div>
            <div style={{ color: "#bff7ec", marginTop: 5, fontSize: 18 }}>ลองค้นหาด้วยคีย์เวิร์ดอื่น หรือเปลี่ยน Filter</div>
          </ComboCard>
          : currentCombos.map((combo, idx) => {
            const cardIdx = showCombos.findIndex(c => c.name === combo.name);
            if (cardIdx >= 0 && cardIdx < 3) {
              return (
                <TopCardWrap key={combo.name} rank={cardIdx + 1}>
                  <Tilt glareEnable={true} glareMaxOpacity={0.19} scale={1.02} tiltMaxAngleX={11} tiltMaxAngleY={14} transitionSpeed={1200} style={{ borderRadius: "22px" }}>
                    <ComboCard className="special-card" onClick={() => setSelectedCombo(combo)}>
                      <HeroRow>
                        {combo.characters.map((char, i) =>
                          <NeonHero key={i}>
                            {renderHeroImage(combo.images ? combo.images[i] : getHeroImage(char), char)}
                          </NeonHero>
                        )}
                      </HeroRow>
                      <ComboTitle style={{ color: theme.accent, fontSize: 24 }}>
                        {comboType === "1-hero" ? "Hero: " : ""}
                        {combo.name}
                      </ComboTitle>
                      <ComboDetail style={{ fontSize: 19 }}>
                        <span>Winrate: <b style={{ color: theme.success, fontSize: 21 }}>{combo.winRate}%</b></span>
                        <span>Games: <b style={{ color: theme.blue, fontSize: 21 }}>{combo.totalGames}</b></span>
                      </ComboDetail>
                      <ComboDetail style={{ fontSize: 19 }}>
                        <span style={{ color: theme.success }}>Win {combo.wins}</span>
                        <span style={{ color: theme.danger }}>Lose {combo.losses}</span>
                      </ComboDetail>
                      <ActionRow>
                        {savedCombos.some(c => c.name === combo.name) ?
                          <ShineBtn style={{ background: theme.success, fontSize: 18 }}><FiStar /> Saved</ShineBtn>
                          :
                          <ShineBtn onClick={e => { e.stopPropagation(); saveCombo(combo); }} style={{ fontSize: 18 }}><FiSave /> Save</ShineBtn>
                        }
                      </ActionRow>
                    </ComboCard>
                  </Tilt>
                </TopCardWrap>
              );
            }
            return (
              <ComboCardWrap key={combo.name}>
                <Tilt glareEnable={true} glareMaxOpacity={0.19} scale={1.02} tiltMaxAngleX={11} tiltMaxAngleY={14} transitionSpeed={1200} style={{ borderRadius: "22px" }}>
                  <ComboCard onClick={() => setSelectedCombo(combo)}>
                    <HeroRow>
                      {combo.characters.map((char, i) =>
                        <NeonHero key={i}>
                          {renderHeroImage(combo.images ? combo.images[i] : getHeroImage(char), char)}
                        </NeonHero>
                      )}
                    </HeroRow>
                    <ComboTitle style={{ color: theme.accent, fontSize: 22 }}>
                      {comboType === "1-hero" ? "Hero: " : ""}
                      {combo.name}
                    </ComboTitle>
                    <ComboDetail style={{ fontSize: 18 }}>
                      <span>Winrate: <b style={{ color: theme.success, fontSize: 20 }}>{combo.winRate}%</b></span>
                      <span>Games: <b style={{ color: theme.blue, fontSize: 20 }}>{combo.totalGames}</b></span>
                    </ComboDetail>
                    <ComboDetail style={{ fontSize: 18 }}>
                      <span style={{ color: theme.success }}>Win {combo.wins}</span>
                      <span style={{ color: theme.danger }}>Lose {combo.losses}</span>
                    </ComboDetail>
                    <ActionRow>
                      {savedCombos.some(c => c.name === combo.name) ?
                        <ShineBtn style={{ background: theme.success, fontSize: 18 }}><FiStar /> Saved</ShineBtn>
                        :
                        <ShineBtn onClick={e => { e.stopPropagation(); saveCombo(combo); }} style={{ fontSize: 18 }}><FiSave /> Save</ShineBtn>
                      }
                    </ActionRow>
                  </ComboCard>
                </Tilt>
              </ComboCardWrap>
            );
          })}
      </ComboGrid>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 7, marginBottom: 32 }}>
        <ShineBtn style={{ background: "#183436", color: theme.main, fontSize: 18 }} disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}><FiChevronLeft />Prev</ShineBtn>
        {[...Array(Math.ceil(showCombos.length / itemsPerPage)).keys()].map(n =>
          <ShineBtn
            key={n}
            style={{
              background: currentPage === n + 1 ? theme.accent : "#233b3d",
              color: currentPage === n + 1 ? "#191c2b" : "#b9bbf3",
              fontSize: 18
            }}
            onClick={() => setCurrentPage(n + 1)}
          >{n + 1}</ShineBtn>
        )}
        <ShineBtn style={{ background: "#183436", color: theme.main, fontSize: 18 }} disabled={currentPage * itemsPerPage >= showCombos.length}
          onClick={() => setCurrentPage(currentPage + 1)}>Next<FiChevronRight /></ShineBtn>
      </div>
      {/* Chart */}
      <div style={{ maxWidth: 1150, margin: "38px auto 0 auto", display: "grid", gap: 24, gridTemplateColumns: "1fr 1fr" }}>
        <div style={{ background: theme.cardGlass, borderRadius: 18, padding: 19, boxShadow: "0 2px 13px #16ffb335", backdropFilter: "blur(12px)" }}>
          <div style={{ fontWeight: 900, fontSize: "1.22rem", marginBottom: 9, color: theme.main, letterSpacing: ".01em" }}>
            {comboType === "1-hero" ? "🏆 Top 10 Heroes (Win)" : "🏆 Top 10 Combos (Win)"}
          </div>
          <div style={{ height: 220 }}>
            <Bar data={winChartData} options={chartOptions} />
          </div>
        </div>
        <div style={{ background: theme.cardGlass, borderRadius: 18, padding: 19, boxShadow: "0 2px 13px #16ffb335", backdropFilter: "blur(12px)" }}>
          <div style={{ fontWeight: 900, fontSize: "1.22rem", marginBottom: 9, color: theme.accent, letterSpacing: ".01em" }}>🔥 Top 10 {comboType === "1-hero" ? "Heroes" : "Combos"} (Total Games)</div>
          <div style={{ height: 220 }}><Bar data={totalGamesChartData} options={chartOptions} /></div>
        </div>
      </div>
      {/* Modal */}
      {selectedCombo && (
        <ModalOverlay>
          <ModalContent>
            <CloseBtn onClick={() => setSelectedCombo(null)}>×</CloseBtn>
            <div style={{ textAlign: "center" }}>
              <HeroImageLarge>
                {renderHeroImage(
                  selectedCombo.images ? selectedCombo.images[0] : getHeroImage(selectedCombo.characters[0]),
                  selectedCombo.characters[0]
                )}
              </HeroImageLarge>
              <div style={{ fontWeight: 900, fontSize: "1.8rem", color: theme.main, marginBottom: 4 }}>
                {selectedCombo.name}
              </div>
              <div style={{ color: "#b8bbee", fontWeight: 700, marginBottom: 16, fontSize: "1.11rem" }}>
                {selectedCombo.characters.join(" • ")}
              </div>
              <div style={{ display: "flex", justifyContent: "space-around", margin: "0 0 12px 0" }}>
                <div>
                  <div style={{ color: "#bff7ec", fontWeight: 900, fontSize: 16 }}>Winrate</div>
                  <div style={{ color: theme.success, fontWeight: 900, fontSize: "1.21rem" }}>
                    {selectedCombo.winRate}%
                  </div>
                </div>
                <div>
                  <div style={{ color: "#bff7ec", fontWeight: 900, fontSize: 16 }}>Games</div>
                  <div style={{ color: theme.blue, fontWeight: 900, fontSize: "1.21rem" }}>
                    {selectedCombo.totalGames}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 12 }}>
                <div style={{ color: theme.success, fontWeight: 700, fontSize: 18 }}>
                  Win {selectedCombo.wins}
                </div>
                <div style={{ color: theme.danger, fontWeight: 700, fontSize: 18 }}>
                  Lose {selectedCombo.losses}
                </div>
              </div>
              <div style={{ marginTop: 17 }}>
                {savedCombos.some((c) => c.name === selectedCombo.name) ? (
                  <ShineBtn style={{ background: theme.danger, fontSize: 18 }} onClick={() => removeCombo(selectedCombo.name)}>
                    <FiTrash2 /> Remove
                  </ShineBtn>
                ) : (
                  <ShineBtn style={{ background: theme.main, fontSize: 18 }} onClick={() => saveCombo(selectedCombo)}>
                    <FiStar /> Save
                  </ShineBtn>
                )}
              </div>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
      {showToast.visible && (
        <Toast>
          {showToast.type === "success" ? "✅" : "ℹ️"} {showToast.message}
        </Toast>
      )}
      <ScrollTopBtn
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>↑</ScrollTopBtn>
    </Bg>
  );
}
