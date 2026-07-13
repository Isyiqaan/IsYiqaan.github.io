"use strict";

/* =========================
   SETTINGS
========================= */

const TOTAL_QUESTIONS = 10;
const PAGE_TRANSITION_TIME = 380;
const RESULTS_LOCK_TIME = 12 * 60 * 60 * 1000;

let isNavigating = false;
let audioContext = null;


/* =========================
   PAGE STARTUP
========================= */

document.addEventListener("DOMContentLoaded", () => {
    handleResultsLock();

    requestAnimationFrame(() => {
        document.body.classList.add("loaded");
    });

    updateProgressBar();
    fillPlayerNameElements();
    prepareNameInput();
});


/* =========================
   GENERATED POP SOUND
   No MP3 file is required
========================= */

function playPopSound() {
    try {
        const AudioContextClass =
            window.AudioContext || window.webkitAudioContext;

        if (!AudioContextClass) {
            return;
        }

        if (!audioContext) {
            audioContext = new AudioContextClass();
        }

        if (audioContext.state === "suspended") {
            audioContext.resume();
        }

        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.type = "sine";

        oscillator.frequency.setValueAtTime(
            520,
            audioContext.currentTime
        );

        oscillator.frequency.exponentialRampToValueAtTime(
            760,
            audioContext.currentTime + 0.07
        );

        gain.gain.setValueAtTime(
            0.09,
            audioContext.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            audioContext.currentTime + 0.11
        );

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.12);
    } catch (error) {
        console.warn("Sound could not play:", error);
    }
}


/* =========================
   CIRCLE PARTICLES
========================= */

function createParticles(button) {
    if (!button) {
        return;
    }

    const rect = button.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const colors = [
        "#ffffff",
        "#f5d0fe",
        "#e9d5ff",
        "#fbcfe8",
        "#ddd6fe",
        "#f0abfc"
    ];

    const particleCount = 10;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("span");

        particle.className = "particle";

        const angle =
            (Math.PI * 2 * i) / particleCount +
            Math.random() * 0.35;

        const distance = 38 + Math.random() * 45;

        const moveX = Math.cos(angle) * distance;
        const moveY = Math.sin(angle) * distance;

        const size = 6 + Math.random() * 7;

        particle.style.left = `${centerX}px`;
        particle.style.top = `${centerY}px`;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        particle.style.background =
            colors[Math.floor(Math.random() * colors.length)];

        particle.style.setProperty(
            "--particle-x",
            `${moveX}px`
        );

        particle.style.setProperty(
            "--particle-y",
            `${moveY}px`
        );

        document.body.appendChild(particle);

        particle.addEventListener(
            "animationend",
            () => particle.remove(),
            { once: true }
        );
    }
}


/* =========================
   BUTTON CLICK EFFECTS
========================= */

document.addEventListener("click", event => {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    playPopSound();
    createParticles(button);
});


/* =========================
   SMOOTH PAGE NAVIGATION
========================= */

function goTo(page) {
    if (
        isNavigating ||
        typeof page !== "string" ||
        page.trim() === ""
    ) {
        return;
    }

    isNavigating = true;

    document.body.classList.add("fade-out");

    window.setTimeout(() => {
        window.location.href = page;
    }, PAGE_TRANSITION_TIME);
}


/* =========================
   SAVE PLAYER NAME
========================= */

function startQuiz() {
    const input = document.getElementById("name");

    if (!input) {
        console.error(
            'Name input with id="name" was not found.'
        );

        return;
    }

    const playerName = input.value.trim();

    if (playerName === "") {
        showNameWarning();
        input.focus();

        input.classList.remove("input-shake");

        void input.offsetWidth;

        input.classList.add("input-shake");

        return;
    }

    localStorage.setItem(
        "playerName",
        playerName
    );

    hideNameWarning();

    goTo("index.html");
}


/* =========================
   PREPARE NAME INPUT
========================= */

function prepareNameInput() {
    const input = document.getElementById("name");

    if (!input) {
        return;
    }

    createWarningMessage(input);

    const savedName =
        localStorage.getItem("playerName");

    if (savedName) {
        input.value = savedName;
    }

    input.addEventListener(
        "input",
        hideNameWarning
    );

    input.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            event.preventDefault();
            startQuiz();
        }
    });
}


/* =========================
   NAME WARNING
========================= */

function createWarningMessage(input) {
    if (document.getElementById("nameWarning")) {
        return;
    }

    const warning =
        document.createElement("p");

    warning.id = "nameWarning";
    warning.className = "warning";
    warning.textContent =
        "Please enter your name first.";

    const parent = input.parentElement;

    if (parent) {
        parent.appendChild(warning);
    }
}

function showNameWarning() {
    const warning =
        document.getElementById("nameWarning");

    if (warning) {
        warning.classList.add("show");
    }
}

function hideNameWarning() {
    const warning =
        document.getElementById("nameWarning");

    if (warning) {
        warning.classList.remove("show");
    }
}


/* =========================
   DISPLAY PLAYER NAME

   Use:
   <span data-player-name></span>
========================= */

function fillPlayerNameElements() {
    const playerName =
        localStorage.getItem("playerName") ||
        "Player";

    const elements =
        document.querySelectorAll(
            "[data-player-name]"
        );

    elements.forEach(element => {
        element.textContent = playerName;
    });
}


/* =========================
   PROGRESS BAR
========================= */

function updateProgressBar() {
    const progressFill =
        document.querySelector(
            ".progressFill"
        );

    if (!progressFill) {
        return;
    }

    let progress = 0;

    const pageName =
        getCurrentPageName();

    const questionMatch =
        pageName.match(
            /^question(\d+)\.html$/
        );

    if (questionMatch) {
        const questionNumber =
            Number(questionMatch[1]);

        const completedQuestions =
            Math.max(
                0,
                questionNumber - 1
            );

        progress =
            (
                completedQuestions /
                TOTAL_QUESTIONS
            ) * 100;
    }

    if (pageName === "results.html") {
        progress = 100;
    }

    const customProgress =
        document.body.dataset.progress;

    if (customProgress !== undefined) {
        const parsedProgress =
            Number(customProgress);

        if (Number.isFinite(parsedProgress)) {
            progress = parsedProgress;
        }
    }

    progress = Math.max(
        0,
        Math.min(100, progress)
    );

    progressFill.style.width = "0%";

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            progressFill.style.width =
                `${progress}%`;
        });
    });
}


/* =========================
   ANSWER AND CONTINUE
========================= */

function answerAndContinue(nextPage) {
    goTo(nextPage);
}


/* =========================
   FINISH QUIZ

   Saves a 12-hour lock and opens
   the results page.
========================= */

function finishQuiz() {
    if (isNavigating) {
        return;
    }

    const returnTime =
        Date.now() + RESULTS_LOCK_TIME;

    localStorage.setItem(
        "resultsReturnTime",
        returnTime.toString()
    );

    localStorage.setItem(
        "completedDay",
        "1"
    );

    goTo("results.html");
}


/* =========================
   12-HOUR RESULTS LOCK

   During the 12 hours:
   The player stays on results.html.

   After 12 hours:
   results.html sends them to index.html.
   Their saved name remains.
========================= */

function handleResultsLock() {
    const currentPage =
        getCurrentPageName();

    const savedReturnTime =
        Number(
            localStorage.getItem(
                "resultsReturnTime"
            )
        );

    if (!savedReturnTime) {
        return;
    }

    const lockIsActive =
        Date.now() < savedReturnTime;

    if (lockIsActive) {
        if (currentPage !== "results.html") {
            window.location.replace(
                "results.html"
            );
        }

        return;
    }

    localStorage.removeItem(
        "resultsReturnTime"
    );

    if (currentPage === "results.html") {
        window.location.replace(
            "index.html"
        );
    }
}


/* =========================
   CURRENT FILE NAME
========================= */

function getCurrentPageName() {
    const pageName =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();

    return pageName || "index.html";
}


/* =========================
   FUNCTIONS AVAILABLE TO HTML
========================= */

window.goTo = goTo;
window.startQuiz = startQuiz;
window.answerAndContinue =
    answerAndContinue;
window.finishQuiz = finishQuiz;
