import { Form } from "antd";
import TextArea from "antd/es/input/TextArea";
import { FileText, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

export const ProfessionalSummaryForm = () => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            {t("Professional Summary")}
          </h3>
          <p className="text-sm text-gray-500">
            {t("Add summary for your resume here")}
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 px-3 py-1 text-sm !bg-purple-100 !text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
        >
          <Sparkles className="size-4" />
          {t("AI Enhance")}
        </button>
      </div>

      <Form.Item
        name="professional_summary"
        label={
          <div className="flex gap-2 items-center">
            <FileText className="size-5" />
            {t("Professional Summary")}
          </div>
        }
        className="text-[14px] font-normal leading-[22px] text-black/85"
      >
        <TextArea
          rows={7}
          placeholder={t(
            "Write a compelling professional summary that highlights your key strengths and career objectives..."
          )}
        />
      </Form.Item>

      <p className="text-xs text-gray-500 max-w-4/5 mx-auto text-center">
        {t(
          "Tip: Keep it concise (3-4 sentences) and focus on your most relevant achievements and skills"
        )}
      </p>
    </div>
  );
};
