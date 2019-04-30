var express = require('express');
var router = express.Router();


/*----------------------------------------*/
/*-------------------- ÉTIENNE------------*/
/*----------------------------------------*/

/**
 * TODO: 
 * Obtention des salles sans filtre
 * Création des salles
 */


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Obtention des salles à venir.');
});

router.post('/', function(req, res, next){
  res.send("Création d'une salle.");
});

/*----------------------------------------*/
/*-------------------- JULIEN-------------*/
/*----------------------------------------*/

module.exports = router;
