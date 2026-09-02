'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft, ArrowRight, BookOpen, Check, ChevronRight, CircleUserRound,
  Clock3, Compass, CreditCard, Download, Heart, HelpCircle, Home as HomeIcon,
  Layers3, LockKeyhole, LogOut, Menu, Pause, Play, Plus, Printer,
  RotateCcw, Settings, ShieldCheck, Sparkles, UserRound, X,
} from 'lucide-react';

type Screen = 'home' | 'phrases' | 'digits' | 'loading' | 'result' | 'steps' | 'step' | 'pricing' | 'account';
type PhraseKind = 'move' | 'concern';
type AccountTab = 'overview' | 'codings' | 'compasses' | 'steps' | 'directions' | 'book' | 'profile';

const phraseGroups: Record<PhraseKind, { title: string; eyebrow: string; icon: string; phrases: string[] }> = {
  move: {
    title: 'Куда я движусь', eyebrow: 'МОЙ ВЕКТОР', icon: '↗',
    phrases: ['Я мечтаю', 'Я хочу', 'Я стремлюсь', 'Я создаю', 'Я ищу', 'Я выбираю', 'Я открываюсь', 'Я возвращаюсь', 'Я расту', 'Я меняюсь', 'Я направляюсь', 'Я нахожу свой путь'],
  },
  concern: {
    title: 'Что меня тревожит', eyebrow: 'МОЯ ТОЧКА ВНИМАНИЯ', icon: '◎',
    phrases: ['Я переживаю', 'Я боюсь', 'Я сомневаюсь', 'Я жду', 'Я не понимаю', 'Я хочу изменить', 'Я опустошён', 'Я закрываюсь', 'Я теряю себя', 'Я устал', 'Я застрял', 'Я не знаю, что делать'],
  },
};

const steps = [
  { name: 'Код судьбы', icon: '◆', color: '#ef5147' },
  { name: 'Физическая энергия', icon: '◒', color: '#f28d35' },
  { name: 'Интеллект', icon: '✦', color: '#eecb48' },
  { name: 'Творчество', icon: '❋', color: '#5fbd68' },
  { name: 'Карьера и воля', icon: '▲', color: '#40b5a6' },
  { name: 'Духовные практики', icon: '◈', color: '#4b9ed3' },
  { name: 'Код личности', icon: '●', color: '#526cc2' },
  { name: 'Тёмные качества', icon: '◐', color: '#7d55a5' },
  { name: 'Пограничное состояние', icon: '◌', color: '#92705c' },
  { name: 'Чистый лист', icon: '○', color: '#d4d7d8' },
  { name: 'Родовые программы', icon: '❀', color: '#e57aa4' },
  { name: 'Зеркальная дверь', icon: '◇', color: '#74c878' },
];

const accountNav: { id: AccountTab; label: string; icon: typeof HomeIcon }[] = [
  { id: 'overview', label: 'Главная', icon: HomeIcon },
  { id: 'codings', label: 'Мои кодировки', icon: Layers3 },
  { id: 'compasses', label: 'Компасы судьбы', icon: Compass },
  { id: 'steps', label: '12 ступеней', icon: Sparkles },
  { id: 'directions', label: 'Направления', icon: Heart },
  { id: 'book', label: 'Книга «Кто я»', icon: BookOpen },
  { id: 'profile', label: 'Настройки', icon: Settings },
];

function polar(cx: number, cy: number, radius: number, angle: number) {
  const rad = (angle * Math.PI) / 180;
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
}

function Sigil({ compact = false, numbered = false }: { compact?: boolean; numbered?: boolean }) {
  const colors = ['#ef5147', '#f28d35', '#eecb48', '#5fbd68', '#40b5a6', '#4b9ed3', '#526cc2', '#8b58a8'];
  return <div className={`sigil ${compact ? 'sigil--compact' : ''}`} aria-hidden="true">
    <div className="sigil__halo" />
    <svg viewBox="0 0 320 320">
      <defs><filter id="sigGlow"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
      <circle cx="160" cy="160" r="145" className="sigil__outer" /><circle cx="160" cy="160" r="128" className="sigil__ticks" />
      {colors.map((color, index) => { const p1 = polar(160, 160, 121, index * 45 - 90); const p2 = polar(160, 160, 121, index * 45 - 45); return <path key={color} d={`M160 160 L${p1.x} ${p1.y} A121 121 0 0 1 ${p2.x} ${p2.y} Z`} fill={color} opacity=".8" />; })}
      <circle cx="160" cy="160" r="87" className="sigil__inner" />
      <g className="sigil__needle" filter="url(#sigGlow)"><path d="M160 22 179 141 160 160 141 141Z" /><path d="M298 160 179 179 160 160 179 141Z" /><path d="M160 298 141 179 160 160 179 179Z" /><path d="M22 160 141 141 160 160 141 179Z" /></g>
      <circle cx="160" cy="160" r="55" className="sigil__core" /><text x="160" y="171" textAnchor="middle" className="sigil__text">СИГ</text>
    </svg>
    {numbered ? <><b className="sigil__number sigil__number--three">3</b><b className="sigil__number sigil__number--six">6</b><b className="sigil__number sigil__number--nine">9</b></> : null}
  </div>;
}

function Pill({ children }: { children: React.ReactNode }) { return <span className="pill">{children}</span>; }

export default function Home() {
  const shellRef = useRef<HTMLElement>(null);
  const [screen, setScreen] = useState<Screen>('home');
  const [phraseKind, setPhraseKind] = useState<PhraseKind>('move');
  const [selectedPhrase, setSelectedPhrase] = useState('');
  const [digits, setDigits] = useState<number[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [accountTab, setAccountTab] = useState<AccountTab>('overview');
  const [subscribed, setSubscribed] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notice, setNotice] = useState('');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'month' | 'year' | 'step'>('year');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const remembered = window.localStorage.getItem('sig-demo-state');
    if (!remembered) return;
    try {
      const data = JSON.parse(remembered) as { subscribed?: boolean; saved?: boolean; phrase?: string; digits?: number[] };
      setSubscribed(Boolean(data.subscribed)); setSaved(Boolean(data.saved));
      if (data.phrase) setSelectedPhrase(data.phrase);
      if (Array.isArray(data.digits)) setDigits(data.digits.slice(0, 9));
    } catch { /* use a clean local demo */ }
  }, []);
  useEffect(() => { window.localStorage.setItem('sig-demo-state', JSON.stringify({ subscribed, saved, phrase: selectedPhrase, digits })); }, [subscribed, saved, selectedPhrase, digits]);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const x = (event.clientX / window.innerWidth - .5) * 2;
        const y = (event.clientY / window.innerHeight - .5) * 2;
        shell.style.setProperty('--bg-x', `${(-x * 20).toFixed(1)}px`);
        shell.style.setProperty('--bg-y', `${(-y * 14).toFixed(1)}px`);
        shell.style.setProperty('--light-x', `${(x * 30).toFixed(1)}px`);
        shell.style.setProperty('--light-y', `${(y * 20).toFixed(1)}px`);
        shell.style.setProperty('--stars-x', `${(x * 14).toFixed(1)}px`);
        shell.style.setProperty('--stars-y', `${(y * 10).toFixed(1)}px`);
      });
    };
    const reset = () => ['--bg-x', '--bg-y', '--light-x', '--light-y', '--stars-x', '--stars-y'].forEach((name) => shell.style.setProperty(name, '0px'));
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('mouseleave', reset);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('pointermove', move); document.removeEventListener('mouseleave', reset); };
  }, []);

  const stepStatus = (index: number) => index === 0 && digits.length >= 3 ? 'done' : subscribed || index === 0 ? 'open' : 'locked';
  const completedCount = steps.filter((_, index) => stepStatus(index) === 'done').length;
  const hasCompass = digits.length >= 3 && Boolean(selectedPhrase);
  const showNotice = (message: string) => { setNotice(message); window.setTimeout(() => setNotice((current) => current === message ? '' : current), 3000); };
  const navigate = (next: Screen) => { setMobileMenu(false); setScreen(next); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const buildCompass = () => { if (digits.length < 3) return; setScreen('loading'); window.setTimeout(() => setScreen('result'), 1700); };
  const openStep = (index: number) => { setActiveStep(index); navigate(stepStatus(index) === 'locked' ? 'pricing' : 'step'); };
  const openAccount = (tab: AccountTab = 'overview') => { setAccountTab(tab); navigate('account'); };
  const toggleMusic = async () => {
    if (!audioRef.current) { audioRef.current = new Audio('/audio/endless-bell-01.mp3'); audioRef.current.loop = true; audioRef.current.volume = .22; }
    if (musicOn) audioRef.current.pause(); else await audioRef.current.play().catch(() => undefined);
    setMusicOn(!musicOn);
  };
  const accountTitle = accountNav.find((item) => item.id === accountTab)?.label ?? 'Личный кабинет';

  return <main ref={shellRef} className={`site-shell site-shell--${screen}`}>
    <div className="world" aria-hidden="true"><div className="world__image" /><div className="world__veil" /><div className="aurora" /><div className="stars" /></div>
    <header className="topbar">
      <button className="brand" onClick={() => navigate('home')} aria-label="На главную"><Sigil compact /><span><b>СИСТЕМА</b><small>ИНДИВИДУАЛЬНОЙ ГЕОМЕТРИИ</small></span></button>
      <nav className={mobileMenu ? 'is-open' : ''} aria-label="Основная навигация"><button onClick={() => navigate('home')}>Компас</button><button onClick={() => navigate('steps')}>12 ступеней</button><button onClick={() => showNotice('Раздел «О системе» готов к наполнению авторским текстом')}>О системе</button><button onClick={() => showNotice('Раздел с отзывами подготовлен к наполнению')}>Отзывы</button></nav>
      <div className="topbar__actions"><button className={`sound ${musicOn ? 'is-on' : ''}`} onClick={toggleMusic} aria-label={musicOn ? 'Выключить музыку' : 'Включить музыку'}>{musicOn ? <Pause size={15} /> : <Play size={15} />}</button><button className="account" onClick={() => openAccount()}><CircleUserRound size={18} /><span>Личный кабинет</span></button><button className="menu-button" onClick={() => setMobileMenu((open) => !open)} aria-label="Открыть меню">{mobileMenu ? <X /> : <Menu />}</button></div>
    </header>

    {screen === 'home' ? <section className="hero screen-enter">
      <div className="hero__compass">
        <div className="hero__portal" aria-hidden="true"><div className="hero__portal-image" /></div>
        <Sigil numbered /><div className="orbit orbit--one" /><div className="orbit orbit--two" />
      </div>
      <div className="hero__copy"><p className="eyebrow"><span /> ПАЛИТРА СУДЬБЫ <span /></p><h1>Открой путь<br /><em>внутрь себя</em></h1><p>Выбери то, что откликается. Услышь цифры из подсознания.<br />Получи компас настоящего момента.</p><div className="hero__actions"><button className="btn btn--primary" onClick={() => navigate('phrases')}><Sparkles size={18} /> Получить компас <ArrowRight size={18} /></button><button className="btn btn--ghost" onClick={() => navigate('steps')}><BookOpen size={18} /> 12 ступеней</button></div><div className="trust-line"><ShieldCheck size={15} /> Первый Компас бесплатно · без регистрации</div></div>
    </section> : null}

    {screen === 'phrases' ? <section className="flow-screen phrase-screen screen-enter">
      <button className="back-link" onClick={() => navigate('home')}><ArrowLeft size={16} /> На главную</button>
      <div className="flow-heading"><p className="eyebrow"><span /> ШАГ 1 ИЗ 2 <span /></p><h2>Что отзывается<br /><em>именно сейчас?</em></h2><p>Выберите одну фразу. Не ищите правильную — почувствуйте ту, которая ближе.</p></div>
      <div className="phrase-tabs" role="tablist">{(Object.keys(phraseGroups) as PhraseKind[]).map((kind) => <button key={kind} className={phraseKind === kind ? 'is-active' : ''} onClick={() => setPhraseKind(kind)} role="tab" aria-selected={phraseKind === kind}><i>{phraseGroups[kind].icon}</i><span><small>{phraseGroups[kind].eyebrow}</small>{phraseGroups[kind].title}</span></button>)}</div>
      <div className="phrase-grid">{phraseGroups[phraseKind].phrases.map((phrase, index) => <button key={phrase} className={selectedPhrase === phrase ? 'is-selected' : ''} onClick={() => setSelectedPhrase(phrase)}><span>{String(index + 1).padStart(2, '0')}</span><strong>{phrase}</strong>{selectedPhrase === phrase ? <Check size={17} /> : <ChevronRight size={16} />}</button>)}</div>
      <div className="sticky-action"><div>{selectedPhrase ? <>Вы выбрали: <strong>«{selectedPhrase}»</strong></> : 'Выберите одну фразу, чтобы продолжить'}</div><button className="btn btn--primary" disabled={!selectedPhrase} onClick={() => navigate('digits')}>Продолжить <ArrowRight size={18} /></button></div>
    </section> : null}

    {screen === 'digits' ? <section className="flow-screen digits-screen screen-enter">
      <button className="back-link" onClick={() => navigate('phrases')}><ArrowLeft size={16} /> К фразам</button>
      <div className="digits-layout"><div className="digits-copy"><p className="eyebrow"><span /> ШАГ 2 ИЗ 2 <span /></p><h2>Цифры из<br /><em>подсознания</em></h2><p>Минимум 3, максимум 9. Не задумывайтесь — нажимайте в том порядке, в котором они приходят.</p><div className="chosen-phrase"><small>ВАША ФРАЗА</small><strong>«{selectedPhrase}»</strong><button onClick={() => navigate('phrases')}>изменить</button></div></div>
      <div className="digit-ritual"><div className="digit-wheel"><div className="digit-wheel__center"><strong>{digits.length}</strong><small>ИЗ 9</small></div>{Array.from({ length: 9 }, (_, index) => index + 1).map((digit, index) => <button key={digit} onClick={() => digits.length < 9 && setDigits((current) => [...current, digit])} disabled={digits.length >= 9} style={{ '--i': index } as React.CSSProperties}>{digit}</button>)}</div><div className="digit-sequence" aria-live="polite">{Array.from({ length: 9 }, (_, index) => <span key={index} className={digits[index] ? 'is-filled' : ''}>{digits[index] ?? '·'}</span>)}</div><div className="digit-tools"><button onClick={() => setDigits((current) => current.slice(0, -1))} disabled={!digits.length}><RotateCcw size={15} /> Удалить последнюю</button><button onClick={() => setDigits([])} disabled={!digits.length}>Очистить</button></div><button className="btn btn--primary digit-submit" disabled={digits.length < 3} onClick={buildCompass}><Sparkles size={18} /> {digits.length < 3 ? `Выберите ещё ${3 - digits.length}` : 'Получить компас'} <ArrowRight size={18} /></button></div></div>
    </section> : null}

    {screen === 'loading' ? <section className="loading-screen screen-enter"><div className="loading-gate"><div className="loading-gate__image" /><Sigil numbered /></div><p className="eyebrow"><span /> ВРАТА ОТКРЫВАЮТСЯ <span /></p><h2>{digits.join(' · ')}</h2><div className="loading-progress"><i /><i /><i /></div><p>Считываем вектор · находим баланс · собираем Компас</p></section> : null}

    {screen === 'result' ? <section className="result-screen screen-enter"><button className="back-link" onClick={() => navigate('digits')}><ArrowLeft size={16} /> Изменить код</button><div className="result-visual"><div className="result-visual__gate" /><Sigil numbered /><div className="code-row">{digits.map((digit, index) => <i key={`${digit}-${index}`}>{digit}</i>)}</div></div><div className="result-copy"><p className="eyebrow"><span /> КОМПАС НАСТОЯЩЕГО МОМЕНТА <span /></p><Pill>{selectedPhrase}</Pill><h2>Ваше внимание<br /><em>ищет новый вектор</em></h2><div className="insight-grid"><Insight type="plus" mark="+" title="СЕЙЧАС В ПЛЮСЕ">Интуиция и готовность увидеть новые возможности</Insight><Insight type="minus" mark="−" title="СЕЙЧАС В МИНУСЕ">Нетерпение и желание получить ответ раньше времени</Insight><Insight type="focus" mark="↗" title="КУДА НАПРАВЛЕНО ВНИМАНИЕ">На выбор между привычным сценарием и новым опытом</Insight><Insight type="attention" mark="!" title="ТРЕБУЕТ ВНИМАНИЯ">Собственный ритм, границы и реальные ресурсы</Insight></div><p className="demo-note">Демонстрационная интерпретация. Авторская формула будет подключена на следующем этапе.</p><div className="result-actions"><button className="btn btn--primary" onClick={() => navigate('steps')}>Перейти к полной кодировке <ArrowRight size={18} /></button><button className="btn btn--ghost" onClick={() => { setSaved(true); showNotice('Компас сохранён в личном кабинете'); }}><Download size={17} /> {saved ? 'Сохранено' : 'Сохранить'}</button><button className="icon-action" onClick={() => window.print()} aria-label="Распечатать"><Printer size={18} /></button></div></div></section> : null}

    {screen === 'steps' ? <section className="steps-screen screen-enter"><button className="back-link" onClick={() => navigate(hasCompass ? 'result' : 'home')}><ArrowLeft size={16} /> {hasCompass ? 'К Компасу' : 'На главную'}</button><div className="steps-heading"><p className="eyebrow"><span /> ПУТЬ К СЕБЕ <span /></p><h2>12 ступеней</h2><p>Каждая дверь раскрывает отдельную грань вашей индивидуальной геометрии.</p></div><div className="steps-layout"><div className="steps-core"><div className="steps-core__image" /><Sigil numbered />{hasCompass ? <div className="steps-core__code">{digits.map((digit, index) => <i key={`${digit}-${index}`}>{digit}</i>)}</div> : null}</div><div className="step-grid">{steps.map((step, index) => { const status = stepStatus(index); return <button key={step.name} onClick={() => openStep(index)} className={`step-card is-${status}`} style={{ '--tone': step.color } as React.CSSProperties}><span className="step-card__number">{String(index + 1).padStart(2, '0')}</span><i className="step-card__icon">{step.icon}</i><strong>{step.name}</strong><small>{status === 'done' ? <><Check size={12} /> Пройдена</> : status === 'open' ? <>Открыта <ChevronRight size={12} /></> : <><LockKeyhole size={11} /> Закрыта</>}</small></button>; })}</div></div>{!subscribed ? <div className="access-banner"><div><Sparkles size={21} /><span><strong>Откройте полный путь</strong><small>Все 12 ступеней на месяц или на год</small></span></div><button className="btn btn--primary" onClick={() => navigate('pricing')}>Выбрать доступ <ArrowRight size={17} /></button></div> : <div className="access-banner access-banner--active"><div><ShieldCheck size={21} /><span><strong>Полный путь открыт</strong><small>Все 12 ступеней доступны в вашем темпе</small></span></div><button className="btn btn--ghost" onClick={() => openAccount('steps')}>Смотреть прогресс</button></div>}</section> : null}

    {screen === 'step' ? <section className="step-detail screen-enter" style={{ '--tone': steps[activeStep].color } as React.CSSProperties}><button className="back-link" onClick={() => navigate('steps')}><ArrowLeft size={16} /> Все ступени</button><div className="step-mark"><span>{steps[activeStep].icon}</span><b>{activeStep + 1}</b><i /><i /></div><div className="step-copy"><p className="eyebrow"><span /> СТУПЕНЬ {activeStep + 1} ИЗ 12 <span /></p><h2>{steps[activeStep].name}</h2><p className="step-lead">Эта глава показывает, как выбранная энергия проявляется в теме «{selectedPhrase || 'Мой путь'}».</p><div className="step-panels"><article><small>СИЛЬНАЯ СТОРОНА</small><strong>Способность видеть связи и находить неочевидный путь в знакомой ситуации.</strong></article><article><small>ТОЧКА РОСТА</small><strong>Оставаться в контакте с реальностью и не торопить внутренние процессы.</strong></article><article><small>ВОПРОС К СЕБЕ</small><strong>Какой один шаг я могу сделать сегодня без давления на себя?</strong></article></div><p className="demo-note">Текст ступени демонстрационный и будет заменён авторской расшифровкой.</p><div className="step-actions"><button className="btn btn--primary" onClick={() => openStep((activeStep + 1) % 12)}>Следующая ступень <ArrowRight size={18} /></button><button className="icon-action" onClick={() => window.print()}><Printer size={18} /></button></div></div></section> : null}

    {screen === 'pricing' ? <section className="pricing-screen screen-enter"><button className="back-link" onClick={() => navigate('steps')}><ArrowLeft size={16} /> К ступеням</button><div className="flow-heading"><p className="eyebrow"><span /> ВЫБЕРИТЕ СВОЙ ПУТЬ <span /></p><h2>Доступ к полной<br /><em>кодировке</em></h2><p>Проходите ступени постепенно и возвращайтесь к результатам в любое время.</p></div><div className="plan-grid"><PlanCard selected={selectedPlan === 'month'} onClick={() => setSelectedPlan('month')} icon={<Clock3 />} eyebrow="НА МЕСЯЦ" title="Все 12 ступеней">Полный доступ на 30 дней, архив результатов и печать.</PlanCard><PlanCard featured selected={selectedPlan === 'year'} onClick={() => setSelectedPlan('year')} icon={<Sparkles />} eyebrow="НА ГОД" title="Вся система СИГ">12 ступеней, новые кодировки и все обновления в течение года.</PlanCard><PlanCard selected={selectedPlan === 'step'} onClick={() => setSelectedPlan('step')} icon={<LockKeyhole />} eyebrow="ОДНА СТУПЕНЬ" title={steps[activeStep].name}>Постоянный доступ к выбранной главе и её результату.</PlanCard></div><div className="checkout-bar"><div><ShieldCheck /><span><small>ВЫБРАНО</small><strong>{selectedPlan === 'month' ? 'Все ступени на месяц' : selectedPlan === 'year' ? 'Все ступени на год' : `Ступень «${steps[activeStep].name}»`}</strong></span></div><button className="btn btn--primary" onClick={() => { setSubscribed(true); setSaved(true); openAccount('overview'); showNotice('Демо-доступ активирован'); }}><CreditCard size={18} /> Продолжить <ArrowRight size={18} /></button></div><p className="pricing-note">Сейчас это демонстрация интерфейса. Реальное списание не производится.</p></section> : null}

    {screen === 'account' ? <section className="account-shell screen-enter"><aside className="account-sidebar"><div className="account-identity"><div><UserRound /></div><span><small>ЛИЧНОЕ ПРОСТРАНСТВО</small><strong>Ваш путь в СИГ</strong></span></div><nav>{accountNav.map((item) => { const Icon = item.icon; return <button key={item.id} className={accountTab === item.id ? 'is-active' : ''} onClick={() => setAccountTab(item.id)}><Icon size={17} /><span>{item.label}</span>{item.id === 'steps' ? <b>{completedCount}/12</b> : null}</button>; })}</nav><button className="sidebar-exit" onClick={() => navigate('home')}><LogOut size={16} /> Вернуться на сайт</button></aside><div className="account-main"><div className="account-header"><div><small>ЛИЧНЫЙ КАБИНЕТ</small><h2>{accountTitle}</h2></div>{subscribed ? <Pill>Полный доступ активен</Pill> : <button className="btn btn--small" onClick={() => navigate('pricing')}>Открыть все ступени</button>}</div>{accountTab === 'overview' ? <AccountOverview hasCompass={hasCompass} saved={saved} subscribed={subscribed} completedCount={completedCount} onNavigate={setAccountTab} onNew={() => navigate('phrases')} /> : null}{accountTab === 'codings' ? <CodingsPanel hasCompass={hasCompass} phrase={selectedPhrase} digits={digits} onOpen={() => navigate('result')} /> : null}{accountTab === 'compasses' ? <CompassesPanel hasCompass={hasCompass} phrase={selectedPhrase} digits={digits} onOpen={() => navigate('result')} onNew={() => navigate('phrases')} /> : null}{accountTab === 'steps' ? <AccountSteps onOpen={openStep} statusFor={stepStatus} /> : null}{accountTab === 'directions' ? <DirectionsPanel /> : null}{accountTab === 'book' ? <BookPanel hasCompass={hasCompass} completedCount={completedCount} onNotice={showNotice} /> : null}{accountTab === 'profile' ? <ProfilePanel subscribed={subscribed} onPricing={() => navigate('pricing')} onNotice={showNotice} /> : null}</div><nav className="account-mobile-nav">{accountNav.slice(0, 5).map((item) => { const Icon = item.icon; return <button key={item.id} className={accountTab === item.id ? 'is-active' : ''} onClick={() => setAccountTab(item.id)}><Icon /><small>{item.label.split(' ')[0]}</small></button>; })}</nav></section> : null}

    {notice ? <div className="toast" role="status"><Check size={16} /> {notice}</div> : null}
    {screen !== 'account' ? <footer><span>© 2026 СИГ</span><span>Авторская система саморефлексии</span><span>Все ответы уже внутри тебя</span></footer> : null}
  </main>;
}

function Insight({ type, mark, title, children }: { type: string; mark: string; title: string; children: React.ReactNode }) { return <article className={type}><i>{mark}</i><div><small>{title}</small><strong>{children}</strong></div></article>; }
function PlanCard({ selected, featured, onClick, icon, eyebrow, title, children }: { selected: boolean; featured?: boolean; onClick: () => void; icon: React.ReactNode; eyebrow: string; title: string; children: React.ReactNode }) { return <button className={`plan-card ${featured ? 'plan-card--featured' : ''} ${selected ? 'is-selected' : ''}`} onClick={onClick}>{featured ? <i>ВЫГОДНЫЙ ПУТЬ</i> : null}{icon}<small>{eyebrow}</small><strong>{title}</strong><p>{children}</p><b>Цена уточняется</b><span>{selected ? <Check /> : <Plus />}</span></button>; }

function AccountOverview({ hasCompass, saved, subscribed, completedCount, onNavigate, onNew }: { hasCompass: boolean; saved: boolean; subscribed: boolean; completedCount: number; onNavigate: (tab: AccountTab) => void; onNew: () => void }) {
  return <div className="dashboard-grid"><article className="welcome-card"><div><Pill>ВАША ПАЛИТРА СУДЬБЫ</Pill><h3>{hasCompass ? 'Ваш Компас сохранён' : 'Начните с первого Компаса'}</h3><p>{hasCompass ? 'Возвращайтесь к результату или продолжайте путь через 12 ступеней.' : 'Выберите фразу и цифры, которые откликаются именно сейчас.'}</p><button className="btn btn--primary" onClick={hasCompass ? () => onNavigate('steps') : onNew}>{hasCompass ? 'Продолжить путь' : 'Получить компас'} <ArrowRight size={17} /></button></div><Sigil numbered /></article><article className="progress-card"><div className="card-heading"><span><Sparkles /> Прогресс пути</span><b>{completedCount}/12</b></div><div className="progress-track"><i style={{ width: `${Math.max(5, completedCount / 12 * 100)}%` }} /></div><p>{subscribed ? 'Все ступени открыты. Двигайтесь в своём темпе.' : 'Откройте подписку, чтобы получить доступ ко всему пути.'}</p><button onClick={() => onNavigate('steps')}>Смотреть ступени <ChevronRight size={15} /></button></article><article className="mini-card"><Compass /><span><small>КОМПАСЫ</small><strong>{hasCompass && saved ? '1 сохранён' : 'Пока нет'}</strong></span><button onClick={() => onNavigate('compasses')}><ChevronRight /></button></article><article className="mini-card"><BookOpen /><span><small>КНИГА «КТО Я»</small><strong>Не заказана</strong></span><button onClick={() => onNavigate('book')}><ChevronRight /></button></article><article className="question-card"><HelpCircle /><div><small>ДОПОЛНИТЕЛЬНЫЕ ВОПРОСЫ</small><h3>3 · 6 · 9 вопросов к себе</h3><p>Новый способ продолжить исследование выбранной темы.</p></div><button onClick={() => onNavigate('codings')}>Скоро</button></article></div>;
}
function EmptyState({ icon, title, text, action, onAction }: { icon: React.ReactNode; title: string; text: string; action?: string; onAction?: () => void }) { return <div className="empty-state"><div>{icon}</div><h3>{title}</h3><p>{text}</p>{action && onAction ? <button className="btn btn--primary" onClick={onAction}>{action} <ArrowRight size={17} /></button> : null}</div>; }
function CodingsPanel({ hasCompass, phrase, digits, onOpen }: { hasCompass: boolean; phrase: string; digits: number[]; onOpen: () => void }) { if (!hasCompass) return <EmptyState icon={<Layers3 />} title="Кодировок пока нет" text="Здесь появятся Компасы, ступени и дополнительные вопросы — каждая история отдельно." />; return <div className="records-panel"><div className="records-toolbar"><div><button className="is-active">Все</button><button>Компасы</button><button>Ступени</button><button>Вопросы</button></div><span>1 результат</span></div><article className="record-card"><div className="record-date"><b>{new Date().getDate()}</b><small>СЕН</small></div><div className="record-main"><Pill>КОМПАС</Pill><h3>{phrase}</h3><p>Компас настоящего момента · Код {digits.join(' · ')}</p></div><div className="record-summary"><small>КРАТКИЙ РЕЗУЛЬТАТ</small><p>Внимание ищет новый вектор и опору в собственном ритме.</p></div><div className="record-actions"><button onClick={onOpen}>Открыть <ChevronRight /></button><button onClick={() => window.print()}><Printer /></button></div></article></div>; }
function CompassesPanel({ hasCompass, phrase, digits, onOpen, onNew }: { hasCompass: boolean; phrase: string; digits: number[]; onOpen: () => void; onNew: () => void }) { if (!hasCompass) return <EmptyState icon={<Compass />} title="Ваш первый Компас ждёт" text="Выберите фразу и от 3 до 9 цифр — результат появится здесь автоматически." action="Получить компас" onAction={onNew} />; return <div className="compass-library"><article className="compass-item"><div className="compass-item__visual"><Sigil numbered /></div><div><Pill>СЕГОДНЯ</Pill><h3>{phrase}</h3><p>{digits.join(' · ')}</p><span>Интуиция · новый вектор · собственный ритм</span><button onClick={onOpen}>Открыть Компас <ArrowRight /></button></div></article><button className="new-compass" onClick={onNew}><Plus /><span><strong>Новый Компас</strong><small>Посмотреть на другой вопрос</small></span></button></div>; }
function AccountSteps({ onOpen, statusFor }: { onOpen: (index: number) => void; statusFor: (index: number) => string }) { return <div className="account-step-grid">{steps.map((step, index) => { const status = statusFor(index); return <button key={step.name} onClick={() => onOpen(index)} style={{ '--tone': step.color } as React.CSSProperties} className={`account-step is-${status}`}><span>{step.icon}</span><i>{index + 1}</i><div><small>СТУПЕНЬ {index + 1}</small><strong>{step.name}</strong><p>{status === 'done' ? 'Результат сохранён' : status === 'open' ? 'Доступна для прохождения' : 'Откройте отдельно или по подписке'}</p></div><b>{status === 'done' ? <Check /> : status === 'open' ? <ChevronRight /> : <LockKeyhole />}</b></button>; })}</div>; }
function DirectionsPanel() { const directions = [{ icon: '♥', title: 'Отношения', text: 'Кодировка для пары' }, { icon: '◉', title: 'Ребёнок', text: 'Таланты и путь ребёнка' }, { icon: '✚', title: 'Здоровье', text: 'Психосоматика' }, { icon: '❀', title: 'Родовые программы', text: 'Связь с историей рода' }, { icon: '∞', title: 'Кармические связи', text: 'Глубинные сценарии' }]; return <div><div className="coming-heading"><Pill>БУДУЩИЕ ОБНОВЛЕНИЯ</Pill><h3>Новые направления СИГ</h3><p>Каждое направление станет отдельным пространством и не смешается с личными кодировками.</p></div><div className="direction-library">{directions.map((item) => <article key={item.title}><i>{item.icon}</i><small>СКОРО</small><h3>{item.title}</h3><p>{item.text}</p><button disabled><LockKeyhole /> Готовится</button></article>)}</div></div>; }
function BookPanel({ hasCompass, completedCount, onNotice }: { hasCompass: boolean; completedCount: number; onNotice: (message: string) => void }) { const [included, setIncluded] = useState(hasCompass); return <div className="book-layout"><article className="book-preview"><div className="book-cover"><small>СИСТЕМА ИНДИВИДУАЛЬНОЙ ГЕОМЕТРИИ</small><Sigil compact /><h3>КТО Я</h3><p>Моя индивидуальная геометрия</p><span>Личная книга</span></div></article><div className="book-builder"><Pill>СТАТУС · НЕ ЗАКАЗАНА</Pill><h3>Соберите свою книгу</h3><p>Книга формируется из выбранных кодировок и может пополняться по мере вашего пути.</p><div className="book-checklist"><label className={!hasCompass ? 'is-disabled' : ''}><input type="checkbox" checked={included && hasCompass} disabled={!hasCompass} onChange={(event) => setIncluded(event.target.checked)} /><span><Compass /><i><strong>Компас настоящего момента</strong><small>{hasCompass ? 'Готов к добавлению' : 'Сначала получите Компас'}</small></i></span></label><label className="is-disabled"><input type="checkbox" disabled /><span><Sparkles /><i><strong>Пройденные ступени</strong><small>{completedCount ? `${completedCount} глава готова` : 'Пока нет готовых глав'}</small></i></span></label></div><div className="book-total"><span><small>В КНИГЕ</small><strong>{included && hasCompass ? 1 : 0} раздел</strong></span><button className="btn btn--primary" disabled={!included || !hasCompass} onClick={() => onNotice('Предварительная заявка на книгу сохранена')}>Заказать книгу <ArrowRight /></button></div></div></div>; }
function ProfilePanel({ subscribed, onPricing, onNotice }: { subscribed: boolean; onPricing: () => void; onNotice: (message: string) => void }) { return <div className="profile-grid"><form className="profile-form" onSubmit={(event) => { event.preventDefault(); onNotice('Настройки профиля сохранены'); }}><div className="section-title"><UserRound /><span><h3>Личные данные</h3><p>Используются только внутри ваших кодировок.</p></span></div><div className="form-grid"><label><span>Имя</span><input placeholder="Ваше имя" /></label><label><span>Фамилия</span><input placeholder="Ваша фамилия" /></label><label><span>Дата рождения</span><input type="date" /></label><label><span>Время рождения <small>необязательно</small></span><input type="time" /></label><label className="wide"><span>Электронная почта</span><input type="email" placeholder="name@example.ru" /></label></div><button className="btn btn--primary" type="submit">Сохранить изменения</button></form><aside className="subscription-card"><CreditCard /><Pill>{subscribed ? 'АКТИВНА' : 'НЕ АКТИВНА'}</Pill><h3>{subscribed ? 'Полный доступ' : 'Базовый доступ'}</h3><p>{subscribed ? 'Все 12 ступеней открыты в демонстрационном режиме.' : 'Бесплатные Компасы доступны без ограничений.'}</p><button className="btn btn--ghost" onClick={onPricing}>{subscribed ? 'Управлять подпиской' : 'Открыть полный путь'}</button></aside><button className="danger-zone" onClick={() => onNotice('Выход из демонстрационного кабинета')}><LogOut /> Выйти из аккаунта</button></div>; }
