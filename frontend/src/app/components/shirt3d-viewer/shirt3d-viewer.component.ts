import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-shirt3d-viewer',
  standalone: true,
  template: `
    <div class="canvas-wrap" #canvas></div>
  `
})
export class Shirt3DViewerComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLDivElement>;
  renderer!: THREE.WebGLRenderer;
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;

  ngOnInit(): void {
    this.initThree();
    this.animate();
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

    const geom = new THREE.BoxGeometry(1.6, 2, 0.2);
    const mat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const box = new THREE.Mesh(geom, mat);
    box.position.y = 0.8;
    this.scene.add(box);

    // simple ground
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
    requestAnimationFrame(() => this.animate());
    if (this.scene && this.renderer) {
      this.scene.rotation.y += 0.002;
      this.renderer.render(this.scene, this.camera);
    }
  }
}
