/*jshint esversion: 6*/

function isAuthenticated (req, res, next) {
  console.log('checking', req);
  if(req.isAuthenticated()) {
    console.log('you good');
    next();
  }else {
    console.log('you bad!!!!');
    res.redirect('/login');
  }
}

module.exports = isAuthenticated;