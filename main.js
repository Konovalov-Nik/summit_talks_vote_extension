
var TALK_NAME_PARAM = "talk_name";
var SPEAKER_NAME_PARAM = "speaker_name";

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

function addLinkToCurrentTalk() {
}

function addLinksToSpeakers() {
}

function navigateToTalk() {
}

function navigateToSpeaker() {
}

// Main executable code

var navigationDone = false;
var talk_name = getTalkNameIfPresent();

if (talk_name !== null) {
    navigateToTalk(talk_name);
    navigationDone = true;
}

var speaker_name = getSpeakerNameIfPresent();
if (!navigationDone && speaker_name !== null) {
    navigateToSpeaker(speaker_name);
    navigationDone = true
}

addLinkToCurrentTalk();
addLinksToSpeakers();