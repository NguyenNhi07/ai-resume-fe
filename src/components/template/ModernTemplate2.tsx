import type { Resume } from "@/lib/type"
import dayjs from "dayjs"
import { Mail, Phone, MapPin, Globe } from "lucide-react"

export const ModernTemplate = ({
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
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Two Column Layout */}
        <div className="grid grid-cols-3 gap-0">
          {/* Left Sidebar */}
          <div className="p-8 text-white" style={{ backgroundColor: accentColor }}>
            {/* Profile Image */}
            {data.personal_info?.image && (
              <div className="mb-6">
                <img
                  src={data.personal_info.image || "/placeholder.svg"}
                  alt={data.personal_info.full_name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white"
                />
              </div>
            )}

            {/* Contact Info */}
            <div className="mb-8">
              <h3 className="text-sm font-bold uppercase tracking-wide mb-4 opacity-80">Contact</h3>
              <div className="space-y-3 text-sm">
                {data.personal_info?.email && (
                  <div className="flex items-start gap-2">
                    <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{data.personal_info.email}</span>
                  </div>
                )}
                {data.personal_info?.phone && (
                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{data.personal_info.phone}</span>
                  </div>
                )}
                {data.personal_info?.location && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{data.personal_info.location}</span>
                  </div>
                )}
                {data.personal_info?.website && (
                  <div className="flex items-start gap-2">
                    <Globe className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <a href={data.personal_info.website} className="hover:underline break-all">
                      {data.personal_info.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Skills */}
            {Array.isArray(data.skills) && data.skills.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide mb-4 opacity-80">Skills</h3>
                <div className="space-y-2">
                  {data.skills.map((skill, index) => (
                    <div key={index} className="text-sm bg-white bg-opacity-20 rounded px-3 py-1">
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Content */}
          <div className="col-span-2 p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-1">{data.personal_info?.full_name}</h1>
              <p className="text-xl font-semibold" style={{ color: accentColor }}>
                {data.personal_info?.profession}
              </p>
            </div>

            {/* Professional Summary */}
            {data.professional_summary && (
              <div className="mb-8">
                <p className="text-gray-700 leading-relaxed text-sm">{data.professional_summary}</p>
              </div>
            )}

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold uppercase tracking-wide mb-4" style={{ color: accentColor }}>
                  Experience
                </h2>
                <div className="space-y-5">
                  {data.experience.map((exp, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-gray-900">{exp.position}</h3>
                        <span className="text-xs text-gray-600">
                          {exp.start_date && formatDate(exp.start_date)} - {exp.end_date && formatDate(exp.end_date)}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-700 mb-1">{exp.company}</p>
                      {exp.description && <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
              <div>
                <h2 className="text-lg font-bold uppercase tracking-wide mb-4" style={{ color: accentColor }}>
                  Education
                </h2>
                <div className="space-y-4">
                  {data.education.map((edu, index) => (
                    <div key={index}>
                      <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                      <p className="text-sm text-gray-700">{edu.institution}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
