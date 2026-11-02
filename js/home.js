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

  // Plans with a user cap fade out once the chosen number of users exceeds it
  var usersSelect = document.getElementById('tl_users');
  var cappedPlans = Array.prototype.slice.call(document.querySelectorAll('[data-max-users]'));

  function updatePlans() {
    var users = Number(usersSelect.value);
    cappedPlans.forEach(function (plan) {
      var isInactive = users > Number(plan.getAttribute('data-max-users'));
      plan.classList.toggle('tl_plan_inactive', isInactive);
      plan.querySelector('.tl_plan_limit').hidden = !isInactive;
    });
  }

  usersSelect.addEventListener('change', updatePlans);
  updatePlans();

  // Yearly / monthly billing switch: on means monthly
  var billingSwitch = document.getElementById('tl_billing');
  var yearlyOption = document.getElementById('tl_billing_yearly');
  var monthlyOption = document.getElementById('tl_billing_monthly');
  var prices = Array.prototype.slice.call(document.querySelectorAll('[data-yearly]'));
  var billingUnits = Array.prototype.slice.call(document.querySelectorAll('.tl_billing_unit'));

  billingSwitch.addEventListener('click', function () {
    var isMonthly = billingSwitch.getAttribute('aria-checked') !== 'true';
    billingSwitch.setAttribute('aria-checked', isMonthly ? 'true' : 'false');
    yearlyOption.classList.toggle('tl_billing_option_active', !isMonthly);
    monthlyOption.classList.toggle('tl_billing_option_active', isMonthly);
    prices.forEach(function (price) {
      price.textContent = price.getAttribute(isMonthly ? 'data-monthly' : 'data-yearly');
    });
    billingUnits.forEach(function (unit) {
      unit.textContent = isMonthly ? '(jika dibayar bulanan)' : '(jika dibayar tahunan)';
    });
  });
})();
