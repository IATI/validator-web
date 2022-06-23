import { SERVICES_URL, getDefaultServicesAPIOptions } from '.';

export const getDocumentURL = (documentID) => `${SERVICES_URL}/pvt/documents/${documentID}`;
export const fetchDocumentByID = async (documentID) => {
  const url = getDocumentURL(documentID);
  const response = await window.fetch(url, getDefaultServicesAPIOptions());
  if (response.status === 200) {
    const data = await response.json();

    return data[0];
  }

  return null;
};

export const validationReportURL = (documentID) => `${SERVICES_URL}/pub/validation/existing?id=${documentID}`;
export const fetchValidationReport = async (documentID) => {
  const url = validationReportURL(documentID);
  const response = await window.fetch(url, getDefaultServicesAPIOptions());
  if (response.status === 200) {
    const data = await response.json();

    return data;
  }

  return null;
};
