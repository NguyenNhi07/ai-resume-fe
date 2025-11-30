import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const dummyResumeData = [
  {
    id: "1",
    title: "Frontend Developer Resume",
    personal_info: {
      full_name: "Nguyen Van A",
      email: "nguyenvana@example.com",
      birthDate: '07/11/2003',
      gender: 'Female',
      phone: "+84 912 345 678",
      location: "123 Le Duan, Hanoi, Vietnam",
      website: "https://nguyenvana.dev",
      linkedin: "https://linkedin.com/in/nguyenvana",
      image: 'https://avatars.githubusercontent.com/u/9919?v=4',
      profession: "Frontend Developer"
    },
    professional_summary:
      "Frontend Developer with 3+ years of experience building responsive, scalable web apps using React and TypeScript.",
    experience: [
      {
        company: "TechCorp Vietnam",
        position: "Frontend Developer",
        start_date: "2023-05-01",
        end_date: "2025-09-30",
        description:
          "Developed and maintained web apps using React and Tailwind CSS. Collaborated with designers and backend engineers to optimize performance.",
      },
    ],
    education: [
      {
        institution: "Hanoi University of Science and Technology",
        degree: "Bachelor of Information Technology",
        field: "Bachelor of Information Technology",
        graduation_date: "Bachelor of Information Technology",
        gpa: '6.0'
      },
    ],
    project: [
      {
        name: "Portfolio Website",
        description:
          "Built a personal portfolio with Next.js and Tailwind to showcase projects and blog posts.",
        technologies: ["Next.js", "Tailwind CSS", "Vercel"],
      },
    ],
    skills: ["React", "TypeScript", "Tailwind CSS", "Git", "REST API"],
    template: "classic",
    accent_color: "#3B82F6",
    public: true,
  },
  {
    id: "2",
    title: "Backend Developer Resume",
    personal_info: {
      full_name: "Tran Thi B",
      email: "tranthib@example.com",
      birthDate: '07/11/2003',
      gender: 'Female',
      phone: "+84 988 765 432",
      location: "456 Nguyen Trai, Hanoi, Vietnam",
      website: "https://tranthib.dev",
      linkedin: "https://linkedin.com/in/tranthib",
      image: 'https://avatars.githubusercontent.com/u/9919?v=4',
      profession: "Backend Developer"
    },
    professional_summary:
      "Backend Developer with expertise in Node.js, Express, and MongoDB, focused on building secure and efficient APIs.",
    experience: [
      {
        company: "CodeBase Co.",
        position: "Backend Engineer",
        start_date: "2022-03-01",
        end_date: "2025-09-01",
        description:
          "Implemented RESTful APIs using Node.js and Express. Managed MongoDB databases and improved API performance by 30%.",
      },
    ],
    education: [
      {
        institution: "Hanoi University of Science and Technology",
        degree: "Bachelor of Information Technology",
        field: "Bachelor of Information Technology",
        graduation_date: "Bachelor of Information Technology",
        gpa: '6.0'
      },
    ],
    project: [
      {
        name: "Task Management API",
        description:
          "Developed a REST API for a task management system supporting JWT authentication and CRUD operations.",
        technologies: ["Node.js", "Express", "MongoDB", "JWT"],
      },
    ],
    skills: ["Node.js", "Express", "MongoDB", "TypeScript", "Docker"],
    template: "modern",
    accent_color: "#10B981",
    public: false,
  },
  {
    id: "3",
    title: "UI/UX Designer Resume",
    personal_info: {
      full_name: "Le Thi C",
      email: "lethic@example.com",
      birthDate: '07/11/2003',
      gender: 'Female',
      phone: "+84 933 456 789",
      location: "789 Tran Hung Dao, Ho Chi Minh City, Vietnam",
      website: "https://lethic.design",
      linkedin: "https://linkedin.com/in/lethic",
      image: 'https://avatars.githubusercontent.com/u/9919?v=4',
      profession: "Creative UI/UX Designer"
    },
    professional_summary:
      "Creative UI/UX Designer with 4 years of experience designing user-centered digital products and improving usability through research and testing.",
    experience: [
      {
        company: "DesignLab Studio",
        position: "UI/UX Designer",
        start_date: "2021-08-01",
        end_date: "2025-10-01",
        description:
          "Created interactive prototypes in Figma, conducted user testing, and collaborated with developers to deliver pixel-perfect UI.",
      },
    ],
    education: [
      {
        institution: "Hanoi University of Science and Technology",
        degree: "Bachelor of Information Technology",
        field: "Bachelor of Information Technology",
        graduation_date: "Bachelor of Information Technology",
        gpa: '6.0'
      },
    ],
    project: [
      {
        name: "Mobile Banking App Redesign",
        description:
          "Redesigned a banking app to improve user flow and accessibility. Achieved 25% increase in user satisfaction.",
        technologies: ["Figma", "Adobe XD", "User Research"],
      },
    ],
    skills: ["Figma", "Prototyping", "Wireframing", "User Research", "Adobe XD"],
    template: "minimal",
    accent_color: "#F59E0B",
    public: true,
  },
];

