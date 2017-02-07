var returnHome = require('return_Home');

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

        var harvestersCNT = spawn.room.find(FIND_CREEPS, {filter: function(object) {return object.memory.role == getDefaultRole()}}).length;
        var stats;
        if(spawn.room.controller.level < 3 || harvestersCNT == 0)
        {
            stats = [WORK,CARRY,MOVE]
        }
        if(spawn.room.controller.level == 4 )
        {
            stats = [WORK,WORK,WORK,CARRY,MOVE];
        }
        else
        {
           stats = [WORK,WORK,WORK,WORK,CARRY,MOVE];
        }

        if(spawn.createCreep(stats,  Creep.getRandomName('[HV]'), {role: getDefaultRole(), hasSource: sourceid, home: spawn.name}) == 0)
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
          var targets = creep.pos.findClosestByRange(FIND_STRUCTURES, 
            {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || 
                                structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
                    }
            }); 

            // Gets containers
            container = creep.pos.findClosestByRange(FIND_STRUCTURES, 
            {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
                }
            });

            if(container && creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
            {
                creep.moveTo(container);
            }else if(targets) // Fill extensions, Spawn, and Defense towers
            {
                if(creep.transfer(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets);
                }
            }
        }

        if(getTaskTick(creep) > 300){ clearTask(creep); }
        creep.memory.taskTick++;
	}


};


module.exports = roleHarvester;