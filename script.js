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

const LEADERBOARD_START_DATE = "2026-08-08";

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

    highestStreak: "highestStreakEver",
    earnedAnimation: "streakEarnedAnimation",
    playedAnimation: "streakPlayedAnimation",
    soundMuted: "streakSoundMuted",
    selectedAnswers: "personalitySelectedAnswers",
    quizRewardDate: "quizRewardDate",
    minigameRewardDate: "minigameRewardDate",
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
                <stop offset="1" stop-color="var(--flame-light)" />
            </linearGradient>
            <linearGradient id="${middleGradientId}" x1="45" y1="126" x2="58" y2="45" gradientUnits="userSpaceOnUse">
                <stop offset="0" stop-color="var(--flame-inner)" />
                <stop offset="0.62" stop-color="var(--flame-light)" />
                <stop offset="1" stop-color="rgba(255,255,255,.96)" />
            </linearGradient>
            <linearGradient id="${rainbowGradientId}" x1="0" y1="180" x2="160" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0" stop-color="#ff4f81"/><stop offset=".2" stop-color="#ffb83f"/><stop offset=".4" stop-color="#fff36a"/><stop offset=".6" stop-color="#53e88b"/><stop offset=".8" stop-color="#58b8ff"/><stop offset="1" stop-color="#b75cff"/>
                ${rainbowAnimate}
            </linearGradient>
        </defs>
        ${lowerSideFlamesMarkup}
        ${shoulderFlamesMarkup}
        <g class="flame-outer-group">
            <path class="flame-outer" style="fill:url(#${outerFillId})" d="${tier.outer}">${outerAnimate}</path>
            <path class="flame-tip flame-tip-left" d="M70 86 C61 67 62 47 70 23 C76 45 80 64 76 83 Z" />
            <path class="flame-tip flame-tip-right" d="M101 101 C108 78 120 63 124 39 C131 68 122 92 105 109 Z" />
        </g>
        <g class="flame-middle-group">
            <path class="flame-middle" style="fill:url(#${middleGradientId})" d="${tier.middle}">${middleAnimate}</path>
        </g>
        <g class="flame-inner-group">
            <path class="flame-inner" d="${tier.inner}">${innerAnimate}</path>
        </g>
        ${crownMarkup}
        <g class="flame-embers" aria-hidden="true">
            <circle cx="35" cy="29" r="3.1" />
            <circle cx="73" cy="37" r="2.2" />
            <circle cx="61" cy="17" r="1.7" />
        </g>
    `;

    flame.appendChild(
        mainFlame
    );

    const particleLayer = document.createElement("span");
    particleLayer.className = "flame-particle-layer";
    particleLayer.setAttribute("aria-hidden", "true");
    flame.appendChild(particleLayer);

    initializeFlameParticlePool(flame, tier);

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

    container.querySelectorAll(".streak-flame").forEach(existingFlame => {
        existingFlame._flameIntersectionObserver?.disconnect();
    });
    container.innerHTML = "";
    container.removeAttribute("aria-hidden");

    container.appendChild(
        createStreakFlameElement(
            streakDay,
            extraClassName
        )
    );
}

function updateStreakFlameDisplays() {
    const streakDay = getSavedStreakDay();

    if (streakDay < 1) {
        queryAll("#streakFlame, #mainStreakFlame, #finalStreakFlame, [data-streak-flame]")
            .forEach(container => {
                container.querySelectorAll(".streak-flame").forEach(existingFlame => {
                    existingFlame._flameIntersectionObserver?.disconnect();
                });
                container.innerHTML = "";
            });
        return;
    }

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

function updateAllStreakProgressDisplays(streakOverride = null) {
    const requestedStreak = Number(streakOverride);
    const streak = Number.isFinite(requestedStreak) && requestedStreak >= 0
        ? requestedStreak
        : getSavedStreakDay();
    if (streak < 1) return;
    const tier = getStreakFlameTier(streak);
    queryAll(".home-streak-card, .results-streak-badge, #streakMainCard, .streak-success-card").forEach(host => {
        let panel = host.querySelector(".streak-tier-progress");
        if (!panel) {
            panel = document.createElement("div");
            panel.className = "streak-tier-progress";
            panel.innerHTML = '<p></p><div class="streak-tier-track"><i></i></div>';
            const flameHost = host.querySelector("[data-streak-flame], [data-final-streak-flame]");
            if (host.classList.contains("results-streak-badge")) {
                host.appendChild(panel);
            } else {
                const insertionTarget =
                    flameHost?.closest(".home-streak-value") || flameHost;
                if (insertionTarget) insertionTarget.insertAdjacentElement("afterend", panel);
                else host.appendChild(panel);
            }
        }
        const remaining = tier.next ? tier.next - streak : 0;
        panel.querySelector("p").textContent = !tier.next
            ? "Streakga ugu sareeya waad furtay!"
            : remaining === 1
                ? "1 maalin ayaa kaaga harsan streakga cusub!"
                : `${remaining} maalmood ayaa kaaga harsan streakga cusub!`;
        panel.querySelector("i").style.width = !tier.next
            ? "100%"
            : `${Math.max(0, Math.min(100, ((streak - tier.minimum) / (tier.next - tier.minimum)) * 100))}%`;
    });
}

function initializeStreakMuseum() {
    const leaderboard = byId("leaderboard");
    if (!leaderboard || byId("streakMuseum")) return;
    const current = Math.max(0, getSavedStreakDay());
    const highest = Math.max(current, Number.parseInt(localStorage.getItem(STORAGE_KEYS.highestStreak), 10) || 0);
    localStorage.setItem(STORAGE_KEYS.highestStreak, String(highest));
    const section = document.createElement("section");
    section.id = "streakMuseum";
    section.className = "streak-museum";
    section.innerHTML = `<p class="question-label">Ururinta Streakga</p><h2>Streak Museum</h2><p class="museum-highest">Ugu sarreeyay: Maalinta ${highest}</p><div class="streak-museum-grid"></div>`;
    const grid = section.querySelector(".streak-museum-grid");
    [...STREAK_FLAME_TIERS].reverse().forEach((tier, index) => {
        const unlocked = highest >= tier.minimum;
        const active = current >= tier.minimum && (!tier.next || current < tier.next);
        const card = document.createElement("article");
        card.className = `streak-museum-card${unlocked ? " unlocked" : " locked"}${active ? " current" : ""}`;
        card.tabIndex = unlocked ? 0 : -1;
        card.style.setProperty("--museum-delay", `${-(index * .23)}s`);
        const preview = document.createElement("div");
        preview.className = "museum-flame-preview";
        preview.appendChild(createStreakFlameElement(tier.minimum, "museum-flame"));
        const state = unlocked
            ? `Furmay Maalinta ${tier.minimum}`
            : `Furmaya Maalinta ${tier.minimum}`;
        const remaining = unlocked ? "Waa furan yahay" : `${tier.minimum - highest} maalmood ayaa kaaga harsan`;
        card.append(preview);
        card.insertAdjacentHTML("beforeend", `<h3>${tier.name}</h3><p>${state}</p><strong>${active ? "Streakga hadda" : remaining}</strong>`);
        card.setAttribute("aria-label", `${tier.name}. ${unlocked ? "Furan" : "Qufulan"}. ${state}.`);
        if (unlocked) {
            const replay = () => {
                preview.classList.remove("museum-preview-replay");
                void preview.offsetWidth;
                preview.classList.add("museum-preview-replay");
            };
            card.addEventListener("click", replay);
            card.addEventListener("keydown", event => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    replay();
                }
            });
        }
        grid.appendChild(card);
    });
    leaderboard.insertAdjacentElement("afterend", section);
}

function playPendingStreakAnimation() {
    const earned = getPendingStreakAnimation();
    if (!earned) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        localStorage.setItem(STORAGE_KEYS.playedAnimation, earned.marker);
        return;
    }

    const target = query(
        "#streakFlame .streak-flame, " +
        "#finalStreakFlame .streak-flame, " +
        "#mainStreakFlame .streak-flame"
    );
    if (!target) return;

    const oldTier = getStreakFlameTier(earned.previous);
    const newTier = getStreakFlameTier(earned.value);
    if (!newTier) return;

    const unlocked = oldTier?.key !== newTier.key;
    target.classList.add(
        unlocked ? "streak-tier-unlock" : "streak-earned-day"
    );

    const dayNumbers = queryAll(
        "#streakDay, [data-streak-day], #finalStreakNumber"
    );
    dayNumbers.forEach(element => {
        element.textContent = String(earned.previous);
    });
    updateAllStreakProgressDisplays(earned.previous);

    const plus = document.createElement("b");
    plus.className = "streak-plus-one";
    plus.textContent = `+${earned.amount}`;
    target.appendChild(plus);

    for (let index = 0; index < 12; index += 1) {
        const spark = document.createElement("i");
        spark.className = "flame-spark streak-reward-spark";
        spark.style.setProperty("--spark-angle", `${index * 30}deg`);
        target.appendChild(spark);
    }

    if (unlocked) {
        document.body.classList.add("streak-unlock-backdrop");
        const message = document.createElement("span");
        message.className = "streak-unlock-message";
        message.textContent = "Streak cusub ayaa furmay!";
        target.appendChild(message);
    }

    const firstStepDelay = 1100;
    const stepDelay = 650;

    for (let step = 1; step <= earned.amount; step += 1) {
        window.setTimeout(() => {
            const displayedValue = Math.min(
                earned.value,
                earned.previous + step
            );
            dayNumbers.forEach(element => {
                element.textContent = String(displayedValue);
            });
            updateAllStreakProgressDisplays(displayedValue);
            updateStreakFlameDisplays();
            playPopSound();
        }, firstStepDelay + ((step - 1) * stepDelay));
    }

    window.setTimeout(() => {
        localStorage.setItem(
            STORAGE_KEYS.playedAnimation,
            earned.marker
        );
        document.body.classList.remove("streak-unlock-backdrop");
    }, firstStepDelay + (earned.amount * stepDelay) + 900);
}


function initializeStreakSoundToggle() {
    if (byId("streakSoundToggle")) return;
    const button = document.createElement("button");
    button.id = "streakSoundToggle";
    button.className = "streak-sound-toggle";
    button.type = "button";
    const update = () => {
        const muted = localStorage.getItem(STORAGE_KEYS.soundMuted) === "true";
        button.textContent = muted ? "🔇" : "🔊";
        button.setAttribute("aria-label", muted ? "Daar codka" : "Demi codka");
        button.setAttribute("aria-pressed", String(muted));
    };
    button.addEventListener("click", () => {
        const muted = localStorage.getItem(STORAGE_KEYS.soundMuted) === "true";
        localStorage.setItem(STORAGE_KEYS.soundMuted, String(!muted));
        update();
    });
    update();
    document.body.appendChild(button);
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

    const startingUrl = window.location.href;
    window.setTimeout(() => {
        window.location.href = page;
    }, PAGE_TRANSITION_TIME);

    window.setTimeout(() => {
        if (window.location.href === startingUrl) {
            isNavigating = false;
            document.body.classList.remove("fade-out");
        }
    }, 2400);
}

function answerAndContinue(answerIndex, nextPage) {
    if (!recordAnswer(answerIndex)) {
        console.warn("The selected personality answer could not be recorded.");
        return;
    }
    goTo(nextPage);
}


/* =========================================================
   NEW AND RETURNING PLAYER REDIRECTS
========================================================= */

function redirectUnnamedPlayer() {
    const currentPage =
        getCurrentPageName();

    const playerName = getValidPlayerName();

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

    const playerName = getValidPlayerName();

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
    const playerName = getValidPlayerName();

    queryAll("[data-player-name]")
        .forEach(element => {
            element.textContent = playerName;
            const wrapper = element.closest(".player-name");
            if (wrapper) wrapper.hidden = !playerName;
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

function updateProgressBar() {
    const progressFill =
        query(".progressFill");

    if (!progressFill) {
        return;
    }

    const currentPage =
        getCurrentPageName();

    let percentage = 0;

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
            ) *
            100;
    }

    if (currentPage === "results.html") {
        percentage = 100;
    }

    const customProgress =
        document.body.dataset.progress;

    if (
        customProgress !== undefined &&
        customProgress !== ""
    ) {
        const parsedProgress =
            Number(customProgress);

        if (
            Number.isFinite(parsedProgress)
        ) {
            percentage =
                parsedProgress;
        }
    }

    percentage =
        Math.max(
            0,
            Math.min(
                100,
                percentage
            )
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


/* =========================================================
   PERSONALITY RESULTS
========================================================= */

const QUESTION_ANSWER_TRAITS = [
    [ [["Safar-jacayl",3],["Xiiso",2]], [["Xiiso",3],["Hal-abuur",2]], [["Madax-bannaani",3],["Kalsooni",2]], [["Degganaan",2],["Safar-jacayl",2]] ],
    [ [["Daacadnimo",3],["Kalsooni",2]], [["Xaraabaad",3],["Jees-jees",2]], [["Degganaan",3],["Fikir-badan",2]], [["Firfircooni",3],["Xaraabaad",2]] ],
    [ [["Daacadnimo",2],["Dulqaad",2]], [["Madax-bannaani",3],["Hami",2]], [["Daacadnimo",4],["Jacayl",2]] ],
    [ [["Maskax",4],["Madax-bannaani",2]], [["Jacayl",4],["Rajo",2]], [["Daacadnimo",3],["Jacayl",2]], [["Dulqaad",4],["Fikir-badan",2]] ],
    [ [["Rajo",3],["Firfircooni",2]], [["Kalsooni",3],["Firfircooni",2]], [["Degganaan",4],["Fikir-badan",2]], [["Hal-abuur",3],["Hurdoole",2]] ],
    [ [["Rajo",2]], [["Kalsooni",2]], [["Daacadnimo",2]], [["Madax-bannaani",2]] ],
    [ [["Xiiso",3],["Xaraabaad",2]], [["Tartame",3],["Hal-abuur",2]], [["Hurdoole",4],["Degganaan",2]], [["Madax-bannaani",3],["Fikir-badan",2]] ],
    [ [["Jacayl",2],["Xiiso",2]], [["Maskax",4],["Xiiso",2]], [["Daacadnimo",3],["Jacayl",2]], [["Madax-bannaani",2],["Jees-jees",2]] ],
    [ [["Maskax",4],["Xiiso",2]], [["Hal-abuur",3],["Safar-jacayl",2]], [["Kalsooni",3],["Firfircooni",2]], [["Jees-jees",3],["Xaraabaad",2]] ],
    [ [["Jacayl",3],["Dulqaad",2]], [["Kalsooni",4],["Firfircooni",2]], [["Daacadnimo",3],["Dulqaad",2]], [["Hami",3],["Tartame",2]] ]
];

function getSelectedAnswers() {
    try {
        const answers = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.selectedAnswers) || "[]");
        return Array.isArray(answers) ? answers.slice(0, TOTAL_QUESTIONS) : [];
    } catch (_) {
        return [];
    }
}

function recordAnswer(answerIndex) {
    const match = getCurrentPageName().match(/^question(\d+)\.html$/);
    if (!match || !Number.isInteger(answerIndex)) return false;
    const questionIndex = Number(match[1]) - 1;
    const answerCount = QUESTION_ANSWER_TRAITS[questionIndex]?.length || 0;
    if (answerIndex < 0 || answerIndex >= answerCount) return false;
    const answers = getSelectedAnswers();
    answers[questionIndex] = answerIndex;
    sessionStorage.setItem(STORAGE_KEYS.selectedAnswers, JSON.stringify(answers));
    return true;
}

function generatePersonalityResults() {
    const answers = getSelectedAnswers();
    const scores = Object.fromEntries(personalityTraits.map(trait => [trait.name, 2]));
    answers.forEach((answerIndex, questionIndex) => {
        const mapping = QUESTION_ANSWER_TRAITS[questionIndex]?.[Math.max(0, Number(answerIndex) || 0)] || [];
        mapping.forEach(([name, points]) => { scores[name] = (scores[name] || 0) + points; });
    });
    const maximumScore = Math.max(...Object.values(scores), 1);
    const results = personalityTraits
        .map(trait => ({
            name: trait.name,
            emoji: trait.emoji,
            percentage: Math.round(38 + (scores[trait.name] / maximumScore) * 59)
        }))
        .sort((a, b) => b.percentage - a.percentage || a.name.localeCompare(b.name))
        .slice(0, 8);

    localStorage.setItem(
        STORAGE_KEYS.personalityResults,
        JSON.stringify(results)
    );

    return results;
}
function getPersonalityResults() {
    const savedResults =
        localStorage.getItem(
            STORAGE_KEYS.personalityResults
        );

    if (savedResults) {
        try {
            const parsedResults =
                JSON.parse(savedResults);

            if (
                Array.isArray(parsedResults) &&
                parsedResults.length > 0
            ) {
                return parsedResults.map(result => {
                    const canonicalTrait =
                        personalityTraits.find(
                            trait =>
                                trait.name === result.name
                        );

                    return {
                        ...result,
                        emoji:
                            canonicalTrait?.emoji ||
                            result.emoji ||
                            "✨"
                    };
                });
            }
        } catch (error) {
            console.warn(
                "Natiijooyinka personality-ga lama akhrin karin:",
                error
            );
        }
    }

    return [];
}

function displayPersonalityResults() {
    const resultsContainers =
        queryAll(
            "#personalityResults, " +
            "#previousPersonalityResults, " +
            "[data-personality-results]"
        );

    if (resultsContainers.length === 0) {
        return;
    }

    const results =
        getPersonalityResults();

    resultsContainers.forEach(
        resultsContainer => {
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
    );
}


/* =========================================================
   FINISH AND RETAKE QUIZ
========================================================= */

function retakePersonalityTest() {
    sessionStorage.removeItem(STORAGE_KEYS.selectedAnswers);
    setResultsMode("personality");
    goTo("question1.html");
}

async function finishQuiz(answerIndex) {
    if (isNavigating) {
        return;
    }

    const existingStreak =
        getSavedStreakDay();

    const isFirstPersonalityTest =
        getPersonalityResults().length === 0 &&
        existingStreak === 0;

    if (!recordAnswer(answerIndex)) {
        console.warn("The final personality answer could not be recorded.");
        return;
    }
    const completedAnswers = getSelectedAnswers();
    const hasAllAnswers =
        completedAnswers.length === TOTAL_QUESTIONS &&
        Array.from(
            { length: TOTAL_QUESTIONS },
            (_, index) => Number.isInteger(completedAnswers[index])
        ).every(Boolean);
    if (!hasAllAnswers) {
        console.warn("Personality answers were incomplete; results were not replaced.");
        return;
    }
    generatePersonalityResults();

    await awardActivityStreakRewardSafely("quiz", 1);

    if (isFirstPersonalityTest) {
        sessionStorage.setItem(
            "firstPersonalityDayResult",
            "true"
        );
    } else {
        sessionStorage.removeItem(
            "firstPersonalityDayResult"
        );
    }

    setResultsMode("personality");

    sessionStorage.setItem(
        "completionConfettiPending",
        "true"
    );

    goTo("results.html");
}


/* =========================================================
   RESULTS MODE
========================================================= */

function setResultsMode(mode) {
    const safeMode =
        mode === "streak"
            ? "streak"
            : "personality";

    localStorage.setItem(
        STORAGE_KEYS.resultsMode,
        safeMode
    );

    localStorage.setItem(
        STORAGE_KEYS.alternateResultsMode,
        safeMode
    );

    sessionStorage.setItem(
        STORAGE_KEYS.resultsMode,
        safeMode
    );

    sessionStorage.setItem(
        STORAGE_KEYS.alternateResultsMode,
        safeMode
    );
}

function getResultsMode() {
    const savedMode =
        sessionStorage.getItem(
            STORAGE_KEYS.resultsMode
        ) ||
        sessionStorage.getItem(
            STORAGE_KEYS.alternateResultsMode
        ) ||
        localStorage.getItem(
            STORAGE_KEYS.resultsMode
        ) ||
        localStorage.getItem(
            STORAGE_KEYS.alternateResultsMode
        );

    return savedMode === "streak"
        ? "streak"
        : "personality";
}


/* =========================================================
   UNIFIED STREAK STORAGE
========================================================= */

function getSavedStreakDay() {
    const primary = Number.parseInt(
        localStorage.getItem(STORAGE_KEYS.streak),
        10
    );

    if (Number.isFinite(primary) && primary >= 0) {
        return primary;
    }

    const fallbackValues = [
        localStorage.getItem(
            STORAGE_KEYS.alternateStreak
        ),
        localStorage.getItem(
            STORAGE_KEYS.oldStreak
        )
    ];

    try {
        const backup = JSON.parse(
            localStorage.getItem(STORAGE_KEYS.streakBackup) || "{}"
        );
        fallbackValues.push(backup.streak);
    } catch (error) {
        console.warn("Streak backup could not be read.", error);
    }

    const validFallback = fallbackValues
        .map(value => Number.parseInt(value, 10))
        .find(value => Number.isFinite(value) && value >= 0);

    return validFallback ?? 0;
}

function saveUnifiedStreakDay(streakDay) {
    const safeStreak =
        Math.max(
            0,
            Number.parseInt(
                streakDay,
                10
            ) || 0
        );

    localStorage.setItem(
        STORAGE_KEYS.streak,
        String(safeStreak)
    );

    localStorage.setItem(
        STORAGE_KEYS.alternateStreak,
        String(safeStreak)
    );

    localStorage.setItem(
        STORAGE_KEYS.oldStreak,
        String(safeStreak)
    );

    localStorage.setItem(
        STORAGE_KEYS.streakBackup,
        JSON.stringify({
            streak: safeStreak,
            lastCompletedDate: getLastCompletedDate(),
            savedAt: new Date().toISOString()
        })
    );
}

function getLastCompletedDate() {
    const dates = [
        localStorage.getItem(STORAGE_KEYS.lastCompletedDate),
        localStorage.getItem(STORAGE_KEYS.oldLastCompletedDate)
    ];

    try {
        const backup = JSON.parse(
            localStorage.getItem(STORAGE_KEYS.streakBackup) || "{}"
        );
        dates.push(backup.lastCompletedDate);
    } catch (error) {
        console.warn("Streak date backup could not be read.", error);
    }

    return dates
        .filter(value => /^\d{4}-\d{2}-\d{2}$/.test(value || ""))
        .sort()
        .pop() || "";
}

function saveLastCompletedDate(dateKey) {
    localStorage.setItem(
        STORAGE_KEYS.lastCompletedDate,
        dateKey
    );

    localStorage.setItem(
        STORAGE_KEYS.oldLastCompletedDate,
        dateKey
    );

    const currentStreak = getSavedStreakDay();
    localStorage.setItem(
        STORAGE_KEYS.streakBackup,
        JSON.stringify({
            streak: currentStreak,
            lastCompletedDate: dateKey,
            savedAt: new Date().toISOString()
        })
    );
}

function synchronizeStreakStorage() {
    const currentStreak =
        getSavedStreakDay();

    saveUnifiedStreakDay(
        currentStreak
    );

    const lastDate =
        getLastCompletedDate();

    if (lastDate) {
        saveLastCompletedDate(
            lastDate
        );
    }

    if (
        lastDate ===
        getLocalDateKey()
    ) {
        localStorage.setItem(
            STORAGE_KEYS.completedToday,
            "true"
        );
    } else {
        localStorage.removeItem(
            STORAGE_KEYS.completedToday
        );
    }
}

function getActivityRewardStorageKey(activity) {
    return activity === "quiz"
        ? STORAGE_KEYS.quizRewardDate
        : STORAGE_KEYS.minigameRewardDate;
}

function hasClaimedActivityReward(activity) {
    return (
        localStorage.getItem(getActivityRewardStorageKey(activity)) ===
        getLocalDateKey()
    );
}

function hasCompletedStreakToday() {
    return hasClaimedActivityReward("minigame");
}

function getDaysBetweenLocalDates(startKey, endKey) {
    const parse = key => {
        const parts = key.split("-").map(Number);
        return Date.UTC(parts[0], parts[1] - 1, parts[2]);
    };
    const difference = Math.floor((parse(endKey) - parse(startKey)) / 86400000);
    return Number.isFinite(difference) ? Math.max(0, difference) : 0;
}

function processMissedStreakDays() {
    const currentStreak = getSavedStreakDay();
    const lastCompleted = getLastCompletedDate();
    if (currentStreak < 1 || !lastCompleted || lastCompleted === getLocalDateKey()) return currentStreak;
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = getLocalDateKey(yesterdayDate);
    const rawMarker = localStorage.getItem(STORAGE_KEYS.missedDaysProcessedThrough);
    const marker = /^\d{4}-\d{2}-\d{2}$/.test(rawMarker || "") && rawMarker > lastCompleted ? rawMarker : lastCompleted;
    if (marker >= yesterday) return currentStreak;
    const missedDays = getDaysBetweenLocalDates(marker, yesterday);
    if (missedDays < 1) return currentStreak;
    localStorage.setItem(STORAGE_KEYS.missedDaysProcessedThrough, yesterday);
    const reduced = Math.max(0, currentStreak - missedDays);
    saveUnifiedStreakDay(reduced);
    localStorage.setItem(STORAGE_KEYS.missedDaysProcessedThrough, yesterday);
    return reduced;
}

async function processMissedStreakDaysSafely() {
    return processMissedStreakDays();
}

function completeDailyStreak() {
    const today =
        getLocalDateKey();

    const previousDate =
        getLastCompletedDate();

    let currentStreak =
        getSavedStreakDay();

    const previousStreak = currentStreak;

    if (previousDate === today) {
        localStorage.setItem(
            STORAGE_KEYS.completedToday,
            "true"
        );

        return currentStreak;
    }

    if (currentStreak > 0) {
        currentStreak += 1;
    } else {
        currentStreak = 1;
    }

    saveUnifiedStreakDay(
        currentStreak
    );

    saveLastCompletedDate(today);
    localStorage.setItem(STORAGE_KEYS.missedDaysProcessedThrough, today);

    localStorage.setItem(
        STORAGE_KEYS.completedToday,
        "true"
    );

    const highestStreak = Math.max(
        currentStreak,
        Number.parseInt(localStorage.getItem(STORAGE_KEYS.highestStreak), 10) || 0
    );
    localStorage.setItem(STORAGE_KEYS.highestStreak, String(highestStreak));
    localStorage.setItem(
        STORAGE_KEYS.earnedAnimation,
        JSON.stringify({ value: currentStreak, previous: previousStreak, date: today })
    );

    return currentStreak;
}

async function awardDailyStreakSafely() {
    if (navigator.locks?.request) {
        return navigator.locks.request("personality-site-daily-streak", { mode: "exclusive" }, () => completeDailyStreak());
    }
    return completeDailyStreak();
}

function completeActivityStreakReward(activity, amount) {
    const today = getLocalDateKey();
    const rewardKey = getActivityRewardStorageKey(activity);
    let currentStreak = getSavedStreakDay();

    if (localStorage.getItem(rewardKey) === today) {
        return currentStreak;
    }

    const previousStreak = currentStreak;
    currentStreak += amount;

    saveUnifiedStreakDay(currentStreak);
    saveLastCompletedDate(today);
    localStorage.setItem(STORAGE_KEYS.missedDaysProcessedThrough, today);
    localStorage.setItem(STORAGE_KEYS.completedToday, "true");
    localStorage.setItem(rewardKey, today);

    const highestStreak = Math.max(
        currentStreak,
        Number.parseInt(localStorage.getItem(STORAGE_KEYS.highestStreak), 10) || 0
    );
    localStorage.setItem(STORAGE_KEYS.highestStreak, String(highestStreak));
    localStorage.setItem(
        STORAGE_KEYS.earnedAnimation,
        JSON.stringify({
            value: currentStreak,
            previous: previousStreak,
            amount,
            activity,
            date: today
        })
    );

    return currentStreak;
}

async function awardActivityStreakRewardSafely(activity, amount) {
    return completeActivityStreakReward(activity, amount);
}

function getPendingStreakAnimation() {
    const raw = localStorage.getItem(STORAGE_KEYS.earnedAnimation);
    if (!raw) return null;

    try {
        const earned = JSON.parse(raw);
        const marker = `${earned.date}:${earned.value}`;
        const previous = Number(earned.previous);
        const value = Number(earned.value);

        if (
            localStorage.getItem(STORAGE_KEYS.playedAnimation) === marker ||
            !Number.isFinite(previous) ||
            !Number.isFinite(value) ||
            value <= previous
        ) {
            return null;
        }

        return {
            ...earned,
            marker,
            previous: Math.max(0, previous),
            value,
            amount: Math.max(1, Number(earned.amount) || value - previous)
        };
    } catch {
        return null;
    }
}

function displayStreakDay() {
    const pendingReward = getPendingStreakAnimation();
    const displayedStreak = pendingReward
        ? pendingReward.previous
        : getSavedStreakDay();

    queryAll(
        "#streakDay, " +
        "[data-streak-day]"
    ).forEach(element => {
        element.textContent =
            String(displayedStreak);
    });

    updateStreakFlameDisplays();
}


/* =========================================================
   SCROLL-DOWN GUIDE
========================================================= */

function initializeScrollDownGuide() {
    if (window.location.pathname.endsWith("/results.html")) {
        return;
    }

    if (document.querySelector(".scroll-down-guide")) {
        return;
    }

    const findMainTarget = () => {
        const candidates = queryAll(
            "main.content, main.container, .streak-screen:not(.hidden)"
        );
        return candidates.find(element => element.getClientRects().length) || null;
    };

    const guide = document.createElement("button");
    guide.type = "button";
    guide.className = "scroll-down-guide";
    guide.setAttribute("aria-label", "Hoos u soco bogga");
    guide.innerHTML = '<span>Hoos u soco</span><i aria-hidden="true"></i>';
    document.body.appendChild(guide);

    let hasBeenShown = false;
    let dismissedAtBottom = false;

    const update = () => {
        if (dismissedAtBottom) {
            return;
        }

        const pageBottom = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight
        );
        const remainingDistance = pageBottom - (window.scrollY + window.innerHeight);

        if (remainingDistance > 56) {
            hasBeenShown = true;
            guide.classList.add("show");
            return;
        }

        guide.classList.remove("show");

        if (hasBeenShown) {
            dismissedAtBottom = true;
        }
    };

    guide.addEventListener("click", () => {
        const target = findMainTarget();
        const targetRect = target?.getBoundingClientRect();
        if (targetRect && targetRect.top > window.innerHeight * 0.55) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            return;
        }
        window.scrollBy({
            top: Math.max(240, window.innerHeight * 0.72),
            behavior: "smooth"
        });
    });

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.setTimeout(update, 250);
    window.setTimeout(update, 1200);
}


/* =========================================================
   HOMEPAGE STREAK ACTIONS
========================================================= */

function showAlreadyCompletedMessage() {
    const message =
        "Maanta streakgaaga waad sii wadatay! Berri soo noqo si aanu streakgaagu u go'in.";

    const messageElement =
        byId(
            "streakAlreadyCompletedMessage"
        ) ||
        byId("streakMessage") ||
        query("[data-streak-message]");

    if (messageElement) {
        messageElement.textContent =
            message;

        messageElement.hidden =
            false;

        messageElement.classList.add(
            "show"
        );

        messageElement.setAttribute(
            "aria-live",
            "polite"
        );

        return;
    }

    window.alert(message);
}

function continueDailyStreak() {
    if (hasCompletedStreakToday()) {
        showAlreadyCompletedMessage();
        return;
    }

    setResultsMode("streak");

    goTo("streak-game.html");
}

function prepareReliableHomepageState() {
    if (getCurrentPageName() !== "index.html") return;
    const mainMessage = byId("homeMainMessage");
    const streakCard = query(".home-streak-card");
    const continueButton = byId("continueStreakButton");
    const oldResultsButton = byId("retakeTestButton");
    const retakeButton = byId("takeTestAgainButton");
    const completedMessage = byId("streakAlreadyCompletedMessage");
    const newPlayerStreakMini = byId("newPlayerStreakMini");
    const hasResults = getPersonalityResults().length > 0;

    if (!hasResults) {
        streakCard?.classList.add("streak-not-started");
        setElementVisibility(streakCard, false);
        setElementVisibility(newPlayerStreakMini, true);
        setElementVisibility(oldResultsButton, false);
        setElementVisibility(retakeButton, false);
        setElementVisibility(completedMessage, false);
        const dayLabel = streakCard?.querySelector(".streak-day-label");
        const description = streakCard?.querySelector(".home-streak-description");
        if (dayLabel) dayLabel.textContent = "Bilow streakgaaga";
        if (description) description.hidden = true;
        if (continueButton) {
            setElementVisibility(continueButton, true);
            continueButton.textContent = "Bilow Tartanka";
            continueButton.onclick = event => {
                event.preventDefault();
                sessionStorage.removeItem(STORAGE_KEYS.selectedAnswers);
                goTo("question1.html");
            };
        }
        return;
    }

    streakCard?.classList.remove("streak-not-started");
    setElementVisibility(newPlayerStreakMini, false);
    const returningDescription = streakCard?.querySelector(".home-streak-description");
    if (returningDescription) returningDescription.hidden = false;
    setElementVisibility(streakCard, true);
    setElementVisibility(oldResultsButton, true);
    setElementVisibility(retakeButton, true);
    if (oldResultsButton) {
        oldResultsButton.textContent = "Eeg Natiijadii Hore";
        oldResultsButton.onclick = event => { event.preventDefault(); setResultsMode("personality"); goTo("results.html"); };
    }
    if (retakeButton) {
        retakeButton.textContent = "Dib u Qaado Tartanka";
        retakeButton.onclick = event => { event.preventDefault(); retakePersonalityTest(); };
    }
    const streak = getSavedStreakDay();
    const tier = streak > 0 ? getStreakFlameTier(streak) : null;
    const messages = ["Soo laabasho wanaagsan!", "Maanta mar kale ayaad soo noqotay!", "Streakgaaga sii wad!", "Diyaar ma tahay?", "Maanta waa maalin cusub!"];
    const visitMessage = streak === 99 ? "Maalinta 100aad way kuu dhowdahay!" : tier?.next - streak === 1 ? "Hal maalin ayaa kuu harsan!" : messages[Math.floor(Math.random() * messages.length)];
    if (mainMessage) mainMessage.textContent = visitMessage;

    if (hasCompletedStreakToday()) {
        if (continueButton) {
            continueButton.textContent = "Berri Soo Noqo";
            continueButton.onclick = event => { event.preventDefault(); showAlreadyCompletedMessage(); };
        }
        if (completedMessage) {
            completedMessage.textContent = "Maanta streakgaaga waad sii wadatay! Berri soo noqo si aanu streakgaagu u go'in.";
            setElementVisibility(completedMessage, true);
        }
        return;
    }
    if (continueButton) {
        continueButton.textContent = "🔥 Sii wad Streakga";
        continueButton.onclick = event => { event.preventDefault(); continueDailyStreak(); };
    }
    setElementVisibility(completedMessage, false);
}

function loadReturningHomepageAds() {
    if (
        getCurrentPageName() !== "index.html" ||
        getPersonalityResults().length === 0
    ) {
        return;
    }

    const host = byId("homepageAds");
    if (!host) return;

    host.hidden = false;
    host.innerHTML =
        '<aside class="page-native-ad" aria-label="Advertisement">' +
        '<div id="container-de0a31b62be16fbc9bd0ff721c7826ab"></div>' +
        '</aside>' +
        '<aside class="page-banner-ad" aria-label="Advertisement"></aside>';

    const nativeScript = document.createElement("script");
    nativeScript.async = true;
    nativeScript.dataset.cfasync = "false";
    nativeScript.src =
        "https://hystericallikingdowntown.com/de0a31b62be16fbc9bd0ff721c7826ab/invoke.js";
    host.querySelector(".page-native-ad").prepend(nativeScript);

    window.atOptions = {
        key: "8a204881cd2d5d7ae3ff7e30232fc0b3",
        format: "iframe",
        height: 250,
        width: 300,
        params: {}
    };

    const bannerScript = document.createElement("script");
    bannerScript.src =
        "https://hystericallikingdowntown.com/8a204881cd2d5d7ae3ff7e30232fc0b3/invoke.js";
    host.querySelector(".page-banner-ad").appendChild(bannerScript);
}


/* =========================================================
   ADSTERRA ADS
========================================================= */

function initializeAdsterraAds(userAlreadyInteracted = false) {
    if (document.getElementById("siteAdsterraAds")) return;

    const host = document.createElement("section");
    host.id = "siteAdsterraAds";
    host.className = "site-adsterra-ads";
    host.setAttribute("aria-label", "Advertisement");
    host.innerHTML =
        '<aside class="page-native-ad"><p class="stage-ad-label">XAYSIIS</p><div class="ad-safe-placeholder">Xayeysiisku wuxuu soo baxayaa markaad halkan gaarto.</div></aside>' +
        '<aside class="page-banner-ad"><p class="stage-ad-label">XAYSIIS</p><div class="ad-safe-placeholder">Xayeysiisku wuxuu soo baxayaa markaad halkan gaarto.</div></aside>';
    const footer = document.querySelector(".site-footer-nav, footer");
    if (footer?.parentNode) footer.parentNode.insertBefore(host, footer);
    else document.body.appendChild(host);

    let userInteracted = Boolean(userAlreadyInteracted);
    let adAreaVisible = false;
    let started = false;
    const createFrame = (title, source, height, className) => {
        const frame = document.createElement("iframe");
        frame.title = title;
        frame.className = className;
        frame.width = "300";
        frame.height = String(height);
        frame.loading = "lazy";
        frame.referrerPolicy = "no-referrer-when-downgrade";
        frame.setAttribute("sandbox", "allow-scripts allow-popups allow-popups-to-escape-sandbox");
        frame.srcdoc = source;
        return frame;
    };
    const maybeStart = () => {
        if (started || !userInteracted || !adAreaVisible) return;
        started = true;
        window.setTimeout(() => {
        if (!document.body.contains(host)) return;
        const nativeHost = host.querySelector(".page-native-ad");
        const bannerHost = host.querySelector(".page-banner-ad");
        nativeHost.querySelector(".ad-safe-placeholder")?.remove();
        nativeHost.appendChild(createFrame(
            "Advertisement",
            '<!doctype html><html><body style="margin:0"><script async="async" data-cfasync="false" src="https://hystericallikingdowntown.com/de0a31b62be16fbc9bd0ff721c7826ab/invoke.js"><\\/script><div id="container-de0a31b62be16fbc9bd0ff721c7826ab"></div></body></html>',
            300,
            "adsterra-native-frame"
        ));
        window.setTimeout(() => {
            bannerHost.querySelector(".ad-safe-placeholder")?.remove();
            bannerHost.appendChild(createFrame(
                "Advertisement",
                '<!doctype html><html><body style="margin:0"><script>atOptions={key:"8a204881cd2d5d7ae3ff7e30232fc0b3",format:"iframe",height:250,width:300,params:{}};<\\/script><script src="https://hystericallikingdowntown.com/8a204881cd2d5d7ae3ff7e30232fc0b3/invoke.js"><\\/script></body></html>',
                250,
                "adsterra-banner-frame"
            ));
        }, 2600);
        window.setTimeout(() => {
            const socialFrame = createFrame(
                "Advertisement",
                '<!doctype html><html><body style="margin:0;overflow:hidden"><script src="https://hystericallikingdowntown.com/fe/53/30/fe53304fec9f06f8ed97fe7f2861d78a.js"><\\/script></body></html>',
                90,
                "adsterra-social-frame"
            );
            socialFrame.width = "100%";
            document.body.appendChild(socialFrame);
        }, 5200);
        }, 1800);
    };
    const markInteraction = () => {
        userInteracted = true;
        maybeStart();
    };
    window.addEventListener("pointerdown", markInteraction, { passive: true, once: true });
    window.addEventListener("touchstart", markInteraction, { passive: true, once: true });
    window.addEventListener("wheel", markInteraction, { passive: true, once: true });
    window.addEventListener("keydown", markInteraction, { once: true });
    const observer = new IntersectionObserver(entries => {
        adAreaVisible = entries.some(entry => entry.isIntersecting);
        maybeStart();
        if (started) observer.disconnect();
    }, { rootMargin: "120px 0px", threshold: 0.01 });
    observer.observe(host);
}
function armAdsterraAdsAfterRealInteraction() {
    let armed = false;
    const arm = () => {
        if (armed) return;
        armed = true;
        window.setTimeout(() => initializeAdsterraAds(true), 1800);
    };
    window.addEventListener("pointerdown", arm, { passive: true, once: true });
    window.addEventListener("touchstart", arm, { passive: true, once: true });
    window.addEventListener("wheel", arm, { passive: true, once: true });
    window.addEventListener("keydown", arm, { once: true });
}


/* =========================================================
   RESULTS PAGE
========================================================= */

function updateResultsPageHeadings(mode) {
    const title =
        byId("resultsTitle") ||
        byId("resultTitle") ||
        query("[data-results-title]");

    const subtitle =
        byId("resultsSubtitle") ||
        byId("resultSubtitle") ||
        query("[data-results-subtitle]");

    if (title) {
        title.textContent =
            mode === "streak"
                ? "🎉 streakgaaga Waa Dhammaystirtay 🎉"
                : "🎉 Shakhsiyadaada 🎉";
    }

    if (subtitle) {
        subtitle.textContent =
            mode === "streak"
                ? "Maanta streakgaaga waad sii wadatay."
                : "Kuwani waa natiijooyinka personality-gaaga cusub.";
    }
}

function launchCompletionConfetti() {
    if (
        document.querySelector(
            ".completion-confetti-layer"
        )
    ) {
        return;
    }

    const layer =
        document.createElement("div");

    layer.className =
        "completion-confetti-layer";

    layer.setAttribute(
        "aria-hidden",
        "true"
    );

    const colors = [
        "#ff72b6",
        "#b875f2",
        "#ffd166",
        "#72d8b0",
        "#73bfff",
        "#ff806f"
    ];

    for (
        let index = 0;
        index < 90;
        index += 1
    ) {
        const piece =
            document.createElement("i");

        const direction =
            index % 2 === 0 ? -1 : 1;

        piece.style.setProperty(
            "--confetti-x",
            `${direction * (12 + Math.random() * 48)}vw`
        );

        piece.style.setProperty(
            "--confetti-y",
            `${-46 + Math.random() * 98}vh`
        );

        piece.style.setProperty(
            "--confetti-turn",
            `${direction * (360 + Math.random() * 900)}deg`
        );

        piece.style.setProperty(
            "--confetti-delay",
            `${Math.random() * 180}ms`
        );

        piece.style.setProperty(
            "--confetti-color",
            colors[index % colors.length]
        );

        layer.appendChild(piece);
    }

    document.body.appendChild(layer);

    window.setTimeout(
        () => layer.remove(),
        2900
    );
}

function launchPendingCompletionConfetti() {
    if (
        sessionStorage.getItem(
            "completionConfettiPending"
        ) !== "true"
    ) {
        return;
    }

    sessionStorage.removeItem(
        "completionConfettiPending"
    );

    window.requestAnimationFrame(
        launchCompletionConfetti
    );
}

function ensureGeneratedStreakResultCard() {
    let card =
        byId(
            "generatedStreakResultCard"
        );

    if (card) {
        return card;
    }

    const personalityResults =
        byId("personalityResults");

    if (!personalityResults) {
        return null;
    }

    card =
        document.createElement(
            "section"
        );

    card.id =
        "generatedStreakResultCard";

    card.className =
        "result-card streak-result-card";

    const label =
        document.createElement("p");

    label.className =
        "result-label";

    label.textContent =
        "streakgaaga";

    const flameContainer =
        document.createElement(
            "div"
        );

    flameContainer.id =
        "generatedMainStreakFlame";

    flameContainer.className =
        "generated-streak-flame";

    flameContainer.setAttribute(
        "data-streak-flame",
        ""
    );

    const value =
        document.createElement(
            "strong"
        );

    value.id =
        "generatedMainStreakValue";

    value.className =
        "main-streak-value";

    const description =
        document.createElement("p");

    description.textContent =
        "Maanta streakgaaga si guul leh ayaad u sii wadatay.";

    card.append(
        label,
        flameContainer,
        value,
        description
    );

    const personalityCard =
        personalityResults.closest(
            ".result-card, " +
            ".results-card, " +
            "section"
        );

    if (
        personalityCard &&
        personalityCard.parentElement
    ) {
        personalityCard.parentElement
            .insertBefore(
                card,
                personalityCard
            );
    } else if (
        personalityResults.parentElement
    ) {
        personalityResults.parentElement
            .insertBefore(
                card,
                personalityResults
            );
    }

    return card;
}

function prepareResultsPageMode() {
    if (
        getCurrentPageName() !==
        "results.html"
    ) {
        return;
    }

    const mode =
        getResultsMode();

    const streakDay =
        Math.max(
            1,
            getSavedStreakDay()
        );

    document.body.dataset.resultsMode =
        mode;

    updateResultsPageHeadings(mode);

    const resultsStreakBadge =
        query(".results-streak-badge");

    setElementVisibility(
        resultsStreakBadge,
        mode === "personality"
    );

    const streakMainCard =
        byId("streakMainCard") ||
        query(
            "[data-result-card='streak']"
        );

    const personalityMainCard =
        byId("personalityMainCard") ||
        query(
            "[data-result-card='personality-main']"
        );

    const previousPersonalityCard =
        byId("previousPersonalityCard") ||
        query(
            "[data-result-card='previous-personality']"
        );

    const customCardsExist =
        streakMainCard ||
        personalityMainCard ||
        previousPersonalityCard;

    if (customCardsExist) {
        setElementVisibility(
            streakMainCard,
            mode === "streak"
        );

        setElementVisibility(
            personalityMainCard,
            mode === "personality"
        );

        setElementVisibility(
            previousPersonalityCard,
            mode === "streak"
        );
    } else {
        const generatedStreakCard =
            ensureGeneratedStreakResultCard();

        setElementVisibility(
            generatedStreakCard,
            mode === "streak"
        );

        const personalityResults =
            byId("personalityResults");

        if (personalityResults) {
            const personalityContainer =
                personalityResults.closest(
                    ".result-card, " +
                    ".results-card, " +
                    "section"
                ) ||
                personalityResults;

            personalityContainer.classList
                .toggle(
                    "previous-personality-result",
                    mode === "streak"
                );
        }
    }

    queryAll(
        "#mainStreakDay, " +
        "#generatedMainStreakValue, " +
        "[data-main-streak]"
    ).forEach(element => {
        element.textContent =
            `maalinta ${streakDay}`;
    });

    queryAll(
        "#continueStreakResultButton, " +
        "[data-action='continue-streak']"
    ).forEach(button => {
        button.textContent =
            hasCompletedStreakToday()
                ? "🌙 Berri Soo Noqo"
                : "🔥 Sii Wad Streakga";

        button.onclick =
            event => {
                event.preventDefault();

                continueDailyStreak();
            };
    });

    queryAll(
        "#retakeResultButton, " +
        "[data-action='retake-test']"
    ).forEach(button => {
        button.textContent =
            "🔄 Mar Kale Qaado";

        button.onclick =
            event => {
                event.preventDefault();

                retakePersonalityTest();
            };
    });

    updateStreakFlameDisplays();
}


/* =========================================================
   DAILY LEADERBOARD
========================================================= */

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
                    name:
                        player.name,

                    streak:
                        player.startingStreak + (addedDays * 3)
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

            nameElement.className =
                "leaderboard-name";

            const streakElement =
                document.createElement(
                    "span"
                );

            streakElement.className =
                "leaderboard-streak";

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

            const flame =
                createStreakFlameElement(
                    player.streak,
                    "leaderboard-flame"
                );

            const streakText =
                document.createElement(
                    "span"
                );

            streakText.className =
                "leaderboard-streak-text";

            streakText.textContent =
                `Maalinta ${player.streak}`;

            streakElement.append(
                flame,
                streakText
            );

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


/* =========================================================
   WHATSAPP SHARING
========================================================= */

function shareResultsOnWhatsApp() {
    const playerName =
        localStorage.getItem(
            STORAGE_KEYS.playerName
        ) || "Ciyaaryahan";

    const streakDay =
        Math.max(
            1,
            getSavedStreakDay()
        );

    /*
      Shows the top 5 personality traits.
      Change 5 to another number if needed.
    */
    const sharedTraits =
        getPersonalityResults()
            .slice(0, 5)
            .map(result => {
                const canonicalTrait =
                    personalityTraits.find(
                        trait =>
                            trait.name === result.name
                    );

                const emoji =
                    canonicalTrait?.emoji ||
                    result.emoji ||
                    "✨";

                return `${emoji} ${result.name} — ${result.percentage}%`;
            });

    const message = [
        `✨ *${playerName}* shakhsiyadooda ✨`,
        "",
        ...sharedTraits,
        "",
        "Kaalay adiguna is tijaabi oo ka qayb qaado jaaisooyinka!",
        WEBSITE_LINK
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


/* =========================================================
   CLICK PARTICLES
========================================================= */

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

let popAudioContext = null;
let lastPopSoundAt = 0;

function playPopSound() {
    if (localStorage.getItem(STORAGE_KEYS.soundMuted) === "true") {
        return;
    }

    const now = Date.now();

    if (now - lastPopSoundAt < 80) {
        return;
    }

    lastPopSoundAt = now;

    try {
        const AudioContextClass =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContextClass) {
            return;
        }

        if (
            !popAudioContext ||
            popAudioContext.state === "closed"
        ) {
            popAudioContext =
                new AudioContextClass();
        }

        if (popAudioContext.state === "suspended") {
            popAudioContext.resume();
        }

        const oscillator =
            popAudioContext.createOscillator();

        const gain =
            popAudioContext.createGain();

        const startTime =
            popAudioContext.currentTime;

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(
            540,
            startTime
        );
        oscillator.frequency.exponentialRampToValueAtTime(
            760,
            startTime + 0.055
        );
        gain.gain.setValueAtTime(
            0.055,
            startTime
        );
        gain.gain.exponentialRampToValueAtTime(
            0.001,
            startTime + 0.085
        );

        oscillator.connect(gain);
        gain.connect(popAudioContext.destination);

        oscillator.addEventListener(
            "ended",
            () => {
                oscillator.disconnect();
                gain.disconnect();
            },
            { once: true }
        );

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.09);
    } catch (error) {
        console.warn(
            "Click sound could not play:",
            error
        );
    }
}

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


/* =========================================================
   INFORMATION MENU
========================================================= */

function toggleInfoMenu() {
    const menu =
        byId("infoMenu");

    if (!menu) {
        return;
    }

    menu.classList.toggle(
        "show"
    );
}

document.addEventListener(
    "click",
    event => {
        const menu =
            byId("infoMenu");

        const button =
            query(".infoButton");

        if (!menu || !button) {
            return;
        }

        if (
            !menu.contains(event.target) &&
            !button.contains(event.target)
        ) {
            menu.classList.remove(
                "show"
            );
        }
    }
);
/* =========================================================
   COLORED FLAME STYLES
========================================================= */

function injectStreakFlameStyles() {
    if (byId("generatedStreakFlameStyles")) {
        return;
    }

    const style = document.createElement("style");

    style.id = "generatedStreakFlameStyles";

    style.textContent = `
        .streak-flame {
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 1.15em;
            height: 1.55em;
            margin: 0 0.2em;
            vertical-align: middle;
            font-size: 1.3em;
            line-height: 1;
            --flame-main: #ff8a4c;
            --flame-light: #ffe3a6;
            --flame-deep: #f25f5c;
            --flame-inner: rgba(255, 247, 176, 0.94);
            --flame-glow: rgba(255, 138, 76, 0.5);
            isolation: isolate;
            filter:
                drop-shadow(0 0 0.18em var(--flame-glow))
                drop-shadow(0 0.12em 0.28em rgba(126, 61, 155, 0.22));
        }

        .streak-flame-svg {
            display: block;
            width: 1em;
            height: 1.42em;
            overflow: visible;
            transform-origin: 50% 92%;
            animation: flameBrightness 2.8s ease-in-out infinite alternate;
        }

        .flame-outer-group,
        .flame-middle-group,
        .flame-inner-group,
        .flame-side,
        .flame-crown {
            transform-box: fill-box;
        }

        .flame-outer-group {
            transform-origin: 50% 94%;
            animation: outerFlameDance 2.65s cubic-bezier(.45,.05,.55,.95) infinite alternate;
        }

        .flame-inner-group {
            transform-origin: 50% 91%;
            animation: innerFlameDance 1.85s cubic-bezier(.42,0,.58,1) infinite alternate;
        }

        .flame-middle-group { transform-box:fill-box; transform-origin:50% 94%; animation:middleFlameDance 1.47s ease-in-out infinite alternate; }
        .flame-tip { fill:var(--flame-main); transform-box:fill-box; transform-origin:50% 100%; }
        .flame-tip-left { animation:leftTipDance 1.29s ease-in-out infinite alternate; }
        .flame-tip-right { animation:rightTipDance 1.73s ease-in-out infinite alternate-reverse; }
        .flame-middle { fill:var(--flame-light); }

        .flame-outer {
            fill: var(--flame-main);
            stroke: color-mix(in srgb, var(--flame-deep) 42%, transparent);
            stroke-width: 1.5;
            stroke-linejoin: round;
        }

        .flame-soft-light {
            fill: color-mix(in srgb, var(--flame-light) 78%, white);
            opacity: 0.68;
        }

        .flame-inner {
            fill: var(--flame-inner);
        }

        .flame-shine {
            fill: rgba(255,255,255,.48);
            filter: blur(.35px);
        }

        .flame-core {
            fill: rgba(255, 252, 220, 0.96);
            transform-origin: 52% 96%;
            animation: flameCoreGlow 2.15s ease-in-out infinite alternate;
        }

        .flame-embers circle {
            fill: var(--flame-light);
            filter: drop-shadow(0 0 2px var(--flame-glow));
            transform-box: fill-box;
            transform-origin: center;
            animation: emberRise 3.6s ease-in-out infinite;
        }

        .flame-embers circle:nth-child(2) {
            animation-delay: -1.2s;
            animation-duration: 4.2s;
        }

        .flame-embers circle:nth-child(3) {
            animation-delay: -2.4s;
            animation-duration: 3.25s;
        }

        .flame-orange {
            --flame-main: #ff914d;
            --flame-light: #ffe5a9;
            --flame-deep: #ff6f61;
            --flame-glow: rgba(255, 145, 77, 0.5);
        }

        .flame-pink {
            --flame-main: #ff78b7;
            --flame-light: #ffd6ea;
            --flame-deep: #f3579a;
            --flame-glow: rgba(255, 120, 183, 0.54);
        }

        .flame-red {
            width: 1.5em;
            height: 1.95em;
            --flame-main: #ff6675;
            --flame-light: #ffc1b7;
            --flame-deep: #e94f64;
            --flame-glow: rgba(255, 102, 117, 0.56);
        }

        .flame-purple {
            --flame-main: #b879f2;
            --flame-light: #ead9ff;
            --flame-deep: #9961d8;
            --flame-inner: #f6ecff;
            --flame-glow: rgba(184, 121, 242, 0.52);
        }

        .flame-green {
            width: 1.7em; height: 1.95em;
            --flame-main: #42e77a; --flame-light: #d7ffe2;
            --flame-deep: #20b95a; --flame-inner: #f1ffb8;
            --flame-glow: rgba(55, 227, 119, 0.5);
        }

        .flame-gold {
            --flame-main: #ffc857;
            --flame-light: #fff2b8;
            --flame-deep: #f2a93b;
            --flame-inner: #dff4c9;
            --flame-glow: rgba(255, 200, 87, 0.54);
        }

        .flame-blue-crown {
            --flame-main: #6bbcff;
            --flame-light: #d1f0ff;
            --flame-deep: #4f98e8;
            --flame-glow: rgba(107, 188, 255, 0.56);
        }

        .flame-rainbow {
            width: 1.58em; height: 2.05em;
            --flame-main: #ff4fd8; --flame-light: #fff3a8;
            --flame-deep: #765cff; --flame-inner: #9fffe3;
            --flame-glow: rgba(142, 77, 255, 0.58);
        }

        .flame-side {
            fill: var(--flame-main);
            stroke: color-mix(in srgb, var(--flame-deep) 36%, transparent);
            stroke-width: 1.2;
            transform-origin: 50% 100%;
            filter: drop-shadow(0 0 2px var(--flame-glow));
        }

        .flame-side-left {
            animation: sideFlameLeft 2.15s ease-in-out infinite alternate;
        }

        .flame-side-right {
            animation: sideFlameRight 1.95s ease-in-out infinite alternate;
        }

        .flame-shoulder-left { animation: shoulderLeft 1.57s ease-in-out -.31s infinite alternate; }
        .flame-shoulder-right { animation: shoulderRight 2.41s ease-in-out -.73s infinite alternate; }

        .flame-crown {
            fill: #ffe58f;
            stroke: #eab84d;
            stroke-width: 1.2;
            transform-origin: 50% 100%;
            filter: drop-shadow(0 2px 2px rgba(157, 104, 28, 0.24));
            animation: crownFloat 2.65s ease-in-out infinite alternate;
        }

        .flame-crown-band {
            fill: #ffc95c;
        }

        .flame-crown-shine { fill:rgba(255,255,255,.82); animation:crownShine 3.8s ease-in-out infinite; }
        .flame-aura { position:absolute;z-index:-1;width:86%;height:72%;bottom:4%;border-radius:50%;background:radial-gradient(circle,var(--tier-aura) 0%,transparent 72%);filter:blur(.16em);animation:flameAuraBreath 2.73s ease-in-out infinite alternate;pointer-events:none; }
        .flame-particle-layer { position:absolute;inset:0;pointer-events:none;z-index:4; }
        .flame-idle-particle { position:absolute;left:var(--particle-x);bottom:22%;width:var(--particle-size);height:var(--particle-size);border-radius:50%;background:var(--tier-colour);box-shadow:0 0 .12em var(--tier-colour);opacity:0;animation:flameParticleRise var(--particle-duration) ease-out var(--particle-delay) infinite; }
        .flame-offscreen .flame-idle-particle,
        .flame-offscreen .flame-aura,
        .flame-offscreen svg * { animation-play-state:paused !important; }

        .leaderboard-flame {
            font-size: 1rem;
        }

        .generated-streak-flame {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 80px;
            font-size: 3rem;
        }

        .streak-flame-celebration .streak-flame {
            animation: flameVictory 1.15s cubic-bezier(.2,.8,.2,1) both;
        }

        .flame-spark {
            position: absolute;
            left: 50%;
            top: 50%;
            width: 0.14em;
            height: 0.14em;
            border-radius: 50%;
            background: #ffe47a;
            box-shadow: 0 0 0.18em #ff4f76;
            animation: sparkBurst 1.15s ease-out both;
            transform: rotate(var(--spark-angle)) translateY(-0.45em);
        }

        .leaderboard-streak {
            display: inline-flex;
            align-items: center;
            gap: 7px;
        }

        .leaderboard-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 14px;
        }

        @keyframes outerFlameDance {
            0% { transform: translateX(-1.5px) rotate(-2.2deg) scale(.985, 1.025) skewX(-1deg); }
            45% { transform: translateX(.3px) rotate(.4deg) scale(1.018, .985) skewX(.4deg); }
            100% { transform: translateX(1.8px) rotate(2.8deg) scale(.975, 1.035) skewX(1.2deg); }
        }

        @keyframes innerFlameDance {
            0% { transform: translate(-1.4px, 1px) rotate(2.4deg) scale(.96, 1.025); }
            52% { transform: translate(.5px, -.8px) rotate(-.8deg) scale(1.025, .97); }
            100% { transform: translate(1.7px, .3px) rotate(-3deg) scale(.98, 1.045); }
        }

        @keyframes middleFlameDance { 0%{transform:translateX(-1px) scale(.96,1.07) rotate(-1deg)} 50%{transform:translateX(2px) scale(1.03,.96) rotate(1.5deg)} 100%{transform:translateX(-1px) scale(.99,1.04) rotate(-.5deg)} }
        @keyframes leftTipDance { from{transform:rotate(-6deg) scaleY(.93) translateX(-1px)} to{transform:rotate(5deg) scaleY(1.1) translateX(2px)} }
        @keyframes rightTipDance { from{transform:rotate(5deg) scaleY(1.08)} to{transform:rotate(-7deg) scaleY(.92) translateX(-2px)} }

        @keyframes flameBrightness {
            0% { filter: brightness(.98) saturate(.98); }
            100% { filter: brightness(1.08) saturate(1.05); }
        }

        @keyframes sideFlameLeft {
            from { transform: rotate(-5deg) scale(.94, 1.02); }
            to { transform: rotate(5deg) scale(1.04, .96); }
        }

        @keyframes sideFlameRight {
            from { transform: rotate(5deg) scale(1.03, .96); }
            to { transform: rotate(-5deg) scale(.95, 1.04); }
        }

        @keyframes shoulderLeft { from{transform:rotate(-7deg) scale(.91,1.06);opacity:.88} to{transform:rotate(4deg) scale(1.08,.94);opacity:1} }
        @keyframes shoulderRight { from{transform:rotate(6deg) scale(1.04,.93);opacity:1} to{transform:rotate(-5deg) scale(.92,1.1);opacity:.84} }
        @keyframes flameAuraBreath { from{opacity:.42;transform:scale(.86);filter:blur(.13em)} to{opacity:.78;transform:scale(1.08);filter:blur(.2em)} }
        @keyframes flameParticleRise { 0%{opacity:0;transform:translate(0,0) scale(.35)} 14%{opacity:1} 72%{opacity:.65} 100%{opacity:0;transform:translate(var(--particle-drift),var(--particle-rise)) scale(0) rotate(150deg)} }
        @keyframes crownShine { 0%,70%,100%{opacity:.15;transform:translateX(-3px)} 82%{opacity:1;transform:translateX(7px)} }

        @keyframes flameVictory {
            0% { transform: scale(.35) rotate(-24deg); opacity: 0; }
            45% { transform: scale(1.35) rotate(370deg); opacity: 1; }
            72% { transform: scale(.92) rotate(350deg); }
            100% { transform: scale(1.08) rotate(360deg); }
        }

        @keyframes crownFloat {
            0% { transform: translateY(-7px) rotate(-1.5deg); }
            100% { transform: translateY(-10px) rotate(1.5deg); }
        }

        @keyframes flameCoreGlow {
            0% { transform: scale(.96, 1.01) translateY(.5px); opacity: .88; }
            50% { transform: scale(1.025, .985) translateY(-.5px); opacity: 1; }
            100% { transform: scale(.99, 1.025) translateY(-1px); opacity: .93; }
        }

        @keyframes emberRise {
            0% { opacity: 0; transform: translate(0, 8px) scale(.45); }
            22% { opacity: .72; }
            68% { opacity: .38; }
            100% { opacity: 0; transform: translate(4px, -15px) scale(.9); }
        }

        @keyframes sparkBurst {
            0% { opacity: 0; transform: rotate(var(--spark-angle)) translateY(-.3em) scale(.2); }
            28% { opacity: 1; }
            100% { opacity: 0; transform: rotate(var(--spark-angle)) translateY(-2em) scale(1); }
        }

        @media (prefers-reduced-motion: reduce) {
            .streak-flame,
            .streak-flame-svg,
            .flame-outer-group,
            .flame-outer,
            .flame-middle-group,
            .flame-middle,
            .flame-inner-group,
            .flame-tip,
            .flame-core,
            .flame-embers circle,
            .flame-side,
            .flame-crown,
            .flame-aura,
            .flame-idle-particle,
            .flame-spark {
                animation: none;
            }
        }
    `;

    document.head.appendChild(style);
}


/* =========================================================
   STREAK CHALLENGE GAME
========================================================= */

function initializeStreakGame() {
    if (!document.body.classList.contains("streak-game-page")) return;

    const introScreen = byId("streakIntro");
    const beginButton = byId("beginStreakButton");
    const tutorialStatus = byId("tutorialStatus");
    const gameScreen = byId("streakGame");
    const gameArea = byId("gameArea");
    const gameMessage = byId("gameMessage");
    const targetTemplate = byId("targetButton");
    const currentStageDisplay = byId("currentStage");
    const currentCircleDisplay = byId("currentCircle");
    const stageTimerDisplay = byId("stageTimerValue");
    const stageProgressFill = byId("stageProgressFill");
    const stageCompleteOverlay = byId("stageCompleteOverlay");
    const completedStageNumber = byId("completedStageNumber");
    const remainingStagesText = byId("remainingStagesText");
    const continueStageButton = byId("continueStageButton");
    const missedOverlay = byId("missedOverlay");
    const retryStageButton = byId("retryStageButton");
    const successScreen = byId("streakSuccessScreen");
    const finalStreakNumber = byId("finalStreakNumber");
    const viewResultsButton = byId("viewResultsButton");
    const gameAnnouncement = byId("gameAnnouncement");
    const stageBoxes = queryAll(".stage-box");

    const required = [introScreen, beginButton, tutorialStatus, gameScreen, gameArea,
        gameMessage, targetTemplate, currentStageDisplay, currentCircleDisplay,
        stageTimerDisplay, stageProgressFill, stageCompleteOverlay,
        completedStageNumber, remainingStagesText, continueStageButton,
        missedOverlay, retryStageButton, successScreen, finalStreakNumber,
        viewResultsButton];
    if (required.some(element => !element)) {
        console.error("Ciyaarta streak-ga: qayb HTML ah ayaa maqan.");
        return;
    }

    const TOTAL_STAGES = 10;
    const BALLS_PER_STAGE = 5;
    const FIRST_BALL_DELAY = 1250;
    const STAGE_TIMES = [2.0, 1.95, 1.9, 1.85, 1.8, 1.75, 1.7, 1.65, 1.6, 1.55];
    const requestedStage = Number.parseInt(new URLSearchParams(location.search).get("stage"), 10);
    let currentStage = Number.isFinite(requestedStage)
        ? Math.min(TOTAL_STAGES, Math.max(1, requestedStage))
        : 1;
    let gameIsRunning = false;
    let gameHasFinished = false;
    let stageIsActive = false;
    let spawnedBalls = 0;
    let hitBalls = 0;
    let stageToken = 0;
    const timers = new Set();
    const activeTargets = new Set();
    let visibilityObserver = null;

    const announce = message => {
        if (!gameAnnouncement) return;
        gameAnnouncement.textContent = "";
        window.setTimeout(() => { gameAnnouncement.textContent = message; }, 20);
    };
    const schedule = (callback, delay) => {
        const timer = window.setTimeout(() => {
            timers.delete(timer);
            callback();
        }, delay);
        timers.add(timer);
        return timer;
    };
    const clearStage = () => {
        timers.forEach(timer => window.clearTimeout(timer));
        timers.clear();
        activeTargets.forEach(target => target.remove());
        activeTargets.clear();
        targetTemplate.classList.add("hidden");
        visibilityObserver?.disconnect();
        visibilityObserver = null;
        stageIsActive = false;
        stageToken += 1;
    };
    const updateStageBoxes = completed => {
        stageBoxes.forEach((box, index) => {
            box.classList.toggle("completed", index < completed);
            box.classList.toggle("next-stage", index === completed && completed < TOTAL_STAGES);
        });
    };
    const updateDisplay = () => {
        currentStageDisplay.textContent = String(currentStage);
        currentCircleDisplay.textContent = String(Math.min(BALLS_PER_STAGE, Math.max(1, spawnedBalls)));
        stageTimerDisplay.textContent = STAGE_TIMES[currentStage - 1].toFixed(2).replace(/0$/, "");
        stageProgressFill.style.width = `${((currentStage - 1) / TOTAL_STAGES) * 100}%`;
        updateStageBoxes(currentStage - 1);
    };
    const placeTarget = target => {
        const width = target.offsetWidth || 118;
        const height = target.offsetHeight || 118;
        const maxX = Math.max(18, gameArea.clientWidth - width - 18);
        const maxY = Math.max(78, gameArea.clientHeight - height - 18);
        target.style.left = `${Math.round(18 + Math.random() * Math.max(0, maxX - 18))}px`;
        target.style.top = `${Math.round(72 + Math.random() * Math.max(0, maxY - 72))}px`;
    };

    function showMissed() {
        if (!stageIsActive) return;
        clearStage();
        gameMessage.textContent = "Waad seegtay.";
        missedOverlay.classList.remove("hidden");
        retryStageButton.classList.add("stage-ready");
        announce("Waad seegtay. Mar kale isku day.");
    }

    function completeStage() {
        clearStage();
        completedStageNumber.textContent = String(currentStage);
        const remaining = TOTAL_STAGES - currentStage;
        remainingStagesText.textContent = remaining === 0
            ? "Dhammaan marxaladaha waad dhammaystirtay."
            : remaining === 1
                ? "Hal marxalad ayaa kuu hadhay."
                : `${remaining} marxaladood ayaa kuu hadhay.`;
        stageProgressFill.style.width = `${(currentStage / TOTAL_STAGES) * 100}%`;
        updateStageBoxes(currentStage);
        stageCompleteOverlay.classList.remove("hidden");
        continueStageButton.classList.remove("stage-ready");
        requestAnimationFrame(() => continueStageButton.classList.add("stage-ready"));
        announce(`Marxaladda ${currentStage} waa la dhammaystiray. Hoos u soco oo Sii wad taabo.`);
    }

    function spawnBall(token) {
        if (!stageIsActive || token !== stageToken || spawnedBalls >= BALLS_PER_STAGE) return;
        spawnedBalls += 1;
        currentCircleDisplay.textContent = String(spawnedBalls);

        const target = targetTemplate.cloneNode(true);
        target.removeAttribute("id");
        target.querySelectorAll("[id]").forEach(element => element.removeAttribute("id"));
        target.classList.remove("hidden", "target-hit");
        target.classList.add("live-game-target");
        target.setAttribute("aria-label", `Riix kubbadda ${spawnedBalls} ee 5`);
        gameArea.appendChild(target);
        placeTarget(target);
        activeTargets.add(target);

        const ring = target.querySelector(".target-ring");
        const lifetime = STAGE_TIMES[currentStage - 1] * 1000;
        if (ring) {
            ring.style.animationDuration = `${STAGE_TIMES[currentStage - 1]}s`;
            ring.classList.remove("ring-shrinking");
            void ring.offsetWidth;
            ring.classList.add("ring-shrinking");
        }
        gameMessage.textContent = "Hadda riix!";
        announce(`Kubbadda ${spawnedBalls} ee shanta ah.`);

        let resolved = false;
        const missTimer = schedule(() => {
            if (!resolved && activeTargets.has(target)) showMissed();
        }, lifetime);
        target.addEventListener("pointerdown", event => {
            event.preventDefault();
            if (resolved || !stageIsActive || token !== stageToken) return;
            resolved = true;
            window.clearTimeout(missTimer);
            timers.delete(missTimer);
            activeTargets.delete(target);
            target.classList.add("target-hit");
            schedule(() => target.remove(), 180);
            hitBalls += 1;
            gameMessage.textContent = hitBalls === BALLS_PER_STAGE ? "Waa sax!" : `${hitBalls}/5 — Waa sax!`;
            if (hitBalls === BALLS_PER_STAGE) schedule(completeStage, 220);
        }, { passive: false });

        if (spawnedBalls < BALLS_PER_STAGE) {
            schedule(() => spawnBall(token), Math.round(lifetime * 0.52));
        }
    }

    function waitUntilGameIsVisible() {
        const token = stageToken;
        gameMessage.textContent = "Hoos u soco—markaad ciyaarta aragto kubbaduhu way bilaabanayaan.";
        const beginAfterDelay = () => {
            if (!gameIsRunning || gameHasFinished || token !== stageToken || document.hidden) return;
            const rect = gameArea.getBoundingClientRect();
            const visibleHeight = Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 0);
            if (visibleHeight < Math.min(180, rect.height * 0.35)) return;
            visibilityObserver?.disconnect();
            visibilityObserver = null;
            gameMessage.textContent = "Is diyaari...";
            schedule(() => {
                if (token !== stageToken || document.hidden) {
                    waitUntilGameIsVisible();
                    return;
                }
                stageIsActive = true;
                spawnBall(token);
            }, FIRST_BALL_DELAY);
        };
        visibilityObserver = new IntersectionObserver(entries => {
            if (entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= 0.35)) beginAfterDelay();
        }, { threshold: [0.35, 0.5] });
        visibilityObserver.observe(gameArea);
        beginAfterDelay();
    }

    function startCurrentStage() {
        clearStage();
        spawnedBalls = 0;
        hitBalls = 0;
        updateDisplay();
        missedOverlay.classList.add("hidden");
        stageCompleteOverlay.classList.add("hidden");
        retryStageButton.classList.remove("stage-ready");
        waitUntilGameIsVisible();
    }

    async function finishEntireGame() {
        if (gameHasFinished) return;
        gameHasFinished = true;
        gameIsRunning = false;
        clearStage();
        const updatedStreak = await awardActivityStreakRewardSafely("minigame", 2);
        const pending = getPendingStreakAnimation();
        const initialValue = pending ? pending.previous : updatedStreak;
        finalStreakNumber.textContent = String(initialValue);
        gameScreen.classList.add("hidden");
        stageCompleteOverlay.classList.add("hidden");
        successScreen.classList.remove("hidden");
        updateAllStreakProgressDisplays(initialValue);
        updateStreakFlameDisplays();
        renderStreakFlame(byId("finalStreakFlame"), initialValue);
        launchCompletionConfetti();
        setResultsMode("streak");
        requestAnimationFrame(() => requestAnimationFrame(playPendingStreakAnimation));
        announce(`Hambalyo. streakgaaga hadda waa ${updatedStreak} maalmood.`);
    }

    function beginGame() {
        if (beginButton.disabled || gameIsRunning || gameHasFinished) return;
        beginButton.disabled = true;
        gameIsRunning = true;
        introScreen.classList.add("hidden");
        successScreen.classList.add("hidden");
        gameScreen.classList.remove("hidden");
        startCurrentStage();
    }

    continueStageButton.addEventListener("click", () => {
        continueStageButton.classList.remove("stage-ready");
        stageCompleteOverlay.classList.add("hidden");
        if (currentStage >= TOTAL_STAGES) finishEntireGame();
        else {
            currentStage += 1;
            startCurrentStage();
        }
    });
    retryStageButton.addEventListener("click", startCurrentStage);
    beginButton.addEventListener("click", beginGame);
    viewResultsButton.addEventListener("click", () => {
        setResultsMode("streak");
        goTo("results.html");
    });
    document.addEventListener("visibilitychange", () => {
        if (document.hidden && stageIsActive) showMissed();
    });

    targetTemplate.classList.add("hidden");
    beginButton.disabled = true;
    beginButton.classList.add("hidden");
    introScreen.hidden = false;
    introScreen.classList.remove("hidden");
    updateDisplay();
    window.setTimeout(() => {
        beginButton.disabled = false;
        beginButton.classList.remove("hidden");
        requestAnimationFrame(() => beginButton.classList.add("show"));
        tutorialStatus.textContent = "Diyaar ma tahay?";
    }, 1200);
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

        document.body.classList.add("loaded");

        try {
            synchronizeStreakStorage();
            await processMissedStreakDaysSafely();
        } catch (error) {
            console.warn("Streak startup recovered safely.", error);
        }

        prepareNameInput();
        fillPlayerNameElements();
        updateWelcomeMessage();
        updateProgressBar();

        prepareReliableHomepageState();
        armAdsterraAdsAfterRealInteraction();
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
