class BurgerMenu {
  constructor() {
    this.body = document.body;
    this.burgerButton = document.querySelector('.burger');
    this.menu = document.querySelector('.header__menu');
  }

  /**
   * Initialize the menu functionality.
   */
  init() {
    if (this.burgerButton) {
      this.burgerButton.addEventListener('click', ({ target }) => {
        this.burgerButton.classList.toggle('burger--opened');
        this.menu.classList.toggle('menu--opened');

        if (this.burgerButton.classList.contains('burger--opened')) {
          this.body.style.overflow = 'hidden'
        } else {
          this.body.style.overflow = 'initial'
        }
      });
    }
  }
}

export default BurgerMenu;
