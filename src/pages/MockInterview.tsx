import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Input, Tag } from "antd";
import { Sparkles, ArrowLeftIcon, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import { extractSkillsFromJD, scoreInterviewAnswers } from "@/lib/utils";
import type { Resume } from "@/lib/type";
import { resumeApi, aiApi } from "@/lib/api";

const { TextArea } = Input;

export default function MockInterview() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { resumeId } = useParams();

  const [resume, setResume] = useState<Resume | null>(null);
  const [jdText, setJdText] = useState("");
  const [questions, setQuestions] = useState<
    Array<{ id: string; type: "technical" | "behavioral" | "experience" | "situational" | "soft-skill"; question: string; hint?: string }>
  >([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState<{ total: number; perQuestion: Array<{ id: string; score: number; feedback: string }> } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isScoring, setIsScoring] = useState(false);

  useEffect(() => {
    if (!resumeId) return;
    resumeApi
      .detail(resumeId)
      .then((res) => setResume(res))
      .catch(() => setResume(null));
  }, [resumeId]);

  const jdSkills = useMemo(() => extractSkillsFromJD(jdText, resume?.skills || []), [jdText, resume]);

  const handleGenerate = async () => {
    if (!resume) return;
    setIsGenerating(true);
    try {
      // Build resumeText giống cách làm ở CoverLetter để gửi cho AI
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
            `- ${e.position || ""} at ${e.company || ""} (${e.start_date || ""} - ${
              e.is_current ? "Present" : e.end_date || ""
            }) ${e.description || ""}`,
          ),
        );
      }
      if (resume.education?.length) {
        parts.push(
          "Education:",
          ...resume.education.map((ed) =>
            `- ${ed.degree || ""} in ${ed.field || ""} at ${ed.institution || ""} (${
              ed.graduation_date || ""
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

      const res = await aiApi.generateInterviewQuestions(resumeText, jdText);

      const mapped = (res.questions || []).map((q, idx) => ({
        id: `q-${idx + 1}`,
        // fallback: mọi type không phải technical → behavioral để mapping màu Tag đơn giản
        type: (q.type as any) || "Technical",
        question: q.question,
        hint: q.expectedAnswer,
      }));

      setQuestions(mapped);
      setAnswers({});
      setScore(null);
    } catch (e: any) {
      console.error(e);
      // eslint-disable-next-line no-alert
      alert(e?.response?.data?.message || "Failed to generate interview questions");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleScore = () => {
    if (!questions.length) return;
    setIsScoring(true);
    setTimeout(() => {
      const scored = scoreInterviewAnswers(questions, answers, jdSkills);
      setScore(scored);
      setIsScoring(false);
    }, 300);
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
        <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-xs text-purple-700">
          <Sparkles className="size-3" />
          <span>{t("AI")}</span>
        </div>
      </div>

      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">{t("MockInterviewTitle")}</h1>
        <p className="text-sm text-slate-600 max-w-3xl">{t("MockInterviewDescription")}</p>
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

            <div>
              <p className="text-xs font-medium text-slate-500 uppercase mb-1">{t("JobDescription")}</p>
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
              {t("GenerateInterviewQuestions")}
            </Button>
          </div>

          {score && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-purple-600" />
                  <p className="text-sm font-semibold text-slate-800">
                    {t("InterviewScoreTitle", { score: score.total })}
                  </p>
                </div>
                <Tag color={score.total >= 75 ? "green" : score.total >= 60 ? "blue" : "orange"}>
                  {score.total}/100
                </Tag>
              </div>
              <p className="text-xs text-slate-500">{t("InterviewScoreNote")}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  {t("InterviewQuestions")}
                </p>
                <p className="text-xs text-slate-500">{t("InterviewQuestionsHelper")}</p>
              </div>
              <Button
                size="small"
                type="primary"
                className="!bg-green-600 disabled:!bg-green-300"
                disabled={!questions.length || isScoring}
                loading={isScoring}
                onClick={handleScore}
              >
                {t("ScoreAnswers")}
              </Button>
            </div>

            {questions.length === 0 ? (
              <div className="text-sm text-slate-500">{t("NoInterviewQuestions")}</div>
            ) : (
              <div className="space-y-4">
                {questions.map((q) => (
                  <div key={q.id} className="border border-slate-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Tag color={q.type === "technical" ? "blue" : "gold"}>{q.type.charAt(0).toUpperCase() + q.type.slice(1)}</Tag>
                      <p className="text-sm font-semibold text-slate-800">{q.question}</p>
                    </div>
                    {q.hint && <div className="text-xs text-slate-500 mb-3">{q.hint}</div>}
                    <TextArea
                      value={answers[q.id] || ""}
                      onChange={(e) =>
                        setAnswers((prev) => ({
                          ...prev,
                          [q.id]: e.target.value,
                        }))
                      }
                      rows={4}
                      placeholder={t("YourAnswerPlaceholder")}
                      autoSize={{ minRows: 4, maxRows: 8 }}
                    />
                    {score?.perQuestion.find((p) => p.id === q.id) && (
                      <div className="mt-2 flex items-center justify-between">
                        <Tag
                          color={
                            (score?.perQuestion.find((p) => p.id === q.id)?.score || 0) >= 75
                              ? "green"
                              : (score?.perQuestion.find((p) => p.id === q.id)?.score || 0) >= 60
                              ? "blue"
                              : "orange"
                          }
                        >
                          {score?.perQuestion.find((p) => p.id === q.id)?.score}/100
                        </Tag>
                        <p className="text-xs text-slate-600">
                          {score?.perQuestion.find((p) => p.id === q.id)?.feedback}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


