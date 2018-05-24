module Page.Thread exposing (..)

import Css exposing (..)
import Date
import Html.Styled exposing (..)
import Html.Styled.Attributes exposing (css)
import Json.Decode as Decode
import Markdown
import Scuttlebutt.Client as SSBClient
import String.Extra exposing (..)


messageView : SSBClient.Message -> Html msg
messageView (SSBClient.Message m) =
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
                    restOfThreadView l

        replaceImages s =
            replace """(&""" """(http://localhost:8989/blobs/get/&""" s

        replaceMsgLinks s =
            replace """(%""" """(ssb:%""" s

        date =
            Date.fromTime (toFloat <| m.timestamp)
    in
    div
        []
        [ h3 [] [ text m.author ]
        , strong [] [ text (toString date) ]
        , fromUnstyled (Markdown.toHtml [] content)
        , hr [] []
        , related
        ]


restOfThreadView : List SSBClient.Message -> Html msg
restOfThreadView l =
    div []
        (List.map messageView l)


view : SSBClient.Message -> Html msg
view m =
    div
        [ css
            [ textAlign left
            , width (pct 70)
            , paddingLeft (px 60)
            , paddingRight (px 60)
            ]
        ]
        [ messageView m
        ]
