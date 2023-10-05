import fetch from 'node-fetch';
import { parse } from 'node-html-parser';

const getMetaData = async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is missing' });
    }

    let fixUrl = url.includes('https://') ? url : `https://${url}`

    // Fetch the URL
    const response = await fetch(fixUrl);
    const html = await response.text();
    const root = parse(html);

    const baseUrl = new URL(fixUrl);
    const originUrl = baseUrl.origin;
    // Extract metadata (you can customize this based on your needs)
    const title = root.querySelector('title').text;
    const faviconLink = root.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
    let faviconUrl = ''
    console.log(faviconUrl)

    if (faviconLink) {
      // Get the href attribute (URL) of the favicon
      faviconUrl = faviconLink.getAttribute('href');
    }

    // Return the metadata
    res.status(200).json({ title: title, faviconUrl: faviconUrl, originUrl: originUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export default getMetaData