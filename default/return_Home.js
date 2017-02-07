/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('return_Home');
 * mod.thing == 'a thing'; // true
 */



var returnHome = { 
    
    /** @param {Creep} creep **/
    run: function(creep) 
    {
        //True means were returning home False means they are home.. should be backwards I think.. but oh well
        
        var homeDest = 'Gehross';
        
        if(creep.memory.home != null)
        {
            homeDest = creep.memory.home;
        }
        
        if(creep.room.name != Game.spawns[homeDest].room.name)
        {
            var exitToDest = creep.pos.findClosestByRange(creep.room.findExitTo(Game.spawns[homeDest].room));
            creep.moveTo(exitToDest);
            return true;
        }else
        {
            return false;
        }
    }
}


module.exports = returnHome;