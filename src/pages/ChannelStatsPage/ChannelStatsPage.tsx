// src/pages/ChannelStatsPage/ChannelStatsPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ResponsiveContainer } from "recharts";
import { statsApi } from "@/entities/stats/api";
import type { ChannelStats, StatsRange } from "@/entities/stats/types";
import "./ChannelStatsPage.css";
import { formatRuShortDate } from "@/shared/utils/formatDate";
import { GrowthTooltip } from "@/features/stats/ui/GrowthTooltip/GrowthTooltip";
import { SubscribersTooltip } from "@/features/stats/ui/SubscribersTooltip/SubscribersTooltip";
import { ChartsTooltip } from "@/features/stats/ui/ChartsTooltip/ChartsTooltip";
import { LineChartBase } from "@/shared/ui/LineChartBase/LineChartBase";
import { BackArrowIcon } from "@/shared/ui/BackArrowIcon/BackArrowIcon";
import { Loader } from "@/shared/ui/Loader/Loader";
import { formatToK } from "@/shared/utils/formatNumbers";

type LineDef = {
  dataKey: string;
  color: string;
};

const REACH_CONFIG = {
  "24h": { label: "24 часа", statsKey: "last24hours" },
  "48h": { label: "48 часов", statsKey: "last48hours" },
  "72h": { label: "72 часа", statsKey: "last72hours" },
} as const;

export function ChannelStatsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [range, setRange] = useState<StatsRange>("24h");
  const [stats, setStats] = useState<ChannelStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [onSubsribers, setOnSubscribers] = useState(true);
  const [onUnsubsribers, setOnUnsubscribers] = useState(true);
  const [chartLines, setChartLines] = useState<LineDef[]>([]);

  const location = useLocation();
  const state = location.state as { title: string; avatarUrl: string } | null;
  const channelTitle = state?.title ?? "Канал";
  const channelAvatarUrl = state?.avatarUrl ?? null;

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
        <div className="stats-top-right">
          {channelAvatarUrl && (
            <img src={channelAvatarUrl} alt={channelTitle} className="stats-top-avatar" />
          )}
          <div className="stats-top-title">{channelTitle}</div>
        </div>
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
                <div className="stats-main-row stats-main-row_three-col">
                  {Object.values(REACH_CONFIG).map(({ label, statsKey }) => (
                    <div className="stats-main-col" key={statsKey}>
                      <div className="stats-reach-label">{label}</div>
                      <div className="stats-main-value">
                        {formatToK(stats.overview.reach[statsKey].count)}
                      </div>
                      <div className="stats-main-label stats-main-label_up">
                        {`ER: ${stats.overview.reach[statsKey].er}%`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="diff-container">
                {/* За сегодня */}
                <div className="stats-main-card">
                  <div className="stats-main-title">За сегодня</div>
                  <div className="stats-main-row">
                    <div className="stats-main-col">
                      <div className="stats-main-value stats-main-diff_pos">
                        +{formatToK(stats.overview.today.subscribed)}
                      </div>
                      <div className="stats-main-label">Подписалось</div>
                    </div>
                    <div className="stats-main-col">
                      <div className="stats-main-value stats-main-diff_neg">
                        -{formatToK(stats.overview.today.unsubscribed)}
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
                        +{formatToK(stats.overview.month.subscribed)}
                      </div>
                      <div className="stats-main-label">Подписалось</div>
                    </div>
                    <div className="stats-main-col">
                      <div className="stats-main-value stats-main-diff_neg">
                        -{formatToK(stats.overview.month.unsubscribed)}
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
                  data={stats.reachChart.points[REACH_CONFIG[range].statsKey]}
                  lines={[{ dataKey: "reach", color: "#3b82f6" }]}
                  tooltipContent={<ChartsTooltip />}
                />
              </ResponsiveContainer>
            </div>
            <div className="stats-toggle-wrapper">
              <div className="stats-range-toggle_bottom">
                {(Object.keys(REACH_CONFIG) as StatsRange[]).map((value) => {
                  const { label } = REACH_CONFIG[value];

                  return (
                    <button
                      key={value}
                      className={`stats-range-btn ${
                        range === value ? "stats-range-btn_active" : ""
                      }`}
                      onClick={() => setRange(value)}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
