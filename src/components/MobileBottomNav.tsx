import React from 'react';
import { Calendar, FileText, Camera, PenTool, CheckSquare } from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: 'schedule' | 'notes' | 'whiteboard' | 'tasks';
  onSelectTab: (tab: 'schedule' | 'notes' | 'whiteboard' | 'tasks') => void;
  onOpenLiveCamera: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenLiveCamera
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1 safe-area-pb">
      <div className="grid grid-cols-5 items-center max-w-md mx-auto">
        {/* Tab 1: Ders Programı */}
        <button
          onClick={() => onSelectTab('schedule')}
          className={`min-h-[48px] flex flex-col items-center justify-center py-1 transition-all active:scale-95 ${
            currentTab === 'schedule' ? 'text-blue-900 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Program</span>
        </button>

        {/* Tab 2: Ders Notları */}
        <button
          onClick={() => onSelectTab('notes')}
          className={`min-h-[48px] flex flex-col items-center justify-center py-1 transition-all active:scale-95 ${
            currentTab === 'notes' ? 'text-blue-900 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Notlarım</span>
        </button>

        {/* Center Primary Action: Camera Capture */}
        <button
          onClick={onOpenLiveCamera}
          className="min-h-[48px] flex flex-col items-center justify-center -mt-4 transition-all active:scale-90"
        >
          <div className="w-12 h-12 rounded-full bg-blue-900 text-amber-400 border-2 border-white shadow-md flex items-center justify-center hover:bg-blue-800 transition-colors">
            <Camera className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold text-blue-900 mt-0.5">Foto Çek</span>
        </button>

        {/* Tab 4: Taktik & Çizim */}
        <button
          onClick={() => onSelectTab('whiteboard')}
          className={`min-h-[48px] flex flex-col items-center justify-center py-1 transition-all active:scale-95 ${
            currentTab === 'whiteboard' ? 'text-blue-900 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <PenTool className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Taktik</span>
        </button>

        {/* Tab 5: Görevler */}
        <button
          onClick={() => onSelectTab('tasks')}
          className={`min-h-[48px] flex flex-col items-center justify-center py-1 transition-all active:scale-95 ${
            currentTab === 'tasks' ? 'text-blue-900 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <CheckSquare className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Görevler</span>
        </button>
      </div>
    </nav>
  );
};
