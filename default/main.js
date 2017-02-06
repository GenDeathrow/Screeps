require('name_generator');

// Contains all your creep classes
var rolesArray = new Array( require('role.harvester'),
                            require('role.haulers'),
                            require('role.repairer'),
                            require('role.builder'),
                            require('role.upgrader'),
                            require('role.warrior'),
                            require('role.long_range_harvesters'),
                            require('role.roadworkers'),
                            require('role.wallWorker'),
                            require('role.troll'));


//Main Loop
module.exports.loop = function () {

    // When a creep dies they removes them from memory << YOU WANT THIS
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }


    //My Tower Code from tutorial
    var tower = Game.getObjectById('9faf0bc402da196');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    
    //Spawn the creeps
    SpawnCreeps();


    //Run the creeps
    CreepTicks();
 
}


// Spawns all creeps based on roles (my first town is hardcoded, but you could make this dynamic for each spawn you have.)
function SpawnCreeps()
{
    for(i=0;i < rolesArray.length; i++)
    {
        //console.log(rolesArray[i].shouldSpawn(Game.spawns['Gehross']));
        if(rolesArray[i].shouldSpawn(Game.spawns['Gehross']))
        {
            rolesArray[i].spawnCreep(Game.spawns['Gehross']);
        }
    }
}

// This runs the creeps code to make them do stuff
function CreepTicks(){
    for(var name in Game.creeps) 
    {
        var creep = Game.creeps[name];
        
        for(i=0;i < rolesArray.length; i++)
        {
            if(creep.memory.role == rolesArray[i].getRole(creep))
            {
                rolesArray[i].run(creep);
                break;
            }
        }
    }
}