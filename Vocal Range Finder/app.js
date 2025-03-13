document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const noteDisplay = document.getElementById('note-display');
    const frequencyDisplay = document.getElementById('frequency-display');
    const setLowestBtn = document.getElementById('set-lowest');
    const setHighestBtn = document.getElementById('set-highest');
    const lowestNoteDisplay = document.getElementById('lowest-note-display');
    const highestNoteDisplay = document.getElementById('highest-note-display');
    const rangeResults = document.getElementById('range-results');
    const vocalRangeDisplay = document.getElementById('vocal-range');
    const voiceTypeDisplay = document.getElementById('voice-type');
    const totalNotesDisplay = document.getElementById('total-notes');
    const songSuggestions = document.getElementById('song-suggestions');
    const songsListContainer = document.getElementById('songs-list');
    const genreSelect = document.getElementById('genre');
    const canvas = document.getElementById('visualizer');
    const ctx = canvas.getContext('2d');

    let pitchDetector = new PitchDetector();
    let animationId = null;
    let lowestNote = null;
    let highestNote = null;
    let isRecording = false;
    let lastPlayedNote = null;
    let waveformPoints = [];

    // Set canvas size with higher resolution
    function resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize visualization
    function initVisualization() {
        ctx.fillStyle = 'rgba(108, 99, 255, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        waveformPoints = [];
    }
    initVisualization();

    // Enhanced waveform visualization
    function drawWaveform(frequency) {
        const centerY = canvas.height / 2;
        const amplitude = canvas.height / 3;

        // Clear canvas with fade effect
        ctx.fillStyle = 'rgba(26, 26, 26, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (!frequency) {
            waveformPoints = [];
            return;
        }

        // Calculate new point
        const time = Date.now() / 1000;
        const frequency_scaled = frequency / 500;
        const newPoint = {
            x: canvas.width,
            y: centerY + Math.sin(time * frequency_scaled) * amplitude
        };

        // Add new point and remove old ones
        waveformPoints.push(newPoint);
        waveformPoints = waveformPoints.filter(point => point.x > 0);

        // Update x positions
        waveformPoints.forEach(point => point.x -= 2);

        // Draw smooth curve through points
        if (waveformPoints.length > 1) {
            ctx.beginPath();
            ctx.moveTo(waveformPoints[0].x, waveformPoints[0].y);

            // Draw curved line through points
            for (let i = 1; i < waveformPoints.length - 2; i++) {
                const xc = (waveformPoints[i].x + waveformPoints[i + 1].x) / 2;
                const yc = (waveformPoints[i].y + waveformPoints[i + 1].y) / 2;
                ctx.quadraticCurveTo(waveformPoints[i].x, waveformPoints[i].y, xc, yc);
            }

            // Draw gradient stroke
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
            gradient.addColorStop(0, 'rgba(108, 99, 255, 0.2)');
            gradient.addColorStop(1, 'rgba(108, 99, 255, 0.8)');
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }

    // Piano event listeners
    document.getElementById('piano').addEventListener('notePlayed', (e) => {
        const { note } = e.detail;
        lastPlayedNote = note;
    });

    // Set lowest/highest note buttons
    setLowestBtn.addEventListener('click', () => {
        if (lastPlayedNote) {
            lowestNote = lastPlayedNote;
            lowestNoteDisplay.textContent = lastPlayedNote;
            updateRangeResults();
        }
    });

    setHighestBtn.addEventListener('click', () => {
        if (lastPlayedNote) {
            highestNote = lastPlayedNote;
            highestNoteDisplay.textContent = lastPlayedNote;
            updateRangeResults();
        }
    });

    // Update range results and song suggestions
    function updateRangeResults() {
        if (!lowestNote || !highestNote) return;

        const lowValue = songsDB.getNoteValue(lowestNote);
        const highValue = songsDB.getNoteValue(highestNote);
        const range = highValue - lowValue;

        // Show results section
        rangeResults.classList.remove('hidden');
        songSuggestions.classList.remove('hidden');

        // Enable recording
        startBtn.disabled = false;

        // Update displays
        vocalRangeDisplay.textContent = `${range + 1} semitones (${Math.floor(range/12)} octaves, ${range % 12} semitones)`;
        voiceTypeDisplay.textContent = songsDB.determineVoiceType(lowestNote, highestNote);
        totalNotesDisplay.textContent = `${range + 1} notes`;

        // Update song suggestions
        updateSongSuggestions();
    }

    // Update song suggestions based on genre
    function updateSongSuggestions() {
        if (!lowestNote || !highestNote) return;
        const songs = songsDB.findSongsInRange(lowestNote, highestNote, genreSelect.value);
        songsDB.displaySongs(songs, songsListContainer);
    }

    // Genre filter change handler
    genreSelect.addEventListener('change', updateSongSuggestions);

    // Main analysis loop
    function analyze() {
        const frequency = pitchDetector.getCurrentPitch();
        const note = pitchDetector.getClosestNote(frequency);
        const cents = pitchDetector.getCentsOffPitch(frequency, note);
        
        if (frequency && note) {
            noteDisplay.textContent = note;
            
            // Enhanced visual feedback for pitch accuracy
            const accuracy = pitchDetector.getAccuracy(cents);
            switch (accuracy) {
                case 'perfect':
                    noteDisplay.style.color = '#4CAF50';  // Green
                    noteDisplay.style.textShadow = '0 0 10px rgba(76, 175, 80, 0.5)';
                    break;
                case 'good':
                    noteDisplay.style.color = '#FFC107';  // Yellow
                    noteDisplay.style.textShadow = '0 0 10px rgba(255, 193, 7, 0.5)';
                    break;
                case 'fair':
                    noteDisplay.style.color = '#FF9800';  // Orange
                    noteDisplay.style.textShadow = '0 0 10px rgba(255, 152, 0, 0.5)';
                    break;
                default:
                    noteDisplay.style.color = '#6C63FF';  // Default purple
                    noteDisplay.style.textShadow = '0 0 10px rgba(108, 99, 255, 0.5)';
            }

            // Show frequency and cents deviation
            frequencyDisplay.textContent = `${Math.round(frequency)} Hz`;
            if (cents !== 0) {
                const sign = cents > 0 ? '+' : '';
                frequencyDisplay.textContent += ` (${sign}${cents} cents)`;
            }
        } else {
            noteDisplay.textContent = '--';
            frequencyDisplay.textContent = '-- Hz';
            noteDisplay.style.color = '#6C63FF';
            noteDisplay.style.textShadow = 'none';
        }

        drawWaveform(frequency);
        animationId = requestAnimationFrame(analyze);
    }

    // Start button handler
    startBtn.addEventListener('click', async () => {
        if (!isRecording) {
            const success = await pitchDetector.start();
            if (success) {
                isRecording = true;
                startBtn.textContent = 'Stop Recording';
                resetBtn.disabled = true;
                analyze();
            } else {
                alert('Could not access microphone. Please ensure microphone permissions are granted.');
            }
        } else {
            pitchDetector.stop();
            isRecording = false;
            startBtn.textContent = 'Start Recording';
            resetBtn.disabled = false;
            cancelAnimationFrame(animationId);
            initVisualization();
        }
    });

    // Reset button handler
    resetBtn.addEventListener('click', () => {
        lowestNote = null;
        highestNote = null;
        lowestNoteDisplay.textContent = 'Select your lowest note';
        highestNoteDisplay.textContent = 'Select your highest note';
        noteDisplay.textContent = '--';
        frequencyDisplay.textContent = '-- Hz';
        noteDisplay.style.color = '#6C63FF';
        noteDisplay.style.textShadow = 'none';
        rangeResults.classList.add('hidden');
        songSuggestions.classList.add('hidden');
        startBtn.disabled = true;
        initVisualization();
    });
});
