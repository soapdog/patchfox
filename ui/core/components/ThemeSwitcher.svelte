<script>

let themes = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
]

let currentTheme = patchfox.getPref("theme", "light")

const setTheme = theme => {
  patchfox.setPref("theme", theme)
  document.documentElement.setAttribute("data-theme", theme)
  currentTheme = theme
}
</script>

<div class="dropdown dropdown-end">
  <div tabindex="0" class="m-1 btn btn-ghost"><i class="fas fa-swatchbook"></i></div> 
  <ul tabindex="0" class="p-2 shadow menu dropdown-content bg-accent rounded-box w-52 text-accent-content">
    {#each themes as theme}
      <li>
        {#if currentTheme == theme}
          <button 
            class="btn btn-ghost btn-disabled"
            disabled>
            {theme}
          </button>
        {:else}
          <button 
            class="btn btn-ghost" 
            on:click={() => setTheme(theme)}>
          {theme}
        </button>
        {/if}
      </li>
    {/each}
  </ul>
</div>
