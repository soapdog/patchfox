# Adding new message types

Before you can add a new message type, you should study the [packages documentation](/development/packages.md) and the source-code for one of the packages which handle a message type. I recommend studying the [Vote](https://github.com/soapdog/patchfox/tree/master/src/packages/vote) package because it is very simple, it is the one that handles _likes_.

What signals the hanlding of a message type is the `messageTypes` array in the `patchfox.package()` declaration. For each item in that array, there will be a _message type_ field and a _card view_. Patchfox will assemble all that data from all the loaded packages when it launches and make a large array. When it needs to render a message, it will iterate through that array checking to see which _card view_ from which package can handle the given type.

> That means that the order in which packages are loaded in `src/packages/packages.js` matters because they will be at the beginning of the _message type handler array_. If two packages handle the same type, the one loaded first will be used. This means that you don't need to delete any code from Patchfox source tree when experimenting with a new _message type handler_, you can simply move it's package above the current handler in `packages.js` file.

## The `messageTypes` array

A package can declare itself as being the handler for any number of message types it wants. Each message type needs to be it's own object inside this array. Let's look into the package declaration for `Vote` package.

```
const Vote = require("./Vote.svelte")

patchfox.package({
    name: "vote",
    messageTypes: [
        {
            type: "vote",
            card: Vote,
            short: true
        }
    ]
})
```

* `type`: is the string that represents the message type. It will be matched against incomming messages.
* `card`: is what Svelte view should be used to render the message.
* `short`: is just a CSS flag to render it as a normal or a super-short card without background.

There is another field that is not represented there, which is `validator`. This is a function to be run to further refine the match. If the `type` matches, and a `validator` is present, then the card will only be used if the return from the `validator` function is `true`. This is because there are some message types that are _overloaded_ in SSB. An example is the `about` message type which might refer to a _profile being updated_ or a _gathering being updated_ and many other things.

For example, the `calendar` package, declares itself being able to handle `about` but uses a validator to trap only the _gatherings_.

```
{
    type: "about",
    card: GatheringActionCard,
    validator: msg => msg.value.content.about && msg.value.content.about.startsWith("%")
}
```

> **OOOPS:** Just realise that that validator sucks. Will need to fix it. That code is soooo old.

## Steps to add a new message type

1. Find out which package should be handling that message type. Maybe you don't need to create a new package.
2. Create the Svelte view to handle displaying the message type.
3. Add that view with a new entry to the `messageTypes` for the package.
4. If you ended up coding a new package, remember to add it to `src/packages/packages.js`
