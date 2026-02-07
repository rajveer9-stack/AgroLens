// App State
const state = {
    currentScreen: 'home',
    stream: null,
    scanResult: null,
    lang: 'en' // Default language
};

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Detect system language
    const systemLang = navigator.language.split('-')[0];
    if (supportedLangs.includes(systemLang)) {
        state.lang = systemLang;
    } else {
        state.lang = 'en';
    }

    // Set dropdown value
    const langSelector = document.getElementById('lang-selector');
    if (langSelector) {
        langSelector.value = state.lang;
        langSelector.addEventListener('change', (e) => {
            state.lang = e.target.value;
            applyTranslations();
        });
    }

    // Apply translations
    applyTranslations();
});

function applyTranslations() {
    // Generic replacement for elements with data-i18n
    const langData = translations[state.lang] || translations['en'];

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        // Skip if special handling is needed (like offline badge with icon)
        if (el.classList.contains('offline-badge')) return;

        if (langData[key]) {
            el.textContent = langData[key];
        }
    });

};





// Mock Database of Diseases (Multi-language Support)
const diseasesDB = {
    // English
    "en": [
        {
            name: "Cotton Leaf Spot",
            localName: "Cotton Leaf Spot",
            confidence: 95,
            remedy: "Apply Copper Oxychloride 50 WP @ 2.5 g/liter of water. Remove and destroy infected leaves.",
            audioText: "Diagnosis: Cotton Leaf Spot. Remedy: Apply Copper Oxychloride 50 WP. Remove infected leaves immediately.",
            precautions: ["Wear Mask", "Wash Hands", "Wear Gloves"]
        },
        {
            name: "Tomato Early Blight",
            localName: "Tomato Early Blight",
            confidence: 88,
            remedy: "Spray Mancozeb 75 WP @ 2g/liter. Ensure proper drainage in the field.",
            audioText: "Diagnosis: Tomato Early Blight. Remedy: Spray Mancozeb. Ensure proper drainage.",
            precautions: ["Wear Mask", "Wash Hands", "Sanitize Tools"]
        }
    ],
    // Hindi
    "hi": [
        {
            name: "Cotton Leaf Spot",
            localName: "कपास का पत्ती धब्बा रोग",
            confidence: 95,
            remedy: "कॉपर ऑक्सीक्लोराइड 50 WP @ 2.5 ग्राम/लीटर पानी का छिड़काव करें। संक्रमित पत्तियों को हटाकर नष्ट करें।",
            audioText: "निदान: कपास का पत्ती धब्बा रोग। उपाय: कॉपर ऑक्सीक्लोराइड का छिड़काव करें और संक्रमित पत्तियों को नष्ट करें।",
            precautions: ["मास्क पहनें", "हाथ धोएं", "दस्ताने पहनें"]
        },
        {
            name: "Tomato Early Blight",
            localName: "टमाटर का अगेती झुलसा रोग",
            confidence: 88,
            remedy: "मैंकोजेब 75 WP @ 2 ग्राम/लीटर का छिड़काव करें। खेत में जल निकासी सुनिश्चित करें।",
            audioText: "निदान: टमाटर का अगेती झुलसा रोग। उपाय: मैंकोजेब का छिड़काव करें। जल निकासी सुधरें।",
            precautions: ["मास्क पहनें", "हाथ धोएं", "औजार साफ करें"]
        }
    ],
    // Telugu
    "te": [
        {
            name: "Cotton Leaf Spot",
            localName: "పత్తి ఆకు మచ్చ తెగులు",
            confidence: 95,
            remedy: "కాపర్ ఆక్సిక్లోరైడ్ 50 WP @ 2.5 గ్రా/లీటర్ నీటిలో పిచికారీ చేయండి.",
            audioText: "వ్యాధి నిర్ధారణ: పత్తి ఆకు మచ్చ తెగులు. నివారణ: కాపర్ ఆక్సిక్లోరైడ్ పిచికారీ చేయండి.",
            precautions: ["మాస్క్ ధరించండి", "చేతులు కడుక్కోండి", "గ్లోవ్స్ ధరించండి"]
        }
    ]
    // ... Additional languages would be added here following the same pattern
    // For prototype purposes, we fallback to English if specific lang data is missing
};

// Helper: Get random disease for current language
function getRandomDisease(lang) {
    // Default to EN if lang not in DB, or if DB entry matches EN properties
    let db = diseasesDB[lang];
    if (!db) db = diseasesDB['en'];

    return db[Math.floor(Math.random() * db.length)];
}


// DOM Elements
const screens = {
    home: document.getElementById('screen-home'),
    scan: document.getElementById('screen-scan'),
    analyzing: document.getElementById('screen-analyzing'),
    result: document.getElementById('screen-result'),
    settings: document.getElementById('screen-settings')
};

const videoElement = document.getElementById('camera-feed');
const captureBtn = document.getElementById('btn-capture');
const startScanBtn = document.getElementById('btn-start-scan');
const backScanBtn = document.getElementById('btn-scan-back');
const homeBtn = document.getElementById('btn-home');
const capturedImageContainer = document.getElementById('captured-image-container');

// Settings Elements
const settingsBtn = document.getElementById('btn-settings');
const settingsBackBtn = document.getElementById('btn-settings-back');
const themeToggle = document.getElementById('theme-toggle');

// Event Listeners
if (startScanBtn) startScanBtn.addEventListener('click', () => navigateTo('scan'));
if (backScanBtn) backScanBtn.addEventListener('click', () => navigateTo('home'));
if (homeBtn) homeBtn.addEventListener('click', () => navigateTo('home'));

if (settingsBtn) settingsBtn.addEventListener('click', () => navigateTo('settings'));
if (settingsBackBtn) settingsBackBtn.addEventListener('click', () => navigateTo('home'));

// Theme Toggle Logic
if (themeToggle) {
    themeToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    });
}

captureBtn.addEventListener('click', async () => {
    // 1. Capture Image
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    const imageDataUrl = canvas.toDataURL('image/png');

    // Store image for result
    const img = document.createElement('img');
    img.src = imageDataUrl;
    capturedImageContainer.innerHTML = '';
    capturedImageContainer.appendChild(img);

    // 2. Stop Camera
    stopCamera();

    // 3. Navigate to Analyzing
    navigateTo('analyzing');

    // 4. Simulate AI Processing Delay (Create illusion of "Edge AI")
    setTimeout(() => {
        // Randomly pick a disease for demo based on current language
        const randomDisease = getRandomDisease(state.lang);
        showResult(randomDisease);
        navigateTo('result');
    }, 2000);
});

// Navigation Logic
function navigateTo(screenName) {
    // Hide all screens
    Object.values(screens).forEach(screen => {
        if (screen) screen.classList.remove('active');
    });

    // Show target screen
    if (screens[screenName]) {
        screens[screenName].classList.add('active');
    }

    // Handle specific screen logic
    if (screenName === 'scan') {
        startCamera();
    } else if (screenName === 'home') {
        stopCamera();
    }
}

// Camera Logic
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'environment' // Prefer back camera on mobile
            }
        });
        videoElement.srcObject = stream;
        state.stream = stream;
    } catch (err) {
        console.error("Camera access denied:", err);
        alert("Camera access is required to scan crops. Please enable permissions.");
        navigateTo('home');
    }
}

function stopCamera() {
    if (state.stream) {
        state.stream.getTracks().forEach(track => track.stop());
        videoElement.srcObject = null;
        state.stream = null;
    }
}

// Result Logic
function showResult(disease) {
    state.scanResult = disease;

    // Update UI text
    document.getElementById('confidence-val').textContent = `${disease.confidence}%`;
    document.getElementById('disease-title').textContent = disease.name;
    document.getElementById('disease-local').textContent = disease.localName;
    document.getElementById('solution-text').textContent = disease.remedy;

    // Update precautions dynamically
    if (disease.precautions && disease.precautions.length >= 3) {
        const precautionItems = document.querySelectorAll('.precaution-item span');
        if (precautionItems.length >= 3) {
            precautionItems[0].textContent = disease.precautions[0];
            precautionItems[1].textContent = disease.precautions[1];
            precautionItems[2].textContent = disease.precautions[2];
        }
    }
}

// Map App Language Codes to BCP 47 Language Tags for SpeechSynthesis
const langTagMap = {
    'en': 'en-IN', // Indian English
    'hi': 'hi-IN',
    'bn': 'bn-IN',
    'te': 'te-IN',
    'mr': 'mr-IN',
    'ta': 'ta-IN',
    'ur': 'ur-IN',
    'gu': 'gu-IN',
    'kn': 'kn-IN',
    'ml': 'ml-IN',
    'or': 'or-IN', // Experimental support
    'pa': 'pa-IN',
    'as': 'as-IN',
    // Fallbacks
    'sa': 'hi-IN',
    'ne': 'ne-NP',
    // Others might default to Hindi or English if specific TTS voice isn't present
};

// Audio Solution
window.playAudioDiagnosis = () => {
    if (state.scanResult && 'speechSynthesis' in window) {
        // Cancel any currently playing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(state.scanResult.audioText);

        // Determine Language Tag
        const langTag = langTagMap[state.lang] || 'en-US';
        utterance.lang = langTag;

        // Attempt to select a matching voice
        const voices = window.speechSynthesis.getVoices();
        const matchingVoice = voices.find(voice => voice.lang === langTag || voice.lang.startsWith(state.lang));

        if (matchingVoice) {
            utterance.voice = matchingVoice;
        }

        console.log(`Speaking in ${langTag} with voice: ${matchingVoice ? matchingVoice.name : 'Default'}`);
        window.speechSynthesis.speak(utterance);
    } else {
        alert("Audio not supported on this device.");
    }
};


// Video Solution
window.playVideoDiagnosis = () => {
    // Link to a relevant YouTube search or generic video based on disease
    // For demo:
    const query = encodeURIComponent(state.scanResult ? state.scanResult.name + " agriculture treatment" : "crop disease treatment");
    window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
};







