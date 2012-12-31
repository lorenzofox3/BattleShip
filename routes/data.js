/**
 * Created with JetBrains WebStorm.
 * User: laurentrenard
 * Date: 12/20/12
 * Time: 6:33 PM
 * To change this template use File | Settings | File Templates.
 */

function Room(name,id){
    var ref=id;
    var players=[];
    var roomName=name;
    this.onPlay=null;

    //not to expose private attributes
    this.getPlayers=function(){return players;};
    this.id=function(){return ref;};
    this.getName=function(){return roomName;};
    this.current=function(){
        if(this.onPlay===null){
            if(players.length>0){
                this.onPlay=players[0];
            }
        }
        return this.onPlay;
    };

}

//expose the data only
Room.prototype.export=function(){
    return {name:this.getName(),ref:this.id(),count:this.count()};
}
//return all the players
Room.prototype.all=function(){
    return this.getPlayers();
};
//return a given socket
Room.prototype.get=function(socket){
    var players=this.getPlayers();
    for(var i= 0;i<players.length;i++){
        if(players[i].socket==socket){
            return players[i];
        }
    }
    return null;
};

Room.prototype.other=function(socket){
    var players=this.getPlayers();
    for(var i= 0;i<players.length;i++){
        if(players[i].socket!=socket){
            return players[i];
        }
    }
    return null;
};

Room.prototype.add=function(socket){
    var players=this.getPlayers();
    //maximum two players
    if(players.length<2){
        //we are not in yet
        if(this.get(socket)===null){
            players.push({socket:socket});
            return true;
        }
    }
    else return false;
};

Room.prototype.count=function(){
    return this.getPlayers().length;
};

Room.prototype.check=function (socket, row, column) {
    var target = this.get(socket);
    for (var j = 0; j < target.boats.length; j++) {
        for (var k = 0; k < target.boats[j].cells.length; k++) {
            //touched
            if (target.boats[j].cells[k].row == row && target.boats[j].cells[k].column == column) {
                //reduce health
                target.boats[j].health = target.boats[j].health - 1;
                target.health=target.health-1;
                return { hit:true, boat:target.boats[j]};
            }
        }
    }
    return {hit:false};
}

Room.prototype.update=function(){
    var players=this.getPlayers();
    if(players.length==2){
        this.onPlay=this.other(this.onPlay.socket);
    }
}

Room.prototype.leave=function(socket){
    var players=this.getPlayers();
    var player=this.get(socket);
    var index=players.indexOf(player);
    if(index>=0){
        players.splice(index,1);
    }
};

function dbSession(){
    var data=[new Room('big fight',1), new Room('super fight',2)];

    //get a proper id (private function)
    function getId(){
        var id=0;
        for(var i=0;i<data.length;i++){
            id=Math.max(id,data[i].id());
        }
        return id+1;
    }

    //get a reference to a room object
    function getRoom(id){
        for(var i=0;i<data.length;i++){
            if(data[i].id()==id){
                return data[i];
            }
        }
        return null;
    }

    //to be deleted
    this.reference=function(ref){
        return getRoom(ref);
    };

    //return all rooms
    this.all=function(){
        var rooms=[];
        for(var i=0;i<data.length;i++){
            rooms.push(data[i].export());
        }
        return rooms;
    };

    //return a given room (serialized fo network :not a reference)
    this.room=function(ref){
        var room=getRoom(ref);
        if(room){
            return room.export();
        }
        else return null;
    };

    //create a room
    this.createRoom=function(name){
        var id=getId();
        data.push(new Room(name,id));
    };

    //delete a room
    this.deleteRoom=function(id){
        var room=getRoom(id);
        if(room){
            data.splice(data.indexOf(room),1);
            return true;
        }
        return false;
    };

    //join
    this.join=function(socket,roomid){
        var room=getRoom(roomid);
        if(room){
            return room.add(socket);
        }else{
            return false;
        }

    };

};

module.exports=new dbSession();