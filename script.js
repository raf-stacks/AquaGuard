
// --- 1. ANIMATIONS (SCROLL-TRIGGERED FADE-IN-UP) ---
const sections = document.querySelectorAll('.content-section');

const options = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px'
};

if (sections.length) {
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                obs.unobserve(entry.target);
            }
        });
    }, options);

    sections.forEach(section => observer.observe(section));
}


// --- 2. DATA VISUALIZATION (CHART.JS) ---
try {
    const canvas = document.getElementById('impactsChart');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const chartData = {
            labels: ['Water Turbidity (x)', 'Biodiversity Loss (%)', 'Mercury Levels (xWHO)', 'Safe Water Access (%)'],
            datasets: [{
                label: 'Impact Severity (Estimated)',
                data: [85, 90, 95, 70],
                backgroundColor: [
                    'rgba(250,128,114,0.8)',
                    'rgba(173,216,230,0.8)',
                    'rgba(255,215,0,0.8)',
                    'rgba(75,192,192,0.8)'
                ],
                borderColor: '#121212',
                borderWidth: 1
            }]
        };

        new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: { display: true, text: 'Severity Index / Impact Percentage' }
                    }
                },
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'Major Environmental and Health Impacts of Galamsey' }
                }
            }
        });
    }
} catch (err) {
    // Chart initialization failed — fail gracefully in console for debugging
    console.error('Chart initialization error:', err);
}


// --- 3. INTERACTIVE SLIDER LOGIC (MERCURY EFFECT) ---
const mercurySlider = document.getElementById('mercury-slider');
const mercuryFactDisplay = document.getElementById('mercury-fact-display');
const pollutionLayer = document.getElementById('mercury-level-indicator');

if (mercurySlider && mercuryFactDisplay && pollutionLayer) {
    const updateMercuryDisplay = () => {
        const value = Number(mercurySlider.value || 0);
        let message = '';

        pollutionLayer.style.opacity = value / 100;

        if (value < 20) {
            message = 'Level 1: Primarily siltation (turbidity). Water is muddy, but metal levels are low.';
        } else if (value < 50) {
            message = 'Level 2: Mercury Release. Elemental Mercury (Hg) is now settling in the river bed sediment.';
        } else if (value < 80) {
            message = 'Level 3: Bioaccumulation. Bacteria convert Hg to Methylmercury, toxic levels rising in fish.';
        } else {
            message = 'Level 4: Critical Contamination. Methylmercury levels are extremely high, posing severe neurological risk to communities.';
        }

        mercuryFactDisplay.textContent = `Contamination Progression: ${value}% — ${message}`;
    };

    mercurySlider.addEventListener('input', updateMercuryDisplay);
    updateMercuryDisplay();
}


// --- 4. QUIZ/GAME LOGIC ---
const quizQuestions = [
    {
        question: 'What is the primary toxic chemical used in Galamsey that becomes Methylmercury in water?',
        answers: { a: 'Lead (Pb)', b: 'Mercury (Hg)', c: 'Arsenic (As)', d: 'Cyanide (CN)' },
        correctAnswer: 'b',
        explanation: 'Mercury (Hg) is used to bind with gold. Bacteria convert it to Methylmercury, which bio-magnifies.'
    },
    {
        question: 'Which major environmental effect involves sediment blocking sunlight and suffocating aquatic life?',
        answers: { a: 'Eutrophication', b: 'Siltation (Turbidity)', c: 'Acidification', d: 'Thermal Shock' },
        correctAnswer: 'b',
        explanation: 'Siltation is the excess mud runoff, causing high turbidity and destroying river ecosystems.'
    },
    {
        question: 'What is the positive side of Regulated Small-Scale Mining (SSM)?',
        answers: { a: 'It uses only primitive tools.', b: 'It contributes significantly to Ghana\'s GDP and provides legal jobs.', c: 'It does not require any licenses.', d: 'It uses the same amount of mercury as Galamsey.' },
        correctAnswer: 'b',
        explanation: 'Regulated SSM contributes over 35% of Ghana’s gold and provides millions of legal, taxed jobs.'
    }
];

let currentQuestionIndex = 0;
let score = 0;
const quizArea = document.getElementById('quiz-area');
const startButton = document.getElementById('start-quiz');

function buildQuiz() {
    if (!quizArea) return;
    quizArea.innerHTML = '';

    if (currentQuestionIndex >= quizQuestions.length) {
        showResults();
        return;
    }

    const q = quizQuestions[currentQuestionIndex];

    const questionElement = document.createElement('div');
    questionElement.classList.add('quiz-question');
    questionElement.innerHTML = `<h4>Question ${currentQuestionIndex + 1}: ${q.question}</h4>`;

    const answersElement = document.createElement('div');
    answersElement.classList.add('quiz-answers');

    for (const letter in q.answers) {
        const button = document.createElement('button');
        button.textContent = `${letter.toUpperCase()}. ${q.answers[letter]}`;
        button.setAttribute('data-answer', letter);
        button.addEventListener('click', () => checkAnswer(letter, q.correctAnswer, q.explanation));
        answersElement.appendChild(button);
    }

    quizArea.appendChild(questionElement);
    quizArea.appendChild(answersElement);
    if (startButton) startButton.style.display = 'none';
}

function checkAnswer(selected, correct, explanation) {
    if (!quizArea) return;
    const buttons = Array.from(quizArea.querySelectorAll('button'));
    buttons.forEach(btn => btn.disabled = true);

    const selectedButton = quizArea.querySelector(`button[data-answer="${selected}"]`);
    const correctButton = quizArea.querySelector(`button[data-answer="${correct}"]`);

    const feedback = document.createElement('p');
    feedback.classList.add('feedback-text');

    if (selected === correct) {
        score++;
        if (selectedButton) {
            selectedButton.classList.add('correct');
        }
        feedback.innerHTML = `<i class="fas fa-check-circle"></i> <strong>Correct!</strong> (${explanation})`;
    } else {
        if (selectedButton) {
            selectedButton.classList.add('incorrect');
        }
        if (correctButton) {
            correctButton.classList.add('correct');
        }
        feedback.innerHTML = `<i class="fas fa-times-circle"></i> <strong>Incorrect.</strong> The correct answer is ${correct.toUpperCase()}. (${explanation})`;
    }

    quizArea.appendChild(feedback);

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next Question →';
    nextButton.classList.add('cta-button', 'next-button');
    nextButton.addEventListener('click', () => {
        currentQuestionIndex++;
        buildQuiz();
    });
    quizArea.appendChild(nextButton);
}

function showResults() {
    if (!quizArea) return;
    const total = quizQuestions.length;
    let message = '';

    if (score === total) {
        message = 'AquaGuard Champion! You are highly knowledgeable about the crisis. Now spread the word!';
    } else if (score >= total / 2) {
        message = 'AquaGuard Trainee! Good effort, but a few more facts to learn to protect our waters.';
    } else {
        message = 'AquaGuard Recruit. Review the sections on Mercury and the Socio-Economic impact to improve!';
    }

    quizArea.innerHTML = `
        <div>
            <h3>Quiz Results</h3>
            <p>You scored <strong>${score} out of ${total}</strong>.</p>
            <p>${message}</p>
            <button class="cta-button" onclick="window.location.reload()">Start Over</button>
        </div>
    `;
}

if (startButton) startButton.addEventListener('click', buildQuiz);