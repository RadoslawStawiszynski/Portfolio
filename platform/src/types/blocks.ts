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

export interface ExperienceData {
  items: Array<{
    company: string;
    role: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }>;
}

export interface SkillsData {
  categories: Array<{
    name: string;
    skills: string[];
  }>;
}

export interface EducationData {
  items: Array<{
    school: string;
    degree: string;
    field: string;
    startYear: number;
    endYear?: number;
  }>;
}

export interface ContactData {
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  showForm: boolean;
}
