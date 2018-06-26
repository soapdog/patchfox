module Page.Raw exposing (..)

import Dict exposing (Dict)
import Html as H
import Html.Attributes as HA
import Html.Styled exposing (..)
import Html.Styled.Attributes exposing (class, css, href, src)
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
        related =
            if (level + 1) <= 1 then
                case m.related of
                    Nothing ->
                        div [] []

                    Just l ->
                        restOfThreadView (level + 1) l users
            else
                div [] []

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
                , div [ class "media-right" ]
                    [ a [ href ("ssb:" ++ m.key) ] [ img [ src "/link.svg" ] [] ] ]
                ]
    in
    div
        [ class "card" ]
        [ div [ class "card-content" ]
            [ avatar
            , pre [] [ text <| Json.Encode.encode 2 m.content ]
            ]
        , related
        ]


restOfThreadView : Int -> List SSBClient.Message -> Dict String SSBClient.User -> Html msg
restOfThreadView level l users =
    div []
        (List.map (messageView level users) l)


view : Dict String SSBClient.User -> SSBClient.Message -> Html msg
view users message =
    let
        (SSBClient.Message m) =
            message
    in
    section
        [ class "section"
        ]
        [ div
            [ class "container" ]
            [ messageView 0 users message
            ]
        ]
