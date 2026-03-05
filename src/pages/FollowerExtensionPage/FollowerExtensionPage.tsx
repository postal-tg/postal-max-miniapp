import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./FollowerExtensionPage.css";
import { followerExtensionApi } from "@/entities/followerExtension/api";
import { useAuth } from "@/app/providers/AuthProvider";
import { getStartParam, getUserIdFromInitData } from "@/shared/utils/parseInitData";

export function FollowerExtensionPage() {
  const { isAuthenticated, isLoading: isAuthLoading, error: authError } = useAuth();
  const [searchParams] = useSearchParams();

  const [msgHtml, setMsgHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isAuthLoading) return;

    if (!isAuthenticated) {
      setIsLoading(false);
      setError(authError || "Не удалось выполнить авторизацию");
      return;
    }

    const userId = getUserIdFromInitData();
    if (!userId) {
      setIsLoading(false);
      setError("Не удалось определить пользователя из WebApp initData");
      return;
    }

    const startParam =
      searchParams.get("start_param") ?? searchParams.get("startapp") ?? getStartParam();

    if (!startParam || !startParam.startsWith("fe_")) {
      setIsLoading(false);
      setError("Некорректный параметр расширения подписчика");
      return;
    }

    const followerExtensionUuid = startParam.slice("fe_".length);
    if (!followerExtensionUuid) {
      setIsLoading(false);
      setError("Не передан идентификатор расширения подписчика");
      return;
    }

    let isCancelled = false;

    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { msgText } = await followerExtensionApi.getMessage(
          userId,
          followerExtensionUuid
        );
        if (!isCancelled) {
          setMsgHtml(msgText ?? null);
          setIsLoading(false);
        }
      } catch (e) {
        if (!isCancelled) {
          setIsLoading(false);
          setError(
            e instanceof Error
              ? e.message
              : "Ошибка загрузки данных расширения подписчика"
          );
        }
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [isAuthLoading, isAuthenticated, authError, searchParams]);

  const content = (() => {
    if (isLoading) {
      return (
        <p className="follower-ext-text">
          Загрузка данных расширения подписчика...
        </p>
      );
    }

    if (error) {
      return (
        <p className="follower-ext-text" style={{ color: "#d33" }}>
          {error}
        </p>
      );
    }

    if (!msgHtml) {
      return (
        <p className="follower-ext-text">
          Для этого расширения нет данных для отображения.
        </p>
      );
    }

    return (
      <div
        className="follower-ext-text"
        dangerouslySetInnerHTML={{ __html: msgHtml }}
      />
    );
  })();

  return (
    <div className="channels-page follower-ext-page">
      <main className="card-block follower-ext-card">{content}</main>
    </div>
  );
}

