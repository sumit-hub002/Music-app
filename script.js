const playPauseBtn = document.getElementById('play-pause');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const shuffleBtn = document.getElementById('shuffle');
const repeatBtn = document.getElementById('repeat');
const progressBar = document.getElementById('progress');
const volumeControl = document.getElementById('volume');
const trackTitle = document.getElementById('track-title');
const artistName = document.getElementById('artist-name');
const playlist = document.getElementById('playlist');
const fileUpload = document.getElementById('file-upload');


let currentTrack = null;
let isPlaying = false;
let isShuffling = false;
let isRepeating = false;
let trackIndex = 0;

const tracks = [
  {title:'track1', artist:'Artist1', file:'track1.mp3'},
  {title:'track2', artist:'Artist2', file:'track2.mp3'},
  {title:'track3', artist:'Artist3', file:'track3.mp3'}
];

function loadTrack(index){
  if(currentTrack) {
    currentTrack.pause();
    currentTrack.removeEventListener('timeupdate', updateProgress);
    currentTrack.removeEventListener('ended', onTrackEnd);
  }
  trackIndex = index;
  currentTrack = new Audio(tracks[index].file);
  trackTitle.textContent = tracks[index].title;
  artistName.textContent = tracks[index].artist;
  progressBar.value = 0;
  currentTrack.Volume = volumeControl.value/100;

  currentTrack.addEventListener('timeupdate', updateProgress);
  currentTrack.addEventListener('ended', onTrackEnd);

}

function playPauseTrack() {
  if (isPlaying) {
    currentTrack.pause();
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
  } else{
    currentTrack.play();
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
  }
  isPlaying = !isPlaying;
}

function prevTrack () {
  if (isShuffling) {
    trackIndex = Math.floor(Math.random() * tracks.length);
  }
  else {
    trackIndex = trackIndex > 0 ? trackIndex -1 : tracks.length -1;
  }
  loadTrack(trackIndex);
  playPauseTrack();
}

function nextTrack () {
  if (isShuffling) {
    trackIndex = Math.floor(Math.random() * tracks.length);
  }
  else {
    trackIndex = (trackIndex + 1) % tracks.length;
  }
  loadTrack(trackIndex);
  playPauseTrack();
}

function updateProgress() {
  if (currentTrack && currentTrack.duration) {
    const progressPercent = (currentTrack.currentTime / currentTrack.duration)*100;
    progressBar.value = progressPercent;
  }
}

function onTrackEnd() {
  if (isRepeating){
    playPauseTrack();
  }
  else {
    nextTrack();
  }
}


progressBar.addEventListener('input', ()=>{
  if (currentTrack && currentTrack.duration) {
    const seekTime = (progressBar.value/100) * currentTrack.duration;
    currentTrack.currentTime = seekTime;
  }
});


volumeControl.addEventListener('input', ()=>{
  if (currentTrack) {
    currentTrack.volume = volumeControl.value/100;
  }
});


shuffleBtn.addEventListener('click', ()=>{
  isShuffling = !isShuffling;
  shuffleBtn.classList.toggle('active');
});

repeatBtn.addEventListener('click', ()=>{
  isRepeating = !isRepeating;
  repeatBtn.classList.toggle('active');
});

fileUpload.addEventListener('change', (e)=>{
  const files = e.target.files;
  for (i=0; i<files.length; i++){
    const file = files[i];
    const track = {
      title: file.name.split('.')[0],
      artist: 'unknown artist',
      file : URL.createObjectURL(file)
    };
    tracks.push(track);
    addTrackToPlaylist(track);
  }
});

 function addTrackToPlaylist(track) {
  const li = document.createElement('li');
  li.textContent = track.title;
  li.addEventListener('click', ()=>{
    loadTrack(tracks.indexOf(track));
    playPauseBtn();
  });
  playlist.appendChild(li);
}


loadTrack(trackIndex);

tracks.forEach(addTrackToPlaylist);

playPauseBtn.addEventListener('click', playPauseTrack);
prevBtn.addEventListener('click', prevTrack);
nextBtn.addEventListener('click', nextTrack);