<script>
console.log("start friendship request")
console.time("friendship")
let promise = ssb.friendship(ssb.feed)
    .then((data) => {
        console.log(data)
        console.timeEnd("friendship")
    })
    .catch(n => console.error("err friend", n))
</script>

{#await promise}
    <div class="loading" />
{:then}
    <p>Loaded...</p>
{/await}