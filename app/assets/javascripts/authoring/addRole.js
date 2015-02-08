(function() {
    var $role = $('.add-role');
    var $input = $role.find('input');
    var $nameSpan = $role.find('.name');
    var $indicator = $role.find('.indicator');
    
    var isValidRole = function(str) {
        return str.length > 0;
    };
    
    var submitRole = function() {
        if(isValidRole($input.val())) {
            addMember();
            $input.val('');
            $indicator.removeClass('spin-anim').tooltip('destroy');
            $role.removeClass('valid');
        }
    };
    
    $role.click(function() {
        $role.addClass('active');
        if(isValidRole($input.val())) {
            $role.addClass('valid');
        }
        $nameSpan.hide();
        $input.show().focus();
    });
    
    $indicator.click(function() {
        if(isValidRole($input.val())) {
            submitRole();
        }
    });
    
    $input.keyup(function(e) {
        if(e.keyCode === 13) {
            submitRole();
        } else if(isValidRole($input.val())) {
            $indicator.addClass('spin-anim')
                .attr('data-toggle', 'tooltip')
                .tooltip('destroy').tooltip({
                    title: 'Add \'' + $input.val() + '\'',
                    placement: 'bottom'
                });
            $role.addClass('valid');
        } else {
            $indicator.tooltip('destroy');
            $indicator.removeClass('spin-anim').tooltip('destroy');
            $role.removeClass('valid');
        }
    }).focusout(function() {
        $role
            .removeClass('active')
            .removeClass('valid');
        $indicator.removeClass('spin-anim').tooltip('destroy');
        $nameSpan.show();
        $input.hide();
    });
})();

(function() {
    var isValidFolder = function(str) {
        return str.length > 0;
    };
    
    var addFolderClickFn = function(e) {
        var $addFolderButton = $(this).addClass('active');
        var $rolesMenu = $(this).parents('.roles-menu').addClass('active');
        
        var $oldSpan = $(this).find('span');
        var $input = $('<input type="text" id="addFolderInput" ' +
                       'placeholder="Add folder">')
            .focusout(function() {
                $addFolderButton.removeClass('active');
                $rolesMenu.removeClass('active');
                $(this).replaceWith($oldSpan);
            })
            .keypress(function(e) {
              if(e.keyCode != 13 /* enter */) return;
              
              var name = $(this).val();
              if(!isValidFolder(name)) return;
              addFolder(name);
              
              $(this).focusout();
            });
        $(this).find('span').replaceWith($input);
        $input.focus();
    };
    $('.add-folder').click(addFolderClickFn);
})();