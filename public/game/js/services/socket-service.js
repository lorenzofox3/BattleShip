/**
 * Created with JetBrains WebStorm.
 * User: laurentrenard
 * Date: 12/18/12
 * Time: 3:22 PM
 * To change this template use File | Settings | File Templates.
 */
'use strict';

/* socket service */


app.factory('socket', function ($rootScope) {
    var socket = io.connect();
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
});