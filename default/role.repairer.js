var roleRepairer = {

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
	        
	        // Looks for structures and removes any roads. so that more important sturctures can get repaired. 
	        // will prolly remove walls.. and make a wall repairer
	        
            var targets = creep.room.find(FIND_STRUCTURES, 
            {
                filter: object => object.structureType != STRUCTURE_ROAD && object.structureType != STRUCTURE_WALL && object.hits < object.hitsMax
            });

            // Sorts them by the amount of damage. not really the most effective (some sturcture decay faster and have higher health) it works
            targets.sort((a,b) => a.hits - b.hits);

            if(targets.length > 0) 
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
            
            // Check for containers
            if(containers.length > 0)
            {
                if(containers[0].transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(containers[0]);
                    
                }
            }
            else
            {
                // if no containers have engergy, begin harvesting them selves
                // These repair creeps will go tp a specific source I have desinated for them
                var target = Game.getObjectById('b357077426772ba');
                
                if(creep.harvest(target) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(target);
                }
            }
	    }
	}
};

module.exports = roleRepairer;