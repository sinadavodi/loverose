
export function initMusic(Person, State) {
  const audio = new Audio(`https://dl.musicsweb.ir/musics/04/08/Younes%20Bayat%20-%20Gomam%20Kon%20-%20320.mp3`);
  audio.volume = State.volume/100;
  audio.loop = true;

  document.getElementById("volumeSlider")
    .addEventListener("input", e => {
      audio.volume = e.target.value/100;
      localStorage.volume = e.target.value;
    });

  document.body.addEventListener("click", ()=> audio.play(), {once:true});
}
