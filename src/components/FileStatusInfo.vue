<template>
  <p>
    This file has been tested against the IATI Standard XML Schema, and the IATI Standard Rulesets. For more
    information, see
    <a href="https://docs.validator.iatistandard.org/">the documentation</a>.
  </p>

  <ul>
    <li><span class="font-bold text-success">Success</span> - No errors, warnings or advisories.</li>
    <li>
      <span class="font-bold text-advisory">Success (with Advisories)</span> - No errors or warnings, but there are
      advisories relating to potential issues with the data.
    </li>
    <li>
      <span class="font-bold text-warning">Warning</span> - XML Schema validation passes, but not all IATI ruleset rules
      stating that a condition "should" be met.
    </li>
    <li>
      <span class="font-bold text-error">Error</span> - XML schema validation passes, but not all IATI ruleset rules
      stating that a condition "must" be met.
    </li>
    <li>
      <span class="font-bold text-critical">Critical</span> - XML schema validation fails. This means that data will not
      update in the <a href="https://iatidatastore.iatistandard.org">IATI Datastore</a>. Data may be unusable and/or
      missing from other tools.
    </li>
  </ul>
</template>
