'use strict';
const $ = id => document.getElementById(id);
const words = [...new Set(`
tea bun hug leaf soft moss star moon cozy cloud peach bloom dream honey petal cookie puddle cuddle sunshine lavender starlight marshmallow
acorn apple apron attic angel amber arrow awake beach bean bell berry bird blue boat book bowl bread breeze brick brook brush bunny butter button cabin cake calm candle candy cape carrot castle cherry chest chick chime cocoa comet coral cotton couch cream creek crisp crown daisy dance dawn deer dew diary dove dragon dress drift duck dusk earth echo egg elm ember fairy feather fern field fig finch fire flame fleece float flour fluffy flute foam forest fox frost fruit garden gem gentle gift ginger glow gold goose grape grass green grove happy hare hat haven hazel heart hill home hope horse house ice iris island ivory ivy jade jam jar jelly jewel joy juice kite kitten kiwi lake lamb lamp lane lantern lemon light lilac lily lime linen little loaf lotus love lucky lunar maple meadow melon merry milk mint mist mitten mochi morning mouse mug mushroom music nest night noble nook ocean olive opal orange orchid otter owl panda paper patch path peace pear pebble penguin penny pepper picnic pie pillow pine pink plum plush poem pond pony poppy pot pretty prism puff pumpkin puppy purple quilt rabbit rain rainbow reed ribbon rice river robin rock rose round ruby rug sail sand scarf scent sea seed shade shell shine shore silk silver sky sleep smile snail snow soap sock song soup spark spice spoon spring sprout squash squirrel stone story sugar summer sun sunny sweet swing syrup taffy tail teapot tender thyme tiger toast toffee tulip turtle twig velvet violet warm water wave whale wheat white willow wind wing winter wish wood wool wren yarn yellow yawn zebra zest
adore after agile air apron arch art ash aunt baby back badge bag bake balm band bark barn basil basket bat bath bead beak bear beat beech beet bench best bike birch bliss blush bob bobbin bloom blush bonbon boots border branch brass brave bright bud bug busy cafe canoe cap care carry cat cave charm cheer chin chirp choco choose circle clay clean clear cliff clock clover coat cobble color cool copper cozy craft crane crayon cub cup cute dale day dear delight denim dial dice dim dimsum dish doll dot dough down dragonfly draw dry dune eager ear east easy eat elder elf empty enjoy even eve face fall fan fancy fawn feast fence ferry fetch fiddle fir fish fizz flag flip flock flower fly fold food fork fresh friend frog fun fur fuzzy gate gazelle gaze geese gift gingham glad glass glitter globe glove gnome good grace granola great grin grow guest guide gum halo hand harbor harmony harp harvest haze hello help hen herb hollow hoof hop hot hummus hum hush icicle idea inch indigo ink inside invite jacket jellybean jingle jolly jump key kind kiss knit lace ladle ladybug lap lark laugh lazy leap leek left lentil life linen lion listen log lullaby lunch magic mellow melt memory mermaid mild mirror mix monkey mossy moth muffin nap near neat nice noodle north note nut oat oatmeal odd open orbit outside oven paint palm pantry park pea pearl perch pet pillow planet play pocket polar pool pour praise prize promise purr puzzle quiet radish raft ray read rest rhyme ride ring ripple rise riverbed roll root rosy sailboat salt saucer scarf seal season secret sesame sheep ship shoe shy sing sit skate sketch sloth small snack snowflake snowman snuggle soda sound south space sparkle spell splash sponge spot squirrel stand steam step still stitch store stream stripe stroll studio sunset swan swell tall tangerine tap tart taste teddy temple thank thick thimble tiny tip together tomato top town toy trail treat tree trick trip tune turn twinkle umbrella under vanilla vase view vine visit voice waffle walk walnut watch welcome well west whisk whisper wide wild wonder world wrap write yak yoga young yummy zip
balance balloon bamboo banana blanket blossom blueberry butterfly caramel cardigan caterpillar cinnamon coconut comfort cupcake dandelion daydream dewdrop dumpling elephant firefly friendship goldfish hedgehog hummingbird lemonade marigold moonbeam moonlight nectarine nightingale paperclip pawprint peppermint pineapple pistachio playtime popcorn pudding raindrop rosemary sandcastle seashell snowdrop snowstorm snowball strawberry sunflower teacup teaspoon treasure waterfall watermelon wildflower woodland yesterday apricot avocado broccoli cabochon calico camellia carnation chestnut chrysanthemum clementine cranberry croissant daffodil dragonfruit evergreen forgetmenot freesia gooseberry hyacinth hydrangea jasmine juniper magnolia mandarin mistletoe mulberry nutmeg origami pancake papaya parsley passionfruit peony periwinkle petunia porcelain raspberry sakura scallop seahorse sequoia shortbread smoothie snowberry sorbet spearmint sprinkle succulent terracotta turquoise verbena wisteria zucchini
`.trim().split(/\s+/))];
const milestones = [
  {id:'little',time:0,title:'Little pal',look:'Vanilla Puff',icon:'♡',color:'#fff5d7',hat:''},
  {id:'sprout',time:30,title:'Brave little sprout',look:'Mint sprout',icon:'🌱',color:'#e1ebcc',hat:'🌱'},
  {id:'blossom',time:60,title:'Blossom buddy',look:'Peach blossom',icon:'🌸',color:'#f7dce0',hat:'🌸'},
  {id:'cloud',time:120,title:'Cloud keeper',look:'Blue cloud beret',icon:'☁',color:'#dcecf3',hat:'☁'},
  {id:'star',time:180,title:'Starlight guardian',look:'Lavender star',icon:'⭐',color:'#e7ddf5',hat:'⭐'},
  {id:'royal',time:300,title:'Cozy little legend',look:'Golden crown',icon:'👑',color:'#ffedb9',hat:'👑'},
  {id:'traveler',time:Infinity,title:'Little traveler',look:'Sage travel hat',icon:'👒',color:'#e1ebcc',hat:'👒',requirement:'Finish The Moonflower Garden'},
  {id:'raincoat',time:Infinity,title:'Rainy-day dreamer',look:'Yellow rain hat',icon:'☂',color:'#fff0bb',hat:'☂',requirement:'Finish A Letter on a Rainy Day'}
];
// Weather & wildflowers: collect colored words, then cast them yourself.
const spells = [
  {id:'breeze',word:'breeze',icon:'〰',name:'Meadow breeze',color:'#e2edda',ink:'#526c42',description:'Slow every monster by 55% for 7 seconds.',key:'1'},
  {id:'frost',word:'frost',icon:'❄',name:'Winter hush',color:'#e0edf6',ink:'#486c86',description:'Freeze every monster for 4 seconds.',key:'2'},
  {id:'aurora',word:'aurora',icon:'✦',name:'Northern lights',color:'#eae0f4',ink:'#755391',description:'Send all monsters on screen home.',key:'3'},
  {id:'tide',word:'tide',icon:'≈',name:'Gentle tide',color:'#dcefeb',ink:'#41766b',description:'Move every monster back by 120 pixels.',key:'4'},
  {id:'bloom',word:'bloom',icon:'✿',name:'Garden wish',color:'#f5dfe7',ink:'#9a5c72',description:'Restore one heart.',key:'5'}
];
let state, last = 0, sound = false, audio, lastTone = -100;
let guideReturn=null;
try { sound = localStorage.getItem('puffpals-sound') === 'on'; } catch {}
let best = {time:0,level:1,words:0};
let collection = {unlocked:['little'],equipped:'little'};
try {
  const saved = JSON.parse(localStorage.getItem('puffpals-best') || '{}');
  for (const key of Object.keys(best)) if (Number.isFinite(saved[key]) && saved[key]>=0) best[key]=saved[key];
  const looks=JSON.parse(localStorage.getItem('puffpals-collection') || '{}');
  collection.unlocked=milestones.filter(m=>m.time<=best.time || looks.unlocked?.includes(m.id)).map(m=>m.id);
  if(collection.unlocked.includes(looks.equipped)) collection.equipped=looks.equipped;
} catch {}
const format = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(Math.floor(s%60)).padStart(2,'0')}`;
function save(){try{localStorage.setItem('puffpals-best',JSON.stringify(best));localStorage.setItem('puffpals-collection',JSON.stringify(collection));}catch{}}
function records(){ $('best-time').textContent=format(best.time); $('best-level').textContent=best.level; $('best-words').textContent=best.words; }
function applyLook(){
  const look=milestones.find(m=>m.id===collection.equipped) || milestones[0];
  for(const puff of document.querySelectorAll('.puff')){
    puff.style.setProperty('--puff-color',look.color);
    if(look.hat) puff.dataset.crown=look.hat; else puff.removeAttribute('data-crown');
  }
  $('puff-title').textContent=`Puff · ${look.title}`;
}
function renderCollection(){
  $('collection-count').textContent=`${collection.unlocked.length} / ${milestones.length} looks`;
  $('achievement-list').innerHTML=milestones.map(m=>{
    const unlocked=collection.unlocked.includes(m.id),selected=m.id===collection.equipped;
    return `<button class="achievement-card ${selected?'selected':''}" data-look="${m.id}" ${unlocked?'':'disabled'} aria-pressed="${selected}"><span class="look-preview" style="--look-color:${m.color}"><span>${unlocked?m.icon:'◇'}</span><i>•ᴗ•</i></span><strong>${m.title}</strong><span>${m.look}</span><small>${selected?'Wearing now':unlocked?'Wear this look':m.requirement||`Survive ${format(m.time)}`}</small></button>`;
  }).join('');
  $('achievement-list').querySelectorAll('[data-look]').forEach(button=>button.onclick=()=>{
    collection.equipped=button.dataset.look;save();applyLook();renderCollection();
  });
}
function checkMilestones(){
  const earned=milestones.filter(m=>state.time>=m.time && !collection.unlocked.includes(m.id));
  if(!earned.length)return;
  for(const m of earned){collection.unlocked.push(m.id);state.earned.push(m.id);}
  const newest=earned[earned.length-1];collection.equipped=newest.id;
  best.time=Math.max(best.time,Math.floor(state.time));save();records();applyLook();renderCollection();
  const note=document.createElement('div');note.className='achievement-toast';
  note.innerHTML=`<span>${newest.icon}</span><div><small>A FOREVER TREASURE</small><strong>${newest.title}</strong><span>${newest.look} is yours. Keep going, little pal!</span></div>`;
  note.addEventListener?.('animationend',()=>note.remove(),{once:true});$('arena').append(note);tone(880,.2);
}
function tone(freq=600,duration=.1){
  if(!sound)return;const now=performance.now();if(now-lastTone<25)return;lastTone=now;
  try{audio ||= new (window.AudioContext || window.webkitAudioContext)();if(audio.state==='suspended')audio.resume()?.catch(()=>{});const o=audio.createOscillator(),g=audio.createGain();o.type='sine';o.connect(g);g.connect(audio.destination);o.frequency.setValueAtTime(freq,audio.currentTime);o.frequency.exponentialRampToValueAtTime(freq*.82,audio.currentTime+duration);g.gain.setValueAtTime(.001,audio.currentTime);g.gain.exponentialRampToValueAtTime(.026,audio.currentTime+.008);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);o.onended=()=>{o.disconnect();g.disconnect();};o.start();o.stop(audio.currentTime+duration+.01);}catch{}
}
function renderSound(){
  $('sound-button').setAttribute('aria-pressed',String(sound));$('sound-button').setAttribute('aria-label',sound?'Disable sound':'Enable sound');$('sound-button').innerHTML=`♪ <span>Sound ${sound?'on':'off'}</span>`;
}
function openGuide(){
  const inStory=!$('story').hidden,inGame=Boolean(state&&!$('game').hidden&&state.mode!=='menu');
  const storyPlaying=inStory&&typeof stroll!=='undefined'&&stroll&&!stroll.paused&&!stroll.finished;
  guideReturn={game:state?.mode==='playing',story:Boolean(storyPlaying),inStory,inGame,focus:document.activeElement};
  if(guideReturn.game)pause();if(guideReturn.story)toggleStrollPause();
  $('guide-play').textContent=inStory?'Back to your story ↗':inGame?'Back to your adventure ↗':'Got it. Let’s play Typefall ↗';
  $('how-dialog').showModal();
}
function returnFromGuide(){
  const returning=guideReturn;guideReturn=null;if(!returning)return;
  if(returning.game&&state?.mode==='paused')resume();
  if(returning.story&&typeof stroll!=='undefined'&&stroll?.paused&&!stroll.finished&&!$('story').hidden)toggleStrollPause();
  else returning.focus?.focus?.();
}
function closeGuide(){$('how-dialog').close();returnFromGuide();}
function celebrateFriend(c){
  const width=Number.parseFloat(c.el.style.width)||120;
  for(let i=0;i<4;i++){
    const particle=document.createElement('span');particle.className=`particle${i===3?' xp-particle':''}`;
    particle.textContent=i===3?'+3 friendship':['✦','♡','✧'][i];
    particle.style.left=`${c.x+width/2-12}px`;particle.style.top=`${c.y+28}px`;
    particle.style.color=c.spell?spells.find(s=>s.id===c.spell).ink:'#a08ab6';
    particle.style.setProperty('--dx',`${(i-1.5)*24}px`);particle.style.setProperty('--dy',`${-30-i*10}px`);
    particle.addEventListener?.('animationend',()=>particle.remove(),{once:true});$('effects').append(particle);
  }
  state.smileUntil=state.time+.65;$('game-puff').classList.add('happy');
}
function spellStatus(text){$('spell-message').textContent=text;}
function renderSpells(){
  $('spell-list').innerHTML=spells.map(spell=>{
    const count=state?.inventory[spell.id]||0;
    return `<button class="spell-card ${count?'collected':''}" data-spell="${spell.id}" style="--spell-color:${spell.color};--spell-ink:${spell.ink}" ${state?.mode==='playing'&&count?'':'disabled'} aria-label="Cast ${spell.word}, ${count} collected. ${spell.description}"><div class="spell-card-heading"><span>${spell.icon} ${spell.word}</span><span class="spell-count">×${count}</span></div><strong>${spell.name}</strong><p>${spell.description}</p><small><kbd>${spell.key}</kbd> ${count?'Cast spell':'Collect its colored word'}</small></button>`;
  }).join('');
  $('spell-list').querySelectorAll('[data-spell]').forEach(button=>button.onclick=()=>castSpell(button.dataset.spell));
}
function start(){
  state={mode:'playing',time:0,level:1,xp:0,need:18,cleared:0,hearts:3,creatures:[],target:null,spawn:.6,spawnCount:0,frozen:0,slow:0,earned:[],usedWords:new Set(),inventory:Object.fromEntries(spells.map(spell=>[spell.id,0]))};
  $('menu').hidden=true;$('story').hidden=true;$('game').hidden=false;$('overlay').hidden=true;$('word-layer').replaceChildren();$('effects').replaceChildren();$('arena').querySelectorAll('.achievement-toast').forEach(note=>note.remove());$('game-puff').className='puff game-puff';spellStatus('Collect colored words. Cast with 1–5 or click a spell.');applyLook();renderSpells();hud();last=performance.now();
}
function wave(){return Math.floor(state.time/40)+1;}
function resting(){return state.time%40>=35;}
// Difficulty steps up at wave boundaries and stays steady within each wave.
function spawnInterval(){return Math.max(.5,2.6*Math.pow(.76,wave()-1));}
function spawnGroupSize(){
  // Every fourth arrival becomes a small crowd later in the adventure.
  if(wave()<3 || state.spawnCount%4!==0)return 1;
  return wave()>=6?3:2;
}
function speed(){return Math.min(150,22+(wave()-1)*14);}
function hud(){
  $('level').textContent=state.level;$('time').textContent=format(state.time);$('cleared').textContent=state.cleared;$('xp-label').textContent=`${state.xp} / ${state.need} XP`;$('xp-fill').style.width=`${Math.min(100,100*state.xp/state.need)}%`;
  $('hearts').textContent='♥ '.repeat(state.hearts)+'♡ '.repeat(3-state.hearts);$('hearts').setAttribute('aria-label',`${state.hearts} of 3 hearts`);
  const next=milestones.find(m=>Number.isFinite(m.time)&&!collection.unlocked.includes(m.id));
  $('milestone-goal').textContent=next?`${next.icon} Next forever treasure: ${next.title} · survive ${format(next.time)} (${format(Math.max(0,next.time-state.time))} to go)`:'👑 All forever treasures unlocked · keep making little magic';
  $('milestone-fill').style.width=`${next?Math.min(100,state.time/next.time*100):100}%`;
  $('wave-label').textContent=resting()?`☁ Cozy breather · ${Math.ceil(40-state.time%40)}s`:`Wave ${wave()} · little friends incoming`;
  const effects=[];
  if(state.slow>0)effects.push(`〰 Breeze · ${Math.ceil(state.slow)}s`);
  if(state.frozen>0)effects.push(`❄ Frost · ${Math.ceil(state.frozen)}s`);
  $('spell-active').textContent=effects.join(' · ') || 'Your magic waits for you';

}
function nextWord(){
  const maxLength=Math.min(13,5+wave()-1);
  const active=new Set(state.creatures.map(c=>c.word));
  const eligible=words.filter(word=>word.length<=maxLength && !active.has(word) && !spells.some(spell=>spell.word===word));
  let fresh=eligible.filter(word=>!state.usedWords.has(word));
  if(!fresh.length){
    // Recycle only after exhausting the available vocabulary, keeping recent words out.
    state.usedWords=new Set([...state.usedWords].slice(-40));
    fresh=eligible.filter(word=>!state.usedWords.has(word));
  }
  if(!fresh.length)return null;
  const word=fresh[Math.floor(Math.random()*fresh.length)];state.usedWords.add(word);return word;
}
function laneLayout(){
  const width=$('arena').clientWidth;
  const count=Math.max(1,Math.floor(width/170));
  return {count,width:width/count};
}
function spawn(forcedKind){
  const layout=laneLayout();
  const lanes=Array.from({length:layout.count},(_,lane)=>lane).filter(lane=>!state.creatures.some(c=>c.lane===lane&&c.y<112));
  // If all entrances are busy, wait instead of overlapping word labels.
  if(!lanes.length)return null;
  const lane=lanes[Math.floor(Math.random()*lanes.length)];
  const active=new Set(state.creatures.map(c=>c.word));
  const available=spells.filter(spell=>!active.has(spell.word));
  const special=forcedKind && forcedKind!=='normal'?available.find(spell=>spell.id===forcedKind)||available[0]:!forcedKind&&state.spawnCount%5===0&&state.spawnCount>0?available[Math.floor(Math.random()*available.length)]:null;
  const word=special?special.word:nextWord();if(!word)return null;
  const el=document.createElement('div');el.className='word creature'+(special?' spell-word':'');
  if(special){el.style.setProperty('--spell-color',special.color);el.style.setProperty('--spell-ink',special.ink);}
  el.style.setProperty('--friend-color',special?special.color:['#e6dfef','#dfe8d0','#f4dce1','#dcebef'][Math.floor(Math.random()*4)]);
  el.innerHTML='<div class="word-label"></div><div class="friend"><i class="friend-eye left"></i><i class="friend-eye right"></i><i class="friend-blush left"></i><i class="friend-blush right"></i><i class="friend-smile"></i></div>';
  const c={word,spell:special?.id||null,el,lane,x:lane*layout.width+6,y:0,typed:0};
  el.style.width=`${layout.width-12}px`;$('word-layer').append(el);state.creatures.push(c);render(c);return c;
}
function render(c){c.el.style.transform=`translate(${c.x}px,${c.y}px)`;c.el.classList.toggle('target',state.target===c);c.el.classList.toggle('error',state.time<c.errorUntil);c.el.querySelector('.word-label').innerHTML=`${c.spell?'<span class="spell-word-mark" aria-label="Collectible spell">✦</span> ':''}<span class="typed">${c.word.slice(0,c.typed)}</span><span class="remaining">${c.word.slice(c.typed)}</span>`;}
function remove(c){c.el.remove();state.creatures=state.creatures.filter(x=>x!==c);if(state.target===c)state.target=null;}
function sendHome(c){
  if(!state.creatures.includes(c))return;
  celebrateFriend(c);
  remove(c);state.cleared++;state.xp+=3;
  if(c.spell){
    state.inventory[c.spell]++;
    spellStatus(`Collected “${c.word}”. Press ${spells.find(spell=>spell.id===c.spell).key} to cast it.`);renderSpells();
  }
  tone(650);if(state.xp>=state.need)levelUp();hud();
}
function castSpell(id){
  if(state?.mode!=='playing'||!state.inventory[id])return;
  const spell=spells.find(spell=>spell.id===id);if(!spell)return;
  if(id==='bloom'&&state.hearts===3){spellStatus('Your hearts are full. Save bloom for later.');return;}
  if(['aurora','tide'].includes(id)&&!state.creatures.length){spellStatus('No monsters yet. Your spell is saved for later.');return;}
  state.inventory[id]--;
  if(id==='breeze')state.slow+=7;
  if(id==='frost')state.frozen+=4;
  if(id==='aurora')for(const c of [...state.creatures])remove(c);
  if(id==='tide')for(const c of state.creatures){c.y-=120;render(c);}
  if(id==='bloom')state.hearts=Math.min(3,state.hearts+1);
  spellStatus(`Cast “${spell.word}” · ${spell.description}`);tone(800);renderSpells();hud();
}
function resizeLanes(){
  if(!state)return;
  const layout=laneLayout(),tails=Array(layout.count).fill(Infinity);
  for(const c of [...state.creatures].sort((a,b)=>b.y-a.y)){
    const lane=tails.indexOf(Math.max(...tails));
    c.lane=lane;c.y=Math.min(c.y,tails[lane]-112);tails[lane]=c.y;c.x=lane*layout.width+6;c.el.style.width=`${layout.width-12}px`;render(c);
  }
}
function overlay(html,mode){state.mode=mode;$('overlay-content').innerHTML=html;$('overlay').hidden=false;renderSpells();hud();}
function resume(){state.mode='playing';$('overlay').hidden=true;last=performance.now();renderSpells();hud();}
function levelUp(){
  while(state.xp>=state.need){state.xp-=state.need;state.level++;state.need=18+(state.level-1)*6;}
  hud();
}
function home(){best.time=Math.max(best.time,Math.floor(state.time));best.level=Math.max(best.level,state.level);best.words=Math.max(best.words,state.cleared);save();records();renderCollection();state.mode='menu';$('game').hidden=true;$('menu').hidden=false;applyLook();}
function end(){
  best.time=Math.max(best.time,Math.floor(state.time));best.level=Math.max(best.level,state.level);best.words=Math.max(best.words,state.cleared);save();records();renderCollection();
  const next=milestones.find(m=>Number.isFinite(m.time)&&!collection.unlocked.includes(m.id));
  overlay(`<div class="eyebrow">EVERY FRIENDSHIP NEEDS A LITTLE REST</div><h2>Time for a cozy nap.</h2><p>You and Puff made a little magic. Ready for another adventure?</p><div class="results"><div><strong>${format(state.time)}</strong><span>Time together</span></div><div><strong>${state.cleared}</strong><span>Friends sent home</span></div><div><strong>${state.level}</strong><span>Friendship level</span></div></div>${state.earned.length?`<p class="new-records">Forever treasures: ${state.earned.map(id=>{const m=milestones.find(m=>m.id===id);return `${m.icon} ${m.title}`;}).join(' · ')}</p>`:''}<p>${next?`Next treasure: ${next.icon} ${next.title} · survive ${format(next.time)} in one adventure.`:'Every little treasure is yours. Puff is a cozy little legend!'}</p><div class="overlay-actions"><button class="primary" id="again">Play again ↗</button><button class="secondary" id="home">Back home & looks</button></div>`,'ended');
  $('again').onclick=start;$('home').onclick=home;
}
function pause(){if(!state)return;if(state.mode==='paused'){resume();return;}if(state.mode!=='playing')return;overlay('<div class="eyebrow">TAKE A BREATHER</div><h2>Puff is waiting for you.</h2><p>Your little adventure is safely paused.</p><div class="overlay-actions"><button class="primary" id="resume">Keep playing ↗</button><button class="secondary" id="quit">Back home & looks</button></div>','paused');$('resume').onclick=resume;$('quit').onclick=home;}
function update(dt){
  if(state?.mode!=='playing')return;
  state.time+=dt;checkMilestones();
  $('game-puff').classList.toggle('happy',state.time<(state.smileUntil||0));
  // All monsters share the same motion, preserving their lane spacing.
  const movingTime=Math.max(0,dt-state.frozen);
  const slowedTime=Math.min(movingTime,Math.max(0,state.slow-state.frozen));
  const distance=speed()*(slowedTime*.45+(movingTime-slowedTime))*(resting()?.45:1);
  state.frozen=Math.max(0,state.frozen-dt);state.slow=Math.max(0,state.slow-dt);
  for(const c of [...state.creatures]){
    c.y+=distance;render(c);
    if(c.y>$('arena').clientHeight-150){remove(c);state.hearts--;tone(240);if(state.hearts<=0){end();break;}}
  }
  if(state.mode==='playing'){
    state.spawn-=dt;
    if(state.spawn<=0&&!resting()){
      state.spawnCount++;
      for(let i=0;i<spawnGroupSize();i++)spawn();
      state.spawn=spawnInterval();
    }
  }
  hud();
}
function tick(now){const dt=Math.max(0,Math.min((now-last)/1000,.05));last=now;update(dt);requestAnimationFrame(tick);}
document.addEventListener('keydown',e=>{
  if(!$('story').hidden||$('how-dialog').open)return;
  if(e.key==='Escape'){e.preventDefault();pause();return;}
  if(state?.mode!=='playing'||e.ctrlKey||e.metaKey||e.altKey||e.isComposing)return;
  const spell=spells.find(spell=>spell.key===e.key);
  if(spell){e.preventDefault();castSpell(spell.id);return;}
  if(e.key==='Backspace'){e.preventDefault();if(state.target){state.target.typed=0;const c=state.target;state.target=null;render(c);}return;}
  if(!/^[a-zA-Z]$/.test(e.key))return;e.preventDefault();const key=e.key.toLowerCase();
  const visible=state.creatures.filter(c=>c.y>=0).sort((a,b)=>b.y-a.y);
  if(state.target && state.target.word[state.target.typed]!==key){
    const previous=state.target;
    const prefix=previous.word.slice(0,previous.typed);
    // Resolve shared first letters using what the player actually types.
    const matching=visible.find(c=>c!==previous && c.word.startsWith(prefix+key));
    const replacement=matching || visible.find(c=>c!==previous && c.word[0]===key);
    if(replacement){
      previous.typed=0;state.target=replacement;replacement.typed=matching?prefix.length:0;render(previous);
    }
  }
  if(!state.target)state.target=visible.find(c=>c.word[0]===key)||null;
  const c=state.target;if(!c)return;
  if(c.word[c.typed]===key){c.typed++;tone(400+c.typed*40);if(c.typed===c.word.length)sendHome(c);else render(c);}
  else{c.errorUntil=state.time+.2;render(c);}
});
$('play-button').onclick=start;$('guide-play').onclick=()=>{const continueAdventure=guideReturn?.inStory||guideReturn?.inGame;closeGuide();if(!continueAdventure)start();};$('how-button').onclick=openGuide;$('close-how').onclick=closeGuide;$('how-dialog').onclose=returnFromGuide;$('how-dialog').oncancel=event=>{event.preventDefault();closeGuide();};$('pause-button').onclick=pause;
$('sound-button').onclick=()=>{sound=!sound;try{localStorage.setItem('puffpals-sound',sound?'on':'off');}catch{}renderSound();tone();};
document.addEventListener('visibilitychange',()=>{if(document.hidden&&state?.mode==='playing')pause();});
window.addEventListener('resize',resizeLanes);
records();renderCollection();applyLook();renderSpells();renderSound();requestAnimationFrame(tick);
