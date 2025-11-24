import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { Chat } from '../../../models/chat.model';
import { AuthService } from '../../../services/auth.service';
import { ChatService } from '../../../services/chat.service';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatListModule, MatIconModule, MatButtonModule],
  templateUrl: './chat-list.html',
  styleUrl: './chat-list.scss'
})
export class ChatListComponent {
  chatService = inject(ChatService);
  authService = inject(AuthService);
  
  chats = this.chatService.getChats();

  getOtherParticipantName(chat: Chat): string {
    const currentUserId = this.authService.currentUser()?.id;
    const otherUserId = chat.participantIds.find((id: string) => id !== currentUserId);
    // In a real app, we would fetch the user details. 
    // For now, we'll try to find it in local storage or fallback to "User"
    // Since we don't have a global user service that exposes all users easily without hacky access to AuthService private methods
    // We will just return "User" or the ID for now, or we can improve AuthService to expose getUserById.
    // Let's assume we can get it from the mock "database" in AuthService if we make a public method there.
    // For now, let's just return "Chat Partner" to keep it simple, or maybe the ID.
    return otherUserId ? `User ${otherUserId.substring(0, 4)}` : 'Unknown User';
  }
  
  getOtherParticipantAvatar(chat: Chat): string {
    const name = this.getOtherParticipantName(chat);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
  }
}
