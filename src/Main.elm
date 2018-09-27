module Main exposing (..)

import Cleo.Styles exposing (..)
import Dict
import Element exposing (..)
import Element.Attributes exposing (..)
import Element.Events exposing (..)
import Html
import Http
import Navigation exposing (Location)
import Pages.Public as Public
import Pages.Settings as Settings
import Pages.Thread as Thread
import Scuttlebutt.Client exposing (..)
import Types exposing (..)
import UrlParser as P exposing ((</>))


---- MODEL ----


type Page
    = Blank
    | SettingsPage Settings.Model
    | ThreadPage Thread.Model
    | PublicPage Public.Model


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

        d =
            Debug.log "initial url" url

        appState =
            { user = Nothing
            , remote = config.remote
            , keys = config.keys
            , manifest = config.manifest
            , users = Dict.empty
            }

        initialPage =
            Maybe.withDefault Blank <| parseURL url appState
    in
    ( { appState = appState
      , currentPage = initialPage
      }
    , cmdForURLChange initialPage
    )


parseURL : Location -> AppState -> Maybe Page
parseURL location appState =
    let
        config =
            Configuration appState.remote appState.keys appState.manifest

        routeParser =
            P.oneOf
                [ P.map Blank P.top
                , P.map (SettingsPage <| Settings.init config) (P.s "settings")
                , P.map (PublicPage <| Public.init []) (P.s "public")
                , P.map (ThreadPage << Thread.init []) (P.s "thread" </> P.string)
                ]
    in
    P.parseHash routeParser location


cmdForURLChange p =
    case p of
        ThreadPage m ->
            relatedMessages m.id

        PublicPage _ ->
            publicFeed

        _ ->
            Cmd.none



---- UPDATE ----


type Msg
    = ToggleMenu
    | SettingsMsg Settings.Msg
    | ThreadMsg Thread.Msg
    | PublicMsg Public.Msg
    | UrlChange Navigation.Location
    | Outside InfoForElm
    | LogErr String
    | Navigate Page


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

        ( Outside (FeedReceived lm), PublicPage m ) ->
            let
                pm =
                    Public.msgsToModel lm

                newMsgs =
                    List.concat [ pm ]

                newModel =
                    { m | messages = newMsgs }

                idList =
                    List.map .author pm
            in
            ( { model | currentPage = PublicPage newModel }, getAvatars model.appState.users idList )

        ( Outside (ThreadReceived lm), ThreadPage m ) ->
            let
                pm =
                    Thread.msgsToModel lm

                newMsgs =
                    List.concat [ pm ]

                newModel =
                    { m | messages = newMsgs }

                idList =
                    List.map .author pm
            in
            ( { model | currentPage = ThreadPage newModel }, getAvatars model.appState.users idList )

        ( Outside infoForElm, _ ) ->
            case infoForElm of
                AvatarReceived user ->
                    let
                        appState =
                            model.appState

                        newUsers =
                            Dict.insert user.id user model.appState.users
                    in
                    ( { model | appState = { appState | users = newUsers } }, Cmd.none )

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

        ( UrlChange u, _ ) ->
            let
                d =
                    Debug.log "changing url" u

                newPage =
                    case parseURL u model.appState of
                        Just p ->
                            p

                        Nothing ->
                            Blank

                cmd =
                    cmdForURLChange newPage
            in
            ( { model | currentPage = newPage }, cmd )

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
                    let
                        userProfile =
                            "#/profile/" ++ Http.encodeUri u.id
                    in
                    link userProfile <|
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

                ThreadPage m ->
                    Thread.page model.appState m
                        |> Element.map ThreadMsg

                PublicPage m ->
                    Public.page model.appState m
                        |> Element.map PublicMsg

                _ ->
                    empty
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
