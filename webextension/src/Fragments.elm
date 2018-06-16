module Fragments exposing (..)

import Css exposing (..)
import Html.Styled exposing (..)
import Html.Styled.Attributes exposing (..)
import Scuttlebutt.Client as SSBClient
import Types exposing (..)


appHeader : SSBClient.User -> Html msg
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
            a
                [ class "navbar-item"
                , href "#/profile"
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
                    , a [ class "navbar-item", href "#/settings" ]
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
