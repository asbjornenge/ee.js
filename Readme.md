# ee.js

It's not that the world needs yet another JavaScript event emitter, but they are fun to write, and this one comes with a few differentiating features. It's also tiny and works without any dependency on the browser or other libraries.

* Handlers can be turned off by name, fn, or both.
* Duplicate handlers with the same name and fn are ignored.
* Handlers added with `once` or `times` will not cause infinite loops.

## API

```javascript
var emitter = ee([obj]);
```

`ee` creates a new emitter object, or extends an existing object with emitter methods.

```javascript
emitter.on(name, func, [context], [args...]);
```

`.on` adds a new handler which will be fired when its name is emitted. You may optionally specify the context for the handler, and any arguments which should be applied when the handler is called.

```javascript
emitter.once(name, [context], [args...]);
```

`.once` adds a new handler which will be removed after it has been called.

```javascript
emitter.times(n, name, [context], [args...]);
```

`.times` adds a new handler which will be removed after it has been called `n` times.

```javascript
emitter.emit(name, [context], [args...]);
```

`.emit` fires all handlers registered for this event. You may optionally specify the context for the handler, and any arguments which should be applied when the handler is called.

```javascript
emitter.has(name, [fn]);
```

`.has` checks if there's a registered handler for an event name. Pass a function to see if the emitter has that function as a registered handler for this event.

```
emitter.off([name], [fn]);
```

`.off` removes a handler by name, or by name and function. Call `.off` without any arguments to remove all handlers.
