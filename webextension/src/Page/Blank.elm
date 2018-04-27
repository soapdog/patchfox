module Page.Blank exposing (..)

import Html exposing (..)
import Scuttlebutt.Types exposing (..)


view : Flags -> Html msg
view config =
    h1 [] [ text ("loading, remote: " ++ config.remote) ]
