import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { channelApi } from "../../entities/channel/api";
import type { Channel } from "../../entities/channel/types";
import "./ChannelsPage.css";
import { Loader } from "@/shared/ui/Loader/Loader";

export function ChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    channelApi
      .getChannels()
      .then((data) => {
        setChannels(data);
        setError(null);
      })
      .catch((e) => setError(e.message ?? "Failed to load channels"))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return channels;
    return channels.filter((ch) => ch.title.toLowerCase().includes(q));
  }, [channels, search]);

  const handleOpenChannel = (channel: Channel) => {
    navigate(`/channels/${channel.id}`, {
      state: { title: channel.title, avatarUrl: channel.avatarUrl },
    });
  };

  return (
    <div className="channels-page">
      <header className="channels-header">
        <h1 className="channels-title">Список ваших каналов</h1>
        <input
          className="channels-search"
          placeholder="Поиск по каналам"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </header>

      {isLoading && <Loader />}
      {error && <div className="channels-status channels-status_error">{error}</div>}

      {!isLoading && !error && filtered.length === 0 && (
        <div className="channels-empty">
          <div className="channels-empty-title">У вас пока нет ни 1 канала</div>
          <div className="channels-empty-text">
            Создайте новый канал или подключите существующий и он появится в этом меню
          </div>
        </div>
      )}

      {!isLoading && !error && filtered.length > 0 && (
        <ul className="channels-list">
          {filtered.map((channel) => (
            <li
              key={channel.id}
              className="channels-item"
              onClick={() => handleOpenChannel(channel)}
            >
              <div className="channels-item-left">
                <img src={channel.avatarUrl} alt={channel.title} className="channels-avatar" />
                <div className="channels-item-text">
                  <div className="channels-item-title">{channel.title}</div>
                  <div className="channels-item-subtitle">
                    {channel.subscribersCount.toLocaleString("ru-RU")} подписчиков
                  </div>
                </div>
              </div>
              <span className="channels-item-arrow">›</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
