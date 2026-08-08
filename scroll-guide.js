"use strict";

(function () {
    function initializeAds() {
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
    
        let userInteracted = false;
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
        };
        const markInteraction = () => {
            userInteracted = true;
            maybeStart();
        };
        window.addEventListener("scroll", markInteraction, { passive: true, once: true });
        window.addEventListener("pointerdown", markInteraction, { passive: true, once: true });
        window.addEventListener("keydown", markInteraction, { once: true });
        const observer = new IntersectionObserver(entries => {
            adAreaVisible = entries.some(entry => entry.isIntersecting);
            maybeStart();
            if (started) observer.disconnect();
        }, { rootMargin: "120px 0px", threshold: 0.01 });
        observer.observe(host);
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
