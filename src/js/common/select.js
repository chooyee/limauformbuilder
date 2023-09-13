(function() {
    "use strict";
  
    var Select = function(element) {
      this.element = element;
      this.options = [];
      this.selectedOption = null;
  
      this.init();
    };
  
    Select.prototype.init = function() {
      var options = this.element.querySelectorAll("option");
  
      for (var i = 0; i < options.length; i++) {
        this.options.push({
          text: options[i].textContent,
          value: options[i].value
        });
      }
  
      this.selectedOption = this.options[0];
  
      this.element.addEventListener("change", this.handleChange.bind(this));
    };
  
    Select.prototype.handleChange = function() {
      this.selectedOption = this.options[this.element.selectedIndex];
    };
  
    window.Select = Select;
  })();