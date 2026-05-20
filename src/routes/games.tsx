import { createFileRoute, Link } from "@tanstack/react-router";
import { RoleNavbar } from "@/components/RoleNavbar";
import { useRoleGuard } from "@/lib/role";
import { Star } from "lucide-react";

export const Route = createFileRoute("/games")({
  head: () => ({ meta: [{ title: "Games — MindBloom AI" }, { name: "description", content: "Browse all mini games and arcade quests." }] }),
  component: Games,
});

const games = [
  {t:"Logic Lava", e:"🌋", c:"var(--orange-pop)", xp:120, k:"Logic"},
  {t:"Memory Reef", e:"🐙", c:"var(--teal-pop)", xp:80, k:"Memory"},
  {t:"Word Wizard", e:"🪄", c:"var(--sunny)", xp:140, k:"Language"},
  {t:"Pixel Painter", e:"🎨", c:"var(--cherry)", xp:200, k:"Creativity"},
  {t:"Math Mountain", e:"⛰️", c:"var(--sky-pop)", xp:160, k:"Math"},
  {t:"Speed Snap", e:"⚡", c:"var(--grass)", xp:90, k:"Reflex"},
  {t:"Pattern Pirate", e:"🏴‍☠️", c:"var(--grape)", xp:240, k:"Logic"},
  {t:"Galaxy Lab", e:"🛸", c:"var(--teal-pop)", xp:200, k:"Science"},
];

function Games() {
  useRoleGuard("child");
  return (
    <div className="min-h-screen bg-dots">
      <RoleNavbar />
      <div className="mx-auto max-w-7xl px-3 sm:px-6 mt-8 space-y-6">
        <div className="pixel-card-flat text-white p-8" style={{ background: "var(--orange-pop)" }}>
          <div className="font-pixel text-[10px] text-[color:var(--sunny)]">ARCADE</div>
          <h1 className="font-pixel text-2xl sm:text-3xl mt-3">All Mini Games</h1>
          <p className="mt-2 font-semibold">Pick a game, earn XP, unlock new worlds.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {games.map(g=>(
            <div key={g.t} className="pixel-card p-4">
              <div className="aspect-[4/3] rounded-xl border-4 border-[color:var(--ink)] grid place-items-center text-7xl" style={{background:g.c}}>{g.e}</div>
              <div className="flex justify-between mt-3">
                <h3 className="font-black">{g.t}</h3>
                <span className="tag bg-[color:var(--sunny)]"><Star size={10} fill="currentColor"/> +{g.xp}</span>
              </div>
              <div className="font-pixel text-[9px] mt-1 text-[color:var(--cherry)]">{g.k.toUpperCase()}</div>
              <Link to="/quiz" className="btn-game w-full mt-3">Play now</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
