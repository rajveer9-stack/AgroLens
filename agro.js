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

    // Set dropdown value for home selector
    const langSelector = document.getElementById('lang-selector');
    if (langSelector) {
        langSelector.value = state.lang;
        langSelector.addEventListener('change', (e) => {
            state.lang = e.target.value;
            applyTranslations();
            // Sync result screen selector
            const resultSelector = document.getElementById('lang-selector-result');
            if (resultSelector) resultSelector.value = state.lang;
            // Re-show result if on result screen
            if (state.scanResult) showResult(state.scanResult);
        });
    }

    // Set dropdown value for result selector
    const langSelectorResult = document.getElementById('lang-selector-result');
    if (langSelectorResult) {
        langSelectorResult.value = state.lang;
        langSelectorResult.addEventListener('change', (e) => {
            state.lang = e.target.value;
            applyTranslations();
            // Sync home screen selector
            if (langSelector) langSelector.value = state.lang;
            // Re-show result if on result screen
            if (state.scanResult) showResult(state.scanResult);
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
    ],
    // Bengali
    "bn": [
        {
            name: "Cotton Leaf Spot",
            localName: "তুলোর পাতা দাগ রোগ",
            confidence: 95,
            remedy: "আক্রান্ত পাতাগুলি সরিয়ে ফেলুন। কপার অক্সিক্লোরাইড স্প্রে করুন।",
            audioText: "রোগ নির্ণয়: তুলোর পাতা দাগ রোগ। প্রতিকার: কপার অক্সিক্লোরাইড স্প্রে করুন এবং আক্রান্ত পাতা সরিয়ে ফেলুন।",
            precautions: ["মাস্ক পরুন", "হাত ধুবেন", "গ্লাভস পরুন"]
        }
    ],
    // Marathi
    "mr": [
        {
            name: "Cotton Leaf Spot",
            localName: "कापसावरील ठिपके रोग",
            confidence: 95,
            remedy: "कॉपर ऑक्सीक्लोराईडची फवारणी करा. संक्रमित पाने काढून टाका.",
            audioText: "निदान: कापसावरील ठिपके रोग. उपाय: कॉपर ऑक्सीक्लोराईड फवारा आणि बाधित पाने काढा.",
            precautions: ["मास्क वापरा", "हात धुवा", "हातमोजे वापरा"]
        }
    ],
    // Tamil
    "ta": [
        {
            name: "Cotton Leaf Spot",
            localName: "பருத்தி இலை புள்ளி நோய்",
            confidence: 95,
            remedy: "செம்பு ஆக்ஸிகுளோரைடு தெளிக்கவும். பாதிக்கப்பட்ட இலைகளை அழிக்கவும்.",
            audioText: "கண்டறிதல்: பருத்தி இலை புள்ளி நோய். தீர்வு: செம்பு ஆக்ஸிகுளோரைடு தெளிக்கவும்.",
            precautions: ["முகமூடி அணியவும்", "கைகளை கழுவவும்", "கையுறைகளை அணியவும்"]
        }
    ],
    // Urdu
    "ur": [
        {
            name: "Cotton Leaf Spot",
            localName: "کپاس کے پتوں کا دھبہ",
            confidence: 95,
            remedy: "کاپر آکسی کلورائڈ کا سپرے کریں اور متاثرہ پتوں کو تلف کریں۔",
            audioText: "تشخیص: کپاس کے پتوں کا دھبہ۔ علاج: کاپر آکسی کلورائڈ کا چھڑکاؤ کریں۔",
            precautions: ["ماسک پہنیں", "ہاتھ دھوئیں", "دستانے پہنیں"]
        }
    ],
    // Gujarati
    "gu": [
        {
            name: "Cotton Leaf Spot",
            localName: "કપાસના પાન ટપકાં રોગ",
            confidence: 95,
            remedy: "કોપર ઓક્સીક્લોરાઇડનો છંટકાવ કરો. ચેપગ્રસ્ત પાંદડાનો નાશ કરો.",
            audioText: "નિદાન: કપાસના પાન ટપકાં રોગ. ઉપાય: કોપર ઓક્સીક્લોરાઇડ છાંટો.",
            precautions: ["માસ્ક પહેરો", "હાથ ધોવા", "મોજા પહેરો"]
        }
    ],
    // Kannada
    "kn": [
        {
            name: "Cotton Leaf Spot",
            localName: "ಹತ್ತಿ ಎಲೆ ಚುಕ್ಕೆ ರೋಗ",
            confidence: 95,
            remedy: "ತಾಮ್ರದ ಆಕ್ಸಿಕ್ಲೋರೈಡ್ ಸಿಂಪಡಿಸಿ. ಸೋಂಕಿತ ಎಲೆಗಳನ್ನು ತೆಗೆದುಹಾಕಿ.",
            audioText: "ರೋಗನಿರ್ಣಯ: ಹತ್ತಿ ಎಲೆ ಚುಕ್ಕೆ ರೋಗ. ಪರಿಹಾರ: ತಾಮ್ರದ ಆಕ್ಸಿಕ್ಲೋರೈಡ್ ಬಳಸಿ.",
            precautions: ["ಮಾಸ್ಕ್ ಧರಿಸಿ", "ಕೈಗಳನ್ನು ತೊಳೆಯಿರಿ", "ಕೈಗವಸು ಧರಿಸಿ"]
        }
    ],
    // Malayalam
    "ml": [
        {
            name: "Cotton Leaf Spot",
            localName: "പരുത്തി ഇലപ്പുള്ളി രോഗം",
            confidence: 95,
            remedy: "കോപ്പർ ഓക്സിക്ലോറൈഡ് തളിക്കുക. രോഗം ബാധിച്ച ഇലകൾ നശിപ്പിക്കുക.",
            audioText: "രോഗനിർണയം: പരുത്തി ഇലപ്പുള്ളി രോഗം. പരിഹാരം: കോപ്പർ ഓക്സിക്ലോറൈഡ് തളിക്കുക.",
            precautions: ["മാസ്ക് ധരിക്കുക", "കൈ കഴുകുക", "ഗ്ലൗസ് ധരിക്കുക"]
        }
    ],
    // Odia
    "or": [
        {
            name: "Cotton Leaf Spot",
            localName: "କପା ପତ୍ର ଦାଗ ରୋଗ",
            confidence: 95,
            remedy: "କପର୍ ଅକ୍ସିକ୍ଲୋରାଇଡ୍ ସ୍ପ୍ରେ କରନ୍ତୁ | ସଂକ୍ରମିତ ପତ୍ରଗୁଡିକ ନଷ୍ଟ କରନ୍ତୁ |",
            audioText: "ରୋଗ ନିର୍ଣ୍ଣୟ: କପା ପତ୍ର ଦାଗ ରୋଗ | ପ୍ରତିକାର: କପର୍ ଅକ୍ସିକ୍ଲୋରାଇଡ୍ ବ୍ୟବହାର କରନ୍ତୁ |",
            precautions: ["ମାସ୍କ ପିନ୍ଧନ୍ତୁ", "ହାତ ଧୋଇଦିଅନ୍ତୁ", "ଗ୍ଲୋଭ୍ସ ପିନ୍ଧନ୍ତୁ"]
        }
    ],
    // Punjabi
    "pa": [
        {
            name: "Cotton Leaf Spot",
            localName: "ਕਪਾਹ ਪੱਤਾ ਧੱਬਾ ਰੋਗ",
            confidence: 95,
            remedy: "ਕਾਪਰ ਆਕਸੀਕਲੋਰਾਈਡ ਦਾ ਛਿੜਕਾਅ ਕਰੋ। ਪ੍ਰਭਾਵਿਤ ਪੱਤਿਆਂ ਨੂੰ ਨਸ਼ਟ ਕਰੋ।",
            audioText: "ਤਸ਼ਖੀਸ: ਕਪਾਹ ਪੱਤਾ ਧੱਬਾ ਰੋਗ। ਉਪਾਅ: ਕਾਪਰ ਆਕਸੀਕਲੋਰਾਈਡ ਦੀ ਵਰਤੋਂ ਕਰੋ।",
            precautions: ["ਮਾਸਕ ਪਹਿਨੋ", "ਹੱਥ ਧੋਵੋ", "ਦਸਤਾਨੇ ਪਹਿਨੋ"]
        }
    ],
    // Assamese
    "as": [
        {
            name: "Cotton Leaf Spot",
            localName: "কপাহৰ পাতৰ দাগ",
            confidence: 95,
            remedy: "কপাৰ অক্সিক্লৰাইড স্প্ৰে কৰক। সংক্ৰমিত পাতবোৰ ধ্বংস কৰক।",
            audioText: "ৰোগ নিৰ্ণয়: কপাহৰ পাতৰ দাগ। প্ৰতিকাৰ: কপাৰ অক্সিক্লৰাইড ব্যৱহাৰ কৰক।",
            precautions: ["মাস্ক পিন্ধক", "হাত ধুব", "গ্লভচ পিন্ধক"]
        }
    ]
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
const galleryBtn = document.getElementById('btn-gallery');
const galleryInput = document.getElementById('gallery-input');
const backScanBtn = document.getElementById('btn-scan-back');
const homeBtn = document.getElementById('btn-home');
const capturedImageContainer = document.getElementById('captured-image-container');

// Settings Elements
const settingsBtn = document.getElementById('btn-settings');
const settingsBackBtn = document.getElementById('btn-settings-back');
const themeToggle = document.getElementById('theme-toggle');
const voiceToggle = document.getElementById('voice-toggle');

// Voice Assistant Elements
const confirmationSection = document.getElementById('confirmation-section');
const leafInputSection = document.getElementById('leaf-input-section');
const btnConfirmYes = document.getElementById('btn-confirm-yes');
const btnConfirmNo = document.getElementById('btn-confirm-no');
const leafInput = document.getElementById('leaf-input');
const btnSubmitLeaf = document.getElementById('btn-submit-leaf');

// Speech Recognition
let recognition = null;
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US'; // Default, will be updated based on app language
}

// Event Listeners
if (startScanBtn) startScanBtn.addEventListener('click', () => navigateTo('scan'));
if (backScanBtn) backScanBtn.addEventListener('click', () => navigateTo('home'));
if (homeBtn) homeBtn.addEventListener('click', () => navigateTo('home'));

if (settingsBtn) settingsBtn.addEventListener('click', () => navigateTo('settings'));
if (settingsBackBtn) settingsBackBtn.addEventListener('click', () => navigateTo('home'));

// Gallery Event Listener
if (galleryBtn) {
    galleryBtn.addEventListener('click', () => {
        console.log('Gallery button clicked');
        if (galleryInput) {
            galleryInput.click();
        } else {
            console.error('Gallery input not found');
        }
    });
} else {
    console.error('Gallery button not found');
}

if (galleryInput) {
    galleryInput.addEventListener('change', handleGallerySelection);
} else {
    console.error('Gallery input not found');
}

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

    // 4. Send to API
    try {
        // Convert data URL to blob
        const response = await fetch(imageDataUrl);
        const blob = await response.blob();
        const formData = new FormData();
        formData.append('image', blob, 'captured_image.png');

        // Send to Flask API
        const apiResponse = await fetch('http://localhost:5000/predict', {
            method: 'POST',
            body: formData
        });

        if (!apiResponse.ok) {
            throw new Error('API request failed');
        }

        const result = await apiResponse.json();

        // Format result for display
        const diseaseData = {
            name: result.disease,
            localName: result.disease, // API returns English, use same for now
            confidence: result.confidence,
            remedy: result.treatment,
            audioText: `${translations[state.lang]?.voiceDisease || 'Disease detected: '} ${result.disease}. ${translations[state.lang]?.voiceTreatment || 'Treatment: '} ${result.treatment}. ${translations[state.lang]?.voicePrecautions || 'Precautions: Wear mask, wash hands, wear gloves'}`,
            precautions: ["Wear Mask", "Wash Hands", "Wear Gloves"] // Default precautions
        };

        showResult(diseaseData);
        navigateTo('result');
    } catch (error) {
        console.error('Prediction failed:', error);
        alert('Failed to analyze image. Please try again.');
        navigateTo('home');
    }
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

    // Get translations for current language
    const langData = translations[state.lang] || translations['en'];

    // Update UI text - Strictly Localized Number
    const confidenceFormatted = new Intl.NumberFormat(state.lang, { style: 'percent' }).format(disease.confidence / 100);
    document.getElementById('confidence-val').textContent = confidenceFormatted;

    // Use translated disease name
    const diseaseKey = `disease_${disease.name.replace(/\s+/g, '_')}`;
    const translatedDiseaseName = langData[diseaseKey] || disease.name;
    document.getElementById('disease-title').textContent = translatedDiseaseName;

    // Use translated local name (same as translated name for now)
    document.getElementById('disease-local').textContent = translatedDiseaseName;

    // Use translated treatment
    const treatmentKey = `treatment_${disease.name.replace(/\s+/g, '_')}`;
    const translatedTreatment = langData[treatmentKey] || disease.remedy;
    document.getElementById('solution-text').textContent = translatedTreatment;

    // Update precautions dynamically with translations
    if (disease.precautions && disease.precautions.length >= 3) {
        const precautionItems = document.querySelectorAll('.precaution-item span');
        if (precautionItems.length >= 3) {
            precautionItems[0].textContent = langData['precaution_' + disease.precautions[0].replace(/\s+/g, '_')] || disease.precautions[0];
            precautionItems[1].textContent = langData['precaution_' + disease.precautions[1].replace(/\s+/g, '_')] || disease.precautions[1];
            precautionItems[2].textContent = langData['precaution_' + disease.precautions[2].replace(/\s+/g, '_')] || disease.precautions[2];
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
    // Fallbacks to closest available
    'sa': 'hi-IN',
    'ne': 'ne-NP',
    'sd': 'sd-IN',
};

// Audio Solution
window.playAudioDiagnosis = () => {
    if (!voiceToggle || !voiceToggle.checked) {
        alert("Voice output is disabled in settings.");
        return;
    }

    if (state.scanResult && 'speechSynthesis' in window) {
        // Cancel any currently playing speech to avoid overlap
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(state.scanResult.audioText);

        // STRICTLY Determine Language Tag
        const langTag = langTagMap[state.lang] || 'en-US';
        utterance.lang = langTag;

        // Attempt to select a matching voice that strictly starts with the lang tag
        const voices = window.speechSynthesis.getVoices();
        // Priority: Exact Match > Language Group Match > Default
        let matchingVoice = voices.find(voice => voice.lang === langTag);
        if (!matchingVoice) {
            matchingVoice = voices.find(voice => voice.lang.startsWith(state.lang));
        }

        if (matchingVoice) {
            utterance.voice = matchingVoice;
        }

       // console.log(`Speaking in ${langTag} with voice: ${matchingVoice ? matchingVoice.name : 'System Default'}`);
        window.speechSynthesis.speak(utterance);
    } else {
        alert("Audio not supported on this device.");
    }
};


// Gallery Selection Handler
async function handleGallerySelection(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
    }

    // Create image preview
    const img = document.createElement('img');
    const reader = new FileReader();
    reader.onload = (e) => {
        img.src = e.target.result;
        capturedImageContainer.innerHTML = '';
        capturedImageContainer.appendChild(img);

        // Navigate to analyzing
        navigateTo('analyzing');

        // Send to API
        processImageForAPI(file);
    };
    reader.readAsDataURL(file);

    // Reset input to allow re-selection
    galleryInput.value = '';
}

// Process image for API (shared function)
async function processImageForAPI(imageInput) {
    try {
        let blob;
        if (typeof imageInput === 'string') {
            // Data URL from camera
            const response = await fetch(imageInput);
            blob = await response.blob();
        } else {
            // File from gallery
            blob = imageInput;
        }

        const formData = new FormData();
        formData.append('image', blob, 'uploaded_image.png');

        // Send to Flask API
        const apiResponse = await fetch('http://localhost:5000/predict', {
            method: 'POST',
            body: formData
        });

        if (!apiResponse.ok) {
            throw new Error('API request failed');
        }

        const result = await apiResponse.json();

        // Format result for display
        const diseaseData = {
            name: result.disease,
            localName: result.disease, // API returns English, use same for now
            confidence: result.confidence,
            remedy: result.treatment,
            audioText: `${translations[state.lang]?.voiceDisease || 'Disease detected: '} ${result.disease}. ${translations[state.lang]?.voiceTreatment || 'Treatment: '} ${result.treatment}. ${translations[state.lang]?.voicePrecautions || 'Precautions: Wear mask, wash hands, wear gloves'}`,
            precautions: ["Wear Mask", "Wash Hands", "Wear Gloves"] // Default precautions
        };

        // Store result temporarily
        state.tempResult = diseaseData;

        // Show result and start voice assistant
        showResult(diseaseData);
        navigateTo('result');

        // Start voice assistant confirmation
        startVoiceAssistant(diseaseData);

    } catch (error) {
        console.error('Prediction failed:', error);
        alert('Failed to analyze image. Please try again.');
        navigateTo('home');
    }
}

// Voice Assistant Functions
async function startVoiceAssistant(diseaseData) {
    if (!voiceToggle || !voiceToggle.checked) {
        // If voice is disabled, show confirmation UI directly
        showConfirmationUI();
        return;
    }

    // Speak confidence score and ask for confirmation
    const confidenceText = `${translations[state.lang]?.voiceConfidence || 'Confidence score: '} ${diseaseData.confidence}%. ${translations[state.lang]?.voiceConfirm || 'Is this the correct disease? Say yes or no.'}`;

    speakText(confidenceText, () => {
        // After speaking, show confirmation UI and start listening
        showConfirmationUI();
        startListeningForConfirmation();
    });
}

function showConfirmationUI() {
    confirmationSection.style.display = 'block';
    leafInputSection.style.display = 'none';
}

function hideConfirmationUI() {
    confirmationSection.style.display = 'none';
}

function showLeafInputUI() {
    leafInputSection.style.display = 'block';
    confirmationSection.style.display = 'none';
}

function hideLeafInputUI() {
    leafInputSection.style.display = 'none';
}

function startListeningForConfirmation() {
    if (!recognition) return;

    // Update recognition language
    const langMap = {
        'en': 'en-US',
        'hi': 'hi-IN',
        'bn': 'bn-IN',
        'te': 'te-IN',
        'mr': 'mr-IN',
        'ta': 'ta-IN',
        'ur': 'ur-IN',
        'gu': 'gu-IN',
        'kn': 'kn-IN',
        'ml': 'ml-IN',
        'or': 'or-IN',
        'pa': 'pa-IN',
        'as': 'as-IN'
    };
    recognition.lang = langMap[state.lang] || 'en-US';

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log('Heard:', transcript);

        // Check for yes/no responses in current language
        const yesKeywords = translations[state.lang]?.confirmYes?.toLowerCase() || 'yes';
        const noKeywords = translations[state.lang]?.confirmNo?.toLowerCase() || 'no';

        if (transcript.includes(yesKeywords) || transcript.includes('yes') || transcript.includes('haan') || transcript.includes('haa')) {
            handleConfirmation(true);
        } else if (transcript.includes(noKeywords) || transcript.includes('no') || transcript.includes('nahin') || transcript.includes('na')) {
            handleConfirmation(false);
        }
    };

    recognition.start();
}

function handleConfirmation(isCorrect) {
    if (recognition) recognition.stop();

    if (isCorrect) {
        // Proceed with solution
        hideConfirmationUI();
        speakSolution();
    } else {
        // Ask for leaf type
        hideConfirmationUI();
        askForLeafType();
    }
}

function askForLeafType() {
    if (!voiceToggle || !voiceToggle.checked) {
        showLeafInputUI();
        return;
    }

    const askText = translations[state.lang]?.voiceAskLeaf || 'What leaf is it? Please tell me the type of leaf.';
    speakText(askText, () => {
        showLeafInputUI();
        startListeningForLeafType();
    });
}

function startListeningForLeafType() {
    if (!recognition) {
        showLeafInputUI();
        return;
    }

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('Leaf type heard:', transcript);
        processLeafType(transcript);
    };

    recognition.start();
}

function processLeafType(leafType) {
    if (recognition) recognition.stop();

    // For now, just acknowledge and show a message
    // In a real implementation, you might send this to an API or use it for better diagnosis
    const processingText = translations[state.lang]?.voiceProcessing || 'Processing your response...';
    speakText(`${processingText} You mentioned: ${leafType}. Thank you for the information.`, () => {
        hideLeafInputUI();
        // Could proceed with enhanced diagnosis here
        speakSolution();
    });
}

function speakSolution() {
    if (!voiceToggle || !voiceToggle.checked) return;

    const solutionText = state.tempResult.audioText;
    speakText(solutionText);
}

function speakText(text, callback) {
    if (!('speechSynthesis' in window)) {
        console.error('Speech synthesis not supported');
        return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const langTag = langTagMap[state.lang] || 'en-US';
    utterance.lang = langTag;

    // Wait for voices to load
    let voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
        // Voices might not be loaded yet, wait for them
        window.speechSynthesis.onvoiceschanged = () => {
            voices = window.speechSynthesis.getVoices();
            setVoiceAndSpeak(utterance, voices, langTag, callback);
        };
    } else {
        setVoiceAndSpeak(utterance, voices, langTag, callback);
    }
}

function setVoiceAndSpeak(utterance, voices, langTag, callback) {
    let matchingVoice = voices.find(voice => voice.lang === langTag);
    if (!matchingVoice) {
        matchingVoice = voices.find(voice => voice.lang.startsWith(state.lang));
    }

    if (matchingVoice) {
        utterance.voice = matchingVoice;
        console.log(`Using voice: ${matchingVoice.name} for ${langTag}`);
    } else {
        console.log(`No matching voice found for ${langTag}, using default`);
    }

    if (callback) {
        utterance.onend = callback;
    }

    utterance.onerror = (e) => {
        console.error('Speech synthesis error:', e);
    };

    window.speechSynthesis.speak(utterance);
}

// Event listeners for confirmation buttons
if (btnConfirmYes) btnConfirmYes.addEventListener('click', () => handleConfirmation(true));
if (btnConfirmNo) btnConfirmNo.addEventListener('click', () => handleConfirmation(false));

// Event listener for leaf input submission
if (btnSubmitLeaf) btnSubmitLeaf.addEventListener('click', () => {
    const leafType = leafInput.value.trim();
    if (leafType) {
        processLeafType(leafType);
        leafInput.value = '';
    }
});

// Video Solution
window.playVideoDiagnosis = () => {
    // Link to a relevant YouTube search or generic video based on disease
    // For demo:
    const query = encodeURIComponent(state.scanResult ? state.scanResult.name + " agriculture treatment" : "crop disease treatment");
    window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
};



