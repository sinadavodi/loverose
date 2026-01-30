export function initScene(THREE, GLTFLoader, Personality) {

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000,4,12);

  const camera = new THREE.PerspectiveCamera(45,innerWidth/innerHeight,0.1,100);
  camera.position.set(0,1.6,4);

  const renderer = new THREE.WebGLRenderer({antialias:true,alpha:true});
  renderer.setSize(innerWidth,innerHeight);
  renderer.setPixelRatio(devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.domElement.style.position = "fixed";
  renderer.domElement.style.top = 0;
  renderer.domElement.style.zIndex = 0;
  document.body.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffcce0,.7));

  const light = new THREE.DirectionalLight(0xffffff,1.2);
  light.position.set(2,4,2);
  light.castShadow = true;
  scene.add(light);

  const loader = new GLTFLoader();
  loader.load("./assets/rose.gltf", gltf => {
    const rose = gltf.scene;
    rose.traverse(o=>{
      if(o.isMesh){
        o.castShadow = true;
        o.material.color.setHex(Personality.color);
      }
    });
    scene.add(rose);

    animate();
    function animate(t){
      requestAnimationFrame(animate);
      rose.rotation.y += 0.002;
      rose.position.y = Math.sin(t*0.001) * Personality.sway;
      renderer.render(scene,camera);
    }
  });

  addEventListener("resize",()=>{
    camera.aspect = innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth,innerHeight);
  });
}
