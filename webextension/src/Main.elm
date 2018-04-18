module Main exposing (main)

import Html exposing (..)
import Http
import Navigation exposing (Location)
import Page.Blank
import Page.Thread
import Route exposing (..)
import Scuttlebutt.Commands.GetRelatedMessages exposing (..)
import Scuttlebutt.Types exposing (..)


type alias Model =
    { currentPage : Route.Page
    }


initialModel : Model
initialModel =
    { currentPage = Route.BlankPage
    }


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
                            Route.Blank ->
                                ( { model | currentPage = Route.BlankPage }
                                , Cmd.none
                                )

                            Route.Thread id ->
                                ( { model | currentPage = Route.ThreadPage (MessageId id) }
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
        Route.BlankPage ->
            Page.Blank.view

        Route.ThreadPage msgid ->
            Page.Thread.view



-- MAIN --


main : Program Never Model Msg
main =
    Navigation.program UrlChange
        { view = view
        , update = update
        , init = \_ -> ( initialModel, Cmd.none )
        , subscriptions = \_ -> Sub.none
        }
