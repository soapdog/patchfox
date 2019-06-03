var app = (function () {
    'use strict';

    function noop() { }
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

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
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
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_data(text, data) {
        data = '' + data;
        if (text.data !== data)
            text.data = data;
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

        async public(opts) {
            var msgs = await hermiebox.api.pullPublic(opts);
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
                // p1 is nondigits, p2 digits, and p3 non-alphanumerics
                return "<a class=\"thread-link\" href=\"#!/thread/" + encodeURIComponent(id);
            }


            function replaceFeedID(match, id, offset, string) {
                // p1 is nondigits, p2 digits, and p3 non-alphanumerics
                return "<a class=\"profile-link\" href=\"#!/profile/%40" + encodeURIComponent(id);
            }


            function replaceImageLinks(match, id, offset, string) {
                // p1 is nondigits, p2 digits, and p3 non-alphanumerics
                return "<a class=\"image-link\" target=\"_blank\" href=\"http://localhost:8989/blobs/get/&" + encodeURIComponent(id);
            }


            function replaceImages(match, id, offset, string) {
                // p1 is nondigits, p2 digits, and p3 non-alphanumerics
                return "<img class=\"is-image-from-blob\" src=\"http://localhost:8989/blobs/get/&" + encodeURIComponent(id);
            }

            let html = hermiebox.modules.ssbMarkdown.block(text);
            html = html
                // .replace(/<a href="#([^"]+?)/gi, replaceChannel)
                .replace(/<a href="@([^"]+?)/gi, replaceFeedID)
                //.replace(/target="_blank"/gi, "")
                .replace(/<a href="%([^"]+?)/gi, replaceMsgID)
                .replace(/<img src="&([^"]+?)/gi, replaceImages)
                .replace(/<a href="&([^"]+?)/gi, replaceImageLinks);


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

    const connected = writable(false);

    const route = writable({ location: window.location.hash.slice(1), data: {} });

    const navigate = (location, data) => {
        console.log("Navigating to", location);
        route.set({ location, data });
        history.pushState(data, `Patchfox - ${location}`, `/index.html#${location}`);
    };

    /* src\Navigation.svelte generated by Svelte v3.4.4 */

    const file = "src\\Navigation.svelte";

    function create_fragment(ctx) {
    	var header, section0, a0, i0, t0, a1, figure0, img0, t1, i1, i1_class_value, t2, a2, t4, a3, t6, a4, t8, a5, t10, section1, a6, figure1, img1, t11, i2, i2_class_value, t12, div0, a7, t13, i3, t14, ul, li0, a8, t16, li1, a9, t18, li2, a10, t20, li3, a11, t22, li4, a12, t24, div1, dispose;

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
    			a6 = element("a");
    			figure1 = element("figure");
    			img1 = element("img");
    			t11 = space();
    			i2 = element("i");
    			t12 = space();
    			div0 = element("div");
    			a7 = element("a");
    			t13 = text("Menu\n        ");
    			i3 = element("i");
    			t14 = space();
    			ul = element("ul");
    			li0 = element("li");
    			a8 = element("a");
    			a8.textContent = "New";
    			t16 = space();
    			li1 = element("li");
    			a9 = element("a");
    			a9.textContent = "Public";
    			t18 = space();
    			li2 = element("li");
    			a10 = element("a");
    			a10.textContent = "Settings";
    			t20 = space();
    			li3 = element("li");
    			a11 = element("a");
    			a11.textContent = "Help";
    			t22 = space();
    			li4 = element("li");
    			a12 = element("a");
    			a12.textContent = "Open as a Tab";
    			t24 = space();
    			div1 = element("div");
    			i0.className = "icon icon-minus text-black";
    			add_location(i0, file, 58, 6, 1283);
    			a0.href = "#/sidebar";
    			a0.className = "btn btn-link";
    			add_location(a0, file, 57, 4, 1212);
    			img0.src = ctx.avatar;
    			img0.alt = "L";
    			add_location(img0, file, 62, 8, 1430);
    			i1.className = i1_class_value = "avatar-presence " + (ctx.$connected ? 'online' : 'offline') + " svelte-1edav6p";
    			add_location(i1, file, 63, 8, 1467);
    			figure0.className = "avatar avatar-lg";
    			add_location(figure0, file, 61, 6, 1388);
    			a1.href = "...";
    			a1.className = "navbar-brand mr-2 p-1";
    			add_location(a1, file, 60, 4, 1337);
    			a2.href = "#/compose";
    			a2.className = "btn btn-link";
    			add_location(a2, file, 66, 4, 1562);
    			a3.href = "#/public";
    			a3.className = "btn btn-link";
    			add_location(a3, file, 67, 4, 1615);
    			a4.href = "#/settings";
    			a4.className = "btn btn-link";
    			add_location(a4, file, 68, 4, 1670);
    			a5.href = "/docs/index.html";
    			a5.className = "btn btn-link";
    			add_location(a5, file, 69, 4, 1751);
    			section0.className = "navbar-section hide-sm";
    			add_location(section0, file, 56, 2, 1167);
    			img1.src = ctx.avatar;
    			img1.alt = "L";
    			add_location(img1, file, 74, 8, 1965);
    			i2.className = i2_class_value = "avatar-presence " + (ctx.$connected ? 'online' : 'offline') + " svelte-1edav6p";
    			add_location(i2, file, 75, 8, 2002);
    			figure1.className = "avatar";
    			add_location(figure1, file, 73, 6, 1933);
    			a6.href = "...";
    			a6.className = "navbar-brand mr-2 p-1";
    			add_location(a6, file, 72, 4, 1882);
    			i3.className = "icon icon-caret";
    			add_location(i3, file, 85, 8, 2275);
    			a7.href = "?";
    			a7.className = "btn btn-link dropdown-toggle";
    			a7.tabIndex = "0";
    			add_location(a7, file, 79, 6, 2138);
    			a8.href = "#/compose";
    			a8.className = "btn btn-link";
    			add_location(a8, file, 90, 10, 2411);
    			li0.className = "menu-item";
    			add_location(li0, file, 89, 8, 2378);
    			a9.href = "#/public";
    			a9.className = "btn btn-link";
    			add_location(a9, file, 93, 10, 2515);
    			li1.className = "menu-item";
    			add_location(li1, file, 92, 8, 2482);
    			a10.href = "#/settings";
    			a10.className = "btn btn-link";
    			add_location(a10, file, 96, 10, 2621);
    			li2.className = "menu-item";
    			add_location(li2, file, 95, 8, 2588);
    			a11.href = "/docs/index.html";
    			a11.className = "btn btn-link";
    			add_location(a11, file, 101, 10, 2777);
    			li3.className = "menu-item";
    			add_location(li3, file, 100, 8, 2744);
    			a12.href = "#/sidebar";
    			a12.className = "btn btn-link";
    			add_location(a12, file, 104, 10, 2889);
    			li4.className = "menu-item";
    			add_location(li4, file, 103, 8, 2856);
    			ul.className = "menu";
    			add_location(ul, file, 88, 6, 2352);
    			div0.className = "dropdown float-right";
    			add_location(div0, file, 78, 4, 2097);
    			section1.className = "navbar-section show-sm bg-gray above svelte-1edav6p";
    			add_location(section1, file, 71, 2, 1823);
    			div1.className = "blocker show-sm svelte-1edav6p";
    			add_location(div1, file, 111, 2, 3048);
    			header.className = "navbar";
    			add_location(header, file, 55, 0, 1141);

    			dispose = [
    				listen(a0, "click", ctx.openSidebar),
    				listen(a4, "click", ctx.goSettings),
    				listen(a7, "click", ctx.doNothing),
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
    			append(section1, a6);
    			append(a6, figure1);
    			append(figure1, img1);
    			append(figure1, t11);
    			append(figure1, i2);
    			append(section1, t12);
    			append(section1, div0);
    			append(div0, a7);
    			append(a7, t13);
    			append(a7, i3);
    			append(div0, t14);
    			append(div0, ul);
    			append(ul, li0);
    			append(li0, a8);
    			append(ul, t16);
    			append(ul, li1);
    			append(li1, a9);
    			append(ul, t18);
    			append(ul, li2);
    			append(li2, a10);
    			append(ul, t20);
    			append(ul, li3);
    			append(li3, a11);
    			append(ul, t22);
    			append(ul, li4);
    			append(li4, a12);
    			append(header, t24);
    			append(header, div1);
    		},

    		p: function update(changed, ctx) {
    			if (changed.avatar) {
    				img0.src = ctx.avatar;
    			}

    			if ((changed.$connected) && i1_class_value !== (i1_class_value = "avatar-presence " + (ctx.$connected ? 'online' : 'offline') + " svelte-1edav6p")) {
    				i1.className = i1_class_value;
    			}

    			if (changed.avatar) {
    				img1.src = ctx.avatar;
    			}

    			if ((changed.$connected) && i2_class_value !== (i2_class_value = "avatar-presence " + (ctx.$connected ? 'online' : 'offline') + " svelte-1edav6p")) {
    				i2.className = i2_class_value;
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

    function instance($$self, $$props, $$invalidate) {
    	let $connected;

    	validate_store(connected, 'connected');
    	subscribe($$self, connected, $$value => { $connected = $$value; $$invalidate('$connected', $connected); });

    	let avatar = "/images/icon.png";

      const goSettings = ev => {
        browser.runtime.openOptionsPage();
        ev.preventDefault();
        ev.stopPropagation();
      };

      const openSidebar = async ev => {
        ev.preventDefault();
        ev.stopPropagation();
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
        ev.preventDefault();
        ev.stopPropagation();
      };

      const doNothing = ev => {
        ev.stopPropagation();
        ev.preventDefault();
      };

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
    		openSidebar,
    		closeSidebar,
    		doNothing,
    		$connected
    	};
    }

    class Navigation extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, []);
    	}
    }

    /* src\messageTypes\PostMsg.svelte generated by Svelte v3.4.4 */

    const file$1 = "src\\messageTypes\\PostMsg.svelte";

    // (43:6) {#if rootId || branchId}
    function create_if_block(ctx) {
    	var t, if_block1_anchor;

    	var if_block0 = (ctx.msg.value.content.root) && create_if_block_2(ctx);

    	var if_block1 = (ctx.msg.value.content.branch) && create_if_block_1(ctx);

    	return {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},

    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert(target, if_block1_anchor, anchor);
    		},

    		p: function update(changed, ctx) {
    			if (ctx.msg.value.content.root) {
    				if (if_block0) {
    					if_block0.p(changed, ctx);
    				} else {
    					if_block0 = create_if_block_2(ctx);
    					if_block0.c();
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (ctx.msg.value.content.branch) {
    				if (if_block1) {
    					if_block1.p(changed, ctx);
    				} else {
    					if_block1 = create_if_block_1(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},

    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);

    			if (detaching) {
    				detach(t);
    			}

    			if (if_block1) if_block1.d(detaching);

    			if (detaching) {
    				detach(if_block1_anchor);
    			}
    		}
    	};
    }

    // (44:8) {#if msg.value.content.root}
    function create_if_block_2(ctx) {
    	var span, a, t, a_href_value;

    	return {
    		c: function create() {
    			span = element("span");
    			a = element("a");
    			t = text("(root)");
    			a.href = a_href_value = "#/thread/" + ctx.rootId;
    			add_location(a, file$1, 45, 12, 999);
    			add_location(span, file$1, 44, 10, 980);
    		},

    		m: function mount(target, anchor) {
    			insert(target, span, anchor);
    			append(span, a);
    			append(a, t);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.rootId) && a_href_value !== (a_href_value = "#/thread/" + ctx.rootId)) {
    				a.href = a_href_value;
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(span);
    			}
    		}
    	};
    }

    // (49:8) {#if msg.value.content.branch}
    function create_if_block_1(ctx) {
    	var span, a, t, a_href_value;

    	return {
    		c: function create() {
    			span = element("span");
    			a = element("a");
    			t = text("(in reply to)");
    			a.href = a_href_value = "#/thread/" + ctx.rootId;
    			add_location(a, file$1, 50, 12, 1138);
    			add_location(span, file$1, 49, 10, 1119);
    		},

    		m: function mount(target, anchor) {
    			insert(target, span, anchor);
    			append(span, a);
    			append(a, t);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.rootId) && a_href_value !== (a_href_value = "#/thread/" + ctx.rootId)) {
    				a.href = a_href_value;
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(span);
    			}
    		}
    	};
    }

    function create_fragment$1(ctx) {
    	var div0, t0, div4, div3, div1, label, input, t1, i, t2, t3, t4, div2, button;

    	var if_block = (ctx.rootId || ctx.branchId) && create_if_block(ctx);

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
    			if (if_block) if_block.c();
    			t4 = space();
    			div2 = element("div");
    			button = element("button");
    			button.textContent = "Reply";
    			div0.className = "card-body";
    			add_location(div0, file$1, 31, 0, 623);
    			attr(input, "type", "checkbox");
    			add_location(input, file$1, 38, 8, 816);
    			i.className = "form-icon";
    			add_location(i, file$1, 39, 8, 850);
    			label.className = "form-switch d-inline";
    			add_location(label, file$1, 37, 6, 771);
    			div1.className = "column col-6";
    			add_location(div1, file$1, 36, 4, 738);
    			button.className = "btn";
    			add_location(button, file$1, 56, 6, 1287);
    			div2.className = "column col-6 text-right";
    			add_location(div2, file$1, 55, 4, 1243);
    			div3.className = "columns col-gapless";
    			add_location(div3, file$1, 35, 2, 700);
    			div4.className = "card-footer";
    			add_location(div4, file$1, 34, 0, 672);
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
    			if (if_block) if_block.m(div1, null);
    			append(div3, t4);
    			append(div3, div2);
    			append(div2, button);
    		},

    		p: function update(changed, ctx) {
    			if (ctx.rootId || ctx.branchId) {
    				if (if_block) {
    					if_block.p(changed, ctx);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
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

    			if (if_block) if_block.d();
    		}
    	};
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { msg } = $$props;

      let content = ssb.markdown(msg.value.content.text);
      let rootId = false;
      let branchId = false;

      if (msg.value.content.root) {
        ssb.blurbFromMsg(msg.value.content.root, 50).then(blurb => {
          $$invalidate('rootId', rootId = msg.value.content.root);
        });
      }

      if (msg.value.content.branch) {
        ssb.blurbFromMsg(msg.value.content.branch, 50).then(blurb => {
          $$invalidate('branchId', branchId = msg.value.content.branch);
        });
      }

    	const writable_props = ['msg'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<PostMsg> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('msg' in $$props) $$invalidate('msg', msg = $$props.msg);
    	};

    	return { msg, content, rootId, branchId };
    }

    class PostMsg extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, ["msg"]);

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

    const file$2 = "src\\messageTypes\\GenericMsg.svelte";

    function create_fragment$2(ctx) {
    	var div, pre, code, t;

    	return {
    		c: function create() {
    			div = element("div");
    			pre = element("pre");
    			code = element("code");
    			t = text(ctx.rawContent);
    			add_location(code, file$2, 8, 0, 138);
    			pre.className = "code";
    			add_location(pre, file$2, 7, 0, 119);
    			div.className = "card-body";
    			add_location(div, file$2, 6, 0, 95);
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

    function instance$2($$self, $$props, $$invalidate) {
    	let { msg } = $$props;

    let rawContent = JSON.stringify(msg.value.content,null,2);

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
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, ["msg"]);

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

    const file$3 = "src\\messageTypes\\VoteMsg.svelte";

    function create_fragment$3(ctx) {
    	var div, t0, t1, t2, t3, a, t4, a_href_value;

    	return {
    		c: function create() {
    			div = element("div");
    			t0 = text(ctx.person);
    			t1 = space();
    			t2 = text(ctx.expression);
    			t3 = space();
    			a = element("a");
    			t4 = text(ctx.label);
    			a.href = a_href_value = "#/thread/" + ctx.msgid;
    			add_location(a, file$3, 17, 0, 377);
    			div.className = "card-body";
    			add_location(div, file$3, 15, 0, 331);
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
    		}
    	};
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { msg } = $$props;

      let expression = msg.value.content.vote.expression;
      let msgid = msg.value.content.vote.link;
      let label = msgid;
      let person = msg.value.author;

      ssb.blurbFromMsg(msgid, 100).then(blurb => {
        $$invalidate('label', label = blurb);
      });

      ssb.avatar(msg.value.author).then(data => { const $$result = (person = data.name); $$invalidate('person', person); return $$result; });

    	const writable_props = ['msg'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<VoteMsg> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('msg' in $$props) $$invalidate('msg', msg = $$props.msg);
    	};

    	return { msg, expression, msgid, label, person };
    }

    class VoteMsg extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, ["msg"]);

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

    const file$4 = "src\\messageTypes\\PrivateMsg.svelte";

    function create_fragment$4(ctx) {
    	var div, p;

    	return {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			p.textContent = "🔒 PRIVATE";
    			add_location(p, file$4, 5, 0, 62);
    			div.className = "card-body";
    			add_location(div, file$4, 4, 0, 38);
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

    function instance$4($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, ["msg"]);

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

    const file$5 = "src\\messageTypes\\ContactMsg.svelte";

    function create_fragment$5(ctx) {
    	var div, t0, t1, t2, t3, a, t4, a_href_value;

    	return {
    		c: function create() {
    			div = element("div");
    			t0 = text(ctx.person);
    			t1 = space();
    			t2 = text(ctx.verb);
    			t3 = space();
    			a = element("a");
    			t4 = text(ctx.otherPersonName);
    			a.href = a_href_value = "#/profile/" + ctx.otherPersonFeed;
    			add_location(a, file$5, 15, 16, 419);
    			div.className = "card-body";
    			add_location(div, file$5, 14, 0, 378);
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
    		}
    	};
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { msg } = $$props;


      let person = msg.value.author;
      let otherPersonFeed = msg.value.content.contact;
      let otherPersonName = otherPersonFeed;
      let verb = msg.value.content.following ? "followed" : "unfollowed";

      ssb.avatar(msg.value.author).then(data => { const $$result = (person = data.name); $$invalidate('person', person); return $$result; });
      ssb.avatar(otherPersonFeed).then(data => { const $$result = (otherPersonName = data.name); $$invalidate('otherPersonName', otherPersonName); return $$result; });

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
    		verb
    	};
    }

    class ContactMsg extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, ["msg"]);

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

    const file$6 = "src\\messageTypes\\ChannelMsg.svelte";

    function create_fragment$6(ctx) {
    	var div, t0, t1, t2, t3, a, t4, t5, a_href_value;

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
    			a.href = a_href_value = "#/channel/" + ctx.channel;
    			add_location(a, file$6, 12, 2, 303);
    			div.className = "card-body";
    			add_location(div, file$6, 10, 0, 258);
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
    		}
    	};
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { msg } = $$props;

      let person = msg.value.author;
      let verb = msg.value.content.subscribed ? "subscribed" : "unsubscribed";
      let channel = msg.value.content.channel;

      ssb.avatar(msg.value.author).then(data => { const $$result = (person = data.name); $$invalidate('person', person); return $$result; });

    	const writable_props = ['msg'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<ChannelMsg> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('msg' in $$props) $$invalidate('msg', msg = $$props.msg);
    	};

    	return { msg, person, verb, channel };
    }

    class ChannelMsg extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, ["msg"]);

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

    /* src\parts\AvatarChip.svelte generated by Svelte v3.4.4 */

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

    const file$7 = "src\\messageTypes\\MessageRenderer.svelte";

    // (71:8) {#if msg.value.content.channel}
    function create_if_block$1(ctx) {
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

    function create_fragment$7(ctx) {
    	var div9, div8, div6, div5, div4, div1, div0, img, t0, div3, div2, t1, t2, small, t3_value = timestamp(ctx.msg.value.timestamp), t3, t4, div7, span, t5, current;

    	var if_block = (ctx.msg.value.content.channel) && create_if_block$1(ctx);

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
    			div9 = element("div");
    			div8 = element("div");
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
    			div7 = element("div");
    			span = element("span");
    			if (if_block) if_block.c();
    			t5 = space();
    			if (switch_instance) switch_instance.$$.fragment.c();
    			img.src = ctx.image;
    			img.className = "avatar avatar-lg";
    			img.alt = ctx.feed;
    			add_location(img, file$7, 56, 14, 1374);
    			div0.className = "example-tile-icon";
    			add_location(div0, file$7, 55, 12, 1328);
    			div1.className = "tile-icon";
    			add_location(div1, file$7, 54, 10, 1292);
    			div2.className = "tile-title";
    			add_location(div2, file$7, 60, 12, 1515);
    			small.className = "tile-subtitle text-gray";
    			add_location(small, file$7, 61, 12, 1564);
    			div3.className = "tile-content";
    			add_location(div3, file$7, 59, 10, 1476);
    			div4.className = "tile tile-centered";
    			add_location(div4, file$7, 53, 8, 1249);
    			div5.className = "card-title";
    			add_location(div5, file$7, 52, 6, 1216);
    			div6.className = "float-left";
    			add_location(div6, file$7, 51, 4, 1185);
    			span.className = "text-gray";
    			add_location(span, file$7, 69, 6, 1765);
    			div7.className = "float-right";
    			add_location(div7, file$7, 68, 4, 1733);
    			div8.className = "card-header";
    			add_location(div8, file$7, 50, 2, 1155);
    			div9.className = "card m-2";
    			add_location(div9, file$7, 49, 0, 1130);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div9, anchor);
    			append(div9, div8);
    			append(div8, div6);
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
    			append(div8, t4);
    			append(div8, div7);
    			append(div7, span);
    			if (if_block) if_block.m(span, null);
    			append(div9, t5);

    			if (switch_instance) {
    				mount_component(switch_instance, div9, null);
    			}

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
    				if (if_block) {
    					if_block.p(changed, ctx);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(span, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

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
    					mount_component(switch_instance, div9, null);
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
    				detach(div9);
    			}

    			if (if_block) if_block.d();
    			if (switch_instance) switch_instance.$destroy();
    		}
    	};
    }

    function instance$7($$self, $$props, $$invalidate) {
    	

      let { msg } = $$props;

      let type;
      let feed = msg.value.author;

      let messageTypes = {
        "*": GenericMsg,
        post: PostMsg,
        vote: VoteMsg,
        private: PrivateMsg,
        contact: ContactMsg,
        channel: ChannelMsg
      };

      let selectedRenderer;

      if (typeof msg.value.content === "string") {
        type = "private";
      } else {
        type = msg.value.content.type;
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

    	const writable_props = ['msg'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<MessageRenderer> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('msg' in $$props) $$invalidate('msg', msg = $$props.msg);
    	};

    	return { msg, feed, selectedRenderer, image, name };
    }

    class MessageRenderer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, ["msg"]);

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

    const file$8 = "src\\views\\Public.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.msg = list[i];
    	return child_ctx;
    }

    // (28:0) {:else}
    function create_else_block(ctx) {
    	var each_blocks = [], each_1_lookup = new Map(), t, ul, li, a, div, current, dispose;

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

    			t = space();
    			ul = element("ul");
    			li = element("li");
    			a = element("a");
    			div = element("div");
    			div.textContent = "Load More";
    			div.className = "page-item-subtitle";
    			add_location(div, file$8, 34, 8, 720);
    			a.href = "#/public";
    			add_location(a, file$8, 33, 6, 672);
    			li.className = "page-item page-next";
    			add_location(li, file$8, 32, 4, 633);
    			ul.className = "pagination";
    			add_location(ul, file$8, 31, 2, 605);
    			dispose = listen(a, "click", ctx.loadMore);
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
    			const each_value = ctx.msgs;

    			group_outros();
    			each_blocks = update_keyed_each(each_blocks, changed, get_key, 1, ctx, each_value, each_1_lookup, t.parentNode, outro_and_destroy_block, create_each_block, t, get_each_context);
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

    // (26:0) {#if !msgs}
    function create_if_block$2(ctx) {
    	var p;

    	return {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Loading...";
    			add_location(p, file$8, 26, 2, 505);
    		},

    		m: function mount(target, anchor) {
    			insert(target, p, anchor);
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

    // (29:2) {#each msgs as msg (msg.key)}
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

    function create_fragment$8(ctx) {
    	var current_block_type_index, if_block, if_block_anchor, current;

    	var if_block_creators = [
    		create_if_block$2,
    		create_else_block
    	];

    	var if_blocks = [];

    	function select_block_type(ctx) {
    		if (!ctx.msgs) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	return {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
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
    			if_blocks[current_block_type_index].d(detaching);

    			if (detaching) {
    				detach(if_block_anchor);
    			}
    		}
    	};
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let opts = {
        limit: 10,
        reverse: true
      };

      let msgs = false;
      let promise = ssb.public(opts).then(ms => { const $$result = (msgs = ms); $$invalidate('msgs', msgs); return $$result; });

      const loadMore = ev => {
        ev.stopPropagation();
        ev.preventDefault();

        let lastMsg = msgs[msgs.length - 1];
        opts.lt = lastMsg.rts;    promise = ssb.public(opts).then(ms => {
          $$invalidate('msgs', msgs = ms);
          window.scrollTo(0, 0);
        });
        $$invalidate('msgs', msgs = []);
      };

    	return { msgs, loadMore };
    }

    class Public extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, []);
    	}
    }

    /* src\views\Default.svelte generated by Svelte v3.4.4 */

    const file$9 = "src\\views\\Default.svelte";

    function create_fragment$9(ctx) {
    	var div;

    	return {
    		c: function create() {
    			div = element("div");
    			div.className = "empty";
    			add_location(div, file$9, 0, 0, 0);
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
    		init(this, options, null, create_fragment$9, safe_not_equal, []);
    	}
    }

    /* src\views\Compose.svelte generated by Svelte v3.4.4 */

    const file$a = "src\\views\\Compose.svelte";

    function create_fragment$a(ctx) {
    	var div3, div2, div1, div0, label0, t1, input0, t2, label1, t4, input1, t5, label2, t7, textarea, t8, br, t9, button;

    	return {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "Channel";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			label1 = element("label");
    			label1.textContent = "In reply to";
    			t4 = space();
    			input1 = element("input");
    			t5 = space();
    			label2 = element("label");
    			label2.textContent = "Message";
    			t7 = space();
    			textarea = element("textarea");
    			t8 = space();
    			br = element("br");
    			t9 = space();
    			button = element("button");
    			button.textContent = "Preview";
    			label0.className = "form-label";
    			label0.htmlFor = "channel";
    			add_location(label0, file$a, 4, 6, 108);
    			input0.className = "form-input";
    			attr(input0, "type", "text");
    			input0.id = "channel";
    			input0.placeholder = "channel";
    			add_location(input0, file$a, 5, 6, 170);
    			label1.className = "form-label";
    			label1.htmlFor = "reply-to";
    			add_location(label1, file$a, 11, 6, 285);
    			input1.className = "form-input";
    			attr(input1, "type", "text");
    			input1.id = "reply-to";
    			input1.placeholder = "in reply to";
    			add_location(input1, file$a, 12, 6, 352);
    			label2.className = "form-label";
    			label2.htmlFor = "content";
    			add_location(label2, file$a, 19, 6, 473);
    			textarea.className = "form-input";
    			textarea.id = "content";
    			textarea.placeholder = "Type in your post";
    			textarea.rows = "10";
    			add_location(textarea, file$a, 20, 6, 535);
    			add_location(br, file$a, 25, 6, 660);
    			button.className = "btn btn-primary float-right";
    			add_location(button, file$a, 26, 6, 671);
    			div0.className = "form-group";
    			add_location(div0, file$a, 3, 4, 77);
    			div1.className = "column";
    			add_location(div1, file$a, 2, 4, 52);
    			div2.className = "columns";
    			add_location(div2, file$a, 1, 2, 26);
    			div3.className = "container";
    			add_location(div3, file$a, 0, 0, 0);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div3, anchor);
    			append(div3, div2);
    			append(div2, div1);
    			append(div1, div0);
    			append(div0, label0);
    			append(div0, t1);
    			append(div0, input0);
    			append(div0, t2);
    			append(div0, label1);
    			append(div0, t4);
    			append(div0, input1);
    			append(div0, t5);
    			append(div0, label2);
    			append(div0, t7);
    			append(div0, textarea);
    			append(div0, t8);
    			append(div0, br);
    			append(div0, t9);
    			append(div0, button);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div3);
    			}
    		}
    	};
    }

    class Compose extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$a, safe_not_equal, []);
    	}
    }

    /* src\Patchfox.svelte generated by Svelte v3.4.4 */

    const file$b = "src\\Patchfox.svelte";

    function create_fragment$b(ctx) {
    	var div, t, current, dispose;

    	var navigation = new Navigation({ $$inline: true });

    	var switch_value = ctx.currentView;

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
    			add_location(div, file$b, 86, 0, 2081);
    			dispose = listen(window, "hashchange", ctx.changedRoute);
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
    			if (switch_value !== (switch_value = ctx.currentView)) {
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
    			dispose();
    		}
    	};
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $connected, $route;

    	validate_store(connected, 'connected');
    	subscribe($$self, connected, $$value => { $connected = $$value; $$invalidate('$connected', $connected); });
    	validate_store(route, 'route');
    	subscribe($$self, route, $$value => { $route = $$value; $$invalidate('$route', $route); });

    	

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
            configurationIsMissing();
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
        window.location = "/docs/index.html#/troubleshooting";
      };

      onMount(() => {
        browser.storage.local
          .get()
          .then(configurationPresent, configurationMissing);
      });

      window.ssb = false;

      const routes = {
        "/thread": "thread",
        "/public": Public,
        "/compose": Compose,
        "*": Default
      };

      let currentView = "";

      const changedRoute = event => {
        console.log("hash", event);
        navigate(location.hash.slice(1));
      };

    	$$self.$$.update = ($$dirty = { $connected: 1, $route: 1, currentView: 1 }) => {
    		if ($$dirty.$connected || $$dirty.$route || $$dirty.currentView) { {
            if ($connected) {
              let currentLocation = $route.location;
        
              if (routes.hasOwnProperty(currentLocation)) {
                console.log("found!", currentLocation);
                $$invalidate('currentView', currentView = routes[currentLocation]);
              } else {
                console.log("didn't find", currentLocation);
                $$invalidate('currentView', currentView = routes["*"]);
              }
              console.log(currentLocation, currentView);
            } else {
              $$invalidate('currentView', currentView = Default);
            }
          } }
    	};

    	return { currentView, changedRoute };
    }

    class Patchfox extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$b, safe_not_equal, []);
    	}
    }

    const patchfox = new Patchfox({
        target: document.body
    });

    return patchfox;

}());
//# sourceMappingURL=bundle.js.map
