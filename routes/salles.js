var express = require('express');
var router = express.Router();

var config = require('../config');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = config.database.uri;
const dbName = 'chickencoops';
var ObjectId = require('mongodb').ObjectID;

/*----------------------------------------*/
/*-------------------- ÉTIENNE------------*/
/*----------------------------------------*/

/**
 * TODO: 
 * Obtention des salles sans filtre
 * Création des salles
 */

 /**
  * Obtient toutes les salles disponibles dans 
  * la base de données.
  * Promise : asynchronisme de la base de données.
  * @author Étienne Bouchard
  * @returns Un tableau de salle (peut être vide) ou une erreur si la connexion
  * à la base de données est impossible.  
  */
 var obtenirSalles = () => {
  return new Promise((resolve, reject) => {

    MongoClient.connect(url, function (err, client) {
      assert.equal(null, err);
      const db = client.db(dbName);
  
      db.collection("salles").find().toArray(function (erreur, salles) {
          err ? reject(erreur) : resolve(salles);
      });
    });

  });
};

/**
 * Obtenir les salles sans aucun filtre appliqué
 * Fonction asynchrone car attend la réponse de la base de données avant 
 * de retourner du data.
 * @author Étienne Bouchard
 */
router.get('/', async function(req, res, next) {
  await obtenirSalles().then((data) => {
    res.json(data);
  });
});

/**
* Création d'une salle 
* Paramètres requis : Nom, type et propriétaire de la salle
* Si aucun type de salle est fournis, le type par défaut est 
* appliqué.
* @author Étienne Bouchard
*/
router.post('/', function(req, res, next){
  var salle = req.body;
  if (!salle.nom || !salle.langue || !salle.proprietaire) {
      res.status(400);
      console.log(salle.nom);
      res.json({"erreur": "Champs manquants. Veuillez vous référer à la documentation." + salle.nom});
  } else {

      if (!salle.type) {
        salle.type = { "nom": "défaut"}
      }

      MongoClient.connect(url, function (err, client) {
          assert.equal(null, err);
          const db = client.db(dbName);
          db.collection('salles').insertOne(salle, function (err, result) {
              if (err) return console.log(err)
              client.close();
              res.json(result);
          })
      });
  }
});

/*----------------------------------------*/
/*-------------------- JULIEN-------------*/
/*----------------------------------------*/

/**
 * Retourne les salles selon les filtres donnés et permis
 * @author Julien Ferluc
 */
router.get('/filtre', (req, res) => {
	let filtres = ['min', 'max', 'type', 'langue'];
	let urlParametres = Object.keys(req.query);
	let parametres = [];

	if(urlParametres.length !== 0) {
		if(urlParametres.some(valeur => filtres.indexOf(valeur) >= 0)) {
			//	Ajouter a l'array les parametres qui font partie de ceux permis
			parametres = urlParametres.filter((valeur) => {
				return filtres.indexOf(valeur) !== -1;
			})

			let filtre = {}

			//	Ajout des valeurs des parametres au filtre pour la requête
			parametres.map((valeur) => {
				filtre[valeur] = req.query[valeur];
			})

			//	Get des salles avec le filtre
			getSallesFiltre(filtre)
			.then((data) => {
				res.send(data);
			})
			.catch((err) => {
				res.send(err);
			})
		} else {
			//	Les parametres ne font pas partie des parametres permis
			obtenirSalles().then((data) => {
				res.send(data);
			})
		}
	} else {
		//	Aucun parametre n'a ete fourni
		obtenirSalles().then((data) => {
			res.send(data);
		})
	}
});

/**
 * Supprime la salle
 * @author Julien Ferluc
 */
router.delete('/:id', (req, res) => {
	//	Retourne 501 puisque la route n'est pas implémentéee
	res.sendStatus(501);
})

/**
 * Retourne la liste des salles correspondant aux filtres
 * @param {{ min: number, max: number, type: String, langue: String}} filtre 
 * @author Julien Ferluc
 * @returns {Promise} Les données des salles
 */
const getSallesFiltre = (filtre) => {
	return new Promise((resolve, reject) => {
		//	Connexion à la DB
		MongoClient.connect(url, function (err, client) {
			assert.equal(null, err);
			const db = client.db(dbName);

			//	Si les options du filtre ne sont pas définies, mettre les options les plus globales possible
			if(filtre.langage === undefined) {
				filtre.langue = "Français";
			} if(filtre.type === undefined) {
				filtre.type = "défaut";
			} if(filtre.min === undefined) {
				filtre.min = 0;
			} if(filtre.max === undefined || filtre.max === "-1") {
				filtre.max = 9999999;
			}

			console.log(filtre)

			//	Query avec les options du filtre
			db.collection("salles").find({ "utilisateurs_min": {$gte:  parseInt(filtre.min)}, "utilisateurs_max": {$lte: parseInt(filtre.max)}, "type.nom": filtre.type, "langue": filtre.langue }).toArray().then((data) => {
				resolve(data);
			})
			.catch((err) => {
				reject(err);
			})
		});
	})
}

module.exports = router;
