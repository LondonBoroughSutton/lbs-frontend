function Header($module) {
    this.$module = $module
    console.log(123)
    let menuItems = document.querySelectorAll('li.has-submenu');
    console.log(menuItems)
    Array.prototype.forEach.call(menuItems,function(el, i){
        el.querySelector('a').addEventListener("click",  function(event){
            if (this.parentNode.className == "has-submenu") {
                this.parentNode.className = "has-submenu open";
                this.setAttribute('aria-expanded', "true");
            } else {
                this.parentNode.className = "has-submenu";
                this.setAttribute('aria-expanded', "false");
            }
            event.preventDefault();
            return false;
        });
    });
}
export default Header
