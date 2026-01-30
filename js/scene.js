export function initScene(THREE, GLTFLoader, State, Personality) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100);
  camera.position.set(0, 1.4, 4);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(innerWidth, innerHeight);
  document.body.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.6));

  const light = new THREE.DirectionalLight(0xffffff, 1.4);
  light.position.set(2, 4, 3);
  scene.add(light);

  let rose;

  const loader = new GLTFLoader();
  loader.load("./models/rose.glb", (gltf) => {
    rose = gltf.scene;
    rose.scale.set(1.5, 1.5, 1.5);
    scene.add(rose);
    State.awake = true;
  });

  function applyWilt() {
    if (!rose) return;

    Personality.update(State);

    if (Personality.mood === "happy") {
      rose.rotation.z *= 0.98;
    }

    if (Personality.mood === "sad") {
      rose.rotation.z = -0.15;
    }

    if (Personality.mood === "wilted") {
      rose.rotation.z = -0.35;
      rose.position.y = -0.2;
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    applyWilt();
    renderer.render(scene, camera);
  }

  animate();
}
