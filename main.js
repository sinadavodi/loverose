import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.158/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.158/examples/jsm/loaders/GLTFLoader.js";

import { State } from "./state.js";
import { Personality } from "./personality.js";
import { initScene } from "./scene.js";
import { initUI } from "./ui.js";
import { initMusic } from "./music.js";

initScene(THREE, GLTFLoader, Personality);
initUI(State, Personality);
initMusic(Personality);
