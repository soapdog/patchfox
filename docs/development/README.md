# Developer Documentation

Welcome to the development documentation for Patchfox.

> "We build our computer systems the way we build our cities: over time, without a plan, on top of ruins." &mdash; Ellen Ullman

That is very true for Patchfox, which [has been through multiple rewrites](ssb:message/sha256/hYLSp_zPkvUj2f3DMk9vzUafKy9SVruDjuWFmj7vu60=). Fortunately, most of those rewrites were the kind where we burn everything down, and a new add-on is built from the beautiful ashes of the previous one. Still, Patchfox grew organically with only a vague idea as the plan.

The driving ideas behind Patchfox are:

* Everything is a package
  * Most of them are removable or replaceable
  * It easy to add new ones

> I've [posted about packages](ssb:message/sha256/cprDZ3UErP1A-3ttNCtKdiLmMyyF3l767TTru-DtaQ8=) in SSB. That thread is a good glimpse of how my mind works and how this little garden called Patchfox has been built.

The way Patchfox works is:

1. A core set of low-level code, which should be changed as infrequently as possible, provides features to the packages. It can be found in the `ui/core` folder.
2. Everything a user interacts with is provided by a package from `ui/packages`.

The main avenues for contribution are:

1. Making the _core_ better as it contains a ton of duplication and doesn't use the best _pull-stream_ combinations that it could.
2. Working on packages.

Working on packages is easier and more visible. Working on the core benefits all packages but it is harder and requires more intimate knowledge of the plumbing in this old house.

To contribute to Patchfox, it is better to:

* [Learn how to build the source](/development/building.md)
* [Learn more about the core](/development/core.md)
* [Learn more about packages](/development/packages.md)

## What do you want to do?

* [Create a new mini-app](/development/app-development.md)
* [Add support for a new message type](/development/add-new-message-type.md)
