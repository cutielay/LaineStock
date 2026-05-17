const OWNER_PASSWORD = "Lainepwss001!";

let data = {
  robux: [
    {
      name: "10,000 Robux",
      price: "$30.00",
      image: "https://cdn-icons-png.flaticon.com/512/217/217853.png",
      desc: "10,000 Robux package."
    },
    {
      name: "50,000 Robux",
      price: "$140.00",
      image: "https://cdn-icons-png.flaticon.com/512/217/217853.png",
      desc: "50,000 Robux package."
    }
  ],
  limiteds: []
};

let contacts = {
  title: "Contact Me",
  discord: "Discord: yourname",
  twitter: "Twitter: @handle",
  extra: "Message me for prices, stock, and questions."
};

const crosshair = document.querySelector(".crosshair");

document.addEventListener("mousemove", e => {
  crosshair.style.left = e.clientX + "px";
  crosshair.style.top = e.clientY + "px";
});

function toggleDark() {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
}

window.addEventListener("load", () => {
  load();

  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
  }

  setTimeout(() => {
    document.getElementById("loader").style.opacity = "0";
    document.getElementById("loader").style.transition = ".5s";

    setTimeout(() => {
      document.getElementById("loader").style.display = "none";
    }, 500);
  }, 1800);
});

function switchTab(e, id) {
  document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));

  document.getElementById(id).classList.add("active");

  if (e && e.currentTarget.classList.contains("tab-btn")) {
    e.currentTarget.classList.add("active");
  }
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
  render();
}

function updateContacts() {
  contacts.title = document.getElementById("contactTitleInput").value.trim() || contacts.title;
  contacts.discord = document.getElementById("discordInput").value.trim() || contacts.discord;
  contacts.twitter = document.getElementById("twitterInput").value.trim() || contacts.twitter;
  contacts.extra = document.getElementById("extraInput").value.trim() || contacts.extra;

  localStorage.setItem("contacts", JSON.stringify(contacts));
  renderContacts();

  document.getElementById("contactTitleInput").value = "";
  document.getElementById("discordInput").value = "";
  document.getElementById("twitterInput").value = "";
  document.getElementById("extraInput").value = "";
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
              : `<div class="fallback-icon">♡</div>`
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
  data = { robux: [], limiteds: [] };
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
