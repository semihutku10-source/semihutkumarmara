import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Image as ImageIcon, 
  Upload, 
  Camera,
  PenTool, 
  Trash2, 
  Calendar, 
  BookOpen, 
  Tag, 
  Bold, 
  Italic, 
  List, 
  Heading3, 
  Quote, 
  Check,
  Plus
} from 'lucide-react';
import { CourseScheduleItem, LectureNote, NoteImage } from '../types';
import { TacticalBoardModal } from './TacticalBoardModal';

interface NoteEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: LectureNote) => void;
  noteToEdit?: LectureNote | null;
  courses: CourseScheduleItem[];
  preselectedCourseId?: string;
}

export const NoteEditorModal: React.FC<NoteEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  noteToEdit,
  courses,
  preselectedCourseId
}) => {
  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [week, setWeek] = useState(1);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [content, setContent] = useState('');
  const [images, setImages] = useState<NoteImage[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [keyTakeaways, setKeyTakeaways] = useState<string[]>([]);
  const [newTakeawayInput, setNewTakeawayInput] = useState('');

  const [isTacticalOpen, setIsTacticalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (noteToEdit) {
      setCourseId(noteToEdit.courseId);
      setTitle(noteToEdit.title);
      setWeek(noteToEdit.week);
      setDate(noteToEdit.date);
      setContent(noteToEdit.content);
      setImages(noteToEdit.images || []);
      setTags(noteToEdit.tags || []);
      setKeyTakeaways(noteToEdit.keyTakeaways || []);
    } else {
      setCourseId(preselectedCourseId || (courses.length > 0 ? courses[0].id : ''));
      setTitle('');
      setWeek(1);
      setDate(new Date().toISOString().slice(0, 10));
      setContent('');
      setImages([]);
      setTags(['Ders Notu']);
      setKeyTakeaways([]);
    }
  }, [noteToEdit, preselectedCourseId, courses, isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const newImage: NoteImage = {
            id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            url: e.target.result as string,
            caption: file.name.replace(/\.[^/.]+$/, ''),
            uploadedAt: new Date().toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' })
          };
          setImages((prev) => [...prev, newImage]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleTacticalSave = (dataUrl: string, caption: string) => {
    const newImage: NoteImage = {
      id: `img-tactical-${Date.now()}`,
      url: dataUrl,
      caption: caption || 'Saha & Taktik Çizimi',
      uploadedAt: new Date().toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' })
    };
    setImages((prev) => [...prev, newImage]);
  };

  const handleRemoveImage = (imgId: string) => {
    setImages((prev) => prev.filter((img) => img.id !== imgId));
  };

  const handleUpdateImageCaption = (imgId: string, caption: string) => {
    setImages((prev) =>
      prev.map((img) => (img.id === imgId ? { ...img, caption } : img))
    );
  };

  const handleAddTag = () => {
    const clean = newTagInput.trim();
    if (clean && !tags.includes(clean)) {
      setTags((prev) => [...prev, clean]);
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleAddTakeaway = () => {
    const clean = newTakeawayInput.trim();
    if (clean) {
      setKeyTakeaways((prev) => [...prev, clean]);
      setNewTakeawayInput('');
    }
  };

  const handleRemoveTakeaway = (index: number) => {
    setKeyTakeaways((prev) => prev.filter((_, i) => i !== index));
  };

  // Text formatting helpers
  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);

    const replacement = prefix + (selected || 'Metin') + suffix;
    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected ? selected.length : 5));
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedCourse = courses.find((c) => c.id === courseId);

    const savedNote: LectureNote = {
      id: noteToEdit ? noteToEdit.id : `note-${Date.now()}`,
      courseId: courseId || 'general',
      courseCode: selectedCourse ? selectedCourse.code : 'GENEL',
      courseName: selectedCourse ? selectedCourse.name : 'Genel Spor Bilimleri Notu',
      title: title.trim(),
      week: Number(week) || 1,
      date: date || new Date().toISOString().slice(0, 10),
      content,
      images,
      tags: tags.length > 0 ? tags : ['Ders Notu'],
      keyTakeaways,
      isPinned: noteToEdit ? noteToEdit.isPinned : false,
      createdAt: noteToEdit ? noteToEdit.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(savedNote);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
        <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[95vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/60">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-800" />
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  {noteToEdit ? 'Ders Notunu Güncelle' : 'Yeni Ders Notu & Görsel Ekle'}
                </h3>
                <p className="text-xs text-slate-500">
                  Marmara Üniversitesi Spor Bilimleri Fakültesi Ders Not Defteri
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
            {/* Row 1: Course Selection & Week */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="block font-medium text-slate-700 mb-1 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  Ders Programından Ders Seç *
                </label>
                <select
                  required
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-800 bg-white"
                >
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.code} - {course.name} ({course.day} {course.startTime})
                    </option>
                  ))}
                  <option value="general">Diğer / Genel Spor Notu</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Ders Haftası</label>
                <select
                  value={week}
                  onChange={(e) => setWeek(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-800 bg-white"
                >
                  {Array.from({ length: 14 }, (_, i) => i + 1).map((w) => (
                    <option key={w} value={w}>
                      {w}. Hafta
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: Title and Date */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="block font-medium text-slate-700 mb-1">Ders / Not Başlığı *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Örn: Spor Kulüplerinde Tesis İşletmesi & Tahliye Planı"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-800 bg-white text-sm font-medium"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Tarih
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-800 bg-white"
                />
              </div>
            </div>

            {/* Tags Manager */}
            <div>
              <label className="block font-medium text-slate-700 mb-1.5 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                Etiketler
              </label>
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-medium transition-colors"
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {/* Tag suggestions & input */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 flex-wrap">
                  {['Vize Konusu', 'Final', 'Ödev', 'Saha İncelemesi', 'Mevzuat', 'Taktik'].map((preset) => (
                    !tags.includes(preset) && (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setTags((prev) => [...prev, preset])}
                        className="px-2 py-0.5 border border-dashed border-slate-300 hover:border-slate-400 text-slate-600 rounded text-[11px] hover:bg-slate-50 transition-colors"
                      >
                        + {preset}
                      </button>
                    )
                  ))}
                </div>

                <div className="flex items-center gap-1 ml-auto">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Özel etiket..."
                    className="px-2 py-1 border border-slate-300 rounded text-xs w-28 bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-2 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded font-medium text-xs"
                  >
                    Ekle
                  </button>
                </div>
              </div>
            </div>

            {/* Written Content & Formatting Toolbar */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-medium text-slate-700">Ders Notu İçeriği (Yazılı Notlar) *</label>
                {/* Formatting helper buttons */}
                <div className="flex items-center gap-1 text-slate-600">
                  <button
                    type="button"
                    onClick={() => insertFormatting('### ')}
                    title="Başlık Ekle"
                    className="p-1 hover:bg-slate-100 rounded text-slate-700"
                  >
                    <Heading3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('**', '**')}
                    title="Kalın"
                    className="p-1 hover:bg-slate-100 rounded text-slate-700"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('*', '*')}
                    title="İtalik"
                    className="p-1 hover:bg-slate-100 rounded text-slate-700"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('\n- ')}
                    title="Madde İşareti"
                    className="p-1 hover:bg-slate-100 rounded text-slate-700"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('\n> ')}
                    title="Alıntı / Hoca Uyarısı"
                    className="p-1 hover:bg-slate-100 rounded text-slate-700"
                  >
                    <Quote className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <textarea
                ref={textareaRef}
                required
                rows={9}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Ders sırasında aldığınız notlar, formüller, mevzuat maddeleri, hoca vurguları..."
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-800 bg-white font-sans text-xs leading-relaxed"
              />
            </div>

            {/* Images & Visuals Attachment Section */}
            <div className="pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5 text-xs">
                    <ImageIcon className="w-4 h-4 text-blue-700" />
                    Ders Görselleri, Tahta Fotoğrafları & Taktik Şemaları ({images.length})
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Ders tahtası fotoğrafları, slayt ekran görüntüleri veya taktik çizimleri ekleyebilirsiniz
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg flex items-center gap-1 transition-colors shadow-2xs"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    Kameradan Çek
                  </button>
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={(e) => handleImageUpload(e.target.files)}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => setIsTacticalOpen(true)}
                    className="px-3 py-1.5 bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 rounded-lg font-medium flex items-center gap-1 transition-colors"
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    Taktik Tahtası
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-slate-100 text-slate-800 hover:bg-slate-200 rounded-lg font-medium flex items-center gap-1 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Galeri / Dosya
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files)}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Upload Drag & Drop Dropzone */}
              {images.length === 0 ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleImageUpload(e.dataTransfer.files);
                  }}
                  className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-lg p-6 text-center cursor-pointer bg-slate-50/50 hover:bg-blue-50/20 transition-all"
                >
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="font-medium text-slate-700">Ders görsellerini buraya sürükleyin veya seçin</p>
                  <p className="text-[11px] text-slate-400 mt-1">PNG, JPG, WebP veya Taktik Tahtası Çizimi</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  {images.map((img) => (
                    <div
                      key={img.id}
                      className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50/60 p-2 flex flex-col gap-2"
                    >
                      <div className="relative group aspect-video bg-slate-900 rounded overflow-hidden">
                        <img
                          src={img.url}
                          alt={img.caption}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(img.id)}
                          className="absolute top-2 right-2 p-1.5 bg-rose-600/90 hover:bg-rose-700 text-white rounded-md opacity-90 transition-opacity"
                          title="Görseli Kaldır"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={img.caption}
                        onChange={(e) => handleUpdateImageCaption(img.id, e.target.value)}
                        placeholder="Görsel Açıklaması (Örn: Slayt 12 / Saha krokisi)"
                        className="w-full text-[11px] px-2 py-1 border border-slate-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-800"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Key Takeaways / Hızlı Özet Maddeleri */}
            <div className="pt-2 border-t border-slate-200">
              <label className="block font-medium text-slate-700 mb-1.5 flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Vize / Finalde Çıkabilecek Önemli Noktalar (Key Takeaways)
              </label>

              {keyTakeaways.length > 0 && (
                <div className="space-y-1.5 mb-2">
                  {keyTakeaways.map((point, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 p-2 bg-emerald-50/60 border border-emerald-100 rounded-lg text-emerald-950 text-xs"
                    >
                      <span className="flex-1">• {point}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTakeaway(idx)}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newTakeawayInput}
                  onChange={(e) => setNewTakeawayInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTakeaway();
                    }
                  }}
                  placeholder="Hocanın 'Bunu kesin sorarım' dediği önemli bir madde..."
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-800 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddTakeaway}
                  className="px-3 py-1.5 bg-slate-100 text-slate-800 hover:bg-slate-200 rounded-lg font-medium text-xs flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Ekle
                </button>
              </div>
            </div>
          </form>

          {/* Footer Actions */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg font-medium transition-colors"
            >
              İptal
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 font-semibold transition-colors shadow-sm"
            >
              {noteToEdit ? 'Notu Güncelle' : 'Ders Notunu Kaydet'}
            </button>
          </div>
        </div>
      </div>

      {/* Embedded Tactical Board Modal */}
      <TacticalBoardModal
        isOpen={isTacticalOpen}
        onClose={() => setIsTacticalOpen(false)}
        onSaveToNote={handleTacticalSave}
      />
    </>
  );
};
