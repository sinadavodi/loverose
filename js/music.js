export function initMusic(Personality){
  const audio = new Audio(`/assets/music/HaminBood.mpeg`);
  audio.loop = true;
  audio.volume = 0.5;

  document.body.addEventListener("click",()=>{
    audio.play().catch(()=>{});
  },{ once:true });
}
