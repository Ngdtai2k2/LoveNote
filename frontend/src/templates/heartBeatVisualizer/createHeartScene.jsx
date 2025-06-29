import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { gsap } from 'gsap';

import MUSIC_DEMO from '../assets/musics/music_background_003.mp3';
import HEART_GLB from '../assets/glb/heart.glb';
import HEART from '../assets/images/heart.png';
import BALL from '../assets/images/ball.png';

export function createHeartScene(
  canvas,
  audioBtn,
  vertexShader,
  fragmentShader,
  vertexShader1,
  fragmentShader1
) {
  class HeartScene {
    constructor() {
      this.parameters = {
        count: 1500,
        max: 12.5 * Math.PI,
        a: 2,
        c: 4.5,
      };

      this.textureLoader = new THREE.TextureLoader();
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x000000);
      this.clock = new THREE.Clock();
      this.data = 0;
      this.time = { current: 0, t0: 0, t1: 0, t: 0, frequency: 0.0005 };
      this.angle = { x: 0, z: 0 };

      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.aspectRatio = this.width / this.height;
      this.camera = new THREE.PerspectiveCamera(75, this.aspectRatio, 0.1, 100);
      this.camera.position.set(0, 0, 4.5);
      this.scene.add(this.camera);

      this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.setSize(this.width, this.height);

      this.audioBtn = audioBtn;

      this.resizeHandler = this.onResize.bind(this);
      this.mouseMoveHandler = this.onMouseMove.bind(this);

      this.addToScene();
      this.addButton();
      this.render();
      this.listenToResize();
      this.listenToMouseMove();
      this.loop();
    }

    render() {
      this.renderer.render(this.scene, this.camera);
    }

    loop() {
      this.time.elapsed = this.clock.getElapsedTime();
      this.time.delta = (this.time.elapsed - this.time.current) * 1000;

      if (this.analyser && this.isRunning) {
        this.time.t = this.time.elapsed - this.time.t0 + this.time.t1;
        this.data = this.analyser.getAverageFrequency();
        this.data *= this.data / 2000;
        this.angle.x += this.time.delta * 0.001 * 0.63;
        this.angle.z += this.time.delta * 0.001 * 0.39;

        if (this.audioElement.ended) {
          this.time.t1 = this.time.t;
          this.audioBtn.disabled = false;
          this.isRunning = false;

          const tl = gsap.timeline();
          this.angle.x = 0;
          this.angle.z = 0;
          tl.to(this.camera.position, { x: 0, z: 4.5, duration: 4, ease: 'expo.in' });
          tl.to(this.audioBtn, { opacity: 1, duration: 1, ease: 'power1.out' });
        } else {
          this.camera.position.x = Math.sin(this.angle.x) * this.parameters.a;
          this.camera.position.z = Math.min(
            Math.max(Math.cos(this.angle.z) * this.parameters.c, 1.75),
            6.5
          );
        }
      }

      this.camera.lookAt(this.scene.position);

      if (this.heartMaterial) {
        this.heartMaterial.uniforms.uTime.value +=
          this.time.delta * this.time.frequency * (1 + this.data * 0.2);
      }

      if (this.model) {
        this.model.rotation.y -= 0.0005 * this.time.delta * (1 + this.data);
      }

      if (this.snowMaterial) {
        this.snowMaterial.uniforms.uTime.value += this.time.delta * 0.0004 * (1 + this.data);
      }

      this.render();
      this.time.current = this.time.elapsed;
      this.animationFrameId = requestAnimationFrame(this.loop.bind(this));
    }

    onResize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
    }

    onMouseMove(e) {
      gsap.to(this.camera.position, {
        x: gsap.utils.mapRange(0, window.innerWidth, 0.2, -0.2, e.clientX),
        y: gsap.utils.mapRange(0, window.innerHeight, 0.2, -0.2, -e.clientY),
      });
    }

    listenToResize() {
      window.addEventListener('resize', this.resizeHandler);
    }

    listenToMouseMove() {
      window.addEventListener('mousemove', this.mouseMoveHandler);
    }

    addButton() {
      this.audioBtn.addEventListener('click', () => {
        if (!this.audioElement) {
          this.loadMusic();
          return;
        }

        if (this.audioElement.paused) {
          this.audioElement.play();
          this.time.t0 = this.time.elapsed;
          this.data = 0;
          this.isRunning = true;
          gsap.to(this.audioBtn, { opacity: 0, duration: 1, ease: 'power1.out' });
        } else {
          this.audioElement.pause();
          this.isRunning = false;
          gsap.to(this.audioBtn, { opacity: 1, duration: 1, ease: 'power1.out' });
        }
      });
    }

    async loadMusic() {
      const listener = new THREE.AudioListener();
      this.camera.add(listener);

      this.audioElement = new Audio(MUSIC_DEMO);
      this.audioElement.crossOrigin = 'anonymous';
      this.audioElement.loop = false;
      this.audioElement.volume = 0.5;

      this.sound = new THREE.Audio(listener);
      this.sound.setMediaElementSource(this.audioElement);

      this.analyser = new THREE.AudioAnalyser(this.sound, 32);
      this.data = this.analyser.getAverageFrequency();
      this.isRunning = true;
      this.time.t0 = this.time.elapsed;

      this.audioElement.play();
      gsap.to(this.audioBtn, { opacity: 0, duration: 1, ease: 'power1.out' });

      this.audioElement.onended = () => {
        this.audioBtn.disabled = false;
        this.isRunning = false;
        gsap.to(this.audioBtn, { opacity: 1, duration: 1, ease: 'power1.out' });
      };
    }

    async addToScene() {
      await this.addModel();
      this.addHeart();
      this.addSnow();
    }

    async addModel() {
      const loader = new GLTFLoader();
      loader.load(HEART_GLB, (gltf) => {
        this.model = gltf.scene.children[0];
        this.model.scale.set(0.001, 0.001, 0.001);
        this.model.material = new THREE.MeshMatcapMaterial({
          matcap: this.textureLoader.load(BALL, () => {
            gsap.to(this.model.scale, {
              x: 0.25,
              y: 0.25,
              z: 0.25,
              duration: 1.5,
              ease: 'elastic.out',
            });
          }),
          color: '#ff3366',
        });
        this.scene.add(this.model);
      });
    }

    addHeart() {
      this.heartMaterial = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uSize: { value: 0.2 },
        },
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        transparent: true,
      });

      const count = 3000;
      const geometry = new THREE.PlaneGeometry(1, 1);
      const instancedGeometry = new THREE.InstancedBufferGeometry();
      instancedGeometry.attributes = geometry.attributes;
      instancedGeometry.index = geometry.index;
      instancedGeometry.maxInstancedCount = count;

      const scales = new Float32Array(count);
      const colors = new Float32Array(count * 3);
      const speeds = new Float32Array(count);
      const randoms = new Float32Array(count);
      const randoms1 = new Float32Array(count);
      const colorChoices = ['#ff66cc', '#ff99ff', '#ffccff', '#ff3366', '#ffffff'];

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        randoms[i] = Math.random();
        randoms1[i] = Math.random();
        scales[i] = Math.random() * 0.35;
        speeds[i] = Math.random() * this.parameters.max;
        const color = new THREE.Color(
          colorChoices[Math.floor(Math.random() * colorChoices.length)]
        );
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
      }

      instancedGeometry.setAttribute('random', new THREE.InstancedBufferAttribute(randoms, 1));
      instancedGeometry.setAttribute('random1', new THREE.InstancedBufferAttribute(randoms1, 1));
      instancedGeometry.setAttribute('aScale', new THREE.InstancedBufferAttribute(scales, 1));
      instancedGeometry.setAttribute('aSpeed', new THREE.InstancedBufferAttribute(speeds, 1));
      instancedGeometry.setAttribute('aColor', new THREE.InstancedBufferAttribute(colors, 3));

      this.heart = new THREE.Mesh(instancedGeometry, this.heartMaterial);
      this.scene.add(this.heart);
    }

    addSnow() {
      this.snowMaterial = new THREE.ShaderMaterial({
        vertexShader: vertexShader1,
        fragmentShader: fragmentShader1,
        uniforms: {
          uTime: { value: 0 },
          uSize: { value: 0.3 },
          uTex: { value: this.textureLoader.load(HEART) },
        },
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        transparent: true,
      });

      const count = 550;
      const geometry = new THREE.PlaneGeometry(1, 1);
      const instancedGeometry = new THREE.InstancedBufferGeometry();
      instancedGeometry.attributes = geometry.attributes;
      instancedGeometry.index = geometry.index;
      instancedGeometry.maxInstancedCount = count;

      const scales = new Float32Array(count);
      const colors = new Float32Array(count * 3);
      const phis = new Float32Array(count);
      const randoms = new Float32Array(count);
      const randoms1 = new Float32Array(count);
      const colorChoices = ['#ff66cc', '#ff99ff', '#ffccff', '#ffffff'];

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        phis[i] = (Math.random() - 0.5) * 10;
        randoms[i] = Math.random();
        randoms1[i] = Math.random();
        scales[i] = Math.random() * 0.35;
        const color = new THREE.Color(
          colorChoices[Math.floor(Math.random() * colorChoices.length)]
        );
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
      }

      instancedGeometry.setAttribute('phi', new THREE.InstancedBufferAttribute(phis, 1));
      instancedGeometry.setAttribute('random', new THREE.InstancedBufferAttribute(randoms, 1));
      instancedGeometry.setAttribute('random1', new THREE.InstancedBufferAttribute(randoms1, 1));
      instancedGeometry.setAttribute('aScale', new THREE.InstancedBufferAttribute(scales, 1));
      instancedGeometry.setAttribute('aColor', new THREE.InstancedBufferAttribute(colors, 3));

      this.snow = new THREE.Mesh(instancedGeometry, this.snowMaterial);
      this.scene.add(this.snow);
    }

    dispose() {
      cancelAnimationFrame(this.animationFrameId);

      if (this.audioElement) {
        this.audioElement.pause();
        this.audioElement.src = '';
        this.audioElement.remove();
        this.audioElement = null;
      }

      this.renderer.dispose();

      window.removeEventListener('resize', this.resizeHandler);
      window.removeEventListener('mousemove', this.mouseMoveHandler);

      this.scene.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      });

      while (this.scene.children.length > 0) {
        this.scene.remove(this.scene.children[0]);
      }

      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.analyser = null;
      this.sound = null;
    }
  }

  return new HeartScene();
}
