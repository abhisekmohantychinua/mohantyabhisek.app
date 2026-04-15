import type { FaqRequest } from './faq-request';

export interface BlogFormData {
  slug: string;
  title: string;
  description: string;
  topics: string[];
  faqs: FaqRequest[];
  content: string;
  metaTitle: string;
  metaDescription: string;
}
