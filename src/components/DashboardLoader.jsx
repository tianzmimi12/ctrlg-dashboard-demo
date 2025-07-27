import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import HomePage from "./HomePage";
import WinRateTierSelection from "./WinRateTierSelection";
import TierData from "./tier/TierData";
import { parseGamesFromExcel, parseComboStatsFromExcel } from "../utils/excelParser";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";

export default function DashboardLoader() {
  const [games, setGames] = useState([]);
  const [comboStats, setComboStats] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [dropdownDates, setDropdownDates] = useState([]);
  const navigate = useNavigate();

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    // Parse All_Scrim_Stats & ComboStats
    parseGamesFromExcel(file, (g) => {
      setGames(g);
      setUploaded(true);
      setTimeout(() => {
        setShowDashboard(true);
        navigate("/dashboard");
      }, 1500); 
    });
    parseComboStatsFromExcel(file, setComboStats, (dropdowns) => {
      if (dropdowns && dropdowns.dates) setDropdownDates(dropdowns.dates);
    });
  }

  function GateEffect() {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        transition={{ duration: 0.7, type: "tween" }}
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "radial-gradient(ellipse at 50% 60%, #ffe47a 0%, #9C27B0 85%, #191654 100%)",
          zIndex: 90,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ scale: 1.9, opacity: 0 }}
          animate={{ scale: [1.1, 1.6, 0.97, 1], opacity: [0, 1, 1, 0.82] }}
          transition={{ duration: 2.2, type: "tween" }}
          style={{
            borderRadius: "38px",
            background: "linear-gradient(100deg,#fffbe6,#ffe47a,#9C27B0 70%)",
            boxShadow: "0 0 120px #fff176,0 0 260px #9c27b088",
            padding: "76px 98px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2.7rem",
            color: "#fff",
            fontWeight: 900,
            letterSpacing: 2,
            textShadow: "0 0 28px #fff,0 0 60px #ffe47a, 0 0 140px #9C27B0",
            border: "8px solid #ffe47a88",
            zIndex: 95,
          }}
        >
          <motion.span
            animate={{ scale: [1, 1.18, 0.96, 1], rotate: [0, 3, -6, 0] }}
            transition={{ repeat: Infinity, duration: 2.1, type: "tween" }}
            style={{
              display: "inline-block",
              marginRight: 32,
              fontSize: "3.1rem",
              textShadow: "0 0 30px #ffe47a88",
            }}
          >
            🚀
          </motion.span>
          <span>GAME START!</span>
        </motion.div>
        <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={380} recycle={false} />
        <audio autoPlay>
          <source src="https://cdn.pixabay.com/audio/2022/10/16/audio_12adfd47d6.mp3" type="audio/mp3" />
        </audio>
      </motion.div>
    );
  }

  function UploadPage() {
    return (
      <div
        style={{
          minHeight: "100vh",
          width: "100vw",
          background: "linear-gradient(120deg,#191654 0%,#43c6ac 90%,#ffe47a 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Kanit',sans-serif",
          overflow: "hidden",
        }}
      >
        <AnimatePresence>
          {!showDashboard && (
            <motion.div
              initial={{ opacity: 0, scale: 0.86, y: -60 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.16, y: 80 }}
              transition={{ type: "spring", stiffness: 130, damping: 19 }}
              style={{
                background: "linear-gradient(135deg,rgba(255,255,255,0.28),#19165433 80%)",
                borderRadius: "38px",
                boxShadow: "0 16px 66px #19165455, 0 4px 38px #ffe47a77",
                border: "3.7px solid #ffe47a88",
                padding: "52px 55px 46px 55px",
                minWidth: 430,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                zIndex: 4,
                overflow: "hidden",
              }}
            >
              <motion.h1
                style={{
                  fontSize: "2.88rem",
                  fontWeight: 900,
                  marginBottom: "24px",
                  background:
                    "linear-gradient(99deg, #00FFA3 0%, #9C27B0 60%, #ffe47a 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: 2,
                  textShadow: "0 0 60px #00ffa3bb, 0 0 160px #ffe47a",
                }}
                animate={{ scale: [1, 1.06, 1], textShadow: ["0 0 60px #00ffa3bb", "0 0 120px #ffe47a", "0 0 60px #00ffa3bb"] }}
                transition={{ repeat: Infinity, duration: 2.5, type: "tween" }}
              >
                FS ROV Dashboard
              </motion.h1>
              <label
                htmlFor="file-upload"
                style={{
                  background:
                    "linear-gradient(99deg,#ffe47a 0%, #fffbe6 100%)",
                  padding: "18px 42px",
                  borderRadius: "34px",
                  fontWeight: 900,
                  color: "#6A1B9A",
                  fontSize: "1.32rem",
                  letterSpacing: 1.2,
                  cursor: "pointer",
                  boxShadow: "0 4px 32px #ffe47a33,0 0 38px #9c27b022",
                  border: "3px solid #9C27B0",
                  marginBottom: 15,
                  marginTop: 6,
                  transition: "all 0.16s",
                  display: "inline-block",
                }}
              >
                📂 เลือกไฟล์ Google Sheet, Excel (.xlsx)
                <input
                  id="file-upload"
                  type="file"
                  accept=".xlsx"
                  style={{ display: "none" }}
                  onChange={handleFile}
                />
              </label>
              <p
                style={{
                  color: "#fff",
                  opacity: 0.84,
                  fontSize: "1.09rem",
                  margin: "14px 0 0 0",
                  textAlign: "center",
                  textShadow: "0 2px 8px #19165433",
                  fontWeight: 600,
                }}
              >
                อัปโหลดไฟล์ข้อมูล Scrim ตามฟอร์แมทล่าสุด <br />
                <span style={{ color: "#ffe47a", fontWeight: 800 }}>
                  (รองรับเฉพาะไฟล์ .xlsx)
                </span>
              </p>
              {uploaded && <GateEffect />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<UploadPage />} />
      <Route path="/dashboard" element={<HomePage games={games} />} />
      <Route path="/win-rate" element={<WinRateTierSelection games={games} />} />
      <Route
        path="/tier-data"
        element={
          <TierData
            games={games}
            comboStats={comboStats}
            dropdownDates={dropdownDates}
          />
        }
      />
    </Routes>
  );
}
