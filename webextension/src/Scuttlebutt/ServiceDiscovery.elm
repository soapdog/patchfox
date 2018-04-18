module Scuttlebutt.ServiceDiscovery exposing (..)

import Delay
import Html exposing (..)
import Http
import Json.Decode exposing (Decoder)
import Json.Decode.Pipeline exposing (..)
import Scuttlebutt.Helpers exposing (apiUrl, discoveryUrl)
import Time exposing(millisecond)



main : Program Never Model Msg
main =
    Html.program
        { view = view
        , update = update
        , init = ( initialModel, attemptServiceDiscovery )
        , subscriptions = \_ -> Sub.none
        }


type DiscoveryState
    = NoAnswer
    | BrokenAnswer String
    | Denied
    | Pending Int
    | Granted String
    | NetworkError
    | CantStartNativeApp
    | AttemptingConnection


type alias Model =
    { discoveryState : DiscoveryState
    }


initialModel : Model
initialModel =
    { discoveryState = AttemptingConnection
    }


type alias ServiceDiscoveryResponse =
    { status : String
    , retry : Int
    , server : String
    }


whatIsTheDiscoveryState : Model -> DiscoveryState
whatIsTheDiscoveryState model =
    model.discoveryState


attemptServiceDiscovery : Cmd Msg
attemptServiceDiscovery =
    let
        request =
            Http.get discoveryUrl serviceDiscoveryResponseDecoder
    in
    Http.send HandleDiscoveryResponse request


serviceDiscoveryResponseDecoder : Decoder ServiceDiscoveryResponse
serviceDiscoveryResponseDecoder =
    decode ServiceDiscoveryResponse
        |> required "status" Json.Decode.string
        |> optional "retry" Json.Decode.int 0
        |> optional "server" Json.Decode.string ""


type Msg
    = HandleDiscoveryResponse (Result Http.Error ServiceDiscoveryResponse)
    | RetryConnection


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        RetryConnection ->
            ( { model | discoveryState = AttemptingConnection }, attemptServiceDiscovery )

        HandleDiscoveryResponse result ->
            case Debug.log "r" result of
                Ok results ->
                    case results.status of
                        "pending" ->
                            { model | discoveryState = Pending results.retry } ! [ Delay.after (toFloat results.retry) millisecond RetryConnection ]

                        "denied" ->
                            ( { model | discoveryState = Denied }, Cmd.none )

                        "granted" ->
                            ( { model | discoveryState = Granted results.server }, Cmd.none )

                        _ ->
                            ( { model | discoveryState = BrokenAnswer "unknown status" }, Cmd.none )

                Err error ->
                    case error of
                        Http.BadPayload msg _ ->
                            ( { model | discoveryState = BrokenAnswer msg }, Cmd.none )

                        Http.NetworkError ->
                            ( { model | discoveryState = NetworkError }, Cmd.none )

                        Http.Timeout ->
                            ( { model | discoveryState = NoAnswer }, Cmd.none )

                        _ ->
                            ( { model | discoveryState = BrokenAnswer "something strange happened" }, Cmd.none )


view : Model -> Html Msg
view model =
    h1 [] [ text "nada" ]
