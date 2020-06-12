<script>
  	export let group = undefined;
	export let value = undefined;

</script>

{#each 3 as item, index}
<label>
  <input type="radio" bind:group={index} value={value} class="my-super-special-classname">
	<slot />
</label>
{/each}


