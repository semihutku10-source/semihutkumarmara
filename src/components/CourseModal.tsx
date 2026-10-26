import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, User, BookOpen, Layers } from 'lucide-react';
import { CourseScheduleItem, DayOfWeek } from '../types';
import { DAYS_OF_WEEK } from '../data/initialData';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: CourseScheduleItem) => void;
  courseToEdit?: CourseScheduleItem | null;
  onDelete?: (courseId: string) => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  courseToEdit,
  onDelete
}) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [lecturer, setLecturer] = useState('');
  const [day, setDay] = useState<DayOfWeek>('Pazartesi');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:45');
  const [location, setLocation] = useState('');
  const [color, setColor] = useState<CourseScheduleItem['color']>('blue');
  const [ects, setEcts] = useState(5);
  const [semester, setSemester] = useState('Güz Dönemi');

  useEffect(() => {
    if (courseToEdit) {
      setCode(courseToEdit.code);
      setName(courseToEdit.name);
      setLecturer(courseToEdit.lecturer);
      setDay(courseToEdit.day);
      setStartTime(courseToEdit.startTime);
      setEndTime(courseToEdit.endTime);
      setLocation(courseToEdit.location);
      setColor(courseToEdit.color);
      setEcts(courseToEdit.ects);
      setSemester(courseToEdit.semester);
    } else {
      setCode('');
      setName('');
      setLecturer('');
      setDay('Pazartesi');
      setStartTime('09:00');
      setEndTime('10:45');
      setLocation('Anadoluhisarı Yerleşkesi Amfi 1');
      setColor('blue');
      setEcts(5);
      setSemester('Güz Dönemi');
    }
  }, [courseToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    const newCourse: CourseScheduleItem = {
      id: courseToEdit ? courseToEdit.id : `course-${Date.now()}`,
      code: code.trim().toUpperCase(),
      name: name.trim(),
      lecturer: lecturer.trim() || 'Öğretim Görevlisi Belirtilmedi',
      day,
      startTime,
      endTime,
      location: location.trim() || 'Derslik Belirtilmedi',
      color,
      ects: Number(ects) || 5,
      semester: semester || 'Güz Dönemi'
    };

    onSave(newCourse);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-800" />
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              {courseToEdit ? 'Ders Bilgilerini Düzenle' : 'Ders Programına Yeni Ders Ekle'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Quick Preset helper buttons for common Marmara Sports Management courses */}
          {!courseToEdit && (
            <div className="bg-blue-50/70 p-3 rounded-lg border border-blue-100">
              <span className="font-semibold text-blue-900 block mb-1.5">
                Hızlı Ders Şablonları (Marmara Spor Bilimleri):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { code: 'SYTF1013', name: 'Yönetim Bilimine Giriş', lecturer: 'Prof. Dr. SEMA ALAY ÖZGÜL', loc: 'Anadolu Hisarı SPBF DERSLİK 1', color: 'blue' as const },
                  { code: 'SYTF1017', name: 'İnsan Anatomisi', lecturer: 'Prof. Dr. SELDA UZUN', loc: 'Anadolu Hisarı SPBF DERSLİK 4', color: 'rose' as const },
                  { code: 'SYTF1011', name: 'Spor Bilimlerine Giriş', lecturer: 'Doç. Dr. GÖKALP DEMİR', loc: 'Anadolu Hisarı SPBF DERSLİK 1', color: 'indigo' as const },
                  { code: 'SYTF1023', name: 'Sporda Gönüllülük', lecturer: 'Öğr. Gör. ŞENOL GÜNEŞ', loc: 'Anadolu Hisarı SPBF DERSLİK 3', color: 'emerald' as const },
                  { code: 'SYTF1015', name: 'Spor Tarihi', lecturer: 'Dr. Öğr. Üyesi MÜFİDE ÇOTUK', loc: 'Anadolu Hisarı SPBF DERSLİK 1', color: 'amber' as const },
                  { code: 'HAN1001', name: 'Genel Cimnastik', lecturer: 'Doç. Dr. İLKER KİRİŞÇİ', loc: 'Anadolu Hisarı CİMNASTİK SALONU 1', color: 'cyan' as const }
                ].map((item) => (
                  <button
                    type="button"
                    key={item.code}
                    onClick={() => {
                      setCode(item.code);
                      setName(item.name);
                      setLecturer(item.lecturer);
                      setLocation(item.loc);
                      setColor(item.color);
                    }}
                    className="px-2 py-1 bg-white hover:bg-blue-100/50 border border-blue-200 rounded text-[11px] font-medium text-blue-900 transition-colors"
                  >
                    + {item.code} {item.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Row 1: Code and Name */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="block font-medium text-slate-700 mb-1">Ders Kodu *</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Örn: SYO 301"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-800 bg-white"
              />
            </div>
            <div className="col-span-2">
              <label className="block font-medium text-slate-700 mb-1">Ders Adı *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn: Spor Tesisleri Planlama ve İşletmeciliği"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-800 bg-white"
              />
            </div>
          </div>

          {/* Row 2: Lecturer & Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Öğretim Görevlisi / Hoca
              </label>
              <input
                type="text"
                value={lecturer}
                onChange={(e) => setLecturer(e.target.value)}
                placeholder="Örn: Prof. Dr. Kemal Tamer"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-800 bg-white"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Derslik / Salon / Yerleşke
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Örn: Anadoluhisarı Amfi 1"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-800 bg-white"
              />
            </div>
          </div>

          {/* Row 3: Day and Times */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Ders Günü *
              </label>
              <select
                value={day}
                onChange={(e) => setDay(e.target.value as DayOfWeek)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-800 bg-white"
              >
                {DAYS_OF_WEEK.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Başlangıç Saati
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-800 bg-white"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Bitiş Saati
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-800 bg-white"
              />
            </div>
          </div>

          {/* Row 4: AKTS & Color */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block font-medium text-slate-700 mb-1 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                AKTS Kredisi
              </label>
              <input
                type="number"
                min={1}
                max={15}
                value={ects}
                onChange={(e) => setEcts(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-800 bg-white"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1.5">Program Renk Teması</label>
              <div className="flex items-center gap-2">
                {[
                  { id: 'blue', color: 'bg-blue-600' },
                  { id: 'indigo', color: 'bg-indigo-600' },
                  { id: 'emerald', color: 'bg-emerald-600' },
                  { id: 'amber', color: 'bg-amber-600' },
                  { id: 'rose', color: 'bg-rose-600' },
                  { id: 'purple', color: 'bg-purple-600' },
                  { id: 'cyan', color: 'bg-cyan-600' }
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setColor(item.id as CourseScheduleItem['color'])}
                    className={`w-6 h-6 rounded-full ${item.color} transition-transform ${
                      color === item.id ? 'ring-2 ring-offset-2 ring-slate-800 scale-110' : 'opacity-80 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 mt-6">
            {courseToEdit && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`${courseToEdit.code} dersini programdan kaldırmak istediğinize emin misiniz?`)) {
                    onDelete(courseToEdit.id);
                    onClose();
                  }
                }}
                className="px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg font-medium transition-colors"
              >
                Dersi Programdan Sil
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg font-medium transition-colors"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 font-semibold transition-colors shadow-sm"
              >
                {courseToEdit ? 'Güncellemeyi Kaydet' : 'Ders Programına Kaydet'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
