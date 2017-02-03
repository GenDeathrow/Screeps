var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) 
    {
        
	    if(creep.memory.building && creep.carry.energy == 0) 
	    {
            creep.memory.building = false;
            creep.say('harvesting');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) 
	    {
	        creep.memory.building = true;
	        creep.say('building');
	    }

	    if(creep.memory.building) 
	    {
	        var targets = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
	        
	            if(creep.build(targets) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(targets);
                }
	    }
	    else 
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
                var target = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
            
                if(creep.harvest(target) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(target);
                }
	        }
	    }
	}
};

module.exports = roleBuilder;