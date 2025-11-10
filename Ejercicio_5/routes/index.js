var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  const items = [
    { title: 'Paisaje 1', img: 'https://picsum.photos/seed/p1/600/400' },
    { title: 'Paisaje 2', img: 'https://picsum.photos/seed/p2/600/400' },
    { title: 'Frase inspiradora', text: 'La vida es bella — disfruta el camino' },
    { title: 'Frase 2', text: 'Sigue aprendiendo cada día' },
    { title: 'Paisaje 3', img: 'https://picsum.photos/seed/p3/600/400' }
  ];

  // opcional: si llegas desde login puedes ver ?user=nombre
  const user = req.query.user || null;

  res.render('index', { title: 'Inicio', items, user });
});

module.exports = router;
