document.addEventListener('DOMContentLoaded', function() {
  var links = document.querySelectorAll('.toggle-link', '.nav-item', 'i');

  links.forEach(function(link) {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      var divId = event.target.dataset.target;
      var selectedDiv = document.querySelector('.' + divId);

      // Check if selectedDiv is not null before manipulating class
      if (selectedDiv) {
        // Toggle a class directly on the selectedDiv
        selectedDiv.classList.toggle('visible');
      } else {
        console.error('Element with class ' + divId + ' not found.');
      }
    });
  });

  // Display the "Weather" div by default
  var defaultDiv = document.querySelector('.weather-posting');
  defaultDiv.classList.add('visible');
});

window.onload = function () {
  const menu_btn = document.querySelector('.hamburger-button');
  const mobile_menu = document.querySelector('.mobile-nav');

  menu_btn.addEventListener('click', function () {
      menu_btn.classList.toggle('is-active');
      mobile_menu.classList.toggle('is-active');
  });
}