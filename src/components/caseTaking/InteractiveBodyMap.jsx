import React, { useState } from 'react';
import { Activity, Plus, Trash2, Heart, ShieldAlert, Sparkles, User, Info } from 'lucide-react';

const SPECIALTY_MAPS = {
  Cardiologist: {
    name: 'Cardiovascular & Cardiac Chamber Anatomy',
    badge: 'Cardiology Specialist Map',
    icon: Heart,
    description: 'Substernal chest, coronary arteries, cardiac valves, and left arm radiation vectors.',
    parts: [
      { id: 'card-1', label: 'Left Substernal / Anterior Chest', defaultPin: 'Squeezing Anginal Pain (Severity 8/10)' },
      { id: 'card-2', label: 'Left Arm & Shoulder Radiation', defaultPin: 'Inner Bicep Paresthesia' },
      { id: 'card-3', label: 'Apex / Left Ventricle Area', defaultPin: 'S4 Gallop / Apical Impulse' },
      { id: 'card-4', label: 'Aortic & Carotid Region', defaultPin: 'Systolic Murmur / Bruit' },
      { id: 'card-5', label: 'Epigastric / Lower Chest', defaultPin: 'Postprandial Oppression' },
    ],
    svgType: 'cardiology'
  },
  Dentist: {
    name: 'Maxillofacial Dental Arch & Periodontal Structure',
    badge: 'Dental & Maxillofacial Map',
    icon: Activity,
    description: 'Upper maxillary arch, lower mandibular arch, molars, incisors, and gingival mucosa.',
    parts: [
      { id: 'dent-1', label: 'Upper Right Molars (#16 - #18)', defaultPin: 'Deep Caries with Pulpitis' },
      { id: 'dent-2', label: 'Upper Front Incisors (#11 - #21)', defaultPin: 'Enamel Fracture / Chipped Edge' },
      { id: 'dent-3', label: 'Lower Left Molars (#36 - #38)', defaultPin: 'Impacted Wisdom Tooth Pain' },
      { id: 'dent-4', label: 'Lower Premolars & Gums (#44 - #45)', defaultPin: 'Gingival Bleeding & Receding Gum' },
      { id: 'dent-5', label: 'Temporomandibular Joint (TMJ)', defaultPin: 'Jaw Clicking & Bruxism Pain' },
    ],
    svgType: 'dental'
  },
  Dermatologist: {
    name: 'Cutaneous Lesion & Dermatome Surface Map',
    badge: 'Dermatology & Skin Lesion Map',
    icon: Sparkles,
    description: 'Anterior & Posterior full body skin surfaces for rash, eczema, psoriasis, and lesion tracking.',
    parts: [
      { id: 'derm-1', label: 'Facial T-Zone & Cheeks', defaultPin: 'Erythematous Papules / Acne Rosacea' },
      { id: 'derm-2', label: 'Bilateral Forearms & Flexor Surfaces', defaultPin: 'Pruritic Lichenified Eczema' },
      { id: 'derm-3', label: 'Scalp & Post-Auricular Area', defaultPin: 'Seborrheic Flaking & Plaque' },
      { id: 'derm-4', label: 'Extensor Knees & Elbows', defaultPin: 'Silvery Psoriatic Plaques' },
      { id: 'derm-5', label: 'Lower Back & Lumbar Dermatome', defaultPin: 'Dermatomal Vesicular Rash (Herpes Zoster)' },
    ],
    svgType: 'dermatology'
  },
  Orthopaedic: {
    name: 'Skeletal Musculoskeletal & Joint Structure Map',
    badge: 'Ortho & Joint Trauma Map',
    icon: ShieldAlert,
    description: 'Cervical & Lumbar spine, Knee joints, Shoulder girdle, Hip acetabulum, and Ligaments.',
    parts: [
      { id: 'ortho-1', label: 'Right Knee Joint (Tibiofemoral)', defaultPin: 'Medial Meniscus Tear & Effusion' },
      { id: 'ortho-2', label: 'Lumbar Spine (L4-L5 / L5-S1)', defaultPin: 'Disc Prolapse with Sciatica' },
      { id: 'ortho-3', label: 'Left Shoulder (Rotator Cuff)', defaultPin: 'Supraspinatus Tendonitis' },
      { id: 'ortho-4', label: 'Cervical Spine (C5-C7)', defaultPin: 'Cervical Spondylosis Stiffness' },
      { id: 'ortho-5', label: 'Right Ankle & Achilles Tendon', defaultPin: 'Inversion Sprain & Lateral Swelling' },
    ],
    svgType: 'ortho'
  },
  General: {
    name: 'General Systemic Anatomical Map',
    badge: 'Clinical Anatomical Map',
    icon: User,
    description: 'General human body anterior and posterior anatomical zones.',
    parts: [
      { id: 'gen-1', label: 'Thorax & Mid-Chest', defaultPin: 'Sternal Pain' },
      { id: 'gen-2', label: 'Right Upper Quadrant Abdomen', defaultPin: 'Tenderness' },
      { id: 'gen-3', label: 'Left Lower Extremity', defaultPin: 'Edema' },
      { id: 'gen-4', label: 'Frontal Head & Temple', defaultPin: 'Throbbing Headache' },
    ],
    svgType: 'general'
  }
};

export default function InteractiveBodyMap({
  specialty = 'Cardiologist',
  pins = [],
  onUpdatePins,
  readOnly = false
}) {
  // Normalize specialty name to select specialty map
  const getMapKey = (spec) => {
    if (!spec) return 'General';
    const lower = spec.toLowerCase();
    if (lower.includes('cardio')) return 'Cardiologist';
    if (lower.includes('dent')) return 'Dentist';
    if (lower.includes('derm')) return 'Dermatologist';
    if (lower.includes('ortho') || lower.includes('physio')) return 'Orthopaedic';
    return 'General';
  };

  const [activeMapKey, setActiveMapKey] = useState(getMapKey(specialty));
  const currentMap = SPECIALTY_MAPS[activeMapKey] || SPECIALTY_MAPS.General;
  const MapIcon = currentMap.icon;

  const [selectedPartId, setSelectedPartId] = useState(currentMap.parts[0]?.id || '');
  const [pinNote, setPinNote] = useState('');
  const [painLevel, setPainLevel] = useState(7);

  const handleAddPinForPart = (part) => {
    if (readOnly) return;
    const newPin = {
      id: `pin-${Date.now()}`,
      part: part.label,
      painLevel,
      type: painLevel >= 8 ? 'severe' : painLevel >= 5 ? 'moderate' : 'mild',
      note: pinNote.trim() || part.defaultPin,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = [...pins, newPin];
    if (onUpdatePins) onUpdatePins(updated);
    setPinNote('');
  };

  const handleRemovePin = (id) => {
    if (readOnly) return;
    const updated = pins.filter(p => p.id !== id);
    if (onUpdatePins) onUpdatePins(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Specialty Map Header Selector */}
      <div style={{ background: 'rgba(15, 23, 42, 0.9)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-teal" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <MapIcon size={14} /> {currentMap.badge}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Attending Specialty: <strong style={{ color: '#fff' }}>{specialty || 'General Practice'}</strong>
              </span>
            </div>
            <h3 style={{ color: '#fff', fontSize: '1.2rem', margin: 0 }}>
              {currentMap.name}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '4px 0 0 0' }}>
              {currentMap.description}
            </p>
          </div>

          {/* Specialty View Switcher */}
          <div style={{ display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '10px' }}>
            {['Cardiologist', 'Dentist', 'Dermatologist', 'Orthopaedic', 'General'].map(key => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setActiveMapKey(key);
                  setSelectedPartId(SPECIALTY_MAPS[key].parts[0]?.id || '');
                }}
                style={{
                  background: activeMapKey === key ? 'var(--accent-teal)' : 'transparent',
                  color: activeMapKey === key ? '#fff' : 'var(--text-muted)',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {key}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Body Map Canvas Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Anatomical Diagram Focus Panel */}
        <div style={{ background: '#0f172a', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '380px', position: 'relative' }}>
          
          {/* Specialty-Specific SVG Graphics */}
          {activeMapKey === 'Cardiologist' && (
            <div style={{ textAlign: 'center', width: '100%' }}>
              <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '2px dashed var(--accent-rose)', padding: '30px', borderRadius: '20px', margin: '0 auto', maxWidth: '320px' }}>
                <Heart size={80} color="var(--accent-rose)" style={{ animation: 'pulse 1.8s infinite' }} />
                <h4 style={{ color: '#fff', marginTop: '14px', fontSize: '1.1rem' }}>Cardiac & Coronary Tree</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Left Ventricle • Aorta • Coronary LAD/RCA • Chest Sternal Region</p>
              </div>
            </div>
          )}

          {activeMapKey === 'Dentist' && (
            <div style={{ textAlign: 'center', width: '100%' }}>
              <div style={{ background: 'rgba(6, 182, 212, 0.1)', border: '2px dashed var(--accent-cyan)', padding: '30px', borderRadius: '20px', margin: '0 auto', maxWidth: '340px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🦷</div>
                <h4 style={{ color: '#fff', fontSize: '1.1rem' }}>Maxillary & Mandibular Arch</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Upper Incisors/Molars (#11-18) • Lower Arch (#31-38) • TMJ Joint</p>
              </div>
            </div>
          )}

          {activeMapKey === 'Dermatologist' && (
            <div style={{ textAlign: 'center', width: '100%' }}>
              <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '2px dashed var(--accent-amber)', padding: '30px', borderRadius: '20px', margin: '0 auto', maxWidth: '340px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🧴</div>
                <h4 style={{ color: '#fff', fontSize: '1.1rem' }}>Cutaneous Skin Surface Mapper</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Facial T-Zone • Flexor Forearms • Scalp • Lumbar Dermatome</p>
              </div>
            </div>
          )}

          {activeMapKey === 'Orthopaedic' && (
            <div style={{ textAlign: 'center', width: '100%' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '2px dashed var(--accent-teal)', padding: '30px', borderRadius: '20px', margin: '0 auto', maxWidth: '340px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🦴</div>
                <h4 style={{ color: '#fff', fontSize: '1.1rem' }}>Skeletal Joints & Spine Structure</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Knee Joint • L4-L5 Lumbar Spine • Shoulder Cuff • Cervical C5-C7</p>
              </div>
            </div>
          )}

          {activeMapKey === 'General' && (
            <div style={{ textAlign: 'center', width: '100%' }}>
              <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '2px dashed var(--accent-indigo)', padding: '30px', borderRadius: '20px', margin: '0 auto', maxWidth: '340px' }}>
                <User size={80} color="var(--accent-indigo)" />
                <h4 style={{ color: '#fff', marginTop: '14px', fontSize: '1.1rem' }}>General Anatomical System</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Head • Thorax • Abdomen • Extremities</p>
              </div>
            </div>
          )}

          {/* Interactive Anatomical Sites Selection */}
          <div style={{ marginTop: '20px', width: '100%' }}>
            <label style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', fontWeight: '700', marginBottom: '8px', display: 'block' }}>
              Select Anatomical Target Area:
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {currentMap.parts.map(part => (
                <div
                  key={part.id}
                  onClick={() => setSelectedPartId(part.id)}
                  style={{
                    background: selectedPartId === part.id ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255,255,255,0.03)',
                    border: selectedPartId === part.id ? '1px solid var(--accent-cyan)' : '1px solid rgba(255,255,255,0.06)',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: '600' }}>{part.label}</span>
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddPinForPart(part);
                      }}
                      className="btn btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '0.75rem', gap: '4px' }}
                    >
                      <Plus size={12} /> Add Clinical Note
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Clinical Symptom Pins & Findings List */}
        <div style={{ background: '#0f172a', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column' }}>
          <h4 style={{ color: '#fff', fontSize: '1.05rem', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="var(--accent-teal)" /> Logged Anatomical & Clinical Findings ({pins.length})
          </h4>

          {pins.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
              <Info size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
              <p style={{ fontSize: '0.88rem', margin: 0 }}>No anatomical findings pinned yet.</p>
              <p style={{ fontSize: '0.78rem', margin: '4px 0 0 0' }}>Select an anatomical target area on the left to log findings.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: '420px' }}>
              {pins.map((pin) => (
                <div
                  key={pin.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    borderLeft: `4px solid ${pin.painLevel >= 8 ? '#f43f5e' : pin.painLevel >= 5 ? '#f59e0b' : '#10b981'}`,
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: '700', color: '#fff', fontSize: '0.88rem' }}>{pin.part}</span>
                      <span className={`badge ${pin.painLevel >= 8 ? 'badge-rose' : pin.painLevel >= 5 ? 'badge-amber' : 'badge-teal'}`}>
                        Severity: {pin.painLevel}/10
                      </span>
                    </div>
                    <p style={{ color: '#cbd5e1', fontSize: '0.82rem', margin: '4px 0 0 0' }}>
                      {pin.note}
                    </p>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Logged at {pin.timestamp}</span>
                  </div>

                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => handleRemovePin(pin.id)}
                      style={{ background: 'transparent', border: 'none', color: '#f43f5e', cursor: 'pointer', padding: '6px' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
