// client/js/pregnancy-tracker.js

// Load records on page load
document.addEventListener('DOMContentLoaded', function() {
    displayRecords();
    updateWeekDisplay();
});

// Save pregnancy record
function savePregnancyRecord() {
    const week = document.getElementById('week').value.trim();
    const bp = document.getElementById('bp').value.trim();
    const weight = document.getElementById('weight').value.trim();
    const notes = document.getElementById('notes').value.trim();

    // Validation
    if (!week || !bp || !weight) {
        alert('🌸 Please fill in all required fields (week, blood pressure, and weight).');
        return;
    }

    const weekNum = parseInt(week);
    if (weekNum < 1 || weekNum > 42) {
        alert('Pregnancy weeks are typically between 1 and 42. Please check your week.');
        return;
    }

    if (!bp.match(/^\d{2,3}\/\d{2,3}$/)) {
        alert('Please enter blood pressure in format like 120/80');
        return;
    }

    // Create record
    const record = {
        id: Date.now(),
        week,
        bp,
        weight: parseFloat(weight),
        notes,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        insight: getWeekInsight(weekNum)
    };

    // Get existing records
    let records = JSON.parse(localStorage.getItem('pregnancyRecords')) || [];
    records.push(record);
    localStorage.setItem('pregnancyRecords', JSON.stringify(records));

    // Show success message
    alert('✨ Great job! Your record has been saved.');

    // Clear form
    document.getElementById('week').value = '';
    document.getElementById('bp').value = '';
    document.getElementById('weight').value = '';
    document.getElementById('notes').value = '';

    // Update display
    displayRecords();
    updateWeekDisplay();
}

// Display saved records
function displayRecords() {
    const records = JSON.parse(localStorage.getItem('pregnancyRecords')) || [];
    const container = document.getElementById('recordsContainer');
    const list = document.getElementById('recordsList');

    if (records.length === 0) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'block';
    list.innerHTML = '';

    // Sort by date (newest first)
    records.sort((a, b) => b.id - a.id).forEach(record => {
        const recordEl = document.createElement('div');
        recordEl.className = 'mh-record-entry';
        recordEl.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <strong>🌸 Week ${record.week}</strong>
                <span style="font-size:0.9rem; color:var(--soft-gray);">${record.date}</span>
            </div>
            <div style="margin:10px 0;">
                <span style="background:var(--primary-teal-light); padding:5px 10px; border-radius:20px;">❤️ BP: ${record.bp}</span>
                <span style="background:var(--primary-teal-light); padding:5px 10px; border-radius:20px; margin-left:10px;">⚖️ ${record.weight} kg</span>
            </div>
            ${record.notes ? `<p style="margin:10px 0; color:var(--warm-gray);">💭 ${record.notes}</p>` : ''}
            <p style="font-size:0.9rem; color:var(--primary-teal); margin:5px 0;">✨ ${record.insight}</p>
            <button onclick="deleteRecord(${record.id})" style="background:#ef4444; color:white; border:none; padding:5px 10px; border-radius:8px; margin-top:10px; cursor:pointer;">Delete</button>
        `;
        list.appendChild(recordEl);
    });
}

// Delete record
function deleteRecord(id) {
    if (confirm('Are you sure you want to delete this record?')) {
        let records = JSON.parse(localStorage.getItem('pregnancyRecords')) || [];
        records = records.filter(r => r.id !== id);
        localStorage.setItem('pregnancyRecords', JSON.stringify(records));
        displayRecords();
        updateWeekDisplay();
    }
}

// Update week display
function updateWeekDisplay() {
    const records = JSON.parse(localStorage.getItem('pregnancyRecords')) || [];
    const display = document.getElementById('currentWeekDisplay');

    if (records.length > 0) {
        const latest = records.sort((a, b) => b.id - a.id)[0];
        display.textContent = `🌸 Week ${latest.week} of 40`;
        display.style.display = 'block';
    } else {
        display.style.display = 'none';
    }
}

// Get week insight
function getWeekInsight(week) {
    const insights = {
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

    return insights[week] || "Every week brings new changes. You're doing great!";
}