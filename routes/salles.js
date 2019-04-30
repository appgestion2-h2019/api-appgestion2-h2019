var express = require('express');
var router = express.Router();

/*----------------------------------------*/
/*-------------------- ÉTIENNE------------*/
/*----------------------------------------*/

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
	let parametres = Object.keys(req.query);

	if(parametres.length !== 0) {
		if(parametres.some(valeur => filtres.indexOf(valeur) >= 0)) {
			res.end('ok');
		} else {
			res.end('not ok');
		}
	} else {
		res.end('not ok');
	}
});

module.exports = router;
