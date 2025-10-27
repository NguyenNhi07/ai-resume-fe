import type { Resume } from "@/lib/type"
import dayjs from 'dayjs'
import { CalendarDays, Globe, Linkedin, Mail, MapPin, Mars, Phone, Venus, VenusAndMars } from "lucide-react"

export const MinimalTemplate = ({ data, accentColor }: { data: Resume, accentColor: string }) => {
    const formatDate = (date: string) => {
        return dayjs(date).format('MMM YYYY')
    }

    return (
        <div className="bg-white p-8 max-w-4xl mx-auto" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            {/* Header - Minimal */}
            <div className="text-center mb-12">
                {/* Avatar */}
                {data.personal_info?.image && (
                    <div className="mb-6 flex justify-center">
                        <img 
                            src={data.personal_info.image} 
                            alt={data.personal_info.full_name}
                            className="w-24 h-24 rounded-full object-cover border-2"
                            style={{ borderColor: accentColor }}
                        />
                    </div>
                )}
                <h1 className="text-3xl font-light text-gray-900 mb-2">{data.personal_info?.full_name}</h1>
                <p className="text-lg font-light text-gray-600 mb-6">{data.personal_info?.profession}</p>
                
                <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
                    {data.personal_info?.birthDate && (
                        <div className="flex items-center gap-1">
                            <CalendarDays className="w-3 h-3" />
                            <span>{data.personal_info.birthDate}</span>
                        </div>
                    )}
                    {data.personal_info?.gender && (
                        <div className="flex items-center gap-1">
                            {
                                data.personal_info.gender === "Female" ? (
                                    <Venus className="w-3 h-3" />
                                ) : data.personal_info.gender === "Male" ? (
                                    <Mars className="w-3 h-3" />
                                ) : (
                                    <VenusAndMars className="w-3 h-3" />
                                )
                            }
                            <span>{data.personal_info.gender}</span>
                        </div>
                    )}
                    {data.personal_info?.email && (
                        <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            <span>{data.personal_info.email}</span>
                        </div>
                    )}
                    {data.personal_info?.phone && (
                        <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span>{data.personal_info.phone}</span>
                        </div>
                    )}
                    {data.personal_info?.location && (
                        <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{data.personal_info.location}</span>
                        </div>
                    )}
                    {data.personal_info?.website && (
                        <div className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            <a href={data.personal_info.website} className="hover:text-gray-900 transition-colors">{data.personal_info.website}</a>
                        </div>
                    )}
                    {data.personal_info?.linkedin && (
                        <div className="flex items-center gap-1">
                            <Linkedin className="w-3 h-3" />
                            <a href={data.personal_info.linkedin} className="hover:text-gray-900 transition-colors">LinkedIn</a>
                        </div>
                    )}
                </div>
            </div>

            {/* Professional Summary */}
            {data.professional_sumary && (
                <div className="mb-10">
                    <div className="w-12 h-px mb-4" style={{ backgroundColor: accentColor }}></div>
                    <p className="text-gray-700 leading-relaxed text-lg font-light">{data.professional_sumary}</p>
                </div>
            )}

            <div className="grid lg:grid-cols-2 gap-12">
                {/* Left Column */}
                <div className="space-y-10">
                    {/* Experience */}
                    {data.experience && data.experience.length > 0 && (
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-6 uppercase tracking-wide" style={{ color: accentColor }}>Experience</h2>
                            <div className="space-y-6">
                                {data.experience.map((exp, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-medium text-gray-900">{exp.position}</h3>
                                                <p className="text-sm text-gray-600">{exp.company}</p>
                                            </div>
                                            <div className="text-xs text-gray-500 font-light">
                                                {exp.start_date && formatDate(exp.start_date)} - {exp.end_date && formatDate(exp.end_date)}
                                            </div>
                                        </div>
                                        {exp.description && (
                                            <p className="text-sm text-gray-700 leading-relaxed font-light">{exp.description}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Education */}
                    {data.education && data.education.length > 0 && (
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-6 uppercase tracking-wide" style={{ color: accentColor }}>Education</h2>
                            <div className="space-y-4">
                                {data.education.map((edu, index) => (
                                    <div key={index}>
                                        <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                                        <p className="text-sm text-gray-600">{edu.school}</p>
                                        <p className="text-xs text-gray-500 font-light">
                                            {edu.start_date && formatDate(edu.start_date)} - {edu.end_date && formatDate(edu.end_date)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div className="space-y-10">
                    {/* Skills */}
                    {data.skills && data.skills.length > 0 && (
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-6 uppercase tracking-wide" style={{ color: accentColor }}>Skills</h2>
                            <div className="space-y-2">
                                {data.skills.map((skill, index) => (
                                    <div key={index} className="text-sm text-gray-700 font-light">
                                        {skill}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Projects */}
                    {data.project && data.project.length > 0 && (
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-6 uppercase tracking-wide" style={{ color: accentColor }}>Projects</h2>
                            <div className="space-y-4">
                                {data.project.map((project, index) => (
                                    <div key={index}>
                                        <h3 className="font-medium text-gray-900 mb-1">{project.name}</h3>
                                        {project.description && (
                                            <p className="text-sm text-gray-700 leading-relaxed font-light mb-2">{project.description}</p>
                                        )}
                                        {project.technologies && project.technologies.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {project.technologies.map((tech, techIndex) => (
                                                    <span key={techIndex} className="text-xs px-2 py-1 rounded" style={{ backgroundColor: accentColor + '10', color: accentColor }}>
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
    )
}