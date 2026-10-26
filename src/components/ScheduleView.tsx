import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  MapPin, 
  User, 
  Edit2, 
  Trash2, 
  BookOpen, 
  PlusCircle, 
  List, 
  Grid,
  X 
} from 'lucide-react';
import { CourseScheduleItem, DayOfWeek, LectureNote } from '../types';
import { COURSE_COLOR_MAP, DAYS_OF_WEEK } from '../data/initialData';

interface ScheduleViewProps {
  courses: CourseScheduleItem[];
  notes: LectureNote[];
  onAddCourse: () => void;
  onEditCourse: (course: CourseScheduleItem) => void;
  onDeleteCourse: (courseId: string) => void;
  onAddNoteForCourse: (courseId: string) => void;
  onViewCourseNotes: (courseId: string) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  courses,
  notes,
  onAddCourse,
  onEditCourse,
  onDeleteCourse,
  onAddNoteForCourse,
  onViewCourseNotes
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showOriginalScreenshots, setShowOriginalScreenshots] = useState(false);
  const [mobileSelectedDay, setMobileSelectedDay] = useState<DayOfWeek>('Pazartesi');

  const officialScreenshots = [
    { title: 'Pazartesi Programı', path: '/assets/aistudio/image_82c9ae43.png', desc: 'Yönetim Bilimine Giriş (09:30-12:20) & İnsan Anatomisi (13:00-14:50)' },
    { title: 'Salı Programı', path: '/assets/aistudio/image_04667ff6.png', desc: 'Spor Bilimlerine Giriş (15:00-16:50)' },
    { title: 'Perşembe Programı', path: '/assets/aistudio/image_77cff542.png', desc: 'Sporda Gönüllülük (10:30-12:20) & Spor Tarihi (15:00-16:50)' },
    { title: 'Cuma Programı', path: '/assets/aistudio/image_830f0c2d.png', desc: 'Genel Cimnastik (14:00-16:50)' }
  ];

  return (
    <div className="space-y-6">
      {/* Action and view controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Haftalık Ders Programı (Marmara Spor Bilimleri)
          </h2>
          <p className="text-xs text-slate-500">
            Spor Yöneticiliği Bölümü ders çizelgesi, amfi ve salon dağılımları
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowOriginalScreenshots(true)}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
            title="Yüklediğiniz Marmara Mobil ekran görüntülerini görüntüleyin"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-800" />
            Marmara Mobil Ekranı
          </button>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Haftalık Tablo Görünümü"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Liste Görünümü"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onAddCourse}
            className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ders Ekle
          </button>
        </div>
      </div>

      {/* Grid Mode View */}
      {viewMode === 'grid' && (
        <div className="space-y-4">
          {/* Mobile-Friendly Day Carousel & Cards (Visible on screens below md) */}
          <div className="block md:hidden space-y-3">
            {/* Horizontal Day Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {DAYS_OF_WEEK.map((day) => {
                const dayCoursesCount = courses.filter((c) => c.day === day).length;
                const isSelected = mobileSelectedDay === day;
                return (
                  <button
                    key={day}
                    onClick={() => setMobileSelectedDay(day)}
                    className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                      isSelected
                        ? 'bg-blue-900 text-white shadow-sm'
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    <span>{day}</span>
                    {dayCoursesCount > 0 && (
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isSelected ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-100 text-slate-600'}`}>
                        {dayCoursesCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Day Course Cards (Marmara Mobil layout) */}
            <div className="space-y-3">
              {courses.filter((c) => c.day === mobileSelectedDay).length === 0 ? (
                <div className="p-8 bg-white border border-dashed border-slate-200 rounded-2xl text-center text-xs text-slate-500">
                  {mobileSelectedDay} günü için programda kayıtlı ders bulunmuyor.
                </div>
              ) : (
                courses
                  .filter((c) => c.day === mobileSelectedDay)
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map((course) => {
                    const colorConfig = COURSE_COLOR_MAP[course.color] || COURSE_COLOR_MAP.blue;
                    const courseNotes = notes.filter((n) => n.courseId === course.id);

                    return (
                      <div
                        key={course.id}
                        className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                          <div>
                            <span className="font-mono text-xs font-bold text-blue-950 block">
                              {course.code}
                            </span>
                            <h4 className="font-bold text-slate-900 text-sm leading-snug">
                              {course.name}
                            </h4>
                          </div>
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${colorConfig.badge}`}>
                            {course.ects} AKTS
                          </span>
                        </div>

                        <div className="space-y-1.5 text-xs text-slate-600">
                          <div className="flex items-start gap-2">
                            <span className="text-slate-400 font-medium w-12 shrink-0">Yer:</span>
                            <span className="font-medium text-slate-800">{course.location}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-slate-400 font-medium w-12 shrink-0">Saat:</span>
                            <span className="font-bold text-slate-900 tabular-nums">
                              {course.startTime} - {course.endTime}
                            </span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-slate-400 font-medium w-12 shrink-0">Hoca:</span>
                            <span className="text-slate-800">{course.lecturer}</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <button
                            onClick={() => onAddNoteForCourse(course.id)}
                            className="px-3.5 py-1.5 bg-blue-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                          >
                            <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
                            Bu Derse Not Yaz
                          </button>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => onEditCourse(course)}
                              className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                              title="Düzenle"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteCourse(course.id)}
                              className="p-2 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                              title="Sil"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>

          {/* Desktop Full 6-Column Grid (Hidden on mobile) */}
          <div className="hidden md:block bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <div className="min-w-[900px]">
                {/* Day headers */}
                <div className="grid grid-cols-6 border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-700">
                  {DAYS_OF_WEEK.map((day) => {
                    const dayCoursesCount = courses.filter((c) => c.day === day).length;
                    return (
                      <div key={day} className="px-4 py-3 border-r border-slate-200 last:border-r-0">
                        <div className="flex items-center justify-between">
                          <span>{day}</span>
                          <span className="text-[11px] font-normal text-slate-400">
                            {dayCoursesCount} Ders
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

              {/* Day Columns */}
              <div className="grid grid-cols-6 min-h-[480px] divide-x divide-slate-200">
                {DAYS_OF_WEEK.map((day) => {
                  const dayCourses = courses
                    .filter((c) => c.day === day)
                    .sort((a, b) => a.startTime.localeCompare(b.startTime));

                  return (
                    <div key={day} className="p-2 space-y-2.5 bg-slate-50/20">
                      {dayCourses.length === 0 ? (
                        <div className="h-32 flex items-center justify-center text-center p-3 text-[11px] text-slate-400 border border-dashed border-slate-200 rounded-lg">
                          Ders Yok
                        </div>
                      ) : (
                        dayCourses.map((course) => {
                          const courseNotes = notes.filter((n) => n.courseId === course.id);
                          const colorConfig = COURSE_COLOR_MAP[course.color] || COURSE_COLOR_MAP.blue;

                          return (
                            <div
                              key={course.id}
                              className={`p-3 rounded-lg border ${colorConfig.border} ${colorConfig.bg} shadow-2xs transition-all hover:shadow-xs group flex flex-col justify-between`}
                            >
                              <div>
                                <div className="flex items-center justify-between text-[11px] mb-1">
                                  <span className="font-mono font-bold text-slate-800">
                                    {course.code}
                                  </span>
                                  <span className="font-medium text-slate-600 tabular-nums">
                                    {course.startTime}-{course.endTime}
                                  </span>
                                </div>

                                <h4 className="font-bold text-slate-900 text-xs leading-snug">
                                  {course.name}
                                </h4>

                                <div className="mt-2 space-y-1 text-[11px] text-slate-600">
                                  <p className="flex items-center gap-1 truncate">
                                    <User className="w-3 h-3 text-slate-400 shrink-0" />
                                    <span className="truncate">{course.lecturer}</span>
                                  </p>
                                  <p className="flex items-center gap-1 truncate">
                                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                    <span className="truncate">{course.location}</span>
                                  </p>
                                </div>
                              </div>

                              {/* Action controls */}
                              <div className="pt-2.5 mt-2.5 border-t border-slate-200/60 flex items-center justify-between">
                                <button
                                  onClick={() => onAddNoteForCourse(course.id)}
                                  className="text-[11px] font-semibold text-blue-900 hover:text-blue-700 flex items-center gap-1"
                                >
                                  <PlusCircle className="w-3 h-3 text-blue-700" />
                                  Not Al
                                </button>

                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => onEditCourse(course)}
                                    className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-white/80"
                                    title="Düzenle"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => onDeleteCourse(course.id)}
                                    className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-white/80"
                                    title="Sil"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    )}

      {/* Table Mode View */}
      {viewMode === 'table' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                <tr>
                  <th className="px-4 py-3">Ders Kodu & Adı</th>
                  <th className="px-4 py-3">Gün & Saat</th>
                  <th className="px-4 py-3">Öğretim Görevlisi</th>
                  <th className="px-4 py-3">Derslik / Salon</th>
                  <th className="px-4 py-3 text-center">AKTS</th>
                  <th className="px-4 py-3 text-center">Kayıtlı Not</th>
                  <th className="px-4 py-3 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {courses.map((course) => {
                  const courseNotes = notes.filter((n) => n.courseId === course.id);
                  const colorConfig = COURSE_COLOR_MAP[course.color] || COURSE_COLOR_MAP.blue;

                  return (
                    <tr key={course.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-medium">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${colorConfig.solid}`} />
                          <div>
                            <span className="font-mono font-bold text-slate-900 block">
                              {course.code}
                            </span>
                            <span className="text-slate-600">{course.name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-slate-900">{course.day}</span>
                        <span className="text-slate-500 block tabular-nums">
                          {course.startTime} - {course.endTime}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{course.lecturer}</td>
                      <td className="px-4 py-3 text-slate-600">{course.location}</td>
                      <td className="px-4 py-3 text-center font-medium tabular-nums">{course.ects}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => onViewCourseNotes(course.id)}
                          className="px-2 py-0.5 bg-blue-50 text-blue-900 hover:bg-blue-100 rounded text-[11px] font-semibold transition-colors"
                        >
                          {courseNotes.length} Not
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onAddNoteForCourse(course.id)}
                            className="px-2 py-1 bg-blue-800 text-white rounded text-[11px] font-semibold hover:bg-blue-900 transition-colors"
                          >
                            + Not Ekle
                          </button>
                          <button
                            onClick={() => onEditCourse(course)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteCourse(course.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Marmara Mobil Original Screenshots Modal */}
      {showOriginalScreenshots && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-800" />
                  Marmara Mobil - Resmi Ders Programı Ekran Görüntüleri
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Marmara Mobil uygulamasından aktarılan haftalık ders programınız
                </p>
              </div>
              <button
                onClick={() => setShowOriginalScreenshots(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50">
              {officialScreenshots.map((item, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs flex flex-col">
                  <div className="px-3 py-2 border-b border-slate-100 bg-slate-100/50">
                    <span className="font-bold text-xs text-blue-900">{item.title}</span>
                  </div>
                  <div className="p-2 flex-1 flex items-center justify-center bg-slate-900">
                    <img
                      src={item.path}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="max-h-80 w-auto rounded object-contain"
                    />
                  </div>
                  <div className="p-2.5 bg-white text-[11px] text-slate-600">
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-3 border-t border-slate-200 bg-white flex justify-end">
              <button
                onClick={() => setShowOriginalScreenshots(false)}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900 transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
