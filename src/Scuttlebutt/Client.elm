port module Scuttlebutt.Client exposing (..)

import Date
import Date.Extra.Config.Config_en_au exposing (config)
import Date.Extra.Format as Format exposing (format, formatUtc, isoMsecOffsetFormat)
import Dict exposing (Dict)
import Http
import Json.Decode as Decode exposing (Decoder, float, int, string)
import Json.Encode as Encode exposing (Value)
import Regex
import Scuttlebutt.Messages exposing (..)
import String.Extra exposing (..)


{- PORTS -}


port infoForOutside : GenericOutsideData -> Cmd msg


port infoForElm : (GenericOutsideData -> msg) -> Sub msg



{- TYPES -}


type alias GenericOutsideData =
    { tag : String, data : Value }


type alias Configuration =
    { remote : String
    , keys : String
    , manifest : String
    }


type InfoForOutside
    = RelatedMessages String
    | Avatar String
    | CheckTypeAndRedirect String
    | WebResolve String
    | OpenOptionsPage
    | SaveConfiguration Configuration
    | PublicFeed


type InfoForElm
    = ThreadReceived Message
    | FeedReceived Messages
    | AvatarReceived User
    | CurrentUser User
    | CantConnectToSBOT String


type alias User =
    { id : String
    , name : String
    , image : String
    }


type alias Users =
    Dict String User


type alias MessageContent =
    Value


publicFeed : Cmd msg
publicFeed =
    sendInfoOutside PublicFeed


relatedMessages : String -> Cmd msg
relatedMessages id =
    sendInfoOutside (RelatedMessages id)


checkTypeAndRedirect : String -> Cmd msg
checkTypeAndRedirect id =
    sendInfoOutside (CheckTypeAndRedirect id)


ssbWebGo : String -> Cmd msg
ssbWebGo id =
    sendInfoOutside (WebResolve id)


openOptionsPage : Cmd msg
openOptionsPage =
    sendInfoOutside OpenOptionsPage


saveConfiguration : { c | remote : String, keys : String, manifest : String } -> Cmd msg
saveConfiguration c =
    let
        cc =
            Configuration c.remote c.keys c.manifest
    in
    sendInfoOutside (SaveConfiguration cc)


avatar : Dict String User -> String -> User
avatar users id =
    let
        user =
            Dict.get id users
    in
    case user of
        Just u ->
            u

        Nothing ->
            User id id "images/icon.png"


getAvatars : Dict String User -> List String -> Cmd msg
getAvatars users ms =
    Cmd.batch <| List.map (getAvatar users) ms


getAvatar : Dict String User -> String -> Cmd msg
getAvatar users id =
    let
        user =
            Dict.get id users

        d =
            Debug.log "avatar from elm" id
    in
    case user of
        Nothing ->
            sendInfoOutside (Avatar id)

        Just u ->
            Debug.log ("Avatar Cached for" ++ id) Cmd.none


sendInfoOutside : InfoForOutside -> Cmd msg
sendInfoOutside info =
    case info of
        PublicFeed ->
            infoForOutside { tag = "PublicFeed", data = Encode.null }

        RelatedMessages id ->
            infoForOutside { tag = "RelatedMessages", data = Encode.string id }

        CheckTypeAndRedirect id ->
            infoForOutside { tag = "CheckTypeAndRedirect", data = Encode.string id }

        Avatar id ->
            infoForOutside { tag = "Avatar", data = Encode.string id }

        WebResolve id ->
            infoForOutside { tag = "WebResolve", data = Encode.string id }

        OpenOptionsPage ->
            infoForOutside { tag = "OpenOptionsPage", data = Encode.null }

        SaveConfiguration c ->
            let
                configurationEncoded =
                    Encode.object
                        [ ( "remote", Encode.string c.remote )
                        , ( "keys", Encode.string c.keys )
                        , ( "manifest", Encode.string c.manifest )
                        ]
            in
            infoForOutside { tag = "SaveConfiguration", data = configurationEncoded }


getInfoFromOutside : (InfoForElm -> msg) -> (String -> msg) -> Sub msg
getInfoFromOutside tagger onError =
    infoForElm
        (\outsideInfo ->
            case outsideInfo.tag of
                "ThreadReceived" ->
                    case Decode.decodeValue decodeMessage outsideInfo.data of
                        Ok entry ->
                            tagger <| ThreadReceived entry

                        Err e ->
                            onError e

                "FeedReceived" ->
                    case Decode.decodeValue decodeMessages outsideInfo.data of
                        Ok entry ->
                            tagger <| FeedReceived entry

                        Err e ->
                            onError e

                "AvatarReceived" ->
                    case Decode.decodeValue avatarDecoder outsideInfo.data of
                        Ok entry ->
                            tagger <| AvatarReceived entry

                        Err e ->
                            onError e

                "CurrentUser" ->
                    case Decode.decodeValue avatarDecoder outsideInfo.data of
                        Ok entry ->
                            tagger <| CurrentUser entry

                        Err e ->
                            onError e

                "CantConnectToSBOT" ->
                    case Decode.decodeValue Decode.string outsideInfo.data of
                        Ok entry ->
                            tagger <| CantConnectToSBOT entry

                        Err e ->
                            onError e

                _ ->
                    onError <| "Unexpected info from outside: " ++ toString outsideInfo
        )


avatarDecoder : Decoder User
avatarDecoder =
    Decode.map3 User
        (Decode.at [ "id" ] Decode.string)
        (Decode.at [ "name" ] Decode.string)
        (Decode.at [ "image" ] Decode.string)



{- AUXILIARY FUNCTIONS -}


timeAgo : Int -> String
timeAgo timestamp =
    format config config.format.dateTime <|
        (Date.fromTime <| toFloat timestamp)


fixMarkdown m =
    let
        replaceImages s =
            replace """(&""" """(http://localhost:8989/blobs/get/&""" s

        replaceMsgLinks s =
            let
                urlEncoder match =
                    match
                        |> String.slice 1 (String.length match)
                        |> Http.encodeUri
                        |> (++) "(#/view/"
                        |> Debug.log "url"
            in
            Regex.replace Regex.All
                (Regex.regex "\\(\\%([^\\)]+)")
                (\{ match } -> urlEncoder match)
                s

        replaceMsgInlineLinks s =
            let
                urlEncoder match =
                    match
                        |> String.slice 0 (String.length match)
                        |> Http.encodeUri
                        |> (++) ("[" ++ match ++ "](#/view/")
                        |> Debug.log "inline url"
            in
            Regex.replace Regex.All
                (Regex.regex "\\%(.*)=.sha256")
                (\{ match } -> urlEncoder match ++ ")")
                s

        replaceProfileLinks s =
            let
                urlEncoder match =
                    match
                        |> String.slice 1 (String.length match)
                        |> Http.encodeUri
                        |> (++) "(#/profile/"
                        |> Debug.log "url"
            in
            Regex.replace Regex.All
                (Regex.regex "\\(\\@([^\\)]+)")
                (\{ match } -> urlEncoder match)
                s
    in
    replaceImages m
        |> replaceMsgLinks
        |> replaceMsgInlineLinks
        |> replaceProfileLinks
