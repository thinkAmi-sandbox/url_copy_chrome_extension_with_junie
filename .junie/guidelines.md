# Problem to be Solved
When referencing a page displayed in Chrome for a blog post, the URL needs to be formatted in markdown URL format.

Example:
`[Clineとともに、AmazonのURLをシンプル化するChrome拡張を作ってみた - メモ的な思考的な](https://thinkami.hatenablog.com/entry/2025/03/23/225415)`

Currently, the process involves copying and pasting the URL from the address bar and the page title separately, then manually formatting them into markdown URL format. This is time-consuming.

Therefore, by using a Chrome extension, we aim to automatically generate a markdown-formatted URL using the URL and title of the currently displayed page.


# Features of the Chrome Extension

- Using a shortcut key, the extension will copy a markdown-formatted URL to the clipboard, based on the URL and the HTML title tag of the currently displayed page in Chrome.
- The expected shortcut keys differ by operating system:
  - By OS:
    - Windows:
      - Ctrl+I 
    - macOS:
      - Cmd+I
- The markdown format will be as follows:
  - `[<Title Tag of the Displayed HTML>](<URL of the Displayed Page>)`
    - `<Title Tag of the Displayed HTML>` will be replaced with the title tag of the current page.
    - `<URL of the Displayed Page>` will be replaced with the URL of the current page.
- After copying to the clipboard, the copied content will be shown on the browser as a flash message-like notification.


# Expected Behavior of the Chrome Extension

|No|URL|title tag|Expected Output|
|---|---|---|---|
|1|https://thinkami.hatenablog.com/entry/2025/03/23/225415|`<title>Cline and I Tried Creating a Chrome Extension to Simplify Amazon URLs - Memo-like, Thought-like</title>`|`[Cline and I Tried Creating a Chrome Extension to Simplify Amazon URLs - Memo-like, Thought-like](https://thinkami.hatenablog.com/entry/2025/03/23/225415)`|