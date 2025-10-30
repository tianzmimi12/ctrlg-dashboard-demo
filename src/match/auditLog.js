// Enhanced audit log with undo/redo and CSV export
const logs = [];
let ptr = -1; // points to last applied action

export function record(action) {
  // If we undo previously, remove "future"
  logs.splice(ptr + 1);
  logs.push({ ...action, ts: Date.now() });
  ptr = logs.length - 1;
}

export function undo(apply) {
  if (ptr < 0) return false;
  const action = logs[ptr];
  apply({ ...action, undo: true });
  ptr--;
  return true;
}

export function redo(apply) {
  if (ptr >= logs.length - 1) return false;
  ptr++;
  const action = logs[ptr];
  apply(action);
  return true;
}

export function getLogs(){ return logs.slice(); }

export function exportCSV() {
  const keys = Array.from(new Set(logs.flatMap(o => Object.keys(o))));
  const header = keys.join(',');
  const lines = logs.map(o => keys.map(k => JSON.stringify(o[k] ?? '')).join(',')).join('\n');
  return header + '\n' + lines;
}
