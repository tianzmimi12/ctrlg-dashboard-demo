import React from 'react';
// === ADD ONLY: END ===

// แถบบอกสถานะเวลา (รวม) ใช้คู่กับ TimerManager
// โชว์เวลาต่อการกระทำ และเวลาสำรองของแต่ละทีม + สถานะ Paused/Running
export default function TimerHUD({ t }) {
  if (!t) return null;

  const chip = (label, seconds, emphasize=false) => (
    <div
      className="th-chip"
      style={{
        border: '1px solid rgba(255,255,255,.18)',
        borderRadius: 12,
        padding: '6px 10px',
        background: emphasize ? 'rgba(200,255,0,.18)' : 'rgba(255,255,255,.08)',
        color: '#eef5ff',
        fontWeight: 900,
        fontSize: 12,
        minWidth: 66,
        textAlign: 'center'
      }}
      aria-label={label}
    >
      {label}: {String(Math.floor(seconds/60)).padStart(2,'0')}:{String(seconds%60).padStart(2,'0')}
    </div>
  );

  return (
    <>
    </>
  );
}
