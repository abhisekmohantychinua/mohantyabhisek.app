import type { FaqRequest } from './faq-request';

export interface BlogUpdateRequest {
  title?: string;
  description?: string;
  topics?: string[];
  faqs?: FaqRequest[];
  content?: string;
}
