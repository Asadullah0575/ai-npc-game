function sendMessage() {
  const input = document.getElementById("userInput");
  const chatBox = document.getElementById("chatBox");

  const userMsg = document.createElement("div");
  userMsg.className = "message player";
  userMsg.textContent = input.value;

  chatBox.appendChild(userMsg);

  input.value = "";

  // Fake AI reply (temporary)
  setTimeout(() => {
    const npcMsg = document.createElement("div");
    npcMsg.className = "message npc";
    npcMsg.textContent = "I am thinking...";
    chatBox.appendChild(npcMsg);
  }, 500);
}