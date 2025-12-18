import { ColorPicker } from "@/components/ColorPicker";
import { EducationForm } from "@/components/EducationForm";
import { ExperienceForm } from "@/components/ExperienceForm";
import { PersonalInfoForm } from "@/components/PersonalInfoForm";
import { ProfessionalSummaryForm } from "@/components/ProfessionalSummaryForm";
import { ProjectForm } from "@/components/ProjectForm";
import { ResumePreview } from "@/components/ResumePreview";
import { SkillsForm } from "@/components/SkillsForm";
import { TemplateSelector } from "@/components/TemplateSelector";
import { useToast } from "@/hooks/useToast";
import { resumeApi, userApi } from "@/lib/api";
import { profileDefault } from "@/lib/constant";
import type { Experience, Resume } from "@/lib/type";
import { Button, Form, Modal, Select } from "antd";
import dayjs, { Dayjs } from "dayjs";
import {
  AlertCircle,
  ArrowLeftIcon,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  FileText,
  FolderIcon,
  GraduationCap,
  Sparkles,
  User,
  UserCheck
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
  const toast = useToast();
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAutoFillModal, setShowAutoFillModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const initialFormData = useRef<Resume | null>(null);
  const [isAutoFilling, setIsAutoFilling] = useState(false);

  const loadExitstingResume = async () => {
    if (!resumeId) return;
    try {
      const resume = await resumeApi.detail(resumeId);
      setResumeData(resume);
      initialFormData.current = { ...resume };
      document.title = resume.title;
      currentResumeId.current = resumeId;
      setIsDirty(false);
    } catch (e) {
      // Fallback to default for new resume
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
      setResumeData(newResume);
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

  const buildResumeFromForm = (allValues: FormResume, current: Resume): Resume => {
    return {
      ...current,
      ...allValues,
      personal_info: {
        ...current.personal_info,
        ...allValues.personal_info,
        birthDate: allValues.personal_info?.birthDate
          ? typeof allValues.personal_info.birthDate === "string"
            ? allValues.personal_info.birthDate
            : allValues.personal_info.birthDate.format("DD/MM/YYYY")
          : current.personal_info?.birthDate,
      },
      professional_summary:
        allValues.professional_summary !== undefined
          ? allValues.professional_summary
          : current.professional_summary,
      experience: allValues.experience
        ? allValues.experience.map((exp) => {
          const startDate = exp.start_date
            ? typeof exp.start_date === "string"
              ? exp.start_date
              : (exp.start_date as Dayjs).format("MM/YYYY")
            : "";
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
        : current.experience || [],
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
        : current.education || [],
      project: allValues.project
        ? allValues.project.map((proj) => ({
          name: proj.name,
          description: proj.description,
          technologies: proj.technologies || [],
        }))
        : current.project || [],
      skills:
        allValues.skills !== undefined && Array.isArray(allValues.skills)
          ? allValues.skills
          : current.skills || [],
      // Preserve template and accent_color from current state (set by TemplateSelector/ColorPicker)
      template: current.template || 'classic',
      accent_color: current.accent_color || '#3B82F6',
    };
  };

  const syncResumeFromForm = () => {
    const allValues = form.getFieldsValue(true) as FormResume;
    setResumeData((prev) => buildResumeFromForm(allValues, prev));
  };

  const handleCancel = () => {
    if (isDirty) {
      setPendingAction(() => () => navigate("/app"));
      setShowConfirmModal(true);
    } else {
      navigate("/app");
    }
  };

  const handleSave = async () => {
    try {
      const allValues = await form.validateFields();
      const payload = buildResumeFromForm(allValues, resumeData);

      let updated: Resume;
      if (payload.id) {
        updated = await resumeApi.update(payload.id, payload);
      } else {
        updated = await resumeApi.create(payload);
        navigate(`/app/builder/${updated.id}`);
      }
      setResumeData(updated);
      initialFormData.current = { ...updated };
      setIsDirty(false);
      navigate(-1);
    } catch (e) {
      console.error(e);
    }
  };

  const handleBackToDashboard = () => {
    if (isDirty) {
      setPendingAction(() => () => navigate(-1));
      setShowConfirmModal(true);
    } else {
      navigate(-1);
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

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
        <Button
          onClick={handleBackToDashboard}
          className="!border-0 !bg-[#f9fafb] hover:!text-purple-600 !text-lg !shadow-none !px-0"
        >
          <ArrowLeftIcon className="size-4" /> {t("Back")}
        </Button>

        <div className="flex items-center gap-2">
          <Button onClick={handleCancel}>{t("Cancel")}</Button>
          <Button
            onClick={handleSave}
            // disabled={!isDirty}
            color="default"
            variant="solid"
            className="flex mt-4 !bg-purple-600 max-w-fit disabled:!text-white/75"
          >
            {t("Save changes")}
          </Button>
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
                  width: `${(activeSectionIndex * 100) / (sections.length - 1)
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
                      className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${activeSectionIndex === sections.length - 1 &&
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

                  const formData: Resume = buildResumeFromForm(allValues, resumeData);
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
                    <ProfessionalSummaryForm onChangeWithAi={syncResumeFromForm} />
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
                      onChangeWithAi={syncResumeFromForm}
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
                      onChangeWithAi={syncResumeFromForm}
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
              </Form>
            </div>
          </div>

          {/* right preview */}
          <div className="lg:col-span-7 max-lg:mt-6">
            <ResumePreview
              data={resumeData}
              template={resumeData.template || "classic"}
              accentColor={resumeData.accent_color || "#3B82F6"}
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

            // Lấy profile thật từ BE và map vào personal_info của CV
            const me = await userApi.me();

            const birthDateStr = me.dob ? dayjs(me.dob).format("DD/MM/YYYY") : undefined;

            const updatedPersonalInfo = {
              ...resumeData.personal_info,
              full_name: me.fullName || resumeData.personal_info?.full_name,
              birthDate: birthDateStr || resumeData.personal_info?.birthDate,
              gender: me.gender || resumeData.personal_info?.gender,
              email: me.email || resumeData.personal_info?.email,
              phone: me.phoneNumber || resumeData.personal_info?.phone,
              profession: me.profession || resumeData.personal_info?.profession,
              image: me.imageLink || resumeData.personal_info?.image,
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
            toast.success(t("Auto filled from profile"));
            setShowAutoFillModal(false)
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
    </div>
  );
}
