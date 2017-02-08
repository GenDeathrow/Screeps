var returnHome = require('return_Home');
require('name_generator');

// Sets role for Creep.
function getDefaultRole()
{
    return "example"; //<< Change this to your creeps role/class name
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
    creep.memory.taskTick = 0;
    setTask(creep, null);    
}

var roleBase = {
	
	// DO NOT CHANGE THIS, change the default role above
	getRole: function()
	{
	    return getDefaultRole();
	},
	
	/** @param {Spawn} spawn**/
	
	// determine if you want to spawn this type, Used in the main.js under SpawnCreeps function
	shouldSpawn: function(spawn)
	{
	     var creepInRoom = spawn.room.find(FIND_CREEPS, {filter: function(object) {return object.memory.role == getDefaultRole()}});
	     
	     if(creepInRoom.length < 1)
	     {
            return true;
	     }
	     else return false;
	},
	
	// Add your spawning code here.
	spawnCreep: function(spawn)
	{
        var stats;
        if(spawn.room.controller.level <= 3) //<< Spawns your creeps Stats at what ever controller level you currently have. 
        {
            stats = [TOUGH,TOUGH]; // Sets your STATS here. 
        }
        else
        {
           stats = [TOUGH,TOUGH,TOUGH];
        }
		// Creep.getRandomName('[E]') << Gets a random name with [E] tag for example
		
        if(spawn.createCreep(stats, Creep.getRandomName('[E]'), {role: getDefaultRole(), taskTick: 0}) == 0)
        {
            console.log('Spawning new level '+ spawn.room.controller.level +' '+ getDefaultRole() +' '+ newName);
        }
   
	},

    /** @param {Creep} creep **/
    run: function(creep) 
    {
        //Add your code here that you normally run to make the creep do stuff


		/*
			This is experimental, I was tired of creeps getting tied up in loops. so using ticks and a task. I could make them wait on stuff if needed
			After so many ticks it would erase the task, and pick a new task.. IE waiting for one container to fill up instead of traveling to another.. 
			then it gets empted and he trys to travel back to the original container cause now it has energy.. than it gets emptied.. and its a lOOOPPP!!!!..
			
			I think I am using it on... my repairers.. not sure. 
		 */
        
        if(getTaskTick(creep) > 300){ clearTask(creep); } 
		creep.memory.taskTick++;  
	}


};

module.exports=roleBase;
    
