function returnDuration(startingTime, endingTime) {
    var startingTime = new Date(startingTime);
    var endingTime = new Date(endingTime);
    const duration = endingTime - startingTime;
    return duration;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

function indexOfElementWithProperty(arr, propName, propValue) {
    return arr.indexOf(arr.find((element) => element[propName] === propValue));
}

function isEmpty(obj) {
    for (let prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
}

function getJaccardScores(urlTags1, urlTags2) {
    const intersection = _.intersection(urlTags1, urlTags2);
    const union = _.union(urlTags1, urlTags2);
    const jaccardScore = intersection.length / union.length;
    if (!isNaN(jaccardScore)) {
        return jaccardScore
    }
    else {
        return 0;
    }

}

function sortElementsByFrequency(array) {
    const frequencyMap = {};
    for (let i = 0; i < array.length; i++) {
        if (Object.keys(frequencyMap).indexOf(array[i]) > 0) {
            frequencyMap[array[i]] = frequencyMap[array[i]] + 1;
        }
        else {
            frequencyMap[array[i]] = {};
            frequencyMap[array[i]] = 1;
        }
    }
    const sortable = [];
    for (let element in frequencyMap) {
        sortable.push([element, frequencyMap[element]]);
    }

    sortable.sort(function (a, b) {
        return b[1] - a[1];
    });

    return (sortable);
}

function compare(a, b) {
    if (a["weight"] < b["weight"])
        return -1;
    if (a["weight"] > b["weight"])
        return 1;
    return 0;
}

function htmlParser(htmlString) {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(htmlString, "text/html");
    return htmlDoc;
}

function httpGet(theUrl, options, callback) {
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            callback(options, htmlParser(xmlhttp.responseText));
        }
    };
    xmlhttp.open("GET", theUrl, false);
    xmlhttp.send();
}

function objectFromJSON(file, callback) {
    $.getJSON(file, function (json) {
        const object = json;
        callback(object);
    });
}

function checkIfStringContainsAnyStrings(strings, string) {
    for (let j = 0; j < strings.length; j++) {
        if (string.indexOf(strings[j]) > -1) {
            return true;
        }
    }
    return false;
}

function saveJSON(data, filename) {

    if (!data) {
        console.error('No data');
        return;
    }

    if (!filename) filename = 'console.json';

    if (typeof data === "object") {
        data = JSON.stringify(data, undefined, 4)
    }

    const blob = new Blob([data], {type: 'text/json'}),
        e = document.createEvent('MouseEvents'),
        a = document.createElement('a');

    a.download = filename;
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e)
}

function getUrlParameter(sParam, url) {
    let sPageURL = decodeURIComponent(url),
        sURLVariables = sPageURL.replace('?', '&').split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
}

function logView(page) {
    chrome.storage.local.get('Report Views', function (report) {
        report = report['Report Views'];
        if (report.hasOwnProperty(page)) {
            report[page]++;
        } else {
            report[page] = 1;
        }
        chrome.storage.local.set({'Report Views': report});
    })
}
