const chatBox = document.getElementById('chat-box');
const input = document.getElementById('user-input');
const button = document.getElementById('send-btn');

function appendMessage(text, className) {
  const div = document.createElement('div');
  div.textContent = text;
  div.className = `message ${className}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const msg = input.value.trim();
  if (!msg) return;
  appendMessage(msg, 'user');
  input.value = '';

  try {
    const res = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg })
    });
    const data = await res.json();
    appendMessage(data.reply, 'ai');
  } catch (err) {
    appendMessage('Error connecting to AI', 'ai');
  }
}

button.addEventListener('click', sendMessage);
input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});