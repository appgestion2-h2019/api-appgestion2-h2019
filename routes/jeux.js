var express = require('express');
var router = express.Router();
var config = require('../config');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = config.database.uri;
const dbName = 'chickencoops';
var ObjectId = require('mongodb').ObjectID;


/*------------ Lisa ------------*/

// Requête pour l'affichage de tous les scores enregistrés dans la base de données.
router.get('/', function(req, res, next) {
    MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);
        console.log("Connexion au serveur réussie");
        const db = client.db(dbName);
        db.collection('score').find().sort({score:-1}).toArray(function(err, result) {

            if (err) return console.log(err)
            console.log(result);
            res.json(result);
        })

        client.close();
    });
});

 //Ajouter un nouveau score dans la base de données.
router.post('/score', function(req, res, next) {
    console.log("Ajouter un score");
    var objectScore = req.body;
    console.log(objectScore);
    //TODO PARSE EN INT MON OBJET DE SCORE AVANT L'AJOUT

    //Validation
    if(!objectScore.score){
        res.status(400);
        console.log('Valeur introuvable.');
        res.json({Erreur: "Vous n'avez entré aucune donnée pour spécifier le score."});

    } else{
        MongoClient.connect(url, function(err, client) {
            assert.equal(null, err);
            console.log("Connexion au serveur réussie");
            const db = client.db(dbName);
            db.collection('score').insertOne(objectScore), function(err, result) {
                if (err) return console.log(err)
                console.log("Score ajouté");
                res.json(result);
            }

            client.close();
        });
    }
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
//Requête pour obetnir les informations sur les catégories
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
//Requête pour get une catégorie selon son id
router.get('/:idCategorie', function(req, res, next){
    MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);
        console.log("Connexion au serveur réussie");
        const db = client.db(dbName);
        db.collection('categories').findOne({_id: ObjectId.createFromHexString(req.params.id)}, function(err, result) {
            if (err) return console.log(err)
            console.log(result);
            res.json(result);
        })

        client.close();
    });
});

//Requête pour ajouter un mot
router.put('/:idCategorie', function(req, res, next){
    var categorie = req.body;
    if(!categorie.titre || (!(categorie.niveau))) {
        res.status(400);
        res.json({"erreur" : "Données incorrectes"});
    } else {
        MongoClient.connect(url, function(err, client) {
            assert.equal(null, err);
            console.log("Connexion au serveur réussie");
            const db = client.db(dbName);
            db.collection('categories').updateOne({_id: ObjectId.createFromHexString(req.params.idCategorie)}, {$set : categorie},
                function(err, result) {
                    if (err) return console.log(err)
                    console.log("Mot ajouté");
                    res.json(result);
                })

            client.close();
        });
    }
});
router.delete('/:idCategorie', function(req, res, next){
    MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);
        console.log("Connexion au serveur réussie");
        const db = client.db(dbName);
        db.collection('categories').deleteOne({_id: ObjectId.createFromHexString(req.params.idCategorie)},
            function(err, result) {
                if (err) return console.log(err)
                console.log("categorie supprimée");
                res.json(result);
            })

        client.close();
    });
});



module.exports = router;
