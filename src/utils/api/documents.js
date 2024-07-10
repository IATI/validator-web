import { SERVICES_URL, getDefaultServicesAPIOptions } from ".";

export const getDocumentURL = (value, lookupKey = "name") =>
  `${SERVICES_URL}/pvt/documents/${value}?lookupKey=${lookupKey}`;
export const fetchDocument = async (lookupValue, lookupKey = "name", tryAlternateLookupKey = true) => {
  const url = getDocumentURL(lookupValue, lookupKey);
  const response = await window.fetch(url, getDefaultServicesAPIOptions());
  if (response.status === 200) {
    const data = await response.json();

    return { status: 200, data: data[0], lookupKey };
  }
  if (response.status === 404 && tryAlternateLookupKey) {
    return await fetchDocument(lookupValue, lookupKey === "name" ? "id" : "name", false);
  }

  return { status: response.status, data: null, lookupKey };
};

export const validationReportURL = (value, isTestFile = false, lookupKey = "name") =>
  `${SERVICES_URL}/pub/validation/existing?${isTestFile ? "testfile" : lookupKey}=${value}`;
export const fetchValidationReport = async (
  documentName,
  isTestFile = false,
  lookupKey = "name",
  tryAlternateLookupKey = true,
) => {
  let url = validationReportURL(documentName, isTestFile, lookupKey);
  let response = await window.fetch(url, getDefaultServicesAPIOptions());
  if (response.status === 200) {
    const data = await response.json();

    return { data, status: response.status };
  }
  if (response.status === 404 && !isTestFile && tryAlternateLookupKey) {
    // switch lookup key
    return {
      data: await fetchValidationReport(documentName, isTestFile, lookupKey === "name" ? "id" : "name", false),
      status: response.status,
    };
  }
  if (response.status === 404) {
    return { data: null, status: response.status };
  }

  return null;
};
