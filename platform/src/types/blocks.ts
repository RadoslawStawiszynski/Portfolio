// platform/src/types/blocks.ts

export interface BlockDoc {
  id: string;
  type: string;
  themeOverride?: string | null;
  data: HeroData | AboutData | ExperienceData | SkillsData | EducationData | ContactData | Record<string, unknown>;
}

export interface HeroData {
  title: string;
  subtitle?: string;
  avatarUrl?: string;
  cta?: { label: string; href: string };
}

export interface AboutData {
  bio: string;
  photoUrl?: string;
}

export interface ExperienceItem {
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface ExperienceData {
  items: ExperienceItem[];
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface SkillsData {
  categories: SkillCategory[];
}

export interface EducationItem {
  school: string;
  degree: string;
  field: string;
  startYear: number;
  endYear?: number;
}

export interface EducationData {
  items: EducationItem[];
}

export interface ContactData {
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  showForm: boolean;
}
