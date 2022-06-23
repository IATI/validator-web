<template>
  <p class="pb-3 text-base">
    The file(s) with a validation report available are marked with a status. If the file is flagged with a
    <span class="font-bold text-critical">Critical</span>, <span class="font-bold text-error">Error</span>, or
    <span class="font-bold text-warning">Warning</span> status it means that there are errors to fix. We recommend
    addressing the <span class="font-bold text-critical">Critical</span> errors first. The
    <span class="font-bold text-error">Errors</span> should be addressed next.
    <span class="font-bold text-warning">Warnings</span> should be corrected when possible.
  </p>

  <ul class="list-disc pl-10 pb-3">
    <li>
      <span class="font-bold text-success">Success</span> - file is valid with no errors of any type, congratulations!
    </li>
    <li>
      <span class="font-bold text-warning">Warning</span> - data can be more valuable and warnings should be corrected
      when possible.
    </li>
    <li><span class="font-bold text-error">Error</span> - data is hard or impossible to use.</li>
    <li>
      <span class="font-bold text-critical">Critical</span> - data contains significant errors, none or not all of the
      data can be used by tools or accessed by the
      <a href="https://iatidatastore.iatistandard.org" class="text-iati-green hover:underline">IATI Datastore</a>
    </li>
  </ul>
</template>
