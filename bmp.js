function attachSafeClick(a, handler) {
    if (a.dataset.dexyBound) return;
    a.dataset.dexyBound = "1";

    a.addEventListener("click", (e) => {
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        handler(a.href);
    });
}

function runDexy() {
    console.log("Dexy running");

    let mode = null;
    const links = document.querySelectorAll('a[href*="?m="]');

    for (const link of links) {
        const isActive =
            link.classList.contains('active') ||
            link.getAttribute('aria-pressed') === 'true';

        if (isActive) {
            const url = new URL(link.href, window.location.origin);
            const mValue = url.searchParams.get('m');
            mode = mValue !== null ? parseInt(mValue) : null;
            break;
        }
    }

    if (mode === null) {
        console.log("Mode not detected");
        return;
    }
    else if (mode === 0 || mode === 1 || mode === 2) {
        const allUL = document.querySelectorAll("ul");
        if (!allUL.length) return;

        let targetUL = null;
        allUL.forEach(ul => {
            if (ul.id?.includes("thumbs")) targetUL = ul;
        });
        if (!targetUL) return;

        const items = targetUL.querySelectorAll("li");

        items.forEach(li => {
            const p = li.querySelector("p");
            if (!p) return;

            const my_a = p.querySelectorAll("a");

            // ===================== 1 LINK =====================
            if (my_a.length === 1) {
                const p_a = my_a[0];
                const href = p_a.getAttribute("href") || "";

                const regexStaticFile = /^https:\/\/static\.[^\/]+\/.+\.[a-zA-Z0-9]+$/;

                if (regexStaticFile.test(href)) {
                    p_a.target = "_blank";

                    attachSafeClick(p_a, (url) => {
                        chrome.runtime.sendMessage({ download: url });
                    });
                    return;
                }

                const img = li.querySelector("a.thumb img");
                if (!img) return;

                const extension = img.getAttribute("title") || "";
                const alt = img.getAttribute("alt") || "";
                const data_id = li.getAttribute("data-id");

                const match = extension.split("\n")[0].match(/\b([a-zA-Z0-9]+)\s*$/);
                if (!match) return;

                const ext = match[1].toLowerCase();
                const name_cha = alt.replace(/\s+/g, ".");
                const link = `https://static.zerochan.net/${name_cha}.full.${data_id}.${ext}`;

                p_a.target = "_blank";

                const a = document.createElement("a");
                a.href = link;
                a.target = "_blank";

                const s = document.createElement("s");
                s.className = "tiny download";
                s.title = `download ${ext} image`;
                s.style.marginBottom = "-3px";
                a.appendChild(s);

                p.appendChild(a);

                const ko = p.querySelectorAll("a");

                attachSafeClick(ko[0], (url) => {
                    chrome.runtime.sendMessage({
                        action: "openBackgroundTab",
                        url
                    });
                });

                attachSafeClick(ko[1], () => {
                    chrome.runtime.sendMessage({ download: link });
                });
            }

            // ===================== 2 LINK =====================
            else {
                my_a.forEach(a_tag => a_tag.target = "_blank");

                const ko = p.querySelectorAll("a");

                attachSafeClick(ko[0], (url) => {
                    chrome.runtime.sendMessage({
                        action: "openBackgroundTab",
                        url
                    });
                });

                attachSafeClick(ko[1], (url) => {
                    chrome.runtime.sendMessage({ download: url });
                });
            }
        });
    }
    else if (mode === 3) {
        const allUL = document.querySelectorAll("ul");
        if (!allUL.length) return;

        let targetUL = null;
        allUL.forEach(ul => {
            if (ul.id?.includes("thumbs")) targetUL = ul;
        });
        if (!targetUL) return;

        const items = targetUL.querySelectorAll("li");

        items.forEach(li => {
            const p = li.querySelector("p");
            if (!p) return;

            const my_a = p.querySelectorAll("a");

            if (!my_a.length) return;
            const last_a = my_a[my_a.length - 1];


            const regexStaticFile = /^https:\/\/static\.[^\/]+\/.+\.[a-zA-Z0-9]+$/;

            if (regexStaticFile.test(last_a.href)) {
                last_a.target = "_blank";

                attachSafeClick(last_a, (url) => {
                    chrome.runtime.sendMessage({ download: last_a.href });
                });
                return;
            }

            const img = li.querySelector("a.thumb img");
            if (!img) return;

            const extension = img.getAttribute("title") || "";
            const alt = img.getAttribute("alt") || "";
            const data_id = li.getAttribute("data-id");

            const match = extension.split("\n")[0].match(/\b([a-zA-Z0-9]+)\s*$/);
            if (!match) return;

            const ext = match[1].toLowerCase();
            const name_cha = alt.replace(/\s+/g, ".");
            const link = `https://static.zerochan.net/${name_cha}.full.${data_id}.${ext}`;

            const a = document.createElement("a");
            a.href = link;
            a.target = "_blank";

            const s = document.createElement("s");
            s.className = "tiny download";
            s.title = `download ${ext} image`;
            s.style.marginBottom = "-3px";
            a.appendChild(s);

            attachSafeClick(a, (url) => {
                chrome.runtime.sendMessage({ download: link });
            });

            p.appendChild(a);

        });
    }
    else if (mode === 4) {
    const thumbs = document.querySelectorAll('a.thumb');
    if (!thumbs.length) return;

    thumbs.forEach(thumb => {
        if (thumb.dataset.dexyInjected) return;
        thumb.dataset.dexyInjected = "1";

        // ambil ID dari href (/4634725)
        const idMatch = thumb.getAttribute("href")?.match(/\/(\d+)/);
        if (!idMatch) return;
        const data_id = idMatch[1];

        // ambil URL background-image
        const bg = thumb.style.backgroundImage;
        const urlMatch = bg.match(/url\(["']?(.*?)["']?\)/);
        if (!urlMatch) return;
        const imageUrl = urlMatch[1];

        // buat tombol download
        const btn = document.createElement("a");
        btn.href = imageUrl;
        btn.target = "_blank";
        btn.style.position = "absolute";
        btn.style.right = "6px";
        btn.style.bottom = "6px";
        btn.style.zIndex = "10";

        const s = document.createElement("s");
        s.className = "tiny download";
        s.title = "Download image";

        btn.appendChild(s);

        // pastikan parent relative
        thumb.style.position = "relative";
        thumb.appendChild(btn);

        attachSafeClick(btn, () => {
            chrome.runtime.sendMessage({
                download: imageUrl
            });
        });
    });
}



    

        
}



function createFloatingButton() {
    if (document.getElementById("extReloadBtn")) return;

    const btn = document.createElement("button");
    btn.id = "extReloadBtn";
    btn.innerText = "Reload Extension";

    btn.style.position = "fixed";
    btn.style.bottom = "20px";
    btn.style.left = "20px";
    btn.style.padding = "10px 18px";
    btn.style.borderRadius = "10px";
    btn.style.fontSize = "14px";
    btn.style.color = "#fff";
    btn.style.border = "none";
    btn.style.cursor = "pointer";
    btn.style.zIndex = "999999";
    btn.style.background = "rgba(0,0,0,0.70)";
    btn.style.boxShadow = "0 0 12px rgba(0,0,0,0.35)";

    btn.onclick = () => {
        console.log("Re-running extension...");
        runDexy(); // ← tidak reload halaman, hanya jalankan ulang
    };

    document.body.appendChild(btn);
}

createFloatingButton();
runDexy();
