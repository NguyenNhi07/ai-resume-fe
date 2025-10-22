import type { Resume } from "./type";

export const profileDefault: Resume =  {
    title: "",
    personal_info: {
      full_name: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedin: "",
      image: '',
    },
    professional_sumary: "",
    experience: [
      {
        company: "",
        position: "",
        start_date: "",
        end_date: "",
        description:
          "",
      },
    ],
    education: [
      {
        school: "",
        degree: "",
        start_date: "",
        end_date: "",
      },
    ],
    project: [
      {
        name: "",
        description:
          "",
        technologies: [],
      },
    ],
    skills: [],
    template: "",
    accent_color: "",
    public: false,
  }

export const onlyLettersRegex = /^[\p{L}\s]+$/u