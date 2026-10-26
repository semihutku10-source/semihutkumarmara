import React from 'react';
import { Plus, Download } from 'lucide-react';

interface NavbarProps {
  currentTab: 'schedule' | 'notes' | 'whiteboard' | 'tasks';
  onSelectTab: (tab: 'schedule' | 'notes' | 'whiteboard' | 'tasks') => void;
  onOpenNewNote: () => void;
  onExportData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenNewNote,
  onExportData
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (Student Name) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-blue-900 flex items-center justify-center text-amber-300 font-bold text-sm tracking-wider shadow-xs">
            SU
          </div>
          <button
            onClick={() => onSelectTab('schedule')}
            className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-blue-900 transition-colors text-left"
          >
            Semih Utku
          </button>
        </div>

        {/* Zone 2: 4-5 single-line clean navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => onSelectTab('schedule')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
              currentTab === 'schedule'
                ? 'text-blue-900 font-semibold border-b-2 border-blue-900'
                : 'hover:text-slate-900'
            }`}
          >
            Ders Programı & Plan
          </button>

          <button
            onClick={() => onSelectTab('notes')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
              currentTab === 'notes'
                ? 'text-blue-900 font-semibold border-b-2 border-blue-900'
                : 'hover:text-slate-900'
            }`}
          >
            Ders Notları & Görseller
          </button>

          <button
            onClick={() => onSelectTab('whiteboard')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
              currentTab === 'whiteboard'
                ? 'text-blue-900 font-semibold border-b-2 border-blue-900'
                : 'hover:text-slate-900'
            }`}
          >
            Taktik & Saha Çizimi
          </button>

          <button
            onClick={() => onSelectTab('tasks')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
              currentTab === 'tasks'
                ? 'text-blue-900 font-semibold border-b-2 border-blue-900'
                : 'hover:text-slate-900'
            }`}
          >
            Akademik Görevler
          </button>
        </nav>

        {/* Zone 3: 1 Primary action + backup button */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onExportData}
            title="Tüm Ders Notlarını ve Programı Yedekle (JSON)"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            Yedekle
          </button>

          <button
            onClick={onOpenNewNote}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-900 rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap shrink-0 shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Yeni Not Yaz
          </button>
        </div>
      </div>
    </header>
  );
};
