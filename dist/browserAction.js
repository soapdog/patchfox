(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

function goPublic() {
  browser.tabs.create({
    url: "/index.html#/public"
  });
  window.close();
}

function goCompose() {
  browser.tabs.create({
    url: "/index.html#/compose"
  });
  window.close();
}

function goProfile() {
  browser.tabs.create({
    url: "/index.html#/profile"
  });
  window.close();
}


function goMentions() {
  browser.tabs.create({
    url: "/index.html#/mentions"
  });
  window.close();
}


function goChannels() {
  browser.tabs.create({
    url: "/index.html#/chanels"
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


document.getElementById("go-to-channels").addEventListener("click", (ev) => {
  ev.stopPropagation();
  ev.preventDefault();
  goReleaseNotes();
});

keymage("p", goPublic);
keymage("s", goSettings);
keymage("c", goCompose);
keymage("n", goChannels);
keymage("m", goMentions);





},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29yZS9icm93c2VyQWN0aW9uL2Jyb3dzZXJBY3Rpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlxyXG5mdW5jdGlvbiBnb1B1YmxpYygpIHtcclxuICBicm93c2VyLnRhYnMuY3JlYXRlKHtcclxuICAgIHVybDogXCIvaW5kZXguaHRtbCMvcHVibGljXCJcclxuICB9KTtcclxuICB3aW5kb3cuY2xvc2UoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ29Db21wb3NlKCkge1xyXG4gIGJyb3dzZXIudGFicy5jcmVhdGUoe1xyXG4gICAgdXJsOiBcIi9pbmRleC5odG1sIy9jb21wb3NlXCJcclxuICB9KTtcclxuICB3aW5kb3cuY2xvc2UoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ29Qcm9maWxlKCkge1xyXG4gIGJyb3dzZXIudGFicy5jcmVhdGUoe1xyXG4gICAgdXJsOiBcIi9pbmRleC5odG1sIy9wcm9maWxlXCJcclxuICB9KTtcclxuICB3aW5kb3cuY2xvc2UoKTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGdvTWVudGlvbnMoKSB7XHJcbiAgYnJvd3Nlci50YWJzLmNyZWF0ZSh7XHJcbiAgICB1cmw6IFwiL2luZGV4Lmh0bWwjL21lbnRpb25zXCJcclxuICB9KTtcclxuICB3aW5kb3cuY2xvc2UoKTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGdvQ2hhbm5lbHMoKSB7XHJcbiAgYnJvd3Nlci50YWJzLmNyZWF0ZSh7XHJcbiAgICB1cmw6IFwiL2luZGV4Lmh0bWwjL2NoYW5lbHNcIlxyXG4gIH0pO1xyXG4gIHdpbmRvdy5jbG9zZSgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnb1NldHRpbmdzKCkge1xyXG4gIGJyb3dzZXIucnVudGltZS5vcGVuT3B0aW9uc1BhZ2UoKTtcclxuICB3aW5kb3cuY2xvc2UoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ29IZWxwKCkge1xyXG4gIGNvbnN0IHVybCA9IGJyb3dzZXIuZXh0ZW5zaW9uLmdldFVSTChcImRvY3MvaW5kZXguaHRtbFwiKTtcclxuICBicm93c2VyLnRhYnMuY3JlYXRlKHtcclxuICAgIHVybDogYCR7dXJsfSMvP2lkPXJlYWRtZWBcclxuICB9KTtcclxuICB3aW5kb3cuY2xvc2UoKTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGdvUmVsZWFzZU5vdGVzKCkge1xyXG4gIGNvbnN0IHZlcnNpb24gPSBicm93c2VyLnJ1bnRpbWUuZ2V0TWFuaWZlc3QoKS52ZXJzaW9uO1xyXG4gIGNvbnN0IHVybCA9IGJyb3dzZXIuZXh0ZW5zaW9uLmdldFVSTChgL2RvY3MvaW5kZXguaHRtbCMvcmVsZWFzZV9ub3Rlcy8ke3ZlcnNpb259YCk7XHJcbiAgYnJvd3Nlci50YWJzLmNyZWF0ZSh7XHJcbiAgICB1cmw6IGAke3VybH0jLz9pZD1yZWFkbWVgXHJcbiAgfSk7XHJcbiAgd2luZG93LmNsb3NlKCk7XHJcbn1cclxuXHJcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3B0aW9ucy10cmlnZ2VyXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXYpID0+IHtcclxuICBldi5zdG9wUHJvcGFnYXRpb24oKTtcclxuICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gIGdvU2V0dGluZ3MoKTtcclxufSk7XHJcblxyXG5cclxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnby10by1wdWJsaWNcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldikgPT4ge1xyXG4gIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgZ29QdWJsaWMoKTtcclxufSk7XHJcblxyXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdvLXRvLXByb2ZpbGVcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldikgPT4ge1xyXG4gIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgZ29Qcm9maWxlKCk7XHJcbn0pO1xyXG5cclxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb21wb3NlXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXYpID0+IHtcclxuICBldi5zdG9wUHJvcGFnYXRpb24oKTtcclxuICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gIGdvQ29tcG9zZSgpO1xyXG59KTtcclxuXHJcblxyXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdvLXRvLWhlbHBcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldikgPT4ge1xyXG4gIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgZ29IZWxwKCk7XHJcbn0pO1xyXG5cclxuXHJcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ28tdG8tcmVsZWFzZS1ub3Rlc1wiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2KSA9PiB7XHJcbiAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICBnb1JlbGVhc2VOb3RlcygpO1xyXG59KTtcclxuXHJcblxyXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdvLXRvLW1lbnRpb25zXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXYpID0+IHtcclxuICBldi5zdG9wUHJvcGFnYXRpb24oKTtcclxuICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gIGdvTWVudGlvbnMoKTtcclxufSk7XHJcblxyXG5cclxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnby10by1jaGFubmVsc1wiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2KSA9PiB7XHJcbiAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICBnb1JlbGVhc2VOb3RlcygpO1xyXG59KTtcclxuXHJcbmtleW1hZ2UoXCJwXCIsIGdvUHVibGljKTtcclxua2V5bWFnZShcInNcIiwgZ29TZXR0aW5ncyk7XHJcbmtleW1hZ2UoXCJjXCIsIGdvQ29tcG9zZSk7XHJcbmtleW1hZ2UoXCJuXCIsIGdvQ2hhbm5lbHMpO1xyXG5rZXltYWdlKFwibVwiLCBnb01lbnRpb25zKTtcclxuXHJcblxyXG5cclxuXHJcbiJdfQ==
