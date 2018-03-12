module Main exposing (..)

import Html exposing (Html, button, div, text)

-- We need to handle click event
import Html.Events exposing (onClick)

-- Here we are defining two possible values
type Msg = Increment | Decrement

view : a -> Html Msg
view model =
  div []
    [ button [ onClick Decrement ] [ text "-" ]
    , div [] [ text (toString model) ]
    , button [ onClick Increment ] [ text "+" ]
    ]

update : Msg -> number -> number
update msg model =
    case msg of
        Increment ->
            model + 1

        Decrement ->
            model - 1


main :  Program Never number Msg
main =
    Html.beginnerProgram { model = 0, view = view, update = update }