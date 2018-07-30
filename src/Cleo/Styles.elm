module Cleo.Styles exposing (..)

import Color exposing (..)
import Style exposing (..)
import Style.Border as Border
import Style.Color as Color
import Style.Font as Font
import Style.Shadow as Shadow


type ButtonColour
    = Green
    | Grey


type Styles
    = Base
    | None
    | NavBar
    | Button ButtonColour
    | InputField
    | InputLabel
    | Line
    | Link
    | Error
    | MessageBox


type FontStack
    = SansSerif
    | Serif
    | Mono


stack : FontStack -> List Font
stack fontstack =
    case fontstack of
        SansSerif ->
            [ Font.font "Fira Sans"
            ]

        Serif ->
            [ Font.font "Garamond"
            ]

        Mono ->
            [ Font.font "Inconsolata"
            ]


styles : StyleSheet Styles variation
styles =
    styleSheet
        [ style Base
            [ Font.typeface <| stack SansSerif ]
        , style (Button Green)
            [ Border.rounded 3
            , Border.bottom 3
            , Color.background Color.green
            , Color.border Color.darkGreen
            , Color.text Color.white
            , Font.bold
            ]
        , style (Button Grey)
            [ Border.rounded 3
            , Border.bottom 1
            , Border.right 1
            , Color.background Color.lightGrey
            , Color.border Color.grey
            , Color.text Color.black
            , Font.weight 400
            ]
        , style NavBar
            [ Border.bottom 1
            , Color.border Color.blue
            ]
        , style MessageBox
            [ Border.all 1
            , Color.border Color.grey
            ]
        , style None []
        , style InputField
            [ Border.all 1
            , Border.rounded 3
            , Color.border Color.lightCharcoal
            ]
        , style InputLabel
            [ Color.text Color.darkCharcoal
            ]
        , style Line
            [ Color.background Color.lightGrey ]
        , style Link
            [ cursor "pointer"
            , hover
                [ Font.underline ]
            ]
        , style Error
            [ Color.text Color.red ]
        ]
