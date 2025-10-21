import { Lock, Mail, User2Icon } from "lucide-react"
import React from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"

export default function Login() {
    const { t } = useTranslation()
    const query = new URLSearchParams(window.location.search)
    const urlState = query.get('state')
    const [state, setState] = React.useState(urlState || "login")

    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        password: ''
    })

    const handleSubmit = async (e: any) => {
        e.preventDefault()

    }

    const handleChange = (e: any) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const defaultLists = [
        [
            {
                src: 'https://s3.resume.io/cdn-cgi/image/width=384,format=auto/uploads/local_template_image/image/383/persistent-resource/santiago-resume-templates.jpg?v=1656070649',
                alt: 'Santiago resume template',
            },
            {
                src: 'https://s3.resume.io/cdn-cgi/image/width=384,format=auto/uploads/local_template_image/image/488/persistent-resource/dublin-resume-templates.jpg?v=1651663693',
                alt: 'Dublin resume template',
            },
            {
                src: 'https://s3.resume.io/cdn-cgi/image/width=384,format=auto/uploads/local_template_image/image/370/persistent-resource/stockholm-resume-templates.jpg?v=1656506913',
                alt: 'Stockholm resume template',
            },
            {
                src: 'https://s3.resume.io/cdn-cgi/image/width=384,format=auto/uploads/local_template_image/image/441/persistent-resource/sydney-resume-templates.jpg?v=1651657428',
                alt: 'Sydney resume template',
            },
        ],
        [
            {
                src: 'https://s3.resume.io/cdn-cgi/image/width=384,format=auto/uploads/local_template_image/image/406/persistent-resource/vienna-resume-templates.jpg?v=1656070334',
                alt: 'Vienna resume template',
            },
            {
                src: 'https://s3.resume.io/cdn-cgi/image/width=384,format=auto/uploads/local_template_image/image/389/persistent-resource/new-york-resume-templates.jpg?v=1651656959',
                alt: 'New York resume template',
            },
            {
                src: 'https://s3.resume.io/cdn-cgi/image/width=384,format=auto/uploads/local_template_image/image/370/persistent-resource/stockholm-resume-templates.jpg?v=1656506913',
                alt: 'Stockholm resume template',
            },
            {
                src: 'https://s3.resume.io/cdn-cgi/image/width=384,format=auto/uploads/local_template_image/image/441/persistent-resource/sydney-resume-templates.jpg?v=1651657428',
                alt: 'Sydney resume template',
            },
        ],
    ]

    return (
        <div className="flex h-screen w-full" style={{
            backgroundImage: "url('/anh_nen.jpg')",
        }}>
            <div className="absolute inset-0 bg-black/7 z-0"></div>

            <div className="z-20 hidden md:flex mt-5 h-[655px] w-full justify-center items-center overflow-hidden">
                <div className="relative flex gap-10 w-full justify-center">
                    <div className="relative flex flex-col gap-8 animate-scroll-infinite h-[200%]">
                        {[...defaultLists[0], ...defaultLists[0]].map((item, i) => (
                            <div
                                key={`col1-${i}`}
                                className="w-64 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all">
                                <img
                                    src={item.src}
                                    alt={item.alt}
                                    className="w-full h-auto object-cover rounded-xl"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="relative flex flex-col gap-8 animate-scroll-infinite-reverse h-[200%]">
                        {[...defaultLists[1], ...defaultLists[1]].map((item, i) => (
                            <div
                                key={`col2-${i}`}
                                className="w-64 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all">
                                <img
                                    src={item.src}
                                    alt={item.alt}
                                    className="w-full h-auto object-cover rounded-xl"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="z-20 w-full flex flex-col items-center justify-center">
                <form onSubmit={handleSubmit} className="md:w-96 min-w-120 flex flex-col items-center justify-center bg-white rounded-lg p-8">
                    <h2 className="text-4xl text-gray-900 font-medium">{state === "login" ? t('login') : t('signUp')}</h2>
                    <p className="text-sm text-gray-500/90 mt-3">{t('welcomeBack')} {t('please')} {state === "login" ? t('login') : t('signUp')} {t('toContinue')}</p>

                    {state !== "login" && (
                        <div className="flex items-center mt-6 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                            <User2Icon size={16} color="#6B7280"/>
                            <input type="text" name="name" placeholder={t('name')} className="border-none outline-none ring-0" value={formData.name} onChange={handleChange} required />
                        </div>
                    )}

                    <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 mt-6">
                        <Mail size={13} color="#6B7280"/>
                        <input type="email" name="email" placeholder={t('emailId')} className="border-none outline-none ring-0" value={formData.email} onChange={handleChange} required />
                    </div>

                    <div className="flex items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
                        <Lock size={13} color="#6B7280"/>
                        <input type="password" name="password" placeholder={t('password')} className="border-none outline-none ring-0" value={formData.password} onChange={handleChange} required />
                    </div>

                    <div className="mt-4 text-left text-purple-500">
                        <button className="text-sm" type="reset">{t('forgetPassword')}</button>
                    </div>

                    <button type="submit" className="mt-2 w-full h-11 rounded-full text-white bg-purple-500 hover:opacity-90 transition-opacity">
                        {state === "login" ? t('login') : t('signUp')}
                    </button>

                    <p onClick={() => setState(prev => prev === "login" ? "register" : "login")} className="text-gray-500 text-sm mt-3 mb-11">{state === "login" ? t('dontHaveAnAccount') : t('alreadyHaveAnAccount')} <Link to={state !== "login" ? '/login?state=login' : '/login?state=SignUp'} className="text-purple-500 hover:underline">{t('clickHere')}</Link></p>
                </form>
            </div>
        </div>
    )
}