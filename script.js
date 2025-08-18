let currentVoice = 'pNInz6obpgDQGcFmaJgB'; // Default to Adam
let currentAudio = null;

// Voice mapping for convenience
const voiceMap = {
    'en-male': 'en-male',
    'en-female': 'en-female',
    'es-male': 'es-male',
    'fr-female': 'fr-female'
};

// Set up voice buttons
document.querySelectorAll('.voice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const voice = btn.dataset.voice;
        currentVoice = voiceMap[voice] || voice;
        
        // Update active state
        document.querySelectorAll('.voice-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        updateStatus(`Selected voice: ${btn.textContent}`);
    });
});

// Custom voice input
document.getElementById('useCustomVoice').addEventListener('click', () => {
    const customId = document.getElementById('customVoiceId').value.trim();
    if (customId) {
        currentVoice = customId;
        updateStatus(`Using custom voice ID: ${customId}`);
    }
});

// Speak button
document.getElementById('speakBtn').addEventListener('click', async () => {
    const text = document.getElementById('textInput').value.trim();
    if (!text) {
        updateStatus('Please enter some text to speak');
        return;
    }

    try {
        updateStatus('Generating speech...');
        
        const result = await websim.textToSpeech({
            text: text,
            voice: currentVoice
        });

        // Stop any current audio
        if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
        }

        // Play new audio
        currentAudio = new Audio(result.url);
        currentAudio.play();
        
        updateStatus('Speaking...');
        
        currentAudio.addEventListener('ended', () => {
            updateStatus('Finished speaking');
            currentAudio = null;
        });

    } catch (error) {
        console.error('Error:', error);
        updateStatus('Error generating speech. Please try again.');
    }
});

// Stop button
document.getElementById('stopBtn').addEventListener('click', () => {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
        updateStatus('Stopped');
    }
});

function updateStatus(message) {
    document.getElementById('status').textContent = message;
}

// Initialize
updateStatus('Ready - Select a voice and enter text');

