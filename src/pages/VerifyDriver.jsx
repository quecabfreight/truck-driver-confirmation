import React, { useEffect, useMemo, useRef, useState } from "react";
import "./VerifyDriver.css";

export default function VerifyDriver() {
  // Load the audio from /public/alert.mp3
  const alertAudio = useMemo(() => {
    const a = new Audio("/alert.mp3"); // file must be in /public
    a.preload = "auto";
    return a;
  }, []);

  // We "prime" (unlock) audio on the first user interaction
  const primed = useRef(false);
  const [audioReady, setAudioReady] = useState(false);

  useEffect(() => {
    const unlock = async () => {
      if (primed.current) return;
      try {
        // Quietly play & pause once to satisfy mobile auto-play rules
        alertAudio.muted = true;
        await alertAudio.play();
        alertAudio.pause();
        alertAudio.currentTime = 0;
        alertAudio.muted = false;

        primed.current = true;
        setAudioReady(true);
      } catch {
        // If it fails, the click that presses the Test button will still work.
      }
    };

    // Use a one-time pointerdown so any click/tap primes the sound
    window.addEventListener("pointerdown", unlock, { once: true });
    return () => window.removeEventListener("pointerdown", unlock);
  }, [alertAudio]);

  // Red flash
  const [flashing, setFlashing] = useState(false);

  const triggerAlert = async () => {
    setFlashing(true);
    setTimeout(() => setFlashing(false), 450);

    try {
      alertAudio.currentTime = 0;
      await alertAudio.play();
    } catch (err) {
      console.warn("Audio blocked until user interacts with the page.", err);
    }
  };

  return (
    <div className="verify-wrap">
      {flashing && <div className="flash-overlay" aria-hidden="true" />}

      <h1>Verify Driver</h1>
      <p>Click the button to test the alert sound + red flash.</p>

      <button type="button" className="primary" onClick={triggerAlert}>
        Test Alert
      </button>

      <p className="hint">
        Sound ready: <strong>{audioReady ? "Yes" : "Waiting for first click"}</strong>
      </p>
    </div>
  );
}
