async function sendMessage() {
  const input = document.getElementById("userInput");
  const chatBox = document.getElementById("chatBox");

  const userMsg = document.createElement("div");
  userMsg.className = "message player";
  userMsg.textContent = input.value;

  chatBox.appendChild(userMsg);

  const message = input.value;
  input.value = "";

  // Loading message
  const loading = document.createElement("div");
  loading.className = "message npc";
  loading.textContent = "Thinking...";
  chatBox.appendChild(loading);

  try {
    const res = await fetch("YOUR_API_URL_HERE", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await res.json();

    if (!res.ok) {
      loading.textContent = data.details || "Error from server";
      return;
    }

    // Replace loading with actual reply
    loading.textContent = data.reply;

  } catch (error) {
    loading.textContent = "Network error";
    console.error(error);
  }
}
