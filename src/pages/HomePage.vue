<script setup>
  import CardiB from "../components/CardiB.vue";
</script>

<template>
  <p>
    The IATI Validator is an online tool for checking if data aligns with the rules and guidance of IATI Standard. It
    allows users to check and improve the quality of IATI data to ensure it is accessible and useful to anyone working
    with data on development and humanitarian resources and results.
  </p>

  <div class="flex flex-wrap">
    <CardiB heading="Check Data" class="w-[300px]">
      <p>Check your IATI data</p>
      <ul>
        <li>Select and upload your IATI files OR add URL to files</li>
        <li>Get validation results</li>
      </ul>
      <RouterLink class="iati-button self-center mt-auto" to="/validate">Check Data</RouterLink>
    </CardiB>
    <CardiB heading="Public Data Viewer" class="w-[300px]">
      <p>Check all files published on the IATI Registry</p>
      <ul>
        <li>Find an organisation</li>
        <li>See the IATI files published by the organisation</li>
        <li>Get validation results of an IATI file</li>
      </ul>
      <RouterLink class="iati-button self-center mt-auto" to="/organisations">Public Data Viewer</RouterLink>
    </CardiB>
    <CardiB heading="Public API" class="w-[300px]">
      <p>Validate IATI files or retrieve validation reports using the public IATI API</p>
      <ul>
        <li><code class="iati-code">GET</code> existing validation reports for published files</li>
        <li><code class="iati-code">POST</code> IATI XML and receive validation results</li>
      </ul>
      <a
        id="public-api-button"
        href="https://developer.iatistandard.org/api-details#api=iati-validator-v2"
        class="iati-button self-center mt-auto"
      >
        Public API
      </a>
    </CardiB>
  </div>
</template>
