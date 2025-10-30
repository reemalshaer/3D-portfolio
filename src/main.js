import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a2e); // Dark blue background
scene.fog = new THREE.Fog(0x0a0a2e, 10, 30);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

// Renderer
const canvas = document.getElementById('webgl');
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Orbit Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2;
controls.minDistance = 3;
controls.maxDistance = 20;

// Lighting
const ambientLight = new THREE.AmbientLight(0x4a5a8a, 0.3);
scene.add(ambientLight);

// Spotlight on the desk - bright center
const spotLight = new THREE.SpotLight(0xffffff, 3);
spotLight.position.set(0, 8, 0);
spotLight.angle = Math.PI / 6;
spotLight.penumbra = 0.5;
spotLight.decay = 2;
spotLight.distance = 20;
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 2048;
spotLight.shadow.mapSize.height = 2048;
scene.add(spotLight);
spotLight.target.position.set(0, 0, 0);
scene.add(spotLight.target);

// Flashing effect on load
let flashTime = 0;
let isFlashing = true;
setTimeout(() => {
  isFlashing = false;
}, 3000); // Flash for 3 seconds

// Floor
const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0x1a1a3e,
  roughness: 0.9,
  metalness: 0.1
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.5;
floor.receiveShadow = true;
scene.add(floor);

// Desk Group
const deskGroup = new THREE.Group();

// Desk surface (cartoon style - rounded edges)
const deskTopGeometry = new THREE.BoxGeometry(4, 0.15, 2.5);
const deskMaterial = new THREE.MeshStandardMaterial({
  color: 0xa67c52,
  roughness: 0.6,
  metalness: 0.1
});
const deskTop = new THREE.Mesh(deskTopGeometry, deskMaterial);
deskTop.position.y = 0;
deskTop.castShadow = true;
deskTop.receiveShadow = true;
deskGroup.add(deskTop);

// Desk legs (cartoon style)
const legGeometry = new THREE.CylinderGeometry(0.06, 0.08, 1, 12);
const legPositions = [
  [-1.7, -0.5, 1.0],
  [1.7, -0.5, 1.0],
  [-1.7, -0.5, -1.0],
  [1.7, -0.5, -1.0]
];

legPositions.forEach(pos => {
  const leg = new THREE.Mesh(legGeometry, deskMaterial);
  leg.position.set(pos[0], pos[1], pos[2]);
  leg.castShadow = true;
  deskGroup.add(leg);
});

scene.add(deskGroup);

// Laptop Group
const laptopGroup = new THREE.Group();

// Laptop base
const laptopBaseGeometry = new THREE.BoxGeometry(1.5, 0.05, 1);
const laptopMaterial = new THREE.MeshStandardMaterial({
  color: 0x3a3a4a,
  roughness: 0.4,
  metalness: 0.6
});
const laptopBase = new THREE.Mesh(laptopBaseGeometry, laptopMaterial);
laptopBase.position.set(0, 0.075, 0.2);
laptopBase.castShadow = true;
laptopGroup.add(laptopBase);

// Laptop keyboard area
const keyboardGeometry = new THREE.BoxGeometry(1.3, 0.02, 0.8);
const keyboardMaterial = new THREE.MeshStandardMaterial({
  color: 0x2a2a3a,
  roughness: 0.7
});
const keyboard = new THREE.Mesh(keyboardGeometry, keyboardMaterial);
keyboard.position.set(0, 0.085, 0.15);
laptopGroup.add(keyboard);

// Create canvas texture for screen with menu
const screenCanvas = document.createElement('canvas');
screenCanvas.width = 1024;
screenCanvas.height = 768;
const screenCtx = screenCanvas.getContext('2d');

// Menu state
let currentMenu = 'main';
let selectedOption = 0;

function drawScreenContent() {
  // Clear screen with dark background
  screenCtx.fillStyle = '#0a0a1a';
  screenCtx.fillRect(0, 0, screenCanvas.width, screenCanvas.height);

  // Add scanline effect
  for (let i = 0; i < screenCanvas.height; i += 4) {
    screenCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    screenCtx.fillRect(0, i, screenCanvas.width, 2);
  }

  if (currentMenu === 'main') {
    // Draw menu title
    screenCtx.font = 'bold 60px "Courier New", Consolas, Monaco, monospace';
    screenCtx.fillStyle = '#00ff88';
    screenCtx.textAlign = 'center';
    screenCtx.fillText('PORTFOLIO_TERMINAL', screenCanvas.width / 2, 120);

    // Draw cursor line
    screenCtx.font = '40px "Courier New", Consolas, Monaco, monospace';
    screenCtx.fillStyle = '#00ff88';
    screenCtx.fillText('> SELECT_OPTION:', screenCanvas.width / 2, 200);

    // Menu options
    const options = [
      '[ 1 ] ABOUT_ME',
      '[ 2 ] PROJECTS',
      '[ 3 ] SKILLS',
      '[ 4 ] CONTACT'
    ];

    options.forEach((option, index) => {
      const y = 280 + index * 80;
      const isSelected = index === selectedOption;

      screenCtx.font = `${isSelected ? 'bold ' : ''}45px "Courier New", Consolas, Monaco, monospace`;
      screenCtx.fillStyle = isSelected ? '#ffff00' : '#00cc88';

      if (isSelected) {
        screenCtx.fillStyle = '#ffff00';
        screenCtx.fillText('>', 200, y);
      }

      screenCtx.fillStyle = isSelected ? '#ffff00' : '#00cc88';
      screenCtx.fillText(option, screenCanvas.width / 2, y);
    });

    // Instructions
    screenCtx.font = '30px "Courier New", Consolas, Monaco, monospace';
    screenCtx.fillStyle = '#5588ff';
    screenCtx.fillText('[ CLICK TO SELECT ]', screenCanvas.width / 2, 620);
    screenCtx.fillText('[ ESC TO EXIT ]', screenCanvas.width / 2, 670);
  } else {
    // Content screen
    const contentData = {
      about: {
        title: 'ABOUT_ME.TXT',
        lines: [
          'Hello! I\'m a passionate developer',
          'specializing in:',
          '',
          '• Interactive 3D experiences',
          '• WebGL and Three.js',
          '• Modern web technologies',
          '• Creative coding',
          '',
          'Building the future of the web,',
          'one pixel at a time.'
        ]
      },
      projects: {
        title: 'PROJECTS.TXT',
        lines: [
          'FEATURED PROJECTS:',
          '',
          '1. Interactive 3D Portfolio',
          '   Tech: Three.js, Vite',
          '',
          '2. WebGL Shader Art',
          '   Tech: GLSL, Canvas',
          '',
          '3. 3D Product Visualizer',
          '   Tech: Three.js, React',
          '',
          '4. Virtual Gallery',
          '   Tech: WebXR, Three.js'
        ]
      },
      skills: {
        title: 'SKILLS.TXT',
        lines: [
          'TECHNICAL SKILLS:',
          '',
          '3D Graphics:',
          '  Three.js, WebGL, GLSL',
          '',
          'Frontend:',
          '  JavaScript, React, Vue',
          '  HTML5, CSS3',
          '',
          'Tools:',
          '  Vite, Git, Blender',
          '  Node.js, Express'
        ]
      },
      contact: {
        title: 'CONTACT.TXT',
        lines: [
          'GET IN TOUCH:',
          '',
          'Email:',
          '  your.email@example.com',
          '',
          'GitHub:',
          '  github.com/yourusername',
          '',
          'LinkedIn:',
          '  linkedin.com/in/yourprofile',
          '',
          'Let\'s build something amazing!'
        ]
      }
    };

    const content = contentData[currentMenu];

    // Draw title
    screenCtx.font = 'bold 50px "Courier New", Consolas, Monaco, monospace';
    screenCtx.fillStyle = '#00ff88';
    screenCtx.textAlign = 'center';
    screenCtx.fillText(content.title, screenCanvas.width / 2, 80);

    // Draw border
    screenCtx.strokeStyle = '#00ff88';
    screenCtx.lineWidth = 3;
    screenCtx.strokeRect(50, 110, screenCanvas.width - 100, screenCanvas.height - 200);

    // Draw content
    screenCtx.font = '32px "Courier New", Consolas, Monaco, monospace';
    screenCtx.fillStyle = '#00cc88';
    screenCtx.textAlign = 'left';

    content.lines.forEach((line, index) => {
      screenCtx.fillText(line, 80, 160 + index * 42);
    });

    // Back button
    screenCtx.font = 'bold 32px "Courier New", Consolas, Monaco, monospace';
    screenCtx.fillStyle = '#ffff00';
    screenCtx.textAlign = 'center';
    screenCtx.fillText('[ PRESS ESC TO GO BACK ]', screenCanvas.width / 2, 700);
  }

  screenTexture.needsUpdate = true;
}

// Laptop screen
const screenGroup = new THREE.Group();
const screenGeometry = new THREE.BoxGeometry(1.5, 0.9, 0.05);
const screenMaterial = new THREE.MeshStandardMaterial({
  color: 0x2a2a2a,
  roughness: 0.3,
  metalness: 0.7
});
const screenBody = new THREE.Mesh(screenGeometry, screenMaterial);
screenBody.castShadow = true;
screenGroup.add(screenBody);

// Laptop display with canvas texture
const screenTexture = new THREE.CanvasTexture(screenCanvas);
const displayGeometry = new THREE.PlaneGeometry(1.4, 0.8);
const displayMaterial = new THREE.MeshStandardMaterial({
  map: screenTexture,
  emissive: 0x1a3a5a,
  emissiveIntensity: 0.8
});
const display = new THREE.Mesh(displayGeometry, displayMaterial);
display.position.z = 0.026;
display.name = 'screen';
screenGroup.add(display);

// Screen light
const screenLight = new THREE.PointLight(0x4a90e2, 2, 3);
screenLight.position.set(0, 0, 0.5);
screenGroup.add(screenLight);

screenGroup.position.set(0, 0.55, -0.25);
screenGroup.rotation.x = -Math.PI / 2.5;
laptopGroup.add(screenGroup);

laptopGroup.position.y = 0.05;
deskGroup.add(laptopGroup);

// Coffee cup (cartoon style)
const cupGroup = new THREE.Group();
const cupGeometry = new THREE.CylinderGeometry(0.08, 0.06, 0.15, 16);
const cupMaterial = new THREE.MeshStandardMaterial({
  color: 0xff6b6b,
  roughness: 0.4
});
const cup = new THREE.Mesh(cupGeometry, cupMaterial);
cup.position.y = 0.15;
cup.castShadow = true;
cupGroup.add(cup);

// Coffee liquid
const coffeeGeometry = new THREE.CylinderGeometry(0.075, 0.06, 0.13, 16);
const coffeeMaterial = new THREE.MeshStandardMaterial({
  color: 0x3e2723,
  roughness: 0.8
});
const coffee = new THREE.Mesh(coffeeGeometry, coffeeMaterial);
coffee.position.y = 0.15;
cupGroup.add(coffee);

// Handle
const handleGeometry = new THREE.TorusGeometry(0.05, 0.015, 8, 16, Math.PI);
const handle = new THREE.Mesh(handleGeometry, cupMaterial);
handle.rotation.z = Math.PI / 2;
handle.position.set(0.08, 0.15, 0);
cupGroup.add(handle);

cupGroup.position.set(-1.2, 0.075, 0.6);
deskGroup.add(cupGroup);

// Small plant (cartoon style)
const plantGroup = new THREE.Group();
const potGeometry = new THREE.CylinderGeometry(0.1, 0.08, 0.12, 16);
const potMaterial = new THREE.MeshStandardMaterial({
  color: 0xd4a574,
  roughness: 0.7
});
const pot = new THREE.Mesh(potGeometry, potMaterial);
pot.position.y = 0.13;
pot.castShadow = true;
plantGroup.add(pot);

// Leaves
const leafMaterial = new THREE.MeshStandardMaterial({
  color: 0x4caf50,
  roughness: 0.8
});
for (let i = 0; i < 5; i++) {
  const leafGeometry = new THREE.SphereGeometry(0.05, 8, 8);
  const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
  const angle = (i / 5) * Math.PI * 2;
  leaf.position.set(
    Math.cos(angle) * 0.06,
    0.22 + Math.random() * 0.05,
    Math.sin(angle) * 0.06
  );
  leaf.scale.y = 1.5;
  plantGroup.add(leaf);
}

plantGroup.position.set(1.5, 0.075, -0.8);
deskGroup.add(plantGroup);

// Desk Lamp (cartoon style)
const lampGroup = new THREE.Group();

// Lamp base
const lampBaseGeometry = new THREE.CylinderGeometry(0.15, 0.18, 0.06, 16);
const lampMaterial = new THREE.MeshStandardMaterial({
  color: 0xffd700,
  roughness: 0.4,
  metalness: 0.6
});
const lampBase = new THREE.Mesh(lampBaseGeometry, lampMaterial);
lampBase.position.y = 0.08;
lampBase.castShadow = true;
lampGroup.add(lampBase);

// Lamp arm
const lampArmGeometry = new THREE.CylinderGeometry(0.035, 0.035, 0.8, 8);
const lampArm = new THREE.Mesh(lampArmGeometry, lampMaterial);
lampArm.position.set(0, 0.45, 0);
lampArm.rotation.z = Math.PI / 5;
lampGroup.add(lampArm);

// Lamp head
const lampHeadGeometry = new THREE.ConeGeometry(0.18, 0.3, 16);
const lampHeadMaterial = new THREE.MeshStandardMaterial({
  color: 0xffd700,
  emissive: 0xffaa00,
  emissiveIntensity: 0.3,
  roughness: 0.4,
  metalness: 0.6
});
const lampHead = new THREE.Mesh(lampHeadGeometry, lampHeadMaterial);
lampHead.position.set(0.35, 0.85, 0);
lampHead.rotation.z = Math.PI / 3.5;
lampHead.castShadow = true;
lampGroup.add(lampHead);

// Lamp light
const lampLight = new THREE.PointLight(0xffd699, 2, 5);
lampLight.position.set(0.45, 0.75, 0);
lampLight.castShadow = true;
lampGroup.add(lampLight);

lampGroup.position.set(-1.3, 0.05, -0.5);
deskGroup.add(lampGroup);

// Raycaster for click detection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Animation state
let isZoomedIn = false;
let isAnimating = false;
const originalCameraPosition = new THREE.Vector3(0, 5, 10);
const zoomedCameraPosition = new THREE.Vector3(0, 0.8, 1.2); // Closer to screen
const originalControlsTarget = new THREE.Vector3(0, 0, 0);
const zoomedControlsTarget = new THREE.Vector3(0, 0.5, -0.2); // Looking at screen

// UI Elements
const instructions = document.getElementById('instructions');

// Initialize screen
drawScreenContent();

// Animate camera
function animateCamera(targetPosition, targetLookAt, duration = 1500) {
  if (isAnimating) return;

  isAnimating = true;
  controls.enabled = false;

  const startPosition = camera.position.clone();
  const startTarget = controls.target.clone();
  const startTime = Date.now();

  function update() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease in-out cubic
    const eased = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    camera.position.lerpVectors(startPosition, targetPosition, eased);
    controls.target.lerpVectors(startTarget, targetLookAt, eased);

    controls.update();

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      isAnimating = false;
      controls.enabled = !isZoomedIn;
    }
  }

  update();
}

// Zoom in
function zoomIn() {
  if (isZoomedIn || isAnimating) return;

  isZoomedIn = true;
  instructions.style.display = 'none';

  animateCamera(zoomedCameraPosition, zoomedControlsTarget);
}

// Zoom out
function zoomOut() {
  if (!isZoomedIn || isAnimating) return;

  isZoomedIn = false;
  currentMenu = 'main';
  selectedOption = 0;
  drawScreenContent();

  animateCamera(originalCameraPosition, originalControlsTarget);

  setTimeout(() => {
    instructions.style.display = 'block';
  }, 1000);
}

// Click handler
canvas.addEventListener('click', (event) => {
  if (isAnimating) return;

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  if (!isZoomedIn) {
    // Check if clicked on desk
    const intersects = raycaster.intersectObject(deskGroup, true);
    if (intersects.length > 0) {
      zoomIn();
    }
  } else {
    // Check if clicked on screen
    const screenIntersects = raycaster.intersectObject(display, false);
    if (screenIntersects.length > 0) {
      if (currentMenu === 'main') {
        // Select the highlighted option
        const options = ['about', 'projects', 'skills', 'contact'];
        currentMenu = options[selectedOption];
        drawScreenContent();
      }
    }
  }
});

// Mouse move to highlight options
canvas.addEventListener('mousemove', (event) => {
  if (!isZoomedIn || currentMenu !== 'main') return;

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const screenIntersects = raycaster.intersectObject(display, false);

  if (screenIntersects.length > 0) {
    const uv = screenIntersects[0].uv;
    const y = uv.y;

    // Map UV to menu options
    if (y > 0.35 && y < 0.75) {
      const newSelected = Math.floor((y - 0.35) / 0.1);
      if (newSelected >= 0 && newSelected < 4 && newSelected !== selectedOption) {
        selectedOption = newSelected;
        drawScreenContent();
      }
    }
  }
});

// Keyboard controls
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && isZoomedIn) {
    if (currentMenu !== 'main') {
      currentMenu = 'main';
      drawScreenContent();
    } else {
      zoomOut();
    }
  }

  if (isZoomedIn && currentMenu === 'main') {
    if (event.key === 'ArrowUp') {
      selectedOption = (selectedOption - 1 + 4) % 4;
      drawScreenContent();
    } else if (event.key === 'ArrowDown') {
      selectedOption = (selectedOption + 1) % 4;
      drawScreenContent();
    } else if (event.key === 'Enter') {
      const options = ['about', 'projects', 'skills', 'contact'];
      currentMenu = options[selectedOption];
      drawScreenContent();
    }
  }

  // Number keys
  if (isZoomedIn && currentMenu === 'main' && event.key >= '1' && event.key <= '4') {
    const options = ['about', 'projects', 'skills', 'contact'];
    currentMenu = options[parseInt(event.key) - 1];
    drawScreenContent();
  }
});

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  if (controls.enabled) {
    controls.update();
  }

  flashTime += 0.016;

  // Flashing lamp light on load
  if (isFlashing) {
    const flashIntensity = Math.abs(Math.sin(flashTime * 5)) * 1.5 + 1;
    lampLight.intensity = flashIntensity * 2;
    lampHeadMaterial.emissiveIntensity = flashIntensity * 0.5;
  } else {
    // Subtle pulsing after flash
    lampLight.intensity = 2 + Math.sin(Date.now() * 0.001) * 0.3;
  }

  // Screen glow effect
  displayMaterial.emissiveIntensity = 0.8 + Math.sin(Date.now() * 0.002) * 0.2;
  screenLight.intensity = 2 + Math.sin(Date.now() * 0.003) * 0.5;

  renderer.render(scene, camera);
}

animate();
