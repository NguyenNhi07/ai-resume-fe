import { useToast } from "@/hooks/useToast";
import { CheckOutlined, CopyOutlined } from "@ant-design/icons";
import { Button, Input, Modal } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface ShareDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    resumeId: string;
}

const ShareDialog = ({ open, onOpenChange, resumeId }: ShareDialogProps) => {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);
    const toast = useToast()

    const shareUrl = `${window.location.origin}/view/${resumeId}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success(t("Link copied to clipboard"));
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDone = () => {
        onOpenChange(false);
    };

    return (
        <Modal
            open={open}
            title={t("Share Resume")}
            onCancel={() => onOpenChange(false)}
            footer={[
                <Button key="cancel" onClick={() => onOpenChange(false)}>
                    {t("Cancel")}
                </Button>,
                <Button key="done" type="primary" onClick={handleDone} style={{ backgroundColor: "#facc15", borderColor: "#facc15", color: "black" }}>
                    {t("Done")}
                </Button>,
            ]}
        >
            <div className="flex items-center gap-2">
                <Input
                    value={shareUrl}
                    readOnly
                />
                <Button
                    icon={copied ? <CheckOutlined /> : <CopyOutlined />}
                    onClick={handleCopyLink}
                    type="default"
                />
            </div>
        </Modal>
    );
};

export default ShareDialog;
