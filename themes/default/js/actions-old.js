// vim: syntax=javascript tabstop=4 softtabstop=0 noexpandtab laststatus=1 ruler

/**
 * html/themes/default/js/actions.js
 *
 * Actions for HTML elements
 *
 * @author Andrea Dainese <andrea.dainese@gmail.com>
 * @author Alain Degreffe <eczema@ecze.com>
 * @copyright 2014-2016 Andrea Dainese
 * @copyright 2017-2018 Alain Degreffe
 * @license BSD-3-Clause https://github.com/dainok/unetlab/blob/master/LICENSE
 * @link http://www.eve-ng.net/
 * @version 20181203
 */

window.old_cfs = 'default' ;
window.cur_cfs = 'default' ;

var KEY_CODES = {
    "tab": 9,
    "enter": 13,
    "shift": 16,
    "ctrl": 17,
    "alt": 18,
    "escape": 27
};

// Attach files
$('body').on('change', 'input[type=file]', function (e) {
    ATTACHMENTS = e.target.files;
});

// Add the selected filename to the proper input box
$('body').on('change', 'input[name="import[file]"]', function (e) {
    $('input[name="import[local]"]').val($(this).val());
});

// Choose node config upload file
$('body').on('change', 'input[name="upload[file]"]', function (e) {
    $('input[name="upload[path]"]').val($(this).val());
});

// Choose configset upload file
$('body').on('change', 'input[name="upload[configset]"]', function (e) {
    $('input[name="uploadconfigset[path]"]').val($(this).val());
});

// On escape remove mouse_frame
$(document).on('keydown', 'body', function (e) {
    var $labViewport = $("#lab-viewport")
        , isFreeSelectMode = $labViewport.hasClass("freeSelectMode")
        , isEditCustomShape = $labViewport.has(".edit-custom-shape-form").length > 0
        , isEditText = $labViewport.has(".edit-custom-text-form").length > 0
        , isEditcustomText = $labViewport.has(".editable").length > 0
        , isLinkStyle = $labViewport.has(".edit-network-style-form").length > 0
        , isLineStyle = $labViewport.has(".edit-line-style-form").length > 0

        ;

    if (KEY_CODES.escape == e.which) {
    $('.action-fullscreen').html('<i style="" class="glyphicon glyphicon-fullscreen"></i>' + MESSAGES[226])
        $('.lab-viewport-click-catcher').unbind('click');
        $('#mouse_frame').remove();
        $('#lab-viewport').removeClass('lab-viewport-click-catcher').data("prevent-contextmenu", false);
        $('#context-menu').remove();
        $('.free-selected').removeClass('free-selected')
        $('.ui-selected').removeClass('ui-selected')
        $('.ui-selecting').removeClass('ui-selecting')
        $("#lab-viewport").removeClass('freeSelectMode')
	$('#alert_container > b > .fa-angle-up').click();
        lab_topology.clearDragSelection();
        if ((ROLE == 'admin' || ROLE == 'editor') &&  LOCK == 0  ) {
              lab_topology.setDraggable($('.node_frame, .network_frame, .customShape'), true)
        }
    }
    if (isEditCustomShape && KEY_CODES.escape == e.which) {
        $(".edit-custom-shape-form button.cancelForm").click(); // it will handle all the stuff
    }
    if (isEditText && KEY_CODES.escape == e.which) {
        $(".edit-custom-text-form button.cancelForm").click();  // it will handle all the stuff
    }
    if (isLinkStyle && KEY_CODES.escape == e.which) {
        $(".edit-network-style-form button.cancelForm").click();  // it will handle all the stuff
    }
    if (isLineStyle && KEY_CODES.escape == e.which) {
        $(".edit-line-style-form button.cancelForm").click();  // it will handle all the stuff
    }
    if (isEditcustomText && KEY_CODES.escape == e.which) {
    if ( window.ck != null )  { 
       new_data = CurCKEDITOR.getData();
                curtext='#'+window.ck;
                CurCKEDITOR.destroy().then( function () {
                logger(1, "set content of id=" +  window.ck +" as " + new_data );
                tid = window.ck.replace('customText','');
                $("#customText" + tid).html(new_data)
                full_data = $("#customText" + tid).prop('outerHTML')
                editTextObject(tid, {data: full_data});
                $("#MyPdf_customText" + tid).trigger('play')
                window.ck = null
                });
    }
    $('.customText').css('cursor', 'move');
    restoreSelectLabTopology();
        logger ( 1 , "ckeditor remover due to keydown");
    $('.customText').focusout()
    $('.customText').blur()
    }
});

//Add picture MAP
$('body').on('click', '.follower-wrapper', function (e) {
    var img_width_original  = +$(".follower-wrapper img").attr('width-val')
    var img_height_original = +$(".follower-wrapper img").attr('height-val')
    var data_x = $("#follower").data("data_x");
    var data_y = $("#follower").data("data_y");
    var img_width_resized = $(".follower-wrapper img").width()
    var img_height_resized = $(".follower-wrapper img").height()

    var k = 1;
    if($('.follower-wrapper img').hasClass('picture-img-autosozed')){
        k = img_width_original / img_width_resized;
    }

    var y = (parseInt((data_y).toFixed(0)) * k).toFixed(0);
    var x = (parseInt((data_x).toFixed(0)) * k).toFixed(0);
    var current_href=""
    if ( $("#map_nodeid option:selected").val().match(/CUSTOM/) ) {
         $('form textarea.custommap').val($('form textarea.custommap').val() + "<area shape='circle' alt='img' coords='" + x + "," + y + (",30' href='telnet://{{IP}}:{{NODE"+$("#map_nodeid option:selected").val()+"}}'>\n").replace(/telnet.*NODECUSTOM}}/,"proto://CUSTOM_IP:CUSTOM_PORT"));
    } else {
         $('form textarea.map').val($('form textarea.map').val() + "<area shape='circle' alt='img' coords='" + x + "," + y + (",30' href='telnet://{{IP}}:{{NODE"+$("#map_nodeid option:selected").val()+"}}'>\n").replace(/telnet.*NODECUSTOM}}/,"proto://CUSTOM_IP:CUSTOM_PORT"));
    }
    var htmlsvg="" ;
    htmlsvg = '<div class="map_mark" id="'+x+","+y+","+30+'" style="position:absolute;top:'+(y-30)+'px;left:'+(x-30)+'px;width:60px;height:60px;"><svg width="60" height="60"><g><ellipse cx="30" cy="30" rx="28" ry="28" stroke="#000000" stroke-width="2" fill="#ffffff"></ellipse><text x="50%" y="50%" text-anchor="middle" alignment-baseline="central" stroke="#000000" stroke-width="0px" dy=".2em" font-size="12" >' + ("NODE"+$("#map_nodeid option:selected").val()).replace(/NODE.*CUSTOM.*/,"CUSTOM")+'</text></g></svg></div>'
    $(".follower-wrapper").append(htmlsvg)
});


//<div class="map_mark" id="'+area.coords+'"
// context menu on picture edit
$(document).on('contextmenu', '.follower-wrapper', function(e){
    // Prevent default context menu on viewport
    e.stopPropagation();
    e.preventDefault();
    var body = '';
        body += '<li><a class="action-showfull-picture" href="javascript:void(0)">Set original size</a></li>';
        body += '<li><a class="action-autosize" href="javascript:void(0)">Set autosize</a></li>';
        //printContextMenu('Picture size', body, e.pageX, e.pageY,true,"menu");
})

$(document).on('click', '.action-showfull-picture', function(){
    $('#context-menu').remove();
    FOLLOW_WRAPPER_IMG_STATE = 'full'
    $('.follower-wrapper img').removeClass('picture-img-autosozed')
    $('#lab_picture img').removeClass('picture-img-autosozed')
})

$(document).on('click', '.action-modal-fullscreen', function(){
    if ( $(".modal-content").hasClass("modal-fullscreen") === true ) {
        $(".modeless").removeClass("modal-fullscreen");
        $(".modal-content").removeClass("modal-fullscreen");
        $(".modal-ultra-wide").removeClass("modal-fullscreen");
        $(".modal-wide").removeClass("modal-fullscreen");
     } else {
        $(".modeless").addClass("modal-fullscreen");
            $(".modal-content").addClass("modal-fullscreen");
            $(".modal-ultra-wide").addClass("modal-fullscreen");
            $(".modal-wide").addClass("modal-fullscreen");
     }
})

$(document).on('click', '.action-autosize', function(){
    $('#context-menu').remove();
    FOLLOW_WRAPPER_IMG_STATE = 'resized'
    $('.follower-wrapper img').addClass('picture-img-autosozed')
    $('#lab_picture img').addClass('picture-img-autosozed')
})

// Accept privacy
$(document).on('click', '#privacy', function () {
    $.cookie('privacy', 'true', {
        expires: 90,
        path: '/'
    });
    if ($.cookie('privacy') == 'true') {
        window.location.reload();
    }
});

// Select folders, labs or users
$(document).on('click', 'a.folder, a.lab, tr.user', function (e) {
    logger(1, 'DEBUG: selected "' + $(this).attr('data-path') + '".');
    if ($(this).hasClass('selected')) {
        // Already selected -> unselect it
        $(this).removeClass('selected');
    } else {
        // Selected it
        $(this).addClass('selected');
    }
});

// Remove modal on close
$(document).on('hidden.bs.modal', '.modal', function (e) {
    if ( $(".addConn-form").length > 0 ) {
	    try { lab_topology.deleteConnection(window.tmpconn) } catch(e) {}
       // $('.action-labtopologyrefresh').click();
    }
    $(this).remove();
    if ($('body').children('.modal.fade.in')) {
        $('body').children('.modal.fade.in').focus();
        $('body').children('.modal.fade.in').css("overflow-y", "auto");
    }
    if ($(this).prop('skipRedraw') && !$(this).attr('skipRedraw')) {
        printLabTopology();
    }
    $(this).attr('skipRedraw', false);
});


// Remove modeless

$(document).on('hidden.bs.modal','.modeless' , function (e) {
    $('.modeless').remove();
});

// Set autofocus on show modal
$(document).on('shown.bs.modal', '.modal', function () {
    $('.autofocus').focus();
});

// After node/network move
function ObjectPosUpdate (e ,ui) {
     var groupMove = []
     if ( $('.node_frame.ui-selected, node_frame.ui-selecting, .network_frame.ui-selected,.network_ui-selecting, .customShape.ui-selected, .customShape.ui-selecting, .line.ui-selected, .line.ui-selecting ').length == 0 ) {
          groupMove.push(e)
     } else {
          $('.node_frame.ui-selected, node_frame.ui-selecting, .network_frame.ui-selected,.network_ui-selecting, .customShape.ui-selected, .customShape.ui-selecting, .line.ui-selected, .line.ui-selecting').each( function ( id, node ) {
                groupMove.push(node)
          });
     }
     window.dragstop = 0
     if (  event.metaKey || ( event.e != undefined && event.e.metaKey )  || event.ctrlKey || (  event.e != undefined && event.e.ctrlKey)  ) return
     var zoom = $('#zoomslide').slider("value")/100 ;
     if ( groupMove.length > 1 && LOCK == 0 ) {
	     window.dragstop = 1
	     $.blockUI({
                 message: '<p>Saving changes</p>',
                 css: {
                    border: 'none',
                    padding: '15px',
                    backgroundColor: '#000',
                    '-webkit-border-radius': '10px',
                    '-moz-border-radius': '10px',
                    opacity: .5,
                    color: '#fff'
                 }
             });
     }
     window.moveCount += 1
     logger(1, 'DEBUG: movecount:' + window.moveCount + ' groupMove:'+groupMove.length);
     var tmp_nodes = [],
         tmp_shapes = [],
         tmp_networks = [],
         tmp_lines = [];
     $.each( groupMove,  function ( id, node ) {
      eLeft = Math.round($('#'+node.id).position().left / zoom + $('#lab-viewport').scrollLeft());
      eTop = Math.round($('#'+node.id).position().top / zoom + $('#lab-viewport').scrollTop());
          id = node.id
          logger(1,'DEBUG: parsing' + id);
          $('#'+id).addClass('dragstopped')
          if ( id.search('node') != -1 ) {
               logger(1, 'DEBUG: setting' + id + ' position.');
               tmp_nodes.push( { id : id.replace('node','') , left: eLeft, top: eTop } )
          } else if  ( id.search('network') != -1 )  {
              logger(1, 'DEBUG: setting ' + id + ' position.');
              tmp_networks.push( { id : id.replace('network','') , left: eLeft, top: eTop } )
          } else if ( id.search('custom') != -1 )  {
              logger(1, 'DEBUG: setting ' + id + ' position.');
              objectData = node.outerHTML;
              objectData = fromByteArray(new TextEncoderLite('utf-8').encode(objectData));
              tmp_shapes.push( { id : id.replace(/customShape/,'').replace(/customText/,'') , data: objectData } )
          } else if ( id.search('startLine') != -1 ) {
              logger(1, 'DEBUG: setting ' + id + ' position.');
              tmp_lines.push( {id: id.replace('startLine',''), y1: eLeft, x1: eTop} )
          } else if (id.search('endLine') != -1 )  {
              logger(1, 'DEBUG: setting ' + id + ' position.');
              tmp_lines.push( {id: id.replace('endLine',''), y2: eLeft, x2: eTop} )
          }
     });
     $.when(setNodesPosition(tmp_nodes)).done(function () {
           logger(1, 'DEBUG: all selected node position saved.');
           $.when(editTextObjects(tmp_shapes)).done(function () {
                logger(1, 'DEBUG: all selected shape position saved.');
                $.when(setNetworksPosition(tmp_networks)).done(function () {
                     logger(1, 'DEBUG: all selected networks position saved.');
                     $.when(editLineObjects(tmp_lines)).done(function () {
                        logger(1, 'DEBUG: all selected lines position saved.');
			$.unblockUI();
                     }).fail(function (message) {
                        addModalError(message);
			$.unblockUI();
                     });
                }).fail(function (message) {
                     addModalError(message);
		     $.unblockUI();
                });
           }).fail(function (message) {
                addModalError(message);
		$.unblockUI();
           });
     }).fail(function (message) {
         // Error on save
         addModalError(message);
	 $.unblockUI();
     });
     adjustZoom(lab_topology)
     window.moveCount = 0
}

// Close all context menu
$(document).on('mousedown', '*', function (e) {
    if (!$(e.target).is('#context-menu, #context-menu *')) {
        // If click outside context menu, remove the menu
        e.stopPropagation();
        $('#context-menu').remove();

    }
});

// Open context menu block
$(document).on('click', '.menu-collapse, .menu-collapse i', function (e) {
    e.preventDefault();  // Prevent default behaviour
    var item_class = $(this).attr('data-path');
    $('.' + item_class).slideToggle('fast');
});

// Open context menu block
$(document).on('click', '.menu-appear, .menu-appear i', function (e) {
    e.preventDefault();  // Prevent default behaviour
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var contextMenuClickX = $("#lab-viewport").data('contextMenuClickXY').x
    var contextMenuClickY = $("#lab-viewport").data('contextMenuClickXY').y
    if(windowWidth - 320 <= contextMenuClickX){
        $('#capture-menu').css('left', -150)
    } else {
        $('#capture-menu').css('right', -150)
    }
    $('#capture-menu li a').toggle('fast')
    $('#capture-menu').toggle({
        duration: 10,
        progress: function(){
                // console.log('arguments',arguments)
                // console.log("height, fix", $('#capture-menu').height(), windowHeight - contextMenuClickY - 145)
                if(contextMenuClickY > windowHeight - 300){
                    if($('#capture-menu').height() > contextMenuClickY + 145){
                        $('#capture-menu').css({
                            'height': contextMenuClickY - 145,
                            'overflow': 'hidden',
                            'overflow-y': 'scroll'
                        })
                    }
                    $('#capture-menu').css('bottom', '114px')
                } else {
                    if($('#capture-menu').height() > (windowHeight - contextMenuClickY - 145)){
                        $('#capture-menu').css({
                                'height': windowHeight - contextMenuClickY - 145,
                                'top': '136px',
                                'overflow': 'hidden',
                                'overflow-y': 'scroll'
                            })
                    }
                }
        },
        complete: function(){

            if(!contextMenuClickY > windowHeight - 300 && $('#capture-menu').height() > (windowHeight - contextMenuClickY - 145)){
                $('#capture-menu').css({
                            'height': windowHeight - contextMenuClickY - 145,
                            'top': '136px',
                            'overflow': 'hidden',
                            'overflow-y': 'scroll'
                        })
                console.log('hei2', windowHeight - contextMenuClickY - 145)
            }

        }
    })

    if($('.menu-appear > i').hasClass('glyphicon-chevron-left')){
        $('.menu-appear > i').addClass('glyphicon-chevron-right').removeClass('glyphicon-chevron-left')
    } else {
        $('.menu-appear > i').addClass('glyphicon-chevron-left').removeClass('glyphicon-chevron-right')
    }
});

// Open context menu block
$(document).on('click', '.graph-menu-appear, .menu-appear i', function (e) {
    e.preventDefault();  // Prevent default behaviour
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var contextMenuClickX = $("#lab-viewport").data('contextMenuClickXY').x
    var contextMenuClickY = $("#lab-viewport").data('contextMenuClickXY').y
    if(windowWidth - 320 <= contextMenuClickX){
        $('#graph-menu').css('left', -150)
    } else {
        $('#graph-menu').css('right', -150)
    }
    $('#graph-menu li a').toggle('fast')
    $('#graph-menu').toggle({
        duration: 10,
        progress: function(){
                // console.log('arguments',arguments)
                // console.log("height, fix", $('#capture-menu').height(), windowHeight - contextMenuClickY - 145)
                if(contextMenuClickY > windowHeight - 300){
                    if($('#graph-menu').height() > contextMenuClickY + 145){
                        $('#graph-menu').css({
                            'height': contextMenuClickY - 145,
                            'overflow': 'hidden',
                            'overflow-y': 'scroll'
                        })
                    }
                    $('#graph--menu').css('bottom', '114px')
                } else {
                    if($('#graph-menu').height() > (windowHeight - contextMenuClickY - 145)){
                        $('#graph-menu').css({
                                'height': windowHeight - contextMenuClickY - 145,
                                'top': '136px',
                                'overflow': 'hidden',
                                'overflow-y': 'scroll'
                            })
                    }
                }
        },
        complete: function(){

            if(!contextMenuClickY > windowHeight - 300 && $('#graph-menu').height() > (windowHeight - contextMenuClickY - 145)){
                $('#graph-menu').css({
                            'height': windowHeight - contextMenuClickY - 145,
                            'top': '136px',
                            'overflow': 'hidden',
                            'overflow-y': 'scroll'
                        })
                console.log('hei2', windowHeight - contextMenuClickY - 145)
            }

        }
    })

    if($('.graph-menu-appear > i').hasClass('glyphicon-chevron-left')){
        $('.graph-menu-appear > i').addClass('glyphicon-chevron-right').removeClass('glyphicon-chevron-left')
    } else {
        $('.graph-menu-appear > i').addClass('glyphicon-chevron-left').removeClass('glyphicon-chevron-right')
    }
});

// Open context menu block
$(document).on('click', '.menu-stop-appear', function (e) {
    e.preventDefault();  // Prevent default behaviour
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var contextMenuClickX = $("#lab-viewport").data('contextMenuClickXY').x
    var contextMenuClickY = $("#lab-viewport").data('contextMenuClickXY').y
    if(windowWidth - 320 <= contextMenuClickX){
        $('#stop-menu').css('left', -150)
    } else {
        $('#stop-menu').css('right', -150)
    }
    $('#stop-menu li a').toggle('fast')
    $('#stop-menu').toggle({
        duration: 10,
        progress: function(){
                // console.log('arguments',arguments)
                // console.log("height, fix", $('#capture-menu').height(), windowHeight - contextMenuClickY - 145)
                if(contextMenuClickY > windowHeight - 300){
                    if($('#stop-menu').height() > contextMenuClickY + 145){
                        $('#stop-menu').css({
                            'height': contextMenuClickY - 145,
				'overflow': 'hidden',
				'overflow-y': 'scroll'
			})
		    }
			$('#stop-menu').css('bottom', '114px')
		} else {
			if($('#stop-menu').height() > (windowHeight - contextMenuClickY - 145)){
				$('#stop-menu').css({
					'height': windowHeight - contextMenuClickY - 145,
					'top': '136px',
					'overflow': 'hidden',
					'overflow-y': 'scroll'
				})
			}
		}
	},
	    complete: function(){

		    if(!contextMenuClickY > windowHeight - 300 && $('#stop-menu').height() > (windowHeight - contextMenuClickY - 145)){
			    $('#stop-menu').css({
				    'height': windowHeight - contextMenuClickY - 145,
				    'top': '136px',
				    'overflow': 'hidden',
				    'overflow-y': 'scroll'
			    })
			    console.log('hei2', windowHeight - contextMenuClickY - 145)
		    }

	    }
    })

	if($('.menu-stop-appear').hasClass('glyphicon-chevron-left')){
		$('.menu-stop-appear').addClass('glyphicon-chevron-right').removeClass('glyphicon-chevron-left')
	} else {
		$('.menu-stop-appear').addClass('glyphicon-chevron-left').removeClass('glyphicon-chevron-right')
	}
});

$(document).on('contextmenu', '#lab-viewport', function (e) {
	// Prevent default context menu on viewport
	e.stopPropagation();
	e.preventDefault();
	$('.consolewrap, .taskwrap, .netdatawrap').css('z-index','4029')
	$('.frameoverlay').css('width','calc( 100% - 20px)')

	$("#lab-viewport").data('contextClickXY', {'x': e.pageX, 'y': e.pageY})

	logger(1, 'DEBUG: action = opencontextmenu');

	if ($(this).hasClass("freeSelectMode")) {
		// prevent 'contextmenu' on non Free Selected Elements

		return;
	}

	if ($(this).data("prevent-contextmenu")) {
		// prevent code execution

		return;
	}

	if ( window.connContext == 1 ) {
		window.connContext = 0
		//if (ROLE == "user" || LOCK == 1 ) return;
		body = '';
		if (  window.connToDel.id.search('Line') == -1 ) {
			if (ROLE != "user" && LOCK != 1 ) {  
				body += '<li><a class="action-connstyle" href="javascript:void(0)"><i class="glyphicon glyphicon-tint"></i> Edit Style</a></li>';
				// Serial ?
			}
			//if ( $('.frame_serial.' + window.connToDel.id.replace(/:/g,'\\:')).length == 0 ) {
			if (  $(window.connToDel.canvas).hasClass('frame_serial') == false ) { 
				body += '<li><a class="action-connquality" href="javascript:void(0)"><i class="fas fa-heartbeat"></i> Edit Quality</a></li>';
			}
			// src 
			//alert ( window.connToDel.sourceId ) 
			if ( $('#'+ window.connToDel.sourceId ).attr('data-linkstate') == 1 || $('#'+ window.connToDel.targetId ).attr('data-linkstate') == 1  ) {
				if ( window.connToDel.id.search('iface') != -1 ) {
					var network_id = window.connToDel.targetId.replace('network','');
					var match = 'endpoint_node'+window.connToDel.id.replace(/iface:node/,'').replace(/:.*/,'')+'_'+window.connToDel.id.replace(/iface:/,'').replace(/.*:/,'')+'.visible';
				} else {
					var network_id = window.connToDel.id.replace('network_id:',''); 
					var match = 'networkId_'+network_id+'.visible' ;
				}

				if ( $('.jtk-endpoint.'+match).length > 0 ) { 
					body += '<li><a class="action-linkresume" href="javascript:void(0)"><i class="fas fa-play"></i> Resume Link</a></li>'; 
				} else { 
					body += '<li><a class="action-linksuspend" href="javascript:void(0)"><i class="fas fa-pause"></i> Suspend Link</a></li>';
				}
			} 
			//}
			if (ROLE != "user" && LOCK != 1  ) {
				deldisp = 1 ;
				if ( $(window.connToDel.canvas).hasClass('frame_serial') ) { 
					// cget nodes 
					current_nodes=[];
					classList = $(window.connToDel.canvas).attr('class').split(/\s+/);
					$.each(classList, function(index,item) { 
						if ( item.match(/^node\d+$/) )  {
							current_nodes.push(item) 
						}
					});
					if ( $('#'+current_nodes[0]).attr('data-status') > 0 ||  $('#'+current_nodes[1]).attr('data-status') > 0 )  { deldisp=0  }
				}	 
				if ( deldisp == 1 ) { body += '<li><a class="action-conndelete" href="javascript:void(0)"><i class="glyphicon glyphicon-trash"></i> Delete</a></li>'; }
			}
			printContextMenu('Connection', body, e.pageX, e.pageY,false,"menu");
			return;
		}
		if (  ROLE != "user" && LOCK != 1 && window.connToDel.id.search('Line') != -1 ) {
			body += '<li><a class="action-linestyle" href="javascript:void(0)"><i class="glyphicon glyphicon-tint"></i> Edit Style</a></li>';
			body += '<li><a class="action-linedelete" href="javascript:void(0)"><i class="glyphicon glyphicon-trash"></i> Delete</a></li>';
			printContextMenu('Connection', body, e.pageX, e.pageY,false,"menu");
			return;
		}

	}

	if (ROLE != "user" && LOCK == 0 ) {
		var body = '';
		body += '<li><a class="action-nodeplace" href="javascript:void(0)"><i class="glyphicon glyphicon-hdd"></i> ' + MESSAGES[81] + '</a></li>';
		body += '<li><a class="action-networkplace" href="javascript:void(0)"><i class="glyphicon glyphicon-transfer"></i> ' + MESSAGES[82] + '</a></li>';
		body += '<li><a class="action-pictureadd" href="javascript:void(0)"><i class="glyphicon glyphicon-picture"></i> ' + MESSAGES[83] + '</a></li>';
		body += '<li><a class="action-customshapeadd" href="javascript:void(0)"><i class="glyphicon glyphicon-unchecked"></i> ' + MESSAGES[145] + '</a></li>';
		body += '<li><a class="action-textadd" href="javascript:void(0)"><i class="glyphicon glyphicon-font"></i> ' + MESSAGES[146] + '</a></li>';
		body += '<li><a class="action-lineadd" href="javascript:void(0)"><i class="glyphicon glyphicon-arrow-right"></i> ' + MESSAGES[227] + '</a></li>';
		body += '<li role="separator" class="divider">';
		body += '<li><a class="action-autoalign" href="javascript:void(0)"><i class="glyphicon glyphicon-th"></i> ' + MESSAGES[221] + '</a></li>';
		printContextMenu(MESSAGES[80], body, e.pageX, e.pageY,false,"menu");
	}
});
$('body').on('click', '.action-chat', function (e) {
	if  ( $('#lab-chat').width() == 0 ) {
		//$.when(getLabInfo($('#lab-viewport').attr('data-path')), getLabBody(), navigator.mediaDevices.getUserMedia({audio : true })).done(function (info, body) {
		$.when(getLabInfo($('#lab-viewport').attr('data-path')), getLabBody()).done(function (info, body) {
			$('#lab-viewport').css('right','300px');
			$('#lab-chat').css('width','300px');
			$('#lab-chat').css('border-style','none none none solid');
			$('#lab-chat').css('border-left','0px 0px 0px 5px');
			$('#alert_container').css('right','310px');
			$('#notification_container').css('right','310px');
			if ( chatsocket == null  )  chatConnect ( 1234 , USERNAME , TENANT )
		}).fail(function (message1, message2) {
			if (message1 != null) {
				addModalError(message1);
			} else {
				addModalError(message2)
			};
			//$('#lab-viewport').css('right','300px');
			//$('#lab-chat').css('width','300px');
			//if ( janus == null  )  chatConnect ( 1234 , USERNAME , TENANT )
		});
	} else {
		$('#lab-viewport').css('right','0px');
		$('#lab-chat').css('width','0px');
		$('#lab-chat').css('border','0px 0px 0px 0px');
		$('#lab-chat').css('border-style','none none none none');
		$('#alert_container').css('right','10px');
		$('#notification_container').css('right','10px');
	}
});

$('body').on('click', '.action-connstyle', function (e) {
	logger(1, 'DEBUG: action = action-connstyle');
	var id = window.connToDel.id
	printFormConnStyle(id);
	$('#context-menu').remove();
});

$('body').on('click', '.action-connquality', function (e) {
	logger(1, 'DEBUG: action = action-connquality');
	var id = window.connToDel.id
	printFormConnQuality(id);
	$('#context-menu').remove();
});


$('body').on('click', '.action-linestyle', function (e) {
	logger(1, 'DEBUG: action = action-linestyle');
	var id = window.connToDel.id.replace('Line','')
	printFormLineStyle(id);
	$('#context-menu').remove();
});


// Manage context menu
$(document).on('contextmenu', '.context-menu', function (e) {

	e.stopPropagation();
	e.preventDefault();  // Prevent default behaviour
	$('.taskwrap, .consolewrap, .netdatawrap').css('z-index','4029')
	$('.frameoverlay').css('width','calc( 100% - 20px)')
	var body = '' ;
	if ($("#lab-viewport").data("prevent-contextmenu")) {
		// prevent code execution

		return;
	}

	var isFreeSelectMode = $("#lab-viewport").hasClass("freeSelectMode");

	if (isFreeSelectMode && !$(this).is(".network_frame.free-selected, .node_frame.free-selected, .customShape.free-selected")) {
		// prevent 'contextmenu' on non Free Selected Elements
		return;
	}
	$("#lab-viewport").data('contextMenuClickXY', {'x': e.pageX, 'y': e.pageY})

	var isNodeRunning = $(this).attr('data-status') > 1;
	var status = $(this).attr('data-status')
	var content = '';


	if ($(this).hasClass('node_frame')) {
		logger(1, 'DEBUG: opening node context menu');

		var node_id = $(this).attr('data-path');
		var lab_id = $(this).attr('data-labId');
		var body = '';
		if(!isNodeRunning){
			body += '<li><a class="action-nodestart  menu-manage" data-path="' + node_id + '" data-name="' + title + '" href="javascript:void(0)">' +
				'<i class="glyphicon glyphicon-play"></i> ' + MESSAGES[66] +
				'</a>' +
				'</li>';
		}
		if(isNodeRunning){
			if ( $('#node'+  node_id + ' a').attr("href").indexOf('rdp') != -1 ) {
				body +=
					'<li>' +
					'<a class="menu-manage"  href="'+$('#node'+  node_id + ' a').attr("href")+'&fullscreen=1">' +
					'<i class="glyphicon glyphicon-fullscreen"></i> ' + 'Rdp Fullscreen' +
					'</a>' +
					'</li>'
			}
		}

		var title = $(this).attr('data-name') + " (" + node_id + ")"
		if(isNodeRunning){
			body += '<li>' +
				'<a class="action-node-autostop  menu-manage" data-path="' + node_id + '" data-name="' + title + '" href="javascript:void(0)">' +
				'<i class="glyphicon glyphicon-stop' + ( $(this).attr('data-qemu') == 1 ? ' hidden ' : '' )  +'"></i> ' +
				'<i class="glyphicon glyphicon-chevron-right menu-stop-appear' + ( $(this).attr('data-qemu') == 1 ? '' : ' hidden ' )  +'"></i> ' +
				MESSAGES[67] +
				'</a>' +
				'</li>' +
				//'<li class="' + ( $(this).attr('data-qemu') == 1 ? '' : ' hidden ' )  +'">' +
				//'<a><i class="glyphicon glyphicon-chevron-right' + ( $(this).attr('data-qemu') == 1 ? '' : ' hidden ' )  +'" style="padding-left:30px;"></i></a> ' +
				'<li class=" stop-menu-content' + ( $(this).attr('data-qemu') == 1 ? '' : ' hidden ' )  +'">' +
				'<div id="stop-menu">' +
				'<ul>' +
				'<li>' +
				'<a class="action-node-shutdown  context-collapsible menu-stop" data-path="' + node_id + '" data-name="' + title + '" href="javascript:void(0)" style="display: none;">' +
				'<i class="glyphicon glyphicon-stop"></i> ' + MESSAGES[222] +
				'</a>' +
				'</li>' +
				'<li>' +
				'<a class="action-node-poweroff  context-collapsible menu-stop" data-path="' + node_id + '" data-name="' + title + '" href="javascript:void(0)" style="display: none;">' +
				'<i class="glyphicon glyphicon-off"></i> ' + MESSAGES[224] +
				'</a>' +
				'</li>' +
				'<li>' +
				'<a class="action-node-hibernate  context-collapsible menu-stop" data-path="' + node_id + '" data-name="' + title + '" href="javascript:void(0)" style="display: none;">' +
				'<i class="glyphicon glyphicon-pause"></i> ' + MESSAGES[223] +
				'</a>' +
				'</li>' +
				'</ul>' +
				'</div>' +
				//'</div>'+
				//'</div>'+
				//'</a>' +
				//'</li>' +
				'</li>' 
		}
		if(isNodeRunning){ 
			body+=	'<li>' +
				'<a class="action-nodeview control" data-path="' + node_id + '" data-name="' + title + '" href="javascript:void(0)">' +
				'<i class="glyphicon glyphicon-edit"></i> ' + MESSAGES[246] +
				'</a>' +
				'</li>'
		}
		body += '<li>' +
			'<a class="action-nodewipe menu-manage" data-path="' + node_id + '" data-name="' + title + '" href="javascript:void(0)">' +
			'<i class="glyphicon glyphicon-erase"></i> ' + MESSAGES[68] +
			'</a>' +
			'</li>' +
			'</li>';
		if(isNodeRunning){
			if ((ROLE == 'admin' || ROLE == 'editor') &&  LOCK == 0  ) {
				body +=   '<li>' +
					'<a class="action-nodeexport" data-path="' + node_id + '" data-name="' + title + '" href="javascript:void(0)">' +
					'<i class="glyphicon glyphicon-save"></i> ' + MESSAGES[69] +
					'</a>' +
					'</li>';
			}
			// capture section
			body += '<li role="separator" class="divider">' +
				'</li>' +
				'<li id="menu-node-interfaces">' +
				'<a class="menu-appear" data-path="menu-interface" href="javascript:void(0)">' +
				'<i class="glyphicon glyphicon-chevron-right"></i> ' + MESSAGES[70] +
				'</a>' +
				'<div id="capture-menu">' +
				'<ul></ul>' +
				'</div>'+
				'</li>';
			// monitor section
                        body += '<li id="menu-graph-interfaces">' +
                                '<a class="graph-menu-appear" data-path="menu-interface-graph" href="javascript:void(0)">' +
                                '<i class="glyphicon glyphicon-chevron-right"></i> ' + MESSAGES[244] +
                                '</a>' +
                                '<div id="graph-menu">' +
                                '<ul></ul>' +
                                '</div>'+
                                '</li>';
		}
		// Read privileges and set specific actions/elements
		if ((ROLE == 'admin' || ROLE == 'editor') &&  LOCK == 0  ) {

			body += '<li role="separator" class="divider"></li>';/* +
			'<li>' +
			    '<a class="action-nodeinterfaces" data-path="' + node_id + '" data-name="' + title + '"  data-status="'+ status +'" href="javascript:void(0)">' +
			'<i class="glyphicon glyphicon-transfer"></i> ' + MESSAGES[72] +
			'</a>' +
			'</li>';*/
			if(!isNodeRunning){
				body += '<li>' +
					'<a class="action-nodeedit control" data-path="' + node_id + '" data-name="' + title + '" href="javascript:void(0)">' +
					'<i class="glyphicon glyphicon-edit"></i> ' + MESSAGES[71] +
					'</a>' +
					'</li>' +
					'<li>' +
					'<a class="action-nodedelete" data-path="' + node_id + '" data-name="' + title + '" href="javascript:void(0)">' +
					'<i class="glyphicon glyphicon-trash"></i> ' + MESSAGES[65] +
					'</a>' +
					'</li>';
			}
		};

		if(isNodeRunning){

			// Adding interfaces
			$.when(getNodeInterfaces(node_id)).done(function (values) {
				var interfaces = '';
				var interfaces_graph = '';
				var eth_sortable = []
				for(var eth in values['ethernet']){
					values['ethernet'][eth]['id'] = eth
					eth_sortable.push(values['ethernet'][eth])
				}
				for(var ser in values['serial']){
					values['serial'][ser]['id'] = ser
					eth_sortable.push(values['serial'][ser])
				} 
				eth_sortable.sort(function(as, bs){
					var a, b, a1, b1, i= 0, L, rx=  /(\d+)|(\D+)/g, rd=  /\d/;
					if(isFinite(as.name) && isFinite(bs.name)) return as - bs;
					a= String(as.name).toLowerCase();
					b= String(bs.name).toLowerCase();
					if(a=== b) return 0;
					if(!(rd.test(a) && rd.test(b))) return a> b? 1: -1;
					a= a.match(rx);
					b= b.match(rx);
					L= a.length> b.length? b.length: a.length;
					while(i < L){
						a1= a[i];
						b1= b[i++];
						if(a1!== b1){
							if(isFinite(a1) && isFinite(b1)){
								if(a1.charAt(0)=== "0") a1= "." + a1;
								if(b1.charAt(0)=== "0") b1= "." + b1;
								return a1 - b1;
							}
							else return a1> b1? 1: -1;
						}
					}
					return a.length - b.length;
				});
				$.each(eth_sortable, function (id, object) {
					console.log(JSON.stringify(object));
					if ( object.remote_id != undefined ) {
						iftype = "ser"
					} else {
						iftype = "vun"
					}
					//interfaces += '<li><a class="action-nodecapture context-collapsible menu-interface" href="capture://' + window.location.hostname + '/vunl' + lab_id + '_' + TENANT + '_' + node_id + '_' + object.id + '" style="display: none;"><i class="glyphicon glyphicon-search"></i> ' + object['name'] + '</a></li>';
					interfaces += '<li><a class="action-nodecapture context-collapsible menu-interface" lab-id="' + lab_id + '"node-id="' + node_id +'" data-path="' + object.id  + '" ifname="' + object['name'] + '" href="javascript:void(0)" style="display: none;"><i class="glyphicon glyphicon-search"></i> ' + object['name'] + '</a></li>';
					interfaces_graph += '<li><a class="action-node-graph context-collapsible menu-interface-graph" lab-id="' + lab_id + '"node-id="' + node_id +'" data-path="' + object.id  + '" ifname="' + object['name'] + '"  prefix="' + iftype + '" href="javascript:void(0)" style="display: none;"><i class="glyphicon glyphicon-search"></i> ' + object['name'] + '</a></li>';
				})

				$(interfaces).appendTo('#capture-menu ul');
				$(interfaces_graph).appendTo('#graph-menu ul');

			}).fail(function (message) {
				// Error on getting node interfaces
				addModalError(message);
			});
		}


		if (isFreeSelectMode) {
			window.contextclick = 1
			body = '' +
				'<li>' +
				'<a class="action-nodestart-group context-collapsible menu-manage" href="javascript:void(0)"><i class="glyphicon glyphicon-play"></i> ' + MESSAGES[153] + '</a>' +
				'</li>' +
				'<li>' +
				'<a class="action-nodestop-group context-collapsible menu-manage" href="javascript:void(0)"><i class="glyphicon glyphicon-stop"></i> ' + MESSAGES[154] + '</a>' +
				'</li>' +
				'<li>' +
				'<a class="action-nodewipe-group context-collapsible menu-manage" href="javascript:void(0)"><i class="glyphicon glyphicon-erase"></i> ' + MESSAGES[155] + '</a>' +
				'</li>' +
				'<li>' +
				'<a class="action-openconsole-group context-collapsible menu-manage" href="javascript:void(0)"><i class="glyphicon glyphicon-console"></i> ' + MESSAGES[169] + '</a>' +
				'</li>';
			if ((ROLE == 'admin' || ROLE == 'editor') && LOCK == 0 ) {
				body += '' +
					'<li role="separator" class="divider"></li>' +
					'<li>' +
					'<a class="action-nodeexport-group context-collapsible menu-manage" href="javascript:void(0)"><i class="glyphicon glyphicon-save"></i> ' + MESSAGES[129] + '</a>' +
					'</li>' +
					'<li>' +
					'<a class="action-nodesbootsaved-group" href="javascript:void(0)"><i class="glyphicon glyphicon-floppy-saved"></i> ' + MESSAGES[139] + '</a>' +
					'</li>' +
					'<li>' +
					'<a class="action-nodesbootscratch-group" href="javascript:void(0)"><i class="glyphicon glyphicon-floppy-save"></i> ' + MESSAGES[140] + '</a>' +
					'</li>';
				body += '<li role="separator" class="divider">' +
					'<li>' +
					'<a class="action-halign-group" data-path="node' + node_id + '" data-name="' + title + '" href="javascript:void(0)">' +
					'<i class="glyphicon glyphicon-object-align-horizontal"></i> ' + MESSAGES[218] +
					'</a>' +
					'</li>' +
					'<li>' +
					'<a class="action-valign-group" data-path="node' + node_id + '" data-name="' + title + '" href="javascript:void(0)">' +
					'<i class="glyphicon glyphicon-object-align-vertical"></i> ' + MESSAGES[219] +
					'</a>' +
					'</li>' +
					'<li>' +
					'<a class="action-calign-group" data-path="node' + node_id + '" data-name="' + title + '" href="javascript:void(0)">' +
					'<i class="glyphicon glyphicon-record"></i> ' + MESSAGES[220] +
					'</a>' +
					'</li>' ;
				body += '' +
					'<li role="separator" class="divider"></li>' +
					'<li>' +
					'<a class="action-nodesbootdelete-group" href="javascript:void(0)"><i class="glyphicon glyphicon-trash"></i> ' + MESSAGES[159] + '</a>' +
					'</li>' +
					'<li>' +
					'<a class="action-nodedelete-group context-collapsible menu-manage" href="javascript:void(0)"><i class="glyphicon glyphicon-trash"></i> ' + MESSAGES[157] + '</a>' +
					'</li>' +
					'';
			}
			title = 'Group of ' + window.freeSelectedNodes.map(function (node) {
				if ( node.type == 'node' ) return node.name;
			}).join(", ").replace(', ,',', ').replace(/^,/,'').slice(0, 16);
			title += title.length > 24 ? "..." : "";

		}

	} else if ($(this).hasClass('network_frame')) {
		if ((ROLE == 'admin' || ROLE == 'editor') && LOCK == 0 ) {


			logger(1, 'DEBUG: opening network context menu');
			var network_id = $(this).attr('data-path');
			var title = $(this).attr('data-name');
			if (isFreeSelectMode) {
				window.contextclick = 1
				var   body = '<li role="separator" class="divider">' +
					'<li>' +
					'<a class="action-halign-group" data-path="network' + network_id + '" data-name="' + title + '" href="javascript:void(0)">' +
					'<i class="glyphicon glyphicon-object-align-horizontal"></i> ' + MESSAGES[218] +
					'</a>' +
					'</li>' +
					'<li>' +
					'<a class="action-valign-group" data-path="network' + network_id + '" data-name="' + title + '" href="javascript:void(0)">' +
					'<i class="glyphicon glyphicon-object-align-vertical"></i> ' + MESSAGES[219] +
					'</a>' +
					'</li>' +
					'<li>' +
					'<a class="action-calign-group" data-path="network' + network_id + '" data-name="' + title + '" href="javascript:void(0)">' +
					'<i class="glyphicon glyphicon-record"></i> ' + MESSAGES[220] +
					'</a>' +
					'</li>' ;
			} else {
				var body = '<li><a class="context-collapsible  action-networkedit" data-path="' + network_id + '" data-name="' + title + '" href="javascript:void(0)"><i class="glyphicon glyphicon-edit"></i> ' + MESSAGES[71] + '</a></li>'; 
					if ( $(this).hasClass('smart') ) {
						body += '<li><a class="context-collapsible  action-networkmanage" data-path="' + network_id + '" data-name="' + title + '" href="javascript:void(0)"><i class="glyphicon glyphicon-wrench"></i> ' + MESSAGES[245] + '</a></li>' 
					}
					body += '<li><a class="context-collapsible  action-networkdelete" data-path="' + network_id + '" data-name="' + title + '" href="javascript:void(0)"><i class="glyphicon glyphicon-trash"></i> ' + MESSAGES[65] + '</a></li>';
			}
		}
	} else if ($(this).hasClass('customShape') && window.ck == null) {
		if ((ROLE == 'admin' || ROLE == 'editor') && LOCK == 0 ) {
			logger(1, 'DEBUG: opening text object context menu');
			var textObject_id = $(this).attr('data-path')
			var elId =  $(this).attr('id');
			var title = 'Edit: ' + $(this).attr('data-path')
			var textClass = $(this).hasClass('customText') ? ' customText ': ''
			var body =
				'<li>' +
				'<a class="context-collapsible  action-textobjectduplicate" href="javascript:void(0)" data-path="' + textObject_id + '">' +
				'<i class="glyphicon glyphicon-duplicate"></i> ' + MESSAGES[149] +
				'</a>' +
				'</li>' +
				'<li>' +
				'<a class="context-collapsible  action-textobjecttoback" href="javascript:void(0)" data-path="' + textObject_id + '">' +
				'<i class="glyphicon glyphicon-save"></i> ' + MESSAGES[147] +
				'</a>' +
				'</li>' +
				'<li>' +
				'<a class="context-collapsible  action-textobjecttofront" href="javascript:void(0)" data-path="' + textObject_id + '">' +
				'<i class="glyphicon glyphicon-open"></i> ' + MESSAGES[148] +
				'</a>' +
				'</li>' +
				'<li>' +
				'<a class="context-collapsible action-textobjectedit" href="javascript:void(0)" data-path="' + textObject_id + '">' +
				'<i class="glyphicon glyphicon-edit"></i> ' + MESSAGES[71] +
				'</a>' +
				'</li>' +
				'<li>' +
				'<a class="context-collapsible '+ textClass +' action-textobjectdelete" href="javascript:void(0)" data-path="' + textObject_id + '">' +
				'<i class="glyphicon glyphicon-trash"></i> ' + MESSAGES[65] +
				'</a>' +
				'</li>';

			if (isFreeSelectMode) {
				window.contextclick = 1
				var   body = '<li role="separator" class="divider">' +
					'<li>' +
					'<a class="action-halign-group" data-path="' + elId + '" data-name="' + title + '" href="javascript:void(0)">' +
					'<i class="glyphicon glyphicon-object-align-horizontal"></i> ' + MESSAGES[218] +
					'</a>' +
					'</li>' +
					'<li>' +
					'<a class="action-valign-group" data-path="' + elId + '" data-name="' + title + '" href="javascript:void(0)">' +
					'<i class="glyphicon glyphicon-object-align-vertical"></i> ' + MESSAGES[219] +
					'</a>' +
					'</li>' +
					'<li>' +
					'<a class="action-calign-group" data-path="' + elId + '" data-name="' + title + '" href="javascript:void(0)">' +
					'<i class="glyphicon glyphicon-record"></i> ' + MESSAGES[220] +
					'</a>' +
					'</li>' ;
			}
		}
	} else {
		// Context menu not defined for this object
		return false;
	}
	if (body.length) {

		printContextMenu(title, body, e.pageX, e.pageY,false,"menu");

	}

});

// Window resize
$(window).resize(function () {
	if ($('#lab-viewport').length) {
		// Update topology on window resize
		try { lab_topology.repaintEverything(); } catch(e) {}
		// Update picture map on window resize
		$('map').imageMapResize();
	}
});

// disable submit button if count addition nodes more than 50
$(document).on('change input', 'input[name="node[count]"]', function(e){
	var count = $(this).val()
	console.log('val', count)
	if( count > 1023){
		$("#form-node-add button[type='submit']").attr('disabled', true)
	} else {
		$("#form-node-add button[type='submit']").attr('disabled', false)
	}
})

// plug show/hide event

$(document).on('mouseover','.node_frame, .network_frame', function (e) {
    //if ((ROLE == 'admin' || ROLE == 'editor') && LOCK == 0 && ( $(this).attr('data-status') == 0 || $(this).attr('data-status') == undefined ) && !$('#lab-viewport').hasClass('freeSelectMode') ) {
    if ((ROLE == 'admin' || ROLE == 'editor') && LOCK == 0 &&  !$('#lab-viewport').hasClass('freeSelectMode') ) {
         $(this).find('.tag').removeClass("hidden");
        }
}) ;

$(document).on('mouseover','.ep' , function (e) {
    //lab_topology.setDraggable ( this , false )
});

$(document).on('mouseleave','.node_frame, .network_frame', function (e) {
        $(this).find('.tag').addClass("hidden");
        //lab_topology.setDraggable ( this , true )
});

$(document).on('mouseover','#lab-sidebar,#hiddenbar' , function (e) {
    logger(1,"show sidebar");
    $("#lab-sidebar").width(200).css('z-index','4003')
});

$(document).on('mouseleave',"#lab-sidebar", function (e) {
    $("#lab-sidebar").width(40).css('z-index','4001')
});
/***************************************************************************
 * Actions links
 **************************************************************************/

// startup-config menu
$(document).on('click', '.action-configsget', function (e) {
    logger(1, 'DEBUG: action = configsget');
    $.when(getNodeConfigs(window.cur_cfs,null),getConfigSets()).done(function (configs,configsets) {
        addModalWide(MESSAGES[120], new EJS({ url: '/themes/default/ejs/action_configsget.ejs?n=' + Date.now() }).render({ configs: configs, configsets: configsets }), '');
    $('#configsetselect option[value="' + window.cur_cfs + '"]').prop('selected', true);
    }).fail(function (message) {
        addModalError(message);
    });
});

// Change opacity
$(document).on('click', '.action-changeopacity', function (e) {
    if ($(this).data("transparent")) {
        $('.modal-content').fadeTo("fast", 1);
        $(this).data("transparent", false);
    } else {
        $('.modal-content').fadeTo("fast", 0.3);
        $(this).data("transparent", true);
    }
});

$(document).on('click', '.action-frameopacity', function (e) {
    if ($(this).parent('.taskwrap, .consolewrap, .netdatawrap').data("transparent")) {
        $('.taskwrap, .consolewrap, .netdatawrap').not('.hideme').fadeTo("fast", 1);
        $('.taskwrap, .consolewrap, .netdatawrap').not('.hideme').data("transparent", false);
    } else {
        $('.taskwrap, .consolewrap, .netdatawrap').not('.hideme').fadeTo("fast", 0.3);
        $('.taskwrap, .consolewrap, .netdatawrap').not('.hideme').data("transparent", true);
    }
});


// External Open
$(document).on('click', '.external-open', function (e) {
     var iframe = $(this).parent()
     var url = iframe.children('iframe').get(0).contentWindow.location.href
     iframe.children('iframe').attr('src','about:blank')
     iframe.addClass('hideme')
     iframe.hide()
     e.stopPropagation();
    var id = $(this).parent('.consolewrap, .netdatawrap').attr('id') ;
    $('#mini'+id).remove();
    if ( $('.minicons').length == 1 ) {
                $('#minibar').remove()
    }

    logger (1 ,' open in tab: ' +  url + ' in ' + iframe.attr('data-name') +'_'+id.replace('framewrap','')+'.' );
    window.open(url,'_blank')
});

// Open Task in a tab
$(document).on('click', '.task-external-open', function (e) {
    var taskframe = $(this).parent();
    var id = $(this).parent('.taskwrap').attr('id')
    var content = $(this).parent('.taskwrap').children('.taskframe').html()
    var name = $(this).parent('.taskwrap').attr('data-name')
    var origin = window.location.origin ;
    var origin = '';
    var body = '<html><head><link href="/themes/default/bootstrap/css/bootstrap.min.css" rel="stylesheet">'
    body += '<script src="'+ origin +'/themes/default/bootstrap/js/jquery-3.2.1.min.js" ></script>'
    body += '<script src="' + origin +'/themes/default/bootstrap/js/jquery-ui-1.12.1.min.js" ></script>'
    body += '<script src="'+ origin +'/themes/default/bootstrap/js/bootstrap.min.js" ></script>'
    body += '</head><title>'+name+'</title><body>' + content + '</body></html>';
    taskframe.remove();
    e.stopPropagation();
        $('#mini'+id).remove();
        if ( $('.minicons').length == 1 ) {
                $('#minibar').remove()
        }
    w = window.open()
    w.document.write( body );
});

// Change console opacity
$(document).on('click', '.consolewrap > .action-minimize, .taskwrap > .action-minimize, .netdatawrap > .action-minimize', function (e) {
    e.stopPropagation();
    var id = $(this).parent('.taskwrap, .consolewrap, .netdatawrap').attr('id') ;
    var name = $(this).parent('.taskwrap, .consolewrap, .netdatawrap').attr('data-name');
    logger(1,"toggle console transparent " + $(this).parent('.taskwrap, .consolewrap, .netdatawrap').attr('id') )
    $(this).parent('.taskwrap, .consolewrap, .netdatawrap').addClass('hideme')
    $(this).parent('.taskwrap, .consolewrap, .netdatawrap').hide()
});

$(document).on('click', '.minicons', function (e) {
  var id = $(this).attr('data-id') ;
  $('#'+id).show();
  $('#'+id).click();
});

$(document).on('dblclick', '.minicons', function (e) {
   var id = $(this).attr('data-id') ;
   if ( $('#'+id).hasClass('hideme') )  {
    $('#'+id).show();
       $('#'+id).click();
   } else {
    $('#'+id).addClass('hideme')
    $('#'+id).hide()
   }

   //$(this).remove();
});

// Maximize console

$(document).on('dblclick', '.taskwrap, .consolewrap, .netdatawrap', function (e) {
    $(this).children('.action-console-fullscreen').click()
});

$(document).on('click', '.consolewrap > .action-console-fullscreen, .netdatawrap > .action-console-fullscreen ', function (e) {
    var iframe = $(this).parent('.consolewrap,.netdatawrap'),
        url = iframe.children('iframe').get(0).contentWindow.location.href ;
    if ( iframe.hasClass('fullsize')) {
        x = iframe.attr('x')
        y = iframe.attr('y')
        l = iframe.attr('l')
        t = iframe.attr('t')
        iframe.css('width', x + 'px')
        iframe.css('height', y + 'px')
        iframe.css('left', l + 'px')
        iframe.css('top', t + 'px')
        iframe.css('padding-bottom' , '30px')
        iframe.removeClass('fullsize')
    } else {
        iframe.attr('x',iframe.outerWidth())
        iframe.attr('y',iframe.outerHeight())
        iframe.attr('t',iframe.position().top)
        iframe.attr('l',iframe.position().left)
        iframe.addClass('fullsize')
        iframe.css('width', '100%')
        iframe.css('height', '100%')
        iframe.css('padding-bottom' , '50px');
        iframe.css('top',0)
        iframe.css('left',0)
    }
    iframe.children('iframe').attr('src',url);
});

$(document).on('click', '.taskwrap > .action-console-fullscreen', function (e) {
    var iframe = $(this).parent('.taskwrap');
        if ( iframe.hasClass('fullsize')) {
                x = iframe.attr('x')
                y = iframe.attr('y')
                l = iframe.attr('l')
                t = iframe.attr('t')
                iframe.css('width', x + 'px')
                iframe.css('height', y + 'px')
                iframe.css('left', l + 'px')
                iframe.css('top', t + 'px')
                iframe.css('padding-bottom' , '30px')
                iframe.removeClass('fullsize')
        } else {
                iframe.attr('x',iframe.outerWidth())
                iframe.attr('y',iframe.outerHeight())
                iframe.attr('t',iframe.position().top)
                iframe.attr('l',iframe.position().left)
                iframe.addClass('fullsize')
                iframe.css('width', '100%')
                iframe.css('height', '100%')
                iframe.css('padding-bottom' , '50px');
                iframe.css('top',0)
                iframe.css('left',0)
        }
});

/*
$(document).on('blur', '.taskwrap, .consolewrap', function (e) {
     logger(1,"blur");
     if ( $(this).parents('.taskwrap').length > 0  )  return
     $('.taskwrap, .consolewrap').css('z-index','4029')
     $('.frameoverlay').css('width','calc( 100% - 20px)')
});
*/

// Get startup-config
$(document).on('click', '.action-configget', function (e) {
    logger(1, 'DEBUG: action = configget');
    var el = $(document).find('.action-configget').filter('.selected');
    if(LOCK == 0 && el.length > 0) {
        //saveEditorLab('form-node-config', true, window.old_cfs); // added one additional paramter to not close the popup
    window.old_cfs = window.cur_cfs
    }
    $(".action-configget").removeClass("selected");
    $(this).addClass("selected");
    var id = $(this).attr('data-path');
    $.when(getNodeConfigs(window.cur_cfs,id)).done(function (config) {
        printFormNodeConfigs(config);
        $('#config-data').find('.form-control').focusout(function () {
            //saveLab();
        })
    }).fail(function (message) {
        addModalError(message);
    });
    $('#context-menu').remove();
});

// Add a new folder
$(document).on('click', '.action-folderadd', function (e) {
    logger(1, 'DEBUG: action = folderadd');
    var data = {};
    data['path'] = $('#list-folders').attr('data-path');
    printFormFolder('add', data);
});

// Open an existent folder
$(document).on('dblclick', '.action-folderopen', function (e) {
    logger(1, 'DEBUG: opening folder "' + $(this).attr('data-path') + '".');
    printPageLabList($(this).attr('data-path'));
});

// Rename an existent folder
$(document).on('click', '.action-folderrename', function (e) {
    logger(1, 'DEBUG: action = folderrename');
    var data = {};
    data['path'] = dirname($('#list-folders').attr('data-path'));
    data['name'] = basename($('#list-folders').attr('data-path'));
    printFormFolder('rename', data);
});

// Import labs
$(document).on('click', '.action-import', function (e) {
    logger(1, 'DEBUG: action = import');
    printFormImport($('#list-folders').attr('data-path'));
});

// Add a new lab
$(document).on('click', '.action-labadd', function (e) {
    logger(1, 'DEBUG: action = labadd');
    var values = {};
    values['path'] = $('#list-folders').attr('data-path');
    printFormLab('add', values);
});

// Print lab body
$(document).on('click', '.action-labbodyget', function (e) {
    logger(1, 'DEBUG: action = labbodyget');
    $.when(getLabInfo($('#lab-viewport').attr('data-path')), getLabBody(),getCluster(), getNodesStatus()).done(function (info, labbody, clusterdata, data) {
	body = '<h1>' + info['name'] + '</h1>'
	// ID
	body +=  '<p><strong>ID:</strong> ' + info['id'] + '</p>' 
	// Description
	body +=  '<p>' + info['description'] + '</p></br>'
	// Body
	body += labbody
        addModalWide(MESSAGES[64], body, '')
    }).fail(function (message1, message2) {
        if (message1 != null) {
            addModalError(message1);
        } else {
            addModalError(message2)
        }
        ;
    });
});

//Capture

$(document).on('click', '.action-nodecapture', function (e) {
    $('#context-menu').remove();
    logger(1, 'DEBUG: action = action-nodecapture');
    var id = $(this).attr('data-path');
    var node_id = $(this).attr('node-id');
    var lab_id = $(this).attr('lab-id');
    var ifname = $(this).attr('ifname')
    logger(1, 'DEBUG: action = action-nodecapture labid=' + lab_id + ' Tenant=' + TENANT + ' Node='+ node_id + ' interface=' + id) ;
    $.when(getCapture(lab_id,node_id,id,ifname)).done(function (values) {
    // Create url
        // Clik on href
        // remove link
    }).fail(function (message) {
        addModalError(message);
    });
});

// Graph
$(document).on('click', '.action-node-graph', function (e) {
    $('#context-menu').remove();
    logger(1, 'DEBUG: action = action-node-graph');
    var id = $(this).attr('data-path');
    var node_id = $(this).attr('node-id');
    var lab_id = $(this).attr('lab-id');
    var ifname = $(this).attr('ifname');
    var prefix = $(this).attr('prefix');
    var node_name = $('#node'+node_id).attr('data-name');
    // $this -> flags_eth .= ' -netdev tap,id=net'.$i.',ifname=vun%labId%'.sprintf("%04x%03x%02x",$this -> tenant,$this -> id,$i).',script=no'
    logger(1," graph  vun" + ('000'+Number(lab_id).toString(16)).slice(-3)+( '0000' + Number(TENANT).toString(16) ).slice(-4)+('000' + Number(node_id).toString(16)).slice(-3)+('00' + Number(id).toString(16)).slice(-2) ) 
    logger(1, 'DEBUG: action = action-nodecapture labid=' + lab_id + ' Tenant=' + TENANT + ' Node='+ node_id + ' interface=' + id) ;
    realname =  prefix + ('000'+Number(lab_id).toString(16)).slice(-3)+( '0000' + Number(TENANT).toString(16) ).slice(-4)+('000' + Number(node_id).toString(16)).slice(-3)+('00' + Number(id).toString(16)).slice(-2) 
    netdataFrameOpen( node_name,ifname, realname)
    //$.when(getCapture(lab_id,node_id,id,ifname)).done(function (values) {
    // Create url
        // Clik on href
        // remove link
    //}).fail(function (message) {
    //    addModalError(message);
    //});
});

// Catch openconsole
$(document).on('click','.node_frame', function (e) {
    var id = $(this).attr('data-path');
    var status = $(this).attr('status');
    if ( status == 2 ||  status == 3 ) $('#framewrap'+id).show()
});

$(document).on('click','area', function (e) {
        var id = $(this).attr('id').replace('map_','');
        var href = $(this).attr('href')
        if ( href.search('unknowntoken') == -1 && href.search('token') != -1 ) {
                $('#framewrap'+id).removeClass('hideme')
                $('#framewrap'+id).removeClass('hidden')
                $('#framewrap'+id).show()
                $('#framewrap'+id).click()
        }
});

// Close frame
$(document).on('click','.consolewrap .frameclose, .taskwrap .frameclose, .netdatawrap .frameclose ', function (e) {
     var iframe = $(this).parent()
     /*if ( iframe.hasClass('capture') ) {
        e.stopPropagation();
        iframe.remove()
        return ;
     }*/
     //alert (id )
     iframe.children('iframe').attr('src','about:blank')
     iframe.addClass('hideme')
     iframe.hide()
     e.stopPropagation();
    var id = $(this).parent('.consolewrap, .taskwrap, .netdatawrap').attr('id') ;
    $('#mini'+id).remove();
    if ( $('.minicons').length == 1 ) {
        $('#minibar').remove()
    }
    if ( iframe.hasClass('capture') || iframe.hasClass('labchat') || iframe.hasClass('taskwrap')   ) {
    iframe.remove();
    }
});


/*
$(document).on('mouseover','.consolewrap', function (e) {
     $(this).children('iframe').focus();
});
*/

$(document).on('click','#minihide', function (e) {
    $('.taskwrap, .consolewrap, .netdatawrap').addClass('hideme')
    $('.taskwrap, .consolewrap, .netdatawrap').hide()
});

$(document).on('click','.taskwrap, .consolewrap, .netdatawrap', function (e) {
     //alert('modal status:' + $('.modal').dialog("option","modal"))
     $('.taskwrap, .consolewrap').css('z-index','4029')
     $(this).css('z-index','4030')
     $('.frameoverlay').css('width','calc( 100% - 20px)')
     $(this).children('.frameoverlay').css('width','0px')
     $(this).children('iframe').focus();
     if ( $(this).hasClass('consolewrap')  ) {
         url = $(this).children('iframe').get(0).contentWindow.location.href ;
         $(this).children('iframe').attr('src' , url);
     }
     $(this).removeClass('hideme');
     var id = $(this).attr('id') ;
     var name = $(this).attr('data-name');
    if ( $('#minibar').length == 0 ) {
    // add bar
    minibar = '<div id="minibar"><div  id="minihide" class="minicons pull-left"><span class="unselectable" style="cursor: pointer ; color: #FFFFFF; font-size: 14px; font-style: normal; font-weight: 100; padding: 10px" ><i class="glyphicon glyphicon-eye-close center" style="color:#a6b3b9;"></i></span></div></div>'
    $('#body').append(minibar) ;
    }
    if ( $('#mini'+id).length == 0 ) {
    var align = $(this).hasClass('consolewrap') ? 'pull-left' : 'pull-right' ;
   minicons = '<div  id="mini'+id+'" class="minicons '+ align +'" data-id="'+id+'"><span class="unselectable" style="cursor: pointer ; color: #FFFFFF; font-size: 14px; font-style: normal; font-weight: 100; padding: 10px" >' + name + '</span></div>';
   $('#minibar').append(minicons) ;
   }
});


// Edit/print lab network
$(document).on('click', '.action-networkedit', function (e) {

    $('#context-menu').remove();
    logger(1, 'DEBUG: action = action-networkedit');
    var id = $(this).attr('data-path');
    $.when(getNetworks(id)).done(function (values) {
        values['id'] = id;
        printFormNetwork('edit', values)
        // window.closeModal = true;
    }).fail(function (message) {
        addModalError(message);
    });
});

$(document).on('click', '.action-networkmanage', function (e) {

    $('#context-menu').remove();
    logger(1, 'DEBUG: action = action-networkmanage');
    var id = $(this).attr('data-path');
    $.when(getNetworks(id)).done(function (values) {
        values['id'] = id;
        printFormNetworkManage( values )
        // window.closeModal = true;
    }).fail(function (message) {
        addModalError(message);
    });
});


// Edit/print lab network
$(document).on('click', '.action-networkdeatach', function (e) {

    $('#context-menu').remove();
    logger(1, 'DEBUG: action = action-networkdeatach');
    var node_id = $(this).attr('node-id');
    var interface_id = $(this).attr('interface-id');

    $.when(setNodeInterface(node_id, '', interface_id))
        .done(function (values) {

            window.location.reload();
        }).fail(function (message) {
        addModalError(message);
    });
});

// Print lab networks
$(document).on('click', '.action-networksget', function (e) {
    logger(1, 'DEBUG: action = networksget');
    $.when(getNetworks(null)).done(function (networks) {
        printListNetworks(networks);
    }).fail(function (message) {
        addModalError(message);
    });


});

// Delete lab network
$(document).on('click', '.action-networkdelete', function (e) {
    var id = $(this).attr('data-path');
/*
    if ( $('.jtk-connector.network'+id).length > 0 ) {
        $('#context-menu').remove();
        addModalError("Remove all links first...")
        return;
    }
*/
    var body = '<div class="form-group">' +
                    '<div class="question">Are you sure to delete this network?</div>' +
                '</div>' +
                '<div class="form-group">' +
                    '<div class="col-md-5 col-md-offset-3">' +
                        '<button id="networkdelete" class="btn btn-success"  data-path="'+id+'" data-dismiss="modal">Yes</button>' +
                        '<button type="button" class="btn" data-dismiss="modal">Cancel</button>' +
                    '</div>' +
                '</div>'
    var title = "Warning"
    addModal(title, body, "", "make-red make-small");
})

$(document).on('click', '.action-conndelete', function (e) {
	e.stopPropagation();
	e.preventDefault();
     var id = window.connToDel.id
     //console.log("my object: %o", window.connToDel)
     window.connContext = 0
     if ( id.search('iface') != -1 ) { // serial or network
        node=id.replace('iface:node','').replace(/:.*/,'')
        iface=id.replace(/.*:/,'')
        $.when(setNodeInterface(node,'', iface)).done( function () {
           //$('.action-labtopologyrefresh').click();
           $('.jtk-connector.' + id.replace(/:/g,'\\:')).remove();
	   try { lab_topology.deleteConnection(window.connToDel) } catch (e) {}
        }).fail(function (message) {
           addModalError(message);
        });
     } else { // network P2P
        network_id = id.replace('network_id:','')
        $.when(deleteNetwork(network_id)).done(function (values) {
           //window.closeModal = true;
           //$('.action-labtopologyrefresh').click();
	   $('.jtk-connector.' + id.replace(/:/g,'\\:')).remove();
           try { lab_topology.deleteConnection(window.connToDel) } catch (e) {}
        }).fail(function (message) {
           addModalError(message);
        });
     }
     $('#context-menu').remove();
});

$(document).on('click', '.action-linksuspend', function (e) {
     var id = window.connToDel.id;
     if ( id.search('iface') != -1 ) { // serial or network
        var network_id = window.connToDel.targetId.replace('network','');
        nodeId = window.connToDel.id.replace(/iface:node/,'').replace(/:.*/,'');
	interfaceId = window.connToDel.id.replace(/iface:/,'').replace(/.*:/,'');
        logger(1,'class to match: '+ '.jtk-endpoint.endpoint_node'+nodeId+'_'+interfaceId);
        logger(1,'disable Node '+nodeId+' if='+interfaceId) ;
	$('.jtk-endpoint.endpoint_node'+nodeId+'_'+interfaceId).addClass('visible');
        suspendLink( nodeId, interfaceId );
	// check if remote is serial
	//var remoteNodeId = window.connToDel.targetId.replace(
	if ( $('.jtk-endpoint.endpoint_node'+nodeId+'_'+interfaceId).hasClass('serial') ) {
		serialClass = $('.jtk-endpoint.endpoint_node'+nodeId+'_'+interfaceId).attr('Class').replace(/.*serial_/,'').replace(/ .*/,'') ;
		targetId = serialClass.replace(/.*node/,'').replace(/_.*/,'')
		targetIf = serialClass.replace(/.*node/,'').replace(/.*_/,'')
		suspendLink( targetId, targetIf );
		$('.jtk-endpoint.endpoint_node'+targetId+'_'+targetIf).addClass('visible');
	}
     } else { 
        var network_id = id.replace('network_id:','');
	$.each ( $('.jtk-endpoint.networkId_'+network_id) , function ( index, endpoint ) {
		nodeId=$(endpoint).attr('Class').replace(/.*endpoint_node/,'').replace(/_.*/,'');
		interfaceId=$(endpoint).attr('Class').replace(/.*endpoint_node[0-9]*_/,'').replace(/ .*/,'');
		logger(1,'disable Node '+nodeId+' if='+interfaceId) ; 
		if ( $('#node'+nodeId).attr('data-linkstate') == 1 ) {
                   suspendLink( nodeId, interfaceId );
                   $(endpoint).addClass('visible');
                }
	});
     }
     window.connContext = 0 ;
     $('#context-menu').remove();
});

$(document).on('click', '.action-linkresume', function (e) {
     var id = window.connToDel.id;
     if ( id.search('iface') != -1 ) { // serial or network
        var network_id = window.connToDel.targetId.replace('network','');
        nodeId = window.connToDel.id.replace(/iface:node/,'').replace(/:.*/,'');
        interfaceId = window.connToDel.id.replace(/iface:/,'').replace(/.*:/,'');
        logger(1,'class to match: '+ '.jtk-endpoint.endpoint_node'+nodeId+'_'+interfaceId);
        logger(1,'enable Node '+nodeId+' if='+interfaceId) ;
        $('.jtk-endpoint.endpoint_node'+nodeId+'_'+interfaceId).removeClass('visible');
        resumeLink( nodeId, interfaceId );
	if ( $('.jtk-endpoint.endpoint_node'+nodeId+'_'+interfaceId).hasClass('serial') ) {
                serialClass = $('.jtk-endpoint.endpoint_node'+nodeId+'_'+interfaceId).attr('Class').replace(/.*serial_/,'').replace(/ .*/,'') ;
                targetId = serialClass.replace(/.*node/,'').replace(/_.*/,'')
                targetIf = serialClass.replace(/.*node/,'').replace(/.*_/,'')
                resumeLink( targetId, targetIf );
                $('.jtk-endpoint.endpoint_node'+targetId+'_'+targetIf).removeClass('visible');
        }
     } else {
        var network_id = id.replace('network_id:','');
        $.each ( $('.jtk-endpoint.networkId_'+network_id) , function ( index, endpoint ) {
               nodeId=$(endpoint).attr('Class').replace(/.*endpoint_node/,'').replace(/_.*/,'');
               interfaceId=$(endpoint).attr('Class').replace(/.*endpoint_node[0-9]*_/,'').replace(/ .*/,'');
               logger(1,'enable Node '+nodeId+' if='+interfaceId) ;
               if ( $('#node'+nodeId).attr('data-linkstate') == 1 ) $(endpoint).removeClass('visible');
               resumeLink( nodeId, interfaceId );
        });
     }
     window.connContext = 0 ;
     $('#context-menu').remove();
});



$(document).on('click', '.action-linedelete', function (e) {
     e.preventDefault();
     e.stopPropagation();
    var id=window.connToDel.id.replace('Line','')
    //var conn = lab_topology.getConnections().find( function(item) { return  item.id == 'Line'+id})
    $.when(deleteLineObject(id)).done ( function() {
    lab_topology.setSuspendDrawing(true);
        lab_topology.remove('startLine'+id);
        lab_topology.remove('endLine'+id);
    lab_topology.setSuspendDrawing(false,true);
    }).fail(function (message) {
      addModalError(message);
    });
    $('#context-menu').remove();
});


$(document).on('contextmenu', '.map_mark', function (e) {
     //alert (this.id)
     e.preventDefault();
     e.stopPropagation();
     var body =  ''
     body += '<li><a class="action-mapdelete"  id="'+this.id+'" href="javascript:void(0)"><i class="glyphicon glyphicon-trash"></i> Delete</a></li>';
     printContextMenu('Map', body, e.pageX, e.pageY,true,"menu");
});

$(document).on('click', '.action-mapdelete' , function (e) {
   id=this.id.replace(/,/g,"\\,")
  $('#context-menu').remove();
  $('#'+id).remove();
  var mapoldval = $('form :input[name="picture[map]"]').val()
  var custommapoldval = $('form :input[name="picture[custommap]"]').val()
  var regex = new RegExp(".*"+id+".*>\n")
  var mapnewval = mapoldval.replace(regex,'')
  var custommapnewval = custommapoldval.replace(regex,'')
  $('form :input[name="picture[map]"]').val(mapnewval)
  $('form :input[name="picture[custommap]"]').val(custommapnewval)
});
$(document).on('click', '#networkdelete', function (e) {

    $('#context-menu').remove();

    logger(1, 'DEBUG: action = action-networkdelete');
    var id = $(this).attr('data-path');
    $.when(deleteNetwork(id)).done(function (values) {
        $.each(lab_topology.getConnections(), function ( idx, conn ) {
            if ( conn.sourceId == 'network'+id || conn.targetId == 'network'+id ) {
                    console.log('disconnecting ' + conn.id)
                    try { lab_topology.deleteConnection(conn)  } catch (e) {}
            }
        });
	try { lab_topology.remove('network' + id) } catch (e) {}
        // clean buggy link
        $.each( $('.jtk-connector.network' + id ) , function ( index, endpoint ) {
            $(endpoint).remove();
        });

    //$('.action-labtopologyrefresh').click();
        window.closeModal = false;
}).fail(function (message) {
        addModalError(message);
    });

    $('#context-menu').remove();

});

/**
 * reload on close
 */
$(document).on('hide.bs.modal', function (e) {

    if (window.closeModal) {
        printLabTopology();
        window.closeModal = false;
    }

});


// Delete lab node

$(document).on('click', '.action-nodedelete, .action-nodedelete-group', function (e) {
    if($(this).hasClass('disabled')) return;
    var id = $(this).attr('data-path')
// <form id="form-picture-delete" data-path="' + picture_id + '" class="form-horizontal form-picture" novalidate="novalidate">

    var textQuestion = ""
    if($(this).hasClass('action-nodedelete')) {
        textQuestion = 'Are you sure to delete this node'
    } else {
        textQuestion = 'Are you sure to delete selected nodes?';
    }

    var body = '<div class="form-group">' +
                    '<div class="question">'+textQuestion+'</div>' +
                    '<div class="col-md-5 col-md-offset-3">' +
                        '<button id="deteleNode" class="btn btn-success" data-path="'+id+'" data-dismiss="modal">Yes</button>' +
                        '<button type="button" class="btn" data-dismiss="modal">Cancel</button>' +
                    '</div>' +
                '</div>'
    var title = "Warning"
    addModal(title, body, "", "make-red make-small");
    $('#context-menu').remove();

    $('#deteleNode').on('click', function(){
        logger(1, 'DEBUG: action = action-nodedelete');
        var node_id = $(this).attr('data-path')
            , isFreeSelectMode = $("#lab-viewport").hasClass("freeSelectMode")
            ;

        if (isFreeSelectMode) {
            window.freeSelectedNodes = window.freeSelectedNodes.sort(function (a, b) {
                return a.path < b.path ? -1 : 1
            });
            recursionNodeDelete(window.freeSelectedNodes)
        }
        else {
        if ( $('#node' + node_id).attr('data-status') > 1 ) {
        // pass node is running
        return ;
        }
            $.when(deleteNode(node_id)).done(function (values) {
		   $.each(lab_topology.getConnections(), function ( idx, conn ) {
			   if ( conn.sourceId == 'node'+node_id || conn.targetId == 'node'+node_id ) {
				   //console.log('disconnecting ' + conn.id)
				    try { lab_topology.deleteConnection(conn)  } catch (e) {}
			   }
		   });
		   try { window.lab_topology.remove('node'+node_id) } catch (e) {}
		   // clean buggy link
		    $.each( $('.jtk-connector.node' + node_id ) , function ( index, endpoint ) {
			    $(endpoint).remove()
                        });

            }).fail(function (message) {
                addModalError(message);
            });
        }

    })
});


function recursionNodeDelete(restOfList) {
    var node = restOfList.pop();

    if (!node) {
        return 1;
    }

    console.log("Deleting... ", node.path);
    if ( $('#node' + node.path).attr('data-status') > 1 ) {
    addModalError('Node '+node.name+' is running...');
    rc = recursionNodeDelete(restOfList);
        if ( rc == 1 ) { return 1; }
    }
    $.when(deleteNode(node.path)).then(function (values) {
	$.each(lab_topology.getConnections(), function ( idx, conn ) {
		if ( conn.sourceId == 'node'+node.path || conn.targetId == 'node'+node.path ) {
			try { lab_topology.deleteConnection(conn)  } catch (e) {}
		}
	});
	try { window.lab_topology.remove('node'+node.path) } catch (e) {}
	$.each( $('.jtk-connector.node' + node.path ) , function ( index, endpoint ) {
		$(endpoint).remove()
	});
        recursionNodeDelete(restOfList);
    }).fail(function (message) {
        addModalError(message);
        recursionNodeDelete(restOfList);
    });
}

// Edit/print node interfaces
$(document).on('click', '.action-nodeinterfaces', function (e) {
    logger(1, 'DEBUG: action = action-nodeinterfaces');
    var id = $(this).attr('data-path');
    var name = $(this).attr('data-name');
    var status = $(this).attr('data-status');
    $.when(getNodeInterfaces(id)).done(function (values) {
        values['node_id'] = id;
        values['node_name'] = name;
        values['node_status'] = status;
        printFormNodeInterfaces(values)
    }).fail(function (message) {
        addModalError(message);
    });
    $('#context-menu').remove();
});

// Deatach network lab node


$(document).on('click', '.action-nodeedit', function (e) {
    logger(1, 'DEBUG: action = action-nodeedit');
    var disabled  = $(this).hasClass('disabled')
    if(disabled) return;
    var fromNodeList  = $(this).hasClass('control')
    var id = $(this).attr('data-path');
    $.when(getNodes(id)).done(function (values) {
        values['id'] = id;
        printFormNode('edit', values, fromNodeList)
	var isNodeRunning = $("#node" + id).attr('data-status') > 1;
    }).fail(function (message) {
        addModalError(message);
    });
    $('#context-menu').remove();
});

$(document).on('click', '.action-nodeview', function (e) {
    logger(1, 'DEBUG: action = action-nodeview');
    var disabled  = $(this).hasClass('disabled')
    if(disabled) return;
    var fromNodeList  = $(this).hasClass('control')
    var id = $(this).attr('data-path');
    $.when(getNodes(id)).done(function (values) {
        values['id'] = id;
        printFormNode('edit', values, fromNodeList)
        var isNodeRunning = $("#node" + id).attr('data-status') > 1;
    }).fail(function (message) {
        addModalError(message);
    });
    $('#context-menu').remove();
});



// Print lab nodes
$(document).on('click', '.action-nodesget', function (e) {
    logger(1, 'DEBUG: action = nodesget');
    $("#lab-viewport").append("<div id='progress-loader'><label style='float:left'>Generating node list...</label><div class='loader'></div></div>")
    $.when(getNodes(null),getConfigSets(),getSystemStats()).done(function (nodes,configsets,systemstat) {
        printListNodes(nodes,configsets,systemstat);
    }).fail(function (message) {
        addModalError(message);
    });
});

// Lab close
$(document).on('click', '.action-labclose', function (e) {
    logger(1, 'DEBUG: action = labclose');
    $.when(closeLab()).done(function () {
    newUIreturn();
    }).fail(function (message) {
        addModalError(message);
    });
});

// Edit a lab
$(document).on('click', '.action-labedit', function (e) {
    logger(1, 'DEBUG: action = labedit');
    $.when(getLabInfo($('#lab-viewport').attr('data-path'))).done(function (values) {
        values['path'] = dirname($('#lab-viewport').attr('data-path'));
        printFormLab('edit', values);
    }).fail(function (message) {
        addModalError(message);
    });
    $('#context-menu').remove();
});

// Edit a lab inline
$(document).on('click', '.action-labedit-inline', function (e) {
    logger(1, 'DEBUG: action = labedit');
    $.when(getLabInfo($('.action-labedit-inline').attr('data-path'))).done(function (values) {
        values['path'] = dirname($('.action-labedit-inline').attr('data-path'));
        printFormLab('edit', values);
    }).fail(function (message) {
        addModalError(message);
    });
    $('#context-menu').remove();
});

// List all labs
$(document).on('click', '.action-lablist', function (e) {
    bodyAddClass('folders');
    logger(1, 'DEBUG: action = lablist');

    if ($('#list-folders').length > 0) {
        // Already on lab_list view -> open /
        printPageLabList('/');
    } else {
        printPageLabList(FOLDER);
    }

});

// Open a lab
$(document).on('click', '.action-labopen', function (e) {
    logger(1, 'DEBUG: action = labopen');
    var self = this;
    $.when(getUserInfo()).done(function () {
        postLogin($(self).attr('data-path'));
    }).fail(function () {
        // User is not authenticated, or error on API
        logger(1, 'DEBUG: loading authentication page.');
        printPageAuthentication();
    });
});

// Preview a lab
$(document).on('dblclick', '.action-labpreview', function (e) {
    logger(1, 'DEBUG: opening a preview of lab "' + $(this).attr('data-path') + '".');
    $('.lab-opened').each(function () {
        // Remove all previous selected lab
        $(this).removeClass('lab-opened');
    });
    $(this).addClass('lab-opened');
    printLabPreview($(this).attr('data-path'));
});

// Action menu
$(document).on('click', '.action-moreactions', function (e) {
    logger(1, 'DEBUG: action = moreactions');
    var body = '';
    body += '<li><a class="action-nodesstart" href="javascript:void(0)"><i class="glyphicon glyphicon-play"></i> ' + MESSAGES[126] + '</a></li>';
    body += '<li><a class="action-nodesstop" href="javascript:void(0)"><i class="glyphicon glyphicon-stop"></i> ' + MESSAGES[127] + '</a></li>';
    body += '<li><a class="action-nodeswipe" href="javascript:void(0)"><i class="glyphicon glyphicon-erase"></i> ' + MESSAGES[128] + '</a></li>';
    body += '<li><a class="action-openconsole-all" href="javascript:void(0)"><i class="glyphicon glyphicon-console"></i> ' + MESSAGES[168] + '</a></li>';
    if ((ROLE == 'admin' || ROLE == 'editor') && LOCK == 0 ) {
        body += '<li><a class="action-nodesexport" href="javascript:void(0)"><i class="glyphicon glyphicon-save"></i> ' + MESSAGES[129] + '</a></li>';
        body += '<li><a class="action-labedit" href="javascript:void(0)"><i class="glyphicon glyphicon-pencil"></i> ' + MESSAGES[87] + '</a></li>';
        body += '<li><a class="action-screenshot" href="javascript:void(0)"><i class="glyphicon glyphicon-camera"></i> ' + MESSAGES[239] + '</a></li>';
        body += '<li><a class="action-nodesbootsaved" href="javascript:void(0)"><i class="glyphicon glyphicon-flash"></i> ' + MESSAGES[139] + '</a></li>';
        body += '<li><a class="action-nodesbootscratch" href="javascript:void(0)"><i class="glyphicon glyphicon-remove"></i> ' + MESSAGES[140] + '</a></li>';
        body += '<li><a class="action-nodesbootdelete" href="javascript:void(0)"><i class="glyphicon glyphicon-erase"></i> ' + MESSAGES[141] + '</a></li>';
    }
    printContextMenu(MESSAGES[125], body, e.pageX + 3, e.pageY + 3, true,"sidemenu", true);
});

// Action topology screenshot

$(document).on('click', '.action-screenshot', function (e) {
    $('#context-menu').remove();
    logger(1, 'DEBUG: action = action-screenshot');
    printScreenshotWait();
    $.when(getScreenshot()).done( function ( data ) {
	    logger(1, 'DEBUG: png='+data['print']);
	    $(".modal-backdrop").remove();
	    $('.screenshotWait').remove();
	    //mywindow = window.open('data:image/png;base64,' + data['print']);
	    pngblob = b64toBlob(data['print'], 'image/png');
	    saveAs( pngblob, 'screenshot.png'); 
    });
});


// Redraw topology
$(document).on('click', '.action-labtopologyrefresh', function (e) {
    logger(1, 'DEBUG: action = labtopologyrefresh');
    detachNodeLink();
    $.when(printLabTopology()).done( function () {
     $(".modal-backdrop").remove()
     //$(".modal").close();
         if ( window.LOCK == 1 ) {
            //$('.action-labobjectadd-li').remove();
            lab_topology.setDraggable($('.node_frame, .network_frame, .customShape'), false);
            $('.customShape').filter('not(.customText)').resizable('disable');
         }
    });

});

// Logout
$(document).on('click', '.action-logout', function (e) {
    logger(1, 'DEBUG: action = logout');
    $.when(logoutUser()).done(function () {
        printPageAuthentication();
    }).fail(function (message) {
        addModalError(message);
    });
});


// Lock lab
$(document).on('click', '.action-lock-lab', function (e) {
    logger(1, 'DEBUG: action = lock lab');
    askLockPass();
    //lockLab();
});


// Unlock lab
$(document).on('click', '.action-unlock-lab', function (e) {
    logger(1, 'DEBUG: action = unlock lab');
    askUnlockPass();
    //unlockLab();
    //$.cookie("countdown", 0 );
});

// FullScreen Topology
$(document).on('click', '.action-fullscreen', function (e) {
    if ( $("body").fullScreen() ) {
        $("body").fullScreen(false)
        //$('.action-fullscreen').html('<i style="" class="glyphicon glyphicon-fullscreen"></i>' + MESSAGES[225])
    } else {
        $("body").fullScreen(true)
        //$('.action-fullscreen').html('<i style="" class="glyphicon glyphicon-resize-small"></i>' + MESSAGES[226])
    }
});

$("body").bind("fullscreenchange", function() {
    if ( $(document).fullScreen()  == false ) {
        //$('.action-fullscreen').html('<i style="" class="glyphicon glyphicon-fullscreen"></i>' + MESSAGES[225])
    } else {
        //$('.action-fullscreen').html('<i style="" class="glyphicon glyphicon-resize-small"></i>' + MESSAGES[226])
    }
});

// hotkey for lock lab
$(document).on('keyup', null, 'alt+l', function(){
    console.log('lock')
    lockLab();
})

// hotkey for unlock lab
$(document).on('keyup', null, 'alt+u', function(){
    console.log('unlock')
    unlockLab();
})



// Add object in lab_view
$(document).on('click', '.action-labobjectadd', function (e) {
    if ( LOCK == 1  ) return ;
    logger(1, 'DEBUG: action = labobjectadd');
    var body = '';
    body += '<li><a class="action-nodeplace" href="javascript:void(0)"><i class="glyphicon glyphicon-hdd"></i> ' + MESSAGES[81] + '</a></li>';
    body += '<li><a class="action-networkplace" href="javascript:void(0)"><i class="glyphicon glyphicon-transfer"></i> ' + MESSAGES[82] + '</a></li>';
    body += '<li><a class="action-pictureadd" href="javascript:void(0)"><i class="glyphicon glyphicon-picture"></i> ' + MESSAGES[83] + '</a></li>';
  body += '<li><a class="action-customshapeadd" href="javascript:void(0)"><i class="glyphicon glyphicon-unchecked"></i> ' + MESSAGES[145] + '</a></li>';
  body += '<li><a class="action-textadd" href="javascript:void(0)"><i class="glyphicon glyphicon-font"></i> ' + MESSAGES[146] + '</a></li>';
  body += '<li><a class="action-lineadd" href="javascript:void(0)"><i class="glyphicon glyphicon-arrow-right"></i> ' + MESSAGES[227] + '</a></li>';
    printContextMenu(MESSAGES[80], body, e.pageX, e.pageY, true,"sidemenu", true);
});

$(document).on('click', '.action-labtasksget', function (e) {
    $.when(getLabTask()).done( function ( tasks ) {
       logger(1, 'DEBUG: action = labtasksget');
       var body = '';
       if ( Object.keys(tasks).length > 0 ) {
          $.each(tasks, function (key,task) {
             //body += '&nbsp;&nbsp;<a class="action-labtaskget" data-path="' + key + '" href="javascript:void(0)" title="' + title + '">' + task['name']+ '</a>';
             //body += '<a class="action-taskframe" href="javascript:void(0)" data-path="' + key + '" style="margin-right: 5px;" ><i class="fas fa-external-link-square-alt" title="Frame"></i>';
         body += '<li><a class="action-taskframe" href="javascript:void(0)" data-path="' + key + '" data-name="' + task['name'] + '"><i class="fas fa-external-link-square-alt" title="Frame"></i>&nbsp;&nbsp;' + task['name']+ '</a></li>';
           // add item for framing
          });
          body += '<li><a class="action-labtaskmgmt" href="javascript:void(0)"><i class="glyphicon glyphicon-menu-hamburger"></i>&nbsp;&nbsp;Task Management</a></li>'
          // add main lab mgmt link
          printContextMenu(MESSAGES[230], body, e.pageX, e.pageY, true,"sidemenu", true);
       } else {
          // open lab management page
          showlabmgmt();
       }
    });
});

// Add network
$(document).on('click', '.action-networkadd', function (e) {
    logger(1, 'DEBUG: action = networkadd');
    printFormNetwork('add', null);
});

// Place an object
$(document).on('click', '.action-nodeplace, .action-networkplace, .action-customshapeadd, .action-textadd, .action-lineadd', function (e) {
    var target = $(this)
        , object
        , frame = ''
        ;

    $('#context-menu').remove();

    if (target.hasClass('action-nodeplace')) {
        object = 'node';
    } else if (target.hasClass('action-networkplace')) {
        object = 'network';
    } else if (target.hasClass('action-customshapeadd')) {
        object = 'shape';
    } else if (target.hasClass('action-textadd')) {
        object = 'text';
    } else if (target.hasClass('action-lineadd')) {
    object = 'line';
    } else {
        return false;
    }


    // On click open the form
    // $('.lab-viewport-click-catcher').off("click").on("click", function (e2) {
        $("#lab-viewport").data("prevent-contextmenu", false);
        // if ($(e.target).is('#lab-viewport, #lab-viewport *')) {
            // Click is within viewport
            // if ($('#mouse_frame').length > 0) {
                // ESC not pressed
                var values = {};
                if ( $("#lab-viewport").data('contextClickXY') ) {
                        values['left'] = $("#lab-viewport").data('contextClickXY').x - 30;
                        values['top'] = $("#lab-viewport").data('contextClickXY').y;
                } else {
                    values['left'] = 0;
                        values['top'] = 0;
                }
                if (object == 'node') {
                    printFormNode('add', values);
                } else if (object == 'network') {
                    printFormNetwork('add', values);
                } else if (object == 'shape') {
                    printFormCustomShape(values);
                } else if (object == 'text') {
                    //printFormText(values);
		    addTextObject(values['left'],values['top']);
                } else if (object == 'line') {
            printFormLine(values );
        }
                $('#mouse_frame').remove();
            // }
            $('#mouse_frame').remove();
            $('.lab-viewport-click-catcher').off();
        // } else {
        //     addMessage('warning', MESSAGES[101]);
        //     $('#mouse_frame').remove();
        //     $('.lab-viewport-click-catcher').off();
        // }
    // });
});

$(document).on('click', '.action-halign-group', function (e) {
        $('#context-menu').remove();
    node_id = $(this).attr('data-path');
        var target = $(this);
    var zoom = $('#zoomslide').slider("value")/100 ;
        var isFreeSelectMode = $("#lab-viewport").hasClass("freeSelectMode")
    var height = Math.round( $('#' + node_id).outerHeight(true) / 2)
    var hpos = Math.round($('#' + node_id).position().top / zoom) + height;
        window.moveCount = 0 ;
        $('.node_frame.ui-selected, node_frame.ui-selecting, .network_frame.ui-selected,.network_ui-selecting,.customShape.ui-selected,.customShape.ui-selecting').each( function ( id, node ) {
        height = Math.round( $('#' + node.id).outerHeight(true) / 2)
                $('#' + node.id).css({top: hpos - height });
                window.lab_topology.revalidate($('#' + node.id));
                logger(1, 'DEBUG: action halign pos = ' + hpos );
                ObjectPosUpdate(e);
        });
});

$(document).on('click', '.action-valign-group', function (e) {
        $('#context-menu').remove();
    node_id = $(this).attr('data-path');
        var target = $(this);
    var zoom = $('#zoomslide').slider("value")/100 ;
        var isFreeSelectMode = $("#lab-viewport").hasClass("freeSelectMode")
        var width = Math.round( $('#' + node_id).outerWidth(true) /  2)  ;
    var vpos = Math.round($('#' + node_id).position().left / zoom ) + width ;
        window.moveCount = 0 ;
    $('.node_frame.ui-selected, node_frame.ui-selecting, .network_frame.ui-selected,.network_ui-selecting,.customShape.ui-selected,.customShape.ui-selecting').each( function ( id, node ) {
        width =  Math.round( $('#' + node.id).outerWidth(true) /  2)
                //$('#' + node.type + node.path).position().top = vpos ;
                $('#' + node.id).css({left: vpos - width });
                window.lab_topology.revalidate($('#' + node.id));
                logger(1, 'DEBUG: action valign pos = ' + vpos );
                ObjectPosUpdate(e);
        });
});
$(document).on('click', '.action-autoalign-group,.action-autoalign', function (e) {
        $('#context-menu').remove();
        var target = $(this);
        var zoom = $('#zoomslide').slider("value")/100 ;
        var isFreeSelectMode = $("#lab-viewport").hasClass("freeSelectMode")
        vpos = undefined ;
        window.moveCount = 0 ;
    step = 24
    if ( $('.node_frame.ui-selected, node_frame.ui-selecting, .network_frame.ui-selected,.network_ui-selecting, .customShape.ui-selected, .customShape.ui-selecting').length == 0 ) {
        $('.node_frame, .network_frame,.network, .customShape').each( function ( id, node ) {
            width =  Math.round( $('#' + node.id).outerWidth(true) /  2)
            height = Math.round( $('#' + node.id).outerHeight(true) / 2)
            logger ( 1, "node: " + node.id  + "width: " + width + ", height: " + height ) ;
                        vpos = Math.round($('#' + node.id).position().left / zoom) + width;
                        hpos = Math.round($('#' + node.id).position().top  / zoom) + height;
            modx = ( ( hpos % (step*2) ) < (step) ) ? ( hpos % (step*2) )   :   ( hpos % (step*2) ) - (step*2)
            mody = ( ( vpos % (step*2) ) < (step) ) ? ( vpos % (step*2) )   :   ( vpos % (step*2) ) - (step*2)
            x = hpos - modx - height
            y = vpos - mody - width
                    $('#' + node.id).css({top: x });
                    $('#' + node.id).css({left: y });
            window.lab_topology.revalidate($('#' + node.id));
            e.el = node ;
            ObjectPosUpdate(e);
            lab_topology.repaintEverything()
        });
    }
    //lab_topology.repaintEverything()
});
$(document).on('click', '.action-calign-group', function (e) {
        $('#context-menu').remove();
        var node_id = $(this).attr('data-path');
        var zoom = $('#zoomslide').slider("value")/100 ;
        var isFreeSelectMode = $("#lab-viewport").hasClass("freeSelectMode")
        var width = Math.round( $('#' + node_id).outerWidth(true) /  2)  ;
        var vpos = Math.round($('#' + node_id).position().left / zoom ) + width ;
        var height = Math.round( $('#' + node_id).outerHeight(true) / 2)
        var hpos = Math.round($('#' + node_id).position().top / zoom) + height;
        window.moveCount = 0 ;
    step = -1 ;
    //angle= Math.round( 360 / ( $('.node_frame.ui-selected, node_frame.ui-selecting, .network_frame.ui-selected,.network_ui-selecting, .customShape.ui-selected, .customS0hape.ui-selecting').length ));
    nbo=$('.node_frame.ui-selected, node_frame.ui-selecting, .network_frame.ui-selected,.network_ui-selecting, .customShape.ui-selected, .customS0hape.ui-selecting').length;
    angle=Math.round(360 / nbo )
        logger(1, 'DEBUG: action angle = ' + angle )
        $('.node_frame.ui-selected, node_frame.ui-selecting, .network_frame.ui-selected,.network_ui-selecting, .customShape.ui-selected, .customShape.ui-selecting').each( function ( id, node ) {
        width = Math.round( $('#' + node.id).outerWidth(true) /  2)  ;
        height = Math.round( $('#' + node.id).outerHeight(true) / 2) ;
        step += 1 ;
        radius =  angle * step * Math.PI / 180 ;
        x = hpos + Math.round( Math.sin(radius) * nbo * 20 ) - height
        y = vpos + Math.round( Math.cos(radius) * nbo * 20 ) - width
                //$('#' + node.type + node.path).position().top = vpos ;
                $('#' + node.id).css({top: x });
                $('#' + node.id).css({left: y });
                window.lab_topology.revalidate($('#' + node.id));
                logger(1, 'DEBUG: action calign  nose ' + node.id  + ' ang = ' + (angle*step) );
                ObjectPosUpdate(e);
        });
});
$(document).on('click', '.action-openconsole-all, .action-openconsole-group', function (e) {
    $('#context-menu').remove();
    var target = $(this);
    var isFreeSelectMode = $("#lab-viewport").hasClass("freeSelectMode")
    userAgent = navigator.userAgent;
    if (!isFreeSelectMode) {
        $.when(getNodes(null)).done(function (nodes) {
            $.each(nodes, function (node_id, node) {
		    if ( node['status'] > 1 ) {
			    if (window.chrome && window.chrome.webstore || userAgent.match(/chrome|chromium|crios/i) && $('#node'+node['id']+' a').attr('href').indexOf('token') == -1 ) {
				    logger(1, 'chrome detected');
				     nw=window.open(node['url']);
				     sleep(1000);
				     nw.close();
			    } else {
				    $('#node'+node['id']+' a img').click();
			    }
		    }
            })
        })
    } else {
        freeSelectedNodes.forEach(function(node){
             $("#lab-viewport").removeClass("freeSelectMode");
             if ($('#node' + node.path).attr('data-status') > 1 ){
		     var url = $('#node'+node.path+' a').attr('href')
		     if (window.chrome && window.chrome.webstore || userAgent.match(/chrome|chromium|crios/i) && $('#node'+node.path+' a').attr('href').indexOf('token') == -1 ) {
			     logger(1, 'chrome detected');
			     nw=window.open(url,"eve","popup");
			     sleep(1000);
			     nw.close();
		     } else { 
			     $('#node' + node.path +' a img').click();
		     }
	     }
             $("#lab-viewport").addClass("freeSelectMode");
        })
   }
});


// Add picture
$(document).on('click', '.action-pictureadd', function (e) {
    logger(1, 'DEBUG: action = pictureadd');
    $('#context-menu').remove();
    displayPictureForm();


    $("#form-picture-add").find('input:eq(0)').delay(500).queue(function() {
     $(this).focus();
     $(this).dequeue();
    });
    //printFormPicture('add', null);
});

// Attach files
var attachments;
$('body').on('change', 'input[type=file]', function (e) {
    attachments = e.target.files;
});

// Add picture form
$('body').on('submit', '#form-picture-add', function (e) {
    // lab_file = getCurrentLab//getParameter('filename');
    var lab_file = $('#lab-viewport').attr('data-path');
    var form_data = new FormData();
    var picture_name = $('form :input[name^="picture[name]"]').val();
    // Setting options
    $('form :input[name^="picture["]').each(function (id, object) {
        form_data.append($(this).attr('name').substr(8, $(this).attr('name').length - 9), $(this).val());
    });

    // Add attachments
    $.each(attachments, function (key, value) {
        form_data.append(key, value);
    });

    // Get action URL
    var url = '/api/labs' + lab_file + '/pictures';
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: 'POST',
        url: encodeURI(url),
        contentType: false, // Set content type to false as jQuery will tell the server its a query string request
        processData: false, // Don't process the files
        dataType: 'json',
        data: form_data,
        success: function (data) {
            if (data['status'] == 'success') {
                addMessage('SUCCESS', 'Picture "' + picture_name + '" added.');
                // Picture added -> reopen this page (not reload, or will be posted twice)
                // window.location.href = '/lab_edit.php' + window.location.search;
                $('.action-picturesget-li').removeClass('hidden')
            } else {
                // Fetching failed
                addMessage('DANGER', data['status']);
            }
        },
        error: function (data) {
            addMessage('DANGER', getJsonMessage(data['responseText']));
        }
    });

    // Hide and delete the modal (or will be posted twice)
    $('#body').children('.modal').modal('hide');

    // Stop or form will follow the action link
    return false;
});

// Edit picture
$(document).on('click', '.action-pictureedit', function (e) {
    logger(1, 'DEBUG: action = pictureedit');
    $('#context-menu').remove();
    var picture_id = $(this).attr('data-path');
    $.when(getPictures(picture_id)).done(function (picture) {
        picture['id'] = picture_id;
        printFormPicture('edit', picture);
    }).fail(function (message) {
        addModalError(message);
    });
});

// Get picture
$(document).on('click', '.action-pictureget', function (e) {
    logger(1, 'DEBUG: action = pictureget');
    $(".action-pictureget").removeClass("selected");
    $(this).addClass("selected");
    $('#context-menu').remove();
    var picture_id = $(this).attr('data-path');
    printPictureInForm(picture_id);

});

// Get Task
$(document).on('click', '.action-labtaskget', function (e) {
    logger(1, 'DEBUG: action = labtaskget');
    if (typeof ( CurCKEDITOR ) !== 'undefined'  && CurCKEDITOR.state == 'ready' ) { CurCKEDITOR.destroy() }
    $("#task-data-content").css('height','100%');
    $("#task-data").css('height','100%');
    $(".action-labtaskget").removeClass("selected");
    $(this).addClass("selected");
    $('#context-menu').remove();
    var task_id = $(this).attr('data-path');
    printTaskInForm(task_id);
    $("#task-buttons").hide();

});


//Show circle under cursor
$(document).on('mousemove', '.follower-wrapper', function (e) {
    var offset = $('.follower-wrapper img').offset()
        , limitY = $('.follower-wrapper img').height()
        , limitX = $('.follower-wrapper img').width()
        , mouseX = Math.min(e.pageX - offset.left, limitX)
        , mouseY = Math.min(e.pageY - offset.top, limitY);

    if (mouseX < 0) mouseX = 0;
    if (mouseY < 0) mouseY = 0;

    $('#follower').css({left: mouseX, top: mouseY});
    $("#follower").data("data_x", mouseX);
    $("#follower").data("data_y", mouseY);
});

$(document).on('click', '#follower', function (e) {
    e.preventDefault();
    e.folowerPosition = {
        left: parseFloat($("#follower").css("left")) - 30,
        top: parseFloat($("#follower").css("top")) + 30
    };
});

// Get Tasks list
$(document).on('click', '.action-labtaskmgmt', showlabmgmt );

function showlabmgmt () {
    logger(1, 'DEBUG: action = labtaskmgmt');
    $('#context-menu').remove();
    $.when(getLabTask()).done(function (tasks) {
        //if (!$.isEmptyObject(tasks)) {
            var body = '<div class="col-md-1 col-md-offset-11"></div><div class="row"><div class="task-list col-md-3 col-lg-2"><ul class="ul-task-list">';
            $.each(tasks, function (key, task) {
                var title = task['name'] || "task name";
        body += '<li class="task-item' + key + '">';
                if (ROLE != "user" && LOCK != 1 ) {
                    body += '<a class="delete-task" style="margin-right: 5px;" href="javascript:void(0)" data-path="' + key + '"><i class="glyphicon glyphicon-trash" title="Delete"></i> ';
                    body += '<a class="action-taskedit" href="javascript:void(0)" data-path="' + key + '"><i class="glyphicon glyphicon-edit" title="Edit"></i> ';
                    body += '<a class="action-taskrename" href="javascript:void(0)" data-path="' + key + '"><i class="glyphicon glyphicon-pencil" title="Rename"></i> ';
                }
                //body += '<a class="action-taskframe" href="javascript:void(0)" data-path="' + key + '" style="margin-right: 5px;" ><i class="fas fa-external-link-square-alt" title="Frame"></i>';
                //body += '<a class="action-tasktab" href="javascript:void(0)" data-path="' + key + '"><i class="fas fa-external-link-alt" title="Frame"></i>';
                body += '&nbsp;&nbsp;<a class="action-labtaskget" data-path="' + key + '" href="javascript:void(0)" title="' + title + '">' + task['name']+ '</a>';
                body += '</a></li>';
            });
        body += '</ul><ul>';
        if (ROLE != "user" && LOCK != 1 ) {
            body += '<li>';
            body += '<a class="action-addtask" style="margin-right: 5px;" href="javascript:void(0)"><i class="glyphicon glyphicon-plus"></i>';
                body += '</a>New Task</li>';
        }
        body += '</ul></div>';
            //body += '<div class="col-md-9 col-lg-9"><div id="taskname"></div></div>';
            body += '<div id="task-data-content" class="col-md-9 col-lg-10 logicaltopology"><div id="task-data"></div>';
            body += '<div id="task-buttons" class="form-group" style="display:none">';
            body += '<div class="col-md-5">';
            body += '<form id="save-task">';
            body += '<button type="submit" class="btn btn-success">' + MESSAGES[47] + '</button>';
            body += '<button type="button" class="btn" id="cancel-taskedit">' + MESSAGES[18] + '</button>';
        body += '</form>';
            body += '</div></div></div>';
            body += '</div>';
            //addModalWide(MESSAGES[59], body, '', "modal-ultra-wide");
            addModelessWideSL(MESSAGES[230], body, '', "modal-ultra-wide full-height");
            //addModalWide(MESSAGES[59], body, '', "modal-fullscreen");
            //$('#picslider').slider({value:100,min:10,max:200,step:10,slide:zoompic})
        //} else {
        //    addMessage('info', MESSAGES[134]);
        //}
    }).fail(function (message) {
        addModalError(message);
    });
};


// Get pictures list
$(document).on('click', '.action-picturesget', function (e) {
    logger(1, 'DEBUG: action = picturesget');
    $.when(getPictures()).done(function (pictures) {
        if (!$.isEmptyObject(pictures)) {
            var body = '<div class="col-md-1 col-md-offset-10" id="picslider"></div><div class="col-md-1 col-md-offset-11"></div><div class="row"><div class="picture-list col-md-3 col-lg-2"><ul class="map">';
            $.each(pictures, function (key, picture) {
                var title = picture['name'] || "pic name";
                body += '<li>';
                if (ROLE != "user" && LOCK != 1 ) {
                    body += '<a class="delete-picture" style="margin-right: 5px;" href="javascript:void(0)" data-path="' + key + '"><i class="glyphicon glyphicon-trash" title="Delete"></i> ';
                    body += '<a class="action-pictureedit" href="javascript:void(0)" data-path="' + key + '"><i class="glyphicon glyphicon-edit" title="Edit"></i> ';
                }
                body += '<a class="action-pictureget" data-path="' + key + '" href="javascript:void(0)" title="' + title + '">&nbsp;&nbsp;' + picture['name'].split(' ')[0] + '</a>';
                body += '</a></li>';
            });
            body += '</ul></div><div id="config-data" class="col-md-9 col-lg-10 logicaltopology"></div></div>';
            //addModalWide(MESSAGES[59], body, '', "modal-ultra-wide");
            addModelessWide(MESSAGES[59], body, '', "modal-ultra-wide");
            //addModalWide(MESSAGES[59], body, '', "modal-fullscreen");
            $('#picslider').slider({value:100,min:10,max:200,step:10,slide:zoompic})
        } else {
            addMessage('info', MESSAGES[134]);
        }
    }).fail(function (message) {
        addModalError(message);
    });
});

// Get picture list old
$(document).on('click', '.action-picturesget-stop', function (e) {
    logger(1, 'DEBUG: action = picturesget');
    $.when(getPictures()).done(function (pictures) {
        if (!$.isEmptyObject(pictures)) {
            var body = '';
            $.each(pictures, function (key, picture) {
                body += '<li><a class="action-pictureget" data-path="' + key + '" href="javascript:void(0)" title="' + picture['name'] + '"><i class="glyphicon glyphicon-picture"></i> ' + picture['name'] + '</a></li>';
            });
            printContextMenu(MESSAGES[59], body, e.pageX, e.pageY,false,"menu");
        } else {
            addMessage('info', MESSAGES[134]);
        }
    }).fail(function (message) {
        addModalError(message);
    });
});

//Detele picture
$(document).on('click', '.delete-picture', function (ev) {
    ev.stopPropagation();  // Prevent default behaviour
    ev.preventDefault();  // Prevent default behaviour
    var id = $(this).attr('data-path');
    console.log('this', $(this))
    var body = '<div class="form-group">' +
                    '<div class="question">Are you sure to delete this picture?</div>' +
                    '<div class="col-md-5 col-md-offset-3">' +
                        '<button id="formPictureDelete" class="btn btn-success"  data-path="'+id+'" data-dismiss="modal">Yes</button>' +
                        '<button type="button" class="btn" data-dismiss="modal">Cancel</button>' +
                    '</div>' +
                '</div>'
    var title = "Warning"
    addModal(title, body, "", "make-red make-small");
    $('#formPictureDelete').on('click', function (e) {
        var lab_filename = $('#lab-viewport').attr('data-path');
        var picture_id = $(this).attr('data-path');
        var picture_name = $('li a[data-path="' + picture_id + '"]').attr("title");
        $.when(deletePicture(lab_filename, picture_id)).done(function () {
            $('.modal.make-red').modal('hide')
            addMessage('SUCCESS', 'Picture "' + picture_name + '" deleted.');
            $('li a[data-path="' + picture_id + '"]').parent().remove();
            $("#config-data").html("");
            $.when(getPictures()).done( function (pic) {
             if ( Object.keys(pic)  < 1 ) {
                 $('.action-picturesget-li').addClass('hidden');
              }
            });
        }).fail(function (message) {
            $('.modal.make-red').modal('hide')
            addModalError(message);
        });
        // Hide and delete the modal (or will be posted twice)
        $('#body').children('.modal.second-win').modal('hide');

        // Stop or form will follow the action link
        return false;
    });
    // logger(1, 'DEBUG: action = pictureremove');
    // var $self = $(this);

    // var picture_id = $self.parent().attr('data-path');
    // var lab_filename = $('#lab-viewport').attr('data-path');
    // var body = '<form id="form-picture-delete" data-path="' + picture_id + '" class="form-horizontal form-picture" novalidate="novalidate"><div class="form-group"><div class="col-md-5 col-md-offset-3"><button type="submit" class="btn btn-success">Delete</button><button type="button" class="btn btn-danger" data-dismiss="modal">Cancel</button></div></div></form>'
    // var title = "Delete this picture?"
    // addModal(title, body, "", "second-win");
});

// Clone selected labs
$(document).on('click', '.action-selectedclone', function (e) {
    if ($('.selected').length > 0) {
        logger(1, 'DEBUG: action = selectedclone');
        $('.selected').each(function (id, object) {
            form_data = {};
            form_data['name'] = 'Copy of ' + $(this).text().slice(0, -4);
            form_data['source'] = $(this).attr('data-path');
            $.when(cloneLab(form_data)).done(function () {
                // Lab cloned -> reload the folder
                printPageLabList($('#list-folders').attr('data-path'));
            }).fail(function (message) {
                // Error on clone
                addModalError(message);
            });
        });
    }
});

// Delete selected folders and labs
$(document).on('click', '.action-selecteddelete', function (ev) {
    var id = $(this).attr('data-path');
    var self = $(this);
    var body = '<div class="form-group">' +
                    '<div class="question">Are you sure to delete selected nodes?</div>' +
                    '<div class="col-md-5 col-md-offset-3">' +
                        '<button id="selectedDelete" class="btn btn-success"  data-path="'+id+'" data-dismiss="modal">Yes</button>' +
                        '<button type="button" class="btn" data-dismiss="modal">Cancel</button>' +
                    '</div>' +
                '</div>'
    var title = "Warning"
    addModal(title, body, "", "make-red make-small");
    $('#selectedDelete').on('click', function deleteSelected(e) {
        if ($('.selected').length > 0) {
            logger(1, 'DEBUG: action = selecteddelete');

            $('.selected').each(function (id, object) {
                var path = self.attr('data-path');
                if (self.hasClass('folder')) {
                    $.when(deleteFolder(path)).done(function () {
                        // Folder deleted
                        $('.folder[data-path="' + path + '"]').fadeOut(300, function () {
                            self.remove();
                        });
                    }).fail(function (message) {
                        // Cannot delete folder
                        addModalError(message);
                    });
                } else if (self.hasClass('lab')) {
                    $.when(deleteLab(path)).done(function () {
                        // Lab deleted
                        $('.lab[data-path="' + path + '"]').fadeOut(300, function () {
                            self.remove();
                        });
                    }).fail(function (message) {
                        // Cannot delete lab
                        addModalError(message);
                    });
                } else if (self.hasClass('user')) {
                    $.when(deleteUser(path)).done(function () {
                        // User deleted
                        $('.user[data-path="' + path + '"]').fadeOut(300, function () {
                            self.remove();
                        });
                    }).fail(function (message) {
                        // Cannot delete user
                        addModalError(message);
                    });
                } else {
                    // Invalid object
                    logger(1, 'DEBUG: cannot delete, invalid object.');
                    return;
                }
            });
        }
    })
})

// Export selected folders and labs
$(document).on('click', '.action-selectedexport', function (e) {
    if ($('.selected').length > 0) {
        logger(1, 'DEBUG: action = selectedexport');
        var form_data = {};
        var i = 0;
        form_data['path'] = $('#list-folders').attr('data-path')
        $('.selected').each(function (id, object) {
            form_data[i] = $(this).attr('data-path');
            i++;
        });
        $.when(exportObjects(form_data)).done(function (url) {
            // Export done
            window.location = url;
        }).fail(function (message) {
            // Cannot export objects
            addModalError(message);
        });
    }
});

// Delete all startup-config
$(document).on('click', '.action-nodesbootdelete, .action-nodesbootdelete-group', function (ev) {
    $('#context-menu').remove();
    var self = $(this);

    var textQuestion = 'Are you sure to delete all startup cfgs?';
    if(self.hasClass('action-nodesbootdelete-group')){
        textQuestion = 'Are you sure to delete selected startup cfgs?';
    }
    var body = '<div class="form-group">' +
                    '<div class="question">' + textQuestion + '</div>' +
                    '<div class="col-md-5 col-md-offset-3">' +
                        '<button id="nodesbootdelete" class="btn btn-success"  data-dismiss="modal">Yes</button>' +
                        '<button type="button" class="btn" data-dismiss="modal">Cancel</button>' +
                    '</div>' +
                '</div>'
    var title = "Warning"
    addModal(title, body, "", "make-red make-small");
    $('#nodesbootdelete').on('click', function (e) {
        var isFreeSelectMode = $("#lab-viewport").hasClass("freeSelectMode")
            ;
        if (isFreeSelectMode) {
            var nodeLenght = window.freeSelectedNodes.length;
            var lab_filename = $('#lab-viewport').attr('data-path');
            $.each(window.freeSelectedNodes, function (i, node) {
                var form_data = {};
                form_data['id'] = node.path;
                form_data['data'] = '';
                form_data['cfsid'] = 'default';
                var url = '/api/labs' + lab_filename + '/configs/' + node.path;
                var type = 'PUT';
                $.when($.ajax({
                    cache: false,
                    timeout: TIMEOUT,
                    type: type,
                    url: encodeURI(url),
                    dataType: 'json',
                    data: JSON.stringify(form_data)
                })).done(function (message) {
                    // Config deleted
                    nodeLenght--;
                    if (nodeLenght < 1) {
                        addMessage('success', MESSAGES[160])
                    }
                    ;
                }).fail(function (message) {
                    // Cannot delete config
                    nodeLenght--;
                    if (nodeLenght < 1) {
                        addMessage('danger', node.name + ': ' + message);
                    }
                    ;
                });
            });
        } else {
            $.when(getNodes(null)).done(function (nodes) {
                var nodeLenght = Object.keys(nodes).length;
                $.each(nodes, function (key, values) {
                    var lab_filename = $('#lab-viewport').attr('data-path');
                    var form_data = {};
                    form_data['id'] = key;
                    form_data['data'] = '';
                    form_data['cfsid'] = 'default';
                    var url = '/api/labs' + lab_filename + '/configs/' + key;
                    var type = 'PUT';
                    $.when($.ajax({
                        cache: false,
                        timeout: TIMEOUT,
                        type: type,
                        url: encodeURI(url),
                        dataType: 'json',
                        data: JSON.stringify(form_data)
                    })).done(function (message) {
                        // Config deleted
                        nodeLenght--;
                        if (nodeLenght < 1) {
                            addMessage('success', MESSAGES[142])
                        }
                        ;
                    }).fail(function (message) {
                        // Cannot delete config
                        nodeLenght--;
                        if (nodeLenght < 1) {
                            addMessage('danger', values['name'] + ': ' + message);
                        }
                        ;
                    });
                });
            }).fail(function (message) {
                addModalError(message);
            });
        }
    });
})

// Configure nodes to boot from scratch
$(document).on('click', '.action-nodesbootscratch, .action-nodesbootscratch-group', function (e) {
    $('#context-menu').remove();

    var isFreeSelectMode = $("#lab-viewport").hasClass("freeSelectMode")
        ;

    if (isFreeSelectMode) {
        $.each(window.freeSelectedNodes, function (i, node) {
            $.when(setNodeBoot(node.path, 0)).done(function () {
                addMessage('success', node.name + ': ' + MESSAGES[144]);
            }).fail(function (message) {
                // Cannot configure
                addMessage('danger', node.name + ': ' + message);
            });
        });
    }
    else {
        $.when(getNodes(null)).done(function (nodes) {
            $.each(nodes, function (key, values) {
                $.when(setNodeBoot(key, 0)).done(function () {
                    // Node configured -> print a small green message
                    addMessage('success', values['name'] + ': ' + MESSAGES[144])
                }).fail(function (message) {
                    // Cannot start
                    addMessage('danger', values['name'] + ': ' + message);
                });
            });
        }).fail(function (message) {
            addModalError(message);
        });
    }
});

// Configure nodes to boot from startup-config
$(document).on('click', '.action-nodesbootsaved, .action-nodesbootsaved-group', function (e) {
    $('#context-menu').remove();

    var isFreeSelectMode = $("#lab-viewport").hasClass("freeSelectMode")
        ;

    if (isFreeSelectMode) {
        $.each(window.freeSelectedNodes, function (i, node) {
            $.when(setNodeBoot(node.path, 1)).done(function () {
                addMessage('success', node.name + ': ' + MESSAGES[143]);
            }).fail(function (message) {
                // Cannot configure
                addMessage('danger', node.name + ': ' + message);
            });
        });
    }
    else {
        $.when(getNodes(null)).done(function (nodes) {
            $.each(nodes, function (key, values) {
                $.when(setNodeBoot(key, 1)).done(function () {
                    // Node configured -> print a small green message
                    addMessage('success', values['name'] + ': ' + MESSAGES[143])
                }).fail(function (message) {
                    // Cannot configure
                    addMessage('danger', values['name'] + ': ' + message);
                });
            });
        }).fail(function (message) {
            addModalError(message);
        });
    }
});

// Export a config
$(document).on('click', '.action-nodeexport, .action-nodesexport, .action-nodeexport-group', function (e) {
    $('#context-menu').remove();

    var node_id
        , isFreeSelectMode = $("#lab-viewport").hasClass("freeSelectMode")
        , exportAll = false
        , nodesLength
        ;

    if ($(this).hasClass('action-nodeexport')) {
        logger(1, 'DEBUG: action = nodeexport');
        node_id = $(this).attr('data-path');
    } else {
        logger(1, 'DEBUG: action = nodesexport');
        exportAll = true;
    }

    $.when(getNodes(null)).done(function (nodes) {
        if (isFreeSelectMode) {
            nodesLenght = window.freeSelectedNodes.length;
            addMessage('info', 'Export Selected:  Starting');
            $.when(recursive_cfg_export(window.freeSelectedNodes, nodesLenght)).done(function () {
            }).fail(function (message) {
                addMessage('danger', 'Export Selected: Error');
            });
        }
        else if (node_id) {
            addMessage('info', nodes[node_id]['name'] + ': ' + MESSAGES[138]);
            $.when(cfg_export(node_id)).done(function () {
                // Node exported -> print a small green message
                //setNodeBoot(node_id, '1');
                addMessage('success', nodes[node_id]['name'] + ': ' + MESSAGES[79])
            }).fail(function (message) {
                // Cannot export
                addMessage('danger', nodes[node_id]['name'] + ': ' + message);
            });
        } else if (exportAll) {
            /*
             * Parallel call for each node
             */
            nodesLenght = Object.keys(nodes).length;
            addMessage('info', 'Export all:  Starting');
            $.when(recursive_cfg_export(nodes, nodesLenght)).done(function () {
            }).fail(function (message) {
                addMessage('danger', 'Export all: Error');
            });
        }
    }).fail(function (message) {
        addModalError(message);
    });
});

// Start a node
$(document).on('click', '.action-nodestart, .action-nodesstart, .action-nodestart-group', function (e) {
    $('#context-menu').remove();
    var node_id
        , startAll
        , isFreeSelectMode = $("#lab-viewport").hasClass("freeSelectMode")
        , nodeLenght
        ;

    if ($(this).hasClass('action-nodestart')) {
        logger(1, 'DEBUG: action = nodestart');
        node_id = $(this).attr('data-path');
    } else {
        logger(1, 'DEBUG: action = nodesstart');
        startAll = true;
    }

    $.when(getNodes(null)).done(function (nodes) {
        if (isFreeSelectMode) {
            nodeLenght = window.freeSelectedNodes.length;
            addMessage('info', 'Start selected nodes...');
            $.when(recursive_start(window.freeSelectedNodes, nodeLenght)).done(function () {
            }).fail(function (message) {
                addMessage('danger', 'Start all: Error');
            });

        }
        else if (node_id != null) {
	    // addclass to blink
		//  $('#node' + node_id + ' img').addClass('grayscale')
	    $("#node"+node_id + ' img').addClass('starting')
            $.when(start(node_id)).done(function () {
                // Node started -> print a small green message
		$("#node"+node_id + ' img').removeClass('starting')
                addMessage('success', nodes[node_id]['name'] + ': ' + MESSAGES[76]);
                if($('input[data-path='+node_id+'][name="node[type]"]') &&
                   $('input[data-path='+node_id+'][name="node[type]"]').parent()){
                       $('input[data-path='+node_id+'][name="node[type]"]').parent().addClass('node-running')
                       $('input[data-path='+node_id+']').prop('disabled', true)
                       $('select[data-path='+node_id+']').prop('disabled', true)
                       $("a[data-path="+node_id+"].action-nodeedit").addClass('disabled')
                       $("a[data-path="+node_id+"].action-nodedelete").addClass('disabled')
                       $("a[data-path="+node_id+"].action-nodeinterfaces").attr('data-status', 2)
                   }
                printLabStatus();
            }).fail(function (message) {
                // Cannot start
		$("node"+node_id + ' img').removeClass('starting')
                addMessage('danger', nodes[node_id]['name'] + ': ' + message);
            });
        }
        else if (startAll) {
            nodesLenght = Object.keys(nodes).length;
            addMessage('info', 'Start all...');
            $.when(recursive_start(nodes, nodesLenght)).done(function () {
            }).fail(function (message) {
                addMessage('danger', 'Start all: Error');
            });
        }


    }).fail(function (message) {
        addModalError(message);
    });
});

// Stop a node
$(document).on('click', '.action-nodestop, .action-nodesstop, .action-node-autostop, .action-node-shutdown, .action-nodestop-group, .action-node-poweroff, .action-node-hibernate ', function (e) {
    if ( $(e.target).hasClass('glyphicon-chevron-right') || $(e.target).hasClass('glyphicon-chevron-left')) {
    return ;
    }
    $('#context-menu').remove();
    e.stopPropagation();  // Prevent default behaviour
    e.preventDefault();  // Prevent default behaviour
    var node_id
        , nodeLenght
        , isFreeSelectMode = $("#lab-viewport").hasClass("freeSelectMode")
        , stopAll
        ;

    if ($(this).hasClass('action-nodestop')  || $(this).hasClass('action-node-shutdown') || $(this).hasClass('action-node-autostop') || $(this).hasClass('action-node-poweroff') || $(this).hasClass('action-node-hibernate')) {
        logger(1, 'DEBUG: action = nodestop');
        node_id = $(this).attr('data-path');
    } else {
        logger(1, 'DEBUG: action = nodestop');
        stopAll = true;
    }
    if ($(this).hasClass('action-node-poweroff')) {
        stopmode = 1 ;
    } else if ( $(this).hasClass('action-node-hibernate')) {
        stopmode = 2 ;
    } else if ( $(this).hasClass('action-node-shutdown')) {
        stopmode = 0
    } else {
        stopmode = 3 ;
    }

    $.when(getNodes(null)).done(function (nodes) {
        if (isFreeSelectMode) {
            nodeLenght = window.freeSelectedNodes.length;
            $.each(window.freeSelectedNodes, function (i, node) {
                $.when(stop(node.path,stopmode)).done(function () {
                    // Node stopped -> print a small green message
                    addMessage('success', node.name + ': ' + MESSAGES[77]);
                    nodeLenght--;
                    if (nodeLenght < 1) {
                        setTimeout(printLabStatus, 3000);
                    }
                }).fail(function (message) {
                    // Cannot stopped
                    addMessage('danger', node.name + ': ' + message);
                    nodeLenght--;
                    if (nodeLenght < 1) {
                        setTimeout(printLabStatus, 3000);
                    }
                });
            });
        }
        else if (node_id != null) {
            $.when(stop(node_id,stopmode)).done(function () {
                // Node stopped -> print a small green message
                addMessage('success', nodes[node_id]['name'] + ': ' + MESSAGES[77])

                // remove blue background in node-list
		window.donotupdate = 1;
                if($('input[data-path='+node_id+'][name="node[type]"]') &&
                   $('input[data-path='+node_id+'][name="node[type]"]').parent()){
                       $('input[data-path='+node_id+'][name="node[type]"]').parent().removeClass('node-running')
                       $('input[data-path='+node_id+'][disabled]').prop('disabled', false)
                       $('select[data-path='+node_id+'][disabled]').prop('disabled', false)
                       $("a[data-path="+node_id+"].action-nodeedit").removeClass('disabled')
                       $("a[data-path="+node_id+"].action-nodedelete").removeClass('disabled')
                       $("a[data-path="+node_id+"].action-nodeinterfaces").attr('data-status', 0)
                   }
		window.donotupdate = 0;
                $('#node' + node_id + ' img').addClass('grayscale')
                printLabStatus();
            }).fail(function (message) {
                // Cannot stop commented message undefined.... To fix
        // when other ajax call is called this one is interrupted..??!!!??? Why ??
                // addMessage('danger', nodes[node_id]['name'] + ': ' + message);
        // addMessage('danger', node.name + ': ' + message);
            });
        }
        else if (stopAll) {
            nodeLenght = Object.keys(nodes).length;
            $.each(nodes, function (key, values) {
                $.when(stop(key,stopmode)).done(function () {
                    // Node stopped -> print a small green message
                    addMessage('success', values['name'] + ': ' + MESSAGES[77]);
                    nodeLenght--;
                    if (nodeLenght < 1) {
                        setTimeout(printLabStatus, 3000);
                    }

                    $('#node' + values['id']).attr('data-status', 0);
                }).fail(function (message) {
                    // Cannot stopped
                    addMessage('danger', values['name'] + ': ' + message);
                    nodeLenght--;
                    if (nodeLenght < 1) {
                        setTimeout(printLabStatus, 3000);
                    }
                });
            });
        }
    }).fail(function (message) {
        addModalError(message);
    });
});

// Wipe a node
$(document).on('click', '.action-nodewipe, .action-nodeswipe, .action-nodewipe-group', function (e) {
    $('#context-menu').remove();
    var self = $(this);
    var textQuestion = "";
    if(self.hasClass('action-nodewipe')){
        textQuestion = 'Are you sure to wipe this node?'
    } else if(self.hasClass('action-nodeswipe')){
        textQuestion = 'Are you sure to wipe all nodes?'
    } else {
        textQuestion = 'Are you sure to wipe selected nodes ?'
    }

    var body = '<div class="form-group">' +
                    '<div class="question">' + textQuestion + '</div>' +
                    '<div class="col-md-5 col-md-offset-3">' +
                        '<button id="node_wipe" class="btn btn-success"  data-dismiss="modal">Yes</button>' +
                        '<button type="button" class="btn" data-dismiss="modal">Cancel</button>' +
                    '</div>' +
                '</div>'
    var title = "Warning"
    addModal(title, body, "", "make-red make-small");
    $('#node_wipe').on('click', function(ev){

        var node_id
            , isFreeSelectMode = $("#lab-viewport").hasClass("freeSelectMode")
            , wipeAll
            ;

        if (self.hasClass('action-nodewipe')) {
            logger(1, 'DEBUG: action = nodewipe');
            node_id = self.attr('data-path');
        } else {
            logger(1, 'DEBUG: action = nodeswipe');
            wipeAll = true;
        }

        $.when(getNodes(null)).done(function (nodes) {
            if (isFreeSelectMode) {
                $.each(window.freeSelectedNodes, function (i, node) {
                    $.when(setTimeout(function () {
                        wipe(node.path);
                    }, nodes[node.path]['delay'] * 10)).done(function (res) {
                        // Node wiped -> print a small green message
                        addMessage('success', node.name + ': ' + MESSAGES[78])
                    }).fail(function (message) {
                        // Cannot wiped
                        addMessage('danger', node.name + ': ' + message);
                    });
                });
            }
            else if (node_id != null) {
                $.when(wipe(node_id)).done(function () {
                    // Node wiped -> print a small green message
                    addMessage('success', nodes[node_id]['name'] + ': ' + MESSAGES[78])
                }).fail(function (message) {
                    // Cannot wipe
                    addMessage('danger', nodes[node_id]['name'] + ': ' + message);
                });
            }
            else if (wipeAll) {
                $.each(nodes, function (key, values) {
                    $.when(setTimeout(function () {
                        wipe(key);
                    }, values['delay'] * 10)).done(function () {
                        // Node wiped -> print a small green message
                        addMessage('success', values['name'] + ': ' + MESSAGES[78])
                    }).fail(function (message) {
                        // Cannot wiped
                        addMessage('danger', values['name'] + ': ' + message);
                    });
                });
            }
        }).fail(function (message) {
            addModalError(message);
        });
    })
});

// console node
$(document).on('click', '.action-console', function (e) {
    logger(1, 'DEBUG: action = console node');
    e.stopPropagation();  // Prevent default behaviour
    e.preventDefault();  // Prevent default behaviour
    //$('#context-menu').remove();
    var self = $(this);
    node_id = self.attr('data-path');
    $("#node"+node_id+" a").click();
    url = $("#node"+node_id+" a").attr('href')
    $("#framewrap"+node_id).children('iframe').attr('src' , url);
    if ( url.indexOf('token') == -1 ) {
	    logger(1, 'DEBUG: natve console ');
	    window.open( url , 'hiddeniframe' )
    }
});

// Stop all nodes
$(document).on('click', '.action-stopall', function (e) {
    logger(1, 'DEBUG: action = stopall');
    $.when(stopAll()).done(function () {
        // Stopped all nodes -> reload status page
        printSystemStats();
    }).fail(function (message) {
        // Cannot stop all nodes
        addModalError(message);
    });
});

// Load system status page
$(document).on('click', '.action-sysstatus', function (e) {
    bodyAddClass('status');
    logger(1, 'DEBUG: action = sysstatus');

    //printSystemStats();
    $.when(getSystemStats()).done(function (data) {
        // Main: title
        var html_title = '' +
            '<div class="row row-eq-height"><div id="list-title-folders" class="col-md-12 col-lg-12">' +
            '<span title="' + MESSAGES[13] + '">' + MESSAGES[13] + '</span>' +
            '</div>' +
            '</div>';

        // Main
        var html = '' +
            '<div id="systemStats" class="container col-md-12 col-lg-12">' +
            '<div class="fill-height row row-eq-height">' +
            '<div id="stats-text" class="col-md-3 col-lg-3">' +
            '<ul></ul>' +
            '</div>' +
            '<div id="stats-graph" class="col-md-9 col-lg-9">' +
            '<ul></ul>' +
            '</div>' +
            '</div>' +
            '</div>';

        // Footer
        html += '</div>';

        $('#main-title').html(html_title);
        $('#main-title').show();
        $('#main').html(html);

        printSystemStats(data);

        var statusIntervalID = setInterval(function () {
            $.when(getSystemStats()).done(function (data) {
                updateStatus(statusIntervalID, data);
            }).fail(function (message) {
                // Cannot get status
                addModalError(message);
                clearInterval(statusIntervalID);
            });
        }, 5000);

        bodyAddClass('status');

    }).fail(function (message) {
        addModalError(message);
    });


});

// Add a user
$(document).on('click', '.action-useradd', function (e) {
    logger(1, 'DEBUG: action = useradd');
    printFormUser('add', {});
});

// Edit a user
$(document).on('dblclick', '.action-useredit', function (e) {
    logger(1, 'DEBUG: action = useredit');
    $.when(getUsers($(this).attr('data-path'))).done(function (user) {
        // Got user
        printFormUser('edit', user);
    }).fail(function (message) {
        // Cannot get user
        addModalError(message);
    });
});

// Load user management page
$(document).on('click', '.action-update', function (e) {
    logger(1, 'DEBUG: action = update');
    addMessage('info', MESSAGES[133], true);
    $.when(update()).done(function (message) {
        // Got user
        addMessage('success', message, true);
    }).fail(function (message) {
        // Cannot get user
        addMessage('alert', message, true);
    });
});


// Load user management page
$(document).on('click', '.action-usermgmt', function (e) {
    bodyAddClass('users');
    logger(1, 'DEBUG: action = usermgmt');
    printUserManagement();
});

// Show status
$(document).on('click', '.action-status', function (e) {
    logger(1, 'DEBUG: action = show status');
    $.when(getSystemStats(),getCluster()).done(function (data,clusterdata) {

        // Body
        var html = '<div id="statusModal" class="container col-md-12 col-lg-12">' +
            '<div class="fill-height row row-eq-height">' +
            '<div id="stats-text" class="col-md-3 col-lg-3">' +
            '<ul></ul>' +
            '</div>' +
            '<div id="stats-graph" class="col-md-9 col-lg-9">' +
            '<ul></ul>' +
            '</div>' +
            '</div>' +
            '</div>';

        addModalWide("STATUS", html, '');
        drawStatusInModal(data,clusterdata);

    }).fail(function (message) {
        // Cannot get status
        addModalError(message);
    });

    var statusModalIntervalID = setInterval(function () {
        $.when(getSystemStats(),getCluster()).done(function (data,clusterdata) {
            updateStatusInModal(statusModalIntervalID, data, clusterdata);
        }).fail(function (message) {
            // Cannot get status
            addModalError(message);
            clearInterval(statusModalIntervalID);
        });
    }, 5000);
});

/***************************************************************************
 * Submit
 **************************************************************************/

// Submit folder form
$(document).on('submit', '#form-folder-add, #form-folder-rename', function (e) {
    e.preventDefault();  // Prevent default behaviour
    var form_data = form2Array('folder');
    if ($(this).attr('id') == 'form-folder-add') {
        logger(1, 'DEBUG: posting form-folder-add form.');
        var url = '/api/folders';
        var type = 'POST';
    } else {
        logger(1, 'DEBUG: posting form-folder-rename form.');
        form_data['path'] = (form_data['path'] == '/') ? '/' + form_data['name'] : form_data['path'] + '/' + form_data['name'];
        var url = '/api/folders' + form_data['original'];
        var type = 'PUT';
    }
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: JSON.stringify(form_data),
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: folder "' + form_data['name'] + '" added.');
                // Close the modal
                $(e.target).parents('.modal').attr('skipRedraw', true);
                $(e.target).parents('.modal').modal('hide');
                // Reload the folder list
                printPageLabList(form_data['path']);
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                addModal('ERROR', '<p>' + data['message'] + '</p>', '<button type="button" class="btn btn-success" data-dismiss="modal">Close</button>');
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            addModal('ERROR', '<p>' + message + '</p>', '<button type="button" class="btn btn-success" data-dismiss="modal">Close</button>');
        }
    });
    return false;  // Stop to avoid POST
});

// Submit import form
$(document).on('submit', '#form-import', function (e) {
    e.preventDefault();  // Prevent default behaviour
    var form_data = new FormData();
    var form_name = 'import';
    var url = '/api/import';
    var type = 'POST';
    // Setting options: cannot use form2Array() because not using JSON to send data
    $('form :input[name^="' + form_name + '["]').each(function (id, object) {
        // INPUT name is in the form of "form_name[value]", get value only
        form_data.append($(this).attr('name').substr(form_name.length + 1, $(this).attr('name').length - form_name.length - 2), $(this).val());
    });
    // Add attachments
    $.each(ATTACHMENTS, function (key, value) {
        form_data.append(key, value);
    });
    $.ajax({
        cache: false,
        timeout: LONGTIMEOUT,
        type: type,
        url: encodeURI(url),
        contentType: false, // Set content type to false as jQuery will tell the server its a query string request
        processData: false, // Don't process the files
        dataType: 'json',
        data: form_data,
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: labs imported.');
                // Close the modal
                $(e.target).parents('.modal').attr('skipRedraw', true);
                $(e.target).parents('.modal').modal('hide');
                // Reload the folder list
                printPageLabList($('#list-folders').attr('data-path'));
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                addModal('ERROR', '<p>' + data['message'] + '</p>', '<button type="button" class="btn btn-success" data-dismiss="modal">Close</button>');
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            addModal('ERROR', '<p>' + message + '</p>', '<button type="button" class="btn btn-success" data-dismiss="modal">Close</button>');
        }
    });
    return false;  // Stop to avoid POST
});

// Submit lab form
$(document).on('submit', '#form-lab-add, #form-lab-edit', function (e) {
    e.preventDefault();  // Prevent default behaviour
    var lab_filename = $('#lab-viewport').attr('data-path');
    var form_data = form2Array('lab');
    if ($(this).attr('id') == 'form-lab-add') {
        logger(1, 'DEBUG: posting form-lab-add form.');
        var url = '/api/labs';
        var type = 'POST';
    } else {
        logger(1, 'DEBUG: posting form-lab-edit form.');
        var url = '/api/labs' + form_data['path'];
        var type = 'PUT';
    }

    if ($(this).attr('id') == 'form-node-add') {
        // If adding need to manage multiple add
        if (form_data['count'] > 1) {
            form_data['postfix'] = 1;
        } else {
            form_data['postfix'] = 0;
        }
    } else {
        // If editing need to post once
        form_data['count'] = 1;
        form_data['postfix'] = 0;
    }

    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: JSON.stringify(form_data),
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: lab "' + form_data['name'] + '" saved.');
                // Close the modal
                $(e.target).parents('.modal').attr('skipRedraw', true);
                $(e.target).parents('.modal').modal('hide');
                if (type == 'POST') {
                    // Reload the lab list
                    logger(1, 'DEBUG: lab "' + form_data['name'] + '" renamed.');
                    printPageLabList(form_data['path']);
                } else if (basename(form_data['path']) != form_data['name'] + '.unl') {
                    // Lab has been renamed, need to close it.
                    logger(1, 'DEBUG: lab "' + form_data['name'] + '" renamed.');
                    if ($('#lab-viewport').length) {
                        $('#lab-viewport').attr({'data-path': dirname(form_data['path']) + '/' + form_data['name'] + '.unl'});
                        printLabTopology();
                    } else {
                        $.when(closeLab()).done(function () {
                            postLogin();
                            printLabPreview(dirname(form_data['path']) + '/' + form_data['name'] + '.unl');
                        }).fail(function (message) {
                            addModalError(message);
                        });

                    }

                } else {
                    addMessage(data['status'], data['message']);
		    // refresh lab info
		    getLabInfo($('#lab-viewport').attr('data-path'));
                }
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                addModal('ERROR', '<p>' + data['message'] + '</p>', '<button type="button" class="btn btn-success" data-dismiss="modal">Close</button>');
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            addModal('ERROR', '<p>' + message + '</p>', '<button type="button" class="btn btn-success" data-dismiss="modal">Close</button>');
        }
    });
    return false;  // Stop to avoid POST
});


// Submit Link quality form

$(document).on('submit', '.edit-link-quality-form', function (e) {
   e.preventDefault();  // Prevent default behaviour
   $('.frameoverlay').css('width','calc( 100% - 20px)')
   var form_data = form2Array('link');
   var lab_filename = $('#lab-viewport').attr('data-path');
   var promises = [];
   var url = '/api/labs' + lab_filename + '/quality';
   var type = 'PUT';

    var request = $.ajax({
            cache: false,
            timeout: TIMEOUT,
            type: type,
            url: encodeURI(url),
            dataType: 'json',
            data: JSON.stringify(form_data),
            success: function (data) {
                if (data['status'] == 'success') {
                    logger(1, 'DEBUG: network "' + form_data['name'] + '" saved.');
                    addMessage(data['status'], data['message']);
		    // update endpoint
		    if ( form_data['source_delay'] != 0 || form_data['source_jitter'] != 0 ||form_data['source_loss'] != 0 ||form_data['source_bandwidth'] != 0 ) {
                            $(".endpoint_node"+form_data['source']+'_'+form_data['source_interfaceId']).addClass('traffictc')
                    } else {
                            $(".endpoint_node"+form_data['source']+'_'+form_data['source_interfaceId']).removeClass('traffictc')
                    }
                    if ( form_data['destination_delay'] != 0 || form_data['destination_jitter'] != 0 ||form_data['destination_loss'] != 0 ||form_data['destination_bandwidth'] != 0 ) {
                            $(".endpoint_node"+form_data['destination']+'_'+form_data['destination_interfaceId']).addClass('traffictc')
                            console.log ( "traffic control on " + ".endpoint_node"+form_data['destination']+'_'+form_data['destination_interfaceId'] )
                    } else {
                            $(".endpoint_node"+form_data['destination']+'_'+form_data['destination_interfaceId']).removeClass('traffictc')
                    }
                } else {
                    // Application error
                    logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                    addModal('ERROR', '<p>' + data['message'] + '</p>', '<button type="button" class="btn btn-success" data-dismiss="modal">Close</button>');
                }
            },
            error: function (data) {
                // Server error
                var message = getJsonMessage(data['responseText']);
                logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
                logger(1, 'DEBUG: ' + message);
                addModal('ERROR', '<p>' + message + '</p>', '<button type="button" class="btn btn-success" data-dismiss="modal">Close</button>');
            }
       });
        promises.push(request);

    $.when.apply(null, promises).done(function () {
                $('#edit-link-quality-form').remove();
    });
    return false ;
});

// Apply Link quality form

$(document).on('click', '.edit-link-quality-form-apply', function (e) {
   e.preventDefault();  // Prevent default behaviour
   $('.frameoverlay').css('width','calc( 100% - 20px)')
   var form_data = form2Array('link');
   form_data['save'] = 0;
   var lab_filename = $('#lab-viewport').attr('data-path');
   var promises = [];
   var url = '/api/labs' + lab_filename + '/quality';
   var type = 'PUT';

    var request = $.ajax({
            cache: false,
            timeout: TIMEOUT,
            type: type,
            url: encodeURI(url),
            dataType: 'json',
            data: JSON.stringify(form_data),
            success: function (data) {
                if (data['status'] == 'success') {
                    logger(1, 'DEBUG: network "' + form_data['name'] + '" saved.');
                    addMessage(data['status'], data['message']);
		    if ( form_data['source_delay'] != 0 || form_data['source_jitter'] != 0 ||form_data['source_loss'] != 0 ||form_data['source_bandwidth'] != 0 ) {
			    $(".endpoint_node"+form_data['source']+'_'+form_data['source_interfaceId']).addClass('traffictc')
		    } else {
			    $(".endpoint_node"+form_data['source']+'_'+form_data['source_interfaceId']).removeClass('traffictc')
		    }
                    if ( form_data['destination_delay'] != 0 || form_data['destination_jitter'] != 0 ||form_data['destination_loss'] != 0 ||form_data['destination_bandwidth'] != 0 ) {
                            $(".endpoint_node"+form_data['destination']+'_'+form_data['destination_interfaceId']).addClass('traffictc')
			    console.log ( "traffic control on " + ".endpoint_node"+form_data['destination']+'_'+form_data['destination_interfaceId'] )
                    } else {
                            $(".endpoint_node"+form_data['destination']+'_'+form_data['destination_interfaceId']).removeClass('traffictc')
                    }
                } else {
                    // Application error
                    logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                    addModal('ERROR', '<p>' + data['message'] + '</p>', '<button type="button" class="btn btn-success" data-dismiss="modal">Close</button>');
                }
            },
            error: function (data) {
                // Server error
                var message = getJsonMessage(data['responseText']);
                logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
                logger(1, 'DEBUG: ' + message);
                addModal('ERROR', '<p>' + message + '</p>', '<button type="button" class="btn btn-success" data-dismiss="modal">Close</button>');
            }
       });

        promises.push(request);

    return false ;
});

// Submit link style

$(document).on('submit', '.edit-network-style-form', function (e) {
    e.preventDefault();  // Prevent default behaviour
    var form_data = form2Array('network');
    var nodeId = form_data['node'];
    var lab_filename = $('#lab-viewport').attr('data-path');
    var promises = [];
    var url = '/api/labs' + lab_filename + '/nodes/' + nodeId + '/style';
    var type = 'PUT';

    var request = $.ajax({
            cache: false,
            timeout: TIMEOUT,
            type: type,
            url: encodeURI(url),
            dataType: 'json',
            data: JSON.stringify(form_data),
            success: function (data) {
                if (data['status'] == 'success') {
                    logger(1, 'DEBUG: network "' + form_data['name'] + '" saved.');
                    addMessage(data['status'], data['message']);
                } else {
                    // Application error
                    logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                    addModal('ERROR', '<p>' + data['message'] + '</p>', '<button type="button" class="btn btn-success" data-dismiss="modal">Close</button>');
                }
            },
            error: function (data) {
                // Server error
                var message = getJsonMessage(data['responseText']);
                logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
                logger(1, 'DEBUG: ' + message);
                addModal('ERROR', '<p>' + message + '</p>', '<button type="button" class="btn btn-success" data-dismiss="modal">Close</button>');
            }
       });
        promises.push(request);

    $.when.apply(null, promises).done(function () {
                $('#edit-network-style-form').remove();
    });
    return false ;
});

//Submit line style

$(document).on('submit', '.edit-line-style-form', function (e) {
    e.preventDefault();  // Prevent default behaviour
    var form_data = form2Array('line');
    var id = form_data['id'];
    var lab_filename = $('#lab-viewport').attr('data-path');
    var promises = [];
    var url = '/api/labs' + lab_filename + '/lineobjects/' + id;
    var type = 'PUT';

    var request = $.ajax({
            cache: false,
            timeout: TIMEOUT,
            type: type,
            url: encodeURI(url),
            dataType: 'json',
            data: JSON.stringify(form_data),
            success: function (data) {
                if (data['status'] == 'success') {
                    logger(1, 'DEBUG: network "' + form_data['name'] + '" saved.');
                    addMessage(data['status'], data['message']);
                } else {
                    // Application error
                    logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                    addModal('ERROR', '<p>' + data['message'] + '</p>', '<button type="button" class="btn btn-success" data-dismiss="modal">Close</button>');
                }
            },
            error: function (data) {
                // Server error
                var message = getJsonMessage(data['responseText']);
                logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
                logger(1, 'DEBUG: ' + message);
                addModal('ERROR', '<p>' + message + '</p>', '<button type="button" class="btn btn-success" data-dismiss="modal">Close</button>');
            }
       });
        promises.push(request);

    $.when.apply(null, promises).done(function () {
                $('#edit-line-style-form').remove();
    });
    return false ;
});


$(document).on('submit', '#form-network-manage', function (e) {
	 e.preventDefault();  // Prevent default behaviour
	 var promises = [];
	 var lab_filename = $('#lab-viewport').attr('data-path');
	 var form_data = form2Array('network');
	 console.log ( JSON.stringify(form_data) )
	 console.log ( form_data['count'] )
	 //create correct data
	 var manage_data = {} ;
	 manage_data['network'] = form_data['id']
	 manage_data['smart'] = form_data['smart']
	 manage_data['vlan8021ad'] = form_data['vlan8021ad']
	 manage_data['port'] = {} ;
	 for ( i = 0 ; i < form_data['count']; i++ ) {
		 manage_data['port'][i] = {}
		 manage_data['port'][i]['NodeId'] = form_data['NodeId_' + i]
		 manage_data['port'][i]['NodeName'] = form_data['NodeName_' + i]
		 manage_data['port'][i]['IfId'] = form_data['IfId_' + i]
		 manage_data['port'][i]['IfName'] = form_data['IfName_' + i]
		 manage_data['port'][i]['Vlan'] = form_data['Vlan_' + i]
	 }
	console.log ( JSON.stringify(manage_data) )
	logger(1, 'DEBUG: posting form-network-add form.');
        var url = '/api/labs' + lab_filename + '/network/manage';
        var type = 'PUT';
        var request = $.ajax({
            cache: false,
            timeout: TIMEOUT,
            type: type,
            url: encodeURI(url),
            dataType: 'json',
            data: JSON.stringify(manage_data),
            success: function (data) {
		if (data['status'] == 'success') {
			//TODO
		} else {
			//TODO
		}
	    },
            error: function (data) {
		    //TODO
	    }
	});
	promises.push(request);

	// Close the modal
                    $('#body').children('.modal').attr('skipRedraw', true);
                    $('#body').children('.modal.second-win').modal('hide');
                    $('#body').children('.modal.fade.in').focus();
});

// Submit network form
$(document).on('submit', '#form-network-add, #form-network-edit', function (e) {
    e.preventDefault();  // Prevent default behaviour
    var form_id =  $(this).attr('id')
    var lab_filename = $('#lab-viewport').attr('data-path');
    var form_data = form2Array('network');
    var promises = [];
    if ($(this).attr('id') == 'form-network-add') {
        logger(1, 'DEBUG: posting form-network-add form.');
        var url = '/api/labs' + lab_filename + '/networks';
        var type = 'POST';
    } else {
        logger(1, 'DEBUG: posting form-network-edit form.');
        var url = '/api/labs' + lab_filename + '/networks/' + form_data['id'];
        var type = 'PUT';
    }

    if ($(this).attr('id') == 'form-network-add') {
        // If adding need to manage multiple add
        if (form_data['count'] > 1) {
            form_data['postfix'] = 1;
        } else {
            form_data['postfix'] = 0;
        }
    } else {
        // If editing need to post once
        form_data['count'] = 1;
        form_data['postfix'] = 0;
    }
    w = Math.trunc( Math.sqrt( form_data['count'] ))
    initLeft = form_data['left']
    initTop = form_data['top']
    for (var i = 0; i < form_data['count']; i++) {
        form_data['left'] = Number(initLeft)  + ( Math.trunc( i % w )   * 60 )
        form_data['top'] = Number(initTop)  + ( Math.trunc( i / w )  * 80 )
        
	
        var request = $.ajax({
            cache: false,
            timeout: TIMEOUT,
            type: type,
            url: encodeURI(url),
            dataType: 'json',
            data: JSON.stringify(form_data),
            success: function (data) {
                if (data['status'] == 'success') {
			 //console.log("%o", data )
                    logger(1, 'DEBUG: network "' + form_data['name'] + '" saved.');
                    $(".network" + form_data['id'] + " td:nth-child(2)").text(form_data['name']);
                    $(".network" + form_data['id'] + " td:nth-child(3)").text(form_data['type']);

                    // Close the modal
                    $('#body').children('.modal').attr('skipRedraw', true);
                    $('#body').children('.modal.second-win').modal('hide');
                    $('#body').children('.modal.fade.in').focus();
                    addMessage(data['status'], data['message']);
	            
		    if ( type == 'POST' ) { //add network
			    network_id = data.data['id'] 
			    network_left = JSON.parse( this.data ).left
			    network_top =  JSON.parse( this.data ).top
			    network_icon = form_data['icon']
			    network_name = form_data['name'] + ( form_data['count'] == 1 ? '' : network_id )
			    logger(1,'Type = ' + form_data['type'])
			    network_smart = ( $.inArray(form_data['type'],['bridge','internal','internal2','internal3']) > -1 ? 0 : -1 )
			    renderNetwork(network_id, network_left, network_top, network_icon, network_name, network_smart)
		    } else { // Edit Network
			    network_id =  form_data['id']
			    network_name = form_data['name']
			    network_icon = form_data['icon']
			    $('#network' + network_id).data("name",network_name)
			    $('#network' + network_id).attr("data-name",network_name)
			    $('#network' + network_id + '> img').attr('src','/images/net_icons/' + network_icon)
			    $('#network' + network_id + ' > .network_name').text(network_name)
			    // refresh name
			    // refresh icon
		    }

                } else {
                    // Application error
                    logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                    addModal('ERROR', '<p>' + data['message'] + '</p>', '<button type="button" class="btn btn-success" data-dismiss="modal">Close</button>');
                }
            },
            error: function (data) {
                // Server error
                var message = getJsonMessage(data['responseText']);
                logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
                logger(1, 'DEBUG: ' + message);
                addModal('ERROR', '<p>' + message + '</p>', '<button type="button" class="btn btn-success" data-dismiss="modal">Close</button>');
            }
        });
        promises.push(request);
    }

    $.when.apply(null, promises).done(function () {
            //printLabTopology();
    });
    return false;  // Stop to avoid POST
});

// Submit node interfaces form
$(document).on('submit', '#form-node-connect', function (e) {
    e.preventDefault();  // Prevent default behaviour
    var lab_filename = $('#lab-viewport').attr('data-path');
    var form_data = form2Array('interfc');
    var node_id = $('form :input[name="node_id"]').val();
    var url = '/api/labs' + lab_filename + '/nodes/' + node_id + '/interfaces';
    var type = 'PUT';
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: JSON.stringify(form_data),
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: node "' + node_id + '" saved.');
                // Close the modal
                $('#body').children('.modal').attr('skipRedraw', true);
                $('#body').children('.modal.second-win').modal('hide');
                $('#body').children('.modal.fade.in').focus();
                addMessage(data['status'], data['message']);
                printLabTopology();
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                addModal('ERROR', '<p>' + data['message'] + '</p>', '<button type="button" class="btn btn-success" data-dismiss="modal">Close</button>');
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            addModal('ERROR', '<p>' + message + '</p>', '<button type="button" class="btn btn-success" data-dismiss="modal">Close</button>');
        }
    });
});


// Submit node form API Side
$(document).on('submit', '#form-node-add, #form-node-edit', function (e) {
    e.preventDefault();  // Prevent default behaviour
    var self = $(this);
    var lab_filename = $('#lab-viewport').attr('data-path');
    var form_data = form2Array('node');
    var promises = [];
    if ( form_data['template'] == "" ) {
          return false;
    }

    if ($(this).attr('id') == 'form-node-add') {
        logger(1, 'DEBUG: posting form-node-add form.');
        var url = '/api/labs' + lab_filename + '/nodes';
        var type = 'POST';
    } else {
        logger(1, 'DEBUG: posting form-node-edit form.');
        var url = '/api/labs' + lab_filename + '/nodes/' + form_data['id'];
        var type = 'PUT';
    }


    if ($(this).attr('id') == 'form-node-add') {
        // If adding need to manage multiple add
        if (form_data['count'] > 1) {
            form_data['postfix'] = 1;
            form_data['numberNodes'] = form_data['count']
        } else {
            form_data['postfix'] = 0;
        }
    } else {
        // If editing need to post once
        form_data['count'] = 1;
        form_data['postfix'] = 0;
    }
       //console.log('form_data: %o', form_data )
       var request = $.ajax({
            cache: false,
            timeout: TIMEOUT,
            type: type,
            url: encodeURI(url),
            dataType: 'json',
            data: JSON.stringify(form_data),
            success: function (data) {
                if (data['status'] == 'success') {
                    logger(1, 'DEBUG: node "' + form_data['name'] + '" saved.');
                    // Close the modal
                    $('#body').children('.modal').attr('skipRedraw', true);
                    $('#body').children('.modal.second-win').modal('hide');
                    $('#body').children('.modal.fade.in').focus();
                    addMessage(data['status'], data['message']);
                    $(".modal .node" + form_data['id'] + " td:nth-child(2)").text(form_data["name"]);
                    $(".modal .node" + form_data['id'] + " td:nth-child(3)").text(form_data["template"]);
                    $(".modal .node" + form_data['id'] + " td:nth-child(4)").text(form_data["image"]);
                    $(".modal .node" + form_data['id'] + " td:nth-child(5)").text(form_data["cpu"]);
                    $(".modal .node" + form_data['id'] + " td:nth-child(7)").text(form_data["nvram"]);
                    $(".modal .node" + form_data['id'] + " td:nth-child(8)").text(form_data["ram"]);
                    $(".modal .node" + form_data['id'] + " td:nth-child(9)").text(form_data["ethernet"]);
                    $(".modal .node" + form_data['id'] + " td:nth-child(10)").text(form_data["serial"]);
                    $(".modal .node" + form_data['id'] + " td:nth-child(11)").text(form_data["console"]);

                    $("#node" + form_data['id'] + " .node_name").html('<i class="node' + form_data['id'] + '_status glyphicon glyphicon-stop"></i>' + form_data['name'])
                    $("#node" + form_data['id'] + " a img").attr("src", "/images/icons/" + form_data['icon'])

                    $("#form-node-edit-table input[name='node[name]'][data-path='" + form_data['id'] + "']").val(form_data["name"])
                    $("#form-node-edit-table select[name='node[image]'][data-path='" + form_data['id'] + "']").val(form_data["image"])
                    $("#form-node-edit-table input[name='node[cpu]'][data-path='" + form_data['id'] + "']").val(form_data["cpu"])
                    $("#form-node-edit-table input[name='node[nvram]'][data-path='" + form_data['id'] + "']").val(form_data["nvram"])
                    $("#form-node-edit-table input[name='node[serial]'][data-path='" + form_data['id'] + "']").val(form_data["serial"])
                    $("#form-node-edit-table input[name='node[ethernet]'][data-path='" + form_data['id'] + "']").val(form_data["ethernet"])
                    $("#form-node-edit-table select[name='node[console]'][data-path='" + form_data['id'] + "']").val(form_data["console"])
                    $("#form-node-edit-table select[name='node[icon]'][data-path='" + form_data['id'] + "']").val(form_data["icon"])
		    if ( type == 'POST' ) { // add node
			    w = Math.trunc( Math.sqrt( form_data['count'] ))
			    for ( i=0 ; i < Number(form_data['count']) ; i++ ) {
				    node_id=( form_data['count'] == 1 ? data.data['id'] : data.data['id'][i])
				    node_left=Number(form_data['left'])  + ( Math.trunc( i % w )   * 60 )
				    node_top=Number(form_data['top'])  + ( Math.trunc( i / w )  * 80 )
				    node_icon=form_data['icon']
				    node_type=form_data['type']
				    node_name=( form_data['count'] == 1 ? form_data['name'] : form_data['name'] + data.data['id'][i] )
				    console.log( 'top: ' + node_top + ',left: ' + node_left )
				    renderNode(node_id, node_left, node_top, node_icon, node_type, node_name)
			    }
		    } else { // edit node
			    //renderNode(data['id'],) 
			   node_id=form_data['id']
			   //console.log("%o #framewrap" + data['id'], data)
			    //$("#node" + node_id + " > .node_name").empty()
			    $("#node" + node_id + " > .node_name").html('<i class="node'+ node_id +'_status glyphicon glyphicon-stop"></i> '+form_data['name'])
			    $("#framewrap" + node_id).data('name', form_data['name'])
			    $("#framewrap" + node_id).attr('data-name', form_data['name'])
			    $("#framewrap" + node_id + " > iframe.consoleframe").attr('name', form_data['name']+"_"+node_id)
			    $("#framewrap" + node_id + " > span").text(form_data['name'])
			    $('#node' + node_id + '> img').attr('src','/images/icons/' + form_data['icon'])
		    }
                    //printLabTopology();
                } else {
                    // Application error
                    logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                    addModal('ERROR', '<p>' + data['message'] + '</p>', '<button type="button" class="btn btn-success" data-dismiss="modal">Close</button>');
                }
            },
            error: function (data) {
                // Server error
                var message = getJsonMessage(data['responseText']);
                logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
                logger(1, 'DEBUG: ' + message);
                addModal('ERROR', '<p>' + message + '</p>', '<button type="button" class="btn btn-success" data-dismiss="modal">Close</button>');
            }
        });
        $.when.apply(request).done(function () {
            //usleep ( form_data['count'] * 10000 )
            //printLabTopology();
        });
    return false ;
});

// Submit node form
$(document).on('submit', '#oldform-node-add, #oldform-node-edit', function (e) {
    e.preventDefault();  // Prevent default behaviour
    var self = $(this);
    var lab_filename = $('#lab-viewport').attr('data-path');
    var form_data = form2Array('node');
    var promises = [];
    if ($(this).attr('id') == 'form-node-add') {
        logger(1, 'DEBUG: posting form-node-add form.');
        var url = '/api/labs' + lab_filename + '/nodes';
        var type = 'POST';
    } else {
        logger(1, 'DEBUG: posting form-node-edit form.');
        var url = '/api/labs' + lab_filename + '/nodes/' + form_data['id'];
        var type = 'PUT';
    }

    if ($(this).attr('id') == 'form-node-add') {
        // If adding need to manage multiple add
        if (form_data['count'] > 1) {
            form_data['postfix'] = 1;
        } else {
            form_data['postfix'] = 0;
        }
    } else {
        // If editing need to post once
        form_data['count'] = 1;
        form_data['postfix'] = 0;
    }

    var inititalLeft = form_data['left']
    var inititalTop  = form_data['top']
    for (var i = 0, j = 0; i < form_data['count']; i++) {
        if( i > 0 && i%5 == 0){
            j++
        }
        form_data['left'] = +inititalLeft + i%5 * 60;
        form_data['top'] = +inititalTop + j * 80;
        var request = $.ajax({
            cache: false,
            timeout: TIMEOUT,
            type: type,
            url: encodeURI(url),
            dataType: 'json',
            data: JSON.stringify(form_data),
            success: function (data) {
                if (data['status'] == 'success') {
                    logger(1, 'DEBUG: node "' + form_data['name'] + '" saved.');
                    // Close the modal
                    $('#body').children('.modal').attr('skipRedraw', true);
                    $('#body').children('.modal.second-win').modal('hide');
                    $('#body').children('.modal.fade.in').focus();
                    addMessage(data['status'], data['message']);
                    $(".modal .node" + form_data['id'] + " td:nth-child(2)").text(form_data["name"]);
                    $(".modal .node" + form_data['id'] + " td:nth-child(3)").text(form_data["template"]);
                    $(".modal .node" + form_data['id'] + " td:nth-child(4)").text(form_data["image"]);
                    $(".modal .node" + form_data['id'] + " td:nth-child(5)").text(form_data["cpu"]);
                    $(".modal .node" + form_data['id'] + " td:nth-child(7)").text(form_data["nvram"]);
                    $(".modal .node" + form_data['id'] + " td:nth-child(8)").text(form_data["ram"]);
                    $(".modal .node" + form_data['id'] + " td:nth-child(9)").text(form_data["ethernet"]);
                    $(".modal .node" + form_data['id'] + " td:nth-child(10)").text(form_data["serial"]);
                    $(".modal .node" + form_data['id'] + " td:nth-child(11)").text(form_data["console"]);

                    $("#node" + form_data['id'] + " .node_name").html('<i class="node' + form_data['id'] + '_status glyphicon glyphicon-stop"></i>' + form_data['name'])
                    $("#node" + form_data['id'] + " a img").attr("src", "/images/icons/" + form_data['icon'])

                    $("#form-node-edit-table input[name='node[name]'][data-path='" + form_data['id'] + "']").val(form_data["name"])
                    $("#form-node-edit-table select[name='node[image]'][data-path='" + form_data['id'] + "']").val(form_data["image"])
                    $("#form-node-edit-table input[name='node[cpu]'][data-path='" + form_data['id'] + "']").val(form_data["cpu"])
                    $("#form-node-edit-table input[name='node[nvram]'][data-path='" + form_data['id'] + "']").val(form_data["nvram"])
                    $("#form-node-edit-table input[name='node[serial]'][data-path='" + form_data['id'] + "']").val(form_data["serial"])
                    $("#form-node-edit-table input[name='node[ethernet]'][data-path='" + form_data['id'] + "']").val(form_data["ethernet"])
                    $("#form-node-edit-table select[name='node[console]'][data-path='" + form_data['id'] + "']").val(form_data["console"])
                    $("#form-node-edit-table select[name='node[icon]'][data-path='" + form_data['id'] + "']").val(form_data["icon"])
                } else {
                    // Application error
                    logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                    addModal('ERROR', '<p>' + data['message'] + '</p>', '<button type="button" class="btn btn-success" data-dismiss="modal">Close</button>');
                }
            },
            error: function (data) {
                // Server error
                var message = getJsonMessage(data['responseText']);
                logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
                logger(1, 'DEBUG: ' + message);
                addModal('ERROR', '<p>' + message + '</p>', '<button type="button" class="btn btn-success" data-dismiss="modal">Close</button>');
            }
        });
        promises.push(request);
    }

    $.when.apply(null, promises).done(function () {
        //if (self.attr('id') == 'form-node-add') {
            printLabTopology();
        //}
    });
    return false;  // Stop to avoid POST
});

// submit nodeList form by input focusout
$(document).on('focusout', '.configured-nodes-input', function(e){
    e.preventDefault();  // Prevent default behaviour
    var id = $(this).attr('data-path')
    $('input[data-path='+id+'][name="node[type]"]').parent().removeClass('node-editing')
    if(!$(this).attr("readonly")){
        setNodeData(id);
    }
});


$(document).on('focusout', '.configured-nodes-select', function(e){
    console.log("here")
    var id = $(this).attr('data-path')
    $('input[data-path='+id+'][name="node[type]"]').parent().removeClass('node-editing')
})


// submit nodeList form
$(document).on('change', '.configured-nodes-select', function(e){
    e.preventDefault();  // Prevent default behaviour
    var id = $(this).attr('data-path')
    //alert ( $(this).prop('disabled') ) ;
    if ( $(this).prop('disabled') === true ) { return }
    setNodeData(id);
});

// highlight nodeList form row
$(document).on('focus', '.configured-nodes-select, .configured-nodes-input', function(e){
    var id = $(this).attr('data-path')
    $('input[data-path='+id+'][name="node[type]"]').parent().addClass('node-editing')
})


// Submit config form
$(document).on('submit', '#form-node-config', function (e) {
    e.preventDefault();  // Prevent default behaviour

    if($('#toggle_editor').is(':checked')) {
        var editor_data = ace.edit('editor').getValue();
        $('#nodeconfig').val(editor_data);
        //$('#nodeconfig').show()
        console.log($('#nodeconfig').val())
    }
    //saveLab('form-node-config');
    saveEditorLab('form-node-config', true, window.cur_cfs)
});

// Submit login form
$(document).on('submit', '#form-login', function (e) {
    e.preventDefault();  // Prevent default behaviour
    var form_data = form2Array('login');
    var url = '/api/auth/login';
    var type = 'POST';
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: JSON.stringify(form_data),
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: user is authenticated.');
                // Close the modal
                $(e.target).parents('.modal').attr('skipRedraw', true);
                $(e.target).parents('.modal').modal('hide');
                $.when(getUserInfo()).done(function () {
                    // User is authenticated
                    logger(1, 'DEBUG: user authenticated.');
                    postLogin();
                }).fail(function () {
                    // User is not authenticated, or error on API
                    logger(1, 'DEBUG: loading authentication page.');
                    printPageAuthentication();
                });
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                addModal('ERROR', '<p>' + data['message'] + '</p>', '<button type="button" class="btn btn-success" data-dismiss="modal">Close</button>');
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            addModal('ERROR', '<p>' + message + '</p>', '<button type="button" class="btn btn-success" data-dismiss="modal">Close</button>');
        }
    });
    return false;  // Stop to avoid POST
});

// Submit user form
$(document).on('submit', '#form-user-add, #form-user-edit', function (e) {
    e.preventDefault();  // Prevent default behaviour
    var form_data = form2Array('user');
    // Converting data
    if (form_data['expiration'] == '') {
        form_data['expiration'] = -1;
    } else {
        form_data['expiration'] = Math.floor($.datepicker.formatDate('@', new Date(form_data['expiration'])) / 1000);
    }
    if (form_data['pexpiration'] == '') {
        form_data['pexpiration'] = -1;
    } else {
        form_data['pexpiration'] = Math.floor($.datepicker.formatDate('@', new Date(form_data['pexpiration'])) / 1000);
    }
    if (form_data['pod'] == '') {
        form_data['pod'] = -1;
    }

    var username = form_data['username'];
    if ($(this).attr('id') == 'form-user-add') {
        logger(1, 'DEBUG: posting form-user-add form.');
        var url = '/api/users';
        var type = 'POST';
    } else {
        logger(1, 'DEBUG: posting form-user-edit form.');
        var url = '/api/users/' + username;
        var type = 'PUT';
    }
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: JSON.stringify(form_data),
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: user "' + username + '" saved.');
                // Close the modal
                $(e.target).parents('.modal').attr('skipRedraw', true);
                $(e.target).parents('.modal').modal('hide');
                // Reload the user list
                printUserManagement();
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                addModal('ERROR', '<p>' + data['message'] + '</p>', '<button type="button" class="btn btn-success" data-dismiss="modal">Close</button>');
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            addModal('ERROR', '<p>' + message + '</p>', '<button type="button" class="btn btn-success" data-dismiss="modal">Close</button>');
        }
    });
    return false;  // Stop to avoid POST
});

// Edit picture form
$('body').on('submit', '#form-picture-edit', function (e) {
    e.preventDefault();  // Prevent default behaviour
    var picture_id = $(this).attr('data-path');
    var missed_id = []
    var regex = /{{(NODE([0-9]*))}}/g;
    var temp;
    var str = $('form :input[name="picture[map]"]').val()
    $.when(getNodes(null)).then(function (nodes) {
        while (temp = regex.exec(str)) {
            if(temp[2] && !nodes.hasOwnProperty(temp[2])) missed_id.push(temp[2])
        }

        if(missed_id.length > 0) {
            var body = '<div class="form-group">'
            if(missed_id.length > 1){
                body += '<div class="question">Nodes IDs does not exist: '+ missed_id.join(', ') +'</div>' +
                        '<div class="question">Please change it to the correct value</div>'
            } else {
                body += '<div class="question">Node ID does not exist: '+ missed_id[0] + '</div>' +
                        '<div class="question">Please change it to the correct value</div>'
            }
                body += '<div class="col-md-5 col-md-offset-3">' +
                    '<button class="btn" data-dismiss="modal">Cotinue edit picture</button>' +
                    // '<button type="button" class="btn" data-dismiss="modal">Cancel</button>' +
                '</div>' +
            '</div>'
            var title = "Warning"
            addModal(title, body, "", "make-red make-small");
        } else {
            submitPictureEdit(picture_id)
        }
    })
    // return false;
    // Setting options
});

function submitPictureEdit(picture_id){
    var lab_file = $('#lab-viewport').attr('data-path');
    var form_data = {};

    $('form :input[name^="picture["]').each(function (id, object) {
        // Standard options
        var field_name = $(this).attr('name').replace(/^picture\[([a-z]+)\]$/, '$1');
        form_data[field_name] = $(this).val();
    });
    form_data['map'] = form_data['map'] + form_data['custommap']
    form_data['custommap']=''
    // Get action URL
    var url = '/api/labs' + lab_file + '/pictures/' + picture_id;//form_data['id'];
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: 'PUT',
        url: encodeURI(url),
        dataType: 'json',
        data: JSON.stringify(form_data),
        success: function (data) {
            if (data['status'] == 'success') {
                // Fetching ok
                addMessage('SUCCESS', 'Picture "' + form_data['name'] + '" saved.');
                printPictureInForm(picture_id);
                $('ul.map a.action-pictureget[data-path="' + picture_id + '"]').attr('title', form_data['name']);
                $('ul.map a.action-pictureget[data-path="' + picture_id + '"]').text(form_data['name'].split(" ")[0]);
                $('#body').children('.modal.second-win').modal('hide');
                // Picture saved  -> reopen this page (not reload, or will be posted twice)
                // window.location.href = '/lab_edit.php' + window.location.search;
            } else {
                // Fetching failed
                addMessage('DANGER', data['status']);
            }
        },
        error: function (data) {
            addMessage('DANGER', getJsonMessage(data['responseText']));
        }
    });

    // Hide and delete the modal (or will be posted twice)
    $('#form_frame > div').modal('hide');

    // Stop or form will follow the action link
    return false;
}

// Edit picture form
$('body').on('submit', '#form-picture-delete', function (ev) {

})

/*******************************************************************************
 * Custom Shape/Text Functions
 * *****************************************************************************/

// Prevent Drag when Resize
$('body').on('mouseover','.ui-resizable-handle',function (e) {
       lab_topology.setDraggable($('.customShape'), false )
});

$('body').on('mouseleave','.ui-resizable-handle',function (e) {
       if ( LOCK==0 ) lab_topology.setDraggable($('.customShape'), true )
});
// Add Custom Shape
$('body').on('submit', '.custom-shape-form', function (e) {
    var shape_options = {}
        , shape_html
        , dashed = ''
        , dash_spase_length = '10'
        , dash_line_length = '10'
        , z_index = 999
        , radius
        , coordinates
        , current_lab
        , customShape_id = ''
        , generateName = false
        ;

    shape_options['id'] = new Date().getTime();
    shape_options['shape_type'] = $('.custom-shape-form .shape-type-select').val();
    // shape_options['shape_name'] = $('.custom-shape-form .shape_name').val();
    if(!$('.custom-shape-form .shape_name').val()){
        generateName = true;
        shape_options['shape_name'] = $('.custom-shape-form .shape-type-select').val() + customShape_id;
    } else {
        shape_options['shape_name'] = $('.custom-shape-form .shape_name').val();
    }
    shape_options['shape_border_type'] = $('.custom-shape-form .border-type-select').val();
    shape_options['shape_border_color'] = $('.custom-shape-form .shape_border_color').val();
    shape_options['shape_background_color'] = $('.custom-shape-form .shape_background_color').val();
    shape_options['shape_width/height'] = 120;
    shape_options['shape_border_width'] = $('.custom-shape-form .shape_border_width').val();
    shape_options['shape_left_coordinate'] = $('.custom-shape-form .left-coordinate').val();
    shape_options['shape_top_coordinate'] = $('.custom-shape-form .top-coordinate').val();

    coordinates = 'position:absolute;left:' + resolveZoom(shape_options['shape_left_coordinate'], 'left') + 'px;top:' + resolveZoom(shape_options['shape_top_coordinate'], 'top') + 'px;';

    if (shape_options['shape_border_type'] == 'dashed') {
        dashed = ' stroke-dasharray = "' + dash_line_length + ',' + dash_spase_length + '" '
    } else {
        dashed = ''
    }

    if (shape_options['shape_type'] == 'square' || shape_options['shape_type'] == 'square rounded' ) {
        shape_html =
            '<div id="customShape' + shape_options['id'] + '" class="customShape context-menu" data-path="' + customShape_id + '" ' +
            'style="display:inline;z-index:' + z_index + ';' + coordinates +
            'width: ' + shape_options['shape_width/height'] + 'px; height: ' + shape_options['shape_width/height'] + 'px;">' +
            //'<svg  "width="' + (shape_options['shape_width/height']+10) + '" height="' + (shape_options['shape_width/height']+10) + '">' +
            '<svg  width="100%" height="100%">' +
            '<rect x="'+shape_options['shape_border_width']+'" ' +
        'y="'+shape_options['shape_border_width']+'" '
        if (shape_options['shape_type'] == 'square rounded' )  {
        shape_html += 'rx="20" ry="20" '
        }
        shape_html += 'width="' + (shape_options['shape_width/height']-shape_options['shape_border_width']*2) + '" ' +
            'height="' + (shape_options['shape_width/height'] - shape_options['shape_border_width']*2) + '" ' +
            'fill ="' + shape_options['shape_background_color'] + '" ' +
            'stroke-width ="' + shape_options['shape_border_width'] + '" ' +
            'stroke ="' + shape_options['shape_border_color'] + '" ' + dashed +
            '/>' +
            'Sorry, your browser does not support inline SVG.' +
            '</svg>' +
            '</div>';
    shape_options['shape_type'] = 'square';
    } else if (shape_options['shape_type'] == 'circle') {
        radius = shape_options['shape_width/height'] / 2 - shape_options['shape_border_width'] / 2;

        shape_html =
            '<div id="customShape' + shape_options['id'] + '" class="customShape context-menu" data-path="' + customShape_id + '" ' +
            'style="display:inline;z-index:' + z_index + ';' + coordinates + '"' +
            'width="' + shape_options['shape_width/height'] + 'px" height="' + shape_options['shape_width/height'] + 'px" >' +
            '<svg width="' + shape_options['shape_width/height'] + '" height="' + shape_options['shape_width/height'] + '">' +
            '<ellipse cx="' + (radius + shape_options['shape_border_width'] / 2 ) + '" ' +
            'cy="' + (radius + shape_options['shape_border_width'] / 2 ) + '" ' +
            'rx="' + radius + '" ' +
            'ry="' + radius + '" ' +
            'stroke ="' + shape_options['shape_border_color'] + '" ' +
            'stroke-width="' + shape_options['shape_border_width'] / 2 + '" ' + dashed +
            'fill ="' + shape_options['shape_background_color'] + '" ' +
            '/>' +
            'Sorry, your browser does not support inline SVG.' +
            '</svg>' +
            '</div>';
    }

    current_lab = $('#lab-viewport').attr('data-path');

    // Get action URL
    var url = '/api/labs' + current_lab + '/textobjects';
    var form_data = {};

    form_data['data'] = shape_html;
    form_data['name'] = shape_options["shape_name"];
    form_data['type'] = shape_options["shape_type"];

    createTextObject(form_data).done(function (textObjData) {
        $('#lab-viewport').prepend(shape_html);

        var $added_shape = $("#customShape" + shape_options['id']);
        $added_shape
            .resizable({
                autoHide: true,
                resize: function (event, ui) {
                    textObjectResize(event, ui, shape_options);
                },
                stop: textObjectDragStop
            });
        lab_topology.setDraggable($('.node_frame, .network_frame, .customShape'), true);
        lab_topology.draggable($('.node_frame, .network_frame, .customShape'), {
            grid: [3, 3],
        });


        getTextObjects().done(function (textObjects) {
            $added_shape.attr("id", "customShape" + textObjData.id);
            $added_shape.attr("data-path", textObjData.id);
            var nameObj = generateName ? shape_options['shape_type'] + textObjData.id.toString() : shape_options['shape_name'];
            $added_shape.attr("name", nameObj);
            $added_shape.attr("data-path", textObjData.id);
            var new_data = document.getElementById($added_shape.attr("id")).outerHTML;

            editTextObject(textObjData.id, {data: new_data, name: nameObj})
            .done(function(){
                if ($("#customShape" + textObjData.id).length > 1) {
                    // reload lab
                    addMessage('warning', MESSAGES[156]);
                    //printLabTopology();
                }

                // Hide and delete the modal (or will be posted twice)
                $('#body').children('.modal').modal('hide');
                //printLabTopology();
		adjustZoom(lab_topology)
            }).fail(function(){

            });

        }).fail(function (message) {
            addMessage('DANGER', getJsonMessage(message));
        });
    }).done(function () {
        addMessage('SUCCESS', 'Lab has been saved (60023).');
    }).fail(function (message) {
        addMessage('DANGER', getJsonMessage(message));
    });

    // Stop or form will follow the action link
    return false;
});


// Add Text
$('body').on('submit', '.add-text-form', function (e) {
    var text_options = {}
        , text_html
        , coordinates
        , z_index = 1001
        , text_style = ''
        , customShape_id = ''
        , form_data = {}
        ;

    text_options['id'] = new Date().getTime();
    text_options['text_left_coordinate'] = $('.add-text-form .left-coordinate').val();
    text_options['text_top_coordinate'] = $('.add-text-form .top-coordinate').val();
    text_options['text'] = $('.add-text-form .main-text').val().replace(/\n/g, '<br>');
    text_options['alignment'] = 'center';
    text_options['vertical-alignment'] = 'top';
    text_options['color'] = $('.add-text-form .text_font_color').val();
    text_options['background-color'] = $('.add-text-form .text_background_color').val();
    text_options['text-size'] = $('.add-text-form .text_font_size').val();
    text_options['text-style'] = $('.add-text-form .text-font-style-select').val();

    if (text_options['text-style'] == 'normal') {
        text_style = 'font-weight: normal;';
    } else if (text_options['text-style'] == 'bold') {
        text_style = 'font-weight: bold;';
    } else if (text_options['text-style'] == 'italic') {
        text_style = 'font-style: italic;';
    } else {
        text_style = '';
    }

    coordinates = 'position:absolute;left:' + resolveZoom(text_options['text_left_coordinate'], 'left') + 'px;top:' + resolveZoom(text_options['text_top_coordinate'], 'top') + 'px;';

    text_html =
        '<div id="customText' + text_options['id'] + '" class="customShape customText context-menu" data-path="' + customShape_id + '" ' +
        'style="display:inline;' + coordinates + ' cursor:move; ;z-index:' + z_index + ';" >' +
        '<p align="' + text_options['alignment'] + '" style="' +
        'vertical-align:' + text_options['vertical-alignment'] + ';' +
        'color:' + text_options['color'] + ';' +
        'background-color:' + text_options['background-color'] + ';' +
        'font-size:' + text_options['text-size'] + 'px;' +
        text_style + '">' +
        text_options['text'] +
        '</p>' +
        '</div>';

    form_data['data'] = text_html;
    form_data['name'] = "txt " + ($(".customShape").length + 1);
    form_data['type'] = "text";

    createTextObject(form_data).done(function (data) {
        $('#lab-viewport').prepend(text_html);

        var $added_shape = $("#customText" + text_options['id']);
        /*
        $added_shape
            .resizable({
                autoHide: true,
                resize: function (event, ui) {
                    textObjectResize(event, ui, text_options);
                },
                stop: textObjectDragStop
            });
    */
        getTextObjects().done(function (textObjects) {
            var id = data.id;
            $added_shape.attr("id", "customText" + id);
            $added_shape.attr("data-path", id);

            if ($("#customText" + id).length > 1) {
                addMessage('warning', MESSAGES[156]);
                //printLabTopology();
            }

            // Hide and delete the modal (or will be posted twice)
                lab_topology.setDraggable($('.node_frame, .network_frame, .customShape'), true);
                lab_topology.draggable($('.node_frame, .network_frame, .customShape'), {
                        grid: [3, 3],
                });
            $('#body').children('.modal').modal('hide');
            //printLabTopology();
        }).fail(function (message) {
            addMessage('DANGER', getJsonMessage(message));
        });
    }).done(function () {
        addMessage('SUCCESS', 'Lab has been saved (60023).');
    }).fail(function (message) {
        addMessage('DANGER', getJsonMessage(message));
    });

    return false;
});


// Add line  Submit

$('body').on('submit', '.add-line-form', function (e) {
 var $labViewport = $("#lab-viewport")
 e.preventDefault();
 e.stopPropagation();
 var form_data = form2Array('line');
 var id =  new Date().getTime();
 $.when( addLineObject( form_data ) ).done ( function (id) {
     // Draw line
     var line='<div id="startLine'+id+'" style="z-index: 12000 ;position: absolute; width: 20px; height: 20px;cursor: move;" class="line"></div>'
     line += '<div id="endLine'+id+'" style="z-index: 12000; position: absolute; width: 20px; height: 20px;cursor: move;" class="line"></div>'
     $labViewport.append(line);
     $('#startLine'+id).css('top',form_data['x1']+'px')
     $('#startLine'+id).css('left',form_data['y1']+'px')
     $('#endLine'+id).css('top',form_data['x2']+'px')
     $('#endLine'+id).css('left',form_data['y2']+'px')
     var width = form_data['width'] ;
     var color = form_data['color'] ;
     var e1 = lab_topology.addEndpoint('startLine' + id);
     var e2 = lab_topology.addEndpoint('endLine' + id);
     lab_topology.draggable('startLine' + id, {
                       grid: [3, 3],
                    });
     lab_topology.draggable('endLine' + id, {
                       grid: [3, 3],
                    });
     //alert ( JSON.stringify( e1 ) )
        if ( $(".line-paintstyle-select").val() == 'Solid' ) {
                dash = '""'
        } else {
                dash = "2 4"  ;
        }
     var tmp_conn = lab_topology.connect({ source: e1,
            target: e2,
            paintStyle: {strokeWidth: width , stroke: color, dashstyle: dash }
            //overlays:[
            //	["Arrow" , { width: width*3, length:width*3, location:1, direction: 1 }]
                    //]
             })
     tmp_conn.id='Line'+id;
     tmp_conn.setConnector(form_data['linestyle']);
     if ( form_data['arrowstyle'] == "arrow" || form_data['arrowstyle'] == "dblarrow" ) tmp_conn.addOverlay( [ "Arrow" , { width: width*3, length:width*3, location:1, direction: 1 }]);
     if ( form_data['arrowstyle'] == "dblarrow" ) tmp_conn.addOverlay( [ "Arrow" , { width: width*3, length:width*3, location:0, direction: -1 }]);
     if ( form_data['label'] != '' )  {
        label = Object({
                label: form_data['label'] ,
                location: 0.5,
                cssClass: 'line_label line_label'+id
                });
        tmp_conn.setLabel(label);
        $('.line_label'+id).css('color', color)
     }
     $('#body').children('.modal').modal('hide');
    }).fail(function (message) {
        addMessage('DANGER', getJsonMessage(message));
    });
});




// Edit Custom Shape/Edit Text

$('body').on('click', '.action-textobjectduplicate', function (e) {
    logger(1, 'DEBUG: action = action-textobjectduplicate');
    var id = $(this).attr('data-path')
        , $selected_shape
        , $duplicated_shape
        , new_id
        , textObjectsLength
        , shape_border_width
        , form_data = {}
        , new_data_html;

    $selected_shape = $("#customShape" + id + " svg").children();
    shape_border_width = $("#customShape" + id + " svg").children().attr('stroke-width');

    function getSizeObj(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    }

    if ($("#customShape" + id).length) {
        $selected_shape = $("#customShape" + id);
        $selected_shape.resizable("destroy");
        //$selected_shape.draggable("destroy");
        //lab_topology.setDraggable($selected_shape, false);
        $duplicated_shape = $selected_shape.clone();

        $selected_shape
        .resizable({
            autoHide: true,
            resize: function (event, ui) {
                textObjectResize(event, ui, {"shape_border_width": shape_border_width});
            },
            stop: textObjectDragStop
        });

        getTextObjects().done(function (textObjects) {

            textObjectsLength = getSizeObj(textObjects);

            for (var i = 1; i <= textObjectsLength; i++) {
                if (textObjects['' + i + ''] == undefined) {
                    new_id = i;
                    break
                }
                if (textObjectsLength == i) {
                    new_id = i + 1;
                }
            }

            $duplicated_shape.css('top', parseInt($selected_shape.css('top')) + parseInt($selected_shape.css('width')) / 2);
            $duplicated_shape.css('left', parseInt($selected_shape.css('left')) + parseInt($selected_shape.css('height')) / 2);
            $duplicated_shape.attr("id", "customShape" + new_id);
            $duplicated_shape.attr("data-path", new_id);

            new_data_html = $duplicated_shape[0].outerHTML;
            form_data['data'] = new_data_html;
            form_data['name'] = textObjects[id]["name"];
            form_data['type'] = textObjects[id]["type"];

            createTextObject(form_data).done(function () {
                $('#lab-viewport').prepend(new_data_html);
                lab_topology.draggable('customShape' + new_id, {
                       grid: [3, 3],
                    });
               $('#customShape' + new_id)
                .resizable({
                    autoHide: true,
                    resize: function (event, ui) {
                        textObjectResize(event, ui, {"shape_border_width": shape_border_width});
                    },
                    stop: textObjectDragStop
                });

            //    printLabTopology()
                addMessage('SUCCESS', 'Lab has been saved (60023).');
            }).fail(function (message) {
                addMessage('DANGER', getJsonMessage(message));
            })
        }).fail(function (message) {
            addMessage('DANGER', getJsonMessage(message));
        });
    } else if ($("#customText" + id).length) {
        $selected_shape = $("#customText" + id);
        //$selected_shape.resizable("destroy");
        //lab_topology.setDraggable($selected_shape, false);
        $duplicated_shape = $selected_shape.clone();

        getTextObjects().done(function (textObjects) {

            textObjectsLength = getSizeObj(textObjects);

            for (var i = 1; i <= textObjectsLength; i++) {
                if (textObjects['' + i + ''] == undefined) {
                    new_id = i;
                    break
                }
                if (textObjectsLength == i) {
                    new_id = i + 1;
                }
            }

            $duplicated_shape.css('top', parseInt($selected_shape.css('top')) + parseInt($selected_shape.css('width')) / 2);
            $duplicated_shape.css('left', parseInt($selected_shape.css('left')) + parseInt($selected_shape.css('height')) / 2);
            $duplicated_shape.attr("id", "customText" + new_id);
            $duplicated_shape.attr("data-path", new_id);

            new_data_html = $duplicated_shape[0].outerHTML;
            form_data['data'] = new_data_html;
            form_data['name'] = 'txt ' + new_id;
            form_data['type'] = textObjects[id]["type"];

            createTextObject(form_data).done(function () {
                $('#lab-viewport').prepend(new_data_html);
                lab_topology.draggable('customText' + new_id, {
                       grid: [3, 3],
                    });
                addMessage('SUCCESS', 'Lab has been saved (60023).');
            }).fail(function (message) {
                addMessage('DANGER', getJsonMessage(message));
            })
        }).fail(function (message) {
            addMessage('DANGER', getJsonMessage(message));
        });
    }
    $('#context-menu').remove();
});

$('body').on('click', '.action-textobjecttoback', function (e) {
    logger(1, 'DEBUG: action = action-textobjecttoback');
    var id = $(this).attr('data-path')
        , old_z_index
        , shape_border_width
        , new_data
        , $selected_shape = '';

    shape_border_width = $("#customShape" + id + " svg").children().attr('stroke-width');
    if ($("#customShape" + id).length) {
        $selected_shape = $("#customShape" + id);
        old_z_index = $selected_shape.css('z-index');
        $selected_shape.css('z-index', parseInt(old_z_index) - 1);
        $selected_shape.resizable("destroy");
        new_data = document.getElementById("customShape" + id).outerHTML;
        $selected_shape.resizable({
            autoHide: true,
            resize: function (event, ui) {
                textObjectResize(event, ui, {"shape_border_width": shape_border_width});
            },
            stop: textObjectDragStop
        });
    } else if ($("#customText" + id).length) {
        $selected_shape = $("#customText" + id);
        old_z_index = $selected_shape.css('z-index');
        $selected_shape.css('z-index', parseInt(old_z_index) - 1);
        //$selected_shape.resizable("destroy");
        new_data = document.getElementById("customText" + id).outerHTML;
    /*
        $selected_shape.resizable({
            autoHide: true,
            resize: function (event, ui) {
                textObjectResize(event, ui, {"shape_border_width": 5});
            },
            stop: textObjectDragStop
        });
    */
    }
    editTextObject(id, {data: new_data}).done(function () {

    }).fail(function () {
        addMessage('DANGER', getJsonMessage(message));
    });
    $('#context-menu').remove();
});

$('body').on('click', '.action-textobjecttofront', function (e) {
    logger(1, 'DEBUG: action = action-textobjecttofront');
    var id = $(this).attr('data-path')
        , old_z_index
        , shape_border_width
        , new_data
        , $selected_shape = '';

    shape_border_width = $("#customShape" + id + " svg").children().attr('stroke-width');
    if ($("#customShape" + id).length) {
        $selected_shape = $("#customShape" + id);
        old_z_index = $selected_shape.css('z-index');
        $selected_shape.css('z-index', parseInt(old_z_index) + 1);
        $selected_shape.resizable("destroy");
        new_data = document.getElementById("customShape" + id).outerHTML;
        $('#context-menu').remove();
        $selected_shape.resizable({
            autoHide: true,
            resize: function (event, ui) {
                textObjectResize(event, ui, {"shape_border_width": shape_border_width});
            },
            stop: textObjectDragStop
        });
    } else if ($("#customText" + id).length) {
        $selected_shape = $("#customText" + id);
        old_z_index = $selected_shape.css('z-index');
        $selected_shape.css('z-index', parseInt(old_z_index) + 1);
        //$selected_shape.resizable("destroy");
        new_data = document.getElementById("customText" + id).outerHTML;
    /*
        $selected_shape.resizable({
            autoHide: true,
            resize: function (event, ui) {
                textObjectResize(event, ui, {"shape_border_width": 5});
            },
            stop: textObjectDragStop
        });
    */
        $('#context-menu').remove();
    }
    editTextObject(id, {data: new_data}).done(function () {

    }).fail(function () {
        addMessage('DANGER', getJsonMessage(message));
    });
    $('#context-menu').remove();
});

$('body').on('click', '.action-textobjectedit', function (e) {
    logger(1, 'DEBUG: action = action-textobjectedit');
    var id = $(this).attr('data-path');

    if ($("#customShape" + id).length) {
        printFormEditCustomShape(id);
    } else if ($("#customText" + id).length) {
        printFormEditText(id);
    }
    $('#context-menu').remove();
});

$('body').on('click', '.action-textobjectdelete', function (ev) {
    $('#context-menu').remove();
    var id = $(this).attr('data-path')
    var self = $(this);
    var textQuestion = $(this).hasClass('customText') ? 'Are you sure to delete this text?'
                                                      : 'Are you sure to delete this shape?'
    var body = '<div class="form-group">' +
                    '<div class="question">'+ textQuestion +'</div>' +
                    '<div class="col-md-5 col-md-offset-3">' +
                        '<button id="textobjectdelete" class="btn btn-success"  data-path="'+id+'" data-dismiss="modal">Yes</button>' +
                        '<button type="button" class="btn" data-dismiss="modal">Cancel</button>' +
                    '</div>' +
                '</div>'
    var title = "Warning"
    addModal(title, body, "", "make-red make-small");
    $('#textobjectdelete').on('click', function (e) {
        logger(1, 'DEBUG: action = action-textobjectdelete');
        var id = self.attr('data-path')
            , $table = self.closest('table')
            , $selected_shape = '';
        if ($("#customShape" + id).length) {
            $selected_shape = $("#customShape" + id);
        } else if ($("#customText" + id).length) {
            $selected_shape = $("#customText" + id);
        }
        deleteTextObject(id).done(function () {
            if (self.parent('tr')) {
                $('.textObject' + id, $table).remove();
            }
            $selected_shape.remove();
        }).fail(function (message) {
            addModalError(message);
        });
    });
})

$('body').on('contextmenu', '.edit-custom-shape-form, .edit-custom-text-form, #context-menu', function (e) {
    e.preventDefault();
    e.stopPropagation();
});

/*******************************************************************************
 * Text Edit Form
 * *****************************************************************************/

$('body').on('click', '.edit-custom-text-form .btn-align-left', function (e) {
    logger(1, 'DEBUG: action = action-set/delete left alignment');
    var id = $(this).attr('data-path');

    $("#customText" + id + " p").attr('align', 'left');

    if ($('.edit-custom-text-form .btn-align-left').hasClass('active')) {
        $('.edit-custom-text-form .btn-align-left').removeClass('active');
    } else if ($('.edit-custom-text-form .btn-align-center').hasClass('active')) {
        $('.edit-custom-text-form .btn-align-center').removeClass('active');
    } else if ($('.edit-custom-text-form .btn-align-right').hasClass('active')) {
        $('.edit-custom-text-form .btn-align-right').removeClass('active');
    }
    $('.edit-custom-text-form .btn-align-left').addClass('active');
});

$('body').on('click', '.edit-custom-text-form .btn-align-center', function (e) {
    logger(1, 'DEBUG: action = action-set/delete center alignment');
    var id = $(this).attr('data-path');
    $("#customText" + id + " p").attr('align', 'center');

    if ($('.edit-custom-text-form .btn-align-left').hasClass('active')) {
        $('.edit-custom-text-form .btn-align-left').removeClass('active');
    } else if ($('.edit-custom-text-form .btn-align-center').hasClass('active')) {
        $('.edit-custom-text-form .btn-align-center').removeClass('active');
    } else if ($('.edit-custom-text-form .btn-align-right').hasClass('active')) {
        $('.edit-custom-text-form .btn-align-right').removeClass('active');
    }
    $('.edit-custom-text-form .btn-align-center').addClass('active');
});

$('body').on('click', '.edit-custom-text-form .btn-align-right', function (e) {
    logger(1, 'DEBUG: action = action-set/delete left alignment');
    var id = $(this).attr('data-path');
    $("#customText" + id + " p").attr('align', 'right');

    if ($('.edit-custom-text-form .btn-align-left').hasClass('active')) {
        $('.edit-custom-text-form .btn-align-left').removeClass('active');
    } else if ($('.edit-custom-text-form .btn-align-center').hasClass('active')) {
        $('.edit-custom-text-form .btn-align-center').removeClass('active');
    } else if ($('.edit-custom-text-form .btn-align-right').hasClass('active')) {
        $('.edit-custom-text-form .btn-align-right').removeClass('active');
    }
    $('.edit-custom-text-form .btn-align-right').addClass('active');
});

$('body').on('click', '.edit-custom-text-form .btn-text-italic', function (e) {
    logger(1, 'DEBUG: action = action-set/delete font style');
    var id = $(this).attr('data-path');

    if ($('.edit-custom-text-form .btn-text-italic').hasClass('active')) {
        $('.edit-custom-text-form .btn-text-italic').removeClass('active');
        $("#customText" + id + " p").css('font-style', 'normal');
    } else if (!$('.edit-custom-text-form .btn-text-italic').hasClass('active')) {
        $('.edit-custom-text-form .btn-text-italic').addClass('active');
        $("#customText" + id + " p").css('font-style', 'italic');
    }
});

$('body').on('click', '.edit-custom-text-form .btn-text-bold', function (e) {
    logger(1, 'DEBUG: action = action-set/delete font weight');
    var id = $(this).attr('data-path');

    if ($('.edit-custom-text-form .btn-text-bold').hasClass('active')) {
        $('.edit-custom-text-form .btn-text-bold').removeClass('active');
        $("#customText" + id + " p").css('font-weight', 'normal');
    } else if (!$('.edit-custom-text-form .btn-text-bold').hasClass('active')) {
        $('.edit-custom-text-form .btn-text-bold').addClass('active');
        $("#customText" + id + " p").css('font-weight', 'bold');
    }
});

$('body').on('change', '.edit-custom-text-form .text-z_index-input', function (e) {
    logger(1, 'DEBUG: action = action-change text z-index');
    var id = $(this).attr('data-path');
    $("#customText" + id).css('z-index', parseInt($(".edit-custom-text-form .text-z_index-input").val()) + 1000);
});

$('body').on('change', '.edit-custom-text-form .text_background_color', function (e) {
    logger(1, 'DEBUG: action = action-change text background color');
    var id = $(this).attr('data-path');
    $('.edit-custom-text-form .text_background_transparent').removeClass('active  btn-success').text('Off');
    $("#customText" + id + " p").css('background-color', $(".edit-custom-text-form .text_background_color").val());
});

$('body').on('click', '.edit-custom-text-form .text_background_transparent', function (e) {
    logger(1, 'DEBUG: action = action-change text background color');
    var id = $(this).attr('data-path');

    if ($('.edit-custom-text-form .text_background_transparent').hasClass('active')) {
        $('.edit-custom-text-form .text_background_transparent').removeClass('active  btn-success').text('Off');
        $("#customText" + id + " p").css('background-color', $(".edit-custom-text-form .text_background_color").val());
    } else {
        $('.edit-custom-text-form .text_background_transparent').addClass('active  btn-success').text('On');
        $("#customText" + id + " p").css('background-color', hex2rgb($(".edit-custom-text-form .text_background_color").val(), 0));
    }
});

$('body').on('change', '.edit-custom-text-form .text_color', function (e) {
    logger(1, 'DEBUG: action = action-change text color');
    var id = $(this).attr('data-path');
    $("#customText" + id + " p").css('color', $(".edit-custom-text-form .text_color").val());
});

$('body').on('change', '.edit-custom-text-form .text-rotation-input', function (e) {
    logger(1, 'DEBUG: action = action-rotate shape');
    var id = $(this).attr('data-path')
        , angle = parseInt(this.value);

    $("#customText" + id).css("-ms-transform", "rotate(" + angle + "deg)");
    $("#customText" + id).css("-webkit-transform", "rotate(" + angle + "deg)");
    $("#customText" + id).css("transform", "rotate(" + angle + "deg)");
});


$('body').on('click', '.edit-custom-text-form .cancelForm', function (e) {
    logger(1, 'DEBUG: action = action-return old text values');
    var id = $(this).attr('data-path')
        , angle = $('.edit-custom-text-form .firstTextValues-rotation').val();

    //Return z-index value
    $("#customText" + id).css('z-index', parseInt($('.edit-custom-text-form .firstTextValues-z_index').val()));

    // Return alignment value
    $('.edit-custom-text-form .btn-align-left').removeClass('active');
    $('.edit-custom-text-form .btn-align-center').removeClass('active');
    $('.edit-custom-text-form .btn-align-right').removeClass('active');

    if ($('.edit-custom-text-form .firstTextValues-align').val() == "left") {
        $("#customText" + id + " p").attr('align', 'left');
    } else if ($('.edit-custom-text-form .firstTextValues-align').val() == "center") {
        $("#customText" + id + " p").attr('align', 'center');
    } else if ($('.edit-custom-text-form .firstTextValues-align').val() == "right") {
        $("#customText" + id + " p").attr('align', 'right');
    }

    // Return text type value
    $('.edit-custom-text-form .btn-text-bold').removeClass('active');
    $('.edit-custom-text-form .btn-text-italic').removeClass('active');

    if ($('.edit-custom-text-form .firstTextValues-italic').val()) {
        $("#customText" + id + " p").css('font-style', 'italic');
    } else if ($('.edit-custom-text-form .firstTextValues-bold').val()) {
        $("#customText" + id + " p").css('font-weight', 'bold');
    }

    // Return text color value
    $("#customText" + id + " p").css('color', $('.edit-custom-text-form .firstTextValues-color').val());

    // Return background color value
    $("#customText" + id + " p").css('background-color', $(".edit-custom-text-form .firstTextValues-background-color").val());

    // Return rotation angle
    $("#customText" + id).css("-ms-transform", "rotate(" + angle + "deg)");
    $("#customText" + id).css("-webkit-transform", "rotate(" + angle + "deg)");
    $("#customText" + id).css("transform", "rotate(" + angle + "deg)");

    // Remove edit class
    $("#customText" + id).removeClass('in-editing');

    $('.edit-custom-text-form').remove();
});

$('body').on('click', '.edit-custom-text-form-save', function (e) {
    logger(1, 'DEBUG: action = action-save new text values');
    var id = $(this).attr('data-path')
        , $selected_shape = $("#customText" + id)
        , new_data;

    //$selected_shape.resizable("destroy");
    $selected_shape.removeClass('in-editing');
    /*
    $selected_shape.resizable({
        autoHide: true,
        resize: function (event, ui) {
            textObjectResize(event, ui, {"shape_border_width": 5});
        },
        stop: textObjectDragStop
    });
    */
    new_data = document.getElementById("customText" + id).outerHTML;
    editTextObject(id, {data: new_data}).done(function () {
        addMessage('SUCCESS', 'Lab has been saved (60023).');
        adjustZoom(lab_topology)
    }).fail(function (message) {
        addModalError(message);
    });
    $('.edit-custom-text-form').remove();
});


// Network Style Form


$('body').on('change input', '.edit-network-style-form, .network-style-midpoint, .link-labelpos-input ', function (e) {
    logger(1, 'DEBUG: action = action-change link style');
    var id = $(this).attr('data-path')
    , label = ['label']
    , labelpos = parseFloat( $(".edit-network-style-form .link-labelpos-input").val() ) 
    , conn = lab_topology.getConnections().find( function(item) { return  item.id == id } )
    , color = $(".edit-network-style-form .link_color").val()
    , width = $(".edit-network-style-form .network-style-width").val()
    , linkstyle = $(".edit-network-style-form .network-linkstyle-select").val();


    label =Object({
        label: $(".edit-network-style-form .link-label-input").val(),
        location: labelpos,
        cssClass: 'link_label '+id
    })
    if ( $(".edit-network-style-form .network-style-select").val() == 'Solid' ) {
        dash = '""'
    } else {
        dash = "2 4"  ;
    }

        switch ( linkstyle ) {
                case 'Straight' :
                        $(".form-group.network-style-stub").show();
                        $(".form-group.network-style-curviness").hide();
                        $(".form-group.network-style-bezier-curviness").hide()
                        $(".form-group.network-style-midpoint").hide();
                        $(".form-group.network-style-round").hide();
                        break;
                case 'Bezier' :
                        $(".form-group.network-style-stub").hide();
                        $(".form-group.network-style-bezier-curviness").show();
                        $(".form-group.network-style-bezier").hide();
                        $(".form-group.network-style-midpoint").hide();
                        $(".form-group.network-style-round").hide();
                        break;
                case 'Flowchart' :
                        $(".form-group.network-style-stub").hide();
                        $(".form-group.network-style-curviness").hide();
                        $(".form-group.network-style-bezier-curviness").hide()
                        $(".form-group.network-style-midpoint").show();
                        $(".form-group.network-style-round").show();
                        break;
                case 'StateMachine' :
                        $(".form-group.network-style-stub").hide();
                        $(".form-group.network-style-curviness").show();
                        $(".form-group.network-style-bezier-curviness").hide();
                        $(".form-group.network-style-midpoint").hide();
                        $(".form-group.network-style-round").hide();
                        break;
        }
        conn.setPaintStyle({strokeWidth: width, stroke:  color , dashstyle: dash })
	//console.log ( '%o', conn.getConnector() );
	lastcurv = ( linkstyle == 'Bezier' ) ? parseInt( $('.form-control.network-style-bezier-curviness').val()) : parseInt( $('.form-control.network-style-curviness').val())
        conn.setConnector([linkstyle, { stub: parseInt ($('.form-control.network-style-stub').val()),
					curviness: lastcurv,
					cornerRadius: parseInt ($('.form-control.network-style-round').val()),
					midpoint: parseFloat( 1 - $('.form-control.network-style-midpoint').val()),
					 }]);
	src_label = conn.getOverlay("src");
	src_label.loc = parseFloat( $('.form-control.network-source-pos').val())
	dst_label = conn.getOverlay("dst");
	if ( dst_label != undefined ) { dst_label.loc = parseFloat( $('.form-control.network-destination-pos').val()) }

        conn.setLabel(label)
	//console.log ( '%o' , conn );
    //alert(id.replace(/:/g,'\\:'))
    $('.node_interface.'+id.replace(/:/g,'\\:')+',.link_label.'+id.replace(/:/g,'\\:')).css('color',color)
    if ( $(".edit-network-style-form .link-label-input").val() == "" )  {
        conn.removeOverlay('__label')
    }
});

$('body').on('click', '.edit-network-style-form .cancelForm', function (e) {
    //restore oldvalues
    var id = $(this).attr('data-path')
    ,conn = lab_topology.getConnections().find( function(item) { return  item.id == id} )
    ,style = $('.firstLinkValues-style').val()
    ,color = $('.firstLinkValues-color').val()
    ,label = $('.firstLinkValues-label').val()
    ,labelpos = parseFloat( $('.firstLinkValues-labelpos').val())
    ,linkstyle = $('.firstLinkValues-linkstyle').val()
    ,stub = $('.firstLinkValues-stub').val()
    ,curviness = $('.firstLinkValues-curviness').val()
    ,bezier_curviness = $('.firstLinkValues-bezier-curviness').val()
    ,midpoint = $('.firstLinkValues-midpoint').val()
    ,cornerradius = $('.firstLinkValues-cornerradius').val()
    ,srcpos = $('.firstLinkValues-pos-src').val()
    ,dstpos = $('.firstLinkValues-pos-dst').val()

    if ( label != '' ) {
    labelobject = Object({
        label: label,
        location: labelpos,
        cssClass: 'link_label ' +id
    })
    }
    if ( style == 'Solid' || style == '' ) {
        dash = '""'
    } else {
        dash = "2 4"  ;
    }
    conn.setPaintStyle({strokeWidth: 2, stroke:  color , dashstyle: dash })
//    conn.setConnector([ ( (linkstyle != '') ? linkstyle : "Straight")] )
 //   lastcurv = ( linkstyle == 'Bezier' ) ? parseInt( $('.form-control.network-style-bezier-curviness').val()) : parseInt( $('.form-control.network-style-curviness').val())
    console.log ( "midpoint =" + midpoint );
    curve = (  linkstyle == "Bezier" ) ? bezier_curviness : curviness;
    conn.setConnector([  (linkstyle != '') ? linkstyle : "Straight" , {
	    				stub: parseInt ( stub),
                                        curviness: curve,
                                        cornerRadius: parseInt ( cornerradius),
                                        midpoint: parseFloat( 1 - midpoint),
                                         }]);
        src_label = conn.getOverlay("src");
        src_label.loc = parseFloat(srcpos)
        dst_label = conn.getOverlay("dst");
        if ( dst_label != undefined ) { 
		dst_label.loc = parseFloat(dstpos)
	}

    if ( label != '' ) {
    conn.setLabel(labelobject)
    } else {
    conn.removeOverlay('__label')
    }
    $('.node_interface.'+id.replace(/:/g,'\\:')+',.link_label.'+id.replace(/:/g,'\\:')).css('color',color)
    $('.edit-network-style-form').remove();
});

$('body').on('change input', '.edit-line-style-form, .line-labelpos', function (e) {
    logger(1, 'DEBUG: action = action-change line style');
    var id = $(this).attr('data-path')
    , conn = lab_topology.getConnections().find( function(item) { return  item.id == 'Line'+id} )
    , label = ['label']
    , color = $(".edit-line-style-form .line_color").val()
    , linestyle = $(".edit-line-style-form .line-linestyle-select").val()
    , paintstyle = $(".edit-line-style-form .line-paintstyle-select").val()
    , arrowstyle = $(".edit-line-style-form .line-arrowstyle-select").val()
    , width = $(".edit-line-style-form .line-width").val()

        switch ( linestyle ) {
                case 'Straight' :
                        $(".form-group.line-style-stub").show();
                        $(".form-group.line-style-curviness").hide();
                        $(".form-group.line-style-bezier-curviness").hide()
                        $(".form-group.line-style-midpoint").hide();
                        $(".form-group.line-style-round").hide();
                        break;
                case 'Bezier' :
                        $(".form-group.line-style-stub").hide();
                        $(".form-group.line-style-bezier-curviness").show();
                        $(".form-group.line-style-curviness").hide();
                        $(".form-group.line-style-midpoint").hide();
                        $(".form-group.line-style-round").hide();
                        break;
                case 'Flowchart' :
                        $(".form-group.line-style-stub").hide();
                        $(".form-group.line-style-curviness").hide();
                        $(".form-group.line-style-bezier-curviness").hide()
                        $(".form-group.line-style-midpoint").show();
                        $(".form-group.line-style-round").show();
                        break;
                case 'StateMachine' :
                        $(".form-group.line-style-stub").hide();
                        $(".form-group.line-style-curviness").show();
                        $(".form-group.line-style-bezier-curviness").hide();
                        $(".form-group.line-style-midpoint").hide();
                        $(".form-group.line-style-round").hide();
                        break;
        }

    label =Object({
        label: $(".edit-line-style-form .line-label").val(),
        location: parseFloat($(".edit-line-style-form .line-labelpos").val()), 
        cssClass: 'line_label line_label'+id
    })
    if ( paintstyle == 'Solid' ) {
        dash = '""'
    } else {
        dash = "2 4"  ;
    }

    conn.setPaintStyle({strokeWidth: width, stroke:  color , dashstyle: dash })
        //conn.setConnector([linestyle])
        lastcurv = ( linestyle == 'Bezier' ) ? parseInt( $('.form-control.line-bezier-curviness').val()) : parseInt( $('.form-control.line-curviness').val())
        conn.setConnector([linestyle, { stub: parseInt ($('.form-control.line-stub').val()),
                                        curviness: lastcurv,
                                        cornerRadius: parseInt ($('.form-control.line-round').val()),
                                        midpoint: parseFloat( 1 - $('.form-control.line-midpoint').val()),
                                         }]);
        conn.setLabel(label)
        if ( arrowstyle == "arrow" || arrowstyle == "dblarrow" ) conn.addOverlay( [ "Arrow" , { width: width*3, length:width*3, location:1, direction: 1 }]);
        if ( arrowstyle == "dblarrow" ) conn.addOverlay( [ "Arrow" , { width: width*3, length:width*3, location:0, direction: -1 }]);

    $('.line_label'+id).css('color',color)
    //alert(id.replace(/:/g,'\\:'))
    if ( $(".edit-line-style-form .line-label").val() == "" )  {
        conn.removeOverlay('__label')
    }
});

$('body').on('click', '.edit-line-style-form .cancelForm', function (e) {
    //restore oldvalues
    var id = $(this).attr('data-path')
    ,conn = lab_topology.getConnections().find( function(item) { return  item.id == 'Line'+id} )
    ,label = $('.firstLineValues-label').val()
    ,labelpos = parseFloat( $('.firstLineValues-labelpos').val())
    ,paintstyle = $('.firstLineValues-paintstyle').val()
    ,color = $('.firstLineValues-color').val()
    ,linestyle = $('.firstLineValues-linestyle').val()
    ,arrowstyle = $('.firstLineValues-arrowstyle').val()
    ,width = $('.firstLineValues-width').val()
    ,stub=$('.firstLineValues-stub').val()
    ,width=$('.firstLineValues-width').val()
    ,curviness=$('.firstLineValues-curviness').val()
    ,beziercurviness=$('.firstLineValues-bezier-curviness').val()
    ,round=$('.firstLineValues-round').val()
    ,midpoint=$('.firstLineValues-midpoint').val()

    if ( label != '' ) {
    labelobject = Object({
        label: label,
        location: labelpos ,
        cssClass: 'line_label line_label'+id
    })
    }
    if ( paintstyle == 'Solid' || style == '' ) {
        dash = '""'
    } else {
        dash = "2 4"  ;
    }
    conn.setPaintStyle({strokeWidth: width, stroke:  color , dashstyle: dash })
    conn.setConnector([ ( (linestyle != '') ? linestyle : "Straight")] )
    lastcurv = ( linestyle == 'Bezier' ) ? parseInt(  beziercurviness) : parseInt( curviness)
    conn.setConnector([linestyle, { stub: parseInt (stub),
                                        curviness: lastcurv,
                                        cornerRadius: parseInt (round),
                                        midpoint: parseFloat( 1 - midpoint),
                                         }]);
    if ( label != '' ) {
    conn.setLabel(labelobject)
    } else {
    conn.removeOverlay('__label')
    }
    if ( arrowstyle == "arrow" || arrowstyle == "dblarrow" ) conn.addOverlay( [ "Arrow" , { width: width*3, length:width*3, location:1, direction: 1 }]);
    if ( arrowstyle == "dblarrow" ) conn.addOverlay( [ "Arrow" , { width: width*3, length:width*3, location:0, direction: -1 }]);

    $('.line_label.'+id.replace(/:/g,'\\:')).css('color',color)
    $('.edit-line-style-form').remove();
});

// Link Quality Form

//Cancel
$('body').on('click', '.edit-link-quality-form .cancelForm', function (e) {
    $('.edit-link-quality-form').remove();
});

// Submit


// New TextBox Edit
$(document).on('dblclick', '.customText', function (e) {
    if ( LOCK == 1 ) {
    return 0;
    }
    logger(1, 'DEBUG: action = action-edit text');
    // need to disable select mode
    $("#lab-viewport").selectable("disable");
    var id = $(this).attr('data-path')
        , $selectedCustomText = $("#customText" + id + " p")
        ;

    // Disable draggable and resizable before sending request
    try {
        lab_topology.setDraggable('customText'+id, false);
        //$(this).resizable("destroy");
    }
    catch (e) {
        console.warn(e);
    }
    event.preventDefault();
    event.stopPropagation();

    $('#customText'+id ).attr('contenteditable', 'true').addClass('editable')
    $('#customText'+id ).css('cursor', 'auto');
    $("#lab-viewport").selectable("destroy");
    window.ck = 'customText'+id ;
    if (typeof ( CurCKEDITOR ) !== 'undefined'  && CurCKEDITOR.state == 'ready' ) { CurCKEDITOR.destroy() }
    CKEDITOR.InlineEditor.create ( document.querySelector( '#customText'+id), editorConfigPDF).then( function (CurCKEDITOR)  { window.CurCKEDITOR = CurCKEDITOR; window.CurCKEDITOR.editing.view.focus();})
    lab_topology.setDraggable('customText'+id, false); 
    

});

/*
$(document).on('paste', '[contenteditable="true"]', function (e) {
    e.preventDefault();
    var text = null;
    text = (e.originalEvent || e).clipboardData.getData('text/plain') || prompt('Paste Your Text Here');
    document.execCommand("insertText", false, text);
});
*/


$(document).on('blur', '.customText .editable', function (e) {
    if ( window.ck == null ) return ;
    $("#lab-viewport").selectable("enable");
    var new_data
        //, id = $(this).parent().attr('data-path')
        , id = $(this).attr('data-path')
        , $selected_shape = $("#customText" + id)
        , innerHtml = $($selected_shape).html()
        , textLines = 0
        ;

    //$("#customText" + id + " p").removeClass('editable');
    $("#customText" + id ).removeClass('editable');
    //$("#customText" + id + " p").attr('contenteditable', 'false');
    $("#customText" + id ).attr('contenteditable', 'false');
    //$("#customText" + id ).blur();
    //innerHtml = innerHtml.replace(/^(<br>)+/, "").replace(/(<br>)+$/, "");

    // replace all HTML tags except <br>, replace closing DIV </div> with br
    //innerHtml = innerHtml.replace(/<(\w+\b)[^>]*>([^<>]*)<\/\1>/g, '$2<br>');

    //if (!innerHtml) {
      //  innerHtml = "<br>";
    //}

    $($selected_shape).html(innerHtml);
    // Calculate and apply new Width / Height based lines count
    //textLines = $("br", $selected_shape).length;
    //if (textLines) {
        // multilines text
        //$selected_shape.css("height", parseFloat($("p", $selected_shape).css("font-size")) * (textLines * 1.5 + 1) + "px");
    //}
    //else {
        // 1 line text
        //$selected_shape.css("height", parseFloat($("p", $selected_shape).css("font-size")) * 2 + "px");
    //}
    $selected_shape.css("width", "auto");

    new_data = document.getElementById("customText" + id).outerHTML;
    editTextObject(id, {data: new_data}).done(function () {
        addMessage('SUCCESS', 'Lab has been saved (60023).');
        //printLabTopology()
    }).fail(function (message) {
        addModalError(message);
    });
    lab_topology.setDraggable('customText'+id, true);
    logger (1,  ' DEBUG: focusout will apply jsplum drggable to customText'+id )
    /*$selected_shape
    .resizable({
        autoHide: true,
        resize: function (event, ui) {
            textObjectResize(event, ui, {"shape_border_width": 5});
        },
        stop: textObjectDragStop
    });*/
});

// Fix "Enter" behaviour in contenteditable elements
$(document).on('keydown', '.noeditable', function (e) {
    var editableText = $('.editable')
        ;

    if (KEY_CODES.enter == e.which) {
        function brQuantity() {
            if (parseInt(editableText.text().length) <= getCharacterOffsetWithin(window.getSelection().getRangeAt(0), document.getElementsByClassName("editable")[0])) {
                return '<br><br>'
            } else {
                return '<br>'
            }
        };
        document.execCommand('insertHTML', false, brQuantity());
        return false;
    }
});

//Get caret position
// node - need to get by pure js
function getCharacterOffsetWithin(range, node) {
    var treeWalker = document.createTreeWalker(
        node,
        NodeFilter.SHOW_TEXT,
        function (node) {
            var nodeRange = document.createRange();
            nodeRange.selectNodeContents(node);
            return nodeRange.compareBoundaryPoints(Range.END_TO_END, range) < 1 ?
                NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        },
        false
    );

    var charCount = 0;
    while (treeWalker.nextNode()) {
        charCount += treeWalker.currentNode.length;
    }
    if (range.startContainer.nodeType == 3) {
        charCount += range.startOffset;
    }
    return charCount;
}

/*******************************************************************************
 * Custom Shape Edit Form
 * *****************************************************************************/

$('body').on('click', '.edit-custom-shape-form .cancelForm', function (e) {
    logger(1, 'DEBUG: action = action-return old shape values');
    var id = $(this).attr('data-path')
        , angle = $(".edit-custom-shape-form .firstShapeValues-rotation").val();

    //Return z-index value
    $("#customShape" + id).css('z-index', parseInt($('.edit-custom-shape-form .firstShapeValues-z_index').val()));

    //Return border width value
    if ($("#customShape" + id + " svg").children().attr('cx')) {
        $("#customShape" + id + " svg").children().attr('stroke-width', $('.edit-custom-shape-form .firstShapeValues-border-width').val() / 2);
    } else {
        $("#customShape" + id + " svg").children().attr('stroke-width', $('.edit-custom-shape-form .firstShapeValues-border-width').val());
    }

    //Return border type value
    if ($('.edit-custom-shape-form .firstShapeValues-border-type').val() == 'solid') {
        $("#customShape" + id + " svg").children().removeAttr('stroke-dasharray');
    } else if ($('.edit-custom-shape-form .firstShapeValues-border-type').val() == 'dashed') {
        if (!$("#customShape" + id + " svg").children().attr('stroke-dasharray')) {
            $("#customShape" + id + " svg").children().attr('stroke-dasharray', '10,10');
        }
    }

    //Return border color value
    $("#customShape" + id + " svg").children().attr('stroke', $(".edit-custom-shape-form .firstShapeValues-border-color").val());

    //Return background color value
    $("#customShape" + id + " svg").children().attr('fill', $(".edit-custom-shape-form .firstShapeValues-background-color").val());

    //Return rotation angle
    $("#customShape" + id).css("-ms-transform", "rotate(" + angle + "deg)");
    $("#customShape" + id).css("-webkit-transform", "rotate(" + angle + "deg)");
    $("#customShape" + id).css("transform", "rotate(" + angle + "deg)");

    $("#customShape" + id).removeClass('in-editing');

    $('.edit-custom-shape-form').remove();
});

$('body').on('change', '.edit-custom-shape-form .shape-z_index-input', function (e) {
    logger(1, 'DEBUG: action = action-change shape z-index');
    var id = $(this).attr('data-path');
    $("#customShape" + id).css('z-index', parseInt($(".edit-custom-shape-form .shape-z_index-input").val()) + 1000);
});

$('body').on('change', '.edit-custom-shape-form .shape_border_width', function (e) {
    logger(1, 'DEBUG: action = action-change shape border width');
    var id = $(this).attr('data-path');

    if ($("#customShape" + id + " svg").children().attr('cx')) {
        $("#customShape" + id + " svg").children().attr('stroke-width', $(".edit-custom-shape-form .shape_border_width").val() / 2);
    } else {
        $("#customShape" + id + " svg").children().attr('stroke-width', $(".edit-custom-shape-form .shape_border_width").val());
    }
});

$('body').on('change', '.edit-custom-shape-form .border-type-select', function (e) {
    logger(1, 'DEBUG: action = action-change shape border type');
    var id = $(this).attr('data-path');

    if ($(".edit-custom-shape-form .border-type-select").val() == 'solid') {
        if ($("#customShape" + id + " svg").children().attr('stroke-dasharray')) {
            $("#customShape" + id + " svg").children().removeAttr('stroke-dasharray');
        }
    } else if ($(".edit-custom-shape-form .border-type-select").val() == 'dashed') {
        if (!$("#customShape" + id + " svg").children().attr('stroke-dasharray')) {
            $("#customShape" + id + " svg").children().attr('stroke-dasharray', '10,10');
        }
    }
});

$('body').on('change', '.edit-custom-shape-form .shape_background_color', function (e) {
    logger(1, 'DEBUG: action = action-change shape background color');
    var id = $(this).attr('data-path');
    $("#customShape" + id + " svg").children().attr('fill', $(".edit-custom-shape-form .shape_background_color").val());
    $('.edit-custom-shape-form .shape_background_transparent').removeClass('active  btn-success').text('Off');
});

$('body').on('click', '.edit-custom-shape-form .shape_background_transparent', function (e) {
    logger(1, 'DEBUG: action = action-change shape background color');
    var id = $(this).closest('form').attr('data-path');

    if ($('.edit-custom-shape-form .shape_background_transparent').hasClass('active')) {
        $('.edit-custom-shape-form .shape_background_transparent').removeClass('active  btn-success').text('Off');
        $("#customShape" + id + " svg").children().attr('fill', $(".edit-custom-shape-form .shape_background_color").val());
    }
    else {
        $('.edit-custom-shape-form .shape_background_transparent').addClass('active  btn-success').text('On');
        $("#customShape" + id + " svg").children().attr('fill', hex2rgb($(".edit-custom-shape-form .shape_background_color").val(), 0));
    }
});

$('body').on('change', '.edit-custom-shape-form .shape_border_color', function (e) {
    logger(1, 'DEBUG: action = action-change shape border color');
    var id = $(this).attr('data-path');
    $("#customShape" + id + " svg").children().attr('stroke', $(".edit-custom-shape-form .shape_border_color").val());
});

$('body').on('change', '.edit-custom-shape-form .shape-rotation-input', function (e) {
    logger(1, 'DEBUG: action = action-rotate shape');
    var id = $(this).attr('data-path')
        , angle = parseInt(this.value);

    $("#customShape" + id).css("-ms-transform", "rotate(" + angle + "deg)");
    $("#customShape" + id).css("-webkit-transform", "rotate(" + angle + "deg)");
    $("#customShape" + id).css("transform", "rotate(" + angle + "deg)");
});

$('body').on('click', '.edit-custom-shape-form-save', function (e) {
    logger(1, 'DEBUG: action = action-save new shape values');
    var id = $(this).attr('data-path')
        , $selected_shape = $("#customShape" + id)
        , shape_border_width
        , new_data
        , shape_name = $(".shape-name-input").val()
        ;

    $('.edit-custom-shape-form .firstShapeValues-background-color').val($(".edit-custom-shape-form .shape_background_color").val());
    shape_border_width = $("#customShape" + id + " svg").children().attr('stroke-width');
    $selected_shape.resizable("destroy");
    $("#customShape" + id).removeClass('in-editing');
    new_data = document.getElementById("customShape" + id).outerHTML;
    $('#context-menu').remove();
    $selected_shape.resizable({
        autoHide: true,
        resize: function (event, ui) {
            textObjectResize(event, ui, {"shape_border_width": shape_border_width});
        },
        stop: textObjectDragStop
    });

    editTextObject(id, {data: new_data, name: shape_name}).done(function () {
        $("#customShape" + id ).attr('name', shape_name);
        addMessage('SUCCESS', 'Lab has been saved (60023).');
        adjustZoom(lab_topology)
    }).fail(function (message) {
        addModalError(message);
    });
    $('.edit-custom-shape-form').remove();
});

// Print lab textobjects
$(document).on('click', '.action-textobjectsget', function (e) {
    logger(1, 'DEBUG: action = textobjectsget');
    $.when(getTextObjects()).done(function (textobjects) {
        printListTextobjects(textobjects);
    }).fail(function (message) {
        addModalError(message);
    });
});


/*******************************************************************************
 * Free Select
 * ****************************************************************************/
window.freeSelectedNodes = [];
$(document).on("click", ".action-freeselect", function (event) {
    var self = this
        , isFreeSelectMode = $(self).hasClass("active")
        ;

    if (isFreeSelectMode) {
        // TODO: disable Free Select Mode
        $(".node_frame").removeClass("free-selected");
    }
    else {
        // TODO: activate Free Select Mode

    }

    window.freeSelectedNodes = [];
    $(self).toggleClass("active", !isFreeSelectMode);
    $("#lab-viewport").toggleClass("freeSelectMode", !isFreeSelectMode);

});

$(document).on("click", "#lab-viewport.freeSelectMode .onode_frame", function (event) {
    event.preventDefault();
    event.stopPropagation();

    var self = this
        , isFreeSelected = $(self).hasClass("free-selected")
        , name = $(self).data("name")
        , path = $(self).data("path")
        ;

    if (isFreeSelected) {   // already present window.freeSelectedNodes = [];
        window.freeSelectedNodes = window.freeSelectedNodes.filter(function (node) {
            return node.name !== name && node.path !== path;
        });
    }
    else {                  // add to window.freeSelectedNodes = [];
        window.freeSelectedNodes.push({
            name: name
            , path: path
        });
    }

    $(self).toggleClass("free-selected", !isFreeSelected);
});

$(document).on("click", ".user-settings", function () {
    var user = $(this).attr("user");
    $.when(getUsers(user)).done(function (user) {
        // Got user
        printFormUser('edit', user);
    }).fail(function (message) {
        // Cannot get user
        addModalError(message);
    });
});


// Load logs page
$(document).on('click', '.action-logs', function(e) {
    logger(1, 'DEBUG: action = logs');
    printLogs('access.txt', 10, "");
    bodyAddClass('logs');
});

/*******************************************************************************
 * Node link
 * ****************************************************************************/


$(document).on('click', 'a.interfaces.serial', function (e) {
    e.preventDefault();
})

$(document).on('click','#lab-viewport', function (e) {
   var context = 0
   {
        try {    if ( e.target.className.search('action-') != -1 || $('#context-menu').length > 0 ) context = 1  } catch (ex) {}
   }
   if ( !e.metaKey && !e.ctrlKey && $(this).hasClass('freeSelectMode')   && window.dragstop != 1 && context == 0 ) {
        $('.free-selected').removeClass('free-selected')
        $('.ui-selected').removeClass('ui-selected')
        $('.ui-selecting').removeClass('ui-selecting')
        $('#lab-viewport').removeClass('freeSelectMode')
        lab_topology.clearDragSelection()
        if ((ROLE == 'admin' || ROLE == 'editor') &&  LOCK == 0  ) {
              lab_topology.setDraggable($('.node_frame, .network_frame, .customShape, .line'), true)
        }
   }
   if ( $('.ui-selected').length < 1 ) $('#lab-viewport').removeClass('freeSelectMode')

   if ( $(e.target.offsetParent).is('.editable') == false && $(e.target).closest('.ck').length == 0 ) {
	   logger(1,"window.ck value is " + window.ck);
	   logger(1,e.target)
    if ( window.ck != null )  {
	        new_data = CurCKEDITOR.getData();
	        curtext='#'+window.ck;
		CurCKEDITOR.destroy().then( function () {
		tid = window.ck.replace('customText',''); 
	        $("#customText" + tid).html(new_data)
	    	full_data = $("#customText" + tid).prop('outerHTML') 
                editTextObject(tid, {data: full_data});
	        $("#MyPdf_customText" + tid).trigger('play')
		window.ck = null
		});
    }
    $('.customText').css('cursor', 'move');
         logger ( 1 , "remove ckeditor click viewport" );
	  
    //window.ck = null
    restoreSelectLabTopology();
    $('.customText').blur();
    $('.customText').focusout() ;
   }
   $('#alert_container > b > .fa-angle-up').click();
   window.dragstop = 0
   //lab_topology.repaintEverything()
});


$(document).on('click', '.customShape, .line, .network', function (e) {
        var node = $(this)
        var isFreeSelectMode = $("#lab-viewport").hasClass("freeSelectMode")
         if ( e.metaKey || e.ctrlKey  ) {
        node.toggleClass('ui-selected')
        updateFreeSelect(e,node)
        e.preventDefault();
        } else {
                 if (!node.hasClass('ui-selecting') && !node.hasClass('ui-selected')  && isFreeSelectMode ) {
                     $('.free-selected').removeClass('free-selected')
                     $('.ui-selected').removeClass('ui-selected')
                     $('.ui-selecting').removeClass('ui-selecting')
                     $('#lab-viewport').removeClass('freeSelectMode')
                     lab_topology.clearDragSelection()
                     if ((ROLE == 'admin' || ROLE == 'editor') &&  LOCK == 0  ) {
                          lab_topology.setDraggable($('.node_frame, .network_frame, .customShape, .line'), true)
                     }
                     e.preventDefault();
                     e.stopPropagation();
                 }
        }
});

$(document).on('mousedown', '.network_frame, .node_frame, .customShape , .line', function (e) {
          if ( e.which == 1 ) {
          $('.select-move').removeClass('select-move')
          lab_topology.clearDragSelection()
          }
});

// Reset Lab Zoom
$(document).on('click', '.sidemenu-zoom', function (e) {
    var zoom=1
    setZoom(zoom,lab_topology,[0.0,0.0])
    $('#lab-viewport').width(($(window).width()-40) / zoom)
    $('#lab-viewport').height($(window).height() / zoom);
    $('#lab-viewport').css({top: 0,left: 40,position: 'absolute'});
    //setZoom(zoom,lab_topology,[0.0,0.0])
    $('#zoomslide').slider({value:100})
});

//show context menu when node is off
$(document).on('click', '.node.node_frame a', function (e) {

    var node = $(this).parent();
    var node_id = node.attr('data-path');
    var status = parseInt(node.attr('data-status'));
    var $labViewport = $("#lab-viewport")
        , isFreeSelectMode = $labViewport.hasClass("freeSelectMode")


    if ( e.metaKey || e.ctrlKey  ) {
        node.toggleClass('ui-selected')
        updateFreeSelect(e,node)
        e.preventDefault();
        return ;
    }

    //if (islinkActive() || isFreeSelectMode ) return true;
    if (isFreeSelectMode ) {
       e.preventDefault();
       return true;
    }

    if ( node.hasClass('dragstopped') && node.removeClass('dragstopped') ) {
          e.preventDefault();
          return true ;
    }

    if ( window.cur_cf == undefined ) window.cur_cfs = 'default' ;
    if (!status) {

        e.preventDefault();

        $.when(getNodes(node_id))
            .then(function (node) {

                var network = '<li><a class="action-nodestart menu-manage" data-path="' + node_id +
                    '" data-name="' + node.name + '" href="#"><i class="glyphicon glyphicon-play"></i> Start</a></li>';
                if  ((ROLE == 'admin' || ROLE == 'editor') &&  LOCK == 0  ) {
                     network += '<li><a style="display: block;" class="action-nodeedit " data-path="' + node_id +
                     '" data-name="' + node.name + '" href="#"><i class="glyphicon glyphicon-edit"></i> Edit</a></li>';
                }

                printContextMenu(node.name, network, e.pageX, e.pageY,false,"menu");
            })
            .fail(function (message) {
                addMessage('danger', message);
            });

        return false;
    } else if ( node.find('a:first').attr('href').search("token") != -1 ) {
    $('#framewrap'+node_id).removeClass('hidden')
    $('#framewrap'+node_id).show()
    $('.consolewrap').css('z-index','4029')
    $('#framewrap'+node_id).css('z-index','4030')
    $('#framewrap'+node_id).click()
    }

})

$(document).on('submit', '#addConn', function (e) {
    e.preventDefault();  // Prevent default behaviour
    if ( $('.btn-success').hasClass('disabled')  ) {
	    return 
    }
    $('.btn-success').addClass('disabled')
    var lab_filename = $('#lab-viewport').attr('data-path');
    var form_data = form2Array('addConn');
    //alert ( JSON.stringify( form_data) )
    var srcType = ( ( (form_data['srcConn']+'').search("serial")  != -1 ) ? 'serial' : 'ethernet' )
    var dstType = ( ( (form_data['dstConn']+'').search("serial")  != -1 ) ? 'serial' : 'ethernet' )
    // Get src dst type information and check compatibility
    if ( srcType != dstType )  {
         addModalError("Serial and Ethernet cannot be interconnected !!!!" )
         return
    }
    if ( form_data['srcNodeType'] == 'network' && form_data['dstNodeType'] == 'network' ) {
         addModalError("networks cannot be interconnected !!!!" )
         return
    }
    // nonet - nono - netnet
    if ( form_data['srcNodeType'] == 'node' && form_data['dstNodeType'] == 'node' ) {
	 //order them
	 node1_id = parseInt(form_data['srcNodeId'].replace('node',''))
	 node2_id = parseInt(form_data['dstNodeId'].replace('node',''))
	 if ( node1_id < node2_id ) { //swap
		 swap_buf = Array ( form_data['srcNodeId'],form_data['srcConn'],form_data['srcLabel'])
		 form_data['srcNodeId'] = form_data['dstNodeId']
		 form_data['srcConn'] = form_data['dstConn']
		 form_data['srcLabel'] = form_data['dstLabel']
		 form_data['dstNodeId'] = swap_buf[0]
		 form_data['dstConn'] = swap_buf[1]
		 form_data['dstLabel'] = swap_buf[2]
	 }

         if ( srcType == 'serial' ) {
             var node1 = form_data['srcNodeId']
             var iface1 = form_data['srcConn'].replace(',serial','')
             var node2 = form_data['dstNodeId']
             var iface2 = form_data['dstConn'].replace(',serial','')
	     var source_label = form_data['srcLabel']
	     var destination_label = form_data['dstLabel']
             $.when(setNodeInterface(node1, node2 + ':' + iface2 , iface1)).done( function () {
                  $(e.target).parents('.modal').attr('skipRedraw', true);
                  $(e.target).parents('.modal').modal('hide');
		  // Live Draw connection
		  renderConn ( node1, source_label, node2, destination_label, node2 + ':' + iface2 , iface1, iface2 , dstType )
             });
         } else {
             var bridgename = $('#node'+form_data['srcNodeId']).attr('data-name') + 'iface_' + form_data['srcConn'].replace(',ethernet','')
             var offset = $('#node' + form_data['srcNodeId'] ).offset()
             var node1 = form_data['srcNodeId']
             var iface1 = form_data['srcConn'].replace(',ethernet','')
             var node2 = form_data['dstNodeId']
             var iface2 = form_data['dstConn'].replace(',ethernet','')
	     var source_label = form_data['srcLabel']
	     var destination_label = form_data['dstLabel']

	     //var source_label = $('.addConnSrc').text() 
	     //var destination_label = $('.addConnDst').text() 
             $.when(setNetwork(bridgename, offset.left + 20, offset.top + 40)).then( function (response) {
                  var networkId = response.data.id;
                  logger(1, 'Link DEBUG: new network created ' + networkId);
                  $.when(setNodeInterface(node1, networkId, iface1) ).done( function () {
                     $.when(setNodeInterface(node2, networkId, iface2)).done( function () {
                       $.when(setNetworkiVisibility( networkId , 0 )).done( function () {
                         $(e.target).parents('.modal').attr('skipRedraw', true);
                         $(e.target).parents('.modal').modal('hide');
			 // Live Draw connection
			 renderConn ( node1, source_label, node2, destination_label, networkId , iface1, iface2 , dstType)
                       });
                     });
                  });
             });

         }

    } else {
        if (  form_data['srcNodeType'] == 'node' ) {
             var node = form_data['srcNodeId']
             var iface = form_data['srcConn'].replace(',ethernet','')
             var bridge = form_data['dstNodeId']
	     var label =  $('.addConnSrc').text()
        } else {
             var node = form_data['dstNodeId']
             var iface = form_data['dstConn'].replace(',ethernet','')
             var bridge = form_data['srcNodeId']
	     var label =  $('.addConnDst').text()
       }
       logger(1, 'node1: ' + form_data['srcNodeId'] + ', node2: ' + form_data['dstNodeId'] );
       $.when(setNodeInterface(node, bridge, iface)).done( function () {
                $(e.target).parents('.modal').attr('skipRedraw', true);
                $(e.target).parents('.modal').modal('hide');
	        renderConn ( node, label, bridge , '' , bridge.replace('network','') , iface , 0 ,'network')
       });
   }

});


/**
 *
 * @returns {*}
 */
function detachNodeLink() {

            if (window.conn || window.startNode) {
                var source = $('#inner').attr('data-source');
                $('#inner').remove();
                $('.link_selected').removeClass('link_selected');
                $('.startNode').removeClass('startNode');
                lab_topology.detach(window.conn);
                delete window.startNode;
                delete window.conn;
            }


}

// CPULIMIT Toggle

$(document).on('change','#ToggleCPULIMIT', function (e) {
 if  ( e.currentTarget.id == 'ToggleCPULIMIT' ) {
        var status=$('#ToggleCPULIMIT').prop('checked');
         if ( status != window.cpulimit ) setCpuLimit (status);
 }
});

// UKSM Toggle

$(document).on('change','#ToggleUKSM', function (e) {
 if  ( e.currentTarget.id == 'ToggleUKSM' ) {
        var status =$('#ToggleUKSM').prop('checked')
        if ( status != window.uksm ) setUksm(status);
 }
});

// KSM Toggle

$(document).on('change','#ToggleKSM', function (e) {
 if  ( e.currentTarget.id == 'ToggleKSM' ) {
        var status =$('#ToggleKSM').prop('checked')
        if ( status != window.ksm ) setKsm(status);
 }
});


// upload a simple node config
// Import labs
$(document).on('click', '.action-upload-node-config', function (e) {
    logger(1, 'DEBUG: action = upload config');
    printFormUploadNodeConfig($('#list-folders').attr('data-path'));
});

$(document).on('click', '.action-download-node-config', function (e) {
    logger(1, 'DEBUG: action = download config');
    if($('#toggle_editor').is(':checked')) {
        var editor_data = ace.edit('editor').getValue();
        var data = $(document).find('#nodeconfig').val(editor_data).val();
    } else {
        var data = $(document).find('#nodeconfig').val();
    }
    var cfg = new Blob([data], {type: 'x-application/text'});
    //function dataUrl(data) {return "data:x-application/text," + escape(data);}
    //window.open(dataUrl($('#nodeconfig').val()));
    if (navigator.msSaveBlob) {
          navigator.msSaveBlob(cfg, $('input[name="currentNode"]').val() + '.txt' );
    } else {
    //In FF link must be added to DOM to be clicked
          var link = document.createElement('a');
          link.href = window.URL.createObjectURL(cfg);
      var currentNode = $('a.action-configget.selected')[0].innerText.trim() ;
          link.setAttribute('download', currentNode+'.txt');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
    }
});

$(document).on('submit', '#form-upload-node-config', function (e) {
     e.preventDefault();
     var node_config = $('input[name="upload[file]"]')[0].files[0];
     logger( 1 , node_config ) ;
     var reader = new FileReader();
     reader.onload = function(){
          var text = reader.result;
          if($('#toggle_editor').is(':checked')) {
        ace.edit('editor').setValue(text);
      } else {
        $('#nodeconfig').val(text) ;
      }
     };
     reader.readAsText(node_config);
     $('.upload-modal').modal('hide');
});

// Generic Toggle Checknox
$(document).on('click','input[type=checkbox]', function (e) {
        if ( e.currentTarget.value == 0 ) {
                e.currentTarget.value = 1;
        } else {
                e.currentTarget.value = 0;
        }
});

$(document).on('click', '.configured-nodes-checkbox', function(e){
    var id = $(this).attr('data-path')
    setNodeData(id);
});

$(document).on('click','.action-new-configset', function(e) {
    /// Create modal
    printFormAddConfigset();
});

$(document).on('click','.action-edit-configset', function(e) {
    /// Create modal
        printFormEditConfigset();
});

$(document).on('click','.action-delete-configset', function(e) {
    /// Create modal
    logger(1, 'DEBUG: action = delete-configset ' + $('#configsetselect option:selected').text() + 'value is ' + $('#configsetselect option:selected').val()   );
    delConfigset($('#configsetselect option:selected').val());
     window.cur_cfs = 'default' ;
});

$(document).on('click','.action-addtask', function(e) {
    /// Create modal
        printFormAddLabTask();
});

$(document).on('click','.action-taskrename', function(e) {
        var id = $(this).attr('data-path');
    /// Create modal
        printFormRenameLabTask(id);
});

$(document).on('submit', '#form-add-configset' , function (e) {
    e.preventDefault();
    var name = $('input[name="configset_name"]').val() ;
    logger(1,'add configset ' + name )
    addConfigset(name);
    $('.add-configset-modal').modal('hide');
});

$(document).on('submit', '#form-addtask' , function (e) {
    e.preventDefault();
    var name = $('input[name="task_name"]').val() ;
    logger(1,'add Lab Task ' + name )
    addLabTask(name).done(function ( task ) {
    // add item in list
    body = '<li class="task-item' + task.id +'">';
    if (ROLE != "user" && LOCK != 1 ) {
        body += '<a class="delete-task" style="margin-right: 5px;" href="javascript:void(0)" data-path="' + task.id + '"><i class="glyphicon glyphicon-trash" title="Delete"></i> ';
        body += '<a class="action-taskedit" href="javascript:void(0)" data-path="' + task.id + '"><i class="glyphicon glyphicon-edit" title="Edit"></i> ';
    }
    body += '<a class="action-labtaskget" data-path="' + task.id + '" href="javascript:void(0)" title="' + name + '">&nbsp;&nbsp;' + name + '</a>';
    body += '</a></li>';

    $("ul.ul-task-list").append(body);
    });
    $('.add-task-modal').modal('hide');
});

$(document).on('submit', '#form-renametask' , function (e) {
    e.preventDefault();
    var name = $('input[name="task_name"]').val() ;
    var id = $('input[name="id"]').val() ;
    logger(1,'Rename Lab Task to ' + name + '('+id+')')
        editLabTask(id,null,name).done(function () {
      $('.rename-task-modal').modal('hide');
      $('.action-labtaskget[data-path="'+id+'"]').empty().append(name)
        });

});


// Task Edit
$(document).on('click', '.action-taskedit', function (e) {
    if ( LOCK == 1 ) {
    return 0;
    }
    var id = $(this).attr('data-path');
    if ( $(".action-labtaskget.selected").attr('data-path') !=  id )  {
       if (typeof ( CurCKEDITOR ) !== 'undefined'  && CurCKEDITOR.state == 'ready' ) { CurCKEDITOR.destroy() }
       $(".action-labtaskget").removeClass("selected");
       $(".action-labtaskget[data-path='"+ id +"'").addClass("selected");
       printTaskInForm(id).done( function () {
         $("#task-buttons").show();
         logger(1, 'DEBUG: action = action-edit task');
         $('#task-data').attr('contenteditable', 'true').addClass('editable').focus()
	 CKEDITOR.ClassicEditor.create ( document.querySelector('#task-data'), editorConfigPDF).then( function (CurCKEDITOR) { window.CurCKEDITOR = CurCKEDITOR; window.CurCKEDITOR.editing.view.focus();})
         $(window).bind("resize",function() {
            logger ( 1, $(".modal-bodySL").height() ) ;
         });
         $("#task-data-content").css('height', '');
       });
    } else {
       $("#task-buttons").show();
       logger(1, 'DEBUG: action = action-edit task');
       $('#task-data').attr('contenteditable', 'true').addClass('editable').focus()
       if (typeof ( CurCKEDITOR ) !== 'undefined'  && CurCKEDITOR.state == 'ready' ) { CurCKEDITOR.destroy() }
       CKEDITOR.ClassicEditor.create ( document.querySelector('#task-data'), editorConfigPDF).then( function (CurCKEDITOR) { window.CurCKEDITOR = CurCKEDITOR; window.CurCKEDITOR.editing.view.focus();})
       $(window).bind("resize",function() {
          logger ( 1, $(".modal-bodySL").height() ) ;
       });
       $("#task-data-content").css('height', '');
    }
});

$(document).on('submit', '#save-task', function (e) {
      e.preventDefault();
      new_data = CurCKEDITOR.getData();
      id=$('.action-labtaskget.selected').attr('data-path') ;
      name=$('.action-labtaskget.selected').attr('title') ;
      editLabTask(id,new_data,name).done(function () {
          CurCKEDITOR.destroy();
          $("#task-buttons").hide();
          $("#task-data-content").css('height','100%');
          $('#task-data').attr('contenteditable', 'false').removeClass('editable')
      });
});

$(document).on('click', '#cancel-taskedit', function (e) {
    e.preventDefault()
    CurCKEDITOR.destroy();
    $("#task-buttons").hide();
    $("#task-data-content").css('height','100%')
    $('#task-data').attr('contenteditable', 'false').removeClass('editable')
});


$('body').on('click', '.delete-task', function (ev) {
    var id = $(this).attr('data-path')
    var self = $(this);
    var textQuestion = 'Are you sure to delete this task?'
    var body = '<div class="form-group">' +
                    '<div class="question">'+ textQuestion +'</div>' +
                    '<div class="col-md-5 col-md-offset-3">' +
                        '<button id="taskdelete" class="btn btn-success"  data-path="'+id+'" data-dismiss="modal">Yes</button>' +
                        '<button type="button" class="btn" data-dismiss="modal">Cancel</button>' +
                    '</div>' +
                '</div>'
    var title = "Warning"
    addModal(title, body, "", "make-red make-small");
    $('#taskdelete').on('click', function (e) {
        logger(1, 'DEBUG: action = taskdelete');
        var id = self.attr('data-path')
        deleteTask(id).done(function () {
      // remove from list
      $('.task-item'+id).remove();
        }).fail(function (message) {
            addModalError(message);
        });
    });
})
$('body').on('click', '.action-taskframe', function (ev) {
    $('#context-menu').remove();
    var id = $(this).attr('data-path')
    var name = $(this).attr('data-name')
    TaskframeOpen('task_'+id, name )
});

$(document).on('submit', '#form-edit-configset' , function (e) {
    e.preventDefault();
    var name = $('input[name="configset_name"]').val() ;
    var id = $('#configsetselect option:selected').val() ;
    logger(1,'edit configset ' + name );
    editConfigset(id,name);
    $('.edit-configset-modal').modal('hide');
});

$(document).on('change', '#configsetselect', function (e) {
   window.cur_cfs = ( window.cur_cfs == null ? 'default' : window.cur_cfs );
   window.old_cfs = window.cur_cfs;
   window.cur_cfs = $('#configsetselect option:selected').val() ;
   $('#body').children('.modal').attr('skipRedraw', true);
   $('.modal-backdrop').remove();
   $('.modal-wide').remove();
   $.when(getNodeConfigs(window.cur_cfs,null),getConfigSets()).done(function (configs,configsets) {
        addModalWide(MESSAGES[120], new EJS({ url: '/themes/default/ejs/action_configsget.ejs?n=' + Date.now() }).render({ configs: configs, configsets: configsets }), '');
    $('#configsetselect option[value="' + window.cur_cfs + '"]').prop('selected', true);
    }).fail(function (message) {
        addModalError(message);
    });
});

$(document).on('click','.action-applyconfigset', function(e) {
    /// Create modal
        //printFormEditConfigset();
    //setStartupData(id, true, 0, name);
    var name = $(this).data('name')
    $.each($('.change_config_status'), function ( el ) {
    var id = $(this).attr('data-path');
        cfs = $('#configsetselect option:selected').val() ;
        var name = $(this).attr('data-name');
        logger(1, 'DEBUG:' + id + ' ' + name );
        if ( cfs == 'default' ) { cfs = 1 } ;
        //setStartupData(id, true, cfs , name);
        if ( $(this).val() == '1' ) {
            setStartupData(id, true, cfs , name);
        } else {
            $(this).click() ;
        }
    });
});

$(document).on('click','.action-noconfigset', function(e) {
    /// Create modal
        //printFormEditConfigset();
        //setStartupData(id, true, 0, name);
        var name = $(this).data('name')
        $.each($('.change_config_status'), function ( el ) {
        var id = $(this).attr('data-path');
                cfs = $('#configsetselect option:selected').val() ;
                var name = $(this).attr('data-name');
                logger(1, 'DEBUG:' + id + ' ' + name );
                if ( cfs == 'default' ) { cfs = 1 } ;
                //setStartupData(id, true, cfs , name);
                if ( $(this).val() == '0' ) {
                        //setStartupData(id, true, 0 , name);
                } else {
                        $(this).click() ;
                }
        });
});

$(document).on('click','.action-download-configset', function(e) {
    window.zcfs = $('#configsetselect option:selected').text() ;
    $.when(getNodeConfigs(window.cur_cfs,null)).done(function (configs) {
        var zip = new JSZip();
        window.zipfolder= zip.folder(window.zcfs);
        $.each(configs, function ( key, config ) {
            logger(1, 'DEBUG' + config['name']) ;
            window.zipfolder.file(key + '_' + config['name'] + '.txt' , config['configdata']);
        });
        zip.generateAsync({type:"blob"}).then(function (blob) {
            saveAs(blob, window.zcfs + '.zip' );
        });

    });
});

$(document).on('click','.action-upload-configset', function(e) {
    printFormUploadConfigset();
});

$(document).on('submit', '#form-upload-configset', function (e) {
    e.preventDefault();
    var configset_file = $('input[name="upload[configset]"]')[0].files[0];
    var configset_name = $('input[name="configset_name"]').val();
    if ( configset_name == '' ) {
        configset_name = 'Import' ;
    }
    $.when(addConfigset(configset_name)).done( function ( result ) {
        logger(1, 'DEBUG:'  + configset_name + ' ' + result['id']);
        var reader = new FileReader();
        reader.onload = function(){
        	var data = reader.result;
		console.log ( data ) ;
		JSZip.loadAsync(data).then(function (zip) {
			console.log ( zip ) ;
			Object.keys(zip.files).forEach(function (filename) {
				zip.files[filename].async('string').then(function (fileData) {
		                        logger(1, 'DEBUG: complete path '+ filename )
					var directory=new RegExp(filename.replace(/\/.*/,'') , "g");
					var node_id=filename.replace(directory,'')
					node_id = node_id.replace(/^\//,'').replace(/_.*/,'');
					logger(1, 'DEBUG: node_id '+ node_id );
					// add config to node_id for cfs result['id']
					if ( fileData != '' ) {
						saveNodeConfig( node_id , result['id'] ,fileData );
					}
					logger(1, 'DEBUG:'  + result['id']);
				});
			});
		});
	}
	reader.readAsArrayBuffer(configset_file);
    });
    $('.upload-modal').modal('hide');
});

// Logical topology scrolling  with mouse
LTcurDown = false,
LTcurYPos = 0,
LTcurXPos = 0;
$(document).on('mousedown','.picture-img-autosozed', function(m) {
    //alert ('mousedown')
    LTcurDown = true;
    var zoom = $('#picslider').slider("value")/100
    LTcurYPos = (m.pageY)
    LTcurXPos = (m.pageX)
});
$(document).on('mouseup','.picture-img-autosozed', function(m) {
    LTcurDown = false;
});

$(document).on('mousemove','.picture-img-autosozed', function(e) {
        if(LTcurDown === true){
        var zoom = $('#picslider').slider("value")/100
        logger (1,"zoom: " + zoom);
             $('.logicaltopology').scrollTop(($('.logicaltopology').scrollTop()+$('.logicaltopology').scrollTop() + (LTcurYPos - e.pageY))/zoom);
             $('.logicaltopology').scrollLeft(($('.logicaltopology').scrollLeft()+$('.logicaltopology').scrollLeft() + (LTcurXPos - e.pageX))/zoom);
    }
});

var chatresize = 0 ;
$(document).on('mousedown','#lab-chat', function(e) {
        if (e.offsetX < 5 ) {
            chatresize  = 1
            $("#body").css('cursor','ew-resize')
            $("#body").css({'MozUserSelect':'none','webkitUserSelect':'none'})
        }
});

$(document).on('mouseover','#lab-chat', function(e) {
        if (e.offsetX < 5 ) {
            $("#body").css('cursor','ew-resize')
        }
});

$(document).on('mouseout','#lab-chat', function(e) {
        if ( chatresize == 0 )
            $("#body").css('cursor','auto')
});


$(document).mouseup( function () {
    chatresize = 0 ;
    $("#body").css({'MozUserSelect':'','webkitUserSelect':''})
    $("#body").css('cursor','auto')
});

$(document).on('mousemove','*', function(e) {
        if ( chatresize  == 1 ) {
            right = $('#body').width() - e.clientX ;
                        $('#lab-viewport').css('right', right + 'px');
                        $('#lab-chat').css('width',right +'px');
            $('#alert_container').css('right',(right + 10) + 'px');
            $('#notification_container').css('right',(right + 10) + 'px');
        }
});

$(document).on('mousemove','#lab-chat', function(e) {
        if (e.offsetX > 5 ) {
            $("#body").css('cursor','auto')
        }
});

$(document).on('click','#confirmLock', function(e) {
    p1 = $('input[name=lockpass]').val();
    p2 = $('input[name=lockpassconfirm]').val();
    if ( p1 == p2 ) {
        $('.btn').prop('disabled',true);
        lockLab(p1);
    }
});

$(document).on('click','#confirmUnlock', function(e) {
        p1 = $('input[name=lockpass]').val();
        $('.btn').prop('disabled',true);
        unlockLab(p1);
});


$(document).on('click','.notification-badge, #alert_container > b > .fa-angle-down', function(e) {
            if  ( $(' #alert_container > b > .fa-angle-up').length > 0 ) {
		$('#alert_container > b > .fa-angle-up').click();
		return ; 
	    }
            $('#alert_container > b > .fa-angle-down').removeClass('fa-angle-down').addClass('fa-angle-up')
        //if ( $('.alert-success').hasClass('hidden') ) {
            $('.alert').removeClass('hidden').addClass('visible')
            $('.alert').removeClass('unread')
            $('.alert').show()
//        } else { 
//            $('.alert-success').addClass('hidden')
//	}
        $('#success').badge( $('.inner > .alert.unread').length, 'inline', true );
        $('#fail').badge( $('.inner > .alert.unread').length, 'inline', true );
//	if ( $('.alert-success').length == 0 && $('.alert-danger').length == 0 ) {
//		$('#alert_container').detach();
//		$('#notification_container').detach();
//	}
}); 

//$(document).on('click','#fail > .notification-badge', function(e) {
 //       if ( $('.alert-danger').hasClass('hidden') ) {
//            $('.alert-danger').removeClass('hidden').addClass('visible')
//            $('.alert-danger').removeClass('unread')
//            $('.alert-danger').show()
//        } else {
//           $('.alert-danger').addClass('hidden')
//        }
//        $('#fail').badge( $('.inner > .alert-danger.unread').length, 'inline', true );
//        if ( $('.alert-success').length == 0 && $('.alert-danger').length == 0 ) {
//                $('#alert_container').detach();
//                $('#notification_container').detach();
//        }
//});

$(document).on('click','#alert_container > b > .fa-angle-up', function(e) {
          $('#alert_container > b > .fa-angle-up').removeClass('fa-angle-up').addClass('fa-angle-down')
          $('.alert').removeClass('hidden').removeClass('visible').removeClass('unread').addClass('hidden')
          $('#success').badge( $('.inner > .alert.unread').length, 'inline', true );
          $('#fail').badge( $('.inner > .alert.unread').length, 'inline', true );
});

$(document).on('click','#alert_container > b > .fa-times', function(e) {
          if ( $('.alert.visible').length > 0 ) { 
		$('.alert.visible').detach()
	  } else {
		$('.alert').detach()
	  }
	  if ( $('.alert-success').length == 0 && $('.alert-danger').length == 0 ) {
                $('#alert_container').detach();
                $('#notification_container').detach();
          }
});


//  $('#lab-sidebar ul').append('<li><a class="action-nightmode" href="javascript:void(0)" title="' + MESSAGES[225] + '"><i class="fas fa-moon"></i></a></li>'); 


//  $('#lab-sidebar ul').append('<li><a class="action-nightmode" href="javascript:void(0)" title="' + MESSAGES[225] + '"><i class="fas fa-moon"></i></a></li>'); 


$(document).on('click','.action-nightmode', function(e){
  $('.action-nightmode').replaceWith('<a class="action-lightmode" href="javascript:void(0)" title="' + MESSAGES[236] + '"><i class="fas fa-sun"></i>'+MESSAGES[236]+'</a>')
  if ( GRID == 1 ) {
  	$('#lab-viewport').css('background-image','url(/themes/adminLTE/unl_data/img/grid-dark.png)');
  } else {
	$('#lab-viewport').css('background-image','none');
	$('#lab-viewport').css('background-color','#28353c');
  }
  $('.node_name').css('color','#b8c7ce')
  $('.network_name').css('color','#b8c7ce')
  $.cookie('topo', 'dark', {
      expires: 90
  });
});


$(document).on('click','.action-lightmode', function(e){
  $('.action-lightmode').replaceWith('<a class="action-nightmode" href="javascript:void(0)" title="' + MESSAGES[235] + '"><i class="fas fa-moon"></i>'+MESSAGES[235]+'</a>')
  if ( GRID == 1 ) {
  	$('#lab-viewport').css('background-image','url(/themes/adminLTE/unl_data/img/grid.png)');
  } else {
	$('#lab-viewport').css('background-image','none');
	$('#lab-viewport').css('background-color','#ffffff');
  }
  $('.node_name').css('color','#333')
  $('.network_name').css('color','#333')
  $.cookie('topo', 'light', {
      expires: 90
  });
});

$(document).on('click','.action-labelon', function(e){
  $('.jtk-overlay').show();
  $('.action-labelon').replaceWith('<a class="action-labeloff" href="javascript:void(0)" title="' + MESSAGES[238] + '"><i class="fas fa-tag"></i>'+MESSAGES[238]+'</a>') 
  $.cookie('labels', 'on', {
      expires: 90
  });
});

$(document).on('click','.action-labeloff', function(e){
  $('.jtk-overlay').hide();
  $('.action-labeloff').replaceWith('<a class="action-labelon" href="javascript:void(0)" title="' + MESSAGES[237] + '"><i class="fas fa-tag strike"></i>'+MESSAGES[237]+'</a>')
  $.cookie('labels', 'off', {
      expires: 90
  });
});

$(document).on('mouseup','.node_frame, .network_frame, .customShape, .line', function(e){
        if ( $(this).hasClass("jtk-dragged") ) {
                e.stopPropagation();
                e.preventDefault();
                console.log(  e.currentTarget  )
                ObjectPosUpdate (e.currentTarget)
        }    
        console.log('Moved' )
});
