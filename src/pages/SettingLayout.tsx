import EditIcon from "@/components/icons/EditIcon";
import { Navbar } from "@/components/Navbar";
import { UnsavedChangesProvider } from "@/components/setting/context/UnsavedChangesContext";
import { MenuSideBar } from "@/components/setting/MenuSideBar";
import { Avatar, Button } from "antd";
import { fileApi, userApi } from "@/lib/api";
import { useToast } from "@/hooks/useToast";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";

export default function SettingLayout() {
  const { t } = useTranslation();
  const [user, setUser] = useState<{
    fullName: string;
    email: string;
    avatarUrl?: string;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const toast = useToast();

  useEffect(() => {
    let cancelled = false;

    userApi
      .me()
      .then((me) => {
        if (cancelled) return;
        const fullName =
          me.fullName ||
          [me.firstName, me.lastName].filter(Boolean).join(" ") ||
          me.email;
        setUser({
          fullName,
          email: me.email,
          avatarUrl: me.imageLink || undefined,
        });
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("Failed to load user profile in settings", error);
        setUser(null);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
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
      const updatedUser = user
        ? { ...user, avatarUrl: imageUrl }
        : { fullName: "", email: "", avatarUrl: imageUrl };
      setUser(updatedUser);
      toast.success(t("Avatar updated successfully"));
    } catch (error) {
      console.error("Failed to upload avatar", error);
      const axiosError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        t("Failed to upload avatar");
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
                {user?.fullName?.charAt(0) || ""}
              </Avatar>
            </div>
            <div>
              <div className="font-medium text-base text-black/85 max-w-[200px] truncate">
                {user?.fullName}
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
