import { Popover } from "antd";
import { Check, Layout } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const TemplateSelector = ({
  selectedTemplate,
  onChange,
}: {
  selectedTemplate: string;
  onChange: (value: string) => void;
}) => {
  const { t } = useTranslation();

  const templates = [
    {
      id: "classic",
      name: t("Classic"),
      preview: t(
        "Traditional Times New Roman layout with circular avatar and bordered sections"
      ),
    },
    {
      id: "modern",
      name: t("Modern"),
      preview: t(
        "Bold gradient header with avatar and modern bullet point design"
      ),
    },
    {
      id: "minimal",
      name: t("Minimal"),
      preview: t(
        "Ultra-clean design with circular avatar and modern sans-serif typography"
      ),
    },
    {
      id: "professional",
      name: t("Professional"),
      preview: t(
        "Clean and professional design with modern sans-serif typography"
      ),
    },
    {
      id: "bold",
      name: t("Bold"),
      preview: t("Bold and modern design with modern sans-serif typography"),
    },
    {
      id: "minimal-image",
      name: t("Minimal Image"),
      preview: t(
        "Clean two-column layout with prominent profile image header"
      ),
    },
    {
      id: "sidebar",
      name: t("Sidebar"),
      preview: t(
        "Two-column layout with colored sidebar for profile and skills"
      ),
    },
    {
      id: "timeline",
      name: t("Timeline"),
      preview: t(
        "Vertical timeline focus on work experience and education"
      ),
    },
    {
      id: "compact",
      name: t("Compact"),
      preview: t(
        "Single-column compact layout optimized to fit more content on one page"
      ),
    },
    {
      id: "elegant",
      name: t("Elegant"),
      preview: t(
        "Bordered card-style layout with subtle accents and serif typography"
      ),
    },
  ];

  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Popover
        open={open}
        onOpenChange={setOpen}
        content={
          <div className="w-xs p-3 mt-2 space-y-3 max-h-[500px] overflow-y-auto">
            {templates.map((template) => (
              <div
                onClick={() => {
                  onChange(template.id);
                }}
                className={`relative p-3 border rounded-md cursor-pointer transition-all ${
                  selectedTemplate === template.id
                    ? "border-purple-499 bg-purple-100"
                    : "border-gray-300 hover:border-gray-400 hover:bg-gray-100"
                }`}
                key={template.id}
              >
                {selectedTemplate === template.id && (
                  <div className="absolute top-2 right-2">
                    <div className="size-5 bg-purple-400 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-gray-800">{template.name}</h4>
                  <div className="mt-2 p-3 bg-purple-50 rounded text-xs text-gray-500 italic">
                    {template.preview}
                  </div>
                </div>
              </div>
            ))}
          </div>
        }
        trigger="click"
        className="cursor-pointer"
        arrow={false}
      >
        <div className="flex items-center gap-1 text-sm !text-purple-600 bg-gradient-to-br from-purple-50 to-purple-100 ring-purple-300 hover:ring transition-all px-3 py-2 rounded-lg">
          <Layout size={14} />{" "}
          <span className="max-sm:hidden">{t("Template")}</span>
        </div>
      </Popover>
    </div>
  );
};
