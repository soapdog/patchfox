module Page.Profile exposing (..)

import Fragments
import Html.Styled exposing (..)
import Html.Styled.Attributes exposing (class, css, href, src)
import Scuttlebutt.Client as SSBClient exposing (..)
import Types exposing (..)


messagesList : Users -> Messages -> List (Html Msg)
messagesList users messages =
    List.map (\m -> Fragments.messageCard users m) messages


accountInfo : ProfilePageModel -> Html Msg
accountInfo model =
    div
        [ class "media" ]
        [ div [ class "media-left" ]
            [ figure [ class "image is-48x48" ]
                [ img
                    [ src model.avatarImage ]
                    []
                ]
            ]
        , div [ class "media-content" ]
            [ p [ class "title is-4" ] [ text model.userName ]
            ]
        , div [ class "media-right" ]
            [ a [ href ("ssb:" ++ model.userId) ] [ img [ src "/link.svg" ] [] ] ]
        ]


view : Users -> ProfilePageModel -> Html Msg
view users model =
    section
        [ class "section"
        ]
        [ div
            [ class "container" ]
            [ div
                [ class "card" ]
                [ div [ class "card-content" ]
                    [ accountInfo model
                    ]
                ]
            , div [] <| messagesList users model.messages
            ]
        ]
