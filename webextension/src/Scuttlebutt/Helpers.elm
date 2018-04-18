module Scuttlebutt.Helpers exposing (..)


apiUrl : String -> String
apiUrl str =
    "http://localhost:8989/api" ++ str


discoveryUrl : String
discoveryUrl =
    "http://localhost:8989/get-address"
