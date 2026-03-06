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

export const CompactTemplate = ({
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
      className="bg-white max-w-3xl mx-auto rounded-lg px-8 py-6 text-[11px] leading-snug"
      style={{ fontFamily }}
    >
      {/* Header */}
      <header className="border-b border-gray-200 pb-3 mb-3 flex justify-between gap-4">
        <div className="flex items-center gap-3">
          {data.personal_info?.image && (
            <img
              src={data.personal_info.image}
              alt={data.personal_info.full_name}
              className="w-16 h-16 rounded-full object-cover border border-gray-200"
              style={{ borderColor: accentColor }}
            />
          )}
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {data.personal_info?.full_name}
            </h1>
            <p className="text-xs text-gray-600 mt-0.5">
              {data.personal_info?.profession}
            </p>
          </div>
        </div>
        <div className="text-[10px] text-gray-600 space-y-0.5 text-right">
          {data.personal_info?.email && (
            <div className="flex items-center gap-1 justify-end">
              <Mail className="w-3 h-3" />
              <span>{data.personal_info.email}</span>
            </div>
          )}
          {data.personal_info?.phone && (
            <div className="flex items-center gap-1 justify-end">
              <Phone className="w-3 h-3" />
              <span>{data.personal_info.phone}</span>
            </div>
          )}
          {data.personal_info?.location && (
            <div className="flex items-center gap-1 justify-end">
              <MapPin className="w-3 h-3" />
              <span>{data.personal_info.location}</span>
            </div>
          )}
          {data.personal_info?.website && (
            <div className="flex items-center gap-1 justify-end">
              <Globe className="w-3 h-3" />
              <a
                href={data.personal_info.website}
                className="hover:underline"
              >
                {data.personal_info.website}
              </a>
            </div>
          )}
        </div>
      </header>

      <main className="space-y-3">
        {data.professional_summary && (
          <section>
            <h2
              className="uppercase tracking-[0.2em] text-[10px] font-semibold mb-1"
              style={{ color: accentColor }}
            >
              {t("Summary")}
            </h2>
            <p className="text-[11px] text-gray-800 whitespace-pre-line">
              {data.professional_summary}
            </p>
          </section>
        )}

        {data.experience && data.experience.length > 0 && (
          <section>
            <h2
              className="uppercase tracking-[0.2em] text-[10px] font-semibold mb-1"
              style={{ color: accentColor }}
            >
              {t("Experience")}
            </h2>
            <div className="space-y-1.5">
              {data.experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between gap-3">
                    <div>
                      <span className="font-semibold text-gray-900">
                        {exp.position}
                      </span>
                      {exp.company && (
                        <span className="text-gray-600"> • {exp.company}</span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-500 whitespace-nowrap">
                      {exp.start_date && formatDate(exp.start_date)} -{" "}
                      {exp.end_date && formatDate(exp.end_date)}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-[10px] text-gray-700 whitespace-pre-line">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.education && data.education.length > 0 && (
          <section>
            <h2
              className="uppercase tracking-[0.2em] text-[10px] font-semibold mb-1"
              style={{ color: accentColor }}
            >
              {t("Education")}
            </h2>
            <div className="space-y-1.5">
              {data.education.map((edu, index) => (
                <div key={index} className="flex justify-between gap-3">
                  <div>
                    <span className="font-semibold text-gray-900">
                      {edu.degree}
                    </span>
                    <span className="text-gray-600">
                      {edu.institution && ` • ${edu.institution}`}
                      {edu.field && ` • ${edu.field}`}
                    </span>
                    {edu.gpa && (
                      <span className="text-gray-600"> • GPA {edu.gpa}</span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-500 whitespace-nowrap">
                    {edu.graduation_date && formatDate(edu.graduation_date)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.project && data.project.length > 0 && (
          <section>
            <h2
              className="uppercase tracking-[0.2em] text-[10px] font-semibold mb-1"
              style={{ color: accentColor }}
            >
              {t("Projects")}
            </h2>
            <div className="space-y-1.5">
              {data.project.map((project, index) => (
                <div key={index}>
                  <div className="flex justify-between gap-3">
                    <span className="font-semibold text-gray-900">
                      {project.name}
                    </span>
                  </div>
                  {project.description && (
                    <p className="text-[10px] text-gray-700 whitespace-pre-line">
                      {project.description}
                    </p>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {project.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-1.5 py-0.5 rounded bg-gray-100 text-[9px] text-gray-700"
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
          <section>
            <h2
              className="uppercase tracking-[0.2em] text-[10px] font-semibold mb-1"
              style={{ color: accentColor }}
            >
              {t("Certifications")}
            </h2>
            <div className="space-y-1">
              {data.certifications.map((cert, index) => (
                <div key={index} className="flex justify-between gap-3">
                  <div>
                    <span className="font-semibold text-gray-900">
                      {cert.name}
                    </span>
                    {cert.issuer && (
                      <span className="text-gray-600"> • {cert.issuer}</span>
                    )}
                    {cert.credentialId && (
                      <span className="text-gray-600">
                        {" "}
                        • ID: {cert.credentialId}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-500 whitespace-nowrap">
                    {cert.issueDate && formatDate(cert.issueDate)}
                    {cert.expiryDate &&
                      ` - ${formatDate(cert.expiryDate)}`}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {Array.isArray(data.skills) && data.skills.length > 0 && (
          <section>
            <h2
              className="uppercase tracking-[0.2em] text-[10px] font-semibold mb-1"
              style={{ color: accentColor }}
            >
              {t("Skills")}
            </h2>
            <div className="flex flex-wrap gap-1">
              {data.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 rounded border border-gray-200 text-[10px]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

