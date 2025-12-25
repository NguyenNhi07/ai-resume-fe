import EditIcon from "@/components/icons/EditIcon";
import { Navbar } from "@/components/Navbar";
import { UnsavedChangesProvider } from "@/components/setting/context/UnsavedChangesContext";
import { MenuSideBar } from "@/components/setting/MenuSideBar";
import { Avatar, Button } from "antd";
import { fileApi } from "@/lib/api";
import { useToast } from "@/hooks/useToast";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";

export default function SettingLayout() {
  const { t } = useTranslation();
  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatarUrl?: string;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const toast = useToast();
  
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!user) {
      toast.error(t("User not found"));
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error(t("Please select an image file"));
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error(t("File size must be less than 5MB"));
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setIsUploading(true);
    try {
      const imageUrl = await fileApi.uploadImage(file);
      const updatedUser = { ...user, avatarUrl: imageUrl };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success(t("Avatar updated successfully"));
    } catch (error: any) {
      console.error("Failed to upload avatar", error);
      const errorMessage = error?.response?.data?.message || error?.message || t("Failed to upload avatar");
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
      // Reset input to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  return (
    <UnsavedChangesProvider>
      <Navbar />
      <div className="flex pb-[295px] items-center h-screen w-full px-[143px] py-[110px] bg-[#f0f2f5]">
        <div className="flex flex-col gap-8 p-0">
          <div className="flex gap-3">
            <div className="relative w-[42px] h-[42px] rounded-full overflow-hidden">
              <Avatar
                src={user?.avatarUrl || undefined}
                alt="profilePhotoUrl"
                size={40} 
              >
                {user?.name?.charAt(0) || ""}
              </Avatar>
            </div>
            <div>
              <div className="font-medium text-base text-black/85 max-w-[200px] truncate">
                {user?.name}
              </div>
              <Button
                type="link"
                onClick={handleClick}
                className="text-xs !text-black/55 flex gap-2 !px-0"
                disabled={isUploading}
                loading={isUploading}
              >
                <EditIcon /> {t("Change Avatar")}
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>
          <MenuSideBar />
        </div>
        <div className="bg-white rounded-2xl border-1 border-[#D9D9D9] w-full overflow-hidden">
          <Outlet />
        </div>
      </div>
    </UnsavedChangesProvider>
  );
}
