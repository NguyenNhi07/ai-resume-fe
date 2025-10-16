import { Loader2, PlusSquare } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { v4 as uuidv4 } from 'uuid'
import GlobalApi from "../../../service/GlobalApi";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/custom/Toast";
import { useTranslation } from "react-i18next";

export function AddResume() {
    const { toast } = useToast()
    const [openDialog, setOpenDialog] = useState(false)
    const [resumeTitle, setResumeTitle] = useState()
    const [loading, setLoading] = useState(false)
    const { user } = useUser()
    const navigation = useNavigate()
    const { t } = useTranslation();

    const onCreate = () => {
        setLoading(true)
        const uuid = uuidv4()

        const data = {
            data: {
                title: resumeTitle ?? '',
                resumeId: uuid,
                userEmail: user?.primaryEmailAddress?.emailAddress,
                userName: user?.fullName
            }
        }

        GlobalApi.CreateNewResume(data).then(reponse => {
            if (reponse) {
                setLoading(false)
                navigation(`/dashboard/resume/${reponse.data.data.documentId}/edit`)
                toast({
                    title: t('success'),
                    message: t('your_resume_created_successfully'),
                    variant: "success",
                })
            }
        }, (error) => {
            setLoading(false)
            console.log(error)
            toast({
                title: t('error'),
                message: t('something_went_wrong'),
                variant: "error",
            })
        })
        setOpenDialog(false)
    }

    return (
        <div>
            <div className="p-14 py-24 border items-center flex justify-center bg-secondary rounded-lg h-[280px] hover:scale-102 transition-all hover:shadow-md cursor-pointer border-dashed"
                onClick={() => setOpenDialog(true)}
            >
                <PlusSquare />
            </div>

            <Dialog open={openDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('create_new_resume')}</DialogTitle>
                        <DialogDescription>
                            <p>{t('add_a_title_for_your_new_resume')}</p>
                            <Input onChange={(e: any) => setResumeTitle(e.target.value)} className="my-2" placeholder={t('ex_full_stack_resume')} />
                        </DialogDescription>
                        <div className="flex justify-end gap-4">
                            <Button onClick={() => setOpenDialog(false)} variant='ghost'>{t('cancel')}</Button>
                            <Button disabled={!resumeTitle || loading} onClick={onCreate}>{loading ? <Loader2 className="animate-spin" /> : t('create')}</Button>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}