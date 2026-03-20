// server/utils/ai-utils.js - AI Utilities

const fileStorage = require('./file-storage');

// Symptom weights for risk calculation
const SYMPTOM_WEIGHTS = {
    headache: 2,
    swelling: 2,
    vision: 3,
    abdominalPain: 3,
    nausea: 1,
    bleeding: 4,
    fever: 2,
    decreasedMovement: 3,
    dizziness: 1,
    contractions: 2
};

// Risk level messages
const RISK_MESSAGES = {
    HIGH: {
        title: "🌸 Time to Check In",
        message: "Based on your responses, we think it's a good idea to speak with your healthcare provider soon.",
        action: "Please contact your doctor or midwife within the next 24 hours.",
        color: "#b91c1c"
    },
    MODERATE: {
        title: "🌱 Let's Keep an Eye on This",
        message: "Some of your symptoms may need a little attention.",
        action: "Monitor your symptoms and rest when you can.",
        color: "#d97706"
    },
    LOW: {
        title: "💚 You're Doing Great",
        message: "Your responses suggest mild symptoms that are common in pregnancy.",
        action: "Keep up the great work taking care of yourself!",
        color: "#15803d"
    }
};

// Pregnancy week insights
const WEEK_INSIGHTS = {
    4: "Your baby is the size of a poppy seed. The neural tube is forming!",
    8: "Raspberry size! Baby's heart is beating about 110 times a minute.",
    12: "Plum size. First trimester is complete! Baby is fully formed.",
    16: "Avocado size. You might feel first movements (quickening).",
    20: "Banana size. HALFWAY THERE! Baby is more active.",
    24: "Corn size. Baby's lungs are developing rapidly.",
    28: "Eggplant size. Third trimester begins! Baby can blink.",
    32: "Jicama size. Baby practices breathing movements.",
    36: "Romaine lettuce size. Baby drops into position.",
    40: "Watermelon size. DUE WEEK! Your baby is ready to meet you."
};

// AI chat responses
const CHAT_RESPONSES = {
    headache: "Headaches during pregnancy can be common. Try resting in a quiet, dark room and staying hydrated. If the headache is severe or persistent, please contact your healthcare provider.",
    swelling: "Some swelling is normal, especially in later pregnancy. Try elevating your feet and avoiding standing for long periods. If swelling is sudden or severe, mention it to your provider.",
    bp: "Monitoring blood pressure is important during pregnancy. If you're seeing consistently high readings, please discuss with your healthcare provider.",
    movement: "If you're concerned about your baby's movements, try lying on your left side and counting kicks. You should feel at least 10 movements in 2 hours.",
    nausea: "Nausea is common, especially in the first trimester. Try eating small, frequent meals and avoiding spicy foods.",
    dueDate: "Your due date is calculated as 40 weeks from the first day of your last menstrual period. Every baby comes on their own schedule!",
    default: "Thank you for your question. For personalized medical advice, please consult with your healthcare provider who knows your history best."
};

// Analyze symptoms
function analyzeSymptoms(answers) {
    let score = 0;
    let reportedSymptoms = [];

    for (const [symptom, present] of Object.entries(answers)) {
        if (present && SYMPTOM_WEIGHTS[symptom]) {
            score += SYMPTOM_WEIGHTS[symptom];
            reportedSymptoms.push(symptom);
        }
    }

    let riskLevel = 'LOW';
    if (score >= 6) {
        riskLevel = 'HIGH';
    } else if (score >= 3) {
        riskLevel = 'MODERATE';
    }

    const riskInfo = RISK_MESSAGES[riskLevel];
    const recommendations = generateRecommendations(reportedSymptoms);

    return {
        riskLevel,
        riskScore: score,
        title: riskInfo.title,
        message: riskInfo.message,
        action: riskInfo.action,
        color: riskInfo.color,
        recommendations,
        reportedSymptoms,
        timestamp: new Date().toISOString()
    };
}

// Generate recommendations
function generateRecommendations(symptoms) {
    const recs = [];

    if (symptoms.includes('headache')) {
        recs.push("Rest in a quiet, dark room and stay hydrated.");
    }
    if (symptoms.includes('swelling')) {
        recs.push("Elevate your feet when resting and avoid standing for long periods.");
    }
    if (symptoms.includes('vision')) {
        recs.push("Note any vision changes and mention them to your provider.");
    }
    if (symptoms.includes('abdominalPain')) {
        recs.push("Try changing positions and resting. If pain persists, contact your provider.");
    }
    if (symptoms.includes('nausea')) {
        recs.push("Eat small, frequent meals and avoid spicy or greasy foods.");
    }
    if (symptoms.includes('bleeding')) {
        recs.push("Please contact your healthcare provider immediately.");
    }
    if (symptoms.includes('decreasedMovement')) {
        recs.push("Try drinking something cold and lying on your left side to feel for movement.");
    }

    return recs.length ? recs : ["Continue with your regular self-care routine."];
}

// Get week insight
function getWeekInsight(week) {
    return WEEK_INSIGHTS[week] || "Every week brings new changes. You're doing great!";
}

// Calculate due date
function calculateDueDate(lmpDate) {
    const lmp = new Date(lmpDate);
    const dueDate = new Date(lmp);
    dueDate.setDate(lmp.getDate() + 280);

    const today = new Date();
    const weeksPregnant = Math.floor((today - lmp) / (7 * 24 * 60 * 60 * 1000));
    const daysPregnant = Math.floor((today - lmp) / (24 * 60 * 60 * 1000)) % 7;

    let trimester = 1;
    if (weeksPregnant >= 13 && weeksPregnant <= 27) trimester = 2;
    if (weeksPregnant >= 28) trimester = 3;

    return {
        dueDate: dueDate.toISOString().split('T')[0],
        weeksPregnant: Math.max(0, weeksPregnant),
        daysPregnant: Math.max(0, daysPregnant),
        trimester,
        remainingDays: Math.max(0, Math.ceil((dueDate - today) / (24 * 60 * 60 * 1000)))
    };
}

// Analyze vital trends
function analyzeVitalsTrends(records) {
    if (!records || records.length < 2) {
        return {
            hasTrend: false,
            message: 'Keep tracking to see your trends!'
        };
    }

    const sorted = records.sort((a, b) => new Date(a.date) - new Date(b.date));
    const recent = sorted.slice(-3);

    const bpReadings = recent.map(r => parseInt(r.bp?.split('/')[0])).filter(Boolean);
    const weightReadings = recent.map(r => r.weight).filter(Boolean);

    let bpTrend = 'stable';
    let weightTrend = 'stable';

    if (bpReadings.length >= 2) {
        const bpChange = bpReadings[bpReadings.length - 1] - bpReadings[0];
        if (bpChange > 10) bpTrend = 'increasing';
        if (bpChange < -10) bpTrend = 'decreasing';
    }

    if (weightReadings.length >= 2) {
        const weightChange = weightReadings[weightReadings.length - 1] - weightReadings[0];
        if (weightChange > 2) weightTrend = 'increasing';
        if (weightChange < -1) weightTrend = 'decreasing';
    }

    return {
        hasTrend: true,
        bpTrend,
        weightTrend,
        message: generateTrendMessage(bpTrend, weightTrend)
    };
}

// Generate trend message
function generateTrendMessage(bpTrend, weightTrend) {
    if (bpTrend === 'increasing' && weightTrend === 'increasing') {
        return "Your readings are trending upward. This is normal in late pregnancy.";
    }
    if (bpTrend === 'increasing') {
        return "Your blood pressure has been rising. Let's keep an eye on this.";
    }
    if (weightTrend === 'decreasing') {
        return "Your weight has decreased. Make sure you're eating regular meals.";
    }
    return "Your vitals look stable. You're doing great!";
}

// Get chat response
function getChatResponse(message, context) {
    const msg = message.toLowerCase();

    if (msg.includes('headache')) return CHAT_RESPONSES.headache;
    if (msg.includes('swell')) return CHAT_RESPONSES.swelling;
    if (msg.includes('bp') || msg.includes('blood pressure')) return CHAT_RESPONSES.bp;
    if (msg.includes('move') || msg.includes('kick')) return CHAT_RESPONSES.movement;
    if (msg.includes('nausea') || msg.includes('sick')) return CHAT_RESPONSES.nausea;
    if (msg.includes('due') || msg.includes('date')) return CHAT_RESPONSES.dueDate;

    return CHAT_RESPONSES.default;
}

// Get risk statistics
async function getRiskStats(timeframe = 'week') {
    const symptoms = await fileStorage.read('symptoms.json');
    const now = new Date();
    const cutoff = new Date();

    if (timeframe === 'week') {
        cutoff.setDate(now.getDate() - 7);
    } else if (timeframe === 'month') {
        cutoff.setMonth(now.getMonth() - 1);
    }

    const filtered = symptoms.filter(s => new Date(s.createdAt) >= cutoff);

    const stats = {
        total: filtered.length,
        high: filtered.filter(s => s.riskLevel === 'HIGH').length,
        moderate: filtered.filter(s => s.riskLevel === 'MODERATE').length,
        low: filtered.filter(s => s.riskLevel === 'LOW').length,
        recent: filtered.slice(-10).reverse()
    };

    return stats;
}

module.exports = {
    analyzeSymptoms,
    getWeekInsight,
    calculateDueDate,
    analyzeVitalsTrends,
    getChatResponse,
    getRiskStats,
    SYMPTOM_WEIGHTS,
    RISK_MESSAGES,
    WEEK_INSIGHTS
};