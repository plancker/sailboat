const commonwords = ["the", "of", "and", "a", "to", "in", "is", "you", "that", "it", "he", "was", "for", "on", "are", "as", "with", "his", "they", "i", "at", "be", "this", "have", "from", "or", "one", "had", "by", "word", "but", "not", "what", "all", "were", "we", "when", "your", "can", "said", "there", "use", "an", "each", "which", "she", "do", "how", "their", "if", "will", "up", "other", "about", "out", "many", "then", "them", "these", "so", "some", "her", "would", "make", "like", "him", "into", "time", "has", "look", "two", "more", "write", "go", "see", "number", "no", "way", "could", "people", "my", "than", "first", "been", "call", "who", "its", "now", "find", "long", "down", "day", "did", "get", "come", "made", "may", "part"];

$(document).ready(function () {
    if (getDomainFromURL(window.location.href).indexOf('.google.') > -1) {
        var query = getUrlParameter('q', window.location.href);
        searchArchivedPages(query);
    }
});

function searchArchivedPages(query) {
    chrome.storage.local.get("TASKS", function (tasks) {
        tasks = tasks["TASKS"];
        chrome.storage.local.get("Page Content", function (pageContent) {
            pageContent = pageContent["Page Content"];
            let searchIn = "Archived pages"; //searchSettings["search in"];
            let results = [];

            let queryTerms = [];

            query = query.trim();

            if (query[0] === "\"" && query[query.length - 1] === "\"") {
                query = query.substring(1, query.length - 1);
                queryTerms = [query];
            } else {
                queryTerms = query.split("+");
            }

            for (let i = 0; i < queryTerms.length; i++) {
                if (commonwords.indexOf(queryTerms[i]) > -1) {
                    queryTerms.splice(i, 1);
                }
            }

            for (let taskid in tasks) {
                if (taskid !== "lastAssignedId") {
                    const task = tasks[taskid];
                    let searchThroughPages = task["likedPages"];

                    if (searchThroughPages.length === 0) {
                    }
                    else {
                        for (let i = 0; i < searchThroughPages.length; i++) {

                            if (searchThroughPages[i] != null) {
                                let url = searchThroughPages[i];
                                if (pageContent.hasOwnProperty(url)) {
                                    let content = pageContent[url];
                                    let wordsArray;
                                    try {
                                        wordsArray = content.toLowerCase().split(/[.\-_\s,()@!&*+{}:;"'\\?]/);
                                    } catch (e) {
                                        // alert("Please try reloading tab : " + url + ".");
                                    }


                                    let result = {
                                        "url": url,
                                        "task": task["name"],
                                        "matched terms": [],
                                        "context": []
                                    };

                                    for (let j = 0; j < queryTerms.length; j++) {
                                        if (wordsArray.indexOf(queryTerms[j].toLowerCase()) > -1) {
                                            result["matched terms"].push(queryTerms[j]);
                                            let contextString = getContextString(queryTerms[j], content, 10);
                                            result["context"].push(contextString);
                                        }
                                    }
                                    if (result["matched terms"].length > 0) {
                                        results.push(result);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            results = sortResults(results);
            showArchivedResults(results);


            function sortResults(results) {
                results.sort(function (a, b) {
                    return b["matched terms"].length - a["matched terms"].length;
                });

                return results;
            }
        })
    });
}

function getContextString(term, string, length) {
    let wordsArray = string.split(/[.\-_\s,()@!&*+{}:;"'\\?]/);
    let wordsArrayLowercase = string.toLowerCase().split(/[.\-_\s,()@!&*+{}:;"'\\?]/);
    let indexOfTerm = wordsArrayLowercase.indexOf(term.toLowerCase());
    let startPosition = 0;
    if (indexOfTerm > length / 2) {
        startPosition = indexOfTerm - (length / 2);
    }
    let contextTokens = wordsArray.splice(startPosition, length);
    let retStr = "";
    for (let i = 0; i < contextTokens.length; i++) {
        if (contextTokens[i].toLowerCase() === term.toLowerCase()) {
            retStr = retStr + " <strong><abbr>" + contextTokens[i] + "</abbr></strong> ";
        }
        else {
            retStr = retStr + " " + contextTokens[i] + " ";
        }
    }

    return retStr;
}

function showArchivedResults(results) {
    let sailboatIconPath = chrome.runtime.getURL("images/logo_white_sails.png");
    // <div style="display: inline-block; margin-right: 8px; height: 20px; width: 20px; background-image: url("'+ sailboatIconPath.trim() + '");"></div>
    const $archiveResults = $('<div id="sailboat-archive-results" style="padding: 10px; border: 1px solid lightblue;"><p style="color: #008cba; display: inline-block"><b>From your archive</b></p><hr></div>');
    $archiveResults.css({'max-height':'330px','width':'420px', 'overflow':'scroll', 'margin-bottom':'10px'});
    $('#rhs').prepend($archiveResults);

    const resultsElement = document.getElementById("sailboat-archive-results");
    // resultsElement.innerText = "";

    if (results.length > 0) {
        for (let i = 0; i < results.length; i++) {
            let resultElement = document.createElement("p");
            let urlString = "<p><a href='" + results[i]["url"] + "'>" + results[i]["url"] + "</a> | Task : "+results[i]["task"]+"</p>";
            let matchedTermsString = "<p><small>Matched terms : ";
            let contextStrings = "<p><small>";
            let matchedTerms = results[i]["matched terms"];
            for (let j = 0; j < matchedTerms.length; j++) {
                matchedTermsString = matchedTermsString + "<strong>" + matchedTerms[j] + "</strong>" + " | ";
                contextStrings = contextStrings + results[i]["context"][j] + "<br>";
            }
            matchedTermsString = matchedTermsString + "</p></small>";
            contextStrings = contextStrings + "</p></small>";
            resultElement.innerHTML = urlString + matchedTermsString + "<br>";
            resultsElement.appendChild(resultElement);
        }
    } else {
        $archiveResults.append($("<p>No matches found. Archive more pages!</p>"));
    }
}