const answers = {
    positive: [
        { text: "It is certain", color: "#00994C" },
        { text: "Without a doubt", color: "#00CC66" },
        { text: "You may rely on it", color: "#00FF80" },
        { text: "Yes definitely", color: "#33CC33" },
        { text: "It is decidedly so", color: "#4CAF50" },
        { text: "As I see it, yes", color: "#66FF66" },
        { text: "Most likely", color: "#90EE90" },
        { text: "Outlook good", color: "#98FB98" },
        { text: "Yes", color: "#A5D6A7" },
        { text: "Signs point to yes", color: "#C8E6C9" },
        { text: "Absolutely yes", color: "#2E8B57" },
        { text: "The stars align in your favor", color: "#3CB371" },
        { text: "Without any doubt", color: "#228B22" }
    ],
    neutral: [
        { text: "Concentrate and ask again", color: "#8A2BE2" },        { text: "Cannot predict now", color: "#9370DB" },
        { text: "Maybe", color: "#9932CC" },
        { text: "Time will tell", color: "#B0C4DE" }
    ],
    negative: [
        { text: "Don't count on it", color: "#8B0000" },
        { text: "My reply is no", color: "#B22222" },
        { text: "My sources say no", color: "#CD5C5C" },
        { text: "Outlook not so good", color: "#DC143C" },
        { text: "Very doubtful", color: "#F08080" },
        { text: "No", color: "#FF0000" },
        { text: "Definitely not", color: "#FF4500" },
        { text: "Not likely", color: "#FF6347" },
        { text: "No way", color: "#FF7F50" },
        { text: "Never", color: "#FA8072" },
        { text: "Absolutely not", color: "#800000" },
        { text: "The odds are against you", color: "#8B0000" },
        { text: "Not a chance", color: "#A52A2A" }
    ]
};

class Magic8Ball {
    constructor() {
        this.ball = document.querySelector('.ball');
        this.answer = document.querySelector('.answer');
        this.eight = document.querySelector('.eight');
        this.window = document.querySelector('.window');
        this.isAnimating = false;
        this.questionInput = document.querySelector('#questionInput');
        this.shakeButton = document.querySelector('#shakeButton');
        this.historyToggle = document.querySelector('#historyToggle');
        this.historyPanel = document.querySelector('.history-panel');
        this.historyList = document.querySelector('.history-list');
        this.history = [];
        this.isHovering = false;
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Shake button event
        this.shakeButton.addEventListener('click', () => this.shake());
        
        // Enter key in input field
        this.questionInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.shake();
            }
        });

        // Mobile shake event (if supported)
        if ('DeviceMotionEvent' in window) {
            window.addEventListener('devicemotion', (e) => {
                const acceleration = e.accelerationIncludingGravity;
                if (acceleration &&
                    Math.abs(acceleration.x) > 15 ||
                    Math.abs(acceleration.y) > 15 ||
                    Math.abs(acceleration.z) > 15) {
                    this.shake();
                }
            });
        }

        // History toggle button
        this.historyToggle.addEventListener('click', () => this.toggleHistory());

        // Add hover events
        this.ball.addEventListener('mouseenter', () => {
            if (!this.isAnimating) {
                this.isHovering = true;
            }
        });

        this.ball.addEventListener('mouseleave', () => {
            this.isHovering = false;
        });

        // Add click event to ball
        this.ball.addEventListener('click', () => {
            if (!this.isAnimating && this.questionInput.value.trim()) {
                this.shake();
            }
        });
    }

    toggleHistory() {
        this.historyPanel.classList.toggle('open');
        const isOpen = this.historyPanel.classList.contains('open');
        this.historyToggle.textContent = isOpen ? 'Close History' : 'Show History';
    }

    addToHistory(question, answer, color) {
        const timestamp = new Date().toLocaleTimeString();
        const historyItem = {
            question,
            answer,
            color,
            timestamp
        };
        
        this.history.unshift(historyItem); // Add to beginning of array
        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        this.historyList.innerHTML = this.history
            .map(item => `
                <div class="history-item">
                    <div class="question">Q: ${item.question}</div>
                    <div class="answer-text" style="color: ${item.color}">A: ${item.answer}</div>
                    <div class="timestamp">${item.timestamp}</div>
                </div>
            `)
            .join('');
    }

    getRandomAnswer() {
        const categories = Object.keys(answers);
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const categoryAnswers = answers[randomCategory];
        return { 
            ...categoryAnswers[Math.floor(Math.random() * categoryAnswers.length)],
            category: randomCategory // Add category to the return value
        };
    }

    async shake() {
        if (this.isAnimating) return;
        
        const question = this.questionInput.value.trim();
        if (!question) {
            this.questionInput.placeholder = "Please enter a question first...";
            this.questionInput.focus();
            return;
        }
        
        this.isAnimating = true;
        this.isHovering = false;
        this.answer.style.opacity = '0';
        this.eight.style.opacity = '0';
        this.ball.classList.add('shake');

        // Remove any existing answer classes
        document.body.classList.remove('positive-answer', 'negative-answer', 'neutral-answer');

        setTimeout(() => {
            const { text, color, category } = this.getRandomAnswer();
            this.answer.textContent = text;
            this.answer.style.opacity = '1';
            this.window.style.background = `radial-gradient(circle at center, ${color} 0%, ${this.darkenColor(color)} 100%)`;
            this.ball.classList.remove('shake');
            this.isAnimating = false;

            // Add the appropriate class based on the answer category
            document.body.classList.add(`${category}-answer`);

            // Add to history
            this.addToHistory(question, text, color);
            
            // Clear input
            this.questionInput.value = '';
        }, 500);
    }

    darkenColor(hex) {
        let r = parseInt(hex.slice(1,3), 16);
        let g = parseInt(hex.slice(3,5), 16);
        let b = parseInt(hex.slice(5,7), 16);
        
        r = Math.floor(r * 0.7);
        g = Math.floor(g * 0.7);
        b = Math.floor(b * 0.7);
        
        return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
    }
}

// Initialize the Magic 8 Ball when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Magic8Ball();
}); 