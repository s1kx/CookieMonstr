
var cookieMonstr = {
  importCookies: function(raw) {
    var lines = raw.split("\n"),
        cookiesImported = 0;

    for (var i = 0; i < lines.length; ++i) {
      line = lines[i];

      tabs = line.split(/\s+/g);

      if (line[0] == "#")
        continue;
      else if (tabs.length < 7) {
        continue;
      }
      else {
        var domain = tabs[0],
            flag = tabs[1] == "TRUE",
            path = tabs[2],
            secure = tabs[3] == "TRUE",
            expiration = parseInt(tabs[4]),
            name = tabs[5],
            value = tabs[6];

        cookie = {};
        cookie.url = (secure ? "https" : "http") + "://" + domain + path;
        cookie.name = unescape(name);
        cookie.value = unescape(value);
        cookie.domain = domain;
        cookie.path = path;
        cookie.secure = secure;
        if (!cookie.secure)
          cookie.expirationDate = expiration;

        chrome.cookies.set(cookie);
        cookiesImported++;
      }
    }

    return cookiesImported;
  },

  bindEvents: function() {
    var importCookies = $(document).find('.importCookies:first');
    $(importCookies).find('form').submit(function(e) {
      e.preventDefault();

      var field = $(importCookies).find("textarea[name='rawCookies']"),
          status = $(importCookies).find(".status");
      var rawCookies = field.val();
      var importedNum = cookieMonstr.importCookies(rawCookies);

      status.text("Imported " + importedNum + " cookies");
      field.val('');
    });
  }
};

// Run our kitten generation script as soon as the document's DOM is ready.
$(document).ready(function () {
  cookieMonstr.bindEvents();
});
