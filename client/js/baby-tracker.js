// client/js/baby-tracker.js

// Show/hide fields based on activity
document.getElementById('activity').addEventListener('change', function() {
    const activity = this.value;

    document.getElementById('feedingDetails').style.display = 'none';
    document.getElementById('sleepDetails').style.display = 'none';
    document.getElementById('diaperDetails').style.display = 'none';

    if (activity === 'feeding') {
        document.getElementById('feedingDetails').style.display = 'block';
    } else if (activity === 'sleep') {
        document.getElementById('sleepDetails').style.display = 'block';
    } else if (activity === 'diaper') {
        document.getElementById('diaperDetails').style.display = 'block';
    }
});

// Load records on page load
document.addEventListener('DOMContentLoaded', displayRecords);

// Save baby record
function saveBabyRecord() {
    const activity = document.getElementById('activity').value;
    const notes = document.getElementById('notes').value.trim();

    if (!activity) {
        alert('🍼 Please select an activity type.');
        return;
    }

    // Build record based on activity
    const record = {
        id: Date.now(),
        activity,
        notes,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
    };

    // Add activity-specific details
    if (activity === 'feeding') {
        const feedingType = document.getElementById('feedingType').value;
        const duration = document.getElementById('duration').value;

        if (!duration) {
            alert('Please enter feeding duration.');
            return;
        }

        record.feedingType = feedingType;
        record.duration = duration;
        record.icon = '🍼';
        record.title = `Feeding - ${feedingType}`;

    } else if (activity === 'sleep') {
        const sleepDuration = document.getElementById('sleepDuration').value;

        if (!sleepDuration) {
            alert('Please enter sleep duration.');
            return;
        }

        record.sleepDuration = sleepDuration;
        record.icon = '😴';
        record.title = `Slept for ${sleepDuration} hours`;

    } else if (activity === 'diaper') {
        const diaperType = document.getElementById('diaperType').value;
        record.diaperType = diaperType;
        record.icon = '🧷';
        record.title = `Diaper change - ${diaperType}`;

    } else if (activity === 'bath') {
        record.icon = '🛁';
        record.title = 'Bath time';
    } else if (activity === 'milestone') {
        record.icon = '✨';
        record.title = 'New milestone';
    }

    // Get existing records
    let records = JSON.parse(localStorage.getItem('babyRecords')) || [];
    records.push(record);
    localStorage.setItem('babyRecords', JSON.stringify(records));

    // Show success
    alert('✨ Entry saved!');

    // Clear form
    document.getElementById('activity').value = '';
    document.getElementById('notes').value = '';
    document.getElementById('feedingDetails').style.display = 'none';
    document.getElementById('sleepDetails').style.display = 'none';
    document.getElementById('diaperDetails').style.display = 'none';

    // Update display
    displayRecords();
}

// Display records
function displayRecords() {
    const records = JSON.parse(localStorage.getItem('babyRecords')) || [];
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

        let details = '';
        if (record.feedingType) {
            details = `<p>Type: ${record.feedingType} | Duration: ${record.duration} minutes</p>`;
        } else if (record.sleepDuration) {
            details = `<p>Duration: ${record.sleepDuration} hours</p>`;
        } else if (record.diaperType) {
            details = `<p>Type: ${record.diaperType}</p>`;
        }

        recordEl.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <strong>${record.icon} ${record.title}</strong>
                <span style="font-size:0.9rem; color:var(--soft-gray);">${record.date} at ${record.time}</span>
            </div>
            ${details}
            ${record.notes ? `<p style="margin:5px 0;">💭 ${record.notes}</p>` : ''}
            <button onclick="deleteRecord(${record.id})" style="background:#ef4444; color:white; border:none; padding:5px 10px; border-radius:8px; margin-top:10px; cursor:pointer;">Delete</button>
        `;
        list.appendChild(recordEl);
    });
}

// Delete record
function deleteRecord(id) {
    if (confirm('Delete this record?')) {
        let records = JSON.parse(localStorage.getItem('babyRecords')) || [];
        records = records.filter(r => r.id !== id);
        localStorage.setItem('babyRecords', JSON.stringify(records));
        displayRecords();
    }
}