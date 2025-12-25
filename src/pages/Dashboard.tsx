import { useToast } from "@/hooks/useToast";
import { resumeApi } from "@/lib/api";
import type { Resume } from "@/lib/type";
import { cn } from "@/lib/utils";
import { Button, Input, Modal, Popover, Spin, Table, Tooltip } from "antd";
import {
  AlertCircle,
  Copy,
  FileTextIcon,
  LayoutGrid,
  List,
  MoreVertical,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
  UploadCloud
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useToast();

  const [allResumes, setAllResumes] = useState<Resume[]>([]);
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [title, setTitle] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [editResumeId, setEditResumeId] = useState<string | null>("");
  const [deleteResumeId, setDeleteResumeId] = useState<number | undefined>();
  const [deleteResume, setDeleteResume] = useState(false);
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
  const [duplicateResumeId, setDuplicateResumeId] = useState<string | null>(null);
  const [recentResumes, setRecentResumes] = useState<Resume[]>([]);
  const [search, setSearch] = useState("");
  const [loadingTable, setLoadingTable] = useState(false);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [tableSort, setTableSort] = useState<{
    field?: 'title' | 'createdAt' | 'updatedAt';
    order?: 'ascend' | 'descend';
  }>({});
  const [pagination, setPagination] = useState<{
    current: number;
    pageSize: number;
    total: number;
  }>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const loadAllResumes = async (options?: {
    page?: number;
    sortField?: 'title' | 'createdAt' | 'updatedAt';
    sortOrder?: 'ascend' | 'descend';
  }) => {
    setLoadingTable(true);
    try {
      let sortBy: 'title' | 'createdAt' | 'updatedAt' | undefined;
      let sortOrder: 'asc' | 'desc' | undefined;

      if (options?.sortField) {
        sortBy = options.sortField;
        sortOrder = options.sortOrder === 'ascend' ? 'asc' : 'desc';
      }

      const page = options?.page ?? pagination.current;
      const result = await resumeApi.list({
        page,
        pageSize: pagination.pageSize,
        ...(sortBy && sortOrder ? { sortBy, sortOrder } : {}),
      });
      setAllResumes(result.data);
      if (result.pagination) {
        setPagination((prev) => ({
          ...prev,
          current: result.pagination!.page,
          total: result.pagination!.total,
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTable(false);
    }
  };

  const loadRecentResumes = async () => {
    setLoadingRecent(true);
    try {
      const result = await resumeApi.list({
        page: 1,
        pageSize: 5,
        sortBy: 'updatedAt',
        sortOrder: 'desc',
      });
      setRecentResumes(result.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingRecent(false);
    }
  };

  const filteredResumes = allResumes.filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.title?.toLowerCase().includes(q) ||
      r.personal_info?.full_name?.toLowerCase().includes(q)
    );
  });

  const createResume = async (event: React.FormEvent) => {
    event.preventDefault();
    setShowCreateResume(false);
    try {
      const created = await resumeApi.createWithTitle(title || "New Resume");
      // Reload first page to show new resume
      loadAllResumes({ page: 1 });
      setRecentResumes((prev) => [created, ...prev].slice(0, 5));
      navigate(`/app/builder/${created.id}`);
    } catch (e) {
      console.error(e);
    }
  };

  const uploadResume = async (event: React.FormEvent) => {
    event.preventDefault();
    setShowUploadResume(false);
    navigate(`/app/builder/resume123`);
  };

  const editTitle = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editResumeId || !title.trim()) return;
    try {
      const target = allResumes.find((r) => String(r.id) === String(editResumeId));
      if (!target) return;
      const updatedResume: Resume = { ...target, title: title.trim() };
      await resumeApi.update(String(updatedResume.id), updatedResume);
      // Reload current page
      loadAllResumes({ page: pagination.current });
      toast.success(t("Update resume title success"));
    } catch (e) {
      console.error(e);
      toast.error(t("Update resume title failed"));
    } finally {
      setEditResumeId("");
      setTitle("");
    }
  };

  const handleDeleteResume = async (resumeId: number) => {
    try {
      await resumeApi.remove(String(resumeId));
      // Reload current page
      loadAllResumes({ page: pagination.current });
      setRecentResumes((prev) =>
        prev.filter((resume) => Number(resume.id) !== resumeId)
      );
    } catch (e) {
      console.error(e);
    } finally {
      setDeleteResume(false);
    }
  };

  useEffect(() => {
    const state = searchParams.get("state");
    if (state === "login" || state === "register") {
      navigate(`/auth/login?state=${state}`);
      return;
    }
    // default: load first page, recents by updatedAt desc (pageSize 5)
    loadAllResumes({ page: 1 });
    loadRecentResumes();
  }, [searchParams, navigate]);

  return (
    <div className="h-full">
      <div className="h-[200px] flex items-center justify-betweenq flex-col gap-6 pt-6" style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, #f9fafb), linear-gradient(to right,rgb(212, 249, 255),rgb(236, 211, 255))" }}>
        <span className="text-[50px] font-medium text-black/70">{t("All Resumes")}</span>
        <div
          className="p-[1px] rounded-full bg-gradient-to-r from-cyan-300 to-purple-400 w-[600px]"
        >
          <div
            className="flex items-center gap-3 bg-white rounded-full px-5 py-4"
          >
            <SearchIcon className="size-4 text-gray-500" />
            <input
              className="flex-1 outline-none text-sm"
              placeholder={t("Search resume")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-3">
        <div className="flex justify-end gap-2">
          <Tooltip title={view === 'grid' ? t("List View") : t("Grid View")}><Button variant="text" onClick={() => { setView(view === 'list' ? 'grid' : 'list') }}>{view === 'grid' ? <List /> : <LayoutGrid />}</Button></Tooltip>
          <Tooltip title={t("Add new resume")}><Button variant="text" onClick={() => { setShowCreateResume(true) }}><PlusIcon /></Button></Tooltip>
        </div>

        <div className="flex flex-col gap-2">
          {recentResumes.length > 0 && (
            <>
              <span className="text-[32px] font-medium text-black/70">{t('Recents')}</span>
              <div className="flex gap-2 items-center">
                {loadingRecent && (
                  <div className="w-full flex justify-center py-6">
                    <Spin />
                  </div>
                )}
                {recentResumes.map(
                  (resume: Resume & { updatedAt?: string | Date }, index: number) => {
                    return (
                      <div onClick={() => navigate(`/app/builder/${resume.id}`)} key={index} className="flex flex-col cursor-pointer relative group group-hover:shadow-lg transition-all duration-300">
                        <div className="mb-2 bg-gray-100 rounded-xl p-2 w-[150px] h-[150px] flex items-center justify-center">
                          <FileTextIcon className="size-6 text-gray-500" />
                        </div>
                        <span className="text-base text-black/70">{resume.title}</span>
                        <span className="text-sm text-gray-500">{t('Updated on ')}{resume.updatedAt ? new Date(resume.updatedAt).toLocaleDateString() : ''}</span>
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute top-1 right-1 hidden group-hover:flex items-center "
                        >
                          <Popover
                            open={openPopoverId === `recent-${resume.id}`}
                            onOpenChange={(visible) =>
                              setOpenPopoverId(visible ? `recent-${resume.id}` : null)
                            }
                            getPopupContainer={(trigger) => trigger.parentElement || document.body}
                            content={
                              <div className="flex flex-col gap-1 py-1" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
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
                                  onClick={(e) => {
                                    e.stopPropagation();
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
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // TODO: implement duplicate logic
                                    setDuplicateResumeId(resume.id ?? "");
                                    setTitle(`${resume.title || t("enterResumeTitle")} (copy)`);
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
                      </div>
                    )
                  }
                )}
              </div>
            </>
          )}
        </div>

        <div className="bg-white rounded-xl mt-5 gap-2 flex flex-col">
          <div className="text-[32px] font-medium text-black/70 p-4">{t('Resumes')}</div>
          {view === 'list' ? (
            <Table
              onRow={(record) => ({
                onClick: () => {
                  navigate(`/app/builder/${record.id}`);
                },
              })}
              dataSource={search.trim() ? filteredResumes : allResumes}
              loading={loadingTable}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: search.trim() ? filteredResumes.length : pagination.total,
                showSizeChanger: false,
                onChange: (page) => {
                  if (!search.trim()) {
                    loadAllResumes({ page });
                  }
                },
              }}
              onChange={(_, __, sorter: any) => {
                const field = sorter.field as 'title' | 'createdAt' | 'updatedAt' | undefined;
                const order = sorter.order as 'ascend' | 'descend' | undefined;
                if (field && order) {
                  setTableSort({ field, order });
                  const sortField: 'title' | 'createdAt' | 'updatedAt' =
                    field === 'title' ? 'title' : field === 'createdAt' ? 'createdAt' : 'updatedAt';
                  loadAllResumes({ page: pagination.current, sortField, sortOrder: order });
                } else {
                  setTableSort({});
                  loadAllResumes({ page: pagination.current });
                }
              }}
            >
              <Table.Column
                width={200}
                title={t("Title")}
                dataIndex="title"
                key="title"
                sorter
                sortOrder={tableSort.field === 'title' ? tableSort.order : null}
              />
              <Table.Column width={200} title={t("Status")} dataIndex="isPublic" key="isPublic" render={(value) => !value ? t("Private") : t("Public")} />
              <Table.Column
                width={200}
                title={t("Created on")}
                dataIndex="createdAt"
                key="createdAt"
                sorter
                sortOrder={tableSort.field === 'createdAt' ? tableSort.order : null}
                render={(value) => value ? new Date(value).toLocaleDateString() : ''}
              />
              <Table.Column
                width={200}
                title={t("Updated on")}
                dataIndex="updatedAt"
                key="updatedAt"
                sorter
                sortOrder={tableSort.field === 'updatedAt' ? tableSort.order : null}
                render={(value) => value ? new Date(value).toLocaleDateString() : ''}
              />
              <Table.Column width={100} title={t("Actions")} key="actions" render={(_, record) => (
                <div className="flex gap-4">
                  <Tooltip title={t("Edit")}><button
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditResumeId(record.id ?? "");
                      setTitle(record.title ?? "");
                    }}
                  >
                    <PencilIcon className="size-4 text-blue-600 transition-colors cursor-pointer" />
                  </button></Tooltip>
                  <Tooltip title={t("Delete")}><button
                    onClick={(e) => {
                      e.stopPropagation()
                      setDeleteResume(true);
                      setDeleteResumeId(Number(record.id));
                    }}
                  >
                    <TrashIcon className="size-4 text-red-700 transition-colors cursor-pointer" />
                  </button></Tooltip>
                  <Tooltip title={t("Duplicate")}><button
                    onClick={(e) => {
                      e.stopPropagation()
                      // TODO: implement duplicate logic
                      setDuplicateResumeId(record.id ?? "");
                      setTitle(`${record.title || t("enterResumeTitle")} (copy)`);
                    }}
                  >
                    <Copy className="size-4 text-purple-600 transition-colors cursor-pointer" />
                  </button></Tooltip>
                </div>
              )} />
            </Table>
          ) : (
            <div className={cn("flex gap-2 items-center", view === 'grid' ? 'px-4 pb-4' : undefined)}>
              {loadingTable && (
                <div className="w-full flex justify-center py-6">
                  <Spin />
                </div>
              )}
              {filteredResumes.map(
                (resume: Resume & { updatedAt?: string | Date }, index: number) => {
                  return (
                    <div onClick={() => navigate(`/app/builder/${resume.id}`)} key={index} className="flex flex-col cursor-pointer relative group group-hover:shadow-lg transition-all duration-300">
                      <div className="mb-2 bg-gray-100 rounded-xl p-2 w-[150px] h-[150px] flex items-center justify-center">
                        <FileTextIcon className="size-6 text-gray-500" />
                      </div>
                      <span className="text-base text-black/70">{resume.title}</span>
                      <span className="text-sm text-gray-500">{t('Updated on ')}{resume.updatedAt ? new Date(resume.updatedAt).toLocaleDateString() : ''}</span>
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-1 right-1 hidden group-hover:flex items-center "
                      >
                        <Popover
                          open={openPopoverId === `grid-${resume.id}`}
                          onOpenChange={(visible) =>
                            setOpenPopoverId(visible ? `grid-${resume.id}` : null)
                          }
                          getPopupContainer={(trigger) => trigger.parentElement || document.body}
                          content={
                            <div className="flex flex-col gap-1 py-1" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
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
                                onClick={(e) => {
                                  e.stopPropagation();
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // TODO: implement duplicate logic
                                  setDuplicateResumeId(resume.id ?? "");
                                  setTitle(`${resume.title || t("enterResumeTitle")} (copy)`);
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
                    </div>
                  )
                }
              )}
            </div>
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

        <Modal
          title={t("Duplicate")}
          open={!!duplicateResumeId}
          onCancel={() => {
            setDuplicateResumeId(null);
            setTitle("");
          }}
          width={"500px"}
          onOk={async () => {
            if (!duplicateResumeId || !title.trim()) return;
            try {
              const base = allResumes.find(
                (r) => String(r.id) === String(duplicateResumeId),
              );
              if (!base) return;

              // Tạo bản copy, chỉ đổi title, bỏ id
              const payload: Resume = {
                ...base,
                id: "",
                title: title.trim(),
              };
              const created = await resumeApi.create(payload);
              // Reload first page to show new resume
              loadAllResumes({ page: 1 });
              setRecentResumes((prev) => [created, ...prev].slice(0, 5));
              toast.success(t("Duplicate resume successfully"));
              navigate(`/app/builder/${created.id}`);
            } catch (e) {
              console.error(e);
              toast.error(t("Duplicate resume failed"));
            } finally {
              setDuplicateResumeId(null);
              setTitle("");
            }
          }}
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
      </div>
    </div>
  );
}
