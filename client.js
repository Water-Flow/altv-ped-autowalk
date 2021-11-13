import alt from 'alt';
import game from 'natives';

let interval = null;
function TaskWalkStraight(toggle) 
{
    if(!toggle) 
    {
        game.clearPedTasks(alt.Player.local.scriptID);
        return;
    }

    if(game.isControlPressed(0, 32) || game.isControlPressed(0, 33) || game.isControlPressed(0, 34) || game.isControlPressed(0, 35) || game.isControlPressed(0, 55) || game.isControlPressed(0, 61))
    {
        //disabling if any vanilla walk control pressed

        game.clearPedTasks(alt.Player.local.scriptID);
        return;
    }

    let pos = { ...alt.Player.local.pos };
    var rot = game.getFinalRenderedCamRot(2);

    let forwardVector = game.getEntityForwardVector(alt.Player.local.scriptID); // credit to stuyk
    let forwardPosition = {
        x: pos.x + forwardVector.x * 1.2,
        y: pos.y + forwardVector.y * 1.2,
        z: pos.z
    };

    game.setEntityHeading(alt.Player.local.scriptID, rot.z);
    game.taskGoStraightToCoord(alt.Player.local.scriptID, forwardPosition.x, forwardPosition.y, forwardPosition.z, 1.0, 10, game.getEntityHeading(alt.Player.local.scriptID), 1);
}


function TaskWalkToWaypoint() 
{
    let blip = game.getFirstBlipInfoId(8);
    if (!game.doesBlipExist(blip)) 
        return null;

    let coords = game.getBlipCoords(blip);
    if(coords == null)
        return;
    
    alt.clearInterval(interval);
    game.clearPedTasks(alt.Player.local.scriptID);
    game.taskGoToCoordAnyMeans(alt.Player.local.scriptID, coords.x, coords.y, coords.z, 1.0, 0, false, 786603, 0xbf800000);

    interval = alt.setInterval(() => {
        if(!game.isPedWalking(alt.Player.local.scriptID) || (game.isControlPressed(0, 32) || game.isControlPressed(0, 33) || game.isControlPressed(0, 34) || game.isControlPressed(0, 35) || game.isControlPressed(0, 55) || game.isControlPressed(0, 61)))
        {
            game.clearPedTasks(alt.Player.local.scriptID);
            alt.clearInterval(interval);
            interval = null;
            return;
        }
    }, 10)
}
