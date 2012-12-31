/**
 * Created with JetBrains WebStorm.
 * User: laurentrenard
 * Date: 12/4/12
 * Time: 5:30 PM
 * To change this template use File | Settings | File Templates.
 */
app.controller('fireFieldCtrl',['$scope','grid','$log',function(scope,grid,log){
    var rows=grid.getRows();
    var columns=grid.getColumns();
    scope.grid=new Grid(rows,columns);

    scope.overlayMessage='waiting for the boats to be ready';
    scope.isAvailable=false;

    //able to shoot
    var shoot=function(){
        scope.isAvailable=true;
        scope.overlayMessage='waiting for your enemy to fire';
    };
    //feedback from a shoot
    var result=function(data){
        var cell=getCell(data.row,data.column);
        //hit
        if(data.result.hit==true){
            //sank ?
            var boat=data.result.boat;
            if(boat.health==0){
                angular.forEach(boat.cells,function(value,key){
                    var cellToUpdate=getCell(value.row,value.column);
                    cellToUpdate.status='sunk';
                });
            }
            //only hit
            else{
                cell.status='hit';
            }
        }
        else{
            cell.status='missed';
        }
    };

    //register to the event
    grid.shoot(shoot);
    grid.result(result);

    scope.clickCell=function(cell){

        if(scope.currentPhase==='play'){
            if(cell.status==='free'){
                //fire
                grid.fire(cell.row,cell.column);
                //not player's turn anymore
                scope.isAvailable=false;
            }
            else{
                // can not fire twice at the same cell
            }
        }

    };

    var getCell=function(i,j){
        return scope.grid.getCell(i,j);
    };

}]);
