module Page.Thread exposing (..)

import Dict exposing (Dict)
import Html as H
import Html.Attributes as HA
import Html.Styled exposing (..)
import Html.Styled.Attributes exposing (class, css, src)
import Http
import Json.Decode as Decode
import Json.Encode exposing (encode)
import Markdown
import Regex
import Scuttlebutt.Client as SSBClient
import String.Extra exposing (..)
import Yarimoji as Ymoji


messageView : Int -> Dict String SSBClient.User -> SSBClient.Message -> Html msg
messageView level users (SSBClient.Message m) =
    let
        d =
            Debug.log "level" level

        likeDecoder =
            Decode.at [ "vote", "expression" ] Decode.string

        postDecoder =
            Decode.at [ "text" ] Decode.string

        contentIsPost =
            let
                decoderOp =
                    Decode.decodeValue postDecoder m.content
            in
            case decoderOp of
                Err _ ->
                    ""

                Ok s ->
                    replaceImages s
                        |> replaceMsgLinks
                        |> replaceMsgInlineLinks
                        |> replaceProfileLinks

        contentIsLike =
            let
                decoderOp =
                    Decode.decodeValue likeDecoder m.content
            in
            case decoderOp of
                Err _ ->
                    ""

                Ok s ->
                    author.name ++ " " ++ s

        markdownContent =
            case m.kind of
                Just "post" ->
                    contentIsPost

                Just "vote" ->
                    contentIsLike

                Just a ->
                    "Unknown content: ```" ++ encode 2 m.content ++ "```"

                Nothing ->
                    "No type: ```" ++ encode 2 m.content ++ "```"

        contentWithEmojis =
            markdownContent
                |> Ymoji.yariMojiTranslateAll

        content =
            Markdown.toHtml Nothing contentWithEmojis
                |> H.div [ HA.class "content has-text-left" ]

        related =
            if (level + 1) <= 1 then
                case m.related of
                    Nothing ->
                        div [] []

                    Just l ->
                        restOfThreadView (level + 1) l users
            else
                div [] []

        replaceImages s =
            replace """(&""" """(http://localhost:8989/blobs/get/&""" s

        replaceMsgLinks s =
            let
                urlEncoder match =
                    match
                        |> String.slice 1 (String.length match)
                        |> Http.encodeUri
                        |> (++) "(#/thread/"
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
                        |> (++) ("[" ++ match ++ "](#/thread/")
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

        date =
            SSBClient.timeAgo m.timestamp

        author =
            SSBClient.avatar m.author users

        avatar =
            div
                [ class "media" ]
                [ div [ class "media-left" ]
                    [ figure [ class "image is-48x48" ]
                        [ img
                            [ src author.image ]
                            []
                        ]
                    ]
                , div [ class "media-content" ]
                    [ p [ class "title is-4" ] [ text author.name ]
                    , p [ class "subtitle is-6" ] [ time [] [ text date ] ]
                    ]
                ]
    in
    div
        [ class "card" ]
        [ div [ class "card-content" ]
            [ avatar
            , fromUnstyled content
            ]
        , related
        ]


restOfThreadView : Int -> List SSBClient.Message -> Dict String SSBClient.User -> Html msg
restOfThreadView level l users =
    div []
        (List.map (messageView level users) l)


view : Dict String SSBClient.User -> SSBClient.Message -> Html msg
view users message =
    section
        [ class "section"
        ]
        [ div
            [ class "container" ]
            [ messageView 0 users message ]
        ]
