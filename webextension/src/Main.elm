module Main exposing (main)

import Css exposing (..)
import Html.Styled exposing (..)
import Http
import Navigation exposing (Location)
import Page.Blank
import Page.Thread
import Route exposing (..)
import Scuttlebutt.Client exposing (..)
import Types exposing (..)


type Msg
    = UrlChange Navigation.Location
    | Outside InfoForElm
    | LogErr String



-- UPDATE --


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        LogErr msg ->
            let
                d =
                    Debug.log "Error" msg
            in
            ( model, Cmd.none )

        Outside infoForElm ->
            case infoForElm of
                ThreadReceived thread ->
                    ( { model | currentPage = ThreadPage thread }, Cmd.none )

        UrlChange newLocation ->
            case Route.parse newLocation of
                Nothing ->
                    let
                        message =
                            Debug.log "invalid URL: " newLocation.hash
                    in
                    ( model
                    , Route.modifyUrl model.currentPage
                    )

                Just validRoute ->
                    if Route.isEqual validRoute model.currentPage then
                        ( model, Cmd.none )
                    else
                        case validRoute of
                            Blank ->
                                ( { model | currentPage = BlankPage }
                                , Cmd.none
                                )

                            Thread id ->
                                ( { model | currentPage = BlankPage }
                                , relatedMessages <| Maybe.withDefault "" <| Http.decodeUri id
                                )



-- VIEW --


view : Model -> Html Msg
view model =
    case model.currentPage of
        BlankPage ->
            Page.Blank.view model.config

        ThreadPage t ->
            Page.Thread.view t


loadInitialRoute : Location -> Cmd Msg
loadInitialRoute location =
    Navigation.modifyUrl location.hash


init : Flags -> Location -> ( Model, Cmd Msg )
init flags location =
    ( { currentPage = BlankPage
      , config = flags
      }
    , loadInitialRoute location
    )



-- SUBSCRIPTIONS --


subscriptions : Model -> Sub Msg
subscriptions model =
    getInfoFromOutside Outside LogErr



-- MAIN --


main : Program Flags Model Msg
main =
    Navigation.programWithFlags UrlChange
        { view = view >> toUnstyled
        , update = update
        , init = init
        , subscriptions = subscriptions
        }
