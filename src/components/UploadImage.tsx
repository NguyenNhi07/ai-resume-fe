import { User } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

interface UploadImageProps {
  imageFile: File | string | null;
  onChange: (file: File | string | null) => void;
  removeBackground: boolean;
  setRemoveBackground: React.Dispatch<React.SetStateAction<boolean>>;
  disabled?: boolean;
}

export const UploadImage: React.FC<UploadImageProps> = ({
  imageFile,
  onChange,
  removeBackground,
  setRemoveBackground,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const previewUrl =
    imageFile && typeof imageFile !== "string"
      ? URL.createObjectURL(imageFile)
      : typeof imageFile === "string"
      ? imageFile
      : null;

  return (
    <div className="flex items-center gap-4">
      <label className={`cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}>
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="user-image"
            className="w-16 h-16 rounded-full object-cover ring ring-slate-300 hover:opacity-80"
          />
        ) : (
          <div className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-700">
            <User className="size-10 p-2.5 border rounded-full" />
            {t("Upload Image")}
          </div>
        )}

        <input
          type="file"
          accept="image/jpeg, image/png"
          hidden
          disabled={disabled}
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
      </label>

      {/* {imageFile && (
        <div className="flex flex-col gap-1 text-sm">
          <p className="!mb-0">{t("Remove background")}</p>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={removeBackground}
              onChange={() => setRemoveBackground((prev) => !prev)}
            />
            <div className="w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-purple-600 transition-colors duration-200" />
            <span className="dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4" />
          </label>
        </div>
      )} */}
    </div>
  );
};
