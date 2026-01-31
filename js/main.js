import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/controls/OrbitControls.js";

// DOM
const canvas = document.getElementById("roseCanvas");
const loading = document.getElementById("loading");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Camera
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 1.5, 4);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.6));

const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
dirLight.position.set(2, 5, 3);
scene.add(dirLight);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.6;

// Rose model
let rose = null;

const loader = new GLTFLoader();
loader.load(
  "./models/rose.glb",

  (gltf) => {
    rose = gltf.scene;
    rose.scale.set(1.5, 1.5, 1.5);
    scene.add(rose);

    loading.style.opacity = "0";
    setTimeout(() => loading.remove(), 600);

    console.log("🌹 رز با موفقیت لود شد");
  },

  undefined,

  (err) => {
    console.error("❌ خطا در لود مدل:", err);
    loading.textContent = "🌹 ساخت رز ساده…";

    // fallback ساده
    const geo = new THREE.SphereGeometry(0.6, 24, 24);
    const mat = new THREE.MeshStandardMaterial({ color: 0xff3366 });
    rose = new THREE.Mesh(geo, mat);
    scene.add(rose);

    setTimeout(() => loading.remove(), 800);
  }
);

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  if (rose) {
    rose.rotation.y += 0.003;
    rose.position.y = Math.sin(Date.now() * 0.001) * 0.08;
  }

  controls.update();
  renderer.render(scene, camera);
}
animate();

// Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
