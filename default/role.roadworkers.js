var returnHome = require('return_Home');

// Sets role for Creep.
function getDefaultRole()
{
    return "roadworker";
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

var roleRoadRepair = {
	
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
	     var hasRoads = spawn.room.find(FIND_STRUCTURES, {filter: function(structure) {return structure.structureType == STRUCTURE_ROAD}}) > 0;
	     
	     if(hasRoads && creepInRoom.length < 3)
	     {
            return true;
	     }
	     else return false;
	},
	
	// Add your spawning code here.
	spawnCreep: function(spawn)
	{
        var stats;
        if(spawn.room.controller.level <= 4)
        {
            stats = [WORK, CARRY, CARRY, CARRY, MOVE];
        }
        else
        {
           stats = [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE];
        }

        if(spawn.createCreep(stats, Creep.getRandomName('[RW]'), {role: getDefaultRole(), taskTick: 0}) == 0)
        {
            console.log('Spawning new level '+ spawn.room.controller.level +' '+ getDefaultRole() +' '+ newName);
        }
   
	},

    /** @param {Creep} creep **/
    run: function(creep) 
    {

	    if(creep.memory.repairing && creep.carry.energy == 0) 
	    {
            creep.memory.repairing = false;
            creep.say('harvesting');
	    }
	    if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) 
	    {
	        creep.memory.repairing = true;
	        creep.say('Repairing');
	    }

	    if(creep.memory.repairing) 
	    {

            var targets = creep.room.find(FIND_STRUCTURES, 
            {
                filter: object => object.structureType == STRUCTURE_ROAD && object.hits < object.hitsMax
            });

            targets.sort((a,b) => a.hits - b.hits);
            

            if(targets.length > 0) 
            {
                if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveByPath(creep.pos.findPathTo(targets[0]));    
                }
            }
	    }
	    else 
	    {
	        
	        
            var mainDropoffContainer = Game.getObjectById('47d1c0864557dae');
            
            
            // Check for containers
            if(mainDropoffContainer && mainDropoffContainer)
            {
                if(mainDropoffContainer.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(mainDropoffContainer);
                }
            }
            
            /*
	       var containers = creep.room.find(FIND_STRUCTURES, 
            {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER) &&
                            structure.store[RESOURCE_ENERGY] > 0;
                    }
            });
            
            
            
            if(containers.length > 0)
            {
                if(containers[0].transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(containers[0]);
                    
                }
            }
            /*
            else
            {
                var target = Game.getObjectById('b357077426772ba');
                if(creep.harvest(target) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(target);
                }
            }*/
	    }        
        if(getTaskTick(creep) > 300){ clearTask(creep); }
        creep.memory.taskTick++;
        
	}


};


module.exports = roleRoadRepair;