import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.158/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.158/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "https://cdn.jsdelivr.net/npm/three@0.158/examples/jsm/loaders/RGBELoader.js";

import { initScene } from "./scene.js";
import { State } from "./state.js";

initScene(THREE, GLTFLoader, RGBELoader, State);


import { getMood, Personality } from "./personality.js";
import { initMusic } from "./music.js";
import { initUI } from "./ui.js";

const moodKey = getMood(State.daysTogether);
initMusic(Personality[moodKey], State);
initUI(State, Personality[moodKey]);

if (new Date().getHours() >= 22) 
  document.getElementById("nightStyle").disabled = false;


