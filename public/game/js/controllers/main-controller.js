/**
 * Created with JetBrains WebStorm.
 * User: laurentrenard
 * Date: 12/4/12
 * Time: 3:24 PM
 * To change this template use File | Settings | File Templates.
 */
app.controller('mainCtrl',['$scope','grid','socket','$log',function(scope, grid,socket,log){
    scope.message='hello';

    //register to socket event,
    socket.on('greeting',function(data){
       log.log(data.message);
    });

    //connect to the server:
    socket.emit('connection');

    //phase
    scope.currentPhase='placement';

    scope.displayPlayButton=false;

    scope.$on('ready',function(event,args){
        scope.displayPlayButton=args.value;
    });

    //phases
    scope.play=function(){
        if(scope.displayPlayButton){
            grid.saveGrid();
            scope.currentPhase="play";
            scope.displayPlayButton=false;
        }
    };



}]);