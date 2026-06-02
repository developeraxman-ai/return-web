"use client";

import { useEffect, useState } from "react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const output = new Uint8Array(rawData.length);
  for (let index = 0; index < rawData.length; index += 1) {
    output[index] = rawData.charCodeAt(index);
  }
  return output;
}

export function PwaNotifications() {
  const [status, setStatus] = useState("Checking notification support...");
  const [supported, setSupported] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);

  useEffect(() => {
    const canPush = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
    setSupported(canPush);
    setStatus(canPush && window.Notification.permission === "granted" ? "9 PM challenges are armed." : "Download the app and enable 9 PM challenges.");

    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
  }, []);

  async function downloadApp() {
    if (!installPrompt) {
      setStatus("Use your browser menu to download this app to your device. Yes, it hides there like a coward.");
      return;
    }

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    setInstallPrompt(null);
    setStatus(choice.outcome === "accepted" ? "App downloaded. Now it gets harder to pretend you forgot." : "Download cancelled. Interesting life strategy.");
  }

  async function enable() {
    if (!supported) {
      setStatus("This browser does not support app challenges. Try Chrome or install from a supported mobile browser.");
      return;
    }

    const keyRes = await fetch("/api/notifications/public-key");
    const { publicKey } = await keyRes.json();
    if (!publicKey) {
      setStatus("Notification keys are missing. Add them to env first.");
      return;
    }

    const permission = await window.Notification.requestPermission();
    if (permission !== "granted") {
      setStatus("Notifications blocked. Bold strategy. Nothing will be sent.");
      return;
    }

    const registration = await navigator.serviceWorker.register("/sw.js");
    const existing = await registration.pushManager.getSubscription();
    const subscription =
      existing ||
      (await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      }));

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Calcutta";
    const res = await fetch("/api/notifications/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscription, timezone })
    });

    setStatus(res.ok ? "Notifications armed for 9 PM. No hiding now." : "Could not save notification subscription.");
  }

  return (
    <div className="card">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black">Download App</h2>
          <p className="mt-1 text-sm text-zinc-400">{status}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="btn-secondary" onClick={downloadApp} type="button">
            Download App
          </button>
          <button className="btn" onClick={enable} type="button">
            Enable 9 PM Challenges
          </button>
        </div>
      </div>
    </div>
  );
}
