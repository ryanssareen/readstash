# Safari Extension Setup

Safari uses the same Web Extensions API as Chrome. Convert the Chrome extension to a Safari extension using Apple's built-in tool.

## Steps

1. **Open Terminal** and run:

```bash
xcrun safari-web-extension-converter /path/to/readstash/extension --project-location ./safari-extension --app-name "ReadStash" --bundle-identifier com.readstash.extension
```

2. **Open the generated Xcode project** in `safari-extension/`

3. **Build & Run** (Cmd+R) — this installs the extension in Safari

4. **Enable in Safari**: Safari → Settings → Extensions → check ReadStash

## Notes

- Requires macOS with Xcode installed
- The converter creates a native macOS/iOS app wrapper around the web extension
- No code changes needed — the same `manifest.json`, `popup.html`, and `popup.js` work in Safari
- For iOS: select an iOS target in Xcode to build the Safari extension for iPhone/iPad
