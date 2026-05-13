// vim: syntax=javascript tabstop=4 softtabstop=0 noexpandtab laststatus=1 ruler

/**
 * html/themes/default/js/functions.js
 *
 * Functions
 *
 * @author Andrea Dainese <andrea.dainese@gmail.com>
 * @author Alain Degreffe <eczema@ecze.com>
 * @copyright 2014-2016 Andrea Dainese
 * @copyright 2017-2018 Alain Degreffe
 * @license BSD-3-Clause https://github.com/dainok/unetlab/blob/master/LICENSE
 * @link http://www.eve-ng.net/
 * @version 20181203
 */



var contextMenuOpen = false;
var globaltemplates = new Array()

// Basename: given /a/b/c return c
function basename(path) {
    return path.replace(/\\/g, '/').replace(/.*\//, '');
}

// Dirname: given /a/b/c return /a/b
function dirname(path) {
    var dir = path.replace(/\\/g, '/').replace(/\/[^\/]*$/, '');
    if (dir == '') {
        return '/';
    } else {
        return dir;
    }
}

// Alert management
//window.notification = Array() ;
function addMessage(severity, message, notFromLabviewport) {
    //notification.push({severity: severity, message: message });
    // Severity can be success (green), info (blue), warning (yellow) and danger (red)
    // Param 'notFromLabviewport' is used to filter notification
    $('#alert_container').show();
    var timeout = 10000;        // by default close messages after 10 seconds
    if (severity == 'danger') timeout = 5000;
    if (severity == 'alert') timeout = 10000;
    if (severity == 'warning') timeout = 10000;

    // Add notifications to #alert_container only when labview is open

    if ($("#lab-viewport").length) {

        if (!$('#alert_container').length) {
            // Add the frame container if not exists
            $('body').append('<div id="alert_container"><b><span id="success" style="padding-right:20px; padding-left:20px;">Success</span><span id="fail" style="width:30px;cursor: pointer">Error</span><i class="fa fa-times pull-right" style="margin: 5px;cursor: pointer"></i><i class="fa fa-angle-down pull-right" style="margin: 5px; cursor:pointer"></b><div class="inner"></div></div>');
            $('#success').badge(0,'inline', true) ;
            $('#fail').badge(0,'inline', true) ;
            $('#alert_container').css('right',( $('#body').width() - $('#lab-viewport').width() - 30) + 'px');
        }

        var msgalert = $('<div class="alert alert-' + severity.toLowerCase() + ' hidden unread">').append(message);
        // Add the alert div to top (prepend()) or to bottom (append())
        $('#alert_container .inner').prepend(msgalert);
        if ( $('.inner > .alert.visible').length > 0 )  $('.inner > .alert.hidden').removeClass('hidden').addClass('visible')

    }

    if ($("#lab-viewport").length || (!$("#lab-viewport").length && notFromLabviewport &&  $('.inner > .alert.visible').length < 1)) {

        if (!$('#notification_container').length) {
        $('body').append('<div id="notification_container"></div>');
        $('#notification_container').css('right',( $('#body').width() - $('#lab-viewport').width() -30 ) + 'px');
        }
        //if (severity == "danger" )

        if (severity != "" && severity != "success" ) {
            var notification_alert = $('<div class="alert alert-' + severity.toLowerCase() + ' fade in">').append($('<button type="button" class="close" data-dismiss="alert">').append("&times;")).append(message);

            $('#notification_container').prepend(notification_alert);
            if (timeout) {
                window.setTimeout(function () {
                    notification_alert.alert("close");
                }, timeout);
            }
        }
    }
    $('#success').badge( $('.inner > .alert-success.unread').length, 'inline', true );
    $('#fail').badge( $('.inner > .alert.unread').length - $('.inner > .alert-success.unread').length - $('.inner > .alert-info.unread').length  , 'inline', true );
    $('#alert_container').next().first().slideDown();
}

/* Add Modal
@param prop - helping classes. E.g prop = "red-text capitalize-title"
*/
function addModal(title, body, footer, prop) {
    var html = '<div aria-hidden="false" style="display: block;z-index: 15000;" class="modal ' + ' ' + prop + ' fade in" tabindex="-1" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">' + title + '</h4></div><div class="modal-body">' + body + '</div><div class="modal-footer">' + footer + '</div></div></div></div>';
    $('#body').append(html);
    $('#body > .modal').modal('show');
    $('.modal-dialog').draggable({handle: ".modal-header"});
}

// Add Modal
function addModalError(message) {
    var html = '<div aria-hidden="false" style="display: block; z-index: 99999" class="modal fade in" tabindex="-1" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">' + MESSAGES[15] + '</h4></div><div class="modal-body">' + message + '</div><div class="modal-footer"></div></div></div></div>';
    $('#body').append(html);
    $('#body > .modal').modal('show');
}

// Add Modal
function addModalWide(title, body, footer, property) {
    if ( $('.modal.fade.in').length > 0 && property.match('/second-win/') != null ) return ;
    var prop = property || "";
    console.log("### title is", title);
    var addittionalHeaderBtns = "";
    if (title.toUpperCase() == "STARTUP-CONFIGS" || title.toUpperCase() == "CONFIGURED NODES" ||
        title.toUpperCase() == "CONFIGURED TEXT OBJECTS" ||
        title.toUpperCase() == "CONFIGURED NETWORKS" || title.toUpperCase() == "CONFIGURED NODES" ||
        title.toUpperCase() == "STATUS" || title.toUpperCase() == "LOGICAL MAPS" || title.toUpperCase() == "LAB TASK(S)" ) {
        addittionalHeaderBtns = '<i class="glyphicon glyphicon-resize-full action-modal-fullscreen pull-right" style="color: red;"></i>';
        addittionalHeaderBtns += '<i title="Make transparent" class="glyphicon glyphicon-certificate pull-right action-changeopacity"></i>';
    }
    var html = '<div aria-hidden="false"  style="display: block;z-index: 4002; " class="modal modal-wide ' + prop + ' fade in " tabindex="-1" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"></i><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + addittionalHeaderBtns + '<h4 class="modal-title">' + title + '</h4></div><div class="modal-body">' + body + '</div><div class="modal-footer">' + footer + '</div></div></div></div>';
    $('#body').append(html);
    $('#body > .modal').modal('show');
}

// Add Modeless
function addModelessWide(title, body, footer, property) {
    if ( $('.modal.fade.in').length > 0 && property.match('/second-win/') != null ) return ;
    var prop = property || "";
    console.log("### title is", title);
    var addittionalHeaderBtns = "";
    if (title.toUpperCase() == "STARTUP-CONFIGS" || title.toUpperCase() == "CONFIGURED NODES" ||
        title.toUpperCase() == "CONFIGURED TEXT OBJECTS" ||
        title.toUpperCase() == "CONFIGURED NETWORKS" || title.toUpperCase() == "CONFIGURED NODES" ||
        title.toUpperCase() == "STATUS" || title.toUpperCase() == "LOGICAL MAPS" || title.toUpperCase() == "LAB TASK(S)" ) {
        addittionalHeaderBtns = '<i class="glyphicon glyphicon-resize-full action-modal-fullscreen pull-right" style="color: red;"></i>';
        addittionalHeaderBtns += '<i title="Make transparent" class="glyphicon glyphicon-certificate pull-right action-changeopacity"></i>';
    }
    var html = '<div class="modal-dialog modeless fade in"><div class="modal-content"><div class="modal-header"></i><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + addittionalHeaderBtns + '<h4 class="modal-title">' + title + '</h4></div><div class="modal-body">' + body + '</div><div class="modal-footer">' + footer + '</div></div></div>';
    $('#body').append(html);
    $('#body > .modal-dialog').modal('show');
}

// Add Modeless styleless
function addModelessWideSL(title, body, footer, property) {
    if ( $('.modal.fade.in').length > 0 && property.match('/second-win/') != null ) return ;
    var prop = property || "";
    console.log("### title is", title);
    var addittionalHeaderBtns = "";
    if (title.toUpperCase() == "STARTUP-CONFIGS" || title.toUpperCase() == "CONFIGURED NODES" ||
        title.toUpperCase() == "CONFIGURED TEXT OBJECTS" ||
        title.toUpperCase() == "CONFIGURED NETWORKS" || title.toUpperCase() == "CONFIGURED NODES" ||
        title.toUpperCase() == "STATUS" || title.toUpperCase() == "LOGICAL MAPS" || title.toUpperCase() == "LAB TASK(S)" ) {
        addittionalHeaderBtns = '<i class="glyphicon glyphicon-resize-full action-modal-fullscreen pull-right" style="color: red;"></i>';
        addittionalHeaderBtns += '<i title="Make transparent" class="glyphicon glyphicon-certificate pull-right action-changeopacity"></i>';
    }
    var html = '<div aria-hidden="false"  style="display: block;z-index: 4002;" class="modal modal-wide full-height fade in" role="dialog"><div class="modal-dialog full-height"><div class="modal-content"><div class="modal-header"></i><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + addittionalHeaderBtns + '<h4 class="modal-title">' + title + '</h4></div><div class="modal-bodySL">' + body + '</div><div class="modal-footer">' + footer + '</div></div></div></div>';
    $('#body').append(html);
    $('#body > .modal').modal('show');
}



// Export node(s) config
function cfg_export(node_id) {
    var deferred = $.Deferred();
    var lab_filename = $('#lab-viewport').attr('data-path');
    var url = '/api/labs' + lab_filename + '/nodes/' + node_id + '/export';
    var type = 'PUT';
    $.ajax({
        cache: false,
        timeout: TIMEOUT * 10,  // Takes a lot of time
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: config exported.');
                deferred.resolve(data['data']);
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// // Export node(s) config recursive
function recursive_cfg_export(nodes, i) {
    i = i - 1
    addMessage('info', nodes[Object.keys(nodes)[i]]['name'] + ': ' + MESSAGES[138])
    var deferred = $.Deferred();
    var lab_filename = $('#lab-viewport').attr('data-path');
    if (typeof nodes[Object.keys(nodes)[i]]['path'] === 'undefined') {
        var url = '/api/labs' + lab_filename + '/nodes/' + Object.keys(nodes)[i] + '/export';
    } else {
        var url = '/api/labs' + lab_filename + '/nodes/' + nodes[Object.keys(nodes)[i]]['path'] + '/export';
    }
    logger(1, 'DEBUG: ' + url);
    var type = 'PUT';
    $.ajax({
        cache: false,
        timeout: TIMEOUT * 10 * i,  // Takes a lot of time
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: config exported.');
                addMessage('success', nodes[Object.keys(nodes)[i]]['name'] + ': ' + MESSAGES[79])
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                addMessage('danger', nodes[Object.keys(nodes)[i]]['name'] + ': ' + data['message']);
            }
            if (i > 0) {
                recursive_cfg_export(nodes, i);
            } else {
                addMessage('info', 'Export All: done');
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            addMessage('danger', nodes[Object.keys(nodes)[i]]['name'] + ': ' + message);
            if (i > 0) {
                recursive_cfg_export(nodes, i);
            } else {
                addMessage('info', 'Export All: done');
            }
        }
    });
    return deferred.promise();
}

// Clone selected labs
function cloneLab(form_data) {
    var deferred = $.Deferred();
    var type = 'POST';
    var url = '/api/labs';
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: JSON.stringify(form_data),
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: created lab "' + form_data['name'] + '" from "' + form_data['source'] + '".');
                deferred.resolve();
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Close lab
function closeLab() {
    var deferred = $.Deferred();
   // $.when(getNodes()).done(function (values) {
   //     var running_nodes = false;
   //     $.each(values, function (node_id, node) {
   //         if (node['status'] > 1) {
   //             running_nodes = true;
   //         }
   //     });
   // running_nodes = false;
   //     if (running_nodes == false) {
	    //addModal('Refresh preview and closing lab in progress...','<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>','<center>Please wait...</center>');
            var url = '/api/labs/close';
            var type = 'DELETE';
            $.ajax({
                cache: false,
                timeout: TIMEOUT,
                type: type,
                url: encodeURI(url),
                dataType: 'json',
                success: function (data) {
                    if (data['status'] == 'success') {
                        logger(1, 'DEBUG: lab closed.');
                        LAB = null;
                        deferred.resolve();
                    } else {
                        // Application error
                        logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                        deferred.reject(data['message']);
                    }
                },
                error: function (data) {
                    // Server error
                    var message = getJsonMessage(data['responseText']);
                    logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
                    logger(1, 'DEBUG: ' + message);
                    deferred.reject(message);
                }
            });
     //   } else {
     //       deferred.reject(MESSAGES[131]);
     //   }
    //}).fail(function (message) {
        // Lab maybe does not exist, closing
   //     var url = '/api/labs/close';
   //     var type = 'DELETE';
   //     $.ajax({
   //         cache: false,
   //         timeout: TIMEOUT,
   //         type: type,
   //         url: encodeURI(url),
   //         dataType: 'json',
   //         success: function (data) {
   //             if (data['status'] == 'success') {
   //                 logger(1, 'DEBUG: lab closed.');
   //                 LAB = null;
   //                 deferred.resolve();
   //             } else {
   //                 // Application error
   //                 logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
   //                 deferred.reject(data['message']);
   //             }
   //         },
   //         error: function (data) {
                // Server error
   //             var message = getJsonMessage(data['responseText']);
   //             logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
   //             logger(1, 'DEBUG: ' + message);
   //             deferred.reject(message);
   //         }
   //     });
   // });
    return deferred.promise();
}

// Delete folder
function deleteFolder(path) {
    var deferred = $.Deferred();
    var type = 'DELETE';
    var url = '/api/folders' + path;
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: folder "' + path + '" deleted.');
                deferred.resolve();
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Delete lab
function deleteLab(path) {
    var deferred = $.Deferred();
    var type = 'DELETE';
    var url = '/api/labs' + path;
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: lab "' + path + '" deleted.');
                deferred.resolve();
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Delete network
function deleteNetwork(id) {
    var deferred = $.Deferred();
    var type = 'DELETE';
    var lab_filename = $('#lab-viewport').attr('data-path');
    var url = '/api/labs' + lab_filename + '/networks/' + id;
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: network deleted.');
                deferred.resolve(data);
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

//Suspend Network
function suspendLink( nodeId, interfaceId ) {
   var deferred = $.Deferred();
   var type = 'PUT';
   var lab_filename = $('#lab-viewport').attr('data-path');
   var url = '/api/labs' + lab_filename + '/suspend' ;
   var form_data = {};
   form_data['nodeId'] = nodeId ;
   form_data['interfaceId'] = interfaceId ; 
   $.ajax({
           cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
	data: JSON.stringify(form_data),
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: network suspended.');
                deferred.resolve(data);
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

//Resume Network
function resumeLink( nodeId, interfaceId ) {
   var deferred = $.Deferred();
   var type = 'PUT';
   var lab_filename = $('#lab-viewport').attr('data-path');
   var url = '/api/labs' + lab_filename + '/resume';
   var form_data = {};
   form_data['nodeId'] = nodeId ;
   form_data['interfaceId'] = interfaceId ;
   $.ajax({
           cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: JSON.stringify(form_data),
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: network suspended.');
                deferred.resolve(data);
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}


// Delete node
function deleteNode(id) {
    var deferred = $.Deferred();
    var type = 'DELETE';
    var lab_filename = $('#lab-viewport').attr('data-path');
    var url = '/api/labs' + lab_filename + '/nodes/' + id;
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: node deleted.');
                deferred.resolve();
        } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Delete user
function deleteUser(path) {
    var deferred = $.Deferred();
    var type = 'DELETE';
    var url = '/api/users/' + path;
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: user "' + path + '" deleted.');
                deferred.resolve();
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Export selected folders and labs
function exportObjects(form_data) {
    var deferred = $.Deferred();
    var type = 'POST';
    var url = '/api/export';
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: JSON.stringify(form_data),
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: objects exported into "' + data['data'] + '".');
                deferred.resolve(data['data']);
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// HTML Form to array
function form2Array(form_name) {
    var form_array = {};
    $('form :input[name^="' + form_name + '["]').each(function (id, object) {
        // INPUT name is in the form of "form_name[value]", get value only
        form_array[$(this).attr('name').substr(form_name.length + 1, $(this).attr('name').length - form_name.length - 2)] = $(this).val();
    });
    return form_array;
}

// HTML Form to array by row
function form2ArrayByRow(form_name, id) {
    var form_array = {};

    $('form :input[name^="' + form_name + '["][data-path="' + id +'"]').each(function (id, object) {
        // INPUT name is in the form of "form_name[value]", get value only
        form_array[$(this).attr('name').substr(form_name.length + 1, $(this).attr('name').length - form_name.length - 2)] = $(this).val();
    });
    return form_array;
}

// Get JSon message from HTTP response
function getJsonMessage(response) {
    var message = '';
    try {
        message = JSON.parse(response)['message'];
        code = JSON.parse(response)['code'];
        if (code == 412) {
            // if 412 should redirect (user timed out)
            window.setTimeout(function () {
                location.reload();
            }, 2000);
        }
    } catch (e) {
        if (response != '') {
            message = response;
        } else {
            message = 'Undefined message, check if the EVE-NG VM is powered on. If it is, see <a href="/Logs" target="_blank">logs</a>.';
        }
    }
    return message;
}

// Get Capture
function getCapture(lab_id,node_id,id,ifname) {
    logger(1, 'DEBUG: call api to create docker');
    //@return 0 ;
    var deferred = $.Deferred();
    var form_data = {};
    var lab_filename = $('#lab-viewport').attr('data-path');
    form_data['lab_id'] = lab_id;
    form_data['node_id'] = node_id;
    form_data['if_id'] = id;
    var url = '/api/capture'+lab_filename;
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
                logger(1, 'DEBUG: docker capture created.');
        if ( data['url'].indexOf('token') != -1 ) {
            iframeOpen (  $('#node'+node_id).attr('data-name') + '_' + ifname , lab_id + '_' + node_id + '_' + id )
            $('body').append('<a id="capture" href="/'+data['url']+'" target="' + $('#node'+node_id).attr('data-name') + '_' + ifname + '_' + lab_id + '_' + node_id + '_' + id + '">&nbsp;</a>');
            $('#framewrap'+lab_id + '_' + node_id + '_' + id).removeClass('hidden')
            $('#framewrap'+lab_id + '_' + node_id + '_' + id).addClass('capture')
            $('#framewrap'+lab_id + '_' + node_id + '_' + id).click()
        } else {
            $('body').append('<a id="capture" href="/'+data['url']+'">&nbsp;</a>');
        }
        $('#capture')[0].click();
        $('#capture').remove();
                deferred.resolve(data);
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
            //addMessage(data['status'], data['message']);

        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}


// Get lab info
function getLabInfo(lab_filename) {
    var deferred = $.Deferred();
    var url = '/api/labs' + lab_filename;
    var type = 'GET';
    //if ( typeof SPY !== 'undefined' && SPY != null ) {
    //        url += '/'+SPY
    //}
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: lab "' + lab_filename + '" found.');
		LINK_WIDTH =  data['data']['linkwidth'];
		GRID = data['data']['grid'];
		// Tune colors
		if ( $.cookie("topo")  != undefined && $.cookie("topo") == 'dark' ) {
                	if ( GRID == 1 ) {
                        	$('#lab-viewport').css('background-image','url(/themes/adminLTE/unl_data/img/grid-dark.png)');
                	} else {
                        	$('#lab-viewport').css('background-image','none');
                        	$('#lab-viewport').css('background-color','#28353c');
                	}
                	$('.node_name').css('color','#b8c7ce')
                	$('.network_name').css('color','#b8c7ce')
            	} else {
                	if ( GRID == 1 ) {
				$('#lab-viewport').css('background-image','url(/themes/adminLTE/unl_data/img/grid.png)');
			} else {
				$('#lab-viewport').css('background-image','none');
				$('#lab-viewport').css('background-color','#ffff');
			}
			$('.node_name').css('color','#333')
			$('.network_name').css('color','#333')
                }
                deferred.resolve(data['data']);
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Get Cluster List  Full 
function getCluster( full ) {
	var deferred = $.Deferred();
	if ( full == 1 ) { 
		var url = '/api/clusterfull';
	} else {
		var url = '/api/cluster';
		}
	    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: 'GET',
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: cluster list retrieved.');
                deferred.resolve(data['data']);
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Get lab body
function getLabBody() {
    var deferred = $.Deferred();
    var lab_filename = $('#lab-viewport').attr('data-path');
    var url = '/api/labs' + lab_filename + '/html';
    var type = 'GET';
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: lab "' + lab_filename + '" body found.');
                deferred.resolve(data['data']);
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Get lab endpoints
function getLabLinks() {
    var lab_filename = $('#lab-viewport').attr('data-path');
    var deferred = $.Deferred();
    var url = '/api/labs' + lab_filename + '/links';
    var type = 'GET';
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: got available links(s) from lab "' + lab_filename + '".');
                deferred.resolve(data['data']);
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}


// Get lab networks
function getNetworks(network_id) {
    var lab_filename = $('#lab-viewport').attr('data-path');
    var deferred = $.Deferred();
    if (network_id != null) {
        var url = '/api/labs' + lab_filename + '/networks/' + network_id;
    } else {
        var url = '/api/labs' + lab_filename + '/networks';
    }
    var type = 'GET';
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: got network(s) from lab "' + lab_filename + '".');

                deferred.resolve(data['data']);
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

//remove network with type=bridge with 1 node connected on refresh
function deleteSingleNetworks() {
    var deferred = $.Deferred();
    var networksArr=[];

     $.when(getNetworks())
        .then(function (networks) {
            var deleted = [];
            networksArr = networks;

            $.each(networksArr, function (key, value) {
                //if (value.count == 1 && value.type == 'bridge' && value.visibility == 0){
                if (value.count == 1 && value.type == 'ovs' && value.visibility == 0){
                    deleted.push(deleteNetwork(value.id))
                    delete networksArr[key];
                    $('.network' + value.id).remove();
                }
            });

              return $.when.apply(this, deleted)
        }).done(function(){

         deferred.resolve(networksArr);
     }).fail(function (message) {
         deferred.reject(message);
     });

    return deferred.promise();
}

// Get available network types
function getNetworkTypes() {
    var deferred = $.Deferred();
    var url = '/api/list/networks';
    var type = 'GET';
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: got network types.');
                deferred.resolve(data['data'],data['icons'],data['nat_only']);
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Get lab nodes
function getNodes(node_id) {
    var deferred = $.Deferred();
    var lab_filename = $('#lab-viewport').attr('data-path');
    if (node_id != null) {
        var url = '/api/labs' + lab_filename + '/nodes/' + node_id;
    } else {
        var url = '/api/labs' + lab_filename + '/nodes';
    }
    var type = 'GET';
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                // logger(1, 'DEBUG: got node(s) from lab "' + lab_filename + '".');
                deferred.resolve(data['data']);
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}
//Get Lab Interfaces
function getInterfaces() {
	var deferred = $.Deferred();
    var lab_filename = $('#lab-viewport').attr('data-path');
    var url = '/api/labs' + lab_filename + '/interfaces';
    var type = 'GET';
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                // logger(1, 'DEBUG: got node(s) from lab "' + lab_filename + '".');
                deferred.resolve(data['data']);
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Get lab nodes
function getNodesStatus(node_id) {
    var deferred = $.Deferred();
    var lab_filename = $('#lab-viewport').attr('data-path');
    var url = '/api/labs' + lab_filename + '/nodes/status';
    var type = 'GET';
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                // logger(1, 'DEBUG: got node(s) from lab "' + lab_filename + '".');
                deferred.resolve(data['data']);
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
		printPageAuthentication();
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
	    printPageAuthentication();
        }
    });
    return deferred.promise();
}
// Get node startup-config
function getNodeConfigs(cfsid,node_id) {
    var deferred = $.Deferred();
    var lab_filename = $('#lab-viewport').attr('data-path');
    var form_data = {} ;
    //cfsid = $('#configsetselect option:selected').val() ;
    form_data ['cfsid'] = ( cfsid == null ? 'default' : cfsid );
    if (node_id != null) {
        var url = '/api/labs' + lab_filename + '/configs/' + node_id;
    } else {
        var url = '/api/labs' + lab_filename + '/configs' ;
    }
    var type = 'POST';
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
    data: JSON.stringify(form_data),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: got sartup-config(s) from lab "' + lab_filename + '".');
                deferred.resolve(data['data']);
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Get node startup-config
function getConfigSets() {
    var deferred = $.Deferred();
    var lab_filename = $('#lab-viewport').attr('data-path');
    var url = '/api/labs' + lab_filename + '/configsets';
    var type = 'GET';
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: got configsets from lab "' + lab_filename + '".');
                deferred.resolve(data['data']);
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Get lab node interfaces
function getNodeInterfaces(node_id) {
    var deferred = $.Deferred();
    var lab_filename = $('#lab-viewport').attr('data-path');
    var url = '/api/labs' + lab_filename + '/nodes/' + node_id + '/interfaces';
    var type = 'GET';
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                // logger(1, 'DEBUG: got node(s) from lab "' + lab_filename + '".');
                deferred.resolve(data['data']);
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Get lab Task
function getLabTask(task_id) {
    var deferred = $.Deferred();
    var lab_filename = $('#lab-viewport').attr('data-path');
    if (task_id != null) {
        var url = '/api/labs' + lab_filename + '/task/' + task_id;
    } else {
        var url = '/api/labs' + lab_filename + '/tasks';
    }
    var type = 'GET';
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: got tasks(s) from lab "' + lab_filename + '".');
                deferred.resolve(data['data']);
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Get lab pictures
function getPictures(picture_id) {
    var deferred = $.Deferred();
    var lab_filename = $('#lab-viewport').attr('data-path');
    if (picture_id != null) {
        var url = '/api/labs' + lab_filename + '/pictures/' + picture_id;
    } else {
        var url = '/api/labs' + lab_filename + '/pictures';
    }
    var type = 'GET';
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: got pictures(s) from lab "' + lab_filename + '".');
                deferred.resolve(data['data']);
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Get lab pictures
function getPicturesMapped(picture_id) {
        var deferred = $.Deferred();
        var lab_filename = $('#lab-viewport').attr('data-path');
        if (picture_id != null) {
                var url = '/api/labs' + lab_filename + '/picturesmapped/' + picture_id;
        } else {
                var url = '/api/labs' + lab_filename + '/pictures';
        }
        var type = 'GET';
        $.ajax({
                cache: false,
                timeout: TIMEOUT,
                type: type,
                url: encodeURI(url),
                dataType: 'json',
                success: function(data) {
                        if (data['status'] == 'success') {
                                logger(1, 'DEBUG: got pictures(s) from lab "' + lab_filename + '".');
                                deferred.resolve(data['data']);
                        } else {
                                // Application error
                                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                                deferred.reject(data['message']);
                        }
                },
                error: function(data) {
                        // Server error
                        var message = getJsonMessage(data['responseText']);
                        logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
                        logger(1, 'DEBUG: ' + message);
                        deferred.reject(message);
                }
        });
        return deferred.promise();
}


// Get lab topology
function getTopology() {
    var deferred = $.Deferred();
    var lab_filename = $('#lab-viewport').attr('data-path');
    var url = '/api/labs' + lab_filename + '/topology';
    var type = 'GET';
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: got topology from lab "' + lab_filename + '".');
                deferred.resolve(data['data']);
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Get roles
function getRoles() {
    var deferred = $.Deferred();
    var form_data = {};
    var url = '/api/list/roles';
    var type = 'GET';
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: JSON.stringify(form_data),
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: got roles.');
                deferred.resolve(data['data']);
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Get system stats
function getSystemStats() {
    var deferred = $.Deferred();
    var url = '/api/status';
    var type = 'GET';
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: system stats.');
                data['data']['cpu'] = data['data']['cpu'] / 100;
                data['data']['disk'] = data['data']['disk'] / 100;
                data['data']['mem'] = data['data']['mem'] / 100;
                data['data']['cached'] = data['data']['cached'] / 100;
                data['data']['swap'] = data['data']['swap'] / 100;
                deferred.resolve(data['data']);
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Get templates
function getTemplates(template) {
    console.log ( template )
    console.log ( globaltemplates )
    var deferred = $.Deferred();
    console.log  ( Object.keys(globaltemplates).length)
    if ( template != null && typeof globaltemplates[template] !== 'undefined' ) {
            console.log ( 'return well known template')
            deferred.resolve(globaltemplates[template])
    } else {
    	    var url = (template == null) ? '/api/list/templates/' : '/api/list/templates/' + template;
	    var type = 'GET';
	    $.ajax({
        	cache: false,
        	timeout: TIMEOUT,
        	type: type,
        	url: encodeURI(url),
        	dataType: 'json',
        	success: function (data) {
            		if (data['status'] == 'success') {
                		logger(1, 'DEBUG: got template(s).');
				if ( template != null ) { globaltemplates[template] = data['data'] }
                		deferred.resolve(data['data']);
            		} else {
                		// Application error
                		logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                		deferred.reject(data['message']);
            		}
                },
            	error: function (data) {
            		// Server error
            		var message = getJsonMessage(data['responseText']);
            		logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            		logger(1, 'DEBUG: ' + message);
            		deferred.reject(message);
           	}
    	   });
    }
    return deferred.promise();
}

// Get user info
function getUserInfo() {
    var deferred = $.Deferred();
    var url = '/api/auth';
    var type = 'GET';
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        beforeSend: function (jqXHR) {
            if (window.BASE_URL) {
                jqXHR.crossDomain = true;
            }
        },
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: user is authenticated.');
                EMAIL = data['data']['email'];
                FOLDER = (data['data']['folder'] == null) ? '/' : data['data']['folder'];
                LAB = data['data']['lab'];
                LANG = data['data']['lang'];
                NAME = data['data']['name'];
                ROLE = data['data']['role'];
                TENANT = data['data']['tenant'];
                USERNAME = data['data']['username'];
		STICKY = data['data']['sticky'];
                //LABUSER =  ( data['data']['labuser'] == null ) ? USERNAME : data['data']['labuser'] ;
                LABUSER =  data['data']['labuser'];
		SPY = data['data']['spy'];
                deferred.resolve(data['data']);
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Get users
function getUsers(user) {
    var deferred = $.Deferred();
    if (user != null) {
        var url = '/api/users/' + user;
    } else {
        var url = '/api/users/';
    }
    var type = 'GET';
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: got user(s).');
                deferred.resolve(data['data']);
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Logging
function logger(severity, message) {
    if (DEBUG >= severity) {
        console.log(message);
    }
    $('#alert_container').next().first().slideDown();
}

// Logout user
function logoutUser() {
    var deferred = $.Deferred();
    var url = '/api/auth/logout';
    var type = 'GET';
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: user is logged off.');
                if (UPDATEID != null) {
                    // Stop updating node_status
                    clearInterval(UPDATEID);
                }
                deferred.resolve();
            } else {
                // Authentication error
                logger(1, 'DEBUG: internal error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Authentication error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: Ajax error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Move folder inside a folder
function moveFolder(folder, path) {
    var deferred = $.Deferred();
    var type = 'PUT';
    var url = '/api/folders' + folder;
    var form_data = {};
    form_data['path'] = (path == '/') ? '/' + basename(folder) : path + '/' + basename(folder);
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: JSON.stringify(form_data),
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: folder is moved.');
                deferred.resolve();
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Move lab inside a folder
function moveLab(lab, path) {
    var deferred = $.Deferred();
    var type = 'PUT';
    var url = '/api/labs' + lab + '/move';
    var form_data = {};
    form_data['path'] = path;
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: JSON.stringify(form_data),
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: lab is moved.');
                deferred.resolve();
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Delete picture
function deletePicture(lab_file, picture_id, cb) {
    var deferred = $.Deferred();
    var data = [];

    // Delete network
    var url = '/api/labs' + lab_file + '/pictures/' + picture_id;
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: 'DELETE',
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                // Fetching ok
                $('.picture' + picture_id).fadeOut(300, function () {
                    $(this).remove();
                });
                deferred.resolve(data);
            } else {
                // Fetching failed
                addMessage('DANGER', data['status']);
                deferred.reject(data['status']);
            }
        },
        error: function (data) {
            addMessage('DANGER', getJsonMessage(data['responseText']));
            deferred.reject();
        }
    });
    return deferred.promise();
}

// Post login
function postLogin(param) {
    if (UPDATEID != null) {
        // Stop updating node_status
        clearInterval(UPDATEID);
    }
    $('body').removeClass('login');
    if (LAB == null && param == null) {
// Code to new UI
  window.location.href = "/#!/main/" ;
//
        logger(1, 'DEBUG: loading folder "' + FOLDER + '".');
        printPageLabList(FOLDER);
    } else {
        LAB = LAB || param;
        logger(1, 'DEBUG: loading lab "' + LAB + '".');


        printPageLabOpen(LAB);
        // Update node status
        UPDATEID = setInterval('printLabStatus("' + LAB + '")', STATUSINTERVAL);


    }


}
// Post login
function newUIreturn(param) {
    if (UPDATEID != null) {
        // Stop updating node_status
        clearInterval(UPDATEID);
    }
    $('body').removeClass('login');
        window.location.href = "/#/main" ;
}

//set Network

function setNetwork(nodeName,left, top) {
    var deferred = $.Deferred();
    var lab_filename = $('#lab-viewport').attr('data-path');
    var form_data = {};

    form_data['count'] = 1;
    form_data['name'] = 'Net-'+nodeName;
    form_data['type'] = 'bridge';
    //form_data['type'] = 'ovs';
    form_data['left'] = left;
    form_data['top'] = top;
    form_data['visibility'] = 1;
    form_data['postfix'] = 0;

    var url = '/api/labs' + lab_filename + '/networks';
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
                logger(1, 'DEBUG: new network created.');
                deferred.resolve(data);
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
            addMessage(data['status'], data['message']);

        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// set cpulimit
function setCpuLimit(bool) {
    var deferred = $.Deferred();
    var form_data = {};

    form_data['state'] = bool;

    var url = '/api/cpulimit';
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
                logger(1, 'DEBUG: cpulimit updated.');
                deferred.resolve(data);
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
            addMessage(data['status'], data['message']);

        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// set uksm
function setUksm(bool) {
    var deferred = $.Deferred();
    var form_data = {};

    form_data['state'] = bool;

    var url = '/api/uksm';
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
                logger(1, 'DEBUG: UKSM updated.');
                deferred.resolve(data);
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
            addMessage(data['status'], data['message']);

        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// set ksm
function setKsm(bool) {
    var deferred = $.Deferred();
    var form_data = {};

    form_data['state'] = bool;

    var url = '/api/ksm';
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
                logger(1, 'DEBUG: KSM updated.');
                deferred.resolve(data);
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
            addMessage(data['status'], data['message']);

        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}


function setNetworkiVisibility(networkId,visibility) {
    var deferred = $.Deferred();
    var lab_filename = $('#lab-viewport').attr('data-path');
    var form_data = {};
    form_data['visibility'] = visibility;
    var url = '/api/labs' + lab_filename + '/networks/' + networkId;
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
                logger(1, 'DEBUG: network visibility updated.');
                deferred.resolve(data);
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
            addMessage(data['status'], data['message']);

        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Set network position
function setNetworkPosition(network_id, left, top) {
    var deferred = $.Deferred();
    var lab_filename = $('#lab-viewport').attr('data-path');
    var form_data = {};
    form_data['left'] = left;
    form_data['top'] = top;
    var url = '/api/labs' + lab_filename + '/networks/' + network_id;
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
                logger(1, 'DEBUG: network position updated.');
                deferred.resolve();
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
            //addMessage(data['status'], data['message']);

        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Set multiple network position
function setNetworksPosition(networks) {
    var deferred = $.Deferred();
    if ( networks.length == 0 ) { deferred.resolve(); return deferred.promise(); }
    var lab_filename = $('#lab-viewport').attr('data-path');
    var form_data = {};
    form_data = networks;
    var url = '/api/labs' + lab_filename + '/networks' ;
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
                logger(1, 'DEBUG: network position updated.');
                deferred.resolve();
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
            //addMessage(data['status'], data['message']);

        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Set node boot
function setNodeBoot(node_id, config) {
    var deferred = $.Deferred();
    var lab_filename = $('#lab-viewport').attr('data-path');
    var form_data = {};
    form_data['config'] = config;
    var url = '/api/labs' + lab_filename + '/nodes/' + node_id;
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
                logger(1, 'DEBUG: node bootflag updated.');
                deferred.resolve();
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Set node position
function setNodePosition(node_id, left, top) {
    var deferred = $.Deferred();
    var lab_filename = $('#lab-viewport').attr('data-path');
    var form_data = {};
    form_data['left'] = left;
    form_data['top'] = top;
    var url = '/api/labs' + lab_filename + '/nodes/' + node_id;
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
                logger(1, 'DEBUG: node position updated.');
                deferred.resolve();
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Set multiple node position
function setNodesPosition(nodes) {
    var deferred = $.Deferred();
    if ( nodes.length == 0 ) { deferred.resolve(); return deferred.promise(); }
    var lab_filename = $('#lab-viewport').attr('data-path');
    var form_data = [];
    form_data=nodes;
    var url = '/api/labs' + lab_filename + '/nodes' ;
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
                logger(1, 'DEBUG: node position updated.');
                deferred.resolve();
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Update node data from node list
function setNodeData(id){
    if ( window.donotupdate == 1 ) return false ;
    var lab_filename = $('#lab-viewport').attr('data-path');
    var form_data = form2ArrayByRow('node', id);
    var promises = [];
    logger(1, 'DEBUG: posting form-node-edit form.');
    var url = '/api/labs' + lab_filename + '/nodes/' + id;
    var type = 'PUT';
    form_data['id'] = id;
    form_data['count'] = 1;
    form_data['postfix'] = 0;
    for (var i = 0; i < form_data['count']; i++) {
        form_data['left'] = parseInt(form_data['left']) + i * 10;
        form_data['top'] = parseInt(form_data['top']) + i * 10;
	//form_data["qemu_options"].replace(/\&quot;/g,'\\\"');
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
                    $("#node" + id + " .node_name").html('<i class="node' + id + '_status glyphicon glyphicon-stop"></i>' + form_data['name'])
                    $("#node" + id + " a img").attr("src", "/images/icons/" + form_data['icon'])
                    addMessage(data['status'], data['message']);
                } else {
                    // Application error
                    logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                    addModal('ERROR', '<p>' + data['message'] + '</p>', '<button type="button" class="btn btn-flat" data-dismiss="modal">Close</button>');
                }
            },
            error: function (data) {
                // Server error
                var message = getJsonMessage(data['responseText']);
                logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
                logger(1, 'DEBUG: ' + message);
                addModal('ERROR', '<p>' + message + '</p>', '<button type="button" class="btn btn-flat" data-dismiss="modal">Close</button>');
            }
        });
        promises.push(request);
    }

    $.when.apply(null, promises).done(function () {
        logger(1,"data is sent");
    });
    return false;
}

//set note interface
function setNodeInterface(node_id,network_id,interface_id){

    var deferred = $.Deferred();
    var lab_filename = $('#lab-viewport').attr('data-path');
    var form_data = {};
    form_data[interface_id] = network_id;

    var url = '/api/labs' + lab_filename + '/nodes/' + node_id +'/interfaces';
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
                logger(1, 'DEBUG: node interface updated.');
                deferred.resolve(data);
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();

}

// Start node(s)
function start(node_id) {
    var deferred = $.Deferred();
    var lab_filename = $('#lab-viewport').attr('data-path');
    var url = '/api/labs' + lab_filename + '/nodes/' + node_id + '/start';
    var type = 'GET';
    $.ajax({
        cache: false,
        timeout: 7200000,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: node(s) started.');
                //$('#node' + node_id + ' img').removeClass('grayscale')
                deferred.resolve(data['data']);
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Start nodes recursive
function recursive_start(nodes, i) {
    i = i - 1;
    var deferred = $.Deferred();
    var lab_filename = $('#lab-viewport').attr('data-path');
    if (typeof nodes[Object.keys(nodes)[i]]['path'] === 'undefined') {
        var url = '/api/labs' + lab_filename + '/nodes/' + Object.keys(nodes)[i] + '/start';
    } else {
        var url = '/api/labs' + lab_filename + '/nodes/' + nodes[Object.keys(nodes)[i]]['path'] + '/start';
    }
    var type = 'GET';
    $.ajax({
        cache: false,
        timeout: 7200000,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: node(s) started.');
                addMessage('success', nodes[Object.keys(nodes)[i]]['name'] + ': ' + MESSAGES[76]);
                //$('#node' + nodes[Object.keys(nodes)[i]]['id'] + ' img').removeClass('grayscale')

                //set start status
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                addMessage('danger', nodes[Object.keys(nodes)[i]]['name'] + ': ' + MESSAGES[76] + 'failed');
            }
            if (i > 0) {
                recursive_start(nodes, i);
            } else {
                addMessage('info', 'Start All: done');
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            addMessage('danger', message);
            if (i > 0) {
                recursive_start(nodes, i);
            } else {
                addMessage('info', 'Start All: done');
            }

        }
    });
    return deferred.promise();
}

// Stop node(s)
function stop(node_id,stopmode) {
    var deferred = $.Deferred();
    var lab_filename = $('#lab-viewport').attr('data-path');
    var url = '/api/labs' + lab_filename + '/nodes/' + node_id + '/stop/stopmode='+stopmode;
    var type = 'GET';
    $('.node' + node_id + '_status').attr('class', 'node' + node_id + '_status glyphicon glyphicon-cog gly-spin');
    $.ajax({
        cache: false,
        timeout: 1200000 ,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: node(s) stopped.');
                deferred.resolve(data['data']);

            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
    $('.node' + node_id + '_status').removeClass('gly-spin');
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
        addMessage('danger', $('#node'+node_id).attr('data-name') + ': ' + message);
            deferred.reject(message);
        $('.node' + node_id + '_status').removeClass('gly-spin');
        }
    });
    return deferred.promise();
}

// Stop all nodes
function stopAll() {
    var deferred = $.Deferred();
    var type = 'DELETE';
    var url = '/api/status';
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: stopped all nodes.');
                deferred.resolve();

            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Update
function update(path) {
    var deferred = $.Deferred();
    var type = 'GET';
    var url = '/api/update';
    $.ajax({
        cache: false,
        timeout: TIMEOUT * 10,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: system updated.');
                deferred.resolve(data['message']);
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        /*
         error: function(data) {
         // Server error
         var message = getJsonMessage(data['responseText']);
         logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
         logger(1, 'DEBUG: ' + message);
         deferred.reject(message);
         }
         */
    });
    return deferred.promise();
}

// Wipe node(s)
function wipe(node_id) {
    var deferred = $.Deferred();
    var lab_filename = $('#lab-viewport').attr('data-path');
    var url = '/api/labs' + lab_filename + '/nodes/' + node_id + '/wipe';
    var type = 'GET';
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: node(s) wiped.');
                deferred.resolve(data['data']);
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

/***************************************************************************
 * Print forms and pages
 **************************************************************************/
// Context menu
function printContextMenu(title, body, pageX, pageY, addToBody, role, hideTitle) {
    var zoomvalue = 100
    if ( role == "menu" ) zoomvalue=$('#zoomslide').slider("value")
    pageX=pageX*100/zoomvalue
    pageY=pageY*100/zoomvalue
    $("#context-menu").remove()
    var titleLine = '';

    if(!hideTitle){
        titleLine = '<li role="presentation" class="dropdown-header">' + title + '</li>'
    }

    var menu = '<div id="context-menu" class="collapse clearfix dropdown">';
    menu += '<ul class="dropdown-menu" role="' + role + '">' + titleLine + body + '</ul></div>';
    var hiddenYpix = 0
    var hiddenXpix = 0



    if(addToBody){
        $('body').append(menu);
    } else {
        $('#lab-viewport').append(menu);
        hiddenYpix=$('#lab-viewport').scrollTop();
        hiddenXpix=$('#lab-viewport').scrollLeft();
    }

    // Set initial status
    $('.menu-interface, .menu-edit').slideToggle();
    $('.menu-interface, .menu-edit').hide();
    setZoom(100/zoomvalue,lab_topology,[0,0],$('#context-menu')[0])

    // Calculating position
    if (pageX + $('#context-menu').width() + 30 > $(window).width()) {
        // Dropright
        logger(1,'Drop right');
        var left = pageX - $('#context-menu').width() + hiddenXpix;
    } else {
        // Dropleft
        var left = pageX+hiddenXpix;
    }
    if ($('#context-menu').height() > $(window).height()) {
        // Page is too short, drop down by default
        var top = 0;
        var max_height = $(window).height();
    } else if ($(window).height()/zoomvalue*100 - pageY >= $('#context-menu').height()) {
        // Dropdown if enough space
        var top = pageY+hiddenYpix;
        var max_height = $('#context-menu').height();
    } else {
        // Dropup
        var top = ( $(window).height() - $('#context-menu').height() ) /zoomvalue * 100 + hiddenYpix;
        //var top = $(window).height() - $('#context-menu').height() + hiddenpix;
        var max_height = $('#context-menu').height();
    }

    // Setting position via CSS
    $('#context-menu').css({
        left: left - 30 + 'px',
        maxHeight: max_height,
        top: top + 'px'
    });
    $('#context-menu > ul').css({
        maxHeight: max_height - 5
    });
}

// Folder form
function printFormFolder(action, values) {
    var name = (values['name'] != null) ? values['name'] : '';
    var path = (values['path'] != null) ? values['path'] : '';
    var original = (path == '/') ? '/' + name : path + '/' + name;
    var submit = (action == 'add') ? MESSAGES[17] : MESSAGES[21];
    var title = (action == 'add') ? MESSAGES[4] : MESSAGES[10];
    if (original == '/' && action == 'rename') {
        addModalError(MESSAGES[51]);
    } else {
        var html = '<form id="form-folder-' + action + '" class="form-horizontal form-folder-' + action + '"><div class="form-group"><label class="col-md-3 control-label">' + MESSAGES[20] + '</label><div class="col-md-5"><input class="form-control" name="folder[path]" value="' + path + '" disabled type="text"/></div></div><div class="form-group"><label class="col-md-3 control-label">' + MESSAGES[19] + '</label><div class="col-md-5"><input class="form-control autofocus" name="folder[name]" value="' + name + '" type="text"/></div></div><div class="form-group"><div class="col-md-5 col-md-offset-3"><input class="form-control" name="folder[original]" value="' + original + '" type="hidden"/><button type="submit" class="btn btn-success">' + submit + '</button> <button type="button" class="btn btn-flat" data-dismiss="modal">' + MESSAGES[18] + '</button></div></div></form>';
        logger(1, 'DEBUG: popping up the folder-' + action + ' form.');
        addModal(title, html, '');
        validateFolder();
    }
}

// Import external labs
function printFormImport(path) {
    var html = '<form id="form-import" class="form-horizontal form-import"><div class="form-group"><label class="col-md-3 control-label">' + MESSAGES[20] + '</label><div class="col-md-5"><input class="form-control" name="import[path]" value="' + path + '" disabled type="text"/></div></div><div class="form-group"><label class="col-md-3 control-label">' + MESSAGES[2] + '</label><div class="col-md-5"><input class="form-control" name="import[local]" value="" disabled="" placeholder="' + MESSAGES[25] + '" "type="text"/></div></div><div class="form-group"><div class="col-md-7 col-md-offset-3"><span class="btn btn-default btn-file btn-success">' + MESSAGES[23] + ' <input class="form-control" name="import[file]" value="" type="file"></span> <button type="submit" class="btn btn-flat">' + MESSAGES[24] + '</button> <button type="button" class="btn btn-flat" data-dismiss="modal">' + MESSAGES[18] + '</button></div></div></form>';
    logger(1, 'DEBUG: popping up the import form.');
    addModal(MESSAGES[9], html, '');
    validateImport();
}

/// Modal to wait scvreenshot
function printScreenshotWait() {
	html = '<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>'
	addModal(MESSAGES[240], html, '', 'screenshotWait');
}

// Add a new lab
function printFormLab(action, values) {
    if (action == 'add') {
        var path = values['path'];
    } else {
        var path = (values['path'] == '/') ? '/' + values['name'] + '.unl' : values['path'] + '/' + values['name'] + '.unl';
    }
    var title = (action == 'add') ? MESSAGES[5] : MESSAGES[87] ;
    $.when(getCluster(1)).done(function (data) {
	    var satArray = Array();
	    var satArrayRev = Array();
	    $.map(data, function(value) {
                                        satArray[value['name']]=value['id'];
                                        satArrayRev[value['id']]=value['name'];
                                });
	    var html = new EJS({
            url: '/themes/default/ejs/form_lab.ejs?n=' + Date.now()
            }).render({
               name: (values['name'] != null) ? values['name'] : '',
               version: (values['version'] != null) ? values['version'] : '',
	       sat: values['sat'],
	       sats: satArrayRev,
               scripttimeout: (values['scripttimeout'] != null) ? values['scripttimeout'] : '300',
               countdown: (values['countdown'] != null) ? values['countdown'] : '0',
               linkwidth: (values['linkwidth'] != null) ? parseFloat(values['linkwidth']) : '2',
               grid: (values['grid'] != null) ? values['grid'] : '1',
               author: (values['author'] != null) ? values['author'] : '',
               description: (values['description'] != null) ? values['description'] : '',
               body: (values['body'] != null) ? values['body'] : '',
               title: title,
               path: path,
               action: action,
               MESSAGES: MESSAGES,
           })

           logger(1, 'DEBUG: popping up the lab-add form.');
           addModalWide(title, html, '');
           validateLabInfo();
           });
}

// Network Form
function printFormNetwork(action, values) {
    var zoom = (action == "add") ? $('#zoomslide').slider("value")/100 : 1 ;
    var id = (values == null || values['id'] == null) ? '' : values['id'];
    var left = (values == null || values['left'] == null) ? null : Math.trunc(values['left']/zoom);
    var top = (values == null || values['top'] == null) ? null : Math.trunc(values['top']/zoom);
    var name = (values == null || values['name'] == null) ? 'Net' : values['name'];
    var type = (values == null || values['type'] == null) ? '' : values['type'];
    var icon = (values == null || values['icon'] == null) ? '' : values['icon'];
    var title = (action == 'add') ? MESSAGES[89] : MESSAGES[90];

    $.when(getNetworkTypes()).done(function (network_types, icons, nat_only) {
        // Read privileges and set specific actions/elements
        var html = '<form id="form-network-' + action + '" class="form-horizontal">';
        if (action == 'add') {
            // If action == add -> print the nework count input
            html += '<div class="form-group"><label class="col-md-3 control-label">' + MESSAGES[114] + '</label><div class="col-md-5"><input class="form-control" name="network[count]" value="1" type="text"/></div></div>';
            html += '<input class="form-control" name="network[visibility]" type="hidden" value="1"/>';
        } else {
            // If action == edit -> print the network ID
            html += '<div class="form-group"><label class="col-md-3 control-label">' + MESSAGES[92] + '</label><div class="col-md-5"><input class="form-control" disabled name="network[id]" value="' + id + '" type="text"/></div></div>';
        }
        html += '<div class="form-group"><label class="col-md-3 control-label">' + MESSAGES[103] + '</label><div class="col-md-5"><input class="form-control autofocus" name="network[name]" value="' + name + '" type="text"/></div></div>';

                            html += '<div class="form-group">'+
                                            '<label class=" col-md-3 control-label">' + 'Icon' + '</label><div class="col-md-5">'+
                                            '<select class="selectpicker form-control" name="network[icon]" data-size="5" data-style="selectpicker-button">';
                            $.each(icons, function (icon_key, icon_value) {
                                var selected = (icon_key == icon) ? 'selected ' : '';
                                //    iconselect = '' ;
                                //if ( key == "icon" ) { iconselect = 'data-content="<img src=\'/images/icons/'+list_value+'\' height=15 width=15>&nbsp;&nbsp;&nbsp;'+list_value+'"' };
                                iconselect = 'data-content="<img src=\'/images/net_icons/'+icon_value+'\' height=15 width=15>&nbsp;&nbsp;&nbsp;'+icon_value+'"' ;
                                html += '<option ' + selected + 'value="' + icon_key + '" '+ iconselect +'>' + icon_value + '</option>';
                            });
	    		    html += '</select></div></div>';

	html += '<div class="form-group"><label class="col-md-3 control-label">' + MESSAGES[95] + '</label><div class="col-md-5"><select ' + ( ( action == 'add') ? '':'disabled') + ' class="selectpicker show-tick form-control" name="network[type]" data-live-search="true" data-style="selectpicker-button">';
         $.each(network_types, function (key, value) {
            // Print all network types
            //if(!value.startsWith('pnet') && !value.startsWith('ovs') ){
            //if(!value.startsWith('pnet') && !value.startsWith('bridge') ){
            if(!value.startsWith('pnet')){
        if(value.startsWith('nat')){
            value = value.replace('nat0','NAT')
        }
                var type_selected = (key == type) ? 'selected ' : '';
                html += '<option ' + type_selected + 'value="' + key + '">' + value + '</option>';
            }
        });
        $.each(network_types, function (key, value) {
            // Print all network types
            if(value.startsWith('pnet') && nat_only == 0){
                value = value.replace('pnet','Cloud')
                // Custom Management Port for eth0
                if(value.startsWith('Cloud0'))
                {
                    value = value.replace('Cloud0','Management(Cloud0)')
                }
                var type_selected = (key == type) ? 'selected ' : '';
                html += '<option ' + type_selected + 'value="' + key + '">' + value + '</option>';
            }
        });
        html += '</select></div></div><div class="form-group"><label class="col-md-3 control-label">' + MESSAGES[93] + '</label><div class="col-md-5"><input class="form-control" name="network[left]" value="' + left + '" type="text"/></div></div><div class="form-group"><label class="col-md-3 control-label">' + MESSAGES[94] + '</label><div class="col-md-5"><input class="form-control" name="network[top]" value="' + top + '" type="text"/></div></div><div class="form-group"><div class="col-md-5 col-md-offset-3"><button type="submit" class="btn btn-success">' + MESSAGES[47] + '</button> <button type="button" class="btn" data-dismiss="modal">' + MESSAGES[18] + '</button></div></div></form></form>';

        // Show the form
        addModal(title, html, '', 'second-win');
        $('.selectpicker').selectpicker();
        $('.autofocus').focus();
    });
}

// Node form
function printFormNode(action, values, fromNodeList) {
    logger (2,'action = ' + action)
    var zoom = (action == "add") ? $('#zoomslide').slider("value")/100 : 1 ;
    var id = (values == null || values['id'] == null) ? null : values['id'];
    var left = (values == null || values['left'] == null) ? null : Math.trunc(values['left']/zoom);
    var top = (values == null || values['top'] == null) ? null : Math.trunc(values['top']/zoom);
    var template = (values == null || values['template'] == null) ? null : values['template'];

    var title = (action == 'add') ? MESSAGES[85] : MESSAGES[86];
    chartframe = '' ;
    if ($("#node" + id).attr('data-status') > 1 ) {
   	title = MESSAGES[246]+' NODE ID '+ id;  
	// add iframe with netdata values of current node
	// chartname = 
	sat = $("#node" + id).attr('data-sat');
	chartframe += '<center><div ><iframe class="nodedatawrap"  name="' +  $("#node" + id).attr('data-name')+'" src="/api/nodegraph/'+$("#lab-viewport").attr('data-uuid')+'/'+sat+'/'+id+'/'+template+'"></iframe></div><center>'
    }
    var template_disabled = (values == null || values['template'] == null ) ? '' : 'disabled ';
    if ( $.cookie("full-list") == undefined ) $.cookie("full-list", 0) ;
    var full_list = $.cookie("full-list") 
    logger (2,'node list visibility (cookie) : ' + $.cookie("full-list"));
    $.when(getTemplates(null)).done(function (templates) {
        var html = '';
	html += chartframe
        html += '<form id="form-node-' + action + '" >'+
                    '<div class="form-group col-sm-12">'+
                        '<label class="control-label">' + MESSAGES[84] + '</label>';
	if  (action == "add") {
			html += '<label style="float:right;margin-left:15px">'+ MESSAGES[233] + '</label><input id="full-list" type="checkbox" title="'+MESSAGES[234]+'" name="full-list" value="'+full_list+'" '+(full_list == 1 ? 'checked' : '' ) +' style="float:right">'; 
	}
        html += '<select id="form-node-template" class="selectpicker form-control" name="node[template]" data-live-search="true" data-size="auto" data-style="selectpicker-button">'+
                '<option value="">' + MESSAGES[102] + '</option>';
        $.each(templates, function (key, value) {
        var valdisabled  = (/missing/i.test(value)) ? 'disabled="disabled"' : '';
        //var valdisabled  = '' ;
            // Adding all templates
        if (! /hided/i.test(value) ) html += '<option value="' + key + '" '+ valdisabled +' >' + value.replace('.missing','') + '</option>';
        });
	
	//html += '<div id="form-node-info"><label style="float:right;margin-left:15px">'+ MESSAGES[233] + '</label><input id="node_tmp_path" type="input" value="/opt/unetlab/tmp/' + TENANT + '/'  + $("#lab-viewport").attr('data-uuid') + '/' + id + '>'
        //html += '</div>'
        html += '</select>'
	html += '</div><div id="form-node-data"></div><div id="form-node-buttons"></div></form>';
	html +=  '<div class="form-group col-sm-12">'
        // Show the form
        addModal(title, html, '', 'second-win');
        $('.selectpicker').selectpicker();
	//if ($('.disabled').css({'visibility':'hidden','height':'0','margin':'0px'});
	if ( $.cookie("full-list") == 1 ) {
		$('.disabled').css({'visibility':'visible','height':'auto','margin-top':'5px','margin-bottom':'5px', 'line-height':'14px' })
 	} else {
		$('.disabled').css({'visibility':'hidden','height':'0','margin':'0px', 'line-height':'0px'});
	}
        if(!fromNodeList){
            $('.selectpicker-button').trigger('click');
            $('.selectpicker').selectpicker();
            setTimeout(function(){
                $('.bs-searchbox input').focus()
            }, 500);
        }
        $('#full-list').change(function () {
		//logger (2,'node list visibility: ' + $("#full-list").val() );
		$.cookie("full-list", $("#full-list").val() ); 
		if ( $("#full-list").val() == 0 ) {
			$('.disabled').css({'visibility':'hidden','height':'0','margin':'0px'});
		} else {
			$('.disabled').css({'visibility':'visible','height':'auto','margin-top':'5px','margin-bottom':'5px'})
		}
			
	});

        $('#form-node-template').change(function (e2) {
            id = (id == '') ? null : id;    // Ugly fix for change template after selection
            template = $(this).find("option:selected").val();
            if (template != '') {
                // Getting template only if a valid option is selected (to avoid requests during typewriting)
                $.when(getTemplates(template), getNodes(id),getConfigSets()).done(function (template_values, node_values, configsets) {
                    // TODO: this event is called twice
                    id = (id == null) ? '' : id;
                    var html_data = '<input name="node[type]" value="' + template_values['type'] + '" type="hidden"/>';
                    if (action == 'add') {
                        // If action == add -> print the nework count input
                        html_data += '<div class="form-group col-sm-5"><label class=" control-label">' + MESSAGES[113] + '</label>'+
                                        '<input class="form-control" name="node[count]" max=1023 value="1" type="text"/>'+
                                     '</div>';
                    } else {
                        // If action == edit -> print the network ID
                        html_data += '<div class="form-group col-sm-12">'+
                                        '<label class="control-label">' + MESSAGES[92] + '</label>'+
                                        '<input class="form-control" disabled name="node[id]" value="' + id + '" type="text"/>'+
                                     '</div>';
		        html_data += '<div class="form-group col-sm-12">'+
				        '<label class="control-label">' + MESSAGES[247] + '</label>'+
				        '<input class="form-control" disabled  type="text" value="/opt/unetlab/tmp/' + (( SPY == null ) ? TENANT : SPY )+ '/'  + $("#lab-viewport").attr('data-uuid') + '/' + id + '">'+
				    '</div>';
                    }

                    var bothRam = template_values['options'].hasOwnProperty('ram') && template_values['options'].hasOwnProperty('nvram')
                    var bothConnTypes = template_values['options'].hasOwnProperty('ethernet') && template_values['options'].hasOwnProperty('serial')

                    $.each(template_values['options'], function (key, value) {

                        if(key == 'ram') postName = '(MB)';
                        if(key == 'nvram') postName = '(KB)';
                        // Print all options from template
                        var value_set = (node_values != null && node_values[key] != null) ? node_values[key] : value['value'];
                        if (key == 'shutdown' ) {
                        }
                        if (value['type'] == 'list') {
                            // Option is a list
                            var widthClass = ' col-sm-12 '
                            if(key == 'image' && action == 'add') widthClass = ' col-sm-7'
                            if(key == 'qemu_version') {
                		widthClass = ' col-sm-4 ';
                		if ( action == 'add' ) value_set = '';
                            }
                            if(key == 'qemu_arch') {
                		widthClass = ' col-sm-4 ';
                		if ( action == 'add' ) value_set = '';
                	    }
                            if(key == 'qemu_nic') {
                		widthClass = ' col-sm-4 ';
                		if ( action == 'add' ) value_set = '';
                	    }
			    if(key == 'config') {
                		widthClass = ' col-sm-6 ';
                	    }
			    if(key == 'sat') {
                		widthClass = ' col-sm-6 ';
                            }
                            if (key.startsWith('slot')) widthClass = ' col-sm-6 '
                            html_data += '<div class="form-group '+widthClass+' '+key+'">'+
                                            '<label class=" control-label">' + value['name'] + '</label>'+
                                            '<select class="selectpicker form-control" name="node[' + key + ']" data-size="5" data-style="selectpicker-button">';
                            $.each(value['list'], function (list_key, list_value) {
                                var selected = (list_key == value_set) ? 'selected ' : '';
                                iconselect = '' ;
                                if ( key == "icon" ) { iconselect = 'data-content="<img src=\'/images/icons/'+list_value+'\' height=15 width=15>&nbsp;&nbsp;&nbsp;'+list_value+'"' };
                                html_data += '<option ' + selected + 'value="' + list_key + '" '+ iconselect +'>' + list_value + '</option>';
                            });
                	    if ( key == 'config' ) {
                		$.each(configsets, function ( cfs_key , cfs ) {
                    			var selected = (cfs_key == value_set) ? 'selected ' : '';
                    			html_data += '<option ' + selected + 'value="' + cfs_key + '">' + cfs['name'] + '</option>';
                		});
			    }
                            html_data += '</select>';
                            html_data += '</div>';
                        } else if ( value['type'] == 'checkbox') {
                               if(key == 'cpulimit') {
                                       widthClass = ' col-sm-2 ';
                                       html_data += '<div class="'+widthClass+'" style="padding-right: 0px;">'+
                                       '<label class="control-label" style="height: 34px;margin-top: 8px;margin-bottom: 0px;">' + value['name'] + '</label>'+
                                       '</div><div class="form-group col-sm-8" style="padding-left: 0px;" >'+
                                       '<input type="checkbox"  style="width: 34px;" class="form-control" value='+ values['cpulimit']  +' name="node[' + key + ']" '+ (( values['cpulimit'] == 1) ? 'checked' : '' ) +'/>'+
                                       '</div>';
                               } else if ( key == 'e0dhcp') {
                                      if ( action == 'add' ) values['e0dhcp'] = 0 ;
                                             widthClass = ' col-sm-8 ';
                                             html_data += '<div class="'+widthClass+'" style="padding-right: 0px;">'+
                                                          '<label class="control-label" style="height: 34px;margin-top: 8px;margin-bottom: 0px;">' + value['name'] + '</label>'+
                                                          '</div><div class="form-group col-sm-2" style="padding-left: 0px;" >'+
                                                          '<input type="checkbox"  style="width: 34px;" class="form-control" value='+ values['e0dhcp']  +' name="node[' + key + ']" '+ (( values['e0dhcp'] == 1) ? 'checked' : '' ) +'/>'+
                                                          '</div>';
                              } else if ( key == 'dock_ipv6') {
				      if ( action == 'add' ) values['dock_ipv6'] = 0 ;
				      widthClass = ' col-sm-8 ';
				       html_data += '<div class="'+widthClass+'" style="padding-right: 0px;">'+
                                                          '<label class="control-label" style="height: 34px;margin-top: 8px;margin-bottom: 0px;">' + value['name'] + '</label>'+
                                                          '</div><div class="form-group col-sm-2" style="padding-left: 0px;" >'+
                                                          '<input type="checkbox"  style="width: 34px;" class="form-control" value='+ values['dock_ipv6']  +' name="node[' + key + ']" '+ (( values['dock_ipv6'] == 1) ? 'checked' : '' ) +'/>'+
                                                          '</div>';
			      }  else if ( key == 'keepalive') {
                                      if ( action == 'add' ) values['keepalive'] = 0 ;
                                      widthClass = ' col-sm-8';
                                       html_data += '<div class="'+widthClass+'" style="padding-right: 0px;text-align: left;">'+
                                                          '<label class="control-label" style="height: 34px;margin-top: 8px;margin-bottom: 0px;">' + value['name'] + '</label>'+
                                                          '</div><div class="form-group col-sm-4" style="padding-left: 0px;" >'+
                                                          '<input type="checkbox"  style="width: 17px;" class="form-control" value='+ values['keepalive']  +' name="node[' + key + ']" '+ (( values['keepalive'] == 1) ? 'checked' : '' ) +'/>'+
                                                          '</div>';
                              }

                        } else {
                            // Option is standard
                            var widthClass = ' col-sm-12 '
                            var ram_value = key == 'ram' ? ' (MB)' : key == 'nvram' ? ' (KB)' : ' ';
                            var postName = '';
                            if (!bothRam && template_values['options'].hasOwnProperty('cpu') &&
                                template_values['options'].hasOwnProperty('ethernet') &&
                                template_values['options'].hasOwnProperty('ram')) {
                                if (key == 'ram' || key == 'ethernet' || key == 'cpu') widthClass = ' col-sm-4 '
                            } else if (key == 'ram' || key == 'nvram') widthClass = ' col-sm-6 '
                            if (bothConnTypes && (key == 'ethernet' || key == 'serial')) widthClass = ' col-sm-6 '
                            var tpl = '' ;
                if (key == 'qemu_options' && value_set == '') value_set = template_values['options'][key]['value'] ;
                            if (key == 'qemu_options')  tpl = " ( reset to template value )"
                            value_set = (key == 'qemu_options')?value_set.replace(/"/g,'&quot;'):value_set;
                            value_set = (key == 'concmd')?value_set.replace(/"/g,'&quot;'):value_set;
                            template_values['options'][key]['value'] = (key == 'qemu_options')?template_values['options'][key]['value'].replace(/"/g,'&quot;'):template_values['options'][key]['value'];

                            html_data += '<div class="form-group'+ widthClass+'">'+
                                            '<label class=" control-label"> ' + value['name'] + '<a id="link_'+key+'" onClick="javascript:document.getElementById(\'input_'+key+'\').value=\''+template_values['options'][key]['value']+'\';document.getElementById(\'link_'+key+'\').style.visibility=\'hidden\'" style="visibility: '+ (( value_set != template_values['options'][key]['value'] ) ? 'visible':'hidden') +';" >' + tpl + '</a>' + ram_value + '</label>'+
                                            '<input class="form-control' + ((key == 'name') ? ' autofocus' : '') + '" name="node[' + key + ']" value="' + value_set + '" type="text" id="input_'+ key  +'" onClick="javascript:document.getElementById(\'link_'+key+'\').style.visibility=\'visible\'""/>'+
                                         '</div>';
                            if ( key  == 'qemu_options' ) {
                     html_data += '<div class="form-group'+ widthClass+'">'+
                                            '<input class="form-control hidden" name="node[ro_' + key + ']" value="' + template_values['options'][key]['value']  + '" type="text" disabled/>'+
                                         '</div>';
                            }
                        }
                    });
                    html_data += '<div class="form-group col-sm-6">'+
                                    '<label class=" control-label">' + MESSAGES[93] + '</label>'+
                                    '<input class="form-control" name="node[left]" value="' + left + '" type="text"/>'+
                                 '</div>'+
                                 '<div class="form-group col-sm-6">'+
                                    '<label class=" control-label">' + MESSAGES[94] + '</label>'+
                                    '<input class="form-control" name="node[top]" value="' + top + '" type="text"/>'+
                                 '</div>';

                    // Show the buttons
	            if ($("#node" + id).attr('data-status') > 1 ) {
			    $('#form-node-buttons').html('<div class="form-group"><div class="col-md-5 col-md-offset-5"><button type="button" class="btn btn-success" data-dismiss="modal">' + MESSAGES[16] + '</button></div>');
		    } else {
                    	   $('#form-node-buttons').html('<div class="form-group"><div class="col-md-5 col-md-offset-3"><button type="submit" class="btn btn-success">' + MESSAGES[47] + '</button> <button type="button" class="btn" data-dismiss="modal">' + MESSAGES[18] + '</button></div>');
		    }

                    // Show the form
                    $('#form-node-data').html(html_data);
                    $('.selectpicker').selectpicker();
		    if ($("#node" + id).attr('data-status') > 1 ) {
		     	$("#form-node-data :input").attr("disabled", "")
		    }
                    //if(!fromNodeList){
                    //    setTimeout(function(){
                    //        $('.selectpicker').selectpicker().data("selectpicker").$button.focus();
                    //    }, 500);
                    //}
                    validateNode();
                }).fail(function (message1, message2) {
                    // Cannot get data
                    if (message1 != null) {
                        addModalError(message1);
                    } else {
                        addModalError(message2)
                    }
                    ;
                });
            }
        });

        if (action == 'edit') {
            // If editing a node, disable the select and trigger
            $('#form-node-template').val(template).change();
            $('#form-node-template').prop('disabled', 'disabled');
            //$('#form-node-template').val(template).change();
        }

    }).fail(function (message) {
        // Cannot get data
        addModalError(message);
    });
}

// Node config
function OldprintFormNodeConfigs(values, cb) {
    var title = values['name'] + ': ' + MESSAGES[123];
    if ((ROLE == 'admin' || ROLE == 'editor') && LOCK == 0 ) {
        var html = '<form id="form-node-config" class="form-horizontal"><input name="config[id]" value="' + values['id'] + '" type="hidden"/>' +
            '<div class="form-group">' +
                 '<div class="col-md-12">' +
                    '<button type="button" class="btn action-upload-node-config">' + MESSAGES[202] + '</button>' +
                  '</div>' +
            '</div>' +
            '<div class="form-group">' +
                 '<div class="col-md-12">' +
                      '<textarea class="form-control autofocus" id="nodeconfig" name="config[data]" rows="500" >' +
                      '</textarea>' +
                 '</div>' +
            '</div>' +
            '<div class="form-group">' +
                 '<div class="col-md-5 col-md-offset-3">' +
                        '<button type="submit" class="btn btn-success">' + MESSAGES[47] + '</button>' +
                        '<button type="button" class="btn" data-dismiss="modal">' + MESSAGES[18] + '</button>' +
                 '</div>' +
            '</div>' +
         '</form>';
    } else {
        var html = '<div class="col-md-12"><pre style="max-height: calc(90vh - 120px)!important;">' + values['data'] + '</pre></div>';
    }
    $('#config-data').html(html);
    $('#nodeconfig').val(values['data']);
    cb && cb();
}
function printFormNodeConfigs(values, cb) {
    var title = values['name'] + ': ' + MESSAGES[123];
    if ((ROLE == 'admin' || ROLE == 'editor') && LOCK == 0 )
    {
        var ace_themes = [
            'cobalt', 'github', 'crimson_editor', 'iplastic', 'draw', 'clouds_midnight',
            'monokai', 'ambiance', 'chaos', 'chrome', 'clouds', 'eclipse', 'dreamweaver',
            'kr_theme', 'kuroir', 'merbivore', 'idle_fingers', 'katzenmilch', 'merbivore_soft',
        ];

        var ace_themes = [
            { title: 'Dark', key: 'cobalt'},
            { title: 'Light', key:'github'}
        ];

        var ace_languages = [
            { title: 'Cisco-IOS', key: 'cisco_ios' },
            { title: 'Juniper JunOS', key: 'juniper_jun_os' }
        ];

        var ace_font_size = [
            '12px', '13px', '14px', '16px', '18px', '20px', '24px', '28px'
        ];

        var html = new EJS({
            url: '/themes/default/ejs/form_node_configs.ejs'
        }).render({
            MESSAGES: MESSAGES,
            values: values,
            ace_themes: ace_themes,
            ace_languages: ace_languages,
            ace_font_size: ace_font_size,
            r: readCookie
        })

    } else {
        var html = new EJS({
            url: '/themes/default/ejs/locked_node_configs.ejs'
        }).render({
             values: values
        })
    }

    $('#config-data').html(html);
    if(readCookie("editor")) {
        initEditor();
    } else {
        initTextarea();
        $('#nodeconfig').focus();
    }
    $('#nodeconfig').val(values['data']);
    ace.edit("editor").setValue(values['data'], 1)

    cb && cb();
}

function printFormConfigSet() {
    var title = "CONFIG SETS";
    var body = '<div id="config-set-modal">'+
    '<form id="config-set-form" class="container col-md-12 col-lg-12 custom-shape-form">' +
    '<div class="row">' +
    '<div class="col-md-8 col-md-offset-1 form-group">' +
    '<label class="col-md-3 control-label form-group-addon">ID</label>' +
    '</div>' +
    '</div>' +
    '</form>' +
    '</div>' ;
    addModalWide(title, body, '');
}

// Custom Shape form
function printFormCustomShape(values) {
    var shapeTypes = ['square', 'square rounded','circle'],
        borderTypes = ['solid', 'dashed'],
        left = (values == null || values['left'] == null) ? null : values['left'],
        top = (values == null || values['top'] == null) ? null : values['top'];

  var html = '<form id="main-modal" class="container col-md-12 col-lg-12 custom-shape-form">' +
        '<div class="row">' +
        '<div class="col-md-8 col-md-offset-1 form-group">' +
        '<label class="col-md-3 control-label form-group-addon">Type</label>' +
        '<div class="col-md-5">' +
        '<select class="form-control shape-type-select">' +
        '</select>' +
        '</div>' +
        '</div> <br>' +
        '<div class="col-md-8 col-md-offset-1 form-group">' +
        '<label class="col-md-3 control-label form-group-addon">Name</label>' +
        '<div class="col-md-5">' +
        '<input type="text" class="form-control shape_name" placeholder="Name">' +
        '</div>' +
        '</div> <br>' +
        '<div class="col-md-8 col-md-offset-1 form-group">' +
        '<label class="col-md-3 control-label form-group-addon">Border-type</label>' +
        '<div class="col-md-5">' +
        '<select class="form-control border-type-select" >' +
        '</select>' +
        '</div>' +
        '</div> <br>' +
        '<div class="col-md-8 col-md-offset-1 form-group">' +
        '<label class="col-md-3 control-label form-group-addon">Border-width</label>' +
        '<div class="col-md-5">' +
        '<input type="number" min="0" value="5" class="form-control shape_border_width">' +
        '</div>' +
        '</div> <br>' +
        '<div class="col-md-8 col-md-offset-1 form-group">' +
        '<label class="col-md-3 control-label form-group-addon">Border-color</label>' +
        '<div class="col-md-5">' +
        '<input type="color" class="form-control shape_border_color">' +
        '</div>' +
        '</div> <br>' +
        '<div class="col-md-8 col-md-offset-1 form-group">' +
        '<label class="col-md-3 control-label form-group-addon">Background-color</label>' +
        '<div class="col-md-5">' +
        '<input type="color" class="form-control shape_background_color">' +
        '</div>' +
        '</div> <br>' +
        '<button type="submit" class="btn btn-success col-md-offset-1">' + MESSAGES[47] + '</button>' +
        '<button type="button" class="btn" data-dismiss="modal">' + MESSAGES[18] + '</button>' +
        '</div>' +
        '<input  type="text" class="hide left-coordinate" value="' + left + '">' +
        '<input  type="text" class="hide top-coordinate" value="' + top + '">' +
        '</form>';

    addModal("ADD CUSTOM SHAPE", html, '');
    $('.custom-shape-form .shape_background_color').val('#ffffff');

    for (var i = 0; i < shapeTypes.length; i++) {
        $('.shape-type-select').append($('<option></option>').val(shapeTypes[i]).html(shapeTypes[i]));
    }

    for (var j = 0; j < borderTypes.length; j++) {
        $('.border-type-select').append($('<option></option>').val(borderTypes[j]).html(borderTypes[j]));
    }

    if(isIE){
        $('input[type="color"]').hide()
        $('input.shape_border_color').colorpicker({
            color: "#000000",
            defaultPalette: 'web'
        })
        $('input.shape_background_color').colorpicker({
            color: "#ffffff",
            defaultPalette: 'web'
        })
    }


    $(".custom-shape-form").find('input:eq(0)').delay(500).queue(function() {
     $(this).focus();
     $(this).dequeue();
    });
};

// Text form
function printFormText(values) {
    var left = (values == null || values['left'] == null) ? null : values['left']
        , top = (values == null || values['top'] == null) ? null : values['top']
        , fontStyles = ['normal', 'bold', 'italic'];
    var html = new EJS({
        url: '/themes/default/ejs/form_text.ejs'
    }).render({ MESSAGES: MESSAGES, left: left, top: top});
    addModal("ADD TEXT", html, '');

    $('.autofocus').focus();
    $('.add-text-form .text_background_color').val('#ffffff');

    for (var i = 0; i < fontStyles.length; i++) {
        $('.text-font-style-select').append($('<option></option>').val(fontStyles[i]).html(fontStyles[i]));
    }

    if(isIE){
        $('input[type="color"]').hide()
        $('input.shape_border_color').colorpicker({
            color: "#000000",
            defaultPalette: 'web'
        })
        $('input.shape_background_color').colorpicker({
            color: "#ffffff",
            defaultPalette: 'web'
        })
    }
};

// Line Form

function printFormLine(values) {
    var left = (values == null || values['left'] == null) ? 100 : values['left']
        , top = (values == null || values['top'] == null) ? 100 : values['top']
    , linestyle = ['Straight', 'Bezier', 'Flowchart', 'StateMachine']
    , paintstyle = ['Solid', 'Dashed'];
    var html = new EJS({
        url: '/themes/default/ejs/form_line.ejs'
    }).render({ MESSAGES: MESSAGES, left: left, top: top});
    addModal("ADD LINE", html, '');
    $('.autofocus').focus();
    $('.add-line-form .line_color').val('#000000');
    if(isIE){
        $('input[type="color"]').hide()
        $('input.line_color').colorpicker({
            color: "#ffffff",
            defaultPalette: 'web'
        })
    }
    $('.line-arrowstyle-select').append('<option data-icon="glyphicon-arrow-right" value="arrow">single arrow</option>');
    $('.line-arrowstyle-select').append('<option data-icon="glyphicon-minus" value="line">simple</option>');
    $('.line-arrowstyle-select').append('<option data-icon="glyphicon-resize-horizontal" value="dblarrow">double arrows</option>');
    $('.line-arrowstyle-select').selectpicker();
    for (var i = 0; i < linestyle.length; i++) {
             $('.line-linestyle-select').append($('<option></option>').val(linestyle[i]).html(linestyle[i]));
    }
    for (var i = 0; i < paintstyle.length; i++) {
             $('.line-paintstyle-select').append($('<option></option>').val(paintstyle[i]).html(paintstyle[i]));
    }
    $('.line-linestyle-select').selectpicker();
    $('.line-paintstyle-select').selectpicker();

};

// Get All TLine Objects
function getLineObjects() {
    var deferred = $.Deferred();
    var lab_filename = $('#lab-viewport').attr('data-path');
    var url = '/api/labs' + lab_filename + '/lineobjects';
    var type = 'GET';
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: got line(s) from lab "' + lab_filename + '".');
                deferred.resolve(data['data']);
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Get Line Object By Id
function getLineObject(id) {
    var deferred = $.Deferred();
    var lab_filename = $('#lab-viewport').attr('data-path');
    var url = '/api/labs' + lab_filename + '/lineobjects/' + id;
    var type = 'GET';
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: got Line ' + id + 'from lab "' + lab_filename + '".');
                deferred.resolve(data['data']);
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

function addLineObject (form_data) {
    //return 0 ;
    var lab_filename = $('#lab-viewport').attr('data-path');
    var deferred = $.Deferred();
    var url = '/api/labs' + lab_filename + '/lines/' +  form_data['id'];
    var newId = -1 ;
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
               deferred.resolve(data.result['id']);
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();  // Stop to avoid POST
};

// Update Multiple Line Object
function editLineObjects(newData) {
    var lab_filename = $('#lab-viewport').attr('data-path');
    var deferred = $.Deferred();
    if (newData.length == 0 ) { deferred.resolve(); return deferred.promise(); }
    var type = 'PUT';
    var url = '/api/labs' + lab_filename + '/lineobjects';

    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: JSON.stringify(newData), // newData is object with differences between old and new data
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: lines object updated.');
                deferred.resolve(data['message']);
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Delete Line Object By Id
function deleteLineObject(id) {
    var deferred = $.Deferred();
    var type = 'DELETE';
    var lab_filename = $('#lab-viewport').attr('data-path');
    var url = '/api/labs' + lab_filename + '/lineobjects/' + id;
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: line deleted.');
                deferred.resolve();
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Map picture
function printNodesMap(values, cb) {
    var title = values['name'] + ': ' + MESSAGES[123];
    var html = '<div class="col-md-12">' + values.body + '</div><div class="text-right">' + values.footer + '</div>';
    $('#config-data').html(html);
    cb && cb();
}

//save lab handler
function saveLab(form) {
    var lab_filename = $('#lab-viewport').attr('data-path');
    var form_data = form2Array('config');
    var url = '/api/labs' + lab_filename + '/configs/' + form_data['id'];
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
                logger(1, 'DEBUG: config saved.');
                // Close the modal
                $('#body').children('.modal').attr('skipRedraw', true);
                if (form) {
                    //$('#body').children('.modal').modal('hide');
                    addMessage(data['status'], data['message']);
                }
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                addModal('ERROR', '<p>' + data['message'] + '</p>', '<button type="button" class="btn btn-flat" data-dismiss="modal">Close</button>');
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            addModal('ERROR', '<p>' + message + '</p>', '<button type="button" class="btn btn-flat" data-dismiss="modal">Close</button>');
        }
    });
    return false;  // Stop to avoid POST
}

// Node interfaces
function printFormNodeInterfaces(values) {
    var disabled = values['node_status'] == 2 ? ' disabled="disabled" ' : "";
    $.when(getLabLinks()).done(function (links) {
        var html = '<form id="form-node-connect" class="form-horizontal">';
        html += '<input name="node_id" value="' + values['node_id'] + '" type="hidden"/>';
        if (values['sort'] == 'iol') {
            // IOL nodes need to reorder interfaces
            // i = x/y with x = i % 16 and y = (i - x) / 16
            var iol_interfc = {};
            $.each(values['ethernet'], function (interfc_id, interfc) {
                var x = interfc_id % 16;
                var y = (interfc_id - x) / 16;
                iol_interfc[4 * x + y] = '<div class="form-group"><label class="col-md-3 control-label">' + interfc['name'] + '</label><div class="col-md-5"><select ' + disabled + ' class="selectpicker form-control" name="interfc[' + interfc_id + ']" data-live-search="true" data-style="selectpicker-button"><option value="">' + MESSAGES[117] + '</option>';
                $.each(links['ethernet'], function (link_id, link) {
                    var link_selected = (interfc['network_id'] == link_id) ? 'selected ' : '';
                    iol_interfc[4 * x + y] += '<option ' + link_selected + 'value="' + link_id + '">' + link + '</option>';
                });
                iol_interfc[4 * x + y] += '</select></div></div>';
            });
            $.each(iol_interfc, function (key, value) {
                html += value;
            });
        } else {
            $.each(values['ethernet'], function (interfc_id, interfc) {
                html += '<div class="form-group"><label class="col-md-3 control-label">' + interfc['name'] + '</label><div class="col-md-5"><select ' + disabled + ' class="selectpicker form-control" name="interfc[' + interfc_id + ']" data-live-search="true" data-style="selectpicker-button"><option value="">' + MESSAGES[117] + '</option>';
                $.each(links['ethernet'], function (link_id, link) {
                    var link_selected = (interfc['network_id'] == link_id) ? 'selected ' : '';
                    html += '<option ' + link_selected + 'value="' + link_id + '">' + link + '</option>';
                });
                html += '</select></div></div>';
            });
        }
        if (values['sort'] == 'iol') {
            // IOL nodes need to reorder interfaces
            // i = x/y with x = i % 16 and y = (i - x) / 16
            var iol_interfc = {};
            $.each(values['serial'], function (interfc_id, interfc) {
                var x = interfc_id % 16;
                var y = (interfc_id - x) / 16;
                iol_interfc[4 * x + y] = '<div class="form-group"><label class="col-md-3 control-label">' + interfc['name'] + '</label><div class="col-md-5"><select ' + disabled + ' class="selectpicker form-control" name="interfc[' + interfc_id + ']" data-live-search="true" data-style="selectpicker-button"><option value="">' + MESSAGES[117] + '</option>';
                $.each(links['serial'], function (node_id, serial_link) {
                    if (values['node_id'] != node_id) {
                        $.each(serial_link, function (link_id, link) {
                            var link_selected = (interfc['remote_id'] + ':' + interfc['remote_if'] == node_id + ':' + link_id) ? 'selected ' : '';
                            iol_interfc[4 * x + y] += '<option ' + link_selected + 'value="' + node_id + ':' + link_id + '">' + link + '</option>';
                        });
                    }
                });
                iol_interfc[4 * x + y] += '</select></div></div>';
            });
            $.each(iol_interfc, function (key, value) {
                html += value;
            });
        } else {
            $.each(values['serial'], function (interfc_id, interfc) {
                html += '<div class="form-group"><label class="col-md-3 control-label">' + interfc['name'] + '</label><div class="col-md-5"><select ' + disabled + ' class="selectpicker form-control" name="interfc[' + interfc_id + ']" data-live-search="true" data-style="selectpicker-button"><option value="">' + MESSAGES[117] + '</option>';
                $.each(links['serial'], function (node_id, serial_link) {
                    if (values['node_id'] != node_id) {
                        $.each(serial_link, function (link_id, link) {
                            var link_selected = '';
                            html += '<option ' + link_selected + 'value="' + link_id + '">' + link + '</option>';
                        });
                    }
                });
                html += '</select></div></div>';
            });
        }

        html += '<div class="form-group"><div class="col-md-5 col-md-offset-3"><button ' + disabled + ' type="submit" class="btn btn-success">' + MESSAGES[47] + '</button> <button type="button" class="btn" data-dismiss="modal">' + MESSAGES[18] + '</button></div></div></form>';

        addModal(values['node_name'] + ': ' + MESSAGES[116], html, '', 'second-win');
        $('.selectpicker').selectpicker();
    }).fail(function (message) {
        // Cannot get data
        addModalError(message);
    });
}

// Display Task in form
function printTaskInForm(id) {
    var task_id = id;
    var deferred = $.Deferred();
    $.when(getLabTask(task_id)).done(function (task) {
    //
    task['data'] =  new TextDecoderLite('utf-8').decode(toByteArray(task['data']));
    $("#task-data").empty().append(task['data']);
    $('#task-data').attr('contenteditable', 'false').removeClass('editable')
    //$('#taskname').empty().append(task['name'])
    return deferred.resolve();
    });
    return deferred.promise();
}

// Display picture in form
function printPictureInForm(id) {
    var picture_id = id;
    var picture_url = '/api/labs' + $('#lab-viewport').attr('data-path') + '/pictures/' + picture_id + '/data';

    //$.when(getPicturesMapped(picture_id)).done(function (picture) {
    $.when(getPictures(picture_id)).done(function (picture) {
        var picture_map = picture['map'];
        picture_map = picture_map.replace(/href='telnet:..{{IP}}:{{NODE([0-9]+)}}/g, function (a,b,c,d,e) {
        var nodehref = ''
        if ( $("#node"+b).length > 0 ) nodehref =  $("#node"+b).find('a')[0].href
	if ( nodehref.indexOf('token') == -1 ) {
		target = 'hiddeniframe';
	} else {
		target = $('#node'+b).attr('data-name')+"_"+b ;
	}
        return "href='"+nodehref+"' target='"+target+"' id='map_"+b;
        }) ;
        // Read privileges and set specific actions/elements
        var sizeClass = FOLLOW_WRAPPER_IMG_STATE == 'resized' ? 'picture-img-autosozed' : ''
        //var sizeClass = ""
        var body = '<div id="lab_picture">' +
            '<img class="' + sizeClass + '" usemap="#picture_map" ' +
            'src="' + picture_url + '" ' +
            'alt="' + picture['name'] + '" ' +
            'title="' + picture['name'] + '" ' +
             //'width="' + picture['width'] + '" ' +
             //'height="' + picture['height'] +
            '/>' +
            '<map name="picture_map">' + picture_map + '</map>' +
            '</div>';

        var footer = '';

        printNodesMap({name: picture['name'], body: body, footer: footer}, function () {
            setTimeout(function () {
               $('map').imageMapResize();
            }, 500);
        });
        window.lab_picture = jsPlumb.getInstance()
        lab_picture.setContainer($('#lab_picture'))
        $('#picslider').slider("value",100)
    }).fail(function (message) {
        addModalError(message);
    });
}

// Display picture form
function displayPictureForm(picture_id) {
    var deferred = $.Deferred();
    var form = '';
    var lab_file = LAB;
    if (picture_id == null) {
        // Adding a new picture
        var title = 'Add new picture';
        var action = 'picture-add';
        var button = 'Add';
        // Header
        form += '<form id="form-' + action + '" class="form-horizontal form-picture">';
        // Name
        form += '<div class="form-group"><label class="col-md-3 control-label">Name</label><div class="col-md-5"><input type="text" class="form-control-static" name="picture[name]" value=""/></div></div>';
        // File (add only)
        form += '<div class="form-group"><label class="col-md-3 control-label">Picture</label><div class="col-md-5"><input type="file" name="picture[file]" value=""/></div></div>';
        // Footer
        form += '<div class="form-group"><div class="col-md-5 col-md-offset-3"><button type="submit" class="btn btn-success">' + button + '</button><button type="button" class="btn" data-dismiss="modal">Cancel</button></div></div></form>';
        // Add the form to the HTML page
        // $('#form_frame').html(form);

        addModal("Add picture", form, '<div></div>');

        // Show the form
        // $('#modal-' + action).modal('show');
        $('.selectpicker').selectpicker();
        validateLabPicture();
        deferred.resolve();
    } else {
        // Can be lab_edit or lab_open

        $.when(getPicture(lab_file, picture_id)).done(function (picture) {
            if (picture != null) {
                if ($(location).attr('pathname') == '/lab_edit.php') {
                    var title = 'Edit picture';
                    var action = 'picture_edit';
                    var button = 'Save';

                    picture_name = picture['name'];
                    if (typeof picture['map'] != 'undefined') {
                        picture_map = picture['map'];
                    } else {
                        picture_map = '';
                    }
                    // Header
                    form += '<div class="modal fade" id="modal-' + action + '" tabindex="-1" role="dialog"><div class="modal-dialog" style="width: 100%;"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">' + title + '</h4></div><div class="modal-body"><form id="form-' + action + '" class="form-horizontal form-picture">';
                    // Name
                    form += '<div class="form-group"><label class="col-md-3 control-label">Name</label><div class="col-md-5"><input type="text" class="form-control" name="picture[name]" value="' + picture_name + '"/></div></div>';
                    // Picure
                    form += '<img id="lab_picture" src="/api/labs' + lab_file + '/pictures/' + picture_id + '/data">'
                    // MAP
                    form += '<div class="form-group"><label class="col-md-3 control-label">Map</label><div class="col-md-5"><textarea type="textarea" name="picture[map]">' + picture_map + '</textarea></div></div>';
                    // Footer
                    form += '<input type="hidden" name="picture[id]" value="' + picture_id + '"/>';
                    form += '<div class="form-group"><div class="col-md-5 col-md-offset-3"><button type="submit" class="btn btn-success">' + button + '</button> <button type="button" class="btn" data-dismiss="modal">Cancel</button></div></div></form></div></div></div></div>';
                    // Add the form to the HTML page
                    $('#form_frame').html(form);

                    // Show the form
                    $('#modal-' + action).modal('show');
                    $('.selectpicker').selectpicker();
                    validateLabPicture();
                    deferred.resolve();
                } else {
                    var action = 'picture_open';
                    var title = picture['name'];
                    if (typeof picture['map'] != 'undefined') {
                        picture_map = picture['map'];
                    } else {
                        picture_map = '';
                    }
                    // Header
                    form += '<div class="modal fade" id="modal-' + action + '" tabindex="-1" role="dialog"><div class="modal-dialog" style="width: 100%;"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">' + title + '</h4></div><div class="modal-body">';
                    // Picure
                    form += '<img id="lab_picture" src="/api/labs' + lab_file + '/pictures/' + picture_id + '/data" usemap="#picture_map">';
                    // Map
                    form += '<map name="picture_map">' + translateMap(picture_map) + '</map>';
                    // Footer
                    form += '</div></div></div></div>';
                    // Add the form to the HTML page
                    $('#form_frame').html(form);

                    // Show the form
                    $('#modal-' + action).modal('show');
                    deferred.resolve();
                }
            } else {
                // Cannot get picture
                raiseMessage('DANGER', 'Cannot get picture (picture_id = ' + picture_id + ').');
                deferred.reject();
            }
        });
    }

    return deferred.promise();
}

// Add a new picture
function printFormPicture(action, values) {
    var map = (values['map'] != null) ? values['map'] : ''
        , custommap = map.replace(/.*NODE.*/g,'').replace(/^\s*[\r\n]/gm,'').replace(/\n*$/,'\n')
        , name = (values['name'] != null) ? values['name'] : ''
        , width = (values['width'] != null) ? values['width'] : ''
        , height = (values['height'] != null) ? values['height'] : ''
        , title = (action == 'add') ? MESSAGES[135] : MESSAGES[137]
        , html = '';
        if ( map != '' ) map = map.match(/.*NODE.*/g).join().replace(/>,</g,'>\n<').replace(/\n*$/,'\n');
        $("#lab_picture").empty()
        $.when(getPictures(values['id'])).done(function (picture) {
        var picture_map = values['map'];
        picture_map = picture_map.replace(/{{IP}}/g, location.hostname);
    $.when(getNodes(null)).done(function (nodes) {
        if (action == 'add') {
            html += '<form id="form-picture-' + action + '" class="form-horizontal form-lab-' + action + '">'+
                '<div class="form-group">'+
                    '<label class="col-md-3 control-label">' + MESSAGES[19] + '</label>'+
                    '<div class="col-md-5">'+
                        '<input class="form-control" autofocus name="picture[name]" value="' + name + '" type="text"/>'+
                    '</div>'+
                    '</div>'+
                '<div class="form-group">'+
                    '<label class="col-md-3 control-label">' + MESSAGES[137] + '</label>'+
                    '<div class="col-md-5">'+
                    '<textarea class="form-control" name="picture[map]">' + map + '</textarea></div>'+
                '</div>'+
                '</div>' +
                '<div class="form-group">'+
                    '<div class="col-md-5 col-md-offset-3">'+
                    '<button type="submit" class="btn btn-success">' + MESSAGES[47] + '</button>'+
                    '<button type="button" class="btn" data-dismiss="modal">' + MESSAGES[18] + '</button>'+
                '</div>'+
            '</div>'+
        '</form>';
    } else {
            //var sizeClass = FOLLOW_WRAPPER_IMG_STATE == 'resized' ? 'picture-img-autosozed' : ''
            var sizeClass = 'resized'
            html += '<form id="form-picture-' + action + '" class="form-horizontal form-lab-' + action + '" data-path=' + values['id'] + '>'+
                '<div class="follower-wrapper">'+
                    '<img class="' + sizeClass + '" src="/api/labs' + $('#lab-viewport').attr('data-path') + '/pictures/' + values['id'] + '/data" alt="' + values['name'] + '" width-val="'+values['width'] + '" height-val="' + values['height'] +'"/>'+
                    '<div id="follower">'+
                    '<map name="picture_map">' + picture_map + '</map>' +
                    '</div>'+
                '</div>'+
                '<div class="form-group">'+
                    '<label class="col-md-3 control-label">' + MESSAGES[19] + '</label>'+
                    '<div class="col-md-5">'+
                        '<input class="form-control" autofocus name="picture[name]" value="' + name + '" type="text"/>'+
                    '</div>'+
                '</div>'+
                '<div class="form-group">'+
                    '<label class="col-md-3 control-label">' + MESSAGES[62] + '</label>'+
                    '<div class="col-md-5">'+
                        '<select class="form-control" id="map_nodeid">';
                        $.each(nodes, function (key, value) {
                            html += '<option value="'+key+'">' + value.name + ', NODE ' +   key + '</option>';
                        });
                    html += '<option value="CUSTOM"> CUSTOM , NODE outside lab</option>';
                    html += '</select>' +
                    '</div>'+
                '</div>'+
                '<div class="form-group">'+
                    '<label class="col-md-3 control-label">'+ MESSAGES[137] + '</label>'+
                    '<div class="col-md-5">'+
                        '<textarea class="form-control map hidden" name="picture[map]">'+ map + '</textarea>'+
                        '<textarea class="form-control custommap" name="picture[custommap]">'+ custommap + '</textarea>'+
                    '</div>'+
                '</div>'+
                '<div class="form-group">'+
                    '<div class="col-md-5 col-md-offset-3">'+
                        '<button type="submit" class="btn btn-success">'+ MESSAGES[47] + '</button>'+
                        '<button type="button" class="btn" data-dismiss="modal">'+ MESSAGES[18] + '</button>'+
                    '</div>'+
                '</div>'+
            '</form>';

        }
        logger(1, 'DEBUG: popping up the picture form.');
        addModalWide(title, html, '', 'second-win modal-ultra-wide');
        var htmlsvg = "" ;
        $.each( $('area') , function ( key, area ) {
        //alert ( area.coords )
        var cX = area.coords.split(",")[0] - 30
        var cY = area.coords.split(",")[1] - 30
        //alert(cX + " " + cY )
        htmlsvg = '<div class="map_mark" id="'+area.coords+'" style="position:absolute;top:'+cY+'px;left:'+cX+'px;width:60px;height:60px;"><svg width="60" height="60"><g><ellipse cx="30" cy="30" rx="28" ry="28" stroke="#000000" stroke-width="2" fill="#ffffff"></ellipse><text x="50%" y="50%" text-anchor="middle" alignment-baseline="central" stroke="#000000" stroke-width="0px" dy=".2em" font-size="12" >'+area.href.replace(/.*{{NODE/g, "NODE ").replace(/}}/g, "").replace(/.*:.*/,"CUSTOM")+'</text></g></svg></div>'
        $(".follower-wrapper").append(htmlsvg)
        });

        validateLabInfo();
    });
    });
}

// User form
function printFormUser(action, values) {
    $.when(getRoles()).done(function (roles) {
        // Got data
        var username = (values['username'] != null) ? values['username'] : '';
        var name = (values['name'] != null) ? values['name'] : '';
        var email = (values['email'] != null) ? values['email'] : '';
        var role = (values['role'] != null) ? values['role'] : '';
        var expiration = (values['expiration'] != null && values['expiration'] != -1) ? $.datepicker.formatDate('yy-mm-dd', new Date(values['expiration'] * 1000)) : '';
        var pod = (values['pod'] != null && values['pod'] != -1) ? values['pod'] : '';
        var pexpiration = (values['pexpiration'] != null && values['pexpiration'] != -1) ? $.datepicker.formatDate('yy-mm-dd', new Date(values['pexpiration'] * 1000)) : '';
        var submit = (action == 'add') ? MESSAGES[17] : MESSAGES[47];
        var title = (action == 'add') ? MESSAGES[34] : MESSAGES[48] + ' ' + username;
        var user_disabled = (action == 'add') ? '' : 'disabled ';
        var html = '<form id="form-user-' + action + '" class="form-horizontal form-user-' + action + '"><div class="form-group"><label class="col-md-3 control-label">' + MESSAGES[44] + '</label><div class="col-md-5"><input class="form-control autofocus" ' + user_disabled + 'name="user[username]" value="' + username + '" type="text"/></div></div><div class="form-group"><label class="col-md-3 control-label">' + MESSAGES[19] + '</label><div class="col-md-5"><input class="form-control" name="user[name]" value="' + name + '" type="text"/></div></div><div class="form-group"><label class="col-md-3 control-label">' + MESSAGES[28] + '</label><div class="col-md-5"><input class="form-control" name="user[email]" value="' + email + '" type="text"/></div></div><div class="form-group"><label class="col-md-3 control-label">' + MESSAGES[45] + '</label><div class="col-md-5"><input class="form-control" name="user[password]" value="" type="password"/></div></div><div class="form-group"><label class="col-md-3 control-label">' + MESSAGES[29] + '</label><div class="col-md-5"><select class="selectpicker show-tick form-control" name="user[role]" data-live-search="true" data-style="selectpicker-button">';
        $.each(roles, function (key, value) {
            var role_selected = (role == key) ? 'selected ' : '';
            html += '<option ' + role_selected + 'value="' + key + '">' + value + '</option>';
        });
        html += '</select></div></div><div class="form-group"><label class="col-md-3 control-label">' + MESSAGES[30] + '</label><div class="col-md-5"><input class="form-control expiration" name="user[expiration]" value="' + expiration + '" type="text"/></div></div><h4>' + MESSAGES[46] + '</h4><div class="form-group"><label class="col-md-3 control-label">POD</label><div class="col-md-5"><input class="form-control pod" name="user[pod]" value="' + pod + '" type="text"/></div></div><div class="form-group"><label class="col-md-3 control-label">' + MESSAGES[30] + '</label><div class="col-md-5"><input class="form-control expiration pod" name="user[pexpiration]" value="' + pexpiration + '" type="text"/></div></div><div class="form-group"><div class="col-md-5 col-md-offset-3"><button type="submit" class="btn btn-success">' + submit + '</button> <button type="button" class="btn btn-flat" data-dismiss="modal">' + MESSAGES[18] + '</button></div></div></form>';
        addModal(title, html, '');
        if (ROLE == "user") {
            $("#form-user-edit input,#form-user-edit select").prop("disabled", true)
            $("#form-user-edit button").remove();
        }
        if (ROLE == "editor") {
            $("#form-user-edit select").prop("disabled", true)
            $("#form-user-edit .pod,#form-user-edit .expiration").prop("disabled", true)
        }
        $('.selectpicker').selectpicker();
        $('.expiration').datepicker({dateFormat: 'yy-mm-dd'});
        //$(".expiration").on("blur", function(e) { $(this).datepicker("hide"); });

        //datepicker forced to close on click
        $('.modal-dialog').on('click', function (e) {
            if (!$(e.target).hasClass('expiration'))
                $('.expiration').datepicker('hide');
        });

        $('.modal').on('hidden.bs.modal', function () {
            $('.expiration').datepicker('hide');
        })

        validateUser();
    }).fail(function (message) {
        // Cannot get data
        addModalError(message);
    });
}

// Print lab preview section
function printLabPreview(lab_filename) {
    $.when(getLabInfo(lab_filename)).done(function (lab) {
        var html = '<h1>' + lab['name'] + ' v' + lab['version'] + '</h1>';
        if (lab['author'] != null) {
            html += '<h2>by ' + lab['author'] + '</h2>';
        }
        html += '<p><code>' + lab['id'] + '</code></p>';
        if (lab['description'] != null) {
            html += '<p>' + lab['description'] + '</p>';
        }
        html += '<button class="action-labopen btn btn-flat" type="button" data-path="' + lab_filename + '">' + MESSAGES[22] + '</button> ';
        if (ROLE != "user")
            html += '<button class="action-labedit-inline btn btn-flat" type="button" data-path="' + lab_filename + '">Edit</button>';
        $('#list-title-info span').html(lab['filename'].replace(/\\/g, '/').replace(/.*\//, ''));
        $('#list-info').html(html);
    }).fail(function (message) {
        addModalError(message);
    });
}

// Drag jsPlumb helpers
// Jquery-ui freeselect


function updateFreeSelect ( e , ui ) {
    if ( $('.node_frame.ui-selected, node_frame.ui-selecting, .network_frame.ui-selected,.network_ui-selecting, .customShape.ui-selected, .customShape.ui-selecting, .line.ui-selected, .line.ui-selecting').length > 0 ) {
        $('#lab-viewport').addClass('freeSelectMode')
    }
    window.freeSelectedNodes = []
         if ( LOCK == 0 && ( ROLE == 'admin' || ROLE == 'editor' )) {
            $.when ( lab_topology.setDraggable($('.node_frame, .network_frame, .customShape, .line'), false) ).done ( function () {
               $.when( lab_topology.clearDragSelection() ).done(  function () {
                    lab_topology.setDraggable($('.node_frame.ui-selected, node_frame.ui-selecting, .network_frame.ui-selected,.network_ui-selecting, .customShape.ui-selected, .customShape.ui-selecting, .line.ui-selected, .line.ui-selecting'),true)
                    lab_topology.addToDragSelection($('.node_frame.ui-selected, node_frame.ui-selecting, .network_frame.ui-selected,.network_ui-selecting, .customShape.ui-selected, .customShape.ui-selecting, .line.ui-selected, .line.ui-selecting'))
              });

            });
         } else {
            $('.customShape.ui-selected, .customShape.ui-selecting').removeClass('ui-selecting').removeClass('ui-selected')
         }
    $('.free-selected').removeClass('free-selected')
    $('.node_frame.ui-selected, node_frame.ui-selecting').addClass('free-selected')
    $('.network_frame.ui-selected, network_frame.ui-selecting').addClass('free-selected')
    $('.customShape.ui-selected, customShape.ui-selecting').addClass('free-selected')
    $('.line.ui-selected, line.ui-selecting').addClass('free-selected')
    $('.node_frame.ui-selected, .node_frame.ui-selecting').each(function() {
         window.freeSelectedNodes.push({ name: $(this).data("name") , path: $(this).data("path") , type: 'node'  });

    });
}

// restore selectable viewport

function restoreSelectLabTopology() {

    $('#lab-viewport').selectable({
        filter: ".customShape, .network, .node, .line",
        start: function () {
            window.newshape = [];
            //var zoom = 100 / $('#zoomslide').slider("value")
            $('.customShape').each(function ()
            {
                var $this = $(this);
                var width;
                var height;
                //window.newshape[$this.attr('id')] = ({width: Math.trunc($this.innerWidth()), height: Math.trunc($this.innerHeight()) })
                window.newshape[$this.attr('id')] = ({width: 'auto' , height: 'auto' })
            })
        },
        stop: function ( event, ui ) {
            $('.customShape').each(function (index) {
                $this = $(this);
                $this.height(window.newshape[$this.attr('id')]['height'])
                $this.width(window.newshape[$this.attr('id')]['width'])
            });
            delete window.newshape;
            updateFreeSelect ( event, ui )
        },
        distance: 1
    });
}

// iframrOpen to add console html5 on topology
function iframeOpen ( name , id ) {
   var frameHtml =    ' <div id="framewrap'+id+'" class="consolewrap hidden" data-name="' + name + '" style="cursor: move; z-index:4030; position: absolute;" > ' +
              ' <i title="open in separate window" class="fas fa-external-link-alt pull-left action-pointer external-open" style="padding: 5px;color: #a6b3b9;" ></i>' +
                      ' <span style="cursor: move ; color: #FFFFFF; font-size: 16px; font-style: normal; font-weight: 100; padding: 30px">'+ name +'</span> ' +
                      ' <button title="Close" class="close frameclose" type"button">x</button> ' +
                      '<i title="Toggle fullscreen" class="glyphicon glyphicon-resize-full action-console-fullscreen pull-right action-pointer" style="color: red; padding: 5px;"></i>' +
                      //( (  String(id).search('_') == -1  ) ? '<i title="Hide console" class="glyphicon glyphicon-certificate pull-right action-pointer action-changeopacity" style="padding: 5px; "></i>' : '' ) +
                      '<i title="Hide console" class="glyphicon glyphicon-eye-close pull-right action-pointer action-minimize" style="padding: 5px; "></i>' +
                      '<i title="change opacity" class="glyphicon glyphicon-certificate pull-right action-pointer action-frameopacity" style="padding: 5px; "></i>' +
                      ' <iframe class="consoleframe"  name="' + name + '_' + id + '"></iframe>' +
              ' <div id="overlay'+id+'" class = "frameoverlay" style="position: absolute; top: 30px; left 10px; width: calc( 100% - 20px ) ; height: calc( 100% - 40px ) ; z-index: 4035; cursor: auto;" ></div>' +
                      ' </div> ' ;
   $('body').append(frameHtml);
   $('.consolewrap').resizable({iframeFix: true,
                grid: [3, 3],
                start: function(e,u){
                    $('.consoleframe').hide()
                },
                stop: function(e,u){
                    $('.consoleframe').show()
		    $(this).click()
                }
             })
             .draggable({grid: [3, 3],
                iframeFix: true ,
                opacity: 0.35,
                containment: "parent",
                stop: function(e,u) {
                    $(this).click()
                }
             });
}

function TaskframeOpen ( id , name ) {
	   var idName = name.replace(/[ :.,@&]/g,'_');
	   var loadinganimation = '<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>';
           var frameHtml =    ' <div id="framewrap'+id+'" class="taskwrap " data-name="' + name + '" style="cursor: move; z-index:4030; position: absolute; " > ' +
                           ' <i title="open in separate window" class="fas fa-external-link-alt pull-left action-pointer task-external-open" style="padding: 5px;color: #a6b3b9;" ></i>' +
                           ' <span style="cursor: move ; color: #FFFFFF; font-size: 16px; font-style: normal; font-weight: 100; padding: 30px">'+ name +'</span> ' +
                           ' <button title="Close" class="close frameclose" type"button">x</button> ' +
                           '<i title="Toggle fullscreen" class="glyphicon glyphicon-resize-full action-console-fullscreen pull-right action-pointer" style="color: red; padding: 5px;"></i>' +
                           '<i title="Hide console" class="glyphicon glyphicon-eye-close pull-right action-pointer action-minimize" style="padding: 5px; "></i>' +
                           '<i title="change opacity" class="glyphicon glyphicon-certificate pull-right action-pointer action-frameopacity" style="padding: 5px; "></i>' +
                           ' <div class="taskframe"  id="' + idName + '_' + id + '">' + loadinganimation + '</div>' +
                           ' <div id="overlay'+id+'" class = "frameoverlay" style="position: absolute; top: 30px; left 10px; width: calc( 100% - 20px ) ; height: calc( 100% - 40px ) ; z-index: 4035; cursor: auto;" ></div>' +
                           ' </div> ' ;
       $('body').append(frameHtml);
       $('.taskwrap').resizable({iframeFix: true,
                                grid: [3, 3],
                                start: function(e,u){
                                        $('.taskframe').hide()
                                },
                                stop: function(e,u){
                                        $('.taskframe').show()
                                }
                     })
                     .draggable({grid: [3, 3],
                                iframeFix: true ,
                                opacity: 0.35,
                                containment: "parent",
                cancel: '.taskframe',
                                stop: function(e,u) {
                                        $(this).click()
                                }
                     });
    $('#framewrap'+id).click();

    $.when(getLabTask(id.replace('task_',''))).done(function (task) {
    //var name = task['name'] ;
    task['data'] =  new TextDecoderLite('utf-8').decode(toByteArray(task['data']));
    if ( task['data'].search('id="MyPdf"') != -1 )   { $('#'+ idName + '_' + id).css("background-color","#222222").css("padding","auto");}
    $('#'+ idName + '_' + id).empty().html(task['data']);

    });
}

function netdataFrameOpen ( node_name, id , name ) {
	   var idName = name
	   var idr =  id.replace(/\//g,'_');
           //var chart = '<html><head><script type="text/javascript" src="/netdata/dashboard.js"></script></head>'+
	   //var chart =		'<body><div data-netdata="'+name+'"></div></body></html>';
           var frameHtml =    ' <div id="framewrap'+name+'" class="netdatawrap " data-name="' + node_name +' '+ id + '" style="cursor: move; z-index:4030; position: absolute; " > ' +
                           //' <i title="open in separate window" class="fas fa-external-link-alt pull-left action-pointer task-external-open" style="padding: 5px;color: #a6b3b9;" ></i>' +
                           ' <i class="fas fa-chart-area" style="color:#a6b3b9;"></i>'+
			   '<span style="cursor: move ; color: #FFFFFF; font-size: 16px; font-style: normal; font-weight: 100; padding: 30px">Graph '+ node_name +' '+ id +'</span> ' +
                           ' <button title="Close" class="close frameclose" type"button">x</button> ' +
                           '<i title="Toggle fullscreen" class="glyphicon glyphicon-resize-full action-console-fullscreen pull-right action-pointer" style="color: red; padding: 5px;"></i>' +
                           '<i title="Hide console" class="glyphicon glyphicon-eye-close pull-right action-pointer action-minimize" style="padding: 5px; "></i>' +
                           '<i title="change opacity" class="glyphicon glyphicon-certificate pull-right action-pointer action-frameopacity" style="padding: 5px; "></i>' +
			   ' <iframe class="netdataframe"  name="' + name + '_' + idr + '" src="/api/graph/'+node_name+'/'+idr+'/'+name+'"></iframe>' +
                           ' <div id="overlay'+name+'" class = "frameoverlay" style="width: calc( 100% - 20px ) ; height: calc( 100% - 40px ) ; z-index: 4035; cursor: auto;" ></div>' +
                           ' </div> ' ;
       $('body').append(frameHtml);
       $('.netdatawrap').resizable({iframeFix: true,
                                grid: [3, 3],
                                start: function(e,u){
                                        $('.netdataframe').hide()
                                },
                                stop: function(e,u){
                                        $('.netdataframe').show()
                                }
                     })
                     .draggable({grid: [3, 3],
                                iframeFix: true ,
                                opacity: 0.35,
                                containment: "parent",
                cancel: '.netdataframe',
                                stop: function(e,u) {
                                        $(this).click()
                                }
                     });
    $('#framewrap'+name).click();
    $('#miniframewrap'+name).prepend('&nbsp;<i class="fas fa-chart-area" style="color:#a6b3b9;"></i>')
    //$('#miniframewrap'+name).prepend('<i class="fa fa-desktop">')
    //$('#'+ idName + '_' + id).empty().html(chart);
}


function quickrender() {
	var html = '<div id="lab-viewport" data-path="' + lab + '">';
	$('#body').html(html);
	printLabTopology()
}

// Print lab topology
function printLabTopology() {
    var defer  = $.Deferred();
    // Get backup
    $('.consolewrap,.taskwrap').not('.hideme').fadeTo("fast", 0.30);
    $('#lab-viewport').empty();
    $('#lab-viewport').selectable();
    $('#lab-viewport').selectable("destroy");
    $('#lab-viewport').selectable({
        filter: ".customShape, .network, .node, .line",
        start: function () {
            window.newshape = [];
            //var zoom = 100 / $('#zoomslide').slider("value")
            $('.customShape').each(function ()
            {
                var $this = $(this);
                var width;
                var height;
                window.newshape[$this.attr('id')] = ({width: Math.trunc($this.innerWidth()), height: Math.trunc($this.innerHeight()) })
            })
        },
        stop: function ( event, ui ) {
            $('.customShape').each(function (index) {
                $this = $(this);
                $this.height(window.newshape[$this.attr('id')]['height'])
                $this.width(window.newshape[$this.attr('id')]['width'])
            });
            delete window.newshape;
            updateFreeSelect ( event, ui )
        },
        distance: 1
    });

    var lab_filename = $('#lab-viewport').attr('data-path')
        , $labViewport = $('#lab-viewport')
        , loadingLabHtml = '' +
            '<div id="loading-lab" class="loading-lab">' +
            '<div class="container">' +
            //'<img src="/themes/default/images/wait.gif"/><br />' +
            '<h3>Loading Lab</h3>' +
            '<div class="progress">' +
            '<div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>' +
            '</div>' +
            '</div>' +
            '</div>'
        , labNodesResolver = $.Deferred()
        , labTextObjectsResolver = $.Deferred()
        , labLineObjectsResolver = $.Deferred()
	, labStatusResolver = $.Deferred()
        , progressbarValue = 0
        , progressbarMax = 100
        ;

    if ($labViewport.data("refreshing")) {
        return ;
    }
    window.lab_topology = undefined;
    $labViewport.empty();
    $labViewport.data('refreshing', true);
    $labViewport.after(loadingLabHtml);
    $("#lab-sidebar *").hide();

     $.when(
        getNetworks(null),
        getNodes(null),
	getInterfaces(),
        getTopology(),
        getTextObjects(),
        getLineObjects(),
        getLabInfo(lab_filename)
    ).done(function (networks, nodes, labInterfaces, topology, textObjects, lineObjects, labinfo) {
	
	 $('#lab-viewport').attr('data-uuid',labinfo['id'])


        var networkImgs = []
            , nodesImgs = []
            , textObjectsCount = Object.keys(textObjects).length
            ;

        progressbarMax = Object.keys(networks).length + Object.keys(nodes).length + Object.keys(textObjects).length + Object.keys(lineObjects).length ;
	console.log("progressbarMax: " + progressbarMax ) 
        $(".progress-bar").attr("aria-valuemax", progressbarMax);

        $.each(networks, function (key, value) {
            var icon;
            var unusedClass='';
	    var smartClass='';
/*
            if (value['type'] == 'bridge' || value['type'] == 'ovs' ) {
                icon = 'lan.png';
            } else {
                icon = 'cloud.png';
            }
*/
	    icon = value['icon']
            if (value['visibility'] == 0 )  unusedClass=' unused '
	    if (value['smart'] != -1 ) smartClass=' smart '


            $labViewport.append(
                '<div id="network' + value['id'] + '" ' +
                'class="context-menu  network network' + value['id'] + ' network_frame '+unusedClass+smartClass+'" ' +
                'style="top: ' + value['top'] + 'px; left: ' + value['left'] + 'px" ' +
                'data-path="' + value['id'] + '" ' +
		'data-status="0" '+
                'data-name="' + value['name'] + '">' +
                '<div class="network_name">' + value['name'] + '</div>' +
                '<div class="tag  hidden" title="Connect to another node">'+
                '<i class="fas fa-plug plug-icon dropdown-toggle ep"></i>'+
                //'<i class="fas fa-ethernet plug-icon dropdown-toggle ep"></i>'+
                '</div>'+
                '</div>');

            networkImgs.push($.Deferred(function (defer) {
                var img = new Image();

                img.onload = resolve;
                img.onerror = resolve;
                img.onabort = resolve;

                img.src = "/images/net_icons/" + icon;

                $(img).prependTo("#network" + value['id']);

                function resolve(image) {
                    img.onload = null;
                    img.onerror = null;
                    img.onabort = null;
                    defer.resolve(image);
                }
            }));

            $(".progress-bar").css("width", ++progressbarValue / progressbarMax * 100 + "%").hide().show(0);
	    console.log("progressbar: " + progressbarValue )



        });
        $.each(nodes, function (key, value) {
            if ( value['url'].indexOf('token') != -1 ) {
               // Html5 Console
           // Create Iframe
                if ( $('#framewrap'+value['id']).length === 0 ) {
                    iframeOpen( value['name'] ,value['id'] )
                }
               hrefbuf='<a href="' + value['url'] + '" target="'+ value['name'] + '_' + value['id'] +'">' ;
               //hrefbuf='<a href="_blank" onclick="iframeOpen("'+value['name']+'",'+ value['url'] +')">' ;
            } else {
           // Native Console
               hrefbuf='<a href="' + value['url'] + '" target="hiddeniframe">' ;
               //iframeOpen( value['name'] ,value['id'] )
               //hrefbuf='<a href="' + value['url'] + '" target="'+ value['name'] + '_' + value['id'] +'">' ;
            }
            $labViewport.append(
                '<div id="node' + value['id'] + '" ' +
                'class="context-menu node node' + value['id'] + ' node_frame "' +
                'style="top: ' + value['top'] + 'px; left: ' + value['left'] + 'px;" ' +
                'data-path="' + value['id'] + '" ' +
                'data-status="' + value['status'] + '" ' +
                'data-sat="' + value['sat'] + '" ' +
                'data-name="' + value['name'] + '" ' +
                'data-qemu="' + ( value['type'] == 'qemu' ? 1 : 0 ) + '" ' +
		'data-linkstate="' + ( (value['type'] == 'qemu' || value['type'] == 'iol' || value['type'] == 'docker' ) ? 1 : 0 ) + '">' +  
                '<div class="tag  hidden" title="Connect to another node">'+
                //'<i class="fas fa-plug plug-icon dropdown-toggle ep"></i>'+
                '<i class="fas fa-ethernet plug-icon dropdown-toggle ep"></i>'+
                '</div>'+
                hrefbuf +
                '</a>' +
                '<div class="node_name"><i class="node' + value['id'] + '_status glyphicon glyphicon-question-sign"></i> ' + value['name'] + '</div>' +
                '</div>');
            nodesImgs.push($.Deferred(function (defer) {
                var img = new Image();

                img.onload = resolve;
                img.onerror = resolve;
                img.onabort = resolve;

                img.src = "/images/icons/" + value['icon'];

                if(value['status'] == 0) img.className = 'grayscale';

                $(img).appendTo("#node" + value['id'] + " a");

                // need the presence of images in the DOM
                if(isIE && value['status'] == 0){
                    addIEGrayscaleWrapper($(img))
                }

                function resolve(image) {
                    img.onload = null;
                    img.onerror = null;
                    img.onabort = null;
                    defer.resolve(image);
                }
            }));

            $(".progress-bar").css("width", ++progressbarValue / progressbarMax * 100 + "%").hide().show(0);
	    console.log("progressbar: " + progressbarValue )
        });
        // In bad situation resolving textobject will save our soul ;-)
        setTimeout( checkDeferred =  ( labTextObjectsResolver.state() == 'pending' ? true :  labTextObjectsResolver.resolve()  ) , 10000 )
        //add shapes from server to viewport
        $.each(textObjects, function (key, textObject) {
            //getTextObject(value['id']).done(function (textObject) {
                $(".progress-bar").css("width", ++progressbarValue / progressbarMax * 100 + "%").hide().show(0);
		console.log("progressbar: " + progressbarValue )
                try {
                    if ( textObject['data'].indexOf('div') != -1  ) {
                                   // nothing to do ?
                    } else {
                                   textObject['data'] =  new TextDecoderLite('utf-8').decode(toByteArray(textObject['data']));
                    }
                }
                catch (e) {
                    console.warn("Compatibility issue", e);
                }

                var $newTextObject = $(textObject['data']);

                if ($newTextObject.attr("id").indexOf("customShape") !== -1) {
                    $newTextObject.attr("id", "customShape" + textObject.id);
                    $newTextObject.attr("data-path", textObject.id);
                    $labViewport.prepend($newTextObject);

                    $newTextObject
                        .resizable().resizable("destroy")
                        .resizable({
                grid:[3, 3],
                            autoHide: true,
                            resize: function (event, ui) {
                                textObjectResize(event, ui, {"shape_border_width": 1});
                            },
                            stop: textObjectDragStop
                        });
                }
                else if ($newTextObject.attr("id").indexOf("customText") !== -1) {
                    $newTextObject.attr("id", "customText" + textObject.id);
                    $newTextObject.attr("data-path", textObject.id);
                    $labViewport.prepend($newTextObject);

                    $newTextObject
                        .resizable().resizable('destroy')
                        /*.resizable({
                grid:[3,3],
                            autoHide: true,
                            resize: function (event, ui) {
                                textObjectResize(event, ui, {"shape_border_width": 1});
                            },
                            stop: textObjectDragStop
                        });*/
                }
                else {
                    return void 0;
                }
                // Finally clean old class saved by error or bug
               $newTextObject.removeClass('ui-selected');
               $newTextObject.removeClass('move-selected');
               $newTextObject.removeClass('dragstopped');
               //if ( labinfo['lock'] == 1 ) $newTextObject.resizable("disable")
                if (--textObjectsCount === 0) {
                    labTextObjectsResolver.resolve();
                }

                //@123

            //}).fail(function () {
            //    logger(1, 'DEBUG: Failed to load Text Object' + value['name'] + '!');
            //});
        });
        if (Object.keys(textObjects).length === 0) {
            labTextObjectsResolver.resolve();
        }
        $.each(lineObjects, function (key, value) {
            $(".progress-bar").css("width", ++progressbarValue / progressbarMax * 100 + "%").hide().show(0);
	    console.log("progressbar: " + progressbarValue )
            var line='<div id="startLine'+value['id']+'" style="z-index: 12000 ;position: absolute; width: 20px; height: 20px;cursor: move;" class="line"></div>'
            line += '<div id="endLine'+value['id']+'" style="z-index: 12000; position: absolute; width: 20px; height: 20px;cursor: move;" class="line"></div>'
            $labViewport.prepend(line);
            $('#startLine'+value['id']).css('top',value['x1']+'px')
            $('#startLine'+value['id']).css('left',value['y1']+'px')
            $('#endLine'+value['id']).css('top',value['x2']+'px')
            $('#endLine'+value['id']).css('left',value['y2']+'px')
        });
        labLineObjectsResolver.resolve();
        $.when.apply($, networkImgs.concat(nodesImgs)).done(function () {
            // Drawing topology
            jsPlumb.ready(function () {

                // Create jsPlumb topology
                try { window.lab_topology.reset() } catch (ex) { window.lab_topology = jsPlumb.getInstance() };
                window.moveCount = 0
                lab_topology.setContainer($("#lab-viewport"));
                lab_topology.importDefaults({
                    Anchor: 'Continuous',
                    //Anchor: [ "Perimeter", { shape:"Square", anchorCount:150 }],
                    Connector: ['Straight'],
                    //Connector: ['Flowchart'],
                    //Endpoints: [ [ 'Dot', { radius : 5 } ], [ 'Dot', { radius : 5 } ] ],
                    //EndpointStyles: [ { fill: "#93191c" },{ fill: "#93191c" } ],
		    //Endpoint: [ 'Dot', { radius : 5 } ], 
		    Endpoint: "Blank", 
                    PaintStyle: {strokeWidth: 2, stroke: '#c00001'},
		    ConnectionsDetachable:false, 
                    cssClass: 'link'
                });
        jsPlumb.setSuspendDrawing(true);
                // Draw Lines
                $.each(lineObjects, function (key, value) {
                        var width = value['width'] ;
                        var color = value['color'] ;
                        var e1 = lab_topology.addEndpoint('startLine' + value['id']);
                        var e2 = lab_topology.addEndpoint('endLine' + value['id']);
			var stub = value['stub'];
			var curviness = value['curviness'];
			var beziercurviness = value['beziercurviness'];
			var round = value['round'];
			var midpoint = value['midpoint'];
			var labelpos = value['labelpos'];
                        //lab_topology.draggable('startLine' + id);
                        //lab_topology.draggable('endLine' + id);
                        //alert ( JSON.stringify( e1 ) )
                        if (  value['paintstyle'] == 'Solid' ) {
                            dash = '""'
                        } else {
                            dash = "2 4"  ;
                        }
                        var tmp_conn = lab_topology.connect({ source: e1,
                                                            target: e2,
                                                            paintStyle: {strokeWidth: width , stroke: color, dashstyle: dash }
                        })
                        tmp_conn.id = 'Line' + value['id'] ;
			curve = ( value['linestyle'] == "Bezier" ) ? beziercurviness : curviness ; 
                        tmp_conn.setConnector([value['linestyle'] , { stub: parseInt (stub),
                                        curviness: parseInt(curve),
                                        cornerRadius: parseInt (round),
                                        midpoint: parseFloat( 1 - midpoint),
                                         }]);

                        //tmp_conn.setConnector(value['linestyle']);
                        if ( value['arrowstyle'] == "arrow" || value['arrowstyle'] == "dblarrow" ) tmp_conn.addOverlay( [ "Arrow" , { width: width*3, length:width*3, location:1, direction: 1 }]);
                        if ( value['arrowstyle'] == "dblarrow" ) tmp_conn.addOverlay( [ "Arrow" , { width: width*3, length:width*3, location:0, direction: -1 }]);
                        if ( value['label'] != '' )  {
                            label = Object({
                                label: value['label'] ,
                                location: parseFloat( labelpos) ,
                                cssClass: 'line_label line_label'+value['id']
                            });
                            tmp_conn.setLabel(label);
                            $('.line_label'+value['id']).css('color', color)
                        }
                        if ((ROLE == 'admin' || ROLE == 'editor') && labinfo['lock'] == 0 )  {
                            lab_topology.draggable($('.line'), {
                                grid: [3, 3],
                            });
                        }
                });
                // Read privileges and set specific actions/elements
                if ((ROLE == 'admin' || ROLE == 'editor') && labinfo['lock'] == 0 )  {
                    dragDeferred = $.Deferred()
                    $.when ( labTextObjectsResolver ).done ( function () {
                        logger(1,'DEBUG: '+ textObjectsCount+ ' Shape(s) left');
                        lab_topology.draggable($('.node_frame, .network_frame, .customShape' ), {
                           containment: false,
                           grid: [3, 3],
                        });

                        adjustZoom(lab_topology, window.scroll_top || 0, window.scroll_left || 0)
                        dragDeferred.resolve();
                    });

                    // Node as source or dest link
                     $.when( dragDeferred ).done( function () {
                     $.each(nodes, function (key,value) {
                           lab_topology.makeSource($('#node' + value['id']), {
                                filter: ".ep",
                                Anchor: "Continuous",
                                extract:{
                                    "action":"the-action"
                                },
                                maxConnections: 30,
                                onMaxConnections: function (info, e) {
                                    alert("Maximum connections (" + info.maxConnections + ") reached");
                                }
                           });

                          lab_topology.makeTarget( $('#node' + value['id']), {
                                dropOptions: { hoverClass: "dragHover" },
                                anchor: "Continuous",
                //Anchor: [ "Perimeter", { shape:"Square", anchorCount:150 }],
                                allowLoopback: false
                          });
                          adjustZoom(lab_topology, window.scroll_top || 0, window.scroll_left || 0)
                    });
                    $.each(networks, function (key,value) {
                           if ( value['visibility'] == 1 ) lab_topology.makeSource($('#network' + value['id']), {
                                filter: ".ep",
                                Anchor:"Continuous",
                //Anchor: [ "Perimeter", { shape:"Square", anchorCount:150 }],
                                connectionType:"basic",
                                extract:{
                                    "action":"the-action"
                                },
                                maxConnections: 30,
                                onMaxConnections: function (info, e) {
                                    alert("Maximum connections (" + info.maxConnections + ") reached");
                                }
                           });

                          if ( value['visibility'] == 1 ) lab_topology.makeTarget($('#network' + value['id']), {
                                dropOptions: { hoverClass: "dragHover" },
                                anchor: "Continuous",
                                allowLoopback: false
                          });
                        adjustZoom(lab_topology, window.scroll_top || 0, window.scroll_left || 0)
                    });
                    });
                }
		
		//if ( window.chrome != null ) { topology.reverse() ; } 
                $.each( topology, function (id, link) {
                    var type = link['type'],
                        source = link['source'],
                        source_label = link['source_label'],
                        source_if_id = link['source_interfaceId'],
                        destination = link['destination'],
                        destination_label = link['destination_label'],
                        destination_if_id = link['destination_interfaceId'],
                        src_label = ["Label"],
                        dst_label = ["Label"],
            tmp_id,
            color,
            label
            var tmp_conn = '';
            var linklinkstyle = link['linkstyle'];
            var linkstyle = link['style'];
            var linkcolor = link['color'];
            var linklabel = link['label'];
	    var linkstub = link['stub'];
	    var linkcurviness = link['curviness'];
	    var linkbeziercurviness = link['beziercurviness'];
	    if ( linklinkstyle == 'Bezier' ) {
		    var linkcurv = linkbeziercurviness 
	    } else {
		    var linkcurv = linkcurviness
	    }
	    var linkround = link['round'];
	    var linkmidpoint = link['midpoint'];
	    var linksrcpos = link['srcpos'];
	    var linkdstpos = link['dstpos'];
	    var labelpos = link['labelpos'];
            if ( linkstyle == '' ) linkstyle = 'Solid';
            if ( linklinkstyle == '' ) linklinkstyle = 'Straight';

                    if (type == 'ethernet') {
                        if (source_label != '') {
                            src_label.push({
				id: "src",
                                label: source_label,
                                location: parseFloat(linksrcpos),
                                cssClass: 'node_interface ' + source + ' ' + destination
                            });
                        } else {
                            src_label.push(Object());
                        }
                        if (destination_label != '') {
                            dst_label.push({
				id: "dst",
                                label: destination_label,
                                location: parseFloat(linkdstpos),
                                cssClass: 'node_interface ' + source + ' ' + destination
                            });
                        } else {
                            dst_label.push(Object());
                        }

            if ( !link['style'] || link['style'] == 'Solid' ) {
                dash =  '""' ;
            } else {
                dash = "2 4"
            }
	    if (!link['width'] ) {
		    width = 2
	    } else {
		    width = link['width']
	    }
            color = ( linkcolor == '' ) ? '#3e7089' : linkcolor
            if ( !color ) color = '#3e7089'
			var source_suspend = '' ;
			var destination_suspend = '' ;
			var  source_tc = '';
			var  destination_tc = '';
			console.log ( link['source_delay'] + link['source_jitter'] + link['source_loss']+ link['source_bandwidth'] )
			if ( link['source_suspend'] == 1 ) source_suspend = 'visible' ;  
			if ( link['source_delay'] + link['source_jitter'] + link['source_loss']+ link['source_bandwidth'] !== 0 ) source_tc = 'traffictc';
			if ( link['destination_suspend'] == 1 ) destination_suspend = 'visible' ; 
			if ( link['destination_delay'] + link['destination_jitter'] + link['destination_loss']+ link['destination_bandwidth'] !== 0 ) destination_tc = 'traffictc';
                        var tmp_conn = lab_topology.connect({
                            source: source,       // Must attach to the IMG's parent or not printed correctly
                            target: destination,  // Must attach to the IMG's parent or not printed correctly
                            cssClass: source + ' ' + destination + ' frame_ethernet' + ' network' ,
                            paintStyle: {strokeWidth: width, stroke: color , dashstyle: dash },
                            overlays: [src_label, dst_label],
                            endpoints: [ [ 'Dot', { radius : 5 , cssClass: 'endpoint_'+source+'_'+source_if_id+
							' dest_'+destination+' '+source_suspend+' '+source_tc+' networkId_'+
							link['network_id'] } ],
					 [ 'Dot', { radius : 5 , cssClass: 'endpoint_'+destination+'_'+destination_if_id+
							' dest_'+source+' '+destination_suspend+' '+destination_tc+' networkId_'+
							link['network_id'] } ] ],
                            //endpointStyles: [ { fill: "#93191c" },{ fill: "#93191c" } ],
                            //endpoint: [ 'Dot', { radius : 5 } ],
                            //endpointStyle: { fill: "red" } 
                        });
            tmp_conn.source = source;
            tmp_conn.source_label = source_label;
                        if ( linklabel && linklabel != '' ) {
                              label =Object({
                              label: linklabel,
                              location: parseFloat(labelpos),
                                  cssClass: 'link_label ' + source + ' ' + destination
                              })
                              tmp_conn.setLabel(label)
                        }
                        if (destination.substr(0, 7) == 'network') {
			      ifaces = labInterfaces['interfaces'][source.replace('node','')];
			      
                              //$.when( getNodeInterfaces(source.replace('node',''))).done( function ( ifaces ) {
                                  for ( ikey in ifaces['ethernet'] ) {
                                      if ( ifaces['ethernet'][ikey]['name'] == source_label ) {
                                         tmp_id = 'iface:'+source+":"+ikey
                     tmp_conn.id = tmp_id
                    tmp_conn.addClass(tmp_id)
                    $('.node_interface.'+source+'.'+destination+'.'+tmp_id.replace(/:/g,'\\:')).css('color',  color )
                    $('.link_label.'+source+'.'+destination+'.'+tmp_id.replace(/:/g,'\\:')).css('color',  color )
                                      }
                                  }
                              //});
                        } else {
                              tmp_id = 'network_id:'+link['network_id']
                  tmp_conn.id = tmp_id
                  tmp_conn.addClass(tmp_id)
                  $.when(tmp_conn.addClass(tmp_id)).done( function () {
                  $('.node_interface.'+source+'.'+destination+'.'+tmp_id.replace(/:/g,'\\:')).css('color',  color )
                  $('.link_label.'+source+'.'+destination+'.'+tmp_id.replace(/:/g,'\\:')).css('color',  color )
                  });
                        }
            // Set style
            //tmp_conn.setConnector([linklinkstyle])
			    tmp_conn.setConnector([linklinkstyle, { stub: parseInt (linkstub),
                                        curviness: parseInt(linkcurv),
                                        cornerRadius: parseInt (linkround),
                                        midpoint: parseFloat( 1 - linkmidpoint),
                                         }]);
                    } else {
                        src_label.push({
			    id: 'src',
                            label: source_label,
                            location: parseFloat(linksrcpos),
                            cssClass: 'node_interface ' + source + ' ' + destination
                        });
                        dst_label.push({
			    id: 'dst',
                            label: destination_label,
                            location: parseFloat(linkdstpos),
                            cssClass: 'node_interface ' + source + ' ' + destination
                        });
                        if ( !link['style'] || link['style'] == 'Solid' ) {
                                dash =  '""' ;
                        } else {
                                dash = "2 4"
                        }
			if (!link['width'] ) {
             		       width = 2
            		} else {
                    		width = link['width']
            		}
                        color = linkcolor
                        if ( !color ) color = '#ffcc00'
			source_suspend = '' ;
                        destination_suspend = '' ;
                        if ( link['source_suspend'] == 1 ) source_suspend = 'visible' ;
                        if ( link['destination_suspend'] == 1 ) destination_suspend = 'visible' ;
            var tmp_conn = lab_topology.connect({
                            source: source,       // Must attach to the IMG's parent or not printed correctly
                            target: destination,  // Must attach to the IMG's parent or not printed correctly
                            cssClass: source + " " + destination + ' frame_serial ',
                            paintStyle: {strokeWidth: width, stroke: color, dashstyle: dash },
                            overlays: [src_label, dst_label],
			    endpoints: [ [ 'Dot', { radius : 5 , cssClass: 'endpoint_'+source+'_'+source_if_id+
						' dest_'+destination+' '+source_suspend+' networkId_'+
						link['network_id']+' serial serial_' +source+ '_' + source_if_id + '_' + destination + '_' + destination_if_id } ],
					 [ 'Dot', { radius : 5 , cssClass: 'endpoint_'+destination+'_'+destination_if_id+
						' dest_'+source+' '+destination_suspend+' networkId_'+
						link['network_id']+' serial serial_' +source+ '_' + source_if_id + '_' + destination + '_' + destination_if_id } ] ],
			    endpointStyles: [ { fill: "#93191c" },{ fill: "#93191c" } ],
                        });
                        tmp_conn.source = source;
                        tmp_conn.source_label = source_label;
                        if ( linklabel && linklabel != '' ) {
                              label =Object({
                              label: linklabel,
                              location: parseFloat(labelpos),
                                  cssClass: 'link_label ' + source + ' ' + destination
                              })
                              tmp_conn.setLabel(label)
                        }
			ifaces = labInterfaces['interfaces'][source.replace('node','')];
                        //$.when( getNodeInterfaces(source.replace('node',''))).done( function ( ifaces ) {
                             for ( ikey in ifaces['serial'] ) {
                                    if ( ifaces['serial'][ikey]['name'] == source_label ) {
                                        tmp_id = 'iface:'+source+':'+ikey
                    tmp_conn.id = tmp_id ;
                    tmp_conn.addClass(tmp_id)
                    $('.link_label.'+source+'.'+destination+'.'+tmp_id.replace(/:/g,'\\:')).css('color',  color )
                    $('.node_interface.'+source+'.'+destination+'.'+tmp_id.replace(/:/g,'\\:')).css('color',  color )
                                    }
                             }
                    //    });
                    //tmp_conn.setConnector([linklinkstyle])
                    tmp_conn.setConnector([linklinkstyle, { stub: parseInt (linkstub),
                                        curviness: parseInt(linkcurv),
                                        cornerRadius: parseInt (linkround),
                                        midpoint: parseFloat( 1 - linkmidpoint),
                                         }]);

                    }
                    // If destination is a network, remove the 'unused' class
                    if (destination.substr(0, 7) == 'network') {
                        $('.' + destination).removeClass('unused');
                    }
                });

        $.when( printLabStatus()).done ( function () {
		labStatusResolver.resolve();
	});

                // Remove unused elements
                $('.unused').remove();
        //lab_topology.draggable($('.frame_ethernet'))


                // Move elements under the topology node
                //$('._jsPlumb_connector, ._jsPlumb_overlay, ._jsPlumb_endpoint_anchor_').detach().appendTo('#lab-viewport');
                // if lock then freeze node network
                if ( labinfo['lock'] == 1 ) {
                                window.LOCK = 1 ;
                                //alert("lock it ")
                                defer.resolve();
                               // if (ROLE == 'admin' || ROLE == 'editor' ) {
                               //      lab_topology.setDraggable($('customShape, .node_frame, .network_frame'), false );
                               //}
                               $('.action-lock-lab').html('<i style="color:red" class="fas fa-lock"></i>' + MESSAGES[167])
                               $('.action-lock-lab').removeClass('action-lock-lab').addClass('action-unlock-lab')
                   $('.action-labobjectadd-li').fadeTo(0,0)

                } else {
                   $('.action-labobjectadd-li').fadeTo(0,1)
        }
                defer.resolve(LOCK);
                $labViewport.data('refreshing', false);
                labNodesResolver.resolve();
                lab_topology.bind("connection", function (info , oe ) {
                       newConnModal(info , oe);
                });
                // Bind contextmenu to connections
                lab_topology.bind("contextmenu", function (info) {
                       connContextMenu (info);
                });
		$('body').append(' <div id="hiddeniframediv" class="hidden"><iframe name="hiddeniframe"></iframe></div>');
        // display timer if needed
        if ( labinfo['lock'] == 1 ) {
            if ( labinfo['countdown'] > 0 ) {
                //timer_html = '<div id="countdown" style="width: 80px; height: 30px;font-size:1em;align:center;"></div>';
                timer_html = '<div id="countdown" style="display: inline-block;font-size:1em;align:center;"></div>';
                $('#lab-viewport').append(timer_html);
                if ( $.cookie("countdown") == null || $.cookie("countdown") == 0  ) {
                    $.cookie("countdown", Date.now() + labinfo['countdown'] * 1000 , { expires: Date.now() + labinfo['countdown'] * 1000, path: ";SameSite=Lax", secure: true }  );
                }
                var timer = $.cookie("countdown");
                $('#countdown').countdown( timer , {elapse: false})
                .on('update.countdown', function(event) {
                    var $this = $(this);
                    $this.html(event.strftime('<span>%H:%M:%S</span>'));
                }).on('finish.countdown', function(event) {
                    //$('#countdown').remove();
                    var $this = $(this);
                    $this.html(event.strftime('&nbsp;<span>%H:%M:%S</span>'));
                    $('#countdown').css('color','red') ;
                });
            }
        } else {
            $.cookie("countdown", 0 );
        }
           });
        jsPlumb.setSuspendDrawing(false,true);
        lab_topology.repaintEverything();
        }).fail(function () {
            logger(1, "DEBUG: not all images of networks or nodes loaded");
            $('#lab-viewport').data('refreshing', false);
            labNodesResolver.reject();
            labTextObjectsResolver.reject();
        });


    })
         .fail(function (message1, message2, message3) {
        if (message1 != null) {
            addModalError(message1);
        } else if (message2 != null) {
            addModalError(message2)
        } else {
            addModalError(message3)
        }
        $('#lab-viewport').data('refreshing', false);
        labNodesResolver.reject();
        labTextObjectsResolver.reject();
        $.when(closeLab()).done(function () {
          //newUIreturn();
        }).fail(function (message) {
          addModalError(message);
        });
    });

    $.when(labNodesResolver, labTextObjectsResolver, labStatusResolver).done(function () {

        //$.when(deleteSingleNetworks()).done(function(){
            if ( $.cookie("topo")  != undefined && $.cookie("topo") == 'dark' ) {
		if ( GRID == 1 ) {
                	$('#lab-viewport').css('background-image','url(/themes/adminLTE/unl_data/img/grid-dark.png)');
		} else {
			$('#lab-viewport').css('background-image','none');
			$('#lab-viewport').css('background-color','#28353c');
		}
                $('.node_name').css('color','#b8c7ce')
                $('.network_name').css('color','#b8c7ce')
            } else {
		if ( GRID == 0 ) {
			$('#lab-viewport').css('background-image','none');
			$('#lab-viewport').css('background-color','#ffffff');
		}
	    }
	    if ( $.cookie("labels") != undefined && $.cookie("labels") == 'off' ) {
		$('.jtk-overlay').hide();
	    }
            $("#loading-lab").remove();
            $("#lab-sidebar *").show();
	    //console.log  ( '%o' , lab_topology ) ;
        $('.consolewrap').not('.hideme').fadeTo("fast", 1);
        //})

    }).fail(function (message1, message2) {
        if (message1 != null) {
            addModalError(message1);
        } else if (message2 != null) {
            addModalError(message2)
        }
        $("#loading-lab").remove();
        $("#lab-sidebar ul").show();
        $("#lab-sidebar ul li:lt(11)").hide();
    });
      return defer.promise();

}

// Display lab status
function printLabStatus() {
    // logger(1, 'DEBUG: updating node status');
    var deferred = $.Deferred();
    $.when(getNodesStatus(null)).done(function (nodes) {
        $.each(nodes, function (node_id, node) {
        $('#node'+  node['id'] + ' a').attr("href", node['url']);
            if (node['status'] == 0) {
                // Stopped
                $('.node' + node['id'] + '_status').attr('class', 'node' + node['id'] + '_status glyphicon glyphicon-stop');
                $('#node' + node['id'] + ' img').addClass('grayscale')
		$('.action-console'+node['id']).hide();
		$('.action-nodestart'+node['id']).show();
                if ( $('input[data-path='+node['id']+'].configured-nodes-input').prop('disabled') === true ) { $('input[data-path='+node['id']+'.configured-nodes-input]').prop('disabled', false) }
                if ( $('select[data-path='+node['id']+'].configured-nodes-select').prop('disabled') === true ) { $('select[data-path='+node['id']+'].configured-nodes-select').prop('disabled', false) }
                if(isIE) toogleIEGrayscle($('#node' + node['id'] + ' img'), true);
            } else if (node['status'] == 1) {
                // Stopped and locked
                $('.action-console'+node['id']).hide();
                $('.action-nodestart'+node['id']).show();
                $('.node' + node['id'] + '_status').attr('class', 'node' + node['id'] + '_status glyphicon glyphicon-warning-sign');
                $('#node' + node['id'] + ' img').addClass('grayscale')
                if ( $('input[data-path='+node['id']+'].configured-nodes-input').prop('disabled') === true ) { $('input[data-path='+node['id']+'.configured-nodes-input]').prop('disabled', false) }
                if ( $('select[data-path='+node['id']+'].configured-nodes-select').prop('disabled') === true ) { $('select[data-path='+node['id']+'].configured-nodes-select').prop('disabled', false) }
                if(isIE) toogleIEGrayscle($('#node' + node['id'] + ' img'), true);
            } else if (node['status'] == 2) {
                // Running
                $('.action-console'+node['id']).show();
                $('.action-nodestart'+node['id']).hide();
                $('.node' + node['id'] + '_status').attr('class', 'node' + node['id'] + '_status glyphicon glyphicon-play');
                $('#node' + node['id'] + ' img').removeClass('grayscale')
                if(isIE) toogleIEGrayscle($('#node' + node['id'] + ' img'), false);
                $('input[data-path='+node['id']+'][name="node[type]"]').parent().addClass('node-running')
                if ( $('input[data-path='+node['id']+'].configured-nodes-input').prop('disabled') === false ) { $('input[data-path='+node['id']+'].configured-nodes-input').prop('disabled', true) }
                if ( $('select[data-path='+node['id']+'].configured-nodes-select').prop('disabled') === false ) { $('select[data-path='+node['id']+'].configured-nodes-select').prop('disabled', true) }
                //$("a[data-path="+node['id']+"].action-nodeedit").addClass('disabled')
                $("a[data-path="+node['id']+"].action-nodedelete").addClass('disabled')
                $("a[data-path="+node['id']+"].action-nodeinterfaces").attr('data-status', 2)
            } else if (node['status'] == 3) {
                if ( $('input[data-path='+node['id']+'].configured-nodes-input').prop('disabled') === false ) { $('input[data-path='+node['id']+'].configured-nodes-input').prop('disabled', true) }
                if ( $('select[data-path='+node['id']+'].configured-nodes-select').prop('disabled') === false ) { $('select[data-path='+node['id']+'].configured-nodes-select').prop('disabled', true) }
                // Running and locked
                $('.action-console'+node['id']).show();
                $('.action-nodestart'+node['id']).hide();
                $('.node' + node['id'] + '_status').attr('class', 'node' + node['id'] + '_status glyphicon glyphicon-time');
                $('#node' + node['id'] + ' img').removeClass('grayscale')
                if(isIE) toogleIEGrayscle($('#node' + node['id'] + ' img'), false);
            } else if (node['status'] == 4) {
                if ( $('input[data-path='+node['id']+'].configured-nodes-input').prop('disabled') === false ) { $('input[data-path='+node['id']+'].configured-nodes-input').prop('disabled', true) }
                if ( $('select[data-path='+node['id']+'].configured-nodes-select').prop('disabled') === false ) { $('select[data-path='+node['id']+'].configured-nodes-select').prop('disabled', true) }
                $('.node' + node['id'] + '_status').attr('class', 'node' + node['id'] + '_status glyphicon glyphicon-cog gly-spin');
            } else {
                // Undefined
                $('.action-console'+node['id']).hide();
                $('.action-nodestart'+node['id']).show();
                $('.node' + node['id'] + '_status').attr('class', 'node' + node['id'] + '_status glyphicon glyphicon-question-sign');
                $('#node' + node['id'] + ' img').addClass('grayscale')
                if ( $('input[data-path='+node['id']+'].configured-nodes-input').prop('disabled') === true ) { $('input[data-path='+node['id']+'.configured-nodes-input]').prop('disabled', false) }
                if ( $('select[data-path='+node['id']+'].configured-nodes-select').prop('disabled') === true ) { $('select[data-path='+node['id']+'].configured-nodes-select').prop('disabled', false) }
                if(isIE) toogleIEGrayscle($('#node' + node['id'] + ' img'), true);
            }

            //add status attr
            $('.node' + node['id']).attr('data-status',node['status']);
            $('.node' + node['id']).attr('data-sat',node['sat']);
            $('.node' + node['id']).attr('data-labId',node['labId']);
	    // update node list 
                cpu =  ( parseFloat(node['cpu_usage']) / parseInt ( (node['cpu'] == '0.1' ) ? '1' : node['cpu'] ) ) ;
		if ( isNaN( cpu ) ) { cpu = 0 } ;
		if ( cpu > 100 ) { cpu = 100 };
                $( "#progressbarcpu_"+node['id'] ).progressbar({
			value: ( cpu == 0 ) ? '' : cpu
                })
                .children('.ui-progressbar-value')
                .html( "&nbsp;"+ parseFloat(cpu.toFixed(1)) + '%')
                .css("display", "block");

                if ( cpu == 0 ) {
			$( "#progressbarcpu_"+node['id']+" > div ").css("background","transparent").css("width","0");
		} else {
			$( "#progressbarcpu_"+node['id']+" > div ").css("background",percentageToHsl( cpu / 100 , 128, 0));
		}

                ram=parseFloat(node['ram_usage']) * 100 / ( parseInt ( node['ram']) * 1048576 );
		if ( isNaN( ram ) ) { ram = 0 } ;
                $( "#progressbarram_"+node['id'] ).progressbar({
			value: ( ram == 0 ) ? '' : ram
                })
                .children('.ui-progressbar-value')
                .html("&nbsp;" + parseFloat(ram.toFixed(1)) + '%')
                .css("display", "block");
		if ( ram == 0 ) {
			$( "#progressbarram_"+node['id']+" > div ").css("background","transparent").css("width","0");
		} else {
			$( "#progressbarram_"+node['id']+" > div ").css("background",percentageToHsl( ram / 100 , 128, 0));
		}
	    // end of node list update

        });

    if ( (nodes['diskavailable'] - nodes['disk'])  < nodes['mindisk'] ) { addMessage('danger', 'Alert: Only '+ Math.round( nodes['diskavailable'] - nodes['disk']) +'GB free on EVE HDD<br>Please add new HDD to continue <a href="http://www.eve-ng.net/index.php/documentation/howto-s-2/88-howto-expand-filesystem-on-eve-vm" target="_" > ( Help ) </a>' ); } ;
    // add new timer 
    if ( $('.configured-nodes').length == 0 ) {
	        if ( typeof UPDATEID_QUICK !== 'undefined' && UPDATEID_QUICK != null) {
                    // Stop updating node_status
                    clearInterval(UPDATEID_QUICK);
		    UPDATEID_QUICK = null ;
		    UPDATEID = setInterval('printLabStatus("' + LAB + '")', STATUSINTERVAL);   
                }
    } 
    return deferred.promise();
    }).fail(function (message) {
        addMessage('danger', message);
    return deferred.reject();
    });
}

// Display all networks in a table
function printListNetworks(networks) {
    logger(1, 'DEBUG: printing network list');
    var body = '<table><thead><tr><th>' + MESSAGES[92] + '</th><th>' + MESSAGES[19] + '</th><th>' + MESSAGES[95] + '</th><th>' + MESSAGES[97] + '</th><th>' + MESSAGES[99] + '</th></tr></thead><tbody>';
    $.each(networks, function (key, value) {
        if ( value['visibility'] == 1 )  {
              body += '<tr class="network' + value['id'] + '"><td>' + value['id'] + '</td><td>' + value['name'] + '</td><td>' + value['type'] + '</td><td>' + value['count'] + '</td><td><a class="action-networkedit" data-path="' + value['id'] + '" data-name="' + value['name'] + '" href="javascript:void(0)" title="' + MESSAGES[71] + '"><i class="glyphicon glyphicon-edit"></i></a><a class="action-networkdelete" data-path="' + value['id'] + '" data-name="' + value['name'] + '" href="javascript:void(0)" title="' + MESSAGES[65] + '"><i class="glyphicon glyphicon-trash"></i></a></td></tr>';
        }
    });
    body = $(body);
    if ( ROLE == "user"  ||  LOCK == 1  ) {
        body.find(".action-networkedit,.action-networkdelete").remove();
    }
    body = '<div class="table-responsive"><table class="table">' + body.html() + '</tbody></table></div>';
    addModalWide(MESSAGES[96], body, '');
}

// Display Network Manage screen
function printFormNetworkManage(network) {
	var id = network['id'];
	var smart = network['smart'];
	var vlan8021ad = network['vlan8021ad'];
	var left = network['left'];
	var top = network['top'];
	var title = network['name'];
	var interfaces =  network['interfaces'];
	logger(1, 'DEBUG: printing network manage modal');
	        var html = '<form id="form-network-manage" class="form-horizontal">';
                html += '<div class="form-group"><label class="col-md-3 control-label">' + MESSAGES[92] + '</label>' +
		'<div class="col-md-5"><input class="form-control" disabled name="network[id]" value="' + id + '" type="text"/></div></div>';
                html += '<div class="form-group"><label class="col-md-6 control-label">Smart Bridge (Experimental)</label>'+
		'<div class="col-md-2"><input type=checkbox style="margin-top: 10px;" value='+ ( smart==1 ? 1 : 0 ) +' name="network[smart]" ' + (smart == 1 ? 'checked' : '' ) + '/></div></div>';
		html += '<div class="form-group"><label class="col-md-6 control-label">Enable 802.1ad (Experimental)</label>'+
                '<div class="col-md-2"><input type=checkbox style="margin-top: 10px;" value='+ ( vlan8021ad==1 ? 1 : 0 ) +' name="network[vlan8021ad]" ' + (vlan8021ad == 1 ? 'checked' : '' ) + '/></div></div>';
                html += '<div class="form-group">'+
		'<table style="width:80%;margin-left: auto;margin-right: auto;"><thead><tr><th>Node Id</th><th>Node Name</th><th>Interface Id</th><th>Interface Name</th><th>Vlan Id</th></tr></thead>';
		$.each(interfaces, function ( key, iface ) {
			    html += '<input type=hidden name="network[NodeId_'+key+']" value="'+iface['NodeId']+'"/>';
			    html += '<input type=hidden name="network[NodeName_'+key+']" value="'+iface['NodeName']+'"/>';
			    html += '<input type=hidden name="network[IfId_'+key+']" value="'+iface['IfId']+'"/>';
			    html += '<input type=hidden name="network[IfName_'+key+']" value="'+iface['IfName']+'"/>';
			    html += '<tr><td>' + iface['NodeId'] + '</td><td>' + iface['NodeName'] + '</td><td>' + iface['IfId'] + '</td><td>' + iface['IfName'] + '</td><td>' + '<input type=text name="network[Vlan_'+key+']" size=5 value="'+iface['VlanId']+'" oninput="this.value = this.value.replace(/[^0-9.]/g, \'\').replace(/(\\\..*)\\\./g, \'$1\');" >' + '</td></tr>'; 

			    });
		html += '<input type=hidden name="network[count]" value="' + interfaces.length + '" />';
		html += '</table>';
                              //              '<select class="selectpicker form-control" name="network[icon]" data-size="5" data-style="selectpicker-button">';
                            //$.each(icons, function (icon_key, icon_value) {
                            //    var selected = (icon_key == icon) ? 'selected ' : '';
                                //    iconselect = '' ;
                                //if ( key == "icon" ) { iconselect = 'data-content="<img src=\'/images/icons/'+list_value+'\' height=15 width=15>&nbsp;&nbsp;&nbsp;'+list_value+'"' };
                                //iconselect = 'data-content="<img src=\'/images/net_icons/'+icon_value+'\' height=15 width=15>&nbsp;&nbsp;&nbsp;'+icon_value+'"' ;
                            //    html += '<option ' + selected + 'value="' + icon_key + '" '+ iconselect +'>' + icon_value + '</option>';
                            //});
                            //html += '</select></div></div>';
        html += '<div class="form-group"><div class="col-md-5 col-md-offset-3"><button type="submit" class="btn btn-success">' + MESSAGES[47] + '</button> <button type="button" class="btn" data-dismiss="modal">' + MESSAGES[18] + '</button></div></div></form>'
        // Show the form
        addModal(title, html, '', 'second-win');
        $('.selectpicker').selectpicker();
        $('.autofocus').focus();


}

// check template's options that field's exists
function checkTemplateValue(template_options, field){
    if(template_options[field]){
        return template_options[field].value.toString();
    } else if(!template_options[field] && parseInt(template_options[field]) === 0) {
        return template_options[field].value.toString();
    } else {
        return "";
    }
}

//function createNodeListRow(template, id){
function createNodeListRow(template, node_values){
    logger(1, 'DEBUG: configsets :' + JSON.stringify(window.configsets) );
    var html_data = "";
    var defer = $.Deferred();
    var userRight = "readonly";
    var disabledAttr = 'disabled="true"' ;
    if ((ROLE == 'admin' || ROLE == 'editor') && LOCK == 0 ) {
         userRight = "";
         disabledAttr = ""
    }

//    $.when(getTemplates(template), getNodes(id)).done(function (template_values, node_values) {
    $.when(getTemplates(template)).done(function (template_values) {
        //console.log("node_values", node_values)
        var value_set = "";
	var id = node_values['id'];
        var readonlyAttr = "";
        var value_name      = node_values['name'];
	var value_sat = template_values['options']['sat']['list'][node_values['sat']]
	var computed_sat = node_values['computed_sat']
        var value_cpu       = ( node_values['cpu'] != undefined || node_values['cpu'] == 0 ) ? node_values['cpu']  : "n/a";
	//console.log ( value_cpu );
        var value_cpu_usage       = node_values['cpu_usage'] || "n/a";
        var value_cpulimit       = node_values['cpulimit'] ;
        if ( value_cpulimit == undefined )  value_cpulimit = "n/a";
        var value_idlepc    = node_values['idlepc'] || "n/a";
        var value_nvram     = node_values['nvram'] || "n/a";
        var value_ram       = node_values['ram'] || "n/a";
        var value_ram_usage       = node_values['ram_usage'] || "n/a";
        var value_ethernet  = node_values['ethernet'] || "n/a";
        var value_console   = checkTemplateValue(template_values,'console') || node_values['console'] || ""
        var value_serial    = "";
        if(node_values['serial']){
            value_serial = node_values['serial'];
        } else if(!node_values['serial'] && parseInt(node_values['serial']) === 0){
            value_serial = node_values['serial'].toString();
        } else{
            value_serial = "n/a";
        }

        var highlightRow = '';
        var disabled = '';
        var disabledClass = '';
        if(node_values['status'] == 2){
            highlightRow = 'node-running';
            // disabled = 'disabled';
            disabledAttr = 'disabled="true"' ;
            disabledClass = ' disabled '
        }
	value_cpu_usage =  value_cpu_usage /   value_cpu ;
	if ( value_cpu_usage > 100 ) {
		value_cpu_usage = 100;
	}

        // TODO: this event is called twice
        id = (id == null) ? '' : id;
        var html_data = '<tr class=" ' + highlightRow+ ' "><input name="node[type]" data-path="' + id + '" value="' + template_values['type'] + '" type="hidden"/>';
        html_data += '<input name="node[left]" data-path="' + id + '" value="' + node_values['left'] + '" type="hidden"/>';
        html_data += '<input name="node[top]" data-path="' + id + '" value="' + node_values['top'] + '" type="hidden"/>';

        // node id
        html_data += '<td><input class="hide-border" style="width: 20px;" value="' + id + '" readonly/></td>';

        //node name
        html_data += '<td><input class="configured-nodes-input ' + userRight + '" data-path="' + id + '" name="node[name]" value="' + value_name + '" type="text" ' + disabledAttr + ' /></td>';

	//node_sat
	//html_data += '<td><input class="hide-border ' + userRight + '" style="width:30px;" data-path="' + id + '" name="node[sat]" value="' + value_sat + '" readonly/></td>';
	
	//node_sat
	var warning = (  node_values['computed_sat'] == -2 ) ? ' style="color:red;" ' : '' ;
	html_data += '<td><select class="configured-nodes-select form-control"' + disabledAttr + warning + 'data-path="' + id + '" name="node[sat]">'
	var options_arr = template_values['options']['sat']['list'];
	$.each( options_arr, function (list_key, list_value) {
		var selected = (list_key == node_values['sat']) ? 'selected ' : '';
		html_data += '<option ' + selected + 'value="' + list_key + '">' + list_value + '</option>';
        });
        html_data += '</select></td>';

        //node template
        html_data += '<td><input class="hide-border ' + userRight + '" style="width:100px;" data-path="' + id + '" name="node[template]" value="' + template + '" readonly/></td>';

        //node boot image
        if(template == "vpcs"){
            html_data += '<td><input class="configured-nodes-input short-input readonly" data-path="' + id + '" name="node[cpu]" value="n/a" type="text" readonly /></td>';
        } else {
            html_data += '<td><select class="configured-nodes-select form-control"' + disabledAttr + 'data-path="' + id + '" name="node[image]">'
            value_set = (node_values != null && template_values['options']['image'] && template_values['options']['image']['list']) ? node_values['image'] : "";
            var options_arr = template_values['options']['image'] && template_values['options']['image']['list'] ? template_values['options']['image']['list'] : [];
            $.each(options_arr, function (list_key, list_value) {
                var selected = (list_key == value_set) ? 'selected ' : '';
                html_data += '<option ' + selected + 'value="' + list_key + '">' + list_value + '</option>';
            });
            html_data += '</select></td>';
        }

        //node cpu
        readonlyAttr = (value_cpu != "n/a") ? "" : "readonly";
        html_data += '<td><input class="configured-nodes-input short-input ' + readonlyAttr + ' ' + userRight + '" data-path="' + id + '" name="node[cpu]" value="' + value_cpu + '" type="text" ' + readonlyAttr + ' ' + disabledAttr + ' /></td>';
	//cpu usage
        html_data += '<td><div id="progressbarcpu_'+id+'" class="progressbarcpu_'+id+'" data-usage="'+value_cpu_usage+'" style="width:70px;"  ></div></td>';
       //node cpu limit
       readonlyAttr = (value_cpulimit != "n/a") ? "" : "readonly";
       html_data += '<td><input class="configured-nodes-checkbox short-input ' + readonlyAttr + ' ' + userRight + '" data-path="' + id + '" name="node[cpulimit]" value="' + value_cpulimit + '" type="' + ((value_cpulimit == "n/a" ) ? 'input' :'checkbox')  + '" ' + readonlyAttr + ' ' + disabledAttr + ' '+ ( (value_cpulimit == 1) ? 'checked' : '' ) +'/></td>';

        //node idle
        readonlyAttr = (value_idlepc && value_idlepc != "n/a") ? "" : "readonly";
        html_data += '<td><input class="configured-nodes-input ' + readonlyAttr + ' ' + userRight + '" data-path="' + id + '" name="node[idlepc]" value="' + value_idlepc + '" type="text" ' + readonlyAttr + ' ' + disabledAttr + ' /></td>';

        //node nvram
        readonlyAttr = (value_nvram && value_nvram != "n/a") ? "" : "readonly";
        html_data += '<td><input class="configured-nodes-input short-input ' + readonlyAttr + ' ' + userRight + '" data-path="' + id + '" name="node[nvram]" value="' + value_nvram + '" type="text" ' + readonlyAttr + ' ' + disabledAttr + ' /></td>';

        //node ram
        readonlyAttr = (value_ram && value_ram != "n/a") ? "" : "readonly";
        html_data += '<td><input class="configured-nodes-input short-input ' + readonlyAttr + ' ' + userRight + '" data-path="' + id + '" name="node[ram]" value="' + value_ram + '" type="text" ' + readonlyAttr + ' ' + disabledAttr + ' /></td>';
        //ram usage
        html_data += '<td><div id="progressbarram_'+id+'" class="progressbarram_'+id+'" data-usage="'+value_ram_usage+'" style="width:70px;"></div></td>';
        //node ethernet
        if(template == "vpcs"){
            readonlyAttr = "readonly";
        } else {
            readonlyAttr = (value_ethernet && value_ethernet != "n/a") ? "" : "readonly";
        }
        html_data += '<td><input class="configured-nodes-input short-input ' + readonlyAttr + ' ' + userRight + '" data-path="' + id + '" name="node[ethernet]" value="' + value_ethernet + '" type="text" ' + readonlyAttr + ' ' + disabledAttr + ' /></td>';

        //node serial
        readonlyAttr = (value_serial && value_serial != "n/a") ? "" : "readonly";
        html_data += '<td><input class="configured-nodes-input short-input ' + readonlyAttr + ' ' + userRight + '" data-path="' + id + '" name="node[serial]" value="' + value_serial + '" type="text" '  + readonlyAttr + ' ' + disabledAttr + '/></td>';

        //node console
        if(template == "iol"){
            html_data += '<td><input class="hide-border"  data-path="' + id + '" value="telnet" readonly/></td>';
        } else if(template_values['options']['console']){
            html_data += '<td><select class="configured-nodes-select form-control"' + disabledAttr + ' name="node[console]" data-path="' + id + '" >'
            value_set = (node_values != null && node_values['console'] != null) ? node_values['console'] : value['value'];
            $.each(template_values['options']['console']['list'], function (list_key, list_value) {
                var selected = (list_key == value_set) ? 'selected ' : '';
                html_data += '<option ' + selected + 'value="' + list_key + '">' + list_value + '</option>';
            });
            html_data += '</select></td>';
        } else {
            html_data += '<td><input class="hide-border" name="node[console]" value="' + value_console + '" type="text" readonly/></td>';
        }

        //node icons
        html_data += '<td><select class="selectpicker configured-nodes-select form-control" style="z-index:4010;"' + disabledAttr + ' data-path="' + id + '" data-size="5" name="node[icon]" data-container="body">'
        value_set = (node_values != null && node_values['icon'] != null) ? node_values['icon'] : value['value'];
        $.each(template_values['options']['icon']['list'], function (list_key, list_value) {
            var selected = (list_key == value_set) ? 'selected ' : '';
            var iconselect = 'data-content="<img src=\'/images/icons/'+list_value+'\' height=15 width=15>&nbsp;&nbsp;&nbsp;'+list_value+'&nbsp;&nbsp;"';
            html_data += '<option ' + selected + 'value="' + list_key + '" ' + iconselect + '>' + list_value + '</option>';
        });
        html_data += '</select></td>';

        //node startup-configs
        //html_data += '<td><select class="configured-nodes-select form-control"' + disabledAttr + ' data-path="' + id + '" name="node[config]">'
        html_data += '<td><select class="configured-nodes-select form-control"' + ' data-path="' + id + '" name="node[config]">'
        value_set = (node_values != null && node_values['config'] != null) ? node_values['config'] : value['value'];
        $.each(template_values['options']['config']['list'], function (list_key, list_value) {
            var selected = (list_key == value_set) ? 'selected ' : '';
            html_data += '<option ' + selected + 'value="' + list_key + '">' + list_value + '</option>';
        if ( list_key == 1 ) {
        $.each(window.configsets, function ( cfs_key , cfs_value ) {
            var selected = ( cfs_key == value_set ) ? 'selected ' : '';
            html_data += '<option ' + selected + 'value="' +  cfs_key  + '">' + cfs_value['name'] + '</option>';
        });
        }
        });
    /*$.each(window.configsets, function ( cfs_key , cfs_value ) {
        var selected = ( cfs_key == value_set ) ? 'selected ' : '';
        html_data += '<option ' + selected + 'value="' +  cfs_key  + '">' + cfs_value['name'] + '</option>';
    });*/
        html_data += '</select></td>';

        //node actions
        html_data += '<td><div class="action-controls">';
        //if(node_values['status'] == 2) {
            html_data += '<a class="action-console" data-path="' + id + '" data-name="' + checkTemplateValue(template_values['options'],'name') + '" href="javascript:void(0)" title="' + MESSAGES[112] + '"><i class="action-console'+id+' fa fa-desktop" style="display:'+((node_values['status'] == 2)?'inline':'none')+'"></i></a>';
        //} else {
            html_data += '<a class="action-nodestart" data-path="' + id + '" data-name="' + checkTemplateValue(template_values['options'],'name') + '" href="javascript:void(0)" title="' + MESSAGES[66] + '"><i class="action-nodestart'+id+' glyphicon glyphicon-play" style="display:'+((node_values['status'] != 2)?'inline':'none')+'"></i></a>';
        //}
        html_data += '<a class="action-nodestop" data-path="' + id + '" data-name="' + checkTemplateValue(template_values['options'],'name') + '" href="javascript:void(0)" title="' + MESSAGES[67] + '"><i class="glyphicon glyphicon-stop"></i></a>'+
                         '<a class="action-nodewipe" data-path="' + id + '" data-name="' + checkTemplateValue(template_values['options'],'name') + '" href="javascript:void(0)" title="' + MESSAGES[68] + '"><i class="glyphicon glyphicon-erase"></i></a>'
        if ((ROLE == 'admin' || ROLE == 'editor') && LOCK == 0 ) {
            html_data += '<a class="action-nodeexport" data-path="' + id + '" data-name="' + checkTemplateValue(template_values['options'],'name') + '" href="javascript:void(0)" title="' + MESSAGES[69] + '"><i class="glyphicon glyphicon-save"></i></a> '+
                         //'<a class="action-nodeedit control'+ disabledClass +'" data-path="' + id + '" data-name="' + checkTemplateValue(template_values['options'],'name') + '" href="javascript:void(0)" title="' + MESSAGES[71] + '"><i class="glyphicon glyphicon-edit"></i></a>'+
                         '<a class="action-nodeedit control'+ '" data-path="' + id + '" data-name="' + checkTemplateValue(template_values['options'],'name') + '" href="javascript:void(0)" title="' + MESSAGES[246] +'/' +MESSAGES[71] + '"><i class="glyphicon glyphicon-edit"></i></a>'+
                         '<a class="action-nodedelete'+ disabledClass +'" data-path="' + id + '" data-name="' + checkTemplateValue(template_values['options'],'name') + '" href="javascript:void(0)" title="' + MESSAGES[65] + '"><i class="glyphicon glyphicon-trash"></i></a>';
        }
        html_data += '</div></td></tr>';
        defer.resolve({"html": html_data, "id": id});
    }).fail(function (message1, message2) {
        // Cannot get data
        if (message1 != null) {
            addModalError(message1);
        } else {
            addModalError(message2)
        }
        // return html_data;
        defer.resolve({"html": html_data, "id": id});
    });

    return defer;
}

// Display all nodes in a table
function printListNodes(nodes,configsets,systemstat) {
    logger(1, 'DEBUG: printing node list');
    logger(1, 'configset 1:' + JSON.stringify(configsets));
    var html_rows = [];
    var promises = [];
    window.configsets = configsets ;
    window.templates = [];
    window.icons = [];

    var composePromise = function (key, value) {
        var defer = $.Deferred();
        var cpu = (value['cpu'] != null) ? value['cpu'] : '';
        var cpulimit = (value['cpulimit'] != null) ? value['cpulimit'] : '';
        var ethernet = (value['ethernet'] != null) ? value['ethernet'] : '';
        var idlepc = (value['idlepc'] != null) ? value['idlepc'] : '';
        var image = (value['image'] != null) ? value['image'] : '';
        var nvram = (value['nvram'] != null) ? value['nvram'] : '';
        var serial = (value['serial'] != null) ? value['serial'] : '';

        //$.when(createNodeListRow(value['template'], value['id']), window.configsets).done(function (data) {
        $.when(createNodeListRow(value['template'], value), window.configsets).done(function (data) {
            html_rows.push(data);

            defer.resolve();
        });
        return defer;
    };
    total_cpu = 0
    total_run_cpu = 0
    total_ram = 0
    total_run_ram = 0
    total_run_hdd = 0
    $.each(nodes, function (key, value) {
        promises.push(composePromise(key, value));
	total_cpu += ( value['cpu'] != null) ? value['cpu'] : 0
	total_run_cpu += ( value['cpu'] != null && value['status'] == 2 ) ? value['cpu'] : 0
	total_ram += ( value['ram'] != null) ? value['ram'] : 0
	total_run_ram += ( value['ram'] != null && value['status'] == 2 ) ? value['ram'] : 0
	total_run_hdd += ( value['disk_usage'] !== null) ? parseFloat(value['disk_usage']) : 0
    })
	var body = '<div style="text-align: left;position: absolute; padding-left: 10px;">'
	body += 'Lab Assigned Resources (<font color="blue">Running</font>/ <font color="red">Total</font>) '
	body += 'vCPU  <font color="blue">'+total_run_cpu+'</font>/<font color="red">'+total_cpu+'</font> - '
	body += 'RAM <font color="blue">'+ Math.round( total_run_ram / 1024 *100) / 100 +'</font>/<font color="red">'+ Math.round( total_ram / 1024 *100) / 100 +' GB</font> - '
	body += 'HDD <font color="blue">'+  Math.round(total_run_hdd/10)/100  +' GB'
	body += '</div>'

	body += '<div style="position: relative;text-align: right;padding-right: 10px;">'
	body += 'Total Resources: '
	body += 'vCPU <font color="red">'+systemstat['vCPU']+'</font> - '
	body += 'RAM <font color="red">'+ Math.round(systemstat['memtotal'] / 1024 / 1024) +' GB</font>'
	//body += ' - HDD <font color="blue">'+Math.round(systemstat['disk']*parseFloat(systemstat['diskavailable']))+'</font>/<font color="red">' + Math.round(systemstat['diskavailable']) +' GB</font>'
	body += '</div>'
	



	body += '<div class="table-responsive"><form id="form-node-edit-table" ><table class="configured-nodes table"><thead><tr><th>' + MESSAGES[92] + '</th><th>' + MESSAGES[19] + '</th><th>' + MESSAGES[243] + '</th><th style="width: 20px;">' + MESSAGES[111] + '</th><th>' + MESSAGES[163] + '</th><th>' + MESSAGES[105] + '</th><th>' + MESSAGES[241] + '</th><th>' + MESSAGES[210] + '</th><th>' + MESSAGES[106] + '</th><th>'+ MESSAGES[107] + '</th><th>' + MESSAGES[108] + '</th><th>' + MESSAGES[242] + '</th><th>'+ MESSAGES[109] + '</th><th>' + MESSAGES[110] + '</th><th>' + MESSAGES[112] + '</th><th>' + MESSAGES[164] + '</th><th>' + MESSAGES[123] + '</th><th>' + MESSAGES[99] + '</th></tr></thead><tbody>';


    $.when.apply($, promises).done(function () {
        var html_data = html_rows.sort(function(a, b){
            return (a.id < b.id) ? -1 : (a.id > b.id) ? 1 : 0
        })
        $.each(html_data, function(key, value){
            body += value.html;
        });
        body += '</tbody></table></form></div>';
        $("#progress-loader").remove();
        addModalWide(MESSAGES[118], body, '');
        $('.selectpicker').selectpicker();
	$.each(nodes, function (key, value) {
		if ( value['template'] == 'iol' ) {
			value['cpu'] = '1';
		}
                cpu =  ( parseFloat(value['cpu_usage']) / parseInt ( value['cpu']) ) ;
		if ( cpu > 100 ) { cpu = 100 }
                if ( isNaN( cpu ) ) { cpu = 0 } ;
                $( "#progressbarcpu_"+value['id'] ).progressbar({
                        value: ( cpu == 0 ) ? '' : cpu
                })
                .children('.ui-progressbar-value')
                .html( "&nbsp;"+ parseFloat(cpu.toFixed(1)) + '%')
                .css("display", "block");

                if ( cpu == 0 ) {
                        $( "#progressbarcpu_"+value['id']+" > div ").css("background","transparent").css("width","0");
                } else {
                        $( "#progressbarcpu_"+value['id']+" > div ").css("background",percentageToHsl( cpu / 100 , 128, 0));
                }

                ram=parseFloat(value['ram_usage']) * 100 / ( parseInt ( value['ram']) * 1048576 );
		$( "#progressbarram_"+value['id'] ).progressbar({
                        value: ( ram == 0 ) ? '' : ram 
                })
                .children('.ui-progressbar-value')
                .html("&nbsp;" + parseFloat(ram.toFixed(1))+ '%')
                .css("display", "block");

		if ( ram == 0 ) {
			$( "#progressbarram_"+value['id']+" > div ").css("background","transparent").css("width","0");
		} else {
			$( "#progressbarram_"+value['id']+" > div ").css("background",percentageToHsl( ram / 100 , 128, 0));
		}
	});
	printLabStatus(LAB);
	clearInterval(UPDATEID);
	UPDATEID_QUICK = setInterval('printLabStatus("' + LAB + '")', 10000);
    })
}

// Display all text objects in a table
function printListTextobjects(textobjects) {
    logger(1, 'DEBUG: printing text objects list');
    var text
        , body = '<div class="table-responsive">' +
            '<table class="table">' +
            '<thead>' +
            '<tr>' +
            '<th>' + MESSAGES[92] + '</th>' +
            '<th>' + MESSAGES[19] + '</th>' +
            '<th>' + MESSAGES[95] + '</th>' +
            '<th style="width:69%">' + MESSAGES[146] + '</th>' +
            '<th style="width:9%">' + MESSAGES[99] + '</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>'
        ;

    $.each(textobjects, function (key, value) {
        var textClass = '',
            text = '';
        if (value['type'] == 'text') {
            text = $('#customText' + value['id'] + ' p').html();
            textClass ='customText'
        }

        body +=
            '<tr class="textObject' + value['id'] + '">' +
            '<td>' + value['id'] + '</td>' +
            '<td>' + value['name'] + '</td>' +
            '<td>' + value['type'] + '</td>' +
            '<td>' + text + '</td>' +
            '<td>';
        if (ROLE != "user" && LOCK == 0  ) {
             body += '<a class="action-textobjectdelete '+ textClass +'" data-path="' + value['id'] + '" data-name="' + value['name'] + '" href="javascript:void(0)" title="' + MESSAGES[65] + '">' +
                '<i class="glyphicon glyphicon-trash" style="margin-left:20px;"></i>' +
                '</a>'
        }
        body += '</td>' +
            '</tr>';
    });
    body += '</tbody></table></div>';
    addModalWide(MESSAGES[150], body, '');
}

// Print Authentication Page
function printPageAuthentication() {
    location.href = "/" ;
    //var html = new EJS({url: '/themes/default/ejs/login.ejs'}).render()
    //$('#body').html(html);
    //$("#form-login input:eq(0)").focus();
    //bodyAddClass('login');
}

// Print lab list page
function printPageLabList(folder) {
    var html = '';
    var url = '/api/folders' + folder;
    var type = 'GET';
    FOLDER = folder;
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            // Clear the message container
            $("#notification_container").empty()
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: folder "' + folder + '" found.');

                html = new EJS({url: '/themes/default/ejs/layout.ejs'}).render({
                    "MESSAGES": MESSAGES,
                    "folder": folder,
                    "username": USERNAME,
                    "role": ROLE
                })
                $("#alert_container").remove();

                // Adding to the page
                $('#body').html(html);

                // Adding all folders
                $.each(data['data']['folders'], function (id, object) {
                    $('#list-folders > ul').append('<li><a class="folder action-folderopen" data-path="' + object['path'] + '" href="javascript:void(0)" title="Double click to open, single click to select.">' + object['name'] + '</a></li>');
                });

                // Adding all labs
                $.each(data['data']['labs'], function (id, object) {
                    $('#list-labs > ul').append('<li><a class="lab action-labpreview" data-path="' + object['path'] + '" href="javascript:void(0)" title="Double click to open, single click to select.">' + object['file'] + '</a></li>');
                });



                // Read privileges and set specific actions/elements
                if (ROLE == 'admin' || ROLE == 'editor') {
                    // Adding actions
                    $('#actions-menu').empty();
                    $('#actions-menu').append('<li><a class="action-folderadd" href="javascript:void(0)"><i class="glyphicon glyphicon-folder-close"></i> ' + MESSAGES[4] + '</a></li>');
                    $('#actions-menu').append('<li><a class="action-labadd" href="javascript:void(0)"><i class="glyphicon glyphicon-file"></i> ' + MESSAGES[5] + '</a></li>');
                    $('#actions-menu').append('<li><a class="action-selectedclone" href="javascript:void(0)"><i class="glyphicon glyphicon-copy"></i> ' + MESSAGES[6] + '</a></li>');
                    $('#actions-menu').append('<li><a class="action-selectedexport" href="javascript:void(0)"><i class="glyphicon glyphicon-export"></i> ' + MESSAGES[8] + '</a></li>');
                    $('#actions-menu').append('<li><a class="action-import" href="javascript:void(0)"><i class="glyphicon glyphicon-import"></i> ' + MESSAGES[9] + '</a></li>');
                    $('#actions-menu').append('<li><a class="action-folderrename" href="javascript:void(0)"><i class="glyphicon glyphicon-pencil"></i> ' + MESSAGES[10] + '</a></li>');
                    $('#actions-menu').append('<li><a class="action-selecteddelete" href="javascript:void(0)"><i class="glyphicon glyphicon-trash"></i> ' + MESSAGES[7] + '</a></li>');

                    // Make labs draggable (to move inside folders)
                    $('.lab').draggable({
                        appendTo: '#body',
                        helper: 'clone',
                        revert: 'invalid',
                        scroll: false,
                        snap: '.folder',
                        stack: '.folder'
                    });

                    // Make folders draggable (to move inside folders)
                    $('.folder').draggable({
                        appendTo: '#body',
                        helper: 'clone',
                        revert: 'invalid',
                        scroll: false,
                        snap: '.folder',
                        stack: '.folder'
                    });

                    // Make folders draggable (to receive labs and folders)
                    $('.folder').droppable({
                        drop: function (e, o) {
                            var object = o['draggable'].attr('data-path');
                            var path = $(this).attr('data-path');
                            logger(1, 'DEBUG: moving "' + object + '" to "' + path + '".');
                            if (o['draggable'].hasClass('lab')) {
                                $.when(moveLab(object, path)).done(function (data) {
                                    logger(1, 'DEBUG: "' + object + '" moved to "' + path + '".');
                                    o['draggable'].fadeOut(300, function () {
                                        o['draggable'].remove();
                                    })
                                }).fail(function (data) {
                                    logger(1, 'DEBUG: failed to move "' + object + '" into "' + path + '".');
                                    addModal('ERROR', '<p>' + data + '</p>', '<button type="button" class="btn btn-flat" data-dismiss="modal">Close</button>');
                                });
                            } else if (o['draggable'].hasClass('folder')) {
                                $.when(moveFolder(object, path)).done(function (data) {
                                    logger(1, 'DEBUG: "' + object + '" moved to "' + path + '".');
                                    o['draggable'].fadeOut(300, function () {
                                        o['draggable'].remove();
                                    })
                                }).fail(function (data) {
                                    logger(1, 'DEBUG: failed to move "' + object + '" into "' + path + '".');
                                    addModal('ERROR', '<p>' + data + '</p>', '<button type="button" class="btn btn-flat" data-dismiss="modal">Close</button>');
                                });
                            } else {
                                // Should not be here
                                logger(1, 'DEBUG: cannot move unknown object.');
                            }

                        }
                    });
                } else {
                    $('#actions-menu').empty();
                    $('#actions-menu').append('<li><a href="javascript:void()">&lt;' + MESSAGES[3] + '&gt;</a></li>');
                }
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                addModal('ERROR', '<p>' + data['message'] + '</p>', '<button type="button" class="btn btn-flat" data-dismiss="modal">Close</button>');
            }

            bodyAddClass('folders');
            // Extend height to the bottom if shorter
            autoheight();

        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            addModal('ERROR', '<p>' + message + '</p>', '<button type="button" class="btn btn-flat" data-dismiss="modal">Close</button>');
        }
    });
}

// Print lab open page
function printPageLabOpen(lab) {
    if ( $.cookie("topo") == undefined ) $.cookie("topo", 'light');
    if ( $.cookie("labels") == undefined ) $.cookie("labels", 'on');
    var html = '<div id="hiddenbar" style="position:absolute;width:5px;top:0px;left:0px;height:100%;opacity:0;z-index:4003;"></div><div id="lab-sidebar"><ul></ul></div><div id="lab-viewport" data-path="' + lab + '"></div><div id="lab-chat" class="container"></div>';
    $('#body').html(html);
    //$('#lab-chat').resizable();
    //$('#lab-viewport').resizable();
    $('#lab-chat').append('<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title">Lab Chatroom</span></h3></div><div class="panel-body relative" style="overflow-x: auto;" id="chatroom"></div><div class="panel-footer"><div class="input-group margin-bottom-sm"><span class="input-group-addon"><i class="fa fa-cloud-upload fa-fw"></i></span><textarea class="form-control" type="textarea" style="width: 100%; resize: none;" rows="1" placeholder="Write a chatroom message" autocomplete="off" id="datasend" onkeypress="return chatCheckEnter(this, event);" disabled></textarea></div></div></div>');
    // Print topology
    $.when(printLabTopology(),getPictures()).done( function (rc,pic) {
//        $('body').append('<div id="alert_container"><b><span id="success" style="padding-right:20px; padding-left:20px;">Success</span><span id="fail" style="width:30px;">Error</span> </b><div class="inner"></div></div>');
//        $('#success').badge(0,'inline', true) ;
//        $('#fail').badge(0,'inline', true) ;
        $('#alert_container').css('right',( $('#body').width() - $('#lab-viewport').width() - 30) + 'px');
        if ( LABUSER != null ) {
             $('#lab-sidebar ul').append('<li><a title="' + LABUSER + '"><i class="glyphicon glyphicon-eye-open"></i></a></li>');
        }
        $('#lab-sidebar ul').append('<li class="action-labobjectadd-li"><a class="action-labobjectadd" href="javascript:void(0)" title="' + MESSAGES[56] + '"><i class="glyphicon glyphicon-plus"></i></a></li>');
        if ((ROLE == 'admin' || ROLE == 'editor') && LOCK == 0 ) {
            $('.action-labobjectadd-li').fadeTo(0,1)
        } else {
            $('.action-labobjectadd-li').fadeTo(0,1)
        }  
        $('#lab-sidebar ul').append('<li class="action-nodesget-li"><a class="action-nodesget" href="javascript:void(0)" title="' + MESSAGES[62] + '"><i class="glyphicon glyphicon-hdd"></i></a></li>');
        $('#lab-sidebar ul').append('<li><a class="action-networksget" href="javascript:void(0)" title="' + MESSAGES[61] + '"><i class="glyphicon glyphicon-transfer"></i></a></li>');
        $('#lab-sidebar ul').append('<li><a class="action-configsget" href="javascript:void(0)" title="' + MESSAGES[58] + '"><i class="glyphicon glyphicon-align-left"></i></a></li>');
        $('#lab-sidebar ul').append('<li class="action-picturesget-li"><a class="action-picturesget" href="javascript:void(0)" title="' + MESSAGES[59] + '"><i class="glyphicon glyphicon-picture"></i></a></li>');
        if ( Object.keys(pic)  < 1 ) {
            $('.action-picturesget-li').addClass('hidden');
        }

        $('#lab-sidebar ul').append('<li><a class="action-textobjectsget" href="javascript:void(0)" title="' + MESSAGES[150] + '"><i class="glyphicon glyphicon-text-background"></i></a></li>');
        $('#lab-sidebar ul').append('<li><a class="action-moreactions" href="javascript:void(0)" title="' + MESSAGES[125] + '"><i class="glyphicon glyphicon-th"></i></a></li>');
        $('#lab-sidebar ul').append('<li><a class="action-labtopologyrefresh" href="javascript:void(0)" title="' + MESSAGES[57] + '"><i class="glyphicon glyphicon-refresh"></i></a></li>');
        $('#lab-sidebar ul').append('<li class="plus-minus-slider"><i class="fas fa-minus"></i><div class="col-md-2 glyphicon glyphicon-zoom-in sidemenu-zoom"></div><div id="zoomslide" class="col-md-5"></div><div class="col-md-5"></div><i class="fas fa-plus"></i><br></li>');
        $('#zoomslide').slider({value:100,min:10,max:200,step:10,slide:zoomlab});
        $('#lab-sidebar ul').append('<li><a class="action-status" href="javascript:void(0)" title="' + MESSAGES[13] + '"><i class="glyphicon glyphicon-info-sign"></i></a></li>');
        $('#lab-sidebar ul').append('<li><a class="action-labbodyget" href="javascript:void(0)" title="' + MESSAGES[64] + '"><i class="glyphicon glyphicon-list-alt"></i></a></li>');
        $('#lab-sidebar ul').append('<li><a class="action-labtasksget" href="javascript:void(0)" title="' + MESSAGES[230] + '"><i class="glyphicon glyphicon-education"></i></a></li>');
        $('#lab-sidebar ul').append('<li><a class="action-chat" href="javascript:void(0)" title="' + MESSAGES[229] + '"><i class="glyphicon glyphicon-comment"></i></a></li>');
        if ( LOCK == 0 ) {
             $('#lab-sidebar ul').append('<li><a class="action-lock-lab" href="javascript:void(0)" title="' + MESSAGES[166] + '"><i class="fas fa-lock-open"></i></a></li>');
        } else {
             $('#lab-sidebar ul').append('<li><a class="action-unlock-lab" href="javascript:void(0)" title="' + MESSAGES[167] + '"><i style="color:red" class="fas fa-lock"></i></a></li>');
        }
         //$('#lab-sidebar ul').append('<li><a class="action-clock" href="javascript:void(0)" title="' + MESSAGES[217] + '"><i class="glyphicon glyphicon-hourglass"></i></a></li>');
         $('#lab-sidebar ul').append('<li><a class="action-fullscreen" href="javascript:void(0)" title="' + MESSAGES[225] + '"><i class="glyphicon glyphicon-fullscreen"></i></a></li>');
	 if ( $.cookie("labels") == 'off' ) { 
		$('#lab-sidebar ul').append('<li><a class="action-labelon" href="javascript:void(0)" title="' + MESSAGES[237] + '"><i class="fas fa-tag strike"></i></a></li>'); 
		$('.jtk.overlay').hide()
	 } else {
         	$('#lab-sidebar ul').append('<li><a class="action-labeloff" href="javascript:void(0)" title="' + MESSAGES[238] + '"><i class="fas fa-tag"></i></a></li>');
		$('.jtk.overlay').show()
	}
         if ( $.cookie("topo") == 'dark' ) {
                $('#lab-sidebar ul').append('<li><a class="action-lightmode" href="javascript:void(0)" title="' + MESSAGES[236] + '"><i class="fas fa-sun"></i></a></li>');
         } else {
                $('#lab-sidebar ul').append('<li><a class="action-nightmode" href="javascript:void(0)" title="' + MESSAGES[235] + '"><i class="fas fa-moon"></i></a></li>');
        }
	if ( STICKY != "1" ) {
        	$('#lab-sidebar ul').append('<div id="action-labclose"><li><a class="action-labclose" href="javascript:void(0)" title="' + MESSAGES[60] + '"><i class="glyphicon glyphicon-off"></i></a></li></div>');
	}
        $('#lab-sidebar ul').append('<li><a class="action-logout" href="javascript:void(0)" title="' + MESSAGES[14] + '"><i class="glyphicon glyphicon-log-out"></i></a></li>');
        $('#lab-sidebar ul a').each(function () {
             var t = $(this).attr("title");
             $(this).append(t);


             })
        if ( LOCK == 1 ) {
            lab_topology.setDraggable($('.node_frame, .network_frame, .customShape'), false);
            $('.customShape').not('.customText').resizable('disable');
        }
    })
}

// Print user management section
function printUserManagement() {
    $.when(getUsers(null)).done(function (data) {
        var html = '<div class="row"><div id="users" class="col-md-12 col-lg-12"><div class="table-responsive"><table class="table"><thead><tr><th>' + MESSAGES[44] + '</th><th>' + MESSAGES[19] + '</th><th>' + MESSAGES[28] + '</th><th>' + MESSAGES[29] + '</th><th>' + MESSAGES[30] + '</th><th>' + MESSAGES[31] + '</th><th>' + MESSAGES[32] + '</th></tr></thead><tbody></tbody></table></div></div></div>';
        html += '<div class="row"><div id="pods" class="col-md-12 col-lg-12"><div class="table-responsive"><table class="table"><thead><tr><th>' + MESSAGES[44] + '</th><th>' + MESSAGES[32] + '</th><th>' + MESSAGES[33] + '</th><th>' + MESSAGES[63] + '</th></tr></thead><tbody></tbody></table></div></div></div>';

        var html_title = '' +
            '<div class="row row-eq-height"><div id="list-title-folders" class="col-md-12 col-lg-12">' +
            '<span title="Users">Users</span>' +
            '</div>' +
            '</div>';
        $('#main-title').html(html_title);
        $('#main-title').show();
        $('#main').html(html);

        // Read privileges and set specific actions/elements
        if (ROLE == 'admin') {
            // Adding actions
            $('#actions-menu').empty();
            $('#actions-menu').append('<li><a class="action-useradd" href="javascript:void(0)"><i class="glyphicon glyphicon-plus"></i> ' + MESSAGES[34] + '</a></li>');
            $('#actions-menu').append('<li><a class="action-selecteddelete" href="javascript:void(0)"><i class="glyphicon glyphicon-trash"></i> ' + MESSAGES[35] + '</a></li>');
        } else {
            $('#actions-menu').empty();
            $('#actions-menu').append('<li><a href="javascript:void()">&lt;' + MESSAGES[3] + '&gt;</a></li>');
        }

        // Adding all users
        $.each(data, function (id, object) {
            var username = object['username'];
            var name = object['name'];
            var email = object['email'];
            var role = object['role'];
            if (object['lab'] == null) {
                var lab = 'none';
            } else {
                var lab = object['lab'];
            }
            if (object['pod'] == -1) {
                var pod = 'none';
            } else {
                var pod = object['pod'];
            }
            if (object['expiration'] <= 0) {
                var expiration = MESSAGES[54];
            } else {
                var d = new Date(object['expiration'] * 1000);
                expiration = d.toLocaleDateString();
            }
            if (object['session'] <= 0) {
                var session = MESSAGES[53];
            } else {
                var d = new Date(object['session'] * 1000);
                session = d.toLocaleDateString() + ' ' + d.toLocaleTimeString() + ' from ' + object['ip'];
            }
            if (object['pexpiration'] <= 0) {
                var pexpiration = MESSAGES[54];
            } else {
                var d = new Date(object['pexpiration'] * 1000);
                pexpiration = d.toLocaleDateString();
            }
            $('#users tbody').append('<tr class="action-useredit user" data-path="' + username + '"><td class="username">' + username + '</td><td class="class="name">' + name + '</td><td class="email">' + email + '</td><td class="role">' + role + '</td><td class="expiration">' + expiration + '</td><td class="session">' + session + '</td><td class="pod">' + pod + '</td></tr>');
            if (object['pod'] >= 0) {
                $('#pods tbody').append('<tr class="action-useredit user" data-path="' + username + '"><td class="username">' + username + '</td><td class="pod">' + pod + '</td><td class="pexpiration">' + pexpiration + '</td><td class="">' + lab + '</td></tr>');
            }

            bodyAddClass('users');
        });
    }).fail(function (message) {
        addModalError(message);
    });
}

// Print system status in modal
function drawStatusInModal(data, clusterdata) {
    window.uksm = false ;
    window.ksm = false ;
    window.cpulimit =false ;
    var $statusModalBody = $("#statusModal");

    if (!$statusModalBody.length) {
        return void 0;
    }
    sats = {}
    sats = Object.keys(clusterdata).map(function(key) {
	    return clusterdata[key];
	    });
    for ( i = 0 ; i < sats.length ; i++  ) {
	    sats[i].valueMem =  (  (sats[i].ram - sats[i].live_ram) /  sats[i].ram )
	    sats[i].MemTotal = Math.round( sats[i].ram  / 1024 / 1024 )
	    sats[i].valueSwap =  ( (  sats[i].swap - sats[i].live_swap )  /  sats[i].swap )
	    sats[i].SwapTotal = Math.round( sats[i].swap  / 1024 / 1024 )
	    sats[i].valueDisk =  ( sats[i].disk_usage /  sats[i].disk  )
	    sats[i].DiskTotal = Math.round( sats[i].disk / 1000000 )
    }
    if (  sats.length < 2 ) {
	    sats = {}
    }

    // Read privileges and set specific actions/elements
    $('#actions-menu', $statusModalBody).empty();
    $('#actions-menu', $statusModalBody).append('<li><a class="action-sysstatus" href="javascript:void(0)"><i class="glyphicon glyphicon-refresh"></i> ' + MESSAGES[40] + '</a></li>');
    $('#actions-menu', $statusModalBody).append('<li><a class="action-stopall" href="javascript:void(0)"><i class="glyphicon glyphicon-stop"></i> ' + MESSAGES[50] + '</a></li>');
    //$('#actions-menu', $statusModalBody).append('<li><a class="action-update" href="javascript:void(0)"><i class="glyphicon glyphicon-repeat"></i> ' + MESSAGES[132] + '</a></li>');

    // Adding all stats

    // Text
    $('#stats-text ul', $statusModalBody).empty();
    $('#stats-text ul', $statusModalBody).append('<li>' + MESSAGES[39] + ': <code>' + data['version'] + '</code></li>');
    //$('#stats-text ul', $statusModalBody).append('<li>' + MESSAGES[49] + ': <code>' + data['qemu_version'] + '</code></li>');
    $('#stats-text ul', $statusModalBody).append('<li class="uksm">' + MESSAGES[165] + ':&nbsp;&nbsp;<input type="checkbox" id="ToggleUKSM"></li>');
    $('#stats-text ul', $statusModalBody).append('<li class="ksm">' + MESSAGES[171] + ':&nbsp;&nbsp;<input type="checkbox" id="ToggleKSM"></li>');

    if ( data['uksm'] == "unsupported" ) $('.uksm').addClass('hidden')
    if ( data['ksm'] == "unsupported" ) $('.ksm').addClass('hidden')

    $('#ToggleUKSM').toggleSwitch({width: "50px"});
    if ( data['uksm'] == "enabled" ) { window.uksm = true ; $('#ToggleUKSM').toggleCheckedState(true) };

    $('#ToggleKSM').toggleSwitch({width: "50px"});
    if ( data['ksm'] == "enabled" ) { window.ksm = true ; $('#ToggleKSM').toggleCheckedState(true) };

    $('#stats-text ul', $statusModalBody).append('<li>' + MESSAGES[170] + ':&nbsp;&nbsp;<input type="checkbox" id="ToggleCPULIMIT"></li>');
    $('#ToggleCPULIMIT').toggleSwitch({width: "50px"});
    if ( data['cpulimit'] == "enabled" ) { window.cpulimit = true ;$('#ToggleCPULIMIT').toggleCheckedState(true) };
    $('#stats-text ul', $statusModalBody).append('<li>' + MESSAGES[29] + ': <code>' + ROLE + '</code></li>');
    $('#stats-text ul', $statusModalBody).append('<li>' + MESSAGES[32] + ': <code>' + ((TENANT == -1) ? 'none' : TENANT) + '</code></li>');

    // use graphs
    $('#stats-graph ul', $statusModalBody).empty();

    // CPU usage
    $('#stats-graph ul', $statusModalBody).append('<li><div class="circle circle-cpu col-md-3 col-lg-3"><strong></strong><br/><span>' + MESSAGES[36] + '</span></div></li>');
    $('.circle-cpu').circleProgress({
        arcCoef: 0.7,
        value: data['cpu'],
        thickness: 10,
        startAngle: -Math.PI / 2,
        fill:  { color: percentageToHsl( data['cpu']  , 128, 0)}
    }).on('circle-animation-progress', function (event, progress) {
        if (progress > data['cpu']) {
            $(this).find('strong').html(parseInt(100 * data['cpu']) + '%');
        } else {
            $(this).find('strong').html(parseInt(100 * progress) + '%');
        }
    });

    // Memory usage
    $('#stats-graph ul', $statusModalBody).append('<li><div class="circle circle-memory col-md-3 col-lg-3"><strong></strong><br/><span>' + MESSAGES[37] + '</span></div></li>');
    $('.circle-memory').circleProgress({
        arcCoef: 0.7,
        value: data['mem'],
        thickness: 10,
        startAngle: -Math.PI / 2,
        fill: { color: percentageToHsl( data['mem']  , 128, 0)}
    }).on('circle-animation-progress', function (event, progress) {
        if (progress > data['mem']) {
            $(this).find('strong').html(parseInt(100 * data['mem']) + '%');
        } else {
            $(this).find('strong').html(parseInt(100 * progress) + '%');
        }
    });

    // Swap usage
    $('#stats-graph ul', $statusModalBody).append('<li><div class="circle circle-swap col-md-3 col-lg-3"><strong></strong><br/><span>Swap usage</span></div></li>');
    $('.circle-swap').circleProgress({
        arcCoef: 0.7,
        value: data['swap'],
        thickness: 10,
        startAngle: -Math.PI / 2,
        fill: { color: percentageToHsl( data['swap']  , 128, 0)}
    }).on('circle-animation-progress', function (event, progress) {
        if (progress > data['swap']) {
            $(this).find('strong').html(parseInt(100 * data['swap']) + '%');
        } else {
            $(this).find('strong').html(parseInt(100 * progress) + '%');
        }
    });

    // Disk usage
    $('#stats-graph ul', $statusModalBody).append('<li><div class="circle circle-disk col-md-3 col-lg-3"><strong></strong><br/><span>' + MESSAGES[38] + '</span></div></li>');
    $('.circle-disk').circleProgress({
        arcCoef: 0.7,
        value: data['disk'],
        thickness: 10,
        startAngle: -Math.PI / 2,
        fill: { color: percentageToHsl( data['disk']  , 128, 0)}
    }).on('circle-animation-progress', function (event, progress) {
        if (progress > data['disk']) {
            $(this).find('strong').html(parseInt(100 * data['disk']) + '%');
        } else {
            $(this).find('strong').html(parseInt(100 * progress) + '%');
        }
    });
    // Details
    $('#stats-graph ul', $statusModalBody).append('<li><div class="cpu-detail col-md-3 col-lg-3" style="display: grid;grid-template-columns: 1fr 1fr;text-align: center;" ></div></li>');
	for ( i=0 ; i < sats.length ; i++ ) {
		$('.cpu-detail').append('<div class="status-cpusat'+ i +'" style="height: 130px;"><div style="line-height:1">' + sats[i].name +'</br>('+ sats[i].cpu+' vCPU)</div><div class="circle circle-cpusat'+i+'"></div><div style="left: 1px;line-height:40px;position: relative;top: -62px;">' + sats[i].live_cpu +'%</div></div>');
		$('.circle-cpusat'+i).circleProgress({
		 	 size: 50,
			 arcCoef: 0.7,
			 value: ( sats[i].live_cpu / 100),
			 thickness: 5,
			 startAngle: -Math.PI / 2,
			 fill: { color: percentageToHsl( sats[i].live_cpu/100  , 128, 0)}
		});
	}
    $('#stats-graph ul', $statusModalBody).append('<li><div class="mem-detail col-md-3 col-lg-3" style="display: grid;grid-template-columns: 1fr 1fr;text-align: center;"></div></li>');
	for ( i=0 ; i < sats.length ; i++ ) {
		$('.mem-detail').append('<div class="status-memsat'+ i +'" style="height: 130px;"><div style="line-height:1">' + sats[i].name +'<br>('+sats[i].MemTotal +' GB)</div><div class="circle circle-memsat'+i+'"></div><div style="left: 1px;line-height:40px;position: relative;top: -62px;">' + Math.round(sats[i].valueMem*100) +'%</div></div>');
		console.log( sats[i].valueMem)
                $('.circle-memsat'+i).circleProgress({
                         arcCoef: 0.7,
			 size: 50,
                         value: sats[i].valueMem,
                         thickness: 5,
                         startAngle: -Math.PI / 2,
                         fill: { color: percentageToHsl( sats[i].valueMem , 128, 0)}
                });
        }
    $('#stats-graph ul', $statusModalBody).append('<li><div class="swap-detail col-md-3 col-lg-3" style="display: grid;grid-template-columns: 1fr 1fr;text-align: center;"></div></li>');
	for ( i=0 ; i < sats.length ; i++ ) {
		$('.swap-detail').append('<div class="status-swapsat'+ i +'" style="height: 130px;"><div style="line-height:1">' + sats[i].name +'<br>('+sats[i].SwapTotal+' GB)</div><div class="circle circle-swapsat'+i+'"></div><div style="left: 1px;line-height:40px;position: relative;top: -62px;">' + Math.round(sats[i].valueSwap*100) +'%</div></div>');
                $('.circle-swapsat'+i).circleProgress({
                         arcCoef: 0.7,
			 size: 50,
                         value: sats[i].valueSwap,
                         thickness: 5,
                         startAngle: -Math.PI / 2,
                         fill: { color: percentageToHsl( sats[i].valueSwap  , 128, 0)}
                });
        }
    $('#stats-graph ul', $statusModalBody).append('<li><div class="disk-detail col-md-3 col-lg-3" style="display: grid;grid-template-columns: 1fr 1fr;text-align: center;"></div></li>');
	for ( i=0 ; i < sats.length ; i++ ) {
		$('.disk-detail').append('<div class="status-disksat'+ i +'" style="height: 130px;"><div style="line-height:1">' + sats[i].name +'<br>('+sats[i].DiskTotal+' GB)</div><div class="circle circle-disksat'+i+'"></div><div style="left: 1px;line-height:40px;position: relative;top: -62px;">' + Math.round(sats[i].valueDisk*100) +'%</div></div>');
                $('.circle-disksat'+i).circleProgress({
                         arcCoef: 0.7,
			 size: 50,
                         value: sats[i].valueDisk,
                         thickness: 5,
                         startAngle: -Math.PI / 2,
                         fill: { color: percentageToHsl( sats[i].valueDisk , 128, 0)}
                });
        }
    // One div empty to center
     $('#stats-graph ul', $statusModalBody).append('<li><div class="col-md-1 col-lg-1"></div>');
    // IOL running nodes
    $('#stats-graph ul', $statusModalBody).append('<li><div class="count count-iol col-md-2 col-lg-2"></div>');
    $('.count-iol', $statusModalBody).html('<strong>' + data['iol'] + '</strong><br/><span>' + MESSAGES[41] + '</span></li>');

    // Dynamips running nodes
    $('#stats-graph ul', $statusModalBody).append('<li><div class="count count-dynamips col-md-2 col-lg-2"></div></li>');
    $('.count-dynamips', $statusModalBody).html('<strong>' + data['dynamips'] + '</strong><br/><span>' + MESSAGES[42] + '</span>');

    // QEMU running nodes
    $('#stats-graph ul', $statusModalBody).append('<li><div class="count count-qemu col-md-2 col-lg-2"></div></li>');
    $('.count-qemu', $statusModalBody).html('<strong>' + data['qemu'] + '</strong><br/><span>' + MESSAGES[43] + '</span>');

    // Docker running nodes
    $('#stats-graph ul', $statusModalBody).append('<li><div class="count count-docker col-md-2 col-lg-2"></div></li>');
    $('.count-docker', $statusModalBody).html('<strong>' + data['docker'] + '</strong><br/><span>' + MESSAGES[161] + '</span>');

    // VPCS running nodes
    $('#stats-graph ul', $statusModalBody).append('<li><div class="count count-vpcs col-md-2 col-lg-2"></div></li>');
    $('.count-vpcs', $statusModalBody).html('<strong>' + data['vpcs'] + '</strong><br/><span>' + MESSAGES[162] + '</span>');
}

// Update system status in modal
function updateStatusInModal(intervalId, data, clusterdata) {
    if (!intervalId) {
        return null;
    }

    if (!$("#statusModal").length) {
        return clearInterval(intervalId);
    }

    drawStatusInModal(data, clusterdata);
    
}

// Update system status
function updateStatus(intervalId, data) {
    if (!intervalId) {
        return null;
    }

    if (!$("#systemStats").length) {
        return clearInterval(intervalId);
    }

    printSystemStats(data);
}

// Print system status
function printSystemStats(data) {
    var $statusBody = $("#systemStats");

    if (!$statusBody.length) {
        return void 0;
    }
    // Read privileges and set specific actions/elements
    $('#actions-menu').empty();
    $('#actions-menu').append('<li><a class="action-sysstatus" href="javascript:void(0)"><i class="glyphicon glyphicon-refresh"></i> ' + MESSAGES[40] + '</a></li>');
    $('#actions-menu').append('<li><a class="action-stopall" href="javascript:void(0)"><i class="glyphicon glyphicon-stop"></i> ' + MESSAGES[50] + '</a></li>');
    //$('#actions-menu').append('<li><a class="action-update" href="javascript:void(0)"><i class="glyphicon glyphicon-repeat"></i> ' + MESSAGES[132] + '</a></li>');

    // Adding all stats

    // Text
    $('#stats-text ul').empty();
    $('#stats-text ul').append('<li>' + MESSAGES[39] + ': <code>' + data['version'] + '</code></li>');
    $('#stats-text ul').append('<li>' + MESSAGES[49] + ': <code>' + data['qemu_version'] + '</code></li>');
    $('#stats-text ul').append('<li>' + MESSAGES[29] + ': <code>' + ROLE + '</code></li>');
    $('#stats-text ul').append('<li>' + MESSAGES[32] + ': <code>' + ((TENANT == -1) ? 'none' : TENANT) + '</code></li>');

    $('#stats-graph ul').empty();

    // CPU usage
    $('#stats-graph ul').append('<li><div class="circle circle-cpu col-md-3 col-lg-3"><strong></strong><br/><span>' + MESSAGES[36] + '</span></div></li>');
    $('.circle-cpu').circleProgress({
        arcCoef: 0.7,
        value: data['cpu'],
        thickness: 10,
        startAngle: -Math.PI / 2,
        fill: {gradient: ['#46a6b6']}
    }).on('circle-animation-progress', function (event, progress) {
        if (progress > data['cpu']) {
            $(this).find('strong').html(parseInt(100 * data['cpu']) + '%');
        } else {
            $(this).find('strong').html(parseInt(100 * progress) + '%');
        }
    });

    // Memory usage
    $('#stats-graph ul').append('<li><div class="circle circle-memory col-md-3 col-lg-3"><strong></strong><br/><span>' + MESSAGES[37] + '</span></div></li>');
    $('.circle-memory').circleProgress({
        arcCoef: 0.7,
        value: data['mem'],
        thickness: 10,
        startAngle: -Math.PI / 2,
        fill: {gradient: ['#46a6b6']}
    }).on('circle-animation-progress', function (event, progress) {
        if (progress > data['mem']) {
            $(this).find('strong').html(parseInt(100 * data['mem']) + '%');
        } else {
            $(this).find('strong').html(parseInt(100 * progress) + '%');
        }
    });

    // Swap usage
    $('#stats-graph ul').append('<li><div class="circle circle-swap col-md-3 col-lg-3"><strong></strong><br/><span>Swap usage</span></div></li>');
    $('.circle-swap').circleProgress({
        arcCoef: 0.7,
        value: data['swap'],
        thickness: 10,
        startAngle: -Math.PI / 2,
        fill: {gradient: ['#46a6b6']}
    }).on('circle-animation-progress', function (event, progress) {
        if (progress > data['swap']) {
            $(this).find('strong').html(parseInt(100 * data['swap']) + '%');
        } else {
            $(this).find('strong').html(parseInt(100 * progress) + '%');
        }
    });

    // Disk usage
    $('#stats-graph ul').append('<li><div class="circle circle-disk col-md-3 col-lg-3"><strong></strong><br/><span>' + MESSAGES[38] + '</span></div></li>');
    $('.circle-disk').circleProgress({
        arcCoef: 0.7,
        value: data['disk'],
        thickness: 10,
        startAngle: -Math.PI / 2,
        fill: {gradient: ['#46a6b6']}
    }).on('circle-animation-progress', function (event, progress) {
        if (progress > data['disk']) {
            $(this).find('strong').html(parseInt(100 * data['disk']) + '%');
        } else {
            $(this).find('strong').html(parseInt(100 * progress) + '%');
        }
    });

    // IOL running nodes
    $('#stats-graph ul').append('<li><div class="count count-iol col-md-4 col-lg-4"></div>');
    $('.count-iol').html('<strong>' + data['iol'] + '</strong><br/><span>' + MESSAGES[41] + '</span></li>');

    // Dynamips running nodes
    $('#stats-graph ul').append('<li><div class="count count-dynamips col-md-4 col-lg-4"></div></li>');
    $('.count-dynamips').html('<strong>' + data['dynamips'] + '</strong><br/><span>' + MESSAGES[42] + '</span>');

    // QEMU running nodes
    $('#stats-graph ul').append('<li><div class="count count-qemu col-md-4 col-lg-4"></div></li>');
    $('.count-qemu').html('<strong>' + data['qemu'] + '</strong><br/><span>' + MESSAGES[43] + '</span>');

    // Docker running nodes
    $('#stats-graph ul').append('<li><div class="count count-docker col-md-4 col-lg-6"></div></li>');
    $('.count-docker').html('<strong>' + data['docker'] + '</strong><br/><span>' + MESSAGES[161] + '</span>');

    // VPCS running nodes
    $('#stats-graph ul').append('<li><div class="count count-vpcs col-md-4 col-lg-6"></div></li>');
    $('.count-vpcs').html('<strong>' + data['vpcs'] + '</strong><br/><span>' + MESSAGES[162] + '</span>');

}

/*******************************************************************************
 * Custom Shape Functions
 * *****************************************************************************/
// Get All Text Objects
function getTextObjects() {
    var deferred = $.Deferred();
    var lab_filename = $('#lab-viewport').attr('data-path');
    var url = '/api/labs' + lab_filename + '/textobjects';
    var type = 'GET';
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: got shape(s) from lab "' + lab_filename + '".');
                deferred.resolve(data['data']);
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Get Text Object By Id
function getTextObject(id) {
    var deferred = $.Deferred();
    var lab_filename = $('#lab-viewport').attr('data-path');
    var url = '/api/labs' + lab_filename + '/textobjects/' + id;
    var type = 'GET';
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: got shape ' + id + 'from lab "' + lab_filename + '".');

                try {
                    if ( data['data'].data.indexOf('div') != -1  ) {
                                   // nothing to do ?
                    } else {
                                   data['data'].data =  new TextDecoderLite('utf-8').decode(toByteArray(data['data'].data));
                    }
                }
                catch (e) {
                    console.warn("Compatibility issue", e);
                }

                deferred.resolve(data['data']);
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Create New Text Object
function createTextObject(newData) {
    var deferred = $.Deferred()
        , lab_filename = $('#lab-viewport').attr('data-path')
        , url = '/api/labs' + lab_filename + '/textobjects'
        , type = 'POST';

    if (newData.data) {
        newData.data = fromByteArray(new TextEncoderLite('utf-8').encode(newData.data));
    }

    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        data: JSON.stringify(newData),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: create shape ' + 'for lab "' + lab_filename + '".');
                deferred.resolve(data['result']);
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });

    return deferred.promise();
}

// add Text
function addTextObject( tleft , ttop ) {
    var  text_html = ""
        , coordinates
        , z_index = 1001
        , customShape_id = new Date().getTime()
        , form_data = {}
        ;
    coordinates = 'position:absolute;left:' + resolveZoom(tleft, 'left') + 'px;top:' + resolveZoom(ttop, 'top') + 'px;';
    text_html =
        '<div id="customText' + customShape_id + '" class="customShape customText context-menu" data-path="" style="' + coordinates + ';z-index:' + z_index + ';">' +
        '<p>New Text' +
        '</p>' +
        '</div>';
    //form_data['data'] = text_html;
    form_data['data'] = text_html;
    form_data['name'] = "txt " + ($(".customShape").length + 1);
    form_data['type'] = "text";

    createTextObject(form_data).done(function (data) {
        $('#lab-viewport').prepend(text_html);

        var $added_shape = $("#customText" + customShape_id);
        getTextObjects().done(function (textObjects) {
            var id = data.id;
            $added_shape.attr("id", "customText" + id);
            $added_shape.attr("data-path", id);

            if ($("#customText" + id).length > 1) {
                addMessage('warning', MESSAGES[156]);
            }
            // Hide and delete the modal (or will be posted twice)
                lab_topology.setDraggable($('.node_frame, .network_frame, .customShape'), true);
                lab_topology.draggable($('.node_frame, .network_frame, .customShape'), {
                        grid: [3, 3],
                });
            $('#body').children('.modal').modal('hide');
            $("#customText" + id).dblclick();
        }).fail(function (message) {
            addMessage('DANGER', getJsonMessage(message));
        });
    }).done(function () {
        addMessage('SUCCESS', 'Lab has been saved (60023).');
    }).fail(function (message) {
        addMessage('DANGER', getJsonMessage(message));
    });

    return false;
};

// add Task

// function api to create task
// create div ( like html console ) and enter in edit mode
function addLabTask(name) {
    var form_data = {};
    form_data['name'] = name;
    form_data['type'] = 'public';
    form_data['data'] = fromByteArray(new TextEncoderLite('utf-8').encode('<div class="task-body"><p>New Text</p></div>'));
    var lab_filename = $('#lab-viewport').attr('data-path');
    var type = 'POST';
    var deferred = $.Deferred();
    var url = '/api/labs' + lab_filename + '/task';
    $.ajax({
        cache: false,
                timeout: TIMEOUT,
                type: type,
                url: encodeURI(url),
                data: JSON.stringify(form_data),
                dataType: 'json',
                success: function (data) {
                    if (data['status'] == 'success') {
                        logger(1, 'DEBUG: create lab task ' + form_data['name'] + 'for lab "' + lab_filename + '".');
            logger(1,JSON.stringify(data));
                        deferred.resolve(data['result']);
                        //$("#mySelect").append('<option value=1>My option</option>');
                        //$('#configsetselect').append('<option value=' + data['id']+ '>'+ newData + '</option>');
                    } else {
                        // Application error
                        logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                        deferred.reject(data['message']);
                    }
                },
                error: function (data) {
                    // Server error
                    var message = getJsonMessage(data['responseText']);
                    logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
                    logger(1, 'DEBUG: ' + message);
                    deferred.reject(message);
                }
            });

    return deferred.promise();
}

// Edit task
function editLabTask(id,newdata,task_name) {
    var form_data = {};
    form_data['type'] = 'public';
    form_data['name'] = task_name ;
    if ( newdata != null ) form_data['data'] = fromByteArray(new TextEncoderLite('utf-8').encode(newdata));
    var lab_filename = $('#lab-viewport').attr('data-path');
    var type = 'PUT';
    var deferred = $.Deferred();
    var url = '/api/labs' + lab_filename + '/task/' + id;
            $.ajax({
                cache: false,
                timeout: TIMEOUT,
                type: type,
                url: encodeURI(url),
                data: JSON.stringify(form_data),
                dataType: 'json',
                success: function (data) {
                    if (data['status'] == 'success') {
                        logger(1, 'DEBUG: save lab task ' + task_name + 'for lab "' + lab_filename + '".');
                        logger(1,JSON.stringify(data));
                        deferred.resolve(data['result']);
                        //$("#mySelect").append('<option value=1>My option</option>');
                        //$('#configsetselect').append('<option value=' + data['id']+ '>'+ newData + '</option>');
                    } else {
                        // Application error
                        logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                        deferred.reject(data['message']);
                    }
                },
                error: function (data) {
                    // Server error
                    var message = getJsonMessage(data['responseText']);
                    logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
                    logger(1, 'DEBUG: ' + message);
                    deferred.reject(message);
                }
            });

    return deferred.promise();
}

function addConfigset(newData) {
    var form_data = {};
    form_data['name'] = newData;
    var lab_filename = $('#lab-viewport').attr('data-path');
    var type = 'POST';
    var deferred = $.Deferred();
    var url = '/api/labs' + lab_filename + '/configsets';
    $.ajax({
            cache: false,
        timeout: TIMEOUT,
            type: type,
            url: encodeURI(url),
            data: JSON.stringify(form_data),
        dataType: 'json',
        success: function (data) {
                if (data['status'] == 'success') {
                    logger(1, 'DEBUG: create configset ' + form_data['name'] + 'for lab "' + lab_filename + '".');
                    deferred.resolve(data);
            //$("#mySelect").append('<option value=1>My option</option>');
            $('#configsetselect').append('<option value=' + data['id']+ '>'+ newData + '</option>');
                } else {
                    // Application error
                    logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                    deferred.reject(data['message']);
                }
            },
            error: function (data) {
                // Server error
                var message = getJsonMessage(data['responseText']);
                logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
                logger(1, 'DEBUG: ' + message);
                deferred.reject(message);
            }
        });

    return deferred.promise();
}

function editConfigset(id,name) {
    logger(1, 'DEBUG: enter in function editConfigset');
        var form_data = {};
        form_data['name'] = name;
        var lab_filename = $('#lab-viewport').attr('data-path');
        var type = 'PUT';
        var deferred = $.Deferred();
        var url = '/api/labs' + lab_filename + '/configsets/' + id;
        $.ajax({
                cache: false,
                timeout: TIMEOUT,
                type: type,
                url: encodeURI(url),
                data: JSON.stringify(form_data),
                dataType: 'json',
                success: function (data) {
                    if (data['status'] == 'success') {
                        logger(1, 'DEBUG: create configset ' + form_data['name'] + 'for lab "' + lab_filename + '".');
                        deferred.resolve(data['result']);
                        //$("#mySelect").append('<option value=1>My option</option>');
                        //$('#configsetselect').append('<option value=' + data['id']+ '>'+ newData + '</option>');
            $('#configsetselect option:selected').text(name) ;
                    } else {
                        // Application error
                        logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                        deferred.reject(data['message']);
                    }
                },
                error: function (data) {
                    // Server error
                    var message = getJsonMessage(data['responseText']);
                    logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
                    logger(1, 'DEBUG: ' + message);
                    deferred.reject(message);
                }
            });

    return deferred.promise();
}

function delConfigset(newData) {
        var form_data = {};
        form_data['id'] = newData;
        var lab_filename = $('#lab-viewport').attr('data-path');
        var type = 'DELETE';
        var deferred = $.Deferred();
        var url = '/api/labs' + lab_filename + '/configsets/' + newData;
        $.ajax({
                cache: false,
                timeout: TIMEOUT,
                type: type,
                url: encodeURI(url),
                data: JSON.stringify(form_data),
                dataType: 'json',
                success: function (data) {
                    if (data['status'] == 'success') {
                        logger(1, 'DEBUG: create configset ' + form_data['name'] + 'for lab "' + lab_filename + '".');
                        deferred.resolve(data['result']);
                    } else {
                        // Application error
                        logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                        deferred.reject(data['message']);
                    }
        $('#configsetselect option[value="'+newData+'"]').remove();
                },
                error: function (data) {
                    // Server error
                    var message = getJsonMessage(data['responseText']);
                    logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
                    logger(1, 'DEBUG: ' + message);
                    deferred.reject(message);
                }
            });

    return deferred.promise();
}

// Update Text Object
function editTextObject(id, newData) {
    var lab_filename = $('#lab-viewport').attr('data-path');
    var deferred = $.Deferred();
    var type = 'PUT';
    var url = '/api/labs' + lab_filename + '/textobjects/' + id;

    if (newData.data) {
        newData.data = fromByteArray(new TextEncoderLite('utf-8').encode(newData.data));
    }

    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: JSON.stringify(newData), // newData is object with differences between old and new data
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: custom shape text object updated.');
                deferred.resolve(data['message']);
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Update Multiple Text Object
function editTextObjects(newData) {
    var lab_filename = $('#lab-viewport').attr('data-path');
    var deferred = $.Deferred();
    if (newData.length == 0 ) { deferred.resolve(); return deferred.promise(); }
    var type = 'PUT';
    var url = '/api/labs' + lab_filename + '/textobjects';

    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: JSON.stringify(newData), // newData is object with differences between old and new data
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: custom shape text object updated.');
                deferred.resolve(data['message']);
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}


// Delete Text Object By Id
function deleteTextObject(id) {
    var deferred = $.Deferred();
    var type = 'DELETE';
    var lab_filename = $('#lab-viewport').attr('data-path');
    var url = '/api/labs' + lab_filename + '/textobjects/' + id;
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: shape/text deleted.');
                deferred.resolve();
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Delete Lab Task By Id
function deleteTask(id) {
    var deferred = $.Deferred();
    var type = 'DELETE';
    var lab_filename = $('#lab-viewport').attr('data-path');
    var url = '/api/labs' + lab_filename + '/task/' + id;
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: task deleted.');
                deferred.resolve();
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}



// Text Object Drag Stop / Resize Stop
function textObjectDragStop(event, ui) {
    var id
        , objectData
        , shape_border_width
        ;
    if (event.target.id.indexOf("customShape") != -1) {
        id = event.target.id.slice("customShape".length);
        shape_border_width = $("#customShape" + id + " svg").children().attr('stroke-width');
    }
    else if (event.target.id.indexOf("customText") != -1) {
        id = event.target.id.slice("customText".length);
        shape_border_width = 5;
    }

    objectData = event.target.outerHTML;


    editTextObject(id, {
        data: objectData
    });
}

function setShapePosition( shape )  {
    var id
        , objectData
        , shape_border_width
        ;
    if (shape.id.indexOf("customShape") != -1) {
        id = shape.id.slice("customShape".length);
        shape_border_width = $("#customShape" + id + " svg").children().attr('stroke-width');
    }
    else if (shape.id.indexOf("customText") != -1) {
        id = shape.id.slice("customText".length);
        shape_border_width = 5;
    }

    //objectData = shape.outerHTML;
    objectData = shape.outerHTML;
    editTextObject(id, {
        data: objectData
    });
}

// Text Object Resize Event
function textObjectResize(event, ui, shape_options) {
    var zoomvalue=$('#zoomslide').slider("value")/100
    var newWidth = ui.originalSize.width + (ui.size.width  - ui.originalSize.width) / zoomvalue
        , newHeight = ui.originalSize.height + ( ui.size.height - ui.originalSize.height ) / zoomvalue
        ;

    $("svg", ui.element).attr({
        width: newWidth,
        height: newHeight
    });
    $("svg > rect", ui.element).attr({
        width: newWidth-(shape_options['shape_border_width']*2),
        height: newHeight-(shape_options['shape_border_width']*2),
    x: shape_options['shape_border_width'],
    y: shape_options['shape_border_width']
    });
    $("svg > ellipse", ui.element).attr({
        rx: newWidth / 2 - shape_options['shape_border_width'] / 2,
        ry: newHeight / 2 - shape_options['shape_border_width'] / 2,
        cx: newWidth / 2,
        cy: newHeight / 2
    });
    var n = $("br", ui.element).length;
    if (n) {
        $("p", ui.element).css({
            "font-size": newHeight / (n * 1.5 + 1)
        });
    } else {
        $("p", ui.element).css({
            "font-size": newHeight / 2
        });
    }
    if ($("p", ui.element).length && $(ui.element).width() > newWidth) {
        ui.size.width = $(ui.element).width();
    }
}

function printFormConnStyle(id) {
    //alert(JSON.stringify( id ));
    getTopology().done(function(res) {
        var style = ['Solid', 'Dashed']
        , firstLinkValues = {}
        , colorDigits
        , linkstyle = ['Straight', 'Bezier', 'Flowchart', 'StateMachine']
	, stub
	, curviness
	, cornerRadius
	, midpoint
        , label
        tmpconn = lab_topology.getConnections().find( function(item) { return  item.id == id} )
        topolink =  res.filter( function (item) { return  item.source == tmpconn.source && item.source_label == tmpconn.source_label }  )[0]
	//console.log ( '%o', topolink );
        src_label = ( tmpconn.getOverlay("src") != undefined ) ? tmpconn.getOverlay("src").label : 'n/a';
        src_pos = ( tmpconn.getOverlay("src") != undefined ) ? tmpconn.getOverlay("src").loc : 0 ;
        dst_label = ( tmpconn.getOverlay("dst") != undefined ) ? tmpconn.getOverlay("dst").label : 'n/a';
        dst_pos = ( tmpconn.getOverlay("dst") != undefined ) ? tmpconn.getOverlay("dst").loc : 0;
        //alert( JSON.stringify(topolink['style']) )
        //alert( topolink['style'] )
        var html = new EJS({
            url: '/themes/default/ejs/form_network_style.ejs'
        }).render({
            MESSAGES: MESSAGES,
            id: id,
            node: topolink['source'].replace('node',''),
            interface_id: topolink['source_interfaceId'],
            type: topolink['type'],
	    src_label_node: src_label,
	    dst_label_node: dst_label
        })
        $('#body').append(html);
	//$(".form-slide.network-style-midpoint").slider();
	//console.log(topolink['linkstyle']);
	//console.log('%o',tmpconn);
	switch ( topolink['linkstyle'] ) {
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
			$(".form-group.network-style-curviness").hide();
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
		default:
			$(".form-group.network-style-stub").show();
                        $(".form-group.network-style-curviness").hide();
                        $(".form-group.network-style-bezier-curviness").hide()
                        $(".form-group.network-style-midpoint").hide();
                        $(".form-group.network-style-round").hide();
                        break;
	}
        firstLinkValues['style'] = topolink['style'];
        firstLinkValues['linkstyle'] = topolink['linkstyle'];
            if(isIE){
                $('input[type="color"]').hide()
                $('input.link_color').colorpicker({
                    color: "#000000",
                    defaultPalette: 'web'
                })
            }
        for (var i = 0; i < style.length; i++) {
            $('.edit-network-style-form .network-style-select').append($('<option></option>').val(style[i]).html(style[i]));
            if ( firstLinkValues['style'] == style[i] ) $('.edit-network-style-form .network-style-select').val(style[i]) ;
        }
            for (var i = 0; i < linkstyle.length; i++) {
                    $('.edit-network-style-form .network-linkstyle-select').append($('<option></option>').val(linkstyle[i]).html(linkstyle[i]));
            if ( firstLinkValues['linkstyle'] == linkstyle[i] ) $('.edit-network-style-form .network-linkstyle-select').val(linkstyle[i]) ;
            }
            firstLinkValues['color'] = $('.'+id.replace(/:/g,'\\:')).children().attr('stroke');
	    firstLinkValues['width'] = $('.'+id.replace(/:/g,'\\:')).children().attr('stroke-width');
            firstLinkValues['label'] =  topolink['label'];
            firstLinkValues['labelpos'] =  parseFloat(topolink['labelpos']);
	    firstLinkValues['pos-src'] =  src_pos;
	    firstLinkValues['pos-dst'] =  dst_pos;
	    console.log(firstLinkValues['stub']) ;
	    firstLinkValues['stub'] =  ( topolink['stub'] != undefined ) ? topolink['stub'] : 0 ;
	    firstLinkValues['beziercurviness'] =  ( topolink['beziercurviness'] != undefined ) ?topolink['beziercurviness'] : 150 ;
	    firstLinkValues['curviness'] =  ( topolink['curviness'] != undefined ) ? topolink['curviness'] : 10 ;
	    firstLinkValues['midpoint'] =  ( topolink['midpoint'] != undefined ) ? topolink['midpoint'] : "0.5" ;
	    firstLinkValues['round'] =  ( topolink['round'] != undefined ) ? topolink['round'] : 0 ;
	    //firstLinkValues['stub'] = 0
	    //firstLinkValues['stub'] =  
	    //firstLinkValues['curviness'] =  
	    //firstLinkValues['midpoint'] =  
	    //firstLinkValues['round'] =  

            // fill inputs
            $('.edit-network-style-form .link_color').val(firstLinkValues['color']);
            $('.edit-network-style-form .link-label-input').val(firstLinkValues['label']);
            $('.edit-network-style-form .link-labelpos-input').val(firstLinkValues['labelpos']);
            $('.edit-network-style-form .network-source-pos').val(firstLinkValues['pos-src']);
            $('.edit-network-style-form .network-destination-pos').val(firstLinkValues['pos-dst']);
            $('.edit-network-style-form .network-style-stub').val(firstLinkValues['stub']);
	    $('.edit-network-style-form .network-style-width').val(firstLinkValues['width']);
            $('.edit-network-style-form .network-style-bezier-curviness').val(firstLinkValues['beziercurviness']);
            $('.edit-network-style-form .network-style-curviness').val(firstLinkValues['curviness']);
            $('.edit-network-style-form .network-style-round').val(firstLinkValues['round']);
            $('.edit-network-style-form .network-style-midpoint').val(firstLinkValues['midpoint']);
            $('.edit-network-style-form .network-source-pos').val(firstLinkValues['pos-src']);
            $('.edit-network-style-form .network-destination-pos').val(firstLinkValues['pos-dst']);

            // fill backup
            $('.edit-network-style-form .firstLinkValues-color').val(firstLinkValues['color']);
            $('.edit-network-style-form .firstLinkValues-label').val(firstLinkValues['label']);
            $('.edit-network-style-form .firstLinkValues-labelpos').val(firstLinkValues['labelpos']);
            $('.edit-network-style-form .firstLinkValues-style').val(firstLinkValues['style']);
            $('.edit-network-style-form .firstLinkValues-linkstyle').val(firstLinkValues['linkstyle']);
            $('.edit-network-style-form .firstLinkValues-stub').val(firstLinkValues['stub']);
	    $('.edit-network-style-form .firstLinkValues-width').val(firstLinkValues['width']);
            $('.edit-network-style-form .firstLinkValues-bezier-curviness').val(firstLinkValues['beziercurviness']);
            $('.edit-network-style-form .firstLinkValues-curviness').val(firstLinkValues['curviness']);
            $('.edit-network-style-form .firstLinkValues-round').val(firstLinkValues['round']);
            $('.edit-network-style-form .firstLinkValues-midpoint').val(firstLinkValues['midpoint']);
            $('.edit-network-style-form .firstLinkValues-pos-src').val(firstLinkValues['pos-src']);
            $('.edit-network-style-form .firstLinkValues-pos-dst').val(firstLinkValues['pos-dst']);
    });

}

function printFormConnQuality(id) {
        getTopology().done(function(res) {
                var firstLinkValues = {}
                tmpconn = lab_topology.getConnections().find( function(item) { return  item.id == id} )
                topolink =  res.filter( function (item) { return  item.source == tmpconn.source && item.source_label == tmpconn.source_label }  )[0]
                var html = new EJS({
                        url: '/themes/default/ejs/form_link_quality.ejs'
                }).render({
                        MESSAGES: MESSAGES,
			ROLE: ROLE,
			LOCK: LOCK,
                        id: id,
                        SourceId: topolink['source'].replace('node',''),
                        source_node_name: topolink['source_node_name'],
                        source_label: topolink['source_label'],
                        destination_label: topolink['destination_label'].replace(/^network$/,'N/A'),
                        DestId: topolink['destination'].replace('node',''),
            destination_node_name: topolink['destination_node_name'],
                        SourceIfaceId: topolink['source_interfaceId'],
                        DestIfaceId: topolink['destination_interfaceId'],
            source_delay: topolink['source_delay'],
            source_loss: topolink['source_loss'],
            source_jitter: topolink['source_jitter'],
            source_bandwidth: topolink['source_bandwidth'],
                        destination_delay: topolink['destination_delay'],
                        destination_loss: topolink['destination_loss'],
                        destination_jitter: topolink['destination_jitter'],
                        destination_bandwidth: topolink['destination_bandwidth']
                })
                $('#body').append(html);
                if ( topolink['destination_node_name'] == 'network'  ) {
                        $('.link-destination_delay').prop('disabled',true);
                        $('.link-destination_jitter').prop('disabled',true);
                        $('.link-destination_loss').prop('disabled',true);
                        $('.link-destination_bandwidth').prop('disabled',true);
                }
    });
}


function printFormLineStyle(id) {
    //alert(JSON.stringify( id ));
    getLineObject(id).done(function(res) {
        var paintstyle = ['Solid', 'Dashed']
        , firstLineValues = {}
        , colorDigits
        , linestyle = ['Straight', 'Bezier', 'Flowchart', 'StateMachine']
        , arrowstyle =['arrow','line','dblarrow']
        , label;
        var html =  new EJS({
            url: '/themes/default/ejs/form_line_style.ejs'
        }).render({
            MESSAGES: MESSAGES,
            id: id
        })
        $('#body').append(html);
        firstLineValues['paintstyle'] = res['paintstyle'];
	//console.log ( '%o' , res );
        firstLineValues['linestyle'] = ( res['linestyle'] != "" ) ? res['linestyle'] : 'Straight' ;
        firstLineValues['color'] = res['color'];
        firstLineValues['label'] = res['label'];
        firstLineValues['labelpos'] = parseFloat(res['labelpos']);
        firstLineValues['width'] = res['width'];
        firstLineValues['arrowstyle'] = res['arrowstyle'];
        firstLineValues['stub'] = res['stub'];
        firstLineValues['curviness'] = res['curviness'];
        firstLineValues['beziercurviness'] = res['beziercurviness'];
        firstLineValues['round'] = res['round'];
        firstLineValues['midpoint'] = res['midpoint'];

        for (var i = 0; i < paintstyle.length; i++) {
            $('.edit-line-style-form .line-paintstyle-select').append($('<option></option>').val(paintstyle[i]).html(paintstyle[i]));
            if ( firstLineValues['paintstyle'] == paintstyle[i] ) $('.edit-line-style-form .line-paintstyle-select').val(paintstyle[i]) ;
        }
        for (var i = 0; i < linestyle.length; i++) {
                    $('.edit-line-style-form .line-linestyle-select').append($('<option></option>').val(linestyle[i]).html(linestyle[i]));
            if ( firstLineValues['linestyle'] == linestyle[i] ) $('.edit-line-style-form .line-linestyle-select').val(linestyle[i]) ;
        }
        for (var i = 0; i < arrowstyle.length; i++) {
                    $('.edit-line-style-form .line-arrowstyle-select').append($('<option></option>').val(arrowstyle[i]).html(arrowstyle[i]));
            if ( firstLineValues['arrowstyle'] == arrowstyle[i] ) $('.edit-line-style-form .line-arrowstyle-select').val(arrowstyle[i]) ;
        }
        switch ( firstLineValues['linestyle'] ) {
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
        $('.edit-line-style-form .line_color').val(firstLineValues['color']);
        $('.edit-line-style-form .line-label').val(firstLineValues['label']);
        $('.edit-line-style-form .line-labelpos').val(firstLineValues['labelpos']);
        $('.edit-line-style-form .line-width').val(firstLineValues['width']);
        $('.edit-line-style-form .line-stub').val(firstLineValues['stub']);
        $('.edit-line-style-form .line-curviness').val(firstLineValues['curviness']);
        $('.edit-line-style-form .line-bezier-curviness').val(firstLineValues['beziercurviness']);
        $('.edit-line-style-form .line-round').val(firstLineValues['round']);
        $('.edit-line-style-form .line-midpoint').val(firstLineValues['midpoint']);
        $('.edit-line-style-form .firstLineValues-color').val(firstLineValues['color']);
        $('.edit-line-style-form .firstLineValues-labelpos').val(firstLineValues['labelpos']);
        $('.edit-line-style-form .firstLineValues-paintstyle').val(firstLineValues['paintstyle']);
        $('.edit-line-style-form .firstLineValues-linestyle').val(firstLineValues['linestyle']);
        $('.edit-line-style-form .firstLineValues-arrowstyle').val(firstLineValues['arrowstyle']);
        $('.edit-line-style-form .firstLineValues-width').val(firstLineValues['width']);
	$('.edit-line-style-form .firstLineValues-stub').val(firstLineValues['stub']);
	$('.edit-line-style-form .firstLineValues-curviness').val(firstLineValues['curviness']);
	$('.edit-line-style-form .firstLineValues-beziercurviness').val(firstLineValues['beziercurviness']);
	$('.edit-line-style-form .firstLineValues-round').val(firstLineValues['round']);
	$('.edit-line-style-form .firstLineValues-midpoint').val(firstLineValues['midpoint']);
    });

}


// Edit Form: Custom Shape
function printFormEditCustomShape(id) {
    $('.edit-custom-shape-form').remove();
    $('.edit-custom-text-form').remove();
    $('.customShape').each(function (index) {
        $(this).removeClass('in-editing');
    });
    getTextObject(id).done(function(res){
        var borderTypes = ['solid', 'dashed']
        , firstShapeValues = {}
        , shape
        , transparent = false
        , colorDigits
        , bgColor
        , html = new EJS({
            url: '/themes/default/ejs/form_edit_custom_shape.ejs'
        }).render({
            MESSAGES: MESSAGES,
            id: id
        })

        $('#body').append(html);

        if(isIE){
            $('input[type="color"]').hide()
            $('input.shape_border_color').colorpicker({
                color: "#000000",
                defaultPalette: 'web'
            })
            $('input.shape_background_color').colorpicker({
                color: "#ffffff",
                defaultPalette: 'web'
            })
        }
        for (var i = 0; i < borderTypes.length; i++) {
            $('.edit-custom-shape-form .border-type-select').append($('<option></option>').val(borderTypes[i]).html(borderTypes[i]));
        }

        if ($("#customShape" + id + " svg").children().attr('stroke-dasharray')) {
            $('.edit-custom-shape-form .border-type-select').val(borderTypes[1]);
            firstShapeValues['border-types'] = borderTypes[1];
        } else {
            $('.edit-custom-shape-form .border-type-select').val(borderTypes[0]);
            firstShapeValues['border-types'] = borderTypes[0];
        }

        bgColor = $("#customShape" + id + " svg").children().attr('fill');
        colorDigits = /(.*?)rgba{0,1}\((\d+), (\d+), (\d+)\)/.exec(bgColor);
        if (colorDigits === null) {
            var ifHex = bgColor.indexOf('#');
            if (ifHex < 0) {
                transparent = true;
            }
        }

        if (transparent) {
            $('.edit-custom-shape-form .shape_background_transparent').addClass('active  btn-success').text('On');
        } else {
            $('.edit-custom-shape-form .shape_background_transparent').removeClass('active  btn-success').text('Off');
        }

        firstShapeValues['shape-name'] = res.name;
        firstShapeValues['shape-z-index'] = $('#customShape' + id).css('z-index');
        firstShapeValues['shape-background-color'] = rgb2hex($("#customShape" + id + " svg").children().attr('fill'));
        firstShapeValues['shape-border-color'] = rgb2hex($("#customShape" + id + " svg ").children().attr('stroke'));
        firstShapeValues['shape-border-width'] = $("#customShape" + id + " svg").children().attr('stroke-width');
        firstShapeValues['shape-rotation'] = getElementsAngle("#customShape" + id);
        // $("#customShape" + id ).attr('name');

        // fill inputs
        $('.edit-custom-shape-form .shape-z_index-input').val(firstShapeValues['shape-z-index'] - 1000);
        $('.edit-custom-shape-form .shape_background_color').val(firstShapeValues['shape-background-color']);
        $('.edit-custom-shape-form .shape_border_color').val(firstShapeValues['shape-border-color']);
        $('.edit-custom-shape-form .shape_border_width').val(firstShapeValues['shape-border-width']);
        $('.edit-custom-shape-form .shape-rotation-input').val(firstShapeValues['shape-rotation']);
        $('.edit-custom-shape-form .shape-name-input').val(firstShapeValues['shape-name']);

        // fill backup
        $('.edit-custom-shape-form .firstShapeValues-z_index').val(firstShapeValues['shape-z-index']);
        $('.edit-custom-shape-form .firstShapeValues-border-color').val(firstShapeValues['shape-border-color']);
        $('.edit-custom-shape-form .firstShapeValues-background-color').val(firstShapeValues['shape-background-color']);
        $('.edit-custom-shape-form .firstShapeValues-border-type').val(firstShapeValues['border-types']);
        $('.edit-custom-shape-form .firstShapeValues-border-width').val(firstShapeValues['shape-border-width']);
        $('.edit-custom-shape-form .firstShapeValues-rotation').val(firstShapeValues['shape-rotation']);

        if ($("#customShape" + id + " svg").children().attr('cx')) {
            $('.edit-custom-shape-form .shape_border_width').val(firstShapeValues['shape-border-width'] * 2);
            $('.edit-custom-shape-form .firstShapeValues-border-width').val(firstShapeValues['shape-border-width'] * 2);
        }
        $("#customShape" + id).addClass('in-editing');
    });

}

// Edit Form: Text
function printFormEditText(id) {
    $('.edit-custom-shape-form').remove();
    $('.edit-custom-text-form').remove();
    $('.customShape').each(function (index) {
        $(this).removeClass('in-editing');
    });

    var firstTextValues = {}
        , transparent = false
        , colorDigits
        , bgColor
        , html = new EJS({
            url: '/themes/default/ejs/form_edit_text.ejs'
        }).render({
            id: id,
            MESSAGES: MESSAGES
        })

    $('#body').append(html);

    if(isIE){
        $('input[type="color"]').hide()
        $('input.shape_border_color').colorpicker({
            color: "#000000",
            defaultPalette: 'web'
        })
        $('input.shape_background_color').colorpicker({
            color: "#ffffff",
            defaultPalette: 'web'
        })
    }
    bgColor = $("#customText" + id + " p").css('background-color');
    colorDigits = /(.*?)rgba{0,1}\((\d+), (\d+), (\d+)\)/.exec(bgColor);
    if (colorDigits === null) {
        var ifHex = bgColor.indexOf('#');
        if (ifHex < 0) {
            transparent = true;
        }
    }

    if (transparent) {
        $('.edit-custom-text-form .text_background_transparent').addClass('active  btn-success').text('On');
    } else {
        $('.edit-custom-text-form .text_background_transparent').removeClass('active  btn-success').text('Off');
    }

    firstTextValues['text-z-index'] = parseInt($('#customText' + id).css('z-index'));
    firstTextValues['text-color'] = rgb2hex($("#customText" + id + " p").css('color'));
    firstTextValues['text-background-color'] = rgb2hex($("#customText" + id + " p").css('background-color'));
    firstTextValues['text-rotation'] = getElementsAngle("#customText" + id);


    $('.edit-custom-text-form .text-z_index-input').val(parseInt(firstTextValues['text-z-index']) - 1000);
    $('.edit-custom-text-form .text_color').val(firstTextValues['text-color']);
    $('.edit-custom-text-form .text_background_color').val(firstTextValues['text-background-color']);
    $('.edit-custom-text-form .text-rotation-input').val(firstTextValues['text-rotation']);

    if ($("#customText" + id + " p").css('font-style') == 'italic') {
        $('.edit-custom-text-form .btn-text-italic').addClass('active');
        firstTextValues['text-type-italic'] = 'italic'
    }
    if ($("#customText" + id + " p").css('font-weight') == 'bold') {
        $('.edit-custom-text-form .btn-text-bold').addClass('active');
        firstTextValues['text-type-bold'] = 'bold';
    }
    if ($("#customText" + id + " p").attr('align') == 'left') {
        $('.edit-custom-text-form .btn-align-left').addClass('active');
        firstTextValues['text-align'] = 'left';
    } else if ($("#customText" + id + " p").attr('align') == 'center') {
        $('.edit-custom-text-form .btn-align-center').addClass('active');
        firstTextValues['text-align'] = 'center';
    } else if ($("#customText" + id + " p").attr('align') == 'right') {
        $('.edit-custom-text-form .btn-align-right').addClass('active');
        firstTextValues['text-align'] = 'right';
    }

    $('.edit-custom-text-form .firstTextValues-z_index').val(parseInt(firstTextValues['text-z-index']));
    $('.edit-custom-text-form .firstTextValues-color').val(firstTextValues['text-color']);
    $('.edit-custom-text-form .firstTextValues-background-color').val($("#customText" + id + " p").css('background-color'));
    $('.edit-custom-text-form .firstTextValues-italic').val(firstTextValues['text-type-italic']);
    $('.edit-custom-text-form .firstTextValues-bold').val(firstTextValues['text-type-bold']);
    $('.edit-custom-text-form .firstTextValues-align').val(firstTextValues['text-align']);
    $('.edit-custom-text-form .firstTextValues-rotation').val(firstTextValues['text-rotation']);

    $("#customText" + id).addClass('in-editing');
}

// Change from RGB to Hex color
function rgb2hex(color) {
    if (color.substr(0, 1) === '#') {
        return color;
    }
    var digits = /(.*?)rgba{0,1}\((\d+), (\d+), (\d+)\)/.exec(color);

    if (digits == null) {
        digits = /(.*?)rgba\((\d+), (\d+), (\d+), (\d+)\)/.exec(color);
    }

    var red = parseInt(digits[2]);
    var green = parseInt(digits[3]);
    var blue = parseInt(digits[4]);

    var rgb = blue | (green << 8) | (red << 16);
    return digits[1] + '#' + ("000000" + rgb.toString(16)).slice(-6);
}

// Change from Hex to RGB color
function hex2rgb(hex, opacity) {
    hex = hex.replace('#', '');
    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);

    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + opacity + ')';
}

function getElementsAngle(selector) {
    var el = document.querySelector(selector)
        , st = window.getComputedStyle(el, null)
        , tr = st.getPropertyValue("-webkit-transform") ||
        st.getPropertyValue("-moz-transform") ||
        st.getPropertyValue("-ms-transform") ||
        st.getPropertyValue("-o-transform") ||
        st.getPropertyValue("transform") ||
        "FAIL";

    if (tr === "FAIL" || tr === "none") {
        return 0;
    }

    // With rotate(30deg)...
    // matrix(0.866025, 0.5, -0.5, 0.866025, 0px, 0px)
    // rotation matrix - http://en.wikipedia.org/wiki/Rotation_matrix

    var values = tr.split('(')[1].split(')')[0].split(',')
        , a = values[0]
        , b = values[1]
        , c = values[2]
        , d = values[3]
        , scale = Math.sqrt(a * a + b * b)
    // arc sin, convert from radians to degrees, round
        , sin = b / scale
        , angle = Math.round(Math.atan2(b, a) * (180 / Math.PI))
        ;

    return angle;
}

function getLogs(file, per_page, search) {
    var deferred = $.Deferred();
    var url = '/api/logs/' + file + "/" + per_page + "/" + search;
    var type = 'GET';
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            var html = new EJS({url: '/themes/default/ejs/logs.ejs'}).render({
                "logs": data,
                "per_page": per_page,
                "search": search,
                "file": file
            });
            $('#main').html(html);

            var html_title = '' +
                '<div class="row row-eq-height"><div id="list-title-folders" class="col-md-12 col-lg-12">' +
                '<span title="Logs">Logs</span>' +
                '</div>' +
                '</div>';
            $('#main-title').html(html_title);
            $('#main-title').show();

            bodyAddClass('logs');
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

function search_log(file) {
    if (file)
        curr_log = file;
    per_page = $("#log_lines").val();
    search = $("#log_search").val();

    getLogs(curr_log, per_page, search);
}

var curr_log = "";

// Print user management section
function printLogs(file, per_page, search) {
    curr_log = file;
    $('#actions-menu').empty();
    $('#actions-menu').append('<li><a href="#" onclick="search_log(); return false"><i class="glyphicon glyphicon-refresh"></i> Refresh</a></li>');

    $.when(getLogs(file, per_page, search)).done(function (data) {

    }).fail(function (message) {
        addModalError(message);
    });
}

// Add class to body
function bodyAddClass(cl){
    $('body').attr('class',cl);
}

function autoheight() {
    if ($('#main').height() < window.innerHeight - $('#main').offset().top) {
        $('#main').height(function(index, height) {
            return window.innerHeight - $(this).offset().top;
        });
    }
}

function lockLab( password ) {
    var lab_topology = window.lab_topology
    //var allElements = $('.node_frame, .network_frame, .customShape');
    //alert ( JSON.stringify( allElements ));
    //for (var i = 0; i < allElements.length; i++){
    //    if(toogleDruggable(lab_topology, allElements[i])) toogleDruggable(lab_topology, allElements[i])
    //}
    //lab_topology.setDraggable($('.node_frame, .network_frame, .customShape'), false);
    //$('.customShape').draggable('disable');
    //$('.customShape').resizable('disable');
    // $('.action-unlock-lab i').removeClass('glyphicon-remove-circle').addClass('glyphicon-ok-circle')
    //$('.action-lock-lab').html('<i style="color:red" class="glyphicon glyphicon-remove-circle"></i>' + MESSAGES[167])
    //$('.action-lock-lab').removeClass('action-lock-lab').addClass('action-unlock-lab')
    var deferred = $.Deferred();
    var lab_filename = $('#lab-viewport').attr('data-path');
    var url = '/api/labs' + lab_filename + '/Lock' ;
    var type = 'PUT';
    var form_data = {};
    form_data['password'] = password ;
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
    data: JSON.stringify(form_data),
        success: function (data) {
            if (data['status'] == 'success') {
        LOCK = 1 ;
        $('.action-labobjectadd-li').fadeTo(0,0)
        lab_topology.setDraggable($('.node_frame, .network_frame, .customShape, .line'), false);
        $('.customShape').not('.customText').resizable('disable');
        $('.action-lock-lab').html('<i style="color:red" class="fas fa-lock"></i>' + MESSAGES[167])
         $('.action-lock-lab').removeClass('action-lock-lab').addClass('action-unlock-lab')
                deferred.resolve();
        $('.lockmodal').modal('hide');
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
        $('.lockmodal').modal('hide');
            }
            addMessage(data['status'], data['message']);
        },
        error: function (data) {
            // Server error
        $('.lockmodal').modal('hide');
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
   // $('.action-labobjectadd-li').hide();
    return deferred.promise();
}

function unlockLab(password){
//    lab_topology = window.lab_topology
//    lab_topology.setDraggable($('.node_frame, .network_frame, .customShape'), true);
//    lab_topology.draggable($('.node_frame, .network_frame, .customShape'), {
//                       grid: [3, 3],
//                       stop: ObjectPosUpdate
//                    });

    //$('.customShape').draggable('enable');
    $('.customShape').not('.customText').resizable('enable');
//    $('.action-unlock-lab').html('<i class="glyphicon glyphicon-ok-circle"></i>' + MESSAGES[166])
//    $('.action-unlock-lab').removeClass('action-unlock-lab').addClass('action-lock-lab')
    var deferred = $.Deferred();
    var lab_filename = $('#lab-viewport').attr('data-path');
    var url = '/api/labs' + lab_filename + '/Unlock' ;
    var type = 'PUT';
    var form_data = {};
    form_data['password'] = password ;
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
    data: JSON.stringify(form_data),
        success: function (data) {
            if (data['status'] == 'success') {
        LOCK = 0 ;
        if ($('.action-labobjectadd-li').length == 0) {
            $('.action-nodesget-li').before('<li class="action-labobjectadd-li"><a class="action-labobjectadd" href="javascript:void(0)" title="' +
            MESSAGES[56] + '"><i class="glyphicon glyphicon-plus"></i>' + MESSAGES[56] + '</a></li>');
        } else {
            $('.action-labobjectadd-li').fadeTo(0,1)
        }
        lab_topology = window.lab_topology
        lab_topology.setDraggable($('.node_frame, .network_frame, .customShape, .line'), true);
        lab_topology.draggable($('.node_frame, .network_frame, .customShape, .line'), {
            grid: [3, 3],
        });
        $('.customShape').not('.customText').resizable('enable');
        $('.action-unlock-lab').html('<i class="fas fa-lock-open"></i>' + MESSAGES[166])
        $('.action-unlock-lab').removeClass('action-unlock-lab').addClass('action-lock-lab')
        $('.unlockmodal').modal('hide');
                deferred.resolve();
            } else {
                // Application error
        addMessage(data['status'], data['message']);
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
        $('.unlockmodal').modal('hide');
            }
            addMessage(data['status'], data['message']);
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            $('.unlockmodal').modal('hide');
            deferred.reject(message);
        }
    });
/*
    if ($('.action-labobjectadd-li').length == 0) {
         $('.action-nodesget-li').before('<li class="action-labobjectadd-li"><a class="action-labobjectadd" href="javascript:void(0)" title="' +
         MESSAGES[56] + '"><i class="glyphicon glyphicon-plus"></i>' + MESSAGES[56] + '</a></li>');
    } else {
         $('.action-labobjectadd-li').show();
   }
*/
    return deferred.promise();
}

function toogleDruggable(topology, elem){
    return topology.toggleDraggable(elem)
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function natSort(as, bs){
    var a, b, a1, b1, i= 0, L, rx=  /(\d+)|(\D+)/g, rd=  /\d/;
    if(isFinite(as) && isFinite(bs)) return as - bs;
    a= String(as).toLowerCase();
    b= String(bs).toLowerCase();
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
}

function newConnModal(info , oe ) {
        if ( !oe ) return ;
    $.when(
        getNetworks(null),
        getNodes(null),
        getTopology()
        ).done(function (networks, nodes, topology ) {
            linksourcestyle = '' ;
            linktargetstyle = '' ;
        $('#'+info.source.id).addClass("startNode")
            if ( info.source.id.search('node')  != -1  ) {
                  linksourcedata =  nodes[ info.source.id.replace('node','') ] ;
                  linksourcetype = 'node' ;
                  linksourcedata['interfaces'] = getNodeInterfaces(linksourcedata['id'])
                  if ( linksourcedata['status'] == 0 ) linksourcestyle = 'grayscale'
		  linksourcedata['icon'] = '/images/icons/'+linksourcedata['icon']
             } else {
                  linksourcedata =  networks[ info.source.id.replace('network','') ] ;
                  linksourcetype = 'net' ;
		  linksourcedata['icon'] = '/images/net_icons/'+linksourcedata['icon']
                  //linksourcedata['icon'] = ( linksourcedata['type'] == "bridge")  ? "../lan.png" : "../cloud.png"
                  //linksourcedata['icon'] = ( linksourcedata['type'] == "ovs")  ? "../lan.png" : "../cloud.png"
             }
             if ( info.target.id.search('node')  != -1  ) {
                  linktargetdata =  nodes[ info.target.id.replace('node','') ] ;
                  linktargettype = 'node' ;
                  linktargetdata['interfaces'] = getNodeInterfaces(linktargetdata['id'])
		  linktargetdata['icon'] = '/images/icons/'+linktargetdata['icon']
                  if ( linktargetdata['status'] == 0 ) linktargetstyle = 'grayscale'
             } else {
                  linktargetdata =  networks[ info.target.id.replace('network','') ] ;
                  linktargettype = 'net' ;
		  linktargetdata['icon'] = '/images/net_icons/'+linktargetdata['icon']
          //linktargetdata['icon'] = ( linktargetdata['type'] == "bridge")  ? "../lan.png" : "../cloud.png"
          //linktargetdata['icon'] = ( linktargetdata['type'] == "ovs")  ? "../lan.png" : "../cloud.png"
             }
             title = 'Add connection between ' + linksourcedata['name'] + ' and ' + linktargetdata['name'] ;
             $.when( linksourcedata['interfaces'] , linktargetdata['interfaces'] ).done( function ( sourceif, targetif) {
		  if  ( ( $('#'+info.source.id).attr('data-status') != 0 && sourceif['ethernet'].length == 0 )  || ( $('#'+info.target.id).attr('data-status') == !0  &&  targetif['ethernet'].lenght == 0 )) {
			 $('#'+info.source.id).removeClass("startNode") 
			 $('.action-labtopologyrefresh').click();
			 return ;
		  }
             /* choose first free interface */
                  if ( linksourcetype == 'node' )  {
                       logger(1,'DEBUG: looking interfaces... ');
                   linksourcedata['selectedif'] = '' ;
                       var tmp_interfaces = {} ;
                       for ( var key in sourceif['ethernet'] ) {
                 logger(1,'DEBUG: interface id ' + key + ' named ' + sourceif['ethernet'][key]['name']  + ' ' + sourceif['ethernet'][key]['network_id'])
                             tmp_interfaces[key] = sourceif['ethernet'][key]
                             tmp_interfaces[key]['type'] = 'ethernet'
                 if ( (sourceif['ethernet'][key]['network_id'] == 0 )  && ( linksourcedata['selectedif'] == '') ) {
                                    linksourcedata['selectedif'] = key ;
                             }
                       }
               if ( $('#'+info.source.id).attr('data-status') == 0 ) {
                           for ( var key in sourceif['serial'] ) {
                                 logger(1,'DEBUG: interface id ' + key + ' named ' + sourceif['serial'][key]['name']  + ' ' + sourceif['serial'][key]['remote_id'])
                                 tmp_interfaces[key] =  sourceif['serial'][key]
                                 tmp_interfaces[key]['type']  =  'serial'
                                 if ( (sourceif['serial'][key]['remote_id'] == 0 )  && ( linksourcedata['selectedif'] == '') ) {
                                        linksourcedata['selectedif'] = key ;
                                     }
                              }
               }
                       linksourcedata['interfaces'] = tmp_interfaces
                  }
                  if ( linksourcedata['selectedif'] == '') linksourcedata['selectedif'] = 0 ;
                  if ( linktargettype == 'node' )  {
                       logger(1,'DEBUG: looking interfaces... ') ;
                       linktargetdata['selectedif'] = '' ;
                       var tmp_interfaces = []
                       for ( var key in targetif['ethernet'] ) {
                             logger(1,'DEBUG: interface id ' + key + ' named ' + targetif['ethernet'][key]['name']  + ' ' + targetif['ethernet'][key]['network_id'])
                             tmp_interfaces[key] = targetif['ethernet'][key];
                             tmp_interfaces[key]['type'] = 'ethernet'
                             if ( (targetif['ethernet'][key]['network_id'] == 0 )  && ( linktargetdata['selectedif'] == '') ) {
                                    linktargetdata['selectedif'] = key ;
                             }
                       }
               if ($('#'+info.target.id).attr('data-status') == 0 ) {
                               for ( var key in targetif['serial'] ) {
                                     logger(1,'DEBUG: interface id ' + key + ' named ' + targetif['serial'][key]['name']  + ' ' + targetif['serial'][key]['remote_id'])
                                     tmp_interfaces[key] = targetif['serial'][key];
                                     tmp_interfaces[key]['type'] = 'serial' ;
                                     if ( (targetif['serial'][key]['remote_id'] == 0 )  && ( linktargetdata['selectedif'] == '') ) {
                                            linktargetdata['selectedif'] = key ;
                                     }
                               }
               }
                       linktargetdata['interfaces'] = tmp_interfaces
                  }
                  if ( linktargetdata['selectedif'] == '' ) linktargetdata['selectedif'] = 0 ;
                  //if ( linksourcedata['status'] == 2 || linktargetdata['status'] == 2 ) { lab_topology.detach( info.connection ) ; return }
                  window.tmpconn = info.connection
		  first_src = ''
		  first_dst = ''
                  html = '<form id="addConn" class="addConn-form">' +
                           '<input type="hidden" name="addConn[srcNodeId]" value="'+linksourcedata['id']+'">' +
                           '<input type="hidden" name="addConn[dstNodeId]" value="'+linktargetdata['id']+'">' +
                           '<input type="hidden" name="addConn[srcNodeType]" value="'+linksourcetype+'">' +
                           '<input type="hidden" name="addConn[dstNodeType]" value="'+linktargettype+'">' +
			   '<input type="hidden" name="addConn[srcLabel]">' +
			   '<input type="hidden" name="addConn[dstLabel]">' +
                           '<div class="row">' +
                            '<div class="col-md-4">' +
                                '<div style="text-align:center;" >'+ linksourcedata['name']  + '</div>' +
                                '<img src="'+ linksourcedata['icon'] + '" class="'+ linksourcestyle  +' img-responsive" style="margin:0 auto;">' +
                                '<div style="width:3px;height: ' + ( (linksourcetype == 'net') ? '0' : '10' ) + 'px; margin: 0 auto; background-color:#444"></div>' +
                                '<div style="margin: 0 auto; width:50%; text-align:center;" class="' + (( linksourcetype == 'net') ? 'hidden' : '')  +  '">' +
                                    '<text class="aLabel addConnSrc text-center" >'+ (( linksourcetype == 'node') ? linksourcedata['interfaces'][linksourcedata['selectedif']]['name'] : '' )  +'</text>' +
                                '</div>' +
                                '<div style="width:3px;height:160px; margin: 0 auto; background-color:#444"></div>' +
                                '<div style="margin: 0 auto; width:50%; text-align:center;" class="' + ((linktargettype == 'net') ? 'hidden' : '')  + '">' +
                                    '<text class="aLabel addConnDst text-center" >'+ ((linktargettype == 'node') ?  linktargetdata['interfaces'][linktargetdata['selectedif']]['name'] : '' ) +'</text>' +
                                '</div>' +
                                '<div style="width:3px;height: '+ ( ( linktargettype  == 'net') ? '0' : '10')  + 'px; margin: 0 auto; background-color:#444"></div>' +
                                '<img src="'+linktargetdata['icon']+'" class="'+linktargetstyle+' img-responsive" style="margin:0 auto;">' +
                                '<div style="text-align:center;" >'+linktargetdata['name']+'</div>' +
                            '</div>' +
                            '<div class="col-md-8">' +
                                '<div class="form-group">' +
                                    '<label>Source ID: '+linksourcedata['id']+'</label>' +
                                    '<p style="margin:0px;"></p>' +
                                    '<label>Source Name: '+ linksourcedata['name'] +'</label>' +
                                    '<p style="">type - '+ ((linksourcetype == 'net') ? 'Network' : 'Node') +'</p>' +
                                '</div>' +
                                '<div class="form-group">' +
                                    '<div class="form-group ' + (( linksourcetype == 'net') ? 'hidden' : '')  +  '">'  +
                                        '<label>Choose Interface for '+ linksourcedata['name'] +'</label>' +
                                        '<select name="addConn[srcConn]" class="form-control srcConn">'
                                        if ( linksourcetype == 'node' ) {
                                            // Eth first
                                            var tmp_name = [];
                                            var reversetab = [];
                                            for ( key in linksourcedata['interfaces'] ) {
                                                 tmp_name.push(linksourcedata['interfaces'][key]['name'])
                                                 reversetab[linksourcedata['interfaces'][key]['name']] = key
                                            }
                                            var ordered_name = tmp_name.sort(natSort)
					    first_src = ordered_name[0]
                                            for ( key in ordered_name ) {
                                                okey = reversetab[ordered_name[key]] ;
                                                if ( linksourcedata['interfaces'][okey]['type'] == 'ethernet' ) {
                                                    html += '<option value="' + okey + ',ethernet' +'" '+((linksourcedata['interfaces'][okey]['network_id'] != 0) ? 'disabled="true"' : '' ) +'>' + linksourcedata['interfaces'][okey]['name']
                                                    if ( linksourcedata['interfaces'][okey]['network_id'] != 0) {
                                                        html += ' connected to '
                                                        for ( tkey in topology ) {
                                                            if ( ( topology[tkey]['source'] == ( 'node' + linksourcedata['id'] ))  && ( topology[tkey]['source_label'] == linksourcedata['interfaces'][okey]['name'] )) {
                                                                if (topology[tkey]['destination_type'] == 'node'  ) html += nodes[topology[tkey]['destination'].replace('node','')]['name']
                                                                if (topology[tkey]['destination_type'] == 'node' ) html += ' ' + topology[tkey]['destination_label']
                                                                if (topology[tkey]['destination_type'] == 'network' ) html += ' ' + networks[ linksourcedata['interfaces'][okey]['network_id'] ]['name']
                                                            }
                                                            if ( ( topology[tkey]['destination'] == ( 'node' + linksourcedata['id'] ))  && ( topology[tkey]['destination_label'] == linksourcedata['interfaces'][okey]['name'] )) {
                                                                if (topology[tkey]['source_type'] == 'node'  ) html += nodes[topology[tkey]['source'].replace('node','')]['name']
                                                                if (topology[tkey]['source_type'] == 'node'  ) html += ' ' + topology[tkey]['source_label']
                                                                if ( topology[tkey]['source_type'] == 'network' ) html += ' ' + networks[ linksourcedata['interfaces'][okey]['network_id'] ]['name']
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            for ( key in ordered_name ) {
                                                okey = reversetab[ordered_name[key]] ;
                                                if ( linksourcedata['interfaces'][okey]['type'] == 'serial' ) {
                                                    html += '<option value="' + okey + ',serial' +'" '+ ((linksourcedata['interfaces'][okey]['remote_id'] != 0) ? 'disabled="true"' : '' )  +'>' + linksourcedata['interfaces'][okey]['name']
                                                    if ( linksourcedata['interfaces'][okey]['remote_id'] != 0) {
                                                    html += ' connected to '
                                                    html += nodes[ linksourcedata['interfaces'][okey]['remote_id'] ]['name']
                                                    html += ' ' + linksourcedata['interfaces'][okey]['remote_if_name']
                                                    }
                                                }
                                            }
                                         }
                                        html += '</option>'
                                        html += '</select>' +
                                        '<div style="width:3px;height:30px;"></div>' +
                                    '</div>' +
                                '</div>' +
                                '<div style="width:3px;height:30px;"></div>' +
                                '<div class="form-group">' +
                                    '<div class="form-group ' + (( linktargettype == 'net') ? 'hidden' : '')  +  '">'  +
                                        '<label>Choose Interface for '+ linktargetdata['name'] +'</label>' +
                                        '<select name="addConn[dstConn]" class="form-control dstConn">'
                                        if ( linktargettype == 'node' ) {
                                            // Eth first
                                            var tmp_name = [];
                                            var reversetab = [];
                                            for ( key in linktargetdata['interfaces'] ) {
                                                 tmp_name.push(linktargetdata['interfaces'][key]['name'])
                                                 reversetab[linktargetdata['interfaces'][key]['name']] = key
                                            }
                                            var ordered_name = tmp_name.sort(natSort) ;
					    first_dst = ordered_name[0]
                                            for ( key in ordered_name ) {
                                            okey = reversetab[ordered_name[key]] ;
                                                if ( linktargetdata['interfaces'][okey]['type'] == 'ethernet' ) {
                                                    html += '<option value="' + okey + ',ethernet' +'" '+((linktargetdata['interfaces'][okey]['network_id'] != 0) ? 'disabled="true"' : '' ) +'>' + linktargetdata['interfaces'][okey]['name']
                                                    if ( linktargetdata['interfaces'][okey]['network_id'] != 0) {
                                                        html += ' connected to '
                                                        for ( tkey in topology ) {
                                                            if ( ( topology[tkey]['source'] == ( 'node' + linktargetdata['id'] ))  && ( topology[tkey]['source_label'] == linktargetdata['interfaces'][okey]['name'] )) {
                                                                if (topology[tkey]['destination_type'] == 'node'  ) html += nodes[topology[tkey]['destination'].replace('node','')]['name']
                                                                if (topology[tkey]['destination_type'] == 'node' ) html += ' ' + topology[tkey]['destination_label']
                                                                if (topology[tkey]['destination_type'] == 'network' ) html += ' ' + networks[ linktargetdata['interfaces'][okey]['network_id'] ]['name']
                                                            }
                                                            if ( ( topology[tkey]['destination'] == ( 'node' + linktargetdata['id'] ))  && ( topology[tkey]['destination_label'] == linktargetdata['interfaces'][okey]['name'] )) {
                                                                if (topology[tkey]['source_type'] == 'node'  ) html += nodes[topology[tkey]['source'].replace('node','')]['name']
                                                                if (topology[tkey]['source_type'] == 'node'  ) html += ' ' + topology[tkey]['source_label']
                                                                if ( topology[tkey]['source_type'] == 'network' ) html += ' ' + networks[ linktargetdata['interfaces'][okey]['network_id'] ]['name']
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            // Serial first
                                            for ( key in ordered_name ) {
                                            okey = reversetab[ordered_name[key]] ;
                                                if ( linktargetdata['interfaces'][okey]['type'] == 'serial' ) {
                                                    html += '<option value="' + okey + ',serial' +'" '+ ((linktargetdata['interfaces'][okey]['remote_id'] != 0) ? 'disabled="true"' : '' )  +'>' + linktargetdata['interfaces'][okey]['name']
                                                    if ( linktargetdata['interfaces'][okey]['remote_id'] != 0) {
                                                    html += ' connected to '
                                                    html += nodes[ linktargetdata['interfaces'][okey]['remote_id'] ]['name']
                                                    html += ' ' + linktargetdata['interfaces'][okey]['remote_if_name']
                                                    }
                                                }
                                            }
                                         }
                                        html += '</option>'
                                        html += '</select>' +
                                        '<div style="width:3px;height:30px;"></div>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="form-group">' +
                                    '<label>Destination ID: ' + linktargetdata['id'] + '</label>' +
                                    '<p style="margin:0px;"></p>' +
                                    '<label>Destination Name: ' + linktargetdata['name'] + '</label>' +
                                    '<p style="text-muted">type - '+ ((linktargettype == 'net') ? 'Network' : 'Node') +'</p>' +
                                '</div>' +
                            '</div>' +
                            '<div class="col-md-8 btn-part col-md-offset-6">' +
                                '<div class="form-group">' +
                                    '<button type="submit" class="btn btn-success addConn-form-save">' + MESSAGES[47] + '</button>' +
                                    '<button type="button" class="btn cancelForm" data-dismiss="modal">' + MESSAGES[18] + '</button>' +
                                '</div>' +
                            '</div>' +
                           '</div>' +
                         '</form>'

                  addModal(title, html, '');
		  var s_iname =  $('select.srcConn option[value="' + $('select.srcConn').val() + '"]').text();
		  var d_iname =  $('select.dstConn option[value="' + $('select.dstConn').val() + '"]').text();
		  $('input[name=addConn\\[srcLabel\\]]').val(s_iname)
		  $('input[name=addConn\\[dstLabel\\]]').val(d_iname)
		  $('.aLabel.addConnSrc').text(s_iname)
		  $('.aLabel.addConnDst').text(d_iname)

             });
        });
     $('#addConn').focus()
     $('body').on('change','select.srcConn', function (e) {
          var iname =  $('select.srcConn option[value="' + $('select.srcConn').val() + '"]').text();
      $('.addConnSrc').html(iname)
      $('input[name=addConn\\[srcLabel\\]]').val(iname)
     });
     $('body').on('change','select.dstConn', function (e) {
          var iname =  $('select.dstConn option[value="' + $('select.dstConn').val() + '"]').text();
          $('.addConnDst').html(iname)
	  $('input[name=addConn\\[dstLabel\\]]').val(iname)
     });
}

function renderConn ( node1Id, source_label, node2Id, destination_label, netId, source_if_id, destination_if_id, dstType) {
	logger(1, node1Id+ source_label+ node2Id+ destination_label+ netId+ source_if_id+ destination_if_id+ dstType)
	lab_topology.deleteConnection(window.tmpconn)
	source='node' + node1Id
	destination=( dstType == 'network' ? 'network' :'node') + node2Id
	src_label = ["Label"]
	if (source_label != '') {
		src_label.push({ id: "src", label: source_label, location: 0.15, cssClass: 'node_interface ' + source + ' ' + destination });
	} else {
		src_label.push(Object());
	}
	dst_label = ["Label"]
	if (destination_label != '') {
		dst_label.push({ id: "dst", label: destination_label, location: 0.85, cssClass: 'node_interface ' + source + ' ' + destination });
	} else {
		dst_label.push(Object());
	}
	linkcolor = ( dstType == 'serial'  ? '#ffcc00' : "#3e7089")
	tmp_conn = lab_topology.connect({
		source:  source,
		target:  destination,
		cssClass: source + ' ' + destination +  (dstType == 'serial' ? ' frame_serial ' : ' frame_ethernet network'),
		paintStyle: {strokeWidth: LINK_WIDTH, stroke: linkcolor },
		overlays: [ src_label, dst_label],
		endpoints: [ [ 'Dot', { radius : 5 , cssClass: 'endpoint_'+source+'_'+source_if_id+
			' dest_'+destination+' '+
			(dstType == 'serial' ? 'networkId_0'+' serial serial_' +source+ '_' + source_if_id + '_' + destination + '_' + destination_if_id : ' networkId_'+ netId) }],
			[ 'Dot', { radius : 5 , cssClass: 'endpoint_'+destination+'_'+destination_if_id+
			' dest_'+source+' '+
			(dstType == 'serial' ? 'networkId_0 ' +' serial serial_' +source+ '_' + source_if_id + '_' + destination + '_' + destination_if_id : ' networkId_'+ netId) }]],
		endpointStyles: [ { fill: "#93191c" },{ fill: "#93191c" } ]
	})
	tmp_conn.source = source;
        tmp_conn.source_label = source_label;
	tmp_id = ( dstType == 'ethernet' ? 'network_id:'+netId : 'iface:'+source+':'+ source_if_id )
        tmp_conn.id = tmp_id
        tmp_conn.addClass(tmp_id)
	$('.node_interface.'+source+'.'+destination+'.'+tmp_id.replace(/:/g,'\\:')).css('color',  linkcolor )
}
function renderNetwork(network_id, network_left, network_top, network_icon, network_name, network_smart) {
	
            $("#lab-viewport").append(
                '<div id="network' + network_id + '" ' +
                'class="context-menu  network network' + network_id + ' network_frame ' + ( network_smart == -1 ? '"' : 'smart"' ) +
                'style="top: ' + network_top + 'px; left: ' + network_left + 'px" ' +
                'data-path="' + network_id + '" ' +
                'data-status="0" '+
                'data-name="' + network_name + '">' +
                '<div class="network_name">' + network_name + '</div>' +
                '<div class="tag  hidden" title="Connect to another node">'+
                '<i class="fas fa-plug plug-icon dropdown-toggle ep"></i>'+
                '</div>'+
                '</div>');

                var img = new Image();

                img.src = "/images/net_icons/" + network_icon;

                $(img).prependTo("#network" + network_id);
	    

            lab_topology.makeSource($('#network' + network_id), {
                                filter: ".ep",
                                Anchor:"Continuous",
                                connectionType:"basic",
                                extract:{
                                    "action":"the-action"
                                },
                                maxConnections: 30,
                                onMaxConnections: function (info, e) {
                                    alert("Maximum connections (" + info.maxConnections + ") reached");
                                }
                           });

            lab_topology.makeTarget($('#network' + network_id), {
                                dropOptions: { hoverClass: "dragHover" },
                                anchor: "Continuous",
                                allowLoopback: false
                          });
	    lab_topology.draggable($('#network' + network_id ), {
                           containment: false,
                           grid: [3, 3],
                        });
            adjustZoom(lab_topology, window.scroll_top || 0, window.scroll_left || 0)
}
function renderNode(node_id, node_left, node_top, node_icon, node_type, node_name) {
	   if ( readCookie("html5") == 1 ) {
		   if ( $('#framewrap'+node_id).length === 0 ) {
			   iframeOpen( node_name , node_id )
		   }
		   hrefbuf='<a href="" target="'+ node_name + '_' + node_id+'">' ;
	   } else {
		   hrefbuf='<a href="">' ;
	   }
	   $("#lab-viewport").append(
		   '<div id="node' + node_id + '" ' +
		   'class="context-menu node node' + node_id + ' node_frame "' +
		   'style="top: ' + node_top + 'px; left: ' + node_left + 'px;" ' +
		   'data-path="' + node_id + '" ' +
		   'data-status="0" ' +
		   'data-sat="0" ' +
		   'data-name="' + node_name + '" ' +
		   'data-qemu="' + ( node_type == 'qemu' ? 1 : 0 ) + '" ' +
		   'data-linkstate="' + ( (node_type == 'qemu' || node_type == 'iol' || node_type == 'docker' ) ? 1 : 0 ) + '">' +
		   '<div class="tag  hidden" title="Connect to another node">'+
		   '<i class="fas fa-ethernet plug-icon dropdown-toggle ep"></i>'+
		   '</div>'+
		   hrefbuf +
		   '</a>' +
		   '<div class="node_name"><i class="node' + node_id + '_status glyphicon glyphicon-question-sign"></i> ' + node_name + '</div>' +
		   '</div>');
	var img = new Image();
	img.src = "/images/icons/" + node_icon
	img.className = 'grayscale';
	$(img).appendTo("#node" + node_id + " a");

	lab_topology.makeSource($('#node' + node_id), {
		filter: ".ep",
		Anchor: "Continuous",
		extract:{
			"action":"the-action"
			},
		maxConnections: 30,
		onMaxConnections: function (info, e) {
			alert("Maximum connections (" + info.maxConnections + ") reached");
			}
		});
	lab_topology.makeTarget( $('#node' + node_id), {
		dropOptions: { hoverClass: "dragHover" },
		anchor: "Continuous",
		allowLoopback: false
		});
	lab_topology.draggable($('#node' + node_id ), {
                           containment: false,
                           grid: [3, 3],
                        });
	adjustZoom(lab_topology, window.scroll_top || 0, window.scroll_left || 0)
}

function connContextMenu ( e, ui ) {
         window.connContext = 1
         window.connToDel = e
}

function zoomlab ( event, ui ) {
    var zoom=ui.value/100
    setZoom(zoom,lab_topology,[0.0,0.0])
    $('#lab-viewport').width(($(window).width()-40)/zoom)
    $('#lab-viewport').height($(window).height()/zoom);
    $('#lab-viewport').css({top: 0,left: 40,position: 'absolute'});
    //setZoom(zoom,lab_topology,[0.0,0.0])
    $('#zoomslide').slider({value:ui.value})
}

function zoompic ( event, ui ) {
    var zoom=ui.value/100
    setZoom(zoom,lab_picture,[0,0])
    $('#picslider').slider({value:ui.value})
}

// Function from jsPlumb Doc
window.setZoom = function(zoom, instance, transformOrigin, el) {
  transformOrigin = transformOrigin || [ 0.5, 0.5 ];
  instance = instance || jsPlumb;
  el = el || instance.getContainer();
  var p = [ "webkit", "moz", "ms", "o" ],
      s = "scale(" + zoom + ")",
      oString = (transformOrigin[0] * 100) + "% " + (transformOrigin[1] * 100) + "%";

  for (var i = 0; i < p.length; i++) {
    el.style[p[i] + "Transform"] = s;
    el.style[p[i] + "TransformOrigin"] = oString;
  }

  el.style["transform"] = s;
  el.style["transformOrigin"] = oString;

  instance.setZoom(zoom);
};

// Form upload node config
// Import external labs
function printFormUploadNodeConfig(path) {
    var html = '<form id="form-upload-node-config" class="form-horizontal form-upload-node-config">' +
                    '<div class="form-group">' +
                         '<label class="col-md-3 control-label">' + MESSAGES[2] + '</label>' +
                         '<div class="col-md-5">' +
                              '<input class="form-control" name="upload[path]" value="" disabled="" placeholder="' + MESSAGES[25] + '" "type="text"/>' +
                         '</div>' +
                    '</div>' +
                    '<div class="form-group">' +
                         '<div class="col-md-7 col-md-offset-3">' +
                               '<span class="btn btn-default btn-file btn-success">' + MESSAGES[23] +
                                    '<input accept="text/plain" class="form-control" name="upload[file]" value="" type="file">' +
                               '</span>' +
                               '<button type="submit" class="btn btn-flat">' + MESSAGES[200] + '</button>' +
                               '<button type="button" class="btn btn-flat" data-dismiss="modal">' + MESSAGES[18] + '</button>' +
                         '</div>' +
                   '</div>' +
                 '</form>';
    logger(1, 'DEBUG: popping up the upload form.');
    addModal(MESSAGES[201], html, '', 'upload-modal');
    validateImport();
}


function printFormAddConfigset(path) {
 var html = '<form id="form-add-configset" class="form-horizontal form-add-configset">' +
        '<div class="form-group">' +
            '<label class="col-md-3 control-label">' + MESSAGES[19] + '</label>' +
            '<div class="col-md-5">' +
                '<input type="text" class="form-control" name="configset_name" placeholder="Name">' +
            '</div>' +
        '</div>' +
        '<div class="form-group">' +
            '<div class="col-md-7 col-md-offset-3">' +
                            '<button type="submit" class="btn btn-success addConn-form-save">' + MESSAGES[17] + '</button>' +
                            '<button type="button" class="btn cancelForm" data-dismiss="modal">' + MESSAGES[18] + '</button>' +
            '</div>' +
        '</div>' +
        '</form>';
        logger(1, 'DEBUG: popping up the add configset form.');
        addModal(MESSAGES[211], html, '', 'add-configset-modal second-win');
}

function printFormAddLabTask(path) {
 var html = '<form id="form-addtask" class="form-horizontal form-addtask">' +
                '<div class="form-group">' +
                        '<label class="col-md-3 control-label">' + MESSAGES[19] + '</label>' +
                        '<div class="col-md-5">' +
                                '<input type="text" class="form-control" name="task_name" placeholder="Name">' +
                        '</div>' +
                '</div>' +
                '<div class="form-group">' +
                        '<div class="col-md-7 col-md-offset-3">' +
                                '<button type="submit" class="btn btn-success addConn-form-save">' + MESSAGES[17] + '</button>' +
                                '<button type="button" class="btn cancelForm" data-dismiss="modal">' + MESSAGES[18] + '</button>' +
                        '</div>' +
                '</div>' +
                '</form>';
                logger(1, 'DEBUG: popping up the add task form.');
                addModal(MESSAGES[231], html, '', 'add-task-modal second-win');
}

function printFormRenameLabTask(id) {
 var html = '<form id="form-renametask" class="form-horizontal form-rnametask">' +
                '<div class="form-group">' +
            '<input type="hidden" name="id" value="' + id + '">' +
                        '<label class="col-md-3 control-label">' + MESSAGES[19] + '</label>' +
                        '<div class="col-md-5">' +
                                '<input type="text" class="form-control" name="task_name" placeholder="New Name">' +
                        '</div>' +
                '</div>' +
                '<div class="form-group">' +
                        '<div class="col-md-7 col-md-offset-3">' +
                                '<button type="submit" class="btn btn-success addConn-form-save">' + MESSAGES[21] + '</button>' +
                                '<button type="button" class="btn cancelForm" data-dismiss="modal">' + MESSAGES[18] + '</button>' +
                        '</div>' +
                '</div>' +
                '</form>';
                logger(1, 'DEBUG: popping up the Rename task form.');
                addModal(MESSAGES[231], html, '', 'rename-task-modal second-win');
}


function printFormEditConfigset(id) {
 var html = '<form id="form-edit-configset" class="form-horizontal form-edit-configset">' +
                '<div class="form-group">' +
                        '<label class="col-md-3 control-label">' + MESSAGES[19] + '</label>' +
                        '<div class="col-md-5">' +
                                '<input type="text" class="form-control" name="configset_name" placeholder="Name" value="' + $('#configsetselect option:selected').text() + '">' +
                        '</div>' +
                '</div>' +
                '<div class="form-group">' +
                        '<div class="col-md-7 col-md-offset-3">' +
                                '<button type="submit" class="btn btn-success addConn-form-save">' + MESSAGES[71] + '</button>' +
                                '<button type="button" class="btn cancelForm" data-dismiss="modal">' + MESSAGES[18] + '</button>' +
                        '</div>' +
                '</div>' +
                '</form>';
                logger(1, 'DEBUG: popping up the edit configset form.');
                addModal(MESSAGES[211], html, '', 'edit-configset-modal second-win');
}

function saveNodeConfig ( id , cfsid , config ) {
    var lab_filename = $('#lab-viewport').attr('data-path');
    var form_data = {};
    form_data['id'] = id ;
    form_data['cfsid'] = cfsid ;
    form_data['data'] = config ;
    var url = '/api/labs' + lab_filename + '/configs/' + form_data['id'];
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
                logger(1, 'DEBUG: config saved.');
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                addModal('ERROR', '<p>' + data['message'] + '</p>', '<button type="button" class="btn btn-flat" data-dismiss="modal">Close</button>');
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            addModal('ERROR', '<p>' + message + '</p>', '<button type="button" class="btn btn-flat" data-dismiss="modal">Close</button>');
        }
    });
    return false;  // Stop to avoid POST
}
function printFormUploadConfigset(path) {
    var html = '<form id="form-upload-configset" class="form-horizontal form-upload-configset">' +
                '<div class="form-group">' +
                        '<label class="col-md-3 control-label">' + MESSAGES[19] + '</label>' +
                        '<div class="col-md-5">' +
                                '<input type="text" class="form-control" name="configset_name" placeholder="Name">' +
                        '</div>' +
                '</div>' +
                    '<div class="form-group">' +
                         '<label class="col-md-3 control-label">' + MESSAGES[2] + '</label>' +
                         '<div class="col-md-5">' +
                              '<input class="form-control" name="uploadconfigset[path]" value="" disabled="" placeholder="' + MESSAGES[25] + '" "type="text"/>' +
                         '</div>' +
                    '</div>' +
                    '<div class="form-group">' +
                         '<div class="col-md-7 col-md-offset-3">' +
                               '<span class="btn btn-default btn-file btn-success">' + MESSAGES[23] +
                                    '<input accept="" class="form-control" name="upload[configset]" value="" type="file">' +
                               '</span>' +
                               '<button type="submit" class="btn btn-flat">' + MESSAGES[200] + '</button>' +
                               '<button type="button" class="btn btn-flat" data-dismiss="modal">' + MESSAGES[18] + '</button>' +
                         '</div>' +
                   '</div>' +
                 '</form>';
    logger(1, 'DEBUG: popping up the upload configset form.');
    addModal(MESSAGES[201], html, '', 'upload-modal');
    validateImport();
}

var myroom = 1234
var textroom = null;
var janus = null;
var participants = {}
var transactions = {}
var opaqueId = "textroomtest-"+randomString(12);

function janusChatConnect ( labuuid , user, pod ) {
   navigator.mediaDevices.getUserMedia({audio : true });
   Janus.init({debug: "all", callback: function() {
    if(!Janus.isWebrtcSupported()) {
            bootbox.alert("No WebRTC support... ");
                return;
        }
    janus = new Janus(
        {
            server: "wss://" + window.location.host + "/janus-ws",
            iceServers: [{ "url":"stun:stun.l.google.com:19302"}],
            success: function() {
                janus.attach(
                    {
                        plugin: "janus.plugin.textroom",
                        opaqueId: opaqueId,
                        success: function(pluginHandle) {
                            textroom = pluginHandle;
                            Janus.log("Plugin attached! (" + textroom.getPlugin() + ", id=" + textroom.getId() + ")");
                            // Setup the DataChannel
                                                        var body = { "request": "setup" };
                                                        Janus.debug("Sending message (" + JSON.stringify(body) + ")");
                                                        textroom.send({"message": body});
                        },
                        error: function(error) {
                            console.error("  -- Error attaching plugin...", error);
                            bootbox.alert("Error attaching plugin... " + error);
                        },
                        webrtcState: function(on) {
                            Janus.log("Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
                        },
                        onmessage: function(msg, jsep) {
                            Janus.debug(" ::: Got a message :::");
                            Janus.debug(msg);
                            if(msg["error"] !== undefined && msg["error"] !== null) {
                                bootbox.alert(msg["error"]);
                            }
                            if(jsep !== undefined && jsep !== null) {
                                // Answer
                                textroom.createAnswer(
                                    {
                                        jsep: jsep,
                                        media: { audio: false, video: false, data: true },      // We only use datachannels
                                        success: function(jsep) {
                                            Janus.debug("Got SDP!");
                                            Janus.debug(jsep);
                                            var body = { "request": "ack" };
                                            textroom.send({"message": body, "jsep": jsep});
                                        },
                                        error: function(error) {
                                            Janus.error("WebRTC error:", error);
                                            bootbox.alert("WebRTC error... " + JSON.stringify(error));
                                        }
                                });
                            }
                        },
                        ondataopen: function(data) {
                            Janus.log("The DataChannel is available!");
                            // Register user into lab channel TODO
                                            var register = {
                                        textroom: "join",
                                        transaction: pod,
                                        room: labuuid,
                                        username: user,
                                        display: user
                                    };
                            transactions[pod] = function(response) {
                                if(response["textroom"] === "error") {
                                    if(response["error_code"] === 417) {
                                        bootbox.alert("Romm does not exist !!!")
                                    } else {
                                        bootbox.alert(response["error"]);
                                    }
                                    return;
                                }
                                // We're in
                                 //$('#roomjoin').hide();
                                //$('#room').removeClass('hide').show();
                                //$('#participant').removeClass('hide').html(myusername).show();
                                //$('#chatroom').css('height', ($(window).height()-420)+"px");
                                $('#datasend').removeAttr('disabled');
                                // Any participants already in?
                                console.log("Participants:", response.participants);
                                if(response.participants && response.participants.length > 0) {
                                    for(var i in response.participants) {
                                        var p = response.participants[i];
                                        participants[p.username] = p.display ? p.display : p.username;
                                        if(p.username !== user && $('#rp' + p.username).length === 0) {
                                            // Add to the participants list
                                            //$('#list').append('<li id="rp' + p.username + '" class="list-group-item">' + participants[p.username] + '</li>');
                                            //$('#rp' + p.username).css('cursor', 'pointer').click(function() {
                                            //	var username = $(this).attr('id').split("rp")[1];
                                            //	janusSendPrivateMsg(username);
                                            //});
                                        }
                                        $('#chatroom').append('<p style="color: green;">[' + getDateString() + '] <i>' + participants[p.username] + ' joined</i></p>');
                                        $('#chatroom').get(0).scrollTop = $('#chatroom').get(0).scrollHeight;
                                    }
                                }
                            };
                            textroom.data({
                                text: JSON.stringify(register),
                                error: function(reason) {
                                    bootbox.alert(reason);
                                    //$('#username').removeAttr('disabled').val("");
                                    //$('#register').removeAttr('disabled').click(registerUsername);
                                }
                            });
                        },
                        ondata: function(data) {
                            Janus.debug("We got data from the DataChannel! " + data);
                            var json = JSON.parse(data);
                            var transaction = json["transaction"];
                            if(transactions[transaction]) {
                                // Someone was waiting for this
                                transactions[transaction](json);
                                delete transactions[transaction];
                                return;
                            }
                            var what = json["textroom"];
                            if(what === "message") {
                                // Incoming message: public or private?
                                var msg = json["text"];
                                msg = msg.replace(new RegExp('<', 'g'), '&lt');
                                msg = msg.replace(new RegExp('>', 'g'), '&gt');
                                var from = json["from"];
                                var dateString = getDateString(json["date"]);
                                var whisper = json["whisper"];
                                if(whisper === true) {
                                    // Private message
                                    $('#chatroom').append('<p style="color: purple;">[' + dateString + '] <b>[whisper from ' + participants[from] + ']</b> ' + msg);
                                    $('#chatroom').get(0).scrollTop = $('#chatroom').get(0).scrollHeight;
                                } else {
                                    // Public message
                                    $('#chatroom').append('<p>[' + dateString + '] <b>' + participants[from] + ':</b> ' + msg);
                                    $('#chatroom').get(0).scrollTop = $('#chatroom').get(0).scrollHeight;
                                }
                            } else if(what === "join") {
                            // Somebody joined
                                var username = json["username"];
                                var display = json["display"];
                                participants[username] = display ? display : username;
                                if(username !== user && $('#rp' + username).length === 0) {
                                    // Add to the participants list
                                    //$('#list').append('<li id="rp' + username + '" class="list-group-item">' + participants[username] + '</li>');
                                    //$('#rp' + username).css('cursor', 'pointer').click(function() {
                                    //	var username = $(this).attr('id').split("rp")[1];
                                    //	janusSendPrivateMsg(username);
                                    //});
                                }
                                $('#chatroom').append('<p style="color: green;">[' + getDateString() + '] <i>' + participants[username] + ' joined</i></p>');
                                $('#chatroom').get(0).scrollTop = $('#chatroom').get(0).scrollHeight;
                            } else if(what === "leave") {
                                // Somebody left
                                var username = json["username"];
                                var when = new Date();
                                $('#rp' + username).remove();
                                $('#chatroom').append('<p style="color: green;">[' + getDateString() + '] <i>' + participants[username] + ' left</i></p>');
                                $('#chatroom').get(0).scrollTop = $('#chatroom').get(0).scrollHeight;
                                delete participants[username];
                            } else if(what === "kicked") {
                                // Somebody was kicked
                                var username = json["username"];
                                var when = new Date();
                                $('#rp' + username).remove();
                                $('#chatroom').append('<p style="color: green;">[' + getDateString() + '] <i>' + participants[username] + ' was kicked from the room</i></p>');
                                $('#chatroom').get(0).scrollTop = $('#chatroom').get(0).scrollHeight;
                                delete participants[username];
                                if(username === user) {
                                    bootbox.alert("You have been kicked from the room", function() {
                                        //window.location.reload();
                                    });
                                }
                            } else if(what === "destroyed") {
                                if(json["room"] !== myroom)
                                    return;
                                // Room was destroyed, goodbye!
                                Janus.warn("The room has been destroyed!");
                                bootbox.alert("The room has been destroyed", function() {
                                    //window.location.reload();
                                });
                            }
                        },
                        oncleanup: function() {
                            Janus.log(" ::: Got a cleanup notification :::");
                            $('#datasend').attr('disabled', true);
                        }
                    });
                }

            });
        }
   });
}

function janusSendPrivateMsg(username) {
        var display = participants[username];
        if(!display)
                return;
        bootbox.prompt("Private message to " + display, function(result) {
                if(result && result !== "") {
                        var message = {
                                textroom: "message",
                                transaction: randomString(12),
                                room: myroom,
                                to: username,
                                text: result
                        };
                        textroom.data({
                                text: JSON.stringify(message),
                                error: function(reason) { bootbox.alert(reason); },
                                success: function() {
                                        $('#chatroom').append('<p style="color: purple;">[' + getDateString() + '] <b>[whisper to ' + display + ']</b> ' + result);
                                        $('#chatroom').get(0).scrollTop = $('#chatroom').get(0).scrollHeight;
                                }
                        });
                }
        });
        return;
}

function janusSendData() {
        var data = $('#datasend').val();
        if(data === "") {
                bootbox.alert('Insert a message to send on the DataChannel');
                return;
        }
        var message = {
                textroom: "message",
                transaction: randomString(12),
                room: myroom,
                text: data,
        };
        // Note: messages are always acknowledged by default. This means that you'll
        // always receive a confirmation back that the message has been received by the
        // server and forwarded to the recipients. If you do not want this to happen,
        // just add an ack:false property to the message above, and server won't send
        // you a response (meaning you just have to hope it succeeded).
        textroom.data({
                text: JSON.stringify(message),
                error: function(reason) { bootbox.alert(reason); },
                success: function() { $('#datasend').val(''); }
        });
}

// Helper to format times
function getDateString(jsonDate) {
        var when = new Date();
        if(jsonDate) {
                when = new Date(Date.parse(jsonDate));
        }
        var dateString =
                        ("0" + when.getHours()).slice(-2) + ":" +
                        ("0" + when.getMinutes()).slice(-2) + ":" +
                        ("0" + when.getSeconds()).slice(-2);
        return dateString;
}

// Just an helper to generate random usernames
function randomString(len, charSet) {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
}
function janusCheckEnter(field, event) {
        var theCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
        if(theCode == 13) {
                if(field.id == 'username')
                        registerUsername();
                else if(field.id == 'datasend')
                        janusSendData();
                return false;
        } else {
                return true;
        }
}
var chatsocket = null ;
function chatConnect ( labuuid , user, pod ) {
    chatsocket = new WebSocket("wss://"+window.location.host+'/chat-ws');
    chatsocket.onopen = function(event) {
        //$('#chatroom').append('<p>[' + dateString + '] <b>' + participants[from] + ':</b> ' + msg);
        //$('#chatroom').append('<p style="color: green;">[' + getDateString() + '] <i>' + participants[p.username] + ' joined</i></p>');
        $('#chatroom').append('<p style="color: green;">[' + getDateString() + '] <i> connected to chatroom </i></p>');
        var messageJSON = {
            chat_user: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' ,
            chat_message: user
        };
        chatsocket.send(JSON.stringify(messageJSON));
        $('#datasend').attr('disabled', false);
    }
    chatsocket.onmessage = function(event) {
        var Data = JSON.parse(event.data);
        if ( Data.message_type  == 'chat-box-html' ) {
            if ( Data.chat_user == 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' ) {
                if ( Data.message != USERNAME && Data.message.search(' '+USERNAME+' ') == -1 ) {
                    $('#chatroom').append('<p style="color: green;">[' + getDateString() + '] <i>' + Data.message+ ' joined</i></p>');
                } else if ( Data.message != USERNAME && Data.message.search(' '+USERNAME+' ') != -1 ) {
                    $('#chatroom').append('<p style="color: blue;"><i>Currently connected:' + Data.message+ '</i></p>');
                }
                $('#chatroom').get(0).scrollTop = $('#chatroom').get(0).scrollHeight;
            } else if ( Data.chat_user != null ) {
                $('#chatroom').append('<p style="white-space: pre-wrap;" >[' + getDateString() + '] <b>' + Data.chat_user + ':</b> ' + Data.message  + '</p>');
                $('#chatroom').get(0).scrollTop = $('#chatroom').get(0).scrollHeight;
            }
        }
        if ( Data.message_type  == 'chat-disconnected' ) {
            if ( Data.chat_user == 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' ) {
                $('#chatroom').append('<p style="color: red;">[' + getDateString() + '] <i>' + Data.message+
' disconnected</i></p>');
                $('#chatroom').get(0).scrollTop = $('#chatroom').get(0).scrollHeight;
            }
        }
    }
    chatsocket.onerror = function(event){
        $('#chatroom').append('<p style="color: red;">[' + getDateString() + '] <i>Conectivity Error</i></p>');
        $('#chatroom').get(0).scrollTop = $('#chatroom').get(0).scrollHeight;
    }
    chatsocket.onclose = function(event){
        $('#chatroom').append('<p style="color: red;">[' + getDateString() + '] <i>Connection Closed</i></p>');
        $('#chatroom').get(0).scrollTop = $('#chatroom').get(0).scrollHeight;
        chatsocket = null ;
    }
}

function chatCheckEnter(field, event) {
    var theCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
    if(theCode == 13 && !event.shiftKey  ) {
    //if(theCode == 13 ) {
        if ( chatsocket == null  )  {
            $('#chatroom').empty()
            chatConnect ( 1234 , USERNAME , TENANT )
        }
        message =  $('#datasend').val() ;
        if ( message.length == 0 )  return false ;
        var messageJSON = {
            chat_user: USERNAME,
            chat_message: message
        };
        $('#datasend').val('')
        chatsocket.send(JSON.stringify(messageJSON));
        return false ;
    }
}

function askLockPass () {
        var body = '<div class="form-group">' +
                    '<div class="question">Enter password to lock lab</div><br>' +
            '<div class="form-group">' +
                       '<label class="col-md-5 control-label form-group-addon">Password</label>' +
                       '<div class="col-md-5">' +
                          '<input type="password" name="lockpass" class="form-control" placeholder="">' +
                       '</div>' +
                    '</div> <br>' +
                    '<div class="form-group">' +
                       '<label class="col-md-5 control-label form-group-addon">Confirm password</label>' +
                       '<div class="col-md-5">' +
                          '<input type="password" name="lockpassconfirm" class="form-control" placeholder="">' +
                       '</div>' +
                    '</div> <br>' +
                    '<div class="col-md-5 col-md-offset-3">' +
                        '<button id="confirmLock" class="btn btn-success"  >Lock</button>' +
                        '<button type="button" class="btn" data-dismiss="modal">Cancel</button>' +
                    '</div>' +
                '</div>'
    var title = "Lock Lab"
    addModal(title, body, "", "lockmodal make-red make-small");
}
function askUnlockPass () {
            var body = '<div class="form-group">' +
                    '<div class="question">Enter password to unlock lab</div><br>' +
                    '<div class="form-group">' +
                       '<label class="col-md-5 control-label form-group-addon">Password</label>' +
                       '<div class="col-md-5">' +
                          '<input type="password" name="lockpass" class="form-control" placeholder="">' +
                       '</div>' +
                    '</div> <br>' +
                    '<div class="col-md-6 col-md-offset-3">' +
                        '<button id="confirmUnlock" class="btn btn-success"  data-dismiss="modal">UnLock</button>' +
                        '<button type="button" class="btn" data-dismiss="modal">Cancel</button>' +
                    '</div>' +
                '</div>'
    var title = "Unlock Lab"
    addModal(title, body, "", "unlockmodal make-red make-small");
}

// Get screenshot
function getScreenshot() {
    var deferred = $.Deferred();
    var lab_filename = $('#lab-viewport').attr('data-path');
    var url = '/api/print/' + lab_filename;
    var type = 'GET';
    $.ajax({
        cache: false,
        timeout: TIMEOUT,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                logger(1, 'DEBUG: screenshot.');
                deferred.resolve(data);
            } else {
                // Application error
                logger(1, 'DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            logger(1, 'DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            logger(1, 'DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

function  b64toBlob(b64Data, contentType) {
  var sliceSize = 512
  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for ( offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for ( i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, {type: contentType});
  return blob;
}

function percentageToHsl(percentage, hue0, hue1) {
    var hue = (percentage * (hue1 - hue0)) + hue0;
    return 'hsl(' + hue + ', 60%, 50%)';
}
