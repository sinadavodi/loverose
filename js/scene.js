export function initScene(THREE, GLTFLoader, RGBELoader, State) {

  // ---------- Renderer ----------
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    physicallyCorrectLights: true
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  document.body.appendChild(renderer.domElement);

  // ---------- Scene ----------
  const scene = new THREE.Scene();

  // ---------- Camera ----------
  const camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 1.4, 4);

  // ---------- HDR Environment ----------
  new RGBELoader()
    .setPath('./hdr/')
    .load('back.hdr', (hdr) => {
      hdr.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = hdr;
      scene.background = null;
    });

  // ---------- Lights (Cinematic Setup) ----------
  const keyLight = new THREE.DirectionalLight(0xffffff, 3.5);
  keyLight.position.set(3, 4, 2);
  keyLight.castShadow = true;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xffc0d9, 1.5);
  fillLight.position.set(-3, 2, 2);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xff4d88, 2.0);
  rimLight.position.set(0, 3, -4);
  scene.add(rimLight);

  // ---------- Ground (Contact Shadow) ----------
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.ShadowMaterial({ opacity: 0.35 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.01;
  ground.receiveShadow = true;
  scene.add(ground);

  // ---------- Load Rose ----------
  let rose;
  new GLTFLoader().load('./models/rose.glb', (gltf) => {
    rose = gltf.scene;
    rose.scale.set(1.5, 1.5, 1.5);

    rose.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.material.envMapIntensity = 1.5;
      }
    });

    scene.add(rose);
  });

  // ---------- Animate ----------
  function animate(time) {
    requestAnimationFrame(animate);

    if (rose) {
      rose.rotation.y += 0.002;
      rose.position.y = Math.sin(time * 0.001) * 0.04;
    }

    renderer.render(scene, camera);
  }

  animate();

  // ---------- Resize ----------
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
