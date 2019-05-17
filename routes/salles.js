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
 * Permet l'accès à l'API à partir d'un autre nom de domaine.
 * CORS
 * @author Étienne Bouchard
 */
router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


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
      if (err == null) {
				const db = client.db(dbName);
  
				db.collection("salles").find().toArray(function (erreur, salles) {
					client.close();
					err ? reject(erreur) : resolve(salles);
				});
			} else {
				client.close();
				reject(err);
			}
    });

  });
};

/**
 * Obtient une salle avec un id spécifié.
 * Ne passe pas pas la fonction de filtre car cas 
 * spécifique utilisé fréquemment par l'équipe message
 * 
 * @param {*} id _ObjectID() de la salle
 * @author Étienne Bouchard
 * @returns Une salle ou une erreur
 */
var obtenirUneSalle = (id) => {
	return new Promise((resolve, reject) => {
		MongoClient.connect(url, function (err, client) {
      if (err == null) {
				const db = client.db(dbName);
  
      	db.collection("salles").findOne({ _id: ObjectId.createFromHexString(id) }, function (erreur, salles) {
				client.close();
         err ? reject(erreur) : resolve(salles);
     		});
			} else {
				client.close();
				reject(err);
			}
    });
	});
}

/**
 * Obtient une salle à un id donné
 * Fonction asynchrone car attend la réponse de la base de données avant 
 * de retourner du data.
 * @author Étienne Bouchard
 */
router.get('/unique/:salleID', async function(req, res, next) {
	console.log(req.params.salleID);
  await obtenirUneSalle(req.params.salleID).then((data) => {
    res.json(data);
  }).catch((raison) => {
		res.json({"erreur": "Un problème est survenu lors de la connexion avec la base de données.", "raison" : raison });
	});
});

/**
 * Obtenir les salles sans aucun filtre appliqué
 * Fonction asynchrone car attend la réponse de la base de données avant 
 * de retourner du data.
 * @author Étienne Bouchard
 */
router.get('/', async function(req, res, next) {
  await obtenirSalles().then((data) => {
    res.json(data);
	}).catch((raison) => {
		res.json({"erreur": "Un problème est survenu lors de la connexion avec la base de données.", "raison" : raison });
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
      res.json({"erreur": "Champs manquants. Veuillez vous référer à la documentation." + salle.proprietaire});
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
			});
		}
	} else {
		//	Aucun parametre n'a ete fourni
		obtenirSalles().then((data) => {
			res.send(data);
		});
	}
});

router.put('/:id', (req, res) => {
	if(req.params.id === undefined || req.params.id === null || req.body === {} || req.body === undefined || typeof req.body !== typeof new Object()) {
		res.sendStatus(400);
	} else {
		//	Connexion à la DB
		MongoClient.connect(url, function (err, client) {
			assert.equal(null, err);
			const db = client.db(dbName);

			if(req.body._id === undefined || req.body._id === null) {
				res.sendStatus(400)
			} else {
				req.body._id = ObjectId(req.body._id);
			}

			db.collection('salles').replaceOne({ _id: ObjectId(req.params.id) }, req.body)
			.then((result) => {
				res.sendStatus(200);
			})
			.catch((reason) => {
				console.log(reason);
				res.end(reason);
			})
		});
	}
});

/**
 * Supprime la salle
 * @author Julien Ferluc
 */
router.delete('/:id', (req, res) => {
	if(req.params.id === undefined || req.params.id === null) {
		res.sendStatus(400);
	} else {
		//	Connexion à la DB
		MongoClient.connect(url, function (err, client) {
			assert.equal(null, err);
			const db = client.db(dbName);

			db.collection('salles').deleteOne({ _id: ObjectId(req.params.id)})
			.then((result) => {
				res.sendStatus(200);
			})
			.catch((reason) => {
				console.log(reason);
				res.end(reason);
			})
		});
	}
})

/**
 * Retourne la liste des salles correspondant aux filtres
 * @param {{ min: number, max: number, type: String, langue: String }} filtre 
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
			if(filtre.langage === undefined || filtre.langage === 'null') {
				filtre.langue = "Français";
			} if(filtre.type === undefined || filtre.type === '') {
				filtre.type = "défaut";
			} if(filtre.min === undefined  || filtre.min === 'null') {
				filtre.min = 0;
			} if(filtre.max === undefined || filtre.max === "-1" || filtre.max === 'null') {
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
