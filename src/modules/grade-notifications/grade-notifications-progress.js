import classNames from 'classnames';

import { createElement, waitForLoad, constructButton } from '~/utils/dom';
import Dialog from '~/utils/dialog';

import { computeGradePercentage, observeCoursesBar, sanitizeAssignmentTitle } from '~/shared/progress';

import selectors from './selectors';

function openCourseDialog(courseName) {
  const courseTitles = Array.from(document.querySelectorAll('#coursesContainer h3'));
  const course = courseTitles.find(title => title.textContent.trim() === courseName);
  course.closest('.row').querySelector('.showGrade + .btn').click();
}

function generateDialogBody(assignments, dialog) {
  const handleAssignmentClick = assignment => {
    openCourseDialog(assignment.sectionName);
    dialog.close();
  };
  const tableHeader = (
    <thead>
      <tr>
        <th>Course</th>
        <th>Assignment</th>
        <th>Assigned</th>
        <th>Due</th>
        <th>Points</th>
      </tr>
    </thead>
  );
  return (
    <table className="table table-striped table-condensed table-mobile-stacked">
      { tableHeader }
      <tbody>
        {
          assignments.map(assignment => (
            <tr
              style={{ cursor: 'pointer' }}
              onClick={ () => handleAssignmentClick(assignment) }
            >
              <td className="col-md-3">{ assignment.sectionName}</td>
              <td data-heading="Assignment" className="col-md-3">
                { sanitizeAssignmentTitle(assignment.title) }
              </td>
              <td data-heading="Assigned" className="col-md-1">{ assignment.adate.split(' ')[0] }</td>
              <td data-heading="Due" className="col-md-1">{ assignment.ddate.split(' ')[0] }</td>
              <td data-heading="Points" className="col-md-2">
                <h4 style={{ margin: '0px' }}>{assignment.pointsEarned}
                  <span style={{ fontWeight: 200 }}>
                    /{assignment.maxPoints}&nbsp;
                    ({ computeGradePercentage(assignment.pointsEarned, assignment.maxPoints) }%)
                  </span>
                </h4>
              </td>
            </tr>
          ))
        }
      </tbody>
    </table>
  );
}

async function showDialog(gradedAssignments, onClear) {
  const dialogBody = dialog => generateDialogBody(gradedAssignments, dialog);
  const dialog = new Dialog('New Graded Assignments', dialogBody, {
    leftButtons: [
      {
        name: 'Clear Notifications',
        primary: true,
        onClick: onClear,
      },
      {
        name: 'Close',
        type: Dialog.buttonTypes.LINK,
      },
    ],
  });
  dialog.open();
}

const getCourseBar = () => document.querySelector('#coursesCollapse .row .col-md-12');

async function insertNewGradedButton(newGradedAssignments, unloaderContext, onClear) {
  if (!newGradedAssignments.length) {
    return;
  }
  const coursesBar = await waitForLoad(getCourseBar);
  const button = constructButton(
    'New Graded Assignments',
    '',
    '',
    () => showDialog(newGradedAssignments, onClear),
    classNames('pull-right primary', selectors.viewAssignmentsButton),
    { primary: true },
  );
  coursesBar.appendChild(button);
  unloaderContext.addRemovable(button);
}

export function removeNewGradedButton() {
  const button = document.querySelector(`.${selectors.viewAssignmentsButton}`);
  if (button) {
    button.remove();
  }
}

export default async function showNewGradedButton(newGradedAssignments, unloaderContext, onClear) {
  insertNewGradedButton(newGradedAssignments, unloaderContext, onClear);
  const observer = await observeCoursesBar(() => {
    insertNewGradedButton(newGradedAssignments, unloaderContext, onClear);
  });
  unloaderContext.addRemovable(observer);
}
