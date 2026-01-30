import { Personality } from "./personality.js";

let audio = new Audio(`music/${Personality.music}.mp3`);
audio.loop = true;
audio.volume = 0.5;

document.body.addEventListener("click",()=>{
  audio.play();
},{once:true});
