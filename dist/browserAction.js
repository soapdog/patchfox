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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29yZS9icm93c2VyQWN0aW9uL2Jyb3dzZXJBY3Rpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlxuZnVuY3Rpb24gZ29QdWJsaWMoKSB7XG4gIGJyb3dzZXIudGFicy5jcmVhdGUoe1xuICAgIHVybDogXCIvaW5kZXguaHRtbCMvcHVibGljXCJcbiAgfSk7XG4gIHdpbmRvdy5jbG9zZSgpO1xufVxuXG5mdW5jdGlvbiBnb0NvbXBvc2UoKSB7XG4gIGJyb3dzZXIudGFicy5jcmVhdGUoe1xuICAgIHVybDogXCIvaW5kZXguaHRtbCMvY29tcG9zZVwiXG4gIH0pO1xuICB3aW5kb3cuY2xvc2UoKTtcbn1cblxuZnVuY3Rpb24gZ29Qcm9maWxlKCkge1xuICBicm93c2VyLnRhYnMuY3JlYXRlKHtcbiAgICB1cmw6IFwiL2luZGV4Lmh0bWwjL3Byb2ZpbGVcIlxuICB9KTtcbiAgd2luZG93LmNsb3NlKCk7XG59XG5cblxuZnVuY3Rpb24gZ29NZW50aW9ucygpIHtcbiAgYnJvd3Nlci50YWJzLmNyZWF0ZSh7XG4gICAgdXJsOiBcIi9pbmRleC5odG1sIy9tZW50aW9uc1wiXG4gIH0pO1xuICB3aW5kb3cuY2xvc2UoKTtcbn1cblxuXG5mdW5jdGlvbiBnb0NoYW5uZWxzKCkge1xuICBicm93c2VyLnRhYnMuY3JlYXRlKHtcbiAgICB1cmw6IFwiL2luZGV4Lmh0bWwjL2NoYW5lbHNcIlxuICB9KTtcbiAgd2luZG93LmNsb3NlKCk7XG59XG5cbmZ1bmN0aW9uIGdvU2V0dGluZ3MoKSB7XG4gIGJyb3dzZXIucnVudGltZS5vcGVuT3B0aW9uc1BhZ2UoKTtcbiAgd2luZG93LmNsb3NlKCk7XG59XG5cbmZ1bmN0aW9uIGdvSGVscCgpIHtcbiAgY29uc3QgdXJsID0gYnJvd3Nlci5leHRlbnNpb24uZ2V0VVJMKFwiZG9jcy9pbmRleC5odG1sXCIpO1xuICBicm93c2VyLnRhYnMuY3JlYXRlKHtcbiAgICB1cmw6IGAke3VybH0jLz9pZD1yZWFkbWVgXG4gIH0pO1xuICB3aW5kb3cuY2xvc2UoKTtcbn1cblxuXG5mdW5jdGlvbiBnb1JlbGVhc2VOb3RlcygpIHtcbiAgY29uc3QgdmVyc2lvbiA9IGJyb3dzZXIucnVudGltZS5nZXRNYW5pZmVzdCgpLnZlcnNpb247XG4gIGNvbnN0IHVybCA9IGJyb3dzZXIuZXh0ZW5zaW9uLmdldFVSTChgL2RvY3MvaW5kZXguaHRtbCMvcmVsZWFzZV9ub3Rlcy8ke3ZlcnNpb259YCk7XG4gIGJyb3dzZXIudGFicy5jcmVhdGUoe1xuICAgIHVybDogYCR7dXJsfSMvP2lkPXJlYWRtZWBcbiAgfSk7XG4gIHdpbmRvdy5jbG9zZSgpO1xufVxuXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wdGlvbnMtdHJpZ2dlclwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2KSA9PiB7XG4gIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICBnb1NldHRpbmdzKCk7XG59KTtcblxuXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdvLXRvLXB1YmxpY1wiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2KSA9PiB7XG4gIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICBnb1B1YmxpYygpO1xufSk7XG5cbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ28tdG8tcHJvZmlsZVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2KSA9PiB7XG4gIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICBnb1Byb2ZpbGUoKTtcbn0pO1xuXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbXBvc2VcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldikgPT4ge1xuICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgZ29Db21wb3NlKCk7XG59KTtcblxuXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdvLXRvLWhlbHBcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldikgPT4ge1xuICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgZ29IZWxwKCk7XG59KTtcblxuXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdvLXRvLXJlbGVhc2Utbm90ZXNcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldikgPT4ge1xuICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgZ29SZWxlYXNlTm90ZXMoKTtcbn0pO1xuXG5cbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ28tdG8tbWVudGlvbnNcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldikgPT4ge1xuICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgZ29NZW50aW9ucygpO1xufSk7XG5cblxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnby10by1jaGFubmVsc1wiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2KSA9PiB7XG4gIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICBnb1JlbGVhc2VOb3RlcygpO1xufSk7XG5cbmtleW1hZ2UoXCJwXCIsIGdvUHVibGljKTtcbmtleW1hZ2UoXCJzXCIsIGdvU2V0dGluZ3MpO1xua2V5bWFnZShcImNcIiwgZ29Db21wb3NlKTtcbmtleW1hZ2UoXCJuXCIsIGdvQ2hhbm5lbHMpO1xua2V5bWFnZShcIm1cIiwgZ29NZW50aW9ucyk7XG5cblxuXG5cbiJdfQ==
