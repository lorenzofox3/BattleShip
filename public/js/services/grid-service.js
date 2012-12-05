/**
 * Created with JetBrains WebStorm.
 * User: laurentrenard
 * Date: 12/3/12
 * Time: 6:52 PM
 * To change this template use File | Settings | File Templates.
 */

app.service('grid',[function(){

    var rows=10;
    var columns=10;
    var playerGrid;

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

    this.saveGrid=function(grid){
        playerGrid=grid;
    };

}]);