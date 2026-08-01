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
            className: "flame-purple",
            label: "Olol purple ah oo leh laba olol oo yaryar",
            shareEmoji: "Olol purple",
            sideFlames: true,
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

    const sideFlamesMarkup = tier.sideFlames
        ? `
            <g class="flame-side-group" aria-hidden="true">
                <path class="flame-side flame-side-left" d="M22 122 C12 122 7 114 9 104 C11 95 17 90 18 81 C27 89 30 99 26 107 C30 105 33 102 35 98 C38 110 33 122 22 122 Z" />
                <path class="flame-side flame-side-right" d="M78 122 C68 122 63 114 65 104 C67 95 73 90 74 81 C83 89 86 99 82 107 C86 105 89 102 91 98 C94 110 89 122 78 122 Z" />
            </g>`
        : "";

    const crownMarkup = tier.crown
        ? `
            <g class="flame-crown" aria-hidden="true">
                <path d="M31 24 L28 7 L43 16 L50 2 L58 16 L73 7 L69 25 Z" />
                <path class="flame-crown-band" d="M31 24 Q50 30 69 24 L67 32 Q50 37 33 32 Z" />
                <circle cx="29" cy="7" r="3" />
                <circle cx="50" cy="2" r="3" />
                <circle cx="73" cy="7" r="3" />
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
        </defs>
        ${crownMarkup}
        ${sideFlamesMarkup}
        <g class="flame-outer-group">
            <path class="flame-outer" style="fill:url(#${outerGradientId})" d="M50 137 C25 137 8 121 8 96 C8 76 20 62 31 48 C42 35 45 20 43 6 C62 18 72 37 68 56 C76 53 83 45 87 34 C98 52 100 72 94 91 C87 120 72 137 50 137 Z" />
            <path class="flame-soft-light" d="M22 111 C17 88 31 70 42 55 C49 46 54 36 55 26 C65 42 66 58 59 73 C51 90 45 104 49 122 C38 108 29 105 22 111 Z" />
            <path class="flame-shine" d="M20 99 C20 82 29 69 39 56 C45 48 49 40 52 31 C50 48 43 61 36 74 C30 86 27 98 29 110 C23 108 20 104 20 99 Z" />
        </g>
        <g class="flame-inner-group">
            <path class="flame-inner" style="fill:url(#${middleGradientId})" d="M51 128 C37 128 27 118 28 103 C29 91 37 83 43 74 C49 66 52 57 52 48 C65 60 71 74 67 88 C73 85 77 80 79 73 C86 87 85 100 79 111 C72 122 63 128 51 128 Z" />
            <path class="flame-core" d="M52 124 C43 124 37 117 38 108 C39 99 46 94 50 87 C54 81 56 76 57 69 C65 78 68 89 64 99 C68 97 71 94 73 90 C76 101 73 113 66 119 C62 123 57 124 52 124 Z" />
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

    return generatePersonalityResults();
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
    setResultsMode("personality");
    goTo("question1.html");
}

function finishQuiz() {
    if (isNavigating) {
        return;
    }

    const isFirstPersonalityTest =
        !localStorage.getItem(
            STORAGE_KEYS.personalityResults
        );

    generatePersonalityResults();

    if (isFirstPersonalityTest) {
        saveUnifiedStreakDay(1);
        saveLastCompletedDate(
            getLocalDateKey()
        );

        localStorage.setItem(
            STORAGE_KEYS.completedToday,
            "true"
        );

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
    const possibleValues = [
        localStorage.getItem(
            STORAGE_KEYS.streak
        ),
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
        possibleValues.push(backup.streak);
    } catch (error) {
        console.warn("Streak backup could not be read.", error);
    }

    const validValues = possibleValues
        .map(value => Number.parseInt(value, 10))
        .filter(value => Number.isFinite(value) && value >= 0);

    return validValues.length
        ? Math.max(...validValues)
        : 0;
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

function hasCompletedStreakToday() {
    return (
        getLastCompletedDate() ===
        getLocalDateKey()
    );
}

function completeDailyStreak() {
    const today =
        getLocalDateKey();

    const yesterday =
        getYesterdayDateKey();

    const previousDate =
        getLastCompletedDate();

    let currentStreak =
        getSavedStreakDay();

    if (previousDate === today) {
        localStorage.setItem(
            STORAGE_KEYS.completedToday,
            "true"
        );

        return Math.max(
            1,
            currentStreak
        );
    }

    if (previousDate === yesterday) {
        currentStreak += 1;
    } else if (!previousDate && currentStreak > 0) {
        /*
          Older versions saved the streak number without a completion date.
          Preserve that real progress during migration instead of resetting it.
        */
        currentStreak += 1;
    } else {
        currentStreak = 1;
    }

    saveUnifiedStreakDay(
        currentStreak
    );

    saveLastCompletedDate(today);

    localStorage.setItem(
        STORAGE_KEYS.completedToday,
        "true"
    );

    return currentStreak;
}

function displayStreakDay() {
    const displayedStreak =
        Math.max(
            1,
            getSavedStreakDay()
        );

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
    const findMainTarget = () => {
        const candidates = queryAll(
            "main.content, main.container, .streak-screen:not(.hidden)"
        );
        return candidates.find(element => element.getClientRects().length) || null;
    };

    const guide = document.createElement("button");
    guide.type = "button";
    guide.className = "scroll-down-guide";
    guide.setAttribute("aria-label", "Scroll down to the main content");
    guide.innerHTML = '<span>Scroll down</span><i aria-hidden="true"></i>';
    document.body.appendChild(guide);

    const update = () => {
        const target = findMainTarget();
        if (!target) {
            guide.classList.remove("show");
            return;
        }
        const rect = target.getBoundingClientRect();
        const mainIsVisible = rect.top < window.innerHeight * 0.72 && rect.bottom > 90;
        guide.classList.toggle("show", !mainIsVisible && rect.top > 0);
        guide.dataset.targetTop = String(Math.round(rect.top + window.scrollY));
    };

    guide.addEventListener("click", () => {
        const target = findMainTarget();
        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    new MutationObserver(update).observe(document.body, {
        subtree: true,
        attributes: true,
        attributeFilter: ["class", "hidden"]
    });
    window.setTimeout(update, 250);
    window.setTimeout(update, 1200);
}


/* =========================================================
   HOMEPAGE STREAK ACTIONS
========================================================= */

function showAlreadyCompletedMessage() {
    const message =
        "Maanta streak gaaga waad sii wadatay! Berri soo noqo si aanu streak gaagu u go'in. 🔥";

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

function prepareHomepageActions() {
    if (
        getCurrentPageName() !==
        "index.html"
    ) {
        return;
    }

    const mainMessage =
        byId("homeMainMessage");

    const streakCard =
        query(".home-streak-card");

    const continueButton =
        byId("continueStreakButton");

    const retakeButton =
        byId("retakeTestButton");

    const takeTestAgainButton =
        byId("takeTestAgainButton");

    if (takeTestAgainButton) {
        takeTestAgainButton.onclick = event => {
            event.preventDefault();
            retakePersonalityTest();
        };
    }

    const completedMessage =
        byId(
            "streakAlreadyCompletedMessage"
        );

    const hasPersonalityResults =
        Boolean(
            localStorage.getItem(
                STORAGE_KEYS.personalityResults
            )
        );

    /*
      FIRST-TIME PLAYER
    */
    if (!hasPersonalityResults) {
        if (mainMessage) {
            mainMessage.textContent =
                "Ku soo dhowow imtixaanka shakhsiyadda! Waxaad ka jawaabi doontaa su’aalo fudud oo kaa caawinaya inaad ogaato shakhsiyaddaada, oo streak furatid! Badhanka hoose taabo si aad u bilowdid.";
        }

        setElementVisibility(
            streakCard,
            false
        );

        setElementVisibility(
            retakeButton,
            false
        );

        setElementVisibility(
            takeTestAgainButton,
            false
        );

        setElementVisibility(
            completedMessage,
            false
        );

        if (continueButton) {
            setElementVisibility(
                continueButton,
                true
            );

            continueButton.textContent =
                "Bilow Imtixaanka ✨";

            continueButton.onclick =
                event => {
                    event.preventDefault();

                    goTo(
                        "question1.html"
                    );
                };
        }

        return;
    }

    /*
      RETURNING PLAYER
    */
    setElementVisibility(
        streakCard,
        true
    );

    setElementVisibility(
        retakeButton,
        true
    );

    setElementVisibility(
        takeTestAgainButton,
        true
    );

    if (retakeButton) {
        retakeButton.textContent =
            "Shakhsiyadaada eeg";

        retakeButton.onclick =
            event => {
                event.preventDefault();

                setResultsMode(
                    "personality"
                );

                goTo(
                    "results.html"
                );
            };
    }

    const completedToday =
        hasCompletedStreakToday();

    if (completedToday) {
        if (mainMessage) {
            mainMessage.textContent =
                "Maanta streak gaaga waad sii wadatay! Berri soo noqo si aad mar kale u sii wadato.";
        }

        if (continueButton) {
            continueButton.textContent =
                "🌙 Berri Soo Noqo";

            continueButton.onclick =
                event => {
                    event.preventDefault();

                    showAlreadyCompletedMessage();
                };
        }

        if (completedMessage) {
            completedMessage.textContent =
                "Maanta streak gaaga waad sii wadatay! Berri soo noqo si aanu streak gaagu u go'in. 🔥";

            setElementVisibility(
                completedMessage,
                true
            );
        }

        return;
    }

    /*
      RETURNING PLAYER WHO CAN PLAY TODAY
    */
    if (mainMessage) {
        mainMessage.textContent =
            "Maanta waa fursaddaada inaad streak gaaga sii wadato!";
    }

    if (continueButton) {
        continueButton.textContent =
            "Sii wad streak gaaga";

        continueButton.onclick =
            event => {
                event.preventDefault();

                continueDailyStreak();
            };
    }

    setElementVisibility(
        completedMessage,
        false
    );
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
                ? "🎉 streak gaaga Waa Dhammaystirtay 🎉"
                : "🎉 Shakhsiyadaada 🎉";
    }

    if (subtitle) {
        subtitle.textContent =
            mode === "streak"
                ? "Maanta streak gaaga waad sii wadatay."
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
        "streak gaaga";

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
        "Maanta streak gaaga si guul leh ayaad u sii wadatay.";

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
                : "Sii Wad streak gaaga";

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
            "Mar Kale Qaado";

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
        `🔥 Maalinta ${streakDay}aad ee streak gaaga waa dhammaatay`,
        "",
        "Kaalay adiguna is tijaabi",
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

        @keyframes flameVictory {
            0% { transform: scale(.35) rotate(-24deg); opacity: 0; }
            45% { transform: scale(1.35) rotate(370deg); opacity: 1; }
            72% { transform: scale(.92) rotate(350deg); }
            100% { transform: scale(1.08) rotate(360deg); }
        }

        @keyframes crownFloat {
            0% { transform: translateY(0) rotate(-1.5deg); }
            100% { transform: translateY(-2px) rotate(1.5deg); }
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
            .flame-inner-group,
            .flame-core,
            .flame-embers circle,
            .flame-side,
            .flame-crown,
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
    if (
        !document.body.classList.contains(
            "streak-game-page"
        )
    ) {
        return;
    }

    const introScreen =
        byId("streakIntro");

    const beginButton =
        byId("beginStreakButton");

    const tutorialStatus =
        byId("tutorialStatus");

    const gameScreen =
        byId("streakGame");

    const gameArea =
        byId("gameArea");

    const gameMessage =
        byId("gameMessage");

    const targetButton =
        byId("targetButton");

    const targetRing =
        byId("targetRing");

    const missAnimation =
        byId("missAnimation");

    const currentStageDisplay =
        byId("currentStage");

    const currentCircleDisplay =
        byId("currentCircle");

    const stageTimerDisplay =
        byId("stageTimerValue");

    const stageProgressFill =
        byId("stageProgressFill");

    const stageCompleteOverlay =
        byId("stageCompleteOverlay");

    const completedStageNumber =
        byId("completedStageNumber");

    const remainingStagesText =
        byId("remainingStagesText");

    const continueStageButton =
        byId("continueStageButton");

    const missedOverlay =
        byId("missedOverlay");

    const retryStageButton =
        byId("retryStageButton");

    const successScreen =
        byId("streakSuccessScreen");

    const finalStreakNumber =
        byId("finalStreakNumber");

    const viewResultsButton =
        byId("viewResultsButton");

    const gameAnnouncement =
        byId("gameAnnouncement");

    const stageBoxes =
        queryAll(".stage-box");

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
        continueStageButton,
        missedOverlay,
        retryStageButton,
        successScreen,
        finalStreakNumber,
        viewResultsButton
    ];

    if (
        requiredElements.some(
            element => !element
        )
    ) {
        console.error(
            "Ciyaarta streak-ga ma bilaaban karto sababtoo ah qaar ka mid ah qaybaha HTML-ka ayaa maqan."
        );

        return;
    }


    /* =====================================================
       GAME SETTINGS
    ===================================================== */

    const TOTAL_STAGES = 10;
    const CIRCLES_PER_STAGE = 3;

    const TUTORIAL_DURATION = 5000;
    const CIRCLE_PAUSE_DURATION = 500;
    const STAGE_READY_DURATION = 700;
    const MISS_ANIMATION_DURATION = 700;

    const STAGE_TIMES = [
        1.0,
        0.9,
        0.85,
        0.84,
        0.81,
        0.8,
        0.79,
        0.75,
        0.73,
        0.69
    ];


    /* =====================================================
       GAME STATE
    ===================================================== */

    const requestedStage =
        Number.parseInt(
            new URLSearchParams(
                window.location.search
            ).get("stage"),
            10
        );

    const startingStage =
        Number.isFinite(requestedStage)
            ? Math.min(
                TOTAL_STAGES,
                Math.max(1, requestedStage)
            )
            : 1;

    let currentStage = startingStage;
    let currentCircle = 1;

    let targetTimeout = null;
    let actionTimeout = null;
    let overlayTimeout = null;

    let targetIsActive = false;
    let gameIsRunning = false;
    let inputIsLocked = true;
    let gameHasFinished = false;
    let completedStageAwaitingContinue = 0;
    let awaitingStageStart = startingStage > 1;


    /* =====================================================
       TIMER HELPERS
    ===================================================== */

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


    /* =====================================================
       SCREEN READER ANNOUNCEMENTS
    ===================================================== */

    function announce(message) {
        if (!gameAnnouncement) {
            return;
        }

        gameAnnouncement.textContent =
            "";

        window.setTimeout(() => {
            gameAnnouncement.textContent =
                message;
        }, 20);
    }


    /* =====================================================
       GAME DISPLAY
    ===================================================== */

    function getCurrentStageTime() {
        return STAGE_TIMES[
            currentStage - 1
        ];
    }

    function getCurrentStageTimeMilliseconds() {
        return (
            getCurrentStageTime() *
            1000
        );
    }

    function updateGameDisplay() {
        currentStageDisplay.textContent =
            String(currentStage);

        currentCircleDisplay.textContent =
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