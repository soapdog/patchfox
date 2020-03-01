(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

function goPublic() {
  browser.tabs.create({
    url: "/index.html?pkg=hub"
  });
  window.close();
}

function goCompose() {
  browser.tabs.create({
    url: "/index.html?pkg=post&view=compose"
  });
  window.close();
}

function goProfile() {
  browser.tabs.create({
    url: "/index.html?pkg=contacts&view=profile"
  });
  window.close();
}


function goMentions() {
  browser.tabs.create({
    url: "/index.html?pkg=hub&view=mentions"
  });
  window.close();
}


function goChannels() {
  browser.tabs.create({
    url: "/index.html?pkg=hub&view=channels"
  });
  window.close();
}

function goSettings() {
  browser.runtime.openOptionsPage();
  window.close();
}

function goHelp() {
  const url = browser.extension.getURL("docs/index.html");
  browser.tabs.create({
    url: `${url}#/?id=readme`
  });
  window.close();
}


function goReleaseNotes() {
  const version = browser.runtime.getManifest().version;
  const url = browser.extension.getURL(`/docs/index.html#/release_notes/${version}`);
  browser.tabs.create({
    url: `${url}#/?id=readme`
  });
  window.close();
}

document.getElementById("options-trigger").addEventListener("click", (ev) => {
  ev.stopPropagation();
  ev.preventDefault();
  goSettings();
});


document.getElementById("go-to-public").addEventListener("click", (ev) => {
  ev.stopPropagation();
  ev.preventDefault();
  goPublic();
});

document.getElementById("go-to-profile").addEventListener("click", (ev) => {
  ev.stopPropagation();
  ev.preventDefault();
  goProfile();
});

document.getElementById("compose").addEventListener("click", (ev) => {
  ev.stopPropagation();
  ev.preventDefault();
  goCompose();
});


document.getElementById("go-to-help").addEventListener("click", (ev) => {
  ev.stopPropagation();
  ev.preventDefault();
  goHelp();
});


document.getElementById("go-to-release-notes").addEventListener("click", (ev) => {
  ev.stopPropagation();
  ev.preventDefault();
  goReleaseNotes();
});


document.getElementById("go-to-mentions").addEventListener("click", (ev) => {
  ev.stopPropagation();
  ev.preventDefault();
  goMentions();
});

keymage("p", goPublic);
keymage("s", goSettings);
keymage("c", goCompose);
keymage("n", goChannels);
keymage("m", goMentions);
keymage("f", goProfile);


const version = browser.runtime.getManifest().version;
document.getElementById("patchfox-header").innerText = `Patchfox ${version}`;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29yZS9icm93c2VyQWN0aW9uL2Jyb3dzZXJBY3Rpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlxuZnVuY3Rpb24gZ29QdWJsaWMoKSB7XG4gIGJyb3dzZXIudGFicy5jcmVhdGUoe1xuICAgIHVybDogXCIvaW5kZXguaHRtbD9wa2c9aHViXCJcbiAgfSk7XG4gIHdpbmRvdy5jbG9zZSgpO1xufVxuXG5mdW5jdGlvbiBnb0NvbXBvc2UoKSB7XG4gIGJyb3dzZXIudGFicy5jcmVhdGUoe1xuICAgIHVybDogXCIvaW5kZXguaHRtbD9wa2c9cG9zdCZ2aWV3PWNvbXBvc2VcIlxuICB9KTtcbiAgd2luZG93LmNsb3NlKCk7XG59XG5cbmZ1bmN0aW9uIGdvUHJvZmlsZSgpIHtcbiAgYnJvd3Nlci50YWJzLmNyZWF0ZSh7XG4gICAgdXJsOiBcIi9pbmRleC5odG1sP3BrZz1jb250YWN0cyZ2aWV3PXByb2ZpbGVcIlxuICB9KTtcbiAgd2luZG93LmNsb3NlKCk7XG59XG5cblxuZnVuY3Rpb24gZ29NZW50aW9ucygpIHtcbiAgYnJvd3Nlci50YWJzLmNyZWF0ZSh7XG4gICAgdXJsOiBcIi9pbmRleC5odG1sP3BrZz1odWImdmlldz1tZW50aW9uc1wiXG4gIH0pO1xuICB3aW5kb3cuY2xvc2UoKTtcbn1cblxuXG5mdW5jdGlvbiBnb0NoYW5uZWxzKCkge1xuICBicm93c2VyLnRhYnMuY3JlYXRlKHtcbiAgICB1cmw6IFwiL2luZGV4Lmh0bWw/cGtnPWh1YiZ2aWV3PWNoYW5uZWxzXCJcbiAgfSk7XG4gIHdpbmRvdy5jbG9zZSgpO1xufVxuXG5mdW5jdGlvbiBnb1NldHRpbmdzKCkge1xuICBicm93c2VyLnJ1bnRpbWUub3Blbk9wdGlvbnNQYWdlKCk7XG4gIHdpbmRvdy5jbG9zZSgpO1xufVxuXG5mdW5jdGlvbiBnb0hlbHAoKSB7XG4gIGNvbnN0IHVybCA9IGJyb3dzZXIuZXh0ZW5zaW9uLmdldFVSTChcImRvY3MvaW5kZXguaHRtbFwiKTtcbiAgYnJvd3Nlci50YWJzLmNyZWF0ZSh7XG4gICAgdXJsOiBgJHt1cmx9Iy8/aWQ9cmVhZG1lYFxuICB9KTtcbiAgd2luZG93LmNsb3NlKCk7XG59XG5cblxuZnVuY3Rpb24gZ29SZWxlYXNlTm90ZXMoKSB7XG4gIGNvbnN0IHZlcnNpb24gPSBicm93c2VyLnJ1bnRpbWUuZ2V0TWFuaWZlc3QoKS52ZXJzaW9uO1xuICBjb25zdCB1cmwgPSBicm93c2VyLmV4dGVuc2lvbi5nZXRVUkwoYC9kb2NzL2luZGV4Lmh0bWwjL3JlbGVhc2Vfbm90ZXMvJHt2ZXJzaW9ufWApO1xuICBicm93c2VyLnRhYnMuY3JlYXRlKHtcbiAgICB1cmw6IGAke3VybH0jLz9pZD1yZWFkbWVgXG4gIH0pO1xuICB3aW5kb3cuY2xvc2UoKTtcbn1cblxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcHRpb25zLXRyaWdnZXJcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldikgPT4ge1xuICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgZ29TZXR0aW5ncygpO1xufSk7XG5cblxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnby10by1wdWJsaWNcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldikgPT4ge1xuICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgZ29QdWJsaWMoKTtcbn0pO1xuXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdvLXRvLXByb2ZpbGVcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldikgPT4ge1xuICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgZ29Qcm9maWxlKCk7XG59KTtcblxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb21wb3NlXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXYpID0+IHtcbiAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gIGdvQ29tcG9zZSgpO1xufSk7XG5cblxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnby10by1oZWxwXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXYpID0+IHtcbiAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gIGdvSGVscCgpO1xufSk7XG5cblxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnby10by1yZWxlYXNlLW5vdGVzXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXYpID0+IHtcbiAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gIGdvUmVsZWFzZU5vdGVzKCk7XG59KTtcblxuXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdvLXRvLW1lbnRpb25zXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXYpID0+IHtcbiAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gIGdvTWVudGlvbnMoKTtcbn0pO1xuXG5rZXltYWdlKFwicFwiLCBnb1B1YmxpYyk7XG5rZXltYWdlKFwic1wiLCBnb1NldHRpbmdzKTtcbmtleW1hZ2UoXCJjXCIsIGdvQ29tcG9zZSk7XG5rZXltYWdlKFwiblwiLCBnb0NoYW5uZWxzKTtcbmtleW1hZ2UoXCJtXCIsIGdvTWVudGlvbnMpO1xua2V5bWFnZShcImZcIiwgZ29Qcm9maWxlKTtcblxuXG5jb25zdCB2ZXJzaW9uID0gYnJvd3Nlci5ydW50aW1lLmdldE1hbmlmZXN0KCkudmVyc2lvbjtcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGF0Y2hmb3gtaGVhZGVyXCIpLmlubmVyVGV4dCA9IGBQYXRjaGZveCAke3ZlcnNpb259YDtcbiJdfQ==
