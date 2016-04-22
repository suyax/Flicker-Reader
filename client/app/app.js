var myApp = angular.module('myApp',['infinite-scroll']);
myApp.controller('PostCtrl', function ($scope, $filter, Post) {
  $scope.post = new Post();
});

myApp.filter('dateSuffix', function($filter) {
  var suffixes = ["th", "st", "nd", "rd"];
  return function(input) {
    var dtfilter = $filter('date')(input, "dd MMMM 'at' H:mm");
    var day = parseInt(dtfilter.slice(0,2));
    var relevantDigits = (day < 30) ? day % 20 : day % 30;
    var suffix = (relevantDigits <= 3) ? suffixes[relevantDigits] : suffixes[0];
    return dtfilter.slice(0,2)+suffix+ dtfilter.slice(2);
  };
})

myApp.factory('Post', function($http) {
  var Post = function() {
    this.posts =[];
    this.busy = false;
  };

  Post.prototype.nextPage = function() {
    if (this.busy) {
      return;
    }
    this.busy = true;
    var url = "https://api.flickr.com/services/feeds/photos_public.gne?tags=potato&tagmode=all&format=json&&jsoncallback=JSON_CALLBACK";
    $http.jsonp(url).success(function(data) {
      var items = data.items;
      for (var i = 0; i < items.length; i++) {
        var item = {};
        item.photo = items[i].media.m;
        item.title = items[i].title;
        item.date = items[i].published;
        item.author = items[i].author.slice(items[i].author.indexOf('(')+1,items[i].author.indexOf(')'));
        item.authorLink = "https://www.flickr.com/people/"+items[i].author_id;+"/";
        item.link = items[i].link;
        this.posts.push(item);
      }
      this.busy = false;
    }.bind(this));
  };
  return Post;
})
