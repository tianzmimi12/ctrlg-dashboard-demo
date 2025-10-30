/* ================================================
   DRAFTPAGE — CTRL G THEME (KEEP LOGIC UNCHANGED)
   ================================================ */

   import React, { useState, useMemo, useEffect, useRef } from 'react';
   import { useNavigate } from 'react-router-dom';
   import { motion } from 'framer-motion';
   import heroList from '../data/heroList.json';
   import LocalBus from '../realtime/localBus';
  import { RoomEvent } from '../realtime/protocol';
   /* =========================================================
      0) THEME TOKENS (CSS Variables scoped under .cg-theme)
      - รีสกินได้ทั้งแอปด้วยตัวแปรชุดเดียว
      - ไม่แตะลอจิก / state / ฟังก์ชันเดิม
      ========================================================= */
/* =========================================================
   THEME_CSS — CTRL G (INSANE FX Mode 🤯)
   ใส่คลาส root: className="cg-theme cg-insane"
   ========================================================= */
   const THEME_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@700;800&family=Prompt:wght@400;500;600&display=swap');

/* =========================
   CTRL G — THEME TOKENS
   ========================= */
   /* =========================
   MOBILE LANDSCAPE OPTIMIZATION
   ========================= */
@media (max-width: 1024px) and (orientation: landscape) {
  .cg-theme .cg-toolbar-3 {
    padding: 8px 12px;
    gap: 8px;
  }
  
  .cg-theme .cg-toolbar-3 > .left {
    gap: 6px;
    flex-wrap: nowrap;
    overflow-x: auto;
  }
  
  .cg-theme .cg-toolbar-3 > .right {
    gap: 6px;
    flex-wrap: nowrap;
  }
  
  /* ลดขนาดการ์ดฮีโร่ */
  .cg-theme [data-heroname] {
    width: 70px !important;
    height: 94px !important;
  }
  
  .cg-theme [data-heroname] img {
    height: 66px !important;
  }
  
  .cg-theme [data-heroname] div {
    font-size: 10px !important;
    height: 20px !important;
  }
  
  /* ลดขนาดสล็อต */
  .cg-theme .cg-slot {
    width: 60px !important;
    height: 90px !important;
    margin: 4px !important;
  }
  
  .cg-theme .cg-slot img {
    width: 56px !important;
    height: 56px !important;
  }
  .mobile-landscape .mobile-draft-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 8px;
}

.mobile-landscape .mobile-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: var(--cg-surface);
  border-radius: 12px;
  margin-bottom: 8px;
}

.mobile-landscape .mobile-teams-container {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.mobile-landscape .mobile-team {
  flex: 1;
  background: var(--cg-surface-2);
  padding: 8px;
  border-radius: 12px;
}

.mobile-landscape .mobile-hero-selector {
  flex: 1;
  overflow-y: auto;
}

/* ปรับการ์ดฮีโร่ให้เล็กลง */
.mobile-landscape [data-heroname] {
  width: 65px !important;
  height: 85px !important;
}

.mobile-landscape [data-heroname] img {
  height: 55px !important;
}
  /* ปรับระยะห่างกริด */
  .cg-theme .hero-grid-container {
    gap: 10px !important;
  }
  
  /* ปุ่ม角色เล็กลง */
  .cg-theme .role-filter button {
    padding: 6px 12px !important;
    font-size: 12px !important;
  }
  
  /* Timer เล็กลง */
  .cg-theme .countdown-timer {
    font-size: 24px !important;
    height: 45px !important;
    min-width: 140px !important;
  }
  
  /* ซ่อนบาง element ที่ไม่จำเป็น */
  .cg-theme .mini-strip {
    display: none !important;
  }
}
.cg-theme{
  --cg-font-head: "Kanit", system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans Thai", sans-serif;
  --cg-font-sans: "Prompt", system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans Thai", sans-serif;

  --cg-bg:        #0F1422;
  --cg-bg-2:      #171D2E;
  --cg-surface:   #141A2B;
  --cg-surface-2: #1A2033;

  --cg-text:   #FFFFFF;
  --cg-muted:  #C3CBE0;

  --cg-primary:   #7A5CFF;
  --cg-primary-2: #9B82FF;
  --cg-accent:    #C8FF00;
  --cg-accent-2:  #E6FF4D;

  --cg-info:    #7A6CFF;
  --cg-danger:  #FF3B47;
  --cg-warning: #FFD600;

  --cg-border: rgba(255,255,255,.16);
  --cg-radius: 16px;
  --cg-shadow: 0 10px 24px rgba(0,0,0,.45), 0 2px 8px rgba(0,0,0,.25);

  --cg-glow-primary: 0 0 0 2px rgba(122,92,255,.35), 0 0 42px rgba(122,92,255,.45);
  --cg-glow-accent:  0 0 0 2px rgba(200,255,0,.32),  0 0 38px rgba(200,255,0,.24);

  /* panels used in JS */
  --cg-panelA: #2a1b2e;
  --cg-panelB: #162b2e;

  --fx-speed: 1;
  --fx-intensity: 1;
  --fx-blur: 60px;

  color: var(--cg-text);
  font-family: var(--cg-font-sans);
  background:
    radial-gradient(1200px 600px at 10% -10%, rgba(122,92,255,.18), transparent 60%),
    radial-gradient(900px 500px  at 85% 110%, rgba(200,255,0,.10),  transparent 60%),
    var(--cg-bg);
}
/* ใน THEME_CSS */
@keyframes forcedPickPulse {
  0%, 100% { 
    transform: translate(-50%, -50%) scale(1);
    box-shadow: 0 0 40px rgba(255,59,71,0.8);
  }
  50% { 
    transform: translate(-50%, -50%) scale(1.1);
    box-shadow: 0 0 60px rgba(255,59,71,1);
  }
}

@keyframes electricFlash {
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
}

/* สไตล์สำหรับช่อง EMPTY */
.cg-slot .empty-slot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    45deg,
    rgba(255,59,71,0.1),
    rgba(255,59,71,0.1) 10px,
    rgba(255,59,71,0.05) 10px,
    rgba(255,59,71,0.05) 20px
  );
  border: 2px dashed var(--cg-danger);
  color: var(--cg-danger);
  font-weight: 900;
  font-size: 12px;
  border-radius: 14px;
}
/* Premium heading look */
.cg-theme h1,.cg-theme h2{
  background: linear-gradient(90deg, #fff, #C8FF00, #9B82FF, #fff);
  -webkit-background-clip: text; background-clip: text; color: transparent;
  background-size: 300% 100%; animation: cg-head-grad 6s linear infinite;
  text-shadow: 0 2px 22px rgba(200,255,0,.12);
}
@keyframes cg-head-grad{ to{ background-position: 300% 0; } }

/* Toolbar */
.cg-theme .toolbar{ position:sticky; top:0; z-index:20; }
.cg-theme .toolbar::after{
  content:""; position:absolute; inset:0; pointer-events:none;
  background: repeating-linear-gradient(0deg, rgba(255,255,255,.045) 0 2px, transparent 2px 4px);
  mix-blend-mode: screen; opacity:.35;
}

/* Global Aurora layer (parallax via --mx/--my) */
.cg-theme::before{
  content:""; position:fixed; inset:-15%;
  pointer-events:none; z-index:0;
  background:
    radial-gradient(800px 520px at var(--mx,50%) var(--my,50%),
      rgba(122,92,255,.22), transparent 60%),
    radial-gradient(640px 380px at calc(100% - var(--mx,50%)) calc(100% - var(--my,50%)),
      rgba(200,255,0,.12), transparent 60%);
  mix-blend-mode: screen;
  filter: blur(calc(10px * var(--fx-intensity)));
  transition: opacity .2s ease;
  opacity:.75;
}
/* 3-area toolbar layout: left | center | right */
.cg-theme .cg-toolbar-3{
  position: sticky; top: 0; z-index: 20;
  display: grid;
  grid-template-columns: 1fr auto 1fr; /* กลางกว้างเท่าคอนเทนต์ */
  align-items: center;
  gap: 16px;
  padding: 12px 24px;
  background: var(--cg-surface);
  border-bottom: 1px solid var(--cg-border);
}
.cg-theme .cg-toolbar-3 > .left{
  justify-self: start;
  display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
}
.cg-theme .cg-toolbar-3 > .center{
  justify-self: center;
  display: inline-flex; align-items: center; gap: 8px;
}
.cg-theme .cg-toolbar-3 > .right{
  justify-self: end;
  display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
}

/* =========================
   TIMER (center row + chips)
   ========================= */
/* center row wrapper */
.cg-theme .cg-timer-row{
  display:flex; justify-content:center; align-items:center;
  padding: 12px 0 18px; position: relative; z-index: 12;
}

/* legacy big countdown (used in Center) */
.cg-theme .countdown-timer{
  background: #1a1a1a;
  color:#fff;
  font-family: 'Arial', sans-serif;
  font-weight: 700;
  font-size: 32px;
  height: 60px; min-width: 180px;
  display:flex; align-items:center; justify-content:center; gap:10px;
  padding: 0 20px; border-radius: 40px;
  border: 2px solid rgba(255,255,255, 0.1);
  box-shadow: 0 4px 10px rgba(0,0,0,.6);
  transition: all .3s ease-in-out;
}
.cg-theme .countdown-timer .ico{
  width:22px; height:22px; display:inline-grid; place-items:center;
  filter: drop-shadow(0 0 10px rgba(255,255,255,.25));
}
.cg-theme .countdown-timer .t{ text-shadow:0 2px 14px rgba(0,0,0,.55); }

/* warn/danger states */
.cg-theme .countdown-timer.is-warn{
  background:#e65100;
  box-shadow: 0 0 10px rgba(255,165,0,.8);
  animation: warningPulse 1s infinite alternate;
}
.cg-theme .countdown-timer.is-danger{
  background:#e53935;
  box-shadow: 0 0 10px rgba(255,0,0,.8);
  animation: shake .5s ease-in-out infinite;
}

/* toolbar mini timer chip */
.cg-theme .cg-timer{
  --p: 0%;
  --t-bg: #222a3b;
  font-family: var(--cg-font-head);
  letter-spacing:.4px;
  height: 42px; min-width: 156px;
  padding: 0 18px; border-radius: 999px;
  background: var(--t-bg); color: #fff; font-weight: 800;
  display: inline-flex; align-items:center; justify-content: center; gap: 8px;
  position: relative; overflow: hidden;
  border: 1px solid rgba(255,255,255,.14);
  box-shadow: 0 10px 26px rgba(0,0,0,.45), 0 0 0 1px rgba(255,255,255,.06);
}
.cg-theme .cg-timer::before{
  content:""; position:absolute; left:0; top:0; bottom:0; width: var(--p);
  background: linear-gradient(90deg, rgba(122,92,255,.28), rgba(200,255,0,.24));
  filter: saturate(1.2); transition: width .2s linear;
}
.cg-theme .cg-timer .ico{
  width:16px; height:16px; display:inline-grid; place-items:center;
  opacity:.95; filter: drop-shadow(0 0 8px rgba(255,255,255,.25));
}
.cg-theme .cg-timer.is-warn{
  box-shadow: 0 0 0 2px rgba(255,176,0,.28), 0 0 28px rgba(255,176,0,.22);
}
.cg-theme .cg-timer.is-danger{
  background: #a3121b;
  box-shadow: 0 0 0 2px rgba(255,59,71,.36), 0 0 38px rgba(255,59,71,.38);
  animation: cg-timer-shake .55s cubic-bezier(.36,.07,.19,.97) infinite;
}
.cg-theme .cg-timer .t{ position:relative; z-index:1; text-shadow:0 1px 10px rgba(0,0,0,.45); }

@keyframes warningPulse{ 0%{opacity:.8; transform:scale(1);} 100%{opacity:1; transform:scale(1.1);} }
@keyframes shake{
  0%{transform:translateX(0)}25%{transform:translateX(-5px)}50%{transform:translateX(5px)}
  75%{transform:translateX(-5px)}100%{transform:translateX(5px)}
}
@keyframes cg-timer-shake{
  10%, 90% { transform: translate(-50%,-50%) translateX(-1px); }
  20%, 80% { transform: translate(-50%,-50%) translateX( 2px); }
  30%, 50%, 70% { transform: translate(-50%,-50%) translateX(-4px); }
  40%, 60% { transform: translate(-50%,-50%) translateX( 4px); }
}

/* =========================
   TURN NEON FRAMES
   ========================= */
.cg-theme .turn-frame{ position: relative; overflow: visible; }
.cg-theme .turn-frame.is-on::before{
  content:""; position:absolute; inset:-7px; border-radius: inherit; pointer-events:none;
  border: 7px solid var(--turn-color, var(--cg-accent));
  box-shadow: 0 0 14px var(--turn-color), 0 0 32px var(--turn-color), 0 0 52px var(--turn-color);
  animation: cg-turn-breathe 1.8s ease-in-out infinite; z-index: 1;
}
.cg-theme .turn-frame.is-on::after{
  content:""; position:absolute; inset:-7px; border-radius:inherit; pointer-events:none; padding:7px;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,.8) 50%, transparent 100%);
  background-size: 220% 100%; background-repeat:no-repeat; filter: blur(1px);
  -webkit-mask: linear-gradient(#000 0 0) padding-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude;
  animation: cg-turn-sweep 1.6s linear infinite; z-index: 1;
}
@keyframes cg-turn-breathe { 0%,100%{opacity:.7} 50%{opacity:1} }
@keyframes cg-turn-sweep   { 0%{background-position:220% 0;} 100%{background-position:-220% 0;} }

/* TURN border for hero columns (static) */
.cg-theme .turn-col{ position: relative; overflow: visible; border-radius: var(--turn-radius, 18px); }
.cg-theme .turn-col.is-on::before{
  content:""; position:absolute; inset: calc(-1 * var(--turn-thickness, 6px));
  border-radius: inherit; pointer-events:none;
  border: var(--turn-thickness, 6px) solid var(--turn-color, var(--cg-accent));
  box-shadow: 0 0 16px var(--turn-color), 0 0 34px var(--turn-color), 0 0 54px rgba(255,255,255,.12);
}

/* =========================
   Cursor trail
   ========================= */
.cg-theme .cg-trail{
  position:fixed; width:6px; height:6px; border-radius:50%;
  pointer-events:none; z-index:997;
  background: radial-gradient(circle, rgba(255,255,255,.95), rgba(255,255,255,0));
  box-shadow: 0 0 10px rgba(200,255,0,.45), 0 0 14px rgba(122,92,255,.35);
  animation: cg-trail-fade .6s ease-out forwards;
}
@keyframes cg-trail-fade{
  0%{ transform: translate(-50%,-50%) scale(1); opacity:.9; }
  100%{ transform: translate(-50%,-50%) scale(.6); opacity:0; }
}

/* =========================
   Typography & small deco
   ========================= */
.cg-theme h1,.cg-theme h2,.cg-theme h3,.cg-theme h4{
  font-family: var(--cg-font-head); letter-spacing:.3px; position:relative;
}
.cg-theme h1::after,.cg-theme h2::after{
  content:""; position:absolute; left:0; bottom:-6px; width:58px; height:3px; border-radius:2px;
  background: linear-gradient(90deg, var(--cg-primary), transparent);
}

/* =========================
   Highlight slot (marching)
   ========================= */
.cg-theme .cg-slot.is-highlight{
  position:relative; overflow:visible;
  box-shadow: 0 0 0 2px var(--cg-accent), 0 0 24px rgba(200,255,0,.35);
}
.cg-theme .cg-slot.is-highlight::before{
  content:""; position:absolute; inset:-3px; border-radius:16px; pointer-events:none;
  background: conic-gradient(from 0deg,
    rgba(200,255,0,.0) 0deg, rgba(200,255,0,.7) 120deg,
    rgba(122,92,255,.7) 240deg, rgba(200,255,0,.0) 360deg);
  -webkit-mask: linear-gradient(#000 0 0) padding-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude;
  padding:3px; animation: cg-hl-spin 1.4s linear infinite; filter: blur(.2px);
}
@keyframes cg-hl-spin { to { transform: rotate(360deg);} }
@keyframes cg-ai{
  0%  { opacity:.9; filter: blur(0px); }
  100%{ opacity:0; filter: blur(8px); }
}

/* =========================
   Base Surfaces / Controls
   ========================= */
.cg-theme .card,.cg-theme .panel,.cg-theme .box{
  background: var(--cg-surface); 
  border: 1px solid var(--cg-border);
  border-radius: var(--cg-radius);
  box-shadow: 0 12px 28px rgba(0,0,0,.48), 0 3px 10px rgba(0,0,0,.28);
}

/* Buttons */
.cg-theme .btn-like{
  padding:10px 18px; border-radius:16px; border:1px solid var(--cg-border);
  background: linear-gradient(180deg, rgba(255,255,255,.05), rgba(0,0,0,.12)) var(--cg-surface);
  color:var(--cg-text); font-weight:800; letter-spacing:.3px; box-shadow:var(--cg-shadow);
  cursor:pointer; position:relative; overflow:hidden;
  transition: transform .06s ease, box-shadow .25s ease, border-color .2s ease, background .2s ease, filter .2s ease;
}
.cg-theme .btn-like:hover{
  transform: translateY(-2px);
  filter: brightness(1.05);
  box-shadow: var(--cg-shadow), 0 0 0 1px rgba(255,255,255,.10), var(--cg-glow-primary);
  border-color: rgba(123,97,255,.45);
}
.cg-theme .btn-like:active{ transform: translateY(1px) scale(.99); filter: brightness(1.05) saturate(1.06); }
.cg-theme .btn-like::before{
  content:""; position:absolute; inset:-2px; border-radius:16px; pointer-events:none;
  background: conic-gradient(from 0deg, rgba(122,92,255,.55), rgba(200,255,0,.55), rgba(122,92,255,.55));
  -webkit-mask:linear-gradient(#000 0 0) padding-box,linear-gradient(#000 0 0);
  -webkit-mask-composite:xor; mask-composite:exclude;
  padding:2px; opacity:.35; animation: cg-rotate calc(8s/var(--fx-speed)) linear infinite;
}
.cg-theme .btn-like::after{
  content:""; position:absolute; left:50%; top:50%; width:0; height:0; border-radius:50%;
  background: rgba(255,255,255,.26); transform: translate(-50%,-50%); opacity:0; pointer-events:none;
}
.cg-theme .btn-like:active::after{ animation: cg-ripple .55s ease-out; }
@keyframes cg-ripple{ 0%{opacity:.45;width:0;height:0;} 100%{opacity:0;width:420px;height:420px;} }
@keyframes cg-rotate{ to{ transform: rotate(360deg);} }

.cg-theme .btn-like.is-primary{ background: var(--cg-primary); color:#0b0f1a; box-shadow: var(--cg-glow-primary); }
.cg-theme .btn-like.is-info   { background: var(--cg-info);    color:#0b0f1a; }
.cg-theme .btn-like.is-warn   { background: var(--cg-warning); color:#23232a; }
.cg-theme .btn-like.is-accent { background: var(--cg-accent);  color:#0b0f1a; }

/* Inputs & Chips */
.cg-theme input[type="text"], .cg-theme input[type="search"], .cg-theme input[type="email"]{
  border:1px solid var(--cg-border); background:var(--cg-bg-2); color:var(--cg-text);
  border-radius:12px; height:38px; padding:0 14px; caret-color: var(--cg-primary);
  transition: box-shadow .2s ease, border-color .2s ease, background .2s, filter .2s ease;
}
.cg-theme input:focus{ outline:none; border-color: rgba(123,97,255,.55); box-shadow: var(--cg-glow-primary); filter: brightness(1.05); }

.cg-theme .chip,.cg-theme .pill{
  border:1px solid var(--cg-border); background: rgba(255,255,255,.07); color:var(--cg-muted);
  border-radius:999px; padding:6px 12px; font-weight:800; position:relative; overflow:hidden;
}
.cg-theme .chip::after,.cg-theme .pill::after{
  content:""; position:absolute; inset:0; pointer-events:none;
  background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,.08) 50%, transparent 70%);
  transform: translateX(-120%);
}
.cg-theme .chip:hover::after,.cg-theme .pill:hover::after{ animation: cg-shine 1s ease; }
@keyframes cg-shine{ to{ transform: translateX(120%);} }

/* Slots */
.cg-theme .slot{
  border:2.5px dashed var(--cg-border);
  background: linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,0)), var(--cg-surface);
  border-radius:16px; position:relative; overflow:hidden;
}
.cg-theme .slot.highlight{
  border-color:transparent;
  box-shadow: 0 0 0 2px rgba(200,255,0,.66), 0 0 30px rgba(200,255,0,.38);
}
.cg-theme .slot.highlight::before{
  content:""; position:absolute; inset:-2px; border-radius:16px; pointer-events:none;
  background: conic-gradient(from 0deg, rgba(200,255,0,.88), rgba(122,92,255,.88), rgba(200,255,0,.88));
  -webkit-mask:linear-gradient(#000 0 0) padding-box,linear-gradient(#000 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude;
  padding:2px; animation: cg-rotate calc(4.5s/var(--fx-speed)) linear infinite;
}
.cg-theme .slot.highlight::after{
  content:""; position:absolute; inset:0; border-radius:14px; pointer-events:none;
  background:
    radial-gradient(600px 120px at 0% 0%, rgba(255,255,255,.12), transparent 40%),
    repeating-linear-gradient(135deg, rgba(255,255,255,.04) 0 6px, transparent 6px 12px);
  animation: cg-shimmer calc(2.2s/var(--fx-speed)) ease-in-out infinite;
}
@keyframes cg-shimmer{ 0%,100%{opacity:0;} 50%{opacity:.45;} }

/* =========================
   Toolbar / Panels / Strips
   ========================= */
.cg-theme .toolbar{
  background: linear-gradient(90deg, rgba(122,92,255,.20), rgba(200,255,0,.12), rgba(122,92,255,.20));
  background-size:200% 100%;
  animation: cg-toolbarFlow calc(16s/var(--fx-speed)) linear infinite;
  -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255,255,255,.10);
}
@keyframes cg-toolbarFlow{ 0%{background-position:0 0;} 100%{background-position:200% 0;} }

.cg-theme .side-panel{
  position:relative; overflow:hidden;
  background: linear-gradient(180deg, rgba(255,255,255,.06), transparent 30%), var(--cg-surface-2);
  border: 1px solid rgba(255,255,255,.10);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.03), 0 10px 32px rgba(0,0,0,.55);
}
.cg-theme .side-panel::before{
  content:""; position:absolute; left:-40%; top:-120px; width:180%; height:120px; pointer-events:none;
  background: linear-gradient(180deg, rgba(200,255,0,.14), rgba(122,92,255,.14), transparent);
  filter: blur(14px); transform: rotate(8deg);
  animation: cg-beamMove calc(9s/var(--fx-speed)) ease-in-out infinite;
}
@keyframes cg-beamMove{ 0%,100%{ transform: translateY(0) rotate(8deg);} 50%{ transform: translateY(40px) rotate(8deg);} }

.cg-theme .mini-strip{ position:relative; overflow:hidden; }
.cg-theme .mini-strip::after{
  content:""; position:absolute; inset:0; pointer-events:none;
  background: radial-gradient(400px 80px at 0% 0%, rgba(255,255,255,.08), transparent 40%);
  animation: cg-shimmer calc(2.4s/var(--fx-speed)) ease-in-out infinite;
}

/* INSANE BG layer */
.cg-theme.cg-insane{
  background:
    radial-gradient(1.8px 1.8px at 15% 25%, rgba(255,255,255,.32) 50%, transparent 60%),
    radial-gradient(1.4px 1.4px at 65% 70%, rgba(255,255,255,.28) 50%, transparent 60%),
    radial-gradient(1.6px 1.6px at 82% 18%, rgba(255,255,255,.24) 50%, transparent 60%),
    linear-gradient(transparent 96%, rgba(200,255,0,.07) 96%),
    linear-gradient(90deg, transparent 96%, rgba(122,92,255,.07) 96%),
    radial-gradient(1200px 600px at 10% -10%, rgba(122,92,255,.22), transparent 60%),
    radial-gradient(900px 500px  at 85% 110%, rgba(200,255,0,.12),  transparent 60%),
    var(--cg-bg);
  background-size: auto, auto, auto, 100% 28px, 28px 100%, auto, auto, auto;
  animation: cg-gridMove calc(48s/var(--fx-speed)) linear infinite, cg-twinkle calc(2.6s/var(--fx-speed)) ease-in-out infinite alternate;
}
@keyframes cg-gridMove{
  0%{background-position:0 0,0 0,0 0, 0 0, 0 0, 0 0, 0 0, 0 0;}
  100%{background-position:0 0,0 0,0 0, 0 28px, 28px 0, 0 0, 0 0, 0 0;}
}
@keyframes cg-twinkle{ from{filter:brightness(1);} to{filter:brightness(calc(1 + .06*var(--fx-intensity)));} }

/* =========================
   Press FX (visual only)
   ========================= */
/* Cyber ripple + ring + hit + spark (single source of truth) */
.cg-theme .cg-ripple{
  position:absolute; left:0; top:0; width:14px; height:14px; transform:translate(-50%,-50%);
  border-radius:50%; pointer-events:none; z-index:3; opacity:.95; mix-blend-mode:screen;
  background:
    radial-gradient(circle, rgba(0,255,255,.55) 0%, rgba(0,255,255,.22) 36%, rgba(255,0,215,.22) 37%, rgba(255,0,215,.18) 56%, transparent 57%);
  box-shadow: 0 0 20px rgba(0,255,255,.35), 0 0 28px rgba(255,0,215,.30);
  animation: cg-rip-cy .65s cubic-bezier(.2,.8,.2,1) forwards;
}
.cg-theme .cg-ripple::before{
  content:""; position:absolute; inset:-40%; border-radius:50%;
  background: repeating-conic-gradient(from 0deg, rgba(0,255,255,.25) 0 10deg, rgba(255,0,215,.0) 10deg 20deg);
  filter: blur(.6px); opacity:.8; animation: cg-rip-spin .65s linear forwards;
}
.cg-theme .cg-ripple::after{
  content:""; position:absolute; inset:-50%; border-radius:50%;
  -webkit-mask: radial-gradient(circle, transparent 68%, #000 70%);
  background:
    radial-gradient(closest-side, rgba(255,0,215,.35), transparent 70%),
    radial-gradient(closest-side, rgba(0,255,255,.35), transparent 72%);
  filter: blur(1px);
}
@keyframes cg-rip-cy{ 0%{transform:translate(-50%,-50%) scale(.3); opacity:.95;} 70%{opacity:.38;} 100%{transform:translate(-50%,-50%) scale(16); opacity:0;} }
@keyframes cg-rip-spin{ to{ transform: rotate(360deg) scale(1.4); opacity:0; } }

.cg-theme .cg-press-ring{
  position:absolute; left:0; top:0; width:12px; height:12px; transform:translate(-50%,-50%);
  border-radius:50%; pointer-events:none; z-index:3; opacity:.95;
  background:
    radial-gradient(circle at 50% 50%, rgba(255,255,255,.12), transparent 60%),
    repeating-conic-gradient(from 0deg, rgba(0,255,255,.9) 0 6deg, rgba(255,0,215,.9) 6deg 12deg, transparent 12deg 18deg);
  -webkit-mask: radial-gradient(circle, transparent 65%, #000 66%);
  box-shadow: 0 0 20px rgba(0,255,255,.35), 0 0 24px rgba(255,0,215,.35);
  animation: cg-ring-spin .7s cubic-bezier(.2,.8,.2,1) forwards;
}
@keyframes cg-ring-spin { to{ transform: translate(-50%,-50%) scale(14) rotate(360deg); opacity:0; } }

.cg-theme [data-heroname] .cg-press-hit{
  position:absolute; inset:0; border-radius:16px; pointer-events:none; overflow:hidden;
  background:
    linear-gradient( to bottom, rgba(0,255,255,.0), rgba(0,255,255,.18), rgba(0,255,255,.0)),
    repeating-linear-gradient(0deg, rgba(255,255,255,.08) 0 2px, transparent 2px 4px);
  mix-blend-mode: screen; opacity:0; animation: cg-hit-cy .55s ease-out forwards;
}
@keyframes cg-hit-cy{ 0%{opacity:.75; filter: saturate(1.2) brightness(1.1);} 100%{opacity:0; filter:none;} }

.cg-theme .cg-slot .cg-press-spark{ position:absolute; inset:0; border-radius:16px; pointer-events:none; overflow:hidden; }
.cg-theme .cg-slot .cg-press-spark::before,
.cg-theme .cg-slot .cg-press-spark::after{
  content:""; position:absolute; left:-20%; top:-20%; width:140%; height:140%;
  background:
    linear-gradient(90deg, rgba(0,255,255,.0), rgba(0,255,255,.35), rgba(0,255,255,.0)),
    linear-gradient(0deg, rgba(255,0,215,.0), rgba(255,0,215,.35), rgba(255,0,215,.0));
  filter: blur(10px);
}
.cg-theme .cg-slot .cg-press-spark::before{ transform: rotate(22deg);  animation: cg-spark-cy .6s linear forwards; }
.cg-theme .cg-slot .cg-press-spark::after { transform: rotate(-18deg); animation: cg-spark-cy .6s linear forwards .06s; }
@keyframes cg-spark-cy{ to{ transform: translate(10%,8%) rotate(var(--rot,22deg)); opacity:0; } }

/* 3D tilt highlight on hero cards */
.cg-theme [data-heroname].fx-tilt{
  will-change: transform, filter;
  transform-style: preserve-3d;
  transition: transform .08s linear, filter .15s ease; perspective: 800px;
}
.cg-theme [data-heroname].fx-tilt::after{
  content:""; position:absolute; inset:-20%; pointer-events:none; border-radius:16px; z-index:2;
  background: radial-gradient(700px 200px at var(--lx,50%) var(--ly,0%), rgba(255,255,255,.18), transparent 60%);
  mix-blend-mode: screen; transition: opacity .15s ease; opacity:0;
}
.cg-theme [data-heroname].fx-tilt.fx-tilt-on::after{ opacity:.8; }

/* =========================
   Hero cards, tags, filters
   ========================= */
.cg-theme [data-heroname]{
  transition: transform .18s ease, box-shadow .28s ease, border-color .25s ease, filter .28s ease;
  box-shadow: 0 8px 18px rgba(0,0,0,.45), 0 1px 6px rgba(0,0,0,.28);
  position:relative; overflow:hidden; isolation:isolate;
}
.cg-theme [data-heroname]::before{
  content:""; position:absolute; inset:0; border-radius:16px; pointer-events:none;
  background: conic-gradient(from 180deg at 50% 50%, rgba(122,92,255,.14), rgba(200,255,0,.14), rgba(122,92,255,.14));
  mix-blend-mode:screen; filter: blur(8px); opacity:.9;
}
.cg-theme [data-heroname]::after{
  content:""; position:absolute; inset:-20%; transform: translateX(-120%) rotate(18deg);
  background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,.13) 50%, transparent 70%);
  mix-blend-mode:screen; pointer-events:none;
}
.cg-theme [data-heroname]:hover{
  transform: translateY(-3px) scale(1.035);
  box-shadow: 0 14px 34px rgba(122,92,255,.38), 0 6px 14px rgba(0,0,0,.40);
}
.cg-theme [data-heroname]:hover::after{ animation: cg-cardShine calc(1s/var(--fx-speed)) ease; }
@keyframes cg-cardShine{ to{ transform: translateX(120%) rotate(18deg);} }
.cg-theme [data-heroname] img{ transition: transform .45s cubic-bezier(.2,.8,.2,1), filter .45s ease; }
.cg-theme [data-heroname]:hover img{ transform: scale(1.08); filter: saturate(1.12) brightness(1.08); }

.cg-theme .tag-pick,.cg-theme .tag-ban{
  position:relative; overflow:hidden; font-weight:900; letter-spacing:.5px;
}
.cg-theme .tag-pick{ background: var(--cg-primary); color:#0b0f1a; animation: cg-neonPulse calc(1.8s/var(--fx-speed)) ease-in-out infinite; }
.cg-theme .tag-ban { background: var(--cg-danger);  color:#fff; }
.cg-theme .tag-pick::after,.cg-theme .tag-ban::after{
  content:""; position:absolute; inset:0; pointer-events:none;
  background: linear-gradient(110deg, transparent 20%, rgba(255,255,255,.18) 50%, transparent 80%);
  transform: translateX(-120%);
}
.cg-theme .tag-pick:hover::after,.cg-theme .tag-ban:hover::after{ animation: cg-shine .9s ease; }
@keyframes cg-neonPulse{ 0%,100%{box-shadow:0 0 0 rgba(0,0,0,0), 0 0 0 rgba(0,0,0,0);} 50%{ box-shadow: 0 0 0 2px rgba(122,92,255,.35), 0 0 22px rgba(122,92,255,.45);} }

/* =========================
   ULTRA-PLUS FX (global)
   ========================= */
.cg-theme .cg-fx-stage{
  position: fixed; inset: 0; pointer-events: none;
  z-index: 10060; /* สูงกว่าทุกชั้นที่ใช้ 10020/10040 */
  overflow: visible;
}


.cg-theme .cg-shock{
  position:absolute; left:0; top:0; width:16px; height:16px; transform: translate(-50%,-50%);
  border-radius:50%;
  background: radial-gradient(circle, rgba(200,255,0,.40) 0%, rgba(122,92,255,.30) 38%, transparent 60%);
  mix-blend-mode: screen; filter: blur(2px);
  animation: cg-shock .9s cubic-bezier(.2,.8,.2,1) forwards;
}
@keyframes cg-shock{ 0%{ opacity:.95; transform:translate(-50%,-50%) scale(.25);} 70%{ opacity:.35; } 100%{ opacity:0; transform:translate(-50%,-50%) scale(26); } }

.cg-theme .cg-burst{ position:absolute; left:0; top:0; width:12px; height:12px; transform:translate(-50%,-50%); }
.cg-theme .cg-burst i{
  position:absolute; left:50%; top:50%; width:200px; height:2px; transform-origin:0 50%;
  background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.95), rgba(255,255,255,0));
  mix-blend-mode: screen; opacity:.95; animation: cg-burstRay .8s ease-out forwards;
}
@keyframes cg-burstRay{ 0%{transform:rotate(var(--deg)) scaleX(0);} 100%{transform:rotate(var(--deg)) scaleX(1); opacity:0;} }

.cg-theme .cg-confetti{ position:absolute; left:0; top:0; pointer-events:none; z-index:1000; }
.cg-theme .cg-confetti i{
  position:absolute; width:7px; height:12px; border-radius:2px; transform:translate(-50%,-50%);
  opacity:0; will-change: transform, opacity; animation: cg-conf .9s ease-out forwards;
  background: linear-gradient(135deg, rgba(0,255,255,.95), rgba(255,0,215,.95));
  box-shadow: 0 0 10px rgba(0,255,255,.5), 0 0 14px rgba(255,0,215,.45);
}
@keyframes cg-conf{
  0%  { opacity:1; transform: translate(-50%,-50%) rotate(0deg) scale(1); }
  100%{ opacity:0; transform: translate(calc(var(--dx)*1px), calc(var(--dy)*1px)) rotate(540deg) scale(.9); }
}

.cg-theme .cg-flare{ position:absolute; left:0; top:0; width:1px; height:1px; transform:translate(-50%,-50%); }
.cg-theme .cg-flare::before{
  content:""; position:fixed; inset:-10%;
  background: radial-gradient(ellipse at var(--xvw) var(--yvh), rgba(255,255,255,.12), transparent 40%);
  mix-blend-mode: screen; filter: blur(12px); animation: cg-flareKF 1s ease-out forwards;
}
@keyframes cg-flareKF{ 0%{opacity:0;} 20%{opacity:.7;} 100%{opacity:0;} }

.cg-theme.cg-shake{ animation: cg-shakeKF .45s cubic-bezier(.36,.07,.19,.97) both; }
@keyframes cg-shakeKF{
  10%, 90% { transform: translate3d(-2px, 0, 0); }
  20%, 80% { transform: translate3d( 3px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-6px, 0, 0); }
  40%, 60% { transform: translate3d( 6px, 0, 0); }
}

.cg-theme .cg-glitch{
  position: fixed; inset:0; pointer-events:none; z-index: 998;
  background: repeating-linear-gradient(0deg, rgba(255,255,255,.04) 0 2px, transparent 2px 4px);
  mix-blend-mode: screen; animation: cg-glitchKF .45s steps(2,end) forwards;
}
@keyframes cg-glitchKF{ 0%{opacity:0; filter:hue-rotate(0) saturate(1.2) brightness(1.08);} 30%{opacity:.55;} 100%{opacity:0;} }

.cg-theme .cg-beam{
  position:absolute; left:0; top:0; height:6px; transform-origin:0 50%;
  background: linear-gradient(90deg, rgba(122,92,255,0), rgba(122,92,255,.95), rgba(200,255,0,.95), rgba(122,92,255,0));
  filter: blur(4px);
  box-shadow: 0 0 18px rgba(200,255,0,.5), 0 0 28px rgba(122,92,255,.45);
  animation: cg-beamKF .55s ease-out forwards;
}
@keyframes cg-beamKF{ 0%{opacity:0;} 20%{opacity:1;} 100%{opacity:0;} }

/* Chromatic aberration short */
.cg-theme.cg-ab{
  filter:
    drop-shadow(1px 0 0 rgba(0,255,255,.35))
    drop-shadow(-1px 0 0 rgba(255,0,215,.35))
    saturate(1.12)
    contrast(1.04);
}

/* Overdrive HUD pieces */
.cg-theme .cg-reticle{
  position:absolute; left:0; top:0; width:1px; height:1px; transform:translate(-50%,-50%);
  pointer-events:none; z-index:1001; opacity:1; mix-blend-mode:screen;
  animation: cg-reticle-pop .65s cubic-bezier(.2,.8,.2,1) forwards;
}
.cg-theme .cg-reticle i{
  position:absolute; background: linear-gradient(90deg, rgba(0,255,255,.95), rgba(255,0,215,.95));
  box-shadow: 0 0 8px rgba(0,255,255,.45), 0 0 12px rgba(255,0,215,.35);
}
.cg-theme .cg-reticle .h{ left:-70px; top:-1px; width:140px; height:2px; }
.cg-theme .cg-reticle .v{ left:-1px; top:-70px; width:2px; height:140px; }
.cg-theme .cg-reticle .c1{ left:-42px; top:-42px; width:24px; height:2px; }
.cg-theme .cg-reticle .c2{ right:-42px; top:-42px; width:24px; height:2px; transform-origin:right center; }
.cg-theme .cg-reticle .c3{ left:-42px; bottom:-42px; width:24px; height:2px; }
.cg-theme .cg-reticle .c4{ right:-42px; bottom:-42px; width:24px; height:2px; transform-origin:right center; }
@keyframes cg-reticle-pop{ 0%{ transform:translate(-50%,-50%) scale(.6); opacity:1; } 60%{ opacity:.9; } 100%{ transform:translate(-50%,-50%) scale(2.1); opacity:0; } }

.cg-theme .cg-hex{
  position:absolute; left:0; top:0; width:18px; height:18px; transform:translate(-50%,-50%);
  pointer-events:none; z-index:1000; opacity:.95;
  background: conic-gradient(from 0deg, rgba(0,255,255,.95), rgba(255,0,215,.95), rgba(0,255,255,.95));
  -webkit-mask: radial-gradient(circle, transparent 62%, #000 64%, #000 66%, transparent 68%);
          mask: radial-gradient(circle, transparent 62%, #000 64%, #000 66%, transparent 68%);
  filter: drop-shadow(0 0 12px rgba(0,255,255,.5)) drop-shadow(0 0 16px rgba(255,0,215,.45));
  animation: cg-hex-burst .7s cubic-bezier(.2,.8,.2,1) forwards;
  clip-path: polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%);
}
@keyframes cg-hex-burst{ 0%{ transform:translate(-50%,-50%) scale(.7) rotate(0deg); opacity:1;} 100%{ transform:translate(-50%,-50%) scale(14) rotate(180deg); opacity:0;} }

.cg-theme .cg-circuit{
  position:absolute; left:0; top:0; width:220px; height:220px; transform:translate(-50%,-50%);
  pointer-events:none; z-index:1001; opacity:.95; mix-blend-mode:screen;
  background:
    repeating-linear-gradient(0deg, rgba(0,255,255,.18) 0 2px, transparent 2px 8px),
    repeating-linear-gradient(90deg, rgba(255,0,215,.18) 0 2px, transparent 2px 8px);
  border-radius:18px; filter: blur(.4px);
  animation: cg-circuit-fly .6s ease-out forwards;
}
@keyframes cg-circuit-fly{ 0%{ transform:translate(-50%,-50%) rotate(0deg) scale(.6); opacity:1; } 100%{ transform:translate(-50%,-50%) rotate(22deg) scale(1.6); opacity:0; } }

.cg-theme .cg-pillar{ position:absolute; left:0; top:0; width:1px; height:1px; transform:translate(-50%,-50%); pointer-events:none; z-index:1001; }
.cg-theme .cg-pillar::before,
.cg-theme .cg-pillar::after{
  content:""; position:fixed; width:6px; left:var(--x);
  background: linear-gradient(180deg, rgba(0,255,255,.0), rgba(0,255,255,.85), rgba(0,255,255,.0));
  filter: blur(4px); box-shadow: 0 0 22px rgba(0,255,255,.35), 0 0 22px rgba(255,0,215,.25);
}
.cg-theme .cg-pillar::before{ top:0; height: calc(var(--y));    animation: cg-pillar-up .55s ease-out forwards; }
.cg-theme .cg-pillar::after { top:var(--y); height: calc(100vh - var(--y)); animation: cg-pillar-down .55s ease-out forwards; }
@keyframes cg-pillar-up{ 0%{opacity:0;} 20%{opacity:1;} 100%{opacity:0;} }
@keyframes cg-pillar-down{ 0%{opacity:0;} 20%{opacity:1;} 100%{opacity:0;} }

/* Time vignette */
.cg-theme .cg-vignette{
  position:fixed; inset:0; pointer-events:none; z-index:998;
  background:
    radial-gradient(ellipse at var(--xvw) var(--yvh), rgba(255,255,255,.08), transparent 42%),
    radial-gradient(closest-side, transparent 60%, rgba(0,0,0,.45) 90%),
    repeating-linear-gradient(0deg, rgba(255,255,255,.06) 0 2px, transparent 2px 4px);
  mix-blend-mode:screen; opacity:0; animation: cg-vig .45s ease-out forwards;
}
@keyframes cg-vig{ 0%{opacity:0;} 20%{opacity:.9;} 100%{opacity:0;} }

/* Reduce motion respect */
@media (prefers-reduced-motion: reduce){
  .cg-theme .cg-fx-stage, .cg-theme .cg-fx-stage *{ animation: none !important; }
  .cg-theme, .cg-theme *{ transition: none !important; }
}
/* === Confirm Face Burst — DELUXE === */
.cg-hero-focus {
  position: fixed; inset: 0; z-index: 10028; pointer-events: none;
  background:
    radial-gradient(120vmax 120vmax at var(--xvw,50%) var(--yvh,50%), rgba(0,0,0,.0), rgba(0,0,0,.35) 55%, rgba(0,0,0,.6));
  backdrop-filter: blur(2px) saturate(1.05);
  -webkit-backdrop-filter: blur(2px) saturate(1.05);
  animation: heroFocusIn .18s ease-out, heroFocusOut .35s ease-in 1.15s forwards;
}
@keyframes heroFocusIn   { from{ opacity:0 } to{ opacity:1 } }
@keyframes heroFocusOut  { to  { opacity:0 } }

/* กล่องรูปฮีโร่ (มี streaks + bloom) */
.cg-hero-burst{
  position: fixed; left: 50%; top: 50%; transform: translate(-50%,-50%) scale(.72) rotate(0.0001deg);
  width: min(54vmin, 600px); height: min(54vmin, 600px);
  border-radius: 20px; overflow: hidden; z-index: 10030; pointer-events: none;
  box-shadow:
    0 0 0 2px rgba(255,255,255,.25),
    0 24px 60px rgba(0,0,0,.60),
    0 0 80px rgba(122,92,255,.55);
  mix-blend-mode: screen;
  animation:
    heroIn .35s cubic-bezier(.2,.8,.2,1),
    heroHold .8s ease-out .35s forwards,
    heroOut .55s ease-in 1.15s forwards;
}
.cg-hero-burst img{
  width: 100%; height: 100%; object-fit: cover;
  filter: saturate(1.2) contrast(1.08) brightness(1.02);
  transform: scale(1.06);
}

/* streak วิ่งเฉียง + เคลือบเงา */
.cg-hero-burst::before,
.cg-hero-burst::after{
  content:""; position:absolute; inset:-25%; pointer-events:none; mix-blend-mode: screen;
  background: linear-gradient(105deg, rgba(255,255,255,0) 40%, rgba(255,255,255,.16) 50%, rgba(255,255,255,0) 60%);
  transform: translateX(-55%) rotate(14deg);
  animation: streak 1.1s ease-out .12s forwards;
  filter: blur(0.6px);
}
.cg-hero-burst::after{
  background: linear-gradient(105deg, rgba(122,92,255,0) 40%, rgba(122,92,255,.28) 52%, rgba(200,255,0,.18) 56%, rgba(122,92,255,0) 64%);
  animation-delay: .18s;
}
@keyframes streak { to{ transform: translateX(55%) rotate(14deg); opacity:0; } }

/* รัศมี + shockwave */
.cg-hero-ring{
  position: fixed; left:50%; top:50%; transform: translate(-50%,-50%);
  width: 1px; height: 1px; z-index:10029; pointer-events:none; mix-blend-mode: screen;
}
.cg-hero-ring::before{
  content:""; position:absolute; left:50%; top:50%; transform: translate(-50%,-50%) scale(.1);
  width: 60vmin; height: 60vmin; border-radius:50%;
  background: radial-gradient(closest-side, rgba(255,255,255,.55), rgba(122,92,255,.35) 55%, rgba(200,255,0,.15) 70%, transparent 72%);
  filter: blur(1.2px);
  animation: ringExpand .8s cubic-bezier(.2,.8,.2,1) .06s forwards;
}
@keyframes ringExpand { to{ transform: translate(-50%,-50%) scale(1.04); opacity:0; } }

/* Rays (เส้นแสง) */
.cg-hero-burst-rays{
  position: fixed; left:50%; top:50%; transform:translate(-50%,-50%); width:1px; height:1px;
  pointer-events:none; z-index:10029; mix-blend-mode:screen;
}
.cg-hero-burst-rays i{
  position:absolute; left:0; top:0; width: 340px; height: 2px; transform-origin: 0 50%;
  background: linear-gradient(90deg, rgba(122,92,255,0), rgba(122,92,255,.95), rgba(200,255,0,0));
  filter: blur(.45px); opacity:.97; border-radius:2px;
  animation: heroRay .7s ease-out forwards;
}
@keyframes heroRay{ 0%{transform:rotate(var(--deg)) scaleX(0)} 100%{transform:rotate(var(--deg)) scaleX(1.25); opacity:0} }

/* Nameplate */
.cg-hero-name{
  position: fixed; left:50%; top: calc(50% + min(32vmin, 340px));
  transform: translate(-50%, -50%) translateY(30px);
  font: 800 28px/1 var(--cg-font-head);
  color:#fff; letter-spacing:.6px; text-transform:uppercase;
  padding: 10px 18px; border-radius: 14px;
  background: linear-gradient(180deg, rgba(0,0,0,.55), rgba(0,0,0,.25));
  box-shadow: 0 6px 24px rgba(0,0,0,.45), 0 0 0 1px rgba(255,255,255,.12);
  z-index:10031; pointer-events:none;
  border: 1px solid rgba(255,255,255,.18);
  animation: nameIn .35s cubic-bezier(.2,.8,.2,1) .1s backwards, nameOut .45s ease-in 1.1s forwards;
}
.cg-hero-name b{
  background: linear-gradient(90deg, #fff, #C8FF00, #9B82FF, #fff);
  -webkit-background-clip: text; background-clip: text; color: transparent;
  background-size: 300% 100%; animation: cg-head-grad 6s linear infinite;
  text-shadow: 0 2px 20px rgba(200,255,0,.18);
}

/* keyframes หลักของภาพ */
@keyframes heroIn  {
  0%{ opacity:0; transform: translate(-50%,-50%) scale(.45) rotate(-2deg); filter: blur(8px) saturate(1.1) }
  60%{ opacity:1; transform: translate(-50%,-50%) scale(1.04) rotate(0deg); filter: blur(0px) }
  100%{ opacity:1; transform: translate(-50%,-50%) scale(1) }
}
@keyframes heroHold{
  0%{ transform: translate(-50%,-50%) scale(1) }
  100%{ transform: translate(calc(-50% + .2px), calc(-50% + .2px)) scale(1.02) }
}
@keyframes heroOut {
  0%{ opacity:1; filter: blur(0px) }
  100%{ opacity:0; transform: translate(-50%,-50%) scale(1.18); filter: blur(10px) saturate(1.15) }
}
@keyframes nameIn  { from{ opacity:0; transform: translate(-50%,-50%) translateY(60px) } to{ opacity:1; transform: translate(-50%,-50%) translateY(0) } }
@keyframes nameOut { to  { opacity:0; transform: translate(-50%,-50%) translateY(-10px) } }

/* ลด motion เมื่อผู้ใช้ตั้งค่า */
@media (prefers-reduced-motion: reduce){
  .cg-hero-focus, .cg-hero-burst, .cg-hero-burst-rays i, .cg-hero-ring::before, .cg-hero-name { animation: none !important; }
}

/* === Confirm Face Burst === */
.cg-hero-burst{
  position: fixed; left: 50%; top: 50%; transform: translate(-50%,-50%) scale(.6);
  width: min(46vmin, 520px); height: min(46vmin, 520px);
  border-radius: 18px; overflow: hidden; z-index: 10030; pointer-events: none;
  box-shadow:
    0 0 0 2px rgba(255,255,255,.28),
    0 24px 60px rgba(0,0,0,.55),
    0 0 60px rgba(122,92,255,.45);
  animation: cg-hero-burst-in .18s ease-out, cg-hero-burst-out .55s ease-in .22s forwards;
  mix-blend-mode: screen;
}
.cg-hero-burst img{
  width: 100%; height: 100%; object-fit: cover; filter: saturate(1.18) contrast(1.06);
}
.cg-hero-burst::after{
  content:""; position:absolute; inset:0; background:
    radial-gradient(closest-side, rgba(255,255,255,.22), transparent 66%),
    linear-gradient(110deg, rgba(255,255,255,.12), transparent 60%);
  mix-blend-mode: screen;
}
@keyframes cg-hero-burst-in{ 0%{opacity:0; transform:translate(-50%,-50%) scale(.45)} 100%{opacity:1; transform:translate(-50%,-50%) scale(1)} }
@keyframes cg-hero-burst-out{ to{ opacity:0; transform: translate(-50%,-50%) scale(1.18) } }

/* วงแหวน+รays เสริม */
.cg-hero-burst-rays{
  position: fixed; left:50%; top:50%; transform:translate(-50%,-50%);
  width: 1px; height: 1px; pointer-events:none; z-index:10029; mix-blend-mode:screen;
}
.cg-hero-burst-rays i{
  position:absolute; left:0; top:0; width: 280px; height: 2px; transform-origin: 0 50%;
  background: linear-gradient(90deg, rgba(122,92,255,0), rgba(122,92,255,.95), rgba(200,255,0,0));
  filter: blur(.4px); opacity:.95; animation: cg-hero-ray .55s ease-out forwards;
}
@keyframes cg-hero-ray{ 0%{transform:rotate(var(--deg)) scaleX(0)} 100%{transform:rotate(var(--deg)) scaleX(1.15); opacity:0} }

/* =========================
   SLOT SUMMON FX (Pick/Ban)
   ========================= */
.cg-theme .cg-slot{ position:relative; }
.cg-theme .cg-slot-summon{
  position:absolute; inset:-3px; border-radius:16px; pointer-events:none; z-index:2;
  overflow:hidden; mix-blend-mode:screen;
}
.cg-theme .cg-slot-summon .ring{
  position:absolute; left:50%; top:50%; width:24px; height:24px;
  transform: translate(-50%,-50%) scale(.6); border-radius:50%;
  background:
    radial-gradient(closest-side, rgba(0,255,255,.85), transparent 70%),
    radial-gradient(closest-side, rgba(255,0,215,.75), transparent 72%);
  box-shadow: 0 0 18px rgba(0,255,255,.45), 0 0 24px rgba(255,0,215,.35);
  animation: cg-slot-ring .55s cubic-bezier(.2,.8,.2,1) forwards;
}
@keyframes cg-slot-ring{ 70%{ transform: translate(-50%,-50%) scale(2.8); } 100%{ transform: translate(-50%,-50%) scale(3.4); opacity:0; } }

.cg-theme .cg-slot-summon .hex{
  position:absolute; left:50%; top:50%; width:18px; height:18px;
  transform: translate(-50%,-50%) scale(.6); opacity:.95;
  background: conic-gradient(from 0deg, rgba(0,255,255,.95), rgba(255,0,215,.95), rgba(0,255,255,.95));
  clip-path: polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%);
  filter: drop-shadow(0 0 12px rgba(0,255,255,.5)) drop-shadow(0 0 16px rgba(255,0,215,.45));
  animation: cg-slot-hex .65s cubic-bezier(.2,.8,.2,1) forwards;
}
@keyframes cg-slot-hex{ 60%{ transform: translate(-50%,-50%) scale(5) rotate(120deg); } 100%{ transform: translate(-50%,-50%) scale(6.5) rotate(180deg); opacity:0; } }

.cg-theme .cg-slot-summon .rays i{
  position:absolute; left:50%; top:50%; width:60px; height:2px;
  transform-origin: 0 50%; mix-blend-mode:screen; opacity:.95;
  background: linear-gradient(90deg, rgba(0,255,255,0), rgba(0,255,255,.9), rgba(255,0,215,0));
  filter: blur(.3px); animation: cg-slot-ray .55s ease-out forwards;
}
@keyframes cg-slot-ray{
  0%{ transform: translate(-50%,-50%) rotate(var(--deg)) scaleX(0); }
  100%{ transform: translate(-50%,-50%) rotate(var(--deg)) scaleX(1.2); opacity:0; }
}

.cg-theme .cg-slot-summon .pulse{
  position:absolute; inset:0; border-radius:16px; 
  background:
    radial-gradient(280px 140px at 50% 50%, rgba(0,255,255,.18), transparent 60%),
    radial-gradient(280px 140px at 50% 50%, rgba(255,0,215,.16), transparent 62%);
  animation: cg-slot-pulse .6s ease-out forwards;
}
@keyframes cg-slot-pulse{ to{ opacity:0; transform: scale(1.02);} }

/* Pick variant extras */
.cg-theme .cg-slot-summon.pick .ring{
  background:
    radial-gradient(closest-side, rgba(87,234,231,.85), transparent 70%),
    radial-gradient(closest-side, rgba(200,255,0,.70), transparent 72%);
  box-shadow: 0 0 22px rgba(87,234,231,.45), 0 0 26px rgba(200,255,0,.35);
}
.cg-theme .cg-slot-summon.pick .hex{
  background: conic-gradient(from 0deg, rgba(87,234,231,.95), rgba(200,255,0,.95), rgba(87,234,231,.95));
}
.cg-theme .cg-slot-summon.pick .rays i{
  background: linear-gradient(90deg, rgba(87,234,231,0), rgba(87,234,231,.95), rgba(200,255,0,0));
}
.cg-theme .cg-slot-summon.pick .pulse{
  background:
    radial-gradient(280px 140px at 50% 50%, rgba(87,234,231,.18), transparent 60%),
    radial-gradient(280px 140px at 50% 50%, rgba(200,255,0,.16), transparent 62%);
}
.cg-theme .cg-slot-summon.pick .sparkles{ position:absolute; left:50%; top:50%; }
.cg-theme .cg-slot-summon.pick .sparkles i{
  position:absolute; left:0; top:0; width:6px; height:6px; border-radius:50%;
  transform: translate(-50%,-50%);
  background: radial-gradient(circle, rgba(255,255,255,.95), rgba(255,255,255,0));
  box-shadow: 0 0 12px rgba(87,234,231,.55), 0 0 14px rgba(200,255,0,.45);
  opacity:0; animation: cg-pick-spark .85s ease-out forwards;
}
@keyframes cg-pick-spark{
  0%  { opacity:.95; transform: translate(calc(var(--dx)*.0px), calc(var(--dy)*.0px)) scale(.6); }
  60% { opacity:.7; }
  100%{ opacity:0;   transform: translate(calc(var(--dx)*1px),  calc(var(--dy)*1px))  scale(1.05); }
}

/* Ban variant extras */
.cg-theme .cg-slot-summon.ban .ring{
  background:
    radial-gradient(closest-side, rgba(255,59,71,.85), transparent 70%),
    radial-gradient(closest-side, rgba(255,204,0,.20), transparent 72%);
  box-shadow: 0 0 24px rgba(255,59,71,.55), 0 0 18px rgba(255,204,0,.25);
  animation-duration: .65s;
}
.cg-theme .cg-slot-summon.ban .hex{
  background: conic-gradient(from 0deg, rgba(255,59,71,.95), rgba(255,114,118,.85), rgba(255,59,71,.95));
}
.cg-theme .cg-slot-summon.ban .rays i{
  background: linear-gradient(90deg, rgba(255,59,71,0), rgba(255,59,71,.95), rgba(255,204,0,0));
}
.cg-theme .cg-slot-summon.ban .pulse{
  background:
    radial-gradient(280px 140px at 50% 50%, rgba(255,59,71,.22), transparent 60%),
    radial-gradient(280px 140px at 50% 50%, rgba(255,114,118,.18), transparent 62%);
}
.cg-theme .cg-slot-summon .xslash{
  position:absolute; left:50%; top:50%; width:160%; height:3px;
  transform-origin:50% 50%; transform: translate(-50%,-50%) scaleX(.2);
  background: linear-gradient(90deg, rgba(255,59,71,0), rgba(255,59,71,.95), rgba(255,59,71,0));
  filter: blur(1px);
  box-shadow: 0 0 18px rgba(255,59,71,.55);
  animation: cg-ban-slash .55s cubic-bezier(.2,.8,.2,1) forwards;
}
.cg-theme .cg-slot-summon .xslash.s1{ transform: translate(-50%,-50%) rotate(-36deg) scaleX(.2); }
.cg-theme .cg-slot-summon .xslash.s2{ transform: translate(-50%,-50%) rotate( 36deg) scaleX(.2); animation-delay:.06s; }
@keyframes cg-ban-slash{
  0%{ opacity:.95; } 70%{ opacity:.55; }
  100%{ transform: translate(-50%,-50%) rotate(var(--rot,0deg)) scaleX(1.18); opacity:0; }
}

/* Slot zoom bump */
.cg-theme .cg-slot.cg-slot-zoom{ animation: cg-slot-bounce .45s cubic-bezier(.2,.8,.2,1); filter: brightness(1.06) saturate(1.06); }
@keyframes cg-slot-bounce{ 0%{transform:scale(1);} 50%{transform:scale(1.06);} 100%{transform:scale(1);} }

/* =========================
   Scrollbar
   ========================= */
.cg-theme *::-webkit-scrollbar{ height: 10px; width: 10px; }
.cg-theme *::-webkit-scrollbar-thumb{ background: rgba(255,255,255,.22); border-radius: 10px; }
.cg-theme *::-webkit-scrollbar-thumb:hover{ background: rgba(255,255,255,.30); }

/* =========================
   Accessibility / Motion
   ========================= */
@media (prefers-reduced-motion: reduce){
  .cg-theme .turn-frame.is-on::before,
  .cg-theme .turn-frame.is-on::after,
  .cg-theme .cg-timer.is-danger,
  .cg-theme .countdown-timer.is-danger,
  .cg-theme .cg-timer::before,
  .cg-theme .cg-timer::after{ animation: none !important; }
  .cg-theme .countdown-timer.is-warn{ animation: none !important; }
  .cg-theme .cg-slot-summon,
  .cg-theme .cg-slot.cg-slot-zoom{ animation: none !important; }
}

/* =========================
   Optional: temporarily hide pillars (as in original)
   ========================= */
.cg-theme .cg-pillar,
.cg-theme .cg-pillar::before,
.cg-theme .cg-pillar::after { display: none !important; }

/* =========================
   :root mirror (for JS)
   ========================= */
:root{
  --cg-primary:#7A5CFF; --cg-accent:#C8FF00; --cg-info:#7A6CFF;
  --cg-danger:#FF3B47; --cg-warning:#FFD600; --cg-border:rgba(255,255,255,.16);
  --cg-font-head:"Kanit", system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans Thai", sans-serif;
  --cg-font-sans:"Prompt", system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans Thai", sans-serif;
  --cg-panelA:#2a1b2e; --cg-panelB:#162b2e;
}
`;
   
   
   /* =========================================================
      Utils
      ========================================================= */
   const normalizeText = (s) => (s || '')
     .toString()
     .trim()
     .toLowerCase()
     .replace(/[^\p{L}\p{N}\s\-']/gu, '')
     .replace(/\s+/g, ' ');
   
     const BO_OPTIONS = { BO1:1, BO3:3, BO5:5, BO7:7 };
   // ===== Fuzzy Utils (Thai-friendly) =====
const stripThaiMarks = (s='') =>
  s.normalize('NFC')
   .replace(/[\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]/g, '') // ลบวรรณยุกต์ไทย
   .normalize('NFC');

const canon = (s='') => normalizeText(stripThaiMarks(s));
const tokenize = (s='') => canon(s).split(' ').filter(Boolean);

function spawnHeroConfirmFX(imgSrc, opts = {}) {
  try {
    if (typeof document === 'undefined') return;
    const root  = document.querySelector('.cg-theme') || document.body;
    const stage = root.querySelector('.cg-fx-stage') || ensureFXStage(root);
    stage.style.zIndex = String(Math.max(10060, Number(stage.style.zIndex||0)));

    const center = { x: window.innerWidth/2, y: window.innerHeight/2 };

    // 0) ฉากโฟกัส (dim + spotlight)
    const focus = document.createElement('div');
    focus.className = 'cg-hero-focus';
    focus.style.setProperty('--xvw', '50%');
    focus.style.setProperty('--yvh', '50%');
    stage.appendChild(focus);

    // 1) รูปเด้งกลางจอ (สวยขึ้น)
    const wrap = document.createElement('div');
    wrap.className = 'cg-hero-burst';
    const img = document.createElement('img');
    img.alt = 'hero';
    img.src = imgSrc;
    wrap.appendChild(img);
    stage.appendChild(wrap);

    // 2) วงแหวน shockwave
    const ring = document.createElement('div');
    ring.className = 'cg-hero-ring';
    stage.appendChild(ring);

    // 3) Rays รอบ ๆ
    const rays = document.createElement('div');
    rays.className = 'cg-hero-burst-rays';
    const RAYS = 26;
    for (let i = 0; i < RAYS; i++) {
      const r = document.createElement('i');
      const deg = (360 / RAYS) * i + (Math.random() * 10 - 5);
      r.style.setProperty('--deg', deg + 'deg');
      rays.appendChild(r);
    }
    stage.appendChild(rays);

    // 4) Nameplate (ชื่อฮีโร่—ดึงจากไฟล์ภาพไม่ได้นะ ต้องส่งมาด้วยถ้าต้องการ)
    if (opts.heroName) {
      const plate = document.createElement('div');
      plate.className = 'cg-hero-name';
      plate.innerHTML = `<b>${opts.heroName}</b>`;
      stage.appendChild(plate);
      setTimeout(() => plate.remove(), 1600);
    }

    // 5) FX สั้นเดิม (flare+burst+shake+aberration)
    spawnFlare(stage, center.x, center.y);
    spawnShock(stage, center.x, center.y);
    spawnBurst(stage, center.x, center.y, 22);
    cgCyberAberration?.();
    screenShake?.(root);

    // 6) เสียง whoosh + hit (WebAudio, ไม่ต้องโหลดไฟล์)
    try {
      const AC = window.__cgAudioCtx || new (window.AudioContext || window.webkitAudioContext)();
      window.__cgAudioCtx = AC;
      const t0 = AC.currentTime + 0.01;

      // whoosh = pink-noise + LP sweep
      const noise = AC.createBufferSource();
      const noiseBuf = AC.createBuffer(1, AC.sampleRate * 0.25, AC.sampleRate);
      const ch = noiseBuf.getChannelData(0);
      for (let i=0; i<ch.length; i++) ch[i] = (Math.random()*2-1) * (1/(1+i)); // quick pink-ish
      noise.buffer = noiseBuf;

      const lp = AC.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(400, t0);
      lp.frequency.exponentialRampToValueAtTime(6000, t0 + 0.25);

      const g1 = AC.createGain(); g1.gain.setValueAtTime(0.0001, t0);
      g1.gain.exponentialRampToValueAtTime(0.6, t0 + 0.06);
      g1.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.32);

      noise.connect(lp).connect(g1).connect(AC.destination);
      noise.start(t0); noise.stop(t0 + 0.33);

      // hit = short sine blip
      const osc = AC.createOscillator(); osc.type = 'sine';
      const g2 = AC.createGain();
      osc.frequency.setValueAtTime(320, t0 + 0.05);
      osc.frequency.exponentialRampToValueAtTime(160, t0 + 0.18);
      g2.gain.setValueAtTime(0.0001, t0 + 0.05);
      g2.gain.exponentialRampToValueAtTime(0.4, t0 + 0.08);
      g2.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.25);
      osc.connect(g2).connect(AC.destination);
      osc.start(t0 + 0.05); osc.stop(t0 + 0.26);
    } catch {}

    // เก็บกวาด
    setTimeout(() => { ring.remove(); wrap.remove(); rays.remove(); focus.remove(); }, 1600);
  } catch {}
}
function spawnForcedPickFX(hero, team, count = 1) {
  try {
    const root = document.querySelector('.cg-theme') || document.body;
    const stage = root.querySelector('.cg-fx-stage') || ensureFXStage(root);
    
    // เอฟเฟกต์เตือนการบังคับเลือก
    const warningFX = document.createElement('div');
    warningFX.className = 'cg-forced-pick-warning';
    
    if (count > 1) {
      warningFX.innerHTML = `⏰ FORCED ${count} PICKS!<br>${hero.name} + ${count-1} more`;
    } else {
      warningFX.innerHTML = `⏰ FORCED PICK! ${hero.name}`;
    }
    
    warningFX.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: var(--cg-danger);
      color: white;
      padding: 20px 40px;
      border-radius: 12px;
      font-weight: 900;
      font-size: 24px;
      z-index: 10050;
      animation: forcedPickPulse 0.8s ease-in-out 3;
      box-shadow: 0 0 40px rgba(255,59,71,0.8);
      text-align: center;
      line-height: 1.4;
    `;
    
    stage.appendChild(warningFX);
    
    // เอฟเฟกต์ช็อตไฟฟ้ารอบจอ (แรงขึ้นถ้าเลือกหลายตัว)
    const electricFX = document.createElement('div');
    electricFX.className = 'cg-electric-overlay';
    electricFX.style.cssText = `
      position: fixed;
      inset: 0;
      background: repeating-linear-gradient(
        45deg,
        transparent,
        transparent 10px,
        rgba(255,59,71,${0.1 + (count * 0.05)}) 10px,
        rgba(255,59,71,${0.1 + (count * 0.05)}) 20px
      );
      pointer-events: none;
      z-index: 10049;
      animation: electricFlash 0.5s ease-in-out;
    `;
    
    stage.appendChild(electricFX);
    
    // Confetti พิเศษสำหรับการเลือกหลายตัว
    if (count > 1) {
      spawnConfettiStage(stage, window.innerWidth/2, window.innerHeight/2, 12 * count);
    }
    
    // ลบเอฟเฟกต์หลังจากแสดง
    setTimeout(() => {
      warningFX.remove();
      electricFX.remove();
    }, 3000);
    
  } catch (err) {
    console.error('Forced pick FX error:', err);
  }
}
// คะแนนความใกล้เคียง: เทียบ token ต่อ token
function scoreTokens(queryTokens, hayTokens){
  if (!queryTokens.length) return 0;
  let score = 0;
  for (const q of queryTokens){
    let best = 0;
    for (const h of hayTokens){
      if (h === q)            best = Math.max(best, 8);
      else if (h.startsWith(q)) best = Math.max(best, 6);
      else if (h.includes(q))   best = Math.max(best, 3);
      else if (lev1(h, q))      best = Math.max(best, 1); // edit distance 1
    }
    score += best;
  }
  return score;
}
function lev1(a,b){
  if (Math.abs(a.length-b.length)>1) return false;
  if (a===b) return true;
  const [s,t] = a.length<=b.length ? [a,b] : [b,a];
  let i=0,j=0, edits=0;
  while (i<s.length && j<t.length){
    if (s[i]===t[j]) { i++; j++; continue; }
    edits++; if (edits>1) return false;
    if (s.length===t.length){ i++; j++; }  // replace
    else { j++; }                           // insert in longer
  }
  return (edits + (t.length-j)) <= 1;
}

   /* ใช้ตัวแปรธีมสำหรับไฮไลต์ */ 
   const highlightColor = 'var(--cg-accent)';
   
   const ROLE_ICON = {
     ทั้งหมด:'🌐', Fighter:'⚔️', Mage:'🪄', Assasin:'🗡️',
     Support:'💖', Tank:'🛡️', Carry:'🏹',
   };
   const ROLE_ORDER = ['Carry','Assasin','Mage','Fighter','Tank','Support'];
   const ROLE_BORDER_COLORS = {
     Fighter:'#FF4500', Mage:'#1E90FF', Support:'#FFD700',
     Assasin:'#8B008B', Tank:'#228B22', Carry:'#DA70D6',
   };
   
   const TEAM_TAG = { A:'A', B:'B' };
   
   /* ใช้สีจากธีม: ป้าย PICK/BAN */
   const ACTION_COLOR = { pick:'var(--cg-info)', ban:'var(--cg-danger)' };
   
   /* สีทีมเพื่อชิป PREV (ให้ต่างกันชัด) */
   const TEAM_COLOR = { A:'var(--cg-panelA)', B:'var(--cg-panelB)' };
   
   const getImage = f => `${process.env.PUBLIC_URL}/heroimages/${f}`;
   
   // ===== Module-level constants =====
   const LEFT_TEAM_ID  = 'A';
   const RIGHT_TEAM_ID = 'B';
   
   // ป้ายชื่อทีม
   const teamLabel = (teamId) => (teamId === 'A' ? 'ฝั่งซ้าย' : 'ฝั่งขวา');
   
   // ลำดับคงที่: L/R โดย L = ฝั่งซ้าย(A), R = ฝั่งขวา(B)
   const seqLR = [
     { team:'L', count:1, type:'ban' }, { team:'R', count:1, type:'ban' },
     { team:'L', count:1, type:'ban' }, { team:'R', count:1, type:'ban' },
     { team:'L', count:1, type:'pick' },
     { team:'R', count:2, type:'pick' },
     { team:'L', count:2, type:'pick' },
     { team:'R', count:1, type:'pick' },
     { team:'R', count:1, type:'ban' }, { team:'L', count:1, type:'ban' },
     { team:'R', count:1, type:'ban' }, { team:'L', count:1, type:'ban' },
     { team:'R', count:1, type:'pick' },
     { team:'L', count:2, type:'pick' },
     { team:'R', count:1, type:'pick' },
   ];
   
   /* =========================================================
      2) Overlay ใช้ทับการ์ดที่ถูกใช้แล้ว (ปรับสกินแต่พฤติกรรมเดิม)
      ========================================================= */
   function UsedOverlay({ faint = false }) {
     const color = 'var(--cg-danger)'; // ใช้สีธีม
     const opacity = faint ? 0.6 : 1;
     return (
       <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity }}>
         <div
           style={{
             position: 'absolute',
             left: -8, right: -8, top: '50%',
             height: 4, transform: 'rotate(-36deg)',
             background: color, boxShadow: '0 0 8px #000',
           }}
         />
         <div
           style={{
             position: 'absolute',
             left: -8, right: -8, top: '50%',
             height: 4, transform: 'rotate(36deg)',
             background: color, boxShadow: '0 0 8px #000',
           }}
         />
       </div>
     );
   }
   function fmt(ms){
    const s = Math.max(0, Math.ceil(ms/1000));
    const m = Math.floor(s/60).toString().padStart(2,'0');
    const ss = (s%60).toString().padStart(2,'0');
    return `${m}:${ss}`;
  }
  
  function TurnTimer({
    durationMs = 35000,   // เวลา 1 เทิร์น (กำหนดจากระบบจริง)
    runningKey = 'demo',  // เปลี่ยนค่าตัวนี้เพื่อรีเซ็ตเวลาใหม่เมื่อขึ้นเทิร์น/รอบใหม่
    onExpire,             // callback ถ้าต้องการจับเหตุการณ์หมดเวลา (ไม่บังคับ)
    criticalAtMs = 5000,  // เข้าโหมดแดงเข้ม/สั่น
    warnAtMs = 10000,     // เข้าโหมดเตือน
    mountToToolbarCenter = true, // วาดกลาง toolbar
  }){
    const hostRef = useRef(null);
    const [endAt, setEndAt] = useState(Date.now()+durationMs);
    const [now, setNow] = useState(Date.now());
  
    // รีเซ็ตนาฬิกาเมื่อ runningKey หรือ duration เปลี่ยน
    useEffect(()=>{ setEndAt(Date.now()+durationMs); }, [runningKey, durationMs]); 
    
    // tick 10Hz เพื่อให้ progress ลื่น
    useEffect(()=>{
      let rafId, tId;
      const tick = ()=>{ setNow(Date.now()); rafId = requestAnimationFrame(tick); };
      tId = setTimeout(tick, 0);
      return ()=>{ clearTimeout(tId); cancelAnimationFrame(rafId); };
    },[]);
  
    const msLeft = Math.max(0, endAt - now);
    const ratio = 1 - (msLeft / durationMs);
    const percent = `${Math.min(100, Math.max(0, ratio*100)).toFixed(2)}%`;
  
    const isWarn    = msLeft <= warnAtMs && msLeft > criticalAtMs;
    const isDanger  = msLeft <= criticalAtMs;
    const cls = `cg-timer ${isWarn ? 'is-warn' : ''} ${isDanger ? 'is-danger' : ''}`;
  
    // อัปเดต CSS var ความกว้าง progress
    useEffect(()=>{
      if (!hostRef.current) return;
      hostRef.current.style.setProperty('--p', percent);
    }, [percent]);
  
    // หมดเวลา → แจ้งเตือน (ถ้าต้องการ)
    useEffect(()=>{
      if (msLeft === 0 && onExpire) onExpire();
    }, [msLeft, onExpire]);
  
    // เข้าโซนอันตราย → เขย่าหน้า (ใช้คลาสจากธีมเดิม .cg-shake)
    // เพิ่ม flash เบา ๆ (ใช้เลเยอร์ที่ธีมเตรียมไว้)
useEffect(()=>{
  if (!isDanger) return;
  const fx = document.createElement('div');
  fx.className = 'cg-glitch';
  document.body.appendChild(fx);
  const id = setTimeout(()=> fx.remove(), 450);
  return ()=> { clearTimeout(id); fx.remove(); };
}, [isDanger]);

  
    const timerNode = (
      <div className="cg-timer-wrap" aria-live="polite">
        <div className={cls} ref={hostRef}>
          <span className="ico">⏱️</span>
          <span className="t">{fmt(msLeft)}</span>
        </div>
      </div>
    );
  
    if (mountToToolbarCenter) return timerNode; // วาดตรง toolbar (ตำแหน่ง container คุมโดย CSS)
    return <div style={{position:'relative'}}>{timerNode}</div>;
  }
  
   /* =========================================================
      3) Normalizers (บทบาท)
      ========================================================= */
   function normalizeRole(role) {
     const s = (role||'').toString().trim().toLowerCase();
     if (['assassin','assasin'].includes(s)) return 'Assasin';
     if (s==='marksman'||s==='carry') return 'Carry';
     if (s==='tank') return 'Tank';
     if (s==='fighter') return 'Fighter';
     if (s==='mage') return 'Mage';
     if (s==='support') return 'Support';
     return role||'Unknown';
   }
   
   /* =========================================================
      5) คอมโพเนนต์หลัก
      ========================================================= */
      // [MOD] ใน signature ของ DraftPage:
export default function DraftPage({
  games, heroes = heroList, onAction,
  startBoType, waitForHost = false, readOnly = false,
  externalFeed,
  lockedTeam = null,
  enableConfirm = true,   // [NEW] เปิด/ปิดโหมดกดยืนยัน (แนะนำเปิด)
  roomCode = 'default',         // ห้องสำหรับ bus (ข้ามแท็บ)
  autoWire = true,            // ให้ DraftPage autowire bus เองถ้าไม่ได้ส่ง onAction/externalFeed มา
}) {

     const navigate = useNavigate();
     const heroRefs = useRef({});
   
     /* --- A) PRE-CHOOSE --- */
     const [preChoose,setPreChoose] = useState({ A:[null,null,null,null,null], B:[null,null,null,null,null] });
     const [selectingPre,setSelectingPre] = useState(null);

   // [NEW] ไว้โซน E) DRAFT STATE ใกล้ ๆ bans/picks
   const [pending, setPending] = useState({ A: [], B: [] });

     /* --- B) SIDE COLOR (fixed) --- */
     const teamARole = 'red'; // ใช้เป็นธีมสีเท่านั้น (ไม่แตะลอจิก)
   
     /* --- D) SERIES --- */
     const [boType,setBoType] = useState(null);
     const [currentGame,setCurrentGame] = useState(1);
     const [globalPicks,setGlobalPicks] = useState({ A:[], B:[] });
     const [completedGames,setCompletedGames] = useState([]);
     const [viewingHistory,setViewingHistory] = useState(null);
   
     /* --- E) DRAFT STATE --- */
     const [stepIndex,setStepIndex] = useState(0);
     const [selectionCount,setSelectionCount] = useState(0);
     const [bans,setBans] = useState({ A:[], B:[] });
     const [picks,setPicks] = useState({ A:[], B:[] });
     const [history,setHistory] = useState([]);
   
     const [alertMsg,setAlertMsg] = useState('');
     const [selectedRole,setSelectedRole] = useState('ทั้งหมด');
     const [searchTerm,setSearchTerm] = useState('');
     const [onlyActionable, setOnlyActionable] = useState(false);
    const [hideUsed, setHideUsed] = useState(true);

   
     const totalGames = boType ? BO_OPTIONS[boType] : 0;
     // ใช้เป็น derived state กลาง ให้ทุกที่เรียกได้
const isFinalGame = !!boType && currentGame === BO_OPTIONS[boType];
const isFinalBO7  = boType === 'BO7' && isFinalGame;

     /* --- F) DRAG/DROP core flags --- */
     const [isDragging,setIsDragging] = useState(false);
     const dragVisitedRef = useRef(new Set());
     const pointerDownRef = useRef({ down:false,x:0,y:0,startedOn:null });
     const suppressClickRef = useRef(false);
     const DRAG_THRESHOLD = 6, TOUCH_THRESHOLD = 9;
   
     const [dragHero,setDragHero] = useState(null);
      const getHeroFromDrop = e => {
         if (dragHero) return dragHero;
         const name = e.dataTransfer?.getData?.('text/plain');
         if (!name) return null;
         // หาฮีโร่จาก heroes โดยตรง (ปลอดภัยจาก TDZ)
         return heroes.find(h => h.name === name) || null;
       };
   
     /* --- G) LAYOUT / VIEW --- */
     const [banLayout,setBanLayout] = useState('horizontal');
     const [viewMode] = useState('both');
     const [manualViewTeam] = useState('A');
   
     /* --- H) DRAFT MODE --- */
     const [draftMode, setDraftMode] = useState('sequence'); // 'sequence' | 'free'
     const [freeAction, setFreeAction] = useState('pick');   // 'pick' | 'ban'
     const [freeFocusTeam, setFreeFocusTeam] = useState('A');
   
     // ระบุว่า “ทีมเรา” ตอนนี้เป็น First หรือ Second (ปุ่มวิทยุที่หัวหน้าแถบ)
     const [weAreFirst, setWeAreFirst] = useState(true);
     const ourTeam = useMemo(() => (weAreFirst ? 'A' : 'B'), [weAreFirst]);

     /* =========================================================
        6) ล็อก "คิวเริ่มฝั่งซ้ายเสมอ" + สลับข้อมูลเมื่อกด FS/Second
        ========================================================= */
     const draftSeq = useMemo(() => {
       const L = LEFT_TEAM_ID;
       const R = RIGHT_TEAM_ID;
       return seqLR.map(s => ({ ...s, team: s.team === 'L' ? L : R }));
     }, []);
   
     const totalSteps = draftSeq.length;
     const currentStep = draftSeq[stepIndex] || {};
     const { team:highlightTeamSeq, type:highlightTypeSeq, count:highlightCountSeq } = currentStep;
   
     const highlightTeam   = (draftMode==='free') ? null : highlightTeamSeq;
     const highlightType   = (draftMode==='free') ? null : highlightTypeSeq;
     const highlightCount  = (draftMode==='free') ? 0    : highlightCountSeq;
     const highlightStartIndex = useMemo(()=>(
       draftSeq.slice(0,stepIndex)
         .filter(s=>s.team===highlightTeamSeq && s.type===highlightTypeSeq)
         .reduce((sum,s)=>sum+s.count,0)
     ),[draftSeq,stepIndex,highlightTeamSeq,highlightTypeSeq]);
     const opTeamForPanel = useMemo(() => (
      lockedTeam ||
      (draftMode === 'sequence' ? (currentStep?.team || 'A') : (freeFocusTeam || 'A'))
    ), [lockedTeam, draftMode, currentStep, freeFocusTeam]);
    
    const pendingCount = (pending?.[opTeamForPanel] || []).length;
    useEffect(() => {
      const roles = ROLE_ORDER; // ['Carry','Assasin','Mage','Fighter','Tank','Support']
      const onNum = (e) => {
        if (/^[1-6]$/.test(e.key)) {
          const idx = Number(e.key) - 1;
          if (roles[idx]) setSelectedRole(roles[idx]);
        }
      };
      window.addEventListener('keydown', onNum);
      return () => window.removeEventListener('keydown', onNum);
    }, []);
    
    // 🆕 เมื่อมี pending โผล่มา (จาก 0 → >0) ให้จัดกลางจอ
    const prevPendingRef = useRef(0);
    useEffect(() => {
      if (pendingCount > 0 && prevPendingRef.current === 0) {
        // รอให้ DOM วัดขนาดพาเนิลได้ก่อนแล้วค่อยจัดกลาง
        requestAnimationFrame(() => centerConfirmPanel());
      }
      prevPendingRef.current = pendingCount;
    }, [pendingCount]);
    // ด้านบนคอมโพเนนต์
const audioCtxRef = React.useRef(
  (window.AudioContext || window.webkitAudioContext)
    ? new (window.AudioContext || window.webkitAudioContext)()
    : null
);

React.useEffect(() => {
  const onFirstGesture = async () => {
    try { if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') await audioCtxRef.current.resume(); }
    catch {}
    finally {
      window.removeEventListener('pointerdown', onFirstGesture);
      window.removeEventListener('keydown', onFirstGesture);
    }
  };
  window.addEventListener('pointerdown', onFirstGesture, { once: true });
  window.addEventListener('keydown', onFirstGesture,  { once: true });
  return () => {
    window.removeEventListener('pointerdown', onFirstGesture);
    window.removeEventListener('keydown',  onFirstGesture);
  };
}, []);


     // ถ้ามี prop roomCode ก็ใช้เลย; ถ้าไม่มี ให้ตั้งเป็น 'global'
const room = (typeof roomCode === 'string' && roomCode) ? roomCode : 'default';
const busRef = React.useRef(null);

React.useEffect(() => {
  const bus = new LocalBus(room);
  busRef.current = bus;

   const toSeconds = (v) => {
       if (v == null) return 0;
       if (typeof v === 'string') {
         // รองรับ "0:30" หรือ "30"
         if (v.includes(':')) {
           const [m, s] = v.split(':').map(n => parseInt(n || '0', 10));
           return (isNaN(m)?0:m)*60 + (isNaN(s)?0:s);
         }
         const n = parseFloat(v);
         return isNaN(n) ? 0 : n;
       }
       if (typeof v === 'number') return v;
       return 0;
     };
    
     const normalizeAction = (raw) => {
       const a = raw || {};
       const t =
         (a.type ?? a.cmd ?? a.action ?? '').toString().toLowerCase();
       const sec =
         toSeconds(a.seconds ?? a.sec ?? a.value ?? (a.ms!=null ? a.ms/1000 : undefined));
       const kind = (a.for ?? a.kind ?? a.which ?? '').toString().toLowerCase(); // 'ban'|'pick'
       if (!t) return null;
       if (t === 'pause')  return { type:'pause' };
       if (t === 'resume') return { type:'resume' };
       if (t === 'timeradd' || t === '+') return { type:'timerAdd', seconds: sec };
       if (t === 'timerset' || t === 'set' || t === 'draft') return { type:'timerSet', seconds: sec };
       if (t === 'setbaseduration' || t === 'baseduration' || t === 'base') {
         return { type:'setBaseDuration', for: (kind==='ban'?'ban':'pick'), seconds: sec };
       }
       if (t === 'skip' || t === 'forceskip') return { type:'skip' };
       if (t === 'undo') return { type:'undo' };
       return null;
     };
    
     const handleMessage = (msg) => {
       // รูปแบบมาตรฐานของเรา
       if (msg?.type === RoomEvent.ACTION) {
         const act = msg.payload ?? msg.data ?? null;
         const norm = normalizeAction(act) ?? act;
         // debug
         // console.log('[DraftPage] ACTION from bus:', msg, '→', norm);
         if (norm) applyExternalAction(norm);
         return;
       }
       // เผื่อคอนโซลส่ง action มา "ตรง ๆ" (ไม่มี wrapper ACTION)
       const raw = msg?.payload ?? msg?.data ?? msg;
       const norm = normalizeAction(raw);
       if (norm) {
         // console.log('[DraftPage] RAW action from bus:', msg, '→', norm);
         applyExternalAction(norm);
         return;
       }
       // pause/resume แบบ event ตรง
       if (msg?.type === RoomEvent.PAUSE || msg === 'PAUSE')  { setIsPaused(true);  return; }
       if (msg?.type === RoomEvent.RESUME|| msg === 'RESUME') { setIsPaused(false); return; }
     };
    
     const unsub = bus.subscribe(handleMessage);

  return () => { unsub?.(); bus.dispose(); };
}, [room]);


 // onAction ที่จะถูกใช้จริง
 const onActionEffective = React.useMemo(() => {
   if (onAction) return onAction; // มีคนนอกจัดการให้แล้ว
   if (!autoWire || !busRef.current) return undefined;
   return (evt) => {
     // ให้ DraftPage ส่งอีเวนต์ออก bus → จะเด้งกลับเข้ามา applyExternalAction ผ่าน externalFeedEffective ด้านล่าง
     busRef.current.publish({ type: RoomEvent.ACTION, payload: evt });
   };
 }, [onAction, autoWire]);

 // externalFeed ที่จะถูกใช้จริง
 const externalFeedEffective = React.useMemo(() => {
   if (externalFeed) return externalFeed; // มีคนนอกป้อนมาแล้ว
   if (!autoWire || !busRef.current) return undefined;
   return {
     on(handler) {
       // subscribe แล้วส่ง payload ตรง ๆ ให้ DraftPage
       return busRef.current.subscribe((msg) => {
         if (msg?.type === RoomEvent.ACTION) handler(msg.payload);
       });
     }
   };
 }, [externalFeed, autoWire]);
 React.useEffect(() => {
  try {
    if (typeof HTMLMediaElement !== 'undefined') {
      const origPlay = HTMLMediaElement.prototype.play;
      if (origPlay && !HTMLMediaElement.prototype.__cgPatched) {
        HTMLMediaElement.prototype.play = function(...args) {
          try {
            const p = origPlay.apply(this, args);
            if (p && typeof p.catch === 'function') p.catch(()=>{ /* ignore autoplay block */ });
            return p;
          } catch { return Promise.resolve(); }
        };
        HTMLMediaElement.prototype.__cgPatched = true;
      }
    }
  } catch {}
}, []);

 // (ออปชัน) โยน bus ไว้ให้ devtools
 React.useEffect(() => { if (busRef.current) window.__cgBus = busRef.current; }, []);

   // === TIMER states ===
const [isPaused, setIsPaused] = useState(false);
const [baseDurations, setBaseDurations] = useState({ ban: 40, pick: 60 }); // ปรับได้จาก Console
const [turnSecondsLeft, setTurnSecondsLeft] = useState(0);
const timerRef = useRef(null);
const lastTickRef = useRef(null);
// NEW: เก็บ Timer Settings (ใช้กับ APPLY)
const [timerSettings, setTimerSettings] = useState({ perAction: 30, reserve: 120 });
// === Floating Confirm Panel (UI only) ===
// === Floating Confirm Panel (UI only) ===
const confirmRef = useRef(null);
// ==== [TIMER_DOCK] Floating/Docked state ====
const [timerDock, setTimerDock] = React.useState(() => {
  try {
       const saved = JSON.parse(localStorage.getItem('cgTimerDock') || 'null');
   if (saved) return saved;
   const tb = (typeof window !== 'undefined') ? getToolbarBottom() : 0;
   return { mode: 'floating', x: 16, y: Math.max(12, Math.ceil(tb + 12)) };
  } catch { 
    const tb = (typeof window !== 'undefined') ? getToolbarBottom() : 0;
   return { mode: 'floating', x: 16, y: Math.max(12, Math.ceil(tb + 12)) }; 
  }
});

const timerDockRef = React.useRef(null);
const timerDragRef = React.useRef({ dragging:false, ox:0, oy:0 });

React.useEffect(() => {
  try { localStorage.setItem('cgTimerDock', JSON.stringify(timerDock)); } catch {}
}, [timerDock]);

function onTimerPointerDown(e){
  const el = timerDockRef.current; if (!el) return;
  const r  = el.getBoundingClientRect();
  const cx = e.clientX ?? e.touches?.[0]?.clientX ?? r.left;
  const cy = e.clientY ?? e.touches?.[0]?.clientY ?? r.top;
  timerDragRef.current = { dragging:true, ox: cx - r.left, oy: cy - r.top };
  window.addEventListener('pointermove', onTimerPointerMove, { passive:true });
  window.addEventListener('pointerup',   onTimerPointerUp,   { passive:true });
}
function onTimerPointerMove(e){
  if (!timerDragRef.current.dragging) return;
  const el = timerDockRef.current; if (!el) return;
  const w = window.innerWidth, h = window.innerHeight;
  const pw = el.offsetWidth,  ph = el.offsetHeight;
  let nx = (e.clientX ?? 0) - timerDragRef.current.ox;
  let ny = (e.clientY ?? 0) - timerDragRef.current.oy;
   // ไม่ให้ทับ toolbar
 const toolbarBottom = getToolbarBottom();
 const minY = Math.max(8, Math.ceil(toolbarBottom + 8));
  // กันหลุดขอบ
  nx = Math.min(Math.max(8, nx), w - pw - 8);
 ny = Math.min(Math.max(minY, ny), h - ph - 8);
    setTimerDock(d => ({ ...d, x: nx, y: ny }));
}
function onTimerPointerUp(){
  timerDragRef.current.dragging = false;
   // ถ้า panel ชน/ทับ toolbar → เปลี่ยนโหมดเป็น docked
 try{
   const el = timerDockRef.current; if (el){
     const r = el.getBoundingClientRect();
     const tb = document.querySelector('[data-role="toolbar"], .cg-theme .toolbar, .toolbar');
     if (tb){
       const tr = tb.getBoundingClientRect();
       const overlapY = r.top < tr.bottom && r.bottom > tr.top;
       const overlapX = r.left < tr.right && r.right > tr.left;
       if (overlapX && overlapY){
         setTimerDock(d => ({ ...d, mode:'docked' }));
       }
     }
   }
 }catch{}
  window.removeEventListener('pointermove', onTimerPointerMove);
  window.removeEventListener('pointerup',   onTimerPointerUp);
}
const dragStateRef = useRef({ dragging:false, ox:0, oy:0, ex:0, ey:0 });
const [floatPos, setFloatPos] = useState({ x: 0, y: 0 });

// 🆕 จัดพาเนิลให้อยู่กลางจอ
function centerConfirmPanel() {
  const el = confirmRef.current;
  const w = window.innerWidth, h = window.innerHeight;
  const pw = el?.offsetWidth  ?? 320;
  const ph = el?.offsetHeight ?? 96;
  setFloatPos({
    x: Math.max(8, Math.floor((w - pw) / 2)),
    y: Math.max(12, Math.floor((h - ph) / 2)),
  });
}

// ตั้งต้นให้อยู่กลางจอ
useEffect(() => {
  centerConfirmPanel();
}, []);
// รีไซซ์หน้าต่าง → re-clamp ให้ใต้ toolbar เสมอ
useEffect(() => {
  function onResize(){
    setTimerDock(p => {
      const el = timerDockRef.current;
      const w = window.innerWidth, h = window.innerHeight;
      const pw = el?.offsetWidth  ?? 260;
      const ph = el?.offsetHeight ?? 60;
      const tb = getToolbarBottom();
      const minY = Math.max(8, Math.ceil(tb + 8));
      return {
        ...p,
        x: Math.min(Math.max(8, p.x), w - pw - 8),
        y: Math.min(Math.max(minY, p.y), h - ph - 8),
      };
    });
  }
  window.addEventListener('resize', onResize);
  return () => window.removeEventListener('resize', onResize);
}, []);

// migrate: ถ้า y เก่าอยู่เหนือ/ทับ toolbar ให้ดันลงอัตโนมัติ (ครั้งแรก)
useEffect(() => {
  setTimerDock(d => {
    const tb = getToolbarBottom();
    const minY = Math.max(8, Math.ceil(tb + 8));
    if (d.mode === 'floating' && d.y < minY) return { ...d, y: minY };
    return d;
  });
  // เผื่อฟอนต์/เลย์เอาต์โหลดแล้วขนาด toolbar เปลี่ยนเล็กน้อย
  setTimeout(() => {
    setTimerDock(d => {
      const tb = getToolbarBottom();
      const minY = Math.max(8, Math.ceil(tb + 8));
      if (d.mode === 'floating' && d.y < minY) return { ...d, y: minY };
      return d;
    });
  }, 300);
}, []);

// อัปเดตตำแหน่งเมื่อปรับขนาดหน้าต่าง (คงให้อยู่ในเฟรม ไม่ออกนอกจอ)
useEffect(() => {
  function onResize(){
    setFloatPos(p => {
      const el = confirmRef.current;
      const w = window.innerWidth, h = window.innerHeight;
      const pw = el?.offsetWidth  ?? 320;
      const ph = el?.offsetHeight ?? 96;
      const tb = getToolbarBottom();
      const minY = Math.max(8, Math.ceil(tb + 8));
      return {
        x: Math.min(Math.max(8, p.x), w - pw - 8),
        y: Math.min(Math.max(minY, p.y), h - ph - 8),
      };
    });
  }
  window.addEventListener('resize', onResize);
  return () => window.removeEventListener('resize', onResize);
}, []);

// ลากย้ายตำแหน่ง
function onConfirmPanelPointerDown(e){
  const el = confirmRef.current; if (!el) return;
  const rect = el.getBoundingClientRect();
  const cx = e.clientX ?? e.touches?.[0]?.clientX ?? rect.left;
  const cy = e.clientY ?? e.touches?.[0]?.clientY ?? rect.top;
  dragStateRef.current = {
    dragging: true,
    ox: cx - rect.left,
    oy: cy - rect.top,
    ex: rect.left,
    ey: rect.top,
  };
  window.addEventListener('pointermove', onConfirmPanelPointerMove, { passive: true });
  window.addEventListener('pointerup', onConfirmPanelPointerUp, { passive: true });
}

function onConfirmPanelPointerMove(e){
  if (!dragStateRef.current.dragging) return;
  const el = confirmRef.current; if (!el) return;
  const w = window.innerWidth, h = window.innerHeight;
  const pw = el.offsetWidth, ph = el.offsetHeight;
  const cx = e.clientX ?? 0, cy = e.clientY ?? 0;
  let nx = cx - dragStateRef.current.ox;
  let ny = cy - dragStateRef.current.oy;
  // กันหลุดขอบ
  nx = Math.min(Math.max(8, nx), w - pw - 8);
  ny = Math.min(Math.max(8, ny), h - ph - 8);
  setFloatPos({ x: nx, y: ny });
}

function onConfirmPanelPointerUp(){
  dragStateRef.current.dragging = false;
  window.removeEventListener('pointermove', onConfirmPanelPointerMove);
  window.removeEventListener('pointerup', onConfirmPanelPointerUp);
}

// duration ของ "หนึ่งการกระทำ" ในเทิร์นปัจจุบัน (เฉพาะโหมด sequence)
const currentTurnDuration = useMemo(() => {
  if (draftMode !== 'sequence' || !currentStep?.type) return 0;
  return currentStep.type === 'ban' ? baseDurations.ban : baseDurations.pick;
}, [draftMode, currentStep, baseDurations]);

// key สำหรับรีเซ็ต timer เมื่อ “อยู่ในสเต็ปเดิม แต่เป็นการกระทำลำดับที่ 2 ของสเต็ป” เป็นต้น
const turnKey = `${stepIndex}:${selectionCount}`;
     const FIRST_PICK_TEAM = LEFT_TEAM_ID;
   
     function swapTeamsState() {
       setPicks(p => ({ A: [...p.B], B: [...p.A] }));
       setBans (b => ({ A: [...b.B], B: [...b.A] }));
       setPreChoose(pc => ({ A: [...pc.B], B: [...pc.A] }));
       setGlobalPicks(g => ({ A: [...g.B], B: [...g.A] }));
       setHistory(h => h.map(x => ({ ...x, team: x.team === 'A' ? 'B' : 'A' })));
     }
     const mountedRef = useRef(false);
     useEffect(() => {
       if (!mountedRef.current) {
         mountedRef.current = true;
         return;
       }
       swapTeamsState();
     }, [weAreFirst]);
     // === APPLY REAL-TIME EVENTS (จากแท็บอื่น/ห้องเดียวกัน) ===
      useEffect(() => {
         const feed = externalFeedEffective;
         if (!feed || typeof feed.on !== 'function') return;
         const off = feed.on((evt) => applyExternalAction(evt));
         return off;
       }, [externalFeedEffective]);


     /* ================================================
        PART 2 — Global Pointer + Derived States
        ================================================ */
   
     function resetHoverDrag() {
       setIsDragging(false);
       dragVisitedRef.current.clear();
       pointerDownRef.current = { down:false,x:0,y:0,startedOn:null };
       setTimeout(()=>{ suppressClickRef.current = false; },0);
     }
   
     useEffect(()=>{
       const onMove = e=>{
         if (!pointerDownRef.current.down||isDragging) return;
         const x = e.clientX??0, y = e.clientY??0;
         const dx = x-pointerDownRef.current.x, dy = y-pointerDownRef.current.y;
         if ((dx*dx+dy*dy) > DRAG_THRESHOLD*DRAG_THRESHOLD) {
           setIsDragging(true); suppressClickRef.current = true;
         }
       };
       const onTouchMove = e=>{
         if (!pointerDownRef.current.down||isDragging) return;
         const t = e.touches?.[0]; if (!t) return;
         const dx = t.clientX-pointerDownRef.current.x, dy = t.clientY-pointerDownRef.current.y;
         if ((dx*dx+dy*dy) > TOUCH_THRESHOLD*TOUCH_THRESHOLD) {
           setIsDragging(true); suppressClickRef.current = true;
         }
       };
       const clear=()=>{
         setIsDragging(false);
         dragVisitedRef.current.clear();
         pointerDownRef.current = { down:false,x:0,y:0,startedOn:null };
         setTimeout(()=>{ suppressClickRef.current=false; },0);
       };
       const touchMoveOpts = { passive:false };
       window.addEventListener('mousemove',onMove);
       window.addEventListener('mouseup',clear);
       window.addEventListener('touchmove',onTouchMove,touchMoveOpts);
       window.addEventListener('touchend',clear);
       const onDragEndGlobal = ()=>resetHoverDrag();
       window.addEventListener('dragend',onDragEndGlobal);
       window.addEventListener('drop',onDragEndGlobal);
       return ()=>{
         window.removeEventListener('mousemove',onMove);
         window.removeEventListener('mouseup',clear);
         window.removeEventListener('touchmove',onTouchMove,touchMoveOpts);
         window.removeEventListener('touchend',clear);
         window.removeEventListener('dragend',onDragEndGlobal);
         window.removeEventListener('drop',onDragEndGlobal);
       };
     },[isDragging]);
   
     /* View focus (ยังมีโครง แต่โหมดที่ใช้คือ both) */
     const focusedTeam = useMemo(()=>{
       if (viewMode==='manual') return manualViewTeam;
       if (viewMode==='focusTurn') {
         return (draftMode==='free') ? freeFocusTeam : (currentStep?.team || 'A');
       }
       return null; // both
     }, [viewMode, manualViewTeam, currentStep, draftMode, freeFocusTeam]);
   
     /* -----------------------------
        USED / FILTERED HEROES
        ----------------------------- */
     const localUsed = useMemo(()=>(
       [...bans.A,...bans.B,...picks.A,...picks.B].map(h=>h.name)
     ),[bans,picks]);
   
     const roleList = useMemo(()=>(
       ['ทั้งหมด',...ROLE_ORDER.filter(r=>heroes.some(h=>normalizeRole(h.role)===r))]
     ),[heroes]);
     const searchIndex = useMemo(() => {
      return heroes.map(h => {
        const fields = [h.name, h.role, ...(h.aliases||[]), ...(h.tags||[])].filter(Boolean);
        const tokens = fields.flatMap(tokenize);
        return { hero: h, tokens };
      });
    }, [heroes]);
     // โทเคนของ query
const queryTokens = useMemo(() => tokenize(searchTerm), [searchTerm]);

// กรองตาม role + จัดอันดับด้วย fuzzy score
const filteredHeroList = useMemo(() => {
  let base = selectedRole==='ทั้งหมด'
    ? heroes
    : heroes.filter(h => normalizeRole(h.role)===selectedRole);

  if (!queryTokens.length) return base;

  const scores = new Map();
  for (const item of searchIndex){
    if (!base.includes(item.hero)) continue;
    const s = scoreTokens(queryTokens, item.tokens);
    if (s>0) scores.set(item.hero.name, s);
  }
  base = base.filter(h => scores.has(h.name));
  return base.sort((a,b) => (scores.get(b.name)-scores.get(a.name)) || a.name.localeCompare(b.name));
}, [heroes, selectedRole, queryTokens, searchIndex]);

// คง block ตาม ROLE_ORDER
const sortedHeroList = useMemo(() => {
  let arr = [];
  ROLE_ORDER.forEach(role => {
    const chunk = filteredHeroList.filter(h => normalizeRole(h.role)===role);
    arr = arr.concat(chunk);
  });
  return arr;
}, [filteredHeroList]);
   
      const heroMap = useMemo(()=>{
         const m = new Map();
         heroes.forEach(h=>m.set(h.name,h));
         return m;
       },[heroes]);
       const filteredHeroList2 = useMemo(()=>{
        let list = [...sortedHeroList];
        if (hideUsed){
          const used = new Set(localUsed);
          list = list.filter(h => !used.has(h.name));
        }
        if (onlyActionable){
          if (draftMode==='free'){
            const t = lockedTeam || freeFocusTeam;
            const ty = freeAction;
            list = list.filter(h => actionableFor(h, t, ty));
          }else{
            const step = currentStep;
            if (step?.team && step?.type){
              list = list.filter(h => actionableFor(h, step.team, step.type));
            }
          }
        }
        return list;
      }, [sortedHeroList, hideUsed, onlyActionable, draftMode, lockedTeam, freeFocusTeam, freeAction, currentStep, localUsed]);
       /* PREV PICK (แบบย่อ) — ใช้เฉพาะฝั่งเรา/เขา */
     const prevPickedByRole = useMemo(()=>{
      const ours = new Set();
      const opps = new Set();
      for (const g of completedGames) {
        if (!g) continue;
        const ourAtGame = g.meta?.ourTeamAtGame ?? 'A';
        const oppAtGame = ourAtGame === 'A' ? 'B' : 'A';
        (g.picks?.[ourAtGame] || []).forEach(h=> h?.name && ours.add(h.name));
        (g.picks?.[oppAtGame] || []).forEach(h=> h?.name && opps.add(h.name));
      }
      return { ours, opps };
    }, [completedGames]);
      const recommended = useMemo(()=>{
        if (draftMode==='free') return [];
        const t = currentStep?.team, ty = currentStep?.type;
        if (!t || !ty) return [];
      
        const have = new Set((picks[t]||[]).map(h=>normalizeRole(h.role)));
        const needRoleWeight = (h)=> have.has(normalizeRole(h.role)) ? 0 : 2;
      
        const used = new Set(localUsed);
        const isFinal = !!boType && currentGame === BO_OPTIONS[boType];
        const blockedGlobal = (h)=> ty==='pick' && globalPicks[t].includes(h.name) && !isFinalBO7;
      
        const prevSet = (t===ourTeam) ? prevPickedByRole.ours : prevPickedByRole.opps;
      
        const cand = (filteredHeroList2.length ? filteredHeroList2 : sortedHeroList);
        const scored = cand.map(h=>{
          if (blockedGlobal(h)) return {h, sc:-999};
          let sc = 0;
          if (!used.has(h.name)) sc += 3;
          sc += needRoleWeight(h);
          if (prevSet.has(h.name)) sc += 1;
          return {h, sc};
        }).filter(x=>x.sc>=0);
      
        const act = scored.filter(x => actionableFor(x.h, t, ty));
        return act.sort((a,b)=>b.sc-a.sc).slice(0,8).map(x=>x.h);
      }, [draftMode, currentStep, picks, localUsed, boType, currentGame, isFinalBO7, globalPicks, filteredHeroList2, sortedHeroList, prevPickedByRole, ourTeam]);      
   // ค้นหาเร็วจาก name/role/aliases/tags

     const pickOwner = useMemo(()=>{
       const m = new Map();
       picks.A.forEach(h=>m.set(h.name,'A'));
       picks.B.forEach(h=>m.set(h.name,'B'));
       return m;
     },[picks]);
     const banOwner = useMemo(()=>{
       const m = new Map();
       bans.A.forEach(h=>m.set(h.name,'A'));
       bans.B.forEach(h=>m.set(h.name,'B'));
       return m;
     },[bans]);
   
     /* -----------------------------
        Utility: ล้าง PRE ที่ช่อง
        ----------------------------- */
     function handlePreChoose(team,pickIdx,hero){
      if (lockedTeam && team!==lockedTeam) return;       // กันความผิดพลาด
       setPreChoose(prev=>{
         const arr = [...prev[team]];
         const dup = arr.findIndex(h=>h?.name===hero.name);
         if (dup!==-1) arr[dup]=null;
         arr[pickIdx]=hero;
         return { ...prev, [team]:arr };
       });
     }
     function handleClearPreChoose(team,pickIdx){
      if (lockedTeam && team!==lockedTeam) return;
       setPreChoose(prev=>{
         const arr=[...prev[team]]; arr[pickIdx]=null;
         return { ...prev, [team]:arr };
       });
     }
   
     /* -----------------------------
        CORE VALIDATORS + FREE ACTIONS
        ----------------------------- */
     function canBan(team, heroName){
       if ((bans[team]||[]).length >= 4) return { ok:false, msg:`${team} แบนครบ 4 แล้ว` };
       return { ok:true };
     }
     function canPick(team, heroName){
       const localUsedNames = [...bans.A,...bans.B,...picks.A,...picks.B].map(h=>h.name);
       if (localUsedNames.includes(heroName)) return { ok:false, msg:`"${heroName}" ถูกใช้/แบนในเกมนี้แล้ว` };
       const isFinalGame = !!boType && currentGame === BO_OPTIONS[boType];
       if (globalPicks[team].includes(heroName) && !isFinalBO7)
         return { ok:false, msg:`กฎ Global: ${team} เลือก "${heroName}" ไปแล้วในเกมก่อนหน้า` };
       if ((picks[team]||[]).length >= 5) return { ok:false, msg:`${team} เลือกครบ 5 แล้ว` };
       return { ok:true };
     }
     function actionableFor(hero, team, type) {
      // กันไม่ให้เลือก EMPTY heroes
      if (hero?.name?.startsWith?.('EMPTY_')) {
        return false;
      }
      
      if (type === 'ban') return canBan(team, hero.name).ok;
      if (type === 'pick') return canPick(team, hero.name).ok;
      return true;
    }   
     // [MOD: 5.1] — doFreeAction: เมื่อ enableConfirm=true จะเข้า pending ก่อน (ยังไม่ commit)
function doFreeAction(hero, team, type){
  if (readOnly) return;
  if (!hero || !team || !type) return;

  if (lockedTeam && team !== lockedTeam) {
    setAlertMsg('อนุญาตให้เลือกเฉพาะฝั่งของทีมคุณ');
    return;
  }

  // เปิดโหมดกดยืนยัน → แค่ตั้ง pending ไว้ก่อน
  if (enableConfirm) {
    const check = (type==='ban') ? canBan(team, hero.name) : canPick(team, hero.name);
    if (!check.ok) { setAlertMsg(check.msg); return; }
    setPendingSelection(team, type, hero);   // ← เข้าสถานะร่าง (pending)
    setAlertMsg('');
    return;                                  // ← ยังไม่ commit ที่นี่
  }

  // ====== โหมดไม่มีการยืนยัน (commit ทันที เหมือนเดิม) ======
  if (type==='ban') {
    const check = canBan(team, hero.name);
    if (!check.ok) { setAlertMsg(check.msg); return; }
    const slotIdx = bans[team].length;
    setBans(p=>({ ...p, [team]:[...p[team], hero] }));
    triggerSlotSelectFX(team, 'ban', slotIdx);
    setHistory(h=>[...h,{ stepIndex: -1, team, hero, type }]);
    try { onActionEffective?.({ type, team, heroName: hero.name, stepIndex: -1 }); } catch {}
    setAlertMsg('');
  } else {
    const check = canPick(team, hero.name);
    if (!check.ok) { setAlertMsg(check.msg); return; }
    const slotIdx = picks[team].length;
    setPicks(p=>({ ...p, [team]:[...p[team], hero] }));
    if (!isFinalBO7) setGlobalPicks(g=>({ ...g, [team]:[...g[team], hero.name] }));
    const pickIdx = picks[team].length;
    if (preChoose[team][pickIdx]) handleClearPreChoose(team,pickIdx);
    setHistory(h=>[...h,{ stepIndex: -1, team, hero, type }]);
    try { onActionEffective?.({ type, team, heroName: hero.name, stepIndex: -1 }); } catch {}
    setAlertMsg('');
    triggerSlotSelectFX(team, 'pick', slotIdx);
  }
}

     function applyExternalAction(evt){
      // คำสั่งควบคุมจาก RefereeConsole

      if (!evt || !evt.type) return;
      const { type, team, heroName, stepIndex } = evt;
      const hero = heroMap.get(heroName);
      if (type !== 'undo' && !hero) return;
    
      // ใช้รูปแบบ setState แบบฟังก์ชันเพื่อกัน stale-closure
      if (type === 'undo') {
        // ย้อน 1 แอ็กชันล่าสุด (ให้เหมือน handleUndo)
        setHistory(h => {
          if (!h.length) return h;
          const last = h[h.length - 1];
          const t = last.team, nm = last.hero?.name, ty = last.type;
    
          if (ty === 'ban') {
            setBans(prev => ({ ...prev, [t]: prev[t].filter(x => x.name !== nm) }));
          } else if (ty === 'pick') {
            setPicks(prev => ({ ...prev, [t]: prev[t].filter(x => x.name !== nm) }));
            setGlobalPicks(g => ({ ...g, [t]: g[t].filter(n => n !== nm) }));
          }
    
          // sync step/selection เหมือน handleUndo
          const newH = h.slice(0, -1);
          if (draftMode === 'sequence') {
            const countInThatStep = newH.filter(a => a.stepIndex === last.stepIndex).length;
            setSelectionCount(countInThatStep % (draftSeq[last.stepIndex]?.count || 1));
            setStepIndex(last.stepIndex >= 0 ? last.stepIndex : stepIndex);
          }
          return newH;
        });
        return;
      }
    
      // PICK/BAN ปกติ
      if (type === 'ban') {
        setBans(prev => {
          const slotIdx = prev[team].length;
          const next = { ...prev, [team]: [...prev[team], hero] };
          // เอฟเฟกต์ช่อง
          triggerSlotSelectFX(team, 'ban', slotIdx);
          return next;
        });
      } else if (type === 'pick') {
        setPicks(prev => {
          const slotIdx = prev[team].length;
          const next = { ...prev, [team]: [...prev[team], hero] };
    
          // อัปเดต global picks (ยกเว้นเกมสุดท้าย BO7)
          const isFinal = !!boType && currentGame === BO_OPTIONS[boType];
          if (!isFinalBO7) {
            setGlobalPicks(g => ({ ...g, [team]: [...g[team], hero.name] }));
          }
    
          // ถ้ามี pre-choose ตรงช่องนี้ให้เคลียร์
          const pickIdx = prev[team].length;
          if (preChoose[team][pickIdx]) handleClearPreChoose(team, pickIdx);
    
          // เอฟเฟกต์ช่อง
          triggerSlotSelectFX(team, 'pick', slotIdx);
          return next;
        });
      }
    
      // ✅ เพิ่มลง history และคำนวณสเต็ปจาก "สถานะล่าสุด" ในครั้งเดียว (กัน stale)
      setHistory(prev => {
          const newH = [...prev, { stepIndex, team, hero, type }];
  
          if (draftMode === 'sequence' && stepIndex >= 0) {
            const spec = draftSeq[stepIndex] || { count: 1 };
            const countInStep = newH.filter(a => a.stepIndex === stepIndex).length;
  
            if (countInStep >= (spec.count || 1)) {
              setStepIndex(stepIndex + 1);
              setSelectionCount(0);
            } else {
              setStepIndex(stepIndex);
              setSelectionCount(countInStep);
            }
          }
          return newH;
        });
    }
    
     /* ================================================
        PART 3 — Rendering + Slots/Grid + History
        ================================================ */
   
     /* ---------- Mini summary / Legend ---------- */
     function MiniSummaryStrip({ label, bansArr, picksArr, align='left' }){
       return (
         <div style={{
           display:'flex', alignItems:'center', gap:10, padding:'8px 12px',
           background:'var(--cg-surface)', borderRadius:10, boxShadow:'0 2px 10px #0008',
           justifyContent: align==='left' ? 'flex-start' : 'flex-end'
         }}>
           <div style={{ color:'var(--cg-info)', fontWeight:900 }}>{label}</div>
           <div style={{ display:'flex', gap:6 }}>
             {[...bansArr, ...Array(Math.max(0,4-bansArr.length)).fill(null)].slice(0,4).map((h,i)=>(
               <div key={`b-${i}`} title={h?.name || 'ban'}>
                 <div style={{
                   width:22, height:22, borderRadius:6, background:'var(--cg-surface-2)', overflow:'hidden',
                   outline:`2px solid ${getComputedStyleSafe('--cg-danger', '#EA1C24')}`
                 }}>
                   {h && <img src={getImage(h.image)} alt={h.name} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>}
                 </div>
               </div>
             ))}
           </div>
           <div style={{ width:1, height:22, background:'var(--cg-border)', margin:'0 2px' }}/>
           <div style={{ display:'flex', gap:6 }}>
             {[...picksArr, ...Array(Math.max(0,5-picksArr.length)).fill(null)].slice(0,5).map((h,i)=>(
               <div key={`p-${i}`} title={h?.name || 'pick'}>
                 <div style={{
                   width:22, height:22, borderRadius:6, background:'var(--cg-surface-2)', overflow:'hidden',
                   outline:`2px solid ${getComputedStyleSafe('--cg-info', '#57EAE7')}`
                 }}>
                   {h && <img src={getImage(h.image)} alt={h.name} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>}
                 </div>
               </div>
             ))}
           </div>
         </div>
       );
     }function renderTimerHUD(){
      // ⟵ นำ badge/chip TIMER ทั้งชุดของคุณมาใส่ที่นี่
      // ตัวอย่าง placeholder (ให้แทนที่ด้วย JSX จริงของคุณ)
      return (
        <div style={{
          display:'inline-flex', gap:8, alignItems:'center',
          padding:6, borderRadius:14,
          background:'rgba(0,0,0,.35)',
          border:'1px solid var(--cg-border)',
          boxShadow:'0 10px 24px rgba(0,0,0,.45)'
        }}>
          {/* ตัวอย่างป้าย (แทนด้วยของคุณ) */}
          <span className="pill">A: {String(Math.floor(turnSecondsLeft/60)).padStart(2,'0')}:{String(turnSecondsLeft%60).padStart(2,'0')}</span>
          <span className="pill">A RES: {fmt(timerSettings.reserve*1000)}</span>
          <span className="pill">B: 00:25</span>
          <span className="pill">B RES: {fmt(timerSettings.reserve*1000)}</span>
          <span className="pill" style={{ background:'var(--cg-info)', color:'#0f1220', fontWeight:900 }}>
            {isPaused ? 'PAUSED' : 'RUNNING'}
          </span>
        </div>
      );
    }    
     function renderLegend(){
       return (
         <div style={{
           position:'absolute', top:16, left:16, background:'var(--cg-surface)',
           padding:'8px 12px', borderRadius:8, display:'flex', flexWrap:'wrap', gap:8, zIndex:10,
           border:'1px solid var(--cg-border)'
         }}>
           {ROLE_ORDER.map(role=>(
             <div key={role} style={{ display:'inline-flex', alignItems:'center', color:'var(--cg-text)', fontSize:12 }}>
               <span style={{ display:'inline-block', width:12, height:12, background:ROLE_BORDER_COLORS[role], marginRight:4, borderRadius:2 }}/>
               {role}
             </div>
           ))}
         </div>
       );
     }
   
     // [NEW] ฟังก์ชันคุมการเห็น pending ของทีม t ( 'A' | 'B' )
function canSeePending(t){
  // ผู้ชม: readOnly และไม่มีการล็อกทีม → เห็นทุกฝั่ง
  if (readOnly && !lockedTeam) return true;
  // กรรมการ/Host: ไม่มีการล็อกทีม → เห็นทุกฝั่ง
  if (!lockedTeam) return true;
  // ผู้เล่นฝั่งที่ล็อก: เห็นเฉพาะฝั่งตัวเอง
  return lockedTeam === t;
}
// [NEW] ยูทิลสำหรับหา index ช่องถัดไป
function nextSlotIndexFor(team, type){
  if (type === 'pick') return (picks[team] || []).length;
  if (type === 'ban')  return (bans[team]  || []).length;
  return 0;
}
// [NEW] ฟังก์ชันตั้ง pending แบบรวมศูนย์
function setPendingSelection(team, type, hero){
  // ไม่เดิน step / ไม่กระทบ history ที่นี่
  setPending(prev => {
    const arr = [...(prev[team] || [])];

    // ถ้าเป็น sequence: ต้องเป็นทีม/ชนิดเดียวกับ step ปัจจุบัน
   // ...ภายใน setPendingSelection(team, type, hero) สาขา sequence...
if (draftMode === 'sequence') {
  if (!currentStep?.team || !currentStep?.type) return prev;
  if (team !== currentStep.team || type !== currentStep.type) return prev;

  const need = currentStep.count || 1;

  // กันฮีโร่ซ้ำใน pending เดิม
  if (arr.some(x => x.hero.name === hero.name)) return prev;

  // จุดเริ่มของสเต็ปนี้บนตาราง (ช่องที่ถูกไฮไลต์แรก)
  const baseIdx = highlightStartIndex; // ✅ ใช้ index เริ่มของสเต็ป

  // จำนวนที่ pending อยู่ในชนิดเดียวกันในสเต็ปนี้
  const countSameType = arr.filter(x => x.type === type).length;

  // ถ้าเกินจำนวนที่อนุญาต → แทนที่ตัวท้าย "แต่คง slotIdx เดิม"
  if (countSameType >= need) {
    const next = arr.slice();
    const lastIdx = next.map(x => x.type).lastIndexOf(type);
    const keepSlot = next[lastIdx]?.slotIdx ?? baseIdx; // ✅ คง index เดิม
    next[lastIdx] = { type, hero, slotIdx: keepSlot };
    return { ...prev, [team]: next };
  }

  // ยังไม่ครบจำนวน → ใส่เพิ่มที่ตำแหน่ง baseIdx + countSameType
  const slotIdx = baseIdx + countSameType; // ✅ คิดจากจุดไฮไลต์เริ่ม
  return { ...prev, [team]: [...arr, { type, hero, slotIdx }] };
}

    // FREE mode: สะสมได้อิสระ (อย่างน้อย 1 ตัวค่อยกด Confirm)
    if (arr.some(x => x.hero.name === hero.name)) return prev;
    const committedIdx = type === 'pick' ? (picks[team] || []).length : (bans[team] || []).length;
    const alreadyInThisType = arr.filter(x => x.type === type).length;
    const slotIdx = committedIdx + alreadyInThisType;
    return { ...prev, [team]: [...arr, { type, hero, slotIdx }] };
  });
  setAlertMsg('');
}

     /* ---------- เลือกด้วยการ “ลากผ่าน” ---------- */
     function selectHeroViaPointer(hero, viewTeam){
      if (readOnly) return;
        if (selectingPre) return;
        if (lockedTeam && viewTeam !== lockedTeam) return;   
       if (draftMode==='free') {
         doFreeAction(hero, viewTeam, freeAction);
         return;
       }
       const localUsedNames = [...bans.A,...bans.B,...picks.A,...picks.B].map(h=>h.name);
       const isFinalGame = !!boType && currentGame === BO_OPTIONS[boType];
       const blocked = currentStep?.type==='pick'
         && globalPicks[currentStep?.team||'A']?.includes(hero.name)
         && !isFinalBO7;
   
       if (!localUsedNames.includes(hero.name) && !blocked && stepIndex<totalSteps) handleHeroClick(hero);
     }
   
     /* ---------- Slots renderer ---------- */
     // [MOD: 5.3 + 7] — renderSlots ใหม่ รองรับ pending + Confirm/Cancel ครบ
     function renderSlots(arr, max, team, type){
      return Array.from({length:max}).map((_, i) => {
        // ไฮไลต์ของ sequence
         // ✅ แสดงช่อง EMPTY สำหรับ BAN ที่ข้าม
    const isEmptyBan = arr[i]?.name?.startsWith?.('EMPTY_BAN');
    const isEmptyPick = arr[i]?.name?.startsWith?.('EMPTY_PICK');
    
    if (isEmptyBan || isEmptyPick) {
      return (
        <div
          key={i}
          data-slot={type}
          data-team={team}
          data-index={i}
          className="cg-slot"
          style={{
            margin: 6, textAlign: 'center', width: 76, height: 120,
            display: 'flex', flexDirection: 'column', alignItems: 'center', 
            justifyContent: 'center', position: 'relative'
          }}
        >
          <div className="empty-slot">
            <div style={{ fontSize: 32, marginBottom: 4 }}>⏰</div>
            <div style={{ fontSize: 10 }}>TIME OUT</div>
            {isEmptyBan && <div style={{ fontSize: 9, opacity: 0.7 }}>BAN</div>}
            {isEmptyPick && <div style={{ fontSize: 9, opacity: 0.7 }}>AUTO PICKED</div>}
          </div>
        </div>
      );
    }
        const isHighlight = !(draftMode==='free')
          && team===highlightTeam && type===highlightType
          && i>=highlightStartIndex && i<highlightStartIndex+highlightCount;
    
        // ✅ ใช้ array ของ pending + หา item ตามช่อง
        const pArr = pending[team] || [];
        const pendItem = pArr.find(x => x.type === type && x.slotIdx === i) || null;
        const isPendingHere = !!pendItem;
    
        const canSee = canSeePending(team);
        const canOperateButtons = enableConfirm && (
          (lockedTeam === team) ||                      // ผู้เล่นฝั่งนี้
          (!lockedTeam && !readOnly)                   // กรรมการ/host
        );

    // ---------- PICK ----------
    if (type === 'pick') {
      const hero = arr[i];
      const preHero = preChoose[team][i];

      // ช่องที่มีฮีโร่ pick แล้ว (จริง)
      if (hero) {
        return (
          <div
            key={i}
            data-slot="pick"
            data-team={team}
            data-index={i}
            className={`cg-slot ${isHighlight ? 'is-highlight' : ''}`}
            style={{
              margin:6, textAlign:'center', width:76, height:120, position:'relative',
              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'
            }}
          >
            <img src={getImage(hero.image)} alt={hero.name}
                 style={{ width:72, height:72, borderRadius:14, boxShadow:'0 2px 12px #000a' }}/>
            <div style={{
              maxWidth:72, fontSize:13, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
              color:'var(--cg-text)', fontWeight:700
            }}>{hero.name}</div>
          </div>
        );
      }

      // ช่อง pending (เห็นเฉพาะคนที่มีสิทธิ์)
      // ช่อง pending (เห็นเฉพาะคนที่มีสิทธิ์)
if (isPendingHere && canSee) {
  const h = pendItem.hero;           // ✅ แก้จาก p.hero → pendItem.hero
  return (
    <div
      key={i}
      data-slot="pick"
      data-team={team}
      data-index={i}
      className={`cg-slot ${isHighlight ? 'is-highlight' : ''}`}
      style={{
        margin:6, width:76, height:120,
        border:`2.5px dashed ${isHighlight ? highlightColor : 'var(--cg-border)'}`,
        borderRadius:14, background:'var(--cg-surface)',
        display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column',
        position:'relative'
      }}
    >
      <img
        src={getImage(h.image)} alt={h.name}
        style={{ width:72, height:72, borderRadius:14, opacity:.5, filter:'grayscale(60%)', boxShadow:'0 2px 12px #000a' }}
      />
      <div style={{
        maxWidth:72, fontSize:12, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
        color:'var(--cg-muted)', fontWeight:800, marginTop:4
      }}>
        {h.name} <span style={{fontSize:10, opacity:.85}}>[PENDING]</span>
      </div>
    </div>
  );
}


      // ช่องมี pre-choose (ของเดิม)
      if (preHero) {
        return (
          <div
            key={i}
            title="Pre-choose"
            style={{
              margin:6, textAlign:'center', width:76, height:120,
              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
              background:'var(--cg-surface)',
              border:`2.5px dashed ${getComputedStyleSafe('--cg-warning','#FFC400')}`,
              borderRadius:14, position:'relative'
            }}
            onDragOver={e=>{ if (dragHero){ e.preventDefault(); e.dataTransfer.dropEffect='copy'; } }}
            onDrop={e=>{
              const h = getHeroFromDrop(e); if (!h) return;
              if (draftMode==='free') {
                if (enableConfirm) {
                  const check = canPick(team, h.name); if (!check.ok) { setAlertMsg(check.msg); return; }
                  setPendingSelection(team, 'pick', h);
                  resetHoverDrag();
                  return;
                }
                doFreeAction(h, team, 'pick'); resetHoverDrag(); return;
              }
              // sequence
              if (!isHighlight) return;
              if (enableConfirm) {
                const check = canPick(team, h.name); if (!check.ok) { setAlertMsg(check.msg); return; }
                setPendingSelection(team, 'pick', h);
                resetHoverDrag();
                return;
              }
              handleHeroClick(h); resetHoverDrag();
            }}
          >
            <img src={getImage(preHero.image)} alt={preHero.name}
                 style={{ width:72, height:72, borderRadius:14, boxShadow:'0 2px 12px #000a', opacity:0.54, filter:'grayscale(70%)' }}/>
            <div style={{
              maxWidth:72, fontSize:13, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
              color:getComputedStyleSafe('--cg-warning','#FFC400'), fontWeight:900
            }}>
              {preHero.name} <span style={{fontSize:11}}>[PRE]</span>
            </div>
            <button
              onClick={()=>handleClearPreChoose(team,i)}
              title="ลบ pre-choose"
              style={{
                position:'absolute', top:3, right:5, background:'transparent', border:'none',
                color:getComputedStyleSafe('--cg-warning','#FFC400'), fontSize:16, cursor:'pointer'
              }}
            >×</button>
          </div>
        );
      }

      // ช่อง pick ว่าง
      return (
        <div
          key={i}
          className="cg-slot"
          style={{
            width:76, height:120, margin:6,
            border:`2.5px dashed ${isHighlight ? highlightColor : 'var(--cg-border)'}`,
            borderRadius:14, background:'var(--cg-surface)', display:'flex', alignItems:'center',
            justifyContent:'center', flexDirection:'column', cursor:'pointer', color:'var(--cg-muted)',
            fontWeight:800, fontSize:13, letterSpacing:1, position:'relative'
          }}
          onClick={()=>{
            // ว่างเปล่า: ไม่ทำอะไร (เลือกจาก grid ด้านล่างหรือ drag/drop)
          }}
          title={draftMode==='free' ? 'ลากฮีโร่มาวางเพื่อ Pick' : 'Pick slot'}
          onDragOver={e=>{ if (dragHero){ e.preventDefault(); e.dataTransfer.dropEffect='copy'; } }}
          onDrop={e=>{
            const h=getHeroFromDrop(e); if (!h) return;
            if (draftMode==='free') {
              if (enableConfirm) {
                const check = canPick(team, h.name); if (!check.ok) { setAlertMsg(check.msg); return; }
                setPendingSelection(team, 'pick', h);
                resetHoverDrag();
                return;
              }
              doFreeAction(h, team, 'pick'); resetHoverDrag(); return;
            }
            if (!isHighlight) return;
            if (enableConfirm) {
              const check = canPick(team, h.name); if (!check.ok) { setAlertMsg(check.msg); return; }
              setPendingSelection(team, 'pick', h);
              resetHoverDrag();
              return;
            }
            handleHeroClick(h); resetHoverDrag();
          }}
        >
          <span style={{fontSize:18}}>＋</span>
          <span style={{fontSize:12, marginTop:2}}>
            {draftMode==='free' ? 'Quick' : 'Pre-choose'}
          </span>
        </div>
      );
    }

    // ---------- BAN ----------
    // มีฮีโร่ ban แล้ว
    if (i < arr.length) {
      const hero = arr[i];
      return (
        <div
          key={i}
          data-slot="ban"
          data-team={team}
          data-index={i}
          className={`cg-slot ${isHighlight ? 'is-highlight' : ''}`}
          style={{
            margin:6, textAlign:'center', width:76, height:120,
            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'
          }}
        >
          <img src={getImage(hero.image)} alt={hero.name}
               style={{ width:72, height:72, borderRadius:14, boxShadow:'0 2px 12px #000a' }}/>
          <div style={{
            maxWidth:72, fontSize:13, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
            color:'var(--cg-text)', fontWeight:700
          }}>{hero.name}</div>
        </div>
      );
    }

    // ช่อง ban ว่างที่มี pending (เห็นเฉพาะคนที่มีสิทธิ์)
    // ช่อง ban ว่างที่มี pending (เห็นเฉพาะคนที่มีสิทธิ์)
if (isPendingHere && canSee) {
  const h = pendItem.hero;           // ✅ แก้จาก p.hero → pendItem.hero
  return (
    <div
      key={i}
      data-slot="ban"
      data-team={team}
      data-index={i}
      className={`cg-slot ${isHighlight ? 'is-highlight' : ''}`}
      style={{
        margin:6, width:76, height:120,
        border:`2.5px dashed ${isHighlight ? highlightColor : 'var(--cg-border)'}`,
        borderRadius:14, background:'var(--cg-surface)',
        display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column',
        position:'relative'
      }}
    >
      <img
        src={getImage(h.image)} alt={h.name}
        style={{ width:72, height:72, borderRadius:14, opacity:.5, filter:'grayscale(60%)', boxShadow:'0 2px 12px #000a' }}
      />
      <div style={{
        maxWidth:72, fontSize:12, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
        color:'var(--cg-muted)', fontWeight:800, marginTop:4
      }}>
        {h.name} <span style={{fontSize:10, opacity:.85}}>[PENDING]</span>
      </div>
    </div>
  );
}


    // ช่อง ban ว่าง (ปกติ)
    return (
      <div
        key={i}
        className="cg-slot"
        style={{
          width:76, height:120, margin:6,
          border:`2.5px dashed ${isHighlight ? highlightColor : 'var(--cg-border)'}`,
          borderRadius:14, background:'var(--cg-surface)'
        }}
        onDragOver={e=>{ if (dragHero){ e.preventDefault(); e.dataTransfer.dropEffect='copy'; } }}
        onDrop={e=>{
          const h=getHeroFromDrop(e); if (!h) return;
          if (draftMode==='free') {
            if (enableConfirm) {
              const check = canBan(team, h.name); if (!check.ok) { setAlertMsg(check.msg); return; }
              setPendingSelection(team, 'ban', h);
              resetHoverDrag();
              return;
            }
            doFreeAction(h, team, 'ban'); resetHoverDrag(); return;
          }
          if (!isHighlight) return;
          if (enableConfirm) {
            const check = canBan(team, h.name); if (!check.ok) { setAlertMsg(check.msg); return; }
            setPendingSelection(team, 'ban', h);
            resetHoverDrag();
            return;
          }
          handleHeroClick(h); resetHoverDrag();
        }}
        title={draftMode==='free' ? 'ลากฮีโร่มาวางเพื่อ Ban' : 'Ban slot'}
      />
    );
  });
}

   
     /* ---------- Grid ของฮีโร่สองฝั่ง ---------- */
     function renderHeroGrid(viewTeam){
       return (
         <div>
           <div style={{ marginBottom: 10, color:'var(--cg-text)', fontWeight:900 }}>
             ฮีโร่ฝั่ง {teamLabel(viewTeam)}
           </div>
           {ROLE_ORDER.map(role=>{
             const heroesOfRole = filteredHeroList2.filter(h=>normalizeRole(h.role)===role);
             if (!heroesOfRole.length) return null;
             return (
               <div key={`${viewTeam}-${role}`} style={{ marginBottom: 20 }}>
                 <div style={{ marginBottom:6, fontSize: 15, fontWeight:700, color:'var(--cg-text)' }}>
                   {ROLE_ICON[role]} {role}
                 </div>
                 <div style={{ display:'flex', flexWrap:'wrap', gap:17 }}>
                   {heroesOfRole.map(hero=>{
                     const local = localUsed.includes(hero.name);
                     const isFinalBO7 = draftMode==='sequence' && (boType==='BO7' && currentGame===BO_OPTIONS.BO7);
                     const blockedSeq = draftMode==='sequence' && (highlightType==='pick'
                       && globalPicks[highlightTeam]?.includes(hero.name)
                       && !isFinalBO7);
   
                        const blockedByTeamLock = !!(lockedTeam && viewTeam !== lockedTeam);
                        const disabled = blockedByTeamLock
                          || local
                          || blockedSeq
                          || (stepIndex>=totalSteps && draftMode==='sequence');                     const nowPickedBy = pickOwner.get(hero.name);
                     const nowBannedBy = banOwner.get(hero.name);
                     const isUsed = !!(nowPickedBy || nowBannedBy);
   
                     const isOursSide = (viewTeam === ourTeam);
                     const showPrev = isOursSide ? prevPickedByRole.ours : prevPickedByRole.opps;
   
                     return (
                       <motion.div key={`${viewTeam}-${hero.name}`}
                       ref={el => {
                        if (!heroRefs.current[viewTeam]) heroRefs.current[viewTeam] = {};
                        if (el) heroRefs.current[viewTeam][hero.name] = el;
                      }}                      
                         data-heroname={hero.name}
                         draggable={!disabled}
                         onDragStart={e=>{
                           if (disabled) return;
                           setDragHero(hero); resetHoverDrag(); suppressClickRef.current=true;
                           try { e.dataTransfer.setData('text/plain', hero.name); e.dataTransfer.effectAllowed='copy'; } catch(_){}
                         }}
                         onDragEnd={()=>{ setDragHero(null); resetHoverDrag(); }}
                         whileHover={!disabled?{ scale:1.12, boxShadow:'0 8px 24px rgba(57,255,20,.5)' }:{}}
                         onMouseDown={e=>{
                           if (disabled) return;
                           dragVisitedRef.current.clear();
                           pointerDownRef.current = { down:true, x:e.clientX, y:e.clientY, startedOn:hero.name };
                         }}
                         onMouseEnter={()=>{
                           if (isDragging && !dragHero && !disabled) {
                             if (!dragVisitedRef.current.has(hero.name)) {
                               dragVisitedRef.current.add(hero.name);
                               selectHeroViaPointer(hero, viewTeam);
                             }
                           }
                         }}
                         onTouchStart={(e)=>{
                          if (disabled) return;
                          const t = e.touches?.[0]; if (!t) return;
                          dragVisitedRef.current.clear();
                          pointerDownRef.current = { down:true, x:t.clientX, y:t.clientY, startedOn:hero.name };
                        }}
                        onTouchMove={(e)=>{
                          if (disabled) return;
                          const t = e.touches?.[0]; if (!t) return;
                          // global touchmove จะ flip isDragging ให้แล้ว
                          if (isDragging && !dragHero) {
                            if (!dragVisitedRef.current.has(hero.name)) {
                              dragVisitedRef.current.add(hero.name);
                              selectHeroViaPointer(hero, viewTeam);
                            }
                          }
                        }}
                        onTouchEnd={()=>{ pointerDownRef.current.down=false; }}
                        
                         onMouseUp={()=>{ pointerDownRef.current.down=false; }}
                         onClick={()=>{
                           if (disabled) return;
                           if (suppressClickRef.current) return;
                           if (draftMode==='free') {
                             doFreeAction(hero, viewTeam, freeAction);
                           } else {
                             handleHeroClick(hero);
                           }
                         }}
                         style={{
                           width:84, height:108,
                           cursor: disabled ? 'not-allowed' : 'pointer',
                           opacity: disabled && !isUsed ? 0.45 : 1,
                           position:'relative', overflow:'hidden', borderRadius:16,
                           background:'var(--cg-surface)',
                           boxShadow:`0 4px 30px #000a,0 2px 7px #00000025`,
                           border: `3px solid ${ROLE_BORDER_COLORS[normalizeRole(hero.role)]||'transparent'}`,
                           transition:'box-shadow .2s,transform .15s,border .14s',
                         }}
                       >
                         <img src={getImage(hero.image)} alt={hero.name}
                              draggable={false}
                              style={{ width:'100%', height:84, objectFit:'cover', borderRadius:'16px 16px 0 0' }}/>
                         <div style={{
                           width:'100%', height:24, background:'var(--cg-bg-2)', fontSize:12,
                           borderRadius:'0 0 16px 16px', textAlign:'center', overflow:'hidden',
                           whiteSpace:'nowrap', textOverflow:'ellipsis', fontWeight:800, color:'var(--cg-text)',
                           borderTop:`1px solid var(--cg-border)`, display:'flex', alignItems:'center', justifyContent:'center'
                         }}>{hero.name}</div>
   
                         {nowBannedBy && (
                           <div style={{ position:'absolute', top:4, left:4, padding:'2px 8px',
                             fontSize:11, fontWeight:900, color:'#fff', background:ACTION_COLOR.ban,
                             borderRadius:6, boxShadow:'0 2px 8px #0007', letterSpacing:.5 }}>
                             {TEAM_TAG[nowBannedBy]} BAN
                           </div>
                         )}
                         {nowPickedBy && (
                           <div style={{ position:'absolute', top:4, right:4, padding:'2px 8px',
                             fontSize:11, fontWeight:900, color:'#0f1220', background:ACTION_COLOR.pick,
                             borderRadius:6, boxShadow:'0 2px 8px #0007', letterSpacing:.5 }}>
                             {TEAM_TAG[nowPickedBy]} PICK
                           </div>
                         )}
   
                         {showPrev.has(hero.name) && !nowPickedBy && !nowBannedBy && (
                           <div style={{ position:'absolute', left:4, bottom:4, pointerEvents:'none' }}>
                             <div style={{
                               padding:'1px 6px', fontSize:10, fontWeight:900, color:'#0f1220',
                               background: isOursSide ? TEAM_COLOR[ourTeam] : TEAM_COLOR[ourTeam==='A'?'B':'A'],
                               borderRadius:6, boxShadow:'0 2px 6px #0007', letterSpacing:.4
                             }}>
                               PREV
                             </div>
                           </div>
                         )}
   
                         {(nowPickedBy || nowBannedBy) && (
                           <UsedOverlay />
                         )}
   
                         {!nowPickedBy && !nowBannedBy && showPrev.has(hero.name) && (
                           <UsedOverlay />
                         )}
                       </motion.div>
                     );
                   })}
                 </div>
               </div>
             );
           })}
         </div>
       );
     }
   
     // [MOD: 5.2] — handleHeroClick: เมื่อ enableConfirm=true จะเข้า pending ก่อน
function handleHeroClick(hero){
  if (readOnly) return;
  if (selectingPre) return;
  if (draftMode==='free') return;

  if (lockedTeam && currentStep.team !== lockedTeam) {
    setAlertMsg('ยังไม่ถึงคิวทีมของคุณ');
    return;
  }
  if (stepIndex>=totalSteps || !currentStep?.type || !currentStep?.team) return;

  const { team, type, count } = currentStep;
  const localUsedNames = [...bans.A,...bans.B,...picks.A,...picks.B].map(h=>h.name);
  const blocked = type==='pick' && globalPicks[team].includes(hero.name) && !isFinalBO7;
  if (localUsedNames.includes(hero.name) || blocked) return;

  // โหมดกดยืนยัน → แค่ตั้ง pending
  if (enableConfirm) {
    const check = (type==='ban') ? canBan(team, hero.name) : canPick(team, hero.name);
    if (!check.ok) { setAlertMsg(check.msg); return; }
    setPendingSelection(team, type, hero);
    setAlertMsg('');
    return; // ยังไม่ commit
  }

  // ====== ไม่มียืนยัน (commit ทันที เหมือนเดิม) ======
  if (type==='ban') {
    const slotIdx = bans[team].length;
    setBans(p=>({ ...p, [team]:[...p[team], hero] }));
    triggerSlotSelectFX(team, 'ban', slotIdx);
  } else {
    const slotIdx = picks[team].length;
    setPicks(p=>({ ...p, [team]:[...p[team], hero] }));
    if (!isFinalBO7) setGlobalPicks(g=>({ ...g, [team]:[...g[team], hero.name] }));
    const pickIdx = picks[team].length;
    if (preChoose[team][pickIdx]) handleClearPreChoose(team,pickIdx);
    triggerSlotSelectFX(team, 'pick', slotIdx);
  }

  setHistory(h=>[...h,{ stepIndex, team, hero, type }]);
  try { onActionEffective?.({ type, team, heroName: hero.name, stepIndex }); } catch {}
  setAlertMsg('');

  const nextCount = selectionCount+1;
  if (nextCount>=count) { setStepIndex(i=>i+1); setSelectionCount(0); }
  else setSelectionCount(nextCount);
}
   
// [MOD: 9] — ต้นฟังก์ชัน forceSkipTurn()
// [MOD: 9] — ต้นฟังก์ชัน forceSkipTurn()
// [MOD: 9] — ต้นฟังก์ชัน forceSkipTurn()
function forceSkipTurn() {
  if (draftMode === 'free') return;
  if (stepIndex >= totalSteps) return;

  // 🔒 ฟิวส์กันเรียกซ้อน
  if (isSkippingRef.current) return;
  isSkippingRef.current = true;

  try {
    const { team, type, count } = currentStep || {};
    const needCount = count || 1; // จำนวนที่ต้องเลือกในเทิร์นนี้
    
    // ✅ สำหรับ BAN: สร้าง Hero เปล่าแทนการเว้นช่อง
    if (type === 'ban') {
      for (let i = 0; i < needCount; i++) {
        const emptyBanHero = {
          name: `EMPTY_BAN_${Date.now()}_${i}`,
          image: 'empty_ban.png',
          role: 'Unknown'
        };
        
        const slotIdx = bans[team].length;
        setBans(p => ({ ...p, [team]: [...p[team], emptyBanHero] }));
        triggerSlotSelectFX(team, 'ban', slotIdx);
        
        setHistory(h => [...h, { 
          stepIndex, 
          team, 
          hero: emptyBanHero, 
          type: 'ban-skip' 
        }]);
        
        try { 
          onActionEffective?.({ 
            type: 'ban-skip', 
            team, 
            heroName: 'EMPTY_BAN', 
            stepIndex 
          }); 
        } catch {}
      }
    }
    
    // ✅ สำหรับ PICK: สุ่มฮีโร่ที่เลือกได้ตามจำนวนที่ต้องการ
    else if (type === 'pick') {
      const availableHeroes = filteredHeroList2.filter(h => 
        actionableFor(h, team, 'pick')
      );
      
      if (availableHeroes.length > 0) {
        // สุ่มฮีโร่ตามจำนวนที่ต้องการ (ไม่ซ้ำกัน)
        const selectedHeroes = [];
        const heroesPool = [...availableHeroes];
        
        for (let i = 0; i < Math.min(needCount, heroesPool.length); i++) {
          if (heroesPool.length === 0) break;
          
          const randomIndex = Math.floor(Math.random() * heroesPool.length);
          const randomHero = heroesPool[randomIndex];
          selectedHeroes.push(randomHero);
          
          // ลบออกจาก pool เพื่อไม่ให้สุ่มซ้ำ
          heroesPool.splice(randomIndex, 1);
        }
        
        // ใส่ฮีโร่ที่สุ่มได้ทั้งหมด
        for (const randomHero of selectedHeroes) {
          const slotIdx = picks[team].length;
          setPicks(p => ({ ...p, [team]: [...p[team], randomHero] }));
          
          if (!isFinalBO7) {
            setGlobalPicks(g => ({ 
              ...g, 
              [team]: [...g[team], randomHero.name] 
            }));
          }
          
          const pickIdx = picks[team].length;
          if (preChoose[team][pickIdx]) {
            handleClearPreChoose(team, pickIdx);
          }
          
          triggerSlotSelectFX(team, 'pick', slotIdx);
          
          setHistory(h => [...h, { 
            stepIndex, 
            team, 
            hero: randomHero, 
            type: 'pick-auto' 
          }]);
          
          try { 
            onActionEffective?.({ 
              type: 'pick-auto', 
              team, 
              heroName: randomHero.name, 
              stepIndex 
            }); 
          } catch {}
        }
        
        // 🔥 เอฟเฟกต์พิเศษเมื่อถูกบังคับเลือก (แสดงเฉพาะตัวแรก)
        if (selectedHeroes.length > 0) {
          spawnForcedPickFX(selectedHeroes[0], team, selectedHeroes.length);
        }
      } else {
        // ถ้าไม่มีฮีโร่ให้เลือก สร้างตัวเปล่าตามจำนวน
        for (let i = 0; i < needCount; i++) {
          const emptyPickHero = {
            name: `EMPTY_PICK_${Date.now()}_${i}`,
            image: 'empty_pick.png',
            role: 'Unknown'
          };
          
          const slotIdx = picks[team].length;
          setPicks(p => ({ ...p, [team]: [...p[team], emptyPickHero] }));
          
          setHistory(h => [...h, { 
            stepIndex, 
            team, 
            hero: emptyPickHero, 
            type: 'pick-skip' 
          }]);
        }
      }
    }

    // ล้าง pending ของเทิร์นนี้ (ถ้ามี)
    if (team && (pending[team]?.length)) {
      setPending(prev => ({ ...prev, [team]: [] }));
    }

    // เดินตัวชี้ (ข้ามทั้งเทิร์น)
    setSelectionCount(0);
    setStepIndex(i => i + 1);
    
  } finally {
    setTimeout(() => { isSkippingRef.current = false; }, 0);
  }
}
const isSkippingRef = useRef(false);
    // นับถอยหลังต่อ "หนึ่งการกระทำ" ในเทิร์นปัจจุบัน
useEffect(() => {
  // ปิด timer ถ้าไม่ใช่โหมด sequence หรือจบสเต็ปแล้ว
  if (draftMode !== 'sequence' || stepIndex >= totalSteps) {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    setTurnSecondsLeft(0);
    return;
  }
  // รีเซ็ตเวลาเมื่อเปลี่ยน stepIndex หรือ selectionCount ในสเต็ปเดิม
  setTurnSecondsLeft(currentTurnDuration);
  lastTickRef.current = Date.now();
  if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }

  timerRef.current = setInterval(() => {
    if (isPaused) return; // กด Pause อยู่
    setTurnSecondsLeft(prev => {
      const now = Date.now();
      const delta = Math.floor((now - (lastTickRef.current || now)) / 1000);
      if (delta <= 0) return prev;
      lastTickRef.current = now;

      const next = Math.max(0, prev - delta);
      if (next === 0) {
        if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
        // ✅ เรียกเมื่อแน่ใจว่าไม่กำลัง skip อยู่
        if (!isSkippingRef.current) forceSkipTurn();
      }      
      return next;
    });
  }, 250);

  return () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };
}, [turnKey, currentTurnDuration, draftMode, isPaused, totalSteps, stepIndex]);
// ★ เอฟเฟกต์กดดันเมื่อเวลาใกล้หมด (≤5 วิ)
useEffect(() => {
  if (turnSecondsLeft <= 5 && turnSecondsLeft > 0) {
    // สั่นทั้งหน้า
    const root = document.querySelector('.cg-theme');
    root?.classList.add('cg-shake');
    setTimeout(() => root?.classList.remove('cg-shake'), 450);

    // แฟลช glitch สั้น ๆ
    const g = document.createElement('div');
    g.className = 'cg-glitch';
    document.body.appendChild(g);
    setTimeout(() => g.remove(), 460);
  }
}, [turnSecondsLeft]);
// [NEW] ยืนยันการเลือก (ทำทุกอย่างเหมือน commit เดิม)
// [NEW: 6] — ยืนยัน/ยกเลิก pending
function confirmPending(team){
  const arr = pending[team] || [];
  if (!arr.length) return;

  // ตรวจครบ/ชนิด/ทีมตามเดิม...
  if (draftMode === 'sequence' && currentStep) {
    const want = currentStep.count || 1;
    const sameType = arr.every(x => x.type === currentStep.type);
    const sameTeam = team === currentStep.team;
    const enough  = arr.filter(x=>x.type===currentStep.type).length === want;
    if (!(sameType && sameTeam && enough)) {
      setAlertMsg('เลือกยังไม่ครบ หรือชนิดไม่ตรงกับเทิร์น');
      return;
    }
  }
  for (const it of arr) {
    const check = it.type === 'ban' ? canBan(team, it.hero.name) : canPick(team, it.hero.name);
    if (!check.ok) { setAlertMsg(check.msg); return; }
  }

  // ⛔️ ถ้ามี externalFeed: ส่งอีเวนต์ออกไปอย่างเดียว แล้วจบ
  if (externalFeed) {
    const si = draftMode === 'sequence' ? stepIndex : -1;
    for (const it of arr) {
         // เล่น FX ฝั่งผู้กดด้วย
    spawnHeroConfirmFX(getImage(it.hero.image), { heroName: it.hero.name });      try { onActionEffective?.({ type: it.type, team, heroName: it.hero.name, stepIndex: si }); } catch {}
    }
    setPending(prev => ({ ...prev, [team]: [] }));
    setAlertMsg('');
    return;
  }

  // ตรวจ canBan/canPick ทีละรายการ (ป้องกันกรณีมีคนอื่นแทรกก่อนกด)
  for (const it of arr) {
    const check = (it.type==='ban') ? canBan(team, it.hero.name) : canPick(team, it.hero.name);
    if (!check.ok) { setAlertMsg(check.msg); return; }
  }

  // ===== Commit ทีละรายการตามลำดับ =====
  let committed = 0;

  if (draftMode === 'free') {
    for (const it of arr) {
      if (it.type === 'ban') {
        const slotIdx = bans[team].length;
        setBans(b => ({ ...b, [team]: [...b[team], it.hero] }));
        triggerSlotSelectFX(team, 'ban', slotIdx);
      } else {
        const slotIdx = picks[team].length;
        setPicks(p => ({ ...p, [team]: [...p[team], it.hero] }));
        if (!isFinalBO7) setGlobalPicks(g => ({ ...g, [team]: [...g[team], it.hero.name] }));
        const pickIdx = picks[team].length;
        if (preChoose[team][pickIdx]) handleClearPreChoose(team, pickIdx);
        triggerSlotSelectFX(team, 'pick', slotIdx);
      }
      spawnHeroConfirmFX(getImage(it.hero.image), { heroName: it.hero.name });      setHistory(h => [...h, { stepIndex: -1, team, hero: it.hero, type: it.type }]);
      try { onActionEffective?.({ type: it.type, team, heroName: it.hero.name, stepIndex: -1 }); } catch {}
      committed++;
    }
    setPending(prev => ({ ...prev, [team]: [] }));
    setAlertMsg('');
    return;
  }

  // ===== SEQUENCE MODE =====
  const { count=1 } = currentStep || {};
  for (const it of arr) {
    if (it.type === 'ban') {
      const slotIdx = bans[team].length;
      setBans(b => ({ ...b, [team]: [...b[team], it.hero] }));
      triggerSlotSelectFX(team, 'ban', slotIdx);
    } else {
      const slotIdx = picks[team].length;
      setPicks(p => ({ ...p, [team]: [...p[team], it.hero] }));
      if (!isFinalBO7) setGlobalPicks(g => ({ ...g, [team]: [...g[team], it.hero.name] }));
      const pickIdx = picks[team].length;
      if (preChoose[team][pickIdx]) handleClearPreChoose(team, pickIdx);
      triggerSlotSelectFX(team, 'pick', slotIdx);
    }
    spawnHeroConfirmFX(getImage(it.hero.image), { heroName: it.hero.name });    setHistory(h => [...h, { stepIndex, team, hero: it.hero, type: it.type }]);
    try { onActionEffective?.({ type: it.type, team, heroName: it.hero.name, stepIndex }); } catch {}
    committed++;
  }

  setPending(prev => ({ ...prev, [team]: [] }));
  setAlertMsg('');

  // เดิน step ตามจำนวนที่ commit
  const nextCount = selectionCount + committed;
  if (nextCount >= count) { setStepIndex(i=>i+1); setSelectionCount(0); }
  else setSelectionCount(nextCount);
}
function cancelPending(team){
  setPending(prev => ({ ...prev, [team]: [] }));  // ← ใช้ [] แทน null
}

     // [MOD: 8] — บนสุดของ handleUndo()
function handleUndo(){
  if (readOnly) return;

  // ถ้ามี pending อยู่ ให้เคลียร์ก่อน (ตามทีมเรา หรือกรรมการล้างฝั่งที่มี)
   if ((pending.A?.length) || (pending.B?.length)) {
       if (lockedTeam && (pending[lockedTeam]?.length)) {
         setPending(prev=>({ ...prev, [lockedTeam]: [] }));
      return;
    }
      if (pending.B?.length) { setPending(prev=>({ ...prev, B: [] })); return; }
      if (pending.A?.length) { setPending(prev=>({ ...prev, A: [] })); return; }
  }

  if (!history.length) return;
  // ... (ต่อด้วยของเดิมทั้งหมด)
  const last = history[history.length-1];
  const { stepIndex:lastStep, team, hero, type } = last;

  if (type==='ban') setBans(p=>({ ...p, [team]:p[team].filter(h=>h.name!==hero.name) }));
  else {
    setPicks(p=>({ ...p, [team]:p[team].filter(h=>h.name!==hero.name) }));
    if (globalPicks[team].includes(hero.name))
      setGlobalPicks(g=>({ ...g, [team]:g[team].filter(n=>n!==hero.name) }));
  }

  setHistory(h=>{
    const newH = h.slice(0,-1);
    if (draftMode==='sequence') {
      const countInThatStep = newH.filter(a=>a.stepIndex===lastStep).length;
      setSelectionCount(countInThatStep % (draftSeq[lastStep]?.count||1));
      setStepIndex(lastStep>=0 ? lastStep : stepIndex);
    }
    return newH;
  });
  setAlertMsg('');
  try { onActionEffective?.({ type:'undo', team: last.team, heroName: last.hero?.name, stepIndex: last.stepIndex }); } catch {}
}

     function nextGame(){
      if (readOnly) return;
       if (currentGame < totalGames) {
         setCurrentGame(g=>g+1);
         setStepIndex(0); setSelectionCount(0);
         setBans({A:[],B:[]}); setPicks({A:[],B:[]});
         setHistory([]); setAlertMsg('');
         setSelectedRole('ทั้งหมด'); setSearchTerm('');
         setPreChoose({A:[null,null,null,null,null], B:[null,null,null,null,null]});
         setSelectingPre(null);
       }
     }
     function startSeries(type){
       setBoType(type); setCurrentGame(1);
       setGlobalPicks({A:[],B:[]});
       setCompletedGames([]); setViewingHistory(null);
       setStepIndex(0); setSelectionCount(0);
       setBans({A:[],B:[]}); setPicks({A:[],B:[]});
       setHistory([]); setAlertMsg('');
       setSelectedRole('ทั้งหมด'); setSearchTerm('');
       setPreChoose({A:[null,null,null,null,null], B:[null,null,null,null,null]});
       setSelectingPre(null);
     }
   
     /* ---------- Snapshots (Save/Load) ---------- */
     function makeSnapshot() {
       return {
         gameNo: currentGame,
         time: new Date().toISOString(),
         bans: JSON.parse(JSON.stringify(bans)),
         picks: JSON.parse(JSON.stringify(picks)),
         meta: {
           boType,
           firstPickTeam: FIRST_PICK_TEAM,
           teamARole,
           ourTeamAtGame: ourTeam
         }
       };
     }
     function loadSnapshot(snap) {
       if (!snap) return;
       setDraftMode('free');
       setFreeAction('pick');
       setFreeFocusTeam('A');
       setStepIndex(0); setSelectionCount(0);
       setBans(JSON.parse(JSON.stringify(snap.bans||{A:[],B:[]})));
       setPicks(JSON.parse(JSON.stringify(snap.picks||{A:[],B:[]})));
       setHistory([]);
       setAlertMsg('');
       setSelectedRole('ทั้งหมด'); setSearchTerm('');
       setPreChoose({A:[null,null,null,null,null], B:[null,null,null,null,null]});
       setSelectingPre(null);
     }
   
     // เซฟเกมที่จบแล้ว (เฉพาะ sequence) — กันซ้ำ
     useEffect(()=>{
       if (draftMode==='free') return;
       const finished = stepIndex>=totalSteps;
       if (!boType || !finished) return;
   
       const snap = {
         gameNo: currentGame,
         time: new Date().toISOString(),
         bans: JSON.parse(JSON.stringify(bans)),
         picks: JSON.parse(JSON.stringify(picks)),
         meta: {
           boType,
           firstPickTeam: FIRST_PICK_TEAM,
           teamARole,
           ourTeamAtGame: ourTeam
         }
       };
       setCompletedGames(prev=>{
         const idx = snap.gameNo-1;
         const arr = prev.slice();
         if (arr[idx]) return arr;
         while (arr.length < idx) arr.push(null);
         arr[idx] = snap;
         return arr;
       });
     },[boType,stepIndex,totalSteps,currentGame,bans,picks,draftMode,ourTeam,teamARole]);
   
     useEffect(()=>{
      const onSlash = (e)=>{
        if (e.key === '/' && !e.metaKey && !e.ctrlKey){
          e.preventDefault();
          document.getElementById('hero-search')?.focus();
        }
      };
      window.addEventListener('keydown', onSlash);
      return ()=>window.removeEventListener('keydown', onSlash);
    },[]);
    
     // Esc เพื่อยกเลิก pre-choose
     useEffect(()=>{
       const onKey=e=>{ if (e.key==='Escape') setSelectingPre(null); };
       window.addEventListener('keydown',onKey);
       return ()=>window.removeEventListener('keydown',onKey);
     },[]);
     useEffect(() => {
      attachPressFX();
    }, []);
    useEffect(() => {
        if (startBoType && !boType) {
          startSeries(startBoType);
        }
      }, [startBoType, boType]);
    useEffect(() => {
      attachUltraFX(); // ติดตั้งเอฟเฟกต์คลิก/แตะทั่วหน้า
    }, []);
    // ถ้าล็อกฝั่ง ให้โฟกัส Free Mode ไปที่ทีมเราเสมอ
useEffect(() => {
    if (lockedTeam) setFreeFocusTeam(lockedTeam);
  }, [lockedTeam]);
  useEffect(() => {
    if (draftMode === 'free' && lockedTeam) setFreeFocusTeam(lockedTeam);
  }, [draftMode, lockedTeam]);
     /* ---------- UI ---------- */
    // === REPLACE the existing `if (!boType) { ... }` block with this ===
if (!boType) {
  // ผู้เล่น/ผู้ชม: รอ Host (Referee) กำหนด BO แล้วระบบจะเข้าดราฟอัตโนมัติ
  if (waitForHost) {
    return (
      <div
        className="cg-theme"
        style={{
          minHeight: '100vh',
          background: 'var(--cg-bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <style>{THEME_CSS}</style>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: 12, color: 'var(--cg-text)', fontWeight: 800, letterSpacing: 1 }}>
            รอกรรมการกำหนดรูปแบบการแข่งขัน…
          </h2>
          <div style={{ color: 'var(--cg-muted)' }}>
            เมื่อ Host เลือก BO แล้ว หน้านี้จะเข้าสู่ดราฟอัตโนมัติ
          </div>
        </div>
      </div>
    );
  }
// ใน DraftPage component
if (isMobileLandscape) {
  return (
    <div className="cg-theme cg-insane mobile-landscape">
      <style>{THEME_CSS}</style>
      
      {/* Simplified Mobile Layout */}
      <div className="mobile-draft-container">
        {/* Top Bar */}
        <div className="mobile-top-bar">
          <div className="mobile-timer">
            <TurnTimer /* props */ />
          </div>
          <div className="mobile-actions">
            <button onClick={handleUndo}>↩️</button>
            <button onClick={() => setDraftMode('free')}>🔄</button>
          </div>
        </div>
        
        {/* Teams Side by Side */}
        <div className="mobile-teams-container">
          <div className="mobile-team">
            <div className="team-header">ทีม A</div>
            <div className="team-picks">
              {renderSlots(picks.A, 5, 'A', 'pick')}
            </div>
            <div className="team-bans">
              {renderSlots(bans.A, 4, 'A', 'ban')}
            </div>
          </div>
          
          <div className="mobile-team">
            <div className="team-header">ทีม B</div>
            <div className="team-picks">
              {renderSlots(picks.B, 5, 'B', 'pick')}
            </div>
            <div className="team-bans">
              {renderSlots(bans.B, 4, 'B', 'ban')}
            </div>
          </div>
        </div>
        
        {/* Hero Selection */}
        <div className="mobile-hero-selector">
          {renderHeroGrid(opTeamForPanel)}
        </div>
      </div>
    </div>
  );
}
  // Referee/Host: เลือก BO (เหมือนเดิม)
  return (
    <div className="cg-theme" style={{ minHeight: '100vh', background: 'var(--cg-bg)' }}>
      <style>{THEME_CSS}</style>

      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <h1 style={{ color: 'var(--cg-text)', marginBottom: 32, letterSpacing: 2, fontWeight: 800 }}>
          เลือกรูปแบบ BO
        </h1>
        <div style={{ display: 'flex', gap: 32 }}>
          {Object.keys(BO_OPTIONS).map((t) => (
            <button
              key={t}
              onClick={() => startSeries(t)}
              style={{
                padding: '22px 56px',
                fontSize: 28,
                fontWeight: 800,
                borderRadius: 18,
                background: 'var(--cg-primary)',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                boxShadow: '0 4px 24px rgba(108,76,246,.5)'
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

     const panelColors = {
       A: teamARole==='red' ? 'var(--cg-panelA)' : 'var(--cg-panelB)',
       B: teamARole==='red' ? 'var(--cg-panelB)' : 'var(--cg-panelA)',
     };
   // เปิดกรอบเฉพาะโหมด sequence และเมื่อมีทีมที่กำลังถึงตา
const turnOnLeft  = (draftMode!=='free') && (highlightTeam===LEFT_TEAM_ID);
const turnOnRight = (draftMode!=='free') && (highlightTeam===RIGHT_TEAM_ID);

// สีกรอบ: ถ้าเป็น ban ใช้ danger, ถ้า pick ใช้ info (จะดูเด่นพอดี)
// อยากเปลี่ยนเป็นเขียวนีออนใช้ '--cg-accent' ก็ได้
const turnColorVar = (highlightType==='ban') ? 'var(--cg-danger)' : 'var(--cg-info)';

     return viewingHistory!==null ? (
       <div className="cg-theme cg-insane">
         <style>{THEME_CSS}</style>
              {/* Inline Referee Console (ใช้ bus อันเดียวกับ DraftPage) */}
         <HistoryView
           list={completedGames.filter(Boolean)}
           onBack={()=>setViewingHistory(null)}
           onInspect={(snap)=>setViewingHistory({ view:'detail', snap })}
           onLoad={(snap)=>{ loadSnapshot(snap); setViewingHistory(null); }}
         />
       </div>
     ) : (
       <div className="cg-theme cg-insane">
         <style>{THEME_CSS}</style>
   
         {/* Top controls */}
          {/* === TOP TOOLBAR (3 โซน) === */}
<div className="toolbar cg-toolbar-3" data-role="toolbar">
  {/* --- ซ้าย: ตัวเลือกแสดงแบน + FS/Second + Free controls --- */}
  <div className="left">
    <div>
      <strong style={{ color:'var(--cg-text)', marginRight:8 }}>แสดงแบน</strong>
      <label style={{ marginRight:12, color:'var(--cg-text)' }}>
        <input type="radio" checked={banLayout==='vertical'} onChange={()=>setBanLayout('vertical')} /> แนวตั้ง
      </label>
      <label style={{ color:'var(--cg-text)' }}>
        <input type="radio" checked={banLayout==='horizontal'} onChange={()=>setBanLayout('horizontal')} /> แนวนอน
      </label>
    </div>

    {/* สลับ เราฝั่ง First/Second */}
    {!lockedTeam ? (
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <strong style={{ color:'var(--cg-text)' }}>เราฝั่ง:</strong>
        <label style={{ color:'var(--cg-text)' }}>
          <input type="radio" checked={weAreFirst} onChange={()=>setWeAreFirst(true)} /> First
        </label>
        <label style={{ color:'var(--cg-text)' }}>
          <input type="radio" checked={!weAreFirst} onChange={()=>setWeAreFirst(false)} /> Second
        </label>
      </div>
    ) : (
      <div style={{ color:'var(--cg-text)', fontWeight:800 }}>
        ทีมของคุณ: <span style={{ color:'var(--cg-accent)' }}>{lockedTeam}</span>
      </div>
    )}

    {/* Free draft toolbar (ของเดิมทั้งก้อน) */}
    <div style={{ display:'flex', gap:8, alignItems:'center' }}>
      <button
        onClick={() => setDraftMode(d => d === 'free' ? 'sequence' : 'free')}
        disabled={readOnly}
        style={{
          padding:'8px 12px',
          borderRadius:10,
          border:'1px solid var(--cg-border)',
          background: draftMode==='free' ? 'var(--cg-warning)' : 'var(--cg-surface-2)',
          color: draftMode==='free' ? '#23232a' : 'var(--cg-muted)',
          fontWeight:900,
          cursor: readOnly ? 'not-allowed' : 'pointer',
          opacity: readOnly ? .6 : 1
        }}
      >
        {draftMode==='free' ? 'Free Style Mode: ON' : 'Free Style Mode: OFF'}
      </button>

      {draftMode==='free' && (
        <>
          <button
            onClick={() => setFreeAction('pick')}
            disabled={readOnly}
            style={{
              padding:'6px 10px', borderRadius:10, border:'none',
              background: freeAction==='pick' ? 'var(--cg-info)' : 'var(--cg-surface-2)',
              color:'#0f1220', fontWeight:900, cursor: readOnly ? 'not-allowed' : 'pointer', opacity: readOnly ? .6 : 1
            }}
          >Pick</button>

          <button
            onClick={() => setFreeAction('ban')}
            disabled={readOnly}
            style={{
              padding:'6px 10px', borderRadius:10, border:'none',
              background: freeAction==='ban' ? 'var(--cg-danger)' : 'var(--cg-surface-2)',
              color:'#fff', fontWeight:900, cursor: readOnly ? 'not-allowed' : 'pointer', opacity: readOnly ? .6 : 1
            }}
          >Ban</button>

          {lockedTeam ? (
            <span className="pill" style={{
              padding:'6px 10px', borderRadius:999, border:'1px solid var(--cg-border)',
              background:'rgba(255,255,255,.07)', color:'var(--cg-text)', fontWeight:900
            }}>
              Team {lockedTeam}
            </span>
          ) : (
            <>
              <button
                onClick={() => setFreeFocusTeam('A')}
                disabled={readOnly}
                style={{
                  padding:'6px 10px', borderRadius:10, border:'none',
                  background: freeFocusTeam==='A' ? 'var(--cg-panelA)' : 'var(--cg-surface-2)',
                  color:'#0f1220', fontWeight:900, cursor: readOnly ? 'not-allowed' : 'pointer', opacity: readOnly ? .6 : 1
                }}
              >Team A</button>
              <button
                onClick={() => setFreeFocusTeam('B')}
                disabled={readOnly}
                style={{
                  padding:'6px 10px', borderRadius:10, border:'none',
                  background: freeFocusTeam==='B' ? 'var(--cg-panelB)' : 'var(--cg-surface-2)',
                  color:'#0f1220', fontWeight:900, cursor: readOnly ? 'not-allowed' : 'pointer', opacity: readOnly ? .6 : 1
                }}
              >Team B</button>
            </>
          )}
        </>
      )}
    </div>
  </div>

  {/* --- กลาง: TIMER docked เท่านั้น --- */}
  <div className="center">
    {timerDock.mode === 'docked' && (
      <>
        {renderTimerHUD()}
        <button
          className="btn-like"
          onClick={() => setTimerDock(d => ({ ...d, mode:'floating' }))}
          title="ปลดพินให้ลอย"
          style={{ padding:'6px 10px', marginLeft:8 }}
        >📌 Unpin</button>
      </>
    )}
  </div>

  {/* --- ขวา: Save + History --- */}
  <div className="right">
    <button
      onClick={()=>{
        const snap = makeSnapshot();
        setCompletedGames(prev=>{
          const idx = snap.gameNo-1; const arr = prev.slice();
          while (arr.length < idx) arr.push(null); arr[idx] = snap; return arr;
        });
        setAlertMsg('Saved snapshot!'); setTimeout(()=>setAlertMsg(''), 1200);
      }}
      className="btn-like"
      style={{ background:'var(--cg-info)', color:'#0f1220' }}
    >
      💾 Save Game
    </button>

    <button
      onClick={()=>setViewingHistory({ view:'list' })}
      className="btn-like"
      style={{ background:'var(--cg-warning)', color:'#23232a' }}
    >
      🕘 History
    </button>
  </div>
</div>

   
         {/* Main layout */}
<div style={{ display:'flex', height:'100vh', background:'var(--cg-bg)', position:'relative' }}>
  {/* Left Panel (ตรึงซ้าย = A) */}
  <div
    className={`turn-frame ${turnOnLeft ? 'is-on' : ''}`}
    style={{
      width: 170,
      background: panelColors[LEFT_TEAM_ID],
      padding: 17,
      boxShadow: '2px 0 18px #000d',
      borderRadius: '0 28px 28px 0',
      border: `3px solid ${highlightTeam === LEFT_TEAM_ID ? highlightColor : 'transparent'}`,
      '--turn-color': turnColorVar,
    }}>
    {/* ------ เนื้อหา Left Panel ------ */}
    <h4 style={{ color:'#fff', textAlign:'center' }}>
      {teamLabel(LEFT_TEAM_ID)}
      {weAreFirst && (
        <span style={{
          marginLeft:6, padding:'2px 6px', borderRadius:8,
          background:'var(--cg-warning)', color:'#23232a', fontWeight:900, fontSize:11
        }}>OWN</span>
      )}
    </h4>

    {/* ใน Left Panel หลัง <h4> ... */}
{draftMode!=='free' && highlightTeam===LEFT_TEAM_ID && (
  <>
    <div
      style={{
        margin:'6px auto 6px',
        width: 100,
        textAlign: 'center',
        background: 'var(--cg-accent)',
        color: '#0f1220',
        fontWeight: 900,
        padding: '4px 8px',
        borderRadius: 999,
        animation: 'pulsePick .9s ease-in-out infinite',
        boxShadow: '0 0 16px rgba(57,255,20,.5)',
      }}
    >
      PICKING
    </div>

    {/* ⏱ เวลาใต้ป้าย PICKING */}
    <div
      style={{
        margin:'0 auto 8px',
        padding:'4px 10px',
        borderRadius:8,
        background: currentStep?.type==='ban' ? 'var(--cg-danger)' : 'var(--cg-info)',
        color: currentStep?.type==='ban' ? '#fff' : '#0f1220',
        fontWeight:900,
        textAlign:'center',
        width: 100
      }}
    >
      ⏱ {String(Math.floor(turnSecondsLeft/60)).padStart(2,'0')}:
         {String(turnSecondsLeft%60).padStart(2,'0')}
      {isPaused ? ' (PAUSED)' : ''}
    </div>
  </>
)}

    {banLayout==='vertical' && (
      <>
        <strong style={{ color:'var(--cg-warning)' }}>Bans</strong>
        <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center' }}>
          {renderSlots(bans[LEFT_TEAM_ID],4,LEFT_TEAM_ID,'ban')}
        </div>
      </>
    )}

    <strong style={{ color:'var(--cg-info)' }}>Picks</strong>
    <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center' }}>
      {renderSlots(picks[LEFT_TEAM_ID],5,LEFT_TEAM_ID,'pick')}
    </div>
  </div>

  {/* Center */}
  <div style={{ flex:1, position:'relative', overflowY:'auto', padding:40, background:'var(--cg-surface)' }}>
    {renderLegend()}

    {/* Header bar (หัวข้อกึ่งกลาง) */}
<div style={{ position:'relative', display:'flex', alignItems:'center', marginBottom:14 }}>

  <strong style={{
    position:'absolute', left:'50%', transform:'translateX(-50%)',
    fontSize:21, color:'var(--cg-accent)', fontWeight:800,
    textShadow:'0 2px 18px rgba(57,255,20,.56)'
  }}>
    {draftMode==='free'
      ? `Free Draft • Game ${currentGame}/${totalGames}`
      : `Game ${currentGame}/${totalGames} • ${currentStep.type==='ban'?'Ban':'Pick'} ${stepIndex+1}/${totalSteps}`}
  </strong>

  <button
    onClick={readOnly ? undefined : handleUndo}
    disabled={readOnly || !history.length}
    style={{
      marginLeft:'auto',
      padding:'7px 22px', borderRadius:17, border:'none',
      background:history.length?'var(--cg-warning)':'#333',
      color:history.length?'#23232a':'#666',
      cursor:history.length?'pointer':'not-allowed', fontWeight:800
    }}>แก้ไข</button>
</div>

{/* ★ แถวของตัวจับเวลาเดิม—อีกบรรทัด กลางหน้า ใหญ่เด่น */}
<div className="cg-timer-row">
  {(() => {
    const warn   = turnSecondsLeft <= 10 && turnSecondsLeft > 5;
    const danger = turnSecondsLeft <= 5;
    const mm = String(Math.floor(turnSecondsLeft / 60)).padStart(2,'0');
    const ss = String(turnSecondsLeft % 60).padStart(2,'0');
    return (
      <div className={`countdown-timer ${warn ? 'is-warn' : ''} ${danger ? 'is-danger' : ''}`} aria-live="polite">
        <span className="ico">⏱️</span>
        <span className="t">{mm}:{ss}{isPaused ? ' (PAUSED)' : ''}</span>
      </div>
    );
  })()}
</div>

    {/* Bans (horizontal) */}
    {banLayout==='horizontal' && (
      <div style={{ margin:'10px 0 18px', background:'var(--cg-surface-2)', borderRadius:12, padding:10, boxShadow:'0 2px 12px #0008', border:'1px solid var(--cg-border)' }}>
        <div style={{ display:'flex', alignItems:'stretch', gap:10 }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ color:'var(--cg-warning)', fontWeight:900, marginBottom:6 }}>
              {teamLabel(LEFT_TEAM_ID)} Bans
            </div>
            <div style={{ display:'flex', gap:8, overflowX:'auto' }}>
              {renderSlots(bans[LEFT_TEAM_ID],4,LEFT_TEAM_ID,'ban')}
            </div>
          </div>
          <div style={{ width:2, background:'var(--cg-border)', borderRadius:1 }} />
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ color:'var(--cg-warning)', fontWeight:900, marginBottom:6, textAlign:'right' }}>
              {teamLabel(RIGHT_TEAM_ID)} Bans
            </div>
            <div style={{ display:'flex', gap:8, justifyContent:'flex-end', overflowX:'auto' }}>
              {renderSlots(bans[RIGHT_TEAM_ID],4,RIGHT_TEAM_ID,'ban')}
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Filters */}
<div style={{ position:'relative' }}>
  <div style={{ display:'flex', gap:10, flexWrap:'wrap', margin:'4px 0 8px' }}>
    {roleList.map(role=>(
      <button key={role} onClick={()=>setSelectedRole(role)} style={{
        padding:'8px 23px', borderRadius:18, border:'none',
        background:selectedRole===role?'var(--cg-primary)':'var(--cg-bg-2)',
        color:selectedRole===role?'#fff':'var(--cg-muted)', fontWeight:800, cursor:'pointer'
      }}>{ROLE_ICON[role]} {role}</button>
    ))}

    {/* ชิปกรองเร็ว */}
    <label className="chip" style={{ cursor:'pointer' }}>
      <input type="checkbox" checked={onlyActionable} onChange={e=>setOnlyActionable(e.target.checked)} /> เฉพาะที่กดได้ตอนนี้
    </label>
    <label className="chip" style={{ cursor:'pointer' }}>
      <input type="checkbox" checked={hideUsed} onChange={e=>setHideUsed(e.target.checked)} /> ซ่อนที่ใช้แล้ว
    </label>

    {/* ช่องค้นหา */}
    <input
      id="hero-search"
      type="text"
      placeholder="🔍 พิมพ์ชื่อ/ฉายา… (กด / เพื่อค้นหาเร็ว)"
      value={searchTerm}
      onChange={e=>setSearchTerm(e.target.value)}
      onKeyDown={(e)=>{
        if (e.key === 'Enter'){
          const top = filteredHeroList2[0];
          if (top){
            if (draftMode==='free') doFreeAction(top, lockedTeam || freeFocusTeam, freeAction);
            else handleHeroClick(top);
          }
        }
      }}
      style={{
        marginLeft:12, padding:'0 16px', height:38, borderRadius:17, border:'1px solid var(--cg-border)',
        background:'var(--cg-bg-2)', color:'var(--cg-text)', fontWeight:600, letterSpacing:1, minWidth:260
      }}/>
  </div>

  {/* Typeahead (Top 5) */}
  {searchTerm.trim() && (
    <div style={{
      position:'absolute', zIndex:30, marginTop:2, background:'var(--cg-surface)',
      border:'1px solid var(--cg-border)', borderRadius:12, minWidth:260, boxShadow:'0 12px 28px rgba(0,0,0,.48)'
    }}>
      {filteredHeroList2.slice(0,5).map(h=>(
        <div key={h.name}
          onMouseDown={()=>{
            if (draftMode==='free') doFreeAction(h, lockedTeam || freeFocusTeam, freeAction);
            else handleHeroClick(h);
          }}
          style={{ padding:'8px 12px', cursor:'pointer' }}
        >
          <strong>{h.name}</strong> <span style={{ opacity:.7 }}>• {normalizeRole(h.role)}</span>
        </div>
      ))}
    </div>
  )}
</div>
    {alertMsg && (
      <div style={{
        background:'var(--cg-danger)', color:'#FFFFFF', padding:14, borderRadius:12,
        textAlign:'center', fontWeight:800, marginBottom:14, border:'1px solid rgba(0,0,0,.25)',
        boxShadow:'0 6px 18px rgba(0,0,0,.35)'
      }}>
        {alertMsg}
        <button onClick={()=>setAlertMsg('')} style={{
          marginLeft:16, background:'transparent', border:'none',
          color:'#FFFFFF', cursor:'pointer', fontWeight:900
        }}>×</button>
      </div>
    )}

    {/* Mini strip (optional) */}
    {focusedTeam && (
      <div style={{ display:'flex', justifyContent: focusedTeam==='A' ? 'flex-end' : 'flex-start', marginBottom:12 }}>
        {focusedTeam===LEFT_TEAM_ID
          ? <MiniSummaryStrip label ={teamLabel(RIGHT_TEAM_ID)} bansArr={bans[RIGHT_TEAM_ID]} picksArr={picks[RIGHT_TEAM_ID]} align="right" />
          : <MiniSummaryStrip label={teamLabel(LEFT_TEAM_ID)}  bansArr={bans[LEFT_TEAM_ID]}  picksArr={picks[LEFT_TEAM_ID]}  align="left" />
        }
      </div>
    )}

    {/* Two hero grids */}

    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
      <div className={`turn-col ${turnOnLeft ? 'is-on' : ''}`}
           style={{ '--turn-color':turnColorVar, '--turn-thickness':'7px', '--turn-radius':'18px' }}>
        {renderHeroGrid(LEFT_TEAM_ID)}
      </div>
      <div className={`turn-col ${turnOnRight ? 'is-on' : ''}`}
           style={{ '--turn-color':turnColorVar, '--turn-thickness':'7px', '--turn-radius':'18px' }}>
        {renderHeroGrid(RIGHT_TEAM_ID)}
      </div>
    </div>

    {/* Next Game */}
    {(stepIndex>=totalSteps || draftMode==='free') && currentGame<totalGames && (
      <div style={{ textAlign:'center', marginTop:24 }}>
        <button onClick={nextGame} style={{
          padding:'10px 30px', borderRadius:17, border:'none',
          background:'var(--cg-info)', color:'#23232a', fontWeight:800, cursor:'pointer', fontSize:17
        }}>Next Game &gt;</button>
      </div>
    )}
  </div>

  {/* Right Panel (ตรึงขวา = B) — เหลือตัวเดียว */}
  <div
    className={`turn-frame ${turnOnRight ? 'is-on' : ''}`}
    style={{
      width: 170,
      background: panelColors[RIGHT_TEAM_ID],
      padding: 17,
      boxShadow: '-2px 0 18px #000d',
      borderRadius: '28px 0 0 28px',
      border: `3px solid ${highlightTeam === RIGHT_TEAM_ID ? highlightColor : 'transparent'}`,
      '--turn-color': turnColorVar,
    }}>
    {/* ------ เนื้อหา Right Panel ------ */}
    <h4 style={{ color:'#fff', textAlign:'center' }}>
      {teamLabel(RIGHT_TEAM_ID)}
      {!weAreFirst && (
        <span style={{
          marginLeft:6, padding:'2px 6px', borderRadius:8,
          background:'var(--cg-warning)', color:'#23232a', fontWeight:900, fontSize:11
        }}>OWN</span>
      )}
    </h4>

    {draftMode!=='free' && highlightTeam===RIGHT_TEAM_ID && (
  <>
    <div
      style={{
        margin:'6px auto 6px',
        width: 100,
        textAlign: 'center',
        background: 'var(--cg-accent)',
        color: '#0f1220',
        fontWeight: 900,
        padding: '4px 8px',
        borderRadius: 999,
        animation: 'pulsePick .9s ease-in-out infinite',
        boxShadow: '0 0 16px rgba(57,255,20,.5)',
      }}
    >
      PICKING
    </div>

    <div
      style={{
        margin:'0 auto 8px',
        padding:'4px 10px',
        borderRadius:8,
        background: currentStep?.type==='ban' ? 'var(--cg-danger)' : 'var(--cg-info)',
        color: currentStep?.type==='ban' ? '#fff' : '#0f1220',
        fontWeight:900,
        textAlign:'center',
        width: 100
      }}
    >
      ⏱ {String(Math.floor(turnSecondsLeft/60)).padStart(2,'0')}:
         {String(turnSecondsLeft%60).padStart(2,'0')}
      {isPaused ? ' (PAUSED)' : ''}
    </div>
  </>
)} 


    {banLayout==='vertical' && (
      <>
        <strong style={{ color:'var(--cg-warning)' }}>Bans</strong>
        <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center' }}>
          {renderSlots(bans[RIGHT_TEAM_ID],4,RIGHT_TEAM_ID,'ban')}
        </div>
      </>
    )}

    <strong style={{ color:'var(--cg-info)' }}>Picks</strong>
    <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center' }}>
      {renderSlots(picks[RIGHT_TEAM_ID],5,RIGHT_TEAM_ID,'pick')}
    </div>
  </div>
</div>

{/* ==== Floating Confirm Bar (กลางล่าง) ==== */}
{(() => {
  // ใครมีสิทธิ์กด?
  const canOperate = (!lockedTeam && !readOnly) || (!!lockedTeam);
  if (!canOperate) return null;

  // ทีมที่เราคุมปุ่ม:
  const opTeam =
    lockedTeam ||
    (draftMode === 'sequence' ? (currentStep?.team || 'A') : (freeFocusTeam || 'A'));

  const arr = pending?.[opTeam] || [];
  if (!arr.length) return null;

  // ปุ่ม Confirm เปิดเมื่อ:
  let confirmEnabled = true;
  if (draftMode === 'sequence' && currentStep) {
    const need = currentStep.count || 1;
    const sameTypeOnly = arr.every((x) => x.type === currentStep.type);
    const enough = arr.filter((x) => x.type === currentStep.type).length === need;
    const sameTeam = opTeam === currentStep.team;
    confirmEnabled = sameTeam && sameTypeOnly && enough;
  } else {
    confirmEnabled = arr.length > 0;
  }

  const sampleType = arr[0]?.type || 'pick';
  const barColor   = sampleType === 'ban' ? 'var(--cg-danger)' : 'var(--cg-info)';
  const txtColor   = sampleType === 'ban' ? '#fff' : '#0f1220';

  return (
    <>
    {/* [TIMER_DOCK] Floating panel */}
{timerDock.mode === 'floating' && (
  <div
    ref={timerDockRef}
    className="card"
    style={{
      position:'fixed',
      left: timerDock.x,
      top:  timerDock.y,
      zIndex: 10040,               // สูงกว่าคอนโซล/คอนเฟิร์มเล็กน้อย
      padding: 8,
      borderRadius: 14,
      background:'rgba(20,26,43,.86)',
      backdropFilter:'blur(10px)',
      WebkitBackdropFilter:'blur(10px)',
      border:'1px solid var(--cg-border)',
      boxShadow:'0 16px 34px rgba(0,0,0,.5), 0 2px 8px rgba(0,0,0,.25)',
      cursor:'grab',
      userSelect:'none'
    }}
    onPointerDown={onTimerPointerDown}
    onDoubleClick={() => setTimerDock(d => ({ ...d, x:16, y: Math.max(12, Math.ceil(getToolbarBottom() + 12)) }))} // รีเซ็ตตำแหน่งด้วยดับเบิลคลิก (ออปชัน)
  >
    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      {renderTimerHUD()}
      <button
        className="btn-like"
        onClick={(e) => {
          e.stopPropagation();
          setTimerDock(d => ({ ...d, mode:'docked' }));
        }}
        title="ปักกลับ toolbar"
        style={{ padding:'6px 10px' }}
      >📌 Dock</button>
    </div>
  </div>
)}
      {/* แอนิเมชันเข้า/ออก */}
      <style>{`
        @keyframes cg-float-in {
          0% { transform: scale(.9); opacity: 0; }
          100%{ transform: scale(1);  opacity: 1; }
        }
        .cg-float-panel .grip{ cursor: grab; }
        .cg-float-panel .grip:active{ cursor: grabbing; }
      `}</style>

      {/* ▶ พาเนิลลอย: fixed + draggable */}
      <div
  ref={confirmRef}
  className="cg-float-panel card"
  style={{
    position: 'fixed',
    left: floatPos.x,
    top:  floatPos.y,
    zIndex: 10020,
    background: 'var(--cg-surface)',
    border: '1px solid var(--cg-border)',
    boxShadow: '0 20px 38px rgba(0,0,0,.55), 0 3px 12px rgba(0,0,0,.35)',
    borderRadius: 16,
    padding: 10,
    minWidth: 280,
    maxWidth: '70vw',
    animation: 'cg-float-in .18s ease-out',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
  }}
  onPointerDown={(e) => {
    if ((e.target).closest('button')) return;
    onConfirmPanelPointerDown(e);
  }}
      >
        {/* หัวจับลาก + ปิด */}
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
          <div
            className="grip"
            onPointerDown={onConfirmPanelPointerDown}
            title="ลากเพื่อย้ายตำแหน่ง"
            style={{
              display:'inline-flex', alignItems:'center', gap:8,
              color:'var(--cg-muted)', fontWeight:800,
              padding:'2px 6px', borderRadius:8, background:'rgba(255,255,255,.06)'
            }}
          >
            ⠿ Pending
            {draftMode==='sequence' && currentStep?.count > 1 && (
              <span style={{ opacity:.85 }}>
                ({arr.filter(x => x.type === currentStep.type).length}/{currentStep.count})
              </span>
            )}
          </div>

          <div style={{ marginLeft:'auto', display:'flex', gap:6 }}>
            <button
              onClick={() => cancelPending(opTeam)}
              className="btn-like"
              style={{
                background: 'rgba(255,255,255,.08)',
                color: 'var(--cg-text)',
                padding: '6px 10px',
                fontWeight: 900
              }}
              title="ยกเลิกรายการที่รอคอนเฟิร์มทั้งหมด"
            >
              Cancel
            </button>
            <button
              onClick={() => confirmPending(opTeam)}
              disabled={!confirmEnabled}
              className="btn-like"
              style={{
                background: confirmEnabled ? barColor : '#444',
                color: txtColor,
                padding: '8px 14px',
                fontWeight: 900,
                opacity: confirmEnabled ? 1 : 0.6,
                cursor: confirmEnabled ? 'pointer' : 'not-allowed'
              }}
              title={confirmEnabled ? 'ยืนยัน' : 'เลือกให้ครบก่อน'}
            >
              Confirm
            </button>
          </div>
        </div>

        {/* รายการ pending (เลื่อนในแนวนอนได้) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            maxWidth: '60vw',
            overflowX: 'auto',
            paddingBottom: 2
          }}
        >
          {arr.map((it, idx) => (
            <div
              key={idx}
              title={`${it.type.toUpperCase()} • ${it.hero.name}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 8px',
                borderRadius: 10,
                background: 'rgba(255,255,255,.06)',
                border: '1px solid rgba(255,255,255,.12)',
                whiteSpace: 'nowrap'
              }}
            >
              <img
                src={getImage(it.hero.image)}
                alt={it.hero.name}
                style={{ width: 24, height: 24, borderRadius: 6, objectFit: 'cover' }}
              />
              <span style={{ fontSize: 12, fontWeight: 900, color: 'var(--cg-text)' }}>
                {it.hero.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
})()}


{/* Pulse + Minor helpers */}
<style>{`
  @keyframes pulsePick {
    0%   { transform: translateZ(0) scale(1); }
    50%  { transform: translateZ(0) scale(1.04); }
    100% { transform: translateZ(0) scale(1); }
  }
`}</style>
       </div>
     );
   } // ← ปิดฟังก์ชัน DraftPage
   
   /* ---------- History View (คงลอจิกเดิม ปรับสกิน) ---------- */
   function HistoryView({ list, onBack, onInspect, onLoad }) {
     const [selected, setSelected] = React.useState(null);
   
     if (!list || list.length===0) {
       return (
         <div className="cg-theme cg-insane">
           <style>{THEME_CSS}</style>
           <div style={{ padding:40, color:'var(--cg-text)', background:'var(--cg-bg)', minHeight:'100vh' }}>
             <button onClick={onBack} className="btn-like" style={{
               background:'var(--cg-warning)', color:'#23232a'
             }}>← กลับ</button>
             <div style={{ marginTop:16, opacity:.8 }}>ยังไม่มีสแนปช็อตที่บันทึก</div>
           </div>
         </div>
       );
     }
   
     const data = selected || null;
   
     return (
       <div className="cg-theme cg-insane">
         <style>{THEME_CSS}</style>
         <div style={{
           minHeight:'100vh', background:'var(--cg-bg)', padding:30, color:'var(--cg-text)'
         }}>
           <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
             <button onClick={onBack} className="btn-like" style={{
               background:'var(--cg-warning)', color:'#23232a'
             }}>← กลับ</button>
             <div style={{ fontWeight:900, letterSpacing:1 }}>History</div>
           </div>
   
           <div style={{ display:'grid', gridTemplateColumns:'280px 1fr', gap:16 }}>
            {/* Main layout - ปรับสำหรับแนวนอน */}
<div style={{ 
  display:'flex', 
  height:'100vh', 
  background:'var(--cg-bg)', 
  position:'relative',
  flexDirection: window.innerWidth <= 1024 && window.innerHeight < window.innerWidth ? 'column' : 'row'
}}>
  
  {/* Side Panels - ซ่อนหรือลดขนาดในแนวนอน */}
  <div style={{
    width: window.innerWidth <= 1024 && window.innerHeight < window.innerWidth ? '140px' : '170px',
    display: window.innerWidth <= 768 && window.innerHeight < window.innerWidth ? 'none' : 'block'
  }}>
    {/* Left Panel Content */}
  </div>

  {/* Center Content - ขยายเต็มในแนวนอน */}
  <div style={{ 
    flex: 1, 
    position:'relative', 
    overflowY:'auto', 
    padding: window.innerWidth <= 1024 && window.innerHeight < window.innerWidth ? '20px' : '40px'
  }}>
    
    {/* Hero Grids - เปลี่ยนเป็นแถวเดียวในแนวนอน */}
    <div style={{ 
      display: window.innerWidth <= 1024 && window.innerHeight < window.innerWidth ? 'flex' : 'grid',
      gridTemplateColumns: window.innerWidth <= 1024 && window.innerHeight < window.innerWidth ? '1fr' : '1fr 1fr',
      gap: window.innerWidth <= 1024 && window.innerHeight < window.innerWidth ? '16px' : '24px',
      flexDirection: 'column'
    }}>
      {renderHeroGrid(LEFT_TEAM_ID)}
      {renderHeroGrid(RIGHT_TEAM_ID)}
    </div>
  </div>

</div>
             {/* Left: list */}
             <div style={{ background:'var(--cg-surface)', borderRadius:14, padding:12, border:'1px solid var(--cg-border)' }}>
               {list.map((snap, i)=>(
                 <div key={i}
                   onClick={()=>{ setSelected(snap); onInspect?.(snap); }}
                   style={{
                     padding:'10px 12px', borderRadius:10, cursor:'pointer',
                     background: (data?.time===snap.time) ? 'rgba(255,255,255,.08)' : 'transparent',
                     border: '1px solid rgba(255,255,255,.12)', marginBottom:8
                   }}
                 >
                   <div style={{ fontWeight:900 }}>
                     Game {snap.gameNo} <span style={{ opacity:.7, fontSize:12 }}>({new Date(snap.time).toLocaleString()})</span>
                   </div>
                   <div style={{ fontSize:12, opacity:.85 }}>
                     Opp: {snap.meta?.opponent || '-'} • BO: {snap.meta?.boType || '-'} • FP: {snap.meta?.firstPickTeam || '-'}
                   </div>
                 </div>
               ))}
             </div>
   
             {/* Right: detail */}
             <div style={{ background:'var(--cg-surface)', borderRadius:14, padding:16, minHeight:280, border:'1px solid var(--cg-border)' }}>
               {data ? (
                 <>
                   <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                     <div style={{ fontWeight:900, fontSize:18 }}>
                       Game {data.gameNo}
                     </div>
                     <div style={{ opacity:.8, fontSize:12 }}>{new Date(data.time).toLocaleString()}</div>
                     <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
                       <button onClick={()=>onLoad?.(data)} className="btn-like" style={{
                         background:'var(--cg-info)', color:'#0f1220'
                       }}>Load to board</button>
                       <button onClick={()=>{
                         const txt = JSON.stringify(data, null, 2);
                         navigator.clipboard?.writeText(txt);
                       }} className="btn-like" style={{
                         background:'rgba(255,255,255,.06)', color:'var(--cg-text)',
                         border:'1px solid rgba(255,255,255,.16)'
                       }}>Copy JSON</button>
                     </div>
                   </div>
   
                   <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                     {['A','B'].map(team=>(
                       <div key={team} style={{ background:'var(--cg-surface-2)', borderRadius:12, padding:12, border:'1px solid var(--cg-border)' }}>
                         <div style={{ fontWeight:900, marginBottom:6 }}>
                           Team {team}
                         </div>
   
                         <div style={{ fontSize:12, opacity:.85, marginBottom:6, color:'var(--cg-warning)' }}>Bans</div>
                         <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:8 }}>
                           {(data.bans?.[team]||[]).map((h,i)=>(
                             <HistoryBubble key={team+'-b-'+i} hero={h}/>
                           ))}
                         </div>
   
                         <div style={{ fontSize:12, opacity:.85, marginBottom:6, color:'var(--cg-info)' }}>Picks</div>
                         <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                           {(data.picks?.[team]||[]).map((h,i)=>(
                             <HistoryBubble key={team+'-p-'+i} hero={h}/>
                           ))}
                         </div>
                       </div>
                     ))}
                   </div>
                 </>
               ) : (
                 <div style={{ opacity:.8 }}>เลือกเกมจากด้านซ้ายเพื่อดูรายละเอียด</div>
               )}
             </div>
           </div>
         </div>
       </div>
     );
   }
   
   function HistoryBubble({ hero }) {
     if (!hero) return null;
     return (
       <div title={hero.name} style={{
         display:'flex', alignItems:'center', gap:6, padding:'4px 8px',
         borderRadius:10, background:'rgba(255,255,255,.06)',
         border:'1px solid rgba(255,255,255,.12)'
       }}>
         <img src={getImage(hero.image)} alt={hero.name} style={{ width:22, height:22, borderRadius:6, objectFit:'cover' }}/>
         <span style={{ fontSize:12, fontWeight:800, color:'var(--cg-text)' }}>{hero.name}</span>
       </div>
     );
   }
   // เพิ่ม Hook ใหม่
function useOrientation() {
  const [isLandscape, setIsLandscape] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setIsLandscape(width > height);
      setIsMobile(width <= 1024);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  return { isLandscape, isMobile, isMobileLandscape: isMobile && isLandscape };
}

// ใช้ใน component
export default function DraftPage({ ...props }) {
  const { isMobileLandscape, isLandscape } = useOrientation();
  
  // ใน renderHeroGrid ปรับขนาด
  function renderHeroGrid(viewTeam) {
    return (
      <div className={`hero-grid-container ${isMobileLandscape ? 'mobile-landscape' : ''}`}>
        <div style={{ 
          marginBottom: isMobileLandscape ? 6 : 10,
          fontSize: isMobileLandscape ? 14 : 15 
        }}>
          ฮีโร่ฝั่ง {teamLabel(viewTeam)}
        </div>
        
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: isMobileLandscape ? 8 : 17 
        }}>
          {/* Hero cards */}
        </div>
      </div>
    );
  }
}
   function getToolbarBottom(){
      try{
        const tb = document.querySelector(
          '[data-role="toolbar"], .cg-theme .toolbar, .toolbar'
        );
        if (!tb) return 0;
        const r = tb.getBoundingClientRect();
        return r.bottom;
      }catch{ return 0; }
    }
  /* ---------- Helper: อ่านค่า CSS var ภายใน .cg-theme ---------- */
function getComputedStyleSafe(varName, fallback, scopeSelector = '.cg-theme'){
  try {
    if (typeof window==='undefined' || !window.getComputedStyle) return fallback;
    const el = document.querySelector(scopeSelector) || document.documentElement;
    const v = getComputedStyle(el).getPropertyValue(varName);
    return (v && v.trim()) || fallback;
  } catch {
    return fallback;
  }
}
/* === Press FX helpers (visual only) === */
function attachPressFX() {
  // Event delegation: ปุ่ม, การ์ดฮีโร่, ช่อง slot
  if (window.__cgPressFXAttached) return;
  window.__cgPressFXAttached = true;
  const SELECTOR = '.btn-like, [data-heroname], [title*="Ban slot"], [title*="Pre-choose"], [title*="ลากฮีโร่มาวาง"]';
  const onDown = (e) => {
    const target = e.target.closest(SELECTOR);
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const x = (e.clientX ?? (e.touches?.[0]?.clientX ?? rect.left + rect.width/2)) - rect.left;
    const y = (e.clientY ?? (e.touches?.[0]?.clientY ?? rect.top  + rect.height/2)) - rect.top;

    // 1) Ripple
    spawnRipple(target, x, y);

    // 2) Energy ring (เฉพาะการ์ดฮีโร่/สล็อต/ปุ่มหลัก)
    if (target.matches('[data-heroname], .btn-like, [title*="slot"], [title*="ลากฮีโร่มาวาง"]')) {
      spawnRing(target, x, y);
    }

    // 3) Hit flash บนการ์ดฮีโร่
    if (target.matches('[data-heroname]')) {
      spawnHitFlash(target, x, y);
    }

    // 5) Spark สำหรับ slot
    if (target.matches('[title*="slot"], [title*="ลากฮีโร่มาวาง"]')) {
      spawnSpark(target);
    }
  };

  // รองรับทั้งเมาส์และจอสัมผัส
  window.addEventListener('pointerdown', onDown, { passive: true });
}

function spawnRipple(el, x, y){
  const rip = document.createElement('span');
  rip.className = 'cg-ripple';
  rip.style.left = x + 'px';
  rip.style.top  = y + 'px';
  el.appendChild(rip);
  rip.addEventListener('animationend', () => rip.remove());
}

function spawnRing(el, x, y){
  const ring = document.createElement('span');
  ring.className = 'cg-press-ring';
  ring.style.left = x + 'px';
  ring.style.top  = y + 'px';
  el.appendChild(ring);
  ring.addEventListener('animationend', () => ring.remove());
}

function spawnHitFlash(el, x, y){
  const hit = document.createElement('span');
  hit.className = 'cg-press-hit';
  // ใช้ CSS var เพื่อเล็งจุดแฟลช
  hit.style.setProperty('--x', (x/ el.clientWidth * 100) + '%');
  hit.style.setProperty('--y', (y/ el.clientHeight * 100) + '%');
  el.appendChild(hit);
  hit.addEventListener('animationend', () => hit.remove());
}

function spawnSpark(el){
  const s = document.createElement('span');
  s.className = 'cg-press-spark';
  el.appendChild(s);
  const remove = () => s.remove();
  s.addEventListener('animationend', remove);
  // เผื่อบางบราวเซอร์ไม่ยิง animationend ของ ::after
  setTimeout(remove, 700);
}

function spawnConfetti(el, x, y){
  const c = document.createElement('div');
  c.className = 'cg-confetti';
  c.style.left = x + 'px';
  c.style.top  = y + 'px';

  const colors = ['#7A5CFF','#9B82FF','#C8FF00','#E6FF4D','#7A6CFF','#57EAE7'];
  const N = 14;
  for (let i=0; i<N; i++){
    const piece = document.createElement('i');
    const ang = (Math.PI * 2) * (i / N) + (Math.random()*0.6 - 0.3);
    const dist = 40 + Math.random()*40;
    piece.style.setProperty('--dx', Math.cos(ang) * dist);
    piece.style.setProperty('--dy', Math.sin(ang) * dist);
    piece.style.background = colors[(Math.random()*colors.length)|0];
    piece.style.width  = (4 + Math.random()*4) + 'px';
    piece.style.height = (8 + Math.random()*8) + 'px';
    c.appendChild(piece);
  }
  el.appendChild(c);
  // เก็บกวาด
  setTimeout(()=> c.remove(), 900);
}
/* ===== ULTRA-PLUS FX Helpers (visual only, no logic change) ===== */
/* ===== ULTRA-PLUS FX Helpers (safe version) ===== */
function attachUltraFX(){
  try{
    // กันซ้ำ + กัน SSR
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    if (window.__cgUltraFXAttached) return;
    window.__cgUltraFXAttached = true;

    // ต้องมี root ก่อน แล้วค่อยอ้างในทุก handler
    const ROOT  = document.querySelector('.cg-theme') || document.body;
    if (!ROOT) return;

    // stage สำหรับเอฟเฟกต์ (อยู่ใต้ ROOT)
    const stage = ensureFXStage(ROOT);

    // --------- Pointer-down FX (เดิม + การ์ดกันพัง) ---------
    const SELECTOR = [
      '.btn-like', '[data-heroname]', '.slot', '.cg-slot',
      '[title*="Pre-choose"]', '[title*="Ban slot"]', '[title*="ลากฮีโร่มาวาง"]',
      '.tag-pick', '.tag-ban'
    ].join(',');

    const onPointerDown = (e)=>{
      const t = e.target?.closest?.(SELECTOR);
      if (!t) return;

      const cx = e.clientX ?? (e.touches?.[0]?.clientX || 0);
      const cy = e.clientY ?? (e.touches?.[0]?.clientY || 0);

      // เอฟเฟกต์หลัก
      spawnShock(stage, cx, cy);
      spawnBurst(stage, cx, cy, 18);
      spawnFlare(stage, cx, cy);
      if (typeof cgCyberAberration === 'function') cgCyberAberration();

      if (typeof cgOverdriveOK === 'function' ? cgOverdriveOK() : true){
        if (typeof spawnReticleFX === 'function')  spawnReticleFX(stage, cx, cy);
        if (typeof spawnHexPulseFX === 'function') spawnHexPulseFX(stage, cx, cy);
        if (typeof spawnCircuitTraceFX === 'function') spawnCircuitTraceFX(stage, cx, cy);
        if (typeof spawnPillarFX === 'function')  spawnPillarFX(stage, cx, cy);
        if (typeof spawnVignetteFX === 'function') spawnVignetteFX(stage, cx, cy);
      }

      if (t.matches('.btn-like.is-primary, .tag-pick, .tag-ban')) {
        if (typeof screenShake === 'function') screenShake(ROOT);
        if (typeof maybeBeamBetweenPanels === 'function') maybeBeamBetweenPanels(stage);
        spawnGlitch(stage);
      }
    };
    window.addEventListener('pointerdown', onPointerDown, { passive:true });

    // --------- Aurora Parallax (ต้องประกาศหลังมี ROOT เสมอ) ---------
    const setAurora = (x, y) => {
      // ป้องกัน TDZ ด้วยการอ้างผ่านพารามิเตอร์ ROOT ที่มีอยู่แล้ว
      const mx = (x / window.innerWidth  * 100) + '%';
      const my = (y / window.innerHeight * 100) + '%';
      ROOT.style.setProperty('--mx', mx);
      ROOT.style.setProperty('--my', my);
    };
    const onPointerMoveAurora = (e)=>{
      const x = e.clientX ?? (e.touches?.[0]?.clientX || 0);
      const y = e.clientY ?? (e.touches?.[0]?.clientY || 0);
      setAurora(x, y);
    };
    window.addEventListener('pointermove', onPointerMoveAurora, { passive:true });

    // --------- Cursor Trail (throttled) ---------
    let trailTs = 0;
    const onPointerMoveTrail = (e)=>{
      const now = performance.now();
      if (now - trailTs < 24) return; // ~40/s
      trailTs = now;
      const dot = document.createElement('span');
      dot.className = 'cg-trail';
      dot.style.left = (e.clientX || 0) + 'px';
      dot.style.top  = (e.clientY || 0) + 'px';
      (stage || ROOT).appendChild(dot);
      setTimeout(()=>dot.remove(), 620);
    };
    window.addEventListener('pointermove', onPointerMoveTrail, { passive:true });

    // --------- 3D Tilt for hero cards (delegate บน ROOT) ---------
    const TILT_SEL = '[data-heroname]';
    const onEnter = (e)=>{
      const t = e.target?.closest?.(TILT_SEL); if(!t) return;
      t.classList.add('fx-tilt','fx-tilt-on');
    };
    const onMove = (e)=>{
      const t = e.target?.closest?.(TILT_SEL); if(!t || !t.classList.contains('fx-tilt')) return;
      const r = t.getBoundingClientRect();
      const px = (e.clientX - r.left)/r.width;
      const py = (e.clientY - r.top)/r.height;
      const rx = (py - .5) * -10;
      const ry = (px - .5) *  12;
      t.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`;
      t.style.setProperty('--lx', (px*100)+'%');
      t.style.setProperty('--ly', (py*100)+'%');
    };
    const onLeave = (e)=>{
      const t = e.target?.closest?.(TILT_SEL); if(!t) return;
      t.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
      t.classList.remove('fx-tilt-on');
    };
    ROOT.addEventListener('pointerenter', onEnter, { passive:true, capture:true });
    ROOT.addEventListener('pointermove',  onMove,  { passive:true, capture:true });
    ROOT.addEventListener('pointerleave', onLeave, { passive:true, capture:true });

  }catch(err){
    console.error('[attachUltraFX] failed:', err);
  }
}

/* ---------- Stage ---------- */
function ensureFXStage(root){
  let s = root.querySelector('.cg-fx-stage');
  if (!s){
    s = document.createElement('div');
    s.className = 'cg-fx-stage';
    root.appendChild(s);
  }
  return s;
}
/* ---------- Effects ---------- */
function spawnShock(stage, x, y){
  const el = document.createElement('span');
  el.className = 'cg-shock';
  el.style.left = x + 'px';
  el.style.top  = y + 'px';
  stage.appendChild(el);
  el.addEventListener('animationend', ()=> el.remove());
}

function spawnBurst(stage, x, y, rays=16){
  const cont = document.createElement('div');
  cont.className = 'cg-burst';
  cont.style.left = x + 'px';
  cont.style.top  = y + 'px';
  for (let i=0;i<rays;i++){
    const ray = document.createElement('i');
    const deg = (360/rays)*i + (Math.random()*10-5);
    ray.style.setProperty('--deg', deg+'deg');
    cont.appendChild(ray);
  }
  stage.appendChild(cont);
  setTimeout(()=> cont.remove(), 900);
}

function spawnConfettiStage(stage, x, y, N=18){
  const c = document.createElement('div');
  c.className = 'cg-confetti';
  c.style.left = x + 'px';
  c.style.top  = y + 'px';
  const colors = ['#7A5CFF','#9B82FF','#C8FF00','#E6FF4D','#7A6CFF','#57EAE7','#FF3B47','#FFE066'];
  for (let i=0;i<N;i++){
    const piece = document.createElement('i');
    const ang  = (Math.PI*2)*(i/N) + (Math.random()*0.6 - 0.3);
    const dist = 50 + Math.random()*110;
    piece.style.setProperty('--dx', Math.cos(ang)*dist);
    piece.style.setProperty('--dy', Math.sin(ang)*dist);
    piece.style.background = colors[(Math.random()*colors.length)|0];
    piece.style.width  = (4 + Math.random()*5) + 'px';
    piece.style.height = (8 + Math.random()*9) + 'px';
    c.appendChild(piece);
  }
  stage.appendChild(c);
  setTimeout(()=> c.remove(), 1000);
}

function spawnFlare(stage, x, y){
  const f = document.createElement('span');
  f.className = 'cg-flare';
  f.style.left = x + 'px';
  f.style.top  = y + 'px';
  f.style.setProperty('--xvw', (x/window.innerWidth*100)+'%');
  f.style.setProperty('--yvh', (y/window.innerHeight*100)+'%');
  stage.appendChild(f);
  setTimeout(()=> f.remove(), 1100);
}

function spawnGlitch(stage){
  const g = document.createElement('div');
  g.className = 'cg-glitch';
  stage.appendChild(g);
  setTimeout(()=> g.remove(), 460);
}

function screenShake(root){
  root.classList.add('cg-shake');
  setTimeout(()=> root.classList.remove('cg-shake'), 460);
}

/* ยิงลำแสงจากพาเนลซ้ายไปขวา (ถ้ามีคลาส side-panel left/right) */
function maybeBeamBetweenPanels(stage){
  const left  = document.querySelector('.side-panel.left');
  const right = document.querySelector('.side-panel.right');
  if (!left || !right) return;

  const lr = left.getBoundingClientRect();
  const rr = right.getBoundingClientRect();
  const x1 = lr.right; const y1 = lr.top + lr.height/2;
  const x2 = rr.left;  const y2 = rr.top + rr.height/2;
  const dx = x2-x1; const dy = y2-y1;
  const len = Math.hypot(dx,dy);
  const ang = Math.atan2(dy,dx) * 180/Math.PI;

  const beam = document.createElement('div');
  beam.className = 'cg-beam';
  beam.style.left = x1 + 'px';
  beam.style.top  = y1 + 'px';
  beam.style.width = len + 'px';
  beam.style.transform = `rotate(${ang}deg)`;
  stage.appendChild(beam);
  setTimeout(()=> beam.remove(), 600);
}
function cgCyberAberration(){
  try{
    const root = document.querySelector('.cg-theme');
    if (!root) return;
    root.classList.add('cg-ab');
    setTimeout(()=>root.classList.remove('cg-ab'), 140); // สั้น ๆ พอให้เห็นวาบ
  }catch{}
}
/* === CYBER OVERDRIVE helpers (visual only) === */
function spawnReticleFX(stage, x, y){
  const r = document.createElement('div');
  r.className = 'cg-reticle';
  r.style.left = x + 'px'; r.style.top = y + 'px';
  // 2 เส้นครอส + 4 ขีดมุม
  r.innerHTML = `
    <i class="h"></i><i class="v"></i>
    <i class="c1"></i><i class="c2"></i><i class="c3"></i><i class="c4"></i>
  `;
  stage.appendChild(r);
  setTimeout(()=>r.remove(), 700);
}

function spawnHexPulseFX(stage, x, y){
  const h = document.createElement('div');
  h.className = 'cg-hex';
  h.style.left = x + 'px'; h.style.top = y + 'px';
  stage.appendChild(h);
  setTimeout(()=>h.remove(), 720);
}

function spawnCircuitTraceFX(stage, x, y){
  const c = document.createElement('div');
  c.className = 'cg-circuit';
  c.style.left = x + 'px'; c.style.top = y + 'px';
  stage.appendChild(c);
  setTimeout(()=>c.remove(), 620);
}

function spawnPillarFX(stage, x, y){
  const p = document.createElement('div');
  p.className = 'cg-pillar';
  p.style.left = x + 'px'; p.style.top = y + 'px';
  // ส่งตำแหน่งแบบ viewport ให้ ::before/::after
  p.style.setProperty('--x', x + 'px');
  p.style.setProperty('--y', y + 'px');
  stage.appendChild(p);
  setTimeout(()=>p.remove(), 560);
}

function spawnVignetteFX(stage, x, y){
  const v = document.createElement('div');
  v.className = 'cg-vignette';
  v.style.setProperty('--xvw', (x / window.innerWidth * 100) + '%');
  v.style.setProperty('--yvh', (y / window.innerHeight * 100) + '%');
  stage.appendChild(v);
  setTimeout(()=>v.remove(), 460);
}

/* === Slot Summon FX (visual only) — UPGRADE: separate Pick vs Ban === */
/* === Slot Summon FX (visual only) — UPGRADE: separate Pick vs Ban === */
function triggerSlotSelectFX(team, type, index){
  try{
    // รอ DOM เปลี่ยนสถานะเป็นการ์ดจริงก่อน แล้วค่อยใส่เอฟเฟกต์ทับ
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      const sel = `.cg-theme [data-slot="${type}"][data-team="${team}"][data-index="${index}"]`;
      const el  = document.querySelector(sel);
      if (!el) return;

      // กันวางซ้ำ: ลบของเก่าถ้ามี
      el.querySelectorAll('.cg-slot-summon').forEach(n => n.remove());

      // สร้างเอฟเฟกต์
      const fx = document.createElement('div');
      fx.className = `cg-slot-summon ${type === 'ban' ? 'ban' : 'pick'}`;

      // วงแหวน
      const ring = document.createElement('div');
      ring.className = 'ring';

      // หกเหลี่ยม
      const hex = document.createElement('div');
      hex.className = 'hex';

      // rays
      const rays = document.createElement('div');
      rays.className = 'rays';
      const R = 10;
      for (let i = 0; i < R; i++){
        const d = document.createElement('i');
        d.style.setProperty('--deg', `${(360/R)*i + (Math.random()*12-6)}deg`);
        rays.appendChild(d);
      }

      // pulse เบา ๆ
      const pulse = document.createElement('div');
      pulse.className = 'pulse';

      // ร้อยเข้ากัน
      fx.appendChild(ring);
      fx.appendChild(hex);
      fx.appendChild(rays);
      fx.appendChild(pulse);

      // sparkle เพิ่มสำหรับ pick ตามธีม
      if (type !== 'ban'){
        const spWrap = document.createElement('div');
        spWrap.className = 'sparkles';
        const N = 8;
        for (let i = 0; i < N; i++){
          const s = document.createElement('i');
          const ang  = Math.random()*Math.PI*2;
          const dist = 30 + Math.random()*40;
          s.style.setProperty('--dx', (Math.cos(ang)*dist).toFixed(2));
          s.style.setProperty('--dy', (Math.sin(ang)*dist).toFixed(2));
          spWrap.appendChild(s);
        }
        fx.appendChild(spWrap);
      } else {
        // x-slash สำหรับ ban
        const s1 = document.createElement('div');
        s1.className = 'xslash s1';
        s1.style.setProperty('--rot', '-36deg');
        const s2 = document.createElement('div');
        s2.className = 'xslash s2';
        s2.style.setProperty('--rot', '36deg');
        fx.appendChild(s1);
        fx.appendChild(s2);
      }

      // ใส่เข้า slot
      el.style.position = el.style.position || 'relative';
      el.appendChild(fx);

      // เก็บกวาดเมื่อแอนิเมชันจบ (กัน memory รั่ว)
      const cleanup = () => fx.remove();
      setTimeout(cleanup, 700); // ระยะเวลา animation โดยประมาณ
    }));
  }catch{}
}

function spawnAfterimageBloom(el){
  const a = document.createElement('span');
  a.style.position='absolute';
  a.style.inset='-6px';
  a.style.borderRadius='16px';
  a.style.pointerEvents='none';
  a.style.background='radial-gradient(closest-side, rgba(255,255,255,.35), transparent 70%)';
  a.style.mixBlendMode='screen';
  a.style.animation='cg-ai .38s ease-out forwards';
  el.appendChild(a);
  setTimeout(()=>a.remove(), 400);
}

function spawnSlotSummonFX(slotEl, type='pick'){
  // ใส่คลาสเด้ง
  slotEl.classList.add('cg-slot', 'cg-slot-zoom');

  // เอฟเฟกต์หลัก
  const fx = document.createElement('div');
  fx.className = `cg-slot-summon ${type}`; // <<< แยกสกิน pick/ban

  // เลเยอร์ร่วมพื้นฐาน
  const ring  = document.createElement('i'); ring.className  = 'ring';
  const hex   = document.createElement('i'); hex.className   = 'hex';
  const pulse = document.createElement('i'); pulse.className = 'pulse';

  // Rays (HUD)
  const rays = document.createElement('span'); rays.className = 'rays';
  for (let i=0;i<10;i++){
    const r = document.createElement('i');
    r.style.setProperty('--deg', (i*(360/10) + (Math.random()*12 - 6)) + 'deg');
    rays.appendChild(r);
  }

  fx.appendChild(pulse);
  fx.appendChild(ring);
  fx.appendChild(hex);
  fx.appendChild(rays);

  // เลเยอร์เฉพาะชนิด
  if (type === 'pick'){
    // สาดประกาย/ชิ้นส่วน (celebration)
    const sparkles = document.createElement('span');
    sparkles.className = 'sparkles';
    for (let i=0;i<18;i++){
      const s = document.createElement('i');
      const ang  = (Math.PI*2)*(i/18) + (Math.random()*0.6 - 0.3);
      const dist = 40 + Math.random()*80;
      s.style.setProperty('--dx', Math.cos(ang)*dist);
      s.style.setProperty('--dy', Math.sin(ang)*dist);
      sparkles.appendChild(s);
    }
    fx.appendChild(sparkles);
  } else {
    // Cross slashes + เศษควันแดง (impact/lock)
    const slash1 = document.createElement('i'); slash1.className = 'xslash s1';
    const slash2 = document.createElement('i'); slash2.className = 'xslash s2';
    const embers = document.createElement('span'); embers.className = 'embers';
    for (let i=0;i<16;i++){
      const p = document.createElement('i');
      const ang  = (Math.PI*2)*(i/16) + (Math.random()*0.8 - 0.4);
      const dist = 36 + Math.random()*72;
      p.style.setProperty('--dx', Math.cos(ang)*dist);
      p.style.setProperty('--dy', Math.sin(ang)*dist);
      embers.appendChild(p);
    }
    fx.appendChild(slash1);
    fx.appendChild(slash2);
    fx.appendChild(embers);
  }

  slotEl.appendChild(fx);
    // Afterimage bloom (ถูกสCOPE: มี slotEl)
    if (typeof spawnAfterimageBloom === 'function') spawnAfterimageBloom(slotEl);
  // เก็บกวาด
  const cleanup = () => {
    fx.remove();
    slotEl.classList.remove('cg-slot-zoom');
  };
  setTimeout(cleanup, 900); // เพิ่มเวลานิดเพื่อให้เห็นเอฟเฟกต์
}
// === Performance guard สำหรับเอฟเฟกต์หนัก ๆ (กันสแปม 1 ครั้ง/≥90ms) ===
let __cgOverdriveCooldown = 0;
function cgOverdriveOK(){
  const now = performance.now();
  if (now - __cgOverdriveCooldown < 90) return false; // อย่างน้อย 90ms ต่อครั้ง
  __cgOverdriveCooldown = now;
  return true;
}
