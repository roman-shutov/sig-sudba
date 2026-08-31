'use client';

import { useState } from 'react';
import { ArrowRight, BookOpen, CircleUserRound, Sparkles } from 'lucide-react';

type Screen = 'home' | 'topic' | 'digits' | 'loading' | 'result' | 'steps' | 'step';

const stepNames = ['Код судьбы', 'Физическая энергия', 'Интеллект', 'Творчество', 'Карьера и воля', 'Духовные практики', 'Код личности', 'Тёмные качества', 'Пограничное состояние', 'Чистый лист', 'Родовые программы', 'Зеркальная дверь'];
const stepColors = ['#ef4b3e','#f28b35','#f3cb46','#55bd64','#3cb7a7','#489ed2','#4768bd','#7750a4','#8d674b','#b6b8bb','#e979a9','#72c474'];

const directions = [
  { id: 'self', number: '01', title: 'Жизненный путь', eyebrow: 'КТО Я', text: 'Увидеть свои сильные стороны, точки роста и направление.', color: '#e5b94f' },
  { id: 'love', number: '02', title: 'Взаимоотношения', eyebrow: 'ТЫ И Я', text: 'Исследовать связь, взаимодействие и общий вектор пары.', color: '#df7075' },
  { id: 'child', number: '03', title: 'Ребёнок', eyebrow: 'БЫТЬ РЯДОМ', text: 'Лучше понять таланты, особенности и потребности ребёнка.', color: '#62c6bc' },
];

function polar(cx: number, cy: number, r: number, angle: number) {
  const rad = (angle * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function Sigil({ compact = false }: { compact?: boolean }) {
  const colors = ['#f14b3e', '#ff8c2f', '#ffd54b', '#4dcc73', '#38b6c8', '#3d7edb', '#674db5', '#bb54bd'];
  return (
    <div className={`sigil ${compact ? 'sigil--compact' : ''}`} aria-hidden="true">
      <div className="sigil__halo" />
      <svg viewBox="0 0 320 320">
        <defs><filter id="goldGlow"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
        <circle cx="160" cy="160" r="144" className="sigil__outer" />
        {colors.map((color, index) => {
          const p1 = polar(160, 160, 125, index * 45 - 90);
          const p2 = polar(160, 160, 125, index * 45 - 45);
          return <path key={color} d={`M160 160 L${p1.x} ${p1.y} A125 125 0 0 1 ${p2.x} ${p2.y} Z`} fill={color} opacity=".86" />;
        })}
        <circle cx="160" cy="160" r="86" className="sigil__inner" />
        <g className="sigil__needle" filter="url(#goldGlow)">
          <path d="M160 24 179 141 160 160 141 141Z" /><path d="M296 160 179 179 160 160 179 141Z" />
          <path d="M160 296 141 179 160 160 179 179Z" /><path d="M24 160 141 141 160 160 141 179Z" />
        </g>
        <circle cx="160" cy="160" r="56" className="sigil__core" />
        <text x="160" y="171" textAnchor="middle" className="sigil__text">СИГ</text>
      </svg>
    </div>
  );
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>('home');
  const [sound, setSound] = useState(true);
  const [direction, setDirection] = useState(directions[0]);
  const [digits, setDigits] = useState<number[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  const chooseDirection = (item: (typeof directions)[number]) => { setDirection(item); setScreen('digits'); };
  const toggleDigit = (digit: number) => setDigits((current) => current.includes(digit) ? current.filter((n) => n !== digit) : current.length < 9 ? [...current, digit] : current);
  const buildCompass = () => {
    if (digits.length < 3) return;
    setScreen('loading');
    window.setTimeout(() => setScreen('result'), 2100);
  };
  return (
    <main className="game-shell">
      <div className="world" aria-hidden="true"><div className="world__image" /><div className="world__veil" /><div className="aurora" /><div className="stars stars--one" /><div className="stars stars--two" /></div>
      <header className="topbar">
        <button className="brand" onClick={() => setScreen('home')} aria-label="На главную"><Sigil compact /><span><b>СИСТЕМА</b><small>ИНДИВИДУАЛЬНОЙ ГЕОМЕТРИИ</small></span></button>
        <nav aria-label="Основная навигация"><button>О системе</button><button>Как это работает</button><button>Отзывы</button></nav>
        <div className="topbar__actions"><button className={`sound ${sound ? 'is-on' : ''}`} onClick={() => setSound(!sound)} aria-label="Включить или выключить звук"><i /><i /><i /></button><button className="account"><CircleUserRound size={18} /><span>Личный кабинет</span></button></div>
      </header>

      {screen === 'home' ? (
        <section className="hero screen-enter">
          <div className="hero__compass"><Sigil /><div className="orbit orbit--one" /><div className="orbit orbit--two" /></div>
          <div className="hero__copy">
            <p className="kicker"><span /> ПАЛИТРА СУДЬБЫ <span /></p>
            <h1>Твой компас<br /><em>уже внутри</em></h1>
            <p className="hero__lead">Увидь свой настоящий момент.<br />Найди направление. Пройди свой путь.</p>
            <div className="hero__actions"><button className="cta cta--primary" onClick={() => setScreen('topic')}><Sparkles size={20} /><span>Открыть компас</span><ArrowRight size={19} /></button><button className="cta cta--ghost"><BookOpen size={20} /><span>12 ступеней</span></button></div>
            <div className="hero__note"><i /> Первый компас — бесплатно</div>
          </div>
        </section>
      ) : screen === 'topic' ? (
        <section className="topic screen-enter">
          <button className="back" onClick={() => setScreen('home')}>← Назад</button>
          <div className="topic__heading"><p className="kicker"><span /> ШАГ 1 ИЗ 3 <span /></p><h2>Выбери, куда<br />направить внимание</h2><p>Система настроит компас на выбранную тему.</p></div>
          <div className="direction-grid">{directions.map((item) => <button key={item.id} onClick={() => chooseDirection(item)} className="direction-card" style={{ '--accent': item.color } as React.CSSProperties}><span className="direction-card__number">{item.number}</span><span className="direction-card__glyph"><i /><b>{item.number}</b></span><small>{item.eyebrow}</small><strong>{item.title}</strong><p>{item.text}</p><span className="direction-card__go">Выбрать <ArrowRight size={17} /></span></button>)}</div>
          <div className="progress-dots"><b /><i /><i /></div>
        </section>
      ) : screen === 'digits' ? (
        <section className="ritual screen-enter">
          <button className="back" onClick={() => setScreen('topic')}>← Назад</button>
          <div className="ritual__copy"><p className="kicker"><span /> ШАГ 2 ИЗ 3 <span /></p><h2>Выбери цифры,<br /><em>которые тебя зовут</em></h2><p>Не анализируй. Отметь от 3 до 9 цифр, которые первыми привлекли внимание.</p></div>
          <div className="number-orbit"><div className="number-orbit__core"><Sigil compact /><small>{direction.eyebrow}</small><b>{digits.length}<i>/9</i></b></div>{Array.from({length:12},(_,i)=>i+1).map((n,i)=><button key={n} onClick={()=>toggleDigit(n)} className={digits.includes(n)?'is-selected':''} style={{'--i':i,'--tone':stepColors[i]} as React.CSSProperties} aria-label={`Цифра ${n}`}>{n}</button>)}</div>
          <div className="chosen-line">{Array.from({length:9},(_,i)=><span key={i} className={digits[i]?'filled':''}>{digits[i] ?? '·'}</span>)}</div>
          <button className="cta cta--primary ritual__cta" disabled={digits.length<3} onClick={buildCompass}><Sparkles size={19}/><span>{digits.length<3?`Выбери ещё ${3-digits.length}`:'Собрать компас'}</span><ArrowRight size={18}/></button>
        </section>
      ) : screen === 'loading' ? (
        <section className="loading-screen screen-enter"><div className="loading-compass"><Sigil /><div className="scan-ring"/><div className="scan-ring scan-ring--two"/></div><p className="kicker"><span /> СИСТЕМА СОБИРАЕТ КОД <span /></p><h2>{digits.join(' · ')}</h2><div className="loading-steps"><span>Считываем вектор</span><span>Определяем баланс</span><span>Собираем компас</span></div></section>
      ) : screen === 'result' ? (
        <section className="result screen-enter"><button className="back" onClick={()=>setScreen('digits')}>← Изменить код</button><div className="result__visual"><Sigil /><div className="code-pills">{digits.map((n)=><i key={n}>{n}</i>)}</div></div><div className="result__content"><p className="kicker"><span /> КОМПАС НАСТОЯЩЕГО МОМЕНТ <span /></p><h2>Твоё внимание<br /><em>ищет новый вектор</em></h2><div className="insight-grid"><article className="plus"><b>+</b><span><small>СЕЙЧАС В ПЛЮСЕ</small><strong>Интуиция и готовность к движению</strong></span></article><article className="minus"><b>−</b><span><small>СЕЙЧАС В МИНУСЕ</small><strong>Нетерпение и желание ускорить ответ</strong></span></article><article className="focus"><b>↗</b><span><small>КУДА НАПРАВЛЕНО</small><strong>На выбор между привычным и новым</strong></span></article><article className="attention"><b>!</b><span><small>ТРЕБУЕТ ВНИМАНИЯ</small><strong>Свой ритм и реальные ресурсы</strong></span></article></div><p className="demo-note">Демонстрационная интерпретация — алгоритм автора будет подключён позже.</p><div className="result__actions"><button className="cta cta--primary" onClick={()=>setScreen('steps')}><span>Перейти к 12 ступеням</span><ArrowRight size={18}/></button><button className="cta cta--ghost">Задать вопрос</button></div></div></section>
      ) : screen === 'steps' ? (
        <section className="steps-screen screen-enter"><button className="back" onClick={()=>setScreen('result')}>← К компасу</button><div className="steps-heading"><p className="kicker"><span /> ПУТЬ К СЕБЕ <span /></p><h2>12 ступеней</h2><p>Открывай главы постепенно или исследуй весь маршрут.</p></div><div className="steps-wheel"><div className="steps-wheel__center"><Sigil compact/><b>{direction.eyebrow}</b><small>{digits.join(' · ')}</small></div>{stepNames.map((name,i)=><button key={name} onClick={()=>{setActiveStep(i);setScreen('step')}} style={{'--i':i,'--tone':stepColors[i]} as React.CSSProperties}><i>{i+1}</i><span>{name}</span></button>)}</div><div className="steps-offer"><span>✦ Первая ступень открыта в деморежиме</span><button>Открыть весь путь</button></div></section>
      ) : (
        <section className="step-detail screen-enter" style={{'--tone':stepColors[activeStep]} as React.CSSProperties}><button className="back" onClick={()=>setScreen('steps')}>← Все ступени</button><div className="step-detail__mark"><span>{activeStep+1}</span><i/><i/><i/></div><div className="step-detail__copy"><p className="kicker"><span /> СТУПЕНЬ {activeStep+1} ИЗ 12 <span /></p><h2>{stepNames[activeStep]}</h2><p className="step-intro">Эта глава показывает, как выбранная энергия проявляется в твоей теме «{direction.title}».</p><div className="step-panels"><article><small>СИЛЬНАЯ СТОРОНА</small><strong>Способность замечать связи и находить неочевидный ход.</strong></article><article><small>ТОЧКА РОСТА</small><strong>Оставаться в контакте с реальностью и не торопить события.</strong></article><article><small>ВОПРОС К СЕБЕ</small><strong>Какой один шаг я могу сделать сегодня без давления на себя?</strong></article></div><p className="demo-note">Текст ступени демонстрационный и будет заменён авторской методикой.</p><button className="cta cta--primary" onClick={()=>{setActiveStep((activeStep+1)%12);}}><span>Следующая ступень</span><ArrowRight size={18}/></button></div></section>
      )}
      <footer className="footerline"><span>© 2026 СИГ</span><span>Авторская система саморефлексии</span></footer>
    </main>
  );
}
