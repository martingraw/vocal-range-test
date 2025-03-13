class Piano {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.currentNote = null;
        this.pianoElement = document.getElementById('piano');
        this.activeNodes = new Map();
        
        // Note frequencies for reference (C2 to C6)
        this.notes = {
            'C2': 65.41, 'C#2': 69.30, 'D2': 73.42, 'D#2': 77.78, 'E2': 82.41, 'F2': 87.31,
            'F#2': 92.50, 'G2': 98.00, 'G#2': 103.83, 'A2': 110.00, 'A#2': 116.54, 'B2': 123.47,
            'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61,
            'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
            'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23,
            'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
            'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.26, 'F5': 698.46,
            'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'B5': 987.77,
            'C6': 1046.50
        };

        this.init();
    }

    init() {
        // Create piano keys
        const octaves = ['2', '3', '4', '5'];
        const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        const blackKeys = ['C#', 'D#', 'F#', 'G#', 'A#'];

        // Create white keys
        octaves.forEach(octave => {
            whiteKeys.forEach(note => {
                const key = document.createElement('div');
                key.className = 'piano-key white';
                key.dataset.note = note + octave;
                
                const label = document.createElement('div');
                label.className = 'note-label';
                label.textContent = note + octave;
                key.appendChild(label);
                
                this.pianoElement.appendChild(key);
            });
        });

        // Add C6
        const c6Key = document.createElement('div');
        c6Key.className = 'piano-key white';
        c6Key.dataset.note = 'C6';
        const c6Label = document.createElement('div');
        c6Label.className = 'note-label';
        c6Label.textContent = 'C6';
        c6Key.appendChild(c6Label);
        this.pianoElement.appendChild(c6Key);

        // Create black keys
        octaves.forEach(octave => {
            blackKeys.forEach(note => {
                const key = document.createElement('div');
                key.className = 'piano-key black';
                key.dataset.note = note + octave;
                
                const label = document.createElement('div');
                label.className = 'note-label';
                label.textContent = note + octave;
                key.appendChild(label);
                
                this.pianoElement.appendChild(key);
            });
        });

        // Add event listeners
        this.pianoElement.addEventListener('mousedown', this.handleKeyPress.bind(this));
        this.pianoElement.addEventListener('mouseup', this.handleKeyRelease.bind(this));
        this.pianoElement.addEventListener('mouseleave', this.handleKeyRelease.bind(this));
        
        // Touch events for mobile
        this.pianoElement.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleKeyPress(e);
        });
        this.pianoElement.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.handleKeyRelease(e);
        });
    }

    handleKeyPress(event) {
        const key = event.target.closest('.piano-key');
        if (!key) return;

        const note = key.dataset.note;
        if (note === this.currentNote) return;

        this.currentNote = note;
        key.classList.add('active');
        this.playNote(note);
    }

    handleKeyRelease() {
        if (!this.currentNote) return;

        const key = this.pianoElement.querySelector(`[data-note="${this.currentNote}"]`);
        if (key) {
            key.classList.remove('active');
        }

        this.releaseNote(this.currentNote);
        this.currentNote = null;
    }

    playNote(note) {
        const frequency = this.notes[note];
        if (!frequency) return;

        // Create audio nodes
        const mainOscillator = this.audioContext.createOscillator();
        const harmonicOscillator1 = this.audioContext.createOscillator();
        const harmonicOscillator2 = this.audioContext.createOscillator();
        const subOscillator = this.audioContext.createOscillator();
        
        const gainNode = this.audioContext.createGain();
        const harmonicGain1 = this.audioContext.createGain();
        const harmonicGain2 = this.audioContext.createGain();
        const subGain = this.audioContext.createGain();
        const masterGainNode = this.audioContext.createGain();

        // Configure oscillators for piano-like sound
        mainOscillator.type = 'triangle';
        mainOscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        
        // First harmonic (one octave up)
        harmonicOscillator1.type = 'sine';
        harmonicOscillator1.frequency.setValueAtTime(frequency * 2, this.audioContext.currentTime);
        
        // Second harmonic (perfect fifth above first harmonic)
        harmonicOscillator2.type = 'sine';
        harmonicOscillator2.frequency.setValueAtTime(frequency * 3, this.audioContext.currentTime);

        // Sub oscillator for richness
        subOscillator.type = 'sine';
        subOscillator.frequency.setValueAtTime(frequency * 0.5, this.audioContext.currentTime);

        // Configure gain nodes with piano-like envelope
        const now = this.audioContext.currentTime;
        const attackTime = 0.015;
        const decayTime = 0.2;
        const sustainLevel = 0.8;

        // Main note envelope
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(1, now + attackTime);
        gainNode.gain.exponentialRampToValueAtTime(sustainLevel, now + attackTime + decayTime);

        // First harmonic envelope
        harmonicGain1.gain.setValueAtTime(0, now);
        harmonicGain1.gain.linearRampToValueAtTime(0.6, now + attackTime);
        harmonicGain1.gain.exponentialRampToValueAtTime(0.3, now + attackTime + decayTime);

        // Second harmonic envelope
        harmonicGain2.gain.setValueAtTime(0, now);
        harmonicGain2.gain.linearRampToValueAtTime(0.4, now + attackTime);
        harmonicGain2.gain.exponentialRampToValueAtTime(0.15, now + attackTime + decayTime);

        // Sub oscillator envelope
        subGain.gain.setValueAtTime(0, now);
        subGain.gain.linearRampToValueAtTime(0.3, now + attackTime);
        subGain.gain.exponentialRampToValueAtTime(0.1, now + attackTime + decayTime);

        // Master volume
        masterGainNode.gain.setValueAtTime(0.7, now);

        // Connect nodes
        mainOscillator.connect(gainNode);
        harmonicOscillator1.connect(harmonicGain1);
        harmonicOscillator2.connect(harmonicGain2);
        subOscillator.connect(subGain);
        
        gainNode.connect(masterGainNode);
        harmonicGain1.connect(masterGainNode);
        harmonicGain2.connect(masterGainNode);
        subGain.connect(masterGainNode);
        
        masterGainNode.connect(this.audioContext.destination);

        // Start oscillators
        mainOscillator.start();
        harmonicOscillator1.start();
        harmonicOscillator2.start();
        subOscillator.start();

        // Store active nodes for release
        this.activeNodes.set(note, {
            oscillators: [mainOscillator, harmonicOscillator1, harmonicOscillator2, subOscillator],
            gains: [gainNode, harmonicGain1, harmonicGain2, subGain, masterGainNode]
        });

        // Dispatch custom event for note played
        const event = new CustomEvent('notePlayed', { 
            detail: { note, frequency } 
        });
        this.pianoElement.dispatchEvent(event);
    }

    releaseNote(note) {
        const nodes = this.activeNodes.get(note);
        if (!nodes) return;

        const { oscillators, gains } = nodes;
        const now = this.audioContext.currentTime;
        const releaseTime = 1.2; // Longer release for better sustain

        // Gradual release with curve for more natural decay
        gains.forEach(gain => {
            const currentValue = gain.gain.value;
            gain.gain.cancelScheduledValues(now);
            gain.gain.setValueAtTime(currentValue, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + releaseTime);
        });

        // Clean up nodes after release
        setTimeout(() => {
            oscillators.forEach(osc => {
                osc.stop();
                osc.disconnect();
            });
            gains.forEach(gain => gain.disconnect());
            this.activeNodes.delete(note);
        }, releaseTime * 1000);
    }
}

// Initialize piano when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.piano = new Piano();
});
