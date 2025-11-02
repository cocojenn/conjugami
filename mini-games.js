// MINI-JEUX POUR L'APPRENTISSAGE LUDIQUE

// ==================== SPEED RUN ====================
class SpeedRunGame {
    constructor(adaptiveLearning, verbDatabase) {
        this.adaptiveLearning = adaptiveLearning;
        this.verbDatabase = verbDatabase;
        this.duration = 60; // secondes
        this.timeLeft = this.duration;
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.questions = [];
        this.currentQuestion = null;
        this.timerInterval = null;
        this.isPlaying = false;
    }

    // Générer une question
    generateQuestion() {
        const verbs = this.adaptiveLearning.getVerbsByLevel(this.verbDatabase, 5);
        const tenses = this.adaptiveLearning.getTensesByLevel();
        
        const verb = verbs[Math.floor(Math.random() * verbs.length)];
        const tense = tenses[Math.floor(Math.random() * tenses.length)];
        
        const pronouns = ['je', 'tu', 'il/elle/on', 'nous', 'vous', 'ils/elles'];
        const pronoun = pronouns[Math.floor(Math.random() * pronouns.length)];
        const pronounIndex = pronouns.indexOf(pronoun);
        
        const verbData = this.verbDatabase[verb];
        if (!verbData || !verbData.conjugations[tense]) {
            return this.generateQuestion(); // Réessayer
        }
        
        const tenseData = verbData.conjugations[tense];
        const correctAnswer = tenseData.forms[pronounIndex];
        
        // Générer des réponses incorrectes crédibles
        const wrongAnswers = [];
        
        // Réponse avec mauvaise terminaison
        const otherForms = tenseData.forms.filter((f, i) => i !== pronounIndex);
        wrongAnswers.push(...otherForms.slice(0, 2));
        
        // Si pas assez, générer des variations
        if (wrongAnswers.length < 3) {
            wrongAnswers.push(correctAnswer.replace(/s$/, ''));
            wrongAnswers.push(correctAnswer + 's');
        }
        
        // Mélanger les réponses
        const allAnswers = [correctAnswer, ...wrongAnswers.slice(0, 3)];
        const shuffled = allAnswers.sort(() => Math.random() - 0.5);
        
        return {
            verb: verb,
            tense: tense,
            pronoun: pronoun,
            correctAnswer: correctAnswer,
            answers: shuffled
        };
    }

    // Démarrer le jeu
    start() {
        this.timeLeft = this.duration;
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.questions = [];
        this.isPlaying = true;
        
        this.currentQuestion = this.generateQuestion();
        
        // Démarrer le timer
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            
            if (this.timeLeft <= 0) {
                this.end();
            }
        }, 1000);
        
        return this.currentQuestion;
    }

    // Vérifier une réponse
    checkAnswer(answer) {
        if (!this.isPlaying) return null;
        
        const correct = answer === this.currentQuestion.correctAnswer;
        
        if (correct) {
            this.combo++;
            this.maxCombo = Math.max(this.maxCombo, this.combo);
            
            // Score avec multiplicateur de combo
            const basePoints = 10;
            const comboBonus = Math.min(this.combo - 1, 5) * 2; // Max +10 points
            this.score += basePoints + comboBonus;
            
            // Enregistrer la réussite
            this.adaptiveLearning.recordReview(
                this.currentQuestion.verb,
                this.currentQuestion.tense,
                5
            );
        } else {
            this.combo = 0;
            
            // Enregistrer l'erreur
            this.adaptiveLearning.recordReview(
                this.currentQuestion.verb,
                this.currentQuestion.tense,
                1
            );
        }
        
        this.questions.push({
            ...this.currentQuestion,
            userAnswer: answer,
            correct: correct
        });
        
        // Générer la question suivante
        this.currentQuestion = this.generateQuestion();
        
        return {
            correct: correct,
            combo: this.combo,
            score: this.score
        };
    }

    // Terminer le jeu
    end() {
        this.isPlaying = false;
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        const results = {
            score: this.score,
            totalQuestions: this.questions.length,
            correct: this.questions.filter(q => q.correct).length,
            maxCombo: this.maxCombo,
            accuracy: this.questions.length > 0 ? 
                Math.round((this.questions.filter(q => q.correct).length / this.questions.length) * 100) : 0
        };
        
        // Mettre à jour le streak
        this.adaptiveLearning.updateStreak();
        
        return results;
    }

    // Obtenir l'état actuel
    getState() {
        return {
            timeLeft: this.timeLeft,
            score: this.score,
            combo: this.combo,
            question: this.currentQuestion,
            isPlaying: this.isPlaying
        };
    }
}

// ==================== MEMORY MATCH ====================
class MemoryMatchGame {
    constructor(adaptiveLearning, verbDatabase) {
        this.adaptiveLearning = adaptiveLearning;
        this.verbDatabase = verbDatabase;
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.startTime = null;
        this.isPlaying = false;
        this.pairCount = 6; // Nombre de paires
    }

    // Générer les cartes
    generateCards() {
        this.cards = [];
        
        const verbs = this.adaptiveLearning.getVerbsByLevel(this.verbDatabase, this.pairCount);
        const tenses = this.adaptiveLearning.getTensesByLevel();
        
        // Créer des paires (infinitif + conjugaison)
        verbs.forEach((verb, index) => {
            const tense = tenses[Math.floor(Math.random() * tenses.length)];
            const pronouns = ['je', 'tu', 'il/elle/on'];
            const pronoun = pronouns[Math.floor(Math.random() * pronouns.length)];
            const pronounIndex = pronouns.indexOf(pronoun);
            
            const verbData = this.verbDatabase[verb];
            if (!verbData || !verbData.conjugations[tense]) return;
            
            const conjugation = verbData.conjugations[tense].forms[pronounIndex];
            
            // Carte 1: Question
            this.cards.push({
                id: index * 2,
                pairId: index,
                type: 'question',
                content: `${pronoun}\n${verb}`,
                verb: verb,
                tense: tense,
                flipped: false,
                matched: false
            });
            
            // Carte 2: Réponse
            this.cards.push({
                id: index * 2 + 1,
                pairId: index,
                type: 'answer',
                content: conjugation,
                verb: verb,
                tense: tense,
                flipped: false,
                matched: false
            });
        });
        
        // Mélanger les cartes
        this.cards.sort(() => Math.random() - 0.5);
    }

    // Démarrer le jeu
    start() {
        this.generateCards();
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.startTime = new Date();
        this.isPlaying = true;
        
        return this.cards;
    }

    // Retourner une carte
    flipCard(cardId) {
        if (!this.isPlaying) return null;
        
        const card = this.cards.find(c => c.id === cardId);
        
        // Vérifications
        if (!card || card.flipped || card.matched || this.flippedCards.length >= 2) {
            return null;
        }
        
        // Retourner la carte
        card.flipped = true;
        this.flippedCards.push(card);
        
        // Si 2 cartes retournées, vérifier la paire
        if (this.flippedCards.length === 2) {
            this.moves++;
            
            const [card1, card2] = this.flippedCards;
            const isMatch = card1.pairId === card2.pairId;
            
            if (isMatch) {
                // Paire trouvée !
                card1.matched = true;
                card2.matched = true;
                this.matchedPairs++;
                
                // Enregistrer la réussite
                this.adaptiveLearning.recordReview(card1.verb, card1.tense, 5);
                
                this.flippedCards = [];
                
                // Vérifier si le jeu est terminé
                if (this.matchedPairs === this.pairCount) {
                    return this.end();
                }
                
                return {
                    match: true,
                    cards: [card1, card2],
                    matchedPairs: this.matchedPairs,
                    moves: this.moves
                };
            } else {
                // Pas de match - retourner les cartes après un délai
                return {
                    match: false,
                    cards: [card1, card2],
                    moves: this.moves
                };
            }
        }
        
        return { cardFlipped: card };
    }

    // Réinitialiser les cartes non matchées
    resetFlippedCards() {
        this.flippedCards.forEach(card => {
            if (!card.matched) {
                card.flipped = false;
            }
        });
        this.flippedCards = [];
    }

    // Terminer le jeu
    end() {
        this.isPlaying = false;
        
        const endTime = new Date();
        const duration = Math.floor((endTime - this.startTime) / 1000); // secondes
        
        // Calculer le score (moins de coups et moins de temps = meilleur)
        const minMoves = this.pairCount; // Minimum de coups possibles
        const efficiency = Math.max(0, 100 - ((this.moves - minMoves) * 5));
        const timeBonus = Math.max(0, 100 - duration);
        const score = Math.round((efficiency + timeBonus) / 2);
        
        const results = {
            completed: true,
            moves: this.moves,
            duration: duration,
            score: score,
            accuracy: Math.round((this.pairCount / this.moves) * 100)
        };
        
        // Mettre à jour le streak
        this.adaptiveLearning.updateStreak();
        
        return results;
    }

    // Obtenir l'état actuel
    getState() {
        return {
            cards: this.cards,
            flippedCards: this.flippedCards,
            matchedPairs: this.matchedPairs,
            moves: this.moves,
            isPlaying: this.isPlaying
        };
    }
}

// ==================== CONJUGATION BUILDER ====================
class ConjugationBuilderGame {
    constructor(adaptiveLearning, verbDatabase) {
        this.adaptiveLearning = adaptiveLearning;
        this.verbDatabase = verbDatabase;
        this.currentChallenge = null;
        this.score = 0;
        this.round = 0;
        this.maxRounds = 5;
    }

    // Générer un défi
    generateChallenge() {
        const verbs = this.adaptiveLearning.getVerbsByLevel(this.verbDatabase, 5);
        const tenses = this.adaptiveLearning.getTensesByLevel();
        
        const verb = verbs[Math.floor(Math.random() * verbs.length)];
        const tense = tenses[Math.floor(Math.random() * tenses.length)];
        
        const pronouns = ['je', 'tu', 'il/elle/on', 'nous', 'vous', 'ils/elles'];
        const pronoun = pronouns[Math.floor(Math.random() * pronouns.length)];
        const pronounIndex = pronouns.indexOf(pronoun);
        
        const verbData = this.verbDatabase[verb];
        if (!verbData || !verbData.conjugations[tense]) {
            return this.generateChallenge();
        }
        
        const correctAnswer = verbData.conjugations[tense].forms[pronounIndex];
        
        // Décomposer la conjugaison en blocs
        // Ex: "je parle" → ["je", "parl", "e"]
        const blocks = this.decomposeConjugation(verb, correctAnswer, pronoun);
        
        return {
            verb: verb,
            tense: tense,
            pronoun: pronoun,
            correctAnswer: correctAnswer,
            blocks: blocks,
            shuffledBlocks: [...blocks].sort(() => Math.random() - 0.5)
        };
    }

    // Décomposer une conjugaison en blocs
    decomposeConjugation(verb, conjugation, pronoun) {
        // Séparer le pronom de la conjugaison
        const withoutPronoun = conjugation.replace(pronoun, '').trim();
        
        // Trouver le radical et la terminaison
        const radical = verb.endsWith('er') ? verb.slice(0, -2) : 
                       verb.endsWith('ir') ? verb.slice(0, -2) :
                       verb.endsWith('re') ? verb.slice(0, -2) : verb;
        
        // Essayer de diviser intelligemment
        const blocks = [];
        
        blocks.push(pronoun);
        
        if (withoutPronoun.startsWith(radical)) {
            blocks.push(radical);
            blocks.push(withoutPronoun.substring(radical.length));
        } else {
            // Verbe irrégulier - diviser approximativement
            const mid = Math.floor(withoutPronoun.length / 2);
            blocks.push(withoutPronoun.substring(0, mid));
            blocks.push(withoutPronoun.substring(mid));
        }
        
        return blocks.filter(b => b.length > 0);
    }

    // Démarrer le jeu
    start() {
        this.score = 0;
        this.round = 0;
        this.currentChallenge = this.generateChallenge();
        return this.currentChallenge;
    }

    // Vérifier la construction
    checkConstruction(userBlocks) {
        const userAnswer = userBlocks.join(' ');
        const correct = userAnswer === this.currentChallenge.correctAnswer;
        
        if (correct) {
            this.score += 10;
            
            this.adaptiveLearning.recordReview(
                this.currentChallenge.verb,
                this.currentChallenge.tense,
                5
            );
        } else {
            this.adaptiveLearning.recordReview(
                this.currentChallenge.verb,
                this.currentChallenge.tense,
                2
            );
        }
        
        return {
            correct: correct,
            userAnswer: userAnswer,
            correctAnswer: this.currentChallenge.correctAnswer
        };
    }

    // Passer au défi suivant
    nextChallenge() {
        this.round++;
        
        if (this.round >= this.maxRounds) {
            return this.getResults();
        }
        
        this.currentChallenge = this.generateChallenge();
        return this.currentChallenge;
    }

    // Obtenir les résultats
    getResults() {
        const accuracy = Math.round((this.score / (this.maxRounds * 10)) * 100);
        
        return {
            completed: true,
            score: this.score,
            rounds: this.round,
            accuracy: accuracy
        };
    }
}

// Export
window.SpeedRunGame = SpeedRunGame;
window.MemoryMatchGame = MemoryMatchGame;
window.ConjugationBuilderGame = ConjugationBuilderGame;
