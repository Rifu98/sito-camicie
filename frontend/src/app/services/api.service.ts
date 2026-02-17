import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'http://localhost:8080/api';

  async listTextures() {
    const res = await fetch(`${this.base}/textures`);
    return res.json();
  }

  async uploadTexture(file: File, name?: string) {
    const fd = new FormData();
    fd.append('file', file);
    if (name) fd.append('name', name);
    const res = await fetch(`${this.base}/textures/upload`, { method: 'POST', body: fd });
    return res.json();
  }

  async listModels() {
    const res = await fetch(`${this.base}/models`);
    return res.json();
  }
}
