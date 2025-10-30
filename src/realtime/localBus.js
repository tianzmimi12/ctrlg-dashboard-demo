// src/realtime/localBus.js
// Unified room-scoped event bus with cross-tab support (BroadcastChannel -> storage fallback)

const GLOBAL = (typeof window !== 'undefined') ? window : undefined;

export class LocalBus {
  constructor(roomCode = 'default') {
    this.room = String(roomCode || 'default');
    this.topic = `cg-room-${this.room}`;
    this.handlers = new Set();

    // Prefer BroadcastChannel
    this.bc = (GLOBAL && 'BroadcastChannel' in GLOBAL)
      ? new BroadcastChannel(this.topic)
      : null;

    if (this.bc) {
      this._onBC = (e) => this._dispatch(e?.data);
      this.bc.addEventListener('message', this._onBC);
    }

    // Fallback: storage event (cross-tab only)
    if (GLOBAL) {
      this._onStorage = (e) => {
        if (!e || e.key !== this.topic || !e.newValue) return;
        try {
          const msg = JSON.parse(e.newValue);
          this._dispatch(msg);
        } catch {}
      };
      GLOBAL.addEventListener('storage', this._onStorage);
    }
  }

  /** publish message to this room (dispatch to self + other tabs) */
  publish(message) {
    const msg = { ...message, __room: this.room, __ts: Date.now() };

    // 1) in-tab first (low latency + works with single tab)
    this._dispatch(msg);

    // 2) cross-tab
    if (this.bc) {
      try { this.bc.postMessage(msg); } catch {}
    } else if (GLOBAL && GLOBAL.localStorage) {
      try {
        GLOBAL.localStorage.setItem(this.topic, JSON.stringify(msg));
        // optional: cleanup to reduce storage churn
        GLOBAL.localStorage.removeItem(this.topic);
      } catch {}
    }
  }

  /** subscribe to messages (returns unsubscribe) */
  subscribe(fn) {
    if (typeof fn !== 'function') return () => {};
    this.handlers.add(fn);
    return () => this.handlers.delete(fn);
  }

  /** internal fan-out with room guard */
  _dispatch(msg) {
    if (!msg || msg.__room !== this.room) return;
    this.handlers.forEach(h => {
      try { h(msg); } catch {}
    });
  }

  /** dispose all listeners/channels */
  dispose() {
    this.handlers.clear();
    if (this.bc && this._onBC) {
      try { this.bc.removeEventListener('message', this._onBC); } catch {}
      try { this.bc.close(); } catch {}
    }
    if (GLOBAL && this._onStorage) {
      try { GLOBAL.removeEventListener('storage', this._onStorage); } catch {}
    }
  }
}

// Optional default export for flexible imports
export default LocalBus;
