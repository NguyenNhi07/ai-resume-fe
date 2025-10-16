import { useUser } from "@clerk/clerk-react";
import { AddResume } from "./_components/AddResume";
import GlobalApi from "./../../service/GlobalApi";
import { useEffect, useState } from "react";
import { ResumeCardItem } from "./_components/ResumeCardItem";
import type { Resume } from "./../../service/GlobalType";
import { useTranslation } from "react-i18next";

export default function Dashboard () {
    const {user} = useUser()
    const [resumeList, setResumeList] = useState<Resume[]>([])
    const { t } = useTranslation();

    useEffect(() => {
        user&&GetResumeList()
    }, [user])
    const GetResumeList = () => {
        GlobalApi.GetUserResume(user?.primaryEmailAddress?.emailAddress).then(res => setResumeList(res.data.data as Resume[]))
    }

    return <>
        <div className="p-10 md:px-20 lg:px-32">
            <h2 className="font-bold text-3xl">{t('my_resume')}</h2>
            <p>{t('start_creating_AI_resume_to_your_next_Job_role')}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mt-10 gap-5">
                <AddResume/>
                {resumeList && resumeList.length > 0 && resumeList.map((rerume, index) => (
                    <ResumeCardItem key={index} resume={rerume}/>
                ))}
            </div>
        </div>
    </>
}