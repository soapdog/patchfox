var on_error = function (e) {
    BiwaScheme.Port.current_error.put_string(e.message);
    throw (e);
};
var biwascheme = new BiwaScheme.Interpreter(on_error);

// // set html
// $(".bs-snippet").click(function (e) {
//     $("#bs-input").html($(this).html());
// });
// // set version
// $("#biwa_ver").append("(" + BiwaScheme.Version + ")");
// $("#eval-button").click(bs_eval);

Terminal.applyAddon(search);
Terminal.applyAddon(fit);
Terminal.applyAddon(webLinks);


let term = new Terminal();
let input = ""

term.open(document.getElementById('terminal'));

function runFakeTerminal() {
    if (term._initialized) {
        return;
    }

    term._initialized = true;

    term.prompt = () => {
        term.write('\r\n>> ');
    };


    const executeScheme = sexp => {
        var opc = biwascheme.compile(sexp);
        var dump = (new BiwaScheme.Dumper()).dump_opc(opc);
        var before = new Date();
        console.log(sexp)

        biwascheme.evaluate(sexp, function (result) {
            var after = new Date();
            term.writeln("Time: " + (after - before) / 1000 + "sec");
            term.writeln(result.toString())
            console.log(result.toString())
            // BiwaScheme.Port.current_output.put_string(BiwaScheme.to_write(result));
        });

        input = ""
        return false;
    }

    term.writeln(`Patchfox Scheme (based on BiwaScheme ${BiwaScheme.Version})`)
    term.writeln('');
    term.prompt();

    term.on('key', function (key, ev) {
        const printable = !ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey;

        if (ev.keyCode === 13) {
            executeScheme(input)
            term.prompt();
        } else if (ev.keyCode === 8) {
            // Do not delete the prompt
            if (term._core.buffer.x > 3) {
                term.write('\b \b');
            }
        } else if (printable) {
            term.write(key);
            input = input.concat(key)
        }
    });

    term.on('paste', function (data) {
        term.write(data);
    });
}
runFakeTerminal();