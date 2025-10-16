import { useUser } from "@clerk/clerk-react";
import { AddResume } from "./_components/AddResume";
import GlobalApi from "./../../service/GlobalApi";
import { useEffect, useState } from "react";
import { ResumeCardItem } from "./_components/ResumeCardItem";
import type { Resume } from "./../../service/GlobalType";

export default function Dashboard () {
    const {user} = useUser()
    const [resumeList, setResumeList] = useState<Resume[]>([])

    useEffect(() => {
        user&&GetResumeList()
    }, [user])
    const GetResumeList = () => {
        GlobalApi.GetUserResume(user?.primaryEmailAddress?.emailAddress).then(res => setResumeList(res.data.data as Resume[]))
    }

    return <>
        <div className="p-10 md:px-20 lg:px-32">
            <h2 className="font-bold text-3xl">My Resume</h2>
            <p>Start Creating AI resume to your next Job role</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mt-10 gap-5">
                <AddResume/>
                {resumeList && resumeList.length > 0 && resumeList.map((rerume, index) => (
                    <ResumeCardItem key={index} resume={rerume}/>
                ))}
            </div>
        </div>
    </>
}