document.getElementById("year").textContent = String(new Date().getFullYear());

const header = document.querySelector(".site-header");
window.addEventListener(
  "scroll",
  () => {
    header.classList.toggle("scrolled", window.scrollY > 24);
  },
  { passive: true }
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = "running";
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".role, .project").forEach((el) => {
  el.style.animationPlayState = "paused";
  observer.observe(el);
});
