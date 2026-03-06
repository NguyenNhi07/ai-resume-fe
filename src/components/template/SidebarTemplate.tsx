import type { Resume } from "@/lib/type";
import dayjs from "dayjs";
import {
  CalendarDays,
  Globe,
  Library,
  Mail,
  MapPin,
  Mars,
  Phone,
  Venus,
  VenusAndMars,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export const SidebarTemplate = ({
  data,
  accentColor,
}: {
  data: Resume;
  accentColor: string;
}) => {
  const { t } = useTranslation();
  const fontMap: Record<string, string> = {
    times: "Times New Roman, serif",
    inter: "Inter, system-ui, sans-serif",
    georgia: "Georgia, serif",
    arial: "Arial, Helvetica, sans-serif",
    roboto: "Roboto, sans-serif",
    poppins: "Poppins, sans-serif",
    mulish: "Mulish, sans-serif",
    helvetica: "Helvetica Neue, Helvetica, Arial, sans-serif",
    calibri: "Calibri, Candara, Segoe, Segoe UI, Optima, Arial, sans-serif",
    garamond:
      "Garamond, Baskerville, Baskerville Old Face, Hoefler Text, Times New Roman, serif",
    cambria: "Cambria, Georgia, serif",
    nunito: "Nunito, sans-serif",
    montserrat: "Montserrat, sans-serif",
  };

  const fontFamily =
    (data.font_family && fontMap[data.font_family]) ||
    "Inter, system-ui, sans-serif";

  const formatDate = (date: string) => {
    if (!date) return "";
    const parsed = dayjs(date, "MM/YYYY", true).isValid()
      ? dayjs(date, "MM/YYYY")
      : dayjs(date);
    return parsed.isValid() ? parsed.format("MMM YYYY") : date;
  };

  return (
    <div
      className="bg-white max-w-5xl mx-auto rounded-lg overflow-hidden shadow-sm"
      style={{ fontFamily }}
    >
      <div className="grid grid-cols-3 min-h-[900px]">
        {/* Sidebar */}
        <aside
          className="col-span-1 text-white p-8 flex flex-col gap-8"
          style={{ backgroundColor: accentColor }}
        >
          <div className="flex flex-col items-center text-center gap-4">
            {data.personal_info?.image && (
              <img
                src={data.personal_info.image}
                alt={data.personal_info.full_name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            )}
            <div>
              <h1 className="text-2xl font-semibold">
                {data.personal_info?.full_name}
              </h1>
              <p className="text-sm opacity-90 mt-1">
                {data.personal_info?.profession}
              </p>
            </div>
          </div>

          <div className="space-y-6 text-sm">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] mb-3 opacity-90">
                {t("Contact")}
              </h2>
              <div className="space-y-2 opacity-95">
                {data.personal_info?.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{data.personal_info.email}</span>
                  </div>
                )}
                {data.personal_info?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{data.personal_info.phone}</span>
                  </div>
                )}
                {data.personal_info?.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{data.personal_info.location}</span>
                  </div>
                )}
                {data.personal_info?.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <a
                      href={data.personal_info.website}
                      className="underline underline-offset-2"
                    >
                      {data.personal_info.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {(data.personal_info?.birthDate ||
              data.personal_info?.gender ||
              data.personal_info?.language) && (
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] mb-3 opacity-90">
                  {t("Details")}
                </h2>
                <div className="space-y-2 opacity-95">
                  {data.personal_info?.birthDate && (
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" />
                      <span>{data.personal_info.birthDate}</span>
                    </div>
                  )}
                  {data.personal_info?.gender && (
                    <div className="flex items-center gap-2">
                      {data.personal_info.gender === "Female" ? (
                        <Venus className="w-4 h-4" />
                      ) : data.personal_info.gender === "Male" ? (
                        <Mars className="w-4 h-4" />
                      ) : (
                        <VenusAndMars className="w-4 h-4" />
                      )}
                      <span>{data.personal_info.gender}</span>
                    </div>
                  )}
                  {data.personal_info?.language && (
                    <div className="flex items-center gap-2">
                      <Library className="w-4 h-4" />
                      <span>{data.personal_info.language}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {Array.isArray(data.skills) && data.skills.length > 0 && (
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] mb-3 opacity-90">
                  {t("Skills")}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full bg-white/10 text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main content */}
        <main className="col-span-2 p-10 space-y-10">
          {data.professional_summary && (
            <section className="space-y-3">
              <h2
                className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500"
                style={{ color: accentColor }}
              >
                {t("Profile")}
              </h2>
              <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">
                {data.professional_summary}
              </p>
            </section>
          )}

          {data.experience && data.experience.length > 0 && (
            <section className="space-y-5">
              <h2 className="text-base font-semibold tracking-wide text-gray-900">
                {t("Experience")}
              </h2>
              <div className="space-y-4">
                {data.experience.map((exp, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 pb-3 last:border-none last:pb-0"
                  >
                    <div className="flex justify-between items-baseline gap-4 mb-1">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                          {exp.position}
                        </h3>
                        <p className="text-xs text-gray-600">{exp.company}</p>
                      </div>
                      <div className="text-xs text-gray-500 whitespace-nowrap">
                        {exp.start_date && formatDate(exp.start_date)} -{" "}
                        {exp.end_date && formatDate(exp.end_date)}
                      </div>
                    </div>
                    {exp.description && (
                      <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.education && data.education.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-base font-semibold tracking-wide text-gray-900">
                {t("Education")}
              </h2>
              <div className="space-y-3">
                {data.education.map((edu, index) => (
                  <div key={index} className="flex justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        {edu.degree}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {edu.institution}
                        {edu.field && ` • ${edu.field}`}
                      </p>
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      {edu.graduation_date && formatDate(edu.graduation_date)}
                      {edu.gpa && (
                        <div className="mt-1 font-medium">
                          GPA: {edu.gpa}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.project && data.project.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-base font-semibold tracking-wide text-gray-900">
                {t("Projects")}
              </h2>
              <div className="space-y-3">
                {data.project.map((project, index) => (
                  <div key={index} className="border border-gray-100 rounded-lg p-3">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className="text-xs text-gray-700 leading-relaxed mt-1 whitespace-pre-line">
                        {project.description}
                      </p>
                    )}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                            style={{
                              backgroundColor: accentColor + "15",
                              color: accentColor,
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.certifications && data.certifications.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-base font-semibold tracking-wide text-gray-900">
                {t("Certifications")}
              </h2>
              <div className="space-y-3">
                {data.certifications.map((cert, index) => (
                  <div key={index} className="flex justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        {cert.name}
                      </h3>
                      {cert.issuer && (
                        <p className="text-xs text-gray-600">{cert.issuer}</p>
                      )}
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-gray-500 underline mt-1 inline-block"
                        >
                          {t("View Credential")}
                        </a>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-500 text-right">
                      {cert.issueDate && formatDate(cert.issueDate)}
                      {cert.expiryDate && ` - ${formatDate(cert.expiryDate)}`}
                      {cert.credentialId && (
                        <div className="mt-1">ID: {cert.credentialId}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

