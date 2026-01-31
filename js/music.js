
export function initMusic(Person, State) {
  const audio = new Audio(`https://dl.musicsweb.ir/musics/04/08/Younes%20Bayat%20-%20Gomam%20Kon%20-%20320.mp3`);
audio.loop = true;

const savedVolume = localStorage.getItem('rose_volume');
audio.volume = savedVolume ? savedVolume : 0.5;

const slider = document.getElementById('volume');
slider.value = audio.volume * 100;

slider.addEventListener('input', (e) => {
  audio.volume = e.target.value / 100;
  localStorage.setItem('rose_volume', audio.volume);
});

// autoplay fix
document.body.addEventListener('click', () => {
  audio.play().catch(()=>{});
}, { once: true });
