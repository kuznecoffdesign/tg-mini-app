import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, Cube, Database, Package, PaperPlaneTilt, ShoppingBag, UserCircle } from '@phosphor-icons/react';
import { publicPath } from './paths.js';

export function Reveal({children, className = ''}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      el.dataset.visible = 'true';
      return;
    }
    el.dataset.motion = 'ready';
    el.dataset.visible = 'false';
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      requestAnimationFrame(() => { el.dataset.visible = 'true'; });
      observer.disconnect();
    }, {threshold: .06, rootMargin: '0px 0px -7% 0px'});
    observer.observe(el); return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

export function WorkspacePanel({compact = false}) {
  const [active, setActive] = useState('Заказы');
  const items = ['Заказы','Каталог','Клиенты'];
  return <div className={`workspace-panel ${compact ? 'is-compact' : ''}`}>
    <aside className="workspace-sidebar"><b><Cube size={18}/> Поставка</b><span>Рабочее пространство</span>{items.map((name,i)=><button key={name} className={active===name?'selected':''} onClick={()=>setActive(name)}>{i===0?<ShoppingBag size={16}/>:i===1?<Package size={16}/>:<UserCircle size={16}/>} {name}</button>)}<div className="workspace-connection"><i/> Telegram подключён</div></aside>
    <div className="workspace-main"><div className="workspace-toolbar"><span>Поставка <span className="muted">/ {active}</span></span><span className="panel-concept">Концепт</span></div><div className="workspace-heading"><h3>{active==='Заказы'?'Заказы из Telegram':active==='Каталог'?'Каталог товаров':'Клиенты'}</h3><span className="workspace-count">{active==='Заказы'?'Все заказы · 4':active==='Каталог'?'Доступно для заказа':'Компании и контакты'}</span></div>
    <div className="workspace-table"><div className="table-labels"><span>{active==='Каталог'?'Наименование':active==='Клиенты'?'Компания':'Заказ'}</span><span>{active==='Заказы'?'Статус':'Данные'}</span><span>{active==='Каталог'?'Цена':'Обновлено'}</span></div>{(active==='Каталог'?[['Крафт-пакет','Упаковка','18 ₽'],['Термолента','Расходные материалы','96 ₽'],['Короб S','Упаковка','54 ₽'],['Пакет с клапаном','Упаковка','24 ₽']]:active==='Клиенты'?[['Север','Алексей','Сегодня'],['Точка','Мария','Сегодня'],['Мастерская','Анна','Вчера'],['Бюро','Дмитрий','Вчера']]:[['#1048 · Север','В доставке','Сейчас'],['#1047 · Точка','Согласован','12:42'],['#1046 · Мастерская','Собирается','11:20'],['#1045 · Бюро','Завершён','Вчера']]).map(([name,status,time],i)=><div className="workspace-row" key={name}><span><span className="row-symbol">{i===3?<Check size={14}/>:<Package size={14}/>}</span>{name}</span><span className={i===0?'blue-status':''}><i/>{status}</span><span>{time}</span></div>)}</div><div className="workspace-bottom"><Database size={15}/><span>Каталог, заказы и статусы в одной системе</span><Check size={15}/></div></div>
  </div>;
}

export function WireIllustration({variant=0}) {
  return <svg className={`wire-illustration wire-${variant}`} viewBox="0 0 360 270" fill="none" aria-hidden="true">
    {variant===0 ? [4,3,2,1,0].map((n)=><g key={n} className="wire-layer" style={{animationDelay:`${(4-n)*65}ms`}} transform={`translate(0 ${n*22})`}><path d="M76 81 180 27 284 81 180 137Z" fill="#0b0c0f"/><path d="M76 81v16l104 56 104-56V81M76 81l104 56 104-56M180 137v16"/><path d="m76 81 104-54 104 54"/>{n===0&&<path className="wire-blue" d="m153 76 19 10 38-20M150 96l30 16 30-16"/>}</g>) : variant===1 ? <><path className="wire-connector" d="M95 102 180 148 265 102M180 148v65"/>{[[45,35],[215,35],[130,145]].map(([x,y],i)=><g key={x} className="wire-layer" style={{animationDelay:`${i*65}ms`}} transform={`translate(${x} ${y})`}><path d="m0 30 50-26 50 26v57l-50 27L0 87Z" fill="#0b0c0f"/><path d="m0 30 50 27 50-27M50 57v57"/><path className={i===2?'wire-blue':''} d="m38 27 12-6 12 6-12 6Z"/></g>)}</> : [5,4,3,2,1,0].map(n=><g key={n} className="wire-layer" style={{animationDelay:`${(5-n)*65}ms`}} transform={`translate(${n*19} ${-n*10})`}><path d="M76 112q0-6 6-3l116 62q6 3 6 9v75q0 6-6 3L82 196q-6-3-6-9Z" fill="#0b0c0f"/><path d="m90 136 88 47m-88-32 62 33" className={n===0?'wire-blue':''}/></g>)}
  </svg>;
}

export function NewHero({cta,caseLink}) {return <section className="new-hero container"><Reveal><h1>Создаём продукты<br/>внутри Telegram<span>.</span></h1><div className="new-hero-summary"><p>Telegram Mini Apps и боты для магазинов, сервисов<br className="desktop-break"/> и внутренних продуктов. От сценария до работающей системы.</p><div className="new-hero-actions">{cta}{caseLink}</div></div></Reveal><Reveal className="hero-workspace"><WorkspacePanel/></Reveal></section>;}

export function ProductPrinciples(){return <section className="new-principles container"><Reveal><h2 className="statement"><strong>Привычный вход. Новые возможности.</strong> Продукт открывается прямо в Telegram — с данными и действиями, которые нужны пользователю.</h2></Reveal><div className="wire-columns">{[['Один понятный сценарий','От первого действия до результата. Проектируем интерфейс и диалог вокруг задачи пользователя.'],['Связь с вашим бизнесом','Mini App и бот обмениваются данными с рабочими системами через согласованные API.'],['Всё под рукой','История, документы и повторные действия доступны в приложении, а уведомления — в диалоге.']].map(([title,text],i)=><Reveal key={title} className="wire-column"><WireIllustration variant={i}/><h3>{title}</h3><p>{text}</p></Reveal>)}</div></section>;}

export function IntegrationFeature({link}){return <section className="new-feature container" id="capabilities"><Reveal className="split-heading"><h2>Интерфейс.<br/><span>И всё за ним.</span></h2><div><p>Пользователь оформляет заказ в Telegram. Команда получает его в своей системе. Статус возвращается в тот же диалог.</p>{link}</div></Reveal><Reveal className="integration-scene"><WorkspacePanel compact/><div className="message-panel"><div className="message-header"><PaperPlaneTilt size={19}/><b>Поставка</b><span>бот</span></div><div className="message-bubble"><span>Заказ №1048</span><h4>Заказ передан в доставку</h4><p>Состав, документы и статус —<br/>в вашем личном кабинете.</p><a href={publicPath("/cases/sever-supply")}>Открыть заказ <ArrowRight size={15}/></a></div><div className="message-delivered"><Check size={12}/> Статус обновлён</div></div></Reveal></section>;}
