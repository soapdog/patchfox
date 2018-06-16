module Page.Thread exposing (..)

import Css exposing (..)
import Date
import Dict exposing (Dict)
import Html.Attributes as HA
import Html.Styled exposing (..)
import Html.Styled.Attributes exposing (class, css, src)
import Json.Decode as Decode
import Markdown
import Scuttlebutt.Client as SSBClient
import String.Extra exposing (..)


messageView : Dict String SSBClient.User -> SSBClient.Message -> Html msg
messageView users (SSBClient.Message m) =
    let
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
                    replaceMsgLinks <| replaceImages s

        contentIsLike =
            let
                decoderOp =
                    Decode.decodeValue likeDecoder m.content
            in
            case decoderOp of
                Err _ ->
                    ""

                Ok s ->
                    m.author ++ " " ++ s

        content =
            case m.kind of
                Just "post" ->
                    contentIsPost

                Just "vote" ->
                    contentIsLike

                Just a ->
                    "Unknown content: " ++ a

                Nothing ->
                    "No type: " ++ m.key

        related =
            case m.related of
                Nothing ->
                    div [] []

                Just l ->
                    restOfThreadView l users

        replaceImages s =
            replace """(&""" """(http://localhost:8989/blobs/get/&""" s

        replaceMsgLinks s =
            replace """(%""" """(#/thread/%""" s

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
            , fromUnstyled (Markdown.toHtml [ HA.class "content has-text-justified" ] content)
            ]
        , related
        ]


restOfThreadView : List SSBClient.Message -> Dict String SSBClient.User -> Html msg
restOfThreadView l users =
    div []
        (List.map (messageView users) l)


view : Dict String SSBClient.User -> SSBClient.Message -> Html msg
view users message =
    section
        [ class "section"
        ]
        [ div
            [ class "container" ]
            [ messageView users message ]
        ]
