import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { compressImage, validateImageFile } from '../../utils/imageUtils';

interface ImageUploadProps {
  value?: { data: string; type: string };
  onChange: (image: { data: string; type: string } | undefined) => void;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, className = '' }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      validateImageFile(file);
      const compressed = await compressImage(file);
      onChange(compressed);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Error uploading image');
      }
    }

    // Clear input value to allow uploading the same file again
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    onChange(undefined);
  };

  return (
    <div className={`relative ${className}`}>
      {value?.data ? (
        <div className="relative">
          <img
            src={value.data}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
        >
          <Upload className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Click para subir imagen (JPG/PNG)
          </span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};