export const Personality = {
  happy: { sway: 0.05, color: 0xff3366, music: "happy.mp3" },
  lonely: { sway: 0.02, color: 0xff88aa, music: "lonely.mp3" },
  sad: { sway: 0.01, color: 0xaa6677, music: "sad.mp3" }
};

export function getMood(daysAway) {
  if (daysAway <= 1) return "happy";
  if (daysAway <= 3) return "lonely";
  return "sad";
}
