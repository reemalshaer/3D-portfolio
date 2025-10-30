import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);

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
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
mainLight.position.set(5, 10, 5);
mainLight.castShadow = true;
mainLight.shadow.mapSize.width = 2048;
mainLight.shadow.mapSize.height = 2048;
mainLight.shadow.camera.far = 50;
mainLight.shadow.camera.left = -10;
mainLight.shadow.camera.right = 10;
mainLight.shadow.camera.top = 10;
mainLight.shadow.camera.bottom = -10;
scene.add(mainLight);

// Floor
const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0x2c2c3e,
  roughness: 0.8,
  metalness: 0.2
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.5;
floor.receiveShadow = true;
scene.add(floor);

// Desk Group
const deskGroup = new THREE.Group();

// Desk surface
const deskTopGeometry = new THREE.BoxGeometry(4, 0.1, 2.5);
const deskMaterial = new THREE.MeshStandardMaterial({
  color: 0x8b6f47,
  roughness: 0.6,
  metalness: 0.1
});
const deskTop = new THREE.Mesh(deskTopGeometry, deskMaterial);
deskTop.position.y = 0;
deskTop.castShadow = true;
deskTop.receiveShadow = true;
deskGroup.add(deskTop);

// Desk legs
const legGeometry = new THREE.BoxGeometry(0.1, 1, 0.1);
const legPositions = [
  [-1.8, -0.5, 1.1],
  [1.8, -0.5, 1.1],
  [-1.8, -0.5, -1.1],
  [1.8, -0.5, -1.1]
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
  color: 0x2c2c3c,
  roughness: 0.4,
  metalness: 0.6
});
const laptopBase = new THREE.Mesh(laptopBaseGeometry, laptopMaterial);
laptopBase.position.set(0, 0.075, 0.2);
laptopBase.castShadow = true;
laptopGroup.add(laptopBase);

// Laptop keyboard
const keyboardGeometry = new THREE.BoxGeometry(1.3, 0.02, 0.8);
const keyboardMaterial = new THREE.MeshStandardMaterial({
  color: 0x1a1a2e,
  roughness: 0.7
});
const keyboard = new THREE.Mesh(keyboardGeometry, keyboardMaterial);
keyboard.position.set(0, 0.085, 0.15);
laptopGroup.add(keyboard);

// Laptop screen
const screenGroup = new THREE.Group();
const screenGeometry = new THREE.BoxGeometry(1.5, 0.9, 0.05);
const screenMaterial = new THREE.MeshStandardMaterial({
  color: 0x1a1a1a,
  roughness: 0.3,
  metalness: 0.7
});
const screenBody = new THREE.Mesh(screenGeometry, screenMaterial);
screenBody.castShadow = true;
screenGroup.add(screenBody);

// Laptop display
const displayGeometry = new THREE.PlaneGeometry(1.4, 0.8);
const displayMaterial = new THREE.MeshStandardMaterial({
  color: 0x4a90e2,
  emissive: 0x2a5a8a,
  emissiveIntensity: 0.5
});
const display = new THREE.Mesh(displayGeometry, displayMaterial);
display.position.z = 0.026;
screenGroup.add(display);

screenGroup.position.set(0, 0.55, -0.25);
screenGroup.rotation.x = -Math.PI / 2.5;
laptopGroup.add(screenGroup);

laptopGroup.position.y = 0.05;
deskGroup.add(laptopGroup);

// Desk Lamp
const lampGroup = new THREE.Group();

// Lamp base
const lampBaseGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.05, 16);
const lampMaterial = new THREE.MeshStandardMaterial({
  color: 0x333333,
  roughness: 0.5,
  metalness: 0.7
});
const lampBase = new THREE.Mesh(lampBaseGeometry, lampMaterial);
lampBase.position.y = 0.075;
lampGroup.add(lampBase);

// Lamp arm
const lampArmGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.8, 8);
const lampArm = new THREE.Mesh(lampArmGeometry, lampMaterial);
lampArm.position.set(0, 0.45, 0);
lampArm.rotation.z = Math.PI / 6;
lampGroup.add(lampArm);

// Lamp head
const lampHeadGeometry = new THREE.ConeGeometry(0.15, 0.25, 16);
const lampHead = new THREE.Mesh(lampHeadGeometry, lampMaterial);
lampHead.position.set(0.3, 0.8, 0);
lampHead.rotation.z = Math.PI / 4;
lampGroup.add(lampHead);

// Lamp light
const lampLight = new THREE.PointLight(0xffd699, 1.5, 5);
lampLight.position.set(0.35, 0.7, 0);
lampLight.castShadow = true;
lampGroup.add(lampLight);

lampGroup.position.set(1.3, 0.05, 0.5);
deskGroup.add(lampGroup);

// Raycaster for click detection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Animation state
let isZoomedIn = false;
let isAnimating = false;
const originalCameraPosition = new THREE.Vector3(0, 5, 10);
const zoomedCameraPosition = new THREE.Vector3(0, 1.5, 2.5);
const originalControlsTarget = new THREE.Vector3(0, 0, 0);
const zoomedControlsTarget = new THREE.Vector3(0, 0.5, 0);

// UI Elements
const uiOverlay = document.getElementById('ui-overlay');
const instructions = document.getElementById('instructions');
const backButton = document.getElementById('back-button');
const contentDisplay = document.getElementById('content-display');
const contentArea = document.getElementById('content-area');
const uiButtons = document.querySelectorAll('.ui-button');
const closeContentButton = document.querySelector('.close-content');

// Content data
const contentData = {
  about: {
    title: 'About Me',
    content: `
      <h2>About Me</h2>
      <p>Hello! I'm a passionate developer who loves creating interactive 3D experiences on the web.</p>
      <p>I specialize in Three.js, WebGL, and modern web technologies to bring creative visions to life.</p>
      <p>This portfolio showcases my skills in 3D web development and interactive design.</p>
    `
  },
  projects: {
    title: 'Projects',
    content: `
      <h2>My Projects</h2>
      <ul>
        <li><strong>Interactive 3D Portfolio</strong> - This very project! Built with Three.js and Vite.</li>
        <li><strong>WebGL Shader Art</strong> - Creative experiments with GLSL shaders.</li>
        <li><strong>3D Product Visualizer</strong> - E-commerce 3D product viewer.</li>
        <li><strong>Virtual Gallery</strong> - Immersive art gallery experience.</li>
      </ul>
    `
  },
  skills: {
    title: 'Skills',
    content: `
      <h2>Technical Skills</h2>
      <ul>
        <li><strong>3D Graphics:</strong> Three.js, WebGL, GLSL Shaders</li>
        <li><strong>Frontend:</strong> JavaScript, React, Vue, HTML5, CSS3</li>
        <li><strong>Tools:</strong> Vite, Webpack, Git, Blender</li>
        <li><strong>Other:</strong> Node.js, Express, MongoDB</li>
      </ul>
    `
  },
  contact: {
    title: 'Contact',
    content: `
      <h2>Get In Touch</h2>
      <p>I'd love to hear from you! Feel free to reach out for collaborations or opportunities.</p>
      <p><strong>Email:</strong> your.email@example.com</p>
      <p><strong>GitHub:</strong> github.com/yourusername</p>
      <p><strong>LinkedIn:</strong> linkedin.com/in/yourprofile</p>
    `
  }
};

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

  setTimeout(() => {
    uiOverlay.classList.remove('hidden');
    uiOverlay.classList.add('show');
  }, 800);
}

// Zoom out
function zoomOut() {
  if (!isZoomedIn || isAnimating) return;

  isZoomedIn = false;
  uiOverlay.classList.remove('show');
  uiOverlay.classList.add('hidden');
  contentDisplay.classList.remove('show');
  contentDisplay.classList.add('hidden');

  animateCamera(originalCameraPosition, originalControlsTarget);

  setTimeout(() => {
    instructions.style.display = 'block';
  }, 1000);
}

// Show content
function showContent(section) {
  const data = contentData[section];
  if (!data) return;

  contentArea.innerHTML = data.content;
  contentDisplay.classList.remove('hidden');
  contentDisplay.classList.add('show');
}

// Hide content
function hideContent() {
  contentDisplay.classList.remove('show');
  contentDisplay.classList.add('hidden');
}

// Click handler
canvas.addEventListener('click', (event) => {
  if (isAnimating) return;

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObject(deskGroup, true);

  if (intersects.length > 0 && !isZoomedIn) {
    zoomIn();
  }
});

// Back button
backButton.addEventListener('click', zoomOut);

// UI buttons
uiButtons.forEach(button => {
  button.addEventListener('click', () => {
    const section = button.getAttribute('data-section');
    showContent(section);
  });
});

// Close content button
closeContentButton.addEventListener('click', hideContent);

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

  // Subtle lamp light pulsing
  lampLight.intensity = 1.5 + Math.sin(Date.now() * 0.001) * 0.2;

  renderer.render(scene, camera);
}

animate();
