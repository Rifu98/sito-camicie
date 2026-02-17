import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRouting } from './app-routing.module';
import { provideHttpClient } from '@angular/common/http';
import { ConfiguratorComponent } from './components/configurator/configurator.component';
import { Shirt3DViewerComponent } from './components/shirt3d-viewer/shirt3d-viewer.component';

export const AppModule = {
  bootstrap: [AppComponent],
  providers: [AppRouting, provideHttpClient()],
  imports: [importProvidersFrom(BrowserModule)]
};
