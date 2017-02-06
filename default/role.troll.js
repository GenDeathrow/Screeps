var returnHome = require('return_Home');
require('name_generator');

// Sets role for Creep.
function getDefaultRole()
{
    return "troll";
}

// Grap this creeps custom tick counter
function getTaskTick(creep)
{
    return creep.memory.taskTick;
}
	
// Set a task string (used if you need to lock a task)
function setTask(creep, task)
{
    creep.memory.lockedTask = task;
}

// Cleares task and resets tick handler
function clearTask(creep)
{
    creep.memory.lockedTask = null;
    setTask(creep, null);    
}

var roleTroll = {
	
	// do not change this, change the default role above
	getRole: function()
	{
	    return getDefaultRole();
	},
	
	/** @param {Spawn} spawn**/
	// determin if you want to spawn this type
	shouldSpawn: function(spawn)
	{
	     var creepInRoom = spawn.room.find(FIND_CREEPS, {filter: function(object) {return object.memory.role == getDefaultRole()}});
	     
	     if(false && creepInRoom.length < 1)
	     {
            return true;
	     }
	     else return false;
	},
	
	// Add your spawning code here.
	spawnCreep: function(spawn)
	{
        var stats = [MOVE,MOVE,MOVE,MOVE,MOVE];

        if(spawn.createCreep(stats, Creep.getRandomName('[E]'), {role: getDefaultRole(), taskTick: 0}) == 0)
        {
            console.log('Spawning new level '+ spawn.room.controller.level +' '+ getDefaultRole() +' '+ newName);
        }
   
	},

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
                
        if(getTaskTick(creep) > 300){ clearTask(creep); }
        creep.memory.taskTick++;
        

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