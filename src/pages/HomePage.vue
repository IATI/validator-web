<script setup>
  import CardiB from "../components/CardiB.vue";
  import LinkButton from "../components/LinkButton.vue";
</script>

<template>
  <p>
    The IATI Validator is an online tool for checking if data aligns with the rules and guidance of IATI Standard. It
    allows users to check and improve the quality of IATI data to ensure it is accessible and useful to anyone working
    with data on development and humanitarian resources and results.
  </p>

  <div class="flex flex-wrap gap-4">
    <div class="iati-card flex-1 flex flex-col min-w-96">
      <p class="iati-card__title">Check Data</p>
      <p class="iati-card__subtitle">Check your IATI data</p>
      <ul>
        <li>Select and upload your IATI files OR add URL to files</li>
        <li>Get validation results</li>
      </ul>
      <!-- TODO: Remove no-underline after merge design system PR -->
      <router-link to="/validate" class="iati-button no-underline self-center mt-auto">Check data</router-link>
    </div>
    <div class="iati-card flex-1 flex flex-col min-w-96">
      <p class="iati-card__title">Public Data Viewer</p>
      <p class="iati-card__subtitle">Check all files published on the IATI Registry</p>
      <ul>
        <li>Find an organisation</li>
        <li>See the IATI files published by the organisation</li>
        <li>Get validation results of an IATI file</li>
      </ul>
      <!-- TODO: Remove no-underline after merge design system PR -->
      <router-link to="/organisations" class="iati-button no-underline self-center mt-auto"
        >Public data viewer</router-link
      >
    </div>
    <div class="iati-card flex-1 flex flex-col min-w-96">
      <p class="iati-card__title">Public API</p>
      <p class="iati-card__subtitle">Validate IATI files or retrieve validation reports using the public IATI API</p>
      <ul>
        <li><code class="iati-code">GET</code> existing validation reports for published files</li>
        <li><code class="iati-code">POST</code> IATI XML and receive validation results</li>
      </ul>
      <!-- TODO: What is id used for -->
      <!-- TODO: Remove no-underline after merge design system PR -->
      <a
        id="public-api-button"
        href="https://developer.iatistandard.org/api-details#api=iati-validator-v2"
        class="iati-button no-underline self-center mt-auto"
        >Public API</a
      >
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      msg: {
        type: String,
        default: "",
      },
    },
    setup(props) {
      console.log(props.msg);
    },
  };
</script>
