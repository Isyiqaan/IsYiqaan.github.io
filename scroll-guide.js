"use strict";

(function () {
    function initializeAds() {
        if (document.getElementById("siteAdsterraAds")) return;
        const host = document.createElement("section");
        host.id = "siteAdsterraAds";
        host.className = "site-adsterra-ads";
        host.setAttribute("aria-label", "Advertisement");
        host.innerHTML = '<aside class="page-native-ad"><p class="stage-ad-label">XAYSIIS</p><div id="container-de0a31b62be16fbc9bd0ff721c7826ab"></div></aside><aside class="page-banner-ad"><p class="stage-ad-label">XAYSIIS</p></aside>';
        const footer = document.querySelector(".site-footer-nav, footer");
        if (footer?.parentNode) footer.parentNode.insertBefore(host, footer);
        else document.body.appendChild(host);

        const nativeScript = document.createElement("script");
        nativeScript.async = true;
        nativeScript.dataset.cfasync = "false";
        nativeScript.src = "https://hystericallikingdowntown.com/de0a31b62be16fbc9bd0ff721c7826ab/invoke.js";
        host.querySelector(".page-native-ad").prepend(nativeScript);

        window.atOptions = { key: "8a204881cd2d5d7ae3ff7e30232fc0b3", format: "iframe", height: 250, width: 300, params: {} };
        const bannerScript = document.createElement("script");
        bannerScript.src = "https://hystericallikingdowntown.com/8a204881cd2d5d7ae3ff7e30232fc0b3/invoke.js";
        host.querySelector(".page-banner-ad").appendChild(bannerScript);

        const socialScript = document.createElement("script");
        socialScript.async = true;
        socialScript.src = "https://hystericallikingdowntown.com/fe/53/30/fe53304fec9f06f8ed97fe7f2861d78a.js";
        document.body.appendChild(socialScript);
    }

    function initializeGuide() {
        if (document.querySelector(".scroll-down-guide")) return;
        const guide = document.createElement("button");
        guide.type = "button";
        guide.className = "scroll-down-guide";
        guide.setAttribute("aria-label", "Hoos u soco bogga");
        guide.innerHTML = '<span>Hoos u soco</span><i aria-hidden="true"></i>';
        document.body.appendChild(guide);
        let dismissed = false;
        const update = () => {
            if (dismissed) return;
            const bottom = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
            const remaining = bottom - (window.scrollY + window.innerHeight);
            guide.classList.toggle("show", remaining > 56);
            if (remaining <= 56 && window.scrollY > 20) dismissed = true;
        };
        guide.addEventListener("click", () => {
            const main = document.querySelector("main");
            if (main && main.getBoundingClientRect().top > window.innerHeight * 0.45) {
                main.scrollIntoView({ behavior: "smooth", block: "start" });
            } else {
                window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
            }
        });
        addEventListener("scroll", update, { passive: true });
        addEventListener("resize", update);
        setTimeout(update, 150);
        setTimeout(update, 900);
    }

    function start() {
        document.body.classList.add("loaded");
        initializeGuide();
        window.setTimeout(initializeAds, 350);
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
    else start();
}());
