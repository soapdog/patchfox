port module Scuttlebutt.Client exposing (..)

import Date
import Date.Extra.Config.Config_en_au exposing (config)
import Date.Extra.Format as Format exposing (format, formatUtc, isoMsecOffsetFormat)
import Dict exposing (Dict)
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
    | AvatarReceived User


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


type alias User =
    { id : String
    , name : String
    , image : String
    }


relatedMessages : String -> Cmd msg
relatedMessages id =
    let
        d =
            Debug.log "relatedMessages" id
    in
    sendInfoOutside (RelatedMessages id)


avatar : String -> Dict String User -> User
avatar id users =
    let
        user =
            Dict.get id users
    in
    case user of
        Just u ->
            u

        Nothing ->
            User id id "/icon.png"


getAvatars : Message -> Cmd msg
getAvatars (Message m) =
    let
        related =
            case m.related of
                Just l ->
                    l

                Nothing ->
                    []

        rest =
            if List.isEmpty related then
                Cmd.none
            else
                Cmd.batch <| List.map (\i -> getAvatars i) related
    in
    Cmd.batch
        [ getAvatar m.author
        , rest
        ]


getAvatar : String -> Cmd msg
getAvatar id =
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

                "AvatarReceived" ->
                    case Decode.decodeValue avatarDecoder outsideInfo.data of
                        Ok entry ->
                            tagger <| AvatarReceived entry

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


avatarDecoder : Decoder User
avatarDecoder =
    Decode.map3 User
        (Decode.at [ "id" ] Decode.string)
        (Decode.at [ "name" ] Decode.string)
        (Decode.at [ "image" ] Decode.string)



{- AUXILIARY FUNCTIONS -}


ssblog : String -> a -> a
ssblog label value =
    let
        newLabel =
            "[ELM - SSB Client] " ++ label
    in
    Debug.log newLabel value


timeAgo : Int -> String
timeAgo timestamp =
    format config config.format.dateTime <|
        (Date.fromTime <| toFloat timestamp)
