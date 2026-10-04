const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../story.js'),'utf8');
function harness(saved={}){
  const elements=new Map(),events={},storage={...saved};
  const get=id=>{if(!elements.has(id))elements.set(id,{hidden:false,value:'',disabled:false,style:{},dataset:{},offsetTop:0,clientHeight:340,textContent:'',innerHTML:'',focus(){},setAttribute(){},addEventListener(type,fn){events[id+':'+type]=fn},querySelector(){return {offsetTop:500}},querySelectorAll(){return []}});return elements.get(id)};
  const ctx=vm.createContext({$:get,state:undefined,collection:{unlocked:['little'],equipped:'little'},format:s=>`${Math.floor(s/60)}:${Math.floor(s%60)}`,save(){},renderCollection(){},applyLook(){},localStorage:{getItem:key=>storage[key]??null,setItem(key,value){storage[key]=value},removeItem(key){delete storage[key]}},performance:{now:()=>0},requestAnimationFrame(){},document:{hidden:false,addEventListener(type,fn){events[type]=fn}},window:{addEventListener(type,fn){events[type]=fn}}});
  vm.runInContext(source,ctx);
  return {run:s=>vm.runInContext(s,ctx),get,storage,key(key){events.keydown({key,preventDefault(){}})},input(value){get('story-input').value=value;events['story-input:input']()}};
}
test('two long original stories start with a focused typing area',()=>{
  const h=harness();assert.equal(h.run('stories.length'),2);assert.ok(h.run('stories.every(s=>s.text.split(/\\s+/).length>=400)'));
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
