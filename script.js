
const pages = {
  home: document.getElementById("homePage"),
  boost: document.getElementById("boostPage"),
  games: document.getElementById("gamesPage"),
  tips: document.getElementById("tipsPage"),
  device: document.getElementById("devicePage"),
  settings: document.getElementById("settingsPage")
};

const toast = document.getElementById("toast");
let toastTimer;
let deferredInstallPrompt = null;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
}

function vibrate() {
  if (document.getElementById("vibrationToggle")?.checked &&
      "vibrate" in navigator) {
    navigator.vibrate(15);
  }
}

function navigate(pageName) {
  if (!pages[pageName]) return;

  Object.values(pages).forEach(page => page.classList.remove("active"));
  pages[pageName].classList.add("active");

  document.querySelectorAll(".nav-item").forEach(item => {
    item.classList.toggle("active", item.dataset.page === pageName);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
  vibrate();
}

document.querySelectorAll("[data-page]").forEach(button => {
  button.addEventListener("click", () => {
    navigate(button.dataset.page);
  });
});

document.getElementById("settingsShortcut").addEventListener("click", () => {
  navigate("settings");
});


// GAME BOOST CHECKLIST
const checkboxes = document.querySelectorAll("#boostChecklist input");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

function updateChecklist() {
  const total = checkboxes.length;
  const checked = [...checkboxes].filter(input => input.checked).length;
  const percent = total ? (checked / total) * 100 : 0;

  progressBar.style.width = percent + "%";
  progressText.textContent = `${checked}/${total} itens concluídos`;

  localStorage.setItem("fpsBoostChecklist", JSON.stringify(
    [...checkboxes].map(input => input.checked)
  ));

  if (checked === total && total > 0) {
    showToast("Checklist concluído! Boa partida 🎮");
  }
}

function loadChecklist() {
  try {
    const saved = JSON.parse(localStorage.getItem("fpsBoostChecklist") || "[]");

    checkboxes.forEach((input, index) => {
      input.checked = !!saved[index];
    });
  } catch {
    checkboxes.forEach(input => input.checked = false);
  }

  updateChecklist();
}

checkboxes.forEach(input => {
  input.addEventListener("change", () => {
    updateChecklist();
    vibrate();
  });
});

document.getElementById("resetChecklist").addEventListener("click", () => {
  checkboxes.forEach(input => input.checked = false);
  updateChecklist();
  showToast("Checklist resetado.");
  vibrate();
});

loadChecklist();


// GAME LIBRARY
const gameSearch = document.getElementById("gameSearch");
const gameCards = document.querySelectorAll(".game-card");

gameSearch.addEventListener("input", () => {
  const query = gameSearch.value.trim().toLowerCase();

  gameCards.forEach(card => {
    const name = card.dataset.game.toLowerCase();
    card.style.display = name.includes(query) ? "flex" : "none";
  });
});

const gameProfiles = {
  "Free Fire": [
    {
      title: "Gráficos",
      text: "Experimente gráficos suaves e reduza efeitos visuais se seu aparelho estiver apresentando quedas."
    },
    {
      title: "FPS",
      text: "Use a opção de FPS mais alta disponível no jogo, se seu dispositivo suportar e estiver estável."
    },
    {
      title: "Sensibilidade",
      text: "A sensibilidade é uma preferência individual. Teste em treinamento antes de partidas competitivas."
    }
  ],

  "PUBG Mobile": [
    {
      title: "Gráficos",
      text: "Teste configurações mais baixas para priorizar a estabilidade."
    },
    {
      title: "Taxa de quadros",
      text: "Escolha a opção mais alta disponível que seu aparelho consegue manter sem aquecimento excessivo."
    },
    {
      title: "Treinamento",
      text: "Teste os ajustes no campo de treinamento antes de uma partida."
    }
  ],

  "Call of Duty Mobile": [
    {
      title: "Qualidade",
      text: "Reduzir a qualidade gráfica pode ajudar dispositivos que enfrentam travamentos."
    },
    {
      title: "FPS",
      text: "Confira as opções de taxa de quadros oferecidas pelo próprio jogo."
    },
    {
      title: "Teste",
      text: "Experimente os ajustes no modo de treinamento."
    }
  ],

  "Minecraft": [
    {
      title: "Renderização",
      text: "Reduza a distância de renderização para aliviar o processamento."
    },
    {
      title: "Efeitos",
      text: "Reduza efeitos gráficos extras quando disponíveis."
    },
    {
      title: "Mundos",
      text: "Mundos muito grandes ou com muitos elementos podem exigir mais memória e processamento."
    }
  ],

  "Roblox": [
    {
      title: "Modo gráfico",
      text: "Experimente o modo gráfico manual e reduza a qualidade."
    },
    {
      title: "Experiência",
      text: "Experiências diferentes dentro do Roblox podem ter desempenho diferente."
    },
    {
      title: "Conexão",
      text: "Uma conexão estável ajuda no multiplayer, mas não aumenta diretamente o FPS."
    }
  ]
};

const modal = document.getElementById("gameModal");
const modalTitle = document.getElementById("modalGameTitle");
const modalContent = document.getElementById("modalGameContent");

gameCards.forEach(card => {
  card.addEventListener("click", () => {
    const game = card.dataset.game;
    modalTitle.textContent = game;

    const profile = gameProfiles[game] || [];

    modalContent.innerHTML = `
      <div class="modal-content-list">
        ${profile.map(item => `
          <div class="modal-tip">
            <strong>${item.title}</strong>
            <p>${item.text}</p>
          </div>
        `).join("")}
      </div>
    `;

    modal.classList.add("show");
    vibrate();
  });
});

function closeModal() {
  modal.classList.remove("show");
}

document.getElementById("closeModal").addEventListener("click", closeModal);
document.getElementById("modalDone").addEventListener("click", closeModal);

modal.addEventListener("click", event => {
  if (event.target === modal) closeModal();
});


// DEVICE INFORMATION
function detectDevice() {
  const ua = navigator.userAgent || "";

  let deviceName = "Dispositivo móvel";
  let os = "Sistema não identificado";

  if (/Android/i.test(ua)) {
    os = "Android";
  } else if (/iPhone|iPad|iPod/i.test(ua)) {
    os = "iOS";
  } else if (/Windows/i.test(ua)) {
    os = "Windows";
  } else if (/Mac/i.test(ua)) {
    os = "macOS";
  } else if (/Linux/i.test(ua)) {
    os = "Linux";
  }

  if (/Samsung/i.test(ua)) deviceName = "Samsung";
  else if (/Xiaomi|Redmi|POCO/i.test(ua)) deviceName = "Xiaomi / Redmi / POCO";
  else if (/Motorola/i.test(ua)) deviceName = "Motorola";
  else if (/iPhone/i.test(ua)) deviceName = "Apple iPhone";
  else if (/Pixel/i.test(ua)) deviceName = "Google Pixel";
  else if (/Android/i.test(ua)) deviceName = "Android device";

  document.getElementById("deviceName").textContent = deviceName;
  document.getElementById("deviceOS").textContent = os;

  const memory = navigator.deviceMemory;

  document.getElementById("memoryInfo").textContent =
    memory ? `${memory} GB (estimativa)` : "Indisponível";

  const connection = navigator.connection ||
                    navigator.mozConnection ||
                    navigator.webkitConnection;

  document.getElementById("networkInfo").textContent =
    connection?.effectiveType || (navigator.onLine ? "Online" : "Offline");

  document.getElementById("screenInfo").textContent =
    `${screen.width} × ${screen.height}`;

  document.getElementById("platformInfo").textContent =
    navigator.platform || "Indisponível";
}

detectDevice();

window.addEventListener("online", detectDevice);
window.addEventListener("offline", detectDevice);


// PWA INSTALL
const installButton = document.getElementById("installButton");

window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault();
  deferredInstallPrompt = event;
  installButton.textContent = "INSTALAR";
  installButton.disabled = false;
});

installButton.addEventListener("click", async () => {
  if (!deferredInstallPrompt) {
    showToast("Use o menu do navegador para adicionar à tela inicial.");
    return;
  }

  deferredInstallPrompt.prompt();

  const result = await deferredInstallPrompt.userChoice;

  if (result.outcome === "accepted") {
    showToast("Instalação aceita!");
  } else {
    showToast("Instalação cancelada.");
  }

  deferredInstallPrompt = null;
});

window.addEventListener("appinstalled", () => {
  showToast("FPS BOOST instalado!");
  installButton.textContent = "INSTALADO";
  installButton.disabled = true;
});


// SERVICE WORKER
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("./service-worker.js");
    } catch (error) {
      console.error("Service Worker:", error);
    }
  });
}
