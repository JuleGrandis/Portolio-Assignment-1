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
import { arrayBuffer } from 'stream/consumers';

const answerYes = "y"
const guessAWord = "Guess a char or the word : ";
const winText = "Congratulations! You did it!";
const totalGuessesText = "Your Total Guesses: ";
const loseText = "Game Over. The Correct Word Was: ";
const totalWinsText = "Total Wins: ";
const totalLossText = "Total Losses: ";
const replayText = "Do you wish to play again? (Y/N) :";
const exitText = "Thanks for Playing!";
const alreadyGuessed = "You've Already Guessed That. Try a Different Letter:" ;

let isGameOver = false;
let totalWins = 0;
let totalLosses = 0;

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
let uniqueErrors = new Set();
let totalGuesses = 0;
let repeatedLetter = [];
uniqueErrors = Array.from(uniqueErrors);

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
    console.log(drawList(uniqueErrors, ANSI.COLOR.RED));
    console.log(HANGMAN_UI[uniqueErrors.length + repeatedLetter.length]);

    const answer = (await askQuestion(guessAWord)).toLowerCase();

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
                if (org[i] == answer) {
                    isCorrect = false;
                    guessedWord += org[i];
                } else {
                    guessedWord += answer;
                    isCorrect = true;
                }
            } else { 
                guessedWord += org[i];
            }
        }

        if (!isCorrect && !uniqueErrors.includes(answer)) {
            uniqueErrors.push(answer);
        } else {
            repeatedLetter.push(answer);
        }
        
        if (guessedWord == correctWord) {
            isGameOver = true;
            wasGuessCorrect = true;
        }
    }

    if (uniqueErrors.length + repeatedLetter.length == HANGMAN_UI.length - 1) {
        isGameOver = true;
    }

    console.log(ANSI.CLEAR_SCREEN);
    console.log(drawWordDisplay());
    console.log(drawList(uniqueErrors, ANSI.COLOR.RED));
    console.log(HANGMAN_UI[repeatedLetter.length + uniqueErrors.length]);

    if (wasGuessCorrect) {
        console.log(ANSI.COLOR.YELLOW + winText);
        console.log(ANSI.RESET + totalGuessesText + totalGuesses);
    } else {
        wasGuessCorrect = false;
        console.log(ANSI.COLOR.RED + loseText + ANSI.COLOR.GREEN + correctWord);
        console.log(totalGuessesText + totalGuesses);
        console.log(ANSI.RESET);
    }
}

if (!wasGuessCorrect) {
    totalLosses++;
} else { 
    wasGuessCorrect == true;
    totalWins++;
}

console.log(totalWinsText + totalWins, totalLossText + totalLosses);

const answer = (await askQuestion(ANSI.COLOR.BLUE + replayText)).toLowerCase();

if (answer[0].toLowerCase() == answerYes) {
    isGameOver = false;
} else {
    console.log(exitText);
    console.log(ANSI.RESET);
    isGameOver = true;
    process.exit();
}

function ifPlayerGuessedLetter(answer){
    return answer.length == 1;
}
}
