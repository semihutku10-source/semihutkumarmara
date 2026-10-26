import React, { useRef, useState, useEffect } from 'react';
import { 
  Camera, 
  X, 
  RotateCw, 
  Check, 
  RefreshCw, 
  BookOpen, 
  Sparkles, 
  AlertCircle, 
  Upload 
} from 'lucide-react';
import { CourseScheduleItem, LectureNote, NoteImage } from '../types';

interface LiveCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: CourseScheduleItem[];
  activeCourseId?: string;
  onSaveNoteWithPhoto: (note: LectureNote) => void;
}

export const LiveCameraModal: React.FC<LiveCameraModalProps> = ({
  isOpen,
  onClose,
  courses,
  activeCourseId,
  onSaveNoteWithPhoto
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  // Form states after capture
  const [selectedCourseId, setSelectedCourseId] = useState<string>(() => {
    return activeCourseId || (courses[0]?.id ?? '');
  });
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('Ders Tahtası / Slayt Fotoğrafı');
  const [quickNote, setQuickNote] = useState('');
  const [selectedTag, setSelectedTag] = useState<'Tahta Fotoğrafı' | 'Slayt' | 'Vize Konusu' | 'Saha İncelemesi'>('Tahta Fotoğrafı');

  // Start Camera Stream
  const startCamera = async (mode: 'environment' | 'user') => {
    stopCamera();
    setCameraError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Tarayıcınız doğrudan kamera akışını desteklemiyor.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsStreaming(true);
      }
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setIsStreaming(false);
      setCameraError(
        'Kameraya doğrudan erişilemedi. Aşağıdaki butonu kullanarak telefonunuzun kamerasını yerel olarak açıp fotoğraf çekebilirsiniz.'
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
  };

  useEffect(() => {
    if (isOpen) {
      setCapturedImage(null);
      setSelectedCourseId(activeCourseId || (courses[0]?.id ?? ''));
      setTitle(`Ders Fotoğrafı (${new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })})`);
      setCaption('Ders Tahtası / Slayt Fotoğrafı');
      setQuickNote('');
      startCamera(facingMode);
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const toggleCameraFacing = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Capture photo from video stream
  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // If front camera, flip horizontally for mirror preview
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);
    stopCamera();
  };

  // Handle fallback file / camera capture input
  const handleNativeFileCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCapturedImage(event.target.result as string);
        stopCamera();
      }
    };
    reader.readAsDataURL(file);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera(facingMode);
  };

  const handleSave = () => {
    if (!capturedImage) return;

    const course = courses.find((c) => c.id === selectedCourseId);

    const newPhoto: NoteImage = {
      id: `img-cam-${Date.now()}`,
      url: capturedImage,
      caption: caption || 'Ders Tahta Fotoğrafı',
      uploadedAt: new Date().toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' })
    };

    const finalNote: LectureNote = {
      id: `note-${Date.now()}`,
      courseId: selectedCourseId || 'general',
      courseCode: course ? course.code : 'SYTF',
      courseName: course ? course.name : 'Spor Yöneticiliği Dersi',
      title: title.trim() || `${course ? course.code : 'Ders'} Tahta Notu`,
      week: 4,
      date: new Date().toISOString().slice(0, 10),
      content: quickNote.trim() || 'Kameradan doğrudan çekilen ders tahtası ve slayt fotoğrafı notu.',
      images: [newPhoto],
      tags: [selectedTag, 'Kamera Notu'],
      keyTakeaways: quickNote.trim() ? [quickNote.trim()] : ['Tahtadaki şema/formül fotoğraflanarak arşive eklendi'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSaveNoteWithPhoto(finalNote);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 text-white rounded-2xl w-full max-w-lg max-h-[96vh] flex flex-col overflow-hidden shadow-2xl border border-slate-800">
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold tracking-tight text-white">
              {capturedImage ? 'Fotoğrafı Not Olarak Kaydet' : 'Ders Tahtası & Slayt Çek'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport: Live Stream or Captured Photo */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px] max-h-[440px]">
          {!capturedImage ? (
            <>
              {isStreaming ? (
                <video
                  ref={videoRef}
                  playsInline
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="p-6 text-center max-w-xs space-y-4">
                  <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-amber-400">
                    <Camera className="w-8 h-8" />
                  </div>
                  {cameraError && (
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {cameraError}
                    </p>
                  )}

                  {/* Native Mobile Camera Trigger */}
                  <label className="block w-full py-3.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2">
                    <Camera className="w-4 h-4" />
                    Telefon Kamerasını Aç
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleNativeFileCapture}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {/* Viewfinder Overlays when streaming */}
              {isStreaming && (
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4">
                  <div className="flex justify-between items-center text-[11px] text-white/80 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full self-start">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1.5" />
                    Canlı Kamera Hazır
                  </div>

                  {/* Corner Guides */}
                  <div className="border border-white/30 rounded-lg h-3/4 w-full self-center border-dashed" />
                </div>
              )}
            </>
          ) : (
            <div className="relative w-full h-full">
              <img
                src={capturedImage}
                alt="Çekilen Fotoğraf"
                className="w-full h-full object-contain bg-black"
              />
            </div>
          )}
        </div>

        {/* Live Camera Controls (Before photo taken) */}
        {!capturedImage && isStreaming && (
          <div className="p-4 bg-slate-950 flex items-center justify-around">
            <button
              onClick={toggleCameraFacing}
              className="p-3 text-slate-400 hover:text-white rounded-full bg-slate-900 border border-slate-800"
              title="Kamerayı Değiştir"
            >
              <RotateCw className="w-5 h-5" />
            </button>

            {/* Shutter Button */}
            <button
              onClick={capturePhoto}
              className="w-16 h-16 rounded-full border-4 border-amber-400 bg-white flex items-center justify-center active:scale-90 transition-transform shadow-lg cursor-pointer"
              title="Fotoğrafı Çek"
            >
              <div className="w-12 h-12 rounded-full bg-amber-400" />
            </button>

            {/* Fallback Native Input Option */}
            <label className="p-3 text-slate-400 hover:text-white rounded-full bg-slate-900 border border-slate-800 cursor-pointer">
              <Upload className="w-5 h-5" />
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleNativeFileCapture}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* Post-Capture Form (After photo taken) */}
        {capturedImage && (
          <div className="p-4 bg-slate-950 space-y-3 overflow-y-auto max-h-60 text-xs">
            {/* Course Selector */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                İlgili Ders (Ders Programından):
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} - {c.name} ({c.day})
                  </option>
                ))}
              </select>
            </div>

            {/* Note Title & Caption */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Not Başlığı:
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Örn: 3. Hafta Slayt 14"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Etiket:
                </label>
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none"
                >
                  <option value="Tahta Fotoğrafı">#Tahta Fotoğrafı</option>
                  <option value="Slayt">#Slayt</option>
                  <option value="Vize Konusu">#Vize Konusu</option>
                  <option value="Saha İncelemesi">#Saha İncelemesi</option>
                </select>
              </div>
            </div>

            {/* Quick Note Text */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Hocanın Söylediği Not / Açıklama:
              </label>
              <input
                type="text"
                value={quickNote}
                onChange={(e) => setQuickNote(e.target.value)}
                placeholder="Örn: Hoca bu formülü vizede soracağını belirtti..."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={retakePhoto}
                className="flex-1 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Tekrar Çek
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="flex-1 py-2.5 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg font-bold flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-transform"
              >
                <Check className="w-4 h-4" />
                Derse Kaydet
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
