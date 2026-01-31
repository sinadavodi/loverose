
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/controls/OrbitControls.js";

import { initScene } from "./scene.js";

initScene(THREE, GLTFLoader, OrbitControls);



import { getMood, Personality } from "./personality.js";
import { initMusic } from "./music.js";
import { initUI } from "./ui.js";

const moodKey = getMood(State.daysTogether);
initMusic(Personality[moodKey], State);
initUI(State, Personality[moodKey]);

if (new Date().getHours() >= 22) 
  document.getElementById("nightStyle").disabled = false;




