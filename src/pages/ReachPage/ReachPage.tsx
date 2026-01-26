import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { channelApi } from "../../entities/channel/api";
import type { ChannelWithReach } from "../../entities/channel/types";
import "./ReachPage.css";
import { Loader } from "@/shared/ui/Loader/Loader";
import { formatToK } from "@/shared/utils/formatNumbers";

export function ReachPage() {
  const [searchParams] = useSearchParams();
  const postId = searchParams.get("post_id");

  const [channels, setChannels] = useState<ChannelWithReach[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!postId) {
      setChannels([]);
      return;
    }

    setIsLoading(true);
    channelApi
      .getChannelsWithReach(postId)
      .then((data) => {
        setChannels(data);
      })
      .catch(() => {
        setChannels([]);
      })
      .finally(() => setIsLoading(false));
  }, [postId]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return channels;
    return channels.filter((ch) => ch.title.toLowerCase().includes(q));
  }, [channels, search]);

  return (
    <div className="reach-page">
      <header className="reach-header">
        <h1 className="reach-title">Список ваших каналов</h1>
        <input
          className="reach-search"
          placeholder="Поиск по каналам"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </header>

      {isLoading && <Loader />}

      {!isLoading && filtered.length === 0 && (
        <div className="reach-empty">
          <div className="reach-empty-title">У вас пока нет ни 1 канала</div>
          <div className="reach-empty-text">
            Создайте новый канал или подключите существующий и он появится в этом меню
          </div>
        </div>
      )}

      {!isLoading && filtered.length > 0 && (
        <ul className="reach-list">
          {filtered.map((channel) => (
            <li key={channel.id} className="reach-item">
              <div className="reach-item-content">
                <div className="reach-item-header">
                  <div className="reach-item-header-left">
                    <img src={channel.avatarUrl} alt={channel.title} className="reach-avatar" />
                    <div className="reach-item-title">{channel.title}</div>
                  </div>
                  <div className="reach-item-subscribers">
                    {channel.subscribersCount.toLocaleString("ru-RU")} подписчиков
                  </div>
                </div>
                <div className="reach-item-stats">
                  <div className="reach-item-stat">
                    <span className="reach-stat-label">24 часа</span>
                    <span className="reach-stat-value">
                      {formatToK(channel.reach.last24hours.count)}
                    </span>
                  </div>
                  <div className="reach-item-stat">
                    <span className="reach-stat-label">48 часов</span>
                    <span className="reach-stat-value">
                      {formatToK(channel.reach.last48hours.count)}
                    </span>
                  </div>
                  <div className="reach-item-stat">
                    <span className="reach-stat-label">72 часа</span>
                    <span className="reach-stat-value">
                      {formatToK(channel.reach.last72hours.count)}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
