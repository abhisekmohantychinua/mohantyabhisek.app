import type { FaqRequest } from './faq-request';

export interface BlogRequest {
  slug: string;
  title: string;
  description: string;
  topics: string[];
  faqs: FaqRequest[];
  content: string;
}
