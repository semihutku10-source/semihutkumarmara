import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Calendar, 
  BookOpen, 
  Trash2, 
  AlertCircle, 
  Clock 
} from 'lucide-react';
import { CourseScheduleItem, StudyTask } from '../types';

interface StudyTasksViewProps {
  tasks: StudyTask[];
  courses: CourseScheduleItem[];
  onAddTask: (task: StudyTask) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export const StudyTasksView: React.FC<StudyTasksViewProps> = ({
  tasks,
  courses,
  onAddTask,
  onToggleTask,
  onDeleteTask
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [dueDate, setDueDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [type, setType] = useState<StudyTask['type']>('Ödev');
  const [priority, setPriority] = useState<StudyTask['priority']>('medium');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedCourse = courses.find((c) => c.id === courseId);

    const newTask: StudyTask = {
      id: `task-${Date.now()}`,
      courseId,
      courseName: selectedCourse ? selectedCourse.name : 'Genel',
      title: title.trim(),
      dueDate,
      type,
      completed: false,
      priority
    };

    onAddTask(newTask);
    setTitle('');
    setIsAdding(false);
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Ders Programı Görevleri & Vize/Final Takvimi
          </h2>
          <p className="text-xs text-slate-500">
            Spor Yöneticiliği ödevleri, saha inceleme raporları ve sınav hazırlık hedefleri
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          {isAdding ? 'İptal' : 'Yeni Görev Ekle'}
        </button>
      </div>

      {/* Inline Add Task Form */}
      {isAdding && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 animate-in fade-in text-xs"
        >
          <h3 className="font-bold text-slate-900 text-sm">Akademik Görev Tanımla</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Görev / Ödev Başlığı *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn: Tesis Tahliye Raporu Hazırlanması"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-800 text-xs"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">İlgili Ders</label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-800 text-xs"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} - {c.name}
                  </option>
                ))}
                <option value="general">Genel Spor Bilimleri</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Teslim / Hedef Tarihi</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-800 text-xs"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Görev Türü</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as StudyTask['type'])}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-800 text-xs"
              >
                <option value="Ödev">Ödev</option>
                <option value="Vize">Vize Sınavı Hazırlığı</option>
                <option value="Final">Final Sınavı Hazırlığı</option>
                <option value="Saha Uygulaması">Saha Uygulaması & Rapor</option>
                <option value="Sunum">Sunum / Seminer</option>
                <option value="Okuma">Mevzuat / Makale Okuması</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Öncelik Seviyesi</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as StudyTask['priority'])}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-800 text-xs"
              >
                <option value="high">Yüksek Öncelik</option>
                <option value="medium">Orta Öncelik</option>
                <option value="low">Düşük Öncelik</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 font-semibold shadow-xs"
            >
              Görevi Kaydet
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit text-xs">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
            filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Tüm Görevler ({tasks.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
            filter === 'pending' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Yapılacaklar ({tasks.filter((t) => !t.completed).length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
            filter === 'completed' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Tamamlananlar ({tasks.filter((t) => t.completed).length})
        </button>
      </div>

      {/* Tasks List */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs divide-y divide-slate-100">
        {filteredTasks.length === 0 ? (
          <div className="py-12 px-4 text-center max-w-sm mx-auto">
            <p className="text-xs font-bold text-slate-800">Kayıtlı Görev Bulunmuyor</p>
            <p className="text-[11px] text-slate-500 mt-1 mb-3">
              Vize/final sınav hedeflerinizi veya ders ödevlerinizi programa bağlayarak ekleyebilirsiniz.
            </p>
            <button
              onClick={() => setIsAdding(true)}
              className="px-3.5 py-1.5 bg-blue-900 text-white rounded-lg text-xs font-semibold hover:bg-blue-800 transition-colors"
            >
              + İlk Görevi Ekle
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 flex items-center justify-between gap-4 transition-colors ${
                task.completed ? 'bg-slate-50/50' : 'hover:bg-slate-50/80'
              }`}
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <button
                  onClick={() => onToggleTask(task.id)}
                  className="mt-0.5 text-slate-400 hover:text-blue-800 transition-colors shrink-0"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                <div className="min-w-0">
                  <h4
                    className={`font-semibold text-xs leading-snug ${
                      task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                    }`}
                  >
                    {task.title}
                  </h4>

                  {/* Unboxed Metadata */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                    <span className="font-medium text-slate-700">{task.courseName}</span>
                    <span>·</span>
                    <span className="text-slate-600">{task.type}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1 tabular-nums">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {task.dueDate}
                    </span>
                    <span>·</span>
                    <span
                      className={`font-medium ${
                        task.priority === 'high'
                          ? 'text-rose-600'
                          : task.priority === 'medium'
                          ? 'text-amber-600'
                          : 'text-slate-500'
                      }`}
                    >
                      {task.priority === 'high' ? 'Yüksek Öncelik' : task.priority === 'medium' ? 'Orta' : 'Düşük'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onDeleteTask(task.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100 transition-colors"
                title="Görevi Sil"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
