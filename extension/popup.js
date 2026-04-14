const APP_URL = "https://readstash.vercel.app";

const saveBtn = document.getElementById("save-btn");
const pageTitle = document.getElementById("page-title");
const pageDomain = document.getElementById("page-domain");
const pageFaviconImg = document.getElementById("page-favicon-img");
const dashboardLink = document.getElementById("dashboard-link");

dashboardLink.href = APP_URL + "/dashboard";

function getDomain(url) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

async function getMetadata(tabId) {
  try {
    return await chrome.tabs.sendMessage(tabId, { type: "GET_METADATA" });
  } catch {
    return {};
  }
}

async function init() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;

  const domain = getDomain(tab.url);
  pageTitle.textContent = tab.title || tab.url;
  pageDomain.textContent = domain;
  pageFaviconImg.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

  saveBtn.addEventListener("click", async () => {
    const metadata = await getMetadata(tab.id);

    const params = new URLSearchParams({
      url: tab.url,
      title: metadata.title || tab.title || "",
      description: metadata.description || "",
      image: metadata.image || "",
      domain: domain,
    });

    chrome.tabs.create({ url: `${APP_URL}/save?${params.toString()}` });
    window.close();
  });
}

init();
