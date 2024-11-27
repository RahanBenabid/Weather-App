// Optional JavaScript for weather details page
document.addEventListener('DOMContentLoaded', () => {
  // Add any interactive functionality for the weather details page
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      // Remove active class from all nav items
      navItems.forEach(navItem => navItem.classList.remove('active'));
      
      // Add active class to clicked item
      e.currentTarget.classList.add('active');
    });
  });
});