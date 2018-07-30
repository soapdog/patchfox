module Styles exposing (..)

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
    | Button ButtonColour
    | DetailPanel
    | Error
    | InputField
    | InputLabel
    | Line
    | Link
    | Menu
    | MenuItem
    | NavBar
    | None
    | PlanNodeBox
    | SectionHeader
    | SubMenu


styles : StyleSheet Styles variation
styles =
    styleSheet
        [ style Base
            [ Font.typeface [ Font.sansSerif ] ]
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
            , Font.bold
            ]
        , style DetailPanel
            [ Border.left 1
            , Color.border Color.grey
            ]
        , style Error
            [ Color.text Color.red ]
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
        , style Menu
            [ Border.left 2
            , Color.background Color.white
            , Color.border Color.grey
            , Font.bold
            , Font.typeface [ Font.sansSerif ]
            , Shadow.simple
            ]
        , style MenuItem
            [ cursor "pointer" ]
        , style NavBar
            [ Border.bottom 1
            , Color.border Color.blue
            ]
        , style None [] -- It's handy to have a blank style
        , style PlanNodeBox
            [ Border.bottom 1
            , Color.border Color.lightBlue
            , hover
                [ Color.background Color.lightYellow
                ]
            ]
        , style SectionHeader
            [ Border.bottom 1
            , Color.border Color.lightGray
            ]
        , style SubMenu
            [ Border.rounded 5
            , Border.all 2
            , Border.solid
            , Color.border Color.blue
            ]
        ]
