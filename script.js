let currentSong = new Audio();
let songs;
const btn = document.querySelector(".play-btn");

async function getSong() {
  let a = await fetch(`../music/`);
  let res = await a.text();
  let div = document.createElement("div");
  div.innerHTML = res;
  let as = div.getElementsByTagName("a");
  let song = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      song.push(element.href);
    }
  }
  return song;
}
const playMusic = (track, muted = false) => {
  currentSong.src = "music/" + track;
  if (!muted) {
    currentSong.play();
    play.src = "pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(
    track.replace(".mp3", "")
  );
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function main() {
  //get all songs
  songs = await getSong();
  console.log(songs);
  //show all songs in playlist
  let songlist = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
  console.log(songlist);
  for (const song of songs) {
    let songname = song.split("/music/")[1];
    songname = songname.replaceAll("%20", " ").replace(".mp3", "");
    songlist.innerHTML =
      songlist.innerHTML +
      `<li>
                <img src="music.svg" alt="music" />
                <div class="info">
                  <div>${songname}</div>
                  <div>Atharv Shukla</div>
                </div>
                <div class="playnow">
                  <span>Play Now</span>
                  <img src="play.svg" alt="play" class="invert" />
                </div>
              </li>`;
    // console.log(songname);
  }

  let daf =
    document
      .querySelector(".songlist")
      .getElementsByTagName("li")[0]
      .querySelector(".info").children[0].innerHTML + ".mp3";
  playMusic(daf, true);

  //atach an event listner to each song
  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", () => {
      let a = e.querySelector(".info").children[0].innerHTML + ".mp3";
      console.log(a);
      playMusic(a);
    });
  });

  //atach an event listner to play prev next
  play.addEventListener("click", () => {
    console.log("play Clicked");
    if (currentSong.paused) {
      currentSong.play();
      play.src = "pause.svg";
    } else {
      currentSong.pause();
      play.src = "play.svg";
    }
  });
  //time upadate event
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${formatTime(
      currentSong.currentTime
    )} / ${formatTime(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  //seekbarv functionality
  let seekbar = document.querySelector(".seekbar");
  seekbar.addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  //event listner for hamburger
  let hamburger = document.querySelector(".ham");
  hamburger.addEventListener("click", () => {
    document.querySelector(".left").style.left = "0%";
  });
  document.querySelector(".cross").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
  });

  //previous next functions
  let prev = document.querySelector("#prev");
  prev.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src);
      console.log("Previous Clikced");
    if (index - 1 >= 0) {
      playMusic(songs[index - 1].split("/music/")[1]);
    } else {
      console.log("Access denied");
    }
  });

  let next = document.querySelector("#next");
  next.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src);
    console.log("Next denied");
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1].split("/music/")[1]);
    } else {
      console.log("Access denied");
    }
  });

  //volume control
  let volume = document.querySelector("#volume");
  volume.addEventListener("input", (e) => {
    currentSong.volume = parseInt(e.target.value) / 100;
    console.log("Setting volume to " + e.target.value,"/100");
  });
}
main();

function formatTime(decimalSeconds) {
  const totalSeconds = Math.floor(decimalSeconds); // Convert decimal seconds to whole seconds
  const minutes = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  let formattedMinutes = minutes.toString().padStart(2, "0");
  let formattedSeconds = secs.toString().padStart(2, "0");
  if (isNaN(formattedMinutes)) {
    formattedMinutes = "00";
  }
  if (isNaN(formattedSeconds)) {
    formattedSeconds = "00";
  }
  return `${formattedMinutes}:${formattedSeconds}`;
}
