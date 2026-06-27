// platform/src/types/blocks.ts

export interface BlockDoc {
  id: string;
  type: string;
  themeOverride?: string | null;
  data: HeroData | AboutData | ExperienceData | SkillsData | EducationData | ContactData | ProjectsData | BooksData | GalleryData | Record<string, unknown>;
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

export interface ProjectItem {
  title: string;
  description?: string;
  tags: string[];
  url?: string;
  githubUrl?: string;
  status?: "completed" | "in-progress" | "archived";
}

export interface ProjectsData {
  items: ProjectItem[];
}

export interface BookItem {
  title: string;
  year: number;
  coverUrl?: string;
  description?: string;
  genre?: string;
  buyUrl?: string;
  isAvailable: boolean;
}

export interface BooksData {
  items: BookItem[];
}

export interface GalleryItem {
  imageUrl: string;
  caption?: string;
  alt?: string;
}

export interface GalleryData {
  items: GalleryItem[];
}
