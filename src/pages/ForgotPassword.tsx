import { Button } from "antd";
import { Lock, Mail } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/lib/api";
import { useToast } from "@/hooks/useToast";

export default function ForgotPassword() {
    const { t } = useTranslation();
    const navigate = useNavigate()
    const toast = useToast()
    const [loading, setLoading] = React.useState(false);

    const [formData, setFormData] = React.useState({
        email: "",
        password: "",
    });
  const [resendLoading, setResendLoading] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authApi.forgotPassword(formData.email, formData.password);
            toast.success(t("We have sent a reset OTP to your email"));
            navigate(`/auth/verify-email?email=${encodeURIComponent(formData.email)}`);
        } catch (error: any) {
            const msg = error?.response?.data?.message || error.message || t("Something went wrong");
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

  const handleResend = async () => {
    if (!formData.email || !formData.password) {
      toast.error(t("Please enter email and new password first"));
      return;
    }
    setResendLoading(true);
    try {
      await authApi.forgotPassword(formData.email, formData.password);
      toast.success(t("OTP has been resent to your email"));
    } catch (error: any) {
      const msg = error?.response?.data?.message || error.message || t("Something went wrong");
      toast.error(msg);
    } finally {
      setResendLoading(false);
    }
  };

    return (
        <div className="z-20 w-full flex flex-col items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="md:w-96 min-w-120 flex flex-col items-center justify-center bg-white rounded-lg p-8"
            >
                <h2 className="text-4xl text-gray-900 font-medium">
                    {t("Forgot password")}
                </h2>

                <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 mt-6">
                    <Mail size={13} color="#6B7280" />
                    <input
                        type="email"
                        name="email"
                        placeholder={t("Enter your email")}
                        className="border-none outline-none ring-0"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="flex items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
                    <Lock size={13} color="#6B7280" />
                    <input
                        type="password"
                        name="password"
                        placeholder={t("New password")}
                        className="border-none outline-none ring-0"
                        value={formData.password}
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
        <Button
          type="link"
          onClick={handleResend}
          disabled={resendLoading || loading}
          className="!px-0"
        >
          {resendLoading ? t("Sending...") : t("Resend OTP")}
        </Button>
            </form>
        </div>
    )
}