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
        if(in_progress && flashTeamsJSON["paused"]!=true) { $role.addClass('disabled'); }
        else  $role.removeClass('disabled');
      

        if($(this).hasClass('disabled')) { return; }
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
            closeOpenPopovers();
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
        closeOpenPopovers();
        var $addFolderButton = $(this);
        
        // check if the team is currently in progress
        if(in_progress && flashTeamsJSON["paused"]!=true) { $addFolderButton.addClass('disabled'); }
        else  $addFolderButton.removeClass('disabled');

        if($addFolderButton.hasClass('disabled')) { return; }
        
        $addFolderButton.addClass('active');
        var $rolesMenu = $(this).parents('.roles-menu').addClass('active');
        
        var $oldSpan = $(this).find('span');
        var $input = $('<input type="text" id="addFolderInput" ' +
                       'placeholder="Add folder">')
            .focusout(function() {
                $addFolderButton.removeClass('active');
                $rolesMenu.removeClass('active');
                $input.tooltip('destroy');
                $(this).replaceWith($oldSpan);
            })
            .keyup(function(e) {
                var name = $(this).val();
                if(e.keyCode === 13 /* enter */) {
                    if(!isValidFolder(name)) return;
                    addFolder(name);
                    $(this).focusout();
                    $input.tooltip('destroy');
                } else if(isValidFolder(name)) {
                    $input.attr('data-toggle', 'tooltip').tooltip('destroy')
                        .tooltip({
                            placement: 'top',
                            title: 'Press Enter to add \'' + name + '\'',
                            trigger: 'manual',
                            animation: false
                        }).tooltip('show');
                } else {
                    $input.tooltip('destroy');
                }
            });
        $(this).find('span').replaceWith($input);
        $input.focus();
    };
    $('.add-folder').click(addFolderClickFn);
})();