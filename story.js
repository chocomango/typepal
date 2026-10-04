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
for(const story of stories)story.text=story.text.replace(/\n\n/g,'\n');
let stroll=null, strollSave=null, scrapbook=[],punctuationOn=true;
try{punctuationOn=localStorage.getItem('puffpals-stroll-punctuation')!=='off';}catch{}
try{strollSave=JSON.parse(localStorage.getItem('puffpals-stroll-save')||'null');scrapbook=JSON.parse(localStorage.getItem('puffpals-postcards')||'[]');if(!Array.isArray(scrapbook))scrapbook=[];}catch{}
function escapeStory(text){return text.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function saveStroll(){
  if(!stroll)return;
  const saved={id:stroll.story.id,typed:stroll.typed,elapsed:stroll.elapsed,attempts:stroll.attempts,correct:stroll.correct,punctuation:punctuationOn};
  strollSave=stroll.finished?null:saved;
  try{if(strollSave)localStorage.setItem('puffpals-stroll-save',JSON.stringify(saved));else localStorage.removeItem('puffpals-stroll-save');localStorage.setItem('puffpals-postcards',JSON.stringify(scrapbook));}catch{}
}
function renderStoryChoices(){
  $('story-choices').innerHTML=stories.map(story=>{
    const resume=strollSave?.id===story.id;
    return `<button class="story-choice" data-story="${story.id}"><span>${story.icon}</span><div><strong>${story.title}</strong><small>${story.text.split(/\s+/).length} words · ${resume?'Continue your saved journey':'A quiet story to type'}${scrapbook.includes(story.id)?' · Postcard earned':''}</small></div><b>${resume?'Resume':'Begin'} ↗</b></button>`;
  }).join('');
  $('story-choices').querySelectorAll('[data-story]').forEach(button=>button.onclick=()=>startStroll(button.dataset.story));
  $('story-postcards').innerHTML=scrapbook.filter(id=>stories.some(s=>s.id===id)).map(id=>{const story=stories.find(s=>s.id===id);return `<span class="postcard">${story.icon} ${story.reward}</span>`;}).join('');
}
function startStroll(id,restart=false){
  const original=stories.find(story=>story.id===id);if(!original)return;
  const saved=!restart&&strollSave?.id===id?strollSave:null;
  if(saved)punctuationOn=saved.punctuation!==false;
  const story={...original,text:punctuationOn?original.text:original.text.replace(/[^a-zA-Z\s]/g,'')};
  renderPunctuationToggle();
  const typed=typeof saved?.typed==='string'?saved.typed.slice(0,story.text.length):'';
  stroll={story,typed,elapsed:Number.isFinite(saved?.elapsed)?Math.max(0,saved.elapsed):0,attempts:Number.isFinite(saved?.attempts)?Math.max(0,saved.attempts):0,correct:Number.isFinite(saved?.correct)?Math.max(0,saved.correct):0,paused:false,finished:false,walkUntil:0,last:performance.now(),saveClock:0};
  if(state)state.mode='menu';$('menu').hidden=true;$('game').hidden=true;$('story').hidden=false;$('story-title').textContent=story.title;$('story-input').value=typed;$('story-input').disabled=false;$('story-reader').hidden=false;$('story-results').hidden=true;$('story-pause').disabled=false;$('story-pause').textContent='Pause';
  $('story-stage').dataset.motion='resting';$('story-stage').dataset.paused='false';
  $('story-stops').innerHTML=`<span>⌂<small>The bakery</small></span><span>♧<small>The meadow</small></span><span>⌒<small>The bridge</small></span><span>${id==='rainy'?'☕':'✿'}<small>${id==='rainy'?'A warm cottage':'The garden'}</small></span>`;
  $('story-instructions').textContent='Start typing · spaces and punctuation count · Enter for a paragraph · Esc to pause';applyLook();renderStroll();saveStroll();focusStroll();
}
function renderPunctuationToggle(){
  $('story-punctuation').innerHTML=`Punctuation <span>${punctuationOn?'on':'off'}</span>`;
  $('story-punctuation').setAttribute('aria-pressed',String(punctuationOn));
  $('story-punctuation').disabled=false;
}
function toggleStoryPunctuation(){
  if(!stroll||stroll.finished)return;
  const original=stories.find(story=>story.id===stroll.story.id).text;
  const indices=on=>Array.from(original,(_,index)=>index).filter(index=>on||/[a-zA-Z\s]/.test(original[index]));
  const oldIndices=indices(punctuationOn);
  const sourcePosition=oldIndices[stroll.typed.length]??original.length;
  const typedBySource=new Map(oldIndices.slice(0,stroll.typed.length).map((index,i)=>[index,stroll.typed[i]]));
  punctuationOn=!punctuationOn;
  const newIndices=indices(punctuationOn);
  stroll.story={...stroll.story,text:newIndices.map(index=>original[index]).join('')};
  stroll.typed=newIndices.filter(index=>index<sourcePosition).map(index=>typedBySource.get(index)??original[index]).join('');
  $('story-input').value=stroll.typed;
  try{localStorage.setItem('puffpals-stroll-punctuation',punctuationOn?'on':'off');}catch{}
  renderPunctuationToggle();renderStroll();saveStroll();
  $('story-instructions').textContent=punctuationOn?'Punctuation on · type spaces and punctuation as shown.':'Punctuation off · just letters, spaces, and paragraph breaks.';
  if(!stroll.paused)focusStroll();
}
function firstStoryError(value,text){for(let i=0;i<value.length;i++)if(value[i]!==text[i])return i;return -1;}
function handleStoryInput(){
  if(!stroll||stroll.paused||stroll.finished)return;
  const input=$('story-input');let value=input.value.slice(0,stroll.story.text.length);
  const previous=stroll.typed,added=Math.max(0,value.length-previous.length);
  const error=firstStoryError(value,stroll.story.text);
  if(added){stroll.attempts+=added;for(let i=previous.length;i<value.length;i++)if(value[i]===stroll.story.text[i])stroll.correct++;}
  if(added){stroll.walkUntil=performance.now()+650;$('story-stage').dataset.motion='walking';}
  stroll.typed=value;input.value=value;renderStroll();saveStroll();
  $('story-instructions').textContent=error>=0?'Keep typing, or use Backspace to correct red characters.':stroll.story.text[value.length]==='\n'?'Press Enter to begin the next paragraph.':'Backspace to correct · Esc to pause · progress saved automatically';
  if(value.length===stroll.story.text.length)finishStroll();
}
function storySnippets(text,maxCharacters=220){
  const snippets=[];let start=0;
  while(start<text.length){
    let end=Math.min(text.length,start+maxCharacters);
    const paragraph=text.indexOf('\n',start);
    if(paragraph>=0 && paragraph<end)end=paragraph+1;
    else if(end<text.length){const space=text.lastIndexOf(' ',end-1);if(space>start)end=space+1;}
    snippets.push({start,end});start=end;
  }
  return snippets;
}
function renderStroll(){
  const text=stroll.story.text,typed=stroll.typed,position=typed.length;
  const cursorError=position>0&&typed[position-1]!==text[position-1];
  const snippets=storySnippets(text,(window.innerWidth||1280)<650?105:220);
  const part=Math.max(0,snippets.findIndex(snippet=>position<snippet.end));
  const snippet=position>=text.length?snippets[snippets.length-1]:snippets[part];
  let html='';
  for(let index=snippet.start;index<snippet.end;index++){
    const char=text[index]==='\n'?'↵':escapeStory(text[index]);
    const kind=index<position?(typed[index]===text[index]?'story-done':'story-wrong'):index===position?`story-current${cursorError?' story-caret-error':''}`:'story-future';
    html+=`<span ${index===position?'id="story-cursor"':''} class="${kind}">${char}</span>`;
  }
  $('story-passage').innerHTML=`<p>${html}</p>`;
  $('story-snippet-count').textContent=`${position>=text.length?snippets.length:part+1} / ${snippets.length}`;
  $('story-reader').scrollTop=0;
  const ratio=position/text.length;$('story-progress').style.width=`${ratio*100}%`;$('story-puff-anchor').style.left=`calc(${ratio*100}% - ${ratio*96}px)`;
  const stages=['At the bakery','Across the meadow','Over the little bridge',stroll.story.id==='rainy'?'At the warm cottage':'Into the moonlit garden'];
  const stage=Math.min(3,Math.floor(ratio*4));
  $('story-location').textContent=stages[stage];$('story-scene-title').textContent=stages[stage];$('story-stage').dataset.stop=stage;
  $('story-count').textContent=`${Math.round(ratio*100)}% · ${text.slice(0,position).trim().split(/\s+/).filter(Boolean).length} / ${text.split(/\s+/).length} words`;$('story-time').textContent=format(stroll.elapsed);
}
function toggleStrollPause(){
  if(!stroll||stroll.finished)return;
  stroll.paused=!stroll.paused;$('story-stage').dataset.paused=String(stroll.paused);$('story-stage').dataset.motion='resting';stroll.last=performance.now();$('story-input').disabled=stroll.paused;$('story-pause').textContent=stroll.paused?'Resume':'Pause';$('story-instructions').textContent=stroll.paused?'Your journey is paused. Resume when you are ready.':'Backspace to correct · Esc to pause · progress saved automatically';saveStroll();if(!stroll.paused)focusStroll();
}
function storyHome(){saveStroll();$('story').hidden=true;$('menu').hidden=false;renderStoryChoices();}
function finishStroll(){
  stroll.finished=true;$('story-stage').dataset.paused='true';$('story-stage').dataset.motion='resting';if(!scrapbook.includes(stroll.story.id))scrapbook.push(stroll.story.id);
  const outfit=stroll.story.id==='moonflower'?'traveler':'raincoat';if(!collection.unlocked.includes(outfit))collection.unlocked.push(outfit);collection.equipped=outfit;save();renderCollection();applyLook();saveStroll();$('story-input').disabled=true;$('story-pause').disabled=true;$('story-punctuation').disabled=true;
  const wpm=stroll.elapsed>0?Math.round(stroll.story.text.length/5/(stroll.elapsed/60)):0;
  const accuracy=stroll.attempts?Math.round(stroll.correct/stroll.attempts*100):100;
  $('story-results').innerHTML=`<div class="eyebrow">A LITTLE JOURNEY, BEAUTIFULLY FINISHED</div><h2>You made it, little traveler.</h2><p>${stroll.story.icon} ${stroll.story.reward} added to your scrapbook. A new travel look is yours!</p><div class="results"><div><strong>${format(stroll.elapsed)}</strong><span>Typing time</span></div><div><strong>${wpm}</strong><span>Words per minute</span></div><div><strong>${accuracy}%</strong><span>Accuracy</span></div></div><div class="overlay-actions"><button id="story-again" class="primary">Stroll again ↗</button><button id="story-finish-home" class="secondary">Back to the stories</button></div>`;
  $('story-results').hidden=false;$('story-reader').hidden=true;$('story-instructions').textContent='Your postcard is saved. There is always another little journey.';$('story-again').onclick=()=>startStroll(stroll.story.id,true);$('story-finish-home').onclick=storyHome;
}
function strollTick(now){
  if(stroll){$('story-stage').dataset.motion=!$('story').hidden&&!stroll.paused&&!stroll.finished&&now<stroll.walkUntil?'walking':'resting';const dt=Math.max(0,Math.min(1,(now-stroll.last)/1000));stroll.last=now;if(!$('story').hidden&&!stroll.paused&&!stroll.finished&&stroll.attempts>0){stroll.elapsed+=dt;stroll.saveClock+=dt;$('story-time').textContent=format(stroll.elapsed);if(stroll.saveClock>=5){stroll.saveClock=0;saveStroll();}}}
  requestAnimationFrame(strollTick);
}
$('story-input').addEventListener('input',handleStoryInput);
$('story-input').addEventListener('beforeinput',e=>{if(['insertFromPaste','insertFromDrop','insertReplacementText'].includes(e.inputType))e.preventDefault();});
$('story-reader').addEventListener('click',()=>{if(stroll&&!stroll.paused)focusStroll();});
$('story-punctuation').onclick=toggleStoryPunctuation;
$('story-pause').onclick=toggleStrollPause;$('story-home').onclick=storyHome;
function focusStroll(){
  if(window.matchMedia?.('(pointer: coarse)')?.matches)$('story-input').focus();
  else $('story-reader').focus();
}
function typeStoryKey(key){
  if(!stroll||stroll.paused||stroll.finished)return;
  const value=key==='Backspace'?stroll.typed.slice(0,-1):stroll.typed+(key==='Enter'?'\n':key);
  $('story-input').value=value;handleStoryInput();
}
document.addEventListener('keydown',e=>{
  if($('story').hidden||!stroll||e.isComposing)return;
  if(e.key==='Escape'){e.preventDefault();toggleStrollPause();return;}
  if(e.ctrlKey||e.metaKey||e.altKey||stroll.paused||stroll.finished)return;
  // The invisible native input is only used for touch keyboards.
  if(e.target===$('story-input'))return;
  if(e.target?.tagName==='BUTTON'&&(e.key==='Enter'||e.key===' '))return;
  if(e.key==='Backspace'||e.key==='Enter'||e.key.length===1){e.preventDefault();typeStoryKey(e.key);}
});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&!$('story').hidden&&stroll&&!stroll.paused&&!stroll.finished)toggleStrollPause();});
window.addEventListener('resize',()=>{if(stroll&&!$('story').hidden)renderStroll();});
window.addEventListener('beforeunload',saveStroll);renderStoryChoices();requestAnimationFrame(strollTick);
