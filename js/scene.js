export function initScene(THREE, GLTFLoader, State, Personality) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );

  camera.position.set(0, 1.5, 4);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1.2);
  light.position.set(2, 5, 3);
  scene.add(light);

  const loader = new GLTFLoader();
  loader.load("./models/rose.gltf", (gltf) => {
    scene.add(gltf.scene);
    State.awake = true;
  });

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  animate();
}
