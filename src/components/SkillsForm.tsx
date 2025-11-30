import { Button, Form, Input } from "antd";
import { Plus, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const SkillsForm = ({
  data,
  onChange,
}: {
  data: string[];
  onChange: (value: string[]) => void;
}) => {
  const { t } = useTranslation();
  const [newSkill, setNewSkill] = useState("");
  const form = Form.useFormInstance();

  // Đảm bảo data luôn là array
  const skills = Array.isArray(data) ? data : [];

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updatedSkills = [...skills, newSkill.trim()];
      onChange(updatedSkills);
      form.setFieldValue("skills", updatedSkills);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (indexToRemove: number) => {
    const updatedSkills = skills.filter((_, index) => index !== indexToRemove);
    onChange(updatedSkills);
    form.setFieldValue("skills", updatedSkills);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          {t("Skills")}
        </h3>
        <p className="text-sm text-gray-500">
          {t("Add your technical and soft skills")}
        </p>
      </div>

      <Form.Item name="skills" noStyle>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Form.Item name="newSkill" noStyle>
              <Input
                placeholder={t(
                  "Enter a skill (e.g., JavaScript, Project Management"
                )}
                className="flex-1"
                size="large"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
              />
            </Form.Item>
            <Button
              disabled={!newSkill.trim()}
              onClick={handleAddSkill}
              className="!bg-purple-100 !text-purple-700"
              size="large"
            >
              <Plus className="size-4" />
            </Button>
          </div>

          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(index)}
                    className="ml-1 hover:text-purple-900 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <Sparkles className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p>{t("No skills added yet.")}</p>
              <p>{t("Add your technical and soft skills above")}</p>
            </div>
          )}
        </div>
      </Form.Item>

      <div className="bg-purple-50 p-3 rounded-lg">
        <p className="text-sm text-purple-800">
          <strong>{t("Tip: ")}</strong>
          {t(
            "Add 8-12 relevant skills. Include both technical skills (programming languages, tools) and soft skills (leadership, communication)"
          )}
        </p>
      </div>
    </div>
  );
};
