module Pages.Public exposing (..)

import Cleo.Styles exposing (..)
import Element exposing (..)
import Element.Attributes exposing (..)
import Element.Events exposing (..)
import Element.Input as Input
import Scuttlebutt.Client as SSBClient
import Types exposing (..)


type Msg
    = NoOp


type alias Message =
    { key : String
    , date : Int
    , author : String
    , content : String
    , votes : List String
    }


type alias Model =
    { messages : List Message
    }


init : List Message -> Model
init l =
    { messages = l
    }


update : Msg -> AppState -> Model -> ( Model, Cmd Msg )
update msg appState model =
    case msg of
        NoOp ->
            ( model, Cmd.none )


displayMsg : Message -> Element Styles v Msg
displayMsg m =
    let
        messageHeader =
            row None
                [ spread, spacing 20 ]
            <|
                [ el None [] <| text m.author
                , el None [] <| text (toString m.date)
                ]

        messageContent =
            paragraph None
                []
            <|
                [ el None [] <|
                    text m.content
                ]
    in
    column MessageBox
        [ paddingXY 20 20, spread, spacing 20 ]
    <|
        [ messageHeader
        , messageContent
        ]


page : Model -> Element Styles variation Msg
page model =
    column None
        [ paddingXY 0 20, spacingXY 10 10, width (percent 80) ]
    <|
        List.map displayMsg model.messages
