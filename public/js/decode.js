document.addEventListener('DOMContentLoaded', () => {
  const $ = id => document.getElementById(id);
  const input   = $('inputText');
  const decode  = $('decodeBtn');
  const clear   = $('clearBtn');
  const outSec  = $('outputSection');
  const outTxt  = $('outputText');
  const copy    = $('copyBtn');
  const err     = $('errorMsg');

  const hide = el => el.classList.add('hidden');
  const show = el => el.classList.remove('hidden');

  const showError = msg => { err.textContent = msg; show(err); hide(outSec); };
  const showResult = txt => { outTxt.textContent = txt; show(outSec); hide(err); };

  const api = async (data) => {
    const r = await fetch('/decode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error || 'Decode failed');
    return j.result;
  };

  decode.addEventListener('click', async () => {
    const txt = input.value.trim();
    if (!txt) return showError('Please enter a Base64 string.');
    try {
      showResult(await api({ text: txt }));
    } catch (e) {
      showError(e.message);
    }
  });

  clear.addEventListener('click', () => {
    input.value = '';
    hide(outSec);
    hide(err);
    input.focus();
  });

  copy.addEventListener('click', () => {
    navigator.clipboard.writeText(outTxt.textContent).then(() => {
      const old = copy.textContent;
      copy.textContent = 'Copied!';
      copy.style.background = '#27ae60';
      setTimeout(() => {
        copy.textContent = old;
        copy.style.background = '';
      }, 1500);
    });
  });
});
