/**
 * Created with JetBrains WebStorm.
 * User: laurentrenard
 * Date: 12/18/12
 * Time: 2:42 PM
 * To change this template use File | Settings | File Templates.
 */
app.controller('mainCtrl',['$rootScope','$scope','$location','grid','$log',function(root,scope,location,grid,log){
    //listen to route change events
    root.message='';
    root.status='';
    root.showOverlay=false;

    root.$on("$routeChangeStart", function (event, next, current) {

    });
    root.$on("$routeChangeSuccess", function (event, current, previous) {

    });
    root.$on("$routeChangeError", function (event, current, previous, rejection) {

        root.status=rejection.status;
        root.message=rejection.message;

        //redirect to the error page
        location.path('/error');
    });
    root.$on('displayOverlay',function(event){
        root.showOverlay=true;
    });

    root.toggleOverlay=function(){
        //leave game
        grid.leave();
        //close overlay
        root.showOverlay=!root.showOverlay;
        //go back to the rooms page
        location.path('/game/home');
    };
}]);