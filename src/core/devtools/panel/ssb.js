const initializeSsb = () => {

    BiwaScheme.define_libfunc("p-eval", 1, null, function (ar) {
        if (browser) {
            let str = ar.join(`\n`)

            return new BiwaScheme.Pause(function (pause) {
                browser.devtools.inspectedWindow.eval(str)
                    .then(r => {
                        let result = r[0] || r[1]
                        console.log("result", r)
                        pause.resume(result)
                    });
            })
        } else {
            return false
        }
    })

    BiwaScheme.define_libfunc("p-debug", 1, null, function (ar) {
        console.log("p-debug", ar)
        return BiwaScheme.undef
    })

    BiwaScheme.define_libfunc("hooks", 0, 0, function () {
        if (!browser) {
            return false
        }

        return new BiwaScheme.Pause(function (pause) {
            browser.devtools.inspectedWindow.eval("window._SCHEME_HOOKS")
                .then(r => {
                    if (r[1]) {
                        pause.resume(false)
                    } else {
                        console.log(r[0])
                        let keys = Object.keys(r[0])
                        let arr = []
                        arr = keys.map(k => {
                            let i = r[0][k]
                            return `(${i.name}) - ${i.description}`
                        })
                        let str = arr.join(`\n\n`)
                        pause.resume(str)

                    }
                })

        });
    })
}

const prelude = () => {
    let sexp = `
    (define (my-id) (p-eval "hermiebox.sbot.id"))
    `
    biwascheme.evaluate(sexp, function (result) {
        console.log("result of prelude", result)
    })
}

const loadHooks = () => {
    if (browser) {
        console.log("loading hooks...")
        browser.devtools.inspectedWindow.eval("window._SCHEME_HOOKS")
            .then(r => {
                if (r[1]) {
                    console.log("no hooks")
                } else {
                    let keys = Object.keys(r[0])
                    keys.forEach(k => {
                        let h = r[0][k]
                        console.log(`loading hook (${h.name})`, h)
                        let res = BiwaScheme.define_libfunc(
                            h.name,
                            h.minArguments,
                            h.maxArguments,
                            (ar) => {
                                let js = `window._SCHEME_HOOKS["${h.name}"].action()`
                                return new BiwaScheme.Pause(function (pause) {

                                    browser.devtools.inspectedWindow.eval(js)
                                        .then(rr => {
                                            if (rr[1]) {
                                                console.error(`error executing (${h.name})`, rr[1])
                                                pause.resume(false)
                                            } else {
                                                console.log(`succ (${h.name})`, rr[0])

                                                pause.resume(convertJStoScheme(rr[0]))
                                            }
                                        })
                                })
                            })
                        console.log(res)
                    });
                }
            })
            .catch(n => console.error(`error adding hooks`, n));
    }
}

const convertJStoScheme = val => {
    if (typeof val === "number" || typeof val === "boolean" || typeof val === "string") {
        return val
    }

    if (Array.isArray(val)) {
        return BiwaScheme.array_to_list(val.map(v => convertJStoScheme(v)))
    }

    if (typeof val === "object") {
        let o = {}
        for (k in val) {
            o[k] = convertJStoScheme(val[k])
        }
        return BiwaScheme.js_obj_to_alist(o)
    }

    return false
}