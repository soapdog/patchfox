module Types exposing (..)

import Dict exposing (Dict)
import Navigation exposing (Location)
import Scuttlebutt.Client as SSBClient exposing (..)


type Msg
    = UrlChange Navigation.Location
    | Outside InfoForElm
    | LogErr String
    | ActionOpenOptionsPage


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
    | ThreadPage Message
    | LoadingPage
    | ProfilePage ProfilePageModel



{- typesafe variant of valid urls -}


type Route
    = Blank
    | Thread String
    | Web String
    | FirstResponder String
    | Profile String



{- page models -}


type alias ProfilePageModel =
    { userId : String
    , userName : String
    , avatarImage : String
    , description : String
    , messages : List Message
    }
