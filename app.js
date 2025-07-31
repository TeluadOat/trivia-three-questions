
// const questions = [
//     {
//         question: 'What does the term "CPU" stand for?',
//         options: [
//             'Central Processing Unit',
//             'Computer Processing Utility',
//             'Control Panel Unit',
//             'Central Power Unit'
//         ],
//         answer: 0
//     },
//     {
//         question: 'Which of the following is an example of a high-level programming language?',
//         options: ['Machine Code', 'Assembly', 'Python', 'Binary'],
//         answer: 2
//     },
//     {
//         question: 'What is the primary function of an operating system?',
//         options: [
//             'Manage hardware and software resources',
//             'Run antivirus programs',
//             'Provide internet access',
//             'Compile source code'
//         ],
//         answer: 0
//     }
// ];





const questions = [];

function getQuest(resolvedArray) {
    for (let i = 0; i < resolvedArray.length; i++) {
        const q = resolvedArray[i];
        const questdata = {
            ids: q.id,
            quest: q.question,
            options: [],
            answer: null
        };

        const answerKeyToText = q.answers;
        const correctAnswerFlags = q.correct_answers;

        const filteredKeys = [];
        for (const key in answerKeyToText) {
            if (answerKeyToText[key] !== null) {
                filteredKeys.push(key);
                questdata.options.push(answerKeyToText[key]);
            }
        }

        // Find the key where correct answer is "true"
        const correctKey = Object.keys(correctAnswerFlags).find(
            key => correctAnswerFlags[key] === "true"
        );

        // Match the key (e.g., 'answer_b') to its index in filteredKeys
        const correctAnswerIndex = filteredKeys.indexOf(correctKey.replace('_correct', ''));
        questdata.answer = correctAnswerIndex;

        questions.push(questdata);
    }
};



const getQuestions = async () => {
    try {
        const res = await axios.get("https://quizapi.io/api/v1/questions?apiKey=aR1QBNii2gc2aRHy50FPKCSzXWBhWzfNZ2CObd7D&category=html&difficulty=Easy&limit=10&tags=HTML&single_anwer_only=true");
        const questionData = await res.data;
        getQuest(questionData);
    }

    catch (e) {
        console.log('ERROR!', e)
    }
}



// DOM elements
const startForm = document.querySelector('#selections');
const quizContainer = document.querySelector('#quiz-container');
const easy = document.querySelector('#difficulty-level-easy'); // (Optional, not used)

// Quiz state
let current = 0;
let score = 0;
const userAnswers = new Array(questions.length).fill(null);

// Start quiz on form submit
startForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    quizContainer.innerHTML = `<p>Loading questions...</p>`
    await getQuestions();
    showQuestions();
});

function showQuestions() {
    quizContainer.style.fontSize = '1.5rem';
    quizContainer.innerHTML = '';

    const q = questions[current];

    // Create form and layout
    const questionForm = document.createElement('form');
    const questionContainer = document.createElement('fieldset');
    const askedQuestion = document.createElement('legend');
    const nextButton = document.createElement('button');

    askedQuestion.textContent = `${current + 1}. ${q.quest}`;
    nextButton.textContent = 'Next';
    nextButton.classList.add('btn');

    nextButton.id = 'next-button'
    questionForm.id = 'question-form';



    // Build question structure
    quizContainer.append(questionForm);
    questionForm.append(questionContainer);
    questionContainer.append(askedQuestion);

    q.options.forEach((option, i) => {
        const label = document.createElement('label');
        const input = document.createElement('input');
        const optionsText = document.createElement('span');

        input.type = 'radio';
        input.name = 'options';
        input.value = i;
        input.checked = userAnswers[current] === i;

        optionsText.innerText = option;

        label.classList.add('label-op');
        label.append(input, optionsText);
        questionContainer.append(label);
    });

    questionContainer.classList.add('flex-display');

    // Back button (if not first question)
    if (current > 0) {
        const backButton = document.createElement('button');
        backButton.innerText = 'Back';
        backButton.classList.add('btn');

        backButton.addEventListener('click', (e) => {
            e.preventDefault();
            current -= 1;
            score -= questions[current + 1] && userAnswers[current + 1] === questions[current + 1].answer ? 1 : 0;
            showQuestions();
        });

        questionForm.append(backButton);
        backButton.id = 'back-button'
    }

    questionForm.append(nextButton);

    nextButton.addEventListener('click', (e) => {
        e.preventDefault();

        const selected = questionForm.elements.options.value;

        if (selected !== '') {
            const selectedIndex = parseInt(selected);
            userAnswers[current] = selectedIndex;

            if (selectedIndex === q.answer) {
                score++;
            }
        }

        current++;

        if (current < questions.length) {
            showQuestions();
        } else {
            quizContainer.innerHTML = `<p>Score: ${score}/${questions.length}</p>`;

            const resetButton = document.createElement('a');
            resetButton.href = 'index.html';
            resetButton.textContent = 'Go Back To Start Page';
            resetButton.classList.add('btn');
            resetButton.id = 'reset-button';
            quizContainer.append(resetButton);
        }
    });
}





