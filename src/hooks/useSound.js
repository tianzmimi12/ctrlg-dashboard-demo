// Lightweight sound hook: plays an audio file under PUBLIC_URL/sounds/
// Usage: const playStart = useSound('start.mp3'); playStart();
import { useMemo } from 'react';

export default function useSound(file) {
  const audio = useMemo(() => {
    try {
      return new Audio(`${process.env.PUBLIC_URL}/sounds/${file}`);
    } catch (e) {
      console.warn('Audio init failed', e);
      return null;
    }
  }, [file]);
  return () => {
    if (!audio) return;
    try {
      audio.currentTime = 0;
      audio.play();
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  };
}
