import { SignIn } from "@clerk/clerk-react";

export default function SignInPage () {
    return <>
        <div className="flex justify-center my-20 items-center"><SignIn/></div>
    </>
}