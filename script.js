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
        name: "Dilaaga ðŸ’€",
        startingStreak: 8
    },
    {
        name: "Samsam ðŸŒº",
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
        emoji: "ðŸ˜‚",
        min: 65,
        max: 99
    },
    {
        name: "Maskax",
        emoji: "ðŸ§ ",
        min: 65,
        max: 99
    },
    {
        name: "Jacayl",
        emoji: "â¤ï¸",
        min: 65,
        max: 99
    },
    {
        name: "Hal-abuur",
        emoji: "ðŸŽ¨",
        min: 55,
        max: 97
    },
    {
        name: "Kalsooni",
        emoji: "ðŸ’ª",
        min: 45,
        max: 95
    },
    {
        name: "Daacadnimo",
        emoji: "ðŸ¤",
        min: 65,
        max: 99
    },
    {
        name: "Xiiso",
        emoji: "ðŸ”",
        min: 50,
        max: 96
    },
    {
        name: "Safar-jacayl",
        emoji: "ðŸ§­",
        min: 40,
        max: 94
    },
    {
        name: "Degganaan",
        emoji: "ðŸ˜Œ",
        min: 40,
        max: 92
    },
    {
        name: "Hami",
        emoji: "ðŸš€",
        min: 55,
        max: 98
    },
    {
        name: "Qurux",
        emoji: "âœ¨",
        min: 80,
        max: 97
    },
    {
        name: "Madax-bannaani",
        emoji: "ðŸ¦…",
        min: 45,
        max: 95
    },
    {
        name: "Rajo",
        emoji: "ðŸŒˆ",
        min: 50,
        max: 96
    },
    {
        name: "Dulqaad",
        emoji: "ðŸŒ¿",
        min: 35,
        max: 90
    },
    {
        name: "Firfircooni",
        emoji: "âš¡",
        min: 45,
        max: 97
    },
    {
        name: "Tartame",
        emoji: "ðŸ†",
        min: 35,
        max: 91
    },
    {
        name: "Hurdoole",
        emoji: "ðŸ˜´",
        min: 5,
        max: 60
    },
    {
        name: "Fikir-badan",
        emoji: "ðŸ’­",
        min: 15,
        max: 78
    },
    {
        name: "Ilow-badan",
        emoji: "ðŸ“",
        min: 5,
        max: 58
    },
    {
        name: "Jees-jees",
        emoji: "ðŸ˜",
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

    highestStreak: "highestStreakEver",
    earnedAnimation: "streakEarnedAnimation",
    playedAnimation: "streakPlayedAnimation",
    soundMuted: "streakSoundMuted",
    selectedAnswers: "personalitySelectedAnswers",
    missedDaysProcessedThrough: "streakMissedDaysProcessedThrough",

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

const STREAK_FLAME_TIERS = [
    { minimum:150, next:null, key:"rainbow", name:"Rainbow", className:"flame-rainbow", colour:"#ff4fd8", aura:"rgba(142,77,255,.52)", supports:4, crown:true, particleFrequency:230,
      outer:"M80 180C43 180 20 156 25 122C28 98 45 84 53 65C61 46 56 27 65 8C77 24 83 38 82 54C94 39 111 30 119 12C126 39 118 60 105 75C126 68 139 57 145 42C154 74 149 104 137 128C123 159 105 180 80 180Z",
      middle:"M80 164C56 164 42 149 45 127C48 109 60 99 67 85C73 72 72 57 78 44C91 58 97 74 93 91C105 82 114 72 120 57C128 82 124 109 114 130C105 151 95 164 80 164Z",
      inner:"M81 149C67 149 59 139 61 126C63 115 72 109 76 99C80 90 79 81 83 72C93 82 97 94 94 106C101 101 106 95 109 87C114 103 111 121 104 134C98 144 91 149 81 149Z" },
    { minimum:100, next:150, key:"blue", name:"Blue", className:"flame-blue-crown", colour:"#38a7ff", aura:"rgba(46,149,255,.5)", supports:4, crown:true, particleFrequency:300,
      outer:"M80 180C47 180 27 158 30 125C32 102 48 89 56 71C64 53 63 34 72 10C84 29 87 45 84 62C96 48 109 40 116 20C126 46 121 69 108 86C124 80 136 68 140 53C151 82 146 111 135 134C122 160 103 180 80 180Z",
      middle:"M81 164C58 164 45 149 48 128C50 111 62 101 68 87C74 73 73 58 80 42C92 57 97 73 93 91C103 83 111 73 116 61C124 82 121 105 112 126C103 149 94 164 81 164Z",
      inner:"M81 149C68 149 60 139 62 126C64 116 72 110 76 100C80 91 80 82 84 72C94 83 97 95 94 106C101 101 105 96 108 89C113 104 110 120 103 133C97 144 90 149 81 149Z" },
    { minimum:75, next:100, key:"gold", name:"Gold", className:"flame-gold", colour:"#ffc928", aura:"rgba(255,195,44,.5)", supports:4, crown:false, particleFrequency:340,
      outer:"M80 180C42 180 18 158 23 123C27 96 45 82 57 62C68 44 69 25 76 8C91 28 98 49 92 70C104 62 118 47 124 28C140 56 143 85 134 111C124 145 106 180 80 180Z",
      middle:"M80 164C54 164 40 147 44 124C47 106 60 96 67 81C74 67 75 53 79 40C93 55 101 72 96 91C105 84 113 74 117 62C127 86 123 111 113 132C103 152 93 164 80 164Z",
      inner:"M80 149C66 149 57 138 60 124C62 114 70 108 74 98C78 89 79 81 82 71C92 81 98 94 94 106C101 101 106 95 108 88C115 105 111 122 103 135C97 144 89 149 80 149Z" },
    { minimum:50, next:75, key:"purple", name:"Purple", className:"flame-purple", colour:"#a95cff", aura:"rgba(157,79,255,.46)", supports:2, crown:false, particleFrequency:430,
      outer:"M80 180C48 180 27 159 30 128C32 107 46 91 56 76C67 60 67 43 62 25C80 37 87 51 88 66C96 53 109 44 119 27C124 49 119 67 108 83C124 76 134 64 137 50C149 80 143 109 133 132C121 159 102 180 80 180Z",
      middle:"M81 164C59 164 45 150 47 130C49 114 60 102 68 90C75 79 77 66 75 53C89 63 96 77 93 93C104 84 112 75 116 63C124 84 121 108 112 129C103 151 94 164 81 164Z",
      inner:"M81 149C68 149 60 140 61 127C63 116 71 109 76 100C81 91 82 82 81 74C92 82 97 94 94 106C100 102 105 96 108 89C113 104 110 121 103 134C97 144 90 149 81 149Z" },
    { minimum:35, next:50, key:"green", name:"Green", className:"flame-green", colour:"#42e77a", aura:"rgba(55,227,119,.42)", supports:2, crown:false, particleFrequency:480,
      outer:"M80 180C50 180 30 160 32 131C34 108 49 94 58 79C68 62 66 45 67 25C83 39 91 57 87 74C97 65 108 53 113 35C129 57 133 84 125 108C116 139 101 180 80 180Z",
      middle:"M80 164C60 164 47 150 49 131C51 115 61 105 68 93C75 81 76 69 74 56C88 67 95 80 91 95C100 88 108 78 112 67C121 87 118 109 110 130C102 151 93 164 80 164Z",
      inner:"M80 149C68 149 61 140 62 128C64 118 71 111 75 102C79 94 80 85 80 76C90 85 94 96 92 107C98 103 103 97 105 91C111 105 108 121 102 134C96 144 89 149 80 149Z" },
    { minimum:20, next:35, key:"red", name:"Red", className:"flame-red", colour:"#ff453a", aura:"rgba(255,69,58,.44)", supports:2, crown:false, particleFrequency:520,
      outer:"M80 180C45 180 24 158 28 124C31 101 46 88 56 73C67 57 72 38 70 14C83 27 91 43 90 61C101 49 115 42 123 24C132 50 126 71 112 88C130 81 141 69 143 53C154 84 147 114 135 137C122 162 103 180 80 180Z",
      middle:"M81 164C57 164 43 148 47 126C49 109 61 99 68 86C75 73 77 60 75 47C89 59 98 75 94 92C104 85 112 76 116 64C125 87 122 111 113 131C104 151 94 164 81 164Z",
      inner:"M81 149C67 149 59 138 62 125C64 115 72 109 76 100C80 91 81 82 79 73C91 82 96 94 93 106C100 101 105 95 107 89C114 105 111 122 103 135C97 144 90 149 81 149Z" },
    { minimum:10, next:20, key:"pink", name:"Pink", className:"flame-pink", colour:"#ff5da7", aura:"rgba(255,93,167,.4)", supports:0, crown:false, particleFrequency:680,
      outer:"M80 180C53 180 35 161 36 134C37 113 50 99 60 83C70 67 72 49 68 27C86 40 94 59 90 78C102 69 111 58 116 42C130 64 132 91 124 114C115 143 99 180 80 180Z",
      middle:"M80 164C62 164 50 151 51 133C53 117 62 106 69 94C76 82 77 70 75 58C88 68 94 81 91 96C100 89 106 81 110 71C119 91 116 112 109 131C101 151 92 164 80 164Z",
      inner:"M80 149C69 149 62 140 63 129C64 119 71 112 75 103C79 95 80 87 80 78C89 86 93 97 91 107C97 103 101 98 104 92C109 106 107 121 101 134C95 144 88 149 80 149Z" },
    { minimum:1, next:10, key:"orange", name:"Orange", className:"flame-orange", colour:"#ff8a32", aura:"rgba(255,138,50,.36)", supports:0, crown:false, particleFrequency:780,
      outer:"M80 180C55 180 39 163 40 139C41 121 52 108 61 94C70 80 73 65 70 47C84 58 91 73 88 88C98 81 106 72 110 60C122 79 123 101 116 121C108 147 96 180 80 180Z",
      middle:"M80 165C64 165 54 153 55 138C56 125 64 116 70 106C76 96 77 86 76 76C87 84 92 95 89 107C96 102 101 95 104 87C111 103 109 120 103 136C97 153 90 165 80 165Z",
      inner:"M80 150C70 150 64 142 65 132C66 124 72 118 75 111C79 104 80 97 79 90C87 97 91 105 89 114C94 111 98 106 100 101C105 112 103 126 98 137C94 145 87 150 80 150Z" }
];

function getStreakFlameTier(streakDay) {
    const streak = Math.max(0, Number.parseInt(streakDay, 10) || 0);
    if (streak < 1) return null;
    return STREAK_FLAME_TIERS.find(tier => streak >= tier.minimum) || null;
}

function getValidPlayerName() {
    const rawName = localStorage.getItem(STORAGE_KEYS.playerName);
    if (typeof rawName !== "string") return "";
    const name = rawName.trim();
    if (!name || name.toLowerCase() === "null" || name.toLowerCase() === "undefined") {
        return "";
    }
    return name;
}

let streakFlameInstanceId = 0;

function initializeFlameParticlePool(flame, tier) {
    const layer = flame.querySelector(".flame-particle-layer");
    if (!layer) return;

    const amount = flame.classList.contains("leaderboard-flame") ? 3 : Math.min(12, 4 + tier.supports * 2 + (tier.crown ? 2 : 0));
    for (let index = 0; index < amount; index += 1) {
        const particle = document.createElement("i");
        particle.className = "flame-idle-particle";
        particle.style.setProperty("--particle-x", `${32 + ((index * 17) % 39)}%`);
        particle.style.setProperty("--particle-drift", `${-22 + ((index * 29) % 45)}px`);
        particle.style.setProperty("--particle-rise", `${-45 - ((index * 23) % 62)}px`);
        particle.style.setProperty("--particle-size", `${2 + (index % 4)}px`);
        particle.style.setProperty("--particle-duration", `${1.65 + (index % 5) * .37}s`);
        particle.style.setProperty("--particle-delay", `${-(index * .43)}s`);
        layer.appendChild(particle);
    }

    if (typeof IntersectionObserver === "function") {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => flame.classList.toggle("flame-offscreen", !entry.isIntersecting));
        }, { rootMargin: "80px" });
        flame._flameIntersectionObserver = observer;
        observer.observe(flame);
    }
}

function createFlameMorphVariant(pathData, seed) {
    let numberIndex = 0;
    return pathData.replace(/-?\d+(?:\.\d+)?/g, token => {
        const value = Number(token);
        const index = numberIndex++;
        if (value >= 155 || index < 2) return token;
        const direction = ((index + seed) % 2 === 0) ? 1 : -1;
        const amount = 1 + ((index * 3 + seed) % 3);
        return String(Math.max(0, value + direction * amount));
    });
}

function createStreakFlameElement(
    streakDay,
    extraClassName = ""
) {
    const tier =
        getStreakFlameTier(
            streakDay
        );

    if (!tier) {
        const emptyFlame = document.createElement("span");
        emptyFlame.className = "streak-flame streak-flame-empty";
        emptyFlame.setAttribute("aria-hidden", "true");
        return emptyFlame;
    }

    const flame =
        document.createElement(
            "span"
        );

    flame.className =
        `streak-flame ${tier.className} ${extraClassName}`
            .trim();

    flame.dataset.streakTier = tier.key;
    flame.style.setProperty("--tier-colour", tier.colour);
    flame.style.setProperty("--tier-aura", tier.aura);

    flame.setAttribute(
        "role",
        "img"
    );

    flame.setAttribute(
        "aria-label",
        `Streakga maalinta ${Math.max(1, Number.parseInt(streakDay, 10) || 1)}, heerka ${tier.name}`
    );
    if (!extraClassName.includes("leaderboard-flame") && !extraClassName.includes("museum-flame")) {
        flame.tabIndex = 0;
        const bounce = () => {
            flame.classList.remove("flame-tap-bounce");
            void flame.offsetWidth;
            flame.classList.add("flame-tap-bounce");
        };
        flame.addEventListener("click", bounce);
        flame.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                bounce();
            }
        });
    }

    const aura = document.createElement("span");
    aura.className = "flame-aura";
    aura.setAttribute("aria-hidden", "true");
    flame.appendChild(aura);

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
        "0 0 160 190"
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

    const rainbowGradientId =
        `flameRainbowGradient${streakFlameInstanceId}`;

    const outerFillId = tier.key === "rainbow" ? rainbowGradientId : outerGradientId;
    const outerMorph = createFlameMorphVariant(tier.outer, tier.minimum);
    const middleMorph = createFlameMorphVariant(tier.middle, tier.minimum + 3);
    const innerMorph = createFlameMorphVariant(tier.inner, tier.minimum + 7);
    const motionAllowed = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const outerAnimate = motionAllowed ? `<animate attributeName="d" values="${tier.outer};${outerMorph};${tier.outer}" dur="3.17s" repeatCount="indefinite" />` : "";
    const middleAnimate = motionAllowed ? `<animate attributeName="d" values="${tier.middle};${middleMorph};${tier.middle}" dur="2.61s" repeatCount="indefinite" />` : "";
    const innerAnimate = motionAllowed ? `<animate attributeName="d" values="${tier.inner};${innerMorph};${tier.inner}" dur="2.09s" repeatCount="indefinite" />` : "";
    const rainbowAnimate = motionAllowed
        ? '<animate attributeName="x1" values="-80;80;-80" dur="7.3s" repeatCount="indefinite" /><animate attributeName="x2" values="80;240;80" dur="7.3s" repeatCount="indefinite" />'
        : "";
    const supportFill = tier.key === "rainbow" ? ` style="fill:url(#${rainbowGradientId})"` : "";

    const lowerSideFlamesMarkup = tier.supports >= 2
        ? `
            <g class="flame-side-group" aria-hidden="true">
                <path class="flame-side flame-side-left"${supportFill} d="M29 162 C8 159 -4 143 4 124 C10 109 20 99 23 79 C41 96 47 116 39 133 C46 128 51 120 54 110 C62 134 53 157 29 162 Z" />
                <path class="flame-side flame-side-right"${supportFill} d="M131 162 C152 159 164 143 156 124 C150 109 140 99 137 79 C119 96 113 116 121 133 C114 128 109 120 106 110 C98 134 107 157 131 162 Z" />
            </g>`
        : "";

    const shoulderFlamesMarkup = tier.supports >= 4
        ? `
            <g class="flame-shoulder-group" aria-hidden="true">
                <path class="flame-side flame-shoulder-left"${supportFill} d="M55 117 C43 109 42 96 49 86 C55 78 61 72 62 61 C71 72 73 84 68 94 C73 91 77 86 79 81 C82 96 72 112 55 117 Z" />
                <path class="flame-side flame-shoulder-right"${supportFill} d="M105 116 C117 108 118 95 111 85 C105 77 99 71 98 60 C89 71 87 83 92 93 C87 90 83 85 81 80 C78 95 88 111 105 116 Z" />
            </g>`
        : "";

    const crownMarkup = tier.crown
        ? `
            <g class="flame-crown" aria-hidden="true">
                <path d="M53 34 L49 9 L70 23 L80 2 L91 23 L112 9 L107 35 Z" />
                <path class="flame-crown-band" d="M53 34 Q80 43 107 35 L104 47 Q80 54 56 47 Z" />
                <circle cx="49" cy="9" r="4" /><circle cx="80" cy="2" r="4" /><circle cx="112" cy="9" r="4" />
                <path class="flame-crown-shine" d="M61 31 L73 22 L69 37 Z" />
            </g>`
        : "";

    mainFlame.innerHTML = `
        <defs>
            <linearGradient id="${outerGradientId}" x1="18" y1="125" x2="78" y2="10" gradientUnits="userSpaceOnUse">
                <stop offset="0" stop-color="var(--flame-deep)" />
                <stop offset="0.48" stop-color="var(--flame-main)" />
                <stop offset="1" stop-col…20122 tokens truncated…      ) *
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
            `Marxaladda ${currentStage} â€” Is diyaari...`;

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

    async function finishEntireGame() {
        if (gameHasFinished) {
            return;
        }

        gameHasFinished = true;
        gameIsRunning = false;
        inputIsLocked = true;

        clearAllGameTimers();
        hideTarget();

        const updatedStreak = await awardDailyStreakSafely();

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

            requestAnimationFrame(playPendingStreakAnimation);
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
            `Hambalyo. streakgaaga hadda waa ${updatedStreak} maalmood.`
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
            `Stage ${startingStage} waa diyaar. Hoos u soco oo Sii wad taabo.`
        );
    } else {
        introScreen.hidden = false;
        introScreen.classList.remove("hidden");
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
    async () => {
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
        await processMissedStreakDaysSafely();

        requestAnimationFrame(() => {
            document.body.classList.add(
                "loaded"
            );
        });

        prepareNameInput();
        fillPlayerNameElements();
        updateWelcomeMessage();
        updateProgressBar();

        prepareReliableHomepageState();
        loadReturningHomepageAds();
        prepareResultsPageMode();
        launchPendingCompletionConfetti();

        displayLeaderboard();
        displayPersonalityResults();
        displayStreakDay();
        updateAllStreakProgressDisplays();
        initializeStreakMuseum();
        initializeStreakSoundToggle();

        requestAnimationFrame(playPendingStreakAnimation);

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

