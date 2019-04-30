var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'index tout les picto' });
});
router.get('/ajouter', function(req, res, next) {
    res.render('index', { title: 'ajouter pictos' });
});
router.get('/ajouter/:idpictos', function(req, res, next) {
    res.render('index', { title: 'ajouter pictos' });
});



module.exports = router;
