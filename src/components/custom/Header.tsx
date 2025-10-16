import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { UserButton, useUser } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";

export default function Header() {
    const { isSignedIn } = useUser()
    const { t, i18n } = useTranslation();

    return (
        <div className="p-3 px-5 flex justify-between shadow-md">
            <img src='logo.svg' width={80} height={80} />
            <button onClick={() => i18n.changeLanguage("vi")}>🇻🇳</button>
            <button onClick={() => i18n.changeLanguage("en")}>🇬🇧</button>

            {isSignedIn ? (
                <div className="flex gap-2 items-center">
                    <Link to={'/dashboard'}>
                        <Button className="!bg-white !text-sm !text-black !border-[#0000002b]">{t('dashboard')}</Button>
                    </Link>
                    <UserButton />
                </div>
            ) : (
                <Link to={'/auth/sign-in'}>
                    <Button>{t('started')}</Button>
                </Link>
            )}

        </div>
    )
}