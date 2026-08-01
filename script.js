"use strict";

/* =========================================================
   ULTIMATE PERSONALITY TEST
   COMPLETE SCRIPT.JS
========================================================= */


/* =========================================================
   SETTINGS
========================================================= */

const TOTAL_QUESTIONS = 10;
const PAGE_TRANSITION_TIME = 380;

const LEADERBOARD_START_DATE = "2026-07-26";

const WEBSITE_LINK =
    "https://isyiqaan.github.io/";

const leaderboardPlayers = [
    {
        name: "S/l boy",
        startingStreak: 10
    },
    {
        name: "Dilaaga 💀",
        startingStreak: 8
    },
    {
        name: "Samsam 🌺",
        startingStreak: 6
    },
    {
        name: "Ahmed",
        startingStreak: 4
    },
    {
        name: "Ghost",
        startingStreak: 2
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
        name: "Hal-abuur",
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
        name: "Daacadnimo",
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
        name: "Safar-jacayl",
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
        name: "Madax-bannaani",
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
        name: "Fikir-badan",
        emoji: "💭",
        min: 15,
        max: 78
    },
    {
        name: "Ilow-badan",
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


/* =========================================================
   GLOBAL STATE
========================================================= */

let isNavigating = false;


/* =========================================================
   STORAGE KEYS
========================================================= */

const STORAGE_KEYS = {
    playerName: "playerName",
    personalityResults: "personalityResults",

    streak: "completedDay",
    alternateStreak: "streakDays",
    oldStreak: "streak",

    lastCompletedDate: "lastCompletedDate",
    oldLastCompletedDate: "lastStreakDate",
    streakBackup: "streakBackupV2",

    completedToday: "streakCompletedToday",

    resultsMode: "resultsMode",
    alternateResultsMode: "resultMode"
};


/* =========================================================
   BASIC HELPERS
========================================================= */

function byId(id) {
    return document.getElementById(id);
}

function query(selector) {
    return document.querySelector(selector);
}

function queryAll(selector) {
    return Array.from(
        document.querySelectorAll(selector)
    );
}

function getCurrentPageName() {
    const pathname =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();

    return pathname || "index.html";
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

function findFirstElement(selectors) {
    for (const selector of selectors) {
        const element =
            document.querySelector(selector);

        if (element) {
            return element;
        }
    }

    return null;
}

function setElementVisibility(
    element,
    shouldShow
) {
    if (!element) {
        return;
    }

    element.hidden = !shouldShow;

    element.classList.toggle(
        "hidden",
        !shouldShow
    );
}

function getLocalDateKey(
    date = new Date()
) {
    const year =
        date.getFullYear();

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

function getYesterdayDateKey() {
    const yesterday =
        new Date();

    yesterday.setDate(
        yesterday.getDate() - 1
    );

    return getLocalDateKey(yesterday);
}

function getDaysSince(dateText) {
    const [
        startYear,
        startMonth,
        startDay
    ] =
        dateText
            .split("-")
            .map(Number);

    const today =
        new Date();

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
            (
                todayTime -
                startTime
            ) /
            86400000
        )
    );
}


/* =========================================================
   COLORED STREAK FLAMES
========================================================= */

function getStreakFlameTier(streakDay) {
    const streak =
        Math.max(
            1,
            Number.parseInt(
                streakDay,
                10
            ) || 1
        );

    if (streak >= 100) {
        return {
            className: "flame-blue-crown",
            label: "Olol buluug ah oo taaj leh",
            shareEmoji: "Olol buluug",
            sideFlames: true,
            crown: true
        };
    }

    if (streak >= 75) {
        return {
            className: "flame-gold",
            label: "Olol dahabi ah",
            shareEmoji: "Olol dahabi",
            sideFlames: true,
            crown: false
        };
    }

    if (streak >= 50) {
        return {
            className: "flame-green",
            label: "Olol cagaar khafiif ah oo leh laba olol oo yaryar",
            shareEmoji: "Olol cagaar khafiif ah",
            sideFlames: true,
            crown: false
        };
    }

    if (streak >= 30) {
        return {
            className: "flame-purple",
            label: "Olol guduud-buluug ah",
            shareEmoji: "Olol purple",
            sideFlames: false,
            crown: false
        };
    }

    if (streak >= 20) {
        return {
            className: "flame-red",
            label: "Olol cas",
            shareEmoji: "Olol cas",
            sideFlames: true,
            crown: false
        };
    }

    if (streak >= 10) {
        return {
            className: "flame-pink",
            label: "Olol basali ah",
            shareEmoji: "Olol pink",
            sideFlames: false,
            crown: false
        };
    }

    return {
        className: "flame-orange",
        label: "Olol oranji ah",
        shareEmoji: "Olol oranji",
        sideFlames: false,
        crown: false
    };
}

let streakFlameInstanceId = 0;

function createStreakFlameElement(
    streakDay,
    extraClassName = ""
) {
    const tier =
        getStreakFlameTier(
            streakDay
        );

    const flame =
        document.createElement(
            "span"
        );

    flame.className =
        `streak-flame ${tier.className} ${extraClassName}`
            .trim();

    flame.setAttribute(
        "role",
        "img"
    );

    flame.setAttribute(
        "aria-label",
        tier.label
    );

    if (tier.crown) {
        const crown =
            document.createElement(
                "span"
            );

        crown.className =
            "streak-flame-crown";

        flame.appendChild(
            crown
        );
    }

    if (tier.sideFlames) {
        const leftFlame =
            document.createElement(
                "span"
            );

        leftFlame.className =
            "streak-flame-side streak-flame-left";

        const rightFlame =
            document.createElement(
                "span"
            );

        rightFlame.className =
            "streak-flame-side streak-flame-right";

        flame.append(
            leftFlame,
            rightFlame
        );
    }

    const svgNamespace =
        "http://www.w3.org/2000/svg";

    const mainFlame =
        document.createElementNS(
            svgNamespace,
            "svg"
        );

    mainFlame.classList.add(
        "streak-flame-svg"
    );

    mainFlame.setAttribute(
        "viewBox",
        "0 0 100 140"
    );

    mainFlame.setAttribute(
        "aria-hidden",
        "true"
    );

    streakFlameInstanceId += 1;

    const outerGradientId =
        `flameOuterGradient${streakFlameInstanceId}`;

    const middleGradientId =
        `flameMiddleGradient${streakFlameInstanceId}`;

    mainFlame.innerHTML = `
        <defs>
            <linearGradient id="${outerGradientId}" x1="18" y1="125" x2="78" y2="10" gradientUnits="userSpaceOnUse">
                <stop offset="0" stop-color="var(--flame-deep)" />
                <stop offset="0.48" stop-color="var(--flame-main)" />
                <stop offset="1" stop-color="var(--flame-light)" />
            </linearGradient>
            <linearGradient id="${middleGradientId}" x1="45" y1="126" x2="58" y2="45" gradientUnits="userSpaceOnUse">
                <stop offset="0" stop-color="var(--flame-inner)" />
                <stop offset="0.62" stop-color="var(--flame-light)" />
                <stop offset="1" stop-color="rgba(255,255,255,.96)" />
            </linearGradient>
        </defs>
        <g class="flame-body">
        <path class="flame-outer" style="fill:url(#${outerGradientId})" d="M50 137 C23 137 5 118 7 91 C8 73 18 58 29 44 C38 32 44 20 47 6 C64 19 72 36 68 55 C76 50 83 40 86 29 C98 48 100 67 95 86 C89 116 74 137 50 137 Z">
            <animate attributeName="d" dur="3.8s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.33;0.66;1" keySplines=".45 0 .55 1;.45 0 .55 1;.45 0 .55 1" values="M50 137 C23 137 5 118 7 91 C8 73 18 58 29 44 C38 32 44 20 47 6 C64 19 72 36 68 55 C76 50 83 40 86 29 C98 48 100 67 95 86 C89 116 74 137 50 137 Z;M50 137 C22 137 5 117 8 90 C10 72 22 57 34 43 C44 31 51 18 56 5 C68 22 72 39 65 57 C75 53 82 45 88 34 C97 52 99 69 94 88 C87 117 73 137 50 137 Z;M50 137 C24 137 6 119 7 92 C8 75 15 60 25 46 C33 34 39 21 38 8 C57 18 68 33 69 52 C76 45 80 36 81 25 C96 43 101 64 96 84 C90 115 75 137 50 137 Z;M50 137 C23 137 5 118 7 91 C8 73 18 58 29 44 C38 32 44 20 47 6 C64 19 72 36 68 55 C76 50 83 40 86 29 C98 48 100 67 95 86 C89 116 74 137 50 137 Z" />
        </path>
        <path class="flame-soft-light" d="M25 116 C18 94 29 76 42 59 C49 50 54 40 56 29 C66 43 67 59 61 75 C56 88 48 101 50 117 C41 107 33 107 25 116 Z" />
        <path class="flame-inner" style="fill:url(#${middleGradientId})" d="M51 127 C37 127 27 117 28 102 C29 91 36 84 42 75 C47 68 51 61 52 51 C65 62 71 75 67 88 C72 85 76 80 78 74 C85 86 85 98 80 108 C74 120 64 127 51 127 Z">
            <animate attributeName="d" dur="2.9s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines=".45 0 .55 1;.45 0 .55 1" values="M51 127 C37 127 27 117 28 102 C29 91 36 84 42 75 C47 68 51 61 52 51 C65 62 71 75 67 88 C72 85 76 80 78 74 C85 86 85 98 80 108 C74 120 64 127 51 127 Z;M51 127 C36 127 27 116 29 101 C30 90 38 82 45 73 C51 65 55 58 58 48 C68 61 72 76 66 89 C73 86 77 82 80 76 C85 89 84 101 78 110 C71 121 63 127 51 127 Z;M51 127 C37 127 27 117 28 102 C29 91 36 84 42 75 C47 68 51 61 52 51 C65 62 71 75 67 88 C72 85 76 80 78 74 C85 86 85 98 80 108 C74 120 64 127 51 127 Z" />
        </path>
        <path class="flame-core" d="M52 124 C43 124 37 117 38 108 C39 99 46 94 50 87 C53 82 56 77 57 70 C65 79 68 90 64 99 C68 97 71 94 73 90 C76 101 73 113 66 119 C62 123 57 124 52 124 Z" />
        <path class="flame-shine" d="M20 96 C21 81 29 68 39 55 C44 49 48 41 51 33 C49 48 42 60 36 72 C31 82 27 94 28 106 C23 104 20 101 20 96 Z" />
        </g>
        <g class="flame-embers" aria-hidden="true">
            <circle cx="35" cy="29" r="3.1" />
            <circle cx="73" cy="37" r="2.2" />
            <circle cx="61" cy="17" r="1.7" />
        </g>
    `;

    flame.appendChild(
        mainFlame
    );

    return flame;
}

function renderStreakFlame(
    container,
    streakDay,
    extraClassName = ""
) {
    if (!container) {
        return;
    }

    container.innerHTML = "";

    container.appendChild(
        createStreakFlameElement(
            streakDay,
            extraClassName
        )
    );
}

function getShareFlame(streakDay) {
    return getStreakFlameTier(
        streakDay
    ).shareEmoji;
}

function updateStreakFlameDisplays() {
    const streakDay =
        Math.max(
            1,
            getSavedStreakDay()
        );

    queryAll(
        "#streakFlame, " +
        "#mainStreakFlame, " +
        "#finalStreakFlame, " +
        "[data-streak-flame]"
    ).forEach(container => {
        renderStreakFlame(
            container,
            streakDay
        );
    });
}


/* =========================================================
   PAGE NAVIGATION
========================================================= */

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


/* =========================================================
   NEW AND RETURNING PLAYER REDIRECTS
========================================================= */

function redirectUnnamedPlayer() {
    const currentPage =
        getCurrentPageName();

    const playerName =
        localStorage.getItem(
            STORAGE_KEYS.playerName
        );

    const publicPages = [
        "welcome.html",
        "about.html",
        "contact.html",
        "privacy.html",
        "terms.html",
        "faq.html"
    ];

    if (
        !playerName &&
        !publicPages.includes(currentPage)
    ) {
        window.location.replace(
            "welcome.html"
        );

        return true;
    }

    return false;
}

function redirectReturningPlayer() {
    const currentPage =
        getCurrentPageName();

    const playerName =
        localStorage.getItem(
            STORAGE_KEYS.playerName
        );

    if (
        currentPage === "welcome.html" &&
        playerName
    ) {
        window.location.replace(
            "index.html"
        );

        return true;
    }

    return false;
}


/* =========================================================
   NAME INPUT
========================================================= */

function createNameWarning(input) {
    if (byId("nameWarning")) {
        return;
    }

    const warning =
        document.createElement("p");

    warning.id = "nameWarning";
    warning.className = "warning";

    warning.textContent =
        "Marka hore magacaaga geli.";

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
        warning.classList.remove("show");
    }
}

function prepareNameInput() {
    const input =
        byId("name");

    if (!input) {
        return;
    }

    createNameWarning(input);

    const savedName =
        localStorage.getItem(
            STORAGE_KEYS.playerName
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

function startQuiz() {
    const input =
        byId("name");

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
        STORAGE_KEYS.playerName,
        playerName
    );

    hideNameWarning();

    setResultsMode("personality");

    goTo("index.html");
}


/* =========================================================
   PLAYER NAME DISPLAY
========================================================= */

function fillPlayerNameElements() {
    const playerName =
        localStorage.getItem(
            STORAGE_KEYS.playerName
        ) || "Ciyaaryahan";

    queryAll("[data-player-name]")
        .forEach(element => {
            element.textContent =
                playerName;
        });
}


/* =========================================================
   WELCOME MESSAGE
========================================================= */

function updateWelcomeMessage() {
    const welcomeText =
        byId("welcomeText");

    if (!welcomeText) {
        return;
    }

    const hasResults =
        Boolean(
            localStorage.getItem(
                STORAGE_KEYS.personalityResults
            )
        );

    welcomeText.textContent =
        hasResults
            ? "Ku soo laabo"
            : "Ku soo dhawoow";
}


/* =========================================================
   PROGRESS BAR
========================================================= */

fun…13718 tokens truncated…ent =
            String(currentCircle);

        stageTimerDisplay.textContent =
            getCurrentStageTime()
                .toFixed(2)
                .replace(/0$/, "");

        const completedStages =
            currentStage - 1;

        const progressPercentage =
            (
                completedStages /
                TOTAL_STAGES
            ) *
            100;

        stageProgressFill.style.width =
            `${progressPercentage}%`;
    }

    function updateStageBoxes(
        completedStages
    ) {
        stageBoxes.forEach(
            (box, index) => {
                const stageNumber =
                    index + 1;

                box.classList.remove(
                    "completed",
                    "next-stage"
                );

                if (
                    stageNumber <=
                    completedStages
                ) {
                    box.classList.add(
                        "completed"
                    );
                } else if (
                    stageNumber ===
                        completedStages + 1 &&
                    completedStages <
                        TOTAL_STAGES
                ) {
                    box.classList.add(
                        "next-stage"
                    );
                }
            }
        );
    }

    function updateRemainingStagesMessage(
        completedStage
    ) {
        const remainingStages =
            TOTAL_STAGES -
            completedStage;

        if (remainingStages === 1) {
            remainingStagesText.textContent =
                "Hal marxalad ayaa kuu hadhay.";

            return;
        }

        if (remainingStages === 0) {
            remainingStagesText.textContent =
                "Dhammaan marxaladaha waad dhammaystirtay.";

            return;
        }

        remainingStagesText.textContent =
            `${remainingStages} marxaladood ayaa kuu hadhay.`;
    }


    /* =====================================================
       TARGET POSITION
    ===================================================== */

    function placeTargetRandomly() {
        const gameAreaWidth =
            gameArea.clientWidth;

        const gameAreaHeight =
            gameArea.clientHeight;

        const targetWidth =
            targetButton.offsetWidth ||
            150;

        const targetHeight =
            targetButton.offsetHeight ||
            150;

        const horizontalPadding = 18;
        const topPadding = 75;
        const bottomPadding = 18;

        const minimumX =
            horizontalPadding;

        const maximumX =
            Math.max(
                minimumX,
                gameAreaWidth -
                    targetWidth -
                    horizontalPadding
            );

        const minimumY =
            topPadding;

        const maximumY =
            Math.max(
                minimumY,
                gameAreaHeight -
                    targetHeight -
                    bottomPadding
            );

        const randomX =
            minimumX +
            Math.random() *
            (
                maximumX -
                minimumX
            );

        const randomY =
            minimumY +
            Math.random() *
            (
                maximumY -
                minimumY
            );

        targetButton.style.left =
            `${Math.round(randomX)}px`;

        targetButton.style.top =
            `${Math.round(randomY)}px`;
    }


    /* =====================================================
       TARGET VISIBILITY
    ===================================================== */

    function hideTarget() {
        targetIsActive = false;

        clearTimer(targetTimeout);

        targetTimeout = null;

        targetButton.classList.add(
            "hidden"
        );

        targetButton.classList.remove(
            "target-hit"
        );

        targetRing.classList.remove(
            "ring-shrinking"
        );

        targetRing.style.animationDuration =
            "";
    }

    function restartRingAnimation(
        durationSeconds
    ) {
        targetRing.classList.remove(
            "ring-shrinking"
        );

        void targetRing.offsetWidth;

        targetRing.style.animationDuration =
            `${durationSeconds}s`;

        targetRing.classList.add(
            "ring-shrinking"
        );
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

        targetButton.classList.remove(
            "hidden"
        );

        placeTargetRandomly();

        const stageTime =
            getCurrentStageTime();

        restartRingAnimation(
            stageTime
        );

        targetIsActive = true;

        gameMessage.textContent =
            "Hadda riix!";

        announce(
            `Marxaladda ${currentStage}, goobada ${currentCircle}.`
        );

        targetTimeout =
            window.setTimeout(
                handleMiss,
                getCurrentStageTimeMilliseconds()
            );
    }


    /* =====================================================
       STAGE START
    ===================================================== */

    function startCurrentStage() {
        if (
            !gameIsRunning ||
            gameHasFinished
        ) {
            return;
        }

        clearAllGameTimers();
        hideTarget();

        inputIsLocked = true;
        currentCircle = 1;

        updateGameDisplay();

        gameMessage.textContent =
            `Marxaladda ${currentStage} — Is diyaari...`;

        announce(
            `Marxaladda ${currentStage} ayaa bilaabanaysa.`
        );

        actionTimeout =
            window.setTimeout(() => {
                inputIsLocked = false;

                showTarget();
            }, STAGE_READY_DURATION);
    }


    /* =====================================================
       SUCCESSFUL TARGET CLICK
    ===================================================== */

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

        targetRing.classList.remove(
            "ring-shrinking"
        );

        targetButton.classList.add(
            "target-hit"
        );

        gameMessage.textContent =
            "Waa sax!";

        announce(
            "Waa sax."
        );

        actionTimeout =
            window.setTimeout(() => {
                hideTarget();

                if (
                    currentCircle <
                    CIRCLES_PER_STAGE
                ) {
                    currentCircle += 1;

                    currentCircleDisplay.textContent =
                        String(
                            currentCircle
                        );

                    gameMessage.textContent =
                        "Midka xiga...";

                    actionTimeout =
                        window.setTimeout(
                            () => {
                                inputIsLocked =
                                    false;

                                showTarget();
                            },
                            CIRCLE_PAUSE_DURATION
                        );

                    return;
                }

                completeCurrentStage();
            }, 320);
    }


    /* =====================================================
       MISS ANIMATION
    ===================================================== */

    function showMissAnimation() {
        missAnimation.classList.remove(
            "hidden"
        );

        const cross =
            missAnimation.querySelector(
                "span"
            );

        if (cross) {
            cross.style.animation =
                "none";

            void cross.offsetWidth;

            cross.style.animation =
                "";
        }
    }

    function hideMissAnimation() {
        missAnimation.classList.add(
            "hidden"
        );
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

        targetRing.classList.remove(
            "ring-shrinking"
        );

        targetButton.classList.add(
            "hidden"
        );

        gameMessage.textContent =
            "Waad seegtay.";

        showMissAnimation();

        announce(
            "Waad seegtay."
        );

        actionTimeout =
            window.setTimeout(() => {
                hideMissAnimation();

                missedOverlay.classList
                    .remove("hidden");

                announce(
                    `Marxaladda ${currentStage} waxay dib uga bilaabanaysaa goobada koowaad.`
                );
            }, MISS_ANIMATION_DURATION);
    }


    /* =====================================================
       STAGE COMPLETION
    ===================================================== */

    function completeCurrentStage() {
        inputIsLocked = true;

        hideTarget();

        const completedStage =
            currentStage;

        if (completedStage < TOTAL_STAGES) {
            goTo(
                `streak-game.html?stage=${completedStage + 1}`
            );
            return;
        }

        completedStageAwaitingContinue =
            completedStage;

        completedStageNumber.textContent =
            String(completedStage);

        updateStageBoxes(
            completedStage
        );

        updateRemainingStagesMessage(
            completedStage
        );

        stageProgressFill.style.width =
            `${
                (
                    completedStage /
                    TOTAL_STAGES
                ) *
                100
            }%`;

        stageCompleteOverlay.classList
            .remove("hidden");

        announce(
            `Marxaladda ${completedStage} waa la dhammaystiray.`
        );

    }

    function continueAfterCompletedStage() {
        if (awaitingStageStart) {
            awaitingStageStart = false;
            stageCompleteOverlay.classList.add("hidden");
            beginButton.disabled = false;
            beginGame();
            return;
        }

        if (!completedStageAwaitingContinue) {
            return;
        }

        const completedStage =
            completedStageAwaitingContinue;

        completedStageAwaitingContinue = 0;

        stageCompleteOverlay.classList
            .add("hidden");

        finishEntireGame();
    }

    function retryCurrentStage() {
        missedOverlay.classList.add("hidden");
        startCurrentStage();
    }


    /* =====================================================
       FINAL SUCCESS
    ===================================================== */

    function finishEntireGame() {
        if (gameHasFinished) {
            return;
        }

        gameHasFinished = true;
        gameIsRunning = false;
        inputIsLocked = true;

        clearAllGameTimers();
        hideTarget();

        const updatedStreak =
            completeDailyStreak();

        finalStreakNumber.textContent =
            String(updatedStreak);

        updateStreakFlameDisplays();

        const finalFlameContainer =
            byId("finalStreakFlame") ||
            query(
                "[data-final-streak-flame]"
            );

        if (finalFlameContainer) {
            renderStreakFlame(
                finalFlameContainer,
                updatedStreak
            );

            for (let index = 0; index < 14; index += 1) {
                const spark = document.createElement("span");
                spark.className = "flame-spark";
                spark.style.setProperty(
                    "--spark-angle",
                    `${Math.round((360 / 14) * index)}deg`
                );
                finalFlameContainer.appendChild(spark);
            }
        }

        gameScreen.classList.add(
            "hidden"
        );

        successScreen.classList.remove(
            "hidden"
        );

        launchCompletionConfetti();

        setResultsMode("streak");

        announce(
            `Hambalyo. streak gaaga hadda waa ${updatedStreak} maalmood.`
        );
    }


    /* =====================================================
       BEGIN GAME
    ===================================================== */

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

        currentStage = startingStage;
        currentCircle = 1;

        targetIsActive = false;
        inputIsLocked = true;
        gameIsRunning = true;
        gameHasFinished = false;

        introScreen.classList.add(
            "hidden"
        );

        successScreen.classList.add(
            "hidden"
        );

        gameScreen.classList.remove(
            "hidden"
        );

        missedOverlay.classList.add(
            "hidden"
        );

        stageCompleteOverlay.classList.add(
            "hidden"
        );

        hideMissAnimation();

        updateStageBoxes(
            currentStage - 1
        );
        updateGameDisplay();

        requestAnimationFrame(() => {
            startCurrentStage();
        });
    }


    /* =====================================================
       TUTORIAL BUTTON
    ===================================================== */

    function unlockBeginButton() {
        beginButton.disabled = false;

        beginButton.removeAttribute(
            "aria-hidden"
        );

        beginButton.classList.remove(
            "hidden"
        );

        tutorialStatus.classList.add(
            "finished"
        );

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                beginButton.classList.add(
                    "show"
                );
            });
        });

        window.setTimeout(() => {
            tutorialStatus.textContent =
                "Diyaar ma tahay?";

            tutorialStatus.classList.remove(
                "finished"
            );
        }, 380);

        announce(
            "Badhanka Bilow hadda waa diyaar."
        );
    }


    /* =====================================================
       GAME EVENTS
    ===================================================== */

    targetButton.addEventListener(
    "pointerdown",
    event => {
        event.preventDefault();
        handleTargetHit();
    },
    {
        passive: false
    }
);
    beginButton.addEventListener(
        "click",
        beginGame
    );

    continueStageButton.addEventListener(
        "click",
        continueAfterCompletedStage
    );

    retryStageButton.addEventListener(
        "click",
        retryCurrentStage
    );

    viewResultsButton.addEventListener(
        "click",
        () => {
            setResultsMode("streak");

            goTo("results.html");
        }
    );

    window.addEventListener(
        "resize",
        () => {
            if (
                targetIsActive &&
                !targetButton.classList
                    .contains("hidden")
            ) {
                placeTargetRandomly();
            }
        }
    );

    document.addEventListener(
        "visibilitychange",
        () => {
            if (
                document.hidden &&
                targetIsActive &&
                gameIsRunning &&
                !gameHasFinished
            ) {
                handleMiss();
            }
        }
    );


    /* =====================================================
       INITIAL GAME STATE
    ===================================================== */

    gameScreen.classList.add(
        "hidden"
    );

    successScreen.classList.add(
        "hidden"
    );

    stageCompleteOverlay.classList.add(
        "hidden"
    );

    missedOverlay.classList.add(
        "hidden"
    );

    targetButton.classList.add(
        "hidden"
    );

    missAnimation.classList.add(
        "hidden"
    );

    beginButton.disabled = true;

    beginButton.setAttribute(
        "aria-hidden",
        "true"
    );

    beginButton.classList.add(
        "hidden"
    );

    beginButton.classList.remove(
        "show"
    );

    updateStageBoxes(
        startingStage - 1
    );
    updateGameDisplay();

    if (startingStage > 1) {
        introScreen.classList.add("hidden");
        completedStageNumber.textContent =
            String(startingStage - 1);
        updateStageBoxes(startingStage - 1);
        updateRemainingStagesMessage(startingStage - 1);
        stageCompleteOverlay.classList.remove("hidden");
        announce(
            `Stage ${startingStage} waa diyaar. Hoos u rog oo Sii wad taabo.`
        );
    } else {
        window.setTimeout(
            unlockBeginButton,
            TUTORIAL_DURATION
        );
    }
}


/* =========================================================
   PAGE STARTUP
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {
        if ("scrollRestoration" in history) {
            history.scrollRestoration = "manual";
        }

        window.scrollTo(0, 0);

        injectStreakFlameStyles();

        if (redirectUnnamedPlayer()) {
            return;
        }

        if (redirectReturningPlayer()) {
            return;
        }

        synchronizeStreakStorage();

        requestAnimationFrame(() => {
            document.body.classList.add(
                "loaded"
            );
        });

        prepareNameInput();
        fillPlayerNameElements();
        updateWelcomeMessage();
        updateProgressBar();

        prepareHomepageActions();
        prepareResultsPageMode();
        launchPendingCompletionConfetti();

        displayLeaderboard();
        displayPersonalityResults();
        displayStreakDay();
        updateStreakFlameDisplays();

        initializeStreakGame();
        initializeScrollDownGuide();
    }
);


/* =========================================================
   FUNCTIONS USED DIRECTLY BY HTML
========================================================= */

window.goTo =
    goTo;

window.startQuiz =
    startQuiz;

window.answerAndContinue =
    answerAndContinue;

window.finishQuiz =
    finishQuiz;

window.shareResultsOnWhatsApp =
    shareResultsOnWhatsApp;

window.continueDailyStreak =
    continueDailyStreak;

window.retakePersonalityTest =
    retakePersonalityTest;

window.toggleInfoMenu =
    toggleInfoMenu;
