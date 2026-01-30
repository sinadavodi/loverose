export const Personality = {
  mood: "neutral",

  update(State) {
    if (State.attention > 70) this.mood = "happy";
    else if (State.attention > 30) this.mood = "sad";
    else this.mood = "wilted";
  }
};
