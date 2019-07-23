(function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function validate_store(store, name) {
        if (!store || typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(component, store, callback) {
        const unsub = store.subscribe(callback);
        component.$$.on_destroy.push(unsub.unsubscribe
            ? () => unsub.unsubscribe()
            : unsub);
    }
    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? requestAnimationFrame : noop;

    const tasks = new Set();
    let running = false;
    function run_tasks() {
        tasks.forEach(task => {
            if (!task[0](now())) {
                tasks.delete(task);
                task[1]();
            }
        });
        running = tasks.size > 0;
        if (running)
            raf(run_tasks);
    }
    function loop(fn) {
        let task;
        if (!running) {
            running = true;
            raf(run_tasks);
        }
        return {
            promise: new Promise(fulfil => {
                tasks.add(task = [fn, fulfil]);
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function detach_between(before, after) {
        while (before.nextSibling && before.nextSibling !== after) {
            before.parentNode.removeChild(before.nextSibling);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? undefined : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_data(text, data) {
        data = '' + data;
        if (text.data !== data)
            text.data = data;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let stylesheet;
    let active = 0;
    let current_rules = {};
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        if (!current_rules[name]) {
            if (!stylesheet) {
                const style = element('style');
                document.head.appendChild(style);
                stylesheet = style.sheet;
            }
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ``}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        node.style.animation = (node.style.animation || '')
            .split(', ')
            .filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        )
            .join(', ');
        if (name && !--active)
            clear_rules();
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            let i = stylesheet.cssRules.length;
            while (i--)
                stylesheet.deleteRule(i);
            current_rules = {};
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = current_component;
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }

    const dirty_components = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.shift()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            while (render_callbacks.length) {
                const callback = render_callbacks.pop();
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment) {
            $$.update($$.dirty);
            run_all($$.before_render);
            $$.fragment.p($$.dirty, $$.ctx);
            $$.dirty = null;
            $$.after_render.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    let outros;
    function group_outros() {
        outros = {
            remaining: 0,
            callbacks: []
        };
    }
    function check_outros() {
        if (!outros.remaining) {
            run_all(outros.callbacks);
        }
    }
    function on_outro(callback) {
        outros.callbacks.push(callback);
    }
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick: tick$$1 = noop, css } = config;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick$$1(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            task = loop(now$$1 => {
                if (running) {
                    if (now$$1 >= end_time) {
                        tick$$1(1, 0);
                        cleanup();
                        return running = false;
                    }
                    if (now$$1 >= start_time) {
                        const t = easing((now$$1 - start_time) / duration);
                        tick$$1(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                delete_rule(node);
                if (typeof config === 'function') {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.remaining += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick: tick$$1 = noop, css } = config;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            loop(now$$1 => {
                if (running) {
                    if (now$$1 >= end_time) {
                        tick$$1(0, 1);
                        if (!--group.remaining) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.callbacks);
                        }
                        return false;
                    }
                    if (now$$1 >= start_time) {
                        const t = easing((now$$1 - start_time) / duration);
                        tick$$1(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (typeof config === 'function') {
            wait().then(() => {
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = key && { [key]: value };
            const child_ctx = assign(assign({}, info.ctx), info.resolved);
            const block = type && (info.current = type)(child_ctx);
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            on_outro(() => {
                                block.d(1);
                                info.blocks[i] = null;
                            });
                            block.o(1);
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                if (block.i)
                    block.i(1);
                block.m(info.mount(), info.anchor);
                flush();
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
        }
        if (is_promise(promise)) {
            promise.then(value => {
                update(info.then, 1, info.value, value);
            }, error => {
                update(info.catch, 2, info.error, error);
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = { [info.value]: promise };
        }
    }

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function outro_and_destroy_block(block, lookup) {
        on_outro(() => {
            destroy_block(block, lookup);
        });
        block.o(1);
    }
    function update_keyed_each(old_blocks, changed, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(changed, child_ctx);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            if (block.i)
                block.i(1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_render } = component.$$;
        fragment.m(target, anchor);
        // onMount happens after the initial afterUpdate. Because
        // afterUpdate callbacks happen in reverse order (inner first)
        // we schedule onMount callbacks before afterUpdate callbacks
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_render.forEach(add_render_callback);
    }
    function destroy(component, detaching) {
        if (component.$$) {
            run_all(component.$$.on_destroy);
            component.$$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            component.$$.on_destroy = component.$$.fragment = null;
            component.$$.ctx = {};
        }
    }
    function make_dirty(component, key) {
        if (!component.$$.dirty) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty = blank_object();
        }
        component.$$.dirty[key] = true;
    }
    function init(component, options, instance, create_fragment, not_equal$$1, prop_names) {
        const parent_component = current_component;
        set_current_component(component);
        const props = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props: prop_names,
            update: noop,
            not_equal: not_equal$$1,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_render: [],
            after_render: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty: null
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, props, (key, value) => {
                if ($$.ctx && not_equal$$1($$.ctx[key], $$.ctx[key] = value)) {
                    if ($$.bound[key])
                        $$.bound[key](value);
                    if (ready)
                        make_dirty(component, key);
                }
            })
            : props;
        $$.update();
        ready = true;
        run_all($$.before_render);
        $$.fragment = create_fragment($$.ctx);
        if (options.target) {
            if (options.hydrate) {
                $$.fragment.l(children(options.target));
            }
            else {
                $$.fragment.c();
            }
            if (options.intro && component.$$.fragment.i)
                component.$$.fragment.i();
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy(this, true);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe,
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (!stop) {
                    return; // not ready
                }
                subscribers.forEach((s) => s[1]());
                subscribers.forEach((s) => s[0](value));
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                }
            };
        }
        return { set, update, subscribe };
    }
    /**
     * Derived value store by synchronizing one or more readable stores and
     * applying an aggregation function over its input values.
     * @param {Stores} stores input stores
     * @param {function(Stores=, function(*)=):*}fn function callback that aggregates the values
     * @param {*=}initial_value when used asynchronously
     */
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => store.subscribe((value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const getFilters = () => getPref("filters", []);

    const addFilter = (filter) => {
        let currentFilters = getFilters();

        currentFilters.push(filter);

        setPref("filters", currentFilters);
    };

    const deleteFilter = (filter) => {
        let currentFilters = getFilters();

        setPref("filters", currentFilters.filter(f => f !== filter));
    };

    const isMessageBlured = (msg) => {
        let currentFilters = getFilters().filter(f => f.action == "blur");
        if (currentFilters.length > 0) {
            let res = currentFilters.map((f) => isMessageFiltered(msg, f, "blur"));
            return !res.some(r => r)
        } else {
            return false
        }
    };


    const isMessageHidden = (msg) => {
        let currentFilters = getFilters().filter(f => f.action == "hide");
        if (currentFilters.length > 0) {
            let res = currentFilters.map((f) => isMessageFiltered(msg, f, "hide"));
            return res.some(r => r)
        } else {
            return true // true because it is used by a pull.filter()
        }
    };

    const isMessageFiltered = (msg, filter, action) => {
        let filterResults = [];
        if (filter.action !== action) {
            return true
        }

        if (filter.expires) {
            let expirationDate = new Date(filter.expires);
            let today = new Date();

            if (today > expirationDate) {
                return true
            }
        }

        if (filter.feed) {
            if (filter.feed == msg.value.author) {
                console.log("filtered due to feed");
                filterResults.push(true);
            } else {
                filterResults.push(false);
            }
        }

        if (filter.channel) {
            console.log("filtered due to channel");
            if (msg.value.content.channel && filter.channel == msg.value.content.channel) {
                filterResults.push(true);
            } else {
                filterResults.push(false);
            }
        }

        if (filter.keywords.length > 0 && msg.value.content.type == "post" && msg.value.content.text) {
            let keywords = filter.keywords;
            let content = msg.value.content.text.toLowerCase();

            let res = keywords.map(k => content.includes(k.toLowerCase())).some(r => r);
            if (res) console.log("filtered due to keywords");
            filterResults.push(res);
        }

        console.log("res", !filterResults.some(n => n == true));
        return !filterResults.some(n => n == true)
    };

    /**
     * SSB
     *
     * TL;DR: SSB API for Patchfox using Hermiebox.
     *
     * OBJECTIVE:
     * The SSB is in flux right now. There are many approaches being played with which might
     * affect how this WebExtension connect to sbot. Some of the experiments being tried out are:
     *
     * - lessbot/nobot: each app maintain its own database and index but post through a shared sbot.
     * - graphql: export a GraphQL server which offers SSB features.
     * - json-rpc: export a JSON-RPC server offering SSB features.
     *
     * This driver folder will contain the various adapters to use these modes of connection as they
     * become available. For now, we'll use hermiebox.
     *
     * **Important: Each driver should export the exact same API to Patchfox**. This way we can
     * switch drivers without having to refactor the add-on.
     *
     * HOW IT WORKS:
     * Hermiebox is a browserified fat package of common NodeJS modules from our community and also
     * few highlevel API methods for common tasks. It uses WebSockets to connect to a running sbot
     * using muxrpc and shs stuff, so it needs your `secret` to be available.
     * 
     * ATTENTION:
     * This is a legacy from when Patchfox was vanilla JS. I'm gonna need to refactor this a lot
     * 
     * TODO: Refactor to use `ssb-query`
     */

    const pull = hermiebox.modules.pullStream;
    const sort = hermiebox.modules.ssbSort;

    let sbot = false;

    let avatarCache = {};

    class SSB {

      log(pMsg, pVal = "") {
        console.log(`[SSB API] - ${pMsg}`, pVal);
      }

      async connect(pKeys) {
        var server = await hermiebox.api.connect(pKeys);
        this.log("you are", server.id);
        this.feed = server.id;
        sbot = server;
      }

      filterLimit() {
        let limit = getPref("limit", 10);
        return pull.take(limit)
      }

      filterWithUserFilters() {
        return pull.filter(m => isMessageHidden(m))
      }

      filterTypes() {
        let knownMessageTypes = {
          "post": "showTypePost",
          "about": "showTypeAbout",
          "vote": "showTypeVote",
          "contact": "showTypeContact",
          "pub": "showTypePub",
          "blog": "showTypeBlog",
          "channel": "showTypeChannel"
        };

        let showUnknown = getPref("showTypeUnknown", false);

        if (showUnknown) {
          return pull.filter(() => true);
        }

        return pull.filter(msg => {
          let type = msg.value.content.type;

          if (typeof type == "string" && knownMessageTypes[type]) {
            return getPref(knownMessageTypes[type], true)
          }
          return getPref("showTypeUnknown", false)
        })
      }

      

      public(opts) {
        return new Promise((resolve, reject) => {

          opts = opts || {};
          opts.reverse = opts.reverse || true;

          console.log("opts", opts);

          pull(
            sbot.createFeedStream(opts),
            pull.filter(msg => msg && msg.value && msg.value.content),
            this.filterTypes(),
            this.filterWithUserFilters(),
            this.filterLimit(),
            pull.collect((err, msgs) => {
              console.log("msgs", msgs);
              if (err) {
                reject(err);
              }

              resolve(msgs);
            })
          );
        })
      }

      thread(id) {
        return new Promise((resolve, reject) => {
          sbot.get(id, (err, value) => {
            if (err) return cb(err)
            var rootMsg = { key: id, value: value };
            pull(
              sbot.backlinks && sbot.backlinks.read ? sbot.backlinks.read({
                query: [
                  {
                    $filter: {
                      dest: id,
                      value: {
                        content: {

                          root: id
                        }
                      }
                    }
                  }
                ]
              }) : pull(
                sbot.links({ dest: id, values: true, rel: 'root' }),
                pull.filter(function (msg) {
                  var c = msg && msg.value && msg.value.content;
                  return c && c.type === 'post' && c.root === id
                }),
                pull.unique('key')
              ),
              this.filterTypes(),
              this.filterWithUserFilters(),
              this.filterLimit(),
              pull.collect((err, msgs) => {
                if (err) reject(err);
                resolve(sort([rootMsg].concat(msgs)));
              })
            );
          });
        })
      }

      mentions(feed, lt) {
        return new Promise((resolve, reject) => {
          const createBacklinkStream = id => {
            var filterQuery = {
              $filter: {
                dest: id
              }
            };
        
            if (lt) {
              filterQuery.$filter.value = { timestamp: { $lt: lt } };
            }
        
            return sbot.backlinks.read({
              query: [filterQuery],
              index: "DTA", // use asserted timestamps
              reverse: true,
            });
          };

          pull(
            createBacklinkStream(sbot.id),
            this.filterTypes(),
            this.filterWithUserFilters(),
            this.filterLimit(),
            pull.collect((err, msgs) => {
              if (err) {
                reject(err);
              } else {
                resolve(msgs);
              }
            })
          );
        })
      }

      async profile(feedid) {
        try {
          var user = await hermiebox.api.profile(feedid);
          return user

        } catch (n) {
          console.error(n);
          return false
        }
      }

      async get(msgid) {
        var msg = await hermiebox.api.get(msgid);
        return msg
      }

      async setAvatarCache(feed, data) {
        let s = {};
        s[`avatar-${feed}`] = data;
        return browser.storage.local.set(s)
      }

      async getCachedAvatar(feed) {
        return browser.storage.local.get(`avatar-${feed}`)
      }

      async avatar(feed) {
        if (avatarCache[feed]) {
          return avatarCache[feed]
        }
        try {
          let avatar = await hermiebox.api.avatar(feed);
          // await this.setAvatarCache(feed, avatar)
          avatarCache[feed] = avatar;
          return avatar
        } catch (n) {
          throw n
        }

      }

      async blurbFromMsg(msgid, howManyChars) {
        let retVal = msgid;

        try {
          let data = await ssb.get(msgid);

          if (data.content.type == "post") {
            retVal = this.plainTextFromMarkdown(data.content.text.slice(0, howManyChars) + "...");
          }
          return retVal
        } catch (n) {
          return retVal
        }
      }
      plainTextFromMarkdown(text) {
        // TODO: this doesn't belong here
        let html = this.markdown(text);
        let div = document.createElement("div");
        div.innerHTML = html;
        return div.innerText
      }

      markdown(text) {

        function replaceMsgID(match, id, offset, string) {
          let eid = encodeURIComponent(`%${id}`);

          return `<a class="thread-link" href="?thread=${eid}#/thread`;
        }

        function replaceChannel(match, id, offset, string) {
          let eid = encodeURIComponent(id);

          return `<a class="channel-link" href="?channel=${eid}#/channel`;
        }


        function replaceFeedID(match, id, offset, string) {
          let eid = encodeURIComponent(`@${id}`);
          return "<a class=\"profile-link\" href=\"?feed=" + eid + "#/profile";
        }


        function replaceImageLinks(match, id, offset, string) {
          return "<a class=\"image-link\" target=\"_blank\" href=\"http://localhost:8989/blobs/get/&" + encodeURIComponent(id);
        }


        function replaceImages(match, id, offset, string) {
          return "<img class=\"is-image-from-blob\" src=\"http://localhost:8989/blobs/get/&" + encodeURIComponent(id);
        }

        let html = hermiebox.modules.ssbMarkdown.block(text);
        html = html
          .replace(/<pre>/gi, "<pre class=\"code\">")
          .replace(/<a href="#([^"]*)/gi, replaceChannel)
          .replace(/<a href="@([^"]*)/gi, replaceFeedID)
          .replace(/target="_blank"/gi, "")
          .replace(/<a href="%([^"]*)/gi, replaceMsgID)
          .replace(/<img src="&([^"]*)/gi, replaceImages)
          .replace(/<a href="&([^"]*)/gi, replaceImageLinks);

        return html
      }

      ref() {
        return hermiebox.modules.ssbRef
      }

      getTimestamp(msg) {
        const arrivalTimestamp = msg.timestamp;
        const declaredTimestamp = msg.value.timestamp;
        return Math.min(arrivalTimestamp, declaredTimestamp);
      }

      getRootMsgId(msg) {
        if (msg && msg.value && msg.value.content) {
          const root = msg.value.content.root;
          if (hermiebox.modules.ssbRef.isMsgId(root)) {
            return root;
          }
        }
      }

      newPost(data) {
        return new Promise((resolve, reject) => {
          let msgToPost = { type: "post", text: data.text };

          const commonFields = [
            "root",
            "branch",
            "channel",
            "fork",
            "contentWarning"
          ];

          commonFields.forEach(f => {
            if (typeof data[f] !== "undefined") {
              msgToPost[f] = data[f];
            }
          });

          msgToPost.mentions = hermiebox.modules.ssbMentions(msgToPost.text) || [];
          msgToPost.mentions = msgToPost.mentions.filter(n => n); // prevent null elements...

          const sbot = hermiebox.sbot || false;

          console.log("post", msgToPost);

          if (sbot) {
            sbot.publish(msgToPost, function (err, msg) {
              if (err) {
                reject(err);
              } else {
                resolve(msg);
              }
            });
          } else {
            reject("There is no sbot connection");
          }
        })
      }

      follow(userId) {
        return new Promise((resolve, reject) => {
          const sbot = hermiebox.sbot || false;

          if (sbot) {
            sbot.publish({
              type: "contact",
              contact: userId,
              following: true
            }, (err, msg) => {
              // 'msg' includes the hash-id and headers
              if (err) {
                reject(err);
              } else {
                resolve(msg);
              }
            });
          }
        })
      }


      getBlob(blobid) {
        return hermiebox.api.getBlob(blobid)
      }

      votes(msgid) {
        return new Promise((resolve, reject) => {
          let pull = hermiebox.modules.pullStream;
          let sbot = hermiebox.sbot;

          if (sbot) {
            pull(
              sbot.links({ dest: msgid, rel: "vote", values: true }),
              pull.collect((err, msgs) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(msgs);
                }
              })
            );
          }
        })
      }

      like(msgid) {
        return new Promise((resolve, reject) => {

          const sbot = hermiebox.sbot || false;

          const msgToPost = {
            "type": "vote",
            "vote": {
              "link": msgid,
              "value": 1,
              "expression": "Like"
            }
          };

          if (sbot) {
            sbot.publish(msgToPost, function (err, msg) {
              if (err) {
                reject(err);
              } else {
                resolve(msg);
              }
            });
          }
        })
      }

      unlike(msgid) {
        return new Promise((resolve, reject) => {
          const sbot = hermiebox.sbot || false;

          const msgToPost = {
            "type": "vote",
            "vote": {
              "link": msgid,
              "value": 0,
              "expression": "Unlike"
            }
          };

          if (sbot) {
            sbot.publish(msgToPost, function (err, msg) {
              if (err) {
                reject(err);
              } else {
                resolve(msg);
              }
            });
          }
        })
      }

      channels() {
        return new Promise((resolve, reject) => {
          let pull = hermiebox.modules.pullStream;
          let sbot = hermiebox.sbot || false;

          if (sbot) {
            console.log("querying channels");
            pull(
              sbot.query.read({
                query: [
                  { "$filter": { "value": { "content": { "channel": { "$is": "string" }, "type": "post" } } } },
                  {
                    "$reduce": {
                      "channel": ["value", "content", "channel"],
                      "count": { "$count": true },
                      "timestamp": { "$max": ["value", "timestamp"] }
                    }
                  },
                  { "$sort": [["timestamp"], ["count"]] }
                ],
                limit: 20
              }),
              pull.collect(function (err, data) {
                console.log("channels", data);
                if (err) {
                  reject(err);
                } else {
                  resolve(data);
                }
              })
            );
          } else {
            reject("no sbot");
          }
        })
      }

      channel(channel, opts) {
        return new Promise((resolve, reject) => {
          let pull = hermiebox.modules.pullStream;
          let sbot = hermiebox.sbot || false;
          let query = {
            "$filter": {
              value: {
                content: { channel }
              }
            }
          };

          if (opts.lt) {
            query.$filter.value.timestamp = { $lt: opts.lt };
          }

          if (sbot) {
            pull(
              sbot.query.read({
                query: [
                  query
                ],
                reverse: true
              }),
              this.filterTypes(),
              this.filterWithUserFilters(),
              this.filterLimit(),
              pull.collect(function (err, data) {
                if (err) {
                  reject(err);
                } else {
                  resolve(data);
                }
              })
            );
          } else {
            reject("no sbot");
          }
        })
      }

      channelSubscribe(channel) {
        return new Promise((resolve, reject) => {
          const sbot = hermiebox.sbot || false;

          const msgToPost = {
            "type": "channel",
            "channel": channel,
            "subscribed": true
          };

          if (sbot) {
            sbot.publish(msgToPost, function (err, msg) {
              if (err) {
                reject(err);
              } else {
                resolve(msg);
              }
            });
          }
        })
      }

      channelUnsubscribe(channel) {
        return new Promise((resolve, reject) => {
          const sbot = hermiebox.sbot || false;

          const msgToPost = {
            "type": "channel",
            "channel": channel,
            "subscribed": false
          };

          if (sbot) {
            sbot.publish(msgToPost, function (err, msg) {
              if (err) {
                reject(err);
              } else {
                resolve(msg);
              }
            });
          }
        })
      }

      channelSubscribed(channel, feed) {
        return new Promise((resolve, reject) => {
          let pull = hermiebox.modules.pullStream;
          let sbot = hermiebox.sbot || false;

          if (sbot) {
            if (!feed) {
              feed = sbot.id;
            }

            let query = {
              "$filter": {
                value: {
                  author: feed,
                  content: {
                    type: "channel",
                    channel
                  }
                }
              }
            };


            pull(
              sbot.query.read({
                query: [
                  query
                ],
                reverse: true
              }),
              pull.collect(function (err, data) {
                if (err) {
                  reject(err);
                } else {
                  if (data.length > 0) {
                    resolve(data[0].value.content.subscribed || false);
                  } else {
                    resolve(false);
                  }
                }
              })
            );
          } else {
            reject("no sbot");
          }
        })
      }

      subscribedChannels(channel, feed) {
        return new Promise((resolve, reject) => {
          let pull = hermiebox.modules.pullStream;
          let sbot = hermiebox.sbot || false;

          if (sbot) {
            if (!feed) {
              feed = sbot.id;
            }

            let query = {
              "$filter": {
                value: {
                  author: feed,
                  content: {
                    type: "channel"
                  }
                }
              },
              "$map": {
                channel: ["value", "content", "channel"],
                subscribed: ["value", "content", "subscribed"]
              },
              "$sort": [["value", "timestamp"]]
            };


            pull(
              sbot.query.read({
                query: [
                  query
                ],
                reverse: true
              }),
              pull.collect(function (err, data) {
                if (err) {
                  reject(err);
                } else {
                  resolve(data);
                }
              })
            );
          } else {
            reject("no sbot");
          }
        })
      }

      follow(feed) {
        return new Promise((resolve, reject) => {
          const sbot = hermiebox.sbot || false;

          const msgToPost = {
            "type": "contact",
            "contact": feed,
            "following": true
          };

          if (sbot) {
            sbot.publish(msgToPost, function (err, msg) {
              if (err) {
                reject(err);
              } else {
                resolve(msg);
              }
            });
          }
        })
      }

      unfollow(feed) {
        return new Promise((resolve, reject) => {
          const sbot = hermiebox.sbot || false;

          const msgToPost = {
            "type": "contact",
            "contact": feed,
            "following": false
          };

          if (sbot) {
            sbot.publish(msgToPost, function (err, msg) {
              if (err) {
                reject(err);
              } else {
                resolve(msg);
              }
            });
          }
        })
      }

      block(feed) {
        return new Promise((resolve, reject) => {
          const sbot = hermiebox.sbot || false;

          const msgToPost = {
            "type": "contact",
            "contact": feed,
            "blocking": true
          };

          if (sbot) {
            sbot.publish(msgToPost, function (err, msg) {
              if (err) {
                reject(err);
              } else {
                resolve(msg);
              }
            });
          }
        })
      }

      unblock(feed) {
        return new Promise((resolve, reject) => {
          const sbot = hermiebox.sbot || false;

          const msgToPost = {
            "type": "contact",
            "contact": feed,
            "blocking": false
          };

          if (sbot) {
            sbot.publish(msgToPost, function (err, msg) {
              if (err) {
                reject(err);
              } else {
                resolve(msg);
              }
            });
          }
        })
      }

      following(feed, byWhom) {
        return new Promise((resolve, reject) => {
          let pull = hermiebox.modules.pullStream;
          let sbot = hermiebox.sbot || false;

          if (sbot) {
            if (!byWhom) {
              byWhom = sbot.id;
            }

            let query = {
              "$filter": {
                value: {
                  author: byWhom,
                  content: {
                    type: "contact",
                    contact: feed,
                    following: { $is: "boolean" }
                  }
                }
              }
            };


            pull(
              sbot.query.read({
                query: [
                  query
                ],
                reverse: true
              }),
              pull.collect(function (err, data) {
                if (err) {
                  reject(err);
                } else {
                  if (data.length > 0) {
                    resolve(data[0].value.content.following || false);
                  } else {
                    resolve(false);
                  }
                }
              })
            );
          } else {
            reject("no sbot");
          }
        })
      }

      blocking(feed, byWhom) {
        return new Promise((resolve, reject) => {
          let pull = hermiebox.modules.pullStream;
          let sbot = hermiebox.sbot || false;

          if (sbot) {
            if (!byWhom) {
              byWhom = sbot.id;
            }

            let query = {
              "$filter": {
                value: {
                  author: byWhom,
                  content: {
                    type: "contact",
                    contact: feed,
                    blocking: { $is: "boolean" }
                  }
                }
              }
            };


            pull(
              sbot.query.read({
                query: [
                  query
                ],
                reverse: true
              }),
              pull.collect(function (err, data) {
                if (err) {
                  reject(err);
                } else {
                  if (data.length > 0) {
                    resolve(data[0].value.content.blocking || false);
                  } else {
                    resolve(false);
                  }
                }
              })
            );
          } else {
            reject("no sbot");
          }
        })
      }

      query(filter, reverse, map, reduce) {
        return new Promise((resolve, reject) => {
          if (sbot) {

            let query = {
              "$filter": filter
            };

            if (map) {
              query.$map = map;
            }

            if (reduce) {
              query.$reduce = reduce;
            }

            if (typeof reverse == "undefined") {
              reverse = true;
            }

            pull(
              sbot.query.read({
                query: [
                  query
                ],
                reverse: reverse
              }),
              this.filterTypes(),
              this.filterLimit(),
              pull.collect( (err, data) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(data);
                }
              })
            );
          } else {
            reject("no sbot");
          }
        })
      }
    }

    var strictUriEncode = str => encodeURIComponent(str).replace(/[!'()*]/g, x => `%${x.charCodeAt(0).toString(16).toUpperCase()}`);

    var token = '%[a-f0-9]{2}';
    var singleMatcher = new RegExp(token, 'gi');
    var multiMatcher = new RegExp('(' + token + ')+', 'gi');

    function decodeComponents(components, split) {
    	try {
    		// Try to decode the entire string first
    		return decodeURIComponent(components.join(''));
    	} catch (err) {
    		// Do nothing
    	}

    	if (components.length === 1) {
    		return components;
    	}

    	split = split || 1;

    	// Split the array in 2 parts
    	var left = components.slice(0, split);
    	var right = components.slice(split);

    	return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
    }

    function decode(input) {
    	try {
    		return decodeURIComponent(input);
    	} catch (err) {
    		var tokens = input.match(singleMatcher);

    		for (var i = 1; i < tokens.length; i++) {
    			input = decodeComponents(tokens, i).join('');

    			tokens = input.match(singleMatcher);
    		}

    		return input;
    	}
    }

    function customDecodeURIComponent(input) {
    	// Keep track of all the replacements and prefill the map with the `BOM`
    	var replaceMap = {
    		'%FE%FF': '\uFFFD\uFFFD',
    		'%FF%FE': '\uFFFD\uFFFD'
    	};

    	var match = multiMatcher.exec(input);
    	while (match) {
    		try {
    			// Decode as big chunks as possible
    			replaceMap[match[0]] = decodeURIComponent(match[0]);
    		} catch (err) {
    			var result = decode(match[0]);

    			if (result !== match[0]) {
    				replaceMap[match[0]] = result;
    			}
    		}

    		match = multiMatcher.exec(input);
    	}

    	// Add `%C2` at the end of the map to make sure it does not replace the combinator before everything else
    	replaceMap['%C2'] = '\uFFFD';

    	var entries = Object.keys(replaceMap);

    	for (var i = 0; i < entries.length; i++) {
    		// Replace all decoded components
    		var key = entries[i];
    		input = input.replace(new RegExp(key, 'g'), replaceMap[key]);
    	}

    	return input;
    }

    var decodeUriComponent = function (encodedURI) {
    	if (typeof encodedURI !== 'string') {
    		throw new TypeError('Expected `encodedURI` to be of type `string`, got `' + typeof encodedURI + '`');
    	}

    	try {
    		encodedURI = encodedURI.replace(/\+/g, ' ');

    		// Try the built in decoder first
    		return decodeURIComponent(encodedURI);
    	} catch (err) {
    		// Fallback to a more advanced decoder
    		return customDecodeURIComponent(encodedURI);
    	}
    };

    var splitOnFirst = (string, separator) => {
    	if (!(typeof string === 'string' && typeof separator === 'string')) {
    		throw new TypeError('Expected the arguments to be of type `string`');
    	}

    	if (separator === '') {
    		return [string];
    	}

    	const separatorIndex = string.indexOf(separator);

    	if (separatorIndex === -1) {
    		return [string];
    	}

    	return [
    		string.slice(0, separatorIndex),
    		string.slice(separatorIndex + separator.length)
    	];
    };

    function encoderForArrayFormat(options) {
    	switch (options.arrayFormat) {
    		case 'index':
    			return key => (result, value) => {
    				const index = result.length;
    				if (value === undefined) {
    					return result;
    				}

    				if (value === null) {
    					return [...result, [encode(key, options), '[', index, ']'].join('')];
    				}

    				return [
    					...result,
    					[encode(key, options), '[', encode(index, options), ']=', encode(value, options)].join('')
    				];
    			};

    		case 'bracket':
    			return key => (result, value) => {
    				if (value === undefined) {
    					return result;
    				}

    				if (value === null) {
    					return [...result, [encode(key, options), '[]'].join('')];
    				}

    				return [...result, [encode(key, options), '[]=', encode(value, options)].join('')];
    			};

    		case 'comma':
    			return key => (result, value, index) => {
    				if (value === null || value === undefined || value.length === 0) {
    					return result;
    				}

    				if (index === 0) {
    					return [[encode(key, options), '=', encode(value, options)].join('')];
    				}

    				return [[result, encode(value, options)].join(',')];
    			};

    		default:
    			return key => (result, value) => {
    				if (value === undefined) {
    					return result;
    				}

    				if (value === null) {
    					return [...result, encode(key, options)];
    				}

    				return [...result, [encode(key, options), '=', encode(value, options)].join('')];
    			};
    	}
    }

    function parserForArrayFormat(options) {
    	let result;

    	switch (options.arrayFormat) {
    		case 'index':
    			return (key, value, accumulator) => {
    				result = /\[(\d*)\]$/.exec(key);

    				key = key.replace(/\[\d*\]$/, '');

    				if (!result) {
    					accumulator[key] = value;
    					return;
    				}

    				if (accumulator[key] === undefined) {
    					accumulator[key] = {};
    				}

    				accumulator[key][result[1]] = value;
    			};

    		case 'bracket':
    			return (key, value, accumulator) => {
    				result = /(\[\])$/.exec(key);
    				key = key.replace(/\[\]$/, '');

    				if (!result) {
    					accumulator[key] = value;
    					return;
    				}

    				if (accumulator[key] === undefined) {
    					accumulator[key] = [value];
    					return;
    				}

    				accumulator[key] = [].concat(accumulator[key], value);
    			};

    		case 'comma':
    			return (key, value, accumulator) => {
    				const isArray = typeof value === 'string' && value.split('').indexOf(',') > -1;
    				const newValue = isArray ? value.split(',') : value;
    				accumulator[key] = newValue;
    			};

    		default:
    			return (key, value, accumulator) => {
    				if (accumulator[key] === undefined) {
    					accumulator[key] = value;
    					return;
    				}

    				accumulator[key] = [].concat(accumulator[key], value);
    			};
    	}
    }

    function encode(value, options) {
    	if (options.encode) {
    		return options.strict ? strictUriEncode(value) : encodeURIComponent(value);
    	}

    	return value;
    }

    function decode$1(value, options) {
    	if (options.decode) {
    		return decodeUriComponent(value);
    	}

    	return value;
    }

    function keysSorter(input) {
    	if (Array.isArray(input)) {
    		return input.sort();
    	}

    	if (typeof input === 'object') {
    		return keysSorter(Object.keys(input))
    			.sort((a, b) => Number(a) - Number(b))
    			.map(key => input[key]);
    	}

    	return input;
    }

    function removeHash(input) {
    	const hashStart = input.indexOf('#');
    	if (hashStart !== -1) {
    		input = input.slice(0, hashStart);
    	}

    	return input;
    }

    function extract(input) {
    	input = removeHash(input);
    	const queryStart = input.indexOf('?');
    	if (queryStart === -1) {
    		return '';
    	}

    	return input.slice(queryStart + 1);
    }

    function parse(input, options) {
    	options = Object.assign({
    		decode: true,
    		arrayFormat: 'none'
    	}, options);

    	const formatter = parserForArrayFormat(options);

    	// Create an object with no prototype
    	const ret = Object.create(null);

    	if (typeof input !== 'string') {
    		return ret;
    	}

    	input = input.trim().replace(/^[?#&]/, '');

    	if (!input) {
    		return ret;
    	}

    	for (const param of input.split('&')) {
    		let [key, value] = splitOnFirst(param.replace(/\+/g, ' '), '=');

    		// Missing `=` should be `null`:
    		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
    		value = value === undefined ? null : decode$1(value, options);

    		formatter(decode$1(key, options), value, ret);
    	}

    	return Object.keys(ret).sort().reduce((result, key) => {
    		const value = ret[key];
    		if (Boolean(value) && typeof value === 'object' && !Array.isArray(value)) {
    			// Sort object keys, not values
    			result[key] = keysSorter(value);
    		} else {
    			result[key] = value;
    		}

    		return result;
    	}, Object.create(null));
    }

    var extract_1 = extract;
    var parse_1 = parse;

    var stringify = (object, options) => {
    	if (!object) {
    		return '';
    	}

    	options = Object.assign({
    		encode: true,
    		strict: true,
    		arrayFormat: 'none'
    	}, options);

    	const formatter = encoderForArrayFormat(options);
    	const keys = Object.keys(object);

    	if (options.sort !== false) {
    		keys.sort(options.sort);
    	}

    	return keys.map(key => {
    		const value = object[key];

    		if (value === undefined) {
    			return '';
    		}

    		if (value === null) {
    			return encode(key, options);
    		}

    		if (Array.isArray(value)) {
    			return value
    				.reduce(formatter(key), [])
    				.join('&');
    		}

    		return encode(key, options) + '=' + encode(value, options);
    	}).filter(x => x.length > 0).join('&');
    };

    var parseUrl = (input, options) => {
    	return {
    		url: removeHash(input).split('?')[0] || '',
    		query: parse(extract(input), options)
    	};
    };

    var queryString = {
    	extract: extract_1,
    	parse: parse_1,
    	stringify: stringify,
    	parseUrl: parseUrl
    };

    /* src\messageTypes\PostMsg.svelte generated by Svelte v3.4.4 */

    const file = "src\\messageTypes\\PostMsg.svelte";

    function add_css() {
    	var style = element("style");
    	style.id = 'svelte-1ftdgav-style';
    	style.textContent = ".card-body.svelte-1ftdgav{overflow-wrap:break-word}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUG9zdE1zZy5zdmVsdGUiLCJzb3VyY2VzIjpbIlBvc3RNc2cuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XHJcbiAgaW1wb3J0IHsgbmF2aWdhdGUgfSBmcm9tIFwiLi4vdXRpbHMuanNcIjtcclxuXHJcbiAgZXhwb3J0IGxldCBtc2c7XHJcblxyXG4gIGxldCBjb250ZW50ID0gc3NiLm1hcmtkb3duKG1zZy52YWx1ZS5jb250ZW50LnRleHQpO1xyXG4gIGxldCBsaWtlZCA9IGZhbHNlO1xyXG4gIGxldCBoYXNDb250ZW50V2FybmluZyA9IG1zZy52YWx1ZS5jb250ZW50LmNvbnRlbnRXYXJuaW5nIHx8IGZhbHNlO1xyXG4gIGxldCBzaG93Q29udGVudFdhcm5pbmcgPSB0cnVlO1xyXG5cclxuICBzc2Iudm90ZXMobXNnLmtleSkudGhlbihtcyA9PiB7XHJcbiAgICBtcy5mb3JFYWNoKG0gPT4ge1xyXG4gICAgICBsZXQgYXV0aG9yID0gbS52YWx1ZS5hdXRob3I7XHJcbiAgICAgIGlmIChhdXRob3IgPT09IHNzYi5mZWVkICYmIG0udmFsdWUuY29udGVudC52b3RlLnZhbHVlID09PSAxKSB7XHJcbiAgICAgICAgbGlrZWQgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgY29uc3QgbGlrZUNoYW5nZWQgPSBldiA9PiB7XHJcbiAgICBsZXQgdiA9IGV2LnRhcmdldC5jaGVja2VkO1xyXG4gICAgaWYgKHYpIHtcclxuICAgICAgc3NiXHJcbiAgICAgICAgLmxpa2UobXNnLmtleSlcclxuICAgICAgICAudGhlbigoKSA9PiBjb25zb2xlLmxvZyhcImxpa2VkXCIsIG1zZy5rZXkpKVxyXG4gICAgICAgIC5jYXRjaCgoKSA9PiAobGlrZWQgPSBmYWxzZSkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc3NiXHJcbiAgICAgICAgLnVubGlrZShtc2cua2V5KVxyXG4gICAgICAgIC50aGVuKCgpID0+IGNvbnNvbGUubG9nKFwidW5saWtlZFwiLCBtc2cua2V5KSlcclxuICAgICAgICAuY2F0Y2goKCkgPT4gKGxpa2VkID0gdHJ1ZSkpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IHJlcGx5ID0gZXYgPT4ge1xyXG4gICAgbGV0IHJvb3QgPSBtc2cudmFsdWUuY29udGVudC5yb290IHx8IG1zZy5rZXk7XHJcbiAgICBsZXQgY2hhbm5lbCA9IG1zZy52YWx1ZS5jb250ZW50LmNoYW5uZWw7XHJcbiAgICBsZXQgcmVwbHlmZWVkID0gbXNnLnZhbHVlLmF1dGhvcjtcclxuICAgIG5hdmlnYXRlKFwiL2NvbXBvc2VcIiwgeyByb290LCBicmFuY2g6IG1zZy5rZXksIGNoYW5uZWwsIHJlcGx5ZmVlZCB9KTtcclxuICB9O1xyXG5cclxuICBjb25zdCBmb3JrID0gZXYgPT4ge1xyXG4gICAgbGV0IG9yaWdpbmFsUm9vdCA9IG1zZy52YWx1ZS5jb250ZW50LnJvb3QgfHwgbXNnLmtleTtcclxuICAgIGxldCBjaGFubmVsID0gbXNnLnZhbHVlLmNvbnRlbnQuY2hhbm5lbDtcclxuICAgIGxldCByZXBseWZlZWQgPSBtc2cudmFsdWUuYXV0aG9yO1xyXG4gICAgbmF2aWdhdGUoXCIvY29tcG9zZVwiLCB7XHJcbiAgICAgIHJvb3Q6IG1zZy5rZXksXHJcbiAgICAgIGJyYW5jaDogbXNnLmtleSxcclxuICAgICAgZm9yazogb3JpZ2luYWxSb290LFxyXG4gICAgICBjaGFubmVsLFxyXG4gICAgICByZXBseWZlZWRcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IGdvUm9vdCA9IGV2ID0+IHtcclxuICAgIGxldCByb290SWQgPSBtc2cudmFsdWUuY29udGVudC5yb290IHx8IG1zZy5rZXk7XHJcbiAgICBuYXZpZ2F0ZShcIi90aHJlYWRcIiwgeyB0aHJlYWQ6IHJvb3RJZCB9KTtcclxuICB9O1xyXG5cclxuICBjb25zdCBnb0JyYW5jaCA9IGV2ID0+IHtcclxuICAgIGxldCBicmFuY2hJZCA9IG1zZy52YWx1ZS5jb250ZW50LmJyYW5jaCB8fCBtc2cua2V5O1xyXG4gICAgbmF2aWdhdGUoXCIvdGhyZWFkXCIsIHsgdGhyZWFkOiBicmFuY2hJZCB9KTtcclxuICB9O1xyXG48L3NjcmlwdD5cclxuXHJcbjxzdHlsZT5cclxuICBkaXYgaW1nLmlzLWltYWdlLWZyb20tYmxvYiB7XHJcbiAgICBtYXgtd2lkdGg6IDkwJTtcclxuICB9XHJcblxyXG4gIC5jYXJkLWJvZHkge1xyXG4gICAgb3ZlcmZsb3ctd3JhcDogYnJlYWstd29yZDtcclxuICB9XHJcbjwvc3R5bGU+XHJcblxyXG48ZGl2IGNsYXNzPVwiY2FyZC1ib2R5XCI+XHJcbiAgeyNpZiBoYXNDb250ZW50V2FybmluZyAmJiBzaG93Q29udGVudFdhcm5pbmd9XHJcbiAgICA8cD57bXNnLnZhbHVlLmNvbnRlbnQuY29udGVudFdhcm5pbmd9PC9wPlxyXG4gICAgPGJ1dHRvblxyXG4gICAgICBjbGFzcz1cImJ0blwiXHJcbiAgICAgIG9uOmNsaWNrPXsoKSA9PiAoc2hvd0NvbnRlbnRXYXJuaW5nID0gIXNob3dDb250ZW50V2FybmluZyl9PlxyXG4gICAgICBTaG93IE1lc3NhZ2VcclxuICAgIDwvYnV0dG9uPlxyXG4gIHs6ZWxzZX1cclxuICAgIHtAaHRtbCBjb250ZW50fVxyXG4gIHsvaWZ9XHJcbjwvZGl2PlxyXG48ZGl2IGNsYXNzPVwiY2FyZC1mb290ZXJcIj5cclxuICA8ZGl2IGNsYXNzPVwiY29sdW1ucyBjb2wtZ2FwbGVzc1wiPlxyXG4gICAgPGRpdiBjbGFzcz1cImNvbHVtbiBjb2wtNlwiPlxyXG4gICAgICA8bGFiZWwgY2xhc3M9XCJmb3JtLXN3aXRjaCBkLWlubGluZVwiPlxyXG4gICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBvbjpjaGFuZ2U9e2xpa2VDaGFuZ2VkfSBjaGVja2VkPXtsaWtlZH0gLz5cclxuICAgICAgICA8aSBjbGFzcz1cImZvcm0taWNvblwiIC8+XHJcbiAgICAgICAgTGlrZVxyXG4gICAgICA8L2xhYmVsPlxyXG4gICAgICB7I2lmIG1zZy52YWx1ZS5jb250ZW50LnJvb3R9XHJcbiAgICAgICAgPHNwYW4+XHJcbiAgICAgICAgICA8YVxyXG4gICAgICAgICAgICBocmVmPVwiP3RocmVhZD17ZW5jb2RlVVJJQ29tcG9uZW50KG1zZy52YWx1ZS5jb250ZW50LnJvb3QpfSMvdGhyZWFkXCJcclxuICAgICAgICAgICAgb246Y2xpY2t8cHJldmVudERlZmF1bHQ9e2dvUm9vdH0+XHJcbiAgICAgICAgICAgIChyb290KVxyXG4gICAgICAgICAgPC9hPlxyXG4gICAgICAgIDwvc3Bhbj5cclxuICAgICAgey9pZn1cclxuICAgICAgeyNpZiBtc2cudmFsdWUuY29udGVudC5icmFuY2h9XHJcbiAgICAgICAgPHNwYW4+XHJcbiAgICAgICAgICA8YVxyXG4gICAgICAgICAgICBocmVmPVwiP3RocmVhZD17ZW5jb2RlVVJJQ29tcG9uZW50KG1zZy52YWx1ZS5jb250ZW50LmJyYW5jaCl9Iy90aHJlYWRcIlxyXG4gICAgICAgICAgICBvbjpjbGlja3xwcmV2ZW50RGVmYXVsdD17Z29CcmFuY2h9PlxyXG4gICAgICAgICAgICAoaW4gcmVwbHkgdG8pXHJcbiAgICAgICAgICA8L2E+XHJcbiAgICAgICAgPC9zcGFuPlxyXG4gICAgICB7L2lmfVxyXG4gICAgPC9kaXY+XHJcblxyXG4gICAgeyNpZiAhbXNnLnZhbHVlLnByaXZhdGV9XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJjb2x1bW4gY29sLTYgdGV4dC1yaWdodFwiPlxyXG4gICAgICAgIDxidXR0b24gY2xhc3M9XCJidG5cIiBvbjpjbGljaz17Zm9ya30+Rm9yazwvYnV0dG9uPlxyXG5cclxuICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuXCIgb246Y2xpY2s9e3JlcGx5fT5SZXBseTwvYnV0dG9uPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIHsvaWZ9XHJcbiAgPC9kaXY+XHJcblxyXG48L2Rpdj5cclxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQXNFRSxVQUFVLGVBQUMsQ0FBQyxBQUNWLGFBQWEsQ0FBRSxVQUFVLEFBQzNCLENBQUMifQ== */";
    	append(document.head, style);
    }

    // (84:2) {:else}
    function create_else_block(ctx) {
    	var raw_before, raw_after;

    	return {
    		c: function create() {
    			raw_before = element('noscript');
    			raw_after = element('noscript');
    		},

    		m: function mount(target, anchor) {
    			insert(target, raw_before, anchor);
    			raw_before.insertAdjacentHTML("afterend", ctx.content);
    			insert(target, raw_after, anchor);
    		},

    		p: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_between(raw_before, raw_after);
    				detach(raw_before);
    				detach(raw_after);
    			}
    		}
    	};
    }

    // (77:2) {#if hasContentWarning && showContentWarning}
    function create_if_block_3(ctx) {
    	var p, t0_value = ctx.msg.value.content.contentWarning, t0, t1, button, dispose;

    	return {
    		c: function create() {
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			button = element("button");
    			button.textContent = "Show Message";
    			add_location(p, file, 77, 4, 1895);
    			button.className = "btn";
    			add_location(button, file, 78, 4, 1942);
    			dispose = listen(button, "click", ctx.click_handler);
    		},

    		m: function mount(target, anchor) {
    			insert(target, p, anchor);
    			append(p, t0);
    			insert(target, t1, anchor);
    			insert(target, button, anchor);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.msg) && t0_value !== (t0_value = ctx.msg.value.content.contentWarning)) {
    				set_data(t0, t0_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(p);
    				detach(t1);
    				detach(button);
    			}

    			dispose();
    		}
    	};
    }

    // (96:6) {#if msg.value.content.root}
    function create_if_block_2(ctx) {
    	var span, a, t, a_href_value, dispose;

    	return {
    		c: function create() {
    			span = element("span");
    			a = element("a");
    			t = text("(root)");
    			a.href = a_href_value = "?thread=" + encodeURIComponent(ctx.msg.value.content.root) + "#/thread";
    			add_location(a, file, 97, 10, 2462);
    			add_location(span, file, 96, 8, 2444);
    			dispose = listen(a, "click", prevent_default(ctx.goRoot));
    		},

    		m: function mount(target, anchor) {
    			insert(target, span, anchor);
    			append(span, a);
    			append(a, t);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.msg) && a_href_value !== (a_href_value = "?thread=" + encodeURIComponent(ctx.msg.value.content.root) + "#/thread")) {
    				a.href = a_href_value;
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(span);
    			}

    			dispose();
    		}
    	};
    }

    // (105:6) {#if msg.value.content.branch}
    function create_if_block_1(ctx) {
    	var span, a, t, a_href_value, dispose;

    	return {
    		c: function create() {
    			span = element("span");
    			a = element("a");
    			t = text("(in reply to)");
    			a.href = a_href_value = "?thread=" + encodeURIComponent(ctx.msg.value.content.branch) + "#/thread";
    			add_location(a, file, 106, 10, 2724);
    			add_location(span, file, 105, 8, 2706);
    			dispose = listen(a, "click", prevent_default(ctx.goBranch));
    		},

    		m: function mount(target, anchor) {
    			insert(target, span, anchor);
    			append(span, a);
    			append(a, t);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.msg) && a_href_value !== (a_href_value = "?thread=" + encodeURIComponent(ctx.msg.value.content.branch) + "#/thread")) {
    				a.href = a_href_value;
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(span);
    			}

    			dispose();
    		}
    	};
    }

    // (116:4) {#if !msg.value.private}
    function create_if_block(ctx) {
    	var div, button0, t_1, button1, dispose;

    	return {
    		c: function create() {
    			div = element("div");
    			button0 = element("button");
    			button0.textContent = "Fork";
    			t_1 = space();
    			button1 = element("button");
    			button1.textContent = "Reply";
    			button0.className = "btn";
    			add_location(button0, file, 117, 8, 3030);
    			button1.className = "btn";
    			add_location(button1, file, 119, 8, 3091);
    			div.className = "column col-6 text-right";
    			add_location(div, file, 116, 6, 2983);

    			dispose = [
    				listen(button0, "click", ctx.fork),
    				listen(button1, "click", ctx.reply)
    			];
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			append(div, button0);
    			append(div, t_1);
    			append(div, button1);
    		},

    		p: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			run_all(dispose);
    		}
    	};
    }

    function create_fragment(ctx) {
    	var div0, t0, div3, div2, div1, label, input, t1, i, t2, t3, t4, t5, dispose;

    	function select_block_type(ctx) {
    		if (ctx.hasContentWarning && ctx.showContentWarning) return create_if_block_3;
    		return create_else_block;
    	}

    	var current_block_type = select_block_type(ctx);
    	var if_block0 = current_block_type(ctx);

    	var if_block1 = (ctx.msg.value.content.root) && create_if_block_2(ctx);

    	var if_block2 = (ctx.msg.value.content.branch) && create_if_block_1(ctx);

    	var if_block3 = (!ctx.msg.value.private) && create_if_block(ctx);

    	return {
    		c: function create() {
    			div0 = element("div");
    			if_block0.c();
    			t0 = space();
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			label = element("label");
    			input = element("input");
    			t1 = space();
    			i = element("i");
    			t2 = text("\r\n        Like");
    			t3 = space();
    			if (if_block1) if_block1.c();
    			t4 = space();
    			if (if_block2) if_block2.c();
    			t5 = space();
    			if (if_block3) if_block3.c();
    			div0.className = "card-body svelte-1ftdgav";
    			add_location(div0, file, 75, 0, 1817);
    			attr(input, "type", "checkbox");
    			input.checked = ctx.liked;
    			add_location(input, file, 91, 8, 2270);
    			i.className = "form-icon";
    			add_location(i, file, 92, 8, 2345);
    			label.className = "form-switch d-inline";
    			add_location(label, file, 90, 6, 2224);
    			div1.className = "column col-6";
    			add_location(div1, file, 89, 4, 2190);
    			div2.className = "columns col-gapless";
    			add_location(div2, file, 88, 2, 2151);
    			div3.className = "card-footer";
    			add_location(div3, file, 87, 0, 2122);
    			dispose = listen(input, "change", ctx.likeChanged);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div0, anchor);
    			if_block0.m(div0, null);
    			insert(target, t0, anchor);
    			insert(target, div3, anchor);
    			append(div3, div2);
    			append(div2, div1);
    			append(div1, label);
    			append(label, input);
    			append(label, t1);
    			append(label, i);
    			append(label, t2);
    			append(div1, t3);
    			if (if_block1) if_block1.m(div1, null);
    			append(div1, t4);
    			if (if_block2) if_block2.m(div1, null);
    			append(div2, t5);
    			if (if_block3) if_block3.m(div2, null);
    		},

    		p: function update(changed, ctx) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(changed, ctx);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);
    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div0, null);
    				}
    			}

    			if (changed.liked) {
    				input.checked = ctx.liked;
    			}

    			if (ctx.msg.value.content.root) {
    				if (if_block1) {
    					if_block1.p(changed, ctx);
    				} else {
    					if_block1 = create_if_block_2(ctx);
    					if_block1.c();
    					if_block1.m(div1, t4);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (ctx.msg.value.content.branch) {
    				if (if_block2) {
    					if_block2.p(changed, ctx);
    				} else {
    					if_block2 = create_if_block_1(ctx);
    					if_block2.c();
    					if_block2.m(div1, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (!ctx.msg.value.private) {
    				if (if_block3) {
    					if_block3.p(changed, ctx);
    				} else {
    					if_block3 = create_if_block(ctx);
    					if_block3.c();
    					if_block3.m(div2, null);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div0);
    			}

    			if_block0.d();

    			if (detaching) {
    				detach(t0);
    				detach(div3);
    			}

    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			dispose();
    		}
    	};
    }

    function instance($$self, $$props, $$invalidate) {
    	let { msg } = $$props;

      let content = ssb.markdown(msg.value.content.text);
      let liked = false;
      let hasContentWarning = msg.value.content.contentWarning || false;
      let showContentWarning = true;

      ssb.votes(msg.key).then(ms => {
        ms.forEach(m => {
          let author = m.value.author;
          if (author === ssb.feed && m.value.content.vote.value === 1) {
            $$invalidate('liked', liked = true);
          }
        });
      });

      const likeChanged = ev => {
        let v = ev.target.checked;
        if (v) {
          ssb
            .like(msg.key)
            .then(() => console.log("liked", msg.key))
            .catch(() => { const $$result = (liked = false); $$invalidate('liked', liked); return $$result; });
        } else {
          ssb
            .unlike(msg.key)
            .then(() => console.log("unliked", msg.key))
            .catch(() => { const $$result = (liked = true); $$invalidate('liked', liked); return $$result; });
        }
      };

      const reply = ev => {
        let root = msg.value.content.root || msg.key;
        let channel = msg.value.content.channel;
        let replyfeed = msg.value.author;
        navigate("/compose", { root, branch: msg.key, channel, replyfeed });
      };

      const fork = ev => {
        let originalRoot = msg.value.content.root || msg.key;
        let channel = msg.value.content.channel;
        let replyfeed = msg.value.author;
        navigate("/compose", {
          root: msg.key,
          branch: msg.key,
          fork: originalRoot,
          channel,
          replyfeed
        });
      };

      const goRoot = ev => {
        let rootId = msg.value.content.root || msg.key;
        navigate("/thread", { thread: rootId });
      };

      const goBranch = ev => {
        let branchId = msg.value.content.branch || msg.key;
        navigate("/thread", { thread: branchId });
      };

    	const writable_props = ['msg'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<PostMsg> was created with unknown prop '${key}'`);
    	});

    	function click_handler() {
    		const $$result = (showContentWarning = !showContentWarning);
    		$$invalidate('showContentWarning', showContentWarning);
    		return $$result;
    	}

    	$$self.$set = $$props => {
    		if ('msg' in $$props) $$invalidate('msg', msg = $$props.msg);
    	};

    	return {
    		msg,
    		content,
    		liked,
    		hasContentWarning,
    		showContentWarning,
    		likeChanged,
    		reply,
    		fork,
    		goRoot,
    		goBranch,
    		click_handler
    	};
    }

    class PostMsg extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		if (!document.getElementById("svelte-1ftdgav-style")) add_css();
    		init(this, options, instance, create_fragment, safe_not_equal, ["msg"]);

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.msg === undefined && !('msg' in props)) {
    			console.warn("<PostMsg> was created without expected prop 'msg'");
    		}
    	}

    	get msg() {
    		throw new Error("<PostMsg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set msg(value) {
    		throw new Error("<PostMsg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\messageTypes\GenericMsg.svelte generated by Svelte v3.4.4 */

    const file$1 = "src\\messageTypes\\GenericMsg.svelte";

    function add_css$1() {
    	var style = element("style");
    	style.id = 'svelte-mp70wj-style';
    	style.textContent = "pre.code.svelte-mp70wj{overflow:scroll}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2VuZXJpY01zZy5zdmVsdGUiLCJzb3VyY2VzIjpbIkdlbmVyaWNNc2cuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XHJcbiAgZXhwb3J0IGxldCBtc2c7XHJcblxyXG4gIGxldCByYXdDb250ZW50ID0gSlNPTi5zdHJpbmdpZnkobXNnLCBudWxsLCAyKTtcclxuPC9zY3JpcHQ+XHJcbjxzdHlsZT5cclxucHJlLmNvZGUge1xyXG4gICAgb3ZlcmZsb3c6IHNjcm9sbDtcclxufVxyXG48L3N0eWxlPlxyXG5cclxuPGRpdiBjbGFzcz1cImNhcmQtYm9keVwiPlxyXG4gIDxwcmUgY2xhc3M9XCJjb2RlXCI+XHJcbiAgICA8Y29kZT4ge3Jhd0NvbnRlbnR9IDwvY29kZT5cclxuICA8L3ByZT5cclxuPC9kaXY+XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFNQSxHQUFHLEtBQUssY0FBQyxDQUFDLEFBQ04sUUFBUSxDQUFFLE1BQU0sQUFDcEIsQ0FBQyJ9 */";
    	append(document.head, style);
    }

    function create_fragment$1(ctx) {
    	var div, pre, code, t;

    	return {
    		c: function create() {
    			div = element("div");
    			pre = element("pre");
    			code = element("code");
    			t = text(ctx.rawContent);
    			add_location(code, file$1, 13, 4, 202);
    			pre.className = "code svelte-mp70wj";
    			add_location(pre, file$1, 12, 2, 178);
    			div.className = "card-body";
    			add_location(div, file$1, 11, 0, 151);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			append(div, pre);
    			append(pre, code);
    			append(code, t);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}
    		}
    	};
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { msg } = $$props;

      let rawContent = JSON.stringify(msg, null, 2);

    	const writable_props = ['msg'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<GenericMsg> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('msg' in $$props) $$invalidate('msg', msg = $$props.msg);
    	};

    	return { msg, rawContent };
    }

    class GenericMsg extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		if (!document.getElementById("svelte-mp70wj-style")) add_css$1();
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, ["msg"]);

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.msg === undefined && !('msg' in props)) {
    			console.warn("<GenericMsg> was created without expected prop 'msg'");
    		}
    	}

    	get msg() {
    		throw new Error("<GenericMsg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set msg(value) {
    		throw new Error("<GenericMsg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\messageTypes\VoteMsg.svelte generated by Svelte v3.4.4 */

    const file$2 = "src\\messageTypes\\VoteMsg.svelte";

    function create_fragment$2(ctx) {
    	var div, t0, t1, t2, t3, a, t4, a_href_value, dispose;

    	return {
    		c: function create() {
    			div = element("div");
    			t0 = text(ctx.person);
    			t1 = space();
    			t2 = text(ctx.expression);
    			t3 = space();
    			a = element("a");
    			t4 = text(ctx.label);
    			a.href = a_href_value = "/index.html?thread=" + ctx.encodedid + "#/thread";
    			add_location(a, file$2, 29, 2, 736);
    			div.className = "card-body";
    			add_location(div, file$2, 27, 0, 683);
    			dispose = listen(a, "click", ctx.goThread);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			append(div, t0);
    			append(div, t1);
    			append(div, t2);
    			append(div, t3);
    			append(div, a);
    			append(a, t4);
    		},

    		p: function update(changed, ctx) {
    			if (changed.person) {
    				set_data(t0, ctx.person);
    			}

    			if (changed.label) {
    				set_data(t4, ctx.label);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			dispose();
    		}
    	};
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { msg } = $$props;

      let expression = msg.value.content.vote.expression;
      let msgid = msg.value.content.vote.link;
      let encodedid = encodeURIComponent(msgid);
      let label = msgid;
      let person = msg.value.author;

      ssb.blurbFromMsg(msgid, 100).then(blurb => {
        $$invalidate('label', label = blurb);
      });

      ssb.avatar(msg.value.author).then(data => { const $$result = (person = data.name); $$invalidate('person', person); return $$result; });

      const goThread = ev => {
        ev.stopPropagation();
        ev.preventDefault();
        if (ev.ctrlKey) {
          window.open(`?thread=${encodeURIComponent(msgid)}#/thread`);
        } else {
          navigate("/thread", { thread: msgid });
        }
      };

    	const writable_props = ['msg'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<VoteMsg> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('msg' in $$props) $$invalidate('msg', msg = $$props.msg);
    	};

    	return {
    		msg,
    		expression,
    		encodedid,
    		label,
    		person,
    		goThread
    	};
    }

    class VoteMsg extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, ["msg"]);

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.msg === undefined && !('msg' in props)) {
    			console.warn("<VoteMsg> was created without expected prop 'msg'");
    		}
    	}

    	get msg() {
    		throw new Error("<VoteMsg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set msg(value) {
    		throw new Error("<VoteMsg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\messageTypes\PrivateMsg.svelte generated by Svelte v3.4.4 */

    const file$3 = "src\\messageTypes\\PrivateMsg.svelte";

    function create_fragment$3(ctx) {
    	var div, p;

    	return {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			p.textContent = "🔒 PRIVATE";
    			add_location(p, file$3, 5, 0, 67);
    			div.className = "card-body";
    			add_location(div, file$3, 4, 0, 42);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			append(div, p);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}
    		}
    	};
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { msg } = $$props;

    	const writable_props = ['msg'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<PrivateMsg> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('msg' in $$props) $$invalidate('msg', msg = $$props.msg);
    	};

    	return { msg };
    }

    class PrivateMsg extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, ["msg"]);

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.msg === undefined && !('msg' in props)) {
    			console.warn("<PrivateMsg> was created without expected prop 'msg'");
    		}
    	}

    	get msg() {
    		throw new Error("<PrivateMsg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set msg(value) {
    		throw new Error("<PrivateMsg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\messageTypes\ContactMsg.svelte generated by Svelte v3.4.4 */

    const file$4 = "src\\messageTypes\\ContactMsg.svelte";

    function create_fragment$4(ctx) {
    	var div, t0, t1, t2, t3, a, t4, a_href_value, dispose;

    	return {
    		c: function create() {
    			div = element("div");
    			t0 = text(ctx.person);
    			t1 = space();
    			t2 = text(ctx.verb);
    			t3 = space();
    			a = element("a");
    			t4 = text(ctx.otherPersonName);
    			a.href = a_href_value = "?feed=" + ctx.otherPersonFeed + "#/profile";
    			add_location(a, file$4, 31, 2, 792);
    			div.className = "card-body";
    			add_location(div, file$4, 29, 0, 745);
    			dispose = listen(a, "click", ctx.goProfile);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			append(div, t0);
    			append(div, t1);
    			append(div, t2);
    			append(div, t3);
    			append(div, a);
    			append(a, t4);
    		},

    		p: function update(changed, ctx) {
    			if (changed.person) {
    				set_data(t0, ctx.person);
    			}

    			if (changed.verb) {
    				set_data(t2, ctx.verb);
    			}

    			if (changed.otherPersonName) {
    				set_data(t4, ctx.otherPersonName);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			dispose();
    		}
    	};
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { msg } = $$props;

      let person = msg.value.author;
      let otherPersonFeed = encodeURIComponent(msg.value.content.contact);
      let otherPersonName = otherPersonFeed;
      let verb = msg.value.content.following ? "followed" : "unfollowed";

      if (msg.value.content.blocking) {
        $$invalidate('verb', verb = "blocked");
      }

      ssb.avatar(msg.value.author).then(data => { const $$result = (person = data.name); $$invalidate('person', person); return $$result; });
      ssb
        .avatar(msg.value.content.contact)
        .then(data => {
          $$invalidate('otherPersonName', otherPersonName = data.name);
        })
        .catch(n => console.log(n));

      const goProfile = ev => {
        ev.stopPropagation();
        ev.preventDefault();
        navigate("/profile", { feed: msg.value.content.contact });
      };

    	const writable_props = ['msg'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<ContactMsg> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('msg' in $$props) $$invalidate('msg', msg = $$props.msg);
    	};

    	return {
    		msg,
    		person,
    		otherPersonFeed,
    		otherPersonName,
    		verb,
    		goProfile
    	};
    }

    class ContactMsg extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, ["msg"]);

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.msg === undefined && !('msg' in props)) {
    			console.warn("<ContactMsg> was created without expected prop 'msg'");
    		}
    	}

    	get msg() {
    		throw new Error("<ContactMsg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set msg(value) {
    		throw new Error("<ContactMsg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\messageTypes\ChannelMsg.svelte generated by Svelte v3.4.4 */

    const file$5 = "src\\messageTypes\\ChannelMsg.svelte";

    function create_fragment$5(ctx) {
    	var div, t0, t1, t2, t3, a, t4, t5, a_href_value, dispose;

    	return {
    		c: function create() {
    			div = element("div");
    			t0 = text(ctx.person);
    			t1 = space();
    			t2 = text(ctx.verb);
    			t3 = space();
    			a = element("a");
    			t4 = text("#");
    			t5 = text(ctx.channel);
    			a.href = a_href_value = "?channel=" + ctx.channel + "#/channel";
    			add_location(a, file$5, 20, 2, 538);
    			div.className = "card-body";
    			add_location(div, file$5, 18, 0, 491);
    			dispose = listen(a, "click", ctx.goChannel);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			append(div, t0);
    			append(div, t1);
    			append(div, t2);
    			append(div, t3);
    			append(div, a);
    			append(a, t4);
    			append(a, t5);
    		},

    		p: function update(changed, ctx) {
    			if (changed.person) {
    				set_data(t0, ctx.person);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			dispose();
    		}
    	};
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { msg } = $$props;

      let person = msg.value.author;
      let verb = msg.value.content.subscribed ? "subscribed" : "unsubscribed";
      let channel = encodeURIComponent(msg.value.content.channel);

      ssb.avatar(msg.value.author).then(data => { const $$result = (person = data.name); $$invalidate('person', person); return $$result; });

       const goChannel = ev => {
        ev.stopPropagation();
        ev.preventDefault();
        navigate("/channel", { channel: msg.value.content.channel });
      };

    	const writable_props = ['msg'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<ChannelMsg> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('msg' in $$props) $$invalidate('msg', msg = $$props.msg);
    	};

    	return { msg, person, verb, channel, goChannel };
    }

    class ChannelMsg extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, ["msg"]);

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.msg === undefined && !('msg' in props)) {
    			console.warn("<ChannelMsg> was created without expected prop 'msg'");
    		}
    	}

    	get msg() {
    		throw new Error("<ChannelMsg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set msg(value) {
    		throw new Error("<ChannelMsg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\messageTypes\AboutMsg.svelte generated by Svelte v3.4.4 */

    const file$6 = "src\\messageTypes\\AboutMsg.svelte";

    // (52:2) {:else}
    function create_else_block_1(ctx) {
    	var div, t0, t1;

    	return {
    		c: function create() {
    			div = element("div");
    			t0 = text(ctx.person);
    			t1 = text(" is doing something related to a gathering but gatherings are not\r\n      supported yet, sorry.");
    			div.className = "toast";
    			add_location(div, file$6, 52, 4, 1454);
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			append(div, t0);
    			append(div, t1);
    		},

    		p: function update(changed, ctx) {
    			if (changed.person) {
    				set_data(t0, ctx.person);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}
    		}
    	};
    }

    // (35:2) {#if isThisAboutFeeds}
    function create_if_block$1(ctx) {
    	var t0, t1, t2, t3, a, a_href_value, t4, if_block1_anchor;

    	function select_block_type_1(ctx) {
    		if (ctx.image) return create_if_block_2$1;
    		return create_else_block$1;
    	}

    	var current_block_type = select_block_type_1(ctx);
    	var if_block0 = current_block_type(ctx);

    	var if_block1 = (ctx.msg.value.content.description) && create_if_block_1$1(ctx);

    	return {
    		c: function create() {
    			t0 = text(ctx.person);
    			t1 = space();
    			t2 = text(ctx.verb);
    			t3 = space();
    			a = element("a");
    			if_block0.c();
    			t4 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			a.href = a_href_value = "?feed=" + ctx.otherLink + "#/profile";
    			add_location(a, file$6, 36, 4, 1002);
    		},

    		m: function mount(target, anchor) {
    			insert(target, t0, anchor);
    			insert(target, t1, anchor);
    			insert(target, t2, anchor);
    			insert(target, t3, anchor);
    			insert(target, a, anchor);
    			if_block0.m(a, null);
    			insert(target, t4, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert(target, if_block1_anchor, anchor);
    		},

    		p: function update(changed, ctx) {
    			if (changed.person) {
    				set_data(t0, ctx.person);
    			}

    			if (changed.verb) {
    				set_data(t2, ctx.verb);
    			}

    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block0) {
    				if_block0.p(changed, ctx);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);
    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(a, null);
    				}
    			}

    			if (ctx.msg.value.content.description) {
    				if (if_block1) {
    					if_block1.p(changed, ctx);
    				} else {
    					if_block1 = create_if_block_1$1(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(t0);
    				detach(t1);
    				detach(t2);
    				detach(t3);
    				detach(a);
    			}

    			if_block0.d();

    			if (detaching) {
    				detach(t4);
    			}

    			if (if_block1) if_block1.d(detaching);

    			if (detaching) {
    				detach(if_block1_anchor);
    			}
    		}
    	};
    }

    // (43:6) {:else}
    function create_else_block$1(ctx) {
    	var span, t;

    	return {
    		c: function create() {
    			span = element("span");
    			t = text(ctx.otherName);
    			span.className = "chip";
    			add_location(span, file$6, 43, 8, 1223);
    		},

    		m: function mount(target, anchor) {
    			insert(target, span, anchor);
    			append(span, t);
    		},

    		p: function update(changed, ctx) {
    			if (changed.otherName) {
    				set_data(t, ctx.otherName);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(span);
    			}
    		}
    	};
    }

    // (38:6) {#if image}
    function create_if_block_2$1(ctx) {
    	var div, img, t0, t1;

    	return {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t0 = space();
    			t1 = text(ctx.otherName);
    			img.src = ctx.image;
    			img.className = "avatar avatar-sm";
    			img.alt = ctx.otherName;
    			add_location(img, file$6, 39, 10, 1098);
    			div.className = "chip";
    			add_location(div, file$6, 38, 8, 1068);
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			append(div, img);
    			append(div, t0);
    			append(div, t1);
    		},

    		p: function update(changed, ctx) {
    			if (changed.otherName) {
    				img.alt = ctx.otherName;
    				set_data(t1, ctx.otherName);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}
    		}
    	};
    }

    // (47:4) {#if msg.value.content.description}
    function create_if_block_1$1(ctx) {
    	var blockquote, raw_value = ctx.ssb.markdown(ctx.msg.value.content.description);

    	return {
    		c: function create() {
    			blockquote = element("blockquote");
    			add_location(blockquote, file$6, 47, 6, 1332);
    		},

    		m: function mount(target, anchor) {
    			insert(target, blockquote, anchor);
    			blockquote.innerHTML = raw_value;
    		},

    		p: function update(changed, ctx) {
    			if ((changed.msg) && raw_value !== (raw_value = ctx.ssb.markdown(ctx.msg.value.content.description))) {
    				blockquote.innerHTML = raw_value;
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(blockquote);
    			}
    		}
    	};
    }

    function create_fragment$6(ctx) {
    	var div;

    	function select_block_type(ctx) {
    		if (ctx.isThisAboutFeeds) return create_if_block$1;
    		return create_else_block_1;
    	}

    	var current_block_type = select_block_type(ctx);
    	var if_block = current_block_type(ctx);

    	return {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			div.className = "card-body";
    			add_location(div, file$6, 33, 0, 926);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			if_block.m(div, null);
    		},

    		p: function update(changed, ctx) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(changed, ctx);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);
    				if (if_block) {
    					if_block.c();
    					if_block.m(div, null);
    				}
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			if_block.d();
    		}
    	};
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { msg } = $$props;

      let person = msg.value.author;
      let otherLink = encodeURIComponent(msg.value.content.about);
      let otherName = msg.value.content.name || msg.value.content.about;
      let isThisAboutFeeds = true;
      let verb =
        msg.value.content.about === msg.value.author
          ? "self-identifies"
          : "identifies";

      ssb.avatar(msg.value.author).then(data => { const $$result = (person = data.name); $$invalidate('person', person); return $$result; });

      if (otherName === msg.value.content.about) {
        ssb.avatar(msg.value.content.about).then(data => { const $$result = (otherName = data.name); $$invalidate('otherName', otherName); return $$result; });
      }

      let image = msg.value.content.image
        ? `http://localhost:8989/blobs/get/${encodeURIComponent(
        msg.value.content.image
      )}`
        : false;

      if (msg.value.content.description) {
        $$invalidate('verb', verb += " with description");
      }

      if (msg.value.content.about.startsWith("%")) {
        $$invalidate('isThisAboutFeeds', isThisAboutFeeds = false); // this appear to be a gathering
      }

    	const writable_props = ['msg'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<AboutMsg> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('msg' in $$props) $$invalidate('msg', msg = $$props.msg);
    	};

    	return {
    		msg,
    		person,
    		otherLink,
    		otherName,
    		isThisAboutFeeds,
    		verb,
    		image,
    		ssb
    	};
    }

    class AboutMsg extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, ["msg"]);

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.msg === undefined && !('msg' in props)) {
    			console.warn("<AboutMsg> was created without expected prop 'msg'");
    		}
    	}

    	get msg() {
    		throw new Error("<AboutMsg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set msg(value) {
    		throw new Error("<AboutMsg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\messageTypes\PubMsg.svelte generated by Svelte v3.4.4 */

    const file$7 = "src\\messageTypes\\PubMsg.svelte";

    function create_fragment$7(ctx) {
    	var div, t0, t1, a, t2, t3, t4, a_href_value, dispose;

    	return {
    		c: function create() {
    			div = element("div");
    			t0 = text(ctx.person);
    			t1 = text(" announced pub\r\n  ");
    			a = element("a");
    			t2 = text(ctx.host);
    			t3 = text(":");
    			t4 = text(ctx.port);
    			a.href = a_href_value = "/index.html?feed=" + ctx.encodedid + "#/profile";
    			add_location(a, file$7, 22, 2, 569);
    			div.className = "card-body";
    			add_location(div, file$7, 20, 0, 515);
    			dispose = listen(a, "click", ctx.goProfile);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			append(div, t0);
    			append(div, t1);
    			append(div, a);
    			append(a, t2);
    			append(a, t3);
    			append(a, t4);
    		},

    		p: function update(changed, ctx) {
    			if (changed.person) {
    				set_data(t0, ctx.person);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			dispose();
    		}
    	};
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { msg } = $$props;

      let encodedid = encodeURIComponent(msg.value.content.address.key);
      let person = msg.value.author;
      let host = msg.value.content.address.host;
      let port = msg.value.content.address.port;

      ssb.avatar(msg.value.author).then(data => { const $$result = (person = data.name); $$invalidate('person', person); return $$result; });

      
      const goProfile = ev => {
        ev.stopPropagation();
        ev.preventDefault();
        navigate("/profile", { feed: msg.value.content.address.key });
      };

    	const writable_props = ['msg'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<PubMsg> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('msg' in $$props) $$invalidate('msg', msg = $$props.msg);
    	};

    	return {
    		msg,
    		encodedid,
    		person,
    		host,
    		port,
    		goProfile
    	};
    }

    class PubMsg extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, ["msg"]);

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.msg === undefined && !('msg' in props)) {
    			console.warn("<PubMsg> was created without expected prop 'msg'");
    		}
    	}

    	get msg() {
    		throw new Error("<PubMsg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set msg(value) {
    		throw new Error("<PubMsg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\messageTypes\BlogMsg.svelte generated by Svelte v3.4.4 */

    const file$8 = "src\\messageTypes\\BlogMsg.svelte";

    function add_css$2() {
    	var style = element("style");
    	style.id = 'svelte-ygl8m2-style';
    	style.textContent = "\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmxvZ01zZy5zdmVsdGUiLCJzb3VyY2VzIjpbIkJsb2dNc2cuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XHJcbiAgaW1wb3J0IHsgbmF2aWdhdGUsIHJvdXRlTG9jYXRpb24gfSBmcm9tIFwiLi4vdXRpbHMuanNcIjtcclxuXHJcbiAgZXhwb3J0IGxldCBtc2c7XHJcblxyXG4gIGxldCBjb250ZW50ID0gbXNnLnZhbHVlLmNvbnRlbnQ7XHJcblxyXG4gIGxldCBzdW1tYXJ5ID0gc3NiLm1hcmtkb3duKGNvbnRlbnQuc3VtbWFyeSk7XHJcbiAgbGV0IHRodW1ibmFpbCA9IGNvbnRlbnQudGh1bWJuYWlsIHx8IGZhbHNlO1xyXG4gIGxldCB0aXRsZSA9IGNvbnRlbnQudGl0bGUgfHwgZmFsc2U7XHJcbiAgbGV0IHNob3dCbG9ncG9zdCA9IGZhbHNlO1xyXG4gIGxldCBsb2FkaW5nID0gZmFsc2U7XHJcbiAgbGV0IHRvYXN0ID0gZmFsc2U7XHJcbiAgbGV0IHRvYXN0TXNnID0gXCJcIjtcclxuICBsZXQgcG9zdCA9IHN1bW1hcnk7XHJcblxyXG4gIGxldCBsaWtlZCA9IGZhbHNlO1xyXG5cclxuICBzc2Iudm90ZXMobXNnLmtleSkudGhlbihtcyA9PiB7XHJcbiAgICBtcy5mb3JFYWNoKG0gPT4ge1xyXG4gICAgICBsZXQgYXV0aG9yID0gbS52YWx1ZS5hdXRob3I7XHJcbiAgICAgIGlmICgoYXV0aG9yID09PSBzc2IuZmVlZCAmJiBtLnZhbHVlLmNvbnRlbnQudm90ZS52YWx1ZSA9PT0gMSkpIHtcclxuICAgICAgICBsaWtlZCA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBjb25zdCBsaWtlQ2hhbmdlZCA9IGV2ID0+IHtcclxuICAgIGxldCB2ID0gZXYudGFyZ2V0LmNoZWNrZWQ7XHJcbiAgICBpZiAodikge1xyXG4gICAgICBzc2JcclxuICAgICAgICAubGlrZShtc2cua2V5KVxyXG4gICAgICAgIC50aGVuKCgpID0+IGNvbnNvbGUubG9nKFwibGlrZWRcIiwgbXNnLmtleSkpXHJcbiAgICAgICAgLmNhdGNoKCgpID0+IChsaWtlZCA9IGZhbHNlKSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzc2JcclxuICAgICAgICAudW5saWtlKG1zZy5rZXkpXHJcbiAgICAgICAgLnRoZW4oKCkgPT4gY29uc29sZS5sb2coXCJ1bmxpa2VkXCIsIG1zZy5rZXkpKVxyXG4gICAgICAgIC5jYXRjaCgoKSA9PiAobGlrZWQgPSB0cnVlKSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgZGlzcGxheUJsb2dQb3N0ID0gZXYgPT4ge1xyXG4gICAgbG9hZGluZyA9IHRydWU7XHJcbiAgICBjb25zb2xlLmxvZyhcImxvYWRpbmcgYmxvZ3Bvc3RcIiwgY29udGVudC5ibG9nKTtcclxuXHJcbiAgICBzc2JcclxuICAgICAgLmdldEJsb2IoY29udGVudC5ibG9nKVxyXG4gICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICBwb3N0ID0gc3NiLm1hcmtkb3duKGRhdGEpO1xyXG4gICAgICAgIHNob3dCbG9ncG9zdCA9IHRydWU7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjYW4ndCBsb2FkIGJsb2cgcG9zdFwiLCBlcnIpO1xyXG4gICAgICAgIHRvYXN0ID0gdHJ1ZTtcclxuICAgICAgICB0b2FzdE1zZyA9IGVycjtcclxuICAgICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgcmVwbHkgPSBldiA9PiB7XHJcbiAgICBsZXQgcm9vdElkID0gbXNnLnZhbHVlLmNvbnRlbnQucm9vdCB8fCBtc2cua2V5O1xyXG4gICAgbGV0IGNoYW5uZWwgPSBtc2cudmFsdWUuY29udGVudC5jaGFubmVsO1xyXG4gICAgbmF2aWdhdGUoXCIvY29tcG9zZVwiLCB7IHJvb3Q6IHJvb3RJZCwgYnJhbmNoOiBtc2cua2V5LCBjaGFubmVsIH0pO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IGdvUm9vdCA9IGV2ID0+IHtcclxuICAgIGxldCByb290SWQgPSBtc2cudmFsdWUuY29udGVudC5yb290IHx8IG1zZy5rZXk7XHJcbiAgICBuYXZpZ2F0ZShcIi90aHJlYWRcIiwgeyB0aHJlYWQ6IHJvb3RJZCB9KTtcclxuICB9O1xyXG5cclxuICBjb25zdCBnb0JyYW5jaCA9IGV2ID0+IHtcclxuICAgIGxldCBicmFuY2hJZCA9IG1zZy52YWx1ZS5jb250ZW50LmJyYW5jaCB8fCBtc2cua2V5O1xyXG4gICAgbmF2aWdhdGUoXCIvdGhyZWFkXCIsIHsgdGhyZWFkOiBicmFuY2hJZCB9KTtcclxuICB9O1xyXG5cclxuICBpZiAoJHJvdXRlTG9jYXRpb24gPT0gXCIvdGhyZWFkXCIpIHtcclxuICAgIHNldFRpbWVvdXQoZGlzcGxheUJsb2dQb3N0LCAxMDApO1xyXG4gIH1cclxuPC9zY3JpcHQ+XHJcblxyXG48c3R5bGU+XHJcbiAgZGl2IGltZy5pcy1pbWFnZS1mcm9tLWJsb2Ige1xyXG4gICAgbWF4LXdpZHRoOiA5MCU7XHJcbiAgfVxyXG48L3N0eWxlPlxyXG5cclxueyNpZiB0aHVtYm5haWx9XHJcbiAgPGRpdiBjbGFzcz1cImNhcmQtaW1hZ2VcIj5cclxuICAgIDxpbWdcclxuICAgICAgc3JjPVwiaHR0cDovL2xvY2FsaG9zdDo4OTg5L2Jsb2JzL2dldC97ZW5jb2RlVVJJQ29tcG9uZW50KHRodW1ibmFpbCl9XCJcclxuICAgICAgY2xhc3M9XCJpbWctcmVzcG9uc2l2ZVwiXHJcbiAgICAgIGFsdD17dGl0bGV9IC8+XHJcbiAgPC9kaXY+XHJcbnsvaWZ9XHJcbjxkaXYgY2xhc3M9XCJjYXJkLWJvZHlcIj5cclxuICB7I2lmIHRpdGxlfVxyXG4gICAgPGgxIGNsYXNzPVwiY2FyZC10aXRsZSBoNVwiPnt0aXRsZX08L2gxPlxyXG4gIHsvaWZ9XHJcblxyXG4gIHsjaWYgdG9hc3R9XHJcbiAgICA8ZGl2IGNsYXNzPVwidG9hc3QgdG9hc3QtZXJyb3JcIj5DYW4ndCBsb2FkIGJsb2dwb3N0OiB7dG9hc3RNc2d9PC9kaXY+XHJcbiAgey9pZn1cclxuICB7I2lmIHNob3dCbG9ncG9zdH1cclxuICAgIHtAaHRtbCBwb3N0fVxyXG4gIHs6ZWxzZX1cclxuICAgIHtAaHRtbCBzdW1tYXJ5fVxyXG4gIHsvaWZ9XHJcbjwvZGl2PlxyXG48ZGl2IGNsYXNzPVwiY2FyZC1mb290ZXJcIj5cclxuICA8ZGl2IGNsYXNzPVwiY29sdW1ucyBjb2wtZ2FwbGVzc1wiPlxyXG4gICAgPGRpdiBjbGFzcz1cImNvbHVtbiBjb2wtNlwiPlxyXG4gICAgICA8bGFiZWwgY2xhc3M9XCJmb3JtLXN3aXRjaCBkLWlubGluZVwiPlxyXG4gICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBvbjpjaGFuZ2U9e2xpa2VDaGFuZ2VkfSBjaGVja2VkPXtsaWtlZH0gLz5cclxuICAgICAgICA8aSBjbGFzcz1cImZvcm0taWNvblwiIC8+XHJcbiAgICAgICAgTGlrZVxyXG4gICAgICA8L2xhYmVsPlxyXG4gICAgICB7I2lmIG1zZy52YWx1ZS5jb250ZW50LnJvb3R9XHJcbiAgICAgICAgPHNwYW4+XHJcbiAgICAgICAgICA8YVxyXG4gICAgICAgICAgICBocmVmPVwiP3RocmVhZD17ZW5jb2RlVVJJQ29tcG9uZW50KG1zZy52YWx1ZS5jb250ZW50LnJvb3QpfSMvdGhyZWFkXCJcclxuICAgICAgICAgICAgb246Y2xpY2t8cHJldmVudERlZmF1bHQ9e2dvUm9vdH0+XHJcbiAgICAgICAgICAgIChyb290KVxyXG4gICAgICAgICAgPC9hPlxyXG4gICAgICAgIDwvc3Bhbj5cclxuICAgICAgey9pZn1cclxuICAgICAgeyNpZiBtc2cudmFsdWUuY29udGVudC5icmFuY2h9XHJcbiAgICAgICAgPHNwYW4+XHJcbiAgICAgICAgICA8YVxyXG4gICAgICAgICAgICBocmVmPVwiP3RocmVhZD17ZW5jb2RlVVJJQ29tcG9uZW50KG1zZy52YWx1ZS5jb250ZW50LmJyYW5jaCl9Iy90aHJlYWRcIlxyXG4gICAgICAgICAgICBvbjpjbGlja3xwcmV2ZW50RGVmYXVsdD17Z29CcmFuY2h9PlxyXG4gICAgICAgICAgICAoaW4gcmVwbHkgdG8pXHJcbiAgICAgICAgICA8L2E+XHJcbiAgICAgICAgPC9zcGFuPlxyXG4gICAgICB7L2lmfVxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzPVwiY29sdW1uIGNvbC02IHRleHQtcmlnaHRcIj5cclxuICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0blwiIG9uOmNsaWNrPXtyZXBseX0+UmVwbHk8L2J1dHRvbj5cclxuICAgICAgeyNpZiAhc2hvd0Jsb2dwb3N0fVxyXG4gICAgICAgIDxidXR0b25cclxuICAgICAgICAgIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCJcclxuICAgICAgICAgIGNsYXNzOmxvY2F0aW5nPXtsb2FkaW5nfVxyXG4gICAgICAgICAgb246Y2xpY2s9e2Rpc3BsYXlCbG9nUG9zdH0+XHJcbiAgICAgICAgICBSZWFkIEJsb2dwb3N0XHJcbiAgICAgICAgPC9idXR0b24+XHJcbiAgICAgIHs6ZWxzZX1cclxuICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiXHJcbiAgICAgICAgICBjbGFzczpsb2NhdGluZz17bG9hZGluZ31cclxuICAgICAgICAgIG9uOmNsaWNrPXsoKSA9PiAoc2hvd0Jsb2dwb3N0ID0gZmFsc2UpfT5cclxuICAgICAgICAgIENsb3NlIEJsb2dwb3N0XHJcbiAgICAgICAgPC9idXR0b24+XHJcbiAgICAgIHsvaWZ9XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuXHJcbjwvZGl2PlxyXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiJ9 */";
    	append(document.head, style);
    }

    // (87:0) {#if thumbnail}
    function create_if_block_6(ctx) {
    	var div, img, img_src_value;

    	return {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			img.src = img_src_value = "http://localhost:8989/blobs/get/" + encodeURIComponent(ctx.thumbnail);
    			img.className = "img-responsive";
    			img.alt = ctx.title;
    			add_location(img, file$8, 88, 4, 2079);
    			div.className = "card-image";
    			add_location(div, file$8, 87, 2, 2049);
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			append(div, img);
    		},

    		p: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}
    		}
    	};
    }

    // (96:2) {#if title}
    function create_if_block_5(ctx) {
    	var h1, t;

    	return {
    		c: function create() {
    			h1 = element("h1");
    			t = text(ctx.title);
    			h1.className = "card-title h5";
    			add_location(h1, file$8, 96, 4, 2275);
    		},

    		m: function mount(target, anchor) {
    			insert(target, h1, anchor);
    			append(h1, t);
    		},

    		p: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(h1);
    			}
    		}
    	};
    }

    // (100:2) {#if toast}
    function create_if_block_4(ctx) {
    	var div, t0, t1;

    	return {
    		c: function create() {
    			div = element("div");
    			t0 = text("Can't load blogpost: ");
    			t1 = text(ctx.toastMsg);
    			div.className = "toast toast-error";
    			add_location(div, file$8, 100, 4, 2345);
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			append(div, t0);
    			append(div, t1);
    		},

    		p: function update(changed, ctx) {
    			if (changed.toastMsg) {
    				set_data(t1, ctx.toastMsg);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}
    		}
    	};
    }

    // (105:2) {:else}
    function create_else_block_1$1(ctx) {
    	var raw_before, raw_after;

    	return {
    		c: function create() {
    			raw_before = element('noscript');
    			raw_after = element('noscript');
    		},

    		m: function mount(target, anchor) {
    			insert(target, raw_before, anchor);
    			raw_before.insertAdjacentHTML("afterend", ctx.summary);
    			insert(target, raw_after, anchor);
    		},

    		p: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_between(raw_before, raw_after);
    				detach(raw_before);
    				detach(raw_after);
    			}
    		}
    	};
    }

    // (103:2) {#if showBlogpost}
    function create_if_block_3$1(ctx) {
    	var raw_before, raw_after;

    	return {
    		c: function create() {
    			raw_before = element('noscript');
    			raw_after = element('noscript');
    		},

    		m: function mount(target, anchor) {
    			insert(target, raw_before, anchor);
    			raw_before.insertAdjacentHTML("afterend", ctx.post);
    			insert(target, raw_after, anchor);
    		},

    		p: function update(changed, ctx) {
    			if (changed.post) {
    				detach_between(raw_before, raw_after);
    				raw_before.insertAdjacentHTML("afterend", ctx.post);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_between(raw_before, raw_after);
    				detach(raw_before);
    				detach(raw_after);
    			}
    		}
    	};
    }

    // (117:6) {#if msg.value.content.root}
    function create_if_block_2$2(ctx) {
    	var span, a, t, a_href_value, dispose;

    	return {
    		c: function create() {
    			span = element("span");
    			a = element("a");
    			t = text("(root)");
    			a.href = a_href_value = "?thread=" + encodeURIComponent(ctx.msg.value.content.root) + "#/thread";
    			add_location(a, file$8, 118, 10, 2853);
    			add_location(span, file$8, 117, 8, 2835);
    			dispose = listen(a, "click", prevent_default(ctx.goRoot));
    		},

    		m: function mount(target, anchor) {
    			insert(target, span, anchor);
    			append(span, a);
    			append(a, t);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.msg) && a_href_value !== (a_href_value = "?thread=" + encodeURIComponent(ctx.msg.value.content.root) + "#/thread")) {
    				a.href = a_href_value;
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(span);
    			}

    			dispose();
    		}
    	};
    }

    // (126:6) {#if msg.value.content.branch}
    function create_if_block_1$2(ctx) {
    	var span, a, t, a_href_value, dispose;

    	return {
    		c: function create() {
    			span = element("span");
    			a = element("a");
    			t = text("(in reply to)");
    			a.href = a_href_value = "?thread=" + encodeURIComponent(ctx.msg.value.content.branch) + "#/thread";
    			add_location(a, file$8, 127, 10, 3115);
    			add_location(span, file$8, 126, 8, 3097);
    			dispose = listen(a, "click", prevent_default(ctx.goBranch));
    		},

    		m: function mount(target, anchor) {
    			insert(target, span, anchor);
    			append(span, a);
    			append(a, t);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.msg) && a_href_value !== (a_href_value = "?thread=" + encodeURIComponent(ctx.msg.value.content.branch) + "#/thread")) {
    				a.href = a_href_value;
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(span);
    			}

    			dispose();
    		}
    	};
    }

    // (145:6) {:else}
    function create_else_block$2(ctx) {
    	var button, dispose;

    	return {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Close Blogpost";
    			button.className = "btn btn-primary";
    			toggle_class(button, "locating", ctx.loading);
    			add_location(button, file$8, 145, 8, 3659);
    			dispose = listen(button, "click", ctx.click_handler);
    		},

    		m: function mount(target, anchor) {
    			insert(target, button, anchor);
    		},

    		p: function update(changed, ctx) {
    			if (changed.loading) {
    				toggle_class(button, "locating", ctx.loading);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(button);
    			}

    			dispose();
    		}
    	};
    }

    // (138:6) {#if !showBlogpost}
    function create_if_block$2(ctx) {
    	var button, dispose;

    	return {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Read Blogpost";
    			button.className = "btn btn-primary";
    			toggle_class(button, "locating", ctx.loading);
    			add_location(button, file$8, 138, 8, 3473);
    			dispose = listen(button, "click", ctx.displayBlogPost);
    		},

    		m: function mount(target, anchor) {
    			insert(target, button, anchor);
    		},

    		p: function update(changed, ctx) {
    			if (changed.loading) {
    				toggle_class(button, "locating", ctx.loading);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(button);
    			}

    			dispose();
    		}
    	};
    }

    function create_fragment$8(ctx) {
    	var t0, div0, t1, t2, t3, div4, div3, div1, label, input, t4, i, t5, t6, t7, t8, div2, button, t10, dispose;

    	var if_block0 = (ctx.thumbnail) && create_if_block_6(ctx);

    	var if_block1 = (ctx.title) && create_if_block_5(ctx);

    	var if_block2 = (ctx.toast) && create_if_block_4(ctx);

    	function select_block_type(ctx) {
    		if (ctx.showBlogpost) return create_if_block_3$1;
    		return create_else_block_1$1;
    	}

    	var current_block_type = select_block_type(ctx);
    	var if_block3 = current_block_type(ctx);

    	var if_block4 = (ctx.msg.value.content.root) && create_if_block_2$2(ctx);

    	var if_block5 = (ctx.msg.value.content.branch) && create_if_block_1$2(ctx);

    	function select_block_type_1(ctx) {
    		if (!ctx.showBlogpost) return create_if_block$2;
    		return create_else_block$2;
    	}

    	var current_block_type_1 = select_block_type_1(ctx);
    	var if_block6 = current_block_type_1(ctx);

    	return {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			div0 = element("div");
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			if_block3.c();
    			t3 = space();
    			div4 = element("div");
    			div3 = element("div");
    			div1 = element("div");
    			label = element("label");
    			input = element("input");
    			t4 = space();
    			i = element("i");
    			t5 = text("\r\n        Like");
    			t6 = space();
    			if (if_block4) if_block4.c();
    			t7 = space();
    			if (if_block5) if_block5.c();
    			t8 = space();
    			div2 = element("div");
    			button = element("button");
    			button.textContent = "Reply";
    			t10 = space();
    			if_block6.c();
    			div0.className = "card-body";
    			add_location(div0, file$8, 94, 0, 2231);
    			attr(input, "type", "checkbox");
    			input.checked = ctx.liked;
    			add_location(input, file$8, 112, 8, 2661);
    			i.className = "form-icon";
    			add_location(i, file$8, 113, 8, 2736);
    			label.className = "form-switch d-inline";
    			add_location(label, file$8, 111, 6, 2615);
    			div1.className = "column col-6";
    			add_location(div1, file$8, 110, 4, 2581);
    			button.className = "btn";
    			add_location(button, file$8, 136, 6, 3385);
    			div2.className = "column col-6 text-right";
    			add_location(div2, file$8, 135, 4, 3340);
    			div3.className = "columns col-gapless";
    			add_location(div3, file$8, 109, 2, 2542);
    			div4.className = "card-footer";
    			add_location(div4, file$8, 108, 0, 2513);

    			dispose = [
    				listen(input, "change", ctx.likeChanged),
    				listen(button, "click", ctx.reply)
    			];
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert(target, t0, anchor);
    			insert(target, div0, anchor);
    			if (if_block1) if_block1.m(div0, null);
    			append(div0, t1);
    			if (if_block2) if_block2.m(div0, null);
    			append(div0, t2);
    			if_block3.m(div0, null);
    			insert(target, t3, anchor);
    			insert(target, div4, anchor);
    			append(div4, div3);
    			append(div3, div1);
    			append(div1, label);
    			append(label, input);
    			append(label, t4);
    			append(label, i);
    			append(label, t5);
    			append(div1, t6);
    			if (if_block4) if_block4.m(div1, null);
    			append(div1, t7);
    			if (if_block5) if_block5.m(div1, null);
    			append(div3, t8);
    			append(div3, div2);
    			append(div2, button);
    			append(div2, t10);
    			if_block6.m(div2, null);
    		},

    		p: function update(changed, ctx) {
    			if (ctx.thumbnail) {
    				if (if_block0) {
    					if_block0.p(changed, ctx);
    				} else {
    					if_block0 = create_if_block_6(ctx);
    					if_block0.c();
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (ctx.title) {
    				if (if_block1) {
    					if_block1.p(changed, ctx);
    				} else {
    					if_block1 = create_if_block_5(ctx);
    					if_block1.c();
    					if_block1.m(div0, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (ctx.toast) {
    				if (if_block2) {
    					if_block2.p(changed, ctx);
    				} else {
    					if_block2 = create_if_block_4(ctx);
    					if_block2.c();
    					if_block2.m(div0, t2);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block3) {
    				if_block3.p(changed, ctx);
    			} else {
    				if_block3.d(1);
    				if_block3 = current_block_type(ctx);
    				if (if_block3) {
    					if_block3.c();
    					if_block3.m(div0, null);
    				}
    			}

    			if (changed.liked) {
    				input.checked = ctx.liked;
    			}

    			if (ctx.msg.value.content.root) {
    				if (if_block4) {
    					if_block4.p(changed, ctx);
    				} else {
    					if_block4 = create_if_block_2$2(ctx);
    					if_block4.c();
    					if_block4.m(div1, t7);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (ctx.msg.value.content.branch) {
    				if (if_block5) {
    					if_block5.p(changed, ctx);
    				} else {
    					if_block5 = create_if_block_1$2(ctx);
    					if_block5.c();
    					if_block5.m(div1, null);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}

    			if (current_block_type_1 === (current_block_type_1 = select_block_type_1(ctx)) && if_block6) {
    				if_block6.p(changed, ctx);
    			} else {
    				if_block6.d(1);
    				if_block6 = current_block_type_1(ctx);
    				if (if_block6) {
    					if_block6.c();
    					if_block6.m(div2, null);
    				}
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);

    			if (detaching) {
    				detach(t0);
    				detach(div0);
    			}

    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if_block3.d();

    			if (detaching) {
    				detach(t3);
    				detach(div4);
    			}

    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			if_block6.d();
    			run_all(dispose);
    		}
    	};
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let $routeLocation;

    	validate_store(routeLocation, 'routeLocation');
    	subscribe($$self, routeLocation, $$value => { $routeLocation = $$value; $$invalidate('$routeLocation', $routeLocation); });

    	let { msg } = $$props;

      let content = msg.value.content;

      let summary = ssb.markdown(content.summary);
      let thumbnail = content.thumbnail || false;
      let title = content.title || false;
      let showBlogpost = false;
      let loading = false;
      let toast = false;
      let toastMsg = "";
      let post = summary;

      let liked = false;

      ssb.votes(msg.key).then(ms => {
        ms.forEach(m => {
          let author = m.value.author;
          if ((author === ssb.feed && m.value.content.vote.value === 1)) {
            $$invalidate('liked', liked = true);
          }
        });
      });

      const likeChanged = ev => {
        let v = ev.target.checked;
        if (v) {
          ssb
            .like(msg.key)
            .then(() => console.log("liked", msg.key))
            .catch(() => { const $$result = (liked = false); $$invalidate('liked', liked); return $$result; });
        } else {
          ssb
            .unlike(msg.key)
            .then(() => console.log("unliked", msg.key))
            .catch(() => { const $$result = (liked = true); $$invalidate('liked', liked); return $$result; });
        }
      };

      const displayBlogPost = ev => {
        $$invalidate('loading', loading = true);
        console.log("loading blogpost", content.blog);

        ssb
          .getBlob(content.blog)
          .then(data => {
            $$invalidate('post', post = ssb.markdown(data));
            $$invalidate('showBlogpost', showBlogpost = true);
          })
          .catch(err => {
            console.error("can't load blog post", err);
            $$invalidate('toast', toast = true);
            $$invalidate('toastMsg', toastMsg = err);
          });
      };

      const reply = ev => {
        let rootId = msg.value.content.root || msg.key;
        let channel = msg.value.content.channel;
        navigate("/compose", { root: rootId, branch: msg.key, channel });
      };

      const goRoot = ev => {
        let rootId = msg.value.content.root || msg.key;
        navigate("/thread", { thread: rootId });
      };

      const goBranch = ev => {
        let branchId = msg.value.content.branch || msg.key;
        navigate("/thread", { thread: branchId });
      };

      if ($routeLocation == "/thread") {
        setTimeout(displayBlogPost, 100);
      }

    	const writable_props = ['msg'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<BlogMsg> was created with unknown prop '${key}'`);
    	});

    	function click_handler() {
    		const $$result = (showBlogpost = false);
    		$$invalidate('showBlogpost', showBlogpost);
    		return $$result;
    	}

    	$$self.$set = $$props => {
    		if ('msg' in $$props) $$invalidate('msg', msg = $$props.msg);
    	};

    	return {
    		msg,
    		summary,
    		thumbnail,
    		title,
    		showBlogpost,
    		loading,
    		toast,
    		toastMsg,
    		post,
    		liked,
    		likeChanged,
    		displayBlogPost,
    		reply,
    		goRoot,
    		goBranch,
    		click_handler
    	};
    }

    class BlogMsg extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		if (!document.getElementById("svelte-ygl8m2-style")) add_css$2();
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, ["msg"]);

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.msg === undefined && !('msg' in props)) {
    			console.warn("<BlogMsg> was created without expected prop 'msg'");
    		}
    	}

    	get msg() {
    		throw new Error("<BlogMsg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set msg(value) {
    		throw new Error("<BlogMsg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\parts\AvatarChip.svelte generated by Svelte v3.4.4 */

    const file$9 = "src\\parts\\AvatarChip.svelte";

    // (29:0) {:else}
    function create_else_block$3(ctx) {
    	var span, t, dispose;

    	return {
    		c: function create() {
    			span = element("span");
    			t = text(ctx.name);
    			span.className = "chip";
    			add_location(span, file$9, 29, 2, 595);
    			dispose = listen(span, "click", ctx.avatarClick);
    		},

    		m: function mount(target, anchor) {
    			insert(target, span, anchor);
    			append(span, t);
    		},

    		p: function update(changed, ctx) {
    			if (changed.name) {
    				set_data(t, ctx.name);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(span);
    			}

    			dispose();
    		}
    	};
    }

    // (24:0) {#if image}
    function create_if_block$3(ctx) {
    	var div, img, t0, t1, dispose;

    	return {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t0 = space();
    			t1 = text(ctx.name);
    			img.src = ctx.image;
    			img.className = "avatar avatar-sm";
    			add_location(img, file$9, 25, 4, 515);
    			div.className = "chip";
    			add_location(div, file$9, 24, 2, 468);
    			dispose = listen(div, "click", ctx.avatarClick);
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			append(div, img);
    			append(div, t0);
    			append(div, t1);
    		},

    		p: function update(changed, ctx) {
    			if (changed.image) {
    				img.src = ctx.image;
    			}

    			if (changed.name) {
    				set_data(t1, ctx.name);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			dispose();
    		}
    	};
    }

    function create_fragment$9(ctx) {
    	var if_block_anchor;

    	function select_block_type(ctx) {
    		if (ctx.image) return create_if_block$3;
    		return create_else_block$3;
    	}

    	var current_block_type = select_block_type(ctx);
    	var if_block = current_block_type(ctx);

    	return {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    		},

    		p: function update(changed, ctx) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(changed, ctx);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);
    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if_block.d(detaching);

    			if (detaching) {
    				detach(if_block_anchor);
    			}
    		}
    	};
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { feed } = $$props;

      let image = false;
      let name = feed;
      const dispatch = createEventDispatcher();

      ssb.avatar(feed).then(data => {
        if (data.image !== null) {
          $$invalidate('image', image = `http://localhost:8989/blobs/get/${data.image}`);
        }
        $$invalidate('name', name = data.name);
      });

      function avatarClick() {
        dispatch("avatarClick", {
          feed,
          name
        });
      }

    	const writable_props = ['feed'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<AvatarChip> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('feed' in $$props) $$invalidate('feed', feed = $$props.feed);
    	};

    	return { feed, image, name, avatarClick };
    }

    class AvatarChip extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, ["feed"]);

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.feed === undefined && !('feed' in props)) {
    			console.warn("<AvatarChip> was created without expected prop 'feed'");
    		}
    	}

    	get feed() {
    		throw new Error("<AvatarChip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set feed(value) {
    		throw new Error("<AvatarChip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var timeago = function(){};

    timeago.prototype.simple = function(date_time) {
        // today date and time in milliseconds 
        var today = Date.now();
        var dateParse = Date.parse(date_time);
        
        //We will perform some test - if there is error, we will throw error to console and exit, no change will be on the data.
        try {
            // We need to check if we able to parse the Date (if the result is NaN, this is an issue)
            if(dateParse !== dateParse) throw "timeago-simple: Please check date and time format! Unable to parse the date & time: " + date_time;
        }
        catch(err) {
            console.error(err);
            return (date_time);
        }
        
        if((dateParse - today) < 0) {
    		return pastCalc(date_time);
    	} else {
    		return futureCalc(date_time);
    	}
    };


    // General help functions for time calculations
    function pastCalc(timeData){

        // today date and time in milliseconds 
        var today = Date.now();
            
        // parsing post date and time into milliseconds format
        timeData = Date.parse(timeData);

        var seconds = (today - timeData) / 1000;
        var minutes = (seconds / 60);
        var hours = (seconds / 3600);
        if(seconds < 60 && minutes < 1) {
            return (seconds === 1 ? Math.round(seconds) + " second ago" : Math.round(seconds) + " seconds ago");
        }
        if(minutes < 60 && hours < 1) {
            return (minutes === 1 ? Math.round(minutes) + " minute ago" : Math.round(minutes) + " minutes ago");
        }
        if(hours > 24){
            var days = hours / 24;
            if (days > 30) {
                var month = days / 30;
                if (month > 12) {
                    var years = month / 12;
                    if (years > 0) {
                        return (years === 1 ? Math.ceil(years) + " year ago" : Math.ceil(years) + " years ago");
                    }
                }
                return (Math.round(month) + " month ago");
            }
            return (days === 1 ? Math.round(days) + " day ago" : Math.round(days) + " days ago");
        } else {
            return (hours === 1 ? Math.round(hours) + " hour ago" : Math.round(hours) + " hours ago");
        }
            
    }

    function futureCalc(timeData){

        // today date and time in milliseconds 
        var today = Date.now();
         
        // parsing post date and time into milliseconds format
        timeData = Date.parse(timeData);
        var seconds = (timeData - today) / 1000;
        var minutes = (seconds / 60);
        var hours = (seconds / 3600);
        if(seconds < 60 && minutes < 1) {
            return (seconds === 1 ? "in " + Math.round(seconds) + " second" : "in " + Math.round(seconds) + " seconds");
        }
        if(minutes < 60 && hours < 1) {
            return (minutes === 1 ? "in " + Math.round(minutes) + " minute" : "in " + Math.round(minutes) + " minutes");
        }
        if(hours > 24){
            var days = hours / 24;
            if (days > 30) {
                var month = days / 30;
                if (month > 12) {
                    var years = month / 12;
                    if (years > 0) {
                        return (years === 1 ? "in " + Math.ceil(years) + " year" : "in " + Math.ceil(years) + " years"); 
                    }
                }
               return ("in " + Math.round(month) + " month"); 
            }
            return (days === 1 ? "in " + Math.round(days) + " day" : "in " + Math.round(days) + " days");
        } else {
            return (hours === 1 ? "in " + Math.round(hours) + " hour" : "in " + Math.round(hours) + " hours");
        }
    }

    // Future calculation
    timeago.prototype.future = function(timeData) {
        console.warn("timeago-simple: .future function is depricated! Please use .simple for both past and future dates.");
        // today date and time in milliseconds 
        var today = Date.now();

        //We will perform some test - if there is error, we will throw error to console and exit, no change will be on the data.
        try {
            // We need to check if we able to parse the Date (if the result is NaN, this is an issue)
            if(Date.parse(timeData) !== Date.parse(timeData)) throw "timeago-simple: Please check date and time format! Unable to parse the date & time: " + timeData;
            // Need to check if it's really future date to parse
            if((Date.parse(timeData) - today) < 0) throw "timeago-simple: Looks like it's more relevant case for timeago.simple"; 
        }
        catch(err) {
            console.error(err);
            return (timeData);
        }
      
        // parsing post date and time into milliseconds format
        timeData = Date.parse(timeData);
        var seconds = (timeData - today) / 1000;
        var minutes = (seconds / 60);
        var hours = (seconds / 3600);
        /* istanbul ignore if */
        if(seconds < 60 && minutes < 1) {
            return (seconds === 1 ? "in " + Math.round(seconds) + " second" : "in " + Math.round(seconds) + " seconds");
        }
        /* istanbul ignore if */
        if(minutes < 60 && hours < 1) {
        	return (minutes === 1 ? "in " + Math.round(minutes) + " minute" : "in " + Math.round(minutes) + " minutes");
        }
        /* istanbul ignore if */
        if(hours > 24){
            var days = hours / 24;
            if (days > 30) {
                var month = days / 30;
                if (month > 12) {
                    var years = month / 12;
                    if (years > 0) {
                        return (years === 1 ? "in " + Math.ceil(years) + " year" : "in " + Math.ceil(years) + " years");
                    }
                }
    	        return ("in " + Math.round(month) + " month");
            }
            return (days === 1 ? "in " + Math.round(days) + " day" : "in " + Math.round(days) + " days");
        }
        return (hours === 1 ? "in " + Math.round(hours) + " hour" : "in " + Math.round(hours) + " hours");
    };


    var timeagoSimple = new timeago();

    const timestamp = t => {

        return timeagoSimple.simple(new Date(t))
    };

    /* src\messageTypes\MessageRenderer.svelte generated by Svelte v3.4.4 */

    const file$a = "src\\messageTypes\\MessageRenderer.svelte";

    function add_css$3() {
    	var style = element("style");
    	style.id = 'svelte-1jn1wek-style';
    	style.textContent = ".blured.svelte-1jn1wek img.svelte-1jn1wek{filter:blur(20px) !important}.blured.svelte-1jn1wek{border:solid 2px red}.feed-display.svelte-1jn1wek{cursor:pointer}.channel-display.svelte-1jn1wek{cursor:pointer}.menu-right.svelte-1jn1wek{right:0px;left:unset;min-width:300px}.private.svelte-1jn1wek{border:solid 2px orange}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWVzc2FnZVJlbmRlcmVyLnN2ZWx0ZSIsInNvdXJjZXMiOlsiTWVzc2FnZVJlbmRlcmVyLnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8c2NyaXB0PlxyXG4gIGltcG9ydCBQb3N0TXNnIGZyb20gXCIuL1Bvc3RNc2cuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IEdlbmVyaWNNc2cgZnJvbSBcIi4vR2VuZXJpY01zZy5zdmVsdGVcIjtcclxuICBpbXBvcnQgVm90ZU1zZyBmcm9tIFwiLi9Wb3RlTXNnLnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBQcml2YXRlTXNnIGZyb20gXCIuL1ByaXZhdGVNc2cuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IENvbnRhY3RNc2cgZnJvbSBcIi4vQ29udGFjdE1zZy5zdmVsdGVcIjtcclxuICBpbXBvcnQgQ2hhbm5lbE1zZyBmcm9tIFwiLi9DaGFubmVsTXNnLnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBBYm91dE1zZyBmcm9tIFwiLi9BYm91dE1zZy5zdmVsdGVcIjtcclxuICBpbXBvcnQgUHViTXNnIGZyb20gXCIuL1B1Yk1zZy5zdmVsdGVcIjtcclxuICBpbXBvcnQgQmxvZ01zZyBmcm9tIFwiLi9CbG9nTXNnLnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBBdmF0YXJDaGlwIGZyb20gXCIuLi9wYXJ0cy9BdmF0YXJDaGlwLnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCB0aW1lc3RhbXAgZnJvbSBcIi4uL3BhcnRzL3RpbWVzdGFtcC5qc1wiO1xyXG4gIGltcG9ydCB7IG5hdmlnYXRlIH0gZnJvbSBcIi4uL3V0aWxzLmpzXCI7XHJcbiAgaW1wb3J0IHsgaXNNZXNzYWdlQmx1cmVkIH0gZnJvbSBcIi4uL2FidXNlUHJldmVudGlvbi5qc1wiO1xyXG5cclxuICBleHBvcnQgbGV0IG1zZztcclxuXHJcbiAgbGV0IHR5cGU7XHJcbiAgbGV0IGZlZWQgPSBtc2cudmFsdWUuYXV0aG9yO1xyXG4gIGxldCBzaG93UmF3ID0gZmFsc2U7XHJcbiAgbGV0IHJhd0NvbnRlbnQgPSBKU09OLnN0cmluZ2lmeShtc2csIG51bGwsIDIpO1xyXG4gIGxldCBkcm9wZG93bkFjdGl2ZSA9IGZhbHNlO1xyXG4gIGxldCBwcml2YXRlTXNnRm9yWW91ID0gZmFsc2U7XHJcblxyXG4gIGxldCBtZXNzYWdlVHlwZXMgPSB7XHJcbiAgICBcIipcIjogR2VuZXJpY01zZyxcclxuICAgIHBvc3Q6IFBvc3RNc2csXHJcbiAgICB2b3RlOiBWb3RlTXNnLFxyXG4gICAgcHJpdmF0ZTogUHJpdmF0ZU1zZyxcclxuICAgIGNvbnRhY3Q6IENvbnRhY3RNc2csXHJcbiAgICBjaGFubmVsOiBDaGFubmVsTXNnLFxyXG4gICAgYWJvdXQ6IEFib3V0TXNnLFxyXG4gICAgcHViOiBQdWJNc2csXHJcbiAgICBibG9nOiBCbG9nTXNnXHJcbiAgfTtcclxuXHJcbiAgbGV0IHNlbGVjdGVkUmVuZGVyZXI7XHJcblxyXG4gIGlmICh0eXBlb2YgbXNnLnZhbHVlLmNvbnRlbnQgPT09IFwic3RyaW5nXCIpIHtcclxuICAgIHR5cGUgPSBcInByaXZhdGVcIjtcclxuICB9IGVsc2Uge1xyXG4gICAgdHlwZSA9IG1zZy52YWx1ZS5jb250ZW50LnR5cGU7XHJcbiAgfVxyXG5cclxuICBpZiAobXNnLnZhbHVlLnByaXZhdGUpIHtcclxuICAgIHByaXZhdGVNc2dGb3JZb3UgPSB0cnVlO1xyXG4gIH1cclxuXHJcbiAgaWYgKG1lc3NhZ2VUeXBlcy5oYXNPd25Qcm9wZXJ0eSh0eXBlKSkge1xyXG4gICAgc2VsZWN0ZWRSZW5kZXJlciA9IG1lc3NhZ2VUeXBlc1t0eXBlXTtcclxuICB9IGVsc2Uge1xyXG4gICAgc2VsZWN0ZWRSZW5kZXJlciA9IG1lc3NhZ2VUeXBlc1tcIipcIl07XHJcbiAgfVxyXG5cclxuICBsZXQgaW1hZ2UgPSBcImltYWdlcy9pY29uLnBuZ1wiO1xyXG4gIGxldCBuYW1lID0gZmVlZDtcclxuICBsZXQgYmx1cmVkID0gaXNNZXNzYWdlQmx1cmVkKG1zZyk7XHJcblxyXG4gIHNzYi5hdmF0YXIoZmVlZCkudGhlbihkYXRhID0+IHtcclxuICAgIGlmIChkYXRhLmltYWdlICE9PSBudWxsKSB7XHJcbiAgICAgIGltYWdlID0gYGh0dHA6Ly9sb2NhbGhvc3Q6ODk4OS9ibG9icy9nZXQvJHtkYXRhLmltYWdlfWA7XHJcbiAgICB9XHJcbiAgICBuYW1lID0gZGF0YS5uYW1lO1xyXG4gIH0pO1xyXG5cclxuICBjb25zdCB0b2dnbGVSYXdNZXNzYWdlID0gKCkgPT4ge1xyXG4gICAgc2hvd1JhdyA9ICFzaG93UmF3O1xyXG4gICAgZHJvcGRvd25BY3RpdmUgPSBmYWxzZTtcclxuICB9O1xyXG5cclxuICBjb25zdCBjb3B5UGVybWFsaW5rID0gKCkgPT4ge1xyXG4gICAgbmF2aWdhdG9yLmNsaXBib2FyZFxyXG4gICAgICAud3JpdGVUZXh0KGBzc2I6JHttc2cua2V5fWApXHJcbiAgICAgIC50aGVuKCgpID0+IGNvbnNvbGUubG9nKFwicGVybWFsaW5rIGNvcGllZFwiKSlcclxuICAgICAgLmNhdGNoKGVyciA9PiBjb25zb2xlLmVycm9yKFwiY2FuJ3QgY29weSBwZXJtYWxpbmtcIiwgZXJyKSk7XHJcblxyXG4gICAgZHJvcGRvd25BY3RpdmUgPSBmYWxzZTtcclxuICB9O1xyXG5cclxuICBjb25zdCBjb3B5SGFzaCA9ICgpID0+IHtcclxuICAgIG5hdmlnYXRvci5jbGlwYm9hcmRcclxuICAgICAgLndyaXRlVGV4dChgJHttc2cua2V5fWApXHJcbiAgICAgIC50aGVuKCgpID0+IGNvbnNvbGUubG9nKFwiaGFzaCBjb3BpZWRcIikpXHJcbiAgICAgIC5jYXRjaChlcnIgPT4gY29uc29sZS5lcnJvcihcImNhbid0IGNvcHkgaGFzaFwiLCBlcnIpKTtcclxuXHJcbiAgICBkcm9wZG93bkFjdGl2ZSA9IGZhbHNlO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IGdvUHJvZmlsZSA9IGV2ID0+IHtcclxuICAgIGlmIChldi5jdHJsS2V5KSB7XHJcbiAgICAgIHdpbmRvdy5vcGVuKGA/ZmVlZD0ke2VuY29kZVVSSUNvbXBvbmVudChmZWVkKX0jL3Byb2ZpbGVgKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG5hdmlnYXRlKFwiL3Byb2ZpbGVcIiwgeyBmZWVkIH0pO1xyXG4gICAgfVxyXG4gIH07XHJcbjwvc2NyaXB0PlxyXG5cclxuPHN0eWxlPlxyXG4gIC5ibHVyZWQgaW1nIHtcclxuICAgIGZpbHRlcjogYmx1cigyMHB4KSAhaW1wb3J0YW50O1xyXG4gIH1cclxuXHJcbiAgLmJsdXJlZCB7XHJcbiAgICBib3JkZXI6IHNvbGlkIDJweCByZWQ7XHJcbiAgfVxyXG4gIC5yYXctY29udGVudCB7XHJcbiAgICB3aWR0aDogNTAlO1xyXG4gIH1cclxuXHJcbiAgLmZlZWQtZGlzcGxheSB7XHJcbiAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgfVxyXG5cclxuICAuY2hhbm5lbC1kaXNwbGF5IHtcclxuICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICB9XHJcblxyXG4gIC5tZW51LXJpZ2h0IHtcclxuICAgIHJpZ2h0OiAwcHg7XHJcbiAgICBsZWZ0OiB1bnNldDtcclxuICAgIG1pbi13aWR0aDogMzAwcHg7XHJcbiAgfVxyXG5cclxuICAucHJpdmF0ZSB7XHJcbiAgICBib3JkZXI6IHNvbGlkIDJweCBvcmFuZ2U7XHJcbiAgfVxyXG48L3N0eWxlPlxyXG5cclxuPGRpdiBjbGFzcz1cImNhcmQgbS0yXCIgY2xhc3M6cHJpdmF0ZT17cHJpdmF0ZU1zZ0ZvcllvdX0gY2xhc3M6Ymx1cmVkPlxyXG4gIDxkaXYgY2xhc3M9XCJjYXJkLWhlYWRlclwiPlxyXG4gICAgPGRpdiBjbGFzcz1cImZsb2F0LWxlZnRcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cImNhcmQtdGl0bGVcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwidGlsZSB0aWxlLWNlbnRlcmVkIGZlZWQtZGlzcGxheVwiIG9uOmNsaWNrPXtnb1Byb2ZpbGV9PlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInRpbGUtaWNvblwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZXhhbXBsZS10aWxlLWljb25cIj5cclxuICAgICAgICAgICAgICA8aW1nIHNyYz17aW1hZ2V9IGNsYXNzPVwiYXZhdGFyIGF2YXRhci1sZ1wiIGFsdD17ZmVlZH0gLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0aWxlLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRpbGUtdGl0bGVcIj57bmFtZX08L2Rpdj5cclxuICAgICAgICAgICAgPHNtYWxsIGNsYXNzPVwidGlsZS1zdWJ0aXRsZSB0ZXh0LWdyYXlcIj5cclxuICAgICAgICAgICAgICAge3RpbWVzdGFtcChtc2cudmFsdWUudGltZXN0YW1wKX1cclxuICAgICAgICAgICAgPC9zbWFsbD5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICAgeyNpZiBwcml2YXRlTXNnRm9yWW91fVxyXG4gICAgICA8c3BhbiBjbGFzcz1cImxhYmVsXCI+UFJJVkFURTwvc3Bhbj5cclxuICAgIHsvaWZ9XHJcbiAgICA8ZGl2IGNsYXNzPVwiZmxvYXQtcmlnaHRcIj5cclxuICAgICAgPHNwYW5cclxuICAgICAgICBjbGFzcz1cInRleHQtZ3JheSBjaGFubmVsLWRpc3BsYXlcIlxyXG4gICAgICAgIG9uOmNsaWNrPXsoKSA9PiBuYXZpZ2F0ZSgnL2NoYW5uZWwnLCB7XHJcbiAgICAgICAgICAgIGNoYW5uZWw6IG1zZy52YWx1ZS5jb250ZW50LmNoYW5uZWxcclxuICAgICAgICAgIH0pfT5cclxuICAgICAgICB7I2lmIG1zZy52YWx1ZS5jb250ZW50LmNoYW5uZWx9I3ttc2cudmFsdWUuY29udGVudC5jaGFubmVsfXsvaWZ9XHJcbiAgICAgIDwvc3Bhbj5cclxuICAgICAgPGRpdiBjbGFzcz1cImRyb3Bkb3duXCI+XHJcbiAgICAgICAgPHNwYW5cclxuICAgICAgICAgIGNsYXNzPVwiYnRuIGJ0bi1saW5rIGRyb3Bkb3duLXRvZ2dsZVwiXHJcbiAgICAgICAgICB0YWJpbmRleD1cIjBcIlxyXG4gICAgICAgICAgY2xhc3M6YWN0aXZlPXtkcm9wZG93bkFjdGl2ZX1cclxuICAgICAgICAgIG9uOmNsaWNrPXsoKSA9PiAoZHJvcGRvd25BY3RpdmUgPSAhZHJvcGRvd25BY3RpdmUpfT5cclxuICAgICAgICAgIDxpIGNsYXNzPVwiaWNvbiBpY29uLW1vcmUtdmVydFwiIC8+XHJcbiAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgIDx1bCBjbGFzcz1cIm1lbnUgbWVudS1yaWdodFwiPlxyXG4gICAgICAgICAgPGxpIGNsYXNzPVwibWVudS1pdGVtXCI+XHJcblxyXG4gICAgICAgICAgICA8YVxyXG4gICAgICAgICAgICAgIGhyZWY9XCI/dGhyZWFkPXtlbmNvZGVVUklDb21wb25lbnQobXNnLmtleSl9Iy90aHJlYWRcIlxyXG4gICAgICAgICAgICAgIHRhcmdldD1cIl9ibGFua1wiPlxyXG4gICAgICAgICAgICAgIDxpIGNsYXNzPVwiaWNvbiBpY29uLXNoYXJlXCIgLz5cclxuICAgICAgICAgICAgICBPcGVuIGluIG5ldyB0YWJcclxuICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgPC9saT5cclxuICAgICAgICAgIDxsaSBjbGFzcz1cIm1lbnUtaXRlbVwiPlxyXG4gICAgICAgICAgICA8YSBocmVmPVwiI1wiIG9uOmNsaWNrfHByZXZlbnREZWZhdWx0PXtjb3B5UGVybWFsaW5rfT5cclxuICAgICAgICAgICAgICA8aSBjbGFzcz1cImljb24gaWNvbi1jb3B5XCIgLz5cclxuICAgICAgICAgICAgICBDb3B5IHBlcm1hbGluayB0byBjbGlwYm9hcmRcclxuICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgPC9saT5cclxuICAgICAgICAgIDxsaSBjbGFzcz1cIm1lbnUtaXRlbVwiPlxyXG4gICAgICAgICAgICA8YSBocmVmPVwiI1wiIG9uOmNsaWNrfHByZXZlbnREZWZhdWx0PXtjb3B5SGFzaH0+XHJcbiAgICAgICAgICAgICAgPGkgY2xhc3M9XCJpY29uIGljb24tY29weVwiIC8+XHJcbiAgICAgICAgICAgICAgQ29weSBtZXNzYWdlIGlkIHRvIGNsaXBib2FyZFxyXG4gICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgPGxpIGNsYXNzPVwiZGl2aWRlclwiIGRhdGEtY29udGVudD1cIkZPUiBUSEUgQ1VSSU9VU1wiIC8+XHJcbiAgICAgICAgICA8bGkgY2xhc3M9XCJtZW51LWl0ZW1cIj5cclxuICAgICAgICAgICAgPGEgaHJlZj1cIiNcIiBvbjpjbGlja3xwcmV2ZW50RGVmYXVsdD17dG9nZ2xlUmF3TWVzc2FnZX0+XHJcbiAgICAgICAgICAgICAgPGkgY2xhc3M9XCJpY29uIGljb24tbWVzc2FnZVwiIC8+XHJcbiAgICAgICAgICAgICAgeyNpZiAhc2hvd1Jhd31TaG93IHJhdyBtZXNzYWdlezplbHNlfUNsb3NlIHJhdyBtZXNzYWdley9pZn1cclxuICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgPC9saT5cclxuICAgICAgICA8L3VsPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG4gIHsjaWYgIXNob3dSYXd9XHJcbiAgICA8c3ZlbHRlOmNvbXBvbmVudCB0aGlzPXtzZWxlY3RlZFJlbmRlcmVyfSB7bXNnfSAvPlxyXG4gIHs6ZWxzZX1cclxuICAgIDxkaXYgY2xhc3M9XCJjYXJkLWJvZHlcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cImNvbHVtbnNcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sdW1uIGNvbC05XCI+XHJcbiAgICAgICAgICA8cHJlIGNsYXNzPVwiY29kZVwiPlxyXG4gICAgICAgICAgICA8Y29kZT57cmF3Q29udGVudH08L2NvZGU+XHJcbiAgICAgICAgICA8L3ByZT5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sdW1uIGNvbC0zXCI+XHJcbiAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgVGhpcyBpcyBhIG1lc3NhZ2Ugb2YgdHlwZVxyXG4gICAgICAgICAgICA8ZW0+e3R5cGV9PC9lbT5cclxuICAgICAgICAgICAgLlxyXG4gICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgIFRvIGxlYXJuIG1vcmUgYWJvdXQgaXQsIGdvIHRvXHJcbiAgICAgICAgICAgIDxhIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCIvZG9jcy9pbmRleC5odG1sIy9tZXNzYWdlX3R5cGVzL3t0eXBlfVwiPlxyXG4gICAgICAgICAgICAgIHRoZSBkb2N1bWVudGF0aW9uIGFib3V0IG1lc3NhZ2VzIHdpdGggdHlwZSB7dHlwZX1cclxuICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAuXHJcbiAgICAgICAgICA8L3A+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgey9pZn1cclxuPC9kaXY+XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFrR0Usc0JBQU8sQ0FBQyxHQUFHLGVBQUMsQ0FBQyxBQUNYLE1BQU0sQ0FBRSxLQUFLLElBQUksQ0FBQyxDQUFDLFVBQVUsQUFDL0IsQ0FBQyxBQUVELE9BQU8sZUFBQyxDQUFDLEFBQ1AsTUFBTSxDQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxBQUN2QixDQUFDLEFBS0QsYUFBYSxlQUFDLENBQUMsQUFDYixNQUFNLENBQUUsT0FBTyxBQUNqQixDQUFDLEFBRUQsZ0JBQWdCLGVBQUMsQ0FBQyxBQUNoQixNQUFNLENBQUUsT0FBTyxBQUNqQixDQUFDLEFBRUQsV0FBVyxlQUFDLENBQUMsQUFDWCxLQUFLLENBQUUsR0FBRyxDQUNWLElBQUksQ0FBRSxLQUFLLENBQ1gsU0FBUyxDQUFFLEtBQUssQUFDbEIsQ0FBQyxBQUVELFFBQVEsZUFBQyxDQUFDLEFBQ1IsTUFBTSxDQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxBQUMxQixDQUFDIn0= */";
    	append(document.head, style);
    }

    // (148:4) {#if privateMsgForYou}
    function create_if_block_3$2(ctx) {
    	var span;

    	return {
    		c: function create() {
    			span = element("span");
    			span.textContent = "PRIVATE";
    			span.className = "label";
    			add_location(span, file$a, 148, 6, 3611);
    		},

    		m: function mount(target, anchor) {
    			insert(target, span, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(span);
    			}
    		}
    	};
    }

    // (157:8) {#if msg.value.content.channel}
    function create_if_block_2$3(ctx) {
    	var t0, t1_value = ctx.msg.value.content.channel, t1;

    	return {
    		c: function create() {
    			t0 = text("#");
    			t1 = text(t1_value);
    		},

    		m: function mount(target, anchor) {
    			insert(target, t0, anchor);
    			insert(target, t1, anchor);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.msg) && t1_value !== (t1_value = ctx.msg.value.content.channel)) {
    				set_data(t1, t1_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(t0);
    				detach(t1);
    			}
    		}
    	};
    }

    // (193:44) {:else}
    function create_else_block_1$2(ctx) {
    	var t;

    	return {
    		c: function create() {
    			t = text("Close raw message");
    		},

    		m: function mount(target, anchor) {
    			insert(target, t, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(t);
    			}
    		}
    	};
    }

    // (193:14) {#if !showRaw}
    function create_if_block_1$3(ctx) {
    	var t;

    	return {
    		c: function create() {
    			t = text("Show raw message");
    		},

    		m: function mount(target, anchor) {
    			insert(target, t, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(t);
    			}
    		}
    	};
    }

    // (202:2) {:else}
    function create_else_block$4(ctx) {
    	var div3, div2, div0, pre, code, t0, t1, div1, p0, t2, em, t3, t4, t5, p1, t6, a, t7, t8, a_href_value, t9;

    	return {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			pre = element("pre");
    			code = element("code");
    			t0 = text(ctx.rawContent);
    			t1 = space();
    			div1 = element("div");
    			p0 = element("p");
    			t2 = text("This is a message of type\r\n            ");
    			em = element("em");
    			t3 = text(ctx.type);
    			t4 = text("\r\n            .");
    			t5 = space();
    			p1 = element("p");
    			t6 = text("To learn more about it, go to\r\n            ");
    			a = element("a");
    			t7 = text("the documentation about messages with type ");
    			t8 = text(ctx.type);
    			t9 = text("\r\n            .");
    			add_location(code, file$a, 206, 12, 5568);
    			pre.className = "code";
    			add_location(pre, file$a, 205, 10, 5536);
    			div0.className = "column col-9";
    			add_location(div0, file$a, 204, 8, 5498);
    			add_location(em, file$a, 212, 12, 5731);
    			add_location(p0, file$a, 210, 10, 5675);
    			a.target = "_blank";
    			a.href = a_href_value = "/docs/index.html#/message_types/" + ctx.type;
    			add_location(a, file$a, 217, 12, 5849);
    			add_location(p1, file$a, 215, 10, 5789);
    			div1.className = "column col-3";
    			add_location(div1, file$a, 209, 8, 5637);
    			div2.className = "columns";
    			add_location(div2, file$a, 203, 6, 5467);
    			div3.className = "card-body";
    			add_location(div3, file$a, 202, 4, 5436);
    		},

    		m: function mount(target, anchor) {
    			insert(target, div3, anchor);
    			append(div3, div2);
    			append(div2, div0);
    			append(div0, pre);
    			append(pre, code);
    			append(code, t0);
    			append(div2, t1);
    			append(div2, div1);
    			append(div1, p0);
    			append(p0, t2);
    			append(p0, em);
    			append(em, t3);
    			append(p0, t4);
    			append(div1, t5);
    			append(div1, p1);
    			append(p1, t6);
    			append(p1, a);
    			append(a, t7);
    			append(a, t8);
    			append(p1, t9);
    		},

    		p: function update(changed, ctx) {
    			if (changed.type) {
    				set_data(t3, ctx.type);
    				set_data(t8, ctx.type);
    			}

    			if ((changed.type) && a_href_value !== (a_href_value = "/docs/index.html#/message_types/" + ctx.type)) {
    				a.href = a_href_value;
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div3);
    			}
    		}
    	};
    }

    // (200:2) {#if !showRaw}
    function create_if_block$4(ctx) {
    	var switch_instance_anchor, current;

    	var switch_value = ctx.selectedRenderer;

    	function switch_props(ctx) {
    		return {
    			props: { msg: ctx.msg },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props(ctx));
    	}

    	return {
    		c: function create() {
    			if (switch_instance) switch_instance.$$.fragment.c();
    			switch_instance_anchor = empty();
    		},

    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert(target, switch_instance_anchor, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var switch_instance_changes = {};
    			if (changed.msg) switch_instance_changes.msg = ctx.msg;

    			if (switch_value !== (switch_value = ctx.selectedRenderer)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;
    					on_outro(() => {
    						old_component.$destroy();
    					});
    					old_component.$$.fragment.o(1);
    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));

    					switch_instance.$$.fragment.c();
    					switch_instance.$$.fragment.i(1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			}

    			else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) switch_instance.$$.fragment.i(local);

    			current = true;
    		},

    		o: function outro(local) {
    			if (switch_instance) switch_instance.$$.fragment.o(local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(switch_instance_anchor);
    			}

    			if (switch_instance) switch_instance.$destroy(detaching);
    		}
    	};
    }

    function create_fragment$a(ctx) {
    	var div10, div9, div6, div5, div4, div1, div0, img, t0, div3, div2, t1, t2, small, t3_value = timestamp(ctx.msg.value.timestamp), t3, t4, t5, div8, span0, t6, div7, span1, i0, t7, ul, li0, a0, i1, t8, a0_href_value, t9, li1, a1, i2, t10, t11, li2, a2, i3, t12, t13, li3, t14, li4, a3, i4, t15, t16, current_block_type_index, if_block3, current, dispose;

    	var if_block0 = (ctx.privateMsgForYou) && create_if_block_3$2(ctx);

    	var if_block1 = (ctx.msg.value.content.channel) && create_if_block_2$3(ctx);

    	function select_block_type(ctx) {
    		if (!ctx.showRaw) return create_if_block_1$3;
    		return create_else_block_1$2;
    	}

    	var current_block_type = select_block_type(ctx);
    	var if_block2 = current_block_type(ctx);

    	var if_block_creators = [
    		create_if_block$4,
    		create_else_block$4
    	];

    	var if_blocks = [];

    	function select_block_type_1(ctx) {
    		if (!ctx.showRaw) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block3 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	return {
    		c: function create() {
    			div10 = element("div");
    			div9 = element("div");
    			div6 = element("div");
    			div5 = element("div");
    			div4 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div3 = element("div");
    			div2 = element("div");
    			t1 = text(ctx.name);
    			t2 = space();
    			small = element("small");
    			t3 = text(t3_value);
    			t4 = space();
    			if (if_block0) if_block0.c();
    			t5 = space();
    			div8 = element("div");
    			span0 = element("span");
    			if (if_block1) if_block1.c();
    			t6 = space();
    			div7 = element("div");
    			span1 = element("span");
    			i0 = element("i");
    			t7 = space();
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			i1 = element("i");
    			t8 = text("\r\n              Open in new tab");
    			t9 = space();
    			li1 = element("li");
    			a1 = element("a");
    			i2 = element("i");
    			t10 = text("\r\n              Copy permalink to clipboard");
    			t11 = space();
    			li2 = element("li");
    			a2 = element("a");
    			i3 = element("i");
    			t12 = text("\r\n              Copy message id to clipboard");
    			t13 = space();
    			li3 = element("li");
    			t14 = space();
    			li4 = element("li");
    			a3 = element("a");
    			i4 = element("i");
    			t15 = space();
    			if_block2.c();
    			t16 = space();
    			if_block3.c();
    			img.src = ctx.image;
    			img.className = "avatar avatar-lg svelte-1jn1wek";
    			img.alt = ctx.feed;
    			add_location(img, file$a, 135, 14, 3210);
    			div0.className = "example-tile-icon";
    			add_location(div0, file$a, 134, 12, 3163);
    			div1.className = "tile-icon";
    			add_location(div1, file$a, 133, 10, 3126);
    			div2.className = "tile-title";
    			add_location(div2, file$a, 139, 12, 3355);
    			small.className = "tile-subtitle text-gray";
    			add_location(small, file$a, 140, 12, 3405);
    			div3.className = "tile-content";
    			add_location(div3, file$a, 138, 10, 3315);
    			div4.className = "tile tile-centered feed-display svelte-1jn1wek";
    			add_location(div4, file$a, 132, 8, 3048);
    			div5.className = "card-title";
    			add_location(div5, file$a, 131, 6, 3014);
    			div6.className = "float-left";
    			add_location(div6, file$a, 130, 4, 2982);
    			span0.className = "text-gray channel-display svelte-1jn1wek";
    			add_location(span0, file$a, 151, 6, 3695);
    			i0.className = "icon icon-more-vert";
    			add_location(i0, file$a, 164, 10, 4178);
    			span1.className = "btn btn-link dropdown-toggle";
    			span1.tabIndex = "0";
    			toggle_class(span1, "active", ctx.dropdownActive);
    			add_location(span1, file$a, 159, 8, 3984);
    			i1.className = "icon icon-share";
    			add_location(i1, file$a, 172, 14, 4434);
    			a0.href = a0_href_value = "?thread=" + ctx.encodeURIComponent(ctx.msg.key) + "#/thread";
    			a0.target = "_blank";
    			add_location(a0, file$a, 169, 12, 4316);
    			li0.className = "menu-item";
    			add_location(li0, file$a, 167, 10, 4278);
    			i2.className = "icon icon-copy";
    			add_location(i2, file$a, 178, 14, 4645);
    			a1.href = "#";
    			add_location(a1, file$a, 177, 12, 4577);
    			li1.className = "menu-item";
    			add_location(li1, file$a, 176, 10, 4541);
    			i3.className = "icon icon-copy";
    			add_location(i3, file$a, 184, 14, 4862);
    			a2.href = "#";
    			add_location(a2, file$a, 183, 12, 4799);
    			li2.className = "menu-item";
    			add_location(li2, file$a, 182, 10, 4763);
    			li3.className = "divider";
    			li3.dataset.content = "FOR THE CURIOUS";
    			add_location(li3, file$a, 188, 10, 4981);
    			i4.className = "icon icon-message";
    			add_location(i4, file$a, 191, 14, 5153);
    			a3.href = "#";
    			add_location(a3, file$a, 190, 12, 5082);
    			li4.className = "menu-item";
    			add_location(li4, file$a, 189, 10, 5046);
    			ul.className = "menu menu-right svelte-1jn1wek";
    			add_location(ul, file$a, 166, 8, 4238);
    			div7.className = "dropdown";
    			add_location(div7, file$a, 158, 6, 3952);
    			div8.className = "float-right";
    			add_location(div8, file$a, 150, 4, 3662);
    			div9.className = "card-header";
    			add_location(div9, file$a, 129, 2, 2951);
    			div10.className = "card m-2 svelte-1jn1wek";
    			toggle_class(div10, "private", ctx.privateMsgForYou);
    			toggle_class(div10, "blured", ctx.blured);
    			add_location(div10, file$a, 128, 0, 2879);

    			dispose = [
    				listen(div4, "click", ctx.goProfile),
    				listen(span0, "click", ctx.click_handler),
    				listen(span1, "click", ctx.click_handler_1),
    				listen(a1, "click", prevent_default(ctx.copyPermalink)),
    				listen(a2, "click", prevent_default(ctx.copyHash)),
    				listen(a3, "click", prevent_default(ctx.toggleRawMessage))
    			];
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div10, anchor);
    			append(div10, div9);
    			append(div9, div6);
    			append(div6, div5);
    			append(div5, div4);
    			append(div4, div1);
    			append(div1, div0);
    			append(div0, img);
    			append(div4, t0);
    			append(div4, div3);
    			append(div3, div2);
    			append(div2, t1);
    			append(div3, t2);
    			append(div3, small);
    			append(small, t3);
    			append(div9, t4);
    			if (if_block0) if_block0.m(div9, null);
    			append(div9, t5);
    			append(div9, div8);
    			append(div8, span0);
    			if (if_block1) if_block1.m(span0, null);
    			append(div8, t6);
    			append(div8, div7);
    			append(div7, span1);
    			append(span1, i0);
    			append(div7, t7);
    			append(div7, ul);
    			append(ul, li0);
    			append(li0, a0);
    			append(a0, i1);
    			append(a0, t8);
    			append(ul, t9);
    			append(ul, li1);
    			append(li1, a1);
    			append(a1, i2);
    			append(a1, t10);
    			append(ul, t11);
    			append(ul, li2);
    			append(li2, a2);
    			append(a2, i3);
    			append(a2, t12);
    			append(ul, t13);
    			append(ul, li3);
    			append(ul, t14);
    			append(ul, li4);
    			append(li4, a3);
    			append(a3, i4);
    			append(a3, t15);
    			if_block2.m(a3, null);
    			append(div10, t16);
    			if_blocks[current_block_type_index].m(div10, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (!current || changed.image) {
    				img.src = ctx.image;
    			}

    			if (!current || changed.name) {
    				set_data(t1, ctx.name);
    			}

    			if ((!current || changed.msg) && t3_value !== (t3_value = timestamp(ctx.msg.value.timestamp))) {
    				set_data(t3, t3_value);
    			}

    			if (ctx.privateMsgForYou) {
    				if (!if_block0) {
    					if_block0 = create_if_block_3$2(ctx);
    					if_block0.c();
    					if_block0.m(div9, t5);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (ctx.msg.value.content.channel) {
    				if (if_block1) {
    					if_block1.p(changed, ctx);
    				} else {
    					if_block1 = create_if_block_2$3(ctx);
    					if_block1.c();
    					if_block1.m(span0, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (changed.dropdownActive) {
    				toggle_class(span1, "active", ctx.dropdownActive);
    			}

    			if ((!current || changed.msg) && a0_href_value !== (a0_href_value = "?thread=" + ctx.encodeURIComponent(ctx.msg.key) + "#/thread")) {
    				a0.href = a0_href_value;
    			}

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block2.d(1);
    				if_block2 = current_block_type(ctx);
    				if (if_block2) {
    					if_block2.c();
    					if_block2.m(a3, null);
    				}
    			}

    			var previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);
    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(changed, ctx);
    			} else {
    				group_outros();
    				on_outro(() => {
    					if_blocks[previous_block_index].d(1);
    					if_blocks[previous_block_index] = null;
    				});
    				if_block3.o(1);
    				check_outros();

    				if_block3 = if_blocks[current_block_type_index];
    				if (!if_block3) {
    					if_block3 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block3.c();
    				}
    				if_block3.i(1);
    				if_block3.m(div10, null);
    			}

    			if (changed.privateMsgForYou) {
    				toggle_class(div10, "private", ctx.privateMsgForYou);
    			}

    			if (changed.blured) {
    				toggle_class(div10, "blured", ctx.blured);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			if (if_block3) if_block3.i();
    			current = true;
    		},

    		o: function outro(local) {
    			if (if_block3) if_block3.o();
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div10);
    			}

    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if_block2.d();
    			if_blocks[current_block_type_index].d();
    			run_all(dispose);
    		}
    	};
    }

    function instance$a($$self, $$props, $$invalidate) {
    	

      let { msg } = $$props;

      let type;
      let feed = msg.value.author;
      let showRaw = false;
      let rawContent = JSON.stringify(msg, null, 2);
      let dropdownActive = false;
      let privateMsgForYou = false;

      let messageTypes = {
        "*": GenericMsg,
        post: PostMsg,
        vote: VoteMsg,
        private: PrivateMsg,
        contact: ContactMsg,
        channel: ChannelMsg,
        about: AboutMsg,
        pub: PubMsg,
        blog: BlogMsg
      };

      let selectedRenderer;

      if (typeof msg.value.content === "string") {
        $$invalidate('type', type = "private");
      } else {
        $$invalidate('type', type = msg.value.content.type);
      }

      if (msg.value.private) {
        $$invalidate('privateMsgForYou', privateMsgForYou = true);
      }

      if (messageTypes.hasOwnProperty(type)) {
        $$invalidate('selectedRenderer', selectedRenderer = messageTypes[type]);
      } else {
        $$invalidate('selectedRenderer', selectedRenderer = messageTypes["*"]);
      }

      let image = "images/icon.png";
      let name = feed;
      let blured = isMessageBlured(msg);

      ssb.avatar(feed).then(data => {
        if (data.image !== null) {
          $$invalidate('image', image = `http://localhost:8989/blobs/get/${data.image}`);
        }
        $$invalidate('name', name = data.name);
      });

      const toggleRawMessage = () => {
        $$invalidate('showRaw', showRaw = !showRaw);
        $$invalidate('dropdownActive', dropdownActive = false);
      };

      const copyPermalink = () => {
        navigator.clipboard
          .writeText(`ssb:${msg.key}`)
          .then(() => console.log("permalink copied"))
          .catch(err => console.error("can't copy permalink", err));

        $$invalidate('dropdownActive', dropdownActive = false);
      };

      const copyHash = () => {
        navigator.clipboard
          .writeText(`${msg.key}`)
          .then(() => console.log("hash copied"))
          .catch(err => console.error("can't copy hash", err));

        $$invalidate('dropdownActive', dropdownActive = false);
      };

      const goProfile = ev => {
        if (ev.ctrlKey) {
          window.open(`?feed=${encodeURIComponent(feed)}#/profile`);
        } else {
          navigate("/profile", { feed });
        }
      };

    	const writable_props = ['msg'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<MessageRenderer> was created with unknown prop '${key}'`);
    	});

    	function click_handler() {
    		return navigate('/channel', {
    	            channel: msg.value.content.channel
    	          });
    	}

    	function click_handler_1() {
    		const $$result = (dropdownActive = !dropdownActive);
    		$$invalidate('dropdownActive', dropdownActive);
    		return $$result;
    	}

    	$$self.$set = $$props => {
    		if ('msg' in $$props) $$invalidate('msg', msg = $$props.msg);
    	};

    	return {
    		msg,
    		type,
    		feed,
    		showRaw,
    		rawContent,
    		dropdownActive,
    		privateMsgForYou,
    		selectedRenderer,
    		image,
    		name,
    		blured,
    		toggleRawMessage,
    		copyPermalink,
    		copyHash,
    		goProfile,
    		encodeURIComponent,
    		click_handler,
    		click_handler_1
    	};
    }

    class MessageRenderer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		if (!document.getElementById("svelte-1jn1wek-style")) add_css$3();
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, ["msg"]);

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.msg === undefined && !('msg' in props)) {
    			console.warn("<MessageRenderer> was created without expected prop 'msg'");
    		}
    	}

    	get msg() {
    		throw new Error("<MessageRenderer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set msg(value) {
    		throw new Error("<MessageRenderer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\views\Public.svelte generated by Svelte v3.4.4 */

    const file$b = "src\\views\\Public.svelte";

    function add_css$4() {
    	var style = element("style");
    	style.id = 'svelte-kdiu44-style';
    	style.textContent = "\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHVibGljLnN2ZWx0ZSIsInNvdXJjZXMiOlsiUHVibGljLnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8c2NyaXB0PlxyXG4gIGltcG9ydCBNZXNzYWdlUmVuZGVyZXIgZnJvbSBcIi4uL21lc3NhZ2VUeXBlcy9NZXNzYWdlUmVuZGVyZXIuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IHsgbmF2aWdhdGUsIHJvdXRlUGFyYW1zLCBnZXRQcmVmIH0gZnJvbSBcIi4uL3V0aWxzLmpzXCI7XHJcbiAgaW1wb3J0IHsgb25Nb3VudCB9IGZyb20gXCJzdmVsdGVcIjtcclxuXHJcbiAgbGV0IG1zZ3MgPSBmYWxzZTtcclxuICBsZXQgZXJyb3IgPSAkcm91dGVQYXJhbXMuZXJyb3IgfHwgZmFsc2U7XHJcbiAgbGV0IGRyb3Bkb3duQWN0aXZlID0gZmFsc2U7XHJcblxyXG4gIGxldCBvcHRzID0ge307XHJcblxyXG4gIC8vIHRvZG86IG1vdmUgYmFjayBpbnRvIHVzaW5nIHN0b3Jlcy5cclxuICAkOiB7XHJcbiAgICBPYmplY3QuYXNzaWduKG9wdHMsICRyb3V0ZVBhcmFtcyk7XHJcblxyXG4gICAgZG9jdW1lbnQudGl0bGUgPSBgUGF0Y2hmb3ggLSBQdWJsaWNgO1xyXG5cclxuICAgIGlmIChvcHRzLmhhc093blByb3BlcnR5KFwibHRcIikpIHtcclxuICAgICAgb3B0cy5sdCA9IHBhcnNlSW50KG9wdHMubHQpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChvcHRzLmhhc093blByb3BlcnR5KFwibGltaXRcIikpIHtcclxuICAgICAgb3B0cy5saW1pdCA9IHBhcnNlSW50KG9wdHMubGltaXQpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBwcm9taXNlID0gc3NiXHJcbiAgICAgIC5wdWJsaWMob3B0cylcclxuICAgICAgLnRoZW4obXMgPT4ge1xyXG4gICAgICAgIG1zZ3MgPSBtcztcclxuICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgMCk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5jYXRjaChuID0+IHtcclxuICAgICAgICBpZiAoIWVycm9yKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiZXJycnJvb29vb3JcIiwgbik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGdvTmV4dCA9ICgpID0+IHtcclxuICAgIG5hdmlnYXRlKFwiL3B1YmxpY1wiLCB7XHJcbiAgICAgIGx0OiBtc2dzW21zZ3MubGVuZ3RoIC0gMV0udmFsdWUudGltZXN0YW1wXHJcbiAgICB9KTtcclxuICB9O1xyXG4gIGNvbnN0IGdvUHJldmlvdXMgPSAoKSA9PiB7XHJcbiAgICBoaXN0b3J5LmJhY2soKTtcclxuICB9O1xyXG48L3NjcmlwdD5cclxuXHJcbjxzdHlsZT5cclxuICAubWVudS1yaWdodCB7XHJcbiAgICByaWdodDogMHB4O1xyXG4gICAgbGVmdDogdW5zZXQ7XHJcbiAgICBtaW4td2lkdGg6IDMwMHB4O1xyXG4gIH1cclxuPC9zdHlsZT5cclxuXHJcbjxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cclxuICA8ZGl2IGNsYXNzPVwiY29sdW1uc1wiPlxyXG4gICAgPGg0IGNsYXNzPVwiY29sdW1uXCI+UHVibGljIEZlZWQ8L2g0PlxyXG4gICAgPGRpdiBjbGFzcz1cImNvbHVtblwiIC8+XHJcbiAgPC9kaXY+XHJcbjwvZGl2PlxyXG57I2lmIGVycm9yfVxyXG4gIDxkaXYgY2xhc3M9XCJ0b2FzdCB0b2FzdC1lcnJvclwiPkVycm9yOiB7ZXJyb3J9PC9kaXY+XHJcbnsvaWZ9XHJcbnsjaWYgIW1zZ3N9XHJcbiAgPGRpdiBjbGFzcz1cImxvYWRpbmcgbG9hZGluZy1sZ1wiIC8+XHJcbns6ZWxzZX1cclxuICB7I2VhY2ggbXNncyBhcyBtc2cgKG1zZy5rZXkpfVxyXG4gICAgPE1lc3NhZ2VSZW5kZXJlciB7bXNnfSAvPlxyXG4gIHsvZWFjaH1cclxuICA8dWwgY2xhc3M9XCJwYWdpbmF0aW9uXCI+XHJcbiAgICA8bGkgY2xhc3M9XCJwYWdlLWl0ZW0gcGFnZS1wcmV2aW91c1wiPlxyXG4gICAgICA8YSBocmVmPVwiIy9wdWJsaWNcIiBvbjpjbGlja3xzdG9wUHJvcGFnYXRpb258cHJldmVudERlZmF1bHQ9e2dvUHJldmlvdXN9PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJwYWdlLWl0ZW0tc3VidGl0bGVcIj5QcmV2aW91czwvZGl2PlxyXG4gICAgICA8L2E+XHJcbiAgICA8L2xpPlxyXG4gICAgPGxpIGNsYXNzPVwicGFnZS1pdGVtIHBhZ2UtbmV4dFwiPlxyXG4gICAgICA8YSBocmVmPVwiIy9wdWJsaWNcIiBvbjpjbGlja3xzdG9wUHJvcGFnYXRpb258cHJldmVudERlZmF1bHQ9e2dvTmV4dH0+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInBhZ2UtaXRlbS1zdWJ0aXRsZVwiPk5leHQ8L2Rpdj5cclxuICAgICAgPC9hPlxyXG4gICAgPC9saT5cclxuICA8L3VsPlxyXG57L2lmfVxyXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiJ9 */";
    	append(document.head, style);
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.msg = list[i];
    	return child_ctx;
    }

    // (63:0) {#if error}
    function create_if_block_1$4(ctx) {
    	var div, t0, t1;

    	return {
    		c: function create() {
    			div = element("div");
    			t0 = text("Error: ");
    			t1 = text(ctx.error);
    			div.className = "toast toast-error";
    			add_location(div, file$b, 63, 2, 1300);
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			append(div, t0);
    			append(div, t1);
    		},

    		p: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}
    		}
    	};
    }

    // (68:0) {:else}
    function create_else_block$5(ctx) {
    	var each_blocks = [], each_1_lookup = new Map(), t0, ul, li0, a0, div0, t2, li1, a1, div1, current, dispose;

    	var each_value = ctx.msgs;

    	const get_key = ctx => ctx.msg.key;

    	for (var i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	return {
    		c: function create() {
    			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].c();

    			t0 = space();
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			div0 = element("div");
    			div0.textContent = "Previous";
    			t2 = space();
    			li1 = element("li");
    			a1 = element("a");
    			div1 = element("div");
    			div1.textContent = "Next";
    			div0.className = "page-item-subtitle";
    			add_location(div0, file$b, 74, 8, 1652);
    			a0.href = "#/public";
    			add_location(a0, file$b, 73, 6, 1570);
    			li0.className = "page-item page-previous";
    			add_location(li0, file$b, 72, 4, 1526);
    			div1.className = "page-item-subtitle";
    			add_location(div1, file$b, 79, 8, 1845);
    			a1.href = "#/public";
    			add_location(a1, file$b, 78, 6, 1767);
    			li1.className = "page-item page-next";
    			add_location(li1, file$b, 77, 4, 1727);
    			ul.className = "pagination";
    			add_location(ul, file$b, 71, 2, 1497);

    			dispose = [
    				listen(a0, "click", stop_propagation(prevent_default(ctx.goPrevious))),
    				listen(a1, "click", stop_propagation(prevent_default(ctx.goNext)))
    			];
    		},

    		m: function mount(target, anchor) {
    			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].m(target, anchor);

    			insert(target, t0, anchor);
    			insert(target, ul, anchor);
    			append(ul, li0);
    			append(li0, a0);
    			append(a0, div0);
    			append(ul, t2);
    			append(ul, li1);
    			append(li1, a1);
    			append(a1, div1);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			const each_value = ctx.msgs;

    			group_outros();
    			each_blocks = update_keyed_each(each_blocks, changed, get_key, 1, ctx, each_value, each_1_lookup, t0.parentNode, outro_and_destroy_block, create_each_block, t0, get_each_context);
    			check_outros();
    		},

    		i: function intro(local) {
    			if (current) return;
    			for (var i = 0; i < each_value.length; i += 1) each_blocks[i].i();

    			current = true;
    		},

    		o: function outro(local) {
    			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].o();

    			current = false;
    		},

    		d: function destroy(detaching) {
    			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].d(detaching);

    			if (detaching) {
    				detach(t0);
    				detach(ul);
    			}

    			run_all(dispose);
    		}
    	};
    }

    // (66:0) {#if !msgs}
    function create_if_block$5(ctx) {
    	var div;

    	return {
    		c: function create() {
    			div = element("div");
    			div.className = "loading loading-lg";
    			add_location(div, file$b, 66, 2, 1375);
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}
    		}
    	};
    }

    // (69:2) {#each msgs as msg (msg.key)}
    function create_each_block(key_1, ctx) {
    	var first, current;

    	var messagerenderer = new MessageRenderer({
    		props: { msg: ctx.msg },
    		$$inline: true
    	});

    	return {
    		key: key_1,

    		first: null,

    		c: function create() {
    			first = empty();
    			messagerenderer.$$.fragment.c();
    			this.first = first;
    		},

    		m: function mount(target, anchor) {
    			insert(target, first, anchor);
    			mount_component(messagerenderer, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var messagerenderer_changes = {};
    			if (changed.msgs) messagerenderer_changes.msg = ctx.msg;
    			messagerenderer.$set(messagerenderer_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			messagerenderer.$$.fragment.i(local);

    			current = true;
    		},

    		o: function outro(local) {
    			messagerenderer.$$.fragment.o(local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(first);
    			}

    			messagerenderer.$destroy(detaching);
    		}
    	};
    }

    function create_fragment$b(ctx) {
    	var div2, div1, h4, t1, div0, t2, t3, current_block_type_index, if_block1, if_block1_anchor, current;

    	var if_block0 = (ctx.error) && create_if_block_1$4(ctx);

    	var if_block_creators = [
    		create_if_block$5,
    		create_else_block$5
    	];

    	var if_blocks = [];

    	function select_block_type(ctx) {
    		if (!ctx.msgs) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	return {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			h4 = element("h4");
    			h4.textContent = "Public Feed";
    			t1 = space();
    			div0 = element("div");
    			t2 = space();
    			if (if_block0) if_block0.c();
    			t3 = space();
    			if_block1.c();
    			if_block1_anchor = empty();
    			h4.className = "column";
    			add_location(h4, file$b, 58, 4, 1202);
    			div0.className = "column";
    			add_location(div0, file$b, 59, 4, 1243);
    			div1.className = "columns";
    			add_location(div1, file$b, 57, 2, 1175);
    			div2.className = "container";
    			add_location(div2, file$b, 56, 0, 1148);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div2, anchor);
    			append(div2, div1);
    			append(div1, h4);
    			append(div1, t1);
    			append(div1, div0);
    			insert(target, t2, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert(target, t3, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert(target, if_block1_anchor, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (ctx.error) {
    				if (if_block0) {
    					if_block0.p(changed, ctx);
    				} else {
    					if_block0 = create_if_block_1$4(ctx);
    					if_block0.c();
    					if_block0.m(t3.parentNode, t3);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			var previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);
    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(changed, ctx);
    			} else {
    				group_outros();
    				on_outro(() => {
    					if_blocks[previous_block_index].d(1);
    					if_blocks[previous_block_index] = null;
    				});
    				if_block1.o(1);
    				check_outros();

    				if_block1 = if_blocks[current_block_type_index];
    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				}
    				if_block1.i(1);
    				if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			if (if_block1) if_block1.i();
    			current = true;
    		},

    		o: function outro(local) {
    			if (if_block1) if_block1.o();
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div2);
    				detach(t2);
    			}

    			if (if_block0) if_block0.d(detaching);

    			if (detaching) {
    				detach(t3);
    			}

    			if_blocks[current_block_type_index].d(detaching);

    			if (detaching) {
    				detach(if_block1_anchor);
    			}
    		}
    	};
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let $routeParams;

    	validate_store(routeParams, 'routeParams');
    	subscribe($$self, routeParams, $$value => { $routeParams = $$value; $$invalidate('$routeParams', $routeParams); });

    	

      let msgs = false;
      let error = $routeParams.error || false;

      let opts = {};

      const goNext = () => {
        navigate("/public", {
          lt: msgs[msgs.length - 1].value.timestamp
        });
      };
      const goPrevious = () => {
        history.back();
      };

    	$$self.$$.update = ($$dirty = { opts: 1, $routeParams: 1, error: 1 }) => {
    		if ($$dirty.opts || $$dirty.$routeParams || $$dirty.error) { {
            Object.assign(opts, $routeParams);
        
            document.title = `Patchfox - Public`;
        
            if (opts.hasOwnProperty("lt")) {
              opts.lt = parseInt(opts.lt); $$invalidate('opts', opts), $$invalidate('$routeParams', $routeParams), $$invalidate('error', error);
            }
        
            if (opts.hasOwnProperty("limit")) {
              opts.limit = parseInt(opts.limit); $$invalidate('opts', opts), $$invalidate('$routeParams', $routeParams), $$invalidate('error', error);
            }
        
            let promise = ssb
              .public(opts)
              .then(ms => {
                $$invalidate('msgs', msgs = ms);
                window.scrollTo(0, 0);
              })
              .catch(n => {
                if (!error) {
                  console.error("errrrooooor", n);
                }
              });
          } }
    	};

    	return { msgs, error, goNext, goPrevious };
    }

    class Public extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		if (!document.getElementById("svelte-kdiu44-style")) add_css$4();
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, []);
    	}
    }

    /* src\views\Default.svelte generated by Svelte v3.4.4 */

    const file$c = "src\\views\\Default.svelte";

    function create_fragment$c(ctx) {
    	var div;

    	return {
    		c: function create() {
    			div = element("div");
    			div.className = "empty";
    			add_location(div, file$c, 0, 0, 0);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}
    		}
    	};
    }

    class Default extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$c, safe_not_equal, []);
    	}
    }

    function handleDrop(callback, event) {
      event.stopPropagation();
      event.preventDefault();
      callback(Array.prototype.slice.call(event.dataTransfer.files));
    }

    function killEvent(e) {
      e.stopPropagation();
      e.preventDefault();
      return false
    }

    function addDragDropListener(element, callback) {
      element.addEventListener("dragenter", killEvent, false);
      element.addEventListener("dragover", killEvent, false);
      element.addEventListener("drop", handleDrop.bind(undefined, callback), false);
    }

    var ondrop = addDragDropListener;

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function slide(node, { delay = 0, duration = 400, easing = cubicOut }) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const height = parseFloat(style.height);
        const padding_top = parseFloat(style.paddingTop);
        const padding_bottom = parseFloat(style.paddingBottom);
        const margin_top = parseFloat(style.marginTop);
        const margin_bottom = parseFloat(style.marginBottom);
        const border_top_width = parseFloat(style.borderTopWidth);
        const border_bottom_width = parseFloat(style.borderBottomWidth);
        return {
            delay,
            duration,
            easing,
            css: t => `overflow: hidden;` +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `height: ${t * height}px;` +
                `padding-top: ${t * padding_top}px;` +
                `padding-bottom: ${t * padding_bottom}px;` +
                `margin-top: ${t * margin_top}px;` +
                `margin-bottom: ${t * margin_bottom}px;` +
                `border-top-width: ${t * border_top_width}px;` +
                `border-bottom-width: ${t * border_bottom_width}px;`
        };
    }

    /* src\views\Compose.svelte generated by Svelte v3.4.4 */

    const file$d = "src\\views\\Compose.svelte";

    function add_css$5() {
    	var style = element("style");
    	style.id = 'svelte-olsuyr-style';
    	style.textContent = ".file-on-top.svelte-olsuyr{border:solid 2px rgb(26, 192, 11)}input[type=\"file\"].svelte-olsuyr{display:none}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tcG9zZS5zdmVsdGUiLCJzb3VyY2VzIjpbIkNvbXBvc2Uuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XHJcbiAgaW1wb3J0IHsgb25Nb3VudCB9IGZyb20gXCJzdmVsdGVcIjtcclxuICBpbXBvcnQgZHJvcCBmcm9tIFwiZHJhZy1hbmQtZHJvcC1maWxlc1wiO1xyXG4gIGltcG9ydCB7IHNsaWRlIH0gZnJvbSBcInN2ZWx0ZS90cmFuc2l0aW9uXCI7XHJcbiAgaW1wb3J0IHsgbmF2aWdhdGUsIHJvdXRlUGFyYW1zLCByZWNvbm5lY3QsIGdldFByZWYgfSBmcm9tIFwiLi4vdXRpbHMuanNcIjtcclxuICBpbXBvcnQgQXZhdGFyQ2hpcCBmcm9tIFwiLi4vcGFydHMvQXZhdGFyQ2hpcC5zdmVsdGVcIjtcclxuXHJcbiAgbGV0IHNob3dQcmV2aWV3ID0gZmFsc2U7XHJcbiAgbGV0IG1zZyA9IGZhbHNlO1xyXG4gIGxldCBlcnJvciA9IGZhbHNlO1xyXG4gIGxldCBwb3N0aW5nID0gZmFsc2U7XHJcblxyXG4gIGxldCByb290ID0gJHJvdXRlUGFyYW1zLnJvb3Q7XHJcbiAgbGV0IGJyYW5jaCA9ICRyb3V0ZVBhcmFtcy5icmFuY2g7XHJcbiAgbGV0IGNoYW5uZWwgPSAkcm91dGVQYXJhbXMuY2hhbm5lbCB8fCBcIlwiO1xyXG4gIGxldCBjb250ZW50ID0gJHJvdXRlUGFyYW1zLmNvbnRlbnQgfHwgXCJcIjtcclxuICBsZXQgcmVwbHlmZWVkID0gJHJvdXRlUGFyYW1zLnJlcGx5ZmVlZCB8fCBmYWxzZTtcclxuICBsZXQgZm9yayA9ICRyb3V0ZVBhcmFtcy5mb3JrO1xyXG4gIGxldCBmaWxlT25Ub3AgPSBmYWxzZTtcclxuICBsZXQgcHVsbCA9IGhlcm1pZWJveC5tb2R1bGVzLnB1bGxTdHJlYW07XHJcbiAgbGV0IGZpbGVSZWFkZXIgPSBoZXJtaWVib3gubW9kdWxlcy5wdWxsRmlsZVJlYWRlcjtcclxuICBsZXQgc2JvdCA9IGhlcm1pZWJveC5zYm90O1xyXG4gIGxldCBpcGZzRGFlbW9uUnVubmluZyA9IGZhbHNlO1xyXG5cclxuICBkb2N1bWVudC50aXRsZSA9IGBQYXRjaGZveCAtIGNvbXBvc2VgO1xyXG5cclxuICBvbk1vdW50KCgpID0+IHtcclxuICAgIGVycm9yID0gZmFsc2U7XHJcbiAgICBtc2cgPSBcIlwiO1xyXG5cclxuICAgIC8vIHRoaXMgY29kZSBjb3VsZCBiZSBpbiBzb21lIGJldHRlci9zbWFydGVyIHBsYWNlLlxyXG4gICAgLy8gZS5kYXRhVHJhbnNmZXIuZ2V0RGF0YSgndXJsJyk7IGZyb20gaW1hZ2VzIGluIHRoZSBicm93c2VyIHdpbmRvd1xyXG5cclxuICAgIGRyb3AoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250ZW50XCIpLCBmaWxlcyA9PiByZWFkRmlsZUFuZEF0dGFjaChmaWxlcykpO1xyXG4gICAgY2hlY2tJcGZzRGFlbW9uKCk7XHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IGNoZWNrSXBmc0RhZW1vbiA9ICgpID0+IHtcclxuICAgIGxldCBwb3J0ID0gZ2V0UHJlZihcImlwZnNQb3J0XCIsIDUwMDEpO1xyXG4gICAgZmV0Y2goYGh0dHA6Ly8xMjcuMC4wLjE6JHtwb3J0fS9hcGkvdjAvY29uZmlnL3Nob3dgKS50aGVuKGRhdGEgPT4ge1xyXG4gICAgICBpcGZzRGFlbW9uUnVubmluZyA9IHRydWU7XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBjb25zdCByZWFkRmlsZUFuZEF0dGFjaCA9IGZpbGVzID0+IHtcclxuICAgIGVycm9yID0gZmFsc2U7XHJcbiAgICBtc2cgPSBcIlwiO1xyXG5cclxuICAgIGlmIChmaWxlcy5sZW5ndGggPT0gMCkge1xyXG4gICAgICBmaWxlT25Ub3AgPSBmYWxzZTtcclxuICAgICAgY29uc29sZS5sb2coXCJ0aGlzIGlzIG5vdCBhIGZpbGVcIik7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgZmlyc3QgPSBmaWxlc1swXTtcclxuICAgIGNvbnNvbGUubG9nKGZpcnN0KTtcclxuXHJcbiAgICBpZiAoIWZpcnN0LnR5cGUuc3RhcnRzV2l0aChcImltYWdlXCIpKSB7XHJcbiAgICAgIGVycm9yID0gdHJ1ZTtcclxuICAgICAgbXNnID0gYFlvdSBjYW4gb25seSBkcmFnICYgZHJvcCBpbWFnZSwgdGhpcyBmaWxlIGlzIGEgJHtmaXJzdC50eXBlfWA7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZmlyc3Quc2l6ZSA+PSA1MDAwMDAwKSB7XHJcbiAgICAgIGVycm9yID0gdHJ1ZTtcclxuICAgICAgbXNnID0gYEZpbGUgdG9vIGxhcmdlOiAke01hdGguZmxvb3IoXHJcbiAgICAgICAgZmlyc3Quc2l6ZSAvIDEwNDg1NzYsXHJcbiAgICAgICAgMlxyXG4gICAgICApfW1iIHdoZW4gbWF4IHNpemUgaXMgNW1iYDtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1bGwoXHJcbiAgICAgIGZpbGVSZWFkZXIoZmlyc3QpLFxyXG4gICAgICBzYm90LmJsb2JzLmFkZChmdW5jdGlvbihlcnIsIGhhc2gpIHtcclxuICAgICAgICAvLyAnaGFzaCcgaXMgdGhlIGhhc2gtaWQgb2YgdGhlIGJsb2JcclxuICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICBlcnJvciA9IHRydWU7XHJcbiAgICAgICAgICBtc2cgPSBcIkNvdWxkbid0IGF0dGFjaCBmaWxlOiBcIiArIGVycjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29udGVudCArPSBgICFbJHtmaXJzdC5uYW1lfV0oJHtoYXNofSlgO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaWxlT25Ub3AgPSBmYWxzZTtcclxuICAgICAgfSlcclxuICAgICk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgcG9zdCA9IGFzeW5jIGV2ID0+IHtcclxuICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICBpZiAoIXBvc3RpbmcpIHtcclxuICAgICAgcG9zdGluZyA9IHRydWU7XHJcblxyXG4gICAgICBpZiAoY2hhbm5lbC5zdGFydHNXaXRoKFwiI1wiKSkge1xyXG4gICAgICAgIGNoYW5uZWwgPSBjaGFubmVsLnNsaWNlKDEpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0cnkge1xyXG4gICAgICAgIG1zZyA9IGF3YWl0IHNzYi5uZXdQb3N0KHtcclxuICAgICAgICAgIHRleHQ6IGNvbnRlbnQsXHJcbiAgICAgICAgICBjaGFubmVsLFxyXG4gICAgICAgICAgcm9vdCxcclxuICAgICAgICAgIGJyYW5jaCxcclxuICAgICAgICAgIGZvcmssXHJcbiAgICAgICAgICBjb250ZW50V2FybmluZzogY29udGVudFdhcm5pbmcubGVuZ3RoID4gMCA/IGNvbnRlbnRXYXJuaW5nIDogdW5kZWZpbmVkXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcG9zdGluZyA9IGZhbHNlO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwicG9zdGVkXCIsIG1zZyk7XHJcbiAgICAgICAgd2luZG93LnNjcm9sbFRvKDAsIDApO1xyXG4gICAgICB9IGNhdGNoIChuKSB7XHJcbiAgICAgICAgZXJyb3IgPSB0cnVlO1xyXG4gICAgICAgIG1zZyA9IGBDb3VsZG4ndCBwb3N0IHlvdXIgbWVzc2FnZTogJHtufWA7XHJcbiAgICAgICAgd2luZG93LnNjcm9sbFRvKDAsIDApO1xyXG5cclxuICAgICAgICBpZiAobXNnLm1lc3NhZ2UgPT0gXCJzdHJlYW0gaXMgY2xvc2VkXCIpIHtcclxuICAgICAgICAgIG1zZyArPSBcIi4gV2UgbG9zdCBjb25uZWN0aW9uIHRvIHNib3QuIFdlJ2xsIHRyeSB0byByZXN0YWJsaXNoIGl0Li4uXCI7XHJcblxyXG4gICAgICAgICAgcmVjb25uZWN0KClcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgIHNob3dQcmV2aWV3ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgcG9zdGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgIGVycm9yID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgbXNnID0gXCJDb25uZWN0aW9uIHRvIHNib3QgcmVlc3RhYmxpc2hlZC4gVHJ5IHBvc3RpbmcgYWdhaW5cIjtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnNlYXJjaCA9IGA/cm9vdD0ke2VuY29kZVVSSUNvbXBvbmVudChcclxuICAgICAgICAgICAgICAgIHJvb3RcclxuICAgICAgICAgICAgICApfSZicmFuY2g9JHtlbmNvZGVVUklDb21wb25lbnQoXHJcbiAgICAgICAgICAgICAgICBicmFuY2hcclxuICAgICAgICAgICAgICApfSZjb250ZW50PSR7ZW5jb2RlVVJJQ29tcG9uZW50KFxyXG4gICAgICAgICAgICAgICAgY29udGVudFxyXG4gICAgICAgICAgICAgICl9JmNoYW5uZWw9JHtlbmNvZGVVUklDb21wb25lbnQoY2hhbm5lbCl9YDtcclxuICAgICAgICAgICAgICBtc2cgPSBgU29ycnksIGNvdWxkbid0IHJlY29ubmVjdCB0byBzYm90OiR7ZXJyfS4gVHJ5IHJlbG9hZGluZyB0aGUgcGFnZS4gWW91ciBjb250ZW50IGhhcyBiZWVuIHNhdmVkIHRvIHRoZSBVUkxgO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjb25zdCBwcmV2aWV3ID0gZXYgPT4ge1xyXG4gICAgc2hvd1ByZXZpZXcgPSB0cnVlO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IHNhdmVUb1VSTCA9IGV2ID0+IHtcclxuICAgIHdpbmRvdy5sb2NhdGlvbi5zZWFyY2ggPSBgP3Jvb3Q9JHtlbmNvZGVVUklDb21wb25lbnQoXHJcbiAgICAgIHJvb3RcclxuICAgICl9JmJyYW5jaD0ke2VuY29kZVVSSUNvbXBvbmVudChicmFuY2gpfSZjb250ZW50PSR7ZW5jb2RlVVJJQ29tcG9uZW50KFxyXG4gICAgICBjb250ZW50XHJcbiAgICApfSZjaGFubmVsPSR7ZW5jb2RlVVJJQ29tcG9uZW50KGNoYW5uZWwpfWA7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgYXZhdGFyQ2xpY2sgPSBldiA9PiB7XHJcbiAgICBsZXQgZmVlZCA9IGV2LmRldGFpbC5mZWVkO1xyXG4gICAgbGV0IG5hbWUgPSBldi5kZXRhaWwubmFtZTtcclxuXHJcbiAgICBpZiAoY29udGVudC5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGNvbnRlbnQgKz0gYCBbJHtuYW1lfV0oJHtmZWVkfSlgO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29udGVudCA9IGBbJHtuYW1lfV0oJHtmZWVkfSlgO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IGRyYWdPdmVyID0gZXYgPT4ge1xyXG4gICAgZmlsZU9uVG9wID0gdHJ1ZTtcclxuICB9O1xyXG5cclxuICBjb25zdCBkcmFnTGVhdmUgPSBldiA9PiB7XHJcbiAgICBmaWxlT25Ub3AgPSBmYWxzZTtcclxuICB9O1xyXG5cclxuICBjb25zdCBhdHRhY2hGaWxlVHJpZ2dlciA9ICgpID0+IHtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlsZUlucHV0XCIpLmNsaWNrKCk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgYXR0YWNoRmlsZUlQRlNUcmlnZ2VyID0gKCkgPT4ge1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWxlSW5wdXRJUEZTXCIpLmNsaWNrKCk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgYXR0YWNoRmlsZSA9IGV2ID0+IHtcclxuICAgIGNvbnN0IGZpbGVzID0gZXYudGFyZ2V0LmZpbGVzO1xyXG4gICAgcmVhZEZpbGVBbmRBdHRhY2goZmlsZXMpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IGF0dGFjaEZpbGVJUEZTID0gZXYgPT4ge1xyXG4gICAgY29uc3QgZmlsZXMgPSBldi50YXJnZXQuZmlsZXM7XHJcbiAgICByZWFkRmlsZUFuZEF0dGFjaElQRlMoZmlsZXMpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IHJlYWRGaWxlQW5kQXR0YWNoSVBGUyA9IGFzeW5jIGZpbGVzID0+IHtcclxuICAgIGVycm9yID0gZmFsc2U7XHJcbiAgICBtc2cgPSBcIlwiO1xyXG5cclxuICAgIHZhciBpcGZzID0gd2luZG93LklwZnNIdHRwQ2xpZW50KFwiMTI3LjAuMC4xXCIsIFwiNTAwMVwiKTtcclxuICAgIGNvbnN0IHJlc3VsdHMgPSBhd2FpdCBpcGZzLmFkZChmaWxlc1swXSk7XHJcblxyXG4gICAgY29uc29sZS5sb2coXCJhZGRlZCB2aWEgSVBGU1wiLCByZXN1bHRzKTtcclxuICAgIGNvbnRlbnQgKz0gYCBbJHtyZXN1bHRzWzBdLnBhdGh9XShpcGZzOi8vJHtyZXN1bHRzWzBdLmhhc2h9KWA7XHJcbiAgfTtcclxuXHJcbiAgbGV0IHNob3dDb250ZW50V2FybmluZ0ZpZWxkID0gZmFsc2U7XHJcblxyXG4gIGNvbnN0IHRvZ2dsZUNvbnRlbnRXYXJuaW5nID0gKCkgPT5cclxuICAgIChzaG93Q29udGVudFdhcm5pbmdGaWVsZCA9ICFzaG93Q29udGVudFdhcm5pbmdGaWVsZCk7XHJcblxyXG4gIGxldCBjb250ZW50V2FybmluZyA9IFwiXCI7XHJcbjwvc2NyaXB0PlxyXG5cclxuPHN0eWxlPlxyXG4gIC5maWxlLW9uLXRvcCB7XHJcbiAgICBib3JkZXI6IHNvbGlkIDJweCByZ2IoMjYsIDE5MiwgMTEpO1xyXG4gIH1cclxuXHJcbiAgaW5wdXRbdHlwZT1cImZpbGVcIl0ge1xyXG4gICAgZGlzcGxheTogbm9uZTtcclxuICB9XHJcbjwvc3R5bGU+XHJcblxyXG48ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+XHJcbiAgPGRpdiBjbGFzcz1cImNvbHVtbnNcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJjb2x1bW5cIj5cclxuICAgICAgeyNpZiBmb3JrfVxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0b2FzdCB0b2FzdC13YXJuaW5nXCI+WW91IGFyZSBmb3JraW5nOiB7Zm9ya308L2Rpdj5cclxuICAgICAgey9pZn1cclxuICAgICAgeyNpZiBtc2d9XHJcbiAgICAgICAgeyNpZiBlcnJvcn1cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0b2FzdCB0b2FzdC1lcnJvclwiPnttc2d9PC9kaXY+XHJcbiAgICAgICAgezplbHNlfVxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInRvYXN0IHRvYXN0LXN1Y2Nlc3NcIj5cclxuICAgICAgICAgICAgWW91ciBtZXNzYWdlIGhhcyBiZWVuIHBvc3RlZC4gRG8geW91IHdhbnQgdG9cclxuICAgICAgICAgICAgPGFcclxuICAgICAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIlxyXG4gICAgICAgICAgICAgIGhyZWY9XCI/dGhyZWFkPXtlbmNvZGVVUklDb21wb25lbnQobXNnLmtleSl9Iy90aHJlYWRcIj5cclxuICAgICAgICAgICAgICBDaGVjayBpdCBvdXQ/XHJcbiAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIHsvaWZ9XHJcbiAgICAgIHsvaWZ9XHJcbiAgICAgIHsjaWYgIXNob3dQcmV2aWV3fVxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCIgaW46c2xpZGUgb3V0OnNsaWRlPlxyXG4gICAgICAgICAgPGxhYmVsIGNsYXNzPVwiZm9ybS1sYWJlbFwiIGZvcj1cImNoYW5uZWxcIj5DaGFubmVsPC9sYWJlbD5cclxuICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICBjbGFzcz1cImZvcm0taW5wdXRcIlxyXG4gICAgICAgICAgICB0eXBlPVwidGV4dFwiXHJcbiAgICAgICAgICAgIGlkPVwiY2hhbm5lbFwiXHJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiY2hhbm5lbFwiXHJcbiAgICAgICAgICAgIGJpbmQ6dmFsdWU9e2NoYW5uZWx9IC8+XHJcblxyXG4gICAgICAgICAgeyNpZiBicmFuY2h9XHJcbiAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImZvcm0tbGFiZWxcIiBmb3I9XCJyZXBseS10b1wiPkluIHJlcGx5IHRvPC9sYWJlbD5cclxuICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgY2xhc3M9XCJmb3JtLWlucHV0XCJcclxuICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiXHJcbiAgICAgICAgICAgICAgaWQ9XCJyZXBseS10b1wiXHJcbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJpbiByZXBseSB0b1wiXHJcbiAgICAgICAgICAgICAgYmluZDp2YWx1ZT17YnJhbmNofSAvPlxyXG4gICAgICAgICAgey9pZn1cclxuXHJcbiAgICAgICAgICB7I2lmIHJlcGx5ZmVlZH1cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm10LTJcIj5cclxuICAgICAgICAgICAgICA8c3Bhbj5cclxuICAgICAgICAgICAgICAgIENsaWNrIHRoZSBhdmF0YXIgdG8gYWRkIGEgbGluayB0byB0aGUgbWVzc2FnZTpcclxuICAgICAgICAgICAgICAgIDxBdmF0YXJDaGlwIGZlZWQ9e3JlcGx5ZmVlZH0gb246YXZhdGFyQ2xpY2s9e2F2YXRhckNsaWNrfSAvPlxyXG4gICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICB7L2lmfVxyXG4gICAgICAgICAgPGxhYmVsIGNsYXNzPVwiZm9ybS1sYWJlbFwiIGZvcj1cImNvbnRlbnRcIj5NZXNzYWdlPC9sYWJlbD5cclxuICAgICAgICAgIDx0ZXh0YXJlYVxyXG4gICAgICAgICAgICBjbGFzcz1cImZvcm0taW5wdXRcIlxyXG4gICAgICAgICAgICBpZD1cImNvbnRlbnRcIlxyXG4gICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlR5cGUgaW4geW91ciBwb3N0XCJcclxuICAgICAgICAgICAgcm93cz1cIjEwXCJcclxuICAgICAgICAgICAgb246ZHJhZ292ZXJ8cHJldmVudERlZmF1bHR8c3RvcFByb3BhZ2F0aW9uPXtkcmFnT3Zlcn1cclxuICAgICAgICAgICAgb246ZHJhZ2xlYXZlfHByZXZlbnREZWZhdWx0fHN0b3BQcm9wYWdhdGlvbj17ZHJhZ0xlYXZlfVxyXG4gICAgICAgICAgICBjbGFzczpmaWxlLW9uLXRvcD17ZmlsZU9uVG9wfVxyXG4gICAgICAgICAgICBiaW5kOnZhbHVlPXtjb250ZW50fSAvPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImQtYmxvY2sgbS0yXCI+XHJcbiAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWxpbmtcIiBvbjpjbGljaz17dG9nZ2xlQ29udGVudFdhcm5pbmd9PlxyXG4gICAgICAgICAgICAgIENXXHJcbiAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICB7I2lmIHNob3dDb250ZW50V2FybmluZ0ZpZWxkfVxyXG4gICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIlxyXG4gICAgICAgICAgICAgICAgc2l6ZT1cIjUwXCJcclxuICAgICAgICAgICAgICAgIGJpbmQ6dmFsdWU9e2NvbnRlbnRXYXJuaW5nfVxyXG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJEZXNjcmliZSB5b3VyIGNvbnRlbnQgd2FybmluZyAobGVhdmUgZW1wdHkgdG8gbm8gdXNlIGl0KVwiIC8+XHJcbiAgICAgICAgICAgIHsvaWZ9XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiIG9uOmlucHV0PXthdHRhY2hGaWxlfSBpZD1cImZpbGVJbnB1dFwiIC8+XHJcbiAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuXCIgb246Y2xpY2s9e2F0dGFjaEZpbGVUcmlnZ2VyfT5BdHRhY2ggRmlsZTwvYnV0dG9uPlxyXG4gICAgICAgICAgeyNpZiBpcGZzRGFlbW9uUnVubmluZ31cclxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJmaWxlXCIgb246aW5wdXQ9e2F0dGFjaEZpbGVJUEZTfSBpZD1cImZpbGVJbnB1dElQRlNcIiAvPlxyXG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuXCIgb246Y2xpY2s9e2F0dGFjaEZpbGVJUEZTVHJpZ2dlcn0+XHJcbiAgICAgICAgICAgICAgQXR0YWNoIEZpbGUgdXNpbmcgSVBGU1xyXG4gICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgIHsvaWZ9XHJcbiAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5IGZsb2F0LXJpZ2h0XCIgb246Y2xpY2s9e3ByZXZpZXd9PlxyXG4gICAgICAgICAgICBQcmV2aWV3XHJcbiAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgezplbHNlfVxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb2x1bW4gY29sLW1kLTEyXCI+XHJcbiAgICAgICAgICA8aDI+UG9zdCBwcmV2aWV3PC9oMj5cclxuICAgICAgICAgIHsjaWYgY2hhbm5lbCB8fCByb290IHx8IGJyYW5jaCB8fCBjb250ZW50V2FybmluZy5sZW5ndGggPiAwfVxyXG4gICAgICAgICAgICA8YmxvY2txdW90ZT5cclxuICAgICAgICAgICAgICB7I2lmIGNoYW5uZWx9XHJcbiAgICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgICAgPGI+Q2hhbm5lbDo8L2I+XHJcbiAgICAgICAgICAgICAgICAgIHtjaGFubmVsLnN0YXJ0c1dpdGgoJyMnKSA/IGNoYW5uZWwuc2xpY2UoMSkgOiBjaGFubmVsfVxyXG4gICAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgIHsvaWZ9XHJcbiAgICAgICAgICAgICAgeyNpZiByb290fVxyXG4gICAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICAgIDxiPlJvb3Q6PC9iPlxyXG4gICAgICAgICAgICAgICAgICB7cm9vdH1cclxuICAgICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICB7L2lmfVxyXG4gICAgICAgICAgICAgIHsjaWYgYnJhbmNofVxyXG4gICAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICAgIDxiPkluIFJlcGx5IFRvOjwvYj5cclxuICAgICAgICAgICAgICAgICAge2JyYW5jaH1cclxuICAgICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICB7L2lmfVxyXG4gICAgICAgICAgICAgIHsjaWYgY29udGVudFdhcm5pbmcubGVuZ3RoID4gMH1cclxuICAgICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgICA8Yj5Db250ZW50IFdhcm5pbmc6PC9iPlxyXG4gICAgICAgICAgICAgICAgICB7Y29udGVudFdhcm5pbmd9XHJcbiAgICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgey9pZn1cclxuICAgICAgICAgICAgPC9ibG9ja3F1b3RlPlxyXG4gICAgICAgICAgey9pZn1cclxuICAgICAgICAgIHtAaHRtbCBzc2IubWFya2Rvd24oY29udGVudCl9XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImRpdmlkZXJcIiAvPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImNvbHVtbnNcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbHVtbiBjb2wtbWQtMTIgY29sLWxnLTEwXCI+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJsYWJlbCBsYWJlbC13YXJuaW5nXCI+XHJcbiAgICAgICAgICAgICAgICBUaGlzIG1lc3NhZ2Ugd2lsbCBiZSBwdWJsaWMgYW5kIGNhbid0IGJlIGVkaXRlZCBvciBkZWxldGVkXHJcbiAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbHVtbiBjb2wtbWQtMTIgY29sLWxnLTJcIj5cclxuICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuXCIgb246Y2xpY2s9eygpID0+IChzaG93UHJldmlldyA9IGZhbHNlKX0+XHJcbiAgICAgICAgICAgICAgICBHbyBCYWNrXHJcbiAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIlxyXG4gICAgICAgICAgICAgICAgY2xhc3M6bG9hZGluZz17cG9zdGluZ31cclxuICAgICAgICAgICAgICAgIG9uOmNsaWNrPXtwb3N0fT5cclxuICAgICAgICAgICAgICAgIFBvc3RcclxuICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgey9pZn1cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG48L2Rpdj5cclxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQWlORSxZQUFZLGNBQUMsQ0FBQyxBQUNaLE1BQU0sQ0FBRSxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEFBQ3BDLENBQUMsQUFFRCxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFDLENBQUMsQUFDbEIsT0FBTyxDQUFFLElBQUksQUFDZixDQUFDIn0= */";
    	append(document.head, style);
    }

    // (222:6) {#if fork}
    function create_if_block_12(ctx) {
    	var div, t0, t1;

    	return {
    		c: function create() {
    			div = element("div");
    			t0 = text("You are forking: ");
    			t1 = text(ctx.fork);
    			div.className = "toast toast-warning";
    			add_location(div, file$d, 222, 8, 5721);
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			append(div, t0);
    			append(div, t1);
    		},

    		p: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}
    		}
    	};
    }

    // (225:6) {#if msg}
    function create_if_block_10(ctx) {
    	var if_block_anchor;

    	function select_block_type(ctx) {
    		if (ctx.error) return create_if_block_11;
    		return create_else_block_1$3;
    	}

    	var current_block_type = select_block_type(ctx);
    	var if_block = current_block_type(ctx);

    	return {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},

    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    		},

    		p: function update(changed, ctx) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(changed, ctx);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);
    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},

    		d: function destroy(detaching) {
    			if_block.d(detaching);

    			if (detaching) {
    				detach(if_block_anchor);
    			}
    		}
    	};
    }

    // (228:8) {:else}
    function create_else_block_1$3(ctx) {
    	var div, t0, a, t1, a_href_value;

    	return {
    		c: function create() {
    			div = element("div");
    			t0 = text("Your message has been posted. Do you want to\r\n            ");
    			a = element("a");
    			t1 = text("Check it out?");
    			a.target = "_blank";
    			a.href = a_href_value = "?thread=" + ctx.encodeURIComponent(ctx.msg.key) + "#/thread";
    			add_location(a, file$d, 230, 12, 6022);
    			div.className = "toast toast-success";
    			add_location(div, file$d, 228, 10, 5917);
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			append(div, t0);
    			append(div, a);
    			append(a, t1);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.msg) && a_href_value !== (a_href_value = "?thread=" + ctx.encodeURIComponent(ctx.msg.key) + "#/thread")) {
    				a.href = a_href_value;
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}
    		}
    	};
    }

    // (226:8) {#if error}
    function create_if_block_11(ctx) {
    	var div, t;

    	return {
    		c: function create() {
    			div = element("div");
    			t = text(ctx.msg);
    			div.className = "toast toast-error";
    			add_location(div, file$d, 226, 10, 5846);
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			append(div, t);
    		},

    		p: function update(changed, ctx) {
    			if (changed.msg) {
    				set_data(t, ctx.msg);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}
    		}
    	};
    }

    // (301:6) {:else}
    function create_else_block$6(ctx) {
    	var div4, h2, t1, t2, raw_value = ctx.ssb.markdown(ctx.content), raw_before, raw_after, t3, div0, t4, div3, div1, span, t6, div2, button0, t8, button1, dispose;

    	var if_block = (ctx.channel || ctx.root || ctx.branch || ctx.contentWarning.length > 0) && create_if_block_5$1(ctx);

    	return {
    		c: function create() {
    			div4 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Post preview";
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			raw_before = element('noscript');
    			raw_after = element('noscript');
    			t3 = space();
    			div0 = element("div");
    			t4 = space();
    			div3 = element("div");
    			div1 = element("div");
    			span = element("span");
    			span.textContent = "This message will be public and can't be edited or deleted";
    			t6 = space();
    			div2 = element("div");
    			button0 = element("button");
    			button0.textContent = "Go Back";
    			t8 = space();
    			button1 = element("button");
    			button1.textContent = "Post";
    			add_location(h2, file$d, 302, 10, 8615);
    			div0.className = "divider";
    			add_location(div0, file$d, 333, 10, 9532);
    			span.className = "label label-warning";
    			add_location(span, file$d, 336, 14, 9658);
    			div1.className = "column col-md-12 col-lg-10";
    			add_location(div1, file$d, 335, 12, 9602);
    			button0.className = "btn";
    			add_location(button0, file$d, 341, 14, 9880);
    			button1.className = "btn btn-primary";
    			toggle_class(button1, "loading", ctx.posting);
    			add_location(button1, file$d, 344, 14, 10005);
    			div2.className = "column col-md-12 col-lg-2";
    			add_location(div2, file$d, 340, 12, 9825);
    			div3.className = "columns";
    			add_location(div3, file$d, 334, 10, 9567);
    			div4.className = "column col-md-12";
    			add_location(div4, file$d, 301, 8, 8573);

    			dispose = [
    				listen(button0, "click", ctx.click_handler),
    				listen(button1, "click", ctx.post)
    			];
    		},

    		m: function mount(target, anchor) {
    			insert(target, div4, anchor);
    			append(div4, h2);
    			append(div4, t1);
    			if (if_block) if_block.m(div4, null);
    			append(div4, t2);
    			append(div4, raw_before);
    			raw_before.insertAdjacentHTML("afterend", raw_value);
    			append(div4, raw_after);
    			append(div4, t3);
    			append(div4, div0);
    			append(div4, t4);
    			append(div4, div3);
    			append(div3, div1);
    			append(div1, span);
    			append(div3, t6);
    			append(div3, div2);
    			append(div2, button0);
    			append(div2, t8);
    			append(div2, button1);
    		},

    		p: function update(changed, ctx) {
    			if (ctx.channel || ctx.root || ctx.branch || ctx.contentWarning.length > 0) {
    				if (if_block) {
    					if_block.p(changed, ctx);
    				} else {
    					if_block = create_if_block_5$1(ctx);
    					if_block.c();
    					if_block.m(div4, t2);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if ((changed.content) && raw_value !== (raw_value = ctx.ssb.markdown(ctx.content))) {
    				detach_between(raw_before, raw_after);
    				raw_before.insertAdjacentHTML("afterend", raw_value);
    			}

    			if (changed.posting) {
    				toggle_class(button1, "loading", ctx.posting);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div4);
    			}

    			if (if_block) if_block.d();
    			run_all(dispose);
    		}
    	};
    }

    // (239:6) {#if !showPreview}
    function create_if_block$6(ctx) {
    	var div1, label0, t1, input0, t2, t3, t4, label1, t6, textarea, t7, div0, button0, t9, t10, input1, t11, button1, t13, t14, button2, div1_intro, div1_outro, current, dispose;

    	var if_block0 = (ctx.branch) && create_if_block_4$1(ctx);

    	var if_block1 = (ctx.replyfeed) && create_if_block_3$3(ctx);

    	var if_block2 = (ctx.showContentWarningField) && create_if_block_2$4(ctx);

    	var if_block3 = (ctx.ipfsDaemonRunning) && create_if_block_1$5(ctx);

    	return {
    		c: function create() {
    			div1 = element("div");
    			label0 = element("label");
    			label0.textContent = "Channel";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			if (if_block0) if_block0.c();
    			t3 = space();
    			if (if_block1) if_block1.c();
    			t4 = space();
    			label1 = element("label");
    			label1.textContent = "Message";
    			t6 = space();
    			textarea = element("textarea");
    			t7 = space();
    			div0 = element("div");
    			button0 = element("button");
    			button0.textContent = "CW";
    			t9 = space();
    			if (if_block2) if_block2.c();
    			t10 = space();
    			input1 = element("input");
    			t11 = space();
    			button1 = element("button");
    			button1.textContent = "Attach File";
    			t13 = space();
    			if (if_block3) if_block3.c();
    			t14 = space();
    			button2 = element("button");
    			button2.textContent = "Preview";
    			label0.className = "form-label";
    			label0.htmlFor = "channel";
    			add_location(label0, file$d, 240, 10, 6308);
    			input0.className = "form-input";
    			attr(input0, "type", "text");
    			input0.id = "channel";
    			input0.placeholder = "channel";
    			add_location(input0, file$d, 241, 10, 6375);
    			label1.className = "form-label";
    			label1.htmlFor = "content";
    			add_location(label1, file$d, 266, 10, 7139);
    			textarea.className = "form-input svelte-olsuyr";
    			textarea.id = "content";
    			textarea.placeholder = "Type in your post";
    			textarea.rows = "10";
    			toggle_class(textarea, "file-on-top", ctx.fileOnTop);
    			add_location(textarea, file$d, 267, 10, 7206);
    			button0.className = "btn btn-link";
    			add_location(button0, file$d, 277, 12, 7608);
    			div0.className = "d-block m-2";
    			add_location(div0, file$d, 276, 10, 7569);
    			attr(input1, "type", "file");
    			input1.id = "fileInput";
    			input1.className = "svelte-olsuyr";
    			add_location(input1, file$d, 288, 10, 8016);
    			button1.className = "btn";
    			add_location(button1, file$d, 289, 10, 8086);
    			button2.className = "btn btn-primary float-right";
    			add_location(button2, file$d, 296, 10, 8427);
    			div1.className = "form-group";
    			add_location(div1, file$d, 239, 8, 6253);

    			dispose = [
    				listen(input0, "input", ctx.input0_input_handler),
    				listen(textarea, "input", ctx.textarea_input_handler),
    				listen(textarea, "dragover", stop_propagation(prevent_default(ctx.dragOver))),
    				listen(textarea, "dragleave", stop_propagation(prevent_default(ctx.dragLeave))),
    				listen(button0, "click", ctx.toggleContentWarning),
    				listen(input1, "input", ctx.attachFile),
    				listen(button1, "click", ctx.attachFileTrigger),
    				listen(button2, "click", ctx.preview)
    			];
    		},

    		m: function mount(target, anchor) {
    			insert(target, div1, anchor);
    			append(div1, label0);
    			append(div1, t1);
    			append(div1, input0);

    			input0.value = ctx.channel;

    			append(div1, t2);
    			if (if_block0) if_block0.m(div1, null);
    			append(div1, t3);
    			if (if_block1) if_block1.m(div1, null);
    			append(div1, t4);
    			append(div1, label1);
    			append(div1, t6);
    			append(div1, textarea);

    			textarea.value = ctx.content;

    			append(div1, t7);
    			append(div1, div0);
    			append(div0, button0);
    			append(div0, t9);
    			if (if_block2) if_block2.m(div0, null);
    			append(div1, t10);
    			append(div1, input1);
    			append(div1, t11);
    			append(div1, button1);
    			append(div1, t13);
    			if (if_block3) if_block3.m(div1, null);
    			append(div1, t14);
    			append(div1, button2);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (changed.channel && (input0.value !== ctx.channel)) input0.value = ctx.channel;

    			if (ctx.branch) {
    				if (if_block0) {
    					if_block0.p(changed, ctx);
    				} else {
    					if_block0 = create_if_block_4$1(ctx);
    					if_block0.c();
    					if_block0.m(div1, t3);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (ctx.replyfeed) {
    				if (if_block1) {
    					if_block1.p(changed, ctx);
    					if_block1.i(1);
    				} else {
    					if_block1 = create_if_block_3$3(ctx);
    					if_block1.c();
    					if_block1.i(1);
    					if_block1.m(div1, t4);
    				}
    			} else if (if_block1) {
    				group_outros();
    				on_outro(() => {
    					if_block1.d(1);
    					if_block1 = null;
    				});

    				if_block1.o(1);
    				check_outros();
    			}

    			if (changed.content) textarea.value = ctx.content;

    			if (changed.fileOnTop) {
    				toggle_class(textarea, "file-on-top", ctx.fileOnTop);
    			}

    			if (ctx.showContentWarningField) {
    				if (if_block2) {
    					if_block2.p(changed, ctx);
    				} else {
    					if_block2 = create_if_block_2$4(ctx);
    					if_block2.c();
    					if_block2.m(div0, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (ctx.ipfsDaemonRunning) {
    				if (if_block3) {
    					if_block3.p(changed, ctx);
    				} else {
    					if_block3 = create_if_block_1$5(ctx);
    					if_block3.c();
    					if_block3.m(div1, t14);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			if (if_block1) if_block1.i();

    			add_render_callback(() => {
    				if (div1_outro) div1_outro.end(1);
    				if (!div1_intro) div1_intro = create_in_transition(div1, slide, {});
    				div1_intro.start();
    			});

    			current = true;
    		},

    		o: function outro(local) {
    			if (if_block1) if_block1.o();
    			if (div1_intro) div1_intro.invalidate();

    			if (local) {
    				div1_outro = create_out_transition(div1, slide, {});
    			}

    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div1);
    			}

    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();

    			if (detaching) {
    				if (div1_outro) div1_outro.end();
    			}

    			run_all(dispose);
    		}
    	};
    }

    // (304:10) {#if channel || root || branch || contentWarning.length > 0}
    function create_if_block_5$1(ctx) {
    	var blockquote, t0, t1, t2;

    	var if_block0 = (ctx.channel) && create_if_block_9(ctx);

    	var if_block1 = (ctx.root) && create_if_block_8(ctx);

    	var if_block2 = (ctx.branch) && create_if_block_7(ctx);

    	var if_block3 = (ctx.contentWarning.length > 0) && create_if_block_6$1(ctx);

    	return {
    		c: function create() {
    			blockquote = element("blockquote");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			if (if_block3) if_block3.c();
    			add_location(blockquote, file$d, 304, 12, 8722);
    		},

    		m: function mount(target, anchor) {
    			insert(target, blockquote, anchor);
    			if (if_block0) if_block0.m(blockquote, null);
    			append(blockquote, t0);
    			if (if_block1) if_block1.m(blockquote, null);
    			append(blockquote, t1);
    			if (if_block2) if_block2.m(blockquote, null);
    			append(blockquote, t2);
    			if (if_block3) if_block3.m(blockquote, null);
    		},

    		p: function update(changed, ctx) {
    			if (ctx.channel) {
    				if (if_block0) {
    					if_block0.p(changed, ctx);
    				} else {
    					if_block0 = create_if_block_9(ctx);
    					if_block0.c();
    					if_block0.m(blockquote, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (ctx.root) {
    				if (if_block1) {
    					if_block1.p(changed, ctx);
    				} else {
    					if_block1 = create_if_block_8(ctx);
    					if_block1.c();
    					if_block1.m(blockquote, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (ctx.branch) {
    				if (if_block2) {
    					if_block2.p(changed, ctx);
    				} else {
    					if_block2 = create_if_block_7(ctx);
    					if_block2.c();
    					if_block2.m(blockquote, t2);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (ctx.contentWarning.length > 0) {
    				if (if_block3) {
    					if_block3.p(changed, ctx);
    				} else {
    					if_block3 = create_if_block_6$1(ctx);
    					if_block3.c();
    					if_block3.m(blockquote, null);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(blockquote);
    			}

    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    		}
    	};
    }

    // (306:14) {#if channel}
    function create_if_block_9(ctx) {
    	var p, b, t1, t2_value = ctx.channel.startsWith('#') ? ctx.channel.slice(1) : ctx.channel, t2;

    	return {
    		c: function create() {
    			p = element("p");
    			b = element("b");
    			b.textContent = "Channel:";
    			t1 = space();
    			t2 = text(t2_value);
    			add_location(b, file$d, 307, 18, 8804);
    			add_location(p, file$d, 306, 16, 8781);
    		},

    		m: function mount(target, anchor) {
    			insert(target, p, anchor);
    			append(p, b);
    			append(p, t1);
    			append(p, t2);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.channel) && t2_value !== (t2_value = ctx.channel.startsWith('#') ? ctx.channel.slice(1) : ctx.channel)) {
    				set_data(t2, t2_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(p);
    			}
    		}
    	};
    }

    // (312:14) {#if root}
    function create_if_block_8(ctx) {
    	var p, b, t1, t2;

    	return {
    		c: function create() {
    			p = element("p");
    			b = element("b");
    			b.textContent = "Root:";
    			t1 = space();
    			t2 = text(ctx.root);
    			add_location(b, file$d, 313, 18, 9003);
    			add_location(p, file$d, 312, 16, 8980);
    		},

    		m: function mount(target, anchor) {
    			insert(target, p, anchor);
    			append(p, b);
    			append(p, t1);
    			append(p, t2);
    		},

    		p: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(p);
    			}
    		}
    	};
    }

    // (318:14) {#if branch}
    function create_if_block_7(ctx) {
    	var p, b, t1, t2;

    	return {
    		c: function create() {
    			p = element("p");
    			b = element("b");
    			b.textContent = "In Reply To:";
    			t1 = space();
    			t2 = text(ctx.branch);
    			add_location(b, file$d, 319, 18, 9153);
    			add_location(p, file$d, 318, 16, 9130);
    		},

    		m: function mount(target, anchor) {
    			insert(target, p, anchor);
    			append(p, b);
    			append(p, t1);
    			append(p, t2);
    		},

    		p: function update(changed, ctx) {
    			if (changed.branch) {
    				set_data(t2, ctx.branch);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(p);
    			}
    		}
    	};
    }

    // (324:14) {#if contentWarning.length > 0}
    function create_if_block_6$1(ctx) {
    	var p, b, t1, t2;

    	return {
    		c: function create() {
    			p = element("p");
    			b = element("b");
    			b.textContent = "Content Warning:";
    			t1 = space();
    			t2 = text(ctx.contentWarning);
    			add_location(b, file$d, 325, 18, 9331);
    			add_location(p, file$d, 324, 16, 9308);
    		},

    		m: function mount(target, anchor) {
    			insert(target, p, anchor);
    			append(p, b);
    			append(p, t1);
    			append(p, t2);
    		},

    		p: function update(changed, ctx) {
    			if (changed.contentWarning) {
    				set_data(t2, ctx.contentWarning);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(p);
    			}
    		}
    	};
    }

    // (249:10) {#if branch}
    function create_if_block_4$1(ctx) {
    	var label, t_1, input, dispose;

    	return {
    		c: function create() {
    			label = element("label");
    			label.textContent = "In reply to";
    			t_1 = space();
    			input = element("input");
    			label.className = "form-label";
    			label.htmlFor = "reply-to";
    			add_location(label, file$d, 249, 12, 6576);
    			input.className = "form-input";
    			attr(input, "type", "text");
    			input.id = "reply-to";
    			input.placeholder = "in reply to";
    			add_location(input, file$d, 250, 12, 6650);
    			dispose = listen(input, "input", ctx.input_input_handler);
    		},

    		m: function mount(target, anchor) {
    			insert(target, label, anchor);
    			insert(target, t_1, anchor);
    			insert(target, input, anchor);

    			input.value = ctx.branch;
    		},

    		p: function update(changed, ctx) {
    			if (changed.branch && (input.value !== ctx.branch)) input.value = ctx.branch;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(label);
    				detach(t_1);
    				detach(input);
    			}

    			dispose();
    		}
    	};
    }

    // (259:10) {#if replyfeed}
    function create_if_block_3$3(ctx) {
    	var div, span, t, current;

    	var avatarchip = new AvatarChip({
    		props: { feed: ctx.replyfeed },
    		$$inline: true
    	});
    	avatarchip.$on("avatarClick", ctx.avatarClick);

    	return {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			t = text("Click the avatar to add a link to the message:\r\n                ");
    			avatarchip.$$.fragment.c();
    			add_location(span, file$d, 260, 14, 6919);
    			div.className = "mt-2";
    			add_location(div, file$d, 259, 12, 6885);
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			append(div, span);
    			append(span, t);
    			mount_component(avatarchip, span, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var avatarchip_changes = {};
    			if (changed.replyfeed) avatarchip_changes.feed = ctx.replyfeed;
    			avatarchip.$set(avatarchip_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			avatarchip.$$.fragment.i(local);

    			current = true;
    		},

    		o: function outro(local) {
    			avatarchip.$$.fragment.o(local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			avatarchip.$destroy();
    		}
    	};
    }

    // (281:12) {#if showContentWarningField}
    function create_if_block_2$4(ctx) {
    	var input, dispose;

    	return {
    		c: function create() {
    			input = element("input");
    			attr(input, "type", "text");
    			input.size = "50";
    			input.placeholder = "Describe your content warning (leave empty to no use it)";
    			add_location(input, file$d, 281, 14, 7769);
    			dispose = listen(input, "input", ctx.input_input_handler_1);
    		},

    		m: function mount(target, anchor) {
    			insert(target, input, anchor);

    			input.value = ctx.contentWarning;
    		},

    		p: function update(changed, ctx) {
    			if (changed.contentWarning && (input.value !== ctx.contentWarning)) input.value = ctx.contentWarning;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(input);
    			}

    			dispose();
    		}
    	};
    }

    // (291:10) {#if ipfsDaemonRunning}
    function create_if_block_1$5(ctx) {
    	var input, t, button, dispose;

    	return {
    		c: function create() {
    			input = element("input");
    			t = space();
    			button = element("button");
    			button.textContent = "Attach File using IPFS";
    			attr(input, "type", "file");
    			input.id = "fileInputIPFS";
    			input.className = "svelte-olsuyr";
    			add_location(input, file$d, 291, 12, 8204);
    			button.className = "btn";
    			add_location(button, file$d, 292, 12, 8284);

    			dispose = [
    				listen(input, "input", ctx.attachFileIPFS),
    				listen(button, "click", ctx.attachFileIPFSTrigger)
    			];
    		},

    		m: function mount(target, anchor) {
    			insert(target, input, anchor);
    			insert(target, t, anchor);
    			insert(target, button, anchor);
    		},

    		p: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(input);
    				detach(t);
    				detach(button);
    			}

    			run_all(dispose);
    		}
    	};
    }

    function create_fragment$d(ctx) {
    	var div2, div1, div0, t0, t1, current_block_type_index, if_block2, current;

    	var if_block0 = (ctx.fork) && create_if_block_12(ctx);

    	var if_block1 = (ctx.msg) && create_if_block_10(ctx);

    	var if_block_creators = [
    		create_if_block$6,
    		create_else_block$6
    	];

    	var if_blocks = [];

    	function select_block_type_1(ctx) {
    		if (!ctx.showPreview) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block2 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	return {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if_block2.c();
    			div0.className = "column";
    			add_location(div0, file$d, 220, 4, 5673);
    			div1.className = "columns";
    			add_location(div1, file$d, 219, 2, 5646);
    			div2.className = "container";
    			add_location(div2, file$d, 218, 0, 5619);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div2, anchor);
    			append(div2, div1);
    			append(div1, div0);
    			if (if_block0) if_block0.m(div0, null);
    			append(div0, t0);
    			if (if_block1) if_block1.m(div0, null);
    			append(div0, t1);
    			if_blocks[current_block_type_index].m(div0, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (ctx.fork) {
    				if (if_block0) {
    					if_block0.p(changed, ctx);
    				} else {
    					if_block0 = create_if_block_12(ctx);
    					if_block0.c();
    					if_block0.m(div0, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (ctx.msg) {
    				if (if_block1) {
    					if_block1.p(changed, ctx);
    				} else {
    					if_block1 = create_if_block_10(ctx);
    					if_block1.c();
    					if_block1.m(div0, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			var previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);
    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(changed, ctx);
    			} else {
    				group_outros();
    				on_outro(() => {
    					if_blocks[previous_block_index].d(1);
    					if_blocks[previous_block_index] = null;
    				});
    				if_block2.o(1);
    				check_outros();

    				if_block2 = if_blocks[current_block_type_index];
    				if (!if_block2) {
    					if_block2 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block2.c();
    				}
    				if_block2.i(1);
    				if_block2.m(div0, null);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			if (if_block2) if_block2.i();
    			current = true;
    		},

    		o: function outro(local) {
    			if (if_block2) if_block2.o();
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div2);
    			}

    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if_blocks[current_block_type_index].d();
    		}
    	};
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let $routeParams;

    	validate_store(routeParams, 'routeParams');
    	subscribe($$self, routeParams, $$value => { $routeParams = $$value; $$invalidate('$routeParams', $routeParams); });

    	

      let showPreview = false;
      let msg = false;
      let error = false;
      let posting = false;

      let root = $routeParams.root;
      let branch = $routeParams.branch;
      let channel = $routeParams.channel || "";
      let content = $routeParams.content || "";
      let replyfeed = $routeParams.replyfeed || false;
      let fork = $routeParams.fork;
      let fileOnTop = false;
      let pull = hermiebox.modules.pullStream;
      let fileReader = hermiebox.modules.pullFileReader;
      let sbot = hermiebox.sbot;
      let ipfsDaemonRunning = false;

      document.title = `Patchfox - compose`;

      onMount(() => {
        $$invalidate('error', error = false);
        $$invalidate('msg', msg = "");

        // this code could be in some better/smarter place.
        // e.dataTransfer.getData('url'); from images in the browser window

        ondrop(document.getElementById("content"), files => readFileAndAttach(files));
        checkIpfsDaemon();
      });

      const checkIpfsDaemon = () => {
        let port = getPref("ipfsPort", 5001);
        fetch(`http://127.0.0.1:${port}/api/v0/config/show`).then(data => {
          $$invalidate('ipfsDaemonRunning', ipfsDaemonRunning = true);
        });
      };

      const readFileAndAttach = files => {
        $$invalidate('error', error = false);
        $$invalidate('msg', msg = "");

        if (files.length == 0) {
          $$invalidate('fileOnTop', fileOnTop = false);
          console.log("this is not a file");
          return false;
        }

        var first = files[0];
        console.log(first);

        if (!first.type.startsWith("image")) {
          $$invalidate('error', error = true);
          $$invalidate('msg', msg = `You can only drag & drop image, this file is a ${first.type}`);
          return false;
        }

        if (first.size >= 5000000) {
          $$invalidate('error', error = true);
          $$invalidate('msg', msg = `File too large: ${Math.floor(
        first.size / 1048576,
        2
      )}mb when max size is 5mb`);
          return false;
        }

        pull(
          fileReader(first),
          sbot.blobs.add(function(err, hash) {
            // 'hash' is the hash-id of the blob
            if (err) {
              $$invalidate('error', error = true);
              $$invalidate('msg', msg = "Couldn't attach file: " + err);
            } else {
              $$invalidate('content', content += ` ![${first.name}](${hash})`);
            }
            $$invalidate('fileOnTop', fileOnTop = false);
          })
        );
      };

      const post = async ev => {
        ev.stopPropagation();
        ev.preventDefault();

        if (!posting) {
          $$invalidate('posting', posting = true);

          if (channel.startsWith("#")) {
            $$invalidate('channel', channel = channel.slice(1));
          }

          try {
            $$invalidate('msg', msg = await ssb.newPost({
              text: content,
              channel,
              root,
              branch,
              fork,
              contentWarning: contentWarning.length > 0 ? contentWarning : undefined
            }));
            $$invalidate('posting', posting = false);
            console.log("posted", msg);
            window.scrollTo(0, 0);
          } catch (n) {
            $$invalidate('error', error = true);
            $$invalidate('msg', msg = `Couldn't post your message: ${n}`);
            window.scrollTo(0, 0);

            if (msg.message == "stream is closed") {
              $$invalidate('msg', msg += ". We lost connection to sbot. We'll try to restablish it...");

              reconnect()
                .then(() => {
                  $$invalidate('showPreview', showPreview = false);
                  $$invalidate('posting', posting = false);
                  $$invalidate('error', error = false);
                  $$invalidate('msg', msg = "Connection to sbot reestablished. Try posting again");
                })
                .catch(err => {
                  window.location.search = `?root=${encodeURIComponent(
                root
              )}&branch=${encodeURIComponent(
                branch
              )}&content=${encodeURIComponent(
                content
              )}&channel=${encodeURIComponent(channel)}`;
                  $$invalidate('msg', msg = `Sorry, couldn't reconnect to sbot:${err}. Try reloading the page. Your content has been saved to the URL`);
                });
            }
          }
        }
      };

      const preview = ev => {
        $$invalidate('showPreview', showPreview = true);
      };

      const avatarClick = ev => {
        let feed = ev.detail.feed;
        let name = ev.detail.name;

        if (content.length > 0) {
          $$invalidate('content', content += ` [${name}](${feed})`);
        } else {
          $$invalidate('content', content = `[${name}](${feed})`);
        }
      };

      const dragOver = ev => {
        $$invalidate('fileOnTop', fileOnTop = true);
      };

      const dragLeave = ev => {
        $$invalidate('fileOnTop', fileOnTop = false);
      };

      const attachFileTrigger = () => {
        document.getElementById("fileInput").click();
      };

      const attachFileIPFSTrigger = () => {
        document.getElementById("fileInputIPFS").click();
      };

      const attachFile = ev => {
        const files = ev.target.files;
        readFileAndAttach(files);
      };

      const attachFileIPFS = ev => {
        const files = ev.target.files;
        readFileAndAttachIPFS(files);
      };

      const readFileAndAttachIPFS = async files => {
        $$invalidate('error', error = false);
        $$invalidate('msg', msg = "");

        var ipfs = window.IpfsHttpClient("127.0.0.1", "5001");
        const results = await ipfs.add(files[0]);

        console.log("added via IPFS", results);
        $$invalidate('content', content += ` [${results[0].path}](ipfs://${results[0].hash})`);
      };

      let showContentWarningField = false;

      const toggleContentWarning = () =>
        { const $$result = (showContentWarningField = !showContentWarningField); $$invalidate('showContentWarningField', showContentWarningField); return $$result; };

      let contentWarning = "";

    	function input0_input_handler() {
    		channel = this.value;
    		$$invalidate('channel', channel);
    	}

    	function input_input_handler() {
    		branch = this.value;
    		$$invalidate('branch', branch);
    	}

    	function textarea_input_handler() {
    		content = this.value;
    		$$invalidate('content', content);
    	}

    	function input_input_handler_1() {
    		contentWarning = this.value;
    		$$invalidate('contentWarning', contentWarning);
    	}

    	function click_handler() {
    		const $$result = (showPreview = false);
    		$$invalidate('showPreview', showPreview);
    		return $$result;
    	}

    	return {
    		showPreview,
    		msg,
    		error,
    		posting,
    		root,
    		branch,
    		channel,
    		content,
    		replyfeed,
    		fork,
    		fileOnTop,
    		ipfsDaemonRunning,
    		post,
    		preview,
    		avatarClick,
    		dragOver,
    		dragLeave,
    		attachFileTrigger,
    		attachFileIPFSTrigger,
    		attachFile,
    		attachFileIPFS,
    		showContentWarningField,
    		toggleContentWarning,
    		contentWarning,
    		ssb,
    		encodeURIComponent,
    		input0_input_handler,
    		input_input_handler,
    		textarea_input_handler,
    		input_input_handler_1,
    		click_handler
    	};
    }

    class Compose extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		if (!document.getElementById("svelte-olsuyr-style")) add_css$5();
    		init(this, options, instance$c, create_fragment$d, safe_not_equal, []);
    	}
    }

    /* src\views\Thread.svelte generated by Svelte v3.4.4 */

    const file$e = "src\\views\\Thread.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.msg = list[i];
    	return child_ctx;
    }

    // (36:0) {#if error}
    function create_if_block_1$6(ctx) {
    	var div, t0, a, t1, a_href_value, t2, t3;

    	return {
    		c: function create() {
    			div = element("div");
    			t0 = text("Couldn't load thead\r\n    ");
    			a = element("a");
    			t1 = text(ctx.msgid);
    			t2 = text("\r\n    : ");
    			t3 = text(ctx.error);
    			a.href = a_href_value = "?thread=" + ctx.msgid + "#/thread";
    			add_location(a, file$e, 38, 4, 844);
    			div.className = "toast toast-error";
    			add_location(div, file$e, 36, 2, 782);
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			append(div, t0);
    			append(div, a);
    			append(a, t1);
    			append(div, t2);
    			append(div, t3);
    		},

    		p: function update(changed, ctx) {
    			if (changed.msgid) {
    				set_data(t1, ctx.msgid);
    			}

    			if ((changed.msgid) && a_href_value !== (a_href_value = "?thread=" + ctx.msgid + "#/thread")) {
    				a.href = a_href_value;
    			}

    			if (changed.error) {
    				set_data(t3, ctx.error);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}
    		}
    	};
    }

    // (45:0) {:else}
    function create_else_block$7(ctx) {
    	var each_blocks = [], each_1_lookup = new Map(), each_1_anchor, current;

    	var each_value = ctx.msgs;

    	const get_key = ctx => ctx.msg.key;

    	for (var i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$1(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    	}

    	return {
    		c: function create() {
    			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].c();

    			each_1_anchor = empty();
    		},

    		m: function mount(target, anchor) {
    			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].m(target, anchor);

    			insert(target, each_1_anchor, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			const each_value = ctx.msgs;

    			group_outros();
    			each_blocks = update_keyed_each(each_blocks, changed, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block$1, each_1_anchor, get_each_context$1);
    			check_outros();
    		},

    		i: function intro(local) {
    			if (current) return;
    			for (var i = 0; i < each_value.length; i += 1) each_blocks[i].i();

    			current = true;
    		},

    		o: function outro(local) {
    			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].o();

    			current = false;
    		},

    		d: function destroy(detaching) {
    			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].d(detaching);

    			if (detaching) {
    				detach(each_1_anchor);
    			}
    		}
    	};
    }

    // (43:0) {#if !msgs && !error}
    function create_if_block$7(ctx) {
    	var div;

    	return {
    		c: function create() {
    			div = element("div");
    			div.className = "loading loading-lg";
    			add_location(div, file$e, 43, 2, 948);
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}
    		}
    	};
    }

    // (46:2) {#each msgs as msg (msg.key)}
    function create_each_block$1(key_1, ctx) {
    	var first, current;

    	var messagerenderer = new MessageRenderer({
    		props: { msg: ctx.msg },
    		$$inline: true
    	});

    	return {
    		key: key_1,

    		first: null,

    		c: function create() {
    			first = empty();
    			messagerenderer.$$.fragment.c();
    			this.first = first;
    		},

    		m: function mount(target, anchor) {
    			insert(target, first, anchor);
    			mount_component(messagerenderer, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var messagerenderer_changes = {};
    			if (changed.msgs) messagerenderer_changes.msg = ctx.msg;
    			messagerenderer.$set(messagerenderer_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			messagerenderer.$$.fragment.i(local);

    			current = true;
    		},

    		o: function outro(local) {
    			messagerenderer.$$.fragment.o(local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(first);
    			}

    			messagerenderer.$destroy(detaching);
    		}
    	};
    }

    function create_fragment$e(ctx) {
    	var div, h4, t0, small, t1, t2, t3, current_block_type_index, if_block1, if_block1_anchor, current;

    	var if_block0 = (ctx.error) && create_if_block_1$6(ctx);

    	var if_block_creators = [
    		create_if_block$7,
    		create_else_block$7
    	];

    	var if_blocks = [];

    	function select_block_type(ctx) {
    		if (!ctx.msgs && !ctx.error) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	return {
    		c: function create() {
    			div = element("div");
    			h4 = element("h4");
    			t0 = text("Thread\r\n    ");
    			small = element("small");
    			t1 = text(ctx.msgid);
    			t2 = space();
    			if (if_block0) if_block0.c();
    			t3 = space();
    			if_block1.c();
    			if_block1_anchor = empty();
    			small.className = "label hide-sm";
    			add_location(small, file$e, 32, 4, 704);
    			add_location(h4, file$e, 30, 2, 682);
    			div.className = "container";
    			add_location(div, file$e, 29, 0, 655);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			append(div, h4);
    			append(h4, t0);
    			append(h4, small);
    			append(small, t1);
    			insert(target, t2, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert(target, t3, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert(target, if_block1_anchor, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (!current || changed.msgid) {
    				set_data(t1, ctx.msgid);
    			}

    			if (ctx.error) {
    				if (if_block0) {
    					if_block0.p(changed, ctx);
    				} else {
    					if_block0 = create_if_block_1$6(ctx);
    					if_block0.c();
    					if_block0.m(t3.parentNode, t3);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			var previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);
    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(changed, ctx);
    			} else {
    				group_outros();
    				on_outro(() => {
    					if_blocks[previous_block_index].d(1);
    					if_blocks[previous_block_index] = null;
    				});
    				if_block1.o(1);
    				check_outros();

    				if_block1 = if_blocks[current_block_type_index];
    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				}
    				if_block1.i(1);
    				if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			if (if_block1) if_block1.i();
    			current = true;
    		},

    		o: function outro(local) {
    			if (if_block1) if_block1.o();
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    				detach(t2);
    			}

    			if (if_block0) if_block0.d(detaching);

    			if (detaching) {
    				detach(t3);
    			}

    			if_blocks[current_block_type_index].d(detaching);

    			if (detaching) {
    				detach(if_block1_anchor);
    			}
    		}
    	};
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let $routeParams;

    	validate_store(routeParams, 'routeParams');
    	subscribe($$self, routeParams, $$value => { $routeParams = $$value; $$invalidate('$routeParams', $routeParams); });

    	
      let msgs = false;
      let error = false;
      let msgid;

    	$$self.$$.update = ($$dirty = { $routeParams: 1, msgid: 1 }) => {
    		if ($$dirty.$routeParams || $$dirty.msgid) { {
            $$invalidate('msgid', msgid = $routeParams.thread);
            if (msgid.startsWith("ssb:")) {
              $$invalidate('msgid', msgid = msgid.replace("ssb:", ""));
            }
            document.title = `Patchfox - Thread: ${msgid}`;
        
            let promise = ssb
              .thread(msgid)
              .then(ms => {
                $$invalidate('msgs', msgs = ms);
                window.scrollTo(0, 0);
              })
              .catch(n => {
                console.dir(n);
                $$invalidate('error', error = n.message);
              });
          } }
    	};

    	return { msgs, error, msgid };
    }

    class Thread extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$e, safe_not_equal, []);
    	}
    }

    /* src\views\Profile.svelte generated by Svelte v3.4.4 */

    const file$f = "src\\views\\Profile.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.msg = list[i];
    	return child_ctx;
    }

    // (175:2) {:catch n}
    function create_catch_block_1(ctx) {
    	var p, t0, t1_value = ctx.n.message, t1;

    	return {
    		c: function create() {
    			p = element("p");
    			t0 = text("Error: ");
    			t1 = text(t1_value);
    			add_location(p, file$f, 175, 4, 4403);
    		},

    		m: function mount(target, anchor) {
    			insert(target, p, anchor);
    			append(p, t0);
    			append(p, t1);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(p);
    			}
    		}
    	};
    }

    // (106:2) {:then}
    function create_then_block(ctx) {
    	var div3, div1, div0, img, img_src_value, t0, div2, h1, t1, t2, pre, t3, t4, t5, p, raw_value = ctx.ssb.markdown(ctx.description), t6, div4, promise, current;

    	var if_block = (ctx.feed !== ctx.ssb.feed) && create_if_block$8(ctx);

    	let info = {
    		ctx,
    		current: null,
    		pending: create_pending_block_1,
    		then: create_then_block_1,
    		catch: create_catch_block,
    		value: 'data',
    		error: 'n',
    		blocks: Array(3)
    	};

    	handle_promise(promise = ctx.messagePromise, info);

    	return {
    		c: function create() {
    			div3 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div2 = element("div");
    			h1 = element("h1");
    			t1 = text(ctx.name);
    			t2 = space();
    			pre = element("pre");
    			t3 = text(ctx.feed);
    			t4 = space();
    			if (if_block) if_block.c();
    			t5 = space();
    			p = element("p");
    			t6 = space();
    			div4 = element("div");

    			info.block.c();
    			img.className = "img-responsive";
    			img.src = img_src_value = "http://localhost:8989/blobs/get/" + ctx.image;
    			img.alt = ctx.feed;
    			add_location(img, file$f, 110, 10, 2510);
    			div0.className = "container";
    			add_location(div0, file$f, 109, 8, 2475);
    			div1.className = "column col-6";
    			add_location(div1, file$f, 108, 6, 2439);
    			add_location(h1, file$f, 117, 8, 2710);
    			add_location(pre, file$f, 118, 8, 2735);
    			add_location(p, file$f, 143, 8, 3594);
    			div2.className = "column col-6";
    			add_location(div2, file$f, 116, 6, 2674);
    			div3.className = "columns";
    			add_location(div3, file$f, 106, 4, 2408);
    			add_location(div4, file$f, 149, 4, 3690);
    		},

    		m: function mount(target, anchor) {
    			insert(target, div3, anchor);
    			append(div3, div1);
    			append(div1, div0);
    			append(div0, img);
    			append(div3, t0);
    			append(div3, div2);
    			append(div2, h1);
    			append(h1, t1);
    			append(div2, t2);
    			append(div2, pre);
    			append(pre, t3);
    			append(div2, t4);
    			if (if_block) if_block.m(div2, null);
    			append(div2, t5);
    			append(div2, p);
    			p.innerHTML = raw_value;
    			insert(target, t6, anchor);
    			insert(target, div4, anchor);

    			info.block.m(div4, info.anchor = null);
    			info.mount = () => div4;
    			info.anchor = null;

    			current = true;
    		},

    		p: function update(changed, new_ctx) {
    			ctx = new_ctx;
    			if ((!current || changed.image) && img_src_value !== (img_src_value = "http://localhost:8989/blobs/get/" + ctx.image)) {
    				img.src = img_src_value;
    			}

    			if (!current || changed.feed) {
    				img.alt = ctx.feed;
    			}

    			if (!current || changed.name) {
    				set_data(t1, ctx.name);
    			}

    			if (!current || changed.feed) {
    				set_data(t3, ctx.feed);
    			}

    			if (ctx.feed !== ctx.ssb.feed) {
    				if (if_block) {
    					if_block.p(changed, ctx);
    				} else {
    					if_block = create_if_block$8(ctx);
    					if_block.c();
    					if_block.m(div2, t5);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if ((!current || changed.description) && raw_value !== (raw_value = ctx.ssb.markdown(ctx.description))) {
    				p.innerHTML = raw_value;
    			}

    			info.ctx = ctx;

    			if (('messagePromise' in changed) && promise !== (promise = ctx.messagePromise) && handle_promise(promise, info)) ; else {
    				info.block.p(changed, assign(assign({}, ctx), info.resolved));
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			info.block.i();
    			current = true;
    		},

    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				if (block) block.o();
    			}

    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div3);
    			}

    			if (if_block) if_block.d();

    			if (detaching) {
    				detach(t6);
    				detach(div4);
    			}

    			info.block.d();
    			info = null;
    		}
    	};
    }

    // (120:8) {#if feed !== ssb.feed}
    function create_if_block$8(ctx) {
    	var div3, div0, t0, div1, label0, input0, t1, i0, t2, t3, label1, input1, t4, i1, t5, t6, div2, dispose;

    	return {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			label0 = element("label");
    			input0 = element("input");
    			t1 = space();
    			i0 = element("i");
    			t2 = text("\r\n                following");
    			t3 = space();
    			label1 = element("label");
    			input1 = element("input");
    			t4 = space();
    			i1 = element("i");
    			t5 = text("\r\n                blocking");
    			t6 = space();
    			div2 = element("div");
    			div0.className = "divider";
    			add_location(div0, file$f, 121, 12, 2834);
    			attr(input0, "type", "checkbox");
    			add_location(input0, file$f, 124, 16, 2968);
    			i0.className = "form-icon";
    			add_location(i0, file$f, 128, 16, 3122);
    			label0.className = "form-switch form-inline";
    			add_location(label0, file$f, 123, 14, 2911);
    			attr(input1, "type", "checkbox");
    			add_location(input1, file$f, 132, 16, 3269);
    			i1.className = "form-icon";
    			add_location(i1, file$f, 136, 16, 3421);
    			label1.className = "form-switch form-inline";
    			add_location(label1, file$f, 131, 14, 3212);
    			div1.className = "form-group";
    			add_location(div1, file$f, 122, 12, 2871);
    			div2.className = "divider";
    			add_location(div2, file$f, 140, 12, 3528);
    			div3.className = "container";
    			add_location(div3, file$f, 120, 10, 2797);

    			dispose = [
    				listen(input0, "change", ctx.input0_change_handler),
    				listen(input0, "change", ctx.followingChanged),
    				listen(input1, "change", ctx.input1_change_handler),
    				listen(input1, "change", ctx.blockingChanged)
    			];
    		},

    		m: function mount(target, anchor) {
    			insert(target, div3, anchor);
    			append(div3, div0);
    			append(div3, t0);
    			append(div3, div1);
    			append(div1, label0);
    			append(label0, input0);

    			input0.checked = ctx.following;

    			append(label0, t1);
    			append(label0, i0);
    			append(label0, t2);
    			append(div1, t3);
    			append(div1, label1);
    			append(label1, input1);

    			input1.checked = ctx.blocking;

    			append(label1, t4);
    			append(label1, i1);
    			append(label1, t5);
    			append(div3, t6);
    			append(div3, div2);
    		},

    		p: function update(changed, ctx) {
    			if (changed.following) input0.checked = ctx.following;
    			if (changed.blocking) input1.checked = ctx.blocking;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div3);
    			}

    			run_all(dispose);
    		}
    	};
    }

    // (169:6) {:catch n}
    function create_catch_block(ctx) {
    	var p, t0, t1_value = ctx.n.message, t1;

    	return {
    		c: function create() {
    			p = element("p");
    			t0 = text("Error fetching messages: ");
    			t1 = text(t1_value);
    			add_location(p, file$f, 169, 8, 4308);
    		},

    		m: function mount(target, anchor) {
    			insert(target, p, anchor);
    			append(p, t0);
    			append(p, t1);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.messagePromise) && t1_value !== (t1_value = ctx.n.message)) {
    				set_data(t1, t1_value);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(p);
    			}
    		}
    	};
    }

    // (153:6) {:then data}
    function create_then_block_1(ctx) {
    	var each_blocks = [], each_1_lookup = new Map(), t, ul, li, a, div, current, dispose;

    	var each_value = ctx.lastMsgs;

    	const get_key = ctx => ctx.msg.key;

    	for (var i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$2(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
    	}

    	return {
    		c: function create() {
    			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].c();

    			t = space();
    			ul = element("ul");
    			li = element("li");
    			a = element("a");
    			div = element("div");
    			div.textContent = "Load More";
    			div.className = "page-item-subtitle";
    			add_location(div, file$f, 164, 14, 4183);
    			a.href = "#/public";
    			add_location(a, file$f, 159, 12, 3969);
    			li.className = "page-item page-next";
    			add_location(li, file$f, 158, 10, 3923);
    			ul.className = "pagination";
    			add_location(ul, file$f, 156, 8, 3886);
    			dispose = listen(a, "click", stop_propagation(prevent_default(ctx.click_handler)));
    		},

    		m: function mount(target, anchor) {
    			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].m(target, anchor);

    			insert(target, t, anchor);
    			insert(target, ul, anchor);
    			append(ul, li);
    			append(li, a);
    			append(a, div);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			const each_value = ctx.lastMsgs;

    			group_outros();
    			each_blocks = update_keyed_each(each_blocks, changed, get_key, 1, ctx, each_value, each_1_lookup, t.parentNode, outro_and_destroy_block, create_each_block$2, t, get_each_context$2);
    			check_outros();
    		},

    		i: function intro(local) {
    			if (current) return;
    			for (var i = 0; i < each_value.length; i += 1) each_blocks[i].i();

    			current = true;
    		},

    		o: function outro(local) {
    			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].o();

    			current = false;
    		},

    		d: function destroy(detaching) {
    			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].d(detaching);

    			if (detaching) {
    				detach(t);
    				detach(ul);
    			}

    			dispose();
    		}
    	};
    }

    // (154:8) {#each lastMsgs as msg (msg.key)}
    function create_each_block$2(key_1, ctx) {
    	var first, current;

    	var messagerenderer = new MessageRenderer({
    		props: { msg: ctx.msg },
    		$$inline: true
    	});

    	return {
    		key: key_1,

    		first: null,

    		c: function create() {
    			first = empty();
    			messagerenderer.$$.fragment.c();
    			this.first = first;
    		},

    		m: function mount(target, anchor) {
    			insert(target, first, anchor);
    			mount_component(messagerenderer, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var messagerenderer_changes = {};
    			if (changed.lastMsgs) messagerenderer_changes.msg = ctx.msg;
    			messagerenderer.$set(messagerenderer_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			messagerenderer.$$.fragment.i(local);

    			current = true;
    		},

    		o: function outro(local) {
    			messagerenderer.$$.fragment.o(local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(first);
    			}

    			messagerenderer.$destroy(detaching);
    		}
    	};
    }

    // (151:29)           <div class="loading" />        {:then data}
    function create_pending_block_1(ctx) {
    	var div;

    	return {
    		c: function create() {
    			div = element("div");
    			div.className = "loading";
    			add_location(div, file$f, 151, 8, 3736);
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}
    		}
    	};
    }

    // (104:40)       <div class="loading loading-lg" />    {:then}
    function create_pending_block(ctx) {
    	var div;

    	return {
    		c: function create() {
    			div = element("div");
    			div.className = "loading loading-lg";
    			add_location(div, file$f, 104, 4, 2357);
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}
    		}
    	};
    }

    function create_fragment$f(ctx) {
    	var div, promise, current;

    	let info = {
    		ctx,
    		current: null,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block_1,
    		value: 'null',
    		error: 'n',
    		blocks: Array(3)
    	};

    	handle_promise(promise = ctx.aboutPromise && ctx.avatarPromise, info);

    	return {
    		c: function create() {
    			div = element("div");

    			info.block.c();
    			div.className = "container";
    			add_location(div, file$f, 102, 0, 2286);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);

    			info.block.m(div, info.anchor = null);
    			info.mount = () => div;
    			info.anchor = null;

    			current = true;
    		},

    		p: function update(changed, new_ctx) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (promise !== (promise = ctx.aboutPromise && ctx.avatarPromise) && handle_promise(promise, info)) ; else {
    				info.block.p(changed, assign(assign({}, ctx), info.resolved));
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			info.block.i();
    			current = true;
    		},

    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				if (block) block.o();
    			}

    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			info.block.d();
    			info = null;
    		}
    	};
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let $routeParams;

    	validate_store(routeParams, 'routeParams');
    	subscribe($$self, routeParams, $$value => { $routeParams = $$value; $$invalidate('$routeParams', $routeParams); });

    	

      let description = false;
      let following = false;
      let blocking = false;
      let image,
        feed,
        lastMsgs = [],
        lastAbout;

      // todo: move back into using stores.
      $$invalidate('feed', feed = $routeParams.feed);

      if (!feed) {
        $$invalidate('feed', feed = ssb.feed);
      }

      let name = feed;

      document.title = `Patchfox - Feed: ${feed}`;

      console.log("fetching", feed);

      let avatarPromise = ssb.avatar(feed).then(data => {
        $$invalidate('name', name = data.name);
        $$invalidate('image', image = data.image);
        document.title = `Patchfox - Feed: ${name}`;
      });

      let aboutPromise = ssb.profile(feed).then(data => {
        lastAbout = data.about.reverse().find(m => {
          let a = m.value.content;
          return a.hasOwnProperty("description");
        });
        try {
          $$invalidate('description', description = lastAbout.value.content.description);
        } catch (n) {
          $$invalidate('description', description = "");
        }
        window.scrollTo(0, 0);
      });

      let messagePromise = ssb
        .query(
          {
            value: {
              author: feed 
            }
          },
          10
        )
        .then(msgs => {
          $$invalidate('lastMsgs', lastMsgs = msgs);

          window.scrollTo(0, 0);
        });

      if (feed !== ssb.feed) {
        ssb.following(feed).then(f => { const $$result = (following = f); $$invalidate('following', following); return $$result; });
        ssb.blocking(feed).then(f => { const $$result = (blocking = f); $$invalidate('blocking', blocking); return $$result; });
      }

      const blockingChanged = ev => {
        let v = ev.target.checked;
        if (v) {
          ssb.block(feed).catch(() => { const $$result = (blocking = false); $$invalidate('blocking', blocking); return $$result; });
        } else {
          ssb.unblock(feed).catch(() => { const $$result = (blocking = true); $$invalidate('blocking', blocking); return $$result; });
        }
      };

      const followingChanged = ev => {
        let v = ev.target.checked;
        if (v) {
          ssb.follow(feed).catch(() => { const $$result = (following = false); $$invalidate('following', following); return $$result; });
        } else {
          ssb.unfollow(feed).catch(() => { const $$result = (following = true); $$invalidate('following', following); return $$result; });
        }
      };

      // todo: refactor navigation here. This is a hack it shouldn't hide and show values which are
      // not reloading.
      const loadMoreMessages = lt => {
        $$invalidate('messagePromise', messagePromise = ssb
          .query(
            {
              value: {
                author: feed,
                timestamp: { $lt: lt }
              }
            }
          )
          .then(msgs => {
            $$invalidate('lastMsgs', lastMsgs = msgs);
            window.scrollTo(0, 0);
          }));
      };

    	function input0_change_handler() {
    		following = this.checked;
    		$$invalidate('following', following);
    	}

    	function input1_change_handler() {
    		blocking = this.checked;
    		$$invalidate('blocking', blocking);
    	}

    	function click_handler() {
    	                loadMoreMessages(lastMsgs[lastMsgs.length - 1].value.timestamp);
    	              }

    	return {
    		description,
    		following,
    		blocking,
    		image,
    		feed,
    		lastMsgs,
    		name,
    		avatarPromise,
    		aboutPromise,
    		messagePromise,
    		blockingChanged,
    		followingChanged,
    		loadMoreMessages,
    		ssb,
    		input0_change_handler,
    		input1_change_handler,
    		click_handler
    	};
    }

    class Profile extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$f, safe_not_equal, []);
    	}
    }

    /* src\views\ErrorView.svelte generated by Svelte v3.4.4 */

    const file$g = "src\\views\\ErrorView.svelte";

    // (51:2) {#if toast}
    function create_if_block_1$7(ctx) {
    	var div, t, div_class_value;

    	return {
    		c: function create() {
    			div = element("div");
    			t = text(ctx.msg);
    			div.className = div_class_value = "toast " + ctx.toastClass;
    			add_location(div, file$g, 51, 4, 1208);
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			append(div, t);
    		},

    		p: function update(changed, ctx) {
    			if (changed.msg) {
    				set_data(t, ctx.msg);
    			}

    			if ((changed.toastClass) && div_class_value !== (div_class_value = "toast " + ctx.toastClass)) {
    				div.className = div_class_value;
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}
    		}
    	};
    }

    // (60:4) {#if cta}
    function create_if_block$9(ctx) {
    	var li, a, t_value = ctx.cta.label, t, dispose;

    	return {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t = text(t_value);
    			a.href = "#";
    			add_location(a, file$g, 61, 8, 1434);
    			add_location(li, file$g, 60, 6, 1420);
    			dispose = listen(a, "click", stop_propagation(prevent_default(ctx.cta.action)));
    		},

    		m: function mount(target, anchor) {
    			insert(target, li, anchor);
    			append(li, a);
    			append(a, t);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.cta) && t_value !== (t_value = ctx.cta.label)) {
    				set_data(t, t_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(li);
    			}

    			dispose();
    		}
    	};
    }

    function create_fragment$g(ctx) {
    	var div, h1, t1, t2, h4, t4, pre, code, t5, t6, p, t8, ul, t9, li0, a0, t11, li1, a1, t13;

    	var if_block0 = (ctx.toast) && create_if_block_1$7(ctx);

    	var if_block1 = (ctx.cta) && create_if_block$9(ctx);

    	return {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "😿 An Error Has Occurred, sorry 😭";
    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			h4 = element("h4");
    			h4.textContent = "This is what we know about it";
    			t4 = space();
    			pre = element("pre");
    			code = element("code");
    			t5 = text(ctx.error);
    			t6 = space();
    			p = element("p");
    			p.textContent = "You might want to:";
    			t8 = space();
    			ul = element("ul");
    			if (if_block1) if_block1.c();
    			t9 = space();
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "Open our troubleshooting documentation.";
    			t11 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "Add an issue";
    			t13 = text("\r\n      to the Patchfox repository.");
    			add_location(h1, file$g, 49, 2, 1144);
    			add_location(h4, file$g, 53, 2, 1264);
    			add_location(code, file$g, 55, 4, 1330);
    			pre.className = "code";
    			add_location(pre, file$g, 54, 2, 1306);
    			add_location(p, file$g, 57, 2, 1364);
    			a0.href = "/docs/index.html#/troubleshooting/";
    			a0.target = "_blank";
    			add_location(a0, file$g, 67, 6, 1579);
    			add_location(li0, file$g, 66, 4, 1567);
    			a1.href = "https://github.com/soapdog/patchfox/issues";
    			a1.target = "_blank";
    			add_location(a1, file$g, 72, 6, 1730);
    			add_location(li1, file$g, 71, 4, 1718);
    			add_location(ul, file$g, 58, 2, 1393);
    			div.className = "container";
    			add_location(div, file$g, 48, 0, 1117);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			append(div, h1);
    			append(div, t1);
    			if (if_block0) if_block0.m(div, null);
    			append(div, t2);
    			append(div, h4);
    			append(div, t4);
    			append(div, pre);
    			append(pre, code);
    			append(code, t5);
    			append(div, t6);
    			append(div, p);
    			append(div, t8);
    			append(div, ul);
    			if (if_block1) if_block1.m(ul, null);
    			append(ul, t9);
    			append(ul, li0);
    			append(li0, a0);
    			append(ul, t11);
    			append(ul, li1);
    			append(li1, a1);
    			append(li1, t13);
    		},

    		p: function update(changed, ctx) {
    			if (ctx.toast) {
    				if (if_block0) {
    					if_block0.p(changed, ctx);
    				} else {
    					if_block0 = create_if_block_1$7(ctx);
    					if_block0.c();
    					if_block0.m(div, t2);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (changed.error) {
    				set_data(t5, ctx.error);
    			}

    			if (ctx.cta) {
    				if (if_block1) {
    					if_block1.p(changed, ctx);
    				} else {
    					if_block1 = create_if_block$9(ctx);
    					if_block1.c();
    					if_block1.m(ul, t9);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let $routeParams;

    	validate_store(routeParams, 'routeParams');
    	subscribe($$self, routeParams, $$value => { $routeParams = $$value; $$invalidate('$routeParams', $routeParams); });

    	document.title = `Patchfox - Error`;

      let error = $routeParams.error;
      let errorObj = {};
      let toastClass = "";
      let toast = false;
      let msg;
      let cta = false;

      console.dir(error);
      if (typeof error == "object") {
        errorObj = error;
        $$invalidate('error', error = errorObj.message);
      }

      const tryReconnect = () => {
        $$invalidate('toast', toast = true);
        $$invalidate('toastClass', toastClass = "toast-warning");
        $$invalidate('msg', msg = "Attempting to reconnect to sbot...");
        reconnect()
          .then(() => {
            $$invalidate('toastClass', toastClass = "toast-success");
            $$invalidate('toast', toast = true);
            $$invalidate('msg', msg =
              "Connection to sbot reestablished. Try going to your public feed.");
          })
          .catch(n => {
            $$invalidate('toastClass', toastClass = "toast-error");
            $$invalidate('toast', toast = true);
            $$invalidate('msg', msg = "Couldn't reconnect. Try reloading the page.");
          });
      };

      let errorMapping = {
        "Error: stream is closed": {
          label: "Want to try to reconnect?",
          action: tryReconnect
        }
      };

      if (errorMapping.hasOwnProperty(error)) {
        $$invalidate('cta', cta = errorMapping[error]);
      }

    	return { error, toastClass, toast, msg, cta };
    }

    class ErrorView extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$g, safe_not_equal, []);
    	}
    }

    /* src\views\Channels.svelte generated by Svelte v3.4.4 */

    const file$h = "src\\views\\Channels.svelte";

    function add_css$6() {
    	var style = element("style");
    	style.id = 'svelte-1or0a5q-style';
    	style.textContent = ".channel.svelte-1or0a5q{cursor:pointer}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hhbm5lbHMuc3ZlbHRlIiwic291cmNlcyI6WyJDaGFubmVscy5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdD5cclxuICAvLyBOT1RJQ0U6XHJcbiAgLy8gSSd2ZSByZW1vdmVkIHRoaXMgdmlldyBmcm9tIHRoZSBuYXZpZ2F0aW9uLlxyXG4gIC8vXHJcbiAgLy8gaXQgaXMgdG9vIHNsb3csIGl0IHRha2VzIGFib3V0IDYwIHNlY29uZHMgdG8gcXVlcnkuXHJcbiAgLy9cclxuXHJcbiAgaW1wb3J0IHsgbmF2aWdhdGUgfSBmcm9tIFwiLi4vdXRpbHMuanNcIjtcclxuXHJcbiAgbGV0IGFjdGl2ZUNoYW5uZWxzID0gW107XHJcbiAgbGV0IHN1YnNjcmliZWRDaGFubmVscyA9IFtdO1xyXG5cclxuICBsZXQgbG9hZGluZyA9IHRydWU7XHJcblxyXG4gIGxldCBwdWxsID0gaGVybWllYm94Lm1vZHVsZXMucHVsbFN0cmVhbTtcclxuICBsZXQgc2JvdCA9IGhlcm1pZWJveC5zYm90O1xyXG5cclxuICBjb25zdCBsb2FkU3Vic2NyaWJlZENoYW5uZWxzID0gKCkgPT4ge1xyXG4gICAgbGV0IHF1ZXJ5ID0ge1xyXG4gICAgICAkZmlsdGVyOiB7XHJcbiAgICAgICAgdmFsdWU6IHtcclxuICAgICAgICAgIGF1dGhvcjogc2JvdC5pZCxcclxuICAgICAgICAgIGNvbnRlbnQ6IHtcclxuICAgICAgICAgICAgdHlwZTogXCJjaGFubmVsXCJcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgICRzb3J0OiBbW1widmFsdWVcIiwgXCJ0aW1lc3RhbXBcIl1dXHJcbiAgICB9O1xyXG4gICAgcHVsbChcclxuICAgICAgc2JvdC5xdWVyeS5yZWFkKHtcclxuICAgICAgICBxdWVyeTogW3F1ZXJ5XSxcclxuICAgICAgICBsaXZlOiB0cnVlLFxyXG4gICAgICAgIHJldmVyc2U6IHRydWUsXHJcbiAgICAgICAgbGltaXQ6IDUwMFxyXG4gICAgICB9KSxcclxuICAgICAgLy9wdWxsLmZpbHRlcihjID0+IHtcclxuICAgICAgLy8gICFzdWJzY3JpYmVkQ2hhbm5lbHMuc29tZShzYyA9PiBzYy5jaGFubmVsID09IGMuY2hhbm5lbCk7XHJcbiAgICAgIC8vfSksXHJcbiAgICAgIHB1bGwuZHJhaW4oYyA9PiB7XHJcbiAgICAgICAgaWYgKGMuc3luYykge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coXCJmaW5pc2hlZCBsb2FkaW5nXCIpO1xyXG4gICAgICAgICAgbG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiAoYy52YWx1ZS5jb250ZW50LnN1YnNjcmliZWQpIHtcclxuICAgICAgICAgICAgc3Vic2NyaWJlZENoYW5uZWxzLnB1c2goYy52YWx1ZS5jb250ZW50LmNoYW5uZWwpO1xyXG4gICAgICAgICAgICBzdWJzY3JpYmVkQ2hhbm5lbHMgPSBzdWJzY3JpYmVkQ2hhbm5lbHM7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgKTtcclxuICB9O1xyXG5cclxuICBsb2FkU3Vic2NyaWJlZENoYW5uZWxzKCk7XHJcbjwvc2NyaXB0PlxyXG5cclxuPHN0eWxlPlxyXG4gIC5jaGFubmVsIHtcclxuICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICB9XHJcbjwvc3R5bGU+XHJcblxyXG48aDQ+U3Vic2NyaWJlZCBDaGFubmVsczwvaDQ+XHJcblxyXG57I2lmIHN1YnNjcmliZWRDaGFubmVscy5sZW5ndGggPT0gMH1cclxuICA8ZGl2IGNsYXNzPVwibG9hZGluZ1wiIC8+XHJcblxyXG4gIDxwPlRoaXMgaXMgYSBjb21wbGV4IHF1ZXJ5LCBpdCBtaWdodCB0YWtlIGEgd2hpbGUuLi4gQ2hhbm5lbHMgd2lsbCBhcHBlYXIgYXMgd2UgZmluZCB0aGVtPC9wPlxyXG57OmVsc2V9XHJcbiAgeyNlYWNoIHN1YnNjcmliZWRDaGFubmVscyBhcyBjfVxyXG4gICAgPHNwYW5cclxuICAgICAgY2xhc3M9XCJjaGFubmVsIGxhYmVsIGxhYmVsLXNlY29uZGFyeSBtLTFcIlxyXG4gICAgICBvbjpjbGljaz17KCkgPT4gbmF2aWdhdGUoJy9jaGFubmVsJywgeyBjaGFubmVsOiBjIH0pfT5cclxuICAgICAgICN7Y31cclxuICAgIDwvc3Bhbj5cclxuICB7L2VhY2h9XHJcbnsvaWZ9XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUF5REUsUUFBUSxlQUFDLENBQUMsQUFDUixNQUFNLENBQUUsT0FBTyxBQUNqQixDQUFDIn0= */";
    	append(document.head, style);
    }

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.c = list[i];
    	return child_ctx;
    }

    // (69:0) {:else}
    function create_else_block$8(ctx) {
    	var each_1_anchor;

    	var each_value = ctx.subscribedChannels;

    	var each_blocks = [];

    	for (var i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	return {
    		c: function create() {
    			for (var i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},

    		m: function mount(target, anchor) {
    			for (var i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert(target, each_1_anchor, anchor);
    		},

    		p: function update(changed, ctx) {
    			if (changed.subscribedChannels) {
    				each_value = ctx.subscribedChannels;

    				for (var i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}
    				each_blocks.length = each_value.length;
    			}
    		},

    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);

    			if (detaching) {
    				detach(each_1_anchor);
    			}
    		}
    	};
    }

    // (65:0) {#if subscribedChannels.length == 0}
    function create_if_block$a(ctx) {
    	var div, t, p;

    	return {
    		c: function create() {
    			div = element("div");
    			t = space();
    			p = element("p");
    			p.textContent = "This is a complex query, it might take a while... Channels will appear as we find them";
    			div.className = "loading";
    			add_location(div, file$h, 65, 2, 1383);
    			add_location(p, file$h, 67, 2, 1412);
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			insert(target, t, anchor);
    			insert(target, p, anchor);
    		},

    		p: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    				detach(t);
    				detach(p);
    			}
    		}
    	};
    }

    // (70:2) {#each subscribedChannels as c}
    function create_each_block$3(ctx) {
    	var span, t0, t1_value = ctx.c, t1, t2, dispose;

    	function click_handler() {
    		return ctx.click_handler(ctx);
    	}

    	return {
    		c: function create() {
    			span = element("span");
    			t0 = text("#");
    			t1 = text(t1_value);
    			t2 = space();
    			span.className = "channel label label-secondary m-1 svelte-1or0a5q";
    			add_location(span, file$h, 70, 4, 1555);
    			dispose = listen(span, "click", click_handler);
    		},

    		m: function mount(target, anchor) {
    			insert(target, span, anchor);
    			append(span, t0);
    			append(span, t1);
    			append(span, t2);
    		},

    		p: function update(changed, new_ctx) {
    			ctx = new_ctx;
    			if ((changed.subscribedChannels) && t1_value !== (t1_value = ctx.c)) {
    				set_data(t1, t1_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(span);
    			}

    			dispose();
    		}
    	};
    }

    function create_fragment$h(ctx) {
    	var h4, t_1, if_block_anchor;

    	function select_block_type(ctx) {
    		if (ctx.subscribedChannels.length == 0) return create_if_block$a;
    		return create_else_block$8;
    	}

    	var current_block_type = select_block_type(ctx);
    	var if_block = current_block_type(ctx);

    	return {
    		c: function create() {
    			h4 = element("h4");
    			h4.textContent = "Subscribed Channels";
    			t_1 = space();
    			if_block.c();
    			if_block_anchor = empty();
    			add_location(h4, file$h, 62, 0, 1311);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, h4, anchor);
    			insert(target, t_1, anchor);
    			if_block.m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    		},

    		p: function update(changed, ctx) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(changed, ctx);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);
    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(h4);
    				detach(t_1);
    			}

    			if_block.d(detaching);

    			if (detaching) {
    				detach(if_block_anchor);
    			}
    		}
    	};
    }

    function instance$g($$self, $$props, $$invalidate) {
      let subscribedChannels = [];

      let pull = hermiebox.modules.pullStream;
      let sbot = hermiebox.sbot;

      const loadSubscribedChannels = () => {
        let query = {
          $filter: {
            value: {
              author: sbot.id,
              content: {
                type: "channel"
              }
            }
          },
          $sort: [["value", "timestamp"]]
        };
        pull(
          sbot.query.read({
            query: [query],
            live: true,
            reverse: true,
            limit: 500
          }),
          //pull.filter(c => {
          //  !subscribedChannels.some(sc => sc.channel == c.channel);
          //}),
          pull.drain(c => {
            if (c.sync) {
              console.log("finished loading");
            } else {
              if (c.value.content.subscribed) {
                subscribedChannels.push(c.value.content.channel);
                $$invalidate('subscribedChannels', subscribedChannels);
              }
            }
          })
        );
      };

      loadSubscribedChannels();

    	function click_handler({ c }) {
    		return navigate('/channel', { channel: c });
    	}

    	return { subscribedChannels, click_handler };
    }

    class Channels extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		if (!document.getElementById("svelte-1or0a5q-style")) add_css$6();
    		init(this, options, instance$g, create_fragment$h, safe_not_equal, []);
    	}
    }

    /* src\views\Channel.svelte generated by Svelte v3.4.4 */

    const file$i = "src\\views\\Channel.svelte";

    function add_css$7() {
    	var style = element("style");
    	style.id = 'svelte-kdiu44-style';
    	style.textContent = "\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hhbm5lbC5zdmVsdGUiLCJzb3VyY2VzIjpbIkNoYW5uZWwuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XHJcbiAgaW1wb3J0IE1lc3NhZ2VSZW5kZXJlciBmcm9tIFwiLi4vbWVzc2FnZVR5cGVzL01lc3NhZ2VSZW5kZXJlci5zdmVsdGVcIjtcclxuICBpbXBvcnQgeyBuYXZpZ2F0ZSwgcm91dGVQYXJhbXMsIGdldFByZWYgfSBmcm9tIFwiLi4vdXRpbHMuanNcIjtcclxuICBpbXBvcnQgeyBvbk1vdW50LCBvbkRlc3Ryb3kgfSBmcm9tIFwic3ZlbHRlXCI7XHJcblxyXG4gIGxldCBtc2dzID0gZmFsc2U7XHJcbiAgbGV0IGVycm9yID0gJHJvdXRlUGFyYW1zLmVycm9yIHx8IGZhbHNlO1xyXG4gIGxldCBjaGFubmVsID0gJHJvdXRlUGFyYW1zLmNoYW5uZWwgfHwgZmFsc2U7XHJcbiAgbGV0IHN1YnNjcmliZWQgPSBmYWxzZTtcclxuXHJcbiAgaWYgKCFjaGFubmVsKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcImNhbid0IG5hdmlnYXRlIHRvIHVubmFtZWQgY2hhbm5lbCwgZ29pbmcgYmFjayB0byBwdWJsaWNcIik7XHJcbiAgICBsb2NhdGlvbiA9IFwiaW5kZXguaHRtbCMvcHVibGljXCI7IC8vIGZvcmNlIHJlbG9hZC5cclxuICB9XHJcblxyXG4gIGxldCBvcHRzID0ge1xyXG4gICAgbGltaXQ6ICRyb3V0ZVBhcmFtcy5saW1pdCB8fCBnZXRQcmVmKFwibGltaXRcIiwgMTApLFxyXG4gICAgcmV2ZXJzZTogdHJ1ZVxyXG4gIH07XHJcblxyXG4gIHNzYi5jaGFubmVsU3Vic2NyaWJlZChjaGFubmVsKS50aGVuKHMgPT4gKHN1YnNjcmliZWQgPSBzKSk7XHJcblxyXG4gIC8vIHRvZG86IG1vdmUgYmFjayBpbnRvIHVzaW5nIHN0b3Jlcy5cclxuICAkOiB7XHJcbiAgICBPYmplY3QuYXNzaWduKG9wdHMsICRyb3V0ZVBhcmFtcyk7XHJcblxyXG4gICAgZG9jdW1lbnQudGl0bGUgPSBgUGF0Y2hmb3ggLSAjJHtjaGFubmVsfWA7XHJcblxyXG4gICAgaWYgKG9wdHMuaGFzT3duUHJvcGVydHkoXCJsdFwiKSkge1xyXG4gICAgICBvcHRzLmx0ID0gcGFyc2VJbnQob3B0cy5sdCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG9wdHMuaGFzT3duUHJvcGVydHkoXCJsaW1pdFwiKSkge1xyXG4gICAgICBvcHRzLmxpbWl0ID0gcGFyc2VJbnQob3B0cy5saW1pdCk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHByb21pc2UgPSBzc2JcclxuICAgICAgLmNoYW5uZWwoY2hhbm5lbCwgb3B0cylcclxuICAgICAgLnRoZW4obXMgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwibXNnXCIsIG1zKTtcclxuICAgICAgICBtc2dzID0gbXM7XHJcbiAgICAgICAgd2luZG93LnNjcm9sbFRvKDAsIDApO1xyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2gobiA9PiB7XHJcbiAgICAgICAgaWYgKCFlcnJvcikge1xyXG4gICAgICAgICAgY29uc29sZS5lcnJvcihcImVycnJyb29vb29yXCIsIG4pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBzdWJzY3JpcHRpb25DaGFuZ2VkID0gZXYgPT4ge1xyXG4gICAgbGV0IHYgPSBldi50YXJnZXQuY2hlY2tlZDtcclxuICAgIGlmICh2KSB7XHJcbiAgICAgIHNzYi5jaGFubmVsU3Vic2NyaWJlKGNoYW5uZWwpLmNhdGNoKCgpID0+IChzdWJzY3JpYmVkID0gZmFsc2UpKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHNzYi5jaGFubmVsVW5zdWJzY3JpYmUoY2hhbm5lbCkuY2F0Y2goKCkgPT4gKHN1YnNjcmliZWQgPSB0cnVlKSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgZ29OZXh0ID0gKCkgPT4ge1xyXG4gICAgbmF2aWdhdGUoXCIvY2hhbm5lbFwiLCB7XHJcbiAgICAgIGNoYW5uZWwsXHJcbiAgICAgIGx0OiBtc2dzW21zZ3MubGVuZ3RoIC0gMV0ucnRzXHJcbiAgICB9KTtcclxuICB9O1xyXG4gIGNvbnN0IGdvUHJldmlvdXMgPSAoKSA9PiB7XHJcbiAgICBoaXN0b3J5LmJhY2soKTtcclxuICB9O1xyXG48L3NjcmlwdD5cclxuXHJcbjxzdHlsZT5cclxuICAubWVudS1yaWdodCB7XHJcbiAgICByaWdodDogMHB4O1xyXG4gICAgbGVmdDogdW5zZXQ7XHJcbiAgICBtaW4td2lkdGg6IDMwMHB4O1xyXG4gIH1cclxuPC9zdHlsZT5cclxuXHJcbjxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cclxuICA8ZGl2IGNsYXNzPVwiY29sdW1uc1wiPlxyXG4gICAgPGRpdiBjbGFzcz1cImNvbHVtblwiPlxyXG4gICAgICA8aDQ+Q2hhbm5lbDogI3tjaGFubmVsfSA8L2g0PlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzPVwiY29sdW1uXCI+XHJcbiAgICAgIDxsYWJlbCBjbGFzcz1cImZvcm0tc3dpdGNoIGZsb2F0LXJpZ2h0XCI+XHJcbiAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICB0eXBlPVwiY2hlY2tib3hcIlxyXG4gICAgICAgICAgb246Y2hhbmdlPXtzdWJzY3JpcHRpb25DaGFuZ2VkfVxyXG4gICAgICAgICAgYmluZDpjaGVja2VkPXtzdWJzY3JpYmVkfSAvPlxyXG4gICAgICAgIDxpIGNsYXNzPVwiZm9ybS1pY29uXCIgLz5cclxuICAgICAgICBTdWJzY3JpYmVcclxuICAgICAgPC9sYWJlbD5cclxuICAgICAgPGJ1dHRvblxyXG4gICAgICAgIGNsYXNzPVwiYnRuIGJ0bi1saW5rIGZsb2F0LXJpZ2h0XCJcclxuICAgICAgICBocmVmPVwiP2NoYW5uZWw9e2NoYW5uZWx9Iy9jb21wb3NlXCJcclxuICAgICAgICBvbjpjbGlja3xwcmV2ZW50RGVmYXVsdD17KCkgPT4gbmF2aWdhdGUoJy9jb21wb3NlJywgeyBjaGFubmVsIH0pfT5cclxuICAgICAgICBOZXcgUG9zdFxyXG4gICAgICA8L2J1dHRvbj5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG48L2Rpdj5cclxueyNpZiBlcnJvcn1cclxuICA8ZGl2IGNsYXNzPVwidG9hc3QgdG9hc3QtZXJyb3JcIj5FcnJvcjoge2Vycm9yfTwvZGl2PlxyXG57L2lmfVxyXG57I2lmICFtc2dzfVxyXG4gIDxkaXYgY2xhc3M9XCJsb2FkaW5nIGxvYWRpbmctbGdcIiAvPlxyXG57OmVsc2V9XHJcbiAgeyNlYWNoIG1zZ3MgYXMgbXNnIChtc2cua2V5KX1cclxuICAgIDxNZXNzYWdlUmVuZGVyZXIge21zZ30gLz5cclxuICB7OmVsc2V9XHJcbiAgICA8cD5ObyBtZXNzYWdlcy48L3A+XHJcbiAgey9lYWNofVxyXG4gIDx1bCBjbGFzcz1cInBhZ2luYXRpb25cIj5cclxuICAgIDxsaSBjbGFzcz1cInBhZ2UtaXRlbSBwYWdlLXByZXZpb3VzXCI+XHJcbiAgICAgIDxhIGhyZWY9XCIjL3B1YmxpY1wiIG9uOmNsaWNrfHN0b3BQcm9wYWdhdGlvbnxwcmV2ZW50RGVmYXVsdD17Z29QcmV2aW91c30+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInBhZ2UtaXRlbS1zdWJ0aXRsZVwiPlByZXZpb3VzPC9kaXY+XHJcbiAgICAgIDwvYT5cclxuICAgIDwvbGk+XHJcbiAgICA8bGkgY2xhc3M9XCJwYWdlLWl0ZW0gcGFnZS1uZXh0XCI+XHJcbiAgICAgIDxhIGhyZWY9XCIjL3B1YmxpY1wiIG9uOmNsaWNrfHN0b3BQcm9wYWdhdGlvbnxwcmV2ZW50RGVmYXVsdD17Z29OZXh0fT5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwicGFnZS1pdGVtLXN1YnRpdGxlXCI+TmV4dDwvZGl2PlxyXG4gICAgICA8L2E+XHJcbiAgICA8L2xpPlxyXG4gIDwvdWw+XHJcbnsvaWZ9XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIn0= */";
    	append(document.head, style);
    }

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.msg = list[i];
    	return child_ctx;
    }

    // (102:0) {#if error}
    function create_if_block_1$8(ctx) {
    	var div, t0, t1;

    	return {
    		c: function create() {
    			div = element("div");
    			t0 = text("Error: ");
    			t1 = text(ctx.error);
    			div.className = "toast toast-error";
    			add_location(div, file$i, 102, 2, 2466);
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			append(div, t0);
    			append(div, t1);
    		},

    		p: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}
    		}
    	};
    }

    // (107:0) {:else}
    function create_else_block$9(ctx) {
    	var each_blocks = [], each_1_lookup = new Map(), t0, ul, li0, a0, div0, t2, li1, a1, div1, current, dispose;

    	var each_value = ctx.msgs;

    	const get_key = ctx => ctx.msg.key;

    	for (var i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$4(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$4(key, child_ctx));
    	}

    	var each_1_else = null;

    	if (!each_value.length) {
    		each_1_else = create_else_block_1$4(ctx);
    		each_1_else.c();
    	}

    	return {
    		c: function create() {
    			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].c();

    			t0 = space();
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			div0 = element("div");
    			div0.textContent = "Previous";
    			t2 = space();
    			li1 = element("li");
    			a1 = element("a");
    			div1 = element("div");
    			div1.textContent = "Next";
    			div0.className = "page-item-subtitle";
    			add_location(div0, file$i, 115, 8, 2854);
    			a0.href = "#/public";
    			add_location(a0, file$i, 114, 6, 2772);
    			li0.className = "page-item page-previous";
    			add_location(li0, file$i, 113, 4, 2728);
    			div1.className = "page-item-subtitle";
    			add_location(div1, file$i, 120, 8, 3047);
    			a1.href = "#/public";
    			add_location(a1, file$i, 119, 6, 2969);
    			li1.className = "page-item page-next";
    			add_location(li1, file$i, 118, 4, 2929);
    			ul.className = "pagination";
    			add_location(ul, file$i, 112, 2, 2699);

    			dispose = [
    				listen(a0, "click", stop_propagation(prevent_default(ctx.goPrevious))),
    				listen(a1, "click", stop_propagation(prevent_default(ctx.goNext)))
    			];
    		},

    		m: function mount(target, anchor) {
    			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].m(target, anchor);

    			if (each_1_else) {
    				each_1_else.m(target, null);
    			}

    			insert(target, t0, anchor);
    			insert(target, ul, anchor);
    			append(ul, li0);
    			append(li0, a0);
    			append(a0, div0);
    			append(ul, t2);
    			append(ul, li1);
    			append(li1, a1);
    			append(a1, div1);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			const each_value = ctx.msgs;

    			group_outros();
    			each_blocks = update_keyed_each(each_blocks, changed, get_key, 1, ctx, each_value, each_1_lookup, t0.parentNode, outro_and_destroy_block, create_each_block$4, t0, get_each_context$4);
    			check_outros();

    			if (each_value.length) {
    				if (each_1_else) {
    					each_1_else.d(1);
    					each_1_else = null;
    				}
    			} else if (!each_1_else) {
    				each_1_else = create_else_block_1$4(ctx);
    				each_1_else.c();
    				each_1_else.m(t0.parentNode, t0);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			for (var i = 0; i < each_value.length; i += 1) each_blocks[i].i();

    			current = true;
    		},

    		o: function outro(local) {
    			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].o();

    			current = false;
    		},

    		d: function destroy(detaching) {
    			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].d(detaching);

    			if (each_1_else) each_1_else.d(detaching);

    			if (detaching) {
    				detach(t0);
    				detach(ul);
    			}

    			run_all(dispose);
    		}
    	};
    }

    // (105:0) {#if !msgs}
    function create_if_block$b(ctx) {
    	var div;

    	return {
    		c: function create() {
    			div = element("div");
    			div.className = "loading loading-lg";
    			add_location(div, file$i, 105, 2, 2541);
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}
    		}
    	};
    }

    // (110:2) {:else}
    function create_else_block_1$4(ctx) {
    	var p;

    	return {
    		c: function create() {
    			p = element("p");
    			p.textContent = "No messages.";
    			add_location(p, file$i, 110, 4, 2665);
    		},

    		m: function mount(target, anchor) {
    			insert(target, p, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(p);
    			}
    		}
    	};
    }

    // (108:2) {#each msgs as msg (msg.key)}
    function create_each_block$4(key_1, ctx) {
    	var first, current;

    	var messagerenderer = new MessageRenderer({
    		props: { msg: ctx.msg },
    		$$inline: true
    	});

    	return {
    		key: key_1,

    		first: null,

    		c: function create() {
    			first = empty();
    			messagerenderer.$$.fragment.c();
    			this.first = first;
    		},

    		m: function mount(target, anchor) {
    			insert(target, first, anchor);
    			mount_component(messagerenderer, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var messagerenderer_changes = {};
    			if (changed.msgs) messagerenderer_changes.msg = ctx.msg;
    			messagerenderer.$set(messagerenderer_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			messagerenderer.$$.fragment.i(local);

    			current = true;
    		},

    		o: function outro(local) {
    			messagerenderer.$$.fragment.o(local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(first);
    			}

    			messagerenderer.$destroy(detaching);
    		}
    	};
    }

    function create_fragment$i(ctx) {
    	var div3, div2, div0, h4, t0, t1, t2, div1, label, input, t3, i, t4, t5, button, t6, button_href_value, t7, t8, current_block_type_index, if_block1, if_block1_anchor, current, dispose;

    	var if_block0 = (ctx.error) && create_if_block_1$8(ctx);

    	var if_block_creators = [
    		create_if_block$b,
    		create_else_block$9
    	];

    	var if_blocks = [];

    	function select_block_type(ctx) {
    		if (!ctx.msgs) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	return {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			h4 = element("h4");
    			t0 = text("Channel: #");
    			t1 = text(ctx.channel);
    			t2 = space();
    			div1 = element("div");
    			label = element("label");
    			input = element("input");
    			t3 = space();
    			i = element("i");
    			t4 = text("\r\n        Subscribe");
    			t5 = space();
    			button = element("button");
    			t6 = text("New Post");
    			t7 = space();
    			if (if_block0) if_block0.c();
    			t8 = space();
    			if_block1.c();
    			if_block1_anchor = empty();
    			add_location(h4, file$i, 81, 6, 1899);
    			div0.className = "column";
    			add_location(div0, file$i, 80, 4, 1871);
    			attr(input, "type", "checkbox");
    			add_location(input, file$i, 85, 8, 2023);
    			i.className = "form-icon";
    			add_location(i, file$i, 89, 8, 2149);
    			label.className = "form-switch float-right";
    			add_location(label, file$i, 84, 6, 1974);
    			button.className = "btn btn-link float-right";
    			attr(button, "href", button_href_value = "?channel=" + ctx.channel + "#/compose");
    			add_location(button, file$i, 92, 6, 2215);
    			div1.className = "column";
    			add_location(div1, file$i, 83, 4, 1946);
    			div2.className = "columns";
    			add_location(div2, file$i, 79, 2, 1844);
    			div3.className = "container";
    			add_location(div3, file$i, 78, 0, 1817);

    			dispose = [
    				listen(input, "change", ctx.input_change_handler),
    				listen(input, "change", ctx.subscriptionChanged),
    				listen(button, "click", prevent_default(ctx.click_handler))
    			];
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div3, anchor);
    			append(div3, div2);
    			append(div2, div0);
    			append(div0, h4);
    			append(h4, t0);
    			append(h4, t1);
    			append(div2, t2);
    			append(div2, div1);
    			append(div1, label);
    			append(label, input);

    			input.checked = ctx.subscribed;

    			append(label, t3);
    			append(label, i);
    			append(label, t4);
    			append(div1, t5);
    			append(div1, button);
    			append(button, t6);
    			insert(target, t7, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert(target, t8, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert(target, if_block1_anchor, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (changed.subscribed) input.checked = ctx.subscribed;

    			if (ctx.error) {
    				if (if_block0) {
    					if_block0.p(changed, ctx);
    				} else {
    					if_block0 = create_if_block_1$8(ctx);
    					if_block0.c();
    					if_block0.m(t8.parentNode, t8);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			var previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);
    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(changed, ctx);
    			} else {
    				group_outros();
    				on_outro(() => {
    					if_blocks[previous_block_index].d(1);
    					if_blocks[previous_block_index] = null;
    				});
    				if_block1.o(1);
    				check_outros();

    				if_block1 = if_blocks[current_block_type_index];
    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				}
    				if_block1.i(1);
    				if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			if (if_block1) if_block1.i();
    			current = true;
    		},

    		o: function outro(local) {
    			if (if_block1) if_block1.o();
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div3);
    				detach(t7);
    			}

    			if (if_block0) if_block0.d(detaching);

    			if (detaching) {
    				detach(t8);
    			}

    			if_blocks[current_block_type_index].d(detaching);

    			if (detaching) {
    				detach(if_block1_anchor);
    			}

    			run_all(dispose);
    		}
    	};
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let $routeParams;

    	validate_store(routeParams, 'routeParams');
    	subscribe($$self, routeParams, $$value => { $routeParams = $$value; $$invalidate('$routeParams', $routeParams); });

    	

      let msgs = false;
      let error = $routeParams.error || false;
      let channel = $routeParams.channel || false;
      let subscribed = false;

      if (!channel) {
        console.log("can't navigate to unnamed channel, going back to public");
        location = "index.html#/public"; // force reload.
      }

      let opts = {
        limit: $routeParams.limit || getPref("limit", 10),
        reverse: true
      };

      ssb.channelSubscribed(channel).then(s => { const $$result = (subscribed = s); $$invalidate('subscribed', subscribed); return $$result; });

      const subscriptionChanged = ev => {
        let v = ev.target.checked;
        if (v) {
          ssb.channelSubscribe(channel).catch(() => { const $$result = (subscribed = false); $$invalidate('subscribed', subscribed); return $$result; });
        } else {
          ssb.channelUnsubscribe(channel).catch(() => { const $$result = (subscribed = true); $$invalidate('subscribed', subscribed); return $$result; });
        }
      };

      const goNext = () => {
        navigate("/channel", {
          channel,
          lt: msgs[msgs.length - 1].rts
        });
      };
      const goPrevious = () => {
        history.back();
      };

    	function input_change_handler() {
    		subscribed = this.checked;
    		$$invalidate('subscribed', subscribed);
    	}

    	function click_handler() {
    		return navigate('/compose', { channel });
    	}

    	$$self.$$.update = ($$dirty = { opts: 1, $routeParams: 1, channel: 1, error: 1 }) => {
    		if ($$dirty.opts || $$dirty.$routeParams || $$dirty.channel || $$dirty.error) { {
            Object.assign(opts, $routeParams);
        
            document.title = `Patchfox - #${channel}`;
        
            if (opts.hasOwnProperty("lt")) {
              opts.lt = parseInt(opts.lt); $$invalidate('opts', opts), $$invalidate('$routeParams', $routeParams), $$invalidate('channel', channel), $$invalidate('error', error);
            }
        
            if (opts.hasOwnProperty("limit")) {
              opts.limit = parseInt(opts.limit); $$invalidate('opts', opts), $$invalidate('$routeParams', $routeParams), $$invalidate('channel', channel), $$invalidate('error', error);
            }
        
            let promise = ssb
              .channel(channel, opts)
              .then(ms => {
                console.log("msg", ms);
                $$invalidate('msgs', msgs = ms);
                window.scrollTo(0, 0);
              })
              .catch(n => {
                if (!error) {
                  console.error("errrrooooor", n);
                }
              });
          } }
    	};

    	return {
    		msgs,
    		error,
    		channel,
    		subscribed,
    		subscriptionChanged,
    		goNext,
    		goPrevious,
    		input_change_handler,
    		click_handler
    	};
    }

    class Channel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		if (!document.getElementById("svelte-kdiu44-style")) add_css$7();
    		init(this, options, instance$h, create_fragment$i, safe_not_equal, []);
    	}
    }

    /* src\views\Settings.svelte generated by Svelte v3.4.4 */

    const file$j = "src\\views\\Settings.svelte";

    function add_css$8() {
    	var style = element("style");
    	style.id = 'svelte-1e0jkdi-style';
    	style.textContent = ".filter.svelte-1e0jkdi{height:300px;margin-bottom:0.4rem;overflow:hidden}.feed.svelte-1e0jkdi{max-width:100%;overflow:hidden}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2V0dGluZ3Muc3ZlbHRlIiwic291cmNlcyI6WyJTZXR0aW5ncy5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdD5cclxuICBpbXBvcnQgeyBvbk1vdW50IH0gZnJvbSBcInN2ZWx0ZVwiO1xyXG4gIGltcG9ydCB7XHJcbiAgICBnZXRQcmVmLFxyXG4gICAgc2V0UHJlZixcclxuICAgIHNldENvbm5lY3Rpb25Db25maWd1cmF0aW9uLFxyXG4gICAgbmF2aWdhdGVcclxuICB9IGZyb20gXCIuLi91dGlscy5qc1wiO1xyXG4gIGltcG9ydCB7IGdldEZpbHRlcnMsIGFkZEZpbHRlciwgZGVsZXRlRmlsdGVyIH0gZnJvbSBcIi4uL2FidXNlUHJldmVudGlvbi5qc1wiO1xyXG4gXHJcbiAgbGV0IGtleXMgPSB7fTtcclxuICBsZXQgcmVtb3RlID0gXCJcIjtcclxuICBsZXQgbGltaXQgPSBnZXRQcmVmKFwibGltaXRcIiwgMTApO1xyXG4gIGxldCBjb2x1bW5TaXplID0gZ2V0UHJlZihcImNvbHVtblNpemVcIiwgXCJzaG9ydFwiKTtcclxuXHJcbiAgZG9jdW1lbnQudGl0bGUgPSBcIlBhdGNoZm94IC0gU2V0dGluZ3NcIjtcclxuXHJcbiAgLy8gbWVzc2FnZSB0eXBlIGZpbHRlcnNcclxuICBsZXQgc2hvd1R5cGVVbmtub3duID0gZ2V0UHJlZihcInNob3dUeXBlVW5rbm93blwiLCBmYWxzZSk7XHJcbiAgbGV0IHNob3dUeXBlQWJvdXQgPSBnZXRQcmVmKFwic2hvd1R5cGVBYm91dFwiLCB0cnVlKTtcclxuICBsZXQgc2hvd1R5cGVCbG9nID0gZ2V0UHJlZihcInNob3dUeXBlQmxvZ1wiLCB0cnVlKTtcclxuICBsZXQgc2hvd1R5cGVDaGFubmVsID0gZ2V0UHJlZihcInNob3dUeXBlQ2hhbm5lbFwiLCB0cnVlKTtcclxuICBsZXQgc2hvd1R5cGVDb250YWN0ID0gZ2V0UHJlZihcInNob3dUeXBlQ29udGFjdFwiLCB0cnVlKTtcclxuICBsZXQgc2hvd1R5cGVQb3N0ID0gZ2V0UHJlZihcInNob3dUeXBlUG9zdFwiLCB0cnVlKTtcclxuICBsZXQgc2hvd1R5cGVQcml2YXRlID0gZ2V0UHJlZihcInNob3dUeXBlUHJpdmF0ZVwiLCB0cnVlKTtcclxuICBsZXQgc2hvd1R5cGVQdWIgPSBnZXRQcmVmKFwic2hvd1R5cGVQdWJcIiwgdHJ1ZSk7XHJcbiAgbGV0IHNob3dUeXBlVm90ZSA9IGdldFByZWYoXCJzaG93VHlwZVZvdGVcIiwgdHJ1ZSk7XHJcblxyXG4gIC8vIEFidXNlIFByZXZlbnRpb24gLSBmaWx0ZXJzXHJcbiAgbGV0IGN1cnJlbnRGaWx0ZXJzID0gZ2V0RmlsdGVycygpO1xyXG4gIGxldCBmaWx0ZXJGZWVkID0gXCJcIjtcclxuICBsZXQgZmlsdGVyQ2hhbm5lbCA9IFwiXCI7XHJcbiAgbGV0IGZpbHRlcktleXdvcmRzID0gXCJcIjtcclxuICBsZXQgZmlsdGVyRXhwaXJ5ID0gXCJcIjtcclxuICBsZXQgZmlsdGVyQWN0aW9uID0gXCJcIjtcclxuXHJcbiAgY29uc3Qgc2F2ZUNvbmZpZ3VyYXRpb24gPSBldiA9PiB7XHJcbiAgICBzZXRDb25uZWN0aW9uQ29uZmlndXJhdGlvbih7IHJlbW90ZSwga2V5czogSlNPTi5wYXJzZShrZXlzKSwgbWFuaWZlc3QgfSk7XHJcbiAgICBuYXZpZ2F0ZShcIi9wdWJsaWNcIik7XHJcbiAgICBsb2NhdGlvbi5yZWxvYWQoKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBzZWxlY3RlZEZpbGUgPSBldiA9PiB7XHJcbiAgICBjb25zdCBzZWNyZXRGaWxlID0gZXYudGFyZ2V0LmZpbGVzWzBdO1xyXG4gICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbihldnQpIHtcclxuICAgICAgY29uc29sZS5sb2coZXZ0LnRhcmdldC5yZXN1bHQpO1xyXG4gICAgICBjb25zdCBjb250ZW50cyA9IGV2dC50YXJnZXQucmVzdWx0O1xyXG4gICAgICBsZXQgc2VjcmV0ID0gY29udGVudHMuc3BsaXQoXCJcXG5cIikuZmlsdGVyKGZ1bmN0aW9uKGxpbmUpIHtcclxuICAgICAgICByZXR1cm4gbGluZS5pbmRleE9mKFwiI1wiKSAhPSAwO1xyXG4gICAgICB9KTtcclxuICAgICAgc2VjcmV0ID0gSlNPTi5wYXJzZShzZWNyZXQuam9pbihcIlxcblwiKSk7XHJcbiAgICAgIHJlbW90ZSA9IGB3czovL2xvY2FsaG9zdDo4OTg5fnNoczoke3NlY3JldC5pZC5zbGljZShcclxuICAgICAgICAwLFxyXG4gICAgICAgIHNlY3JldC5pZC5pbmRleE9mKFwiPVwiKSArIDFcclxuICAgICAgKX1gO1xyXG4gICAgICB1cGRhdGVVSSh7IGtleXM6IHNlY3JldCwgcmVtb3RlIH0pO1xyXG4gICAgfTtcclxuICAgIHJlYWRlci5yZWFkQXNUZXh0KHNlY3JldEZpbGUpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IHVwZGF0ZVVJID0gc2F2ZWREYXRhID0+IHtcclxuICAgIGNvbnNvbGUubG9nKFwic2F2ZWQgZGF0YSBmcm9tIHNldHRpbmdzXCIsIHNhdmVkRGF0YSk7XHJcbiAgICByZW1vdGUgPSBzYXZlZERhdGEucmVtb3RlIHx8IFwiXCI7XHJcbiAgICBpZiAoc2F2ZWREYXRhLmtleXMpIHtcclxuICAgICAga2V5cyA9IEpTT04uc3RyaW5naWZ5KHNhdmVkRGF0YS5rZXlzLCBudWxsLCAyKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGtleXMgPSBcIlwiO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IG9uRXJyb3IgPSBlcnJvciA9PiB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiZXJyb3Igb24gc2V0dGluZ3NcIiwgZXJyb3IpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IGdldHRpbmdTdG9yZWRTZXR0aW5ncyA9IGJyb3dzZXIuc3RvcmFnZS5sb2NhbFxyXG4gICAgLmdldCgpXHJcbiAgICAudGhlbih1cGRhdGVVSSwgb25FcnJvcik7XHJcblxyXG4gIGNvbnN0IGFkZE5ld0ZpbHRlciA9ICgpID0+IHtcclxuICAgIGxldCBrZXl3b3JkcyA9IGZpbHRlcktleXdvcmRzXHJcbiAgICAgIC5zcGxpdChcIixcIilcclxuICAgICAgLm1hcCh2ID0+IHYudHJpbSgpKVxyXG4gICAgICAuZmlsdGVyKHYgPT4gdi5sZW5ndGggIT09IDApO1xyXG5cclxuICAgIGxldCBmaWx0ZXIgPSB7fTtcclxuICAgIGZpbHRlci5hY3Rpb24gPSBmaWx0ZXJBY3Rpb24ubGVuZ3RoICE9PSAwID8gZmlsdGVyQWN0aW9uIDogZmFsc2U7XHJcbiAgICBmaWx0ZXIuZmVlZCA9IGZpbHRlckZlZWQubGVuZ3RoICE9PSAwID8gZmlsdGVyRmVlZCA6IGZhbHNlO1xyXG4gICAgZmlsdGVyLmNoYW5uZWwgPSBmaWx0ZXJDaGFubmVsLmxlbmd0aCAhPT0gMCA/IGZpbHRlckNoYW5uZWwgOiBmYWxzZTtcclxuICAgIGZpbHRlci5rZXl3b3JkcyA9IGtleXdvcmRzO1xyXG4gICAgZmlsdGVyLmV4cGlyZXMgPSBmaWx0ZXJFeHBpcnkubGVuZ3RoICE9PSAwID8gZmlsdGVyRXhwaXJ5IDogZmFsc2U7XHJcblxyXG4gICAgaWYgKGZpbHRlci5jaGFubmVsICYmIGZpbHRlci5jaGFubmVsLnN0YXJ0c1dpdGgoXCIjXCIpKSB7XHJcbiAgICAgIGZpbHRlci5jaGFubmVsID0gZmlsdGVyLmNoYW5uZWwuc2xpY2UoMSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKFxyXG4gICAgICBmaWx0ZXIuYWN0aW9uICYmXHJcbiAgICAgIChmaWx0ZXIuZmVlZCB8fCBmaWx0ZXIuY2hhbm5lbCB8fCBmaWx0ZXIua2V5d29yZHMubGVuZ3RoID4gMClcclxuICAgICkge1xyXG4gICAgICBhZGRGaWx0ZXIoZmlsdGVyKTtcclxuXHJcbiAgICAgIGN1cnJlbnRGaWx0ZXJzID0gZ2V0RmlsdGVycygpO1xyXG5cclxuICAgICAgY29uc29sZS5kaXIoXCJmaWx0ZXJzXCIsIGN1cnJlbnRGaWx0ZXJzKTtcclxuXHJcbiAgICAgIGZpbHRlckZlZWQgPSBcIlwiO1xyXG4gICAgICBmaWx0ZXJDaGFubmVsID0gXCJcIjtcclxuICAgICAgZmlsdGVyS2V5d29yZHMgPSBcIlwiO1xyXG4gICAgICBmaWx0ZXJFeHBpcnkgPSBcIlwiO1xyXG4gICAgICBmaWx0ZXJBY3Rpb24gPSBcIlwiO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYWxlcnQoXCJGaWxsIGF0IGxlYXN0IGZpbHRlciBhY3Rpb24gYW5kIG9uZSBvZiBmZWVkLCBjaGFubmVsIG9yIGtleXdvcmRzXCIpO1xyXG4gICAgfVxyXG4gIH07XHJcbjwvc2NyaXB0PlxyXG5cclxuPHN0eWxlPlxyXG4gIC5maWx0ZXIge1xyXG4gICAgaGVpZ2h0OiAzMDBweDtcclxuICAgIG1hcmdpbi1ib3R0b206IDAuNHJlbTtcclxuICAgIG92ZXJmbG93OiBoaWRkZW47XHJcbiAgfVxyXG5cclxuICAuZmVlZCB7XHJcbiAgICBtYXgtd2lkdGg6IDEwMCU7XHJcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xyXG4gIH1cclxuPC9zdHlsZT5cclxuXHJcbjxoMT5TZXR0aW5nczwvaDE+XHJcbjxwPlxyXG4gIFNldHRpbmdzIGNoYW5nZXMgYXJlIHNhdmVkIGFzIHlvdSBtYWtlIHRoZW0gZXhjZXB0IGZvciBpZGVudGl0eSBhbmQgY29ubmVjdGlvblxyXG4gIGNoYW5nZXMsIHRob3NlIHJlcXVpcmUgYSBmdWxsIHBhZ2UgcmVsb2FkIGFuZCB0aHVzIHlvdSBuZWVkIHRvIHByZXNzIGEgc2F2ZVxyXG4gIGJ1dHRvbi4gVGhlIHJlYXNvbiBiZWhpbmQgdGhpcyBpcyB0aGF0IFBhdGNoZm94IG5lZWRzIHRvIGRpc2Nvbm5lY3QgYW5kXHJcbiAgcmVjb25uZWN0IHRvIHRoZVxyXG4gIDxpPnNzYi1zZXJ2ZXI8L2k+XHJcbiAgdXNpbmcgdGhlIG5ldyBpbmZvLlxyXG48L3A+XHJcbjxwPlxyXG4gIDxiPlxyXG4gICAgWW91IGNhbid0IHVzZSBQYXRjaGZveCB1bnRpbCB5b3UgZmlsbCB5b3VyXHJcbiAgICA8aT5Db25uZWN0aW9uICYgSWRlbnRpdHk8L2k+XHJcbiAgICBpbmZvcm1hdGlvbi5cclxuICAgIDxhXHJcbiAgICAgIGhyZWY9XCIvZG9jcy9pbmRleC5odG1sIy90cm91Ymxlc2hvb3Rpbmcvbm8tY29uZmlndXJhdGlvblwiXHJcbiAgICAgIHRhcmdldD1cIl9ibGFua1wiPlxyXG4gICAgICBJZiB5b3Ugd2FudCBtb3JlIGhlbHAgcmVnYXJkaW5nIGNvbm5lY3Rpb24gYW5kIGNvbmZpZ3VyYXRpb24gY2xpY2sgaGVyZVxyXG4gICAgPC9hPlxyXG4gICAgLlxyXG4gIDwvYj5cclxuPC9wPlxyXG5cclxuPGg0PkNvbm5lY3Rpb24gJiBJZGVudGl0eTwvaDQ+XHJcblxyXG48Zm9ybSBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICA8bGFiZWwgY2xhc3M9XCJmb3JtLWxhYmVsXCIgZm9yPVwic2VjcmV0LWZpbGVcIj5cclxuICAgIFBhdGNoZm94IGNhbiBpbmZlciB0aGUgdmFsdWVzIGZvciBib3RoXHJcbiAgICA8aT5yZW1vdGU8L2k+XHJcbiAgICBhbmRcclxuICAgIDxpPnNlY3JldDwvaT5cclxuICAgIGZyb20geW91clxyXG4gICAgPGNvZGU+fi8uc3NiL3NlY3JldDwvY29kZT5cclxuICAgIGZpbGUuIFlvdSBjYW4gdXNlIHRoZSBidXR0b24gYmVsb3cgdG8gYnJvd3NlIGZvciBpdC5cclxuICA8L2xhYmVsPlxyXG4gIDxpbnB1dFxyXG4gICAgdHlwZT1cImZpbGVcIlxyXG4gICAgY2xhc3M9XCJmb3JtLWlucHV0XCJcclxuICAgIGlkPVwic2VjcmV0LWZpbGVcIlxyXG4gICAgb246Y2hhbmdlPXtzZWxlY3RlZEZpbGV9IC8+XHJcbiAgPGxhYmVsIGNsYXNzPVwiZm9ybS1sYWJlbFwiIGZvcj1cInJlbW90ZVwiPlJlbW90ZTwvbGFiZWw+XHJcbiAgPGlucHV0XHJcbiAgICBjbGFzcz1cImZvcm0taW5wdXRcIlxyXG4gICAgdHlwZT1cInRleHRcIlxyXG4gICAgaWQ9XCJyZW1vdGVcIlxyXG4gICAgcGxhY2Vob2xkZXI9XCJyZW1vdGVcIlxyXG4gICAgYmluZDp2YWx1ZT17cmVtb3RlfSAvPlxyXG5cclxuICA8bGFiZWwgY2xhc3M9XCJmb3JtLWxhYmVsXCIgZm9yPVwic2VjcmV0XCI+U2VjcmV0PC9sYWJlbD5cclxuICA8dGV4dGFyZWFcclxuICAgIGNsYXNzPVwiZm9ybS1pbnB1dFwiXHJcbiAgICBpZD1cInNlY3JldFwiXHJcbiAgICBwbGFjZWhvbGRlcj1cIllvdXIgc2VjcmV0XCJcclxuICAgIHJvd3M9XCI4XCJcclxuICAgIGJpbmQ6dmFsdWU9e2tleXN9IC8+XHJcbiAgPGJyIC8+XHJcbiAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeSBmbG9hdC1yaWdodFwiIG9uOmNsaWNrPXtzYXZlQ29uZmlndXJhdGlvbn0+XHJcbiAgICBTYXZlIElkZW50aXR5ICYgUmVtb3RlXHJcbiAgPC9idXR0b24+XHJcbiAgPHA+U2F2aW5nIGlkZW50aXR5IGFuZCByZW1vdGUgd2lsbCBjYXVzZSBhIGZ1bGwgcGFnZSByZWZyZXNoLjwvcD5cclxuPC9mb3JtPlxyXG5cclxuPGg0PlZpZXdlaW5nIEV4cGVyaWVuY2U8L2g0PlxyXG48Zm9ybSBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICA8bGFiZWwgY2xhc3M9XCJmb3JtLWxhYmVsXCIgZm9yPVwibGltaXRcIj5NZXNzYWdlcyBwZXIgcGFnZTwvbGFiZWw+XHJcbiAgPGlucHV0XHJcbiAgICBjbGFzcz1cImZvcm0taW5wdXRcIlxyXG4gICAgdHlwZT1cIm51bWJlclwiXHJcbiAgICBiaW5kOnZhbHVlPXtsaW1pdH1cclxuICAgIG9uOmNoYW5nZT17KCkgPT4gc2V0UHJlZignbGltaXQnLCBsaW1pdCl9IC8+XHJcblxyXG4gIDxiciAvPlxyXG4gIDxzcGFuPlxyXG4gICAgV2hpY2ggbWVzc2FnZSB0eXBlcyB5b3Ugd2FudCB0byBzZWU/XHJcbiAgICA8YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiL2RvY3MvaW5kZXguaHRtbCMvbWVzc2FnZV90eXBlcy9cIj5cclxuICAgICAgQ2xpY2sgaGVyZSBmb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dFxyXG4gICAgICA8aT5NZXNzYWdlIFR5cGVzPC9pPlxyXG4gICAgPC9hPlxyXG4gIDwvc3Bhbj5cclxuICA8bGFiZWwgY2xhc3M9XCJmb3JtLXN3aXRjaFwiPlxyXG4gICAgPGlucHV0XHJcbiAgICAgIHR5cGU9XCJjaGVja2JveFwiXHJcbiAgICAgIGJpbmQ6Y2hlY2tlZD17c2hvd1R5cGVBYm91dH1cclxuICAgICAgb246Y2hhbmdlPXtldiA9PiB7XHJcbiAgICAgICAgc2V0UHJlZignc2hvd1R5cGVBYm91dCcsIHNob3dUeXBlQWJvdXQpO1xyXG4gICAgICB9fSAvPlxyXG4gICAgPGkgY2xhc3M9XCJmb3JtLWljb25cIiAvPlxyXG4gICAgPGI+QWJvdXQ8L2I+XHJcbiAgICAoYWthIHBlb3BsZSBzZXR0aW5nIGF2YXRhcnMgYW5kIGRlc2NyaXB0aW9uczsgZ2F0aGVyaW5ncylcclxuICA8L2xhYmVsPlxyXG4gIDxsYWJlbCBjbGFzcz1cImZvcm0tc3dpdGNoXCI+XHJcbiAgICA8aW5wdXRcclxuICAgICAgdHlwZT1cImNoZWNrYm94XCJcclxuICAgICAgYmluZDpjaGVja2VkPXtzaG93VHlwZUJsb2d9XHJcbiAgICAgIG9uOmNoYW5nZT17ZXYgPT4ge1xyXG4gICAgICAgIHNldFByZWYoJ3Nob3dUeXBlQmxvZycsIHNob3dUeXBlQmxvZyk7XHJcbiAgICAgIH19IC8+XHJcbiAgICA8aSBjbGFzcz1cImZvcm0taWNvblwiIC8+XHJcbiAgICA8Yj5CbG9nPC9iPlxyXG4gICAgKExvbmdmb3JtIHRleHQgcG9zdHMpXHJcbiAgPC9sYWJlbD5cclxuICA8bGFiZWwgY2xhc3M9XCJmb3JtLXN3aXRjaFwiPlxyXG4gICAgPGlucHV0XHJcbiAgICAgIHR5cGU9XCJjaGVja2JveFwiXHJcbiAgICAgIGJpbmQ6Y2hlY2tlZD17c2hvd1R5cGVDaGFubmVsfVxyXG4gICAgICBvbjpjaGFuZ2U9e2V2ID0+IHtcclxuICAgICAgICBzZXRQcmVmKCdzaG93VHlwZUNoYW5uZWwnLCBzaG93VHlwZUNoYW5uZWwpO1xyXG4gICAgICB9fSAvPlxyXG4gICAgPGkgY2xhc3M9XCJmb3JtLWljb25cIiAvPlxyXG4gICAgPGI+Q2hhbm5lbDwvYj5cclxuICAgIChQZW9wbGUgc3Vic2NyaWJpbmcgdG8gY2hhbm5lbHMpXHJcbiAgPC9sYWJlbD5cclxuICA8bGFiZWwgY2xhc3M9XCJmb3JtLXN3aXRjaFwiPlxyXG4gICAgPGlucHV0XHJcbiAgICAgIHR5cGU9XCJjaGVja2JveFwiXHJcbiAgICAgIGJpbmQ6Y2hlY2tlZD17c2hvd1R5cGVDb250YWN0fVxyXG4gICAgICBvbjpjaGFuZ2U9e2V2ID0+IHtcclxuICAgICAgICBzZXRQcmVmKCdzaG93VHlwZUNvbnRhY3QnLCBzaG93VHlwZUNvbnRhY3QpO1xyXG4gICAgICB9fSAvPlxyXG4gICAgPGkgY2xhc3M9XCJmb3JtLWljb25cIiAvPlxyXG4gICAgPGI+Q29udGFjdDwvYj5cclxuICAgIChQZW9wbGUgZm9sbG93aW5nIGVhY2ggb3RoZXIpXHJcbiAgPC9sYWJlbD5cclxuICA8bGFiZWwgY2xhc3M9XCJmb3JtLXN3aXRjaFwiPlxyXG4gICAgPGlucHV0XHJcbiAgICAgIHR5cGU9XCJjaGVja2JveFwiXHJcbiAgICAgIGJpbmQ6Y2hlY2tlZD17c2hvd1R5cGVQb3N0fVxyXG4gICAgICBvbjpjaGFuZ2U9e2V2ID0+IHtcclxuICAgICAgICBzZXRQcmVmKCdzaG93VHlwZVBvc3QnLCBzaG93VHlwZVBvc3QpO1xyXG4gICAgICB9fSAvPlxyXG4gICAgPGkgY2xhc3M9XCJmb3JtLWljb25cIiAvPlxyXG4gICAgPGI+UG9zdHM8L2I+XHJcbiAgICAoQ29tbW9uIGNvbnRlbnQgcG9zdCwgbGVhdmUgdGhpcyBvbiBvciBpdCBpcyBub3QgdGhhdCBmdW4pXHJcbiAgPC9sYWJlbD5cclxuICA8bGFiZWwgY2xhc3M9XCJmb3JtLXN3aXRjaFwiPlxyXG4gICAgPGlucHV0XHJcbiAgICAgIHR5cGU9XCJjaGVja2JveFwiXHJcbiAgICAgIGJpbmQ6Y2hlY2tlZD17c2hvd1R5cGVQdWJ9XHJcbiAgICAgIG9uOmNoYW5nZT17ZXYgPT4ge1xyXG4gICAgICAgIHNldFByZWYoJ3Nob3dUeXBlUHViJywgc2hvd1R5cGVQdWIpO1xyXG4gICAgICB9fSAvPlxyXG4gICAgPGkgY2xhc3M9XCJmb3JtLWljb25cIiAvPlxyXG4gICAgPGI+UHViPC9iPlxyXG4gICAgKFB1YiBzZXJ2ZXJzIGFubm91bmNlbWVudHMpXHJcbiAgPC9sYWJlbD5cclxuXHJcbiAgPGxhYmVsIGNsYXNzPVwiZm9ybS1zd2l0Y2hcIj5cclxuICAgIDxpbnB1dFxyXG4gICAgICB0eXBlPVwiY2hlY2tib3hcIlxyXG4gICAgICBiaW5kOmNoZWNrZWQ9e3Nob3dUeXBlUHJpdmF0ZX1cclxuICAgICAgb246Y2hhbmdlPXtldiA9PiB7XHJcbiAgICAgICAgc2V0UHJlZignc2hvd1R5cGVQcml2YXRlJywgc2hvd1R5cGVQcml2YXRlKTtcclxuICAgICAgfX0gLz5cclxuICAgIDxpIGNsYXNzPVwiZm9ybS1pY29uXCIgLz5cclxuICAgIDxiPlByaXZhdGU8L2I+XHJcbiAgICAoUHJpdmF0ZSBtZXNzYWdlczsgWW91IHdvbid0IGJlIGFibGUgdG8gcmVhZCB0aGVtLCBidXQgeW91J2xsIHNlZSB0aGVpclxyXG4gICAgZW5jcnlwdGVkIGNvbnRlbnQgcGFzc2luZyBieSlcclxuICA8L2xhYmVsPlxyXG5cclxuICA8bGFiZWwgY2xhc3M9XCJmb3JtLXN3aXRjaFwiPlxyXG4gICAgPGlucHV0XHJcbiAgICAgIHR5cGU9XCJjaGVja2JveFwiXHJcbiAgICAgIGJpbmQ6Y2hlY2tlZD17c2hvd1R5cGVWb3RlfVxyXG4gICAgICBvbjpjaGFuZ2U9e2V2ID0+IHtcclxuICAgICAgICBzZXRQcmVmKCdzaG93VHlwZVZvdGUnLCBzaG93VHlwZVZvdGUpO1xyXG4gICAgICB9fSAvPlxyXG4gICAgPGkgY2xhc3M9XCJmb3JtLWljb25cIiAvPlxyXG4gICAgPGI+Vm90ZTwvYj5cclxuICAgIChQZW9wbGUgbGlraW5nL2RpZ2dpbmcgc3R1ZmYpXHJcbiAgPC9sYWJlbD5cclxuICA8ZGl2IGNsYXNzPVwiZGl2aWRlclwiIC8+XHJcbiAgPGxhYmVsIGNsYXNzPVwiZm9ybS1zd2l0Y2hcIj5cclxuICAgIDxpbnB1dFxyXG4gICAgICB0eXBlPVwiY2hlY2tib3hcIlxyXG4gICAgICBiaW5kOmNoZWNrZWQ9e3Nob3dUeXBlVW5rbm93bn1cclxuICAgICAgb246Y2hhbmdlPXtldiA9PiB7XHJcbiAgICAgICAgc2V0UHJlZignc2hvd1R5cGVVbmtub3duJywgc2hvd1R5cGVVbmtub3duKTtcclxuICAgICAgfX0gLz5cclxuICAgIDxpIGNsYXNzPVwiZm9ybS1pY29uXCIgLz5cclxuICAgIDxiPlVua25vd248L2I+XHJcbiAgICAoU2hvdyBtZXNzYWdlcyBQYXRjaGZveCBkb2Vzbid0IHVuZGVyc3RhbmQgYXMgdGhlaXIgcmF3IGNvbnRlbnQpXHJcbiAgPC9sYWJlbD5cclxuICA8YnIgLz5cclxuICA8bGFiZWwgY2xhc3M9XCJmb3JtLWxhYmVsXCI+XHJcbiAgICBGZWVkIGNvbHVtbiBzaXplLiBUaGVyZSBpcyByZXNlYXJjaCB0aGF0IHNheXMgdGhhdCBhIHNob3J0IGNvbHVtbiBzaXplIG1ha2VzXHJcbiAgICBmb3IgYSBtb3JlIHBsZWFzYW50IHJlYWRpbmcgZXhwZXJpZW5jZSwgc3RpbGwgc29tZSB1c2VycyBwcmVmZXIgdG8gdXNlIHRoZVxyXG4gICAgZnVsbCBzY3JlZW4gc3BhY2UuIFlvdXIgY2hvaWNlIGlzIGJldHdlZW4gcmVhZGluZyB0aHJvdWdoIGxvbmcgdGV4dCBsaW5lcyBvclxyXG4gICAgc2hvcnQgb25lcy5cclxuICA8L2xhYmVsPlxyXG4gIDxsYWJlbCBjbGFzcz1cImZvcm0tcmFkaW9cIj5cclxuICAgIDxpbnB1dFxyXG4gICAgICB0eXBlPVwicmFkaW9cIlxyXG4gICAgICBuYW1lPVwiY29sdW1uLXNpemVcIlxyXG4gICAgICBiaW5kOmdyb3VwPXtjb2x1bW5TaXplfVxyXG4gICAgICBvbjpjaGFuZ2U9eygpID0+IHNldFByZWYoJ2NvbHVtblNpemUnLCBjb2x1bW5TaXplKX1cclxuICAgICAgdmFsdWU9XCJzaG9ydFwiIC8+XHJcbiAgICA8aSBjbGFzcz1cImZvcm0taWNvblwiIC8+XHJcbiAgICBTaG9ydCBjb2x1bW5cclxuICA8L2xhYmVsPlxyXG4gIDxsYWJlbCBjbGFzcz1cImZvcm0tcmFkaW9cIj5cclxuICAgIDxpbnB1dFxyXG4gICAgICB0eXBlPVwicmFkaW9cIlxyXG4gICAgICBuYW1lPVwiY29sdW1uLXNpemVcIlxyXG4gICAgICBiaW5kOmdyb3VwPXtjb2x1bW5TaXplfVxyXG4gICAgICBvbjpjaGFuZ2U9eygpID0+IHNldFByZWYoJ2NvbHVtblNpemUnLCBjb2x1bW5TaXplKX1cclxuICAgICAgdmFsdWU9XCJsb25nXCIgLz5cclxuICAgIDxpIGNsYXNzPVwiZm9ybS1pY29uXCIgLz5cclxuICAgIExvbmcgY29sdW1uXHJcbiAgPC9sYWJlbD5cclxuPC9mb3JtPlxyXG48aDQ+QWJ1c2UgUHJldmVudGlvbjwvaDQ+XHJcbjxwPlxyXG4gIFVzZSB0aGUgZmVhdHVyZXMgZnJvbSB0aGlzIHNlY3Rpb24gdG8gdGFpbG9yIHlvdXIgUGF0Y2hmb3ggZXhwZXJpZW5jZSB0byBzdWl0XHJcbiAgeW91ciBuZWVkcy5cclxuPC9wPlxyXG48aDU+RmlsdGVyczwvaDU+XHJcbjxwPlxyXG4gIFVzZSBmaWx0ZXJzIHRvIGhpZGUgbWVzc2FnZXMgYW5kIGJsdXIgaW1hZ2VzLiBVc2UgYW55IGNvbWJpbmF0aW9uIG9mIGNoYW5uZWwsXHJcbiAgZmVlZHMgYW5kIGtleXdvcmRzIChzZXBhcmF0ZWQgYnkgY29tbWFzKSB0byBjcmVhdGUgeW91ciB0cmlnZ2VycyBhbmQgbWFrZSBTU0JcclxuICB0aGUgcGxhdGZvcm0geW91IHdhbnQuIEJlIGF3YXJlIHRoYXQgdGhlc2UgZmlsdGVycyBhcmUgc2F2ZWQgdG8geW91ciBicm93c2VyLFxyXG4gIHRoZXkgYXJlIG5vdCBzaGFyZWQgb24gdGhlIGZlZWQsIHRoZXkgZG9uJ3QgYWZmZWN0IGdvc3NpcGluZywgdGhleSBvbmx5IGFmZmVjdFxyXG4gIHRoZSBkaXNwbGF5aW5nIG9mIG1lc3NhZ2VzIGFuZCBpbWFnZXMgaW4gUGF0Y2hmb3ggaXRzZWxmLiBJZiB5b3UgY3JlYXRlIGFcclxuICBmaWx0ZXIgYW5kIG9wZW4gYSBkaWZmZXJlbnQgY2xpZW50LCB0aGV5IHdvbid0IGJlIHdvcmtpbmcgdGhlcmUuIElmIHlvdSB3YW50XHJcbiAgdG8gbGVhcm4gbW9yZSBhYm91dFxyXG4gIDxhIGhyZWY9XCIvZG9jcy9pbmRleC5odG1sIy9mZWF0dXJlcy9maWx0ZXJcIj5cclxuICAgIGZpbHRlcnMsIGNsaWNrIGhlcmUgdG8gZ28gdG8gdGhlIGRvY3VtZW50YXRpb24uXHJcbiAgPC9hPlxyXG4gIFlvdSBjYW4gY3JlYXRlIGFzIG1hbnkgZmlsdGVycyBhcyB5b3Ugd2FudC5cclxuPC9wPlxyXG48ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+XHJcbiAgPGRpdiBjbGFzcz1cImNvbHVtbnNcIj5cclxuICAgIHsjZWFjaCBjdXJyZW50RmlsdGVycyBhcyBmaWx0ZXJ9XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJjb2x1bW4gY29sLTZcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZCBmaWx0ZXJcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkLWhlYWRlclwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZC10aXRsZSBoNVwiPntmaWx0ZXIuYWN0aW9ufTwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZC1ib2R5XCI+XHJcbiAgICAgICAgICAgIDx1bD5cclxuICAgICAgICAgICAgICB7I2lmIGZpbHRlci5mZWVkfVxyXG4gICAgICAgICAgICAgICAgPGxpPkZyb20gPGEgaHJlZj1cIj9mZWVkPXtmaWx0ZXIuZmVlZH0jL3Byb2ZpbGVcIiB0YXJnZXQ9XCJfYmxhbmtcIiBjbGFzcz1cImZlZWRcIj57ZmlsdGVyLmZlZWR9PC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgey9pZn1cclxuICAgICAgICAgICAgICB7I2lmIGZpbHRlci5jaGFubmVsfVxyXG4gICAgICAgICAgICAgICAgPGxpPk9uIGNoYW5uZWwgPGEgaHJlZj1cIj9jaGFubmVsPXtmaWx0ZXIuZmVlZH0jL2NoYW5uZWxcIiB0YXJnZXQ9XCJfYmxhbmtcIiBjbGFzcz1cImZlZWRcIj4je2ZpbHRlci5jaGFubmVsfTwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIHsvaWZ9XHJcbiAgICAgICAgICAgICAgeyNpZiBmaWx0ZXIua2V5d29yZHMubGVuZ3RoID4gMH1cclxuICAgICAgICAgICAgICAgIDxpPlxyXG4gICAgICAgICAgICAgICAgICA8bGk+Q29udGFpbmluZzoge2ZpbHRlci5rZXl3b3Jkcy5qb2luKCcsICcpfTwvbGk+XHJcbiAgICAgICAgICAgICAgICA8L2k+XHJcbiAgICAgICAgICAgICAgey9pZn1cclxuICAgICAgICAgICAgICB7I2lmIGZpbHRlci5leHBpcmVzfVxyXG4gICAgICAgICAgICAgICAgPGxpPkV4cGlyaW5nIGluIHtmaWx0ZXIuZXhwaXJlc308L2xpPlxyXG4gICAgICAgICAgICAgIHsvaWZ9XHJcbiAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkLWZvb3RlclwiPlxyXG4gICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgY2xhc3M9XCJidG5cIlxyXG4gICAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJEZWxldGVcIlxyXG4gICAgICAgICAgICAgIG9uOmNsaWNrPXsoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkZWxldGVGaWx0ZXIoZmlsdGVyKTtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRGaWx0ZXJzID0gZ2V0RmlsdGVycygpO1xyXG4gICAgICAgICAgICAgIH19PlxyXG4gICAgICAgICAgICAgIERlbGV0ZVxyXG4gICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIHs6ZWxzZX1cclxuICAgICAgPGRpdiBjbGFzcz1cImNvbHVtbiBjb2wtMTJcIj5cclxuICAgICAgICA8cCBjbGFzcz1cImxhYmVsXCI+WW91IGRvbid0IGhhdmUgYW55IGZpbHRlciB5ZXQuPC9wPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIHsvZWFjaH1cclxuICA8L2Rpdj5cclxuPC9kaXY+XHJcbjxoNT5OZXcgRmlsdGVyPC9oNT5cclxuPGZvcm0tZ3JvdXA+XHJcbiAgPGxhYmVsIGNsYXNzPVwiZm9ybS1yYWRpb1wiPlxyXG4gICAgPGlucHV0XHJcbiAgICAgIHR5cGU9XCJyYWRpb1wiXHJcbiAgICAgIG5hbWU9XCJmaWx0ZXItYWN0aW9uXCJcclxuICAgICAgYmluZDpncm91cD17ZmlsdGVyQWN0aW9ufVxyXG4gICAgICB2YWx1ZT1cImhpZGVcIiAvPlxyXG4gICAgPGkgY2xhc3M9XCJmb3JtLWljb25cIiAvPlxyXG4gICAgSGlkZSBNZXNzYWdlXHJcbiAgPC9sYWJlbD5cclxuICA8bGFiZWwgY2xhc3M9XCJmb3JtLXJhZGlvXCI+XHJcbiAgICA8aW5wdXRcclxuICAgICAgdHlwZT1cInJhZGlvXCJcclxuICAgICAgbmFtZT1cImZpbHRlci1hY3Rpb25cIlxyXG4gICAgICBiaW5kOmdyb3VwPXtmaWx0ZXJBY3Rpb259XHJcbiAgICAgIHZhbHVlPVwiYmx1clwiIC8+XHJcbiAgICA8aSBjbGFzcz1cImZvcm0taWNvblwiIC8+XHJcbiAgICBCbHVyIEltYWdlc1xyXG4gIDwvbGFiZWw+XHJcbiAgPGxhYmVsIGNsYXNzPVwiZm9ybS1sYWJlbFwiIGZvcj1cInJlbW90ZVwiPkNoYW5uZWw8L2xhYmVsPlxyXG4gIDxpbnB1dFxyXG4gICAgY2xhc3M9XCJmb3JtLWlucHV0XCJcclxuICAgIHR5cGU9XCJ0ZXh0XCJcclxuICAgIHBsYWNlaG9sZGVyPVwiQ2hhbm5lbFwiXHJcbiAgICBiaW5kOnZhbHVlPXtmaWx0ZXJDaGFubmVsfSAvPlxyXG4gIDxsYWJlbCBjbGFzcz1cImZvcm0tbGFiZWxcIiBmb3I9XCJyZW1vdGVcIj5GZWVkPC9sYWJlbD5cclxuICA8aW5wdXRcclxuICAgIGNsYXNzPVwiZm9ybS1pbnB1dFwiXHJcbiAgICB0eXBlPVwidGV4dFwiXHJcbiAgICBwbGFjZWhvbGRlcj1cIkZlZWRcIlxyXG4gICAgYmluZDp2YWx1ZT17ZmlsdGVyRmVlZH0gLz5cclxuICA8bGFiZWwgY2xhc3M9XCJmb3JtLWxhYmVsXCIgZm9yPVwicmVtb3RlXCI+S2V5d29yZHM8L2xhYmVsPlxyXG4gIDxpbnB1dFxyXG4gICAgY2xhc3M9XCJmb3JtLWlucHV0XCJcclxuICAgIHR5cGU9XCJ0ZXh0XCJcclxuICAgIHBsYWNlaG9sZGVyPVwiS2V5d29yZHMgc2VwYXJhdGVkIGJ5IGNvbW1hc1wiXHJcbiAgICBiaW5kOnZhbHVlPXtmaWx0ZXJLZXl3b3Jkc30gLz5cclxuICA8bGFiZWwgY2xhc3M9XCJmb3JtLWxhYmVsXCIgZm9yPVwicmVtb3RlXCI+RXhwaXJhdGlvbiBEYXRlPC9sYWJlbD5cclxuICA8aW5wdXRcclxuICAgIGNsYXNzPVwiZm9ybS1pbnB1dFwiXHJcbiAgICB0eXBlPVwiZGF0ZVwiXHJcbiAgICBwbGFjZWhvbGRlcj1cIldoZW4gc2hvdWxkIHRoaXMgZmlsdGVyIGV4cGlyeVwiXHJcbiAgICBiaW5kOnZhbHVlPXtmaWx0ZXJFeHBpcnl9IC8+XHJcbjwvZm9ybS1ncm91cD5cclxuPGJyIC8+XHJcbjxidXR0b24gY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIiBvbjpjbGljaz17YWRkTmV3RmlsdGVyfT5BZGQgRmlsdGVyPC9idXR0b24+XHJcbjxiciAvPlxyXG48YnIgLz5cclxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQXNIRSxPQUFPLGVBQUMsQ0FBQyxBQUNQLE1BQU0sQ0FBRSxLQUFLLENBQ2IsYUFBYSxDQUFFLE1BQU0sQ0FDckIsUUFBUSxDQUFFLE1BQU0sQUFDbEIsQ0FBQyxBQUVELEtBQUssZUFBQyxDQUFDLEFBQ0wsU0FBUyxDQUFFLElBQUksQ0FDZixRQUFRLENBQUUsTUFBTSxBQUNsQixDQUFDIn0= */";
    	append(document.head, style);
    }

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.filter = list[i];
    	return child_ctx;
    }

    // (399:4) {:else}
    function create_else_block$a(ctx) {
    	var div, p;

    	return {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			p.textContent = "You don't have any filter yet.";
    			p.className = "label";
    			add_location(p, file$j, 400, 8, 11625);
    			div.className = "column col-12";
    			add_location(div, file$j, 399, 6, 11588);
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			append(div, p);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}
    		}
    	};
    }

    // (370:14) {#if filter.feed}
    function create_if_block_3$4(ctx) {
    	var li, t0, a, t1_value = ctx.filter.feed, t1, a_href_value;

    	return {
    		c: function create() {
    			li = element("li");
    			t0 = text("From ");
    			a = element("a");
    			t1 = text(t1_value);
    			a.href = a_href_value = "?feed=" + ctx.filter.feed + "#/profile";
    			a.target = "_blank";
    			a.className = "feed svelte-1e0jkdi";
    			add_location(a, file$j, 370, 25, 10587);
    			add_location(li, file$j, 370, 16, 10578);
    		},

    		m: function mount(target, anchor) {
    			insert(target, li, anchor);
    			append(li, t0);
    			append(li, a);
    			append(a, t1);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.currentFilters) && t1_value !== (t1_value = ctx.filter.feed)) {
    				set_data(t1, t1_value);
    			}

    			if ((changed.currentFilters) && a_href_value !== (a_href_value = "?feed=" + ctx.filter.feed + "#/profile")) {
    				a.href = a_href_value;
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(li);
    			}
    		}
    	};
    }

    // (373:14) {#if filter.channel}
    function create_if_block_2$5(ctx) {
    	var li, t0, a, t1, t2_value = ctx.filter.channel, t2, a_href_value;

    	return {
    		c: function create() {
    			li = element("li");
    			t0 = text("On channel ");
    			a = element("a");
    			t1 = text("#");
    			t2 = text(t2_value);
    			a.href = a_href_value = "?channel=" + ctx.filter.feed + "#/channel";
    			a.target = "_blank";
    			a.className = "feed svelte-1e0jkdi";
    			add_location(a, file$j, 373, 31, 10767);
    			add_location(li, file$j, 373, 16, 10752);
    		},

    		m: function mount(target, anchor) {
    			insert(target, li, anchor);
    			append(li, t0);
    			append(li, a);
    			append(a, t1);
    			append(a, t2);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.currentFilters) && t2_value !== (t2_value = ctx.filter.channel)) {
    				set_data(t2, t2_value);
    			}

    			if ((changed.currentFilters) && a_href_value !== (a_href_value = "?channel=" + ctx.filter.feed + "#/channel")) {
    				a.href = a_href_value;
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(li);
    			}
    		}
    	};
    }

    // (376:14) {#if filter.keywords.length > 0}
    function create_if_block_1$9(ctx) {
    	var i, li, t0, t1_value = ctx.filter.keywords.join(', '), t1;

    	return {
    		c: function create() {
    			i = element("i");
    			li = element("li");
    			t0 = text("Containing: ");
    			t1 = text(t1_value);
    			add_location(li, file$j, 377, 18, 10974);
    			add_location(i, file$j, 376, 16, 10951);
    		},

    		m: function mount(target, anchor) {
    			insert(target, i, anchor);
    			append(i, li);
    			append(li, t0);
    			append(li, t1);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.currentFilters) && t1_value !== (t1_value = ctx.filter.keywords.join(', '))) {
    				set_data(t1, t1_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(i);
    			}
    		}
    	};
    }

    // (381:14) {#if filter.expires}
    function create_if_block$c(ctx) {
    	var li, t0, t1_value = ctx.filter.expires, t1;

    	return {
    		c: function create() {
    			li = element("li");
    			t0 = text("Expiring in ");
    			t1 = text(t1_value);
    			add_location(li, file$j, 381, 16, 11120);
    		},

    		m: function mount(target, anchor) {
    			insert(target, li, anchor);
    			append(li, t0);
    			append(li, t1);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.currentFilters) && t1_value !== (t1_value = ctx.filter.expires)) {
    				set_data(t1, t1_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(li);
    			}
    		}
    	};
    }

    // (362:4) {#each currentFilters as filter}
    function create_each_block$5(ctx) {
    	var div5, div4, div1, div0, t0_value = ctx.filter.action, t0, t1, div2, ul, t2, t3, t4, t5, div3, button, dispose;

    	var if_block0 = (ctx.filter.feed) && create_if_block_3$4(ctx);

    	var if_block1 = (ctx.filter.channel) && create_if_block_2$5(ctx);

    	var if_block2 = (ctx.filter.keywords.length > 0) && create_if_block_1$9(ctx);

    	var if_block3 = (ctx.filter.expires) && create_if_block$c(ctx);

    	function click_handler() {
    		return ctx.click_handler(ctx);
    	}

    	return {
    		c: function create() {
    			div5 = element("div");
    			div4 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div2 = element("div");
    			ul = element("ul");
    			if (if_block0) if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			if (if_block2) if_block2.c();
    			t4 = space();
    			if (if_block3) if_block3.c();
    			t5 = space();
    			div3 = element("div");
    			button = element("button");
    			button.textContent = "Delete";
    			div0.className = "card-title h5";
    			add_location(div0, file$j, 365, 12, 10408);
    			div1.className = "card-header";
    			add_location(div1, file$j, 364, 10, 10369);
    			add_location(ul, file$j, 368, 12, 10523);
    			div2.className = "card-body";
    			add_location(div2, file$j, 367, 10, 10486);
    			button.className = "btn";
    			attr(button, "aria-label", "Delete");
    			add_location(button, file$j, 386, 12, 11266);
    			div3.className = "card-footer";
    			add_location(div3, file$j, 385, 10, 11227);
    			div4.className = "card filter svelte-1e0jkdi";
    			add_location(div4, file$j, 363, 8, 10332);
    			div5.className = "column col-6";
    			add_location(div5, file$j, 362, 6, 10296);
    			dispose = listen(button, "click", click_handler);
    		},

    		m: function mount(target, anchor) {
    			insert(target, div5, anchor);
    			append(div5, div4);
    			append(div4, div1);
    			append(div1, div0);
    			append(div0, t0);
    			append(div4, t1);
    			append(div4, div2);
    			append(div2, ul);
    			if (if_block0) if_block0.m(ul, null);
    			append(ul, t2);
    			if (if_block1) if_block1.m(ul, null);
    			append(ul, t3);
    			if (if_block2) if_block2.m(ul, null);
    			append(ul, t4);
    			if (if_block3) if_block3.m(ul, null);
    			append(div4, t5);
    			append(div4, div3);
    			append(div3, button);
    		},

    		p: function update(changed, new_ctx) {
    			ctx = new_ctx;
    			if ((changed.currentFilters) && t0_value !== (t0_value = ctx.filter.action)) {
    				set_data(t0, t0_value);
    			}

    			if (ctx.filter.feed) {
    				if (if_block0) {
    					if_block0.p(changed, ctx);
    				} else {
    					if_block0 = create_if_block_3$4(ctx);
    					if_block0.c();
    					if_block0.m(ul, t2);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (ctx.filter.channel) {
    				if (if_block1) {
    					if_block1.p(changed, ctx);
    				} else {
    					if_block1 = create_if_block_2$5(ctx);
    					if_block1.c();
    					if_block1.m(ul, t3);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (ctx.filter.keywords.length > 0) {
    				if (if_block2) {
    					if_block2.p(changed, ctx);
    				} else {
    					if_block2 = create_if_block_1$9(ctx);
    					if_block2.c();
    					if_block2.m(ul, t4);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (ctx.filter.expires) {
    				if (if_block3) {
    					if_block3.p(changed, ctx);
    				} else {
    					if_block3 = create_if_block$c(ctx);
    					if_block3.c();
    					if_block3.m(ul, null);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div5);
    			}

    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			dispose();
    		}
    	};
    }

    function create_fragment$j(ctx) {
    	var h1, t1, p0, t2, i0, t4, t5, p1, b0, t6, i1, t8, a0, t10, t11, h40, t13, form0, label0, t14, i2, t16, i3, t18, code, t20, t21, input0, t22, label1, t24, input1, t25, label2, t27, textarea, t28, br0, t29, button0, t31, p2, t33, h41, t35, form1, label3, t37, input2, t38, br1, t39, span, t40, a1, t41, i4, t43, label4, input3, t44, i5, t45, b1, t47, t48, label5, input4, t49, i6, t50, b2, t52, t53, label6, input5, t54, i7, t55, b3, t57, t58, label7, input6, t59, i8, t60, b4, t62, t63, label8, input7, t64, i9, t65, b5, t67, t68, label9, input8, t69, i10, t70, b6, t72, t73, label10, input9, t74, i11, t75, b7, t77, t78, label11, input10, t79, i12, t80, b8, t82, t83, div0, t84, label12, input11, t85, i13, t86, b9, t88, t89, br2, t90, label13, t92, label14, input12, t93, i14, t94, t95, label15, input13, t96, i15, t97, t98, h42, t100, p3, t102, h50, t104, p4, t105, a2, t107, t108, div2, div1, t109, h51, t111, form_group, label16, input14, t112, i16, t113, t114, label17, input15, t115, i17, t116, t117, label18, t119, input16, t120, label19, t122, input17, t123, label20, t125, input18, t126, label21, t128, input19, t129, br3, t130, button1, t132, br4, t133, br5, dispose;

    	var each_value = ctx.currentFilters;

    	var each_blocks = [];

    	for (var i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	var each_1_else = null;

    	if (!each_value.length) {
    		each_1_else = create_else_block$a(ctx);
    		each_1_else.c();
    	}

    	return {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Settings";
    			t1 = space();
    			p0 = element("p");
    			t2 = text("Settings changes are saved as you make them except for identity and connection\r\n  changes, those require a full page reload and thus you need to press a save\r\n  button. The reason behind this is that Patchfox needs to disconnect and\r\n  reconnect to the\r\n  ");
    			i0 = element("i");
    			i0.textContent = "ssb-server";
    			t4 = text("\r\n  using the new info.");
    			t5 = space();
    			p1 = element("p");
    			b0 = element("b");
    			t6 = text("You can't use Patchfox until you fill your\r\n    ");
    			i1 = element("i");
    			i1.textContent = "Connection & Identity";
    			t8 = text("\r\n    information.\r\n    ");
    			a0 = element("a");
    			a0.textContent = "If you want more help regarding connection and configuration click here";
    			t10 = text("\r\n    .");
    			t11 = space();
    			h40 = element("h4");
    			h40.textContent = "Connection & Identity";
    			t13 = space();
    			form0 = element("form");
    			label0 = element("label");
    			t14 = text("Patchfox can infer the values for both\r\n    ");
    			i2 = element("i");
    			i2.textContent = "remote";
    			t16 = text("\r\n    and\r\n    ");
    			i3 = element("i");
    			i3.textContent = "secret";
    			t18 = text("\r\n    from your\r\n    ");
    			code = element("code");
    			code.textContent = "~/.ssb/secret";
    			t20 = text("\r\n    file. You can use the button below to browse for it.");
    			t21 = space();
    			input0 = element("input");
    			t22 = space();
    			label1 = element("label");
    			label1.textContent = "Remote";
    			t24 = space();
    			input1 = element("input");
    			t25 = space();
    			label2 = element("label");
    			label2.textContent = "Secret";
    			t27 = space();
    			textarea = element("textarea");
    			t28 = space();
    			br0 = element("br");
    			t29 = space();
    			button0 = element("button");
    			button0.textContent = "Save Identity & Remote";
    			t31 = space();
    			p2 = element("p");
    			p2.textContent = "Saving identity and remote will cause a full page refresh.";
    			t33 = space();
    			h41 = element("h4");
    			h41.textContent = "Vieweing Experience";
    			t35 = space();
    			form1 = element("form");
    			label3 = element("label");
    			label3.textContent = "Messages per page";
    			t37 = space();
    			input2 = element("input");
    			t38 = space();
    			br1 = element("br");
    			t39 = space();
    			span = element("span");
    			t40 = text("Which message types you want to see?\r\n    ");
    			a1 = element("a");
    			t41 = text("Click here for more information about\r\n      ");
    			i4 = element("i");
    			i4.textContent = "Message Types";
    			t43 = space();
    			label4 = element("label");
    			input3 = element("input");
    			t44 = space();
    			i5 = element("i");
    			t45 = space();
    			b1 = element("b");
    			b1.textContent = "About";
    			t47 = text("\r\n    (aka people setting avatars and descriptions; gatherings)");
    			t48 = space();
    			label5 = element("label");
    			input4 = element("input");
    			t49 = space();
    			i6 = element("i");
    			t50 = space();
    			b2 = element("b");
    			b2.textContent = "Blog";
    			t52 = text("\r\n    (Longform text posts)");
    			t53 = space();
    			label6 = element("label");
    			input5 = element("input");
    			t54 = space();
    			i7 = element("i");
    			t55 = space();
    			b3 = element("b");
    			b3.textContent = "Channel";
    			t57 = text("\r\n    (People subscribing to channels)");
    			t58 = space();
    			label7 = element("label");
    			input6 = element("input");
    			t59 = space();
    			i8 = element("i");
    			t60 = space();
    			b4 = element("b");
    			b4.textContent = "Contact";
    			t62 = text("\r\n    (People following each other)");
    			t63 = space();
    			label8 = element("label");
    			input7 = element("input");
    			t64 = space();
    			i9 = element("i");
    			t65 = space();
    			b5 = element("b");
    			b5.textContent = "Posts";
    			t67 = text("\r\n    (Common content post, leave this on or it is not that fun)");
    			t68 = space();
    			label9 = element("label");
    			input8 = element("input");
    			t69 = space();
    			i10 = element("i");
    			t70 = space();
    			b6 = element("b");
    			b6.textContent = "Pub";
    			t72 = text("\r\n    (Pub servers announcements)");
    			t73 = space();
    			label10 = element("label");
    			input9 = element("input");
    			t74 = space();
    			i11 = element("i");
    			t75 = space();
    			b7 = element("b");
    			b7.textContent = "Private";
    			t77 = text("\r\n    (Private messages; You won't be able to read them, but you'll see their\r\n    encrypted content passing by)");
    			t78 = space();
    			label11 = element("label");
    			input10 = element("input");
    			t79 = space();
    			i12 = element("i");
    			t80 = space();
    			b8 = element("b");
    			b8.textContent = "Vote";
    			t82 = text("\r\n    (People liking/digging stuff)");
    			t83 = space();
    			div0 = element("div");
    			t84 = space();
    			label12 = element("label");
    			input11 = element("input");
    			t85 = space();
    			i13 = element("i");
    			t86 = space();
    			b9 = element("b");
    			b9.textContent = "Unknown";
    			t88 = text("\r\n    (Show messages Patchfox doesn't understand as their raw content)");
    			t89 = space();
    			br2 = element("br");
    			t90 = space();
    			label13 = element("label");
    			label13.textContent = "Feed column size. There is research that says that a short column size makes\r\n    for a more pleasant reading experience, still some users prefer to use the\r\n    full screen space. Your choice is between reading through long text lines or\r\n    short ones.";
    			t92 = space();
    			label14 = element("label");
    			input12 = element("input");
    			t93 = space();
    			i14 = element("i");
    			t94 = text("\r\n    Short column");
    			t95 = space();
    			label15 = element("label");
    			input13 = element("input");
    			t96 = space();
    			i15 = element("i");
    			t97 = text("\r\n    Long column");
    			t98 = space();
    			h42 = element("h4");
    			h42.textContent = "Abuse Prevention";
    			t100 = space();
    			p3 = element("p");
    			p3.textContent = "Use the features from this section to tailor your Patchfox experience to suit\r\n  your needs.";
    			t102 = space();
    			h50 = element("h5");
    			h50.textContent = "Filters";
    			t104 = space();
    			p4 = element("p");
    			t105 = text("Use filters to hide messages and blur images. Use any combination of channel,\r\n  feeds and keywords (separated by commas) to create your triggers and make SSB\r\n  the platform you want. Be aware that these filters are saved to your browser,\r\n  they are not shared on the feed, they don't affect gossiping, they only affect\r\n  the displaying of messages and images in Patchfox itself. If you create a\r\n  filter and open a different client, they won't be working there. If you want\r\n  to learn more about\r\n  ");
    			a2 = element("a");
    			a2.textContent = "filters, click here to go to the documentation.";
    			t107 = text("\r\n  You can create as many filters as you want.");
    			t108 = space();
    			div2 = element("div");
    			div1 = element("div");

    			for (var i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t109 = space();
    			h51 = element("h5");
    			h51.textContent = "New Filter";
    			t111 = space();
    			form_group = element("form-group");
    			label16 = element("label");
    			input14 = element("input");
    			t112 = space();
    			i16 = element("i");
    			t113 = text("\r\n    Hide Message");
    			t114 = space();
    			label17 = element("label");
    			input15 = element("input");
    			t115 = space();
    			i17 = element("i");
    			t116 = text("\r\n    Blur Images");
    			t117 = space();
    			label18 = element("label");
    			label18.textContent = "Channel";
    			t119 = space();
    			input16 = element("input");
    			t120 = space();
    			label19 = element("label");
    			label19.textContent = "Feed";
    			t122 = space();
    			input17 = element("input");
    			t123 = space();
    			label20 = element("label");
    			label20.textContent = "Keywords";
    			t125 = space();
    			input18 = element("input");
    			t126 = space();
    			label21 = element("label");
    			label21.textContent = "Expiration Date";
    			t128 = space();
    			input19 = element("input");
    			t129 = space();
    			br3 = element("br");
    			t130 = space();
    			button1 = element("button");
    			button1.textContent = "Add Filter";
    			t132 = space();
    			br4 = element("br");
    			t133 = space();
    			br5 = element("br");
    			add_location(h1, file$j, 130, 0, 3646);
    			add_location(i0, file$j, 136, 2, 3928);
    			add_location(p0, file$j, 131, 0, 3665);
    			add_location(i1, file$j, 142, 4, 4040);
    			a0.href = "/docs/index.html#/troubleshooting/no-configuration";
    			a0.target = "_blank";
    			add_location(a0, file$j, 144, 4, 4092);
    			add_location(b0, file$j, 140, 2, 3983);
    			add_location(p1, file$j, 139, 0, 3976);
    			add_location(h40, file$j, 153, 0, 4297);
    			add_location(i2, file$j, 158, 4, 4454);
    			add_location(i3, file$j, 160, 4, 4482);
    			add_location(code, file$j, 162, 4, 4516);
    			label0.className = "form-label";
    			label0.htmlFor = "secret-file";
    			add_location(label0, file$j, 156, 2, 4360);
    			attr(input0, "type", "file");
    			input0.className = "form-input";
    			input0.id = "secret-file";
    			add_location(input0, file$j, 165, 2, 4616);
    			label1.className = "form-label";
    			label1.htmlFor = "remote";
    			add_location(label1, file$j, 170, 2, 4722);
    			input1.className = "form-input";
    			attr(input1, "type", "text");
    			input1.id = "remote";
    			input1.placeholder = "remote";
    			add_location(input1, file$j, 171, 2, 4779);
    			label2.className = "form-label";
    			label2.htmlFor = "secret";
    			add_location(label2, file$j, 178, 2, 4903);
    			textarea.className = "form-input";
    			textarea.id = "secret";
    			textarea.placeholder = "Your secret";
    			textarea.rows = "8";
    			add_location(textarea, file$j, 179, 2, 4960);
    			add_location(br0, file$j, 185, 2, 5085);
    			button0.className = "btn btn-primary float-right";
    			add_location(button0, file$j, 186, 2, 5095);
    			add_location(p2, file$j, 189, 2, 5213);
    			form0.className = "form-group";
    			add_location(form0, file$j, 155, 0, 4331);
    			add_location(h41, file$j, 192, 0, 5291);
    			label3.className = "form-label";
    			label3.htmlFor = "limit";
    			add_location(label3, file$j, 194, 2, 5350);
    			input2.className = "form-input";
    			attr(input2, "type", "number");
    			add_location(input2, file$j, 195, 2, 5417);
    			add_location(br1, file$j, 201, 2, 5546);
    			add_location(i4, file$j, 206, 6, 5722);
    			a1.target = "_blank";
    			a1.href = "/docs/index.html#/message_types/";
    			add_location(a1, file$j, 204, 4, 5610);
    			add_location(span, file$j, 202, 2, 5556);
    			attr(input3, "type", "checkbox");
    			add_location(input3, file$j, 210, 4, 5800);
    			i5.className = "form-icon";
    			add_location(i5, file$j, 216, 4, 5960);
    			add_location(b1, file$j, 217, 4, 5989);
    			label4.className = "form-switch";
    			add_location(label4, file$j, 209, 2, 5767);
    			attr(input4, "type", "checkbox");
    			add_location(input4, file$j, 221, 4, 6113);
    			i6.className = "form-icon";
    			add_location(i6, file$j, 227, 4, 6270);
    			add_location(b2, file$j, 228, 4, 6299);
    			label5.className = "form-switch";
    			add_location(label5, file$j, 220, 2, 6080);
    			attr(input5, "type", "checkbox");
    			add_location(input5, file$j, 232, 4, 6386);
    			i7.className = "form-icon";
    			add_location(i7, file$j, 238, 4, 6552);
    			add_location(b3, file$j, 239, 4, 6581);
    			label6.className = "form-switch";
    			add_location(label6, file$j, 231, 2, 6353);
    			attr(input6, "type", "checkbox");
    			add_location(input6, file$j, 243, 4, 6682);
    			i8.className = "form-icon";
    			add_location(i8, file$j, 249, 4, 6848);
    			add_location(b4, file$j, 250, 4, 6877);
    			label7.className = "form-switch";
    			add_location(label7, file$j, 242, 2, 6649);
    			attr(input7, "type", "checkbox");
    			add_location(input7, file$j, 254, 4, 6975);
    			i9.className = "form-icon";
    			add_location(i9, file$j, 260, 4, 7132);
    			add_location(b5, file$j, 261, 4, 7161);
    			label8.className = "form-switch";
    			add_location(label8, file$j, 253, 2, 6942);
    			attr(input8, "type", "checkbox");
    			add_location(input8, file$j, 265, 4, 7286);
    			i10.className = "form-icon";
    			add_location(i10, file$j, 271, 4, 7440);
    			add_location(b6, file$j, 272, 4, 7469);
    			label9.className = "form-switch";
    			add_location(label9, file$j, 264, 2, 7253);
    			attr(input9, "type", "checkbox");
    			add_location(input9, file$j, 277, 4, 7563);
    			i11.className = "form-icon";
    			add_location(i11, file$j, 283, 4, 7729);
    			add_location(b7, file$j, 284, 4, 7758);
    			label10.className = "form-switch";
    			add_location(label10, file$j, 276, 2, 7530);
    			attr(input10, "type", "checkbox");
    			add_location(input10, file$j, 290, 4, 7935);
    			i12.className = "form-icon";
    			add_location(i12, file$j, 296, 4, 8092);
    			add_location(b8, file$j, 297, 4, 8121);
    			label11.className = "form-switch";
    			add_location(label11, file$j, 289, 2, 7902);
    			div0.className = "divider";
    			add_location(div0, file$j, 300, 2, 8183);
    			attr(input11, "type", "checkbox");
    			add_location(input11, file$j, 302, 4, 8243);
    			i13.className = "form-icon";
    			add_location(i13, file$j, 308, 4, 8409);
    			add_location(b9, file$j, 309, 4, 8438);
    			label12.className = "form-switch";
    			add_location(label12, file$j, 301, 2, 8210);
    			add_location(br2, file$j, 312, 2, 8538);
    			label13.className = "form-label";
    			add_location(label13, file$j, 313, 2, 8548);
    			ctx.$$binding_groups[1].push(input12);
    			attr(input12, "type", "radio");
    			input12.name = "column-size";
    			input12.__value = "short";
    			input12.value = input12.__value;
    			add_location(input12, file$j, 320, 4, 8883);
    			i14.className = "form-icon";
    			add_location(i14, file$j, 326, 4, 9055);
    			label14.className = "form-radio";
    			add_location(label14, file$j, 319, 2, 8851);
    			ctx.$$binding_groups[1].push(input13);
    			attr(input13, "type", "radio");
    			input13.name = "column-size";
    			input13.__value = "long";
    			input13.value = input13.__value;
    			add_location(input13, file$j, 330, 4, 9144);
    			i15.className = "form-icon";
    			add_location(i15, file$j, 336, 4, 9315);
    			label15.className = "form-radio";
    			add_location(label15, file$j, 329, 2, 9112);
    			form1.className = "form-group";
    			add_location(form1, file$j, 193, 0, 5321);
    			add_location(h42, file$j, 340, 0, 9378);
    			add_location(p3, file$j, 341, 0, 9405);
    			add_location(h50, file$j, 345, 0, 9512);
    			a2.href = "/docs/index.html#/features/filter";
    			add_location(a2, file$j, 354, 2, 10042);
    			add_location(p4, file$j, 346, 0, 9530);
    			div1.className = "columns";
    			add_location(div1, file$j, 360, 2, 10229);
    			div2.className = "container";
    			add_location(div2, file$j, 359, 0, 10202);
    			add_location(h51, file$j, 405, 0, 11723);
    			ctx.$$binding_groups[0].push(input14);
    			attr(input14, "type", "radio");
    			input14.name = "filter-action";
    			input14.__value = "hide";
    			input14.value = input14.__value;
    			add_location(input14, file$j, 408, 4, 11792);
    			i16.className = "form-icon";
    			add_location(i16, file$j, 413, 4, 11908);
    			label16.className = "form-radio";
    			add_location(label16, file$j, 407, 2, 11760);
    			ctx.$$binding_groups[0].push(input15);
    			attr(input15, "type", "radio");
    			input15.name = "filter-action";
    			input15.__value = "blur";
    			input15.value = input15.__value;
    			add_location(input15, file$j, 417, 4, 11997);
    			i17.className = "form-icon";
    			add_location(i17, file$j, 422, 4, 12113);
    			label17.className = "form-radio";
    			add_location(label17, file$j, 416, 2, 11965);
    			label18.className = "form-label";
    			label18.htmlFor = "remote";
    			add_location(label18, file$j, 425, 2, 12169);
    			input16.className = "form-input";
    			attr(input16, "type", "text");
    			input16.placeholder = "Channel";
    			add_location(input16, file$j, 426, 2, 12227);
    			label19.className = "form-label";
    			label19.htmlFor = "remote";
    			add_location(label19, file$j, 431, 2, 12340);
    			input17.className = "form-input";
    			attr(input17, "type", "text");
    			input17.placeholder = "Feed";
    			add_location(input17, file$j, 432, 2, 12395);
    			label20.className = "form-label";
    			label20.htmlFor = "remote";
    			add_location(label20, file$j, 437, 2, 12502);
    			input18.className = "form-input";
    			attr(input18, "type", "text");
    			input18.placeholder = "Keywords separated by commas";
    			add_location(input18, file$j, 438, 2, 12561);
    			label21.className = "form-label";
    			label21.htmlFor = "remote";
    			add_location(label21, file$j, 443, 2, 12696);
    			input19.className = "form-input";
    			attr(input19, "type", "date");
    			input19.placeholder = "When should this filter expiry";
    			add_location(input19, file$j, 444, 2, 12762);
    			add_location(form_group, file$j, 406, 0, 11744);
    			add_location(br3, file$j, 450, 0, 12910);
    			button1.className = "btn btn-primary";
    			add_location(button1, file$j, 451, 0, 12918);
    			add_location(br4, file$j, 452, 0, 12995);
    			add_location(br5, file$j, 453, 0, 13003);

    			dispose = [
    				listen(input0, "change", ctx.selectedFile),
    				listen(input1, "input", ctx.input1_input_handler),
    				listen(textarea, "input", ctx.textarea_input_handler),
    				listen(button0, "click", ctx.saveConfiguration),
    				listen(input2, "input", ctx.input2_input_handler),
    				listen(input2, "change", ctx.change_handler),
    				listen(input3, "change", ctx.input3_change_handler),
    				listen(input3, "change", ctx.change_handler_1),
    				listen(input4, "change", ctx.input4_change_handler),
    				listen(input4, "change", ctx.change_handler_2),
    				listen(input5, "change", ctx.input5_change_handler),
    				listen(input5, "change", ctx.change_handler_3),
    				listen(input6, "change", ctx.input6_change_handler),
    				listen(input6, "change", ctx.change_handler_4),
    				listen(input7, "change", ctx.input7_change_handler),
    				listen(input7, "change", ctx.change_handler_5),
    				listen(input8, "change", ctx.input8_change_handler),
    				listen(input8, "change", ctx.change_handler_6),
    				listen(input9, "change", ctx.input9_change_handler),
    				listen(input9, "change", ctx.change_handler_7),
    				listen(input10, "change", ctx.input10_change_handler),
    				listen(input10, "change", ctx.change_handler_8),
    				listen(input11, "change", ctx.input11_change_handler),
    				listen(input11, "change", ctx.change_handler_9),
    				listen(input12, "change", ctx.input12_change_handler),
    				listen(input12, "change", ctx.change_handler_10),
    				listen(input13, "change", ctx.input13_change_handler),
    				listen(input13, "change", ctx.change_handler_11),
    				listen(input14, "change", ctx.input14_change_handler),
    				listen(input15, "change", ctx.input15_change_handler),
    				listen(input16, "input", ctx.input16_input_handler),
    				listen(input17, "input", ctx.input17_input_handler),
    				listen(input18, "input", ctx.input18_input_handler),
    				listen(input19, "input", ctx.input19_input_handler),
    				listen(button1, "click", ctx.addNewFilter)
    			];
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, h1, anchor);
    			insert(target, t1, anchor);
    			insert(target, p0, anchor);
    			append(p0, t2);
    			append(p0, i0);
    			append(p0, t4);
    			insert(target, t5, anchor);
    			insert(target, p1, anchor);
    			append(p1, b0);
    			append(b0, t6);
    			append(b0, i1);
    			append(b0, t8);
    			append(b0, a0);
    			append(b0, t10);
    			insert(target, t11, anchor);
    			insert(target, h40, anchor);
    			insert(target, t13, anchor);
    			insert(target, form0, anchor);
    			append(form0, label0);
    			append(label0, t14);
    			append(label0, i2);
    			append(label0, t16);
    			append(label0, i3);
    			append(label0, t18);
    			append(label0, code);
    			append(label0, t20);
    			append(form0, t21);
    			append(form0, input0);
    			append(form0, t22);
    			append(form0, label1);
    			append(form0, t24);
    			append(form0, input1);

    			input1.value = ctx.remote;

    			append(form0, t25);
    			append(form0, label2);
    			append(form0, t27);
    			append(form0, textarea);

    			textarea.value = ctx.keys;

    			append(form0, t28);
    			append(form0, br0);
    			append(form0, t29);
    			append(form0, button0);
    			append(form0, t31);
    			append(form0, p2);
    			insert(target, t33, anchor);
    			insert(target, h41, anchor);
    			insert(target, t35, anchor);
    			insert(target, form1, anchor);
    			append(form1, label3);
    			append(form1, t37);
    			append(form1, input2);

    			input2.value = ctx.limit;

    			append(form1, t38);
    			append(form1, br1);
    			append(form1, t39);
    			append(form1, span);
    			append(span, t40);
    			append(span, a1);
    			append(a1, t41);
    			append(a1, i4);
    			append(form1, t43);
    			append(form1, label4);
    			append(label4, input3);

    			input3.checked = ctx.showTypeAbout;

    			append(label4, t44);
    			append(label4, i5);
    			append(label4, t45);
    			append(label4, b1);
    			append(label4, t47);
    			append(form1, t48);
    			append(form1, label5);
    			append(label5, input4);

    			input4.checked = ctx.showTypeBlog;

    			append(label5, t49);
    			append(label5, i6);
    			append(label5, t50);
    			append(label5, b2);
    			append(label5, t52);
    			append(form1, t53);
    			append(form1, label6);
    			append(label6, input5);

    			input5.checked = ctx.showTypeChannel;

    			append(label6, t54);
    			append(label6, i7);
    			append(label6, t55);
    			append(label6, b3);
    			append(label6, t57);
    			append(form1, t58);
    			append(form1, label7);
    			append(label7, input6);

    			input6.checked = ctx.showTypeContact;

    			append(label7, t59);
    			append(label7, i8);
    			append(label7, t60);
    			append(label7, b4);
    			append(label7, t62);
    			append(form1, t63);
    			append(form1, label8);
    			append(label8, input7);

    			input7.checked = ctx.showTypePost;

    			append(label8, t64);
    			append(label8, i9);
    			append(label8, t65);
    			append(label8, b5);
    			append(label8, t67);
    			append(form1, t68);
    			append(form1, label9);
    			append(label9, input8);

    			input8.checked = ctx.showTypePub;

    			append(label9, t69);
    			append(label9, i10);
    			append(label9, t70);
    			append(label9, b6);
    			append(label9, t72);
    			append(form1, t73);
    			append(form1, label10);
    			append(label10, input9);

    			input9.checked = ctx.showTypePrivate;

    			append(label10, t74);
    			append(label10, i11);
    			append(label10, t75);
    			append(label10, b7);
    			append(label10, t77);
    			append(form1, t78);
    			append(form1, label11);
    			append(label11, input10);

    			input10.checked = ctx.showTypeVote;

    			append(label11, t79);
    			append(label11, i12);
    			append(label11, t80);
    			append(label11, b8);
    			append(label11, t82);
    			append(form1, t83);
    			append(form1, div0);
    			append(form1, t84);
    			append(form1, label12);
    			append(label12, input11);

    			input11.checked = ctx.showTypeUnknown;

    			append(label12, t85);
    			append(label12, i13);
    			append(label12, t86);
    			append(label12, b9);
    			append(label12, t88);
    			append(form1, t89);
    			append(form1, br2);
    			append(form1, t90);
    			append(form1, label13);
    			append(form1, t92);
    			append(form1, label14);
    			append(label14, input12);

    			input12.checked = input12.__value === ctx.columnSize;

    			append(label14, t93);
    			append(label14, i14);
    			append(label14, t94);
    			append(form1, t95);
    			append(form1, label15);
    			append(label15, input13);

    			input13.checked = input13.__value === ctx.columnSize;

    			append(label15, t96);
    			append(label15, i15);
    			append(label15, t97);
    			insert(target, t98, anchor);
    			insert(target, h42, anchor);
    			insert(target, t100, anchor);
    			insert(target, p3, anchor);
    			insert(target, t102, anchor);
    			insert(target, h50, anchor);
    			insert(target, t104, anchor);
    			insert(target, p4, anchor);
    			append(p4, t105);
    			append(p4, a2);
    			append(p4, t107);
    			insert(target, t108, anchor);
    			insert(target, div2, anchor);
    			append(div2, div1);

    			for (var i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			if (each_1_else) {
    				each_1_else.m(div1, null);
    			}

    			insert(target, t109, anchor);
    			insert(target, h51, anchor);
    			insert(target, t111, anchor);
    			insert(target, form_group, anchor);
    			append(form_group, label16);
    			append(label16, input14);

    			input14.checked = input14.__value === ctx.filterAction;

    			append(label16, t112);
    			append(label16, i16);
    			append(label16, t113);
    			append(form_group, t114);
    			append(form_group, label17);
    			append(label17, input15);

    			input15.checked = input15.__value === ctx.filterAction;

    			append(label17, t115);
    			append(label17, i17);
    			append(label17, t116);
    			append(form_group, t117);
    			append(form_group, label18);
    			append(form_group, t119);
    			append(form_group, input16);

    			input16.value = ctx.filterChannel;

    			append(form_group, t120);
    			append(form_group, label19);
    			append(form_group, t122);
    			append(form_group, input17);

    			input17.value = ctx.filterFeed;

    			append(form_group, t123);
    			append(form_group, label20);
    			append(form_group, t125);
    			append(form_group, input18);

    			input18.value = ctx.filterKeywords;

    			append(form_group, t126);
    			append(form_group, label21);
    			append(form_group, t128);
    			append(form_group, input19);

    			input19.value = ctx.filterExpiry;

    			insert(target, t129, anchor);
    			insert(target, br3, anchor);
    			insert(target, t130, anchor);
    			insert(target, button1, anchor);
    			insert(target, t132, anchor);
    			insert(target, br4, anchor);
    			insert(target, t133, anchor);
    			insert(target, br5, anchor);
    		},

    		p: function update(changed, ctx) {
    			if (changed.remote && (input1.value !== ctx.remote)) input1.value = ctx.remote;
    			if (changed.keys) textarea.value = ctx.keys;
    			if (changed.limit) input2.value = ctx.limit;
    			if (changed.showTypeAbout) input3.checked = ctx.showTypeAbout;
    			if (changed.showTypeBlog) input4.checked = ctx.showTypeBlog;
    			if (changed.showTypeChannel) input5.checked = ctx.showTypeChannel;
    			if (changed.showTypeContact) input6.checked = ctx.showTypeContact;
    			if (changed.showTypePost) input7.checked = ctx.showTypePost;
    			if (changed.showTypePub) input8.checked = ctx.showTypePub;
    			if (changed.showTypePrivate) input9.checked = ctx.showTypePrivate;
    			if (changed.showTypeVote) input10.checked = ctx.showTypeVote;
    			if (changed.showTypeUnknown) input11.checked = ctx.showTypeUnknown;
    			if (changed.columnSize) input12.checked = input12.__value === ctx.columnSize;
    			if (changed.columnSize) input13.checked = input13.__value === ctx.columnSize;

    			if (changed.currentFilters) {
    				each_value = ctx.currentFilters;

    				for (var i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}
    				each_blocks.length = each_value.length;
    			}

    			if (each_value.length) {
    				if (each_1_else) {
    					each_1_else.d(1);
    					each_1_else = null;
    				}
    			} else if (!each_1_else) {
    				each_1_else = create_else_block$a(ctx);
    				each_1_else.c();
    				each_1_else.m(div1, null);
    			}

    			if (changed.filterAction) input14.checked = input14.__value === ctx.filterAction;
    			if (changed.filterAction) input15.checked = input15.__value === ctx.filterAction;
    			if (changed.filterChannel && (input16.value !== ctx.filterChannel)) input16.value = ctx.filterChannel;
    			if (changed.filterFeed && (input17.value !== ctx.filterFeed)) input17.value = ctx.filterFeed;
    			if (changed.filterKeywords && (input18.value !== ctx.filterKeywords)) input18.value = ctx.filterKeywords;
    			if (changed.filterExpiry) input19.value = ctx.filterExpiry;
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(h1);
    				detach(t1);
    				detach(p0);
    				detach(t5);
    				detach(p1);
    				detach(t11);
    				detach(h40);
    				detach(t13);
    				detach(form0);
    				detach(t33);
    				detach(h41);
    				detach(t35);
    				detach(form1);
    			}

    			ctx.$$binding_groups[1].splice(ctx.$$binding_groups[1].indexOf(input12), 1);
    			ctx.$$binding_groups[1].splice(ctx.$$binding_groups[1].indexOf(input13), 1);

    			if (detaching) {
    				detach(t98);
    				detach(h42);
    				detach(t100);
    				detach(p3);
    				detach(t102);
    				detach(h50);
    				detach(t104);
    				detach(p4);
    				detach(t108);
    				detach(div2);
    			}

    			destroy_each(each_blocks, detaching);

    			if (each_1_else) each_1_else.d();

    			if (detaching) {
    				detach(t109);
    				detach(h51);
    				detach(t111);
    				detach(form_group);
    			}

    			ctx.$$binding_groups[0].splice(ctx.$$binding_groups[0].indexOf(input14), 1);
    			ctx.$$binding_groups[0].splice(ctx.$$binding_groups[0].indexOf(input15), 1);

    			if (detaching) {
    				detach(t129);
    				detach(br3);
    				detach(t130);
    				detach(button1);
    				detach(t132);
    				detach(br4);
    				detach(t133);
    				detach(br5);
    			}

    			run_all(dispose);
    		}
    	};
    }

    function instance$i($$self, $$props, $$invalidate) {
    	
     
      let keys = {};
      let remote = "";
      let limit = getPref("limit", 10);
      let columnSize = getPref("columnSize", "short");

      document.title = "Patchfox - Settings";

      // message type filters
      let showTypeUnknown = getPref("showTypeUnknown", false);
      let showTypeAbout = getPref("showTypeAbout", true);
      let showTypeBlog = getPref("showTypeBlog", true);
      let showTypeChannel = getPref("showTypeChannel", true);
      let showTypeContact = getPref("showTypeContact", true);
      let showTypePost = getPref("showTypePost", true);
      let showTypePrivate = getPref("showTypePrivate", true);
      let showTypePub = getPref("showTypePub", true);
      let showTypeVote = getPref("showTypeVote", true);

      // Abuse Prevention - filters
      let currentFilters = getFilters();
      let filterFeed = "";
      let filterChannel = "";
      let filterKeywords = "";
      let filterExpiry = "";
      let filterAction = "";

      const saveConfiguration = ev => {
        setConnectionConfiguration({ remote, keys: JSON.parse(keys), manifest });
        navigate("/public");
        location.reload();
      };

      const selectedFile = ev => {
        const secretFile = ev.target.files[0];
        const reader = new FileReader();
        reader.onload = function(evt) {
          console.log(evt.target.result);
          const contents = evt.target.result;
          let secret = contents.split("\n").filter(function(line) {
            return line.indexOf("#") != 0;
          });
          secret = JSON.parse(secret.join("\n"));
          $$invalidate('remote', remote = `ws://localhost:8989~shs:${secret.id.slice(
        0,
        secret.id.indexOf("=") + 1
      )}`);
          updateUI({ keys: secret, remote });
        };
        reader.readAsText(secretFile);
      };

      const updateUI = savedData => {
        console.log("saved data from settings", savedData);
        $$invalidate('remote', remote = savedData.remote || "");
        if (savedData.keys) {
          $$invalidate('keys', keys = JSON.stringify(savedData.keys, null, 2));
        } else {
          $$invalidate('keys', keys = "");
        }
      };

      const onError = error => {
        console.error("error on settings", error);
      };

      const gettingStoredSettings = browser.storage.local
        .get()
        .then(updateUI, onError);

      const addNewFilter = () => {
        let keywords = filterKeywords
          .split(",")
          .map(v => v.trim())
          .filter(v => v.length !== 0);

        let filter = {};
        filter.action = filterAction.length !== 0 ? filterAction : false;
        filter.feed = filterFeed.length !== 0 ? filterFeed : false;
        filter.channel = filterChannel.length !== 0 ? filterChannel : false;
        filter.keywords = keywords;
        filter.expires = filterExpiry.length !== 0 ? filterExpiry : false;

        if (filter.channel && filter.channel.startsWith("#")) {
          filter.channel = filter.channel.slice(1);
        }

        if (
          filter.action &&
          (filter.feed || filter.channel || filter.keywords.length > 0)
        ) {
          addFilter(filter);

          $$invalidate('currentFilters', currentFilters = getFilters());

          console.dir("filters", currentFilters);

          $$invalidate('filterFeed', filterFeed = "");
          $$invalidate('filterChannel', filterChannel = "");
          $$invalidate('filterKeywords', filterKeywords = "");
          $$invalidate('filterExpiry', filterExpiry = "");
          $$invalidate('filterAction', filterAction = "");
        } else {
          alert("Fill at least filter action and one of feed, channel or keywords");
        }
      };

    	const $$binding_groups = [[], []];

    	function input1_input_handler() {
    		remote = this.value;
    		$$invalidate('remote', remote);
    	}

    	function textarea_input_handler() {
    		keys = this.value;
    		$$invalidate('keys', keys);
    	}

    	function input2_input_handler() {
    		limit = to_number(this.value);
    		$$invalidate('limit', limit);
    	}

    	function change_handler() {
    		return setPref('limit', limit);
    	}

    	function input3_change_handler() {
    		showTypeAbout = this.checked;
    		$$invalidate('showTypeAbout', showTypeAbout);
    	}

    	function change_handler_1(ev) {
    	        setPref('showTypeAbout', showTypeAbout);
    	      }

    	function input4_change_handler() {
    		showTypeBlog = this.checked;
    		$$invalidate('showTypeBlog', showTypeBlog);
    	}

    	function change_handler_2(ev) {
    	        setPref('showTypeBlog', showTypeBlog);
    	      }

    	function input5_change_handler() {
    		showTypeChannel = this.checked;
    		$$invalidate('showTypeChannel', showTypeChannel);
    	}

    	function change_handler_3(ev) {
    	        setPref('showTypeChannel', showTypeChannel);
    	      }

    	function input6_change_handler() {
    		showTypeContact = this.checked;
    		$$invalidate('showTypeContact', showTypeContact);
    	}

    	function change_handler_4(ev) {
    	        setPref('showTypeContact', showTypeContact);
    	      }

    	function input7_change_handler() {
    		showTypePost = this.checked;
    		$$invalidate('showTypePost', showTypePost);
    	}

    	function change_handler_5(ev) {
    	        setPref('showTypePost', showTypePost);
    	      }

    	function input8_change_handler() {
    		showTypePub = this.checked;
    		$$invalidate('showTypePub', showTypePub);
    	}

    	function change_handler_6(ev) {
    	        setPref('showTypePub', showTypePub);
    	      }

    	function input9_change_handler() {
    		showTypePrivate = this.checked;
    		$$invalidate('showTypePrivate', showTypePrivate);
    	}

    	function change_handler_7(ev) {
    	        setPref('showTypePrivate', showTypePrivate);
    	      }

    	function input10_change_handler() {
    		showTypeVote = this.checked;
    		$$invalidate('showTypeVote', showTypeVote);
    	}

    	function change_handler_8(ev) {
    	        setPref('showTypeVote', showTypeVote);
    	      }

    	function input11_change_handler() {
    		showTypeUnknown = this.checked;
    		$$invalidate('showTypeUnknown', showTypeUnknown);
    	}

    	function change_handler_9(ev) {
    	        setPref('showTypeUnknown', showTypeUnknown);
    	      }

    	function input12_change_handler() {
    		columnSize = this.__value;
    		$$invalidate('columnSize', columnSize);
    	}

    	function change_handler_10() {
    		return setPref('columnSize', columnSize);
    	}

    	function input13_change_handler() {
    		columnSize = this.__value;
    		$$invalidate('columnSize', columnSize);
    	}

    	function change_handler_11() {
    		return setPref('columnSize', columnSize);
    	}

    	function click_handler({ filter }) {
    	                deleteFilter(filter);
    	                currentFilters = getFilters(); $$invalidate('currentFilters', currentFilters);
    	              }

    	function input14_change_handler() {
    		filterAction = this.__value;
    		$$invalidate('filterAction', filterAction);
    	}

    	function input15_change_handler() {
    		filterAction = this.__value;
    		$$invalidate('filterAction', filterAction);
    	}

    	function input16_input_handler() {
    		filterChannel = this.value;
    		$$invalidate('filterChannel', filterChannel);
    	}

    	function input17_input_handler() {
    		filterFeed = this.value;
    		$$invalidate('filterFeed', filterFeed);
    	}

    	function input18_input_handler() {
    		filterKeywords = this.value;
    		$$invalidate('filterKeywords', filterKeywords);
    	}

    	function input19_input_handler() {
    		filterExpiry = this.value;
    		$$invalidate('filterExpiry', filterExpiry);
    	}

    	return {
    		keys,
    		remote,
    		limit,
    		columnSize,
    		showTypeUnknown,
    		showTypeAbout,
    		showTypeBlog,
    		showTypeChannel,
    		showTypeContact,
    		showTypePost,
    		showTypePrivate,
    		showTypePub,
    		showTypeVote,
    		currentFilters,
    		filterFeed,
    		filterChannel,
    		filterKeywords,
    		filterExpiry,
    		filterAction,
    		saveConfiguration,
    		selectedFile,
    		addNewFilter,
    		input1_input_handler,
    		textarea_input_handler,
    		input2_input_handler,
    		change_handler,
    		input3_change_handler,
    		change_handler_1,
    		input4_change_handler,
    		change_handler_2,
    		input5_change_handler,
    		change_handler_3,
    		input6_change_handler,
    		change_handler_4,
    		input7_change_handler,
    		change_handler_5,
    		input8_change_handler,
    		change_handler_6,
    		input9_change_handler,
    		change_handler_7,
    		input10_change_handler,
    		change_handler_8,
    		input11_change_handler,
    		change_handler_9,
    		input12_change_handler,
    		change_handler_10,
    		input13_change_handler,
    		change_handler_11,
    		click_handler,
    		input14_change_handler,
    		input15_change_handler,
    		input16_input_handler,
    		input17_input_handler,
    		input18_input_handler,
    		input19_input_handler,
    		$$binding_groups
    	};
    }

    class Settings extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		if (!document.getElementById("svelte-1e0jkdi-style")) add_css$8();
    		init(this, options, instance$i, create_fragment$j, safe_not_equal, []);
    	}
    }

    /* src\views\Mentions.svelte generated by Svelte v3.4.4 */

    const file$k = "src\\views\\Mentions.svelte";

    function add_css$9() {
    	var style = element("style");
    	style.id = 'svelte-kdiu44-style';
    	style.textContent = "\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWVudGlvbnMuc3ZlbHRlIiwic291cmNlcyI6WyJNZW50aW9ucy5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdD5cclxuICBpbXBvcnQgTWVzc2FnZVJlbmRlcmVyIGZyb20gXCIuLi9tZXNzYWdlVHlwZXMvTWVzc2FnZVJlbmRlcmVyLnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCB7IG5hdmlnYXRlLCByb3V0ZVBhcmFtcywgZ2V0UHJlZiB9IGZyb20gXCIuLi91dGlscy5qc1wiO1xyXG4gIGltcG9ydCB7IG9uRGVzdHJveSwgb25Nb3VudCB9IGZyb20gXCJzdmVsdGVcIjtcclxuXHJcbiAgbGV0IG1zZ3MgPSBbXTtcclxuICBsZXQgdW5zdWI7XHJcblxyXG4gIGRvY3VtZW50LnRpdGxlID0gYFBhdGNoZm94IC0gTWVudGlvbnNgO1xyXG5cclxuICBsZXQgbHQgPSBmYWxzZTtcclxuXHJcbiAgY29uc3QgcHVsbCA9IGhlcm1pZWJveC5tb2R1bGVzLnB1bGxTdHJlYW07XHJcbiAgY29uc3Qgc2JvdCA9IGhlcm1pZWJveC5zYm90O1xyXG4gIFxyXG5cclxuICBjb25zdCBsb2FkTWVudGlvbnMgPSAoKSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhcIkxvYWRpbmcgbWVudGlvbnMuLi5cIiwgbHQpO1xyXG4gICAgd2luZG93LnNjcm9sbFRvKDAsIDApO1xyXG4gICAgbXNncyA9IFtdO1xyXG4gICAgc3NiLm1lbnRpb25zKHNzYi5mZWVkLCBsdCkudGhlbihtcyA9PiBtc2dzID0gbXMpXHJcbiAgfTsgXHJcblxyXG4gIG9uRGVzdHJveSgoKSA9PiB7XHJcbiAgICB1bnN1YigpO1xyXG4gIH0pO1xyXG5cclxuICBvbk1vdW50KCgpID0+IHtcclxuICAgIHVuc3ViID0gcm91dGVQYXJhbXMuc3Vic2NyaWJlKHBhcmFtcyA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwicGFyYW1zIGNoYW5nZWQuXCIsIGx0LCBwYXJhbXMubHQpO1xyXG4gICAgICBpZiAocGFyYW1zLmx0KSB7XHJcbiAgICAgICAgbGV0IG5ld2x0ID0gcGFyc2VJbnQocGFyYW1zLmx0KTtcclxuICAgICAgICBpZiAobmV3bHQgIT09IGx0KSB7XHJcbiAgICAgICAgICBsdCA9IG5ld2x0O1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsdCA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICAgIGxvYWRNZW50aW9ucygpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbjwvc2NyaXB0PlxyXG5cclxuPHN0eWxlPlxyXG4gIC5tZW51LXJpZ2h0IHtcclxuICAgIHJpZ2h0OiAwcHg7XHJcbiAgICBsZWZ0OiB1bnNldDtcclxuICAgIG1pbi13aWR0aDogMzAwcHg7XHJcbiAgfVxyXG48L3N0eWxlPlxyXG5cclxuPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPlxyXG4gIDxkaXYgY2xhc3M9XCJjb2x1bW5zXCI+XHJcbiAgICA8aDQgY2xhc3M9XCJjb2x1bW5cIj5NZW50aW9uczwvaDQ+XHJcbiAgICA8ZGl2IGNsYXNzPVwiY29sdW1uXCIgLz5cclxuICA8L2Rpdj5cclxuPC9kaXY+XHJcbnsjaWYgbXNncy5sZW5ndGggPT09IDB9XHJcbiAgPGRpdiBjbGFzcz1cImxvYWRpbmcgbG9hZGluZy1sZ1wiIC8+XHJcbns6ZWxzZX1cclxuICB7I2VhY2ggbXNncyBhcyBtc2cgKG1zZy5rZXkpfVxyXG4gICAgPE1lc3NhZ2VSZW5kZXJlciB7bXNnfSAvPlxyXG4gIHsvZWFjaH1cclxuICA8dWwgY2xhc3M9XCJwYWdpbmF0aW9uXCI+XHJcbiAgICA8bGkgY2xhc3M9XCJwYWdlLWl0ZW0gcGFnZS1wcmV2aW91c1wiPlxyXG4gICAgICA8YVxyXG4gICAgICAgIGhyZWY9XCIjL3B1YmxpY1wiXHJcbiAgICAgICAgb246Y2xpY2t8c3RvcFByb3BhZ2F0aW9ufHByZXZlbnREZWZhdWx0PXsoKSA9PiBoaXN0b3J5LmJhY2soKX0+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInBhZ2UtaXRlbS1zdWJ0aXRsZVwiPlByZXZpb3VzPC9kaXY+XHJcbiAgICAgIDwvYT5cclxuICAgIDwvbGk+XHJcbiAgICA8bGkgY2xhc3M9XCJwYWdlLWl0ZW0gcGFnZS1uZXh0XCI+XHJcbiAgICAgIDxhXHJcbiAgICAgICAgaHJlZj1cIiMvcHVibGljXCJcclxuICAgICAgICBvbjpjbGlja3xzdG9wUHJvcGFnYXRpb258cHJldmVudERlZmF1bHQ9eygpID0+IHtcclxuICAgICAgICAgIG5hdmlnYXRlKCcvbWVudGlvbnMnLCB7IGx0OiBtc2dzW21zZ3MubGVuZ3RoIC0gMV0ucnRzIH0pO1xyXG4gICAgICAgIH19PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJwYWdlLWl0ZW0tc3VidGl0bGVcIj5OZXh0PC9kaXY+XHJcbiAgICAgIDwvYT5cclxuICAgIDwvbGk+XHJcbiAgPC91bD5cclxuey9pZn1cclxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiIifQ== */";
    	append(document.head, style);
    }

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.msg = list[i];
    	return child_ctx;
    }

    // (60:0) {:else}
    function create_else_block$b(ctx) {
    	var each_blocks = [], each_1_lookup = new Map(), t0, ul, li0, a0, div0, t2, li1, a1, div1, current, dispose;

    	var each_value = ctx.msgs;

    	const get_key = ctx => ctx.msg.key;

    	for (var i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$6(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$6(key, child_ctx));
    	}

    	return {
    		c: function create() {
    			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].c();

    			t0 = space();
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			div0 = element("div");
    			div0.textContent = "Previous";
    			t2 = space();
    			li1 = element("li");
    			a1 = element("a");
    			div1 = element("div");
    			div1.textContent = "Next";
    			div0.className = "page-item-subtitle";
    			add_location(div0, file$k, 68, 8, 1524);
    			a0.href = "#/public";
    			add_location(a0, file$k, 65, 6, 1414);
    			li0.className = "page-item page-previous";
    			add_location(li0, file$k, 64, 4, 1370);
    			div1.className = "page-item-subtitle";
    			add_location(div1, file$k, 77, 8, 1816);
    			a1.href = "#/public";
    			add_location(a1, file$k, 72, 6, 1639);
    			li1.className = "page-item page-next";
    			add_location(li1, file$k, 71, 4, 1599);
    			ul.className = "pagination";
    			add_location(ul, file$k, 63, 2, 1341);

    			dispose = [
    				listen(a0, "click", stop_propagation(prevent_default(ctx.click_handler))),
    				listen(a1, "click", stop_propagation(prevent_default(ctx.click_handler_1)))
    			];
    		},

    		m: function mount(target, anchor) {
    			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].m(target, anchor);

    			insert(target, t0, anchor);
    			insert(target, ul, anchor);
    			append(ul, li0);
    			append(li0, a0);
    			append(a0, div0);
    			append(ul, t2);
    			append(ul, li1);
    			append(li1, a1);
    			append(a1, div1);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			const each_value = ctx.msgs;

    			group_outros();
    			each_blocks = update_keyed_each(each_blocks, changed, get_key, 1, ctx, each_value, each_1_lookup, t0.parentNode, outro_and_destroy_block, create_each_block$6, t0, get_each_context$6);
    			check_outros();
    		},

    		i: function intro(local) {
    			if (current) return;
    			for (var i = 0; i < each_value.length; i += 1) each_blocks[i].i();

    			current = true;
    		},

    		o: function outro(local) {
    			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].o();

    			current = false;
    		},

    		d: function destroy(detaching) {
    			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].d(detaching);

    			if (detaching) {
    				detach(t0);
    				detach(ul);
    			}

    			run_all(dispose);
    		}
    	};
    }

    // (58:0) {#if msgs.length === 0}
    function create_if_block$d(ctx) {
    	var div;

    	return {
    		c: function create() {
    			div = element("div");
    			div.className = "loading loading-lg";
    			add_location(div, file$k, 58, 2, 1219);
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}
    		}
    	};
    }

    // (61:2) {#each msgs as msg (msg.key)}
    function create_each_block$6(key_1, ctx) {
    	var first, current;

    	var messagerenderer = new MessageRenderer({
    		props: { msg: ctx.msg },
    		$$inline: true
    	});

    	return {
    		key: key_1,

    		first: null,

    		c: function create() {
    			first = empty();
    			messagerenderer.$$.fragment.c();
    			this.first = first;
    		},

    		m: function mount(target, anchor) {
    			insert(target, first, anchor);
    			mount_component(messagerenderer, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var messagerenderer_changes = {};
    			if (changed.msgs) messagerenderer_changes.msg = ctx.msg;
    			messagerenderer.$set(messagerenderer_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			messagerenderer.$$.fragment.i(local);

    			current = true;
    		},

    		o: function outro(local) {
    			messagerenderer.$$.fragment.o(local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(first);
    			}

    			messagerenderer.$destroy(detaching);
    		}
    	};
    }

    function create_fragment$k(ctx) {
    	var div2, div1, h4, t1, div0, t2, current_block_type_index, if_block, if_block_anchor, current;

    	var if_block_creators = [
    		create_if_block$d,
    		create_else_block$b
    	];

    	var if_blocks = [];

    	function select_block_type(ctx) {
    		if (ctx.msgs.length === 0) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	return {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			h4 = element("h4");
    			h4.textContent = "Mentions";
    			t1 = space();
    			div0 = element("div");
    			t2 = space();
    			if_block.c();
    			if_block_anchor = empty();
    			h4.className = "column";
    			add_location(h4, file$k, 53, 4, 1112);
    			div0.className = "column";
    			add_location(div0, file$k, 54, 4, 1150);
    			div1.className = "columns";
    			add_location(div1, file$k, 52, 2, 1085);
    			div2.className = "container";
    			add_location(div2, file$k, 51, 0, 1058);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div2, anchor);
    			append(div2, div1);
    			append(div1, h4);
    			append(div1, t1);
    			append(div1, div0);
    			insert(target, t2, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);
    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(changed, ctx);
    			} else {
    				group_outros();
    				on_outro(() => {
    					if_blocks[previous_block_index].d(1);
    					if_blocks[previous_block_index] = null;
    				});
    				if_block.o(1);
    				check_outros();

    				if_block = if_blocks[current_block_type_index];
    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}
    				if_block.i(1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			if (if_block) if_block.i();
    			current = true;
    		},

    		o: function outro(local) {
    			if (if_block) if_block.o();
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div2);
    				detach(t2);
    			}

    			if_blocks[current_block_type_index].d(detaching);

    			if (detaching) {
    				detach(if_block_anchor);
    			}
    		}
    	};
    }

    function instance$j($$self, $$props, $$invalidate) {
    	

      let msgs = [];
      let unsub;

      document.title = `Patchfox - Mentions`;

      let lt = false;

      const pull = hermiebox.modules.pullStream;
      const sbot = hermiebox.sbot;
      

      const loadMentions = () => {
        console.log("Loading mentions...", lt);
        window.scrollTo(0, 0);
        $$invalidate('msgs', msgs = []);
        ssb.mentions(ssb.feed, lt).then(ms => { const $$result = msgs = ms; $$invalidate('msgs', msgs); return $$result; });
      }; 

      onDestroy(() => {
        unsub();
      });

      onMount(() => {
        unsub = routeParams.subscribe(params => {
          console.log("params changed.", lt, params.lt);
          if (params.lt) {
            let newlt = parseInt(params.lt);
            if (newlt !== lt) {
              lt = newlt;
            }
          } else {
            lt = false;
          }
          loadMentions();
        });
      });

    	function click_handler() {
    		return history.back();
    	}

    	function click_handler_1() {
    	          navigate('/mentions', { lt: msgs[msgs.length - 1].rts });
    	        }

    	return { msgs, click_handler, click_handler_1 };
    }

    class Mentions extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		if (!document.getElementById("svelte-kdiu44-style")) add_css$9();
    		init(this, options, instance$j, create_fragment$k, safe_not_equal, []);
    	}
    }

    let savedData = {};

    const parseLocation = () => {
      let data = queryString.parse(window.location.search);
      let loc = window.location.hash.slice(1).replace("?", "");
      return { data, location: loc }
    };

    const connected = writable(false);

    // maybe in the future, migrate routing system to:
    // https://github.com/ItalyPaleAle/svelte-spa-router
    const route = writable(parseLocation());
    const routeParams = derived(route, $route => $route.data);
    const routeLocation = derived(route, $route => $route.location);

    const navigate = (location, data) => {
      data = data || {};
      route.set({ location, data });
      let dataAsQuery = queryString.stringify(data);
      history.pushState({ location, data }, `Patchfox - ${location}`, `/index.html?${dataAsQuery}#${location}`);
      console.log(`Navigate ${location}`, data);
    };


    const routes = {
      "/thread": Thread,
      "/public": Public,
      "/compose": Compose,
      "/profile": Profile,
      "/error": ErrorView,
      "/channels": Channels,
      "/channel": Channel,
      "/settings": Settings,
      "/mentions": Mentions,
      "*": Default
    };



    const currentView = derived([connected, route], ([$connected, $route]) => {
      let r = $route.location;
      if ($connected) {
        if (routes.hasOwnProperty(r)) {
          return routes[r];
        } else {
          console.log("didn't find", r);
          return routes["*"];
        }
      } else {
        if (r === "/settings") {
          return Settings
        } else {
          return routes["*"];
        }
      }


    });

    const reconnect = () => {
      return new Promise((resolve, reject) => {
        const tryConnect = (data) => {
          window.ssb = new SSB();

          ssb
            .connect(data.keys)
            .then(data => {
              console.log("connected");
              connected.set(true);
              resolve();
            })
            .catch(err => {
              console.error("can't reconnect", err);
              reject(err);
            });
        };

        browser.storage.local
          .get()
          .then(tryConnect, reject);
      })
    };

    // Preferences

    const getPref = (key, defaultValue) => {
      if (savedData.preferences) {
        if (savedData.preferences.hasOwnProperty(key)) {
          return savedData.preferences[key]
        }
      }
      return defaultValue
    };

    const setConnectionConfiguration = ({ keys, remote, manifest }) => {
      savedData.keys = keys;
      savedData.remote = remote;
      savedData.manifest = manifest;

      browser.storage.local.set(savedData);

    };

    const setPref = (key, value) => {
      savedData.preferences = savedData.preferences || {};
      savedData.preferences[key] = value;

      browser.storage.local.set(savedData);
    };

    window.hermiebox = hermiebox; 
    console.log("hermiebox", hermiebox);

    // Display the userguide or release notes depending if the add-on was
    // installed or updated.
    function installedOrUpdated(details) {
        let url;
        let version = browser.runtime.getManifest().version;
        switch (details.reason) {
            case "update":
                url = browser.extension.getURL("/docs/index.html#/release_notes/2019.6.2");
                browser.tabs.create({
                    url: `${url}`
                });
                break;
            case "install":
                url = browser.extension.getURL("/docs/index.html#/guide");
                browser.tabs.create({
                    url: `${url}`
                });
                break;
        }
    }

    browser.runtime.onInstalled.addListener(installedOrUpdated);

    // Build caches

    let contactWorker;

    const backgroundMain = async () => {
        contactWorker = new SharedWorker('worker-contact-cache-bundle.js');
        contactWorker.port.onmessage = e => {
            console.log("[[ contact worker ]]", e);
        };
        contactWorker.port.postMessage({command: "connect", hermiebox});
    };

    backgroundMain();

}());
//# sourceMappingURL=background-bundle.js.map
