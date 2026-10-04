const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const source=fs.readFileSync(require('node:path').join(__dirname,'../game.js'),'utf8');
function harness(saved={}){
  const elements=new Map(),listeners={},storage={...saved};
  function element(){
    const children=new Map(),classes=new Set();
    return {hidden:false,style:{setProperty(){}},dataset:{},classList:{add(c){classes.add(c)},remove(c){classes.delete(c)},toggle(c,on){if(on)classes.add(c);else classes.delete(c)}},clientWidth:900,clientHeight:480,textContent:'',innerHTML:'',setAttribute(){},removeAttribute(name){if(name==='data-crown')delete this.dataset.crown},append(){},replaceChildren(){},remove(){},querySelector(name){if(!children.has(name))children.set(name,element());return children.get(name)},querySelectorAll(){return []},showModal(){this.open=true},close(){this.open=false}};
  }
  const get=id=>{if(!elements.has(id))elements.set(id,element());return elements.get(id)};
  const context=vm.createContext({window:{addEventListener(type,fn){listeners[type]=fn}},document:{getElementById:get,createElement:element,querySelectorAll(){return [get('game-puff'),get('menu-puff')]},addEventListener(type,fn){listeners[type]=fn}},localStorage:{getItem(key){return storage[key]??null},setItem(key,value){storage[key]=value}},requestAnimationFrame(){},performance:{now(){return 0}},console});
  get('story').hidden=true;
  vm.runInContext(source,context);
  return {run:code=>vm.runInContext(code,context),storage,get,key(key){listeners.keydown({key,code:key,preventDefault(){}})}};
}
test('new words type immediately, shared prefixes resolve, mistakes preserve progress',()=>{
  const h=harness();h.run("start();const c=spawn('normal');c.word='tea';render(c)");h.key('t');h.key('x');assert.equal(h.run('state.target.typed'),1);h.key('e');h.key('a');assert.equal(h.run('state.cleared'),1);
  h.run("const closest=spawn('normal');closest.word='cloud';closest.y=90;const wanted=spawn('normal');wanted.word='cozy';wanted.y=30;");for(const key of 'cozy')h.key(key);
  assert.equal(h.run('state.creatures.includes(wanted)'),false);assert.equal(h.run('closest.typed'),0);
});
test('starting another word switches targets and backspace releases it',()=>{
  const h=harness();h.run("start();const a=spawn('normal');a.word='tea';a.y=90;const b=spawn('normal');b.word='moon';b.y=30;");h.key('t');for(const key of 'moon')h.key(key);
  assert.equal(h.run('state.creatures.includes(b)'),false);h.key('t');h.key('Backspace');assert.equal(h.run('state.target'),null);assert.equal(h.run('a.typed'),0);
});
test('colored words are stored without applying any effects',()=>{
  const h=harness();h.run("start();state.hearts=2;for(const spell of spells)sendHome(spawn(spell.id));");
  assert.equal(h.run('state.hearts'),2);assert.equal(h.run('state.frozen'),0);assert.equal(h.run('state.slow'),0);assert.equal(h.run('spells.every(s=>state.inventory[s.id]===1)'),true);assert.equal(h.run('state.mode'),'playing');assert.equal(h.get('overlay').hidden,true);
});
test('keyboard casts collected breeze and frost; spells stack and are consumed',()=>{
  const h=harness();h.run("start();sendHome(spawn('breeze'));sendHome(spawn('breeze'));sendHome(spawn('frost'));const friend=spawn('normal');state.spawn=99;");h.key('1');assert.equal(h.run('state.inventory.breeze'),1);assert.equal(h.run('state.slow'),7);
  h.run('const previous=friend.y;update(1)');assert.ok(Math.abs(h.run('friend.y-previous')-22*.45)<.0001);
  h.key('2');h.run('const frozenPosition=friend.y;update(1)');assert.equal(h.run('friend.y'),h.run('frozenPosition'));assert.equal(h.run('state.inventory.frost'),0);
  h.key('2');assert.equal(h.run('state.frozen'),3);
});
test('aurora clears without granting XP or collecting more spells',()=>{
  const h=harness();h.run("start();sendHome(spawn('aurora'));spawn('normal');spawn('bloom');const xpBefore=state.xp;castSpell('aurora')");assert.equal(h.run('state.creatures.length'),0);assert.equal(h.run('state.xp'),h.run('xpBefore'));assert.equal(h.run('state.inventory.bloom'),0);assert.equal(h.run('state.inventory.aurora'),0);
});
test('tide preserves spacing and typing progress; bloom restores a heart',()=>{
  const h=harness();h.run("start();state.inventory.tide=1;state.inventory.bloom=1;const a=spawn('normal');a.y=200;const b=spawn('normal');b.y=80;state.target=a;a.typed=1;castSpell('tide')");assert.equal(h.run('a.y'),80);assert.equal(h.run('b.y'),-40);assert.equal(h.run('state.target===a'),true);assert.equal(h.run('a.typed'),1);
  h.run("castSpell('bloom')");assert.equal(h.run('state.inventory.bloom'),1);h.run("state.hearts=2;castSpell('bloom')");assert.equal(h.run('state.hearts'),3);assert.equal(h.run('state.inventory.bloom'),0);
});
test('empty or paused casts do not consume spells; restarting clears inventory',()=>{
  const h=harness();h.run("start();state.inventory.aurora=1;castSpell('aurora');state.inventory.frost=2;pause();castSpell('frost')");assert.equal(h.run('state.inventory.aurora'),1);assert.equal(h.run('state.inventory.frost'),2);h.run('start()');assert.equal(h.run('state.inventory.frost'),0);
});
test('occupied entrances defer spawns and monster spacing stays safe over time',()=>{
  const h=harness();h.run("start();for(let i=0;i<laneLayout().count;i++)spawn('normal');");assert.equal(h.run("spawn('normal')"),null);
  h.run(`state.time=200;for(let frame=0;frame<1500;frame++){state.hearts=3;update(.05);for(const a of state.creatures)for(const b of state.creatures){if(a!==b&&a.lane===b.lane&&Math.abs(a.y-b.y)<111.99)throw Error('Overlap');}}`);
});
test('narrow viewport and resizing keep labels in lanes without vertical collisions',()=>{
  const h=harness();h.get('arena').clientWidth=360;h.run("start();const a=spawn('normal');a.y=220;const b=spawn('normal');b.y=100;const c=spawn('normal');");h.get('arena').clientWidth=170;h.run('resizeLanes()');assert.equal(h.run('laneLayout().count'),1);
  h.run("for(const a of state.creatures)for(const b of state.creatures){if(a!==b&&Math.abs(a.y-b.y)<112)throw Error('Resize overlap')}");assert.equal(h.run('state.creatures.every(c=>c.x>=0&&c.x<170)'),true);
});
test('Puff gains cosmetic levels without automatically altering monsters',()=>{
  const h=harness();h.run("start();const c=spawn('normal');c.y=10;state.xp=100;levelUp();state.spawn=99;update(20)");assert.equal(h.run('state.creatures.includes(c)'),false);assert.equal(h.run('state.hearts'),2);assert.equal(h.run('state.slow'),0);assert.equal(h.run('state.frozen'),0);assert.equal(h.run('state.mode'),'playing');
  assert.ok(!source.includes('helpClock'));assert.ok(!source.includes('sparkle('));
});
test('difficulty increases only at wave boundaries and later waves add groups',()=>{
  const h=harness();h.run('start()');const initial=h.run('speed()'),interval=h.run('spawnInterval()');h.run('state.time=34;state.level=12');assert.equal(h.run('speed()'),initial);assert.equal(h.run('spawnInterval()'),interval);
  h.run('state.time=40');assert.ok(h.run('speed()')>initial);assert.ok(h.run('spawnInterval()')<interval);
  h.run('start();state.time=80;state.spawnCount=3;state.spawn=0;update(.01)');assert.equal(h.run('state.creatures.length'),2);
  h.run('start();state.time=200;state.spawnCount=3;state.spawn=0;update(.01)');assert.equal(h.run('state.creatures.length'),3);
});
test('large vocabulary avoids repeats and reserves themed spell words',()=>{
  const h=harness();assert.ok(h.run('words.length')>=700);h.run("start();const seen=new Set();for(let i=0;i<150;i++){const c=spawn('normal');if(seen.has(c.word))throw Error('Repeat');if(spells.some(s=>s.word===c.word))throw Error('Uncolored spell word');seen.add(c.word);remove(c)}");assert.equal(h.run('seen.size'),150);
});
test('survival titles persist across restart and reload without interrupting play',()=>{
  const h=harness();h.run('start();state.time=30;checkMilestones()');assert.equal(h.run('collection.equipped'),'sprout');assert.equal(h.run('state.mode'),'playing');assert.equal(h.get('overlay').hidden,true);
  h.run('start()');assert.equal(h.run('collection.equipped'),'sprout');const reload=harness(h.storage);assert.equal(reload.run('collection.equipped'),'sprout');
});
test('pause stops time and zero hearts ends the run and saves records',()=>{
  const h=harness();h.run('start();state.time=29;pause();update(10)');assert.equal(h.run('state.time'),29);h.run("resume();state.hearts=1;spawn('normal').y=400;update(.01)");assert.equal(h.run('state.mode'),'ended');assert.equal(JSON.parse(h.storage['puffpals-best']).time,29);
});
