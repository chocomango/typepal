'use strict';
const stories = [
  {id:'moonflower',title:'The Moonflower Garden',icon:'☾',reward:'Moonflower postcard',text:`Puff woke to the smell of warm bread drifting through the window. Outside, a tiny snail waited beside a folded map. "The moonflower garden opens tonight," said the snail. "Shall we take the long way?" Puff packed a pear, a little blanket, and a cup with a chipped blue handle. There was plenty of time before the moon arrived.

Their first stop was a bakery at the edge of the village. A rabbit in a floury apron gave them two buns and asked them to deliver a third to the bridge keeper. The snail tucked the parcel into a basket. Puff promised to carry it carefully, although the smell made that promise a little difficult. They waved goodbye and followed the path between the cottages.

Beyond the last cottage, the meadow opened like a green book. Butterflies rested on clover, and the breeze made the tall grass bow. Puff noticed that the snail stopped often to look at small things: a shiny seed, a feather, a bead of water on a leaf. Walking slowly, Puff discovered, meant there was more of the world to see. They sat beneath a willow and shared the pear.

At the bridge, a sleepy otter was polishing the wooden rails. She accepted the bun with a delighted smile. In return, she gave Puff a ribbon the color of evening. "Tie this around your cup," she said. "Then you will always know which one is yours at the garden picnic." The snail thanked her, and they crossed while the river whispered under their feet.

The path grew quieter as they climbed the hill. A few early stars appeared above the trees. Puff felt tired, so they spread the blanket beside a mossy stone and waited for a moment. The snail pointed out a little light moving through the ferns. Soon there were ten, then twenty. Fireflies were leading them toward a wooden gate.

Inside the garden, everyone was speaking softly. A mouse poured warm tea. A hedgehog passed around a bowl of berries. Puff set the blue cup on the table and tied the ribbon into a bow. When the moon rose, the pale flowers opened one by one, filling the air with a gentle scent. Puff leaned against the snail's basket and smiled. The long way had brought them here, with a whole day of tiny treasures to remember. Before heading home, Puff pressed a fallen petal between the pages of the map. Tomorrow, there would be fresh bread, another quiet path, and perhaps a new friend waiting by the window. Tonight, there was only warm tea and the moon.`},
  {id:'rainy',title:'A Letter on a Rainy Day',icon:'☂',reward:'Rainy-day postcard',text:`Rain tapped on the roof of Puff's little house, making a sound like a thousand tiny footsteps. Puff pulled a blanket around their shoulders and watched the garden turn silver. On the doorstep sat a damp envelope with a drawing of a teapot. Inside was a note from a friend across the valley. "The kettle is warm," it said. "There is a chair by the window waiting for you."

Puff found a yellow raincoat hanging behind the door. One pocket held a smooth pebble; the other held a forgotten biscuit. After wrapping the biscuit in paper, Puff took an umbrella and stepped outside. The puddles reflected the sky, and each one seemed to contain a different cloud. Puff walked around the smallest puddles and carefully through the largest.

At the village bakery, a fox was sheltering beneath the striped awning. He had a box of cinnamon rolls but no umbrella. Puff offered to share. They walked together as far as the meadow, where the fox's sister was waiting in a little cart. Before leaving, the fox gave Puff a roll still warm from the oven. Its sweetness made the rainy morning feel a little brighter.

The meadow was almost empty. A frog sat on a fence post, looking very pleased with the weather. He told Puff that rain was excellent for the beans, the flowers, and the pond. Puff had never thought of rain as a gift before. They listened to the drops falling from the leaves and began to hear a kind of music. Even the umbrella had its own small drumbeat.

At the bridge, the river was brown and busy. An otter showed Puff the safest place to cross and offered a dry cloth for the umbrella handle. Puff thanked her with the biscuit from their pocket. On the other side, the path curved through a grove of birch trees. Between the trunks, a window shone like a square of honey. A small curl of steam rose from the chimney.

Puff knocked on the door, and their friend opened it before the second knock. There was tea, a soft towel, and exactly the promised chair by the window. They shared the cinnamon roll while the rain continued outside. Later, Puff wrote a letter of their own, inviting the frog, the fox, and the otter to visit when the garden dried. The envelope was decorated with a little yellow umbrella. Puff set it beside the door, ready for another journey. Sometimes a rainy day did not keep the world away. Sometimes it brought the whole world closer.`}
];
const storyDetails={
  moonflower:{theme:'moonflower',description:'Take the scenic path with a very small snail. A moonlit picnic is waiting at the end.',minutes:'8–11 min',difficulty:'Unhurried',kicker:'A MOONLIT LITTLE ADVENTURE',outfit:'traveler',palette:{sky:'#f1edff',ground:'#cce4ce',accent:'#8c78be'},chapters:[
    {title:'An invitation at the window',caption:'A tiny friend, a folded map, and a whole day to wander.'},
    {title:'The village bakery',caption:'Warm buns and a small kindness to carry along.'},
    {title:'Meadow treasures',caption:'Slow steps leave room for the loveliest little things.'},
    {title:'The bridge keeper',caption:'The river whispers beneath your feet.'},
    {title:'A trail of fireflies',caption:'Little lights are showing you the way.'},
    {title:'The moonflower picnic',caption:'A blue cup, good company, and flowers opening to the moon.'}
  ]},
  rainy:{theme:'rainy',description:'Share an umbrella, meet your neighbors, and find the warmest chair on a rainy day.',minutes:'8–10 min',difficulty:'Unhurried',kicker:'A RAINY DAY RAMBLE',outfit:'raincoat',palette:{sky:'#e0edf5',ground:'#cfe1dc',accent:'#d9b66e'},chapters:[
    {title:'A letter in the rain',caption:'Somewhere across the valley, a kettle is already warm.'},
    {title:'Pockets full of possibility',caption:'A raincoat, a pebble, and one rather useful biscuit.'},
    {title:'Room under the umbrella',caption:'The morning gets sweeter when you share a little shelter.'},
    {title:'The meadow’s small orchestra',caption:'Listen closely. Even an umbrella has a song.'},
    {title:'A window like honey',caption:'Follow the birch trees toward a curl of chimney steam.'},
    {title:'The chair by the window',caption:'Let the rain keep tapping. You have arrived.'}
  ]}
};
stories.push(
  {id:'stars',theme:'stars',title:'A Pocketful of Stars',icon:'✦',reward:'Starlight postcard',outfit:'traveler',description:'A short evening walk to find something small, bright, and worth sharing.',minutes:'3–5 min',difficulty:'Gentle',kicker:'SHORT & SWEET',palette:{sky:'#e6e3fb',ground:'#c2d6df',accent:'#d0b467'},chapters:[
    {title:'One little light',caption:'A wish can be very small and still light up a room.'},
    {title:'The hill behind the house',caption:'Bring a blanket. The best seats are on the grass.'},
    {title:'A pocketful of wishes',caption:'Some treasures are made to be given away.'},
    {title:'A light to bring home',caption:'There is enough wonder here for everyone.'}
  ],text:`Puff found a paper star on the kitchen floor. It was no bigger than a leaf, with a little fold down the middle. On the back, someone had written, "For a clear night." Puff looked out the window. The sky was soft and blue. It would be a clear night indeed.

At dusk, Puff took the star and a blanket to the hill behind the house. A mouse was there with a jar of warm milk. A moth rested on the jar lid. "We saved you a spot," said the mouse. The three friends sat down as the first real star came out.

Puff made a wish for the mouse: a full jar and a dry roof. Then a wish for the moth: a lamp that was never too hot. "And one for you," said the mouse. "A pocket big enough for all the good things you find." Puff smiled and tucked the paper star inside.

They stayed until the moon rose over the hill. On the way home, Puff left the star by a neighbor's door. Below the first note, Puff had added a few words: "There is a place for you on the hill." In the morning, a second paper star was waiting by Puff's window. It said, "I will bring the biscuits."`},
  {id:'tea',theme:'tea',title:'The Little Tea Shop',icon:'☕',reward:'Tea shop postcard',outfit:'traveler',description:'Help a sleepy tea shop open its doors. There is a perfect cup for every new friend.',minutes:'6–8 min',difficulty:'Easygoing',kicker:'A CUP OF SOMETHING LOVELY',palette:{sky:'#f8ebd8',ground:'#d7e2ca',accent:'#b58f61'},chapters:[
    {title:'The shop with the blue door',caption:'A new day begins with a key and a very sleepy kettle.'},
    {title:'Making room for everyone',caption:'A little care makes an ordinary table feel like home.'},
    {title:'The first customer',caption:'Sometimes a quiet cup is exactly what a friend needs.'},
    {title:'A rather splendid recipe',caption:'A pinch of this, a spoonful of that, and plenty of company.'},
    {title:'The longest table',caption:'Pull up another chair. There is always a little more room.'},
    {title:'One last cup',caption:'The loveliest part of the day is the warmth that stays.'}
  ],text:`The little tea shop had a blue door and a bell that sounded like a spoon touching a cup. Every morning, Mrs. Moss opened it before the village woke. Today, she had a sore paw. "Could you mind the shop?" she asked Puff. "The kettle knows what to do. It only needs a little encouragement." Puff turned the key and whispered good morning to the kettle.

First came the tablecloths: one green, one yellow, and one with tiny pears. Puff set a flower on each table and put the cups within easy reach. The smallest cup went on the lowest shelf. A wobbly chair needed a folded napkin under one leg. By the time the bell rang, the room smelled of mint and toast.

The first customer was a hedgehog carrying a heavy book. "Something quiet, please," she said. Puff made chamomile tea and chose the table by the window. Outside, a sparrow was having a very loud opinion about a twig. The hedgehog laughed. "Quiet enough," she said, opening her book. Puff left a biscuit beside her cup.

Next, two squirrels arrived with a recipe written on the back of a leaf. It called for apple peel, cinnamon, and a spoonful of honey. They helped Puff measure everything into a pot. One squirrel stirred while the other counted the cups. They forgot what number came after five, so everyone counted again. The tea tasted like the first cool day of autumn.

By noon, every table was full. A rabbit brought extra chairs. The hedgehog closed her book to help carry cups. Puff moved the small tables together until they made one long, cheerful table. Strangers passed the honey to one another and slowly became friends. When Mrs. Moss came to check on the shop, someone had saved her the best seat.

At closing time, Puff washed the cups and swept up a trail of crumbs. Mrs. Moss made one last pot of tea. They sat by the blue door, watching the village windows glow. "You did very well," she said. Puff thought of the wobbly chair, the squirrels, and the biscuit by the book. The kettle gave a soft click. Tomorrow, there would be more cups to fill. For now, this one was perfect.`}
);
for(const story of stories){Object.assign(story,storyDetails[story.id]||{});story.text=story.text.replace(/\n\n/g,'\n');}
let stroll=null,strollSave=null,strollSaves={},scrapbook=[],storyRecords={},punctuationOn=true,storyFocusOn=false,storyStatsOn=true;
try{
  punctuationOn=localStorage.getItem('puffpals-stroll-punctuation')!=='off';
  storyFocusOn=localStorage.getItem('puffpals-stroll-focus')==='on';
  storyStatsOn=localStorage.getItem('puffpals-stroll-stats')!=='off';
}catch{}
function readStoryJSON(key,fallback){try{return JSON.parse(localStorage.getItem(key)||'null')??fallback;}catch{return fallback;}}
function validStorySave(value,id){
  return value&&typeof value==='object'&&!Array.isArray(value)&&typeof value.typed==='string'&&stories.some(story=>story.id===value.id)&&(!id||value.id===id)?value:null;
}
const storedStrollSaves=readStoryJSON('puffpals-stroll-saves',{});
if(storedStrollSaves&&typeof storedStrollSaves==='object'&&!Array.isArray(storedStrollSaves)){
  for(const story of stories){const saved=validStorySave(storedStrollSaves[story.id],story.id);if(saved)strollSaves[story.id]=saved;}
}
strollSave=validStorySave(readStoryJSON('puffpals-stroll-save',null));
if(strollSave){if(!strollSaves[strollSave.id])strollSaves[strollSave.id]=strollSave;else strollSave=strollSaves[strollSave.id];}
else strollSave=Object.values(strollSaves).at(-1)||null;
try{if(Object.keys(strollSaves).length)localStorage.setItem('puffpals-stroll-saves',JSON.stringify(strollSaves));}catch{}
const storedPostcards=readStoryJSON('puffpals-postcards',[]);
scrapbook=Array.isArray(storedPostcards)?[...new Set(storedPostcards.filter(id=>stories.some(story=>story.id===id)))]:[];
const storedStoryRecords=readStoryJSON('puffpals-story-records',{});
storyRecords=storedStoryRecords&&typeof storedStoryRecords==='object'&&!Array.isArray(storedStoryRecords)?storedStoryRecords:{};
function escapeStory(text){return String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function storyText(id,value){const element=$(id);if(element)element.textContent=value;}
function storyNumber(value){return Number.isFinite(value)?Math.max(0,value):0;}
function saveStroll(){
  if(!stroll)return;
  const saved={id:stroll.story.id,typed:stroll.typed,elapsed:stroll.elapsed,attempts:stroll.attempts,correct:stroll.correct,punctuation:punctuationOn,maxCombo:stroll.maxCombo};
  if(stroll.finished){delete strollSaves[stroll.story.id];strollSave=Object.values(strollSaves).at(-1)||null;}
  else{strollSaves[stroll.story.id]=saved;strollSave=saved;}
  try{
    localStorage.setItem('puffpals-stroll-saves',JSON.stringify(strollSaves));
    if(strollSave)localStorage.setItem('puffpals-stroll-save',JSON.stringify(strollSave));else localStorage.removeItem('puffpals-stroll-save');
    localStorage.setItem('puffpals-postcards',JSON.stringify(scrapbook));
    localStorage.setItem('puffpals-story-records',JSON.stringify(storyRecords));
  }catch{}
}
function renderStoryChoices(){
  $('story-choices').innerHTML=stories.map(story=>{
    const resume=!!strollSaves[story.id],earned=scrapbook.includes(story.id);
    return `<button class="story-choice story-card" data-story="${story.id}" data-theme="${story.theme}" aria-label="${resume?'Continue':'Begin'} ${escapeStory(story.title)}"><span class="story-card-art" data-theme="${story.theme}" aria-hidden="true"><span class="card-moon"></span><span class="card-stars">✦ · ✧</span><span class="card-hill"></span><span class="card-cottage"></span><span class="card-icon">${story.icon}</span></span><span class="story-card-copy"><span class="story-card-kicker">${story.kicker}</span><strong>${escapeStory(story.title)}</strong><span class="story-card-description">${escapeStory(story.description)}</span><small class="story-card-meta">${story.text.split(/\s+/).length} words · ${story.minutes} · ${story.difficulty}</small></span><span class="story-card-action">${resume?'Continue journey':earned?'Visit again':'Begin journey'} <span aria-hidden="true">↗</span>${earned?'<small>Postcard collected ♡</small>':''}</span></button>`;
  }).join('');
  $('story-choices').querySelectorAll('[data-story]').forEach(button=>button.onclick=()=>startStroll(button.dataset.story));
  $('story-postcards').innerHTML=scrapbook.map(id=>{const story=stories.find(s=>s.id===id);return `<span class="postcard">${story.icon} ${story.reward}</span>`;}).join('');
}
function renderStoryPreferences(){
  if(document.body)document.body.dataset.focus=String(storyFocusOn&&!$('story').hidden);
  const focus=$('story-focus');
  if(focus){focus.setAttribute('aria-pressed',String(storyFocusOn));focus.title=storyFocusOn?'Show the story scenery':'A quiet page for just you and the words';}
  storyText('story-focus-label',storyFocusOn?'Leave focus':'Focus');
  const toggle=$('story-stats-toggle');
  if(toggle){toggle.setAttribute('aria-pressed',String(storyStatsOn));toggle.textContent=storyStatsOn?'Hide stats':'Show stats';}
  if($('story-live-stats'))$('story-live-stats').hidden=!storyStatsOn;
}
function toggleStoryFocus(event){storyFocusOn=!storyFocusOn;try{localStorage.setItem('puffpals-stroll-focus',storyFocusOn?'on':'off');}catch{}renderStoryPreferences();if(event?.detail>0&&!stroll?.paused&&!stroll?.finished)focusStroll();}
function toggleStoryStats(event){storyStatsOn=!storyStatsOn;try{localStorage.setItem('puffpals-stroll-stats',storyStatsOn?'on':'off');}catch{}renderStoryPreferences();if(event?.detail>0&&!stroll?.paused&&!stroll?.finished)focusStroll();}
function startStroll(id,restart=false){
  const original=stories.find(story=>story.id===id);if(!original)return;
  if(stroll&&!stroll.finished)saveStroll();
  const saved=!restart?strollSaves[id]||null:null;
  if(saved)punctuationOn=saved.punctuation!==false;
  const story={...original,text:punctuationOn?original.text:original.text.replace(/[^a-zA-Z\s]/g,'')};
  const typed=typeof saved?.typed==='string'?saved.typed.slice(0,story.text.length):'';
  const attempts=Math.max(typed.length,storyNumber(saved?.attempts));
  const correct=Math.min(attempts,storyNumber(saved?.correct));
  stroll={story,typed,elapsed:storyNumber(saved?.elapsed),attempts,correct,combo:0,maxCombo:storyNumber(saved?.maxCombo),paused:false,finished:false,walkUntil:0,celebrateUntil:0,feedbackUntil:0,last:performance.now(),saveClock:0,statsClock:0,snippetKey:null,autoPaused:false};
  if(state)state.mode='menu';
  $('menu').hidden=true;$('game').hidden=true;$('story').hidden=false;
  storyText('story-title',story.title);$('story-input').value=typed;$('story-input').disabled=false;
  $('story-reader').hidden=false;$('story-reader').dataset.paused='false';$('story-results').hidden=true;$('story-pause').disabled=false;storyText('story-pause','Pause');
  const stage=$('story-stage');stage.dataset.theme=story.theme;stage.dataset.motion='resting';stage.dataset.paused='false';stage.dataset.celebrate='false';
  $('story-stops').innerHTML=story.chapters.map((chapter,i)=>`<span><span aria-hidden="true">${i===story.chapters.length-1?story.icon:i===0?'⌂':i%2?'✦':'♧'}</span><small>${escapeStory(chapter.title)}</small></span>`).join('');
  storyText('story-instructions',punctuationOn?'Type at your own pace · Enter for a new paragraph · Esc to pause':'Type at your own pace · just letters, spaces, and paragraph breaks');
  storyText('story-feedback',saved?'Welcome back. Your little journey is right where you left it.':'Settle in. There is no rush.');
  renderPunctuationToggle();renderStoryPreferences();applyLook();renderStroll();saveStroll();focusStroll();
}
function renderPunctuationToggle(){
  $('story-punctuation').innerHTML=`Punctuation <span>${punctuationOn?'on':'off'}</span>`;
  $('story-punctuation').setAttribute('aria-pressed',String(punctuationOn));$('story-punctuation').disabled=false;
}
function toggleStoryPunctuation(){
  if(!stroll||stroll.finished)return;
  const original=stories.find(story=>story.id===stroll.story.id).text;
  const indices=on=>Array.from(original,(_,index)=>index).filter(index=>on||/[a-zA-Z\s]/.test(original[index]));
  const oldIndices=indices(punctuationOn),sourcePosition=oldIndices[stroll.typed.length]??original.length;
  const typedBySource=new Map(oldIndices.slice(0,stroll.typed.length).map((index,i)=>[index,stroll.typed[i]]));
  punctuationOn=!punctuationOn;
  const newIndices=indices(punctuationOn);
  stroll.story={...stroll.story,text:newIndices.map(index=>original[index]).join('')};
  stroll.typed=newIndices.filter(index=>index<sourcePosition).map(index=>typedBySource.get(index)??original[index]).join('');
  stroll.snippetKey=null;$('story-input').value=stroll.typed;
  try{localStorage.setItem('puffpals-stroll-punctuation',punctuationOn?'on':'off');}catch{}
  renderPunctuationToggle();renderStroll();saveStroll();
  storyText('story-instructions',punctuationOn?'Punctuation on · type spaces and punctuation as shown.':'Punctuation off · just letters, spaces, and paragraph breaks.');
  if(!stroll.paused)focusStroll();
}
function firstStoryError(value,text){for(let i=0;i<value.length;i++)if(value[i]!==text[i])return i;return -1;}
function storyEdit(previous,value){
  let start=0;while(start<previous.length&&start<value.length&&previous[start]===value[start])start++;
  let oldEnd=previous.length,newEnd=value.length;
  while(oldEnd>start&&newEnd>start&&previous[oldEnd-1]===value[newEnd-1]){oldEnd--;newEnd--;}
  return {start,end:newEnd};
}
function storyCompletedWords(text,position){return (text.slice(0,position).match(/\S+\s/g)||[]).length+(position===text.length&&/\S$/.test(text)?1:0);}
function storyFeedback(message,celebrate=false){
  storyText('story-feedback',message);stroll.feedbackUntil=performance.now()+3200;
  const feedback=$('story-feedback');if(feedback?.classList)feedback.classList.add('is-visible');
  if(celebrate){stroll.celebrateUntil=performance.now()+1700;$('story-stage').dataset.celebrate='true';}
}
function handleStoryInput(event){
  if(!stroll||stroll.paused||stroll.finished||event?.isComposing)return;
  const input=$('story-input'),value=input.value.slice(0,stroll.story.text.length),previous=stroll.typed;
  const edit=storyEdit(previous,value),added=edit.end-edit.start;
  for(let i=edit.start;i<edit.end;i++){
    stroll.attempts++;
    if(value[i]===stroll.story.text[i]){stroll.correct++;if(/\s/.test(value[i]))stroll.combo++;}
    else stroll.combo=0;
  }
  stroll.maxCombo=Math.max(stroll.maxCombo,stroll.combo);
  if(added){stroll.walkUntil=performance.now()+650;$('story-stage').dataset.motion='walking';}
  stroll.typed=value;input.value=value;renderStroll();saveStroll();
  const error=firstStoryError(value,stroll.story.text);
  storyText('story-instructions',error>=0?'Keep your rhythm. Backspace is here whenever you need it.':stroll.story.text[value.length]==='\n'?'Press Enter. A new little chapter is waiting.':'Backspace to correct · Esc to pause · your place is saved');
  if(value.startsWith(previous)&&added&&error<0){
    const before=storyCompletedWords(stroll.story.text,previous.length),after=storyCompletedWords(stroll.story.text,value.length);
    const last=value[value.length-1];
    if(typeof tone==='function'){if(last==='\n')tone(660,0.14);else if(/\s/.test(last))tone(360+(stroll.combo%3)*20,0.08);}
    if(last==='\n')storyFeedback('A little chapter, beautifully told.',true);
    else if(/[.!?]/.test(last))storyFeedback('Another lovely little sentence.');
    else if(Math.floor(after/20)>Math.floor(before/20))storyFeedback(`${after} words, one lovely rhythm.`,true);
  }
  if(value.length===stroll.story.text.length)finishStroll();
}
function storySnippets(text,maxCharacters=220){
  const snippets=[];let start=0;
  while(start<text.length){
    let end=Math.min(text.length,start+maxCharacters);
    const paragraph=text.indexOf('\n',start);
    if(paragraph>=0&&paragraph<end)end=paragraph+1;
    else if(end<text.length){const space=text.lastIndexOf(' ',end-1);if(space>start)end=space+1;}
    snippets.push({start,end});start=end;
  }
  return snippets;
}
function storyMetrics(){
  let matched=0;for(let i=0;i<stroll.typed.length;i++)if(stroll.typed[i]===stroll.story.text[i])matched++;
  return {wpm:stroll.elapsed>0?Math.round(matched/5/(stroll.elapsed/60)):0,accuracy:stroll.attempts?Math.min(100,Math.round(stroll.correct/stroll.attempts*100)):100};
}
function renderStoryMetrics(){
  const {wpm,accuracy}=storyMetrics();storyText('story-wpm',stroll.elapsed>=1||stroll.finished?wpm:'—');storyText('story-accuracy',`${accuracy}%`);
  storyText('story-combo',stroll.combo||'—');
  storyText('story-time',format(stroll.elapsed));
}
function renderStroll(){
  const text=stroll.story.text,typed=stroll.typed,position=typed.length;
  const cursorError=position>0&&typed[position-1]!==text[position-1];
  const snippets=storySnippets(text,(window.innerWidth||1280)<650?105:220);
  const part=position>=text.length?snippets.length-1:Math.max(0,snippets.findIndex(snippet=>position<snippet.end));
  const snippet=snippets[part],snippetKey=`${snippet.start}:${snippet.end}`,transition=stroll.snippetKey!==snippetKey;
  let html='';
  for(let index=snippet.start;index<snippet.end;index++){
    const char=text[index]==='\n'?'↵':escapeStory(text[index]);
    const kind=index<position?(typed[index]===text[index]?'story-done':'story-wrong'):index===position?`story-current${cursorError?' story-caret-error':''}`:'story-future';
    html+=`<span ${index===position?'id="story-cursor"':''} class="${kind}">${char}</span>`;
  }
  $('story-passage').innerHTML=`<p${transition?' class="story-snippet-enter"':''}>${html}</p>`;
  stroll.snippetKey=snippetKey;storyText('story-snippet-count',`${part+1} / ${snippets.length}`);$('story-reader').scrollTop=0;
  const ratio=position/text.length,percent=Math.round(ratio*100);
  $('story-progress').style.width=`${ratio*100}%`;
  if($('story-total-progress'))$('story-total-progress').style.width=`${ratio*100}%`;
  $('story-puff-anchor').style.left=`calc(6% + ${ratio*88}% - ${ratio*96}px)`;
  const chapter=Math.min(stroll.story.chapters.length-1,(text.slice(0,position).match(/\n/g)||[]).length),scene=stroll.story.chapters[chapter];
  storyText('story-location',scene.title);storyText('story-scene-title',scene.title);storyText('story-scene-description',scene.caption);
  storyText('story-chapter-label',`Chapter ${chapter+1} of ${stroll.story.chapters.length}`);
  $('story-stage').dataset.stop=chapter;$('story-stage').dataset.theme=stroll.story.theme;
  storyText('story-count',`${storyCompletedWords(text,position)} / ${text.split(/\s+/).length} words`);storyText('story-percent',`${percent}%`);
  if($('story-progressbar')){$('story-progressbar').setAttribute('aria-valuenow',String(percent));$('story-progressbar').setAttribute('aria-valuetext',`${percent}% of ${stroll.story.title}, chapter ${chapter+1} of ${stroll.story.chapters.length}`);}
  renderStoryMetrics();
}
function toggleStrollPause(){
  if(!stroll||stroll.finished)return;
  stroll.paused=!stroll.paused;stroll.autoPaused=false;
  $('story-stage').dataset.paused=String(stroll.paused);$('story-stage').dataset.motion='resting';stroll.last=performance.now();
  $('story-input').disabled=stroll.paused;$('story-reader').dataset.paused=String(stroll.paused);storyText('story-pause',stroll.paused?'Resume':'Pause');
  storyText('story-instructions',stroll.paused?'Take a little breather. Your place is safe.':'Backspace to correct · Esc to pause · your place is saved');
  saveStroll();if(!stroll.paused)focusStroll();
}
function storyHome(){saveStroll();$('story').hidden=true;$('menu').hidden=false;renderStoryPreferences();renderStoryChoices();}
function finishStroll(){
  if(typeof tone==='function')tone(784,0.18);
  stroll.finished=true;stroll.celebrateUntil=performance.now()+4000;
  $('story-stage').dataset.paused='true';$('story-stage').dataset.motion='resting';$('story-stage').dataset.celebrate='true';
  const newPostcard=!scrapbook.includes(stroll.story.id);if(newPostcard)scrapbook.push(stroll.story.id);
  const outfit=stroll.story.outfit,newOutfit=!collection.unlocked.includes(outfit);
  if(newOutfit)collection.unlocked.push(outfit);collection.equipped=outfit;save();renderCollection();applyLook();
  const {wpm,accuracy}=storyMetrics(),oldRecord=storyRecords[stroll.story.id];
  const recordKey=punctuationOn?'withPunctuation':'withoutPunctuation';
  const record=oldRecord&&typeof oldRecord==='object'?oldRecord:{};
  const oldBest=record[recordKey];
  const personalBest=stroll.elapsed>0&&(!oldBest||wpm>storyNumber(oldBest.wpm));
  if(personalBest)record[recordKey]={wpm,accuracy,elapsed:stroll.elapsed};
  storyRecords[stroll.story.id]=record;saveStroll();
  $('story-input').disabled=true;$('story-pause').disabled=true;$('story-punctuation').disabled=true;
  const next=stories.find(story=>story.id!==stroll.story.id&&!scrapbook.includes(story.id))||stories[(stories.findIndex(story=>story.id===stroll.story.id)+1)%stories.length];
  const postcard=`<div class="earned-postcard" data-theme="${stroll.story.theme}" aria-hidden="true"><span>${stroll.story.icon}</span><small>A LITTLE MEMORY TO KEEP</small><strong>${escapeStory(stroll.story.reward)}</strong></div>`;
  $('story-results').innerHTML=`${postcard}<div class="eyebrow">A LITTLE JOURNEY, BEAUTIFULLY FINISHED</div><h2>You made it, little traveler.</h2><p>${stroll.story.icon} ${stroll.story.reward} ${newPostcard?'added to your scrapbook':'is waiting in your scrapbook'}.${newOutfit?' A new travel look is yours!':''}</p><div class="results"><div><strong>${format(stroll.elapsed)}</strong><span>Typing time</span></div><div><strong>${wpm}</strong><span>Words per minute</span></div><div><strong>${accuracy}%</strong><span>Accuracy</span></div></div>${personalBest&&oldBest?'<p class="story-personal-best">Your loveliest pace on this story yet. ✦</p>':''}<div class="overlay-actions"><button id="story-next" class="primary">Next: ${escapeStory(next.title)} ↗</button><button id="story-again" class="secondary">Read this one again</button><button id="story-finish-home" class="secondary">Back to the stories</button></div>`;
  $('story-results').hidden=false;$('story-reader').hidden=true;
  storyText('story-instructions','Your postcard is saved. There is always another little journey.');
  storyFeedback('Every word brought you here. Thank you for the lovely company.',true);
  $('story-again').onclick=()=>startStroll(stroll.story.id,true);$('story-next').onclick=()=>startStroll(next.id);$('story-finish-home').onclick=storyHome;
  $('story-next').focus();
}
function strollTick(now){
  if(stroll){
    $('story-stage').dataset.motion=!$('story').hidden&&!stroll.paused&&!stroll.finished&&now<stroll.walkUntil?'walking':'resting';
    if(now>=stroll.celebrateUntil)$('story-stage').dataset.celebrate='false';
    if(now>=stroll.feedbackUntil&&$('story-feedback')?.classList)$('story-feedback').classList.remove('is-visible');
    const dt=Math.max(0,Math.min(1,(now-stroll.last)/1000));stroll.last=now;
    if(!$('story').hidden&&!stroll.paused&&!stroll.finished&&stroll.attempts>0){
      stroll.elapsed+=dt;stroll.saveClock+=dt;stroll.statsClock+=dt;
      if(stroll.statsClock>=0.25){stroll.statsClock=0;renderStoryMetrics();}
      if(stroll.saveClock>=5){stroll.saveClock=0;saveStroll();}
    }
  }
  requestAnimationFrame(strollTick);
}
function focusStroll(){
  if(window.matchMedia?.('(pointer: coarse)')?.matches)$('story-input').focus();else $('story-reader').focus();
}
function typeStoryKey(key,deleteWord=false){
  if(!stroll||stroll.paused||stroll.finished)return;
  const value=key==='Backspace'?(deleteWord?stroll.typed.replace(/\S+\s*$|\s+$/,''):stroll.typed.slice(0,-1)):stroll.typed+(key==='Enter'?'\n':key);
  $('story-input').value=value;handleStoryInput();
}
$('story-input').addEventListener('input',handleStoryInput);
$('story-input').addEventListener('compositionend',handleStoryInput);
$('story-input').addEventListener('beforeinput',e=>{if(['insertFromPaste','insertFromDrop'].includes(e.inputType))e.preventDefault();});
$('story-reader').addEventListener('click',event=>{if(stroll&&!stroll.paused&&!stroll.finished&&event.target?.tagName!=='BUTTON')focusStroll();});
$('story-punctuation').onclick=toggleStoryPunctuation;$('story-pause').onclick=toggleStrollPause;$('story-home').onclick=storyHome;
if($('story-focus'))$('story-focus').onclick=toggleStoryFocus;
if($('story-stats-toggle'))$('story-stats-toggle').onclick=toggleStoryStats;
if($('story-play-button'))$('story-play-button').onclick=()=>startStroll(strollSave?.id||'moonflower');
document.addEventListener('keydown',e=>{
  if($('story').hidden||!stroll||e.isComposing||$('how-dialog')?.open)return;
  if(e.key==='Escape'){e.preventDefault();toggleStrollPause();return;}
  if(stroll.paused||stroll.finished||e.target===$('story-input'))return;
  // Let Tab and focused controls keep their normal keyboard behavior.
  if(e.target&&e.target!==$('story-reader'))return;
  if(e.key==='Backspace'&&(e.ctrlKey||e.metaKey)&&!e.altKey){e.preventDefault();typeStoryKey(e.key,true);return;}
  if(e.ctrlKey||e.metaKey||e.altKey)return;
  if(e.key==='Backspace'||e.key==='Enter'||e.key.length===1){e.preventDefault();typeStoryKey(e.key);}
});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&!$('story').hidden&&stroll&&!stroll.paused&&!stroll.finished)toggleStrollPause();});
window.addEventListener('blur',()=>{
  if(stroll&&!$('story').hidden&&!stroll.paused&&!stroll.finished){toggleStrollPause();stroll.autoPaused=true;}
});
window.addEventListener('focus',()=>{if(stroll?.autoPaused&&!$('story').hidden){toggleStrollPause();}});
window.addEventListener('resize',()=>{if(stroll&&!$('story').hidden)renderStroll();});
window.addEventListener('beforeunload',saveStroll);renderStoryChoices();requestAnimationFrame(strollTick);
