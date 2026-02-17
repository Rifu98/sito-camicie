import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { AppRouting } from './app/app-routing.module';

bootstrapApplication(AppComponent, { providers: [AppRouting, provideHttpClient()] }).catch(err => console.error(err));
