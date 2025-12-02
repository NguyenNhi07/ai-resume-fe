import type { Resume } from "@/lib/type"
import dayjs from "dayjs"
import { Mail, Phone, MapPin } from "lucide-react"

export const ProfessionalTemplate = ({
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
    <div className="bg-white p-10 max-w-4xl mx-auto">
      {/* Header with Background */}
      <div className="p-8 mb-8 rounded-none -mx-10" style={{ backgroundColor: accentColor }}>
        <div className="flex items-center justify-between">
          <div className="text-white">
            <h1 className="text-4xl font-bold mb-2">{data.personal_info?.full_name}</h1>
            <p className="text-lg font-light opacity-95">{data.personal_info?.profession}</p>
          </div>
          {data.personal_info?.image && (
            <img
              src={data.personal_info.image || "/placeholder.svg"}
              alt={data.personal_info.full_name}
              className="w-32 h-32 rounded-lg object-cover border-4 border-white"
            />
          )}
        </div>
      </div>

      {/* Contact Bar */}
      <div className="flex flex-wrap gap-6 text-sm mb-8 pb-8 border-b-2" style={{ borderColor: accentColor + "40" }}>
        {data.personal_info?.email && (
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" style={{ color: accentColor }} />
            <span>{data.personal_info.email}</span>
          </div>
        )}
        {data.personal_info?.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" style={{ color: accentColor }} />
            <span>{data.personal_info.phone}</span>
          </div>
        )}
        {data.personal_info?.location && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" style={{ color: accentColor }} />
            <span>{data.personal_info.location}</span>
          </div>
        )}
      </div>

      {/* Professional Summary */}
      {data.professional_summary && (
        <div className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: accentColor }}>
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{data.professional_summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: accentColor }}>
            Professional Experience
          </h2>
          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                    <p className="text-gray-600 font-medium">{exp.company}</p>
                  </div>
                  <span className="text-xs text-gray-600">
                    {exp.start_date && formatDate(exp.start_date)} - {exp.end_date && formatDate(exp.end_date)}
                  </span>
                </div>
                {exp.description && <p className="text-gray-700 text-sm leading-relaxed">{exp.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: accentColor }}>
            Education
          </h2>
          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                <p className="text-gray-600">{edu.institution}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {Array.isArray(data.skills) && data.skills.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: accentColor }}>
            Technical Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm rounded border"
                style={{
                  borderColor: accentColor,
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
  )
}
