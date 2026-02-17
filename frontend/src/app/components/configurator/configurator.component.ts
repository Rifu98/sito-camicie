import { Component, effect } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-configurator',
  standalone: true,
  template: `
    <div>
      <h3>Configurator</h3>
      <div>
        <label>Upload texture (jpg/png)</label>
        <input type="file" (change)="onFile($any($event.target).files)" />
      </div>
      <div style="margin-top:12px">
        <h4>Textures</h4>
        <div *ngIf="textures?.length; else empty">
          <div *ngFor="let t of textures" style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
            <img [src]="thumbUrl(t.thumbnailPath)" width="48" height="48" style="object-fit:cover;border-radius:4px"/>
            <div>{{t.name}}</div>
          </div>
        </div>
        <ng-template #empty><div>Nessuna texture ancora</div></ng-template>
      </div>
    </div>
  `,
  providers: [ApiService]
})
export class ConfiguratorComponent {
  textures: any[] = [];
  constructor(private api: ApiService) {
    this.load();
  }
  async load() {
    this.textures = await this.api.listTextures();
  }
  async onFile(files: FileList) {
    if (!files || files.length === 0) return;
    const f = files[0];
    await this.api.uploadTexture(f);
    setTimeout(()=> this.load(), 800); // reload after processing
  }
  thumbUrl(name: string) {
    if (!name) return '';
    return `http://localhost:8080/api/textures/file/${name}`;
  }
}
