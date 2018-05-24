module Types exposing (..)

import Scuttlebutt.Client as SSBClient


type alias Flags =
    { error : Maybe String
    }


type alias Model =
    { currentPage : Page
    , config : Flags
    }



{- Page to use in model
   This variant stores data too!
-}


type Page
    = BlankPage
    | ThreadPage SSBClient.Thread



{- typesafe variant of valid urls -}


type Route
    = Blank
    | Thread String
