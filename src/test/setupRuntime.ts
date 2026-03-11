// JSDOM doesn't implement scrollIntoView
Object.defineProperty(window.HTMLElement.prototype, "scrollIntoView", {
  value: function () {},
  writable: true,
});
