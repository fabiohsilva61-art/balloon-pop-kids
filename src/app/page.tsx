"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BalloonSVG } from "@/components/ui/BalloonSVG";
import { Button } from "@/components/ui/Button";
import { SoundToggle } from "@/components/ui/SoundToggle";
import { BackgroundBalloons } from "@/components/ui/BackgroundBalloons";
import { filterBadWords } from "@/lib/constants";

export default function MenuPage() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function handlePlay() {
    const trimmed = name.trim();
    if (!trimmed) return;

    if (!filterBadWords(trimmed)) {
      setError("Escolha outro nome, por favor!");
      return;
    }

    setError("");
    const params = new URLSearchParams({ player: trimmed });
    router.push(`/play?${params.toString()}`);
  }

  return (
    <>
      <SoundToggle />
      <BackgroundBalloons />

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center gap-6 p-6">
        <div className="flex gap-3">
          <BalloonSVG color="#EF4444" size={56} delay={0} />
          <BalloonSVG color="#FACC15" size={72} delay={0.2} />
          <BalloonSVG color="#22C55E" size={56} delay={0.4} />
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg text-center leading-tight">
          Balloon Pop
          <br />
          <span className="text-yellow-300">Kids</span>
        </h1>

        <p className="text-lg md:text-xl text-white/80 text-center max-w-sm">
          Estoure balões e aprenda letras, números, cores e animais!
        </p>

        <div className="w-full max-w-xs mt-2">
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handlePlay()}
            placeholder="Seu nome ou apelido"
            maxLength={20}
            autoComplete="off"
            className="w-full rounded-2xl bg-white/90 px-6 py-4 text-center text-xl font-medium text-gray-800 placeholder-gray-400 outline-none ring-2 ring-transparent focus:ring-yellow-400 transition-all shadow-md"
          />
          {error && (
            <p className="text-red-200 text-sm text-center mt-2 font-medium">
              {error}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs mt-2">
          <Button onClick={handlePlay} disabled={!name.trim()} fullWidth>
            🎈 Jogar
          </Button>

          <Button variant="secondary" href="/ranking" fullWidth>
            🏆 Ranking
          </Button>
        </div>
      </main>
    </>
  );
}
