import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import { useChannels } from "@/app/providers/ChannelsProvider";
import type { ChannelWithReach } from "../../entities/channel/types";
import { Loader } from "@/shared/ui/Loader/Loader";
import statsImage from "@/assets/images/stats.png";
import lupaIcon from "@/assets/images/lupa.png";
import cancelIcon from "@/assets/images/cancel.png";
import arrowIcon from "@/assets/images/arrow.png";
import { formatViewsCount } from "@/shared/utils/formatNumbers";
import "./ChannelsPage.css";

function formatDueTimeRu(dueTime: string): string {
  const date = new Date(dueTime);
  if (Number.isNaN(date.getTime())) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}.${month}.${year} в ${hours}:${minutes}`;
}

function isDueTimePassed(dueTime: string | null): boolean {
  if (!dueTime) return false;
  const date = new Date(dueTime);
  return !Number.isNaN(date.getTime()) && date.getTime() <= Date.now();
}

export function ChannelsPage() {
  const { isLoading: authLoading, error: authError, retry } = useAuth();
  const { channels, dueTime, msgText, isLoading, error, refetch } = useChannels();
  const [search, setSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navigate = useNavigate();

  const filtered = useMemo(() => {
    const list = channels ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((ch) => ch.title.toLowerCase().includes(q));
  }, [channels, search]);

  const formattedDueTime = dueTime ? formatDueTimeRu(dueTime) : null;
  const duePassed = isDueTimePassed(dueTime);

  const totalViews = useMemo(() => {
    if (!channels || channels.length === 0) {
      return {
        currentViews: null as number | null,
        last24Hours: null as number | null,
        last48Hours: null as number | null,
        last72Hours: null as number | null,
      };
    }

    return channels.reduce(
      (acc, channel) => ({
        currentViews: acc.currentViews + channel.reach.currentViews.count,
        last24Hours: acc.last24Hours + channel.reach.last24hours.count,
        last48Hours: acc.last48Hours + channel.reach.last48hours.count,
        last72Hours: acc.last72Hours + channel.reach.last72hours.count,
      }),
      {
        currentViews: 0,
        last24Hours: 0,
        last48Hours: 0,
        last72Hours: 0,
      }
    );
  }, [channels]);

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
      {duePassed ? (
        <div className="channels-msg-card channels-stats-card card-block">
          <div className="channels-msg-card__title">Статистика просмотров</div>
          <div className="channels-stats-card__grid">
            <div className="channels-stats-card__item">
              <div className="channels-stats-card__item-title">Сейчас</div>
              <div className="channels-stats-card__item-value">
                {totalViews.currentViews != null ? formatViewsCount(totalViews.currentViews) : "—"}
              </div>
            </div>
            <div className="channels-stats-card__item">
              <div className="channels-stats-card__item-title">24 часа</div>
              <div className="channels-stats-card__item-value">
                {totalViews.last24Hours != null ? formatViewsCount(totalViews.last24Hours) : "—"}
              </div>
            </div>
            <div className="channels-stats-card__item">
              <div className="channels-stats-card__item-title">48 часов</div>
              <div className="channels-stats-card__item-value">
                {totalViews.last48Hours != null ? formatViewsCount(totalViews.last48Hours) : "—"}
              </div>
            </div>
            <div className="channels-stats-card__item">
              <div className="channels-stats-card__item-title">72 часа</div>
              <div className="channels-stats-card__item-value">
                {totalViews.last72Hours != null ? formatViewsCount(totalViews.last72Hours) : "—"}
              </div>
            </div>
          </div>
          {formattedDueTime && (
            <div className="channels-stats-card__subtitle">
              Ваш пост вышел {formattedDueTime}
            </div>
          )}
        </div>
      ) : (
        <div className="channels-top-card card-block">
          <img src={statsImage} alt="" className="channels-top-card__image" />
          {formattedDueTime && (
            <div className="channels-top-card__text">
              <div className="channels-top-card__title">Ваш пост еще не вышел</div>
              <div className="channels-top-card__subtitle">
                Пост выйдет {formattedDueTime}
              </div>
            </div>
          )}
        </div>
      )}

      {msgText && (
        <div className="channels-msg-card card-block">
          <div className="channels-msg-card__title">Ваш пост</div>
          <div
            className="channels-msg-card__body"
            dangerouslySetInnerHTML={{ __html: msgText }}
          />
        </div>
      )}

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
                  {channel.channelUrl && (
                    <a
                      href={channel.channelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="channels-item-action"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="channels-item-action__text">
                        {duePassed ? "К посту" : "Перейти"}
                      </span>
                      <img src={arrowIcon} alt="" className="channels-item-action__arrow" />
                    </a>
                  )}
                </div>
                {duePassed && (
                  <div className="channels-item-stats">
                    <div className="channels-item-stats__cell">
                      <div className="channels-item-stats__title">Сейчас</div>
                      <div className="channels-item-stats__value">
                        {channel.reach.currentViews.count != null
                          ? formatViewsCount(channel.reach.currentViews.count)
                          : "—"}
                      </div>
                    </div>
                    <div className="channels-item-stats__cell">
                      <div className="channels-item-stats__title">24 часа</div>
                      <div className="channels-item-stats__value">
                        {channel.reach.last24hours.count != null
                          ? formatViewsCount(channel.reach.last24hours.count)
                          : "—"}
                      </div>
                    </div>
                    <div className="channels-item-stats__cell">
                      <div className="channels-item-stats__title">48 часов</div>
                      <div className="channels-item-stats__value">
                        {channel.reach.last48hours.count != null
                          ? formatViewsCount(channel.reach.last48hours.count)
                          : "—"}
                      </div>
                    </div>
                    <div className="channels-item-stats__cell">
                      <div className="channels-item-stats__title">72 часа</div>
                      <div className="channels-item-stats__value">
                        {channel.reach.last72hours.count != null
                          ? formatViewsCount(channel.reach.last72hours.count)
                          : "—"}
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
