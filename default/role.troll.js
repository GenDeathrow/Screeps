var roleTroll = {
//Game.spawns['Gehross'].createCreep([MOVE,MOVE,MOVE,MOVE,MOVE], 'Birthday Gram', {role: 'troll',messageIndex: 0, prevTime: Date.now(), firstDest: false});
    /** @param {Creep} creep **/
    run: function(creep) 
    {
        var firstDest = "W4N3";
        var dest = "W8N3";
        
        var avoidDest = ['W6N6','W5N6','W4N6','W6N5','W5N5','W5N4','W4N6','W4N5','W4N4'];
        
        if(creep.room.name == firstDest) creep.memory.firstDestHit = true;
        
        if(creep.room.name != dest )
        {
            var exitToDest;
            if(creep.memory.firstDestHit == true)
            {
                 exitToDest = creep.pos.findClosestByRange(creep.room.findExitTo(dest));
            }else
            {
                 exitToDest = creep.pos.findClosestByRange(creep.room.findExitTo(firstDest));
            }
            
            creep.moveTo(exitToDest);
        }else
        {
            creep.moveTo(32,11);
        }
        
        var birthday = ['Happy', 'Birthday', 'To You', ' Happy', 'Birthday', 'To You', 'Happy', 'Birthday', 'Darkosto', 'Happy', 'Birthday', 'to you'];
        
        var curTime = Date.now();
        
        //console.log(parseInt(creep.memory.prevTime) - curTime);
        
        if((curTime - parseInt(creep.memory.prevTime)) > 3000)
        {
            
            creep.say(birthday[creep.memory.messageIndex], true)
            
            if(creep.memory.messageIndex++ > birthday.length-1)
            {
                creep.memory.messageIndex = 0;
            }
            
            creep.memory.prevTime = Date.now();
        }
        
	}
};

function contains(arr, obj) {
    

for (var i = 0; i < arr.length; i++) {
        if (arr[i] === obj) {
            return true;
        }
    }
    return false;
}


module.exports = roleTroll;