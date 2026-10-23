(() => {
  "use strict";

  const config = window.SITE_CONFIG || {};
  const whatsapp = String(config.whatsapp || "").replace(/\D/g, "");

  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mainNav = document.querySelector("#main-navigation");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const expanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!expanded));
      menuToggle.setAttribute("aria-label", expanded ? "Abrir menú" : "Cerrar menú");
      mainNav.classList.toggle("is-open", !expanded);
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menú");
      });
    });
  }

  document.querySelectorAll("[data-dropdown-toggle]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const parent = button.closest(".has-dropdown");
      const open = parent.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(open));
    });
  });

  document.addEventListener("click", (event) => {
    document.querySelectorAll(".has-dropdown.is-open").forEach((parent) => {
      if (!parent.contains(event.target)) {
        parent.classList.remove("is-open");
        const button = parent.querySelector("[data-dropdown-toggle]");
        if (button) button.setAttribute("aria-expanded", "false");
      }
    });
  });

  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("a[data-nav-link]").forEach((link) => {
    if (link.getAttribute("href") === currentPath) {
      link.setAttribute("aria-current", "page");
    }
  });

  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  const makeWhatsAppUrl = (message) => {
    if (!whatsapp) return null;
    return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
  };

  document.querySelectorAll("[data-whatsapp]").forEach((link) => {
    const message = link.getAttribute("data-whatsapp-message") ||
      "Hola, quiero solicitar información sobre los servicios de INKTONER WEB & SYSTEM.";
    const url = makeWhatsAppUrl(message);
    if (!url) {
      link.setAttribute("aria-disabled", "true");
      link.addEventListener("click", (event) => event.preventDefault());
      return;
    }
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  const contactForm = document.querySelector("#contact-form");
  const formStatus = document.querySelector("#form-status");

  if (contactForm && formStatus) {
    const setStatus = (message, type) => {
      formStatus.textContent = message;
      formStatus.className = `form-status is-visible ${type}`;
    };

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const nameField = document.querySelector("#name");
      const serviceField = document.querySelector("#service");
      const messageField = document.querySelector("#message");
      const name = nameField?.value.trim() || "";
      const service = serviceField?.value || "";
      const message = messageField?.value.trim() || "";

      if (name.length < 2 || name.length > 100) {
        setStatus("Escribe un nombre válido (2 a 100 caracteres).", "warning");
        nameField?.focus();
        return;
      }
      if (!service) {
        setStatus("Selecciona el servicio que necesitas.", "warning");
        serviceField?.focus();
        return;
      }
      if (message.length < 5 || message.length > 1500) {
        setStatus("El mensaje debe tener entre 5 y 1500 caracteres.", "warning");
        messageField?.focus();
        return;
      }
      if (!whatsapp) {
        setStatus("Configura el número de WhatsApp en assets/js/config.js antes de publicar.", "warning");
        return;
      }

      const text = [
        "Hola, quiero solicitar información a INKTONER WEB & SYSTEM.",
        `Nombre: ${name}`,
        `Servicio: ${service}`,
        `Mensaje: ${message}`
      ].join("\n");

      const url = makeWhatsAppUrl(text);
      if (!url) return;
      window.open(url, "_blank", "noopener,noreferrer");
      setStatus("Se abrió WhatsApp con tu solicitud.", "success");
      contactForm.reset();
    });
  }

  // Fondo de partículas ligero e interactivo: respeta reduced-motion y pantallas pequeñas.
  const particleCanvas = document.getElementById("interactive-particles");
  if (particleCanvas) {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = particleCanvas.getContext("2d", { alpha: true });
    if (ctx && !reducedMotion) {
      let width = 0, height = 0, raf = 0;
      const pointer = { x: -1000, y: -1000 };
      let particles = [];
      const setup = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        width = window.innerWidth; height = window.innerHeight;
        particleCanvas.width = Math.floor(width * dpr);
        particleCanvas.height = Math.floor(height * dpr);
        particleCanvas.style.width = width + "px";
        particleCanvas.style.height = height + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const count = Math.min(95, Math.max(28, Math.floor(width * height / 18000)));
        particles = Array.from({ length: count }, () => ({
          x: Math.random() * width, y: Math.random() * height,
          vx: (Math.random() - .5) * .32, vy: (Math.random() - .5) * .32,
          r: Math.random() * 1.7 + .55
        }));
      };
      const draw = () => {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
          const a = particles[i];
          const dx = a.x - pointer.x, dy = a.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 115 && dist > 0) { a.vx += dx / dist * .012; a.vy += dy / dist * .012; }
          a.vx = Math.max(-.48, Math.min(.48, a.vx * .995));
          a.vy = Math.max(-.48, Math.min(.48, a.vy * .995));
          a.x += a.vx; a.y += a.vy;
          if (a.x < -10) a.x = width + 10; if (a.x > width + 10) a.x = -10;
          if (a.y < -10) a.y = height + 10; if (a.y > height + 10) a.y = -10;
          ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(91,190,255,.72)"; ctx.fill();
          for (let j = i + 1; j < particles.length; j++) {
            const b = particles[j], lx = a.x - b.x, ly = a.y - b.y;
            const d = Math.hypot(lx, ly);
            if (d < 105) {
              ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
              ctx.strokeStyle = `rgba(48,151,255,${(1 - d / 105) * .18})`;
              ctx.lineWidth = .7; ctx.stroke();
            }
          }
        }
        raf = window.requestAnimationFrame(draw);
      };
      window.addEventListener("pointermove", e => { pointer.x = e.clientX; pointer.y = e.clientY; }, { passive: true });
      window.addEventListener("pointerleave", () => { pointer.x = -1000; pointer.y = -1000; }, { passive: true });
      window.addEventListener("resize", () => { window.cancelAnimationFrame(raf); setup(); draw(); }, { passive: true });
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) window.cancelAnimationFrame(raf); else draw();
      });
      setup(); draw();
    } else if (ctx) { particleCanvas.hidden = true; }
  }

})();
