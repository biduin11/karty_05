"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const topbarRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const revealEls = document.querySelectorAll(".reveal");
    let io: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              io!.unobserve(e.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
      );
      revealEls.forEach((el) => io!.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add("in"));
    }

    const topbar = topbarRef.current;
    const hero = heroRef.current;
    let heroObserver: IntersectionObserver | undefined;
    if (topbar && hero) {
      heroObserver = new IntersectionObserver(
        ([entry]) => {
          topbar.classList.toggle("is-visible", !entry.isIntersecting);
        },
        { threshold: 0 }
      );
      heroObserver.observe(hero);
    }

    return () => {
      io?.disconnect();
      heroObserver?.disconnect();
    };
  }, []);

  return (
    <>
      <div className="topbar" id="topbar" ref={topbarRef}>
        <span className="plate plate--sm">
          <span className="plate__stripe">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
              <circle cx="12" cy="9.5" r="2.3" />
            </svg>
          </span>
          <span className="plate__body">
            КАРТЫ&nbsp;<span className="plate__num">05</span>
          </span>
        </span>
        <a href="#form" className="btn btn-primary">Оставить заявку</a>
      </div>

      <main>
        {/* ============ HERO ============ */}
        <section className="hero" ref={heroRef}>
          <div className="container">
            <div className="hero__top">
              <span className="plate">
                <span className="plate__stripe">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
                    <circle cx="12" cy="9.5" r="2.3" />
                  </svg>
                </span>
                <span className="plate__body">
                  КАРТЫ&nbsp;<span className="plate__num">05</span>
                </span>
              </span>
            </div>

            <div className="hero__visual" aria-hidden="true">
              <svg className="route-svg" viewBox="0 0 320 130" width="100%">
                <g className="dot-dim">
                  <circle cx="46" cy="34" r="3"></circle>
                  <circle cx="88" cy="92" r="2.4"></circle>
                  <circle cx="150" cy="26" r="2.2"></circle>
                  <circle cx="230" cy="98" r="2.8"></circle>
                </g>
                <path className="route-path" pathLength={1} d="M20,100 C70,110 90,40 140,55 C190,70 210,20 260,34 C280,40 285,48 288,58"></path>
                <circle className="ring" cx="288" cy="58" r="6"></circle>
                <g className="pin-glow" transform="translate(276,34)">
                  <path d="M12 26s10-8.9 10-16.3A10 10 0 0 0 2 9.7C2 17.1 12 26 12 26z" fill="#F2A93B"></path>
                  <circle cx="12" cy="9.7" r="3.6" fill="#14181C"></circle>
                </g>
              </svg>
            </div>

            <h1>Пока карточка пустая, клиент уже едет к <em>конкуренту</em></h1>
            <p className="lead">Оформляем и продвигаем карточки на Яндекс Картах и 2ГИС для бизнеса в Махачкале — чтобы человек, который ищет рядом, доезжал до вас, а не листал дальше.</p>

            <div className="hero__actions">
              <a href="#form" className="btn btn-primary btn-block">Узнать стоимость</a>
            </div>

            <div className="hero__trust">
              <span>кафе</span><span>стоматологии</span><span>автосервисы</span><span>магазины</span><span>услуги для дома</span>
            </div>
            <p className="hero__coords">42.98° N, 47.50° E — Махачкала</p>
          </div>
        </section>

        {/* ============ PROBLEM ============ */}
        <section className="section section-light">
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">Знакомо?</span>
              <h2>Вот что теряет бизнес без нормальной карточки</h2>
            </div>
            <div className="problem-list">
              <div className="problem-card reveal">
                <div className="problem-card__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h3l2-3h6l2 3h3v12H4z" /><circle cx="12" cy="13" r="3.5" /></svg>
                </div>
                <strong>Пустая карточка = пустой зал</strong>
                <p>Ноль фото или три размытых снимка на телефон трёхлетней давности. Человек решает, ехать к вам или нет, за пару секунд — и чаще выбирает того, у кого есть что посмотреть.</p>
              </div>
              <div className="problem-card reveal">
                <div className="problem-card__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M7 15l4-5 3 3 5-7" /></svg>
                </div>
                <strong>Конкурент стоит выше — хотя сервис хуже</strong>
                <p>Позиция в поиске и на картах зависит от того, насколько заполнена карточка. У соседа фото, отзывы и актуальный режим работы — и он выше вас, даже если у вас лучше.</p>
              </div>
              <div className="problem-card reveal">
                <div className="problem-card__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.3" /></svg>
                </div>
                <strong>Не видно, что внутри — не рискуют ехать</strong>
                <p>Без панорамы человек не понимает, куда едет: маленькое кафе или просторный зал, чисто внутри или нет. В незнакомое место многие просто не рискуют.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ SOLUTION ============ */}
        <section className="section section-dark">
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">Что мы делаем</span>
              <h2>Всё, что нужно карточке, чтобы приводить клиентов</h2>
            </div>
            <div className="route-list reveal">
              <div className="route-row">
                <div className="route-row__mark">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h3l2-3h6l2 3h3v12H4z" /><circle cx="12" cy="13" r="3.5" /></svg>
                </div>
                <div>
                  <h3>Оформление карточки</h3>
                  <p>Фото, описание, категории, услуги, режим работы</p>
                </div>
              </div>
              <div className="route-row">
                <div className="route-row__mark">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M7 15l4-5 3 3 5-7" /></svg>
                </div>
                <div>
                  <h3>Продвижение</h3>
                  <p>Выше в поиске и на картах, где ищут ваших клиентов</p>
                </div>
              </div>
              <div className="route-row">
                <div className="route-row__mark">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 3v6h-6" /></svg>
                </div>
                <div>
                  <h3>Панорама 360°</h3>
                  <p>3D-прогулка по вашему заведению прямо в карточке</p>
                </div>
              </div>
              <div className="route-row">
                <div className="route-row__mark">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                </div>
                <div>
                  <h3>Новости и истории</h3>
                  <p>Карточка живая, а не заброшенная с прошлого года</p>
                </div>
              </div>
              <div className="route-row">
                <div className="route-row__mark">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92z" /></svg>
                </div>
                <div>
                  <h3>Рост звонков и заявок из карточки</h3>
                  <p>Больше людей нажимают «Позвонить» и «Построить маршрут»</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ BEFORE / AFTER ============ */}
        <section className="section section-light">
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">Было / стало</span>
              <h2>Так выглядит карточка до и после</h2>
            </div>
          </div>
          <div className="swipe reveal">
            <div className="frame">
              <div className="frame__label">Было</div>
              <div className="frame__body"><span>Здесь будет скриншот карточки клиента до оформления</span></div>
            </div>
            <div className="frame frame--after">
              <div className="frame__label">Стало</div>
              <div className="frame__body"><span>Здесь будет скриншот карточки клиента после оформления</span></div>
            </div>
          </div>
          <div className="container"><p className="swipe-hint reveal">← пролистните, чтобы сравнить</p></div>
        </section>

        {/* ============ PROCESS ============ */}
        <section className="section section-dark">
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">Как это происходит</span>
              <h2>Пять шагов от заявки до готовой карточки</h2>
            </div>
            <div className="timeline reveal">
              <div className="tl-item">
                <div className="tl-num">1</div>
                <h3>Заявка</h3>
                <p>Оставляете номер в форме ниже — перезваниваем в течение дня.</p>
              </div>
              <div className="tl-item">
                <div className="tl-num">2</div>
                <h3>Аудит</h3>
                <p>Смотрим вашу текущую карточку и говорим прямо, что в ней не так.</p>
              </div>
              <div className="tl-item">
                <div className="tl-num">3</div>
                <h3>Съёмка и оформление</h3>
                <p>Приезжаем, снимаем фото и панораму (если нужна), готовим тексты.</p>
              </div>
              <div className="tl-item">
                <div className="tl-num">4</div>
                <h3>Публикация</h3>
                <p>Карточка обновлена и заполнена по всем пунктам на Картах и в 2ГИС.</p>
              </div>
              <div className="tl-item">
                <div className="tl-num">5</div>
                <h3>Продвижение</h3>
                <p>Следим за позицией, публикуем новости, помогаем с ответами на отзывы.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ PANORAMA ============ */}
        <section className="section section-light">
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">Отдельная услуга</span>
              <h2>Панорама — это как зайти внутрь ещё до приезда</h2>
            </div>
            <div className="pano-visual reveal" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 3v6h-6" /></svg>
            </div>
            <p className="reveal">Человек открывает карточку, крутит панораму пальцем и видит зал, стол, интерьер — и уже решает, ехать к вам или нет. Для кафе, стоматологий и салонов это часто решающий момент перед звонком.</p>
            <div className="pano-price reveal">Панорама 360° — <b>7 000 ₽</b><span>за точку</span></div>
            <a href="#form" className="btn btn-primary reveal">Заказать панораму</a>
          </div>
        </section>

        {/* ============ REVIEWS ============ */}
        <section className="section section-dark">
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">Что говорят</span>
              <h2>Отзывы клиентов</h2>
            </div>
          </div>
          <div className="swipe reveal">
            <div className="review-card">
              <span className="review-card__pin" aria-hidden="true"></span>
              <span className="review-card__rating">5.0 ★</span>
              <p>«Здесь появится отзыв вашего клиента — пришлём шаблон на согласование перед публикацией.»</p>
              <div className="review-card__who"><b>Имя клиента</b><span>Название заведения</span></div>
            </div>
            <div className="review-card">
              <span className="review-card__pin" aria-hidden="true"></span>
              <span className="review-card__rating">5.0 ★</span>
              <p>«Второй отзыв тоже будет здесь — соберём после первых проектов.»</p>
              <div className="review-card__who"><b>Имя клиента</b><span>Название заведения</span></div>
            </div>
          </div>
        </section>

        {/* ============ PRICING ============ */}
        <section className="section section-light">
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">Сколько это стоит</span>
              <h2>Цены</h2>
            </div>
            <div className="price-list reveal">
              <div className="price-card price-card--feat">
                <span className="price-card__tag">Чаще всего заказывают</span>
                <div className="price-card__top">
                  <h3>Оформление карточки</h3>
                  <div className="price-card__amount">20 000 ₽<span><br />разово</span></div>
                </div>
                <p>Фото, описание, категории, услуги, режим работы, публикация на Яндекс Картах и в 2ГИС.</p>
              </div>
              <div className="price-card">
                <div className="price-card__top">
                  <h3>Панорама 360°</h3>
                  <div className="price-card__amount">7 000 ₽<span><br />за точку</span></div>
                </div>
                <p>3D-тур по вашему заведению внутри карточки.</p>
              </div>
              <div className="price-card">
                <div className="price-card__top">
                  <h3>Продвижение и поддержка</h3>
                  <div className="price-card__amount">9 000 ₽<span><br />в месяц</span></div>
                </div>
                <p>Работа над позицией в поиске, публикация новостей, помощь с отзывами.</p>
              </div>
            </div>
            <p className="price-note reveal">Можно заказать отдельно или собрать пакетом — обсудим на созвоне после заявки.</p>
            <a href="#form" className="btn btn-primary btn-block reveal" style={{ marginTop: "22px" }}>Узнать стоимость под мой бизнес</a>
          </div>
        </section>

        {/* ============ FAQ ============ */}
        <section className="section section-dark">
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">Частые вопросы</span>
              <h2>FAQ</h2>
            </div>
            <div className="reveal">
              <details className="faq-item">
                <summary>Сколько времени занимает оформление карточки?</summary>
                <p>Обычно от заявки до публикации проходит несколько дней — зависит от того, нужна ли выездная съёмка и панорама.</p>
              </details>
              <details className="faq-item">
                <summary>Нужно ли мне самому что-то делать?</summary>
                <p>С вашей стороны — впустить нас на съёмку и подтвердить финальные тексты. Всё оформление, публикацию и настройку берём на себя.</p>
              </details>
              <details className="faq-item">
                <summary>У меня уже есть карточка, но она старая. Это ок?</summary>
                <p>Да, это самый частый случай. Проведём аудит текущей карточки, обновим фото, описание и режим работы, а не будем создавать дубль.</p>
              </details>
              <details className="faq-item">
                <summary>Панораму сложно снимать, нужно закрывать заведение?</summary>
                <p>Нет, съёмка занимает от 30 минут до пары часов в зависимости от площади и обычно проходит без остановки работы.</p>
              </details>
              <details className="faq-item">
                <summary>Как быстро будет заметен результат в поиске?</summary>
                <p>Зависит от ниши и конкуренции в районе — обычно позиции подтягиваются в течение нескольких недель после публикации и начала продвижения.</p>
              </details>
              <details className="faq-item">
                <summary>Что если с карточкой уже есть проблема — блокировка, модерация?</summary>
                <p>Разберёмся отдельно на созвоне: часто это решается корректным заполнением карточки и подтверждением прав на организацию.</p>
              </details>
            </div>
          </div>
        </section>

        {/* ============ FINAL CTA ============ */}
        <section className="section final" id="form">
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">Готовы начать?</span>
              <h2>Оставьте заявку — перезвоним и посчитаем цену под ваш бизнес</h2>
            </div>

            <LeadForm />

            <p className="form-note">Оставляя заявку, вы соглашаетесь на связь по указанному телефону.</p>
          </div>
        </section>
      </main>

      <footer>
        <div className="container">
          <span className="plate plate--sm" style={{ margin: "0 auto" }}>
            <span className="plate__stripe">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
                <circle cx="12" cy="9.5" r="2.3" />
              </svg>
            </span>
            <span className="plate__body">
              КАРТЫ&nbsp;<span className="plate__num">05</span>
            </span>
          </span>
          <p>Оформление и продвижение карточек на Яндекс Картах и 2ГИС · Махачкала, Дагестан</p>
        </div>
      </footer>
    </>
  );
}

function LeadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nameInvalid, setNameInvalid] = useState(false);
  const [phoneInvalid, setPhoneInvalid] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
    const phone = (form.elements.namedItem("phone") as HTMLInputElement).value.trim();
    const company = (form.elements.namedItem("company") as HTMLInputElement).value;
    const phoneOk = phone.replace(/\D/g, "").length >= 10;

    setNameInvalid(!name);
    setPhoneInvalid(!phoneOk);
    setError(null);

    if (!name || !phoneOk) return;

    setSending(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, company }),
      });
      const data = await res.json();
      if (data.ok) {
        setSent(true);
      } else {
        setError(data.error || "Не получилось отправить заявку. Попробуйте ещё раз.");
      }
    } catch {
      setError("Не получилось отправить заявку. Проверьте связь и попробуйте ещё раз.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className={`form-card reveal${sent ? " is-sent" : ""}`} id="formCard">
      <form id="leadForm" noValidate ref={formRef} onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="name">Имя</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Как к вам обращаться"
            required
            disabled={sending}
            style={nameInvalid ? { borderColor: "#D9634F" } : undefined}
            onInput={() => setNameInvalid(false)}
          />
        </div>
        <div className="field">
          <label htmlFor="phone">Телефон</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="+7 900 000-00-00"
            required
            disabled={sending}
            style={phoneInvalid ? { borderColor: "#D9634F" } : undefined}
            onInput={() => setPhoneInvalid(false)}
          />
        </div>
        {/* honeypot — скрыто от пользователей, ловит ботов */}
        <div className="hp-field" aria-hidden="true">
          <label htmlFor="company">Компания</label>
          <input type="text" id="company" name="company" tabIndex={-1} autoComplete="off" />
        </div>
        <button type="submit" className="btn btn-primary btn-block" disabled={sending}>
          {sending ? "Отправляем…" : "Отправить заявку"}
        </button>
        <div className={`form-error${error ? " show" : ""}`}>{error}</div>
      </form>
      <div className="form-success" id="formSuccess">
        Заявка отправлена ✓<br />
        <span style={{ fontFamily: "var(--font-b)", fontWeight: 400, color: "var(--muted-dark)", fontSize: "14px" }}>
          Свяжемся с вами в течение дня
        </span>
      </div>
    </div>
  );
}
