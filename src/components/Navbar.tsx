import { cn } from "@/lib/utils"
import { authApi } from "@/lib/api"
import {
    DownOutlined
} from '@ant-design/icons'
import { Avatar, Popover } from "antd"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"

export const Navbar = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const [user, setUser] = useState<{ name: string; email: string; avatarUrl?: string } | null>(null)

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

    const logoutUser = async () => {
        try {
            await authApi.logout()
        } finally {
            navigate('/auth/login')
        }
    }

    return (
        <div className="shadow bg-white">
            <nav className="flex items-center justify-between max-w-7xl mx-auto px-4 py-3.5 text-scale-800 transition-all">
                <Link to={'/'}>
                    <img src="/logo.svg" alt="logo" className="h-11 w-auto" />
                </Link>
                <div className="flex">
                    <div className="flex items-center gap-4 text-sm">
                        {user && (
                            <p className="max-sm:hidden !mb-0">{t('hi')}, {user.name}</p>
                        )}
                    </div>
                    <Popover
                        open={open}
                        onOpenChange={setOpen}
                        content={
                            <div>
                                <div
                                    className="text-black/85 text-sm leading-[22px] font-normal font-roboto py-1 px-3 text-center cursor-pointer hover:!bg-gray-50"
                                    onClick={() => navigate('/app')}
                                >
                                    {t('Dashboard')}
                                </div>
                                <div
                                    className="text-black/85 text-sm leading-[22px] font-normal font-roboto py-1 px-3 text-center cursor-pointer hover:!bg-gray-50"
                                    onClick={() => navigate('/setting')}
                                >
                                    {t('Profile Management')}
                                </div>
                                <div
                                    className="text-black/85 text-sm leading-[22px] font-normal font-roboto py-1 px-3 text-center cursor-pointer hover:!bg-gray-50"
                                    onClick={() => navigate('/setting/changePassword')}
                                >
                                    {t('Change Password')}
                                </div>
                                <div
                                    className="text-black/85 text-sm leading-[22px] font-normal font-roboto py-1 px-3 text-center cursor-pointer hover:!bg-gray-50"
                                    onClick={() => navigate('/setting/language')}
                                >
                                    {t('Language')}
                                </div>
                                <div
                                    className="text-black/85 text-sm leading-[22px] font-normal font-roboto py-1 px-3 text-center cursor-pointer hover:!bg-gray-50"
                                    onClick={logoutUser}
                                >
                                    {t('Logout')}
                                </div>
                            </div>
                        }
                        trigger="click"
                        className="cursor-pointer"
                        arrow={false}
                    >
                        <div
                            className={cn('px-4 py-3 flex items-center gap-2 h-full rounded-lg')}
                        >
                            <div className="relative w-6 h-6 rounded-full overflow-hidden">
                                <Avatar
                                    src={user?.avatarUrl || undefined}
                                    alt="profilePhotoUrl"
                                    size={24}
                                >
                                    {user?.name?.charAt(0) || ""}
                                </Avatar>
                            </div>
                            <DownOutlined style={{ fontSize: 12, color: '#00000080' }} />
                        </div>
                    </Popover>
                </div>
            </nav>
        </div>
    )
}