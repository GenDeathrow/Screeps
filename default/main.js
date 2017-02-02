var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');

module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    //console.log('Harvesters: ' + harvesters.length);

    if(harvesters.length < 4) 
    {
        var newName = Game.spawns['Gehross'].createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'harvester'});
        console.log('Spawning new harvester: ' + newName);
    }
    
    // If all harvesters die, spawn a simple harvester
    if(harvesters.length == 0) 
    {
        var newName = Game.spawns['Gehross'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'harvester'});
        console.log('Spawning new harvester: ' + newName);
    }
    
    // Dont spawn anything until at least 2 harvesters exist
    if(harvesters.length >= 2)
    {
         var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        //console.log('Builders: ' + harvesters.length);
    
        if(builders.length < 4) 
        {
            var newName = Game.spawns['Gehross'].createCreep([WORK,WORK,WORK, CARRY,CARRY,MOVE,MOVE], undefined, {role: 'builder'});
            console.log('Spawning new builder: ' + newName);
        }
    
        var upgrader = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        //console.log('Builders: ' + harvesters.length);
    
        if(upgrader.length < 4) 
        {
            var newName = Game.spawns['Gehross'].createCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY, MOVE, MOVE], undefined, {role: 'upgrader'});
            console.log('Spawning new upgrader: ' + newName);
        }
    
        var repairer = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
        //console.log('Builders: ' + harvesters.length);
    
        if(repairer.length < 2) 
        {
            var newName = Game.spawns['Gehross'].createCreep([WORK, WORK, CARRY, CARRY,MOVE, MOVE, MOVE], undefined, {role: 'repairer'});
            console.log('Spawning new repairer: ' + newName);
        }
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
    }
}