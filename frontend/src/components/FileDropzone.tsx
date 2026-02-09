import { useState, useRef, useCallback, type DragEvent, type ChangeEvent } from 'react';

type FileDropzoneProps = {
  value: File | null;
  onChange: (file: File | null) => void;
  error?: string;
  accept?: string;
  maxSize?: number;
};

const formatFileSize = (bytes: number): string =>
  bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

export const FileDropzone = ({
  value,
  onChange,
  error,
  accept = '.jpg,.jpeg',
  maxSize = 5 * 1024 * 1024,
}: FileDropzoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      const validTypes = ['image/jpeg'];
      if (!validTypes.includes(file.type)) return 'Only .jpg files are allowed';
      if (file.size > maxSize) return `File must be less than ${formatFileSize(maxSize)}`;
      return null;
    },
    [maxSize]
  );

  const handleFile = useCallback(
    (file: File) => {
      if (validateFile(file)) {
        onChange(null);
        setPreview(null);
        return;
      }
      onChange(file);
      setPreview(URL.createObjectURL(file));
    },
    [onChange, validateFile]
  );

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleRemove = useCallback(() => {
    onChange(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
  }, [onChange]);

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />
      {value && preview ? (
        <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg bg-white">
          <img src={preview} alt="Preview" className="w-12 h-12 object-cover rounded-md" />
          <div className="flex-1 flex flex-col gap-0.5 min-w-0">
            <span className="text-sm text-slate-900 truncate">{value.name}</span>
            <span className="text-xs text-slate-500">{formatFileSize(value.size)}</span>
          </div>
          <button
            type="button"
            className="flex items-center justify-center w-7 h-7 text-slate-400 hover:text-white hover:bg-red-600 rounded-md transition-all duration-150"
            onClick={handleRemove}
            aria-label="Remove file"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      ) : (
        <div
          className={`flex flex-col items-center justify-center py-8 px-5 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-150 ${
            isDragging
              ? 'border-primary bg-primary/5 scale-[1.01]'
              : error
              ? 'border-red-600 bg-red-600/5'
              : 'border-slate-200 bg-slate-50 hover:border-primary hover:bg-primary/5'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          onKeyDown={(e) => e.key === 'Enter' && handleClick()}
          role="button"
          tabIndex={0}
          aria-label="Upload file"
        >
          <div className="text-slate-400 mb-2">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path
                d="M16 22V10M16 10l-5 5M16 10l5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 20v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className="text-sm text-slate-900 text-center">
            Drag & drop your .jpg here or <span className="text-primary underline">click to browse</span>
          </p>
          <p className="mt-1 text-xs text-slate-500">Maximum file size: {formatFileSize(maxSize)}</p>
        </div>
      )}
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
};
