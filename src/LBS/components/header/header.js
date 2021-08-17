function Header($module, menu) {
    this.$module = $module
    if (menu !== false) {
        let domNode = menu
        let elementChildren,
            msgPrefix = 'Header constructor argument menubarNode ';

        // Check whether menubarNode is a DOM element
        if (!domNode instanceof Element) {
            throw new TypeError(msgPrefix + 'is not a DOM Element.');
        }

        // Check whether menubarNode has descendant elements
        if (domNode.childElementCount === 0) {
            throw new Error(msgPrefix + 'has no element children.');
        }

        // Check whether menubarNode has A elements
        let e = domNode.firstElementChild;
        while (e) {
            var menubarItem = e.firstElementChild;
            if (e && menubarItem && menubarItem.tagName !== 'A') {
                throw new Error(msgPrefix + 'has child elements are not A elements.');
            }
            e = e.nextElementSibling;
        }

        this.isHeader = true;

        this.domNode = domNode;

        this.menubarItems = []; // See Header init method
        this.firstChars = []; // See Header init method

        this.firstItem = null; // See Header init method
        this.lastItem = null; // See Header init method

        this.hasFocus = false; // See HeaderItem handleFocus, handleBlur
        this.hasHover = false; // See Header handleMouseover, handleMouseout
    }
}


/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*/
var MenubarItem = function (domNode, menuObj) {

    this.menu = menuObj;
    this.domNode = domNode;
    this.popupMenu = false;

    this.hasFocus = false;
    this.hasHover = false;

    this.isMenubarItem = true;

    this.keyCode = Object.freeze({
        'TAB': 9,
        'RETURN': 13,
        'ESC': 27,
        'SPACE': 32,
        'PAGEUP': 33,
        'PAGEDOWN': 34,
        'END': 35,
        'HOME': 36,
        'LEFT': 37,
        'UP': 38,
        'RIGHT': 39,
        'DOWN': 40
    });
};

MenubarItem.prototype.init = function () {
    this.domNode.tabIndex = -1;

    this.domNode.addEventListener('keydown', this.handleKeydown.bind(this));
    this.domNode.addEventListener('focus', this.handleFocus.bind(this));
    this.domNode.addEventListener('blur', this.handleBlur.bind(this));
    this.domNode.addEventListener('mouseover', this.handleMouseover.bind(this));
    this.domNode.addEventListener('mouseout', this.handleMouseout.bind(this));

    // Initialize pop up menus

    var nextElement = this.domNode.nextElementSibling;

    if (nextElement && nextElement.tagName === 'UL') {
        this.popupMenu = new PopupMenu(nextElement, this);
        this.popupMenu.init();
    }

};

MenubarItem.prototype.handleKeydown = function (event) {
    var tgt = event.currentTarget,
        char = event.key,
        flag = false,
        clickEvent;

    function isPrintableCharacter (str) {
        return str.length === 1 && str.match(/\S/);
    }

    switch (event.keyCode) {
        case this.keyCode.SPACE:
        case this.keyCode.RETURN:
        case this.keyCode.DOWN:
            if (this.popupMenu) {
                this.popupMenu.open();
                this.popupMenu.setFocusToFirstItem();
                flag = true;
            }
            break;

        case this.keyCode.LEFT:
            this.menu.setFocusToPreviousItem(this);
            flag = true;
            break;

        case this.keyCode.RIGHT:
            this.menu.setFocusToNextItem(this);
            flag = true;
            break;

        case this.keyCode.UP:
            if (this.popupMenu) {
                this.popupMenu.open();
                this.popupMenu.setFocusToLastItem();
                flag = true;
            }
            break;

        case this.keyCode.HOME:
        case this.keyCode.PAGEUP:
            this.menu.setFocusToFirstItem();
            flag = true;
            break;

        case this.keyCode.END:
        case this.keyCode.PAGEDOWN:
            this.menu.setFocusToLastItem();
            flag = true;
            break;

        case this.keyCode.TAB:
            this.popupMenu.close(true);
            break;

        case this.keyCode.ESC:
            this.popupMenu.close(true);
            break;

        default:
            if (isPrintableCharacter(char)) {
                this.menu.setFocusByFirstCharacter(this, char);
                flag = true;
            }
            break;
    }

    if (flag) {
        event.stopPropagation();
        event.preventDefault();
    }
};

MenubarItem.prototype.setExpanded = function (value) {
    if (value) {
        this.domNode.setAttribute('aria-expanded', 'true');
    }
    else {
        this.domNode.setAttribute('aria-expanded', 'false');
    }
};

MenubarItem.prototype.handleFocus = function (event) {
    this.menu.hasFocus = true;
};

MenubarItem.prototype.handleBlur = function (event) {
    this.menu.hasFocus = false;
};

MenubarItem.prototype.handleMouseover = function (event) {
    this.hasHover = true;
    this.popupMenu.open();
};

MenubarItem.prototype.handleMouseout = function (event) {
    this.hasHover = false;
    setTimeout(this.popupMenu.close.bind(this.popupMenu, false), 300);
};

/*
*   @method Header.prototype.init
*
*   @desc
*       Adds ARIA role to the menubar node
*       Traverse menubar children for A elements to configure each A element as a ARIA menuitem
*       and populate menuitems array. Initialize firstItem and lastItem properties.
*/
Header.prototype.init = function () {
    let menubarItem, childElement, menuElement, textContent, numItems;


    // Traverse the element children of menubarNode: configure each with
    // menuitem role behavior and store reference in menuitems array.
    let elem = this.domNode.firstElementChild;

    while (elem) {
        let menuElement = elem.firstElementChild;

        if (elem && menuElement && menuElement.tagName === 'A') {
            menubarItem = new MenubarItem(menuElement, this);
            menubarItem.init();
            this.menubarItems.push(menubarItem);
            textContent = menuElement.textContent.trim();
            this.firstChars.push(textContent.substring(0, 1).toLowerCase());
        }

        elem = elem.nextElementSibling;
    }

    // Use populated menuitems array to initialize firstItem and lastItem.
    numItems = this.menubarItems.length;
    if (numItems > 0) {
        this.firstItem = this.menubarItems[0];
        this.lastItem = this.menubarItems[numItems - 1];
    }
    this.firstItem.domNode.tabIndex = 0;
};

/* FOCUS MANAGEMENT METHODS */

Header.prototype.setFocusToItem = function (newItem) {

    var flag = false;

    for (var i = 0; i < this.menubarItems.length; i++) {
        var mbi = this.menubarItems[i];

        if (mbi.domNode.tabIndex == 0) {
            flag = mbi.domNode.getAttribute('aria-expanded') === 'true';
        }

        mbi.domNode.tabIndex = -1;
        if (mbi.popupMenu) {
            mbi.popupMenu.close();
        }
    }

    newItem.domNode.focus();
    newItem.domNode.tabIndex = 0;

    if (flag && newItem.popupMenu) {
        newItem.popupMenu.open();
    }
};

Header.prototype.setFocusToFirstItem = function (flag) {
    this.setFocusToItem(this.firstItem);
};

Header.prototype.setFocusToLastItem = function (flag) {
    this.setFocusToItem(this.lastItem);
};

Header.prototype.setFocusToPreviousItem = function (currentItem) {
    var index;

    if (currentItem === this.firstItem) {
        let newItem = this.lastItem;
    } else {
        index = this.menubarItems.indexOf(currentItem);
        let newItem = this.menubarItems[index - 1];
    }

    this.setFocusToItem(newItem);

};

Header.prototype.setFocusToNextItem = function (currentItem) {
    var index;

    if (currentItem === this.lastItem) {
        let newItem = this.firstItem;
    } else {
        index = this.menubarItems.indexOf(currentItem);
        let newItem = this.menubarItems[index + 1];
    }

    this.setFocusToItem(newItem);

};

Header.prototype.setFocusByFirstCharacter = function (currentItem, char) {
    var start, index, char = char.toLowerCase();
    var flag = currentItem.domNode.getAttribute('aria-expanded') === 'true';

    // Get start index for search based on position of currentItem
    start = this.menubarItems.indexOf(currentItem) + 1;
    if (start === this.menubarItems.length) {
        start = 0;
    }

    // Check remaining slots in the menu
    index = this.getIndexFirstChars(start, char);

    // If not found in remaining slots, check from beginning
    if (index === -1) {
        index = this.getIndexFirstChars(0, char);
    }

    // If match was found...
    if (index > -1) {
        this.setFocusToItem(this.menubarItems[index]);
    }
};

Header.prototype.getIndexFirstChars = function (startIndex, char) {
    for (var i = startIndex; i < this.firstChars.length; i++) {
        if (char === this.firstChars[i]) {
            return i;
        }
    }
    return -1;
};

export default Header