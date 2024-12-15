const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null; // Variable to store user's message
const API_KEY = "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"; 
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    // Create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `  <span><img src="https://img.icons8.com/?size=256&id=37410&format=png" alt=""></span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; // return chat <li> element
}

const generateResponse = async (chatElement) => {
    const messageElement = chatElement.querySelector("p");

    try {
        const response = await getChatResponse(userMessage);

        // Set the response message text
        messageElement.textContent = response;
    } catch (error) {
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong. Please try again.";
    } finally {
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }
}

async function getChatResponse(userMessage) {
    const apiKey = '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';  // Replace with your actual API key
    const url = 'https://api.groq.com/openai/v1/chat/completions';

    const data = {
        model: "llama3-8b-8192",
        messages: [{
            role: "user",
            content: userMessage
        }]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            return result.choices[0].message.content;
        } else {
            console.error('Error:', result);
            return 'Sorry, I encountered an error. Please try again later.';
        }
    } catch (error) {
        console.error('Error:', error);
        return 'Sorry, I encountered an error. Please try again later.';
    }
}

const handleChat = async () => {
    userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
    if (!userMessage) return;

    // Clear the input textarea and set its height to default
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    // Display "Thinking..." message while waiting for the response
    setTimeout(() => {
        const incomingChatLi = createChatLi("...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);

        // Call the async generateResponse function to get a reply from the chatbot
        generateResponse(incomingChatLi);
    }, 600);
}

chatInput.addEventListener("input", () => {
    // Adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // If Enter key is pressed without Shift key and the window 
    // width is greater than 800px, handle the chat
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
