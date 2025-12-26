import { Modal, Tag, Empty, Spin } from "antd";
import { Sparkles, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { resumeApi, type ResumeScore } from "@/lib/api";
import dayjs from "dayjs";

interface ScoreHistoryModalProps {
  open: boolean;
  onCancel: () => void;
  resumeId: string | undefined;
}

export default function ScoreHistoryModal({
  open,
  onCancel,
  resumeId,
}: ScoreHistoryModalProps) {
  const { t } = useTranslation();
  const [scores, setScores] = useState<ResumeScore[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedScores, setExpandedScores] = useState<Set<number>>(new Set());
  const [expandedJD, setExpandedJD] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (open && resumeId) {
      loadScores();
    } else {
      setScores([]);
    }
  }, [open, resumeId]);

  const loadScores = async () => {
    if (!resumeId) return;
    setLoading(true);
    try {
      const result = await resumeApi.getScoreList(Number(resumeId), {
        page: 1,
        pageSize: 50,
      });
      setScores(result.data);
    } catch (error) {
      console.error("Failed to load score history:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      title={
        <span className="flex items-center gap-2">
          <Clock className="size-4 text-purple-600" />
          {t("Score History")}
        </span>
      }
      width={800}
    >
      <Spin spinning={loading}>
        {scores.length === 0 ? (
          <Empty description={t("No score history found")} />
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {scores.map((score) => (
              <div
                key={score.id}
                className="border border-slate-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-purple-600" />
                    <span className="text-sm text-slate-500">
                      {dayjs(score.createdAt).format("DD/MM/YYYY HH:mm")}
                    </span>
                  </div>
                  <Tag
                    color={
                      score.score >= 75
                        ? "green"
                        : score.score >= 60
                          ? "blue"
                          : "orange"
                    }
                  >
                    {score.score}/100
                  </Tag>
                </div>

                {score.matchedRole && (
                  <div className="mb-2">
                    <span className="text-xs text-slate-500">
                      {t("Matched Role")}:{" "}
                    </span>
                    <span className="text-sm font-medium text-slate-800">
                      {score.matchedRole}
                    </span>
                  </div>
                )}

                <div className="mb-2">
                  <p className="text-xs text-slate-500 mb-1">
                    {t("Job Description")}:
                  </p>
                  <div>
                    <p
                      className={`text-sm text-slate-700 ${
                        expandedJD.has(score.id) ? "" : "line-clamp-2"
                      }`}
                    >
                      {score.jdText}
                    </p>
                    {score.jdText && score.jdText.length > 100 && (
                      <button
                        onClick={() => {
                          if (expandedJD.has(score.id)) {
                            setExpandedJD((prev) => {
                              const newSet = new Set(prev);
                              newSet.delete(score.id);
                              return newSet;
                            });
                          } else {
                            setExpandedJD((prev) => new Set(prev).add(score.id));
                          }
                        }}
                        className="text-purple-600 hover:text-purple-700 font-medium underline cursor-pointer text-xs mt-1"
                      >
                        {expandedJD.has(score.id) ? t("Show less") : t("Show more")}
                      </button>
                    )}
                  </div>
                </div>

                {score.missingSkills.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs font-medium text-slate-600 mb-1">
                      {t("MissingSkills")}:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {score.missingSkills.map((skill, idx) => (
                        <Tag key={idx} color="red">
                          {skill}
                        </Tag>
                      ))}
                    </div>
                  </div>
                )}

                {score.weakSections.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs font-medium text-slate-600 mb-1">
                      {t("WeakSections")}:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {score.weakSections.map((section, idx) => (
                        <Tag
                          key={idx}
                          color="gold"
                          style={{
                            maxWidth: "100%",
                            wordBreak: "break-word",
                            whiteSpace: "normal",
                            display: "inline-block",
                          }}
                        >
                          <span className="break-words">
                            {t(section) || section}
                          </span>
                        </Tag>
                      ))}
                    </div>
                  </div>
                )}

                {score.suggestions.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-slate-600 mb-1">
                      {t("Suggestions")}:
                    </p>
                    <ul className="text-xs text-slate-700 list-disc list-inside space-y-0.5">
                      {(expandedScores.has(score.id)
                        ? score.suggestions
                        : score.suggestions.slice(0, 3)
                      ).map((suggestion, idx) => (
                        <li key={idx}>{suggestion}</li>
                      ))}
                      {score.suggestions.length > 3 && !expandedScores.has(score.id) && (
                        <li>
                          <button
                            onClick={() => {
                              setExpandedScores((prev) => new Set(prev).add(score.id));
                            }}
                            className="text-purple-600 hover:text-purple-700 font-medium underline cursor-pointer"
                          >
                            +{score.suggestions.length - 3} {t("more")}...
                          </button>
                        </li>
                      )}
                      {expandedScores.has(score.id) && score.suggestions.length > 3 && (
                        <li>
                          <button
                            onClick={() => {
                              setExpandedScores((prev) => {
                                const newSet = new Set(prev);
                                newSet.delete(score.id);
                                return newSet;
                              });
                            }}
                            className="text-purple-600 hover:text-purple-700 font-medium underline cursor-pointer"
                          >
                            {t("Show less")}
                          </button>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Spin>
    </Modal>
  );
}

