module Scuttlebutt.Commands.Whoami exposing (whoami)

import Http
import Json.Decode exposing (Decoder)
import Json.Decode.Pipeline exposing (decode, required)
import Scuttlebutt.Helpers exposing (apiUrl)
import Scuttlebutt.Types exposing (..)


whoami : (Result Http.Error UserId -> msg) -> Cmd msg
whoami msg =
    Http.get
        (apiUrl "/whoami")
        whoamiDecoder
        |> Http.send msg


whoamiDecoder : Decoder UserId
whoamiDecoder =
    decode UserId
        |> required "id" Json.Decode.string
