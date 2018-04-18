module Scuttlebutt.Commands.GetRelatedMessages exposing (getRelatedMessages)

import Http
import Json.Decode exposing (Decoder)
import Json.Decode.Pipeline exposing (decode, required)
import Json.Encode
import Scuttlebutt.Helpers exposing (apiUrl)
import Scuttlebutt.Types exposing (..)


type alias RelatedMessages =
    { message : Message
    , related : Thread
    }



getRelatedMessages : MessageId -> (Result Http.Error ApiResponse -> msg) -> Cmd msg
getRelatedMessages (MessageId msgid) msg =
    let
        body =
            relatedMessageRequestEncoder msgid |> Http.jsonBody
    in
    Http.post
        (apiUrl "/get-related-messages")
        body
        apiResponseDecoder
        |> Http.send msg


apiResponseDecoder : Decoder ApiResponse
apiResponseDecoder =
    decode ApiResponse
        |> required "cmd" Json.Decode.string
        |> required "error" Json.Decode.string
        |> required "data" apiWrapperDecoder

apiWrapperDecoder : Decoder ApiValueWrapper
apiWrapperDecoder =
  decode ApiValueWrapper
    |> required "key" Json.Decode.string
    |> required "value" Json.Decode.value



relatedMessageRequestEncoder : String -> Json.Encode.Value
relatedMessageRequestEncoder msgid =
    let
        data =
            [ ( "id", Json.Encode.string msgid ) ]

        container =
            [ ( "data", Json.Encode.object data ) ]
    in
    container |> Json.Encode.object
