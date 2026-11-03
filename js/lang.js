(function () {
  var KEY = 'tl-lang-pos';
  var menu = document.querySelector('.tl_lang');

  function sections() {
    return Array.prototype.slice.call(document.querySelectorAll('main > section'));
  }

  // Both languages share the same section layout, so the position is kept as
  // "this far into section N" rather than raw pixels, which differ with text length
  function readPosition() {
    var list = sections();
    var y = window.pageYOffset;
    for (var i = list.length - 1; i >= 0; i--) {
      if (list[i].offsetTop <= y) {
        return { i: i, r: (y - list[i].offsetTop) / list[i].offsetHeight };
      }
    }
    return { i: 0, r: 0 };
  }

  function restorePosition() {
    var saved = null;
    try {
      saved = JSON.parse(sessionStorage.getItem(KEY));
      sessionStorage.removeItem(KEY);
    } catch (e) {}
    if (!saved || saved.path !== location.pathname) return;
    var section = sections()[saved.i];
    if (!section) return;
    window.scrollTo({ top: section.offsetTop + saved.r * section.offsetHeight, behavior: 'instant' });
  }

  if (menu) {
    menu.addEventListener('click', function (e) {
      var link = e.target.closest('a[hreflang]');
      if (!link) return;
      var pos = readPosition();
      pos.path = new URL(link.href).pathname;
      try { sessionStorage.setItem(KEY, JSON.stringify(pos)); } catch (err) {}
    });

    // Close the menu when clicking anywhere else or pressing Escape
    document.addEventListener('click', function (e) {
      if (menu.open && !menu.contains(e.target)) menu.open = false;
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.open) {
        menu.open = false;
        menu.querySelector('summary').focus();
      }
    });
  }

  restorePosition();
})();
