import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, PLATFORM_ID, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { Post } from '../../models/post.model';
import { MapService } from '../../services/map.service';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements AfterViewInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private map: any; // Use any to avoid type issues with dynamic import

  userLocation: { lat: number; lng: number } | null = null;
  nearestPosts: (Post & { distance: number })[] = [];
  
  private mapService = inject(MapService);
  private postService = inject(PostService);
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
    this.map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    this.addMarkers(L);
    this.locateUser(L);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private addMarkers(L: any): void {
    const posts = this.postService.getPosts();
    posts.forEach(post => {
      if (this.map) {
        const marker = L.marker([post.lat, post.lng]).addTo(this.map);
        marker.bindPopup(`
          <b>${post.title}</b><br>
          ${post.description}<br>
          <button class="btn-link" id="view-post-${post.id}">View Details</button>
        `);
        
        marker.on('popupopen', () => {
          // Bind click event to the button inside popup
          const button = document.getElementById(`view-post-${post.id}`);
          if (button) {
            button.addEventListener('click', () => {
              this.router.navigate(['/post', post.id]);
            });
          }
        });
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private locateUser(L: any): void {
    if (this.map) {
      this.map.locate({ setView: true, maxZoom: 16 });
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.map.on('locationfound', (e: any) => {
        if (this.map) {
          this.userLocation = { lat: e.latlng.lat, lng: e.latlng.lng };
          
          L.circle(e.latlng, {
            radius: e.accuracy / 2,
            color: 'blue',
            fillColor: '#3b82f6',
            fillOpacity: 0.2
          }).addTo(this.map);

          this.calculateNearestPosts();
        }
      });
    }
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    // Haversine formula to calculate distance in km
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(value: number): number {
    return value * Math.PI / 180;
  }

  private calculateNearestPosts(): void {
    if (!this.userLocation) return;

    const posts = this.postService.getPosts();
    const postsWithDistance = posts.map(post => ({
      ...post,
      distance: this.calculateDistance(
        this.userLocation!.lat,
        this.userLocation!.lng,
        post.lat,
        post.lng
      )
    }));

    this.nearestPosts = postsWithDistance
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 4);
  }

  navigateToPost(postId: string): void {
    this.router.navigate(['/post', postId]);
  }
}
