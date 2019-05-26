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

/*----------------------------------------*/
/*---------Début section Dannick----------*/
/*----------------------------------------*/
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
 * Enregistre le nouveau usager via création d'un compte avec courriel
 */
router.post('/', function (req, res, next) {
    var usager = req.body; //Vas chercher l'usager
    var trouvercourriel = false; // Cette variable servira à voir si un utilisateur utilise déjà ce courriel
    var message = "";
    console.log(usager);
    MongoClient.connect(url, function (err, client) {
        assert.strictEqual(null, err); //Retourne l'erreur
        console.log("Connexion au serveur réussie"); // Pour laisser des traçes
        const db = client.db(dbName); // Pour ce faciliter la vie
        db.collection('usagers').findOne({courriel: usager.courriel}, function (err, result) {
            if (err) return console.log(err)
            console.log(result);
            if (result) {
                trouvercourriel = true;
                console.log("Déjà utilisé");
                message = "Déjà utilisé";
                res.json(message);
            } else {
                if (!usager.courriel && !usager.nomusager && !usager.motdepasse) { //Vérifie si l'utilisateur a un courriel, un nomusager et un mot de passe
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
                            message = "Compte crée!";
                            res.json(message)
                        })
                        client.close();
                    });
                }
            }
        })
        client.close();
    });
});

/**
 * Vas voir dans la bd si l'utilisateur existe. Si les informations corresponde l'utilisateur seras connecté.
 */
router.post('/connexion/', function (req, res, next) {
    var usager = req.body; //Vas chercher l'usager
    var connecter = false;
    console.log(usager);
    MongoClient.connect(url, function (err, client) {
        assert.strictEqual(null, err); //Retourne l'erreur
        console.log("Connexion au serveur réussie");
        const db = client.db(dbName);
        if (usager.courriel && usager.motdepasse) {
            db.collection('usagers').findOne({
                courriel: usager.courriel,
                motdepasse: usager.motdepasse
            }, function (err, result) {
                if (err) return console.log(err)
                console.log(result);
                if (result) {
                    console.log("Le clients est bien connecter!");
                    connecter = true;
                    res.json(result);
                } else {
                    console.log("Vous n'avez pas de compte");
                    connecter = false;
                    res.json(result);
                }
            });
            client.close(); // Ferme la connexion a la base de données.
        } else {
            res.status(400);
            res.json({"erreur": "Données incorrectes, vous avez oublier de remplir un champ du formulaire."});
            client.close(); // Ferme la connexion a la base de données.
        }
    });
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

/*----------------------------------------*/
/*----------Fin section Dannick-----------*/
/*----------------------------------------*/


/*----------------------------------------*/
/*-------------------- Matthew------------*/
/*----------------------------------------*/
/**
 * Enregistre le nouveau usager de google dans notre base de donnée
 */
router.post('/usagergoogle/', function (req, res, next) {
    var usager = req.body; //Vas chercher l'usager
    var trouvergooglecourriel = false;
    var message = "";
    console.log(usager);
    MongoClient.connect(url, function (err, client) {
        assert.strictEqual(null, err);
        console.log("Connexion au serveur réussie");
        const db = client.db(dbName);
        db.collection('usagers').findOne({googlecourriel: usager.googlecourriel}, function (err, result) {
            if (err) return console.log(err)
            console.log(result);
            if (result) {
                trouvergooglecourriel = true;
                console.log("Déjà ajouté");
                message = "Déjà ajouté";
                res.json(message);
            } else {
                if (!usager.googlecourriel && !usager.nomusager) { //Vérifie si l'utilisateur a un courriel et un nomusager
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
                            message = "Compte crée!";
                            res.json(message)
                        })
                        client.close();
                    });
                }
            }
        })
        client.close();
    });

});


/**
 * Retrouve tout les usagers de la base de donnée
 */
router.get('/googlecourriel/:googlecourriel', function (req, res, next) {
    MongoClient.connect(url, function (err, client) {
        assert.strictEqual(null, err);
        console.log("Connexion au serveur réussie");
        const db = client.db(dbName);
        db.collection('usagers').findOne({googlecourriel: req.params.googlecourriel}, function (err, result) {
            if (err) return console.log(err)
            console.log(result);
            res.json(result);
        })

        client.close();
    });
});
module.exports = router;