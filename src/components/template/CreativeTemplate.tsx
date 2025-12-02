import type { Resume } from "@/lib/type"
import dayjs from "dayjs"
import { Mail, Phone, MapPin, Zap } from "lucide-react"

export const CreativeTemplate = ({
  data,
  accentColor,
}: {
  data: Resume
  accentColor: string
}) => {
  const formatDate = (date: string) => {
    if (!date) return ""
    const parsed = dayjs(date, "MM/YYYY", true).isValid() ? dayjs(date, "MM/YYYY") : dayjs(date)
    return parsed.isValid() ? parsed.format("MMM YYYY") : date
  }

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto">
      {/* Hero Section */}
      <div
        className="rounded-lg p-8 text-white mb-8"
        style={{
          background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 100%)`,
        }}
      >
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-5xl font-bold mb-2">{data.personal_info?.full_name}</h1>
            <div className="flex items-center gap-2 text-lg mb-6">
              <Zap className="w-5 h-5" />
              <span>{data.personal_info?.profession}</span>
            </div>
            {data.professional_summary && (
              <p className="max-w-2xl leading-relaxed opacity-90">{data.professional_summary}</p>
            )}
          </div>
          {data.personal_info?.image && (
            <img
              src={data.personal_info.image || "/placeholder.svg"}
              alt={data.personal_info.full_name}
              className="w-40 h-40 rounded-full object-cover border-4 border-white ml-4 flex-shrink-0"
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="col-span-2">
          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6 pb-2 border-b-4" style={{ borderColor: accentColor }}>
                Experience
              </h2>
              <div className="space-y-6">
                {data.experience.map((exp, index) => (
                  <div key={index}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></div>
                      <h3 className="text-xl font-bold text-gray-900">{exp.position}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {exp.company} • {exp.start_date && formatDate(exp.start_date)} -{" "}
                      {exp.end_date && formatDate(exp.end_date)}
                    </p>
                    {exp.description && <p className="text-gray-700 leading-relaxed">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {data.project && data.project.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6 pb-2 border-b-4" style={{ borderColor: accentColor }}>
                Projects
              </h2>
              <div className="space-y-4">
                {data.project.map((project, index) => (
                  <div key={index} className="p-4 rounded-lg border-2" style={{ borderColor: accentColor + "40" }}>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{project.name}</h3>
                    {project.description && <p className="text-sm text-gray-700 mb-3">{project.description}</p>}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, idx) => (
                          <span
                            key={idx}
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

        {/* Sidebar */}
        <div>
          {/* Contact */}
          <div className="mb-8">
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <div className="space-y-3 text-sm">
              {data.personal_info?.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" style={{ color: accentColor }} />
                  <span className="text-gray-700">{data.personal_info.email}</span>
                </div>
              )}
              {data.personal_info?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" style={{ color: accentColor }} />
                  <span className="text-gray-700">{data.personal_info.phone}</span>
                </div>
              )}
              {data.personal_info?.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" style={{ color: accentColor }} />
                  <span className="text-gray-700">{data.personal_info.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          {Array.isArray(data.skills) && data.skills.length > 0 && (
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-4">Skills</h3>
              <div className="space-y-2">
                {data.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="p-2 rounded text-sm font-medium text-white"
                    style={{ backgroundColor: accentColor }}
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <div>
              <h3 className="font-bold text-lg mb-4">Education</h3>
              <div className="space-y-3 text-sm">
                {data.education.map((edu, index) => (
                  <div key={index}>
                    <p className="font-medium text-gray-900">{edu.degree}</p>
                    <p className="text-gray-600">{edu.institution}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
