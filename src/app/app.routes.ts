import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { MapComponent } from './components/map/map.component';
import { PostCreateComponent } from './components/post-create/post-create.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'map', component: MapComponent },
  { path: 'create', component: PostCreateComponent, canActivate: [authGuard] },
  { path: 'post/:id', component: PostDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: UserProfileComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
