<template>
  <p>
    The IATI Validator is an online tool for checking if data aligns with the rules and guidance of IATI Standard. It
    allows users to check and improve the quality of IATI data to ensure it is accessible and useful to anyone working
    with data on development and humanitarian resources and results.
  </p>

  <div class="iati-card-gallery">
    <div class="iati-card">
      <p class="iati-card__title">Check Data</p>
      <p class="iati-card__subtitle">Check your IATI data</p>
      <ul>
        <li>Select and upload your IATI files OR add URL to files</li>
        <li>Get validation results</li>
      </ul>
      <RouterLink class="iati-button self-center mt-auto" to="/validate">Check Data</RouterLink>
    </div>
    <div class="iati-card">
      <p class="iati-card__title">Public Data Viewer</p>
      <p class="iati-card__subtitle">Check all files published on the IATI Registry</p>
      <ul>
        <li>Find an organisation</li>
        <li>See the IATI files published by the organisation</li>
        <li>Get validation results of an IATI file</li>
      </ul>
      <RouterLink class="iati-button self-center mt-auto" to="/organisations">Public Data Viewer</RouterLink>
    </div>
    <div class="iati-card">
      <p class="iati-card__title">Public API</p>
      <p class="iati-card__subtitle">Validate IATI files or retrieve validation reports using the public IATI API</p>
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
    </div>
  </div>
</template>
