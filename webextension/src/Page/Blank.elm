module Page.Blank exposing (..)

import Html as H
import Html.Styled exposing (..)
import Html.Styled.Attributes exposing (class)
import Markdown
import Route
import String.Extra as SE
import Types exposing (..)


view : Flags -> Html msg
view config =
    let
        link =
            Route.toUrl <| Thread "%vanIz/czvKhgXi3Psmo/BEr5TN7pAUg4ucrR1fo8uZ8=.sha256"

        blurb =
            """
This is an Add-on for Firefox that implements a minimal Secure Scuttlebutt client.
This is very alpha software. These links might interest you:

* [Patchfox Dev Diary](#/thread/%25vanIz%2FczvKhgXi3Psmo%2FBEr5TN7pAUg4ucrR1fo8uZ8%3D.sha256)
* [Patchfox Github Repository](https://github.com/soapdog/patchfox)
* [Patchfox Issue Tracker](https://github.com/soapdog/patchfox/issues)
* [More about Secure Scuttlebutt](http://scuttlebutt.nz)
            """

        content =
            H.div [] <| Markdown.toHtml Nothing blurb
    in
    div [ class "container has-text-left" ]
        [ h1 [] [ text "Welcome to Patchfox" ]
        , fromUnstyled content
        ]
