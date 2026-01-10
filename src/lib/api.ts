import axios from 'axios';
import dayjs from 'dayjs';
import type { Resume } from './type';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true' || !import.meta.env.VITE_API_BASE_URL;

// Mock users database (in-memory for testing)
const mockUsers: Array<{
  id: string;
  name: string;
  email: string;
  password: string;
}> = [
    {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      password: '123456',
    },
    {
      id: '2',
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
    },
  ];

// Mock API delay
const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helpers to persist tokens
const setAccessToken = (token: string | null) => {
  if (token) localStorage.setItem('token', token);
  else localStorage.removeItem('token');
};
const setRefreshToken = (token: string | null) => {
  if (token) localStorage.setItem('refreshToken', token);
  else localStorage.removeItem('refreshToken');
};

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return null;

  const res = await axios.post<AuthResponse>(
    `${API_BASE_URL}/auth/refresh-token`,
    null,
    { headers: { Authorization: `Bearer ${refreshToken}` } },
  );

  const { accessToken, refreshToken: newRefresh } = res.data;
  if (accessToken) setAccessToken(accessToken);
  if (newRefresh) setRefreshToken(newRefresh);
  return accessToken ?? null;
};

// Handle response errors with refresh flow
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest: any = error.config;
    const status = error.response?.status;

    if (status === 401 && !originalRequest?._retry) {
      const storedRefresh = localStorage.getItem('refreshToken');
      if (!storedRefresh) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth/login';
        return Promise.reject(error);
      }

      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = refreshAccessToken().finally(() => {
          isRefreshing = false;
        });
      }

      const newToken = await refreshPromise;
      if (newToken) {
        originalRequest._retry = true;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      }

      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }

    return Promise.reject(error);
  },
);

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user?: {
    id?: string;
    name?: string;
    email?: string;
  };
}

export interface MeResponse {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  imageLink?: string;
  phoneNumber?: string;
  dob?: string;
  gender?: string;
  profession?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  dateOfBirth?: string; // DD/MM/YYYY
  phoneNumber?: string;
  gender?: string;
  profession?: string;
  imageLink?: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface UploadImageResponse {
  id: number;
  filename: string;
  path: string;
  mimetype: string;
  size: number;
  originalname: string;
  encoding: string;
  destination: string;
  createdAt: string;
}

// ----------------- resume mapping helpers -----------------
const DEFAULT_PAGE_SIZE = 99;

const toBackendResume = (r: Resume) => {
  const experiences =
    Array.isArray(r.experience) && r.experience.length
      ? r.experience.map((exp) => ({
        companyName: exp.company ?? '',
        jobTitle: exp.position ?? '',
        jobDescription: exp.description ?? '',
        isCurrent: exp.is_current ?? false,
        startDate: exp.start_date
          ? dayjs(exp.start_date, 'MM/YYYY').toISOString()
          : undefined,
        endDate: exp.end_date
          ? dayjs(exp.end_date, 'MM/YYYY').toISOString()
          : undefined,
      }))
      : undefined;

  const educations =
    Array.isArray(r.education) && r.education.length
      ? r.education.map((edu) => ({
        institutionName: edu.institution ?? '',
        degree: edu.degree ?? '',
        fieldOfStudy: edu.field ?? '',
        graduationDate: edu.graduation_date
          ? dayjs(edu.graduation_date, 'MM/YYYY').toISOString()
          : undefined,
        gpa: edu.gpa ?? '',
      }))
      : undefined;

  const projects =
    Array.isArray(r.project) && r.project.length
      ? r.project.map((p) => ({
        projectName: p.name ?? '',
        description: p.description ?? '',
        technologies: Array.isArray(p.technologies)
          ? p.technologies.filter(Boolean)
          : p.technologies
            ? [String(p.technologies)]
            : [],
      }))
      : undefined;

  return {
    // BE field `name` là tên người; `title` là tên CV
    name: r.personal_info?.full_name || r.title,
    title: r.title,
    avatar: r.personal_info?.image || undefined,
    dateOfBirth: r.personal_info?.birthDate
      ? dayjs(r.personal_info.birthDate, 'DD/MM/YYYY').toISOString()
      : undefined,
    gender: r.personal_info?.gender,
    email: r.personal_info?.email,
    phoneNumber: r.personal_info?.phone,
    address: r.personal_info?.location,
    profession: r.personal_info?.profession,
    language: r.personal_info?.language,
    website: r.personal_info?.website || undefined,
    professional: r.professional_summary,
    summary: r.professional_summary,
    skills: r.skills,
    ...(experiences ? { experiences } : {}),
    ...(educations ? { educations } : {}),
    ...(projects ? { projects } : {}),
    template: r.template || 'classic',
    accentColor: r.accent_color || '#3B82F6',
    fontFamily: r.font_family || 'inter',
    isPublic: r.public,
  };
};

const toFrontendResume = (data: any): Resume => ({
  id: String(data.id ?? ''),
  title: data.title ?? '',
  personal_info: {
    full_name: data.name ?? '',
    birthDate: data.dateOfBirth
      ? dayjs(data.dateOfBirth).isValid()
        ? dayjs(data.dateOfBirth).format('DD/MM/YYYY')
        : ''
      : '',
    gender: data.gender ?? '',
    email: data.email ?? '',
    phone: data.phoneNumber ?? '',
    location: data.address ?? '',
    website: Array.isArray(data.website) ? data.website[0] : data.website ?? '',
    language: data.language ?? '',
    image: data.avatar ?? '',
    profession: data.profession ?? '',
  },
  professional_summary: data.summary ?? data.professional ?? '',
  experience: Array.isArray(data.experiences)
    ? data.experiences.map((e: any) => {
      const start = e.start_date ?? e.startDate;
      const end = e.end_date ?? e.endDate;
      const isCurrent = e.is_current ?? e.isCurrent ?? false;
      const startStr = start
        ? dayjs(start).isValid()
          ? dayjs(start).format('MM/YYYY')
          : String(start)
        : '';
      const endStr = isCurrent
        ? ''
        : end
          ? dayjs(end).isValid()
            ? dayjs(end).format('MM/YYYY')
            : String(end)
          : '';
      return {
        company: e.company ?? e.companyName ?? '',
        position: e.position ?? e.jobTitle ?? '',
        description: e.description ?? e.jobDescription ?? '',
        is_current: isCurrent,
        start_date: startStr,
        end_date: endStr,
      };
    })
    : [],
  education: Array.isArray(data.educations)
    ? data.educations.map((edu: any) => {
      const grad = edu.graduation_date ?? edu.graduationDate;
      const gradStr = grad
        ? dayjs(grad).isValid()
          ? dayjs(grad).format('MM/YYYY')
          : String(grad)
        : '';
      return {
        institution: edu.institution ?? edu.institutionName ?? '',
        degree: edu.degree ?? '',
        field: edu.field ?? edu.fieldOfStudy ?? '',
        graduation_date: gradStr,
        gpa: edu.gpa ?? '',
      };
    })
    : [],
  project: Array.isArray(data.projects)
    ? data.projects.map((p: any) => ({
      name: p.name ?? p.projectName ?? '',
      description: p.description ?? '',
      technologies: Array.isArray(p?.technologies)
        ? p.technologies.filter(Boolean)
        : p?.technologies
          ? [String(p.technologies)]
          : [],
    }))
    : [],
  skills: Array.isArray(data.skills) ? data.skills : [],
  template: data.template ?? 'classic',
  accent_color: data.accentColor ?? '#3B82F6',
  public: data.isPublic ?? false,
  font_family: data.fontFamily ?? 'inter',
  // extra field from BE to use in dashboard card (type widening)
  createdAt: data.createdAt,
  updatedAt: data.updatedAt,
});

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    if (USE_MOCK_API) {
      // Simulate API delay
      await mockDelay(800);

      // Find user in mock database
      const user = mockUsers.find(u => u.email === data.email && u.password === data.password);

      if (!user) {
        throw new Error('Email hoặc mật khẩu không đúng');
      }

      // Generate mock token
      const token = `mock_token_${user.id}_${Date.now()}`;

      return {
        accessToken: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      };
    }

    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    if (USE_MOCK_API) {
      // Simulate API delay
      await mockDelay(800);

      // Check if email already exists
      const existingUser = mockUsers.find(u => u.email === data.email);
      if (existingUser) {
        throw new Error('Email này đã được sử dụng');
      }

      // Create new user
      const newUser = {
        id: String(mockUsers.length + 1),
        name: data.name,
        email: data.email,
        password: data.password,
      };

      mockUsers.push(newUser);

      // Generate mock token
      const token = `mock_token_${newUser.id}_${Date.now()}`;

      return {
        accessToken: token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
        },
      };
    }

    // backend expects /auth/signup with { email, password, name }
    const payload = { email: data.email, password: data.password, name: data.name };
    const response = await api.post<AuthResponse>('/auth/signup', payload);
    return {
      ...response.data,
      user: response.data.user ?? { email: data.email, name: data.name },
    };
  },

  forgotPassword: async (email: string, newPassword: string): Promise<void> => {
    if (USE_MOCK_API) {
      await mockDelay(600);
      return;
    }
    await api.post('/auth/forget-password', { email, newPassword });
  },

  verifyOtp: async (email: string, otp: string): Promise<void> => {
    if (USE_MOCK_API) {
      await mockDelay(400);
      return;
    }
    await api.post('/auth/verify-otp', { email, otp });
  },

  // Deprecated in new flow (OTP verify will set password)
  resetPassword: async (_email: string, _otp: string, _newPassword: string): Promise<void> => {
    throw new Error('resetPassword is deprecated; use forgotPassword + verifyOtp flow');
  },

  me: async (): Promise<MeResponse> => {
    const res = await api.get('/users/me');
    return res.data;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore error, we'll still clear client state
    } finally {
      setAccessToken(null);
      setRefreshToken(null);
      localStorage.removeItem('user');
    }
  },
};

export const userApi = {
  me: async (): Promise<MeResponse> => {
    const res = await api.get('/user/me');
    return res.data;
  },
  updateProfile: async (payload: UpdateProfileRequest): Promise<MeResponse> => {
    const body: any = { ...payload };
    if (payload.dateOfBirth) {
      body.dateOfBirth = dayjs(payload.dateOfBirth, 'DD/MM/YYYY').toISOString();
    }
    const res = await api.put('/user/me', body);
    return res.data;
  },
  changePassword: async (payload: ChangePasswordRequest): Promise<void> => {
    await api.post('/user/change-password', payload);
  },
};

export interface ResumeScore {
  id: number;
  resumeId: number;
  userId?: number;
  score: number;
  jdText: string;
  matchedRole?: string;
  missingSkills: string[];
  weakSections: string[];
  suggestions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ResumeScore {
  id: number;
  resumeId: number;
  userId?: number;
  score: number;
  jdText: string;
  matchedRole?: string;
  missingSkills: string[];
  weakSections: string[];
  suggestions: string[];
  createdAt: string;
  updatedAt: string;
}

export const resumeApi = {
  list: async (params?: {
    page?: number;
    pageSize?: number;
    lastItemId?: number;
    sortBy?: 'title' | 'createdAt' | 'updatedAt';
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ data: Resume[]; pagination?: { page: number; pageSize: number; total: number; totalPages: number } }> => {
    const orderBy: string[] = [];
    if (params?.sortBy) {
      orderBy.push(`${params.sortBy}:${params.sortOrder || 'desc'}`);
    }

    const query: any = {
      page: params?.page ?? 1,
      pageSize: Math.min(params?.pageSize ?? DEFAULT_PAGE_SIZE, 100),
      ...(params?.lastItemId ? { lastItemId: params.lastItemId } : {}),
      ...(orderBy.length ? { orderBy } : {}),
    };
    const res = await api.get('/resume', { params: query });
    const items = res.data?.data || res.data || [];
    return {
      data: items.map(toFrontendResume),
      pagination: res.data?.pagination,
    };
  },
  detail: async (id: string | number): Promise<Resume> => {
    const res = await api.get(`/resume/${id}`);
    return toFrontendResume(res.data);
  },
  publicDetail: async (id: string | number): Promise<Resume> => {
    const res = await api.get(`/public/resume/${id}`);
    return toFrontendResume(res.data);
  },
  create: async (resume: Resume): Promise<Resume> => {
    const payload = toBackendResume(resume);
    const res = await api.post('/resume', payload);
    return toFrontendResume(res.data);
  },
  createWithTitle: async (title: string): Promise<Resume> => {
    const res = await api.post('/resume', { title });
    return toFrontendResume(res.data);
  },
  update: async (id: string, resume: Resume): Promise<Resume> => {
    const payload = toBackendResume(resume);
    const res = await api.put(`/resume/${id}`, payload);
    return toFrontendResume(res.data);
  },
  setVisibility: async (id: string | number, isPublic: boolean): Promise<Resume> => {
    const res = await api.put(`/resume/${id}/visibility`, { isPublic });
    return toFrontendResume(res.data);
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`/resume/${id}`);
  },
  downloadPdf: async (id: string | number): Promise<Blob> => {
    const res = await api.get(`/resume/${id}/pdf`, { responseType: 'blob' });
    return res.data as Blob;
  },
  createScore: async (scoreData: {
    resumeId: number;
    score: number;
    jdText: string;
    matchedRole?: string;
    missingSkills: string[];
    weakSections: string[];
    suggestions: string[];
  }): Promise<ResumeScore> => {
    const res = await api.post('/resume/score', scoreData);
    return res.data;
  },
  getScoreList: async (resumeId: number, params?: {
    page?: number;
    pageSize?: number;
  }): Promise<{ data: ResumeScore[]; pagination?: { page: number; pageSize: number; total: number; totalPages: number } }> => {
    const query: any = {
      resumeId,
      page: params?.page ?? 1,
      pageSize: Math.min(params?.pageSize ?? 10, 100),
    };
    const res = await api.get('/resume/score', { params: query });
    return {
      data: res.data?.data || res.data || [],
      pagination: res.data?.pagination,
    };
  },
};

export const fileApi = {
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    // Don't set Content-Type header manually - let axios set it automatically with boundary
    const res = await api.post<UploadImageResponse>('/storage/local', formData);
    const filename = res.data.filename;
    // public URL to access the stored image
    return `${API_BASE_URL}/storage/local/${filename}`;
  },
};

export const aiApi = {
  optimizeText: async (text: string): Promise<string> => {
    if (USE_MOCK_API) {
      await mockDelay(1000);
      // Mock optimized text
      return `[Optimized] ${text}`;
    }
    // BE đã có prefix /api và versioning /v1, nên FE chỉ cần gọi /ai/optimize-text
    const res = await api.post<{ optimizedText: string }>('/ai/optimize-text', { text });
    return res.data.optimizedText;
  },
  scoreResumeByJD: async (
    resumeText: string,
    jdText: string,
  ): Promise<{
    score: number;
    missingSkills: string[];
    weakSections: string[];
    suggestions: string[];
    matchedRole?: string;
  }> => {
    const res = await api.post('/ai/score-resume-jd', { resumeText, jdText });
    return res.data;
  },
  generateCoverLetter: async (
    resumeText: string,
    jdText: string,
    type: 'normal' | 'friendly',
  ): Promise<{
    type: string;
    language: string;
    coverLetter: string;
  }> => {
    const res = await api.post('/ai/cover-letter', { resumeText, jdText, type });
    return res.data;
  },
  generateInterviewQuestions: async (
    resumeText: string,
    jdText: string,
  ): Promise<{
    language: string;
    matchedPosition?: string;
    questions: { type: string; question: string; expectedAnswer: string }[];
  }> => {
    const res = await api.post('/ai/interview-questions', { resumeText, jdText });
    return res.data;
  },
  scoreInterviewAnswers: async (
    qaList: { question: string; answer: string }[],
  ): Promise<{
    language: string;
    averageScore: number;
    results: {
      question: string;
      answer: string;
      score: number;
      comment: string;
      improvementSuggestions: string[];
    }[];
    overallFeedback: string;
  }> => {
    const res = await api.post('/ai/interview-score', { qaList });
    return res.data;
  },
  tailorResumeByJD: async (
    resumeText: string,
    jdText: string,
  ): Promise<{
    language: string;
    matchedPosition?: string;
    summary: { original: string; optimized: string };
    sections: {
      section: string;
      title: string;
      original: string;
      optimized: string;
      changes: string[];
    }[];
    overallSuggestions: string[];
  }> => {
    const res = await api.post('/ai/tailor-resume-jd', { resumeText, jdText });
    return res.data;
  },
};

export default api;

