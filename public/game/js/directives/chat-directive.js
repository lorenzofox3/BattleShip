/**
 * Created with JetBrains WebStorm.
 * User: laurentrenard
 * Date: 12/17/12
 * Time: 2:12 PM
 * To change this template use File | Settings | File Templates.
 */

app.directive('myChat',['socket','$log',function(socket,log){
    return{
        restrict: 'E',
        replace:true,
        scope:true,
        templateUrl:'game/templates/chat-template',
        link:function(scope,element,attr){

            //messages
            scope.currentMessage='';
            scope.messages=[];
            scope.post=function(){
                //emit the message
                socket.emit('chatMessage',{author:'player',message:scope.currentMessage});
                //reset the input message
                scope.currentMessage='';
            }

            var input=$('#chatInput');
            scope.lastSeen=true;

            //receive
            socket.on('chatMessage',function(message){
                var newMessage={author:message.author,message:message.message, class:message.author};
                scope.messages.push(newMessage);
                if(!input.is(":focus")){
                    scope.lastSeen=false;
                }
            });

            input.focus(function(event){
                scope.$apply(function(){
                    scope.lastSeen=true;
                });
            });

            scope.$watch('lastSeen',function(newvalue,oldvalue){
                newvalue==true?element.removeClass('blink'):element.addClass('blink');
            });

            //expand/reduce
            scope.isExpanded=true;
            scope.size=function(){
                scope.isExpanded=!scope.isExpanded;
            }
            scope.$watch('isExpanded',function(newvalue,oldvalue){
                if(newvalue){
                    element.removeClass('reduced').addClass('expanded');
                }
                else{
                    element.removeClass('expanded').addClass('reduced');
                }
            });
        }

    }
}]);
