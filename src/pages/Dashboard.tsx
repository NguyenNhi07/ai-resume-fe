import type { Resume } from "@/lib/type";
import { dummyResumeData } from "@/lib/utils";
import { Input, Modal, Popover } from "antd";
import {
  AlertCircle,
  Copy,
  FilePenLineIcon,
  MoreVertical,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UploadCloud,
  UploadCloudIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const colors = ["#9333ea", "#d97706", "#dc2626", "#0284c7", "#16a34a"];
  const [allResumes, setAllResumes] = useState<Resume[]>([]);
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [title, setTitle] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [editResumeId, setEditResumeId] = useState<string | null>("");
  const [deleteResumeId, setDeleteResumeId] = useState<number | undefined>();
  const [deleteResume, setDeleteResume] = useState(false);
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  const loadAllResumes = async () => {
    setAllResumes(dummyResumeData);
  };

  const createResume = async (event: React.FormEvent) => {
    event.preventDefault();
    setShowCreateResume(false);
    navigate(`/app/builder/resume123`);
  };

  const uploadResume = async (event: React.FormEvent) => {
    event.preventDefault();
    setShowUploadResume(false);
    navigate(`/app/builder/resume123`);
  };

  const editTitle = async (event: React.FormEvent) => {
    event.preventDefault();
  };

  const handleDeleteResume = async (resumeId: number) => {
    setAllResumes((prev) =>
      prev.filter((resume) => Number(resume.id) !== resumeId)
    );
    setDeleteResume(false);
  };

  useEffect(() => {
    const state = searchParams.get("state");
    if (state === "login" || state === "register") {
      navigate(`/auth/login?state=${state}`);
      return;
    }
    loadAllResumes();
  }, [searchParams, navigate]);

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-2xl font-medium mb-6 bg-grandient-to-r from-slate-500 to-slate-700 bg-clip-text text-transparent sm:hidden">
          {t("welcome")}, Joe Doe
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => setShowCreateResume(true)}
            className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <PlusIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500 text-white rounded-full" />
            <p className="text-sm group hover:text-indigo-600 transition-all duration-300">
              {t("createResume")}
            </p>
          </button>

          <button
            onClick={() => setShowUploadResume(true)}
            className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hober:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <UploadCloudIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-indigo-300 to-purple-500 text-white rounded-full" />
            <p className="text-sm group hover:text-purple-600 transition-all duration-300">
              {t("uploadExisting")}
            </p>
          </button>
        </div>

        <hr className="border-slate-300 my-6 sm:w-[305px]" />

        <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
          {allResumes.map(
            (resume: Resume & { updatedAt?: string | Date }, index: number) => {
              const baseColor = colors[index % colors.length];

              return (
                <button
                  onClick={() => navigate(`/app/builder/${resume.id}`)}
                  key={index}
                  className="relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group group-hover:shadow-lg transition-all duration-300 cursor-pointer"
                  style={{
                    background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`,
                    borderColor: baseColor + "40",
                  }}
                >
                  <FilePenLineIcon
                    className="size-7 group-hover:scale-105 transition-all:"
                    style={{ color: baseColor }}
                  />
                  <p
                    className="text-sm group-hover:scale-105 transition-all px-2 text-center"
                    style={{ color: baseColor }}
                  >
                    {resume.title}
                  </p>
                  <p
                    className="absolute bottom-1 text-[11px] text-slate-400 group-hover:text-slate-500 transition-all duration-300 px-2 text-center"
                    style={{ color: baseColor + "90" }}
                  >
                    {t("updatedOn")}{" "}
                    {resume.updatedAt
                      ? new Date(resume.updatedAt).toLocaleDateString()
                      : ""}
                  </p>
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-1 right-1 hidden group-hover:flex items-center "
                  >
                    <Popover
                      open={openPopoverId === String(resume.id)}
                      onOpenChange={(visible) =>
                        setOpenPopoverId(visible ? String(resume.id) : null)
                      }
                      content={
                        <div className="flex flex-col gap-1 py-1">
                          <button
                            onClick={() => {
                              setDeleteResume(true);
                              setDeleteResumeId(Number(resume.id));
                              setOpenPopoverId(null);
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-red-700 hover:bg-red-50 transition-colors"
                          >
                            <TrashIcon className="size-4 text-red-700 transition-colors" />
                            {t("Delete")}
                          </button>

                          <button
                            onClick={() => {
                              setEditResumeId(resume.id ?? "");
                              setTitle(resume.title ?? "");
                              setOpenPopoverId(null);
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            <PencilIcon className="size-4 text-blue-600 transition-colors" />
                            {t("Edit")}
                          </button>

                          <button
                            onClick={() => {
                              // TODO: implement duplicate logic
                              setOpenPopoverId(null);
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-purple-600 hover:bg-purple-50 transition-colors"
                          >
                            <Copy className="size-4 text-purple-600 transition-colors" />
                            {t("Duplicate")}
                          </button>
                        </div>
                      }
                      trigger="click"
                      className="cursor-pointer"
                      arrow={false}
                    >
                      <MoreVertical className="size-5 text-black/65" />
                    </Popover>
                  </div>
                </button>
              );
            }
          )}
        </div>

        <Modal
          title={t("createResume")}
          open={showCreateResume}
          onCancel={() => {
            setShowCreateResume(false);
            setTitle("");
          }}
          width={"500px"}
          onOk={createResume}
          okButtonProps={{
            style: { backgroundColor: "#9810fa" },
          }}
          okText={t("createResume")}
        >
          <Input
            placeholder={t("enterResumeTitle")}
            size="large"
            maxLength={100}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Modal>

        <Modal
          title={t("Upload Resume")}
          open={showUploadResume}
          onCancel={() => {
            setShowUploadResume(false);
            setTitle("");
          }}
          width={"500px"}
          onOk={uploadResume}
          okButtonProps={{
            style: { backgroundColor: "#9810fa" },
          }}
          okText={t("Upload Resume")}
        >
          <Input
            placeholder={t("Enter resume title")}
            size="large"
            maxLength={100}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="mt-4">
            <label
              htmlFor="resume-input"
              className="block text-sm text-slate-700"
            >
              {t("selectResumeFile")}
              <div className="flex flex-col items-center justify-center gap-2 border group text-slate-400 border-slate-400 border-dashed rounded-md p-4 py-10 my-4 hover::border-purple-500 hover:text-purple-700 cursor-pointer transition-colors">
                {resume ? (
                  <p className="text-purple-700">{resume.name}</p>
                ) : (
                  <>
                    <UploadCloud className="size-14 stroke-1" />
                    <p>{t("Upload resume")}</p>
                  </>
                )}
              </div>
            </label>
            <input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setResume(e.target.files?.[0] ?? null)
              }
              type="file"
              id="resume-input"
              accept=".pdf"
              hidden
            />
          </div>
        </Modal>

        <Modal
          title={t("editResumeTitle")}
          open={!!editResumeId}
          onCancel={() => {
            setEditResumeId("");
            setTitle("");
          }}
          width={"500px"}
          onOk={editTitle}
          okButtonProps={{
            style: { backgroundColor: "#9810fa" },
          }}
          okText={t("update")}
        >
          <Input
            placeholder={t("enterResumeTitle")}
            size="large"
            maxLength={100}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Modal>

        <Modal
          title={
            <span className="flex items-center gap-2">
              <AlertCircle style={{ color: "#dc2626" }} />
              {t("deleteResume")}
            </span>
          }
          open={deleteResume}
          onCancel={() => {
            setDeleteResume(false);
            setTitle("");
          }}
          width={"500px"}
          onOk={() => handleDeleteResume(deleteResumeId as number)}
          okButtonProps={{
            style: { backgroundColor: "#dc2626" },
          }}
          okText={t("delete")}
        >
          <p>{t("areYouSureYouWantToDeleteThisResume")}</p>
        </Modal>
      </div>
    </div>
  );
}
