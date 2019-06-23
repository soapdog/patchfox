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

    /**
     * Hermiebox Driver
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

    class DriverHermiebox {
      constructor() {
        this.name = "Driver for Hermiebox";
      }

      log(pMsg, pVal = "") {
        console.log(`[Driver Hermiebox] - ${pMsg}`, pVal);
      }

      async connect(pKeys) {
        var server = await hermiebox.api.connect(pKeys);
        this.log("you are", server.id);
        this.feed = server.id;
      }

      async public(opts, nonStandard) {
        var msgs = await hermiebox.api.pullPublic(opts, nonStandard);
        return msgs
      }

      async thread(msgid) {
        var msgs = await hermiebox.api.thread(msgid);
        return msgs
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
        try {
          let avatar = await hermiebox.api.avatar(feed);
          await this.setAvatarCache(feed, avatar);
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
          .replace("<pre>", "<pre class=\"code\">")
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
          const schemas = hermiebox.modules.ssbMsgSchemas;

          const text = data.text;
          const root = data.hasOwnProperty("root") ? data.root : undefined;
          const branch = data.hasOwnProperty("branch") ? data.branch : undefined;
          const mentions = data.hasOwnProperty("mentions") ? data.mentions : undefined;
          const recps = data.hasOwnProperty("recps") ? data.recps : undefined;
          const channel = data.hasOwnProperty("channel") ? data.channel : undefined;
          const fork = data.hasOwnProperty("fork") ? data.fork : undefined;
          const sbot = hermiebox.sbot || false;

          const msgToPost = schemas.post(text, root, branch, mentions, recps, channel);

          if (fork) {
            // TODO: ssb-msg-schemas doesn't have a fork param
            msgToPost.fork = fork;
          }

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

          console.dir(query);

          if (sbot) {
            pull(
              sbot.query.read({
                query: [
                  query
                ],
                limit: opts.limit,
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

      query(filter, limit, reverse, map, reduce) {
        return new Promise((resolve, reject) => {
          let pull = hermiebox.modules.pullStream;
          let sbot = hermiebox.sbot || false;

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

            console.log(`query call with limit: ${limit} and reverse: ${reverse}`, query);
            pull(
              sbot.query.read({
                query: [
                  query
                ],
                reverse: reverse,
                limit: limit
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

    // (79:6) {#if msg.value.content.root}
    function create_if_block_1(ctx) {
    	var span, a, t, a_href_value, dispose;

    	return {
    		c: function create() {
    			span = element("span");
    			a = element("a");
    			t = text("(root)");
    			a.href = a_href_value = "?thread=" + encodeURIComponent(ctx.msg.value.content.root) + "#/thread";
    			add_location(a, file, 80, 10, 2065);
    			add_location(span, file, 79, 8, 2047);
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

    // (88:6) {#if msg.value.content.branch}
    function create_if_block(ctx) {
    	var span, a, t, a_href_value, dispose;

    	return {
    		c: function create() {
    			span = element("span");
    			a = element("a");
    			t = text("(in reply to)");
    			a.href = a_href_value = "?thread=" + encodeURIComponent(ctx.msg.value.content.branch) + "#/thread";
    			add_location(a, file, 89, 10, 2327);
    			add_location(span, file, 88, 8, 2309);
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

    function create_fragment(ctx) {
    	var div0, t0, div4, div3, div1, label, input, t1, i, t2, t3, t4, t5, div2, button0, t7, button1, dispose;

    	var if_block0 = (ctx.msg.value.content.root) && create_if_block_1(ctx);

    	var if_block1 = (ctx.msg.value.content.branch) && create_if_block(ctx);

    	return {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			div4 = element("div");
    			div3 = element("div");
    			div1 = element("div");
    			label = element("label");
    			input = element("input");
    			t1 = space();
    			i = element("i");
    			t2 = text("\r\n        Like");
    			t3 = space();
    			if (if_block0) if_block0.c();
    			t4 = space();
    			if (if_block1) if_block1.c();
    			t5 = space();
    			div2 = element("div");
    			button0 = element("button");
    			button0.textContent = "Fork";
    			t7 = space();
    			button1 = element("button");
    			button1.textContent = "Reply";
    			div0.className = "card-body svelte-1ftdgav";
    			add_location(div0, file, 67, 0, 1673);
    			attr(input, "type", "checkbox");
    			input.checked = ctx.liked;
    			add_location(input, file, 74, 8, 1873);
    			i.className = "form-icon";
    			add_location(i, file, 75, 8, 1948);
    			label.className = "form-switch d-inline";
    			add_location(label, file, 73, 6, 1827);
    			div1.className = "column col-6";
    			add_location(div1, file, 72, 4, 1793);
    			button0.className = "btn";
    			add_location(button0, file, 99, 6, 2599);
    			button1.className = "btn";
    			add_location(button1, file, 101, 6, 2658);
    			div2.className = "column col-6 text-right";
    			add_location(div2, file, 98, 4, 2554);
    			div3.className = "columns col-gapless";
    			add_location(div3, file, 71, 2, 1754);
    			div4.className = "card-footer";
    			add_location(div4, file, 70, 0, 1725);

    			dispose = [
    				listen(input, "change", ctx.likeChanged),
    				listen(button0, "click", ctx.fork),
    				listen(button1, "click", ctx.reply)
    			];
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div0, anchor);
    			div0.innerHTML = ctx.content;
    			insert(target, t0, anchor);
    			insert(target, div4, anchor);
    			append(div4, div3);
    			append(div3, div1);
    			append(div1, label);
    			append(label, input);
    			append(label, t1);
    			append(label, i);
    			append(label, t2);
    			append(div1, t3);
    			if (if_block0) if_block0.m(div1, null);
    			append(div1, t4);
    			if (if_block1) if_block1.m(div1, null);
    			append(div3, t5);
    			append(div3, div2);
    			append(div2, button0);
    			append(div2, t7);
    			append(div2, button1);
    		},

    		p: function update(changed, ctx) {
    			if (changed.liked) {
    				input.checked = ctx.liked;
    			}

    			if (ctx.msg.value.content.root) {
    				if (if_block0) {
    					if_block0.p(changed, ctx);
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					if_block0.m(div1, t4);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (ctx.msg.value.content.branch) {
    				if (if_block1) {
    					if_block1.p(changed, ctx);
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					if_block1.m(div1, null);
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
    				detach(div0);
    				detach(t0);
    				detach(div4);
    			}

    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			run_all(dispose);
    		}
    	};
    }

    function instance($$self, $$props, $$invalidate) {
    	let { msg } = $$props;

      let content = ssb.markdown(msg.value.content.text);
      let liked = false;

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
        navigate("/compose", { root: msg.key, branch: msg.key, fork: originalRoot, channel, replyfeed });
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

    	$$self.$set = $$props => {
    		if ('msg' in $$props) $$invalidate('msg', msg = $$props.msg);
    	};

    	return {
    		msg,
    		content,
    		liked,
    		likeChanged,
    		reply,
    		fork,
    		goRoot,
    		goBranch
    	};
    }

    class PostMsg extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
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

    function create_fragment$1(ctx) {
    	var div, pre, code, t;

    	return {
    		c: function create() {
    			div = element("div");
    			pre = element("pre");
    			code = element("code");
    			t = text(ctx.rawContent);
    			add_location(code, file$1, 13, 4, 189);
    			pre.className = "code svelte-1c3kv1x";
    			add_location(pre, file$1, 12, 2, 166);
    			div.className = "card-body";
    			add_location(div, file$1, 11, 0, 140);
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
    			add_location(a, file$2, 29, 2, 707);
    			div.className = "card-body";
    			add_location(div, file$2, 27, 0, 656);
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
    			add_location(p, file$3, 5, 0, 62);
    			div.className = "card-body";
    			add_location(div, file$3, 4, 0, 38);
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
    		if (ctx.image) return create_if_block_2;
    		return create_else_block;
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
    function create_else_block(ctx) {
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
    function create_if_block_2(ctx) {
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
    			add_location(img, file$8, 88, 4, 1991);
    			div.className = "card-image";
    			add_location(div, file$8, 87, 2, 1962);
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
    			add_location(h1, file$8, 96, 4, 2179);
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
    			add_location(div, file$8, 100, 4, 2245);
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
    function create_if_block_3(ctx) {
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
    function create_if_block_2$1(ctx) {
    	var span, a, t, a_href_value, dispose;

    	return {
    		c: function create() {
    			span = element("span");
    			a = element("a");
    			t = text("(root)");
    			a.href = a_href_value = "?thread=" + encodeURIComponent(ctx.msg.value.content.root) + "#/thread";
    			add_location(a, file$8, 118, 10, 2735);
    			add_location(span, file$8, 117, 8, 2718);
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
    			add_location(a, file$8, 127, 10, 2988);
    			add_location(span, file$8, 126, 8, 2971);
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
    function create_else_block$1(ctx) {
    	var button, dispose;

    	return {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Close Blogpost";
    			button.className = "btn btn-primary";
    			toggle_class(button, "locating", ctx.loading);
    			add_location(button, file$8, 145, 8, 3514);
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
    			add_location(button, file$8, 138, 8, 3335);
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
    		if (ctx.showBlogpost) return create_if_block_3;
    		return create_else_block_1$1;
    	}

    	var current_block_type = select_block_type(ctx);
    	var if_block3 = current_block_type(ctx);

    	var if_block4 = (ctx.msg.value.content.root) && create_if_block_2$1(ctx);

    	var if_block5 = (ctx.msg.value.content.branch) && create_if_block_1$2(ctx);

    	function select_block_type_1(ctx) {
    		if (!ctx.showBlogpost) return create_if_block$2;
    		return create_else_block$1;
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
    			t5 = text("\n        Like");
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
    			add_location(div0, file$8, 94, 0, 2137);
    			attr(input, "type", "checkbox");
    			input.checked = ctx.liked;
    			add_location(input, file$8, 112, 8, 2549);
    			i.className = "form-icon";
    			add_location(i, file$8, 113, 8, 2623);
    			label.className = "form-switch d-inline";
    			add_location(label, file$8, 111, 6, 2504);
    			div1.className = "column col-6";
    			add_location(div1, file$8, 110, 4, 2471);
    			button.className = "btn";
    			add_location(button, file$8, 136, 6, 3249);
    			div2.className = "column col-6 text-right";
    			add_location(div2, file$8, 135, 4, 3205);
    			div3.className = "columns col-gapless";
    			add_location(div3, file$8, 109, 2, 2433);
    			div4.className = "card-footer";
    			add_location(div4, file$8, 108, 0, 2405);

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
    					if_block4 = create_if_block_2$1(ctx);
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
    function create_else_block$2(ctx) {
    	var span, t, dispose;

    	return {
    		c: function create() {
    			span = element("span");
    			t = text(ctx.name);
    			span.className = "chip";
    			add_location(span, file$9, 29, 2, 566);
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
    			add_location(img, file$9, 25, 4, 490);
    			div.className = "chip";
    			add_location(div, file$9, 24, 2, 444);
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
    		return create_else_block$2;
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

    // (139:8) {#if msg.value.content.channel}
    function create_if_block_2$2(ctx) {
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

    // (175:44) {:else}
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

    // (175:14) {#if !showRaw}
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

    // (184:2) {:else}
    function create_else_block$3(ctx) {
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
    			t2 = text("This is a message of type\n            ");
    			em = element("em");
    			t3 = text(ctx.type);
    			t4 = text("\n            .");
    			t5 = space();
    			p1 = element("p");
    			t6 = text("To learn more about it, go to\n            ");
    			a = element("a");
    			t7 = text("the documentation about messages with type ");
    			t8 = text(ctx.type);
    			t9 = text("\n            .");
    			add_location(code, file$a, 188, 12, 4924);
    			pre.className = "code";
    			add_location(pre, file$a, 187, 10, 4893);
    			div0.className = "column col-9";
    			add_location(div0, file$a, 186, 8, 4856);
    			add_location(em, file$a, 194, 12, 5081);
    			add_location(p0, file$a, 192, 10, 5027);
    			a.target = "_blank";
    			a.href = a_href_value = "/docs/index.html#/message_types/" + ctx.type;
    			add_location(a, file$a, 199, 12, 5194);
    			add_location(p1, file$a, 197, 10, 5136);
    			div1.className = "column col-3";
    			add_location(div1, file$a, 191, 8, 4990);
    			div2.className = "columns";
    			add_location(div2, file$a, 185, 6, 4826);
    			div3.className = "card-body";
    			add_location(div3, file$a, 184, 4, 4796);
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

    // (182:2) {#if !showRaw}
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
    	var div10, div9, div6, div5, div4, div1, div0, img, t0, div3, div2, t1, t2, small, t3_value = timestamp(ctx.msg.value.timestamp), t3, t4, div8, span0, t5, div7, span1, i0, t6, ul, li0, a0, i1, t7, a0_href_value, t8, li1, a1, i2, t9, t10, li2, a2, i3, t11, t12, li3, t13, li4, a3, i4, t14, t15, current_block_type_index, if_block2, current, dispose;

    	var if_block0 = (ctx.msg.value.content.channel) && create_if_block_2$2(ctx);

    	function select_block_type(ctx) {
    		if (!ctx.showRaw) return create_if_block_1$3;
    		return create_else_block_1$2;
    	}

    	var current_block_type = select_block_type(ctx);
    	var if_block1 = current_block_type(ctx);

    	var if_block_creators = [
    		create_if_block$4,
    		create_else_block$3
    	];

    	var if_blocks = [];

    	function select_block_type_1(ctx) {
    		if (!ctx.showRaw) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block2 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

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
    			div8 = element("div");
    			span0 = element("span");
    			if (if_block0) if_block0.c();
    			t5 = space();
    			div7 = element("div");
    			span1 = element("span");
    			i0 = element("i");
    			t6 = space();
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			i1 = element("i");
    			t7 = text("\n              Open in new tab");
    			t8 = space();
    			li1 = element("li");
    			a1 = element("a");
    			i2 = element("i");
    			t9 = text("\n              Copy permalink to clipboard");
    			t10 = space();
    			li2 = element("li");
    			a2 = element("a");
    			i3 = element("i");
    			t11 = text("\n              Copy message id to clipboard");
    			t12 = space();
    			li3 = element("li");
    			t13 = space();
    			li4 = element("li");
    			a3 = element("a");
    			i4 = element("i");
    			t14 = space();
    			if_block1.c();
    			t15 = space();
    			if_block2.c();
    			img.src = ctx.image;
    			img.className = "avatar avatar-lg";
    			img.alt = ctx.feed;
    			add_location(img, file$a, 119, 14, 2714);
    			div0.className = "example-tile-icon";
    			add_location(div0, file$a, 118, 12, 2668);
    			div1.className = "tile-icon";
    			add_location(div1, file$a, 117, 10, 2632);
    			div2.className = "tile-title";
    			add_location(div2, file$a, 123, 12, 2855);
    			small.className = "tile-subtitle text-gray";
    			add_location(small, file$a, 124, 12, 2904);
    			div3.className = "tile-content";
    			add_location(div3, file$a, 122, 10, 2816);
    			div4.className = "tile tile-centered feed-display svelte-17ozi8u";
    			add_location(div4, file$a, 114, 8, 2535);
    			div5.className = "card-title";
    			add_location(div5, file$a, 113, 6, 2502);
    			div6.className = "float-left";
    			add_location(div6, file$a, 112, 4, 2471);
    			span0.className = "text-gray channel-display svelte-17ozi8u";
    			add_location(span0, file$a, 133, 6, 3106);
    			i0.className = "icon icon-more-vert";
    			add_location(i0, file$a, 146, 10, 3576);
    			span1.className = "btn btn-link dropdown-toggle";
    			span1.tabIndex = "0";
    			toggle_class(span1, "active", ctx.dropdownActive);
    			add_location(span1, file$a, 141, 8, 3387);
    			i1.className = "icon icon-share";
    			add_location(i1, file$a, 154, 14, 3824);
    			a0.href = a0_href_value = "?thread=" + ctx.encodeURIComponent(ctx.msg.key) + "#/thread";
    			a0.target = "_blank";
    			add_location(a0, file$a, 151, 12, 3709);
    			li0.className = "menu-item";
    			add_location(li0, file$a, 149, 10, 3673);
    			i2.className = "icon icon-copy";
    			add_location(i2, file$a, 160, 14, 4029);
    			a1.href = "#";
    			add_location(a1, file$a, 159, 12, 3962);
    			li1.className = "menu-item";
    			add_location(li1, file$a, 158, 10, 3927);
    			i3.className = "icon icon-copy";
    			add_location(i3, file$a, 166, 14, 4240);
    			a2.href = "#";
    			add_location(a2, file$a, 165, 12, 4178);
    			li2.className = "menu-item";
    			add_location(li2, file$a, 164, 10, 4143);
    			li3.className = "divider";
    			li3.dataset.content = "FOR THE CURIOUS";
    			add_location(li3, file$a, 170, 10, 4355);
    			i4.className = "icon icon-message";
    			add_location(i4, file$a, 173, 14, 4524);
    			a3.href = "#";
    			add_location(a3, file$a, 172, 12, 4454);
    			li4.className = "menu-item";
    			add_location(li4, file$a, 171, 10, 4419);
    			ul.className = "menu menu-right svelte-17ozi8u";
    			add_location(ul, file$a, 148, 8, 3634);
    			div7.className = "dropdown";
    			add_location(div7, file$a, 140, 6, 3356);
    			div8.className = "float-right";
    			add_location(div8, file$a, 131, 4, 3073);
    			div9.className = "card-header";
    			add_location(div9, file$a, 111, 2, 2441);
    			div10.className = "card m-2";
    			add_location(div10, file$a, 110, 0, 2416);

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
    			append(div9, div8);
    			append(div8, span0);
    			if (if_block0) if_block0.m(span0, null);
    			append(div8, t5);
    			append(div8, div7);
    			append(div7, span1);
    			append(span1, i0);
    			append(div7, t6);
    			append(div7, ul);
    			append(ul, li0);
    			append(li0, a0);
    			append(a0, i1);
    			append(a0, t7);
    			append(ul, t8);
    			append(ul, li1);
    			append(li1, a1);
    			append(a1, i2);
    			append(a1, t9);
    			append(ul, t10);
    			append(ul, li2);
    			append(li2, a2);
    			append(a2, i3);
    			append(a2, t11);
    			append(ul, t12);
    			append(ul, li3);
    			append(ul, t13);
    			append(ul, li4);
    			append(li4, a3);
    			append(a3, i4);
    			append(a3, t14);
    			if_block1.m(a3, null);
    			append(div10, t15);
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

    			if (ctx.msg.value.content.channel) {
    				if (if_block0) {
    					if_block0.p(changed, ctx);
    				} else {
    					if_block0 = create_if_block_2$2(ctx);
    					if_block0.c();
    					if_block0.m(span0, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (changed.dropdownActive) {
    				toggle_class(span1, "active", ctx.dropdownActive);
    			}

    			if ((!current || changed.msg) && a0_href_value !== (a0_href_value = "?thread=" + ctx.encodeURIComponent(ctx.msg.key) + "#/thread")) {
    				a0.href = a0_href_value;
    			}

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block1.d(1);
    				if_block1 = current_block_type(ctx);
    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(a3, null);
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
    				if_block2.o(1);
    				check_outros();

    				if_block2 = if_blocks[current_block_type_index];
    				if (!if_block2) {
    					if_block2 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block2.c();
    				}
    				if_block2.i(1);
    				if_block2.m(div10, null);
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
    				detach(div10);
    			}

    			if (if_block0) if_block0.d();
    			if_block1.d();
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

      if (messageTypes.hasOwnProperty(type)) {
        $$invalidate('selectedRenderer', selectedRenderer = messageTypes[type]);
      } else {
        $$invalidate('selectedRenderer', selectedRenderer = messageTypes["*"]);
      }

      let image = "images/icon.png";
      let name = feed;

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

      const goProfile = (ev) => {
         if (ev.ctrlKey) {
          window.open(`?feed=${encodeURIComponent(feed)}#/profile`);
        } else {
          navigate('/profile', { feed });
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
    		selectedRenderer,
    		image,
    		name,
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

    function get_each_context(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.msg = list[i];
    	return child_ctx;
    }

    // (89:0) {#if error}
    function create_if_block_1$4(ctx) {
    	var div, t0, t1;

    	return {
    		c: function create() {
    			div = element("div");
    			t0 = text("Error: ");
    			t1 = text(ctx.error);
    			div.className = "toast toast-error";
    			add_location(div, file$b, 89, 2, 2225);
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

    // (94:0) {:else}
    function create_else_block$4(ctx) {
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
    			add_location(div0, file$b, 102, 8, 2605);
    			a0.href = "#/public";
    			add_location(a0, file$b, 99, 6, 2495);
    			li0.className = "page-item page-previous";
    			add_location(li0, file$b, 98, 4, 2451);
    			div1.className = "page-item-subtitle";
    			add_location(div1, file$b, 113, 8, 2966);
    			a1.href = "#/public";
    			add_location(a1, file$b, 106, 6, 2720);
    			li1.className = "page-item page-next";
    			add_location(li1, file$b, 105, 4, 2680);
    			ul.className = "pagination";
    			add_location(ul, file$b, 97, 2, 2422);

    			dispose = [
    				listen(a0, "click", stop_propagation(prevent_default(ctx.click_handler_1))),
    				listen(a1, "click", stop_propagation(prevent_default(ctx.click_handler_2)))
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

    // (92:0) {#if !msgs}
    function create_if_block$5(ctx) {
    	var div;

    	return {
    		c: function create() {
    			div = element("div");
    			div.className = "loading loading-lg";
    			add_location(div, file$b, 92, 2, 2300);
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

    // (95:2) {#each msgs as msg (msg.key)}
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
    	var div3, div2, h4, t1, div1, div0, span, i0, t2, ul, li0, label0, input0, t3, i1, t4, t5, li1, label1, t6, t7_value = ctx.opts.limit, t7, t8, t9, input1, t10, t11, current_block_type_index, if_block1, if_block1_anchor, current, dispose;

    	var if_block0 = (ctx.error) && create_if_block_1$4(ctx);

    	var if_block_creators = [
    		create_if_block$5,
    		create_else_block$4
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
    			h4 = element("h4");
    			h4.textContent = "Public Feed";
    			t1 = space();
    			div1 = element("div");
    			div0 = element("div");
    			span = element("span");
    			i0 = element("i");
    			t2 = space();
    			ul = element("ul");
    			li0 = element("li");
    			label0 = element("label");
    			input0 = element("input");
    			t3 = space();
    			i1 = element("i");
    			t4 = text("\r\n              Show Only Roots");
    			t5 = space();
    			li1 = element("li");
    			label1 = element("label");
    			t6 = text("Fetch ");
    			t7 = text(t7_value);
    			t8 = text(" messages");
    			t9 = space();
    			input1 = element("input");
    			t10 = space();
    			if (if_block0) if_block0.c();
    			t11 = space();
    			if_block1.c();
    			if_block1_anchor = empty();
    			h4.className = "column";
    			add_location(h4, file$b, 52, 4, 1108);
    			i0.className = "icon icon-more-horiz text-gray";
    			add_location(i0, file$b, 60, 10, 1415);
    			span.className = "btn btn-link dropdown-toggle";
    			span.tabIndex = "0";
    			toggle_class(span, "active", ctx.dropdownActive);
    			add_location(span, file$b, 55, 8, 1221);
    			attr(input0, "type", "checkbox");
    			add_location(input0, file$b, 65, 14, 1607);
    			i1.className = "form-icon";
    			add_location(i1, file$b, 66, 14, 1673);
    			label0.className = "form-checkbox";
    			add_location(label0, file$b, 64, 12, 1562);
    			li0.className = "menu-item";
    			add_location(li0, file$b, 63, 10, 1526);
    			label1.className = "form-label";
    			label1.htmlFor = "input-example-1";
    			add_location(label1, file$b, 71, 12, 1814);
    			input1.className = "slider tooltip";
    			attr(input1, "type", "range");
    			input1.min = "10";
    			input1.max = "100";
    			input1.value = "50";
    			add_location(input1, file$b, 74, 12, 1941);
    			li1.className = "menu-item";
    			add_location(li1, file$b, 70, 10, 1778);
    			ul.className = "menu menu-right svelte-kdiu44";
    			add_location(ul, file$b, 62, 8, 1486);
    			div0.className = "dropdown float-right";
    			add_location(div0, file$b, 54, 6, 1177);
    			div1.className = "column";
    			add_location(div1, file$b, 53, 4, 1149);
    			div2.className = "columns";
    			add_location(div2, file$b, 51, 2, 1081);
    			div3.className = "container";
    			add_location(div3, file$b, 50, 0, 1054);

    			dispose = [
    				listen(span, "click", ctx.click_handler),
    				listen(input0, "change", ctx.input0_change_handler),
    				listen(input1, "change", ctx.input1_change_input_handler),
    				listen(input1, "input", ctx.input1_change_input_handler)
    			];
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div3, anchor);
    			append(div3, div2);
    			append(div2, h4);
    			append(div2, t1);
    			append(div2, div1);
    			append(div1, div0);
    			append(div0, span);
    			append(span, i0);
    			append(div0, t2);
    			append(div0, ul);
    			append(ul, li0);
    			append(li0, label0);
    			append(label0, input0);

    			input0.checked = ctx.onlyRoots;

    			append(label0, t3);
    			append(label0, i1);
    			append(label0, t4);
    			append(ul, t5);
    			append(ul, li1);
    			append(li1, label1);
    			append(label1, t6);
    			append(label1, t7);
    			append(label1, t8);
    			append(li1, t9);
    			append(li1, input1);

    			input1.value = ctx.opts.limit;

    			insert(target, t10, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert(target, t11, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert(target, if_block1_anchor, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (changed.dropdownActive) {
    				toggle_class(span, "active", ctx.dropdownActive);
    			}

    			if (changed.onlyRoots) input0.checked = ctx.onlyRoots;

    			if ((!current || changed.opts) && t7_value !== (t7_value = ctx.opts.limit)) {
    				set_data(t7, t7_value);
    			}

    			if (changed.opts) input1.value = ctx.opts.limit;

    			if (ctx.error) {
    				if (if_block0) {
    					if_block0.p(changed, ctx);
    				} else {
    					if_block0 = create_if_block_1$4(ctx);
    					if_block0.c();
    					if_block0.m(t11.parentNode, t11);
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
    				detach(t10);
    			}

    			if (if_block0) if_block0.d(detaching);

    			if (detaching) {
    				detach(t11);
    			}

    			if_blocks[current_block_type_index].d(detaching);

    			if (detaching) {
    				detach(if_block1_anchor);
    			}

    			run_all(dispose);
    		}
    	};
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let $routeParams;

    	validate_store(routeParams, 'routeParams');
    	subscribe($$self, routeParams, $$value => { $routeParams = $$value; $$invalidate('$routeParams', $routeParams); });

    	
      let msgs = false;
      let error = $routeParams.error || false;
      let dropdownActive = false;

      let opts = {
        limit: $routeParams.limit || 10,
        reverse: true
      };

      let onlyRoots = $routeParams.onlyRoots || false;

    	function click_handler() {
    		const $$result = (dropdownActive = !dropdownActive);
    		$$invalidate('dropdownActive', dropdownActive);
    		return $$result;
    	}

    	function input0_change_handler() {
    		onlyRoots = this.checked;
    		$$invalidate('onlyRoots', onlyRoots);
    	}

    	function input1_change_input_handler() {
    		opts.limit = to_number(this.value);
    		$$invalidate('opts', opts), $$invalidate('$routeParams', $routeParams), $$invalidate('onlyRoots', onlyRoots), $$invalidate('error', error);
    	}

    	function click_handler_1() {
    		return history.back();
    	}

    	function click_handler_2() {
    		return navigate('/public', {
    	            lt: msgs[msgs.length - 1].rts,
    	            limit: opts.limit,
    	            onlyRoots: opts.onlyRoots
    	          });
    	}

    	$$self.$$.update = ($$dirty = { opts: 1, $routeParams: 1, onlyRoots: 1, error: 1 }) => {
    		if ($$dirty.opts || $$dirty.$routeParams || $$dirty.onlyRoots || $$dirty.error) { {
            Object.assign(opts, $routeParams);
        
            document.title = `Patchfox - Public`;
        
            if (opts.hasOwnProperty("lt")) {
              opts.lt = parseInt(opts.lt); $$invalidate('opts', opts), $$invalidate('$routeParams', $routeParams), $$invalidate('onlyRoots', onlyRoots), $$invalidate('error', error);
            }
        
            if (opts.hasOwnProperty("limit")) {
              opts.limit = parseInt(opts.limit); $$invalidate('opts', opts), $$invalidate('$routeParams', $routeParams), $$invalidate('onlyRoots', onlyRoots), $$invalidate('error', error);
            }
        
            let promise = ssb
              .public(opts, { onlyRoots })
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

    	return {
    		msgs,
    		error,
    		dropdownActive,
    		opts,
    		onlyRoots,
    		click_handler,
    		input0_change_handler,
    		input1_change_input_handler,
    		click_handler_1,
    		click_handler_2
    	};
    }

    class Public extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
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

    // (179:6) {#if fork}
    function create_if_block_9(ctx) {
    	var div, t0, t1;

    	return {
    		c: function create() {
    			div = element("div");
    			t0 = text("You are forking: ");
    			t1 = text(ctx.fork);
    			div.className = "toast toast-warning";
    			add_location(div, file$d, 179, 8, 4601);
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

    // (182:6) {#if msg}
    function create_if_block_7(ctx) {
    	var if_block_anchor;

    	function select_block_type(ctx) {
    		if (ctx.error) return create_if_block_8;
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

    // (185:8) {:else}
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
    			add_location(a, file$d, 187, 12, 4902);
    			div.className = "toast toast-success";
    			add_location(div, file$d, 185, 10, 4797);
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

    // (183:8) {#if error}
    function create_if_block_8(ctx) {
    	var div, t;

    	return {
    		c: function create() {
    			div = element("div");
    			t = text(ctx.msg);
    			div.className = "toast toast-error";
    			add_location(div, file$d, 183, 10, 4726);
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

    // (241:6) {:else}
    function create_else_block$5(ctx) {
    	var div4, h2, t1, t2, raw_value = ctx.ssb.markdown(ctx.content), raw_before, raw_after, t3, div0, t4, div3, div1, span, t6, div2, button0, t8, button1, dispose;

    	var if_block = (ctx.channel || ctx.root || ctx.branch) && create_if_block_3$1(ctx);

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
    			add_location(h2, file$d, 242, 10, 6806);
    			div0.className = "divider";
    			add_location(div0, file$d, 267, 10, 7507);
    			span.className = "label label-warning";
    			add_location(span, file$d, 270, 14, 7633);
    			div1.className = "column col-md-12 col-lg-10";
    			add_location(div1, file$d, 269, 12, 7577);
    			button0.className = "btn";
    			add_location(button0, file$d, 275, 14, 7855);
    			button1.className = "btn btn-primary";
    			toggle_class(button1, "loading", ctx.posting);
    			add_location(button1, file$d, 278, 14, 7980);
    			div2.className = "column col-md-12 col-lg-2";
    			add_location(div2, file$d, 274, 12, 7800);
    			div3.className = "columns";
    			add_location(div3, file$d, 268, 10, 7542);
    			div4.className = "column col-md-12";
    			add_location(div4, file$d, 241, 8, 6764);

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
    			if (ctx.channel || ctx.root || ctx.branch) {
    				if (if_block) {
    					if_block.p(changed, ctx);
    				} else {
    					if_block = create_if_block_3$1(ctx);
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

    // (196:6) {#if !showPreview}
    function create_if_block$6(ctx) {
    	var div, label0, t1, input0, t2, t3, t4, label1, t6, textarea, t7, br, t8, input1, t9, button0, t11, button1, div_intro, div_outro, current, dispose;

    	var if_block0 = (ctx.branch) && create_if_block_2$3(ctx);

    	var if_block1 = (ctx.replyfeed) && create_if_block_1$5(ctx);

    	return {
    		c: function create() {
    			div = element("div");
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
    			br = element("br");
    			t8 = space();
    			input1 = element("input");
    			t9 = space();
    			button0 = element("button");
    			button0.textContent = "Attach File";
    			t11 = space();
    			button1 = element("button");
    			button1.textContent = "Preview";
    			label0.className = "form-label";
    			label0.htmlFor = "channel";
    			add_location(label0, file$d, 197, 10, 5188);
    			input0.className = "form-input";
    			attr(input0, "type", "text");
    			input0.id = "channel";
    			input0.placeholder = "channel";
    			add_location(input0, file$d, 198, 10, 5255);
    			label1.className = "form-label";
    			label1.htmlFor = "content";
    			add_location(label1, file$d, 223, 10, 6019);
    			textarea.className = "form-input svelte-olsuyr";
    			textarea.id = "content";
    			textarea.placeholder = "Type in your post";
    			textarea.rows = "10";
    			toggle_class(textarea, "file-on-top", ctx.fileOnTop);
    			add_location(textarea, file$d, 224, 10, 6086);
    			add_location(br, file$d, 233, 10, 6449);
    			attr(input1, "type", "file");
    			input1.id = "fileInput";
    			input1.className = "svelte-olsuyr";
    			add_location(input1, file$d, 234, 10, 6467);
    			button0.className = "btn";
    			add_location(button0, file$d, 235, 10, 6537);
    			button1.className = "btn btn-primary float-right";
    			add_location(button1, file$d, 236, 10, 6618);
    			div.className = "form-group";
    			add_location(div, file$d, 196, 8, 5133);

    			dispose = [
    				listen(input0, "input", ctx.input0_input_handler),
    				listen(textarea, "input", ctx.textarea_input_handler),
    				listen(textarea, "dragover", stop_propagation(prevent_default(ctx.dragOver))),
    				listen(textarea, "dragleave", stop_propagation(prevent_default(ctx.dragLeave))),
    				listen(input1, "input", ctx.attachFile),
    				listen(button0, "click", ctx.attachFileTrigger),
    				listen(button1, "click", ctx.preview)
    			];
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			append(div, label0);
    			append(div, t1);
    			append(div, input0);

    			input0.value = ctx.channel;

    			append(div, t2);
    			if (if_block0) if_block0.m(div, null);
    			append(div, t3);
    			if (if_block1) if_block1.m(div, null);
    			append(div, t4);
    			append(div, label1);
    			append(div, t6);
    			append(div, textarea);

    			textarea.value = ctx.content;

    			append(div, t7);
    			append(div, br);
    			append(div, t8);
    			append(div, input1);
    			append(div, t9);
    			append(div, button0);
    			append(div, t11);
    			append(div, button1);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (changed.channel && (input0.value !== ctx.channel)) input0.value = ctx.channel;

    			if (ctx.branch) {
    				if (if_block0) {
    					if_block0.p(changed, ctx);
    				} else {
    					if_block0 = create_if_block_2$3(ctx);
    					if_block0.c();
    					if_block0.m(div, t3);
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
    					if_block1 = create_if_block_1$5(ctx);
    					if_block1.c();
    					if_block1.i(1);
    					if_block1.m(div, t4);
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
    		},

    		i: function intro(local) {
    			if (current) return;
    			if (if_block1) if_block1.i();

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);
    				if (!div_intro) div_intro = create_in_transition(div, slide, {});
    				div_intro.start();
    			});

    			current = true;
    		},

    		o: function outro(local) {
    			if (if_block1) if_block1.o();
    			if (div_intro) div_intro.invalidate();

    			if (local) {
    				div_outro = create_out_transition(div, slide, {});
    			}

    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();

    			if (detaching) {
    				if (div_outro) div_outro.end();
    			}

    			run_all(dispose);
    		}
    	};
    }

    // (244:10) {#if channel || root || branch}
    function create_if_block_3$1(ctx) {
    	var blockquote, t0, t1;

    	var if_block0 = (ctx.channel) && create_if_block_6$1(ctx);

    	var if_block1 = (ctx.root) && create_if_block_5$1(ctx);

    	var if_block2 = (ctx.branch) && create_if_block_4$1(ctx);

    	return {
    		c: function create() {
    			blockquote = element("blockquote");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			add_location(blockquote, file$d, 244, 12, 6884);
    		},

    		m: function mount(target, anchor) {
    			insert(target, blockquote, anchor);
    			if (if_block0) if_block0.m(blockquote, null);
    			append(blockquote, t0);
    			if (if_block1) if_block1.m(blockquote, null);
    			append(blockquote, t1);
    			if (if_block2) if_block2.m(blockquote, null);
    		},

    		p: function update(changed, ctx) {
    			if (ctx.channel) {
    				if (if_block0) {
    					if_block0.p(changed, ctx);
    				} else {
    					if_block0 = create_if_block_6$1(ctx);
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
    					if_block1 = create_if_block_5$1(ctx);
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
    					if_block2 = create_if_block_4$1(ctx);
    					if_block2.c();
    					if_block2.m(blockquote, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(blockquote);
    			}

    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    		}
    	};
    }

    // (246:14) {#if channel}
    function create_if_block_6$1(ctx) {
    	var p, b, t1, t2_value = ctx.channel.startsWith('#') ? ctx.channel.slice(1) : ctx.channel, t2;

    	return {
    		c: function create() {
    			p = element("p");
    			b = element("b");
    			b.textContent = "Channel:";
    			t1 = space();
    			t2 = text(t2_value);
    			add_location(b, file$d, 247, 18, 6966);
    			add_location(p, file$d, 246, 16, 6943);
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

    // (252:14) {#if root}
    function create_if_block_5$1(ctx) {
    	var p, b, t1, t2;

    	return {
    		c: function create() {
    			p = element("p");
    			b = element("b");
    			b.textContent = "Root:";
    			t1 = space();
    			t2 = text(ctx.root);
    			add_location(b, file$d, 253, 18, 7166);
    			add_location(p, file$d, 252, 16, 7143);
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

    // (258:14) {#if branch}
    function create_if_block_4$1(ctx) {
    	var p, b, t1, t2;

    	return {
    		c: function create() {
    			p = element("p");
    			b = element("b");
    			b.textContent = "In Reply To:";
    			t1 = space();
    			t2 = text(ctx.branch);
    			add_location(b, file$d, 259, 18, 7317);
    			add_location(p, file$d, 258, 16, 7294);
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

    // (206:10) {#if branch}
    function create_if_block_2$3(ctx) {
    	var label, t_1, input, dispose;

    	return {
    		c: function create() {
    			label = element("label");
    			label.textContent = "In reply to";
    			t_1 = space();
    			input = element("input");
    			label.className = "form-label";
    			label.htmlFor = "reply-to";
    			add_location(label, file$d, 206, 12, 5456);
    			input.className = "form-input";
    			attr(input, "type", "text");
    			input.id = "reply-to";
    			input.placeholder = "in reply to";
    			add_location(input, file$d, 207, 12, 5530);
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

    // (216:10) {#if replyfeed}
    function create_if_block_1$5(ctx) {
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
    			add_location(span, file$d, 217, 14, 5799);
    			div.className = "mt-2";
    			add_location(div, file$d, 216, 12, 5765);
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

    function create_fragment$d(ctx) {
    	var div2, div1, div0, t0, t1, current_block_type_index, if_block2, current;

    	var if_block0 = (ctx.fork) && create_if_block_9(ctx);

    	var if_block1 = (ctx.msg) && create_if_block_7(ctx);

    	var if_block_creators = [
    		create_if_block$6,
    		create_else_block$5
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
    			add_location(div0, file$d, 177, 4, 4553);
    			div1.className = "columns";
    			add_location(div1, file$d, 176, 2, 4526);
    			div2.className = "container";
    			add_location(div2, file$d, 175, 0, 4499);
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
    					if_block0 = create_if_block_9(ctx);
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
    					if_block1 = create_if_block_7(ctx);
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

      document.title = `Patchfox - compose`;

      onMount(() => {
        $$invalidate('error', error = false);
        $$invalidate('msg', msg = "");

        // this code could be in some better/smarter place.
        // e.dataTransfer.getData('url'); from images in the browser window

        ondrop(document.getElementById("content"), files => readFileAndAttach(files));
      });

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
            $$invalidate('msg', msg = await ssb.newPost({ text: content, channel, root, branch, fork }));
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

      const attachFile = ev => {
        const files = ev.target.files;
        readFileAndAttach(files);
      };

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
    		post,
    		preview,
    		avatarClick,
    		dragOver,
    		dragLeave,
    		attachFileTrigger,
    		attachFile,
    		ssb,
    		encodeURIComponent,
    		input0_input_handler,
    		input_input_handler,
    		textarea_input_handler,
    		click_handler
    	};
    }

    class Compose extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
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

    // (35:0) {#if error}
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
    			add_location(a, file$e, 37, 4, 842);
    			div.className = "toast toast-error";
    			add_location(div, file$e, 35, 2, 780);
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

    // (44:0) {:else}
    function create_else_block$6(ctx) {
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

    // (42:0) {#if !msgs && !error}
    function create_if_block$7(ctx) {
    	var div;

    	return {
    		c: function create() {
    			div = element("div");
    			div.className = "loading loading-lg";
    			add_location(div, file$e, 42, 2, 946);
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

    // (45:2) {#each msgs as msg (msg.key)}
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
    		create_else_block$6
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
    			add_location(small, file$e, 31, 4, 702);
    			add_location(h4, file$e, 29, 2, 680);
    			div.className = "container";
    			add_location(div, file$e, 28, 0, 653);
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

    // (176:2) {:catch n}
    function create_catch_block_1(ctx) {
    	var p, t0, t1_value = ctx.n.message, t1;

    	return {
    		c: function create() {
    			p = element("p");
    			t0 = text("Error: ");
    			t1 = text(t1_value);
    			add_location(p, file$f, 176, 4, 4209);
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

    // (108:2) {:then}
    function create_then_block(ctx) {
    	var div3, div1, div0, img, img_src_value, t0, div2, h1, t1, t2, t3, p, raw_value = ctx.ssb.markdown(ctx.description), t4, div4, promise, current;

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
    			if (if_block) if_block.c();
    			t3 = space();
    			p = element("p");
    			t4 = space();
    			div4 = element("div");

    			info.block.c();
    			img.className = "img-responsive";
    			img.src = img_src_value = "http://localhost:8989/blobs/get/" + ctx.image;
    			img.alt = ctx.feed;
    			add_location(img, file$f, 112, 10, 2413);
    			div0.className = "container";
    			add_location(div0, file$f, 111, 8, 2379);
    			div1.className = "column col-6";
    			add_location(div1, file$f, 110, 6, 2344);
    			add_location(h1, file$f, 119, 8, 2606);
    			add_location(p, file$f, 144, 8, 3438);
    			div2.className = "column col-6";
    			add_location(div2, file$f, 118, 6, 2571);
    			div3.className = "columns";
    			add_location(div3, file$f, 108, 4, 2315);
    			add_location(div4, file$f, 150, 4, 3528);
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
    			if (if_block) if_block.m(div2, null);
    			append(div2, t3);
    			append(div2, p);
    			p.innerHTML = raw_value;
    			insert(target, t4, anchor);
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

    			if (ctx.feed !== ctx.ssb.feed) {
    				if (if_block) {
    					if_block.p(changed, ctx);
    				} else {
    					if_block = create_if_block$8(ctx);
    					if_block.c();
    					if_block.m(div2, t3);
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
    				detach(t4);
    				detach(div4);
    			}

    			info.block.d();
    			info = null;
    		}
    	};
    }

    // (121:8) {#if feed !== ssb.feed}
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
    			t2 = text("\n                following");
    			t3 = space();
    			label1 = element("label");
    			input1 = element("input");
    			t4 = space();
    			i1 = element("i");
    			t5 = text("\n                blocking");
    			t6 = space();
    			div2 = element("div");
    			div0.className = "divider";
    			add_location(div0, file$f, 122, 12, 2700);
    			attr(input0, "type", "checkbox");
    			add_location(input0, file$f, 125, 16, 2831);
    			i0.className = "form-icon";
    			add_location(i0, file$f, 129, 16, 2981);
    			label0.className = "form-switch form-inline";
    			add_location(label0, file$f, 124, 14, 2775);
    			attr(input1, "type", "checkbox");
    			add_location(input1, file$f, 133, 16, 3124);
    			i1.className = "form-icon";
    			add_location(i1, file$f, 137, 16, 3272);
    			label1.className = "form-switch form-inline";
    			add_location(label1, file$f, 132, 14, 3068);
    			div1.className = "form-group";
    			add_location(div1, file$f, 123, 12, 2736);
    			div2.className = "divider";
    			add_location(div2, file$f, 141, 12, 3375);
    			div3.className = "container";
    			add_location(div3, file$f, 121, 10, 2664);

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

    // (170:6) {:catch n}
    function create_catch_block(ctx) {
    	var p, t0, t1_value = ctx.n.message, t1;

    	return {
    		c: function create() {
    			p = element("p");
    			t0 = text("Error fetching messages: ");
    			t1 = text(t1_value);
    			add_location(p, file$f, 170, 8, 4120);
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

    // (154:6) {:then data}
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
    			add_location(div, file$f, 165, 14, 4000);
    			a.href = "#/public";
    			add_location(a, file$f, 160, 12, 3797);
    			li.className = "page-item page-next";
    			add_location(li, file$f, 159, 10, 3752);
    			ul.className = "pagination";
    			add_location(ul, file$f, 157, 8, 3717);
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

    // (155:8) {#each lastMsgs as msg (msg.key)}
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

    // (152:29)          <div class="loading" />       {:then data}
    function create_pending_block_1(ctx) {
    	var div;

    	return {
    		c: function create() {
    			div = element("div");
    			div.className = "loading";
    			add_location(div, file$f, 152, 8, 3572);
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

    // (106:40)      <div class="loading loading-lg" />   {:then}
    function create_pending_block(ctx) {
    	var div;

    	return {
    		c: function create() {
    			div = element("div");
    			div.className = "loading loading-lg";
    			add_location(div, file$f, 106, 4, 2266);
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
    			add_location(div, file$f, 104, 0, 2197);
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
            },
            10
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
    	                loadMoreMessages(lastMsgs[lastMsgs.length - 1].timestamp);
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

    // (50:2) {#if toast}
    function create_if_block_1$7(ctx) {
    	var div, t, div_class_value;

    	return {
    		c: function create() {
    			div = element("div");
    			t = text(ctx.msg);
    			div.className = div_class_value = "toast " + ctx.toastClass;
    			add_location(div, file$g, 50, 4, 1182);
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

    // (59:4) {#if cta}
    function create_if_block$9(ctx) {
    	var li, a, t_value = ctx.cta.label, t, dispose;

    	return {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t = text(t_value);
    			a.href = "#";
    			add_location(a, file$g, 60, 8, 1408);
    			add_location(li, file$g, 59, 6, 1394);
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
    			add_location(h1, file$g, 48, 2, 1118);
    			add_location(h4, file$g, 52, 2, 1238);
    			add_location(code, file$g, 54, 4, 1304);
    			pre.className = "code";
    			add_location(pre, file$g, 53, 2, 1280);
    			add_location(p, file$g, 56, 2, 1338);
    			a0.href = "/docs/index.html#/troubleshooting/";
    			a0.target = "_blank";
    			add_location(a0, file$g, 66, 6, 1553);
    			add_location(li0, file$g, 65, 4, 1541);
    			a1.href = "https://github.com/soapdog/patchfox/issues";
    			a1.target = "_blank";
    			add_location(a1, file$g, 71, 6, 1704);
    			add_location(li1, file$g, 70, 4, 1692);
    			add_location(ul, file$g, 57, 2, 1367);
    			div.className = "container";
    			add_location(div, file$g, 47, 0, 1091);
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

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.c = list[i];
    	return child_ctx;
    }

    // (69:0) {:else}
    function create_else_block$7(ctx) {
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
    		return create_else_block$7;
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
    		init(this, options, instance$g, create_fragment$h, safe_not_equal, []);
    	}
    }

    /* src\views\Channel.svelte generated by Svelte v3.4.4 */

    const file$i = "src\\views\\Channel.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.msg = list[i];
    	return child_ctx;
    }

    // (84:0) {#if error}
    function create_if_block_1$8(ctx) {
    	var div, t0, t1;

    	return {
    		c: function create() {
    			div = element("div");
    			t0 = text("Error: ");
    			t1 = text(ctx.error);
    			div.className = "toast toast-error";
    			add_location(div, file$i, 84, 2, 1980);
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

    // (89:0) {:else}
    function create_else_block$8(ctx) {
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
    			add_location(div0, file$i, 99, 8, 2396);
    			a0.href = "#/public";
    			add_location(a0, file$i, 96, 6, 2286);
    			li0.className = "page-item page-previous";
    			add_location(li0, file$i, 95, 4, 2242);
    			div1.className = "page-item-subtitle";
    			add_location(div1, file$i, 111, 8, 2780);
    			a1.href = "#/public";
    			add_location(a1, file$i, 103, 6, 2511);
    			li1.className = "page-item page-next";
    			add_location(li1, file$i, 102, 4, 2471);
    			ul.className = "pagination";
    			add_location(ul, file$i, 94, 2, 2213);

    			dispose = [
    				listen(a0, "click", stop_propagation(prevent_default(ctx.click_handler))),
    				listen(a1, "click", stop_propagation(prevent_default(ctx.click_handler_1)))
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

    // (87:0) {#if !msgs}
    function create_if_block$b(ctx) {
    	var div;

    	return {
    		c: function create() {
    			div = element("div");
    			div.className = "loading loading-lg";
    			add_location(div, file$i, 87, 2, 2055);
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

    // (92:2) {:else}
    function create_else_block_1$4(ctx) {
    	var p;

    	return {
    		c: function create() {
    			p = element("p");
    			p.textContent = "No messages.";
    			add_location(p, file$i, 92, 4, 2179);
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

    // (90:2) {#each msgs as msg (msg.key)}
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
    	var div2, div1, h4, t0, t1, t2, div0, label, input, t3, i, t4, t5, t6, current_block_type_index, if_block1, if_block1_anchor, current, dispose;

    	var if_block0 = (ctx.error) && create_if_block_1$8(ctx);

    	var if_block_creators = [
    		create_if_block$b,
    		create_else_block$8
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
    			t0 = text("Channel: #");
    			t1 = text(ctx.channel);
    			t2 = space();
    			div0 = element("div");
    			label = element("label");
    			input = element("input");
    			t3 = space();
    			i = element("i");
    			t4 = text("\r\n        Subscribe");
    			t5 = space();
    			if (if_block0) if_block0.c();
    			t6 = space();
    			if_block1.c();
    			if_block1_anchor = empty();
    			h4.className = "column";
    			add_location(h4, file$i, 73, 4, 1656);
    			attr(input, "type", "checkbox");
    			add_location(input, file$i, 76, 8, 1782);
    			i.className = "form-icon";
    			add_location(i, file$i, 77, 8, 1875);
    			label.className = "form-switch float-right";
    			add_location(label, file$i, 75, 6, 1733);
    			div0.className = "column";
    			add_location(div0, file$i, 74, 4, 1705);
    			div1.className = "columns";
    			add_location(div1, file$i, 72, 2, 1629);
    			div2.className = "container";
    			add_location(div2, file$i, 71, 0, 1602);

    			dispose = [
    				listen(input, "change", ctx.input_change_handler),
    				listen(input, "change", ctx.subscriptionChanged)
    			];
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div2, anchor);
    			append(div2, div1);
    			append(div1, h4);
    			append(h4, t0);
    			append(h4, t1);
    			append(div1, t2);
    			append(div1, div0);
    			append(div0, label);
    			append(label, input);

    			input.checked = ctx.subscribed;

    			append(label, t3);
    			append(label, i);
    			append(label, t4);
    			insert(target, t5, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert(target, t6, anchor);
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
    					if_block0.m(t6.parentNode, t6);
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
    				detach(t5);
    			}

    			if (if_block0) if_block0.d(detaching);

    			if (detaching) {
    				detach(t6);
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
        limit: $routeParams.limit || 10,
        reverse: true
      };

      ssb.channelSubscribed(channel)
        .then(s => { const $$result = subscribed = s; $$invalidate('subscribed', subscribed); return $$result; });

      const subscriptionChanged = ev => {
        let v = ev.target.checked;
        if (v) {
          ssb
            .channelSubscribe(channel)
            .catch(() => { const $$result = (subscribed = false); $$invalidate('subscribed', subscribed); return $$result; });
        } else {
          ssb
            .channelUnsubscribe(channel)
            .catch(() => { const $$result = (subscribed = true); $$invalidate('subscribed', subscribed); return $$result; });
        }
      };

    	function input_change_handler() {
    		subscribed = this.checked;
    		$$invalidate('subscribed', subscribed);
    	}

    	function click_handler() {
    		return history.back();
    	}

    	function click_handler_1() {
    		return navigate('/channel', {
    	            channel,
    	            lt: msgs[msgs.length - 1].rts,
    	            limit: opts.limit,
    	            onlyRoots: opts.onlyRoots
    	          });
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
    		opts,
    		subscriptionChanged,
    		input_change_handler,
    		click_handler,
    		click_handler_1
    	};
    }

    class Channel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$i, safe_not_equal, []);
    	}
    }

    /* src\views\Settings.svelte generated by Svelte v3.4.4 */

    const file$j = "src\\views\\Settings.svelte";

    function create_fragment$j(ctx) {
    	var h1, t1, p0, t2, i0, t4, t5, p1, b0, t6, i1, t8, a0, t10, t11, h40, t13, form0, label0, t14, i2, t16, i3, t18, code, t20, t21, input0, t22, label1, t24, input1, t25, label2, t27, textarea, t28, br0, t29, button, t31, p2, t33, h41, t35, form1, label3, t37, input2, t38, br1, t39, span, t40, a1, t41, i4, t43, label4, input3, t44, i5, t45, b1, t47, t48, label5, input4, t49, i6, t50, b2, t52, t53, label6, input5, t54, i7, t55, b3, t57, t58, label7, input6, t59, i8, t60, b4, t62, t63, label8, input7, t64, i9, t65, b5, t67, t68, label9, input8, t69, i10, t70, b6, t72, t73, label10, input9, t74, i11, t75, b7, t77, t78, label11, input10, t79, i12, t80, b8, t82, t83, div, t84, label12, input11, t85, i13, t86, b9, t88, t89, br2, t90, label13, t92, label14, input12, t93, i14, t94, t95, label15, input13, t96, i15, t97, t98, br3, t99, br4, dispose;

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
    			button = element("button");
    			button.textContent = "Save Identity & Remote";
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
    			div = element("div");
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
    			br3 = element("br");
    			t99 = space();
    			br4 = element("br");
    			add_location(h1, file$j, 71, 0, 2106);
    			add_location(i0, file$j, 77, 2, 2388);
    			add_location(p0, file$j, 72, 0, 2125);
    			add_location(i1, file$j, 83, 4, 2500);
    			a0.href = "/docs/index.html#/troubleshooting/no-configuration";
    			a0.target = "_blank";
    			add_location(a0, file$j, 85, 4, 2552);
    			add_location(b0, file$j, 81, 2, 2443);
    			add_location(p1, file$j, 80, 0, 2436);
    			add_location(h40, file$j, 94, 0, 2757);
    			add_location(i2, file$j, 99, 4, 2914);
    			add_location(i3, file$j, 101, 4, 2942);
    			add_location(code, file$j, 103, 4, 2976);
    			label0.className = "form-label";
    			label0.htmlFor = "secret-file";
    			add_location(label0, file$j, 97, 2, 2820);
    			attr(input0, "type", "file");
    			input0.className = "form-input";
    			input0.id = "secret-file";
    			add_location(input0, file$j, 106, 2, 3076);
    			label1.className = "form-label";
    			label1.htmlFor = "remote";
    			add_location(label1, file$j, 111, 2, 3182);
    			input1.className = "form-input";
    			attr(input1, "type", "text");
    			input1.id = "remote";
    			input1.placeholder = "remote";
    			add_location(input1, file$j, 112, 2, 3239);
    			label2.className = "form-label";
    			label2.htmlFor = "secret";
    			add_location(label2, file$j, 119, 2, 3363);
    			textarea.className = "form-input";
    			textarea.id = "secret";
    			textarea.placeholder = "Your secret";
    			textarea.rows = "8";
    			add_location(textarea, file$j, 120, 2, 3420);
    			add_location(br0, file$j, 126, 2, 3545);
    			button.className = "btn btn-primary float-right";
    			add_location(button, file$j, 127, 2, 3555);
    			add_location(p2, file$j, 130, 2, 3673);
    			form0.className = "form-group";
    			add_location(form0, file$j, 96, 0, 2791);
    			add_location(h41, file$j, 133, 0, 3751);
    			label3.className = "form-label";
    			label3.htmlFor = "limit";
    			add_location(label3, file$j, 135, 2, 3810);
    			input2.className = "form-input";
    			attr(input2, "type", "number");
    			add_location(input2, file$j, 136, 2, 3877);
    			add_location(br1, file$j, 142, 2, 4006);
    			add_location(i4, file$j, 147, 6, 4182);
    			a1.target = "_blank";
    			a1.href = "/docs/index.html#/message_types/";
    			add_location(a1, file$j, 145, 4, 4070);
    			add_location(span, file$j, 143, 2, 4016);
    			attr(input3, "type", "checkbox");
    			add_location(input3, file$j, 151, 4, 4260);
    			i5.className = "form-icon";
    			add_location(i5, file$j, 157, 4, 4420);
    			add_location(b1, file$j, 158, 4, 4449);
    			label4.className = "form-switch";
    			add_location(label4, file$j, 150, 2, 4227);
    			attr(input4, "type", "checkbox");
    			add_location(input4, file$j, 162, 4, 4573);
    			i6.className = "form-icon";
    			add_location(i6, file$j, 168, 4, 4730);
    			add_location(b2, file$j, 169, 4, 4759);
    			label5.className = "form-switch";
    			add_location(label5, file$j, 161, 2, 4540);
    			attr(input5, "type", "checkbox");
    			add_location(input5, file$j, 173, 4, 4846);
    			i7.className = "form-icon";
    			add_location(i7, file$j, 179, 4, 5012);
    			add_location(b3, file$j, 180, 4, 5041);
    			label6.className = "form-switch";
    			add_location(label6, file$j, 172, 2, 4813);
    			attr(input6, "type", "checkbox");
    			add_location(input6, file$j, 184, 4, 5142);
    			i8.className = "form-icon";
    			add_location(i8, file$j, 190, 4, 5308);
    			add_location(b4, file$j, 191, 4, 5337);
    			label7.className = "form-switch";
    			add_location(label7, file$j, 183, 2, 5109);
    			attr(input7, "type", "checkbox");
    			add_location(input7, file$j, 195, 4, 5435);
    			i9.className = "form-icon";
    			add_location(i9, file$j, 201, 4, 5592);
    			add_location(b5, file$j, 202, 4, 5621);
    			label8.className = "form-switch";
    			add_location(label8, file$j, 194, 2, 5402);
    			attr(input8, "type", "checkbox");
    			add_location(input8, file$j, 206, 4, 5746);
    			i10.className = "form-icon";
    			add_location(i10, file$j, 212, 4, 5900);
    			add_location(b6, file$j, 213, 4, 5929);
    			label9.className = "form-switch";
    			add_location(label9, file$j, 205, 2, 5713);
    			attr(input9, "type", "checkbox");
    			add_location(input9, file$j, 218, 4, 6023);
    			i11.className = "form-icon";
    			add_location(i11, file$j, 224, 4, 6189);
    			add_location(b7, file$j, 225, 4, 6218);
    			label10.className = "form-switch";
    			add_location(label10, file$j, 217, 2, 5990);
    			attr(input10, "type", "checkbox");
    			add_location(input10, file$j, 231, 4, 6395);
    			i12.className = "form-icon";
    			add_location(i12, file$j, 237, 4, 6552);
    			add_location(b8, file$j, 238, 4, 6581);
    			label11.className = "form-switch";
    			add_location(label11, file$j, 230, 2, 6362);
    			div.className = "divider";
    			add_location(div, file$j, 241, 2, 6643);
    			attr(input11, "type", "checkbox");
    			add_location(input11, file$j, 243, 4, 6703);
    			i13.className = "form-icon";
    			add_location(i13, file$j, 249, 4, 6869);
    			add_location(b9, file$j, 250, 4, 6898);
    			label12.className = "form-switch";
    			add_location(label12, file$j, 242, 2, 6670);
    			add_location(br2, file$j, 253, 2, 6998);
    			label13.className = "form-label";
    			add_location(label13, file$j, 254, 2, 7008);
    			ctx.$$binding_groups[0].push(input12);
    			attr(input12, "type", "radio");
    			input12.name = "column-size";
    			input12.__value = "short";
    			input12.value = input12.__value;
    			add_location(input12, file$j, 261, 4, 7343);
    			i14.className = "form-icon";
    			add_location(i14, file$j, 267, 4, 7515);
    			label14.className = "form-radio";
    			add_location(label14, file$j, 260, 2, 7311);
    			ctx.$$binding_groups[0].push(input13);
    			attr(input13, "type", "radio");
    			input13.name = "column-size";
    			input13.__value = "long";
    			input13.value = input13.__value;
    			add_location(input13, file$j, 271, 4, 7604);
    			i15.className = "form-icon";
    			add_location(i15, file$j, 277, 4, 7775);
    			label15.className = "form-radio";
    			add_location(label15, file$j, 270, 2, 7572);
    			form1.className = "form-group";
    			add_location(form1, file$j, 134, 0, 3781);
    			add_location(br3, file$j, 281, 0, 7838);
    			add_location(br4, file$j, 282, 0, 7846);

    			dispose = [
    				listen(input0, "change", ctx.selectedFile),
    				listen(input1, "input", ctx.input1_input_handler),
    				listen(textarea, "input", ctx.textarea_input_handler),
    				listen(button, "click", ctx.saveConfiguration),
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
    				listen(input13, "change", ctx.change_handler_11)
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
    			append(form0, button);
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
    			append(form1, div);
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
    			insert(target, br3, anchor);
    			insert(target, t99, anchor);
    			insert(target, br4, anchor);
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

    			ctx.$$binding_groups[0].splice(ctx.$$binding_groups[0].indexOf(input12), 1);
    			ctx.$$binding_groups[0].splice(ctx.$$binding_groups[0].indexOf(input13), 1);

    			if (detaching) {
    				detach(t98);
    				detach(br3);
    				detach(t99);
    				detach(br4);
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
      let showTypeUnknown = getPref("showTypeUnknown", true);
      let showTypeAbout = getPref("showTypeAbout", true);
      let showTypeBlog = getPref("showTypeBlog", true);
      let showTypeChannel = getPref("showTypeChannel", true);
      let showTypeContact = getPref("showTypeContact", true);
      let showTypePost = getPref("showTypePost", true);
      let showTypePrivate = getPref("showTypePrivate", true);
      let showTypePub = getPref("showTypePub", true);
      let showTypeVote = getPref("showTypeVote", true);

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

    	const $$binding_groups = [[]];

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
    		saveConfiguration,
    		selectedFile,
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
    		$$binding_groups
    	};
    }

    class Settings extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$j, safe_not_equal, []);
    	}
    }

    /* src\views\Mentions.svelte generated by Svelte v3.4.4 */

    const file$k = "src\\views\\Mentions.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.msg = list[i];
    	return child_ctx;
    }

    // (117:0) {:else}
    function create_else_block$9(ctx) {
    	var each_blocks = [], each_1_lookup = new Map(), t0, ul, li0, a0, div0, t2, li1, a1, div1, current, dispose;

    	var each_value = ctx.msgs;

    	const get_key = ctx => ctx.msg.key;

    	for (var i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$5(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$5(key, child_ctx));
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
    			add_location(div0, file$k, 125, 8, 2896);
    			a0.href = "#/public";
    			add_location(a0, file$k, 122, 6, 2786);
    			li0.className = "page-item page-previous";
    			add_location(li0, file$k, 121, 4, 2742);
    			div1.className = "page-item-subtitle";
    			add_location(div1, file$k, 134, 8, 3189);
    			a1.href = "#/public";
    			add_location(a1, file$k, 129, 6, 3011);
    			li1.className = "page-item page-next";
    			add_location(li1, file$k, 128, 4, 2971);
    			ul.className = "pagination";
    			add_location(ul, file$k, 120, 2, 2713);

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
    			each_blocks = update_keyed_each(each_blocks, changed, get_key, 1, ctx, each_value, each_1_lookup, t0.parentNode, outro_and_destroy_block, create_each_block$5, t0, get_each_context$5);
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

    // (115:0) {#if msgs.length === 0}
    function create_if_block$c(ctx) {
    	var div;

    	return {
    		c: function create() {
    			div = element("div");
    			div.className = "loading loading-lg";
    			add_location(div, file$k, 115, 2, 2591);
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

    // (118:2) {#each msgs as msg (msg.key)}
    function create_each_block$5(key_1, ctx) {
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
    		create_if_block$c,
    		create_else_block$9
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
    			add_location(h4, file$k, 110, 4, 2484);
    			div0.className = "column";
    			add_location(div0, file$k, 111, 4, 2522);
    			div1.className = "columns";
    			add_location(div1, file$k, 109, 2, 2457);
    			div2.className = "container";
    			add_location(div2, file$k, 108, 0, 2430);
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
          live: true,
          reverse: true,
          limit: getPref("limit", "10")
        });
      };

      const uniqueRoots = msg => {
        return pull.filter(msg => {
          let msgKey = msg.key;
          if (msg.value.content.type !== "post") {
            return true;
          }
          let rootKey = msg.value.content.root || false;
          if (rootKey) {
            if (msgs.some(m => m.value.content.root === rootKey)) {
              return false;
            }
          }
          return true;
        });
      };

      const mentionUser = msg => {
        return pull.filter(msg => {
          if (msg.value.content.type !== "post") {
            return true;
          }
          let mentions = msg.value.content.mentions || [];
          if (mentions.some(m => m.link == sbot.id)) {
            return true;
          }
          return false;
        });
      };

      const loadMentions = () => {
        console.log("Loading mentions...", lt);
        window.scrollTo(0,0);
        $$invalidate('msgs', msgs = []);
        pull(
          createBacklinkStream(sbot.id),
          pull.filter(msg => !msg.sync),
          // note the 'live' style streams emit { sync: true } when they're up to date!
          uniqueRoots(),
          mentionUser(),
          pull.drain(msg => {
            msgs.push(msg);
            $$invalidate('msgs', msgs);
          })
        );
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
    	          navigate('/mentions', { lt:  msgs[msgs.length - 1].rts });
    	        }

    	return { msgs, click_handler, click_handler_1 };
    }

    class Mentions extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
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

    const loadConfiguration = async () => {
      console.log("Loading configuration...");
      try {
        let data = await browser.storage.local.get();

        if (data.hasOwnProperty("keys")) {
          savedData = data;
        } else {
          throw "Configuration is missing"
        }
      } catch (n) {
        throw "Configuration is missing"
      }
    };

    const connect = async () => {
      console.log("Connecting to sbot...");
      window.ssb = new DriverHermiebox();

      try {
        await ssb.connect(savedData.keys);
        connected.set(true);
      } catch (err) {
        console.error("can't connect", err);
        connected.set(false);
        throw "Can't connect to sbot"
      }
    };

    const reconnect = () => {
      return new Promise((resolve, reject) => {
        const tryConnect = (data) => {
          window.ssb = new DriverHermiebox();

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

    const keepPinging = () => {
      let interval = setInterval(() => {
        if (hermiebox.sbot) {
          hermiebox.sbot.whoami((err, v) => {
            if (err) {
              console.error("can't call whoami", err);
              reconnect().catch(n => {
                console.error("can't reconnect");
                clearInterval(interval);
                navigate("/error", { error: n });
              });
            }
          });
        }
      }, 5000);
    };

    // Preferences

    const getPref = (key, defaultValue) => {
      if (savedData.hasOwnProperty("preferences")) {
        let preferences = savedData.preferences;
        if (preferences.hasOwnProperty(key)) {
          console.log(`getPref - ${key}`, preferences[key]);
          return preferences[key]
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
      console.log(`setPref - ${key}`, value);
      savedData.preferences = savedData.preferences || {};
      savedData.preferences[key] = value;

      browser.storage.local.set(savedData);
    };

    /* src\Navigation.svelte generated by Svelte v3.4.4 */

    const file$l = "src\\Navigation.svelte";

    function create_fragment$l(ctx) {
    	var header, section0, a0, i0, t0, a1, figure0, img0, t1, i1, i1_class_value, t2, a2, t4, a3, t6, a4, t8, a5, t10, a6, t12, a7, t14, section1, button, i2, t15, a8, figure1, img1, t16, i3, i3_class_value, t17, div0, a9, t18, i4, t19, ul, li0, a10, t21, li1, a11, t23, li2, a12, t25, li3, a13, t27, li4, a14, t29, div1, dispose;

    	return {
    		c: function create() {
    			header = element("header");
    			section0 = element("section");
    			a0 = element("a");
    			i0 = element("i");
    			t0 = space();
    			a1 = element("a");
    			figure0 = element("figure");
    			img0 = element("img");
    			t1 = space();
    			i1 = element("i");
    			t2 = space();
    			a2 = element("a");
    			a2.textContent = "Compose";
    			t4 = space();
    			a3 = element("a");
    			a3.textContent = "Public";
    			t6 = space();
    			a4 = element("a");
    			a4.textContent = "Mentions";
    			t8 = space();
    			a5 = element("a");
    			a5.textContent = "Channels";
    			t10 = space();
    			a6 = element("a");
    			a6.textContent = "Settings";
    			t12 = space();
    			a7 = element("a");
    			a7.textContent = "Help";
    			t14 = space();
    			section1 = element("section");
    			button = element("button");
    			i2 = element("i");
    			t15 = space();
    			a8 = element("a");
    			figure1 = element("figure");
    			img1 = element("img");
    			t16 = space();
    			i3 = element("i");
    			t17 = space();
    			div0 = element("div");
    			a9 = element("a");
    			t18 = text("Menu\r\n        ");
    			i4 = element("i");
    			t19 = space();
    			ul = element("ul");
    			li0 = element("li");
    			a10 = element("a");
    			a10.textContent = "New";
    			t21 = space();
    			li1 = element("li");
    			a11 = element("a");
    			a11.textContent = "Public";
    			t23 = space();
    			li2 = element("li");
    			a12 = element("a");
    			a12.textContent = "Settings";
    			t25 = space();
    			li3 = element("li");
    			a13 = element("a");
    			a13.textContent = "Help";
    			t27 = space();
    			li4 = element("li");
    			a14 = element("a");
    			a14.textContent = "Open as a Tab";
    			t29 = space();
    			div1 = element("div");
    			i0.className = "icon icon-minus text-black";
    			add_location(i0, file$l, 65, 6, 1601);
    			a0.href = "#/sidebar";
    			a0.className = "btn btn-link";
    			add_location(a0, file$l, 64, 4, 1529);
    			img0.src = ctx.avatar;
    			img0.alt = "L";
    			add_location(img0, file$l, 69, 8, 1775);
    			i1.className = i1_class_value = "avatar-presence " + (ctx.$connected ? 'online' : 'offline') + " svelte-14egiim";
    			add_location(i1, file$l, 70, 8, 1813);
    			figure0.className = "avatar avatar-lg";
    			add_location(figure0, file$l, 68, 6, 1732);
    			a1.href = "#";
    			a1.className = "navbar-brand mr-2 p-1";
    			add_location(a1, file$l, 67, 4, 1657);
    			a2.href = "#/compose";
    			a2.className = "btn btn-link";
    			add_location(a2, file$l, 73, 4, 1911);
    			a3.href = "#/public";
    			a3.className = "btn btn-link";
    			add_location(a3, file$l, 79, 4, 2056);
    			a4.href = "#/mentions";
    			a4.className = "btn btn-link";
    			add_location(a4, file$l, 85, 4, 2198);
    			a5.href = "#/channels";
    			a5.className = "btn btn-link";
    			add_location(a5, file$l, 91, 4, 2346);
    			a6.href = "#/settings";
    			a6.className = "btn btn-link";
    			add_location(a6, file$l, 97, 4, 2495);
    			a7.href = "/docs/index.html";
    			a7.className = "btn btn-link";
    			add_location(a7, file$l, 98, 4, 2577);
    			section0.className = "navbar-section hide-sm";
    			add_location(section0, file$l, 63, 2, 1483);
    			i2.className = "icon icon-back";
    			add_location(i2, file$l, 102, 6, 2780);
    			button.className = "btn btn-link";
    			add_location(button, file$l, 101, 4, 2711);
    			img1.src = ctx.avatar;
    			img1.alt = "L";
    			add_location(img1, file$l, 106, 8, 2914);
    			i3.className = i3_class_value = "avatar-presence " + (ctx.$connected ? 'online' : 'offline') + " svelte-14egiim";
    			add_location(i3, file$l, 107, 8, 2952);
    			figure1.className = "avatar";
    			add_location(figure1, file$l, 105, 6, 2881);
    			a8.href = "...";
    			a8.className = "navbar-brand mr-2 p-1";
    			add_location(a8, file$l, 104, 4, 2829);
    			i4.className = "icon icon-caret";
    			add_location(i4, file$l, 117, 8, 3265);
    			a9.href = "?";
    			a9.className = "btn btn-link dropdown-toggle";
    			a9.tabIndex = "0";
    			add_location(a9, file$l, 111, 6, 3092);
    			a10.href = "#/compose";
    			a10.className = "btn btn-link";
    			add_location(a10, file$l, 122, 10, 3406);
    			li0.className = "menu-item";
    			add_location(li0, file$l, 121, 8, 3372);
    			a11.href = "#/public";
    			a11.className = "btn btn-link";
    			add_location(a11, file$l, 130, 10, 3630);
    			li1.className = "menu-item";
    			add_location(li1, file$l, 129, 8, 3596);
    			a12.href = "#/settings";
    			a12.className = "btn btn-link";
    			add_location(a12, file$l, 138, 10, 3855);
    			li2.className = "menu-item";
    			add_location(li2, file$l, 137, 8, 3821);
    			a13.href = "/docs/index.html";
    			a13.className = "btn btn-link";
    			add_location(a13, file$l, 143, 10, 4016);
    			li3.className = "menu-item";
    			add_location(li3, file$l, 142, 8, 3982);
    			a14.href = "#/sidebar";
    			a14.className = "btn btn-link";
    			add_location(a14, file$l, 146, 10, 4131);
    			li4.className = "menu-item";
    			add_location(li4, file$l, 145, 8, 4097);
    			ul.className = "menu";
    			add_location(ul, file$l, 120, 6, 3345);
    			div0.className = "dropdown float-right";
    			add_location(div0, file$l, 110, 4, 3050);
    			section1.className = "navbar-section show-sm bg-gray above svelte-14egiim";
    			add_location(section1, file$l, 100, 2, 2651);
    			div1.className = "blocker show-sm svelte-14egiim";
    			add_location(div1, file$l, 153, 2, 4297);
    			header.className = "navbar";
    			add_location(header, file$l, 62, 0, 1456);

    			dispose = [
    				listen(a0, "click", ctx.openSidebar),
    				listen(a1, "click", ctx.openMyProfile),
    				listen(a2, "click", stop_propagation(prevent_default(ctx.goCompose))),
    				listen(a3, "click", stop_propagation(prevent_default(ctx.goPublic))),
    				listen(a4, "click", stop_propagation(prevent_default(ctx.goMentions))),
    				listen(a5, "click", stop_propagation(prevent_default(ctx.goChannels))),
    				listen(a6, "click", ctx.goSettings),
    				listen(button, "click", ctx.click_handler),
    				listen(a9, "click", stop_propagation(prevent_default(click_handler_1))),
    				listen(a10, "click", stop_propagation(prevent_default(ctx.goCompose))),
    				listen(a11, "click", stop_propagation(prevent_default(ctx.goPublic))),
    				listen(a12, "click", ctx.goSettings),
    				listen(a14, "click", ctx.closeSidebar)
    			];
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, header, anchor);
    			append(header, section0);
    			append(section0, a0);
    			append(a0, i0);
    			append(section0, t0);
    			append(section0, a1);
    			append(a1, figure0);
    			append(figure0, img0);
    			append(figure0, t1);
    			append(figure0, i1);
    			append(section0, t2);
    			append(section0, a2);
    			append(section0, t4);
    			append(section0, a3);
    			append(section0, t6);
    			append(section0, a4);
    			append(section0, t8);
    			append(section0, a5);
    			append(section0, t10);
    			append(section0, a6);
    			append(section0, t12);
    			append(section0, a7);
    			append(header, t14);
    			append(header, section1);
    			append(section1, button);
    			append(button, i2);
    			append(section1, t15);
    			append(section1, a8);
    			append(a8, figure1);
    			append(figure1, img1);
    			append(figure1, t16);
    			append(figure1, i3);
    			append(section1, t17);
    			append(section1, div0);
    			append(div0, a9);
    			append(a9, t18);
    			append(a9, i4);
    			append(div0, t19);
    			append(div0, ul);
    			append(ul, li0);
    			append(li0, a10);
    			append(ul, t21);
    			append(ul, li1);
    			append(li1, a11);
    			append(ul, t23);
    			append(ul, li2);
    			append(li2, a12);
    			append(ul, t25);
    			append(ul, li3);
    			append(li3, a13);
    			append(ul, t27);
    			append(ul, li4);
    			append(li4, a14);
    			append(header, t29);
    			append(header, div1);
    		},

    		p: function update(changed, ctx) {
    			if (changed.avatar) {
    				img0.src = ctx.avatar;
    			}

    			if ((changed.$connected) && i1_class_value !== (i1_class_value = "avatar-presence " + (ctx.$connected ? 'online' : 'offline') + " svelte-14egiim")) {
    				i1.className = i1_class_value;
    			}

    			if (changed.avatar) {
    				img1.src = ctx.avatar;
    			}

    			if ((changed.$connected) && i3_class_value !== (i3_class_value = "avatar-presence " + (ctx.$connected ? 'online' : 'offline') + " svelte-14egiim")) {
    				i3.className = i3_class_value;
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(header);
    			}

    			run_all(dispose);
    		}
    	};
    }

    function click_handler_1() {
    	return '';
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let $connected;

    	validate_store(connected, 'connected');
    	subscribe($$self, connected, $$value => { $connected = $$value; $$invalidate('$connected', $connected); });

    	let avatar = "/images/icon.png";

      const goSettings = ev => navigate("/settings");
      const goCompose = () => navigate("/compose");
      const goPublic = () => navigate("/public");
      const goChannels = () => navigate("/channels");
      const goMentions = () => navigate("/mentions");

      const openSidebar = async ev => {
        let loc = window.location.href;
        browser.sidebarAction.setPanel({ panel: loc });
        browser.sidebarAction.open();
        let tab = await browser.tabs.getCurrent();
        await browser.tabs.remove(tab.id);
      };

      const closeSidebar = async ev => {
        let loc = await browser.sidebarAction.getPanel({});
        await browser.tabs.create({ url: loc });
        await browser.sidebarAction.close();
      };

      const openMyProfile = ev => {
        ev.stopPropagation();
        ev.preventDefault();

        if (ssb.feed) {
          navigate("/profile", { feed: ssb.feed });
        }
      };

    	function click_handler() {
    		return history.back();
    	}

    	$$self.$$.update = ($$dirty = { $connected: 1 }) => {
    		if ($$dirty.$connected) { if ($connected) {
            ssb.avatar(ssb.feed).then(data => {
              $$invalidate('avatar', avatar = `http://localhost:8989/blobs/get/${data.image}`);
            });
          } }
    	};

    	return {
    		avatar,
    		goSettings,
    		goCompose,
    		goPublic,
    		goChannels,
    		goMentions,
    		openSidebar,
    		closeSidebar,
    		openMyProfile,
    		$connected,
    		click_handler
    	};
    }

    class Navigation extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$l, safe_not_equal, []);
    	}
    }

    /* src\Patchfox.svelte generated by Svelte v3.4.4 */

    const file$m = "src\\Patchfox.svelte";

    function create_fragment$m(ctx) {
    	var div2, div1, div0, t, current, dispose;

    	var navigation = new Navigation({ $$inline: true });

    	var switch_value = ctx.$currentView;

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props(ctx));
    	}

    	return {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			navigation.$$.fragment.c();
    			t = space();
    			if (switch_instance) switch_instance.$$.fragment.c();
    			div0.className = "column svelte-64hhw0";
    			toggle_class(div0, "reduced-line-length", ctx.useShortColumn);
    			add_location(div0, file$m, 70, 4, 1650);
    			div1.className = "columns";
    			add_location(div1, file$m, 69, 2, 1623);
    			div2.className = "container bg-gray";
    			add_location(div2, file$m, 68, 0, 1588);

    			dispose = [
    				listen(window, "popstate", ctx.popState),
    				listen(window, "error", ctx.handleUncaughtException),
    				listen(window, "hashchange", ctx.hashChange)
    			];
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div2, anchor);
    			append(div2, div1);
    			append(div1, div0);
    			mount_component(navigation, div0, null);
    			append(div0, t);

    			if (switch_instance) {
    				mount_component(switch_instance, div0, null);
    			}

    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (switch_value !== (switch_value = ctx.$currentView)) {
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
    					mount_component(switch_instance, div0, null);
    				} else {
    					switch_instance = null;
    				}
    			}

    			if (changed.useShortColumn) {
    				toggle_class(div0, "reduced-line-length", ctx.useShortColumn);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			navigation.$$.fragment.i(local);

    			if (switch_instance) switch_instance.$$.fragment.i(local);

    			current = true;
    		},

    		o: function outro(local) {
    			navigation.$$.fragment.o(local);
    			if (switch_instance) switch_instance.$$.fragment.o(local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div2);
    			}

    			navigation.$destroy();

    			if (switch_instance) switch_instance.$destroy();
    			run_all(dispose);
    		}
    	};
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let $routeLocation, $currentView;

    	validate_store(routeLocation, 'routeLocation');
    	subscribe($$self, routeLocation, $$value => { $routeLocation = $$value; $$invalidate('$routeLocation', $routeLocation); });
    	validate_store(currentView, 'currentView');
    	subscribe($$self, currentView, $$value => { $currentView = $$value; $$invalidate('$currentView', $currentView); });

    	

      let useShortColumn = getPref("columnSize", "short") == "short";

      onMount(async () => {
        try {
          await connect();

          keepPinging();
        } catch (n) {
          console.error("connect error", n);
          switch (n) {
            case "Can't connect to sbot":
              // need to be able to go to settings even though no connection is
              // established.
              if ($routeLocation !== "/settings") {
                window.location = "/docs/index.html#/troubleshooting/no-connection";
              }
              break;
            default:
              navigate("/error", { error: n });
              break;
          }
        }
      });

      const popState = event => {
        if (event.state !== null) {
          console.dir("pop", event.state);
          let { location, data } = event.state;
          route.set({ location, data });
        }
      };

      const handleUncaughtException = event => {
        console.error("Uncaught exception", event);
        navigate("/error", { error: event.message });
      };

      const hashChange = event => {
        console.dir("hash change", event);
      };

    	return {
    		useShortColumn,
    		popState,
    		handleUncaughtException,
    		hashChange,
    		$currentView
    	};
    }

    class Patchfox extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$m, safe_not_equal, []);
    	}
    }

    const main = async () => {
        window.ssb = false;

        try {
            await loadConfiguration();

        } catch (n) {
            console.error("initialization error", n);
            switch (n) {
                case "Configuration is missing":
                    navigate("/settings");
                    break
                default:
                    navigate("/error", { error: n });
                    break
            }

        }

        const patchfox = new Patchfox({
            target: document.body
        });

    };

    main();

}());
//# sourceMappingURL=bundle.js.map
