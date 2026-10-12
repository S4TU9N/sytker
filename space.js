const background = document.querySelector("#space-background");
const counter = document.querySelector("#counter");
const imagePath = "logo.png";

function getCookie(name) {
    const cookie = document.cookie
        .split("; ")
        .find(cookie => cookie.startsWith(`${name}=`));

    return cookie ? cookie.split("=").slice(1).join("=") : null;
}

let mult = Number(getCookie("mult") ?? 1);

let smult = Number(getCookie("smult") ?? 1);

let count = Number(getCookie("score") ?? 0);

if (count != 0) {
  counter.textContent = shortvalue(count)
}

function shortvalue(num) {
    num = Math.round(num)
    const suffixes = [
        "", "K", "M", "B", "T", "Qd", "Qn",
        "Sx", "Sp", "Oc", "No", "Dc",
        "Ud", "Dd", "Td", "Qad", "Qid",
        "Sxd", "Spd", "Ocd", "Nod", "Vg"
    ];

    const tier = Math.floor(Math.log10(Math.abs(num)) / 3);

    if (tier <= 0) return String(num);
    if (tier >= suffixes.length) return num.toExponential(2);

    const scaled = num / Math.pow(1000, tier);
    return scaled.toFixed(1).replace(/\.0$/, "") + suffixes[tier];
}

function spawnObject() {
  const image = document.createElement("img");
  image.src = imagePath;
  image.className = "space-object";
  image.draggable = false;

  image.style.pointerEvents = "auto";

  const size = Math.random() * 75 + 20;
  const angle = Math.random() * Math.PI * 2;

  image.addEventListener("click", () => {
    let big = false
    // get the images current position on screen
    const rect = image.getBoundingClientRect();
    if (size < 38.75) {
      big = true;
      count += 5*mult;
    } else {
      count += 1*mult;
    }

    document.cookie = `score=${count}; max-age=31536000; path=/`;
    counter.textContent = shortvalue(count);

    // create the explosion
    const explosion = document.createElement("img");
    explosion.src = `kaboom.gif?t=${Date.now()}`;
    explosion.className = "explosion";

    explosion.style.left = `${rect.left + rect.width / 2}px`;
    explosion.style.top = `${rect.top + rect.height / 2}px`;

    const popupthingy = document.createElement("h3");

    popupthingy.style.left = `${rect.left + rect.width / 2}px`;
    popupthingy.style.top = `${rect.top + rect.height / 2}px`;
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;
    popupthingy.style.color = randomColor;

    const sound = new Audio("kaboom.mp3");
    sound.volume = 0.15;

    sound.play();

    popupthingy.className = "popupthingy";

    if (big) {
        popupthingy.textContent = `+${shortvalue(5*mult)}`;
    } else {
        popupthingy.textContent = `+${shortvalue(1*mult)}`;
    }

    document.body.appendChild(popupthingy);

    // remove the original image
    image.remove();

    // show the explosion
    background.appendChild(explosion);

    // remove the explosion after it plays
    explosion.addEventListener("load", () => {
      const duration = 700;
      setTimeout(() => explosion.remove(), duration);
    });

    const pduration = 1300;

    setTimeout(() => popupthingy.remove(), pduration);

  });

  // start just outside a random screen edge
  const edge = Math.floor(Math.random() * 4);
  let startX;
  let startY;

  if (edge === 0) {
    startX = -size;
    startY = Math.random() * window.innerHeight;
  } else if (edge === 1) {
    startX = window.innerWidth + size;
    startY = Math.random() * window.innerHeight;
  } else if (edge === 2) {
    startX = Math.random() * window.innerWidth;
    startY = -size;
  } else {
    startX = Math.random() * window.innerWidth;
    startY = window.innerHeight + size;
  }

  // choose a travel distance and speed
  const distance = Math.max(window.innerWidth, window.innerHeight) * 1.5;
  const speed = Math.random() * 600 + 40;

  const moveX = Math.cos(angle) * distance;
  const moveY = Math.sin(angle) * distance;
  const duration = distance / speed;
  const rotationDuration = Math.random() * 4 + 2;

  image.style.width = `${size}px`;
  image.style.left = `${startX}px`;
  image.style.top = `${startY}px`;
  image.style.setProperty("--move-x", `${moveX}px`);
  image.style.setProperty("--move-y", `${moveY}px`);
  image.style.setProperty("--duration", `${duration}s`);
  image.style.setProperty("--rotation-duration", `${rotationDuration}s`);

  background.appendChild(image);

  image.addEventListener("animationend", (event) => {
    if (event.animationName === "travel") {
      image.remove();
    }
  });
}

function spawnLoop() {
    spawnObject();
    setTimeout(spawnLoop, 200 / smult);
}

spawnLoop();
