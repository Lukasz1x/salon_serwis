import React from 'react';

export const styles: Record<string, React.CSSProperties> = {
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,15,30,0.55)', backdropFilter: 'blur(2px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' },
    modal: { background: '#fff', borderRadius: 8, boxShadow: '0 16px 48px rgba(0,0,0,0.22)', width: 640, maxWidth: '100%', maxHeight: 'calc(100vh - 80px)', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
    modalHeader: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #f0f0f0', flexShrink: 0 },
    modalTitle: { display: 'block', fontWeight: 700, fontSize: 16, color: '#1a1a2e', fontFamily: "'Georgia', serif" },
    modalAddress: { display: 'block', fontSize: 12, color: '#888', marginTop: 2 },
    modalClose: { background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#aaa', lineHeight: 1, padding: '0 0 0 12px', flexShrink: 0 },
    modalFooter: { padding: '12px 20px', borderTop: '1px solid #f0f0f0', flexShrink: 0 },
    modalLink: { fontSize: 12, color: '#1a6bff', textDecoration: 'none' },
    btnCancel: { padding: '3px 8px', background: '#e5e7eb', color: '#333', border: 'none', borderRadius: 3, cursor: 'pointer', fontSize: 13 },
};

export const addStyles: Record<string, React.CSSProperties> = {
    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px', padding: '16px 20px', flexShrink: 0 },
    field: { display: 'flex', flexDirection: 'column', gap: 4 },
    label: { fontSize: 11, fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em' },
    input: { fontSize: 13, padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 4, outline: 'none', color: '#1a1a2e' },
    error: { fontSize: 11, color: '#dc2626' },
    mapHint: { padding: '6px 20px', fontSize: 12, color: '#666', background: '#f9fafb', borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', flexShrink: 0 },
    btnSave: { padding: '7px 20px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13, fontWeight: 600 },
};