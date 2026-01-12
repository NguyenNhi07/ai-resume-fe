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

export const ClassicTemplate = ({
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
    (data.font_family && fontMap[data.font_family]) || "Times New Roman, serif";

  const formatDate = (date: string) => {
    if (!date) return "";
    // Try parsing with MM/YYYY format first, then fallback to default
    const parsed = dayjs(date, "MM/YYYY", true).isValid()
      ? dayjs(date, "MM/YYYY")
      : dayjs(date);
    return parsed.isValid() ? parsed.format("MMM YYYY") : date;
  };

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto rounded-lg" style={{ fontFamily }}>
      {/* Header */}
      <div
        className="text-center mb-8 border-b-2 pb-6"
        style={{ borderColor: accentColor }}
      >
        {/* Avatar */}
        {data.personal_info?.image && (
          <div className="mb-4 flex justify-center">
            <img
              src={data.personal_info.image}
              alt={data.personal_info.full_name}
              className="w-24 h-24 rounded-full object-cover border-2"
              style={{ borderColor: accentColor }}
            />
          </div>
        )}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {data.personal_info?.full_name}
        </h1>
        <p className="text-lg text-gray-700 mb-4">
          {data.personal_info?.profession}
        </p>

        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          {data.personal_info?.birthDate && (
            <div className="flex items-center gap-1">
              <CalendarDays className="w-4 h-4" />
              <span>{data.personal_info.birthDate}</span>
            </div>
          )}
          {data.personal_info?.gender && (
            <div className="flex items-center gap-1">
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
          {data.personal_info?.email && (
            <div className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              <span>{data.personal_info.email}</span>
            </div>
          )}
          {data.personal_info?.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              <span>{data.personal_info.phone}</span>
            </div>
          )}
          {data.personal_info?.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{data.personal_info.location}</span>
            </div>
          )}
          {data.personal_info?.website && (
            <div className="flex items-center gap-1">
              <Globe className="w-4 h-4" />
              <a href={data.personal_info.website} className="hover:underline">
                {data.personal_info.website}
              </a>
            </div>
          )}
          {data.personal_info?.language && (
            <div className="flex items-center gap-1">
              <Library className="w-4 h-4" />
              <span>{data.personal_info.language}</span>
            </div>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {data.professional_summary && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3" style={{ color: accentColor }}>
            {t("Professional Summary")}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {data.professional_summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4" style={{ color: accentColor }}>
            {t("Professional Experience")}
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp, index) => (
              <div
                key={index}
                className="border-l-4 pl-4"
                style={{ borderColor: accentColor }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {exp.position}
                    </h3>
                    <p className="font-medium text-gray-700">{exp.company}</p>
                  </div>
                  <div className="text-sm text-gray-600">
                    {exp.start_date && formatDate(exp.start_date)} -{" "}
                    {exp.end_date && formatDate(exp.end_date)}
                  </div>
                </div>
                {exp.description && (
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4" style={{ color: accentColor }}>
            {t("Education")}
          </h2>
          <div className="space-y-3">
            {data.education.map((edu, index) => (
              <div
                key={index}
                className="border-l-4 pl-4"
                style={{ borderColor: accentColor }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {edu.degree}
                    </h3>
                    <p className="font-medium text-gray-700">
                      {edu.institution}
                      {edu.field && ` - ${edu.field}`}
                    </p>
                    {edu.gpa && (
                      <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    {edu.graduation_date && formatDate(edu.graduation_date)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4" style={{ color: accentColor }}>
            {t("Certifications")}
          </h2>
          <div className="space-y-3">
            {data.certifications.map((cert, index) => (
              <div
                key={index}
                className="border-l-4 pl-4"
                style={{ borderColor: accentColor }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {cert.name}
                    </h3>
                    {cert.issuer && (
                      <p className="font-medium text-gray-700">{cert.issuer}</p>
                    )}
                    {cert.credentialId && (
                      <p className="text-sm text-gray-600">
                        ID: {cert.credentialId}
                      </p>
                    )}
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {t("View Credential")}
                      </a>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    {cert.issueDate && formatDate(cert.issueDate)}
                    {cert.expiryDate && ` - ${formatDate(cert.expiryDate)}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.project && data.project.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4" style={{ color: accentColor }}>
            {t("Projects")}
          </h2>
          <div className="space-y-4">
            {data.project.map((project, index) => (
              <div
                key={index}
                className="border-l-4 pl-4"
                style={{ borderColor: accentColor }}
              >
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {project.name}
                </h3>
                {project.description && (
                  <div className="text-gray-700 leading-relaxed mb-2 whitespace-pre-line">
                    {project.description}
                  </div>
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-2 py-1 text-xs rounded"
                        style={{
                          backgroundColor: accentColor + "20",
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
        </div>
      )}

      {/* Skills */}
      {Array.isArray(data.skills) && data.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4" style={{ color: accentColor }}>
            {t("Skills")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm rounded"
                style={{
                  backgroundColor: accentColor + "20",
                  color: accentColor,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
