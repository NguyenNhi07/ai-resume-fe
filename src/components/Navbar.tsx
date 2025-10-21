import { Link, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

export const Navbar = () => {
    const { t } = useTranslation()
    const user = {name: 'John Doe'}
    const navigate = useNavigate()

    const logoutUser = () => {
        navigate('/')
    }

    return (
        <div className="shadow bg-white">
            <nav className="flex items-center justify-between max-w-7xl mx-auto px-4 py-3.5 text-scale-800 transition-all">
                <Link to={'/'}>
                    <img src="/logo.svg" alt="logo" className="h-11 w-auto" />
                </Link>
                <div className="flex items-center gap-4 text-sm">
                    <p className="max-sm:hidden !mb-0">{t('hi')}, {user?.name}</p>
                    <button onClick={logoutUser} className="bg-white hover:bg-scale-50 border border-gray-300 px-7 py-1.5 rounded-full active:scale-95 transition-all">{t('logout')}</button>
                </div>
            </nav>
        </div>
    )
}