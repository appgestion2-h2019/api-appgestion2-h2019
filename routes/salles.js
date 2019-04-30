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

router.get('/filtre', (req, res) => {
	let filtres = ['min', 'max', 'type', 'langue'];
	let urlParametres = Object.keys(req.query);
	let parametres = [];

	if(urlParametres.length !== 0) {
		if(urlParametres.some(valeur => filtres.indexOf(valeur) >= 0)) {
			parametres = urlParametres.filter((valeur) => {
				return filtres.indexOf(valeur) !== -1;
			})
			res.json(parametres);
		} else {
			res.end('not ok');
		}
	} else {
		res.end('not ok');
	}
});

module.exports = router;
