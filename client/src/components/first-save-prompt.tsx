import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { X } from "lucide-react";

const STORAGE_KEY = "fdv_first_save_prompt_shown";

export function FirstSavePrompt() {
  const [show, setShow] = useState(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;

    const handler = () => {
      if (localStorage.getItem(STORAGE_KEY)) return;
      localStorage.setItem(STORAGE_KEY, "true");
      setTimeout(() => setShow(true), 1000);
    };

    window.addEventListener("fdv-first-save", handler);
    return () => window.removeEventListener("fdv-first-save", handler);
  }, []);

  if (!show) return null;

  const dismiss = () => setShow(false);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={dismiss}
    >
      <div
        className="relative bg-white rounded-lg shadow-2xl max-w-sm w-[90vw] mx-auto p-8 text-center animate-in fade-in zoom-in-95 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={18} />
        </button>

        <p className="font-serif text-2xl mb-4" style={{ fontFamily: "'Lora', 'Cormorant Garamond', Georgia, serif" }}>
          ✨ Saved.
        </p>

        <p className="text-[15px] text-gray-500 leading-relaxed mb-6" style={{ fontFamily: "'Inter', 'Instrument Sans', Helvetica, sans-serif" }}>
          You can now curate from what you've saved. We'll build something just for you.
        </p>

        <button
          onClick={() => {
            dismiss();
            navigate("/suitcase?curate=true");
          }}
          className="w-full bg-black text-white uppercase tracking-[0.15em] text-[13px] font-medium py-3 rounded hover:bg-gray-900 transition-colors"
        >
          Curate for Me
        </button>

        <button
          onClick={dismiss}
          className="mt-3 text-[13px] text-gray-400 underline hover:text-gray-600 transition-colors"
        >
          Not now
        </button>
      </div>
    </div>
  );
}
