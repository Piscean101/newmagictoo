import Maths from '/math.js';
import { newQuestion, options, valid, correct } from '/math.js';

let time = 6;
document.addEventListener('DOMContentLoaded', () => {
let playoverlay = document.getElementById('play-overlay');
playoverlay.addEventListener('click', () => {
playoverlay.className = 'fade';
newQuestion(options, valid);
setInterval(countdown, 1000);
    function countdown () {    
        if (time === 0) {
            newQuestion(options, valid);
            time += 6;
        }    
        time --;
        playoverlay.innerHTML = time;
    }
})
const submit = document.getElementById('play-submit');
const input = document.getElementById('play-input');
const playstatus = document.getElementById('play-status');
submit.addEventListener('click', (e) => {
    e.preventDefault();
    let valuetest = input.value;
    if (!valuetest) {
        newQuestion(options,valid);
    }
    if (valuetest != correct) {
        playstatus.innerHTML = 'You was Wrong'
    } else (
        playstatus.innerHTML = 'Correct!'
    )
    input.value = '';
    playstatus.classList.add('status-fade');
}, false)
});
console.log('boope');

