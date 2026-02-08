import { useState, useRef, useCallback, type DragEvent, type ChangeEvent } from 'react';
import styles from './FileDropzone.module.css';

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
      const validationError = validateFile(file);
      if (validationError) {
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
    <div className={styles.container}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className={styles.input}
      />
      {value && preview ? (
        <div className={styles.preview}>
          <img src={preview} alt="Preview" className={styles.image} />
          <div className={styles.fileInfo}>
            <span className={styles.fileName}>{value.name}</span>
            <span className={styles.fileSize}>{formatFileSize(value.size)}</span>
          </div>
          <button type="button" className={styles.removeButton} onClick={handleRemove}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      ) : (
        <div
          className={`${styles.dropzone} ${isDragging ? styles.dragging : ''} ${error ? styles.hasError : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <div className={styles.icon}>
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
          <p className={styles.text}>
            Drag & drop your .jpg here or <span className={styles.link}>click to browse</span>
          </p>
          <p className={styles.hint}>Maximum file size: {formatFileSize(maxSize)}</p>
        </div>
      )}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};
