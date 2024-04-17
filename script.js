async function fetchRandomUser() {
    const apiKey = 'AIzaSyBMePPcsQd-usmk0ctJVGvGzxHNMPM27mA'; // Replace with your API key
    const videoId = document.getElementById('videoId').value;
    if (!videoId) {
        alert('Please enter a video ID.');
        return;
    }

    try {
        const videoResponse = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
            params: {
                part: 'liveStreamingDetails',
                id: videoId,
                key: apiKey
            }
        });
        const liveChatId = videoResponse.data.items[0].liveStreamingDetails.activeLiveChatId;
        if (!liveChatId) {
            alert('No active live chat found for this video.');
            return;
        }

        const chatResponse = await axios.get(`https://www.googleapis.com/youtube/v3/liveChat/messages`, {
            params: {
                liveChatId,
                part: 'id,snippet,authorDetails',
                key: apiKey,
                maxResults: 200 // You can adjust this number based on your needs
            }
        });

        const messages = chatResponse.data.items;
        if (messages.length === 0) {
            document.getElementById('animatedName').textContent = "No messages to display.";
            return;
        }

        const randomIndex = Math.floor(Math.random() * messages.length);
        const randomUser = messages[randomIndex].authorDetails.displayName;
        const randomMessage = messages[randomIndex].snippet.displayMessage;

        // Animate the display name like a slot machine
        animateDisplayName(randomUser);

        setTimeout(() => { // Set a delay to show the message after the name animation
            document.getElementById('userMessage').textContent = `Last message: "${randomMessage}"`;
        }, 3000 + 100 * randomUser.length);

    } catch (error) {
        console.error('Failed to fetch live chat data:', error);
        alert('Failed to fetch data. Check the console for more information.');
    }
}

function animateDisplayName(name) {
    let display = '';
    const targetDiv = document.getElementById('animatedName');
    targetDiv.textContent = '';

    for (let i = 0; i < name.length; i++) {
        const interval = setInterval(() => {
            const randomChar = String.fromCharCode(Math.floor(Math.random() * (90 - 65) + 65));
            display = display.substr(0, i) + randomChar + display.substr(i + 1);
            targetDiv.textContent = display;
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
            display = display.substr(0, i) + name[i] + display.substr(i + 1);
            targetDiv.textContent = display;
        }, 3000 + 100 * i);
    }
}
