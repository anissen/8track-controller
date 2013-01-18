
function mixesCtrl($scope) {
  $scope.mixes = [];

  $scope.nextTrack = function(mix) {
    clickElement(mix.tabId, 'player_skip_button');
  };

  $scope.toggleState = function(mix) {
    if (mix.state === 'Play') {
      clickElement(mix.tabId, 'player_play_button');
    } else if (mix.state === 'Pause') {
      clickElement(mix.tabId, 'player_pause_button');
    }
  };

  $scope.goToTab = function(mix) {
    chrome.tabs.update(mix.tabId, {active: true}, function() {
      window.close();
    });
  };

  function updateFunc(tabId, script, callback) {
    chrome.tabs.executeScript(tabId, {file: 'scripts/jquery.min.js'}, function() {
      chrome.tabs.executeScript(tabId, {code: script}, function (data) {
        $scope.$apply(function() {
          callback((data ? data[0] : data));
        });
      });
    });
  }

  function updateTitle(mix) {
    updateFunc(mix.tabId, '$("#mix_name").text()', function(mixTitle) {
      mix.title = mixTitle;
    });
  }

  function updateSong(mix) {
    updateFunc(mix.tabId, '$("#now_playing .title_artist .t").text()', function(song) {
      mix.song = song;
    });
  }

  function updateArtist(mix) {
    updateFunc(mix.tabId, '$("#now_playing .title_artist .a").text()', function(artist) {
      mix.artist = artist;
    });
  }

  function updateImage(mix) {
    updateFunc(mix.tabId, '$(".sq500").attr("src")', function(imageSrc) {
      mix.imageSrc = imageSrc;
    });
  }

  function updateState(mix) {
    updateFunc(mix.tabId, '$("#player_pause_button").css("display") === "block"', function(isPlaying) {
      mix.state = (isPlaying ? 'Pause' : 'Play');
    });
  }

  function clickElement(tabId, elementId) {
    updateFunc(tabId, '$("#' + elementId + '").click()', function() {
      window.close();
    });
  }

  function createAndUpdateMix(tabId) {
    updateFunc(tabId, '$("#play_area").length === 1', function(hasPlayArea) {
      if (!hasPlayArea)
        return;

      var mix = createNewMix(tabId);
      updateMix(mix);
    });
  }

  function createNewMix(tabId) {
    var mix = {tabId: tabId};
    $scope.mixes.push(mix); // this is inside a $scope.apply from updateFunc in createAndUpdateMix
    return mix;
  }

  function updateMix(mix) {
    updateState(mix);
    updateTitle(mix);
    updateImage(mix);
    updateSong(mix);
    updateArtist(mix);
  }

  chrome.tabs.query({url: 'http://8tracks.com/*/*'}, function (tabs) {
    for (var i = 0; i < tabs.length; i++) {
      var tab = tabs[i];
      createAndUpdateMix(tab.id);
    }
  });
}
