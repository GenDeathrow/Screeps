var returnHome = require('return_Home');
var harvester = require('role.harvester');
var haulers = require('role.haulers');


// Sets role for Creep.
function getDefaultRole()
{
    return "upgrader";
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

var roleUpgrader = {
	
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
	     var hasHarvester = spawn.room.find(FIND_CREEPS, {filter: function(object) {return object.memory.role == harvester.getRole()}}).length > 3;
	     var hasHaulerCnt = spawn.room.find(FIND_CREEPS, {filter: function(object) {return object.memory.role == haulers.getRole()}}).length > 2;

	     if(creepInRoom.length < 8 && hasHarvester && hasHaulerCnt)
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
            stats = [WORK,CARRY,CARRY, MOVE];
        }
        else if(spawn.room.controller.level == 4)
        {
            stats = [WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE];
        }
        else
        {
           stats = [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE];
        }

        if(spawn.createCreep(stats, Creep.getRandomName('[U]'), {role: getDefaultRole(), taskTick: 0}) == 0)
        {
            console.log('Spawning new level '+ spawn.room.controller.level +' '+ getDefaultRole() +' '+ newName);
        }
   
	},

    /** @param {Creep} creep **/
    run: function(creep) 
    {
       
        if(returnHome.run(creep)) return;
        
        // If no energy, go refill at container.. 
	    if(creep.carry.energy == 0 && creep.carry.energy < creep.carryCapacity)
	    {
   	        var container = creep.pos.findClosestByRange(FIND_STRUCTURES, 
            {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER) &&
                            structure.store[RESOURCE_ENERGY] > 0;
                    }
            });

            var mainDropoffContainer =Game.getObjectById('47d1c0864557dae');
            
            // Check for containers

            if(container)
            {
                if(container.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                {
                    var path = creep.pos.findPathTo(container);
                    creep.moveByPath(path);
                   // creep.moveTo(containers[0]);
                    
                }
            }
            else if(mainDropoffContainer && mainDropoffContainer.energy > 0)
            {
                if(mainDropoffContainer.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(mainDropoffContainer);
                }
            }
            else
            {
                var sources = creep.room.find(FIND_SOURCES);
            
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(sources[0]);
                }
            }
        }
        else 
        {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) 
            {
                var path = creep.pos.findPathTo(creep.room.controller);
                creep.moveByPath(path);
                //creep.moveTo(creep.room.controller);
            }
        }
        if(getTaskTick(creep) > 300){ clearTask(creep); }
        creep.memory.taskTick++;
        
	}


};

module.exports = roleUpgrader;