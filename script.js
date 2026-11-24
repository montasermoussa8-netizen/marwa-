// =========================================================
// 1. عداد الوقت المباشر من 11/8/2025
// (في الجافاسكريبت شهر نوفمبر رقمه 10 لأن الشهور بتبدأ من 0)
// =========================================================
const START_DATE = new Date(2025, 10, 8, 0, 0, 0);

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

const lastValues = { days: "", hours: "", minutes: "", seconds: "" };

function updateWithAnimation(element, newValue, key) {
  if (lastValues[key] !== newValue) {
    element.textContent = newValue;
    element.classList.remove("tick-animate");
    void element.offsetWidth;
    element.classList.add("tick-animate");
    lastValues[key] = newValue;
  }
}

function updateCounter() {
  const now = new Date();
  let diff = now.getTime() - START_DATE.getTime();
  if (diff < 0) diff = 0;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  updateWithAnimation(daysEl, String(days), "days");
  updateWithAnimation(hoursEl, String(hours).padStart(2, "0"), "hours");
  updateWithAnimation(minutesEl, String(minutes).padStart(2, "0"), "minutes");
  updateWithAnimation(secondsEl, String(seconds).padStart(2, "0"), "seconds");
}

updateCounter();
setInterval(updateCounter, 1000);

// =========================================================
// 2. تأثير القلوب والورد الطايرة (تُحذف تلقائياً بعد 4.5 ثانية)
// =========================================================
const floatingContainer = document.getElementById("floating-container");
const defaultEmojis = ["❤️", "💖", "✨", "🌹"];

function spawnFloatingHearts(count = 1, emojis = defaultEmojis) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const item = document.createElement("span");
      item.className = "floating-item";
      item.textContent = emojis[Math.floor(Math.random() * emojis.length)];

      const leftPos = Math.random() * 92 + 4;
      const fontSize = Math.random() * 14 + 18;
      const drift = (Math.random() - 0.5) * 80;
      const rotation = (Math.random() - 0.5) * 50;

      item.style.left = `${leftPos}vw`;
      item.style.fontSize = `${fontSize}px`;
      item.style.setProperty("--drift", `${drift}px`);
      item.style.setProperty("--rot", `${rotation}deg`);

      floatingContainer.appendChild(item);

      setTimeout(() => {
        item.remove();
      }, 4500);
    }, i * 105);
  }
}

// قلوب وورد مستمرة بشكل سلس في خلفية الموقع
setInterval(() => {
  if (!document.hidden) {
    spawnFloatingHearts(1, ["❤️", "🌹", "💖", "✨"]);
  }
}, 900);

// انفجار قلوب وورد من نفس مكان الكارت عند الضغط عليه
function spawnCardBurst(element) {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const burstIcons = ["❤️", "🌹", "💖", "🌸", "✨"];

  for (let i = 0; i < 14; i++) {
    const p = document.createElement("span");
    p.className = "burst-particle";
    p.textContent = burstIcons[Math.floor(Math.random() * burstIcons.length)];

    const angle = (Math.PI * 2 * i) / 14 + (Math.random() - 0.5) * 0.4;
    const distance = 65 + Math.random() * 85;
    const bx = Math.cos(angle) * distance;
    const by = Math.sin(angle) * distance - 35;
    const brot = (Math.random() - 0.5) * 90;

    p.style.left = `${centerX}px`;
    p.style.top = `${centerY}px`;
    p.style.setProperty("--bx", `${bx}px`);
    p.style.setProperty("--by", `${by}px`);
    p.style.setProperty("--brot", `${brot}deg`);

    document.body.appendChild(p);

    setTimeout(() => {
      p.remove();
    }, 1400);
  }
}

// =========================================================
// 3. صندوق الرسائل (الرسالتين فقط بالتبديل بدون تكرار)
// =========================================================
const sweetMessages = [
  "مهما اتكلمت مش هعرف أوصف قد إيه بحبك ❤️",
  "ضحكتك لوحدها كفيلة تظبط يومي كله ❤️"
];

const messageBox = document.getElementById("message-box");
const messageEl = document.getElementById("love-message");
const messageBtn = document.getElementById("message-btn");
let currentMsgIndex = -1;

messageBtn.addEventListener("click", () => {
  currentMsgIndex = currentMsgIndex === 0 ? 1 : 0;

  messageEl.classList.remove("fade-swap");
  void messageEl.offsetWidth;
  messageEl.textContent = sweetMessages[currentMsgIndex];
  messageEl.classList.add("fade-swap");
  messageBox.classList.add("highlight");

  spawnFloatingHearts(8);
});

// =========================================================
// 4. كروت الصور الـ 4 + التعرف التلقائي على صيغة الصورة (jpg / png / jpeg)
// =========================================================
document.querySelectorAll(".photo-frame img").forEach((img) => {
  const currentSrc = img.getAttribute("src");
  const currentExt = currentSrc.split(".").pop();
  const baseName = currentSrc.replace(/\.[^.]+$/, "");
  const exts = ["jpg", "png", "jpeg", "webp", "JPG", "PNG", "JPEG"].filter(
    (ext) => ext !== currentExt
  );
  let attempt = 0;

  const tryNext = () => {
    if (attempt < exts.length) {
      img.src = `${baseName}.${exts[attempt++]}`;
    } else {
      img.closest(".photo-frame").classList.add("is-missing");
    }
  };

  img.addEventListener("error", tryNext);
  if (img.complete && img.naturalWidth === 0) {
    tryNext();
  }
});

document.querySelectorAll(".flip-card").forEach((card) => {
  const toggleCard = () => {
    card.classList.toggle("flipped");
    spawnCardBurst(card);
    spawnFloatingHearts(8, ["❤️", "🌹", "💖", "🌸"]);
  };

  card.addEventListener("click", toggleCard);
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleCard();
    }
  });
});

// =========================================================
// 5. أنيميشن الورد والقلوب الصاعدة على أطراف صناديق التواريخ
// =========================================================
const edgeBoxes = document.querySelectorAll('[data-edge-fx="true"] .edge-particles');
const edgeIcons = ["🌹", "❤️", "💖", "🌸"];

function spawnEdgeParticle(container) {
  if (document.hidden) return;

  const particle = document.createElement("span");
  particle.className = "edge-particle";
  particle.textContent = edgeIcons[Math.floor(Math.random() * edgeIcons.length)];

  const side = Math.random() < 0.5 ? "left" : "right";
  const offset = Math.random() * 10 - 6;
  const startBottom = Math.random() * 35;
  const drift = (Math.random() - 0.5) * 16;
  const rot = (Math.random() - 0.5) * 28;

  particle.style[side] = `${offset}px`;
  particle.style.bottom = `${startBottom}%`;
  particle.style.setProperty("--edge-drift", `${drift}px`);
  particle.style.setProperty("--edge-rot", `${rot}deg`);

  container.appendChild(particle);

  setTimeout(() => {
    particle.remove();
  }, 3200);
}

edgeBoxes.forEach((box) => {
  setInterval(() => {
    spawnEdgeParticle(box);
  }, 600);
});

// =========================================================
// 6. نافذة الظرف السري (Modal)
// =========================================================
const secretBtn = document.getElementById("secret-btn");
const secretModal = document.getElementById("secret-modal");
const closeModalBtn = document.getElementById("close-modal");

function openModal() {
  secretModal.classList.add("active");
  secretModal.setAttribute("aria-hidden", "false");
  spawnFloatingHearts(12);
}

function closeModal() {
  secretModal.classList.remove("active");
  secretModal.setAttribute("aria-hidden", "true");
}

secretBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);

secretModal.addEventListener("click", (e) => {
  if (e.target === secretModal) {
    closeModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && secretModal.classList.contains("active")) {
    closeModal();
  }
});