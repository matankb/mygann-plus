import registerModule from '~/core/module';
import { UnloaderContext } from '~/core/module-loader';

import { waitForLoad, addEventListener, insertCss } from '~/utils/dom';

import style from './style.css';

const selectors = {
  hiddenMyDayMenu: style.locals['hidden-my-day-menu'],
};

interface Page {
  key: string;
  name: string;
  hash: string;
}

const pageTypes: { [page: string]: Page } = {
  progress: {
    key: 'progress',
    name: 'Progress',
    hash: '#studentmyday/progress',
  },
  schedule: {
    key: 'schedule',
    name: 'Schedule',
    hash: '#studentmyday/schedule',
  },
  assignmentCenter: {
    key: 'assignmentCenter',
    name: 'Assignment Center',
    hash: '#studentmyday/assignment-center',
  },
  courseRequests: {
    key: 'courseRequests',
    name: 'Course Requests',
    hash: '#studentmyday/course-requests',
  },
};

function getPageHash(key: string) {
  for (const page in pageTypes) {
    if (pageTypes[page].key === key) {
      return pageTypes[page].hash;
    }
  }
}

const domQuery = {
  myDayHeader: () => document.querySelector('#topnav-containter .topnav .first .sky-nav'),
  myDayMenu: () => document.querySelector('#topnav-containter .topnav .first .subnav'),
};

async function myDayShortcutMain(
  suboptions: MyDayShortcutSuboptions,
  unloaderContext: UnloaderContext,
) {
  const styles = insertCss(style.toString());
  unloaderContext.addRemovable(styles);

  const myDayHeader = await waitForLoad(domQuery.myDayHeader);
  const myDayMenu = await waitForLoad(domQuery.myDayMenu);

  const clickListener = addEventListener(myDayHeader, 'click', () => {
    window.location.hash = getPageHash(suboptions.page);
  });
  if (suboptions.hideMenu) {
    myDayMenu.classList.add(selectors.hiddenMyDayMenu);
  }
  unloaderContext.addRemovable(clickListener);
}

function unloadMyDayShortcut(suboptions: MyDayShortcutSuboptions) {
  if (suboptions.hideMenu) {
    const myDayMenu = domQuery.myDayMenu();
    myDayMenu.classList.remove(selectors.hiddenMyDayMenu);
  }
}

interface MyDayShortcutSuboptions {
  page: string;
  hideMenu: string;
}

export default registerModule('{50310672-9670-48a4-8261-2868a426ace6}', {
  name: 'My Day Shortcut',
  description: 'Go directly to a My Day page by clicking on the My Day header',
  init: myDayShortcutMain,
  unload: unloadMyDayShortcut,
  defaultEnabled: false,
  suboptions: {
    page: {
      name: 'Page',
      type: 'enum',
      defaultValue: pageTypes.assignmentCenter.key,
      enumValues: {
        [pageTypes.progress.key]: pageTypes.progress.name,
        [pageTypes.schedule.key]: pageTypes.schedule.name,
        [pageTypes.assignmentCenter.key]: pageTypes.assignmentCenter.name,
        [pageTypes.courseRequests.key]: pageTypes.courseRequests.name,
      },
    },
    hideMenu: {
      name: 'Hide My Day Menu',
      type: 'boolean',
      defaultValue: false,
    },
  },
});
