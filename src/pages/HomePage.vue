<script setup>
  import CardiB from "../components/CardiB.vue";
  import ContentContainer from "../components/layout/ContentContainer.vue";
  import LinkButton from "../components/LinkButton.vue";
</script>

<template>
  <ContentContainer class="pt-6 pb-8">
    <p class="pb-4 text-lg">
      The IATI Validator is an online tool for checking if data aligns with the rules and guidance of IATI Standard. It
      allows users to check and improve the quality of IATI data to ensure it is accessible and useful to anyone working
      with data on development and humanitarian resources and results.
    </p>

    <div class="-m-2.5 flex flex-wrap pt-4">
      <CardiB heading="Check Data" class="w-[300px]">
        <p>Check your IATI data</p>
        <ul class="my-4 list-disc pl-10">
          <li>Select and upload your IATI files OR add URL to files</li>
          <li>Get validation results</li>
        </ul>
        <LinkButton to="/validate" class="text-tiny"> Check data </LinkButton>
      </CardiB>
      <CardiB heading="Public Data Viewer" class="w-[300px]">
        <p>Check all files published on the IATI Registry</p>
        <ul class="my-4 list-disc pl-10">
          <li>Find an organisation</li>
          <li>See the IATI files published by the organisation</li>
          <li>Get validation results of an IATI file</li>
        </ul>
        <LinkButton to="/organisations" class="text-tiny"> Public data viewer </LinkButton>
      </CardiB>
      <CardiB heading="Public API" class="w-[300px]">
        <p>Validate IATI files or retrieve validation reports using the public IATI API</p>
        <ul class="my-4 list-disc pl-10">
          <li><code class="text-iati-code">GET</code> existing validation reports for published files</li>
          <li><code class="text-iati-code">POST</code> IATI XML and receive validation results</li>
        </ul>
        <LinkButton
          id="public-api-button"
          to="https://developer.iatistandard.org/api-details#api=iati-validator-v2"
          :external="true"
          class="text-tiny"
        >
          Public API
        </LinkButton>
      </CardiB>
    </div>
  </ContentContainer>
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
