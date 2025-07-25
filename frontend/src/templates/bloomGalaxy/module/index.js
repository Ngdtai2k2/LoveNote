import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import galaxyVert from '../shaders/galaxy.vert.glsl';
import galaxyFrag from '../shaders/galaxy.frag.glsl';

import glowVert from '../shaders/glow.vert.glsl';
import glowFrag from '../shaders/glow.frag.glsl';

import atmosphereVert from '../shaders/atmosphere.vert.glsl';
import atmosphereFrag from '../shaders/atmosphere.frag.glsl';

import stormVert from '../shaders/storm.vert.glsl';
import stormFrag from '../shaders/storm.frag.glsl';

export default function initGalaxy() {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.0015);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100000
  );
  camera.position.set(0, 20, 30);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const container = window.containerTarget;

  if (container) {
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
  } else {
    console.error("Container element with id 'container' not found.");
  }

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;
  controls.enabled = false;
  controls.target.set(0, 0, 0);
  controls.enablePan = false;
  controls.minDistance = 15;
  controls.maxDistance = 300;
  controls.zoomSpeed = 0.3;
  controls.rotateSpeed = 0.3;
  controls.update();

  function createGlowMaterial(color, size = 128, opacity = 0.55) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const context = canvas.getContext('2d');
    const gradient = context.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return new THREE.Sprite(material);
  }

  const centralGlow = createGlowMaterial('rgba(255,255,255,0.8)', 156, 0.25);
  centralGlow.scale.set(8, 8, 1);
  scene.add(centralGlow);

  for (let i = 0; i < 15; i++) {
    const hue = Math.random() * 360;
    const color = `hsla(${hue}, 80%, 50%, 0.6)`;
    const nebula = createGlowMaterial(color, 256);
    nebula.scale.set(100, 100, 1);
    nebula.position.set(
      (Math.random() - 0.5) * 175,
      (Math.random() - 0.5) * 175,
      (Math.random() - 0.5) * 175
    );
    scene.add(nebula);
  }

  const galaxyParameters = {
    count: 100000,
    arms: 6,
    radius: 100,
    spin: 0.5,
    randomness: 0.2,
    randomnessPower: 20,
    insideColor: new THREE.Color(0xd63ed6),
    outsideColor: new THREE.Color(0x48b8b8),
  };

  const heartImages = window?.dataCCD?.heartImages || [];

  const numGroups = heartImages.length;

  const maxDensity = 50000;
  const minDensity = 2000;
  const maxGroupsForScale = 14;

  let pointsPerGroup;

  if (numGroups <= 1) {
    pointsPerGroup = maxDensity;
  } else if (numGroups >= maxGroupsForScale) {
    pointsPerGroup = minDensity;
  } else {
    const t = (numGroups - 1) / (maxGroupsForScale - 1);
    pointsPerGroup = Math.floor(maxDensity * (1 - t) + minDensity * t);
  }

  if (pointsPerGroup * numGroups > galaxyParameters.count) {
    pointsPerGroup = Math.floor(galaxyParameters.count / numGroups);
  }

  const positions = new Float32Array(galaxyParameters.count * 3);
  const colors = new Float32Array(galaxyParameters.count * 3);

  let pointIdx = 0;
  for (let i = 0; i < galaxyParameters.count; i++) {
    const radius =
      Math.pow(Math.random(), galaxyParameters.randomnessPower) * galaxyParameters.radius;
    const branchAngle = ((i % galaxyParameters.arms) / galaxyParameters.arms) * Math.PI * 2;
    const spinAngle = radius * galaxyParameters.spin;

    const randomX = (Math.random() - 0.5) * galaxyParameters.randomness * radius;
    const randomY = (Math.random() - 0.5) * galaxyParameters.randomness * radius * 1.2;
    const randomZ = (Math.random() - 0.5) * galaxyParameters.randomness * radius;
    const totalAngle = branchAngle + spinAngle;

    if (radius < 30 && Math.random() < 0.8) continue;

    const i3 = pointIdx * 3;
    positions[i3] = Math.cos(totalAngle) * radius + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(totalAngle) * radius + randomZ;

    const mixedColor = new THREE.Color(0xff66ff);
    mixedColor.lerp(new THREE.Color(0x66ffff), radius / galaxyParameters.radius);
    mixedColor.multiplyScalar(0.7 + 0.3 * Math.random());
    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;

    pointIdx++;
  }

  const galaxyGeometry = new THREE.BufferGeometry();
  galaxyGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions.slice(0, pointIdx * 3), 3)
  );
  galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colors.slice(0, pointIdx * 3), 3));

  const galaxyMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0.0 },
      uSize: { value: 50.0 * renderer.getPixelRatio() },
      uRippleTime: { value: -1.0 },
      uRippleSpeed: { value: 40.0 },
      uRippleWidth: { value: 20.0 },
    },
    vertexShader: galaxyVert,
    fragmentShader: galaxyFrag,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
    vertexColors: true,
  });

  const galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);

  scene.add(galaxy);

  function createNeonTexture(image, size) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    const aspectRatio = image.width / image.height;
    let drawWidth, drawHeight, offsetX, offsetY;
    if (aspectRatio > 1) {
      drawWidth = size;
      drawHeight = size / aspectRatio;
      offsetX = 0;
      offsetY = (size - drawHeight) / 2;
    } else {
      drawHeight = size;
      drawWidth = size * aspectRatio;
      offsetX = (size - drawWidth) / 2;
      offsetY = 0;
    }
    ctx.clearRect(0, 0, size, size);
    const cornerRadius = size * 0.1;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(offsetX + cornerRadius, offsetY);
    ctx.lineTo(offsetX + drawWidth - cornerRadius, offsetY);
    ctx.arcTo(
      offsetX + drawWidth,
      offsetY,
      offsetX + drawWidth,
      offsetY + cornerRadius,
      cornerRadius
    );
    ctx.lineTo(offsetX + drawWidth, offsetY + drawHeight - cornerRadius);
    ctx.arcTo(
      offsetX + drawWidth,
      offsetY + drawHeight,
      offsetX + drawWidth - cornerRadius,
      offsetY + drawHeight,
      cornerRadius
    );
    ctx.lineTo(offsetX + cornerRadius, offsetY + drawHeight);
    ctx.arcTo(
      offsetX,
      offsetY + drawHeight,
      offsetX,
      offsetY + drawHeight - cornerRadius,
      cornerRadius
    );
    ctx.lineTo(offsetX, offsetY + cornerRadius);
    ctx.arcTo(offsetX, offsetY, offsetX + cornerRadius, offsetY, cornerRadius);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
    ctx.restore();
    return new THREE.CanvasTexture(canvas);
  }

  for (let group = 0; group < numGroups; group++) {
    const groupPositions = new Float32Array(pointsPerGroup * 3);
    const groupColorsNear = new Float32Array(pointsPerGroup * 3);
    const groupColorsFar = new Float32Array(pointsPerGroup * 3);
    let validPointCount = 0;

    for (let i = 0; i < pointsPerGroup; i++) {
      const idx = validPointCount * 3;
      const globalIdx = group * pointsPerGroup + i;
      const radius =
        Math.pow(Math.random(), galaxyParameters.randomnessPower) * galaxyParameters.radius;
      if (radius < 30) continue;

      const branchAngle =
        ((globalIdx % galaxyParameters.arms) / galaxyParameters.arms) * Math.PI * 2;
      const spinAngle = radius * galaxyParameters.spin;

      const randomX = (Math.random() - 0.5) * galaxyParameters.randomness * radius;
      const randomY = (Math.random() - 0.5) * galaxyParameters.randomness * radius * 0.5;
      const randomZ = (Math.random() - 0.5) * galaxyParameters.randomness * radius;
      const totalAngle = branchAngle + spinAngle;

      groupPositions[idx] = Math.cos(totalAngle) * radius + randomX;
      groupPositions[idx + 1] = randomY;
      groupPositions[idx + 2] = Math.sin(totalAngle) * radius + randomZ;

      const colorNear = new THREE.Color(0xffffff);
      groupColorsNear[idx] = colorNear.r;
      groupColorsNear[idx + 1] = colorNear.g;
      groupColorsNear[idx + 2] = colorNear.b;

      const colorFar = galaxyParameters.insideColor.clone();
      colorFar.lerp(galaxyParameters.outsideColor, radius / galaxyParameters.radius);
      colorFar.multiplyScalar(0.7 + 0.3 * Math.random());
      groupColorsFar[idx] = colorFar.r;
      groupColorsFar[idx + 1] = colorFar.g;
      groupColorsFar[idx + 2] = colorFar.b;

      validPointCount++;
    }

    if (validPointCount === 0) continue;

    const groupGeometryNear = new THREE.BufferGeometry();
    groupGeometryNear.setAttribute(
      'position',
      new THREE.BufferAttribute(groupPositions.slice(0, validPointCount * 3), 3)
    );
    groupGeometryNear.setAttribute(
      'color',
      new THREE.BufferAttribute(groupColorsNear.slice(0, validPointCount * 3), 3)
    );

    const groupGeometryFar = new THREE.BufferGeometry();
    groupGeometryFar.setAttribute(
      'position',
      new THREE.BufferAttribute(groupPositions.slice(0, validPointCount * 3), 3)
    );
    groupGeometryFar.setAttribute(
      'color',
      new THREE.BufferAttribute(groupColorsFar.slice(0, validPointCount * 3), 3)
    );

    const posAttr = groupGeometryFar.getAttribute('position');
    let cx = 0,
      cy = 0,
      cz = 0;
    for (let i = 0; i < posAttr.count; i++) {
      cx += posAttr.getX(i);
      cy += posAttr.getY(i);
      cz += posAttr.getZ(i);
    }
    cx /= posAttr.count;
    cy /= posAttr.count;
    cz /= posAttr.count;
    groupGeometryNear.translate(-cx, -cy, -cz);
    groupGeometryFar.translate(-cx, -cy, -cz);

    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.src = heartImages[group];
    img.onload = () => {
      const neonTexture = createNeonTexture(img, 256);

      const materialNear = new THREE.PointsMaterial({
        size: 1.8,
        map: neonTexture,
        transparent: false,
        alphaTest: 0.2,
        depthWrite: true,
        depthTest: true,
        blending: THREE.NormalBlending,
        vertexColors: true,
      });

      const materialFar = new THREE.PointsMaterial({
        size: 1.8,
        map: neonTexture,
        transparent: true,
        alphaTest: 0.2,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
      });

      const pointsObject = new THREE.Points(groupGeometryFar, materialFar);
      pointsObject.position.set(cx, cy, cz);

      pointsObject.userData.materialNear = materialNear;
      pointsObject.userData.geometryNear = groupGeometryNear;
      pointsObject.userData.materialFar = materialFar;
      pointsObject.userData.geometryFar = groupGeometryFar;

      scene.add(pointsObject);
    };
  }

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  const starCount = 20000;
  const starGeometry = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    starPositions[i * 3] = (Math.random() - 0.5) * 900;
    starPositions[i * 3 + 1] = (Math.random() - 0.5) * 900;
    starPositions[i * 3 + 2] = (Math.random() - 0.5) * 900;
  }
  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.7,
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
  });
  const starField = new THREE.Points(starGeometry, starMaterial);
  starField.name = 'starfield';
  starField.renderOrder = 999;
  scene.add(starField);

  let shootingStars = [];

  function createShootingStar() {
    const trailLength = 150;

    const headGeometry = new THREE.SphereGeometry(2, 32, 32);
    const headMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);

    const glowGeometry = new THREE.SphereGeometry(3, 32, 32);
    const glowMaterial = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
      vertexShader: glowVert,
      fragmentShader: glowFrag,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    head.add(glow);

    const atmosphereGeometry = new THREE.SphereGeometry(planetRadius * 1.05, 48, 48);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color(0xe0b3ff) },
      },
      vertexShader: atmosphereVert,
      fragmentShader: atmosphereFrag,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });

    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    planet.add(atmosphere);

    const curve = createRandomCurve();
    const trailPoints = [];
    for (let i = 0; i < trailLength; i++) {
      const progress = i / (trailLength - 1);
      trailPoints.push(curve.getPoint(progress));
    }
    const trailGeometry = new THREE.BufferGeometry().setFromPoints(trailPoints);
    const trailColor = new THREE.Color().setHSL(Math.random(), 1.0, 0.6);
    const trailMaterial = new THREE.LineBasicMaterial({
      color: trailColor,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });

    const trail = new THREE.Line(trailGeometry, trailMaterial);

    const shootingStarGroup = new THREE.Group();
    shootingStarGroup.add(head);
    shootingStarGroup.add(trail);
    shootingStarGroup.userData = {
      curve: curve,
      progress: 0,
      speed: 0.001 + Math.random() * 0.001,
      life: 0,
      maxLife: 300,
      head: head,
      trail: trail,
      trailLength: trailLength,
      trailPoints: trailPoints,
    };
    scene.add(shootingStarGroup);
    shootingStars.push(shootingStarGroup);
  }

  function createRandomCurve() {
    const points = [];
    const startPoint = new THREE.Vector3(
      -200 + Math.random() * 100,
      -100 + Math.random() * 200,
      -100 + Math.random() * 200
    );
    const endPoint = new THREE.Vector3(
      600 + Math.random() * 200,
      startPoint.y + (-100 + Math.random() * 200),
      startPoint.z + (-100 + Math.random() * 200)
    );
    const controlPoint1 = new THREE.Vector3(
      startPoint.x + 200 + Math.random() * 100,
      startPoint.y + (-50 + Math.random() * 100),
      startPoint.z + (-50 + Math.random() * 100)
    );
    const controlPoint2 = new THREE.Vector3(
      endPoint.x - 200 + Math.random() * 100,
      endPoint.y + (-50 + Math.random() * 100),
      endPoint.z + (-50 + Math.random() * 100)
    );

    points.push(startPoint, controlPoint1, controlPoint2, endPoint);
    return new THREE.CubicBezierCurve3(startPoint, controlPoint1, controlPoint2, endPoint);
  }

  function createPlanetTexture(size = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      size / 8,
      size / 2,
      size / 2,
      size / 2
    );

    gradient.addColorStop(0.0, '#ffdde1');
    gradient.addColorStop(0.12, '#f8bbd0');
    gradient.addColorStop(0.25, '#ff99cc');
    gradient.addColorStop(0.4, '#ffffff');
    gradient.addColorStop(0.55, '#fcb0c7');
    gradient.addColorStop(0.7, '#d47eb4');
    gradient.addColorStop(0.85, '#ff99aa');
    gradient.addColorStop(1.0, '#ffd1e3');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    const spotColors = [
      '#f8bbd0',
      '#f8bbd0',
      '#f48fb1',
      '#f48fb1',
      '#f06292',
      '#f06292',
      '#ffffff',
      '#e1aaff',
      '#a259f7',
      '#b2ff59',
    ];
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const radius = 30 + Math.random() * 120;
      const color = spotColors[Math.floor(Math.random() * spotColors.length)];
      const spotGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      spotGradient.addColorStop(0, color + 'cc');
      spotGradient.addColorStop(1, color + '00');
      ctx.fillStyle = spotGradient;
      ctx.fillRect(0, 0, size, size);
    }

    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * size, Math.random() * size);
      ctx.bezierCurveTo(
        Math.random() * size,
        Math.random() * size,
        Math.random() * size,
        Math.random() * size,
        Math.random() * size,
        Math.random() * size
      );
      ctx.strokeStyle = 'rgba(180, 120, 200, ' + (0.12 + Math.random() * 0.18) + ')';
      ctx.lineWidth = 8 + Math.random() * 18;
      ctx.stroke();
    }

    if (ctx.filter !== undefined) {
      ctx.filter = 'blur(2px)';
      ctx.drawImage(canvas, 0, 0);
      ctx.filter = 'none';
    }

    return new THREE.CanvasTexture(canvas);
  }

  const stormShader = {
    uniforms: {
      time: { value: 0.0 },
      baseTexture: { value: null },
    },
    vertexShader: stormVert,
    fragmentShader: stormFrag,
  };

  const planetRadius = 10;
  const planetGeometry = new THREE.SphereGeometry(planetRadius, 48, 48);
  const planetTexture = createPlanetTexture();
  const planetMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0.0 },
      baseTexture: { value: planetTexture },
    },
    vertexShader: stormShader.vertexShader,
    fragmentShader: stormShader.fragmentShader,
  });
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);
  planet.position.set(0, 0, 0);
  scene.add(planet);

  const ringTexts = window?.dataCCD?.ringTexts ?? [];

  function createTextRings() {
    const numRings = ringTexts.length;
    const baseRingRadius = planetRadius * 1.1;
    const ringSpacing = 5;
    window.textRings = [];

    for (let i = 0; i < numRings; i++) {
      const text = ringTexts[i % ringTexts.length] + '   ';
      const ringRadius = baseRingRadius + i * ringSpacing;

      function getCharType(char) {
        const charCode = char.charCodeAt(0);
        if (
          (charCode >= 0x4e00 && charCode <= 0x9fff) ||
          (charCode >= 0x3040 && charCode <= 0x309f) ||
          (charCode >= 0x30a0 && charCode <= 0x30ff) ||
          (charCode >= 0xac00 && charCode <= 0xd7af)
        ) {
          return 'cjk';
        } else if (charCode >= 0 && charCode <= 0x7f) {
          return 'latin';
        }
        return 'other';
      }

      let charCounts = { cjk: 0, latin: 0, other: 0 };
      for (let char of text) {
        charCounts[getCharType(char)]++;
      }

      const totalChars = text.length;
      const cjkRatio = charCounts.cjk / totalChars;

      let scaleParams = { fontScale: 0.75, spacingScale: 1.1 };

      if (i === 0) {
        scaleParams.fontScale = 0.55;
        scaleParams.spacingScale = 0.9;
      } else if (i === 1) {
        scaleParams.fontScale = 0.65;
        scaleParams.spacingScale = 1.0;
      }

      if (cjkRatio > 0) {
        scaleParams.fontScale *= 0.9;
        scaleParams.spacingScale *= 1.1;
      }

      const textureHeight = 150;
      const fontSize = Math.max(130, 0.8 * textureHeight);

      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx.font = `bold ${fontSize}px Arial, sans-serif`;
      let singleText = ringTexts[i % ringTexts.length];
      const separator = '   ';
      let repeatedTextSegment = singleText + separator;

      const maxTextureWidth = renderer.capabilities.maxTextureSize || 8192;
      let segmentWidth = tempCtx.measureText(repeatedTextSegment).width;
      let textureWidthCircumference = 2 * Math.PI * ringRadius * 180;
      let repeatCount = Math.ceil(textureWidthCircumference / segmentWidth);
      let fullText = '';

      for (let j = 0; j < repeatCount; j++) {
        fullText += repeatedTextSegment;
      }
      const finalTextureWidth = Math.min(repeatCount * segmentWidth, maxTextureWidth);

      if (repeatCount * segmentWidth > maxTextureWidth) {
        repeatCount = Math.floor(maxTextureWidth / segmentWidth);
      }

      const textCanvas = document.createElement('canvas');
      textCanvas.width = Math.ceil(finalTextureWidth);
      textCanvas.height = textureHeight;
      const ctx = textCanvas.getContext('2d');

      ctx.clearRect(0, 0, textCanvas.width, textureHeight);
      ctx.font = `bold ${fontSize}px Arial, sans-serif`;
      ctx.fillStyle = 'white';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';

      ctx.shadowColor = '#e0b3ff';
      ctx.shadowBlur = 18;
      ctx.lineWidth = 7;
      ctx.strokeStyle = '#fff';
      ctx.strokeText(fullText, 0, textureHeight * 0.82);

      ctx.shadowColor = '#ffb3de';
      ctx.shadowBlur = 24;
      ctx.fillStyle = '#fff';
      ctx.fillText(fullText, 0, textureHeight * 0.84);

      const ringTexture = new THREE.CanvasTexture(textCanvas);
      ringTexture.wrapS = THREE.RepeatWrapping;
      ringTexture.repeat.x = finalTextureWidth / textureWidthCircumference;
      ringTexture.needsUpdate = true;

      const ringGeometry = new THREE.CylinderGeometry(ringRadius, ringRadius, 1, 128, 1, true);

      const ringMaterial = new THREE.MeshBasicMaterial({
        map: ringTexture,
        transparent: true,
        side: THREE.DoubleSide,
        alphaTest: 0.01,
        opacity: 1,
        depthWrite: false,
      });

      const textRingMesh = new THREE.Mesh(ringGeometry, ringMaterial);
      textRingMesh.position.set(0, 0, 0);
      textRingMesh.rotation.y = Math.PI / 2;

      const ringGroup = new THREE.Group();
      ringGroup.add(textRingMesh);
      ringGroup.userData = {
        ringRadius: ringRadius,
        angleOffset: 0.15 * Math.PI * 0.5,
        speed: 0.002 + 0.00025,
        tiltSpeed: 0,
        rollSpeed: 0,
        pitchSpeed: 0,
        tiltAmplitude: Math.PI / 3,
        rollAmplitude: Math.PI / 6,
        pitchAmplitude: Math.PI / 8,
        tiltPhase: Math.PI * 2,
        rollPhase: Math.PI * 2,
        pitchPhase: Math.PI * 2,
        isTextRing: true,
      };

      const initialRotationX = (i / numRings) * (Math.PI / 1);
      ringGroup.rotation.x = initialRotationX;
      scene.add(ringGroup);
      window.textRings.push(ringGroup);
    }
  }

  createTextRings();

  function updateTextRingsRotation() {
    if (!window.textRings || !camera) return;

    window.textRings.forEach((ringGroup) => {
      ringGroup.children.forEach((child) => {
        if (child.userData.initialAngle !== undefined) {
          const angle = child.userData.initialAngle + ringGroup.userData.angleOffset;
          const x = Math.cos(angle) * child.userData.ringRadius;
          const z = Math.sin(angle) * child.userData.ringRadius;
          child.position.set(x, 0, z);

          const worldPos = new THREE.Vector3();
          child.getWorldPosition(worldPos);

          const lookAtVector = new THREE.Vector3()
            .subVectors(camera.position, worldPos)
            .normalize();
          const rotationY = Math.atan2(lookAtVector.x, lookAtVector.z);
          child.rotation.y = rotationY;
        }
      });
    });
  }

  function animatePlanetSystem() {
    if (window.textRings) {
      const time = Date.now() * 0.001;
      window.textRings.forEach((ringGroup, index) => {
        const userData = ringGroup.userData;
        userData.angleOffset += userData.speed;

        const tilt =
          Math.sin(time * userData.tiltSpeed + userData.tiltPhase) * userData.tiltAmplitude;
        const roll =
          Math.cos(time * userData.rollSpeed + userData.rollPhase) * userData.rollAmplitude;
        const pitch =
          Math.sin(time * userData.pitchSpeed + userData.pitchPhase) * userData.pitchAmplitude;

        ringGroup.rotation.x = (index / window.textRings.length) * (Math.PI / 1) + tilt;
        ringGroup.rotation.z = roll;
        ringGroup.rotation.y = userData.angleOffset + pitch;

        const verticalBob = Math.sin(time * (userData.tiltSpeed * 0.7) + userData.tiltPhase) * 0.3;
        ringGroup.position.y = verticalBob;

        const pulse = (Math.sin(time * 1.5 + index) + 1) / 2;
        const textMesh = ringGroup.children[0];
        if (textMesh && textMesh.material) {
          textMesh.material.opacity = 0.7 + pulse * 0.3;
        }
      });
      updateTextRingsRotation();
    }
  }

  let galaxyAudio = null;

  function preloadGalaxyAudio() {
    galaxyAudio = new Audio(window.dataCCD.heartAudio);
    galaxyAudio.loop = true;
    galaxyAudio.volume = 1.0;
    galaxyAudio.preload = 'auto';
    window.galaxyAudio = galaxyAudio;
  }

  function playGalaxyAudio() {
    if (galaxyAudio) {
      galaxyAudio.play().catch((err) => {
        console.warn('Audio play blocked or delayed:', err);
      });
    }
  }
  preloadGalaxyAudio();

  let fadeOpacity = 0.1;
  let fadeInProgress = false;

  let hintIcon;

  function animate() {
    requestAnimationFrame(animate);
    const time = performance.now() * 0.001;

    controls.update();
    planet.material.uniforms.time.value = time * 0.5;

    if (fadeInProgress && fadeOpacity < 1) {
      fadeOpacity += 0.025;
      if (fadeOpacity > 1) fadeOpacity = 1;
    }

    if (!introStarted) {
      fadeOpacity = 0.1;
      scene.traverse((obj) => {
        if (obj.name === 'starfield') {
          if (obj.points && obj.material.opacity !== undefined) {
            obj.material.transparent = false;
            obj.material.opacity = 1;
          }
          return;
        }
        if (
          obj.userData.isTextRing ||
          (obj.parent && obj.parent.userData && obj.parent.userData.isTextRing)
        ) {
          if (obj.material && obj.material.opacity !== undefined) {
            obj.material.transparent = false;
            obj.material.opacity = 1;
          }
          if (obj.material && obj.material.color) {
            obj.material.color.set(0xffffff);
          }
        } else if (
          obj !== planet &&
          obj !== centralGlow &&
          obj !== hintIcon &&
          obj.type !== 'Scene' &&
          !obj.parent.isGroup
        ) {
          if (obj.material && obj.material.opacity !== undefined) {
            obj.material.transparent = true;
            obj.material.opacity = 0.1;
          }
        }
      });
      planet.visible = true;
      centralGlow.visible = true;
    } else {
      scene.traverse((obj) => {
        if (
          !(
            obj.userData.isTextRing ||
            (obj.parent && obj.parent.userData && obj.parent.userData.isTextRing) ||
            obj === planet ||
            obj === centralGlow ||
            obj.type === 'Scene'
          )
        ) {
          if (obj.material && obj.material.opacity !== undefined) {
            obj.material.transparent = true;
            obj.material.opacity = fadeOpacity;
          }
        } else {
          if (obj.material && obj.material.opacity !== undefined) {
            obj.material.opacity = 1;
            obj.material.transparent = false;
          }
        }
        if (obj.material && obj.material.color) {
          obj.material.color.set(0xffffff);
        }
      });
    }

    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const star = shootingStars[i];
      star.userData.life++;

      let opacity = 1.0;
      if (star.userData.life < 30) {
        opacity = star.userData.life / 30;
      } else if (star.userData.life > star.userData.maxLife - 30) {
        opacity = (star.userData.maxLife - star.userData.life) / 30;
      }

      star.userData.progress += star.userData.speed;
      if (star.userData.progress > 1) {
        scene.remove(star);
        shootingStars.splice(i, 1);
        continue;
      }

      const currentPos = star.userData.curve.getPoint(star.userData.progress);
      star.position.copy(currentPos);
      star.userData.head.material.opacity = opacity;
      star.userData.head.children[0].material.uniforms.time.value = time;

      const trail = star.userData.trail;
      const trailPoints = star.userData.trailPoints;
      trailPoints[0].copy(currentPos);
      for (let j = 1; j < star.userData.trailLength; j++) {
        const trailProgress = Math.max(0, star.userData.progress - j * 0.01);
        trailPoints[j].copy(star.userData.curve.getPoint(trailProgress));
      }
      trail.geometry.setFromPoints(trailPoints);
      trail.material.opacity = opacity * 0.7;
    }

    if (shootingStars.length < 3 && Math.random() < 0.02) {
      createShootingStar();
    }

    scene.traverse((obj) => {
      if (obj.isPoints && obj.userData.materialNear && obj.userData.materialFar) {
        const positionAttr = obj.geometry.getAttribute('position');
        let isClose = false;
        for (let i = 0; i < positionAttr.count; i++) {
          const worldX = positionAttr.getX(i) + obj.position.x;
          const worldY = positionAttr.getY(i) + obj.position.y;
          const worldZ = positionAttr.getZ(i) + obj.position.z;
          const distance = camera.position.distanceTo(new THREE.Vector3(worldX, worldY, worldZ));
          if (distance < 10) {
            isClose = true;
            break;
          }
        }
        if (isClose) {
          if (obj.material !== obj.userData.materialNear) {
            obj.material = obj.userData.materialNear;
            obj.geometry = obj.userData.geometryNear;
          }
        } else {
          if (obj.material !== obj.userData.materialFar) {
            obj.material = obj.userData.materialFar;
            obj.geometry = obj.userData.geometryFar;
          }
        }
      }
    });

    planet.lookAt(camera.position);
    animatePlanetSystem();

    if (starField && starField.material && starField.material.opacity !== undefined) {
      starField.material.opacity = 1.0;
      starField.material.transparent = false;
    }

    renderer.render(scene, camera);
  }

  createShootingStar();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    controls.target.set(0, 0, 0);
    controls.update();
  });

  function startCameraAnimation() {
    const startPos = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
    const midPos1 = { x: startPos.x, y: 0, z: startPos.z };
    const midPos2 = { x: startPos.x, y: 0, z: 160 };
    const endPos = { x: -40, y: 100, z: 100 };

    const duration1 = 0.2;
    const duration2 = 0.55;
    const duration3 = 0.4;
    let progress = 0;

    function animatePath() {
      progress += 0.0025;
      let newPos;

      if (progress < duration1) {
        let t = progress / duration1;
        newPos = {
          x: startPos.x + (midPos1.x - startPos.x) * t,
          y: startPos.y + (midPos1.y - startPos.y) * t,
          z: startPos.z + (midPos1.z - startPos.z) * t,
        };
      } else if (progress < duration1 + duration2) {
        let t = (progress - duration1) / duration2;
        newPos = {
          x: midPos1.x + (midPos2.x - midPos1.x) * t,
          y: midPos1.y + (midPos2.y - midPos1.y) * t,
          z: midPos1.z + (midPos2.z - midPos1.z) * t,
        };
      } else if (progress < duration1 + duration2 + duration3) {
        let t = (progress - duration1 - duration2) / duration3;
        let easedT = 0.5 - 0.5 * Math.cos(Math.PI * t); // Ease-in-out
        newPos = {
          x: midPos2.x + (endPos.x - midPos2.x) * easedT,
          y: midPos2.y + (endPos.y - midPos2.y) * easedT,
          z: midPos2.z + (endPos.z - midPos2.z) * easedT,
        };
      } else {
        camera.position.set(endPos.x, endPos.y, endPos.z);
        camera.lookAt(0, 0, 0);
        controls.target.set(0, 0, 0);
        controls.update();
        controls.enabled = true;
        return;
      }

      camera.position.set(newPos.x, newPos.y, newPos.z);
      camera.lookAt(0, 0, 0);
      requestAnimationFrame(animatePath);
    }
    controls.enabled = false;
    animatePath();
  }

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let introStarted = false;

  const originalStarCount = starGeometry.getAttribute('position').count;
  if (starField && starField.geometry) {
    starField.geometry.setDrawRange(0, Math.floor(originalStarCount * 0.1));
  }

  function onCanvasClick(event) {
    if (introStarted) return;

    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(planet);
    if (intersects.length > 0) {
      introStarted = true;
      fadeInProgress = true;
      playGalaxyAudio();

      startCameraAnimation();

      if (starField && starField.geometry) {
        starField.geometry.setDrawRange(0, originalStarCount);
      }
    }
  }

  renderer.domElement.addEventListener('click', onCanvasClick);

  animate();

  const preventDefault = (event) => event.preventDefault();
  document.addEventListener('touchmove', preventDefault, { passive: false });
  document.addEventListener('gesturestart', preventDefault, { passive: false });

  if (container) {
    container.addEventListener('touchmove', preventDefault, { passive: false });
  }
}
