export interface Resume {
  id: string;
  title: string;
  image?: string;
  personal_info: {
    full_name?: string;
    email?: string;
    phone?: string;
    address?: string;
    website?: string;
    linkedin?: string;
  };
  professional_sumary: string;
  experience: {
    company?: string;
    position?: string;
    start_date?: string;
    end_date?: string;
    description?: string;
  }[];
  education: {
    school?: string;
    degree?: string;
    start_date?: string;
    end_date?: string;
  }[];
  project: {
    name?: string;
    description?: string;
    technologies?: string[];
  }[];
  skills?: string[];
  template?: string;
  accent_color?: string;
  public?: boolean;
};
