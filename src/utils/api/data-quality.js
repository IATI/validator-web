import { SERVICES_URL, getDefaultServicesAPIOptions } from ".";

export const getGuidanceLinksURL = (version) => `${SERVICES_URL}/pvt/guidance-links/${version}`;
export const fetchGuidanceLinks = async (version) => {
  const url = getGuidanceLinksURL(version);
  const response = await window.fetch(url, getDefaultServicesAPIOptions());
  if (response.status === 200) {
    const data = await response.json();

    return data;
  }
  const error = await response.json();
  if (error.error) {
    throw new Error(error.message);
  }

  return null;
};
