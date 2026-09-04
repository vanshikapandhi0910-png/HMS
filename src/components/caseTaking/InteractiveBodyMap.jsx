import React, { useState } from 'react';
import { Activity, ShieldAlert, Sparkles, Trash2, Plus, Edit2, RotateCcw } from 'lucide-react';

export default function InteractiveBodyMap({ pins = [], onUpdatePins, readOnly = false }) {
  const [activeView, setActiveView] = useState('front'); // 'front' | 'back'
  const [selectedPart, setSelectedPart] = useState('chest');
  const [painLevel, setPainLevel] = useState(6);
  const [pinType, setPinType] = useState('pain'); // 'pain' | 'scar' | 'lesion' | 'surgery'
  const [pinNote, setPinNote] = useState('');
  const [hoveredPin, setHoveredPin] = useState(null);

  // Body parts mapping with coordinates for front & back views
  const bodyRegionsFront = [
    { id: 'head', name: 'Head & Face', x: 50, y: 10 },
    { id: 'neck', name: 'Neck & Throat', x: 50, y: 19 },
    { id: 'chest', name: 'Chest / Thorax', x: 50, y: 30 },
    { id: 'arm_left', name: 'Left Arm & Shoulder', x: 72, y: 38 },
    { id: 'arm_right', name: 'Right Arm & Shoulder', x: 28, y: 38 },
    { id: 'abdomen_upper', name: 'Upper Abdomen (Epigastrium)', x: 50, y: 42 },
    { id: 'abdomen_lower', name: 'Lower Abdomen / Pelvis', x: 50, y: 53 },
    { id: 'leg_left', name: 'Left Thigh & Knee', x: 62, y: 72 },
    { id: 'leg_right', name: 'Right Thigh & Knee', x: 38, y: 72 },
    { id: 'ankle_left', name: 'Left Ankle & Foot', x: 64, y: 92 },
    { id: 'ankle_right', name: 'Right Ankle & Foot', x: 36, y: 92 },
  ];

  const bodyRegionsBack = [
    { id: 'head_back', name: 'Occiput / Back of Head', x: 50, y: 10 },
    { id: 'neck_back', name: 'Cervical Spine / Nape', x: 50, y: 19 },
    { id: 'upper_back', name: 'Thoracic Spine & Scapula', x: 50, y: 32 },
    { id: 'arm_left_back', name: 'Left Posterior Arm', x: 72, y: 38 },
    { id: 'arm_right_back', name: 'Right Posterior Arm', x: 28, y: 38 },
    { id: 'lower_back', name: 'Lumbar Spine & Flanks', x: 50, y: 46 },
    { id: 'gluteal', name: 'Gluteal / Sacrum Region', x: 50, y: 56 },
    { id: 'hamstring_left', name: 'Left Hamstring & Calf', x: 62, y: 74 },
    { id: 'hamstring_right', name: 'Right Hamstring & Calf', x: 38, y: 74 },
    { id: 'heel_left', name: 'Left Heel / Achilles', x: 64, y: 92 },
    { id: 'heel_right', name: 'Right Heel / Achilles', x: 36, y: 92 },
  ];

  const activeRegions = activeView === 'front' ? bodyRegionsFront : bodyRegionsBack;

  const getPainColor = (level) => {
    if (level <= 3) return '#2ec4b6'; // mild green/teal
    if (level <= 6) return '#ff9f1c'; // moderate orange
    return '#e71d36'; // severe red
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'scar': return { label: 'Scar', bg: '#3a86ff' };
      case 'lesion': return { label: 'Skin Lesion', bg: '#8338ec' };
      case 'surgery': return { label: 'Surgical Site', bg: '#ff006e' };
      default: return { label: 'Pain Region', bg: '#e71d36' };
    }
  };

  const handleAddPin = () => {
    if (!selectedPart) return;
    const reg = activeRegions.find(r => r.id === selectedPart);
    if (!reg) return;

    const newPin = {
      id: 'PIN-' + Date.now(),
      part: reg.name,
      partId: reg.id,
      x: reg.x,
      y: reg.y,
      view: activeView,
      painLevel,
      type: pinType,
      note: pinNote || `${pinType.toUpperCase()} documented at ${reg.name} (Intensity: ${painLevel}/10)`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    onUpdatePins([...pins, newPin]);
    setPinNote('');
  };

  const handleRemovePin = (pinId) => {
    onUpdatePins(pins.filter(p => p.id !== pinId));
  };

  const currentViewPins = pins.filter(p => (p.view || 'front') === activeView);

  return (
    <div className="glass-card" style={{ padding: '24px', borderRadius: '16px', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ color: '#fff', fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity style={{ color: 'var(--accent-teal)' }} size={22} />
            Interactive Human Body Symptom Mapper
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
            Click anatomical zones to pin symptom locations, paint pain heat-maps (1-10 scale), or mark surgical/scar sites visually.
          </p>
        </div>

        {/* View Switcher: Front / Back */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', padding: '4px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            onClick={() => setActiveView('front')}
            style={{
              padding: '6px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.85rem',
              background: activeView === 'front' ? 'var(--accent-teal)' : 'transparent',
              color: activeView === 'front' ? '#0f172a' : '#94a3b8',
              transition: 'all 0.2s ease'
            }}
          >
            Anterior (Front View)
          </button>
          <button
            onClick={() => setActiveView('back')}
            style={{
              padding: '6px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.85rem',
              background: activeView === 'back' ? 'var(--accent-teal)' : 'transparent',
              color: activeView === 'back' ? '#0f172a' : '#94a3b8',
              transition: 'all 0.2s ease'
            }}
          >
            Posterior (Back View)
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: readOnly ? '1fr' : '1fr 340px', gap: '24px', alignItems: 'start' }}>
        {/* SVG / Visual Body Contour Canvas */}
        <div style={{
          position: 'relative',
          height: '480px',
          background: 'radial-gradient(circle at center, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
          borderRadius: '16px',
          border: '1px dashed rgba(255,255,255,0.15)',
          display: 'flex',
          justify: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          padding: '16px'
        }}>
          {/* Subtle Anatomical Silhouette Overlay */}
          <svg viewBox="0 0 100 100" style={{ height: '90%', width: 'auto', filter: 'drop-shadow(0 0 10px rgba(46,196,182,0.15))' }}>
            {/* Body Outline Silhouette */}
            <path
              d={activeView === 'front' ?
                "M 50,6 C 44,6 42,12 42,17 C 42,19 44,21 44,22 C 38,23 32,28 30,34 L 18,52 C 16,55 20,57 22,54 L 32,40 L 32,58 L 38,76 L 36,96 C 36,98 42,98 42,96 L 46,76 L 50,60 L 54,76 L 58,96 C 58,98 64,98 64,96 L 62,76 L 68,58 L 68,40 L 78,54 C 80,57 84,55 82,52 L 70,34 C 68,28 62,23 56,22 C 56,21 58,19 58,17 C 58,12 56,6 50,6 Z"
                :
                "M 50,6 C 44,6 42,12 42,17 C 42,19 44,21 44,22 C 38,24 32,29 30,35 L 18,53 C 16,56 20,58 22,55 L 32,41 L 32,59 L 38,77 L 36,96 C 36,98 42,98 42,96 L 46,76 L 50,60 L 54,76 L 58,96 C 58,98 64,98 64,96 L 62,77 L 68,59 L 68,41 L 78,55 C 80,58 84,56 82,53 L 70,35 C 68,29 62,24 56,22 C 56,21 58,19 58,17 C 58,12 56,6 50,6 Z"
              }
              fill="rgba(30, 41, 59, 0.6)"
              stroke="var(--accent-teal)"
              strokeWidth="0.8"
              strokeDasharray="2,1"
            />
            {/* Grid Guidelines */}
            <circle cx="50" cy="14" r="5" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
            <rect x="42" y="24" width="16" height="28" rx="4" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
          </svg>

          {/* Clickable anatomical region target points */}
          {activeRegions.map(reg => {
            const isSelected = selectedPart === reg.id;
            return (
              <div
                key={reg.id}
                onClick={() => setSelectedPart(reg.id)}
                style={{
                  position: 'absolute',
                  left: `${reg.x}%`,
                  top: `${reg.y}%`,
                  transform: 'translate(-50%, -50%)',
                  width: isSelected ? '28px' : '20px',
                  height: isSelected ? '28px' : '20px',
                  borderRadius: '50%',
                  background: isSelected ? 'rgba(46, 196, 182, 0.4)' : 'rgba(255, 255, 255, 0.1)',
                  border: isSelected ? '2px solid var(--accent-teal)' : '1px solid rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  zIndex: 2,
                }}
                title={reg.name}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isSelected ? 'var(--accent-teal)' : '#94a3b8' }} />
              </div>
            );
          })}

          {/* Render Active Pinned Markers on Body Contour */}
          {currentViewPins.map(pin => {
            const badge = getTypeBadge(pin.type);
            const color = getPainColor(pin.painLevel);
            const isHovered = hoveredPin === pin.id;

            return (
              <div
                key={pin.id}
                onMouseEnter={() => setHoveredPin(pin.id)}
                onMouseLeave={() => setHoveredPin(null)}
                style={{
                  position: 'absolute',
                  left: `${pin.x}%`,
                  top: `${pin.y}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10,
                  cursor: 'pointer',
                }}
              >
                {/* Heat-map radiating pulse circle */}
                <div style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: `${pin.painLevel * 6 + 12}px`,
                  height: `${pin.painLevel * 6 + 12}px`,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${color}66 0%, ${color}00 70%)`,
                  animation: 'pulse 2s infinite',
                  pointerEvents: 'none'
                }} />

                {/* Pin Badge Icon */}
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: color,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  boxShadow: `0 0 12px ${color}`,
                  border: '2px solid #fff',
                  transform: isHovered ? 'scale(1.25)' : 'scale(1)',
                  transition: 'transform 0.2s ease'
                }}>
                  {pin.painLevel}
                </div>

                {/* Hover Tooltip */}
                {isHovered && (
                  <div style={{
                    position: 'absolute',
                    bottom: '30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    width: '180px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                    zIndex: 20,
                    pointerEvents: 'none'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', color: badge.bg }}>{badge.label}</span>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{pin.timestamp}</span>
                    </div>
                    <div style={{ color: '#fff', fontSize: '0.8rem', fontWeight: '600' }}>{pin.part}</div>
                    <div style={{ color: '#cbd5e1', fontSize: '0.75rem', marginTop: '4px' }}>{pin.note}</div>
                  </div>
                )}
              </div>
            );
          })}

          <div style={{ position: 'absolute', bottom: '12px', left: '16px', fontSize: '0.75rem', color: '#64748b' }}>
            Current View: <strong style={{ color: 'var(--accent-teal)' }}>{activeView === 'front' ? 'Anterior / Front' : 'Posterior / Back'}</strong> ({currentViewPins.length} Pins)
          </div>
        </div>

        {/* Pin Controls & Annotation Panel (Doctor / Clinician Input) */}
        {!readOnly && (
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={16} style={{ color: 'var(--accent-teal)' }} />
              Annotate Anatomical Region
            </h4>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Target Body Region</label>
              <select
                value={selectedPart}
                onChange={(e) => setSelectedPart(e.target.value)}
                className="input-field"
                style={{ width: '100%', background: '#0f172a', color: '#fff', borderRadius: '8px', padding: '8px 12px', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                {activeRegions.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Pain / Intensity Scale: <strong style={{ color: getPainColor(painLevel) }}>{painLevel} / 10</strong>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={painLevel}
                onChange={(e) => setPainLevel(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: getPainColor(painLevel) }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
                <span>1 (Mild)</span>
                <span>5 (Moderate)</span>
                <span>10 (Severe)</span>
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Annotation Category</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {[
                  { id: 'pain', label: 'Pain / Tender' },
                  { id: 'scar', label: 'Scar / Mark' },
                  { id: 'lesion', label: 'Skin Lesion' },
                  { id: 'surgery', label: 'Surgical Site' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setPinType(cat.id)}
                    style={{
                      padding: '6px 8px',
                      borderRadius: '6px',
                      border: pinType === cat.id ? '1px solid var(--accent-teal)' : '1px solid rgba(255,255,255,0.1)',
                      background: pinType === cat.id ? 'rgba(46, 196, 182, 0.15)' : 'rgba(255,255,255,0.03)',
                      color: pinType === cat.id ? 'var(--accent-teal)' : '#cbd5e1',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Clinical Sensation Notes</label>
              <input
                type="text"
                value={pinNote}
                onChange={(e) => setPinNote(e.target.value)}
                placeholder="e.g. Throbbing, radiating to forearm..."
                className="input-field"
                style={{ width: '100%', background: '#0f172a', color: '#fff', borderRadius: '8px', padding: '8px 12px', border: '1px solid rgba(255,255,255,0.15)' }}
              />
            </div>

            <button
              type="button"
              onClick={handleAddPin}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '0.85rem' }}
            >
              Pin Location to Body Map
            </button>
          </div>
        )}
      </div>

      {/* Pinned Items Table Summary */}
      {pins.length > 0 && (
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <h4 style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '10px' }}>Active Body Map Pin History ({pins.length})</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
            {pins.map(pin => {
              const badge = getTypeBadge(pin.type);
              const color = getPainColor(pin.painLevel);
              return (
                <div key={pin.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: '700' }}>
                      {pin.painLevel}
                    </div>
                    <div>
                      <span style={{ color: '#fff', fontSize: '0.82rem', fontWeight: '600' }}>{pin.part}</span>
                      <span style={{ marginLeft: '8px', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: badge.bg, color: '#fff' }}>
                        {badge.label} ({pin.view?.toUpperCase() || 'FRONT'})
                      </span>
                      <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '2px' }}>{pin.note}</div>
                    </div>
                  </div>

                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => handleRemovePin(pin.id)}
                      style={{ background: 'none', border: 'none', color: '#e71d36', cursor: 'pointer', padding: '4px' }}
                      title="Remove Pin"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
