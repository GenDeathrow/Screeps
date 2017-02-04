var roleHauler = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        
        // This seesm to be more effiecent than the orginal example code.. havesters werent dropping all thier inventory with old code
	    if(creep.carry.energy == 0) 
	    {

	        // find closest active sournce next to harvester.
            var container = creep.pos.findClosestByRange(FIND_STRUCTURES, 
            {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER) &&
                            structure.store[RESOURCE_ENERGY] > 0;
                    }
            });
            
           if(container && container.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
           {
                creep.moveTo(container);
           }
           else
           {
               // Move Haulers out of the way if the have no job
               creep.moveTo(32,28);
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
            
            

            if(targets && creep.transfer(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
            {
                creep.moveTo(targets);
            }
            else if(towers && creep.transfer(towers, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
            {
                creep.moveTo(towers);
            } 
    
        }
	}
};

module.exports = roleHauler;