export function initMusic(Personality){
  const audio = new Audio(`https://dl.musicsweb.ir/musics/04/08/Younes%20Bayat%20-%20Gomam%20Kon%20-%20320.mp3`);
  audio.loop = true;
  audio.volume = 0.5;

  document.body.addEventListener("click",()=>{
    audio.play().catch(()=>{});
  },{ once:true });
}
