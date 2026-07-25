"use strict";

/* =========================================================
   ULTIMATE PERSONALITY TEST — CLEAN SCRIPT.JS
========================================================= */


/* =========================
   SETTINGS
========================= */

const TOTAL_QUESTIONS = 10;
const PAGE_TRANSITION_TIME = 380;
const RESULTS_LOCK_TIME = 12 * 60 * 60 * 1000;

const LEADERBOARD_START_DATE = "2026-07-21";

const SHARE_LINK =
    "https://isyiqaan.github.io/welcome.html";

const leaderboardPlayers = [
    {
        name: "S/l boy",
        startingStreak: 14
    },
    {
        name: "Dilaaga 💀",
        startingStreak: 12
    },
    {
        name: "Samsam 🌺",
        startingStreak: 9
    },
    {
        name: "Ahmed",
        startingStreak: 7
    },
    {
        name: "Ghost",
        startingStreak: 4
    }
];

const personalityTraits = [
    {
        name: "Xaraabaad",
        emoji: "😂",
        min: 65,
        max: 99
    },
    {
        name: "Maskax",
        emoji: "🧠",
        min: 65,
        max: 99
    },
    {
        name: "Jacayl",
        emoji: "❤️",
        min: 65,
        max: 99
    },
    {
        name: "Hal abuur",
        emoji: "🎨",
        min: 55,
        max: 97
    },
    {
        name: "Kalsooni",
        emoji: "💪",
        min: 45,
        max: 95
    },
    {
        name: "Daacad",
        emoji: "🤝",
        min: 65,
        max: 99
    },
    {
        name: "Xiiso",
        emoji: "🔍",
        min: 50,
        max: 96
    },
    {
        name: "Safar doonid",
        emoji: "🧭",
        min: 40,
        max: 94
    },
    {
        name: "Degganaan",
        emoji: "😌",
        min: 40,
        max: 92
    },
    {
        name: "Hami",
        emoji: "🚀",
        min: 55,
        max: 98
    },
    {
        name: "Qurux",
        emoji: "✨",
        min: 80,
        max: 97
    },
    {
        name: "Madax-bannaan",
        emoji: "🦅",
        min: 45,
        max: 95
    },
    {
        name: "Rajo",
        emoji: "🌈",
        min: 50,
        max: 96
    },
    {
        name: "Dulqaad",
        emoji: "🌿",
        min: 35,
        max: 90
    },
    {
        name: "Firfircooni",
        emoji: "⚡",
        min: 45,
        max: 97
    },
    {
        name: "Tartame",
        emoji: "🏆",
        min: 35,
        max: 91
    },
    {
        name: "Hurdoole",
        emoji: "😴",
        min: 5,
        max: 60
    },
    {
        name: "Fikir badan",
        emoji: "💭",
        min: 15,
        max: 78
    },
    {
        name: "Ilow badan",
        emoji: "📝",
        min: 5,
        max: 58
    },
    {
        name: "Jees-jees",
        emoji: "😏",
        min: 20,
        max: 85
    }
];

let isNavigating = false;
let audioContext = null;


/* =========================
   HELPER FUNCTIONS
========================= */

function byId(id) {
    return document.getElementById(id);
}

function getCurrentPageName() {
    const pageName =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();

    return pageName || "index.html";
}

function randomNumber(minimum, maximum) {
    return Math.floor(
        Math.random() *
        (maximum - minimum + 1)
    ) + minimum;
}

function shuffleArray(array) {
    const shuffled = [...array];

    for (
        let index = shuffled.length - 1;
        index > 0;
        index--
    ) {
        const randomIndex =
            Math.floor(
                Math.random() *
                (index + 1)
            );

        [
            shuffled[index],
            shuffled[randomIndex]
        ] = [
            shuffled[randomIndex],
            shuffled[index]
        ];
    }

    return shuffled;
}

function getLocalDateKey(date = new Date()) {
    const year = date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getDaysSince(dateText) {
    const [
        startYear,
        startMonth,
        startDay
    ] = dateText
        .split("-")
        .map(Number);

    const today = new Date();

    const startTime =
        Date.UTC(
            startYear,
            startMonth - 1,
            startDay
        );

    const todayTime =
        Date.UTC(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );

    return Math.max(
        0,
        Math.floor(
            (todayTime - startTime) /
            86400000
        )
    );
}


/* =========================
   PAGE STARTUP
========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {
        if (redirectUnnamedPlayer()) {
            return;
        }

        if (redirectReturningPlayer()) {
            return;
        }

        if (handleResultsLock()) {
            return;
        }

        requestAnimationFrame(() => {
            document.body.classList.add(
                "loaded"
            );
        });

        prepareNameInput();
        fillPlayerNameElements();
        updateWelcomeMessage();
        updateProgressBar();
        displayLeaderboard();
        displayPersonalityResults();
        displayStreakDay();
    }
);


/* =========================
   NEW PLAYER REDIRECT
========================= */

function redirectUnnamedPlayer() {
    const currentPage =
        getCurrentPageName();

    const savedName =
        localStorage.getItem(
            "playerName"
        );

    if (
        currentPage !== "welcome.html" &&
        !savedName
    ) {
        window.location.replace(
            "welcome.html"
        );

        return true;
    }

    return false;
}


/* =========================
   RETURNING PLAYER REDIRECT
========================= */

function redirectReturningPlayer() {
    const currentPage =
        getCurrentPageName();

    const savedName =
        localStorage.getItem(
            "playerName"
        );

    if (
        currentPage === "welcome.html" &&
        savedName
    ) {
        window.location.replace(
            "index.html"
        );

        return true;
    }

    return false;
}


/* =========================
   12-HOUR RESULTS LOCK
========================= */

function handleResultsLock() {
    const returnTime =
        Number(
            localStorage.getItem(
                "resultsReturnTime"
            )
        );

    if (!returnTime) {
        return false;
    }

    const currentPage =
        getCurrentPageName();

    const lockIsActive =
        Date.now() < returnTime;

    if (
        lockIsActive &&
        currentPage !== "results.html"
    ) {
        window.location.replace(
            "results.html"
        );

        return true;
    }

    if (!lockIsActive) {
        localStorage.removeItem(
            "resultsReturnTime"
        );

        if (
            currentPage === "results.html"
        ) {
            window.location.replace(
                "index.html"
            );

            return true;
        }
    }

    return false;
}


/* =========================
   PAGE NAVIGATION
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

    document.body.classList.add(
        "fade-out"
    );

    window.setTimeout(() => {
        window.location.href = page;
    }, PAGE_TRANSITION_TIME);
}

function answerAndContinue(nextPage) {
    goTo(nextPage);
}


/* =========================
   SAVE PLAYER NAME
========================= */

function startQuiz() {
    const input = byId("name");

    if (!input) {
        return;
    }

    const playerName =
        input.value.trim();

    if (!playerName) {
        showNameWarning();

        input.focus();

        input.classList.remove(
            "input-shake"
        );

        void input.offsetWidth;

        input.classList.add(
            "input-shake"
        );

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
    const input = byId("name");

    if (!input) {
        return;
    }

    createNameWarning(input);

    const savedName =
        localStorage.getItem(
            "playerName"
        );

    if (savedName) {
        input.value = savedName;
    }

    input.addEventListener(
        "input",
        hideNameWarning
    );

    input.addEventListener(
        "keydown",
        event => {
            if (event.key === "Enter") {
                event.preventDefault();
                startQuiz();
            }
        }
    );
}


/* =========================
   NAME WARNING
========================= */

function createNameWarning(input) {
    if (byId("nameWarning")) {
        return;
    }

    const warning =
        document.createElement("p");

    warning.id = "nameWarning";
    warning.className = "warning";

    warning.textContent =
        "Magacaaga geli marka hore.";

    input.insertAdjacentElement(
        "afterend",
        warning
    );
}

function showNameWarning() {
    const warning =
        byId("nameWarning");

    if (warning) {
        warning.classList.add("show");
    }
}

function hideNameWarning() {
    const warning =
        byId("nameWarning");

    if (warning) {
        warning.classList.remove(
            "show"
        );
    }
}


/* =========================
   DISPLAY PLAYER NAME
========================= */

function fillPlayerNameElements() {
    const playerName =
        localStorage.getItem(
            "playerName"
        ) || "Player";

    const elements =
        document.querySelectorAll(
            "[data-player-name]"
        );

    elements.forEach(element => {
        element.textContent =
            playerName;
    });
}


/* =========================
   WELCOME MESSAGE
========================= */

function updateWelcomeMessage() {
    const welcomeText =
        byId("welcomeText");

    if (!welcomeText) {
        return;
    }

    const completedDay =
        Number(
            localStorage.getItem(
                "completedDay"
            )
        ) || 0;

    if (completedDay > 0) {
        welcomeText.textContent =
            "Ku soo laabo";
    } else {
        welcomeText.textContent =
            "Ku soo dhawoow";
    }
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

    let percentage = 0;

    const currentPage =
        getCurrentPageName();

    const questionMatch =
        currentPage.match(
            /^question(\d+)\.html$/
        );

    if (questionMatch) {
        const questionNumber =
            Number(questionMatch[1]);

        percentage =
            (
                questionNumber /
                TOTAL_QUESTIONS
            ) * 100;
    }

    if (
        currentPage === "results.html"
    ) {
        percentage = 100;
    }

    const customProgress =
        document.body.dataset.progress;

    if (
        customProgress !== undefined
    ) {
        const parsedProgress =
            Number(customProgress);

        if (
            Number.isFinite(
                parsedProgress
            )
        ) {
            percentage =
                parsedProgress;
        }
    }

    percentage =
        Math.max(
            0,
            Math.min(100, percentage)
        );

    progressFill.style.width =
        "0%";

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            progressFill.style.width =
                `${percentage}%`;
        });
    });
}


/* =========================
   FINISH QUIZ
========================= */

function finishQuiz() {
    if (isNavigating) {
        return;
    }

    const returnTime =
        Date.now() +
        RESULTS_LOCK_TIME;

    localStorage.setItem(
        "resultsReturnTime",
        String(returnTime)
    );

    updatePlayerStreak();
    generatePersonalityResults();

    goTo("results.html");
}


/* =========================
   PLAYER DAILY STREAK
========================= */

function updatePlayerStreak() {
    const today =
        getLocalDateKey();

    const lastCompletedDate =
        localStorage.getItem(
            "lastCompletedDate"
        );

    const oldStreak =
        Number(
            localStorage.getItem(
                "completedDay"
            )
        ) || 0;

    if (
        lastCompletedDate === today
    ) {
        return Math.max(
            1,
            oldStreak
        );
    }

    const newStreak =
        Math.max(
            1,
            oldStreak + 1
        );

    localStorage.setItem(
        "completedDay",
        String(newStreak)
    );

    localStorage.setItem(
        "lastCompletedDate",
        today
    );

    return newStreak;
}

function displayStreakDay() {
    const streakElement =
        byId("streakDay");

    if (!streakElement) {
        return;
    }

    streakElement.textContent =
        localStorage.getItem(
            "completedDay"
        ) || "1";
}


/* =========================
   DAILY LEADERBOARD
========================= */

function displayLeaderboard() {
    const leaderboard =
        byId("leaderboard");

    if (!leaderboard) {
        return;
    }

    const addedDays =
        getDaysSince(
            LEADERBOARD_START_DATE
        );

    const players =
        leaderboardPlayers
            .map(player => {
                return {
                    name: player.name,

                    streak:
                        player.startingStreak +
                        addedDays
                };
            })
            .sort(
                (playerA, playerB) =>
                    playerB.streak -
                    playerA.streak
            );

    leaderboard.innerHTML = "";

    players.forEach(
        (player, index) => {
            const row =
                document.createElement(
                    "div"
                );

            row.className =
                "leaderboard-row";

            const nameElement =
                document.createElement(
                    "span"
                );

            const streakElement =
                document.createElement(
                    "span"
                );

            let rank =
                `${index + 1}.`;

            if (index === 0) {
                rank = "🥇";
            } else if (index === 1) {
                rank = "🥈";
            } else if (index === 2) {
                rank = "🥉";
            }

            nameElement.textContent =
                `${rank} ${player.name}`;

            streakElement.textContent =
                `🔥 Day ${player.streak}`;

            row.appendChild(
                nameElement
            );

            row.appendChild(
                streakElement
            );

            leaderboard.appendChild(
                row
            );
        }
    );
}


/* =========================
   GENERATE RANDOM RESULTS
========================= */

function generatePersonalityResults() {
    const selectedTraits =
        shuffleArray(
            personalityTraits
        ).slice(0, 8);

    const results =
        selectedTraits
            .map(trait => {
                return {
                    name: trait.name,

                    emoji: trait.emoji,

                    percentage:
                        randomNumber(
                            trait.min,
                            trait.max
                        )
                };
            })
            .sort(
                (resultA, resultB) =>
                    resultB.percentage -
                    resultA.percentage
            );

    localStorage.setItem(
        "personalityResults",
        JSON.stringify(results)
    );

    return results;
}


/* =========================
   GET SAVED RESULTS
========================= */

function getPersonalityResults() {
    const savedResults =
        localStorage.getItem(
            "personalityResults"
        );

    if (savedResults) {
        try {
            const parsedResults =
                JSON.parse(savedResults);

            if (
                Array.isArray(
                    parsedResults
                ) &&
                parsedResults.length > 0
            ) {
                return parsedResults;
            }
        } catch (error) {
            console.warn(
                "Results could not be read:",
                error
            );
        }
    }

    return generatePersonalityResults();
}


/* =========================
   DISPLAY RESULTS
========================= */

function displayPersonalityResults() {
    const resultsContainer =
        byId("personalityResults");

    if (!resultsContainer) {
        return;
    }

    const results =
        getPersonalityResults();

    resultsContainer.innerHTML = "";

    results.forEach(
        (result, index) => {
            const trait =
                document.createElement(
                    "div"
                );

            trait.className =
                "trait";

            const traitHeader =
                document.createElement(
                    "div"
                );

            traitHeader.className =
                "traitHeader";

            const traitName =
                document.createElement(
                    "span"
                );

            traitName.className =
                "traitName";

            traitName.textContent =
                `${result.emoji} ${result.name}`;

            const traitPercent =
                document.createElement(
                    "span"
                );

            traitPercent.className =
                "traitPercent";

            traitPercent.textContent =
                `${result.percentage}%`;

            const traitBar =
                document.createElement(
                    "div"
                );

            traitBar.className =
                "traitBar";

            const traitFill =
                document.createElement(
                    "div"
                );

            traitFill.className =
                "traitFill";

            traitFill.style.width =
                "0%";

            traitHeader.appendChild(
                traitName
            );

            traitHeader.appendChild(
                traitPercent
            );

            traitBar.appendChild(
                traitFill
            );

            trait.appendChild(
                traitHeader
            );

            trait.appendChild(
                traitBar
            );

            resultsContainer.appendChild(
                trait
            );

            window.setTimeout(() => {
                traitFill.style.width =
                    `${result.percentage}%`;
            }, 180 + index * 120);
        }
    );
}


/* =========================
   SHARE ON WHATSAPP
========================= */

function shareResultsOnWhatsApp() {
    const playerName =
        localStorage.getItem(
            "playerName"
        ) || "Player";

    const streakDay =
        localStorage.getItem(
            "completedDay"
        ) || "1";

    const results =
        getPersonalityResults();

    const resultLines =
        results.map(result => {
            return (
                `${result.emoji} ` +
                `${result.name}: ` +
                `${result.percentage}%`
            );
        });

    const message = [
        "🔥 Waxaan dhammeeyay Tartanka Shakhsiyadda!",
        "",
        `✨ Natiijada ${playerName} ✨`,
        "",
        ...resultLines,
        "",
        `🔥 Streak Day ${streakDay} Complete`,
        "",
        "Kaalay tartankan streak-ga ka qaybgal!",
        SHARE_LINK
    ].join("\n");

    const shareURL =
        "https://wa.me/?text=" +
        encodeURIComponent(message);

    window.open(
        shareURL,
        "_blank",
        "noopener,noreferrer"
    );
}


/* =========================
   GENERATED POP SOUND
========================= */

function playPopSound() {
    try {
        const AudioContextClass =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContextClass) {
            return;
        }

        if (!audioContext) {
            audioContext =
                new AudioContextClass();
        }

        if (
            audioContext.state ===
            "suspended"
        ) {
            audioContext.resume();
        }

        const oscillator =
            audioContext.createOscillator();

        const gain =
            audioContext.createGain();

        oscillator.type =
            "triangle";

        oscillator.frequency
            .setValueAtTime(
                520,
                audioContext.currentTime
            );

        oscillator.frequency
            .exponentialRampToValueAtTime(
                760,
                audioContext.currentTime +
                0.07
            );

        gain.gain.setValueAtTime(
            0.09,
            audioContext.currentTime
        );

        gain.gain
            .exponentialRampToValueAtTime(
                0.001,
                audioContext.currentTime +
                0.11
            );

        oscillator.connect(gain);

        gain.connect(
            audioContext.destination
        );

        oscillator.start();

        oscillator.stop(
            audioContext.currentTime +
            0.12
        );
    } catch (error) {
        console.warn(
            "Sound could not play:",
            error
        );
    }
}


/* =========================
   CLICK PARTICLES
========================= */

function createParticles(button) {
    const rect =
        button.getBoundingClientRect();

    const centerX =
        rect.left +
        rect.width / 2;

    const centerY =
        rect.top +
        rect.height / 2;

    const colors = [
        "#ffffff",
        "#f5d0fe",
        "#e9d5ff",
        "#fbcfe8",
        "#ddd6fe",
        "#f0abfc"
    ];

    const particleCount = 16;

    for (
        let index = 0;
        index < particleCount;
        index++
    ) {
        const particle =
            document.createElement(
                "span"
            );

        const angle =
            (
                Math.PI *
                2 *
                index
            ) /
                particleCount +
            Math.random() *
                0.35;

        const distance =
            38 +
            Math.random() *
                45;

        const moveX =
            Math.cos(angle) *
            distance;

        const moveY =
            Math.sin(angle) *
            distance;

        const size =
            6 +
            Math.random() *
                7;

        particle.className =
            "particle";

        particle.style.left =
            `${centerX}px`;

        particle.style.top =
            `${centerY}px`;

        particle.style.width =
            `${size}px`;

        particle.style.height =
            `${size}px`;

        particle.style.background =
            colors[
                Math.floor(
                    Math.random() *
                    colors.length
                )
            ];

        particle.style.setProperty(
            "--particle-x",
            `${moveX}px`
        );

        particle.style.setProperty(
            "--particle-y",
            `${moveY}px`
        );

        document.body.appendChild(
            particle
        );

        particle.addEventListener(
            "animationend",
            () => {
                particle.remove();
            },
            {
                once: true
            }
        );
    }
}


/* =========================
   BUTTON CLICK EFFECTS
========================= */

document.addEventListener(
    "click",
    event => {
        const button =
            event.target.closest(
                "button"
            );

        if (!button) {
            return;
        }

        playPopSound();
        createParticles(button);
    }
);


/* =========================
   FUNCTIONS USED BY HTML
========================= */

window.goTo = goTo;

window.startQuiz =
    startQuiz;

window.answerAndContinue =
    answerAndContinue;

window.finishQuiz =
    finishQuiz;

window.shareResultsOnWhatsApp =
    shareResultsOnWhatsApp;

/* =========================
   INFO MENU
========================= */

function toggleInfoMenu() {
    const menu = document.getElementById("infoMenu");

    if (!menu) return;

    menu.classList.toggle("show");
}

document.addEventListener("click", function (event) {

    const menu = document.getElementById("infoMenu");
    const button = document.querySelector(".infoButton");

    if (!menu || !button) return;

    if (
        !menu.contains(event.target) &&
        !button.contains(event.target)
    ) {
        menu.classList.remove("show");
    }

});

/* =========================================================
   STREAK CHALLENGE GAME
   Runs only on streak-game.html
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // Stop immediately when this is not the streak game page.
  if (!document.body.classList.contains("streak-game-page")) {
    return;
  }

  /* =======================================================
     PAGE ELEMENTS
  ======================================================= */

  const introScreen = document.getElementById("streakIntro");
  const beginButton = document.getElementById("beginStreakButton");
  const tutorialStatus = document.getElementById("tutorialStatus");

  const gameScreen = document.getElementById("streakGame");
  const gameArea = document.getElementById("gameArea");
  const gameMessage = document.getElementById("gameMessage");

  const targetButton = document.getElementById("targetButton");
  const targetRing = document.getElementById("targetRing");
  const missAnimation = document.getElementById("missAnimation");

  const currentStageDisplay = document.getElementById("currentStage");
  const currentCircleDisplay = document.getElementById("currentCircle");
  const stageTimerDisplay = document.getElementById("stageTimerValue");
  const stageProgressFill = document.getElementById(
    "stageProgressFill"
  );

  const stageCompleteOverlay = document.getElementById(
    "stageCompleteOverlay"
  );

  const completedStageNumber = document.getElementById(
    "completedStageNumber"
  );

  const remainingStagesText = document.getElementById(
    "remainingStagesText"
  );

  const stageBoxes = Array.from(
    document.querySelectorAll(".stage-box")
  );

  const missedOverlay = document.getElementById("missedOverlay");

  const successScreen = document.getElementById(
    "streakSuccessScreen"
  );

  const finalStreakNumber = document.getElementById(
    "finalStreakNumber"
  );

  const viewResultsButton = document.getElementById(
    "viewResultsButton"
  );

  const gameAnnouncement = document.getElementById(
    "gameAnnouncement"
  );

  /* =======================================================
     REQUIRED ELEMENT CHECK
  ======================================================= */

  const requiredElements = [
    introScreen,
    beginButton,
    tutorialStatus,
    gameScreen,
    gameArea,
    gameMessage,
    targetButton,
    targetRing,
    missAnimation,
    currentStageDisplay,
    currentCircleDisplay,
    stageTimerDisplay,
    stageProgressFill,
    stageCompleteOverlay,
    completedStageNumber,
    remainingStagesText,
    missedOverlay,
    successScreen,
    finalStreakNumber,
    viewResultsButton
  ];

  if (requiredElements.some((element) => !element)) {
    console.error(
      "The streak game could not start because one or more HTML elements are missing."
    );

    return;
  }

  /* =======================================================
     GAME SETTINGS
  ======================================================= */

  const TOTAL_STAGES = 10;
  const CIRCLES_PER_STAGE = 3;

  // The tutorial lasts five seconds before the button appears.
  const TUTORIAL_DURATION = 5000;

  // Pause between each circle.
  const CIRCLE_PAUSE_DURATION = 500;

  // Time shown before the first circle of a stage.
  const STAGE_READY_DURATION = 700;

  // Time shown after completing a stage.
  const STAGE_COMPLETE_DURATION = 2400;

  // Time the red X remains visible.
  const MISS_ANIMATION_DURATION = 700;

  // Time the miss overlay remains visible.
  const MISSED_OVERLAY_DURATION = 1700;

  // Time allowed for each circle in every stage.
  // Stage 10 lasts exactly 0.5 seconds.
  const STAGE_TIMES = [
    2.0,
    1.85,
    1.7,
    1.55,
    1.4,
    1.25,
    1.1,
    0.9,
    0.7,
    0.5
  ];

  /* =======================================================
     STORAGE KEYS
  ======================================================= */

  /*
    The game saves both "streakDays" and "streak" so it can
    work with either name if your older website code used one
    of them.
  */

  const STORAGE_KEYS = {
    streakDays: "streakDays",
    olderStreakKey: "streak",
    lastCompletedDate: "lastStreakDate",
    completedToday: "streakCompletedToday",
    resultsMode: "resultsMode",
    alternateResultsMode: "resultMode"
  };

  /* =======================================================
     GAME STATE
  ======================================================= */

  let currentStage = 1;
  let currentCircle = 1;

  let targetTimeout = null;
  let actionTimeout = null;
  let overlayTimeout = null;

  let targetIsActive = false;
  let gameIsRunning = false;
  let inputIsLocked = true;
  let gameHasFinished = false;

  /* =======================================================
     GENERAL HELPERS
  ======================================================= */

  function clearTimer(timer) {
    if (timer !== null) {
      window.clearTimeout(timer);
    }
  }

  function clearAllGameTimers() {
    clearTimer(targetTimeout);
    clearTimer(actionTimeout);
    clearTimer(overlayTimeout);

    targetTimeout = null;
    actionTimeout = null;
    overlayTimeout = null;
  }

  function announce(message) {
    if (!gameAnnouncement) {
      return;
    }

    gameAnnouncement.textContent = "";

    window.setTimeout(() => {
      gameAnnouncement.textContent = message;
    }, 20);
  }

  function getTodayDateKey() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function getYesterdayDateKey() {
    const yesterday = new Date();

    yesterday.setDate(yesterday.getDate() - 1);

    const year = yesterday.getFullYear();
    const month = String(yesterday.getMonth() + 1).padStart(
      2,
      "0"
    );
    const day = String(yesterday.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function getStoredStreak() {
    const mainValue = Number.parseInt(
      localStorage.getItem(STORAGE_KEYS.streakDays),
      10
    );

    const olderValue = Number.parseInt(
      localStorage.getItem(STORAGE_KEYS.olderStreakKey),
      10
    );

    if (Number.isFinite(mainValue) && mainValue >= 0) {
      return mainValue;
    }

    if (Number.isFinite(olderValue) && olderValue >= 0) {
      return olderValue;
    }

    return 0;
  }

  function saveStreak(streakValue) {
    const safeValue = Math.max(
      0,
      Number.parseInt(streakValue, 10) || 0
    );

    localStorage.setItem(
      STORAGE_KEYS.streakDays,
      String(safeValue)
    );

    localStorage.setItem(
      STORAGE_KEYS.olderStreakKey,
      String(safeValue)
    );
  }

  function getCurrentStageTime() {
    return STAGE_TIMES[currentStage - 1];
  }

  function getCurrentStageTimeMilliseconds() {
    return getCurrentStageTime() * 1000;
  }

  /* =======================================================
     TUTORIAL BUTTON REVEAL
  ======================================================= */

  function unlockBeginButton() {
    beginButton.disabled = false;
    beginButton.removeAttribute("aria-hidden");
    beginButton.classList.remove("hidden");

    tutorialStatus.classList.add("finished");

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        beginButton.classList.add("show");
      });
    });

    window.setTimeout(() => {
      tutorialStatus.textContent = "Diyaar ma tahay?";
      tutorialStatus.classList.remove("finished");
    }, 380);

    announce("Badhanka Bilow hadda waa diyaar.");
  }

  beginButton.disabled = true;
  beginButton.setAttribute("aria-hidden", "true");
  beginButton.classList.add("hidden");
  beginButton.classList.remove("show");

  window.setTimeout(unlockBeginButton, TUTORIAL_DURATION);

  /* =======================================================
     DISPLAY UPDATES
  ======================================================= */

  function updateGameDisplay() {
    currentStageDisplay.textContent = String(currentStage);
    currentCircleDisplay.textContent = String(currentCircle);

    stageTimerDisplay.textContent =
      getCurrentStageTime().toFixed(2).replace(/0$/, "");

    const completedStages = currentStage - 1;
    const progressPercentage =
      (completedStages / TOTAL_STAGES) * 100;

    stageProgressFill.style.width = `${progressPercentage}%`;
  }

  function updateStageBoxes(completedStages) {
    stageBoxes.forEach((box, index) => {
      const stageNumber = index + 1;

      box.classList.remove("completed", "next-stage");

      if (stageNumber <= completedStages) {
        box.classList.add("completed");
      } else if (
        stageNumber === completedStages + 1 &&
        completedStages < TOTAL_STAGES
      ) {
        box.classList.add("next-stage");
      }
    });
  }

  function updateRemainingStagesMessage(completedStage) {
    const remainingStages = TOTAL_STAGES - completedStage;

    if (remainingStages === 1) {
      remainingStagesText.textContent =
        "Waxa kuu hadhay hal stage.";
      return;
    }

    if (remainingStages === 0) {
      remainingStagesText.textContent =
        "Dhammaan stage-yada waad dhammeeysay.";
      return;
    }

    remainingStagesText.textContent =
      `Waxa kuu hadhay ${remainingStages} stage.`;
  }

  /* =======================================================
     TARGET POSITION
  ======================================================= */

  function placeTargetRandomly() {
    const gameAreaWidth = gameArea.clientWidth;
    const gameAreaHeight = gameArea.clientHeight;

    const targetWidth = targetButton.offsetWidth || 150;
    const targetHeight = targetButton.offsetHeight || 150;

    const horizontalPadding = 18;
    const topPadding = 75;
    const bottomPadding = 18;

    const minimumX = horizontalPadding;
    const maximumX = Math.max(
      minimumX,
      gameAreaWidth - targetWidth - horizontalPadding
    );

    const minimumY = topPadding;
    const maximumY = Math.max(
      minimumY,
      gameAreaHeight - targetHeight - bottomPadding
    );

    const randomX =
      minimumX + Math.random() * (maximumX - minimumX);

    const randomY =
      minimumY + Math.random() * (maximumY - minimumY);

    targetButton.style.left = `${Math.round(randomX)}px`;
    targetButton.style.top = `${Math.round(randomY)}px`;
  }

  /* =======================================================
     TARGET VISIBILITY AND ANIMATION
  ======================================================= */

  function hideTarget() {
    targetIsActive = false;

    clearTimer(targetTimeout);
    targetTimeout = null;

    targetButton.classList.add("hidden");
    targetButton.classList.remove("target-hit");

    targetRing.classList.remove("ring-shrinking");
    targetRing.style.animationDuration = "";
  }

  function restartRingAnimation(durationSeconds) {
    targetRing.classList.remove("ring-shrinking");

    // Reading offsetWidth forces the browser to restart the animation.
    void targetRing.offsetWidth;

    targetRing.style.animationDuration = `${durationSeconds}s`;
    targetRing.classList.add("ring-shrinking");
  }

  function showTarget() {
    if (
      !gameIsRunning ||
      inputIsLocked ||
      gameHasFinished
    ) {
      return;
    }

    hideTarget();

    targetButton.classList.remove("hidden");
    placeTargetRandomly();

    const stageTime = getCurrentStageTime();

    restartRingAnimation(stageTime);

    targetIsActive = true;

    gameMessage.textContent = "Riix hadda!";

    announce(
      `Stage ${currentStage}, kubbadda ${currentCircle}.`
    );

    targetTimeout = window.setTimeout(() => {
      handleMiss();
    }, getCurrentStageTimeMilliseconds());
  }

  /* =======================================================
     STAGE START
  ======================================================= */

  function startCurrentStage() {
    if (!gameIsRunning || gameHasFinished) {
      return;
    }

    clearAllGameTimers();
    hideTarget();

    inputIsLocked = true;
    currentCircle = 1;

    updateGameDisplay();

    gameMessage.textContent =
      `Stage ${currentStage} — Is diyaari...`;

    announce(`Stage ${currentStage} ayaa bilaabanaya.`);

    actionTimeout = window.setTimeout(() => {
      inputIsLocked = false;
      showTarget();
    }, STAGE_READY_DURATION);
  }

  /* =======================================================
     SUCCESSFUL TARGET CLICK
  ======================================================= */

  function handleTargetHit() {
    if (
      !targetIsActive ||
      inputIsLocked ||
      !gameIsRunning ||
      gameHasFinished
    ) {
      return;
    }

    targetIsActive = false;
    inputIsLocked = true;

    clearTimer(targetTimeout);
    targetTimeout = null;

    targetRing.classList.remove("ring-shrinking");
    targetButton.classList.add("target-hit");

    gameMessage.textContent = "Waa sax!";

    announce("Waa sax.");

    actionTimeout = window.setTimeout(() => {
      hideTarget();

      if (currentCircle < CIRCLES_PER_STAGE) {
        currentCircle += 1;
        currentCircleDisplay.textContent = String(currentCircle);

        gameMessage.textContent = "Midka xiga...";

        actionTimeout = window.setTimeout(() => {
          inputIsLocked = false;
          showTarget();
        }, CIRCLE_PAUSE_DURATION);

        return;
      }

      completeCurrentStage();
    }, 320);
  }

  targetButton.addEventListener("click", handleTargetHit);

  targetButton.addEventListener(
    "touchstart",
    (event) => {
      if (targetIsActive) {
        event.preventDefault();
      }
    },
    { passive: false }
  );

  /* =======================================================
     MISSED TARGET
  ======================================================= */

  function showMissAnimation() {
    missAnimation.classList.remove("hidden");

    const cross = missAnimation.querySelector("span");

    if (cross) {
      cross.style.animation = "none";
      void cross.offsetWidth;
      cross.style.animation = "";
    }
  }

  function hideMissAnimation() {
    missAnimation.classList.add("hidden");
  }

  function handleMiss() {
    if (
      !targetIsActive ||
      !gameIsRunning ||
      gameHasFinished
    ) {
      return;
    }

    targetIsActive = false;
    inputIsLocked = true;

    clearTimer(targetTimeout);
    targetTimeout = null;

    targetRing.classList.remove("ring-shrinking");
    targetButton.classList.add("hidden");

    gameMessage.textContent = "Waad seegtay.";

    showMissAnimation();
    announce("Waad seegtay.");

    actionTimeout = window.setTimeout(() => {
      hideMissAnimation();
      missedOverlay.classList.remove("hidden");

      announce(
        `Stage ${currentStage} wuxuu dib uga bilaabanayaa kubbadda koowaad.`
      );

      overlayTimeout = window.setTimeout(() => {
        missedOverlay.classList.add("hidden");
        startCurrentStage();
      }, MISSED_OVERLAY_DURATION);
    }, MISS_ANIMATION_DURATION);
  }

  /* =======================================================
     STAGE COMPLETION
  ======================================================= */

  function completeCurrentStage() {
    inputIsLocked = true;
    hideTarget();

    const completedStage = currentStage;

    completedStageNumber.textContent = String(completedStage);

    updateStageBoxes(completedStage);
    updateRemainingStagesMessage(completedStage);

    stageProgressFill.style.width =
      `${(completedStage / TOTAL_STAGES) * 100}%`;

    stageCompleteOverlay.classList.remove("hidden");

    announce(`Stage ${completedStage} waa la dhammeeyay.`);

    overlayTimeout = window.setTimeout(() => {
      stageCompleteOverlay.classList.add("hidden");

      if (completedStage >= TOTAL_STAGES) {
        finishEntireGame();
        return;
      }

      currentStage += 1;
      currentCircle = 1;

      updateGameDisplay();
      startCurrentStage();
    }, STAGE_COMPLETE_DURATION);
  }

  /* =======================================================
     STREAK SAVING
  ======================================================= */

  function completeDailyStreak() {
    const today = getTodayDateKey();
    const yesterday = getYesterdayDateKey();

    const previousCompletionDate = localStorage.getItem(
      STORAGE_KEYS.lastCompletedDate
    );

    let currentStreak = getStoredStreak();

    // Do not increase the streak twice on the same day.
    if (previousCompletionDate === today) {
      localStorage.setItem(
        STORAGE_KEYS.completedToday,
        "true"
      );

      return currentStreak;
    }

    // Continue the streak when the previous completion was yesterday.
    if (previousCompletionDate === yesterday) {
      currentStreak += 1;
    } else {
      // Start a new streak when at least one full day was missed.
      currentStreak = 1;
    }

    saveStreak(currentStreak);

    localStorage.setItem(
      STORAGE_KEYS.lastCompletedDate,
      today
    );

    localStorage.setItem(
      STORAGE_KEYS.completedToday,
      "true"
    );

    return currentStreak;
  }

  /* =======================================================
     FINAL SUCCESS SCREEN
  ======================================================= */

  function finishEntireGame() {
    if (gameHasFinished) {
      return;
    }

    gameHasFinished = true;
    gameIsRunning = false;
    inputIsLocked = true;

    clearAllGameTimers();
    hideTarget();

    const updatedStreak = completeDailyStreak();

    finalStreakNumber.textContent = String(updatedStreak);

    gameScreen.classList.add("hidden");
    successScreen.classList.remove("hidden");

    localStorage.setItem(
      STORAGE_KEYS.resultsMode,
      "streak"
    );

    localStorage.setItem(
      STORAGE_KEYS.alternateResultsMode,
      "streak"
    );

    sessionStorage.setItem(
      STORAGE_KEYS.resultsMode,
      "streak"
    );

    sessionStorage.setItem(
      STORAGE_KEYS.alternateResultsMode,
      "streak"
    );

    announce(
      `Hambalyo. Streak-gaagu hadda waa ${updatedStreak} maalmood.`
    );
  }

  /* =======================================================
     BEGIN GAME
  ======================================================= */

  function beginGame() {
    if (
      beginButton.disabled ||
      gameIsRunning ||
      gameHasFinished
    ) {
      return;
    }

    beginButton.disabled = true;

    clearAllGameTimers();

    currentStage = 1;
    currentCircle = 1;

    targetIsActive = false;
    inputIsLocked = true;
    gameIsRunning = true;
    gameHasFinished = false;

    introScreen.classList.add("hidden");
    successScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    missedOverlay.classList.add("hidden");
    stageCompleteOverlay.classList.add("hidden");
    hideMissAnimation();

    updateStageBoxes(0);
    updateGameDisplay();

    window.requestAnimationFrame(() => {
      startCurrentStage();
    });
  }

  beginButton.addEventListener("click", beginGame);

  /* =======================================================
     RESULTS BUTTON
  ======================================================= */

  viewResultsButton.addEventListener("click", () => {
    localStorage.setItem(
      STORAGE_KEYS.resultsMode,
      "streak"
    );

    localStorage.setItem(
      STORAGE_KEYS.alternateResultsMode,
      "streak"
    );

    sessionStorage.setItem(
      STORAGE_KEYS.resultsMode,
      "streak"
    );

    sessionStorage.setItem(
      STORAGE_KEYS.alternateResultsMode,
      "streak"
    );

    window.location.href = "results.html";
  });

  /* =======================================================
     WINDOW RESIZING
  ======================================================= */

  window.addEventListener("resize", () => {
    if (targetIsActive && !targetButton.classList.contains("hidden")) {
      placeTargetRandomly();
    }
  });

  /* =======================================================
     PAGE VISIBILITY PROTECTION
  ======================================================= */

  /*
    Leaving the tab while a target is active counts as a miss.
    This prevents the ring timer and target from becoming
    unsynchronized when the browser pauses background tabs.
  */

  document.addEventListener("visibilitychange", () => {
    if (
      document.hidden &&
      targetIsActive &&
      gameIsRunning &&
      !gameHasFinished
    ) {
      handleMiss();
    }
  });

  /* =======================================================
     INITIAL PAGE STATE
  ======================================================= */

  gameScreen.classList.add("hidden");
  successScreen.classList.add("hidden");
  stageCompleteOverlay.classList.add("hidden");
  missedOverlay.classList.add("hidden");
  targetButton.classList.add("hidden");
  missAnimation.classList.add("hidden");

  updateStageBoxes(0);
  updateGameDisplay();
});
