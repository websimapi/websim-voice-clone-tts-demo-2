let currentVoice = 'pNInz6obpgDQGcFmaJgB'; // Default to Adam
let currentAudio = null;
let clonedVoices = [];
let currentCloneId = null;

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

// Voice cloning functionality
const voiceFileInput = document.getElementById('voiceFile');
const cloneVoiceBtn = document.getElementById('cloneVoiceBtn');
const cloneStatus = document.getElementById('cloneStatus');
const fileName = document.getElementById('fileName');
const clonedVoicesSection = document.getElementById('clonedVoicesSection');
const clonedVoicesList = document.getElementById('clonedVoicesList');

voiceFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        fileName.textContent = file.name;
        cloneVoiceBtn.disabled = false;
        updateCloneStatus('Ready to create voice clone');
    }
});

cloneVoiceBtn.addEventListener('click', async () => {
    const file = voiceFileInput.files[0];
    if (!file) {
        updateCloneStatus('Please select an audio file first');
        return;
    }

    try {
        cloneVoiceBtn.disabled = true;
        updateCloneStatus('Creating voice clone... This may take a few minutes.');

        // Convert file to base64 for processing
        const base64Audio = await fileToBase64(file);
        
        // Here we would normally send to a voice cloning service
        // For demo purposes, we'll simulate the process and create a mock voice ID
        const mockCloneId = `clone_${Date.now()}`;
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const voiceData = {
            id: mockCloneId,
            name: `Cloned Voice ${clonedVoices.length + 1}`,
            fileName: file.name
        };
        
        clonedVoices.push(voiceData);
        displayClonedVoices();
        
        // Add to voice selection
        addClonedVoiceToSelection(voiceData);
        
        updateCloneStatus('Voice clone created successfully!');
        voiceFileInput.value = '';
        fileName.textContent = 'No file selected';
        
    } catch (error) {
        console.error('Error creating voice clone:', error);
        updateCloneStatus('Error creating voice clone. Please try again.');
    } finally {
        cloneVoiceBtn.disabled = false;
    }
});

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
    });
}

function displayClonedVoices() {
    if (clonedVoices.length > 0) {
        clonedVoicesSection.style.display = 'block';
        clonedVoicesList.innerHTML = '';
        
        clonedVoices.forEach(voice => {
            const voiceBtn = document.createElement('button');
            voiceBtn.className = 'voice-btn cloned-voice';
            voiceBtn.dataset.voice = voice.id;
            voiceBtn.textContent = voice.name;
            
            voiceBtn.addEventListener('click', () => {
                currentVoice = voice.id;
                
                // Update active states
                document.querySelectorAll('.voice-btn').forEach(b => b.classList.remove('active'));
                voiceBtn.classList.add('active');
                
                updateStatus(`Selected cloned voice: ${voice.name}`);
            });
            
            clonedVoicesList.appendChild(voiceBtn);
        });
    }
}

function addClonedVoiceToSelection(voiceData) {
    const voiceBtn = document.createElement('button');
    voiceBtn.className = 'voice-btn cloned-voice';
    voiceBtn.dataset.voice = voiceData.id;
    voiceBtn.textContent = voiceData.name;
    
    voiceBtn.addEventListener('click', () => {
        currentVoice = voiceData.id;
        updateStatus(`Selected cloned voice: ${voiceData.name}`);
    });
    
    document.querySelector('.section:nth-child(2)').appendChild(voiceBtn);
}

function updateCloneStatus(message) {
    cloneStatus.textContent = message;
}

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
displayClonedVoices();