import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// ลงทะเบียน components ที่จำเป็นสำหรับ Pie Chart
ChartJS.register(
  ArcElement, // ลงทะเบียน ArcElement สำหรับกราฟวงกลม
  Tooltip,    // ลงทะเบียน Tooltip สำหรับแสดงข้อมูลเมื่อ hover
  Legend,     // ลงทะเบียน Legend สำหรับคำอธิบายกราฟ
  ChartDataLabels // ลงทะเบียน Plugin สำหรับแสดงตัวเลขบนกราฟ
);

// ฟังก์ชันสำหรับ render Overall Stats
export const renderOverallStats = (lastWeekStats, currentWeekStats, totalStats, selectedWeek) => {
  const statsList = [
    { label: "จำนวนเกม", key: "games", better: "higher" },
    { label: "Kill", key: "kills", better: "higher" },
    { label: "Death", key: "deaths", better: "lower" },
    { label: "Assist", key: "assists", better: "higher" },
    { label: "First Blood", key: "firstBlood", better: "higher" },
    { label: "First Death", key: "firstDeath", better: "lower" },
  ];

  return (
    <div style={{ width: "100%", padding: "10px", border: "1px solid #FF5722", borderRadius: "5px", marginBottom: "10px" }}>
      <h3>Overall Stats</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
        <thead>
          <tr>
            <th style={{ padding: "10px", borderBottom: "1px solid #FF5722" }}>Stat</th>
            <th style={{ padding: "10px", borderBottom: "1px solid #FF5722" }}>สัปดาห์ {selectedWeek}</th>
            <th style={{ padding: "10px", borderBottom: "1px solid #FF5722" }}>สัปดาห์ปัจจุบัน</th>
            <th style={{ padding: "10px", borderBottom: "1px solid #FF5722" }}>สรุปทั้งหมด</th>
          </tr>
        </thead>
        <tbody>
          {statsList.map((stat) => {
            const lastWeekValue = lastWeekStats[stat.key] || 0;
            const currentWeekValue = currentWeekStats[stat.key] || 0;
            const totalStatsValue = totalStats[stat.key] || 0;
            const isBetter = stat.better === "higher" 
              ? currentWeekValue > lastWeekValue 
              : currentWeekValue < lastWeekValue;
            const isEqual = currentWeekValue === lastWeekValue;

            return (
              <tr key={stat.key}>
                <td style={{ padding: "10px", borderBottom: "1px solid #444" }}>{stat.label}</td>
                <td
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #444",
                    backgroundColor: isEqual ? "#FFEB3B" : "transparent",
                    color: isEqual ? "#000" : "inherit",
                  }}
                >
                  {lastWeekValue}
                </td>
                <td
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #444",
                    backgroundColor: isEqual ? "#FFEB3B" : isBetter ? "#4CAF50" : "#FF5722",
                    color: isEqual ? "#000" : "#fff",
                  }}
                >
                  {currentWeekValue}
                </td>
                <td
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #444",
                    backgroundColor: "#4CAF50",
                    color: "#fff",
                  }}
                >
                  {totalStatsValue}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// ฟังก์ชันสำหรับ render Summary Table
export const renderSummaryTable = (title, stats, comparisonStats, totalStats, selectedWeek) => {
  const statsList = [
    { label: "Damage Dealt เฉลี่ย", key: "avgDamageDealt", better: "higher" },
    { label: "Damage Taken เฉลี่ย", key: "avgDamageTaken", better: "lower" },
    { label: "% Teamfight", key: "teamfightParticipation", better: "higher", isPercentage: true },
    { label: "Gold per Minute (8 นาที)", key: "goldPerMinute8", better: "higher" },
    { label: "Gold per Minute (12 นาที)", key: "goldPerMinute12", better: "higher" },
    { label: "Win Rate", key: "winRate", better: "higher", isPercentage: true },
    { label: "First Blood Rate", key: "firstBloodRate", better: "higher", isPercentage: true },
  ];

  return (
    <div style={{ width: "100%", padding: "10px", border: "1px solid #FF5722", borderRadius: "5px", marginBottom: "10px" }}>
      <h3>{title}</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
        <thead>
          <tr>
            <th style={{ padding: "10px", borderBottom: "1px solid #FF5722" }}>Stat</th>
            <th style={{ padding: "10px", borderBottom: "1px solid #FF5722" }}>สัปดาห์ {selectedWeek}</th>
            <th style={{ padding: "10px", borderBottom: "1px solid #FF5722" }}>สัปดาห์ปัจจุบัน</th>
            <th style={{ padding: "10px", borderBottom: "1px solid #FF5722" }}>สรุปทั้งหมด</th>
            <th style={{ padding: "10px", borderBottom: "1px solid #FF5722" }}>การเปลี่ยนแปลง (%)</th>
          </tr>
        </thead>
        <tbody>
          {statsList.map((stat) => {
            const lastWeekValue = parseFloat(comparisonStats?.[stat.key]) || 0;
            const currentWeekValue = parseFloat(stats[stat.key]) || 0;
            const totalStatsValue = parseFloat(totalStats[stat.key]) || 0;
            const isBetter = stat.better === "higher" 
              ? currentWeekValue > lastWeekValue 
              : currentWeekValue < lastWeekValue;
            const isEqual = currentWeekValue === lastWeekValue;

            const changePercent = lastWeekValue !== 0
              ? (((currentWeekValue - lastWeekValue) / lastWeekValue) * 100).toFixed(2)
              : "0.00";
           
            const formatValue = (value) => 
              stat.isPercentage ? `${value}%` : value;

            return (
              <tr key={stat.key}>
                <td style={{ padding: "10px", borderBottom: "1px solid #444" }}>{stat.label}</td>
                <td
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #444",
                    backgroundColor: isEqual ? "#FFEB3B" : "transparent",
                    color: isEqual ? "#000" : "inherit",
                  }}
                >
                  {formatValue(lastWeekValue)}
                </td>
                <td
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #444",
                    backgroundColor: isEqual ? "#FFEB3B" : isBetter ? "#4CAF50" : "#FF5722",
                    color: isEqual ? "#000" : "#fff",
                  }}
                >
                  {formatValue(currentWeekValue)}
                </td>
                <td
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #444",
                    backgroundColor: "#4CAF50",
                    color: "#fff",
                  }}
                >
                  {formatValue(totalStatsValue)}
                </td>
                <td
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #444",
                    color: isEqual ? "#000" : isBetter ? "#4CAF50" : "#FF5722",
                  }}
                >
                  {changePercent}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// ฟังก์ชันสำหรับ render กราฟวงกลม
export const renderPieChart = (title, selectedWeekData, currentWeekData, totalStatsData) => {
  // คำนวณเปอร์เซ็นต์จากสัดส่วนของค่าแต่ละค่าเทียบกับผลรวม
  const calculatePercentage = (value1, value2, value3) => {
    const total = value1 + value2 + value3;
    return [
      ((value1 / total) * 100).toFixed(1), // เปอร์เซ็นต์ของค่า 1
      ((value2 / total) * 100).toFixed(1), // เปอร์เซ็นต์ของค่า 2
      ((value3 / total) * 100).toFixed(1), // เปอร์เซ็นต์ของค่า 3
    ];
  };

  const percentages = calculatePercentage(
    selectedWeekData || 0,
    currentWeekData || 0,
    totalStatsData || 0
  );

  const chartData = {
    labels: ["สัปดาห์ที่เลือก", "สัปดาห์ปัจจุบัน", "สรุปทั้งหมด"],
    datasets: [
      {
        label: title,
        data: [selectedWeekData || 0, currentWeekData || 0, totalStatsData || 0], // ใช้ค่าต้นฉบับ
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)", // สีแดง
          "rgba(54, 162, 235, 0.5)", // สีน้ำเงิน
          "rgba(75, 192, 192, 0.5)", // สีเขียว
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)", // สีแดง
          "rgba(54, 162, 235, 1)", // สีน้ำเงิน
          "rgba(75, 192, 192, 1)", // สีเขียว
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ width: "45%", textAlign: "center", height: "200px", marginBottom: "10px" }}>
      <h4>{title}</h4>
      <Pie
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              enabled: true,
              mode: "index",
              intersect: false,
              callbacks: {
                label: (context) => {
                  const label = context.label || "";
                  const rawValue = context.raw || 0; // ค่าต้นฉบับ
                  const percentageValue = percentages[context.dataIndex] || 0; // เปอร์เซ็นต์
                  return `${label}: ${rawValue} (${percentageValue}%)`; // แสดงทั้งค่าต้นฉบับและเปอร์เซ็นต์
                },
              },
            },
            legend: {
              position: "top",
            },
            datalabels: {
              color: "#000", // สีตัวเลข
              font: {
                weight: "bold", // ตัวหนา
                size: 14, // ขนาดตัวเลข
              },
              formatter: (value, context) => {
                const percentageValue = percentages[context.dataIndex] || 0; // เปอร์เซ็นต์
                return `${value}\n(${percentageValue}%)`; // แสดงทั้งค่าต้นฉบับและเปอร์เซ็นต์
              },
            },
          },
        }}
      />
    </div>
  );
};