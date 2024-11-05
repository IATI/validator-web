import { last } from "rxjs";
import { v4 as uuidv4 } from "uuid";
import { getDefaultServicesAPIOptions, SERVICES_URL } from ".";
import { getDocumentValidationStatus } from "../document";

export const uploadFile = async (file, tmpWorkspaceId) => {
  if (!file) {
    return null;
  }

  const url = `${SERVICES_URL}/pvt/adhoc/upload?sessionId=${tmpWorkspaceId}&filename=${file.name}&guid=${uuidv4()}`;
  const uploadData = new FormData();
  uploadData.append("file", file, file.name);

  const response = await window.fetch(url, { ...getDefaultServicesAPIOptions(), method: "post", body: uploadData });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text);
  }
  return last(response);
};

export const fetchFileFromURL = async (fileUrl, workspaceID) => {
  if (!fileUrl) return null;

  const url = `${SERVICES_URL}/pvt/adhoc/url?sessionId=${workspaceID}&url=${fileUrl}&guid=${uuidv4()}`;

  const req = await window.fetch(url, {
    ...getDefaultServicesAPIOptions(),
    method: "post",
    body: JSON.stringify({ url: fileUrl }),
  });

  if (req.status === 200) return "success";

  let errorMessage = "";
  if (req.status === 422) {
    const error = await req.json();
    errorMessage = error.message.includes(fileUrl) ? error.message : `${error.url} - ${error.message}`;
  } else if (req.status === 503) {
    const error = await req.json();
    errorMessage = error.message;
  } else {
    errorMessage = req.text;
  }
  throw new Error(errorMessage, { cause: { status: req.status } });
};

export const getTempWorkspaceURL = (workspaceID) => `${SERVICES_URL}/pvt/adhoc/session/?sessionId=${workspaceID}`;
export const fetchTempWorkspace = async (workspaceID) => {
  const url = getTempWorkspaceURL(workspaceID);

  const response = await window.fetch(url, getDefaultServicesAPIOptions());
  if (response.status === 200) {
    const data = await response.json();

    return data;
  }

  return null;
};

export const getFileStatusClass = (dataset) => {
  if (dataset.report) {
    const status = getDocumentValidationStatus(dataset);
    return `text-${status.value}`;
  }

  return { "text-default": true };
};

export const getFileValidationStatus = (dataset) => {
  if (dataset.report) {
    const status = getDocumentValidationStatus(dataset);
    return status.caption;
  }

  return null;
};
