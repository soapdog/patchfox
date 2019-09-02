let on_error = function (e) {
    BiwaScheme.Port.current_error.put_string(e.message);
    document.getElementById("eval").classList.remove("loading")
    document.getElementById("eval").removeAttribute("disabled")
    throw (e);
};

initializeSsb()
loadHooks()

let editor = CodeMirror.fromTextArea(document.getElementById("bs-input"),{
    lineNumbers: true,
    viewportMargin: Infinity,
    theme: "xq-light",
    matchBrackets: true,
    autoCloseBrackets: true 
});

let biwascheme = new BiwaScheme.Interpreter(on_error);

prelude()


const showOpcode = () => {
    document.getElementById("bs-opcode").classList.remove("d-none")
    document.getElementById("bs-console").classList.add("d-none")
}


const hideOpcode = () => {
    document.getElementById("bs-opcode").classList.add("d-none")
    document.getElementById("bs-console").classList.remove("d-none")
}

// // set html
// $(".bs-snippet").click(function (e) {
//     $("#bs-input").html($(this).html());
// });
// // set version
// $("#biwa_ver").append("(" + BiwaScheme.Version + ")");
// $("#eval-button").click(bs_eval);


const executeScheme = ev => {
    let sexp = editor.getValue();
    let opc = biwascheme.compile(sexp);
    let dump = (new BiwaScheme.Dumper()).dump_opc(opc);
    document.getElementById("bs-opcode").innerHTML = dump;
    document.getElementById("bs-console").innerHTML = "";
    document.getElementById("eval").classList.add("loading")
    document.getElementById("eval").setAttribute("disabled","disabled")
    let before = new Date();
    console.log(sexp)

    biwascheme.evaluate(sexp, function (result) {
        let after = new Date();
        let elapsed = (after - before) / 1000
        BiwaScheme.Port.current_output.put_string(BiwaScheme.to_write(result));
        document.getElementById("eval").classList.remove("loading")
        document.getElementById("eval").removeAttribute("disabled")
    });

    return false;
}

document.getElementById("eval").addEventListener("click", executeScheme)
document.getElementById("version").innerText = BiwaScheme.Version
document.getElementById("show-output").addEventListener("click", hideOpcode)
document.getElementById("show-opcodes").addEventListener("click", showOpcode)
hideOpcode()

