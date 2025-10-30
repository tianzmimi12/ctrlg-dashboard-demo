// src/components/MatchRoom.jsx
import React from 'react';
import DraftPage from './DraftPage';
import TimerHUD from './TimerHUD';
import { LocalBus } from '../realtime/localBus';
import { RoomEvent } from '../realtime/protocol'; // <-- เอา Role ออก
import { createTimerManager } from '../match/timer';

/* ---------- tiny emitter (ส่งต่อ action ไป DraftPage แบบ in-memory) ---------- */
function createEmitter() {
  const subs = new Set();
  return {
    emit: (v) => subs.forEach((f) => f(v)),
    on: (f) => { subs.add(f); return () => subs.delete(f); },
  };
}

/* ------------------------- Host Setup ------------------------- */
function HostSetup({ roomCode, onInit }) {
  const [bo, setBo] = React.useState('BO3');

  // deep links
  const baseUrl = React.useMemo(() => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}${window.location.pathname}`;
  }, []);
  const buildLink = React.useCallback((role, team) => {
    const q = new URLSearchParams();
    q.set('room', roomCode);
    q.set('role', role);
    if (team) q.set('team', team);
    return `${baseUrl}?${q.toString()}`;
  }, [baseUrl, roomCode]);

  const links = React.useMemo(() => ({
    referee: buildLink('referee'),
    a: buildLink('player', 'A'),
    b: buildLink('player', 'B'),
    spec: buildLink('spectator'),
  }), [buildLink]);

  const copy = async (text) => {
    try { await navigator.clipboard.writeText(text); navigator.vibrate?.(8); }
    catch {
      const ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta);
      ta.select(); document.execCommand('copy'); ta.remove();
    }
  };
  const share = async (url, title) => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try { await navigator.share({ title, url }); } catch {}
    } else { copy(url); }
  };

  // spotlight & parallax (ใช้ร่วมทั้ง Stage และ Dock)
  const stageRef = React.useRef(null);
  React.useEffect(() => {
    const el = stageRef.current; if (!el) return;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
    };
    const leave = () => { el.style.setProperty('--mx', '50%'); el.style.setProperty('--my', '40%'); };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, []);

  // magnetic
  const onMagnet = (e) => {
    const t = e.currentTarget, r = t.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2), y = e.clientY - (r.top + r.height / 2);
    t.style.setProperty('--tx', `${x * 0.06}px`); t.style.setProperty('--ty', `${y * 0.06}px`);
  };
  const offMagnet = (e) => { const t = e.currentTarget; t.style.setProperty('--tx', '0px'); t.style.setProperty('--ty', '0px'); };

  const BOChip = ({ value }) => (
    <button
      type="button"
      className={`fx-chip ${bo === value ? 'active' : ''}`}
      onClick={() => setBo(value)}
      onMouseMove={onMagnet}
      onMouseLeave={offMagnet}
      aria-pressed={bo === value}
    >
      <span className="fx-chip-txt">{value}</span>
      <i className="fx-chip-glow" aria-hidden />
      <i className="fx-chip-ring" aria-hidden />
    </button>
  );

  return (
    <div className="fh-wrap" data-skin="fluxharmony">
      {/* Global FX Layers (ทุกหน้าใช้เหมือนกัน) */}
      <MeshBG /><AuroraField /><AuroraOvertone /><Particles /><CometTrail /><Vignette /><NoiseGrain /><Scanlines />

      {/* Topbar */}
      <header className="fh-top">
        <div className="brand"><i className="dot" /><span className="name">ctrlg.gg</span></div>
        <div className="room">ROOM <b>#{roomCode}</b></div>
      </header>

      {/* HERO STAGE */}
      <section ref={stageRef} className="fh-stage" role="main" aria-label="ตั้งค่าซีรีส์">
        <div className="stage-card glass iridescent tilt">
          <div className="eyebrow">DRAFT ARENA</div>
          <h1 className="stage-title">Create <span className="grad">Room</span></h1>
          <p className="stage-sub">เลือกรูปแบบ Best-of แล้วเริ่มดราฟได้เลย ⚡</p>

          <div className="fx-row" role="group" aria-label="เลือก Best Of">
            <BOChip value="BO1" /><BOChip value="BO3" /><BOChip value="BO5" /><BOChip value="BO7" />
          </div>

          <button
            className="fx-cta"
            onClick={() => { onInit(bo); navigator.vibrate?.(12); }}
            onMouseMove={onMagnet}
            onMouseLeave={offMagnet}
            aria-label={`เริ่มดราฟแบบ ${bo}`}
          >
            เริ่มดราฟ — <b>{bo}</b>
            <span className="shine" />
          </button>

          <ul className="legend">
            <li><span className="dot neon" /> เกมต่อซีรีส์</li>
            <li><span className="dot purp" /> เวลา/สถานะซิงก์ผ่านกรรมการ</li>
            <li><span className="dot purp" /> Recommen</li>

          </ul>
        </div>
      </section>

      <footer className="fh-foot">ctrlg.gg • FluxHarmony</footer>
      <StyleFluxHarmony />
    </div>
  );
}

/* ------------------------- Dock Item ------------------------- */
function DockItem({ label, tag, url, onCopy, onShare }) {
  return (
    <div className="dock-item fx-surface">
      <div className="dock-top">
        <span className="dk-title">{label}</span>
        <span className="dk-badge">{tag}</span>
      </div>
      <div className="dk-url" title={url}>{url}</div>
      <div className="dk-actions">
        <a className="fx-btn ghost" href={url} target="_blank" rel="noopener noreferrer">เปิด</a>
        <button className="fx-btn ghost" onClick={onCopy}>คัดลอก</button>
        {typeof navigator !== 'undefined' && navigator.share ? <button className="fx-btn ghost" onClick={onShare}>แชร์</button> : null}
      </div>
    </div>
  );
}

/* ------------------------- Global FX Layers ------------------------- */
function MeshBG() { return <div className="fx-mesh" aria-hidden />; }
function AuroraField() { return <div className="fx-aurora" aria-hidden />; }
function AuroraOvertone() { return <div className="fx-aurora2" aria-hidden />; }
function Particles() {
  // สุ่มครั้งเดียวต่อ mount (กัน SSR mismatch)
  const stars = React.useMemo(() => (
    Array.from({ length: 72 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      d: (Math.random() * 6 + 4).toFixed(2),
      s: (Math.random() * 1.2 + 0.5).toFixed(2),
    }))
  ), []);
  return (
    <div className="fx-stars" aria-hidden>
      {stars.map(s => (
        <i
          key={s.id}
          style={{
            left: s.left,
            top: s.top,
            ['--d']: s.d,
            transform: `scale(${s.s})`,
          }}
        />
      ))}
    </div>
  );
}
function CometTrail() {
  return (
    <div className="fx-comet" aria-hidden>
      <i /><i /><i />
    </div>
  );
}
function Vignette() { return <div className="fx-vignette" aria-hidden />; }
function NoiseGrain() { return <div className="fx-noise" aria-hidden />; }
function Scanlines() { return <div className="fx-scan" aria-hidden />; }

/* =============================== MATCH ROOM =============================== */
export default function MatchRoom() {
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const roomCode = params.get('room') || 'demo';

  // ใช้สตริง role ตรง ๆ ไม่พึ่ง protocol
  const roleParam = (params.get('role') || 'referee').toString().toLowerCase();
  const teamParam = (params.get('team') || 'A').toUpperCase();

  const isRef = roleParam === 'referee';
  const isSpectator = roleParam === 'spectator';
  const lockedTeam = (!isRef && !isSpectator) ? teamParam : null;

  // --- Realtime / Timers ---
  const [bus] = React.useState(() => new LocalBus(roomCode));
  const [timers] = React.useState(() => createTimerManager());
  const [tState, setTState] = React.useState(timers.get());
  const externalFeed = React.useMemo(() => createEmitter(), []);
  const [config, setConfig] = React.useState(null);

  // sync timer state -> HUD
  React.useEffect(() => timers.on(setTState), [timers]);

  // host-only: animation loop ให้ timers เดิน
  React.useEffect(() => {
    if (!isRef) return;
    let raf;
    const loop = () => { timers.tick(); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [isRef, timers]);
// กันรีเซ็ตตอน Pause ด้วย ref ในคอมโพเนนต์
// กันรีเซ็ตเมื่ออยู่ในสถานะ pause
const pausedRef = React.useRef(false);

// --- bus subscriptions (REPLACE WHOLE BLOCK) ---
// bus subscriptions
React.useEffect(() => {
  const unsub = bus.subscribe((evt) => {
    if (!evt || !evt.type) return;

    switch (evt.type) {
      case RoomEvent.STATE: {
        setConfig(evt.payload?.config || null);
        break;
      }

      case RoomEvent.ACTION: {
        // ส่งต่อให้ Draft/Overlay เท่านั้น — ห้ามยุ่ง timers ตรง ๆ
        externalFeed.emit(evt.payload);
        break;
      }

      case RoomEvent.START: {
        // ยกเลิกโหมด freeze แล้ว start
        if (!timers.state) timers.state = {};
        timers.state._freezeReset = false;
        timers.start?.();
        externalFeed.emit({ kind: 'control', type: 'start' });
        break;
      }

      case RoomEvent.PAUSE: {
        // เข้าสู่โหมด freeze: กัน reset ทุกกรณีขณะ pause และหยุดเวลาให้จริง
        if (!timers.state) timers.state = {};
        timers.state._freezeReset = true;
        timers.pause?.();
        externalFeed.emit({ kind: 'control', type: 'pause' });
        break;
      }

      case RoomEvent.RESUME: {
        // ออกจากโหมด freeze แล้วค่อย resume
        if (!timers.state) timers.state = {};
        timers.state._freezeReset = false;
        timers.resume?.();
        externalFeed.emit({ kind: 'control', type: 'resume' });
        break;
      }

      case RoomEvent.SETTINGS: {
        // payload จาก RefereeConsole: { timers:{perAction,reserve}, resetCurrent?, source? }
        const { perAction, reserve } = evt?.payload?.timers ?? {};
        const requestedReset = !!evt?.payload?.resetCurrent;
        const fromApply = evt?.payload?.source === 'apply';

        // กันรีเซ็ตตอน pause แบบแข็ง ๆ
        const freeze = !!timers.state?._freezeReset;
        const shouldReset = !freeze && fromApply && requestedReset;

        // บางโปรเจ็กต์ setSettings(newCfg, {resetCurrent}) / บางโปรเจ็กต์รับรวม
        if (typeof timers.setSettings === 'function') {
          // 2-อาร์กิวเมนต์
          try {
            timers.setSettings({ perAction, reserve }, { resetCurrent: shouldReset });
          } catch {
            // fallback 1-อาร์กิวเมนต์ (รวม flag ใส่ไปในอ็อบเจ็กต์เดียว)
            timers.setSettings?.({ perAction, reserve, resetCurrent: shouldReset });
          }
        } else {
          timers.setSettings?.({ perAction, reserve, resetCurrent: shouldReset });
        }
        break;
      }

      default: break;
    }
  });

  return unsub;
}, [bus, externalFeed, timers]);



  // รับ action จาก DraftPage -> กระจายออกทั้งห้อง + เดินคิว
  const handleDraftAction = React.useCallback((a) => {
    bus.publish({ type: RoomEvent.ACTION, payload: a });
    const nextTurn = a.team === 'A' ? 'B' : 'A';
    timers.onActionCommit(nextTurn);
  }, [bus, timers]);

  // init โดย Host (สร้าง config + ประกาศ STATE)
  const initByHost = (boType) => {
    const payload = { config: { roomCode, boType, createdBy: 'referee', ts: Date.now() }, status: 'drafting' };
    setConfig(payload.config);
    bus.publish({ type: RoomEvent.STATE, payload });
    bus.publish({ type: RoomEvent.START });
  };

  // Host ยังไม่ init
  if (isRef && !config) return <HostSetup roomCode={roomCode} onInit={initByHost} />;

  // ผู้เล่น/ผู้ชม — รอ Host
  // ผู้เล่น/ผู้ชม — ไม่ต้องรอ Host
if (!isRef && !config) {
  // สร้าง config เริ่มต้นให้อัตโนมัติ
  const autoConfig = { 
    roomCode, 
    boType: 'BO3', 
    createdBy: 'auto', 
    ts: Date.now() 
  };
  setConfig(autoConfig);
  
  // เริ่มต้นระบบทันที
  return (
    <div className="fh-wrap cg-theme cg-insane" style={{ minHeight: '100vh' }}>
      <MeshBG /><AuroraField /><AuroraOvertone /><Particles /><CometTrail /><Vignette /><NoiseGrain /><Scanlines />
      <TimerHUD t={timers.get()} />
      <DraftPage
        startBoType={autoConfig.boType}
        waitForHost={false}  // เปลี่ยนเป็น false
        readOnly={isSpectator}
        onAction={handleDraftAction}
        externalFeed={externalFeed}
        lockedTeam={lockedTeam}
      />
      <StyleFluxHarmony />
    </div>
  );
}

  // เริ่มดราฟแล้ว
  return (
    <div className="fh-wrap cg-theme cg-insane" style={{ minHeight: '100vh' }}>
      <MeshBG /><AuroraField /><AuroraOvertone /><Particles /><CometTrail /><Vignette /><NoiseGrain /><Scanlines />
      <TimerHUD t={tState} />
      <DraftPage
        startBoType={config?.boType}
        waitForHost={!isRef}
        readOnly={isSpectator}
        onAction={handleDraftAction}
        externalFeed={externalFeed}
        lockedTeam={lockedTeam}
      />
      <StyleFluxHarmony />
    </div>
  );
}

/* =============================== THEME (FX จัดเต็ม + Dock เท่าการ์ด) =============================== */
function StyleFluxHarmony() {
  return (
    <style>{`
      :root{
        /* Brand palette (เดียวทั้งหน้า) */
        --bg:#070a12; --txt:#eef5ff; --muted:#a4b6c9;
        --c1:#00e5ff; --c2:#ff3d9a; --c3:#7c5cff; --c4:#c8ff72;
        --line:rgba(255,255,255,.14);
        --glassA:rgba(255,255,255,.12); --glassB:rgba(255,255,255,.05);
        --rad:22px; --shadow:0 28px 88px rgba(0,0,0,.55);
        --dur:320ms; --ease:cubic-bezier(.2,.8,.16,1);
        /* ความกว้างกลางที่ stage-card และ dock ใช้ร่วมกัน */
        --content-max: 980px;
      }

      .fh-wrap{position:relative; background:var(--bg); color:var(--txt); overflow:hidden; isolation:isolate}

      .fx-mesh{position:absolute; inset:-20%; z-index:0; pointer-events:none;
        background:
          radial-gradient(1200px 800px at 12% 12%, #0b1526, transparent 60%),
          radial-gradient(1200px 900px at 88% 88%, #180d2e, transparent 62%);
        filter:saturate(130%) }

      .fx-aurora{position:absolute; inset:-18%; z-index:1; pointer-events:none}
      .fx-aurora::before,.fx-aurora::after{content:''; position:absolute; inset:-10%;
        background:
          radial-gradient(900px 560px at 12% 18%, rgba(0,229,255,.62), transparent 60%),
          radial-gradient(1000px 700px at 86% 86%, rgba(255,61,154,.54), transparent 62%),
          radial-gradient(900px 620px at 30% 86%, rgba(124,92,255,.56), transparent 62%);
        mix-blend-mode:screen; opacity:.76; animation:aur 22s ease-in-out infinite alternate;}
      .fx-aurora::after{filter:blur(28px); opacity:.58}

      .fx-aurora2{position:absolute; inset:-18%; z-index:2; pointer-events:none; mix-blend-mode:screen; opacity:.45}
      .fx-aurora2::before{content:''; position:absolute; inset:-12%;
        background:
          radial-gradient(700px 520px at 80% 20%, rgba(200,255,114,.28), transparent 62%),
          radial-gradient(880px 520px at 20% 88%, rgba(0,229,255,.22), transparent 62%);
        filter:blur(16px); animation:aur2 26s ease-in-out infinite alternate;}
      @keyframes aur{0%{transform:translate3d(0,0,0) scale(1)}100%{transform:translate3d(2%,-2%,0) scale(1.04)}}
      @keyframes aur2{0%{transform:translate3d(0,0,0) scale(1)}100%{transform:translate3d(-2%,2%,0) scale(1.06)}}

      .fx-stars{position:absolute; inset:0; z-index:3; pointer-events:none; opacity:.65}
      .fx-stars i{position:absolute; width:2px; height:2px; background:#fff; border-radius:50%; opacity:.55;
        box-shadow:0 0 8px rgba(255,255,255,.75); animation:twinkle calc(5s + var(--d)*1s) ease-in-out infinite}
      @keyframes twinkle{50%{opacity:.18; transform:translateY(-6px)}}

      .fx-comet{position:absolute; inset:0; z-index:3; pointer-events:none}
      .fx-comet i{position:absolute; width:2px; height:2px; background:#fff; border-radius:50%;
        box-shadow:0 0 10px rgba(255,255,255,.9), 24px 0 18px -6px rgba(0,229,255,.6), 48px 0 24px -8px rgba(255,61,154,.45);
        animation:comet 10s linear infinite; opacity:.9}
      .fx-comet i:nth-child(2){animation-delay: -3.2s; top:18%}
      .fx-comet i:nth-child(3){animation-delay: -6.1s; top:78%}
      @keyframes comet{0%{left:-10%; top:12%} 100%{left:110%; top:82%}}

      .fx-vignette{position:absolute; inset:-2px; z-index:4; pointer-events:none;
        background:
          radial-gradient(60% 50% at var(--mx,50%) var(--my,40%), rgba(255,255,255,.12), transparent 55%),
          radial-gradient(120% 80% at 50% 50%, rgba(0,0,0,.45), transparent 60%);
        opacity:.55; filter:blur(10px)}

      .fx-noise{position:absolute; inset:0; z-index:5; pointer-events:none; opacity:.22;
        background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.05'/></svg>");
        mix-blend-mode:overlay;}

      .fx-scan{position:absolute; inset:-2px; z-index:6; pointer-events:none; opacity:.08;
        background:linear-gradient(transparent 90%, rgba(255,255,255,.6) 92%, transparent 94%) 0 0/100% 6px;
        animation:scan 6s linear infinite}
      @keyframes scan{0%{transform:translateY(-6%)}100%{transform:translateY(6%)}}

      .fh-top{position:relative; z-index:7; display:flex; align-items:center; justify-content:space-between; padding:22px 20px 8px}
      .brand{display:flex; align-items:center; gap:10px; font-weight:1000; text-transform:lowercase}
      .brand .name{background:linear-gradient(90deg, var(--c1), var(--c2), var(--c3)); -webkit-background-clip:text; background-clip:text; color:transparent}
      .brand .dot{width:12px; height:12px; border-radius:50%; background:var(--c1); box-shadow:0 0 16px var(--c1), 0 0 6px var(--c1) inset}
      .room{color:var(--muted); font-weight:900}

      .fh-stage{position:relative; z-index:8; display:grid; place-items:center; padding:8vh 20px 26vh}
      @media (max-width:980px){ .fh-stage{padding:6vh 16px 30vh} }

      .stage-card{
        position:relative; width:min(var(--content-max), 94vw);
        border-radius:var(--rad); padding:28px 24px 20px; text-align:center;
      }
      .glass{background:linear-gradient(180deg, var(--glassA), var(--glassB)); backdrop-filter:blur(16px); box-shadow:var(--shadow); border:1px solid var(--line)}
      .iridescent{ position:relative; }
      .iridescent::before{ content:''; position:absolute; inset:-2px; border-radius:inherit; pointer-events:none;
        background:conic-gradient(from 0deg, rgba(0,229,255,.28), rgba(255,61,154,.22), rgba(124,92,255,.28), rgba(0,229,255,.28));
        filter:blur(22px); opacity:.60; animation:spin 18s linear infinite }
      .iridescent::after{ content:''; position:absolute; inset:0; border-radius:inherit; pointer-events:none; mix-blend-mode:overlay;
        background:radial-gradient(120% 100% at 50% 0%, rgba(255,255,255,.18), transparent 55%); }
      @keyframes spin{ to { transform: rotate(360deg) } }

      .tilt{ transform-style:preserve-3d; transition:transform 260ms var(--ease) }
      .fh-stage:hover .tilt{
        transform:
          perspective(1000px)
          rotateX(calc(((40 - (var(--my,40) + 0)) / 40) * 2deg))
          rotateY(calc(((var(--mx,50) - 50) / 50) * 3deg));
      }

      .eyebrow{font-size:11px; color:var(--muted); letter-spacing:.22em}
      .stage-title{margin:6px 0 4px; font-size:36px; font-weight:1000}
      .grad{background:linear-gradient(90deg, var(--c1), var(--c2), var(--c3)); -webkit-background-clip:text; background-clip:text; color:transparent}
      .stage-sub{color:var(--muted); margin:0 0 12px}

      .fx-row{display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:12px; margin:10px 0 14px}
      @media (max-width:520px){ .fx-row{grid-template-columns:repeat(2,minmax(0,1fr))} }
      .fx-chip{
        --tx:0px; --ty:0px;
        position:relative; padding:16px 12px; border-radius:14px; border:1px solid var(--line);
        background:linear-gradient(180deg, rgba(255,255,255,.12), rgba(255,255,255,.05)); color:var(--txt); font-weight:1000;
        cursor:pointer; transform:translate(var(--tx), var(--ty));
        transition: transform var(--dur) var(--ease), box-shadow var(--dur) var(--ease), border-color var(--dur) var(--ease), background var(--dur) var(--ease);
        overflow:hidden; text-align:center;
      }
      .fx-chip-glow{position:absolute; inset:-34%; background:radial-gradient(420px 240px at 28% 30%, rgba(255,255,255,.28), transparent 60%); filter:blur(14px); opacity:.35}
      .fx-chip-ring{position:absolute; inset:-2px; border-radius:inherit; background:conic-gradient(from 0deg, rgba(0,229,255,.18), rgba(255,61,154,.14), rgba(124,92,255,.18)); filter:blur(18px); opacity:.48; pointer-events:none}
      .fx-chip:hover{ transform:translate(calc(var(--tx)*1.05), calc(var(--ty)*1.05)); box-shadow:0 16px 28px rgba(0,0,0,.36) }
      .fx-chip.active{ border-color:rgba(0,229,255,.65); box-shadow:0 0 0 2px rgba(0,229,255,.18), inset 0 0 26px rgba(0,229,255,.22);
        background:linear-gradient(90deg, rgba(0,229,255,.22), rgba(255,61,154,.18), rgba(124,92,255,.22)) }
      .fx-chip-txt{position:relative; z-index:1}

      .fx-cta{
        --tx:0px; --ty:0px;
        position:relative; display:inline-flex; align-items:center; justify-content:center; gap:8px;
        padding:16px 22px; border:none; border-radius:16px; cursor:pointer; font-weight:1000; font-size:18px; color:#061019;
        background:linear-gradient(90deg, rgba(124,92,255,.78), rgba(0,229,255,.78));
        box-shadow:0 22px 62px rgba(0,229,255,.34), 0 18px 44px rgba(255,61,154,.26), inset 0 0 18px rgba(255,255,255,.24);
        transform:translate(var(--tx), var(--ty)); transition: transform var(--dur) var(--ease), box-shadow var(--dur) var(--ease);
      }
      .fx-cta .shine{position:absolute; inset:0; background:
        linear-gradient(90deg, transparent 0%, rgba(255,255,255,.65) 50%, transparent 100%),
        radial-gradient(120% 120% at 0% 0%, rgba(255,255,255,.12), transparent 60%);
        transform:translateX(-120%); animation:sweep 3.1s ease-in-out infinite; opacity:.45}
      .fx-cta:active{ transform:translate(calc(var(--tx)*.85), calc(var(--ty)*.85)) }
      @keyframes sweep{ 0%{transform:translateX(-120%)} 100%{transform:translateX(120%)} }

      .legend{display:flex; justify-content:center; gap:12px; margin-top:10px; color:var(--muted); font-size:12px}
      .legend .dot{display:inline-block; width:8px; height:8px; border-radius:50%; margin-right:6px}
      .legend .neon{background:var(--c1)} .legend .purp{background:var(--c3)}

      .fh-dock{
        position:fixed;
        left:50%;
        transform:translateX(-50%);
        right:auto;
        width:min(var(--content-max), 94vw);
        bottom:calc(12px + env(safe-area-inset-bottom, 0px));
        z-index:9;

        display:grid; grid-template-columns:repeat(4, minmax(0,1fr)); gap:10px;
        padding:10px; border-radius:18px;

        background:linear-gradient(180deg, var(--glassA), var(--glassB));
        border:1px solid var(--line);
        box-shadow:var(--shadow), 0 0 0 1px rgba(255,255,255,.05) inset, 0 0 36px rgba(0,229,255,.10) inset;
        backdrop-filter:blur(14px) saturate(120%);
        box-sizing:border-box;
      }
      @media (max-width:980px){ .fh-dock{grid-template-columns:1fr; gap:8px} }

      .fx-surface{ position:relative; overflow:hidden }
      .fx-surface::after{ content:''; position:absolute; inset:-2px; border-radius:inherit; pointer-events:none;
        background:conic-gradient(from 0deg, rgba(0,229,255,.20), rgba(255,61,154,.16), rgba(124,92,255,.20)); filter:blur(20px); opacity:.5 }

      .dock-item{ border:1px solid var(--line); border-radius:14px; padding:10px;
        background:linear-gradient(180deg, rgba(255,255,255,.12), rgba(255,255,255,.06));
        backdrop-filter:blur(12px); box-shadow:0 10px 36px rgba(0,0,0,.35), inset 0 0 22px rgba(255,255,255,.06) }
      .dock-top{display:flex; justify-content:space-between; align-items:center; gap:10px; margin-bottom:6px}
      .dk-title{font-weight:1000}
      .dk-badge{font-size:10px; padding:5px 10px; border-radius:999px; border:1px solid rgba(255,255,255,.22);
        background:rgba(255,255,255,.10); box-shadow:inset 0 0 18px rgba(255,255,255,.14)}
      .dk-url{font-family:ui-monospace,Menlo,Consolas,monospace; font-size:12px; background:rgba(0,0,0,.36);
        border:1px dashed rgba(255,255,255,.18); padding:8px; border-radius:10px; word-break:break-all; margin-bottom:8px}
      .dk-actions{display:flex; gap:8px; flex-wrap:wrap}
      .fx-btn{border:1px solid var(--line); border-radius:10px; padding:10px 12px; font-weight:900; background:rgba(255,255,255,.08); color:var(--txt); cursor:pointer; transition:transform var(--dur) var(--ease), box-shadow var(--dur) var(--ease)}
      .fx-btn:hover{ transform:translateY(-1px); box-shadow:0 12px 24px rgba(0,0,0,.30), 0 0 18px rgba(0,229,255,.18) inset }
      .fx-btn.ghost{ background:rgba(255,255,255,.06) }

      .fh-foot{position:relative; z-index:8; text-align:center; color:var(--muted); font-size:12px; padding:12px 0 28px}

      @media (prefers-reduced-motion: reduce){
        .fx-aurora::before,.fx-aurora::after,.fx-aurora2::before,.fx-cta .shine,.iridescent::before,.fx-comet i{ animation:none !important }
      }
    `}</style>
  );
}
