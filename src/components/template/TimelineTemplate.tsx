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

export const TimelineTemplate = ({
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
      className="bg-white max-w-4xl mx-auto rounded-lg p-10"
      style={{ fontFamily }}
    >
      {/* Header */}
      <header className="flex items-start justify-between gap-6 mb-10">
        <div className="flex items-start gap-4">
          {data.personal_info?.image && (
            <img
              src={data.personal_info.image}
              alt={data.personal_info.full_name}
              className="w-20 h-20 rounded-full object-cover border-2 shadow-sm"
              style={{ borderColor: accentColor }}
            />
          )}
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              {data.personal_info?.full_name}
            </h1>
            <p className="text-base text-gray-600 mt-1">
              {data.personal_info?.profession}
            </p>
            {data.professional_summary && (
              <p className="text-sm text-gray-700 mt-4 max-w-xl leading-relaxed">
                {data.professional_summary}
              </p>
            )}
          </div>
        </div>
        <div className="text-xs text-gray-600 space-y-1">
          {data.personal_info?.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-3 h-3" />
              <span>{data.personal_info.email}</span>
            </div>
          )}
          {data.personal_info?.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-3 h-3" />
              <span>{data.personal_info.phone}</span>
            </div>
          )}
          {data.personal_info?.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3" />
              <span>{data.personal_info.location}</span>
            </div>
          )}
          {data.personal_info?.website && (
            <div className="flex items-center gap-2">
              <Globe className="w-3 h-3" />
              <a href={data.personal_info.website} className="hover:underline">
                {data.personal_info.website}
              </a>
            </div>
          )}
          {data.personal_info?.birthDate && (
            <div className="flex items-center gap-2">
              <CalendarDays className="w-3 h-3" />
              <span>{data.personal_info.birthDate}</span>
            </div>
          )}
          {data.personal_info?.gender && (
            <div className="flex items-center gap-2">
              {data.personal_info.gender === "Female" ? (
                <Venus className="w-3 h-3" />
              ) : data.personal_info.gender === "Male" ? (
                <Mars className="w-3 h-3" />
              ) : (
                <VenusAndMars className="w-3 h-3" />
              )}
              <span>{data.personal_info.gender}</span>
            </div>
          )}
          {data.personal_info?.language && (
            <div className="flex items-center gap-2">
              <Library className="w-3 h-3" />
              <span>{data.personal_info.language}</span>
            </div>
          )}
        </div>
      </header>

      <div className="grid md:grid-cols-[2fr,1fr] gap-10">
        {/* Timeline column */}
        <section>
          {data.experience && data.experience.length > 0 && (
            <div className="mb-8">
              <h2
                className="text-sm font-semibold uppercase tracking-[0.25em] mb-4 text-gray-700"
                style={{ color: accentColor }}
              >
                {t("Experience")}
              </h2>
              <div className="relative pl-6">
                <div
                  className="absolute left-1 top-1 bottom-1 w-px bg-gray-200"
                  aria-hidden
                />
                <div className="space-y-6">
                  {data.experience.map((exp, index) => (
                    <div key={index} className="relative">
                      <div
                        className="absolute -left-[7px] mt-1 w-3 h-3 rounded-full border-2 bg-white"
                        style={{ borderColor: accentColor }}
                      />
                      <div className="ml-2">
                        <div className="flex justify-between gap-4 mb-1">
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900">
                              {exp.position}
                            </h3>
                            <p className="text-xs text-gray-600">
                              {exp.company}
                            </p>
                          </div>
                          <div className="text-[11px] text-gray-500 whitespace-nowrap">
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
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {data.education && data.education.length > 0 && (
            <div className="mb-4">
              <h2
                className="text-sm font-semibold uppercase tracking-[0.25em] mb-4 text-gray-700"
                style={{ color: accentColor }}
              >
                {t("Education")}
              </h2>
              <div className="relative pl-6">
                <div
                  className="absolute left-1 top-1 bottom-1 w-px bg-gray-200"
                  aria-hidden
                />
                <div className="space-y-5">
                  {data.education.map((edu, index) => (
                    <div key={index} className="relative">
                      <div
                        className="absolute -left-[7px] mt-1 w-3 h-3 rounded-full border-2 bg-white"
                        style={{ borderColor: accentColor }}
                      />
                      <div className="ml-2">
                        <div className="flex justify-between gap-4 mb-1">
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900">
                              {edu.degree}
                            </h3>
                            <p className="text-xs text-gray-600">
                              {edu.institution}
                              {edu.field && ` • ${edu.field}`}
                            </p>
                          </div>
                          <div className="text-[11px] text-gray-500 whitespace-nowrap">
                            {edu.graduation_date &&
                              formatDate(edu.graduation_date)}
                          </div>
                        </div>
                        {edu.gpa && (
                          <p className="text-[11px] text-gray-600">
                            GPA: {edu.gpa}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Side column */}
        <section className="space-y-6">
          {Array.isArray(data.skills) && data.skills.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.25em] mb-3 text-gray-700">
                {t("Skills")}
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-[11px] font-medium border"
                    style={{
                      borderColor: accentColor + "40",
                      color: accentColor,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {data.project && data.project.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.25em] mb-3 text-gray-700">
                {t("Projects")}
              </h2>
              <div className="space-y-3">
                {data.project.map((project, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-md p-3"
                  >
                    <h3 className="text-sm font-semibold text-gray-900">
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className="text-xs text-gray-700 mt-1 leading-relaxed whitespace-pre-line">
                        {project.description}
                      </p>
                    )}
                    {project.technologies &&
                      project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.technologies.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="px-2 py-0.5 rounded-full text-[10px] bg-gray-100 text-gray-700"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.certifications && data.certifications.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.25em] mb-3 text-gray-700">
                {t("Certifications")}
              </h2>
              <div className="space-y-3">
                {data.certifications.map((cert, index) => (
                  <div key={index}>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {cert.name}
                    </h3>
                    {cert.issuer && (
                      <p className="text-xs text-gray-600">{cert.issuer}</p>
                    )}
                    {(cert.issueDate ||
                      cert.expiryDate ||
                      cert.credentialId) && (
                      <p className="text-[11px] text-gray-500 mt-1">
                        {cert.issueDate && formatDate(cert.issueDate)}
                        {cert.expiryDate && ` - ${formatDate(cert.expiryDate)}`}
                        {cert.credentialId && ` • ID: ${cert.credentialId}`}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
