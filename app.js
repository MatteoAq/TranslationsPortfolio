'use strict';

// Every entry below corresponds to the 15 names supplied by Sheiny.
// Categories describe the pack's broad theme, not the translation's QA status.
// Public images come from original modpack galleries, not translated screenshots.
const projects = [
  {name:'Whispers in the Void',theme:'survival',genre:'Хоррор / выживание',desc:'Атмосферная хоррор-сборка с опасными существами, исследованием и заданиями.',img:'https://media.forgecdn.net/attachments/1319/846/whispers-in-the-void-1.jpg',source:'https://www.curseforge.com/minecraft/modpacks/whispers-in-the-void/gallery',color:['#352345','#131925'],abbr:'W'},
  {name:'The Winter Rescue',theme:'survival',genre:'Зимнее выживание',desc:'Выживание в холодном мире с техникой, обогревом и развитием поселения.',img:'https://i.imgur.com/QYhDakk.jpeg',source:'https://www.curseforge.com/minecraft/modpacks/the-winter-rescue/gallery',color:['#65819a','#263145'],abbr:'W'},
  {name:'Solo Leveling: OVERLOAD',theme:'adventure',genre:'RPG / прокачка',desc:'Ролевая сборка по мотивам Solo Leveling с навыками, уровнями и особыми интерфейсами.',color:['#672f83','#251539'],abbr:'SL'},
  {name:'Society: Sunlit Valley',theme:'cozy',genre:'Фермерство / развитие',desc:'Сборка про развитие, хозяйство, исследования и долгую игровую прогрессию.',img:'https://media.forgecdn.net/attachments/1021/562/2024-11-19_21.png',source:'https://www.curseforge.com/minecraft/modpacks/society-sunlit-valley/gallery',color:['#745c4d','#272033'],abbr:'SV'},
  {name:'Project Genesis',theme:'survival',genre:'Выживание',desc:'Проект из каталога переводов. Подробности конкретного переведённого выпуска уточняются.',color:['#4c304b','#17222c'],abbr:'PG'},
  {name:'Over Stars',theme:'tech',genre:'Технологии / RPG',desc:'Технологическая прогрессия и приключения, объединённые квестовой системой.',color:['#394882','#171530'],abbr:'OS'},
  {name:'Opolis Inc',theme:'tech',genre:'Технологии',desc:'Сборка с упором на технологии и последовательное развитие.',color:['#465b72','#1b2638'],abbr:'OI'},
  {name:'Lucky World Invasion',theme:'survival',genre:'Выживание / события',desc:'Неожиданные события, счастливые блоки и защита от вторжений.',img:'https://minecraft.fr/wp-content/uploads/2024/09/lucky-world-invasion-modpack-minecraft.jpg',source:'https://minecraft.fr/lucky-world-invasion-modpack-minecraft/',color:['#b45f67','#4a2d63'],abbr:'LW'},
  {name:'Life in the village 4',theme:'cozy',genre:'Строительство / поселения',desc:'Развитие поселения, управление колонией и исследование мира.',color:['#71564e','#293b32'],abbr:'LV'},
  {name:"waccyy's Fantasia",theme:'adventure',genre:'Фэнтези / приключения',desc:'Фэнтезийный мир, исследование и приключения.',color:['#715587','#2a2046'],abbr:'WF'},
  {name:'Dread Reborn',theme:'survival',genre:'Хоррор / выживание',desc:'Мрачная сборка с угрозами, хоррор-атмосферой и выживанием.',color:['#543647','#1b161e'],abbr:'DR'},
  {name:'Create: Stranded at Sea',theme:'tech',genre:'Create / выживание',desc:'Приключения и автоматизация в океаническом мире с развитой системой прогрессии.',img:'https://media.forgecdn.net/attachments/1076/193/create-stranded-at-sea-showcase-end.png',source:'https://www.curseforge.com/minecraft/modpacks/create-stranded-at-sea',color:['#50428b','#1e213e'],abbr:'CS'},
  {name:'Create: Mekanized',theme:'tech',genre:'Create / Mekanism',desc:'Развитие производств, автоматизация и технологии Create вместе с Mekanism.',color:['#696251','#26283b'],abbr:'CM'},
  {name:'CABIN: Above and Beyond newer',theme:'tech',genre:'Create / технологии',desc:'Развитие технологий и производственных цепочек в сборке на основе Create.',color:['#736246','#30263e'],abbr:'CA'},
  {name:'Beyond Depth',theme:'adventure',genre:'Исследование / приключения',desc:'Приключения, исследование мира и новых измерений.',color:['#5f3f7a','#211c38'],abbr:'BD'}
];

const grid = document.getElementById('project-grid');
const search = document.getElementById('project-search');
const count = document.getElementById('count-label');
const noResults = document.getElementById('empty-state');
const dialog = document.getElementById('project-dialog');
const dialogContent = document.getElementById('dialog-content');
let activeFilter = 'all';

const normal = value => value.toLocaleLowerCase('ru').replace(/ё/g,'е').trim();
function escapeHtml(value){return value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function cardMarkup(p,i){
  const img = p.img ? `<img loading="lazy" alt="Иллюстрация оригинальной сборки ${escapeHtml(p.name)}" src="${p.img}" onerror="this.style.display='none'">` : '';
  return `<article class="project-card" style="--tile-a:${p.color[0]};--tile-b:${p.color[1]}"><div class="card-cover"><span class="cover-letter" aria-hidden="true">${escapeHtml(p.abbr)}</span>${img}<span class="cover-label">Перевод для KennnyMC</span></div><div class="card-body"><span class="card-meta">${escapeHtml(p.genre)}</span><h3 class="card-title">${escapeHtml(p.name)}</h3><div class="card-footer"><span>Русская локализация</span><button class="card-more" type="button" data-project="${i}" aria-label="Подробнее о ${escapeHtml(p.name)}">Подробнее ↗</button></div></div></article>`;
}
function render(){
 const q=normal(search.value);
 const matches=projects.map((p,i)=>({p,i})).filter(({p})=>(activeFilter==='all'||p.theme===activeFilter)&&(!q||normal(p.name+' '+p.genre).includes(q)));
 grid.innerHTML=matches.map(({p,i})=>cardMarkup(p,i)).join('');
 noResults.hidden=matches.length>0;
 count.textContent=`${matches.length} ${plural(matches.length,'проект','проекта','проектов')}`;
}
function plural(n,one,few,many){return n%10===1&&n%100!==11?one:(n%10>=2&&n%10<=4&&(n%100<12||n%100>14))?few:many}
function showProject(index){
 const p=projects[index];if(!p)return;
 const img=p.img?`<div class="dialog-image"><img src="${p.img}" alt="Оригинальная сборка ${escapeHtml(p.name)}" onerror="this.style.display='none'"></div>`:'';
 const link=p.source?`<a class="dialog-link" href="${p.source}" target="_blank" rel="noopener noreferrer">Иллюстрации оригинальной сборки ↗</a>`:'';
 dialogContent.innerHTML=`${img}<div class="dialog-main"><div class="dialog-topic">${escapeHtml(p.genre)}</div><h2 id="dialog-title">${escapeHtml(p.name)}</h2><p>${escapeHtml(p.desc)}</p><div class="dialog-meta"><strong>Мой вклад:</strong> работа над русской локализацией для KennnyMC. Это персональное портфолио, не официальная страница сборки.</div>${link}<p class="dialog-source">Иллюстрация, если показана, принадлежит создателям оригинальной сборки. Конкретные EN / RU сравнения и ссылки на релизы будут добавляться отдельно.</p></div>`;
 if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');
}
search.addEventListener('input',render);
document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{activeFilter=button.dataset.filter;document.querySelectorAll('.filter').forEach(b=>{const current=b===button;b.classList.toggle('active',current);b.setAttribute('aria-pressed',String(current));});render()}));
grid.addEventListener('click',event=>{const button=event.target.closest('[data-project]');if(button)showProject(Number(button.dataset.project));});
document.getElementById('reset-filters').addEventListener('click',()=>{search.value='';document.querySelector('[data-filter="all"]').click();search.focus()});
document.getElementById('dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
const gallery=document.getElementById('gallery-track');
document.getElementById('gallery-next').addEventListener('click',()=>gallery.scrollBy({left:gallery.clientWidth*.68,behavior:'smooth'}));
document.getElementById('gallery-prev').addEventListener('click',()=>gallery.scrollBy({left:-gallery.clientWidth*.68,behavior:'smooth'}));
document.getElementById('copy-discord').addEventListener('click',async()=>{
 const label=document.getElementById('copy-label');
 try{await navigator.clipboard.writeText('sheiny__');label.textContent='Скопировано ✓'}
 catch {label.textContent='Ник: sheiny__';}
});
render();
