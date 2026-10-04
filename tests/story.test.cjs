const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../story.js'),'utf8');
function harness(saved={}){
  const elements=new Map(),events={},storage={...saved};
  const get=id=>{if(!elements.has(id))elements.set(id,{hidden:false,value:'',disabled:false,style:{},dataset:{},offsetTop:0,clientHeight:340,textContent:'',innerHTML:'',attributes:{},classList:{add(){},remove(){}},focus(){},setAttribute(name,value){this.attributes[name]=value},addEventListener(type,fn){events[id+':'+type]=fn},querySelector(){return {offsetTop:500}},querySelectorAll(){return []}});return elements.get(id)};
  const ctx=vm.createContext({$:get,state:undefined,collection:{unlocked:['little'],equipped:'little'},format:s=>`${Math.floor(s/60)}:${Math.floor(s%60)}`,save(){},renderCollection(){},applyLook(){},localStorage:{getItem:key=>storage[key]??null,setItem(key,value){storage[key]=value},removeItem(key){delete storage[key]}},performance:{now:()=>0},requestAnimationFrame(){},document:{body:{dataset:{}},hidden:false,addEventListener(type,fn){events[type]=fn}},window:{addEventListener(type,fn){events[type]=fn}}});
  vm.runInContext(source,ctx);
  return {run:s=>vm.runInContext(s,ctx),get,storage,event(name,event={}){events[name](event)},key(key,options={}){events.keydown({key,preventDefault(){},...options})},input(value){get('story-input').value=value;events['story-input:input']()}};
}
test('four original stories offer a short journey and longer reads with chapter metadata',()=>{
  const h=harness();assert.equal(h.run('stories.length'),4);assert.ok(h.run('stories.slice(0,2).every(s=>s.text.split(/\\s+/).length>=400)'));
  assert.ok(h.run('stories.find(s=>s.id==="stars").text.split(/\\s+/).length<250'));
  assert.ok(h.run('stories.every(s=>s.chapters.length===s.text.split(String.fromCharCode(10)).length&&s.description&&s.minutes&&s.outfit)'));
  h.run("startStroll('moonflower')");assert.equal(h.get('story').hidden,false);assert.equal(h.get('menu').hidden,true);assert.equal(h.get('story-input').disabled,false);
});
test('mistakes stay red while the caret advances and accuracy tracks errors',()=>{
  const h=harness();h.run("startStroll('moonflower')");h.input('P');h.input('Px');assert.equal(h.run('stroll.typed'),'Px');assert.ok(h.get('story-passage').innerHTML.includes('story-caret-error'));h.input('Pxu');assert.equal(h.run('stroll.typed'),'Pxu');h.input('P');h.input('Pu');assert.equal(h.run('stroll.typed'),'Pu');assert.equal(h.run('stroll.correct'),2);assert.equal(h.run('stroll.attempts'),4);
  assert.ok(h.get('story-passage').innerHTML.includes('story-current'));assert.equal(h.get('story-reader').scrollTop,0);
});
test('saved typed text and elapsed time resume after reloading',()=>{
  const h=harness();h.run("startStroll('moonflower')");h.input('Puff');h.run('stroll.elapsed=42;storyHome()');
  const reloaded=harness(h.storage);reloaded.run("startStroll('moonflower')");assert.equal(reloaded.get('story-input').value,'Puff');assert.equal(reloaded.run('stroll.elapsed'),42);assert.equal(reloaded.run('stroll.attempts'),4);
});
test('timer runs only after typing begins, and stops while paused or at home',()=>{
  const h=harness();h.run("startStroll('rainy');strollTick(1000)");assert.equal(h.run('stroll.elapsed'),0);h.input('R');h.run('strollTick(2000)');assert.equal(h.run('stroll.elapsed'),1);
  h.run('toggleStrollPause();strollTick(3000)');assert.equal(h.run('stroll.elapsed'),1);assert.equal(h.get('story-input').disabled,true);
  h.run('toggleStrollPause();storyHome();strollTick(4000)');assert.equal(h.run('stroll.elapsed'),1);
});
test('completion displays stats and permanently awards a postcard and outfit',()=>{
  const h=harness();h.run("startStroll('moonflower');stroll.typed=stroll.story.text.slice(0,-1);stroll.attempts=stroll.typed.length;stroll.correct=stroll.typed.length;stroll.elapsed=300;");h.input(h.run('stroll.story.text'));
  assert.equal(h.run('stroll.finished'),true);assert.equal(h.get('story-results').hidden,false);assert.equal(h.get('story-reader').hidden,true);assert.equal(h.run('collection.equipped'),'traveler');assert.ok(h.get('story-results').innerHTML.includes('100%'));assert.equal(h.storage['puffpals-stroll-save'],undefined);assert.ok(JSON.parse(h.storage['puffpals-postcards']).includes('moonflower'));
  h.run("startStroll('moonflower',true)");assert.equal(h.run('stroll.typed'),'');assert.equal(h.run('stroll.elapsed'),0);
});
test('paragraph breaks and punctuation are part of the passage',()=>{
  const h=harness();h.run("startStroll('rainy');const paragraph=stroll.story.text.indexOf(String.fromCharCode(10));stroll.typed=stroll.story.text.slice(0,paragraph);");h.input(h.run('stroll.story.text.slice(0,paragraph+1)'));assert.equal(h.run('firstStoryError(stroll.typed,stroll.story.text)'),-1);assert.ok(h.get('story-passage').innerHTML.includes('story-current'));
});

test('snippets cover every character once and advance without losing input',()=>{
  const h=harness();h.run("startStroll('moonflower');const chunks=storySnippets(stroll.story.text)");
  assert.ok(h.run('chunks.length>10'));assert.ok(h.run('chunks.every(c=>c.end-c.start<=220)'));
  assert.equal(h.run("chunks.map(c=>stroll.story.text.slice(c.start,c.end)).join('')===stroll.story.text"),true);
  const boundary=h.run('chunks[0].end');h.input(h.run('stroll.story.text.slice(0,chunks[0].end)'));
  assert.ok(h.get('story-snippet-count').textContent.startsWith('2 /'));
  h.input(h.run('stroll.story.text.slice(0,chunks[0].end-1)'));assert.ok(h.get('story-snippet-count').textContent.startsWith('1 /'));assert.equal(h.run('stroll.typed.length'),boundary-1);
});
test('only the current snippet is shown with faint future text and lit typed text',()=>{
  const h=harness();h.run("startStroll('moonflower')");h.input('Puff');const html=h.get('story-passage').innerHTML;
  assert.ok(html.includes('story-done'));assert.ok(html.includes('story-future'));assert.ok(html.includes('story-current'));assert.ok(!html.includes('Their first stop'));
  assert.equal(h.get('story-stage').dataset.motion,'walking');h.run('strollTick(1000)');assert.equal(h.get('story-stage').dataset.motion,'resting');
});

test('desktop keyboard types directly on the passage without a textbox',()=>{
  const h=harness();h.run("startStroll('moonflower')");for(const key of 'Puff')h.key(key);
  assert.equal(h.run('stroll.typed'),'Puff');h.key('Backspace');assert.equal(h.run('stroll.typed'),'Puf');h.key('f');assert.equal(h.run('stroll.typed'),'Puff');
  h.key('Escape');h.key(' ');assert.equal(h.run('stroll.typed'),'Puff');h.key('Escape');h.key(' ');assert.equal(h.run('stroll.typed'),'Puff ');
});

test('mobile snippets remain short and resizing preserves typed progress',()=>{
  const h=harness();h.run("window.innerWidth=390;startStroll('moonflower')");assert.ok(h.run('storySnippets(stroll.story.text,105).every(s=>s.end-s.start<=105)'));
  for(const key of 'Puff woke')h.key(key);h.run('window.innerWidth=1280;renderStroll()');assert.equal(h.run('stroll.typed'),'Puff woke');assert.ok(h.get('story-passage').innerHTML.includes('story-current'));
});

test('typing past a typo advances to the next character and Backspace can correct it',()=>{
  const h=harness();h.run("startStroll('moonflower')");h.key('P');h.key('x');
  assert.ok(h.get('story-passage').innerHTML.includes('class="story-wrong">u</span><span id="story-cursor" class="story-current story-caret-error">f'));
  h.key('f');h.key('f');assert.equal(h.run('stroll.typed'),'Pxff');assert.equal(h.run('stroll.correct'),3);assert.ok(!h.get('story-passage').innerHTML.includes('story-caret-error'));
  h.key('Backspace');h.key('Backspace');h.key('Backspace');h.key('u');h.key('f');h.key('f');assert.equal(h.run('stroll.typed'),'Puff');assert.ok(!h.get('story-passage').innerHTML.includes('class="story-wrong"'));
});
test('a typo does not prevent advancing snippets or finishing the story',()=>{
  const h=harness();h.run("startStroll('moonflower');const end=storySnippets(stroll.story.text)[0].end;");
  h.input(h.run("'X'+stroll.story.text.slice(1,end)"));assert.ok(h.get('story-snippet-count').textContent.startsWith('2 /'));
  h.input(h.run("'X'+stroll.story.text.slice(1)"));assert.equal(h.run('stroll.finished'),true);assert.equal(h.get('story-results').hidden,false);assert.ok(h.run('stroll.correct<stroll.attempts'));
});

test('punctuation toggle removes symbols and preserves progress and mistakes',()=>{
  const h=harness();h.run("startStroll('moonflower');const stop=stroll.story.text.indexOf(',')+4;");
  h.input(h.run("'X'+stroll.story.text.slice(1,stop)"));const before=h.run('stroll.typed');h.run('toggleStoryPunctuation()');
  assert.ok(h.run("/^[a-zA-Z\\s]+$/.test(stroll.story.text)"));assert.equal(h.run('stroll.typed'),before.replace(/[^a-zA-Z\s]/g,''));assert.equal(h.run('stroll.typed[0]'),'X');
  h.run('toggleStoryPunctuation()');assert.equal(h.run('stroll.typed'),before);assert.equal(h.run('stroll.story.text===stories[0].text'),true);
});
test('punctuation preference and saved target resume together',()=>{
  const h=harness();h.run("startStroll('rainy');toggleStoryPunctuation()");h.input('Rain');h.run('storyHome()');
  const resumed=harness(h.storage);resumed.run("startStroll('rainy')");assert.equal(resumed.run('punctuationOn'),false);assert.equal(resumed.run('stroll.typed'),'Rain');assert.equal(resumed.get('story-punctuation').innerHTML,'Punctuation <span>off</span>');
  resumed.run("startStroll('moonflower',true)");assert.equal(resumed.run('punctuationOn'),false);
});

test('live metrics count replacement attempts and measure correctly typed characters',()=>{
  const h=harness();h.run("startStroll('moonflower');stroll.elapsed=6");h.input('Pxff');
  assert.equal(h.get('story-wpm').textContent,6);assert.equal(h.get('story-accuracy').textContent,'75%');
  h.input('Puff');assert.equal(h.run('stroll.attempts'),5);assert.equal(h.run('stroll.correct'),4);
  assert.equal(h.get('story-wpm').textContent,8);assert.equal(h.get('story-accuracy').textContent,'80%');
  h.input('Puf');assert.equal(h.run('stroll.attempts'),5);h.input('Puf');assert.equal(h.run('stroll.attempts'),5);
});
test('snippet animation runs at boundaries and ordinary keystrokes keep the page still',()=>{
  const h=harness();h.run("startStroll('moonflower')");assert.ok(h.get('story-passage').innerHTML.includes('story-snippet-enter'));
  h.input('P');assert.ok(!h.get('story-passage').innerHTML.includes('story-snippet-enter'));
  h.input(h.run('stroll.story.text.slice(0,storySnippets(stroll.story.text)[0].end)'));
  assert.ok(h.get('story-passage').innerHTML.includes('story-snippet-enter'));
  h.input(h.run('stroll.story.text.slice(0,stroll.typed.length+1)'));
  assert.ok(!h.get('story-passage').innerHTML.includes('story-snippet-enter'));
});
test('chapters follow paragraph boundaries, update the scene, and announce a gentle milestone',()=>{
  const h=harness();h.run("startStroll('tea')");assert.equal(h.get('story-stage').dataset.theme,'tea');assert.equal(h.get('story-stage').dataset.stop,0);
  h.input(h.run('stroll.story.text.slice(0,stroll.story.text.indexOf(String.fromCharCode(10))+1)'));
  assert.equal(h.get('story-stage').dataset.stop,1);assert.equal(h.get('story-scene-title').textContent,'Making room for everyone');
  assert.equal(h.get('story-chapter-label').textContent,'Chapter 2 of 6');assert.ok(h.get('story-scene-description').textContent.includes('ordinary table'));
  assert.equal(h.get('story-stage').dataset.celebrate,'true');assert.equal(h.get('story-feedback').textContent,'A little chapter, beautifully told.');
  assert.ok(Number(h.get('story-progressbar').attributes['aria-valuenow'])>0);
  h.run('strollTick(2000)');assert.equal(h.get('story-stage').dataset.celebrate,'false');
});
test('focus and stats preferences persist without altering a saved story',()=>{
  const h=harness();h.run("startStroll('stars')");h.input('Puff');h.run('toggleStoryFocus();toggleStoryStats()');
  assert.equal(h.run('document.body.dataset.focus'),'true');assert.equal(h.get('story-focus').attributes['aria-pressed'],'true');
  assert.equal(h.get('story-live-stats').hidden,true);assert.equal(h.run('stroll.typed'),'Puff');
  h.run('storyHome()');assert.equal(h.run('document.body.dataset.focus'),'false');
  const resumed=harness(h.storage);resumed.run("startStroll('stars')");
  assert.equal(resumed.run('document.body.dataset.focus'),'true');assert.equal(resumed.get('story-live-stats').hidden,true);
  assert.equal(resumed.run('stroll.typed'),'Puff');
});
test('focused controls and Tab keep their native behavior while Ctrl Backspace deletes a word',()=>{
  const h=harness();h.run("startStroll('moonflower')");h.input('Puff woke ');
  h.key('x',{target:h.get('story-pause')});h.key(' ',{target:h.get('story-focus')});h.key('Tab',{target:h.get('story-reader')});
  assert.equal(h.run('stroll.typed'),'Puff woke ');
  h.key('Backspace',{ctrlKey:true,target:h.get('story-reader')});assert.equal(h.run('stroll.typed'),'Puff ');
  h.key('w',{target:h.get('story-reader')});assert.equal(h.run('stroll.typed'),'Puff w');
  h.key('o',{target:h.get('story-input')});assert.equal(h.run('stroll.typed'),'Puff w');
});
test('leaving the window pauses time and coming back resumes only automatic pauses',()=>{
  const h=harness();h.run("startStroll('stars')");h.input('P');h.run('strollTick(1000)');assert.equal(h.run('stroll.elapsed'),1);
  h.event('blur');h.run('strollTick(2000)');assert.equal(h.run('stroll.paused'),true);assert.equal(h.run('stroll.elapsed'),1);
  assert.equal(h.get('story-reader').dataset.paused,'true');h.event('focus');assert.equal(h.run('stroll.paused'),false);
  h.run('toggleStrollPause()');h.event('focus');assert.equal(h.run('stroll.paused'),true);
});
test('corrupt saved state does not discard earned postcards or expose invalid accuracy',()=>{
  const h=harness({'puffpals-stroll-save':'broken','puffpals-postcards':'["stars","stars","missing"]'});
  assert.deepEqual(Array.from(h.run('scrapbook')),['stars']);h.run("startStroll('tea')");assert.equal(h.run('stroll.typed'),'');
  const resumed=harness({'puffpals-stroll-save':JSON.stringify({id:'stars',typed:'Puff',elapsed:-1,attempts:2,correct:100})});
  resumed.run("startStroll('stars')");assert.equal(resumed.run('stroll.elapsed'),0);assert.equal(resumed.run('stroll.attempts'),4);
  assert.equal(resumed.get('story-accuracy').textContent,'100%');
});
test('native composition waits for commit and replacement text remains available to mobile keyboards',()=>{
  const h=harness();h.run("startStroll('moonflower')");h.get('story-input').value='P';
  h.event('story-input:input',{isComposing:true});assert.equal(h.run('stroll.typed'),'');
  h.event('story-input:compositionend');assert.equal(h.run('stroll.typed'),'P');
  let prevented=false;h.event('story-input:beforeinput',{inputType:'insertReplacementText',preventDefault(){prevented=true}});assert.equal(prevented,false);
  h.event('story-input:beforeinput',{inputType:'insertFromPaste',preventDefault(){prevented=true}});assert.equal(prevented,true);
});
test('new journeys award existing looks and offer the next uncollected story',()=>{
  const h=harness();h.run("startStroll('stars');stroll.elapsed=180");h.input(h.run('stroll.story.text'));
  assert.equal(h.run('collection.equipped'),'traveler');assert.ok(h.get('story-results').innerHTML.includes('Starlight postcard'));
  assert.ok(h.get('story-results').innerHTML.includes('Next: The Moonflower Garden'));assert.ok(JSON.parse(h.storage['puffpals-story-records']).stars.withPunctuation);
  h.get('story-next').onclick();assert.equal(h.run('stroll.story.id'),'moonflower');
});
test('changing punctuation preserves elapsed time, attempts, and the ongoing save',()=>{
  const h=harness();h.run("startStroll('tea')");h.input('The little tea shop');h.run('stroll.elapsed=18;toggleStoryPunctuation()');
  const saved=JSON.parse(h.storage['puffpals-stroll-save']);assert.equal(saved.id,'tea');assert.equal(saved.elapsed,18);assert.equal(saved.attempts,19);
  assert.equal(saved.typed,'The little tea shop');assert.equal(saved.punctuation,false);
});

test('live speed settles before displaying a number and periodic stats update four times a second',()=>{
  const h=harness();h.run("startStroll('moonflower')");h.input('Puff');
  assert.equal(h.get('story-wpm').textContent,'—');h.run('strollTick(200)');assert.equal(h.get('story-time').textContent,'0:0');
  h.run('strollTick(1200)');assert.equal(typeof h.get('story-wpm').textContent,'number');
  h.get('story-wpm').textContent='unchanged';h.run('strollTick(1250)');assert.equal(h.get('story-wpm').textContent,'unchanged');
  h.input('Puff ');assert.notEqual(h.get('story-wpm').textContent,'unchanged');
});

test('story audio rewards correct word and paragraph boundaries without playing on mistakes',()=>{
  const h=harness();h.run("var toneCalls=[];globalThis.tone=(frequency,duration)=>toneCalls.push([frequency,duration]);startStroll('moonflower')");
  h.input('Puff ');assert.equal(h.run('toneCalls.length'),1);assert.ok(h.run('toneCalls[0][0]>=360&&toneCalls[0][0]<=400'));
  h.input('Puff x');assert.equal(h.run('toneCalls.length'),1);
  h.input(h.run('stroll.story.text.slice(0,stroll.story.text.indexOf(String.fromCharCode(10))+1)'));assert.equal(h.run('toneCalls.length'),1);
  h.run("startStroll('moonflower',true);toneCalls=[]");
  h.input(h.run('stroll.story.text.slice(0,stroll.story.text.indexOf(String.fromCharCode(10))+1)'));
  assert.equal(h.run('toneCalls[0][0]'),660);
});

test('switching stories and reloading preserves each journey including its punctuation preference',()=>{
  const h=harness();h.run("startStroll('moonflower')");h.input('Puff woke');h.run("stroll.elapsed=12;startStroll('rainy');toggleStoryPunctuation()");h.input('Rain tapped');h.run('stroll.elapsed=8;storyHome()');
  const saves=JSON.parse(h.storage['puffpals-stroll-saves']);assert.equal(saves.moonflower.typed,'Puff woke');assert.equal(saves.rainy.typed,'Rain tapped');
  assert.equal((h.get('story-choices').innerHTML.match(/Continue journey/g)||[]).length,2);
  const resumed=harness(h.storage);resumed.run("startStroll('moonflower')");assert.equal(resumed.run('stroll.typed'),'Puff woke');assert.equal(resumed.run('stroll.elapsed'),12);assert.equal(resumed.run('punctuationOn'),true);
  resumed.run("startStroll('rainy')");assert.equal(resumed.run('stroll.typed'),'Rain tapped');assert.equal(resumed.run('stroll.elapsed'),8);assert.equal(resumed.run('punctuationOn'),false);
});
test('finishing or restarting one journey leaves another story’s saved progress intact',()=>{
  const h=harness();h.run("startStroll('tea')");h.input('The little');h.run("startStroll('stars')");h.input('Puff');h.run("startStroll('stars',true)");
  assert.equal(h.run('stroll.typed'),'');assert.equal(h.run('strollSaves.tea.typed'),'The little');
  h.input(h.run('stroll.story.text'));const saved=JSON.parse(h.storage['puffpals-stroll-saves']);
  assert.equal(saved.stars,undefined);assert.equal(saved.tea.typed,'The little');assert.equal(JSON.parse(h.storage['puffpals-stroll-save']).id,'tea');
  const resumed=harness(h.storage);resumed.run("startStroll('tea')");assert.equal(resumed.run('stroll.typed'),'The little');
});
test('legacy saves migrate and invalid map entries cannot overwrite a different story',()=>{
  const legacy={id:'moonflower',typed:'Puff',elapsed:7,attempts:4,correct:4,punctuation:true};
  const h=harness({'puffpals-stroll-save':JSON.stringify(legacy),'puffpals-stroll-saves':JSON.stringify({tea:{...legacy,id:'stars'},rainy:{id:'rainy',typed:45},missing:legacy})});
  assert.equal(h.run('Object.keys(strollSaves).length'),1);assert.equal(JSON.parse(h.storage['puffpals-stroll-saves']).moonflower.typed,'Puff');
  h.run("startStroll('moonflower')");assert.equal(h.run('stroll.typed'),'Puff');assert.equal(h.run('stroll.elapsed'),7);
});
