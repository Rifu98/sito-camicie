import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StateService {
  // { component: 'BODY'|'COLLAR'..., modelId, modelFile }
  selectedModel$ = new BehaviorSubject<any>(null);
  // { component, textureId, thumbnailPath }
  selectedTexture$ = new BehaviorSubject<any>(null);
  configuration$ = new BehaviorSubject<any>({});
}
