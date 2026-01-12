import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Resume } from "./type";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const dummyResumeData: Resume[] = [
  {
    id: "1",
    title: "Frontend Developer Resume",
    personal_info: {
      full_name: "Nguyen Van A",
      email: "nguyenvana@example.com",
      birthDate: "07/11/2003",
      gender: "Female",
      phone: "+84 912 345 678",
      location: "123 Le Duan, Hanoi, Vietnam",
      website: "https://nguyenvana.dev",
      language: "English",
      image: "https://avatars.githubusercontent.com/u/9919?v=4",
      profession: "Frontend Developer",
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
        gpa: "6.0",
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
      birthDate: "07/11/2003",
      gender: "Female",
      phone: "+84 988 765 432",
      location: "456 Nguyen Trai, Hanoi, Vietnam",
      website: "https://tranthib.dev",
      language: "English",
      image: "https://avatars.githubusercontent.com/u/9919?v=4",
      profession: "Backend Developer",
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
        gpa: "6.0",
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
      birthDate: "07/11/2003",
      gender: "Female",
      phone: "+84 933 456 789",
      location: "789 Tran Hung Dao, Ho Chi Minh City, Vietnam",
      website: "https://lethic.design",
      language: "English",
      image: "https://avatars.githubusercontent.com/u/9919?v=4",
      profession: "Creative UI/UX Designer",
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
        gpa: "6.0",
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
    skills: [
      "Figma",
      "Prototyping",
      "Wireframing",
      "User Research",
      "Adobe XD",
    ],
    template: "minimal",
    accent_color: "#F59E0B",
    public: true,
  },
];

// Phân tích JD để trích xuất các kỹ năng chính (dùng heuristics đơn giản)
export function extractSkillsFromJD(
  jd: string,
  knownSkills: string[] = []
): string[] {
  if (!jd) return [];

  const text = jd.toLowerCase();
  const candidates = new Set<string>();

  // Ưu tiên các kỹ năng đã có sẵn trong CV
  knownSkills.forEach((skill) => {
    if (!skill) return;
    const normalized = skill.toLowerCase();
    if (text.includes(normalized)) {
      candidates.add(skill);
    }
  });

  // Một số từ khóa kỹ năng phổ biến
  const commonSkills = [
    "react",
    "typescript",
    "javascript",
    "node.js",
    "nodejs",
    "express",
    "nestjs",
    "postgresql",
    "mysql",
    "docker",
    "kubernetes",
    "tailwind css",
    "figma",
    "ui/ux",
    "html",
    "css",
  ];

  commonSkills.forEach((skill) => {
    const normalized = skill.toLowerCase();
    if (text.includes(normalized)) {
      candidates.add(
        skill
          .split(" ")
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join(" ")
      );
    }
  });

  return Array.from(candidates).slice(0, 12);
}

// Giả lập AI: viết lại CV để match JD hơn
export async function tailorResumeByJD(
  base: Resume,
  jd: string,
  jdSkills: string[]
): Promise<Resume> {
  // Giả lập trễ như gọi API AI thật
  await new Promise((resolve) => setTimeout(resolve, 700));

  const firstLine = jd.split("\n").find((l) => l.trim().length > 0) || "";
  let roleFromJD = "";

  const match = firstLine.match(
    /(frontend|backend|fullstack|full-stack|software|developer|engineer|designer|data|product)/i
  );
  if (match) {
    roleFromJD = match[0];
  }

  const uniqueSkills = Array.from(
    new Set([...(base.skills || []), ...jdSkills])
  );

  const summaryPrefix =
    "CV được tinh chỉnh cho vị trí này. Nổi bật kinh nghiệm và kỹ năng phù hợp mô tả công việc.";

  const skillsText =
    jdSkills.length > 0 ? ` Kỹ năng nổi bật: ${jdSkills.join(", ")}.` : "";

  const newSummary = `${summaryPrefix}${skillsText}${
    base.professional_summary ? " " + base.professional_summary : ""
  }`;

  return {
    ...base,
    title: base.title
      ? `${base.title} — Tailored${roleFromJD ? ` for ${roleFromJD}` : ""}`
      : "Tailored Resume",
    professional_summary: newSummary,
    skills: uniqueSkills,
  };
}

// Giả lập AI: sinh câu hỏi phỏng vấn từ CV + JD
export function generateInterviewQuestions(
  resume: Resume,
  jd: string,
  jdSkills: string[]
): Array<{
  id: string;
  type: "technical" | "behavioral";
  question: string;
  hint?: string;
}> {
  const skills = jdSkills.length ? jdSkills : resume.skills || [];
  const topSkill = skills[0] || "kỹ năng chính";
  const secondSkill = skills[1] || "một công nghệ bạn nắm";
  const role =
    resume.personal_info?.profession || resume.title || "vị trí đang ứng tuyển";

  return [
    {
      id: "tech-1",
      type: "technical",
      question: `Hãy mô tả một dự án bạn đã dùng ${topSkill} và thách thức kỹ thuật lớn nhất bạn giải quyết là gì?`,
      hint: `Làm rõ kiến trúc, hiệu năng và vai trò của bạn.`,
    },
    {
      id: "tech-2",
      type: "technical",
      question: `Nếu phải tối ưu hiệu năng cho sản phẩm liên quan ${secondSkill}, bạn sẽ đo lường và cải thiện bằng cách nào?`,
      hint: `Nhắc đến profiling, caching, testing hoặc tooling phù hợp.`,
    },
    {
      id: "tech-3",
      type: "technical",
      question: `Bạn thiết kế kiểm thử / chất lượng cho tính năng quan trọng trong vai trò ${role} như thế nào?`,
      hint: `Nhắc đến test pyramid, automation, CI/CD.`,
    },
    {
      id: "beh-1",
      type: "behavioral",
      question:
        "Kể về một lần bạn nhận feedback khó nghe và cách bạn điều chỉnh kế hoạch.",
      hint: "STAR (Situation, Task, Action, Result).",
    },
    {
      id: "beh-2",
      type: "behavioral",
      question:
        "Khi deadline gấp và yêu cầu thay đổi, bạn ưu tiên công việc và trao đổi với team ra sao?",
      hint: "Nhấn vào giao tiếp, thương lượng phạm vi, quản lý rủi ro.",
    },
  ];
}

// Giả lập AI: chấm điểm câu trả lời phỏng vấn
export function scoreInterviewAnswers(
  questions: Array<{ id: string; question: string }>,
  answers: Record<string, string>,
  jdSkills: string[]
): {
  total: number;
  perQuestion: Array<{ id: string; score: number; feedback: string }>;
} {
  const perQuestion = questions.map((q) => {
    const ans = answers[q.id] || "";
    let score = 40;
    if (ans.length > 120) score += 20;
    if (ans.length > 250) score += 10;
    const lower = ans.toLowerCase();
    const matched = jdSkills.filter((s) => lower.includes(s.toLowerCase()));
    score += Math.min(matched.length * 8, 20);
    score = Math.min(score, 95);

    const feedbackParts: string[] = [];
    if (matched.length === 0 && jdSkills.length > 0) {
      feedbackParts.push(
        "Nên nhắc trực tiếp các kỹ năng trong JD để tăng độ khớp."
      );
    }
    if (ans.length < 80) {
      feedbackParts.push(
        "Câu trả lời còn ngắn, hãy bổ sung bối cảnh và kết quả cụ thể."
      );
    } else {
      feedbackParts.push(
        "Trình bày đủ ý, có thể thêm số liệu/KPI để thuyết phục hơn."
      );
    }

    return {
      id: q.id,
      score: Math.round(score),
      feedback: feedbackParts.join(" "),
    };
  });

  const total =
    perQuestion.reduce((acc, item) => acc + item.score, 0) /
    Math.max(perQuestion.length, 1);

  return { total: Math.round(total), perQuestion };
}

// Giả lập AI: sinh cover letter từ CV + JD + tone
/**
 * Format text with markdown-like formatting for resume display
 * Converts markdown bullet points to clean text with proper line breaks
 */
export function formatResumeText(text: string): string {
  if (!text) return "";

  // Split by lines and process each line
  const lines = text.split("\n");
  const processedLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      // Preserve empty lines for spacing
      processedLines.push("");
      continue;
    }

    // Check if line is a markdown bullet point
    if (/^[-*•]\s/.test(trimmed)) {
      // Remove bullet marker and keep content
      const cleaned = trimmed.replace(/^[-*•]\s+/, "").trim();
      if (cleaned) {
        processedLines.push(cleaned);
      }
    } else if (/^\d+\.\s/.test(trimmed)) {
      // Remove numbered list marker
      const cleaned = trimmed.replace(/^\d+\.\s+/, "").trim();
      if (cleaned) {
        processedLines.push(cleaned);
      }
    } else {
      // Regular line, keep as-is
      processedLines.push(trimmed);
    }
  }

  // Join lines with newlines (will be rendered as line breaks in HTML)
  return processedLines.join("\n");
}

export function generateCoverLetter(
  resume: Resume,
  jd: string,
  tone: "formal" | "friendly",
  jdSkills: string[]
): string {
  const name = resume.personal_info?.full_name || "Ứng viên";
  const role =
    resume.personal_info?.profession || resume.title || "vị trí ứng tuyển";
  const email = resume.personal_info?.email || "";
  const phone = resume.personal_info?.phone || "";
  const skills = jdSkills.length ? jdSkills : (resume.skills || []).slice(0, 6);

  const toneLine =
    tone === "formal"
      ? "Tôi xin trình bày nguyện vọng ứng tuyển và mong muốn được đóng góp cho quý công ty."
      : "Tôi rất hào hứng với cơ hội này và tin rằng mình sẽ đóng góp tích cực cho đội ngũ.";

  const jdLine = jd
    ? "Từ mô tả công việc, tôi nhận thấy yêu cầu nổi bật gồm: " +
      jd
        .split("\n")
        .filter((s) => s.trim().length > 0)
        .slice(0, 2)
        .join(" ")
    : "Tôi hiểu vị trí cần người chủ động, hợp tác và chú trọng chất lượng sản phẩm.";

  const skillLine = skills.length
    ? `Kỹ năng liên quan: ${skills.join(", ")}.`
    : "";

  return (
    `Kính gửi Nhà tuyển dụng,\n\n${toneLine}\n\n` +
    `Tôi quan tâm đến vị trí ${role}. ${jdLine}\n\n` +
    `${skillLine}\n\n` +
    `Trong các dự án trước đây, tôi đã chủ động phối hợp với đội ngũ đa chức năng, tối ưu hiệu năng và đảm bảo chất lượng thông qua kiểm thử và phản hồi người dùng. Tôi tin rằng kinh nghiệm này sẽ hữu ích cho vai trò đang tuyển.\n\n` +
    `Rất mong có cơ hội trao đổi thêm. Xin cảm ơn và trân trọng.\n\n` +
    `${name}\n${email ? `Email: ${email}\n` : ""}${
      phone ? `Phone: ${phone}\n` : ""
    }`
  );
}

// Giả lập AI: chấm điểm CV theo JD và gợi ý cải thiện
export async function scoreResumeAgainstJD(
  resume: Resume,
  jd: string,
  jdSkills: string[]
): Promise<{
  score: number;
  missingSkills: string[];
  weakSections: string[];
  suggestions: string[];
  matchedRole?: string;
}> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const hasSummary = Boolean(resume.professional_summary?.trim());
  const hasProjects = (resume.project?.length || 0) > 0;
  const hasExperience = (resume.experience?.length || 0) > 0;

  // điểm giả lập
  let score = 50;
  score += Math.min(jdSkills.length * 4, 30);
  if (hasSummary) score += 5;
  if (hasProjects) score += 8;
  if (hasExperience) score += 7;
  score = Math.min(score, 95);

  // thiếu kỹ năng: lấy 5 kỹ năng JD chưa có trong CV
  const knownSkills = new Set(
    (resume.skills || []).map((s) => s.toLowerCase())
  );
  const missing = jdSkills
    .filter((s) => !knownSkills.has(s.toLowerCase()))
    .slice(0, 5);

  const weakSections: string[] = [];
  if (!hasSummary) weakSections.push("Professional Summary");
  if (!hasExperience) weakSections.push("Experience");
  if (!hasProjects) weakSections.push("Projects");

  const suggestions: string[] = [];
  if (missing.length) {
    suggestions.push(`Bổ sung kỹ năng: ${missing.join(", ")}`);
  }
  if (!hasSummary) {
    suggestions.push(
      "Viết tóm tắt chuyên môn ngắn gọn, làm rõ kết quả và công nghệ chính."
    );
  }
  if (!hasExperience) {
    suggestions.push(
      "Thêm kinh nghiệm liên quan tới JD, nêu trách nhiệm và kết quả đo lường."
    );
  }
  if (!hasProjects) {
    suggestions.push("Thêm 1-2 dự án thể hiện các kỹ năng trong JD.");
  }
  if (suggestions.length === 0) {
    suggestions.push("CV đã khá phù hợp, hãy bổ sung ví dụ và số liệu cụ thể.");
  }

  const firstLine = jd.split("\n").find((l) => l.trim().length > 0) || "";
  const match = firstLine.match(
    /(frontend|backend|fullstack|full-stack|software|developer|engineer|designer|data|product)/i
  );

  return {
    score: Math.round(score),
    missingSkills: missing,
    weakSections,
    suggestions,
    matchedRole: match ? match[0] : undefined,
  };
}
