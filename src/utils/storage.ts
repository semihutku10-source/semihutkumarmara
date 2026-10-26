import { CourseScheduleItem, LectureNote, StudyTask } from '../types';
import { INITIAL_COURSES, INITIAL_NOTES, INITIAL_TASKS } from '../data/initialData';

const COURSES_KEY = 'marmara_syo_courses_v3';
const NOTES_KEY = 'marmara_syo_notes_v3';
const TASKS_KEY = 'marmara_syo_tasks_v3';

export const storage = {
  getCourses: (): CourseScheduleItem[] => {
    try {
      const saved = localStorage.getItem(COURSES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading courses from storage', e);
    }
    return INITIAL_COURSES;
  },

  saveCourses: (courses: CourseScheduleItem[]) => {
    try {
      localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
    } catch (e) {
      console.error('Error saving courses to storage', e);
    }
  },

  getNotes: (): LectureNote[] => {
    try {
      const saved = localStorage.getItem(NOTES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading notes from storage', e);
    }
    return INITIAL_NOTES;
  },

  saveNotes: (notes: LectureNote[]) => {
    try {
      localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    } catch (e) {
      console.error('Error saving notes to storage', e);
    }
  },

  getTasks: (): StudyTask[] => {
    try {
      const saved = localStorage.getItem(TASKS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading tasks from storage', e);
    }
    return INITIAL_TASKS;
  },

  saveTasks: (tasks: StudyTask[]) => {
    try {
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Error saving tasks to storage', e);
    }
  },

  resetToDefault: () => {
    localStorage.removeItem(COURSES_KEY);
    localStorage.removeItem(NOTES_KEY);
    localStorage.removeItem(TASKS_KEY);
    return {
      courses: INITIAL_COURSES,
      notes: INITIAL_NOTES,
      tasks: INITIAL_TASKS
    };
  },

  exportAllData: () => {
    const data = {
      courses: storage.getCourses(),
      notes: storage.getNotes(),
      tasks: storage.getTasks(),
      exportedAt: new Date().toISOString(),
      studentFaculty: 'Marmara Üniversitesi Spor Bilimleri Fakültesi',
      department: 'Spor Yöneticiliği'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Marmara_SporYonetimi_DersNotlari_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
};
