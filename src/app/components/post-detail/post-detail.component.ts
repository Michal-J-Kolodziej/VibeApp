import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';

import { AuthService } from '../../services/auth.service';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss'
})
export class PostDetailComponent implements OnInit {
  post: Post | undefined;
  
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private postService = inject(PostService);
  private chatService = inject(ChatService);
  public authService = inject(AuthService);

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.post = await this.postService.getPost(id);
    }
  }

  contactSeller() {
    if (!this.post || !this.post.userId) return;
    
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.post.userId === this.authService.currentUser()?.id) {
      alert("You can't message yourself!");
      return;
    }

    const chatId = this.chatService.createChat(this.post.userId);
    this.router.navigate(['/messages', chatId]);
  }
}
