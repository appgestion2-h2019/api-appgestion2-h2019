var express = require('express');
var router = express.Router();
// Configuration de la connection a la base de donné
var config = require('../config');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = config.database.uri;
const dbName = 'chickencoops';
var ObjectId = require('mongodb').ObjectID;

/**
 *  Lire un message (voir juste le picto)
 *  @desc Modifier un messager pour ajouter le nom du picto dans le message
 *  @param int $idMessage - l'id du message dans le quelle ajouter un picto
 *  @return le json du message
 */
router.get('/:idMessage', function (req, res, next) {
    //todo peut etre modifier ici
    //const picto = {titre: req.body.titre};
    // console.log(picto);

    MongoClient.connect(url, function (err, client) {
        assert.equal(null, err);
        console.log("Connexion au serveur réussie");
        const db = client.db(dbName);
        db.collection('message').find().toArray(
            // db.collection('').find({_id: ObjectId.createFromHexString(req.params.idMessage)}, {$set: message},
            function (err, result) {
                if (err) return console.log(err);
                console.log("lecture du picto dans le message");

                res.json(result);
                //res.render('films/Afficher', {films: result});
            });
        client.close();
    });
})
/**
 *  AJOUTER UN PICTO
 *  @desc Modifier un messager pour ajouter le nom du picto dans le message
 *  @param int $idMessage - l'id du message dans le quelle ajouter un picto
 *  @return le json du message
 */
router.put('/:idMessage', function (req, res, next) {
    //todo peut etre modifier ici
    const picto = {titre: req.body.titre};
    // console.log(picto);

    if (!picto.titre) {
        res.status(400);
        res.json({"erreur": "Données incorrectes"});
    } else {
        MongoClient.connect(url, function (err, client) {
            assert.equal(null, err);
            console.log("Connexion au serveur réussie");
            const db = client.db(dbName);

            db.collection('').updateOne({_id: ObjectId.createFromHexString(req.params.idMessage)}, {$set: message},
                function (err, result) {
                    if (err) return console.log(err);
                    console.log("Ajout picto dans le message");

                    res.json(result);
                    //res.render('films/Afficher', {films: result});
                });
            client.close();
        });
    }
});
    module.exports = router;
