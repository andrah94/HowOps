const menuButton = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector("#mobile-nav");
function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open menu");
  mobileNav.hidden = true;
}
menuButton.addEventListener("click", () => {
  const opening = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(opening));
  menuButton.setAttribute("aria-label", opening ? "Close menu" : "Open menu");
  mobileNav.hidden = !opening;
});
mobileNav.addEventListener("click", event => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !mobileNav.hidden) {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener("click", event => {
  if (!mobileNav.hidden && !event.target.closest(".site-header")) closeMenu();
});
window.matchMedia("(min-width: 901px)").addEventListener("change", event => {
  if (event.matches) closeMenu();
});
document.querySelector("#year").textContent = new Date().getFullYear();

const story = document.querySelector(".story");
const stage = document.querySelector(".story-stage");
const panels = [...document.querySelectorAll(".story-panel")];
const anchors = ["#friction", "#services", "#flow"].map(selector => document.querySelector(selector));
const progressLinks = [...document.querySelectorAll(".progress-labels a")];
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const compactPreference = window.matchMedia("(max-width: 900px) and (max-height: 640px)");
const poster = document.querySelector(".visual-poster");
const brandStill = document.querySelector(".visual-brand-still");
const grid = document.querySelector(".system-grid");
const svg = document.querySelector(".system-svg");
const path = document.querySelector(".system-line");
const fragments = [...document.querySelectorAll(".system-fragment")];
const nodes = [...document.querySelectorAll(".system-node")];
const labels = [...document.querySelectorAll(".system-label")];
const arrow = document.querySelector(".system-arrow");
const traveler = document.querySelector(".system-traveler");
const outcome = document.querySelector(".outcome-number");
const progressFill = document.querySelector(".progress-fill");
const blueprintList = document.querySelector(".blueprint-list");
const blueprintRail = document.querySelector(".blueprint-rail span");
const blueprintRows = [...document.querySelectorAll(".blueprint-row")];
const motionButton = document.querySelector(".motion-toggle");
const video = document.querySelector("#hero-video");
const pathLength = path.getTotalLength();
path.style.strokeDasharray = String(pathLength);
path.style.strokeDashoffset = String(pathLength);
const colors = [[241, 221, 164], [247, 243, 235], [223, 230, 233], [36, 74, 191]];
const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
let scheduled = false;
let autoPlayed = false;

function interpolateColor(position) {
  const scaled = position < .8 ? Math.min(2, position * 3) : 2 + clamp((position - .8) / .034);
  const left = Math.min(2, Math.floor(scaled));
  const mix = clamp(scaled - left);
  return `rgb(${colors[left].map((value, index) => Math.round(value + (colors[left + 1][index] - value) * mix)).join(",")})`;
}

function resetVideo() {
  video.pause();
  video.style.opacity = "0";
  motionButton.innerHTML = 'REPLAY BRAND FILM <span aria-hidden="true">▶</span>';
  motionButton.setAttribute("aria-label", "Replay the HowOps brand film");
}

function updateBlueprint() {
  if (motionPreference.matches) {
    blueprintRail.style.height = "100%";
    blueprintRows.forEach(row => row.classList.add("is-past"));
    return;
  }
  const marker = window.innerHeight * .68;
  const bounds = blueprintList.getBoundingClientRect();
  blueprintRail.style.height = `${clamp((marker - bounds.top) / bounds.height) * 100}%`;
  blueprintRows.forEach(row => row.classList.toggle("is-past", row.getBoundingClientRect().top < marker));
}
video.addEventListener("playing", () => {
  video.style.opacity = "1";
  motionButton.innerHTML = 'PAUSE BRAND FILM <span aria-hidden="true">Ⅱ</span>';
  motionButton.setAttribute("aria-label", "Pause the HowOps brand film");
});
video.addEventListener("ended", resetVideo);
video.addEventListener("error", resetVideo);
motionButton.addEventListener("click", async () => {
  if (!video.paused) {
    resetVideo();
    return;
  }
  video.currentTime = 0;
  try { await video.play(); } catch { resetVideo(); }
});

function updateStory() {
  scheduled = false;
  updateBlueprint();
  if (!story.classList.contains("is-enhanced")) return;

  const top = story.getBoundingClientRect().top + window.scrollY;
  const travel = Math.max(1, story.offsetHeight - stage.offsetHeight);
  const progress = clamp((window.scrollY - top) / travel);
  const phase = progress * 3;
  const base = Math.min(2, Math.floor(phase));
  const outgoing = 1 - clamp((phase - base - .4) / .1);
  const incoming = clamp((phase - base - .5) / .1);
  const opacities = [0, 0, 0, 0];
  if (phase >= 3) opacities[3] = 1;
  else {
    opacities[base] = outgoing;
    opacities[base + 1] = incoming;
  }
  const active = Math.min(3, Math.floor(phase + .5));

  stage.dataset.beat = String(active);
  stage.style.backgroundColor = interpolateColor(progress);
  panels.forEach((panel, index) => {
    const opacity = opacities[index];
    panel.style.opacity = String(opacity);
    panel.style.transform = `translateY(${(index - phase) * (1 - opacity) * 34}px)`;
    panel.classList.toggle("is-current", index === active);
    panel.inert = index !== active;
    if (index === active) panel.removeAttribute("aria-hidden");
    else panel.setAttribute("aria-hidden", "true");
    panel.querySelectorAll("a,button").forEach(control => {
      if (index === active) control.removeAttribute("tabindex");
      else control.tabIndex = -1;
    });
  });
  progressLinks.forEach((link, index) => {
    if (index === active) link.setAttribute("aria-current", "step");
    else link.removeAttribute("aria-current");
  });

  brandStill.style.opacity = String(clamp(1 - progress * 5));
  brandStill.style.transform = `translateX(${-progress * 7}%) scale(${1 + progress * .08})`;
  poster.style.opacity = String(clamp((progress - .1) / .12) * clamp((.45 - progress) / .2));
  poster.style.transform = `translateX(${-progress * 8}%) scale(${1 + progress * .15})`;
  if (!video.paused) video.style.opacity = String(clamp((.28 - progress) / .12));
  grid.style.opacity = String(clamp((progress - .24) / .22) * .75);
  grid.style.transform = `translateX(${(1 - progress) * 55}px)`;
  svg.style.opacity = String(clamp((progress - .1) / .18));
  svg.style.transform = window.innerWidth <= 720
    ? `translateY(${(1 - progress) * 16}px) scale(${.96 + progress * .07})`
    : `translateX(${(1 - progress) * 7}%) scale(${.92 + progress * .1})`;
  path.style.strokeDashoffset = String(pathLength * (1 - progress));
  const fragmentOpacity = clamp(1 - Math.abs(progress - .34) / .19);
  fragments.forEach((fragment, index) => {
    fragment.style.opacity = String(fragmentOpacity * (.82 - index * .08));
    fragment.style.transform = `translate(${(1 - fragmentOpacity) * (index % 2 ? -24 : 22)}px,${(1 - fragmentOpacity) * (index - 1) * 16}px)`;
  });
  const built = clamp((progress - .47) / .22);
  nodes.forEach((node, index) => {
    node.style.opacity = String(clamp(built * 3 - index * .65));
  });
  labels.forEach((label, index) => {
    label.style.opacity = String(clamp(built * 3 - index * .7));
  });
  arrow.style.opacity = String(clamp((progress - .78) / .17));
  outcome.style.opacity = String(clamp((progress - .82) / .17));
  traveler.style.opacity = progress > .13 ? "1" : "0";
  const point = path.getPointAtLength(pathLength * progress);
  traveler.setAttribute("transform", `translate(${point.x} ${point.y})`);
  progressFill.style.width = `${progress * 100}%`;

  const motionOpacity = progress < .25 ? 1 : clamp((.32 - progress) / .07);
  motionButton.style.opacity = String(motionOpacity);
  motionButton.style.pointerEvents = motionOpacity > .5 ? "auto" : "none";
  motionButton.tabIndex = motionOpacity > .5 ? 0 : -1;
  motionButton.inert = motionOpacity <= .5;
  if (progress > .25 && !video.paused) resetVideo();
  if (progress < .15 && !autoPlayed && document.visibilityState === "visible") {
    autoPlayed = true;
    video.play().catch(resetVideo);
  }
}

function scheduleStoryUpdate() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(updateStory);
}
function updateEnhancement() {
  const enhance = !motionPreference.matches && !compactPreference.matches;
  story.classList.toggle("is-enhanced", enhance);
  if (enhance) {
    story.prepend(...anchors);
  } else {
    anchors.forEach((anchor, index) => panels[index + 1].prepend(anchor));
    resetVideo();
    stage.style.backgroundColor = "";
    stage.dataset.beat = "0";
    panels.forEach(panel => {
      panel.style.opacity = "";
      panel.style.transform = "";
      panel.classList.remove("is-current");
      panel.inert = false;
      panel.removeAttribute("aria-hidden");
      panel.querySelectorAll("a,button").forEach(control => control.removeAttribute("tabindex"));
    });
    progressLinks.forEach(link => link.removeAttribute("aria-current"));
  }
  scheduleStoryUpdate();
}
window.addEventListener("scroll", scheduleStoryUpdate, { passive: true });
window.addEventListener("resize", scheduleStoryUpdate);
motionPreference.addEventListener("change", updateEnhancement);
compactPreference.addEventListener("change", updateEnhancement);
updateEnhancement();

const audio = document.querySelector("#howops-audio");
const audioButton = document.querySelector(".audio-button");
const audioIcon = document.querySelector(".audio-icon");
const audioTime = document.querySelector(".audio-time");
const audioProgress = document.querySelector(".audio-progress > span");
function updateAudio() {
  const duration = Number.isFinite(audio.duration) ? audio.duration : 22;
  const remaining = Math.max(0, Math.ceil(duration - audio.currentTime));
  audioTime.textContent = `0:${String(remaining).padStart(2, "0")}`;
  audioProgress.style.width = `${Math.min(100, (audio.currentTime / duration) * 100)}%`;
  const playing = !audio.paused;
  audioIcon.textContent = playing ? "Ⅱ" : "▶";
  audioButton.setAttribute("aria-label", `${playing ? "Pause" : "Play"} the 22-second HowOps introduction`);
}
audioButton.addEventListener("click", async () => {
  if (audio.paused) {
    try { await audio.play(); } catch { return; }
  } else {
    audio.pause();
  }
  updateAudio();
});
audio.addEventListener("timeupdate", updateAudio);
audio.addEventListener("play", updateAudio);
audio.addEventListener("pause", updateAudio);
audio.addEventListener("ended", () => {
  audio.currentTime = 0;
  updateAudio();
});
