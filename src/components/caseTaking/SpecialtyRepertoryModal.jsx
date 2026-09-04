import React, { useState } from 'react';
import { Search, BookOpen, X, CheckCircle2, Sparkles, Database, ShieldCheck } from 'lucide-react';
import {
  SPECIALTY_ICD11_CODES,
  HOMEOPATHIC_REPERTORY_RUBRICS,
  DSM5_PSYCHIATRIC_CRITERIA,
  AYURVEDA_DOSHA_ASSESSMENT
} from '../../data/hospitalData';

export default function SpecialtyRepertoryModal({ isOpen, onClose, onSelectReference }) {
  const [activeRepo, setActiveRepo] = useState('icd11'); // 'icd11' | 'homeopathy' | 'dsm5' | 'ayurveda'
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredIcd = SPECIALTY_ICD11_CODES.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredHomeo = HOMEOPATHIC_REPERTORY_RUBRICS.filter(item =>
    item.rubric.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.remedies.some(r => r.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredDsm = DSM5_PSYCHIATRIC_CRITERIA.filter(item =>
    item.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.diagnosticCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAyurveda = AYURVEDA_DOSHA_ASSESSMENT.filter(item =>
    item.dosha.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.imbalances.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (repoType, codeOrRubric, description) => {
    if (onSelectReference) {
      onSelectReference({ repoType, codeOrRubric, description });
    }
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '850px',
        maxHeight: '90vh',
        borderRadius: '20px',
        background: '#0f172a',
        border: '1px solid rgba(255,255,255,0.15)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
      }}>
        {/* Modal Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ color: '#fff', fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen style={{ color: 'var(--accent-teal)' }} size={24} />
              Specialty Clinical Repositories & Repertories
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '4px 0 0 0' }}>
              Lookup specialty-specific databases (ICD-11, Homeopathic Rubrics, DSM-5 Criteria, Ayurveda Doshas).
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#94a3b8', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={20} />
          </button>
        </div>

        {/* Repository Tabs & Search Bar */}
        <div style={{ padding: '16px 24px', background: 'rgba(30, 41, 59, 0.5)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'icd11', label: 'ICD-11 Codes' },
              { id: 'homeopathy', label: 'Homeopathic Repertory' },
              { id: 'dsm5', label: 'Psychiatric DSM-5' },
              { id: 'ayurveda', label: 'Ayurveda Prakriti / Doshas' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveRepo(tab.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  background: activeRepo === tab.id ? 'var(--accent-teal)' : 'rgba(255,255,255,0.05)',
                  color: activeRepo === tab.id ? '#0f172a' : '#cbd5e1',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder={`Search ${activeRepo.toUpperCase()} repository...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ width: '100%', paddingLeft: '42px', background: '#0f172a', color: '#fff', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)' }}
            />
          </div>
        </div>

        {/* Repository Content List */}
        <div style={{ padding: '24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {activeRepo === 'icd11' && (
            filteredIcd.length > 0 ? (
              filteredIcd.map(item => (
                <div key={item.code} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ background: 'rgba(46, 196, 182, 0.2)', color: 'var(--accent-teal)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700' }}>
                        {item.code}
                      </span>
                      <span style={{ color: '#fff', fontWeight: '600', fontSize: '0.92rem' }}>{item.title}</span>
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px' }}>{item.description}</div>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px', display: 'inline-block' }}>Category: {item.category}</span>
                  </div>
                  <button
                    onClick={() => handleSelect('ICD-11', item.code, `${item.title}: ${item.description}`)}
                    className="btn btn-sm btn-primary"
                    style={{ fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                  >
                    Insert Code
                  </button>
                </div>
              ))
            ) : <p style={{ color: 'var(--text-muted)', textAlign: 'center', margin: '20px 0' }}>No matching ICD-11 codes found.</p>
          )}

          {activeRepo === 'homeopathy' && (
            filteredHomeo.length > 0 ? (
              filteredHomeo.map(item => (
                <div key={item.rubric} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ background: 'rgba(255, 159, 28, 0.2)', color: '#ff9f1c', padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '700' }}>
                      Chapter: {item.chapter}
                    </span>
                    <div style={{ color: '#fff', fontWeight: '600', fontSize: '0.9rem', marginTop: '4px' }}>{item.rubric}</div>
                    <div style={{ color: 'var(--accent-teal)', fontSize: '0.8rem', marginTop: '4px', fontWeight: '600' }}>
                      Key Remedies: {item.remedies.join(', ')}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '2px' }}>Keynotes: {item.keynotes}</div>
                  </div>
                  <button
                    onClick={() => handleSelect('Homeopathy Repertory', item.rubric, `Remedies: ${item.remedies.join(', ')} | Keynotes: ${item.keynotes}`)}
                    className="btn btn-sm btn-primary"
                    style={{ fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                  >
                    Insert Rubric
                  </button>
                </div>
              ))
            ) : <p style={{ color: 'var(--text-muted)', textAlign: 'center', margin: '20px 0' }}>No matching homeopathic rubrics found.</p>
          )}

          {activeRepo === 'dsm5' && (
            filteredDsm.length > 0 ? (
              filteredDsm.map(item => (
                <div key={item.diagnosticCode} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ background: 'rgba(131, 56, 236, 0.2)', color: '#8338ec', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700' }}>
                        DSM-5: {item.diagnosticCode}
                      </span>
                      <span style={{ color: '#fff', fontWeight: '600', fontSize: '0.92rem' }}>{item.condition}</span>
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '6px' }}>
                      <strong>Core Criteria:</strong> {item.coreCriteria.join(' • ')}
                    </div>
                  </div>
                  <button
                    onClick={() => handleSelect('DSM-5 Psychiatric', item.diagnosticCode, `${item.condition} (${item.coreCriteria.slice(0, 3).join(', ')})`)}
                    className="btn btn-sm btn-primary"
                    style={{ fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                  >
                    Insert Diagnostic
                  </button>
                </div>
              ))
            ) : <p style={{ color: 'var(--text-muted)', textAlign: 'center', margin: '20px 0' }}>No matching DSM-5 criteria found.</p>
          )}

          {activeRepo === 'ayurveda' && (
            filteredAyurveda.length > 0 ? (
              filteredAyurveda.map(item => (
                <div key={item.dosha} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ background: 'rgba(46, 196, 182, 0.2)', color: 'var(--accent-teal)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '700' }}>
                      Prakriti / Dosha: {item.dosha}
                    </span>
                    <div style={{ color: '#fff', fontSize: '0.82rem', marginTop: '4px' }}><strong>Attributes:</strong> {item.attributes}</div>
                    <div style={{ color: '#ff9f1c', fontSize: '0.78rem', marginTop: '2px' }}><strong>Imbalance Manifestations:</strong> {item.imbalances}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '2px' }}><strong>Pacifying Regimen:</strong> {item.pacifyingDiet}</div>
                  </div>
                  <button
                    onClick={() => handleSelect('Ayurveda Dosha', item.dosha, `Imbalances: ${item.imbalances} | Diet: ${item.pacifyingDiet}`)}
                    className="btn btn-sm btn-primary"
                    style={{ fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                  >
                    Insert Regimen
                  </button>
                </div>
              ))
            ) : <p style={{ color: 'var(--text-muted)', textAlign: 'center', margin: '20px 0' }}>No matching Ayurveda assessment parameters found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
