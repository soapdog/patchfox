var app = (function () {
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
        var user = await hermiebox.api.profile(feedid);
        console.log(user);
        return user
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
          const sbot = hermiebox.sbot || false;

          const msgToPost = schemas.post(text, root, branch, mentions, recps, channel);

          if (sbot) {
            sbot.publish(msgToPost, function (err, msg) {
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

    // (68:6) {#if msg.value.content.root}
    function create_if_block_1(ctx) {
    	var span, a, t, a_href_value, dispose;

    	return {
    		c: function create() {
    			span = element("span");
    			a = element("a");
    			t = text("(root)");
    			a.href = a_href_value = "?thread=" + encodeURIComponent(ctx.msg.value.content.root) + "#/thread";
    			add_location(a, file, 69, 10, 1674);
    			add_location(span, file, 68, 8, 1657);
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

    // (77:6) {#if msg.value.content.branch}
    function create_if_block(ctx) {
    	var span, a, t, a_href_value, dispose;

    	return {
    		c: function create() {
    			span = element("span");
    			a = element("a");
    			t = text("(in reply to)");
    			a.href = a_href_value = "?thread=" + encodeURIComponent(ctx.msg.value.content.branch) + "#/thread";
    			add_location(a, file, 78, 10, 1927);
    			add_location(span, file, 77, 8, 1910);
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
    	var div0, t0, div4, div3, div1, label, input, t1, i, t2, t3, t4, t5, div2, button, dispose;

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
    			t2 = text("\n        Like");
    			t3 = space();
    			if (if_block0) if_block0.c();
    			t4 = space();
    			if (if_block1) if_block1.c();
    			t5 = space();
    			div2 = element("div");
    			button = element("button");
    			button.textContent = "Reply";
    			div0.className = "card-body";
    			add_location(div0, file, 56, 0, 1295);
    			attr(input, "type", "checkbox");
    			input.checked = ctx.liked;
    			add_location(input, file, 63, 8, 1488);
    			i.className = "form-icon";
    			add_location(i, file, 64, 8, 1562);
    			label.className = "form-switch d-inline";
    			add_location(label, file, 62, 6, 1443);
    			div1.className = "column col-6";
    			add_location(div1, file, 61, 4, 1410);
    			button.className = "btn";
    			add_location(button, file, 87, 6, 2188);
    			div2.className = "column col-6 text-right";
    			add_location(div2, file, 86, 4, 2144);
    			div3.className = "columns col-gapless";
    			add_location(div3, file, 60, 2, 1372);
    			div4.className = "card-footer";
    			add_location(div4, file, 59, 0, 1344);

    			dispose = [
    				listen(input, "change", ctx.likeChanged),
    				listen(button, "click", ctx.reply)
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
    			append(div2, button);
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

      const reply = ev => {
        let rootId = msg.value.content.root || msg.key;
        let channel = msg.value.content.channel;
        let replyfeed = msg.value.author;
        navigate("/compose", { root: rootId, branch: msg.key, channel, replyfeed });
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

    // (87:0) {#if error}
    function create_if_block_1$4(ctx) {
    	var div, t0, t1;

    	return {
    		c: function create() {
    			div = element("div");
    			t0 = text("Error: ");
    			t1 = text(ctx.error);
    			div.className = "toast toast-error";
    			add_location(div, file$b, 87, 2, 2093);
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

    // (92:0) {:else}
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
    			add_location(div0, file$b, 100, 8, 2460);
    			a0.href = "#/public";
    			add_location(a0, file$b, 97, 6, 2353);
    			li0.className = "page-item page-previous";
    			add_location(li0, file$b, 96, 4, 2310);
    			div1.className = "page-item-subtitle";
    			add_location(div1, file$b, 111, 8, 2810);
    			a1.href = "#/public";
    			add_location(a1, file$b, 104, 6, 2571);
    			li1.className = "page-item page-next";
    			add_location(li1, file$b, 103, 4, 2532);
    			ul.className = "pagination";
    			add_location(ul, file$b, 95, 2, 2282);

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

    // (90:0) {#if !msgs}
    function create_if_block$5(ctx) {
    	var div;

    	return {
    		c: function create() {
    			div = element("div");
    			div.className = "loading loading-lg";
    			add_location(div, file$b, 90, 2, 2165);
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

    // (93:2) {#each msgs as msg (msg.key)}
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
    			t4 = text("\n              Show Only Roots");
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
    			add_location(h4, file$b, 50, 4, 1013);
    			i0.className = "icon icon-more-horiz text-gray";
    			add_location(i0, file$b, 58, 10, 1312);
    			span.className = "btn btn-link dropdown-toggle";
    			span.tabIndex = "0";
    			toggle_class(span, "active", ctx.dropdownActive);
    			add_location(span, file$b, 53, 8, 1123);
    			attr(input0, "type", "checkbox");
    			add_location(input0, file$b, 63, 14, 1499);
    			i1.className = "form-icon";
    			add_location(i1, file$b, 64, 14, 1564);
    			label0.className = "form-checkbox";
    			add_location(label0, file$b, 62, 12, 1455);
    			li0.className = "menu-item";
    			add_location(li0, file$b, 61, 10, 1420);
    			label1.className = "form-label";
    			label1.htmlFor = "input-example-1";
    			add_location(label1, file$b, 69, 12, 1700);
    			input1.className = "slider tooltip";
    			attr(input1, "type", "range");
    			input1.min = "10";
    			input1.max = "100";
    			input1.value = "50";
    			add_location(input1, file$b, 72, 12, 1824);
    			li1.className = "menu-item";
    			add_location(li1, file$b, 68, 10, 1665);
    			ul.className = "menu menu-right svelte-72ihda";
    			add_location(ul, file$b, 60, 8, 1381);
    			div0.className = "dropdown float-right";
    			add_location(div0, file$b, 52, 6, 1080);
    			div1.className = "column";
    			add_location(div1, file$b, 51, 4, 1053);
    			div2.className = "columns";
    			add_location(div2, file$b, 49, 2, 987);
    			div3.className = "container";
    			add_location(div3, file$b, 48, 0, 961);

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

    // (176:6) {#if msg}
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

    // (179:8) {:else}
    function create_else_block_1$3(ctx) {
    	var div, t0, a, t1, a_href_value;

    	return {
    		c: function create() {
    			div = element("div");
    			t0 = text("Your message has been posted. Do you want to\n            ");
    			a = element("a");
    			t1 = text("Check it out?");
    			a.target = "_blank";
    			a.href = a_href_value = "?thread=" + ctx.encodeURIComponent(ctx.msg.key) + "#/thread";
    			add_location(a, file$d, 181, 12, 4535);
    			div.className = "toast toast-success";
    			add_location(div, file$d, 179, 10, 4432);
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

    // (177:8) {#if error}
    function create_if_block_8(ctx) {
    	var div, t;

    	return {
    		c: function create() {
    			div = element("div");
    			t = text(ctx.msg);
    			div.className = "toast toast-error";
    			add_location(div, file$d, 177, 10, 4363);
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

    // (235:6) {:else}
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
    			add_location(h2, file$d, 236, 10, 6384);
    			div0.className = "divider";
    			add_location(div0, file$d, 261, 10, 7060);
    			span.className = "label label-warning";
    			add_location(span, file$d, 264, 14, 7183);
    			div1.className = "column col-md-12 col-lg-10";
    			add_location(div1, file$d, 263, 12, 7128);
    			button0.className = "btn";
    			add_location(button0, file$d, 269, 14, 7400);
    			button1.className = "btn btn-primary";
    			toggle_class(button1, "loading", ctx.posting);
    			add_location(button1, file$d, 272, 14, 7522);
    			div2.className = "column col-md-12 col-lg-2";
    			add_location(div2, file$d, 268, 12, 7346);
    			div3.className = "columns";
    			add_location(div3, file$d, 262, 10, 7094);
    			div4.className = "column col-md-12";
    			add_location(div4, file$d, 235, 8, 6343);

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

    // (190:6) {#if !showPreview}
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
    			add_location(label0, file$d, 191, 10, 4811);
    			input0.className = "form-input";
    			attr(input0, "type", "text");
    			input0.id = "channel";
    			input0.placeholder = "channel";
    			add_location(input0, file$d, 192, 10, 4877);
    			label1.className = "form-label";
    			label1.htmlFor = "content";
    			add_location(label1, file$d, 217, 10, 5616);
    			textarea.className = "form-input svelte-1kmc4x";
    			textarea.id = "content";
    			textarea.placeholder = "Type in your post";
    			textarea.rows = "10";
    			toggle_class(textarea, "file-on-top", ctx.fileOnTop);
    			add_location(textarea, file$d, 218, 10, 5682);
    			add_location(br, file$d, 227, 10, 6036);
    			attr(input1, "type", "file");
    			input1.id = "fileInput";
    			input1.className = "svelte-1kmc4x";
    			add_location(input1, file$d, 228, 10, 6053);
    			button0.className = "btn";
    			add_location(button0, file$d, 229, 10, 6122);
    			button1.className = "btn btn-primary float-right";
    			add_location(button1, file$d, 230, 10, 6202);
    			div.className = "form-group";
    			add_location(div, file$d, 190, 8, 4757);

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

    // (238:10) {#if channel || root || branch}
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
    			add_location(blockquote, file$d, 238, 12, 6460);
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

    // (240:14) {#if channel}
    function create_if_block_6$1(ctx) {
    	var p, b, t1, t2_value = ctx.channel.startsWith('#') ? ctx.channel.slice(1) : ctx.channel, t2;

    	return {
    		c: function create() {
    			p = element("p");
    			b = element("b");
    			b.textContent = "Channel:";
    			t1 = space();
    			t2 = text(t2_value);
    			add_location(b, file$d, 241, 18, 6539);
    			add_location(p, file$d, 240, 16, 6517);
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

    // (246:14) {#if root}
    function create_if_block_5$1(ctx) {
    	var p, b, t1, t2;

    	return {
    		c: function create() {
    			p = element("p");
    			b = element("b");
    			b.textContent = "Root:";
    			t1 = space();
    			t2 = text(ctx.root);
    			add_location(b, file$d, 247, 18, 6733);
    			add_location(p, file$d, 246, 16, 6711);
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

    // (252:14) {#if branch}
    function create_if_block_4$1(ctx) {
    	var p, b, t1, t2;

    	return {
    		c: function create() {
    			p = element("p");
    			b = element("b");
    			b.textContent = "In Reply To:";
    			t1 = space();
    			t2 = text(ctx.branch);
    			add_location(b, file$d, 253, 18, 6878);
    			add_location(p, file$d, 252, 16, 6856);
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

    // (200:10) {#if branch}
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
    			add_location(label, file$d, 200, 12, 5070);
    			input.className = "form-input";
    			attr(input, "type", "text");
    			input.id = "reply-to";
    			input.placeholder = "in reply to";
    			add_location(input, file$d, 201, 12, 5143);
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

    // (210:10) {#if replyfeed}
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
    			t = text("Click the avatar to add a link to the message:\n                ");
    			avatarchip.$$.fragment.c();
    			add_location(span, file$d, 211, 14, 5402);
    			div.className = "mt-2";
    			add_location(div, file$d, 210, 12, 5369);
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
    	var div2, div1, div0, t, current_block_type_index, if_block1, current;

    	var if_block0 = (ctx.msg) && create_if_block_7(ctx);

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
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	return {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t = space();
    			if_block1.c();
    			div0.className = "column";
    			add_location(div0, file$d, 174, 4, 4296);
    			div1.className = "columns";
    			add_location(div1, file$d, 173, 2, 4270);
    			div2.className = "container";
    			add_location(div2, file$d, 172, 0, 4244);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div2, anchor);
    			append(div2, div1);
    			append(div1, div0);
    			if (if_block0) if_block0.m(div0, null);
    			append(div0, t);
    			if_blocks[current_block_type_index].m(div0, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (ctx.msg) {
    				if (if_block0) {
    					if_block0.p(changed, ctx);
    				} else {
    					if_block0 = create_if_block_7(ctx);
    					if_block0.c();
    					if_block0.m(div0, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
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
    				if_block1.o(1);
    				check_outros();

    				if_block1 = if_blocks[current_block_type_index];
    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				}
    				if_block1.i(1);
    				if_block1.m(div0, null);
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
    			}

    			if (if_block0) if_block0.d();
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
      let fileOnTop = false;
      let pull = hermiebox.modules.pullStream;
      let fileReader = hermiebox.modules.pullFileReader;
      let sbot = hermiebox.sbot;

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
            $$invalidate('msg', msg = await ssb.newPost({ text: content, channel, root, branch }));
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

    // (30:0) {#if error}
    function create_if_block_1$6(ctx) {
    	var div, t0, a, t1, a_href_value, t2, t3;

    	return {
    		c: function create() {
    			div = element("div");
    			t0 = text("Couldn't load thead ");
    			a = element("a");
    			t1 = text(ctx.msgid);
    			t2 = text(": ");
    			t3 = text(ctx.error);
    			a.href = a_href_value = "?thread=" + ctx.msgid + "#/thread";
    			add_location(a, file$e, 30, 53, 728);
    			div.className = "toast toast-error";
    			add_location(div, file$e, 30, 2, 677);
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

    // (35:0) {:else}
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

    // (33:0) {#if !msgs && !error}
    function create_if_block$7(ctx) {
    	var div;

    	return {
    		c: function create() {
    			div = element("div");
    			div.className = "loading loading-lg";
    			add_location(div, file$e, 33, 2, 819);
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

    // (36:2) {#each msgs as msg (msg.key)}
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
    			t0 = text("Thread ");
    			small = element("small");
    			t1 = text(ctx.msgid);
    			t2 = space();
    			if (if_block0) if_block0.c();
    			t3 = space();
    			if_block1.c();
    			if_block1_anchor = empty();
    			small.className = "label hide-sm";
    			add_location(small, file$e, 27, 11, 606);
    			add_location(h4, file$e, 27, 0, 595);
    			div.className = "container";
    			add_location(div, file$e, 26, 0, 571);
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

    // (70:2) {:catch n}
    function create_catch_block(ctx) {
    	var p, t0, t1_value = ctx.n.message, t1;

    	return {
    		c: function create() {
    			p = element("p");
    			t0 = text("Error: ");
    			t1 = text(t1_value);
    			add_location(p, file$f, 70, 4, 1486);
    		},

    		m: function mount(target, anchor) {
    			insert(target, p, anchor);
    			append(p, t0);
    			append(p, t1);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.p1 || changed.p2) && t1_value !== (t1_value = ctx.n.message)) {
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

    // (48:2) {:then}
    function create_then_block(ctx) {
    	var div2, div0, img, img_src_value, t0, div1, h1, t1, t2, p, raw_value = ctx.ssb.markdown(ctx.description), t3, div3, each_blocks = [], each_1_lookup = new Map(), current;

    	var each_value = ctx.lastMsgs;

    	const get_key = ctx => ctx.msg.key;

    	for (var i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$2(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
    	}

    	return {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			h1 = element("h1");
    			t1 = text(ctx.name);
    			t2 = space();
    			p = element("p");
    			t3 = space();
    			div3 = element("div");

    			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].c();
    			img.className = "img-responsive";
    			img.src = img_src_value = "http://localhost:8989/blobs/get/" + ctx.image;
    			img.alt = ctx.feed;
    			add_location(img, file$f, 51, 8, 1078);
    			div0.className = "column col-6";
    			add_location(div0, file$f, 50, 6, 1043);
    			add_location(h1, file$f, 57, 8, 1250);
    			add_location(p, file$f, 58, 8, 1274);
    			div1.className = "column col-6";
    			add_location(div1, file$f, 56, 6, 1215);
    			div2.className = "columns";
    			add_location(div2, file$f, 48, 4, 1014);
    			add_location(div3, file$f, 64, 4, 1364);
    		},

    		m: function mount(target, anchor) {
    			insert(target, div2, anchor);
    			append(div2, div0);
    			append(div0, img);
    			append(div2, t0);
    			append(div2, div1);
    			append(div1, h1);
    			append(h1, t1);
    			append(div1, t2);
    			append(div1, p);
    			p.innerHTML = raw_value;
    			insert(target, t3, anchor);
    			insert(target, div3, anchor);

    			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].m(div3, null);

    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if ((!current || changed.image) && img_src_value !== (img_src_value = "http://localhost:8989/blobs/get/" + ctx.image)) {
    				img.src = img_src_value;
    			}

    			if (!current || changed.feed) {
    				img.alt = ctx.feed;
    			}

    			if (!current || changed.name) {
    				set_data(t1, ctx.name);
    			}

    			if ((!current || changed.description) && raw_value !== (raw_value = ctx.ssb.markdown(ctx.description))) {
    				p.innerHTML = raw_value;
    			}

    			const each_value = ctx.lastMsgs;

    			group_outros();
    			each_blocks = update_keyed_each(each_blocks, changed, get_key, 1, ctx, each_value, each_1_lookup, div3, outro_and_destroy_block, create_each_block$2, null, get_each_context$2);
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
    			if (detaching) {
    				detach(div2);
    				detach(t3);
    				detach(div3);
    			}

    			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].d();
    		}
    	};
    }

    // (66:6) {#each lastMsgs as msg (msg.key)}
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

    // (46:19)      <div class="loading loading-lg" />   {:then}
    function create_pending_block(ctx) {
    	var div;

    	return {
    		c: function create() {
    			div = element("div");
    			div.className = "loading loading-lg";
    			add_location(div, file$f, 46, 4, 965);
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
    		catch: create_catch_block,
    		value: 'null',
    		error: 'n',
    		blocks: Array(3)
    	};

    	handle_promise(promise = ctx.p1 && ctx.p2, info);

    	return {
    		c: function create() {
    			div = element("div");

    			info.block.c();
    			div.className = "container";
    			add_location(div, file$f, 44, 0, 917);
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

    			if (('p1' in changed || 'p2' in changed) && promise !== (promise = ctx.p1 && ctx.p2) && handle_promise(promise, info)) ; else {
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
      let name,
        image,
        feed,
        lastMsgs = [],
        lastAbout;

      // todo: move back into using stores.
      $$invalidate('feed', feed = $routeParams.feed);

      if (!feed) {
        $$invalidate('feed', feed = ssb.feed);
      }
      
      console.log("fetching", feed);
      let p1;
      let p2;

      $$invalidate('p1', p1 = ssb.avatar(feed).then(data => {
        $$invalidate('name', name = data.name);
        $$invalidate('image', image = data.image);
      }));
      $$invalidate('p2', p2 = ssb.profile(feed).then(data => {
        lastAbout = data.about.reverse().find(m => {
          let a = m.value.content;
          return a.hasOwnProperty("description");
        });
        if (data.hasOwnProperty("msgs")) {
          $$invalidate('lastMsgs', lastMsgs = data.msgs);
        }
        try {
          $$invalidate('description', description = lastAbout.value.content.description);
        } catch (n) {
          $$invalidate('description', description = "");
        }
        window.scrollTo(0, 0);
      }));

    	return {
    		description,
    		name,
    		image,
    		feed,
    		lastMsgs,
    		p1,
    		p2,
    		ssb
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

    // (42:2) {#if toast}
    function create_if_block_1$7(ctx) {
    	var div, t, div_class_value;

    	return {
    		c: function create() {
    			div = element("div");
    			t = text(ctx.msg);
    			div.className = div_class_value = "toast " + ctx.toastClass;
    			add_location(div, file$g, 42, 4, 1025);
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

    // (51:4) {#if cta}
    function create_if_block$8(ctx) {
    	var li, a, t_value = ctx.cta.label, t, dispose;

    	return {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t = text(t_value);
    			a.href = "#";
    			add_location(a, file$g, 52, 8, 1251);
    			add_location(li, file$g, 51, 6, 1237);
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

    	var if_block1 = (ctx.cta) && create_if_block$8(ctx);

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
    			add_location(h1, file$g, 40, 2, 961);
    			add_location(h4, file$g, 44, 2, 1081);
    			add_location(code, file$g, 46, 4, 1147);
    			pre.className = "code";
    			add_location(pre, file$g, 45, 2, 1123);
    			add_location(p, file$g, 48, 2, 1181);
    			a0.href = "/docs/index.html#/troubleshooting/";
    			a0.target = "_blank";
    			add_location(a0, file$g, 58, 6, 1396);
    			add_location(li0, file$g, 57, 4, 1384);
    			a1.href = "https://github.com/soapdog/patchfox/issues";
    			a1.target = "_blank";
    			add_location(a1, file$g, 63, 6, 1547);
    			add_location(li1, file$g, 62, 4, 1535);
    			add_location(ul, file$g, 49, 2, 1210);
    			div.className = "container";
    			add_location(div, file$g, 39, 0, 934);
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

    			if (ctx.cta) {
    				if (if_block1) {
    					if_block1.p(changed, ctx);
    				} else {
    					if_block1 = create_if_block$8(ctx);
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

    	let error = $routeParams.error;
      let toastClass = "";
      let toast = false;
      let msg;
      let cta = false;

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

    const parseLocation = () => {
      let data = queryString.parse(window.location.search);
      let loc = window.location.hash.slice(1).replace("?", "");
      return { data, location: loc }
    };

    const connected = writable(false);

    const route = writable(parseLocation());
    const routeParams = derived(route, $route => $route.data);
    const routeLocation = derived(route, $route => $route.location);

    const navigate = (location, data) => {
      data = data || {};
      route.set({ location, data });
      let dataAsQuery = queryString.stringify(data);
      history.pushState({ location, data }, `Patchfox - ${location}`, `/index.html?${dataAsQuery}#${location}`);
    };


    const routes = {
      "/thread": Thread,
      "/public": Public,
      "/compose": Compose,
      "/profile": Profile,
      "/error": ErrorView,
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
        return routes["*"]
      }
    });


    /// connection stuff

    const configurationIsOK = savedData => {
      return (
        savedData.hasOwnProperty("keys") ||
        savedData.hasOwnProperty("keys") ||
        savedData.hasOwnProperty("keys")
      );
    };

    const connectAndLaunch = savedData => {
      window.ssb = new DriverHermiebox();

      ssb
        .connect(savedData.keys)
        .then(data => {
          console.log("connected");
          connected.set(true);
        })
        .catch(err => {
          console.error("can't connect", err);
          cantConnect();
        });
    };

    const configurationPresent = savedData => {
      if (!configurationIsOK(savedData)) {
        configurationMissing();
      } else {
        connectAndLaunch(savedData);
      }
    };

    const configurationMissing = () => {
      console.log("config missing");
      window.location = "/docs/index.html#/troubleshooting/no-configuration";
    };

    const cantConnect = () => {
      console.log("config missing");
      window.location = "/docs/index.html#/troubleshooting/no-connection";
    };

    const connect = () => {
      browser.storage.local
        .get()
        .then(configurationPresent, configurationMissing);
    };

    const reconnect = () => {
      return new Promise((resolve, reject) => {
        const tryConnect = (savedData) => {
          window.ssb = new DriverHermiebox();

          ssb
            .connect(savedData.keys)
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

    /* src\Navigation.svelte generated by Svelte v3.4.4 */

    const file$h = "src\\Navigation.svelte";

    function create_fragment$h(ctx) {
    	var header, section0, a0, i0, t0, a1, figure0, img0, t1, i1, i1_class_value, t2, a2, t4, a3, t6, a4, t8, a5, t10, section1, button, i2, t11, a6, figure1, img1, t12, i3, i3_class_value, t13, div0, a7, t14, i4, t15, ul, li0, a8, t17, li1, a9, t19, li2, a10, t21, li3, a11, t23, li4, a12, t25, div1, dispose;

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
    			a2.textContent = "New";
    			t4 = space();
    			a3 = element("a");
    			a3.textContent = "Public";
    			t6 = space();
    			a4 = element("a");
    			a4.textContent = "Settings";
    			t8 = space();
    			a5 = element("a");
    			a5.textContent = "Help";
    			t10 = space();
    			section1 = element("section");
    			button = element("button");
    			i2 = element("i");
    			t11 = space();
    			a6 = element("a");
    			figure1 = element("figure");
    			img1 = element("img");
    			t12 = space();
    			i3 = element("i");
    			t13 = space();
    			div0 = element("div");
    			a7 = element("a");
    			t14 = text("Menu\n        ");
    			i4 = element("i");
    			t15 = space();
    			ul = element("ul");
    			li0 = element("li");
    			a8 = element("a");
    			a8.textContent = "New";
    			t17 = space();
    			li1 = element("li");
    			a9 = element("a");
    			a9.textContent = "Public";
    			t19 = space();
    			li2 = element("li");
    			a10 = element("a");
    			a10.textContent = "Settings";
    			t21 = space();
    			li3 = element("li");
    			a11 = element("a");
    			a11.textContent = "Help";
    			t23 = space();
    			li4 = element("li");
    			a12 = element("a");
    			a12.textContent = "Open as a Tab";
    			t25 = space();
    			div1 = element("div");
    			i0.className = "icon icon-minus text-black";
    			add_location(i0, file$h, 66, 6, 1460);
    			a0.href = "#/sidebar";
    			a0.className = "btn btn-link";
    			add_location(a0, file$h, 65, 4, 1389);
    			img0.src = ctx.avatar;
    			img0.alt = "L";
    			add_location(img0, file$h, 70, 8, 1630);
    			i1.className = i1_class_value = "avatar-presence " + (ctx.$connected ? 'online' : 'offline') + " svelte-1ucmw71";
    			add_location(i1, file$h, 71, 8, 1667);
    			figure0.className = "avatar avatar-lg";
    			add_location(figure0, file$h, 69, 6, 1588);
    			a1.href = "#";
    			a1.className = "navbar-brand mr-2 p-1";
    			add_location(a1, file$h, 68, 4, 1514);
    			a2.href = "#/compose";
    			a2.className = "btn btn-link";
    			add_location(a2, file$h, 74, 4, 1762);
    			a3.href = "#/public";
    			a3.className = "btn btn-link";
    			add_location(a3, file$h, 80, 4, 1897);
    			a4.href = "#/settings";
    			a4.className = "btn btn-link";
    			add_location(a4, file$h, 86, 4, 2033);
    			a5.href = "/docs/index.html";
    			a5.className = "btn btn-link";
    			add_location(a5, file$h, 87, 4, 2114);
    			section0.className = "navbar-section hide-sm";
    			add_location(section0, file$h, 64, 2, 1344);
    			i2.className = "icon icon-back";
    			add_location(i2, file$h, 91, 6, 2313);
    			button.className = "btn btn-link";
    			add_location(button, file$h, 90, 4, 2245);
    			img1.src = ctx.avatar;
    			img1.alt = "L";
    			add_location(img1, file$h, 95, 8, 2443);
    			i3.className = i3_class_value = "avatar-presence " + (ctx.$connected ? 'online' : 'offline') + " svelte-1ucmw71";
    			add_location(i3, file$h, 96, 8, 2480);
    			figure1.className = "avatar";
    			add_location(figure1, file$h, 94, 6, 2411);
    			a6.href = "...";
    			a6.className = "navbar-brand mr-2 p-1";
    			add_location(a6, file$h, 93, 4, 2360);
    			i4.className = "icon icon-caret";
    			add_location(i4, file$h, 106, 8, 2783);
    			a7.href = "?";
    			a7.className = "btn btn-link dropdown-toggle";
    			a7.tabIndex = "0";
    			add_location(a7, file$h, 100, 6, 2616);
    			a8.href = "#/compose";
    			a8.className = "btn btn-link";
    			add_location(a8, file$h, 111, 10, 2919);
    			li0.className = "menu-item";
    			add_location(li0, file$h, 110, 8, 2886);
    			a9.href = "#/public";
    			a9.className = "btn btn-link";
    			add_location(a9, file$h, 119, 10, 3135);
    			li1.className = "menu-item";
    			add_location(li1, file$h, 118, 8, 3102);
    			a10.href = "#/settings";
    			a10.className = "btn btn-link";
    			add_location(a10, file$h, 127, 10, 3352);
    			li2.className = "menu-item";
    			add_location(li2, file$h, 126, 8, 3319);
    			a11.href = "/docs/index.html";
    			a11.className = "btn btn-link";
    			add_location(a11, file$h, 132, 10, 3508);
    			li3.className = "menu-item";
    			add_location(li3, file$h, 131, 8, 3475);
    			a12.href = "#/sidebar";
    			a12.className = "btn btn-link";
    			add_location(a12, file$h, 135, 10, 3620);
    			li4.className = "menu-item";
    			add_location(li4, file$h, 134, 8, 3587);
    			ul.className = "menu";
    			add_location(ul, file$h, 109, 6, 2860);
    			div0.className = "dropdown float-right";
    			add_location(div0, file$h, 99, 4, 2575);
    			section1.className = "navbar-section show-sm bg-gray above svelte-1ucmw71";
    			add_location(section1, file$h, 89, 2, 2186);
    			div1.className = "blocker show-sm svelte-1ucmw71";
    			add_location(div1, file$h, 142, 2, 3779);
    			header.className = "navbar";
    			add_location(header, file$h, 63, 0, 1318);

    			dispose = [
    				listen(a0, "click", ctx.openSidebar),
    				listen(a1, "click", ctx.openMyProfile),
    				listen(a2, "click", stop_propagation(prevent_default(ctx.goCompose))),
    				listen(a3, "click", stop_propagation(prevent_default(ctx.goPublic))),
    				listen(a4, "click", ctx.goSettings),
    				listen(button, "click", ctx.click_handler),
    				listen(a7, "click", stop_propagation(prevent_default(click_handler_1))),
    				listen(a8, "click", stop_propagation(prevent_default(ctx.goCompose))),
    				listen(a9, "click", stop_propagation(prevent_default(ctx.goPublic))),
    				listen(a10, "click", ctx.goSettings),
    				listen(a12, "click", ctx.closeSidebar)
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
    			append(header, t10);
    			append(header, section1);
    			append(section1, button);
    			append(button, i2);
    			append(section1, t11);
    			append(section1, a6);
    			append(a6, figure1);
    			append(figure1, img1);
    			append(figure1, t12);
    			append(figure1, i3);
    			append(section1, t13);
    			append(section1, div0);
    			append(div0, a7);
    			append(a7, t14);
    			append(a7, i4);
    			append(div0, t15);
    			append(div0, ul);
    			append(ul, li0);
    			append(li0, a8);
    			append(ul, t17);
    			append(ul, li1);
    			append(li1, a9);
    			append(ul, t19);
    			append(ul, li2);
    			append(li2, a10);
    			append(ul, t21);
    			append(ul, li3);
    			append(li3, a11);
    			append(ul, t23);
    			append(ul, li4);
    			append(li4, a12);
    			append(header, t25);
    			append(header, div1);
    		},

    		p: function update(changed, ctx) {
    			if (changed.avatar) {
    				img0.src = ctx.avatar;
    			}

    			if ((changed.$connected) && i1_class_value !== (i1_class_value = "avatar-presence " + (ctx.$connected ? 'online' : 'offline') + " svelte-1ucmw71")) {
    				i1.className = i1_class_value;
    			}

    			if (changed.avatar) {
    				img1.src = ctx.avatar;
    			}

    			if ((changed.$connected) && i3_class_value !== (i3_class_value = "avatar-presence " + (ctx.$connected ? 'online' : 'offline') + " svelte-1ucmw71")) {
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

    function instance$g($$self, $$props, $$invalidate) {
    	let $connected;

    	validate_store(connected, 'connected');
    	subscribe($$self, connected, $$value => { $connected = $$value; $$invalidate('$connected', $connected); });

    	let avatar = "/images/icon.png";

      const goSettings = ev => {
        browser.runtime.openOptionsPage();
      };

      const goCompose = () => navigate("/compose");
      const goPublic = () => navigate("/public");

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
    		init(this, options, instance$g, create_fragment$h, safe_not_equal, []);
    	}
    }

    /* src\Patchfox.svelte generated by Svelte v3.4.4 */

    const file$i = "src\\Patchfox.svelte";

    function create_fragment$i(ctx) {
    	var div, t, current, dispose;

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
    			div = element("div");
    			navigation.$$.fragment.c();
    			t = space();
    			if (switch_instance) switch_instance.$$.fragment.c();
    			div.className = "container bg-gray";
    			add_location(div, file$i, 59, 0, 1303);

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
    			insert(target, div, anchor);
    			mount_component(navigation, div, null);
    			append(div, t);

    			if (switch_instance) {
    				mount_component(switch_instance, div, null);
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
    					mount_component(switch_instance, div, null);
    				} else {
    					switch_instance = null;
    				}
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
    				detach(div);
    			}

    			navigation.$destroy();

    			if (switch_instance) switch_instance.$destroy();
    			run_all(dispose);
    		}
    	};
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let $currentView;

    	validate_store(currentView, 'currentView');
    	subscribe($$self, currentView, $$value => { $currentView = $$value; $$invalidate('$currentView', $currentView); });

    	

      window.ssb = false;

      let interval;

      onMount(() => {
        connect();

        interval = setInterval(() => {
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
      });

      onDestroy(() => clearInterval(interval));

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
    		popState,
    		handleUncaughtException,
    		hashChange,
    		$currentView
    	};
    }

    class Patchfox extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$i, safe_not_equal, []);
    	}
    }

    const patchfox = new Patchfox({
        target: document.body
    });

    return patchfox;

}());
//# sourceMappingURL=bundle.js.map
