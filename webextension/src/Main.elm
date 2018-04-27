module Main exposing (main)

import Html exposing (..)
import Http
import Navigation exposing (Location)
import Page.Blank
import Page.Thread
import Route exposing (..)
import Scuttlebutt.Commands.GetRelatedMessages exposing (..)
import Scuttlebutt.Types exposing (..)


type Msg
    = UrlChange Navigation.Location
    | RelatedMessages ApiResponse



-- UPDATE --


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
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
                                ( { model | currentPage = ThreadPage (MessageId id) }
                                , Cmd.none
                                )

        RelatedMessages response ->
            let
                a =
                    Debug.log "r" response
            in
            ( model, Cmd.none )



-- VIEW --


view : Model -> Html Msg
view model =
    case model.currentPage of
        BlankPage ->
            Page.Blank.view model.config

        ThreadPage msgid ->
            Page.Thread.view


init : Flags -> Location -> ( Model, Cmd Msg )
init flags location =
    ( { currentPage = BlankPage
      , config = flags
      }
    , Cmd.none
    )



-- MAIN --


main : Program Flags Model Msg
main =
    Navigation.programWithFlags UrlChange
        { view = view
        , update = update
        , init = init
        , subscriptions = \_ -> Sub.none
        }
