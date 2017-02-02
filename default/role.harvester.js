var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.carry.energy < creep.carryCapacity) 
	    {
	        var sources = creep.room.find(FIND_SOURCES_ACTIVE);

            var target = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
            
                if(creep.harvest(target) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(target);
                }
                
        }
        else {
            
            var targets = creep.room.find(FIND_STRUCTURES, 
            {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.energy < structure.energyCapacity;
                    }
            });
            
            
            var containers = creep.room.find(FIND_STRUCTURES, 
            {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER) &&
                            structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
                    }
            });



            if(targets.length > 0) 
            {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
            else if(containers.length > 0)
            {
                if(creep.transfer(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(containers[0]);
                } 
            }
            
            

        }
	}
};

module.exports = roleHarvester;