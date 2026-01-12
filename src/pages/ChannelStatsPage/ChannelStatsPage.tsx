// src/pages/ChannelStatsPage/ChannelStatsPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ResponsiveContainer } from "recharts";
import { statsApi } from "@/entities/stats/api";
import type { ChannelStats } from "@/entities/stats/types";
import "./ChannelStatsPage.css";
import { formatRuShortDate } from "@/shared/utils/formatDate";
import { GrowthTooltip } from "@/features/stats/ui/GrowthTooltip/GrowthTooltip";
import { SubscribersTooltip } from "@/features/stats/ui/SubscribersTooltip/SubscribersTooltip";
import { ChartsTooltip } from "@/features/stats/ui/ChartsTooltip/ChartsTooltip";
import { LineChartBase } from "@/shared/ui/LineChartBase/LineChartBase";
import { BackArrowIcon } from "@/shared/ui/BackArrowIcon/BackArrowIcon";
import { Loader } from "@/shared/ui/Loader/Loader";

type Range = "24h" | "48h";

type LineDef = {
  dataKey: string;
  color: string;
};

export function ChannelStatsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [range, setRange] = useState<Range>("24h");
  const [stats, setStats] = useState<ChannelStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [onSubsribers, setOnSubscribers] = useState(true);
  const [onUnsubsribers, setOnUnsubscribers] = useState(true);
  const [chartLines, setChartLines] = useState<LineDef[]>([]);

  const location = useLocation();
  const state = location.state as { title?: string } | null;
  const channelTitle = state?.title ?? "Канал";

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    statsApi
      .getChannelStats(id)
      .then((data) => {
        setStats(data);
        setError(null);
      })
      .catch((e) => setError(e.message ?? "Failed to load stats"))
      .finally(() => setIsLoading(false));
  }, [id]);

  const reachPointsForRange = useMemo(() => {
    if (!stats) return [];
    const points = stats.reachChart.points;
    if (range === "48h") return points;
    const half = Math.floor(points.length / 2);
    return points.slice(half);
  }, [stats, range]);

  useEffect(() => {
    const lines = [];
    if (onSubsribers) {
      lines.push({ dataKey: "subscribed", color: "#6AC778" });
    }

    if (onUnsubsribers) {
      lines.push({ dataKey: "unsubscribed", color: "#d56666" });
    }

    setChartLines(lines);
  }, [onSubsribers, onUnsubsribers]);

  if (!id) return <div>Channel id is missing</div>;

  return (
    <div className="stats-page">
      {/* Верхняя строка */}
      <div className="stats-top-bar">
        <button className="stats-top-back" onClick={() => navigate("/channels")}>
          <BackArrowIcon />
          <span>Назад</span>
        </button>
        <div className="stats-top-title">{channelTitle}</div>
      </div>

      {isLoading && <Loader />}
      {error && <div className="stats-status stats-status_error">{error}</div>}

      {stats && !isLoading && !error && (
        <div className="stats-container">
          {/* ОБЩАЯ СТАТИСТИКА */}
          <section className="stats-section-main">
            <div className="stats-title-row">
              <div className="stats-title">Общая статистика</div>
              <div className="stats-period">
                {formatRuShortDate(stats.summary.period.from)} –
                {formatRuShortDate(stats.summary.period.to)}
              </div>
            </div>

            <div className="overview-container">
              <div className="stats-main-counter">
                <div className="stats-main-counter-caption">Подписчики</div>
                <div className="stats-main-counter-value">
                  {stats.summary.totalSubscribers.toLocaleString("ru-RU")}
                </div>
              </div>

              {/* Охват 24 / 48 */}
              <div className="stats-main-card">
                <div className="stats-main-title">Охват</div>
                <div className="stats-main-row">
                  <div className="stats-main-col">
                    <div className="stats-main-value">
                      {stats.overview.reach.current.toLocaleString("ru-RU")}
                    </div>
                    <div className="stats-main-label">24 часа</div>
                  </div>
                  <div className="stats-main-col">
                    <div className="stats-main-value">
                      {stats.overview.reach.previous.toLocaleString("ru-RU")}
                    </div>
                    <div className="stats-main-label">48 часов</div>
                  </div>
                </div>
              </div>

              <div className="diff-container">
                {/* За сегодня */}
                <div className="stats-main-card">
                  <div className="stats-main-title">За сегодня</div>
                  <div className="stats-main-row">
                    <div className="stats-main-col">
                      <div className="stats-main-value stats-main-diff_pos">
                        +{stats.overview.today.subscribed.toLocaleString("ru-RU")}
                      </div>
                      <div className="stats-main-label">Подписалось</div>
                    </div>
                    <div className="stats-main-col">
                      <div className="stats-main-value stats-main-diff_neg">
                        -{stats.overview.today.unsubscribed.toLocaleString("ru-RU")}
                      </div>
                      <div className="stats-main-label">Отписалось</div>
                    </div>
                  </div>
                </div>

                {/* За месяц */}
                <div className="stats-main-card">
                  <div className="stats-main-title">За месяц</div>
                  <div className="stats-main-row">
                    <div className="stats-main-col">
                      <div className="stats-main-value stats-main-diff_pos">
                        +{stats.overview.month.subscribed.toLocaleString("ru-RU")}
                      </div>
                      <div className="stats-main-label">Подписалось</div>
                    </div>
                    <div className="stats-main-col">
                      <div className="stats-main-value stats-main-diff_neg">
                        -{stats.overview.month.unsubscribed.toLocaleString("ru-RU")}
                      </div>
                      <div className="stats-main-label">Отписалось</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* РОСТ */}
          <section className="stats-section">
            <div className="stats-title-row">
              <div className="stats-title">Рост</div>
              <div className="stats-period">
                {formatRuShortDate(stats.summary.period.from)} –
                {formatRuShortDate(stats.summary.period.to)}
              </div>
            </div>
            <div className="stats-chart-wrapper">
              <ResponsiveContainer width="100%" height={160}>
                <LineChartBase
                  data={stats.growthChart.points}
                  lines={[{ dataKey: "totalSubscribers", color: "#3b82f6" }]}
                  tooltipContent={<GrowthTooltip />}
                />
              </ResponsiveContainer>
            </div>
          </section>

          {/* ПОДПИСЧИКИ */}
          <section className="stats-section">
            <div className="stats-title-row">
              <div className="stats-title">Подписчики</div>
              <div className="stats-period">
                {formatRuShortDate(stats.summary.period.from)} –
                {formatRuShortDate(stats.summary.period.to)}
              </div>
            </div>
            <div className="stats-chart-wrapper">
              <ResponsiveContainer width="100%" height={180}>
                <LineChartBase
                  data={stats.subscribersChart.points}
                  lines={chartLines}
                  tooltipContent={<SubscribersTooltip />}
                />
              </ResponsiveContainer>
            </div>
            <div className="stats-legend-badges">
              <span
                className={`stats-badge stats-badge_pos${
                  !onSubsribers ? " stats-badge_inactive" : ""
                }`}
                onClick={() => setOnSubscribers(!onSubsribers)}
              >
                Подписались
              </span>
              <span
                className={`stats-badge stats-badge_neg${
                  !onUnsubsribers ? " stats-badge_inactive" : ""
                }`}
                onClick={() => setOnUnsubscribers(!onUnsubsribers)}
              >
                Отписались
              </span>
            </div>
          </section>

          {/* ОХВАТ */}
          <section className="stats-section">
            <div className="stats-title-row">
              <div className="stats-title">Охват</div>
              <div className="stats-period">
                {formatRuShortDate(stats.summary.period.from)} –
                {formatRuShortDate(stats.summary.period.to)}
              </div>
            </div>
            <div className="stats-chart-wrapper">
              <ResponsiveContainer width="100%" height={180}>
                <LineChartBase
                  data={reachPointsForRange}
                  lines={[{ dataKey: "reach", color: "#3b82f6" }]}
                  tooltipContent={<ChartsTooltip />}
                />
              </ResponsiveContainer>
            </div>
            <div className="stats-toggle-wrapper">
              <div className="stats-range-toggle_bottom">
                <button
                  className={`stats-range-btn ${range === "24h" ? "stats-range-btn_active" : ""}`}
                  onClick={() => setRange("24h")}
                >
                  24 часа
                </button>
                <button
                  className={`stats-range-btn ${range === "48h" ? "stats-range-btn_active" : ""}`}
                  onClick={() => setRange("48h")}
                >
                  48 часов
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
