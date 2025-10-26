document.addEventListener('DOMContentLoaded', () => {
  const inputText = document.getElementById('inputText');
  const encodeBtn = document.getElementById('encodeBtn');
  const decodeBtn = document.getElementById('decodeBtn');
  const outputSection = document.getElementById('outputSection');
  const outputText = document.getElementById('outputText');
  const outputLabel = document.getElementById('outputLabel');
  const copyBtn = document.getElementById('copyBtn');
  const errorMsg = document.getElementById('errorMsg');

  const showError = (msg) => {
    errorMsg.textContent = msg;
    errorMsg.classList.remove('hidden');
    outputSection.classList.add('hidden');
  };

  const showOutput = (text, type) => {
    outputText.textContent = text;
    outputLabel.textContent = type === 'encode' ? 'Encoded:' : 'Decoded:';
    outputSection.classList.remove('hidden');
    errorMsg.classList.add('hidden');
  };

  const callAPI = async (endpoint, data) => {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Operation failed');
      return json.result;
    } catch (err) {
      throw err;
    }
  };

  encodeBtn.addEventListener('click', async () => {
    const text = inputText.value.trim();
    if (!text) return showError('Please enter text to encode.');

    try {
      const result = await callAPI('/encode', { text });
      showOutput(result, 'encode');
    } catch (err) {
      showError(err.message);
    }
  });

  decodeBtn.addEventListener('click', async () => {
    const text = inputText.value.trim();
    if (!text) return showError('Please enter Base64 text to decode.');

    try {
      const result = await callAPI('/decode', { text });
      showOutput(result, 'decode');
    } catch (err) {
      showError(err.message);
    }
  });

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(outputText.textContent).then(() => {
      const original = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      copyBtn.style.background = '#27ae60';
      setTimeout(() => {
        copyBtn.textContent = original;
        copyBtn.style.background = '';
      }, 2000);
    });
  });
});
