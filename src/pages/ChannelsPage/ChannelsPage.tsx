import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import { useChannels } from "@/app/providers/ChannelsProvider";
import type { ChannelWithReach } from "../../entities/channel/types";
import { Loader } from "@/shared/ui/Loader/Loader";
import lupaIcon from "@/assets/images/lupa.png";
import cancelIcon from "@/assets/images/cancel.png";
import "./ChannelsPage.css";

export function ChannelsPage() {
  const { isLoading: authLoading, error: authError, retry } = useAuth();
  const { channels, isLoading, error, refetch } = useChannels();
  const [search, setSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navigate = useNavigate();

  const filtered = useMemo(() => {
    const list = channels ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((ch) => ch.title.toLowerCase().includes(q));
  }, [channels, search]);

  const handleOpenChannel = (channel: ChannelWithReach) => {
    navigate(`/channels/${channel.id}`, {
      state: { title: channel.title, avatarUrl: channel.avatarUrl },
    });
  };

  if (authLoading || (channels === null && isLoading)) return <Loader />;
  if (authError)
    return (
      <div className="channels-page">
        <div className="channels-status channels-status_error">{authError}</div>
        <button type="button" className="channels-retry" onClick={retry}>
          Повторить
        </button>
      </div>
    );

  return (
    <div className="channels-page">


      <div className="card-block">
        <header className="channels-header">
          {!isSearchOpen ? (
            <div className="channels-header-row">
              <h1 className="channels-title">Список каналов</h1>
              <button
                type="button"
                className="channels-header-lupa"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Открыть поиск"
              >
                <img src={lupaIcon} alt="" />
              </button>
            </div>
          ) : (
            <div className="channels-search-wrap">
              <input
                className="channels-search"
                placeholder="Поиск по каналам"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
              <button
                type="button"
                className="channels-search-cancel"
                onClick={() => {
                  setSearch("");
                  setIsSearchOpen(false);
                }}
                aria-label="Закрыть поиск"
              >
                <img src={cancelIcon} alt="" />
              </button>
            </div>
          )}
        </header>

        {error && (
          <>
            <div className="channels-status channels-status_error">{error}</div>
            <button type="button" className="channels-retry" onClick={refetch}>
              Повторить
            </button>
          </>
        )}

        {!error && channels !== null && filtered.length === 0 && (
          <div className="channels-empty">
            <div className="channels-empty-title">У вас пока нет ни 1 канала</div>
            <div className="channels-empty-text">
              Создайте новый канал или подключите существующий и он появится в этом меню
            </div>
          </div>
        )}

        {!error && filtered.length > 0 && (
          <ul className="channels-list">
            {filtered.map((channel) => (
              <li
                key={channel.id}
                className="channels-item"
                onClick={() => handleOpenChannel(channel)}
              >
                <div className="channels-item__main">
                  <div className="channels-item-left">
                    <img src={channel.avatarUrl} alt={channel.title} className="channels-avatar" />
                    <div className="channels-item-text">
                      <div className="channels-item-title">{channel.title}</div>
                      <div className="channels-item-subtitle">
                        {channel.subscribersCount.toLocaleString("ru-RU")} подписчиков
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
