import { SERVICES_URL, getDefaultServicesAPIOptions } from '.';
import { compareDocumentSeverity } from '../document';

export const getOrganisationsURL = () => `${SERVICES_URL}/pvt/publishers`;
export const fetchOrganisations = async () => {
  const url = getOrganisationsURL();
  const response = await window.fetch(url, getDefaultServicesAPIOptions());
  if (response.status === 200) {
    const data = await response.json();
    return data.sort((a, b) =>
      (a.title || '')
        .toString()
        .toLowerCase()
        .localeCompare((b.title || '').toString().toLowerCase())
    );
  }

  return [];
};

export const getOrganisationURL = (value, lookupKey = 'name') =>
  `${SERVICES_URL}/pvt/publishers/${value}?lookupKey=${lookupKey}`;
export const fetchOrganisationByName = async (name) => {
  const url = getOrganisationURL(name);
  const response = await window.fetch(url, getDefaultServicesAPIOptions());
  if (response.status === 200) {
    const data = await response.json();
    return data && data.length ? data[0] : null;
  }
};
export const fetchOrganisationByID = async (id) => {
  const url = getOrganisationURL(id, 'id');
  const response = await window.fetch(url, getDefaultServicesAPIOptions());
  if (response.status === 200) {
    const data = await response.json();
    return data && data.length ? data[0] : null;
  }
};

export const getOrganisationDocumentsURL = (organisationID) =>
  `${SERVICES_URL}/pvt/publishers/${organisationID}/documents`;
export const fetchOrganisationDocuments = async (organisationID) => {
  const url = getOrganisationDocumentsURL(organisationID);
  const response = await window.fetch(url, getDefaultServicesAPIOptions());
  if (response.status === 200) {
    const data = await response.json();

    if (data && data.length) {
      return data.sort(compareDocumentSeverity);
    }
  }

  return [];
};
