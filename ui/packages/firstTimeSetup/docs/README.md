# firstTimeSetup Package

The `firstTimeSetup` package is responsible for presenting a nice dialog when
Patchfox is run for the first time. It allows the user to set their default
configuration. The most important aspect of this first time setup is:

- Find if the user has locally installed SSB keys already.
- Find if they want to use those keys.
- Find out if Patchfox should start the server part of SSB.

