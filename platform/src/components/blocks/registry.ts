// platform/src/components/blocks/registry.ts
import { HeroBlock } from "./HeroBlock";
import { AboutBlock } from "./AboutBlock";
import { ExperienceBlock } from "./ExperienceBlock";
import { SkillsBlock } from "./SkillsBlock";
import { EducationBlock } from "./EducationBlock";
import { ContactBlock } from "./ContactBlock";

export const BLOCK_REGISTRY = {
  hero: HeroBlock,
  about: AboutBlock,
  experience: ExperienceBlock,
  skills: SkillsBlock,
  education: EducationBlock,
  contact: ContactBlock,
} as const;

export type RegisteredBlockType = keyof typeof BLOCK_REGISTRY;
