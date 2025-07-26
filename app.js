

/*let current = 0;
let score = 0;

function showQuestion() {
    const q = questions[current];
    document.querySelector('#question').textContent = q.question;
    const optionsEl = document.querySelector("#options");
    optionsEl.innerHTML = '';

    q.options.forEach((option, i) => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.textContent = option;
        btn.addEventListener('click', function (e) {
            if (i === q.answer) score++;
            current++;
            if (current < questions.length) {
                showQuestion();
            } else {
                document.querySelector('#quiz-container').innerHTML = `<h2>All Done!</h2><p>Your score: ${score}/${questions.length}</p>`;
            }
        });
        li.append(btn);
        optionsEl.appendChild(li)
    });
}
showQuestion();*/



const questions = [
    {
        question: 'What does the term "CPU" stand for?',
        options: ['Central Processing Unit', 'Computer Processing Utility', 'Control Panel Unit', 'Central Power Unit'],
        answer: 0
    },
    {
        question: 'Which of the following is an example of a high-level programming language?',
        options: ['Machine Code', 'Assembly', 'Python', 'Binary'],
        answer: 2
    },
    {
        question: 'What is the primary function of an operating system?',
        options: ['Manage hardware and software resources', 'Run antivirus programs', 'Provide internet access', 'Compile source code'],
        answer: 0
    }
];

const startForm = document.querySelector('#selections')
// const startButton = document.querySelector('start-button')
const quizContainer = document.querySelector('#quiz-container');
const easy = document.querySelector('#difficulty-level-easy');


let current = 0;
let score = 0;
startForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showQuestions();
});

function showQuestions() {
    quizContainer.style.fontSize = '1.5rem'
    quizContainer.innerHTML = '';
    const q = questions[current];
    const questionForm = document.createElement('form');
    const questionContainer = document.createElement('fieldset');
    const askedQuestion = document.createElement('legend');
    const nextButton = document.createElement('button');
    askedQuestion.textContent = `${current + 1}. ${q.question}`;
    nextButton.textContent = 'Next'
    nextButton.classList.add('btn')


    quizContainer.append(questionForm);
    questionForm.append(questionContainer);
    questionContainer.append(askedQuestion);


    q.options.forEach((option, i) => {
        const label = document.createElement('label')
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'options';
        input.value = i;
        const optionsText = document.createElement('span');
        optionsText.innerText = option;
        label.append(input, optionsText);
        questionContainer.append(label);
        label.classList.add('label-op');

    });
    questionContainer.classList.add('flex-display');


    questionForm.append(nextButton);

    nextButton.addEventListener('click', (e) => {
        e.preventDefault();
        const selected = questionForm.elements.options.value
        if (parseInt(selected) === q.answer) {
            score++;
        }
        current++;
        if (current < questions.length) {
            showQuestions();
        } else {
            quizContainer.innerHTML = `<p>Score: ${score}/${questions.length}</p>`;

        }
    })
}

