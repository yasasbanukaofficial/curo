import { useEffect, useRef } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
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

    const drive = driver({
      animate: true,
      overlayOpacity: 0.6,
      allowClose: false,
      showProgress: true,
      showButtons: ["next", "previous", "close"],
      nextBtnText: "Next",
      prevBtnText: "Back",
      doneBtnText: "Done",
      onPopoverRender: (popover, { config, state }) => {
        const isMobile = window.innerWidth < 1024;
        popover.wrapper.style.borderRadius = "16px";
        popover.wrapper.style.minWidth = isMobile ? "280px" : "360px";
        popover.wrapper.style.minHeight = "180px";
        popover.wrapper.style.padding = isMobile ? "20px 20px 12px" : "24px 24px 16px";
        popover.wrapper.style.display = "flex";
        popover.wrapper.style.flexDirection = "column";
        popover.title.style.fontSize = isMobile ? "15px" : "16px";
        popover.title.style.marginBottom = "6px";
        popover.description.style.fontSize = isMobile ? "12px" : "13px";
        popover.description.style.lineHeight = "1.5";
        popover.description.style.color = "#8E8E93";
        popover.footer.style.marginTop = "auto";
        popover.footer.style.paddingTop = "12px";
        popover.footer.style.display = "flex";
        popover.footer.style.alignItems = "center";
        popover.footer.style.justifyContent = "space-between";
        popover.nextButton.style.borderRadius = "10px";
        popover.nextButton.style.padding = "8px 20px";
        popover.nextButton.style.fontSize = "13px";
        popover.nextButton.style.fontWeight = "500";
        popover.previousButton.style.borderRadius = "10px";
        popover.previousButton.style.padding = "8px 16px";
        popover.previousButton.style.fontSize = "13px";
        popover.closeButton.style.borderRadius = "10px";
        popover.closeButton.style.padding = "6px 10px";
        const idx = state.activeIndex ?? 0;
        const total = config.steps?.length ?? 0;
        if (popover.progress) {
          popover.progress.textContent = `Step ${idx + 1} of ${total}`;
          popover.progress.style.fontSize = "11px";
          popover.progress.style.color = "#8E8E93";
        }
      },
      onCloseClick: () => {
        markComplete({ skipped: true });
        drive.destroy();
      },
      onDoneClick: () => {
        markComplete({ skipped: false });
        drive.destroy();
      },
      steps: [
        {
          element: "#sidenav-projects",
          popover: {
            title: "Projects",
            description: "This is your Projects tab. All your work lives here.",
            side: "right",
            align: "center",
          },
        },
        {
          element: "#btn-new-project",
          popover: {
            title: "Create a Project",
            description: "Create a project to group your secrets by app or service.",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: "#sidenav-secrets",
          popover: {
            title: "Secrets",
            description: "Secrets are encrypted key-value pairs stored per environment.",
            side: "right",
            align: "center",
          },
        },
        {
          element: "#sidenav-environments",
          popover: {
            title: "Environments",
            description: "Switch between Development, Staging and Production here.",
            side: "right",
            align: "center",
          },
        },
        {
          element: "#cli-snippet",
          popover: {
            title: "Pull with the CLI",
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
