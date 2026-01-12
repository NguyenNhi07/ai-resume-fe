import type { Certification } from "@/lib/type";
import { Button, DatePicker, Form, Input } from "antd";
import {
  Award,
  Building2,
  CalendarDays,
  ExternalLink,
  Plus,
  Trash2,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export const CertificationForm = ({
  data,
  onChange,
}: {
  data: Certification[];
  onChange: (value: Certification[]) => void;
}) => {
  const { t } = useTranslation();

  const addCertification = () => {
    const newCertification: Certification = {
      name: "",
      issuer: "",
      issueDate: "",
      expiryDate: "",
      credentialUrl: "",
    };
    onChange([...data, newCertification]);
  };

  const removeCertification = (index: number) => {
    const updated = data.filter((_: unknown, i: number) => i !== index);
    onChange(updated);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Award className="size-5" />
            {t("Certifications")}
          </h3>
          <p className="text-sm text-gray-500">
            {t("Add your certifications and credentials")}
          </p>
        </div>
        <button
          onClick={addCertification}
          className="flex items-center gap-2 px-3 py-1 text-sm !bg-purple-100 !text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
        >
          <Plus className="size-4" />
          {t("Add Certification")}
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>{t("No certifications added yet.")}</p>
          <p className="text-sm">
            {t(`Click "Add Certification" to get started.`)}
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
                  {t("Certification")} #{index + 1}
                </h4>
                <Button
                  onClick={() => removeCertification(index)}
                  className="!text-red-500 !border-red-400"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>

              <div className="gap-3 grid md:grid-cols-2">
                <Form.Item
                  name={["certifications", index, "name"]}
                  label={
                    <div className="flex gap-2 items-center">
                      <Award className="size-4" />
                      {t("Certification Name")}
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
                  <Input size="large" placeholder={t("Certification Name")} />
                </Form.Item>

                <Form.Item
                  name={["certifications", index, "issuer"]}
                  label={
                    <div className="flex gap-2 items-center">
                      <Building2 className="size-4" />
                      {t("Issuing Organization")}
                    </div>
                  }
                  className="text-[14px] font-normal leading-[22px] text-black/85"
                >
                  <Input size="large" placeholder={t("Issuing Organization")} />
                </Form.Item>

                <Form.Item
                  name={["certifications", index, "issueDate"]}
                  label={
                    <div className="flex gap-2 items-center">
                      <CalendarDays className="size-4" />
                      {t("Issue Date")}
                    </div>
                  }
                  className="text-[14px] font-normal leading-[22px] text-black/85"
                >
                  <DatePicker
                    size="large"
                    className="w-full"
                    picker="month"
                    format="MM/YYYY"
                    placeholder={t("Issue Date")}
                  />
                </Form.Item>

                <Form.Item
                  name={["certifications", index, "expiryDate"]}
                  label={
                    <div className="flex gap-2 items-center">
                      <CalendarDays className="size-4" />
                      {t("Expiry Date")}
                    </div>
                  }
                  className="text-[14px] font-normal leading-[22px] text-black/85"
                >
                  <DatePicker
                    size="large"
                    className="w-full"
                    picker="month"
                    format="MM/YYYY"
                    placeholder={t("Expiry Date")}
                  />
                </Form.Item>

                {/* <Form.Item
                  name={["certifications", index, "credentialId"]}
                  label={
                    <div className="flex gap-2 items-center">
                      <Hash className="size-4" />
                      {t("Credential ID")}
                    </div>
                  }
                  className="text-[14px] font-normal leading-[22px] text-black/85"
                >
                  <Input size="large" placeholder={t("Credential ID")} />
                </Form.Item> */}

                <Form.Item
                  name={["certifications", index, "credentialUrl"]}
                  label={
                    <div className="flex gap-2 items-center">
                      <ExternalLink className="size-4" />
                      {t("Credential URL")}
                    </div>
                  }
                  className="text-[14px] font-normal leading-[22px] text-black/85"
                >
                  <Input size="large" placeholder={t("Credential URL")} />
                </Form.Item>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
