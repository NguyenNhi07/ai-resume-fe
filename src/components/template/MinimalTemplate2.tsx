import type { Resume } from "@/lib/type"
import dayjs from "dayjs"

export const MinimalTemplate = ({
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
    <div className="bg-white p-12 max-w-3xl mx-auto font-sans">
      {/* Header */}
      <div className="mb-8 border-b-2" style={{ borderColor: accentColor }}>
        <h1 className="text-3xl font-light text-gray-900 mb-2">{data.personal_info?.full_name}</h1>
        <p className="text-sm tracking-widest uppercase text-gray-600 mb-4">{data.personal_info?.profession}</p>
        <div className="flex gap-6 text-xs text-gray-600 pb-4 flex-wrap">
          {data.personal_info?.email && <span>{data.personal_info.email}</span>}
          {data.personal_info?.phone && <span>{data.personal_info.phone}</span>}
          {data.personal_info?.location && <span>{data.personal_info.location}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.professional_summary && (
        <div className="mb-8">
          <p className="text-xs text-gray-700 leading-relaxed">{data.professional_summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-4">Experience</h2>
          <div className="space-y-4">
            {data.experience.map((exp, index) => (
              <div key={index} className="text-xs">
                <div className="font-semibold text-gray-900">
                  {exp.position}
                  <span className="font-normal text-gray-600 ml-2">at {exp.company}</span>
                </div>
                <div className="text-gray-600 mb-1">
                  {exp.start_date && formatDate(exp.start_date)} - {exp.end_date && formatDate(exp.end_date)}
                </div>
                {exp.description && <p className="text-gray-700">{exp.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-4">Education</h2>
          <div className="space-y-3">
            {data.education.map((edu, index) => (
              <div key={index} className="text-xs">
                <div className="font-semibold text-gray-900">{edu.degree}</div>
                <div className="text-gray-600">{edu.institution}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {Array.isArray(data.skills) && data.skills.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-3">Skills</h2>
          <div className="text-xs text-gray-700">{data.skills.join(" • ")}</div>
        </div>
      )}
    </div>
  )
}
