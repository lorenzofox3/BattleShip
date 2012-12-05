/**
 * Created with JetBrains WebStorm.
 * User: laurentrenard
 * Date: 12/4/12
 * Time: 3:33 PM
 * To change this template use File | Settings | File Templates.
 */
app.directive('cell',[function(){
    return{
        restrict:'E',
        template:'<div>{{boat}}</div>',
        replace:true,
        scope:{
            status:'=status',
            boat:'=boat'
        },
        link:function(scope,element,attr){
            scope.$watch('status',function(newvalue,oldvalue){
                element.removeClass(oldvalue).addClass(newvalue);
            })

        }
    }
}]);