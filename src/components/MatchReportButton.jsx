// Button to export a simple match report image (PNG) and CSV from auditLog
import React from 'react';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { getLogs } from '../match/auditLog';

export default function MatchReportButton({ targetSelector = '#root', filePrefix = 'match-report' }) {
  const onExportImage = async () => {
    try {
      const el = document.querySelector(targetSelector) || document.body;
      const canvas = await html2canvas(el, { backgroundColor: null, scale: 2, useCORS: true });
      canvas.toBlob((blob) => {
        if (blob) saveAs(blob, `${filePrefix}.png`);
      });
    } catch (e) {
      console.error('Export image failed', e);
    }
  };

  const onExportCSV = () => {
    try {
      const logs = getLogs();
      if (!logs.length) {
        alert('No logs to export');
        return;
      }
      const keys = Array.from(new Set(logs.flatMap(o => Object.keys(o))));
      const header = keys.join(',');
      const lines = logs.map(o => keys.map(k => JSON.stringify(o[k] ?? '')).join(',')).join('\n');
      const blob = new Blob([header + '\n' + lines], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, `${filePrefix}.csv`);
    } catch (e) {
      console.error('Export CSV failed', e);
    }
  };

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <button onClick={onExportImage}>Export Report (PNG)</button>
      <button onClick={onExportCSV}>Export Logs (CSV)</button>
    </div>
  );
}
