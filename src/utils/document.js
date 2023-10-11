import { stringify } from 'csv-stringify/browser/esm/sync';
import { formatDate } from '.';

const validationStatusOrder = ['Critical', 'Error', 'Warning', 'Success', 'N/A'];
export const getDocumentFileName = (document) =>
  document.url ? window.decodeURI(document.url).replace(/\/$/, '').split('/').pop() : '';
export const compareDocumentSeverity = (docOne, docTwo) => getDocumentSeverity(docOne) - getDocumentSeverity(docTwo);

export const hasProperLink = (document) =>
  document.validation_created === null ||
  document.download_error !== null ||
  document.downloaded === null ||
  document.hash === '';

export const getDocumentDownloadStatus = (document) => {
  if (document.validation_created === null && document.downloaded !== null) {
    return 'Pending Validation';
  }
  const downloadErrorString = getDownloadErrorString(document);
  if (document.validation_created === null && document.downloaded === null) {
    if (downloadErrorString === '0') {
      return 'Failed Download (Connection Error)';
    }
    if (downloadErrorString === '1') {
      return 'Failed Download (SSL Issue)';
    }
    if (downloadErrorString === '2') {
      return 'Failed Download (Character Encoding Issue)';
    }
    if (downloadErrorString === '3') {
      return 'Failed Download (Invalid URL)';
    }
    if (
      ['400', '401', '403', '404', '500', '501', '502', '503', '504', '505', '506', '507', '509', '510'].includes(
        downloadErrorString,
      )
    ) {
      return `Failed Download (HTTP Error ${document.download_error})`;
    }
    if (
      ![
        '0',
        '1',
        '2',
        '3',
        '400',
        '401',
        '403',
        '404',
        '500',
        '501',
        '502',
        '503',
        '504',
        '505',
        '506',
        '507',
        '509',
        '510',
      ].includes(downloadErrorString)
    ) {
      return 'Pending Download';
    }
  }
};

export const getDocumentValidationStatus = (document) => {
  const { report } = document;
  const { valid } = report || { valid: null };
  const { error, warning } = report ? report.summary : { error: -1, warning: -1 };

  if (document.report === null) {
    return { value: 'normal', caption: 'N/A' };
  }
  if (valid === true && error === 0 && warning === 0) {
    return { value: 'success', caption: 'Success' };
  }
  if (valid === true && error === 0) {
    return { value: 'warning', caption: 'Warning' };
  }
  if (valid === true) {
    return { value: 'error', caption: 'Error' };
  }
  if (valid === false) {
    return { value: 'critical', caption: 'Critical' };
  }

  return { value: 'normal', caption: 'N/A' };
};

export const getDocumentDatastoreAvailability = (document) => {
  /* see this ticket for full explanation on these availability statuses
  https://trello.com/c/XeovXQrf/232-front-end-indicator-that-file-is-partially-in-ds-for-al-validation */
  const { report, solrize_end, clean_end, clean_start, clean_error, file_schema_valid, last_solrize_end } = document;
  const fileStatus = getDocumentValidationStatus(document).value;

  if (solrize_end) {
    const formatedDate = formatDate(solrize_end);

    return `${fileStatus === 'critical' && clean_end && !file_schema_valid ? 'Partial' : 'Yes'} - ${formatedDate}`;
  }

  if (last_solrize_end) {
    return 'Old version';
  }

  if (
    fileStatus === 'critical' &&
    ((report?.fileType === 'iati-activities' && !clean_start) ||
      clean_error === 'No valid activities' ||
      report?.fileType === '')
  ) {
    return 'No';
  }

  if (
    (report?.fileType === 'iati-activities' && fileStatus !== 'critical') ||
    (report?.fileType === 'iati-activities' &&
      fileStatus === 'critical' &&
      !clean_start &&
      report?.iatiVersion !== '' &&
      report?.iatiVersion !== '1*' &&
      checkDocumentHasErrorVersions(['0.6.1', '0.2.1', '0.1.1'], report?.errors)) ||
    (fileStatus === 'critical' && clean_end)
  ) {
    return 'Pending';
  }

  if (document.report?.fileType === 'iati-organisations') {
    return 'N/A';
  }

  return '';
};

const getDocumentSeverity = (document) => {
  const { validation, valid, report } = document;
  const { error, warning } = report ? report.summary : { error: -1, warning: -1 };

  if (!validation) {
    return 2;
  } else if (valid === true && error === 0 && warning === 0) {
    return 5;
  } else if (valid === true && error === 0) {
    return 4;
  } else if (valid === true) {
    return 3;
  } else if (valid === false) {
    return 1;
  }
  return 2;
};

const getDownloadErrorString = (document) => (document.download_error ? document.download_error.toString() : '');

const checkDocumentHasErrorVersions = (versions, errors) =>
  !!(errors && errors.find((error) => versions.includes(error.identifier))); // TODO: check with Nick if identifier == id

const getCategoryLabel = (category) => {
  const categories = {
    schema: 'Schema',
    information: 'Basic activity information',
    financial: 'Financial',
    identifiers: 'Identification',
    organisation: 'Basic organisation information',
    participating: 'Participating organisations',
    geo: 'Geopolitical information',
    classifications: 'Classifications',
    documents: 'Related documents',
    performance: 'Performance',
    iati: 'IATI file',
    relations: 'Relations',
  };
  return categories[category];
};

const getCategoryCount = (reportErrors, categoryID) => {
  return reportErrors.reduce((count, activeOrgFile) => {
    activeOrgFile.errors.forEach((errorCatGroup) => {
      if (errorCatGroup.category === categoryID) {
        count += errorCatGroup.errors.length;
      }
    });

    return count;
  }, 0);
};

export const getDocumentReportCategories = (report) => {
  return report.errors?.reduce((categories, file) => {
    file.errors.forEach((error) => {
      if (!categories.some((u) => u.id === error.category)) {
        categories.push({
          id: error.category,
          name: getCategoryLabel(error.category),
          count: getCategoryCount(report.errors, error.category),
          show: true,
        });
      }
    });

    return categories;
  }, []);
};

export const getSeverities = () => {
  return [
    {
      id: 'critical',
      slug: 'critical',
      name: 'Critical',
      description: 'Files with critical errors will not be processed by the datastore',
      count: null,
      order: 1,
      show: true,
      types: [],
    },
    {
      id: 'error',
      slug: 'error',
      name: 'Errors',
      description: 'Errors make it hard or impossible to use the data.',
      count: null,
      order: 2,
      show: true,
      types: [],
    },
    {
      id: 'warning',
      slug: 'warning',
      name: 'Warnings',
      description: 'Warnings indicate where the data can be more valuable.',
      count: null,
      order: 3,
      show: true,
      types: [],
    },
    {
      id: 'improvement',
      slug: 'info',
      name: 'Improvements',
      description: 'Improvements can make the data more useful.',
      count: null,
      order: 4,
      show: true,
      types: [],
    },
    {
      id: 'notification',
      slug: 'success',
      name: 'Notifications',
      description: 'Notifications are for your information.',
      count: null,
      order: 5,
      show: true,
      types: [],
    },
  ];
};

const getReportMessageTypeCount = (report, typeId) => {
  let count = 0;

  report.errors.forEach((file) => {
    file.errors.forEach((errorCategory) => {
      errorCategory.errors.forEach((error) => {
        const { id } = error;
        if (typeId === id) {
          count += 1;
        }
      });
    });
  });

  return count;
};

export const getDocumentReportSeverities = (report) => {
  const severities = getSeverities();
  // get error message types & add them to their respective severities
  report.errors.reduce((types, file) => {
    file.errors.forEach((errorCategory) => {
      errorCategory.errors.forEach((error) => {
        const { message, severity, id } = error;
        if (!types.some((t) => t.id === id)) {
          // find and add to matching severity
          const sev = severities.find((s) => s.id === severity);
          if (sev) {
            const count = getReportMessageTypeCount(report, id); // number of messages of this type
            sev.types.push({ id, text: message, show: true, count });
          }
          types.push({ id });
        }
      });
    });

    return types;
  }, []);
  // Sort type messages inside severity. Type with more messages on top
  severities.forEach((severity) => severity.types.sort((a, b) => b.count - a.count));

  // only return active severities i.e. those that have a type
  return severities.filter((severity) => severity.types.length);
};

export const getReportErrorsByIdentifier = (report, identifier = 'file') => {
  if (!report) return [];

  if (identifier === 'file') {
    return report.errors.reduce((errors, actOrgFile) => {
      if (actOrgFile.identifier === 'file') {
        return actOrgFile.errors;
      }
      return errors;
    }, []);
  }

  // none file errors are activity errors
  return report.errors.filter((actOrgFile) => actOrgFile.identifier !== 'file');
};

export const getFileErrorsMessageTypeCount = (errors, messageType) => {
  return errors.reduce((count, catGroup) => {
    catGroup.errors.forEach((err) => {
      if (err.severity === messageType) {
        count += err.context.length;
      }
    });

    return count;
  }, 0);
};

export const getFeedbackCategoryLabel = (category) => {
  const categories = {
    schema: 'Schema',
    information: 'Basic activity information',
    financial: 'Financial',
    identifiers: 'Identification',
    organisation: 'Basic organisation information',
    participating: 'Participating organisations',
    geo: 'Geopolitical information',
    classifications: 'Classifications',
    documents: 'Related documents',
    performance: 'Performance',
    iati: 'IATI file',
    relations: 'Relations',
  };
  return categories[category];
};

const appendNAStatusDocuments = (documents, direction) => {
  const statusNADocs = [];
  const otherDocs = [];
  if (direction !== 'Validation Status: N/A') {
    documents.forEach((item) => {
      getDocumentValidationStatus(item).caption === 'N/A' ? statusNADocs.push(item) : otherDocs.push(item);
    });
    return otherDocs.concat(statusNADocs);
  }
  return documents;
};

export const sortDocuments = (documents, sortKey, sortDirection) => {
  if (documents.length) {
    if (sortKey === 'fileName') {
      const fileNameSortedDocs = Array.from(documents);
      fileNameSortedDocs.sort(function (a, b) {
        if (a['name'] > b['name']) {
          return sortDirection === 'ascending' ? 1 : -1;
        } else if (a['name'] < b['name']) {
          return sortDirection === 'ascending' ? -1 : 1;
        }
        return 0;
      });
      return fileNameSortedDocs;
    }
    if (sortKey === 'registryIdentity') {
      const registryIdentitySortedDocs = Array.from(documents);
      registryIdentitySortedDocs.sort(function (a, b) {
        if ((a['modified'] || a['first_seen']) > (b['modified'] || b['first_seen'])) {
          return sortDirection === 'ascending' ? 1 : -1;
        } else if ((a['modified'] || a['first_seen']) < (b['modified'] || b['first_seen'])) {
          return sortDirection === 'ascending' ? -1 : 1;
        }
        return 0;
      });
      return registryIdentitySortedDocs;
    }
    if (sortKey === 'validationDate') {
      const nonValidatedDocs = documents.filter((doc) => !doc['validation_created']);
      const validationDateSortingList = documents.filter((doc) => {
        if (nonValidatedDocs.length) {
          if (!nonValidatedDocs.find((document) => doc.hash === document.hash)) {
            return doc;
          }
        } else {
          return doc;
        }
      });
      validationDateSortingList.sort(function (a, b) {
        if (a['validation_created'] > b['validation_created']) {
          return sortDirection === 'ascending' ? 1 : -1;
        } else if (a['validation_created'] < b['validation_created']) {
          return sortDirection === 'ascending' ? -1 : 1;
        }
        return 0;
      });
      return validationDateSortingList.concat(nonValidatedDocs);
    }
    if (sortKey === 'validationStatus') {
      const otherDocs = [];
      const statusOrderedDocs = [];

      documents.forEach((item) => {
        if (getDocumentValidationStatus(item).caption === sortDirection) {
          statusOrderedDocs.push(item);
        } else {
          otherDocs.push(item);
        }
      });

      return statusOrderedDocs.concat(appendNAStatusDocuments(otherDocs, sortDirection));
    }
    if (sortKey === 'dataStoreAvailability') {
      const availabilityDocs = Array.from(documents);
      const availabilitySortingDocs = [];
      const nonAvailabilityDocs = [];
      availabilityDocs.forEach((doc) => {
        const availabilityResult = getDocumentDatastoreAvailability(doc);
        if (availabilityResult.includes('Yes')) {
          availabilitySortingDocs.push(doc);
        } else {
          nonAvailabilityDocs.push(doc);
        }
      });
      availabilitySortingDocs.sort(function (a, b) {
        if (a['solrize_end'] > b['solrize_end']) {
          return sortDirection === 'ascending' ? 1 : -1;
        } else if (a['solrize_end'] < b['solrize_end']) {
          return sortDirection === 'ascending' ? -1 : 1;
        }
        return 0;
      });

      return availabilitySortingDocs.concat(nonAvailabilityDocs);
    }
  }
};

const partialSortOptions = [
  { label: 'File Name: A - Z', direction: 'ascending', value: 'fileName' },
  { label: 'File Name: Z - A', direction: 'descending', value: 'fileName' },
  { label: 'Identified in Registry: Newest', direction: 'descending', value: 'registryIdentity' },
  { label: 'Identified in Registry: Oldest', direction: 'ascending', value: 'registryIdentity' },
  { label: 'Validated: Newest', direction: 'descending', value: 'validationDate' },
  { label: 'Validated: Oldest', direction: 'ascending', value: 'validationDate' },
  { label: 'Available in IATI Datastore: Newest', direction: 'descending', value: 'dataStoreAvailability' },
  { label: 'Available in IATI Datastore: Oldest', direction: 'ascending', value: 'dataStoreAvailability' },
];
export const sortOptions = (documents) => partialSortOptions.concat(getValidationStatusOptions(documents));

export const getSortDirection = (sortKey, options) =>
  sortKey ? options.find((opt) => opt.label === sortKey)?.direction : '';

export const getSortValue = (sortKey, options) => (sortKey ? options.find((opt) => opt.label === sortKey)?.value : '');

export const getDocumentCount = (files, status) =>
  files.filter((file) => getDocumentValidationStatus(file).caption === status).length;

export const documentValidationStatus = (documents) => {
  const availableStatusOptions = Array.from(new Set(documents.map((doc) => getDocumentValidationStatus(doc).caption)));
  return validationStatusOrder.filter((opt) => availableStatusOptions.includes(opt));
};

const getValidationStatusOptions = (documents) =>
  documentValidationStatus(documents).map((status) => ({
    label: `Validation Status: ${status}`,
    direction: status,
    value: 'validationStatus',
  }));

export const getStatusColor = (statusLabel) => {
  if (statusLabel !== 'N/A') {
    return `text-${statusLabel.toLowerCase()}`;
  }
};

export const getDefaultSortingCriteria = (docs) => {
  if (docs.length) {
    const availableValidationStatusList = documentValidationStatus(docs);
    if (availableValidationStatusList.includes('Critical')) {
      return 'Validation Status: Critical';
    } else if (availableValidationStatusList.includes('Error')) {
      return 'Validation Status: Error';
    } else if (availableValidationStatusList.includes('Warning')) {
      return 'Validation Status: Warning';
    } else if (availableValidationStatusList.includes('Success')) {
      return 'Validation Status: Success';
    } else {
      return 'Validation Status: N/A';
    }
  }
};

export const constructCSV = (results) => {
  const tabularData = [
    [
      'Registry file name',
      'URL',
      'Validation Status',
      'File Valid',
      'Activity Title',
      'Activity Identifier',
      'Category',
      'Severity',
      'ID',
      'Message',
      'Location where rule was broken',
    ],
  ];
  results.forEach((result) => {
    const registryName = result.registry_name;
    const documentUrl = result.document_url;
    const documentValid = result.valid;
    let fileValid = '';
    let validationStatus = 'Validated';
    if (documentValid === true) {
      fileValid = 'True';
    } else if (documentValid === false) {
      fileValid = 'False';
    } else {
      fileValid = '';
      validationStatus = 'Pending Validation';
    }
    if (result.report && result.report.errors) {
      const activities = result.report.errors;
      if (activities.length === 0) {
        const row = [registryName, documentUrl, validationStatus, fileValid, '', '', '', '', '', '', ''];
        tabularData.push(row);
      }
      activities.forEach((activity) => {
        const activityTitle = activity.title;
        const activityId = activity.identifier;
        const activityErrorCats = activity.errors;
        activityErrorCats.forEach((activityErrorCat) => {
          const errorCategory = activityErrorCat.category;
          const { errors } = activityErrorCat;
          errors.forEach((error) => {
            const errorId = error.id;
            const errorSeverity = error.severity;
            const errorMessage = error.message;
            const errorContexts = error.context;
            let contextText = '';
            errorContexts.forEach((context) => {
              if (context.text) {
                contextText += context.text;
                contextText += ' ';
              }
            });
            const row = [
              registryName,
              documentUrl,
              validationStatus,
              fileValid,
              activityTitle,
              activityId,
              getCategoryLabel(errorCategory),
              errorSeverity,
              errorId,
              errorMessage,
              contextText,
            ];
            tabularData.push(row);
          });
        });
      });
    } else {
      const row = [registryName, documentUrl, validationStatus, fileValid, '', '', '', '', '', '', ''];
      tabularData.push(row);
    }
  });
  return stringify(tabularData);
};

export const containsQuotedTrailingWhitespace = (text) => {
  const quotedStrings = text.match(/"(.*?)"/g)?.map((item) => item.slice(1, -1));
  const hasTrailingWhitespace = quotedStrings?.some((str) => str.trim() !== str);
  return hasTrailingWhitespace;
};
