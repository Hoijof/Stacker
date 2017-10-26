
var subs = {};

function pub (name, params) {
  subs[name].forEach(function (elem) {
    elem.callback.apply(elem.context, params);
  });
}

function sub (name, callback, context) {
  if (subs[name] === undefined) {
    subs[name] = [];
  }

  subs[name].push({
    callback: callback,
    context: context
  });
}

module.exports = {
  pub: pub,
  sub: sub
};
