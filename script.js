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

const LEADERBOARD_START_DATE = "2026-07-14";

const SHARE_LINK =
    "https://isyiqaan.github.io/welcome.html";

const leaderboardPlayers = [
    {
        name: "S/l boy",
        startingStreak: 14
    },
    {
        name: "Dilaaga 💀",
        startingStreak: 10
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
        name: "Daryeel",
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
