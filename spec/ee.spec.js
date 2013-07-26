describe('ee.js', function() {
    var e, a, b, c, d, x, y, z;

    beforeEach(function() {
        e = ee();
        a = b = c = d = x = y = z = 0;
        e.on('a', function() { a++; });
        e.on('b', function() { b++; });
        e.on('c', function() { c++; });
    });

    it('.emit should run handlers', function() {
        e.emit('a'); e.emit('a'); e.emit('b'); e.emit();
        assert.equal(a, 3);
        assert.equal(b, 2);
        assert.equal(c, 1);
        assert.equal(d, 0);
    });

    it('.emit should not run on missing handlers', function() {
        e.emit('a'); e.emit('a'); e.emit('x'); e.emit('y'); e.emit();
        assert.equal(a, 3);
        assert.equal(b, 1);
        assert.equal(c, 1);
        assert.equal(d, 0);
        assert.equal(x, 0);
        assert.equal(y, 0);
    });

    it('.off should remove by name', function() {
        e.emit('a'); e.emit('b'); e.off('a');
        e.emit('a'); e.emit('b'); e.off();
        e.emit('a'); e.emit('b');
        assert.equal(a, 1);
        assert.equal(b, 2);
        assert.equal(c, 0);
    });

    it('.off should ignore missing names', function() {
        e.emit('a'); e.emit('b'); e.emit();
        e.off('a'); e.off('d'); e.off(2);
        e.emit('a'); e.emit('b'); e.emit();
        assert.equal(a, 2);
        assert.equal(b, 4);
        assert.equal(c, 2);
    });

    it('.off should remove by handler', function() {
        var hx = function() { x++; };
        var hy = function() { y++; };
        var hz = function() { z++; };
        e.on('h', hx); e.on('h', hy); e.on('h', hz); e.emit('h');
        e.off('h', hx); e.emit('h');
        e.off('h', hy); e.emit('h');
        e.off(); e.emit('h');
        assert.equal(x, 1);
        assert.equal(y, 2);
        assert.equal(z, 3);
    });

    it('.off should ignore missing handler', function() {
        var hx = function() { x++; };
        var hy = function() { y++; };
        var hz = function() { z++; };
        e.on('h1', hx); e.on('h2', hy); e.on('h3', hz); e.emit('h1'); e.emit('h2');
        e.off('j', hx); e.off('i'); e.off('h3', hx); e.emit('h1'); e.emit('h2');
        assert.equal(x, 2);
        assert.equal(y, 2);
        assert.equal(z, 0);
    });

    it('.on and .emit should keep this and args', function() {
        e.on('d', function(a1, a2) {
            assert.equal(this.foo, 1);
            assert.equal(a1, 'foo');
            assert.equal(a2, 'bar');
        }, { foo: 1 }, 'foo', 'bar');
        e.emit();
        e.on('x', function(a1, a2) {
            assert.equal(this.bar, 2);
            assert.equal(a1, 'foo');
            assert.equal(a2, 'bar');
        });
        e.emit('x', { bar: 2 }, 'foo', 'bar');
    });

    it('.on and .emit should use emitter as this by default', function() {
        e.lol = 1;
        e.on('y', function(a1) {
            assert.equal(this.lol, 1);
            assert.equal(a1, 'baz');
        }, null, 'baz');
        e.emit('y');
        e.on('k', function(a1) {
            assert.equal(this.lol, 1);
            assert.equal(a1, 'qux');
        });
        e.emit('k', null, 'qux');
    });

    it('.once should only run handlers once', function() {
        e.once('d', function() { d++; });
        e.emit('d'); e.emit('d'); e.emit();
        assert.equal(d, 1);
    });

    it('.once should prevent infinite loops', function() {
        e.once('1', function() { e.emit('1'); x++; });
        e.emit('1');
        assert.equal(x, 1);
    });

    it('.times should only run handlers n times', function() {
        e.times(3, 'x', function() { x++; });
        e.times(1, 'y', function() { y++; });
        e.emit('x'); e.emit('x'); e.emit(); e.emit(); e.emit();
        assert.equal(x, 3);
        assert.equal(y, 1);
    });

    it('.has should check if a name has handlers', function() {
        var e1 = ee(), e2 = ee();
        var f1 = function() { x++; };
        var f2 = function() { y++; };
        e1.on('1', f1).on('2', f2); e2.on('1', f1);
        assert.equal(e1.has('1'), true, 'a');
        assert.equal(e1.has('2'), true, 'b');
        assert.equal(e2.has('1'), true, 'c');
        assert.equal(e2.has('2'), false, 'd');
        assert.equal(e2.has('2', f2), false, 'd');
    });

    it('.on should not add duplicate handlers', function() {
        var e1 = ee(), f1 = function() { x++; };
        e1.on('1', f1); e1.on('1', f1); e1.times(2, '1', f1);
        e1.emit();
        assert.equal(x, 1);
    });

    it('ee should create multiple emitters', function() {
        var e1 = ee();
        var e2 = ee();
        e1.on('x', function() { x++; });
        e2.on('x', function() { x++; });
        e2.on('y', function() { y++; });
        e1.emit('x'); e1.emit();
        e2.off(); e2.emit();
        assert.equal(x, 2);
        assert.equal(y, 0);
    });

    it('ee should extend other objects', function() {
        var foo = { a: 1 }; ee(foo);
        foo.on('x', function() { this.a++; });
        foo.emit('x'); foo.emit();
        assert.equal(foo.a, 3);
    });

    it('ee should be chainable', function() {
        var hx = function() { x++; };
        var hy = function() { y++; };
        ee().on('x', hx).on('y', hy).on('h', hx).on('h', hy)
            .off('y', hy).emit('x').emit().emit('h');
        assert.equal(x, 4);
        assert.equal(y, 2);
    });

    it('ee should handle non-string names', function() {
        var o1 = { a: 1 };
        var f1 = function() { x++ };

        e.on(1, function() { x++; }); e.emit(1);
        e.on(1.1, function() { x++; }); e.emit(1.1);
        e.on(true, function() { x++; }); e.emit(true);
        e.on(o1, function() { x++; }); e.emit(o1);
        e.on(f1, function() { x++; }); e.emit(f1);

        e.on(0, function() { x++; });
        e.on(false, function() { x++; });
        e.on(undefined, function() { x++; });

        assert.equal(x, 5);
        assert.equal(e.has(1), true);
        assert.equal(e.has(true), true);
        assert.equal(e.has(f1), true);
        assert.equal(e.has(0), false);
        assert.equal(e.has(false), false);
    });

    it('ee should handle many listeners', function() {
        for(var i = 1; i < 201; i++) e.on(i, function() { x++; });
        for(var j = 1; j < 201; j++) e.on(j, function() { x++; });
        e.emit(); e.emit(1);
        assert.equal(e.has(2), true);
        assert.equal(x, 402);
    });

});
