<div class="container">
  <h1 class="uppercase font-medium text-xl mb-4">Blogging Tools</h1>
  <a
    href={patchfox.url('blog', 'import')}
    class="btn"
    on:click|preventDefault={() => patchfox.go('blog', 'import')}>
    Import from RSS/Atom
  </a>
</div>
