import { useState, useEffect, useRef } from "react";
import { Button, Tag, Collapse } from "antd";
import { Check, X, Sparkles } from "lucide-react";
import type { Resume } from "@/lib/type";
import { ResumePreview } from "./ResumePreview";
import { useTranslation } from "react-i18next";
import { formatResumeText } from "@/lib/utils";
import { MarkdownText } from "./MarkdownText";

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
      updatedResume.professional_summary = formatResumeText(tailoredInfo.summary.optimized);
    }

    // Apply sections if accepted
    tailoredInfo.sections.forEach((section) => {
      const decision = decisions[section.section];
      if (decision === "accepted") {
        // Apply optimized content based on section type
        switch (section.section) {
          case "summary":
            updatedResume.professional_summary = formatResumeText(section.optimized);
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
            // Update experience descriptions with optimized content
            if (updatedResume.experience && updatedResume.experience.length > 0) {
              updatedResume.experience = [...updatedResume.experience];
              
              // If original is empty, this is a new section - update first experience
              if (!section.original || section.original.trim() === "") {
                if (updatedResume.experience.length > 0) {
                  updatedResume.experience[0] = {
                    ...updatedResume.experience[0],
                    description: formatResumeText(section.optimized),
                  };
                }
              } else {
                // Try to match by partial content match (more flexible)
                const originalPreview = section.original.slice(0, 100);
                const expIndex = updatedResume.experience.findIndex(
                  (exp) => 
                    exp.description && 
                    (exp.description.includes(originalPreview) || 
                     originalPreview.includes(exp.description.slice(0, 50)))
                );
                
                if (expIndex >= 0) {
                  updatedResume.experience[expIndex] = {
                    ...updatedResume.experience[expIndex],
                    description: formatResumeText(section.optimized),
                  };
                } else {
                  // If no match found, update first experience
                  updatedResume.experience[0] = {
                    ...updatedResume.experience[0],
                    description: formatResumeText(section.optimized),
                  };
                }
              }
            } else {
              // No existing experiences, create new one
              updatedResume.experience = [{
                company: "",
                position: "",
                description: formatResumeText(section.optimized),
                is_current: false,
                start_date: "",
                end_date: "",
              }];
            }
            break;
          case "projects":
            if (updatedResume.project && updatedResume.project.length > 0) {
              updatedResume.project = [...updatedResume.project];
              
              if (!section.original || section.original.trim() === "") {
                // New section
                updatedResume.project[0] = {
                  ...updatedResume.project[0],
                  description: section.optimized,
                };
              } else {
                // Try flexible matching
                const originalPreview = section.original.slice(0, 100);
                const projIndex = updatedResume.project.findIndex(
                  (proj) => 
                    proj.description && 
                    (proj.description.includes(originalPreview) || 
                     originalPreview.includes(proj.description.slice(0, 50)))
                );
                
                if (projIndex >= 0) {
                  updatedResume.project[projIndex] = {
                    ...updatedResume.project[projIndex],
                    description: formatResumeText(section.optimized),
                  };
                } else {
                  updatedResume.project[0] = {
                    ...updatedResume.project[0],
                    description: formatResumeText(section.optimized),
                  };
                }
              }
            } else {
              // No existing projects, create new one
              updatedResume.project = [{
                name: "",
                description: formatResumeText(section.optimized),
                technologies: [],
              }];
            }
            break;
          case "education":
            if (updatedResume.education && updatedResume.education.length > 0) {
              updatedResume.education = [...updatedResume.education];
              
              if (!section.original || section.original.trim() === "") {
                // New section - update field
                updatedResume.education[0] = {
                  ...updatedResume.education[0],
                  field: section.optimized,
                };
              } else {
                // Try to match by field or institution
                const originalPreview = section.original.slice(0, 50);
                const eduIndex = updatedResume.education.findIndex(
                  (edu) => 
                    (edu.field && edu.field.includes(originalPreview)) ||
                    (edu.institution && edu.institution.includes(originalPreview))
                );
                
                if (eduIndex >= 0) {
                  // Update field with optimized content
                  updatedResume.education[eduIndex] = {
                    ...updatedResume.education[eduIndex],
                    field: formatResumeText(section.optimized),
                  };
                } else {
                  // Update first education entry
                  updatedResume.education[0] = {
                    ...updatedResume.education[0],
                    field: formatResumeText(section.optimized),
                  };
                }
              }
            } else {
              // No existing education, create new entry
              updatedResume.education = [{
                institution: "",
                degree: "",
                field: formatResumeText(section.optimized),
                graduation_date: "",
                gpa: "",
              }];
            }
            break;
          case "certifications":
            // Initialize certifications array if it doesn't exist
            if (!updatedResume.certifications) {
              updatedResume.certifications = [];
            }
            
            if (!section.original || section.original.trim() === "") {
              // New section - add new certification
              const certName = section.optimized.split('\n')[0]?.trim() || section.optimized.slice(0, 100);
              updatedResume.certifications.push({
                name: certName,
                issuer: "",
                issueDate: undefined,
                expiryDate: undefined,
                credentialId: undefined,
                credentialUrl: undefined,
              });
            } else {
              // Try to match existing certification
              const originalPreview = section.original.slice(0, 50);
              const certIndex = updatedResume.certifications.findIndex(
                (cert) => cert.name && cert.name.includes(originalPreview)
              );
              
              if (certIndex >= 0) {
                // Update existing certification
                const certName = section.optimized.split('\n')[0]?.trim() || section.optimized.slice(0, 200);
                updatedResume.certifications[certIndex] = {
                  ...updatedResume.certifications[certIndex],
                  name: certName,
                };
              } else {
                // Add as new certification
                const certName = section.optimized.split('\n')[0]?.trim() || section.optimized.slice(0, 100);
                updatedResume.certifications.push({
                  name: certName,
                  issuer: "",
                  issueDate: undefined,
                  expiryDate: undefined,
                  credentialId: undefined,
                  credentialUrl: undefined,
                });
              }
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
              <MarkdownText content={original || t("NoContent")} />
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
              <MarkdownText content={optimized || t("NoContent")} />
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

