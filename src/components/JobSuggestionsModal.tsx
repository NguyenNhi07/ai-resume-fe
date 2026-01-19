import { useToast } from "@/hooks/useToast";
import { aiApi, resumeApi, type JobSuggestion } from "@/lib/api";
import { Button, Empty, Modal, Spin, Tag } from "antd";
import { ExternalLink, MapPin, Building2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface JobSuggestionsModalProps {
  open: boolean;
  onClose: () => void;
  resumeId: string;
  resumeText: string;
}

export default function JobSuggestionsModal({
  open,
  onClose,
  resumeId,
  resumeText,
}: JobSuggestionsModalProps) {
  const { t } = useTranslation();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<JobSuggestion[]>([]);
  const [location, setLocation] = useState("");

  useEffect(() => {
    if (open && resumeText) {
      handleSuggestJobs();
    }
  }, [open, resumeText]);

  const handleSuggestJobs = async () => {
    if (!resumeText.trim()) {
      toast.error(t("Please provide resume content"));
      return;
    }

    setLoading(true);
    try {
      const result = await aiApi.suggestJobs(resumeText, location || undefined);
      setJobs(result.jobs || []);
    } catch (error: any) {
      console.error("Error suggesting jobs:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          t("Failed to suggest jobs")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (job: JobSuggestion) => {
    try {
      await resumeApi.createJobApplication({
        resumeId: Number(resumeId),
        jobTitle: job.jobTitle,
        companyName: job.companyName,
        jobUrl: job.jobUrl,
        jobDescription: job.jobDescription,
        status: "Applied",
      });
      toast.success(t("Job application saved successfully"));
      onClose();
    } catch (error: any) {
      console.error("Error saving job application:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          t("Failed to save job application")
      );
    }
  };

  const getSafeJobUrl = (job: JobSuggestion) => {
    const fallbackSearch = `https://www.google.com/search?q=${encodeURIComponent(
      `${job.jobTitle} ${job.companyName || ""} ${job.location || ""} jobs`
    )}`;

    if (!job.jobUrl) return fallbackSearch;
    try {
      const parsed = new URL(job.jobUrl);
      const allowedHosts = [
        "www.linkedin.com",
        "linkedin.com",
        "vn.linkedin.com",
        "www.indeed.com",
        "indeed.com",
        "vn.indeed.com",
        "vietnamworks.com",
        "www.vietnamworks.com",
        "itviec.com",
        "www.itviec.com",
        "topcv.vn",
        "www.topcv.vn",
        "careerbuilder.vn",
        "www.careerbuilder.vn",
        "glints.com",
        "www.glints.com",
      ];
      if (!allowedHosts.includes(parsed.host)) {
        return fallbackSearch;
      }
      return parsed.toString();
    } catch {
      return fallbackSearch;
    }
  };

  const handleOpenJob = (job: JobSuggestion) => {
    const url = getSafeJobUrl(job);
    window.open(url, "_blank", "noopener,noreferrer");
    if (url.startsWith("https://www.google.com/search")) {
      toast.info(t("Job link not available, opened search results"));
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-purple-600" />
          <span>{t("Job Suggestions")}</span>
        </div>
      }
      footer={null}
      width={900}
      className="job-suggestions-modal"
    >
      <div className="py-4">
        <div className="mb-4 flex items-center gap-2">
          <input
            type="text"
            placeholder={t("Location (optional)")}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2"
          />
          <Button
            type="primary"
            onClick={handleSuggestJobs}
            loading={loading}
            disabled={loading}
          >
            <Sparkles className="size-4 mr-1" />
            {t("Search Jobs")}
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        ) : jobs.length === 0 ? (
          <Empty
            description={t("No job suggestions found")}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {jobs.map((job, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {job.jobTitle}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      {job.companyName && (
                        <div className="flex items-center gap-1">
                          <Building2 className="size-4" />
                          <span>{job.companyName}</span>
                        </div>
                      )}
                      {job.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="size-4" />
                          <span>{job.location}</span>
                        </div>
                      )}
                      {job.source && (
                        <Tag color="blue">{job.source}</Tag>
                      )}
                    </div>
                    {job.jobDescription && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {job.jobDescription}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="primary"
                    icon={<ExternalLink className="size-4" />}
                    onClick={() => handleOpenJob(job)}
                  >
                    {t("View Job")}
                  </Button>
                  <Button
                    onClick={() => handleApply(job)}
                    className="!bg-purple-100 !text-purple-600 hover:!border-purple-400 !border-purple-300"
                  >
                    {t("Save Application")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}

