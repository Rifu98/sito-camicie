import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-shirt3d-viewer',
  standalone: true,
  template: `
    <div class="canvas-wrap" #canvas></div>
  `
})
export class Shirt3DViewerComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLDivElement>;
  renderer!: THREE.WebGLRenderer;
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  private animationId: any;
  private currentModel: THREE.Object3D | null = null;
  private loader = new GLTFLoader();
  private texLoader = new THREE.TextureLoader();

  constructor(private state: StateService) {
  }

  ngOnInit(): void {
    this.initThree();
    this.animate();

    this.state.selectedModel$.subscribe(m => {
      if (m) this.loadModel(m.filePath);
    });

    this.state.selectedTexture$.subscribe(t => {
      if (t) this.applyTexture(t);
    });
  }

  ngOnDestroy(): void {
    if (this.animationId) cancelAnimationFrame(this.animationId);
  }

  initThree() {
    const el = this.canvasRef.nativeElement;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, el.clientWidth / el.clientHeight, 0.1, 1000);
    this.camera.position.set(0, 1, 3);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(el.clientWidth, el.clientHeight);
    el.appendChild(this.renderer.domElement);

    const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
    this.scene.add(light);

    // simple placeholder model
    const geom = new THREE.BoxGeometry(1.6, 2, 0.2);
    const mat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const box = new THREE.Mesh(geom, mat);
    box.name = 'Body';
    box.position.y = 0.8;
    this.scene.add(box);

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshStandardMaterial({ color: 0x222222 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    this.scene.add(ground);

    window.addEventListener('resize', () => {
      this.onResize();
    });
  }

  onResize() {
    const el = this.canvasRef.nativeElement;
    this.renderer.setSize(el.clientWidth, el.clientHeight);
    this.camera.aspect = el.clientWidth / el.clientHeight;
    this.camera.updateProjectionMatrix();
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    if (this.scene && this.renderer) {
      this.scene.rotation.y += 0.002;
      this.renderer.render(this.scene, this.camera);
    }
  }

  loadModel(fileName: string) {
    const url = `http://localhost:8080/api/models/file/${fileName}`;
    this.loader.load(url, gltf => {
      if (this.currentModel) this.scene.remove(this.currentModel);
      this.currentModel = gltf.scene;
      this.scene.add(this.currentModel);
    }, undefined, err => console.error(err));
  }

  applyTexture(t: any) {
    const src = t?.processedPath || t?.thumbnailPath || t?.originalPath;
    const url = src && src.startsWith && src.startsWith('data:') ? src : `http://localhost:8080/api/textures/file/${src}`;
    this.texLoader.load(url, tex => {
      // try to apply to mesh named 'Body' or to whole model
      const applyTo = (obj: THREE.Object3D) => {
        obj.traverse((ch: any) => {
          if (ch.isMesh) {
            if (!ch.material) ch.material = new THREE.MeshStandardMaterial();
            ch.material.map = tex;
            ch.material.needsUpdate = true;
          }
        });
      };

      if (this.currentModel) {
        applyTo(this.currentModel);
      } else {
        // apply to scene default 'Body' box
        const body = this.scene.getObjectByName('Body');
        if (body) applyTo(body);
      }
    });
  }
}
