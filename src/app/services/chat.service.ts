import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { Chat, Message } from '../models/chat.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private platformId = inject(PLATFORM_ID);
  private authService = inject(AuthService);

  private chatsSignal = signal<Chat[]>([]);
  private messagesSignal = signal<Message[]>([]);

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (isPlatformBrowser(this.platformId)) {
      const storedChats = localStorage.getItem('chats');
      const storedMessages = localStorage.getItem('messages');
      
      if (storedChats) {
        this.chatsSignal.set(JSON.parse(storedChats));
      }
      
      if (storedMessages) {
        this.messagesSignal.set(JSON.parse(storedMessages));
      }
    }
  }

  private saveToStorage() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('chats', JSON.stringify(this.chatsSignal()));
      localStorage.setItem('messages', JSON.stringify(this.messagesSignal()));
    }
  }

  getChats() {
    const currentUser = this.authService.currentUser();
    if (!currentUser) return [];
    
    return this.chatsSignal()
      .filter(chat => chat.participantIds.includes(currentUser.id))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  getMessages(chatId: string) {
    return this.messagesSignal()
      .filter(m => m.chatId === chatId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  createChat(otherUserId: string): string {
    const currentUser = this.authService.currentUser();
    if (!currentUser) throw new Error('User must be logged in');

    // Check if chat already exists
    const existingChat = this.chatsSignal().find(c => 
      c.participantIds.includes(currentUser.id) && c.participantIds.includes(otherUserId)
    );

    if (existingChat) {
      return existingChat.id;
    }

    const newChat: Chat = {
      id: uuidv4(),
      participantIds: [currentUser.id, otherUserId],
      updatedAt: new Date()
    };

    this.chatsSignal.update(chats => [...chats, newChat]);
    this.saveToStorage();
    return newChat.id;
  }

  sendMessage(chatId: string, text: string) {
    const currentUser = this.authService.currentUser();
    if (!currentUser) throw new Error('User must be logged in');

    const newMessage: Message = {
      id: uuidv4(),
      chatId,
      senderId: currentUser.id,
      text,
      timestamp: new Date()
    };

    // Update messages
    this.messagesSignal.update(msgs => [...msgs, newMessage]);

    // Update chat last message
    this.chatsSignal.update(chats => 
      chats.map(c => {
        if (c.id === chatId) {
          return {
            ...c,
            lastMessage: text,
            lastMessageTime: newMessage.timestamp,
            updatedAt: newMessage.timestamp
          };
        }
        return c;
      })
    );

    this.saveToStorage();
  }
  
  getChat(chatId: string): Chat | undefined {
    return this.chatsSignal().find(c => c.id === chatId);
  }
}
