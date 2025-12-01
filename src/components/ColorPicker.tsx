import { Popover } from "antd";
import { Check, Palette } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next";

export const ColorPicker = ({ selectedColor, onChange }: { selectedColor: string, onChange: (value: string) => void }) => {
    const { t } = useTranslation();

    const colors = [
        { name: "Blue", value: '#3B82F6' },
        { name: "Indigo", value: '#6366F1' },
        { name: "Purple", value: '#8B5CF6' },
        { name: "Green", value: '#10B981' },
        { name: "Red", value: '#EF4444' },
        { name: "Orange", value: '#F97316' },
        { name: "Teal", value: '#14B8A6' },
        { name: "Pink", value: '#EC4899' },
        { name: "Gray", value: '#6B7280' },
        { name: "Black", value: '#1F2937' },
    ]

    const [open, setOpen] = useState(false)

    return (
        <div className="relative">
            <Popover
                open={open}
                onOpenChange={setOpen}
                content={
                    <div className="grid grid-cols-4 w-60 gap-2">
                        {colors.map((color) => (
                            <div key={color.value} className="relative cursor-pointer group flex flex-col" onClick={() => { onChange(color.value) }}>
                                <div className="w-12 h-12 rounded-full border-2 border-transparent group-hover:border-black/25 transition-colors" style={{ backgroundColor: color.value }} >
                                </div>
                                {selectedColor === color.value && (
                                    <div className="absolute top-0 left-0 right-0 bottom-4.5 flex items-center justify-center">
                                        <Check className="size-5 text-white" />
                                    </div>
                                )}
                                <p className="text-xs text-center mt-1 text-gray-600">{color.name}</p>
                            </div>
                        ))}
                    </div>
                }
                trigger="click"
                className="cursor-pointer"
                arrow={false}
            >
                <div className="flex items-center gap-1 text-sm !text-purple-600 bg-gradient-to-br from-purple-50 to-purple-100 ring-purple-300 hover:ring transition-all px-3 py-2 rounded-lg">
                    <Palette size={16} /> <span className="max-sm:hidden">{t("Accent")}</span>
                </div>
            </Popover>
        </div>
    )
}