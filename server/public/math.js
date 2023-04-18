export default class Maths {
    constructor(calculation, proc) {
        this.answerbody = {
            question: this.question,
            answer: this.answer
        }
        let question = [];
        let numerator = Math.floor(Math.random()*11);
        let denominator = Math.floor(Math.random()*11) + Math.floor(Math.random()*6);
        let denominator2 = Math.floor(Math.random()*21);
        let answer = 0;
        let answerbody = [];
        if (numerator < denominator) {
            numerator += 7;
        }
        if (numerator < denominator2) {
            numerator += 10;
        }
        // ADDITION
        if (calculation === 'add') {
            if (proc) {
                question.push(`${numerator} + ${denominator} + ${denominator2} = `);
                answer = numerator + denominator + denominator2;
            } else if (!proc) {
                question.push(`${numerator} + ${denominator} = `);
                answer = numerator + denominator;
            }
            return answerbody = [question, answer]
            
        // SUBTRACTION
        } else if (calculation === 'sub') {
            if (numerator <= denominator) { numerator += 15 };
            if (numerator <= denominator2) { numerator += 30 };
            if (proc) {
                question.push(`${numerator} - ${denominator} - ${denominator2} = `);
                answer = numerator - denominator - denominator2;
            } else if (!proc) {
                question.push(`${numerator} - ${denominator} = `);
                answer = numerator - denominator;
            }
            return answerbody = [question, answer]
        // MULTIPLICATION
        } else if (calculation === 'multi') {
            if (numerator >= 16) {
                numerator -= 15;
            }
            if (proc) {
                question.push(`${numerator} x ${denominator} = `);
                answer = numerator * denominator;
            } else if (!proc) {
                question.push(`${numerator} x ${denominator2} = `);
                answer = numerator * denominator2;
            }
            return answerbody = [question, answer]
        // ADDITION MULTIPLICATION SUBTRACTION
        } else if (calculation === 'mix') {
            if (proc) {
                question.push(`${numerator} x ${denominator} + ${denominator2} = `);
                answer = (numerator * denominator + denominator2);
            } else if (!proc) {
                question.push(`${numerator} + ${denominator} - ${denominator2} = `);
                answer = (numerator + denominator - denominator2);
            }
            return answerbody = [question, answer]
        }

    } 
}
export let correct = [];
export function newQuestion (option1, option2) {
    document.getElementById('play-status').classList.remove('status-fade');
    let choice1 = options[Math.floor(Math.random()*option1.length)];
    let choice2 = valid[Math.floor(Math.random()*option2.length)];
    let newAnswer = new Maths (choice1, choice2);
    correct = newAnswer[1];
    document.getElementById('play-question').innerHTML = newAnswer[0];
}
export const options = [
    'add',
    'sub',
    'multi',
    'mix'
];
export const valid = [
    true,
    true,
    false,
    false,
    false, 
    false,
    false,
];
// setInterval(newQuestion(options), 5000);
// } 

