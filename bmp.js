function runDexy() {
    window.addEventListener("load", () => {

        // 1. Ambil semua UL
        const allUL = document.querySelectorAll("ul");
        if (allUL.length === 0) return;

        let targetUL = null;
        allUL.forEach(ul => {
            if (ul.id && ul.id.includes("thumbs")) {
                targetUL = ul;
            }
        });

        if (!targetUL) return;

        // 2. Ambil semua LI dalam UL target
        const items = targetUL.querySelectorAll("li");

        items.forEach(li => {

            // 3. Ambil <p> di LI
            const p = li.querySelector("p");
            if (!p) return;

            const my_a = p.querySelectorAll("a");
            if (my_a.length === 1) {
                p_a = my_a[0];
                const href = p_a.getAttribute("href") || "";

                const regexStaticFile = /^https:\/\/static\.[^\/]+\/.+\.[a-zA-Z0-9]+$/;

                if (regexStaticFile.test(href)) {
                    p_a.target = "_blank";
                    return;
                }
                
                value = li.querySelector("a.thumb img")
                extension = value.getAttribute("title");
                alt = value.getAttribute("alt");
                data_id = li.getAttribute("data-id");

                const regex = /\b([a-zA-Z0-9]+)\s*$/; // ambil kata terakhir di baris pertama

                const match = extension.split("\n")[0].match(regex);

                const ext = match[1].toLowerCase();
                const name_cha = alt.replace(/\s+/g, ".");

                const link = `https://static.zerochan.net/${name_cha}.full.${data_id}.${ext}`;

                p_a.target = "_blank";
                // 8. Buat tombol <a> sesuai format
                const a = document.createElement("a");
                if (true) {
                    a.href = link;
                    a.target = "_blank"; 

                    const s = document.createElement("s");
                    s.className = "tiny download";
                    s.title = `download ${ext} image`;
                    s.style.marginBottom = "-3px";

                    a.appendChild(s);
                } 
                else {
                    a.href = "#";
                    a.addEventListener("click", (e) => {
                        e.preventDefault();
                        const linkToOpen = link;
                        setTimeout(() => {
                            window.open(linkToOpen, "_blank", "noopener,noreferrer");
                        }, 0); // delay mikro
                    });
                    const s = document.createElement("s");
                    s.className = "tiny download";
                    s.title = `download ${ext} image`;
                    s.style.marginBottom = "-3px";
                    a.appendChild(s);
                }
                
                // 9. Tambahkan ke <p>
                p.appendChild(a);

            }
            else {
                // const p_a = p.querySelectorAll("a");

                if (true) {
                    my_a.forEach(a_tag => {
                        a_tag.target = "_blank";
                    });
                }
                else {
                    my_a.forEach(a_tag => {
                        const slink = a_tag.getAttribute("href");
                        a_tag.setAttribute("href", "#");
                        a_tag.addEventListener("click", (e) => {
                            e.preventDefault();
                            setTimeout(() => {
                                window.open(slink, "_blank", "noopener,noreferrer");
                            }, 0);
                        });
                    });
                }   
            }
        });
    });
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
