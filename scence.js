import { Personality } from "./personality.js";

let scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000,4,12);

let camera = new THREE.PerspectiveCamera(45,innerWidth/innerHeight,0.1,100);
camera.position.set(0,1.6,4);

let renderer = new THREE.WebGLRenderer({antialias:true,alpha:true});
renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;
document.body.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffcce0,.6));

let light = new THREE.DirectionalLight(0xffffff,1.2);
light.position.set(2,4,2);
light.castShadow=true;
scene.add(light);

let rose;
new THREE.GLTFLoader().load("assets/rose.gltf",g=>{
  rose=g.scene;
  rose.traverse(o=>{
    if(o.isMesh){
      o.castShadow=true;
      o.material.color.setHex(Personality.color);
    }
  });
  scene.add(rose);
});

function animate(t){
  requestAnimationFrame(animate);
  if(rose){
    rose.rotation.y+=0.002;
    rose.position.y=Math.sin(t*0.001)*Personality.sway;
  }
  renderer.render(scene,camera);
}
animate();
