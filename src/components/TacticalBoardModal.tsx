import React, { useRef, useState, useEffect } from 'react';
import { 
  X, 
  RotateCcw, 
  Download, 
  Check, 
  Eraser, 
  PenTool, 
  Circle, 
  Square, 
  ArrowUpRight, 
  Type,
  LayoutGrid
} from 'lucide-react';

interface TacticalBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveToNote?: (imageDataUrl: string, caption: string) => void;
}

type PitchType = 'blank' | 'football' | 'basketball' | 'volleyball' | 'facility';
type ToolType = 'pen' | 'eraser' | 'arrow' | 'playerX' | 'playerO' | 'text';

export const TacticalBoardModal: React.FC<TacticalBoardModalProps> = ({
  isOpen,
  onClose,
  onSaveToNote
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pitchType, setPitchType] = useState<PitchType>('football');
  const [currentTool, setCurrentTool] = useState<ToolType>('pen');
  const [color, setColor] = useState<string>('#002855');
  const [lineWidth, setLineWidth] = useState<number>(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [caption, setCaption] = useState('Taktik ve Saha Analiz Çizimi');
  const [history, setHistory] = useState<ImageData[]>([]);

  const startPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Draw Pitch Background
  const drawPitch = (ctx: CanvasRenderingContext2D, width: number, height: number, type: PitchType) => {
    ctx.clearRect(0, 0, width, height);

    if (type === 'blank') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      // subtle grid
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1;
      const step = 30;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      return;
    }

    if (type === 'football') {
      // Grass green
      ctx.fillStyle = '#1e392a';
      ctx.fillRect(0, 0, width, height);

      // Pitch lines
      ctx.strokeStyle = '#a3e635';
      ctx.lineWidth = 2.5;

      const pad = 24;
      const w = width - pad * 2;
      const h = height - pad * 2;

      // Outer boundary
      ctx.strokeRect(pad, pad, w, h);

      // Halfway line
      ctx.beginPath();
      ctx.moveTo(pad + w / 2, pad);
      ctx.lineTo(pad + w / 2, pad + h);
      ctx.stroke();

      // Center circle
      ctx.beginPath();
      ctx.arc(pad + w / 2, pad + h / 2, 50, 0, Math.PI * 2);
      ctx.stroke();

      // Center spot
      ctx.fillStyle = '#a3e635';
      ctx.beginPath();
      ctx.arc(pad + w / 2, pad + h / 2, 4, 0, Math.PI * 2);
      ctx.fill();

      // Left penalty box
      ctx.strokeRect(pad, pad + h / 2 - 80, 110, 160);
      // Left goal box
      ctx.strokeRect(pad, pad + h / 2 - 40, 45, 80);

      // Right penalty box
      ctx.strokeRect(pad + w - 110, pad + h / 2 - 80, 110, 160);
      // Right goal box
      ctx.strokeRect(pad + w - 45, pad + h / 2 - 40, 45, 80);
      return;
    }

    if (type === 'basketball') {
      // Hardwood amber court
      ctx.fillStyle = '#451a03';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 2.5;

      const pad = 24;
      const w = width - pad * 2;
      const h = height - pad * 2;

      // Boundary
      ctx.strokeRect(pad, pad, w, h);

      // Half court
      ctx.beginPath();
      ctx.moveTo(pad + w / 2, pad);
      ctx.lineTo(pad + w / 2, pad + h);
      ctx.stroke();

      // Center circle
      ctx.beginPath();
      ctx.arc(pad + w / 2, pad + h / 2, 45, 0, Math.PI * 2);
      ctx.stroke();

      // 3-point arcs (left and right)
      ctx.beginPath();
      ctx.arc(pad + 40, pad + h / 2, 100, -Math.PI / 2.2, Math.PI / 2.2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(pad + w - 40, pad + h / 2, 100, Math.PI - Math.PI / 2.2, Math.PI + Math.PI / 2.2);
      ctx.stroke();

      // Key paint areas
      ctx.strokeRect(pad, pad + h / 2 - 45, 85, 90);
      ctx.strokeRect(pad + w - 85, pad + h / 2 - 45, 85, 90);
      return;
    }

    if (type === 'volleyball') {
      ctx.fillStyle = '#0c4a6e';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;

      const pad = 30;
      const w = width - pad * 2;
      const h = height - pad * 2;

      ctx.strokeRect(pad, pad, w, h);
      // Net line
      ctx.beginPath();
      ctx.moveTo(pad + w / 2, pad);
      ctx.lineTo(pad + w / 2, pad + h);
      ctx.stroke();

      // Attack lines (3m lines)
      ctx.beginPath();
      ctx.moveTo(pad + w / 2 - 60, pad);
      ctx.lineTo(pad + w / 2 - 60, pad + h);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(pad + w / 2 + 60, pad);
      ctx.lineTo(pad + w / 2 + 60, pad + h);
      ctx.stroke();
      return;
    }

    if (type === 'facility') {
      // Architectural Facility Layout grid
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;

      // Blueprint grid
      for (let x = 0; x < width; x += 25) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Facility boundary lines in cyan
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(30, 30, width - 60, height - 60);

      // Arena central area
      ctx.fillStyle = 'rgba(56, 189, 248, 0.05)';
      ctx.fillRect(80, 60, width - 160, height - 120);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px Plus Jakarta Sans, sans-serif';
      ctx.fillText('TESİS YÖNETİM & LOGİSTİK DÜZENİ', 40, 20);
      ctx.fillText('PROTOKOL & VIP TRİBÜNÜ', 90, 52);
      ctx.fillText('ACİL ÇIKIŞ / TAHLİYE KORİDORU', 90, height - 40);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawPitch(ctx, canvas.width, canvas.height, pitchType);
    saveHistoryState();
  }, [isOpen, pitchType]);

  const saveHistoryState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const state = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-15), state]);
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newHistory = [...history];
    newHistory.pop(); // remove current state
    const previousState = newHistory[newHistory.length - 1];
    if (previousState) {
      ctx.putImageData(previousState, 0, 0);
      setHistory(newHistory);
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawPitch(ctx, canvas.width, canvas.height, pitchType);
    saveHistoryState();
  };

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);
    startPos.current = coords;
    setIsDrawing(true);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (currentTool === 'playerX') {
      ctx.strokeStyle = color;
      ctx.lineWidth = 3.5;
      const size = 10;
      ctx.beginPath();
      ctx.moveTo(coords.x - size, coords.y - size);
      ctx.lineTo(coords.x + size, coords.y + size);
      ctx.moveTo(coords.x + size, coords.y - size);
      ctx.lineTo(coords.x - size, coords.y + size);
      ctx.stroke();
      saveHistoryState();
      setIsDrawing(false);
      return;
    }

    if (currentTool === 'playerO') {
      ctx.strokeStyle = color;
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(coords.x, coords.y, 12, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fill();
      saveHistoryState();
      setIsDrawing(false);
      return;
    }

    if (currentTool === 'text') {
      const text = prompt('Eklemek istediğiniz not / oyuncu etiketi:', 'Takım Kaptanı');
      if (text) {
        ctx.fillStyle = color;
        ctx.font = 'bold 14px Plus Jakarta Sans, sans-serif';
        ctx.fillText(text, coords.x, coords.y);
        saveHistoryState();
      }
      setIsDrawing(false);
      return;
    }

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCanvasCoords(e);

    if (currentTool === 'pen') {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    } else if (currentTool === 'eraser') {
      ctx.strokeStyle = pitchType === 'blank' ? '#ffffff' : pitchType === 'football' ? '#1e392a' : pitchType === 'basketball' ? '#451a03' : pitchType === 'facility' ? '#0f172a' : '#0c4a6e';
      ctx.lineWidth = lineWidth * 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (currentTool === 'arrow') {
      const coords = getCanvasCoords(e);
      const fromX = startPos.current.x;
      const fromY = startPos.current.y;
      const toX = coords.x;
      const toY = coords.y;

      const headlen = 14;
      const dx = toX - fromX;
      const dy = toY - fromY;
      const angle = Math.atan2(dy, dx);

      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(toX, toY);
      ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();
    }

    saveHistoryState();
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `Marmara_Spor_Taktik_${Date.now()}.png`;
    a.click();
  };

  const handleSaveToNote = () => {
    const canvas = canvasRef.current;
    if (!canvas || !onSaveToNote) return;
    const dataUrl = canvas.toDataURL('image/png');
    onSaveToNote(dataUrl, caption || 'Taktik / Saha Şeması');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <PenTool className="w-5 h-5 text-blue-800" />
              Spor Yöneticiliği Taktik & Saha Çizim Tahtası
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ders sunumu, organizasyon planı veya taktik analiz için saha şeması hazırlayın
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-3 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-4 text-xs">
          {/* Pitch Preset Selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setPitchType('football')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                pitchType === 'football' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Futbol Sahası
            </button>
            <button
              onClick={() => setPitchType('basketball')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                pitchType === 'basketball' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Basketbol
            </button>
            <button
              onClick={() => setPitchType('volleyball')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                pitchType === 'volleyball' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Voleybol
            </button>
            <button
              onClick={() => setPitchType('facility')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                pitchType === 'facility' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tesis Şeması
            </button>
            <button
              onClick={() => setPitchType('blank')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                pitchType === 'blank' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Boş Tahta
            </button>
          </div>

          {/* Tools */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              title="Kalem"
              onClick={() => setCurrentTool('pen')}
              className={`p-1.5 rounded transition-colors ${
                currentTool === 'pen' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PenTool className="w-4 h-4" />
            </button>
            <button
              title="Ok Çiz"
              onClick={() => setCurrentTool('arrow')}
              className={`p-1.5 rounded transition-colors ${
                currentTool === 'arrow' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              title="Oyuncu (X) İşareti"
              onClick={() => setCurrentTool('playerX')}
              className={`px-2 py-1 font-bold rounded transition-colors ${
                currentTool === 'playerX' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              X
            </button>
            <button
              title="Oyuncu (O) İşareti"
              onClick={() => setCurrentTool('playerO')}
              className={`p-1.5 rounded transition-colors ${
                currentTool === 'playerO' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Circle className="w-4 h-4" />
            </button>
            <button
              title="Yazı Ekle"
              onClick={() => setCurrentTool('text')}
              className={`p-1.5 rounded transition-colors ${
                currentTool === 'text' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Type className="w-4 h-4" />
            </button>
            <button
              title="Silgi"
              onClick={() => setCurrentTool('eraser')}
              className={`p-1.5 rounded transition-colors ${
                currentTool === 'eraser' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eraser className="w-4 h-4" />
            </button>
          </div>

          {/* Color Palette */}
          <div className="flex items-center gap-1.5">
            {['#002855', '#dc2626', '#f59e0b', '#10b981', '#ffffff', '#0f172a'].map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  color === c ? 'scale-110 border-slate-900' : 'border-slate-300'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          {/* Actions: Undo & Reset */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleUndo}
              disabled={history.length <= 1}
              className="p-1.5 text-slate-600 hover:text-slate-900 disabled:opacity-40 rounded hover:bg-slate-100"
              title="Geri Al"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleClear}
              className="px-2 py-1 text-xs text-rose-600 hover:bg-rose-50 rounded font-medium"
            >
              Temizle
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="p-4 bg-slate-100 flex items-center justify-center flex-1 overflow-auto">
          <canvas
            ref={canvasRef}
            width={780}
            height={460}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="rounded-lg shadow-md cursor-crosshair max-w-full h-auto bg-white border border-slate-300"
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
          <div className="flex-1 max-w-sm">
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Şema Açıklaması (Örn: 4-3-3 Baskı Alanı veya Tribün Koridoru)"
              className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              PNG İndir
            </button>

            {onSaveToNote && (
              <button
                onClick={handleSaveToNote}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-800 rounded-lg hover:bg-blue-900 flex items-center gap-1.5 transition-colors"
              >
                <Check className="w-4 h-4" />
                Çizimi Nota Ekle
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
