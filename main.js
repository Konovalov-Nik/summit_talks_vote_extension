var j = jQuery.noConflict();

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
    var main_link_init_interval = setInterval(function() {
        try {
            if (j(".main_link_inited").length > 0) {
                console.log("Main link initialized. Skipping");
                clearInterval(main_link_init_interval);
                return;
            }
            var title_element = j(".voting-presentation-title h3")[0];
            var current_talk_name = title_element.innerText;
            var new_location = document.location.origin + document.location.pathname +
                "?talk_name=" + encodeURIComponent(current_talk_name);
            var link = "<a class='main_link_inited' href='" + new_location + "'>LINK</a>"
            j(title_element).after(link);

            clearInterval(main_link_init_interval);
        } catch (e) {}
    }, 100);

}

function addLinksToSpeakers() {
    var speaker_links_init_interval = setInterval(function() {
        try {
            if (j(".main-speaker-row").length === j(".speaker_link_inited").length) {
                console.log("Speaker links initialized. Skipping");
                clearInterval(speaker_links_init_interval);
                return;
            }
            j(".main-speaker-row").each(function(idx, element) {
                if (j(element).html().indexOf("speaker_link_inited") >= 0) {
                    // this one initialized;
                    return;
                }
                var speaker_name = j(element).find("span")[0].innerText;
                var new_location = document.location.origin + document.location.pathname +
                    "?speaker_name=" + encodeURIComponent(speaker_name);
                var link = "<a class='speaker_link_inited' href='" + new_location + "'>Link to talks by this speaker</a>"
                j(element).after("<br />" + link);

            });
            clearInterval(speaker_links_init_interval);
        } catch (e) {}
    }, 100);
}

function navigateToTarget(target_name) {
    var df1 = j.Deferred();
    function stage1() {
        console.log("stage-1 called");

        var fill_input_interval = setInterval(function () {
            try {
                var input_element = j(".voting-search-input")[0];
                j(input_element).focus();

                j(input_element).val(target_name);
                input_element.dispatchEvent(new Event('input', { 'bubbles': true }));

                clearInterval(fill_input_interval);
                df1.resolve();
            } catch (e) {}
        }, 100);

    }

    var df2 = j.Deferred();
    function stage2() {
        console.log("stage-2 called");
        var submit_search_interval = setInterval(function() {
            try {
                var input_element = j(".voting-search-input")[0];
                j(input_element).closest("form")[0].dispatchEvent(new Event('submit', {'bubbles': true}));

                clearInterval(submit_search_interval);
                df2.resolve();
            } catch (e) {}
        }, 100);

    }

    function stage3() {
        console.log("stage-3 called");
        function click_first_link() {
            var list_element = j(".presentation-list")[0];
            var list_item = j(list_element).find("a")[0];
            list_item.dispatchEvent(new Event('click', { 'bubbles': true }));
        }

        var check_clicked_interval = setInterval(function () {
            try {
                if (j(".voting-presentation-title")[0].innerHTML.indexOf(target_name) >= 0) {
                    clearInterval(check_clicked_interval);
                } else {
                    click_first_link();
                }
            } catch (e) {}
        }, 100)
    }

    df1.then(stage2);
    df2.then(stage3);

    stage1();

}

function mainLinksInit() {
    addLinkToCurrentTalk();
    addLinksToSpeakers();
}

function mainNavigateCallback() {

    var talk_name = getTalkNameIfPresent();

    if (talk_name !== null) {
        console.log("Talk Name found. Going to navigate");
        navigateToTarget(talk_name);
        return;
    }

    var speaker_name = getSpeakerNameIfPresent();
    if (speaker_name !== null) {
        console.log("Speaker Name found. Going to navigate");
        navigateToTarget(speaker_name);
        return;
    }
}

// Main executable code
j(function() {

    mainNavigateCallback();

    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var observer = new MutationObserver(function(mutations, observer) {
        mainLinksInit();
    });

    observer.observe(document, {
      subtree: true,
      attributes: true
    });
});