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

export const ElegantTemplate = ({
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
    "Garamond, Baskerville, 'Times New Roman', serif";

  const formatDate = (date: string) => {
    if (!date) return "";
    const parsed = dayjs(date, "MM/YYYY", true).isValid()
      ? dayjs(date, "MM/YYYY")
      : dayjs(date);
    return parsed.isValid() ? parsed.format("MMM YYYY") : date;
  };

  return (
    <div
      className="bg-[#f8f5f1] max-w-4xl mx-auto rounded-lg border border-[#e2d6c8] p-10"
      style={{ fontFamily }}
    >
      {/* Top bar */}
      <div
        className="h-1 w-24 mb-6 rounded-full"
        style={{ backgroundColor: accentColor }}
      />

      {/* Header */}
      <header className="mb-8 flex items-start justify-between gap-8">
        <div className="flex items-start gap-4">
          {data.personal_info?.image && (
            <img
              src={data.personal_info.image}
              alt={data.personal_info.full_name}
              className="w-16 h-16 rounded-full object-cover border border-[#d9cbb8]"
              style={{ borderColor: accentColor }}
            />
          )}
          <div>
            <h1 className="text-3xl tracking-wide text-gray-900">
              {data.personal_info?.full_name}
            </h1>
            <p className="text-sm uppercase tracking-[0.3em] text-gray-600 mt-2">
              {data.personal_info?.profession}
            </p>
          </div>
        </div>
        <div className="text-xs text-gray-700 space-y-1 text-right">
          {data.personal_info?.email && (
            <div className="flex items-center gap-2 justify-end">
              <Mail className="w-3 h-3" />
              <span>{data.personal_info.email}</span>
            </div>
          )}
          {data.personal_info?.phone && (
            <div className="flex items-center gap-2 justify-end">
              <Phone className="w-3 h-3" />
              <span>{data.personal_info.phone}</span>
            </div>
          )}
          {data.personal_info?.location && (
            <div className="flex items-center gap-2 justify-end">
              <MapPin className="w-3 h-3" />
              <span>{data.personal_info.location}</span>
            </div>
          )}
          {data.personal_info?.website && (
            <div className="flex items-center gap-2 justify-end">
              <Globe className="w-3 h-3" />
              <a
                href={data.personal_info.website}
                className="underline underline-offset-2"
              >
                {data.personal_info.website}
              </a>
            </div>
          )}
          {data.personal_info?.birthDate && (
            <div className="flex items-center gap-2 justify-end">
              <CalendarDays className="w-3 h-3" />
              <span>{data.personal_info.birthDate}</span>
            </div>
          )}
          {data.personal_info?.gender && (
            <div className="flex items-center gap-2 justify-end">
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
            <div className="flex items-center gap-2 justify-end">
              <Library className="w-3 h-3" />
              <span>{data.personal_info.language}</span>
            </div>
          )}
        </div>
      </header>

      <main className="grid md:grid-cols-[3fr,2fr] gap-10">
        <section className="space-y-6">
          {data.professional_summary && (
            <div>
              <h2
                className="text-xs tracking-[0.35em] uppercase text-gray-600 mb-2"
                style={{ color: accentColor }}
              >
                {t("Profile")}
              </h2>
<p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
              {data.professional_summary}
              </p>
            </div>
          )}

          {data.experience && data.experience.length > 0 && (
            <div>
              <h2
                className="text-xs tracking-[0.35em] uppercase text-gray-600 mb-2"
                style={{ color: accentColor }}
              >
                {t("Experience")}
              </h2>
              <div className="space-y-4">
                {data.experience.map((exp, index) => (
                  <div
                    key={index}
                    className="border-l border-[#d9cbb8] pl-4 pb-1"
                  >
                    <div className="flex justify-between gap-4 mb-1">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                          {exp.position}
                        </h3>
                        <p className="text-xs text-gray-700">{exp.company}</p>
                      </div>
                      <p className="text-[11px] text-gray-600 whitespace-nowrap">
                        {exp.start_date && formatDate(exp.start_date)} -{" "}
                        {exp.end_date && formatDate(exp.end_date)}
                      </p>
                    </div>
                    {exp.description && (
                      <p className="text-xs text-gray-800 leading-relaxed whitespace-pre-line">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.project && data.project.length > 0 && (
            <div>
              <h2
                className="text-xs tracking-[0.35em] uppercase text-gray-600 mb-2"
                style={{ color: accentColor }}
              >
                {t("Projects")}
              </h2>
              <div className="space-y-3">
                {data.project.map((project, index) => (
                  <div
                    key={index}
                    className="border border-[#e7dbcc] rounded-md px-3 py-2 bg-white/60"
                  >
                    <h3 className="text-sm font-semibold text-gray-900">
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className="text-xs text-gray-800 mt-1 leading-relaxed whitespace-pre-line">
                        {project.description}
                      </p>
                    )}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-2 py-0.5 rounded-full text-[10px] border border-[#d9cbb8] text-gray-800"
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
        </section>

        <section className="space-y-6">
          {data.education && data.education.length > 0 && (
            <div>
              <h2
                className="text-xs tracking-[0.35em] uppercase text-gray-600 mb-2"
                style={{ color: accentColor }}
              >
                {t("Education")}
              </h2>
              <div className="space-y-3">
                {data.education.map((edu, index) => (
                  <div
                    key={index}
                    className="border border-[#e7dbcc] rounded-md px-3 py-2 bg-white/60"
                  >
                    <div className="flex justify-between gap-4 mb-1">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                          {edu.degree}
                        </h3>
                        <p className="text-xs text-gray-700">
                          {edu.institution}
                          {edu.field && ` • ${edu.field}`}
                        </p>
                      </div>
                      <p className="text-[11px] text-gray-600 whitespace-nowrap">
                        {edu.graduation_date &&
                          formatDate(edu.graduation_date)}
                      </p>
                    </div>
                    {edu.gpa && (
                      <p className="text-[11px] text-gray-700">
                        GPA: {edu.gpa}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.certifications && data.certifications.length > 0 && (
            <div>
              <h2
                className="text-xs tracking-[0.35em] uppercase text-gray-600 mb-2"
                style={{ color: accentColor }}
              >
                {t("Certifications")}
              </h2>
              <div className="space-y-3">
                {data.certifications.map((cert, index) => (
                  <div key={index}>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {cert.name}
                    </h3>
                    {cert.issuer && (
                      <p className="text-xs text-gray-700">{cert.issuer}</p>
                    )}
                    {(cert.issueDate || cert.expiryDate || cert.credentialId) && (
                      <p className="text-[11px] text-gray-700 mt-1">
                        {cert.issueDate && formatDate(cert.issueDate)}
                        {cert.expiryDate &&
                          ` - ${formatDate(cert.expiryDate)}`}
                        {cert.credentialId && ` • ID: ${cert.credentialId}`}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {Array.isArray(data.skills) && data.skills.length > 0 && (
            <div>
              <h2
                className="text-xs tracking-[0.35em] uppercase text-gray-600 mb-2"
                style={{ color: accentColor }}
              >
                {t("Skills")}
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-[11px] border border-[#d9cbb8] text-gray-800 bg-white/60"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

