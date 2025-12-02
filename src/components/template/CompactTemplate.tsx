import type { Resume } from "@/lib/type"
import dayjs from "dayjs"

export const CompactTemplate = ({
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
    <div className="bg-white p-6 max-w-2xl mx-auto text-sm font-sans">
      {/* Header */}
      <div className="mb-4 pb-3 border-b-2" style={{ borderColor: accentColor }}>
        <h1 className="text-2xl font-bold text-gray-900">{data.personal_info?.full_name}</h1>
        <p className="text-xs uppercase tracking-wide" style={{ color: accentColor }}>
          {data.personal_info?.profession}
        </p>
        <div className="text-xs text-gray-600 mt-1">
          {[data.personal_info?.email, data.personal_info?.phone, data.personal_info?.location]
            .filter(Boolean)
            .join(" • ")}
        </div>
      </div>

      {/* Summary */}
      {data.professional_summary && (
        <div className="mb-4">
          <p className="text-gray-700 leading-tight">{data.professional_summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-4">
          <h3 className="font-bold text-xs uppercase tracking-wide mb-2" style={{ color: accentColor }}>
            Experience
          </h3>
          <div className="space-y-2">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="font-bold text-gray-900">
                  {exp.position}
                  <span className="font-normal text-gray-600 ml-1">@ {exp.company}</span>
                </div>
                <div className="text-xs text-gray-600">
                  {exp.start_date && formatDate(exp.start_date)} - {exp.end_date && formatDate(exp.end_date)}
                </div>
                {exp.description && <p className="text-gray-700 text-xs">{exp.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <div className="mb-4">
          <h3 className="font-bold text-xs uppercase tracking-wide mb-2" style={{ color: accentColor }}>
            Education
          </h3>
          <div className="space-y-1">
            {data.education.map((edu, index) => (
              <div key={index}>
                <p className="font-bold text-gray-900 text-xs">{edu.degree}</p>
                <p className="text-gray-600 text-xs">{edu.institution}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {Array.isArray(data.skills) && data.skills.length > 0 && (
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wide mb-1" style={{ color: accentColor }}>
            Skills
          </h3>
          <p className="text-gray-700 text-xs">{data.skills.join(" • ")}</p>
        </div>
      )}
    </div>
  )
}
