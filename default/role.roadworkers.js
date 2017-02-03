var roleRoadRepair = {

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

            var targets = creep.room.find(FIND_STRUCTURES, 
            {
                filter: object => object.structureType == STRUCTURE_ROAD && object.hits < object.hitsMax
            });

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
                var target = Game.getObjectById('b357077426772ba');
                if(creep.harvest(target) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(target);
                }
            }
	    }
	}
};

module.exports = roleRoadRepair;