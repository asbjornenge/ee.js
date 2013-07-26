/* global define, module */

(function (root, factory) {

    /*
     * Export magic for node, AMD and the browser.
     */
    if (typeof define === 'function' && define.amd) define(factory);
    else if (typeof exports === 'object') module.exports = factory();
    else root.ee = factory();

}(this, function () {
    'use strict';

    /*
     * Trigger one or more listeners by name.
     * Without any arguments, all listeners are triggered.
     *
     * @[name]: The name of the listeners to trigger.
     * @[self]: The this argument for the handler.
     * @[arguments...]: Extra arguments for the handler.
     */
    var emit = function (name, self) {
        var args = [].slice.call(arguments, 2);
        if (name) run(this, this._ee[name], self, args);
        else for (name in this._ee)
            if (this._ee.hasOwnProperty(name))
                run(this, this._ee[name], self, args);
        return this;
    };

    /*
     * Add a listener that will only be triggered @n times and removed.
     *
     * @n: The number of times the listener should be triggered.
     * @name: The name of the events to trigger.
     * @fn: The handler for this event.
     * @[self]: The this argument for the handler.
     * @[arguments...]: Extra arguments for the handler.
     */
    var times = function (n, name, fn, self) {
        if (!name || !fn || this.has(name, fn)) return this;
        var args = [].slice.call(arguments, 4);
        var e = { n: n, name: name, fn: fn, self: self, args: args };
        if (this._ee[name]) this._ee[name].push(e);
        else this._ee[name] = [e];
        return this;
    };

    /*
     * Remove one or more listeners by name or name and handler.
     * Without any arguments, all listeners will be removed.
     *
     * @[name]: The name of this event.
     * @[fn]: The handler for this event.
     */
    var off = function (name, fn) {
        if (typeof name === 'undefined') this._ee = {};
        else if (typeof fn === 'undefined') this._ee[name] = [];
        else for (var i = 0; i < this._ee[name].length; i++)
            if (this._ee[name][i] && this._ee[name][i].fn === fn)
                this._ee[name][i] = undefined;
        return this;
    };

    /*
     * Check if an event has listeners, or a specific handler.
     *
     * @name: The name of the listener.
     * @[fn]: Check if the listener has this handler.
     */
    var has = function(name, fn) {
        if (!name || !this._ee[name]) return false;
        if (!fn) return true;
        for (var i = 0; i < this._ee[name].length; i++)
            if (this._ee[name][i] && this._ee[name][i].fn === fn)
                return true;
        return false;
    };

    /*
     * Internal: Run a list of events on an emitter.
     *
     * @emitter: The emitter to run the events on.
     * @events: An array of event objects.
     * @self: The this argument for the handlers.
     * @args: Extra arguments for the handlers.
     */
    var run = function (emitter, events, self, args) {
        if (events) for (var i = 0; i < events.length; i++) {
            var e = events[i];
            if (!e) continue;
            if (e.n && --e.n < 1 && e.name) emitter.off(e.name);
            if (e.fn) e.fn.apply(
                self || e.self || emitter,
                e.args.concat(args));
        }
    };

    /*
     * Internal: Partial function application.
     *
     * @fn: The function for partial application.
     * @arguments...: The applied arguments.
     */
    var partial = function (fn) {
        var args = [].slice.call(arguments, 1);
        return function () {
            return fn.apply(this, args.concat([].slice.call(arguments)));
        };
    };

    /*
     * Return a new emitter factory with:
     *
     * @[obj]: An optional object to extend with emitter methods.
     */
    return function (obj) {
        obj = obj || {};
        obj._ee = {};
        obj.on = partial(times, null);
        obj.once = partial(times, 1);
        obj.times = times;
        obj.emit = emit;
        obj.has = has;
        obj.off = off;
        return obj;
    };

}));
