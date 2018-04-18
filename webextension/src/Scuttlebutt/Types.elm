module Scuttlebutt.Types exposing (..)

import Json.Decode as Decode exposing (Value)


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
