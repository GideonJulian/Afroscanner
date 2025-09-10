import { useEffect, useState } from "react";

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice =
      /iphone|ipad|ipod/.test(userAgent) && !window.MSStream;

    setIsIOS(isIOSDevice);

    if (!isIOSDevice) {
      // Works on Android/Chrome
      const handler = (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setShow(true);
      };
      window.addEventListener("beforeinstallprompt", handler);
      return () => window.removeEventListener("beforeinstallprompt", handler);
    }
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log("User response:", outcome);
    setDeferredPrompt(null);
    setShow(false);
  };

  if (!show && !isIOS) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
      <div className="bg-white w-80 rounded-2xl shadow-xl p-6 text-center animate-fadeIn">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Install AfroScanner
        </h2>

        {isIOS ? (
          <>
            <p className="text-gray-600 text-sm mb-4">
              To install on iOS: open Safari, tap the{" "}
              <span className="font-semibold">Share</span> button, then choose{" "}
              <span className="font-semibold">"Add to Home Screen, To install the App "</span>.
            </p>
          </>
        ) : (
          <>
            <p className="text-gray-600 text-sm mb-4">
              Install this app on your device for quick access and offline use.
            </p>
            <button
              onClick={handleInstall}
              className="bg-[#E55934] text-white px-4 py-2 rounded-lg font-medium"
            >
              Install App
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default InstallPrompt;
