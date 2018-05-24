module Utils exposing (..)


elog : String -> a -> a
elog label value =
    let
        newLabel =
            "[ELM] " ++ label
    in
    Debug.log newLabel value
