const canvas = document.getElementById("roseCanvas");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  canvas.clientWidth / 250,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(250, 250);
renderer.setPixelRatio(window.devicePixelRatio);

camera.position.z = 5;

// نور
const light = new THREE.PointLight(0xff4d6d, 1.5);
light.position.set(5, 5, 5);
scene.add(light);

// گل (شبیه رز)
const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshStandardMaterial({
  color: 0xff1e56,
  roughness: 0.4,
  metalness: 0.1
});

const rose = new THREE.Mesh(geometry, material);
scene.add(rose);

// انیمیشن زنده
function animate() {
  requestAnimationFrame(animate);
  rose.rotation.y += 0.01;
  rose.rotation.x += 0.005;
  renderer.render(scene, camera);
}
animate();
