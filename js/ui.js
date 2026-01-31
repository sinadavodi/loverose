import { Personality } from "./personality.js";
import { State } from "./state.js";
import { quotes } from "./quotes.js";
export function initUI(State, Personality) {
  const quoteText = document.getElementById("quoteText");

  const today = new Date().toDateString();
  let selected = localStorage.lastDisplay;

  if (selected !== today) {
    localStorage.lastDisplay = today;
    quoteText.innerText =
      quotes[Math.floor(Math.random()*quotes.length)];
  } else {
    quoteText.innerText = quoteText.innerText;
  }

  document.getElementById("moodText").innerText =
    `روزهای با هم: ${State.daysTogether}`;
}
