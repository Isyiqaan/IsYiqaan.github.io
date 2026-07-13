"use strict";

/* =========================
   SETTINGS
========================= */

const TOTAL_QUESTIONS = 10;
const PAGE_TRANSITION_TIME = 380;
const RESULTS_LOCK_TIME = 12 * 60 * 60 * 1000;

/*
Change these names and starting streaks
to whatever you want.
*/

const leaderboardPlayers = [
    { name: "S/l boy", startingStreak: 14 },
    { name: "Dilaaga 💀 ", startingStreak: 10 },
    { name: "Samsam 🌺", startingStreak: 9 },
    { name: "Ahmed", startingStreak: 7 },
    { name: "Ghost", startingStreak: 4 }
];

/*
Set this to the date you want all streaks
to begin increasing from.

Format: YYYY-MM-DD
*/

const LEADERBOARD_START_DATE = "2026-07-14";

let isNavigating = false;
let audioContext = null;


/* =========================
   PAGE STARTUP
========================= */

document.addEventListener("DOMContentLoaded", () => {

    handleResultsLock();
    redirectUnnamedPlayer();
    redirectReturningPlayer();

    requestAnimationFrame(() => {
        document.body.classList.add("loaded");
    });

    updateProgressBar();
    fillPlayerNameElements();
    prepareNameInput();
    updateWelcomeMessage();

    displayLeaderboard();
    displayPersonalityResults();
    displayStreakDay();

});


/* =========================
   GENERATED POP SOUND
   No MP3 file is required
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

        oscillator.type = "sine";

        oscillator.frequency.setValueAtTime(
            520,
            audioContext.currentTime
        );

        oscillator.frequency
            .exponentialRampToValueAtTime(
                760,
                audioContext.currentTime + 0.07
            );

        gain.gain.setValueAtTime(
            0.09,
            audioContext.currentTime
        );

        gain.gain
            .exponentialRampToValueAtTime(
                0.001,
                audioContext.currentTime + 0.11
            );

        oscillator.connect(gain);
        gain.connect(
            audioContext.destination
        );

        oscillator.start();

        oscillator.stop(
            audioContext.currentTime + 0.12
        );
    } catch (error) {
        console.warn(
            "Sound could not play:",
            error
        );
    }
}


/* =========================
   CIRCLE PARTICLES
========================= */

function createParticles(button) {
    if (!button) {
        return;
    }

    const rect =
        button.getBoundingClientRect();

    const centerX =
        rect.left + rect.width / 2;

    const centerY =
        rect.top + rect.height / 2;

    const colors = [
        "#ffffff",
        "#f5d0fe",
        "#e9d5ff",
        "#fbcfe8",
        "#ddd6fe",
        "#f0abfc"
    ];

    const particleCount = 10;

    for (
        let i = 0;
        i < particleCount;
        i++
    ) {
        const particle =
            document.createElement("span");

        particle.className =
            "particle";

        const angle =
            (Math.PI * 2 * i) /
                particleCount +
            Math.random() * 0.35;

        const distance =
            38 + Math.random() * 45;

        const moveX =
            Math.cos(angle) * distance;

        const moveY =
            Math.sin(angle) * distance;

        const size =
            6 + Math.random() * 7;

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
            { once: true }
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
            event.target.closest("button");

        if (!button) {
            return;
        }

        playPopSound();
        createParticles(button);
    }
);


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

    document.body.classList.add(
        "fade-out"
    );

    window.setTimeout(() => {
        window.location.href = page;
    }, PAGE_TRANSITION_TIME);
}


/* =========================
   SAVE PLAYER NAME
========================= */

function startQuiz() {
    const input =
        document.getElementById("name");

    if (!input) {
        console.error(
            'Name input with id="name" was not found.'
        );

        return;
    }

    const playerName =
        input.value.trim();

    if (playerName === "") {
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
    const input =
        document.getElementById("name");

    if (!input) {
        return;
    }

    createWarningMessage(input);

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

function createWarningMessage(input) {
    if (
        document.getElementById(
            "nameWarning"
        )
    ) {
        return;
    }

    const warning =
        document.createElement("p");

    warning.id = "nameWarning";
    warning.className = "warning";

    warning.textContent =
        "Please enter your name first.";

    const parent =
        input.parentElement;

    if (parent) {
        parent.appendChild(warning);
    }
}

function showNameWarning() {
    const warning =
        document.getElementById(
            "nameWarning"
        );

    if (warning) {
        warning.classList.add("show");
    }
}

function hideNameWarning() {
    const warning =
        document.getElementById(
            "nameWarning"
        );

    if (warning) {
        warning.classList.remove(
            "show"
        );
    }
}


/* =========================
   DISPLAY PLAYER NAME

   Use:
   <span data-player-name></span>
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
   FIRST VISIT / WELCOME BACK
========================= */

function updateWelcomeMessage() {
    const welcomeText =
        document.getElementById(
            "welcomeText"
        );

    if (!welcomeText) {
        return;
    }

    const completedDay =
        localStorage.getItem(
            "completedDay"
        );

    if (completedDay) {
        welcomeText.textContent =
            "Welcome back";
    } else {
        welcomeText.textContent =
            "Welcome";
    }
}

/* =========================
   SEND NEW PLAYERS TO
   THE WELCOME PAGE
========================= */

function redirectUnnamedPlayer() {
    const currentPage =
        getCurrentPageName();

    const savedName =
        localStorage.getItem(
            "playerName"
        );

    /*
    Stay on welcome.html so the new
    player can enter their name.
    */

    if (
        currentPage === "welcome.html"
    ) {
        return false;
    }

    /*
    If there is no saved name, block
    access to every other page.
    */

    if (!savedName) {
        window.location.replace(
            "welcome.html"
        );

        return true;
    }

    return false;
}

/* =========================
   SKIP WELCOME PAGE
   FOR RETURNING PLAYERS
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

    if (
        pageName === "results.html"
    ) {
        progress = 100;
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
            progress =
                parsedProgress;
        }
    }

    progress = Math.max(
        0,
        Math.min(100, progress)
    );

    progressFill.style.width =
        "0%";

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

function answerAndContinue(
    nextPage
) {
    goTo(nextPage);
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
        returnTime.toString()
    );

    const oldCompletedDay =
        Number(
            localStorage.getItem(
                "completedDay"
            )
        ) || 0;

    const newCompletedDay =
        Math.max(
            1,
            oldCompletedDay + 1
        );

    localStorage.setItem(
        "completedDay",
        newCompletedDay.toString()
    );

    generatePersonalityResults();

    goTo("results.html");
}

/* =========================
   12-HOUR RESULTS LOCK
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
        Date.now() <
        savedReturnTime;

    if (lockIsActive) {
        if (
            currentPage !==
            "results.html"
        ) {
            window.location.replace(
                "results.html"
            );
        }

        return;
    }

    localStorage.removeItem(
        "resultsReturnTime"
    );

    if (
        currentPage ===
        "results.html"
    ) {
        window.location.replace(
            "index.html"
        );
    }
}


/* =========================
   AUTOMATIC DAILY LEADERBOARD
========================= */

function getDaysPassed() {
    const startDate =
        new Date(
            `${LEADERBOARD_START_DATE}T00:00:00`
        );

    const today =
        new Date();

    startDate.setHours(
        0,
        0,
        0,
        0
    );

    today.setHours(
        0,
        0,
        0,
        0
    );

    const millisecondsPerDay =
        1000 * 60 * 60 * 24;

    return Math.max(
        0,
        Math.floor(
            (today - startDate) /
            millisecondsPerDay
        )
    );
}

function displayLeaderboard() {
    const leaderboard =
        document.getElementById(
            "leaderboard"
        );

    if (!leaderboard) {
        return;
    }

    const extraDays =
        getDaysPassed();

    const updatedPlayers =
        leaderboardPlayers
            .map(player => ({
                name: player.name,
                streak:
                    player.startingStreak +
                    extraDays
            }))
            .sort(
                (playerA, playerB) =>
                    playerB.streak -
                    playerA.streak
            );

    leaderboard.innerHTML = "";

    updatedPlayers.forEach(
        (player, index) => {
            const row =
                document.createElement(
                    "div"
                );

            row.className =
                "leaderboard-row";

            let position =
                `${index + 1}.`;

            if (index === 0) {
                position = "🥇";
            } else if (
                index === 1
            ) {
                position = "🥈";
            } else if (
                index === 2
            ) {
                position = "🥉";
            }

            const positionAndName =
                document.createElement(
                    "span"
                );

            positionAndName.textContent =
                `${position} ${player.name}`;

            const streak =
                document.createElement(
                    "span"
                );

            streak.textContent =
                `🔥 Day ${player.streak}`;

            row.appendChild(
                positionAndName
            );

            row.appendChild(streak);

            leaderboard.appendChild(
                row
            );
        }
    );
}

/* =========================
   RANDOM PERSONALITY RESULTS
========================= */

const personalityTraits = [
    {
        name: "Xaraabaad",
        emoji: "😂",
        minimum: 65,
        maximum: 99
    },
    {
        name: "Maskax",
        emoji: "🧠",
        minimum: 65,
        maximum: 99
    },
    {
        name: "Daryeel",
        emoji: "❤️",
        minimum: 65,
        maximum: 99
    },
    {
        name: "Hal abuur",
        emoji: "🎨",
        minimum: 55,
        maximum: 97
    },
    {
        name: "Kalsooni",
        emoji: "💪",
        minimum: 45,
        maximum: 95
    },
    {
        name: "Daacad",
        emoji: "🤝",
        minimum: 65,
        maximum: 99
    },
    {
        name: "Xiiso",
        emoji: "🔍",
        minimum: 50,
        maximum: 96
    },
    {
        name: "Safar doonid",
        emoji: "🧭",
        minimum: 40,
        maximum: 94
    },
    {
        name: "Daganaan",
        emoji: "😌",
        minimum: 40,
        maximum: 92
    },
    {
        name: "Hami",
        emoji: "🚀",
        minimum: 55,
        maximum: 98
    },
    {
        name: "Qurux",
        emoji: "✨",
        minimum: 80,
        maximum: 97
    },
    {
        name: "Madax-banaan",
        emoji: "🦅",
        minimum: 45,
        maximum: 95
    },
    {
        name: "rajo",
        emoji: "🌈",
        minimum: 50,
        maximum: 96
    },
    {
        name: "Dulqaad",
        emoji: "🌿",
        minimum: 35,
        maximum: 90
    },
    {
        name: "firfircooni",
        emoji: "⚡",
        minimum: 45,
        maximum: 97
    },
    {
        name: "Tartameeye",
        emoji: "🏆",
        minimum: 35,
        maximum: 91
    },
    {
        name: "Hurdoole",
        emoji: "😴",
        minimum: 5,
        maximum: 60
    },
    {
        name: "Fikir",
        emoji: "💭",
        minimum: 15,
        maximum: 78
    },
    {
        name: "ilow",
        emoji: "📝",
        minimum: 5,
        maximum: 58
    },
    {
        name: "Jees-jees",
        emoji: "😏",
        minimum: 20,
        maximum: 85
    },
];


/* =========================
   RANDOM NUMBER
========================= */

function randomNumber(
    minimum,
    maximum
) {
    return Math.floor(
        Math.random() *
        (maximum - minimum + 1)
    ) + minimum;
}


/* =========================
   SHUFFLE ARRAY
========================= */

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


/* =========================
   CREATE NEW RESULTS
========================= */

function generatePersonalityResults() {
    const selectedTraits =
        shuffleArray(
            personalityTraits
        ).slice(0, 7);

    const results =
        selectedTraits.map(trait => ({
            name: trait.name,
            emoji: trait.emoji,
            percentage:
                randomNumber(
                    trait.minimum,
                    trait.maximum
                )
        }));

    results.sort(
        (resultA, resultB) =>
            resultB.percentage -
            resultA.percentage
    );

    localStorage.setItem(
        "personalityResults",
        JSON.stringify(results)
    );
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
                Array.isArray(parsedResults) &&
                parsedResults.length > 0
            ) {
                return parsedResults;
            }
        } catch (error) {
            console.warn(
                "Saved results could not be read:",
                error
            );
        }
    }

    generatePersonalityResults();

    const newResults =
        localStorage.getItem(
            "personalityResults"
        );

    return newResults
        ? JSON.parse(newResults)
        : [];
}


/* =========================
   DISPLAY RESULTS
========================= */

function displayPersonalityResults() {
    const resultsContainer =
        document.getElementById(
            "personalityResults"
        );

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

            trait.className = "trait";

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

            const traitPercentage =
                document.createElement(
                    "span"
                );

            traitPercentage.className =
                "traitPercent";

            traitPercentage.textContent =
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

            traitFill.style.width = "0%";

            traitHeader.appendChild(
                traitName
            );

            traitHeader.appendChild(
                traitPercentage
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
   SHARE RESULTS ON WHATSAPP
========================= */

function shareResultsOnWhatsApp() {
    const playerName =
        localStorage.getItem(
            "playerName"
        ) || "Player";

    const streakDay =
        Number(
            localStorage.getItem(
                "completedDay"
            )
        ) || 1;

    const results =
        getPersonalityResults();

    const resultLines =
        results.map(result =>
            `${result.emoji} ${result.name}: ${result.percentage}%`
        );

    const message = [
        `✨ ${playerName}'s Shakhsiyadooda  ✨`,
        "",
        ...resultLines,
        "",
        `🔥 Streak Day ${streakDay} Complete`,
        "",
        "Kaalay Tartankan Streakga ka qaybgal!",
       "https://isyiqaan.github.io/welcome.html"
    ].join("\n");

    const shareURL =
        `https://wa.me/?text=${
            encodeURIComponent(message)
        }`;

    window.open(
        shareURL,
        "_blank",
        "noopener,noreferrer"
    );
}
/* =========================
   DISPLAY PLAYER STREAK DAY
========================= */

function displayStreakDay() {
    const streakElement =
        document.getElementById(
            "streakDay"
        );

    if (!streakElement) {
        return;
    }

    const completedDay =
        Number(
            localStorage.getItem(
                "completedDay"
            )
        ) || 1;

    streakElement.textContent =
        completedDay;
}
/* =========================
   CURRENT PAGE FILE NAME
========================= */

function getCurrentPageName() {
    const pageName =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();

    return pageName ||
        "index.html";
}


/* =========================
   FUNCTIONS AVAILABLE TO HTML
========================= */

window.goTo = goTo;
window.startQuiz = startQuiz;

window.answerAndContinue =
    answerAndContinue;

window.finishQuiz =
    finishQuiz;

window.shareResultsOnWhatsApp =
    shareResultsOnWhatsApp;
