import { OPERATOR } from "@/lib/operator";

export function DocLayout({
  title,
  revision,
  children,
}: {
  title: string;
  revision: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <main>
        <section className="section section-dark">
          <div className="container">
            <a href="/" className="plate plate--sm" style={{ marginBottom: 24 }}>
              <span className="plate__stripe">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
                  <circle cx="12" cy="9.5" r="2.3" />
                </svg>
              </span>
              <span className="plate__body">
                КАРТЫ&nbsp;<span className="plate__num">05</span>
              </span>
            </a>
            <span className="eyebrow">Документ</span>
            <h1 style={{ fontSize: "clamp(24px,6.6vw,32px)", marginBottom: 8 }}>{title}</h1>
            <p style={{ fontSize: 13.5, color: "var(--muted-dark)" }}>Редакция от {revision}</p>
          </div>
        </section>

        <section className="section section-light">
          <div className="container" style={{ maxWidth: 640 }}>
            {children}
            <p style={{ marginTop: 32 }}>
              <a href="/" style={{ textDecoration: "underline" }}>← Вернуться на главную</a>
            </p>
          </div>
        </section>
      </main>

      <footer>
        <div className="container">
          <p>Оформление и продвижение карточек на Яндекс Картах и 2ГИС · Махачкала, Дагестан</p>
        </div>
      </footer>
    </>
  );
}

export function DocBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 19, marginBottom: 10 }}>{title}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{children}</div>
    </div>
  );
}

const listStyle = { paddingLeft: 20, listStyle: "disc", display: "flex", flexDirection: "column", gap: 4 } as const;

export function DocList({ children }: { children: React.ReactNode }) {
  return <ul style={listStyle}>{children}</ul>;
}

export function OperatorDetails() {
  return (
    <DocList>
      <li>Наименование: {OPERATOR.name}</li>
      <li>ИНН: {OPERATOR.inn}</li>
      <li>ОГРНИП: {OPERATOR.ogrnip}</li>
      <li>Адрес: {OPERATOR.address}</li>
      <li>
        Контактный email:{" "}
        <a href={`mailto:${OPERATOR.email}`} style={{ textDecoration: "underline" }}>
          {OPERATOR.email}
        </a>
      </li>
    </DocList>
  );
}
