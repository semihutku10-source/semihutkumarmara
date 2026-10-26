export type DayOfWeek = 'Pazartesi' | 'Salı' | 'Çarşamba' | 'Perşembe' | 'Cuma' | 'Cumartesi';

export interface CourseScheduleItem {
  id: string;
  code: string;
  name: string;
  lecturer: string;
  day: DayOfWeek;
  startTime: string; // e.g., "09:00"
  endTime: string;   // e.g., "10:45"
  location: string;  // e.g., "Anadoluhisarı Amfi 1"
  color: 'blue' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'purple' | 'cyan';
  ects: number;
  semester: string;
}

export interface NoteImage {
  id: string;
  url: string; // Base64 or asset path
  caption: string;
  uploadedAt: string;
}

export interface LectureNote {
  id: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  title: string;
  week: number;
  date: string;
  content: string;
  images: NoteImage[];
  tags: string[];
  keyTakeaways?: string[];
  isPinned?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StudyTask {
  id: string;
  courseId?: string;
  courseName?: string;
  title: string;
  dueDate: string;
  type: 'Ödev' | 'Vize' | 'Final' | 'Saha Uygulaması' | 'Sunum' | 'Okuma';
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}
