import type { Education } from "@/lib/type";
import { Button, DatePicker, Form, Input } from "antd";
import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  GraduationCap,
  Plus,
  Trash2,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export const EducationForm = ({
  data,
  onChange,
}: {
  data: Education[];
  onChange: (value: Education[]) => void;
}) => {
  const { t } = useTranslation();

  const addEducation = () => {
    const newEducation: Education = {
      institution: "",
      degree: "",
      field: "",
      graduation_date: "",
      gpa: "",
    };
    onChange([...data, newEducation]);
  };

  const removeEducation = (index: number) => {
    const updated = data.filter((_: unknown, i: number) => i !== index);
    onChange(updated);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            {t("Education")}
          </h3>
          <p className="text-sm text-gray-500">
            {t("Add your education details")}
          </p>
        </div>
        <button
          onClick={addEducation}
          className="flex items-center gap-2 px-3 py-1 text-sm !bg-purple-100 !text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
        >
          <Plus className="size-4" />
          {t("Add Education")}
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>{t("No education added yet.")}</p>
          <p className="text-sm">
            {t(`Click "Add Education" to get started.`)}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((_, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg space-y-3"
            >
              <div className="flex justify-between items-center">
                <h4 className="text-base font-medium text-gray-900">
                  {t("Education")} #{index + 1}
                </h4>
                <Button
                  onClick={() => removeEducation(index)}
                  className="!text-red-500  !border-red-400"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>

              <div className="gap-3 grid md:grid-cols-2">
                <Form.Item
                  name={["education", index, "institution"]}
                  label={
                    <div className="flex gap-2 items-center">
                      <Building2 className="size-4" />
                      {t("Institution Name")}
                    </div>
                  }
                  className="text-[14px] font-normal leading-[22px] text-black/85"
                  rules={[
                    {
                      required: true,
                      message: t("this_field_is_required"),
                    },
                  ]}
                  required={false}
                >
                  <Input size="large" placeholder={t("Institution Name")} />
                </Form.Item>

                <Form.Item
                  name={["education", index, "degree"]}
                  label={
                    <div className="flex gap-2 items-center">
                      <BriefcaseBusiness className="size-4" />
                      {t("Degree")}
                    </div>
                  }
                  className="text-[14px] font-normal leading-[22px] text-black/85"
                  rules={[
                    {
                      required: true,
                      message: t("this_field_is_required"),
                    },
                  ]}
                  required={false}
                >
                  <Input size="large" placeholder={t("Degree")} />
                </Form.Item>

                <Form.Item
                  name={["education", index, "field"]}
                  label={
                    <div className="flex gap-2 items-center">
                      <BriefcaseBusiness className="size-4" />
                      {t("Field of Study")}
                    </div>
                  }
                  className="text-[14px] font-normal leading-[22px] text-black/85"
                  rules={[
                    {
                      required: true,
                      message: t("this_field_is_required"),
                    },
                  ]}
                  required={false}
                >
                  <Input size="large" placeholder={t("Field of Study")} />
                </Form.Item>

                <Form.Item
                  name={["education", index, "graduation_date"]}
                  label={
                    <div className="flex gap-2 items-center">
                      <CalendarDays className="size-4" />
                      {t("Graduation Date")}
                    </div>
                  }
                  className="text-[14px] font-normal leading-[22px] text-black/85"
                  rules={[
                    {
                      required: true,
                      message: t("this_field_is_required"),
                    },
                  ]}
                  required={false}
                >
                  <DatePicker
                    size="large"
                    className="w-full"
                    picker="month"
                    format="MM/YYYY"
                  />
                </Form.Item>
              </div>
              <Form.Item
                name={["education", index, "gpa"]}
                label={
                  <div className="flex gap-2 items-center">
                    <BriefcaseBusiness className="size-4" />
                    {t("GPA")}
                  </div>
                }
                className="text-[14px] font-normal leading-[22px] text-black/85"
              >
                <Input size="large" placeholder={t("GPA (optional)")} />
              </Form.Item>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
