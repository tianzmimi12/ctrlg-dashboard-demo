// ตัวจัดการนาฬิกากลางแบบเบา ๆ ใช้ใน MatchRoom / TimerHUD
// Model: ต่อซีเคิล "หนึ่งแอ็กชัน" มี perActionLeft ของฝั่งที่ถึงคิว และมี reserveLeft ต่อทีมไว้เผื่อฉุกเฉิน
// หน้าที่: เดิน/หยุด, รีเซ็ตต่อแอ็กชัน, กระจาย state ให้ UI

export function createTimerManager(init = {}) {
  const subs = new Set();

  const state = {
    running: false,
    _freezeReset: false, // กันรีเซ็ตเวลาเมื่อ Pause


    // ค่าฐาน
    perAction: typeof init.perAction === 'number' ? init.perAction : 30,  // วินาทีต่อ 1 การกระทำ
    reserve:   typeof init.reserve   === 'number' ? init.reserve   : 120, // เวลาสำรองต่อทีม

    // ค่าปัจจุบัน
    perActionLeft: { A: 30, B: 30 },
    reserveLeft:   { A: 120, B: 120 },

    // ฝั่งที่ถึงคิว (ใช้สำหรับ HUD รวม — DraftPage มี timer ในตัวอยู่แล้ว)
    currentTurn: 'A',

    _lastTickAt: 0,   // timestamp ล่าสุดที่เดินนาฬิกา (ms)
  };

  // init left from base
  state.perActionLeft.A = state.perAction;
  state.perActionLeft.B = state.perAction;
  state.reserveLeft.A   = state.reserve;
  state.reserveLeft.B   = state.reserve;

  // ---------- utilities ----------
  function get() {
    return {
      running: state.running,
      perAction: state.perAction,
      reserve: state.reserve,
      perActionLeft: { ...state.perActionLeft },
      reserveLeft: { ...state.reserveLeft },
      currentTurn: state.currentTurn,
    };
  }

// ใน createTimerManager
function publish() { subs.forEach(f => f(get())); }

function pause() {
  state.running = false;
  state._freezeReset = true;   // กันการรีเซ็ตโดยไม่ได้ตั้งใจ ระหว่าง pause
  publish();
}

function resume() {
  state._freezeReset = false;  // กลับมาให้ reset ได้ปกติเมื่อเริ่มเดินต่อ
  state.running = true;
  publish();
}

  function on(fn) {
    subs.add(fn);
    // push ครั้งแรก
    try { fn(get()); } catch {}
    return () => subs.delete(fn);
  }

  // ---------- ควบคุมนาฬิกา ----------
  // start = resume (ไม่รีเซ็ตเวลา)
  function start() {
    if (state.running) return;
    state.running = true;
    state._freezeReset = false;     // ปลดล็อกการรีเซ็ตเมื่อเริ่ม/เดินต่อ
    state._lastTickAt = Date.now();
    publish();
  }

  function resume() {
    // alias เพื่อความชัดเจน
    start(); // ยังใช้ start แต่เราปลดล็อกไว้ข้างบนแล้ว
  }

  function pause() {
    if (!state.running) return;
    state.running = false;
    state._freezeReset = true;      // ล็อกการรีเซ็ตระหว่างหยุด
    publish();
  }

  function stop() {
    // หยุดแบบไม่รีเซ็ตค่าปัจจุบัน (ใช้ hard reset ภายนอกถ้าต้องการ)
    state.running = false;
    publish();
  }

  // เมื่อ commit แอ็กชัน (กด Confirm) และถึงตาฝั่งใหม่ → รีเซ็ต perActionLeft ของฝั่งใหม่
  function onActionCommit(nextTurn /* 'A' | 'B' */) {
    state.currentTurn = (nextTurn === 'B') ? 'B' : 'A';
    state.perActionLeft[state.currentTurn] = state.perAction; // เริ่มนับของฝั่งที่จะเล่นต่อไป
    state._lastTickAt = Date.now();
    publish();
  }

  // ---------- การตั้งค่า ----------
  // เปลี่ยนค่า base โดยไม่รีเซ็ตเวลาปัจจุบัน เว้นแต่จะตั้งใจ (resetCurrent=true)
  function setSettings({ perAction, reserve, resetCurrent = false } = {}) {
       // ถ้าถูก Pause อยู่ ให้เมินคำสั่งรีเซ็ตทุกกรณี
   if (state._freezeReset) {
     resetCurrent = false;
   }
    if (typeof perAction === 'number' && perAction >= 0) {
      state.perAction = perAction;
      if (resetCurrent) {
        state.perActionLeft.A = perAction;
        state.perActionLeft.B = perAction;
      }
    }
    if (typeof reserve === 'number' && reserve >= 0) {
      state.reserve = reserve;
      if (resetCurrent) {
        state.reserveLeft.A = reserve;
        state.reserveLeft.B = reserve;
      }
    }
    publish();
  }

  // รีเซ็ตเวลาปัจจุบันให้เท่าค่า base (เรียกใช้จากปุ่ม Apply ได้)
  function resetCurrentTimesToBase() {
    if (state._freezeReset) return; // หยุด ไม่ให้รีเซ็ตตอน pause
    state.perActionLeft.A = state.perAction;
    state.perActionLeft.B = state.perAction;
    state.reserveLeft.A   = state.reserve;
    state.reserveLeft.B   = state.reserve;
    publish();
  }

  // ---------- ปรับแต่งเวลาเฉพาะทีม ----------
  function addActionTime(team, seconds) {
    const t = (team === 'B') ? 'B' : 'A';
    const s = Math.max(0, Number(seconds) || 0);
    state.perActionLeft[t] = Math.max(0, state.perActionLeft[t] + s);
    publish();
  }

  function setActionTime(team, seconds) {
    const t = (team === 'B') ? 'B' : 'A';
    const s = Math.max(0, Number(seconds) || 0);
    state.perActionLeft[t] = s;
    publish();
  }

  function addReserve(team, seconds) {
    const t = (team === 'B') ? 'B' : 'A';
    const s = Math.max(0, Number(seconds) || 0);
    state.reserveLeft[t] = Math.max(0, state.reserveLeft[t] + s);
    publish();
  }

  function setReserve(team, seconds) {
    const t = (team === 'B') ? 'B' : 'A';
    const s = Math.max(0, Number(seconds) || 0);
    state.reserveLeft[t] = s;
    publish();
  }

  // ---------- เดินนาฬิกา (เรียกจาก rAF หรือ setInterval ภายนอก) ----------
  function tick() {
    if (!state.running) return;

    const now = Date.now();
    const dt = Math.floor((now - (state._lastTickAt || now)) / 1000); // หน่วยเป็นวินาที
    if (dt <= 0) return;

    state._lastTickAt = now;

    // ลดเฉพาะฝั่งที่ถึงคิว
    const t = state.currentTurn;
    let left = state.perActionLeft[t];

    if (left > 0) {
      left = Math.max(0, left - dt);
      state.perActionLeft[t] = left;
      publish();
    } else {
      // perAction หมด — ไม่หัก reserve อัตโนมัติในเวอร์ชันนี้
      // ถ้าอยากให้กินสำรองอัตโนมัติ เปิดบล็อคนี้:
      /*
      const d = Math.min(dt, state.reserveLeft[t]);
      if (d > 0) {
        state.reserveLeft[t] -= d;
        publish();
      }
      */
    }
  }

  return {
    // state/pub-sub
    on, get,
    // control
    start, resume, pause, stop, tick,
    // flow ของดราฟต์
    onActionCommit,
    // settings & tools
    setSettings,
    resetCurrentTimesToBase,
    addActionTime, setActionTime,
    addReserve, setReserve,
  };
}
