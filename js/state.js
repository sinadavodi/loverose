export const State = {};

State.start = localStorage.start || (localStorage.start = Date.now());
State.lastVisit = localStorage.last || Date.now();
localStorage.last = Date.now();

State.daysTogether =
  Math.floor((Date.now()-State.start)/86400000);

State.daysAway =
  Math.floor((Date.now()-State.lastVisit)/86400000);

// stages: 0 healthy | 1 lonely | 2 sad | 3 dying
State.stage = Math.min(State.daysAway,3);

// احیا
State.heal = ()=>{
  localStorage.last = Date.now();
};
