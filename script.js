/* ── Custom Player ── */
const video       = document.getElementById("wildlife-video");
const playOverlay = document.getElementById("play-overlay");
const playBtn     = document.getElementById("play-btn");
const muteBtn     = document.getElementById("mute-btn");
const fsBtn       = document.getElementById("fs-btn");
const volSlider   = document.getElementById("volume-slider");
const progressWrap= document.getElementById("progress-wrap");
const progressFill= document.getElementById("progress-fill");
const progressThumb= document.getElementById("progress-thumb");
const timeDisplay = document.getElementById("time-display");
const player      = document.getElementById("player");

/* — helpers — */
function fmt(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

function syncPlayUI(playing) {
  playBtn.querySelector(".icon-play").style.display  = playing ? "none"  : "";
  playBtn.querySelector(".icon-pause").style.display = playing ? ""      : "none";
  playBtn.setAttribute("aria-label", playing ? "Pause" : "Play");
  playOverlay.classList.toggle("hidden", playing);
}

/* — ensure media is loaded before any interaction — */
video.load();

/* — play / pause — */
function togglePlay() {
  if (video.readyState < 2) return; // not enough data yet
  video.paused ? video.play() : video.pause();
}

video.addEventListener("play",  () => syncPlayUI(true));
video.addEventListener("pause", () => syncPlayUI(false));
video.addEventListener("ended", () => syncPlayUI(false));

playOverlay.addEventListener("click", togglePlay);
playBtn.addEventListener("click",     togglePlay);

/* Click on video itself toggles too */
video.addEventListener("click", togglePlay);

/* — progress — */
video.addEventListener("timeupdate", () => {
  if (!video.duration || isNaN(video.duration)) return;
  const pct = (video.currentTime / video.duration) * 100;
  progressFill.style.width        = pct + "%";
  progressThumb.style.left        = pct + "%";
  progressWrap.setAttribute("aria-valuenow", Math.round(pct));
  timeDisplay.textContent = `${fmt(video.currentTime)} / ${fmt(video.duration)}`;
});

video.addEventListener("loadedmetadata", () => {
  timeDisplay.textContent = `0:00 / ${fmt(video.duration)}`;
});

progressWrap.addEventListener("click", (e) => {
  if (!video.duration || isNaN(video.duration)) return;
  const rect = progressWrap.getBoundingClientRect();
  const pct  = (e.clientX - rect.left) / rect.width;
  video.currentTime = pct * video.duration;
});

/* — volume — */
volSlider.addEventListener("input", () => {
  video.volume = volSlider.value;
  video.muted  = video.volume === 0;
  syncMuteUI();
});

function syncMuteUI() {
  const muted = video.muted || video.volume === 0;
  muteBtn.querySelector(".icon-vol").style.display  = muted ? "none" : "";
  muteBtn.querySelector(".icon-mute").style.display = muted ? ""     : "none";
  muteBtn.setAttribute("aria-label", muted ? "Unmute" : "Mute");
}

muteBtn.addEventListener("click", () => {
  video.muted = !video.muted;
  if (!video.muted && video.volume === 0) { video.volume = 0.5; volSlider.value = 0.5; }
  syncMuteUI();
});

/* — fullscreen — */
fsBtn.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    player.requestFullscreen?.();
  } else {
    document.exitFullscreen?.();
  }
});

/* ── Side-panel toggle button ── */
const toggleBtn  = document.getElementById("toggle-btn");
const btnIcon    = toggleBtn.querySelector(".btn-icon");
const btnLabel   = toggleBtn.querySelector(".btn-label");

toggleBtn.addEventListener("click", () => {
  if (video.paused) {
    video.play();
    btnIcon.textContent  = "■";
    btnLabel.textContent = "Hide";
    toggleBtn.setAttribute("aria-pressed", "true");
  } else {
    video.pause();
    video.currentTime    = 0;
    btnIcon.textContent  = "▶";
    btnLabel.textContent = "Play";
    toggleBtn.setAttribute("aria-pressed", "false");
  }
});

/* Keep side button label in sync when player controls are used */
video.addEventListener("play",  () => {
  btnIcon.textContent  = "■";
  btnLabel.textContent = "Hide";
  toggleBtn.setAttribute("aria-pressed", "true");
});
video.addEventListener("pause", () => {
  btnIcon.textContent  = "▶";
  btnLabel.textContent = "Play";
  toggleBtn.setAttribute("aria-pressed", "false");
});