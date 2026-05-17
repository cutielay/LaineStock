const OWNER_PASSWORD = "test123";

let data = {
  robux: [
    {
      name: "3.40 PER 300 ROBUX",
      image: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Robux_2019_Logo_gold.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original",
      desc: "STOCK 93K."
    }
  ],
  limiteds: []
};

let contacts = {
  title: "Contact Me",
  discord: "Discord: cutielay",
  twitter: "Twitter: @Lainepws",
  extra: "DM me on Discord for faster reply time!"
};

window.addEventListener("DOMContentLoaded", () => {
  load();

  document.querySelectorAll("[data-tab]").forEach(btn => {
    btn.addEventListener("click", e => switchTab(e, btn.dataset.tab));
  });

  document.getElementById("ownerBtn").addEventListener("click", showLoginBox);
  document.getElementById("loginBtn").addEventListener("click", login);
  document.getElementById("closeOwnerBtn").addEventListener("click", closeOwner);
  document.getElementById("updateTitleBtn").addEventListener("click", updateTitle);
  document.getElementById("addItemBtn").addEventListener("click", addItem);
  document.getElementById("updateContactsBtn").addEventListener("click", updateContacts);
  document.getElementById("clearItemsBtn").addEventListener("click", clearItems);
  document.getElementById("closeModalBtn").addEventListener("click", closeModal);
  document.getElementById("searchInput").addEventListener("input", render);

  setTimeout(() => {
    const loader = document.getElementById("loader");
    loader.style.opacity = "0";
    loader.style.transition = ".5s";

    setTimeout(() => {
      loader.style.display = "none";
    }, 500);
  }, 1200);
});

function switchTab(e, id) {
  document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));

  document.getElementById(id).classList.add("active");
  e.currentTarget.classList.add("active");
}

function showLoginBox() {
  document.getElementById("loginBox").classList.toggle("hidden");
}

function login() {
  const pass = document.getElementById("password").value;

  if (pass === OWNER_PASSWORD) {
    document.getElementById("ownerPanel").classList.remove("hidden");
    document.getElementById("loginBox").classList.add("hidden");
    document.getElementById("error").innerText = "";
    sessionStorage.setItem("loggedIn", "true");
  } else {
    document.getElementById("error").innerText = "Wrong password!";
  }
}

function closeOwner() {
  document.getElementById("ownerPanel").classList.add("hidden");
}

function updateTitle() {
  const val = document.getElementById("titleInput").value.trim();
  if (!val) return;

  document.getElementById("shopTitle").innerText = val;
  localStorage.setItem("shopTitle", val);
}

function addItem() {
  const name = document.getElementById("itemName").value.trim();
  const image = document.getElementById("itemImage").value.trim();
  const desc = document.getElementById("itemDesc").value.trim();
  const tab = document.getElementById("itemTab").value;

  if (!name) return alert("Add an item name.");

  data[tab].push({
    name,
    image,
    desc: desc || `${name} is currently listed in LaineStock.`
  });

  document.getElementById("itemName").value = "";
  document.getElementById("itemImage").value = "";
  document.getElementById("itemDesc").value = "";

  save();
  render();
}

function updateContacts() {
  contacts.title = document.getElementById("contactTitleInput").value.trim() || contacts.title;
  contacts.discord = document.getElementById("discordInput").value.trim() || contacts.discord;
  contacts.twitter = document.getElementById("twitterInput").value.trim() || contacts.twitter;
  contacts.extra = document.getElementById("extraInput").value.trim() || contacts.extra;

  localStorage.setItem("contacts", JSON.stringify(contacts));
  renderContacts();
}

function renderContacts() {
  document.getElementById("contactTitle").innerText = contacts.title;
  document.getElementById("discordText").innerText = contacts.discord;
  document.getElementById("twitterText").innerText = contacts.twitter;
  document.getElementById("extraText").innerText = contacts.extra;
}

function render() {
  renderGrid("robux", "robuxGrid");
  renderGrid("limiteds", "limitedsGrid");
  renderManage();
  renderContacts();
}

function renderGrid(type, gridId) {
  const grid = document.getElementById(gridId);
  const search = document.getElementById("searchInput").value.toLowerCase();

  grid.innerHTML = "";

  data[type]
    .filter(item => item.name.toLowerCase().includes(search))
    .forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "card";
      card.onclick = () => openItem(type, index);

      card.innerHTML = `
        ${item.image ? `<img src="${item.image}" alt="${item.name}">` : `<div class="fallback-icon">💎</div>`}
        <h2>${item.name}</h2>
      `;

      grid.appendChild(card);
    });
}

function renderManage() {
  const box = document.getElementById("manageItems");
  box.innerHTML = "";

  ["robux", "limiteds"].forEach(type => {
    data[type].forEach((item, index) => {
      const div = document.createElement("div");
      div.className = "manage-card";

      div.innerHTML = `
        <strong>${item.name}</strong><br>
      `;

      const btn = document.createElement("button");
      btn.innerText = "Delete";
      btn.onclick = () => deleteItem(type, index);

      div.appendChild(btn);
      box.appendChild(div);
    });
  });
}

function openItem(type, index) {
  const item = data[type][index];

  document.getElementById("modalTitle").innerText = item.name;
  document.getElementById("modalDescription").innerText = item.desc;

  const img = document.getElementById("modalImage");

  if (item.image) {
    img.src = item.image;
    img.style.display = "block";
  } else {
    img.style.display = "none";
  }

  document.getElementById("itemModal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("itemModal").classList.add("hidden");
}

function deleteItem(type, index) {
  data[type].splice(index, 1);
  save();
  render();
}

function clearItems() {
  if (!confirm("Clear all items?")) return;

  data = {
    robux: [],
    limiteds: []
  };

  save();
  render();
}

function save() {
  localStorage.setItem("shopData", JSON.stringify(data));
}

function load() {
  const saved = localStorage.getItem("shopData");
  const savedTitle = localStorage.getItem("shopTitle");
  const savedContacts = localStorage.getItem("contacts");

  if (saved) data = JSON.parse(saved);
  if (savedTitle) document.getElementById("shopTitle").innerText = savedTitle;
  if (savedContacts) contacts = JSON.parse(savedContacts);

  if (sessionStorage.getItem("loggedIn") === "true") {
    document.getElementById("ownerPanel").classList.remove("hidden");
  }

  render();
}
