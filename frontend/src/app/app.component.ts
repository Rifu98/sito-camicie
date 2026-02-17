import { Component } from '@angular/core';
import { ConfiguratorComponent } from './components/configurator/configurator.component';
import { Shirt3DViewerComponent } from './components/shirt3d-viewer/shirt3d-viewer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ConfiguratorComponent, Shirt3DViewerComponent],
  template: `
    <div class="app-container">
      <div class="header">
        <h1>Sito Camicie — Configuratore 3D (MVP)</h1>
      </div>
      <div class="layout">
        <div class="sidebar">
          <app-configurator></app-configurator>
        </div>
        <div style="flex:1">
          <app-shirt3d-viewer></app-shirt3d-viewer>
        </div>
      </div>
    </div>
  `
})
export class AppComponent { }
