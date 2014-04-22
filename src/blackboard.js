define(function () {
    /**
     * A runtime merge-point manager.
     *
     * <p>A blackboard is a mechanism for describing a parallizable workflow as
     * a series of merge points, dependent on the availability of data with a
     * given label.</p>
     */
    return function Blackboard () {
        var watchers  = {};
        var interests = {};
        var callbacks = [];
        var scopes    = [];
        var objects   = {};
        var hungup    = false;

        function list (table, key) {
            return (table[key] = table[key] || []);
        }

        function dispatch (callbackId) {
            var callbackInterests = interests[callbackId];
            var argumentList = [];

            for (var i = 0; i < callbackInterests.length; i++) {
                var key = callbackInterests[i];

                if (!objects.hasOwnProperty(key)) {
                    return false;
                }

                argumentList.push(objects[key]);
            }

            /* TODO Identify if we want to include object scope?! */
            callbacks[callbackId].apply(
                (scopes[callbackId] || this), argumentList
            );
            
            return true;
        }

        function isArray (value) {
            return Object.prototype.toString.call(value) === "[object Array]";
        }

        /**
         * Hang up this blackboard.
         *
         * <p>Undeclare all watchers and prevent all future dispatching.</p>
         */
        this.hangup = function () {
            hungup   = true;
            watchers = {};
        };

        /**
         * Fetch the value of a key.
         */
        this.get = function (key) {
            return objects[key];
        };

        /**
         * Fetch a list of all watchers for a key.
         */
        this.watchers = function (key) {
            return watchers[key] || [];
        };

        /**
         * Fetch a list of all keys currently being watched.
         */
        this.watched = function () {
            var result = [];

            for (var key in watchers)
                if (watchers.hasOwnProperty(key)) {
                    result.push(key);
                }
        };

        /**
         * Watch for a given set of keys.
         *
         * <p>Given a key, or a list of keys, wait for values to be associated
         * with those keys - at which point invoke the given callback.</p>
         *
         * @param keys The key, or keys (as an array) to watch for.
         * @param callback The callback to invoke.
         * @param scope The value to use for <code>this</code> when invoking
         * the function, <em>optional</em>.
         *
         * @return <code>true</code> if all keys were available,
         * <code>false</code> if they were not or the blackboard was hung up.
         */
        this.watch = function (keys, callback, scope) {
            if (hungup) return false;

            if (!isArray(keys)) {
                keys = [ keys ];
            }

            /* Because we cannot uniquely identify a function, we have to keep
             * track of the functions ourselves by assigning each one a unique
             * identifier.  Luckily, arrays are great for this.
             */
            var callbackId = callbacks.length;

            callbacks.push(callback);
            scopes.push(scope);

            for (var i = 0; i < keys.length; i++) {
                list(watchers, keys[i]).push(callbackId);
            }

            interests[callbackId] = keys.slice();

            return dispatch(callbackId);
        };

        /**
         * Create a publisher placeholder.
         *
         * <p>Create and return a publisher which can be added to a list of
         * watchers, and will be provided to the waiting callback as a
         * responder.</p>
         *
         * <p>Each argument provided to this method represents a key for which
         * to push the data provided to the callback under.  Each argument
         * provided to the callback is associated with the key provided to this
         * function in order.  Hopefully if this is stated enough ways it will
         * make sense to the reader.</p>
         */
        this.publisher = function () {
            var blackboard = this;
            var keys = [];

            for (var i = 0; i < arguments.length; i++) {
                keys.push(arguments[i]);
            }

            return function () {
                for (var i = 0; i < arguments.length; i++) {
                    blackboard.put( keys[i], arguments[i] );
                }
            };
        };

        /**
         * Place a value on the blackboard, notifying all interested watchers.
         *
         * <p>Given a key and a value, announce the availability of the key by
         * notifying all interested parties.</p>
         */
        this.put = function (key, value) {
            if (hungup) return false;

            if (!objects.hasOwnProperty(key)) {
                objects[key] = value;

                var watchersList = list(watchers, key);

                for (var i = 0; i < watchersList.length; i++) {
                    dispatch(watchersList[i]);

                    if (hangup) break;
                }
            }
        };
    }
});
