import type { Resume } from "@/lib/type";
import dayjs from "dayjs";
import {
  CalendarDays,
  ChevronRight,
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

export const BoldTemplate = ({
  data,
  accentColor,
}: {
  data: Resume;
  accentColor: string;
}) => {
  const { t } = useTranslation();
  const formatDate = (date: string) => {
    if (!date) return "";
    const parsed = dayjs(date, "MM/YYYY", true).isValid()
      ? dayjs(date, "MM/YYYY")
      : dayjs(date);
    return parsed.isValid() ? parsed.format("MMM YYYY") : date;
  };

  return (
    <div className="bg-gray-900 text-white p-10 max-w-4xl mx-auto min-h-screen rounded-lg">
      {/* Hero */}
      <div className="mb-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div
              className="text-sm uppercase tracking-widest mb-2"
              style={{ color: accentColor }}
            >
              {data.personal_info?.profession}
            </div>
            <h1 className="text-6xl font-black leading-tight">
              {data.personal_info?.full_name}
            </h1>
          </div>
          {data.personal_info?.image && (
            <img
              src={data.personal_info.image || "/placeholder.svg"}
              alt={data.personal_info.full_name}
              className="w-48 h-48 rounded-full object-cover border-4 shadow-2xl"
              style={{ borderColor: accentColor }}
            />
          )}
        </div>

        {/* Personal Info / Contacts */}
        <div className="rounded-2xl px-6 py-4 mb-6 bg-gray-800/80 border border-gray-700 flex flex-wrap gap-x-6 gap-y-3 text-sm">
          {data.personal_info?.birthDate && (
            <div className="flex items-center gap-2 text-gray-300">
              <CalendarDays
                className="w-4 h-4"
                style={{ color: accentColor }}
              />
              <span>{data.personal_info.birthDate}</span>
            </div>
          )}
          {data.personal_info?.gender && (
            <div className="flex items-center gap-2 text-gray-300">
              {data.personal_info.gender === "Female" ? (
                <Venus className="w-4 h-4" style={{ color: accentColor }} />
              ) : data.personal_info.gender === "Male" ? (
                <Mars className="w-4 h-4" style={{ color: accentColor }} />
              ) : (
                <VenusAndMars
                  className="w-4 h-4"
                  style={{ color: accentColor }}
                />
              )}
              <span>{data.personal_info.gender}</span>
            </div>
          )}
          {data.personal_info?.email && (
            <div className="flex items-center gap-2 text-gray-300">
              <Mail className="w-4 h-4" style={{ color: accentColor }} />
              <span>{data.personal_info.email}</span>
            </div>
          )}
          {data.personal_info?.phone && (
            <div className="flex items-center gap-2 text-gray-300">
              <Phone className="w-4 h-4" style={{ color: accentColor }} />
              <span>{data.personal_info.phone}</span>
            </div>
          )}
          {data.personal_info?.location && (
            <div className="flex items-center gap-2 text-gray-300">
              <MapPin className="w-4 h-4" style={{ color: accentColor }} />
              <span>{data.personal_info.location}</span>
            </div>
          )}
          {data.personal_info?.website && (
            <div className="flex items-center gap-2 text-gray-300">
              <Globe className="w-4 h-4" style={{ color: accentColor }} />
              <a
                href={data.personal_info.website}
                className="hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                {data.personal_info.website}
              </a>
            </div>
          )}
          {data.personal_info?.language && (
            <div className="flex items-center gap-2 text-gray-300">
              <Library className="w-4 h-4" style={{ color: accentColor }} />
              <span>{data.personal_info.language}</span>
            </div>
          )}
        </div>

        {data.professional_summary && (
          <p className="text-lg leading-relaxed max-w-2xl text-gray-300">
            {data.professional_summary}
          </p>
        )}
      </div>

      {/* Two Column */}
      <div className="grid grid-cols-3 gap-12">
        {/* Main */}
        <div className="col-span-2 space-y-12">
          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <div>
              <h2 className="text-3xl font-black mb-8 uppercase tracking-wide">
                <span style={{ color: accentColor }}>●</span> {t("Experience")}
              </h2>
              <div className="space-y-8">
                {data.experience.map((exp, index) => (
                  <div
                    key={index}
                    className="border-l-4 pl-6"
                    style={{ borderColor: accentColor }}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <ChevronRight
                        className="w-5 h-5 flex-shrink-0 mt-1"
                        style={{ color: accentColor }}
                      />
                      <div>
                        <h3 className="text-2xl font-bold">{exp.position}</h3>
                        <p className="text-gray-400">{exp.company}</p>
                        <p className="text-sm text-gray-600">
                          {exp.start_date && formatDate(exp.start_date)} -{" "}
                          {exp.end_date && formatDate(exp.end_date)}
                        </p>
                      </div>
                    </div>
                    {exp.description && (
                      <div className="text-gray-300 leading-relaxed ml-8 whitespace-pre-line">
                        {exp.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {data.project && data.project.length > 0 && (
            <div>
              <h2 className="text-3xl font-black mb-8 uppercase tracking-wide">
                <span style={{ color: accentColor }}>●</span> {t("Projects")}
              </h2>
              <div className="space-y-6">
                {data.project.map((project, index) => (
                  <div
                    key={index}
                    className="border-l-4 pl-6"
                    style={{ borderColor: accentColor }}
                  >
                    <h3 className="text-xl font-bold mb-2">{project.name}</h3>
                    {project.description && (
                      <div className="text-gray-300 mb-3 whitespace-pre-line">
                        {project.description}
                      </div>
                    )}
                    {project.technologies &&
                      project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-1 rounded-full font-bold"
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
        </div>

        {/* Sidebar */}
        <div>
          {/* Skills */}
          {Array.isArray(data.skills) && data.skills.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-black mb-4 uppercase">
                {t("Skills")}
              </h3>
              <div className="space-y-2">
                {data.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg font-bold"
                    style={{
                      backgroundColor: accentColor + "20",
                      color: accentColor,
                    }}
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-black mb-4 uppercase">
                {t("Education")}
              </h3>
              <div className="space-y-4">
                {data.education.map((edu, index) => (
                  <div key={index}>
                    <p className="font-bold text-lg">{edu.degree}</p>
                    <p className="text-gray-400 text-sm">{edu.institution}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {data.certifications && data.certifications.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-black mb-4 uppercase">
                {t("Certifications")}
              </h3>
              <div className="space-y-4">
                {data.certifications.map((cert, index) => (
                  <div key={index}>
                    <p className="font-bold text-lg">{cert.name}</p>
                    {cert.issuer && (
                      <p className="text-gray-400 text-sm">{cert.issuer}</p>
                    )}
                    {(cert.issueDate || cert.credentialId) && (
                      <p className="text-gray-500 text-xs mt-1">
                        {cert.issueDate && formatDate(cert.issueDate)}
                        {cert.credentialId && ` • ID: ${cert.credentialId}`}
                      </p>
                    )}
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs mt-1 inline-block"
                        style={{ color: accentColor }}
                      >
                        {t("View Credential")} →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
