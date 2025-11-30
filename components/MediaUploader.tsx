import React, { useRef, useState } from 'react';
import { MediaItem } from '../types';
import { X, Upload, Image as ImageIcon, Film } from 'lucide-react';
import { TRANSLATIONS, Language } from '../constants';

interface MediaUploaderProps {
  media: MediaItem[];
  onMediaChange: (newMedia: MediaItem[]) => void;
  onAnalyzeReq?: (file: File) => void;
  lang?: Language;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({ media, onMediaChange, onAnalyzeReq, lang = 'en' }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);
  const t = TRANSLATIONS[lang];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files) as File[];
      const newMediaItems: MediaItem[] = files.map((file) => ({
        id: crypto.randomUUID(),
        type: file.type.startsWith('video') ? 'video' : 'image',
        url: URL.createObjectURL(file),
        file: file,
      }));

      // Trigger analysis on the first image if requested and it's an image
      if (onAnalyzeReq && newMediaItems.length > 0) {
        const firstImage = newMediaItems.find(m => m.type === 'image');
        if (firstImage && firstImage.file) {
          onAnalyzeReq(firstImage.file);
        }
      }

      onMediaChange([...media, ...newMediaItems]);
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeMedia = (id: string) => {
    onMediaChange(media.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {media.map((item) => (
          <div 
            key={item.id} 
            onClick={() => setPreviewMedia(item)}
            className="relative group aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 cursor-pointer hover:opacity-90 transition-opacity"
            title="Click to expand"
          >
            {item.type === 'image' ? (
              <img src={item.url} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <video src={item.url} className="w-full h-full object-cover" />
            )}
            <button
              type="button"
              onClick={(e) => { 
                e.stopPropagation(); 
                removeMedia(item.id);
              }}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-600"
            >
              <X size={14} />
            </button>
            <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-1 pointer-events-none">
               {item.type === 'image' ? <ImageIcon size={10} /> : <Film size={10} />}
            </div>
          </div>
        ))}
        
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          <Upload size={24} className="mb-2" />
          <span className="text-xs font-medium">{t.addMedia}</span>
        </button>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,video/*"
        multiple
      />

      {/* Lightbox Overlay */}
      {previewMedia && (
        <div 
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setPreviewMedia(null)}
        >
          <button 
            type="button"
            className="absolute top-4 right-4 md:top-6 md:right-6 p-3 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-full transition-all z-[120] backdrop-blur-md shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              setPreviewMedia(null);
            }}
            aria-label="Close preview"
          >
            <X size={32} />
          </button>
          
          <div 
            className="relative w-full h-full p-2 md:p-8 flex items-center justify-center pointer-events-none"
          >
            {previewMedia.type === 'image' ? (
              <img 
                src={previewMedia.url} 
                alt="Full preview" 
                className="max-w-full max-h-full object-contain rounded-md shadow-2xl pointer-events-auto" 
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <video 
                src={previewMedia.url} 
                className="max-w-full max-h-full object-contain rounded-md shadow-2xl pointer-events-auto" 
                controls 
                autoPlay 
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};