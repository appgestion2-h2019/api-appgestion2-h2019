var express = require('express');
var router = express.Router();
var config = require('../config');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = config.database.uri;
const dbName = 'chickencoops';
var ObjectId = require('mongodb').ObjectID;


/*------------ Lisa ------------*/

/**
 * TODO:
 * Obtention des dessins pour affichage à la fin du jeu.(READ)
 * Mise à jour des scores. (UPDATE)
 */
//Requête pour l'affichage des pictos/dessins faits pendant la période de jeu.
// router.get('/', function(req, res, next) {
//     MongoClient.connect(url, function(err, client) {
//         assert.equal(null, err);
//         console.log("Connexion au serveur réussie");
//         const db = client.db(dbName);
//
//         //TODO mettre la collection picto
//         db.collection('METTRE LA COLLECTION DE PICTO').find().toArray(function(err, result) {
//
//             if (err) return console.log(err)
//             console.log(result);
//             res.json(result);
//         })
//
//         client.close();
//     });
// });

//Requête pour la modification de la table 'scores' et ajouter un score à l'utilisateur en ligne dans une salle de type jeu.
router.put('/:idUsager', function(req, res, next) {
    console.log("Mise à jour du score");

    var idUsager = req.params.idUsager;
    console.log(idUsager);

    var objectScore = { score: req.body.score, usager_id: req.body.usager_id};
    console.log(objectScore);

    MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);
        console.log("Connexion au serveur réussie");
        const db = client.db(dbName);
        db.collection('scores').updateOne({_id: ObjectId.createFromHexString(idUsager)},
            {$set : objectScore}, function(err, result) {
                if (err) return console.log(err)
                console.log("Le score est à jour!");
                res.json(result);
            })

        client.close();
    });
});


/*------------ Sacha ------------*/

/**
 * TODO:
 * Obtention des catégories pour affichage (READ)
 *
 * Obtention des niveaux pour affichage (READ)
 * Création de catégories (CREATE)
 *
 */
router.post('/', function(req, res, next){
    console.log("test");
    var categorie= req.body;
    console.log(categorie);
    if(!categorie.titre) {
        res.status(400);
        res.json({"erreur" : "Données incorrectes"});
    } else {
        MongoClient.connect(url, function(err, client) {
            assert.equal(null, err);
            console.log("Connexion au serveur réussie");
            const db = client.db(dbName);
            db.collection('categories').insertOne(categorie, function(err, result) {
                if (err) return console.log(err)
                console.log("Catégorie ajoutée");
                res.json(result);
            })
            client.close();
        });
    }
});



/*------------ Marc-Antoine ------------*/

/**
 * TODO:
 * Obtention des catégories pour affichage (READ)
 * Création des mots personnalisés (CREATE)
 * Modifier les niveaux de difficulté des mots proposés.
 *
 */
//Requête pour obetnir les nom de catégories
router.get('/', function(req, res, next) {
    MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);
        console.log("Connexion au serveur réussie");
        const db = client.db(dbName);
        db.collection('categories').find().sort({titre:1}).toArray(function(err, result) {
            if (err) return console.log(err)
            console.log(result);
            res.json(result);
        })
        client.close();
    });
});

module.exports = router;
