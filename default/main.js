var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleRoadWorker = require('role.roadworkers');
var roleWallWorker = require('role.wallWorker');
var roleWarrior = require('role.warrior');
var roleTroll = require('role.troll');
var roleHauler = require('role.haulers');

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


    //########
    //# Harvesters High Tier
    //#######################
    
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    // Spawn my higher tier harvesters first
    if(harvesters.length < 4) 
    {
        
        var source1 = _.filter(Game.creeps, (creep) => creep.memory.hasSource == 'a80c077426766aa');
        var source2 = _.filter(Game.creeps, (creep) => creep.memory.hasSource == 'b357077426772ba');
        
        var source = "";
        if(source1.length < 2)
        {
            source = 'a80c077426766aa';
        }
        else if(source2.length < 2)
        {
            source = 'b357077426772ba';
        }
        
        var newName = Game.spawns['Gehross'].createCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE], Creep.getRandomName('[H][Mk3]'), {role: 'harvester', hasSource: source});
        if(newName == 0)
        {
            console.log('Spawning new harvester: ' + newName +' S:'+ source);
        }
    }
    
    
    //########
    //# Haulers Spawn
    //#######################
    var hauler = _.filter(Game.creeps, (creep) => creep.memory.role == 'hauler');
    if(hauler.length < 4) 
    {
        // Emergancy Hauler
        if(hauler.length == 0)
        {
            var newName = Game.spawns['Gehross'].createCreep([CARRY, MOVE], Creep.getRandomName('[H]'), {role: 'hauler'});
            if(newName  == 0)
            {
                console.log('Spawning new wall Emergency Hauler: ' + newName);
            }
        }else 
        {
            // Higher Tier Hauler
            var newName = Game.spawns['Gehross'].createCreep([CARRY, CARRY,CARRY,CARRY, CARRY, CARRY,MOVE, MOVE], Creep.getRandomName('[H]'), {role: 'hauler'});
            if(newName  == 0)
            {
                console.log('Spawning new wall Hauler: ' + newName);
            }
        }
    }

    
    //########
    //# Emergency Harvester if High tiers are dead
    //#######################
    if(harvesters.length == 0) 
    {
        var newName = Game.spawns['Gehross'].createCreep([WORK,CARRY,MOVE], Creep.getRandomName('[H]'), {role: 'harvester'});
        if(newName == 0)
        {
            console.log('Spawning Emergency harvester: ' + newName);
        }
    }

    //########
    //# Warriors Spawn if enemy is present
    //#######################
    var warrior = _.filter(Game.creeps, (creep) => creep.memory.role == 'warrior');
    if(Game.spawns['Gehross'].pos.findClosestByRange(FIND_HOSTILE_CREEPS) &&warrior.length < 10) 
    {
        var newName = Game.spawns['Gehross'].createCreep([ATTACK, ATTACK, ATTACK, ATTACK, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE], Creep.getRandomName('[W]'), {role: 'warrior'});
       if(newName == 0)
        {
            console.log('Spawning new Warrior: ' + newName);
        }
    }
        
        
        
    //########
    //# Make sure I have at least 3 harvesters and 1 Hauler before I spawn any other classes
    //#######################
    if(harvesters.length >= 3 && hauler.length >= 1)
    {
        
            
        //########
        //# Builders Spawn
        //#######################
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        var possibleConstruction = Game.spawns['Gehross'].room.find(FIND_CONSTRUCTION_SITES);
        if(possibleConstruction.length > 0 && builders.length < 3) 
        {
            var newName = Game.spawns['Gehross'].createCreep([WORK,WORK, CARRY,CARRY,MOVE], Creep.getRandomName('[B]'), {role: 'builder'});
            
            if(newName == 0)
            {
                console.log('Spawning new builder: ' + newName);
            }
        }
  

        //########
        //# Upgraders Spawn
        //#######################  
        var upgrader = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        if(upgrader.length < 6) 
        {
            var newName = Game.spawns['Gehross'].createCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY, MOVE, MOVE], Creep.getRandomName('[U]'), {role: 'upgrader'});
            if(newName == 0)
            {
                console.log('Spawning new upgrader: ' + newName);
            }
        }
    
        //########
        //# Repaiers Spawn (Containers, and overflow)
        //#######################
        var repairer = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
        if(repairer.length < 4) 
        {
            var newName = Game.spawns['Gehross'].createCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE], Creep.getRandomName('[R]'), {role: 'repairer'});
           if(newName == 0)
            {
                console.log('Spawning new repairer: ' + newName);
            }
        }
        
        //########
        //# RoadWorkers Spawn Repair(Roads, Ramparts)
        //#######################
        var roadworker = _.filter(Game.creeps, (creep) => creep.memory.role == 'roadworker');
        if(roadworker.length < 5) 
        {
            var newName = Game.spawns['Gehross'].createCreep([WORK, WORK, WORK, CARRY, CARRY, MOVE], Creep.getRandomName('[RW]'), {role: 'roadworker'});
           if(newName == 0)
            {
                console.log('Spawning new road worker: ' + newName);
            }
        }
        
        //########
        //# Wall Workers Spawn (Repairs Walls only)
        //#######################
        var wallworker = _.filter(Game.creeps, (creep) => creep.memory.role == 'wallworker');
        if(wallworker.length < 3) 
        {
            var newName = Game.spawns['Gehross'].createCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY,MOVE, MOVE], Creep.getRandomName('[WW]'), {role: 'wallworker'});
           if(newName == 0)
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
        if(creep.memory.role == 'warrior') 
        {
            roleWarrior.run(creep);
        }
        if(creep.memory.role == 'hauler')
        {
            roleHauler.run(creep);
        }
    }
}