module Page.Blank exposing (..)

import Html.Styled exposing (..)
import Html.Styled.Attributes exposing (..)
import Route
import Types exposing (..)


view : Flags -> Html msg
view config =
    let
        link =
            Route.toUrl <| Thread "%JLDfIU7CeO7ZDsHz/4RGcysf5X/R7dgG9pZ3rmMDDcw=.sha256"
    in
    div []
        [ h1 [] [ text "blank page" ]
        , a [ href link ] [ text "go to msg" ]
        ]
