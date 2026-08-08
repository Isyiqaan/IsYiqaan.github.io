"use strict";

(function () {
    function initializeAds() {
        if (document.getElementById("siteAdsterraAds")) return;
    
        const createAdFrame = (title, source, height, className) => {
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
    
        const host = document.createElement("section");
        host.id = "siteAdsterraAds";
        host.className = "site-adsterra-ads";
        host.setAttribute("aria-label", "Advertisement");
        const nativeHost = document.createElement("aside");
        nativeHost.className = "page-native-ad";
        const bannerHost = document.createElement("aside");
        bannerHost.className = "page-banner-ad";
        nativeHost.innerHTML = '<p class="stage-ad-label">XAYSIIS</p>';
        bannerHost.innerHTML = '<p class="stage-ad-label">XAYSIIS</p>';
    
        nativeHost.appendChild(createAdFrame(
            "Advertisement",
            '<!doctype html><html><body style="margin:0"><script async="async" data-cfasync="false" src="https://hystericallikingdowntown.com/de0a31b62be16fbc9bd0ff721c7826ab/invoke.js"><\\/script><div id="container-de0a31b62be16fbc9bd0ff721c7826ab"></div></body></html>',
            300,
            "adsterra-native-frame"
        ));
        bannerHost.appendChild(createAdFrame(
            "Advertisement",
            '<!doctype html><html><body style="margin:0"><script>atOptions={key:"8a204881cd2d5d7ae3ff7e30232fc0b3",format:"iframe",height:250,width:300,params:{}};<\\/script><script src="https://hystericallikingdowntown.com/8a204881cd2d5d7ae3ff7e30232fc0b3/invoke.js"><\\/script></body></html>',
            250,
            "adsterra-banner-frame"
        ));
        host.append(nativeHost, bannerHost);
    
        const footer = document.querySelector(".site-footer-nav, footer");
        if (footer?.parentNode) footer.parentNode.insertBefore(host, footer);
        else document.body.appendChild(host);
    
        const socialFrame = createAdFrame(
            "Advertisement",
            '<!doctype html><html><body style="margin:0;overflow:hidden"><script src="https://hystericallikingdowntown.com/fe/53/30/fe53304fec9f06f8ed97fe7f2861d78a.js"><\\/script></body></html>',
            90,
            "adsterra-social-frame"
        );
        socialFrame.width = "100%";
        document.body.appendChild(socialFrame);
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
