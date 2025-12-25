import { useState, useEffect, useRef } from "react";
import { Button, Tag, Collapse } from "antd";
import { Check, X, Sparkles } from "lucide-react";
import type { Resume } from "@/lib/type";
import { ResumePreview } from "./ResumePreview";
import { useTranslation } from "react-i18next";

const { Panel } = Collapse;

type TailoredSection = {
  section: string;
  title: string;
  original: string;
  optimized: string;
  changes: string[];
};

type TailoredInfo = {
  language: string;
  matchedPosition?: string;
  summary: {
    original: string;
    optimized: string;
  };
  sections: TailoredSection[];
  overallSuggestions: string[];
};

type SectionDecision = {
  [key: string]: "accepted" | "rejected" | "pending";
};

interface TailoredResumePreviewProps {
  baseResume: Resume;
  tailoredInfo: TailoredInfo;
  template?: string;
  accentColor?: string;
  classes?: string;
  onResumeChange: (resume: Resume) => void;
}

export const TailoredResumePreview = ({
  baseResume,
  tailoredInfo,
  template = "classic",
  accentColor = "#3B82F6",
  classes,
  onResumeChange,
}: TailoredResumePreviewProps) => {
  const { t } = useTranslation();
  const [decisions, setDecisions] = useState<SectionDecision>({});
  const [currentResume, setCurrentResume] = useState<Resume>(baseResume);
  const onResumeChangeRef = useRef(onResumeChange);

  // Update ref when callback changes
  useEffect(() => {
    onResumeChangeRef.current = onResumeChange;
  }, [onResumeChange]);

  // Initialize decisions as "pending" for all sections
  useEffect(() => {
    const initialDecisions: SectionDecision = {};
    if (tailoredInfo.summary) {
      initialDecisions["summary"] = "pending";
    }
    tailoredInfo.sections.forEach((section) => {
      initialDecisions[section.section] = "pending";
    });
    setDecisions(initialDecisions);
  }, [tailoredInfo]);

  // Update resume when decisions change
  useEffect(() => {
    let updatedResume = { ...baseResume };

    // Apply summary if accepted
    if (decisions["summary"] === "accepted" && tailoredInfo.summary) {
      updatedResume.professional_summary = tailoredInfo.summary.optimized;
    }

    // Apply sections if accepted
    tailoredInfo.sections.forEach((section) => {
      const decision = decisions[section.section];
      if (decision === "accepted") {
        // Apply optimized content based on section type
        switch (section.section) {
          case "summary":
            updatedResume.professional_summary = section.optimized;
            break;
          case "skills":
            const optimizedSkills = section.optimized
              .split(/[,;\n]/)
              .map((s) => s.trim())
              .filter(Boolean);
            if (optimizedSkills.length) {
              updatedResume.skills = optimizedSkills;
            }
            break;
          case "experience":
            // For experience, we need to parse and update specific experience items
            // This is more complex, so we'll handle it differently
            // For now, we'll just update the description if it's a single experience
            if (updatedResume.experience && updatedResume.experience.length > 0) {
              updatedResume.experience = [...updatedResume.experience];
              // Try to match and update based on content
              const expIndex = updatedResume.experience.findIndex(
                (exp) => exp.description === section.original
              );
              if (expIndex >= 0) {
                updatedResume.experience[expIndex] = {
                  ...updatedResume.experience[expIndex],
                  description: section.optimized,
                };
              }
            }
            break;
          case "projects":
            if (updatedResume.project && updatedResume.project.length > 0) {
              updatedResume.project = [...updatedResume.project];
              const projIndex = updatedResume.project.findIndex(
                (proj) => proj.description === section.original
              );
              if (projIndex >= 0) {
                updatedResume.project[projIndex] = {
                  ...updatedResume.project[projIndex],
                  description: section.optimized,
                };
              }
            }
            break;
          case "education":
            if (updatedResume.education && updatedResume.education.length > 0) {
              updatedResume.education = [...updatedResume.education];
              // Education updates are less common, but we can handle field updates
            }
            break;
        }
      }
    });

    setCurrentResume(updatedResume);
    onResumeChangeRef.current(updatedResume);
  }, [decisions, baseResume, tailoredInfo]);

  const handleAccept = (sectionKey: string) => {
    setDecisions((prev) => ({ ...prev, [sectionKey]: "accepted" }));
  };

  const handleReject = (sectionKey: string) => {
    setDecisions((prev) => ({ ...prev, [sectionKey]: "rejected" }));
  };

  const renderChangeSection = (
    sectionKey: string,
    title: string,
    original: string,
    optimized: string,
    changes: string[]
  ) => {
    const decision = decisions[sectionKey] || "pending";
    const isAccepted = decision === "accepted";
    const isRejected = decision === "rejected";

    if (isRejected) {
      return null; // Don't show rejected sections
    }

    return (
      <div
        key={sectionKey}
        className={`mb-4 p-4 rounded-lg border-2 ${
          isAccepted
            ? "border-green-300 bg-green-50"
            : "border-purple-300 bg-purple-50/30"
        }`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="size-4 text-purple-600" />
              <h4 className="font-semibold text-slate-800">{title}</h4>
              {isAccepted && (
                <Tag color="green" className="ml-2">
                  {t("Accepted")}
                </Tag>
              )}
            </div>
            {changes.length > 0 && (
              <div className="mb-2">
                <p className="text-xs font-medium text-slate-600 mb-1">
                  {t("Changes")}:
                </p>
                <ul className="text-xs text-slate-600 list-disc list-inside">
                  {changes.map((change, idx) => (
                    <li key={idx}>{change}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {!isAccepted && (
            <div className="flex gap-2 ml-4">
              <Button
                size="small"
                type="primary"
                icon={<Check className="size-3" />}
                className="!bg-green-600 hover:!bg-green-700"
                onClick={() => handleAccept(sectionKey)}
              >
                {t("Accept")}
              </Button>
              <Button
                size="small"
                danger
                icon={<X className="size-3" />}
                onClick={() => handleReject(sectionKey)}
              >
                {t("Reject")}
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1">
              {t("Original")}:
            </p>
            <div className="p-2 bg-slate-100 rounded text-sm text-slate-700 border border-slate-200">
              {original || t("NoContent")}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1">
              {t("AI Optimized")}:
            </p>
            <div
              className={`p-2 rounded text-sm border ${
                isAccepted
                  ? "bg-green-100 text-green-900 border-green-300"
                  : "bg-blue-50 text-blue-900 border-blue-200"
              }`}
            >
              {optimized || t("NoContent")}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const hasPendingChanges = Object.values(decisions).some(
    (d) => d === "pending"
  );
  const hasAcceptedChanges = Object.values(decisions).some(
    (d) => d === "accepted"
  );

  return (
    <div className="w-full">
      {/* Changes Panel */}
      {hasPendingChanges && (
        <div className="mb-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="size-5 text-purple-600" />
            <h3 className="font-semibold text-slate-800">
              {t("AI Suggested Changes")}
            </h3>
          </div>
          <Collapse defaultActiveKey={["summary"]} ghost>
            {/* Summary Section */}
            {tailoredInfo.summary &&
              decisions["summary"] !== "rejected" && (
                <Panel
                  header={
                    <span className="font-medium">
                      {t("Professional Summary")}
                      {decisions["summary"] === "accepted" && (
                        <Tag color="green" className="ml-2">
                          {t("Accepted")}
                        </Tag>
                      )}
                    </span>
                  }
                  key="summary"
                >
                  {renderChangeSection(
                    "summary",
                    t("Professional Summary"),
                    tailoredInfo.summary.original,
                    tailoredInfo.summary.optimized,
                    []
                  )}
                </Panel>
              )}

            {/* Other Sections */}
            {tailoredInfo.sections.map((section, idx) => {
              const decision = decisions[section.section] || "pending";
              if (decision === "rejected") return null;

              return (
                <Panel
                  key={`section-${idx}`}
                  header={
                    <span className="font-medium">
                      {section.title || section.section}
                      {decision === "accepted" && (
                        <Tag color="green" className="ml-2">
                          {t("Accepted")}
                        </Tag>
                      )}
                    </span>
                  }
                >
                  {renderChangeSection(
                    section.section,
                    section.title || section.section,
                    section.original,
                    section.optimized,
                    section.changes
                  )}
                </Panel>
              );
            })}
          </Collapse>

          {/* Overall Suggestions */}
          {tailoredInfo.overallSuggestions.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs font-medium text-blue-900 mb-2">
                {t("Overall Suggestions")}:
              </p>
              <ul className="text-xs text-blue-800 list-disc list-inside space-y-1">
                {tailoredInfo.overallSuggestions.map((suggestion, idx) => (
                  <li key={idx}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Resume Preview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
        <div className="mb-2">
          {hasAcceptedChanges && (
            <div className="flex items-center gap-2 mb-2">
              <Tag color="green" className="text-xs">
                {t("Preview with Accepted Changes")}
              </Tag>
            </div>
          )}
        </div>
        <ResumePreview
          data={currentResume}
          template={template}
          accentColor={accentColor}
          classes={classes}
        />
      </div>
    </div>
  );
};

