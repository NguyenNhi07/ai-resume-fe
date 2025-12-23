import { Button } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authApi } from "@/lib/api";
import { useToast } from "@/hooks/useToast";

export default function VeirifyEmail() {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email") || "";
    const toast = useToast();
    const [loading, setLoading] = React.useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [isInvalid, setIsInvalid] = useState(false)
    const [countdown, setCountdown] = useState(120)
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])
    const navigate = useNavigate()

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1)
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [countdown])

    const [formData, setFormData] = React.useState({
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleResendOTP = () => {
        // Quay lại màn quên mật khẩu để nhập email + mật khẩu mới
        navigate('/auth/forgot-password');
    }

    const handleInputChange = (index: number, value: string) => {
        if (value.length > 1) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)
        setIsInvalid(false)

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handleSubmit = async () => {
        const otpCode = otp.join('')
        if (!email) {
            toast.error(t("Email is missing"));
            return;
        }
        if (!otpCode || otpCode.length < 6) {
            setIsInvalid(true);
            return;
        }
        setLoading(true);
        try {
            await authApi.verifyOtp(email, otpCode);
            toast.success(t("Code verified. Your password has been updated."));
            navigate(`/auth/login?state=login`);
        } catch (error: any) {
            const msg = error?.response?.data?.message || error.message || t("Invalid code");
            toast.error(msg);
            setIsInvalid(true);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="z-20 w-full flex flex-col items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="md:w-96 min-w-120 flex flex-col items-center justify-center bg-white rounded-lg p-8"
            >
                <h2 className="text-4xl text-gray-900 font-medium">
                    {t("Verify your email")}
                </h2>
                <p className="text-sm text-gray-500/90 mt-3 text-center">
                    {t("Enter the verification code sent to your email nhi.nguyen2gg@sotatek.com")}

                </p>

                <div className="flex justify-between gap-3 my-2">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={el => {
                                inputRefs.current[index] = el
                            }}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={e => {
                                const value = e.target.value
                                if (/^\d?$/.test(value)) {
                                    handleInputChange(index, value)
                                }
                            }}
                            onKeyDown={e => {
                                const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab']
                                const isNumberKey = /^[0-9]$/.test(e.key)

                                if (!isNumberKey && !allowedKeys.includes(e.key)) {
                                    e.preventDefault()
                                } else {
                                    handleKeyDown(index, e)
                                }
                            }}
                            className={`w-12 h-12 text-center text-xl font-semibold border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent
                                ${isInvalid ? 'border-red-500 shadow-[0_0_0_3px_#FFE4E5]' : 'border-gray-300'}`}
                        />
                    ))}
                </div>
                {isInvalid ? (
                    <span className="text-sm font-semibold text-red-500">{t('Code is invalid')}</span>
                ) : (
                    <span className="text-sm text-gray-500/90 mt-3 text-center">
                        {t('Did not receive a code?')}{' '} 
                        {countdown > 0 ? (
                            <span className="text-text-heading-primary font-bold">
                                {t('Resend later')} {countdown}s
                            </span>
                        ) : (
                            <span className="text-button-text-brand font-bold cursor-pointer" onClick={handleResendOTP}>
                                {t('Resend')}
                            </span>
                        )}
                    </span>
                )}

                <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    size="large"
                    className="!text-white !bg-purple-500 w-full hover:!border-purple-500 !my-3 disabled:!text-white-65"
                >
                    {t("Continue")}
                </Button>
            </form>
        </div>
    )
}