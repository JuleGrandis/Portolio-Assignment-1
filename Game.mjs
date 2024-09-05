//#region Don't look behind the curtain
// Do not worry about the next two lines, they just need to be there. 
import * as readlinePromises from 'node:readline/promises';
const rl = readlinePromises.createInterface({ input: process.stdin, output: process.stdout });

async function askQuestion(question) {
    return await rl.question(question);
}

//#endregion

import { ANSI } from './ansi.mjs';
import { HANGMAN_UI } from './graphics.mjs';
import { WORD_LIST } from './words.mjs';

let isGameOver = false;
while (isGameOver == false){ 

function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * WORD_LIST.length);
    return WORD_LIST[randomIndex];
}

const correctWord = getRandomWord().toLowerCase();
const numberOfCharInWord = correctWord.length;

let guessedWord = "".padStart(correctWord.length, "_");
let wordDisplay = "";
let wasGuessCorrect = false;
let wrongGuesses = [];
let totalGuesses = 0;

function drawWordDisplay() {

    wordDisplay = "";

    for (let i = 0; i < numberOfCharInWord; i++) {
        if (guessedWord[i] != "_") {
            wordDisplay += ANSI.COLOR.GREEN;
        }
        wordDisplay = wordDisplay + guessedWord[i] + " ";
        wordDisplay += ANSI.RESET;
    }

    return wordDisplay;
}

function drawList(list, color) {
    let output = color;
    for (let i = 0; i < list.length; i++) {
        output += list[i] + " ";
    }

    return output + ANSI.RESET;
    
}
 
while (isGameOver == false) {

    console.log(ANSI.CLEAR_SCREEN);
    console.log(drawWordDisplay());
    console.log(drawList(wrongGuesses, ANSI.COLOR.RED));
    console.log(HANGMAN_UI[wrongGuesses.length]);

    const answer = (await askQuestion("Guess a char or the word : ")).toLowerCase();
    if (answer == correctWord) {
        isGameOver = true;
        wasGuessCorrect = true;
    } else if (ifPlayerGuessedLetter(answer)) {

        let org = guessedWord;
        guessedWord = "";
        totalGuesses++;

        let isCorrect = false;
        for (let i = 0; i < correctWord.length; i++) {
            if (correctWord[i] == answer) {
                guessedWord += answer;
                isCorrect = true;
            } else { 
                guessedWord += org[i];
            }
        }

        if (!isCorrect) {
            wrongGuesses.push(answer);
        } else if (guessedWord == correctWord) {
            isGameOver = true;
            wasGuessCorrect = true;
        }
    }

    if (wrongGuesses.length == HANGMAN_UI.length - 1) {
        isGameOver = true;
    }





console.log(ANSI.CLEAR_SCREEN);
console.log(drawWordDisplay());
console.log(drawList(wrongGuesses, ANSI.COLOR.RED));
console.log(HANGMAN_UI[wrongGuesses.length]);

if (wasGuessCorrect) {
    console.log(ANSI.COLOR.YELLOW + "Congratulations! You did it!");
    console.log("Your Total Guesses: " + totalGuesses);
    } else {
        wasGuessCorrect = false;
        console.log(ANSI.COLOR.RED + "Game Over. The Correct Word Was: " + ANSI.COLOR.GREEN + correctWord);
        console.log(ANSI.RESET, "You've Lost, Better luck next time.");
        console.log("Your Total Guesses: " + totalGuesses);
    }
}

const answer = (await askQuestion(ANSI.COLOR.BLUE + "Do you wish to play again? (Yes/No) :")).toLowerCase();
if (answer == 'yes') {
    isGameOver = false;
} else {
    answer == 'no';
    console.log(ANSI.COLOR.BLUE + "Thanks for Playing!");
    isGameOver = true;
    process.exit();
}

function ifPlayerGuessedLetter(answer){
    return answer.length == 1;
}
}
