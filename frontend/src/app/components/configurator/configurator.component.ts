import { Component, effect } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-configurator',
  standalone: true,
  template: `
    <div>
      <h3>Configurator</h3>

      <div *ngIf="!authenticated" style="margin-bottom:12px;padding:8px;background:#fff6e5;border-radius:6px">
        <strong>Admin login</strong>
        <div style="margin-top:8px;display:flex;gap:8px;align-items:center">
          <input #u placeholder="username" />
          <input #p type="password" placeholder="password" />
          <button (click)="login(u.value,p.value)">Login</button>
        </div>
        <small>Credenziali demo: admin / admin</small>
      </div>

      <div style="margin-bottom:12px">
        <label><strong>Upload texture</strong> (jpg/png)</label><br/>
        <input type="file" (change)="onFile($any($event.target).files)" />
      </div>

      <div style="margin-bottom:16px">
        <h4>Textures</h4>
        <div *ngIf="textures?.length; else emptyTextures">
          <div *ngFor="let t of textures" style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
            <img [src]="thumbUrl(t.thumbnailPath)" width="48" height="48" style="object-fit:cover;border-radius:4px"/>
            <div style="flex:1;display:flex;justify-content:space-between;align-items:center">
              <div>{{t.name}}</div>
              <div><button (click)="selectTexture(t)">Usa</button></div>
            </div>
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
          <input type="file" (change)="onModelFile($any($event.target).files, typ.value)" [disabled]="!authenticated" />
        </div>

        <div style="margin-top:12px">
          <div *ngIf="models?.length; else emptyModels">
            <div *ngFor="let m of models" style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
              <div style="width:48px;height:48px;background:#eee;border-radius:4px;display:flex;align-items:center;justify-content:center">GLB</div>
              <div style="flex:1">
                <div>{{m.name}} <small style="color:#666">({{m.componentType}})</small></div>
                <div style="margin-top:6px"><button (click)="selectModel(m)">Usa</button></div>
              </div>
            </div>
          </div>
          <ng-template #emptyModels><div>Nessun modello ancora</div></ng-template>
        </div>
      </div>

      <hr />

      <div style="margin-top:12px">
        <h4>Monogramma</h4>
        <div style="display:flex;gap:8px;align-items:center">
          <input #mono placeholder="AB" maxlength="4" style="width:80px" />
          <select #font>
            <option value="serif">Serif</option>
            <option value="sans-serif" selected>Sans</option>
            <option value="cursive">Script</option>
          </select>
          <input #color type="color" value="#ffffff" />
          <button (click)="applyMonogram(mono.value, font.value, color.value)">Applica</button>
        </div>
      </div>

      <div style="margin-top:12px">
        <h4>Configurazione corrente</h4>
        <pre>{{(state.configuration$ | async) | json}}</pre>
        <div style="margin-top:8px"><button (click)="saveConfiguration()">Salva configurazione</button></div>
      </div>

      <div style="margin-top:12px">
        <h4>Configurazioni salvate</h4>
        <div *ngIf="configs?.length; else noCfg">
          <div *ngFor="let c of configs" style="padding:6px;background:#fff;margin-bottom:6px;border-radius:6px;display:flex;justify-content:space-between;align-items:center">
            <div>{{c.id}} — {{c.createdAt}}</div>
            <div><button (click)="loadConfiguration(c)">Carica</button></div>
          </div>
        </div>
        <ng-template #noCfg><div>Nessuna configurazione salvata</div></ng-template>
      </div>

    </div>
  `
  providers: [ApiService]
})
export class ConfiguratorComponent {
  textures: any[] = [];
  models: any[] = [];
  authenticated = !!localStorage.getItem('auth_token');

  constructor(private api: ApiService, private state: StateService) {
    this.load();
  }
  async load() {
    this.textures = await this.api.listTextures();
    this.models = await this.api.listModels();
    this.configs = await this.api.listConfigurations();
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

  selectTexture(t: any) {
    this.state.selectedTexture$.next(t);
    const cfg = { ...(this.state.configuration$.value || {}) };
    cfg['texture'] = t;
    this.state.configuration$.next(cfg);
  }

  selectModel(m: any) {
    this.state.selectedModel$.next(m);
    const cfg = { ...(this.state.configuration$.value || {}) };
    cfg['model'] = m;
    this.state.configuration$.next(cfg);
  }

  async saveConfiguration() {
    const cfg = this.state.configuration$.value;
    await this.api.saveConfiguration({ configurationJson: JSON.stringify(cfg) });
    setTimeout(()=> this.load(), 300);
  }

  async loadConfiguration(c: any) {
    try {
      const parsed = JSON.parse(c.configurationJson);
      if (parsed.model) this.selectModel(parsed.model);
      if (parsed.texture) this.selectTexture(parsed.texture);
      this.state.configuration$.next(parsed);
    } catch (e) {
      console.error(e);
    }
  }

  applyMonogram(text: string, font: string, color: string) {
    if (!text) return;
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = 'transparent';
    ctx.fillRect(0,0,size,size);
    ctx.fillStyle = color || '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `bold 220px ${font}`;
    ctx.fillText(text, size/2, size/2);

    const dataUrl = canvas.toDataURL('image/png');
    const synthetic = { name: `monogram-${text}`, processedPath: dataUrl, thumbnailPath: dataUrl };
    this.selectTexture(synthetic);
  }

  async login(username: string, password: string) {
    const res: any = await this.api.login(username, password);
    if (res?.token) {
      localStorage.setItem('auth_token', res.token);
      this.authenticated = true;
    } else {
      alert('Login failed');
    }
  }
}

