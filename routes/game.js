
exports.templates = function (req, res) {
  var name = req.params.name;
  res.render('game/templates/' + name);
};