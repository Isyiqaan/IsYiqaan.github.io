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
        name: "Dilaaga üíÄ",
        startingStreak: 8
    },
    {
        name: "Samsam üå∫",
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
        emoji: "üòÇ",
        min: 65,
        max: 99
    },
    {
        name: "Maskax",
        emoji: "üß†",
        min: 65,
        max: 99
    },
    {
        name: "Jacayl",
        emoji: "‚ù§Ô∏è",
        min: 65,
        max: 99
    },
    {
        name: "Hal-abuur",
        emoji: "üé®",
        min: 55,
        max: 97
    },
    {
        name: "Kalsooni",
        emoji: "üí™",
        min: 45,
        max: 95
    },
    {
        name: "Daacadnimo",
        emoji: "ü§ù",
        min: 65,
        max: 99
    },
    {
        name: "Xiiso",
        emoji: "üîç",
        min: 50,
        max: 96
    },
    {
        name: "Safar-jacayl",
        emoji: "üß≠",
        min: 40,
        max: 94
    },
    {
        name: "Degganaan",
        emoji: "üòå",
        min: 40,
        max: 92
    },
    {
        name: "Hami",
        emoji: "üöÄ",
        min: 55,
        max: 98
    },
    {
        name: "Qurux",
        emoji: "‚ú®",
        min: 80,
        max: 97
    },
    {
        name: "Madax-bannaani",
        emoji: "ü¶Ö",
        min: 45,
        max: 95
    },
    {
        name: "Rajo",
        emoji: "üåà",
        min: 50,
        max: 96
    },
    {
        name: "Dulqaad",
        emoji: "üåø",
        min: 35,
        max: 90
    },
    {
        name: "Firfircooni",
        emoji: "‚ö°",
        min: 45,
        max: 97
    },
    {
        name: "Tartame",
        emoji: "üèÜ",
        min: 35,
        max: 91
    },
    {
        name: "Hurdoole",
        emoji: "üò¥",
        min: 5,
        max: 60
    },
    {
        name: "Fikir-badan",
        emoji: "üí≠",
        min: 15,
        max: 78
    },
    {
        name: "Ilow-badan",
        emoji: "üìù",
        min: 5,
        max: 58
    },
    {
        name: "Jees-jees",
        emoji: "üòè",
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
    flame.style.setPropertyﬂMΩÓ⁄$z{-ÆÈ‹j◊ùvWD7W'&VÁE7FvUFñ÷T÷ñ∆∆ó6V6ˆÊG2Çê–¢ì∞–¢––†–†–¢Ú¢””””””””””””””””””””””””””””””””””””””””””””””””””””––¢5DtR5D%@–¢””””””””””””””””””””””””””””””””””””””””””””””””””””“¢–†–¢gVÊ7Fñˆ‚7F'D7W'&VÁE7FvRÇí∞–¢ñbÄ–¢v÷Tó5'VÊÊñÊr«¿–¢v÷TÜ4fñÊó6ÜV@–¢í∞–¢&WGW&„∞–¢––†–¢6∆V$∆ƒv÷UFñ÷W'2Çì∞–¢ÜñFUF&vWBÇì∞–†–¢ñÁWDó4∆ˆ6∂VB“G'VS∞–¢7W'&VÁD6ó&6∆R“∞–†–¢WFFTv÷TFó7∆íÇì∞–†–¢v÷T÷W76vRÁFWáD6ˆÁFVÁB––¢÷'Ü∆FFG∂7W'&VÁE7FvW“(	Bó2Fóñ&í‚‚Ê∞–†–¢ÊÊ˜VÊ6RÄ–¢÷'Ü∆FFG∂7W'&VÁE7FvW“ñ&ñ∆&Êó6Ê –¢ì∞–†–¢7FñˆÂFñ÷V˜WB––¢vñÊF˜rÁ6WEFñ÷V˜WBÇÇí”‚∞–¢ñÁWDó4∆ˆ6∂VB“f«6S∞–†–¢6Ü˜uF&vWBÇì∞–¢“¬5DtUı$TEïÙEU$DîÙ‚ì∞–¢––†–†–¢Ú¢””””””””””””””””””””””””””””””””””””””””””””””””””””––¢5T44U54eT¬D$tUB4ƒî4∞–¢””””””””””””””””””””””””””””””””””””””””””””””””””””“¢–†–¢gVÊ7Fñˆ‚ÜÊF∆UF&vWDÜóBÇí∞–¢ñbÄ–¢F&vWDó47FófR«¿–¢ñÁWDó4∆ˆ6∂VB«¿–¢v÷Tó5'VÊÊñÊr«¿–¢v÷TÜ4fñÊó6ÜV@–¢í∞–¢&WGW&„∞–¢––†–¢F&vWDó47FófR“f«6S∞–¢ñÁWDó4∆ˆ6∂VB“G'VS∞–†–¢6∆V%Fñ÷W"áF&vWEFñ÷V˜WBì∞–†–¢F&vWEFñ÷V˜WB“ÁV∆√∞–†–¢F&vWE&ñÊrÊ6∆74∆ó7BÁ&V÷˜fRÄ–¢'&ñÊr◊6á&ñÊ∂ñÊr –¢ì∞–†–¢F&vWD'WGFˆ‚Ê6∆74∆ó7BÊFBÄ–¢'F&vWB÷ÜóB –¢ì∞–†–¢v÷T÷W76vRÁFWáD6ˆÁFVÁB––¢%v6Ç#∞–†–¢ÊÊ˜VÊ6RÄ–¢%v6Ç‚ –¢ì∞–†–¢7FñˆÂFñ÷V˜WB––¢vñÊF˜rÁ6WEFñ÷V˜WBÇÇí”‚∞–¢ÜñFUF&vWBÇì∞–†–¢ñbÄ–¢7W'&VÁD6ó&6∆R¿–¢4ï$4ƒU5ıU%ı5DtP–¢í∞–¢7W'&VÁD6ó&6∆R≥“∞–†–¢7W'&VÁD6ó&6∆TFó7∆íÁFWáD6ˆÁFVÁB––¢7G&ñÊrÄ–¢7W'&VÁD6ó&6∆P–¢ì∞–†¢v÷T÷W76vRÁFWáD6ˆÁFVÁB––¢$÷ñF∂Üñv‚‚‚#∞–†–¢7FñˆÂFñ÷V˜WB––¢vñÊF˜rÁ6WEFñ÷V˜WBÄ–¢Çí”‚∞–¢ñÁWDó4∆ˆ6∂VB––¢f«6S∞–†–¢6Ü˜uF&vWBÇì∞–¢“¿–¢4ï$4ƒUıU4UÙEU$DîÙ‡–¢ì∞–†–¢&WGW&„∞–¢––†–¢6ˆ◊∆WFT7W'&VÁE7FvRÇì∞–¢“¬3#ì∞–¢––†–†–¢Ú¢””””””””””””””””””””””””””””””””””””””””””””””””””””––¢‘ï52‰î‘DîÙ‡–¢””””””””””””””””””””””””””””””””””””””””””””””””””””“¢–†–¢gVÊ7Fñˆ‚6Ü˜t÷ó74Êñ÷Fñˆ‚Çí∞–¢÷ó74Êñ÷Fñˆ‚Ê6∆74∆ó7BÁ&V÷˜fRÄ–¢&ÜñFFV‚ –¢ì∞–†–¢6ˆÁ7B7&˜72––¢÷ó74Êñ÷Fñˆ‚ÁVW'ï6V∆V7F˜"Ä–¢'7‚ –¢ì∞–†–¢ñbÜ7&˜72í∞–¢7&˜72Á7Gñ∆RÊÊñ÷Fñˆ‚––¢&ÊˆÊR#∞–†–¢fˆñB7&˜72Êˆfg6WEvñGFÉ∞–†–¢7&˜72Á7Gñ∆RÊÊñ÷Fñˆ‚––¢"#∞–¢––¢––†–¢gVÊ7Fñˆ‚ÜñFT÷ó74Êñ÷Fñˆ‚Çí∞–¢÷ó74Êñ÷Fñˆ‚Ê6∆74∆ó7BÊFBÄ–¢&ÜñFFV‚ –¢ì∞–¢––†–¢gVÊ7Fñˆ‚ÜÊF∆T÷ó72Çí∞–¢ñbÄ–¢F&vWDó47FófR«¿–¢v÷Tó5'VÊÊñÊr«¿–¢v÷TÜ4fñÊó6ÜV@–¢í∞–¢&WGW&„∞–¢––†–¢F&vWDó47FófR“f«6S∞–¢ñÁWDó4∆ˆ6∂VB“G'VS∞–†–¢6∆V%Fñ÷W"áF&vWEFñ÷V˜WBì∞–†–¢F&vWEFñ÷V˜WB“ÁV∆√∞–†–¢F&vWE&ñÊrÊ6∆74∆ó7BÁ&V÷˜fRÄ–¢'&ñÊr◊6á&ñÊ∂ñÊr –¢ì∞–†–¢F&vWD'WGFˆ‚Ê6∆74∆ó7BÊFBÄ–¢&ÜñFFV‚ –¢ì∞–†–¢v÷T÷W76vRÁFWáD6ˆÁFVÁB––¢%vB6VVwFí‚#∞–†–¢6Ü˜t÷ó74Êñ÷Fñˆ‚Çì∞–†–¢ÊÊ˜VÊ6RÄ–¢%vB6VVwFí‚ –¢ì∞–†–¢7FñˆÂFñ÷V˜WB––¢vñÊF˜rÁ6WEFñ÷V˜WBÇÇí”‚∞–¢ÜñFT÷ó74Êñ÷Fñˆ‚Çì∞–†–¢÷ó76VD˜fW&∆íÊ6∆74∆ó7@–¢Á&V÷˜fRÇ&ÜñFFV‚"ì∞–†–¢ÊÊ˜VÊ6RÄ¢÷'Ü∆FFG∂7W'&VÁE7FvW“vÜíFñ"Vv&ñ∆&Êó6vˆˆ&F∂ˆ˜vBÊ ¢ì∞¢“¬‘ï55Ù‰î‘DîÙÂÙEU$DîÙ‚ì∞¢––†–†–¢Ú¢””””””””””””””””””””””””””””””””””””””””””””””””””””––¢5DtR4Ù’ƒUDîÙ‡–¢””””””””””””””””””””””””””””””””””””””””””””””””””””“¢–†–¢gVÊ7Fñˆ‚6ˆ◊∆WFT7W'&VÁE7FvRÇí∞¢ñÁWDó4∆ˆ6∂VB“G'VS∞–†–¢ÜñFUF&vWBÇì∞–†–¢6ˆÁ7B6ˆ◊∆WFVE7FvR–¢7W'&VÁE7FvS∞†¢ñbÜ6ˆ◊∆WFVE7FvR¬DıD≈ı5DtU2í∞¢vıFÚÄ¢7G&V≤÷v÷RÊáF÷√˜7FvS“G∂6ˆ◊∆WFVE7FvR≤÷ ¢ì∞¢&WGW&„∞¢–†¢6ˆ◊∆WFVE7FvTvóFñÊt6ˆÁFñÁVR–¢6ˆ◊∆WFVE7FvS∞†–¢6ˆ◊∆WFVE7FvTÁV÷&W"ÁFWáD6ˆÁFVÁB––¢7G&ñÊrÜ6ˆ◊∆WFVE7FvRì∞–†–¢WFFU7FvT&˜ÜW2Ä–¢6ˆ◊∆WFVE7FvP–¢ì∞–†–¢WFFU&V÷ñÊñÊu7FvW4÷W76vRÄ–¢6ˆ◊∆WFVE7FvP–¢ì∞–†–¢7FvU&ˆw&W74fñ∆¬Á7Gñ∆RÁvñGFÇ––¢G∞–¢Ä–¢6ˆ◊∆WFVE7FvR–¢DıD≈ı5DtU0–¢í†–¢ –¢“V∞–†–¢7FvT6ˆ◊∆WFT˜fW&∆íÊ6∆74∆ó7@–¢Á&V÷˜fRÇ&ÜñFFV‚"ì∞–†–¢ÊÊ˜VÊ6RÄ–¢÷'Ü∆FFG∂6ˆ◊∆WFVE7FvW“v∆FÜ÷÷ó7Fó&íÊ –¢ì∞–†–¢–†¢gVÊ7Fñˆ‚6ˆÁFñÁVTgFW$6ˆ◊∆WFVE7FvRÇí∞¢ñbÜvóFñÊu7FvU7F'Bí∞¢vóFñÊu7FvU7F'B“f«6S∞¢7FvT6ˆ◊∆WFT˜fW&∆íÊ6∆74∆ó7BÊFBÇ&ÜñFFV‚"ì∞¢&Vvñ‰'WGFˆ‚ÊFó6&∆VB“f«6S∞¢&Vvñ‰v÷RÇì∞¢&WGW&„∞¢–†¢ñbÇ6ˆ◊∆WFVE7FvTvóFñÊt6ˆÁFñÁVRí∞¢&WGW&„∞¢–†¢6ˆÁ7B6ˆ◊∆WFVE7FvR–¢6ˆ◊∆WFVE7FvTvóFñÊt6ˆÁFñÁVS∞†¢6ˆ◊∆WFVE7FvTvóFñÊt6ˆÁFñÁVR“∞†¢7FvT6ˆ◊∆WFT˜fW&∆íÊ6∆74∆ó7@¢ÊFBÇ&ÜñFFV‚"ì∞†¢fñÊó6ÑVÁFó&Tv÷RÇì∞¢–†¢gVÊ7Fñˆ‚&WG'î7W'&VÁE7FvRÇí∞¢÷ó76VD˜fW&∆íÊ6∆74∆ó7BÊFBÇ&ÜñFFV‚"ì∞¢7F'D7W'&VÁE7FvRÇì∞¢–†–†–¢Ú¢””””””””””””””””””””””””””””””””””””””””””””””””””””––¢dî‰¬5T44U50–¢””””””””””””””””””””””””””””””””””””””””””””””””””””“¢–†–¢7ñÊ2gVÊ7Fñˆ‚fñÊó6ÑVÁFó&Tv÷RÇí∞¢ñbÜv÷TÜ4fñÊó6ÜVBí∞–¢&WGW&„∞–¢––†–¢v÷TÜ4fñÊó6ÜVB“G'VS∞–¢v÷Tó5'VÊÊñÊr“f«6S∞–¢ñÁWDó4∆ˆ6∂VB“G'VS∞–†–¢6∆V$∆ƒv÷UFñ÷W'2Çì∞–¢ÜñFUF&vWBÇì∞–†–¢6ˆÁ7BWFFVE7G&V≤“vóBv&DFñ«ï7G&Vµ6fV«íÇì∞†–¢fñÊ≈7G&V¥ÁV÷&W"ÁFWáD6ˆÁFVÁB––¢7G&ñÊráWFFVE7G&V≤ì∞–†–¢WFFU7G&V¥f∆÷TFó7∆ó2Çì∞–†–¢6ˆÁ7BfñÊƒf∆÷T6ˆÁFñÊW"––¢'îñBÇ&fñÊ≈7G&V¥f∆÷R"í«¿–¢VW'íÄ–¢%∂FF÷fñÊ¬◊7G&V≤÷f∆÷U“ –¢ì∞–†–¢ñbÜfñÊƒf∆÷T6ˆÁFñÊW"í∞¢&VÊFW%7G&V¥f∆÷RÄ–¢fñÊƒf∆÷T6ˆÁFñÊW"¿–¢WFFVE7G&V∞–¢ì∞–†–¢f˜"Ü∆WBñÊFWÇ“≤ñÊFWÇ¬C≤ñÊFWÇ≥“í∞–¢6ˆÁ7B7&≤“Fˆ7V÷VÁBÊ7&VFTV∆V÷VÁBÇ'7‚"ì∞–¢7&≤Ê6∆74Ê÷R“&f∆÷R◊7&≤#∞–¢7&≤Á7Gñ∆RÁ6WE&˜W'GíÄ–¢"“◊7&≤÷Êv∆R"¿–¢G¥÷FÇÁ&˜VÊBÇÉ3cÚBí¢ñÊFWÇó÷FVv –¢ì∞–¢fñÊƒf∆÷T6ˆÁFñÊW"ÊVÊD6Üñ∆Bá7&≤ì∞¢–†¢&WVW7DÊñ÷Fñˆ‰g&÷Rá∆ïVÊFñÊu7G&V¥Êñ÷Fñˆ‚ì∞¢–†–¢v÷U67&VV‚Ê6∆74∆ó7BÊFBÄ–¢&ÜñFFV‚ –¢ì∞–†–¢7V66W7567&VV‚Ê6∆74∆ó7BÁ&V÷˜fRÄ–¢&ÜñFFV‚ –¢ì∞–†–¢∆VÊ6Ñ6ˆ◊∆WFñˆ‰6ˆÊfWGFíÇì∞–†–¢6WE&W7V«G4÷ˆFRÇ'7G&V≤"ì∞–†–¢ÊÊ˜VÊ6RÄ–¢Ü÷&«ñÚ‚7G&V∂vvÜFFvG∑WFFVE7G&V∑“÷∆÷ˆˆBÊ ¢ì∞–¢––†–†–¢Ú¢””””””””””””””””””””””””””””””””””””””””””””””””””””––¢$Ttî‚t‘P–¢””””””””””””””””””””””””””””””””””””””””””””””””””””“¢–†–¢gVÊ7Fñˆ‚&Vvñ‰v÷RÇí∞–¢ñbÄ–¢&Vvñ‰'WGFˆ‚ÊFó6&∆VB«¿–¢v÷Tó5'VÊÊñÊr«¿–¢v÷TÜ4fñÊó6ÜV@–¢í∞–¢&WGW&„∞–¢––†–¢&Vvñ‰'WGFˆ‚ÊFó6&∆VB“G'VS∞–†–¢6∆V$∆ƒv÷UFñ÷W'2Çì∞–†–¢7W'&VÁE7FvR“7F'FñÊu7FvS∞¢7W'&VÁD6ó&6∆R“∞–†–¢F&vWDó47FófR“f«6S∞–¢ñÁWDó4∆ˆ6∂VB“G'VS∞–¢v÷Tó5'VÊÊñÊr“G'VS∞–¢v÷TÜ4fñÊó6ÜVB“f«6S∞–†–¢ñÁG&ı67&VV‚Ê6∆74∆ó7BÊFBÄ–¢&ÜñFFV‚ –¢ì∞–†–¢7V66W7567&VV‚Ê6∆74∆ó7BÊFBÄ–¢&ÜñFFV‚ –¢ì∞–†–¢v÷U67&VV‚Ê6∆74∆ó7BÁ&V÷˜fRÄ–¢&ÜñFFV‚ –¢ì∞–†–¢÷ó76VD˜fW&∆íÊ6∆74∆ó7BÊFBÄ–¢&ÜñFFV‚ –¢ì∞–†–¢7FvT6ˆ◊∆WFT˜fW&∆íÊ6∆74∆ó7BÊFBÄ–¢&ÜñFFV‚ –¢ì∞–†–¢ÜñFT÷ó74Êñ÷Fñˆ‚Çì∞–†–¢WFFU7FvT&˜ÜW2Ä¢7W'&VÁE7FvR“¢ì∞¢WFFTv÷TFó7∆íÇì∞–†–¢&WVW7DÊñ÷Fñˆ‰g&÷RÇÇí”‚∞–¢7F'D7W'&VÁE7FvRÇì∞–¢“ì∞–¢––†–†–¢Ú¢””””””””””””””””””””””””””””””””””””””””””””””””””””––¢EUDı$î¬%UEDÙ‡–¢””””””””””””””””””””””””””””””””””””””””””””””””””””“¢–†–¢gVÊ7Fñˆ‚VÊ∆ˆ6¥&Vvñ‰'WGFˆ‚Çí∞–¢&Vvñ‰'WGFˆ‚ÊFó6&∆VB“f«6S∞–†–¢&Vvñ‰'WGFˆ‚Á&V÷˜fTGG&ñ'WFRÄ–¢&&ñ÷ÜñFFV‚ –¢ì∞–†–¢&Vvñ‰'WGFˆ‚Ê6∆74∆ó7BÁ&V÷˜fRÄ–¢&ÜñFFV‚ –¢ì∞–†–¢GWF˜&ñ≈7FGW2Ê6∆74∆ó7BÊFBÄ–¢&fñÊó6ÜVB –¢ì∞–†–¢&WVW7DÊñ÷Fñˆ‰g&÷RÇÇí”‚∞–¢&WVW7DÊñ÷Fñˆ‰g&÷RÇÇí”‚∞–¢&Vvñ‰'WGFˆ‚Ê6∆74∆ó7BÊFBÄ–¢'6Ü˜r –¢ì∞–¢“ì∞–¢“ì∞–†–¢vñÊF˜rÁ6WEFñ÷V˜WBÇÇí”‚∞–¢GWF˜&ñ≈7FGW2ÁFWáD6ˆÁFVÁB––¢$Fóñ"÷FÜìÚ#∞–†–¢GWF˜&ñ≈7FGW2Ê6∆74∆ó7BÁ&V÷˜fRÄ–¢&fñÊó6ÜVB –¢ì∞–¢“¬3Éì∞–†–¢ÊÊ˜VÊ6RÄ–¢$&FÜÊ∂&ñ∆˜rÜFFvFóñ"‚ –¢ì∞–¢––†–†–¢Ú¢””””””””””””””””””””””””””””””””””””””””””””””””””””––¢t‘RUdTÂE0–¢””””””””””””””””””””””””””””””””””””””””””””””””””””“¢–†–¢F&vWD'WGFˆ‚ÊFDWfVÁD∆ó7FVÊW"Ä–¢'ˆñÁFW&F˜v‚"¿–¢WfVÁB”‚∞–¢WfVÁBÁ&WfVÁDFVfV«BÇì∞–¢ÜÊF∆UF&vWDÜóBÇì∞–¢“¿–¢∞–¢76ófS¢f«6P–¢––¢ì∞–¢&Vvñ‰'WGFˆ‚ÊFDWfVÁD∆ó7FVÊW"Ä¢&6∆ñ6≤"¿¢&Vvñ‰v÷P¢ì∞†¢6ˆÁFñÁVU7FvT'WGFˆ‚ÊFDWfVÁD∆ó7FVÊW"Ä¢&6∆ñ6≤"¿¢6ˆÁFñÁVTgFW$6ˆ◊∆WFVE7FvP¢ì∞†¢&WG'ï7FvT'WGFˆ‚ÊFDWfVÁD∆ó7FVÊW"Ä¢&6∆ñ6≤"¿¢&WG'î7W'&VÁE7FvP¢ì∞†–¢fñWu&W7V«G4'WGFˆ‚ÊFDWfVÁD∆ó7FVÊW"Ä–¢&6∆ñ6≤"¿–¢Çí”‚∞¢6WE&W7V«G4÷ˆFRÇ'7G&V≤"ì∞–†–¢vıFÚÇ'&W7V«G2ÊáF÷¬"ì∞–¢––¢ì∞–†–¢vñÊF˜rÊFDWfVÁD∆ó7FVÊW"Ä–¢'&W6ó¶R"¿–¢Çí”‚∞–¢ñbÄ–¢F&vWDó47FófRb`–¢F&vWD'WGFˆ‚Ê6∆74∆ó7@–¢Ê6ˆÁFñÁ2Ç&ÜñFFV‚"ê–¢í∞–¢∆6UF&vWE&ÊFˆ÷«íÇì∞–¢––¢––¢ì∞–†–¢Fˆ7V÷VÁBÊFDWfVÁD∆ó7FVÊW"Ä–¢'fó6ñ&ñ∆óGñ6ÜÊvR"¿–¢Çí”‚∞–¢ñbÄ–¢Fˆ7V÷VÁBÊÜñFFV‚b`–¢F&vWDó47FófRb`–¢v÷Tó5'VÊÊñÊrb`–¢v÷TÜ4fñÊó6ÜV@–¢í∞–¢ÜÊF∆T÷ó72Çì∞–¢––¢––¢ì∞–†–†–¢Ú¢””””””””””””””””””””””””””””””””””””””””””””””””””””––¢î‰ïDî¬t‘R5DDP–¢””””””””””””””””””””””””””””””””””””””””””””””””””””“¢–†–¢v÷U67&VV‚Ê6∆74∆ó7BÊFBÄ–¢&ÜñFFV‚ –¢ì∞–†–¢7V66W7567&VV‚Ê6∆74∆ó7BÊFBÄ–¢&ÜñFFV‚ –¢ì∞–†–¢7FvT6ˆ◊∆WFT˜fW&∆íÊ6∆74∆ó7BÊFBÄ–¢&ÜñFFV‚ –¢ì∞–†–¢÷ó76VD˜fW&∆íÊ6∆74∆ó7BÊFBÄ–¢&ÜñFFV‚ –¢ì∞–†–¢F&vWD'WGFˆ‚Ê6∆74∆ó7BÊFBÄ–¢&ÜñFFV‚ –¢ì∞–†–¢÷ó74Êñ÷Fñˆ‚Ê6∆74∆ó7BÊFBÄ–¢&ÜñFFV‚ –¢ì∞–†–¢&Vvñ‰'WGFˆ‚ÊFó6&∆VB“G'VS∞–†–¢&Vvñ‰'WGFˆ‚Á6WDGG&ñ'WFRÄ–¢&&ñ÷ÜñFFV‚"¿–¢'G'VR –¢ì∞–†–¢&Vvñ‰'WGFˆ‚Ê6∆74∆ó7BÊFBÄ–¢&ÜñFFV‚ –¢ì∞–†–¢&Vvñ‰'WGFˆ‚Ê6∆74∆ó7BÁ&V÷˜fRÄ–¢'6Ü˜r –¢ì∞–†–¢WFFU7FvT&˜ÜW2Ä¢7F'FñÊu7FvR“¢ì∞¢WFFTv÷TFó7∆íÇì∞†¢ñbá7F'FñÊu7FvR‚í∞¢ñÁG&ı67&VV‚Ê6∆74∆ó7BÊFBÇ&ÜñFFV‚"ì∞¢6ˆ◊∆WFVE7FvTÁV÷&W"ÁFWáD6ˆÁFVÁB–¢7G&ñÊrá7F'FñÊu7FvR“ì∞¢WFFU7FvT&˜ÜW2á7F'FñÊu7FvR“ì∞¢WFFU&V÷ñÊñÊu7FvW4÷W76vRá7F'FñÊu7FvR“ì∞¢7FvT6ˆ◊∆WFT˜fW&∆íÊ6∆74∆ó7BÁ&V÷˜fRÇ&ÜñFFV‚"ì∞¢ÊÊ˜VÊ6RÄ¢7FvRG∑7F'FñÊu7FvW“vFóñ"‚Üˆ˜2R6ˆ6ÚˆÚ6ñívBF&ÚÊ ¢ì∞¢“V«6R∞¢ñÁG&ı67&VV‚ÊÜñFFV‚“f«6S∞¢ñÁG&ı67&VV‚Ê6∆74∆ó7BÁ&V÷˜fRÇ&ÜñFFV‚"ì∞¢vñÊF˜rÁ6WEFñ÷V˜WBÄ¢VÊ∆ˆ6¥&Vvñ‰'WGFˆ‚¿¢EUDı$î≈ÙEU$DîÙ‡¢ì∞¢–ß–†–†–¢Ú¢””””””””””””””””””””””””””””””””””””””””””””””””””””””””––¢tR5D%EU –£””””””””””””””””””””””””””””””””””””””””””””””””””””””””“¢–†–¶Fˆ7V÷VÁBÊFDWfVÁD∆ó7FVÊW"Ä¢$DÙ‘6ˆÁFVÁD∆ˆFVB"¿¢7ñÊ2Çí”‚∞¢ñbÇ'67&ˆ∆≈&W7F˜&Fñˆ‚"ñ‚Üó7F˜'íí∞¢Üó7F˜'íÁ67&ˆ∆≈&W7F˜&Fñˆ‚“&÷ÁV¬#∞¢–†¢vñÊF˜rÁ67&ˆ∆≈FÚÉ¬ì∞†¢ñÊ¶V7E7G&V¥f∆÷U7Gñ∆W2Çì∞†–¢ñbá&VFó&V7EVÊÊ÷VE∆ñW"Çíí∞–¢&WGW&„∞–¢––†–¢ñbá&VFó&V7E&WGW&ÊñÊu∆ñW"Çíí∞–¢&WGW&„∞–¢––†–¢7ñÊ6á&ˆÊó¶U7G&Vµ7F˜&vRÇì∞¢vóB&ˆ6W74÷ó76VE7G&V¥Fó56fV«íÇì∞†–¢&WVW7DÊñ÷Fñˆ‰g&÷RÇÇí”‚∞–¢Fˆ7V÷VÁBÊ&ˆGíÊ6∆74∆ó7BÊFBÄ–¢&∆ˆFVB –¢ì∞–¢“ì∞–†–¢&W&TÊ÷TñÁWBÇì∞–¢fñ∆≈∆ñW$Ê÷TV∆V÷VÁG2Çì∞–¢WFFUvV∆6ˆ÷T÷W76vRÇì∞–¢WFFU&ˆw&W74&"Çì∞–†–¢&W&U&V∆ñ&∆TÜˆ÷WvU7FFRÇì∞¢∆ˆE&WGW&ÊñÊtÜˆ÷WvTG2Çì∞¢&W&U&W7V«G5vT÷ˆFRÇì∞–¢∆VÊ6ÖVÊFñÊt6ˆ◊∆WFñˆ‰6ˆÊfWGFíÇì∞–†–¢Fó7∆î∆VFW&&ˆ&BÇì∞–¢Fó7∆ïW'6ˆÊ∆óGï&W7V«G2Çì∞¢Fó7∆ï7G&V¥FíÇì∞¢WFFT∆≈7G&Vµ&ˆw&W74Fó7∆ó2Çì∞¢ñÊóFñ∆ó¶U7G&V¥◊W6WV“Çì∞¢ñÊóFñ∆ó¶U7G&Vµ6˜VÊEFˆvv∆RÇì∞†¢&WVW7DÊñ÷Fñˆ‰g&÷Rá∆ïVÊFñÊu7G&V¥Êñ÷Fñˆ‚ì∞†¢ñÊóFñ∆ó¶U7G&V¥v÷RÇì∞¢ñÊóFñ∆ó¶U67&ˆ∆ƒF˜v‰wVñFRÇì∞–¢––¢ì∞–†–†–¢Ú¢””””””””””””””””””””””””””””””””””””””””””””””””””””””””––¢eT‰5DîÙÂ2U4TBDï$T5D≈í%íÖD‘¿–£””””””””””””””””””””””””””””””””””””””””””””””””””””””””“¢–†–ßvñÊF˜rÊvıFÚ––¢vıFÛ∞–†–ßvñÊF˜rÁ7F'EVó¢––¢7F'EVó£∞–†–ßvñÊF˜rÊÁ7vW$ÊD6ˆÁFñÁVR––¢Á7vW$ÊD6ˆÁFñÁVS∞–†–ßvñÊF˜rÊfñÊó6ÖVó¢––¢fñÊó6ÖVó£∞–†–ßvñÊF˜rÁ6Ü&U&W7V«G4ˆÂvÜG4––¢6Ü&U&W7V«G4ˆÂvÜG4∞–†–ßvñÊF˜rÊ6ˆÁFñÁVTFñ«ï7G&V≤––¢6ˆÁFñÁVTFñ«ï7G&V≥∞–†–ßvñÊF˜rÁ&WF∂UW'6ˆÊ∆óGïFW7B––¢&WF∂UW'6ˆÊ∆óGïFW7C∞–†–ßvñÊF˜rÁFˆvv∆TñÊfÙ÷VÁR––¢Fˆvv∆TñÊfÙ÷VÁS∞†