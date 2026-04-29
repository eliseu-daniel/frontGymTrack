import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  Apple,
  Ruler,
  BarChart3,
  MessageSquare,
} from "lucide-react";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/pacientes", label: "Pacientes", icon: Users },
  { to: "/treinos", label: "Treinos", icon: Dumbbell },
  { to: "/dietas", label: "Dietas", icon: Apple },
  { to: "/antropometria", label: "Antropometria", icon: Ruler },
  { to: "/reports", label: "Relatórios", icon: BarChart3 },
  { to: "/feedback", label: "Feedback", icon: MessageSquare },
];

const Item = ({ to, icon: Icon, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      [
        "group flex items-center gap-3 mx-3 px-4 py-3 rounded-xl",
        "text-[14px] uppercase tracking-wide transition-all duration-200",
        "border-l-4",
        isActive
          ? "bg-white/30 border-sf-textBlack text-sf-textBlack shadow-sm font-semibold"
          : "border-transparent text-sf-textBlack/90 hover:bg-white/20 hover:border-sf-textBlack/40",
      ].join(" ")
    }
  >
    <Icon size={18} className="shrink-0" />
    <span>{children}</span>
  </NavLink>
);

export default function Sidebar({ isOpen, onToggle }) {
  return (
    <>
      <aside
        className={[
          "fixed top-0 left-0 h-screen w-[220px] z-50",
          "bg-sf-green text-sf-textBlack border-r border-black/10 shadow-md",
          "transition-transform duration-300 ease-in-out",
          "flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="px-4 pt-5 pb-6 border-b border-black/10">
          <div className="flex items-center gap-3">
            <button
              onClick={onToggle}
              className="flex flex-col justify-center items-center gap-1 w-10 h-10 rounded-xl hover:bg-white/20 transition"
              aria-label="Mostrar ou esconder menu"
              type="button"
            >
              <span className="block w-5 h-[2px] bg-sf-textBlack rounded"></span>
              <span className="block w-5 h-[2px] bg-sf-textBlack rounded"></span>
              <span className="block w-5 h-[2px] bg-sf-textBlack rounded"></span>
            </button>

            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-sf-textBlack/60">
                Synchro Fit
              </div>
              <div className="text-lg font-serif uppercase leading-none">
                Menu
              </div>
            </div>
          </div>
        </div>

        <nav className="py-4 flex flex-col gap-1">
          {items.map(({ to, label, icon }) => (
            <Item key={to} to={to} icon={icon}>
              {label}
            </Item>
          ))}
        </nav>
      </aside>

      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed top-6 left-4 z-50 flex flex-col justify-center items-center gap-1 w-11 h-11 rounded-xl bg-sf-green border border-black/10 shadow-md hover:bg-sf-green/90 transition"
          aria-label="Abrir menu"
          type="button"
        >
          <span className="block w-5 h-[2px] bg-sf-textBlack rounded"></span>
          <span className="block w-5 h-[2px] bg-sf-textBlack rounded"></span>
          <span className="block w-5 h-[2px] bg-sf-textBlack rounded"></span>
        </button>
      )}
    </>
  );
}