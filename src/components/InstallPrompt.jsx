import { useEffect, useState } from "react";

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();          // prevent Chrome mini-bar
      setDeferredPrompt(e);
      setShow(true);               // open modal
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log("User response:", outcome);
    setDeferredPrompt(null);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
      <div className="bg-white w-80 rounded-2xl shadow-xl p-6 text-center animate-fadeIn">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Install AfroScanner
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          Install this app on your device for quick access and offline use.
          Add it to your home screen just like a native app.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleInstall}
            className="bg-[#E55934] text-white px-4 py-2 rounded-lg font-medium"
          >
            Install App
          </button>
        
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
