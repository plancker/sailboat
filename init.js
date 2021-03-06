// Getting current task id
let TASKS = {lastAssignedId: 0};
// var HISTORY = {};
let CTASKID = 0;
chrome.storage.local.set({"CTASKID": 0});

const taskToWindow = {};

const tabIdToURL = {};
const activeTabId = 0;

const backgroundPageId = -1;


// Initializing lunr index for archived pages.
var lunrIndex;
var archivedDocs = [];

chrome.storage.local.get('Page Content', function (pageContent) {
    pageContent = pageContent['Page Content'];
    for (var url in pageContent) {
        var doc = {};
        doc['url'] = url;
        doc['content'] = pageContent[url];
        archivedDocs.push(doc);
    }

    lunrIndex = elasticlunr(function () {
       this.setRef('url');
       this.addField('content');
    });

    for (var i = 0; i < archivedDocs.length; i++) {
        lunrIndex.addDoc(archivedDocs[i]);
    }
});


chrome.storage.local.get("TASKS", function (taskObject) {
    if (taskObject["TASKS"]) {
        TASKS = taskObject["TASKS"];//On retreiving TASKS from chrome storage, one gets an object {TASKS: balhah}, to retreive the actual array call taskObject["TASKS"]

        for (taskId in TASKS) { //Mark all tasks as inactive, this needs to be done here because there is no way of marking tasks as inactive when the browser closes.
            if (taskId != "lastAssignedId" && taskId != 0) {
                TASKS[taskId].isOpen = false;
            }
        }

        chrome.storage.local.set({"TASKS": TASKS});
    }
});

reloadSailboatTabs();

// chrome.storage.local.get(historyFieldName, function(historyObj){
//   if(historyObj[historyFieldName]){
//     HISTORY = historyObj[historyFieldName];
//   }
// });

chrome.storage.local.get("Page Content", function (e) {
    if (isEmpty(e)) {
        chrome.storage.local.set({"Page Content": {}});
    }
});

chrome.storage.local.get("Collections", function (e) {
    if (isEmpty(e)) {
        chrome.storage.local.set({"Collections": {'Books': {}, 'Movies': {}, 'People': {}, 'Places': {}}});
    }
});

chrome.storage.local.get("highlightIdx", function (e) {
    if (isEmpty(e)) {
        chrome.storage.local.set({"highlightIdx": 0});
    }
});

chrome.storage.local.get("Text Log", function (e) {
    if (isEmpty(e)) {
        chrome.storage.local.set({"Text Log": {}});
    }
});

chrome.storage.local.get("Tags", function (e) {
    if (isEmpty(e)) {
        chrome.storage.local.set({"Tags": {}});
    }
});

chrome.storage.local.get("Click Log", function (e) {
    if (isEmpty(e)) {
        chrome.storage.local.set({"Click Log": {}});
    }
});
//
// chrome.storage.local.get("Report Snapshots", function (e) {
//     if (isEmpty(e)) {
//         chrome.storage.local.set({"Report Snapshots": {}});
//     }
// });
//
// chrome.storage.local.get("Report Switches", function (e) {
//     if (isEmpty(e)) {
//         chrome.storage.local.set({"Report Switches": {}});
//     }
// });
//
// chrome.storage.local.get("Report Views", function (e) {
//     if (isEmpty(e)) {
//         chrome.storage.local.set({"Report Views": {}});
//     }
// });

chrome.storage.local.get("Report Clicks", function (e) {
    if (isEmpty(e)) {
        chrome.storage.local.set({
            "Report Clicks": {
                'SB results clicks': 0,
                'Open Archived Pages': 0,
                'Export JSON': 0,
                'Restore JSON': 0
            }
        });
    }
});


chrome.storage.local.get("Settings", function (e) {
    if (isEmpty(e)) {
        const DEFAULT_SETTINGS = {
            "notifications": "Enabled",
            "suggestions based on": "Open tabs",
            "suggestions threshold": "Medium",
            "block notifications on": ["www.google.com", "www.google.co.in", "www.facebook.com"],
            "isDockCollapsed": "false"
        };

        // Setting default settings in local storage.
        chrome.storage.local.set({"Settings": DEFAULT_SETTINGS}, function () {
            // console.log("Settings object initialised in local storage.");
        })
    }
});

chrome.storage.local.get("Advanced Search Settings", function (e) {
    if (isEmpty(e)) {
        const defaultAdvSearchSettings = {
            "search in": "Open tabs"
        };
        chrome.storage.local.set({"Advanced Search Settings": defaultAdvSearchSettings}, function () {
            // console.log("Advanced search settings initialised.");
        })
    }
});

chrome.storage.local.get("Debug Stopwords", function (e) {
    if (isEmpty(e)) {
        chrome.storage.local.set({"Debug Stopwords": []}, function () {
            // console.log("Debug stopwords initialised.");
        })
    }
});

function isEmpty(obj) {
    for (let prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
}

const sessionId = new Date().getTime();

chrome.storage.local.get("sailboatInitialised", function (response) {
    if (isEmpty(response)) {
        chrome.bookmarks.getTree(function (bookmarks) {
            TASKS[CTASKID].bookmarks = bookmarks;
            console.log("Bookmarks saved to default");
            updateStorage("TASKS", TASKS);
            updateStorage("sailboatInitialised", "true");
        });
    }
});

const trackerDownloads = 'tracker-' + sessionId + "-downloads";
const trackerTabActivate = 'tracker-' + sessionId + "-tab-activate";
const trackerTabCreate = 'tracker-' + sessionId + "-tab-create";
const trackerTabRemove = 'tracker-' + sessionId + "-tab-remove";

chrome.storage.local.get(trackerDownloads, function (e) {
    if (isEmpty(e)) {
        let obj = {};
        obj[trackerDownloads] = {};
        chrome.storage.local.set(obj);
    }
});

chrome.storage.local.get(trackerTabActivate, function (e) {
    if (isEmpty(e)) {
        let obj = {};
        obj[trackerTabActivate] = {};
        chrome.storage.local.set(obj);
    }
});

chrome.storage.local.get(trackerTabCreate, function (e) {
    if (isEmpty(e)) {
        let obj = {};
        obj[trackerTabCreate] = {};
        chrome.storage.local.set(obj);
    }
});

chrome.storage.local.get(trackerTabRemove, function (e) {
    if (isEmpty(e)) {
        let obj = {};
        obj[trackerTabRemove] = {};
        chrome.storage.local.set(obj);
    }
});