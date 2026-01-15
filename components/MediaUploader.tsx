
import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MediaItem } from '../types';
import { X, Upload, Image as ImageIcon, Film, Loader2 } from 'lucide-react';
import { TRANSLATIONS, Language } from '../constants';
import heic2any from 'heic2any';

interface MediaUploaderProps {
  media: MediaItem[];
  onMediaChange: (newMedia: MediaItem[]) => void;
  onAnalyzeReq?: (file: File) => void;
  lang?: Language;
}

// Robust ID generator
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    try {
      return crypto.randomUUID();
    } catch (e) {
      // Fallback if randomUUID fails (e.g. non-secure context)
    }
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const MediaUploader: React.FC<MediaUploaderProps> = ({ media, onMediaChange, onAnalyzeReq, lang = 'en' }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const t = TRANSLATIONS[lang];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsProcessing(true);
      const rawFiles = Array.from(e.target.files) as File[];
      const processedFiles: File[] = [];

      try {
        for (const file of rawFiles) {
          // Check for HEIC (mimetype or extension)
          if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
             try {
               const result = await heic2any({
                 blob: file,
                 toType: 'image/jpeg',
                 quality: 0.8
               });
               const blob = Array.isArray(result) ? result[0] : result;
               const newFile = new File([blob], file.name.replace(/\.heic$/i, '.jpg'), { type: 'image/jpeg' });
               processedFiles.push(newFile);
             } catch (conversionError) {
               console.error("Failed to convert HEIC:", conversionError);
               // Fallback to original file if conversion fails
               processedFiles.push(file);
             }
          } else {
             processedFiles.push(file);
          }
        }
        
        const newMediaItems: MediaItem[] = processedFiles.map((file) => ({
          id: generateId(),
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
      } catch (err) {
        console.error("Error processing files:", err);
      } finally {
        setIsProcessing(false);
        // Reset input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
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
            className="relative group aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 cursor-zoom-in hover:opacity-90 transition-opacity"
            title="Click to expand"
          >
            {item.type === 'image' ? (
              <img src={item.url} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <video src={item.url} className="absolute inset-0 w-full h-full object-cover" muted loop autoPlay playsInline />
            )}
            
            <button
              type="button"
              onClick={(e) => { 
                e.stopPropagation(); 
                removeMedia(item.id);
              }}
              className="absolute top-1 right-1 bg-red-500/90 text-white rounded-full p-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10 hover:bg-red-600 shadow-sm"
            >
              <X size={14} />
            </button>
            <div className="absolute bottom-1 left-1 bg-black/50 backdrop-blur-sm text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 pointer-events-none">
               {item.type === 'image' ? <ImageIcon size={10} /> : <Film size={10} />}
            </div>
          </div>
        ))}
        
        <button
          type="button"
          disabled={isProcessing}
          onClick={() => fileInputRef.current?.click()}
          className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-transparent"
        >
          {isProcessing ? (
             <Loader2 size={24} className="mb-2 animate-spin text-indigo-500" />
          ) : (
             <Upload size={24} className="mb-2" />
          )}
          <span className="text-xs font-medium">{isProcessing ? 'Processing...' : t.addMedia}</span>
        </button>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,video/*,.heic"
        multiple
      />

      {/* Lightbox Overlay using Portal */}
      {previewMedia && createPortal(
        <div 
          className="fixed inset-0 z-[500] flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setPreviewMedia(null)}
        >
          <button 
            type="button"
            className="absolute top-4 right-4 md:top-6 md:right-6 p-3 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-full transition-all z-[520] backdrop-blur-md shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              setPreviewMedia(null);
            }}
            aria-label="Close preview"
          >
            <X size={32} />
          </button>
          
          <div className="relative w-full h-full p-2 md:p-8 flex items-center justify-center">
            {previewMedia.type === 'image' ? (
              <img 
                src={previewMedia.url} 
                alt="Full preview" 
                className="max-w-full max-h-full object-contain rounded-md shadow-2xl" 
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <video 
                src={previewMedia.url} 
                className="max-w-full max-h-full object-contain rounded-md shadow-2xl" 
                controls 
                autoPlay 
                playsInline
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
