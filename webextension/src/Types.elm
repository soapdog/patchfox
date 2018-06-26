module Types exposing (..)

import Dict exposing (Dict)
import Scuttlebutt.Client as SSBClient


type alias Flags =
    { error : Maybe String
    , user : SSBClient.User
    }


type alias Model =
    { currentPage : Page
    , config : Flags
    , users : Dict String SSBClient.User
    }



{- Page to use in model
   This variant stores data too!
-}


type Page
    = BlankPage
    | ThreadPage SSBClient.Thread
    | LoadingPage
    | RawPage SSBClient.Thread



{- typesafe variant of valid urls -}


type Route
    = Blank
    | Thread String
    | Web String
    | FirstResponder String
    | Raw String
