# Elm best practices

## Style guide

- http://package.elm-lang.org/help/design-guidelines
- http://elm-lang.org/docs/style-guide
- https://github.com/NoRedInk/elm-style-guide
- https://gist.github.com/laszlopandy/c3bf56b6f87f71303c9f
- https://github.com/ohanhi/elm-style-guide

## Reusable views instead of nested components

There is also one thing about structuring your application. Components vs functions. I suggest going "functions" way. 

https://guide.elm-lang.org/reuse/

A very good explanation of why from @rtfeldman, read the whole linked thread

>@rtfeldman: I've worked on Elm code bases that embraced the philosophy ["component"] you're advocating, as well as on Elm code bases that rejected it. The code bases that rejected it were way nicer to work with.
What you're saying sounds reasonable on paper, but my experience has been the opposite. I've heard the same thing from multiple people who have tried it both ways on different code bases: the "component" mindset leads to worse Elm code. **It's overcomplicated, bloated with unnecessary wiring, and more time-consuming to work with**.
You are of course free to believe whatever you like, but I'm going to follow what my experience and the experience of others has told me leads to the best code. That includes trying to steer people away from cliffs so they don't have the same bad experiences I did when I naively embraced the notion of "Elm components" in the past. :)
>
> -- https://www.reddit.com/r/elm/comments/5jd2xn/how_to_structure_elm_with_multiple_models/dbkgs2h/

<br>

>@jessta: "It's really functions with a common set of types vs functions with different types for each module so you need to do a lot of conversions."
>-- https://elmlang.slack.com/archives/general/p1484225699013668

How to tell if someone is using components? They use [Html.map](http://package.elm-lang.org/packages/elm-lang/html/latest/Html#map) for nesting.

>@montanonic: I almost got started the component way, but Html.map just annoys the ever-living-.... out of me. 
so now _everything_  just uses `Model` and `Msg`, all top-level; loving this way so far
>-- https://elmlang.slack.com/archives/general/p1484248870013718

Examples of "functions" way:

- https://github.com/evancz/elm-sortable-table
- https://github.com/evancz/elm-todomvc
- https://github.com/rogeriochaves/structured-elm-todomvc
- https://github.com/thebritican/elm-autocomplete/pull/30
  - [elm-autocomplete with Greg Ziegan (API Design Session)](https://youtu.be/KSuCYUqY058)
- input , dropdown, multi select http://package.elm-lang.org/packages/abadi199/elm-input-extra/latest
- Why not components? https://groups.google.com/forum/#!msg/elm-discuss/y1CVQpQpRcc/r6PTWmEGCwAJ

## Alternative to reusable views?

- Lenses and Optics https://toast.al/posts/2016-10-20-optical-swordplay-with-components.html
  - when update defined as `update msg =` init application with `init = Return.singleton initModel` or `init = initModel >> Return.singleton`
    - https://www.elm-tutorial.org/en/tips-tricks/point-free-style.html
    - https://github.com/toastal/favicon-swapper/blob/master/src/popup/Ui.elm
    - https://github.com/slopyjoe/elm-build-monitor/blob/master/src/Main.elm
  - when update has model defined https://github.com/toastal/mpdeedle/blob/develop/src/Update.elm

>Ignore the dogma and keep using components! Right now you have two nicely separated programs that you can combine any way or as many times as you'd like using component style. If you merge them into one giant Msg and update they will be much less versatile. For instance, if you make a Checkers game, now you can easily pair it with your chat box component in the same way, Also, suppose you have 20 games that all use the same chat box component, then adding a new feature or fixing a bug in the chatbox for all 20 of them at the same time would be a breeze, because they all use the same file.
I'm not actually certain that those who steer the rudder of Elm guidelines would condemn component usage in your particular case, anyways, given that your components are so extremely different, but who knows!
>
>It's best to keep your solution entirely in Elm just in case you want your components to be able to communicate with each other. The reason why the Leaders speak out against using components is not because they are somehow cheating--components are still purely functional and their states are stored in one source of truth--they just think that in practice using components is more confusing and complex than making a gigantic Msg and update function.
Components can get complicated when you want them to react and pass messages to each other, and you can end up with a pretty bloated update function anyways, so I can see why there is some antagonism. I made a nifty library (https://github.com/mpdairy/elm-component-updater) that helps you do complicated component stuff with hardly any boilerplate, so I actually use components all the time at work, even for little things, and like it much better than the single Msg/update style.

https://www.reddit.com/r/elm/comments/5nx7xe/separating_different_parts_of_an_appgame/

>@opsb: Regarding nesting, I’ve been trying to force myself in the flat direction for a while but I always find I end up with a lot of duplicated code. Not only is it duplicated but it’s slightly varied so if I need to add the same functionality to somewhere else in the interface it’s not even as simple as copy/paste. I’ve just spent the last couple of days refactoring into more of a component structure. I'm really happy with the results, it’s the first time I’ve felt that I could easily comprehend the system in a while. I should add that I’ve only done this in areas where there’s obviously duplication. Much of the app is still in the flat structure. Having been back and forth with flat/nested I personally think that avoiding nesting/components completely will cause problems.  It depends on the app of course, but looking over apps I’ve written in ember in the past I think they’d all benefit from using at least some components if rewritten in Elm.
>-- https://elmlang.slack.com/archives/general/p1484518951014951

## Might be helpful

- "Making Impossible States Impossible" by Richard Feldman https://www.youtube.com/watch?v=IcgmSRJHu_8
- viewModel https://medium.com/@ckoster22/upgrade-your-elm-views-with-selectors-1d8c8308b336
- http://blog.jenkster.com/2016/06/how-elm-slays-a-ui-antipattern.html
  - https://github.com/rofrol/elm-taco-browsersync/
- reuse available decoders for html events like `targetValueInt` http://package.elm-lang.org/packages/elm-community/html-extra/latest/Html-Events-Extra
- Union Types over Type Aliases https://medium.com/@ckoster22/elm-models-as-types-d913002b58fb
  - https://hackernoon.com/a-sufficiently-complex-elm-application-c457d4373291
- elm-lang/navigation example without using hashes https://github.com/rofrol/elm-navigation-example

## Piping

Use piping https://medium.com/@billperegoy/i-also-added-another-function-ad59fa2e3ad3#.y4jji4rk8

Though I have slightly modfied it. So I have two functions:

```elm
addCmd : (a -> Cmd msg) -> a -> ( a, Cmd msg )
addCmd fn model =
    ( model, fn model )

addCmdNoModel : Cmd msg -> a -> ( a, Cmd msg )
addCmdNoModel cmd model =
    ( model, cmd )
```

And then I have small helper functions for update:

```elm
getData : Config.Model -> String -> Cmd Msg
getData config url =
    Http.send CategoriesHttp (Http.get (Config.getApiUrl config url) decodeData)
```

And I'm using it like this:

```elm
CategoriesHttp (Ok categories) ->
    model
        |> updateCurrentCategory
            (case findCategoryByRoute categories model.currentCategory.route of
                Just category ->
                    category

                Nothing ->
                    firstOrEmptyCategory categories
            )
        |> updateCategories categories
        |> addCmd getCategoriesListData
```

 
And for functions that don't take model, I use `addCmdNoModel`:

```elm 
CategoriesListHttp (Ok categoriesListContent) ->
    model
        |> updateCategoriesListContent categoriesListContent
        |> addCmdNoModel Cmd.none
```

It really helped me with catching many bugs in my code

It's hard to forget to not pass some updated data etc. with this pipe technique.

## Atom editor and linter-elm-make - don't compile twice

https://gist.github.com/rofrol/98e8a788b3866493f53ad25f38563675

## Avoiding primitives?

https://www.reddit.com/r/elm/comments/5n8omi/lessons_learned_avoiding_primitives_in_elm/dcaptf9/

>@nebbly: The author prefers `Dollar -> Dollar -> Dollar to Int -> Int -> Int`. If I'm reading the code for the first time, this actually introduces an extra layer of complexity: what is Dollar? A Float? An Int? A record type? A union type? I have to go look at its definition and carry that around in my head every time I'm looking at code that uses it. Hopefully someone has not made a duplicate Dollar type in another module, or I'll get really confused.
While I think type signatures are helpful for understanding code requirements, descriptive argument and function names are where meaning should be conveyed.
>
>@pr06lefs: It probably does make things harder to read - and you have to implement your own arithmetic functions in order to do 'dollar math', to boot. Its a pain, but the win is that you can't pass non-dollar quantities into functions by accident, because to do so creates a compile time error. If you rely only on variable naming, the compiler can't help verify your code, and you're vulnerable to passing quantities into your function that takes dollars, or [kilometers into your miles](http://edition.cnn.com/TECH/space/9909/30/mars.metric.02/index.html?_s=PM:TECH) function.
>
>@nebbly: Yeah, points on both sides. I was doing this for a while, but in my case, I just found my thought process to be clearer using primitives. A matter of taste. It's certainly nice to have the option for further compiler-enforced safety.
