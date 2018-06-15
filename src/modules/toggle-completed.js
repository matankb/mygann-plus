import { waitForLoad, constructButton } from '../utils/dom';
import registerModule from '../utils/module';

let hidden = false;
let button;

// TODO: Make default hidden a setting
// TODO: Make this work with inline-change-status

function constructParent(btn) {
  document.getElementsByClassName('pull-right assignment-calendar-button-bar')[0].appendChild(btn);
}

function simulateUserHide() {
  let table = document.querySelectorAll('.table.table-striped:not(.table-mobile-stacked)')[0];
  table.children[0].children[4].children[0].children[0].click();
  table.children[0].children[5].children[0].children[0].click();
  document.getElementById('btn-filter-apply').click();
}

function toggleButtonText() {
  hidden = !hidden;
  button.childNodes[1].nodeValue = hidden ? ' Hide Completed: On' : ' Hide Completed: Off';
  button.style.color = hidden ? '#51856f' : 'black';
}

function main() {
  document.getElementById('filter-status').click();
  try {
    simulateUserHide();
  } catch (e) {
    setTimeout(simulateUserHide, 10);
  }
  toggleButtonText();
}
function hide() {
  try {
    main();
  } catch (e) {
    // TODO: better error handling - this is leftover from bookmarklet!
    alert(`Error: ${e}`); // eslint-disable-line no-alert
    throw e; /* To inspect stack trace */
  }
}
function showUI() {
  button = constructButton(' Hide Completed: Off', 'gocp-toggle-completed', 'fa fa-check', hide);
  constructParent(button);
}
function toggleCompleted() {
  waitForLoad(() => (
    document.getElementsByClassName('pull-right assignment-calendar-button-bar')[0]
    && !document.getElementById('toggle-completed')
  ))
    .then(showUI);
}
export default registerModule('Toggle Completed Assignments', toggleCompleted);
