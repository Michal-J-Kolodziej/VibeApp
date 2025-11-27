import { Component, effect } from '@angular/core';
import { injectSpeedInsights } from '@vercel/speed-insights';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MainLayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'vibe-app';
  
  constructor() {
    // Initialize Vercel Speed Insights
    effect(() => {
      injectSpeedInsights();
    });
  }
}
