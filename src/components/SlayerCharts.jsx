// components/SlayerCharts.jsx
import React, { useState } from 'react';
import {
  ResponsiveContainer,
  PieChart, Pie, Cell,
  Tooltip as ReTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
  ScatterChart, Scatter, ZAxis, CartesianGrid as ReCartesianGrid
} from 'recharts';

// --- Layout & Card Wrapper ---
export const DashboardLayout = ({ children }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '16px',
    padding: '16px'
  }}>
    {children}
  </div>
);

const ChartCard = ({ title, children }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '8px',
        boxShadow: hover ? '0 8px 16px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.1)',
        transform: hover ? 'translateY(-4px)' : 'none',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={{
        padding: '12px 16px',
        fontWeight: 600,
        fontSize: '1.1em',
        borderBottom: '1px solid #eee',
        color: '#333'
      }}>
        {title}
      </div>
      <div style={{
        padding: '16px',
        background: '#fcfcfc',
        flex: 1
      }}>
        {children}
      </div>
    </div>
  );
};

// --- Custom Tooltip ---
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(0,0,0,0.75)',
      color: '#fff',
      padding: '8px 12px',
      borderRadius: '4px',
      fontSize: '12px'
    }}>
      <p style={{ margin: 0 }}><strong>{label}</strong></p>
      {payload.map((entry, i) => (
        <p key={i} style={{ margin: '4px 0' }}>
          <span style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            marginRight: '6px',
            borderRadius: '50%',
            background: entry.color
          }} />
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// --- Pie / Doughnut ---
export const PieMetric = ({ data, nameKey, valueKey, title }) => (
  <ChartCard title={title}>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <defs>
          <linearGradient id="gradPie" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00C49F" stopOpacity={0.8}/>
            <stop offset="100%" stopColor="#0088FE" stopOpacity={0.8}/>
          </linearGradient>
        </defs>
        <Pie
          data={data}
          dataKey={valueKey}
          nameKey={nameKey}
          cx="50%" cy="50%"
          outerRadius={100} innerRadius={60}
          isAnimationActive animationDuration={800}
          label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
        >
          {data.map((_, i) => (
            <Cell key={i} fill="url(#gradPie)" />
          ))}
        </Pie>
        <ReTooltip content={<CustomTooltip />} />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  </ChartCard>
);

// --- Bar ---
export const BarMetric = ({ data, xKey, yKey, title }) => (
  <ChartCard title={title}>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top:20, right:30, left:20, bottom:5 }}>
        <defs>
          <linearGradient id="gradBar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFBB28" stopOpacity={0.9}/>
            <stop offset="100%" stopColor="#FF8042" stopOpacity={0.9}/>
          </linearGradient>
          <filter id="shadow" height="130%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#888"/>
          </filter>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <ReTooltip content={<CustomTooltip />} />
        <Bar
          dataKey={yKey}
          fill="url(#gradBar)"
          isAnimationActive animationDuration={800}
          filter="url(#shadow)"
        />
      </BarChart>
    </ResponsiveContainer>
  </ChartCard>
);

// --- Line ---
export const LineMetric = ({ data, xKey, yKey, title }) => (
  <ChartCard title={title}>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top:20, right:30, left:20, bottom:5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <ReTooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey={yKey}
          stroke="#82ca9d"
          strokeWidth={3}
          dot={{ r:5 }}
          isAnimationActive animationDuration={1000}
        />
      </LineChart>
    </ResponsiveContainer>
  </ChartCard>
);

// --- Heatmap (CSS Grid) ---
const HeatmapCell = ({ value, color }) => {
  const [hover, setHover] = useState(false);
  const opacity = Math.min(Math.max(value,0),1);
  const bg = color.replace(
    /rgb\((\d+),\s*(\d+),\s*(\d+)\)/,
    `rgba($1,$2,$3,${opacity})`
  );
  return (
    <div
      style={{
        backgroundColor: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: '0.85em',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        transform: hover ? 'scale(1.1)' : 'none',
        boxShadow: hover ? '0 0 8px rgba(0,0,0,0.2)' : 'none',
        zIndex: hover ? 1 : 0
      }}
      onMouseEnter={()=>setHover(true)}
      onMouseLeave={()=>setHover(false)}
      title={value.toFixed(2)}
    >
      {value.toFixed(2)}
    </div>
  );
};

export const HeatmapMetric = ({ xLabels, yLabels, data, title, color='rgb(255,128,66)' }) => (
  <ChartCard title={title}>
    <div style={{
      display: 'grid',
      gridAutoRows: '40px',
      gridTemplateColumns: `repeat(${xLabels.length+1}, minmax(80px,1fr))`,
      gap: '2px'
    }}>
      <div />
      {xLabels.map(x => (
        <div key={x} style={{
          fontWeight:'bold', textAlign:'center', display:'flex',
          alignItems:'center', justifyContent:'center'
        }}>{x}</div>
      ))}
      {yLabels.map((y,row)=>(
        <React.Fragment key={y}>
          <div style={{
            fontWeight:'bold', textAlign:'center', display:'flex',
            alignItems:'center', justifyContent:'center'
          }}>{y}</div>
          {data[row].map((val,col)=>(
            <HeatmapCell key={`${row}-${col}`} value={val} color={color}/>
          ))}
        </React.Fragment>
      ))}
    </div>
  </ChartCard>
);

// --- Scatter / Bubble ---
export const ScatterMetric = ({ data, xKey, yKey, sizeKey, title }) => (
  <ChartCard title={title}>
    <ResponsiveContainer width="100%" height={300}>
      <ScatterChart margin={{ top:20, right:20, bottom:10, left:10 }}>
        <ReCartesianGrid />
        <XAxis dataKey={xKey} name={xKey} />
        <YAxis dataKey={yKey} name={yKey} />
        <ZAxis dataKey={sizeKey} range={[60,400]} name={sizeKey} />
        <ReTooltip content={<CustomTooltip />} cursor={{ strokeDasharray:'3 3' }} />
        <Scatter
          name={title}
          data={data}
          fill="#ff7300"
          isAnimationActive animationDuration={1000}
        />
      </ScatterChart>
    </ResponsiveContainer>
  </ChartCard>
);
