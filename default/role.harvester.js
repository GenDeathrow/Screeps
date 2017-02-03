var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        // This seesm to be more effiecent than the orginal example code.. havesters werent dropping all thier inventory with old code
	    if(creep.carry.energy < 50) 
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
        else {
            
            // Gets extensions, Spawn
          var targets = creep.room.find(FIND_STRUCTURES, 
            {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || 
                                structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
                    }
            });  
            // gets all towers
            var towers = creep.room.find(FIND_STRUCTURES, 
            {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
            });  
            
            
            // Gets containers
            var containers = creep.room.find(FIND_STRUCTURES, 
            {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER) &&
                            structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
                    }
            });

            if(targets.length > 0) // Fill extensions, Spawn, and Defense towers first
            {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
            else if(containers.length > 0) // Than Fill containers
            {
                if(creep.transfer(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(containers[0]);
                } 
            }else if(towers.length > 0) // Than Fill towers (not sure if I need this before containers or not)
            {
                if(creep.transfer(towers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(towers[0]);
                } 
            }
        }
	}
};

module.exports = roleHarvester;