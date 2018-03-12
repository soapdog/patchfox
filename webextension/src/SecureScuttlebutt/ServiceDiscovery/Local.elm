module Local exposing(..)


type alias DiscoveryState
  = NoAnswer
  | Denied
  | Retry Int
  | Granted String


