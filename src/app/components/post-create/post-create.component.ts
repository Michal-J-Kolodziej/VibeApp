import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { Post } from '../../models/post.model';
import { AuthService } from '../../services/auth.service';
import { MapService } from '../../services/map.service';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.scss'
})
export class PostCreateComponent implements AfterViewInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private map: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private marker: any;
  
  // Form Signals
  title = signal('');
  description = signal('');
  imageUrl = signal('');
  lat = signal(51.505);
  lng = signal(-0.09);
  
  selectedFile: File | null = null;
  imagePreview = signal<string | null>(null);

  // Computed validity
  isFormValid = computed(() => {
    return this.title().trim().length > 0 && 
           this.description().trim().length > 0 && 
           (this.imageUrl().trim().length > 0 || this.imagePreview() !== null);
  });

  private mapService = inject(MapService);
  private postService = inject(PostService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  async ngAfterViewInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      const L = await import('leaflet');
      this.mapService.fixLeafletIcons(L);
      this.initMap(L);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private initMap(L: any): void {
    this.map = L.map('map-picker').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(this.map);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.map.on('click', (e: any) => {
      this.setMarker(e.latlng.lat, e.latlng.lng, L);
    });

    // Initial marker
    this.setMarker(51.505, -0.09, L);
    
    // Try to locate user
    this.map.locate({ setView: true, maxZoom: 16 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.map.on('locationfound', (e: any) => {
      this.setMarker(e.latlng.lat, e.latlng.lng, L);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private setMarker(lat: number, lng: number, L: any): void {
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else if (this.map) {
      this.marker = L.marker([lat, lng], { draggable: true }).addTo(this.map);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.marker.on('dragend', (event: any) => {
        const position = event.target.getLatLng();
        this.updateFormLocation(position.lat, position.lng);
      });
    }
    this.updateFormLocation(lat, lng);
  }

  private updateFormLocation(lat: number, lng: number): void {
    this.lat.set(lat);
    this.lng.set(lng);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      this.selectedFile = file;
      
      // Create preview and convert to base64
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result as string;
        this.imagePreview.set(result);
        this.imageUrl.set(result);
      };
      reader.readAsDataURL(file);
    }
  }

  clearImage(): void {
    this.selectedFile = null;
    this.imagePreview.set(null);
    this.imageUrl.set('');
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      const currentUser = this.authService.currentUser();
      
      const newPost: Post = {
        id: uuidv4(),
        title: this.title(),
        description: this.description(),
        imageUrl: this.imageUrl(),
        lat: this.lat(),
        lng: this.lng(),
        createdAt: new Date(),
        userId: currentUser?.id,
        authorName: currentUser?.name
      };
      
      this.postService.addPost(newPost);
      this.router.navigate(['/map']);
    }
  }
}
