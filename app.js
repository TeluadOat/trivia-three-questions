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
const container = document.querySelector('#container');
const header = document.querySelector('header');
const quizContainer = document.querySelector('#quiz-container');
const easy = document.querySelector('#difficulty-level-easy'); // (not yet used)

// Quiz state
let current = 0;
let score = 0;
const userAnswers = new Array(questions.length).fill(null);


// Start quiz on form submit
startForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    quizContainer.innerHTML = `<p>Loading questions...</p>`;
    await getQuestions();
    showQuestions();
});

function showQuestions() {
    quizContainer.innerHTML = '';
    quizContainer.classList.remove('quiz-container');

    //question position
    const q = questions[current];

    // Create form and layout
    const questionForm = document.createElement('form');
    const questionDisplay = document.createElement('p');
    const nextButton = document.createElement('button');

    questionDisplay.textContent = q.quest;
    questionDisplay.id = 'questionBox';


    nextButton.textContent = 'Next';
    nextButton.classList.add('btn');

    nextButton.id = 'next-button'
    questionForm.id = 'question-form';



    // Build question structure

    // header.insertAdjacentElement("afterend", questionForm)
    questionForm.append(questionDisplay);

    q.options.forEach((option, i) => {
        const optionsText = document.createElement('button');
        optionsText.classList.add('btn', 'options');
        optionsText.dataset.value = i;
        optionsText.innerText = option;
        optionsText.type = 'button';

        questionForm.append(optionsText);

    });

    if (userAnswers[current] !== null) {
        const previousSelected = questionForm.querySelector(`.options[data-value="${userAnswers[current]}"]`);

        if (previousSelected) {
            previousSelected.classList.add('checked');
        }
    };

    header.insertAdjacentElement('afterend', questionForm);

    //listener to the answer options buttons
    questionForm.addEventListener('click', (e) => {
        if (e.target.classList.contains('options')) {
            document.querySelectorAll('.options').forEach(btn =>
                btn.classList.remove('checked'));
            e.target.classList.add('checked');
        }
    })

    questionForm.append(nextButton);

    // Back button (if not first question)
    if (current > 0) {
        const backButton = document.createElement('button');
        backButton.innerText = 'Back';
        backButton.classList.add('btn');

        backButton.addEventListener('click', (e) => {
            e.preventDefault();
            current -= 1;
            score -= userAnswers[current] === questions[current].answer ? 1 : 0;
            questionForm.remove();
            showQuestions();
        });

        questionForm.append(backButton);
        backButton.id = 'back-button'
    }



    //listening to nextButtom
    nextButton.addEventListener('click', (e) => {
        e.preventDefault();

        const selected = document.querySelector('.options.checked');

        if (selected) {
            userAnswers[current] = Number(selected.dataset.value);

            if (Number(selected.dataset.value) === q.answer) {
                score++;
            }
        }
        console.log(userAnswers);
        current++;

        if (current < questions.length) {
            questionForm.remove();
            showQuestions();
        } else {
            questionForm.innerHTML = `<p id="result-para">Score: ${score}/${questions.length}</p>`;

            const resetButton = document.createElement('a');
            resetButton.href = 'index2.html';
            resetButton.textContent = 'Go Back To Start Page';
            resetButton.classList.add('btn');
            resetButton.id = 'reset-button';
            questionForm.append(resetButton);
        }
    });



}

