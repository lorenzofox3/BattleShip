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
    scope.getCell=function(i,j){
        return grid.getCell(i,j);
    };

    scope.isAvailable=false;

    //watch the phase and set the field available
    scope.$watch('currentPhase',function(newval,oldval){
        if(newval==='play'){
            scope.isAvailable=true;
        }
    })

    scope.clickCell=function(cell){

        if(scope.currentPhase==='play'){
            if(cell.status==='free'){
                //fire
                cell.status='missed';

            }
            else{
                // can not fire twice at the same cell
            }
        }

    };
}]);
