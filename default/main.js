var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleRoadWorker = require('role.roadworkers');
var roleWallWorker = require('role.wallWorker');
var roleTroll = require('role.troll');

require('name_generator');

module.exports.loop = function () {


    // When a creep dies they removes them from memory << YOU WANT THIS
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }


    //My Tower Code from tutorial
    var tower = Game.getObjectById('95caf8b1abdb5b8');
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


    /*#############
      ## Spawning Rules
      ################*/

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    // Spawn my higher tier harvesters first
    if(harvesters.length < 4) 
    {
        var newName = Game.spawns['Gehross'].createCreep([WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE], Creep.getRandomName('[H][Mk3]'), {role: 'harvester'});
        if(newName == 0)
        {
            console.log('Spawning new harvester: ' + newName);
        }
    }
    
    // If all harvesters die
    if(harvesters.length == 0) 
    {
        var newName = Game.spawns['Gehross'].createCreep([WORK,CARRY,MOVE], Creep.getRandomName('[H]'), {role: 'harvester'});
        if(newName == 0)
        {
            console.log('Spawning Emergency harvester: ' + newName);
        }
    }
    
    // Dont spawn anything until at least x amount harvesters exist
    if(harvesters.length >= 3)
    {
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');

        var possibleConstruction = Game.spawns['Gehross'].room.find(FIND_CONSTRUCTION_SITES);

        if(possibleConstruction.length > 0 && builders.length < 2) 
        {
            var newName = Game.spawns['Gehross'].createCreep([WORK,WORK, CARRY,CARRY,MOVE], Creep.getRandomName('[B]'), {role: 'builder'});
            
            if(newName != ERR_NOT_ENOUGH_ENERGY)
            {
                console.log('Spawning new builder: ' + newName);
            }
        }

        // Upgraders Spawning    
        var upgrader = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        if(upgrader.length < 6) 
        {
            var newName = Game.spawns['Gehross'].createCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY, MOVE, MOVE], Creep.getRandomName('[U]'), {role: 'upgrader'});
            if(newName != ERR_NOT_ENOUGH_ENERGY)
            {
                console.log('Spawning new upgrader: ' + newName);
            }
        }
    
        var repairer = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');

        if(repairer.length < 3) 
        {
            var newName = Game.spawns['Gehross'].createCreep([WORK, WORK, WORK, CARRY, CARRY, MOVE], Creep.getRandomName('[R]'), {role: 'repairer'});
           if(newName != ERR_NOT_ENOUGH_ENERGY)
            {
                console.log('Spawning new repairer: ' + newName);
            }
        }
        
        var roadworker = _.filter(Game.creeps, (creep) => creep.memory.role == 'roadworker');

        if(roadworker.length < 3) 
        {
            var newName = Game.spawns['Gehross'].createCreep([WORK, WORK, WORK, CARRY, CARRY, MOVE], Creep.getRandomName('[RW]'), {role: 'roadworker'});
           if(newName != ERR_NOT_ENOUGH_ENERGY)
            {
                console.log('Spawning new road worker: ' + newName);
            }
        }
        
        var wallworker = _.filter(Game.creeps, (creep) => creep.memory.role == 'wallworker');

        if(wallworker.length < 2) 
        {
            var newName = Game.spawns['Gehross'].createCreep([WORK, WORK, WORK, CARRY, CARRY, MOVE], Creep.getRandomName('[WW]'), {role: 'wallworker'});
           if(newName != ERR_NOT_ENOUGH_ENERGY)
            {
                console.log('Spawning new wall worker: ' + newName);
            }
        }

        
/*        var troll = _.filter(Game.creeps, (creep) => creep.memory.role == 'troll');
        //console.log('Builders: ' + harvesters.length);
    
        if(troll.length == 0) 
        {
//            var newName = Game.spawns['Gehross'].createCreep([MOVE,MOVE,MOVE,MOVE,MOVE], 'Birthday Gram', {role: 'troll',messageIndex: 0, prevTime: Date.now(), firstDest: false});
           if(newName != ERR_NOT_ENOUGH_ENERGY)
            {
                console.log('Spawning new repairer: ' + newName);
            }
        }
  */      
    }
    
    
    for(var name in Game.creeps) 
    {
        var creep = Game.creeps[name];
        
        if(creep.memory.role == 'harvester') 
        {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') 
        {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') 
        {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'repairer') 
        {
            roleRepairer.run(creep);
        }
        if(creep.memory.role == 'roadworker') 
        {
            roleRoadWorker.run(creep);
        }
        if(creep.memory.role == 'wallworker') 
        {
            roleWallWorker.run(creep);
        }
        if(creep.memory.role == 'troll') 
        {
            roleTroll.run(creep);
        }
    }
}