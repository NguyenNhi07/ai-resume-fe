import type { Project } from "@/lib/type";
import { Button, Form, Input, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { FolderIcon, Plus, Trash2, Code, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

export const ProjectForm = ({
  data,
  onChange,
}: {
  data: Project[];
  onChange: (value: Project[]) => void;
}) => {
  const { t } = useTranslation();

  const addProject = () => {
    const newProject: Project = {
      name: "",
      description: "",
      technologies: [],
    };
    onChange([...data, newProject]);
  };

  const removeProject = (index: number) => {
    const updated = data.filter((_: unknown, i: number) => i !== index);
    onChange(updated);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            {t("Projects")}
          </h3>
          <p className="text-sm text-gray-500">{t("Add your projects")}</p>
        </div>
        <button
          onClick={addProject}
          className="flex items-center gap-2 px-3 py-1 text-sm !bg-purple-100 !text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
        >
          <Plus className="size-4" />
          {t("Add Project")}
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FolderIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>{t("No projects added yet.")}</p>
          <p className="text-sm">{t(`Click "Add Project" to get started.`)}</p>
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
                  {t("Project")} #{index + 1}
                </h4>
                <Button
                  onClick={() => removeProject(index)}
                  className="!text-red-500  !border-red-400"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>

              <Form.Item
                name={["project", index, "name"]}
                label={
                  <div className="flex gap-2 items-center">
                    <FolderIcon className="size-4" />
                    {t("Project Name")}
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
                <Input size="large" placeholder={t("Project Name")} />
              </Form.Item>

              <Form.Item
                name={["project", index, "description"]}
                label={
                  <div className="!flex !items-center !justify-between gap-4">
                    <span className="text-sm font-medium text-gray-700">
                      {t("Project Description")}
                    </span>
                    <button
                      type="button"
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 !text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                    >
                      <Sparkles className="w-3 h-3" />
                      {t("Enhance with AI")}
                    </button>
                  </div>
                }
                className="text-[14px] font-normal leading-[22px] text-black/85 w-full"
                rules={[
                  {
                    required: true,
                    message: t("this_field_is_required"),
                  },
                ]}
                required={false}
              >
                <TextArea
                  rows={4}
                  placeholder={t("Describe your project...")}
                />
              </Form.Item>

              <Form.Item
                name={["project", index, "technologies"]}
                label={
                  <div className="flex gap-2 items-center">
                    <Code className="size-4" />
                    {t("Technologies")}
                  </div>
                }
                className="text-[14px] font-normal leading-[22px] text-black/85"
              >
                <Select
                  mode="tags"
                  size="large"
                  placeholder={t("Add technologies (press Enter to add)")}
                  tokenSeparators={[","]}
                />
              </Form.Item>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
