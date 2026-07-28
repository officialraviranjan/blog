export interface Author {
  name: string;
  avatar: string;
  bio: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  date: string;
  updated?: string;
  draft: boolean;
  featured: boolean;
  cover: string;
  author: Author;
  categories: string[];
  tags: string[];
  readingTime: string;
}

export interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  date: string;
}
