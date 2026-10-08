import type { ProjectLink } from '@/types/projects';

export type ApiFailure = {
  success: false;
  error: { code: string; message: string; details?: { path: string; message: string }[] };
};
export type ApiResponse<T> = { success: true; data: T } | ApiFailure;
export type Admin = { id: string; email: string };
export type LoginResult = {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: 28800;
  admin: Admin;
};
export type SiteData = {
  profile: {
    displayName: string;
    brandName: string;
    email: string;
    githubUrl: string;
    copyright: string;
  };
  hero: { eyebrow: string; title: string; description: string; ctaLabel: string };
  about: { title: string; paragraphs: string[] };
  contact: { title: string; description: string; message: string };
  seo: { title: string; description: string };
  sections: {
    experience: string;
    techStack: string;
    projects: string;
    sideProjects: string;
    projectsPageTitle: string;
    projectsPageDescription: string;
    majorProjectsDescription: string;
    sideProjectsDescription: string;
    etcProjects: string;
    etcProjectsDescription: string;
  };
};
export type Site = { id: 1; data: SiteData; version: number; updatedAt: string };
export type ContentRecord<T> = T & {
  id: string;
  version: number;
  createdAt: string;
  updatedAt: string;
};
export type ContentFlags = { isPublished: boolean; sortOrder: number };
export type ExperienceInput = ContentFlags & {
  title: string;
  organization: string;
  period: string;
  iconKey: string;
  responsibilities: string[];
  skills: string[];
};
export type TechGroupInput = ContentFlags & {
  title: string;
  items: { name: string; iconName?: string }[];
};
export type CaseStudySection = {
  title: string;
  paragraphs?: string[];
  list?: string[];
  paragraphsAfterList?: string[];
  steps?: { title: string; list: string[] }[];
};
export type CaseStudyContent = {
  overview: { title: string; detail: string[] };
  contribution: { title: string; items: { title: string; paragraphs: string[] }[] };
  troubleShooting: {
    title: string;
    cases: { caseTitle: string; layout?: 'grid' | 'zigzag'; sections: CaseStudySection[] }[];
  };
  review: { title: string; detail: string[] };
  techStack: {
    title: string;
    groups: {
      groupTitle: string;
      items: {
        name: string;
        description: string;
        icon?: string;
        iconVariant?: 'light' | 'dark' | 'grayscale';
      }[];
    }[];
  };
  peerReview?: { strengths: string[]; improvements: string[] };
};
export type ChangelogContent = {
  entries: { date?: string; title?: string; reason: string; action: string; result: string }[];
};
export type ProjectBase = ContentFlags & {
  slug: string;
  title: string;
  category: 'major' | 'side' | 'etc';
  subtitle: string | null;
  description: string | null;
  imageSrc: string | null;
  logoSrc: string | null;
  role: string | null;
  period: string | null;
  repository: string | null;
  links: ProjectLink[];
  keywords: string[];
  techStack: string[];
  seo: { title?: string; description?: string };
  showOnHome: boolean;
};
export type ProjectInput = ProjectBase &
  (
    | { template: 'case-study'; content: CaseStudyContent }
    | { template: 'changelog'; content: ChangelogContent }
    | { template: 'none'; content: Record<string, never> }
  );
export type Resource = 'experiences' | 'tech-groups' | 'projects';
export type InputMap = {
  experiences: ExperienceInput;
  'tech-groups': TechGroupInput;
  projects: ProjectInput;
};
export type ContentMap = { [K in Resource]: ContentRecord<InputMap[K]> };
export type ProjectTemplate = ProjectInput['template'];
