function Header ($module) {
    this.$module = $module
    console.log('Just a test to see if this header component is pulled in')
    let menuItems = document.querySelectorAll('li.has-submenu');
    Array.prototype.forEach.call(menuItems, function(el, i){
        el.addEventListener("mouseover", function(event){
            this.className = "has-submenu open";
            clearTimeout(timer);
        });
        el.addEventListener("mouseout", function(event){
            timer = setTimeout(function(event){
                document.querySelector(".has-submenu.open").className = "has-submenu";
            }, 1000);
        });
    });
}

export default Header