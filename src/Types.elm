module Types exposing (..)

import Dict exposing (..)
import Scuttlebutt.Client as SSBClient


type alias AppState =
    { user : Maybe SSBClient.User
    , remote : String
    , keys : String
    , manifest : String
    , users : Dict String SSBClient.User
    }


type alias PostMessage =
    { key : String
    , date : Int
    , author : String
    , content : String
    , votes : List String
    }
