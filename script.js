document.getElementById("year").textContent = String(new Date().getFullYear());

const header = document.querySelector(".header");
const progress = document.getElementById("progress");

window.addEventListener(
  "scroll",
  () => {
    if (!progress || !header) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? Math.min((window.scrollY / max) * 100, 100) : 0}%`;
    header.classList.toggle("scrolled", window.scrollY > 12);
  },
  { passive: true }
);

/* SmartChat → WhatsApp / Call */
(function initSmartChat() {
  const WHATSAPP = "966592522700";
  const root = document.getElementById("smartchat");
  const panel = document.getElementById("smartchatPanel");
  const body = document.getElementById("smartchatBody");
  const quick = document.getElementById("smartchatQuick");
  const form = document.getElementById("smartchatForm");
  const input = document.getElementById("smartchatInput");
  const openBtn = document.getElementById("smartchatOpen");
  const closeBtn = document.getElementById("smartchatClose");
  const waDirect = document.getElementById("smartchatWaDirect");

  if (!root || !panel || !openBtn || !closeBtn || !body || !quick || !form || !input) {
    console.warn("SmartChat: missing DOM nodes");
    return;
  }

  let started = false;
  let topic = "General inquiry";

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function openChat() {
    root.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    if (!started) {
      started = true;
      boot();
    }
  }

  function closeChat() {
    root.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
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

  async function typing(ms = 650) {
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

  function waMessage(extra) {
    return `Hi Taha — I contacted you via your portfolio SmartChat.\nTopic: ${extra || topic}`;
  }

  function openWhatsApp(message) {
    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
    if (waDirect) waDirect.href = url;
    window.open(url, "_blank", "noopener");
  }

  async function boot() {
    body.innerHTML = "";
    await typing(450);
    addBot("Hi — I’m Taha’s SmartChat. I can connect you on WhatsApp or start a call. What do you need?");
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

    if (item.id === "menu") {
      started = true;
      await boot();
      return;
    }

    if (item.id === "whatsapp" || item.id === "go-wa" || item.id === "go-wa-final") {
      if (item.id === "whatsapp") topic = "General inquiry";
      addBot("Opening WhatsApp with your request ready for Taha.");
      openWhatsApp(waMessage());
      setChips([
        { id: "go-wa-final", label: "Open WhatsApp again" },
        { id: "go-call", label: "Call instead" },
        { id: "menu", label: "Back to menu" },
      ]);
      return;
    }

    if (item.id === "call" || item.id === "go-wa-call") {
      topic = "Call request";
      if (item.id === "go-wa-call") {
        addBot("Sending a call request on WhatsApp…");
        openWhatsApp("Hi Taha — I’d like to schedule a call via your portfolio SmartChat.");
      } else {
        addBot("You can call now, or request a call on WhatsApp.");
      }
      setChips([
        { id: "go-call", label: "Call now" },
        { id: "go-wa-call", label: "WhatsApp call request" },
        { id: "menu", label: "Back to menu" },
      ]);
      return;
    }

    if (item.id === "go-call") {
      window.location.href = "tel:+966592522700";
      addBot("Phone dialer opened. Prefer WhatsApp?");
      setChips([
        { id: "go-wa-call", label: "WhatsApp call request" },
        { id: "menu", label: "Back to menu" },
      ]);
      return;
    }

    const map = {
      hire: "Hiring / opportunity",
      consult: "Consulting / architecture",
      ai: "Cloud / AI project",
    };
    topic = map[item.id] || item.label;
    addBot(`Got it — “${topic}”. Continue on WhatsApp (recommended) or call directly.`);
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
    addBot("Thanks — I’ll open WhatsApp so Taha can reply personally.");
    setChips([
      { id: "go-wa-final", label: "Continue on WhatsApp" },
      { id: "go-call", label: "Call now" },
      { id: "menu", label: "Back to menu" },
    ]);
  }

  openBtn.addEventListener("click", (e) => {
    e.preventDefault();
    openChat();
  });

  closeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    closeChat();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    if (!root.classList.contains("is-open")) openChat();
    handleFreeText(text);
  });

  // Expose for debugging / manual open
  window.SmartChat = { open: openChat, close: closeChat };
})();
