import React, { useRef, useState, useEffect } from 'react';
import { Edit3, RotateCcw, Trash2, Check, PenTool } from 'lucide-react';

export default function StylusCanvasNotes({ initialData = '', onSaveData, readOnly = false }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#2ec4b6'); // teal default
  const [penWidth, setPenWidth] = useState(3);
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // If initialData exists as image data URL
    if (initialData) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        saveState();
      };
      img.src = initialData;
    } else {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      saveState();
    }
  }, []);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL();
    setHistory(prev => {
      const next = prev.slice(0, historyStep + 1);
      return [...next, dataUrl];
    });
    setHistoryStep(prev => prev + 1);
    if (onSaveData) onSaveData(dataUrl);
  };

  const startDrawing = (e) => {
    if (readOnly) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || readOnly) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveState();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
  };

  const handleUndo = () => {
    if (historyStep <= 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const prevStep = historyStep - 1;
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      setHistoryStep(prevStep);
      if (onSaveData) onSaveData(history[prevStep]);
    };
    img.src = history[prevStep];
  };

  return (
    <div style={{ background: 'rgba(15, 23, 42, 0.75)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ color: '#fff', fontSize: '0.88rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <PenTool size={16} style={{ color: 'var(--accent-teal)' }} />
          Handwritten Stylus & Clinical Sketch Canvas
        </span>

        {!readOnly && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Color Pickers */}
            {['#2ec4b6', '#e71d36', '#ff9f1c', '#ffffff'].map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setPenColor(c)}
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: c,
                  border: penColor === c ? '2px solid #fff' : '1px solid transparent',
                  cursor: 'pointer'
                }}
              />
            ))}

            {/* Stroke Width Selector */}
            <select
              value={penWidth}
              onChange={(e) => setPenWidth(Number(e.target.value))}
              style={{ background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', fontSize: '0.75rem', padding: '2px 6px' }}
            >
              <option value={2}>Fine (2px)</option>
              <option value={4}>Medium (4px)</option>
              <option value={8}>Thick (8px)</option>
            </select>

            <button
              type="button"
              onClick={handleUndo}
              disabled={historyStep <= 0}
              style={{ background: 'rgba(255,255,255,0.06)', color: historyStep > 0 ? '#fff' : '#64748b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '4px 8px', cursor: historyStep > 0 ? 'pointer' : 'default', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <RotateCcw size={12} /> Undo
            </button>

            <button
              type="button"
              onClick={clearCanvas}
              style={{ background: 'rgba(231,29,54,0.12)', color: '#e71d36', border: '1px solid rgba(231,29,54,0.3)', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Trash2 size={12} /> Clear
            </button>
          </div>
        )}
      </div>

      <canvas
        ref={canvasRef}
        width={540}
        height={220}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        style={{
          width: '100%',
          height: '220px',
          borderRadius: '8px',
          border: '1px dashed rgba(255,255,255,0.2)',
          cursor: readOnly ? 'default' : 'crosshair',
          background: '#0f172a',
          touchAction: 'none'
        }}
      />
    </div>
  );
}
