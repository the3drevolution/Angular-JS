'use strict';

angular.module('confusionApp')

.controller('MenuController', ['$scope', 'menuFactory', function($scope, menuFactory) {

  $scope.tab = 1;
  $scope.filtText = '';
  $scope.showDetails = false;

  $scope.showMenu = false;
  $scope.message = "Loading...";
  //it is initially assigned with an empty array,
  //once the response is received from the server, the data is loaded into $scope.dishes
  $scope.dishes= menuFactory.getDishes().query(
    function(response){
      $scope.dishes = response;
      $scope.showMenu = true;
    }, function(response){
      $scope.message = "Error: "+response.status+" "+response.statusText;
    }
  );

  $scope.select = function(setTab) {
    $scope.tab = setTab;

    if (setTab === 2) {
      $scope.filtText = "appetizer";
    }
    else if (setTab === 3) {
      $scope.filtText = "mains";
    }
    else if (setTab === 4) {
      $scope.filtText = "dessert";
    }
    else {
      $scope.filtText = "";
    }
  };

  $scope.isSelected = function (checkTab) {
    return ($scope.tab === checkTab);
  };

  $scope.toggleDetails = function() {
    $scope.showDetails = !$scope.showDetails;
  };
}])

.controller('ContactController', ['$scope', function($scope) {

  $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"", invalidChannelSelection: false };

  var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];

  $scope.channels = channels;

}])

.controller('FeedbackController', ['$scope', function($scope) {

  $scope.sendFeedback = function() {

    console.log($scope.feedback);

    if ($scope.feedback.agree && (($scope.feedback.mychannel === "") || ($scope.feedback.mychannel===null) || ($scope.feedback.mychannel===undefined))) {
      $scope.feedback.invalidChannelSelection = true;
      console.log('incorrect');
    }
    else {
      $scope.feedback.invalidChannelSelection = false;
      $scope.feedback.firstName="";
      $scope.feedback.lastName="";
      $scope.feedback.agree=false;
      $scope.feedback.email="";
      $scope.feedback.mychannel="";
      $scope.feedback.comments="";
      $scope.feedback.tel.number="";
      $scope.feedback.tel.areaCode="";
      $scope.feedbackForm.$setPristine();
      console.log($scope.feedback);
    }
  };
}])

.controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', function($scope, $stateParams, menuFactory) {

  $scope.showDish = false;
  $scope.message = "Loading...";
  //this way the getDishes method will return the specific dish that we are asking for
  $scope.dish = menuFactory.getDishes().get({id:parseInt($stateParams.id, 10)}).$promise.then(
    function(response){
      $scope.dish = response;
      $scope.showDish = true;
    },
    function(response){
      $scope.message = "Error: "+response.status+" "+response.statusText;
    }
  );

}])

.controller('DishCommentController', ['$scope', 'menuFactory', function($scope,menuFactory) {

  $scope.initPreviewComment = function(){
    $scope.previewComment = {};
    $scope.previewComment.author = "";
    $scope.previewComment.rating = "5"; //setting default initial rating
    $scope.previewComment.comment = "";
    $scope.previewComment.date = "";
  };

  $scope.submitComment = function () {

    // Step 2: This is how you record the date
    $scope.previewComment.date = new Date().toISOString();

    // Step 3: Push your comment into the dish's comment array
    $scope.dish.comments.push($scope.previewComment);

    //Update the comment in the server side also so that it is persisted
    //First parameter is the id, the second parameter is the updated dish
    menuFactory.getDishes().update({id:$scope.dish.id},$scope.dish);

    //Step 4: reset your form to pristine
    $scope.commentForm.$setPristine();

    //Step 5: reset your JavaScript object that holds your comment
    $scope.initPreviewComment();
  };

  //Step 1: Create a JavaScript object to hold the comment from the form
  $scope.initPreviewComment();
}])

.controller('IndexController', ['$scope', 'corporateFactory', 'menuFactory', function($scope, corporateFactory, menuFactory){
  var featuredDishIdx = 0;
  var executiveChefIdx = 3;
  var promotionIdx = 0;

  $scope.showFeaturedDish = false;
  $scope.featuredDishMessage = "Loading...";

  $scope.promotion = menuFactory.getPromotion(promotionIdx);
  $scope.featuredDish = menuFactory.getDishes().get({id: featuredDishIdx}).$promise.then(
    function(response){
      $scope.featuredDish = response;
      $scope.showFeaturedDish = true;
    }, function(response){
      $scope.featuredDishMessage = "Error: "+response.status+" "+response.statusText;
    }
  );

  $scope.specialist = corporateFactory.getLeader(executiveChefIdx);

}])

.controller('AboutController', ['$scope', 'corporateFactory', function($scope, corporateFactory){
  var leadership = corporateFactory.getLeaders();
  $scope.leadership = leadership;
}])
// implement the IndexController and About Controller here


;
