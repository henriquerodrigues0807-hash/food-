import React, { useState, useCallback } from 'react';

interface UseFileUploadOptions {
  maxSizeMB?: number;
  accept?: string[];
}

interface UseFileUploadReturn {
  file: File | null;
  preview: string | null;
  error: string | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clear: () => void;
}

export const useFileUpload = (options: UseFileUploadOptions = {}): UseFileUploadReturn => {
  const { maxSizeMB = 5, accept = ['image/jpeg', 'image/png', 'application/pdf'] } = options;
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError(null);

    if (!selectedFile) return;

    // Validate type
    if (accept.length > 0 && !accept.includes(selectedFile.type)) {
      setError(`Tipo de arquivo não permitido. Use: ${accept.join(', ')}`);
      return;
    }

    // Validate size
    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      setError(`O arquivo é muito grande. O limite é ${maxSizeMB}MB.`);
      return;
    }

    setFile(selectedFile);

    // Create preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  }, [accept, maxSizeMB]);

  const clear = useCallback(() => {
    setFile(null);
    setPreview(null);
    setError(null);
  }, []);

  return { file, preview, error, handleChange, clear };
};
