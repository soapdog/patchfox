module Scuttlebutt.Messages exposing (..)

import Json.Decode as Decode exposing (Value)
import Json.Decode.Pipeline exposing (..)


type Message
    = MPost MPostData
    | MGeneric MCommonFields
    | MVote MVoteData


type Messages
    = Messages (List Message)


type alias MCommonFields =
    { key : String
    , previous : String
    , author : String
    , sequence : Int
    , timestamp : Float
    , related : Messages
    }


type alias MPostData =
    { common : MCommonFields
    , content : String
    }


type alias MVoteData =
    { common : MCommonFields
    , expression : String
    }


decodeMessages : Decode.Decoder Messages
decodeMessages =
    Decode.map Messages <| Decode.list (Decode.lazy (\_ -> decodeMessage))


decodeMessage : Decode.Decoder Message
decodeMessage =
    Decode.lazy
        (\_ ->
            Decode.maybe (Decode.at [ "value", "content", "type" ] Decode.string)
                |> Decode.andThen decodeNode
        )


decodeNode : Maybe String -> Decode.Decoder Message
decodeNode nodeType =
    case nodeType of
        Just "post" ->
            decodeMPost

        Just "vote" ->
            decodeMVote

        Just _ ->
            decodeMGeneric

        Nothing ->
            decodeMGeneric


decodeCommonFields : Decode.Decoder MCommonFields
decodeCommonFields =
    decode MCommonFields
        |> required "key" Decode.string
        |> optionalAt [ "value", "previous" ] Decode.string ""
        |> requiredAt [ "value", "author" ] Decode.string
        |> requiredAt [ "value", "sequence" ] Decode.int
        |> requiredAt [ "value", "timestamp" ] Decode.float
        |> optional "related" (Decode.lazy (\_ -> decodeMessages)) (Messages [])


decodeMGeneric : Decode.Decoder Message
decodeMGeneric =
    Decode.map MGeneric decodeCommonFields


decodeMPost : Decode.Decoder Message
decodeMPost =
    let
        innerDecoder =
            decode MPostData
                |> custom decodeCommonFields
                |> requiredAt [ "value", "content", "text" ] Decode.string
    in
    Decode.map MPost innerDecoder


decodeMVote : Decode.Decoder Message
decodeMVote =
    let
        innerDecoder =
            decode MVoteData
                |> custom decodeCommonFields
                |> optionalAt [ "value", "content", "vote", "expression" ] Decode.string "yup"
    in
    Decode.map MVote innerDecoder
