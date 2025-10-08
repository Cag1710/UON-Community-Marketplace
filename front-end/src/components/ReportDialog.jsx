import { useEffect, useState } from 'react';

export default function ReportDialog({ open, onClose, onSubmit, title = 'Report', targetLabel }) {
  const [reportType, setReportType] = useState('Inappropriate');
  const [details, setDetails] = useState('');

  useEffect(() => { if (open) { setReportType('Inappropriate'); setDetails(''); } }, [open]);

  if (!open) return null;
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex',
               alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
      onClick={onClose}
    >
      <div style={{ background: '#fff', padding: 16, borderRadius: 8, minWidth: 340 }} onClick={e => e.stopPropagation()}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        {targetLabel && <p style={{ marginTop: 6, color: '#555' }}>Target: <b>{targetLabel}</b></p>}
        <label>
          Reason:{' '}
          <select value={reportType} onChange={e => setReportType(e.target.value)}>
            <option>Inappropriate</option>
            <option>Scam/Fraud</option>
            <option>Spam</option>
            <option>Other</option>
          </select>
        </label>
        <div style={{ marginTop: 8 }}>
          <textarea
            placeholder="Optional details…"
            rows={4}
            style={{ width: '100%' }}
            value={details}
            onChange={e => setDetails(e.target.value)}
          />
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={() => onSubmit({ reportType, details })}>Submit</button>
        </div>
      </div>
    </div>
  );
}