import React, { useEffect, useState } from 'react';
import LocalBus from '../realtime/localBus';

// Read-only overlay view for OBS/browser source. Shows timer and simple series score.
export default function Overlay() {
  const [timeText, setTimeText] = useState('00:00');
  const [series, setSeries] = useState({ left: 0, right: 0 });
  const [title, setTitle] = useState('RoV Match');

  useEffect(() => {
    const offTick = LocalBus.on('timer:tick', (ms) => {
      const m = Math.floor(ms / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      setTimeText(`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
    });
    const offTitle = LocalBus.on('overlay:title', (t) => setTitle(String(t||'RoV Match')));
    const offScore = LocalBus.on('series:update', (payload) => setSeries(payload));
    return () => { offTick(); offTitle(); offScore(); }
  }, []);

  return (
    <div style={styles.wrap}>
      <div style={styles.bar}>
        <div style={styles.side}>
          <span style={styles.team}>Team A</span>
          <span style={styles.score}>{series.left}</span>
        </div>
        <div style={styles.center}>⏱ {timeText}</div>
        <div style={{...styles.side, justifyContent:'flex-end'}}>
          <span style={styles.score}>{series.right}</span>
          <span style={styles.team}>Team B</span>
        </div>
      </div>
      <div style={styles.title}>{title}</div>
    </div>
  );
}

const styles = {
  wrap: { fontFamily: 'Kanit, Prompt, sans-serif', color: '#fff' },
  bar: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 16px', background:'rgba(0,0,0,0.6)' },
  side: { display:'flex', alignItems:'center', gap:8 },
  center: { fontSize: 28, fontWeight: 800 },
  team: { fontSize:18, fontWeight:700 },
  score: { fontSize:26, fontWeight:800 },
  title: { marginTop: 8, textAlign:'center', fontWeight:700 }
};
