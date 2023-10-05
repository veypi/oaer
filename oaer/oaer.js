import { openBlock as r, createElementBlock as p, createApp as _ } from "vue";
const s = (t, c) => {
  const e = t.__vccOpts || t;
  for (const [n, o] of c)
    e[n] = o;
  return e;
}, a = {};
function f(t, c) {
  return r(), p("div", null, " 123 ");
}
const l = /* @__PURE__ */ s(a, [["render", f]]);
_(l).mount("#app");
