import type { Resume } from "@/lib/type"
import dayjs from 'dayjs'
import { CalendarDays, Globe, Linkedin, Mail, MapPin, Mars, Phone, Venus, VenusAndMars } from "lucide-react"

export const ClassicTemplate = ({ data, accentColor }: { data: Resume, accentColor: string }) => {
    const formatDate = (date: string) => {
        return dayjs(date).format('MMM YYYY')
    }

    return (
        <div className="bg-white p-8 max-w-4xl mx-auto" style={{ fontFamily: 'Times New Roman, serif' }}>
            {/* Header */}
            <div className="text-center mb-8 border-b-2 pb-6" style={{ borderColor: accentColor }}>
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.personal_info?.full_name}</h1>
                <p className="text-lg text-gray-700 mb-4">{data.personal_info?.profession}</p>

                <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                    {data.personal_info?.birthDate && (
                        <div className="flex items-center gap-1">
                            <CalendarDays className="w-4 h-4" />
                            <span>{data.personal_info.birthDate}</span>
                        </div>
                    )}
                    {data.personal_info?.gender && (
                        <div className="flex items-center gap-1">
                            {
                                data.personal_info.gender === "Female" ? (
                                    <Venus className="w-4 h-4" />
                                ) : data.personal_info.gender === "Male" ? (
                                    <Mars className="w-4 h-4" />
                                ) : (
                                    <VenusAndMars className="w-4 h-4" />
                                )
                            }
                            <span className="font-medium">{data.personal_info.gender}</span>
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
                            <a href={data.personal_info.website} className="hover:underline">{data.personal_info.website}</a>
                        </div>
                    )}
                    {data.personal_info?.linkedin && (
                        <div className="flex items-center gap-1">
                            <Linkedin className="w-4 h-4" />
                            <a href={data.personal_info.linkedin} className="hover:underline">LinkedIn</a>
                        </div>
                    )}
                </div>
            </div>

            {/* Professional Summary */}
            {data.professional_sumary && (
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-3" style={{ color: accentColor }}>Professional Summary</h2>
                    <p className="text-gray-700 leading-relaxed">{data.professional_sumary}</p>
                </div>
            )}

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-4" style={{ color: accentColor }}>Professional Experience</h2>
                    <div className="space-y-4">
                        {data.experience.map((exp, index) => (
                            <div key={index} className="border-l-4 pl-4" style={{ borderColor: accentColor }}>
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-900">{exp.position}</h3>
                                        <p className="font-medium text-gray-700">{exp.company}</p>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {exp.start_date && formatDate(exp.start_date)} - {exp.end_date && formatDate(exp.end_date)}
                                    </div>
                                </div>
                                {exp.description && (
                                    <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-4" style={{ color: accentColor }}>Education</h2>
                    <div className="space-y-3">
                        {data.education.map((edu, index) => (
                            <div key={index} className="border-l-4 pl-4" style={{ borderColor: accentColor }}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-900">{edu.degree}</h3>
                                        <p className="font-medium text-gray-700">{edu.school}</p>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {edu.start_date && formatDate(edu.start_date)} - {edu.end_date && formatDate(edu.end_date)}
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
                    <h2 className="text-xl font-bold mb-4" style={{ color: accentColor }}>Projects</h2>
                    <div className="space-y-4">
                        {data.project.map((project, index) => (
                            <div key={index} className="border-l-4 pl-4" style={{ borderColor: accentColor }}>
                                <h3 className="font-semibold text-lg text-gray-900 mb-2">{project.name}</h3>
                                {project.description && (
                                    <p className="text-gray-700 leading-relaxed mb-2">{project.description}</p>
                                )}
                                {project.technologies && project.technologies.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {project.technologies.map((tech, techIndex) => (
                                            <span key={techIndex} className="px-2 py-1 text-xs rounded" style={{ backgroundColor: accentColor + '20', color: accentColor }}>
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
            {data.skills && data.skills.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-4" style={{ color: accentColor }}>Skills</h2>
                    <div className="flex flex-wrap gap-2">
                        {data.skills.map((skill, index) => (
                            <span key={index} className="px-3 py-1 text-sm rounded" style={{ backgroundColor: accentColor + '20', color: accentColor }}>
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}