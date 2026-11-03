(function () {
  document.getElementById('tl_footer_year').textContent = new Date().getFullYear();

  // Pricing tabs (Cloud / On-premise), keyboard-friendly per the WAI-ARIA tabs pattern
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tl_tab'));

  function selectTab(tab) {
    tabs.forEach(function (other) {
      var isSelected = other === tab;
      other.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      other.tabIndex = isSelected ? 0 : -1;
      document.getElementById(other.getAttribute('aria-controls')).hidden = !isSelected;
    });
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener('click', function () { selectTab(tab); });
    tab.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      var next = tabs[(index + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      selectTab(next);
      next.focus();
    });
  });

  // Starter allows at most 10 users and fades out above that, as on Stackfield
  var usersSelect = document.getElementById('tl_users');
  var starter = document.querySelector('[data-max-users]');

  var cloudPlans = document.getElementById('tl_plans_cloud');
  var largePlans = document.getElementById('tl_large');
  var billing = document.querySelector('.tl_billing');

  function updateStarter() {
    var isInactive = Number(usersSelect.value) > Number(starter.getAttribute('data-max-users'));
    starter.classList.toggle('tl_plan_inactive', isInactive);
    starter.querySelector('.tl_plan_limit').hidden = !isInactive;

    // "100+" swaps the plans for a contact box, as on Stackfield
    var isLarge = usersSelect.value === '100+';
    cloudPlans.hidden = isLarge;
    largePlans.hidden = !isLarge;
    billing.style.visibility = isLarge ? 'hidden' : '';
  }

  // Browsers may restore the previous choice on reload
  usersSelect.addEventListener('change', updateStarter);
  updateStarter();

  // Yearly / monthly billing switch: on means monthly
  var billingSwitch = document.getElementById('tl_billing');
  var yearlyOption = document.getElementById('tl_billing_yearly');
  var monthlyOption = document.getElementById('tl_billing_monthly');
  // Prices and their billing notes carry both texts, so the page's language decides the wording
  var prices = Array.prototype.slice.call(document.querySelectorAll('[data-yearly]'));

  billingSwitch.addEventListener('click', function () {
    var isMonthly = billingSwitch.getAttribute('aria-checked') !== 'true';
    billingSwitch.setAttribute('aria-checked', isMonthly ? 'true' : 'false');
    yearlyOption.classList.toggle('tl_billing_option_active', !isMonthly);
    monthlyOption.classList.toggle('tl_billing_option_active', isMonthly);
    prices.forEach(function (price) {
      price.textContent = price.getAttribute(isMonthly ? 'data-monthly' : 'data-yearly');
    });
  });
})();
