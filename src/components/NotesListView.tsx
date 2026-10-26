import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Image as ImageIcon, 
  Calendar, 
  BookOpen, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Tag, 
  Layers, 
  Printer,
  Camera 
} from 'lucide-react';
import { CourseScheduleItem, LectureNote } from '../types';

interface NotesListViewProps {
  notes: LectureNote[];
  courses: CourseScheduleItem[];
  onOpenNewNoteModal: () => void;
  onViewNote: (note: LectureNote) => void;
  onEditNote: (note: LectureNote) => void;
  onDeleteNote: (noteId: string) => void;
  selectedCourseFilter?: string;
  onSelectCourseFilter: (courseId: string) => void;
  onOpenLiveCamera?: () => void;
}

export const NotesListView: React.FC<NotesListViewProps> = ({
  notes,
  courses,
  onOpenNewNoteModal,
  onViewNote,
  onEditNote,
  onDeleteNote,
  selectedCourseFilter = 'all',
  onSelectCourseFilter,
  onOpenLiveCamera
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [onlyWithImages, setOnlyWithImages] = useState(false);

  // Collect all unique tags across notes
  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags || [])));

  // Filter notes
  const filteredNotes = notes.filter((note) => {
    // Course filter
    if (selectedCourseFilter !== 'all' && note.courseId !== selectedCourseFilter) {
      return false;
    }
    // Tag filter
    if (selectedTag !== 'all' && (!note.tags || !note.tags.includes(selectedTag))) {
      return false;
    }
    // Has images filter
    if (onlyWithImages && (!note.images || note.images.length === 0)) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = note.title.toLowerCase().includes(q);
      const matchContent = note.content.toLowerCase().includes(q);
      const matchCode = note.courseCode.toLowerCase().includes(q);
      const matchName = note.courseName.toLowerCase().includes(q);
      const matchTags = (note.tags || []).some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchContent && !matchCode && !matchName && !matchTags) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Kayıtlı Ders Notları & Görsel Arşivi
          </h2>
          <p className="text-xs text-slate-500">
            Spor Bilimleri Fakültesi ders notlarınız, saha incelemeleri ve çizimleriniz
          </p>
        </div>

        <button
          onClick={onOpenNewNoteModal}
          className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Yeni Ders Notu Yaz
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        {/* Row 1: Search & Course Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Not başlığı, içerik veya konu ara (Örn: Tahliye, Sponsorluk, Stat)..."
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-800"
            />
          </div>

          <div>
            <select
              value={selectedCourseFilter}
              onChange={(e) => onSelectCourseFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-800"
            >
              <option value="all">Tüm Dersler ({notes.length} Not)</option>
              {courses.map((c) => {
                const count = notes.filter((n) => n.courseId === c.id).length;
                return (
                  <option key={c.id} value={c.id}>
                    {c.code} - {c.name} ({count})
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Row 2: Tag filters & Visual Only toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400 text-[11px] mr-1">Etiket Filtresi:</span>
            <button
              onClick={() => setSelectedTag('all')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                selectedTag === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              Tümü
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  selectedTag === tag
                    ? 'bg-blue-800 text-white'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 text-xs select-none">
            <input
              type="checkbox"
              checked={onlyWithImages}
              onChange={(e) => setOnlyWithImages(e.target.checked)}
              className="rounded border-slate-300 text-blue-800 focus:ring-blue-800"
            />
            <span className="flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5 text-blue-700" />
              Sadece Görselli Notlar
            </span>
          </label>
        </div>
      </div>

      {/* Notes Grid or Clean Empty State */}
      {filteredNotes.length === 0 ? (
        <div className="py-16 px-6 bg-white border border-dashed border-slate-200 rounded-2xl text-center max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center mx-auto mb-3">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Henüz Kayıtlı Not Bulunmuyor</h3>
          <p className="text-xs text-slate-500 mt-1 mb-5 leading-relaxed">
            Sistem sıfırlandı ve kullanımınıza hazır. Dersteyken tahtayı ve slaytları fotoğraflayabilir veya yazılı notlarınızı ekleyebilirsiniz.
          </p>
          <div className="flex items-center justify-center gap-2.5 flex-wrap">
            {onOpenLiveCamera && (
              <button
                onClick={onOpenLiveCamera}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg font-bold text-xs inline-flex items-center gap-1.5 transition-colors shadow-xs active:scale-95"
              >
                <Camera className="w-4 h-4" />
                Fotoğraf Çek & Not Al
              </button>
            )}
            <button
              onClick={onOpenNewNoteModal}
              className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 font-semibold text-xs inline-flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Yazılı Not Ekle
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNotes.map((note) => {
            const hasImages = note.images && note.images.length > 0;
            const previewImage = hasImages ? note.images[0] : null;

            return (
              <div
                key={note.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top image thumbnail banner if exists */}
                  {previewImage ? (
                    <div
                      onClick={() => onViewNote(note)}
                      className="relative h-40 bg-slate-900 cursor-pointer overflow-hidden"
                    >
                      <img
                        src={previewImage.url}
                        alt={previewImage.caption}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 backdrop-blur-xs text-white rounded text-[10px] flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        {note.images.length} Görsel Eklendi
                      </div>
                    </div>
                  ) : null}

                  {/* Note Body */}
                  <div className="p-4">
                    {/* Unboxed Metadata with · separator */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                      <span className="font-mono font-bold text-blue-900">
                        {note.courseCode}
                      </span>
                      <span>·</span>
                      <span>{note.week}. Hafta</span>
                      <span>·</span>
                      <span className="tabular-nums">{note.date}</span>
                    </div>

                    <h3
                      onClick={() => onViewNote(note)}
                      className="font-bold text-slate-900 text-sm leading-snug cursor-pointer group-hover:text-blue-900 transition-colors line-clamp-2"
                    >
                      {note.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 mt-2 leading-relaxed">
                      {note.content}
                    </p>

                    {/* Tags */}
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-slate-100">
                        {note.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                        {note.tags.length > 3 && (
                          <span className="text-[11px] text-slate-400">
                            +{note.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => onViewNote(note)}
                    className="font-semibold text-blue-900 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Notu İncele
                  </button>

                  <div className="flex items-center gap-1 text-slate-400">
                    <button
                      onClick={() => onEditNote(note)}
                      className="p-1.5 hover:text-slate-700 rounded hover:bg-slate-200/60 transition-colors"
                      title="Düzenle"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`"${note.title}" notunu silmek istediğinize emin misiniz?`)) {
                          onDeleteNote(note.id);
                        }
                      }}
                      className="p-1.5 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
