# Creating a Patchfox Mini-app

Apps are self-contained [packages](/development/packages.md). They are accessible using the _Launcher_ on the _Patchfox Menu_ or by pressing _CTRL+M_.

![application launcher](d-launcher.png)
_Application Launcher_

Before you can create a new mini-app, you should study the [packages documentation](/development/packages.md) and the source code for one of the included mini-apps. The [Books](https://github.com/soapdog/patchfox/tree/master/ui/packages/books) mini-app is a good place to start because it has many of the features you might want to learn how to implement.

What makes a package a mini-app is the inclusion of: `app: true` in its `patchfox.package()` declaration. This will place it on the _Launcher_.

## Steps to create a new mini-app

1. Create a folder for your mini-app under `src/packages/`. The name of the folder should match the name of the mini-app (which is also the name of the package).
2. Don't forget to include `app: true` in the `patchfox.package()` declaration.
3. Create a _default view_ for your package. It should be a Svelte view. Add it with `view: myDefaultView` in the declaration. This is the view that the _Launcher_ loads when a user launches your app.
4. Include a nice icon. :-)
5. Only packages added to `ui/packages/packages.js` will be loaded.
