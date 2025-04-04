document.getElementById("user-input").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});

document.getElementById("send-btn").addEventListener("click", sendMessage);

// Function to show the bot is typing
function showTypingIndicator() {
  const chatDisplay = document.getElementById("chat-display");
  const typingIndicator = document.createElement("div");
  typingIndicator.id = "typing-indicator";
  typingIndicator.innerHTML = `<strong>TLM:</strong> <span class="typing-animation"><span>.</span><span>.</span><span>.</span></span>`;
  chatDisplay.appendChild(typingIndicator);
  chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

// Function to remove typing indicator
function removeTypingIndicator() {
  const typingIndicator = document.getElementById("typing-indicator");
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

function sendMessage() {
  const userInput = document.getElementById("user-input").value;
  if (userInput.trim() !== "") {
    displayMessage("Degen", userInput);
    document.getElementById("user-input").value = "";

    // Show typing indicator immediately after user message
    showTypingIndicator();

    fetchChatGPTResponse(userInput).then((response) => {
      // Remove typing indicator before showing the response
      removeTypingIndicator();
      displayMessage("TLM", response);
    }).catch(error => {
      // Make sure to remove typing indicator even if there's an error
      removeTypingIndicator();
      displayMessage("TLM", "Not very strategic of you");
    });
  }
}

function displayMessage(sender, message) {
  const chatDisplay = document.getElementById("chat-display");
  const messageElement = document.createElement("div");
  messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatDisplay.appendChild(messageElement);
  chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

async function fetchChatGPTResponse(userInput) {
  try {
    const baseUrl = window.location.origin;
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: userInput })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error:', error);
    return 'Not very strategic of you';
  }
}