import { useEffect, useRef, useState } from "react";
import { NewHero, ProductPrinciples, IntegrationFeature, Reveal } from './VisualSystem.jsx';
import { Formats, SolutionsList, Comparison, Pricing, ConceptPreview, JournalList, ServiceContent, ArticleContent, DataFlow } from './Solutions.jsx';
import { services, articles, extraMeta, publicOrigin } from './content.js';
import { logicalPath, publicPath } from './paths.js';
import {
  ArrowDownRight, ArrowLeft, ArrowRight, Buildings, Check, CheckCircle,
  CreditCard, Cube, Database, Desktop, List, LockKey, Moon, Package, PaperPlaneTilt,
  ShoppingBag, Storefront, Sun, UserCircle, X,
} from "@phosphor-icons/react";

const site = { name: "Mini Apps / Studio", baseUrl: publicOrigin, telegramUrl: "" };

export const meta = {
  ...extraMeta,
  "/": ["Разработка Telegram Mini Apps и ботов для бизнеса", "Создаём Telegram Mini Apps и ботов: магазины, личные кабинеты, сервисы и автоматизацию. От сценария пользователя до серверной логики и интеграций."],
  "/cases": ["Концепты Telegram Mini Apps — сценарии и интерфейсы", "Демонстрационные сценарии Telegram Mini Apps: магазин, заказ, личный кабинет и внутренний B2B-инструмент."],
  "/cases/sever-supply": ["Концепт B2B-кабинета в Telegram — Север.Снабжение", "Как может работать заказ расходных материалов, согласование и контроль статуса внутри Telegram Mini App."],
  "/services/telegram-commerce": ["Разработка магазина в Telegram для бизнеса", "Проектирование Telegram-магазина: каталог, корзина, оплата, статусы заказа и связь с учётной системой."],
  "/contact": ["Обсудить разработку Telegram Mini App или бота", "Расскажите о задаче: магазин, личный кабинет, сервис или автоматизация в Telegram. Уточним сценарий и подходящий формат разработки."],
  "/privacy": ["Политика конфиденциальности", "Как обрабатываются данные в демонстрационной версии сайта студии Telegram Mini Apps."],
};

const demoSteps = [
  { id: "entry", label: "Вход", title: "Начать без новой учётной записи", text: "Mini App получает данные пользователя из Telegram и открывает персональный сценарий." },
  { id: "catalog", label: "Каталог", title: "Найти нужное в знакомом интерфейсе", text: "Категории, поиск и карточки товара собраны под быстрый выбор с телефона." },
  { id: "cart", label: "Заказ", title: "Проверить заказ до оплаты", text: "Количество, адрес и итог видны на одном экране — без перехода на внешний сайт." },
  { id: "status", label: "Статус", title: "Следить за выполнением там же", text: "Изменения заказа возвращаются в Mini App и могут дублироваться сообщениями бота." },
  { id: "account", label: "Кабинет", title: "Повторить заказ и получить документы", text: "История, статусы и документы остаются под рукой внутри Telegram." },
];

function track(name, detail = {}) {
  window.dataLayer?.push({ event: name, ...detail });
  window.dispatchEvent(new CustomEvent("studio:analytics", { detail: { name, ...detail } }));
}

function navigate(path) {
  window.history.pushState({}, "", publicPath(path));
  window.dispatchEvent(new PopStateEvent("popstate"));
  const hash = path.includes("#") ? path.split("#")[1] : "";
  requestAnimationFrame(() => {
    if (hash) {
      document.getElementById(hash)?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
      return;
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  });
}

function Link({ href, children, className = "", onClick, ...props }) {
  const internal = href.startsWith("/");
  return <a href={publicPath(href)} className={className} onClick={(event) => {
    onClick?.(event);
    if (!event.defaultPrevented && internal && !event.metaKey && !event.ctrlKey) {
      event.preventDefault(); navigate(href);
    }
  }} {...props}>{children}</a>;
}

function PrimaryCta({ label = "Обсудить проект", className = "" }) {
  const href = site.telegramUrl || "/contact";
  return <Link href={href} className={`button button-primary ${className}`}
    target={site.telegramUrl ? "_blank" : undefined} rel={site.telegramUrl ? "noreferrer" : undefined}
    onClick={() => track("cta_click", { label, destination: site.telegramUrl ? "telegram" : "contact" })}>
    <span>{label}</span><ArrowDownRight size={18} weight="bold" className="cta-arrow" />
  </Link>;
}

function Brand() {
  return <Link href="/" className="brand" aria-label="Mini Apps Studio — главная">
    <span className="brand-mark" aria-hidden="true"><span /><span /><span /></span><span>{site.name}</span>
  </Link>;
}

const themeOptions = [
  { value: "light", label: "Светлая тема", Icon: Sun },
  { value: "system", label: "Системная тема", Icon: Desktop },
  { value: "dark", label: "Тёмная тема", Icon: Moon },
];

function ThemeSwitcher() {
  const [preference, setPreference] = useState(() => {
    if (typeof document !== "undefined") return document.documentElement.dataset.themePreference || "system";
    return "system";
  });

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const resolved = preference === "system" ? (media.matches ? "dark" : "light") : preference;
      document.documentElement.dataset.themePreference = preference;
      document.documentElement.dataset.theme = resolved;
      document.documentElement.style.colorScheme = resolved;
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", resolved === "dark" ? "#090b0c" : "#f5f7fb");
    };
    apply();
    localStorage.setItem("studio-theme", preference);
    if (preference === "system") media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [preference]);

  return <div className="theme-switcher" data-value={preference} role="group" aria-label="Цветовая тема">
    <span className="theme-switcher-indicator" aria-hidden="true" />
    {themeOptions.map(({ value, label, Icon }) => <button
      type="button"
      key={value}
      aria-label={label}
      aria-pressed={preference === value}
      title={label}
      onClick={() => setPreference(value)}
    ><Icon size={17} weight={preference === value ? "fill" : "regular"} /></button>)}
  </div>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const focusable = panelRef.current?.querySelectorAll("a, button");
    focusable?.[0]?.focus();
    const handleKey = (event) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "Tab" && focusable?.length) {
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKey);
    return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", handleKey); };
  }, [open]);
  const nav = <><Link href="/cases" onClick={() => setOpen(false)}>Кейсы</Link><Link href="/services" onClick={() => setOpen(false)}>Решения</Link><Link href="/#process" onClick={() => setOpen(false)}>Процесс</Link><Link href="/#pricing" onClick={() => setOpen(false)}>Стоимость</Link></>;
  return <header className="site-header"><div className="container header-inner"><Brand/><nav className="desktop-nav" aria-label="Основная навигация">{nav}</nav><ThemeSwitcher/><PrimaryCta className="header-cta"/><button className="icon-button menu-button" aria-label="Открыть меню" aria-expanded={open} onClick={() => setOpen(true)}><List size={24}/></button></div>
    {open && <div className="mobile-nav-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}><nav className="mobile-nav" aria-label="Мобильная навигация" ref={panelRef}><div className="mobile-nav-top"><Brand/><button className="icon-button" aria-label="Закрыть меню" onClick={() => setOpen(false)}><X size={22}/></button></div><div className="mobile-nav-links">{nav}</div><PrimaryCta/></nav></div>}
  </header>;
}

function Footer() {
  return <footer className="site-footer"><div className="container footer-grid"><div><Brand/><p>Mini Apps и боты для бизнеса внутри Telegram.</p></div><div className="footer-links"><span>Студия</span><Link href="/cases">Кейсы</Link><Link href="/#process">Процесс</Link><Link href="/#pricing">Стоимость</Link><Link href="/contact">Контакты</Link></div><div className="footer-links"><span>Решения</span><Link href="/services/telegram-mini-apps">Telegram Mini Apps</Link><Link href="/services/telegram-bots">Telegram-боты</Link><Link href="/services/telegram-commerce">Telegram-магазины</Link></div><div className="footer-links"><span>Материалы</span><Link href="/journal">Статьи</Link><Link href="/privacy">Конфиденциальность</Link></div></div><div className="container footer-bottom"><span>© 2026</span><span>Демонстрационная концепция</span></div></footer>;
}

function Layout({ children }) { return <><a className="skip-link" href="#content">К содержанию</a><Header/><main id="content">{children}</main><Footer/></>; }
function SectionIntro({ title, text }) { return <div className="section-intro"><h2>{title}</h2>{text && <p>{text}</p>}</div>; }

function DemoPhone({ step = "catalog", compact = false }) {
  const current = demoSteps.find((item) => item.id === step) || demoSteps[1];
  return <div className={`phone-shell ${compact ? "phone-compact" : ""}`} aria-label={`Демо-интерфейс: ${current.label}`}><div className="phone-top"><span>10:24</span><span className="phone-island"/><span>5G&nbsp; 86%</span></div><div className="telegram-bar"><ArrowLeft size={17}/><div><strong>Поставка</strong><small>Mini App</small></div><button aria-label="Закрыть демо"><X size={16}/></button></div><div className="phone-content" key={step}>{step === "entry" && <EntryScreen/>}{step === "catalog" && <CatalogScreen/>}{step === "cart" && <CartScreen/>}{step === "status" && <StatusScreen/>}{step === "account" && <AccountScreen/>}</div><div className="home-indicator"/></div>;
}

function EntryScreen() { return <div className="entry-screen"><div className="demo-logo"><Cube size={34} weight="duotone"/></div><span className="demo-kicker">Поставка</span><h3>Расходные материалы без звонков</h3><p>Откройте каталог и оформите заказ от имени вашей компании.</p><button className="demo-button"><PaperPlaneTilt size={17} weight="fill"/> Продолжить как Алексей</button><small><LockKey size={13}/> Данные защищены соединением</small></div>; }
function ProductCard({ name, price, tone }) { return <article className="product-card"><div className={`product-shape ${tone}`} aria-hidden="true"><Package size={28} weight="duotone"/></div><h4>{name}</h4><p>{price} · шт.</p><button aria-label={`Добавить ${name}`}>+</button></article>; }
function CatalogScreen() { return <div className="catalog-screen"><div className="demo-greeting"><div><small>Добрый день, Алексей</small><h3>Что закажем?</h3></div><UserCircle size={31} weight="duotone"/></div><div className="search-field">Поиск по каталогу <span>⌘K</span></div><div className="category-row"><button className="active">Всё</button><button>Упаковка</button><button>Офис</button></div><div className="product-grid"><ProductCard name="Крафт-пакет" price="18 ₽" tone="sand"/><ProductCard name="Термолента" price="96 ₽" tone="white"/><ProductCard name="Короб S" price="54 ₽" tone="orange"/></div><button className="mini-cart"><ShoppingBag size={17} weight="fill"/><span>Корзина</span><b>2 460 ₽</b></button></div>; }
function CartLine({ name, qty, price }) { return <div className="cart-line"><div className="tiny-product"><Package size={20}/></div><div><strong>{name}</strong><small>{qty}</small></div><b>{price}</b></div>; }
function CartScreen() { return <div className="cart-screen"><div className="demo-page-head"><button><ArrowLeft size={18}/></button><h3>Заказ</h3><span>2 позиции</span></div><CartLine name="Крафт-пакет" qty="100 шт." price="1 800 ₽"/><CartLine name="Термолента" qty="5 шт." price="480 ₽"/><div className="delivery-card"><span>Доставка</span><strong>Склад на Большой Дмитровке</strong><small>Завтра, 10:00–14:00</small></div><div className="total-line"><span>Итого</span><strong>2 460 ₽</strong></div><button className="demo-button">Перейти к оплате <ArrowRight size={17}/></button></div>; }
function StatusScreen() { return <div className="status-screen"><div className="success-orbit"><Check size={28} weight="bold"/></div><span className="demo-kicker">Заказ №1048</span><h3>Передан в доставку</h3><p>Курьер заберёт заказ со склада и привезёт завтра до 14:00.</p><div className="timeline"><div className="done"><i/><span><b>Заказ принят</b><small>Сегодня, 10:18</small></span></div><div className="done"><i/><span><b>Собран на складе</b><small>Сегодня, 12:42</small></span></div><div className="active"><i/><span><b>Передан курьеру</b><small>Ожидаем обновление</small></span></div><div><i/><span><b>Доставлен</b></span></div></div><button className="demo-secondary">Задать вопрос</button></div>; }
function AccountScreen() { return <div className="account-screen"><div className="profile-row"><div className="avatar">А</div><div><small>Компания</small><h3>ООО «Север»</h3></div></div><div className="balance-panel"><small>Заказы в работе</small><strong>2</strong><span>на сумму 18 420 ₽</span></div><div className="account-list"><button><Package size={20}/><span><b>История заказов</b><small>Повторить прошлую поставку</small></span><ArrowRight size={16}/></button><button><CreditCard size={20}/><span><b>Документы</b><small>Счета и закрывающие</small></span><ArrowRight size={16}/></button><button><Buildings size={20}/><span><b>Реквизиты</b><small>Компания и адреса</small></span><ArrowRight size={16}/></button></div></div>; }

function ProductDemo({ compact = false }) {
  const [step, setStep] = useState("catalog");
  const current = demoSteps.find((item) => item.id === step);
  return <div className={`product-demo ${compact ? "compact-demo" : ""}`}><div className="demo-copy"><div className="demo-tabs" role="tablist" aria-label="Состояния Mini App">{demoSteps.map((item) => <button key={item.id} role="tab" aria-selected={step === item.id} className={step === item.id ? "active" : ""} onClick={() => { setStep(item.id); track("demo_step", { step: item.id }); }}>{item.label}</button>)}</div><div className="demo-description" key={step}><span>{String(demoSteps.indexOf(current) + 1).padStart(2, "0")} / 05</span><h3>{current.title}</h3><p>{current.text}</p></div><div className="demo-progress" aria-hidden="true"><span style={{ width: `${((demoSteps.indexOf(current) + 1) / demoSteps.length) * 100}%` }}/></div></div><div className="demo-stage"><div className="stage-caption">Демо-интерфейс · Концепт Mini App</div><DemoPhone step={step} compact={compact}/><div className="stage-note note-one"><Database size={18}/><span>Статус обновлён</span></div><div className="stage-note note-two"><CheckCircle size={18}/><span>Данные переданы</span></div></div></div>;
}

function Hero() { return <section className="hero"><div className="container hero-grid"><div className="hero-copy"><span className="eyebrow">Telegram Mini Apps для бизнеса</span><h1>Продукт внутри Telegram. От первого экрана до рабочего сервиса.</h1><p>Магазины, личные кабинеты и внутренние инструменты: проектируем путь пользователя, интерфейс и связь с системами компании.</p><div className="hero-actions"><PrimaryCta/><Link href="/cases" className="text-link">Смотреть концепты <ArrowRight size={18}/></Link></div><small className="next-step">Опишите задачу — уточним сценарий и предложим формат следующего шага.</small></div><div className="hero-visual"><img src={publicPath("/images/hero-infrastructure.png")} width="1536" height="1024" alt="" aria-hidden="true"/><div className="hero-phone"><DemoPhone step="catalog" compact/></div><div className="hero-data-card"><span>Заказ №1048</span><b>Передан в систему</b><div><i/><i/><i/></div></div></div></div><div className="container hero-strip"><span>Сценарий</span><b>Выбор → заказ → оплата → статус</b><span>Всё в одном диалоге</span></div></section>; }

function Concepts() { return <section className="section concepts-section"><div className="container"><div className="section-row"><SectionIntro eyebrow="Концепты" title="Показываем продукт через сценарий."/><Link href="/cases" className="text-link">Все концепты <ArrowRight size={18}/></Link></div><div className="concept-stack"><Link href="/cases/sever-supply" className="concept concept-wide"><div className="concept-copy"><span className="tag">Концепт</span><h3>Север.Снабжение</h3><p>Заказ расходных материалов, согласование и контроль доставки для распределённой команды.</p><span className="concept-link">Разобрать сценарий <ArrowRight size={17}/></span></div><div className="concept-scene"><DemoPhone step="status" compact/><div className="order-panel"><small>Согласование</small><b>Одобрено</b><span><Check size={14}/> 12 позиций</span></div></div></Link><Link href="/services/telegram-commerce" className="concept concept-split"><div className="concept-art"><div className="catalog-mosaic"><ProductCard name="Крафт-пакет" price="18 ₽" tone="sand"/><ProductCard name="Термолента" price="96 ₽" tone="white"/><ProductCard name="Короб S" price="54 ₽" tone="orange"/></div></div><div className="concept-copy"><span className="tag">Концепт</span><h3>Каталог без лишнего перехода</h3><p>Пользователь выбирает, оплачивает и отслеживает заказ в одном Mini App.</p><span className="concept-link">Telegram-магазины <ArrowRight size={17}/></span></div></Link></div></div></section>; }

function Capabilities() {
  const items = [["01","Магазин","Каталог, корзина, оплата и статусы заказа."],["02","Личный кабинет","Данные, документы и повторяющиеся действия."],["03","Запись и бронь","Выбор услуги, времени и подтверждение."],["04","B2B-инструмент","Заявки, согласования и контроль процессов."],["05","Лояльность","Баланс, история операций и персональные предложения."],["06","AI-интерфейс","Помощник, который работает с контекстом продукта."]];
  return <section id="capabilities" className="section section-light"><div className="container"><SectionIntro eyebrow="Что можно создать" title="Не отдельное приложение. Нужное действие в привычном месте." text="Mini App подходит для повторяющихся сценариев, где важно быстро открыть сервис, выполнить действие и вернуться в диалог."/><div className="capability-list">{items.map(([n,t,d]) => <article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p><ArrowDownRight size={22}/></article>)}</div></div></section>;
}

function Journey() { return <section className="section journey-section"><div className="container"><SectionIntro eyebrow="Почему Telegram" title="Короткий путь от сообщения до действия." text="Ссылка на продукт приходит в диалоге, канале или боте. Пользователь открывает Mini App и продолжает без установки ещё одного приложения."/><div className="journey-map"><div className="journey-node active"><PaperPlaneTilt size={24} weight="fill"/><span>Сообщение</span></div><div className="journey-line"><i/><small>один контекст</small></div><div className="journey-node main"><Cube size={30} weight="duotone"/><span>Mini App</span></div><div className="journey-line"><i/><small>одно действие</small></div><div className="journey-node"><CheckCircle size={24} weight="duotone"/><span>Результат</span></div></div></div></section>; }

function Integrations() {
  const systems = [[Database,"CRM"],[Buildings,"Учёт"],[CreditCard,"Оплата"],[Cube,"Внутренний API"]];
  return <section className="section integrations-section"><div className="container integration-grid"><SectionIntro eyebrow="Связь с бизнесом" title="Интерфейс в Telegram, данные — там, где работает команда." text="Архитектуру проектируем вокруг существующих процессов: заявки, оплаты и статусы могут передаваться в рабочие системы без ручного переноса."/><div className="architecture"><div className="architecture-core"><PaperPlaneTilt size={22} weight="fill"/><span>Telegram</span><div className="core-app"><Cube size={25}/><b>Mini App</b></div></div><div className="architecture-lines" aria-hidden="true"><i/><i/><i/><i/></div><div className="system-grid">{systems.map(([Icon,name]) => <div key={name}><Icon size={21}/><span>{name}</span></div>)}</div><small>Конкретный состав интеграций определяется после разбора вашей системы.</small></div></div></section>;
}

function Process() {
  const items = [["01","Разбираемся","Фиксируем пользователя, задачу, основной сценарий и критерий результата."],["02","Проектируем","Определяем, где нужен Mini App, где бот и как они связаны с вашими системами."],["03","Разрабатываем","Создаём интерфейс, серверную часть, бота и согласованные интеграции."],["04","Запускаем","Тестируем сценарии, подключаем аналитику событий и выпускаем продукт."]];
  return <section id="process" className="section process-section"><div className="container"><SectionIntro eyebrow="От задачи до релиза" title="Сначала — логика продукта. Затем — код."/><div className="process-list">{items.map(([n,t,d]) => <article key={n}><span>{n}</span><div><h3>{t}</h3><p>{d}</p></div></article>)}</div><div className="process-cta"><p>На старте достаточно описать задачу своими словами.</p><PrimaryCta label="Рассказать о задаче"/></div></div></section>;
}

function Principles() { return <section className="section principles-section"><div className="container"><SectionIntro eyebrow="Как принимаем решения" title="Интерфейс, разработка и бизнес-процесс — одна система."/><div className="principle-grid"><article className="principle-lead"><span>01</span><h3>Проектируем сценарий до экранов</h3><p>Сначала определяем, откуда приходит пользователь, какое действие выполняет и что получает в результате.</p><div className="logic-chain"><i>Вход</i><ArrowRight/><i>Действие</i><ArrowRight/><i>Результат</i></div></article><article><span>02</span><h3>Показываем прогресс</h3><p>Регулярные демонстрации делают решения видимыми до релиза.</p></article><article><span>03</span><h3>Учитываем Telegram</h3><p>Навигация, темы, системные кнопки и возврат в чат работают как единый опыт.</p></article></div></div></section>; }

const faqs = [
  ["Что выбрать — Telegram-бот или Mini App?", "Для заявки, анкеты или уведомлений часто достаточно бота. Для каталога, календаря, кабинета и сложной навигации нужен интерфейс Mini App. Выбор зависит от действия пользователя, а не от названия технологии."],
  ["Можно использовать бот и Mini App вместе?", "Да. Mini App отвечает за интерфейс, а бот — за вход и сообщения. Например, заказ оформляется в приложении, а изменение статуса приходит в диалог после разрешённого взаимодействия пользователя с ботом."],
  ["Когда Mini App подходит лучше обычного сайта?", "Когда пользователь приходит из Telegram, сценарий повторяется, а сервису нужен доступ к контексту диалога или уведомлениям. Для сложных публичных каталогов с поисковым трафиком может понадобиться и обычный сайт."],
  ["Из чего складывается стоимость?", "Из объёма сценариев, числа ролей, сложности интерфейса, серверной логики и интеграций. Оценка появляется после короткого разбора задачи — публиковать универсальную цену без контекста было бы неточно."],
  ["Можно подключить CRM и учётную систему?", "Да, если система предоставляет подходящий API или другой согласованный способ обмена. Состав данных, частоту синхронизации и обработку ошибок фиксируем до разработки."],
  ["Что нужно подготовить на старте?", "Достаточно задачи, понимания пользователей и описания текущего процесса. Контент, роли, ограничения и интеграции уточняются в ходе проектирования."],
  ["Как проходит запуск?", "Проверяем основные устройства и темы Telegram, настраиваем окружение, аналитику событий и план отката. После релиза наблюдаем за ключевыми шагами сценария."],
  ["Можно развивать продукт после запуска?", "Да. Новые сценарии удобнее добавлять по данным использования и обратной связи, сохраняя целостность интерфейса и архитектуры."],
];

function Faq() { return <section className="section faq-section"><div className="container faq-grid"><SectionIntro eyebrow="Вопросы" title="Что важно понять до старта."/><div className="faq-list">{faqs.map(([q,a],i) => <details key={q} open={i === 0}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div></div></section>; }
function FinalCta() { return <section className="final-cta"><div className="container"><div className="final-cta-inner"><h2>Расскажите, что пользователь должен сделать внутри Telegram.</h2><p>Разберём задачу, предложим формат — Mini App, бот или связку — и определим, что нужно для оценки сроков и бюджета.</p><PrimaryCta/><p className="format-note">Техническое задание на старте не требуется.</p></div></div></section>; }
function HomePage() { return <Layout><NewHero cta={<PrimaryCta/>} caseLink={<Link href="/cases" className="text-link">Смотреть проекты <ArrowRight size={16}/></Link>}/><Formats/><ProductPrinciples/><IntegrationFeature link={<Link href="/journal/mini-app-or-bot" className="text-link">Как связаны Mini App и бот <ArrowRight size={16}/></Link>}/><div className="container"><Reveal className="motion-flow"><DataFlow/></Reveal></div><Reveal><section className="section demo-section"><div className="container"><div className="split-heading"><h2>Продукт в действии<span>.</span></h2><p>От открытия до повторного заказа. Один сценарий объединяет Mini App, серверную часть и бота.</p></div><ProductDemo/></div></section></Reveal><SolutionsList/><ConceptPreview/><Comparison/><Pricing/><Reveal><Process/></Reveal><Reveal><Faq/></Reveal><JournalList/><Reveal><FinalCta/></Reveal></Layout>; }

function Breadcrumbs({ items }) { return <nav className="breadcrumbs" aria-label="Хлебные крошки"><Link href="/">Главная</Link>{items.map((item) => <span key={item.label}><ArrowRight size={13}/>{item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}</span>)}</nav>; }
function InnerHero({ eyebrow, title, text, children }) { return <section className="inner-hero"><div className="container"><Breadcrumbs items={children || []}/><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{text}</p></div></section>; }

function CasesPage() { return <Layout><InnerHero eyebrow="Концепты" title="Сценарии Mini Apps — от задачи до интерфейса." text="Пока без вымышленных клиентов и метрик. Здесь — демонстрационные продукты, на которых виден способ мышления команды.">{[{ label: "Кейсы" }]}</InnerHero><section className="section cases-index"><div className="container"><div className="case-index-row"><Link href="/cases/sever-supply" className="case-index-copy"><span className="tag">Концепт · B2B</span><h2>Север.Снабжение</h2><p>Заявка на материалы, согласование ответственным, доставка и документы в одном Mini App.</p><span className="text-link">Открыть разбор <ArrowRight size={18}/></span></Link><div className="case-index-visual"><DemoPhone step="status" compact/></div></div><div className="case-index-row reverse"><div className="case-index-copy"><span className="tag">Концепт · Commerce</span><h2>Каталог в Telegram</h2><p>Мобильная витрина, заказ и статусы — для аудитории, которая уже взаимодействует с бизнесом в Telegram.</p><Link href="/services/telegram-commerce" className="text-link">Открыть направление <ArrowRight size={18}/></Link></div><div className="case-index-visual lime"><DemoPhone step="catalog" compact/></div></div></div></section><FinalCta/></Layout>; }

function CasePage() { return <Layout><InnerHero eyebrow="Концепт · B2B-инструмент" title="Снабжение без таблиц в переписке." text="Демонстрационный Mini App для команд, которые регулярно заказывают расходные материалы и согласуют поставки.">{[{label:"Кейсы",href:"/cases"},{label:"Север.Снабжение"}]}</InnerHero><section className="case-cover"><div className="container"><div className="case-cover-copy"><span>Роль команды</span><b>Продуктовый сценарий, UX/UI, разработка</b><span>Статус</span><b>Концепт, не клиентский проект</b></div><div className="case-cover-stage"><DemoPhone step="cart" compact/><div className="approval-card"><small>Согласование</small><b><CheckCircle size={18}/> Одобрено</b><span>Анна · руководитель отдела</span></div></div></div></section><section className="section case-story"><div className="container story-grid"><aside><span>01</span><h2>Контекст</h2></aside><div><h3>Запрос начинается в чате, а учёт продолжается отдельно.</h3><p>В демонстрационном сценарии сотрудник собирает заявку на регулярные материалы. Руководитель проверяет состав, после чего данные уходят в систему поставщика.</p><p>Задача Mini App — сохранить привычный вход через Telegram и убрать ручной перенос списка между сообщениями, таблицей и учётной системой.</p></div></div><div className="container story-grid"><aside><span>02</span><h2>Путь пользователя</h2></aside><div><div className="flow-steps"><span>Открывает каталог</span><ArrowRight/><span>Собирает заявку</span><ArrowRight/><span>Получает согласование</span><ArrowRight/><span>Следит за доставкой</span></div></div></div><div className="container story-grid"><aside><span>03</span><h2>Решение</h2></aside><div><h3>Каждой роли — только нужное действие.</h3><p>Сотрудник работает с каталогом и историей заказов. Руководитель видит состав заявки и подтверждает её. Статусы и документы возвращаются в личный кабинет.</p><ProductDemo compact/></div></div><div className="container story-grid"><aside><span>04</span><h2>Что проверяем</h2></aside><div className="learning-list"><p><CheckCircle/> Понятен ли состав заказа до отправки.</p><p><CheckCircle/> Видно ли, кто и когда согласовал заявку.</p><p><CheckCircle/> Можно ли повторить типовую поставку без сборки с нуля.</p><p><CheckCircle/> Возвращаются ли ошибки интеграции в понятном виде.</p></div></div></section><FinalCta/></Layout>; }

function ServicePage() { return <Layout><InnerHero eyebrow="Основное направление" title="Магазин в Telegram — от каталога до повторного заказа." text="Проектируем Telegram Mini App для продаж: интерфейс, серверную логику и обмен данными с рабочими системами.">{[{label:"Услуги"},{label:"Telegram-магазины"}]}</InnerHero><section className="service-stage"><div className="container"><ProductDemo/></div></section><section className="section service-content"><div className="container service-grid"><SectionIntro eyebrow="Сценарий" title="Покупатель остаётся в диалоге, заказ — в вашей системе."/><div className="service-points"><article><span>01</span><h3>Витрина под мобильный выбор</h3><p>Категории, поиск, карточки и варианты товара — без переноса desktop-магазина в узкий экран.</p></article><article><span>02</span><h3>Заказ и оплата</h3><p>Корзина, адрес, способ получения и платёжный шаг собираются в короткую последовательность.</p></article><article><span>03</span><h3>Статусы после покупки</h3><p>Покупатель видит прогресс и может вернуться к заказу из сообщения в Telegram.</p></article><article><span>04</span><h3>Связь с учётом</h3><p>Состав заказа и изменения статуса передаются через согласованный интерфейс обмена.</p></article></div></div></section><Journey/><Process/><Faq/><FinalCta/></Layout>; }

function ContactForm() {
  const [state, setState] = useState("idle"), [errors, setErrors] = useState({});
  const submit = (event) => {
    event.preventDefault(); const data = new FormData(event.currentTarget), next = {};
    if (!data.get("name")?.trim()) next.name = "Укажите имя";
    if (!data.get("contact")?.trim()) next.contact = "Оставьте Telegram, телефон или почту";
    if (!data.get("task")?.trim()) next.task = "Коротко опишите задачу";
    if (!data.get("consent")) next.consent = "Нужно согласие на обработку данных";
    setErrors(next); if (Object.keys(next).length) { setState("error"); return; }
    setState("loading"); setTimeout(() => { setState("success"); track("form_submit", { status: "demo_success" }); }, 650);
  };
  if (state === "success") return <div className="form-success" role="status"><CheckCircle size={34} weight="duotone"/><h2>Запрос сохранён в демо.</h2><p>В этой концептуальной версии данные никуда не отправляются. После подключения реального канала связи форма сможет передавать обращения команде.</p><button className="button button-secondary" onClick={() => setState("idle")}>Заполнить снова</button></div>;
  return <form className="contact-form" onSubmit={submit} noValidate><div className="field"><label htmlFor="name">Имя</label><input id="name" name="name" autoComplete="name" aria-invalid={!!errors.name}/>{errors.name && <span className="field-error">{errors.name}</span>}</div><div className="field"><label htmlFor="contact">Как с вами связаться</label><input id="contact" name="contact" placeholder="@username, телефон или почта" aria-invalid={!!errors.contact}/>{errors.contact && <span className="field-error">{errors.contact}</span>}</div><div className="field"><label htmlFor="task">Что должен делать продукт</label><textarea id="task" name="task" rows="5" placeholder="Например: показать каталог, принять заказ и передать его в учётную систему" aria-invalid={!!errors.task}/>{errors.task && <span className="field-error">{errors.task}</span>}</div><label className="checkbox"><input type="checkbox" name="consent"/><span><Check size={13}/></span><em>Согласен на обработку данных по политике конфиденциальности</em></label>{errors.consent && <span className="field-error">{errors.consent}</span>}<button className="button button-primary" disabled={state === "loading"}>{state === "loading" ? <><span className="spinner"/>Отправляем</> : <>Отправить запрос <ArrowRight size={18}/></>}</button>{state === "error" && <p className="form-error" role="alert">Проверьте отмеченные поля.</p>}</form>;
}

function ContactPage() { return <Layout><InnerHero eyebrow="Контакты" title="Начнём с задачи, а не со списка технологий." text="Опишите, что пользователь должен сделать внутри Telegram. Уточним контекст и предложим следующий шаг.">{[{label:"Контакты"}]}</InnerHero><section className="section contact-section"><div className="container contact-grid"><div className="contact-aside"><span className="eyebrow">После обращения</span><ol><li><span>01</span>Разберём пользователей и сценарий.</li><li><span>02</span>Уточним ограничения и системы.</li><li><span>03</span>Предложим формат следующего шага.</li></ol><p>Форма работает в демонстрационном режиме и не отправляет данные.</p></div><ContactForm/></div></section></Layout>; }
function PrivacyPage() { return <Layout><InnerHero eyebrow="Документы" title="Политика конфиденциальности" text="Правила для текущей демонстрационной версии сайта.">{[{label:"Конфиденциальность"}]}</InnerHero><article className="legal container"><p className="legal-note">Обновлено 13 сентября 2026 года</p><h2>1. Что происходит с данными сейчас</h2><p>Форма на этом сайте работает как интерактивная демонстрация. Введённые имя, контакт и описание задачи не отправляются на сервер и не сохраняются после закрытия страницы.</p><h2>2. Аналитика интерфейса</h2><p>Сайт создаёт локальные события для демонстрации аналитики кликов и шагов продуктовой сцены. В текущей версии они не передаются внешним сервисам и не содержат введённый пользователем текст.</p><h2>3. Перед публикацией</h2><p>До подключения реальной формы, счётчика аналитики или Telegram-контакта политика должна быть обновлена данными оператора, перечнем сервисов, целями, сроками и правовыми основаниями обработки.</p><h2>4. Контакт оператора</h2><p>Контакт и реквизиты оператора будут добавлены после подтверждения владельцем сайта.</p></article></Layout>; }
function NotFoundPage() { return <Layout><section className="not-found container"><span>404</span><h1>Этой страницы нет.</h1><p>Возможно, адрес изменился или ссылка была набрана с ошибкой.</p><Link href="/" className="button button-primary"><ArrowLeft size={18}/>Вернуться на главную</Link></section></Layout>; }

function SolutionsPage() {return <Layout><InnerHero title="Mini Apps и боты. Под задачу бизнеса." text="Выбираем формат по действию пользователя: интерфейс для выбора и управления, диалог для заявок и уведомлений.">{[{label:'Решения'}]}</InnerHero><Formats/><SolutionsList full/><Comparison/><FinalCta/></Layout>}
function DirectionPage({slug}) {const item=services[slug];return <Layout><InnerHero title={item.title} text={item.lead}>{[{label:'Решения',href:'/services'},{label:slug==='telegram-bots'?'Telegram-боты':'Telegram Mini Apps'}]}</InnerHero><div className="container"><PrimaryCta/></div><ServiceContent slug={slug}/><FinalCta/></Layout>}
function JournalPage(){return <Layout><InnerHero title="Telegram с продуктовой стороны." text="Как выбрать формат, подготовить сценарий и связать продукт с процессами бизнеса.">{[{label:'Материалы'}]}</InnerHero><JournalList full/><FinalCta/></Layout>}
function ArticlePage({slug}){const item=articles[slug];return <Layout><InnerHero title={item.title} text={item.lead}>{[{label:'Материалы',href:'/journal'},{label:item.title}]}</InnerHero><ArticleContent slug={slug}/><JournalList/><FinalCta/></Layout>}

export function schemaFor(path) {
  const entry=meta[path]; if(!entry) return [];
  const base={'@context':'https://schema.org'};
  const result=[{...base,'@type':'WebPage',name:entry[0],description:entry[1],inLanguage:'ru',...(publicOrigin?{url:publicOrigin+path}:{})}];
  if (path==='/') result.push({...base,'@type':'FAQPage',mainEntity:faqs.map(([name,text])=>({'@type':'Question',name,acceptedAnswer:{'@type':'Answer',text}}))});
  const slug=path.split('/').pop();
  if(path.startsWith('/services/')&&services[slug]) result.push({...base,'@type':'Service',name:services[slug].title,description:services[slug].description});
  if(publicOrigin&&path!=='/') {
    const group=path.startsWith('/services/')?['Решения','/services']:path.startsWith('/journal/')?['Материалы','/journal']:path.startsWith('/cases/')?['Кейсы','/cases']:null;
    const crumbs=[['Главная','/'],...(group?[group]:[]),[entry[0],path]];
    result.push({...base,'@type':'BreadcrumbList',itemListElement:crumbs.map(([name,url],i)=>({'@type':'ListItem',position:i+1,name,item:publicOrigin+url}))});
  }
  return result;
}
function updateMeta(path) {
  const entry = meta[path] || ["Страница не найдена", "Запрошенная страница не существует."];
  document.title = entry[0]; document.querySelector('meta[name="description"]')?.setAttribute("content", entry[1]);
  document.querySelector('link[rel="canonical"]')?.setAttribute("href", `${site.baseUrl}${path}`);
  document.querySelector('meta[property="og:title"]')?.setAttribute("content", entry[0]);
  document.querySelector('meta[property="og:description"]')?.setAttribute("content", entry[1]);
  document.querySelector('meta[property="og:url"]')?.setAttribute('content', `${site.baseUrl}${path}`);
  document.querySelector('meta[name="robots"]')?.setAttribute('content',publicOrigin&&meta[path]&&path!=='/privacy'?'index, follow':'noindex, follow');
  const old=document.getElementById('page-schema');
  if(old) old.textContent=JSON.stringify(schemaFor(path));
}

export function App({initialPath}) {
  const [path, setPath] = useState(()=>initialPath || logicalPath(window.location.pathname));
  useEffect(() => { const onPop = () => setPath(logicalPath(window.location.pathname)); window.addEventListener("popstate", onPop); return () => window.removeEventListener("popstate", onPop); }, []);
  useEffect(() => updateMeta(path), [path]);
  const pages = { "/": HomePage, "/cases": CasesPage, "/cases/sever-supply": CasePage, "/services/telegram-commerce": ServicePage, "/contact": ContactPage, "/privacy": PrivacyPage, '/services':SolutionsPage, '/journal':JournalPage };
  const slug=path.split('/').pop();
  if(path==='/services/'+slug&&services[slug])return <DirectionPage slug={slug}/>;
  if(path==='/journal/'+slug&&articles[slug])return <ArticlePage slug={slug}/>;
  const Page = pages[path] || NotFoundPage; return <Page/>;
}

