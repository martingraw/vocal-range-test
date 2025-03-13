class SongsDatabase {
    constructor() {
        // Song database with vocal ranges and genres
        this.songs = [
            // Pop Songs
            {
                title: "Hello",
                artist: "Adele",
                range: { low: "F3", high: "B4" },
                genres: ["pop", "soul"],
                link: "https://www.youtube.com/watch?v=YQHsXMglC9A"
            },
            {
                title: "All of Me",
                artist: "John Legend",
                range: { low: "E3", high: "B4" },
                genres: ["pop", "soul"],
                link: "https://www.youtube.com/watch?v=450p7goxZqg"
            },
            {
                title: "Perfect",
                artist: "Ed Sheeran",
                range: { low: "G3", high: "G4" },
                genres: ["pop"],
                link: "https://www.youtube.com/watch?v=2Vv-BfVoq4g"
            },
            {
                title: "Someone Like You",
                artist: "Adele",
                range: { low: "E3", high: "E5" },
                genres: ["pop", "soul"],
                link: "https://www.youtube.com/watch?v=hLQl3WQQoQ0"
            },
            {
                title: "Just the Way You Are",
                artist: "Bruno Mars",
                range: { low: "D3", high: "A4" },
                genres: ["pop"],
                link: "https://www.youtube.com/watch?v=LjhCEhWiKXk"
            },

            // Rock Songs
            {
                title: "Bohemian Rhapsody",
                artist: "Queen",
                range: { low: "F3", high: "A4" },
                genres: ["rock"],
                link: "https://www.youtube.com/watch?v=fJ9rUzIMcZQ"
            },
            {
                title: "Sweet Child O' Mine",
                artist: "Guns N' Roses",
                range: { low: "D3", high: "A5" },
                genres: ["rock"],
                link: "https://www.youtube.com/watch?v=1w7OgIMMRc4"
            },
            {
                title: "Dream On",
                artist: "Aerosmith",
                range: { low: "B2", high: "C6" },
                genres: ["rock"],
                link: "https://www.youtube.com/watch?v=89dGC8de0CA"
            },
            {
                title: "Nothing Else Matters",
                artist: "Metallica",
                range: { low: "E2", high: "G4" },
                genres: ["rock"],
                link: "https://www.youtube.com/watch?v=tAGnKpE4NCI"
            },
            {
                title: "Stairway to Heaven",
                artist: "Led Zeppelin",
                range: { low: "D3", high: "G5" },
                genres: ["rock"],
                link: "https://www.youtube.com/watch?v=QkF3oxziUI4"
            },

            // Soul/R&B Songs
            {
                title: "I Will Always Love You",
                artist: "Whitney Houston",
                range: { low: "C3", high: "C6" },
                genres: ["pop", "soul"],
                link: "https://www.youtube.com/watch?v=3JWTaaS7LdU"
            },
            {
                title: "Respect",
                artist: "Aretha Franklin",
                range: { low: "D3", high: "C5" },
                genres: ["soul"],
                link: "https://www.youtube.com/watch?v=6FOUqQt3Kg0"
            },
            {
                title: "My Girl",
                artist: "The Temptations",
                range: { low: "E3", high: "G4" },
                genres: ["soul"],
                link: "https://www.youtube.com/watch?v=6IUG-9jZD-g"
            },

            // Country Songs
            {
                title: "Take Me Home, Country Roads",
                artist: "John Denver",
                range: { low: "G2", high: "A4" },
                genres: ["country", "folk"],
                link: "https://www.youtube.com/watch?v=1vrEljMfXYo"
            },
            {
                title: "Jolene",
                artist: "Dolly Parton",
                range: { low: "A3", high: "D5" },
                genres: ["country"],
                link: "https://www.youtube.com/watch?v=Ixrje2rXLMA"
            },
            {
                title: "Friends in Low Places",
                artist: "Garth Brooks",
                range: { low: "A2", high: "B4" },
                genres: ["country"],
                link: "https://www.youtube.com/watch?v=mvCgSqPZ4EM"
            },
            {
                title: "I Walk the Line",
                artist: "Johnny Cash",
                range: { low: "F2", high: "A3" },
                genres: ["country"],
                link: "https://www.youtube.com/watch?v=KHF9itPLUo4"
            },

            // Jazz Standards
            {
                title: "Fly Me to the Moon",
                artist: "Frank Sinatra",
                range: { low: "C3", high: "C4" },
                genres: ["jazz"],
                link: "https://www.youtube.com/watch?v=ZEcqHA7dbwM"
            },
            {
                title: "What a Wonderful World",
                artist: "Louis Armstrong",
                range: { low: "F2", high: "F4" },
                genres: ["jazz"],
                link: "https://www.youtube.com/watch?v=VqhCQZaH4Vs"
            },
            {
                title: "Summertime",
                artist: "Ella Fitzgerald",
                range: { low: "B3", high: "E5" },
                genres: ["jazz"],
                link: "https://www.youtube.com/watch?v=XivELBdxVRM"
            },
            {
                title: "The Girl from Ipanema",
                artist: "Astrud Gilberto",
                range: { low: "D3", high: "C5" },
                genres: ["jazz", "bossa nova"],
                link: "https://www.youtube.com/watch?v=c5QfXjsoNe4"
            },

            // Musical Theater
            {
                title: "Memory",
                artist: "Cats (Musical)",
                range: { low: "G3", high: "C6" },
                genres: ["musical"],
                link: "https://www.youtube.com/watch?v=4-L6rEm0rnY"
            },
            {
                title: "The Music of the Night",
                artist: "Phantom of the Opera",
                range: { low: "A2", high: "G4" },
                genres: ["musical"],
                link: "https://www.youtube.com/watch?v=77umP7IRxD4"
            },
            {
                title: "Defying Gravity",
                artist: "Wicked",
                range: { low: "F3", high: "D5" },
                genres: ["musical"],
                link: "https://www.youtube.com/watch?v=O5V9KwppMfs"
            }
        ];

        // Voice type ranges (approximate)
        this.voiceTypes = {
            'Soprano': { low: 'C4', high: 'C6' },
            'Mezzo-soprano': { low: 'A3', high: 'A5' },
            'Alto': { low: 'G3', high: 'E5' },
            'Countertenor': { low: 'G3', high: 'D5' },
            'Tenor': { low: 'C3', high: 'C5' },
            'Baritone': { low: 'G2', high: 'G4' },
            'Bass': { low: 'E2', high: 'E4' }
        };
    }

    getNoteValue(note) {
        const noteMap = {
            'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5,
            'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
        };
        
        const noteName = note.slice(0, -1);
        const octave = parseInt(note.slice(-1));
        return octave * 12 + noteMap[noteName];
    }

    isNoteInRange(note, range) {
        const noteValue = this.getNoteValue(note);
        const lowValue = this.getNoteValue(range.low);
        const highValue = this.getNoteValue(range.high);
        return noteValue >= lowValue && noteValue <= highValue;
    }

    determineVoiceType(lowNote, highNote) {
        const matches = [];
        
        for (const [type, range] of Object.entries(this.voiceTypes)) {
            if (this.isNoteInRange(lowNote, range) && this.isNoteInRange(highNote, range)) {
                matches.push(type);
            }
        }

        return matches.length > 0 ? matches[0] : 'Undetermined';
    }

    findSongsInRange(lowNote, highNote, genre = 'all') {
        return this.songs.filter(song => {
            const isInRange = this.isNoteInRange(song.range.low, { low: lowNote, high: highNote }) &&
                            this.isNoteInRange(song.range.high, { low: lowNote, high: highNote });
            
            return genre === 'all' ? isInRange : (isInRange && song.genres.includes(genre));
        });
    }

    displaySongs(songs, container) {
        container.innerHTML = '';
        
        if (songs.length === 0) {
            container.innerHTML = '<div class="song-item">No songs found in your range for this genre.</div>';
            return;
        }

        songs.forEach(song => {
            const songElement = document.createElement('div');
            songElement.className = 'song-item';
            songElement.innerHTML = `
                <div class="song-info">
                    <div class="song-title">${song.title}</div>
                    <div class="song-artist">${song.artist} (${song.range.low} - ${song.range.high})</div>
                </div>
                <a href="${song.link}" target="_blank" class="song-link">Listen</a>
            `;
            container.appendChild(songElement);
        });
    }
}

// Initialize database when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.songsDB = new SongsDatabase();
});
