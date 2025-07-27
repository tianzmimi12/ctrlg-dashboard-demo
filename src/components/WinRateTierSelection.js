import React from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

const color = {
  bg: "#1a1b26",
  neon: "#7affeb",
  purple: "#a462ff",
};

const fadeIn = keyframes`
  0% { opacity:0; transform: translateY(30px);}
  100% { opacity:1; transform: translateY(0);}
`;

const MainBox = styled.div`
  background: ${color.bg};
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Card = styled.div`
  background: rgba(255,255,255,0.13);
  border-radius: 28px;
  box-shadow: 0 4px 38px 0 #7affeb25, 0 2px 14px #a462ff18;
  padding: 52px 62px;
  text-align: center;
  animation: ${fadeIn} .7s;
`;

const GoButton = styled.button`
  background: linear-gradient(90deg, ${color.neon} 70%, ${color.purple} 100%);
  color: #232447;
  font-weight: 900;
  font-size: 1.19rem;
  padding: 18px 58px;
  border-radius: 33px;
  border: none;
  box-shadow: 0 2px 12px #7affeb55;
  margin-top: 34px;
  cursor: pointer;
  transition: background 0.19s, color 0.17s, transform 0.17s;
  &:hover {
    background: linear-gradient(92deg, ${color.purple} 50%, ${color.neon} 100%);
    color: #fff;
    transform: scale(1.05) translateY(-2px);
  }
`;

// ... import, styled-components ทั้งหมด (เหมือนเดิม) ...

export default function WinRateTierSelection() {
  const navigate = useNavigate();
  return (
    <MainBox>
      <Card>
        <div style={{
          fontWeight: 900,
          fontSize: "2.3rem",
          color: color.neon,
          marginBottom: 12,
          letterSpacing: 1,
        }}>
          Win/Lose Ratio & Pool Heroes
        </div>
        <div style={{
          fontWeight: 700,
          color: "#fff",
          fontSize: "1.09rem",
          marginBottom: 15,
          opacity: 0.93,
        }}>
          กราฟนี้จะแสดง Winrate รวม (Pie Chart) <br/>
          และ "Pool Heroes" คือรายชื่อฮีโร่ที่ทีมเลือกใช้จริงในแมตช์ซีซั่นนี้<br />
          <span style={{color: color.neon, fontWeight: 800}}>คลิกปุ่มด้านล่างเพื่อดูรายชื่อ Pool Heroes พร้อมสถิติกราฟ tier และ winrate รายตัว</span>
        </div>
        <GoButton onClick={() => navigate(`/tier-data`)}>
          ไปหน้าดู Pool Heroes & สถิติ Winrate
        </GoButton>
      </Card>
    </MainBox>
  );
}