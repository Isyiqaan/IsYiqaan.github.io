"use strict";

function initializeStandaloneScrollGuide() {
    if (document.querySelector(".scroll-down-guide")) return;

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
        window.scrollBy({
            top: Math.max(240, window.innerHeight * 0.72),
            behavior: "smooth"
        });
    });

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.setTimeout(update, 100);
    window.setTimeout(update, 700);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeStandaloneScrollGuide, { once: true });
} else {
    initializeStandaloneScrollGuide();
}
