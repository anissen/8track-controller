
function mixesCtrl($scope) {
  $scope.mixes = [];

  $scope.nextTrack = function(mix) {
    clickElement(mix.tabId, 'player_skip_button');
  };

  function updateFunc(tabId, script, callback) {
    chrome.tabs.executeScript(tabId, {code: script}, function (data) {
      $scope.$apply(function() {
        callback((data ? data[0] : data));
      });
    });
  }

  function updateTitle(mix) {
    updateFunc(mix.tabId, "document.getElementById('mix_name').innerHTML.trim()", function(mixTitle) {
      mix.title = mixTitle;
    });
  }

  function updateImage(mix) {
    updateFunc(mix.tabId, "document.getElementsByClassName('sq500')[0].src", function(imageSrc) {
      mix.imageSrc = imageSrc;
    });
  }

  function clickElement(tabId, elementId) {
    updateFunc(tabId, "document.getElementById('" + elementId + "').click()");
  }

  function createNewMix(tabId) {
    var mix = {tabId: tabId};
    $scope.$apply(function() {
      $scope.mixes.push(mix);
    });
    return mix;
  }

  chrome.tabs.query({url: 'http://8tracks.com/*'}, function (tabs) {
    for (var i = 0; i < tabs.length; i++) {
      var tab = tabs[i];
      var mix = createNewMix(tab.id);
      updateTitle(mix);
      updateImage(mix);
    }
  });
}