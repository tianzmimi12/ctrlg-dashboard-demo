// src/components/DraftPage.jsx

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import heroList from '../data/heroList.json';
import { parseComboStatsSheet } from '../utils/excelParser';

const COUNTER_MAP = {
  "Hayate":     ["Elandorr"],
  "Capheny":    ["Mina", "Stuart", "Valhein"],
  "Stuart":     ["Tachi"],
  "Marja":      ["Biron", "Qi", "Elandorr", "Hayate"],
  "Qi":         ["Omen", "Florentino", "Toro"],
  "Murad":      ["Omen", "Qi", "Aleister"],
  "Florentino": ["Marja"],
  "Raz":        ["Goverra", "Tulen"],
  "Liliana":    ["Mganga"],
  "Lorion":     ["Mganga", "Heino"],
  "Rouie":      ["TeeMee", "Lorion", "Raz"],
  "Elandorr":   ["Mina", "Murad", "Krixi"],
  "Keera":      ["Elandorr", "Bolt Baron", "Omen"],
  "Aoi":        ["Qi", "Stuart"],
  "Billow":     ["Qi", "Bolt Baron", "Elandorr"],
  "Tachi":      ["Elandorr"],
  "Enzo":       ["Krizzix", "Toro", "Arduin"],
  "Dolia":      ["Enzo", "Billow", "Ming"],
  "Ming":       ["Enzo", "Krizzix", "Grakk"],
  "Bolt Baron": ["Tachi", "Qi"],
  "Nakroth":    ["Stuart", "Billow"],
  "Biron":      ["Florentino", "Maloch"],
  "Skud":       ["Florentino", "Maloch"]
};

const banSeq1 = [
  { team: 'A', count: 1 }, { team: 'B', count: 1 },
  { team: 'A', count: 1 }, { team: 'B', count: 1 },
];
const pickSeq1 = [
  { team: 'A', count: 1 },
  { team: 'B', count: 2 },
  { team: 'A', count: 2 },
  { team: 'B', count: 1 },
];
const banSeq2 = [
  { team: 'B', count: 1 }, { team: 'A', count: 1 },
  { team: 'B', count: 1 }, { team: 'A', count: 1 },
];
const pickSeq2 = [
  { team: 'B', count: 1 },
  { team: 'A', count: 2 },
  { team: 'B', count: 1 },
];

const BO_OPTIONS = { BO1: 1, BO3: 3, BO7: 7 };
const highlightColor = '#39FF14';

const ROLE_ICON = {
  ทั้งหมด: '🌐',
  Fighter: '⚔️',
  Mage: '🪄',
  Assasin: '🗡️',
  Support: '💖',
  Tank: '🛡️',
  Carry: '🏹',
};
const ROLE_ORDER = ['Carry', 'Assasin', 'Mage', 'Fighter', 'Tank', 'Support'];
const ROLE_BORDER_COLORS = {
  Fighter: '#FF4500',
  Mage:    '#1E90FF',
  Support: '#FFD700',
  Assasin: '#8B008B',
  Tank:    '#228B22',
  Carry:   '#DA70D6',
};

const TEAM_TAG     = { A: 'A', B: 'B' };
const ACTION_COLOR = { pick: '#57eae7', ban: '#ea1c24' };
const TEAM_COLOR   = { A: '#ff6b6b', B: '#6ba3ff' };

const getImage = filename => `${process.env.PUBLIC_URL}/heroimages/${filename}`;

function normalizePosition(pos) {
  if (!pos) return '';
  const s = pos.toString().toLowerCase().replace(/\s+/g, '');
  if (['fsdsl','dsl','ds','fsds'].includes(s))    return 'DSL';
  if (['mid','fsmid'].includes(s))                return 'MID';
  if (['adl','fsadl'].includes(s))                return 'ADL';
  if (['jungle','fsjungle','jg'].includes(s))     return 'JUG';
  if (['roaming','fsroaming','roam','support','sup','fsroam'].includes(s))  return 'SUP';
  return pos.toString().toUpperCase();
}

function normalizeRole(role) {
  const s = (role || '').toString().trim().toLowerCase();
  if (['assassin','assasin'].includes(s)) return 'Assasin';
  if (s === 'marksman' || s === 'carry') return 'Carry';
  if (s === 'tank') return 'Tank';
  if (s === 'fighter') return 'Fighter';
  if (s === 'mage') return 'Mage';
  if (s === 'support') return 'Support';
  return role || 'Unknown';
}

function getHeroStatsFromGames(heroName, games) {
  if (!heroName) return [];
  const key = heroName.trim().toLowerCase();
  const statsMap = {};
  const totalGames = (games && games.length) ? games.length : 1;

  games.forEach(g => {
    (g.fsPick || []).forEach((h, i) => {
      if (h && h.trim().toLowerCase() === key) {
        const pos = normalizePosition((g.fsPosition || [])[i]);
        if (!statsMap[pos]) statsMap[pos] = { win: 0, total: 0 };
        statsMap[pos].total += 1;
        if (g.win === 1 || g.win === '1') statsMap[pos].win += 1;
      }
    });
  });

  return Object.entries(statsMap).map(([position, { win, total }]) => ({
    position,
    total,
    win,
    pickRate:  totalGames ? ((total / totalGames) * 100).toFixed(1) : '0.0',
    winRate:   total ? ((win / total) * 100).toFixed(1) : '0.0',
  }));
}

export default function DraftPage({
  games,
  comboStats,
  excelData,
  heroes = heroList,
}) {
  const navigate = useNavigate();
  const heroRefs = useRef({});

  // ===== Pre-choose =====
  const [preChoose, setPreChoose] = useState({ A: [null, null, null, null, null], B: [null, null, null, null, null] });
  const [selectingPre, setSelectingPre] = useState(null); // { team:'A'|'B', i:0-4 } | null

  // ===== Side & First-Pick =====
  const [teamARole, setTeamARole]         = useState('red');
  const [firstPickTeam, setFirstPickTeam] = useState('A');

  // ===== Opponent Stats =====
  const [opponentStats, setOpponentStats]         = useState(null);
  const [opponentSheetList, setOpponentSheetList] = useState([]);
  const [opponentSheet, setOpponentSheet]         = useState('TLN');

  // ===== Series State =====
  const [boType, setBoType]               = useState(null);
  const [currentGame, setCurrentGame]     = useState(1);
  const [globalPicks, setGlobalPicks]     = useState({ A: [], B: [] });
  const [completedGames, setCompletedGames] = useState([]);
  const [viewingHistory, setViewingHistory] = useState(null);

  // ===== Draft State =====
  const [stepIndex, setStepIndex]           = useState(0);
  const [selectionCount, setSelectionCount] = useState(0);
  const [bans, setBans]                     = useState({ A: [], B: [] });
  const [picks, setPicks]                   = useState({ A: [], B: [] });
  const [history, setHistory]               = useState([]);

  const [alertMsg, setAlertMsg]         = useState('');
  const [selectedRole, setSelectedRole] = useState('ทั้งหมด');
  const [searchTerm, setSearchTerm]     = useState('');

  const totalGames = boType ? BO_OPTIONS[boType] : 0;

  // ===== Drag-to-select (threshold) =====
  const [isDragging, setIsDragging] = useState(false);
  const dragVisitedRef = useRef(new Set());
  const pointerDownRef = useRef({ down:false, x:0, y:0, startedOn:null });
  const suppressClickRef = useRef(false);
  const DRAG_THRESHOLD = 6; // px (mouse)
  const TOUCH_THRESHOLD = 9; // px (touch)

  // ===== NEW: Drag & Drop (HTML5) =====
  const [dragHero, setDragHero] = useState(null); // hero object ที่กำลังถูกลาก
  const getHeroFromDrop = (e) => {
    if (dragHero) return dragHero; // ใช้ state ก่อน เผื่อ dataTransfer ถูกบล็อค
    const name = e.dataTransfer?.getData?.('text/plain');
    if (!name) return null;
    return heroMap.get(name) || null;
  };

  // ===== Helper: รีเซ็ตโหมด "รูดเลือก" ทุกครั้งหลัง DnD =====
  function resetHoverDrag() {
    setIsDragging(false);
    dragVisitedRef.current.clear();
    pointerDownRef.current = { down:false, x:0, y:0, startedOn:null };
    setTimeout(() => { suppressClickRef.current = false; }, 0);
  }

  useEffect(() => {
    const onMove = (e) => {
      if (!pointerDownRef.current.down || isDragging) return;
      const x = e.clientX ?? 0, y = e.clientY ?? 0;
      const dx = x - pointerDownRef.current.x;
      const dy = y - pointerDownRef.current.y;
      if ((dx*dx + dy*dy) > DRAG_THRESHOLD*DRAG_THRESHOLD) {
        setIsDragging(true);
        suppressClickRef.current = true; // กัน onClick ยิงทับ
      }
    };
    const onTouchMove = (e) => {
      if (!pointerDownRef.current.down || isDragging) return;
      const t = e.touches?.[0];
      if (!t) return;
      const dx = t.clientX - pointerDownRef.current.x;
      const dy = t.clientY - pointerDownRef.current.y;
      if ((dx*dx + dy*dy) > TOUCH_THRESHOLD*TOUCH_THRESHOLD) {
        setIsDragging(true);
        suppressClickRef.current = true;
      }
    };
    const onUp = () => {
      setIsDragging(false);
      dragVisitedRef.current.clear();
      pointerDownRef.current = { down:false, x:0, y:0, startedOn:null };
      setTimeout(() => { suppressClickRef.current = false; }, 0);
    };
    const onTouchEnd = () => {
      setIsDragging(false);
      dragVisitedRef.current.clear();
      pointerDownRef.current = { down:false, x:0, y:0, startedOn:null };
      setTimeout(() => { suppressClickRef.current = false; }, 0);
    };

    const touchMoveOpts = { passive: false };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onTouchMove, touchMoveOpts);
    window.addEventListener('touchend', onTouchEnd);

    // (ใหม่) จับ dragend/drop ระดับ window เพื่อรีเซ็ตโหมดรูดเสมอหลัง DnD
    const onDragEndGlobal = () => resetHoverDrag();
    window.addEventListener('dragend', onDragEndGlobal);
    window.addEventListener('drop', onDragEndGlobal);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onTouchMove, touchMoveOpts);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('dragend', onDragEndGlobal);
      window.removeEventListener('drop', onDragEndGlobal);
    };
  }, [isDragging]);

  // ===== Draft Sequence =====
  const draftSeq = useMemo(() => {
    const parts = firstPickTeam === 'A'
      ? [
          ...banSeq1.map(s => ({ ...s, type: 'ban' })),
          ...pickSeq1.map(s => ({ ...s, type: 'pick' })),
          ...banSeq2.map(s => ({ ...s, type: 'ban' })),
          ...pickSeq2.map(s => ({ ...s, type: 'pick' })),
        ]
      : [
          ...banSeq2.map(s => ({ ...s, type: 'ban' })),
          ...pickSeq2.map(s => ({ ...s, type: 'pick' })),
          ...banSeq1.map(s => ({ ...s, type: 'ban' })),
          ...pickSeq1.map(s => ({ ...s, type: 'pick' })),
        ];
    return parts;
  }, [firstPickTeam]);
  const totalSteps = draftSeq.length;

  // ===== Panel Colors =====
  const panelColors = {
    A: teamARole === 'red' ? '#8b0000' : '#00008b',
    B: teamARole === 'red' ? '#00008b' : '#8b0000',
  };

  // ===== Highlight Logic =====
  const currentStep = draftSeq[stepIndex] || {};
  const { team: highlightTeam, type: highlightType, count: highlightCount } = currentStep;
  const highlightStartIndex = useMemo(() => {
    return draftSeq
      .slice(0, stepIndex)
      .filter(s => s.team === highlightTeam && s.type === highlightType)
      .reduce((sum, s) => sum + s.count, 0);
  }, [draftSeq, stepIndex, highlightTeam, highlightType]);

  // ===== Used & Filtered Heroes =====
  const localUsed = useMemo(
    () => [...bans.A, ...bans.B, ...picks.A, ...picks.B].map(h => h.name),
    [bans, picks]
  );

  const roleList = useMemo(
    () => ['ทั้งหมด', ...ROLE_ORDER.filter(r => heroes.some(h => normalizeRole(h.role) === r))],
    [heroes]
  );

  const filteredHeroList = useMemo(() => {
    let list = selectedRole === 'ทั้งหมด'
      ? heroes
      : heroes.filter(h => normalizeRole(h.role) === selectedRole);
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      list = list.filter(h => h.name.toLowerCase().includes(term));
    }
    return list;
  }, [heroes, selectedRole, searchTerm]);

  const sortedHeroList = useMemo(() => {
    let arr = [];
    ROLE_ORDER.forEach(role => {
      arr = arr.concat(filteredHeroList.filter(h => normalizeRole(h.role) === role));
    });
    return arr;
  }, [filteredHeroList]);

  const heroMap = useMemo(() => {
    const m = new Map();
    heroes.forEach(h => m.set(h.name, h));
    return m;
  }, [heroes]);

  const pickOwner = useMemo(() => {
    const m = new Map();
    picks.A.forEach(h => m.set(h.name, 'A'));
    picks.B.forEach(h => m.set(h.name, 'B'));
    return m;
  }, [picks]);
  const banOwner = useMemo(() => {
    const m = new Map();
    bans.A.forEach(h => m.set(h.name, 'A'));
    bans.B.forEach(h => m.set(h.name, 'B'));
    return m;
  }, [bans]);

  // ===== Load Opponent Stats =====
  useEffect(() => {
    if (!excelData) return;
    const sheets = excelData.SheetNames || [];
    const teams = sheets.filter(n =>
      ["TLN","BRU","PSG","KOG","HD","BAC","EA"].includes(n)
    );
    setOpponentSheetList(teams);
    setOpponentSheet(teams.includes(opponentSheet) ? opponentSheet : (teams[0] || ''));
  }, [excelData]);

  useEffect(() => {
    if (!excelData || !opponentSheet) {
      setOpponentStats(null);
      return;
    }
    const sheet = excelData.Sheets[opponentSheet];
    if (!sheet) {
      setOpponentStats(null);
      return;
    }
    setOpponentStats(parseComboStatsSheet(sheet, opponentSheet));
  }, [excelData, opponentSheet]);

  // ===== Tooltip =====
  const [tooltip, setTooltip]       = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  function showHeroTooltip(heroName, e) {
    if (!heroName) return;
    const ourList = getHeroStatsFromGames(heroName, games || []);

    const all = (opponentStats?.oneHero || []).filter(Boolean);
    const base = all.reduce((s,x)=> s + (x.total || 0), 0) || 1;
    const key  = heroName.trim().toLowerCase();

    const oppList = all
      .filter(h => (h.hero || '').trim().toLowerCase() === key)
      .map(h => ({
        position:  h.position,
        total:     h.total || 0,
        win:       h.win || 0,
        pickRate:  ((+(h.total || 0) / base) * 100).toFixed(1),
        winRate:   String(h.winrate ?? '0.0'),
      }));

    setTooltipPos({ x: e.clientX, y: e.clientY });
    setTooltip({ heroName, ourList, oppList });
  }
  function hideTooltip() { setTooltip(null); }
  function renderTooltip() {
    if (!tooltip) return null;
    return (
      <div style={{
        position:'fixed',
        left: tooltipPos.x + 14,
        top: tooltipPos.y + 12,
        background:'#181a23',
        border:`2.5px solid ${highlightColor}`,
        borderRadius:12,
        padding:12,
        color:'#fff',
        fontSize:14,
        zIndex:1001,
        pointerEvents:'none',
        boxShadow:'0 8px 24px #000a'
      }}>
        <div style={{ fontWeight:900, fontSize:16, marginBottom:6, color:'#fff600' }}>
          {tooltip.heroName}
        </div>
        <div style={{ marginBottom:6 }}>
          <b>ฝั่งเรา</b>:<br/>
          {tooltip.ourList.length > 0
            ? tooltip.ourList.map((e,i) => (
                <div key={i}>
                  ({e.position}) Total: {e.total}, Win: {e.win},<br/>
                  PickRate: {e.pickRate}%, WinRate: {e.winRate}%
                </div>
              ))
            : <span>- ไม่มีข้อมูล -</span>
          }
        </div>
        <div>
          <b>ฝั่งตรงข้าม ({opponentSheet})</b>:<br/>
          {tooltip.oppList.length > 0
            ? tooltip.oppList.map((e,i) => (
                <div key={i}>
                  ({e.position}) Total: {e.total}, Win: {e.win},<br/>
                  PickRate: {e.pickRate}%, WinRate: {e.winRate}%
                </div>
              ))
            : <span>- ไม่มีข้อมูล -</span>
          }
        </div>
      </div>
    );
  }

  // ===== Pre-choose =====
  function handlePreChoose(team, pickIdx, hero) {
    setPreChoose(prev => {
      const arr = [...prev[team]];
      const dup = arr.findIndex(h => h?.name === hero.name);
      if (dup !== -1) arr[dup] = null;
      arr[pickIdx] = hero;
      return { ...prev, [team]: arr };
    });
  }
  function handleClearPreChoose(team, pickIdx) {
    setPreChoose(prev => {
      const arr = [...prev[team]];
      arr[pickIdx] = null;
      return { ...prev, [team]: arr };
    });
  }

  // ===== Suggested Ban =====
  function getSuggestedBan(preChooseState, bansState, picksState, heroesList) {
    const used = new Set([...bansState.A, ...bansState.B, ...picksState.A, ...picksState.B].map(h => h?.name));
    const validHero = new Set(heroesList.map(h => h.name));
    const nameMap = new Map(heroesList.map(h => [h.name.toLowerCase(), h.name]));
    const out = [];
    Object.values(preChooseState).flat().forEach(hero => {
      if (!hero) return;
      const counters = COUNTER_MAP[hero.name] || [];
      counters.forEach(c => {
        const canonical = nameMap.get(c.toLowerCase());
        if (canonical && validHero.has(canonical) && !used.has(canonical) && !out.includes(canonical)) out.push(canonical);
      });
    });
    return out;
  }
  const suggestBan = useMemo(() => {
    return getSuggestedBan(preChoose, bans, picks, heroes);
  }, [preChoose, bans, picks, heroes]);

  useEffect(() => {
    if (selectingPre && suggestBan.length > 0) {
      const firstHero = suggestBan[0];
      const node = heroRefs.current[firstHero];
      if (node && node.scrollIntoView) node.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectingPre, suggestBan]);

  // cleanup refs
  useEffect(() => {
    const keys = new Set(heroes.map(h => h.name));
    Object.keys(heroRefs.current).forEach(k => { if (!keys.has(k)) delete heroRefs.current[k]; });
  }, [heroes]);

  // ===== History View =====
  function renderHistoryView() {
    const idx = viewingHistory;
    if (idx === null || idx >= completedGames.length) return null;
    const { bans: hBans, picks: hPicks } = completedGames[idx];
    return (
      <div style={{ display:'flex', height:'100vh', background:'#161720', position:'relative' }}>
        <div style={{
          width:170, background:panelColors.A, padding:17, boxShadow:'2px 0 18px #000d',
          borderRadius:'0 28px 28px 0',
          border: `3px solid ${highlightTeam==='A' ? highlightColor : 'transparent'}`
        }}>
          <h4 style={{ color:'#fff', textAlign:'center' }}>Team A – Game {idx+1}</h4>
          <strong style={{ color:'#f9b041' }}>Bans</strong>
          <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center' }}>
            {renderSlots(hBans.A, 4, 'A', 'ban')}
          </div>
          <strong style={{ color:'#57eae7' }}>Picks</strong>
          <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center' }}>
            {renderSlots(hPicks.A, 5, 'A', 'pick')}
          </div>
        </div>
        <div style={{ flex:1 }} />
        <div style={{
          width:170, background:panelColors.B, padding:17, boxShadow:'-2px 0 18px #000d',
          borderRadius:'28px 0 0 28px',
          border: `3px solid ${highlightTeam==='B' ? highlightColor : 'transparent'}`
        }}>
          <h4 style={{ color:'#fff', textAlign:'center' }}>Team B – Game {idx+1}</h4>
          <strong style={{ color:'#f9b041' }}>Bans</strong>
          <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center' }}>
            {renderSlots(hBans.B, 4, 'B', 'ban')}
          </div>
          <strong style={{ color:'#57eae7' }}>Picks</strong>
          <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center' }}>
            {renderSlots(hPicks.B, 5, 'B', 'pick')}
          </div>
        </div>
        <button
          onClick={() => setViewingHistory(null)}
          style={{
            position:'absolute', top:20, left:20, padding:'8px 16px',
            background:'#fff600', color:'#23232a', border:'none', borderRadius:12, cursor:'pointer', fontWeight:700
          }}
        >← กลับ</button>
      </div>
    );
  }

  // ===== Select via pointer (used by drag-to-select through cards) =====
  function selectHeroViaPointer(hero) {
    if (selectingPre) return;

    if (currentStep?.type === 'ban') {
      const t = currentStep.team;
      const oppTeam = t === 'A' ? 'B' : 'A';

      const oppPickedThisGame = new Set((picks[oppTeam] || []).map(h => h.name));
      if (oppPickedThisGame.has(hero.name)) {
        setAlertMsg(`ห้ามแบน "${hero.name}" เพราะฝั่งตรงข้ามเลือกไปแล้วในเกมนี้`);
        return;
      }

      const oppPrevPicked = new Set(
        completedGames.flatMap(g => (g.picks?.[oppTeam] || [])).map(h => h.name)
      );
      if (oppPrevPicked.has(hero.name)) {
        setAlertMsg(`ห้ามแบน "${hero.name}" เพราะฝั่งตรงข้ามเคยเลือกไปแล้วในเกมก่อนหน้า`);
        return;
      }
    }

    const localUsedNames = [...bans.A, ...bans.B, ...picks.A, ...picks.B].map(h => h.name);
    const isFinalBO7 = boType==='BO7' && currentGame===totalGames;
    const blocked = currentStep?.type==='pick'
      && globalPicks[currentStep?.team || 'A']?.includes(hero.name)
      && !isFinalBO7;

    if (!localUsedNames.includes(hero.name) && !blocked && stepIndex < totalSteps) {
      handleHeroClick(hero);
    }
  }

  // ===== Slot Renderer =====
  function renderSlots(arr, max, team, type) {
    return Array.from({ length: max }).map((_, i) => {
      if (type === 'pick') {
        const hero = arr[i];
        const preHero = preChoose[team][i];

        if (hero) {
          return (
            <div
              key={i}
              style={{
                margin:6, textAlign:'center', width:76, height:100,
                display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
              }}
              onMouseEnter={e => showHeroTooltip(hero.name, e)}
              onMouseMove={e => setTooltipPos({ x:e.clientX, y:e.clientY })}
              onMouseLeave={hideTooltip}
            >
              <img src={getImage(hero.image)} alt={hero.name} title={hero.name}
                style={{ width:72, height:72, borderRadius:14, boxShadow:'0 2px 12px #000a' }} />
              <div style={{
                maxWidth:72, fontSize:13, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
                color:'#fff', fontWeight:700,
              }}>{hero.name}</div>
            </div>
          );
        } else if (preHero) {
          return (
            <div
              key={i}
              style={{
                margin:6, textAlign:'center', width:76, height:100,
                display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                background: '#23242e', border: '2.5px dashed #FFD700', borderRadius: 14, position: 'relative'
              }}
              title="Pre-choose"
              onMouseEnter={e => showHeroTooltip(preHero.name, e)}
              onMouseMove={e => setTooltipPos({ x:e.clientX, y:e.clientY })}
              onMouseLeave={hideTooltip}
              onDragOver={(e) => {
                if (dragHero) { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }
              }}
              onDrop={(e) => {
                const h = getHeroFromDrop(e);
                if (!h) return;
                handlePreChoose(team, i, h);
                setSelectingPre(null);
                resetHoverDrag();
              }}
            >
              <img src={getImage(preHero.image)} alt={preHero.name} title={preHero.name}
                style={{ width:72, height:72, borderRadius:14, boxShadow:'0 2px 12px #000a', opacity: 0.54, filter: 'grayscale(70%)' }} />
              <div style={{
                maxWidth:72, fontSize:13, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
                color:'#FFD700', fontWeight:900,
              }}>
                {preHero.name} <span style={{fontSize:11}}>[PRE]</span>
              </div>
              <button
                onClick={() => handleClearPreChoose(team, i)}
                style={{
                  position:'absolute', top:3, right:5, background:'transparent', border:'none',
                  color:'#FFD700', fontSize:16, cursor:'pointer'
                }}
                title="ลบ pre-choose"
              >×</button>
            </div>
          );
        } else {
          const isHighlight =
            team === highlightTeam &&
            type === highlightType &&
            i >= highlightStartIndex &&
            i < highlightStartIndex + highlightCount;

          return (
            <div
              key={i}
              style={{
                width:76, height:100, margin:6,
                border: `2.5px dashed ${
                  isHighlight ? highlightColor : '#444'
                }`,
                borderRadius:14, background:'#21222b',
                display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column',
                cursor: 'pointer', color:'#888', fontWeight: 800, fontSize: 13, letterSpacing:1, position: 'relative',
              }}
              onClick={() => setSelectingPre({ team, i })}
              title="Pre-choose slot"
              onDragOver={(e) => {
                if (dragHero) { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }
              }}
              onDrop={(e) => {
                const h = getHeroFromDrop(e);
                if (!h) return;
                handlePreChoose(team, i, h);
                setSelectingPre(null);
                resetHoverDrag();
              }}
            >
              <span style={{fontSize:18}}>＋</span>
              <span style={{fontSize:12, marginTop:2}}>Pre-choose</span>

              {/* ชั้น overlay สำหรับดรอปเพื่อ Pick/Ban ตามคิว (เฉพาะช่องที่ถึงตา) */}
              <div
                style={{ position:'absolute', inset:0 }}
                onDragOver={(e) => {
                  if (isHighlight && dragHero) {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'copy';
                  }
                }}
                onDrop={(e) => {
                  if (!isHighlight) return;
                  const h = getHeroFromDrop(e);
                  if (!h) return;
                  handleHeroClick(h);
                  resetHoverDrag();
                }}
              />
            </div>
          );
        }
      }

      if (i < arr.length) {
        const hero = arr[i];
        return (
          <div
            key={i}
            style={{
              margin:6, textAlign:'center', width:76, height:100,
              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
            }}
            onMouseEnter={e => showHeroTooltip(hero.name, e)}
            onMouseMove={e => setTooltipPos({ x:e.clientX, y:e.clientY })}
            onMouseLeave={hideTooltip}
          >
            <img src={getImage(hero.image)} alt={hero.name} title={hero.name}
              style={{ width:72, height:72, borderRadius:14, boxShadow:'0 2px 12px #000a' }} />
            <div style={{
              maxWidth:72, fontSize:13, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
              color:'#fff', fontWeight:700,
            }}>{hero.name}</div>
          </div>
        );
      } else {
        const isHighlight =
          team === highlightTeam &&
          type === highlightType &&
          i >= highlightStartIndex &&
          i < highlightStartIndex + highlightCount;

        return (
          <div
            key={i}
            style={{
              width:76, height:100, margin:6,
              border: `2.5px dashed ${isHighlight ? highlightColor : '#444'}`,
              borderRadius:14, background:'#21222b',
            }}
            onDragOver={(e) => {
              if (isHighlight && dragHero) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
              }
            }}
            onDrop={(e) => {
              if (!isHighlight) return;
              const h = getHeroFromDrop(e);
              if (!h) return;
              handleHeroClick(h);
              resetHoverDrag();
            }}
          />
        );
      }
    });
  }

  // ===== Legend =====
  function renderLegend() {
    return (
      <div style={{
        position: 'absolute',
        top: 16, left: 16,
        background: '#23263a',
        padding: '8px 12px',
        borderRadius: 8,
        display: 'flex', flexWrap: 'wrap', gap: '8px',
        zIndex: 10,
      }}>
        {ROLE_ORDER.map(role => (
          <div key={role} style={{ display:'inline-flex', alignItems:'center', color:'#fff', fontSize:12 }}>
            <span style={{ display:'inline-block', width:12, height:12, background: ROLE_BORDER_COLORS[role], marginRight:4, borderRadius:2 }} />
            {role}
          </div>
        ))}
      </div>
    );
  }

  // ===== Handlers =====
  function handleHeroClick(hero) {
    if (selectingPre) return;
    if (stepIndex >= totalSteps || !currentStep?.type || !currentStep?.team) return;
    const { team, type, count } = currentStep;
    const isFinalBO7 = boType==='BO7' && currentGame===totalGames;

    if (type === 'ban') {
      const oppTeam = team === 'A' ? 'B' : 'A';
      const oppPickedThisGame = new Set((picks[oppTeam] || []).map(h => h.name));
      if (oppPickedThisGame.has(hero.name)) {
        setAlertMsg(`ห้ามแบน "${hero.name}" เพราะฝั่งตรงข้ามเลือกไปแล้วในเกมนี้`);
        return;
      }
      const oppPrevPicked = new Set(
        completedGames.flatMap(g => (g.picks?.[oppTeam] || [])).map(h => h.name)
      );
      if (oppPrevPicked.has(hero.name)) {
        setAlertMsg(`ห้ามแบน "${hero.name}" เพราะฝั่งตรงข้ามเคยเลือกไปแล้วในเกมก่อนหน้า`);
        return;
      }
    }

    const localUsedNames = [...bans.A, ...bans.B, ...picks.A, ...picks.B].map(h => h.name);
    const blocked = type==='pick' && globalPicks[team].includes(hero.name) && !isFinalBO7;
    if (localUsedNames.includes(hero.name) || blocked) return;

    if (type === 'ban') {
      setBans(p => ({ ...p, [team]: [...p[team], hero] }));
    } else {
      setPicks(p => ({ ...p, [team]: [...p[team], hero] }));
      if (!isFinalBO7) setGlobalPicks(g => ({ ...g, [team]: [...g[team], hero.name] }));
      const pickIdx = picks[team].length;
      if (preChoose[team][pickIdx]) handleClearPreChoose(team, pickIdx);
    }

    setHistory(h => [...h, { stepIndex, team, hero, type }]);
    setAlertMsg('');
    const nextCount = selectionCount + 1;
    if (nextCount >= count) {
      setStepIndex(i => i + 1);
      setSelectionCount(0);
    } else {
      setSelectionCount(nextCount);
    }
  }

  function handleUndo() {
    if (!history.length) return;
    const last = history[history.length - 1];
    const { stepIndex: lastStep, team, hero, type } = last;

    if (type === 'ban') {
      setBans(p => ({ ...p, [team]: p[team].filter(h => h.name !== hero.name) }));
    } else {
      setPicks(p => ({ ...p, [team]: p[team].filter(h => h.name !== hero.name) }));
      if (globalPicks[team].includes(hero.name)) {
        setGlobalPicks(g => ({ ...g, [team]: g[team].filter(n => n !== hero.name) }));
      }
    }

    setHistory(h => {
      const newH = h.slice(0, -1);
      const countInThatStep = newH.filter(a => a.stepIndex === lastStep).length;
      setSelectionCount(countInThatStep % (draftSeq[lastStep]?.count || 1));
      setStepIndex(lastStep);
      return newH;
    });
    setAlertMsg('');
  }

  function nextGame() {
    if (currentGame < totalGames) {
      setCurrentGame(g => g + 1);
      setStepIndex(0);
      setSelectionCount(0);
      setBans({ A: [], B: [] });
      setPicks({ A: [], B: [] });
      setHistory([]);
      setAlertMsg('');
      setSelectedRole('ทั้งหมด');
      setSearchTerm('');
      setPreChoose({ A: [null, null, null, null, null], B: [null, null, null, null, null] });
      setSelectingPre(null);
    }
  }

  function startSeries(type) {
    setBoType(type);
    setCurrentGame(1);
    setGlobalPicks({ A: [], B: [] });
    setCompletedGames([]);
    setViewingHistory(null);
    setStepIndex(0);
    setSelectionCount(0);
    setBans({ A: [], B: [] });
    setPicks({ A: [], B: [] });
    setHistory([]);
    setAlertMsg('');
    setSelectedRole('ทั้งหมด');
    setSearchTerm('');
    setPreChoose({ A: [null, null, null, null, null], B: [null, null, null, null, null] });
    setSelectingPre(null);
  }

  // บันทึกเกมที่จบ step
  useEffect(() => {
    const finished = stepIndex >= totalSteps;
    if (!boType || !finished) return;
    setCompletedGames(prev => (
      prev.length >= currentGame
        ? prev
        : [...prev, { bans: { ...bans }, picks: { ...picks } }]
    ));
  }, [boType, stepIndex, totalSteps, currentGame, bans, picks]);

  // reset เมื่อสลับ firstPickTeam / teamARole
  useEffect(() => {
    setStepIndex(0);
    setSelectionCount(0);
    setBans({ A: [], B: [] });
    setPicks({ A: [], B: [] });
    setHistory([]);
    setAlertMsg('');
    setSelectedRole('ทั้งหมด');
    setSearchTerm('');
    setPreChoose({ A: [null, null, null, null, null], B: [null, null, null, null, null] });
    setSelectingPre(null);
  }, [firstPickTeam, teamARole]);

  // Hotkey: Esc ออกจากโหมด Pre-choose
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setSelectingPre(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // ===== Initial / BO Selection =====
  if (!comboStats || !excelData) {
    return (
      <div style={{
        padding:50, minHeight:'100vh', background:'#181a23',
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      }}>
        <h3 style={{ color:'#fff', marginBottom:25 }}>
          กลับไปอัปโหลดไฟล์ Excel <span style={{ color:'#fff600' }}>ComboStats</span>
        </h3>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding:'7px 24px', borderRadius:18, border:'none',
            background:'#292a37', color:'#fff', cursor:'pointer',
          }}
        >← Back</button>
      </div>
    );
  }

  if (!boType) {
    return (
      <div style={{
        minHeight:'100vh', background:'#191a23',
        display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center',
      }}>
        <h1 style={{ color:'#fff', marginBottom:32, letterSpacing:2, fontWeight:800 }}>
          เลือกรูปแบบ BO
        </h1>
        <div style={{ display:'flex', gap:32 }}>
          {Object.keys(BO_OPTIONS).map(t => (
            <button
              key={t}
              onClick={() => startSeries(t)}
              style={{
                padding:'22px 56px', fontSize:28, fontWeight:800, borderRadius:18,
                background:'#fff600', border:'none', color:'#2c2c2c', cursor:'pointer',
                boxShadow:'0 4px 24px #fff60088',
              }}
            >{t}</button>
          ))}
        </div>
      </div>
    );
  }

  // ===== Main Draft View =====
  return viewingHistory !== null
    ? renderHistoryView()
    : (
      <>
        <div style={{
          width: '100%', padding: '12px 24px', background: '#23263a',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px',
        }}>
          <div>
            <strong style={{ color:'#fff', marginRight:8 }}>Team A คือ</strong>
            <label style={{ marginRight:12, color:'#fff' }}>
              <input type="radio" value="red" checked={teamARole==='red'} onChange={() => setTeamARole('red')} /> Red
            </label>
            <label style={{ color:'#fff' }}>
              <input type="radio" value="blue" checked={teamARole==='blue'} onChange={() => setTeamARole('blue')} /> Blue
            </label>
          </div>
          <div>
            <strong style={{ color:'#fff', marginRight:8 }}>ฝั่งเลือกก่อน</strong>
            <label style={{ marginRight:12, color:'#fff' }}>
              <input type="radio" value="A" checked={firstPickTeam==='A'} onChange={() => setFirstPickTeam('A')} /> Team A
            </label>
            <label style={{ color:'#fff' }}>
              <input type="radio" value="B" checked={firstPickTeam==='B'} onChange={() => setFirstPickTeam('B')} /> Team B
            </label>
          </div>
        </div>

        <div style={{ display:'flex', height:'100vh', background:'#161720', position:'relative' }}>
          <div style={{
            width:170, background:panelColors.A, padding:17, boxShadow:'2px 0 18px #000d',
            borderRadius:'0 28px 28px 0',
            border: `3px solid ${highlightTeam==='A' ? highlightColor : 'transparent'}`
          }}>
            <h4 style={{ color:'#fff', textAlign:'center' }}>Team A</h4>
            <strong style={{ color:'#f9b041' }}>Bans</strong>
            <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center' }}>
              {renderSlots(bans.A, 4, 'A', 'ban')}
            </div>
            <strong style={{ color:'#57eae7' }}>Picks</strong>
            <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center' }}>
              {renderSlots(picks.A, 5, 'A', 'pick')}
            </div>
          </div>

          <div style={{ flex: 1, position: 'relative', overflowY: 'auto', padding: 40, background: '#23263a' }}>
            {renderLegend()}

            <div style={{ margin:'10px 0 25px', textAlign:'right' }}>
              <span style={{ color:'#fff', fontWeight:700 }}>ฝั่งตรงข้าม:</span>
              <select
                value={opponentSheet}
                onChange={e => setOpponentSheet(e.target.value)}
                style={{
                  margin:'0 15px', padding:'6px 16px', borderRadius:12, border:'none',
                  background:'#23242e', color:'#fff', fontWeight:700, fontSize:16,
                }}
              >
                {opponentSheetList.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
              <button onClick={() => navigate(-1)} style={{
                padding:'7px 24px', borderRadius:18, border:'none',
                background:'#292a37', color:'#fff', cursor:'pointer',
              }}>← Back</button>
              <strong style={{
                fontSize:21, color:'#fff600', fontWeight:800,
                textShadow:'0 2px 18px rgba(114, 209, 4, 0.56)',
              }}>
                {`Game ${currentGame}/${totalGames} • ${currentStep.type === 'ban' ? 'Ban' : 'Pick'} ${stepIndex+1}/${totalSteps}`}
              </strong>
              <button onClick={handleUndo} disabled={!history.length} style={{
                padding:'7px 22px', borderRadius:17, border:'none',
                background: history.length ? '#fff600' : '#333',
                color: history.length ? '#23232a' : '#666',
                cursor: history.length ? 'pointer' : 'not-allowed',
                fontWeight:800,
              }}>แก้ไข</button>
            </div>

            <div style={{ display:'flex', gap:10, flexWrap:'wrap', margin:'4px 0 26px' }}>
              {roleList.map(role => (
                <button key={role} onClick={() => setSelectedRole(role)} style={{
                  padding:'8px 23px', borderRadius:18, border:'none',
                  background: selectedRole===role?'#ea1c24':'#21212b',
                  color: selectedRole===role?'#fff':'#bdbdbd', fontWeight:800, cursor:'pointer',
                }}>{ROLE_ICON[role]} {role}</button>
              ))}
              <input
                type="text"
                placeholder="🔍 ค้นหา hero..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  marginLeft:12, padding:'0 16px', height:38,
                  borderRadius:17, border:'none', background:'#171826', color:'#fff',
                  fontWeight:600, letterSpacing:1,
                }}
              />
            </div>

            {alertMsg && (
              <div style={{
                background:'#ea1c24', color:'#fff600', padding:14, borderRadius:10,
                textAlign:'center', fontWeight:'bold', marginBottom:17,
              }}>
                {alertMsg}
                <button onClick={() => setAlertMsg('')} style={{
                  marginLeft:16, background:'transparent', border:'none',
                  color:'#fff600', cursor:'pointer',
                }}>×</button>
              </div>
            )}

            {completedGames.length > 0 && (
              <div style={{ marginBottom:15 }}>
                <strong style={{ color:'#ffd600' }}>History:</strong>
                {completedGames.map((_, i) => (
                  <button key={i} onClick={() => setViewingHistory(i)} style={{
                    margin:'0 7px', padding:'7px 16px', borderRadius:14, border:'none',
                    background:'#ea1c24', color:'#fff', fontWeight:800, cursor:'pointer',
                  }}>Game {i+1}</button>
                ))}
              </div>
            )}

            {/* ===== HERO GRID ===== */}
            <div>
              {stepIndex < totalSteps && currentStep.type === 'ban' && (
                suggestBan.length > 0 && (
                  <div style={{
                    background: '#ea1c24', color: '#fff', padding: 10, marginBottom: 14,
                    borderRadius: 8, fontWeight: 700,
                  }}>
                    <span>⚠️ แนะนำให้ Ban: </span>
                    {suggestBan.map(n => <span key={n} style={{ margin: '0 8px', color: '#fff600' }}>{n}</span>)}
                  </div>
                )
              )}

              {ROLE_ORDER.map(role => {
                const heroesOfRole = sortedHeroList.filter(h => normalizeRole(h.role) === role);
                if (!heroesOfRole.length) return null;
                return (
                  <div key={role} style={{ marginBottom: 24 }}>
                    <div style={{ marginBottom: 8, fontSize: 16, fontWeight: 700, color: '#fff' }}>
                      {ROLE_ICON[role]} {role}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 17, justifyContent: 'flex-start' }}>
                      {heroesOfRole.map(hero => {
                        const local    = localUsed.includes(hero.name);
                        const isFinalBO7 = boType==='BO7' && currentGame===totalGames;
                        const blocked  = highlightType==='pick'
                          && globalPicks[highlightTeam]?.includes(hero.name)
                          && !isFinalBO7;
                        const disabled = local || blocked || stepIndex >= totalSteps;

                        let highlightHero = false;
                        if (highlightType==='ban' && completedGames.length > 0) {
                          const oppSet = new Set(
                            completedGames
                              .flatMap(g => g.picks[highlightTeam==='A'?'B':'A'])
                              .map(h => h.name)
                          );
                          highlightHero = oppSet.has(hero.name);
                        }

                        const borderColor = highlightHero
                          ? highlightColor
                          : (ROLE_BORDER_COLORS[normalizeRole(hero.role)] || 'transparent');

                        const isPreSelecting = !!selectingPre && !disabled;

                        const isSuggestBan = suggestBan.includes(hero.name);
                        const suggestStyle = isSuggestBan && selectingPre ? {
                          border: '3.5px solid #fff600',
                          background: 'radial-gradient(circle, #fff8b3 0%, #7a6422 60%, #23242e 100%)',
                          boxShadow: '0 0 14px 2px #fff700, 0 2px 7px #ea1c2425',
                          filter: 'brightness(1.14)',
                          zIndex: 2
                        } : {};

                        const pickedBy = pickOwner.get(hero.name);
                        const bannedBy = banOwner.get(hero.name);

                        const isCurrentEligible = !disabled && highlightType && highlightTeam;
                        const currentGlow = isCurrentEligible
                          ? `,0 0 0 2px ${TEAM_COLOR[highlightTeam]} inset, 0 0 16px ${ACTION_COLOR[highlightType]}`
                          : '';

                        return (
                          <motion.div
                            key={hero.name}
                            ref={el => heroRefs.current[hero.name] = el}
                            data-heroname={hero.name}
                            draggable={!disabled}
                            onDragStart={(e) => {
                              if (disabled) return;
                              setDragHero(hero);
                              // ปิดโหมดรูดเลือกทันที กัน onMouseEnter เลือกเอง
                              resetHoverDrag();
                              suppressClickRef.current = true;
                              try {
                                e.dataTransfer.setData('text/plain', hero.name);
                                e.dataTransfer.effectAllowed = 'copy';
                              } catch (_) {}
                            }}
                            onDragEnd={() => { setDragHero(null); resetHoverDrag(); }}
                            whileHover={!disabled ? { scale:1.12, boxShadow:'0 8px 24px #fff60080' } : {}}
                            // === Mouse: threshold-based drag ===
                            onMouseDown={(e) => {
                              if (disabled || isPreSelecting) return;
                              dragVisitedRef.current.clear();
                              pointerDownRef.current = { down:true, x:e.clientX, y:e.clientY, startedOn:hero.name };
                            }}
                            onMouseEnter={e => {
                              // ถ้าอยู่ระหว่าง HTML5 DnD (dragHero มีค่า) ให้ไม่ยิง select ผ่าน hover
                              if (isDragging && !dragHero && !disabled && !isPreSelecting) {
                                if (!dragVisitedRef.current.has(hero.name)) {
                                  dragVisitedRef.current.add(hero.name);
                                  selectHeroViaPointer(hero);
                                }
                              }
                              showHeroTooltip(hero.name, e);
                              setTooltipPos({ x:e.clientX, y:e.clientY });
                            }}
                            onMouseMove={e => setTooltipPos({ x:e.clientX, y:e.clientY })}
                            onMouseUp={(e) => {
                              const started = pointerDownRef.current.startedOn;
                              const wasDragging = isDragging;
                              pointerDownRef.current.down = false;
                              if (!wasDragging && started === hero.name && !disabled && !isPreSelecting) {
                                // ให้ onClick ทำงาน
                              }
                            }}
                            onMouseLeave={hideTooltip}
                            onClick={(e) => {
                              if (disabled) return;
                              if (suppressClickRef.current) return; // เพิ่งลากมา
                              if (isPreSelecting && selectingPre) {
                                handlePreChoose(selectingPre.team, selectingPre.i, hero);
                                setSelectingPre(null);
                                e.stopPropagation?.();
                                return;
                              }
                              handleHeroClick(hero);
                            }}
                            // === Touch: threshold-based drag ===
                            onTouchStart={(e) => {
                              if (disabled || isPreSelecting) return;
                              if (e.cancelable) e.preventDefault();
                              dragVisitedRef.current.clear();
                              const t = e.touches?.[0];
                              if (!t) return;
                              pointerDownRef.current = { down:true, x:t.clientX, y:t.clientY, startedOn:hero.name };
                            }}
                            onTouchMove={(e) => {
                              if (!isDragging || disabled || isPreSelecting) return;
                              if (e.cancelable) e.preventDefault();
                              const t = e.touches?.[0];
                              if (!t) return;
                              const el = document.elementFromPoint(t.clientX, t.clientY);
                              const card = el && el.closest ? el.closest('[data-heroname]') : null;
                              const name = card?.dataset?.heroname;
                              if (name && !dragVisitedRef.current.has(name)) {
                                const h = heroMap.get(name);
                                if (h) {
                                  dragVisitedRef.current.add(name);
                                  selectHeroViaPointer(h);
                                }
                              }
                            }}
                            onTouchEnd={() => {
                              const wasDragging = isDragging;
                              setIsDragging(false);
                              dragVisitedRef.current.clear();
                              const started = pointerDownRef.current.startedOn;
                              pointerDownRef.current = { down:false, x:0, y:0, startedOn:null };
                              if (!wasDragging && !disabled) {
                                if (isPreSelecting && selectingPre) {
                                  handlePreChoose(selectingPre.team, selectingPre.i, hero);
                                  setSelectingPre(null);
                                  return;
                                }
                                handleHeroClick(hero);
                              }
                            }}
                            style={{
                              width:84, height:108,
                              cursor: disabled && !isPreSelecting ? 'not-allowed' : 'pointer',
                              opacity: disabled && !isPreSelecting ? 0.23 : 1,
                              position:'relative', overflow:'hidden', borderRadius:16,
                              background:'#23242e',
                              boxShadow:`0 4px 30px #000a,0 2px 7px #ea1c2425${currentGlow}`,
                              border: isPreSelecting ? '3px solid #FFD700' : `3px solid ${borderColor}`,
                              transition:'box-shadow 0.2s,transform 0.15s,border 0.14s',
                              filter: isPreSelecting ? 'brightness(1.2)' : undefined,
                              ...suggestStyle,
                            }}
                          >
                            <img
                              src={getImage(hero.image)}
                              alt={hero.name}
                              title={`${hero.name} (${normalizeRole(hero.role)})`}
                              draggable={false}
                              style={{ width:'100%', height:84, objectFit:'cover', borderRadius:'16px 16px 0 0' }}
                            />
                            <div style={{
                              width:'100%', height:24, background:'#191921', fontSize:12,
                              borderRadius:'0 0 16px 16px', textAlign:'center',
                              overflow:'hidden', whiteSpace:'nowrap', textOverflow:'ellipsis',
                              fontWeight:800, color:'#fff', borderTop:'1px solid #262535',
                              display:'flex', alignItems:'center', justifyContent:'center',
                            }}>{hero.name}</div>

                            {bannedBy && (
                              <div style={{
                                position:'absolute', top:4, left:4, padding:'2px 6px',
                                fontSize:10, fontWeight:900, color:'#fff',
                                background: ACTION_COLOR.ban,
                                borderRadius:6, boxShadow:'0 2px 8px #0007'
                              }}>
                                {TEAM_TAG[bannedBy]} BAN
                              </div>
                            )}
                            {pickedBy && (
                              <div style={{
                                position:'absolute', top:4, right:4, padding:'2px 6px',
                                fontSize:10, fontWeight:900, color:'#0f1220',
                                background: ACTION_COLOR.pick,
                                borderRadius:6, boxShadow:'0 2px 8px #0007'
                              }}>
                                {TEAM_TAG[pickedBy]} PICK
                              </div>
                            )}

                            {isPreSelecting && (
                              <span style={{
                                position: 'absolute', bottom: 9, left: 0, right: 0,
                                color: '#FFD700', fontWeight: 800, fontSize: 12, textAlign: 'center',
                              }}>เลือก Pre-choose</span>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {stepIndex >= totalSteps && currentGame < totalGames && (
              <div style={{ textAlign:'center', marginTop:34 }}>
                <button onClick={nextGame} style={{
                  padding:'10px 30px', borderRadius:17, border:'none',
                  background:'#57eae7', color:'#23232a', fontWeight:800, cursor:'pointer', fontSize:17,
                }}>Next Game &gt;</button>
              </div>
            )}
          </div>

          <div style={{
            width:170, background:panelColors.B, padding:17, boxShadow:'-2px 0 18px #000d',
            borderRadius:'28px 0 0 28px',
            border: `3px solid ${highlightTeam==='B' ? highlightColor : 'transparent'}`
          }}>
            <h4 style={{ color:'#fff', textAlign:'center' }}>Team B</h4>
            <strong style={{ color:'#f9b041' }}>Bans</strong>
            <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center' }}>
              {renderSlots(bans.B, 4, 'B', 'ban')}
            </div>
            <strong style={{ color:'#57eae7' }}>Picks</strong>
            <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center' }}>
              {renderSlots(picks.B, 5, 'B', 'pick')}
            </div>
          </div>

          {renderTooltip()}
        </div>
      </>
    );
}
