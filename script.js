
// ----------------------------
// PAGE LOAD ANIMATION
// ----------------------------

window.addEventListener("load", () => {

    document.body.classList.add("loaded");

    updateProgress();

});

// ----------------------------
// CLICK SOUND
// ----------------------------

const clickSound = new Audio("click.mp3");
clickSound.volume = 0.25;

// ----------------------------
// PARTICLES
// ----------------------------

function createParticles(x, y) {

    const colors = [
        "#ffffff",
        "#f5d0fe",
        "#e9d5ff",
        "#fbcfe8",
        "#ddd6fe"
    ];

    for (let i = 0; i < 12; i++) {

        const particle = document.createElement("div");

        particle.className = "particle";

        particle.style.left = x + "px";
        particle.style.top = y + "px";

        particle.style.background =
            colors[Math.floor(Math.random() * colors.length)];

        particle.style.width =
            (6 + Math.random() * 8) + "px";

        particle.style.height =
            particle.style.width;

        particle.style.setProperty(
            "--x",
            (Math.random() * 120 - 60) + "px"
        );

        particle.style.setProperty(
            "--y",
            (Math.random() * 120 - 60) + "px"
        );

        document.body.appendChild(particle);

        setTimeout(() => {

            particle.remove();

        }, 600);

    }

}

// ----------------------------
// BUTTON EFFECTS
// ----------------------------

document.addEventListener("click", (e) => {

    if (!e.target.closest("button")) return;

    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});

    createParticles(
        e.clientX,
        e.clientY
    );

});

// ----------------------------
// PAGE TRANSITION
// ----------------------------

function goTo(page) {

    document.body.classList.add("fade-out");

    setTimeout(() => {

        window.location.href = page;

    }, 350);

}

// ----------------------------
// SAVE PLAYER NAME
// ----------------------------

function startQuiz() {

    const input = document.getElementById("name");

    if (!input) return;

    const name = input.value.trim();

    if (name === "") {

        alert("Please enter your name!");

        return;

    }

    localStorage.setItem(
        "playerName",
        name
    );

    goTo("index.html");

}

// ----------------------------
// SHOW PLAYER NAME
// ----------------------------

function showPlayerName(id) {

    const player =
        localStorage.getItem("playerName");

    const element =
        document.getElementById(id);

    if (player && element) {

        element.textContent = player;

    }

}

// ----------------------------
// PROGRESS BAR
// ----------------------------

function updateProgress() {

    const bar =
        document.querySelector(".progressFill");

    if (!bar) return;

    const page =
        window.location.pathname
        .split("/")
        .pop();

    const match =
        page.match(/\d+/);

    if (!match) return;

    const question =
        parseInt(match[0]);

    const percent =
        (question / 10) * 100;

    setTimeout(() => {

        bar.style.width =
            percent + "%";

    }, 150);

}
