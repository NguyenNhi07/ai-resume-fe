import { ColorPicker } from "@/components/ColorPicker";
import { EducationForm } from "@/components/EducationForm";
import { ExperienceForm } from "@/components/ExperienceForm";
import { PersonalInfoForm } from "@/components/PersonalInfoForm";
import { ProfessionalSummaryForm } from "@/components/ProfessionalSummaryForm";
import { ProjectForm } from "@/components/ProjectForm";
import { ResumePreview } from "@/components/ResumePreview";
import ShareDialog from "@/components/ShareDialog";
import { SkillsForm } from "@/components/SkillsForm";
import { TemplateSelector } from "@/components/TemplateSelector";
import { profileDefault } from "@/lib/constant";
import type { Experience, Resume } from "@/lib/type";
import { dummyResumeData } from "@/lib/utils";
import { Button, Form, Modal, Popover, Select } from "antd";
import dayjs, { Dayjs } from "dayjs";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
  AlertCircle,
  ArrowLeftIcon,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  DownloadIcon,
  EyeIcon,
  FileDown,
  FileText,
  FolderIcon,
  GraduationCap,
  PrinterIcon,
  Share2Icon,
  Sparkles,
  User,
  UserCheck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

// Interface cho form data với dayjs object
interface FormResume
  extends Omit<
    Resume,
    "personal_info" | "experience" | "education" | "project"
  > {
  personal_info: Omit<Resume["personal_info"], "birthDate"> & {
    birthDate?: Dayjs;
  };
  experience?: Array<
    Omit<Experience, "start_date" | "end_date"> & {
      start_date?: Dayjs;
      end_date?: Dayjs;
    }
  >;
  education?: Array<
    Omit<Resume["education"][0], "graduation_date"> & {
      graduation_date?: Dayjs;
    }
  >;
  project?: Resume["project"];
}

export default function ResumeBuilder() {
  const { t } = useTranslation();
  const { resumeId } = useParams();
  const navigate = useNavigate();

  const fontOptions = [
    { value: "inter", label: "Inter" },
    { value: "times", label: "Times New Roman" },
    { value: "georgia", label: "Georgia" },
    { value: "arial", label: "Arial" },
    { value: "helvetica", label: "Helvetica / Helvetica Neue" },
    { value: "calibri", label: "Calibri" },
    { value: "garamond", label: "Garamond" },
    { value: "cambria", label: "Cambria" },
    { value: "roboto", label: "Roboto" },
    { value: "poppins", label: "Poppins" },
    { value: "mulish", label: "Mulish" },
    { value: "nunito", label: "Nunito" },
    { value: "montserrat", label: "Montserrat" },
  ];

  const [resumeData, setResumeData] = useState<Resume>({
    id: "",
    title: "",
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: "classic",
    accent_color: "#3B82F6",
    public: false,
    font_family: "inter",
  });

  const [form] = Form.useForm<FormResume>();
  const isFormInitialized = useRef(false);
  const currentResumeId = useRef(resumeId);
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAutoFillModal, setShowAutoFillModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const initialFormData = useRef<Resume | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [isAutoFilling, setIsAutoFilling] = useState(false);

  const loadExitstingResume = async () => {
    const resume = dummyResumeData.find((resume) => resume.id === resumeId);
    if (resume) {
      setResumeData(resume);
      initialFormData.current = { ...resume };
      document.title = resume.title;
      currentResumeId.current = resumeId;
      setIsDirty(false);
    } else {
      // New resume
      const newResume: Resume = {
        id: "",
        title: "",
        personal_info: {},
        professional_summary: "",
        experience: [],
        education: [],
        project: [],
        skills: [],
        template: "classic",
        accent_color: "#3B82F6",
        public: false,
      };
      initialFormData.current = { ...newResume };
      setIsDirty(false);
    }
  };

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);

  const sections = [
    { id: "personal", name: t("Personal Info"), icon: User },
    { id: "summary", name: t("Summary"), icon: FileText },
    { id: "experience", name: t("Experience"), icon: Briefcase },
    { id: "education", name: t("Education"), icon: GraduationCap },
    { id: "projects", name: t("Projects"), icon: FolderIcon },
    { id: "skills", name: t("Skills"), icon: Sparkles },
  ];

  const activeSection = sections[activeSectionIndex];

  useEffect(() => {
    loadExitstingResume();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeId]);

  useEffect(() => {
    if (resumeId !== currentResumeId.current) {
      isFormInitialized.current = false;
      currentResumeId.current = resumeId;
    }

    if (
      !isFormInitialized.current &&
      resumeData &&
      resumeData.id === resumeId &&
      Object.keys(resumeData.personal_info || {}).length > 0
    ) {
      const formData = {
        ...resumeData,
        personal_info: {
          ...resumeData.personal_info,
          birthDate: resumeData.personal_info?.birthDate
            ? dayjs(resumeData.personal_info.birthDate, "DD/MM/YYYY")
            : undefined,
        },
        experience: resumeData.experience
          ? resumeData.experience.map((exp) => ({
              ...exp,
              start_date: exp.start_date
                ? dayjs(exp.start_date, "MM/YYYY")
                : undefined,
              end_date: exp.end_date
                ? dayjs(exp.end_date, "MM/YYYY")
                : undefined,
            }))
          : [],
        education: resumeData.education
          ? resumeData.education.map((edu) => ({
              ...edu,
              graduation_date: edu.graduation_date
                ? dayjs(edu.graduation_date, "MM/YYYY")
                : undefined,
            }))
          : [],
      };
      form.setFieldsValue(formData);
      initialFormData.current = { ...resumeData };
      isFormInitialized.current = true;
      setIsDirty(false);
    }
  }, [resumeId, resumeData, form]);

  const handleCancel = () => {
    if (isDirty) {
      setPendingAction(() => () => navigate("/app"));
      setShowConfirmModal(true);
    } else {
      navigate("/app");
    }
  };

  const handleSave = () => {
    navigate("/app");
  };

  const handleBackToDashboard = () => {
    if (isDirty) {
      setPendingAction(() => () => navigate("/app"));
      setShowConfirmModal(true);
    } else {
      navigate("/app");
    }
  };

  const handleConfirmExit = () => {
    if (pendingAction) {
      pendingAction();
    }
    setShowConfirmModal(false);
    setPendingAction(null);
  };

  const handleCancelExit = () => {
    setShowConfirmModal(false);
    setPendingAction(null);
  };

  const changeResumeVisibility = async () => {
    setResumeData({ ...resumeData, public: !resumeData.public });
  };

  const handleShare = () => {
    setShowShareDialog(true);
  };

  const onPrint = () => {
    window.print();
  };

  const onDownloadPdf = async () => {
    try {
      const element = document.getElementById("resume-preview");
      if (!element) {
        console.error("Resume preview element not found");
        return;
      }

      // Capture the element as canvas
      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        foreignObjectRendering: false, // Avoid SVG rendering issues
        onclone: (clonedDoc) => {
          // Fix oklch color issues by overriding CSS variables
          const style = clonedDoc.createElement("style");
          style.textContent = `
            :root, * {
              --background: #ffffff !important;
              --foreground: #000000 !important;
              --card: #ffffff !important;
              --card-foreground: #000000 !important;
              --popover: #ffffff !important;
              --popover-foreground: #000000 !important;
              --primary: #965bea !important;
              --primary-foreground: #ffffff !important;
              --secondary: #f3f4f6 !important;
              --secondary-foreground: #000000 !important;
              --muted: #f3f4f6 !important;
              --muted-foreground: #6b7280 !important;
              --accent: #f3f4f6 !important;
              --accent-foreground: #000000 !important;
              --destructive: #dc2626 !important;
              --border: #e5e7eb !important;
              --input: #e5e7eb !important;
              --ring: #d1d5db !important;
            }
            * {
              color: rgb(0, 0, 0) !important;
              background-color: rgb(255, 255, 255) !important;
              border-color: rgb(229, 231, 235) !important;
            }
            #resume-preview {
              background-color: rgb(255, 255, 255) !important;
            }
          `;
          clonedDoc.head.appendChild(style);

          // Remove inline styles with oklch
          const allElements = clonedDoc.querySelectorAll("*");
          allElements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            if (htmlEl && htmlEl.style) {
              const styleText = htmlEl.getAttribute("style") || "";
              if (styleText.includes("oklch")) {
                htmlEl.removeAttribute("style");
              }
            }
          });
        },
      });

      // Calculate PDF dimensions (A4 size in mm)
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Create PDF
      const pdf = new jsPDF("p", "mm", "a4");
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight
      );
      heightLeft -= pageHeight;

      // Add additional pages if content is longer than one page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(
          canvas.toDataURL("image/png"),
          "PNG",
          0,
          position,
          imgWidth,
          imgHeight
        );
        heightLeft -= pageHeight;
      }

      // Generate filename
      const fileName = resumeData.title
        ? `${resumeData.title.replace(/[^a-z0-9]/gi, "_")}.pdf`
        : `resume_${Date.now()}.pdf`;

      // Download PDF
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
        <Button
          onClick={handleBackToDashboard}
          className="!border-0 !bg-[#f9fafb] hover:!text-purple-600 !text-lg !shadow-none !px-0"
        >
          <ArrowLeftIcon className="size-4" /> {t("backToDashboard")}
        </Button>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              navigate(`/app/preview/${resumeId}`);
            }}
            className="!bg-gradient-to-br !from-yellow-50 !to-yellow-100 !text-yellow-500
             hover:!border-yellow-400"
          >
            <EyeIcon className="size-4" />
            {t("Preview")}
          </Button>
          {resumeData.public && (
            <Button
              onClick={handleShare}
              className="!bg-gradient-to-br !from-blue-100 !to-blue-200 !text-blue-600 hover:!border-blue-400"
            >
              <Share2Icon className="size-4" /> {t("Share")}
            </Button>
          )}
          <Button
            onClick={changeResumeVisibility}
            className="!bg-gradient-to-br !from-purple-100 !to-purple-200 !text-purple-600 hover:!border-purple-400"
          >
            {resumeData.public ? t("Public") : t("Private")}
          </Button>

          <Popover
            content={
              <div className="flex flex-col gap-2">
                <Button
                  type="text"
                  icon={<PrinterIcon className="size-4" />}
                  onClick={onPrint}
                  className="flex !justify-start"
                >
                  {t("Print")}
                </Button>

                <Button
                  type="text"
                  icon={<FileDown className="size-4" />}
                  onClick={onDownloadPdf}
                  className="flex !justify-start"
                >
                  {t("Download PDF")}
                </Button>
              </div>
            }
            trigger="click"
            placement="bottom"
          >
            <Button
              className="!bg-gradient-to-br !from-green-100 !to-green-200 
                   !text-green-600 hover:!border-green-400"
            >
              <DownloadIcon className="size-4" /> {t("Download")}
            </Button>
          </Popover>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* left form */}
          <div className="relative lg:col-span-5 rounded-lg overflow-hidden">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1">
              {/* progress */}
              <hr className="absolute top-0 left-0 right-0 border-2 border-gray-200" />
              <hr
                className="absolute top-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600 border-none transition-all duration-2000"
                style={{
                  width: `${
                    (activeSectionIndex * 100) / (sections.length - 1)
                  }%`,
                }}
              />

              {/* section navigation */}
              <div className="flex flex-col mb-6 pb-6 gap-3 border-b border-gray-300 py-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TemplateSelector
                      selectedTemplate={resumeData.template || "classic"}
                      onChange={(template) =>
                        setResumeData((prev) => ({ ...prev, template }))
                      }
                    />
                    <ColorPicker
                      selectedColor={resumeData.accent_color || ""}
                      onChange={(color) =>
                        setResumeData((prev) => ({
                          ...prev,
                          accent_color: color,
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center">
                    {activeSectionIndex !== 0 && (
                      <button
                        onClick={() =>
                          setActiveSectionIndex((prevIndex) =>
                            Math.max(prevIndex - 1, 0)
                          )
                        }
                        className="flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
                        disabled={activeSectionIndex === 0}
                      >
                        <ChevronLeft className="size-4" /> {t("previous")}
                      </button>
                    )}
                    <button
                      onClick={async () => {
                        // Validate form before moving to next section
                        if (activeSection.id === "personal") {
                          try {
                            await form.validateFields([
                              ["personal_info", "full_name"],
                              ["personal_info", "birthDate"],
                              ["personal_info", "gender"],
                              ["personal_info", "email"],
                              ["personal_info", "phone"],
                              ["personal_info", "location"],
                              ["personal_info", "profession"],
                              ["personal_info", "language"],
                              ["personal_info", "website"],
                            ]);
                            // If validation passes, move to next section
                            setActiveSectionIndex((prevIndex) =>
                              Math.min(prevIndex + 1, sections.length - 1)
                            );
                          } catch (error) {
                            // Validation failed, errors will be shown automatically
                            console.log("Validation failed:", error);
                          }
                        } else {
                          // For other sections, just move to next
                          setActiveSectionIndex((prevIndex) =>
                            Math.min(prevIndex + 1, sections.length - 1)
                          );
                        }
                      }}
                      className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${
                        activeSectionIndex === sections.length - 1 &&
                        "opacity-50"
                      }`}
                      disabled={activeSectionIndex === sections.length - 1}
                    >
                      {t("next")} <ChevronRight className="size-4" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{t("Font")}</span>
                    <button
                      onClick={() => setShowAutoFillModal(true)}
                      disabled={isAutoFilling}
                      className="flex items-center gap-1 text-sm !text-purple-600 bg-gradient-to-br from-purple-50 to-purple-100 ring-purple-300 hover:ring transition-all px-3 py-2 rounded-lg disabled:opacity-70"
                    >
                      <UserCheck size={16} />
                      <span className="max-sm:hidden">
                        {t("Use my profile")}
                      </span>
                    </button>
                  </div>
                  <Select
                    size="large"
                    options={fontOptions}
                    value={resumeData.font_family || "inter"}
                    onChange={(value) =>
                      setResumeData((prev) => ({
                        ...prev,
                        font_family: value,
                      }))
                    }
                  />
                </div>
              </div>

              {/* form content */}
              <Form<FormResume>
                form={form}
                className="flex flex-col gap-4"
                layout="vertical"
                initialValues={resumeData ? resumeData : profileDefault}
                autoComplete="off"
                onValuesChange={(changedValues, allValues) => {
                  console.log("Form values changed:", changedValues, allValues);

                  // Mark form as dirty when any value changes (only if form is initialized)
                  if (isFormInitialized.current) {
                    setIsDirty(true);
                  }

                  // Check if is_current was changed and clear end_date if needed
                  if (changedValues.experience) {
                    changedValues.experience.forEach(
                      (
                        changedExp: Partial<Experience> & {
                          is_current?: boolean;
                        },
                        index: number
                      ) => {
                        if (changedExp?.is_current === true) {
                          // Clear end_date when is_current is checked
                          form.setFieldValue(
                            ["experience", index, "end_date"],
                            null
                          );
                        }
                      }
                    );
                  }

                  // Merge với resumeData hiện có để giữ lại tất cả dữ liệu
                  const formData: Resume = {
                    ...resumeData,
                    ...allValues,
                    personal_info: {
                      ...resumeData.personal_info,
                      ...allValues.personal_info,
                      birthDate: allValues.personal_info?.birthDate
                        ? typeof allValues.personal_info.birthDate === "string"
                          ? allValues.personal_info.birthDate
                          : allValues.personal_info.birthDate.format(
                              "DD/MM/YYYY"
                            )
                        : resumeData.personal_info?.birthDate,
                    },
                    professional_summary:
                      allValues.professional_summary !== undefined
                        ? allValues.professional_summary
                        : resumeData.professional_summary,
                    experience: allValues.experience
                      ? allValues.experience.map((exp) => {
                          const startDate = exp.start_date
                            ? typeof exp.start_date === "string"
                              ? exp.start_date
                              : (exp.start_date as Dayjs).format("MM/YYYY")
                            : "";
                          // Clear end_date if is_current is true
                          const endDate = exp.is_current
                            ? ""
                            : exp.end_date
                            ? typeof exp.end_date === "string"
                              ? exp.end_date
                              : (exp.end_date as Dayjs).format("MM/YYYY")
                            : "";
                          return {
                            company: exp.company,
                            position: exp.position,
                            description: exp.description,
                            is_current: exp.is_current || false,
                            start_date: startDate,
                            end_date: endDate,
                          };
                        })
                      : resumeData.experience || [],
                    education: allValues.education
                      ? allValues.education.map((edu) => {
                          const graduationDate = edu.graduation_date
                            ? typeof edu.graduation_date === "string"
                              ? edu.graduation_date
                              : (edu.graduation_date as Dayjs).format("MM/YYYY")
                            : "";
                          return {
                            institution: edu.institution,
                            degree: edu.degree,
                            field: edu.field,
                            graduation_date: graduationDate,
                            gpa: edu.gpa,
                          };
                        })
                      : resumeData.education || [],
                    project: allValues.project
                      ? allValues.project.map((proj) => ({
                          name: proj.name,
                          description: proj.description,
                          technologies: proj.technologies || [],
                        }))
                      : resumeData.project || [],
                    skills:
                      allValues.skills !== undefined &&
                      Array.isArray(allValues.skills)
                        ? allValues.skills
                        : resumeData.skills || [],
                  };
                  console.log("Setting resumeData:", formData);
                  setResumeData(formData);
                }}
              >
                <div className="space-y-6">
                  {activeSection.id === "personal" && (
                    <PersonalInfoForm
                      data={resumeData.personal_info}
                      onChange={(data) => {
                        const updatedResume: Resume = {
                          ...resumeData,
                          personal_info: data,
                        };
                        setResumeData(updatedResume);
                        form.setFieldsValue({
                          personal_info: data,
                        });
                      }}
                      removeBackground={removeBackground}
                      setRemoveBackground={setRemoveBackground}
                    />
                  )}

                  {activeSection.id === "summary" && (
                    <ProfessionalSummaryForm />
                  )}

                  {activeSection.id === "experience" && (
                    <ExperienceForm
                      data={resumeData.experience || []}
                      onChange={(data) => {
                        setResumeData((prev) => ({
                          ...prev,
                          experience: data,
                        }));
                      }}
                    />
                  )}

                  {activeSection.id === "education" && (
                    <EducationForm
                      data={resumeData.education || []}
                      onChange={(data) => {
                        setResumeData((prev) => ({
                          ...prev,
                          education: data,
                        }));
                      }}
                    />
                  )}

                  {activeSection.id === "projects" && (
                    <ProjectForm
                      data={resumeData.project || []}
                      onChange={(data) => {
                        setResumeData((prev) => ({
                          ...prev,
                          project: data,
                        }));
                      }}
                    />
                  )}

                  {activeSection.id === "skills" && (
                    <SkillsForm
                      data={resumeData.skills || []}
                      onChange={(data) => {
                        setResumeData((prev) => ({
                          ...prev,
                          skills: data,
                        }));
                        form.setFieldsValue({
                          skills: data,
                        });
                      }}
                    />
                  )}
                </div>

                <div className="flex gap-2 justify-end">
                  <Button onClick={handleCancel}>{t("Cancel")}</Button>
                  <Button
                    onClick={handleSave}
                    disabled={!isDirty}
                    color="default"
                    variant="solid"
                    className="flex mt-4 !bg-purple-600 max-w-fit disabled:!text-white/75"
                  >
                    {t("Save changes")}
                  </Button>
                </div>
              </Form>
            </div>
          </div>

          {/* right preview */}
          <div className="lg:col-span-7 max-lg:mt-6">
            <ResumePreview
              data={resumeData}
              template={resumeData.template || "classic"}
              accentColor={resumeData.accent_color || "#3B82F6"}
              classes="shadow-lg"
            />
          </div>
        </div>
      </div>

      <Modal
        open={showConfirmModal}
        onCancel={handleCancelExit}
        onOk={handleConfirmExit}
        title={
          <span className="flex items-center gap-2">
            <AlertCircle style={{ color: "#dc2626" }} />
            {t("Confirm Popup")}
          </span>
        }
        okText={t("OK")}
        cancelText={t("Cancel")}
        okButtonProps={{
          style: {
            backgroundColor: "#dc2626",
          },
        }}
      >
        <p>{t("If you exit now, all unsaved changes will be lost.")}</p>
        <p>{t("Are you sure you want to exit?")}</p>
      </Modal>

      <Modal
        open={showAutoFillModal}
        onCancel={() => setShowAutoFillModal(false)}
        onOk={async () => {
          try {
            setIsAutoFilling(true);

            // TODO: Thay mockProfile bằng API thực tế (ví dụ: useMyInfo hoặc user profile từ backend)
            const mockProfile = {
              name: "Nguyễn Uyển Nhi",
              dateOfBirth: "07/11/2003",
              email: "123@gmail.com",
              phoneNumber: "+84813059790",
              gender: "Male",
              profession: "Frontend Developer",
              image: "",
            };

            const updatedPersonalInfo = {
              ...resumeData.personal_info,
              full_name: mockProfile.name,
              birthDate: mockProfile.dateOfBirth,
              gender: mockProfile.gender,
              email: mockProfile.email,
              phone: mockProfile.phoneNumber,
              profession: mockProfile.profession,
              image: mockProfile.image || resumeData.personal_info?.image,
            };

            const updatedResume: Resume = {
              ...resumeData,
              personal_info: updatedPersonalInfo,
            };

            setResumeData(updatedResume);

            form.setFieldsValue({
              personal_info: {
                ...form.getFieldValue(["personal_info"]),
                full_name: updatedPersonalInfo.full_name,
                birthDate: updatedPersonalInfo.birthDate
                  ? dayjs(updatedPersonalInfo.birthDate, "DD/MM/YYYY")
                  : undefined,
                gender: updatedPersonalInfo.gender,
                email: updatedPersonalInfo.email,
                phone: updatedPersonalInfo.phone,
                profession: updatedPersonalInfo.profession,
              },
            });

            setIsDirty(true);
          } finally {
            setIsAutoFilling(false);
          }
        }}
        title={
          <span className="flex items-center gap-2">
            <AlertCircle className="text-yellow-500" />
            {t("Auto fill from profile")}
          </span>
        }
        okText={t("Yes")}
        cancelText={t("No")}
        okButtonProps={{
          style: {
            backgroundColor: "#FBBF24",
          },
        }}
      >
        <p>
          {t(
            "Do you want to automatically fill your resume with your profile information (name, date of birth, email, phone, gender, profession)?"
          )}
        </p>
      </Modal>

      <ShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        resumeId={resumeId || ""}
      />
    </div>
  );
}
