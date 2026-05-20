import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PWAInstallPrompt extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function usePWA() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<PWAInstallPrompt | null>(
    null
  );
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(registration => {
          console.log("Service Worker registered:", registration);
        })
        .catch(error => {
          console.error("Service Worker registration failed:", error);
        });
    }

    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as PWAInstallPrompt);
      setIsInstallable(true);
    };

    // Handle app installed event
    const handleAppInstalled = () => {
      setIsInstallable(false);
      setInstallPrompt(null);
      toast.success("DirtyChat installed successfully!");
    };

    // Handle online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const installApp = async () => {
    if (!installPrompt) return;

    try {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;

      if (outcome === "accepted") {
        setIsInstallable(false);
        setInstallPrompt(null);
      }
    } catch (error) {
      console.error("Installation failed:", error);
    }
  };

  return {
    isInstallable,
    installApp,
    isOnline,
  };
}
