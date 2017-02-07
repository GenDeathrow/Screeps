var returnHome = require('return_Home');

// Sets role for Creep.
function getDefaultRole()
{
    return "builder";
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

var roleBuilder = {
	
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
         var possibleConstruction = spawn.room.find(FIND_CONSTRUCTION_SITES);    

	     if(possibleConstruction.length > 0 && creepInRoom.length < 3)
	     {
            return true;
	     }
	     else return false;

	},
	
	// Add your spawning code here.
	spawnCreep: function(spawn)
	{
        var stats;
        if(spawn.room.controller.level < 4)
        {
            stats = [WORK, CARRY,CARRY,MOVE];
        }
        else
        {
           stats = [WORK,WORK,CARRY,CARRY,CARRY, MOVE];
        }

        if(spawn.createCreep(stats, Creep.getRandomName('[B]'), {role: getDefaultRole(), taskTick: 0}) == 0)
        {
            console.log('Spawning new level '+ spawn.room.controller.level +' '+ getDefaultRole() +' '+ newName);
        }
   
	},

    /** @param {Creep} creep **/
    run: function(creep) 
    {
        if(returnHome.run(creep)){return;}
        
	    if(creep.memory.building && creep.carry.energy == 0) 
	    {
            creep.memory.building = false;
            creep.say('Harvesting');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) 
	    {
	        creep.memory.building = true;
	        creep.say('building');
	    }

	    if(creep.memory.building) 
	    {
	        var targets = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
	        
	            if(creep.build(targets) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(targets);
                }
	    }
	    else 
	    {

	        var containers = creep.room.find(FIND_STRUCTURES, 
            {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER) &&
                            structure.store[RESOURCE_ENERGY] > 0;
                    }
            });
            
            if(containers.length > 0)
            {
                if(containers[0].transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE || creep.memory.lockedTask == "container" && containers[0]) 
                {
                    creep.moveTo(containers[0]);
                    setTask(creep,"container");
                    
                }
            }
	        else
	        {
                var target = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
            
                if(creep.harvest(target) == ERR_NOT_IN_RANGE || creep.memory.lockedTask == "harvest" && target) 
                {
                    setTask(creep,"harvest");
                    creep.moveTo(target);
                }
	        }
	        
	    }
        
        if(getTaskTick(creep) > 300){ clearTask(creep); }
        creep.memory.taskTick++;
	}


};


module.exports = roleBuilder;