import type { Resume } from "@/lib/type"
import dayjs from "dayjs"
import { ChevronRight } from "lucide-react"

export const BoldTemplate = ({
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
    <div className="bg-gray-900 text-white p-10 max-w-4xl mx-auto min-h-screen">
      {/* Hero */}
      <div className="mb-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="text-sm uppercase tracking-widest mb-2" style={{ color: accentColor }}>
              {data.personal_info?.profession}
            </div>
            <h1 className="text-6xl font-black leading-tight">{data.personal_info?.full_name}</h1>
          </div>
          {data.personal_info?.image && (
            <img
              src={data.personal_info.image || "/placeholder.svg"}
              alt={data.personal_info.full_name}
              className="w-48 h-48 rounded-full object-cover border-4"
              style={{ borderColor: accentColor }}
            />
          )}
        </div>
        {data.professional_summary && (
          <p className="text-lg leading-relaxed max-w-2xl text-gray-300">{data.professional_summary}</p>
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
                <span style={{ color: accentColor }}>●</span> Experience
              </h2>
              <div className="space-y-8">
                {data.experience.map((exp, index) => (
                  <div key={index} className="border-l-4 pl-6" style={{ borderColor: accentColor }}>
                    <div className="flex items-start gap-3 mb-2">
                      <ChevronRight className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: accentColor }} />
                      <div>
                        <h3 className="text-2xl font-bold">{exp.position}</h3>
                        <p className="text-gray-400">{exp.company}</p>
                        <p className="text-sm text-gray-600">
                          {exp.start_date && formatDate(exp.start_date)} - {exp.end_date && formatDate(exp.end_date)}
                        </p>
                      </div>
                    </div>
                    {exp.description && <p className="text-gray-300 leading-relaxed ml-8">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {data.project && data.project.length > 0 && (
            <div>
              <h2 className="text-3xl font-black mb-8 uppercase tracking-wide">
                <span style={{ color: accentColor }}>●</span> Projects
              </h2>
              <div className="space-y-6">
                {data.project.map((project, index) => (
                  <div key={index} className="border-l-4 pl-6" style={{ borderColor: accentColor }}>
                    <h3 className="text-xl font-bold mb-2">{project.name}</h3>
                    {project.description && <p className="text-gray-300 mb-3">{project.description}</p>}
                    {project.technologies && project.technologies.length > 0 && (
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
              <h3 className="text-xl font-black mb-4 uppercase">Skills</h3>
              <div className="space-y-2">
                {data.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg font-bold"
                    style={{ backgroundColor: accentColor + "20", color: accentColor }}
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
              <h3 className="text-xl font-black mb-4 uppercase">Education</h3>
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
        </div>
      </div>
    </div>
  )
}
