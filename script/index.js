const API_URL = "http://localhost:3000/entries";

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('theme-toggle').addEventListener('click', () => {
        document.body.classList.toggle('dark');
    });
    loadMood();
});

function selectMood(card) {
    const moodText = card.getAttribute('data-mood');
    document.getElementById('selected-mood').textContent = moodText;
}

function clearMood() {
    document.getElementById('selected-mood').textContent = 'None';
    document.getElementById('entry').value = '';
}

function reviewMood() {
    const mood = document.getElementById('selected-mood').textContent;
    const entry = document.getElementById('entry').value.trim();

    if (mood === 'None' || entry === '') {
        alert('Please select a mood and write something first');
    } else {
        alert(`Current Entry:\nMood: ${mood}\nEntry: ${entry}`);
    }
}

async function saveMood() {
    const mood = document.getElementById('selected-mood').textContent;
    const entry = document.getElementById('entry').value.trim();
    const date = new Date().toISOString().split('T')[0];

    if (mood === 'None' || entry === '') {
        alert('Please select a mood and write something before saving');
        return;
    }

    const moodEntry = { mood, entry, date };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(moodEntry)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        alert('Mood saved successfully');
        clearMood();
        loadMood();
    } catch (error) {
        console.error("Error saving mood:", error);
        alert("Failed to save mood. Please try again.");
    }
}

async function loadMood() {
    const moodHistory = document.getElementById('mood-history');
    moodHistory.innerHTML = '';

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const moods = await response.json();

        if (moods.length === 0) {
            moodHistory.innerHTML = '<li>No entries found</li>';
            return;
        }

        moods.forEach((moodEntry) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${moodEntry.date} - ${moodEntry.mood}: ${moodEntry.entry}`;
            moodHistory.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error loading moods:", error);
        moodHistory.innerHTML = '<li>Error loading entries</li>';
    }
}

async function filterMoods() {
    const selectedDate = document.getElementById('date-filter').value;
    const selectedMood = document.getElementById('filter').value;
    const moodHistory = document.getElementById('mood-history');

    moodHistory.innerHTML = '';

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let moods = await response.json();

        const filteredMoods = moods.filter(entry => {
            return (selectedDate === "" || entry.date === selectedDate) &&
                   (selectedMood === "all" || entry.mood === selectedMood);
        });

        if (filteredMoods.length === 0) {
            moodHistory.innerHTML = '<li>No entries found</li>';
            return;
        }

        filteredMoods.forEach((moodEntry) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${moodEntry.date} - ${moodEntry.mood}: ${moodEntry.entry}`;
            moodHistory.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error filtering moods:", error);
        moodHistory.innerHTML = '<li>Error loading entries</li>';
    }
}
