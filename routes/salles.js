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
  * @author Étienne Bouchard
  */
 async function obtenirSalles() {
  MongoClient.connect(url, function (err, client) {
    assert.equal(null, err);
    console.log("Connected to the server.");
    const db = client.db(dbName);

    db.collection("salles").find().toArray(function (err, result) {
        if (err) return console.log(err)
        client.close();
        return result;
    });
  });
 }

/**
 * Obtenir les salles sans aucun filtre appliqué
 * @author Étienne Bouchard
 */
router.get('/', async function(req, res, next) {
  var salles = await obtenirSalles();
  res.json(salles);
});

/**
* Création d'une salle 
* Paramètres requis : Nom, type et propriétaire de la salle
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

module.exports = router;
