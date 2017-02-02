var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) 
    {
	    if(creep.carry.energy == 0)
	    {
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
                creep.moveTo(creep.room.controller);
            }
        }
	}
};

module.exports = roleUpgrader;