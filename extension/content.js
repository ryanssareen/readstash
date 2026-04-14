// Content script — extracts page metadata for the extension popup

function getMetaContent(property) {
  const meta =
    document.querySelector(`meta[property="${property}"]`) ||
    document.querySelector(`meta[name="${property}"]`);
  return meta ? meta.getAttribute("content") : null;
}

function getPageMetadata() {
  return {
    title:
      getMetaContent("og:title") ||
      getMetaContent("twitter:title") ||
      document.title ||
      "",
    description:
      getMetaContent("og:description") ||
      getMetaContent("twitter:description") ||
      getMetaContent("description") ||
      "",
    image:
      getMetaContent("og:image") ||
      getMetaContent("twitter:image") ||
      null,
  };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_METADATA") {
    sendResponse(getPageMetadata());
  }
});
