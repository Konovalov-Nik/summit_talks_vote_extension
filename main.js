var j = jQuery.noConflict();

var TALK_NAME_PARAM = "talk_name";
var SPEAKER_NAME_PARAM = "speaker_name";

var MAX_RETRIES = 50;

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) === variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    return null;
}

function getTalkNameIfPresent() {
  return getQueryVariable(TALK_NAME_PARAM);
}

function getSpeakerNameIfPresent() {
  return getQueryVariable(SPEAKER_NAME_PARAM);
}

function initLinksOnLoad(callback) {
    var title_element = j(".voting-presentation-title h3")[0];
    var current_talk_name = null;
    var retries_done = 0;
    var callback_called = false;

    var fetch_loop = setInterval(function() {
        if (retries_done >= MAX_RETRIES || callback_called) {
            clearInterval(fetch_loop);
        }
        try {
            title_element = j(".voting-presentation-title h3")[0];
            current_talk_name = title_element.innerText;
            callback();
            callback_called = true;
            clearInterval(fetch_loop);
        } finally {
            retries_done += 1;
        }
    }, 1000);
}


function addLinkToCurrentTalk() {
    var title_element = j(".voting-presentation-title h3")[0];
    var current_talk_name = title_element.innerText;
    var new_location = document.location.origin + document.location.pathname +
        "?talk_name=" + current_talk_name;
    var link = "<a class='main_link_inited' href='" + new_location + "'>LINK</a>"
    j(title_element).after(link);
}

function addLinksToSpeakers() {
    j(".main-speaker-row").each(function(idx, element) {
        var speaker_name = j(element).find("span")[0].innerText;
        var new_location = document.location.origin + document.location.pathname +
            "?speaker_name=" + speaker_name;
        var link = "<a class='speaker_link' href='" + new_location + "'>Link to talks by this speaker</a>"
        j(element).after("<br />" + link);

    })
}

function navigateToTalk() {
}

function navigateToSpeaker() {
}

function mainInitCallback() {
    if (j(".main_link_inited").length === 0) {
        console.log("No Link on page. Initializing");
        addLinkToCurrentTalk();
        addLinksToSpeakers();
    } else {
       console.log("Links already initialized");
    }
}

// Main executable code
j(function() {
    var navigationDone = false;
    var talk_name = getTalkNameIfPresent();

    if (talk_name !== null) {
        console.log("Talk Name found. Going to navigate");
        navigateToTalk(talk_name);
        navigationDone = true;
    }

    var speaker_name = getSpeakerNameIfPresent();
    if (!navigationDone && speaker_name !== null) {
        navigateToSpeaker(speaker_name);
        navigationDone = true
    }

    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    var observer = new MutationObserver(function(mutations, observer) {
        mainInitCallback();
    });

    observer.observe(document, {
      subtree: true,
      attributes: true
    });
});