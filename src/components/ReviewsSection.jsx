import React, { useState } from 'react';
import { Star, MessageSquare, Plus, CheckCircle2, UserCheck, ThumbsUp, ShieldCheck, Sparkles } from 'lucide-react';

export default function ReviewsSection({ reviews, onAddReview, onShowToast }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [treatment, setTreatment] = useState('Cardiology & Cardiac Care');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!patientName || !comment) return;

    const newRev = {
      id: `REV-${Date.now()}`,
      patientName,
      patientAge: Number(patientAge) || 35,
      treatment,
      rating: Number(rating),
      date: new Date().toISOString().split('T')[0],
      comment,
      verified: true
    };

    onAddReview(newRev);
    onShowToast('Thank you! Your 5-star review has been published.');
    setModalOpen(false);
    setPatientName('');
    setComment('');
  };

  return (
    <div className="main-container">
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div className="badge badge-teal" style={{ marginBottom: '12px' }}>
          <Sparkles size={14} /> 5/5 Star Verified Patient Ratings
        </div>
        <h1 className="section-title" style={{ fontSize: '2.5rem' }}>Patient Reviews & Testimonials</h1>
        <p className="section-subtitle" style={{ margin: '0 auto' }}>
          Read authentic feedback from over 50,000 satisfied patients who experienced compassionate healthcare at CITY Hospital.
        </p>
      </div>

      {/* RATING SUMMARY CARD */}
      <div className="glass-card" style={{ padding: '32px', marginBottom: '40px' }}>
        <div className="grid-3" style={{ alignItems: 'center' }}>
          <div style={{ textAlign: 'center', borderRight: '1px solid var(--glass-border)', paddingRight: '20px' }}>
            <div style={{ fontSize: '4rem', fontWeight: '800', color: 'var(--accent-amber)', lineHeight: 1 }}>5.0</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', margin: '8px 0' }}>
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} size={20} fill="var(--accent-amber)" color="var(--accent-amber)" />
              ))}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Based on 4,850+ Verified Reviews</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderRight: '1px solid var(--glass-border)', paddingRight: '20px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '2px' }}>
                <span>Doctor Expertise & Care</span>
                <span style={{ color: 'var(--accent-teal)' }}>5.0 / 5</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', background: 'var(--accent-teal)' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '2px' }}>
                <span>Nursing Hospitality & Staff</span>
                <span style={{ color: 'var(--accent-cyan)' }}>4.95 / 5</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '99%', height: '100%', background: 'var(--accent-cyan)' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '2px' }}>
                <span>Inbuilt Blood Labs & Diagnostic Speed</span>
                <span style={{ color: 'var(--accent-indigo)' }}>4.9 / 5</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '98%', height: '100%', background: 'var(--accent-indigo)' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '2px' }}>
                <span>Pharmacy Affordability & Cleanliness</span>
                <span style={{ color: 'var(--accent-amber)' }}>5.0 / 5</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', background: 'var(--accent-amber)' }}></div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', paddingLeft: '20px' }}>
            <h4 style={{ color: '#fff', marginBottom: '8px' }}>Have you visited CITY Hospital?</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Your honest feedback helps us maintain the highest standard of compassionate medical care.
            </p>
            <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
              <Plus size={16} /> Write a Review
            </button>
          </div>
        </div>
      </div>

      {/* TESTIMONIAL CARDS GRID */}
      <div className="grid-2">
        {reviews.map(rev => (
          <div className="glass-card" key={rev.id} style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="logo-icon-bg" style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, var(--navy-light), var(--navy-card))' }}>
                  <UserCheck size={20} color="var(--accent-cyan)" />
                </div>
                <div>
                  <h4 style={{ color: '#fff', fontSize: '1.05rem', margin: 0 }}>{rev.patientName} <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>({rev.patientAge} yrs)</span></h4>
                  <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)' }}>{rev.treatment}</div>
                </div>
              </div>

              {rev.verified && (
                <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>
                  <CheckCircle2 size={12} /> Verified Patient
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
              {Array.from({ length: rev.rating }).map((_, i) => (
                <Star key={i} size={16} fill="var(--accent-amber)" color="var(--accent-amber)" />
              ))}
            </div>

            <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: '1.6', marginBottom: '16px', fontStyle: 'italic' }}>
              "{rev.comment}"
            </p>

            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <span>Published on: {rev.date}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-teal)', cursor: 'pointer' }}>
                <ThumbsUp size={12} /> Helpful (24)
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* WRITE REVIEW MODAL */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare color="var(--accent-cyan)" size={20} /> Submit Your Patient Review
              </h3>
              <button className="close-modal-btn" onClick={() => setModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Your Full Name</label>
                  <input type="text" className="form-input" placeholder="e.g. Anish Sharma" value={patientName} onChange={e => setPatientName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Age</label>
                  <input type="number" className="form-input" placeholder="e.g. 42" value={patientAge} onChange={e => setPatientAge(e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Department / Treatment Received</label>
                <select className="form-select" value={treatment} onChange={e => setTreatment(e.target.value)}>
                  <option>Cardiology & Cardiac Care</option>
                  <option>Neurology & Brain Care</option>
                  <option>Orthopaedic & Joint Surgery</option>
                  <option>Dermatology & Skin Care</option>
                  <option>Pediatrics & NICU</option>
                  <option>Gynecology & Maternity</option>
                  <option>Pathology & Blood Testing Labs</option>
                  <option>General Ward & AC Rooms Stay</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Star Rating (1 to 5 Stars)</label>
                <select className="form-select" value={rating} onChange={e => setRating(e.target.value)}>
                  <option value={5}>5 Stars ★★★★★ (Exceptional Care)</option>
                  <option value={4}>4 Stars ★★★★☆ (Very Good)</option>
                  <option value={3}>3 Stars ★★★☆☆ (Average)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Your Review & Testimonial</label>
                <textarea className="form-textarea" rows={4} placeholder="Describe your experience with doctors, nurses, pharmacy, and lab reports..." value={comment} onChange={e => setComment(e.target.value)} required />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary"><Star size={16} /> Publish Review</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
