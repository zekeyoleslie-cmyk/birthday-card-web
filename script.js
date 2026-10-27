/* Birthday Card - complementary script
   Load AFTER the inline script (or remove the inline script entirely).
   Redefines window.startCelebration, so the existing onclick keeps working. */

(function () {
    "use strict";

    const CONFIG = {
        songDurationMs: 60000,
        confettiCount: 120,
        confettiColors: [
            "#ffb6c1", "#ff69b4", "#ffc1cc", "#e0bbff",
            "#c084fc", "#ffd6a5", "#ffffff", "#ff85a2"
        ],
        heartEmojis: ["💖", "💗", "💕", "🌸", "✨"],
        sparkleEmojis: ["✨", "💫", "⭐"],
        message: "Make a wish, Blandine ✨ This day is all yours!",
        typeSpeedMs: 55
    };

    const prefersReducedMotion =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let celebrating = false;
    let songTimer = null;
    let heartsTimer = null;

    /* ---------- Helpers ---------- */
    const rand = (min, max) => Math.random() * (max - min) + min;
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    function throttle(fn, wait) {
        let last = 0;
        return function (...args) {
            const now = Date.now();
            if (now - last >= wait) {
                last = now;
                fn.apply(this, args);
            }
        };
    }

    /* ---------- Floating hearts ---------- */
    function createHeartsLayer() {
        const layer = document.createElement("div");
        layer.className = "hearts-layer";
        layer.setAttribute("aria-hidden", "true");
        document.body.appendChild(layer);
        return layer;
    }

    function spawnHeart(layer) {
        const heart = document.createElement("span");
        heart.className = "heart";
        heart.textContent = pick(CONFIG.heartEmojis);
        heart.style.left = rand(0, 100) + "vw";
        heart.style.fontSize = rand(14, 28) + "px";
        heart.style.setProperty("--drift", rand(-60, 60) + "px");
        const duration = rand(7, 12);
        heart.style.animationDuration = duration + "s";
        layer.appendChild(heart);
        setTimeout(() => heart.remove(), duration * 1000);
    }

    function startHearts() {
        if (prefersReducedMotion) return;
        const layer = createHeartsLayer();
        heartsTimer = setInterval(() => {
            if (!document.hidden) spawnHeart(layer);
        }, 900);
    }

    /* ---------- Cursor / touch sparkles ---------- */
    function spawnSparkle(x, y) {
        const s = document.createElement("span");
        s.className = "sparkle";
        s.textContent = pick(CONFIG.sparkleEmojis);
        s.style.left = x + "px";
        s.style.top = y + "px";
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 900);
    }

    function initSparkles() {
        if (prefersReducedMotion) return;
        const handler = throttle((e) => spawnSparkle(e.clientX, e.clientY), 80);
        document.addEventListener("pointermove", handler, { passive: true });
    }

    /* ---------- Confetti ---------- */
    function launchConfetti() {
        if (prefersReducedMotion) return;
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < CONFIG.confettiCount; i++) {
            const piece = document.createElement("div");
            piece.className = "confetti";

            const roll = Math.random();
            if (roll < 0.3) piece.classList.add("confetti--circle");
            else if (roll < 0.6) piece.classList.add("confetti--strip");
            else if (roll < 0.7) {
                piece.classList.add("confetti--heart");
                piece.textContent = "💖";
            }

            piece.style.left = rand(0, window.innerWidth) + "px";
            piece.style.background = pick(CONFIG.confettiColors);
            piece.style.animationDuration = rand(2, 5) + "s";
            piece.style.animationDelay = rand(0, 0.8) + "s";

            fragment.appendChild(piece);
            setTimeout(() => piece.remove(), 6500);
        }
        document.body.appendChild(fragment);
    }

    /* ---------- Typewriter surprise message ---------- */
    function typeMessage(card) {
        let box = card.querySelector(".surprise");
        if (!box) {
            box = document.createElement("div");
            box.className = "surprise";
            box.setAttribute("role", "status");
            card.appendChild(box);
        }
        box.textContent = "";
        box.classList.remove("done");

        if (prefersReducedMotion) {
            box.textContent = CONFIG.message;
            box.classList.add("done");
            return;
        }

        const chars = Array.from(CONFIG.message);
        let i = 0;
        const timer = setInterval(() => {
            box.textContent += chars[i++];
            if (i >= chars.length) {
                clearInterval(timer);
                box.classList.add("done");
            }
        }, CONFIG.typeSpeedMs);
    }

    /* ---------- Audio ---------- */
    function getSong() {
        return document.getElementById("song");
    }

    function stopSong() {
        const song = getSong();
        if (!song) return;
        song.pause();
        song.currentTime = 0;
        clearTimeout(songTimer);
        updateToggle();
    }

    function playSong() {
        const song = getSong();
        if (!song) return;

        const attempt = song.play();
        if (attempt && typeof attempt.catch === "function") {
            attempt.catch((err) => {
                // Missing file or autoplay block: the celebration still works.
                console.warn("Song could not be played:", err.message);
            });
        }

        clearTimeout(songTimer);
        songTimer = setTimeout(stopSong, CONFIG.songDurationMs);
        showToggle();
    }

    let toggleBtn = null;

    function showToggle() {
        if (!toggleBtn) {
            toggleBtn = document.createElement("button");
            toggleBtn.type = "button";
            toggleBtn.className = "audio-toggle";
            toggleBtn.addEventListener("click", () => {
                const song = getSong();
                if (!song) return;
                song.muted = !song.muted;
                updateToggle();
            });
            document.body.appendChild(toggleBtn);
        }
        toggleBtn.classList.add("visible");
        updateToggle();
    }

    function updateToggle() {
        if (!toggleBtn) return;
        const song = getSong();
        const muted = !song || song.muted || song.paused;
        toggleBtn.textContent = muted ? "🔇" : "🔊";
        toggleBtn.setAttribute("aria-label", muted ? "Unmute music" : "Mute music");
    }

    /* ---------- Main entry (called by the button's onclick) ---------- */
    function startCelebration() {
        const card = document.querySelector(".card");
        const button = card && card.querySelector("button");

        // Allow replay, but not while a burst is already running.
        if (celebrating) return;
        celebrating = true;

        playSong();
        launchConfetti();
        if (card) typeMessage(card);

        if (button) {
            button.textContent = "Celebrating 🎊";
            button.disabled = true;
        }

        setTimeout(() => {
            celebrating = false;
            if (button) {
                button.textContent = "Celebrate Again 💖";
                button.disabled = false;
            }
        }, 6000);
    }

    window.startCelebration = startCelebration;

    /* ---------- Init ---------- */
    document.addEventListener("DOMContentLoaded", () => {
        startHearts();
        initSparkles();
    });

    // Pause background work when the tab is hidden.
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            const song = getSong();
            if (song && !song.paused) {
                song.pause();
                updateToggle();
            }
        }
    });

    window.addEventListener("beforeunload", () => {
        clearInterval(heartsTimer);
        clearTimeout(songTimer);
    });
})();
