import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.158/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.158/examples/jsm/loaders/GLTFLoader.js";

import { State } from "./state.js";
import { Personality } from "./personality.js";
import { initScene } from "./scene.js";

const hour = new Date().getHours();
if (hour >= 22 || hour <= 5) {
  document.getElementById("nightStyle").disabled = false;
}

initScene(THREE, GLTFLoader, State, Personality);
