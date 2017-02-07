var returnHome = require('return_Home');
require('name_generator');

// Sets role for Creep.
function getDefaultRole()
{
    return "hauler";
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

var roleHauler = {
	
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
	     
	     var containers = spawn.room.find(FIND_STRUCTURES, {filter: function(structure) {return structure.structureType == STRUCTURE_CONTAINER}})
	     
	    
	     
	     if(creepInRoom.length < 4 && containers.length > 0)
	     {
            return true;
	     }
	     else return false;
	},
	
	// Add your spawning code here.
	spawnCreep: function(spawn)
	{
        var stats;
        
	    var sources = spawn.room.find(FIND_SOURCES);
	    var container;
	    
	    if(sources[0])
	    {
	       var consearch = sources[0].pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER);
                }
            });
            
            if(consearch) container = consearch.id;
	    }
	    if(sources[1] && !container)
	    {
	       var consearch = sources[1].pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER);
                }
            });
            
            if(consearch) container = consearch.id;
	    }


        var creepInRoom = spawn.room.find(FIND_CREEPS, {filter: function(object) {return object.memory.role == getDefaultRole()}});
        if(creepInRoom == 0)
        {
            Stats = [CARRY, MOVE];
        }
        if(spawn.room.controller.level <= 3)
        {
            stats = [CARRY, CARRY, MOVE, MOVE];
        }
        else
        {
           stats = [CARRY, CARRY,CARRY, CARRY, MOVE];
        }

        if(spawn.createCreep(stats, Creep.getRandomName('[HL]'), {role: getDefaultRole(), mainContainer: container, taskTick: 0}) == 0)
        {
            console.log('Spawning new level '+ spawn.room.controller.level +' '+ getDefaultRole() +' '+ newName);
        }
   
	},

    /** @param {Creep} creep **/
    run: function(creep) 
    {
        if(returnHome.run(creep)) return;

        // This seesm to be more effiecent than the orginal example code.. havesters werent dropping all thier inventory with old code
	    if(creep.carry.energy == 0) 
	    {
            var container;
            
            var dropenergy = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
            // If any energy is droped.. pick it up first, than go back to normal duties
            if(dropenergy)
            {
                if(creep.pickup(dropenergy))
                {
                    creep.moveTo(dropenergy);
                }
            }
            else{

                var container;
            
                if(creep.memory.mainContainer)
                {
                  container = Game.getObjectById(creep.memory.mainContainer);
                  
                }
                else
                {
	                // find closest active sournce next to harvester.
                    container = creep.pos.findClosestByRange(FIND_STRUCTURES, 
                    {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_CONTAINER) &&
                                structure.store[RESOURCE_ENERGY] > 0;
                        }
                    });
                }
            

                if(container && container.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(container);
                }
                else if(container)
                {
                    creep.moveTo(container)
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
            
            // gets all towers
            var towers = creep.pos.findClosestByRange(FIND_STRUCTURES, 
            {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
            }); 
            
            //if(creep.memory.transferToMain)
            //{
              //  var dropoff = mainGame.getObjectById('7bb0bceece09273');
                
                
//            }
            
            //If this creep has a specfic drop off point            
            if(creep.memory.dropOff)
            {
                var dropoff = Game.getObjectById(creep.memory.dropOff);
                
                if(creep.transfer(dropoff, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(dropoff);
                }
            }
            else if(targets && creep.transfer(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
            {
                creep.moveTo(targets);
            }
            else if(towers && creep.transfer(towers, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
            {
                creep.moveTo(towers);
            } 
    
        }
        
        if(getTaskTick(creep) > 300){ clearTask(creep); }
        creep.memory.taskTick++;
	}


};


module.exports = roleHauler;