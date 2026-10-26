import React from 'react';
import { 
  Calendar, 
  Clock, 
  PlusCircle, 
  FileText, 
  Camera,
  MapPin, 
  User, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { CourseScheduleItem, DayOfWeek, LectureNote, StudyTask } from '../types';
import { COURSE_COLOR_MAP } from '../data/initialData';

interface PlannerBarProps {
  courses: CourseScheduleItem[];
  notes: LectureNote[];
  tasks: StudyTask[];
  selectedDay: DayOfWeek;
  onSelectDay: (day: DayOfWeek) => void;
  onAddNoteForCourse: (courseId: string) => void;
  onViewCourseNotes: (courseId: string) => void;
  onOpenNewCourseModal: () => void;
  onOpenLiveCamera?: (courseId?: string) => void;
}

export const PlannerBar: React.FC<PlannerBarProps> = ({
  courses,
  notes,
  tasks,
  selectedDay,
  onSelectDay,
  onAddNoteForCourse,
  onViewCourseNotes,
  onOpenNewCourseModal,
  onOpenLiveCamera
}) => {
  // Filter courses for the selected day
  const todayCourses = courses
    .filter((c) => c.day === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const totalWeeklyEcts = courses.reduce((sum, c) => sum + c.ects, 0);
  const totalNotes = notes.length;
  const pendingTasks = tasks.filter((t) => !t.completed).length;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs mb-6">
      {/* Top row: Day Selector & Metric overview */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-700"></span>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Semih Utku · Günlük Ders Planı
            </h2>
            <span className="text-xs text-slate-400">· Marmara Spor Yöneticiliği</span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Günün derslerini takip edin, ders esnasında doğrudan programa bağlı görsel ve yazılı notlar alın.
          </p>
        </div>

        {/* Quick Metrics */}
        <div className="flex items-center gap-4 text-xs">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block">Haftalık Ders Yükü</span>
            <span className="font-semibold text-slate-900 tabular-nums">
              {courses.length} Ders · {totalWeeklyEcts} AKTS
            </span>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block">Kayıtlı Notlar</span>
            <span className="font-semibold text-slate-900 tabular-nums">
              {totalNotes} Ders Notu
            </span>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block">Bekleyen Görevler</span>
            <span className="font-semibold text-amber-700 tabular-nums">
              {pendingTasks} Akademik Görev
            </span>
          </div>
        </div>
      </div>

      {/* Day Selector Buttons */}
      <div className="flex items-center justify-between gap-2 pt-4 flex-wrap">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
          {(['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'] as DayOfWeek[]).map((day) => {
            const hasClass = courses.some((c) => c.day === day);
            const isSelected = selectedDay === day;
            return (
              <button
                key={day}
                onClick={() => onSelectDay(day)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <span>{day}</span>
                {hasClass && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? 'bg-amber-400' : 'bg-blue-600'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={onOpenNewCourseModal}
          className="text-xs font-semibold text-blue-800 hover:text-blue-900 flex items-center gap-1 px-3 py-1.5 bg-blue-50/80 hover:bg-blue-100 border border-blue-200/80 rounded-lg transition-colors"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Programa Yeni Ders Ekle
        </button>
      </div>

      {/* Today's Courses Schedule Strip */}
      <div className="mt-4">
        {todayCourses.length === 0 ? (
          <div className="py-6 px-4 bg-slate-50 border border-dashed border-slate-200 rounded-lg text-center">
            <p className="text-xs font-medium text-slate-600">
              {selectedDay} günü için ders programında kayıtlı ders bulunmuyor.
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Ders çalışabilir, eski notları tekrar edebilir veya yeni bir ders ekleyebilirsiniz.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {todayCourses.map((course) => {
              const courseNotes = notes.filter((n) => n.courseId === course.id);
              const colorConfig = COURSE_COLOR_MAP[course.color] || COURSE_COLOR_MAP.blue;

              return (
                <div
                  key={course.id}
                  className={`p-3.5 rounded-lg border ${colorConfig.border} ${colorConfig.bg} transition-all hover:shadow-xs flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-mono font-bold text-slate-800">
                        {course.code}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-slate-700 tabular-nums">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {course.startTime} - {course.endTime}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1">
                      {course.name}
                    </h3>

                    <div className="mt-2 space-y-1 text-[11px] text-slate-600">
                      <div className="flex items-center gap-1 truncate">
                        <User className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{course.lecturer}</span>
                      </div>
                      <div className="flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{course.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions for this course */}
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-200/60 text-xs">
                    <button
                      onClick={() => onViewCourseNotes(course.id)}
                      className="text-slate-600 hover:text-slate-900 flex items-center gap-1 text-[11px] font-medium"
                    >
                      <FileText className="w-3 h-3" />
                      {courseNotes.length} Not
                    </button>

                    <div className="flex items-center gap-1.5">
                      {onOpenLiveCamera && (
                        <button
                          onClick={() => onOpenLiveCamera(course.id)}
                          className="px-2 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded text-[11px] flex items-center gap-1 transition-all shadow-2xs active:scale-95"
                          title="Bu dersteyken doğrudan tahtayı veya slaytı fotoğrafla"
                        >
                          <Camera className="w-3 h-3" />
                          Foto Çek
                        </button>
                      )}

                      <button
                        onClick={() => onAddNoteForCourse(course.id)}
                        className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-blue-900 font-semibold rounded text-[11px] shadow-2xs hover:border-blue-400 flex items-center gap-1 transition-all"
                      >
                        <PlusCircle className="w-3 h-3 text-blue-700" />
                        Not Yaz
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
