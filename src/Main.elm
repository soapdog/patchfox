module Main exposing (..)

import Cleo.Styles exposing (..)
import Dict
import Element exposing (..)
import Element.Attributes exposing (..)
import Element.Events exposing (..)
import Html
import Navigation exposing (Location)
import Pages.Settings as Settings
import Scuttlebutt.Client exposing (..)
import Types exposing (..)


---- MODEL ----


type Page
    = SettingsPage Settings.Model


type alias Flags =
    { remote : String
    , keys : String
    , manifest : String
    }


type alias Model =
    { appState : AppState
    , currentPage : Page
    }


init : Flags -> Location -> ( Model, Cmd Msg )
init flags url =
    let
        config =
            Configuration flags.remote flags.keys flags.manifest
    in
    ( { appState =
            { user = Nothing
            , remote = config.remote
            , keys = config.keys
            , manifest = config.manifest
            , users = Dict.empty
            }
      , currentPage = SettingsPage (Settings.init config)
      }
    , Cmd.none
    )



---- UPDATE ----


type Msg
    = ToggleMenu
    | SettingsMsg Settings.Msg
    | UrlChange Navigation.Location
    | Outside InfoForElm
    | LogErr String


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case ( msg, model.currentPage ) of
        ( SettingsMsg curSettingsMsg, SettingsPage curSettingsModel ) ->
            let
                ( newSettingsModel, newSettingsCmd ) =
                    Settings.update curSettingsMsg model.appState curSettingsModel
            in
            ( { model | currentPage = SettingsPage newSettingsModel }
            , Cmd.map SettingsMsg newSettingsCmd
            )

        ( LogErr s, _ ) ->
            let
                d =
                    Debug.log "Error" s
            in
            ( model, Cmd.none )

        ( Outside infoForElm, _ ) ->
            case infoForElm of
                CurrentUser user ->
                    let
                        newUsers =
                            Dict.insert user.id user model.appState.users

                        appState =
                            model.appState

                        newAppstate =
                            { appState | users = newUsers, user = Just user }
                    in
                    ( { model | appState = newAppstate }, Cmd.none )

                CantConnectToSBOT err ->
                    let
                        cc =
                            Configuration model.appState.remote model.appState.keys model.appState.manifest

                        basicSettingsModel =
                            Settings.init cc

                        newSettingsModel =
                            { basicSettingsModel | errors = [ "Can't connect with SBOT with this data", err ] }
                    in
                    ( { model | currentPage = SettingsPage newSettingsModel }, Cmd.none )

                _ ->
                    ( model, Cmd.none )

        _ ->
            ( model, Cmd.none )



---- VIEW ----


navItems : Element Styles v Msg
navItems =
    navigation None
        [ spread, spacing 15, verticalCenter ]
        { name = "Main Navigation"
        , options =
            [ link "#/public" (el Link [] (text "Public"))
            , link "#/mentions" (el Link [] (text "Mentions"))
            , link "#/settings" (el Link [] (text "Settings"))
            ]
        }


navBar : AppState -> Element Styles v Msg
navBar appState =
    let
        brandOrUser =
            case appState.user of
                Nothing ->
                    row Base
                        [ verticalCenter, spacing 10 ]
                        [ image None
                            [ height (px 32) ]
                            { src = "images/icon.png", caption = "Hermie logo" }
                        , el None [] <| text "Patchfox"
                        ]

                Just u ->
                    row Base
                        [ verticalCenter, spacing 10 ]
                        [ image None
                            [ height (px 32) ]
                            { src = u.image, caption = u.name }
                        , el None [] <| text u.name
                        ]
    in
    row NavBar
        [ spread, paddingXY 60 10, width (percent 100), verticalCenter ]
        [ brandOrUser
        , navItems
        ]


view model =
    let
        content =
            case model.currentPage of
                SettingsPage m ->
                    Settings.page m
                        |> Element.map SettingsMsg
    in
    viewport styles <|
        column Base
            [ center, width (percent 100) ]
            [ navBar model.appState
            , content
            ]



-- SUBSCRIPTIONS --


subscriptions : Model -> Sub Msg
subscriptions model =
    getInfoFromOutside Outside LogErr



-- MAIN --


main : Program Flags Model Msg
main =
    Navigation.programWithFlags UrlChange
        { view = view
        , update = update
        , init = init
        , subscriptions = subscriptions
        }
