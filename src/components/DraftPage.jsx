// src/components/DraftPage.jsx

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import heroList from '../data/heroList.json';
import { parseComboStatsSheet } from '../utils/excelParser';

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
const highlightColor = '#ea1c24';

const ROLE_ICON = {
  ทั้งหมด: '🌐',
  Fighter: '⚔️',
  Mage: '🪄',
  Assasin: '🗡️',
  Support: '💖',
  Tank: '🛡️',
  Carry: '🏹',
};

const getImage = filename =>
  `${process.env.PUBLIC_URL}/heroimages/${filename}`;

function normalizePosition(pos) {
  if (!pos) return '';
  const s = pos.toString().toLowerCase().replace(/\s+/g, '');
  if (['fsdsl','dsl','ds','fsds'].includes(s))    return 'DSL';
  if (['mid','fsmid'].includes(s))                return 'MID';
  if (['adl','fsadl'].includes(s))                return 'ADL';
  if (['jungle','fsjungle','jg'].includes(s))     return 'JUG';
  if (['roaming','fsroaming','roam'].includes(s))  return 'SUP';
  return pos.toString().toUpperCase();
}

function getHeroStatsFromGames(heroName, games) {
  if (!heroName) return [];
  const key = heroName.trim().toLowerCase();
  const statsMap = {};
  const totalGames = games.length;

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

  // ============ Side & First-Pick Settings ===========
  const [teamARole, setTeamARole]         = useState('red'); // 'red' or 'blue'
  const [firstPickTeam, setFirstPickTeam] = useState('A');   // 'A' or 'B'

  // ============ Opponent Stats ===========
  const [opponentStats, setOpponentStats]         = useState(null);
  const [opponentSheetList, setOpponentSheetList] = useState([]);
  const [opponentSheet, setOpponentSheet]         = useState('TLN');

  // ============ Series State ===========
  const [boType, setBoType]               = useState(null);
  const [currentGame, setCurrentGame]     = useState(1);
  const [globalPicks, setGlobalPicks]     = useState({ A: [], B: [] });
  const [completedGames, setCompletedGames] = useState([]);
  const [viewingHistory, setViewingHistory] = useState(null);

  // ============ Draft State ===========
  const [stepIndex, setStepIndex]           = useState(0);
  const [selectionCount, setSelectionCount] = useState(0);
  const [bans, setBans]                     = useState({ A: [], B: [] });
  const [picks, setPicks]                   = useState({ A: [], B: [] });
  const [history, setHistory]               = useState([]);

  const [alertMsg, setAlertMsg]         = useState('');
  const [selectedRole, setSelectedRole] = useState('ทั้งหมด');
  const [searchTerm, setSearchTerm]     = useState('');

  const totalGames = boType ? BO_OPTIONS[boType] : 0;

  // ============ Draft Sequence (dynamic by firstPickTeam) ============
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

  // ============ Panel Colors by Side ============
  const panelColors = {
    A: teamARole === 'red' ? '#8b0000' : '#00008b',
    B: teamARole === 'red' ? '#00008b' : '#8b0000',
  };

  // ============ Highlight Logic ============
  const currentStep = draftSeq[stepIndex] || {};
  const { team: highlightTeam, type: highlightType, count: highlightCount } = currentStep;

  const highlightStartIndex = useMemo(() => {
    return draftSeq
      .slice(0, stepIndex)
      .filter(s => s.team === highlightTeam && s.type === highlightType)
      .reduce((sum, s) => sum + s.count, 0);
  }, [draftSeq, stepIndex, highlightTeam, highlightType]);

  // ============ Used & Filtered Heroes ============
  const localUsed = useMemo(
    () => [...bans.A, ...bans.B, ...picks.A, ...picks.B].map(h => h.name),
    [bans, picks]
  );

  const roleList = useMemo(
    () => ['ทั้งหมด', ...new Set(heroes.map(h => h.role))],
    [heroes]
  );

  const filteredHeroList = useMemo(() => {
    let list = selectedRole === 'ทั้งหมด'
      ? heroes
      : heroes.filter(h => h.role === selectedRole);
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      list = list.filter(h => h.name.toLowerCase().includes(term));
    }
    return list;
  }, [heroes, selectedRole, searchTerm]);

  // ============ Load Opponent Stats ============
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

  // ============ Tooltip ============
  const [tooltip, setTooltip]       = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  function showHeroTooltip(heroName, e) {
    if (!heroName) return;
    const ourList = getHeroStatsFromGames(heroName, games || []);
    const oppList = (opponentStats?.oneHero || [])
      .filter(h => h.hero.trim().toLowerCase() === heroName.trim().toLowerCase())
      .map(h => ({
        position:  h.position,
        total:     h.total,
        win:       h.win,
        pickRate:  ((h.total / ((opponentStats.oneHero || []).reduce((s,x)=>s+(x.total||0),0))) * 100).toFixed(1),
        winRate:   String(h.winrate),
      }));
    setTooltipPos({ x: e.clientX, y: e.clientY });
    setTooltip({ heroName, ourList, oppList });
  }
  function hideTooltip() {
    setTooltip(null);
  }
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
        <div style={{
          fontWeight:900,
          fontSize:16,
          marginBottom:6,
          color:'#fff600'
        }}>{tooltip.heroName}</div>
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

  // ============ Render History ============
  function renderHistoryView() {
    const idx = viewingHistory;
    if (idx === null || idx >= completedGames.length) return null;
    const { bans: hBans, picks: hPicks } = completedGames[idx];
    return (
      <div style={{
        display:'flex',
        height:'100vh',
        background:'#161720',
        position:'relative'
      }}>
        {/* Team A */}
        <div style={{
          width:170,
          background:panelColors.A,
          padding:17,
          boxShadow:'2px 0 18px #000d',
          borderRadius:'0 28px 28px 0',
          border: highlightTeam==='A'
            ? `3px solid ${highlightColor}`
            : '3px solid transparent',
        }}>
          <h4 style={{ color:'#fff', textAlign:'center' }}>
            Team A – Game {idx+1}
          </h4>
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
        {/* Team B */}
        <div style={{
          width:170,
          background:panelColors.B,
          padding:17,
          boxShadow:'-2px 0 18px #000d',
          borderRadius:'28px 0 0 28px',
          border: highlightTeam==='B'
            ? `3px solid ${highlightColor}`
            : '3px solid transparent',
        }}>
          <h4 style={{ color:'#fff', textAlign:'center' }}>
            Team B – Game {idx+1}
          </h4>
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
            position:'absolute',
            top:20,
            left:20,
            padding:'8px 16px',
            background:'#fff600',
            color:'#23232a',
            border:'none',
            borderRadius:12,
            cursor:'pointer',
            fontWeight:700,
          }}
        >← กลับ</button>
      </div>
    );
  }

  // ============ Slot Renderer ============
  function renderSlots(arr, max, team, type) {
    return Array.from({ length: max }).map((_, i) => {
      if (i < arr.length) {
        const hero = arr[i];
        return (
          <div
            key={i}
            style={{
              margin:6,
              textAlign:'center',
              width:76,
              height:100,
              display:'flex',
              flexDirection:'column',
              alignItems:'center',
              justifyContent:'center',
            }}
            onMouseEnter={e => showHeroTooltip(hero.name, e)}
            onMouseMove={e => setTooltipPos({ x:e.clientX, y:e.clientY })}
            onMouseLeave={hideTooltip}
          >
            <img
              src={getImage(hero.image)}
              alt={hero.name}
              title={hero.name}
              style={{
                width:72,
                height:72,
                borderRadius:14,
                boxShadow:'0 2px 12px #000a'
              }}
            />
            <div style={{
              maxWidth:72,
              fontSize:13,
              whiteSpace:'nowrap',
              overflow:'hidden',
              textOverflow:'ellipsis',
              color:'#fff',
              fontWeight:700,
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
              width:76,
              height:100,
              margin:6,
              border: `2.5px dashed ${isHighlight ? highlightColor : '#444'}`,
              borderRadius:14,
              background:'#21222b',
            }}
          />
        );
      }
    });
  }

  // ============ Hero Grid ============
  function renderHeroGrid() {
    return (
      <div style={{
        display:'grid',
        gridTemplateColumns:'repeat(auto-fit,minmax(84px,1fr))',
        gap:17,
        justifyItems:'center',
      }}>
        {filteredHeroList.map(hero => {
          const local    = localUsed.includes(hero.name);
          const blocked  = highlightType==='pick'
            && globalPicks[highlightTeam]?.includes(hero.name)
            && !(boType==='BO7' && currentGame===totalGames);
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

          return (
            <motion.div
              key={hero.name}
              whileHover={!disabled ? {
                scale:1.12,
                boxShadow:'0 8px 24px #fff60080'
              } : {}}
              onClick={() => !disabled && handleHeroClick(hero)}
              onMouseEnter={e => showHeroTooltip(hero.name, e)}
              onMouseMove={e => setTooltipPos({ x:e.clientX, y:e.clientY })}
              onMouseLeave={hideTooltip}
              style={{
                width:84,
                height:108,
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.23 : 1,
                position:'relative',
                overflow:'hidden',
                borderRadius:16,
                background:'#23242e',
                boxShadow:'0 4px 30px #000a,0 2px 7px #ea1c2425',
                border: highlightHero ? '3px solid #fff600' : '3px solid transparent',
                transition:'box-shadow 0.2s,transform 0.15s,border 0.14s',
              }}
            >
              <img
                src={getImage(hero.image)}
                alt={hero.name}
                title={`${hero.name} (${hero.role})`}
                style={{
                  width:'100%',
                  height:84,
                  objectFit:'cover',
                  borderRadius:'16px 16px 0 0',
                }}
              />
              {highlightHero && (
                <div style={{
                  position:'absolute',
                  left:0, top:0, right:0, bottom:0,
                  background:'rgba(255,255,0,0.22)',
                  zIndex:1,
                  borderRadius:16,
                }}/>
              )}
              <div style={{
                width:'100%',
                height:24,
                background:'#191921',
                fontSize:12,
                borderRadius:'0 0 16px 16px',
                textAlign:'center',
                overflow:'hidden',
                whiteSpace:'nowrap',
                textOverflow:'ellipsis',
                fontWeight:800,
                color:'#fff',
                borderTop:'1px solid #262535',
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
              }}>{hero.name}</div>
            </motion.div>
          );
        })}
      </div>
    );
  }

  // ============ Opponent Dropdown ============
  function renderOpponentDropDown() {
    return (
      <select
        value={opponentSheet}
        onChange={e => setOpponentSheet(e.target.value)}
        style={{
          margin:'0 15px',
          padding:'6px 16px',
          borderRadius:12,
          border:'none',
          background:'#23242e',
          color:'#fff',
          fontWeight:700,
          fontSize:16,
        }}
      >
        {opponentSheetList.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    );
  }

  // ============ Handlers ============
  function handleHeroClick(hero) {
    if (stepIndex >= totalSteps) return;
    const { team, type, count } = currentStep;
    const isFinalBO7 = boType==='BO7' && currentGame===totalGames;

    if (type === 'ban' && completedGames.length > 0) {
      const oppPicked = new Set(
        completedGames
          .flatMap(g => g.picks[team==='A'?'B':'A'])
          .map(h => h.name)
      );
      if (oppPicked.has(hero.name)) {
        setAlertMsg(`ห้ามแบน "${hero.name}" เพราะฝั่งตรงข้ามเลือกไปแล้ว`);
        return;
      }
    }

    const blocked = type==='pick'
      && globalPicks[team].includes(hero.name)
      && !isFinalBO7;
    if (localUsed.includes(hero.name) || blocked) return;

    if (type === 'ban') {
      setBans(p => ({ ...p, [team]: [...p[team], hero] }));
    } else {
      setPicks(p => ({ ...p, [team]: [...p[team], hero] }));
      if (!isFinalBO7) {
        setGlobalPicks(g => ({ ...g, [team]: [...g[team], hero.name] }));
      }
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

    setHistory(h => h.slice(0, -1));
    setStepIndex(lastStep);
    setSelectionCount(
      history.filter(a => a.stepIndex === lastStep).length - 1
    );
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
  }

  // ============ Record Completed Game ============
  useEffect(() => {
    if (boType && stepIndex >= totalSteps && completedGames.length < currentGame) {
      setCompletedGames(prev => [
        ...prev,
        { bans: { ...bans }, picks: { ...picks } }
      ]);
    }
  }, [stepIndex]);

  // ============ Final Render ============
  if (!comboStats || !excelData) {
    return (
      <div style={{
        padding:50,
        minHeight:'100vh',
        background:'#181a23',
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
      }}>
        <h3 style={{ color:'#fff', marginBottom:25 }}>
          กลับไปอัปโหลดไฟล์ Excel <span style={{ color:'#fff600' }}>ComboStats</span>
        </h3>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding:'7px 24px',
            borderRadius:18,
            border:'none',
            background:'#292a37',
            color:'#fff',
            cursor:'pointer',
          }}
        >← Back</button>
      </div>
    );
  }

  if (!boType) {
    return (
      <div style={{
        minHeight:'100vh',
        background:'#191a23',
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
      }}>
        <h1 style={{
          color:'#fff',
          marginBottom:32,
          letterSpacing:2,
          fontWeight:800,
        }}>เลือกรูปแบบ BO</h1>

        <div style={{ display:'flex', gap:32 }}>
          {Object.keys(BO_OPTIONS).map(t => (
            <button
              key={t}
              onClick={() => startSeries(t)}
              style={{
                padding:'22px 56px',
                fontSize:28,
                fontWeight:800,
                borderRadius:18,
                background:'#fff600',
                border:'none',
                color:'#2c2c2c',
                cursor:'pointer',
                boxShadow:'0 4px 24px #fff60088',
              }}
            >{t}</button>
          ))}
        </div>
      </div>
    );
  }

  return viewingHistory !== null
    ? renderHistoryView()
    : (
      <div style={{
        display:'flex',
        height:'100vh',
        background:'#161720',
        position:'relative'
      }}>
        {/* Team A */}
        <div style={{
          width:170,
          background:panelColors.A,
          padding:17,
          boxShadow:'2px 0 18px #000d',
          borderRadius:'0 28px 28px 0',
          border: highlightTeam==='A'
            ? `3px solid ${highlightColor}`
            : '3px solid transparent',
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

        {/* Hero Pool */}
        <div style={{
          flex:1,
          overflowY:'auto',
          padding:40,
          background:'#23263a'
        }}>
          <div style={{
            margin:'10px 0 25px',
            textAlign:'right'
          }}>
            <span style={{ color:'#fff', fontWeight:700 }}>ฝั่งตรงข้าม:</span>
            {renderOpponentDropDown()}
          </div>

          {/* ==== ย้าย Team A / First Pick Controls มาไว้ที่นี่ ==== */}
          <div style={{ display:'flex', justifyContent:'center', gap:32, marginBottom:18 }}>
            <div style={{ display:'flex', alignItems:'center' }}>
              <strong style={{ color:'#fff', marginRight:12 }}>Team A คือ</strong>
              <label style={{ marginRight:16, color:'#fff' }}>
                <input
                  type="radio"
                  value="red"
                  checked={teamARole==='red'}
                  onChange={() => setTeamARole('red')}
                /> Red Side
              </label>
              <label style={{ color:'#fff' }}>
                <input
                  type="radio"
                  value="blue"
                  checked={teamARole==='blue'}
                  onChange={() => setTeamARole('blue')}
                /> Blue Side
              </label>
            </div>
            <div style={{ display:'flex', alignItems:'center' }}>
              <strong style={{ color:'#fff', marginRight:12 }}>ฝั่งเลือกก่อน</strong>
              <label style={{ marginRight:16, color:'#fff' }}>
                <input
                  type="radio"
                  value="A"
                  checked={firstPickTeam==='A'}
                  onChange={() => setFirstPickTeam('A')}
                /> Team A
              </label>
              <label style={{ color:'#fff' }}>
                <input
                  type="radio"
                  value="B"
                  checked={firstPickTeam==='B'}
                  onChange={() => setFirstPickTeam('B')}
                /> Team B
              </label>
            </div>
          </div>

          <div style={{
            display:'flex',
            alignItems:'center',
            justifyContent:'space-between',
            marginBottom:18
          }}>
            <button onClick={() => navigate(-1)} style={{
              padding:'7px 24px',
              borderRadius:18,
              border:'none',
              background:'#292a37',
              color:'#fff',
              cursor:'pointer',
            }}>← Back</button>
            <strong style={{
              fontSize:21,
              color:'#fff600',
              fontWeight:800,
              textShadow:'0 2px 18px #ea1c2490',
            }}>
              {`Game ${currentGame}/${totalGames} • ${currentStep.type === 'ban' ? 'Ban' : 'Pick'} ${stepIndex+1}/${totalSteps}`}
            </strong>
            <button onClick={handleUndo} disabled={!history.length} style={{
              padding:'7px 22px',
              borderRadius:17,
              border:'none',
              background: history.length ? '#fff600' : '#333',
              color: history.length ? '#23232a' : '#666',
              cursor: history.length ? 'pointer' : 'not-allowed',
              fontWeight:800,
            }}>แก้ไข</button>
          </div>

          {alertMsg && (
            <div style={{
              background:'#ea1c24',
              color:'#fff600',
              padding:14,
              borderRadius:10,
              textAlign:'center',
              fontWeight:'bold',
              marginBottom:17,
            }}>
              {alertMsg}
              <button onClick={() => setAlertMsg('')} style={{
                marginLeft:16,
                background:'transparent',
                border:'none',
                color:'#fff600',
                cursor:'pointer',
              }}>×</button>
            </div>
          )}

          {completedGames.length > 0 && (
            <div style={{ marginBottom:15 }}>
              <strong style={{ color:'#ffd600' }}>History:</strong>
              {completedGames.map((_, i) => (
                <button key={i} onClick={() => setViewingHistory(i)} style={{
                  margin:'0 7px',
                  padding:'7px 16px',
                  borderRadius:14,
                  border:'none',
                  background:'#ea1c24',
                  color:'#fff',
                  fontWeight:800,
                  cursor:'pointer',
                }}>Game {i+1}</button>
              ))}
            </div>
          )}

          {renderHeroGrid()}

          {stepIndex >= totalSteps && currentGame < totalGames && (
            <div style={{ textAlign:'center', marginTop:34 }}>
              <button onClick={nextGame} style={{
                padding:'10px 30px',
                borderRadius:17,
                border:'none',
                background:'#57eae7',
                color:'#23232a',
                fontWeight:800,
                cursor:'pointer',
                fontSize:17,
              }}>Next Game &gt;</button>
            </div>
          )}
        </div>

        {/* Team B */}
        <div style={{
          width:170,
          background:panelColors.B,
          padding:17,
          boxShadow:'-2px 0 18px #000d',
          borderRadius:'28px 0 0 28px',
          border: highlightTeam==='B'
            ? `3px solid ${highlightColor}`
            : '3px solid transparent',
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
    );
}
