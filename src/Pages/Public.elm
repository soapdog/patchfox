module Pages.Public exposing (..)

import Cleo.Elements exposing (postElement)
import Cleo.Styles exposing (..)
import Element exposing (..)
import Element.Attributes exposing (..)
import Element.Events exposing (..)
import Element.Input as Input
import Html
import Html.Attributes as HA
import Http
import Markdown
import Scuttlebutt.Client as SSBClient
import Scuttlebutt.Messages as SSBMessages
import Types exposing (..)


type Msg
    = NoOp


type alias Model =
    { messages : List PostMessage
    }


init : List PostMessage -> Model
init l =
    { messages = l
    }


update : Msg -> AppState -> Model -> ( Model, Cmd Msg )
update msg appState model =
    case msg of
        NoOp ->
            ( model, Cmd.none )


msgsToModel : SSBMessages.Messages -> List PostMessage
msgsToModel (SSBMessages.Messages ms) =
    let
        isPost p =
            case p of
                SSBMessages.MPost _ ->
                    True

                _ ->
                    False

        toMessage m =
            case Debug.log "m" m of
                SSBMessages.MPost p ->
                    PostMessage
                        p.common.key
                        (round p.common.timestamp)
                        p.common.author
                        p.content
                        []

                _ ->
                    PostMessage "" 0 "" "" []

        filteredList =
            List.filter isPost ms
    in
    List.map toMessage filteredList


page : AppState -> Model -> Element Styles variation Msg
page appState model =
    column None
        [ paddingXY 0 20, spacingXY 10 10, width (percent 80) ]
    <|
        List.map (postElement appState) model.messages
