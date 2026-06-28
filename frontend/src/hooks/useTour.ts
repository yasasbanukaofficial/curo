import { useEffect, useRef } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import "../styles/tour.css";
import { useMarkOnboardingCompleteMutation } from "../features/auth/authApi";

interface UseTourOptions {
  shouldShow: boolean;
}

export function useTour({ shouldShow }: UseTourOptions) {
  const [markComplete] = useMarkOnboardingCompleteMutation();
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!shouldShow || hasStarted.current) return;
    hasStarted.current = true;

    if (window.innerWidth < 768) return;
    hasStarted.current = true;

    const isDark = document.documentElement.classList.contains("dark");

    const drive = driver({
      animate: true,
      overlayColor: isDark ? "rgba(0,0,0,0.75)" : "rgba(0,0,0,0.55)",
      allowClose: false,
      showProgress: true,
      showButtons: ["next", "previous", "close"],
      popoverClass: isDark ? "curo-tour-dark" : "curo-tour-light",
      stageRadius: 8,
      nextBtnText: "Next →",
      prevBtnText: "Back",
      doneBtnText: "Done",
      onPopoverRender: (popover, { config, state }) => {
        const idx = state.activeIndex ?? 0;
        const total = config.steps?.length ?? 0;

        /* ── Ensure border-radius (driver.js can override via inline styles) ── */
        popover.wrapper.style.borderRadius = "24px";

        /* ── Hide default progress text ── */
        if (popover.progress) popover.progress.style.display = "none";

        /* ── Progress dots ── */
        let dots = popover.wrapper.querySelector(".tour-dots") as HTMLElement | null;
        if (!dots) {
          dots = document.createElement("div");
          dots.className = "tour-dots";
          popover.wrapper.insertBefore(dots, popover.footer);
        }
        dots.innerHTML = "";
        for (let i = 0; i < total; i++) {
          const dot = document.createElement("span");
          dot.className = i === idx ? "tour-dot active" : "tour-dot";
          dots.appendChild(dot);
        }

        /* ── Footer left group: skip button + step counter ── */
        let leftGroup = popover.wrapper.querySelector(".tour-footer-left") as HTMLElement | null;
        if (!leftGroup) {
          leftGroup = document.createElement("div");
          leftGroup.className = "tour-footer-left";
          popover.footer.insertBefore(leftGroup, popover.footer.firstChild);
        }
        leftGroup.innerHTML = `
          <button class="tour-skip-btn">Skip tour</button>
          <span class="tour-step-counter">${idx + 1} of ${total}</span>
        `;
        const skipBtn = leftGroup.querySelector(".tour-skip-btn")!;
        skipBtn.addEventListener("click", () => {
          markComplete({ skipped: true });
          drive.destroy();
        });
      },
      onCloseClick: () => {
        markComplete({ skipped: true });
        drive.destroy();
      },
      onDoneClick: () => {
        markComplete({ skipped: false });
        drive.destroy();
      },
      stagePadding: 4,
      steps: [
        {
          element: "#sidenav-projects",
          popover: {
            title: "\u{1F4C1}  Projects",
            description: "This is your Projects tab. All your work lives here.",
            side: "right",
            align: "center",
          },
        },
        {
          element: "#btn-new-project",
          popover: {
            title: "\u{2795}  Create a Project",
            description: "Create a project to group your secrets by app or service.",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: "#sidenav-secrets",
          popover: {
            title: "\u{1F511}  Secrets",
            description: "Secrets are encrypted key-value pairs stored per environment.",
            side: "right",
            align: "center",
          },
        },
        {
          element: "#sidenav-environments",
          popover: {
            title: "\u{1F33F}  Environments",
            description: "Switch between Development, Staging and Production here.",
            side: "right",
            align: "center",
          },
        },
        {
          element: "#cli-snippet",
          popover: {
            title: "\u{1F4BB}  Pull with the CLI",
            description: "Pull all secrets in one command. No more .env files.",
            side: "top",
            align: "center",
          },
        },
      ],
    });

    drive.drive();
  }, [shouldShow, markComplete]);
}
