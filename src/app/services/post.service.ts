import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private readonly STORAGE_KEY = 'furniture_posts';
  
  private platformId = inject(PLATFORM_ID);

  constructor() {
    this.initializeMockData();
  }

  getPosts(): Post[] {
    if (!isPlatformBrowser(this.platformId)) {
      return [];
    }
    const postsJson = localStorage.getItem(this.STORAGE_KEY);
    return postsJson ? JSON.parse(postsJson) : [];
  }

  addPost(post: Post): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const posts = this.getPosts();
    posts.push(post);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(posts));
  }

  getPost(id: string): Post | undefined {
    return this.getPosts().find(p => p.id === id);
  }

  private initializeMockData() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      const mockPosts: Post[] = [
        {
          id: '1',
          title: 'Vintage Sofa',
          description: 'A beautiful vintage sofa in good condition. Must pick up.',
          imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80',
          lat: 51.505,
          lng: -0.09,
          createdAt: new Date()
        },
        {
          id: '2',
          title: 'Wooden Table',
          description: 'Solid oak table, slightly scratched surface.',
          imageUrl: 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1771&q=80',
          lat: 51.51,
          lng: -0.1,
          createdAt: new Date()
        },
        {
          id: '3',
          title: 'Office Chair',
          description: 'Ergonomic office chair, black.',
          imageUrl: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
          lat: 51.515,
          lng: -0.09,
          createdAt: new Date()
        }
      ];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(mockPosts));
    }
  }
}
