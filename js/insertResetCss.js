function insertResetCss(selector) {
  const style = document.createElement('style')
  style.innerHTML = `
  <style>
  ${selector} *,:before,:after {
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: var(--un-default-border-color, #e5e7eb)
  }

  ${selector} :before,:after {
    --un-content: ""
  }

  ${selector},${selector} :host {
    line-height: 1.5;
    -webkit-text-size-adjust: 100%;
    -moz-tab-size: 4;
    tab-size: 4;
    font-family: ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";
    font-feature-settings: normal;
    font-variation-settings: normal;
    -webkit-tap-highlight-color: transparent
  }

  ${selector} {
    margin: 0;
    line-height: inherit
  }

  ${selector} hr {
    height: 0;
    color: inherit;
    border-top-width: 1px
  }

  ${selector} abbr:where([title]) {
    text-decoration: underline dotted
  }

  ${selector} h1,h2,h3,h4,h5,h6 {
    font-size: inherit;
    font-weight: inherit
  }

  ${selector} a {
    color: inherit;
    text-decoration: inherit
  }

  ${selector} b,strong {
    font-weight: bolder
  }

  ${selector} code,kbd,samp,pre {
    font-family: ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;
    font-feature-settings: normal;
    font-variation-settings: normal;
    font-size: 1em
  }

  ${selector} small {
    font-size: 80%
  }

  ${selector} sub,sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline
  }

  ${selector} sub {
    bottom: -.25em
  }

  ${selector} sup {
    top: -.5em
  }

  ${selector} table {
    text-indent: 0;
    border-color: inherit;
    border-collapse: collapse
  }

  ${selector} button,input,optgroup,select,textarea {
    font-family: inherit;
    font-feature-settings: inherit;
    font-variation-settings: inherit;
    font-size: 100%;
    font-weight: inherit;
    line-height: inherit;
    color: inherit;
    margin: 0;
    padding: 0
  }

  ${selector} button,select {
    text-transform: none
  }

  ${selector} button,[type=button],[type=reset],[type=submit] {
    -webkit-appearance: button;
    background-color: transparent;
    background-image: none
  }

  ${selector} :-moz-focusring {
    outline: auto
  }

  ${selector} :-moz-ui-invalid {
    box-shadow: none
  }

  ${selector} progress {
    vertical-align: baseline
  }

  ${selector} ::-webkit-inner-spin-button,::-webkit-outer-spin-button {
    height: auto
  }

  ${selector} [type=search] {
    -webkit-appearance: textfield;
    outline-offset: -2px
  }

  ${selector} ::-webkit-search-decoration {
    -webkit-appearance: none
  }

  ${selector} ::-webkit-file-upload-button {
    -webkit-appearance: button;
    font: inherit
  }

  ${selector} summary {
    display: list-item
  }

  ${selector} blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre {
    margin: 0
  }

  ${selector} fieldset {
    margin: 0;
    padding: 0
  }

  ${selector} legend {
    padding: 0
  }

  ${selector} ol,ul,menu {
    list-style: none;
    margin: 0;
    padding: 0
  }

  ${selector} dialog {
    padding: 0
  }

  ${selector} textarea {
    resize: vertical
  }

  ${selector} input::placeholder,textarea::placeholder {
    opacity: 1;
    color: #9ca3af
  }

  ${selector} button,[role=button] {
    cursor: pointer
  }

  ${selector} :disabled {
    cursor: default
  }

  ${selector} img,svg,video,canvas,audio,iframe,embed,object {
    display: block;
    vertical-align: middle
  }

  ${selector} img,video {
    max-width: 100%;
    height: auto
  }

  ${selector} [hidden] {
    display: none
  }
</style>`
  document.head.append(style)
}
