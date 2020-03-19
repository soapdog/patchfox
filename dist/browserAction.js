(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

function goPublic() {
  browser.tabs.create({
    url: "/index.html?pkg=hub"
  });
  window.close();
}

function goPopular() {
  browser.tabs.create({
    url: "/index.html?pkg=hub&view=popular"
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

document.getElementById("go-to-popular").addEventListener("click", (ev) => {
  ev.stopPropagation();
  ev.preventDefault();
  goPopular();
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
keymage("o", goPopular);
keymage("s", goSettings);
keymage("c", goCompose);
keymage("n", goChannels);
keymage("m", goMentions);
keymage("f", goProfile);


const version = browser.runtime.getManifest().version;
document.getElementById("patchfox-header").innerText = `Patchfox ${version}`;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29yZS9icm93c2VyQWN0aW9uL2Jyb3dzZXJBY3Rpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcclxuZnVuY3Rpb24gZ29QdWJsaWMoKSB7XHJcbiAgYnJvd3Nlci50YWJzLmNyZWF0ZSh7XHJcbiAgICB1cmw6IFwiL2luZGV4Lmh0bWw/cGtnPWh1YlwiXHJcbiAgfSk7XHJcbiAgd2luZG93LmNsb3NlKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdvUG9wdWxhcigpIHtcclxuICBicm93c2VyLnRhYnMuY3JlYXRlKHtcclxuICAgIHVybDogXCIvaW5kZXguaHRtbD9wa2c9aHViJnZpZXc9cG9wdWxhclwiXHJcbiAgfSk7XHJcbiAgd2luZG93LmNsb3NlKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdvQ29tcG9zZSgpIHtcclxuICBicm93c2VyLnRhYnMuY3JlYXRlKHtcclxuICAgIHVybDogXCIvaW5kZXguaHRtbD9wa2c9cG9zdCZ2aWV3PWNvbXBvc2VcIlxyXG4gIH0pO1xyXG4gIHdpbmRvdy5jbG9zZSgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnb1Byb2ZpbGUoKSB7XHJcbiAgYnJvd3Nlci50YWJzLmNyZWF0ZSh7XHJcbiAgICB1cmw6IFwiL2luZGV4Lmh0bWw/cGtnPWNvbnRhY3RzJnZpZXc9cHJvZmlsZVwiXHJcbiAgfSk7XHJcbiAgd2luZG93LmNsb3NlKCk7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBnb01lbnRpb25zKCkge1xyXG4gIGJyb3dzZXIudGFicy5jcmVhdGUoe1xyXG4gICAgdXJsOiBcIi9pbmRleC5odG1sP3BrZz1odWImdmlldz1tZW50aW9uc1wiXHJcbiAgfSk7XHJcbiAgd2luZG93LmNsb3NlKCk7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBnb0NoYW5uZWxzKCkge1xyXG4gIGJyb3dzZXIudGFicy5jcmVhdGUoe1xyXG4gICAgdXJsOiBcIi9pbmRleC5odG1sP3BrZz1odWImdmlldz1jaGFubmVsc1wiXHJcbiAgfSk7XHJcbiAgd2luZG93LmNsb3NlKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdvU2V0dGluZ3MoKSB7XHJcbiAgYnJvd3Nlci5ydW50aW1lLm9wZW5PcHRpb25zUGFnZSgpO1xyXG4gIHdpbmRvdy5jbG9zZSgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnb0hlbHAoKSB7XHJcbiAgY29uc3QgdXJsID0gYnJvd3Nlci5leHRlbnNpb24uZ2V0VVJMKFwiZG9jcy9pbmRleC5odG1sXCIpO1xyXG4gIGJyb3dzZXIudGFicy5jcmVhdGUoe1xyXG4gICAgdXJsOiBgJHt1cmx9Iy8/aWQ9cmVhZG1lYFxyXG4gIH0pO1xyXG4gIHdpbmRvdy5jbG9zZSgpO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZ29SZWxlYXNlTm90ZXMoKSB7XHJcbiAgY29uc3QgdmVyc2lvbiA9IGJyb3dzZXIucnVudGltZS5nZXRNYW5pZmVzdCgpLnZlcnNpb247XHJcbiAgY29uc3QgdXJsID0gYnJvd3Nlci5leHRlbnNpb24uZ2V0VVJMKGAvZG9jcy9pbmRleC5odG1sIy9yZWxlYXNlX25vdGVzLyR7dmVyc2lvbn1gKTtcclxuICBicm93c2VyLnRhYnMuY3JlYXRlKHtcclxuICAgIHVybDogYCR7dXJsfSMvP2lkPXJlYWRtZWBcclxuICB9KTtcclxuICB3aW5kb3cuY2xvc2UoKTtcclxufVxyXG5cclxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcHRpb25zLXRyaWdnZXJcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldikgPT4ge1xyXG4gIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgZ29TZXR0aW5ncygpO1xyXG59KTtcclxuXHJcblxyXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdvLXRvLXB1YmxpY1wiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2KSA9PiB7XHJcbiAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICBnb1B1YmxpYygpO1xyXG59KTtcclxuXHJcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ28tdG8tcG9wdWxhclwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2KSA9PiB7XHJcbiAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICBnb1BvcHVsYXIoKTtcclxufSk7XHJcblxyXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdvLXRvLXByb2ZpbGVcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldikgPT4ge1xyXG4gIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgZ29Qcm9maWxlKCk7XHJcbn0pO1xyXG5cclxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb21wb3NlXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXYpID0+IHtcclxuICBldi5zdG9wUHJvcGFnYXRpb24oKTtcclxuICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gIGdvQ29tcG9zZSgpO1xyXG59KTtcclxuXHJcblxyXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdvLXRvLWhlbHBcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldikgPT4ge1xyXG4gIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgZ29IZWxwKCk7XHJcbn0pO1xyXG5cclxuXHJcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ28tdG8tcmVsZWFzZS1ub3Rlc1wiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2KSA9PiB7XHJcbiAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICBnb1JlbGVhc2VOb3RlcygpO1xyXG59KTtcclxuXHJcblxyXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdvLXRvLW1lbnRpb25zXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXYpID0+IHtcclxuICBldi5zdG9wUHJvcGFnYXRpb24oKTtcclxuICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gIGdvTWVudGlvbnMoKTtcclxufSk7XHJcblxyXG5rZXltYWdlKFwicFwiLCBnb1B1YmxpYyk7XHJcbmtleW1hZ2UoXCJvXCIsIGdvUG9wdWxhcik7XHJcbmtleW1hZ2UoXCJzXCIsIGdvU2V0dGluZ3MpO1xyXG5rZXltYWdlKFwiY1wiLCBnb0NvbXBvc2UpO1xyXG5rZXltYWdlKFwiblwiLCBnb0NoYW5uZWxzKTtcclxua2V5bWFnZShcIm1cIiwgZ29NZW50aW9ucyk7XHJcbmtleW1hZ2UoXCJmXCIsIGdvUHJvZmlsZSk7XHJcblxyXG5cclxuY29uc3QgdmVyc2lvbiA9IGJyb3dzZXIucnVudGltZS5nZXRNYW5pZmVzdCgpLnZlcnNpb247XHJcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGF0Y2hmb3gtaGVhZGVyXCIpLmlubmVyVGV4dCA9IGBQYXRjaGZveCAke3ZlcnNpb259YDtcclxuIl19
