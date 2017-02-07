
// Sets role for Creep.
function getDefaultRole()
{
    return "warrior";
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

var roleWarrior = {
	
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

	     if(spawn.pos.findClosestByRange(FIND_HOSTILE_CREEPS) && creepInRoom.length <= 3)
	     {
            return true;
	     }
	     else return false;
	},
	
	// Add your spawning code here.
	spawnCreep: function(spawn)
	{
        var stats;
        if(spawn.room.controller.level <= 3)
        {
            stats = [TOUGH, TOUGH, TOUGH,TOUGH,ATTACK, MOVE];
        }
        else
        {
           stats = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, MOVE,MOVE];
        }

        if(spawn.createCreep(stats, Creep.getRandomName('[W]'), {role: getDefaultRole(), taskTick: 0}) == 0)
        {
            console.log('Spawning new level '+ spawn.room.controller.level +' '+ getDefaultRole() +' '+ newName);
        }
	},

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
            else
            {
                    creep.moveTo(36,36);
            }
        }
        
        if(getTaskTick(creep) > 300){ clearTask(creep); }
        creep.memory.taskTick++;
        
	}
};

module.exports =roleWarrior;
    
