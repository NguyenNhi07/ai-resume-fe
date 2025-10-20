import { Chinese } from "@/components/icons/Chinese";
import { English } from "@/components/icons/English";
import { French } from "@/components/icons/French";
import { Japanese } from "@/components/icons/Japanese";
import { Korean } from "@/components/icons/Korean";
import { Vietnamese } from "@/components/icons/Vietnamese";
import type { DefaultOptionType } from "antd/es/select";

export const LANGUAGE_OPTIONS: DefaultOptionType[] = [
{
    value: "en",
    label: (
      <div className="flex items-center gap-2">
        <English/>
        <span>English</span>
      </div>
    ),
  },
  {
    value: "vi",
    label: (
      <div className="flex items-center gap-2">
        <Vietnamese/>
        <span>Vietnamese</span>
      </div>
    )
  },
  {
    value: "cn",
    label: (
      <div className="flex items-center gap-2">
        <Chinese/>
        <span>Chinese</span>
      </div>
    ),
  },
  {
    value: "jp",
    label: (
      <div className="flex items-center gap-2">
        <Japanese/>
        <span>Japanese</span>
      </div>
    ),
  },
  {
    value: "ko",
    label: (
      <div className="flex items-center gap-2">
        <Korean/>
        <span>Korean</span>
      </div>
    ),
  },
  {
    value: "fr",
    label: (
      <div className="flex items-center gap-2">
        <French/>
        <span>French</span>
      </div>
    ),
  },
];