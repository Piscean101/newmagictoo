import Maths from '/math.js';
import { newQuestion, options, valid, correct } from '/math.js';

export let cashout = 0;
document.addEventListener('DOMContentLoaded', () => {
let time = 6;
let playoverlay = document.getElementById('play-overlay');
if (playoverlay.className === 'fade') { return }
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
const claimgold = document.getElementById('claim-gold');
const claim = document.getElementById('claim');
const hiddengold = document.getElementById('hidden-gold');
const counter = document.getElementById('counter');
const gemcount = document.getElementById('gem-count');
submit.addEventListener('click', (e) => {
    submit.style.visibility = 'hidden';
    e.preventDefault();
    let valuetest = input.value;
    if (!valuetest) {
        time = 1;
    }
    if (valuetest != correct) {
        playstatus.innerHTML = `Nice Try! The correct answer was ${correct}`;
        counter.value = 0;
    } else {
        cashout ++,
        playstatus.innerHTML = 'Correct!';
        document.getElementById('logout').style.display = 'none';
        setTimeout(document.getElementById('claim').classList.add('general-fade'), 3000);
        claimgold.innerHTML = cashout;
        hiddengold.value ++;
        counter.value ++;
        console.log(counter.value);
        if (time > 1) { 
            time = 1
        }
    }
    input.value = '';
    playstatus.classList.add('status-fade');
    if (counter.value >= 10) {
        gemcount.value ++;
        counter.value = 0;
        setTimeout(document.getElementById('gem-image').classList.add('image-fade'), 3000);
    }
}, false)
claim.addEventListener('click', (e) => {
})
});
console.log('boope');

