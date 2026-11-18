const { spawn } = require('child_process');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const htmlPath = path.resolve('ban-day-du/src/phan-mem.html');
const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');

console.log('Launching Edge headless...');
const edgeProc = spawn(edgePath, [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--user-data-dir=' + path.resolve('tmp_edge_profile_' + Date.now()),
  fileUrl
]);

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function getWsUrl() {
  for (let i = 0; i < 30; i++) {
    await sleep(300);
    try {
      const res = await fetch('http://127.0.0.1:9222/json');
      const data = await res.json();
      if (data && data.length > 0 && data[0].webSocketDebuggerUrl) {
        return data[0].webSocketDebuggerUrl;
      }
    } catch (e) {}
  }
  throw new Error('Could not get debugger URL');
}

async function run() {
  try {
    const wsUrl = await getWsUrl();
    const ws = new WebSocket(wsUrl);

    let id = 1;
    const callbacks = new Map();

    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const msgId = id++;
        callbacks.set(msgId, { resolve, reject });
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Console.messageAdded' || msg.method === 'Runtime.consoleAPICalled') {
        const args = msg.params.args ? msg.params.args.map(a => a.value || a.description || JSON.stringify(a)).join(' ') : (msg.params.message && msg.params.message.text);
        console.log('[BROWSER CONSOLE]', msg.params.type || '', args);
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        console.error('[BROWSER EXCEPTION]', msg.params.exceptionDetails.text, msg.params.exceptionDetails.exception?.description || '');
      }
      if (msg.id && callbacks.has(msg.id)) {
        const { resolve, reject } = callbacks.get(msg.id);
        callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };

    await new Promise(r => ws.onopen = r);
    await send('Runtime.enable');
    await send('Console.enable');

    console.log('Waiting 3s for page load...');
    await sleep(3000);

    // Click Dùng dữ liệu mẫu nếu có
    console.log('Checking for [data-act="sample"]...');
    await send('Runtime.evaluate', {
      expression: `(function() {
        var btn = document.querySelector('[data-act="sample"]');
        if (btn) { btn.click(); return 'Clicked sample'; }
        return 'No sample button';
      })()`
    });

    console.log('Waiting 3s for sample to load...');
    await sleep(3000);

    // Chuyển sang #nv
    await send('Runtime.evaluate', { expression: `window.location.hash = '#nv';` });
    await sleep(1500);

    // Click nút Sửa của nhân viên đầu tiên
    console.log('Finding employee edit button...');
    const editBtnRes = await send('Runtime.evaluate', {
      expression: `(function() {
        var btn = document.querySelector('[data-act="nv-edit"]');
        if (!btn) return { ok: false, error: 'Edit button not found' };
        btn.click();
        return { ok: true, id: btn.getAttribute('data-id') };
      })()`,
      returnByValue: true
    });
    console.log('Edit button click result:', editBtnRes.result.value);

    await sleep(1000);

    // Đổi chức vụ và bấm lưu
    console.log('Testing modal save...');
    const saveRes = await send('Runtime.evaluate', {
      expression: `(function() {
        var m = document.querySelector('.modal-wrap');
        if (!m) return { ok: false, error: 'Modal not opened' };

        var cvSel = document.querySelector('#fCv');
        if (!cvSel) return { ok: false, error: 'fCv not found' };

        console.log('Current Chức vụ options:', Array.from(cvSel.options).map(o => o.value));
        console.log('Current Chức vụ value:', cvSel.value);

        cvSel.value = 'Giám đốc';
        cvSel.dispatchEvent(new Event('change', { bubbles: true }));
        console.log('New Chức vụ value:', cvSel.value);

        var saveBtn = document.querySelector('#fSave');
        if (!saveBtn) return { ok: false, error: 'Save button not found' };

        console.log('About to click #fSave...');
        saveBtn.click();
        console.log('Clicked #fSave.');

        var mAfter = document.querySelector('.modal-wrap');
        return {
          ok: true,
          modalStillOpen: !!mAfter
        };
      })()`,
      returnByValue: true
    });
    console.log('Save result:', saveRes.result.value);

    await sleep(1000);
    ws.close();
  } catch (e) {
    console.error('Test error:', e);
  } finally {
    edgeProc.kill();
  }
}

run();
