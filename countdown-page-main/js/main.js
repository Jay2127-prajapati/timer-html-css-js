const stopContinueButton = document.querySelector('#stop-continue');
const resetButton = document.querySelector('#reset');
const daysElement = document.querySelector('#days');
const hoursElement = document.querySelector('#hours');
const minutesElement = document.querySelector('#minutes');
const secondsElement = document.querySelector('#seconds');

let timerInterval = null;
let paused = getCookie('paused') === 'true'; // Check if the timer was paused from cookies
let elapsedTime = parseInt(getCookie('elapsedTime'), 10) || 0; // Get elapsed time from cookies

// Function to update the timer
const updateTimer = () => {
  if (!paused) {
    elapsedTime += 1000; // Increment elapsed time by 1 second

    const days = String(Math.floor(elapsedTime / (1000 * 60 * 60 * 24))).padStart(2, '0');
    const hours = String(Math.floor((elapsedTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
    const minutes = String(Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
    const seconds = String(Math.floor((elapsedTime % (1000 * 60)) / 1000)).padStart(2, '0');

    daysElement.innerText = days;
    hoursElement.innerText = hours;
    minutesElement.innerText = minutes;
    secondsElement.innerText = seconds;

    // Update elapsed time in cookies
    setCookie('elapsedTime', elapsedTime, 365);
  }
};

// Start the timer on load if it's not paused
window.onload = () => {
  updateTimer();
  if (!paused) {
    timerInterval = setInterval(updateTimer, 1000);
    stopContinueButton.textContent = 'Stop';
  } else {
    stopContinueButton.textContent = 'Continue';
  }
};

// Function to set a cookie
function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = 'expires=' + d.toUTCString();
  document.cookie = name + '=' + value + ';' + expires + ';path=/';
}

// Function to get a cookie value
function getCookie(name) {
  const cname = name + '=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');
  for (let i = 0; i < cookieArray.length; i++) {
    let c = cookieArray[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(cname) === 0) {
      return c.substring(cname.length, c.length);
    }
  }
  return '';
}

// Event Listener for Stop/Continue Button
stopContinueButton.addEventListener('click', () => {
  if (!paused) {
    paused = true;
    clearInterval(timerInterval);
    stopContinueButton.textContent = 'Continue';
  } else {
    paused = false;
    stopContinueButton.textContent = 'Stop';
    timerInterval = setInterval(updateTimer, 1000);
  }
  // Save paused state in cookies
  setCookie('paused', paused, 365);
});

// Event Listener for Reset Button
resetButton.addEventListener('click', () => {
  clearInterval(timerInterval);
  elapsedTime = 0;
  paused = false;
  stopContinueButton.textContent = 'Stop';
  setCookie('elapsedTime', elapsedTime, 365);
  setCookie('paused', paused, 365);
  updateTimer(); // Immediately update to show reset time
  timerInterval = setInterval(updateTimer, 1000);
});

// Initialize timer display on page load
updateTimer();
