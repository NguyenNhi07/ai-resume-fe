import { Button } from "antd";
import { Lock, Mail } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
    const { t } = useTranslation();
    const navigate = useNavigate()
    const [loading, setLoading] = React.useState(false);

    const [formData, setFormData] = React.useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    }

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
                    onClick={() => navigate('/auth/verify-email')}
                    disabled={loading}
                    size="large"
                    className="!text-white !bg-purple-500 w-full !my-3 disabled:!text-white-65"
                >
                    {t("Continue")}
                </Button>
            </form>
        </div>
    )
}