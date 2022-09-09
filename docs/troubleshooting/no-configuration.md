# No Configuration

To use Patchfox, you need to configure it with your Secure Scuttlebutt secret and remote. If this is your first time using a SSB client, don't worry Patchfox will set it all up for you. If you're already a SSB user, you'll need to tell Patchfox what identity to use.

Patchfox will attempt to load the default identity that is usually stored on `~/.ssb/secret`. It will show a _setup screen_ on the first-run that lets you confirm that you want to use that identity and also enable or disable the built-in server. If you don't enable the built-in server, you'll need to run your own SSB server.

If you went through setup already but want to change something. Quit Patchfox, delete the file `~/.ssb/patchfox.toml` — which is where Patchfox saves its data — and start the application again. The _setup dialog_ will appear.

The <i>.ssb</i> folder is a hidden folder and your system might not display it to you by default. 

## How to show hidden files on macOS

* If you're running Sierra or later macOS, you can press <code>CMD + SHIFT + .</code> to toggle the display of hidden files on Finder (or on a file selection dialog). You'll be able to select the file named <code>secret</code>
* If you're running an earlier version of macOS then you can press <code>CMD + OPTION + G</code> on the file selection dialog to open a <b>location sheet</b> that allows you to type in what folder do you want to open, you can then type <code>~/.ssb/</code> and confirm. You should then be directed to that folder where you'll be able to select the file named <code>secret</code>.

## How to show hidden files on Windows 10

1. Open File Explorer from the taskbar. 
2. Select View > Options > Change folder and search options.
3. Select the View tab and, in Advanced settings, select Show hidden files, folders, and drives and OK.

Check <a href="https://support.microsoft.com/en-gb/help/4028316/windows-view-hidden-files-and-folders-in-windows-10">this page for more information</a>.

## How to show hidden files on Linux
Oh my, it kinda depends on some factors but I believe that it should be viewable by default on most Linux distros. Please reach back to me with feedback on this if you're running Linux.

## How to fix this

* Quit the application, delete the file called `patchfox.toml` inside the `.ssb` folder inside your home folder. Start Patchfox again and go through the first-run setup process.
* Want a more hands-on guide on configuring and using Patchfox? Try the [Getting Started](guide.md) guide.

<script src="/docs/help.js">
