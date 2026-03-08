import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import "./FollowerExtensionPage.css";
import { followerExtensionApi } from "@/entities/followerExtension/api";
import { useAuth } from "@/app/providers/AuthProvider";
import { getUserIdFromInitData } from "@/shared/utils/parseInitData";

export function FollowerExtensionPage() {
  const { isAuthenticated, isLoading: isAuthLoading, error: authError } = useAuth();
  const [searchParams] = useSearchParams();
  const { userId: userIdFromPath, followerExtensionUuid: uuidFromPath } = useParams<{
    userId: string;
    followerExtensionUuid: string;
  }>();

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

    const startParam = searchParams.get("start_param");
    const followerExtensionUuidFromQuery = startParam?.startsWith("fe_")
      ? startParam.slice("fe_".length).trim()
      : null;

    const userId = userIdFromPath?.trim() || getUserIdFromInitData();
    const followerExtensionUuid = uuidFromPath?.trim() || followerExtensionUuidFromQuery;

    if (!userId || !followerExtensionUuid) {
      setIsLoading(false);
      setError("Не найдены параметры расширения подписчика");
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
  }, [
    isAuthLoading,
    isAuthenticated,
    authError,
    searchParams,
    userIdFromPath,
    uuidFromPath,
  ]);

  const content = (() => {
    if (isLoading) {
      return null;
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

