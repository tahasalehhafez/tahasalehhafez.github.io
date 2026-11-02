document.getElementById("year").textContent = String(new Date().getFullYear());

const header = document.querySelector(".header");
const progress = document.getElementById("progress");

window.addEventListener(
  "scroll",
  () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? Math.min((window.scrollY / max) * 100, 100) : 0}%`;
    header.classList.toggle("scrolled", window.scrollY > 12);
  },
  { passive: true }
);

/* ——— SmartChat → WhatsApp / Call ——— */
(() => {
  const WHATSAPP = "966592522700";
  const PHONE = "+966592522700";

  const root = document.getElementById("smartchat");
  const panel = document.getElementById("smartchatPanel");
  const body = document.getElementById("smartchatBody");
  const quick = document.getElementById("smartchatQuick");
  const form = document.getElementById("smartchatForm");
  const input = document.getElementById("smartchatInput");
  const openBtn = document.getElementById("smartchatOpen");
  const closeBtn = document.getElementById("smartchatClose");

  if (!root || !panel) return;

  let started = false;
  let topic = "";

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function openChat() {
    panel.hidden = false;
    root.classList.add("is-open");
    if (!started) {
      started = true;
      boot();
    }
  }

  function closeChat() {
    panel.hidden = true;
    root.classList.remove("is-open");
  }

  function addBot(text) {
    const el = document.createElement("div");
    el.className = "sc-msg bot";
    el.textContent = text;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
  }

  function addUser(text) {
    const el = document.createElement("div");
    el.className = "sc-msg user";
    el.textContent = text;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
  }

  async function typing(ms = 700) {
    const el = document.createElement("div");
    el.className = "sc-typing";
    el.innerHTML = "<span></span><span></span><span></span>";
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
    await sleep(ms);
    el.remove();
  }

  function setChips(items) {
    quick.innerHTML = "";
    items.forEach((item) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "sc-chip";
      btn.textContent = item.label;
      btn.addEventListener("click", () => handleChoice(item));
      quick.appendChild(btn);
    });
  }

  function waUrl(message) {
    return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
  }

  function openWhatsApp(message) {
    window.open(waUrl(message), "_blank", "noopener");
  }

  async function boot() {
    await typing(500);
    addBot("Hi — I’m Taha’s SmartChat assistant. How can I help you today?");
    setChips([
      { id: "hire", label: "Hiring / opportunity" },
      { id: "consult", label: "Consulting / architecture" },
      { id: "ai", label: "Cloud / AI project" },
      { id: "call", label: "Request a call" },
      { id: "whatsapp", label: "Chat on WhatsApp" },
    ]);
  }

  async function handleChoice(item) {
    addUser(item.label);
    setChips([]);
    await typing();

    if (item.id === "whatsapp") {
      topic = "General inquiry";
      addBot("Perfect. I’ll open WhatsApp so you can message Taha directly.");
      setChips([
        { id: "go-wa", label: "Open WhatsApp now" },
        { id: "menu", label: "Back to menu" },
      ]);
      return;
    }

    if (item.id === "call") {
      topic = "Call request";
      addBot("You can call Taha now, or continue on WhatsApp with a call request.");
      setChips([
        { id: "go-call", label: "Call now" },
        { id: "go-wa-call", label: "Request call on WhatsApp" },
        { id: "menu", label: "Back to menu" },
      ]);
      return;
    }

    if (item.id === "go-wa" || item.id === "go-wa-call" || item.id === "go-wa-final") {
      const msg =
        item.id === "go-wa-call"
          ? "Hi Taha — I’d like to schedule a call via your portfolio SmartChat."
          : `Hi Taha — I contacted you via your portfolio SmartChat.\nTopic: ${topic || "General inquiry"}`;
      openWhatsApp(msg);
      addBot("WhatsApp is opening. If it didn’t, tap again below.");
      setChips([
        { id: "go-wa-final", label: "Open WhatsApp" },
        { id: "go-call", label: "Call instead" },
        { id: "menu", label: "Back to menu" },
      ]);
      return;
    }

    if (item.id === "go-call") {
      window.location.href = `tel:${PHONE}`;
      addBot("Dialer opened. Prefer WhatsApp instead?");
      setChips([
        { id: "go-wa-call", label: "WhatsApp call request" },
        { id: "menu", label: "Back to menu" },
      ]);
      return;
    }

    if (item.id === "menu") {
      await boot();
      return;
    }

    const map = {
      hire: "Hiring / opportunity",
      consult: "Consulting / architecture",
      ai: "Cloud / AI project",
    };
    topic = map[item.id] || item.label;

    addBot(
      `Got it — “${topic}”. I can connect you to Taha on WhatsApp with this context filled in, or start a call.`
    );
    setChips([
      { id: "go-wa-final", label: "Continue on WhatsApp" },
      { id: "go-call", label: "Call now" },
      { id: "menu", label: "Back to menu" },
    ]);
  }

  async function handleFreeText(text) {
    addUser(text);
    setChips([]);
    topic = text.slice(0, 120);
    await typing();
    addBot(
      "Thanks. I’ll take you to WhatsApp so Taha can reply personally — or you can call directly."
    );
    setChips([
      { id: "go-wa-final", label: "Continue on WhatsApp" },
      { id: "go-call", label: "Call now" },
      { id: "menu", label: "Back to menu" },
    ]);
  }

  openBtn.addEventListener("click", openChat);
  closeBtn.addEventListener("click", closeChat);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    handleFreeText(text);
  });

  // Auto-nudge once after a short delay
  setTimeout(() => {
    if (!started && !root.classList.contains("is-open")) {
      openBtn.classList.add("nudge");
    }
  }, 6000);
})();
