
//STUFF RELATED TO IMPORTING AND EXPORTING OF TASKS

$("#downloadTasks").click(function () {
    chrome.runtime.sendMessage({"type": "download-tasks"});
});

$("#restoreTasks").click(function () {
    chrome.runtime.sendMessage({"type": "restore-task-from-file"});
});

// function restoreTaskObjectFromFile()
function readSingleFile(fileInput) {
    let file = fileInput.target.files[0];
    if (!file) {
        return;
    }
    if (file.type == "application/json"){
      const reader = new FileReader();
      reader.onload = function (e) {
          const contents = e.target.result;
          restoreTasksFromString(contents);
      };
      reader.readAsText(file);
    }
    else{
      alert("Please upload a JSON file.")
    }

}

//Need some form of validation for string.
function restoreTasksFromString(string) {
    const tasks = JSON.parse(string);
    chrome.runtime.sendMessage({"type": "restore-tasks", "taskObject": tasks});
    const successIcon = $('<i style="color:#43ac6a">Tasks Restored</i>');
    $("#fileUploadMessage").append(successIcon);
}

document.getElementById('file-input').addEventListener('change', readSingleFile, false);



//TASK NOTIFICATIONS

//SWITCH NOTIFICATION

chrome.storage.local.get("task-switch-notification", function(value){
    if(value["task-switch-notification"]){
        document.getElementById('task-switch-notification').checked = value["task-switch-notification"]
    }
    else{
        document.getElementById('task-switch-notification').checked = false
    }
});

function toggleSwitchNotification(){
    chrome.storage.local.get("task-switch-notification", function(value){
        let newValue = true
        if(value["task-switch-notification"]){
            newValue = false
        }
        chrome.storage.local.set({"task-switch-notification": newValue});
    });
}

document.getElementById('task-switch-notification').addEventListener('change', toggleSwitchNotification, false);


function changeTaskNotificationPeriod(periodInMins){
    chrome.storage.local.set({"Task Notification Time Period": periodInMins.srcElement.checked});
}

//TIME SPENT NOTIFICATION

chrome.storage.local.get("time-spent-notification", function(value){
    if(typeof value["time-spent-notification"] != "undefined"){
        if(value["time-spent-notification"]){
            document.getElementById('time-spent-notification').checked = value["time-spent-notification"]
        }
        else{
            document.getElementById('time-spent-notification').checked = false
        }
    }
    else{
        document.getElementById('time-spent-notification').checked = true
    }

});

function toggleTimeSpentNotification(){
    chrome.storage.local.get("time-spent-notification", function(value){
        let newValue = true
        if(value["time-spent-notification"]){
            newValue = false
        }
        chrome.storage.local.set({"time-spent-notification": newValue});
    });
}

document.getElementById('time-spent-notification').addEventListener('change', toggleTimeSpentNotification, false);

//TIME SPENT PERIOD

chrome.storage.local.get("time-period-for-task-notification", function(value){
    if(value["time-period-for-task-notification"]){
        document.getElementById('time-period-for-task-notification').value = value["time-period-for-task-notification"]
    }
    else{
        document.getElementById('time-period-for-task-notification').value = 10
    }
});


function changeTaskNotificationPeriod(periodInMins){
    chrome.storage.local.set({"time-period-for-task-notification": periodInMins.srcElement.value});
}


document.getElementById('time-period-for-task-notification').addEventListener('change', changeTaskNotificationPeriod, false);



//STUFF RELATED TO TASK SUGGESTIONS

// // If default settings object is changed here, it should be changed in init.js also.
// const DEFAULT_SETTINGS = {
//     "notifications": "Enabled",
//     "suggestions based on": "Open tabs",
//     "suggestions threshold": "Medium",
//     "block notifications on": ["www.google.com", "www.google.co.in", "www.facebook.com"]
// };
//
// let settings = DEFAULT_SETTINGS;
//
// chrome.storage.local.get("Settings", function (settings) {
//
//     // This variable contains all the options for each of the settings option.
//     const settingsOptions = {
//         "notifications": ["Enabled", "Disabled"],
//         "suggestions based on": ["Open tabs", "Liked pages"],
//         "suggestions threshold": ["Low", "Medium", "High"]
//     };
//
//     settings = settings["Settings"];
//
//     //Template
//     // <div class="btn-group" role="group" aria-label="Basic example">
//     //         <button type="button" class="btn btn-secondary">Left</button>
//     //         <button type="button" class="btn btn-secondary">Middle</button>
//     //         <button type="button" class="btn btn-secondary">Right</button>
//     //         </div>
//
//     showNotificationOptions(settings, settingsOptions);
//
//     showSuggestionsBasedOnOptions(settings, settingsOptions);
//
//     showSuggestionThresholdOptions(settings, settingsOptions);
//
//     showNoNotificationDomains(settings, settingsOptions);
//
//     document.getElementById("reset_index").addEventListener("click", function (ev) {
//         resetIndex();
//     });
// });
//
// function showNotificationOptions(settings, settingsOptions) {
//     // Displaying notification options
//     const notification_set_to = settings["notifications"];
//
//     const notifications_options = settingsOptions["notifications"];
//     const notifications_options_element = document.getElementById("notification_options");
//     for (let i = 0; i < notifications_options.length; i++) {
//         const option = document.createElement("button");
//         let classString = "btn";
//         if (notifications_options[i] == notification_set_to) {
//             classString = classString + " " + "btn-primary";
//         }
//         else {
//             classString = classString + " " + "btn-secondary";
//         }
//         if (i == 0) {
//             classString = classString + " round-corner-left";
//         }
//         if (i == notifications_options.length - 1) {
//             classString = classString + " round-corner-right";
//         }
//
//         option.className = classString;
//         option.innerText = notifications_options[i];
//         option.onclick = function (ev) {
//             console.log(ev);
//             if (this.innerText == "Enabled") {
//                 settings["notifications"] = "Enabled";
//             }
//             if (this.innerText == "Disabled") {
//                 settings["notifications"] = "Disabled";
//             }
//             updateStorage("Settings", settings);
//             location.reload();
//         };
//
//         notifications_options_element.appendChild(option);
//     }
// }
//
// function showSuggestionsBasedOnOptions(settings, settingsOptions) {
//     // Displaying options for suggestions
//     const suggestions_based_on_options_element = document.getElementById("suggestion_options");
//     const suggestions_based_on_set_to = settings["suggestions based on"];
//     const suggestions_based_on_options = settingsOptions["suggestions based on"];
//
//     for (let i = 0; i < suggestions_based_on_options.length; i++) {
//         const option = document.createElement("button");
//         let classString = "btn";
//         if (suggestions_based_on_options[i] == suggestions_based_on_set_to) {
//             classString = classString + " " + "btn-primary";
//         }
//         else {
//             classString = classString + " " + "btn-secondary";
//         }
//
//         if (i == 0) {
//             classString = classString + " round-corner-left";
//         }
//         if (i == suggestions_based_on_options.length - 1) {
//             classString = classString + " round-corner-right";
//         }
//
//         option.className = classString;
//         option.innerText = suggestions_based_on_options[i];
//         option.onclick = function (ev) {
//             console.log(ev);
//             settings["suggestions based on"] = this.innerText;
//             updateStorage("Settings", settings);
//             location.reload();
//         };
//
//         suggestions_based_on_options_element.appendChild(option);
//     }
// }
//
// function showNoNotificationDomains(settings, settingsOptions) {
//
//     // <div class="alert alert-dismissible alert-light">
//     //         <button type="button" class="close" data-dismiss="alert">&times;</button>
//     //     <strong>Heads up!</strong> This <a href="#" class="alert-link">alert needs your attention</a>, but it's not super important.
//     //     </div>
//
//
//     // <span class="badge badge-secondary">Secondary</span>
//
//     // <button type="button" class="btn btn-outline-primary">Primary</button>
//
//     // Displaying options for suggestions
//     const block_notifications_on_element = document.getElementById("block_notifications_domains");
//     const block_notifications_on = settings["block notifications on"];
//
//     for (let i = 0; i < block_notifications_on.length; i++) {
//         const card = document.createElement("button");
//         card.setAttribute("type", "button");
//         card.className = "btn btn-outline-primary round-corner";
//         card.style.margin = "5px";
//
//         const closeButton = document.createElement("button");
//         closeButton.className = "close";
//         closeButton.setAttribute("data-dismiss", "alert");
//         closeButton.innerHTML = "<span style=\"color:black\">&nbsp;&times;</span>";
//         closeButton.onclick = function (ev) {
//             const domainToBeRemoved = this.parentElement.getElementsByTagName("strong")[0].innerText;
//             settings["block notifications on"].splice(settings["block notifications on"].indexOf(domainToBeRemoved), 1);
//             updateStorage("Settings", settings);
//             location.reload();
//         };
//
//         const domainName = document.createElement("strong");
//         domainName.innerText = block_notifications_on[i];
//         card.appendChild(closeButton);
//         card.appendChild(domainName);
//
//         block_notifications_on_element.appendChild(card);
//     }
//
//     const inputElement = document.getElementById("block_notifications_on_domains_input");
//     const addButton = document.getElementById("submit_block_notifications_on");
//
//     addButton.onclick = function (ev) {
//         let enteredString = inputElement.value;
//         enteredString = enteredString.trim();
//         if (isURL(enteredString)) {
//             enteredString = extractHostname(enteredString);
//         }
//         if (enteredString.substring(0, 4) != "www.") {
//             enteredString = "www." + enteredString;
//         }
//         const existingDomains = settings["block notifications on"];
//         if (existingDomains.indexOf(enteredString) > -1) {
//             alert("Notifications on this domain are already blocked.");
//         } else {
//             settings["block notifications on"].push(enteredString);
//             updateStorage("Settings", settings);
//             location.reload();
//         }
//     }
//
// }
//
// function extractHostname(url) {
//     let hostname;
//     //find & remove protocol (http, ftp, etc.) and get hostname
//
//     if (url.indexOf("://") > -1) {
//         hostname = url.split('/')[2];
//     }
//     else {
//         hostname = url.split('/')[0];
//     }
//
//     //find & remove port number
//     hostname = hostname.split(':')[0];
//     //find & remove "?"
//     hostname = hostname.split('?')[0];
//
//     return hostname;
// }
//
// function isURL(str) {
//     const regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
//     if (regex.test(str)) {
//         return true;
//     }
// }
//
//
// function showSuggestionThresholdOptions(settings, settingsOptions) {
//     // Threshold for suggestions
//     const suggestions_threshold_element = document.getElementById("suggestion_threshold");
//     const suggestions_threshold_set_to = settings["suggestions threshold"];
//     const suggestions_threshold_options = settingsOptions["suggestions threshold"];
//
//     for (let i = 0; i < suggestions_threshold_options.length; i++) {
//         const option = document.createElement("button");
//         let classString = "btn";
//         if (suggestions_threshold_options[i] == suggestions_threshold_set_to) {
//             classString = classString + " " + "btn-primary";
//         }
//         else {
//             classString = classString + " " + "btn-secondary";
//         }
//
//         if (i == 0) {
//             classString = classString + " round-corner-left";
//         }
//         if (i == suggestions_threshold_options.length - 1) {
//             classString = classString + " round-corner-right";
//         }
//
//         option.className = classString;
//         option.innerText = suggestions_threshold_options[i];
//         option.onclick = function (ev) {
//             console.log(ev);
//             settings["suggestions threshold"] = this.innerText;
//             updateStorage("Settings", settings);
//             location.reload();
//         };
//
//         suggestions_threshold_element.appendChild(option);
//     }
// }
//
// function resetIndex() {
//     chrome.storage.local.set({"Text Log": {}});
//     chrome.storage.local.set({"Tags": {}});
// }

// function updateStorage(key, obj) {
//     const tempObj = {};
//     tempObj[key] = obj;
//     chrome.storage.local.set(tempObj);
// }
