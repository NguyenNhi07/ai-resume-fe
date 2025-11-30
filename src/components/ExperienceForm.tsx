import type { Experience } from "@/lib/type";
import { DatePicker, Form, Input, Checkbox, Button } from "antd";
import {
    Briefcase,
    Plus,
    Sparkles,
    Trash2,
    Building2,
    BriefcaseBusiness,
    CalendarDays,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import TextArea from "antd/es/input/TextArea";

export const ExperienceForm = ({
    data,
    onChange,
}: {
    data: Experience[];
    onChange: (value: Experience[]) => void;
}) => {
    const { t } = useTranslation();

    const addExperience = () => {
        const newExperience: Experience = {
            company: "",
            position: "",
            start_date: "",
            end_date: "",
            description: "",
            is_current: false,
        };
        onChange([...data, newExperience]);
    };

    const removeExperience = (index: number) => {
        const updated = data.filter((_: unknown, i: number) => i !== index);
        onChange(updated);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                        {t("Professional Experience")}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {t("Add your job experience")}
                    </p>
                </div>
                <button
                    onClick={addExperience}
                    className="flex items-center gap-2 px-3 py-1 text-sm !bg-purple-100 !text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                >
                    <Plus className="size-4" />
                    {t("Add Experience")}
                </button>
            </div>

            {data.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>{t("No work experience added yet.")}</p>
                    <p className="text-sm">
                        {t(`Click "Add Experience" to get started.`)}
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
                                    Experience #{index + 1}
                                </h4>
                                <Button
                                    onClick={() => removeExperience(index)}
                                    className="!text-red-500  !border-red-400"
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            </div>

                            <div className="gap-3 grid md:grid-cols-2">
                                <Form.Item
                                    name={["experience", index, "company"]}
                                    label={
                                        <div className="flex gap-2 items-center">
                                            <Building2 className="size-4" />
                                            {t("Company Name")}
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
                                    <Input size="large" placeholder={t("Company Name")} />
                                </Form.Item>

                                <Form.Item
                                    name={["experience", index, "position"]}
                                    label={
                                        <div className="flex gap-2 items-center">
                                            <BriefcaseBusiness className="size-4" />
                                            {t("Job Title")}
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
                                    <Input size="large" placeholder={t("Job Title")} />
                                </Form.Item>

                                <Form.Item
                                    name={["experience", index, "start_date"]}
                                    label={
                                        <div className="flex gap-2 items-center">
                                            <CalendarDays className="size-4" />
                                            {t("Start Date")}
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

                                <Form.Item
                                    noStyle
                                    shouldUpdate={(prevValues, currentValues) =>
                                        prevValues?.experience?.[index]?.is_current !==
                                        currentValues?.experience?.[index]?.is_current
                                    }
                                >
                                    {({ getFieldValue }) => {
                                        const isCurrent = getFieldValue([
                                            "experience",
                                            index,
                                            "is_current",
                                        ]);
                                        return (
                                            <Form.Item
                                                name={["experience", index, "end_date"]}
                                                label={
                                                    <div className="flex gap-2 items-center">
                                                        <CalendarDays className="size-4" />
                                                        {t("End Date")}
                                                    </div>
                                                }
                                                className="text-[14px] font-normal leading-[22px] text-black/85"
                                            >
                                                <DatePicker
                                                    size="large"
                                                    className="w-full"
                                                    picker="month"
                                                    format="MM/YYYY"
                                                    disabled={isCurrent}
                                                />
                                            </Form.Item>
                                        );
                                    }}
                                </Form.Item>
                            </div>

                            <Form.Item
                                name={["experience", index, "is_current"]}
                                valuePropName="checked"
                                className="text-[14px] font-normal leading-[22px] text-black/85"
                                trigger="onChange"
                            >
                                <Checkbox>
                                    <span className="text-sm text-gray-700">
                                        {t("Currently working here")}
                                    </span>
                                </Checkbox>
                            </Form.Item>

                            <Form.Item
                                name={["experience", index, "description"]}
                                label={
                                    <div className="!flex !items-center !justify-between gap-4">
                                        <span className="text-sm font-medium text-gray-700">
                                            {t("Job Description")}
                                        </span>
                                        <button
                                            type="button"
                                            className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 !text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                                        >
                                            <Sparkles className="w-3 h-3" />
                                            Enhance with AI
                                        </button>
                                    </div>
                                }
                                className="text-[14px] font-normal leading-[22px] text-black/85 w-full"
                            >
                                <TextArea
                                    rows={4}
                                    placeholder={t(
                                        "Describe your key responsibilities and achievements..."
                                    )}
                                />
                            </Form.Item>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
