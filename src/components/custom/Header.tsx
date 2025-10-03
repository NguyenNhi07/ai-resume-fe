import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { UserButton, useUser } from "@clerk/clerk-react";

export default function Header() {
    const { user, isSignedIn } = useUser()

    return (
        <div className="p-3 px-5 flex justify-between shadow-md">
            <img src='logo.svg' width={80} height={80} />

            {isSignedIn ? (
                <div className="flex gap-2 items-center">
                    <Link to={'/dashboard'}>
                        <Button className="!bg-white !text-sm !text-black !border-[#0000002b]">Dashboard</Button>
                    </Link>
                    <UserButton />
                </div>
            ) : (
                <Link to={'/auth/sign-in'}>
                    <Button>Bắt đầu</Button>
                </Link>
            )}

        </div>
    )
}