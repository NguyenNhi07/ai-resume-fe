import { useToast } from "@/hooks/useToast";
import { resumeApi, type JobApplication } from "@/lib/api";
import { Button, Empty, Modal, Select, Spin, Tag } from "antd";
import {
  ExternalLink,
  TrashIcon,
  Edit,
  Calendar,
  Building2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

interface JobApplicationHistoryModalProps {
  open: boolean;
  onClose: () => void;
  resumeId: string;
}

const STATUS_OPTIONS = [
  { value: "Applied", label: "Applied", color: "blue" },
  { value: "Interviewing", label: "Interviewing", color: "purple" },
  { value: "Offer", label: "Offer", color: "green" },
  { value: "Rejected", label: "Rejected", color: "red" },
  { value: "Withdrawn", label: "Withdrawn", color: "default" },
];

export default function JobApplicationHistoryModal({
  open,
  onClose,
  resumeId,
}: JobApplicationHistoryModalProps) {
  const { t } = useTranslation();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState<string>("");
  const [editNotes, setEditNotes] = useState<string>("");

  useEffect(() => {
    if (open && resumeId) {
      loadApplications();
    } else {
      setApplications([]);
    }
  }, [open, resumeId, statusFilter]);

  const loadApplications = async () => {
    if (!resumeId) return;
    setLoading(true);
    try {
      const result = await resumeApi.getJobApplicationList(Number(resumeId), {
        page: 1,
        pageSize: 100,
        status: statusFilter,
      });
      setApplications(result.data);
    } catch (error: any) {
      console.error("Failed to load job applications:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          t("Failed to load job applications")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t("Are you sure you want to delete this application?"))) {
      return;
    }
    try {
      await resumeApi.deleteJobApplication(id);
      toast.success(t("Application deleted successfully"));
      loadApplications();
    } catch (error: any) {
      console.error("Failed to delete application:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          t("Failed to delete application")
      );
    }
  };

  const handleStartEdit = (app: JobApplication) => {
    setEditingId(app.id);
    setEditStatus(app.status);
    setEditNotes(app.notes || "");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditStatus("");
    setEditNotes("");
  };

  const handleSaveEdit = async (id: number) => {
    try {
      await resumeApi.updateJobApplication(id, {
        status: editStatus as any,
        notes: editNotes,
      });
      toast.success(t("Application updated successfully"));
      handleCancelEdit();
      loadApplications();
    } catch (error: any) {
      console.error("Failed to update application:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          t("Failed to update application")
      );
    }
  };

  const handleOpenJob = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={
        <div className="flex items-center gap-2">
          <Calendar className="size-5 text-purple-600" />
          <span>{t("Job Application History")}</span>
        </div>
      }
      footer={null}
      width={900}
      className="job-application-history-modal"
    >
      <div className="py-4">
        <div className="mb-4 flex items-center gap-2">
          <Select
            placeholder={t("Filter by status")}
            value={statusFilter}
            onChange={setStatusFilter}
            allowClear
            className="flex-1"
            options={STATUS_OPTIONS.map((opt) => ({
              value: opt.value,
              label: opt.label,
            }))}
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        ) : applications.length === 0 ? (
          <Empty
            description={t("No job applications found")}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {applications.map((app) => (
              <div
                key={app.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
              >
                {editingId === app.id ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {t("Status")}
                      </label>
                      <Select
                        value={editStatus}
                        onChange={setEditStatus}
                        className="w-full"
                        options={STATUS_OPTIONS.map((opt) => ({
                          value: opt.value,
                          label: opt.label,
                        }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {t("Notes")}
                      </label>
                      <textarea
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="primary"
                        onClick={() => handleSaveEdit(app.id)}
                      >
                        {t("Save")}
                      </Button>
                      <Button onClick={handleCancelEdit}>
                        {t("Cancel")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {app.jobTitle}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          {app.companyName && (
                            <div className="flex items-center gap-1">
                              <Building2 className="size-4" />
                              <span>{app.companyName}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="size-4" />
                            <span>
                              {dayjs(app.appliedAt).format("DD/MM/YYYY")}
                            </span>
                          </div>
                        </div>
                        {app.jobDescription && (
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                            {app.jobDescription}
                          </p>
                        )}
                        {app.notes && (
                          <p className="text-sm text-gray-500 italic mb-2">
                            {t("Notes")}: {app.notes}
                          </p>
                        )}
                      </div>
                      <Tag
                        color={
                          STATUS_OPTIONS.find((opt) => opt.value === app.status)
                            ?.color || "default"
                        }
                      >
                        {app.status}
                      </Tag>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="primary"
                        icon={<ExternalLink className="size-4" />}
                        onClick={() => handleOpenJob(app.jobUrl)}
                      >
                        {t("View Job")}
                      </Button>
                      <Button
                        icon={<Edit className="size-4" />}
                        onClick={() => handleStartEdit(app)}
                      >
                        {t("Edit")}
                      </Button>
                      <Button
                        danger
                        icon={<TrashIcon className="size-4" />}
                        onClick={() => handleDelete(app.id)}
                      >
                        {t("Delete")}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}

