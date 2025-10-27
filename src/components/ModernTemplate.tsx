import type { Resume } from "@/lib/type"
import dayjs from 'dayjs'
import { CalendarDays, Globe, Linkedin, Mail, MapPin, Mars, Phone, Venus, VenusAndMars } from "lucide-react"

export const ModernTemplate = ({ data, accentColor }: { data: Resume, accentColor: string }) => {
    const formatDate = (date: string) => {
        return dayjs(date).format('MMM YYYY')
    }

    return (
        <div className="bg-white min-h-screen">
            {/* Header với background gradient */}
            <div className="relative" style={{ background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 100%)` }}>
                <div className="relative p-8 text-white">
                    <h1 className="text-4xl font-bold mb-2">{data.personal_info?.full_name}</h1>
                    <p className="text-xl opacity-90 mb-6">{data.personal_info?.profession}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        {data.personal_info?.birthDate && (
                            <div className="flex items-center gap-2">
                                <CalendarDays className="w-4 h-4" />
                                <span>{data.personal_info.birthDate}</span>
                            </div>
                        )}
                        {data.personal_info?.gender && (
                            <div className="flex items-center gap-2">
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
                                <a href={data.personal_info.website} className="hover:underline">{data.personal_info.website}</a>
                            </div>
                        )}
                        {data.personal_info?.linkedin && (
                            <div className="flex items-center gap-2">
                                <Linkedin className="w-4 h-4" />
                                <a href={data.personal_info.linkedin} className="hover:underline">LinkedIn</a>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-8 max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Professional Summary */}
                        {data.professional_sumary && (
                            <div>
                                <h2 className="text-2xl font-bold mb-4 flex items-center">
                                    <div className="w-1 h-8 mr-3 rounded" style={{ backgroundColor: accentColor }}></div>
                                    About Me
                                </h2>
                                <p className="text-gray-700 leading-relaxed text-lg">{data.professional_sumary}</p>
                            </div>
                        )}

                        {/* Experience */}
                        {data.experience && data.experience.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold mb-6 flex items-center">
                                    <div className="w-1 h-8 mr-3 rounded" style={{ backgroundColor: accentColor }}></div>
                                    Experience
                                </h2>
                                <div className="space-y-6">
                                    {data.experience.map((exp, index) => (
                                        <div key={index} className="relative">
                                            <div className="flex items-start gap-4">
                                                <div className="w-3 h-3 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: accentColor }}></div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h3 className="font-bold text-xl text-gray-900">{exp.position}</h3>
                                                            <p className="font-semibold text-lg" style={{ color: accentColor }}>{exp.company}</p>
                                                        </div>
                                                        <div className="text-sm text-gray-600 font-medium">
                                                            {exp.start_date && formatDate(exp.start_date)} - {exp.end_date && formatDate(exp.end_date)}
                                                        </div>
                                                    </div>
                                                    {exp.description && (
                                                        <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Projects */}
                        {data.project && data.project.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold mb-6 flex items-center">
                                    <div className="w-1 h-8 mr-3 rounded" style={{ backgroundColor: accentColor }}></div>
                                    Projects
                                </h2>
                                <div className="grid gap-6">
                                    {data.project.map((project, index) => (
                                        <div key={index} className="border rounded-lg p-6 hover:shadow-lg transition-shadow" style={{ borderColor: accentColor + '30' }}>
                                            <h3 className="font-bold text-xl text-gray-900 mb-3">{project.name}</h3>
                                            {project.description && (
                                                <p className="text-gray-700 leading-relaxed mb-4">{project.description}</p>
                                            )}
                                            {project.technologies && project.technologies.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {project.technologies.map((tech, techIndex) => (
                                                        <span key={techIndex} className="px-3 py-1 text-sm rounded-full font-medium" style={{ backgroundColor: accentColor + '20', color: accentColor }}>
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

                    {/* Right Column */}
                    <div className="space-y-8">
                        {/* Education */}
                        {data.education && data.education.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold mb-6 flex items-center">
                                    <div className="w-1 h-8 mr-3 rounded" style={{ backgroundColor: accentColor }}></div>
                                    Education
                                </h2>
                                <div className="space-y-4">
                                    {data.education.map((edu, index) => (
                                        <div key={index} className="border-l-4 pl-4" style={{ borderColor: accentColor }}>
                                            <h3 className="font-bold text-lg text-gray-900">{edu.degree}</h3>
                                            <p className="font-semibold text-gray-700 mb-1">{edu.school}</p>
                                            <p className="text-sm text-gray-600">
                                                {edu.start_date && formatDate(edu.start_date)} - {edu.end_date && formatDate(edu.end_date)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Skills */}
                        {data.skills && data.skills.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold mb-6 flex items-center">
                                    <div className="w-1 h-8 mr-3 rounded" style={{ backgroundColor: accentColor }}></div>
                                    Skills
                                </h2>
                                <div className="flex flex-wrap gap-3">
                                    {data.skills.map((skill, index) => (
                                        <span key={index} className="px-4 py-2 text-sm font-medium rounded-full" style={{ backgroundColor: accentColor + '20', color: accentColor }}>
                                            {skill}
                                        </span>
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