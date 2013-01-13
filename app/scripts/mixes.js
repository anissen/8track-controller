
function mixesCtrl($scope) {
  $scope.mixes = [];

  $scope.queryMixes = function () {
    chrome.tabs.query({url: 'http://8tracks.com/*'}, function (tabs) {
      for (var i = 0; i < tabs.length; i++) {
        var tab = tabs[i];
        var mix = {};
        $scope.mixes.push(mix);
        chrome.tabs.executeScript(tab.id, {code: "document.getElementById('mix_name').innerHTML.trim()"}, function (mixTitle) {
          mix.title = mixTitle[0];
        });
        chrome.tabs.executeScript(tab.id, {code: "document.getElementsByClassName('sq500')[0].src"}, function (imageSrc) {
          mix.imageSrc = imageSrc[0];
        });
      }
    });
  };
}