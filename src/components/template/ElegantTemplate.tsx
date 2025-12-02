import type { Resume } from "@/lib/type"
import dayjs from "dayjs"
import { Mail, Phone, MapPin, Award } from "lucide-react"

export const ElegantTemplate = ({
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
    <div className="bg-white p-12 max-w-4xl mx-auto font-serif">
      {/* Decorative Line */}
      <div className="flex items-center justify-center mb-10">
        <div className="flex-1 h-px" style={{ backgroundColor: accentColor }}></div>
        <Award className="w-6 h-6 mx-4" style={{ color: accentColor }} />
        <div className="flex-1 h-px" style={{ backgroundColor: accentColor }}></div>
      </div>

      {/* Header */}
      <div className="text-center mb-12">
        {data.personal_info?.image && (
          <div className="mb-6 flex justify-center">
            <img
              src={data.personal_info.image || "/placeholder.svg"}
              alt={data.personal_info.full_name}
              className="w-28 h-28 rounded-full object-cover border-2"
              style={{ borderColor: accentColor }}
            />
          </div>
        )}
        <h1 className="text-5xl font-light text-gray-900 mb-2 tracking-wide">{data.personal_info?.full_name}</h1>
        <p className="text-xl text-gray-700 mb-6 font-light">{data.personal_info?.profession}</p>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
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
        </div>
      </div>

      {/* Divider */}
      <div className="h-px mb-8" style={{ backgroundColor: accentColor }}></div>

      {/* Summary */}
      {data.professional_summary && (
        <div className="mb-10 text-center">
          <p className="text-gray-700 leading-relaxed italic">{data.professional_summary}</p>
        </div>
      )}

      {/* Section: Experience */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-light mb-6 pb-3 border-b" style={{ borderColor: accentColor }}>
            Professional Experience
          </h2>
          <div className="space-y-8">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                <p className="text-gray-700 italic mb-1">{exp.company}</p>
                <p className="text-sm text-gray-600 mb-3">
                  {exp.start_date && formatDate(exp.start_date)} — {exp.end_date && formatDate(exp.end_date)}
                </p>
                {exp.description && <p className="text-gray-700 leading-relaxed">{exp.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section: Education */}
      {data.education && data.education.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-light mb-6 pb-3 border-b" style={{ borderColor: accentColor }}>
            Education
          </h2>
          <div className="space-y-6">
            {data.education.map((edu, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                <p className="text-gray-700">{edu.institution}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section: Skills */}
      {Array.isArray(data.skills) && data.skills.length > 0 && (
        <div>
          <h2 className="text-2xl font-light mb-6 pb-3 border-b" style={{ borderColor: accentColor }}>
            Core Competencies
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {data.skills.map((skill, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></div>
                <span className="text-gray-700">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Divider */}
      <div className="flex items-center justify-center mt-12">
        <div className="flex-1 h-px" style={{ backgroundColor: accentColor }}></div>
        <Award className="w-6 h-6 mx-4" style={{ color: accentColor }} />
        <div className="flex-1 h-px" style={{ backgroundColor: accentColor }}></div>
      </div>
    </div>
  )
}
