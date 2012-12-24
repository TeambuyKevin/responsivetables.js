/**
 * stacktable.js
 * Author & copyright (c) 2012: John Polacek
 * Dual MIT & GPL license
 *
 * Page: http://johnpolacek.github.com/stacktable.js
 * Repo: https://github.com/johnpolacek/stacktable.js/
 *
 * jQuery plugin for stacking tables on small screens
 * Modified by TasteAway for greatness
 */
;(function($) {
    $.fn.stacktable = function(options) {      
        var $tables  = this,
            defaults = {    
                        id : 'stacktable',
                        class : '',
                        hideOriginal : false,
                        title : null, // numeric, null, user defined
                        collapsible : false,
                        collapsibleTitle : null, // Index of heading to display
                        collapsibleTitleKey : true,
                        startCollapsed : true
            },
            settings = $.extend(
                                defaults, 
                                options
            ),
            methods  = $.extend({
                                createHeadings : function(src){
                                    var k = [];
                                    $(src).find('th,td').each(function(i){
                                        k.push($(this).find(':last-child').text());
                                    });
                                    return k;
                                },
                                createRow : function(k, data){
                                    var r = '';
                                    if($.trim(data) != ''){
                                        r += '<div class="mobilized-body-50 mobilized-left-col">' + k + '</div>';
                                        r += '<div class="mobilized-body-50 mobilized-right-col">' + $.trim(data) + '</div>';
                                    } else {
                                        r += '<div class="mobilized-body-100 mobilized-left-col">' + k + '</div>';
                                    }
                                    return r;
                                },
                                createCollapsibleHeading : function(src, k){
                                    var extHeader = $.trim(src);
                                    if(settings.collapsibleTitleKey)
                                        extHeader = k + ' ' + extHeader;
                                    return extHeader;
                                },
                                createTableEventListeners : function(){
                                    $('.mobilized-heading .close').live('click', function(){
                                        p = $(this).parent().parent();
                                        if($(this).hasClass('is-closed')){
                                            $(this).html('&times;');
                                            $(this).removeClass('is-closed');
                                            p.find('.mobilized-row-wrapper').show();
                                            p.css('background', "none");
                                        } else {
                                            $(this).html('&#043;').addClass('is-closed');
                                            p.find('.mobilized-row-wrapper').hide();
                                            p.css('backgroundColor', "#EEE");
                                        }
                                    });
                                    if(settings.startCollapsed) {
                                        $('.mobilized-heading .close').each(function(i){
                                            if(i > 0)
                                                $(this).click();
                                        });  
                                    }
                                        
                                }
            }),
            stacktable;

        return $tables.each(function() {        
            var $stacktable     = $('<div class="' + settings.id + '"></div>'),
                $table          = $(this),
                $headings       = $table.find('thead tr') || $table.find('tr:first-child'),
                markup          = '', 
                rowOffset       = $table.find('tbody').length,
                headerOffset    = (rowOffset > 0) ? 0 : 1,
                tableBody       = null;
          
            if(settings.class && settings.class.length > 0) { 
                var classes = $.trim(settings.class).split(' ');
                for(var i in classes){
                    $stacktable.addClass(classes[i]);
                }
            }          
            
            tableBody = (rowOffset >= 0 && $table.find('tbody').length > 0) ? 'tbody tr' : 'tr';

            $table.find(tableBody).each(function(index) {
                var keys = methods.createHeadings($headings);
                markup += '<div id="mobilized-table-' + index + '" class="mobilized-table-wrapper">';
                if(index >= headerOffset) {
                    if(settings.title != null) {
                        tableTitle = (settings.title == 'numeric') ? (index + 1).toString() + '.'  : $.trim(settings.title);
                        closeButton = (settings.collapsible) ? '<button type="button" class="close">&times;</button>': '';
                        tableTitleExt = '';
                        if(settings.collapsibleTitle != null)
                            tableTitleExt = methods.createCollapsibleHeading($(this).find('td').eq(settings.collapsibleTitle).text(), keys[settings.collapsibleTitle]);
                        markup += '<div class="mobilized-heading mobilized-body-100"><span>' + tableTitle + ' ' + tableTitleExt + '</span>' + closeButton + '</div>';                        
                    }
                }
                markup += '<div id="mobilized-table-' + index + '" class="mobilized-row-wrapper">';
                $(this).find('td').each(function(index) {                        
                    markup += methods.createRow(keys[index], $(this).html());                    
                });
                markup += '</div></div>';
            });
        
            $stacktable.append($(markup));
            $table.before($stacktable);
            
            if(settings.collapsible)
                methods.createTableEventListeners();
            
            if(settings.hideOriginal) 
                $table.hide();
            
      });

    };

}(jQuery));
