function toggleVideo() {
  const video = document.getElementById("wildlife-video");
  const btn = document.getElementById("toggle-btn");

  if (video.paused) {
    video.play();
    btn.textContent = "Hide Video";
    btn.setAttribute("aria-pressed", "true");
  } else {
    video.pause();
    video.currentTime = 0;
    btn.textContent = "Play Video";
    btn.setAttribute("aria-pressed", "false");
  }
}
