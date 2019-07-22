<style type="scss">
  /** variables **/
  $page-bg: #666;
  $base-font-size: 14px; // becomes 1rem
  $menu-silver: rgba(235, 235, 235, 0.8); // #eee;
  $menu-border: $menu-silver; // #dedede;
  $menu-focused: #1e88e5;
  $menu-separator: #ccc;
  $menu-text-color: #333;
  $menu-shortcut-color: #999;
  $menu-focused-text-color: #fff;
  $menu-text-color-disabled: #999;
  $menu-border-width: 1px;
  $menu-shadow: 2px 2px 3px -3px $menu-text-color;
  $menu-content-padding: 0.25rem 1rem 0.25rem 1.75rem;
  $menu-border-radius: 0.5rem;
  $menu-top-padding: 0.25rem;

  /** styles **/
  /* commons */
  :global(html) {
    font-size: $base-font-size;
  }

  :global(body) {
    margin: 0;
    padding: 0;
    font-family: sans-serif;
    font-size: $base-font-size;
    background-color: $page-bg;
    overflow: hidden;
  }

  /* nav-bar styling */
  .flyout-nav {
    ul {
      margin: 0;
      padding: $menu-top-padding 0;
      position: absolute;
      display: none;
      list-style-type: none;
      white-space: nowrap;
      background: $menu-silver;
      border: $menu-border-width solid $menu-border;
      box-shadow: $menu-shadow;
      border-radius: $menu-border-radius;
      transform: translateY(-$menu-top-padding);
    }

    li {
      position: relative;
      display: block;

      // separator item
      &.separator {
        margin-bottom: $menu-top-padding;
        border-bottom: $menu-border-width solid $menu-separator;
        padding-bottom: $menu-top-padding;
      }

      // the menu items - text, shortcut info and hover effect (blue bg)
      a {
        text-decoration: none;
        color: $menu-text-color;
        position: relative;
        display: table;
        width: 100%;

        .label,
        .shortcut {
          display: table-cell;
          padding: $menu-content-padding;
        }

        .shortcut {
          text-align: right;
          color: $menu-shortcut-color;
        }

        label {
          cursor: pointer;
        }

        // for menu items that are toggles
        input[type="checkbox"] {
          display: none;
        }

        input[type="checkbox"]:checked + .label {
          &:before {
            content: "✔️";
            position: absolute;
            top: 0;
            left: 0.35rem;
          }
        }

        &:hover {
          background: $menu-focused;
          .label,
          .shortcut {
            color: $menu-focused-text-color;
          }
        }
      }

      // show a submenu available indicator icon...
      // note: this can be written in a easier way without having to rely
      // on .has-children added to markup when the :has() selector
      // implementation is available in the browser)
      &.has-children > a {
        margin-right: 2.5rem;
        &:after {
          content: "▶";
          text-align: right;
          position: absolute;
          right: 0;
          padding: $menu-content-padding;
        }
      }

      // don't let disabled options be hover-able/clickable and color them different
      &.disabled {
        .label,
        .shortcut {
          color: $menu-text-color-disabled;
        }
        pointer-events: none;
      }

      // show the next level drop-down on the right at the same height
      &:hover {
        & > ul {
          display: block;
          top: -$menu-border-width; // handle the offset caused by border
          left: 100%;
        }
      }
    }

    // overrides for first-level behaviour (bar)
    & > ul {
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-start;
      align-items: stretch;
      width: 100vw;
      max-width: 100%;
      border-bottom: $menu-border-width solid $menu-border;
      box-shadow: $menu-shadow;
      border-radius: 0;
      padding: 0;
      transform: translateY(0);

      // minor theming styling adjustments
      & > li > a > .label {
        padding-left: 1rem;
      }

      // first-level drop-down should appear below at the same left position
      & > li:hover > ul {
        top: 100%;
        left: -$menu-border-width; // handle the offset caused by border
        border-radius: 0 0 $menu-border-radius $menu-border-radius;
        padding-top: 0;
        transform: translateY(0);
      }
    }
  }
</style>

<nav class="flyout-nav">
  <ul>
    <li>
      <a href="#">
        <span class="label">File</span>
      </a>
      <ul>
        <li>
          <a href="#">
            <span class="label">New Tab</span>
            <span class="shortcut">⌘T</span>
          </a>
        </li>
        <li>
          <a href="#">
            <span class="label">New Window</span>
            <span class="shortcut">⌘N</span>
          </a>
        </li>
        <li>
          <a href="#">
            <span class="label">New Incognito Window</span>
            <span class="shortcut">⇧⌘N</span>
          </a>
        </li>
        <li>
          <a href="#">
            <span class="label">Re-open Closed Tab</span>
            <span class="shortcut">⇧⌘T</span>
          </a>
        </li>
        <li>
          <a href="#">
            <span class="label">Open File...</span>
            <span class="shortcut">⌘O</span>
          </a>
        </li>
        <li>
          <a href="#">
            <span class="label">Open Location...</span>
            <span class="shortcut">⌘L</span>
          </a>
        </li>
        <li class="separator" />
        <li>
          <a href="#">
            <span class="label">Close Window</span>
            <span class="shortcut">⇧⌘W</span>
          </a>
        </li>
        <li>
          <a href="#">
            <span class="label">Close Tab</span>
            <span class="shortcut">⌘W</span>
          </a>
        </li>
        <li>
          <a href="#">
            <span class="label">Save Page As...</span>
            <span class="shortcut">⌘S</span>
          </a>
        </li>
        <li class="separator" />
        <li class="has-children">
          <a href="#">
            <span class="label">Share</span>
          </a>
          <ul>
            <li>
              <a href="#">
                <span class="label">✉️ Email</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span class="label">💬 Messages</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span class="label">📒 Notes</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span class="label">⏰ Reminders</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span class="label">🗓 Calender</span>
              </a>
            </li>
          </ul>
        </li>
        <li class="separator" />
        <li>
          <a href="#">
            <span class="label">Print...</span>
            <span class="shortcut">⌘P</span>
          </a>
        </li>
      </ul>
    </li>
    <li>
      <a href="#">
        <span class="label">Edit</span>
      </a>
      <ul>
        <li>
          <a href="#">
            <span class="label">Undo</span>
            <span class="shortcut">⌘Z</span>
          </a>
        </li>
        <li>
          <a href="#">
            <span class="label">Redo</span>
            <span class="shortcut">⇧⌘Z</span>
          </a>
        </li>
        <li class="separator" />
        <li>
          <a href="#">
            <span class="label">Cut</span>
            <span class="shortcut">⌘X</span>
          </a>
        </li>
        <li>
          <a href="#">
            <span class="label">Copy</span>
            <span class="shortcut">⌘C</span>
          </a>
        </li>
        <li>
          <a href="#">
            <span class="label">Paste</span>
            <span class="shortcut">⌘V</span>
          </a>
        </li>
        <li>
          <a href="#">
            <span class="label">Select All</span>
            <span class="shortcut">⌘A</span>
          </a>
        </li>
        <li class="separator" />
        <li class="has-children">
          <a href="#">
            <span class="label">Find</span>
          </a>
          <ul>
            <li>
              <a href="#">
                <span class="label">Search the Web...</span>
                <span class="shortcut">⌥⌘F</span>
              </a>
            </li>
            <li class="separator" />
            <li>
              <a href="#">
                <span class="label">Find</span>
                <span class="shortcut">⌘F</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span class="label">Find Next</span>
                <span class="shortcut">⌘G</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span class="label">Find Previous</span>
                <span class="shortcut">⇧⌘G</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span class="label">Use Selection For Find</span>
                <span class="shortcut">⌘E</span>
              </a>
            </li>
            <li class="disabled">
              <a href="#">
                <span class="label">Jump to Selection</span>
                <span class="shortcut">⌘J</span>
              </a>
            </li>
          </ul>
        </li>
        <li class="has-children">
          <a href="#">
            <span class="label">Spelling and Grammar</span>
          </a>
          <ul>
            <li>
              <a href="#">
                <span class="label">Show Spelling and Grammar</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span class="label">Check Document Now</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span class="label">Check Spelling While Typing</span>
              </a>
            </li>
            <li class="disabled">
              <a href="#">
                <span class="label">Check Grammar While Typing</span>
              </a>
            </li>
          </ul>
        </li>
        <li class="has-children">
          <a href="#">
            <span class="label">Speech</span>
          </a>
          <ul>
            <li>
              <a href="#">
                <span class="label">Start Speaking</span>
              </a>
            </li>
            <li class="disabled">
              <a href="#">
                <span class="label">Stop Speaking</span>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </li>
    <li>
      <a href="#">
        <span class="label">View</span>
      </a>
      <ul>
        <li>
          <a href="#">
            <input type="checkbox" id="alwaysShowBookmarksBar" checked="true" />
            <label class="label" for="alwaysShowBookmarksBar">
              Always Show Bookmarks Bar
            </label>
            <span class="shortcut">⇧⌘B</span>
          </a>
        </li>
        <li>
          <a href="#">
            <input type="checkbox" id="alwaysShowToolbar" />
            <label class="label" for="alwaysShowToolbar">
              Always Show Toolbar in Fullscreen
            </label>
            <span class="shortcut">⇧⌘F</span>
          </a>
        </li>
        <li class="separator" />
        <li>
          <a href="#">
            <span class="label">Stop</span>
            <span class="shortcut">⌘.</span>
          </a>
        </li>
        <li>
          <a href="#">
            <span class="label">Reload This Page</span>
            <span class="shortcut">⌘R</span>
          </a>
        </li>
        <li class="separator" />
        <li>
          <a href="#">
            <span class="label">Exit Fullscreen</span>
            <span class="shortcut">^⌘F</span>
          </a>
        </li>
        <li class="separator" />
        <li>
          <a href="#">
            <span class="label">Zoom In</span>
            <span class="shortcut">⌘+</span>
          </a>
        </li>
        <li>
          <a href="#">
            <span class="label">Zoom Out</span>
            <span class="shortcut">⌘-</span>
          </a>
        </li>
        <li class="separator" />
        <li>
          <a href="#">
            <span class="label">Cast...</span>
          </a>
        </li>
        <li class="separator" />
        <li class="has-children">
          <a href="#">
            <span class="label">Developer</span>
          </a>
          <ul>
            <li>
              <a href="#">
                <span class="label">View Source</span>
                <span class="shortcut">⌥⌘U</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span class="label">Developer Tools</span>
                <span class="shortcut">⌥⌘I</span>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </li>
    <li>
      <a href="#">
        <span class="label">History</span>
      </a>
      <ul>
        <li>
          <a href="#">
            <span class="label">Home</span>
            <span class="shortcut">⇧⌘H</span>
          </a>
        </li>
        <li>
          <a href="#">
            <span class="label">Back</span>
            <span class="shortcut">⌘[</span>
          </a>
        </li>
        <li class="disabled">
          <a href="#">
            <span class="label">Forward</span>
            <span class="shortcut">⌘]</span>
          </a>
        </li>
        <li class="separator" />
        <li>
          <a href="#">
            <span class="label">Show Full History...</span>
            <span class="shortcut">⌘Y</span>
          </a>
        </li>
      </ul>
    </li>
    <li>
      <a href="#">
        <span class="label">Bookmarks</span>
      </a>
      <ul>
        <li>
          <a href="#">
            <span class="label">Bookmark Manager</span>
            <span class="shortcut">⌥⌘B</span>
          </a>
        </li>
        <li>
          <a href="#">
            <span class="label">Bookmark This Page</span>
            <span class="shortcut">⌘D</span>
          </a>
        </li>
        <li>
          <a href="#">
            <span class="label">Bookmark All Pages...</span>
            <span class="shortcut">⇧⌘D</span>
          </a>
        </li>
      </ul>
    </li>
    <li>
      <a href="#">
        <span class="label">Window</span>
      </a>
      <ul>
        <li>
          <a href="#">
            <span class="label">Minimize</span>
            <span class="shortcut">⌘M</span>
          </a>
        </li>
        <li>
          <a href="#">
            <span class="label">Zoom</span>
          </a>
        </li>
        <li class="separator" />
        <li>
          <a href="#">
            <span class="label">Downloads</span>
            <span class="shortcut">⇧⌘J</span>
          </a>
        </li>
        <li>
          <a href="#">
            <span class="label">Extensions</span>
          </a>
        </li>
        <li>
          <a href="#">
            <span class="label">Task Manager</span>
          </a>
        </li>
      </ul>
    </li>
    <li>
      <a href="#">
        <span class="label">Help</span>
      </a>
      <ul>
        <li>
          <a href="#">
            <span class="label">Search</span>
          </a>
        </li>
        <li>
          <a href="#">
            <span class="label">Report an Issue...</span>
          </a>
        </li>
      </ul>
    </li>
  </ul>
</nav>
