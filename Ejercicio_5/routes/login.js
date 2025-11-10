var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login', error: null });
});

router.post('/', function(req, res, next) {
  const { username, password } = req.body;

  // Se acepta si no esta vacío
  if (username && password) {
    res.redirect('/?user=' + encodeURIComponent(username));
  } else {
    res.render('login', { title: 'Login', error: 'Introduce usuario y contraseña' });
  }
});

module.exports = router;
