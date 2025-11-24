import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Post } from '../../models/post.model';
import { AuthService } from '../../services/auth.service';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  authService = inject(AuthService);
  private postService = inject(PostService);

  userPosts = signal<Post[]>([]);

  ngOnInit(): void {
    // In a real app, we'd fetch posts by userId from the backend
    // For this mock, we'll just filter all posts (assuming we add userId to posts later)
    // Since we haven't added userId to posts yet, this will be empty or show all for now
    // Let's just show all posts for demo purposes until we update Post model
    this.userPosts.set(this.postService.getPosts()); 
  }

  logout(): void {
    this.authService.logout();
  }
}
