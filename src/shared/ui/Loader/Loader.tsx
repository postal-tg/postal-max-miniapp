import "./Loader.css";

export function Loader() {
  return (
    <>
      <div className="loader-container"> </div>
      <div className="loader">
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="20" cy="4" r="4" fill="#2B79D6" />
          <circle opacity="0.5" cx="20" cy="36" r="4" fill="#2B79D6" />
          <circle
            opacity="0.75"
            cx="36"
            cy="20"
            r="4"
            transform="rotate(90 36 20)"
            fill="#2B79D6"
          />
          <circle opacity="0.25" cx="4" cy="20" r="4" transform="rotate(90 4 20)" fill="#2B79D6" />
          <circle
            opacity="0.625"
            cx="31.3138"
            cy="31.3137"
            r="4"
            transform="rotate(135 31.3138 31.3137)"
            fill="#2B79D6"
          />
          <circle
            opacity="0.125"
            cx="8.6869"
            cy="8.68628"
            r="4"
            transform="rotate(135 8.6869 8.68628)"
            fill="#2B79D6"
          />
          <circle
            opacity="0.375"
            cx="8.68652"
            cy="31.3138"
            r="4"
            transform="rotate(-135 8.68652 31.3138)"
            fill="#2B79D6"
          />
          <circle
            opacity="0.875"
            cx="31.3145"
            cy="8.68641"
            r="4"
            transform="rotate(-135 31.3145 8.68641)"
            fill="#2B79D6"
          />
        </svg>

        <div className="loader-title">Загружаем статистику</div>
        <div className="loader-desc">Немного подождите, это может занять некоторое время</div>
      </div>
    </>
  );
}
