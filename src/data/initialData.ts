import { CourseScheduleItem, LectureNote, StudyTask } from '../types';

export const INITIAL_COURSES: CourseScheduleItem[] = [
  {
    id: 'course-sytf1013',
    code: 'SYTF1013',
    name: 'Yönetim Bilimine Giriş',
    lecturer: 'Prof. Dr. SEMA ALAY ÖZGÜL',
    day: 'Pazartesi',
    startTime: '09:30',
    endTime: '12:20',
    location: 'Anadolu Hisarı - SPBF DERSLİK 1 (AHSP.D1)',
    color: 'blue',
    ects: 5,
    semester: '1. Yarıyıl (Güz)'
  },
  {
    id: 'course-sytf1017',
    code: 'SYTF1017',
    name: 'İnsan Anatomisi',
    lecturer: 'Prof. Dr. SELDA UZUN',
    day: 'Pazartesi',
    startTime: '13:00',
    endTime: '14:50',
    location: 'Anadolu Hisarı - SPBF DERSLİK 4 (AHSP.D4)',
    color: 'rose',
    ects: 5,
    semester: '1. Yarıyıl (Güz)'
  },
  {
    id: 'course-sytf1011',
    code: 'SYTF1011',
    name: 'Spor Bilimlerine Giriş',
    lecturer: 'Doç. Dr. GÖKALP DEMİR',
    day: 'Salı',
    startTime: '15:00',
    endTime: '16:50',
    location: 'Anadolu Hisarı - SPBF DERSLİK 1 (AHSP.D1)',
    color: 'indigo',
    ects: 4,
    semester: '1. Yarıyıl (Güz)'
  },
  {
    id: 'course-sytf1023',
    code: 'SYTF1023',
    name: 'Sporda Gönüllülük',
    lecturer: 'Öğr. Gör. ŞENOL GÜNEŞ',
    day: 'Perşembe',
    startTime: '10:30',
    endTime: '12:20',
    location: 'Anadolu Hisarı - SPBF DERSLİK 3 (AHSP.D3)',
    color: 'emerald',
    ects: 4,
    semester: '1. Yarıyıl (Güz)'
  },
  {
    id: 'course-sytf1015',
    code: 'SYTF1015',
    name: 'Spor Tarihi',
    lecturer: 'Dr. Öğr. Üyesi MÜFİDE ÇOTUK',
    day: 'Perşembe',
    startTime: '15:00',
    endTime: '16:50',
    location: 'Anadolu Hisarı - SPBF DERSLİK 1 (AHSP.D1)',
    color: 'amber',
    ects: 4,
    semester: '1. Yarıyıl (Güz)'
  },
  {
    id: 'course-han1001',
    code: 'HAN1001',
    name: 'Genel Cimnastik',
    lecturer: 'Doç. Dr. İLKER KİRİŞÇİ',
    day: 'Cuma',
    startTime: '14:00',
    endTime: '16:50',
    location: 'Anadolu Hisarı - CİMNASTİK SALONU 1 (AHSP.CS1)',
    color: 'cyan',
    ects: 4,
    semester: '1. Yarıyıl (Güz)'
  }
];

export const INITIAL_NOTES: LectureNote[] = [];

export const INITIAL_TASKS: StudyTask[] = [];

export const DAYS_OF_WEEK: CourseScheduleItem['day'][] = [
  'Pazartesi',
  'Salı',
  'Çarşamba',
  'Perşembe',
  'Cuma',
  'Cumartesi'
];

export const COURSE_COLOR_MAP = {
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-900',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-800',
    solid: 'bg-blue-600 text-white'
  },
  indigo: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-900',
    border: 'border-indigo-200',
    badge: 'bg-indigo-100 text-indigo-800',
    solid: 'bg-indigo-600 text-white'
  },
  emerald: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-900',
    border: 'border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-800',
    solid: 'bg-emerald-600 text-white'
  },
  amber: {
    bg: 'bg-amber-50',
    text: 'text-amber-900',
    border: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-800',
    solid: 'bg-amber-600 text-white'
  },
  rose: {
    bg: 'bg-rose-50',
    text: 'text-rose-900',
    border: 'border-rose-200',
    badge: 'bg-rose-100 text-rose-800',
    solid: 'bg-rose-600 text-white'
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-900',
    border: 'border-purple-200',
    badge: 'bg-purple-100 text-purple-800',
    solid: 'bg-purple-600 text-white'
  },
  cyan: {
    bg: 'bg-cyan-50',
    text: 'text-cyan-900',
    border: 'border-cyan-200',
    badge: 'bg-cyan-100 text-cyan-800',
    solid: 'bg-cyan-600 text-white'
  }
};
