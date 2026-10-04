// Real Chrome smoke test without third-party packages. Run with Node 22+.
// macOS: node tests/browser-smoke.cjs
// Elsewhere: CHROME_PATH=/path/to/chrome node tests/browser-smoke.cjs
// Screenshots are saved to a temporary directory printed at the end.
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const {spawn} = require('node:child_process');
const root = path.resolve(__dirname, '..');
const chromePath = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const errors = [];
let browser, socket, server, artifacts;

async function main() {
  artifacts = await fs.mkdtemp(path.join(os.tmpdir(), 'typepal-browser-'));
  server = http.createServer(async (req, res) => {
    try {
      if (new URL(req.url, 'http://localhost').pathname === '/favicon.ico') {
        res.writeHead(204).end();
        return;
      }
      const filename = path.resolve(root, '.' + new URL(req.url, 'http://localhost').pathname);
      if (!filename.startsWith(root + path.sep) && filename !== root) {
        res.writeHead(403).end();
        return;
      }
      const selected = filename === root || filename.endsWith(path.sep) ? path.join(filename, 'index.html') : filename;
      const type = {'.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.svg':'image/svg+xml'}[path.extname(selected)] || 'application/octet-stream';
      res.writeHead(200, {'Content-Type':type});
      res.end(await fs.readFile(selected));
    } catch {
      res.writeHead(404).end();
    }
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  browser = spawn(chromePath, [
    '--headless=new', '--remote-debugging-port=0',
    `--user-data-dir=${path.join(artifacts, 'profile')}`,
    '--no-first-run', '--no-default-browser-check',
    '--disable-background-networking', '--disable-component-update', '--disable-sync',
    'about:blank'
  ], {stdio:['ignore','ignore','pipe']});
  let browserLog = '';
  browser.stderr.on('data', chunk => { browserLog += chunk; });
  let port;
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      port = Number((await fs.readFile(path.join(artifacts, 'profile', 'DevToolsActivePort'), 'utf8')).split('\n')[0]);
      break;
    } catch {
      if (browser.exitCode !== null) throw new Error(`Chrome exited (${browser.exitCode}). ${browserLog}`);
      await delay(100);
    }
  }
  if (!port) throw new Error(`Chrome did not start. ${browserLog}`);
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const target = targets.find(item => item.type === 'page');
  if (!target) throw new Error('Chrome did not open a page.');
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {socket.addEventListener('open', resolve, {once:true});socket.addEventListener('error', reject, {once:true});});
  let serial = 0;
  const pending = new Map();
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (message.id) {
      const request = pending.get(message.id);
      if (!request) return;
      pending.delete(message.id);
      clearTimeout(request.timer);
      if (message.error) request.reject(new Error(`${request.method}: ${JSON.stringify(message.error)}`));
      else request.resolve(message.result);
    }
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
    if (message.method === 'Log.entryAdded' && message.params.entry.level === 'error') errors.push(message.params.entry.text);
  });
  const command = (method, params={}) => new Promise((resolve, reject) => {
    const id = ++serial;
    const timer = setTimeout(() => {pending.delete(id);reject(new Error(`Timed out: ${method}`));}, 10000);
    pending.set(id, {resolve,reject,timer,method});
    socket.send(JSON.stringify({id,method,params}));
  });
  const evaluate = async expression => {
    const result = await command('Runtime.evaluate', {expression,returnByValue:true,awaitPromise:true});
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result.value;
  };
  const waitFor = async (expression, label) => {
    for (let attempt=0;attempt<100;attempt++) {
      try {
        if (await evaluate(expression)) return;
      } catch (error) {
        // Navigation can destroy the current execution context between poll calls.
        if (!/context|navigated|closed/i.test(error.message)) throw error;
      }
      await delay(30);
    }
    throw new Error(`Page condition failed: ${label}`);
  };
  const click = async selector => {
    await waitFor(`Boolean(document.querySelector(${JSON.stringify(selector)}))`, `click target ${selector}`);
    return evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
  };
  const press = async key => {
    const special = {Enter:13,Backspace:8,Escape:27,Tab:9};
    await command('Input.dispatchKeyEvent', {
      type:'keyDown',key,
      code:key.length===1&&/[a-z]/i.test(key)?'Key'+key.toUpperCase():key===' '?'Space':key,
      windowsVirtualKeyCode:special[key] || (key.length===1?key.toUpperCase().charCodeAt(0):0),
      ...(key.length===1?{text:key,unmodifiedText:key}:{})
    });
    await command('Input.dispatchKeyEvent', {type:'keyUp',key});
  };
  const type = async value => {for (const char of value) await press(char==='\n'?'Enter':char);};
  const screenshot = async name => {
    await delay(150);
    const result = await command('Page.captureScreenshot', {format:'png',captureBeyondViewport:false});
    await fs.writeFile(path.join(artifacts, name+'.png'), Buffer.from(result.data, 'base64'));
  };
  const noOverflow = async label => {
    const dimensions = await evaluate('({width:innerWidth,scroll:document.documentElement.scrollWidth})');
    assert.ok(dimensions.scroll <= dimensions.width+1, `${label} has horizontal overflow: ${JSON.stringify(dimensions)}`);
  };
  const readerFirst = async label => {
    const positions = await evaluate("({reader:document.getElementById('story-reader').getBoundingClientRect().top,scene:document.getElementById('story-stage').getBoundingClientRect().top,height:innerHeight})");
    assert.ok(positions.reader < positions.scene, `${label} presents the typing passage before the scenery`);
    assert.ok(positions.reader < positions.height, `${label} keeps the passage within the first screen`);
  };
  const restingStory = async label => {
    assert.equal(await evaluate("getComputedStyle(document.querySelector('.reader-pause-note')).display"), 'none', `${label}: pause message stays hidden during typing`);
    assert.equal(await evaluate("getComputedStyle(document.querySelector('.scene-celebration')).opacity"), '0', `${label}: celebration stays hidden until earned`);
  };
  await command('Runtime.enable');
  await command('Log.enable');
  await command('Page.enable');
  await command('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  await command('Page.navigate', {url:`http://127.0.0.1:${server.address().port}/index.html`});
  await waitFor("document.readyState==='complete' && typeof startStroll==='function'", 'initial page');
  await noOverflow('Desktop home');
  await screenshot('desktop-home');

  await click('[data-story="moonflower"]');
  await waitFor("!document.getElementById('story').hidden", 'story opens');
  await restingStory('New story');
  await click('#how-button');
  assert.equal(await evaluate("document.getElementById('how-dialog').open"), true, 'Field guide opens over story');
  assert.equal(await evaluate('stroll.paused'), true, 'Field guide pauses the story timer');
  await press('q');
  assert.equal(await evaluate('stroll.typed'), '', 'Guide does not consume story characters');
  await press('Escape');
  await waitFor("!document.getElementById('how-dialog').open && !stroll.paused", 'native Escape dismisses story guide and finishes its close handler');
  assert.equal(await evaluate('stroll.paused'), false, 'Closing guide restores the story');
  assert.equal(await evaluate('document.activeElement.id'), 'story-reader', 'Closing guide returns typing focus');
  const opening = await evaluate('stroll.story.text.slice(0,30)');
  await type(opening.slice(0,8));
  assert.equal(await evaluate('stroll.typed'), opening.slice(0,8), 'Desktop keys type directly on the passage');
  await press('x');
  assert.ok(await evaluate("document.querySelectorAll('.story-wrong').length>0"), 'Typo feedback is visible');
  await press('Backspace');
  await type(opening.slice(8));
  assert.equal(await evaluate('stroll.typed'), opening, 'Backspace corrects the typo');
  await press('Escape');
  assert.equal(await evaluate('stroll.paused'), true, 'Escape pauses story');
  assert.notEqual(await evaluate("getComputedStyle(document.querySelector('.reader-pause-note')).display"), 'none', 'Paused story shows its pause note');
  await screenshot('desktop-story-paused');
  await press('z');
  assert.equal(await evaluate('stroll.typed'), opening, 'Paused story ignores typing');
  await press('Escape');
  await restingStory('Resumed story');
  await noOverflow('Desktop story');
  await screenshot('desktop-story');

  if (await evaluate("Boolean(document.getElementById('story-focus'))")) {
    await click('#story-focus');
    assert.equal(await evaluate("document.body.dataset.focus"), 'true', 'Focus mode hides distractions');
    await screenshot('desktop-story-focus');
    await click('#story-focus');
    assert.equal(await evaluate("document.body.dataset.focus"), 'false', 'Focus mode can be left');
    await evaluate('focusStroll()');
  }
  if (await evaluate("Boolean(document.getElementById('story-stats-toggle'))")) {
    const oldHidden = await evaluate("document.getElementById('story-live-stats').hidden");
    await click('#story-stats-toggle');
    assert.equal(await evaluate("document.getElementById('story-live-stats').hidden"), !oldHidden, 'Live typing statistics can be toggled');
    await click('#story-stats-toggle');
    await evaluate('focusStroll()');
  }

  // Advance through a snippet boundary using the same page keyboard listener.
  const next = await evaluate('stroll.story.text.slice(stroll.typed.length,storySnippets(stroll.story.text)[0].end)');
  await type(next);
  assert.ok(await evaluate("document.getElementById('story-snippet-count').textContent.startsWith('2 /')"), 'Story advances to the next snippet');
  const preserved = await evaluate('stroll.typed');
  await click('#story-home');
  await evaluate('window.__qaReloadPending=true');
  await command('Page.reload');
  await waitFor("!window.__qaReloadPending && document.readyState==='complete' && Boolean(document.querySelector('[data-story=moonflower]'))", 'reload into a new document');
  await click('[data-story="moonflower"]');
  assert.equal(await evaluate('stroll.typed'), preserved, 'Story progress survives reload');
  await click('#story-punctuation');
  assert.equal(await evaluate('punctuationOn'), false, 'Punctuation toggle works');
  assert.ok(await evaluate('/^[a-zA-Z\\s]+$/.test(stroll.story.text)'), 'Punctuation-free passage contains letters and whitespace');
  await click('#story-punctuation');

  // Verify completion/reward rendering after the real key and save workflows.
  await evaluate("stroll.elapsed=300;stroll.typed=stroll.story.text.slice(0,-1);stroll.attempts=stroll.typed.length;stroll.correct=stroll.typed.length;document.getElementById('story-input').value=stroll.typed;renderStroll();focusStroll()");
  await type(await evaluate('stroll.story.text.slice(-1)'));
  assert.equal(await evaluate('stroll.finished'), true, 'Last character completes the journey');
  assert.equal(await evaluate("document.getElementById('story-results').hidden"), false);
  assert.ok(await evaluate("scrapbook.includes('moonflower') && collection.unlocked.includes('traveler')"), 'Completion grants permanent postcard and outfit');
  await screenshot('desktop-story-finished');
  await click('#story-finish-home');

  await click('#play-button');
  await waitFor("state.mode==='playing' && state.creatures.length>0", 'Typefall spawns');
  const word = await evaluate('state.creatures[0].word');
  await type(word);
  assert.ok(await evaluate('state.cleared>=1'), 'Typing a falling word helps a friend');
  await evaluate("state.inventory.breeze=1;state.inventory.frost=1;renderSpells()");
  await press('1');
  assert.ok(await evaluate('state.slow>0 && state.inventory.breeze===0'), 'Keyboard casts a collected spell');
  await click('[data-spell="frost"]');
  assert.ok(await evaluate('state.frozen>0 && state.inventory.frost===0'), 'Click casts a collected spell');
  await click('#how-button');
  assert.equal(await evaluate('state.mode'), 'paused', 'Field guide pauses falling friends');
  const guideTime = await evaluate('state.time');
  await delay(150);
  assert.equal(await evaluate('state.time'), guideTime, 'Typefall remains still while guide is open');
  await press('Escape');
  await waitFor("!document.getElementById('how-dialog').open && state.mode==='playing'", 'native Escape dismisses Typefall guide and resumes play');
  assert.equal(await evaluate('state.mode'), 'playing', 'Closing guide resumes Typefall');
  await press('Escape');
  assert.equal(await evaluate('state.mode'), 'paused', 'Escape pauses Typefall');
  await press('Escape');
  assert.equal(await evaluate('state.mode'), 'playing', 'Escape resumes Typefall');
  await noOverflow('Desktop Typefall');
  await screenshot('desktop-typefall');
  await press('Escape');
  await click('#quit');

  await command('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await command('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});
  await noOverflow('Mobile home');
  await screenshot('mobile-home');
  await click('[data-story="rainy"]');
  assert.equal(await evaluate("document.activeElement.id"), 'story-input', 'Touch story opens the native keyboard input');
  await readerFirst('Mobile story');
  await restingStory('Mobile story');
  const mobileOpening = await evaluate('stroll.story.text.slice(0,15)');
  await command('Input.insertText',{text:mobileOpening});
  assert.equal(await evaluate('stroll.typed'), mobileOpening, 'Native text input updates story progress');
  await noOverflow('Mobile story');
  await screenshot('mobile-story');
  await click('#story-pause');
  assert.equal(await evaluate('stroll.paused'), true);
  await click('#story-pause');
  assert.equal(await evaluate('stroll.paused'), false);
  await click('#story-home');
  await click('#play-button');
  await waitFor("state.mode==='playing'", 'Mobile Typefall opens');
  await noOverflow('Mobile Typefall');
  await screenshot('mobile-typefall');
  await press('Escape');
  await click('#quit');

  // Check compact phones and the tablet widths where columns change.
  for (const [width,height] of [[320,760],[768,1024],[1024,900]]) {
    await command('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<650});
    await command('Emulation.setTouchEmulationEnabled',{enabled:width<650,maxTouchPoints:1});
    await noOverflow(`${width}px home`);
    await click('[data-story="tea"]');
    await noOverflow(`${width}px story`);
    if (width<650) await readerFirst(`${width}px story`);
    const controls = await evaluate("Array.from(document.querySelectorAll('#story .story-actions button')).map(button=>({id:button.id,width:button.getBoundingClientRect().width,height:button.getBoundingClientRect().height}))");
    assert.ok(controls.every(control=>control.width>0&&control.height>0), `${width}px story controls remain visible`);
    await screenshot(`${width}-story`);
    await click('#story-home');
  }

  // Show the later scenery without advancing to the final character or granting rewards.
  await command('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  await command('Emulation.setTouchEmulationEnabled',{enabled:false});
  for (const [id,chapter] of [['rainy',4],['stars',2],['tea',3]]) {
    await click(`[data-story="${id}"]`);
    await evaluate(`(()=>{const boundaries=[0,...Array.from(stroll.story.text.matchAll(/\\n/g),match=>match.index+1)];const position=boundaries[Math.min(${chapter},boundaries.length-1)]+18;stroll.typed=stroll.story.text.slice(0,Math.min(position,stroll.story.text.length-1));document.getElementById('story-input').value=stroll.typed;renderStroll();})()`);
    assert.equal(await evaluate('stroll.finished'), false, `${id} scenery preview does not complete a story`);
    if (await evaluate("Boolean(document.getElementById('story-stats-toggle')) && !document.getElementById('story-live-stats').hidden")) await click('#story-stats-toggle');
    await screenshot(`desktop-${id}-chapter-${chapter+1}`);
    await click('#story-home');
  }
  await command('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await click('[data-story="stars"]');
  await type(await evaluate('stroll.story.text.slice(0,10)'));
  const animatedDecor = await evaluate("Array.from(document.querySelectorAll('#story-stage *, .story-passage p')).map(element=>({className:element.className,duration:getComputedStyle(element).animationDuration})).filter(item=>item.duration.split(',').some(duration=>parseFloat(duration)>0.02))");
  assert.deepEqual(animatedDecor, [], 'Reduced motion stops long-running scenery animations');
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.scene-celebration')).display"), 'none', 'Reduced motion hides celebration confetti');
  assert.deepEqual(errors.filter(error => !/favicon\.ico/.test(error)), [], 'No runtime or resource errors');
  console.log('Browser smoke checks passed: story typing, correction, pause, snippet advance, persistence, punctuation, rewards; Typefall typing, spells, pause; desktop and mobile layouts.');
  console.log(`Screenshots: ${artifacts}`);
}

main().catch(error => {console.error(error.stack);if(artifacts)console.error(`Artifacts: ${artifacts}`);process.exitCode=1;}).finally(async () => {
  socket?.close();
  browser?.kill();
  if (server?.listening) await new Promise(resolve => server.close(resolve));
});
