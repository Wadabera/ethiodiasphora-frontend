import React, { useState } from "react";
import { Upload, X, Check, AlertCircle } from "lucide-react";

interface DocumentUploaderProps {
  label: string;
  description?: string;
  accept?: string;
  required?: boolean;
  value?: File | string | null;
  onChange: (file: File | null) => void;
  error?: string;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  label,
  description,
  accept = "image/*,.pdf",
  required = false,
  value,
  onChange,
  error,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      onChange(file);

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    onChange(null);
    setPreview(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {value && (
          <div className="flex items-center text-green-400 text-sm">
            <Check className="w-4 h-4 mr-1" />
            Document uploaded
          </div>
        )}
      </div>

      {description && <p className="text-sm text-gray-400">{description}</p>}

      <div
        className={`border-2 ${dragOver ? "border-[#FFD700]" : "border-gray-700"} ${error ? "border-red-500" : ""} border-dashed rounded-xl p-6 text-center transition-colors duration-200 ${
          !value ? "hover:border-[#FFD700]/50 cursor-pointer" : ""
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() =>
          !value &&
          document
            .getElementById(`upload-${label.replace(/\s+/g, "-")}`)
            ?.click()
        }
      >
        <input
          id={`upload-${label.replace(/\s+/g, "-")}`}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />

        {value ? (
          <div className="space-y-4">
            {preview ? (
              <div className="relative max-w-xs mx-auto">
                <img
                  src={preview}
                  alt="Document preview"
                  className="rounded-lg max-h-48 object-contain mx-auto"
                />
                <button
                  type="button"
                  onClick={handleRemove}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="bg-[#1A1A1A] rounded-lg p-4">
                <div className="flex items-center justify-center text-green-400">
                  <Check className="w-8 h-8 mr-2" />
                  <span className="font-medium">
                    Document uploaded successfully
                  </span>
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={handleRemove}
              className="text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              Remove document
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-gradient-to-br from-gray-800 to-black rounded-full">
                <Upload className="w-8 h-8 text-[#FFD700]" />
              </div>
            </div>
            <div>
              <p className="text-gray-300 font-medium">
                Drag & drop your document here
              </p>
              <p className="text-gray-400 text-sm mt-1">or click to browse</p>
            </div>
            <p className="text-xs text-gray-500">
              Supported formats: JPG, PNG, PDF (Max 5MB)
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 mr-2" />
          {error}
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;
