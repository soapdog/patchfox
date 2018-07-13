module Main exposing (main)

import Dict
import Fragments exposing (..)
import Html.Styled exposing (..)
import Http
import Navigation exposing (Location)
import Page.Blank
import Page.Profile
import Page.Thread
import Route exposing (..)
import Scuttlebutt.Client exposing (..)
import Types exposing (..)


-- UPDATE --


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ActionOpenOptionsPage ->
            ( model, openOptionsPage )

        LogErr msg ->
            let
                d =
                    Debug.log "Error" msg
            in
            ( model, Cmd.none )

        Outside infoForElm ->
            case infoForElm of
                ThreadReceived thread ->
                    ( { model | currentPage = ThreadPage thread }, getAvatars model.users thread )

                AvatarReceived user ->
                    let
                        newUsers =
                            Dict.insert user.id user model.users
                    in
                    ( { model | users = newUsers }, Cmd.none )

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
                    case validRoute of
                        FirstResponder id ->
                            let
                                d =
                                    Debug.log "First Responder" id

                                v =
                                    Http.decodeUri d
                            in
                            ( { model | currentPage = LoadingPage }
                            , checkTypeAndRedirect <| Maybe.withDefault id <| Debug.log "after decode" v
                            )

                        Blank ->
                            ( { model | currentPage = BlankPage }
                            , Cmd.none
                            )

                        Thread id ->
                            let
                                d =
                                    Debug.log "thread" id
                            in
                            ( { model | currentPage = LoadingPage }
                            , relatedMessages <| Maybe.withDefault id <| Http.decodeUri id
                            )

                        Profile id ->
                            let
                                d =
                                    Debug.log "profile" id
                            in
                            ( { model | currentPage = LoadingPage }
                            , relatedMessages <| Maybe.withDefault id <| Http.decodeUri id
                            )

                        Web id ->
                            ( { model | currentPage = BlankPage }
                            , ssbWebGo <| Maybe.withDefault id <| Http.decodeUri id
                            )



-- VIEW --


view : Model -> Html Msg
view model =
    let
        currentView =
            case model.currentPage of
                BlankPage ->
                    Page.Blank.view model.config

                ThreadPage thread ->
                    Page.Thread.view model.users thread

                ProfilePage m ->
                    Page.Profile.view model.users m

                LoadingPage ->
                    div []
                        [ h3 [] [ text "Loading..." ] ]
    in
    div []
        [ appHeader model.config.user
        , currentView
        ]


loadInitialRoute : Location -> Cmd Msg
loadInitialRoute location =
    Navigation.modifyUrl location.hash


init : Flags -> Location -> ( Model, Cmd Msg )
init flags location =
    ( { currentPage = BlankPage
      , config = flags
      , users = Dict.empty
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
