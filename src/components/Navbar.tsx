import { Link, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useEffect, useState } from "react"

export const Navbar = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [user, setUser] = useState<{ name: string; email: string } | null>(null)

    useEffect(() => {
        const userStr = localStorage.getItem('user')
        if (userStr) {
            try {
                setUser(JSON.parse(userStr))
            } catch (error) {
                console.error('Error parsing user data:', error)
            }
        }
    }, [])

    const logoutUser = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
    }

    return (
        <div className="shadow bg-white">
            <nav className="flex items-center justify-between max-w-7xl mx-auto px-4 py-3.5 text-scale-800 transition-all">
                <Link to={'/'}>
                    <img src="/logo.svg" alt="logo" className="h-11 w-auto" />
                </Link>
                <div className="flex items-center gap-4 text-sm">
                    {user && (
                        <p className="max-sm:hidden !mb-0">{t('hi')}, {user.name}</p>
                    )}
                    <button onClick={logoutUser} className="bg-white hover:bg-scale-50 border border-gray-300 px-7 py-1.5 rounded-full active:scale-95 transition-all">{t('logout')}</button>
                </div>
            </nav>
        </div>
    )
}