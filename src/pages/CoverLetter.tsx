import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Input, Segmented, Tag } from "antd";
import { ArrowLeftIcon, DownloadIcon, PrinterIcon, Sparkles, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import { extractSkillsFromJD } from "@/lib/utils";
import type { Resume } from "@/lib/type";
import { resumeApi, aiApi } from "@/lib/api";
import { useToast } from "@/hooks/useToast";

const { TextArea } = Input;

type Tone = "formal" | "friendly";

export default function CoverLetter() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { resumeId } = useParams();
  const toast = useToast();

  const [resume, setResume] = useState<Resume | null>(null);
  const [jdText, setJdText] = useState("");
  const [tone, setTone] = useState<Tone>("formal");
  const [letter, setLetter] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!resumeId) return;
    resumeApi
      .detail(resumeId)
      .then((res) => {
        setResume(res);
        // giữ nội dung trống ban đầu, user bấm Generate để gọi AI
        setLetter("");
      })
      .catch(() => setResume(null));
  }, [resumeId]);

  const jdSkills = useMemo(
    () => extractSkillsFromJD(jdText, resume?.skills || []),
    [jdText, resume]
  );

  const handleGenerate = async () => {
    if (!resume) return;
    setIsGenerating(true);
    try {
      const parts: string[] = [];
      if (resume.personal_info?.full_name) {
        parts.push(`Name: ${resume.personal_info.full_name}`);
      }
      if (resume.personal_info?.profession) {
        parts.push(`Profession: ${resume.personal_info.profession}`);
      }
      if (resume.professional_summary) {
        parts.push(`Summary: ${resume.professional_summary}`);
      }
      if (resume.experience?.length) {
        parts.push(
          "Experience:",
          ...resume.experience.map((e) =>
            `- ${e.position || ""} at ${e.company || ""} (${e.start_date || ""} - ${e.is_current ? "Present" : e.end_date || ""
            }) ${e.description || ""}`,
          ),
        );
      }
      if (resume.education?.length) {
        parts.push(
          "Education:",
          ...resume.education.map((ed) =>
            `- ${ed.degree || ""} in ${ed.field || ""} at ${ed.institution || ""} (${ed.graduation_date || ""
            }) GPA: ${ed.gpa || ""}`,
          ),
        );
      }
      if (resume.project?.length) {
        parts.push(
          "Projects:",
          ...resume.project.map((p) =>
            `- ${p.name || ""}: ${p.description || ""} (Tech: ${(p.technologies || []).join(
              ", ",
            )})`,
          ),
        );
      }
      if (resume.skills?.length) {
        parts.push(`Skills: ${resume.skills.join(", ")}`);
      }
      const resumeText = parts.join("\n");

      const type = tone === "formal" ? "normal" : "friendly";
      const res = await aiApi.generateCoverLetter(resumeText, jdText, type);
      setLetter(res.coverLetter);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || t("Failed to generate cover letter"));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([letter], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${resume?.title?.replace(/[^a-z0-9]/gi, "_") || "cover_letter"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const w = window.open("", "_blank", "width=800,height=900");
    if (!w) return;
    w.document.write(`<pre style="font-family: sans-serif; white-space: pre-wrap;">${letter}</pre>`);
    w.document.close();
    w.focus();
    w.print();
    w.close();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={() => navigate(-1)}
          className="!border-0 !bg-[#f9fafb] hover:!text-purple-600 !text-lg !shadow-none !px-0"
        >
          <ArrowLeftIcon className="size-4" /> {t("Back")}
        </Button>
        <div className="flex items-center gap-2">
          <Button
            onClick={handlePrint}
            className="!bg-gradient-to-br !from-slate-100 !to-slate-200 !text-slate-700 hover:!border-slate-300"
          >
            <PrinterIcon className="size-4" /> {t("Print")}
          </Button>
          <Button
            onClick={handleDownload}
            className="!bg-gradient-to-br !from-green-100 !to-green-200 !text-green-700 hover:!border-green-400"
          >
            <DownloadIcon className="size-4" /> {t("Download")}
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">
          {t("CoverLetterTitle")}
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl">
          {t("CoverLetterDescription")}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-md bg-purple-100 p-2">
                <FileText className="size-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {resume?.title || t("UntitledResume")}
                </p>
                <p className="text-xs text-slate-500">{t("UsingResumeAsBase")}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-500 uppercase">
                {t("Tone")}
              </p>
              <Segmented<Tone>
                value={tone}
                onChange={(val) => setTone(val as Tone)}
                options={[
                  { label: t("ToneFormal"), value: "formal" },
                  { label: t("ToneFriendly"), value: "friendly" },
                ]}
              />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500 uppercase mb-1">
                {t("JobDescription")}
              </p>
              <TextArea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                rows={6}
                placeholder={t("PasteJDPlaceholder")}
                autoSize={{ minRows: 6, maxRows: 10 }}
                showCount
              />
              <div className="flex flex-wrap gap-1 mt-2">
                {jdSkills.map((skill) => (
                  <Tag key={skill} color="purple">
                    {skill}
                  </Tag>
                ))}
              </div>
            </div>

            <Button
              type="primary"
              className="!bg-purple-600 disabled:!bg-purple-300"
              disabled={!resume || isGenerating}
              loading={isGenerating}
              onClick={handleGenerate}
            >
              <Sparkles className="size-4 mr-1" />
              {t("GenerateCoverLetter")}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4 h-full">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  {t("CoverLetterPreview")}
                </p>
                <p className="text-xs text-slate-500">
                  {t("CoverLetterPreviewHelper")}
                </p>
              </div>
            </div>
            <TextArea
              value={letter}
              onChange={(e) => setLetter(e.target.value)}
              rows={22}
              autoSize={{ minRows: 16, maxRows: 28 }}
              className="min-h-[420px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}


