'use strict';

//declare application module
var app=angular.module('app',[]);

//functional object required
function Grid(row,column){

    var context=this;
    this.row=row;
    this.column=column;
    this.cells=[];

    //create grid
    for(var i=1;i<=this.row;i++){
        //create a row
        var row=[];
        for(var j=1;j<=this.column;j++){
            var cell={row:i,column:j,status:'free'};
            row.push(cell);
        }
        this.cells.push(row);
    }

    //1->row, 1->column
    this.getCell=function(i,j){
        if(i<1 || i>this.row){
            new Error('wrong row index');
        }
        if(j<1 || j>this.column){
            new Error('wrong column index');
        }
        return this.cells[i-1][j-1];
    }


}

function Ship(index, name, size){
    var boatIndex=index;
    this.name=name;
    this.size=size;
    this.health=size;
    this.getIndex=function(){
        return boatIndex;
    };

    //location
    this.cells=[];
}