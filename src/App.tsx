/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  CourseScheduleItem, 
  DayOfWeek, 
  LectureNote, 
  StudyTask 
} from './types';
import { storage } from './utils/storage';
import { Navbar } from './components/Navbar';
import { PlannerBar } from './components/PlannerBar';
import { ScheduleView } from './components/ScheduleView';
import { NotesListView } from './components/NotesListView';
import { StudyTasksView } from './components/StudyTasksView';
import { CourseModal } from './components/CourseModal';
import { NoteEditorModal } from './components/NoteEditorModal';
import { NoteDetailModal } from './components/NoteDetailModal';
import { TacticalBoardModal } from './components/TacticalBoardModal';
import { LiveCameraModal } from './components/LiveCameraModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { BookOpen, GraduationCap, MapPin, Sparkles, Download, RotateCcw, Camera } from 'lucide-react';

export default function App() {
  // Navigation tab
  const [currentTab, setCurrentTab] = useState<'schedule' | 'notes' | 'whiteboard' | 'tasks'>('schedule');

  // Application Data States
  const [courses, setCourses] = useState<CourseScheduleItem[]>(() => storage.getCourses());
  const [notes, setNotes] = useState<LectureNote[]>(() => storage.getNotes());
  const [tasks, setTasks] = useState<StudyTask[]>(() => storage.getTasks());

  // Current day calculation
  const getTodayDayOfWeek = (): DayOfWeek => {
    const days: DayOfWeek[] = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const currentDayIdx = new Date().getDay(); // 0 is Sunday, 1 is Monday...
    if (currentDayIdx === 0 || currentDayIdx === 6) return 'Pazartesi';
    return days[currentDayIdx - 1];
  };

  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(getTodayDayOfWeek);

  // Modal States
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<CourseScheduleItem | null>(null);

  const [isNoteEditorOpen, setIsNoteEditorOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<LectureNote | null>(null);
  const [preselectedCourseId, setPreselectedCourseId] = useState<string>('');

  const [selectedNoteForDetail, setSelectedNoteForDetail] = useState<LectureNote | null>(null);
  const [isNoteDetailOpen, setIsNoteDetailOpen] = useState(false);

  const [isTacticalModalOpen, setIsTacticalModalOpen] = useState(false);
  const [isLiveCameraOpen, setIsLiveCameraOpen] = useState(false);
  const [activeCameraCourseId, setActiveCameraCourseId] = useState<string | undefined>(undefined);

  // Filter state for notes view
  const [notesCourseFilter, setNotesCourseFilter] = useState<string>('all');

  // Persist to storage on change
  useEffect(() => {
    storage.saveCourses(courses);
  }, [courses]);

  useEffect(() => {
    storage.saveNotes(notes);
  }, [notes]);

  useEffect(() => {
    storage.saveTasks(tasks);
  }, [tasks]);

  // Course handlers
  const handleSaveCourse = (savedCourse: CourseScheduleItem) => {
    setCourses((prev) => {
      const exists = prev.some((c) => c.id === savedCourse.id);
      if (exists) {
        return prev.map((c) => (c.id === savedCourse.id ? savedCourse : c));
      }
      return [...prev, savedCourse];
    });
  };

  const handleDeleteCourse = (courseId: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
  };

  // Note handlers
  const handleSaveNote = (savedNote: LectureNote) => {
    setNotes((prev) => {
      const exists = prev.some((n) => n.id === savedNote.id);
      if (exists) {
        return prev.map((n) => (n.id === savedNote.id ? savedNote : n));
      }
      return [savedNote, ...prev];
    });
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    if (selectedNoteForDetail?.id === noteId) {
      setIsNoteDetailOpen(false);
      setSelectedNoteForDetail(null);
    }
  };

  // Task handlers
  const handleAddTask = (newTask: StudyTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // Shortcut triggers
  const handleAddNoteForCourse = (courseId: string) => {
    setPreselectedCourseId(courseId);
    setNoteToEdit(null);
    setIsNoteEditorOpen(true);
  };

  const handleViewCourseNotes = (courseId: string) => {
    setNotesCourseFilter(courseId);
    setCurrentTab('notes');
  };

  const handleOpenLiveCamera = (courseId?: string) => {
    setActiveCameraCourseId(courseId || courses[0]?.id);
    setIsLiveCameraOpen(true);
  };

  const handleSaveNoteWithPhoto = (newNote: LectureNote) => {
    handleSaveNote(newNote);
    setCurrentTab('notes');
  };

  const handleResetSampleData = () => {
    if (confirm('Örnek Marmara Spor Yöneticiliği ders programı ve notlarını geri yüklemek istediğinize emin misiniz?')) {
      const reset = storage.resetToDefault();
      setCourses(reset.courses);
      setNotes(reset.notes);
      setTasks(reset.tasks);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Bar Contract Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'whiteboard') {
            setIsTacticalModalOpen(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        onOpenNewNote={() => {
          setNoteToEdit(null);
          setPreselectedCourseId(courses[0]?.id || '');
          setIsNoteEditorOpen(true);
        }}
        onExportData={storage.exportAllData}
      />

      {/* Main Container with safe bottom padding for mobile navigation */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8 pb-28 md:pb-8">
        {/* University Student Profile Header Banner */}
        <div className="mb-4 sm:mb-6 p-4 md:p-5 rounded-xl bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start md:items-center gap-3.5">
            <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold px-2 py-0.5 bg-amber-400/20 text-amber-200 border border-amber-300/30 rounded">
                  2026-2027 Güz Yarıyılı
                </span>
                <span className="text-xs text-blue-200">· Öğrenci Portalı</span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight mt-0.5 text-white">
                Semih Utku
              </h1>
              <p className="text-xs text-blue-100 flex items-center gap-2 mt-0.5">
                <span>Marmara Üniversitesi Spor Bilimleri</span>
                <span>·</span>
                <span>Spor Yöneticiliği</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-300" /> Anadoluhisarı
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-start md:self-auto text-xs flex-wrap">
            <button
              onClick={() => handleOpenLiveCamera()}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-95"
              title="Kameradan hızlıca tahta fotoğrafı çekip derse ekle"
            >
              <Camera className="w-4 h-4 text-slate-950" />
              Kameradan Çek & Not Al
            </button>
            <button
              onClick={() => {
                setCourseToEdit(null);
                setIsCourseModalOpen(true);
              }}
              className="flex-1 sm:flex-none px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-lg transition-colors text-center"
            >
              + Ders Ekle
            </button>
          </div>
        </div>

        {/* Dynamic Schedule Planner Bar */}
        <PlannerBar
          courses={courses}
          notes={notes}
          tasks={tasks}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
          onAddNoteForCourse={handleAddNoteForCourse}
          onViewCourseNotes={handleViewCourseNotes}
          onOpenNewCourseModal={() => {
            setCourseToEdit(null);
            setIsCourseModalOpen(true);
          }}
          onOpenLiveCamera={handleOpenLiveCamera}
        />

        {/* Tab Views */}
        {currentTab === 'schedule' && (
          <ScheduleView
            courses={courses}
            notes={notes}
            onAddCourse={() => {
              setCourseToEdit(null);
              setIsCourseModalOpen(true);
            }}
            onEditCourse={(course) => {
              setCourseToEdit(course);
              setIsCourseModalOpen(true);
            }}
            onDeleteCourse={handleDeleteCourse}
            onAddNoteForCourse={handleAddNoteForCourse}
            onViewCourseNotes={handleViewCourseNotes}
          />
        )}

        {currentTab === 'notes' && (
          <NotesListView
            notes={notes}
            courses={courses}
            onOpenNewNoteModal={() => {
              setNoteToEdit(null);
              setPreselectedCourseId(courses[0]?.id || '');
              setIsNoteEditorOpen(true);
            }}
            onViewNote={(note) => {
              setSelectedNoteForDetail(note);
              setIsNoteDetailOpen(true);
            }}
            onEditNote={(note) => {
              setNoteToEdit(note);
              setIsNoteEditorOpen(true);
            }}
            onDeleteNote={handleDeleteNote}
            selectedCourseFilter={notesCourseFilter}
            onSelectCourseFilter={setNotesCourseFilter}
            onOpenLiveCamera={() => handleOpenLiveCamera()}
          />
        )}

        {currentTab === 'tasks' && (
          <StudyTasksView
            tasks={tasks}
            courses={courses}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Marmara Üniversitesi Spor Bilimleri Fakültesi · Spor Yöneticiliği Akademik Not & Program Portalı
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={handleResetSampleData}
              className="text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
              title="Örnek verileri yeniden yükle"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Örnek Verileri Sıfırla
            </button>
            <span>·</span>
            <button
              onClick={storage.exportAllData}
              className="text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              JSON Yedek
            </button>
          </div>
        </div>
      </footer>

      {/* Course Modal (Ders programı ekleme/düzenleme alanı) */}
      <CourseModal
        isOpen={isCourseModalOpen}
        onClose={() => {
          setIsCourseModalOpen(false);
          setCourseToEdit(null);
        }}
        onSave={handleSaveCourse}
        courseToEdit={courseToEdit}
        onDelete={handleDeleteCourse}
      />

      {/* Note Editor Modal (Yazılı + Görsel Ders Notu Ekleme & Düzenleme) */}
      <NoteEditorModal
        isOpen={isNoteEditorOpen}
        onClose={() => {
          setIsNoteEditorOpen(false);
          setNoteToEdit(null);
        }}
        onSave={handleSaveNote}
        noteToEdit={noteToEdit}
        courses={courses}
        preselectedCourseId={preselectedCourseId}
      />

      {/* Note Detail Reader Modal with Lightbox and Print */}
      <NoteDetailModal
        isOpen={isNoteDetailOpen}
        onClose={() => {
          setIsNoteDetailOpen(false);
          setSelectedNoteForDetail(null);
        }}
        note={selectedNoteForDetail}
        onEdit={(note) => {
          setNoteToEdit(note);
          setIsNoteEditorOpen(true);
        }}
        onDelete={handleDeleteNote}
      />

      {/* Standalone Tactical & Sports Facility Whiteboard Modal */}
      <TacticalBoardModal
        isOpen={isTacticalModalOpen}
        onClose={() => setIsTacticalModalOpen(false)}
        onSaveToNote={(dataUrl, caption) => {
          // Create a new note with this diagram directly
          const newNote: LectureNote = {
            id: `note-${Date.now()}`,
            courseId: courses[0]?.id || 'general',
            courseCode: courses[0]?.code || 'SYO',
            courseName: courses[0]?.name || 'Spor Yöneticiliği',
            title: caption || 'Saha & Taktik Çizim Notu',
            week: 1,
            date: new Date().toISOString().slice(0, 10),
            content: 'Taktik tahtasında oluşturulan saha ve organizasyon şeması.',
            images: [
              {
                id: `img-${Date.now()}`,
                url: dataUrl,
                caption: caption || 'Saha Çizimi',
                uploadedAt: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
              }
            ],
            tags: ['Taktik', 'Saha İncelemesi'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          handleSaveNote(newNote);
          setCurrentTab('notes');
        }}
      />

      {/* Live Camera Viewfinder & Direct Note Creation Modal */}
      <LiveCameraModal
        isOpen={isLiveCameraOpen}
        onClose={() => setIsLiveCameraOpen(false)}
        courses={courses}
        activeCourseId={activeCameraCourseId}
        onSaveNoteWithPhoto={handleSaveNoteWithPhoto}
      />

      {/* Mobile Fixed Bottom Thumb Navigation with Floating Shutter */}
      <MobileBottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'whiteboard') {
            setIsTacticalModalOpen(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        onOpenLiveCamera={() => handleOpenLiveCamera()}
      />
    </div>
  );
}
