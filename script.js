document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const header = document.querySelector("header");
    const nav = document.querySelector(".navbar");
    const navLinks = document.querySelector(".nav-links");
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    body.classList.add("js-ready");

    const progress = document.createElement("div");
    progress.className = "scroll-progress";
    document.body.prepend(progress);

    const updateProgress = () => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const value = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
        progress.style.width = `${Math.min(value, 100)}%`;
        header?.classList.toggle("is-scrolled", window.scrollY > 24);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });

    if (nav && navLinks) {
        const menuButton = document.createElement("button");
        menuButton.className = "menu-toggle";
        menuButton.type = "button";
        menuButton.setAttribute("aria-label", "Apri menu");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.innerHTML = "<span></span><span></span><span></span>";
        nav.appendChild(menuButton);

        menuButton.addEventListener("click", () => {
            const isOpen = nav.classList.toggle("nav-open");
            menuButton.setAttribute("aria-expanded", String(isOpen));
            body.classList.toggle("menu-open", isOpen);
        });

        navLinks.querySelectorAll("a").forEach((link) => {
            const linkPage = link.getAttribute("href")?.split("/").pop();
            if (linkPage === currentPage) link.classList.add("active");
            link.addEventListener("click", () => {
                nav.classList.remove("nav-open");
                body.classList.remove("menu-open");
                menuButton.setAttribute("aria-expanded", "false");
            });
        });
    }

    const revealTargets = document.querySelectorAll(
        ".card, .luogo-card, .player-card, .main-news, .sidebar-stats, .storia-container, .glass-box, .detail-image, .detail-content"
    );

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.14 }
        );

        revealTargets.forEach((target, index) => {
            target.classList.add("reveal");
            target.style.setProperty("--delay", `${Math.min(index * 70, 420)}ms`);
            observer.observe(target);
        });
    } else {
        revealTargets.forEach((target) => target.classList.add("is-visible"));
    }

    document.querySelectorAll('a[href^="http"]').forEach((link) => {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
    });

    document.querySelectorAll("img").forEach((image) => {
        image.loading = "lazy";
        image.addEventListener("error", () => {
            image.closest(".luogo-card, .player-card, .detail-image")?.classList.add("media-error");
        });
    });

    const videos = document.querySelectorAll("video");
    if (videos.length) {
        const cinema = document.createElement("div");
        cinema.className = "cinema-mode";
        cinema.innerHTML = `
            <button class="cinema-close" type="button" aria-label="Chiudi video">×</button>
            <video controls playsinline></video>
        `;
        document.body.appendChild(cinema);

        const cinemaVideo = cinema.querySelector("video");
        const closeCinema = () => {
            cinema.classList.remove("is-open");
            cinemaVideo.pause();
            cinemaVideo.removeAttribute("src");
            cinemaVideo.load();
            body.classList.remove("cinema-open");
        };

        cinema.querySelector(".cinema-close").addEventListener("click", closeCinema);
        cinema.addEventListener("click", (event) => {
            if (event.target === cinema) closeCinema();
        });
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && cinema.classList.contains("is-open")) closeCinema();
        });

        videos.forEach((video) => {
            video.setAttribute("playsinline", "");
            video.preload = "metadata";

            const button = document.createElement("button");
            button.className = "video-expand";
            button.type = "button";
            button.textContent = "Guarda";
            video.insertAdjacentElement("afterend", button);

            button.addEventListener("click", () => {
                const source = video.currentSrc || video.querySelector("source")?.src;
                if (!source) return;
                video.pause();
                cinemaVideo.src = source;
                cinema.classList.add("is-open");
                body.classList.add("cinema-open");
                cinemaVideo.play().catch(() => {});
            });
        });
    }
});
