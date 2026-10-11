'use strict';

const projects = [
  {
    name:'Whispers in the Void',downloads:67801,curseforge:'https://www.curseforge.com/minecraft/modpacks/whispers-in-the-void',theme:'survival',
    genre:{ru:'Хоррор / выживание',en:'Horror / survival'},
    desc:{ru:'Мрачная хоррор-сборка с выживанием и исследованием.',en:'Dark horror-focused pack with survival and exploration.'},
    source:'https://www.curseforge.com/minecraft/modpacks/whispers-in-the-void/gallery',color:['#352345','#131925'],abbr:'W'
  },
  {
    name:'The Winter Rescue',downloads:672081,curseforge:'https://www.curseforge.com/minecraft/modpacks/the-winter-rescue',theme:'survival',
    genre:{ru:'Зимнее выживание',en:'Winter survival'},
    desc:{ru:'Холодный мир, обогрев, техника и выживание.',en:'Cold-world survival with heating, tech and progression.'},
    source:'https://www.curseforge.com/minecraft/modpacks/the-winter-rescue/gallery',color:['#65819a','#263145'],abbr:'W'
  },
  {
    name:'Solo Leveling: OVERLOAD',downloads:26787,curseforge:'https://www.curseforge.com/minecraft/modpacks/solo-leveling-overload',theme:'adventure',
    genre:{ru:'RPG / прокачка',en:'RPG / progression'},
    desc:{ru:'Ролевая сборка с прокачкой, уровнями и особыми интерфейсами.',en:'RPG-oriented pack with skills, levels and custom interfaces.'},
    color:['#672f83','#251539'],abbr:'SL'
  },
  {
    name:'Society: Sunlit Valley',downloads:1355971,curseforge:'https://www.curseforge.com/minecraft/modpacks/society-sunlit-valley',theme:'cozy',
    genre:{ru:'Фермерство / развитие',en:'Farming / progression'},
    desc:{ru:'Фермерство, развитие базы и долгая прогрессия.',en:'Farming, base growth and long-term progression.'},
    source:'https://www.curseforge.com/minecraft/modpacks/society-sunlit-valley/gallery',color:['#745c4d','#272033'],abbr:'SV'
  },
  {
    name:'Project Genesis',downloads:940332,curseforge:'https://www.curseforge.com/minecraft/modpacks/biohazard-project-genesis',theme:'survival',
    genre:{ru:'Выживание',en:'Survival'},
    desc:{ru:'Сборка из каталога переводов с выживанием и исследованием.',en:'A survival-oriented entry from the translation catalog.'},
    color:['#4c304b','#17222c'],abbr:'PG'
  },
  {
    name:'Over Stars',downloads:392949,curseforge:'https://www.curseforge.com/minecraft/modpacks/over-stars',theme:'tech',
    genre:{ru:'Технологии / RPG',en:'Tech / RPG'},
    desc:{ru:'Технологическая прогрессия, квесты и приключения.',en:'Technology progression mixed with quests and adventure.'},
    color:['#394882','#171530'],abbr:'OS'
  },
  {
    name:'Opolis Inc',downloads:144856,curseforge:'https://www.curseforge.com/minecraft/modpacks/opolis-inc',theme:'tech',
    genre:{ru:'Технологии',en:'Technology'},
    desc:{ru:'Технологическая сборка с поэтапным развитием.',en:'Technology pack with staged progression.'},
    source:'https://www.curseforge.com/minecraft/modpacks/opolis-inc/gallery',color:['#465b72','#1b2638'],abbr:'OI'
  },
  {
    name:'Lucky World Invasion',downloads:2196994,curseforge:'https://www.curseforge.com/minecraft/modpacks/lucky-world-invasion',theme:'survival',
    genre:{ru:'Выживание / события',en:'Survival / events'},
    desc:{ru:'События, вторжения и необычное выживание.',en:'Event-driven survival with invasions and surprises.'},
    source:'https://minecraft.fr/lucky-world-invasion-modpack-minecraft/',color:['#b45f67','#4a2d63'],abbr:'LW'
  },
  {
    name:'Life in the village 4',downloads:228242,curseforge:'https://www.curseforge.com/minecraft/modpacks/life-in-the-village-4',theme:'cozy',
    genre:{ru:'Строительство / поселения',en:'Building / settlements'},
    desc:{ru:'Развитие поселения и управление колонией.',en:'Village growth and colony management.'},
    color:['#71564e','#293b32'],abbr:'LV'
  },
  {
    name:"waccyy's Fantasia",downloads:322728,curseforge:'https://www.curseforge.com/minecraft/modpacks/waccyys-fantasia',theme:'adventure',
    genre:{ru:'Фэнтези / приключения',en:'Fantasy / adventure'},
    desc:{ru:'Фэнтезийное приключение с исследованием мира.',en:'Fantasy adventure with world exploration.'},
    color:['#715587','#2a2046'],abbr:'WF'
  },
  {
    name:'Dread Reborn',downloads:2405408,curseforge:'https://www.curseforge.com/minecraft/modpacks/dread-arrenek',theme:'survival',
    genre:{ru:'Хоррор / выживание',en:'Horror / survival'},
    desc:{ru:'Мрачная атмосфера, угрозы и выживание.',en:'A dark survival pack with horror atmosphere.'},
    color:['#543647','#1b161e'],abbr:'DR'
  },
  {
    name:'Create: Stranded at Sea',downloads:302564,curseforge:'https://www.curseforge.com/minecraft/modpacks/create-stranded-at-sea',theme:'tech',
    genre:{ru:'Create / выживание',en:'Create / survival'},
    desc:{ru:'Океанический мир, Create и продуманная прогрессия.',en:'Ocean survival with Create and structured progression.'},
    source:'https://www.curseforge.com/minecraft/modpacks/create-stranded-at-sea',color:['#50428b','#1e213e'],abbr:'CS'
  },
  {
    name:'Create: Mekanized',downloads:192182,curseforge:'https://www.curseforge.com/minecraft/modpacks/create-mekanized',theme:'tech',
    genre:{ru:'Create / Mekanism',en:'Create / Mekanism'},
    desc:{ru:'Автоматизация и развитие производств.',en:'Automation and factory progression.'},
    color:['#696251','#26283b'],abbr:'CM'
  },
  {
    name:'CABIN: Above and Beyond newer',downloads:378780,curseforge:'https://www.curseforge.com/minecraft/modpacks/cabin',theme:'tech',
    genre:{ru:'Create / технологии',en:'Create / tech'},
    desc:{ru:'Технологическая сборка на основе Create.',en:'Create-based technology progression pack.'},
    color:['#736246','#30263e'],abbr:'CA'
  },
  {
    name:'Beyond Depth',downloads:3321338,curseforge:'https://www.curseforge.com/minecraft/modpacks/beyond-depth',theme:'adventure',
    genre:{ru:'Исследование / приключения',en:'Exploration / adventure'},
    desc:{ru:'Исследование мира и приключения.',en:'World exploration and adventure.'},
    source:'https://www.curseforge.com/minecraft/modpacks/beyond-depth',color:['#5f3f7a','#211c38'],abbr:'BD'
  }
];
const restoredCovers={"Whispers in the Void":"./assets/whispers.webp","The Winter Rescue":"./assets/winter.webp","Society: Sunlit Valley":"./assets/society.webp","Create: Stranded at Sea":"./assets/cover-create-stranded-at-sea.webp","Lucky World Invasion":"./assets/cover-lucky-world-invasion.webp"};
for(const p of projects){p.img=restoredCovers[p.name]||p.img;}
const coverMap={"Whispers in the Void":{"src":"./assets/whispers.webp"},"The Winter Rescue":{"src":"./assets/winter-author.jpg"},"Society: Sunlit Valley":{"src":"./assets/society-author.png"},"Life in the village 4":{"src":"./assets/life-village-4-logo.png"},"CABIN: Above and Beyond newer":{"src":"./assets/cabin-logo.png"},"Lucky World Invasion":{"src":"./assets/cover-lucky-world-invasion.webp","fallback":"./assets/lucky-icon.png"},"Create: Stranded at Sea":{"src":"./assets/cover-create-stranded-at-sea.webp"},"Beyond Depth":{"src":"./assets/cover-beyond-depth.webp"},"Project Genesis":{"src":"./assets/cover-project-genesis.webp"},"Over Stars":{"src":"./assets/cover-over-stars.webp"},"Create: Mekanized":{"src":"./assets/cover-create-mekanized.webp"},"Opolis Inc":{"src":"./assets/cover-opolis-inc.webp"},"Dread Reborn":{"src":"./assets/cover-dread-reborn.webp"}};
for(const p of projects){const e=coverMap[p.name];if(e){p.img=e.src;p.imgFallback=e.fallback||''}}
projects.sort((a,b)=>(b.downloads||0)-(a.downloads||0));


const UI = {
  ru: {
    metaTitle:'Sheiny – переводы Minecraft',
    htmlLang:'ru',
    quick_home:'Главная',quick_projects:'Проекты',quick_focus:'Направления',quick_about:'Обо мне',quick_contact:'Связь',nav_projects:'Проекты', nav_approach:'Что я делаю', nav_about:'Обо мне', header_contact:'Написать',
    hero_eyebrow:'ЛОКАЛИЗАЦИЯ MINECRAFT',
    hero_title:'Чтобы Minecraft говорил <em>по-русски.</em>',
    hero_desc:'Перевожу модпаки, моды, квесты и интерфейсы на русский язык.',
    hero_action_primary:'Посмотреть работы', hero_action_secondary:'Что локализую',
    stat_projects:'сборок в портфолио', stat_rtf:'свои переводы', stat_lang:'автовыбор языка',
    floating_title:'Не просто замена слов.', floating_desc:'Термины, контекст и нормальный русский.', hero_caption:'ОФИЦИАЛЬНЫЕ ИЛЛЮСТРАЦИИ СБОРОК / CURSEFORGE',
    portfolio_overline:'ПОРТФОЛИО', work_title:'Сборки, над которыми <span>я работал.</span>', work_desc:'Переводы для KennnyMC. Скачивания оригинальных сборок, CurseForge (11.10.2026).',
    search_placeholder:'Найти сборку...', filter_all:'Все', filter_adventure:'Приключения', filter_tech:'Технологии', filter_survival:'Выживание', filter_cozy:'Уютные',
    empty_title:'Ничего не найдено.', empty_desc:'Попробуйте другое название или сбросьте фильтр.', empty_reset:'Показать все проекты',
    project_footnote:'Иллюстрации взяты из публичных галерей оригинальных сборок.',
    gallery_overline:'В ИГРЕ', gallery_title:'Разные сборки. <span>Одна цель.</span>', gallery_desc:'Несколько иллюстраций из сборок в портфолио.', source_link:'Источник ↗',
    approach_overline:'ЧТО Я ДЕЛАЮ', approach_title:'Что именно <span>я локализую.</span>', approach_desc:'Не только lang-файлы.',
    service_mods_title:'Моды и предметы', service_mods_desc:'Названия, подсказки и единая терминология.',
    service_quests_title:'Квесты и книги', service_quests_desc:'Квестбуки, руководства и большой игровой текст.',
    service_ui_title:'Интерфейсы', service_ui_desc:'FancyMenu, HUD и другие текстовые элементы UI.',
    service_code_title:'KubeJS и нестандартные случаи', service_code_desc:'Скрипты, динамические названия и строки вне lang-файлов.',
    about_overline:'ОБО МНЕ', about_title:'Sheiny <span>– локализация Minecraft.</span>', about_desc:'Занимаюсь русской локализацией Minecraft-проектов: в основном сборок и связанных интерфейсов.',community_note:'Также состою в NoToxicCommunity.',
    rtf_title:'RTF Extension', rtf_desc:'У меня также есть свои переводы в RTF Extension.',
    contact_overline:'СВЯЗЬ', contact_title:'Нужна русская <span>локализация?</span>', contact_desc:'Можно написать в Telegram или Discord.', copy_label:'Копировать',
    footer_text:'Портфолио локализации Minecraft · 2026', footer_top:'Наверх ↑',
    card_label:'Перевод для KennnyMC',downloads_label:'скачиваний',downloads_asof:'Статистика CurseForge на 11.10.2026', card_status:'Русская локализация', card_more:'Подробнее ↗',translation_card_link:'Русификаторы ↗',
    dialog_contribution:'Мой вклад:', dialog_contribution_text:'работа над русской локализацией для KennnyMC.',
    dialog_translation:'Скриншоты перевода у KennnyMC ↗', dialog_original:'Оригинальная сборка ↗',kenny_site_link:'Русификаторы на сайте Кенни ↗', dialog_note:'Это персональное портфолио, не официальная страница сборки.'
  },
  en: {
    metaTitle:'Sheiny – Minecraft localization',
    htmlLang:'en',
    quick_home:'Home',quick_projects:'Projects',quick_focus:'Focus',quick_about:'About',quick_contact:'Contact',nav_projects:'Projects', nav_approach:'What I do', nav_about:'About', header_contact:'Contact',
    hero_eyebrow:'MINECRAFT LOCALIZATION',
    hero_title:'Making Minecraft speak <em>Russian.</em>',
    hero_desc:'I localize modpacks, mods, quests and interfaces for Russian-speaking players.',
    hero_action_primary:'View projects', hero_action_secondary:'What I localize',
    stat_projects:'projects in portfolio', stat_rtf:'own translations', stat_lang:'auto language',
    floating_title:'More than raw text replacement.', floating_desc:'Terms, context and cleaner Russian.', hero_caption:'OFFICIAL PACK ART / CURSEFORGE',
    portfolio_overline:'PORTFOLIO', work_title:'Projects I <span>worked on.</span>', work_desc:'Translations for KennnyMC. Original pack downloads, CurseForge (Oct 11, 2026).',
    search_placeholder:'Find a project...', filter_all:'All', filter_adventure:'Adventure', filter_tech:'Tech', filter_survival:'Survival', filter_cozy:'Cozy',
    empty_title:'Nothing found.', empty_desc:'Try another name or reset the filter.', empty_reset:'Show all projects',
    project_footnote:'Images are taken from public galleries of the original modpacks.',
    gallery_overline:'IN GAME', gallery_title:'Different packs. <span>One language goal.</span>', gallery_desc:'A few visuals from the packs in this portfolio.', source_link:'Source ↗',
    approach_overline:'WHAT I DO', approach_title:'What exactly <span>I localize.</span>', approach_desc:'Not just lang files.',
    service_mods_title:'Mods and items', service_mods_desc:'Names, tooltips and consistent terminology.',
    service_quests_title:'Quests and books', service_quests_desc:'Questbooks, guides and long-form in-game text.',
    service_ui_title:'Interfaces', service_ui_desc:'FancyMenu screens, HUDs and other text-heavy UI pieces.',
    service_code_title:'KubeJS and custom cases', service_code_desc:'Scripts, dynamic names and text outside lang files.',
    about_overline:'ABOUT', about_title:'Sheiny <span>– Minecraft localization.</span>', about_desc:'I work on Russian localization for Minecraft projects, mostly modpacks and related UI.',community_note:'I am also a member of NoToxicCommunity.',
    rtf_title:'RTF Extension', rtf_desc:'I also have my own translations in RTF Extension.',
    contact_overline:'CONTACT', contact_title:'Need Russian <span>localization?</span>', contact_desc:'Telegram or Discord – both are fine.', copy_label:'Copy',
    footer_text:'Minecraft localization portfolio · 2026', footer_top:'Back to top ↑',
    card_label:'Translation for KennnyMC',downloads_label:'downloads',downloads_asof:'CurseForge snapshot: Oct 11, 2026', card_status:'Russian localization', card_more:'Details ↗',translation_card_link:'Translations ↗',
    dialog_contribution:'My role:', dialog_contribution_text:'Russian localization work for KennnyMC.',
    dialog_translation:'KennnyMC translation screenshots ↗', dialog_original:'Original modpack ↗',kenny_site_link:'Translations at KennnyMC ↗', dialog_note:'This is a personal portfolio page, not an official pack page.'
  }
};

const nodes = {
  grid: document.getElementById('project-grid'),
  search: document.getElementById('project-search'),
  count: document.getElementById('count-label'),
  noResults: document.getElementById('empty-state'),
  dialog: document.getElementById('project-dialog'),
  dialogContent: document.getElementById('dialog-content'),
  gallery: document.getElementById('gallery-track'),
  loaderStack: document.getElementById('loader-stack'),
  copyDiscord: document.getElementById('copy-discord'),
  copyLabel: document.getElementById('copy-label')
};

let activeFilter = 'all';
let currentLang = detectLanguage();

function detectLanguage(){
  let saved = null;
  try { saved = localStorage.getItem('site_lang'); } catch (_) {}
  if(saved === 'ru' || saved === 'en') return saved;
  return navigator.language && navigator.language.toLowerCase().startsWith('ru') ? 'ru' : 'en';
}
function t(key){ return UI[currentLang][key] ?? key; }
function normal(value){ return String(value).toLocaleLowerCase(currentLang).replace(/ё/g,'е').trim(); }
function escapeHtml(value){ return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function pluralRu(n, one, few, many){ return n%10===1 && n%100!==11 ? one : (n%10>=2 && n%10<=4 && (n%100<12 || n%100>14)) ? few : many; }
function projectCountLabel(n){ return currentLang === 'ru' ? `${n} ${pluralRu(n,'проект','проекта','проектов')}` : `${n} project${n===1?'':'s'}`; }

function applyStaticTranslations(){
  document.documentElement.lang = UI[currentLang].htmlLang;
  document.title = t('metaTitle');
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key) el.textContent = t(key);
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (key) el.innerHTML = t(key);
  });
  nodes.search.placeholder = t('search_placeholder');
  nodes.search.setAttribute('aria-label', t('search_placeholder'));
  document.querySelectorAll('.lang-btn').forEach(btn => {
    const on = btn.dataset.lang === currentLang;
    btn.classList.toggle('active', on);
    btn.setAttribute('aria-pressed', String(on));
  });
}

function cardMarkup(p, i){
  const img = p.img ? `<img class="cover-photo" loading="lazy" alt="${escapeHtml(p.name)}" src="${p.img}" data-fallback="${p.imgFallback||''}" onerror="if(this.dataset.fallback){this.src=this.dataset.fallback;this.removeAttribute('data-fallback')}else this.style.display='none'">` : ''; 
  return `<article class="project-card" style="--tile-a:${p.color[0]};--tile-b:${p.color[1]}">
      <div class="card-cover"><span class="cover-letter" aria-hidden="true">${escapeHtml(p.abbr)}</span>${img}<span class="cover-label">${escapeHtml(t('card_label'))}</span></div>
      <div class="card-body">
        <span class="card-meta">${escapeHtml(p.genre[currentLang])}</span>
        <h3 class="card-title">${escapeHtml(p.name)}</h3>
        <div class="card-downloads" title="${escapeHtml(t('downloads_asof'))}"><svg class="download-icon" aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/></svg><strong>${escapeHtml(new Intl.NumberFormat(currentLang==='ru'?'ru-RU':'en-US',{notation:'compact',maximumFractionDigits:2}).format(p.downloads))}</strong> <small>${escapeHtml(t('downloads_label'))}</small></div>
        <div class="card-footer"><a class="translation-action" href="https://kennyminecraft.ru/" target="_blank" rel="noopener noreferrer">${escapeHtml(t('translation_card_link'))}</a><button class="card-more" type="button" data-project="${i}" aria-label="${escapeHtml(t('card_more'))} ${escapeHtml(p.name)}">${escapeHtml(t('card_more'))}</button></div>
      </div>
    </article>`;
}

function render(){
  const q = normal(nodes.search.value);
  const matches = projects.map((p, i) => ({p, i})).filter(({p}) => {
    const haystack = normal([p.name, p.genre[currentLang], p.desc[currentLang]].join(' '));
    return (activeFilter === 'all' || p.theme === activeFilter) && (!q || haystack.includes(q));
  });
  nodes.grid.innerHTML = matches.map(({p, i}) => cardMarkup(p, i)).join('');
  nodes.noResults.hidden = matches.length > 0;
  nodes.count.textContent = projectCountLabel(matches.length);
}

function showProject(index){
  const p = projects[index]; if(!p) return;
  const img = `<div class="dialog-image" style="--tile-a:${p.color[0]};--tile-b:${p.color[1]}"><span class="cover-letter">${escapeHtml(p.abbr)}</span></div>`;
  const sourceLink = `<a class="dialog-link" href="${p.curseforge}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('dialog_original'))}</a>`;
  const translationLink = `<a class="dialog-link" href="https://kennyminecraft.ru/" target="_blank" rel="noopener noreferrer">${escapeHtml(t('kenny_site_link'))}</a>`;
  nodes.dialogContent.innerHTML = `${img}
    <div class="dialog-main">
      <div class="dialog-topic">${escapeHtml(p.genre[currentLang])}</div>
      <h2 id="dialog-title">${escapeHtml(p.name)}</h2>
      <p>${escapeHtml(p.desc[currentLang])}</p>
      <p class="dialog-downloads"><strong>${new Intl.NumberFormat(currentLang==='ru'?'ru-RU':'en-US').format(p.downloads)}</strong> ${escapeHtml(t('downloads_label'))} <small>${escapeHtml(t('downloads_asof'))}</small></p>
      <div class="dialog-meta"><strong>${escapeHtml(t('dialog_contribution'))}</strong> ${escapeHtml(t('dialog_contribution_text'))}</div>
      <div class="dialog-links">${translationLink}${sourceLink}</div>
      <p class="dialog-source">${escapeHtml(t('dialog_note'))}</p>
    </div>`;
  if(typeof nodes.dialog.showModal === 'function') nodes.dialog.showModal();
  else nodes.dialog.setAttribute('open','');
}

function setLanguage(lang){
  currentLang = lang === 'ru' ? 'ru' : 'en';
  try { localStorage.setItem('site_lang', currentLang); } catch (_) {}
  applyStaticTranslations();
  render();
}

function initLanguageSwitcher(){
  document.querySelectorAll('.lang-btn').forEach(btn => btn.addEventListener('click', () => setLanguage(btn.dataset.lang)));
}

function initFilters(){
  document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll('.filter').forEach(b => {
      const current = b === button;
      b.classList.toggle('active', current);
      b.setAttribute('aria-pressed', String(current));
    });
    render();
  }));
}

function initDialog(){
  nodes.grid.addEventListener('click', event => {
    const button = event.target.closest('[data-project]');
    if(button) showProject(Number(button.dataset.project));
  });
  document.getElementById('dialog-close').addEventListener('click', () => nodes.dialog.close());
  nodes.dialog.addEventListener('click', event => { if(event.target === nodes.dialog) nodes.dialog.close(); });
}

function initGallery(){
  document.getElementById('gallery-next').addEventListener('click', () => nodes.gallery.scrollBy({left: nodes.gallery.clientWidth * .68, behavior:'smooth'}));
  document.getElementById('gallery-prev').addEventListener('click', () => nodes.gallery.scrollBy({left: -nodes.gallery.clientWidth * .68, behavior:'smooth'}));
}

function initCopy(){
  nodes.copyDiscord.addEventListener('click', async() => {
    try { await navigator.clipboard.writeText('sheiny__'); nodes.copyLabel.textContent = currentLang === 'ru' ? 'Скопировано ✓' : 'Copied ✓'; }
    catch { nodes.copyLabel.textContent = currentLang === 'ru' ? 'Ник: sheiny__' : 'Nick: sheiny__'; }
    setTimeout(() => { nodes.copyLabel.textContent = t('copy_label'); }, 2200);
  });
}

function initSearchAndReset(){
  nodes.search.addEventListener('input', render);
  document.getElementById('reset-filters').addEventListener('click', () => {
    nodes.search.value = '';
    document.querySelector('[data-filter="all"]').click();
    nodes.search.focus();
  });
}

function initLoaderRotation(){
  if(!nodes.loaderStack) return;
  const items = [...nodes.loaderStack.querySelectorAll('.loader-badge')];
  const dirs = ['vertical','horizontal','diagonal'];
  let index = 0; let dirIndex = 0;
  setInterval(() => {
    items[index].classList.remove('active');
    index = (index + 1) % items.length;
    dirIndex = (dirIndex + 1) % dirs.length;
    nodes.loaderStack.dataset.direction = dirs[dirIndex];
    items[index].classList.add('active');
  }, 3000);
}

applyStaticTranslations();
initLanguageSwitcher();
initFilters();
initDialog();
initCopy();
initSearchAndReset();
render();

function initSectionQuickNav(){
 const links=[...document.querySelectorAll('[data-section-link]')];
 if(!links.length||!('IntersectionObserver' in window))return;
 const obs=new IntersectionObserver(entries=>{
  for(const entry of entries){if(!entry.isIntersecting)continue;
   const id=entry.target.classList.contains('hero')?'top':entry.target.id;
   for(const link of links){const active=link.dataset.sectionLink===id;link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');}
  }
 },{rootMargin:'-30% 0px -50% 0px',threshold:0.01});
 for(const id of ['top','work','approach','about','contact']){const node=id==='top'?document.querySelector('.hero'):document.getElementById(id);if(node)obs.observe(node)}
}
initSectionQuickNav();

