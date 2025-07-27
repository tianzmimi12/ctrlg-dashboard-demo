import React from "react";
import { weeks, heroes, teams } from "/Users/ctrlg/rov-dashboard/src/components/data/mockData.js";
import { renderOverallStats, renderSummaryTable, renderPieChart } from "/Users/ctrlg/rov-dashboard/src/components/utils/renderUtils.js";
import { FaDiceFive } from "react-icons/fa";

const HeroStats = ({
  selectedHero,
  selectedTeam,
  selectedWeek,
  heroStatsData,
  comparisonData,
  overallData,
  allWeeksData,
  handleWeekChange,
}) => {
  // คำนวณ totalStats จาก heroStatsData
  const totalStats = {
    kda: parseFloat(heroStatsData.kda) || 0,
    avgDamageDealt: parseFloat(heroStatsData.avgDamageDealt) || 0,
    avgDamageTaken: parseFloat(heroStatsData.avgDamageTaken) || 0,
    teamfightParticipation: parseFloat(heroStatsData.teamfightParticipation) || 0,
    goldPerMinute8: parseFloat(heroStatsData.goldPerMinute8) || 0,
    goldPerMinute12: parseFloat(heroStatsData.goldPerMinute12) || 0,
    winRate: parseFloat(heroStatsData.winRate) || 0,
    firstBloodRate: parseFloat(heroStatsData.firstBloodRate) || 0,
  };

  // ข้อมูลสัปดาห์ที่เลือก
  const selectedWeekData = allWeeksData.find((data) => data.weekId === parseInt(selectedWeek))?.data || {};

  return (
    <div style={{ textAlign: "center" }}>
      <h2>
        สถิติของ {heroes.find((h) => h.id === parseInt(selectedHero)).name}{" "}
        {selectedTeam === "8"
          ? "ที่เจอในทุกทีม"
          : `ที่เจอทีม ${teams.find((t) => t.id === parseInt(selectedTeam)).name}`}
      </h2>

      {/* Dropdown เลือกสัปดาห์ */}
      <select
        onChange={handleWeekChange}
        style={{
          padding: "10px",
          fontSize: "16px",
          marginBottom: "10px",
          textAlign: "center",
          width: "200px",
          borderRadius: "5px",
          border: "2px solid #000000",
          backgroundColor: "#FF5722",
          color: "#FFFFFF",
          cursor: "pointer",
          outline: "none",
          transition: "border-color 0.3s, background-color 0.3s",
          boxShadow: "none",
          WebkitAppearance: "none",
          MozAppearance: "none",
          appearance: "none",
        }}
      >
        <option value="">เลือกสัปดาห์</option>
        {weeks.map((week) => (
          <option key={week.id} value={week.id}>
            {week.name}
          </option>
        ))}
      </select>

      {renderOverallStats(overallData.lastWeek, overallData.currentWeek, totalStats, selectedWeek)}

      {renderSummaryTable("สรุป", heroStatsData, comparisonData.lastWeek || {}, totalStats, selectedWeek)}

      <h3 style={{ marginTop: "20px" }}>เปรียบเทียบสถิติระหว่างสัปดาห์</h3>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "15px", marginTop: "20px" }}>
        {renderPieChart("KDA", selectedWeekData.kda || 0, heroStatsData.kda || 0, totalStats.kda || 0)}
        {renderPieChart("Damage Dealt", selectedWeekData.avgDamageDealt || 0, heroStatsData.avgDamageDealt || 0, totalStats.avgDamageDealt || 0)}
        {renderPieChart("Damage Taken", selectedWeekData.avgDamageTaken || 0, heroStatsData.avgDamageTaken || 0, totalStats.avgDamageTaken || 0)}
        {renderPieChart("Gold (8 นาที)", selectedWeekData.goldPerMinute8 || 0, heroStatsData.goldPerMinute8 || 0, totalStats.goldPerMinute8 || 0)}
        {renderPieChart("Gold (12 นาที)", selectedWeekData.goldPerMinute12 || 0, heroStatsData.goldPerMinute12 || 0, totalStats.goldPerMinute12 || 0)}
        {renderPieChart("Win Rate", parseFloat(selectedWeekData.winRate) || 0, parseFloat(heroStatsData.winRate) || 0, parseFloat(totalStats.winRate) || 0)}
        {renderPieChart("First Blood Rate", parseFloat(selectedWeekData.firstBloodRate) || 0, parseFloat(heroStatsData.firstBloodRate) || 0, parseFloat(totalStats.firstBloodRate) || 0)}
      </div>
    </div>
  );
};

export default HeroStats; 