function Header($module) {
    this.$module = $module
    // The following implementation is from https://www.w3.org/WAI/tutorials/menus/flyout/#flyoutnavmousefixed - understood to be accessible and current best practice
    let menuItems = document.querySelectorAll('li[data-has-submenu]');
    Array.prototype.forEach.call(menuItems, function (el, i) {
        el.querySelector('a').addEventListener("click", function (event) {
            if (this.parentNode.getAttribute('data-has-submenu') === "true" && this.parentNode.getAttribute('data-submenu-open') !== "true") {
                this.parentNode.setAttribute("data-submenu-open", true);
                this.setAttribute('aria-expanded', "true");
            } else {
                this.parentNode.setAttribute("data-submenu-open", false);
                this.setAttribute('aria-expanded', "false");
            }
            event.preventDefault();
            return false;
        });
        let checkIfMenuIsOpen = null
        let links = el.querySelectorAll('a');
        Array.prototype.forEach.call(links, function (el, i) {
            el.addEventListener("focus", function () {
                if (checkIfMenuIsOpen) {
                    clearTimeout(checkIfMenuIsOpen);
                    checkIfMenuIsOpen = null;
                }
            });
            el.addEventListener("blur", function (event) {
                checkIfMenuIsOpen = setTimeout(function () {
                    let opennav = document.querySelector("li[data-submenu-open='true']")
                    if (opennav) {
                        opennav.setAttribute("data-submenu-open", false);
                        opennav.querySelector('a').setAttribute('aria-expanded', "false");
                    }
                }, 10)
            });
        });
    });
}

export default Header
