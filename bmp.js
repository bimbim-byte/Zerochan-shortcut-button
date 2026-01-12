const regexStaticFile = /^https:\/\/static\.[^\/]+\/.+\.[a-zA-Z0-9]+$/;

function attachSafeClick(a, handler) {
    if (a.dataset.dexyBound) return;
    a.dataset.dexyBound = "1";
    a.addEventListener("click", e => {
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        handler(a.href);
    });
}

function getMode() {
    for (const link of document.querySelectorAll('a[href*="?m="]')) {
        if (link.classList.contains('active') || link.getAttribute('aria-pressed') === 'true') {
            const mValue = new URL(link.href, location.origin).searchParams.get('m');
            return mValue ? parseInt(mValue) : null;
        }
    }
    return null;
}

function getThumbUL() {
    return [...document.querySelectorAll("ul")].find(ul => ul.id?.includes("thumbs")) || null;
}

function buildStaticLink(li) {
    const img = li.querySelector("a.thumb img");
    if (!img) return null;
    const ext = (img.title.split("\n")[0].match(/\b([a-zA-Z0-9]+)\s*$/) || [,''])[1].toLowerCase();
    const name = img.alt.replace(/\s+/g, ".");
    const id = li.dataset.id;
    return `https://static.zerochan.net/${name}.full.${id}.${ext}`;
}

function setupLinkActions(p, open, download) {
    const links = p.querySelectorAll("a");
    if (links[0]) attachSafeClick(links[0], url => chrome.runtime.sendMessage({ action: "openBackgroundTab", url }));
    if (links[1]) attachSafeClick(links[1], () => chrome.runtime.sendMessage({ download }));
}

function mode0to2(items) {
    items.forEach(li => {
        const p = li.querySelector("p");
        if (!p) return;
        const my_a = p.querySelectorAll("a");

        if (my_a.length === 1) {
            const a0 = my_a[0], href = a0.href;
            a0.target = "_blank";

            if (regexStaticFile.test(href)) {
                attachSafeClick(a0, url => chrome.runtime.sendMessage({ download: url }));
                return;
            }

            const link = buildStaticLink(li);
            if (!link) return;

            const a = document.createElement("a");
            a.href = link; a.target = "_blank";
            const s = document.createElement("s");
            s.className = "tiny download"; s.title = `download image`; s.style.marginBottom = "-3px";
            a.appendChild(s);
            p.appendChild(a);

            setupLinkActions(p, true, link);
        } else {
            my_a.forEach(a => a.target = "_blank");
            setupLinkActions(p, true, my_a[1]?.href);
        }
    });
}

function mode3(items) {
    items.forEach(li => {
        const p = li.querySelector("p");
        if (!p) return;
        const last = p.querySelector("a:last-child");
        if (!last) return;

        last.target = "_blank";

        if (regexStaticFile.test(last.href)) {
            attachSafeClick(last, () => chrome.runtime.sendMessage({ download: last.href }));
            return;
        }

        const link = buildStaticLink(li);
        if (!link) return;

        const a = document.createElement("a");
        a.href = link; a.target = "_blank";
        const s = document.createElement("s");
        s.className = "tiny download"; s.title = "download image"; s.style.marginBottom = "-3px";
        a.appendChild(s);
        p.appendChild(a);

        attachSafeClick(a, () => chrome.runtime.sendMessage({ download: link }));
    });
}

function mode4() {
    document.querySelectorAll('a.thumb').forEach(thumb => {
        if (thumb.dataset.dexyInjected) return;
        thumb.dataset.dexyInjected = "1";

        const id = (thumb.href.match(/\/(\d+)/) || [,''])[1];
        const bg = thumb.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
        if (!id || !bg) return;

        const imageUrl = bg[1];
        const btn = document.createElement("a");
        btn.href = imageUrl; btn.target = "_blank";
        btn.style = "position:absolute;right:6px;bottom:6px;z-index:10;";
        const s = document.createElement("s"); s.className = "tiny download"; s.title = "Download image";
        btn.appendChild(s);
        thumb.style.position = "relative";
        thumb.appendChild(btn);

        attachSafeClick(btn, () => chrome.runtime.sendMessage({ download: imageUrl }));
    });
}

function runDexy() {
    console.log("Dexy running");
    const mode = getMode();
    if (mode === null) {
        // return console.log("Mode not detected");
        const ul = getThumbUL();
        if (ul) mode0to2(ul.querySelectorAll("li"));
    } else if (mode >= 0 && mode <= 2) {
        const ul = getThumbUL();
        if (ul) mode0to2(ul.querySelectorAll("li"));
    } else if (mode === 3) {
        const ul = getThumbUL();
        if (ul) mode3(ul.querySelectorAll("li"));
    } else if (mode === 4) {
        mode4();
    }
}

function createFloatingButton() {
    if (document.getElementById("extReloadBtn")) return;
    const btn = document.createElement("button");
    btn.id = "extReloadBtn";
    btn.innerText = "Reload Extension";
    Object.assign(btn.style, {
        position: "fixed", bottom: "20px", left: "20px", padding: "10px 18px",
        borderRadius: "10px", fontSize: "14px", color: "#fff", border: "none",
        cursor: "pointer", zIndex: "999999", background: "rgba(0,0,0,0.70)",
        boxShadow: "0 0 12px rgba(0,0,0,0.35)"
    });
    btn.onclick = () => { console.log("Re-running extension..."); runDexy(); };
    document.body.appendChild(btn);
}

createFloatingButton();
runDexy();
