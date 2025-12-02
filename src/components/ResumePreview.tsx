import type { Resume } from "@/lib/type";
import { BoldTemplate } from "./template/BoldTemplate";
import { MinimalImageTemplate } from "./template/MinimalImageTemplate";
import { MinimalTemplate } from "./template/MinimalTemplate";
import { ModernTemplate } from "./template/ModernTemplate";
import { ProfessionalTemplate } from "./template/ProfessionalTemplate";
import { ClassicTemplate } from "./template/ClassicTemplate";

export const ResumePreview = ({
  data,
  template,
  accentColor,
  classes,
}: {
  data: Resume;
  template: string;
  accentColor: string;
  classes: string;
}) => {
  const fontMap: Record<string, string> = {
    times: "Times New Roman, serif",
    inter: "Inter, system-ui, sans-serif",
    georgia: "Georgia, serif",
    arial: "Arial, Helvetica, sans-serif",
    roboto: "Roboto, sans-serif",
    poppins: "Poppins, sans-serif",
    mulish: "Mulish, sans-serif",
    helvetica: "Helvetica Neue, Helvetica, Arial, sans-serif",
    calibri: "Calibri, Candara, Segoe, Segoe UI, Optima, Arial, sans-serif",
    garamond:
      "Garamond, Baskerville, Baskerville Old Face, Hoefler Text, Times New Roman, serif",
    cambria: "Cambria, Georgia, serif",
    nunito: "Nunito, sans-serif",
    montserrat: "Montserrat, sans-serif",
  };

  const fontFamily =
    (data.font_family && fontMap[data.font_family]) ||
    "Inter, system-ui, sans-serif";

  const renderTemplate = () => {
    switch (template) {
      case "modern":
        return <ModernTemplate data={data} accentColor={accentColor} />;
      case "minimal":
        return <MinimalTemplate data={data} accentColor={accentColor} />;
      case "minimal-image":
        return <MinimalImageTemplate data={data} accentColor={accentColor} />;
      case "bold":
        return <BoldTemplate data={data} accentColor={accentColor} />;
      case "professional":
        return <ProfessionalTemplate data={data} accentColor={accentColor} />;
      default:
        return <ClassicTemplate data={data} accentColor={accentColor} />;
    }
  };

  return (
    <div className="w-full bg-gray-100">
      <div
        id="resume-preview"
        className={
          "border border-gray-200 print:shadow-none print:border-none " +
          classes
        }
      >
        {renderTemplate()}
      </div>

      <style>
        {`
                #resume-preview, #resume-preview * {
                    font-family: ${fontFamily} !important;
                }
                @page {
                    size: letter;
                    margin: 0;
                }
                @media print {
                    html. body {
                        width: 8.5in;
                        height: 11in;
                        overflow: hidden;
                    }
                    body * {
                        visibility: hidden;
                    }
                    #resume-preview, #resume-preview * {
                        visibility: visible;
                    }
                    #resume-preview {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: auto;
                        margin: 0;
                        padding: 0;
                        box-shadow: none !important;
                        border: none !important;
                    }
                }
                `}
      </style>
    </div>
  );
};
