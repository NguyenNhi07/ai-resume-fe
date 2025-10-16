import { Notebook } from "lucide-react";
import type { Resume } from "./../../../service/GlobalType";
import { Link } from "react-router-dom";

export function ResumeCardItem ({resume} : {resume: Resume}) {
    return (
        <Link to={`/dashboard/resume/${resume.resumeId}/edit`}>
            <div className="p-14 bg-secondary flex items-center justify-center h-[280px] border border-primary rounded-lg hover:scale-102 transitionn-all hover:shadow-sm shadow-primary">
                <Notebook/>
            </div>
            <h2 className="text-center my-1">{resume.title}</h2>
        </Link>
    )
}