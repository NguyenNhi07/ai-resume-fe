import type { Resume } from "./type";

export const profileDefault: Resume = {
  title: "",
  personal_info: {
    full_name: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    language: "",
    image: "",
  },
  professional_summary: "",
  experience: [
    {
      company: "",
      position: "",
      start_date: "",
      end_date: "",
      description: "",
    },
  ],
  education: [
    {
      institution: "",
      degree: "",
      field: "",
      graduation_date: "",
      gpa: "",
    },
  ],
  project: [
    {
      name: "",
      description: "",
      technologies: [],
    },
  ],
  skills: [],
  template: "",
  accent_color: "",
  public: false,
};

export const onlyLettersRegex = /^[\p{L}\s]+$/u;
