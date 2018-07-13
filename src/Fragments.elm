module Fragments exposing (..)

import Css exposing (..)
import Dict exposing (Dict)
import Html as H
import Html.Attributes as HA
import Html.Styled exposing (..)
import Html.Styled.Attributes exposing (attribute, class, css, href, src)
import Html.Styled.Events exposing (onClick)
import Http exposing (encodeUri)
import Json.Decode as Decode
import Json.Encode exposing (encode)
import Markdown
import Regex
import Route
import Scuttlebutt.Client as SSBClient exposing (..)
import String.Extra exposing (..)
import Types exposing (..)
import Yarimoji as Ymoji


appHeader : SSBClient.User -> Html Msg
appHeader user =
    let
        burger =
            div [ class "navbar-burger" ]
                [ span [ attribute "aria-hidden" "true" ] []
                , span [ attribute "aria-hidden" "true" ] []
                , span [ attribute "aria-hidden" "true" ] []
                ]

        brand =
            div
                [ class "navbar-brand" ]
                [ avatar
                , burger
                ]

        avatar =
            let
                userUrl =
                    "#/profile/" ++ encodeUri user.id
            in
            a
                [ class "navbar-item"
                , href userUrl
                ]
                [ img
                    [ src user.image
                    , css
                        [ borderRadius (pct 50)
                        ]
                    ]
                    []
                , h2
                    [ class "subtitle"
                    , css
                        [ marginLeft (px 10)
                        ]
                    ]
                    [ text user.name ]
                ]

        menu =
            div [ class "navbar-menu" ]
                [ div
                    [ class "navbar-end" ]
                    [ a [ class "navbar-item", href "#/public" ] [ text "Public" ]
                    , a [ class "navbar-item", href "#/mentions" ] [ text "Mentions" ]
                    , a [ class "navbar-item", href "#/profile" ] [ text "Profile" ]
                    , a [ class "navbar-item", onClick ActionOpenOptionsPage ]
                        [ img [ src "/settings.svg" ] [] ]
                    ]
                ]
    in
    nav
        [ class "navbar"
        , attribute "role" "navigation"
        , attribute "aria-label" "main navigation"
        ]
        [ brand
        , menu
        ]


processPostContent : MessageContent -> Html Msg
processPostContent c =
    let
        markdownContent =
            let
                decoderOp =
                    Decode.decodeValue postDecoder c
            in
            case decoderOp of
                Err _ ->
                    ""

                Ok s ->
                    replaceImages s
                        |> replaceMsgLinks
                        |> replaceMsgInlineLinks
                        |> replaceProfileLinks

        contentWithEmojis =
            markdownContent
                |> Ymoji.yariMojiTranslateAll

        content =
            Markdown.toHtml Nothing contentWithEmojis
                |> H.div [ HA.class "content has-text-left" ]

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
    fromUnstyled content


messageCard : Users -> Message -> Html Msg
messageCard users (Message msg) =
    case msg.kind of
        Just "post" ->
            postCard users (Message msg)

        Just "vote" ->
            voteCard users (Message msg)

        Just a ->
            genericCard <| "Unknown type: " ++ a ++ " ```" ++ encode 2 msg.content ++ "```"

        Nothing ->
            genericCard <| "No type: ```" ++ encode 2 msg.content ++ "```"


genericCard : String -> Html Msg
genericCard msg =
    div
        [ class "card" ]
        [ div [ class "card-content" ]
            [ text msg
            ]
        ]


voteCard : Users -> Message -> Html Msg
voteCard users msg =
    div
        [ class "card" ]
        [ div [ class "card-content" ]
            [ text "LIKED"
            ]
        ]


postCard : Users -> Message -> Html Msg
postCard users (Message msg) =
    let
        content =
            processPostContent msg.content

        date =
            timeAgo msg.timestamp

        author =
            SSBClient.avatar users msg.author

        openAuthorProfile =
            Route.fromUserId msg.author

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
                , div [ class "media-right" ]
                    [ a [ href ("ssb:" ++ msg.key) ] [ img [ src "/link.svg" ] [] ] ]
                ]
    in
    div
        [ class "card" ]
        [ div [ class "card-content" ]
            [ avatar
            , content
            ]
        ]
