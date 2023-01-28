const express = require('express');
const router = express.Router();
const {
    getAllSquads,
    // getSquadById,
    createSquad,
    updateSquad,
    deleteSquad,
    getSquads,
    groupSquads
} = require('../controller/squads');

router.get('/', getAllSquads);
router.get('/:key/:value', getSquads);
//router.get('/:squadId', getSquadById);
router.post('/', createSquad);
router.get('/groupSquads', groupSquads);
router.put('/', updateSquad);
router.delete('/:squadId', deleteSquad);
module.exports = router;
