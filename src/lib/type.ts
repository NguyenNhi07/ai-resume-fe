export interface Resume {
  id?: string;
  title: string;
  personal_info: PersonalInfo;
  professional_summary: string;
  experience: Experience[];
  education: Education[];
  project: Project[];
  skills?: string[];
  template?: string;
  accent_color?: string;
  public?: boolean;
}

export interface PersonalInfo {
  full_name?: string;
  birthDate?: string;
  gender?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  image?: string;
  profession?: string;
}

export interface Experience {
  company?: string;
  position?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
  is_current?: boolean;
}

export interface Education {
  institution?: string;
  degree?: string;
  field?: string;
  graduation_date?: string;
  gpa?: string;
}

export interface Project {
  name?: string;
  description?: string;
  technologies?: string[];
}
