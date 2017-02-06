var returnHome = require('return_Home');
require('name_generator');

// Sets role for Creep.
function getDefaultRole()
{
    return "longharvester";
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

var roleLongHarvester = {
	
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
	     
	     if(false && creepInRoom.length < 4)
	     {
            return true;
	     }
	     else return false;
	},
	
	// Add your spawning code here.
	spawnCreep: function(spawn)
	{
        var stats;
        if(spawn.room.controller.level > 0)
        {
            stats = [WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
        }

        if(spawn.createCreep(stats, Creep.getRandomName('[LH]'), {role: getDefaultRole(), taskTick: 0, dropoff: '546afe20600ec28', dest: ''}) == 0)
        {
            console.log('Spawning new level '+ spawn.room.controller.level +' '+ getDefaultRole() +' '+ newName);
        }
   
	},

    /** @param {Creep} creep **/
    run: function(creep) 
    {
        
        // This seesm to be more effiecent than the orginal example code.. havesters werent dropping all thier inventory with old code
	    if(creep.carry.energy < creep.carryCapacity) 
	    {
           
            if(creep.room.name != creep.memory.dest)
            {
                var exitToDest = creep.pos.findClosestByRange(creep.room.findExitTo(creep.memory.dest));

                creep.moveTo(exitToDest);
            }
            else
            {
                // find closest active sournce next to harvester.
                var target = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
                if(creep.harvest(target) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(target);
                }
            }
        }
        else 
        {
            var dropoff = Game.getObjectById(creep.memory.dropOff);
            
            if(!returnHome.run(creep)) {
                
                console.log(creep.transfer(dropoff, RESOURCE_ENERGY)); 
                if(creep.transfer(dropoff, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                {
                    creep.say('home');
                    creep.moveTo(dropoff);
                } 
            }
            
        }
        
        if(getTaskTick(creep) > 300){ clearTask(creep); }
        creep.memory.taskTick++;
        
      // console.log(roleBase.getTaskTick(creep))
	}


};

module.exports = roleLongHarvester;