const SKIP_SECS = 2;
const SKIP_SECS_2 = 5;
const CLICK_THRESHOLD = 3;
const TIMEOUT = 1000;

let timeId;
let clickCounter = 0;

const player = window.jwplayer("player");

const playPause = () => {
  ["idle", "paused"].includes(player.getState())
    ? player.play()
    : player.pause();
  playPauseBtnToggle();
};

const forward = () => addClick(1);

const backward = () => addClick(-1);

const mute = () => {
  player.setMute(!player.getMute());
  muteBtnToggle();
};

const addClick = (val) => {
  clearTimeout(timeId);

  if ((val < 0 && clickCounter > 0) || (val > 0 && clickCounter < 0)) {
    clickCounter = 0;
  }

  clickCounter += val;

  const skipSecs = getSkipSecs();
  log();
  timeId = setTimeout(() => {
    if (player.getState() === "playing") {
      let nextPosition = player.getPosition() + skipSecs;
      nextPosition =
        nextPosition < 0
          ? 0
          : nextPosition <= player.getDuration()
          ? nextPosition
          : player.getDuration();
      player.seek(nextPosition);
    }
    clickCounter = 0;
    clearTimeout(timeId);
    log();
  }, TIMEOUT);
};

const overlayToggle = () => {
  const overlay = document.querySelector("#player-overlay");
  overlay.classList.toggle("hide");
  overlay.classList.toggle("show");
};

const playPauseBtnToggle = () =>
  (document.querySelector("#btn-play-pause").innerHTML =
    player.getState() === "playing" ? "pause" : "play");

const muteBtnToggle = () =>
  (document.querySelector("#btn-mute").innerHTML = player.getMute()
    ? "Unmute"
    : "Mute");

const log = () => {
  document.querySelector("#log").innerHTML = `num of click ${Math.abs(
    clickCounter
  )} = ${getSkipSecs()} secs`;
};

const getSkipSecs = () =>
  clickCounter <= CLICK_THRESHOLD
    ? clickCounter * SKIP_SECS
    : CLICK_THRESHOLD * SKIP_SECS +
      (clickCounter - CLICK_THRESHOLD) * SKIP_SECS_2;

player.setup({
  key: "NF6I9WplglKLUySaKLeWqh0vyfXEvVgfladasLjD6L7KuxY4",
  width: "250px",
  controls: false,
  mute: true,
  playlist: [
    {
      file:
        "https://cdn1.fireworktv.com/medias/2021/3/15/1615804009-aubeyhid/watermarked/540/reel%2012.mp4"
    }
  ]
});

player.on("ready", () => {
  muteBtnToggle();
  overlayToggle();
});

player.on("play", playPauseBtnToggle);

player.on("pause", playPauseBtnToggle);

player.on("complete", () => {
  log();
  playPauseBtnToggle();
});

document.querySelector("#btn-play-pause").addEventListener("click", playPause);
document.querySelector("#btn-forward").addEventListener("click", forward);
document.querySelector("#btn-backward").addEventListener("click", backward);
document.querySelector("#btn-mute").addEventListener("click", mute);
