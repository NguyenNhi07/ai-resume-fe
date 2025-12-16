import { Button } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authApi } from "@/lib/api";
import { useToast } from "@/hooks/useToast";

export default function ResetPassword() {
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const otp = searchParams.get("otp") || "";

  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !otp) {
      toast.error(t("Missing email or OTP"));
      return;
    }
    if (!formData.newPassword || formData.newPassword !== formData.confirmPassword) {
      toast.error(t("Passwords do not match"));
      return;
    }
    setLoading(true);
    try {
      await authApi.resetPassword(email, otp, formData.newPassword);
      toast.success(t("Password has been reset. Please login"));
      navigate("/auth/login?state=login");
    } catch (error: any) {
      const msg = error?.response?.data?.message || error.message || t("Something went wrong");
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="z-20 w-full flex flex-col items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="md:w-96 min-w-120 flex flex-col items-center justify-center bg-white rounded-lg p-8"
      >
        <h2 className="text-4xl text-gray-900 font-medium">
          {t("Reset password")}
        </h2>
        <p className="text-sm text-gray-500/90 mt-3 text-center">
          {email ? `${t("Email")}: ${email}` : t("Enter new password")}
        </p>

        <div className="flex items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <input
            type="password"
            name="newPassword"
            placeholder={t("New password")}
            className="border-none outline-none ring-0 w-full"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex items-center mt-4 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <input
            type="password"
            name="confirmPassword"
            placeholder={t("Confirm password")}
            className="border-none outline-none ring-0 w-full"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <Button
          htmlType="submit"
          disabled={loading}
          size="large"
          className="!text-white !bg-purple-500 w-full !my-3 disabled:!text-white-65"
        >
          {loading ? t("Loading") : t("Continue")}
        </Button>
      </form>
    </div>
  );
}

