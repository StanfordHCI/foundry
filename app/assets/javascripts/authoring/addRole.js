(function() {
  // validator
  function isValidRole(str) {
    return str.length > 0;
  }

  $('.add-role').click(addRoleClickFunction);
  function addRoleClickFunction(e) {
    if($(this).hasClass('active')) return;
    
    e.preventDefault();
    
    var input = $('<input id="addMemberInput" type="text" placeholder="Add new role">')
      .css({
        'border-bottom': 'none',
      });
    
    // Replace the 'add new role' text with an input
    $(this)
      .addClass('active')
      .find('.name')
      .replaceWith(input);
    
    var that = $(this);
    var indicator = $(this).find('.indicator');
  
    // focus on the input
    input.focus()
      .keypress(function() {
        if(isValidRole($(this).val())) {
          indicator.addClass('spin-anim');
          that.addClass('valid');
        }
      })
      .keypress(function(e) {
        
        if(e.keyCode != 13 /* enter */) return;
        
        // not valid
        if(!isValidRole($(this).val())) return;
        
        // adds member to JSON data
        addMember();
        
        // Creates a new add role field and triggers
        // its click function (can add multiple roles
        // quickly one after the other)
        var a = createAddRole()
          .click(addRoleClickFunction)
          .hide()
          .insertAfter(that);
        
        // remove the old add role field and
        // set the focus on the new one
        that.remove();
        a.show().click();
      })
      .focusout(function(){
          if($('.add-role').length === 1) { // just this one add role exists
            var newAddRole = createAddRole()
              .click(addRoleClickFunction)
              .hide()
              .insertAfter(that);
            that.remove();
            newAddRole.show();
          }
      });
    
    function createAddRole() {
      return $(
        '<div class="add-role role">' +
          '<div class="indicator plus">+</div>' +
          '<span class="name">Add new role</span>' +
          '<div class="clear"></div>' +
        '</div>');
    }
  }
})();