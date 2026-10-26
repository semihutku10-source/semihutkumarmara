import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  BookOpen, 
  Tag, 
  Printer, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Check, 
  Maximize2 
} from 'lucide-react';
import { LectureNote } from '../types';

interface NoteDetailModalProps {
  note: LectureNote | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (note: LectureNote) => void;
  onDelete: (noteId: string) => void;
}

export const NoteDetailModal: React.FC<NoteDetailModalProps> = ({
  note,
  isOpen,
  onClose,
  onEdit,
  onDelete
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!isOpen || !note) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
        <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-semibold px-2.5 py-1 bg-blue-100 text-blue-900 rounded-md">
                {note.courseCode}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {note.courseName} · {note.week}. Hafta
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrint}
                className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200/60 transition-colors"
                title="Notu Yazdır / PDF Kaydet"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  onClose();
                  onEdit(note);
                }}
                className="p-2 text-slate-600 hover:text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
                title="Notu Düzenle"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (confirm('Bu ders notunu silmek istediğinize emin misiniz?')) {
                    onDelete(note.id);
                    onClose();
                  }
                }}
                className="p-2 text-slate-600 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                title="Notu Sil"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 text-slate-800">
            {/* Title & Metadata */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
                {note.title}
              </h2>

              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {note.date}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  Marmara Üniversitesi Spor Bilimleri
                </span>
                <span>·</span>
                <span>Son Güncelleme: {new Date(note.updatedAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              {/* Tags */}
              {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 mt-3">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Key Takeaways Box (if present) */}
            {note.keyTakeaways && note.keyTakeaways.length > 0 && (
              <div className="bg-amber-50/60 border border-amber-200/80 rounded-lg p-4">
                <h4 className="text-xs font-bold text-amber-900 mb-2 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-amber-700" />
                  Kritik Vize / Final Notları & Önemli Maddeler
                </h4>
                <ul className="space-y-1.5 text-xs text-amber-950">
                  {note.keyTakeaways.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-semibold text-amber-700">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Written Markdown / Text content */}
            <div className="prose prose-sm max-w-none text-slate-800 leading-relaxed font-sans text-sm whitespace-pre-wrap">
              {note.content}
            </div>

            {/* Visuals & Images Gallery */}
            {note.images && note.images.length > 0 && (
              <div className="pt-6 border-t border-slate-200">
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  Ders Görselleri & Saha Çizimleri ({note.images.length})
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {note.images.map((img) => (
                    <div
                      key={img.id}
                      className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 group hover:border-blue-400 transition-all"
                    >
                      <div
                        onClick={() => setSelectedImage(img.url)}
                        className="relative aspect-video bg-slate-900 cursor-pointer overflow-hidden"
                      >
                        <img
                          src={img.url}
                          alt={img.caption}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                          <Maximize2 className="w-6 h-6" />
                        </div>
                      </div>
                      <div className="p-2.5">
                        <p className="text-xs font-medium text-slate-800">{img.caption}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{img.uploadedAt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Marmara Üniversitesi Spor Bilimleri Fakültesi · Spor Yöneticiliği
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-medium transition-colors"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <img
              src={selectedImage}
              alt="Görsel Büyütme"
              className="max-h-[85vh] max-w-full rounded-lg object-contain shadow-2xl"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-black/90 text-white rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
