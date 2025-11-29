export interface ShortenedUrl {
  id: string;
  code: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: string;
}

export interface UrlFormData {
  url: string;
}
