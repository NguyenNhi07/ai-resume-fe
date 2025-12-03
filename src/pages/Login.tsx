import { useToast } from "@/hooks/useToast";
import { authApi } from "@/lib/api";
import { Button } from "antd";
import { Lock, Mail, User2Icon } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const { t } = useTranslation();
  const toast = useToast()
  const navigate = useNavigate();
  const query = new URLSearchParams(window.location.search);
  const urlState = query.get("state");
  const [state, setState] = React.useState(urlState || "login");
  const [loading, setLoading] = React.useState(false);

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      if (state === "login") {
        response = await authApi.login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        response = await authApi.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
      }

      // Save token and user info
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      toast.success(
        state === "login" ? t("Login Success!") : t("Register Success!")
      );

      // Redirect to home
      navigate("/");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        (state === "login"
          ? t("Login Failed")
          : t("Register Failed"));
      toast.error(errorMessage);
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
          {state === "login" ? t("login") : t("signUp")}
        </h2>
        <p className="text-sm text-gray-500/90 mt-3">
          {t("welcomeBack")} {t("please")}{" "}
          {state === "login" ? t("login") : t("signUp")} {t("toContinue")}
        </p>

        {state !== "login" && (
          <div className="flex items-center mt-6 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <User2Icon size={16} color="#6B7280" />
            <input
              type="text"
              name="name"
              placeholder={t("name")}
              className="border-none outline-none ring-0"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 mt-6">
          <Mail size={13} color="#6B7280" />
          <input
            type="email"
            name="email"
            placeholder={t("emailId")}
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
            placeholder={t("password")}
            className="border-none outline-none ring-0"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mt-4 text-left text-purple-500">
          <button onClick={() => navigate('/auth/forgot-password')} className="text-sm" type="reset">
            {t("forgetPassword")}
          </button>
        </div>

        <Button
          htmlType="submit"
          disabled={loading}
          size="large"
          className="!text-white !bg-purple-500 w-full !my-3 disabled:!text-white-65"
        >
          {loading
            ? t("Loading")
            : state === "login"
              ? t("login")
              : t("signUp")}
        </Button>

        <p
          onClick={() =>
            setState((prev) => (prev === "login" ? "register" : "login"))
          }
          className="text-gray-500 text-sm mt-3 mb-11"
        >
          {state === "login"
            ? t("dontHaveAnAccount")
            : t("alreadyHaveAnAccount")}{" "}
          <Link
            to={
              state !== "login" ? "/auth/login?state=login" : "/auth/login?state=SignUp"
            }
            className="text-purple-500 hover:underline"
          >
            {t("clickHere")}
          </Link>
        </p>
      </form>
    </div>
  );
}
