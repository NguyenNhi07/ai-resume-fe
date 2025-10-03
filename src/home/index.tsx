import { UserButton } from "@clerk/clerk-react";

export default function Home () {
    return <>
        <div className="p-8">
            <UserButton/>
        </div>
    </>
}