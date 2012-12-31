/**
 * Created with JetBrains WebStorm.
 * User: laurentrenard
 * Date: 12/18/12
 * Time: 6:20 PM
 * To change this template use File | Settings | File Templates.
 */
app.controller('roomsCtrl',['$scope','rooms','battle','$timeout','$log',function(scope,rooms,battle,timeout,log){
    scope.rooms=rooms;

    //put the value as a variable (TODO)
    scope.beforeRefresh=60;
    var longPull=function(){
        scope.beforeRefresh--;
        if(scope.beforeRefresh===0){
            scope.rooms=battle.all();
            scope.beforeRefresh=60;
        }
        timeout(longPull,1000);
    }

    timeout(longPull,1000);

    scope.createGame=function(){
        scope.rooms=battle.create();
    };

    scope.delete=function(room){
        scope.rooms=battle.remove(room.ref);
    };

    scope.refresh=function(){
        scope.rooms=battle.all();
    };

}]);