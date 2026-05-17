import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCOwIXGEWKqZY1mGLeEeNNOKLEfsezzLwI",
  authDomain: "lainestocks.firebaseapp.com",
  projectId: "lainestocks",
  storageBucket: "lainestocks.firebasestorage.app",
  messagingSenderId: "179086045996",
  appId: "1:179086045996:web:bf7e742d3d5957b48e7289",
  measurementId: "G-YW5TFHQC0P"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const shopRef = doc(db, "shop", "mainData");

const HASHED_PASSWORD =
  "3d903b3df0d97f4a4d0efdd93a1bb4e777e02f4f4b92cf1db5fc905c82c5d7c8";

let data = {
  robux: [],
  limiteds: []
};

let contacts = {
  title: "Contact Me",
  discord: "Discord: cutielay",
  twitter: "Twitter: @Lainepws",
  extra: "DM me on discord for faster reply time!"
};

window.addEventListener("load", () => {
  load();

  setTimeout(() => {
    const loader = document.getElementById("loader");
    if (!loader) return;

    loader.style.opacity = "0";
    loader.style.transition = ".5s";

    setTimeout(() => {
      loader.style.display = "none";
    }, 500);
  }, 1800);
});

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return hashArray
    .map(byte => byte.toString(16).padStart(2, "0"))
    .join("");
}

function switchTab(e, id) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  document.getElementById(id).classList.add("active");

  if (e && e.currentTarget.classList.contains("tab-btn")) {
    e.currentTarget.classList.add("active");
  }
}

function showLoginBox() {
  document.getElementById("loginBox").classList.toggle("hidden");
}

async function login() {
  const pass = document.getElementById("password").value;
  const hashedInput = await hashPassword(pass);

  if (hashedInput === HASHED_PASSWORD) {
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
  save();
}

function addItem() {
  const name = document.getElementById("itemName").value.trim();
  const price = document.getElementById("itemPrice").value.trim();
  const image = document.getElementById("itemImage").value.trim();
  const desc = document.getElementById("itemDesc").value.trim();
  const tab = document.getElementById("itemTab").value;

  if (!name || !price) return;

  data[tab].push({
    name,
    price,
    image,
    desc: desc || `${name} is currently listed in LaineStock.`
  });

  document.getElementById("itemName").value = "";
  document.getElementById("itemPrice").value = "";
  document.getElementById("itemImage").value = "";
  document.getElementById("itemDesc").value = "";

  save();
}

function updateContacts() {
  contacts.title = document.getElementById("contactTitleInput").value.trim() || contacts.title;
  contacts.discord = document.getElementById("discordInput").value.trim() || contacts.discord;
  contacts.twitter = document.getElementById("twitterInput").value.trim() || contacts.twitter;
  contacts.extra = document.getElementById("extraInput").value.trim() || contacts.extra;

  document.getElementById("contactTitleInput").value = "";
  document.getElementById("discordInput").value = "";
  document.getElementById("twitterInput").value = "";
  document.getElementById("extraInput").value = "";

  save();
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
      grid.innerHTML += `
        <div class="card" onclick="openItem('${type}', ${index})">
          ${
            item.image
              ? `<img src="${item.image}">`
              : `<div class="fallback-icon">💎</div>`
          }
          <h2>${item.name}</h2>
          <p>${item.price}</p>
        </div>
      `;
    });
}

function renderManage() {
  const box = document.getElementById("manageItems");
  box.innerHTML = "";

  ["robux", "limiteds"].forEach(type => {
    data[type].forEach((item, index) => {
      box.innerHTML += `
        <div class="manage-card">
          <strong>${item.name}</strong><br>
          <small>${item.price}</small><br><br>
          <button onclick="deleteItem('${type}', ${index})">Delete</button>
        </div>
      `;
    });
  });
}

function openItem(type, index) {
  const item = data[type][index];

  document.getElementById("modalTitle").innerText = item.name;
  document.getElementById("modalPrice").innerText = item.price;
  document.getElementById("modalDescription").innerText =
    item.desc || `${item.name} is currently listed in LaineStock.`;

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
}

function clearItems() {
  data = {
    robux: [],
    limiteds: []
  };

  save();
}

async function save() {
  await setDoc(shopRef, {
    data: data,
    contacts: contacts,
    title: document.getElementById("shopTitle").innerText
  });
}

function load() {
  onSnapshot(shopRef, snapshot => {
    if (snapshot.exists()) {
      const saved = snapshot.data();

      if (saved.data) data = saved.data;
      if (saved.contacts) contacts = saved.contacts;
      if (saved.title) {
        document.getElementById("shopTitle").innerText = saved.title;
      }
    }

    if (sessionStorage.getItem("loggedIn") === "true") {
      document.getElementById("ownerPanel").classList.remove("hidden");
    }

    render();
  });
}

/* Needed because script.js is now type="module" */
window.switchTab = switchTab;
window.showLoginBox = showLoginBox;
window.login = login;
window.closeOwner = closeOwner;
window.updateTitle = updateTitle;
window.addItem = addItem;
window.updateContacts = updateContacts;
window.openItem = openItem;
window.closeModal = closeModal;
window.deleteItem = deleteItem;
window.clearItems = clearItems;
window.render = render;
