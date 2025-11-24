import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Message } from '../../../models/chat.model';
import { AuthService } from '../../../services/auth.service';
import { ChatService } from '../../../services/chat.service';

@Component({
  selector: 'app-chat-detail',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink, 
    MatButtonModule, 
    MatIconModule, 
    MatInputModule, 
    MatFormFieldModule
  ],
  templateUrl: './chat-detail.html',
  styleUrl: './chat-detail.scss'
})
export class ChatDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private chatService = inject(ChatService);
  public authService = inject(AuthService);
  
  chatId: string | null = null;
  messages = signal<Message[]>([]);
  newMessage = signal('');
  
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  constructor() {
    effect(() => {
      // Auto-scroll when messages change
      this.messages();
      setTimeout(() => this.scrollToBottom(), 100);
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.chatId = params.get('id');
      if (this.chatId) {
        this.loadMessages();
      }
    });
  }

  loadMessages() {
    if (this.chatId) {
      // In a real app with signals, this would be a computed or effect
      // For now, we'll just poll or rely on the service signal if we exposed it directly
      // But getMessages returns a filtered array, so we need to update it manually or make it reactive
      // Let's make it simple: update on init and after send
      // Better: use an effect on the service's signal if possible, but getMessages is a method.
      // Let's just set it initially. Since ChatService uses signals internally, we can't easily subscribe to "filtered" changes without a computed.
      // For this demo, we will just set it.
      this.messages.set(this.chatService.getMessages(this.chatId));
    }
  }

  sendMessage() {
    if (this.chatId && this.newMessage().trim()) {
      this.chatService.sendMessage(this.chatId, this.newMessage());
      this.newMessage.set('');
      this.loadMessages(); // Refresh messages
    }
  }

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
  
  isMyMessage(message: Message): boolean {
    return message.senderId === this.authService.currentUser()?.id;
  }
}
