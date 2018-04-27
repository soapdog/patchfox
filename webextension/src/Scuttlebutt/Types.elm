module Scuttlebutt.Types exposing (..)

import Json.Decode as Decode exposing (Value)


type alias Flags =
    { remote : String
    , error : String
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
    | ThreadPage MessageId



{- typesafe variant of valid urls -}


type Route
    = Blank
    | Thread String


type MessageId
    = MessageId String


type UserId
    = UserId String


type alias Message =
    { previous : Maybe MessageId
    , author : UserId
    , sequence : Int
    , timestamp : Int
    , content : Value
    , kind : Maybe String
    }


type alias Thread =
    List Message


type alias ApiResponse =
    { cmd : String
    , error : String
    , data : ApiValueWrapper
    }


type alias ApiValueWrapper =
    { key : String
    , value : Decode.Value
    }
