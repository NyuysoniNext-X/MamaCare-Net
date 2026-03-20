// client/js/symptom-checker.js

// Questions database
const questions = [
    {
        text: "Have you experienced a persistent headache?",
        desc: "Headaches that last for hours or feel unusually strong can sometimes be a sign that your body needs attention.",
        key: "headache",
        weight: 2
    },
    {
        text: "Do you have swelling in your hands, face, or feet?",
        desc: "Sudden or severe swelling can sometimes indicate fluid retention that may need attention.",
        key: "swelling",
        weight: 2
    },
    {
        text: "Have you noticed vision changes such as blurriness or flashing lights?",
        desc: "Changes in vision can be a sign that your blood pressure or circulation needs to be checked.",
        key: "vision",
        weight: 3
    },
    {
        text: "Do you feel upper abdominal pain?",
        desc: "Pain under the ribs or in the upper stomach area can sometimes be associated with pregnancy complications.",
        key: "abdominalPain",
        weight: 3
    },
    {
        text: "Have you experienced nausea or vomiting recently?",
        desc: "While nausea can be common, sudden or severe vomiting may need attention.",
        key: "nausea",
        weight: 1
    }
];

let currentQuestion = 0;
let answers = {};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadQuestion();

    document.getElementById('yesBtn').addEventListener('click', () => answerQuestion(true));
    document.getElementById('noBtn').addEventListener('click', () => answerQuestion(false));
});

// Load current question
function loadQuestion() {
    const q = questions[currentQuestion];
    document.getElementById('progress').textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
    document.getElementById('question').textContent = q.text;
    document.getElementById('description').textContent = q.desc;
}

// Handle answer
function answerQuestion(value) {
    answers[questions[currentQuestion].key] = value;
    currentQuestion++;

    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

// Show results
function showResults() {
    // Calculate score
    let score = 0;
    questions.forEach(q => {
        if (answers[q.key]) {
            score += q.weight;
        }
    });

    // Determine risk level
    let result = {
        level: 'Low',
        color: '#15803d',
        title: '💚 Low Concern',
        message: 'Your responses suggest mild symptoms that are common in pregnancy. Continue with your regular self-care and stay aware of any changes.',
        action: 'Keep up the great work taking care of yourself!'
    };

    if (score >= 6) {
        result = {
            level: 'High',
            color: '#b91c1c',
            title: '🌸 Time to Check In',
            message: 'Based on your responses, we think it\'s a good idea to speak with your healthcare provider soon. They can give you the personalized care and peace of mind you deserve.',
            action: 'Please contact your doctor or midwife within the next 24 hours.'
        };
    } else if (score >= 3) {
        result = {
            level: 'Moderate',
            color: '#d97706',
            title: '🌱 Let\'s Keep an Eye on This',
            message: 'Some of your symptoms may need a little attention. It\'s worth mentioning them at your next check-up, or sooner if they get stronger.',
            action: 'Monitor your symptoms and rest when you can.'
        };
    }

    // Hide questions, show results
    document.getElementById('progress').style.display = 'none';
    document.getElementById('question').style.display = 'none';
    document.getElementById('description').style.display = 'none';
    document.getElementById('yesBtn').style.display = 'none';
    document.getElementById('noBtn').style.display = 'none';

    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <div class="mh-result-box">
            <h2 style="color:${result.color}; margin-bottom:15px;">${result.title}</h2>
            <p style="margin-bottom:15px;">${result.message}</p>
            <p style="font-weight:600; color:${result.color};">${result.action}</p>
            
            <div style="margin-top:30px; display:flex; gap:15px; justify-content:center;">
                <button onclick="restartChecker()" class="mh-btn mh-btn-outline">Check Again</button>
                <a href="../../contact.html" class="mh-btn mh-btn-primary">Contact Support</a>
            </div>
        </div>
    `;
}

// Restart checker
function restartChecker() {
    currentQuestion = 0;
    answers = {};

    document.getElementById('progress').style.display = 'inline-block';
    document.getElementById('question').style.display = 'block';
    document.getElementById('description').style.display = 'block';
    document.getElementById('yesBtn').style.display = 'inline-block';
    document.getElementById('noBtn').style.display = 'inline-block';
    document.getElementById('result').style.display = 'none';

    loadQuestion();
}