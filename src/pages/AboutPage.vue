<script setup>
  import SectionSeparator from '../components/SectionSeparator.vue';
  import AboutSection from '../components/AboutSection.vue';
  import CheckedList from '../components/CheckedList/CheckedList.vue';
  import ListItem from '../components/CheckedList/ListItem.vue';
  import StyledLink from '../components/StyledLink.vue';

  const techStack = [
    {
      link: 'https://github.com/IATI/js-validator-api',
      caption: 'Validator API',
      description: 'Core validation logic',
    },
    {
      link: 'https://github.com/IATI/validator-web',
      caption: 'Front End',
      description: 'Vue.js single page application',
    },
    {
      link: 'https://github.com/IATI/validator-services',
      caption: 'Back End Service',
      description: 'Back end service for the front end',
    },
    {
      link: 'https://github.com/IATI/refresher',
      caption: 'Refresher',
      description: 'Published file identification, download, and validation loop',
    },
  ];
</script>

<template>
  <div class="m-auto my-0 max-w-[1088px] text-left">
    <section class="my-11 px-7">
      <div class="text-base">
        <p>
          The IATI Validator checks if IATI data complies with the rules and guidance in the IATI Standard. Find
          information on how to improve the quality of development and humanitarian IATI data on resources and results
          to ensure it is accessible and useful.
        </p>
      </div>
    </section>
    <AboutSection title="How does the IATI Validator work?">
      <p class="mb-3">There are three ways to use the IATI Validator.</p>
      <CheckedList>
        <ListItem>
          <StyledLink to="/validate">Check Data</StyledLink> - Anyone can upload their IATI data files to be checked
          before publishing them.
        </ListItem>
        <ListItem>
          <StyledLink to="/organisations">Public Data Viewer</StyledLink> - Anyone can check all IATI data files that
          have been published.
        </ListItem>
        <ListItem>
          <StyledLink to="https://developer.iatistandard.org/api-details#api=iati-validator-v2" :external="true"
            >Public API
          </StyledLink>
          - Developers can GET reports for published files or POST a file and receive a validation report
        </ListItem>
      </CheckedList>
      <p class="mb-3">
        The IATI Validator undertakes multiple layers of checks to identify where data does not comply with the IATI
        Standard. The Validator provides messages to indicate where errors have occurred and what needs to be changed.
      </p>
    </AboutSection>
    <SectionSeparator />
    <AboutSection title="What happens when the IATI Validator identifies invalid data?">
      <p class="mb-3">
        When the IATI Validator identifies invalid data, it returns a message to the user. A critical, error or a
        warning message is displayed for each occurrence, identifying what data needs to be corrected and where it
        occurs in the data file. A count of errors is also displayed which shows how many times an error is repeated
        throughout a file. For example, if all activities in a dataset have omitted activity dates, then the user will
        see a count of this repeated error as well as the location of each error.
      </p>
    </AboutSection>
    <SectionSeparator />
    <AboutSection title="What help and support can publishers access to correct their data?">
      <p class="mb-3">
        When data requires correcting an actionable error or warning message will be displayed. Guidance links are also
        made available to assist users with fixing the data. For additional support using the IATI Validator, please
        refer to:
      </p>
      <CheckedList>
        <ListItem>
          IATI Secretariat helpdesk:
          <StyledLink to="mailto:support@iatistandard.org" :external="true">support@iatistandard.org</StyledLink>
        </ListItem>
        <ListItem>
          Post questions to IATI’s community on the forum:
          <StyledLink to="https://iaticonnect.org/data-publishing-cop/stream" :external="true"> IATI Connect</StyledLink
          >.
        </ListItem>
      </CheckedList>
    </AboutSection>
    <SectionSeparator />
    <AboutSection title="Specifically what checks will be made to IATI datafiles?">
      <p class="mb-3">
        The IATI Validator run checks on datafiles against version 2 of the IATI Standard Schema and Rulesets.
      </p>
      <p class="mb-3 font-medium">Check 1: Schema Validation- Critical</p>
      <p class="mb-3">
        The IATI Validator checks if data adheres to the format set out in the IATI XML Schema. The IATI Schema provides
        the exact order and structure that organisations should provide their XML in. Full information about the IATI
        Schema can be found on <a href="http://reference.iatistandard.org/203/schema/">IATI’s Reference site</a>.
      </p>
      <p class="mb-3 font-medium">Check 2: Rulesets Validation - Error and Warning</p>
      <p class="mb-3">
        The IATI Validator also checks if the data follows IATI’s Rulesets. These checks provide a more detailed review
        of the quality of data. To view the most up-to-date information about IATI’s Rulesets please refer to the
        <a href="https://github.com/IATI/IATI-Rulesets" target="_blank"> IATI Ruleset repository</a>.
      </p>
      <p class="mb-3">
        For more information, please see
        <StyledLink
          to="https://cdn.iatistandard.org/prod-iati-website/documents/QA_IATI_Validator_Nov_2022.pdf"
          :external="true"
          >Q&A: New IATI Validator</StyledLink
        >.
      </p>
    </AboutSection>
    <SectionSeparator />
    <AboutSection
      title="Does the IATI Validator check if datasets have complied with a donor’s requirement
      to publish data to the IATI Standard?"
    >
      <p class="mb-3">
        No. Different donors have their own specific set of data requirements for their grantees that are additional to
        the IATI Standard rules. Organisations need to refer to their donor’s guidance and more information can be found
        on
        <StyledLink
          to="https://iatistandard.org/en/guidance/preparing-data/donors-reporting-requirements/"
          :external="true"
          >IATI Guidance</StyledLink
        >.
      </p>
    </AboutSection>
    <SectionSeparator />
    <AboutSection title="What is the tech stack powering the service?">
      <p class="mb-3">
        All application code can be found in the IATI-Validator repositories in
        <StyledLink to="https://github.com/IATI" :external="true"> GitHub</StyledLink>.
      </p>
      <CheckedList>
        <ListItem v-for="stack in techStack" :key="stack.link">
          <StyledLink :to="stack.link" :external="true">{{ stack.caption }}</StyledLink> - {{ stack.description }}
        </ListItem>
      </CheckedList>
    </AboutSection>
    <SectionSeparator />
  </div>
</template>
