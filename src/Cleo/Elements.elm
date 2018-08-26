module Cleo.Elements exposing (..)

import Cleo.Styles exposing (..)
import Element exposing (..)
import Element.Attributes exposing (..)
import Element.Events exposing (..)
import Element.Input as Input
import Html
import Html.Attributes as HA
import Http
import Markdown
import Scuttlebutt.Client as SSBClient
import Scuttlebutt.Messages as SSBMessages
import Types exposing (..)


postElement : AppState -> PostMessage -> Element Styles v msg
postElement a m =
    let
        avatar =
            SSBClient.avatar a.users m.author

        avatarSide =
            link
                ("#/profile/"
                    ++ Http.encodeUri m.author
                )
            <|
                row None
                    [ verticalCenter, spacing 10 ]
                <|
                    [ image None [ height (px 48) ] { src = avatar.image, caption = avatar.name }
                    , el None [] <| text avatar.name
                    ]

        messageHeader =
            row None
                [ spread, spacing 20 ]
            <|
                [ el None [] <| avatarSide
                , el None [] <| text (SSBClient.timeAgo m.date)
                ]

        messageContent =
            paragraph None
                []
            <|
                [ html <|
                    Html.div [ HA.class "post-content" ] <|
                        Markdown.toHtml Nothing <|
                            SSBClient.fixMarkdown m.content
                ]

        feedLink =
            "#/thread/" ++ Http.encodeUri m.key

        composeLink =
            "#/compose/" ++ Http.encodeUri m.key

        messageFooter =
            row None
                [ spread, spacing 20 ]
            <|
                [ link composeLink (el Link [] (text "Reply"))
                , link feedLink (el Link [] (text "Link"))
                ]
    in
    column MessageBox
        [ paddingXY 20 20, spread, spacing 20 ]
    <|
        [ messageHeader
        , messageContent
        , messageFooter
        ]
