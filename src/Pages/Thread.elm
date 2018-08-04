module Pages.Thread exposing (..)

import Cleo.Styles exposing (..)
import Element exposing (..)
import Element.Attributes exposing (..)
import Element.Events exposing (..)
import Element.Input as Input
import Html
import Html.Attributes as HA
import Markdown
import Scuttlebutt.Client as SSBClient
import Scuttlebutt.Messages as SSBMessages
import Types exposing (..)


type Msg
    = Load


type alias Message =
    { key : String
    , date : Int
    , author : String
    , content : String
    , votes : List String
    }


type alias Model =
    { messages : List Message
    , id : String
    }


init : List Message -> String -> Model
init l id =
    { messages = l
    , id = id
    }


update : Msg -> AppState -> Model -> ( Model, Cmd Msg )
update msg appState model =
    case msg of
        Load ->
            ( model, SSBClient.relatedMessages model.id )


msgsToModel : SSBMessages.Messages -> List Message
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
                    Message
                        p.common.key
                        (round p.common.timestamp)
                        p.common.author
                        p.content
                        []

                _ ->
                    Message "" 0 "" "" []

        filteredList =
            List.filter isPost ms
    in
    List.map toMessage filteredList


displayMsg : AppState -> Message -> Element Styles v Msg
displayMsg a m =
    let
        avatar =
            SSBClient.avatar a.users m.author

        avatarSide =
            row None
                [ verticalCenter, spacing 10 ]
            <|
                [ image None [ height (px 48) ] { src = avatar.image, caption = avatar.name }
                , el None [] <| text avatar.name
                ]

        messageHeader =
            row None
                [ spread, spacing 20 ]
            <|
                [ el None [] <| avatarSide
                , el None [] <| text (SSBClient.timeAgo m.date)
                ]

        messageContent =
            paragraph None
                []
            <|
                [ html <|
                    Html.div [ HA.class "post-content" ] <|
                        Markdown.toHtml Nothing <|
                            SSBClient.fixMarkdown m.content
                ]
    in
    column MessageBox
        [ paddingXY 20 20, spread, spacing 20 ]
    <|
        [ messageHeader
        , messageContent
        ]


page : AppState -> Model -> Element Styles variation Msg
page appState model =
    column None
        [ paddingXY 0 20, spacingXY 10 10, width (percent 80) ]
    <|
        List.map (displayMsg appState) model.messages
