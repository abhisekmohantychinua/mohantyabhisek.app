import type { Faq } from './faq';

export interface Blog {
  slug: string;
  title: string;
  description: string;
  status: BlogStatus;
  postedAt: string;
  lastModifiedAt: string;
  topics: string[];
  faqs: Faq[];
  content: string;
}
export type BlogStatus = 'PUBLISHED' | 'UNPUBLISHED';
