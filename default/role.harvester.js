var returnHome = require('return_Home');
require('name_generator');

// Sets role for Creep.
function getDefaultRole()
{
    return "harvester";
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
	
	
var roleHarvester = {
    // Dont change this, its just for grabbing method above
	getRole: function()
	{
	    return getDefaultRole();
	},
	
	/** @param {Spawn} spawn**/
	// determin if you want to spawn this type
	shouldSpawn: function(spawn)
	{
	     var creepInRoom = spawn.room.find(FIND_CREEPS, {filter: function(object) {return object.memory.role == getDefaultRole()}});

	     if(creepInRoom.length < 6)
	     {
            return true;
	     }
	     else return false;
	},
	
	spawnCreep: function(spawn)
	{
	    var sources = spawn.room.find(FIND_SOURCES);

        var sourceid;
        

	    if(sources[0])
	    {
	        var sourcesSet = _.filter(Game.creeps, (creep) => creep.memory.hasSource == sources[0].id);
	        
	        if(sourcesSet.length < 3)
	        {
	            sourceid = sources[0].id;
	        }
	    }
        if(sources[1] && !sourceid)
        {
         
            var sourcesSet = _.filter(Game.creeps, (creep) => creep.memory.mainContainer == sources[1].id);

            if(sourcesSet.length < 3)
            {
                sourceid = sources[1].id;
            }
        }

        var stats;
        
        if(spawn.room.controller.level <= 3)
        {
            stats = [WORK,CARRY,MOVE]
        }
        else
        {
           stats = [WORK,WORK,WORK,WORK,CARRY,MOVE];
        }

        if(spawn.createCreep(stats,  Creep.getRandomName('[H][Mk3]'), {role: getDefaultRole(), hasSource: sourceid, home: spawn.name}) == 0)
        {
            console.log('Spawning new level '+ spawn.room.controller.level +' '+ getDefaultRole() +' '+ newName);
        }
   
	},
	
    /** @param {Creep} creep **/
    run: function(creep) 
    {
        var returnHome = require('return_Home');
        
        // This seesm to be more effiecent than the orginal example code.. havesters werent dropping all thier inventory with old code
	    if(creep.carry.energy < creep.carryCapacity) 
	    {
	        
	        if(creep.memory.hasSource)
	        {

                var target = Game.getObjectById(creep.memory.hasSource);
                
                if(creep.harvest(target) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(target);
                }

	        }
	        else
	        {
                // currently not used.. will 	        
	            var sources = creep.room.find(FIND_SOURCES_ACTIVE);
	        
	            // find closest active sournce next to harvester.
                var target = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
            
                if(creep.harvest(target) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(target);
                }
	        }
                
        }
        else {
            
            // Gets extensions, Spawn
          var targets = creep.room.find(FIND_STRUCTURES, 
            {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || 
                                structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
                    }
            });  

            // Gets containers
            var containers = creep.pos.findClosestByPath(FIND_STRUCTURES, 
            {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER);
                    }
            });

            if(containers && creep.transfer(containers, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
            {
                creep.moveTo(containers);
            }else if(targets.length > 0) // Fill extensions, Spawn, and Defense towers first
            {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
        }

        if(getTaskTick(creep) > 300){ clearTask(creep); }
        creep.memory.taskTick++;
	}


};


module.exports = roleHarvester;