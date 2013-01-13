'use strict';

function executeOnTab(tabId, script, callback) {
  chrome.tabs.executeScript(tabId, {code: script}, callback);
}

function clickElement(elementId, tabId) {
  executeOnTab(tabId, "document.getElementById('" + elementId + "').click()");
}

function setHeaderFromTab(headerElement, tabId) {
  executeOnTab(tabId, "document.getElementById('mix_name').innerHTML.trim()", function (mixTitle) {
    headerElement.text(mixTitle[0]);
  });
}

function setImageSrcFromTab(imgElement, tabId) {
  executeOnTab(tabId, "document.getElementsByClassName('sq500')[0].src", function (imageSrc) {
    imgElement.attr('src', imageSrc[0]);
  });
}

function setPlayStateFromTab(playBtn, pauseBtn, nextTrackBtn, tabId) {
  executeOnTab(tabId, "document.getElementById('player_play_button').style.cssText", function (playStyle) {
    var activeBtn = null;
    if (playStyle[0] !== 'display: none;') {
      activeBtn = playBtn;
    } else {
      activeBtn = pauseBtn;
    }
    activeBtn.removeClass('hide');
    nextTrackBtn.removeClass('hide');
  });
}

document.addEventListener('DOMContentLoaded', function () {
  $('#placeholder').empty();

  chrome.tabs.query({url: 'http://8tracks.com/*'}, function (tabs) {
    for (var i = 0; i < tabs.length; i++) {
      var tab = tabs[i];
      var url = tab.url.substr('http://8tracks.com/'.length);
      $('#placeholder')
        .append('<div class="fluid-row"><div class="span12"><div class="media well well-small tab-' + tab.id + '">' +
                  '<img class="media-object pull-left img-rounded" style="height: 128px; width: 128px;" src="">' +
                  '<div class="media-body">' +
                    '<h3 class="media-heading"></h3>' +
                    '<button class="btn btn-primary play-btn hide" data-tab-id="' + tab.id + '"><i class="icon-play icon-white"></i> Play</button> ' +
                    '<button class="btn btn-primary pause-btn hide" data-tab-id="' + tab.id + '"><i class="icon-pause icon-white"></i> Pause</button> ' +
                    '<button class="btn next-track-btn hide" data-tab-id="' + tab.id + '"><i class="icon-fast-forward icon-white"></i> Next track</button>' +
                  '</div>' +
                '</div></div></div>');

      var tabContainer = $('.tab-' + tab.id);
      setHeaderFromTab(tabContainer.find('h3'), tab.id);
      setImageSrcFromTab(tabContainer.find('img'), tab.id);
      setPlayStateFromTab(tabContainer.find('.play-btn'), tabContainer.find('.pause-btn'), tabContainer.find('.next-track-btn'), tab.id);
    }

    $('.play-btn').on('click', function() {
      clickElement('player_play_button', $(this).data('tab-id'));
      window.close();
    });

    $('.pause-btn').on('click', function() {
      clickElement('player_pause_button', $(this).data('tab-id'));
      window.close();
    });

    $('.next-track-btn').on('click', function() {
      clickElement('player_skip_button', $(this).data('tab-id'));
      window.close();
    });
  });
});
