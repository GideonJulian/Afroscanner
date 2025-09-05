import { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response: ${outcome}`);
      setDeferredPrompt(null);
    }
  };

  return (
    deferredPrompt && (
      <button
        onClick={handleInstall}
        className="fixed bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 bg-[#E55934] text-white rounded-lg shadow"
      >
        Install App
      </button>
    )
  );
}
