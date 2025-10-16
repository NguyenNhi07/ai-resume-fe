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

export function AddResume() {
    const [openDialog, setOpenDialog] = useState(false)
    const [resumeTitle, setResumeTitle] = useState()
    const [loading, setLoading] = useState(false)
    const { user } = useUser()
    const navigation = useNavigate()

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
            console.log(reponse)
            if (reponse) {
                setLoading(false)
                navigation(`/dashboard/resume/${uuid}/edit`)
            }
        }, (error) => {
            console.log(error)
            setLoading(false)
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
                        <DialogTitle>Create New Resume</DialogTitle>
                        <DialogDescription>
                            <p>Add a title for your new resume</p>
                            <Input onChange={(e: any) => setResumeTitle(e.target.value)} className="my-2" placeholder="Ex.Full Stack resume" />
                        </DialogDescription>
                        <div className="flex justify-end gap-4">
                            <Button onClick={() => setOpenDialog(false)} variant='ghost'>Cancel</Button>
                            <Button disabled={!resumeTitle || loading} onClick={onCreate}>{loading ? <Loader2 className="animate-spin" /> : 'Create'}</Button>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}