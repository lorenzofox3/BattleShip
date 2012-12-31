/**
 * Created with JetBrains WebStorm.
 * User: laurentrenard
 * Date: 12/18/12
 * Time: 7:35 PM
 * To change this template use File | Settings | File Templates.
 */
app.service('battle',['$resource','RESOURCES','$q','$log',function(resource,constants,q,log){

    var roomsAPI=resource(constants.apiBaseUrl+'/rooms/:roomId',{roomId:'@id'},{'addGame':  {method:'POST', isArray:true}, 'removeGame':{method:'DELETE', isArray:true}});

    //fetch all the rooms
    this.all=function(){
        return roomsAPI.query();
    };

    //only one particular room
    this.get=function(id){
        //should handle the not found (404) so we use intermediate promise.
        var deferred= q.defer();
        roomsAPI.get({roomId:id},function(result){
            deferred.resolve(result);
        },function(response){
            var status=response.status;
            if(status==404){
                response.message='no battle found ...bla bla bla'
            }
            //the room is already full
            else if(status==403){
                response.message='two players are already fighting in this room';
            }
            deferred.reject(response);
        });
        return deferred.promise;
    };

    //create a game
    this.create=function(){
        var deferred= q.defer();
        roomsAPI.addGame({},{},function(response){
            //success
            deferred.resolve(response);
        },function(response){
            //error
            var status=response.status;
            if(status==401){
                response.message='you must be signed in to create a game';
            }
            deferred.reject(response);
        });
        return deferred.promise;
    };

    //remove a game
    this.remove=function(ref){
        var deferred= q.defer();
        roomsAPI.removeGame({roomId:ref},function(response){
            //success
            deferred.resolve(response);
        },function(response){
            //error
            var status=response.status;
            if(status==401){
                response.message='you must be signed in to remove a game';
            }
            deferred.reject(response);
        });
        return deferred.promise;
    };

}]);