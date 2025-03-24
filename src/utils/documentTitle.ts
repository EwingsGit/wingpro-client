// src/utils/documentTitle.ts

/**
 * Sets the document title with WingPro prefix
 * @param title Title to set in the document
 * @param includeAppName Whether to include the app name (defaults to true)
 */
export const setDocumentTitle = (
  title: string,
  includeAppName = true
): void => {
  document.title = includeAppName ? `${title} | WingPro` : title;
};

export default setDocumentTitle;
