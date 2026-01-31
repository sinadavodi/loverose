export const State = {
  startDay: localStorage.startDay || (localStorage.startDay = Date.now()),
  lastDisplay: localStorage.lastDisplay || "",
  volume: localStorage.volume || 50
};

State.daysTogether =
  Math.floor((Date.now() - State.startDay) / (1000*60*60*24));
