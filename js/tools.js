Node.prototype.insertAfter = function(node) {
    this.parentNode.insertBefore(node, this.nextSibling);
};

NodeList.prototype.each = function(func) {

    if (func == null || typeof func == "undefined")
    {
        console.error("[TOOLS] You run each() without callback.");
        return false;
    }

    [].forEach.call(this, function(item) {
        func(item)
    });
};