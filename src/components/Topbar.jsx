import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { api } from "../services/api";

function formatDateBR(dateString) {
  if (!dateString) return "-";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("pt-BR");
}

function normalizeResponse(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.notifications)) return payload.notifications;
  return [];
}

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);

  const unreadCount = useMemo(() => {
    return notifications.filter((item) => !item.read).length;
  }, [notifications]);

  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoadingNotifications(true);

      const response = await api.get("/educators/notifications");
      const items = normalizeResponse(response.data);

      const normalizedNotifications = items
        .map((item) => ({
          ...item,
          read: Number(item.read) === 1,
        }))
        .sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        });

      setNotifications(normalizedNotifications);
    } catch (error) {
      setNotifications([]);
    } finally {
      setLoadingNotifications(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;

    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 15000);

    return () => clearInterval(interval);
  }, [user?.id, fetchNotifications]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setOpenUserMenu(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setOpenNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleSettings() {
    setOpenUserMenu(false);
    navigate("/settings");
  }

  function handleLogout() {
    setOpenUserMenu(false);
    logout();
    navigate("/");
  }

  function toggleUserMenu() {
    setOpenUserMenu((prev) => !prev);
    setOpenNotifications(false);
  }

  async function toggleNotifications() {
    const nextState = !openNotifications;

    setOpenNotifications(nextState);
    setOpenUserMenu(false);

    if (nextState) {
      await fetchNotifications();
    }
  }

  async function markAsRead(notification) {
    if (!user?.id) return;

    try {
      await api.post(`/educators/notifications/${notification.id}/read`);

      setNotifications((prev) =>
        prev.map((item) =>
          item.id === notification.id
            ? { ...item, read: true }
            : item
        )
      );
    } catch (error) {
      alert("Não foi possível marcar a notificação como lida. Tente novamente.");
    }
  }

  async function markAllAsRead() {
    if (!user?.id) return;

    try {
      await api.post("/educators/notifications/read", { all: true });

      setNotifications((prev) =>
        prev.map((item) => ({ ...item, read: true }))
      );
    } catch (error) {
      alert("Não foi possível marcar todas as notificações como lidas. Tente novamente.");
    }
  }

  return (
    <header className="h-14 flex items-center justify-end gap-3 px-6 bg-white">
      <div className="relative" ref={notificationRef}>
        <button
          onClick={toggleNotifications}
          type="button"
          className="relative flex items-center justify-center w-10 h-10 rounded-full bg-sf-green text-sf-textBlack border border-black/10 hover:bg-sf-green/90 transition"
        >
          <Bell size={18} />

          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {openNotifications && (
          <div className="absolute right-0 mt-2 w-80 rounded-xl border border-black/10 bg-white shadow-md overflow-hidden z-50">
            <div className="flex items-center justify-between px-4 py-3 border-b border-black/10">
              <span className="text-sm font-semibold text-black">
                Notificações
              </span>

              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-xs text-sf-textBlack hover:underline"
                >
                  Marcar todas como lidas
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {loadingNotifications ? (
                <div className="px-4 py-6 text-sm text-gray-500 text-center">
                  Carregando notificações...
                </div>
              ) : notifications.length === 0 ? (
                <div className="px-4 py-6 text-sm text-gray-500 text-center">
                  Nenhuma notificação no momento.
                </div>
              ) : (
                notifications.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => markAsRead(item)}
                    className={`w-full text-left px-4 py-3 border-b border-black/5 transition hover:bg-black/5 ${!item.read ? "bg-green-50" : "bg-white"
                      }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-black">
                          {item.title}
                        </p>

                        <p className="text-xs text-gray-600 mt-1">
                          {item.message}
                        </p>

                        {item.comment && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {item.comment}
                          </p>
                        )}

                        <p className="text-[11px] text-gray-400 mt-2">
                          {formatDateBR(item.created_at)}
                        </p>
                      </div>

                      {!item.read && (
                        <span className="mt-1 w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <div className="relative" ref={userMenuRef}>
        <button
          onClick={toggleUserMenu}
          type="button"
          className="flex items-center gap-2 rounded-full bg-sf-green text-sf-textBlack px-4 py-2 text-sm font-medium border border-black/10 hover:bg-sf-green/90 transition"
        >
          <span className="truncate max-w-[160px]">
            {user?.name ?? "USUÁRIO"}
          </span>

          <span
            className={`text-[10px] transition-transform duration-200 ${openUserMenu ? "rotate-180" : ""
              }`}
          >
            ▼
          </span>
        </button>

        {openUserMenu && (
          <div className="absolute right-0 mt-2 w-44 rounded-xl border border-black/10 bg-white shadow-md overflow-hidden z-50">
            <button
              onClick={handleSettings}
              type="button"
              className="w-full px-4 py-2.5 text-left text-sm text-black transition-all duration-200 hover:bg-black/10 hover:text-black"
            >
              Configurações
            </button>

            <button
              onClick={handleLogout}
              type="button"
              className="w-full px-4 py-2.5 text-left text-sm text-red-600 transition-all duration-200 hover:bg-red-100 hover:text-red-700"
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
}