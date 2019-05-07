//Configuration pour le projet expresse
var express = require('express');
var router = express.Router();
// Configuration a la connection a la base de donné
var config = require('../config');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = config.database.uri;
const dbName = 'chickencoops';
var ObjectId = require('mongodb').ObjectID;

/**
 * Retrouve tout les usagers de la base de donnée
 */
router.get('/', function (req, res, next) {
    MongoClient.connect(url, function (err, client) {
        assert.strictEqual(null, err);
        console.log("Connexion au serveur réussie");
        const db = client.db(dbName);

        db.collection('usagers').find().toArray(function (err, result) {
            if (err) return console.log(err)
            console.log(result);
            res.json(result);
        })

        client.close();
    });
});

/**
 * Retourve l'usager par son id
 */
router.get('/:idUsager', function (req, res, next) {
    MongoClient.connect(url, function (err, client) {
        assert.strictEqual(null, err);
        console.log("Connexion au serveur réussie");
        const db = client.db(dbName);
        db.collection('usagers').findOne({_id: ObjectId.createFromHexString(req.params.idUsager)}, function (err, result) {
            if (err) return console.log(err)
            console.log(result);
            res.json(result);
        })

        client.close();
    });
});

/**
 * Enregistre le nouveau usager dans notre base de donnée
 */
router.post('/', function (req, res, next) {
    var usager = req.body; //Vas chercher l'usager
    console.log(usager);

    if (!usager.token) {

    } else if (!usagre.googletoken) {

    } else if (!usager.facebooktoken) {

    } else {

    }

    if (!usager.courriel || !usager.motdepasse) { //Vérifie si l'utilisateur a un courriel ou un mot de passe
        res.status(400);
        res.json({"erreur": "Données incorrectes"});
    } else { //Si l'usager a tout les bons champs de remplis
        MongoClient.connect(url, function (err, client) {
            assert.strictEqual(null, err);
            console.log("Connexion au serveur réussie");
            const db = client.db(dbName);
            db.collection('usagers').insertOne(usager, function (err, result) { //Insert l'objet usager.
                if (err) return console.log(err)
                console.log("Objet ajouté");
                res.json(result);
            })
            client.close();
        });
    }
});

/**
 * Retrouve l'usager appartir de son id et le supprime
 */
router.delete('/:idUsager', function (req, res, next) {
    MongoClient.connect(url, function (err, client) {
        assert.strictEqual(null, err);
        console.log("Connexion au serveur réussie");
        const db = client.db(dbName);
        db.collection('usagers').deleteOne({_id: ObjectId.createFromHexString(req.params.idUsager)},
            function (err, result) {
                if (err) return console.log(err)
                console.log("Objet supprimé");
                res.json(result);
            })

        client.close();
    });
});

/**
 * Retrouve l'usager appartir de son id et le modifie
 * todo : retravailler cette fonction pour la mettre a jours avec le bon modèle de donné
 */
//
// router.put('/:idUsager', function (req, res, next) {
//     var usager = req.body;
//     if (!usager.titre || (!(usager.duree))) {
//         res.status(400);
//         res.json({"erreur": "Données incorrectes"});
//     } else {
//         MongoClient.connect(url, function (err, client) {
//             assert.strictEqual(null, err);
//             console.log("Connexion au serveur réussie");
//             const db = client.db(dbName);
//             db.collection('usagers').updateOne({_id: ObjectId.createFromHexString(req.params.idUsager)}, {$set: usager},
//                 function (err, result) {
//                     if (err) return console.log(err)
//                     console.log("Objet mis à jour");
//                     res.json(result);
//                 })
//
//             client.close();
//         });
//     }
// });

module.exports = router;