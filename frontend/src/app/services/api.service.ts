import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'http://localhost:8080/api';

  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async login(username: string, password: string) {
    const res = await fetch(`${this.base}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return res.json();
  }

  async listTextures() {
    const res = await fetch(`${this.base}/textures`);
    return res.json();
  }

  async uploadTexture(file: File, name?: string) {
    const fd = new FormData();
    fd.append('file', file);
    if (name) fd.append('name', name);
    const res = await fetch(`${this.base}/textures/upload`, { method: 'POST', body: fd, headers: this.getAuthHeaders() });
    return res.json();
  }

  async enhanceTexture(id: number) {
    const res = await fetch(`${this.base}/textures/${id}/enhance`, { method: 'POST', headers: this.getAuthHeaders() });
    return res.json();
  }

  async listModels() {
    const res = await fetch(`${this.base}/models`);
    return res.json();
  }

  async uploadModel(file: File, name: string, componentType: string) {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('name', name);
    fd.append('componentType', componentType);
    const res = await fetch(`${this.base}/models`, { method: 'POST', body: fd, headers: this.getAuthHeaders() });
    return res.json();
  }

  async saveConfiguration(cfg: any) {
    const res = await fetch(`${this.base}/configurations`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...this.getAuthHeaders() }, body: JSON.stringify(cfg) });
    return res.json();
  }

  async listConfigurations() {
    const res = await fetch(`${this.base}/configurations`);
    return res.json();
  }
}

