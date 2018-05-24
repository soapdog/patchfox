port module Scuttlebutt.Client exposing (..)

import Json.Decode as Decode exposing (Decoder, float, int, string)
import Json.Encode as Encode exposing (Value)


{- PORTS -}


port infoForOutside : GenericOutsideData -> Cmd msg


port infoForElm : (GenericOutsideData -> msg) -> Sub msg



{- TYPES -}


type alias GenericOutsideData =
    { tag : String, data : Value }


type InfoForOutside
    = RelatedMessages String
    | Avatar String


type InfoForElm
    = ThreadReceived Thread


type Message
    = Message
        { key : String
        , previous : Maybe String
        , author : String
        , sequence : Int
        , timestamp : Int
        , content : Value
        , kind : Maybe String
        , related : Maybe (List Message)
        }


type alias Thread =
    Message


relatedMessages : String -> Cmd msg
relatedMessages id =
    let
        d =
            Debug.log "relatedMessages" id
    in
    sendInfoOutside (RelatedMessages id)


avatar : String -> Cmd msg
avatar id =
    let
        d =
            Debug.log "avatar from elm" id
    in
    sendInfoOutside (Avatar id)


sendInfoOutside : InfoForOutside -> Cmd msg
sendInfoOutside info =
    case info of
        RelatedMessages id ->
            infoForOutside { tag = "RelatedMessages", data = Encode.string id }

        Avatar id ->
            infoForOutside { tag = "Avatar", data = Encode.string id }


getInfoFromOutside : (InfoForElm -> msg) -> (String -> msg) -> Sub msg
getInfoFromOutside tagger onError =
    infoForElm
        (\outsideInfo ->
            case outsideInfo.tag of
                "ThreadReceived" ->
                    case Decode.decodeValue messageDecoder outsideInfo.data of
                        Ok entry ->
                            tagger <| ThreadReceived entry

                        Err e ->
                            onError e

                _ ->
                    onError <| "Unexpected info from outside: " ++ toString outsideInfo
        )



{- ENCODERS & DECODERS -}


messageDecoder : Decoder Message
messageDecoder =
    let
        messageConstructor key previous author sequence timestamp content kind related =
            Message
                { key = key
                , previous = previous
                , author = author
                , sequence = sequence
                , timestamp = timestamp
                , content = content
                , kind = kind
                , related = related
                }
    in
    Decode.map8 messageConstructor
        (Decode.at [ "key" ] Decode.string)
        (Decode.at [ "value", "previous" ] <| Decode.nullable Decode.string)
        (Decode.at [ "value", "author" ] Decode.string)
        (Decode.at [ "value", "sequence" ] Decode.int)
        (Decode.at [ "value", "timestamp" ] Decode.int)
        (Decode.at [ "value", "content" ] Decode.value)
        (Decode.at [ "value", "content", "type" ] <| Decode.nullable Decode.string)
        (Decode.maybe (Decode.at [ "related" ] (Decode.list (Decode.lazy (\_ -> messageDecoder)))))



{- AUXILIARY FUNCTIONS -}


ssblog : String -> a -> a
ssblog label value =
    let
        newLabel =
            "[ELM - SSB Client] " ++ label
    in
    Debug.log newLabel value
