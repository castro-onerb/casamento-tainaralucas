"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

import logoSymbol from "../assets/logo-symbol-color.svg";
import logoColor from "../assets/logo-color.svg";
import logoWhite from "../assets/logo-white.svg";
import flower from "../assets/flowers.png";
import sheet from "../assets/sheet.png";
import spCode from "../assets/spcode-trilha-sonora.svg";

export default function Page() {
  const [showOverlay, setShowOverlay] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowOverlay(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // === Controla trilha sonora ===
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/audio/trilha-sonora.mp3");
      audioRef.current.loop = true;
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }

    return () => {
      audioRef.current?.pause();
    };
  }, [isPlaying]);

  useEffect(() => {
    if (!showOverlay) {
      const timer = setTimeout(() => {
        if (!audioRef.current) {
          audioRef.current = new Audio("/audio/trilha-sonora.mp3");
          audioRef.current.loop = true;
        }

        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            // autoplay bloqueado
            setIsPlaying(false);
          });
      }, 300); // 300ms de delay após o overlay sumir

      return () => clearTimeout(timer);
    }
  }, [showOverlay]);

  const toggleAudio = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const confirmar = useCallback(async () => {
    if (!nome.trim()) {
      setToast({
        message: "Digite seu nome antes de confirmar!",
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome }),
      });

      const data = await res.json();
      setToast({
        message: data.message,
        type: data.success ? "success" : "error",
      });

      if (data.success) setNome("");
    } catch {
      setToast({ message: "Erro ao confirmar presença.", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [nome]);

  return (
    <div className="w-dvw bg-background overflow-x-hidden">
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className={`fixed bottom-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg font-medium text-white shadow-lg ${
              toast.type === "success" ? "bg-emerald-700" : "bg-red-700"
            }`}
            onAnimationComplete={() => {
              setTimeout(() => setToast(null), 2400);
            }}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <header className="flex p-4 bg-header">
        <Image src={logoSymbol} alt="Logo símbolo" priority />
      </header>

      {/* HERO */}

      <div className="z-2 relative w-full aspect-square overflow-hidden h-[500px]">
        <Image
          src={flower}
          alt=""
          className="z-3 absolute -right-[80px] -top-[100px]"
        />

        {/* === OVERLAY COM ANIMAÇÃO === */}
        <AnimatePresence>
          {showOverlay && (
            <motion.div
              key="overlay"
              className="z-2 absolute flex items-end justify-center p-[26px] bg-black/35 w-full h-full"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
            >
              <div className="flex flex-col items-center gap-1">
                <p className="font-fahk text-white font-medium text-[20px]">
                  Vamos nos casar
                </p>
                <Image alt="" src={logoWhite} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* === SUBSTITUTO (trilha sonora + botão play) === */}
        {!showOverlay && (
          <motion.div
            key="after"
            className="z-2 absolute w-full h-full flex flex-col items-center justify-end pb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <p className="text-white font-fahk font-medium text-center mb-2">
              Nossa trilha
            </p>

            <div
              onClick={toggleAudio}
              className="relative w-auto max-h-[130px] bg-white/50 rounded-full flex items-center justify-center p-2"
            >
              <Image src={spCode} alt="" className="h-[70px] w-fit" />

              {/* === Botão de play/pause === */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="absolute left-5 bg-black rounded-full p-3 shadow-lg"
              >
                {isPlaying ? (
                  <motion.div
                    key="pause"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Ícone de pausa */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="white"
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                    >
                      <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
                    </svg>
                  </motion.div>
                ) : (
                  <motion.div
                    key="play"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Ícone de play */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="white"
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}

        <Image
          src="/casal-hero.png"
          alt="Casal"
          fill
          className="z-1 object-cover"
        />
      </div>

      {/* Versículo */}
      <section className="relative p-5 flex">
        <Image
          src={sheet}
          alt="Folha decorativa"
          className="absolute -left-[60px] -bottom-2"
        />
        <div className="z-2 flex-1 flex flex-col gap-2.5 p-3 bg-[#F5F5F5] border-r-[3px] border-[#607763]">
          <p className="text-center font-fahk font-semibold leading-[120%] text-[#607763]">
            Acima de tudo, porém, revistam-se do amor, que é o elo perfeito
          </p>
          <p className="font-inter font-semibold text-[14px] text-[#784C00]">
            Colossenses 3:14
          </p>
        </div>
      </section>

      <div className="flex flex-col items-center justify-center gap-[20px] p-[20px]">
        <p className="leading-none font-fahk text-[#784C00]">Casamento</p>
        <Image src={logoColor} alt="" className="max-w-[70%]" />
      </div>

      <div className="p-5">
        <p className="text-[#434634] font-fahk font-medium text-center">
          Venha celebrar conosco esse momento tão especial, a nossa união.
        </p>
      </div>

      <div className="p-5 flex flex-col items-center justify-center gap-2">
        <p className="text-[#434634] font-fahk font-medium text-center">
          DEZEMBRO
        </p>
        <div className="flex gap-3 items-center">
          <p className="text-[#434634] font-fahk font-medium text-center">
            SEGUNDA
          </p>
          <p className="text-[#7A8E74] font-fahk font-medium text-center text-[52px] px-3 border-x-[2px] border-[#BF9042] leading-none">
            29
          </p>
          <p className="text-[#434634] font-fahk font-medium text-center">
            16:30 HORAS
          </p>
        </div>
        <p className="text-[#434634] font-fahk font-medium text-center">2025</p>
      </div>

      <div className="p-5 flex flex-col gap-[8px]">
        <p className="text-[#434634] font-fahk font-medium">Local</p>
        <div className="overflow-hidden rounded-3xl">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d404.3912061820738!2d-39.36718535097964!3d-3.7382243915612605!2m3!1f0!2f39.351832536275424!3f0!3m2!1i1024!2i768!4f35!3m3!1m2!1s0x7c063cd94efcec3%3A0x6cf7f38a4c1bdf83!2sChurrascaria%20Balne%C3%A1rio%20JC!5e1!3m2!1spt-BR!2sbr!4v1760404828504!5m2!1spt-BR!2sbr"
            width="100%"
            style={{ border: 0, aspectRatio: 1 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <div className="flex flex-col items-center justify-center gap-1">
          <p className="text-[#434634] leading-none font-fahk font-medium">
            Churrascaria Balneário JC
          </p>
          <p className="text-[#434634] leading-none font-fahk font-medium">
            Caxitoré, Umirim - CE, 62664-000
          </p>
        </div>
      </div>

      {/* Formulário */}
      <section className="p-5 flex flex-col gap-4 bg-[#F5F5F5]">
        <h2
          className="font-decorative text-center text-[24px] text-[#7A8E74]"
          style={{ WebkitTextStroke: "0.5px #7A8E74" }}
        >
          Convidado de Honra
        </h2>

        <p className="font-inter text-center mx-4 text-[#7A8E74] leading-[110%]">
          Preencha abaixo para confirmar sua ilustre presença conosco.
        </p>

        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="font-inter font-medium border border-[#784C00] text-[#434634] bg-[#F4F0E7] p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A8E74]"
          placeholder="Insira seu nome"
        />

        <button
          onClick={confirmar}
          disabled={loading}
          className={`font-inter font-semibold text-white bg-[#434634] hover:bg-[#7A8E74] transition-colors p-4 rounded-lg ${
            loading ? "opacity-60 cursor-wait" : ""
          }`}
        >
          {loading ? "Enviando..." : "Confirmar"}
        </button>
      </section>
    </div>
  );
}
