const counter = document.querySelector("#counter");

// mult upgrade
const multbutton = document.querySelector("#multupg");
const multpricebut = document.querySelector("#multprice")
const oldmult = document.querySelector("#oldmult");
const newmult = document.querySelector("#newmult");

// spawn mult upgrade
const smultbutton = document.querySelector("#smultupg");
const smultpricebut = document.querySelector("#smultprice")
const oldsmult = document.querySelector("#oldsmult");
const newsmult = document.querySelector("#newsmult");

function getCookie(name) {
    const cookie = document.cookie
        .split("; ")
        .find(cookie => cookie.startsWith(`${name}=`));

    return cookie ? cookie.split("=").slice(1).join("=") : null;
}

let upgmult = Number(getCookie("mult") ?? 1);
let multupglevel = Math.round(Math.log(upgmult) / Math.log(1.5));
let upgsmult = Number(getCookie("smult") ?? 1);
let smultupglevel = Math.round(Math.log(upgsmult) / Math.log(1.5));
let count = getCookie("score") || 0;

counter.textContent = shortvalue(count);

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

function load() {
    oldmult.textContent = shortvalue(upgmult);
    newmult.textContent = shortvalue(upgmult * 1.5);
    oldsmult.textContent = shortvalue(upgsmult);
    newsmult.textContent = shortvalue(upgsmult * 1.5);
    counter.textContent = shortvalue(count);
    multpricebut.textContent = `${(multupglevel + 1) * 10}$`;
    smultpricebut.textContent = `${(smultupglevel + 1) * 10}$`;
}

multbutton.addEventListener("click", () => {
    const price = Math.round((multupglevel + 1) * 10);

    if (count >= price) {
        count -= price;
        multupglevel++;
        upgmult *= 1.5;

        load();
        document.cookie = `mult=${upgmult}; max-age=31536000; path=/`;
        document.cookie = `score=${count}; max-age=31536000; path=/`;
    }
});

smultbutton.addEventListener("click", () => {
    const price = Math.round((smultupglevel + 1) * 10);

    if (count >= price) {
        count -= price;
        smultupglevel++;
        upgsmult *= 1.5;

        load();
        document.cookie = `smult=${upgsmult}; max-age=31536000; path=/`;
        document.cookie = `score=${count}; max-age=31536000; path=/`;
    }
});


load();
