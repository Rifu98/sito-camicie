import { Component, effect } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-configurator',
  standalone: true,
  template: `
    <div>
      <h3>Configurator</h3>

      <div style="margin-bottom:12px">
        <label><strong>Upload texture</strong> (jpg/png)</label><br/>
        <input type="file" (change)="onFile($any($event.target).files)" />
      </div>

      <div style="margin-bottom:16px">
        <h4>Textures</h4>
        <div *ngIf="textures?.length; else emptyTextures">
          <div *ngFor="let t of textures" style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
            <img [src]="thumbUrl(t.thumbnailPath)" width="48" height="48" style="object-fit:cover;border-radius:4px"/>
            <div>{{t.name}}</div>
          </div>
        </div>
        <ng-template #emptyTextures><div>Nessuna texture ancora</div></ng-template>
      </div>

      <hr />

      <div style="margin-top:12px">
        <h4>Modelli 3D (Admin)</h4>
        <label>Tipo componente</label>
        <select #typ defaultValue="COLLAR">
          <option value="COLLAR">Collar</option>
          <option value="CUFF">Cuff</option>
          <option value="BODY">Body</option>
          <option value="POCKET">Pocket</option>
        </select>
        <div style="margin-top:8px">
          <input type="file" (change)="onModelFile($any($event.target).files, typ.value)" />
        </div>

        <div style="margin-top:12px">
          <div *ngIf="models?.length; else emptyModels">
            <div *ngFor="let m of models" style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
              <div style="width:48px;height:48px;background:#eee;border-radius:4px;display:flex;align-items:center;justify-content:center">GLB</div>
              <div>{{m.name}} <small style="color:#666">({{m.componentType}})</small></div>
            </div>
          </div>
          <ng-template #emptyModels><div>Nessun modello ancora</div></ng-template>
        </div>
      </div>

    </div>
  `,
  providers: [ApiService]
})
export class ConfiguratorComponent {
  textures: any[] = [];
  models: any[] = [];
  constructor(private api: ApiService) {
    this.load();
  }
  async load() {
    this.textures = await this.api.listTextures();
    this.models = await this.api.listModels();
  }
  async onFile(files: FileList) {
    if (!files || files.length === 0) return;
    const f = files[0];
    await this.api.uploadTexture(f);
    setTimeout(()=> this.load(), 800); // reload after processing
  }

  async onModelFile(files: FileList, type: string) {
    if (!files || files.length === 0) return;
    const f = files[0];
    await this.api.uploadModel(f, f.name, type);
    setTimeout(()=> this.load(), 400);
  }

  thumbUrl(name: string) {
    if (!name) return '';
    return `http://localhost:8080/api/textures/file/${name}`;
  }
}

