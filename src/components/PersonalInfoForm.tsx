import { onlyLettersRegex } from "@/lib/constant";
import type { PersonalInfo } from "@/lib/type";
import { DatePicker, Form, Input, Select } from "antd";
import {
  BriefcaseBusiness,
  CalendarDays,
  Globe,
  Library,
  Mail,
  MapPin,
  Phone,
  User,
  VenusAndMars,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { AllowedCharsInput } from "./AllowedCharsInput";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { isValidPhoneNumber } from "@/lib/phone-utils";
import { PhoneInput } from "./PhoneInput";
import { UploadImage } from "./UploadImage";
import { fileApi } from "@/lib/api";

const genderOptions = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];
const urlRegex = /^(https?:\/\/|www\.)[^\s/$.?#].[^\s]*$/i;

export const PersonalInfoForm = ({
  data,
  onChange,
  removeBackground,
  setRemoveBackground,
}: {
  data: PersonalInfo;
  onChange: (value: PersonalInfo) => void;
  removeBackground: boolean;
  setRemoveBackground: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { t } = useTranslation();

  const [errorPhone, setErrorPhone] = useState(false);

  const handleChange = (field: string, value: string | File | null) => {
    if (field === "image") {
      if (!value) {
        onChange({ ...data, image: "" });
        return;
      }
      if (value instanceof File) {
        // Upload image to backend and save URL
        fileApi
          .uploadImage(value)
          .then((url) => {
            onChange({ ...data, image: url });
          })
          .catch(() => {
            // fallback: do nothing or keep old image
          });
        return;
      }
    }

    onChange({ ...data, [field]: value as string });
  };

  const validateAge = (_: unknown, value: Dayjs) => {
    if (!value) return Promise.reject(new Error(t("this_field_is_required")));
    const age = dayjs().diff(value, "year");
    if (age < 18) {
      return Promise.reject(new Error(t("age_must_be_at_least_18_years")));
    }
    return Promise.resolve();
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900">
        {t("personalInfomation")}
      </h3>
      <p className="text-sm text-gray-600">
        {t("getStartedWithThePersonalInfomation")}
      </p>
      <div className="mb-4">
        <UploadImage
          imageFile={data.image || null}
          onChange={(file: File | string | null) => {
            handleChange("image", file);
          }}
          removeBackground={removeBackground}
          setRemoveBackground={setRemoveBackground}
        />
      </div>

      <Form.Item
        label={
          <div className="flex gap-2 items-center">
            <User className="size-5" />
            {t("name")}
            <span className="text-red-500">*</span>
          </div>
        }
        name={["personal_info", "full_name"]}
        className="text-[14px] font-normal leading-[22px] text-black/85"
        rules={[
          {
            required: true,
            message: t("this_field_is_required"),
          },
          {
            pattern: onlyLettersRegex,
            message: t("only_letters_are_allowed"),
          },
        ]}
        preserve={false}
        required={false}
      >
        <AllowedCharsInput
          // Cho phép chữ cái Unicode + khoảng trắng (hỗ trợ tiếng Việt có dấu)
          allowedPattern={onlyLettersRegex}
          size="large"
          placeholder={t("input_name")}
          maxLength={50}
        />
      </Form.Item>

      <Form.Item
        name={["personal_info", "birthDate"]}
        label={
          <div className="flex gap-2 items-center">
            <CalendarDays className="size-5" />
            {t("date_of_birth")}
            <span className="text-red-500">*</span>
          </div>
        }
        rules={[{ validator: validateAge }]}
        required={false}
        validateTrigger={["onBlur", "onChange"]}
        className="text-[14px] font-normal leading-[22px] text-black/85"
      >
        <DatePicker size="large" className="w-full" format={"DD/MM/YYYY"} />
      </Form.Item>

      <Form.Item
        name={["personal_info", "gender"]}
        label={
          <div className="flex gap-2 items-center">
            <VenusAndMars className="size-5" />
            {t("gender")}
            <span className="text-red-500">*</span>
          </div>
        }
        rules={[{ required: true, message: t("this_field_is_required") }]}
        required={false}
        validateTrigger={["onBlur", "onChange"]}
        className="text-[14px] font-normal leading-[22px] text-black/85"
      >
        <Select
          size="large"
          placeholder={t("select_gender")}
          options={genderOptions}
        />
      </Form.Item>

      <Form.Item
        label={
          <div className="flex gap-2 items-center">
            <Mail className="size-5" />
            {t("email")}
            <span className="text-red-500">*</span>
          </div>
        }
        name={["personal_info", "email"]}
        className="text-[14px] font-normal leading-[22px] text-black/85"
        validateTrigger={["onBlur", "onChange"]}
        rules={[
          {
            type: "email",
            message: t("please_enter_a_valid_email_address"),
          },
          {
            required: true,
            message: t("this_field_is_required"),
          },
        ]}
        required={false}
      >
        <AllowedCharsInput
          allowedPattern={/^[A-Za-z0-9@._-]+$/}
          size="large"
          placeholder={t("input_email")}
        />
      </Form.Item>

      <Form.Item
        label={
          <div className="flex gap-2 items-center">
            <Phone className="size-5" />
            {t("phone_number")}
            <span className="text-red-500">*</span>
          </div>
        }
        name={["personal_info", "phone"]}
        rules={[
          {
            validator: async (_, value) => {
              if (!value) return Promise.reject(t("this_field_is_required"));
              const isValid = isValidPhoneNumber(value);
              if (!isValid) {
                setErrorPhone(true);
                return Promise.reject(
                  t("please_enter_a_valid_phone_number_in_the_correct_format")
                );
              }
              setErrorPhone(false);
              return Promise.resolve();
            },
          },
        ]}
        required={false}
        validateTrigger={["onBlur", "onChange"]}
      >
        <PhoneInput
          className="flex-1"
          placeholder={t("input_phone_number")}
          error={errorPhone}
        />
      </Form.Item>

      <Form.Item
        label={
          <div className="flex gap-2 items-center">
            <MapPin className="size-5" />
            {t("location")}
            <span className="text-red-500">*</span>
          </div>
        }
        name={["personal_info", "location"]}
        className="text-[14px] font-normal leading-[22px] text-black/85"
        rules={[
          {
            required: true,
            message: t("this_field_is_required"),
          },
        ]}
        required={false}
      >
        <AllowedCharsInput
          // Cho phép chữ cái Unicode, số, dấu chấm, phẩy, khoảng trắng (hỗ trợ tiếng Việt có dấu)
          allowedPattern={/^[\p{L}0-9.,\s]+$/u}
          size="large"
          placeholder={t("input_location")}
          maxLength={200}
        />
      </Form.Item>

      <Form.Item
        label={
          <div className="flex gap-2 items-center">
            <BriefcaseBusiness className="size-5" />
            {t("profession")}
            <span className="text-red-500">*</span>
          </div>
        }
        name={["personal_info", "profession"]}
        className="text-[14px] font-normal leading-[22px] text-black/85"
        rules={[
          {
            required: true,
            message: t("this_field_is_required"),
          },
        ]}
        required={false}
      >
        <AllowedCharsInput
          // Cho phép chữ cái Unicode, số, dấu chấm, phẩy, khoảng trắng (hỗ trợ tiếng Việt có dấu)
          allowedPattern={/^[\p{L}0-9.,\s]+$/u}
          size="large"
          placeholder={t("input_profession")}
          maxLength={200}
        />
      </Form.Item>

      <Form.Item
        label={
          <div className="flex gap-2 items-center">
            <Library className="size-5" />
            {t("Language")}
            <span className="text-red-500">*</span>
          </div>
        }
        name={["personal_info", "language"]}
        required={false}
      >
        <Input size="large" placeholder={t("Input language")} />
      </Form.Item>

      <Form.Item
        label={
          <div className="flex gap-2 items-center">
            <Globe className="size-5" />
            {t("website")}
            <span className="text-red-500">*</span>
          </div>
        }
        name={["personal_info", "website"]}
        rules={[
          {
            validator: async (_, url) => {
              if (!url)
                return Promise.reject(new Error(t("this_field_is_required")));
              if (url && !urlRegex.test(url))
                return Promise.reject(
                  new Error(t("invalid_link_please_try_again"))
                );
              return Promise.resolve();
            },
          },
        ]}
        required={false}
      >
        <Input size="large" placeholder={t("input_website")} />
      </Form.Item>
    </div>
  );
};
