const STORAGE_KEY = "forum_chat";

function getMessages() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveMessages(messages) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

function getCurrentUser() {
  return document.title.includes("Mahasiswa")
    ? "Mahasiswa"
    : "Dosen";
}

function renderMessages() {
  const chatBox = document.getElementById("chatBox");
  const messages = getMessages();
  const currentUser = getCurrentUser();

  chatBox.innerHTML = "";

  messages.forEach(msg => {
    const messageDiv = document.createElement("div");

    // cek apakah pesan milik user sekarang
    const isMine = msg.sender === currentUser;

    messageDiv.classList.add(
      "message",
      isMine ? "mine" : "other"
    );

    messageDiv.innerHTML = `
      <div class="message-header">
        ${msg.sender} • ${msg.time}
      </div>
      <div class="message-text">
        ${msg.text}
      </div>
    `;

    chatBox.appendChild(messageDiv);
  });

  chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage(sender) {
  const input = document.getElementById("messageInput");
  const text = input.value.trim();

  if (!text) return;

  const messages = getMessages();

  const now = new Date();
  const time = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit"
  });

  messages.push({
    sender,
    text,
    time
  });

  saveMessages(messages);
  input.value = "";
  renderMessages();
}

function clearChat() {
  localStorage.removeItem(STORAGE_KEY);
  renderMessages();
}

document.addEventListener("DOMContentLoaded", () => {
  renderMessages();

  const input = document.getElementById("messageInput");

  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage(getCurrentUser());
    }
  });
});

window.addEventListener("storage", () => {
  renderMessages();
});
