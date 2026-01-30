import { Personality } from "./personality.js";
import { State } from "./state.js";

document.getElementById("moodText").innerText = Personality.text;
document.getElementById("days").innerText =
  `❤️ روز با هم: ${State.daysTogether}`;

let hour = new Date().getHours();
if(hour >= 22 || hour < 6){
  document.getElementById("nightStyle").disabled = false;
}
