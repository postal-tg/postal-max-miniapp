import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { channelApi } from "../../entities/channel/api";
import type { PostStatsChannel } from "../../entities/channel/types";
import "./PostStatsPage.css";
import { Loader } from "@/shared/ui/Loader/Loader";
import statsImage from "@/assets/images/stats.svg";
import lupaIcon from "@/assets/images/lupa.png";
import cancelIcon from "@/assets/images/cancel.png";
import arrowIcon from "@/assets/images/arrow.png";
import { formatViewsCount } from "@/shared/utils/formatNumbers";

function linkify(text: string) {
  if (!text) return "";

  const anchorTagRegex = /<a[\s\S]*?<\/a>/g;
  const anchors: string[] = [];

  const placeholderText = text.replace(anchorTagRegex, (match) => {
    anchors.push(match);
    return `__ANCHOR_PLACEHOLDER_${anchors.length - 1}__`;
  });

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const processed = placeholderText.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });

  return processed.replace(/__ANCHOR_PLACEHOLDER_(\d+)__/g, (_, index) => anchors[index]);
}

function preserveLineBreaks(text: string) {
  return text.replace(/\n/g, "<br/>");
}

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

function isPeriodStatsReady(dueTime: string | null, hours: number): boolean {
  if (!dueTime) return true;
  const date = new Date(dueTime);
  if (Number.isNaN(date.getTime())) return true;
  return date.getTime() + hours * 60 * 60 * 1000 <= Date.now();
}

function formatPeriodValue(
  count: number | null,
  dueTime: string | null,
  hours?: number
): string {
  if (count == null) return "—";
  if (hours != null && !isPeriodStatsReady(dueTime, hours)) return "—";
  return formatViewsCount(count);
}

export function PostStatsPage() {
  const [searchParams] = useSearchParams();
  const postId = searchParams.get("post_id");

  const [channels, setChannels] = useState<PostStatsChannel[]>([]);
  const [msgText, setMsgText] = useState<string | null>(null);
  const [dueTime, setDueTime] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!postId) {
      setChannels([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    channelApi
      .getPostStats(postId)
      .then((data) => {
        setChannels(data.channels);
        setMsgText(data.msgText);
        setDueTime(data.dueTime);
      })
      .catch(() => {
        setError("Не удалось загрузить данные. Попробуйте еще раз.");
        setChannels([]);
      })
      .finally(() => setIsLoading(false));
  }, [postId]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return channels;
    return channels.filter((ch) => ch.title.toLowerCase().includes(q));
  }, [channels, search]);

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
        currentViews:
          acc.currentViews != null && channel.reach.currentViews.count != null
            ? acc.currentViews + channel.reach.currentViews.count
            : acc.currentViews,
        last24Hours:
          acc.last24Hours != null && channel.reach.last24hours.count != null
            ? acc.last24Hours + channel.reach.last24hours.count
            : acc.last24Hours,
        last48Hours:
          acc.last48Hours != null && channel.reach.last48hours.count != null
            ? acc.last48Hours + channel.reach.last48hours.count
            : acc.last48Hours,
        last72Hours:
          acc.last72Hours != null && channel.reach.last72hours.count != null
            ? acc.last72Hours + channel.reach.last72hours.count
            : acc.last72Hours,
      }),
      {
        currentViews: 0,
        last24Hours: 0,
        last48Hours: 0,
        last72Hours: 0,
      }
    );
  }, [channels]);

  const hasChannels = filtered.length > 0;
  const formattedDueTime = dueTime ? formatDueTimeRu(dueTime) : null;
  const duePassed = isDueTimePassed(dueTime);

  return (
    <div className="post-stats-page">
      {duePassed ? (
        <div className="post-stats-msg-card card-block">
          <div className="post-stats-msg-card__title">Статистика просмотров</div>
          <div className="post-stats-summary__grid">
            <div className="post-stats-summary__item">
              <div className="post-stats-summary__item-title">Всего</div>
              <div className="post-stats-summary__item-value">
                {formatPeriodValue(totalViews.currentViews, dueTime)}
              </div>
            </div>
            <div className="post-stats-summary__item">
              <div className="post-stats-summary__item-title">24 часа</div>
              <div className="post-stats-summary__item-value">
                {formatPeriodValue(totalViews.last24Hours, dueTime, 24)}
              </div>
            </div>
            <div className="post-stats-summary__item">
              <div className="post-stats-summary__item-title">48 часов</div>
              <div className="post-stats-summary__item-value">
                {formatPeriodValue(totalViews.last48Hours, dueTime, 48)}
              </div>
            </div>
            <div className="post-stats-summary__item">
              <div className="post-stats-summary__item-title">72 часа</div>
              <div className="post-stats-summary__item-value">
                {formatPeriodValue(totalViews.last72Hours, dueTime, 72)}
              </div>
            </div>
          </div>
          {formattedDueTime && (
            <div className="post-stats-summary__subtitle">Ваш пост вышел {formattedDueTime}</div>
          )}
        </div>
      ) : (
        <div className="post-stats-hero card-block">
          <img src={statsImage} alt="" className="post-stats-hero__image" />
          {formattedDueTime && (
            <div className="post-stats-hero__text">
              <div className="post-stats-hero__title">Ваш пост еще не вышел</div>
              <div className="post-stats-hero__subtitle">Пост выйдет {formattedDueTime}</div>
            </div>
          )}
        </div>
      )}

      {msgText && (
        <div className="post-stats-msg-card card-block">
          <div className="post-stats-msg-card__title">Ваш пост</div>
          <div
            className="post-stats-msg-card__body"
            dangerouslySetInnerHTML={{
              __html: linkify(preserveLineBreaks(msgText || "")),
            }}
          />
        </div>
      )}

      <div className="card-block">
        <header className="post-stats-header">
          {!isSearchOpen ? (
            <div className="post-stats-header__row">
              <h1 className="post-stats-header__title">Список каналов</h1>
              <button
                type="button"
                className="post-stats-header__search-button"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Открыть поиск"
              >
                <img src={lupaIcon} alt="" />
              </button>
            </div>
          ) : (
            <div className="post-stats-search">
              <input
                className="post-stats-search__input"
                placeholder="Поиск по каналам"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
              <button
                type="button"
                className="post-stats-search__cancel"
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

        {error && <div className="post-stats-status post-stats-status_error">{error}</div>}

        {!error && !isLoading && !hasChannels && (
          <div className="post-stats-empty">
            <div className="post-stats-empty__title">У вас пока нет ни 1 канала</div>
            <div className="post-stats-empty__text">
              Создайте новый канал или подключите существующий и он появится в этом меню
            </div>
          </div>
        )}

        {isLoading && <Loader />}

        {!error && hasChannels && (
          <ul className="post-stats-list">
            {filtered.map((channel) => (
              <li
                key={channel.id}
                className={duePassed ? "post-stats-item post-stats-item_posted" : "post-stats-item"}
              >
                <div className="post-stats-item__main">
                  <div className="post-stats-item__left">
                    <img
                      src={channel.avatarUrl}
                      alt={channel.title}
                      className="post-stats-item__avatar"
                    />
                    <div className="post-stats-item__text">
                      <div className="post-stats-item__title">{channel.title}</div>
                      <div className="post-stats-item__subtitle">
                        {channel.subscribersCount.toLocaleString("ru-RU")} подписчиков
                      </div>
                    </div>
                  </div>
                  {channel.channelUrl && (
                    <a
                      href={channel.channelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="post-stats-channel-action"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="post-stats-channel-action__text">
                        {duePassed ? "К посту" : "Перейти"}
                      </span>
                      <img src={arrowIcon} alt="" className="post-stats-channel-action__arrow" />
                    </a>
                  )}
                </div>

                {duePassed && (
                  <div className="post-stats-channel-grid">
                    <div className="post-stats-channel-grid__cell">
                      <div className="post-stats-channel-grid__title">Всего</div>
                      <div className="post-stats-channel-grid__value">
                        {formatPeriodValue(channel.reach.currentViews.count, dueTime)}
                      </div>
                    </div>
                    <div className="post-stats-channel-grid__cell">
                      <div className="post-stats-channel-grid__title">24 часа</div>
                      <div className="post-stats-channel-grid__value">
                        {formatPeriodValue(channel.reach.last24hours.count, dueTime, 24)}
                      </div>
                    </div>
                    <div className="post-stats-channel-grid__cell">
                      <div className="post-stats-channel-grid__title">48 часов</div>
                      <div className="post-stats-channel-grid__value">
                        {formatPeriodValue(channel.reach.last48hours.count, dueTime, 48)}
                      </div>
                    </div>
                    <div className="post-stats-channel-grid__cell">
                      <div className="post-stats-channel-grid__title">72 часа</div>
                      <div className="post-stats-channel-grid__value">
                        {formatPeriodValue(channel.reach.last72hours.count, dueTime, 72)}
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
