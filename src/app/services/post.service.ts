import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Post } from '../models/post.model';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/posts`;

  constructor() {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  async getPosts(): Promise<Post[]> {
    try {
      const posts = await firstValueFrom(
        this.http.get<Post[]>(this.apiUrl)
      );
      return posts.map(post => ({
        ...post,
        createdAt: new Date(post.createdAt)
      }));
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  }

  async addPost(post: Omit<Post, 'id' | 'createdAt'>): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post(this.apiUrl, post, { headers: this.getHeaders() })
      );
    } catch (error) {
      console.error('Error adding post:', error);
    }
  }

  async getPost(id: string): Promise<Post | undefined> {
    try {
      const post = await firstValueFrom(
        this.http.get<Post>(`${this.apiUrl}/post/${id}`)
      );
      if (post) {
        return {
          ...post,
          createdAt: new Date(post.createdAt)
        };
      }
      return undefined;
    } catch (error) {
      console.error('Error fetching post:', error);
      return undefined;
    }
  }
}
