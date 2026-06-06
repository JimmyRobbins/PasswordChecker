
const CORRECT_PASSWORD = "BETWIXT";
let validWordsList = [];

// Simply change this number whenever you upload more wrong files (wrong1.mp3, wrong2.mp3, etc.)
const TOTAL_FAILURE_SOUNDS = 13;

const mainCard = document.getElementById('main-card');
const inputs = document.querySelectorAll('.code-input');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const screenContent = document.getElementById('screen-content');
const submitBtn = document.getElementById('submit-btn');
const retryBtn = document.getElementById('retry-btn');
const msgDiv = document.getElementById('msg');

    // Load dictionary file
    async function loadDictionary() {
        try {
            const response = await fetch('7LetterWords');
            const text = await response.text();
            validWordsList = text.split(/\r?\n/).map(word => word.trim().toUpperCase());
            console.log("Dictionary loaded successfully!");
        } catch (error) {
            console.error("Failed to load word list file:", error);
        }
    }
    loadDictionary();

    // Dynamically builds the string name based on a random roll
    function playNuhUhSound() {
        try {
            if (TOTAL_FAILURE_SOUNDS <= 0) return;

            // Generates a random integer from 1 up to TOTAL_FAILURE_SOUNDS
            const randomNumber = Math.floor(Math.random() * TOTAL_FAILURE_SOUNDS) + 1;

            // Dynamically constructs the file path string (e.g., "soundEffects/failure/wrong2.mp3")
            const audioPath = `soundEffects/failure/wrong${randomNumber}.mp3`;
            
            const audio = new Audio(audioPath);
            audio.volume = 0.5;
            audio.play();
        } catch (e) {
            console.error("Audio playback blocked or unsupported:", e);
        }
    }
    
    // Trigger the shake animation and sound effect on failure
    // Trigger the shake animation, sound effect, and clear inputs on failure
function triggerInvalidFeedback() {
    playNuhUhSound();
    
    // Trigger the shake animation
    mainCard.classList.add('shake');
    setTimeout(() => {
        mainCard.classList.remove('shake');
    }, 400);

    // Clear all input boxes
    inputs.forEach(input => input.value = "");
    
    // Jump the cursor back to the very first box
    inputs[0].focus();
}

    inputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            input.value = input.value.toUpperCase();
            if (input.value.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
            msgDiv.innerText = "";
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === "Backspace" && input.value.length === 0 && index > 0) {
                inputs[index - 1].focus();
            }
            if (e.key === "Enter") {
                handleSubmit();
            }
        });
    });

    submitBtn.addEventListener('click', handleSubmit);
    retryBtn.addEventListener('click', handleRetry);

    function handleSubmit() {
        let currentGuess = "";
        inputs.forEach(i => currentGuess += i.value);
        
        if (currentGuess.length === 7) {
            if (validWordsList.length === 0) {
                msgDiv.innerText = "単語リストを読み込み中です。";
                return;
            }

            if (validWordsList.includes(currentGuess)) {
                checkPassword(currentGuess);
            } else {
                msgDiv.innerText = "有効な英単語ではありません。";
                triggerInvalidFeedback();
            }
        } else {
            msgDiv.innerText = "7文字すべて入力してください。";
            triggerInvalidFeedback();
        }
    }

    function handleRetry() {
        inputs.forEach(input => input.value = "");
        msgDiv.innerText = "";
        resultScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        inputs[0].focus();
    }

    function checkPassword(guess) {
        if (guess === CORRECT_PASSWORD) {
            screenContent.innerHTML = "<h1 style='color: #0f9d58;'>🎉 You Win!</h1><p>Success! You entered the correct password.</p>";
            retryBtn.classList.add('hidden');
            gameScreen.classList.add('hidden');
            resultScreen.classList.remove('hidden');
        } else {
            screenContent.innerHTML = "<h1 style='color: #d93025;'>❌ 不正解</h1><p>パスワードが正しくありません。</p>";
            retryBtn.classList.remove('hidden');
            gameScreen.classList.add('hidden');
            resultScreen.classList.remove('hidden');
            triggerInvalidFeedback();
        }
    }

