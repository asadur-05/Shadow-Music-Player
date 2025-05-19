alert("Spotify Clone-Web Music Player.This is a Project, Thank You♥");

const cardContainer = document.querySelector(".cardContainer");
const songListUl = document.querySelector(".songList ul");

let albums = [];
let songs = [];
let currFolder = "";
let currentIndex = 0;
let currentSong = new Audio();

async function loadAlbums() {
  try {
    const res = await fetch('albums.json');  // Make sure this file is in your project root or correct path
    if (!res.ok) throw new Error("Failed to load albums.json");
    albums = await res.json();

    cardContainer.innerHTML = "";
    albums.forEach((album, index) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.dataset.index = index;
      card.innerHTML = `
        <img src="${album.cover}" alt="${album.title} Cover" />
        <h2>${album.title}</h2>
        <p>${album.description}</p>
      `;
      card.addEventListener('click', () => {
        loadSongs(index);
        updateAlbumInfo(index);
      });
      cardContainer.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading albums:', error);
  }
}

function loadSongs(albumIndex) {
  const album = albums[albumIndex];
  if (!album) return;
  songs = album.songs;
  currFolder = album.folder;
  currentIndex = 0;

  songListUl.innerHTML = "";
  songs.forEach((song, i) => {
    const li = document.createElement("li");
    li.textContent = song;
    li.addEventListener("click", () => playMusic(i));
    songListUl.appendChild(li);
  });
  playMusic(0);
}

function playMusic(index) {
  if (index < 0 || index >= songs.length) return;
  currentIndex = index;
  currentSong.src = `/${currFolder}/${songs[currentIndex]}`;
  currentSong.play();
  document.querySelector(".songinfo").textContent = songs[currentIndex];
  updatePlayPauseIcon(true);
}

// Update album info section on right side
function updateAlbumInfo(index) {
  const album = albums[index];
  if (!album) return;
  document.querySelector(".album-title").textContent = album.title;
  document.querySelector(".album-description").textContent = album.description;
}

function updatePlayPauseIcon(isPlaying) {
  const playBtn = document.getElementById("play");
  if (!playBtn) return;
  playBtn.src = isPlaying ? "img/pause.svg" : "img/play.svg";
}

// Play/pause button handler
document.getElementById("play").addEventListener("click", () => {
  if (currentSong.paused) {
    currentSong.play();
    updatePlayPauseIcon(true);
  } else {
    currentSong.pause();
    updatePlayPauseIcon(false);
  }
});

// Previous button handler
document.getElementById("previous").addEventListener("click", () => {
  if (currentIndex > 0) {
    playMusic(currentIndex - 1);
  }
});

// Next button handler
document.getElementById("next").addEventListener("click", () => {
  if (currentIndex < songs.length - 1) {
    playMusic(currentIndex + 1);
  }
});

// Auto play next song when current song ends
currentSong.addEventListener("ended", () => {
  if (currentIndex < songs.length - 1) {
    playMusic(currentIndex + 1);
  }
  // else {
  //   playMusic(0); // Uncomment to loop playlist after last song
  // }
});

// Update song time display and seekbar
const songTimeDisplay = document.querySelector(".songtime");
const seekbar = document.querySelector(".seekbar");
const circle = document.querySelector(".circle");

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

currentSong.addEventListener("timeupdate", () => {
  if (!isNaN(currentSong.duration)) {
    songTimeDisplay.textContent = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
    circle.style.left = `${(currentSong.currentTime / currentSong.duration) * 100}%`;
  }
});

seekbar.addEventListener("click", (e) => {
  const rect = seekbar.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  currentSong.currentTime = currentSong.duration * percent;
});

// Volume control
const volumeIcon = document.getElementById("volume");
const volumeRange = document.querySelector(".range input");

volumeRange.addEventListener("input", (e) => {
  currentSong.volume = e.target.value / 100;
  if (currentSong.volume > 0) {
    volumeIcon.src = volumeIcon.src.replace("mute.svg", "volume.svg");
  } else {
    volumeIcon.src = volumeIcon.src.replace("volume.svg", "mute.svg");
  }
});

volumeIcon.addEventListener("click", () => {
  if (volumeIcon.src.includes("volume.svg")) {
    volumeIcon.src = volumeIcon.src.replace("volume.svg", "mute.svg");
    currentSong.volume = 0;
    volumeRange.value = 0;
  } else {
    volumeIcon.src = volumeIcon.src.replace("mute.svg", "volume.svg");
    currentSong.volume = 0.1;
    volumeRange.value = 10;
  }
});

// Hamburger menu toggle
const hamburger = document.querySelector(".hamburger");
const leftContainer = document.querySelector(".left");
const closeBtn = document.querySelector(".close");

hamburger.addEventListener("click", () => {
  leftContainer.classList.add("active");
});

closeBtn.addEventListener("click", () => {
  leftContainer.classList.remove("active");
});

// Load albums on window load
window.onload = () => {
  loadAlbums();
};
