/**
 * Created with JetBrains WebStorm.
 * User: laurentrenard
 * Date: 12/4/12
 * Time: 5:22 PM
 * To change this template use File | Settings | File Templates.
 */
app.controller('playerGridCtrl',['$scope','grid','$log',function(scope,grid,log){
    //create grid accordingly to the size provided by the service
    var rows=grid.getRows();
    var columns=grid.getColumns();

    scope.grid=new Grid(rows,columns);

    //get boats from the service
    scope.boats=grid.getBoats();
    scope.currentBoat=scope.boats[0];
    scope.selectBoat=function(boat){
        if(availableSet[0].length>0 || availableSet[1].length>0 || availableSet[2].length>0 || availableSet[3].length>0){
            scope.message="finish to set the current boat before going to the next";
        }
        else{
            scope.currentBoat=boat;
        }
    };

    var availableSet=[];
    availableSet.push([]);
    availableSet.push([]);
    availableSet.push([]);
    availableSet.push([]);
    var start=null;
    //click cell
    scope.clickCell=function(cell){

        //replace message
        scope.message='place the boats';

        //placing
        if(scope.currentPhase==='placement'){

            var size = scope.currentBoat.size;
            //select start
            if (start===null) {

                //if boat is already placed:reset
                if(scope.currentBoat.cells.length>0){
                    angular.forEach(scope.currentBoat.cells,function(value,key){
                        value.boat=undefined;
                        value.status='free';
                    });
                    //better way to empty array
                    scope.currentBoat.cells=[];
                }

                if (cell.boat === undefined) {
                    start = cell;
                    setAvailability(scope.currentBoat, start);
                }
                else {
                    scope.message = 'This cell is already occupied';
                }
            }
            //choose direction
            else{
                //click one not available->restart the process
                if (cell.status!=='available') {

                    //reset availableSet
                    for(var i=0;i<availableSet.length;i++){
                        angular.forEach(availableSet[i],function(value,key){
                            value.status='free';
                        });
                        //there is a better way to empty array (splice)
                        availableSet[i]=[];
                    }
                    //don't forget the center
                    start.status='free';

                    if (cell.boat === undefined) {
                        start = cell;
                        setAvailability(scope.currentBoat, start);
                    }
                    else {
                        scope.message = 'This cell is already occupied';
                    }
                }
                //select direction
                else{
                    //if click the start one : must select a direction
                    if(cell==start){
                        scope.message='select a sens';
                    }
                    //select direction
                    else{for(var i=0;i<availableSet.length;i++){
                        if(contains(availableSet[i],cell)){
                            var boatIndex=scope.currentBoat.getIndex();
                            angular.forEach(availableSet[i],function(value,key){
                                value.boat=boatIndex;
                                value.status='occupied';
                                scope.currentBoat.cells.push(value);
                            });
                            start.boat = boatIndex;
                            start.status='occupied';
                            scope.currentBoat.cells.push(start);
                            start=null;
                        }
                        //reset others
                        else{
                            angular.forEach(availableSet[i],function(value,key){
                                value.status='free';
                            });
                        }
                        //better way to empty array
                        availableSet[i]=[];
                    }
                        //go for next boat
                        var indexCurrentBoat=indexOf(scope.boats,scope.currentBoat);
                        if((indexCurrentBoat+1)<scope.boats.length){
                            scope.currentBoat=scope.boats[indexCurrentBoat+1];
                        }

                    }
                }
            }

            //check if all the boats have been placed
            var isReady=true;
            angular.forEach(scope.boats,function(value,key){
                if(value.cells.length==0){
                    isReady=false
                }
            });
            scope.$emit('ready',{value:isReady});

        }

    };

    //helper
    var setAvailability=function(boat,first){
        var count=0;

        //right to left (same row)
        var isAvailable=true;
        if(first.column-boat.size>=0){
            for(var j=1;j<boat.size;j++){
                var cell=getCell(first.row,first.column-j);
                if(cell.status!=="free"){
                    isAvailable=false;
                }
            }
            if(isAvailable){
                for(var j=1;j<boat.size;j++){
                    cell=getCell(first.row,first.column-j);
                    cell.status='available';
                    availableSet[0].push(cell);
                    count++;
                }
            }
        }

        //left to right (same row)
        isAvailable=true;
        if(first.column+boat.size-1<=columns){
            for(var j=1;j<boat.size;j++){
                cell=getCell(first.row,first.column+j);
                if(cell.status!=='free'){
                    isAvailable=false;
                }
            }
            if(isAvailable){
                for(var j=1;j<boat.size;j++){
                    cell=getCell(first.row,first.column+j);
                    cell.status='available';
                    availableSet[1].push(cell);
                    count++;
                }
            }
        }

        //down top(same column)
        isAvailable=true;
        if(first.row+boat.size-1<=rows){
            for(var j=1;j<boat.size;j++){
                cell=getCell(first.row+j,first.column);
                if(cell.status!=='free'){
                    isAvailable=false;
                }
            }
            if(isAvailable){
                for(var j=1;j<boat.size;j++){
                    cell=getCell(first.row+j,first.column);
                    cell.status='available';
                    availableSet[2].push(cell);
                    count++;
                }
            }
        }

        //top down(same column)
        isAvailable=true;
        if(first.row-boat.size>=0){
            for(var j=1;j<boat.size;j++){
                cell=getCell(first.row-j,first.column);
                if(cell.status!=='free'){
                    isAvailable=false;
                }
            }
            if(isAvailable){
                for(var j=1;j<boat.size;j++){
                    cell=getCell(first.row-j,first.column);
                    cell.status='available';
                    availableSet[3].push(cell);
                    count++;
                }
            }
        }

        if(count>0){
            first.status='available';
            availableSet.push(first);
        }


        return count;
    };

    var getCell=function(i,j){
        return scope.grid.getCell(i,j);
    }

    //contains
    var contains=function(array,obj){
        var index=indexOf(array,obj);
        return index>=0;
    }

    //indexOf
    var indexOf=function(array,obj){
        for(var i= 0,c=array.length;i<c;i++){
            if(array[i]==obj){
                return i;
            }
        }
        return -1;
    }
}]);