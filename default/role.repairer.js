var returnHome = require('return_Home');
require('name_generator');

// Sets role for Creep.
function getDefaultRole()
{
    return "repairer";
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

var roleRepairer = {
	
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
	     
	     if(creepInRoom.length < 2)
	     {
            return true;
	     }
	     else return false;
	},
	
	// Add your spawning code here.
	spawnCreep: function(spawn)
	{
        var stats;
        if(spawn.room.controller.level <= 3)
        {
            stats = [WORK, CARRY, CARRY, MOVE];
        }
        else
        {
           stats = [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE];
        }

        if(spawn.createCreep(stats, Creep.getRandomName('[R]'), {role: getDefaultRole(), taskTick: 0}) == 0)
        {
            console.log('Spawning new level '+ spawn.room.controller.level +' '+ getDefaultRole() +' '+ newName);
        }
   
	},

    /** @param {Creep} creep **/
    run: function(creep) 
    {

       // if they get lost find thier way back home.
        
        if(returnHome.run(creep)) return;

	    if(creep.memory.repairing && creep.carry.energy == 0) 
	    {
            creep.memory.repairing = false;
            creep.say('Harvesting');
	    }
	    if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) 
	    {
	        creep.memory.repairing = true;
	        creep.say('Repairing');
	    }

	    if(creep.memory.repairing) 
	    {
	        
	        // Looks for structures and removes any roads. so that more important sturctures can get repaired. 

            var targets = creep.room.find(FIND_STRUCTURES, 
            {
                filter: object => object.structureType != STRUCTURE_ROAD && object.structureType != STRUCTURE_WALL && object.hits < object.hitsMax
            });
            
           // Pull from containers that have hitpoint lose
	       var containers = creep.room.find(FIND_STRUCTURES, 
            {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER) && structure.hits < structure.hitsMax;
                    }
            });

            // Sorts them by the amount of damage. not really the most effective (some sturcture decay faster and have higher health) it works
            targets.sort((a,b) => (a.hits/a.hitsMax) - (b.hits/b.hitsMax));

            // This forces the repaiers to repair containers first.. got tired of them skipping it.. than they will repair other stuff. 
            if(containers.length > 0)
            {
                if(creep.repair(containers[0]) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(containers[0]);    
                }
            }
            else if(targets.length > 0) 
            {
                if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(targets[0]);    
                }
            }
	    }
	    else 
	    {
	        // Pull from containers first for energy filtering 
	       var containers = creep.room.find(FIND_STRUCTURES, 
            {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER) &&
                            structure.store[RESOURCE_ENERGY] > 0;
                    }
            });

            var mainDropoffContainer =Game.getObjectById('47d1c0864557dae');
            
            // Check for containers
            if(mainDropoffContainer && mainDropoffContainer.energy > 0)
            {
                if(mainDropoffContainer.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(mainDropoffContainer);
                }
            }
            else if(containers.length > 0)
            {
                if(containers[0].transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(containers[0]);
                }
            }
        }
        if(getTaskTick(creep) > 300){ clearTask(creep); }
        creep.memory.taskTick++;
        
	}


};

module.exports = roleRepairer;