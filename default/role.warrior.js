var roleWarrior = {
    /** @param {Creep} creep **/
    run: function(creep) 
    {
        var closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        
        if(closestHostile) 
        {
            if(creep.attack(closestHostile) == ERR_NOT_IN_RANGE) 
            {
                    creep.moveTo(closestHostile);
            }
        }
	}
};

module.exports =roleWarrior;
    
