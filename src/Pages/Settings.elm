module Pages.Settings exposing (..)

import Cleo.Styles exposing (..)
import Element exposing (..)
import Element.Attributes exposing (..)
import Element.Events exposing (..)
import Element.Input as Input
import Scuttlebutt.Client as SSBClient
import Types exposing (..)


type Msg
    = ChangeRemote String
    | ChangeKeys String
    | ChangeManifest String
    | ImportSecret
    | ImportManifest
    | Save


type alias Model =
    { keys : String
    , remote : String
    , manifest : String
    , errors : List String
    }


init : SSBClient.Configuration -> Model
init c =
    { keys = c.keys
    , remote = c.remote
    , manifest = c.manifest
    , errors = []
    }


update : Msg -> AppState -> Model -> ( Model, Cmd Msg )
update msg appState model =
    case msg of
        ChangeRemote r ->
            ( { model | remote = r }, Cmd.none )

        ChangeKeys k ->
            ( { model | keys = k }, Cmd.none )

        ChangeManifest m ->
            ( { model | manifest = m }, Cmd.none )

        ImportSecret ->
            ( model, Cmd.none )

        ImportManifest ->
            ( model, Cmd.none )

        Save ->
            ( { model | errors = [] }, SSBClient.saveConfiguration model )


page : Model -> Element Styles variation Msg
page model =
    column None
        [ paddingXY 0 20, spacingXY 0 10, width (px 600) ]
    <|
        [ Input.text InputField
            [ padding 3 ]
            { onChange = ChangeRemote
            , value = model.remote
            , label = Input.labelAbove <| el InputLabel [] <| text "Remote:"
            , options = [ Input.textKey "remoteSetting" ]
            }
        , Input.multiline InputField
            [ padding 3 ]
            { onChange = ChangeKeys
            , value = model.keys
            , label = Input.labelAbove <| el InputLabel [] <| text "Keys:"
            , options = [ Input.textKey "keysSetting" ]
            }
        , Input.multiline InputField
            [ padding 3 ]
            { onChange = ChangeManifest
            , value = model.manifest
            , label = Input.labelAbove <| el InputLabel [] <| text "Manifest:"
            , options = []
            }
        , row None
            [ spread, spacing 30 ]
            [ button (Button Grey) [ paddingXY 4 6, onClick ImportSecret ] <|
                text "Import Secret"
            , button (Button Grey) [ paddingXY 4 6, onClick ImportManifest ] <|
                text "Import Manifest"
            , button (Button Green) [ paddingXY 4 6, width fill, onClick Save ] <|
                text "Save"
            ]
        ]
            ++ List.map (\err -> el Error [] <| text err) model.errors
