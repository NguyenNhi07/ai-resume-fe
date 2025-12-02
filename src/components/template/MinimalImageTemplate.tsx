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
  VenusAndMars
} from "lucide-react";

export const MinimalImageTemplate = ({
  data,
  accentColor,
}: {
  data: Resume;
  accentColor: string;
}) => {
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
    // Try parsing with MM/YYYY format first, then fallback to default
    const parsed = dayjs(date, "MM/YYYY", true).isValid()
      ? dayjs(date, "MM/YYYY")
      : dayjs(date);
    return parsed.isValid() ? parsed.format("MMM YYYY") : date;
  };

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto" style={{ fontFamily }}>
      {/* Header với ảnh đại diện */}
      <div className="flex items-start gap-8 mb-12">
        {/* Ảnh đại diện */}
        {data.personal_info?.image && (
          <div className="flex-shrink-0">
            <img
              src={data.personal_info.image}
              alt={data.personal_info.full_name}
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              style={{ borderColor: accentColor }}
            />
          </div>
        )}

        {/* Thông tin cá nhân */}
        <div className="flex-1">
          <h1 className="text-3xl font-light text-gray-900 mb-2">
            {data.personal_info?.full_name}
          </h1>
          <p className="text-lg font-light text-gray-600 mb-6">
            {data.personal_info?.profession}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
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
                  className="hover:text-gray-900 transition-colors"
                >
                  {data.personal_info.website}
                </a>
              </div>
            )}
            {data.personal_info?.language && (
              <div className="flex items-center gap-2">
                <Library className="w-4 h-4" />
                <a
                  href={data.personal_info.language}
                  className="hover:text-gray-900 transition-colors"
                >
                  language
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      {data.professional_summary && (
        <div className="mb-10">
          <div className="flex items-center mb-4">
            <div
              className="w-12 h-px mr-4"
              style={{ backgroundColor: accentColor }}
            ></div>
            <h2
              className="text-lg font-medium text-gray-900 uppercase tracking-wide"
              style={{ color: accentColor }}
            >
              About
            </h2>
          </div>
          <p className="text-gray-700 leading-relaxed text-lg font-light">
            {data.professional_summary}
          </p>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Left Column */}
        <div className="space-y-10">
          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <div>
              <div className="flex items-center mb-6">
                <div
                  className="w-12 h-px mr-4"
                  style={{ backgroundColor: accentColor }}
                ></div>
                <h2
                  className="text-lg font-medium text-gray-900 uppercase tracking-wide"
                  style={{ color: accentColor }}
                >
                  Experience
                </h2>
              </div>
              <div className="space-y-6">
                {data.experience.map((exp, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-3 h-3 rounded-full mt-2 flex-shrink-0"
                        style={{ backgroundColor: accentColor }}
                      ></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {exp.position}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {exp.company}
                            </p>
                          </div>
                          <div className="text-xs text-gray-500 font-light">
                            {exp.start_date && formatDate(exp.start_date)} -{" "}
                            {exp.end_date && formatDate(exp.end_date)}
                          </div>
                        </div>
                        {exp.description && (
                          <p className="text-sm text-gray-700 leading-relaxed font-light">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <div>
              <div className="flex items-center mb-6">
                <div
                  className="w-12 h-px mr-4"
                  style={{ backgroundColor: accentColor }}
                ></div>
                <h2
                  className="text-lg font-medium text-gray-900 uppercase tracking-wide"
                  style={{ color: accentColor }}
                >
                  Education
                </h2>
              </div>
              <div className="space-y-4">
                {data.education.map((edu, index) => (
                  <div
                    key={index}
                    className="border-l-2 pl-4"
                    style={{ borderColor: accentColor + "50" }}
                  >
                    <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                    <p className="text-sm text-gray-600">
                      {edu.institution}
                      {edu.field && ` - ${edu.field}`}
                    </p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-gray-500 font-light">
                        {edu.graduation_date && formatDate(edu.graduation_date)}
                      </p>
                      {edu.gpa && (
                        <p
                          className="text-xs font-medium"
                          style={{ color: accentColor }}
                        >
                          GPA: {edu.gpa}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-10">
          {/* Skills */}
          {Array.isArray(data.skills) && data.skills.length > 0 && (
            <div>
              <div className="flex items-center mb-6">
                <div
                  className="w-12 h-px mr-4"
                  style={{ backgroundColor: accentColor }}
                ></div>
                <h2
                  className="text-lg font-medium text-gray-900 uppercase tracking-wide"
                  style={{ color: accentColor }}
                >
                  Skills
                </h2>
              </div>
              <div className="space-y-3">
                {data.skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: accentColor }}
                    ></div>
                    <span className="text-sm text-gray-700 font-light">
                      {skill}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {data.project && data.project.length > 0 && (
            <div>
              <div className="flex items-center mb-6">
                <div
                  className="w-12 h-px mr-4"
                  style={{ backgroundColor: accentColor }}
                ></div>
                <h2
                  className="text-lg font-medium text-gray-900 uppercase tracking-wide"
                  style={{ color: accentColor }}
                >
                  Projects
                </h2>
              </div>
              <div className="space-y-4">
                {data.project.map((project, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4"
                    style={{ borderColor: accentColor + "30" }}
                  >
                    <h3 className="font-medium text-gray-900 mb-2">
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className="text-sm text-gray-700 leading-relaxed font-light mb-3">
                        {project.description}
                      </p>
                    )}
                    {project.technologies &&
                      project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="text-xs px-2 py-1 rounded-full font-medium"
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
      </div>
    </div>
  );
};
