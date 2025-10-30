// โปรโตคอลกลางสำหรับส่งอีเวนต์ระหว่างหน้าต่าง/บทบาท

// protocol.js

// อีเวนต์คงเหลือ: แยกความหมายชัด
export const RoomEvent = {
  STATE: 'state',         // snapshot ส่งออก (เช่น {config, status})
  ACTION: 'action',       // ดำเนินการใน flow ดราฟต์ (เช่น pick/ban/skip/timerAdd/timerSet/setBaseDuration)
  START: 'start',         // (ถ้าต้องใช้) เริ่ม flow/เริ่มนาฬิกา
  PAUSE: 'pause',         // หยุด "โดยไม่แตะเวลา"
  RESUME: 'resume',       // เดินต่อจากค่าเดิม
  SETTINGS: 'settings',   // { timers: { perAction, reserve }, resetCurrent?: boolean }
  RESET: 'reset',         // (เพิ่ม) รีเซ็ตเวลาปัจจุบันทิ้ง กลับไป base
};

// หมายเหตุ: **ยกเลิก** การใช้ ACTION พร้อม type:'pause'/'resume'/'reset'

export const MatchStatus = {
  IDLE: 'idle',
  DRAFTING: 'drafting',
  FINISHED: 'finished',
};

// ไม่มี Role enum เพื่อหลีกเลี่ยงปัญหา import — ใช้ string role แทน ('referee'/'player'/'spectator')
