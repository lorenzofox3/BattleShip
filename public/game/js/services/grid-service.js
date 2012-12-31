/**
 * Created with JetBrains WebStorm.
 * User: laurentrenard
 * Date: 12/3/12
 * Time: 6:52 PM
 * To change this template use File | Settings | File Templates.
 */

app.service('grid',['socket',function(socket){

    var rows=10;
    var columns=10;
    var playerGrid;
    var playerBoats;

    this.getRows=function(){
        return rows;
    };

    this.getColumns=function(){
        return columns;
    };

    var boats=[];
    boats.push(new Ship(1,'small', 2));
    boats.push(new Ship(2,'middle', 3));
    boats.push(new Ship(3,'big', 4));
    boats.push(new Ship(4,'huge', 5));

    this.getBoats=function(){
        return boats;
    };

    this.startGame=function(grid,boats){
        playerGrid=grid;
        playerBoats=boats;

        //submit to the server
        socket.emit('play',{grid:playerGrid,boats:playerBoats});
    };

    this.fire=function(row,column){
      socket.emit('fire',{row:row,column:column});
    };

    //just to inject socket only here and not in the controllers->controllers subscribe to this service which subscribes to the socket service (I believe it would make the testing of the controllers easier)
    this.target=function(callback){
        socket.on('target',callback);
    }

    this.shoot=function(callback){
        socket.on('shoot',callback);
    }

    this.result=function(callback){
        socket.on('result',callback);
    };

    this.leave=function(callback){
        socket.emit('leave');
    };

}]);