import Image from "next/image";
import PanoramaViewer from "./PanoramaViewer";
import LeadForm from "./LeadForm";
import PageEffects from "./PageEffects";
import { FAQ } from "@/lib/faq";
import { OPERATOR } from "@/lib/operator";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#business`,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      url: `${SITE_URL}/`,
      image: `${SITE_URL}/opengraph-image.png`,
      logo: `${SITE_URL}/icon.svg`,
      email: OPERATOR.email,
      priceRange: "7 000 – 20 000 ₽",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Махачкала",
        addressRegion: "Республика Дагестан",
        addressCountry: "RU",
      },
      areaServed: [
        { "@type": "City", name: "Махачкала" },
        { "@type": "AdministrativeArea", name: "Республика Дагестан" },
      ],
      makesOffer: [
        { name: "Оформление карточки на Яндекс Картах и 2ГИС", price: 20000 },
        { name: "Панорама 360° (за точку)", price: 7000 },
        { name: "Продвижение и поддержка карточки (в месяц)", price: 9000 },
      ].map(({ name, price }) => ({
        "@type": "Offer",
        priceCurrency: "RUB",
        price,
        itemOffered: { "@type": "Service", name },
      })),
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
  ],
};

const SHOW_REVIEWS = false;

export default function Home() {
  return (
    <>
      <div className="topbar" id="topbar">
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <PageEffects />

      <main>
        {/* ============ HERO ============ */}
        <section className="hero" id="hero">
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
              <div className="frame__body frame__body--photo">
                <Image
                  src="/images/before-after/2gis-card.jpg"
                  alt="Карточка в 2ГИС до оформления"
                  width={419}
                  height={1131}
                  sizes="(max-width: 600px) 78vw, 420px"
                />
              </div>
            </div>
            <div className="frame frame--after">
              <div className="frame__label">Стало</div>
              <div className="frame__body frame__body--photo">
                <Image
                  src="/images/before-after/yandex-card.jpg"
                  alt="Карточка на Яндекс Картах после оформления"
                  width={863}
                  height={1822}
                  sizes="(max-width: 600px) 78vw, 420px"
                />
              </div>
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
                <p>Оставляете Telegram в форме ниже — пишем в течение дня.</p>
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
            <div className="pano-visual reveal">
              <PanoramaViewer src="/images/panorama/shop-360.jpg" />
            </div>
            <p className="reveal">Человек открывает карточку, крутит панораму пальцем и видит зал, стол, интерьер — и уже решает, ехать к вам или нет. Для кафе, стоматологий и салонов это часто решающий момент перед звонком.</p>
            <div className="pano-price reveal">Панорама 360° — <b>7 000 ₽</b><span>за точку</span></div>
            <a href="#form" className="btn btn-primary reveal">Заказать панораму</a>
          </div>
        </section>

        {/* ============ REVIEWS ============ */}
        {SHOW_REVIEWS && (
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
        )}

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
              {FAQ.map(({ q, a }) => (
                <details className="faq-item" key={q}>
                  <summary>{q}</summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ============ FINAL CTA ============ */}
        <section className="section final" id="form">
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">Готовы начать?</span>
              <h2>Оставьте заявку — напишем в Telegram и посчитаем цену под ваш бизнес</h2>
            </div>

            <LeadForm />

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
