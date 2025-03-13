class PitchDetector {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.mediaStreamSource = null;
        this.buffer = null;
        this.isRecording = false;
        
        // Note frequencies (in Hz) for octaves 2-6
        this.noteFrequencies = {
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

        // For smoothing frequency readings
        this.frequencyBuffer = [];
        this.bufferSize = 5;
    }

    async start() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: { 
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: false
                } 
            });
            
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 4096; // Increased for better resolution
            this.analyser.smoothingTimeConstant = 0.8;
            
            this.mediaStreamSource = this.audioContext.createMediaStreamSource(stream);
            
            // Add low-pass filter
            const filter = this.audioContext.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 1500;
            filter.Q.value = 0.5;
            
            this.mediaStreamSource.connect(filter);
            filter.connect(this.analyser);
            
            this.buffer = new Float32Array(this.analyser.frequencyBinCount);
            this.isRecording = true;
            
            return true;
        } catch (error) {
            console.error('Error accessing microphone:', error);
            return false;
        }
    }

    stop() {
        if (this.mediaStreamSource) {
            this.mediaStreamSource.disconnect();
            this.isRecording = false;
        }
        if (this.audioContext) {
            this.audioContext.close();
        }
        this.frequencyBuffer = [];
    }

    getCurrentPitch() {
        if (!this.isRecording) return null;

        this.analyser.getFloatTimeDomainData(this.buffer);
        const pitch = this.enhancedAutoCorrelate(this.buffer, this.audioContext.sampleRate);
        
        if (pitch === -1) return null;

        // Smooth the frequency readings
        this.frequencyBuffer.push(pitch);
        if (this.frequencyBuffer.length > this.bufferSize) {
            this.frequencyBuffer.shift();
        }

        // Return median value for stability
        const sortedFreqs = [...this.frequencyBuffer].sort((a, b) => a - b);
        return sortedFreqs[Math.floor(sortedFreqs.length / 2)];
    }

    enhancedAutoCorrelate(buffer, sampleRate) {
        const SIZE = buffer.length;
        const MAX_SAMPLES = Math.floor(SIZE/2);
        let bestOffset = -1;
        let bestCorrelation = 0;
        let rms = 0;
        let foundGoodCorrelation = false;
        
        // Calculate RMS and check if there's enough signal
        for (let i = 0; i < SIZE; i++) {
            const val = buffer[i];
            rms += val * val;
        }
        rms = Math.sqrt(rms / SIZE);
        
        // Require more signal for better accuracy
        if (rms < 0.015) return -1;

        let lastCorrelation = 1;
        
        // Find the best correlation
        for (let offset = 0; offset < MAX_SAMPLES; offset++) {
            let correlation = 0;
            let sumOfSquares = 0;
            
            for (let i = 0; i < MAX_SAMPLES; i++) {
                const val1 = buffer[i];
                const val2 = buffer[i + offset];
                correlation += val1 * val2;
                sumOfSquares += val1 * val1 + val2 * val2;
            }
            
            correlation = 2 * correlation / sumOfSquares;
            
            // Early exit if we can't find a better correlation
            if ((correlation > 0.95) && (correlation > lastCorrelation)) {
                foundGoodCorrelation = true;
                if (correlation > bestCorrelation) {
                    bestCorrelation = correlation;
                    bestOffset = offset;
                }
            } else if (foundGoodCorrelation) {
                // Refine the best offset using interpolation
                const shift = (correlation - lastCorrelation) / 2;
                bestOffset = offset - 1 + shift;
                break;
            }
            
            lastCorrelation = correlation;
        }
        
        if (bestCorrelation > 0.01) {
            // Interpolate for better frequency accuracy
            return sampleRate / bestOffset;
        }
        
        return -1;
    }

    getClosestNote(frequency) {
        if (!frequency) return null;

        let closestNote = null;
        let closestDiff = Infinity;
        let minCents = Infinity;

        for (const [note, noteFreq] of Object.entries(this.noteFrequencies)) {
            const diff = Math.abs(frequency - noteFreq);
            const cents = Math.abs(1200 * Math.log2(frequency / noteFreq));
            
            if (diff < closestDiff || (diff === closestDiff && cents < minCents)) {
                closestDiff = diff;
                minCents = cents;
                closestNote = note;
            }
        }

        // Only return a note if we're within 50 cents
        return minCents <= 50 ? closestNote : null;
    }

    getCentsOffPitch(frequency, note) {
        if (!frequency || !note) return 0;
        
        const noteFreq = this.noteFrequencies[note];
        const cents = Math.round(1200 * Math.log2(frequency / noteFreq));
        
        // Return cents only if within reasonable range
        return Math.abs(cents) > 50 ? 0 : cents;
    }

    getAccuracy(cents) {
        if (Math.abs(cents) < 5) return 'perfect'; // Within 5 cents
        if (Math.abs(cents) < 15) return 'good';   // Within 15 cents
        if (Math.abs(cents) < 30) return 'fair';   // Within 30 cents
        return 'poor';                             // More than 30 cents off
    }
}

// Export for use in app.js
window.PitchDetector = PitchDetector;
