
asArray = function(obj) {
    var result = [];

    for (var key in obj) {
        var o = {};
        o["key"] = key;
        o["value"] = obj[key];
        result.push(o);
    }
    return result;
};
UI.registerHelper('asArray', asArray);


Error.handler = function (err) {
    if (err) {
        //Dialog.informUser(err.message);
        Event.addEvent(err.message);
    }
};

capitalize = function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
UI.registerHelper('capitalize', capitalize);


formatDate = function() {
    return this.date.toLocaleString();
};
UI.registerHelper('formatDate', formatDate);


secDiff = function (from, to) {
    if (!to) {
        to = from;
        from = new Date();
    }
    return Math.abs((from).getTime() - to.getTime()) / 1000;
};


NonEmptyString = Match.Where(function (x) {
    check(x, String);
    return x.length !== 0;
});

Countdown = function (options) {
  var timer,
  instance = this,
  seconds = options.seconds || 10,
  end = options.end,
  updateStatus = options.onUpdateStatus || function () {},
  counterEnd = options.onCounterEnd || function () {};

  if (end != undefined) {
    var now = new Date();
    options.seconds = end.getTime() - now.getTime();
    options.seconds = options.seconds / 1000;
  }

  function decrementCounter() {
    updateStatus(Math.floor(seconds));
    if (seconds <= 0) {
      counterEnd();
      instance.stop();
    }
    seconds--;
  }

  this.start = function () {
    clearInterval(timer);
    timer = 0;
    seconds = options.seconds;
    timer = setInterval(decrementCounter, 1000);
  };

  this.stop = function () {
    clearInterval(timer);
  };
}