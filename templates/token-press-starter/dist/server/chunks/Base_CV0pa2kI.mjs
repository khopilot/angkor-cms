globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DFaPMFRf.mjs";
import { aB as createRenderInstruction, m as maybeRenderHead, bw as renderSlot, h as renderTemplate, g as addAttribute, P as unescapeHTML, x as getDefaultExportFromCjs, F as Fragment, q as renderHead } from "./sequence_DzjOVBrG.mjs";
import { s as spreadAttributes, r as renderComponent } from "./worker-entry_KOHBbzDu.mjs";
import { af as getMenu$1 } from "./adapt-sandbox-entry_DgOh8so3.mjs";
import "./index_lite_CWDp5SAU.mjs";
import "./index_DFnuKuIX.mjs";
import { g as getEmDashCollection$1 } from "./query-CS_iSj34_lQDETB4f.mjs";
import { g as getRequestContext } from "./request-context_CERgKQIY.mjs";
import { C as CommentRepository } from "./comment_dXUVZELP.mjs";
import { K as Kysely } from "./kysely_0Asa_Yyn.mjs";
import { SchemaRegistry } from "./registry_BmtqkhAJ.mjs";
import { s as sql } from "./sql_DV5B95Nm.mjs";
import require$$1 from "path";
import require$$3 from "url";
import require$$0 from "fs";
import { $ as $$ResponsiveImage } from "./_astro_assets_BVvpUeMf.mjs";
async function renderScript(result2, id) {
  const inlined = result2.inlinedScripts.get(id);
  let content = "";
  if (inlined != null) {
    if (inlined) {
      content = `<script type="module">${inlined}<\/script>`;
    }
  } else {
    const resolved = await result2.resolve(id);
    content = `<script type="module" src="${result2.userAssetsBase ? (result2.base === "/" ? "" : result2.base) + result2.userAssetsBase : ""}${resolved}"><\/script>`;
  }
  return createRenderInstruction({ type: "script", id, content });
}
let virtualConfig;
let virtualCreateDialect;
async function loadVirtualModules() {
  if (virtualConfig === void 0) {
    const configModule = await import("./config_CG7YeZVr.mjs");
    virtualConfig = configModule.default;
  }
  if (virtualCreateDialect === void 0) {
    const dialectModule = await import("./dialect_BKY1UUaD.mjs");
    virtualCreateDialect = dialectModule.createDialect;
  }
}
let dbInstance = null;
async function getDb() {
  const ctx = getRequestContext();
  if (ctx?.db) {
    return ctx.db;
  }
  if (!dbInstance) {
    await loadVirtualModules();
    if (!virtualConfig?.database || typeof virtualCreateDialect !== "function") {
      throw new Error(
        "EmDash database not configured. Add database config to emdash() in astro.config.mjs"
      );
    }
    const dialect = virtualCreateDialect(virtualConfig.database.config);
    dbInstance = new Kysely({ dialect });
  }
  return dbInstance;
}
async function getCollectionInfo(slug) {
  const db = await getDb();
  return getCollectionInfoWithDb(db, slug);
}
async function getCollectionInfoWithDb(db, slug) {
  const registry = new SchemaRegistry(db);
  return registry.getCollection(slug);
}
function isPortableTextSpan(node2) {
  return node2._type === "span" && "text" in node2 && typeof node2.text == "string" && (typeof node2.marks > "u" || Array.isArray(node2.marks) && node2.marks.every((mark) => typeof mark == "string"));
}
function isPortableTextBlock(node2) {
  return (
    // A block doesn't _have_ to be named 'block' - to differentiate between
    // allowed child types and marks, one might name them differently
    typeof node2._type == "string" && // Toolkit-types like nested spans are @-prefixed
    node2._type[0] !== "@" && // `markDefs` isn't _required_ per say, but if it's there, it needs to be an array
    (!("markDefs" in node2) || !node2.markDefs || Array.isArray(node2.markDefs) && // Every mark definition needs to have an `_key` to be mappable in child spans
    node2.markDefs.every((def) => typeof def._key == "string")) && // `children` is required and needs to be an array
    "children" in node2 && Array.isArray(node2.children) && // All children are objects with `_type` (usually spans, but can contain other stuff)
    node2.children.every((child) => typeof child == "object" && "_type" in child)
  );
}
function isPortableTextListItemBlock(block) {
  return isPortableTextBlock(block) && "listItem" in block && typeof block.listItem == "string" && (typeof block.level > "u" || typeof block.level == "number");
}
function isPortableTextToolkitList(block) {
  return block._type === "@list";
}
function isPortableTextToolkitSpan(span) {
  return span._type === "@span";
}
function isPortableTextToolkitTextNode(node2) {
  return node2._type === "@text";
}
const knownDecorators = ["strong", "em", "code", "underline", "strike-through"];
function sortMarksByOccurences(span, index, blockChildren) {
  if (!isPortableTextSpan(span) || !span.marks)
    return [];
  if (!span.marks.length)
    return [];
  const marks = span.marks.slice(), occurences = {};
  return marks.forEach((mark) => {
    occurences[mark] = 1;
    for (let siblingIndex = index + 1; siblingIndex < blockChildren.length; siblingIndex++) {
      const sibling = blockChildren[siblingIndex];
      if (sibling && isPortableTextSpan(sibling) && Array.isArray(sibling.marks) && sibling.marks.indexOf(mark) !== -1)
        occurences[mark]++;
      else
        break;
    }
  }), marks.sort((markA, markB) => sortMarks(occurences, markA, markB));
}
function sortMarks(occurences, markA, markB) {
  const aOccurences = occurences[markA], bOccurences = occurences[markB];
  if (aOccurences !== bOccurences)
    return bOccurences - aOccurences;
  const aKnownPos = knownDecorators.indexOf(markA), bKnownPos = knownDecorators.indexOf(markB);
  return aKnownPos !== bKnownPos ? aKnownPos - bKnownPos : markA.localeCompare(markB);
}
function buildMarksTree(block) {
  var _a2;
  const { children } = block, markDefs = block.markDefs ?? [];
  if (!children || !children.length)
    return [];
  const sortedMarks = children.map(sortMarksByOccurences), rootNode = {
    _type: "@span",
    children: [],
    markType: "<unknown>"
  };
  let nodeStack = [rootNode];
  for (let i = 0; i < children.length; i++) {
    const span = children[i];
    if (!span)
      continue;
    const marksNeeded = sortedMarks[i] || [];
    let pos = 1;
    if (nodeStack.length > 1)
      for (pos; pos < nodeStack.length; pos++) {
        const mark = ((_a2 = nodeStack[pos]) == null ? void 0 : _a2.markKey) || "", index = marksNeeded.indexOf(mark);
        if (index === -1)
          break;
        marksNeeded.splice(index, 1);
      }
    nodeStack = nodeStack.slice(0, pos);
    let currentNode = nodeStack[nodeStack.length - 1];
    if (currentNode) {
      for (const markKey of marksNeeded) {
        const markDef = markDefs == null ? void 0 : markDefs.find((def) => def._key === markKey), markType = markDef ? markDef._type : markKey, node2 = {
          _type: "@span",
          _key: span._key,
          children: [],
          markDef,
          markType,
          markKey
        };
        currentNode.children.push(node2), nodeStack.push(node2), currentNode = node2;
      }
      if (isPortableTextSpan(span)) {
        const lines = span.text.split(`
`);
        for (let line = lines.length; line-- > 1; )
          lines.splice(line, 0, `
`);
        currentNode.children = currentNode.children.concat(
          lines.map((text) => ({ _type: "@text", text }))
        );
      } else
        currentNode.children = currentNode.children.concat(span);
    }
  }
  return rootNode.children;
}
function nestLists(blocks, mode) {
  const tree = [];
  let currentList;
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (block) {
      if (!isPortableTextListItemBlock(block)) {
        tree.push(block), currentList = void 0;
        continue;
      }
      if (!currentList) {
        currentList = listFromBlock(block, i, mode), tree.push(currentList);
        continue;
      }
      if (blockMatchesList(block, currentList)) {
        currentList.children.push(block);
        continue;
      }
      if ((block.level || 1) > currentList.level) {
        const newList = listFromBlock(block, i, mode);
        if (mode === "html") {
          const lastListItem = currentList.children[currentList.children.length - 1], newLastChild = {
            ...lastListItem,
            children: [...lastListItem.children, newList]
          };
          currentList.children[currentList.children.length - 1] = newLastChild;
        } else
          currentList.children.push(
            newList
          );
        currentList = newList;
        continue;
      }
      if ((block.level || 1) < currentList.level) {
        const matchingBranch = tree[tree.length - 1], match = matchingBranch && findListMatching(matchingBranch, block);
        if (match) {
          currentList = match, currentList.children.push(block);
          continue;
        }
        currentList = listFromBlock(block, i, mode), tree.push(currentList);
        continue;
      }
      if (block.listItem !== currentList.listItem) {
        const matchingBranch = tree[tree.length - 1], match = matchingBranch && findListMatching(matchingBranch, { level: block.level || 1 });
        if (match && match.listItem === block.listItem) {
          currentList = match, currentList.children.push(block);
          continue;
        } else {
          currentList = listFromBlock(block, i, mode), tree.push(currentList);
          continue;
        }
      }
      console.warn("Unknown state encountered for block", block), tree.push(block);
    }
  }
  return tree;
}
function blockMatchesList(block, list) {
  return (block.level || 1) === list.level && block.listItem === list.listItem;
}
function listFromBlock(block, index, mode) {
  return {
    _type: "@list",
    _key: `${block._key || `${index}`}-parent`,
    mode,
    level: block.level || 1,
    listItem: block.listItem,
    children: [block]
  };
}
function findListMatching(rootNode, matching) {
  const level = matching.level || 1, style = matching.listItem || "normal", filterOnType = typeof matching.listItem == "string";
  if (isPortableTextToolkitList(rootNode) && (rootNode.level || 1) === level && filterOnType && (rootNode.listItem || "normal") === style)
    return rootNode;
  if (!("children" in rootNode))
    return;
  const node2 = rootNode.children[rootNode.children.length - 1];
  return node2 && !isPortableTextSpan(node2) ? findListMatching(node2, matching) : void 0;
}
const LIST_NEST_MODE_HTML = "html";
function isComponent(it) {
  return typeof it === "function";
}
function mergeComponents(components, overrides) {
  const cmps = { ...components };
  for (const [key2, override] of Object.entries(overrides)) {
    const current = components[key2];
    const value = !current || isComponent(override) || isComponent(current) ? override : {
      ...current,
      ...override
    };
    cmps[key2] = value;
  }
  return cmps;
}
const getTemplate = (prop, type) => `PortableText [components.${prop}] is missing "${type}"`;
const unknownTypeWarning = (type) => getTemplate("type", type);
const unknownMarkWarning = (markType) => getTemplate("mark", markType);
const unknownBlockWarning = (style) => getTemplate("block", style);
const unknownListWarning = (listItem) => getTemplate("list", listItem);
const unknownListItemWarning = (listStyle) => getTemplate("listItem", listStyle);
const getWarningMessage = (nodeType, type) => {
  const fncs = {
    block: unknownBlockWarning,
    list: unknownListWarning,
    listItem: unknownListItemWarning,
    mark: unknownMarkWarning,
    type: unknownTypeWarning
  };
  return fncs[nodeType](type);
};
function printWarning(message) {
  console.warn(message);
}
const key = /* @__PURE__ */ Symbol("astro-portabletext");
function usePortableText(node2) {
  if (!(key in globalThis)) {
    throw new Error(`PortableText "context" has not been initialised`);
  }
  return globalThis[key](node2);
}
const $$Block = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Block;
  const props = Astro2.props;
  const { node: node2, index, isInline, ...attrs } = props;
  const styleIs = (style) => style === node2.style;
  const { getUnknownComponent } = usePortableText(node2);
  const UnknownStyle = getUnknownComponent();
  return renderTemplate`${styleIs("h1") ? renderTemplate`${maybeRenderHead()}<h1${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</h1>` : styleIs("h2") ? renderTemplate`<h2${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</h2>` : styleIs("h3") ? renderTemplate`<h3${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</h3>` : styleIs("h4") ? renderTemplate`<h4${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</h4>` : styleIs("h5") ? renderTemplate`<h5${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</h5>` : styleIs("h6") ? renderTemplate`<h6${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</h6>` : styleIs("blockquote") ? renderTemplate`<blockquote${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</blockquote>` : styleIs("normal") ? renderTemplate`<p${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</p>` : renderTemplate`${renderComponent($$result, "UnknownStyle", UnknownStyle, { ...props }, { "default": ($$result2) => renderTemplate`${renderSlot($$result2, $$slots["default"])}` })}`}`;
}, "/Users/niko/Documents/github/angkor-cms/node_modules/.pnpm/astro-portabletext@0.11.4_astro@6.0.1_@types+node@24.10.13_jiti@2.6.1_lightningcss@1.31_ca03ad5e9ac5ab91b513ebc15ca12665/node_modules/astro-portabletext/components/Block.astro", void 0);
const $$HardBreak = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<br>`;
}, "/Users/niko/Documents/github/angkor-cms/node_modules/.pnpm/astro-portabletext@0.11.4_astro@6.0.1_@types+node@24.10.13_jiti@2.6.1_lightningcss@1.31_ca03ad5e9ac5ab91b513ebc15ca12665/node_modules/astro-portabletext/components/HardBreak.astro", void 0);
const $$List = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$List;
  const { node: node2, index, isInline, ...attrs } = Astro2.props;
  const listItemIs = (listItem) => listItem === node2.listItem;
  return renderTemplate`${listItemIs("menu") ? renderTemplate`${maybeRenderHead()}<menu${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</menu>` : listItemIs("number") ? renderTemplate`<ol${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</ol>` : renderTemplate`<ul${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</ul>`}`;
}, "/Users/niko/Documents/github/angkor-cms/node_modules/.pnpm/astro-portabletext@0.11.4_astro@6.0.1_@types+node@24.10.13_jiti@2.6.1_lightningcss@1.31_ca03ad5e9ac5ab91b513ebc15ca12665/node_modules/astro-portabletext/components/List.astro", void 0);
const $$ListItem = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$ListItem;
  const { node: node2, index, isInline, ...attrs } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<li${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</li>`;
}, "/Users/niko/Documents/github/angkor-cms/node_modules/.pnpm/astro-portabletext@0.11.4_astro@6.0.1_@types+node@24.10.13_jiti@2.6.1_lightningcss@1.31_ca03ad5e9ac5ab91b513ebc15ca12665/node_modules/astro-portabletext/components/ListItem.astro", void 0);
const $$Mark = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Mark;
  const props = Astro2.props;
  const { node: node2, index, isInline, ...attrs } = props;
  const markTypeIs = (markType) => markType === node2.markType;
  const { getUnknownComponent } = usePortableText(node2);
  const UnknownMarkType = getUnknownComponent();
  return renderTemplate`${markTypeIs("code") ? renderTemplate`${maybeRenderHead()}<code${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</code>` : markTypeIs("em") ? renderTemplate`<em${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</em>` : markTypeIs("link") ? renderTemplate`<a${addAttribute(node2.markDef.href, "href")}${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</a>` : markTypeIs("strike-through") ? renderTemplate`<del${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</del>` : markTypeIs("strong") ? renderTemplate`<strong${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</strong>` : markTypeIs("underline") ? renderTemplate`<span style="text-decoration: underline;"${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</span>` : renderTemplate`${renderComponent($$result, "UnknownMarkType", UnknownMarkType, { ...props }, { "default": ($$result2) => renderTemplate`${renderSlot($$result2, $$slots["default"])}` })}`}`;
}, "/Users/niko/Documents/github/angkor-cms/node_modules/.pnpm/astro-portabletext@0.11.4_astro@6.0.1_@types+node@24.10.13_jiti@2.6.1_lightningcss@1.31_ca03ad5e9ac5ab91b513ebc15ca12665/node_modules/astro-portabletext/components/Mark.astro", void 0);
const $$Text = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Text;
  const { node: node2 } = Astro2.props;
  return renderTemplate`${node2.text}`;
}, "/Users/niko/Documents/github/angkor-cms/node_modules/.pnpm/astro-portabletext@0.11.4_astro@6.0.1_@types+node@24.10.13_jiti@2.6.1_lightningcss@1.31_ca03ad5e9ac5ab91b513ebc15ca12665/node_modules/astro-portabletext/components/Text.astro", void 0);
const $$UnknownBlock = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<p data-portabletext-unknown="block">${renderSlot($$result, $$slots["default"])}</p>`;
}, "/Users/niko/Documents/github/angkor-cms/node_modules/.pnpm/astro-portabletext@0.11.4_astro@6.0.1_@types+node@24.10.13_jiti@2.6.1_lightningcss@1.31_ca03ad5e9ac5ab91b513ebc15ca12665/node_modules/astro-portabletext/components/UnknownBlock.astro", void 0);
const $$UnknownList = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<ul data-portabletext-unknown="list">${renderSlot($$result, $$slots["default"])}</ul>`;
}, "/Users/niko/Documents/github/angkor-cms/node_modules/.pnpm/astro-portabletext@0.11.4_astro@6.0.1_@types+node@24.10.13_jiti@2.6.1_lightningcss@1.31_ca03ad5e9ac5ab91b513ebc15ca12665/node_modules/astro-portabletext/components/UnknownList.astro", void 0);
const $$UnknownListItem = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<li data-portabletext-unknown="listitem">${renderSlot($$result, $$slots["default"])}</li>`;
}, "/Users/niko/Documents/github/angkor-cms/node_modules/.pnpm/astro-portabletext@0.11.4_astro@6.0.1_@types+node@24.10.13_jiti@2.6.1_lightningcss@1.31_ca03ad5e9ac5ab91b513ebc15ca12665/node_modules/astro-portabletext/components/UnknownListItem.astro", void 0);
const $$UnknownMark = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<span data-portabletext-unknown="mark">${renderSlot($$result, $$slots["default"])}</span>`;
}, "/Users/niko/Documents/github/angkor-cms/node_modules/.pnpm/astro-portabletext@0.11.4_astro@6.0.1_@types+node@24.10.13_jiti@2.6.1_lightningcss@1.31_ca03ad5e9ac5ab91b513ebc15ca12665/node_modules/astro-portabletext/components/UnknownMark.astro", void 0);
const $$UnknownType = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$UnknownType;
  const { node: node2, isInline } = Astro2.props;
  const warning2 = getWarningMessage("type", node2._type);
  return renderTemplate`${isInline ? renderTemplate`${maybeRenderHead()}<span style="display:none" data-portabletext-unknown="type">${warning2}</span>` : renderTemplate`<div style="display:none" data-portabletext-unknown="type">${warning2}</div>`}`;
}, "/Users/niko/Documents/github/angkor-cms/node_modules/.pnpm/astro-portabletext@0.11.4_astro@6.0.1_@types+node@24.10.13_jiti@2.6.1_lightningcss@1.31_ca03ad5e9ac5ab91b513ebc15ca12665/node_modules/astro-portabletext/components/UnknownType.astro", void 0);
const $$PortableText$1 = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$PortableText$1;
  const {
    value,
    components: componentOverrides = {},
    listNestingMode = LIST_NEST_MODE_HTML,
    onMissingComponent = true
  } = Astro2.props;
  const components = mergeComponents(
    {
      type: {},
      unknownType: $$UnknownType,
      block: {
        h1: $$Block,
        h2: $$Block,
        h3: $$Block,
        h4: $$Block,
        h5: $$Block,
        h6: $$Block,
        blockquote: $$Block,
        normal: $$Block
      },
      unknownBlock: $$UnknownBlock,
      list: {
        bullet: $$List,
        number: $$List,
        menu: $$List
      },
      unknownList: $$UnknownList,
      listItem: {
        bullet: $$ListItem,
        number: $$ListItem,
        menu: $$ListItem
      },
      unknownListItem: $$UnknownListItem,
      mark: {
        code: $$Mark,
        em: $$Mark,
        link: $$Mark,
        "strike-through": $$Mark,
        strong: $$Mark,
        underline: $$Mark
      },
      unknownMark: $$UnknownMark,
      text: $$Text,
      hardBreak: $$HardBreak
    },
    componentOverrides
  );
  const noop = () => {
  };
  const missingComponentHandler = ((handler) => {
    if (typeof handler === "function") {
      return handler;
    }
    return !handler ? noop : printWarning;
  })(onMissingComponent);
  const asComponentProps = (node2, index, isInline) => ({
    node: node2,
    index,
    isInline
  });
  const provideComponent = (nodeType, type, fallbackComponent) => {
    const component = ((component2) => {
      return component2[type] || component2;
    })(components[nodeType]);
    if (isComponent(component)) {
      return component;
    }
    missingComponentHandler(getWarningMessage(nodeType, type), {
      nodeType,
      type
    });
    return fallbackComponent;
  };
  const cachedNodes = /* @__PURE__ */ new WeakMap();
  function cacheNode(node2, Default, Unknown) {
    cachedNodes.set(node2, { Default, Unknown });
  }
  let fallbackRenderOptions;
  const portableTextRender = (options, isInline) => {
    if (!fallbackRenderOptions) {
      throw new Error(
        "[PortableText portableTextRender] fallbackRenderOptions is undefined"
      );
    }
    const renderChildren = (children, inline = false) => {
      return children?.map(portableTextRender(options, inline)) ?? [];
    };
    const renderOptions = { ...fallbackRenderOptions, ...options ?? {} };
    return function renderNode(node2, index) {
      function run(handler, props) {
        if (!isComponent(handler)) {
          throw new Error(
            `[PortableText render] No handler found for node type ${node2._type}.`
          );
        }
        return handler(props);
      }
      if (isPortableTextToolkitList(node2)) {
        const UnknownComponent2 = components.unknownList ?? $$UnknownList;
        cacheNode(node2, $$List, UnknownComponent2);
        return run(renderOptions.list, {
          Component: provideComponent("list", node2.listItem, UnknownComponent2),
          props: asComponentProps(node2, index, false),
          children: renderChildren(node2.children, false)
        });
      }
      if (isPortableTextListItemBlock(node2)) {
        const { listItem, ...blockNode } = node2;
        const isStyled = node2.style && node2.style !== "normal";
        node2.children = isStyled ? renderNode(blockNode, index) : buildMarksTree(node2);
        const UnknownComponent2 = components.unknownListItem ?? $$UnknownListItem;
        cacheNode(node2, $$ListItem, UnknownComponent2);
        return run(renderOptions.listItem, {
          Component: provideComponent(
            "listItem",
            node2.listItem,
            UnknownComponent2
          ),
          props: asComponentProps(node2, index, false),
          children: isStyled ? node2.children : renderChildren(node2.children, true)
        });
      }
      if (isPortableTextToolkitSpan(node2)) {
        const UnknownComponent2 = components.unknownMark ?? $$UnknownMark;
        cacheNode(node2, $$Mark, UnknownComponent2);
        return run(renderOptions.mark, {
          Component: provideComponent("mark", node2.markType, UnknownComponent2),
          props: asComponentProps(node2, index, true),
          children: renderChildren(node2.children, true)
        });
      }
      if (isPortableTextBlock(node2)) {
        node2.style ??= "normal";
        node2.children = buildMarksTree(node2);
        const UnknownComponent2 = components.unknownBlock ?? $$UnknownBlock;
        cacheNode(node2, $$Block, UnknownComponent2);
        return run(renderOptions.block, {
          Component: provideComponent("block", node2.style, UnknownComponent2),
          props: asComponentProps(node2, index, false),
          children: renderChildren(node2.children, true)
        });
      }
      if (isPortableTextToolkitTextNode(node2)) {
        const isHardBreak = "\n" === node2.text;
        const props = asComponentProps(node2, index, true);
        if (isHardBreak) {
          return run(renderOptions.hardBreak, {
            Component: isComponent(components.hardBreak) ? components.hardBreak : $$HardBreak,
            props
          });
        }
        return run(renderOptions.text, {
          Component: isComponent(components.text) ? components.text : $$Text,
          props
        });
      }
      const UnknownComponent = components.unknownType ?? $$UnknownType;
      return run(renderOptions.type, {
        Component: provideComponent("type", node2._type, UnknownComponent),
        props: asComponentProps(
          node2,
          index,
          isInline ?? false
          /* default to block */
        )
      });
    };
  };
  globalThis[key] = (node2) => ({
    getDefaultComponent: provideDefaultComponent.bind(null, node2),
    getUnknownComponent: provideUnknownComponent.bind(null, node2),
    render: (options) => node2.children?.map(portableTextRender(options))
  });
  const provideDefaultComponent = (node2) => {
    const DefaultComponent = cachedNodes.get(node2)?.Default;
    if (DefaultComponent) return DefaultComponent;
    if (isPortableTextToolkitList(node2)) return $$List;
    if (isPortableTextListItemBlock(node2)) return $$ListItem;
    if (isPortableTextToolkitSpan(node2)) return $$Mark;
    if (isPortableTextBlock(node2)) return $$Block;
    if (isPortableTextToolkitTextNode(node2)) {
      return "\n" === node2.text ? $$HardBreak : $$Text;
    }
    return $$UnknownType;
  };
  const provideUnknownComponent = (node2) => {
    const UnknownComponent = cachedNodes.get(node2)?.Unknown;
    if (UnknownComponent) return UnknownComponent;
    if (isPortableTextToolkitList(node2)) {
      return components.unknownList ?? $$UnknownList;
    }
    if (isPortableTextListItemBlock(node2)) {
      return components.unknownListItem ?? $$UnknownListItem;
    }
    if (isPortableTextToolkitSpan(node2)) {
      return components.unknownMark ?? $$UnknownMark;
    }
    if (isPortableTextBlock(node2)) {
      return components.unknownBlock ?? $$UnknownBlock;
    }
    if (!isPortableTextToolkitTextNode(node2)) {
      return components.unknownType ?? $$UnknownType;
    }
    throw new Error(
      `[PortableText getUnknownComponent] Unable to provide component with node type ${node2._type}`
    );
  };
  const blocks = Array.isArray(value) ? value : value ? [value] : [];
  const nodes = nestLists(blocks, listNestingMode);
  const render = (options) => {
    fallbackRenderOptions = options;
    return portableTextRender(options);
  };
  const createSlotRenderer = (slotName) => Astro2.slots.render.bind(Astro2.slots, slotName);
  const slots = [
    "type",
    "block",
    "list",
    "listItem",
    "mark",
    "text",
    "hardBreak"
  ].reduce(
    (obj, name) => {
      obj[name] = Astro2.slots.has(name) ? createSlotRenderer(name) : void 0;
      return obj;
    },
    {}
  );
  return renderTemplate`${(() => {
    const renderNode = (slotRenderer) => {
      return ({ Component, props, children }) => slotRenderer?.([{ Component, props, children }]) ?? renderTemplate`${renderComponent($$result, "Component", Component, { ...props }, { "default": ($$result2) => renderTemplate`${children}` })}`;
    };
    return nodes.map(
      render({
        type: renderNode(slots.type),
        block: renderNode(slots.block),
        list: renderNode(slots.list),
        listItem: renderNode(slots.listItem),
        mark: renderNode(slots.mark),
        text: renderNode(slots.text),
        hardBreak: renderNode(slots.hardBreak)
      })
    );
  })()}`;
}, "/Users/niko/Documents/github/angkor-cms/node_modules/.pnpm/astro-portabletext@0.11.4_astro@6.0.1_@types+node@24.10.13_jiti@2.6.1_lightningcss@1.31_ca03ad5e9ac5ab91b513ebc15ca12665/node_modules/astro-portabletext/components/PortableText.astro", void 0);
function createEditable(collection, id, options) {
  const base = {
    collection,
    id,
    ...options?.status && { status: options.status },
    ...options?.hasDraft && { hasDraft: true }
  };
  return new Proxy({}, {
    get(_, prop) {
      if (prop === "toJSON") return () => ({ "data-emdash-ref": JSON.stringify(base) });
      if (typeof prop === "symbol") return void 0;
      if (prop === "data-emdash-ref") return JSON.stringify(base);
      return {
        "data-emdash-ref": JSON.stringify({ ...base, field: String(prop) })
      };
    },
    ownKeys() {
      return ["data-emdash-ref"];
    },
    getOwnPropertyDescriptor(_, prop) {
      if (prop === "data-emdash-ref") {
        return {
          configurable: true,
          enumerable: true,
          value: JSON.stringify(base)
        };
      }
      return void 0;
    }
  });
}
function createNoop() {
  return new Proxy({}, {
    get(_, prop) {
      if (typeof prop === "symbol") return void 0;
      return void 0;
    },
    ownKeys() {
      return [];
    },
    getOwnPropertyDescriptor() {
      return void 0;
    }
  });
}
const COLLECTION_NAME = "_emdash";
const EMDASH_EDIT = /* @__PURE__ */ Symbol.for("__emdash");
function isEditFieldMeta(value) {
  if (typeof value !== "object" || value === null) return false;
  if (!("collection" in value) || !("id" in value) || !("field" in value)) return false;
  const { collection, id, field } = value;
  return typeof collection === "string" && typeof id === "string" && typeof field === "string";
}
function getEditMeta(value) {
  if (value && typeof value === "object") {
    const desc = Object.getOwnPropertyDescriptor(value, EMDASH_EDIT);
    const meta = desc?.value;
    if (isEditFieldMeta(meta)) {
      return meta;
    }
  }
  return void 0;
}
function tagEditableFields(data, collection, id) {
  for (const [field, value] of Object.entries(data)) {
    if (Array.isArray(value) && value.length > 0 && value[0] && typeof value[0] === "object" && "_type" in value[0]) {
      Object.defineProperty(value, EMDASH_EDIT, {
        value: { collection, id, field },
        enumerable: false,
        configurable: true
      });
    }
  }
}
function dataStr(data, key2, fallback = "") {
  const val = data[key2];
  return typeof val === "string" ? val : fallback;
}
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function entryData(entry) {
  return isRecord(entry.data) ? entry.data : {};
}
function entryDatabaseId(entry) {
  const d = entryData(entry);
  return dataStr(d, "id") || entry.id;
}
function entryEditOptions(entry) {
  const data = entryData(entry);
  const status = dataStr(data, "status", "draft");
  const draftRevisionId = dataStr(data, "draftRevisionId") || void 0;
  const liveRevisionId = dataStr(data, "liveRevisionId") || void 0;
  const hasDraft = !!draftRevisionId && draftRevisionId !== liveRevisionId;
  return { status, hasDraft };
}
async function getEmDashCollection(type, filter) {
  const { getLiveCollection } = await import("./_astro_content_BwqOTjE7.mjs");
  const ctx = getRequestContext();
  const resolvedLocale = filter?.locale ?? ctx?.locale ?? void 0;
  const result2 = await getLiveCollection(COLLECTION_NAME, {
    type,
    status: filter?.status,
    limit: filter?.limit,
    cursor: filter?.cursor,
    where: filter?.where,
    orderBy: filter?.orderBy,
    locale: resolvedLocale
  });
  const { entries, error, cacheHint } = result2;
  const rawCursor = Object.getOwnPropertyDescriptor(result2, "nextCursor")?.value;
  const nextCursor = typeof rawCursor === "string" ? rawCursor : void 0;
  if (error) {
    return { entries: [], error, cacheHint: {} };
  }
  const isEditMode = ctx?.editMode ?? false;
  const entriesWithEdit = entries.map((entry) => {
    const dbId = entryDatabaseId(entry);
    if (isEditMode) {
      tagEditableFields(entryData(entry), type, dbId);
    }
    return {
      ...entry,
      edit: isEditMode ? createEditable(type, dbId, entryEditOptions(entry)) : createNoop()
    };
  });
  await hydrateEntryBylines(type, entriesWithEdit);
  return { entries: entriesWithEdit, nextCursor, cacheHint: cacheHint ?? {} };
}
async function hydrateEntryBylines(type, entries) {
  if (entries.length === 0) return;
  try {
    const { getBylinesForEntries } = await import("./index_DwJGdniL.mjs");
    const ids = entries.map((e) => dataStr(entryData(e), "id")).filter(Boolean);
    if (ids.length === 0) return;
    const bylinesMap = await getBylinesForEntries(type, ids);
    for (const entry of entries) {
      const data = entryData(entry);
      const dbId = dataStr(data, "id");
      if (!dbId) continue;
      const credits = bylinesMap.get(dbId) ?? [];
      data.bylines = credits;
      data.byline = credits[0]?.byline ?? null;
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (!msg.includes("no such table")) {
      console.warn("[emdash] Failed to hydrate bylines:", msg);
    }
  }
}
const $$FormEmbed = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$FormEmbed;
  const { node: node2 } = Astro2.props;
  const formId = node2.formId;
  const response = await fetch(
    new URL("/_emdash/api/plugins/emdash-forms/definition", Astro2.url),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: formId })
    }
  );
  if (!response.ok) return;
  const form = await response.json();
  if (!form || form.status !== "active") return;
  const submitUrl = `/_emdash/api/plugins/emdash-forms/submit`;
  const isMultiPage = form.pages.length > 1;
  const turnstileSiteKey = form._turnstileSiteKey;
  const hasFiles = form.pages.some(
    (p) => p.fields.some((f) => f.type === "file")
  );
  function fieldId(name) {
    return `${formId}-${name}`;
  }
  return renderTemplate`${maybeRenderHead()}<form class="ec-form" method="POST"${addAttribute(submitUrl, "action")}${addAttribute(hasFiles ? "multipart/form-data" : void 0, "enctype")}${addAttribute(formId, "data-form-id")} data-ec-form${addAttribute(isMultiPage ? form.pages.length : void 0, "data-pages")}> ${form.pages.map((page, pageIndex) => renderTemplate`<fieldset class="ec-form-page"${addAttribute(pageIndex, "data-page")}${addAttribute(page.title || `Page ${pageIndex + 1}`, "aria-label")}> ${isMultiPage && page.title && renderTemplate`<legend class="ec-form-page-title">${page.title}</legend>`} ${page.fields.map((field) => renderTemplate`<div${addAttribute([
    "ec-form-field",
    `ec-form-field--${field.type}`,
    field.width === "half" && "ec-form-field--half"
  ], "class:list")}${addAttribute(
    field.condition ? JSON.stringify(field.condition) : void 0,
    "data-condition"
  )}> ${field.type !== "hidden" && field.type !== "checkbox" && renderTemplate`<label class="ec-form-label"${addAttribute(fieldId(field.name), "for")}> ${field.label} ${field.required && renderTemplate`<span class="ec-form-required" aria-label="required">
*
</span>`} </label>`} ${[
    "text",
    "email",
    "tel",
    "url",
    "number",
    "date",
    "hidden"
  ].includes(field.type) && renderTemplate`<input${addAttribute(field.type, "type")}${addAttribute(field.type !== "hidden" ? "ec-form-input" : void 0, "class")}${addAttribute(fieldId(field.name), "id")}${addAttribute(field.name, "name")}${addAttribute(field.placeholder, "placeholder")}${addAttribute(field.required, "required")}${addAttribute(field.validation?.minLength, "minlength")}${addAttribute(field.validation?.maxLength, "maxlength")}${addAttribute(field.validation?.min, "min")}${addAttribute(field.validation?.max, "max")}${addAttribute(field.validation?.pattern, "pattern")}${addAttribute(field.defaultValue, "value")}>`} ${field.type === "file" && renderTemplate`<input type="file" class="ec-form-input"${addAttribute(fieldId(field.name), "id")}${addAttribute(field.name, "name")}${addAttribute(field.required, "required")}${addAttribute(field.validation?.accept, "accept")}>`} ${field.type === "textarea" && renderTemplate`<textarea class="ec-form-input"${addAttribute(fieldId(field.name), "id")}${addAttribute(field.name, "name")}${addAttribute(field.placeholder, "placeholder")}${addAttribute(field.required, "required")}${addAttribute(field.validation?.minLength, "minlength")}${addAttribute(field.validation?.maxLength, "maxlength")}>								${field.defaultValue || ""}
							</textarea>`} ${field.type === "select" && renderTemplate`<select class="ec-form-input"${addAttribute(fieldId(field.name), "id")}${addAttribute(field.name, "name")}${addAttribute(field.required, "required")}> ${(field.options || []).map((o) => renderTemplate`<option${addAttribute(o.value, "value")}${addAttribute(o.value === field.defaultValue, "selected")}> ${o.label} </option>`)} </select>`} ${field.type === "radio" && renderTemplate`<fieldset class="ec-form-radio-group" role="radiogroup"> ${(field.options || []).map((o) => renderTemplate`<label class="ec-form-radio-label"> <input type="radio"${addAttribute(field.name, "name")}${addAttribute(o.value, "value")}${addAttribute(o.value === field.defaultValue, "checked")}${addAttribute(field.required, "required")}>${" "} ${o.label} </label>`)} </fieldset>`} ${field.type === "checkbox" && renderTemplate`<label class="ec-form-checkbox-label"> <input type="checkbox" class="ec-form-input"${addAttribute(fieldId(field.name), "id")}${addAttribute(field.name, "name")}${addAttribute(field.defaultValue || "1", "value")}${addAttribute(field.required, "required")}>${" "} ${field.label} </label>`} ${field.type === "checkbox-group" && renderTemplate`<fieldset class="ec-form-checkbox-group"> ${(field.options || []).map((o) => renderTemplate`<label class="ec-form-checkbox-label"> <input type="checkbox"${addAttribute(field.name, "name")}${addAttribute(o.value, "value")}>${" "} ${o.label} </label>`)} </fieldset>`} ${field.helpText && renderTemplate`<span class="ec-form-help">${field.helpText}</span>`} <span class="ec-form-error"${addAttribute(field.name, "data-error-for")} aria-live="polite"></span> </div>`)} </fieldset>`)} ${form.settings.spamProtection === "honeypot" && renderTemplate`<div class="ec-form-field" style="position:absolute;left:-9999px;" aria-hidden="true"> <label${addAttribute(`${formId}-_hp`, "for")}>Leave blank</label> <input type="text"${addAttribute(`${formId}-_hp`, "id")} name="_hp" tabindex="-1" autocomplete="off"> </div>`} ${form.settings.spamProtection === "turnstile" && turnstileSiteKey && renderTemplate`<div class="ec-form-turnstile" data-ec-turnstile${addAttribute(turnstileSiteKey, "data-sitekey")}></div>`} <input type="hidden" name="formId"${addAttribute(formId, "value")}> <div class="ec-form-nav"> <button type="button" class="ec-form-prev" data-ec-prev hidden> ${form.settings.prevLabel || "Previous"} </button> <button type="button" class="ec-form-next" data-ec-next hidden> ${form.settings.nextLabel || "Next"} </button> <button type="submit" class="ec-form-submit"> ${form.settings.submitLabel || "Submit"} </button> </div> ${isMultiPage && renderTemplate`<div class="ec-form-progress" data-ec-progress aria-live="polite"></div>`} <div class="ec-form-status" data-form-status aria-live="polite"></div> </form> ${renderScript($$result, "/Users/niko/Documents/github/angkor-cms/packages/plugins/forms/src/astro/FormEmbed.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/niko/Documents/github/angkor-cms/packages/plugins/forms/src/astro/FormEmbed.astro", void 0);
const blockComponents = {
  "emdash-form": $$FormEmbed
};
const pluginBlockComponents = { ...blockComponents };
const $$InlineEditor = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$InlineEditor;
  const { value, collection, entryId, field } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "InlinePortableTextEditor", null, { "client:only": "react", "value": value, "collection": collection, "entryId": entryId, "field": field, "client:component-hydration": "only", "client:component-path": "/Users/niko/Documents/github/angkor-cms/packages/core/src/components/InlinePortableTextEditor", "client:component-export": "InlinePortableTextEditor" })}`;
}, "/Users/niko/Documents/github/angkor-cms/packages/core/src/components/InlineEditor.astro", void 0);
const $$PortableText = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$PortableText;
  const { value, components: userComponents, ...rest } = Astro2.props;
  const editMeta = getEditMeta(value);
  const withPlugins = mergeComponents(emdashComponents, { type: pluginBlockComponents });
  const mergedComponents = userComponents ? mergeComponents(withPlugins, userComponents) : withPlugins;
  return renderTemplate`${editMeta ? renderTemplate`${renderComponent($$result, "InlineEditor", $$InlineEditor, { "value": value, "collection": editMeta.collection, "entryId": editMeta.id, "field": editMeta.field })}` : renderTemplate`${renderComponent($$result, "BasePortableText", $$PortableText$1, { "value": value, "components": mergedComponents, ...rest })}`}`;
}, "/Users/niko/Documents/github/angkor-cms/packages/core/src/components/PortableText.astro", void 0);
async function getComments(options) {
  const db = await getDb();
  return getCommentsWithDb(db, options);
}
async function getCommentsWithDb(db, options) {
  const repo = new CommentRepository(db);
  const total = await repo.countByContent(options.collection, options.contentId, "approved");
  const MAX_COMMENTS = 500;
  const result2 = await repo.findByContent(options.collection, options.contentId, {
    status: "approved",
    limit: MAX_COMMENTS
  });
  if (options.threaded) {
    const threaded = CommentRepository.assembleThreads(result2.items);
    const items2 = threaded.map((c) => CommentRepository.toPublicComment(c));
    return { items: items2, total };
  }
  const items = result2.items.map((c) => CommentRepository.toPublicComment(c));
  return { items, total };
}
const $$Comments = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Comments;
  const {
    collection,
    contentId,
    threaded = false,
    class: className
  } = Astro2.props;
  const collectionInfo = await getCollectionInfo(collection);
  const enabled = collectionInfo?.commentsEnabled ?? false;
  const { items, total } = enabled ? await getComments({ collection, contentId, threaded }) : { items: [], total: 0 };
  const URL_RE = /https?:\/\/[^\s<>"')\]]+/g;
  const AMP_RE = /&/g;
  const LT_RE = /</g;
  const GT_RE = />/g;
  const QUOT_RE = /"/g;
  function autoLinkUrls(text) {
    return text.replace(
      URL_RE,
      (url) => `<a href="${url}" rel="nofollow ugc noopener" target="_blank">${url}</a>`
    );
  }
  function escapeHtml(text) {
    return text.replace(AMP_RE, "&amp;").replace(LT_RE, "&lt;").replace(GT_RE, "&gt;").replace(QUOT_RE, "&quot;");
  }
  function formatBody(text) {
    return autoLinkUrls(escapeHtml(text));
  }
  return renderTemplate`${enabled && renderTemplate`${maybeRenderHead()}<section${addAttribute(["ec-comments", className], "class:list")} data-ec-comments${addAttribute(collection, "data-collection")}${addAttribute(contentId, "data-content-id")} data-astro-cid-yah4eqwn><h3 class="ec-comments-heading" data-astro-cid-yah4eqwn>${total === 0 ? "No comments yet" : total === 1 ? "1 Comment" : `${total} Comments`}</h3>${items.length > 0 && renderTemplate`<ol class="ec-comments-list" data-astro-cid-yah4eqwn>${items.map((comment2) => renderTemplate`<li data-astro-cid-yah4eqwn><article class="ec-comment"${addAttribute(`comment-${comment2.id}`, "id")}${addAttribute(comment2.id, "data-comment-id")} data-astro-cid-yah4eqwn><header class="ec-comment-header" data-astro-cid-yah4eqwn><span class="ec-comment-author" data-astro-cid-yah4eqwn>${comment2.authorName}${comment2.isRegisteredUser && renderTemplate`<span class="ec-comment-badge" aria-label="Site member" data-astro-cid-yah4eqwn>
&#x2713;
</span>`}</span><time class="ec-comment-date"${addAttribute(comment2.createdAt, "datetime")} data-astro-cid-yah4eqwn>${new Date(comment2.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  })}</time></header><div class="ec-comment-body" data-astro-cid-yah4eqwn>${unescapeHTML(formatBody(comment2.body))}</div>${threaded && comment2.replies && comment2.replies.length > 0 && renderTemplate`<ol class="ec-comment-replies" data-astro-cid-yah4eqwn>${comment2.replies.map((reply) => renderTemplate`<li data-astro-cid-yah4eqwn><article class="ec-comment ec-comment-reply"${addAttribute(`comment-${reply.id}`, "id")}${addAttribute(reply.id, "data-comment-id")} data-astro-cid-yah4eqwn><header class="ec-comment-header" data-astro-cid-yah4eqwn><span class="ec-comment-author" data-astro-cid-yah4eqwn>${reply.authorName}${reply.isRegisteredUser && renderTemplate`<span class="ec-comment-badge" aria-label="Site member" data-astro-cid-yah4eqwn>
&#x2713;
</span>`}</span><time class="ec-comment-date"${addAttribute(reply.createdAt, "datetime")} data-astro-cid-yah4eqwn>${new Date(reply.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    }
  )}</time></header><div class="ec-comment-body" data-astro-cid-yah4eqwn>${unescapeHTML(formatBody(reply.body))}</div></article></li>`)}</ol>`}</article></li>`)}</ol>`}</section>`}`;
}, "/Users/niko/Documents/github/angkor-cms/packages/core/src/components/Comments.astro", void 0);
var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(cooked.slice()) }));
var _a$1;
const $$CommentForm = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$CommentForm;
  const {
    collection,
    contentId,
    parentId = null,
    class: className,
    turnstileSiteKey
  } = Astro2.props;
  const enabled = (await getCollectionInfo(collection))?.commentsEnabled ?? false;
  const { user } = Astro2.locals;
  const formId = `ec-comment-form-${parentId ?? "root"}`;
  const endpoint = `/_emdash/api/comments/${encodeURIComponent(collection)}/${encodeURIComponent(contentId)}`;
  return renderTemplate`${enabled && renderTemplate`${maybeRenderHead()}<form${addAttribute(formId, "id")}${addAttribute(["ec-comment-form", className], "class:list")} data-ec-comment-form${addAttribute(endpoint, "data-endpoint")}${addAttribute(user?.name ?? "", "data-user-name")}${addAttribute(user?.email ?? "", "data-user-email")} data-astro-cid-nqfojxoa>${user ? renderTemplate`<div class="ec-comment-user-info" data-astro-cid-nqfojxoa><span class="ec-comment-user-name" data-astro-cid-nqfojxoa>${user.name}</span><span class="ec-comment-user-email" data-astro-cid-nqfojxoa>${user.email}</span></div>` : renderTemplate`<div class="ec-comment-form-fields" data-astro-cid-nqfojxoa><label class="ec-comment-form-field" data-astro-cid-nqfojxoa><span data-astro-cid-nqfojxoa>Name</span><input type="text" name="authorName" required maxlength="100" data-astro-cid-nqfojxoa></label><label class="ec-comment-form-field" data-astro-cid-nqfojxoa><span data-astro-cid-nqfojxoa>Email</span><input type="email" name="authorEmail" required data-astro-cid-nqfojxoa></label></div>`}<div aria-hidden="true" style="position:absolute;left:-9999px;top:-9999px;" data-astro-cid-nqfojxoa><label data-astro-cid-nqfojxoa>
Don't fill this out
<input type="text" name="website_url" tabindex="-1" autocomplete="off" data-astro-cid-nqfojxoa></label></div><label class="ec-comment-form-field" data-astro-cid-nqfojxoa><span data-astro-cid-nqfojxoa>Comment</span><textarea name="body" required maxlength="5000" rows="4" data-astro-cid-nqfojxoa></textarea></label>${parentId && renderTemplate`<input type="hidden" name="parentId"${addAttribute(parentId, "value")} data-astro-cid-nqfojxoa>`}${turnstileSiteKey && renderTemplate`<div class="cf-turnstile"${addAttribute(turnstileSiteKey, "data-sitekey")} data-theme="auto" data-astro-cid-nqfojxoa></div>`}<button type="submit" class="ec-comment-form-submit" data-astro-cid-nqfojxoa>
Post Comment
</button><div class="ec-comment-form-status" role="status" aria-live="polite" data-astro-cid-nqfojxoa></div></form>`}${enabled && turnstileSiteKey && renderTemplate(_a$1 || (_a$1 = __template$1(['<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer><\/script>'])))}${renderScript($$result, "/Users/niko/Documents/github/angkor-cms/packages/core/src/components/CommentForm.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/niko/Documents/github/angkor-cms/packages/core/src/components/CommentForm.astro", void 0);
async function getWidgetArea(name) {
  const db = await getDb();
  const areaRow = await db.selectFrom("_emdash_widget_areas").selectAll().where("name", "=", name).executeTakeFirst();
  if (!areaRow) {
    return null;
  }
  const widgetRows = await db.selectFrom("_emdash_widgets").selectAll().$castTo().where("area_id", "=", areaRow.id).orderBy("sort_order", "asc").execute();
  const widgets = widgetRows.map((row) => rowToWidget(row));
  return {
    id: areaRow.id,
    name: areaRow.name,
    label: areaRow.label,
    description: areaRow.description ?? void 0,
    widgets
  };
}
function rowToWidget(row) {
  const widget = {
    id: row.id,
    type: row.type,
    title: row.title ?? void 0
  };
  if (row.type === "content" && row.content) {
    try {
      widget.content = JSON.parse(row.content);
    } catch {
    }
  }
  if (row.type === "menu" && row.menu_name) {
    widget.menuName = row.menu_name;
  }
  if (row.type === "component" && row.component_id) {
    widget.componentId = row.component_id;
    if (row.component_props) {
      try {
        widget.componentProps = JSON.parse(row.component_props);
      } catch {
      }
    }
  }
  return widget;
}
async function getMenu(name) {
  const db = await getDb();
  return getMenuWithDb(name, db);
}
async function getMenuWithDb(name, db) {
  const menuRow = await db.selectFrom("_emdash_menus").selectAll().where("name", "=", name).executeTakeFirst();
  if (!menuRow) {
    return null;
  }
  const itemRows = await db.selectFrom("_emdash_menu_items").selectAll().$castTo().where("menu_id", "=", menuRow.id).orderBy("sort_order", "asc").execute();
  const items = await buildMenuTree(itemRows, db);
  return {
    id: menuRow.id,
    name: menuRow.name,
    label: menuRow.label,
    items
  };
}
async function buildMenuTree(items, db) {
  const collectionSlugs = /* @__PURE__ */ new Set();
  for (const item of items) {
    if (item.reference_collection) {
      collectionSlugs.add(item.reference_collection);
    }
    if (item.type === "page" || item.type === "post") {
      collectionSlugs.add(item.reference_collection || `${item.type}s`);
    }
  }
  const urlPatterns = /* @__PURE__ */ new Map();
  if (collectionSlugs.size > 0) {
    const rows = await db.selectFrom("_emdash_collections").select(["slug", "url_pattern"]).where("slug", "in", [...collectionSlugs]).execute();
    for (const row of rows) {
      urlPatterns.set(row.slug, row.url_pattern);
    }
  }
  const resolvedItems = await Promise.all(
    items.map((item) => resolveMenuItem(item, db, urlPatterns))
  );
  const validItems = resolvedItems.filter((item) => item !== null);
  const itemMap = /* @__PURE__ */ new Map();
  const rootItems = [];
  for (const item of validItems) {
    itemMap.set(item.id, { ...item, children: [] });
  }
  for (const item of items) {
    const menuItem = itemMap.get(item.id);
    if (!menuItem) continue;
    if (item.parent_id) {
      const parent = itemMap.get(item.parent_id);
      if (parent) {
        parent.children.push(menuItem);
      } else {
        rootItems.push(menuItem);
      }
    } else {
      rootItems.push(menuItem);
    }
  }
  return rootItems;
}
async function resolveMenuItem(item, db, urlPatterns) {
  let url;
  try {
    switch (item.type) {
      case "custom":
        url = item.custom_url || "#";
        break;
      case "page":
      case "post":
        url = await resolveContentUrl(
          // Default to plural collection name (pages/posts) if not specified
          item.reference_collection || `${item.type}s`,
          item.reference_id,
          db,
          urlPatterns
        );
        if (url === null) {
          return null;
        }
        break;
      case "taxonomy":
        url = await resolveTaxonomyUrl(item.reference_id, db);
        if (url === null) {
          return null;
        }
        break;
      case "collection":
        url = `/${item.reference_collection}/`;
        break;
      default:
        if (item.reference_collection && item.reference_id) {
          url = await resolveContentUrl(
            item.reference_collection,
            item.reference_id,
            db,
            urlPatterns
          );
          if (url === null) {
            return null;
          }
        } else {
          url = "#";
        }
    }
  } catch (error) {
    console.error(`Failed to resolve menu item ${item.id}:`, error);
    return null;
  }
  return {
    id: item.id,
    label: item.label,
    url,
    target: item.target || void 0,
    titleAttr: item.title_attr || void 0,
    cssClasses: item.css_classes || void 0,
    children: []
    // Will be populated by buildMenuTree
  };
}
const SLUG_PLACEHOLDER = /\{slug\}/g;
const ID_PLACEHOLDER = /\{id\}/g;
function interpolateUrlPattern(pattern, slug, id) {
  return pattern.replace(SLUG_PLACEHOLDER, slug).replace(ID_PLACEHOLDER, id);
}
async function resolveContentUrl(collection, entryId, db, urlPatterns) {
  if (!entryId) {
    return null;
  }
  try {
    const result2 = await sql`
			SELECT slug FROM ${sql.ref(`ec_${collection}`)} WHERE id = ${entryId} LIMIT 1
		`.execute(db);
    const row = result2.rows[0];
    if (row) {
      const pattern = urlPatterns.get(collection);
      if (pattern) {
        return interpolateUrlPattern(pattern, row.slug, entryId);
      }
      return `/${collection}/${row.slug}`;
    }
    return null;
  } catch (error) {
    console.error(`Failed to resolve content URL for ${collection}/${entryId}:`, error);
    return null;
  }
}
async function resolveTaxonomyUrl(taxonomyId, db) {
  if (!taxonomyId) {
    return null;
  }
  const taxonomy = await db.selectFrom("taxonomies").select(["name", "slug"]).where("id", "=", taxonomyId).executeTakeFirst();
  if (!taxonomy) {
    return null;
  }
  return `/${taxonomy.name}/${taxonomy.slug}`;
}
const SAFE_URL_SCHEME_RE = /^(https?:|mailto:|tel:|\/(?!\/)|#)/i;
function sanitizeHref(url) {
  if (!url) return "#";
  return SAFE_URL_SCHEME_RE.test(url) ? url : "#";
}
const $$RecentPosts = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$RecentPosts;
  const { count = 5, showThumbnails = false, showDate = true } = Astro2.props;
  const { entries: posts } = await getEmDashCollection("posts", {
    limit: count,
    orderBy: { published_at: "desc" }
  });
  function getString(data, key2) {
    const val = data[key2];
    return typeof val === "string" ? val : void 0;
  }
  return renderTemplate`${maybeRenderHead()}<ul class="widget-recent-posts"> ${posts.map((post) => {
    const publishedAt = getString(post.data, "publishedAt");
    const featuredImage = getString(post.data, "featured_image");
    const title = getString(post.data, "title");
    return renderTemplate`<li> ${showThumbnails && featuredImage && renderTemplate`<img${addAttribute(featuredImage, "src")} alt="" class="widget-recent-posts__thumbnail">`} <a${addAttribute(`/posts/${post.id}`, "href")} class="widget-recent-posts__link"> ${title} </a> ${showDate && publishedAt && renderTemplate`<time${addAttribute(publishedAt, "datetime")} class="widget-recent-posts__date"> ${new Date(publishedAt).toLocaleDateString()} </time>`} </li>`;
  })} </ul>`;
}, "/Users/niko/Documents/github/angkor-cms/packages/core/src/components/widgets/RecentPosts.astro", void 0);
async function getTaxonomyDef(name) {
  const db = await getDb();
  const row = await db.selectFrom("_emdash_taxonomy_defs").selectAll().where("name", "=", name).executeTakeFirst();
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    label: row.label,
    labelSingular: row.label_singular ?? void 0,
    hierarchical: row.hierarchical === 1,
    collections: row.collections ? JSON.parse(row.collections) : []
  };
}
async function getTaxonomyTerms(taxonomyName) {
  const db = await getDb();
  const def = await getTaxonomyDef(taxonomyName);
  if (!def) return [];
  const rows = await db.selectFrom("taxonomies").selectAll().where("name", "=", taxonomyName).orderBy("label", "asc").execute();
  const countsResult = await db.selectFrom("content_taxonomies").select(["taxonomy_id"]).select((eb) => eb.fn.count("entry_id").as("count")).groupBy("taxonomy_id").execute();
  const counts = /* @__PURE__ */ new Map();
  for (const row of countsResult) {
    counts.set(row.taxonomy_id, row.count);
  }
  const flatTerms = rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    label: row.label,
    parent_id: row.parent_id,
    data: row.data
  }));
  if (def.hierarchical) {
    return buildTree(flatTerms, counts);
  }
  return flatTerms.map((term) => ({
    id: term.id,
    name: term.name,
    slug: term.slug,
    label: term.label,
    children: [],
    count: counts.get(term.id) ?? 0
  }));
}
function buildTree(flatTerms, counts) {
  const map = /* @__PURE__ */ new Map();
  const roots = [];
  for (const term of flatTerms) {
    map.set(term.id, {
      id: term.id,
      name: term.name,
      slug: term.slug,
      label: term.label,
      parentId: term.parent_id ?? void 0,
      description: term.data ? JSON.parse(term.data).description : void 0,
      children: [],
      count: counts.get(term.id) ?? 0
    });
  }
  for (const term of map.values()) {
    if (term.parentId && map.has(term.parentId)) {
      map.get(term.parentId).children.push(term);
    } else {
      roots.push(term);
    }
  }
  return roots;
}
const $$Categories = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Categories;
  const { showCount = true, hierarchical = true } = Astro2.props;
  const categories = await getTaxonomyTerms("category");
  return renderTemplate`${maybeRenderHead()}<ul class="widget-categories"> ${categories.length > 0 ? categories.map((category) => renderTemplate`<li> <a${addAttribute(`/category/${category.slug}`, "href")} class="widget-categories__link"> ${category.label} </a> ${showCount && category.count !== void 0 && renderTemplate`<span class="widget-categories__count">(${category.count})</span>`} </li>`) : renderTemplate`<li class="widget-categories__empty">No categories yet</li>`} </ul>`;
}, "/Users/niko/Documents/github/angkor-cms/packages/core/src/components/widgets/Categories.astro", void 0);
const $$Tags = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Tags;
  const { showCount = false, limit = 20 } = Astro2.props;
  const allTags = await getTaxonomyTerms("tag");
  const tags = allTags.slice(0, limit);
  return renderTemplate`${maybeRenderHead()}<div class="widget-tags"> ${tags.length > 0 ? renderTemplate`<ul class="widget-tags__cloud"> ${tags.map((tag) => renderTemplate`<li> <a${addAttribute(`/tag/${tag.slug}`, "href")} class="widget-tags__link"> ${tag.label} </a> ${showCount && tag.count !== void 0 && renderTemplate`<span class="widget-tags__count">(${tag.count})</span>`} </li>`)} </ul>` : renderTemplate`<p class="widget-tags__empty">No tags yet</p>`} </div>`;
}, "/Users/niko/Documents/github/angkor-cms/packages/core/src/components/widgets/Tags.astro", void 0);
const $$Search = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Search;
  const { placeholder = "Search..." } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<form method="get" action="/search" class="widget-search"> <input type="search" name="q"${addAttribute(placeholder, "placeholder")} aria-label="Search" class="widget-search__input"> <button type="submit" class="widget-search__button">Search</button> </form>`;
}, "/Users/niko/Documents/github/angkor-cms/packages/core/src/components/widgets/Search.astro", void 0);
const $$Archives = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Archives;
  const { type = "monthly", limit = 12 } = Astro2.props;
  const { entries: posts } = await getEmDashCollection("posts", {
    orderBy: { published_at: "desc" }
  });
  const archives = /* @__PURE__ */ new Map();
  for (const post of posts) {
    const publishedAt = post.data.publishedAt;
    if (typeof publishedAt !== "string") continue;
    const date = new Date(publishedAt);
    let key2;
    let label;
    let url;
    if (type === "yearly") {
      const year = date.getFullYear();
      key2 = `${year}`;
      label = `${year}`;
      url = `/archives/${year}`;
    } else {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      key2 = `${year}-${month.toString().padStart(2, "0")}`;
      label = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long"
      });
      url = `/archives/${year}/${month.toString().padStart(2, "0")}`;
    }
    if (!archives.has(key2)) {
      archives.set(key2, { label, count: 0, url });
    }
    archives.get(key2).count++;
  }
  const archiveList = [...archives.values()].slice(0, limit);
  return renderTemplate`${maybeRenderHead()}<ul class="widget-archives"> ${archiveList.map((archive) => renderTemplate`<li> <a${addAttribute(archive.url, "href")} class="widget-archives__link"> ${archive.label} </a> <span class="widget-archives__count">(${archive.count})</span> </li>`)} </ul>`;
}, "/Users/niko/Documents/github/angkor-cms/packages/core/src/components/widgets/Archives.astro", void 0);
const $$WidgetRenderer = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$WidgetRenderer;
  const { widget } = Astro2.props;
  const componentMap = {
    "core:recent-posts": $$RecentPosts,
    "core:categories": $$Categories,
    "core:tags": $$Tags,
    "core:search": $$Search,
    "core:archives": $$Archives
  };
  let menuData = null;
  if (widget.type === "menu" && widget.menuName) {
    menuData = await getMenu(widget.menuName);
  }
  let WidgetComponent = null;
  if (widget.type === "component" && widget.componentId) {
    WidgetComponent = componentMap[widget.componentId];
  }
  return renderTemplate`${maybeRenderHead()}<div class="widget"${addAttribute(widget.id, "data-widget-id")}${addAttribute(widget.type, "data-widget-type")}> ${widget.title && renderTemplate`<h3 class="widget__title">${widget.title}</h3>`} <div class="widget__content"> ${widget.type === "content" && widget.content && renderTemplate`${renderComponent($$result, "PortableText", $$PortableText, { "value": widget.content })}`} ${widget.type === "menu" && menuData && renderTemplate`<nav class="widget__menu"> <ul> ${menuData.items.map((item) => renderTemplate`<li> <a${addAttribute(sanitizeHref(item.url), "href")}${addAttribute(item.titleAttr || void 0, "title")}> ${item.label} </a> </li>`)} </ul> </nav>`} ${widget.type === "component" && WidgetComponent && renderTemplate`${renderComponent($$result, "WidgetComponent", WidgetComponent, { ...widget.componentProps || {} })}`} </div> </div>`;
}, "/Users/niko/Documents/github/angkor-cms/packages/core/src/components/WidgetRenderer.astro", void 0);
const $$WidgetArea = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$WidgetArea;
  const { name, class: className } = Astro2.props;
  const area = await getWidgetArea(name);
  return renderTemplate`${area && area.widgets.length > 0 && renderTemplate`${maybeRenderHead()}<div${addAttribute(["widget-area", className], "class:list")}${addAttribute(name, "data-widget-area")}>${area.widgets.map((widget) => renderTemplate`${renderComponent($$result, "WidgetRenderer", $$WidgetRenderer, { "widget": widget })}`)}</div>`}`;
}, "/Users/niko/Documents/github/angkor-cms/packages/core/src/components/WidgetArea.astro", void 0);
let virtualMediaProviders;
const mediaProviderInstances = /* @__PURE__ */ new Map();
async function loadMediaProviders() {
  if (virtualMediaProviders === void 0) {
    const providersModule = await import("./media-providers_CElbx6_p.mjs");
    virtualMediaProviders = providersModule.mediaProviders || [];
  }
}
async function getMediaProvider(providerId) {
  const cached = mediaProviderInstances.get(providerId);
  if (cached) {
    return cached;
  }
  await loadMediaProviders();
  const entry = virtualMediaProviders?.find((p) => p.id === providerId);
  if (!entry) {
    return void 0;
  }
  const provider = entry.createProvider({});
  mediaProviderInstances.set(providerId, provider);
  return provider;
}
const $$EmDashImage = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$EmDashImage;
  const BREAKPOINTS = [640, 750, 828, 960, 1080, 1280, 1600, 1920];
  const { image, alt, width, height, priority, ...attrs } = Astro2.props;
  function normalizeImage(img2) {
    if (!img2) return null;
    if (typeof img2 === "string") {
      return { id: "", src: img2 };
    }
    return img2;
  }
  function buildLocalImageUrl(img2) {
    const storageKey = img2.meta?.storageKey || img2.id;
    if (storageKey) {
      return `/_emdash/api/media/file/${storageKey}`;
    }
    return "";
  }
  function generateSrcset(getSrc, maxWidth, aspectRatio2) {
    return BREAKPOINTS.filter((w) => w <= maxWidth * 2).map((w) => {
      const h = aspectRatio2 ? Math.round(w / aspectRatio2) : void 0;
      return `${getSrc({ width: w, height: h })} ${w}w`;
    }).join(", ");
  }
  const img = normalizeImage(image);
  const finalWidth = width ?? img?.width;
  const finalHeight = height ?? img?.height;
  const finalAlt = alt ?? img?.alt ?? "";
  const aspectRatio = finalWidth && finalHeight ? finalWidth / finalHeight : void 0;
  let src = "";
  let srcset;
  let sizes;
  if (img) {
    const providerId = img.provider ?? "local";
    if (providerId === "local" || img.src) {
      src = img.src || buildLocalImageUrl(img);
    } else {
      try {
        const provider = await getMediaProvider(providerId);
        if (provider) {
          const result2 = provider.getEmbed(img, {
            width: finalWidth,
            height: finalHeight
          });
          const embed = result2 instanceof Promise ? await result2 : result2;
          if (embed.type === "image") {
            src = embed.src;
            if (embed.getSrc) {
              const maxWidth = finalWidth || 1200;
              srcset = generateSrcset(embed.getSrc, maxWidth, aspectRatio);
              sizes = finalWidth ? `(min-width: ${finalWidth}px) ${finalWidth}px, 100vw` : "100vw";
            }
          }
        } else {
          console.warn(`[EmDashImage] Provider not found: ${providerId}`);
        }
      } catch (error) {
        console.error(
          `[EmDashImage] Failed to get embed for image ${img.id}:`,
          error
        );
      }
      if (!src) {
        src = buildLocalImageUrl(img);
      }
    }
  }
  const blurhash = typeof image === "object" ? image?.meta?.blurhash : void 0;
  const dominantColor = typeof image === "object" ? image?.meta?.dominantColor : void 0;
  let placeholderStyle = "";
  if (blurhash) {
    const { blurhashToImageCssString } = await import("./index_v1Gvxs-Y.mjs");
    placeholderStyle = blurhashToImageCssString(blurhash);
  } else if (dominantColor) {
    placeholderStyle = `background-color: ${dominantColor};`;
  }
  const baseStyle = aspectRatio ? `aspect-ratio: ${aspectRatio}; max-width: 100%; height: auto;` : "max-width: 100%; height: auto;";
  const imgProps = {
    src,
    srcset,
    sizes,
    width: finalWidth,
    height: finalHeight,
    alt: finalAlt,
    loading: priority ? "eager" : "lazy",
    decoding: "async",
    style: placeholderStyle ? `${baseStyle} ${placeholderStyle}` : baseStyle,
    ...attrs
  };
  return renderTemplate`${img && src ? renderTemplate`${maybeRenderHead()}<img${spreadAttributes(imgProps)}>` : null}`;
}, "/Users/niko/Documents/github/angkor-cms/packages/core/src/components/EmDashImage.astro", void 0);
const $$EmDashMedia = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$EmDashMedia;
  const { value, alt, width, height, format, ...attrs } = Astro2.props;
  function normalizeValue(val) {
    if (!val) return null;
    if (typeof val === "string") {
      return { id: "", src: val, provider: "local" };
    }
    return val;
  }
  const media = normalizeValue(value);
  let embed = null;
  if (media) {
    const providerId = media.provider ?? "local";
    const provider = await getMediaProvider(providerId);
    if (provider) {
      const embedOptions = { width, height, format };
      try {
        const result2 = provider.getEmbed(media, embedOptions);
        embed = result2 instanceof Promise ? await result2 : result2;
      } catch (error) {
        console.warn(`Failed to get embed for media ${media.id}:`, error);
      }
    } else if (media.src) {
      embed = {
        type: "image",
        src: media.src,
        width: media.width,
        height: media.height,
        alt: media.alt
      };
    } else if (providerId === "local") {
      const storageKey = media.meta?.storageKey || media.id;
      if (storageKey) {
        const mimeType = media.mimeType || "";
        if (mimeType.startsWith("video/")) {
          embed = {
            type: "video",
            src: `/_emdash/api/media/file/${storageKey}`,
            width: media.width,
            height: media.height,
            controls: true,
            preload: "metadata"
          };
        } else if (mimeType.startsWith("audio/")) {
          embed = {
            type: "audio",
            src: `/_emdash/api/media/file/${storageKey}`,
            controls: true,
            preload: "metadata"
          };
        } else {
          embed = {
            type: "image",
            src: `/_emdash/api/media/file/${storageKey}`,
            width: media.width,
            height: media.height,
            alt: media.alt
          };
        }
      }
    }
  }
  const finalAlt = alt ?? (embed?.type === "image" ? embed.alt : void 0) ?? media?.alt ?? "";
  return renderTemplate`${embed?.type === "image" && renderTemplate`${maybeRenderHead()}<img${addAttribute(embed.src, "src")}${addAttribute(embed.srcset, "srcset")}${addAttribute(embed.sizes, "sizes")}${addAttribute(embed.width, "width")}${addAttribute(embed.height, "height")}${addAttribute(finalAlt, "alt")} loading="lazy" decoding="async"${spreadAttributes(attrs)}>`}${embed?.type === "video" && renderTemplate`<video${addAttribute(embed.width, "width")}${addAttribute(embed.height, "height")}${addAttribute(embed.controls ?? true, "controls")}${addAttribute(embed.autoplay, "autoplay")}${addAttribute(embed.muted, "muted")}${addAttribute(embed.loop, "loop")}${addAttribute(embed.playsinline, "playsinline")}${addAttribute(embed.preload ?? "metadata", "preload")}${addAttribute(embed.crossorigin, "crossorigin")}${addAttribute(embed.poster, "poster")}${spreadAttributes(attrs)}>${embed.src && renderTemplate`<source${addAttribute(embed.src, "src")}>`}${embed.sources?.map((s) => renderTemplate`<source${addAttribute(s.src, "src")}${addAttribute(s.type, "type")}>`)}</video>`}${embed?.type === "audio" && renderTemplate`<audio${addAttribute(embed.controls ?? true, "controls")}${addAttribute(embed.autoplay, "autoplay")}${addAttribute(embed.muted, "muted")}${addAttribute(embed.loop, "loop")}${addAttribute(embed.preload ?? "metadata", "preload")}${spreadAttributes(attrs)}>${embed.src && renderTemplate`<source${addAttribute(embed.src, "src")}>`}${embed.sources?.map((s) => renderTemplate`<source${addAttribute(s.src, "src")}${addAttribute(s.type, "type")}>`)}</audio>`}${embed?.type === "component" && renderTemplate`<!-- Custom component embeds (Mux player, etc.) require dynamic import -->
	<!-- For now, show a placeholder - full implementation TBD -->
	<div class="emdash-media-component"${addAttribute(embed.package, "data-package")}${addAttribute(embed.export, "data-export")}><p>Custom media component: ${embed.package}</p></div>`}`;
}, "/Users/niko/Documents/github/angkor-cms/packages/core/src/components/EmDashMedia.astro", void 0);
const $$Image = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Image;
  const BREAKPOINTS = [640, 750, 828, 960, 1080, 1280, 1600, 1920];
  function generateSrcset(getSrc, maxWidth, aspectRatio2) {
    return BREAKPOINTS.filter((w) => w <= maxWidth * 2).map((w) => {
      const h = aspectRatio2 ? Math.round(w / aspectRatio2) : void 0;
      return `${getSrc({ width: w, height: h })} ${w}w`;
    }).join(", ");
  }
  const { node: node2 } = Astro2.props;
  if (!node2?.asset) {
    return null;
  }
  const { asset, alt = "", caption, width, height, displayWidth, displayHeight } = node2;
  const aspectRatio = width && height ? width / height : void 0;
  let renderWidth;
  let renderHeight;
  if (displayWidth && displayHeight) {
    renderWidth = displayWidth;
    renderHeight = displayHeight;
  } else if (displayWidth && aspectRatio) {
    renderWidth = displayWidth;
    renderHeight = Math.round(displayWidth / aspectRatio);
  } else if (displayHeight && aspectRatio) {
    renderWidth = Math.round(displayHeight * aspectRatio);
    renderHeight = displayHeight;
  } else {
    renderWidth = width;
    renderHeight = height;
  }
  let src = "";
  let srcset;
  let sizes;
  const providerId = asset.provider;
  if (providerId && providerId !== "local") {
    const provider = await getMediaProvider(providerId);
    if (provider) {
      try {
        const mediaValue = {
          provider: providerId,
          id: asset._ref,
          width: renderWidth,
          height: renderHeight,
          alt
        };
        const result2 = provider.getEmbed(mediaValue, {
          width: renderWidth,
          height: renderHeight
        });
        const embed = result2 instanceof Promise ? await result2 : result2;
        if (embed.type === "image") {
          src = embed.src;
          if (embed.getSrc) {
            const maxWidth = renderWidth || 1200;
            const ar = renderWidth && renderHeight ? renderWidth / renderHeight : aspectRatio;
            srcset = generateSrcset(embed.getSrc, maxWidth, ar);
            sizes = renderWidth ? `(min-width: ${renderWidth}px) ${renderWidth}px, 100vw` : "100vw";
          }
        }
      } catch (error) {
        console.warn(`Failed to get embed for image ${asset._ref}:`, error);
      }
    }
  }
  if (!src) {
    src = asset.url || `/_emdash/api/media/file/${asset._ref}`;
  }
  const blurhash = asset.meta?.blurhash;
  const dominantColor = asset.meta?.dominantColor;
  let placeholderStyle = "";
  if (blurhash) {
    const { blurhashToImageCssString } = await import("./index_v1Gvxs-Y.mjs");
    placeholderStyle = blurhashToImageCssString(blurhash);
  } else if (dominantColor) {
    placeholderStyle = `background-color: ${dominantColor};`;
  }
  const baseStyle = aspectRatio ? `aspect-ratio: ${aspectRatio}; max-width: 100%; height: auto;` : "max-width: 100%; height: auto;";
  const imgStyle = placeholderStyle ? `${baseStyle} ${placeholderStyle}` : baseStyle;
  return renderTemplate`${maybeRenderHead()}<figure class="emdash-image" data-astro-cid-tqfuqesd> <img${addAttribute(src, "src")}${addAttribute(srcset, "srcset")}${addAttribute(sizes, "sizes")}${addAttribute(alt, "alt")}${addAttribute(renderWidth, "width")}${addAttribute(renderHeight, "height")} loading="lazy" decoding="async"${addAttribute(imgStyle, "style")} data-astro-cid-tqfuqesd> ${caption && renderTemplate`<figcaption data-astro-cid-tqfuqesd>${caption}</figcaption>`} </figure>`;
}, "/Users/niko/Documents/github/angkor-cms/packages/core/src/components/Image.astro", void 0);
const $$Code = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Code;
  const { node: node2 } = Astro2.props;
  if (!node2?.code) {
    return null;
  }
  const { code, language, filename } = node2;
  const languageClass = language ? `language-${language}` : "";
  return renderTemplate`${maybeRenderHead()}<div class="emdash-code" data-astro-cid-hgcniaay> ${filename && renderTemplate`<div class="emdash-code-filename" data-astro-cid-hgcniaay>${filename}</div>`} <pre${addAttribute(languageClass, "class")} data-astro-cid-hgcniaay><code${addAttribute(languageClass, "class")} data-astro-cid-hgcniaay>${code}</code></pre> </div>`;
}, "/Users/niko/Documents/github/angkor-cms/packages/core/src/components/Code.astro", void 0);
var lib$5 = {};
var Parser = {};
var Tokenizer = {};
var decode = {};
var decodeDataHtml = {};
var hasRequiredDecodeDataHtml;
function requireDecodeDataHtml() {
  if (hasRequiredDecodeDataHtml) return decodeDataHtml;
  hasRequiredDecodeDataHtml = 1;
  Object.defineProperty(decodeDataHtml, "__esModule", { value: true });
  decodeDataHtml.default = new Uint16Array(
    // prettier-ignore
    'ᵁ<Õıʊҝջאٵ۞ޢߖࠏ੊ઑඡ๭༉༦჊ረዡᐕᒝᓃᓟᔥ\0\0\0\0\0\0ᕫᛍᦍᰒᷝ὾⁠↰⊍⏀⏻⑂⠤⤒ⴈ⹈⿎〖㊺㘹㞬㣾㨨㩱㫠㬮ࠀEMabcfglmnoprstu\\bfms¦³¹ÈÏlig耻Æ䃆P耻&䀦cute耻Á䃁reve;䄂Āiyx}rc耻Â䃂;䐐r;쀀𝔄rave耻À䃀pha;䎑acr;䄀d;橓Āgp¡on;䄄f;쀀𝔸plyFunction;恡ing耻Å䃅Ācs¾Ãr;쀀𝒜ign;扔ilde耻Ã䃃ml耻Ä䃄ЀaceforsuåûþėĜĢħĪĀcrêòkslash;或Ŷöø;櫧ed;挆y;䐑ƀcrtąċĔause;戵noullis;愬a;䎒r;쀀𝔅pf;쀀𝔹eve;䋘còēmpeq;扎܀HOacdefhilorsuōőŖƀƞƢƵƷƺǜȕɳɸɾcy;䐧PY耻©䂩ƀcpyŝŢźute;䄆Ā;iŧŨ拒talDifferentialD;慅leys;愭ȀaeioƉƎƔƘron;䄌dil耻Ç䃇rc;䄈nint;戰ot;䄊ĀdnƧƭilla;䂸terDot;䂷òſi;䎧rcleȀDMPTǇǋǑǖot;抙inus;抖lus;投imes;抗oĀcsǢǸkwiseContourIntegral;戲eCurlyĀDQȃȏoubleQuote;思uote;怙ȀlnpuȞȨɇɕonĀ;eȥȦ户;橴ƀgitȯȶȺruent;扡nt;戯ourIntegral;戮ĀfrɌɎ;愂oduct;成nterClockwiseContourIntegral;戳oss;樯cr;쀀𝒞pĀ;Cʄʅ拓ap;才րDJSZacefiosʠʬʰʴʸˋ˗ˡ˦̳ҍĀ;oŹʥtrahd;椑cy;䐂cy;䐅cy;䐏ƀgrsʿ˄ˇger;怡r;憡hv;櫤Āayː˕ron;䄎;䐔lĀ;t˝˞戇a;䎔r;쀀𝔇Āaf˫̧Ācm˰̢riticalȀADGT̖̜̀̆cute;䂴oŴ̋̍;䋙bleAcute;䋝rave;䁠ilde;䋜ond;拄ferentialD;慆Ѱ̽\0\0\0͔͂\0Ѕf;쀀𝔻ƀ;DE͈͉͍䂨ot;惜qual;扐blèCDLRUVͣͲ΂ϏϢϸontourIntegraìȹoɴ͹\0\0ͻ»͉nArrow;懓Āeo·ΤftƀARTΐΖΡrrow;懐ightArrow;懔eåˊngĀLRΫτeftĀARγιrrow;柸ightArrow;柺ightArrow;柹ightĀATϘϞrrow;懒ee;抨pɁϩ\0\0ϯrrow;懑ownArrow;懕erticalBar;戥ǹABLRTaВЪаўѿͼrrowƀ;BUНОТ憓ar;椓pArrow;懵reve;䌑eft˒к\0ц\0ѐightVector;楐eeVector;楞ectorĀ;Bљњ憽ar;楖ightǔѧ\0ѱeeVector;楟ectorĀ;BѺѻ懁ar;楗eeĀ;A҆҇护rrow;憧ĀctҒҗr;쀀𝒟rok;䄐ࠀNTacdfglmopqstuxҽӀӄӋӞӢӧӮӵԡԯԶՒ՝ՠեG;䅊H耻Ð䃐cute耻É䃉ƀaiyӒӗӜron;䄚rc耻Ê䃊;䐭ot;䄖r;쀀𝔈rave耻È䃈ement;戈ĀapӺӾcr;䄒tyɓԆ\0\0ԒmallSquare;旻erySmallSquare;斫ĀgpԦԪon;䄘f;쀀𝔼silon;䎕uĀaiԼՉlĀ;TՂՃ橵ilde;扂librium;懌Āci՗՚r;愰m;橳a;䎗ml耻Ë䃋Āipժկsts;戃onentialE;慇ʀcfiosօֈ֍ֲ׌y;䐤r;쀀𝔉lledɓ֗\0\0֣mallSquare;旼erySmallSquare;斪Ͱֺ\0ֿ\0\0ׄf;쀀𝔽All;戀riertrf;愱cò׋؀JTabcdfgorstר׬ׯ׺؀ؒؖ؛؝أ٬ٲcy;䐃耻>䀾mmaĀ;d׷׸䎓;䏜reve;䄞ƀeiy؇،ؐdil;䄢rc;䄜;䐓ot;䄠r;쀀𝔊;拙pf;쀀𝔾eater̀EFGLSTصلَٖٛ٦qualĀ;Lؾؿ扥ess;招ullEqual;执reater;檢ess;扷lantEqual;橾ilde;扳cr;쀀𝒢;扫ЀAacfiosuڅڋږڛڞڪھۊRDcy;䐪Āctڐڔek;䋇;䁞irc;䄤r;愌lbertSpace;愋ǰگ\0ڲf;愍izontalLine;攀Āctۃۅòکrok;䄦mpńېۘownHumðįqual;扏܀EJOacdfgmnostuۺ۾܃܇܎ܚܞܡܨ݄ݸދޏޕcy;䐕lig;䄲cy;䐁cute耻Í䃍Āiyܓܘrc耻Î䃎;䐘ot;䄰r;愑rave耻Ì䃌ƀ;apܠܯܿĀcgܴܷr;䄪inaryI;慈lieóϝǴ݉\0ݢĀ;eݍݎ戬Āgrݓݘral;戫section;拂isibleĀCTݬݲomma;恣imes;恢ƀgptݿރވon;䄮f;쀀𝕀a;䎙cr;愐ilde;䄨ǫޚ\0ޞcy;䐆l耻Ï䃏ʀcfosuެ޷޼߂ߐĀiyޱ޵rc;䄴;䐙r;쀀𝔍pf;쀀𝕁ǣ߇\0ߌr;쀀𝒥rcy;䐈kcy;䐄΀HJacfosߤߨ߽߬߱ࠂࠈcy;䐥cy;䐌ppa;䎚Āey߶߻dil;䄶;䐚r;쀀𝔎pf;쀀𝕂cr;쀀𝒦րJTaceflmostࠥࠩࠬࡐࡣ঳সে্਷ੇcy;䐉耻<䀼ʀcmnpr࠷࠼ࡁࡄࡍute;䄹bda;䎛g;柪lacetrf;愒r;憞ƀaeyࡗ࡜ࡡron;䄽dil;䄻;䐛Āfsࡨ॰tԀACDFRTUVarࡾࢩࢱࣦ࣠ࣼयज़ΐ४Ānrࢃ࢏gleBracket;柨rowƀ;BR࢙࢚࢞憐ar;懤ightArrow;懆eiling;挈oǵࢷ\0ࣃbleBracket;柦nǔࣈ\0࣒eeVector;楡ectorĀ;Bࣛࣜ懃ar;楙loor;挊ightĀAV࣯ࣵrrow;憔ector;楎Āerँगeƀ;AVउऊऐ抣rrow;憤ector;楚iangleƀ;BEतथऩ抲ar;槏qual;抴pƀDTVषूौownVector;楑eeVector;楠ectorĀ;Bॖॗ憿ar;楘ectorĀ;B॥०憼ar;楒ightáΜs̀EFGLSTॾঋকঝঢভqualGreater;拚ullEqual;扦reater;扶ess;檡lantEqual;橽ilde;扲r;쀀𝔏Ā;eঽা拘ftarrow;懚idot;䄿ƀnpw৔ਖਛgȀLRlr৞৷ਂਐeftĀAR০৬rrow;柵ightArrow;柷ightArrow;柶eftĀarγਊightáοightáϊf;쀀𝕃erĀLRਢਬeftArrow;憙ightArrow;憘ƀchtਾੀੂòࡌ;憰rok;䅁;扪Ѐacefiosuਗ਼੝੠੷੼અઋ઎p;椅y;䐜Ādl੥੯iumSpace;恟lintrf;愳r;쀀𝔐nusPlus;戓pf;쀀𝕄cò੶;䎜ҀJacefostuણધભીଔଙඑ඗ඞcy;䐊cute;䅃ƀaey઴હાron;䅇dil;䅅;䐝ƀgswે૰଎ativeƀMTV૓૟૨ediumSpace;怋hiĀcn૦૘ë૙eryThiî૙tedĀGL૸ଆreaterGreateòٳessLesóੈLine;䀊r;쀀𝔑ȀBnptଢନଷ଺reak;恠BreakingSpace;䂠f;愕ڀ;CDEGHLNPRSTV୕ୖ୪୼஡௫ఄ౞಄ದ೘ൡඅ櫬Āou୛୤ngruent;扢pCap;扭oubleVerticalBar;戦ƀlqxஃஊ஛ement;戉ualĀ;Tஒஓ扠ilde;쀀≂̸ists;戄reater΀;EFGLSTஶஷ஽௉௓௘௥扯qual;扱ullEqual;쀀≧̸reater;쀀≫̸ess;批lantEqual;쀀⩾̸ilde;扵umpń௲௽ownHump;쀀≎̸qual;쀀≏̸eĀfsఊధtTriangleƀ;BEచఛడ拪ar;쀀⧏̸qual;括s̀;EGLSTవశ఼ౄోౘ扮qual;扰reater;扸ess;쀀≪̸lantEqual;쀀⩽̸ilde;扴estedĀGL౨౹reaterGreater;쀀⪢̸essLess;쀀⪡̸recedesƀ;ESಒಓಛ技qual;쀀⪯̸lantEqual;拠ĀeiಫಹverseElement;戌ghtTriangleƀ;BEೋೌ೒拫ar;쀀⧐̸qual;拭ĀquೝഌuareSuĀbp೨೹setĀ;E೰ೳ쀀⊏̸qual;拢ersetĀ;Eഃആ쀀⊐̸qual;拣ƀbcpഓതൎsetĀ;Eഛഞ쀀⊂⃒qual;抈ceedsȀ;ESTലള഻െ抁qual;쀀⪰̸lantEqual;拡ilde;쀀≿̸ersetĀ;E൘൛쀀⊃⃒qual;抉ildeȀ;EFT൮൯൵ൿ扁qual;扄ullEqual;扇ilde;扉erticalBar;戤cr;쀀𝒩ilde耻Ñ䃑;䎝܀Eacdfgmoprstuvලෂ෉෕ෛ෠෧෼ขภยา฿ไlig;䅒cute耻Ó䃓Āiy෎ීrc耻Ô䃔;䐞blac;䅐r;쀀𝔒rave耻Ò䃒ƀaei෮ෲ෶cr;䅌ga;䎩cron;䎟pf;쀀𝕆enCurlyĀDQฎบoubleQuote;怜uote;怘;橔Āclวฬr;쀀𝒪ash耻Ø䃘iŬื฼de耻Õ䃕es;樷ml耻Ö䃖erĀBP๋๠Āar๐๓r;怾acĀek๚๜;揞et;掴arenthesis;揜Ҁacfhilors๿ງຊຏຒດຝະ໼rtialD;戂y;䐟r;쀀𝔓i;䎦;䎠usMinus;䂱Āipຢອncareplanåڝf;愙Ȁ;eio຺ູ໠໤檻cedesȀ;EST່້໏໚扺qual;檯lantEqual;扼ilde;找me;怳Ādp໩໮uct;戏ortionĀ;aȥ໹l;戝Āci༁༆r;쀀𝒫;䎨ȀUfos༑༖༛༟OT耻"䀢r;쀀𝔔pf;愚cr;쀀𝒬؀BEacefhiorsu༾གྷཇའཱིྦྷྪྭ႖ႩႴႾarr;椐G耻®䂮ƀcnrཎནབute;䅔g;柫rĀ;tཛྷཝ憠l;椖ƀaeyཧཬཱron;䅘dil;䅖;䐠Ā;vླྀཹ愜erseĀEUྂྙĀlq྇ྎement;戋uilibrium;懋pEquilibrium;楯r»ཹo;䎡ghtЀACDFTUVa࿁࿫࿳ဢဨၛႇϘĀnr࿆࿒gleBracket;柩rowƀ;BL࿜࿝࿡憒ar;懥eftArrow;懄eiling;按oǵ࿹\0စbleBracket;柧nǔည\0နeeVector;楝ectorĀ;Bဝသ懂ar;楕loor;挋Āerိ၃eƀ;AVဵံြ抢rrow;憦ector;楛iangleƀ;BEၐၑၕ抳ar;槐qual;抵pƀDTVၣၮၸownVector;楏eeVector;楜ectorĀ;Bႂႃ憾ar;楔ectorĀ;B႑႒懀ar;楓Āpuႛ႞f;愝ndImplies;楰ightarrow;懛ĀchႹႼr;愛;憱leDelayed;槴ڀHOacfhimoqstuფჱჷჽᄙᄞᅑᅖᅡᅧᆵᆻᆿĀCcჩხHcy;䐩y;䐨FTcy;䐬cute;䅚ʀ;aeiyᄈᄉᄎᄓᄗ檼ron;䅠dil;䅞rc;䅜;䐡r;쀀𝔖ortȀDLRUᄪᄴᄾᅉownArrow»ОeftArrow»࢚ightArrow»࿝pArrow;憑gma;䎣allCircle;战pf;쀀𝕊ɲᅭ\0\0ᅰt;戚areȀ;ISUᅻᅼᆉᆯ斡ntersection;抓uĀbpᆏᆞsetĀ;Eᆗᆘ抏qual;抑ersetĀ;Eᆨᆩ抐qual;抒nion;抔cr;쀀𝒮ar;拆ȀbcmpᇈᇛሉላĀ;sᇍᇎ拐etĀ;Eᇍᇕqual;抆ĀchᇠህeedsȀ;ESTᇭᇮᇴᇿ扻qual;檰lantEqual;扽ilde;承Tháྌ;我ƀ;esሒሓሣ拑rsetĀ;Eሜም抃qual;抇et»ሓրHRSacfhiorsሾቄ቉ቕ቞ቱቶኟዂወዑORN耻Þ䃞ADE;愢ĀHc቎ቒcy;䐋y;䐦Ābuቚቜ;䀉;䎤ƀaeyብቪቯron;䅤dil;䅢;䐢r;쀀𝔗Āeiቻ኉ǲኀ\0ኇefore;戴a;䎘Ācn኎ኘkSpace;쀀  Space;怉ldeȀ;EFTካኬኲኼ戼qual;扃ullEqual;扅ilde;扈pf;쀀𝕋ipleDot;惛Āctዖዛr;쀀𝒯rok;䅦ૡዷጎጚጦ\0ጬጱ\0\0\0\0\0ጸጽ፷ᎅ\0᏿ᐄᐊᐐĀcrዻጁute耻Ú䃚rĀ;oጇገ憟cir;楉rǣጓ\0጖y;䐎ve;䅬Āiyጞጣrc耻Û䃛;䐣blac;䅰r;쀀𝔘rave耻Ù䃙acr;䅪Ādiፁ፩erĀBPፈ፝Āarፍፐr;䁟acĀekፗፙ;揟et;掵arenthesis;揝onĀ;P፰፱拃lus;抎Āgp፻፿on;䅲f;쀀𝕌ЀADETadps᎕ᎮᎸᏄϨᏒᏗᏳrrowƀ;BDᅐᎠᎤar;椒ownArrow;懅ownArrow;憕quilibrium;楮eeĀ;AᏋᏌ报rrow;憥ownáϳerĀLRᏞᏨeftArrow;憖ightArrow;憗iĀ;lᏹᏺ䏒on;䎥ing;䅮cr;쀀𝒰ilde;䅨ml耻Ü䃜ҀDbcdefosvᐧᐬᐰᐳᐾᒅᒊᒐᒖash;披ar;櫫y;䐒ashĀ;lᐻᐼ抩;櫦Āerᑃᑅ;拁ƀbtyᑌᑐᑺar;怖Ā;iᑏᑕcalȀBLSTᑡᑥᑪᑴar;戣ine;䁼eparator;杘ilde;所ThinSpace;怊r;쀀𝔙pf;쀀𝕍cr;쀀𝒱dash;抪ʀcefosᒧᒬᒱᒶᒼirc;䅴dge;拀r;쀀𝔚pf;쀀𝕎cr;쀀𝒲Ȁfiosᓋᓐᓒᓘr;쀀𝔛;䎞pf;쀀𝕏cr;쀀𝒳ҀAIUacfosuᓱᓵᓹᓽᔄᔏᔔᔚᔠcy;䐯cy;䐇cy;䐮cute耻Ý䃝Āiyᔉᔍrc;䅶;䐫r;쀀𝔜pf;쀀𝕐cr;쀀𝒴ml;䅸ЀHacdefosᔵᔹᔿᕋᕏᕝᕠᕤcy;䐖cute;䅹Āayᕄᕉron;䅽;䐗ot;䅻ǲᕔ\0ᕛoWidtè૙a;䎖r;愨pf;愤cr;쀀𝒵௡ᖃᖊᖐ\0ᖰᖶᖿ\0\0\0\0ᗆᗛᗫᙟ᙭\0ᚕ᚛ᚲᚹ\0ᚾcute耻á䃡reve;䄃̀;Ediuyᖜᖝᖡᖣᖨᖭ戾;쀀∾̳;房rc耻â䃢te肻´̆;䐰lig耻æ䃦Ā;r²ᖺ;쀀𝔞rave耻à䃠ĀepᗊᗖĀfpᗏᗔsym;愵èᗓha;䎱ĀapᗟcĀclᗤᗧr;䄁g;樿ɤᗰ\0\0ᘊʀ;adsvᗺᗻᗿᘁᘇ戧nd;橕;橜lope;橘;橚΀;elmrszᘘᘙᘛᘞᘿᙏᙙ戠;榤e»ᘙsdĀ;aᘥᘦ戡ѡᘰᘲᘴᘶᘸᘺᘼᘾ;榨;榩;榪;榫;榬;榭;榮;榯tĀ;vᙅᙆ戟bĀ;dᙌᙍ抾;榝Āptᙔᙗh;戢»¹arr;捼Āgpᙣᙧon;䄅f;쀀𝕒΀;Eaeiop዁ᙻᙽᚂᚄᚇᚊ;橰cir;橯;扊d;手s;䀧roxĀ;e዁ᚒñᚃing耻å䃥ƀctyᚡᚦᚨr;쀀𝒶;䀪mpĀ;e዁ᚯñʈilde耻ã䃣ml耻ä䃤Āciᛂᛈoninôɲnt;樑ࠀNabcdefiklnoprsu᛭ᛱᜰ᜼ᝃᝈ᝸᝽០៦ᠹᡐᜍ᤽᥈ᥰot;櫭Ācrᛶ᜞kȀcepsᜀᜅᜍᜓong;扌psilon;䏶rime;怵imĀ;e᜚᜛戽q;拍Ŷᜢᜦee;抽edĀ;gᜬᜭ挅e»ᜭrkĀ;t፜᜷brk;掶Āoyᜁᝁ;䐱quo;怞ʀcmprtᝓ᝛ᝡᝤᝨausĀ;eĊĉptyv;榰séᜌnoõēƀahwᝯ᝱ᝳ;䎲;愶een;扬r;쀀𝔟g΀costuvwឍឝឳេ៕៛៞ƀaiuបពរðݠrc;旯p»፱ƀdptឤឨឭot;樀lus;樁imes;樂ɱឹ\0\0ើcup;樆ar;昅riangleĀdu៍្own;施p;斳plus;樄eåᑄåᒭarow;植ƀako៭ᠦᠵĀcn៲ᠣkƀlst៺֫᠂ozenge;槫riangleȀ;dlr᠒᠓᠘᠝斴own;斾eft;旂ight;斸k;搣Ʊᠫ\0ᠳƲᠯ\0ᠱ;斒;斑4;斓ck;斈ĀeoᠾᡍĀ;qᡃᡆ쀀=⃥uiv;쀀≡⃥t;挐Ȁptwxᡙᡞᡧᡬf;쀀𝕓Ā;tᏋᡣom»Ꮜtie;拈؀DHUVbdhmptuvᢅᢖᢪᢻᣗᣛᣬ᣿ᤅᤊᤐᤡȀLRlrᢎᢐᢒᢔ;敗;敔;敖;敓ʀ;DUduᢡᢢᢤᢦᢨ敐;敦;敩;敤;敧ȀLRlrᢳᢵᢷᢹ;敝;敚;敜;教΀;HLRhlrᣊᣋᣍᣏᣑᣓᣕ救;敬;散;敠;敫;敢;敟ox;槉ȀLRlrᣤᣦᣨᣪ;敕;敒;攐;攌ʀ;DUduڽ᣷᣹᣻᣽;敥;敨;攬;攴inus;抟lus;択imes;抠ȀLRlrᤙᤛᤝ᤟;敛;敘;攘;攔΀;HLRhlrᤰᤱᤳᤵᤷ᤻᤹攂;敪;敡;敞;攼;攤;攜Āevģ᥂bar耻¦䂦Ȁceioᥑᥖᥚᥠr;쀀𝒷mi;恏mĀ;e᜚᜜lƀ;bhᥨᥩᥫ䁜;槅sub;柈Ŭᥴ᥾lĀ;e᥹᥺怢t»᥺pƀ;Eeįᦅᦇ;檮Ā;qۜۛೡᦧ\0᧨ᨑᨕᨲ\0ᨷᩐ\0\0᪴\0\0᫁\0\0ᬡᬮ᭍᭒\0᯽\0ᰌƀcpr᦭ᦲ᧝ute;䄇̀;abcdsᦿᧀᧄ᧊᧕᧙戩nd;橄rcup;橉Āau᧏᧒p;橋p;橇ot;橀;쀀∩︀Āeo᧢᧥t;恁îړȀaeiu᧰᧻ᨁᨅǰ᧵\0᧸s;橍on;䄍dil耻ç䃧rc;䄉psĀ;sᨌᨍ橌m;橐ot;䄋ƀdmnᨛᨠᨦil肻¸ƭptyv;榲t脀¢;eᨭᨮ䂢räƲr;쀀𝔠ƀceiᨽᩀᩍy;䑇ckĀ;mᩇᩈ朓ark»ᩈ;䏇r΀;Ecefms᩟᩠ᩢᩫ᪤᪪᪮旋;槃ƀ;elᩩᩪᩭ䋆q;扗eɡᩴ\0\0᪈rrowĀlr᩼᪁eft;憺ight;憻ʀRSacd᪒᪔᪖᪚᪟»ཇ;擈st;抛irc;抚ash;抝nint;樐id;櫯cir;槂ubsĀ;u᪻᪼晣it»᪼ˬ᫇᫔᫺\0ᬊonĀ;eᫍᫎ䀺Ā;qÇÆɭ᫙\0\0᫢aĀ;t᫞᫟䀬;䁀ƀ;fl᫨᫩᫫戁îᅠeĀmx᫱᫶ent»᫩eóɍǧ᫾\0ᬇĀ;dኻᬂot;橭nôɆƀfryᬐᬔᬗ;쀀𝕔oäɔ脀©;sŕᬝr;愗Āaoᬥᬩrr;憵ss;朗Ācuᬲᬷr;쀀𝒸Ābpᬼ᭄Ā;eᭁᭂ櫏;櫑Ā;eᭉᭊ櫐;櫒dot;拯΀delprvw᭠᭬᭷ᮂᮬᯔ᯹arrĀlr᭨᭪;椸;椵ɰ᭲\0\0᭵r;拞c;拟arrĀ;p᭿ᮀ憶;椽̀;bcdosᮏᮐᮖᮡᮥᮨ截rcap;橈Āauᮛᮞp;橆p;橊ot;抍r;橅;쀀∪︀Ȁalrv᮵ᮿᯞᯣrrĀ;mᮼᮽ憷;椼yƀevwᯇᯔᯘqɰᯎ\0\0ᯒreã᭳uã᭵ee;拎edge;拏en耻¤䂤earrowĀlrᯮ᯳eft»ᮀight»ᮽeäᯝĀciᰁᰇoninôǷnt;戱lcty;挭ঀAHabcdefhijlorstuwz᰸᰻᰿ᱝᱩᱵᲊᲞᲬᲷ᳻᳿ᴍᵻᶑᶫᶻ᷆᷍rò΁ar;楥Ȁglrs᱈ᱍ᱒᱔ger;怠eth;愸òᄳhĀ;vᱚᱛ怐»ऊūᱡᱧarow;椏aã̕Āayᱮᱳron;䄏;䐴ƀ;ao̲ᱼᲄĀgrʿᲁr;懊tseq;橷ƀglmᲑᲔᲘ耻°䂰ta;䎴ptyv;榱ĀirᲣᲨsht;楿;쀀𝔡arĀlrᲳᲵ»ࣜ»သʀaegsv᳂͸᳖᳜᳠mƀ;oș᳊᳔ndĀ;ș᳑uit;晦amma;䏝in;拲ƀ;io᳧᳨᳸䃷de脀÷;o᳧ᳰntimes;拇nø᳷cy;䑒cɯᴆ\0\0ᴊrn;挞op;挍ʀlptuwᴘᴝᴢᵉᵕlar;䀤f;쀀𝕕ʀ;emps̋ᴭᴷᴽᵂqĀ;d͒ᴳot;扑inus;戸lus;戔quare;抡blebarwedgåúnƀadhᄮᵝᵧownarrowóᲃarpoonĀlrᵲᵶefôᲴighôᲶŢᵿᶅkaro÷གɯᶊ\0\0ᶎrn;挟op;挌ƀcotᶘᶣᶦĀryᶝᶡ;쀀𝒹;䑕l;槶rok;䄑Ādrᶰᶴot;拱iĀ;fᶺ᠖斿Āah᷀᷃ròЩaòྦangle;榦Āci᷒ᷕy;䑟grarr;柿ऀDacdefglmnopqrstuxḁḉḙḸոḼṉṡṾấắẽỡἪἷὄ὎὚ĀDoḆᴴoôᲉĀcsḎḔute耻é䃩ter;橮ȀaioyḢḧḱḶron;䄛rĀ;cḭḮ扖耻ê䃪lon;払;䑍ot;䄗ĀDrṁṅot;扒;쀀𝔢ƀ;rsṐṑṗ檚ave耻è䃨Ā;dṜṝ檖ot;檘Ȁ;ilsṪṫṲṴ檙nters;揧;愓Ā;dṹṺ檕ot;檗ƀapsẅẉẗcr;䄓tyƀ;svẒẓẕ戅et»ẓpĀ1;ẝẤĳạả;怄;怅怃ĀgsẪẬ;䅋p;怂ĀgpẴẸon;䄙f;쀀𝕖ƀalsỄỎỒrĀ;sỊị拕l;槣us;橱iƀ;lvỚớở䎵on»ớ;䏵ȀcsuvỪỳἋἣĀioữḱrc»Ḯɩỹ\0\0ỻíՈantĀglἂἆtr»ṝess»Ṻƀaeiἒ἖Ἒls;䀽st;扟vĀ;DȵἠD;橸parsl;槥ĀDaἯἳot;打rr;楱ƀcdiἾὁỸr;愯oô͒ĀahὉὋ;䎷耻ð䃰Āmrὓὗl耻ë䃫o;悬ƀcipὡὤὧl;䀡sôծĀeoὬὴctatioîՙnentialåչৡᾒ\0ᾞ\0ᾡᾧ\0\0ῆῌ\0ΐ\0ῦῪ \0 ⁚llingdotseñṄy;䑄male;晀ƀilrᾭᾳ῁lig;耀ﬃɩᾹ\0\0᾽g;耀ﬀig;耀ﬄ;쀀𝔣lig;耀ﬁlig;쀀fjƀaltῙ῜ῡt;晭ig;耀ﬂns;斱of;䆒ǰ΅\0ῳf;쀀𝕗ĀakֿῷĀ;vῼ´拔;櫙artint;樍Āao‌⁕Ācs‑⁒α‚‰‸⁅⁈\0⁐β•‥‧‪‬\0‮耻½䂽;慓耻¼䂼;慕;慙;慛Ƴ‴\0‶;慔;慖ʴ‾⁁\0\0⁃耻¾䂾;慗;慜5;慘ƶ⁌\0⁎;慚;慝8;慞l;恄wn;挢cr;쀀𝒻ࢀEabcdefgijlnorstv₂₉₟₥₰₴⃰⃵⃺⃿℃ℒℸ̗ℾ⅒↞Ā;lٍ₇;檌ƀcmpₐₕ₝ute;䇵maĀ;dₜ᳚䎳;檆reve;䄟Āiy₪₮rc;䄝;䐳ot;䄡Ȁ;lqsؾق₽⃉ƀ;qsؾٌ⃄lanô٥Ȁ;cdl٥⃒⃥⃕c;檩otĀ;o⃜⃝檀Ā;l⃢⃣檂;檄Ā;e⃪⃭쀀⋛︀s;檔r;쀀𝔤Ā;gٳ؛mel;愷cy;䑓Ȁ;Eajٚℌℎℐ;檒;檥;檤ȀEaesℛℝ℩ℴ;扩pĀ;p℣ℤ檊rox»ℤĀ;q℮ℯ檈Ā;q℮ℛim;拧pf;쀀𝕘Āci⅃ⅆr;愊mƀ;el٫ⅎ⅐;檎;檐茀>;cdlqr׮ⅠⅪⅮⅳⅹĀciⅥⅧ;檧r;橺ot;拗Par;榕uest;橼ʀadelsↄⅪ←ٖ↛ǰ↉\0↎proø₞r;楸qĀlqؿ↖lesó₈ií٫Āen↣↭rtneqq;쀀≩︀Å↪ԀAabcefkosy⇄⇇⇱⇵⇺∘∝∯≨≽ròΠȀilmr⇐⇔⇗⇛rsðᒄf»․ilôکĀdr⇠⇤cy;䑊ƀ;cwࣴ⇫⇯ir;楈;憭ar;意irc;䄥ƀalr∁∎∓rtsĀ;u∉∊晥it»∊lip;怦con;抹r;쀀𝔥sĀew∣∩arow;椥arow;椦ʀamopr∺∾≃≞≣rr;懿tht;戻kĀlr≉≓eftarrow;憩ightarrow;憪f;쀀𝕙bar;怕ƀclt≯≴≸r;쀀𝒽asè⇴rok;䄧Ābp⊂⊇ull;恃hen»ᱛૡ⊣\0⊪\0⊸⋅⋎\0⋕⋳\0\0⋸⌢⍧⍢⍿\0⎆⎪⎴cute耻í䃭ƀ;iyݱ⊰⊵rc耻î䃮;䐸Ācx⊼⊿y;䐵cl耻¡䂡ĀfrΟ⋉;쀀𝔦rave耻ì䃬Ȁ;inoܾ⋝⋩⋮Āin⋢⋦nt;樌t;戭fin;槜ta;愩lig;䄳ƀaop⋾⌚⌝ƀcgt⌅⌈⌗r;䄫ƀelpܟ⌏⌓inåގarôܠh;䄱f;抷ed;䆵ʀ;cfotӴ⌬⌱⌽⍁are;愅inĀ;t⌸⌹戞ie;槝doô⌙ʀ;celpݗ⍌⍐⍛⍡al;抺Āgr⍕⍙eróᕣã⍍arhk;樗rod;樼Ȁcgpt⍯⍲⍶⍻y;䑑on;䄯f;쀀𝕚a;䎹uest耻¿䂿Āci⎊⎏r;쀀𝒾nʀ;EdsvӴ⎛⎝⎡ӳ;拹ot;拵Ā;v⎦⎧拴;拳Ā;iݷ⎮lde;䄩ǫ⎸\0⎼cy;䑖l耻ï䃯̀cfmosu⏌⏗⏜⏡⏧⏵Āiy⏑⏕rc;䄵;䐹r;쀀𝔧ath;䈷pf;쀀𝕛ǣ⏬\0⏱r;쀀𝒿rcy;䑘kcy;䑔Ѐacfghjos␋␖␢␧␭␱␵␻ppaĀ;v␓␔䎺;䏰Āey␛␠dil;䄷;䐺r;쀀𝔨reen;䄸cy;䑅cy;䑜pf;쀀𝕜cr;쀀𝓀஀ABEHabcdefghjlmnoprstuv⑰⒁⒆⒍⒑┎┽╚▀♎♞♥♹♽⚚⚲⛘❝❨➋⟀⠁⠒ƀart⑷⑺⑼rò৆òΕail;椛arr;椎Ā;gঔ⒋;檋ar;楢ॣ⒥\0⒪\0⒱\0\0\0\0\0⒵Ⓔ\0ⓆⓈⓍ\0⓹ute;䄺mptyv;榴raîࡌbda;䎻gƀ;dlࢎⓁⓃ;榑åࢎ;檅uo耻«䂫rЀ;bfhlpst࢙ⓞⓦⓩ⓫⓮⓱⓵Ā;f࢝ⓣs;椟s;椝ë≒p;憫l;椹im;楳l;憢ƀ;ae⓿─┄檫il;椙Ā;s┉┊檭;쀀⪭︀ƀabr┕┙┝rr;椌rk;杲Āak┢┬cĀek┨┪;䁻;䁛Āes┱┳;榋lĀdu┹┻;榏;榍Ȁaeuy╆╋╖╘ron;䄾Ādi═╔il;䄼ìࢰâ┩;䐻Ȁcqrs╣╦╭╽a;椶uoĀ;rนᝆĀdu╲╷har;楧shar;楋h;憲ʀ;fgqs▋▌উ◳◿扤tʀahlrt▘▤▷◂◨rrowĀ;t࢙□aé⓶arpoonĀdu▯▴own»њp»०eftarrows;懇ightƀahs◍◖◞rrowĀ;sࣴࢧarpoonó྘quigarro÷⇰hreetimes;拋ƀ;qs▋ও◺lanôবʀ;cdgsব☊☍☝☨c;檨otĀ;o☔☕橿Ā;r☚☛檁;檃Ā;e☢☥쀀⋚︀s;檓ʀadegs☳☹☽♉♋pproøⓆot;拖qĀgq♃♅ôউgtò⒌ôছiíলƀilr♕࣡♚sht;楼;쀀𝔩Ā;Eজ♣;檑š♩♶rĀdu▲♮Ā;l॥♳;楪lk;斄cy;䑙ʀ;achtੈ⚈⚋⚑⚖rò◁orneòᴈard;楫ri;旺Āio⚟⚤dot;䅀ustĀ;a⚬⚭掰che»⚭ȀEaes⚻⚽⛉⛔;扨pĀ;p⛃⛄檉rox»⛄Ā;q⛎⛏檇Ā;q⛎⚻im;拦Ѐabnoptwz⛩⛴⛷✚✯❁❇❐Ānr⛮⛱g;柬r;懽rëࣁgƀlmr⛿✍✔eftĀar০✇ightá৲apsto;柼ightá৽parrowĀlr✥✩efô⓭ight;憬ƀafl✶✹✽r;榅;쀀𝕝us;樭imes;樴š❋❏st;戗áፎƀ;ef❗❘᠀旊nge»❘arĀ;l❤❥䀨t;榓ʀachmt❳❶❼➅➇ròࢨorneòᶌarĀ;d྘➃;業;怎ri;抿̀achiqt➘➝ੀ➢➮➻quo;怹r;쀀𝓁mƀ;egল➪➬;檍;檏Ābu┪➳oĀ;rฟ➹;怚rok;䅂萀<;cdhilqrࠫ⟒☹⟜⟠⟥⟪⟰Āci⟗⟙;檦r;橹reå◲mes;拉arr;楶uest;橻ĀPi⟵⟹ar;榖ƀ;ef⠀भ᠛旃rĀdu⠇⠍shar;楊har;楦Āen⠗⠡rtneqq;쀀≨︀Å⠞܀Dacdefhilnopsu⡀⡅⢂⢎⢓⢠⢥⢨⣚⣢⣤ઃ⣳⤂Dot;戺Ȁclpr⡎⡒⡣⡽r耻¯䂯Āet⡗⡙;時Ā;e⡞⡟朠se»⡟Ā;sျ⡨toȀ;dluျ⡳⡷⡻owîҌefôएðᏑker;斮Āoy⢇⢌mma;権;䐼ash;怔asuredangle»ᘦr;쀀𝔪o;愧ƀcdn⢯⢴⣉ro耻µ䂵Ȁ;acdᑤ⢽⣀⣄sôᚧir;櫰ot肻·Ƶusƀ;bd⣒ᤃ⣓戒Ā;uᴼ⣘;横ţ⣞⣡p;櫛ò−ðઁĀdp⣩⣮els;抧f;쀀𝕞Āct⣸⣽r;쀀𝓂pos»ᖝƀ;lm⤉⤊⤍䎼timap;抸ఀGLRVabcdefghijlmoprstuvw⥂⥓⥾⦉⦘⧚⧩⨕⨚⩘⩝⪃⪕⪤⪨⬄⬇⭄⭿⮮ⰴⱧⱼ⳩Āgt⥇⥋;쀀⋙̸Ā;v⥐௏쀀≫⃒ƀelt⥚⥲⥶ftĀar⥡⥧rrow;懍ightarrow;懎;쀀⋘̸Ā;v⥻ే쀀≪⃒ightarrow;懏ĀDd⦎⦓ash;抯ash;抮ʀbcnpt⦣⦧⦬⦱⧌la»˞ute;䅄g;쀀∠⃒ʀ;Eiop඄⦼⧀⧅⧈;쀀⩰̸d;쀀≋̸s;䅉roø඄urĀ;a⧓⧔普lĀ;s⧓ସǳ⧟\0⧣p肻 ଷmpĀ;e௹ఀʀaeouy⧴⧾⨃⨐⨓ǰ⧹\0⧻;橃on;䅈dil;䅆ngĀ;dൾ⨊ot;쀀⩭̸p;橂;䐽ash;怓΀;Aadqsxஒ⨩⨭⨻⩁⩅⩐rr;懗rĀhr⨳⨶k;椤Ā;oᏲᏰot;쀀≐̸uiöୣĀei⩊⩎ar;椨í஘istĀ;s஠டr;쀀𝔫ȀEest௅⩦⩹⩼ƀ;qs஼⩭௡ƀ;qs஼௅⩴lanô௢ií௪Ā;rஶ⪁»ஷƀAap⪊⪍⪑rò⥱rr;憮ar;櫲ƀ;svྍ⪜ྌĀ;d⪡⪢拼;拺cy;䑚΀AEadest⪷⪺⪾⫂⫅⫶⫹rò⥦;쀀≦̸rr;憚r;急Ȁ;fqs఻⫎⫣⫯tĀar⫔⫙rro÷⫁ightarro÷⪐ƀ;qs఻⪺⫪lanôౕĀ;sౕ⫴»శiíౝĀ;rవ⫾iĀ;eచథiäඐĀpt⬌⬑f;쀀𝕟膀¬;in⬙⬚⬶䂬nȀ;Edvஉ⬤⬨⬮;쀀⋹̸ot;쀀⋵̸ǡஉ⬳⬵;拷;拶iĀ;vಸ⬼ǡಸ⭁⭃;拾;拽ƀaor⭋⭣⭩rȀ;ast୻⭕⭚⭟lleì୻l;쀀⫽⃥;쀀∂̸lint;樔ƀ;ceಒ⭰⭳uåಥĀ;cಘ⭸Ā;eಒ⭽ñಘȀAait⮈⮋⮝⮧rò⦈rrƀ;cw⮔⮕⮙憛;쀀⤳̸;쀀↝̸ghtarrow»⮕riĀ;eೋೖ΀chimpqu⮽⯍⯙⬄୸⯤⯯Ȁ;cerല⯆ഷ⯉uå൅;쀀𝓃ortɭ⬅\0\0⯖ará⭖mĀ;e൮⯟Ā;q൴൳suĀbp⯫⯭å೸åഋƀbcp⯶ⰑⰙȀ;Ees⯿ⰀഢⰄ抄;쀀⫅̸etĀ;eഛⰋqĀ;qണⰀcĀ;eലⰗñസȀ;EesⰢⰣൟⰧ抅;쀀⫆̸etĀ;e൘ⰮqĀ;qൠⰣȀgilrⰽⰿⱅⱇìௗlde耻ñ䃱çృiangleĀlrⱒⱜeftĀ;eచⱚñదightĀ;eೋⱥñ೗Ā;mⱬⱭ䎽ƀ;esⱴⱵⱹ䀣ro;愖p;怇ҀDHadgilrsⲏⲔⲙⲞⲣⲰⲶⳓⳣash;抭arr;椄p;쀀≍⃒ash;抬ĀetⲨⲬ;쀀≥⃒;쀀>⃒nfin;槞ƀAetⲽⳁⳅrr;椂;쀀≤⃒Ā;rⳊⳍ쀀<⃒ie;쀀⊴⃒ĀAtⳘⳜrr;椃rie;쀀⊵⃒im;쀀∼⃒ƀAan⳰⳴ⴂrr;懖rĀhr⳺⳽k;椣Ā;oᏧᏥear;椧ቓ᪕\0\0\0\0\0\0\0\0\0\0\0\0\0ⴭ\0ⴸⵈⵠⵥ⵲ⶄᬇ\0\0ⶍⶫ\0ⷈⷎ\0ⷜ⸙⸫⸾⹃Ācsⴱ᪗ute耻ó䃳ĀiyⴼⵅrĀ;c᪞ⵂ耻ô䃴;䐾ʀabios᪠ⵒⵗǈⵚlac;䅑v;樸old;榼lig;䅓Ācr⵩⵭ir;榿;쀀𝔬ͯ⵹\0\0⵼\0ⶂn;䋛ave耻ò䃲;槁Ābmⶈ෴ar;榵Ȁacitⶕ⶘ⶥⶨrò᪀Āir⶝ⶠr;榾oss;榻nå๒;槀ƀaeiⶱⶵⶹcr;䅍ga;䏉ƀcdnⷀⷅǍron;䎿;榶pf;쀀𝕠ƀaelⷔ⷗ǒr;榷rp;榹΀;adiosvⷪⷫⷮ⸈⸍⸐⸖戨rò᪆Ȁ;efmⷷⷸ⸂⸅橝rĀ;oⷾⷿ愴f»ⷿ耻ª䂪耻º䂺gof;抶r;橖lope;橗;橛ƀclo⸟⸡⸧ò⸁ash耻ø䃸l;折iŬⸯ⸴de耻õ䃵esĀ;aǛ⸺s;樶ml耻ö䃶bar;挽ૡ⹞\0⹽\0⺀⺝\0⺢⺹\0\0⻋ຜ\0⼓\0\0⼫⾼\0⿈rȀ;astЃ⹧⹲຅脀¶;l⹭⹮䂶leìЃɩ⹸\0\0⹻m;櫳;櫽y;䐿rʀcimpt⺋⺏⺓ᡥ⺗nt;䀥od;䀮il;怰enk;怱r;쀀𝔭ƀimo⺨⺰⺴Ā;v⺭⺮䏆;䏕maô੶ne;明ƀ;tv⺿⻀⻈䏀chfork»´;䏖Āau⻏⻟nĀck⻕⻝kĀ;h⇴⻛;愎ö⇴sҀ;abcdemst⻳⻴ᤈ⻹⻽⼄⼆⼊⼎䀫cir;樣ir;樢Āouᵀ⼂;樥;橲n肻±ຝim;樦wo;樧ƀipu⼙⼠⼥ntint;樕f;쀀𝕡nd耻£䂣Ԁ;Eaceinosu່⼿⽁⽄⽇⾁⾉⾒⽾⾶;檳p;檷uå໙Ā;c໎⽌̀;acens່⽙⽟⽦⽨⽾pproø⽃urlyeñ໙ñ໎ƀaes⽯⽶⽺pprox;檹qq;檵im;拨iíໟmeĀ;s⾈ຮ怲ƀEas⽸⾐⽺ð⽵ƀdfp໬⾙⾯ƀals⾠⾥⾪lar;挮ine;挒urf;挓Ā;t໻⾴ï໻rel;抰Āci⿀⿅r;쀀𝓅;䏈ncsp;怈̀fiopsu⿚⋢⿟⿥⿫⿱r;쀀𝔮pf;쀀𝕢rime;恗cr;쀀𝓆ƀaeo⿸〉〓tĀei⿾々rnionóڰnt;樖stĀ;e【】䀿ñἙô༔઀ABHabcdefhilmnoprstux぀けさすムㄎㄫㅇㅢㅲㆎ㈆㈕㈤㈩㉘㉮㉲㊐㊰㊷ƀartぇおがròႳòϝail;検aròᱥar;楤΀cdenqrtとふへみわゔヌĀeuねぱ;쀀∽̱te;䅕iãᅮmptyv;榳gȀ;del࿑らるろ;榒;榥å࿑uo耻»䂻rր;abcfhlpstw࿜ガクシスゼゾダッデナp;極Ā;f࿠ゴs;椠;椳s;椞ë≝ð✮l;楅im;楴l;憣;憝Āaiパフil;椚oĀ;nホボ戶aló༞ƀabrョリヮrò៥rk;杳ĀakンヽcĀekヹ・;䁽;䁝Āes㄂㄄;榌lĀduㄊㄌ;榎;榐Ȁaeuyㄗㄜㄧㄩron;䅙Ādiㄡㄥil;䅗ì࿲âヺ;䑀Ȁclqsㄴㄷㄽㅄa;椷dhar;楩uoĀ;rȎȍh;憳ƀacgㅎㅟངlȀ;ipsླྀㅘㅛႜnåႻarôྩt;断ƀilrㅩဣㅮsht;楽;쀀𝔯ĀaoㅷㆆrĀduㅽㅿ»ѻĀ;l႑ㆄ;楬Ā;vㆋㆌ䏁;䏱ƀgns㆕ㇹㇼht̀ahlrstㆤㆰ㇂㇘㇤㇮rrowĀ;t࿜ㆭaéトarpoonĀduㆻㆿowîㅾp»႒eftĀah㇊㇐rrowó࿪arpoonóՑightarrows;應quigarro÷ニhreetimes;拌g;䋚ingdotseñἲƀahm㈍㈐㈓rò࿪aòՑ;怏oustĀ;a㈞㈟掱che»㈟mid;櫮Ȁabpt㈲㈽㉀㉒Ānr㈷㈺g;柭r;懾rëဃƀafl㉇㉊㉎r;榆;쀀𝕣us;樮imes;樵Āap㉝㉧rĀ;g㉣㉤䀩t;榔olint;樒arò㇣Ȁachq㉻㊀Ⴜ㊅quo;怺r;쀀𝓇Ābu・㊊oĀ;rȔȓƀhir㊗㊛㊠reåㇸmes;拊iȀ;efl㊪ၙᠡ㊫方tri;槎luhar;楨;愞ൡ㋕㋛㋟㌬㌸㍱\0㍺㎤\0\0㏬㏰\0㐨㑈㑚㒭㒱㓊㓱\0㘖\0\0㘳cute;䅛quï➺Ԁ;Eaceinpsyᇭ㋳㋵㋿㌂㌋㌏㌟㌦㌩;檴ǰ㋺\0㋼;檸on;䅡uåᇾĀ;dᇳ㌇il;䅟rc;䅝ƀEas㌖㌘㌛;檶p;檺im;择olint;樓iíሄ;䑁otƀ;be㌴ᵇ㌵担;橦΀Aacmstx㍆㍊㍗㍛㍞㍣㍭rr;懘rĀhr㍐㍒ë∨Ā;oਸ਼਴t耻§䂧i;䀻war;椩mĀin㍩ðnuóñt;朶rĀ;o㍶⁕쀀𝔰Ȁacoy㎂㎆㎑㎠rp;景Āhy㎋㎏cy;䑉;䑈rtɭ㎙\0\0㎜iäᑤaraì⹯耻­䂭Āgm㎨㎴maƀ;fv㎱㎲㎲䏃;䏂Ѐ;deglnprካ㏅㏉㏎㏖㏞㏡㏦ot;橪Ā;q኱ኰĀ;E㏓㏔檞;檠Ā;E㏛㏜檝;檟e;扆lus;樤arr;楲aròᄽȀaeit㏸㐈㐏㐗Āls㏽㐄lsetmé㍪hp;樳parsl;槤Ādlᑣ㐔e;挣Ā;e㐜㐝檪Ā;s㐢㐣檬;쀀⪬︀ƀflp㐮㐳㑂tcy;䑌Ā;b㐸㐹䀯Ā;a㐾㐿槄r;挿f;쀀𝕤aĀdr㑍ЂesĀ;u㑔㑕晠it»㑕ƀcsu㑠㑹㒟Āau㑥㑯pĀ;sᆈ㑫;쀀⊓︀pĀ;sᆴ㑵;쀀⊔︀uĀbp㑿㒏ƀ;esᆗᆜ㒆etĀ;eᆗ㒍ñᆝƀ;esᆨᆭ㒖etĀ;eᆨ㒝ñᆮƀ;afᅻ㒦ְrť㒫ֱ»ᅼaròᅈȀcemt㒹㒾㓂㓅r;쀀𝓈tmîñiì㐕aræᆾĀar㓎㓕rĀ;f㓔ឿ昆Āan㓚㓭ightĀep㓣㓪psiloîỠhé⺯s»⡒ʀbcmnp㓻㕞ሉ㖋㖎Ҁ;Edemnprs㔎㔏㔑㔕㔞㔣㔬㔱㔶抂;櫅ot;檽Ā;dᇚ㔚ot;櫃ult;櫁ĀEe㔨㔪;櫋;把lus;檿arr;楹ƀeiu㔽㕒㕕tƀ;en㔎㕅㕋qĀ;qᇚ㔏eqĀ;q㔫㔨m;櫇Ābp㕚㕜;櫕;櫓c̀;acensᇭ㕬㕲㕹㕻㌦pproø㋺urlyeñᇾñᇳƀaes㖂㖈㌛pproø㌚qñ㌗g;晪ڀ123;Edehlmnps㖩㖬㖯ሜ㖲㖴㗀㗉㗕㗚㗟㗨㗭耻¹䂹耻²䂲耻³䂳;櫆Āos㖹㖼t;檾ub;櫘Ā;dሢ㗅ot;櫄sĀou㗏㗒l;柉b;櫗arr;楻ult;櫂ĀEe㗤㗦;櫌;抋lus;櫀ƀeiu㗴㘉㘌tƀ;enሜ㗼㘂qĀ;qሢ㖲eqĀ;q㗧㗤m;櫈Ābp㘑㘓;櫔;櫖ƀAan㘜㘠㘭rr;懙rĀhr㘦㘨ë∮Ā;oਫ਩war;椪lig耻ß䃟௡㙑㙝㙠ዎ㙳㙹\0㙾㛂\0\0\0\0\0㛛㜃\0㜉㝬\0\0\0㞇ɲ㙖\0\0㙛get;挖;䏄rë๟ƀaey㙦㙫㙰ron;䅥dil;䅣;䑂lrec;挕r;쀀𝔱Ȁeiko㚆㚝㚵㚼ǲ㚋\0㚑eĀ4fኄኁaƀ;sv㚘㚙㚛䎸ym;䏑Ācn㚢㚲kĀas㚨㚮pproø዁im»ኬsðኞĀas㚺㚮ð዁rn耻þ䃾Ǭ̟㛆⋧es膀×;bd㛏㛐㛘䃗Ā;aᤏ㛕r;樱;樰ƀeps㛡㛣㜀á⩍Ȁ;bcf҆㛬㛰㛴ot;挶ir;櫱Ā;o㛹㛼쀀𝕥rk;櫚á㍢rime;怴ƀaip㜏㜒㝤dåቈ΀adempst㜡㝍㝀㝑㝗㝜㝟ngleʀ;dlqr㜰㜱㜶㝀㝂斵own»ᶻeftĀ;e⠀㜾ñम;扜ightĀ;e㊪㝋ñၚot;旬inus;樺lus;樹b;槍ime;樻ezium;揢ƀcht㝲㝽㞁Āry㝷㝻;쀀𝓉;䑆cy;䑛rok;䅧Āio㞋㞎xô᝷headĀlr㞗㞠eftarro÷ࡏightarrow»ཝऀAHabcdfghlmoprstuw㟐㟓㟗㟤㟰㟼㠎㠜㠣㠴㡑㡝㡫㢩㣌㣒㣪㣶ròϭar;楣Ācr㟜㟢ute耻ú䃺òᅐrǣ㟪\0㟭y;䑞ve;䅭Āiy㟵㟺rc耻û䃻;䑃ƀabh㠃㠆㠋ròᎭlac;䅱aòᏃĀir㠓㠘sht;楾;쀀𝔲rave耻ù䃹š㠧㠱rĀlr㠬㠮»ॗ»ႃlk;斀Āct㠹㡍ɯ㠿\0\0㡊rnĀ;e㡅㡆挜r»㡆op;挏ri;旸Āal㡖㡚cr;䅫肻¨͉Āgp㡢㡦on;䅳f;쀀𝕦̀adhlsuᅋ㡸㡽፲㢑㢠ownáᎳarpoonĀlr㢈㢌efô㠭ighô㠯iƀ;hl㢙㢚㢜䏅»ᏺon»㢚parrows;懈ƀcit㢰㣄㣈ɯ㢶\0\0㣁rnĀ;e㢼㢽挝r»㢽op;挎ng;䅯ri;旹cr;쀀𝓊ƀdir㣙㣝㣢ot;拰lde;䅩iĀ;f㜰㣨»᠓Āam㣯㣲rò㢨l耻ü䃼angle;榧ހABDacdeflnoprsz㤜㤟㤩㤭㦵㦸㦽㧟㧤㧨㧳㧹㧽㨁㨠ròϷarĀ;v㤦㤧櫨;櫩asèϡĀnr㤲㤷grt;榜΀eknprst㓣㥆㥋㥒㥝㥤㦖appá␕othinçẖƀhir㓫⻈㥙opô⾵Ā;hᎷ㥢ïㆍĀiu㥩㥭gmá㎳Ābp㥲㦄setneqĀ;q㥽㦀쀀⊊︀;쀀⫋︀setneqĀ;q㦏㦒쀀⊋︀;쀀⫌︀Āhr㦛㦟etá㚜iangleĀlr㦪㦯eft»थight»ၑy;䐲ash»ံƀelr㧄㧒㧗ƀ;beⷪ㧋㧏ar;抻q;扚lip;拮Ābt㧜ᑨaòᑩr;쀀𝔳tré㦮suĀbp㧯㧱»ജ»൙pf;쀀𝕧roð໻tré㦴Ācu㨆㨋r;쀀𝓋Ābp㨐㨘nĀEe㦀㨖»㥾nĀEe㦒㨞»㦐igzag;榚΀cefoprs㨶㨻㩖㩛㩔㩡㩪irc;䅵Ādi㩀㩑Ābg㩅㩉ar;機eĀ;qᗺ㩏;扙erp;愘r;쀀𝔴pf;쀀𝕨Ā;eᑹ㩦atèᑹcr;쀀𝓌ૣណ㪇\0㪋\0㪐㪛\0\0㪝㪨㪫㪯\0\0㫃㫎\0㫘ៜ៟tré៑r;쀀𝔵ĀAa㪔㪗ròσrò৶;䎾ĀAa㪡㪤ròθrò৫að✓is;拻ƀdptឤ㪵㪾Āfl㪺ឩ;쀀𝕩imåឲĀAa㫇㫊ròώròਁĀcq㫒ីr;쀀𝓍Āpt៖㫜ré។Ѐacefiosu㫰㫽㬈㬌㬑㬕㬛㬡cĀuy㫶㫻te耻ý䃽;䑏Āiy㬂㬆rc;䅷;䑋n耻¥䂥r;쀀𝔶cy;䑗pf;쀀𝕪cr;쀀𝓎Ācm㬦㬩y;䑎l耻ÿ䃿Ԁacdefhiosw㭂㭈㭔㭘㭤㭩㭭㭴㭺㮀cute;䅺Āay㭍㭒ron;䅾;䐷ot;䅼Āet㭝㭡træᕟa;䎶r;쀀𝔷cy;䐶grarr;懝pf;쀀𝕫cr;쀀𝓏Ājn㮅㮇;怍j;怌'.split("").map(function(c) {
      return c.charCodeAt(0);
    })
  );
  return decodeDataHtml;
}
var decodeDataXml = {};
var hasRequiredDecodeDataXml;
function requireDecodeDataXml() {
  if (hasRequiredDecodeDataXml) return decodeDataXml;
  hasRequiredDecodeDataXml = 1;
  Object.defineProperty(decodeDataXml, "__esModule", { value: true });
  decodeDataXml.default = new Uint16Array(
    // prettier-ignore
    "Ȁaglq	\x1Bɭ\0\0p;䀦os;䀧t;䀾t;䀼uot;䀢".split("").map(function(c) {
      return c.charCodeAt(0);
    })
  );
  return decodeDataXml;
}
var decode_codepoint = {};
var hasRequiredDecode_codepoint;
function requireDecode_codepoint() {
  if (hasRequiredDecode_codepoint) return decode_codepoint;
  hasRequiredDecode_codepoint = 1;
  (function(exports$1) {
    var _a2;
    Object.defineProperty(exports$1, "__esModule", { value: true });
    exports$1.replaceCodePoint = exports$1.fromCodePoint = void 0;
    var decodeMap = /* @__PURE__ */ new Map([
      [0, 65533],
      // C1 Unicode control character reference replacements
      [128, 8364],
      [130, 8218],
      [131, 402],
      [132, 8222],
      [133, 8230],
      [134, 8224],
      [135, 8225],
      [136, 710],
      [137, 8240],
      [138, 352],
      [139, 8249],
      [140, 338],
      [142, 381],
      [145, 8216],
      [146, 8217],
      [147, 8220],
      [148, 8221],
      [149, 8226],
      [150, 8211],
      [151, 8212],
      [152, 732],
      [153, 8482],
      [154, 353],
      [155, 8250],
      [156, 339],
      [158, 382],
      [159, 376]
    ]);
    exports$1.fromCodePoint = // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, node/no-unsupported-features/es-builtins
    (_a2 = String.fromCodePoint) !== null && _a2 !== void 0 ? _a2 : function(codePoint) {
      var output = "";
      if (codePoint > 65535) {
        codePoint -= 65536;
        output += String.fromCharCode(codePoint >>> 10 & 1023 | 55296);
        codePoint = 56320 | codePoint & 1023;
      }
      output += String.fromCharCode(codePoint);
      return output;
    };
    function replaceCodePoint(codePoint) {
      var _a3;
      if (codePoint >= 55296 && codePoint <= 57343 || codePoint > 1114111) {
        return 65533;
      }
      return (_a3 = decodeMap.get(codePoint)) !== null && _a3 !== void 0 ? _a3 : codePoint;
    }
    exports$1.replaceCodePoint = replaceCodePoint;
    function decodeCodePoint(codePoint) {
      return (0, exports$1.fromCodePoint)(replaceCodePoint(codePoint));
    }
    exports$1.default = decodeCodePoint;
  })(decode_codepoint);
  return decode_codepoint;
}
var hasRequiredDecode;
function requireDecode() {
  if (hasRequiredDecode) return decode;
  hasRequiredDecode = 1;
  (function(exports$1) {
    var __createBinding = decode && decode.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = decode && decode.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = decode && decode.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    var __importDefault = decode && decode.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports$1, "__esModule", { value: true });
    exports$1.decodeXML = exports$1.decodeHTMLStrict = exports$1.decodeHTMLAttribute = exports$1.decodeHTML = exports$1.determineBranch = exports$1.EntityDecoder = exports$1.DecodingMode = exports$1.BinTrieFlags = exports$1.fromCodePoint = exports$1.replaceCodePoint = exports$1.decodeCodePoint = exports$1.xmlDecodeTree = exports$1.htmlDecodeTree = void 0;
    var decode_data_html_js_1 = __importDefault(/* @__PURE__ */ requireDecodeDataHtml());
    exports$1.htmlDecodeTree = decode_data_html_js_1.default;
    var decode_data_xml_js_1 = __importDefault(/* @__PURE__ */ requireDecodeDataXml());
    exports$1.xmlDecodeTree = decode_data_xml_js_1.default;
    var decode_codepoint_js_1 = __importStar(/* @__PURE__ */ requireDecode_codepoint());
    exports$1.decodeCodePoint = decode_codepoint_js_1.default;
    var decode_codepoint_js_2 = /* @__PURE__ */ requireDecode_codepoint();
    Object.defineProperty(exports$1, "replaceCodePoint", { enumerable: true, get: function() {
      return decode_codepoint_js_2.replaceCodePoint;
    } });
    Object.defineProperty(exports$1, "fromCodePoint", { enumerable: true, get: function() {
      return decode_codepoint_js_2.fromCodePoint;
    } });
    var CharCodes;
    (function(CharCodes2) {
      CharCodes2[CharCodes2["NUM"] = 35] = "NUM";
      CharCodes2[CharCodes2["SEMI"] = 59] = "SEMI";
      CharCodes2[CharCodes2["EQUALS"] = 61] = "EQUALS";
      CharCodes2[CharCodes2["ZERO"] = 48] = "ZERO";
      CharCodes2[CharCodes2["NINE"] = 57] = "NINE";
      CharCodes2[CharCodes2["LOWER_A"] = 97] = "LOWER_A";
      CharCodes2[CharCodes2["LOWER_F"] = 102] = "LOWER_F";
      CharCodes2[CharCodes2["LOWER_X"] = 120] = "LOWER_X";
      CharCodes2[CharCodes2["LOWER_Z"] = 122] = "LOWER_Z";
      CharCodes2[CharCodes2["UPPER_A"] = 65] = "UPPER_A";
      CharCodes2[CharCodes2["UPPER_F"] = 70] = "UPPER_F";
      CharCodes2[CharCodes2["UPPER_Z"] = 90] = "UPPER_Z";
    })(CharCodes || (CharCodes = {}));
    var TO_LOWER_BIT = 32;
    var BinTrieFlags;
    (function(BinTrieFlags2) {
      BinTrieFlags2[BinTrieFlags2["VALUE_LENGTH"] = 49152] = "VALUE_LENGTH";
      BinTrieFlags2[BinTrieFlags2["BRANCH_LENGTH"] = 16256] = "BRANCH_LENGTH";
      BinTrieFlags2[BinTrieFlags2["JUMP_TABLE"] = 127] = "JUMP_TABLE";
    })(BinTrieFlags = exports$1.BinTrieFlags || (exports$1.BinTrieFlags = {}));
    function isNumber(code) {
      return code >= CharCodes.ZERO && code <= CharCodes.NINE;
    }
    function isHexadecimalCharacter(code) {
      return code >= CharCodes.UPPER_A && code <= CharCodes.UPPER_F || code >= CharCodes.LOWER_A && code <= CharCodes.LOWER_F;
    }
    function isAsciiAlphaNumeric(code) {
      return code >= CharCodes.UPPER_A && code <= CharCodes.UPPER_Z || code >= CharCodes.LOWER_A && code <= CharCodes.LOWER_Z || isNumber(code);
    }
    function isEntityInAttributeInvalidEnd(code) {
      return code === CharCodes.EQUALS || isAsciiAlphaNumeric(code);
    }
    var EntityDecoderState;
    (function(EntityDecoderState2) {
      EntityDecoderState2[EntityDecoderState2["EntityStart"] = 0] = "EntityStart";
      EntityDecoderState2[EntityDecoderState2["NumericStart"] = 1] = "NumericStart";
      EntityDecoderState2[EntityDecoderState2["NumericDecimal"] = 2] = "NumericDecimal";
      EntityDecoderState2[EntityDecoderState2["NumericHex"] = 3] = "NumericHex";
      EntityDecoderState2[EntityDecoderState2["NamedEntity"] = 4] = "NamedEntity";
    })(EntityDecoderState || (EntityDecoderState = {}));
    var DecodingMode;
    (function(DecodingMode2) {
      DecodingMode2[DecodingMode2["Legacy"] = 0] = "Legacy";
      DecodingMode2[DecodingMode2["Strict"] = 1] = "Strict";
      DecodingMode2[DecodingMode2["Attribute"] = 2] = "Attribute";
    })(DecodingMode = exports$1.DecodingMode || (exports$1.DecodingMode = {}));
    var EntityDecoder = (
      /** @class */
      (function() {
        function EntityDecoder2(decodeTree, emitCodePoint, errors) {
          this.decodeTree = decodeTree;
          this.emitCodePoint = emitCodePoint;
          this.errors = errors;
          this.state = EntityDecoderState.EntityStart;
          this.consumed = 1;
          this.result = 0;
          this.treeIndex = 0;
          this.excess = 1;
          this.decodeMode = DecodingMode.Strict;
        }
        EntityDecoder2.prototype.startEntity = function(decodeMode) {
          this.decodeMode = decodeMode;
          this.state = EntityDecoderState.EntityStart;
          this.result = 0;
          this.treeIndex = 0;
          this.excess = 1;
          this.consumed = 1;
        };
        EntityDecoder2.prototype.write = function(str, offset) {
          switch (this.state) {
            case EntityDecoderState.EntityStart: {
              if (str.charCodeAt(offset) === CharCodes.NUM) {
                this.state = EntityDecoderState.NumericStart;
                this.consumed += 1;
                return this.stateNumericStart(str, offset + 1);
              }
              this.state = EntityDecoderState.NamedEntity;
              return this.stateNamedEntity(str, offset);
            }
            case EntityDecoderState.NumericStart: {
              return this.stateNumericStart(str, offset);
            }
            case EntityDecoderState.NumericDecimal: {
              return this.stateNumericDecimal(str, offset);
            }
            case EntityDecoderState.NumericHex: {
              return this.stateNumericHex(str, offset);
            }
            case EntityDecoderState.NamedEntity: {
              return this.stateNamedEntity(str, offset);
            }
          }
        };
        EntityDecoder2.prototype.stateNumericStart = function(str, offset) {
          if (offset >= str.length) {
            return -1;
          }
          if ((str.charCodeAt(offset) | TO_LOWER_BIT) === CharCodes.LOWER_X) {
            this.state = EntityDecoderState.NumericHex;
            this.consumed += 1;
            return this.stateNumericHex(str, offset + 1);
          }
          this.state = EntityDecoderState.NumericDecimal;
          return this.stateNumericDecimal(str, offset);
        };
        EntityDecoder2.prototype.addToNumericResult = function(str, start, end, base) {
          if (start !== end) {
            var digitCount = end - start;
            this.result = this.result * Math.pow(base, digitCount) + parseInt(str.substr(start, digitCount), base);
            this.consumed += digitCount;
          }
        };
        EntityDecoder2.prototype.stateNumericHex = function(str, offset) {
          var startIdx = offset;
          while (offset < str.length) {
            var char = str.charCodeAt(offset);
            if (isNumber(char) || isHexadecimalCharacter(char)) {
              offset += 1;
            } else {
              this.addToNumericResult(str, startIdx, offset, 16);
              return this.emitNumericEntity(char, 3);
            }
          }
          this.addToNumericResult(str, startIdx, offset, 16);
          return -1;
        };
        EntityDecoder2.prototype.stateNumericDecimal = function(str, offset) {
          var startIdx = offset;
          while (offset < str.length) {
            var char = str.charCodeAt(offset);
            if (isNumber(char)) {
              offset += 1;
            } else {
              this.addToNumericResult(str, startIdx, offset, 10);
              return this.emitNumericEntity(char, 2);
            }
          }
          this.addToNumericResult(str, startIdx, offset, 10);
          return -1;
        };
        EntityDecoder2.prototype.emitNumericEntity = function(lastCp, expectedLength) {
          var _a2;
          if (this.consumed <= expectedLength) {
            (_a2 = this.errors) === null || _a2 === void 0 ? void 0 : _a2.absenceOfDigitsInNumericCharacterReference(this.consumed);
            return 0;
          }
          if (lastCp === CharCodes.SEMI) {
            this.consumed += 1;
          } else if (this.decodeMode === DecodingMode.Strict) {
            return 0;
          }
          this.emitCodePoint((0, decode_codepoint_js_1.replaceCodePoint)(this.result), this.consumed);
          if (this.errors) {
            if (lastCp !== CharCodes.SEMI) {
              this.errors.missingSemicolonAfterCharacterReference();
            }
            this.errors.validateNumericCharacterReference(this.result);
          }
          return this.consumed;
        };
        EntityDecoder2.prototype.stateNamedEntity = function(str, offset) {
          var decodeTree = this.decodeTree;
          var current = decodeTree[this.treeIndex];
          var valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
          for (; offset < str.length; offset++, this.excess++) {
            var char = str.charCodeAt(offset);
            this.treeIndex = determineBranch(decodeTree, current, this.treeIndex + Math.max(1, valueLength), char);
            if (this.treeIndex < 0) {
              return this.result === 0 || // If we are parsing an attribute
              this.decodeMode === DecodingMode.Attribute && // We shouldn't have consumed any characters after the entity,
              (valueLength === 0 || // And there should be no invalid characters.
              isEntityInAttributeInvalidEnd(char)) ? 0 : this.emitNotTerminatedNamedEntity();
            }
            current = decodeTree[this.treeIndex];
            valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
            if (valueLength !== 0) {
              if (char === CharCodes.SEMI) {
                return this.emitNamedEntityData(this.treeIndex, valueLength, this.consumed + this.excess);
              }
              if (this.decodeMode !== DecodingMode.Strict) {
                this.result = this.treeIndex;
                this.consumed += this.excess;
                this.excess = 0;
              }
            }
          }
          return -1;
        };
        EntityDecoder2.prototype.emitNotTerminatedNamedEntity = function() {
          var _a2;
          var _b = this, result2 = _b.result, decodeTree = _b.decodeTree;
          var valueLength = (decodeTree[result2] & BinTrieFlags.VALUE_LENGTH) >> 14;
          this.emitNamedEntityData(result2, valueLength, this.consumed);
          (_a2 = this.errors) === null || _a2 === void 0 ? void 0 : _a2.missingSemicolonAfterCharacterReference();
          return this.consumed;
        };
        EntityDecoder2.prototype.emitNamedEntityData = function(result2, valueLength, consumed) {
          var decodeTree = this.decodeTree;
          this.emitCodePoint(valueLength === 1 ? decodeTree[result2] & ~BinTrieFlags.VALUE_LENGTH : decodeTree[result2 + 1], consumed);
          if (valueLength === 3) {
            this.emitCodePoint(decodeTree[result2 + 2], consumed);
          }
          return consumed;
        };
        EntityDecoder2.prototype.end = function() {
          var _a2;
          switch (this.state) {
            case EntityDecoderState.NamedEntity: {
              return this.result !== 0 && (this.decodeMode !== DecodingMode.Attribute || this.result === this.treeIndex) ? this.emitNotTerminatedNamedEntity() : 0;
            }
            // Otherwise, emit a numeric entity if we have one.
            case EntityDecoderState.NumericDecimal: {
              return this.emitNumericEntity(0, 2);
            }
            case EntityDecoderState.NumericHex: {
              return this.emitNumericEntity(0, 3);
            }
            case EntityDecoderState.NumericStart: {
              (_a2 = this.errors) === null || _a2 === void 0 ? void 0 : _a2.absenceOfDigitsInNumericCharacterReference(this.consumed);
              return 0;
            }
            case EntityDecoderState.EntityStart: {
              return 0;
            }
          }
        };
        return EntityDecoder2;
      })()
    );
    exports$1.EntityDecoder = EntityDecoder;
    function getDecoder(decodeTree) {
      var ret = "";
      var decoder = new EntityDecoder(decodeTree, function(str) {
        return ret += (0, decode_codepoint_js_1.fromCodePoint)(str);
      });
      return function decodeWithTrie(str, decodeMode) {
        var lastIndex = 0;
        var offset = 0;
        while ((offset = str.indexOf("&", offset)) >= 0) {
          ret += str.slice(lastIndex, offset);
          decoder.startEntity(decodeMode);
          var len = decoder.write(
            str,
            // Skip the "&"
            offset + 1
          );
          if (len < 0) {
            lastIndex = offset + decoder.end();
            break;
          }
          lastIndex = offset + len;
          offset = len === 0 ? lastIndex + 1 : lastIndex;
        }
        var result2 = ret + str.slice(lastIndex);
        ret = "";
        return result2;
      };
    }
    function determineBranch(decodeTree, current, nodeIdx, char) {
      var branchCount = (current & BinTrieFlags.BRANCH_LENGTH) >> 7;
      var jumpOffset = current & BinTrieFlags.JUMP_TABLE;
      if (branchCount === 0) {
        return jumpOffset !== 0 && char === jumpOffset ? nodeIdx : -1;
      }
      if (jumpOffset) {
        var value = char - jumpOffset;
        return value < 0 || value >= branchCount ? -1 : decodeTree[nodeIdx + value] - 1;
      }
      var lo = nodeIdx;
      var hi = lo + branchCount - 1;
      while (lo <= hi) {
        var mid = lo + hi >>> 1;
        var midVal = decodeTree[mid];
        if (midVal < char) {
          lo = mid + 1;
        } else if (midVal > char) {
          hi = mid - 1;
        } else {
          return decodeTree[mid + branchCount];
        }
      }
      return -1;
    }
    exports$1.determineBranch = determineBranch;
    var htmlDecoder = getDecoder(decode_data_html_js_1.default);
    var xmlDecoder = getDecoder(decode_data_xml_js_1.default);
    function decodeHTML(str, mode) {
      if (mode === void 0) {
        mode = DecodingMode.Legacy;
      }
      return htmlDecoder(str, mode);
    }
    exports$1.decodeHTML = decodeHTML;
    function decodeHTMLAttribute(str) {
      return htmlDecoder(str, DecodingMode.Attribute);
    }
    exports$1.decodeHTMLAttribute = decodeHTMLAttribute;
    function decodeHTMLStrict(str) {
      return htmlDecoder(str, DecodingMode.Strict);
    }
    exports$1.decodeHTMLStrict = decodeHTMLStrict;
    function decodeXML(str) {
      return xmlDecoder(str, DecodingMode.Strict);
    }
    exports$1.decodeXML = decodeXML;
  })(decode);
  return decode;
}
var hasRequiredTokenizer;
function requireTokenizer() {
  if (hasRequiredTokenizer) return Tokenizer;
  hasRequiredTokenizer = 1;
  (function(exports$1) {
    Object.defineProperty(exports$1, "__esModule", { value: true });
    exports$1.QuoteType = void 0;
    var decode_js_1 = /* @__PURE__ */ requireDecode();
    var CharCodes;
    (function(CharCodes2) {
      CharCodes2[CharCodes2["Tab"] = 9] = "Tab";
      CharCodes2[CharCodes2["NewLine"] = 10] = "NewLine";
      CharCodes2[CharCodes2["FormFeed"] = 12] = "FormFeed";
      CharCodes2[CharCodes2["CarriageReturn"] = 13] = "CarriageReturn";
      CharCodes2[CharCodes2["Space"] = 32] = "Space";
      CharCodes2[CharCodes2["ExclamationMark"] = 33] = "ExclamationMark";
      CharCodes2[CharCodes2["Number"] = 35] = "Number";
      CharCodes2[CharCodes2["Amp"] = 38] = "Amp";
      CharCodes2[CharCodes2["SingleQuote"] = 39] = "SingleQuote";
      CharCodes2[CharCodes2["DoubleQuote"] = 34] = "DoubleQuote";
      CharCodes2[CharCodes2["Dash"] = 45] = "Dash";
      CharCodes2[CharCodes2["Slash"] = 47] = "Slash";
      CharCodes2[CharCodes2["Zero"] = 48] = "Zero";
      CharCodes2[CharCodes2["Nine"] = 57] = "Nine";
      CharCodes2[CharCodes2["Semi"] = 59] = "Semi";
      CharCodes2[CharCodes2["Lt"] = 60] = "Lt";
      CharCodes2[CharCodes2["Eq"] = 61] = "Eq";
      CharCodes2[CharCodes2["Gt"] = 62] = "Gt";
      CharCodes2[CharCodes2["Questionmark"] = 63] = "Questionmark";
      CharCodes2[CharCodes2["UpperA"] = 65] = "UpperA";
      CharCodes2[CharCodes2["LowerA"] = 97] = "LowerA";
      CharCodes2[CharCodes2["UpperF"] = 70] = "UpperF";
      CharCodes2[CharCodes2["LowerF"] = 102] = "LowerF";
      CharCodes2[CharCodes2["UpperZ"] = 90] = "UpperZ";
      CharCodes2[CharCodes2["LowerZ"] = 122] = "LowerZ";
      CharCodes2[CharCodes2["LowerX"] = 120] = "LowerX";
      CharCodes2[CharCodes2["OpeningSquareBracket"] = 91] = "OpeningSquareBracket";
    })(CharCodes || (CharCodes = {}));
    var State;
    (function(State2) {
      State2[State2["Text"] = 1] = "Text";
      State2[State2["BeforeTagName"] = 2] = "BeforeTagName";
      State2[State2["InTagName"] = 3] = "InTagName";
      State2[State2["InSelfClosingTag"] = 4] = "InSelfClosingTag";
      State2[State2["BeforeClosingTagName"] = 5] = "BeforeClosingTagName";
      State2[State2["InClosingTagName"] = 6] = "InClosingTagName";
      State2[State2["AfterClosingTagName"] = 7] = "AfterClosingTagName";
      State2[State2["BeforeAttributeName"] = 8] = "BeforeAttributeName";
      State2[State2["InAttributeName"] = 9] = "InAttributeName";
      State2[State2["AfterAttributeName"] = 10] = "AfterAttributeName";
      State2[State2["BeforeAttributeValue"] = 11] = "BeforeAttributeValue";
      State2[State2["InAttributeValueDq"] = 12] = "InAttributeValueDq";
      State2[State2["InAttributeValueSq"] = 13] = "InAttributeValueSq";
      State2[State2["InAttributeValueNq"] = 14] = "InAttributeValueNq";
      State2[State2["BeforeDeclaration"] = 15] = "BeforeDeclaration";
      State2[State2["InDeclaration"] = 16] = "InDeclaration";
      State2[State2["InProcessingInstruction"] = 17] = "InProcessingInstruction";
      State2[State2["BeforeComment"] = 18] = "BeforeComment";
      State2[State2["CDATASequence"] = 19] = "CDATASequence";
      State2[State2["InSpecialComment"] = 20] = "InSpecialComment";
      State2[State2["InCommentLike"] = 21] = "InCommentLike";
      State2[State2["BeforeSpecialS"] = 22] = "BeforeSpecialS";
      State2[State2["SpecialStartSequence"] = 23] = "SpecialStartSequence";
      State2[State2["InSpecialTag"] = 24] = "InSpecialTag";
      State2[State2["BeforeEntity"] = 25] = "BeforeEntity";
      State2[State2["BeforeNumericEntity"] = 26] = "BeforeNumericEntity";
      State2[State2["InNamedEntity"] = 27] = "InNamedEntity";
      State2[State2["InNumericEntity"] = 28] = "InNumericEntity";
      State2[State2["InHexEntity"] = 29] = "InHexEntity";
    })(State || (State = {}));
    function isWhitespace(c) {
      return c === CharCodes.Space || c === CharCodes.NewLine || c === CharCodes.Tab || c === CharCodes.FormFeed || c === CharCodes.CarriageReturn;
    }
    function isEndOfTagSection(c) {
      return c === CharCodes.Slash || c === CharCodes.Gt || isWhitespace(c);
    }
    function isNumber(c) {
      return c >= CharCodes.Zero && c <= CharCodes.Nine;
    }
    function isASCIIAlpha(c) {
      return c >= CharCodes.LowerA && c <= CharCodes.LowerZ || c >= CharCodes.UpperA && c <= CharCodes.UpperZ;
    }
    function isHexDigit(c) {
      return c >= CharCodes.UpperA && c <= CharCodes.UpperF || c >= CharCodes.LowerA && c <= CharCodes.LowerF;
    }
    var QuoteType;
    (function(QuoteType2) {
      QuoteType2[QuoteType2["NoValue"] = 0] = "NoValue";
      QuoteType2[QuoteType2["Unquoted"] = 1] = "Unquoted";
      QuoteType2[QuoteType2["Single"] = 2] = "Single";
      QuoteType2[QuoteType2["Double"] = 3] = "Double";
    })(QuoteType = exports$1.QuoteType || (exports$1.QuoteType = {}));
    var Sequences = {
      Cdata: new Uint8Array([67, 68, 65, 84, 65, 91]),
      CdataEnd: new Uint8Array([93, 93, 62]),
      CommentEnd: new Uint8Array([45, 45, 62]),
      ScriptEnd: new Uint8Array([60, 47, 115, 99, 114, 105, 112, 116]),
      StyleEnd: new Uint8Array([60, 47, 115, 116, 121, 108, 101]),
      TitleEnd: new Uint8Array([60, 47, 116, 105, 116, 108, 101])
      // `</title`
    };
    var Tokenizer2 = (
      /** @class */
      (function() {
        function Tokenizer3(_a2, cbs) {
          var _b = _a2.xmlMode, xmlMode = _b === void 0 ? false : _b, _c = _a2.decodeEntities, decodeEntities = _c === void 0 ? true : _c;
          this.cbs = cbs;
          this.state = State.Text;
          this.buffer = "";
          this.sectionStart = 0;
          this.index = 0;
          this.baseState = State.Text;
          this.isSpecial = false;
          this.running = true;
          this.offset = 0;
          this.currentSequence = void 0;
          this.sequenceIndex = 0;
          this.trieIndex = 0;
          this.trieCurrent = 0;
          this.entityResult = 0;
          this.entityExcess = 0;
          this.xmlMode = xmlMode;
          this.decodeEntities = decodeEntities;
          this.entityTrie = xmlMode ? decode_js_1.xmlDecodeTree : decode_js_1.htmlDecodeTree;
        }
        Tokenizer3.prototype.reset = function() {
          this.state = State.Text;
          this.buffer = "";
          this.sectionStart = 0;
          this.index = 0;
          this.baseState = State.Text;
          this.currentSequence = void 0;
          this.running = true;
          this.offset = 0;
        };
        Tokenizer3.prototype.write = function(chunk) {
          this.offset += this.buffer.length;
          this.buffer = chunk;
          this.parse();
        };
        Tokenizer3.prototype.end = function() {
          if (this.running)
            this.finish();
        };
        Tokenizer3.prototype.pause = function() {
          this.running = false;
        };
        Tokenizer3.prototype.resume = function() {
          this.running = true;
          if (this.index < this.buffer.length + this.offset) {
            this.parse();
          }
        };
        Tokenizer3.prototype.getIndex = function() {
          return this.index;
        };
        Tokenizer3.prototype.getSectionStart = function() {
          return this.sectionStart;
        };
        Tokenizer3.prototype.stateText = function(c) {
          if (c === CharCodes.Lt || !this.decodeEntities && this.fastForwardTo(CharCodes.Lt)) {
            if (this.index > this.sectionStart) {
              this.cbs.ontext(this.sectionStart, this.index);
            }
            this.state = State.BeforeTagName;
            this.sectionStart = this.index;
          } else if (this.decodeEntities && c === CharCodes.Amp) {
            this.state = State.BeforeEntity;
          }
        };
        Tokenizer3.prototype.stateSpecialStartSequence = function(c) {
          var isEnd = this.sequenceIndex === this.currentSequence.length;
          var isMatch = isEnd ? (
            // If we are at the end of the sequence, make sure the tag name has ended
            isEndOfTagSection(c)
          ) : (
            // Otherwise, do a case-insensitive comparison
            (c | 32) === this.currentSequence[this.sequenceIndex]
          );
          if (!isMatch) {
            this.isSpecial = false;
          } else if (!isEnd) {
            this.sequenceIndex++;
            return;
          }
          this.sequenceIndex = 0;
          this.state = State.InTagName;
          this.stateInTagName(c);
        };
        Tokenizer3.prototype.stateInSpecialTag = function(c) {
          if (this.sequenceIndex === this.currentSequence.length) {
            if (c === CharCodes.Gt || isWhitespace(c)) {
              var endOfText = this.index - this.currentSequence.length;
              if (this.sectionStart < endOfText) {
                var actualIndex = this.index;
                this.index = endOfText;
                this.cbs.ontext(this.sectionStart, endOfText);
                this.index = actualIndex;
              }
              this.isSpecial = false;
              this.sectionStart = endOfText + 2;
              this.stateInClosingTagName(c);
              return;
            }
            this.sequenceIndex = 0;
          }
          if ((c | 32) === this.currentSequence[this.sequenceIndex]) {
            this.sequenceIndex += 1;
          } else if (this.sequenceIndex === 0) {
            if (this.currentSequence === Sequences.TitleEnd) {
              if (this.decodeEntities && c === CharCodes.Amp) {
                this.state = State.BeforeEntity;
              }
            } else if (this.fastForwardTo(CharCodes.Lt)) {
              this.sequenceIndex = 1;
            }
          } else {
            this.sequenceIndex = Number(c === CharCodes.Lt);
          }
        };
        Tokenizer3.prototype.stateCDATASequence = function(c) {
          if (c === Sequences.Cdata[this.sequenceIndex]) {
            if (++this.sequenceIndex === Sequences.Cdata.length) {
              this.state = State.InCommentLike;
              this.currentSequence = Sequences.CdataEnd;
              this.sequenceIndex = 0;
              this.sectionStart = this.index + 1;
            }
          } else {
            this.sequenceIndex = 0;
            this.state = State.InDeclaration;
            this.stateInDeclaration(c);
          }
        };
        Tokenizer3.prototype.fastForwardTo = function(c) {
          while (++this.index < this.buffer.length + this.offset) {
            if (this.buffer.charCodeAt(this.index - this.offset) === c) {
              return true;
            }
          }
          this.index = this.buffer.length + this.offset - 1;
          return false;
        };
        Tokenizer3.prototype.stateInCommentLike = function(c) {
          if (c === this.currentSequence[this.sequenceIndex]) {
            if (++this.sequenceIndex === this.currentSequence.length) {
              if (this.currentSequence === Sequences.CdataEnd) {
                this.cbs.oncdata(this.sectionStart, this.index, 2);
              } else {
                this.cbs.oncomment(this.sectionStart, this.index, 2);
              }
              this.sequenceIndex = 0;
              this.sectionStart = this.index + 1;
              this.state = State.Text;
            }
          } else if (this.sequenceIndex === 0) {
            if (this.fastForwardTo(this.currentSequence[0])) {
              this.sequenceIndex = 1;
            }
          } else if (c !== this.currentSequence[this.sequenceIndex - 1]) {
            this.sequenceIndex = 0;
          }
        };
        Tokenizer3.prototype.isTagStartChar = function(c) {
          return this.xmlMode ? !isEndOfTagSection(c) : isASCIIAlpha(c);
        };
        Tokenizer3.prototype.startSpecial = function(sequence, offset) {
          this.isSpecial = true;
          this.currentSequence = sequence;
          this.sequenceIndex = offset;
          this.state = State.SpecialStartSequence;
        };
        Tokenizer3.prototype.stateBeforeTagName = function(c) {
          if (c === CharCodes.ExclamationMark) {
            this.state = State.BeforeDeclaration;
            this.sectionStart = this.index + 1;
          } else if (c === CharCodes.Questionmark) {
            this.state = State.InProcessingInstruction;
            this.sectionStart = this.index + 1;
          } else if (this.isTagStartChar(c)) {
            var lower = c | 32;
            this.sectionStart = this.index;
            if (!this.xmlMode && lower === Sequences.TitleEnd[2]) {
              this.startSpecial(Sequences.TitleEnd, 3);
            } else {
              this.state = !this.xmlMode && lower === Sequences.ScriptEnd[2] ? State.BeforeSpecialS : State.InTagName;
            }
          } else if (c === CharCodes.Slash) {
            this.state = State.BeforeClosingTagName;
          } else {
            this.state = State.Text;
            this.stateText(c);
          }
        };
        Tokenizer3.prototype.stateInTagName = function(c) {
          if (isEndOfTagSection(c)) {
            this.cbs.onopentagname(this.sectionStart, this.index);
            this.sectionStart = -1;
            this.state = State.BeforeAttributeName;
            this.stateBeforeAttributeName(c);
          }
        };
        Tokenizer3.prototype.stateBeforeClosingTagName = function(c) {
          if (isWhitespace(c)) ;
          else if (c === CharCodes.Gt) {
            this.state = State.Text;
          } else {
            this.state = this.isTagStartChar(c) ? State.InClosingTagName : State.InSpecialComment;
            this.sectionStart = this.index;
          }
        };
        Tokenizer3.prototype.stateInClosingTagName = function(c) {
          if (c === CharCodes.Gt || isWhitespace(c)) {
            this.cbs.onclosetag(this.sectionStart, this.index);
            this.sectionStart = -1;
            this.state = State.AfterClosingTagName;
            this.stateAfterClosingTagName(c);
          }
        };
        Tokenizer3.prototype.stateAfterClosingTagName = function(c) {
          if (c === CharCodes.Gt || this.fastForwardTo(CharCodes.Gt)) {
            this.state = State.Text;
            this.baseState = State.Text;
            this.sectionStart = this.index + 1;
          }
        };
        Tokenizer3.prototype.stateBeforeAttributeName = function(c) {
          if (c === CharCodes.Gt) {
            this.cbs.onopentagend(this.index);
            if (this.isSpecial) {
              this.state = State.InSpecialTag;
              this.sequenceIndex = 0;
            } else {
              this.state = State.Text;
            }
            this.baseState = this.state;
            this.sectionStart = this.index + 1;
          } else if (c === CharCodes.Slash) {
            this.state = State.InSelfClosingTag;
          } else if (!isWhitespace(c)) {
            this.state = State.InAttributeName;
            this.sectionStart = this.index;
          }
        };
        Tokenizer3.prototype.stateInSelfClosingTag = function(c) {
          if (c === CharCodes.Gt) {
            this.cbs.onselfclosingtag(this.index);
            this.state = State.Text;
            this.baseState = State.Text;
            this.sectionStart = this.index + 1;
            this.isSpecial = false;
          } else if (!isWhitespace(c)) {
            this.state = State.BeforeAttributeName;
            this.stateBeforeAttributeName(c);
          }
        };
        Tokenizer3.prototype.stateInAttributeName = function(c) {
          if (c === CharCodes.Eq || isEndOfTagSection(c)) {
            this.cbs.onattribname(this.sectionStart, this.index);
            this.sectionStart = -1;
            this.state = State.AfterAttributeName;
            this.stateAfterAttributeName(c);
          }
        };
        Tokenizer3.prototype.stateAfterAttributeName = function(c) {
          if (c === CharCodes.Eq) {
            this.state = State.BeforeAttributeValue;
          } else if (c === CharCodes.Slash || c === CharCodes.Gt) {
            this.cbs.onattribend(QuoteType.NoValue, this.index);
            this.state = State.BeforeAttributeName;
            this.stateBeforeAttributeName(c);
          } else if (!isWhitespace(c)) {
            this.cbs.onattribend(QuoteType.NoValue, this.index);
            this.state = State.InAttributeName;
            this.sectionStart = this.index;
          }
        };
        Tokenizer3.prototype.stateBeforeAttributeValue = function(c) {
          if (c === CharCodes.DoubleQuote) {
            this.state = State.InAttributeValueDq;
            this.sectionStart = this.index + 1;
          } else if (c === CharCodes.SingleQuote) {
            this.state = State.InAttributeValueSq;
            this.sectionStart = this.index + 1;
          } else if (!isWhitespace(c)) {
            this.sectionStart = this.index;
            this.state = State.InAttributeValueNq;
            this.stateInAttributeValueNoQuotes(c);
          }
        };
        Tokenizer3.prototype.handleInAttributeValue = function(c, quote) {
          if (c === quote || !this.decodeEntities && this.fastForwardTo(quote)) {
            this.cbs.onattribdata(this.sectionStart, this.index);
            this.sectionStart = -1;
            this.cbs.onattribend(quote === CharCodes.DoubleQuote ? QuoteType.Double : QuoteType.Single, this.index);
            this.state = State.BeforeAttributeName;
          } else if (this.decodeEntities && c === CharCodes.Amp) {
            this.baseState = this.state;
            this.state = State.BeforeEntity;
          }
        };
        Tokenizer3.prototype.stateInAttributeValueDoubleQuotes = function(c) {
          this.handleInAttributeValue(c, CharCodes.DoubleQuote);
        };
        Tokenizer3.prototype.stateInAttributeValueSingleQuotes = function(c) {
          this.handleInAttributeValue(c, CharCodes.SingleQuote);
        };
        Tokenizer3.prototype.stateInAttributeValueNoQuotes = function(c) {
          if (isWhitespace(c) || c === CharCodes.Gt) {
            this.cbs.onattribdata(this.sectionStart, this.index);
            this.sectionStart = -1;
            this.cbs.onattribend(QuoteType.Unquoted, this.index);
            this.state = State.BeforeAttributeName;
            this.stateBeforeAttributeName(c);
          } else if (this.decodeEntities && c === CharCodes.Amp) {
            this.baseState = this.state;
            this.state = State.BeforeEntity;
          }
        };
        Tokenizer3.prototype.stateBeforeDeclaration = function(c) {
          if (c === CharCodes.OpeningSquareBracket) {
            this.state = State.CDATASequence;
            this.sequenceIndex = 0;
          } else {
            this.state = c === CharCodes.Dash ? State.BeforeComment : State.InDeclaration;
          }
        };
        Tokenizer3.prototype.stateInDeclaration = function(c) {
          if (c === CharCodes.Gt || this.fastForwardTo(CharCodes.Gt)) {
            this.cbs.ondeclaration(this.sectionStart, this.index);
            this.state = State.Text;
            this.sectionStart = this.index + 1;
          }
        };
        Tokenizer3.prototype.stateInProcessingInstruction = function(c) {
          if (c === CharCodes.Gt || this.fastForwardTo(CharCodes.Gt)) {
            this.cbs.onprocessinginstruction(this.sectionStart, this.index);
            this.state = State.Text;
            this.sectionStart = this.index + 1;
          }
        };
        Tokenizer3.prototype.stateBeforeComment = function(c) {
          if (c === CharCodes.Dash) {
            this.state = State.InCommentLike;
            this.currentSequence = Sequences.CommentEnd;
            this.sequenceIndex = 2;
            this.sectionStart = this.index + 1;
          } else {
            this.state = State.InDeclaration;
          }
        };
        Tokenizer3.prototype.stateInSpecialComment = function(c) {
          if (c === CharCodes.Gt || this.fastForwardTo(CharCodes.Gt)) {
            this.cbs.oncomment(this.sectionStart, this.index, 0);
            this.state = State.Text;
            this.sectionStart = this.index + 1;
          }
        };
        Tokenizer3.prototype.stateBeforeSpecialS = function(c) {
          var lower = c | 32;
          if (lower === Sequences.ScriptEnd[3]) {
            this.startSpecial(Sequences.ScriptEnd, 4);
          } else if (lower === Sequences.StyleEnd[3]) {
            this.startSpecial(Sequences.StyleEnd, 4);
          } else {
            this.state = State.InTagName;
            this.stateInTagName(c);
          }
        };
        Tokenizer3.prototype.stateBeforeEntity = function(c) {
          this.entityExcess = 1;
          this.entityResult = 0;
          if (c === CharCodes.Number) {
            this.state = State.BeforeNumericEntity;
          } else if (c === CharCodes.Amp) ;
          else {
            this.trieIndex = 0;
            this.trieCurrent = this.entityTrie[0];
            this.state = State.InNamedEntity;
            this.stateInNamedEntity(c);
          }
        };
        Tokenizer3.prototype.stateInNamedEntity = function(c) {
          this.entityExcess += 1;
          this.trieIndex = (0, decode_js_1.determineBranch)(this.entityTrie, this.trieCurrent, this.trieIndex + 1, c);
          if (this.trieIndex < 0) {
            this.emitNamedEntity();
            this.index--;
            return;
          }
          this.trieCurrent = this.entityTrie[this.trieIndex];
          var masked = this.trieCurrent & decode_js_1.BinTrieFlags.VALUE_LENGTH;
          if (masked) {
            var valueLength = (masked >> 14) - 1;
            if (!this.allowLegacyEntity() && c !== CharCodes.Semi) {
              this.trieIndex += valueLength;
            } else {
              var entityStart = this.index - this.entityExcess + 1;
              if (entityStart > this.sectionStart) {
                this.emitPartial(this.sectionStart, entityStart);
              }
              this.entityResult = this.trieIndex;
              this.trieIndex += valueLength;
              this.entityExcess = 0;
              this.sectionStart = this.index + 1;
              if (valueLength === 0) {
                this.emitNamedEntity();
              }
            }
          }
        };
        Tokenizer3.prototype.emitNamedEntity = function() {
          this.state = this.baseState;
          if (this.entityResult === 0) {
            return;
          }
          var valueLength = (this.entityTrie[this.entityResult] & decode_js_1.BinTrieFlags.VALUE_LENGTH) >> 14;
          switch (valueLength) {
            case 1: {
              this.emitCodePoint(this.entityTrie[this.entityResult] & ~decode_js_1.BinTrieFlags.VALUE_LENGTH);
              break;
            }
            case 2: {
              this.emitCodePoint(this.entityTrie[this.entityResult + 1]);
              break;
            }
            case 3: {
              this.emitCodePoint(this.entityTrie[this.entityResult + 1]);
              this.emitCodePoint(this.entityTrie[this.entityResult + 2]);
            }
          }
        };
        Tokenizer3.prototype.stateBeforeNumericEntity = function(c) {
          if ((c | 32) === CharCodes.LowerX) {
            this.entityExcess++;
            this.state = State.InHexEntity;
          } else {
            this.state = State.InNumericEntity;
            this.stateInNumericEntity(c);
          }
        };
        Tokenizer3.prototype.emitNumericEntity = function(strict) {
          var entityStart = this.index - this.entityExcess - 1;
          var numberStart = entityStart + 2 + Number(this.state === State.InHexEntity);
          if (numberStart !== this.index) {
            if (entityStart > this.sectionStart) {
              this.emitPartial(this.sectionStart, entityStart);
            }
            this.sectionStart = this.index + Number(strict);
            this.emitCodePoint((0, decode_js_1.replaceCodePoint)(this.entityResult));
          }
          this.state = this.baseState;
        };
        Tokenizer3.prototype.stateInNumericEntity = function(c) {
          if (c === CharCodes.Semi) {
            this.emitNumericEntity(true);
          } else if (isNumber(c)) {
            this.entityResult = this.entityResult * 10 + (c - CharCodes.Zero);
            this.entityExcess++;
          } else {
            if (this.allowLegacyEntity()) {
              this.emitNumericEntity(false);
            } else {
              this.state = this.baseState;
            }
            this.index--;
          }
        };
        Tokenizer3.prototype.stateInHexEntity = function(c) {
          if (c === CharCodes.Semi) {
            this.emitNumericEntity(true);
          } else if (isNumber(c)) {
            this.entityResult = this.entityResult * 16 + (c - CharCodes.Zero);
            this.entityExcess++;
          } else if (isHexDigit(c)) {
            this.entityResult = this.entityResult * 16 + ((c | 32) - CharCodes.LowerA + 10);
            this.entityExcess++;
          } else {
            if (this.allowLegacyEntity()) {
              this.emitNumericEntity(false);
            } else {
              this.state = this.baseState;
            }
            this.index--;
          }
        };
        Tokenizer3.prototype.allowLegacyEntity = function() {
          return !this.xmlMode && (this.baseState === State.Text || this.baseState === State.InSpecialTag);
        };
        Tokenizer3.prototype.cleanup = function() {
          if (this.running && this.sectionStart !== this.index) {
            if (this.state === State.Text || this.state === State.InSpecialTag && this.sequenceIndex === 0) {
              this.cbs.ontext(this.sectionStart, this.index);
              this.sectionStart = this.index;
            } else if (this.state === State.InAttributeValueDq || this.state === State.InAttributeValueSq || this.state === State.InAttributeValueNq) {
              this.cbs.onattribdata(this.sectionStart, this.index);
              this.sectionStart = this.index;
            }
          }
        };
        Tokenizer3.prototype.shouldContinue = function() {
          return this.index < this.buffer.length + this.offset && this.running;
        };
        Tokenizer3.prototype.parse = function() {
          while (this.shouldContinue()) {
            var c = this.buffer.charCodeAt(this.index - this.offset);
            switch (this.state) {
              case State.Text: {
                this.stateText(c);
                break;
              }
              case State.SpecialStartSequence: {
                this.stateSpecialStartSequence(c);
                break;
              }
              case State.InSpecialTag: {
                this.stateInSpecialTag(c);
                break;
              }
              case State.CDATASequence: {
                this.stateCDATASequence(c);
                break;
              }
              case State.InAttributeValueDq: {
                this.stateInAttributeValueDoubleQuotes(c);
                break;
              }
              case State.InAttributeName: {
                this.stateInAttributeName(c);
                break;
              }
              case State.InCommentLike: {
                this.stateInCommentLike(c);
                break;
              }
              case State.InSpecialComment: {
                this.stateInSpecialComment(c);
                break;
              }
              case State.BeforeAttributeName: {
                this.stateBeforeAttributeName(c);
                break;
              }
              case State.InTagName: {
                this.stateInTagName(c);
                break;
              }
              case State.InClosingTagName: {
                this.stateInClosingTagName(c);
                break;
              }
              case State.BeforeTagName: {
                this.stateBeforeTagName(c);
                break;
              }
              case State.AfterAttributeName: {
                this.stateAfterAttributeName(c);
                break;
              }
              case State.InAttributeValueSq: {
                this.stateInAttributeValueSingleQuotes(c);
                break;
              }
              case State.BeforeAttributeValue: {
                this.stateBeforeAttributeValue(c);
                break;
              }
              case State.BeforeClosingTagName: {
                this.stateBeforeClosingTagName(c);
                break;
              }
              case State.AfterClosingTagName: {
                this.stateAfterClosingTagName(c);
                break;
              }
              case State.BeforeSpecialS: {
                this.stateBeforeSpecialS(c);
                break;
              }
              case State.InAttributeValueNq: {
                this.stateInAttributeValueNoQuotes(c);
                break;
              }
              case State.InSelfClosingTag: {
                this.stateInSelfClosingTag(c);
                break;
              }
              case State.InDeclaration: {
                this.stateInDeclaration(c);
                break;
              }
              case State.BeforeDeclaration: {
                this.stateBeforeDeclaration(c);
                break;
              }
              case State.BeforeComment: {
                this.stateBeforeComment(c);
                break;
              }
              case State.InProcessingInstruction: {
                this.stateInProcessingInstruction(c);
                break;
              }
              case State.InNamedEntity: {
                this.stateInNamedEntity(c);
                break;
              }
              case State.BeforeEntity: {
                this.stateBeforeEntity(c);
                break;
              }
              case State.InHexEntity: {
                this.stateInHexEntity(c);
                break;
              }
              case State.InNumericEntity: {
                this.stateInNumericEntity(c);
                break;
              }
              default: {
                this.stateBeforeNumericEntity(c);
              }
            }
            this.index++;
          }
          this.cleanup();
        };
        Tokenizer3.prototype.finish = function() {
          if (this.state === State.InNamedEntity) {
            this.emitNamedEntity();
          }
          if (this.sectionStart < this.index) {
            this.handleTrailingData();
          }
          this.cbs.onend();
        };
        Tokenizer3.prototype.handleTrailingData = function() {
          var endIndex = this.buffer.length + this.offset;
          if (this.state === State.InCommentLike) {
            if (this.currentSequence === Sequences.CdataEnd) {
              this.cbs.oncdata(this.sectionStart, endIndex, 0);
            } else {
              this.cbs.oncomment(this.sectionStart, endIndex, 0);
            }
          } else if (this.state === State.InNumericEntity && this.allowLegacyEntity()) {
            this.emitNumericEntity(false);
          } else if (this.state === State.InHexEntity && this.allowLegacyEntity()) {
            this.emitNumericEntity(false);
          } else if (this.state === State.InTagName || this.state === State.BeforeAttributeName || this.state === State.BeforeAttributeValue || this.state === State.AfterAttributeName || this.state === State.InAttributeName || this.state === State.InAttributeValueSq || this.state === State.InAttributeValueDq || this.state === State.InAttributeValueNq || this.state === State.InClosingTagName) ;
          else {
            this.cbs.ontext(this.sectionStart, endIndex);
          }
        };
        Tokenizer3.prototype.emitPartial = function(start, endIndex) {
          if (this.baseState !== State.Text && this.baseState !== State.InSpecialTag) {
            this.cbs.onattribdata(start, endIndex);
          } else {
            this.cbs.ontext(start, endIndex);
          }
        };
        Tokenizer3.prototype.emitCodePoint = function(cp) {
          if (this.baseState !== State.Text && this.baseState !== State.InSpecialTag) {
            this.cbs.onattribentity(cp);
          } else {
            this.cbs.ontextentity(cp);
          }
        };
        return Tokenizer3;
      })()
    );
    exports$1.default = Tokenizer2;
  })(Tokenizer);
  return Tokenizer;
}
var hasRequiredParser$1;
function requireParser$1() {
  if (hasRequiredParser$1) return Parser;
  hasRequiredParser$1 = 1;
  var __createBinding = Parser && Parser.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = Parser && Parser.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = Parser && Parser.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result2 = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
    }
    __setModuleDefault(result2, mod);
    return result2;
  };
  Object.defineProperty(Parser, "__esModule", { value: true });
  Parser.Parser = void 0;
  var Tokenizer_js_1 = __importStar(/* @__PURE__ */ requireTokenizer());
  var decode_js_1 = /* @__PURE__ */ requireDecode();
  var formTags = /* @__PURE__ */ new Set([
    "input",
    "option",
    "optgroup",
    "select",
    "button",
    "datalist",
    "textarea"
  ]);
  var pTag = /* @__PURE__ */ new Set(["p"]);
  var tableSectionTags = /* @__PURE__ */ new Set(["thead", "tbody"]);
  var ddtTags = /* @__PURE__ */ new Set(["dd", "dt"]);
  var rtpTags = /* @__PURE__ */ new Set(["rt", "rp"]);
  var openImpliesClose = /* @__PURE__ */ new Map([
    ["tr", /* @__PURE__ */ new Set(["tr", "th", "td"])],
    ["th", /* @__PURE__ */ new Set(["th"])],
    ["td", /* @__PURE__ */ new Set(["thead", "th", "td"])],
    ["body", /* @__PURE__ */ new Set(["head", "link", "script"])],
    ["li", /* @__PURE__ */ new Set(["li"])],
    ["p", pTag],
    ["h1", pTag],
    ["h2", pTag],
    ["h3", pTag],
    ["h4", pTag],
    ["h5", pTag],
    ["h6", pTag],
    ["select", formTags],
    ["input", formTags],
    ["output", formTags],
    ["button", formTags],
    ["datalist", formTags],
    ["textarea", formTags],
    ["option", /* @__PURE__ */ new Set(["option"])],
    ["optgroup", /* @__PURE__ */ new Set(["optgroup", "option"])],
    ["dd", ddtTags],
    ["dt", ddtTags],
    ["address", pTag],
    ["article", pTag],
    ["aside", pTag],
    ["blockquote", pTag],
    ["details", pTag],
    ["div", pTag],
    ["dl", pTag],
    ["fieldset", pTag],
    ["figcaption", pTag],
    ["figure", pTag],
    ["footer", pTag],
    ["form", pTag],
    ["header", pTag],
    ["hr", pTag],
    ["main", pTag],
    ["nav", pTag],
    ["ol", pTag],
    ["pre", pTag],
    ["section", pTag],
    ["table", pTag],
    ["ul", pTag],
    ["rt", rtpTags],
    ["rp", rtpTags],
    ["tbody", tableSectionTags],
    ["tfoot", tableSectionTags]
  ]);
  var voidElements = /* @__PURE__ */ new Set([
    "area",
    "base",
    "basefont",
    "br",
    "col",
    "command",
    "embed",
    "frame",
    "hr",
    "img",
    "input",
    "isindex",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr"
  ]);
  var foreignContextElements = /* @__PURE__ */ new Set(["math", "svg"]);
  var htmlIntegrationElements = /* @__PURE__ */ new Set([
    "mi",
    "mo",
    "mn",
    "ms",
    "mtext",
    "annotation-xml",
    "foreignobject",
    "desc",
    "title"
  ]);
  var reNameEnd = /\s|\//;
  var Parser$1 = (
    /** @class */
    (function() {
      function Parser2(cbs, options) {
        if (options === void 0) {
          options = {};
        }
        var _a2, _b, _c, _d, _e;
        this.options = options;
        this.startIndex = 0;
        this.endIndex = 0;
        this.openTagStart = 0;
        this.tagname = "";
        this.attribname = "";
        this.attribvalue = "";
        this.attribs = null;
        this.stack = [];
        this.foreignContext = [];
        this.buffers = [];
        this.bufferOffset = 0;
        this.writeIndex = 0;
        this.ended = false;
        this.cbs = cbs !== null && cbs !== void 0 ? cbs : {};
        this.lowerCaseTagNames = (_a2 = options.lowerCaseTags) !== null && _a2 !== void 0 ? _a2 : !options.xmlMode;
        this.lowerCaseAttributeNames = (_b = options.lowerCaseAttributeNames) !== null && _b !== void 0 ? _b : !options.xmlMode;
        this.tokenizer = new ((_c = options.Tokenizer) !== null && _c !== void 0 ? _c : Tokenizer_js_1.default)(this.options, this);
        (_e = (_d = this.cbs).onparserinit) === null || _e === void 0 ? void 0 : _e.call(_d, this);
      }
      Parser2.prototype.ontext = function(start, endIndex) {
        var _a2, _b;
        var data = this.getSlice(start, endIndex);
        this.endIndex = endIndex - 1;
        (_b = (_a2 = this.cbs).ontext) === null || _b === void 0 ? void 0 : _b.call(_a2, data);
        this.startIndex = endIndex;
      };
      Parser2.prototype.ontextentity = function(cp) {
        var _a2, _b;
        var index = this.tokenizer.getSectionStart();
        this.endIndex = index - 1;
        (_b = (_a2 = this.cbs).ontext) === null || _b === void 0 ? void 0 : _b.call(_a2, (0, decode_js_1.fromCodePoint)(cp));
        this.startIndex = index;
      };
      Parser2.prototype.isVoidElement = function(name) {
        return !this.options.xmlMode && voidElements.has(name);
      };
      Parser2.prototype.onopentagname = function(start, endIndex) {
        this.endIndex = endIndex;
        var name = this.getSlice(start, endIndex);
        if (this.lowerCaseTagNames) {
          name = name.toLowerCase();
        }
        this.emitOpenTag(name);
      };
      Parser2.prototype.emitOpenTag = function(name) {
        var _a2, _b, _c, _d;
        this.openTagStart = this.startIndex;
        this.tagname = name;
        var impliesClose = !this.options.xmlMode && openImpliesClose.get(name);
        if (impliesClose) {
          while (this.stack.length > 0 && impliesClose.has(this.stack[this.stack.length - 1])) {
            var element = this.stack.pop();
            (_b = (_a2 = this.cbs).onclosetag) === null || _b === void 0 ? void 0 : _b.call(_a2, element, true);
          }
        }
        if (!this.isVoidElement(name)) {
          this.stack.push(name);
          if (foreignContextElements.has(name)) {
            this.foreignContext.push(true);
          } else if (htmlIntegrationElements.has(name)) {
            this.foreignContext.push(false);
          }
        }
        (_d = (_c = this.cbs).onopentagname) === null || _d === void 0 ? void 0 : _d.call(_c, name);
        if (this.cbs.onopentag)
          this.attribs = {};
      };
      Parser2.prototype.endOpenTag = function(isImplied) {
        var _a2, _b;
        this.startIndex = this.openTagStart;
        if (this.attribs) {
          (_b = (_a2 = this.cbs).onopentag) === null || _b === void 0 ? void 0 : _b.call(_a2, this.tagname, this.attribs, isImplied);
          this.attribs = null;
        }
        if (this.cbs.onclosetag && this.isVoidElement(this.tagname)) {
          this.cbs.onclosetag(this.tagname, true);
        }
        this.tagname = "";
      };
      Parser2.prototype.onopentagend = function(endIndex) {
        this.endIndex = endIndex;
        this.endOpenTag(false);
        this.startIndex = endIndex + 1;
      };
      Parser2.prototype.onclosetag = function(start, endIndex) {
        var _a2, _b, _c, _d, _e, _f;
        this.endIndex = endIndex;
        var name = this.getSlice(start, endIndex);
        if (this.lowerCaseTagNames) {
          name = name.toLowerCase();
        }
        if (foreignContextElements.has(name) || htmlIntegrationElements.has(name)) {
          this.foreignContext.pop();
        }
        if (!this.isVoidElement(name)) {
          var pos = this.stack.lastIndexOf(name);
          if (pos !== -1) {
            if (this.cbs.onclosetag) {
              var count = this.stack.length - pos;
              while (count--) {
                this.cbs.onclosetag(this.stack.pop(), count !== 0);
              }
            } else
              this.stack.length = pos;
          } else if (!this.options.xmlMode && name === "p") {
            this.emitOpenTag("p");
            this.closeCurrentTag(true);
          }
        } else if (!this.options.xmlMode && name === "br") {
          (_b = (_a2 = this.cbs).onopentagname) === null || _b === void 0 ? void 0 : _b.call(_a2, "br");
          (_d = (_c = this.cbs).onopentag) === null || _d === void 0 ? void 0 : _d.call(_c, "br", {}, true);
          (_f = (_e = this.cbs).onclosetag) === null || _f === void 0 ? void 0 : _f.call(_e, "br", false);
        }
        this.startIndex = endIndex + 1;
      };
      Parser2.prototype.onselfclosingtag = function(endIndex) {
        this.endIndex = endIndex;
        if (this.options.xmlMode || this.options.recognizeSelfClosing || this.foreignContext[this.foreignContext.length - 1]) {
          this.closeCurrentTag(false);
          this.startIndex = endIndex + 1;
        } else {
          this.onopentagend(endIndex);
        }
      };
      Parser2.prototype.closeCurrentTag = function(isOpenImplied) {
        var _a2, _b;
        var name = this.tagname;
        this.endOpenTag(isOpenImplied);
        if (this.stack[this.stack.length - 1] === name) {
          (_b = (_a2 = this.cbs).onclosetag) === null || _b === void 0 ? void 0 : _b.call(_a2, name, !isOpenImplied);
          this.stack.pop();
        }
      };
      Parser2.prototype.onattribname = function(start, endIndex) {
        this.startIndex = start;
        var name = this.getSlice(start, endIndex);
        this.attribname = this.lowerCaseAttributeNames ? name.toLowerCase() : name;
      };
      Parser2.prototype.onattribdata = function(start, endIndex) {
        this.attribvalue += this.getSlice(start, endIndex);
      };
      Parser2.prototype.onattribentity = function(cp) {
        this.attribvalue += (0, decode_js_1.fromCodePoint)(cp);
      };
      Parser2.prototype.onattribend = function(quote, endIndex) {
        var _a2, _b;
        this.endIndex = endIndex;
        (_b = (_a2 = this.cbs).onattribute) === null || _b === void 0 ? void 0 : _b.call(_a2, this.attribname, this.attribvalue, quote === Tokenizer_js_1.QuoteType.Double ? '"' : quote === Tokenizer_js_1.QuoteType.Single ? "'" : quote === Tokenizer_js_1.QuoteType.NoValue ? void 0 : null);
        if (this.attribs && !Object.prototype.hasOwnProperty.call(this.attribs, this.attribname)) {
          this.attribs[this.attribname] = this.attribvalue;
        }
        this.attribvalue = "";
      };
      Parser2.prototype.getInstructionName = function(value) {
        var index = value.search(reNameEnd);
        var name = index < 0 ? value : value.substr(0, index);
        if (this.lowerCaseTagNames) {
          name = name.toLowerCase();
        }
        return name;
      };
      Parser2.prototype.ondeclaration = function(start, endIndex) {
        this.endIndex = endIndex;
        var value = this.getSlice(start, endIndex);
        if (this.cbs.onprocessinginstruction) {
          var name = this.getInstructionName(value);
          this.cbs.onprocessinginstruction("!".concat(name), "!".concat(value));
        }
        this.startIndex = endIndex + 1;
      };
      Parser2.prototype.onprocessinginstruction = function(start, endIndex) {
        this.endIndex = endIndex;
        var value = this.getSlice(start, endIndex);
        if (this.cbs.onprocessinginstruction) {
          var name = this.getInstructionName(value);
          this.cbs.onprocessinginstruction("?".concat(name), "?".concat(value));
        }
        this.startIndex = endIndex + 1;
      };
      Parser2.prototype.oncomment = function(start, endIndex, offset) {
        var _a2, _b, _c, _d;
        this.endIndex = endIndex;
        (_b = (_a2 = this.cbs).oncomment) === null || _b === void 0 ? void 0 : _b.call(_a2, this.getSlice(start, endIndex - offset));
        (_d = (_c = this.cbs).oncommentend) === null || _d === void 0 ? void 0 : _d.call(_c);
        this.startIndex = endIndex + 1;
      };
      Parser2.prototype.oncdata = function(start, endIndex, offset) {
        var _a2, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        this.endIndex = endIndex;
        var value = this.getSlice(start, endIndex - offset);
        if (this.options.xmlMode || this.options.recognizeCDATA) {
          (_b = (_a2 = this.cbs).oncdatastart) === null || _b === void 0 ? void 0 : _b.call(_a2);
          (_d = (_c = this.cbs).ontext) === null || _d === void 0 ? void 0 : _d.call(_c, value);
          (_f = (_e = this.cbs).oncdataend) === null || _f === void 0 ? void 0 : _f.call(_e);
        } else {
          (_h = (_g = this.cbs).oncomment) === null || _h === void 0 ? void 0 : _h.call(_g, "[CDATA[".concat(value, "]]"));
          (_k = (_j = this.cbs).oncommentend) === null || _k === void 0 ? void 0 : _k.call(_j);
        }
        this.startIndex = endIndex + 1;
      };
      Parser2.prototype.onend = function() {
        var _a2, _b;
        if (this.cbs.onclosetag) {
          this.endIndex = this.startIndex;
          for (var index = this.stack.length; index > 0; this.cbs.onclosetag(this.stack[--index], true))
            ;
        }
        (_b = (_a2 = this.cbs).onend) === null || _b === void 0 ? void 0 : _b.call(_a2);
      };
      Parser2.prototype.reset = function() {
        var _a2, _b, _c, _d;
        (_b = (_a2 = this.cbs).onreset) === null || _b === void 0 ? void 0 : _b.call(_a2);
        this.tokenizer.reset();
        this.tagname = "";
        this.attribname = "";
        this.attribs = null;
        this.stack.length = 0;
        this.startIndex = 0;
        this.endIndex = 0;
        (_d = (_c = this.cbs).onparserinit) === null || _d === void 0 ? void 0 : _d.call(_c, this);
        this.buffers.length = 0;
        this.bufferOffset = 0;
        this.writeIndex = 0;
        this.ended = false;
      };
      Parser2.prototype.parseComplete = function(data) {
        this.reset();
        this.end(data);
      };
      Parser2.prototype.getSlice = function(start, end) {
        while (start - this.bufferOffset >= this.buffers[0].length) {
          this.shiftBuffer();
        }
        var slice = this.buffers[0].slice(start - this.bufferOffset, end - this.bufferOffset);
        while (end - this.bufferOffset > this.buffers[0].length) {
          this.shiftBuffer();
          slice += this.buffers[0].slice(0, end - this.bufferOffset);
        }
        return slice;
      };
      Parser2.prototype.shiftBuffer = function() {
        this.bufferOffset += this.buffers[0].length;
        this.writeIndex--;
        this.buffers.shift();
      };
      Parser2.prototype.write = function(chunk) {
        var _a2, _b;
        if (this.ended) {
          (_b = (_a2 = this.cbs).onerror) === null || _b === void 0 ? void 0 : _b.call(_a2, new Error(".write() after done!"));
          return;
        }
        this.buffers.push(chunk);
        if (this.tokenizer.running) {
          this.tokenizer.write(chunk);
          this.writeIndex++;
        }
      };
      Parser2.prototype.end = function(chunk) {
        var _a2, _b;
        if (this.ended) {
          (_b = (_a2 = this.cbs).onerror) === null || _b === void 0 ? void 0 : _b.call(_a2, new Error(".end() after done!"));
          return;
        }
        if (chunk)
          this.write(chunk);
        this.ended = true;
        this.tokenizer.end();
      };
      Parser2.prototype.pause = function() {
        this.tokenizer.pause();
      };
      Parser2.prototype.resume = function() {
        this.tokenizer.resume();
        while (this.tokenizer.running && this.writeIndex < this.buffers.length) {
          this.tokenizer.write(this.buffers[this.writeIndex++]);
        }
        if (this.ended)
          this.tokenizer.end();
      };
      Parser2.prototype.parseChunk = function(chunk) {
        this.write(chunk);
      };
      Parser2.prototype.done = function(chunk) {
        this.end(chunk);
      };
      return Parser2;
    })()
  );
  Parser.Parser = Parser$1;
  return Parser;
}
var lib$4 = {};
var lib$3 = {};
var hasRequiredLib$5;
function requireLib$5() {
  if (hasRequiredLib$5) return lib$3;
  hasRequiredLib$5 = 1;
  (function(exports$1) {
    Object.defineProperty(exports$1, "__esModule", { value: true });
    exports$1.Doctype = exports$1.CDATA = exports$1.Tag = exports$1.Style = exports$1.Script = exports$1.Comment = exports$1.Directive = exports$1.Text = exports$1.Root = exports$1.isTag = exports$1.ElementType = void 0;
    var ElementType;
    (function(ElementType2) {
      ElementType2["Root"] = "root";
      ElementType2["Text"] = "text";
      ElementType2["Directive"] = "directive";
      ElementType2["Comment"] = "comment";
      ElementType2["Script"] = "script";
      ElementType2["Style"] = "style";
      ElementType2["Tag"] = "tag";
      ElementType2["CDATA"] = "cdata";
      ElementType2["Doctype"] = "doctype";
    })(ElementType = exports$1.ElementType || (exports$1.ElementType = {}));
    function isTag(elem) {
      return elem.type === ElementType.Tag || elem.type === ElementType.Script || elem.type === ElementType.Style;
    }
    exports$1.isTag = isTag;
    exports$1.Root = ElementType.Root;
    exports$1.Text = ElementType.Text;
    exports$1.Directive = ElementType.Directive;
    exports$1.Comment = ElementType.Comment;
    exports$1.Script = ElementType.Script;
    exports$1.Style = ElementType.Style;
    exports$1.Tag = ElementType.Tag;
    exports$1.CDATA = ElementType.CDATA;
    exports$1.Doctype = ElementType.Doctype;
  })(lib$3);
  return lib$3;
}
var node$1 = {};
var hasRequiredNode$1;
function requireNode$1() {
  if (hasRequiredNode$1) return node$1;
  hasRequiredNode$1 = 1;
  var __extends = node$1 && node$1.__extends || /* @__PURE__ */ (function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  })();
  var __assign = node$1 && node$1.__assign || function() {
    __assign = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
          t[p] = s[p];
      }
      return t;
    };
    return __assign.apply(this, arguments);
  };
  Object.defineProperty(node$1, "__esModule", { value: true });
  node$1.cloneNode = node$1.hasChildren = node$1.isDocument = node$1.isDirective = node$1.isComment = node$1.isText = node$1.isCDATA = node$1.isTag = node$1.Element = node$1.Document = node$1.CDATA = node$1.NodeWithChildren = node$1.ProcessingInstruction = node$1.Comment = node$1.Text = node$1.DataNode = node$1.Node = void 0;
  var domelementtype_1 = /* @__PURE__ */ requireLib$5();
  var Node = (
    /** @class */
    (function() {
      function Node2() {
        this.parent = null;
        this.prev = null;
        this.next = null;
        this.startIndex = null;
        this.endIndex = null;
      }
      Object.defineProperty(Node2.prototype, "parentNode", {
        // Read-write aliases for properties
        /**
         * Same as {@link parent}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function() {
          return this.parent;
        },
        set: function(parent) {
          this.parent = parent;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(Node2.prototype, "previousSibling", {
        /**
         * Same as {@link prev}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function() {
          return this.prev;
        },
        set: function(prev) {
          this.prev = prev;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(Node2.prototype, "nextSibling", {
        /**
         * Same as {@link next}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function() {
          return this.next;
        },
        set: function(next) {
          this.next = next;
        },
        enumerable: false,
        configurable: true
      });
      Node2.prototype.cloneNode = function(recursive) {
        if (recursive === void 0) {
          recursive = false;
        }
        return cloneNode(this, recursive);
      };
      return Node2;
    })()
  );
  node$1.Node = Node;
  var DataNode = (
    /** @class */
    (function(_super) {
      __extends(DataNode2, _super);
      function DataNode2(data) {
        var _this = _super.call(this) || this;
        _this.data = data;
        return _this;
      }
      Object.defineProperty(DataNode2.prototype, "nodeValue", {
        /**
         * Same as {@link data}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function() {
          return this.data;
        },
        set: function(data) {
          this.data = data;
        },
        enumerable: false,
        configurable: true
      });
      return DataNode2;
    })(Node)
  );
  node$1.DataNode = DataNode;
  var Text = (
    /** @class */
    (function(_super) {
      __extends(Text2, _super);
      function Text2() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = domelementtype_1.ElementType.Text;
        return _this;
      }
      Object.defineProperty(Text2.prototype, "nodeType", {
        get: function() {
          return 3;
        },
        enumerable: false,
        configurable: true
      });
      return Text2;
    })(DataNode)
  );
  node$1.Text = Text;
  var Comment = (
    /** @class */
    (function(_super) {
      __extends(Comment2, _super);
      function Comment2() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = domelementtype_1.ElementType.Comment;
        return _this;
      }
      Object.defineProperty(Comment2.prototype, "nodeType", {
        get: function() {
          return 8;
        },
        enumerable: false,
        configurable: true
      });
      return Comment2;
    })(DataNode)
  );
  node$1.Comment = Comment;
  var ProcessingInstruction = (
    /** @class */
    (function(_super) {
      __extends(ProcessingInstruction2, _super);
      function ProcessingInstruction2(name, data) {
        var _this = _super.call(this, data) || this;
        _this.name = name;
        _this.type = domelementtype_1.ElementType.Directive;
        return _this;
      }
      Object.defineProperty(ProcessingInstruction2.prototype, "nodeType", {
        get: function() {
          return 1;
        },
        enumerable: false,
        configurable: true
      });
      return ProcessingInstruction2;
    })(DataNode)
  );
  node$1.ProcessingInstruction = ProcessingInstruction;
  var NodeWithChildren = (
    /** @class */
    (function(_super) {
      __extends(NodeWithChildren2, _super);
      function NodeWithChildren2(children) {
        var _this = _super.call(this) || this;
        _this.children = children;
        return _this;
      }
      Object.defineProperty(NodeWithChildren2.prototype, "firstChild", {
        // Aliases
        /** First child of the node. */
        get: function() {
          var _a2;
          return (_a2 = this.children[0]) !== null && _a2 !== void 0 ? _a2 : null;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(NodeWithChildren2.prototype, "lastChild", {
        /** Last child of the node. */
        get: function() {
          return this.children.length > 0 ? this.children[this.children.length - 1] : null;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(NodeWithChildren2.prototype, "childNodes", {
        /**
         * Same as {@link children}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function() {
          return this.children;
        },
        set: function(children) {
          this.children = children;
        },
        enumerable: false,
        configurable: true
      });
      return NodeWithChildren2;
    })(Node)
  );
  node$1.NodeWithChildren = NodeWithChildren;
  var CDATA = (
    /** @class */
    (function(_super) {
      __extends(CDATA2, _super);
      function CDATA2() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = domelementtype_1.ElementType.CDATA;
        return _this;
      }
      Object.defineProperty(CDATA2.prototype, "nodeType", {
        get: function() {
          return 4;
        },
        enumerable: false,
        configurable: true
      });
      return CDATA2;
    })(NodeWithChildren)
  );
  node$1.CDATA = CDATA;
  var Document = (
    /** @class */
    (function(_super) {
      __extends(Document2, _super);
      function Document2() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = domelementtype_1.ElementType.Root;
        return _this;
      }
      Object.defineProperty(Document2.prototype, "nodeType", {
        get: function() {
          return 9;
        },
        enumerable: false,
        configurable: true
      });
      return Document2;
    })(NodeWithChildren)
  );
  node$1.Document = Document;
  var Element = (
    /** @class */
    (function(_super) {
      __extends(Element2, _super);
      function Element2(name, attribs, children, type) {
        if (children === void 0) {
          children = [];
        }
        if (type === void 0) {
          type = name === "script" ? domelementtype_1.ElementType.Script : name === "style" ? domelementtype_1.ElementType.Style : domelementtype_1.ElementType.Tag;
        }
        var _this = _super.call(this, children) || this;
        _this.name = name;
        _this.attribs = attribs;
        _this.type = type;
        return _this;
      }
      Object.defineProperty(Element2.prototype, "nodeType", {
        get: function() {
          return 1;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(Element2.prototype, "tagName", {
        // DOM Level 1 aliases
        /**
         * Same as {@link name}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function() {
          return this.name;
        },
        set: function(name) {
          this.name = name;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(Element2.prototype, "attributes", {
        get: function() {
          var _this = this;
          return Object.keys(this.attribs).map(function(name) {
            var _a2, _b;
            return {
              name,
              value: _this.attribs[name],
              namespace: (_a2 = _this["x-attribsNamespace"]) === null || _a2 === void 0 ? void 0 : _a2[name],
              prefix: (_b = _this["x-attribsPrefix"]) === null || _b === void 0 ? void 0 : _b[name]
            };
          });
        },
        enumerable: false,
        configurable: true
      });
      return Element2;
    })(NodeWithChildren)
  );
  node$1.Element = Element;
  function isTag(node2) {
    return (0, domelementtype_1.isTag)(node2);
  }
  node$1.isTag = isTag;
  function isCDATA(node2) {
    return node2.type === domelementtype_1.ElementType.CDATA;
  }
  node$1.isCDATA = isCDATA;
  function isText(node2) {
    return node2.type === domelementtype_1.ElementType.Text;
  }
  node$1.isText = isText;
  function isComment(node2) {
    return node2.type === domelementtype_1.ElementType.Comment;
  }
  node$1.isComment = isComment;
  function isDirective(node2) {
    return node2.type === domelementtype_1.ElementType.Directive;
  }
  node$1.isDirective = isDirective;
  function isDocument(node2) {
    return node2.type === domelementtype_1.ElementType.Root;
  }
  node$1.isDocument = isDocument;
  function hasChildren(node2) {
    return Object.prototype.hasOwnProperty.call(node2, "children");
  }
  node$1.hasChildren = hasChildren;
  function cloneNode(node2, recursive) {
    if (recursive === void 0) {
      recursive = false;
    }
    var result2;
    if (isText(node2)) {
      result2 = new Text(node2.data);
    } else if (isComment(node2)) {
      result2 = new Comment(node2.data);
    } else if (isTag(node2)) {
      var children = recursive ? cloneChildren(node2.children) : [];
      var clone_1 = new Element(node2.name, __assign({}, node2.attribs), children);
      children.forEach(function(child) {
        return child.parent = clone_1;
      });
      if (node2.namespace != null) {
        clone_1.namespace = node2.namespace;
      }
      if (node2["x-attribsNamespace"]) {
        clone_1["x-attribsNamespace"] = __assign({}, node2["x-attribsNamespace"]);
      }
      if (node2["x-attribsPrefix"]) {
        clone_1["x-attribsPrefix"] = __assign({}, node2["x-attribsPrefix"]);
      }
      result2 = clone_1;
    } else if (isCDATA(node2)) {
      var children = recursive ? cloneChildren(node2.children) : [];
      var clone_2 = new CDATA(children);
      children.forEach(function(child) {
        return child.parent = clone_2;
      });
      result2 = clone_2;
    } else if (isDocument(node2)) {
      var children = recursive ? cloneChildren(node2.children) : [];
      var clone_3 = new Document(children);
      children.forEach(function(child) {
        return child.parent = clone_3;
      });
      if (node2["x-mode"]) {
        clone_3["x-mode"] = node2["x-mode"];
      }
      result2 = clone_3;
    } else if (isDirective(node2)) {
      var instruction = new ProcessingInstruction(node2.name, node2.data);
      if (node2["x-name"] != null) {
        instruction["x-name"] = node2["x-name"];
        instruction["x-publicId"] = node2["x-publicId"];
        instruction["x-systemId"] = node2["x-systemId"];
      }
      result2 = instruction;
    } else {
      throw new Error("Not implemented yet: ".concat(node2.type));
    }
    result2.startIndex = node2.startIndex;
    result2.endIndex = node2.endIndex;
    if (node2.sourceCodeLocation != null) {
      result2.sourceCodeLocation = node2.sourceCodeLocation;
    }
    return result2;
  }
  node$1.cloneNode = cloneNode;
  function cloneChildren(childs) {
    var children = childs.map(function(child) {
      return cloneNode(child, true);
    });
    for (var i = 1; i < children.length; i++) {
      children[i].prev = children[i - 1];
      children[i - 1].next = children[i];
    }
    return children;
  }
  return node$1;
}
var hasRequiredLib$4;
function requireLib$4() {
  if (hasRequiredLib$4) return lib$4;
  hasRequiredLib$4 = 1;
  (function(exports$1) {
    var __createBinding = lib$4 && lib$4.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = lib$4 && lib$4.__exportStar || function(m, exports$12) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$12, p)) __createBinding(exports$12, m, p);
    };
    Object.defineProperty(exports$1, "__esModule", { value: true });
    exports$1.DomHandler = void 0;
    var domelementtype_1 = /* @__PURE__ */ requireLib$5();
    var node_js_1 = /* @__PURE__ */ requireNode$1();
    __exportStar(/* @__PURE__ */ requireNode$1(), exports$1);
    var defaultOpts = {
      withStartIndices: false,
      withEndIndices: false,
      xmlMode: false
    };
    var DomHandler = (
      /** @class */
      (function() {
        function DomHandler2(callback, options, elementCB) {
          this.dom = [];
          this.root = new node_js_1.Document(this.dom);
          this.done = false;
          this.tagStack = [this.root];
          this.lastNode = null;
          this.parser = null;
          if (typeof options === "function") {
            elementCB = options;
            options = defaultOpts;
          }
          if (typeof callback === "object") {
            options = callback;
            callback = void 0;
          }
          this.callback = callback !== null && callback !== void 0 ? callback : null;
          this.options = options !== null && options !== void 0 ? options : defaultOpts;
          this.elementCB = elementCB !== null && elementCB !== void 0 ? elementCB : null;
        }
        DomHandler2.prototype.onparserinit = function(parser2) {
          this.parser = parser2;
        };
        DomHandler2.prototype.onreset = function() {
          this.dom = [];
          this.root = new node_js_1.Document(this.dom);
          this.done = false;
          this.tagStack = [this.root];
          this.lastNode = null;
          this.parser = null;
        };
        DomHandler2.prototype.onend = function() {
          if (this.done)
            return;
          this.done = true;
          this.parser = null;
          this.handleCallback(null);
        };
        DomHandler2.prototype.onerror = function(error) {
          this.handleCallback(error);
        };
        DomHandler2.prototype.onclosetag = function() {
          this.lastNode = null;
          var elem = this.tagStack.pop();
          if (this.options.withEndIndices) {
            elem.endIndex = this.parser.endIndex;
          }
          if (this.elementCB)
            this.elementCB(elem);
        };
        DomHandler2.prototype.onopentag = function(name, attribs) {
          var type = this.options.xmlMode ? domelementtype_1.ElementType.Tag : void 0;
          var element = new node_js_1.Element(name, attribs, void 0, type);
          this.addNode(element);
          this.tagStack.push(element);
        };
        DomHandler2.prototype.ontext = function(data) {
          var lastNode = this.lastNode;
          if (lastNode && lastNode.type === domelementtype_1.ElementType.Text) {
            lastNode.data += data;
            if (this.options.withEndIndices) {
              lastNode.endIndex = this.parser.endIndex;
            }
          } else {
            var node2 = new node_js_1.Text(data);
            this.addNode(node2);
            this.lastNode = node2;
          }
        };
        DomHandler2.prototype.oncomment = function(data) {
          if (this.lastNode && this.lastNode.type === domelementtype_1.ElementType.Comment) {
            this.lastNode.data += data;
            return;
          }
          var node2 = new node_js_1.Comment(data);
          this.addNode(node2);
          this.lastNode = node2;
        };
        DomHandler2.prototype.oncommentend = function() {
          this.lastNode = null;
        };
        DomHandler2.prototype.oncdatastart = function() {
          var text = new node_js_1.Text("");
          var node2 = new node_js_1.CDATA([text]);
          this.addNode(node2);
          text.parent = node2;
          this.lastNode = text;
        };
        DomHandler2.prototype.oncdataend = function() {
          this.lastNode = null;
        };
        DomHandler2.prototype.onprocessinginstruction = function(name, data) {
          var node2 = new node_js_1.ProcessingInstruction(name, data);
          this.addNode(node2);
        };
        DomHandler2.prototype.handleCallback = function(error) {
          if (typeof this.callback === "function") {
            this.callback(error, this.dom);
          } else if (error) {
            throw error;
          }
        };
        DomHandler2.prototype.addNode = function(node2) {
          var parent = this.tagStack[this.tagStack.length - 1];
          var previousSibling = parent.children[parent.children.length - 1];
          if (this.options.withStartIndices) {
            node2.startIndex = this.parser.startIndex;
          }
          if (this.options.withEndIndices) {
            node2.endIndex = this.parser.endIndex;
          }
          parent.children.push(node2);
          if (previousSibling) {
            node2.prev = previousSibling;
            previousSibling.next = node2;
          }
          node2.parent = parent;
          this.lastNode = null;
        };
        return DomHandler2;
      })()
    );
    exports$1.DomHandler = DomHandler;
    exports$1.default = DomHandler;
  })(lib$4);
  return lib$4;
}
var lib$2 = {};
var stringify = {};
var lib$1 = {};
var lib = {};
var encode = {};
var encodeHtml = {};
var hasRequiredEncodeHtml;
function requireEncodeHtml() {
  if (hasRequiredEncodeHtml) return encodeHtml;
  hasRequiredEncodeHtml = 1;
  Object.defineProperty(encodeHtml, "__esModule", { value: true });
  function restoreDiff(arr) {
    for (var i = 1; i < arr.length; i++) {
      arr[i][0] += arr[i - 1][0] + 1;
    }
    return arr;
  }
  encodeHtml.default = new Map(/* @__PURE__ */ restoreDiff([[9, "&Tab;"], [0, "&NewLine;"], [22, "&excl;"], [0, "&quot;"], [0, "&num;"], [0, "&dollar;"], [0, "&percnt;"], [0, "&amp;"], [0, "&apos;"], [0, "&lpar;"], [0, "&rpar;"], [0, "&ast;"], [0, "&plus;"], [0, "&comma;"], [1, "&period;"], [0, "&sol;"], [10, "&colon;"], [0, "&semi;"], [0, { v: "&lt;", n: 8402, o: "&nvlt;" }], [0, { v: "&equals;", n: 8421, o: "&bne;" }], [0, { v: "&gt;", n: 8402, o: "&nvgt;" }], [0, "&quest;"], [0, "&commat;"], [26, "&lbrack;"], [0, "&bsol;"], [0, "&rbrack;"], [0, "&Hat;"], [0, "&lowbar;"], [0, "&DiacriticalGrave;"], [5, { n: 106, o: "&fjlig;" }], [20, "&lbrace;"], [0, "&verbar;"], [0, "&rbrace;"], [34, "&nbsp;"], [0, "&iexcl;"], [0, "&cent;"], [0, "&pound;"], [0, "&curren;"], [0, "&yen;"], [0, "&brvbar;"], [0, "&sect;"], [0, "&die;"], [0, "&copy;"], [0, "&ordf;"], [0, "&laquo;"], [0, "&not;"], [0, "&shy;"], [0, "&circledR;"], [0, "&macr;"], [0, "&deg;"], [0, "&PlusMinus;"], [0, "&sup2;"], [0, "&sup3;"], [0, "&acute;"], [0, "&micro;"], [0, "&para;"], [0, "&centerdot;"], [0, "&cedil;"], [0, "&sup1;"], [0, "&ordm;"], [0, "&raquo;"], [0, "&frac14;"], [0, "&frac12;"], [0, "&frac34;"], [0, "&iquest;"], [0, "&Agrave;"], [0, "&Aacute;"], [0, "&Acirc;"], [0, "&Atilde;"], [0, "&Auml;"], [0, "&angst;"], [0, "&AElig;"], [0, "&Ccedil;"], [0, "&Egrave;"], [0, "&Eacute;"], [0, "&Ecirc;"], [0, "&Euml;"], [0, "&Igrave;"], [0, "&Iacute;"], [0, "&Icirc;"], [0, "&Iuml;"], [0, "&ETH;"], [0, "&Ntilde;"], [0, "&Ograve;"], [0, "&Oacute;"], [0, "&Ocirc;"], [0, "&Otilde;"], [0, "&Ouml;"], [0, "&times;"], [0, "&Oslash;"], [0, "&Ugrave;"], [0, "&Uacute;"], [0, "&Ucirc;"], [0, "&Uuml;"], [0, "&Yacute;"], [0, "&THORN;"], [0, "&szlig;"], [0, "&agrave;"], [0, "&aacute;"], [0, "&acirc;"], [0, "&atilde;"], [0, "&auml;"], [0, "&aring;"], [0, "&aelig;"], [0, "&ccedil;"], [0, "&egrave;"], [0, "&eacute;"], [0, "&ecirc;"], [0, "&euml;"], [0, "&igrave;"], [0, "&iacute;"], [0, "&icirc;"], [0, "&iuml;"], [0, "&eth;"], [0, "&ntilde;"], [0, "&ograve;"], [0, "&oacute;"], [0, "&ocirc;"], [0, "&otilde;"], [0, "&ouml;"], [0, "&div;"], [0, "&oslash;"], [0, "&ugrave;"], [0, "&uacute;"], [0, "&ucirc;"], [0, "&uuml;"], [0, "&yacute;"], [0, "&thorn;"], [0, "&yuml;"], [0, "&Amacr;"], [0, "&amacr;"], [0, "&Abreve;"], [0, "&abreve;"], [0, "&Aogon;"], [0, "&aogon;"], [0, "&Cacute;"], [0, "&cacute;"], [0, "&Ccirc;"], [0, "&ccirc;"], [0, "&Cdot;"], [0, "&cdot;"], [0, "&Ccaron;"], [0, "&ccaron;"], [0, "&Dcaron;"], [0, "&dcaron;"], [0, "&Dstrok;"], [0, "&dstrok;"], [0, "&Emacr;"], [0, "&emacr;"], [2, "&Edot;"], [0, "&edot;"], [0, "&Eogon;"], [0, "&eogon;"], [0, "&Ecaron;"], [0, "&ecaron;"], [0, "&Gcirc;"], [0, "&gcirc;"], [0, "&Gbreve;"], [0, "&gbreve;"], [0, "&Gdot;"], [0, "&gdot;"], [0, "&Gcedil;"], [1, "&Hcirc;"], [0, "&hcirc;"], [0, "&Hstrok;"], [0, "&hstrok;"], [0, "&Itilde;"], [0, "&itilde;"], [0, "&Imacr;"], [0, "&imacr;"], [2, "&Iogon;"], [0, "&iogon;"], [0, "&Idot;"], [0, "&imath;"], [0, "&IJlig;"], [0, "&ijlig;"], [0, "&Jcirc;"], [0, "&jcirc;"], [0, "&Kcedil;"], [0, "&kcedil;"], [0, "&kgreen;"], [0, "&Lacute;"], [0, "&lacute;"], [0, "&Lcedil;"], [0, "&lcedil;"], [0, "&Lcaron;"], [0, "&lcaron;"], [0, "&Lmidot;"], [0, "&lmidot;"], [0, "&Lstrok;"], [0, "&lstrok;"], [0, "&Nacute;"], [0, "&nacute;"], [0, "&Ncedil;"], [0, "&ncedil;"], [0, "&Ncaron;"], [0, "&ncaron;"], [0, "&napos;"], [0, "&ENG;"], [0, "&eng;"], [0, "&Omacr;"], [0, "&omacr;"], [2, "&Odblac;"], [0, "&odblac;"], [0, "&OElig;"], [0, "&oelig;"], [0, "&Racute;"], [0, "&racute;"], [0, "&Rcedil;"], [0, "&rcedil;"], [0, "&Rcaron;"], [0, "&rcaron;"], [0, "&Sacute;"], [0, "&sacute;"], [0, "&Scirc;"], [0, "&scirc;"], [0, "&Scedil;"], [0, "&scedil;"], [0, "&Scaron;"], [0, "&scaron;"], [0, "&Tcedil;"], [0, "&tcedil;"], [0, "&Tcaron;"], [0, "&tcaron;"], [0, "&Tstrok;"], [0, "&tstrok;"], [0, "&Utilde;"], [0, "&utilde;"], [0, "&Umacr;"], [0, "&umacr;"], [0, "&Ubreve;"], [0, "&ubreve;"], [0, "&Uring;"], [0, "&uring;"], [0, "&Udblac;"], [0, "&udblac;"], [0, "&Uogon;"], [0, "&uogon;"], [0, "&Wcirc;"], [0, "&wcirc;"], [0, "&Ycirc;"], [0, "&ycirc;"], [0, "&Yuml;"], [0, "&Zacute;"], [0, "&zacute;"], [0, "&Zdot;"], [0, "&zdot;"], [0, "&Zcaron;"], [0, "&zcaron;"], [19, "&fnof;"], [34, "&imped;"], [63, "&gacute;"], [65, "&jmath;"], [142, "&circ;"], [0, "&caron;"], [16, "&breve;"], [0, "&DiacriticalDot;"], [0, "&ring;"], [0, "&ogon;"], [0, "&DiacriticalTilde;"], [0, "&dblac;"], [51, "&DownBreve;"], [127, "&Alpha;"], [0, "&Beta;"], [0, "&Gamma;"], [0, "&Delta;"], [0, "&Epsilon;"], [0, "&Zeta;"], [0, "&Eta;"], [0, "&Theta;"], [0, "&Iota;"], [0, "&Kappa;"], [0, "&Lambda;"], [0, "&Mu;"], [0, "&Nu;"], [0, "&Xi;"], [0, "&Omicron;"], [0, "&Pi;"], [0, "&Rho;"], [1, "&Sigma;"], [0, "&Tau;"], [0, "&Upsilon;"], [0, "&Phi;"], [0, "&Chi;"], [0, "&Psi;"], [0, "&ohm;"], [7, "&alpha;"], [0, "&beta;"], [0, "&gamma;"], [0, "&delta;"], [0, "&epsi;"], [0, "&zeta;"], [0, "&eta;"], [0, "&theta;"], [0, "&iota;"], [0, "&kappa;"], [0, "&lambda;"], [0, "&mu;"], [0, "&nu;"], [0, "&xi;"], [0, "&omicron;"], [0, "&pi;"], [0, "&rho;"], [0, "&sigmaf;"], [0, "&sigma;"], [0, "&tau;"], [0, "&upsi;"], [0, "&phi;"], [0, "&chi;"], [0, "&psi;"], [0, "&omega;"], [7, "&thetasym;"], [0, "&Upsi;"], [2, "&phiv;"], [0, "&piv;"], [5, "&Gammad;"], [0, "&digamma;"], [18, "&kappav;"], [0, "&rhov;"], [3, "&epsiv;"], [0, "&backepsilon;"], [10, "&IOcy;"], [0, "&DJcy;"], [0, "&GJcy;"], [0, "&Jukcy;"], [0, "&DScy;"], [0, "&Iukcy;"], [0, "&YIcy;"], [0, "&Jsercy;"], [0, "&LJcy;"], [0, "&NJcy;"], [0, "&TSHcy;"], [0, "&KJcy;"], [1, "&Ubrcy;"], [0, "&DZcy;"], [0, "&Acy;"], [0, "&Bcy;"], [0, "&Vcy;"], [0, "&Gcy;"], [0, "&Dcy;"], [0, "&IEcy;"], [0, "&ZHcy;"], [0, "&Zcy;"], [0, "&Icy;"], [0, "&Jcy;"], [0, "&Kcy;"], [0, "&Lcy;"], [0, "&Mcy;"], [0, "&Ncy;"], [0, "&Ocy;"], [0, "&Pcy;"], [0, "&Rcy;"], [0, "&Scy;"], [0, "&Tcy;"], [0, "&Ucy;"], [0, "&Fcy;"], [0, "&KHcy;"], [0, "&TScy;"], [0, "&CHcy;"], [0, "&SHcy;"], [0, "&SHCHcy;"], [0, "&HARDcy;"], [0, "&Ycy;"], [0, "&SOFTcy;"], [0, "&Ecy;"], [0, "&YUcy;"], [0, "&YAcy;"], [0, "&acy;"], [0, "&bcy;"], [0, "&vcy;"], [0, "&gcy;"], [0, "&dcy;"], [0, "&iecy;"], [0, "&zhcy;"], [0, "&zcy;"], [0, "&icy;"], [0, "&jcy;"], [0, "&kcy;"], [0, "&lcy;"], [0, "&mcy;"], [0, "&ncy;"], [0, "&ocy;"], [0, "&pcy;"], [0, "&rcy;"], [0, "&scy;"], [0, "&tcy;"], [0, "&ucy;"], [0, "&fcy;"], [0, "&khcy;"], [0, "&tscy;"], [0, "&chcy;"], [0, "&shcy;"], [0, "&shchcy;"], [0, "&hardcy;"], [0, "&ycy;"], [0, "&softcy;"], [0, "&ecy;"], [0, "&yucy;"], [0, "&yacy;"], [1, "&iocy;"], [0, "&djcy;"], [0, "&gjcy;"], [0, "&jukcy;"], [0, "&dscy;"], [0, "&iukcy;"], [0, "&yicy;"], [0, "&jsercy;"], [0, "&ljcy;"], [0, "&njcy;"], [0, "&tshcy;"], [0, "&kjcy;"], [1, "&ubrcy;"], [0, "&dzcy;"], [7074, "&ensp;"], [0, "&emsp;"], [0, "&emsp13;"], [0, "&emsp14;"], [1, "&numsp;"], [0, "&puncsp;"], [0, "&ThinSpace;"], [0, "&hairsp;"], [0, "&NegativeMediumSpace;"], [0, "&zwnj;"], [0, "&zwj;"], [0, "&lrm;"], [0, "&rlm;"], [0, "&dash;"], [2, "&ndash;"], [0, "&mdash;"], [0, "&horbar;"], [0, "&Verbar;"], [1, "&lsquo;"], [0, "&CloseCurlyQuote;"], [0, "&lsquor;"], [1, "&ldquo;"], [0, "&CloseCurlyDoubleQuote;"], [0, "&bdquo;"], [1, "&dagger;"], [0, "&Dagger;"], [0, "&bull;"], [2, "&nldr;"], [0, "&hellip;"], [9, "&permil;"], [0, "&pertenk;"], [0, "&prime;"], [0, "&Prime;"], [0, "&tprime;"], [0, "&backprime;"], [3, "&lsaquo;"], [0, "&rsaquo;"], [3, "&oline;"], [2, "&caret;"], [1, "&hybull;"], [0, "&frasl;"], [10, "&bsemi;"], [7, "&qprime;"], [7, { v: "&MediumSpace;", n: 8202, o: "&ThickSpace;" }], [0, "&NoBreak;"], [0, "&af;"], [0, "&InvisibleTimes;"], [0, "&ic;"], [72, "&euro;"], [46, "&tdot;"], [0, "&DotDot;"], [37, "&complexes;"], [2, "&incare;"], [4, "&gscr;"], [0, "&hamilt;"], [0, "&Hfr;"], [0, "&Hopf;"], [0, "&planckh;"], [0, "&hbar;"], [0, "&imagline;"], [0, "&Ifr;"], [0, "&lagran;"], [0, "&ell;"], [1, "&naturals;"], [0, "&numero;"], [0, "&copysr;"], [0, "&weierp;"], [0, "&Popf;"], [0, "&Qopf;"], [0, "&realine;"], [0, "&real;"], [0, "&reals;"], [0, "&rx;"], [3, "&trade;"], [1, "&integers;"], [2, "&mho;"], [0, "&zeetrf;"], [0, "&iiota;"], [2, "&bernou;"], [0, "&Cayleys;"], [1, "&escr;"], [0, "&Escr;"], [0, "&Fouriertrf;"], [1, "&Mellintrf;"], [0, "&order;"], [0, "&alefsym;"], [0, "&beth;"], [0, "&gimel;"], [0, "&daleth;"], [12, "&CapitalDifferentialD;"], [0, "&dd;"], [0, "&ee;"], [0, "&ii;"], [10, "&frac13;"], [0, "&frac23;"], [0, "&frac15;"], [0, "&frac25;"], [0, "&frac35;"], [0, "&frac45;"], [0, "&frac16;"], [0, "&frac56;"], [0, "&frac18;"], [0, "&frac38;"], [0, "&frac58;"], [0, "&frac78;"], [49, "&larr;"], [0, "&ShortUpArrow;"], [0, "&rarr;"], [0, "&darr;"], [0, "&harr;"], [0, "&updownarrow;"], [0, "&nwarr;"], [0, "&nearr;"], [0, "&LowerRightArrow;"], [0, "&LowerLeftArrow;"], [0, "&nlarr;"], [0, "&nrarr;"], [1, { v: "&rarrw;", n: 824, o: "&nrarrw;" }], [0, "&Larr;"], [0, "&Uarr;"], [0, "&Rarr;"], [0, "&Darr;"], [0, "&larrtl;"], [0, "&rarrtl;"], [0, "&LeftTeeArrow;"], [0, "&mapstoup;"], [0, "&map;"], [0, "&DownTeeArrow;"], [1, "&hookleftarrow;"], [0, "&hookrightarrow;"], [0, "&larrlp;"], [0, "&looparrowright;"], [0, "&harrw;"], [0, "&nharr;"], [1, "&lsh;"], [0, "&rsh;"], [0, "&ldsh;"], [0, "&rdsh;"], [1, "&crarr;"], [0, "&cularr;"], [0, "&curarr;"], [2, "&circlearrowleft;"], [0, "&circlearrowright;"], [0, "&leftharpoonup;"], [0, "&DownLeftVector;"], [0, "&RightUpVector;"], [0, "&LeftUpVector;"], [0, "&rharu;"], [0, "&DownRightVector;"], [0, "&dharr;"], [0, "&dharl;"], [0, "&RightArrowLeftArrow;"], [0, "&udarr;"], [0, "&LeftArrowRightArrow;"], [0, "&leftleftarrows;"], [0, "&upuparrows;"], [0, "&rightrightarrows;"], [0, "&ddarr;"], [0, "&leftrightharpoons;"], [0, "&Equilibrium;"], [0, "&nlArr;"], [0, "&nhArr;"], [0, "&nrArr;"], [0, "&DoubleLeftArrow;"], [0, "&DoubleUpArrow;"], [0, "&DoubleRightArrow;"], [0, "&dArr;"], [0, "&DoubleLeftRightArrow;"], [0, "&DoubleUpDownArrow;"], [0, "&nwArr;"], [0, "&neArr;"], [0, "&seArr;"], [0, "&swArr;"], [0, "&lAarr;"], [0, "&rAarr;"], [1, "&zigrarr;"], [6, "&larrb;"], [0, "&rarrb;"], [15, "&DownArrowUpArrow;"], [7, "&loarr;"], [0, "&roarr;"], [0, "&hoarr;"], [0, "&forall;"], [0, "&comp;"], [0, { v: "&part;", n: 824, o: "&npart;" }], [0, "&exist;"], [0, "&nexist;"], [0, "&empty;"], [1, "&Del;"], [0, "&Element;"], [0, "&NotElement;"], [1, "&ni;"], [0, "&notni;"], [2, "&prod;"], [0, "&coprod;"], [0, "&sum;"], [0, "&minus;"], [0, "&MinusPlus;"], [0, "&dotplus;"], [1, "&Backslash;"], [0, "&lowast;"], [0, "&compfn;"], [1, "&radic;"], [2, "&prop;"], [0, "&infin;"], [0, "&angrt;"], [0, { v: "&ang;", n: 8402, o: "&nang;" }], [0, "&angmsd;"], [0, "&angsph;"], [0, "&mid;"], [0, "&nmid;"], [0, "&DoubleVerticalBar;"], [0, "&NotDoubleVerticalBar;"], [0, "&and;"], [0, "&or;"], [0, { v: "&cap;", n: 65024, o: "&caps;" }], [0, { v: "&cup;", n: 65024, o: "&cups;" }], [0, "&int;"], [0, "&Int;"], [0, "&iiint;"], [0, "&conint;"], [0, "&Conint;"], [0, "&Cconint;"], [0, "&cwint;"], [0, "&ClockwiseContourIntegral;"], [0, "&awconint;"], [0, "&there4;"], [0, "&becaus;"], [0, "&ratio;"], [0, "&Colon;"], [0, "&dotminus;"], [1, "&mDDot;"], [0, "&homtht;"], [0, { v: "&sim;", n: 8402, o: "&nvsim;" }], [0, { v: "&backsim;", n: 817, o: "&race;" }], [0, { v: "&ac;", n: 819, o: "&acE;" }], [0, "&acd;"], [0, "&VerticalTilde;"], [0, "&NotTilde;"], [0, { v: "&eqsim;", n: 824, o: "&nesim;" }], [0, "&sime;"], [0, "&NotTildeEqual;"], [0, "&cong;"], [0, "&simne;"], [0, "&ncong;"], [0, "&ap;"], [0, "&nap;"], [0, "&ape;"], [0, { v: "&apid;", n: 824, o: "&napid;" }], [0, "&backcong;"], [0, { v: "&asympeq;", n: 8402, o: "&nvap;" }], [0, { v: "&bump;", n: 824, o: "&nbump;" }], [0, { v: "&bumpe;", n: 824, o: "&nbumpe;" }], [0, { v: "&doteq;", n: 824, o: "&nedot;" }], [0, "&doteqdot;"], [0, "&efDot;"], [0, "&erDot;"], [0, "&Assign;"], [0, "&ecolon;"], [0, "&ecir;"], [0, "&circeq;"], [1, "&wedgeq;"], [0, "&veeeq;"], [1, "&triangleq;"], [2, "&equest;"], [0, "&ne;"], [0, { v: "&Congruent;", n: 8421, o: "&bnequiv;" }], [0, "&nequiv;"], [1, { v: "&le;", n: 8402, o: "&nvle;" }], [0, { v: "&ge;", n: 8402, o: "&nvge;" }], [0, { v: "&lE;", n: 824, o: "&nlE;" }], [0, { v: "&gE;", n: 824, o: "&ngE;" }], [0, { v: "&lnE;", n: 65024, o: "&lvertneqq;" }], [0, { v: "&gnE;", n: 65024, o: "&gvertneqq;" }], [0, { v: "&ll;", n: new Map(/* @__PURE__ */ restoreDiff([[824, "&nLtv;"], [7577, "&nLt;"]])) }], [0, { v: "&gg;", n: new Map(/* @__PURE__ */ restoreDiff([[824, "&nGtv;"], [7577, "&nGt;"]])) }], [0, "&between;"], [0, "&NotCupCap;"], [0, "&nless;"], [0, "&ngt;"], [0, "&nle;"], [0, "&nge;"], [0, "&lesssim;"], [0, "&GreaterTilde;"], [0, "&nlsim;"], [0, "&ngsim;"], [0, "&LessGreater;"], [0, "&gl;"], [0, "&NotLessGreater;"], [0, "&NotGreaterLess;"], [0, "&pr;"], [0, "&sc;"], [0, "&prcue;"], [0, "&sccue;"], [0, "&PrecedesTilde;"], [0, { v: "&scsim;", n: 824, o: "&NotSucceedsTilde;" }], [0, "&NotPrecedes;"], [0, "&NotSucceeds;"], [0, { v: "&sub;", n: 8402, o: "&NotSubset;" }], [0, { v: "&sup;", n: 8402, o: "&NotSuperset;" }], [0, "&nsub;"], [0, "&nsup;"], [0, "&sube;"], [0, "&supe;"], [0, "&NotSubsetEqual;"], [0, "&NotSupersetEqual;"], [0, { v: "&subne;", n: 65024, o: "&varsubsetneq;" }], [0, { v: "&supne;", n: 65024, o: "&varsupsetneq;" }], [1, "&cupdot;"], [0, "&UnionPlus;"], [0, { v: "&sqsub;", n: 824, o: "&NotSquareSubset;" }], [0, { v: "&sqsup;", n: 824, o: "&NotSquareSuperset;" }], [0, "&sqsube;"], [0, "&sqsupe;"], [0, { v: "&sqcap;", n: 65024, o: "&sqcaps;" }], [0, { v: "&sqcup;", n: 65024, o: "&sqcups;" }], [0, "&CirclePlus;"], [0, "&CircleMinus;"], [0, "&CircleTimes;"], [0, "&osol;"], [0, "&CircleDot;"], [0, "&circledcirc;"], [0, "&circledast;"], [1, "&circleddash;"], [0, "&boxplus;"], [0, "&boxminus;"], [0, "&boxtimes;"], [0, "&dotsquare;"], [0, "&RightTee;"], [0, "&dashv;"], [0, "&DownTee;"], [0, "&bot;"], [1, "&models;"], [0, "&DoubleRightTee;"], [0, "&Vdash;"], [0, "&Vvdash;"], [0, "&VDash;"], [0, "&nvdash;"], [0, "&nvDash;"], [0, "&nVdash;"], [0, "&nVDash;"], [0, "&prurel;"], [1, "&LeftTriangle;"], [0, "&RightTriangle;"], [0, { v: "&LeftTriangleEqual;", n: 8402, o: "&nvltrie;" }], [0, { v: "&RightTriangleEqual;", n: 8402, o: "&nvrtrie;" }], [0, "&origof;"], [0, "&imof;"], [0, "&multimap;"], [0, "&hercon;"], [0, "&intcal;"], [0, "&veebar;"], [1, "&barvee;"], [0, "&angrtvb;"], [0, "&lrtri;"], [0, "&bigwedge;"], [0, "&bigvee;"], [0, "&bigcap;"], [0, "&bigcup;"], [0, "&diam;"], [0, "&sdot;"], [0, "&sstarf;"], [0, "&divideontimes;"], [0, "&bowtie;"], [0, "&ltimes;"], [0, "&rtimes;"], [0, "&leftthreetimes;"], [0, "&rightthreetimes;"], [0, "&backsimeq;"], [0, "&curlyvee;"], [0, "&curlywedge;"], [0, "&Sub;"], [0, "&Sup;"], [0, "&Cap;"], [0, "&Cup;"], [0, "&fork;"], [0, "&epar;"], [0, "&lessdot;"], [0, "&gtdot;"], [0, { v: "&Ll;", n: 824, o: "&nLl;" }], [0, { v: "&Gg;", n: 824, o: "&nGg;" }], [0, { v: "&leg;", n: 65024, o: "&lesg;" }], [0, { v: "&gel;", n: 65024, o: "&gesl;" }], [2, "&cuepr;"], [0, "&cuesc;"], [0, "&NotPrecedesSlantEqual;"], [0, "&NotSucceedsSlantEqual;"], [0, "&NotSquareSubsetEqual;"], [0, "&NotSquareSupersetEqual;"], [2, "&lnsim;"], [0, "&gnsim;"], [0, "&precnsim;"], [0, "&scnsim;"], [0, "&nltri;"], [0, "&NotRightTriangle;"], [0, "&nltrie;"], [0, "&NotRightTriangleEqual;"], [0, "&vellip;"], [0, "&ctdot;"], [0, "&utdot;"], [0, "&dtdot;"], [0, "&disin;"], [0, "&isinsv;"], [0, "&isins;"], [0, { v: "&isindot;", n: 824, o: "&notindot;" }], [0, "&notinvc;"], [0, "&notinvb;"], [1, { v: "&isinE;", n: 824, o: "&notinE;" }], [0, "&nisd;"], [0, "&xnis;"], [0, "&nis;"], [0, "&notnivc;"], [0, "&notnivb;"], [6, "&barwed;"], [0, "&Barwed;"], [1, "&lceil;"], [0, "&rceil;"], [0, "&LeftFloor;"], [0, "&rfloor;"], [0, "&drcrop;"], [0, "&dlcrop;"], [0, "&urcrop;"], [0, "&ulcrop;"], [0, "&bnot;"], [1, "&profline;"], [0, "&profsurf;"], [1, "&telrec;"], [0, "&target;"], [5, "&ulcorn;"], [0, "&urcorn;"], [0, "&dlcorn;"], [0, "&drcorn;"], [2, "&frown;"], [0, "&smile;"], [9, "&cylcty;"], [0, "&profalar;"], [7, "&topbot;"], [6, "&ovbar;"], [1, "&solbar;"], [60, "&angzarr;"], [51, "&lmoustache;"], [0, "&rmoustache;"], [2, "&OverBracket;"], [0, "&bbrk;"], [0, "&bbrktbrk;"], [37, "&OverParenthesis;"], [0, "&UnderParenthesis;"], [0, "&OverBrace;"], [0, "&UnderBrace;"], [2, "&trpezium;"], [4, "&elinters;"], [59, "&blank;"], [164, "&circledS;"], [55, "&boxh;"], [1, "&boxv;"], [9, "&boxdr;"], [3, "&boxdl;"], [3, "&boxur;"], [3, "&boxul;"], [3, "&boxvr;"], [7, "&boxvl;"], [7, "&boxhd;"], [7, "&boxhu;"], [7, "&boxvh;"], [19, "&boxH;"], [0, "&boxV;"], [0, "&boxdR;"], [0, "&boxDr;"], [0, "&boxDR;"], [0, "&boxdL;"], [0, "&boxDl;"], [0, "&boxDL;"], [0, "&boxuR;"], [0, "&boxUr;"], [0, "&boxUR;"], [0, "&boxuL;"], [0, "&boxUl;"], [0, "&boxUL;"], [0, "&boxvR;"], [0, "&boxVr;"], [0, "&boxVR;"], [0, "&boxvL;"], [0, "&boxVl;"], [0, "&boxVL;"], [0, "&boxHd;"], [0, "&boxhD;"], [0, "&boxHD;"], [0, "&boxHu;"], [0, "&boxhU;"], [0, "&boxHU;"], [0, "&boxvH;"], [0, "&boxVh;"], [0, "&boxVH;"], [19, "&uhblk;"], [3, "&lhblk;"], [3, "&block;"], [8, "&blk14;"], [0, "&blk12;"], [0, "&blk34;"], [13, "&square;"], [8, "&blacksquare;"], [0, "&EmptyVerySmallSquare;"], [1, "&rect;"], [0, "&marker;"], [2, "&fltns;"], [1, "&bigtriangleup;"], [0, "&blacktriangle;"], [0, "&triangle;"], [2, "&blacktriangleright;"], [0, "&rtri;"], [3, "&bigtriangledown;"], [0, "&blacktriangledown;"], [0, "&dtri;"], [2, "&blacktriangleleft;"], [0, "&ltri;"], [6, "&loz;"], [0, "&cir;"], [32, "&tridot;"], [2, "&bigcirc;"], [8, "&ultri;"], [0, "&urtri;"], [0, "&lltri;"], [0, "&EmptySmallSquare;"], [0, "&FilledSmallSquare;"], [8, "&bigstar;"], [0, "&star;"], [7, "&phone;"], [49, "&female;"], [1, "&male;"], [29, "&spades;"], [2, "&clubs;"], [1, "&hearts;"], [0, "&diamondsuit;"], [3, "&sung;"], [2, "&flat;"], [0, "&natural;"], [0, "&sharp;"], [163, "&check;"], [3, "&cross;"], [8, "&malt;"], [21, "&sext;"], [33, "&VerticalSeparator;"], [25, "&lbbrk;"], [0, "&rbbrk;"], [84, "&bsolhsub;"], [0, "&suphsol;"], [28, "&LeftDoubleBracket;"], [0, "&RightDoubleBracket;"], [0, "&lang;"], [0, "&rang;"], [0, "&Lang;"], [0, "&Rang;"], [0, "&loang;"], [0, "&roang;"], [7, "&longleftarrow;"], [0, "&longrightarrow;"], [0, "&longleftrightarrow;"], [0, "&DoubleLongLeftArrow;"], [0, "&DoubleLongRightArrow;"], [0, "&DoubleLongLeftRightArrow;"], [1, "&longmapsto;"], [2, "&dzigrarr;"], [258, "&nvlArr;"], [0, "&nvrArr;"], [0, "&nvHarr;"], [0, "&Map;"], [6, "&lbarr;"], [0, "&bkarow;"], [0, "&lBarr;"], [0, "&dbkarow;"], [0, "&drbkarow;"], [0, "&DDotrahd;"], [0, "&UpArrowBar;"], [0, "&DownArrowBar;"], [2, "&Rarrtl;"], [2, "&latail;"], [0, "&ratail;"], [0, "&lAtail;"], [0, "&rAtail;"], [0, "&larrfs;"], [0, "&rarrfs;"], [0, "&larrbfs;"], [0, "&rarrbfs;"], [2, "&nwarhk;"], [0, "&nearhk;"], [0, "&hksearow;"], [0, "&hkswarow;"], [0, "&nwnear;"], [0, "&nesear;"], [0, "&seswar;"], [0, "&swnwar;"], [8, { v: "&rarrc;", n: 824, o: "&nrarrc;" }], [1, "&cudarrr;"], [0, "&ldca;"], [0, "&rdca;"], [0, "&cudarrl;"], [0, "&larrpl;"], [2, "&curarrm;"], [0, "&cularrp;"], [7, "&rarrpl;"], [2, "&harrcir;"], [0, "&Uarrocir;"], [0, "&lurdshar;"], [0, "&ldrushar;"], [2, "&LeftRightVector;"], [0, "&RightUpDownVector;"], [0, "&DownLeftRightVector;"], [0, "&LeftUpDownVector;"], [0, "&LeftVectorBar;"], [0, "&RightVectorBar;"], [0, "&RightUpVectorBar;"], [0, "&RightDownVectorBar;"], [0, "&DownLeftVectorBar;"], [0, "&DownRightVectorBar;"], [0, "&LeftUpVectorBar;"], [0, "&LeftDownVectorBar;"], [0, "&LeftTeeVector;"], [0, "&RightTeeVector;"], [0, "&RightUpTeeVector;"], [0, "&RightDownTeeVector;"], [0, "&DownLeftTeeVector;"], [0, "&DownRightTeeVector;"], [0, "&LeftUpTeeVector;"], [0, "&LeftDownTeeVector;"], [0, "&lHar;"], [0, "&uHar;"], [0, "&rHar;"], [0, "&dHar;"], [0, "&luruhar;"], [0, "&ldrdhar;"], [0, "&ruluhar;"], [0, "&rdldhar;"], [0, "&lharul;"], [0, "&llhard;"], [0, "&rharul;"], [0, "&lrhard;"], [0, "&udhar;"], [0, "&duhar;"], [0, "&RoundImplies;"], [0, "&erarr;"], [0, "&simrarr;"], [0, "&larrsim;"], [0, "&rarrsim;"], [0, "&rarrap;"], [0, "&ltlarr;"], [1, "&gtrarr;"], [0, "&subrarr;"], [1, "&suplarr;"], [0, "&lfisht;"], [0, "&rfisht;"], [0, "&ufisht;"], [0, "&dfisht;"], [5, "&lopar;"], [0, "&ropar;"], [4, "&lbrke;"], [0, "&rbrke;"], [0, "&lbrkslu;"], [0, "&rbrksld;"], [0, "&lbrksld;"], [0, "&rbrkslu;"], [0, "&langd;"], [0, "&rangd;"], [0, "&lparlt;"], [0, "&rpargt;"], [0, "&gtlPar;"], [0, "&ltrPar;"], [3, "&vzigzag;"], [1, "&vangrt;"], [0, "&angrtvbd;"], [6, "&ange;"], [0, "&range;"], [0, "&dwangle;"], [0, "&uwangle;"], [0, "&angmsdaa;"], [0, "&angmsdab;"], [0, "&angmsdac;"], [0, "&angmsdad;"], [0, "&angmsdae;"], [0, "&angmsdaf;"], [0, "&angmsdag;"], [0, "&angmsdah;"], [0, "&bemptyv;"], [0, "&demptyv;"], [0, "&cemptyv;"], [0, "&raemptyv;"], [0, "&laemptyv;"], [0, "&ohbar;"], [0, "&omid;"], [0, "&opar;"], [1, "&operp;"], [1, "&olcross;"], [0, "&odsold;"], [1, "&olcir;"], [0, "&ofcir;"], [0, "&olt;"], [0, "&ogt;"], [0, "&cirscir;"], [0, "&cirE;"], [0, "&solb;"], [0, "&bsolb;"], [3, "&boxbox;"], [3, "&trisb;"], [0, "&rtriltri;"], [0, { v: "&LeftTriangleBar;", n: 824, o: "&NotLeftTriangleBar;" }], [0, { v: "&RightTriangleBar;", n: 824, o: "&NotRightTriangleBar;" }], [11, "&iinfin;"], [0, "&infintie;"], [0, "&nvinfin;"], [4, "&eparsl;"], [0, "&smeparsl;"], [0, "&eqvparsl;"], [5, "&blacklozenge;"], [8, "&RuleDelayed;"], [1, "&dsol;"], [9, "&bigodot;"], [0, "&bigoplus;"], [0, "&bigotimes;"], [1, "&biguplus;"], [1, "&bigsqcup;"], [5, "&iiiint;"], [0, "&fpartint;"], [2, "&cirfnint;"], [0, "&awint;"], [0, "&rppolint;"], [0, "&scpolint;"], [0, "&npolint;"], [0, "&pointint;"], [0, "&quatint;"], [0, "&intlarhk;"], [10, "&pluscir;"], [0, "&plusacir;"], [0, "&simplus;"], [0, "&plusdu;"], [0, "&plussim;"], [0, "&plustwo;"], [1, "&mcomma;"], [0, "&minusdu;"], [2, "&loplus;"], [0, "&roplus;"], [0, "&Cross;"], [0, "&timesd;"], [0, "&timesbar;"], [1, "&smashp;"], [0, "&lotimes;"], [0, "&rotimes;"], [0, "&otimesas;"], [0, "&Otimes;"], [0, "&odiv;"], [0, "&triplus;"], [0, "&triminus;"], [0, "&tritime;"], [0, "&intprod;"], [2, "&amalg;"], [0, "&capdot;"], [1, "&ncup;"], [0, "&ncap;"], [0, "&capand;"], [0, "&cupor;"], [0, "&cupcap;"], [0, "&capcup;"], [0, "&cupbrcap;"], [0, "&capbrcup;"], [0, "&cupcup;"], [0, "&capcap;"], [0, "&ccups;"], [0, "&ccaps;"], [2, "&ccupssm;"], [2, "&And;"], [0, "&Or;"], [0, "&andand;"], [0, "&oror;"], [0, "&orslope;"], [0, "&andslope;"], [1, "&andv;"], [0, "&orv;"], [0, "&andd;"], [0, "&ord;"], [1, "&wedbar;"], [6, "&sdote;"], [3, "&simdot;"], [2, { v: "&congdot;", n: 824, o: "&ncongdot;" }], [0, "&easter;"], [0, "&apacir;"], [0, { v: "&apE;", n: 824, o: "&napE;" }], [0, "&eplus;"], [0, "&pluse;"], [0, "&Esim;"], [0, "&Colone;"], [0, "&Equal;"], [1, "&ddotseq;"], [0, "&equivDD;"], [0, "&ltcir;"], [0, "&gtcir;"], [0, "&ltquest;"], [0, "&gtquest;"], [0, { v: "&leqslant;", n: 824, o: "&nleqslant;" }], [0, { v: "&geqslant;", n: 824, o: "&ngeqslant;" }], [0, "&lesdot;"], [0, "&gesdot;"], [0, "&lesdoto;"], [0, "&gesdoto;"], [0, "&lesdotor;"], [0, "&gesdotol;"], [0, "&lap;"], [0, "&gap;"], [0, "&lne;"], [0, "&gne;"], [0, "&lnap;"], [0, "&gnap;"], [0, "&lEg;"], [0, "&gEl;"], [0, "&lsime;"], [0, "&gsime;"], [0, "&lsimg;"], [0, "&gsiml;"], [0, "&lgE;"], [0, "&glE;"], [0, "&lesges;"], [0, "&gesles;"], [0, "&els;"], [0, "&egs;"], [0, "&elsdot;"], [0, "&egsdot;"], [0, "&el;"], [0, "&eg;"], [2, "&siml;"], [0, "&simg;"], [0, "&simlE;"], [0, "&simgE;"], [0, { v: "&LessLess;", n: 824, o: "&NotNestedLessLess;" }], [0, { v: "&GreaterGreater;", n: 824, o: "&NotNestedGreaterGreater;" }], [1, "&glj;"], [0, "&gla;"], [0, "&ltcc;"], [0, "&gtcc;"], [0, "&lescc;"], [0, "&gescc;"], [0, "&smt;"], [0, "&lat;"], [0, { v: "&smte;", n: 65024, o: "&smtes;" }], [0, { v: "&late;", n: 65024, o: "&lates;" }], [0, "&bumpE;"], [0, { v: "&PrecedesEqual;", n: 824, o: "&NotPrecedesEqual;" }], [0, { v: "&sce;", n: 824, o: "&NotSucceedsEqual;" }], [2, "&prE;"], [0, "&scE;"], [0, "&precneqq;"], [0, "&scnE;"], [0, "&prap;"], [0, "&scap;"], [0, "&precnapprox;"], [0, "&scnap;"], [0, "&Pr;"], [0, "&Sc;"], [0, "&subdot;"], [0, "&supdot;"], [0, "&subplus;"], [0, "&supplus;"], [0, "&submult;"], [0, "&supmult;"], [0, "&subedot;"], [0, "&supedot;"], [0, { v: "&subE;", n: 824, o: "&nsubE;" }], [0, { v: "&supE;", n: 824, o: "&nsupE;" }], [0, "&subsim;"], [0, "&supsim;"], [2, { v: "&subnE;", n: 65024, o: "&varsubsetneqq;" }], [0, { v: "&supnE;", n: 65024, o: "&varsupsetneqq;" }], [2, "&csub;"], [0, "&csup;"], [0, "&csube;"], [0, "&csupe;"], [0, "&subsup;"], [0, "&supsub;"], [0, "&subsub;"], [0, "&supsup;"], [0, "&suphsub;"], [0, "&supdsub;"], [0, "&forkv;"], [0, "&topfork;"], [0, "&mlcp;"], [8, "&Dashv;"], [1, "&Vdashl;"], [0, "&Barv;"], [0, "&vBar;"], [0, "&vBarv;"], [1, "&Vbar;"], [0, "&Not;"], [0, "&bNot;"], [0, "&rnmid;"], [0, "&cirmid;"], [0, "&midcir;"], [0, "&topcir;"], [0, "&nhpar;"], [0, "&parsim;"], [9, { v: "&parsl;", n: 8421, o: "&nparsl;" }], [44343, { n: new Map(/* @__PURE__ */ restoreDiff([[56476, "&Ascr;"], [1, "&Cscr;"], [0, "&Dscr;"], [2, "&Gscr;"], [2, "&Jscr;"], [0, "&Kscr;"], [2, "&Nscr;"], [0, "&Oscr;"], [0, "&Pscr;"], [0, "&Qscr;"], [1, "&Sscr;"], [0, "&Tscr;"], [0, "&Uscr;"], [0, "&Vscr;"], [0, "&Wscr;"], [0, "&Xscr;"], [0, "&Yscr;"], [0, "&Zscr;"], [0, "&ascr;"], [0, "&bscr;"], [0, "&cscr;"], [0, "&dscr;"], [1, "&fscr;"], [1, "&hscr;"], [0, "&iscr;"], [0, "&jscr;"], [0, "&kscr;"], [0, "&lscr;"], [0, "&mscr;"], [0, "&nscr;"], [1, "&pscr;"], [0, "&qscr;"], [0, "&rscr;"], [0, "&sscr;"], [0, "&tscr;"], [0, "&uscr;"], [0, "&vscr;"], [0, "&wscr;"], [0, "&xscr;"], [0, "&yscr;"], [0, "&zscr;"], [52, "&Afr;"], [0, "&Bfr;"], [1, "&Dfr;"], [0, "&Efr;"], [0, "&Ffr;"], [0, "&Gfr;"], [2, "&Jfr;"], [0, "&Kfr;"], [0, "&Lfr;"], [0, "&Mfr;"], [0, "&Nfr;"], [0, "&Ofr;"], [0, "&Pfr;"], [0, "&Qfr;"], [1, "&Sfr;"], [0, "&Tfr;"], [0, "&Ufr;"], [0, "&Vfr;"], [0, "&Wfr;"], [0, "&Xfr;"], [0, "&Yfr;"], [1, "&afr;"], [0, "&bfr;"], [0, "&cfr;"], [0, "&dfr;"], [0, "&efr;"], [0, "&ffr;"], [0, "&gfr;"], [0, "&hfr;"], [0, "&ifr;"], [0, "&jfr;"], [0, "&kfr;"], [0, "&lfr;"], [0, "&mfr;"], [0, "&nfr;"], [0, "&ofr;"], [0, "&pfr;"], [0, "&qfr;"], [0, "&rfr;"], [0, "&sfr;"], [0, "&tfr;"], [0, "&ufr;"], [0, "&vfr;"], [0, "&wfr;"], [0, "&xfr;"], [0, "&yfr;"], [0, "&zfr;"], [0, "&Aopf;"], [0, "&Bopf;"], [1, "&Dopf;"], [0, "&Eopf;"], [0, "&Fopf;"], [0, "&Gopf;"], [1, "&Iopf;"], [0, "&Jopf;"], [0, "&Kopf;"], [0, "&Lopf;"], [0, "&Mopf;"], [1, "&Oopf;"], [3, "&Sopf;"], [0, "&Topf;"], [0, "&Uopf;"], [0, "&Vopf;"], [0, "&Wopf;"], [0, "&Xopf;"], [0, "&Yopf;"], [1, "&aopf;"], [0, "&bopf;"], [0, "&copf;"], [0, "&dopf;"], [0, "&eopf;"], [0, "&fopf;"], [0, "&gopf;"], [0, "&hopf;"], [0, "&iopf;"], [0, "&jopf;"], [0, "&kopf;"], [0, "&lopf;"], [0, "&mopf;"], [0, "&nopf;"], [0, "&oopf;"], [0, "&popf;"], [0, "&qopf;"], [0, "&ropf;"], [0, "&sopf;"], [0, "&topf;"], [0, "&uopf;"], [0, "&vopf;"], [0, "&wopf;"], [0, "&xopf;"], [0, "&yopf;"], [0, "&zopf;"]])) }], [8906, "&fflig;"], [0, "&filig;"], [0, "&fllig;"], [0, "&ffilig;"], [0, "&ffllig;"]]));
  return encodeHtml;
}
var _escape = {};
var hasRequired_escape;
function require_escape() {
  if (hasRequired_escape) return _escape;
  hasRequired_escape = 1;
  (function(exports$1) {
    Object.defineProperty(exports$1, "__esModule", { value: true });
    exports$1.escapeText = exports$1.escapeAttribute = exports$1.escapeUTF8 = exports$1.escape = exports$1.encodeXML = exports$1.getCodePoint = exports$1.xmlReplacer = void 0;
    exports$1.xmlReplacer = /["&'<>$\x80-\uFFFF]/g;
    var xmlCodeMap = /* @__PURE__ */ new Map([
      [34, "&quot;"],
      [38, "&amp;"],
      [39, "&apos;"],
      [60, "&lt;"],
      [62, "&gt;"]
    ]);
    exports$1.getCodePoint = // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    String.prototype.codePointAt != null ? function(str, index) {
      return str.codePointAt(index);
    } : (
      // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
      function(c, index) {
        return (c.charCodeAt(index) & 64512) === 55296 ? (c.charCodeAt(index) - 55296) * 1024 + c.charCodeAt(index + 1) - 56320 + 65536 : c.charCodeAt(index);
      }
    );
    function encodeXML(str) {
      var ret = "";
      var lastIdx = 0;
      var match;
      while ((match = exports$1.xmlReplacer.exec(str)) !== null) {
        var i = match.index;
        var char = str.charCodeAt(i);
        var next = xmlCodeMap.get(char);
        if (next !== void 0) {
          ret += str.substring(lastIdx, i) + next;
          lastIdx = i + 1;
        } else {
          ret += "".concat(str.substring(lastIdx, i), "&#x").concat((0, exports$1.getCodePoint)(str, i).toString(16), ";");
          lastIdx = exports$1.xmlReplacer.lastIndex += Number((char & 64512) === 55296);
        }
      }
      return ret + str.substr(lastIdx);
    }
    exports$1.encodeXML = encodeXML;
    exports$1.escape = encodeXML;
    function getEscaper(regex, map) {
      return function escape(data) {
        var match;
        var lastIdx = 0;
        var result2 = "";
        while (match = regex.exec(data)) {
          if (lastIdx !== match.index) {
            result2 += data.substring(lastIdx, match.index);
          }
          result2 += map.get(match[0].charCodeAt(0));
          lastIdx = match.index + 1;
        }
        return result2 + data.substring(lastIdx);
      };
    }
    exports$1.escapeUTF8 = getEscaper(/[&<>'"]/g, xmlCodeMap);
    exports$1.escapeAttribute = getEscaper(/["&\u00A0]/g, /* @__PURE__ */ new Map([
      [34, "&quot;"],
      [38, "&amp;"],
      [160, "&nbsp;"]
    ]));
    exports$1.escapeText = getEscaper(/[&<>\u00A0]/g, /* @__PURE__ */ new Map([
      [38, "&amp;"],
      [60, "&lt;"],
      [62, "&gt;"],
      [160, "&nbsp;"]
    ]));
  })(_escape);
  return _escape;
}
var hasRequiredEncode;
function requireEncode() {
  if (hasRequiredEncode) return encode;
  hasRequiredEncode = 1;
  var __importDefault = encode && encode.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(encode, "__esModule", { value: true });
  encode.encodeNonAsciiHTML = encode.encodeHTML = void 0;
  var encode_html_js_1 = __importDefault(/* @__PURE__ */ requireEncodeHtml());
  var escape_js_1 = /* @__PURE__ */ require_escape();
  var htmlReplacer = /[\t\n!-,./:-@[-`\f{-}$\x80-\uFFFF]/g;
  function encodeHTML(data) {
    return encodeHTMLTrieRe(htmlReplacer, data);
  }
  encode.encodeHTML = encodeHTML;
  function encodeNonAsciiHTML(data) {
    return encodeHTMLTrieRe(escape_js_1.xmlReplacer, data);
  }
  encode.encodeNonAsciiHTML = encodeNonAsciiHTML;
  function encodeHTMLTrieRe(regExp, str) {
    var ret = "";
    var lastIdx = 0;
    var match;
    while ((match = regExp.exec(str)) !== null) {
      var i = match.index;
      ret += str.substring(lastIdx, i);
      var char = str.charCodeAt(i);
      var next = encode_html_js_1.default.get(char);
      if (typeof next === "object") {
        if (i + 1 < str.length) {
          var nextChar = str.charCodeAt(i + 1);
          var value = typeof next.n === "number" ? next.n === nextChar ? next.o : void 0 : next.n.get(nextChar);
          if (value !== void 0) {
            ret += value;
            lastIdx = regExp.lastIndex += 1;
            continue;
          }
        }
        next = next.v;
      }
      if (next !== void 0) {
        ret += next;
        lastIdx = i + 1;
      } else {
        var cp = (0, escape_js_1.getCodePoint)(str, i);
        ret += "&#x".concat(cp.toString(16), ";");
        lastIdx = regExp.lastIndex += Number(cp !== char);
      }
    }
    return ret + str.substr(lastIdx);
  }
  return encode;
}
var hasRequiredLib$3;
function requireLib$3() {
  if (hasRequiredLib$3) return lib;
  hasRequiredLib$3 = 1;
  (function(exports$1) {
    Object.defineProperty(exports$1, "__esModule", { value: true });
    exports$1.decodeXMLStrict = exports$1.decodeHTML5Strict = exports$1.decodeHTML4Strict = exports$1.decodeHTML5 = exports$1.decodeHTML4 = exports$1.decodeHTMLAttribute = exports$1.decodeHTMLStrict = exports$1.decodeHTML = exports$1.decodeXML = exports$1.DecodingMode = exports$1.EntityDecoder = exports$1.encodeHTML5 = exports$1.encodeHTML4 = exports$1.encodeNonAsciiHTML = exports$1.encodeHTML = exports$1.escapeText = exports$1.escapeAttribute = exports$1.escapeUTF8 = exports$1.escape = exports$1.encodeXML = exports$1.encode = exports$1.decodeStrict = exports$1.decode = exports$1.EncodingMode = exports$1.EntityLevel = void 0;
    var decode_js_1 = /* @__PURE__ */ requireDecode();
    var encode_js_1 = /* @__PURE__ */ requireEncode();
    var escape_js_1 = /* @__PURE__ */ require_escape();
    var EntityLevel;
    (function(EntityLevel2) {
      EntityLevel2[EntityLevel2["XML"] = 0] = "XML";
      EntityLevel2[EntityLevel2["HTML"] = 1] = "HTML";
    })(EntityLevel = exports$1.EntityLevel || (exports$1.EntityLevel = {}));
    var EncodingMode;
    (function(EncodingMode2) {
      EncodingMode2[EncodingMode2["UTF8"] = 0] = "UTF8";
      EncodingMode2[EncodingMode2["ASCII"] = 1] = "ASCII";
      EncodingMode2[EncodingMode2["Extensive"] = 2] = "Extensive";
      EncodingMode2[EncodingMode2["Attribute"] = 3] = "Attribute";
      EncodingMode2[EncodingMode2["Text"] = 4] = "Text";
    })(EncodingMode = exports$1.EncodingMode || (exports$1.EncodingMode = {}));
    function decode2(data, options) {
      if (options === void 0) {
        options = EntityLevel.XML;
      }
      var level = typeof options === "number" ? options : options.level;
      if (level === EntityLevel.HTML) {
        var mode = typeof options === "object" ? options.mode : void 0;
        return (0, decode_js_1.decodeHTML)(data, mode);
      }
      return (0, decode_js_1.decodeXML)(data);
    }
    exports$1.decode = decode2;
    function decodeStrict(data, options) {
      var _a2;
      if (options === void 0) {
        options = EntityLevel.XML;
      }
      var opts = typeof options === "number" ? { level: options } : options;
      (_a2 = opts.mode) !== null && _a2 !== void 0 ? _a2 : opts.mode = decode_js_1.DecodingMode.Strict;
      return decode2(data, opts);
    }
    exports$1.decodeStrict = decodeStrict;
    function encode2(data, options) {
      if (options === void 0) {
        options = EntityLevel.XML;
      }
      var opts = typeof options === "number" ? { level: options } : options;
      if (opts.mode === EncodingMode.UTF8)
        return (0, escape_js_1.escapeUTF8)(data);
      if (opts.mode === EncodingMode.Attribute)
        return (0, escape_js_1.escapeAttribute)(data);
      if (opts.mode === EncodingMode.Text)
        return (0, escape_js_1.escapeText)(data);
      if (opts.level === EntityLevel.HTML) {
        if (opts.mode === EncodingMode.ASCII) {
          return (0, encode_js_1.encodeNonAsciiHTML)(data);
        }
        return (0, encode_js_1.encodeHTML)(data);
      }
      return (0, escape_js_1.encodeXML)(data);
    }
    exports$1.encode = encode2;
    var escape_js_2 = /* @__PURE__ */ require_escape();
    Object.defineProperty(exports$1, "encodeXML", { enumerable: true, get: function() {
      return escape_js_2.encodeXML;
    } });
    Object.defineProperty(exports$1, "escape", { enumerable: true, get: function() {
      return escape_js_2.escape;
    } });
    Object.defineProperty(exports$1, "escapeUTF8", { enumerable: true, get: function() {
      return escape_js_2.escapeUTF8;
    } });
    Object.defineProperty(exports$1, "escapeAttribute", { enumerable: true, get: function() {
      return escape_js_2.escapeAttribute;
    } });
    Object.defineProperty(exports$1, "escapeText", { enumerable: true, get: function() {
      return escape_js_2.escapeText;
    } });
    var encode_js_2 = /* @__PURE__ */ requireEncode();
    Object.defineProperty(exports$1, "encodeHTML", { enumerable: true, get: function() {
      return encode_js_2.encodeHTML;
    } });
    Object.defineProperty(exports$1, "encodeNonAsciiHTML", { enumerable: true, get: function() {
      return encode_js_2.encodeNonAsciiHTML;
    } });
    Object.defineProperty(exports$1, "encodeHTML4", { enumerable: true, get: function() {
      return encode_js_2.encodeHTML;
    } });
    Object.defineProperty(exports$1, "encodeHTML5", { enumerable: true, get: function() {
      return encode_js_2.encodeHTML;
    } });
    var decode_js_2 = /* @__PURE__ */ requireDecode();
    Object.defineProperty(exports$1, "EntityDecoder", { enumerable: true, get: function() {
      return decode_js_2.EntityDecoder;
    } });
    Object.defineProperty(exports$1, "DecodingMode", { enumerable: true, get: function() {
      return decode_js_2.DecodingMode;
    } });
    Object.defineProperty(exports$1, "decodeXML", { enumerable: true, get: function() {
      return decode_js_2.decodeXML;
    } });
    Object.defineProperty(exports$1, "decodeHTML", { enumerable: true, get: function() {
      return decode_js_2.decodeHTML;
    } });
    Object.defineProperty(exports$1, "decodeHTMLStrict", { enumerable: true, get: function() {
      return decode_js_2.decodeHTMLStrict;
    } });
    Object.defineProperty(exports$1, "decodeHTMLAttribute", { enumerable: true, get: function() {
      return decode_js_2.decodeHTMLAttribute;
    } });
    Object.defineProperty(exports$1, "decodeHTML4", { enumerable: true, get: function() {
      return decode_js_2.decodeHTML;
    } });
    Object.defineProperty(exports$1, "decodeHTML5", { enumerable: true, get: function() {
      return decode_js_2.decodeHTML;
    } });
    Object.defineProperty(exports$1, "decodeHTML4Strict", { enumerable: true, get: function() {
      return decode_js_2.decodeHTMLStrict;
    } });
    Object.defineProperty(exports$1, "decodeHTML5Strict", { enumerable: true, get: function() {
      return decode_js_2.decodeHTMLStrict;
    } });
    Object.defineProperty(exports$1, "decodeXMLStrict", { enumerable: true, get: function() {
      return decode_js_2.decodeXML;
    } });
  })(lib);
  return lib;
}
var foreignNames = {};
var hasRequiredForeignNames;
function requireForeignNames() {
  if (hasRequiredForeignNames) return foreignNames;
  hasRequiredForeignNames = 1;
  Object.defineProperty(foreignNames, "__esModule", { value: true });
  foreignNames.attributeNames = foreignNames.elementNames = void 0;
  foreignNames.elementNames = new Map([
    "altGlyph",
    "altGlyphDef",
    "altGlyphItem",
    "animateColor",
    "animateMotion",
    "animateTransform",
    "clipPath",
    "feBlend",
    "feColorMatrix",
    "feComponentTransfer",
    "feComposite",
    "feConvolveMatrix",
    "feDiffuseLighting",
    "feDisplacementMap",
    "feDistantLight",
    "feDropShadow",
    "feFlood",
    "feFuncA",
    "feFuncB",
    "feFuncG",
    "feFuncR",
    "feGaussianBlur",
    "feImage",
    "feMerge",
    "feMergeNode",
    "feMorphology",
    "feOffset",
    "fePointLight",
    "feSpecularLighting",
    "feSpotLight",
    "feTile",
    "feTurbulence",
    "foreignObject",
    "glyphRef",
    "linearGradient",
    "radialGradient",
    "textPath"
  ].map(function(val) {
    return [val.toLowerCase(), val];
  }));
  foreignNames.attributeNames = new Map([
    "definitionURL",
    "attributeName",
    "attributeType",
    "baseFrequency",
    "baseProfile",
    "calcMode",
    "clipPathUnits",
    "diffuseConstant",
    "edgeMode",
    "filterUnits",
    "glyphRef",
    "gradientTransform",
    "gradientUnits",
    "kernelMatrix",
    "kernelUnitLength",
    "keyPoints",
    "keySplines",
    "keyTimes",
    "lengthAdjust",
    "limitingConeAngle",
    "markerHeight",
    "markerUnits",
    "markerWidth",
    "maskContentUnits",
    "maskUnits",
    "numOctaves",
    "pathLength",
    "patternContentUnits",
    "patternTransform",
    "patternUnits",
    "pointsAtX",
    "pointsAtY",
    "pointsAtZ",
    "preserveAlpha",
    "preserveAspectRatio",
    "primitiveUnits",
    "refX",
    "refY",
    "repeatCount",
    "repeatDur",
    "requiredExtensions",
    "requiredFeatures",
    "specularConstant",
    "specularExponent",
    "spreadMethod",
    "startOffset",
    "stdDeviation",
    "stitchTiles",
    "surfaceScale",
    "systemLanguage",
    "tableValues",
    "targetX",
    "targetY",
    "textLength",
    "viewBox",
    "viewTarget",
    "xChannelSelector",
    "yChannelSelector",
    "zoomAndPan"
  ].map(function(val) {
    return [val.toLowerCase(), val];
  }));
  return foreignNames;
}
var hasRequiredLib$2;
function requireLib$2() {
  if (hasRequiredLib$2) return lib$1;
  hasRequiredLib$2 = 1;
  var __assign = lib$1 && lib$1.__assign || function() {
    __assign = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
          t[p] = s[p];
      }
      return t;
    };
    return __assign.apply(this, arguments);
  };
  var __createBinding = lib$1 && lib$1.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = lib$1 && lib$1.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = lib$1 && lib$1.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result2 = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
    }
    __setModuleDefault(result2, mod);
    return result2;
  };
  Object.defineProperty(lib$1, "__esModule", { value: true });
  lib$1.render = void 0;
  var ElementType = __importStar(/* @__PURE__ */ requireLib$5());
  var entities_1 = /* @__PURE__ */ requireLib$3();
  var foreignNames_js_1 = /* @__PURE__ */ requireForeignNames();
  var unencodedElements = /* @__PURE__ */ new Set([
    "style",
    "script",
    "xmp",
    "iframe",
    "noembed",
    "noframes",
    "plaintext",
    "noscript"
  ]);
  function replaceQuotes(value) {
    return value.replace(/"/g, "&quot;");
  }
  function formatAttributes(attributes, opts) {
    var _a2;
    if (!attributes)
      return;
    var encode2 = ((_a2 = opts.encodeEntities) !== null && _a2 !== void 0 ? _a2 : opts.decodeEntities) === false ? replaceQuotes : opts.xmlMode || opts.encodeEntities !== "utf8" ? entities_1.encodeXML : entities_1.escapeAttribute;
    return Object.keys(attributes).map(function(key2) {
      var _a3, _b;
      var value = (_a3 = attributes[key2]) !== null && _a3 !== void 0 ? _a3 : "";
      if (opts.xmlMode === "foreign") {
        key2 = (_b = foreignNames_js_1.attributeNames.get(key2)) !== null && _b !== void 0 ? _b : key2;
      }
      if (!opts.emptyAttrs && !opts.xmlMode && value === "") {
        return key2;
      }
      return "".concat(key2, '="').concat(encode2(value), '"');
    }).join(" ");
  }
  var singleTag = /* @__PURE__ */ new Set([
    "area",
    "base",
    "basefont",
    "br",
    "col",
    "command",
    "embed",
    "frame",
    "hr",
    "img",
    "input",
    "isindex",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr"
  ]);
  function render(node2, options) {
    if (options === void 0) {
      options = {};
    }
    var nodes = "length" in node2 ? node2 : [node2];
    var output = "";
    for (var i = 0; i < nodes.length; i++) {
      output += renderNode(nodes[i], options);
    }
    return output;
  }
  lib$1.render = render;
  lib$1.default = render;
  function renderNode(node2, options) {
    switch (node2.type) {
      case ElementType.Root:
        return render(node2.children, options);
      // @ts-expect-error We don't use `Doctype` yet
      case ElementType.Doctype:
      case ElementType.Directive:
        return renderDirective(node2);
      case ElementType.Comment:
        return renderComment(node2);
      case ElementType.CDATA:
        return renderCdata(node2);
      case ElementType.Script:
      case ElementType.Style:
      case ElementType.Tag:
        return renderTag(node2, options);
      case ElementType.Text:
        return renderText(node2, options);
    }
  }
  var foreignModeIntegrationPoints = /* @__PURE__ */ new Set([
    "mi",
    "mo",
    "mn",
    "ms",
    "mtext",
    "annotation-xml",
    "foreignObject",
    "desc",
    "title"
  ]);
  var foreignElements = /* @__PURE__ */ new Set(["svg", "math"]);
  function renderTag(elem, opts) {
    var _a2;
    if (opts.xmlMode === "foreign") {
      elem.name = (_a2 = foreignNames_js_1.elementNames.get(elem.name)) !== null && _a2 !== void 0 ? _a2 : elem.name;
      if (elem.parent && foreignModeIntegrationPoints.has(elem.parent.name)) {
        opts = __assign(__assign({}, opts), { xmlMode: false });
      }
    }
    if (!opts.xmlMode && foreignElements.has(elem.name)) {
      opts = __assign(__assign({}, opts), { xmlMode: "foreign" });
    }
    var tag = "<".concat(elem.name);
    var attribs = formatAttributes(elem.attribs, opts);
    if (attribs) {
      tag += " ".concat(attribs);
    }
    if (elem.children.length === 0 && (opts.xmlMode ? (
      // In XML mode or foreign mode, and user hasn't explicitly turned off self-closing tags
      opts.selfClosingTags !== false
    ) : (
      // User explicitly asked for self-closing tags, even in HTML mode
      opts.selfClosingTags && singleTag.has(elem.name)
    ))) {
      if (!opts.xmlMode)
        tag += " ";
      tag += "/>";
    } else {
      tag += ">";
      if (elem.children.length > 0) {
        tag += render(elem.children, opts);
      }
      if (opts.xmlMode || !singleTag.has(elem.name)) {
        tag += "</".concat(elem.name, ">");
      }
    }
    return tag;
  }
  function renderDirective(elem) {
    return "<".concat(elem.data, ">");
  }
  function renderText(elem, opts) {
    var _a2;
    var data = elem.data || "";
    if (((_a2 = opts.encodeEntities) !== null && _a2 !== void 0 ? _a2 : opts.decodeEntities) !== false && !(!opts.xmlMode && elem.parent && unencodedElements.has(elem.parent.name))) {
      data = opts.xmlMode || opts.encodeEntities !== "utf8" ? (0, entities_1.encodeXML)(data) : (0, entities_1.escapeText)(data);
    }
    return data;
  }
  function renderCdata(elem) {
    return "<![CDATA[".concat(elem.children[0].data, "]]>");
  }
  function renderComment(elem) {
    return "<!--".concat(elem.data, "-->");
  }
  return lib$1;
}
var hasRequiredStringify$1;
function requireStringify$1() {
  if (hasRequiredStringify$1) return stringify;
  hasRequiredStringify$1 = 1;
  var __importDefault = stringify && stringify.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(stringify, "__esModule", { value: true });
  stringify.getOuterHTML = getOuterHTML;
  stringify.getInnerHTML = getInnerHTML;
  stringify.getText = getText;
  stringify.textContent = textContent;
  stringify.innerText = innerText;
  var domhandler_1 = /* @__PURE__ */ requireLib$4();
  var dom_serializer_1 = __importDefault(/* @__PURE__ */ requireLib$2());
  var domelementtype_1 = /* @__PURE__ */ requireLib$5();
  function getOuterHTML(node2, options) {
    return (0, dom_serializer_1.default)(node2, options);
  }
  function getInnerHTML(node2, options) {
    return (0, domhandler_1.hasChildren)(node2) ? node2.children.map(function(node3) {
      return getOuterHTML(node3, options);
    }).join("") : "";
  }
  function getText(node2) {
    if (Array.isArray(node2))
      return node2.map(getText).join("");
    if ((0, domhandler_1.isTag)(node2))
      return node2.name === "br" ? "\n" : getText(node2.children);
    if ((0, domhandler_1.isCDATA)(node2))
      return getText(node2.children);
    if ((0, domhandler_1.isText)(node2))
      return node2.data;
    return "";
  }
  function textContent(node2) {
    if (Array.isArray(node2))
      return node2.map(textContent).join("");
    if ((0, domhandler_1.hasChildren)(node2) && !(0, domhandler_1.isComment)(node2)) {
      return textContent(node2.children);
    }
    if ((0, domhandler_1.isText)(node2))
      return node2.data;
    return "";
  }
  function innerText(node2) {
    if (Array.isArray(node2))
      return node2.map(innerText).join("");
    if ((0, domhandler_1.hasChildren)(node2) && (node2.type === domelementtype_1.ElementType.Tag || (0, domhandler_1.isCDATA)(node2))) {
      return innerText(node2.children);
    }
    if ((0, domhandler_1.isText)(node2))
      return node2.data;
    return "";
  }
  return stringify;
}
var traversal = {};
var hasRequiredTraversal;
function requireTraversal() {
  if (hasRequiredTraversal) return traversal;
  hasRequiredTraversal = 1;
  Object.defineProperty(traversal, "__esModule", { value: true });
  traversal.getChildren = getChildren;
  traversal.getParent = getParent;
  traversal.getSiblings = getSiblings;
  traversal.getAttributeValue = getAttributeValue;
  traversal.hasAttrib = hasAttrib;
  traversal.getName = getName;
  traversal.nextElementSibling = nextElementSibling;
  traversal.prevElementSibling = prevElementSibling;
  var domhandler_1 = /* @__PURE__ */ requireLib$4();
  function getChildren(elem) {
    return (0, domhandler_1.hasChildren)(elem) ? elem.children : [];
  }
  function getParent(elem) {
    return elem.parent || null;
  }
  function getSiblings(elem) {
    var _a2, _b;
    var parent = getParent(elem);
    if (parent != null)
      return getChildren(parent);
    var siblings = [elem];
    var prev = elem.prev, next = elem.next;
    while (prev != null) {
      siblings.unshift(prev);
      _a2 = prev, prev = _a2.prev;
    }
    while (next != null) {
      siblings.push(next);
      _b = next, next = _b.next;
    }
    return siblings;
  }
  function getAttributeValue(elem, name) {
    var _a2;
    return (_a2 = elem.attribs) === null || _a2 === void 0 ? void 0 : _a2[name];
  }
  function hasAttrib(elem, name) {
    return elem.attribs != null && Object.prototype.hasOwnProperty.call(elem.attribs, name) && elem.attribs[name] != null;
  }
  function getName(elem) {
    return elem.name;
  }
  function nextElementSibling(elem) {
    var _a2;
    var next = elem.next;
    while (next !== null && !(0, domhandler_1.isTag)(next))
      _a2 = next, next = _a2.next;
    return next;
  }
  function prevElementSibling(elem) {
    var _a2;
    var prev = elem.prev;
    while (prev !== null && !(0, domhandler_1.isTag)(prev))
      _a2 = prev, prev = _a2.prev;
    return prev;
  }
  return traversal;
}
var manipulation = {};
var hasRequiredManipulation;
function requireManipulation() {
  if (hasRequiredManipulation) return manipulation;
  hasRequiredManipulation = 1;
  Object.defineProperty(manipulation, "__esModule", { value: true });
  manipulation.removeElement = removeElement;
  manipulation.replaceElement = replaceElement;
  manipulation.appendChild = appendChild;
  manipulation.append = append;
  manipulation.prependChild = prependChild;
  manipulation.prepend = prepend;
  function removeElement(elem) {
    if (elem.prev)
      elem.prev.next = elem.next;
    if (elem.next)
      elem.next.prev = elem.prev;
    if (elem.parent) {
      var childs = elem.parent.children;
      var childsIndex = childs.lastIndexOf(elem);
      if (childsIndex >= 0) {
        childs.splice(childsIndex, 1);
      }
    }
    elem.next = null;
    elem.prev = null;
    elem.parent = null;
  }
  function replaceElement(elem, replacement) {
    var prev = replacement.prev = elem.prev;
    if (prev) {
      prev.next = replacement;
    }
    var next = replacement.next = elem.next;
    if (next) {
      next.prev = replacement;
    }
    var parent = replacement.parent = elem.parent;
    if (parent) {
      var childs = parent.children;
      childs[childs.lastIndexOf(elem)] = replacement;
      elem.parent = null;
    }
  }
  function appendChild(parent, child) {
    removeElement(child);
    child.next = null;
    child.parent = parent;
    if (parent.children.push(child) > 1) {
      var sibling = parent.children[parent.children.length - 2];
      sibling.next = child;
      child.prev = sibling;
    } else {
      child.prev = null;
    }
  }
  function append(elem, next) {
    removeElement(next);
    var parent = elem.parent;
    var currNext = elem.next;
    next.next = currNext;
    next.prev = elem;
    elem.next = next;
    next.parent = parent;
    if (currNext) {
      currNext.prev = next;
      if (parent) {
        var childs = parent.children;
        childs.splice(childs.lastIndexOf(currNext), 0, next);
      }
    } else if (parent) {
      parent.children.push(next);
    }
  }
  function prependChild(parent, child) {
    removeElement(child);
    child.parent = parent;
    child.prev = null;
    if (parent.children.unshift(child) !== 1) {
      var sibling = parent.children[1];
      sibling.prev = child;
      child.next = sibling;
    } else {
      child.next = null;
    }
  }
  function prepend(elem, prev) {
    removeElement(prev);
    var parent = elem.parent;
    if (parent) {
      var childs = parent.children;
      childs.splice(childs.indexOf(elem), 0, prev);
    }
    if (elem.prev) {
      elem.prev.next = prev;
    }
    prev.parent = parent;
    prev.prev = elem.prev;
    prev.next = elem;
    elem.prev = prev;
  }
  return manipulation;
}
var querying = {};
var hasRequiredQuerying;
function requireQuerying() {
  if (hasRequiredQuerying) return querying;
  hasRequiredQuerying = 1;
  Object.defineProperty(querying, "__esModule", { value: true });
  querying.filter = filter;
  querying.find = find;
  querying.findOneChild = findOneChild;
  querying.findOne = findOne;
  querying.existsOne = existsOne;
  querying.findAll = findAll;
  var domhandler_1 = /* @__PURE__ */ requireLib$4();
  function filter(test, node2, recurse, limit) {
    if (recurse === void 0) {
      recurse = true;
    }
    if (limit === void 0) {
      limit = Infinity;
    }
    return find(test, Array.isArray(node2) ? node2 : [node2], recurse, limit);
  }
  function find(test, nodes, recurse, limit) {
    var result2 = [];
    var nodeStack = [Array.isArray(nodes) ? nodes : [nodes]];
    var indexStack = [0];
    for (; ; ) {
      if (indexStack[0] >= nodeStack[0].length) {
        if (indexStack.length === 1) {
          return result2;
        }
        nodeStack.shift();
        indexStack.shift();
        continue;
      }
      var elem = nodeStack[0][indexStack[0]++];
      if (test(elem)) {
        result2.push(elem);
        if (--limit <= 0)
          return result2;
      }
      if (recurse && (0, domhandler_1.hasChildren)(elem) && elem.children.length > 0) {
        indexStack.unshift(0);
        nodeStack.unshift(elem.children);
      }
    }
  }
  function findOneChild(test, nodes) {
    return nodes.find(test);
  }
  function findOne(test, nodes, recurse) {
    if (recurse === void 0) {
      recurse = true;
    }
    var searchedNodes = Array.isArray(nodes) ? nodes : [nodes];
    for (var i = 0; i < searchedNodes.length; i++) {
      var node2 = searchedNodes[i];
      if ((0, domhandler_1.isTag)(node2) && test(node2)) {
        return node2;
      }
      if (recurse && (0, domhandler_1.hasChildren)(node2) && node2.children.length > 0) {
        var found = findOne(test, node2.children, true);
        if (found)
          return found;
      }
    }
    return null;
  }
  function existsOne(test, nodes) {
    return (Array.isArray(nodes) ? nodes : [nodes]).some(function(node2) {
      return (0, domhandler_1.isTag)(node2) && test(node2) || (0, domhandler_1.hasChildren)(node2) && existsOne(test, node2.children);
    });
  }
  function findAll(test, nodes) {
    var result2 = [];
    var nodeStack = [Array.isArray(nodes) ? nodes : [nodes]];
    var indexStack = [0];
    for (; ; ) {
      if (indexStack[0] >= nodeStack[0].length) {
        if (nodeStack.length === 1) {
          return result2;
        }
        nodeStack.shift();
        indexStack.shift();
        continue;
      }
      var elem = nodeStack[0][indexStack[0]++];
      if ((0, domhandler_1.isTag)(elem) && test(elem))
        result2.push(elem);
      if ((0, domhandler_1.hasChildren)(elem) && elem.children.length > 0) {
        indexStack.unshift(0);
        nodeStack.unshift(elem.children);
      }
    }
  }
  return querying;
}
var legacy = {};
var hasRequiredLegacy;
function requireLegacy() {
  if (hasRequiredLegacy) return legacy;
  hasRequiredLegacy = 1;
  Object.defineProperty(legacy, "__esModule", { value: true });
  legacy.testElement = testElement;
  legacy.getElements = getElements;
  legacy.getElementById = getElementById;
  legacy.getElementsByTagName = getElementsByTagName;
  legacy.getElementsByClassName = getElementsByClassName;
  legacy.getElementsByTagType = getElementsByTagType;
  var domhandler_1 = /* @__PURE__ */ requireLib$4();
  var querying_js_1 = /* @__PURE__ */ requireQuerying();
  var Checks = {
    tag_name: function(name) {
      if (typeof name === "function") {
        return function(elem) {
          return (0, domhandler_1.isTag)(elem) && name(elem.name);
        };
      } else if (name === "*") {
        return domhandler_1.isTag;
      }
      return function(elem) {
        return (0, domhandler_1.isTag)(elem) && elem.name === name;
      };
    },
    tag_type: function(type) {
      if (typeof type === "function") {
        return function(elem) {
          return type(elem.type);
        };
      }
      return function(elem) {
        return elem.type === type;
      };
    },
    tag_contains: function(data) {
      if (typeof data === "function") {
        return function(elem) {
          return (0, domhandler_1.isText)(elem) && data(elem.data);
        };
      }
      return function(elem) {
        return (0, domhandler_1.isText)(elem) && elem.data === data;
      };
    }
  };
  function getAttribCheck(attrib, value) {
    if (typeof value === "function") {
      return function(elem) {
        return (0, domhandler_1.isTag)(elem) && value(elem.attribs[attrib]);
      };
    }
    return function(elem) {
      return (0, domhandler_1.isTag)(elem) && elem.attribs[attrib] === value;
    };
  }
  function combineFuncs(a, b) {
    return function(elem) {
      return a(elem) || b(elem);
    };
  }
  function compileTest(options) {
    var funcs = Object.keys(options).map(function(key2) {
      var value = options[key2];
      return Object.prototype.hasOwnProperty.call(Checks, key2) ? Checks[key2](value) : getAttribCheck(key2, value);
    });
    return funcs.length === 0 ? null : funcs.reduce(combineFuncs);
  }
  function testElement(options, node2) {
    var test = compileTest(options);
    return test ? test(node2) : true;
  }
  function getElements(options, nodes, recurse, limit) {
    if (limit === void 0) {
      limit = Infinity;
    }
    var test = compileTest(options);
    return test ? (0, querying_js_1.filter)(test, nodes, recurse, limit) : [];
  }
  function getElementById(id, nodes, recurse) {
    if (recurse === void 0) {
      recurse = true;
    }
    if (!Array.isArray(nodes))
      nodes = [nodes];
    return (0, querying_js_1.findOne)(getAttribCheck("id", id), nodes, recurse);
  }
  function getElementsByTagName(tagName, nodes, recurse, limit) {
    if (recurse === void 0) {
      recurse = true;
    }
    if (limit === void 0) {
      limit = Infinity;
    }
    return (0, querying_js_1.filter)(Checks["tag_name"](tagName), nodes, recurse, limit);
  }
  function getElementsByClassName(className, nodes, recurse, limit) {
    if (recurse === void 0) {
      recurse = true;
    }
    if (limit === void 0) {
      limit = Infinity;
    }
    return (0, querying_js_1.filter)(getAttribCheck("class", className), nodes, recurse, limit);
  }
  function getElementsByTagType(type, nodes, recurse, limit) {
    if (recurse === void 0) {
      recurse = true;
    }
    if (limit === void 0) {
      limit = Infinity;
    }
    return (0, querying_js_1.filter)(Checks["tag_type"](type), nodes, recurse, limit);
  }
  return legacy;
}
var helpers = {};
var hasRequiredHelpers;
function requireHelpers() {
  if (hasRequiredHelpers) return helpers;
  hasRequiredHelpers = 1;
  Object.defineProperty(helpers, "__esModule", { value: true });
  helpers.DocumentPosition = void 0;
  helpers.removeSubsets = removeSubsets;
  helpers.compareDocumentPosition = compareDocumentPosition;
  helpers.uniqueSort = uniqueSort;
  var domhandler_1 = /* @__PURE__ */ requireLib$4();
  function removeSubsets(nodes) {
    var idx = nodes.length;
    while (--idx >= 0) {
      var node2 = nodes[idx];
      if (idx > 0 && nodes.lastIndexOf(node2, idx - 1) >= 0) {
        nodes.splice(idx, 1);
        continue;
      }
      for (var ancestor = node2.parent; ancestor; ancestor = ancestor.parent) {
        if (nodes.includes(ancestor)) {
          nodes.splice(idx, 1);
          break;
        }
      }
    }
    return nodes;
  }
  var DocumentPosition;
  (function(DocumentPosition2) {
    DocumentPosition2[DocumentPosition2["DISCONNECTED"] = 1] = "DISCONNECTED";
    DocumentPosition2[DocumentPosition2["PRECEDING"] = 2] = "PRECEDING";
    DocumentPosition2[DocumentPosition2["FOLLOWING"] = 4] = "FOLLOWING";
    DocumentPosition2[DocumentPosition2["CONTAINS"] = 8] = "CONTAINS";
    DocumentPosition2[DocumentPosition2["CONTAINED_BY"] = 16] = "CONTAINED_BY";
  })(DocumentPosition || (helpers.DocumentPosition = DocumentPosition = {}));
  function compareDocumentPosition(nodeA, nodeB) {
    var aParents = [];
    var bParents = [];
    if (nodeA === nodeB) {
      return 0;
    }
    var current = (0, domhandler_1.hasChildren)(nodeA) ? nodeA : nodeA.parent;
    while (current) {
      aParents.unshift(current);
      current = current.parent;
    }
    current = (0, domhandler_1.hasChildren)(nodeB) ? nodeB : nodeB.parent;
    while (current) {
      bParents.unshift(current);
      current = current.parent;
    }
    var maxIdx = Math.min(aParents.length, bParents.length);
    var idx = 0;
    while (idx < maxIdx && aParents[idx] === bParents[idx]) {
      idx++;
    }
    if (idx === 0) {
      return DocumentPosition.DISCONNECTED;
    }
    var sharedParent = aParents[idx - 1];
    var siblings = sharedParent.children;
    var aSibling = aParents[idx];
    var bSibling = bParents[idx];
    if (siblings.indexOf(aSibling) > siblings.indexOf(bSibling)) {
      if (sharedParent === nodeB) {
        return DocumentPosition.FOLLOWING | DocumentPosition.CONTAINED_BY;
      }
      return DocumentPosition.FOLLOWING;
    }
    if (sharedParent === nodeA) {
      return DocumentPosition.PRECEDING | DocumentPosition.CONTAINS;
    }
    return DocumentPosition.PRECEDING;
  }
  function uniqueSort(nodes) {
    nodes = nodes.filter(function(node2, i, arr) {
      return !arr.includes(node2, i + 1);
    });
    nodes.sort(function(a, b) {
      var relative = compareDocumentPosition(a, b);
      if (relative & DocumentPosition.PRECEDING) {
        return -1;
      } else if (relative & DocumentPosition.FOLLOWING) {
        return 1;
      }
      return 0;
    });
    return nodes;
  }
  return helpers;
}
var feeds = {};
var hasRequiredFeeds;
function requireFeeds() {
  if (hasRequiredFeeds) return feeds;
  hasRequiredFeeds = 1;
  Object.defineProperty(feeds, "__esModule", { value: true });
  feeds.getFeed = getFeed;
  var stringify_js_1 = /* @__PURE__ */ requireStringify$1();
  var legacy_js_1 = /* @__PURE__ */ requireLegacy();
  function getFeed(doc) {
    var feedRoot = getOneElement(isValidFeed, doc);
    return !feedRoot ? null : feedRoot.name === "feed" ? getAtomFeed(feedRoot) : getRssFeed(feedRoot);
  }
  function getAtomFeed(feedRoot) {
    var _a2;
    var childs = feedRoot.children;
    var feed = {
      type: "atom",
      items: (0, legacy_js_1.getElementsByTagName)("entry", childs).map(function(item) {
        var _a3;
        var children = item.children;
        var entry = { media: getMediaElements(children) };
        addConditionally(entry, "id", "id", children);
        addConditionally(entry, "title", "title", children);
        var href2 = (_a3 = getOneElement("link", children)) === null || _a3 === void 0 ? void 0 : _a3.attribs["href"];
        if (href2) {
          entry.link = href2;
        }
        var description = fetch2("summary", children) || fetch2("content", children);
        if (description) {
          entry.description = description;
        }
        var pubDate = fetch2("updated", children);
        if (pubDate) {
          entry.pubDate = new Date(pubDate);
        }
        return entry;
      })
    };
    addConditionally(feed, "id", "id", childs);
    addConditionally(feed, "title", "title", childs);
    var href = (_a2 = getOneElement("link", childs)) === null || _a2 === void 0 ? void 0 : _a2.attribs["href"];
    if (href) {
      feed.link = href;
    }
    addConditionally(feed, "description", "subtitle", childs);
    var updated = fetch2("updated", childs);
    if (updated) {
      feed.updated = new Date(updated);
    }
    addConditionally(feed, "author", "email", childs, true);
    return feed;
  }
  function getRssFeed(feedRoot) {
    var _a2, _b;
    var childs = (_b = (_a2 = getOneElement("channel", feedRoot.children)) === null || _a2 === void 0 ? void 0 : _a2.children) !== null && _b !== void 0 ? _b : [];
    var feed = {
      type: feedRoot.name.substr(0, 3),
      id: "",
      items: (0, legacy_js_1.getElementsByTagName)("item", feedRoot.children).map(function(item) {
        var children = item.children;
        var entry = { media: getMediaElements(children) };
        addConditionally(entry, "id", "guid", children);
        addConditionally(entry, "title", "title", children);
        addConditionally(entry, "link", "link", children);
        addConditionally(entry, "description", "description", children);
        var pubDate = fetch2("pubDate", children) || fetch2("dc:date", children);
        if (pubDate)
          entry.pubDate = new Date(pubDate);
        return entry;
      })
    };
    addConditionally(feed, "title", "title", childs);
    addConditionally(feed, "link", "link", childs);
    addConditionally(feed, "description", "description", childs);
    var updated = fetch2("lastBuildDate", childs);
    if (updated) {
      feed.updated = new Date(updated);
    }
    addConditionally(feed, "author", "managingEditor", childs, true);
    return feed;
  }
  var MEDIA_KEYS_STRING = ["url", "type", "lang"];
  var MEDIA_KEYS_INT = [
    "fileSize",
    "bitrate",
    "framerate",
    "samplingrate",
    "channels",
    "duration",
    "height",
    "width"
  ];
  function getMediaElements(where) {
    return (0, legacy_js_1.getElementsByTagName)("media:content", where).map(function(elem) {
      var attribs = elem.attribs;
      var media = {
        medium: attribs["medium"],
        isDefault: !!attribs["isDefault"]
      };
      for (var _i = 0, MEDIA_KEYS_STRING_1 = MEDIA_KEYS_STRING; _i < MEDIA_KEYS_STRING_1.length; _i++) {
        var attrib = MEDIA_KEYS_STRING_1[_i];
        if (attribs[attrib]) {
          media[attrib] = attribs[attrib];
        }
      }
      for (var _a2 = 0, MEDIA_KEYS_INT_1 = MEDIA_KEYS_INT; _a2 < MEDIA_KEYS_INT_1.length; _a2++) {
        var attrib = MEDIA_KEYS_INT_1[_a2];
        if (attribs[attrib]) {
          media[attrib] = parseInt(attribs[attrib], 10);
        }
      }
      if (attribs["expression"]) {
        media.expression = attribs["expression"];
      }
      return media;
    });
  }
  function getOneElement(tagName, node2) {
    return (0, legacy_js_1.getElementsByTagName)(tagName, node2, true, 1)[0];
  }
  function fetch2(tagName, where, recurse) {
    if (recurse === void 0) {
      recurse = false;
    }
    return (0, stringify_js_1.textContent)((0, legacy_js_1.getElementsByTagName)(tagName, where, recurse, 1)).trim();
  }
  function addConditionally(obj, prop, tagName, where, recurse) {
    if (recurse === void 0) {
      recurse = false;
    }
    var val = fetch2(tagName, where, recurse);
    if (val)
      obj[prop] = val;
  }
  function isValidFeed(value) {
    return value === "rss" || value === "feed" || value === "rdf:RDF";
  }
  return feeds;
}
var hasRequiredLib$1;
function requireLib$1() {
  if (hasRequiredLib$1) return lib$2;
  hasRequiredLib$1 = 1;
  (function(exports$1) {
    var __createBinding = lib$2 && lib$2.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = lib$2 && lib$2.__exportStar || function(m, exports$12) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$12, p)) __createBinding(exports$12, m, p);
    };
    Object.defineProperty(exports$1, "__esModule", { value: true });
    exports$1.hasChildren = exports$1.isDocument = exports$1.isComment = exports$1.isText = exports$1.isCDATA = exports$1.isTag = void 0;
    __exportStar(/* @__PURE__ */ requireStringify$1(), exports$1);
    __exportStar(/* @__PURE__ */ requireTraversal(), exports$1);
    __exportStar(/* @__PURE__ */ requireManipulation(), exports$1);
    __exportStar(/* @__PURE__ */ requireQuerying(), exports$1);
    __exportStar(/* @__PURE__ */ requireLegacy(), exports$1);
    __exportStar(/* @__PURE__ */ requireHelpers(), exports$1);
    __exportStar(/* @__PURE__ */ requireFeeds(), exports$1);
    var domhandler_1 = /* @__PURE__ */ requireLib$4();
    Object.defineProperty(exports$1, "isTag", { enumerable: true, get: function() {
      return domhandler_1.isTag;
    } });
    Object.defineProperty(exports$1, "isCDATA", { enumerable: true, get: function() {
      return domhandler_1.isCDATA;
    } });
    Object.defineProperty(exports$1, "isText", { enumerable: true, get: function() {
      return domhandler_1.isText;
    } });
    Object.defineProperty(exports$1, "isComment", { enumerable: true, get: function() {
      return domhandler_1.isComment;
    } });
    Object.defineProperty(exports$1, "isDocument", { enumerable: true, get: function() {
      return domhandler_1.isDocument;
    } });
    Object.defineProperty(exports$1, "hasChildren", { enumerable: true, get: function() {
      return domhandler_1.hasChildren;
    } });
  })(lib$2);
  return lib$2;
}
var hasRequiredLib;
function requireLib() {
  if (hasRequiredLib) return lib$5;
  hasRequiredLib = 1;
  (function(exports$1) {
    var __createBinding = lib$5 && lib$5.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = lib$5 && lib$5.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = lib$5 && lib$5.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    var __importDefault = lib$5 && lib$5.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports$1, "__esModule", { value: true });
    exports$1.DomUtils = exports$1.parseFeed = exports$1.getFeed = exports$1.ElementType = exports$1.Tokenizer = exports$1.createDomStream = exports$1.parseDOM = exports$1.parseDocument = exports$1.DefaultHandler = exports$1.DomHandler = exports$1.Parser = void 0;
    var Parser_js_1 = /* @__PURE__ */ requireParser$1();
    var Parser_js_2 = /* @__PURE__ */ requireParser$1();
    Object.defineProperty(exports$1, "Parser", { enumerable: true, get: function() {
      return Parser_js_2.Parser;
    } });
    var domhandler_1 = /* @__PURE__ */ requireLib$4();
    var domhandler_2 = /* @__PURE__ */ requireLib$4();
    Object.defineProperty(exports$1, "DomHandler", { enumerable: true, get: function() {
      return domhandler_2.DomHandler;
    } });
    Object.defineProperty(exports$1, "DefaultHandler", { enumerable: true, get: function() {
      return domhandler_2.DomHandler;
    } });
    function parseDocument(data, options) {
      var handler = new domhandler_1.DomHandler(void 0, options);
      new Parser_js_1.Parser(handler, options).end(data);
      return handler.root;
    }
    exports$1.parseDocument = parseDocument;
    function parseDOM(data, options) {
      return parseDocument(data, options).children;
    }
    exports$1.parseDOM = parseDOM;
    function createDomStream(callback, options, elementCallback) {
      var handler = new domhandler_1.DomHandler(callback, options, elementCallback);
      return new Parser_js_1.Parser(handler, options);
    }
    exports$1.createDomStream = createDomStream;
    var Tokenizer_js_1 = /* @__PURE__ */ requireTokenizer();
    Object.defineProperty(exports$1, "Tokenizer", { enumerable: true, get: function() {
      return __importDefault(Tokenizer_js_1).default;
    } });
    exports$1.ElementType = __importStar(/* @__PURE__ */ requireLib$5());
    var domutils_1 = /* @__PURE__ */ requireLib$1();
    var domutils_2 = /* @__PURE__ */ requireLib$1();
    Object.defineProperty(exports$1, "getFeed", { enumerable: true, get: function() {
      return domutils_2.getFeed;
    } });
    var parseFeedDefaultOptions = { xmlMode: true };
    function parseFeed(feed, options) {
      if (options === void 0) {
        options = parseFeedDefaultOptions;
      }
      return (0, domutils_1.getFeed)(parseDOM(feed, options));
    }
    exports$1.parseFeed = parseFeed;
    exports$1.DomUtils = __importStar(/* @__PURE__ */ requireLib$1());
  })(lib$5);
  return lib$5;
}
var escapeStringRegexp;
var hasRequiredEscapeStringRegexp;
function requireEscapeStringRegexp() {
  if (hasRequiredEscapeStringRegexp) return escapeStringRegexp;
  hasRequiredEscapeStringRegexp = 1;
  escapeStringRegexp = (string) => {
    if (typeof string !== "string") {
      throw new TypeError("Expected a string");
    }
    return string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
  };
  return escapeStringRegexp;
}
var isPlainObject = {};
var hasRequiredIsPlainObject;
function requireIsPlainObject() {
  if (hasRequiredIsPlainObject) return isPlainObject;
  hasRequiredIsPlainObject = 1;
  Object.defineProperty(isPlainObject, "__esModule", { value: true });
  function isObject(o) {
    return Object.prototype.toString.call(o) === "[object Object]";
  }
  function isPlainObject$1(o) {
    var ctor, prot;
    if (isObject(o) === false) return false;
    ctor = o.constructor;
    if (ctor === void 0) return true;
    prot = ctor.prototype;
    if (isObject(prot) === false) return false;
    if (prot.hasOwnProperty("isPrototypeOf") === false) {
      return false;
    }
    return true;
  }
  isPlainObject.isPlainObject = isPlainObject$1;
  return isPlainObject;
}
var cjs;
var hasRequiredCjs;
function requireCjs() {
  if (hasRequiredCjs) return cjs;
  hasRequiredCjs = 1;
  var isMergeableObject = function isMergeableObject2(value) {
    return isNonNullObject(value) && !isSpecial(value);
  };
  function isNonNullObject(value) {
    return !!value && typeof value === "object";
  }
  function isSpecial(value) {
    var stringValue = Object.prototype.toString.call(value);
    return stringValue === "[object RegExp]" || stringValue === "[object Date]" || isReactElement(value);
  }
  var canUseSymbol = typeof Symbol === "function" && Symbol.for;
  var REACT_ELEMENT_TYPE = canUseSymbol ? /* @__PURE__ */ Symbol.for("react.element") : 60103;
  function isReactElement(value) {
    return value.$$typeof === REACT_ELEMENT_TYPE;
  }
  function emptyTarget(val) {
    return Array.isArray(val) ? [] : {};
  }
  function cloneUnlessOtherwiseSpecified(value, options) {
    return options.clone !== false && options.isMergeableObject(value) ? deepmerge(emptyTarget(value), value, options) : value;
  }
  function defaultArrayMerge(target, source, options) {
    return target.concat(source).map(function(element) {
      return cloneUnlessOtherwiseSpecified(element, options);
    });
  }
  function getMergeFunction(key2, options) {
    if (!options.customMerge) {
      return deepmerge;
    }
    var customMerge = options.customMerge(key2);
    return typeof customMerge === "function" ? customMerge : deepmerge;
  }
  function getEnumerableOwnPropertySymbols(target) {
    return Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(target).filter(function(symbol) {
      return Object.propertyIsEnumerable.call(target, symbol);
    }) : [];
  }
  function getKeys(target) {
    return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target));
  }
  function propertyIsOnObject(object, property) {
    try {
      return property in object;
    } catch (_) {
      return false;
    }
  }
  function propertyIsUnsafe(target, key2) {
    return propertyIsOnObject(target, key2) && !(Object.hasOwnProperty.call(target, key2) && Object.propertyIsEnumerable.call(target, key2));
  }
  function mergeObject(target, source, options) {
    var destination = {};
    if (options.isMergeableObject(target)) {
      getKeys(target).forEach(function(key2) {
        destination[key2] = cloneUnlessOtherwiseSpecified(target[key2], options);
      });
    }
    getKeys(source).forEach(function(key2) {
      if (propertyIsUnsafe(target, key2)) {
        return;
      }
      if (propertyIsOnObject(target, key2) && options.isMergeableObject(source[key2])) {
        destination[key2] = getMergeFunction(key2, options)(target[key2], source[key2], options);
      } else {
        destination[key2] = cloneUnlessOtherwiseSpecified(source[key2], options);
      }
    });
    return destination;
  }
  function deepmerge(target, source, options) {
    options = options || {};
    options.arrayMerge = options.arrayMerge || defaultArrayMerge;
    options.isMergeableObject = options.isMergeableObject || isMergeableObject;
    options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;
    var sourceIsArray = Array.isArray(source);
    var targetIsArray = Array.isArray(target);
    var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;
    if (!sourceAndTargetTypesMatch) {
      return cloneUnlessOtherwiseSpecified(source, options);
    } else if (sourceIsArray) {
      return options.arrayMerge(target, source, options);
    } else {
      return mergeObject(target, source, options);
    }
  }
  deepmerge.all = function deepmergeAll(array, options) {
    if (!Array.isArray(array)) {
      throw new Error("first argument should be an array");
    }
    return array.reduce(function(prev, next) {
      return deepmerge(prev, next, options);
    }, {});
  };
  var deepmerge_1 = deepmerge;
  cjs = deepmerge_1;
  return cjs;
}
var parseSrcset$1 = { exports: {} };
var parseSrcset = parseSrcset$1.exports;
var hasRequiredParseSrcset;
function requireParseSrcset() {
  if (hasRequiredParseSrcset) return parseSrcset$1.exports;
  hasRequiredParseSrcset = 1;
  (function(module) {
    (function(root2, factory) {
      if (module.exports) {
        module.exports = factory();
      } else {
        root2.parseSrcset = factory();
      }
    })(parseSrcset, function() {
      return function(input2) {
        function isSpace(c2) {
          return c2 === " " || // space
          c2 === "	" || // horizontal tab
          c2 === "\n" || // new line
          c2 === "\f" || // form feed
          c2 === "\r";
        }
        function collectCharacters(regEx) {
          var chars, match = regEx.exec(input2.substring(pos));
          if (match) {
            chars = match[0];
            pos += chars.length;
            return chars;
          }
        }
        var inputLength = input2.length, regexLeadingSpaces = /^[ \t\n\r\u000c]+/, regexLeadingCommasOrSpaces = /^[, \t\n\r\u000c]+/, regexLeadingNotSpaces = /^[^ \t\n\r\u000c]+/, regexTrailingCommas = /[,]+$/, regexNonNegativeInteger = /^\d+$/, regexFloatingPoint = /^-?(?:[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/, url, descriptors, currentDescriptor, state, c, pos = 0, candidates = [];
        while (true) {
          collectCharacters(regexLeadingCommasOrSpaces);
          if (pos >= inputLength) {
            return candidates;
          }
          url = collectCharacters(regexLeadingNotSpaces);
          descriptors = [];
          if (url.slice(-1) === ",") {
            url = url.replace(regexTrailingCommas, "");
            parseDescriptors();
          } else {
            tokenize2();
          }
        }
        function tokenize2() {
          collectCharacters(regexLeadingSpaces);
          currentDescriptor = "";
          state = "in descriptor";
          while (true) {
            c = input2.charAt(pos);
            if (state === "in descriptor") {
              if (isSpace(c)) {
                if (currentDescriptor) {
                  descriptors.push(currentDescriptor);
                  currentDescriptor = "";
                  state = "after descriptor";
                }
              } else if (c === ",") {
                pos += 1;
                if (currentDescriptor) {
                  descriptors.push(currentDescriptor);
                }
                parseDescriptors();
                return;
              } else if (c === "(") {
                currentDescriptor = currentDescriptor + c;
                state = "in parens";
              } else if (c === "") {
                if (currentDescriptor) {
                  descriptors.push(currentDescriptor);
                }
                parseDescriptors();
                return;
              } else {
                currentDescriptor = currentDescriptor + c;
              }
            } else if (state === "in parens") {
              if (c === ")") {
                currentDescriptor = currentDescriptor + c;
                state = "in descriptor";
              } else if (c === "") {
                descriptors.push(currentDescriptor);
                parseDescriptors();
                return;
              } else {
                currentDescriptor = currentDescriptor + c;
              }
            } else if (state === "after descriptor") {
              if (isSpace(c)) ;
              else if (c === "") {
                parseDescriptors();
                return;
              } else {
                state = "in descriptor";
                pos -= 1;
              }
            }
            pos += 1;
          }
        }
        function parseDescriptors() {
          var pError = false, w, d, h, i, candidate = {}, desc, lastChar, value, intVal, floatVal;
          for (i = 0; i < descriptors.length; i++) {
            desc = descriptors[i];
            lastChar = desc[desc.length - 1];
            value = desc.substring(0, desc.length - 1);
            intVal = parseInt(value, 10);
            floatVal = parseFloat(value);
            if (regexNonNegativeInteger.test(value) && lastChar === "w") {
              if (w || d) {
                pError = true;
              }
              if (intVal === 0) {
                pError = true;
              } else {
                w = intVal;
              }
            } else if (regexFloatingPoint.test(value) && lastChar === "x") {
              if (w || d || h) {
                pError = true;
              }
              if (floatVal < 0) {
                pError = true;
              } else {
                d = floatVal;
              }
            } else if (regexNonNegativeInteger.test(value) && lastChar === "h") {
              if (h || d) {
                pError = true;
              }
              if (intVal === 0) {
                pError = true;
              } else {
                h = intVal;
              }
            } else {
              pError = true;
            }
          }
          if (!pError) {
            candidate.url = url;
            if (w) {
              candidate.w = w;
            }
            if (d) {
              candidate.d = d;
            }
            if (h) {
              candidate.h = h;
            }
            candidates.push(candidate);
          } else if (console && console.log) {
            console.log("Invalid srcset descriptor found in '" + input2 + "' at '" + desc + "'.");
          }
        }
      };
    });
  })(parseSrcset$1);
  return parseSrcset$1.exports;
}
var picocolors = { exports: {} };
var hasRequiredPicocolors;
function requirePicocolors() {
  if (hasRequiredPicocolors) return picocolors.exports;
  hasRequiredPicocolors = 1;
  let p = process || {}, argv = p.argv || [], env = p.env || {};
  let isColorSupported = !(!!env.NO_COLOR || argv.includes("--no-color")) && (!!env.FORCE_COLOR || argv.includes("--color") || p.platform === "win32" || (p.stdout || {}).isTTY && env.TERM !== "dumb" || !!env.CI);
  let formatter = (open, close, replace = open) => (input2) => {
    let string = "" + input2, index = string.indexOf(close, open.length);
    return ~index ? open + replaceClose(string, close, replace, index) + close : open + string + close;
  };
  let replaceClose = (string, close, replace, index) => {
    let result2 = "", cursor = 0;
    do {
      result2 += string.substring(cursor, index) + replace;
      cursor = index + close.length;
      index = string.indexOf(close, cursor);
    } while (~index);
    return result2 + string.substring(cursor);
  };
  let createColors = (enabled = isColorSupported) => {
    let f = enabled ? formatter : () => String;
    return {
      isColorSupported: enabled,
      reset: f("\x1B[0m", "\x1B[0m"),
      bold: f("\x1B[1m", "\x1B[22m", "\x1B[22m\x1B[1m"),
      dim: f("\x1B[2m", "\x1B[22m", "\x1B[22m\x1B[2m"),
      italic: f("\x1B[3m", "\x1B[23m"),
      underline: f("\x1B[4m", "\x1B[24m"),
      inverse: f("\x1B[7m", "\x1B[27m"),
      hidden: f("\x1B[8m", "\x1B[28m"),
      strikethrough: f("\x1B[9m", "\x1B[29m"),
      black: f("\x1B[30m", "\x1B[39m"),
      red: f("\x1B[31m", "\x1B[39m"),
      green: f("\x1B[32m", "\x1B[39m"),
      yellow: f("\x1B[33m", "\x1B[39m"),
      blue: f("\x1B[34m", "\x1B[39m"),
      magenta: f("\x1B[35m", "\x1B[39m"),
      cyan: f("\x1B[36m", "\x1B[39m"),
      white: f("\x1B[37m", "\x1B[39m"),
      gray: f("\x1B[90m", "\x1B[39m"),
      bgBlack: f("\x1B[40m", "\x1B[49m"),
      bgRed: f("\x1B[41m", "\x1B[49m"),
      bgGreen: f("\x1B[42m", "\x1B[49m"),
      bgYellow: f("\x1B[43m", "\x1B[49m"),
      bgBlue: f("\x1B[44m", "\x1B[49m"),
      bgMagenta: f("\x1B[45m", "\x1B[49m"),
      bgCyan: f("\x1B[46m", "\x1B[49m"),
      bgWhite: f("\x1B[47m", "\x1B[49m"),
      blackBright: f("\x1B[90m", "\x1B[39m"),
      redBright: f("\x1B[91m", "\x1B[39m"),
      greenBright: f("\x1B[92m", "\x1B[39m"),
      yellowBright: f("\x1B[93m", "\x1B[39m"),
      blueBright: f("\x1B[94m", "\x1B[39m"),
      magentaBright: f("\x1B[95m", "\x1B[39m"),
      cyanBright: f("\x1B[96m", "\x1B[39m"),
      whiteBright: f("\x1B[97m", "\x1B[39m"),
      bgBlackBright: f("\x1B[100m", "\x1B[49m"),
      bgRedBright: f("\x1B[101m", "\x1B[49m"),
      bgGreenBright: f("\x1B[102m", "\x1B[49m"),
      bgYellowBright: f("\x1B[103m", "\x1B[49m"),
      bgBlueBright: f("\x1B[104m", "\x1B[49m"),
      bgMagentaBright: f("\x1B[105m", "\x1B[49m"),
      bgCyanBright: f("\x1B[106m", "\x1B[49m"),
      bgWhiteBright: f("\x1B[107m", "\x1B[49m")
    };
  };
  picocolors.exports = createColors();
  picocolors.exports.createColors = createColors;
  return picocolors.exports;
}
var tokenize;
var hasRequiredTokenize;
function requireTokenize() {
  if (hasRequiredTokenize) return tokenize;
  hasRequiredTokenize = 1;
  const SINGLE_QUOTE = "'".charCodeAt(0);
  const DOUBLE_QUOTE = '"'.charCodeAt(0);
  const BACKSLASH = "\\".charCodeAt(0);
  const SLASH = "/".charCodeAt(0);
  const NEWLINE = "\n".charCodeAt(0);
  const SPACE = " ".charCodeAt(0);
  const FEED = "\f".charCodeAt(0);
  const TAB = "	".charCodeAt(0);
  const CR = "\r".charCodeAt(0);
  const OPEN_SQUARE = "[".charCodeAt(0);
  const CLOSE_SQUARE = "]".charCodeAt(0);
  const OPEN_PARENTHESES = "(".charCodeAt(0);
  const CLOSE_PARENTHESES = ")".charCodeAt(0);
  const OPEN_CURLY = "{".charCodeAt(0);
  const CLOSE_CURLY = "}".charCodeAt(0);
  const SEMICOLON = ";".charCodeAt(0);
  const ASTERISK = "*".charCodeAt(0);
  const COLON = ":".charCodeAt(0);
  const AT = "@".charCodeAt(0);
  const RE_AT_END = /[\t\n\f\r "#'()/;[\\\]{}]/g;
  const RE_WORD_END = /[\t\n\f\r !"#'():;@[\\\]{}]|\/(?=\*)/g;
  const RE_BAD_BRACKET = /.[\r\n"'(/\\]/;
  const RE_HEX_ESCAPE = /[\da-f]/i;
  tokenize = function tokenizer(input2, options = {}) {
    let css = input2.css.valueOf();
    let ignore = options.ignoreErrors;
    let code, content, escape, next, quote;
    let currentToken, escaped, escapePos, n, prev;
    let length = css.length;
    let pos = 0;
    let buffer = [];
    let returned = [];
    function position() {
      return pos;
    }
    function unclosed(what) {
      throw input2.error("Unclosed " + what, pos);
    }
    function endOfFile() {
      return returned.length === 0 && pos >= length;
    }
    function nextToken(opts) {
      if (returned.length) return returned.pop();
      if (pos >= length) return;
      let ignoreUnclosed = opts ? opts.ignoreUnclosed : false;
      code = css.charCodeAt(pos);
      switch (code) {
        case NEWLINE:
        case SPACE:
        case TAB:
        case CR:
        case FEED: {
          next = pos;
          do {
            next += 1;
            code = css.charCodeAt(next);
          } while (code === SPACE || code === NEWLINE || code === TAB || code === CR || code === FEED);
          currentToken = ["space", css.slice(pos, next)];
          pos = next - 1;
          break;
        }
        case OPEN_SQUARE:
        case CLOSE_SQUARE:
        case OPEN_CURLY:
        case CLOSE_CURLY:
        case COLON:
        case SEMICOLON:
        case CLOSE_PARENTHESES: {
          let controlChar = String.fromCharCode(code);
          currentToken = [controlChar, controlChar, pos];
          break;
        }
        case OPEN_PARENTHESES: {
          prev = buffer.length ? buffer.pop()[1] : "";
          n = css.charCodeAt(pos + 1);
          if (prev === "url" && n !== SINGLE_QUOTE && n !== DOUBLE_QUOTE && n !== SPACE && n !== NEWLINE && n !== TAB && n !== FEED && n !== CR) {
            next = pos;
            do {
              escaped = false;
              next = css.indexOf(")", next + 1);
              if (next === -1) {
                if (ignore || ignoreUnclosed) {
                  next = pos;
                  break;
                } else {
                  unclosed("bracket");
                }
              }
              escapePos = next;
              while (css.charCodeAt(escapePos - 1) === BACKSLASH) {
                escapePos -= 1;
                escaped = !escaped;
              }
            } while (escaped);
            currentToken = ["brackets", css.slice(pos, next + 1), pos, next];
            pos = next;
          } else {
            next = css.indexOf(")", pos + 1);
            content = css.slice(pos, next + 1);
            if (next === -1 || RE_BAD_BRACKET.test(content)) {
              currentToken = ["(", "(", pos];
            } else {
              currentToken = ["brackets", content, pos, next];
              pos = next;
            }
          }
          break;
        }
        case SINGLE_QUOTE:
        case DOUBLE_QUOTE: {
          quote = code === SINGLE_QUOTE ? "'" : '"';
          next = pos;
          do {
            escaped = false;
            next = css.indexOf(quote, next + 1);
            if (next === -1) {
              if (ignore || ignoreUnclosed) {
                next = pos + 1;
                break;
              } else {
                unclosed("string");
              }
            }
            escapePos = next;
            while (css.charCodeAt(escapePos - 1) === BACKSLASH) {
              escapePos -= 1;
              escaped = !escaped;
            }
          } while (escaped);
          currentToken = ["string", css.slice(pos, next + 1), pos, next];
          pos = next;
          break;
        }
        case AT: {
          RE_AT_END.lastIndex = pos + 1;
          RE_AT_END.test(css);
          if (RE_AT_END.lastIndex === 0) {
            next = css.length - 1;
          } else {
            next = RE_AT_END.lastIndex - 2;
          }
          currentToken = ["at-word", css.slice(pos, next + 1), pos, next];
          pos = next;
          break;
        }
        case BACKSLASH: {
          next = pos;
          escape = true;
          while (css.charCodeAt(next + 1) === BACKSLASH) {
            next += 1;
            escape = !escape;
          }
          code = css.charCodeAt(next + 1);
          if (escape && code !== SLASH && code !== SPACE && code !== NEWLINE && code !== TAB && code !== CR && code !== FEED) {
            next += 1;
            if (RE_HEX_ESCAPE.test(css.charAt(next))) {
              while (RE_HEX_ESCAPE.test(css.charAt(next + 1))) {
                next += 1;
              }
              if (css.charCodeAt(next + 1) === SPACE) {
                next += 1;
              }
            }
          }
          currentToken = ["word", css.slice(pos, next + 1), pos, next];
          pos = next;
          break;
        }
        default: {
          if (code === SLASH && css.charCodeAt(pos + 1) === ASTERISK) {
            next = css.indexOf("*/", pos + 2) + 1;
            if (next === 0) {
              if (ignore || ignoreUnclosed) {
                next = css.length;
              } else {
                unclosed("comment");
              }
            }
            currentToken = ["comment", css.slice(pos, next + 1), pos, next];
            pos = next;
          } else {
            RE_WORD_END.lastIndex = pos + 1;
            RE_WORD_END.test(css);
            if (RE_WORD_END.lastIndex === 0) {
              next = css.length - 1;
            } else {
              next = RE_WORD_END.lastIndex - 2;
            }
            currentToken = ["word", css.slice(pos, next + 1), pos, next];
            buffer.push(currentToken);
            pos = next;
          }
          break;
        }
      }
      pos++;
      return currentToken;
    }
    function back(token) {
      returned.push(token);
    }
    return {
      back,
      endOfFile,
      nextToken,
      position
    };
  };
  return tokenize;
}
var terminalHighlight_1;
var hasRequiredTerminalHighlight;
function requireTerminalHighlight() {
  if (hasRequiredTerminalHighlight) return terminalHighlight_1;
  hasRequiredTerminalHighlight = 1;
  let pico = /* @__PURE__ */ requirePicocolors();
  let tokenizer = requireTokenize();
  let Input;
  function registerInput(dependant) {
    Input = dependant;
  }
  const HIGHLIGHT_THEME = {
    ";": pico.yellow,
    ":": pico.yellow,
    "(": pico.cyan,
    ")": pico.cyan,
    "[": pico.yellow,
    "]": pico.yellow,
    "{": pico.yellow,
    "}": pico.yellow,
    "at-word": pico.cyan,
    "brackets": pico.cyan,
    "call": pico.cyan,
    "class": pico.yellow,
    "comment": pico.gray,
    "hash": pico.magenta,
    "string": pico.green
  };
  function getTokenType([type, value], processor2) {
    if (type === "word") {
      if (value[0] === ".") {
        return "class";
      }
      if (value[0] === "#") {
        return "hash";
      }
    }
    if (!processor2.endOfFile()) {
      let next = processor2.nextToken();
      processor2.back(next);
      if (next[0] === "brackets" || next[0] === "(") return "call";
    }
    return type;
  }
  function terminalHighlight(css) {
    let processor2 = tokenizer(new Input(css), { ignoreErrors: true });
    let result2 = "";
    while (!processor2.endOfFile()) {
      let token = processor2.nextToken();
      let color = HIGHLIGHT_THEME[getTokenType(token, processor2)];
      if (color) {
        result2 += token[1].split(/\r?\n/).map((i) => color(i)).join("\n");
      } else {
        result2 += token[1];
      }
    }
    return result2;
  }
  terminalHighlight.registerInput = registerInput;
  terminalHighlight_1 = terminalHighlight;
  return terminalHighlight_1;
}
var cssSyntaxError;
var hasRequiredCssSyntaxError;
function requireCssSyntaxError() {
  if (hasRequiredCssSyntaxError) return cssSyntaxError;
  hasRequiredCssSyntaxError = 1;
  let pico = /* @__PURE__ */ requirePicocolors();
  let terminalHighlight = requireTerminalHighlight();
  class CssSyntaxError extends Error {
    constructor(message, line, column, source, file, plugin) {
      super(message);
      this.name = "CssSyntaxError";
      this.reason = message;
      if (file) {
        this.file = file;
      }
      if (source) {
        this.source = source;
      }
      if (plugin) {
        this.plugin = plugin;
      }
      if (typeof line !== "undefined" && typeof column !== "undefined") {
        if (typeof line === "number") {
          this.line = line;
          this.column = column;
        } else {
          this.line = line.line;
          this.column = line.column;
          this.endLine = column.line;
          this.endColumn = column.column;
        }
      }
      this.setMessage();
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, CssSyntaxError);
      }
    }
    setMessage() {
      this.message = this.plugin ? this.plugin + ": " : "";
      this.message += this.file ? this.file : "<css input>";
      if (typeof this.line !== "undefined") {
        this.message += ":" + this.line + ":" + this.column;
      }
      this.message += ": " + this.reason;
    }
    showSourceCode(color) {
      if (!this.source) return "";
      let css = this.source;
      if (color == null) color = pico.isColorSupported;
      let aside = (text) => text;
      let mark = (text) => text;
      let highlight = (text) => text;
      if (color) {
        let { bold, gray, red } = pico.createColors(true);
        mark = (text) => bold(red(text));
        aside = (text) => gray(text);
        if (terminalHighlight) {
          highlight = (text) => terminalHighlight(text);
        }
      }
      let lines = css.split(/\r?\n/);
      let start = Math.max(this.line - 3, 0);
      let end = Math.min(this.line + 2, lines.length);
      let maxWidth = String(end).length;
      return lines.slice(start, end).map((line, index) => {
        let number = start + 1 + index;
        let gutter = " " + (" " + number).slice(-maxWidth) + " | ";
        if (number === this.line) {
          if (line.length > 160) {
            let padding = 20;
            let subLineStart = Math.max(0, this.column - padding);
            let subLineEnd = Math.max(
              this.column + padding,
              this.endColumn + padding
            );
            let subLine = line.slice(subLineStart, subLineEnd);
            let spacing2 = aside(gutter.replace(/\d/g, " ")) + line.slice(0, Math.min(this.column - 1, padding - 1)).replace(/[^\t]/g, " ");
            return mark(">") + aside(gutter) + highlight(subLine) + "\n " + spacing2 + mark("^");
          }
          let spacing = aside(gutter.replace(/\d/g, " ")) + line.slice(0, this.column - 1).replace(/[^\t]/g, " ");
          return mark(">") + aside(gutter) + highlight(line) + "\n " + spacing + mark("^");
        }
        return " " + aside(gutter) + highlight(line);
      }).join("\n");
    }
    toString() {
      let code = this.showSourceCode();
      if (code) {
        code = "\n\n" + code + "\n";
      }
      return this.name + ": " + this.message + code;
    }
  }
  cssSyntaxError = CssSyntaxError;
  CssSyntaxError.default = CssSyntaxError;
  return cssSyntaxError;
}
var stringifier;
var hasRequiredStringifier;
function requireStringifier() {
  if (hasRequiredStringifier) return stringifier;
  hasRequiredStringifier = 1;
  const DEFAULT_RAW = {
    after: "\n",
    beforeClose: "\n",
    beforeComment: "\n",
    beforeDecl: "\n",
    beforeOpen: " ",
    beforeRule: "\n",
    colon: ": ",
    commentLeft: " ",
    commentRight: " ",
    emptyBody: "",
    indent: "    ",
    semicolon: false
  };
  function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1);
  }
  class Stringifier {
    constructor(builder) {
      this.builder = builder;
    }
    atrule(node2, semicolon) {
      let name = "@" + node2.name;
      let params = node2.params ? this.rawValue(node2, "params") : "";
      if (typeof node2.raws.afterName !== "undefined") {
        name += node2.raws.afterName;
      } else if (params) {
        name += " ";
      }
      if (node2.nodes) {
        this.block(node2, name + params);
      } else {
        let end = (node2.raws.between || "") + (semicolon ? ";" : "");
        this.builder(name + params + end, node2);
      }
    }
    beforeAfter(node2, detect) {
      let value;
      if (node2.type === "decl") {
        value = this.raw(node2, null, "beforeDecl");
      } else if (node2.type === "comment") {
        value = this.raw(node2, null, "beforeComment");
      } else if (detect === "before") {
        value = this.raw(node2, null, "beforeRule");
      } else {
        value = this.raw(node2, null, "beforeClose");
      }
      let buf = node2.parent;
      let depth = 0;
      while (buf && buf.type !== "root") {
        depth += 1;
        buf = buf.parent;
      }
      if (value.includes("\n")) {
        let indent = this.raw(node2, null, "indent");
        if (indent.length) {
          for (let step = 0; step < depth; step++) value += indent;
        }
      }
      return value;
    }
    block(node2, start) {
      let between = this.raw(node2, "between", "beforeOpen");
      this.builder(start + between + "{", node2, "start");
      let after;
      if (node2.nodes && node2.nodes.length) {
        this.body(node2);
        after = this.raw(node2, "after");
      } else {
        after = this.raw(node2, "after", "emptyBody");
      }
      if (after) this.builder(after);
      this.builder("}", node2, "end");
    }
    body(node2) {
      let last = node2.nodes.length - 1;
      while (last > 0) {
        if (node2.nodes[last].type !== "comment") break;
        last -= 1;
      }
      let semicolon = this.raw(node2, "semicolon");
      for (let i = 0; i < node2.nodes.length; i++) {
        let child = node2.nodes[i];
        let before = this.raw(child, "before");
        if (before) this.builder(before);
        this.stringify(child, last !== i || semicolon);
      }
    }
    comment(node2) {
      let left = this.raw(node2, "left", "commentLeft");
      let right = this.raw(node2, "right", "commentRight");
      this.builder("/*" + left + node2.text + right + "*/", node2);
    }
    decl(node2, semicolon) {
      let between = this.raw(node2, "between", "colon");
      let string = node2.prop + between + this.rawValue(node2, "value");
      if (node2.important) {
        string += node2.raws.important || " !important";
      }
      if (semicolon) string += ";";
      this.builder(string, node2);
    }
    document(node2) {
      this.body(node2);
    }
    raw(node2, own, detect) {
      let value;
      if (!detect) detect = own;
      if (own) {
        value = node2.raws[own];
        if (typeof value !== "undefined") return value;
      }
      let parent = node2.parent;
      if (detect === "before") {
        if (!parent || parent.type === "root" && parent.first === node2) {
          return "";
        }
        if (parent && parent.type === "document") {
          return "";
        }
      }
      if (!parent) return DEFAULT_RAW[detect];
      let root2 = node2.root();
      if (!root2.rawCache) root2.rawCache = {};
      if (typeof root2.rawCache[detect] !== "undefined") {
        return root2.rawCache[detect];
      }
      if (detect === "before" || detect === "after") {
        return this.beforeAfter(node2, detect);
      } else {
        let method = "raw" + capitalize(detect);
        if (this[method]) {
          value = this[method](root2, node2);
        } else {
          root2.walk((i) => {
            value = i.raws[own];
            if (typeof value !== "undefined") return false;
          });
        }
      }
      if (typeof value === "undefined") value = DEFAULT_RAW[detect];
      root2.rawCache[detect] = value;
      return value;
    }
    rawBeforeClose(root2) {
      let value;
      root2.walk((i) => {
        if (i.nodes && i.nodes.length > 0) {
          if (typeof i.raws.after !== "undefined") {
            value = i.raws.after;
            if (value.includes("\n")) {
              value = value.replace(/[^\n]+$/, "");
            }
            return false;
          }
        }
      });
      if (value) value = value.replace(/\S/g, "");
      return value;
    }
    rawBeforeComment(root2, node2) {
      let value;
      root2.walkComments((i) => {
        if (typeof i.raws.before !== "undefined") {
          value = i.raws.before;
          if (value.includes("\n")) {
            value = value.replace(/[^\n]+$/, "");
          }
          return false;
        }
      });
      if (typeof value === "undefined") {
        value = this.raw(node2, null, "beforeDecl");
      } else if (value) {
        value = value.replace(/\S/g, "");
      }
      return value;
    }
    rawBeforeDecl(root2, node2) {
      let value;
      root2.walkDecls((i) => {
        if (typeof i.raws.before !== "undefined") {
          value = i.raws.before;
          if (value.includes("\n")) {
            value = value.replace(/[^\n]+$/, "");
          }
          return false;
        }
      });
      if (typeof value === "undefined") {
        value = this.raw(node2, null, "beforeRule");
      } else if (value) {
        value = value.replace(/\S/g, "");
      }
      return value;
    }
    rawBeforeOpen(root2) {
      let value;
      root2.walk((i) => {
        if (i.type !== "decl") {
          value = i.raws.between;
          if (typeof value !== "undefined") return false;
        }
      });
      return value;
    }
    rawBeforeRule(root2) {
      let value;
      root2.walk((i) => {
        if (i.nodes && (i.parent !== root2 || root2.first !== i)) {
          if (typeof i.raws.before !== "undefined") {
            value = i.raws.before;
            if (value.includes("\n")) {
              value = value.replace(/[^\n]+$/, "");
            }
            return false;
          }
        }
      });
      if (value) value = value.replace(/\S/g, "");
      return value;
    }
    rawColon(root2) {
      let value;
      root2.walkDecls((i) => {
        if (typeof i.raws.between !== "undefined") {
          value = i.raws.between.replace(/[^\s:]/g, "");
          return false;
        }
      });
      return value;
    }
    rawEmptyBody(root2) {
      let value;
      root2.walk((i) => {
        if (i.nodes && i.nodes.length === 0) {
          value = i.raws.after;
          if (typeof value !== "undefined") return false;
        }
      });
      return value;
    }
    rawIndent(root2) {
      if (root2.raws.indent) return root2.raws.indent;
      let value;
      root2.walk((i) => {
        let p = i.parent;
        if (p && p !== root2 && p.parent && p.parent === root2) {
          if (typeof i.raws.before !== "undefined") {
            let parts = i.raws.before.split("\n");
            value = parts[parts.length - 1];
            value = value.replace(/\S/g, "");
            return false;
          }
        }
      });
      return value;
    }
    rawSemicolon(root2) {
      let value;
      root2.walk((i) => {
        if (i.nodes && i.nodes.length && i.last.type === "decl") {
          value = i.raws.semicolon;
          if (typeof value !== "undefined") return false;
        }
      });
      return value;
    }
    rawValue(node2, prop) {
      let value = node2[prop];
      let raw = node2.raws[prop];
      if (raw && raw.value === value) {
        return raw.raw;
      }
      return value;
    }
    root(node2) {
      this.body(node2);
      if (node2.raws.after) this.builder(node2.raws.after);
    }
    rule(node2) {
      this.block(node2, this.rawValue(node2, "selector"));
      if (node2.raws.ownSemicolon) {
        this.builder(node2.raws.ownSemicolon, node2, "end");
      }
    }
    stringify(node2, semicolon) {
      if (!this[node2.type]) {
        throw new Error(
          "Unknown AST node type " + node2.type + ". Maybe you need to change PostCSS stringifier."
        );
      }
      this[node2.type](node2, semicolon);
    }
  }
  stringifier = Stringifier;
  Stringifier.default = Stringifier;
  return stringifier;
}
var stringify_1;
var hasRequiredStringify;
function requireStringify() {
  if (hasRequiredStringify) return stringify_1;
  hasRequiredStringify = 1;
  let Stringifier = requireStringifier();
  function stringify2(node2, builder) {
    let str = new Stringifier(builder);
    str.stringify(node2);
  }
  stringify_1 = stringify2;
  stringify2.default = stringify2;
  return stringify_1;
}
var symbols = {};
var hasRequiredSymbols;
function requireSymbols() {
  if (hasRequiredSymbols) return symbols;
  hasRequiredSymbols = 1;
  symbols.isClean = /* @__PURE__ */ Symbol("isClean");
  symbols.my = /* @__PURE__ */ Symbol("my");
  return symbols;
}
var node;
var hasRequiredNode;
function requireNode() {
  if (hasRequiredNode) return node;
  hasRequiredNode = 1;
  let CssSyntaxError = requireCssSyntaxError();
  let Stringifier = requireStringifier();
  let stringify2 = requireStringify();
  let { isClean, my } = requireSymbols();
  function cloneNode(obj, parent) {
    let cloned = new obj.constructor();
    for (let i in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, i)) {
        continue;
      }
      if (i === "proxyCache") continue;
      let value = obj[i];
      let type = typeof value;
      if (i === "parent" && type === "object") {
        if (parent) cloned[i] = parent;
      } else if (i === "source") {
        cloned[i] = value;
      } else if (Array.isArray(value)) {
        cloned[i] = value.map((j) => cloneNode(j, cloned));
      } else {
        if (type === "object" && value !== null) value = cloneNode(value);
        cloned[i] = value;
      }
    }
    return cloned;
  }
  function sourceOffset(inputCSS, position) {
    if (position && typeof position.offset !== "undefined") {
      return position.offset;
    }
    let column = 1;
    let line = 1;
    let offset = 0;
    for (let i = 0; i < inputCSS.length; i++) {
      if (line === position.line && column === position.column) {
        offset = i;
        break;
      }
      if (inputCSS[i] === "\n") {
        column = 1;
        line += 1;
      } else {
        column += 1;
      }
    }
    return offset;
  }
  class Node {
    get proxyOf() {
      return this;
    }
    constructor(defaults = {}) {
      this.raws = {};
      this[isClean] = false;
      this[my] = true;
      for (let name in defaults) {
        if (name === "nodes") {
          this.nodes = [];
          for (let node2 of defaults[name]) {
            if (typeof node2.clone === "function") {
              this.append(node2.clone());
            } else {
              this.append(node2);
            }
          }
        } else {
          this[name] = defaults[name];
        }
      }
    }
    addToError(error) {
      error.postcssNode = this;
      if (error.stack && this.source && /\n\s{4}at /.test(error.stack)) {
        let s = this.source;
        error.stack = error.stack.replace(
          /\n\s{4}at /,
          `$&${s.input.from}:${s.start.line}:${s.start.column}$&`
        );
      }
      return error;
    }
    after(add) {
      this.parent.insertAfter(this, add);
      return this;
    }
    assign(overrides = {}) {
      for (let name in overrides) {
        this[name] = overrides[name];
      }
      return this;
    }
    before(add) {
      this.parent.insertBefore(this, add);
      return this;
    }
    cleanRaws(keepBetween) {
      delete this.raws.before;
      delete this.raws.after;
      if (!keepBetween) delete this.raws.between;
    }
    clone(overrides = {}) {
      let cloned = cloneNode(this);
      for (let name in overrides) {
        cloned[name] = overrides[name];
      }
      return cloned;
    }
    cloneAfter(overrides = {}) {
      let cloned = this.clone(overrides);
      this.parent.insertAfter(this, cloned);
      return cloned;
    }
    cloneBefore(overrides = {}) {
      let cloned = this.clone(overrides);
      this.parent.insertBefore(this, cloned);
      return cloned;
    }
    error(message, opts = {}) {
      if (this.source) {
        let { end, start } = this.rangeBy(opts);
        return this.source.input.error(
          message,
          { column: start.column, line: start.line },
          { column: end.column, line: end.line },
          opts
        );
      }
      return new CssSyntaxError(message);
    }
    getProxyProcessor() {
      return {
        get(node2, prop) {
          if (prop === "proxyOf") {
            return node2;
          } else if (prop === "root") {
            return () => node2.root().toProxy();
          } else {
            return node2[prop];
          }
        },
        set(node2, prop, value) {
          if (node2[prop] === value) return true;
          node2[prop] = value;
          if (prop === "prop" || prop === "value" || prop === "name" || prop === "params" || prop === "important" || /* c8 ignore next */
          prop === "text") {
            node2.markDirty();
          }
          return true;
        }
      };
    }
    /* c8 ignore next 3 */
    markClean() {
      this[isClean] = true;
    }
    markDirty() {
      if (this[isClean]) {
        this[isClean] = false;
        let next = this;
        while (next = next.parent) {
          next[isClean] = false;
        }
      }
    }
    next() {
      if (!this.parent) return void 0;
      let index = this.parent.index(this);
      return this.parent.nodes[index + 1];
    }
    positionBy(opts = {}) {
      let pos = this.source.start;
      if (opts.index) {
        pos = this.positionInside(opts.index);
      } else if (opts.word) {
        let inputString = "document" in this.source.input ? this.source.input.document : this.source.input.css;
        let stringRepresentation = inputString.slice(
          sourceOffset(inputString, this.source.start),
          sourceOffset(inputString, this.source.end)
        );
        let index = stringRepresentation.indexOf(opts.word);
        if (index !== -1) pos = this.positionInside(index);
      }
      return pos;
    }
    positionInside(index) {
      let column = this.source.start.column;
      let line = this.source.start.line;
      let inputString = "document" in this.source.input ? this.source.input.document : this.source.input.css;
      let offset = sourceOffset(inputString, this.source.start);
      let end = offset + index;
      for (let i = offset; i < end; i++) {
        if (inputString[i] === "\n") {
          column = 1;
          line += 1;
        } else {
          column += 1;
        }
      }
      return { column, line, offset: end };
    }
    prev() {
      if (!this.parent) return void 0;
      let index = this.parent.index(this);
      return this.parent.nodes[index - 1];
    }
    rangeBy(opts = {}) {
      let inputString = "document" in this.source.input ? this.source.input.document : this.source.input.css;
      let start = {
        column: this.source.start.column,
        line: this.source.start.line,
        offset: sourceOffset(inputString, this.source.start)
      };
      let end = this.source.end ? {
        column: this.source.end.column + 1,
        line: this.source.end.line,
        offset: typeof this.source.end.offset === "number" ? (
          // `source.end.offset` is exclusive, so we don't need to add 1
          this.source.end.offset
        ) : (
          // Since line/column in this.source.end is inclusive,
          // the `sourceOffset(... , this.source.end)` returns an inclusive offset.
          // So, we add 1 to convert it to exclusive.
          sourceOffset(inputString, this.source.end) + 1
        )
      } : {
        column: start.column + 1,
        line: start.line,
        offset: start.offset + 1
      };
      if (opts.word) {
        let stringRepresentation = inputString.slice(
          sourceOffset(inputString, this.source.start),
          sourceOffset(inputString, this.source.end)
        );
        let index = stringRepresentation.indexOf(opts.word);
        if (index !== -1) {
          start = this.positionInside(index);
          end = this.positionInside(index + opts.word.length);
        }
      } else {
        if (opts.start) {
          start = {
            column: opts.start.column,
            line: opts.start.line,
            offset: sourceOffset(inputString, opts.start)
          };
        } else if (opts.index) {
          start = this.positionInside(opts.index);
        }
        if (opts.end) {
          end = {
            column: opts.end.column,
            line: opts.end.line,
            offset: sourceOffset(inputString, opts.end)
          };
        } else if (typeof opts.endIndex === "number") {
          end = this.positionInside(opts.endIndex);
        } else if (opts.index) {
          end = this.positionInside(opts.index + 1);
        }
      }
      if (end.line < start.line || end.line === start.line && end.column <= start.column) {
        end = {
          column: start.column + 1,
          line: start.line,
          offset: start.offset + 1
        };
      }
      return { end, start };
    }
    raw(prop, defaultType) {
      let str = new Stringifier();
      return str.raw(this, prop, defaultType);
    }
    remove() {
      if (this.parent) {
        this.parent.removeChild(this);
      }
      this.parent = void 0;
      return this;
    }
    replaceWith(...nodes) {
      if (this.parent) {
        let bookmark = this;
        let foundSelf = false;
        for (let node2 of nodes) {
          if (node2 === this) {
            foundSelf = true;
          } else if (foundSelf) {
            this.parent.insertAfter(bookmark, node2);
            bookmark = node2;
          } else {
            this.parent.insertBefore(bookmark, node2);
          }
        }
        if (!foundSelf) {
          this.remove();
        }
      }
      return this;
    }
    root() {
      let result2 = this;
      while (result2.parent && result2.parent.type !== "document") {
        result2 = result2.parent;
      }
      return result2;
    }
    toJSON(_, inputs) {
      let fixed = {};
      let emitInputs = inputs == null;
      inputs = inputs || /* @__PURE__ */ new Map();
      let inputsNextIndex = 0;
      for (let name in this) {
        if (!Object.prototype.hasOwnProperty.call(this, name)) {
          continue;
        }
        if (name === "parent" || name === "proxyCache") continue;
        let value = this[name];
        if (Array.isArray(value)) {
          fixed[name] = value.map((i) => {
            if (typeof i === "object" && i.toJSON) {
              return i.toJSON(null, inputs);
            } else {
              return i;
            }
          });
        } else if (typeof value === "object" && value.toJSON) {
          fixed[name] = value.toJSON(null, inputs);
        } else if (name === "source") {
          if (value == null) continue;
          let inputId = inputs.get(value.input);
          if (inputId == null) {
            inputId = inputsNextIndex;
            inputs.set(value.input, inputsNextIndex);
            inputsNextIndex++;
          }
          fixed[name] = {
            end: value.end,
            inputId,
            start: value.start
          };
        } else {
          fixed[name] = value;
        }
      }
      if (emitInputs) {
        fixed.inputs = [...inputs.keys()].map((input2) => input2.toJSON());
      }
      return fixed;
    }
    toProxy() {
      if (!this.proxyCache) {
        this.proxyCache = new Proxy(this, this.getProxyProcessor());
      }
      return this.proxyCache;
    }
    toString(stringifier2 = stringify2) {
      if (stringifier2.stringify) stringifier2 = stringifier2.stringify;
      let result2 = "";
      stringifier2(this, (i) => {
        result2 += i;
      });
      return result2;
    }
    warn(result2, text, opts = {}) {
      let data = { node: this };
      for (let i in opts) data[i] = opts[i];
      return result2.warn(text, data);
    }
  }
  node = Node;
  Node.default = Node;
  return node;
}
var comment;
var hasRequiredComment;
function requireComment() {
  if (hasRequiredComment) return comment;
  hasRequiredComment = 1;
  let Node = requireNode();
  class Comment extends Node {
    constructor(defaults) {
      super(defaults);
      this.type = "comment";
    }
  }
  comment = Comment;
  Comment.default = Comment;
  return comment;
}
var declaration;
var hasRequiredDeclaration;
function requireDeclaration() {
  if (hasRequiredDeclaration) return declaration;
  hasRequiredDeclaration = 1;
  let Node = requireNode();
  class Declaration extends Node {
    get variable() {
      return this.prop.startsWith("--") || this.prop[0] === "$";
    }
    constructor(defaults) {
      if (defaults && typeof defaults.value !== "undefined" && typeof defaults.value !== "string") {
        defaults = { ...defaults, value: String(defaults.value) };
      }
      super(defaults);
      this.type = "decl";
    }
  }
  declaration = Declaration;
  Declaration.default = Declaration;
  return declaration;
}
var container;
var hasRequiredContainer;
function requireContainer() {
  if (hasRequiredContainer) return container;
  hasRequiredContainer = 1;
  let Comment = requireComment();
  let Declaration = requireDeclaration();
  let Node = requireNode();
  let { isClean, my } = requireSymbols();
  let AtRule, parse, Root, Rule;
  function cleanSource(nodes) {
    return nodes.map((i) => {
      if (i.nodes) i.nodes = cleanSource(i.nodes);
      delete i.source;
      return i;
    });
  }
  function markTreeDirty(node2) {
    node2[isClean] = false;
    if (node2.proxyOf.nodes) {
      for (let i of node2.proxyOf.nodes) {
        markTreeDirty(i);
      }
    }
  }
  class Container extends Node {
    get first() {
      if (!this.proxyOf.nodes) return void 0;
      return this.proxyOf.nodes[0];
    }
    get last() {
      if (!this.proxyOf.nodes) return void 0;
      return this.proxyOf.nodes[this.proxyOf.nodes.length - 1];
    }
    append(...children) {
      for (let child of children) {
        let nodes = this.normalize(child, this.last);
        for (let node2 of nodes) this.proxyOf.nodes.push(node2);
      }
      this.markDirty();
      return this;
    }
    cleanRaws(keepBetween) {
      super.cleanRaws(keepBetween);
      if (this.nodes) {
        for (let node2 of this.nodes) node2.cleanRaws(keepBetween);
      }
    }
    each(callback) {
      if (!this.proxyOf.nodes) return void 0;
      let iterator = this.getIterator();
      let index, result2;
      while (this.indexes[iterator] < this.proxyOf.nodes.length) {
        index = this.indexes[iterator];
        result2 = callback(this.proxyOf.nodes[index], index);
        if (result2 === false) break;
        this.indexes[iterator] += 1;
      }
      delete this.indexes[iterator];
      return result2;
    }
    every(condition) {
      return this.nodes.every(condition);
    }
    getIterator() {
      if (!this.lastEach) this.lastEach = 0;
      if (!this.indexes) this.indexes = {};
      this.lastEach += 1;
      let iterator = this.lastEach;
      this.indexes[iterator] = 0;
      return iterator;
    }
    getProxyProcessor() {
      return {
        get(node2, prop) {
          if (prop === "proxyOf") {
            return node2;
          } else if (!node2[prop]) {
            return node2[prop];
          } else if (prop === "each" || typeof prop === "string" && prop.startsWith("walk")) {
            return (...args) => {
              return node2[prop](
                ...args.map((i) => {
                  if (typeof i === "function") {
                    return (child, index) => i(child.toProxy(), index);
                  } else {
                    return i;
                  }
                })
              );
            };
          } else if (prop === "every" || prop === "some") {
            return (cb) => {
              return node2[prop](
                (child, ...other) => cb(child.toProxy(), ...other)
              );
            };
          } else if (prop === "root") {
            return () => node2.root().toProxy();
          } else if (prop === "nodes") {
            return node2.nodes.map((i) => i.toProxy());
          } else if (prop === "first" || prop === "last") {
            return node2[prop].toProxy();
          } else {
            return node2[prop];
          }
        },
        set(node2, prop, value) {
          if (node2[prop] === value) return true;
          node2[prop] = value;
          if (prop === "name" || prop === "params" || prop === "selector") {
            node2.markDirty();
          }
          return true;
        }
      };
    }
    index(child) {
      if (typeof child === "number") return child;
      if (child.proxyOf) child = child.proxyOf;
      return this.proxyOf.nodes.indexOf(child);
    }
    insertAfter(exist, add) {
      let existIndex = this.index(exist);
      let nodes = this.normalize(add, this.proxyOf.nodes[existIndex]).reverse();
      existIndex = this.index(exist);
      for (let node2 of nodes) this.proxyOf.nodes.splice(existIndex + 1, 0, node2);
      let index;
      for (let id in this.indexes) {
        index = this.indexes[id];
        if (existIndex < index) {
          this.indexes[id] = index + nodes.length;
        }
      }
      this.markDirty();
      return this;
    }
    insertBefore(exist, add) {
      let existIndex = this.index(exist);
      let type = existIndex === 0 ? "prepend" : false;
      let nodes = this.normalize(
        add,
        this.proxyOf.nodes[existIndex],
        type
      ).reverse();
      existIndex = this.index(exist);
      for (let node2 of nodes) this.proxyOf.nodes.splice(existIndex, 0, node2);
      let index;
      for (let id in this.indexes) {
        index = this.indexes[id];
        if (existIndex <= index) {
          this.indexes[id] = index + nodes.length;
        }
      }
      this.markDirty();
      return this;
    }
    normalize(nodes, sample) {
      if (typeof nodes === "string") {
        nodes = cleanSource(parse(nodes).nodes);
      } else if (typeof nodes === "undefined") {
        nodes = [];
      } else if (Array.isArray(nodes)) {
        nodes = nodes.slice(0);
        for (let i of nodes) {
          if (i.parent) i.parent.removeChild(i, "ignore");
        }
      } else if (nodes.type === "root" && this.type !== "document") {
        nodes = nodes.nodes.slice(0);
        for (let i of nodes) {
          if (i.parent) i.parent.removeChild(i, "ignore");
        }
      } else if (nodes.type) {
        nodes = [nodes];
      } else if (nodes.prop) {
        if (typeof nodes.value === "undefined") {
          throw new Error("Value field is missed in node creation");
        } else if (typeof nodes.value !== "string") {
          nodes.value = String(nodes.value);
        }
        nodes = [new Declaration(nodes)];
      } else if (nodes.selector || nodes.selectors) {
        nodes = [new Rule(nodes)];
      } else if (nodes.name) {
        nodes = [new AtRule(nodes)];
      } else if (nodes.text) {
        nodes = [new Comment(nodes)];
      } else {
        throw new Error("Unknown node type in node creation");
      }
      let processed = nodes.map((i) => {
        if (!i[my]) Container.rebuild(i);
        i = i.proxyOf;
        if (i.parent) i.parent.removeChild(i);
        if (i[isClean]) markTreeDirty(i);
        if (!i.raws) i.raws = {};
        if (typeof i.raws.before === "undefined") {
          if (sample && typeof sample.raws.before !== "undefined") {
            i.raws.before = sample.raws.before.replace(/\S/g, "");
          }
        }
        i.parent = this.proxyOf;
        return i;
      });
      return processed;
    }
    prepend(...children) {
      children = children.reverse();
      for (let child of children) {
        let nodes = this.normalize(child, this.first, "prepend").reverse();
        for (let node2 of nodes) this.proxyOf.nodes.unshift(node2);
        for (let id in this.indexes) {
          this.indexes[id] = this.indexes[id] + nodes.length;
        }
      }
      this.markDirty();
      return this;
    }
    push(child) {
      child.parent = this;
      this.proxyOf.nodes.push(child);
      return this;
    }
    removeAll() {
      for (let node2 of this.proxyOf.nodes) node2.parent = void 0;
      this.proxyOf.nodes = [];
      this.markDirty();
      return this;
    }
    removeChild(child) {
      child = this.index(child);
      this.proxyOf.nodes[child].parent = void 0;
      this.proxyOf.nodes.splice(child, 1);
      let index;
      for (let id in this.indexes) {
        index = this.indexes[id];
        if (index >= child) {
          this.indexes[id] = index - 1;
        }
      }
      this.markDirty();
      return this;
    }
    replaceValues(pattern, opts, callback) {
      if (!callback) {
        callback = opts;
        opts = {};
      }
      this.walkDecls((decl) => {
        if (opts.props && !opts.props.includes(decl.prop)) return;
        if (opts.fast && !decl.value.includes(opts.fast)) return;
        decl.value = decl.value.replace(pattern, callback);
      });
      this.markDirty();
      return this;
    }
    some(condition) {
      return this.nodes.some(condition);
    }
    walk(callback) {
      return this.each((child, i) => {
        let result2;
        try {
          result2 = callback(child, i);
        } catch (e) {
          throw child.addToError(e);
        }
        if (result2 !== false && child.walk) {
          result2 = child.walk(callback);
        }
        return result2;
      });
    }
    walkAtRules(name, callback) {
      if (!callback) {
        callback = name;
        return this.walk((child, i) => {
          if (child.type === "atrule") {
            return callback(child, i);
          }
        });
      }
      if (name instanceof RegExp) {
        return this.walk((child, i) => {
          if (child.type === "atrule" && name.test(child.name)) {
            return callback(child, i);
          }
        });
      }
      return this.walk((child, i) => {
        if (child.type === "atrule" && child.name === name) {
          return callback(child, i);
        }
      });
    }
    walkComments(callback) {
      return this.walk((child, i) => {
        if (child.type === "comment") {
          return callback(child, i);
        }
      });
    }
    walkDecls(prop, callback) {
      if (!callback) {
        callback = prop;
        return this.walk((child, i) => {
          if (child.type === "decl") {
            return callback(child, i);
          }
        });
      }
      if (prop instanceof RegExp) {
        return this.walk((child, i) => {
          if (child.type === "decl" && prop.test(child.prop)) {
            return callback(child, i);
          }
        });
      }
      return this.walk((child, i) => {
        if (child.type === "decl" && child.prop === prop) {
          return callback(child, i);
        }
      });
    }
    walkRules(selector, callback) {
      if (!callback) {
        callback = selector;
        return this.walk((child, i) => {
          if (child.type === "rule") {
            return callback(child, i);
          }
        });
      }
      if (selector instanceof RegExp) {
        return this.walk((child, i) => {
          if (child.type === "rule" && selector.test(child.selector)) {
            return callback(child, i);
          }
        });
      }
      return this.walk((child, i) => {
        if (child.type === "rule" && child.selector === selector) {
          return callback(child, i);
        }
      });
    }
  }
  Container.registerParse = (dependant) => {
    parse = dependant;
  };
  Container.registerRule = (dependant) => {
    Rule = dependant;
  };
  Container.registerAtRule = (dependant) => {
    AtRule = dependant;
  };
  Container.registerRoot = (dependant) => {
    Root = dependant;
  };
  container = Container;
  Container.default = Container;
  Container.rebuild = (node2) => {
    if (node2.type === "atrule") {
      Object.setPrototypeOf(node2, AtRule.prototype);
    } else if (node2.type === "rule") {
      Object.setPrototypeOf(node2, Rule.prototype);
    } else if (node2.type === "decl") {
      Object.setPrototypeOf(node2, Declaration.prototype);
    } else if (node2.type === "comment") {
      Object.setPrototypeOf(node2, Comment.prototype);
    } else if (node2.type === "root") {
      Object.setPrototypeOf(node2, Root.prototype);
    }
    node2[my] = true;
    if (node2.nodes) {
      node2.nodes.forEach((child) => {
        Container.rebuild(child);
      });
    }
  };
  return container;
}
var atRule;
var hasRequiredAtRule;
function requireAtRule() {
  if (hasRequiredAtRule) return atRule;
  hasRequiredAtRule = 1;
  let Container = requireContainer();
  class AtRule extends Container {
    constructor(defaults) {
      super(defaults);
      this.type = "atrule";
    }
    append(...children) {
      if (!this.proxyOf.nodes) this.nodes = [];
      return super.append(...children);
    }
    prepend(...children) {
      if (!this.proxyOf.nodes) this.nodes = [];
      return super.prepend(...children);
    }
  }
  atRule = AtRule;
  AtRule.default = AtRule;
  Container.registerAtRule(AtRule);
  return atRule;
}
var document;
var hasRequiredDocument;
function requireDocument() {
  if (hasRequiredDocument) return document;
  hasRequiredDocument = 1;
  let Container = requireContainer();
  let LazyResult, Processor;
  class Document extends Container {
    constructor(defaults) {
      super({ type: "document", ...defaults });
      if (!this.nodes) {
        this.nodes = [];
      }
    }
    toResult(opts = {}) {
      let lazy = new LazyResult(new Processor(), this, opts);
      return lazy.stringify();
    }
  }
  Document.registerLazyResult = (dependant) => {
    LazyResult = dependant;
  };
  Document.registerProcessor = (dependant) => {
    Processor = dependant;
  };
  document = Document;
  Document.default = Document;
  return document;
}
var nonSecure;
var hasRequiredNonSecure;
function requireNonSecure() {
  if (hasRequiredNonSecure) return nonSecure;
  hasRequiredNonSecure = 1;
  let urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
  let customAlphabet = (alphabet, defaultSize = 21) => {
    return (size = defaultSize) => {
      let id = "";
      let i = size | 0;
      while (i--) {
        id += alphabet[Math.random() * alphabet.length | 0];
      }
      return id;
    };
  };
  let nanoid = (size = 21) => {
    let id = "";
    let i = size | 0;
    while (i--) {
      id += urlAlphabet[Math.random() * 64 | 0];
    }
    return id;
  };
  nonSecure = { nanoid, customAlphabet };
  return nonSecure;
}
var sourceMap = {};
var sourceMapGenerator = {};
var base64Vlq = {};
var base64 = {};
var hasRequiredBase64;
function requireBase64() {
  if (hasRequiredBase64) return base64;
  hasRequiredBase64 = 1;
  var intToCharMap = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
  base64.encode = function(number) {
    if (0 <= number && number < intToCharMap.length) {
      return intToCharMap[number];
    }
    throw new TypeError("Must be between 0 and 63: " + number);
  };
  base64.decode = function(charCode) {
    var bigA = 65;
    var bigZ = 90;
    var littleA = 97;
    var littleZ = 122;
    var zero = 48;
    var nine = 57;
    var plus = 43;
    var slash = 47;
    var littleOffset = 26;
    var numberOffset = 52;
    if (bigA <= charCode && charCode <= bigZ) {
      return charCode - bigA;
    }
    if (littleA <= charCode && charCode <= littleZ) {
      return charCode - littleA + littleOffset;
    }
    if (zero <= charCode && charCode <= nine) {
      return charCode - zero + numberOffset;
    }
    if (charCode == plus) {
      return 62;
    }
    if (charCode == slash) {
      return 63;
    }
    return -1;
  };
  return base64;
}
var hasRequiredBase64Vlq;
function requireBase64Vlq() {
  if (hasRequiredBase64Vlq) return base64Vlq;
  hasRequiredBase64Vlq = 1;
  var base642 = requireBase64();
  var VLQ_BASE_SHIFT = 5;
  var VLQ_BASE = 1 << VLQ_BASE_SHIFT;
  var VLQ_BASE_MASK = VLQ_BASE - 1;
  var VLQ_CONTINUATION_BIT = VLQ_BASE;
  function toVLQSigned(aValue) {
    return aValue < 0 ? (-aValue << 1) + 1 : (aValue << 1) + 0;
  }
  function fromVLQSigned(aValue) {
    var isNegative = (aValue & 1) === 1;
    var shifted = aValue >> 1;
    return isNegative ? -shifted : shifted;
  }
  base64Vlq.encode = function base64VLQ_encode(aValue) {
    var encoded = "";
    var digit;
    var vlq = toVLQSigned(aValue);
    do {
      digit = vlq & VLQ_BASE_MASK;
      vlq >>>= VLQ_BASE_SHIFT;
      if (vlq > 0) {
        digit |= VLQ_CONTINUATION_BIT;
      }
      encoded += base642.encode(digit);
    } while (vlq > 0);
    return encoded;
  };
  base64Vlq.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
    var strLen = aStr.length;
    var result2 = 0;
    var shift = 0;
    var continuation, digit;
    do {
      if (aIndex >= strLen) {
        throw new Error("Expected more digits in base 64 VLQ value.");
      }
      digit = base642.decode(aStr.charCodeAt(aIndex++));
      if (digit === -1) {
        throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
      }
      continuation = !!(digit & VLQ_CONTINUATION_BIT);
      digit &= VLQ_BASE_MASK;
      result2 = result2 + (digit << shift);
      shift += VLQ_BASE_SHIFT;
    } while (continuation);
    aOutParam.value = fromVLQSigned(result2);
    aOutParam.rest = aIndex;
  };
  return base64Vlq;
}
var util = {};
var hasRequiredUtil;
function requireUtil() {
  if (hasRequiredUtil) return util;
  hasRequiredUtil = 1;
  (function(exports$1) {
    function getArg(aArgs, aName, aDefaultValue) {
      if (aName in aArgs) {
        return aArgs[aName];
      } else if (arguments.length === 3) {
        return aDefaultValue;
      } else {
        throw new Error('"' + aName + '" is a required argument.');
      }
    }
    exports$1.getArg = getArg;
    var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/;
    var dataUrlRegexp = /^data:.+\,.+$/;
    function urlParse(aUrl) {
      var match = aUrl.match(urlRegexp);
      if (!match) {
        return null;
      }
      return {
        scheme: match[1],
        auth: match[2],
        host: match[3],
        port: match[4],
        path: match[5]
      };
    }
    exports$1.urlParse = urlParse;
    function urlGenerate(aParsedUrl) {
      var url = "";
      if (aParsedUrl.scheme) {
        url += aParsedUrl.scheme + ":";
      }
      url += "//";
      if (aParsedUrl.auth) {
        url += aParsedUrl.auth + "@";
      }
      if (aParsedUrl.host) {
        url += aParsedUrl.host;
      }
      if (aParsedUrl.port) {
        url += ":" + aParsedUrl.port;
      }
      if (aParsedUrl.path) {
        url += aParsedUrl.path;
      }
      return url;
    }
    exports$1.urlGenerate = urlGenerate;
    var MAX_CACHED_INPUTS = 32;
    function lruMemoize(f) {
      var cache = [];
      return function(input2) {
        for (var i = 0; i < cache.length; i++) {
          if (cache[i].input === input2) {
            var temp = cache[0];
            cache[0] = cache[i];
            cache[i] = temp;
            return cache[0].result;
          }
        }
        var result2 = f(input2);
        cache.unshift({
          input: input2,
          result: result2
        });
        if (cache.length > MAX_CACHED_INPUTS) {
          cache.pop();
        }
        return result2;
      };
    }
    var normalize = lruMemoize(function normalize2(aPath) {
      var path = aPath;
      var url = urlParse(aPath);
      if (url) {
        if (!url.path) {
          return aPath;
        }
        path = url.path;
      }
      var isAbsolute = exports$1.isAbsolute(path);
      var parts = [];
      var start = 0;
      var i = 0;
      while (true) {
        start = i;
        i = path.indexOf("/", start);
        if (i === -1) {
          parts.push(path.slice(start));
          break;
        } else {
          parts.push(path.slice(start, i));
          while (i < path.length && path[i] === "/") {
            i++;
          }
        }
      }
      for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
        part = parts[i];
        if (part === ".") {
          parts.splice(i, 1);
        } else if (part === "..") {
          up++;
        } else if (up > 0) {
          if (part === "") {
            parts.splice(i + 1, up);
            up = 0;
          } else {
            parts.splice(i, 2);
            up--;
          }
        }
      }
      path = parts.join("/");
      if (path === "") {
        path = isAbsolute ? "/" : ".";
      }
      if (url) {
        url.path = path;
        return urlGenerate(url);
      }
      return path;
    });
    exports$1.normalize = normalize;
    function join(aRoot, aPath) {
      if (aRoot === "") {
        aRoot = ".";
      }
      if (aPath === "") {
        aPath = ".";
      }
      var aPathUrl = urlParse(aPath);
      var aRootUrl = urlParse(aRoot);
      if (aRootUrl) {
        aRoot = aRootUrl.path || "/";
      }
      if (aPathUrl && !aPathUrl.scheme) {
        if (aRootUrl) {
          aPathUrl.scheme = aRootUrl.scheme;
        }
        return urlGenerate(aPathUrl);
      }
      if (aPathUrl || aPath.match(dataUrlRegexp)) {
        return aPath;
      }
      if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
        aRootUrl.host = aPath;
        return urlGenerate(aRootUrl);
      }
      var joined = aPath.charAt(0) === "/" ? aPath : normalize(aRoot.replace(/\/+$/, "") + "/" + aPath);
      if (aRootUrl) {
        aRootUrl.path = joined;
        return urlGenerate(aRootUrl);
      }
      return joined;
    }
    exports$1.join = join;
    exports$1.isAbsolute = function(aPath) {
      return aPath.charAt(0) === "/" || urlRegexp.test(aPath);
    };
    function relative(aRoot, aPath) {
      if (aRoot === "") {
        aRoot = ".";
      }
      aRoot = aRoot.replace(/\/$/, "");
      var level = 0;
      while (aPath.indexOf(aRoot + "/") !== 0) {
        var index = aRoot.lastIndexOf("/");
        if (index < 0) {
          return aPath;
        }
        aRoot = aRoot.slice(0, index);
        if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
          return aPath;
        }
        ++level;
      }
      return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
    }
    exports$1.relative = relative;
    var supportsNullProto = (function() {
      var obj = /* @__PURE__ */ Object.create(null);
      return !("__proto__" in obj);
    })();
    function identity(s) {
      return s;
    }
    function toSetString(aStr) {
      if (isProtoString(aStr)) {
        return "$" + aStr;
      }
      return aStr;
    }
    exports$1.toSetString = supportsNullProto ? identity : toSetString;
    function fromSetString(aStr) {
      if (isProtoString(aStr)) {
        return aStr.slice(1);
      }
      return aStr;
    }
    exports$1.fromSetString = supportsNullProto ? identity : fromSetString;
    function isProtoString(s) {
      if (!s) {
        return false;
      }
      var length = s.length;
      if (length < 9) {
        return false;
      }
      if (s.charCodeAt(length - 1) !== 95 || s.charCodeAt(length - 2) !== 95 || s.charCodeAt(length - 3) !== 111 || s.charCodeAt(length - 4) !== 116 || s.charCodeAt(length - 5) !== 111 || s.charCodeAt(length - 6) !== 114 || s.charCodeAt(length - 7) !== 112 || s.charCodeAt(length - 8) !== 95 || s.charCodeAt(length - 9) !== 95) {
        return false;
      }
      for (var i = length - 10; i >= 0; i--) {
        if (s.charCodeAt(i) !== 36) {
          return false;
        }
      }
      return true;
    }
    function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
      var cmp = strcmp(mappingA.source, mappingB.source);
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalLine - mappingB.originalLine;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalColumn - mappingB.originalColumn;
      if (cmp !== 0 || onlyCompareOriginal) {
        return cmp;
      }
      cmp = mappingA.generatedColumn - mappingB.generatedColumn;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.generatedLine - mappingB.generatedLine;
      if (cmp !== 0) {
        return cmp;
      }
      return strcmp(mappingA.name, mappingB.name);
    }
    exports$1.compareByOriginalPositions = compareByOriginalPositions;
    function compareByOriginalPositionsNoSource(mappingA, mappingB, onlyCompareOriginal) {
      var cmp;
      cmp = mappingA.originalLine - mappingB.originalLine;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalColumn - mappingB.originalColumn;
      if (cmp !== 0 || onlyCompareOriginal) {
        return cmp;
      }
      cmp = mappingA.generatedColumn - mappingB.generatedColumn;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.generatedLine - mappingB.generatedLine;
      if (cmp !== 0) {
        return cmp;
      }
      return strcmp(mappingA.name, mappingB.name);
    }
    exports$1.compareByOriginalPositionsNoSource = compareByOriginalPositionsNoSource;
    function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
      var cmp = mappingA.generatedLine - mappingB.generatedLine;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.generatedColumn - mappingB.generatedColumn;
      if (cmp !== 0 || onlyCompareGenerated) {
        return cmp;
      }
      cmp = strcmp(mappingA.source, mappingB.source);
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalLine - mappingB.originalLine;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalColumn - mappingB.originalColumn;
      if (cmp !== 0) {
        return cmp;
      }
      return strcmp(mappingA.name, mappingB.name);
    }
    exports$1.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;
    function compareByGeneratedPositionsDeflatedNoLine(mappingA, mappingB, onlyCompareGenerated) {
      var cmp = mappingA.generatedColumn - mappingB.generatedColumn;
      if (cmp !== 0 || onlyCompareGenerated) {
        return cmp;
      }
      cmp = strcmp(mappingA.source, mappingB.source);
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalLine - mappingB.originalLine;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalColumn - mappingB.originalColumn;
      if (cmp !== 0) {
        return cmp;
      }
      return strcmp(mappingA.name, mappingB.name);
    }
    exports$1.compareByGeneratedPositionsDeflatedNoLine = compareByGeneratedPositionsDeflatedNoLine;
    function strcmp(aStr1, aStr2) {
      if (aStr1 === aStr2) {
        return 0;
      }
      if (aStr1 === null) {
        return 1;
      }
      if (aStr2 === null) {
        return -1;
      }
      if (aStr1 > aStr2) {
        return 1;
      }
      return -1;
    }
    function compareByGeneratedPositionsInflated(mappingA, mappingB) {
      var cmp = mappingA.generatedLine - mappingB.generatedLine;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.generatedColumn - mappingB.generatedColumn;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = strcmp(mappingA.source, mappingB.source);
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalLine - mappingB.originalLine;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalColumn - mappingB.originalColumn;
      if (cmp !== 0) {
        return cmp;
      }
      return strcmp(mappingA.name, mappingB.name);
    }
    exports$1.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;
    function parseSourceMapInput(str) {
      return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ""));
    }
    exports$1.parseSourceMapInput = parseSourceMapInput;
    function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
      sourceURL = sourceURL || "";
      if (sourceRoot) {
        if (sourceRoot[sourceRoot.length - 1] !== "/" && sourceURL[0] !== "/") {
          sourceRoot += "/";
        }
        sourceURL = sourceRoot + sourceURL;
      }
      if (sourceMapURL) {
        var parsed = urlParse(sourceMapURL);
        if (!parsed) {
          throw new Error("sourceMapURL could not be parsed");
        }
        if (parsed.path) {
          var index = parsed.path.lastIndexOf("/");
          if (index >= 0) {
            parsed.path = parsed.path.substring(0, index + 1);
          }
        }
        sourceURL = join(urlGenerate(parsed), sourceURL);
      }
      return normalize(sourceURL);
    }
    exports$1.computeSourceURL = computeSourceURL;
  })(util);
  return util;
}
var arraySet = {};
var hasRequiredArraySet;
function requireArraySet() {
  if (hasRequiredArraySet) return arraySet;
  hasRequiredArraySet = 1;
  var util2 = requireUtil();
  var has = Object.prototype.hasOwnProperty;
  var hasNativeMap = typeof Map !== "undefined";
  function ArraySet() {
    this._array = [];
    this._set = hasNativeMap ? /* @__PURE__ */ new Map() : /* @__PURE__ */ Object.create(null);
  }
  ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
    var set = new ArraySet();
    for (var i = 0, len = aArray.length; i < len; i++) {
      set.add(aArray[i], aAllowDuplicates);
    }
    return set;
  };
  ArraySet.prototype.size = function ArraySet_size() {
    return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
  };
  ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
    var sStr = hasNativeMap ? aStr : util2.toSetString(aStr);
    var isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr);
    var idx = this._array.length;
    if (!isDuplicate || aAllowDuplicates) {
      this._array.push(aStr);
    }
    if (!isDuplicate) {
      if (hasNativeMap) {
        this._set.set(aStr, idx);
      } else {
        this._set[sStr] = idx;
      }
    }
  };
  ArraySet.prototype.has = function ArraySet_has(aStr) {
    if (hasNativeMap) {
      return this._set.has(aStr);
    } else {
      var sStr = util2.toSetString(aStr);
      return has.call(this._set, sStr);
    }
  };
  ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
    if (hasNativeMap) {
      var idx = this._set.get(aStr);
      if (idx >= 0) {
        return idx;
      }
    } else {
      var sStr = util2.toSetString(aStr);
      if (has.call(this._set, sStr)) {
        return this._set[sStr];
      }
    }
    throw new Error('"' + aStr + '" is not in the set.');
  };
  ArraySet.prototype.at = function ArraySet_at(aIdx) {
    if (aIdx >= 0 && aIdx < this._array.length) {
      return this._array[aIdx];
    }
    throw new Error("No element indexed by " + aIdx);
  };
  ArraySet.prototype.toArray = function ArraySet_toArray() {
    return this._array.slice();
  };
  arraySet.ArraySet = ArraySet;
  return arraySet;
}
var mappingList = {};
var hasRequiredMappingList;
function requireMappingList() {
  if (hasRequiredMappingList) return mappingList;
  hasRequiredMappingList = 1;
  var util2 = requireUtil();
  function generatedPositionAfter(mappingA, mappingB) {
    var lineA = mappingA.generatedLine;
    var lineB = mappingB.generatedLine;
    var columnA = mappingA.generatedColumn;
    var columnB = mappingB.generatedColumn;
    return lineB > lineA || lineB == lineA && columnB >= columnA || util2.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
  }
  function MappingList() {
    this._array = [];
    this._sorted = true;
    this._last = { generatedLine: -1, generatedColumn: 0 };
  }
  MappingList.prototype.unsortedForEach = function MappingList_forEach(aCallback, aThisArg) {
    this._array.forEach(aCallback, aThisArg);
  };
  MappingList.prototype.add = function MappingList_add(aMapping) {
    if (generatedPositionAfter(this._last, aMapping)) {
      this._last = aMapping;
      this._array.push(aMapping);
    } else {
      this._sorted = false;
      this._array.push(aMapping);
    }
  };
  MappingList.prototype.toArray = function MappingList_toArray() {
    if (!this._sorted) {
      this._array.sort(util2.compareByGeneratedPositionsInflated);
      this._sorted = true;
    }
    return this._array;
  };
  mappingList.MappingList = MappingList;
  return mappingList;
}
var hasRequiredSourceMapGenerator;
function requireSourceMapGenerator() {
  if (hasRequiredSourceMapGenerator) return sourceMapGenerator;
  hasRequiredSourceMapGenerator = 1;
  var base64VLQ = requireBase64Vlq();
  var util2 = requireUtil();
  var ArraySet = requireArraySet().ArraySet;
  var MappingList = requireMappingList().MappingList;
  function SourceMapGenerator(aArgs) {
    if (!aArgs) {
      aArgs = {};
    }
    this._file = util2.getArg(aArgs, "file", null);
    this._sourceRoot = util2.getArg(aArgs, "sourceRoot", null);
    this._skipValidation = util2.getArg(aArgs, "skipValidation", false);
    this._ignoreInvalidMapping = util2.getArg(aArgs, "ignoreInvalidMapping", false);
    this._sources = new ArraySet();
    this._names = new ArraySet();
    this._mappings = new MappingList();
    this._sourcesContents = null;
  }
  SourceMapGenerator.prototype._version = 3;
  SourceMapGenerator.fromSourceMap = function SourceMapGenerator_fromSourceMap(aSourceMapConsumer, generatorOps) {
    var sourceRoot = aSourceMapConsumer.sourceRoot;
    var generator = new SourceMapGenerator(Object.assign(generatorOps || {}, {
      file: aSourceMapConsumer.file,
      sourceRoot
    }));
    aSourceMapConsumer.eachMapping(function(mapping) {
      var newMapping = {
        generated: {
          line: mapping.generatedLine,
          column: mapping.generatedColumn
        }
      };
      if (mapping.source != null) {
        newMapping.source = mapping.source;
        if (sourceRoot != null) {
          newMapping.source = util2.relative(sourceRoot, newMapping.source);
        }
        newMapping.original = {
          line: mapping.originalLine,
          column: mapping.originalColumn
        };
        if (mapping.name != null) {
          newMapping.name = mapping.name;
        }
      }
      generator.addMapping(newMapping);
    });
    aSourceMapConsumer.sources.forEach(function(sourceFile) {
      var sourceRelative = sourceFile;
      if (sourceRoot !== null) {
        sourceRelative = util2.relative(sourceRoot, sourceFile);
      }
      if (!generator._sources.has(sourceRelative)) {
        generator._sources.add(sourceRelative);
      }
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        generator.setSourceContent(sourceFile, content);
      }
    });
    return generator;
  };
  SourceMapGenerator.prototype.addMapping = function SourceMapGenerator_addMapping(aArgs) {
    var generated = util2.getArg(aArgs, "generated");
    var original = util2.getArg(aArgs, "original", null);
    var source = util2.getArg(aArgs, "source", null);
    var name = util2.getArg(aArgs, "name", null);
    if (!this._skipValidation) {
      if (this._validateMapping(generated, original, source, name) === false) {
        return;
      }
    }
    if (source != null) {
      source = String(source);
      if (!this._sources.has(source)) {
        this._sources.add(source);
      }
    }
    if (name != null) {
      name = String(name);
      if (!this._names.has(name)) {
        this._names.add(name);
      }
    }
    this._mappings.add({
      generatedLine: generated.line,
      generatedColumn: generated.column,
      originalLine: original != null && original.line,
      originalColumn: original != null && original.column,
      source,
      name
    });
  };
  SourceMapGenerator.prototype.setSourceContent = function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
    var source = aSourceFile;
    if (this._sourceRoot != null) {
      source = util2.relative(this._sourceRoot, source);
    }
    if (aSourceContent != null) {
      if (!this._sourcesContents) {
        this._sourcesContents = /* @__PURE__ */ Object.create(null);
      }
      this._sourcesContents[util2.toSetString(source)] = aSourceContent;
    } else if (this._sourcesContents) {
      delete this._sourcesContents[util2.toSetString(source)];
      if (Object.keys(this._sourcesContents).length === 0) {
        this._sourcesContents = null;
      }
    }
  };
  SourceMapGenerator.prototype.applySourceMap = function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
    var sourceFile = aSourceFile;
    if (aSourceFile == null) {
      if (aSourceMapConsumer.file == null) {
        throw new Error(
          `SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map's "file" property. Both were omitted.`
        );
      }
      sourceFile = aSourceMapConsumer.file;
    }
    var sourceRoot = this._sourceRoot;
    if (sourceRoot != null) {
      sourceFile = util2.relative(sourceRoot, sourceFile);
    }
    var newSources = new ArraySet();
    var newNames = new ArraySet();
    this._mappings.unsortedForEach(function(mapping) {
      if (mapping.source === sourceFile && mapping.originalLine != null) {
        var original = aSourceMapConsumer.originalPositionFor({
          line: mapping.originalLine,
          column: mapping.originalColumn
        });
        if (original.source != null) {
          mapping.source = original.source;
          if (aSourceMapPath != null) {
            mapping.source = util2.join(aSourceMapPath, mapping.source);
          }
          if (sourceRoot != null) {
            mapping.source = util2.relative(sourceRoot, mapping.source);
          }
          mapping.originalLine = original.line;
          mapping.originalColumn = original.column;
          if (original.name != null) {
            mapping.name = original.name;
          }
        }
      }
      var source = mapping.source;
      if (source != null && !newSources.has(source)) {
        newSources.add(source);
      }
      var name = mapping.name;
      if (name != null && !newNames.has(name)) {
        newNames.add(name);
      }
    }, this);
    this._sources = newSources;
    this._names = newNames;
    aSourceMapConsumer.sources.forEach(function(sourceFile2) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile2);
      if (content != null) {
        if (aSourceMapPath != null) {
          sourceFile2 = util2.join(aSourceMapPath, sourceFile2);
        }
        if (sourceRoot != null) {
          sourceFile2 = util2.relative(sourceRoot, sourceFile2);
        }
        this.setSourceContent(sourceFile2, content);
      }
    }, this);
  };
  SourceMapGenerator.prototype._validateMapping = function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource, aName) {
    if (aOriginal && typeof aOriginal.line !== "number" && typeof aOriginal.column !== "number") {
      var message = "original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values.";
      if (this._ignoreInvalidMapping) {
        if (typeof console !== "undefined" && console.warn) {
          console.warn(message);
        }
        return false;
      } else {
        throw new Error(message);
      }
    }
    if (aGenerated && "line" in aGenerated && "column" in aGenerated && aGenerated.line > 0 && aGenerated.column >= 0 && !aOriginal && !aSource && !aName) {
      return;
    } else if (aGenerated && "line" in aGenerated && "column" in aGenerated && aOriginal && "line" in aOriginal && "column" in aOriginal && aGenerated.line > 0 && aGenerated.column >= 0 && aOriginal.line > 0 && aOriginal.column >= 0 && aSource) {
      return;
    } else {
      var message = "Invalid mapping: " + JSON.stringify({
        generated: aGenerated,
        source: aSource,
        original: aOriginal,
        name: aName
      });
      if (this._ignoreInvalidMapping) {
        if (typeof console !== "undefined" && console.warn) {
          console.warn(message);
        }
        return false;
      } else {
        throw new Error(message);
      }
    }
  };
  SourceMapGenerator.prototype._serializeMappings = function SourceMapGenerator_serializeMappings() {
    var previousGeneratedColumn = 0;
    var previousGeneratedLine = 1;
    var previousOriginalColumn = 0;
    var previousOriginalLine = 0;
    var previousName = 0;
    var previousSource = 0;
    var result2 = "";
    var next;
    var mapping;
    var nameIdx;
    var sourceIdx;
    var mappings = this._mappings.toArray();
    for (var i = 0, len = mappings.length; i < len; i++) {
      mapping = mappings[i];
      next = "";
      if (mapping.generatedLine !== previousGeneratedLine) {
        previousGeneratedColumn = 0;
        while (mapping.generatedLine !== previousGeneratedLine) {
          next += ";";
          previousGeneratedLine++;
        }
      } else {
        if (i > 0) {
          if (!util2.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
            continue;
          }
          next += ",";
        }
      }
      next += base64VLQ.encode(mapping.generatedColumn - previousGeneratedColumn);
      previousGeneratedColumn = mapping.generatedColumn;
      if (mapping.source != null) {
        sourceIdx = this._sources.indexOf(mapping.source);
        next += base64VLQ.encode(sourceIdx - previousSource);
        previousSource = sourceIdx;
        next += base64VLQ.encode(mapping.originalLine - 1 - previousOriginalLine);
        previousOriginalLine = mapping.originalLine - 1;
        next += base64VLQ.encode(mapping.originalColumn - previousOriginalColumn);
        previousOriginalColumn = mapping.originalColumn;
        if (mapping.name != null) {
          nameIdx = this._names.indexOf(mapping.name);
          next += base64VLQ.encode(nameIdx - previousName);
          previousName = nameIdx;
        }
      }
      result2 += next;
    }
    return result2;
  };
  SourceMapGenerator.prototype._generateSourcesContent = function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
    return aSources.map(function(source) {
      if (!this._sourcesContents) {
        return null;
      }
      if (aSourceRoot != null) {
        source = util2.relative(aSourceRoot, source);
      }
      var key2 = util2.toSetString(source);
      return Object.prototype.hasOwnProperty.call(this._sourcesContents, key2) ? this._sourcesContents[key2] : null;
    }, this);
  };
  SourceMapGenerator.prototype.toJSON = function SourceMapGenerator_toJSON() {
    var map = {
      version: this._version,
      sources: this._sources.toArray(),
      names: this._names.toArray(),
      mappings: this._serializeMappings()
    };
    if (this._file != null) {
      map.file = this._file;
    }
    if (this._sourceRoot != null) {
      map.sourceRoot = this._sourceRoot;
    }
    if (this._sourcesContents) {
      map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
    }
    return map;
  };
  SourceMapGenerator.prototype.toString = function SourceMapGenerator_toString() {
    return JSON.stringify(this.toJSON());
  };
  sourceMapGenerator.SourceMapGenerator = SourceMapGenerator;
  return sourceMapGenerator;
}
var sourceMapConsumer = {};
var binarySearch = {};
var hasRequiredBinarySearch;
function requireBinarySearch() {
  if (hasRequiredBinarySearch) return binarySearch;
  hasRequiredBinarySearch = 1;
  (function(exports$1) {
    exports$1.GREATEST_LOWER_BOUND = 1;
    exports$1.LEAST_UPPER_BOUND = 2;
    function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
      var mid = Math.floor((aHigh - aLow) / 2) + aLow;
      var cmp = aCompare(aNeedle, aHaystack[mid], true);
      if (cmp === 0) {
        return mid;
      } else if (cmp > 0) {
        if (aHigh - mid > 1) {
          return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
        }
        if (aBias == exports$1.LEAST_UPPER_BOUND) {
          return aHigh < aHaystack.length ? aHigh : -1;
        } else {
          return mid;
        }
      } else {
        if (mid - aLow > 1) {
          return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
        }
        if (aBias == exports$1.LEAST_UPPER_BOUND) {
          return mid;
        } else {
          return aLow < 0 ? -1 : aLow;
        }
      }
    }
    exports$1.search = function search(aNeedle, aHaystack, aCompare, aBias) {
      if (aHaystack.length === 0) {
        return -1;
      }
      var index = recursiveSearch(
        -1,
        aHaystack.length,
        aNeedle,
        aHaystack,
        aCompare,
        aBias || exports$1.GREATEST_LOWER_BOUND
      );
      if (index < 0) {
        return -1;
      }
      while (index - 1 >= 0) {
        if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
          break;
        }
        --index;
      }
      return index;
    };
  })(binarySearch);
  return binarySearch;
}
var quickSort = {};
var hasRequiredQuickSort;
function requireQuickSort() {
  if (hasRequiredQuickSort) return quickSort;
  hasRequiredQuickSort = 1;
  function SortTemplate(comparator) {
    function swap(ary, x, y) {
      var temp = ary[x];
      ary[x] = ary[y];
      ary[y] = temp;
    }
    function randomIntInRange(low, high) {
      return Math.round(low + Math.random() * (high - low));
    }
    function doQuickSort(ary, comparator2, p, r) {
      if (p < r) {
        var pivotIndex = randomIntInRange(p, r);
        var i = p - 1;
        swap(ary, pivotIndex, r);
        var pivot = ary[r];
        for (var j = p; j < r; j++) {
          if (comparator2(ary[j], pivot, false) <= 0) {
            i += 1;
            swap(ary, i, j);
          }
        }
        swap(ary, i + 1, j);
        var q = i + 1;
        doQuickSort(ary, comparator2, p, q - 1);
        doQuickSort(ary, comparator2, q + 1, r);
      }
    }
    return doQuickSort;
  }
  function cloneSort(comparator) {
    let template = SortTemplate.toString();
    let templateFn = new Function(`return ${template}`)();
    return templateFn(comparator);
  }
  let sortCache = /* @__PURE__ */ new WeakMap();
  quickSort.quickSort = function(ary, comparator, start = 0) {
    let doQuickSort = sortCache.get(comparator);
    if (doQuickSort === void 0) {
      doQuickSort = cloneSort(comparator);
      sortCache.set(comparator, doQuickSort);
    }
    doQuickSort(ary, comparator, start, ary.length - 1);
  };
  return quickSort;
}
var hasRequiredSourceMapConsumer;
function requireSourceMapConsumer() {
  if (hasRequiredSourceMapConsumer) return sourceMapConsumer;
  hasRequiredSourceMapConsumer = 1;
  var util2 = requireUtil();
  var binarySearch2 = requireBinarySearch();
  var ArraySet = requireArraySet().ArraySet;
  var base64VLQ = requireBase64Vlq();
  var quickSort2 = requireQuickSort().quickSort;
  function SourceMapConsumer(aSourceMap, aSourceMapURL) {
    var sourceMap2 = aSourceMap;
    if (typeof aSourceMap === "string") {
      sourceMap2 = util2.parseSourceMapInput(aSourceMap);
    }
    return sourceMap2.sections != null ? new IndexedSourceMapConsumer(sourceMap2, aSourceMapURL) : new BasicSourceMapConsumer(sourceMap2, aSourceMapURL);
  }
  SourceMapConsumer.fromSourceMap = function(aSourceMap, aSourceMapURL) {
    return BasicSourceMapConsumer.fromSourceMap(aSourceMap, aSourceMapURL);
  };
  SourceMapConsumer.prototype._version = 3;
  SourceMapConsumer.prototype.__generatedMappings = null;
  Object.defineProperty(SourceMapConsumer.prototype, "_generatedMappings", {
    configurable: true,
    enumerable: true,
    get: function() {
      if (!this.__generatedMappings) {
        this._parseMappings(this._mappings, this.sourceRoot);
      }
      return this.__generatedMappings;
    }
  });
  SourceMapConsumer.prototype.__originalMappings = null;
  Object.defineProperty(SourceMapConsumer.prototype, "_originalMappings", {
    configurable: true,
    enumerable: true,
    get: function() {
      if (!this.__originalMappings) {
        this._parseMappings(this._mappings, this.sourceRoot);
      }
      return this.__originalMappings;
    }
  });
  SourceMapConsumer.prototype._charIsMappingSeparator = function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
    var c = aStr.charAt(index);
    return c === ";" || c === ",";
  };
  SourceMapConsumer.prototype._parseMappings = function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    throw new Error("Subclasses must implement _parseMappings");
  };
  SourceMapConsumer.GENERATED_ORDER = 1;
  SourceMapConsumer.ORIGINAL_ORDER = 2;
  SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
  SourceMapConsumer.LEAST_UPPER_BOUND = 2;
  SourceMapConsumer.prototype.eachMapping = function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
    var context = aContext || null;
    var order = aOrder || SourceMapConsumer.GENERATED_ORDER;
    var mappings;
    switch (order) {
      case SourceMapConsumer.GENERATED_ORDER:
        mappings = this._generatedMappings;
        break;
      case SourceMapConsumer.ORIGINAL_ORDER:
        mappings = this._originalMappings;
        break;
      default:
        throw new Error("Unknown order of iteration.");
    }
    var sourceRoot = this.sourceRoot;
    var boundCallback = aCallback.bind(context);
    var names = this._names;
    var sources = this._sources;
    var sourceMapURL = this._sourceMapURL;
    for (var i = 0, n = mappings.length; i < n; i++) {
      var mapping = mappings[i];
      var source = mapping.source === null ? null : sources.at(mapping.source);
      if (source !== null) {
        source = util2.computeSourceURL(sourceRoot, source, sourceMapURL);
      }
      boundCallback({
        source,
        generatedLine: mapping.generatedLine,
        generatedColumn: mapping.generatedColumn,
        originalLine: mapping.originalLine,
        originalColumn: mapping.originalColumn,
        name: mapping.name === null ? null : names.at(mapping.name)
      });
    }
  };
  SourceMapConsumer.prototype.allGeneratedPositionsFor = function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
    var line = util2.getArg(aArgs, "line");
    var needle = {
      source: util2.getArg(aArgs, "source"),
      originalLine: line,
      originalColumn: util2.getArg(aArgs, "column", 0)
    };
    needle.source = this._findSourceIndex(needle.source);
    if (needle.source < 0) {
      return [];
    }
    var mappings = [];
    var index = this._findMapping(
      needle,
      this._originalMappings,
      "originalLine",
      "originalColumn",
      util2.compareByOriginalPositions,
      binarySearch2.LEAST_UPPER_BOUND
    );
    if (index >= 0) {
      var mapping = this._originalMappings[index];
      if (aArgs.column === void 0) {
        var originalLine = mapping.originalLine;
        while (mapping && mapping.originalLine === originalLine) {
          mappings.push({
            line: util2.getArg(mapping, "generatedLine", null),
            column: util2.getArg(mapping, "generatedColumn", null),
            lastColumn: util2.getArg(mapping, "lastGeneratedColumn", null)
          });
          mapping = this._originalMappings[++index];
        }
      } else {
        var originalColumn = mapping.originalColumn;
        while (mapping && mapping.originalLine === line && mapping.originalColumn == originalColumn) {
          mappings.push({
            line: util2.getArg(mapping, "generatedLine", null),
            column: util2.getArg(mapping, "generatedColumn", null),
            lastColumn: util2.getArg(mapping, "lastGeneratedColumn", null)
          });
          mapping = this._originalMappings[++index];
        }
      }
    }
    return mappings;
  };
  sourceMapConsumer.SourceMapConsumer = SourceMapConsumer;
  function BasicSourceMapConsumer(aSourceMap, aSourceMapURL) {
    var sourceMap2 = aSourceMap;
    if (typeof aSourceMap === "string") {
      sourceMap2 = util2.parseSourceMapInput(aSourceMap);
    }
    var version = util2.getArg(sourceMap2, "version");
    var sources = util2.getArg(sourceMap2, "sources");
    var names = util2.getArg(sourceMap2, "names", []);
    var sourceRoot = util2.getArg(sourceMap2, "sourceRoot", null);
    var sourcesContent = util2.getArg(sourceMap2, "sourcesContent", null);
    var mappings = util2.getArg(sourceMap2, "mappings");
    var file = util2.getArg(sourceMap2, "file", null);
    if (version != this._version) {
      throw new Error("Unsupported version: " + version);
    }
    if (sourceRoot) {
      sourceRoot = util2.normalize(sourceRoot);
    }
    sources = sources.map(String).map(util2.normalize).map(function(source) {
      return sourceRoot && util2.isAbsolute(sourceRoot) && util2.isAbsolute(source) ? util2.relative(sourceRoot, source) : source;
    });
    this._names = ArraySet.fromArray(names.map(String), true);
    this._sources = ArraySet.fromArray(sources, true);
    this._absoluteSources = this._sources.toArray().map(function(s) {
      return util2.computeSourceURL(sourceRoot, s, aSourceMapURL);
    });
    this.sourceRoot = sourceRoot;
    this.sourcesContent = sourcesContent;
    this._mappings = mappings;
    this._sourceMapURL = aSourceMapURL;
    this.file = file;
  }
  BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
  BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;
  BasicSourceMapConsumer.prototype._findSourceIndex = function(aSource) {
    var relativeSource = aSource;
    if (this.sourceRoot != null) {
      relativeSource = util2.relative(this.sourceRoot, relativeSource);
    }
    if (this._sources.has(relativeSource)) {
      return this._sources.indexOf(relativeSource);
    }
    var i;
    for (i = 0; i < this._absoluteSources.length; ++i) {
      if (this._absoluteSources[i] == aSource) {
        return i;
      }
    }
    return -1;
  };
  BasicSourceMapConsumer.fromSourceMap = function SourceMapConsumer_fromSourceMap(aSourceMap, aSourceMapURL) {
    var smc = Object.create(BasicSourceMapConsumer.prototype);
    var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
    var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
    smc.sourceRoot = aSourceMap._sourceRoot;
    smc.sourcesContent = aSourceMap._generateSourcesContent(
      smc._sources.toArray(),
      smc.sourceRoot
    );
    smc.file = aSourceMap._file;
    smc._sourceMapURL = aSourceMapURL;
    smc._absoluteSources = smc._sources.toArray().map(function(s) {
      return util2.computeSourceURL(smc.sourceRoot, s, aSourceMapURL);
    });
    var generatedMappings = aSourceMap._mappings.toArray().slice();
    var destGeneratedMappings = smc.__generatedMappings = [];
    var destOriginalMappings = smc.__originalMappings = [];
    for (var i = 0, length = generatedMappings.length; i < length; i++) {
      var srcMapping = generatedMappings[i];
      var destMapping = new Mapping();
      destMapping.generatedLine = srcMapping.generatedLine;
      destMapping.generatedColumn = srcMapping.generatedColumn;
      if (srcMapping.source) {
        destMapping.source = sources.indexOf(srcMapping.source);
        destMapping.originalLine = srcMapping.originalLine;
        destMapping.originalColumn = srcMapping.originalColumn;
        if (srcMapping.name) {
          destMapping.name = names.indexOf(srcMapping.name);
        }
        destOriginalMappings.push(destMapping);
      }
      destGeneratedMappings.push(destMapping);
    }
    quickSort2(smc.__originalMappings, util2.compareByOriginalPositions);
    return smc;
  };
  BasicSourceMapConsumer.prototype._version = 3;
  Object.defineProperty(BasicSourceMapConsumer.prototype, "sources", {
    get: function() {
      return this._absoluteSources.slice();
    }
  });
  function Mapping() {
    this.generatedLine = 0;
    this.generatedColumn = 0;
    this.source = null;
    this.originalLine = null;
    this.originalColumn = null;
    this.name = null;
  }
  const compareGenerated = util2.compareByGeneratedPositionsDeflatedNoLine;
  function sortGenerated(array, start) {
    let l = array.length;
    let n = array.length - start;
    if (n <= 1) {
      return;
    } else if (n == 2) {
      let a = array[start];
      let b = array[start + 1];
      if (compareGenerated(a, b) > 0) {
        array[start] = b;
        array[start + 1] = a;
      }
    } else if (n < 20) {
      for (let i = start; i < l; i++) {
        for (let j = i; j > start; j--) {
          let a = array[j - 1];
          let b = array[j];
          if (compareGenerated(a, b) <= 0) {
            break;
          }
          array[j - 1] = b;
          array[j] = a;
        }
      }
    } else {
      quickSort2(array, compareGenerated, start);
    }
  }
  BasicSourceMapConsumer.prototype._parseMappings = function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    var generatedLine = 1;
    var previousGeneratedColumn = 0;
    var previousOriginalLine = 0;
    var previousOriginalColumn = 0;
    var previousSource = 0;
    var previousName = 0;
    var length = aStr.length;
    var index = 0;
    var temp = {};
    var originalMappings = [];
    var generatedMappings = [];
    var mapping, segment, end, value;
    let subarrayStart = 0;
    while (index < length) {
      if (aStr.charAt(index) === ";") {
        generatedLine++;
        index++;
        previousGeneratedColumn = 0;
        sortGenerated(generatedMappings, subarrayStart);
        subarrayStart = generatedMappings.length;
      } else if (aStr.charAt(index) === ",") {
        index++;
      } else {
        mapping = new Mapping();
        mapping.generatedLine = generatedLine;
        for (end = index; end < length; end++) {
          if (this._charIsMappingSeparator(aStr, end)) {
            break;
          }
        }
        aStr.slice(index, end);
        segment = [];
        while (index < end) {
          base64VLQ.decode(aStr, index, temp);
          value = temp.value;
          index = temp.rest;
          segment.push(value);
        }
        if (segment.length === 2) {
          throw new Error("Found a source, but no line and column");
        }
        if (segment.length === 3) {
          throw new Error("Found a source and line, but no column");
        }
        mapping.generatedColumn = previousGeneratedColumn + segment[0];
        previousGeneratedColumn = mapping.generatedColumn;
        if (segment.length > 1) {
          mapping.source = previousSource + segment[1];
          previousSource += segment[1];
          mapping.originalLine = previousOriginalLine + segment[2];
          previousOriginalLine = mapping.originalLine;
          mapping.originalLine += 1;
          mapping.originalColumn = previousOriginalColumn + segment[3];
          previousOriginalColumn = mapping.originalColumn;
          if (segment.length > 4) {
            mapping.name = previousName + segment[4];
            previousName += segment[4];
          }
        }
        generatedMappings.push(mapping);
        if (typeof mapping.originalLine === "number") {
          let currentSource = mapping.source;
          while (originalMappings.length <= currentSource) {
            originalMappings.push(null);
          }
          if (originalMappings[currentSource] === null) {
            originalMappings[currentSource] = [];
          }
          originalMappings[currentSource].push(mapping);
        }
      }
    }
    sortGenerated(generatedMappings, subarrayStart);
    this.__generatedMappings = generatedMappings;
    for (var i = 0; i < originalMappings.length; i++) {
      if (originalMappings[i] != null) {
        quickSort2(originalMappings[i], util2.compareByOriginalPositionsNoSource);
      }
    }
    this.__originalMappings = [].concat(...originalMappings);
  };
  BasicSourceMapConsumer.prototype._findMapping = function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName, aColumnName, aComparator, aBias) {
    if (aNeedle[aLineName] <= 0) {
      throw new TypeError("Line must be greater than or equal to 1, got " + aNeedle[aLineName]);
    }
    if (aNeedle[aColumnName] < 0) {
      throw new TypeError("Column must be greater than or equal to 0, got " + aNeedle[aColumnName]);
    }
    return binarySearch2.search(aNeedle, aMappings, aComparator, aBias);
  };
  BasicSourceMapConsumer.prototype.computeColumnSpans = function SourceMapConsumer_computeColumnSpans() {
    for (var index = 0; index < this._generatedMappings.length; ++index) {
      var mapping = this._generatedMappings[index];
      if (index + 1 < this._generatedMappings.length) {
        var nextMapping = this._generatedMappings[index + 1];
        if (mapping.generatedLine === nextMapping.generatedLine) {
          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
          continue;
        }
      }
      mapping.lastGeneratedColumn = Infinity;
    }
  };
  BasicSourceMapConsumer.prototype.originalPositionFor = function SourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util2.getArg(aArgs, "line"),
      generatedColumn: util2.getArg(aArgs, "column")
    };
    var index = this._findMapping(
      needle,
      this._generatedMappings,
      "generatedLine",
      "generatedColumn",
      util2.compareByGeneratedPositionsDeflated,
      util2.getArg(aArgs, "bias", SourceMapConsumer.GREATEST_LOWER_BOUND)
    );
    if (index >= 0) {
      var mapping = this._generatedMappings[index];
      if (mapping.generatedLine === needle.generatedLine) {
        var source = util2.getArg(mapping, "source", null);
        if (source !== null) {
          source = this._sources.at(source);
          source = util2.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
        }
        var name = util2.getArg(mapping, "name", null);
        if (name !== null) {
          name = this._names.at(name);
        }
        return {
          source,
          line: util2.getArg(mapping, "originalLine", null),
          column: util2.getArg(mapping, "originalColumn", null),
          name
        };
      }
    }
    return {
      source: null,
      line: null,
      column: null,
      name: null
    };
  };
  BasicSourceMapConsumer.prototype.hasContentsOfAllSources = function BasicSourceMapConsumer_hasContentsOfAllSources() {
    if (!this.sourcesContent) {
      return false;
    }
    return this.sourcesContent.length >= this._sources.size() && !this.sourcesContent.some(function(sc) {
      return sc == null;
    });
  };
  BasicSourceMapConsumer.prototype.sourceContentFor = function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    if (!this.sourcesContent) {
      return null;
    }
    var index = this._findSourceIndex(aSource);
    if (index >= 0) {
      return this.sourcesContent[index];
    }
    var relativeSource = aSource;
    if (this.sourceRoot != null) {
      relativeSource = util2.relative(this.sourceRoot, relativeSource);
    }
    var url;
    if (this.sourceRoot != null && (url = util2.urlParse(this.sourceRoot))) {
      var fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
      if (url.scheme == "file" && this._sources.has(fileUriAbsPath)) {
        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)];
      }
      if ((!url.path || url.path == "/") && this._sources.has("/" + relativeSource)) {
        return this.sourcesContent[this._sources.indexOf("/" + relativeSource)];
      }
    }
    if (nullOnMissing) {
      return null;
    } else {
      throw new Error('"' + relativeSource + '" is not in the SourceMap.');
    }
  };
  BasicSourceMapConsumer.prototype.generatedPositionFor = function SourceMapConsumer_generatedPositionFor(aArgs) {
    var source = util2.getArg(aArgs, "source");
    source = this._findSourceIndex(source);
    if (source < 0) {
      return {
        line: null,
        column: null,
        lastColumn: null
      };
    }
    var needle = {
      source,
      originalLine: util2.getArg(aArgs, "line"),
      originalColumn: util2.getArg(aArgs, "column")
    };
    var index = this._findMapping(
      needle,
      this._originalMappings,
      "originalLine",
      "originalColumn",
      util2.compareByOriginalPositions,
      util2.getArg(aArgs, "bias", SourceMapConsumer.GREATEST_LOWER_BOUND)
    );
    if (index >= 0) {
      var mapping = this._originalMappings[index];
      if (mapping.source === needle.source) {
        return {
          line: util2.getArg(mapping, "generatedLine", null),
          column: util2.getArg(mapping, "generatedColumn", null),
          lastColumn: util2.getArg(mapping, "lastGeneratedColumn", null)
        };
      }
    }
    return {
      line: null,
      column: null,
      lastColumn: null
    };
  };
  sourceMapConsumer.BasicSourceMapConsumer = BasicSourceMapConsumer;
  function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
    var sourceMap2 = aSourceMap;
    if (typeof aSourceMap === "string") {
      sourceMap2 = util2.parseSourceMapInput(aSourceMap);
    }
    var version = util2.getArg(sourceMap2, "version");
    var sections = util2.getArg(sourceMap2, "sections");
    if (version != this._version) {
      throw new Error("Unsupported version: " + version);
    }
    this._sources = new ArraySet();
    this._names = new ArraySet();
    var lastOffset = {
      line: -1,
      column: 0
    };
    this._sections = sections.map(function(s) {
      if (s.url) {
        throw new Error("Support for url field in sections not implemented.");
      }
      var offset = util2.getArg(s, "offset");
      var offsetLine = util2.getArg(offset, "line");
      var offsetColumn = util2.getArg(offset, "column");
      if (offsetLine < lastOffset.line || offsetLine === lastOffset.line && offsetColumn < lastOffset.column) {
        throw new Error("Section offsets must be ordered and non-overlapping.");
      }
      lastOffset = offset;
      return {
        generatedOffset: {
          // The offset fields are 0-based, but we use 1-based indices when
          // encoding/decoding from VLQ.
          generatedLine: offsetLine + 1,
          generatedColumn: offsetColumn + 1
        },
        consumer: new SourceMapConsumer(util2.getArg(s, "map"), aSourceMapURL)
      };
    });
  }
  IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
  IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;
  IndexedSourceMapConsumer.prototype._version = 3;
  Object.defineProperty(IndexedSourceMapConsumer.prototype, "sources", {
    get: function() {
      var sources = [];
      for (var i = 0; i < this._sections.length; i++) {
        for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
          sources.push(this._sections[i].consumer.sources[j]);
        }
      }
      return sources;
    }
  });
  IndexedSourceMapConsumer.prototype.originalPositionFor = function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util2.getArg(aArgs, "line"),
      generatedColumn: util2.getArg(aArgs, "column")
    };
    var sectionIndex = binarySearch2.search(
      needle,
      this._sections,
      function(needle2, section2) {
        var cmp = needle2.generatedLine - section2.generatedOffset.generatedLine;
        if (cmp) {
          return cmp;
        }
        return needle2.generatedColumn - section2.generatedOffset.generatedColumn;
      }
    );
    var section = this._sections[sectionIndex];
    if (!section) {
      return {
        source: null,
        line: null,
        column: null,
        name: null
      };
    }
    return section.consumer.originalPositionFor({
      line: needle.generatedLine - (section.generatedOffset.generatedLine - 1),
      column: needle.generatedColumn - (section.generatedOffset.generatedLine === needle.generatedLine ? section.generatedOffset.generatedColumn - 1 : 0),
      bias: aArgs.bias
    });
  };
  IndexedSourceMapConsumer.prototype.hasContentsOfAllSources = function IndexedSourceMapConsumer_hasContentsOfAllSources() {
    return this._sections.every(function(s) {
      return s.consumer.hasContentsOfAllSources();
    });
  };
  IndexedSourceMapConsumer.prototype.sourceContentFor = function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];
      var content = section.consumer.sourceContentFor(aSource, true);
      if (content || content === "") {
        return content;
      }
    }
    if (nullOnMissing) {
      return null;
    } else {
      throw new Error('"' + aSource + '" is not in the SourceMap.');
    }
  };
  IndexedSourceMapConsumer.prototype.generatedPositionFor = function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];
      if (section.consumer._findSourceIndex(util2.getArg(aArgs, "source")) === -1) {
        continue;
      }
      var generatedPosition = section.consumer.generatedPositionFor(aArgs);
      if (generatedPosition) {
        var ret = {
          line: generatedPosition.line + (section.generatedOffset.generatedLine - 1),
          column: generatedPosition.column + (section.generatedOffset.generatedLine === generatedPosition.line ? section.generatedOffset.generatedColumn - 1 : 0)
        };
        return ret;
      }
    }
    return {
      line: null,
      column: null
    };
  };
  IndexedSourceMapConsumer.prototype._parseMappings = function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    this.__generatedMappings = [];
    this.__originalMappings = [];
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];
      var sectionMappings = section.consumer._generatedMappings;
      for (var j = 0; j < sectionMappings.length; j++) {
        var mapping = sectionMappings[j];
        var source = section.consumer._sources.at(mapping.source);
        if (source !== null) {
          source = util2.computeSourceURL(section.consumer.sourceRoot, source, this._sourceMapURL);
        }
        this._sources.add(source);
        source = this._sources.indexOf(source);
        var name = null;
        if (mapping.name) {
          name = section.consumer._names.at(mapping.name);
          this._names.add(name);
          name = this._names.indexOf(name);
        }
        var adjustedMapping = {
          source,
          generatedLine: mapping.generatedLine + (section.generatedOffset.generatedLine - 1),
          generatedColumn: mapping.generatedColumn + (section.generatedOffset.generatedLine === mapping.generatedLine ? section.generatedOffset.generatedColumn - 1 : 0),
          originalLine: mapping.originalLine,
          originalColumn: mapping.originalColumn,
          name
        };
        this.__generatedMappings.push(adjustedMapping);
        if (typeof adjustedMapping.originalLine === "number") {
          this.__originalMappings.push(adjustedMapping);
        }
      }
    }
    quickSort2(this.__generatedMappings, util2.compareByGeneratedPositionsDeflated);
    quickSort2(this.__originalMappings, util2.compareByOriginalPositions);
  };
  sourceMapConsumer.IndexedSourceMapConsumer = IndexedSourceMapConsumer;
  return sourceMapConsumer;
}
var sourceNode = {};
var hasRequiredSourceNode;
function requireSourceNode() {
  if (hasRequiredSourceNode) return sourceNode;
  hasRequiredSourceNode = 1;
  var SourceMapGenerator = requireSourceMapGenerator().SourceMapGenerator;
  var util2 = requireUtil();
  var REGEX_NEWLINE = /(\r?\n)/;
  var NEWLINE_CODE = 10;
  var isSourceNode = "$$$isSourceNode$$$";
  function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
    this.children = [];
    this.sourceContents = {};
    this.line = aLine == null ? null : aLine;
    this.column = aColumn == null ? null : aColumn;
    this.source = aSource == null ? null : aSource;
    this.name = aName == null ? null : aName;
    this[isSourceNode] = true;
    if (aChunks != null) this.add(aChunks);
  }
  SourceNode.fromStringWithSourceMap = function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
    var node2 = new SourceNode();
    var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
    var remainingLinesIndex = 0;
    var shiftNextLine = function() {
      var lineContents = getNextLine();
      var newLine = getNextLine() || "";
      return lineContents + newLine;
      function getNextLine() {
        return remainingLinesIndex < remainingLines.length ? remainingLines[remainingLinesIndex++] : void 0;
      }
    };
    var lastGeneratedLine = 1, lastGeneratedColumn = 0;
    var lastMapping = null;
    aSourceMapConsumer.eachMapping(function(mapping) {
      if (lastMapping !== null) {
        if (lastGeneratedLine < mapping.generatedLine) {
          addMappingWithCode(lastMapping, shiftNextLine());
          lastGeneratedLine++;
          lastGeneratedColumn = 0;
        } else {
          var nextLine = remainingLines[remainingLinesIndex] || "";
          var code = nextLine.substr(0, mapping.generatedColumn - lastGeneratedColumn);
          remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn - lastGeneratedColumn);
          lastGeneratedColumn = mapping.generatedColumn;
          addMappingWithCode(lastMapping, code);
          lastMapping = mapping;
          return;
        }
      }
      while (lastGeneratedLine < mapping.generatedLine) {
        node2.add(shiftNextLine());
        lastGeneratedLine++;
      }
      if (lastGeneratedColumn < mapping.generatedColumn) {
        var nextLine = remainingLines[remainingLinesIndex] || "";
        node2.add(nextLine.substr(0, mapping.generatedColumn));
        remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn);
        lastGeneratedColumn = mapping.generatedColumn;
      }
      lastMapping = mapping;
    }, this);
    if (remainingLinesIndex < remainingLines.length) {
      if (lastMapping) {
        addMappingWithCode(lastMapping, shiftNextLine());
      }
      node2.add(remainingLines.splice(remainingLinesIndex).join(""));
    }
    aSourceMapConsumer.sources.forEach(function(sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        if (aRelativePath != null) {
          sourceFile = util2.join(aRelativePath, sourceFile);
        }
        node2.setSourceContent(sourceFile, content);
      }
    });
    return node2;
    function addMappingWithCode(mapping, code) {
      if (mapping === null || mapping.source === void 0) {
        node2.add(code);
      } else {
        var source = aRelativePath ? util2.join(aRelativePath, mapping.source) : mapping.source;
        node2.add(new SourceNode(
          mapping.originalLine,
          mapping.originalColumn,
          source,
          code,
          mapping.name
        ));
      }
    }
  };
  SourceNode.prototype.add = function SourceNode_add(aChunk) {
    if (Array.isArray(aChunk)) {
      aChunk.forEach(function(chunk) {
        this.add(chunk);
      }, this);
    } else if (aChunk[isSourceNode] || typeof aChunk === "string") {
      if (aChunk) {
        this.children.push(aChunk);
      }
    } else {
      throw new TypeError(
        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
      );
    }
    return this;
  };
  SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
    if (Array.isArray(aChunk)) {
      for (var i = aChunk.length - 1; i >= 0; i--) {
        this.prepend(aChunk[i]);
      }
    } else if (aChunk[isSourceNode] || typeof aChunk === "string") {
      this.children.unshift(aChunk);
    } else {
      throw new TypeError(
        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
      );
    }
    return this;
  };
  SourceNode.prototype.walk = function SourceNode_walk(aFn) {
    var chunk;
    for (var i = 0, len = this.children.length; i < len; i++) {
      chunk = this.children[i];
      if (chunk[isSourceNode]) {
        chunk.walk(aFn);
      } else {
        if (chunk !== "") {
          aFn(chunk, {
            source: this.source,
            line: this.line,
            column: this.column,
            name: this.name
          });
        }
      }
    }
  };
  SourceNode.prototype.join = function SourceNode_join(aSep) {
    var newChildren;
    var i;
    var len = this.children.length;
    if (len > 0) {
      newChildren = [];
      for (i = 0; i < len - 1; i++) {
        newChildren.push(this.children[i]);
        newChildren.push(aSep);
      }
      newChildren.push(this.children[i]);
      this.children = newChildren;
    }
    return this;
  };
  SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
    var lastChild = this.children[this.children.length - 1];
    if (lastChild[isSourceNode]) {
      lastChild.replaceRight(aPattern, aReplacement);
    } else if (typeof lastChild === "string") {
      this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
    } else {
      this.children.push("".replace(aPattern, aReplacement));
    }
    return this;
  };
  SourceNode.prototype.setSourceContent = function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
    this.sourceContents[util2.toSetString(aSourceFile)] = aSourceContent;
  };
  SourceNode.prototype.walkSourceContents = function SourceNode_walkSourceContents(aFn) {
    for (var i = 0, len = this.children.length; i < len; i++) {
      if (this.children[i][isSourceNode]) {
        this.children[i].walkSourceContents(aFn);
      }
    }
    var sources = Object.keys(this.sourceContents);
    for (var i = 0, len = sources.length; i < len; i++) {
      aFn(util2.fromSetString(sources[i]), this.sourceContents[sources[i]]);
    }
  };
  SourceNode.prototype.toString = function SourceNode_toString() {
    var str = "";
    this.walk(function(chunk) {
      str += chunk;
    });
    return str;
  };
  SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
    var generated = {
      code: "",
      line: 1,
      column: 0
    };
    var map = new SourceMapGenerator(aArgs);
    var sourceMappingActive = false;
    var lastOriginalSource = null;
    var lastOriginalLine = null;
    var lastOriginalColumn = null;
    var lastOriginalName = null;
    this.walk(function(chunk, original) {
      generated.code += chunk;
      if (original.source !== null && original.line !== null && original.column !== null) {
        if (lastOriginalSource !== original.source || lastOriginalLine !== original.line || lastOriginalColumn !== original.column || lastOriginalName !== original.name) {
          map.addMapping({
            source: original.source,
            original: {
              line: original.line,
              column: original.column
            },
            generated: {
              line: generated.line,
              column: generated.column
            },
            name: original.name
          });
        }
        lastOriginalSource = original.source;
        lastOriginalLine = original.line;
        lastOriginalColumn = original.column;
        lastOriginalName = original.name;
        sourceMappingActive = true;
      } else if (sourceMappingActive) {
        map.addMapping({
          generated: {
            line: generated.line,
            column: generated.column
          }
        });
        lastOriginalSource = null;
        sourceMappingActive = false;
      }
      for (var idx = 0, length = chunk.length; idx < length; idx++) {
        if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
          generated.line++;
          generated.column = 0;
          if (idx + 1 === length) {
            lastOriginalSource = null;
            sourceMappingActive = false;
          } else if (sourceMappingActive) {
            map.addMapping({
              source: original.source,
              original: {
                line: original.line,
                column: original.column
              },
              generated: {
                line: generated.line,
                column: generated.column
              },
              name: original.name
            });
          }
        } else {
          generated.column++;
        }
      }
    });
    this.walkSourceContents(function(sourceFile, sourceContent) {
      map.setSourceContent(sourceFile, sourceContent);
    });
    return { code: generated.code, map };
  };
  sourceNode.SourceNode = SourceNode;
  return sourceNode;
}
var hasRequiredSourceMap;
function requireSourceMap() {
  if (hasRequiredSourceMap) return sourceMap;
  hasRequiredSourceMap = 1;
  sourceMap.SourceMapGenerator = requireSourceMapGenerator().SourceMapGenerator;
  sourceMap.SourceMapConsumer = requireSourceMapConsumer().SourceMapConsumer;
  sourceMap.SourceNode = requireSourceNode().SourceNode;
  return sourceMap;
}
var previousMap;
var hasRequiredPreviousMap;
function requirePreviousMap() {
  if (hasRequiredPreviousMap) return previousMap;
  hasRequiredPreviousMap = 1;
  let { existsSync, readFileSync } = require$$0;
  let { dirname, join } = require$$1;
  let { SourceMapConsumer, SourceMapGenerator } = requireSourceMap();
  function fromBase64(str) {
    if (Buffer) {
      return Buffer.from(str, "base64").toString();
    } else {
      return window.atob(str);
    }
  }
  class PreviousMap {
    constructor(css, opts) {
      if (opts.map === false) return;
      this.loadAnnotation(css);
      this.inline = this.startWith(this.annotation, "data:");
      let prev = opts.map ? opts.map.prev : void 0;
      let text = this.loadMap(opts.from, prev);
      if (!this.mapFile && opts.from) {
        this.mapFile = opts.from;
      }
      if (this.mapFile) this.root = dirname(this.mapFile);
      if (text) this.text = text;
    }
    consumer() {
      if (!this.consumerCache) {
        this.consumerCache = new SourceMapConsumer(this.text);
      }
      return this.consumerCache;
    }
    decodeInline(text) {
      let baseCharsetUri = /^data:application\/json;charset=utf-?8;base64,/;
      let baseUri = /^data:application\/json;base64,/;
      let charsetUri = /^data:application\/json;charset=utf-?8,/;
      let uri = /^data:application\/json,/;
      let uriMatch = text.match(charsetUri) || text.match(uri);
      if (uriMatch) {
        return decodeURIComponent(text.substr(uriMatch[0].length));
      }
      let baseUriMatch = text.match(baseCharsetUri) || text.match(baseUri);
      if (baseUriMatch) {
        return fromBase64(text.substr(baseUriMatch[0].length));
      }
      let encoding = text.match(/data:application\/json;([^,]+),/)[1];
      throw new Error("Unsupported source map encoding " + encoding);
    }
    getAnnotationURL(sourceMapString) {
      return sourceMapString.replace(/^\/\*\s*# sourceMappingURL=/, "").trim();
    }
    isMap(map) {
      if (typeof map !== "object") return false;
      return typeof map.mappings === "string" || typeof map._mappings === "string" || Array.isArray(map.sections);
    }
    loadAnnotation(css) {
      let comments = css.match(/\/\*\s*# sourceMappingURL=/g);
      if (!comments) return;
      let start = css.lastIndexOf(comments.pop());
      let end = css.indexOf("*/", start);
      if (start > -1 && end > -1) {
        this.annotation = this.getAnnotationURL(css.substring(start, end));
      }
    }
    loadFile(path) {
      this.root = dirname(path);
      if (existsSync(path)) {
        this.mapFile = path;
        return readFileSync(path, "utf-8").toString().trim();
      }
    }
    loadMap(file, prev) {
      if (prev === false) return false;
      if (prev) {
        if (typeof prev === "string") {
          return prev;
        } else if (typeof prev === "function") {
          let prevPath = prev(file);
          if (prevPath) {
            let map = this.loadFile(prevPath);
            if (!map) {
              throw new Error(
                "Unable to load previous source map: " + prevPath.toString()
              );
            }
            return map;
          }
        } else if (prev instanceof SourceMapConsumer) {
          return SourceMapGenerator.fromSourceMap(prev).toString();
        } else if (prev instanceof SourceMapGenerator) {
          return prev.toString();
        } else if (this.isMap(prev)) {
          return JSON.stringify(prev);
        } else {
          throw new Error(
            "Unsupported previous source map format: " + prev.toString()
          );
        }
      } else if (this.inline) {
        return this.decodeInline(this.annotation);
      } else if (this.annotation) {
        let map = this.annotation;
        if (file) map = join(dirname(file), map);
        return this.loadFile(map);
      }
    }
    startWith(string, start) {
      if (!string) return false;
      return string.substr(0, start.length) === start;
    }
    withContent() {
      return !!(this.consumer().sourcesContent && this.consumer().sourcesContent.length > 0);
    }
  }
  previousMap = PreviousMap;
  PreviousMap.default = PreviousMap;
  return previousMap;
}
var input;
var hasRequiredInput;
function requireInput() {
  if (hasRequiredInput) return input;
  hasRequiredInput = 1;
  let { nanoid } = /* @__PURE__ */ requireNonSecure();
  let { isAbsolute, resolve } = require$$1;
  let { SourceMapConsumer, SourceMapGenerator } = requireSourceMap();
  let { fileURLToPath, pathToFileURL } = require$$3;
  let CssSyntaxError = requireCssSyntaxError();
  let PreviousMap = requirePreviousMap();
  let terminalHighlight = requireTerminalHighlight();
  let lineToIndexCache = /* @__PURE__ */ Symbol("lineToIndexCache");
  let sourceMapAvailable = Boolean(SourceMapConsumer && SourceMapGenerator);
  let pathAvailable = Boolean(resolve && isAbsolute);
  function getLineToIndex(input2) {
    if (input2[lineToIndexCache]) return input2[lineToIndexCache];
    let lines = input2.css.split("\n");
    let lineToIndex = new Array(lines.length);
    let prevIndex = 0;
    for (let i = 0, l = lines.length; i < l; i++) {
      lineToIndex[i] = prevIndex;
      prevIndex += lines[i].length + 1;
    }
    input2[lineToIndexCache] = lineToIndex;
    return lineToIndex;
  }
  class Input {
    get from() {
      return this.file || this.id;
    }
    constructor(css, opts = {}) {
      if (css === null || typeof css === "undefined" || typeof css === "object" && !css.toString) {
        throw new Error(`PostCSS received ${css} instead of CSS string`);
      }
      this.css = css.toString();
      if (this.css[0] === "\uFEFF" || this.css[0] === "￾") {
        this.hasBOM = true;
        this.css = this.css.slice(1);
      } else {
        this.hasBOM = false;
      }
      this.document = this.css;
      if (opts.document) this.document = opts.document.toString();
      if (opts.from) {
        if (!pathAvailable || /^\w+:\/\//.test(opts.from) || isAbsolute(opts.from)) {
          this.file = opts.from;
        } else {
          this.file = resolve(opts.from);
        }
      }
      if (pathAvailable && sourceMapAvailable) {
        let map = new PreviousMap(this.css, opts);
        if (map.text) {
          this.map = map;
          let file = map.consumer().file;
          if (!this.file && file) this.file = this.mapResolve(file);
        }
      }
      if (!this.file) {
        this.id = "<input css " + nanoid(6) + ">";
      }
      if (this.map) this.map.file = this.from;
    }
    error(message, line, column, opts = {}) {
      let endColumn, endLine, endOffset, offset, result2;
      if (line && typeof line === "object") {
        let start = line;
        let end = column;
        if (typeof start.offset === "number") {
          offset = start.offset;
          let pos = this.fromOffset(offset);
          line = pos.line;
          column = pos.col;
        } else {
          line = start.line;
          column = start.column;
          offset = this.fromLineAndColumn(line, column);
        }
        if (typeof end.offset === "number") {
          endOffset = end.offset;
          let pos = this.fromOffset(endOffset);
          endLine = pos.line;
          endColumn = pos.col;
        } else {
          endLine = end.line;
          endColumn = end.column;
          endOffset = this.fromLineAndColumn(end.line, end.column);
        }
      } else if (!column) {
        offset = line;
        let pos = this.fromOffset(offset);
        line = pos.line;
        column = pos.col;
      } else {
        offset = this.fromLineAndColumn(line, column);
      }
      let origin = this.origin(line, column, endLine, endColumn);
      if (origin) {
        result2 = new CssSyntaxError(
          message,
          origin.endLine === void 0 ? origin.line : { column: origin.column, line: origin.line },
          origin.endLine === void 0 ? origin.column : { column: origin.endColumn, line: origin.endLine },
          origin.source,
          origin.file,
          opts.plugin
        );
      } else {
        result2 = new CssSyntaxError(
          message,
          endLine === void 0 ? line : { column, line },
          endLine === void 0 ? column : { column: endColumn, line: endLine },
          this.css,
          this.file,
          opts.plugin
        );
      }
      result2.input = { column, endColumn, endLine, endOffset, line, offset, source: this.css };
      if (this.file) {
        if (pathToFileURL) {
          result2.input.url = pathToFileURL(this.file).toString();
        }
        result2.input.file = this.file;
      }
      return result2;
    }
    fromLineAndColumn(line, column) {
      let lineToIndex = getLineToIndex(this);
      let index = lineToIndex[line - 1];
      return index + column - 1;
    }
    fromOffset(offset) {
      let lineToIndex = getLineToIndex(this);
      let lastLine = lineToIndex[lineToIndex.length - 1];
      let min = 0;
      if (offset >= lastLine) {
        min = lineToIndex.length - 1;
      } else {
        let max = lineToIndex.length - 2;
        let mid;
        while (min < max) {
          mid = min + (max - min >> 1);
          if (offset < lineToIndex[mid]) {
            max = mid - 1;
          } else if (offset >= lineToIndex[mid + 1]) {
            min = mid + 1;
          } else {
            min = mid;
            break;
          }
        }
      }
      return {
        col: offset - lineToIndex[min] + 1,
        line: min + 1
      };
    }
    mapResolve(file) {
      if (/^\w+:\/\//.test(file)) {
        return file;
      }
      return resolve(this.map.consumer().sourceRoot || this.map.root || ".", file);
    }
    origin(line, column, endLine, endColumn) {
      if (!this.map) return false;
      let consumer = this.map.consumer();
      let from = consumer.originalPositionFor({ column, line });
      if (!from.source) return false;
      let to;
      if (typeof endLine === "number") {
        to = consumer.originalPositionFor({ column: endColumn, line: endLine });
      }
      let fromUrl;
      if (isAbsolute(from.source)) {
        fromUrl = pathToFileURL(from.source);
      } else {
        fromUrl = new URL(
          from.source,
          this.map.consumer().sourceRoot || pathToFileURL(this.map.mapFile)
        );
      }
      let result2 = {
        column: from.column,
        endColumn: to && to.column,
        endLine: to && to.line,
        line: from.line,
        url: fromUrl.toString()
      };
      if (fromUrl.protocol === "file:") {
        if (fileURLToPath) {
          result2.file = fileURLToPath(fromUrl);
        } else {
          throw new Error(`file: protocol is not available in this PostCSS build`);
        }
      }
      let source = consumer.sourceContentFor(from.source);
      if (source) result2.source = source;
      return result2;
    }
    toJSON() {
      let json = {};
      for (let name of ["hasBOM", "css", "file", "id"]) {
        if (this[name] != null) {
          json[name] = this[name];
        }
      }
      if (this.map) {
        json.map = { ...this.map };
        if (json.map.consumerCache) {
          json.map.consumerCache = void 0;
        }
      }
      return json;
    }
  }
  input = Input;
  Input.default = Input;
  if (terminalHighlight && terminalHighlight.registerInput) {
    terminalHighlight.registerInput(Input);
  }
  return input;
}
var root;
var hasRequiredRoot;
function requireRoot() {
  if (hasRequiredRoot) return root;
  hasRequiredRoot = 1;
  let Container = requireContainer();
  let LazyResult, Processor;
  class Root extends Container {
    constructor(defaults) {
      super(defaults);
      this.type = "root";
      if (!this.nodes) this.nodes = [];
    }
    normalize(child, sample, type) {
      let nodes = super.normalize(child);
      if (sample) {
        if (type === "prepend") {
          if (this.nodes.length > 1) {
            sample.raws.before = this.nodes[1].raws.before;
          } else {
            delete sample.raws.before;
          }
        } else if (this.first !== sample) {
          for (let node2 of nodes) {
            node2.raws.before = sample.raws.before;
          }
        }
      }
      return nodes;
    }
    removeChild(child, ignore) {
      let index = this.index(child);
      if (!ignore && index === 0 && this.nodes.length > 1) {
        this.nodes[1].raws.before = this.nodes[index].raws.before;
      }
      return super.removeChild(child);
    }
    toResult(opts = {}) {
      let lazy = new LazyResult(new Processor(), this, opts);
      return lazy.stringify();
    }
  }
  Root.registerLazyResult = (dependant) => {
    LazyResult = dependant;
  };
  Root.registerProcessor = (dependant) => {
    Processor = dependant;
  };
  root = Root;
  Root.default = Root;
  Container.registerRoot(Root);
  return root;
}
var list_1;
var hasRequiredList;
function requireList() {
  if (hasRequiredList) return list_1;
  hasRequiredList = 1;
  let list = {
    comma(string) {
      return list.split(string, [","], true);
    },
    space(string) {
      let spaces = [" ", "\n", "	"];
      return list.split(string, spaces);
    },
    split(string, separators, last) {
      let array = [];
      let current = "";
      let split = false;
      let func = 0;
      let inQuote = false;
      let prevQuote = "";
      let escape = false;
      for (let letter of string) {
        if (escape) {
          escape = false;
        } else if (letter === "\\") {
          escape = true;
        } else if (inQuote) {
          if (letter === prevQuote) {
            inQuote = false;
          }
        } else if (letter === '"' || letter === "'") {
          inQuote = true;
          prevQuote = letter;
        } else if (letter === "(") {
          func += 1;
        } else if (letter === ")") {
          if (func > 0) func -= 1;
        } else if (func === 0) {
          if (separators.includes(letter)) split = true;
        }
        if (split) {
          if (current !== "") array.push(current.trim());
          current = "";
          split = false;
        } else {
          current += letter;
        }
      }
      if (last || current !== "") array.push(current.trim());
      return array;
    }
  };
  list_1 = list;
  list.default = list;
  return list_1;
}
var rule;
var hasRequiredRule;
function requireRule() {
  if (hasRequiredRule) return rule;
  hasRequiredRule = 1;
  let Container = requireContainer();
  let list = requireList();
  class Rule extends Container {
    get selectors() {
      return list.comma(this.selector);
    }
    set selectors(values) {
      let match = this.selector ? this.selector.match(/,\s*/) : null;
      let sep = match ? match[0] : "," + this.raw("between", "beforeOpen");
      this.selector = values.join(sep);
    }
    constructor(defaults) {
      super(defaults);
      this.type = "rule";
      if (!this.nodes) this.nodes = [];
    }
  }
  rule = Rule;
  Rule.default = Rule;
  Container.registerRule(Rule);
  return rule;
}
var fromJSON_1;
var hasRequiredFromJSON;
function requireFromJSON() {
  if (hasRequiredFromJSON) return fromJSON_1;
  hasRequiredFromJSON = 1;
  let AtRule = requireAtRule();
  let Comment = requireComment();
  let Declaration = requireDeclaration();
  let Input = requireInput();
  let PreviousMap = requirePreviousMap();
  let Root = requireRoot();
  let Rule = requireRule();
  function fromJSON(json, inputs) {
    if (Array.isArray(json)) return json.map((n) => fromJSON(n));
    let { inputs: ownInputs, ...defaults } = json;
    if (ownInputs) {
      inputs = [];
      for (let input2 of ownInputs) {
        let inputHydrated = { ...input2, __proto__: Input.prototype };
        if (inputHydrated.map) {
          inputHydrated.map = {
            ...inputHydrated.map,
            __proto__: PreviousMap.prototype
          };
        }
        inputs.push(inputHydrated);
      }
    }
    if (defaults.nodes) {
      defaults.nodes = json.nodes.map((n) => fromJSON(n, inputs));
    }
    if (defaults.source) {
      let { inputId, ...source } = defaults.source;
      defaults.source = source;
      if (inputId != null) {
        defaults.source.input = inputs[inputId];
      }
    }
    if (defaults.type === "root") {
      return new Root(defaults);
    } else if (defaults.type === "decl") {
      return new Declaration(defaults);
    } else if (defaults.type === "rule") {
      return new Rule(defaults);
    } else if (defaults.type === "comment") {
      return new Comment(defaults);
    } else if (defaults.type === "atrule") {
      return new AtRule(defaults);
    } else {
      throw new Error("Unknown node type: " + json.type);
    }
  }
  fromJSON_1 = fromJSON;
  fromJSON.default = fromJSON;
  return fromJSON_1;
}
var mapGenerator;
var hasRequiredMapGenerator;
function requireMapGenerator() {
  if (hasRequiredMapGenerator) return mapGenerator;
  hasRequiredMapGenerator = 1;
  let { dirname, relative, resolve, sep } = require$$1;
  let { SourceMapConsumer, SourceMapGenerator } = requireSourceMap();
  let { pathToFileURL } = require$$3;
  let Input = requireInput();
  let sourceMapAvailable = Boolean(SourceMapConsumer && SourceMapGenerator);
  let pathAvailable = Boolean(dirname && resolve && relative && sep);
  class MapGenerator {
    constructor(stringify2, root2, opts, cssString) {
      this.stringify = stringify2;
      this.mapOpts = opts.map || {};
      this.root = root2;
      this.opts = opts;
      this.css = cssString;
      this.originalCSS = cssString;
      this.usesFileUrls = !this.mapOpts.from && this.mapOpts.absolute;
      this.memoizedFileURLs = /* @__PURE__ */ new Map();
      this.memoizedPaths = /* @__PURE__ */ new Map();
      this.memoizedURLs = /* @__PURE__ */ new Map();
    }
    addAnnotation() {
      let content;
      if (this.isInline()) {
        content = "data:application/json;base64," + this.toBase64(this.map.toString());
      } else if (typeof this.mapOpts.annotation === "string") {
        content = this.mapOpts.annotation;
      } else if (typeof this.mapOpts.annotation === "function") {
        content = this.mapOpts.annotation(this.opts.to, this.root);
      } else {
        content = this.outputFile() + ".map";
      }
      let eol = "\n";
      if (this.css.includes("\r\n")) eol = "\r\n";
      this.css += eol + "/*# sourceMappingURL=" + content + " */";
    }
    applyPrevMaps() {
      for (let prev of this.previous()) {
        let from = this.toUrl(this.path(prev.file));
        let root2 = prev.root || dirname(prev.file);
        let map;
        if (this.mapOpts.sourcesContent === false) {
          map = new SourceMapConsumer(prev.text);
          if (map.sourcesContent) {
            map.sourcesContent = null;
          }
        } else {
          map = prev.consumer();
        }
        this.map.applySourceMap(map, from, this.toUrl(this.path(root2)));
      }
    }
    clearAnnotation() {
      if (this.mapOpts.annotation === false) return;
      if (this.root) {
        let node2;
        for (let i = this.root.nodes.length - 1; i >= 0; i--) {
          node2 = this.root.nodes[i];
          if (node2.type !== "comment") continue;
          if (node2.text.startsWith("# sourceMappingURL=")) {
            this.root.removeChild(i);
          }
        }
      } else if (this.css) {
        this.css = this.css.replace(/\n*\/\*#[\S\s]*?\*\/$/gm, "");
      }
    }
    generate() {
      this.clearAnnotation();
      if (pathAvailable && sourceMapAvailable && this.isMap()) {
        return this.generateMap();
      } else {
        let result2 = "";
        this.stringify(this.root, (i) => {
          result2 += i;
        });
        return [result2];
      }
    }
    generateMap() {
      if (this.root) {
        this.generateString();
      } else if (this.previous().length === 1) {
        let prev = this.previous()[0].consumer();
        prev.file = this.outputFile();
        this.map = SourceMapGenerator.fromSourceMap(prev, {
          ignoreInvalidMapping: true
        });
      } else {
        this.map = new SourceMapGenerator({
          file: this.outputFile(),
          ignoreInvalidMapping: true
        });
        this.map.addMapping({
          generated: { column: 0, line: 1 },
          original: { column: 0, line: 1 },
          source: this.opts.from ? this.toUrl(this.path(this.opts.from)) : "<no source>"
        });
      }
      if (this.isSourcesContent()) this.setSourcesContent();
      if (this.root && this.previous().length > 0) this.applyPrevMaps();
      if (this.isAnnotation()) this.addAnnotation();
      if (this.isInline()) {
        return [this.css];
      } else {
        return [this.css, this.map];
      }
    }
    generateString() {
      this.css = "";
      this.map = new SourceMapGenerator({
        file: this.outputFile(),
        ignoreInvalidMapping: true
      });
      let line = 1;
      let column = 1;
      let noSource = "<no source>";
      let mapping = {
        generated: { column: 0, line: 0 },
        original: { column: 0, line: 0 },
        source: ""
      };
      let last, lines;
      this.stringify(this.root, (str, node2, type) => {
        this.css += str;
        if (node2 && type !== "end") {
          mapping.generated.line = line;
          mapping.generated.column = column - 1;
          if (node2.source && node2.source.start) {
            mapping.source = this.sourcePath(node2);
            mapping.original.line = node2.source.start.line;
            mapping.original.column = node2.source.start.column - 1;
            this.map.addMapping(mapping);
          } else {
            mapping.source = noSource;
            mapping.original.line = 1;
            mapping.original.column = 0;
            this.map.addMapping(mapping);
          }
        }
        lines = str.match(/\n/g);
        if (lines) {
          line += lines.length;
          last = str.lastIndexOf("\n");
          column = str.length - last;
        } else {
          column += str.length;
        }
        if (node2 && type !== "start") {
          let p = node2.parent || { raws: {} };
          let childless = node2.type === "decl" || node2.type === "atrule" && !node2.nodes;
          if (!childless || node2 !== p.last || p.raws.semicolon) {
            if (node2.source && node2.source.end) {
              mapping.source = this.sourcePath(node2);
              mapping.original.line = node2.source.end.line;
              mapping.original.column = node2.source.end.column - 1;
              mapping.generated.line = line;
              mapping.generated.column = column - 2;
              this.map.addMapping(mapping);
            } else {
              mapping.source = noSource;
              mapping.original.line = 1;
              mapping.original.column = 0;
              mapping.generated.line = line;
              mapping.generated.column = column - 1;
              this.map.addMapping(mapping);
            }
          }
        }
      });
    }
    isAnnotation() {
      if (this.isInline()) {
        return true;
      }
      if (typeof this.mapOpts.annotation !== "undefined") {
        return this.mapOpts.annotation;
      }
      if (this.previous().length) {
        return this.previous().some((i) => i.annotation);
      }
      return true;
    }
    isInline() {
      if (typeof this.mapOpts.inline !== "undefined") {
        return this.mapOpts.inline;
      }
      let annotation = this.mapOpts.annotation;
      if (typeof annotation !== "undefined" && annotation !== true) {
        return false;
      }
      if (this.previous().length) {
        return this.previous().some((i) => i.inline);
      }
      return true;
    }
    isMap() {
      if (typeof this.opts.map !== "undefined") {
        return !!this.opts.map;
      }
      return this.previous().length > 0;
    }
    isSourcesContent() {
      if (typeof this.mapOpts.sourcesContent !== "undefined") {
        return this.mapOpts.sourcesContent;
      }
      if (this.previous().length) {
        return this.previous().some((i) => i.withContent());
      }
      return true;
    }
    outputFile() {
      if (this.opts.to) {
        return this.path(this.opts.to);
      } else if (this.opts.from) {
        return this.path(this.opts.from);
      } else {
        return "to.css";
      }
    }
    path(file) {
      if (this.mapOpts.absolute) return file;
      if (file.charCodeAt(0) === 60) return file;
      if (/^\w+:\/\//.test(file)) return file;
      let cached = this.memoizedPaths.get(file);
      if (cached) return cached;
      let from = this.opts.to ? dirname(this.opts.to) : ".";
      if (typeof this.mapOpts.annotation === "string") {
        from = dirname(resolve(from, this.mapOpts.annotation));
      }
      let path = relative(from, file);
      this.memoizedPaths.set(file, path);
      return path;
    }
    previous() {
      if (!this.previousMaps) {
        this.previousMaps = [];
        if (this.root) {
          this.root.walk((node2) => {
            if (node2.source && node2.source.input.map) {
              let map = node2.source.input.map;
              if (!this.previousMaps.includes(map)) {
                this.previousMaps.push(map);
              }
            }
          });
        } else {
          let input2 = new Input(this.originalCSS, this.opts);
          if (input2.map) this.previousMaps.push(input2.map);
        }
      }
      return this.previousMaps;
    }
    setSourcesContent() {
      let already = {};
      if (this.root) {
        this.root.walk((node2) => {
          if (node2.source) {
            let from = node2.source.input.from;
            if (from && !already[from]) {
              already[from] = true;
              let fromUrl = this.usesFileUrls ? this.toFileUrl(from) : this.toUrl(this.path(from));
              this.map.setSourceContent(fromUrl, node2.source.input.css);
            }
          }
        });
      } else if (this.css) {
        let from = this.opts.from ? this.toUrl(this.path(this.opts.from)) : "<no source>";
        this.map.setSourceContent(from, this.css);
      }
    }
    sourcePath(node2) {
      if (this.mapOpts.from) {
        return this.toUrl(this.mapOpts.from);
      } else if (this.usesFileUrls) {
        return this.toFileUrl(node2.source.input.from);
      } else {
        return this.toUrl(this.path(node2.source.input.from));
      }
    }
    toBase64(str) {
      if (Buffer) {
        return Buffer.from(str).toString("base64");
      } else {
        return window.btoa(unescape(encodeURIComponent(str)));
      }
    }
    toFileUrl(path) {
      let cached = this.memoizedFileURLs.get(path);
      if (cached) return cached;
      if (pathToFileURL) {
        let fileURL = pathToFileURL(path).toString();
        this.memoizedFileURLs.set(path, fileURL);
        return fileURL;
      } else {
        throw new Error(
          "`map.absolute` option is not available in this PostCSS build"
        );
      }
    }
    toUrl(path) {
      let cached = this.memoizedURLs.get(path);
      if (cached) return cached;
      if (sep === "\\") {
        path = path.replace(/\\/g, "/");
      }
      let url = encodeURI(path).replace(/[#?]/g, encodeURIComponent);
      this.memoizedURLs.set(path, url);
      return url;
    }
  }
  mapGenerator = MapGenerator;
  return mapGenerator;
}
var parser;
var hasRequiredParser;
function requireParser() {
  if (hasRequiredParser) return parser;
  hasRequiredParser = 1;
  let AtRule = requireAtRule();
  let Comment = requireComment();
  let Declaration = requireDeclaration();
  let Root = requireRoot();
  let Rule = requireRule();
  let tokenizer = requireTokenize();
  const SAFE_COMMENT_NEIGHBOR = {
    empty: true,
    space: true
  };
  function findLastWithPosition(tokens) {
    for (let i = tokens.length - 1; i >= 0; i--) {
      let token = tokens[i];
      let pos = token[3] || token[2];
      if (pos) return pos;
    }
  }
  class Parser2 {
    constructor(input2) {
      this.input = input2;
      this.root = new Root();
      this.current = this.root;
      this.spaces = "";
      this.semicolon = false;
      this.createTokenizer();
      this.root.source = { input: input2, start: { column: 1, line: 1, offset: 0 } };
    }
    atrule(token) {
      let node2 = new AtRule();
      node2.name = token[1].slice(1);
      if (node2.name === "") {
        this.unnamedAtrule(node2, token);
      }
      this.init(node2, token[2]);
      let type;
      let prev;
      let shift;
      let last = false;
      let open = false;
      let params = [];
      let brackets = [];
      while (!this.tokenizer.endOfFile()) {
        token = this.tokenizer.nextToken();
        type = token[0];
        if (type === "(" || type === "[") {
          brackets.push(type === "(" ? ")" : "]");
        } else if (type === "{" && brackets.length > 0) {
          brackets.push("}");
        } else if (type === brackets[brackets.length - 1]) {
          brackets.pop();
        }
        if (brackets.length === 0) {
          if (type === ";") {
            node2.source.end = this.getPosition(token[2]);
            node2.source.end.offset++;
            this.semicolon = true;
            break;
          } else if (type === "{") {
            open = true;
            break;
          } else if (type === "}") {
            if (params.length > 0) {
              shift = params.length - 1;
              prev = params[shift];
              while (prev && prev[0] === "space") {
                prev = params[--shift];
              }
              if (prev) {
                node2.source.end = this.getPosition(prev[3] || prev[2]);
                node2.source.end.offset++;
              }
            }
            this.end(token);
            break;
          } else {
            params.push(token);
          }
        } else {
          params.push(token);
        }
        if (this.tokenizer.endOfFile()) {
          last = true;
          break;
        }
      }
      node2.raws.between = this.spacesAndCommentsFromEnd(params);
      if (params.length) {
        node2.raws.afterName = this.spacesAndCommentsFromStart(params);
        this.raw(node2, "params", params);
        if (last) {
          token = params[params.length - 1];
          node2.source.end = this.getPosition(token[3] || token[2]);
          node2.source.end.offset++;
          this.spaces = node2.raws.between;
          node2.raws.between = "";
        }
      } else {
        node2.raws.afterName = "";
        node2.params = "";
      }
      if (open) {
        node2.nodes = [];
        this.current = node2;
      }
    }
    checkMissedSemicolon(tokens) {
      let colon = this.colon(tokens);
      if (colon === false) return;
      let founded = 0;
      let token;
      for (let j = colon - 1; j >= 0; j--) {
        token = tokens[j];
        if (token[0] !== "space") {
          founded += 1;
          if (founded === 2) break;
        }
      }
      throw this.input.error(
        "Missed semicolon",
        token[0] === "word" ? token[3] + 1 : token[2]
      );
    }
    colon(tokens) {
      let brackets = 0;
      let prev, token, type;
      for (let [i, element] of tokens.entries()) {
        token = element;
        type = token[0];
        if (type === "(") {
          brackets += 1;
        }
        if (type === ")") {
          brackets -= 1;
        }
        if (brackets === 0 && type === ":") {
          if (!prev) {
            this.doubleColon(token);
          } else if (prev[0] === "word" && prev[1] === "progid") {
            continue;
          } else {
            return i;
          }
        }
        prev = token;
      }
      return false;
    }
    comment(token) {
      let node2 = new Comment();
      this.init(node2, token[2]);
      node2.source.end = this.getPosition(token[3] || token[2]);
      node2.source.end.offset++;
      let text = token[1].slice(2, -2);
      if (/^\s*$/.test(text)) {
        node2.text = "";
        node2.raws.left = text;
        node2.raws.right = "";
      } else {
        let match = text.match(/^(\s*)([^]*\S)(\s*)$/);
        node2.text = match[2];
        node2.raws.left = match[1];
        node2.raws.right = match[3];
      }
    }
    createTokenizer() {
      this.tokenizer = tokenizer(this.input);
    }
    decl(tokens, customProperty) {
      let node2 = new Declaration();
      this.init(node2, tokens[0][2]);
      let last = tokens[tokens.length - 1];
      if (last[0] === ";") {
        this.semicolon = true;
        tokens.pop();
      }
      node2.source.end = this.getPosition(
        last[3] || last[2] || findLastWithPosition(tokens)
      );
      node2.source.end.offset++;
      while (tokens[0][0] !== "word") {
        if (tokens.length === 1) this.unknownWord(tokens);
        node2.raws.before += tokens.shift()[1];
      }
      node2.source.start = this.getPosition(tokens[0][2]);
      node2.prop = "";
      while (tokens.length) {
        let type = tokens[0][0];
        if (type === ":" || type === "space" || type === "comment") {
          break;
        }
        node2.prop += tokens.shift()[1];
      }
      node2.raws.between = "";
      let token;
      while (tokens.length) {
        token = tokens.shift();
        if (token[0] === ":") {
          node2.raws.between += token[1];
          break;
        } else {
          if (token[0] === "word" && /\w/.test(token[1])) {
            this.unknownWord([token]);
          }
          node2.raws.between += token[1];
        }
      }
      if (node2.prop[0] === "_" || node2.prop[0] === "*") {
        node2.raws.before += node2.prop[0];
        node2.prop = node2.prop.slice(1);
      }
      let firstSpaces = [];
      let next;
      while (tokens.length) {
        next = tokens[0][0];
        if (next !== "space" && next !== "comment") break;
        firstSpaces.push(tokens.shift());
      }
      this.precheckMissedSemicolon(tokens);
      for (let i = tokens.length - 1; i >= 0; i--) {
        token = tokens[i];
        if (token[1].toLowerCase() === "!important") {
          node2.important = true;
          let string = this.stringFrom(tokens, i);
          string = this.spacesFromEnd(tokens) + string;
          if (string !== " !important") node2.raws.important = string;
          break;
        } else if (token[1].toLowerCase() === "important") {
          let cache = tokens.slice(0);
          let str = "";
          for (let j = i; j > 0; j--) {
            let type = cache[j][0];
            if (str.trim().startsWith("!") && type !== "space") {
              break;
            }
            str = cache.pop()[1] + str;
          }
          if (str.trim().startsWith("!")) {
            node2.important = true;
            node2.raws.important = str;
            tokens = cache;
          }
        }
        if (token[0] !== "space" && token[0] !== "comment") {
          break;
        }
      }
      let hasWord = tokens.some((i) => i[0] !== "space" && i[0] !== "comment");
      if (hasWord) {
        node2.raws.between += firstSpaces.map((i) => i[1]).join("");
        firstSpaces = [];
      }
      this.raw(node2, "value", firstSpaces.concat(tokens), customProperty);
      if (node2.value.includes(":") && !customProperty) {
        this.checkMissedSemicolon(tokens);
      }
    }
    doubleColon(token) {
      throw this.input.error(
        "Double colon",
        { offset: token[2] },
        { offset: token[2] + token[1].length }
      );
    }
    emptyRule(token) {
      let node2 = new Rule();
      this.init(node2, token[2]);
      node2.selector = "";
      node2.raws.between = "";
      this.current = node2;
    }
    end(token) {
      if (this.current.nodes && this.current.nodes.length) {
        this.current.raws.semicolon = this.semicolon;
      }
      this.semicolon = false;
      this.current.raws.after = (this.current.raws.after || "") + this.spaces;
      this.spaces = "";
      if (this.current.parent) {
        this.current.source.end = this.getPosition(token[2]);
        this.current.source.end.offset++;
        this.current = this.current.parent;
      } else {
        this.unexpectedClose(token);
      }
    }
    endFile() {
      if (this.current.parent) this.unclosedBlock();
      if (this.current.nodes && this.current.nodes.length) {
        this.current.raws.semicolon = this.semicolon;
      }
      this.current.raws.after = (this.current.raws.after || "") + this.spaces;
      this.root.source.end = this.getPosition(this.tokenizer.position());
    }
    freeSemicolon(token) {
      this.spaces += token[1];
      if (this.current.nodes) {
        let prev = this.current.nodes[this.current.nodes.length - 1];
        if (prev && prev.type === "rule" && !prev.raws.ownSemicolon) {
          prev.raws.ownSemicolon = this.spaces;
          this.spaces = "";
          prev.source.end = this.getPosition(token[2]);
          prev.source.end.offset += prev.raws.ownSemicolon.length;
        }
      }
    }
    // Helpers
    getPosition(offset) {
      let pos = this.input.fromOffset(offset);
      return {
        column: pos.col,
        line: pos.line,
        offset
      };
    }
    init(node2, offset) {
      this.current.push(node2);
      node2.source = {
        input: this.input,
        start: this.getPosition(offset)
      };
      node2.raws.before = this.spaces;
      this.spaces = "";
      if (node2.type !== "comment") this.semicolon = false;
    }
    other(start) {
      let end = false;
      let type = null;
      let colon = false;
      let bracket = null;
      let brackets = [];
      let customProperty = start[1].startsWith("--");
      let tokens = [];
      let token = start;
      while (token) {
        type = token[0];
        tokens.push(token);
        if (type === "(" || type === "[") {
          if (!bracket) bracket = token;
          brackets.push(type === "(" ? ")" : "]");
        } else if (customProperty && colon && type === "{") {
          if (!bracket) bracket = token;
          brackets.push("}");
        } else if (brackets.length === 0) {
          if (type === ";") {
            if (colon) {
              this.decl(tokens, customProperty);
              return;
            } else {
              break;
            }
          } else if (type === "{") {
            this.rule(tokens);
            return;
          } else if (type === "}") {
            this.tokenizer.back(tokens.pop());
            end = true;
            break;
          } else if (type === ":") {
            colon = true;
          }
        } else if (type === brackets[brackets.length - 1]) {
          brackets.pop();
          if (brackets.length === 0) bracket = null;
        }
        token = this.tokenizer.nextToken();
      }
      if (this.tokenizer.endOfFile()) end = true;
      if (brackets.length > 0) this.unclosedBracket(bracket);
      if (end && colon) {
        if (!customProperty) {
          while (tokens.length) {
            token = tokens[tokens.length - 1][0];
            if (token !== "space" && token !== "comment") break;
            this.tokenizer.back(tokens.pop());
          }
        }
        this.decl(tokens, customProperty);
      } else {
        this.unknownWord(tokens);
      }
    }
    parse() {
      let token;
      while (!this.tokenizer.endOfFile()) {
        token = this.tokenizer.nextToken();
        switch (token[0]) {
          case "space":
            this.spaces += token[1];
            break;
          case ";":
            this.freeSemicolon(token);
            break;
          case "}":
            this.end(token);
            break;
          case "comment":
            this.comment(token);
            break;
          case "at-word":
            this.atrule(token);
            break;
          case "{":
            this.emptyRule(token);
            break;
          default:
            this.other(token);
            break;
        }
      }
      this.endFile();
    }
    precheckMissedSemicolon() {
    }
    raw(node2, prop, tokens, customProperty) {
      let token, type;
      let length = tokens.length;
      let value = "";
      let clean = true;
      let next, prev;
      for (let i = 0; i < length; i += 1) {
        token = tokens[i];
        type = token[0];
        if (type === "space" && i === length - 1 && !customProperty) {
          clean = false;
        } else if (type === "comment") {
          prev = tokens[i - 1] ? tokens[i - 1][0] : "empty";
          next = tokens[i + 1] ? tokens[i + 1][0] : "empty";
          if (!SAFE_COMMENT_NEIGHBOR[prev] && !SAFE_COMMENT_NEIGHBOR[next]) {
            if (value.slice(-1) === ",") {
              clean = false;
            } else {
              value += token[1];
            }
          } else {
            clean = false;
          }
        } else {
          value += token[1];
        }
      }
      if (!clean) {
        let raw = tokens.reduce((all, i) => all + i[1], "");
        node2.raws[prop] = { raw, value };
      }
      node2[prop] = value;
    }
    rule(tokens) {
      tokens.pop();
      let node2 = new Rule();
      this.init(node2, tokens[0][2]);
      node2.raws.between = this.spacesAndCommentsFromEnd(tokens);
      this.raw(node2, "selector", tokens);
      this.current = node2;
    }
    spacesAndCommentsFromEnd(tokens) {
      let lastTokenType;
      let spaces = "";
      while (tokens.length) {
        lastTokenType = tokens[tokens.length - 1][0];
        if (lastTokenType !== "space" && lastTokenType !== "comment") break;
        spaces = tokens.pop()[1] + spaces;
      }
      return spaces;
    }
    // Errors
    spacesAndCommentsFromStart(tokens) {
      let next;
      let spaces = "";
      while (tokens.length) {
        next = tokens[0][0];
        if (next !== "space" && next !== "comment") break;
        spaces += tokens.shift()[1];
      }
      return spaces;
    }
    spacesFromEnd(tokens) {
      let lastTokenType;
      let spaces = "";
      while (tokens.length) {
        lastTokenType = tokens[tokens.length - 1][0];
        if (lastTokenType !== "space") break;
        spaces = tokens.pop()[1] + spaces;
      }
      return spaces;
    }
    stringFrom(tokens, from) {
      let result2 = "";
      for (let i = from; i < tokens.length; i++) {
        result2 += tokens[i][1];
      }
      tokens.splice(from, tokens.length - from);
      return result2;
    }
    unclosedBlock() {
      let pos = this.current.source.start;
      throw this.input.error("Unclosed block", pos.line, pos.column);
    }
    unclosedBracket(bracket) {
      throw this.input.error(
        "Unclosed bracket",
        { offset: bracket[2] },
        { offset: bracket[2] + 1 }
      );
    }
    unexpectedClose(token) {
      throw this.input.error(
        "Unexpected }",
        { offset: token[2] },
        { offset: token[2] + 1 }
      );
    }
    unknownWord(tokens) {
      throw this.input.error(
        "Unknown word " + tokens[0][1],
        { offset: tokens[0][2] },
        { offset: tokens[0][2] + tokens[0][1].length }
      );
    }
    unnamedAtrule(node2, token) {
      throw this.input.error(
        "At-rule without name",
        { offset: token[2] },
        { offset: token[2] + token[1].length }
      );
    }
  }
  parser = Parser2;
  return parser;
}
var parse_1;
var hasRequiredParse;
function requireParse() {
  if (hasRequiredParse) return parse_1;
  hasRequiredParse = 1;
  let Container = requireContainer();
  let Input = requireInput();
  let Parser2 = requireParser();
  function parse(css, opts) {
    let input2 = new Input(css, opts);
    let parser2 = new Parser2(input2);
    try {
      parser2.parse();
    } catch (e) {
      throw e;
    }
    return parser2.root;
  }
  parse_1 = parse;
  parse.default = parse;
  Container.registerParse(parse);
  return parse_1;
}
var warning;
var hasRequiredWarning;
function requireWarning() {
  if (hasRequiredWarning) return warning;
  hasRequiredWarning = 1;
  class Warning {
    constructor(text, opts = {}) {
      this.type = "warning";
      this.text = text;
      if (opts.node && opts.node.source) {
        let range = opts.node.rangeBy(opts);
        this.line = range.start.line;
        this.column = range.start.column;
        this.endLine = range.end.line;
        this.endColumn = range.end.column;
      }
      for (let opt in opts) this[opt] = opts[opt];
    }
    toString() {
      if (this.node) {
        return this.node.error(this.text, {
          index: this.index,
          plugin: this.plugin,
          word: this.word
        }).message;
      }
      if (this.plugin) {
        return this.plugin + ": " + this.text;
      }
      return this.text;
    }
  }
  warning = Warning;
  Warning.default = Warning;
  return warning;
}
var result;
var hasRequiredResult;
function requireResult() {
  if (hasRequiredResult) return result;
  hasRequiredResult = 1;
  let Warning = requireWarning();
  class Result {
    get content() {
      return this.css;
    }
    constructor(processor2, root2, opts) {
      this.processor = processor2;
      this.messages = [];
      this.root = root2;
      this.opts = opts;
      this.css = "";
      this.map = void 0;
    }
    toString() {
      return this.css;
    }
    warn(text, opts = {}) {
      if (!opts.plugin) {
        if (this.lastPlugin && this.lastPlugin.postcssPlugin) {
          opts.plugin = this.lastPlugin.postcssPlugin;
        }
      }
      let warning2 = new Warning(text, opts);
      this.messages.push(warning2);
      return warning2;
    }
    warnings() {
      return this.messages.filter((i) => i.type === "warning");
    }
  }
  result = Result;
  Result.default = Result;
  return result;
}
var lazyResult;
var hasRequiredLazyResult;
function requireLazyResult() {
  if (hasRequiredLazyResult) return lazyResult;
  hasRequiredLazyResult = 1;
  let Container = requireContainer();
  let Document = requireDocument();
  let MapGenerator = requireMapGenerator();
  let parse = requireParse();
  let Result = requireResult();
  let Root = requireRoot();
  let stringify2 = requireStringify();
  let { isClean, my } = requireSymbols();
  const TYPE_TO_CLASS_NAME = {
    atrule: "AtRule",
    comment: "Comment",
    decl: "Declaration",
    document: "Document",
    root: "Root",
    rule: "Rule"
  };
  const PLUGIN_PROPS = {
    AtRule: true,
    AtRuleExit: true,
    Comment: true,
    CommentExit: true,
    Declaration: true,
    DeclarationExit: true,
    Document: true,
    DocumentExit: true,
    Once: true,
    OnceExit: true,
    postcssPlugin: true,
    prepare: true,
    Root: true,
    RootExit: true,
    Rule: true,
    RuleExit: true
  };
  const NOT_VISITORS = {
    Once: true,
    postcssPlugin: true,
    prepare: true
  };
  const CHILDREN = 0;
  function isPromise(obj) {
    return typeof obj === "object" && typeof obj.then === "function";
  }
  function getEvents(node2) {
    let key2 = false;
    let type = TYPE_TO_CLASS_NAME[node2.type];
    if (node2.type === "decl") {
      key2 = node2.prop.toLowerCase();
    } else if (node2.type === "atrule") {
      key2 = node2.name.toLowerCase();
    }
    if (key2 && node2.append) {
      return [
        type,
        type + "-" + key2,
        CHILDREN,
        type + "Exit",
        type + "Exit-" + key2
      ];
    } else if (key2) {
      return [type, type + "-" + key2, type + "Exit", type + "Exit-" + key2];
    } else if (node2.append) {
      return [type, CHILDREN, type + "Exit"];
    } else {
      return [type, type + "Exit"];
    }
  }
  function toStack(node2) {
    let events;
    if (node2.type === "document") {
      events = ["Document", CHILDREN, "DocumentExit"];
    } else if (node2.type === "root") {
      events = ["Root", CHILDREN, "RootExit"];
    } else {
      events = getEvents(node2);
    }
    return {
      eventIndex: 0,
      events,
      iterator: 0,
      node: node2,
      visitorIndex: 0,
      visitors: []
    };
  }
  function cleanMarks(node2) {
    node2[isClean] = false;
    if (node2.nodes) node2.nodes.forEach((i) => cleanMarks(i));
    return node2;
  }
  let postcss = {};
  class LazyResult {
    get content() {
      return this.stringify().content;
    }
    get css() {
      return this.stringify().css;
    }
    get map() {
      return this.stringify().map;
    }
    get messages() {
      return this.sync().messages;
    }
    get opts() {
      return this.result.opts;
    }
    get processor() {
      return this.result.processor;
    }
    get root() {
      return this.sync().root;
    }
    get [Symbol.toStringTag]() {
      return "LazyResult";
    }
    constructor(processor2, css, opts) {
      this.stringified = false;
      this.processed = false;
      let root2;
      if (typeof css === "object" && css !== null && (css.type === "root" || css.type === "document")) {
        root2 = cleanMarks(css);
      } else if (css instanceof LazyResult || css instanceof Result) {
        root2 = cleanMarks(css.root);
        if (css.map) {
          if (typeof opts.map === "undefined") opts.map = {};
          if (!opts.map.inline) opts.map.inline = false;
          opts.map.prev = css.map;
        }
      } else {
        let parser2 = parse;
        if (opts.syntax) parser2 = opts.syntax.parse;
        if (opts.parser) parser2 = opts.parser;
        if (parser2.parse) parser2 = parser2.parse;
        try {
          root2 = parser2(css, opts);
        } catch (error) {
          this.processed = true;
          this.error = error;
        }
        if (root2 && !root2[my]) {
          Container.rebuild(root2);
        }
      }
      this.result = new Result(processor2, root2, opts);
      this.helpers = { ...postcss, postcss, result: this.result };
      this.plugins = this.processor.plugins.map((plugin) => {
        if (typeof plugin === "object" && plugin.prepare) {
          return { ...plugin, ...plugin.prepare(this.result) };
        } else {
          return plugin;
        }
      });
    }
    async() {
      if (this.error) return Promise.reject(this.error);
      if (this.processed) return Promise.resolve(this.result);
      if (!this.processing) {
        this.processing = this.runAsync();
      }
      return this.processing;
    }
    catch(onRejected) {
      return this.async().catch(onRejected);
    }
    finally(onFinally) {
      return this.async().then(onFinally, onFinally);
    }
    getAsyncError() {
      throw new Error("Use process(css).then(cb) to work with async plugins");
    }
    handleError(error, node2) {
      let plugin = this.result.lastPlugin;
      try {
        if (node2) node2.addToError(error);
        this.error = error;
        if (error.name === "CssSyntaxError" && !error.plugin) {
          error.plugin = plugin.postcssPlugin;
          error.setMessage();
        } else if (plugin.postcssVersion) {
          if (false) ;
        }
      } catch (err) {
        if (console && console.error) console.error(err);
      }
      return error;
    }
    prepareVisitors() {
      this.listeners = {};
      let add = (plugin, type, cb) => {
        if (!this.listeners[type]) this.listeners[type] = [];
        this.listeners[type].push([plugin, cb]);
      };
      for (let plugin of this.plugins) {
        if (typeof plugin === "object") {
          for (let event in plugin) {
            if (!PLUGIN_PROPS[event] && /^[A-Z]/.test(event)) {
              throw new Error(
                `Unknown event ${event} in ${plugin.postcssPlugin}. Try to update PostCSS (${this.processor.version} now).`
              );
            }
            if (!NOT_VISITORS[event]) {
              if (typeof plugin[event] === "object") {
                for (let filter in plugin[event]) {
                  if (filter === "*") {
                    add(plugin, event, plugin[event][filter]);
                  } else {
                    add(
                      plugin,
                      event + "-" + filter.toLowerCase(),
                      plugin[event][filter]
                    );
                  }
                }
              } else if (typeof plugin[event] === "function") {
                add(plugin, event, plugin[event]);
              }
            }
          }
        }
      }
      this.hasListener = Object.keys(this.listeners).length > 0;
    }
    async runAsync() {
      this.plugin = 0;
      for (let i = 0; i < this.plugins.length; i++) {
        let plugin = this.plugins[i];
        let promise = this.runOnRoot(plugin);
        if (isPromise(promise)) {
          try {
            await promise;
          } catch (error) {
            throw this.handleError(error);
          }
        }
      }
      this.prepareVisitors();
      if (this.hasListener) {
        let root2 = this.result.root;
        while (!root2[isClean]) {
          root2[isClean] = true;
          let stack = [toStack(root2)];
          while (stack.length > 0) {
            let promise = this.visitTick(stack);
            if (isPromise(promise)) {
              try {
                await promise;
              } catch (e) {
                let node2 = stack[stack.length - 1].node;
                throw this.handleError(e, node2);
              }
            }
          }
        }
        if (this.listeners.OnceExit) {
          for (let [plugin, visitor] of this.listeners.OnceExit) {
            this.result.lastPlugin = plugin;
            try {
              if (root2.type === "document") {
                let roots = root2.nodes.map(
                  (subRoot) => visitor(subRoot, this.helpers)
                );
                await Promise.all(roots);
              } else {
                await visitor(root2, this.helpers);
              }
            } catch (e) {
              throw this.handleError(e);
            }
          }
        }
      }
      this.processed = true;
      return this.stringify();
    }
    runOnRoot(plugin) {
      this.result.lastPlugin = plugin;
      try {
        if (typeof plugin === "object" && plugin.Once) {
          if (this.result.root.type === "document") {
            let roots = this.result.root.nodes.map(
              (root2) => plugin.Once(root2, this.helpers)
            );
            if (isPromise(roots[0])) {
              return Promise.all(roots);
            }
            return roots;
          }
          return plugin.Once(this.result.root, this.helpers);
        } else if (typeof plugin === "function") {
          return plugin(this.result.root, this.result);
        }
      } catch (error) {
        throw this.handleError(error);
      }
    }
    stringify() {
      if (this.error) throw this.error;
      if (this.stringified) return this.result;
      this.stringified = true;
      this.sync();
      let opts = this.result.opts;
      let str = stringify2;
      if (opts.syntax) str = opts.syntax.stringify;
      if (opts.stringifier) str = opts.stringifier;
      if (str.stringify) str = str.stringify;
      let map = new MapGenerator(str, this.result.root, this.result.opts);
      let data = map.generate();
      this.result.css = data[0];
      this.result.map = data[1];
      return this.result;
    }
    sync() {
      if (this.error) throw this.error;
      if (this.processed) return this.result;
      this.processed = true;
      if (this.processing) {
        throw this.getAsyncError();
      }
      for (let plugin of this.plugins) {
        let promise = this.runOnRoot(plugin);
        if (isPromise(promise)) {
          throw this.getAsyncError();
        }
      }
      this.prepareVisitors();
      if (this.hasListener) {
        let root2 = this.result.root;
        while (!root2[isClean]) {
          root2[isClean] = true;
          this.walkSync(root2);
        }
        if (this.listeners.OnceExit) {
          if (root2.type === "document") {
            for (let subRoot of root2.nodes) {
              this.visitSync(this.listeners.OnceExit, subRoot);
            }
          } else {
            this.visitSync(this.listeners.OnceExit, root2);
          }
        }
      }
      return this.result;
    }
    then(onFulfilled, onRejected) {
      return this.async().then(onFulfilled, onRejected);
    }
    toString() {
      return this.css;
    }
    visitSync(visitors, node2) {
      for (let [plugin, visitor] of visitors) {
        this.result.lastPlugin = plugin;
        let promise;
        try {
          promise = visitor(node2, this.helpers);
        } catch (e) {
          throw this.handleError(e, node2.proxyOf);
        }
        if (node2.type !== "root" && node2.type !== "document" && !node2.parent) {
          return true;
        }
        if (isPromise(promise)) {
          throw this.getAsyncError();
        }
      }
    }
    visitTick(stack) {
      let visit = stack[stack.length - 1];
      let { node: node2, visitors } = visit;
      if (node2.type !== "root" && node2.type !== "document" && !node2.parent) {
        stack.pop();
        return;
      }
      if (visitors.length > 0 && visit.visitorIndex < visitors.length) {
        let [plugin, visitor] = visitors[visit.visitorIndex];
        visit.visitorIndex += 1;
        if (visit.visitorIndex === visitors.length) {
          visit.visitors = [];
          visit.visitorIndex = 0;
        }
        this.result.lastPlugin = plugin;
        try {
          return visitor(node2.toProxy(), this.helpers);
        } catch (e) {
          throw this.handleError(e, node2);
        }
      }
      if (visit.iterator !== 0) {
        let iterator = visit.iterator;
        let child;
        while (child = node2.nodes[node2.indexes[iterator]]) {
          node2.indexes[iterator] += 1;
          if (!child[isClean]) {
            child[isClean] = true;
            stack.push(toStack(child));
            return;
          }
        }
        visit.iterator = 0;
        delete node2.indexes[iterator];
      }
      let events = visit.events;
      while (visit.eventIndex < events.length) {
        let event = events[visit.eventIndex];
        visit.eventIndex += 1;
        if (event === CHILDREN) {
          if (node2.nodes && node2.nodes.length) {
            node2[isClean] = true;
            visit.iterator = node2.getIterator();
          }
          return;
        } else if (this.listeners[event]) {
          visit.visitors = this.listeners[event];
          return;
        }
      }
      stack.pop();
    }
    walkSync(node2) {
      node2[isClean] = true;
      let events = getEvents(node2);
      for (let event of events) {
        if (event === CHILDREN) {
          if (node2.nodes) {
            node2.each((child) => {
              if (!child[isClean]) this.walkSync(child);
            });
          }
        } else {
          let visitors = this.listeners[event];
          if (visitors) {
            if (this.visitSync(visitors, node2.toProxy())) return;
          }
        }
      }
    }
    warnings() {
      return this.sync().warnings();
    }
  }
  LazyResult.registerPostcss = (dependant) => {
    postcss = dependant;
  };
  lazyResult = LazyResult;
  LazyResult.default = LazyResult;
  Root.registerLazyResult(LazyResult);
  Document.registerLazyResult(LazyResult);
  return lazyResult;
}
var noWorkResult;
var hasRequiredNoWorkResult;
function requireNoWorkResult() {
  if (hasRequiredNoWorkResult) return noWorkResult;
  hasRequiredNoWorkResult = 1;
  let MapGenerator = requireMapGenerator();
  let parse = requireParse();
  const Result = requireResult();
  let stringify2 = requireStringify();
  class NoWorkResult {
    get content() {
      return this.result.css;
    }
    get css() {
      return this.result.css;
    }
    get map() {
      return this.result.map;
    }
    get messages() {
      return [];
    }
    get opts() {
      return this.result.opts;
    }
    get processor() {
      return this.result.processor;
    }
    get root() {
      if (this._root) {
        return this._root;
      }
      let root2;
      let parser2 = parse;
      try {
        root2 = parser2(this._css, this._opts);
      } catch (error) {
        this.error = error;
      }
      if (this.error) {
        throw this.error;
      } else {
        this._root = root2;
        return root2;
      }
    }
    get [Symbol.toStringTag]() {
      return "NoWorkResult";
    }
    constructor(processor2, css, opts) {
      css = css.toString();
      this.stringified = false;
      this._processor = processor2;
      this._css = css;
      this._opts = opts;
      this._map = void 0;
      let root2;
      let str = stringify2;
      this.result = new Result(this._processor, root2, this._opts);
      this.result.css = css;
      let self = this;
      Object.defineProperty(this.result, "root", {
        get() {
          return self.root;
        }
      });
      let map = new MapGenerator(str, root2, this._opts, css);
      if (map.isMap()) {
        let [generatedCSS, generatedMap] = map.generate();
        if (generatedCSS) {
          this.result.css = generatedCSS;
        }
        if (generatedMap) {
          this.result.map = generatedMap;
        }
      } else {
        map.clearAnnotation();
        this.result.css = map.css;
      }
    }
    async() {
      if (this.error) return Promise.reject(this.error);
      return Promise.resolve(this.result);
    }
    catch(onRejected) {
      return this.async().catch(onRejected);
    }
    finally(onFinally) {
      return this.async().then(onFinally, onFinally);
    }
    sync() {
      if (this.error) throw this.error;
      return this.result;
    }
    then(onFulfilled, onRejected) {
      return this.async().then(onFulfilled, onRejected);
    }
    toString() {
      return this._css;
    }
    warnings() {
      return [];
    }
  }
  noWorkResult = NoWorkResult;
  NoWorkResult.default = NoWorkResult;
  return noWorkResult;
}
var processor;
var hasRequiredProcessor;
function requireProcessor() {
  if (hasRequiredProcessor) return processor;
  hasRequiredProcessor = 1;
  let Document = requireDocument();
  let LazyResult = requireLazyResult();
  let NoWorkResult = requireNoWorkResult();
  let Root = requireRoot();
  class Processor {
    constructor(plugins = []) {
      this.version = "8.5.6";
      this.plugins = this.normalize(plugins);
    }
    normalize(plugins) {
      let normalized = [];
      for (let i of plugins) {
        if (i.postcss === true) {
          i = i();
        } else if (i.postcss) {
          i = i.postcss;
        }
        if (typeof i === "object" && Array.isArray(i.plugins)) {
          normalized = normalized.concat(i.plugins);
        } else if (typeof i === "object" && i.postcssPlugin) {
          normalized.push(i);
        } else if (typeof i === "function") {
          normalized.push(i);
        } else if (typeof i === "object" && (i.parse || i.stringify)) ;
        else {
          throw new Error(i + " is not a PostCSS plugin");
        }
      }
      return normalized;
    }
    process(css, opts = {}) {
      if (!this.plugins.length && !opts.parser && !opts.stringifier && !opts.syntax) {
        return new NoWorkResult(this, css, opts);
      } else {
        return new LazyResult(this, css, opts);
      }
    }
    use(plugin) {
      this.plugins = this.plugins.concat(this.normalize([plugin]));
      return this;
    }
  }
  processor = Processor;
  Processor.default = Processor;
  Root.registerProcessor(Processor);
  Document.registerProcessor(Processor);
  return processor;
}
var postcss_1;
var hasRequiredPostcss;
function requirePostcss() {
  if (hasRequiredPostcss) return postcss_1;
  hasRequiredPostcss = 1;
  let AtRule = requireAtRule();
  let Comment = requireComment();
  let Container = requireContainer();
  let CssSyntaxError = requireCssSyntaxError();
  let Declaration = requireDeclaration();
  let Document = requireDocument();
  let fromJSON = requireFromJSON();
  let Input = requireInput();
  let LazyResult = requireLazyResult();
  let list = requireList();
  let Node = requireNode();
  let parse = requireParse();
  let Processor = requireProcessor();
  let Result = requireResult();
  let Root = requireRoot();
  let Rule = requireRule();
  let stringify2 = requireStringify();
  let Warning = requireWarning();
  function postcss(...plugins) {
    if (plugins.length === 1 && Array.isArray(plugins[0])) {
      plugins = plugins[0];
    }
    return new Processor(plugins);
  }
  postcss.plugin = function plugin(name, initializer) {
    let warningPrinted = false;
    function creator(...args) {
      if (console && console.warn && !warningPrinted) {
        warningPrinted = true;
        console.warn(
          name + ": postcss.plugin was deprecated. Migration guide:\nhttps://evilmartians.com/chronicles/postcss-8-plugin-migration"
        );
        if (process.env.LANG && process.env.LANG.startsWith("cn")) {
          console.warn(
            name + ": 里面 postcss.plugin 被弃用. 迁移指南:\nhttps://www.w3ctech.com/topic/2226"
          );
        }
      }
      let transformer = initializer(...args);
      transformer.postcssPlugin = name;
      transformer.postcssVersion = new Processor().version;
      return transformer;
    }
    let cache;
    Object.defineProperty(creator, "postcss", {
      get() {
        if (!cache) cache = creator();
        return cache;
      }
    });
    creator.process = function(css, processOpts, pluginOpts) {
      return postcss([creator(pluginOpts)]).process(css, processOpts);
    };
    return creator;
  };
  postcss.stringify = stringify2;
  postcss.parse = parse;
  postcss.fromJSON = fromJSON;
  postcss.list = list;
  postcss.comment = (defaults) => new Comment(defaults);
  postcss.atRule = (defaults) => new AtRule(defaults);
  postcss.decl = (defaults) => new Declaration(defaults);
  postcss.rule = (defaults) => new Rule(defaults);
  postcss.root = (defaults) => new Root(defaults);
  postcss.document = (defaults) => new Document(defaults);
  postcss.CssSyntaxError = CssSyntaxError;
  postcss.Declaration = Declaration;
  postcss.Container = Container;
  postcss.Processor = Processor;
  postcss.Document = Document;
  postcss.Comment = Comment;
  postcss.Warning = Warning;
  postcss.AtRule = AtRule;
  postcss.Result = Result;
  postcss.Input = Input;
  postcss.Rule = Rule;
  postcss.Root = Root;
  postcss.Node = Node;
  LazyResult.registerPostcss(postcss);
  postcss_1 = postcss;
  postcss.default = postcss;
  return postcss_1;
}
var sanitizeHtml_1;
var hasRequiredSanitizeHtml;
function requireSanitizeHtml() {
  if (hasRequiredSanitizeHtml) return sanitizeHtml_1;
  hasRequiredSanitizeHtml = 1;
  const htmlparser = /* @__PURE__ */ requireLib();
  const escapeStringRegexp2 = requireEscapeStringRegexp();
  const { isPlainObject: isPlainObject2 } = requireIsPlainObject();
  const deepmerge = requireCjs();
  const parseSrcset2 = requireParseSrcset();
  const { parse: postcssParse } = requirePostcss();
  const mediaTags = [
    "img",
    "audio",
    "video",
    "picture",
    "svg",
    "object",
    "map",
    "iframe",
    "embed"
  ];
  const vulnerableTags = ["script", "style"];
  function each(obj, cb) {
    if (obj) {
      Object.keys(obj).forEach(function(key2) {
        cb(obj[key2], key2);
      });
    }
  }
  function has(obj, key2) {
    return {}.hasOwnProperty.call(obj, key2);
  }
  function filter(a, cb) {
    const n = [];
    each(a, function(v) {
      if (cb(v)) {
        n.push(v);
      }
    });
    return n;
  }
  function isEmptyObject(obj) {
    for (const key2 in obj) {
      if (has(obj, key2)) {
        return false;
      }
    }
    return true;
  }
  function stringifySrcset(parsedSrcset) {
    return parsedSrcset.map(function(part) {
      if (!part.url) {
        throw new Error("URL missing");
      }
      return part.url + (part.w ? ` ${part.w}w` : "") + (part.h ? ` ${part.h}h` : "") + (part.d ? ` ${part.d}x` : "");
    }).join(", ");
  }
  sanitizeHtml_1 = sanitizeHtml2;
  const VALID_HTML_ATTRIBUTE_NAME = /^[^\0\t\n\f\r /<=>]+$/;
  function sanitizeHtml2(html, options, _recursing) {
    if (html == null) {
      return "";
    }
    if (typeof html === "number") {
      html = html.toString();
    }
    let result2 = "";
    let tempResult = "";
    function Frame(tag, attribs) {
      const that = this;
      this.tag = tag;
      this.attribs = attribs || {};
      this.tagPosition = result2.length;
      this.text = "";
      this.openingTagLength = 0;
      this.mediaChildren = [];
      this.updateParentNodeText = function() {
        if (stack.length) {
          const parentFrame = stack[stack.length - 1];
          parentFrame.text += that.text;
        }
      };
      this.updateParentNodeMediaChildren = function() {
        if (stack.length && mediaTags.includes(this.tag)) {
          const parentFrame = stack[stack.length - 1];
          parentFrame.mediaChildren.push(this.tag);
        }
      };
    }
    options = Object.assign({}, sanitizeHtml2.defaults, options);
    options.parser = Object.assign({}, htmlParserDefaults, options.parser);
    const tagAllowed = function(name) {
      return options.allowedTags === false || (options.allowedTags || []).indexOf(name) > -1;
    };
    vulnerableTags.forEach(function(tag) {
      if (tagAllowed(tag) && !options.allowVulnerableTags) {
        console.warn(`

⚠️ Your \`allowedTags\` option includes, \`${tag}\`, which is inherently
vulnerable to XSS attacks. Please remove it from \`allowedTags\`.
Or, to disable this warning, add the \`allowVulnerableTags\` option
and ensure you are accounting for this risk.

`);
      }
    });
    const nonTextTagsArray = options.nonTextTags || [
      "script",
      "style",
      "textarea",
      "option"
    ];
    let allowedAttributesMap;
    let allowedAttributesGlobMap;
    if (options.allowedAttributes) {
      allowedAttributesMap = {};
      allowedAttributesGlobMap = {};
      each(options.allowedAttributes, function(attributes, tag) {
        allowedAttributesMap[tag] = [];
        const globRegex = [];
        attributes.forEach(function(obj) {
          if (typeof obj === "string" && obj.indexOf("*") >= 0) {
            globRegex.push(escapeStringRegexp2(obj).replace(/\\\*/g, ".*"));
          } else {
            allowedAttributesMap[tag].push(obj);
          }
        });
        if (globRegex.length) {
          allowedAttributesGlobMap[tag] = new RegExp("^(" + globRegex.join("|") + ")$");
        }
      });
    }
    const allowedClassesMap = {};
    const allowedClassesGlobMap = {};
    const allowedClassesRegexMap = {};
    each(options.allowedClasses, function(classes, tag) {
      if (allowedAttributesMap) {
        if (!has(allowedAttributesMap, tag)) {
          allowedAttributesMap[tag] = [];
        }
        allowedAttributesMap[tag].push("class");
      }
      allowedClassesMap[tag] = classes;
      if (Array.isArray(classes)) {
        const globRegex = [];
        allowedClassesMap[tag] = [];
        allowedClassesRegexMap[tag] = [];
        classes.forEach(function(obj) {
          if (typeof obj === "string" && obj.indexOf("*") >= 0) {
            globRegex.push(escapeStringRegexp2(obj).replace(/\\\*/g, ".*"));
          } else if (obj instanceof RegExp) {
            allowedClassesRegexMap[tag].push(obj);
          } else {
            allowedClassesMap[tag].push(obj);
          }
        });
        if (globRegex.length) {
          allowedClassesGlobMap[tag] = new RegExp("^(" + globRegex.join("|") + ")$");
        }
      }
    });
    const transformTagsMap = {};
    let transformTagsAll;
    each(options.transformTags, function(transform, tag) {
      let transFun;
      if (typeof transform === "function") {
        transFun = transform;
      } else if (typeof transform === "string") {
        transFun = sanitizeHtml2.simpleTransform(transform);
      }
      if (tag === "*") {
        transformTagsAll = transFun;
      } else {
        transformTagsMap[tag] = transFun;
      }
    });
    let depth;
    let stack;
    let skipMap;
    let transformMap;
    let skipText;
    let skipTextDepth;
    let addedText = false;
    initializeState();
    const parser2 = new htmlparser.Parser({
      onopentag: function(name, attribs) {
        if (options.onOpenTag) {
          options.onOpenTag(name, attribs);
        }
        if (options.enforceHtmlBoundary && name === "html") {
          initializeState();
        }
        if (skipText) {
          skipTextDepth++;
          return;
        }
        const frame = new Frame(name, attribs);
        stack.push(frame);
        let skip = false;
        const hasText = !!frame.text;
        let transformedTag;
        if (has(transformTagsMap, name)) {
          transformedTag = transformTagsMap[name](name, attribs);
          frame.attribs = attribs = transformedTag.attribs;
          if (transformedTag.text !== void 0) {
            frame.innerText = transformedTag.text;
          }
          if (name !== transformedTag.tagName) {
            frame.name = name = transformedTag.tagName;
            transformMap[depth] = transformedTag.tagName;
          }
        }
        if (transformTagsAll) {
          transformedTag = transformTagsAll(name, attribs);
          frame.attribs = attribs = transformedTag.attribs;
          if (name !== transformedTag.tagName) {
            frame.name = name = transformedTag.tagName;
            transformMap[depth] = transformedTag.tagName;
          }
        }
        if (!tagAllowed(name) || options.disallowedTagsMode === "recursiveEscape" && !isEmptyObject(skipMap) || options.nestingLimit != null && depth >= options.nestingLimit) {
          skip = true;
          skipMap[depth] = true;
          if (options.disallowedTagsMode === "discard" || options.disallowedTagsMode === "completelyDiscard") {
            if (nonTextTagsArray.indexOf(name) !== -1) {
              skipText = true;
              skipTextDepth = 1;
            }
          }
        }
        depth++;
        if (skip) {
          if (options.disallowedTagsMode === "discard" || options.disallowedTagsMode === "completelyDiscard") {
            if (frame.innerText && !hasText) {
              const escaped = escapeHtml(frame.innerText);
              if (options.textFilter) {
                result2 += options.textFilter(escaped, name);
              } else {
                result2 += escaped;
              }
              addedText = true;
            }
            return;
          }
          tempResult = result2;
          result2 = "";
        }
        result2 += "<" + name;
        if (name === "script") {
          if (options.allowedScriptHostnames || options.allowedScriptDomains) {
            frame.innerText = "";
          }
        }
        const isBeingEscaped = skip && (options.disallowedTagsMode === "escape" || options.disallowedTagsMode === "recursiveEscape");
        const shouldPreserveEscapedAttributes = isBeingEscaped && options.preserveEscapedAttributes;
        if (shouldPreserveEscapedAttributes) {
          each(attribs, function(value, a) {
            result2 += " " + a + '="' + escapeHtml(value || "", true) + '"';
          });
        } else if (!allowedAttributesMap || has(allowedAttributesMap, name) || allowedAttributesMap["*"]) {
          each(attribs, function(value, a) {
            if (!VALID_HTML_ATTRIBUTE_NAME.test(a)) {
              delete frame.attribs[a];
              return;
            }
            if (value === "" && !options.allowedEmptyAttributes.includes(a) && (options.nonBooleanAttributes.includes(a) || options.nonBooleanAttributes.includes("*"))) {
              delete frame.attribs[a];
              return;
            }
            let passedAllowedAttributesMapCheck = false;
            if (!allowedAttributesMap || has(allowedAttributesMap, name) && allowedAttributesMap[name].indexOf(a) !== -1 || allowedAttributesMap["*"] && allowedAttributesMap["*"].indexOf(a) !== -1 || has(allowedAttributesGlobMap, name) && allowedAttributesGlobMap[name].test(a) || allowedAttributesGlobMap["*"] && allowedAttributesGlobMap["*"].test(a)) {
              passedAllowedAttributesMapCheck = true;
            } else if (allowedAttributesMap && allowedAttributesMap[name]) {
              for (const o of allowedAttributesMap[name]) {
                if (isPlainObject2(o) && o.name && o.name === a) {
                  passedAllowedAttributesMapCheck = true;
                  let newValue = "";
                  if (o.multiple === true) {
                    const splitStrArray = value.split(" ");
                    for (const s of splitStrArray) {
                      if (o.values.indexOf(s) !== -1) {
                        if (newValue === "") {
                          newValue = s;
                        } else {
                          newValue += " " + s;
                        }
                      }
                    }
                  } else if (o.values.indexOf(value) >= 0) {
                    newValue = value;
                  }
                  value = newValue;
                }
              }
            }
            if (passedAllowedAttributesMapCheck) {
              if (options.allowedSchemesAppliedToAttributes.indexOf(a) !== -1) {
                if (naughtyHref(name, value)) {
                  delete frame.attribs[a];
                  return;
                }
              }
              if (name === "script" && a === "src") {
                let allowed = true;
                try {
                  const parsed = parseUrl(value);
                  if (options.allowedScriptHostnames || options.allowedScriptDomains) {
                    const allowedHostname = (options.allowedScriptHostnames || []).find(function(hostname) {
                      return hostname === parsed.url.hostname;
                    });
                    const allowedDomain = (options.allowedScriptDomains || []).find(function(domain) {
                      return parsed.url.hostname === domain || parsed.url.hostname.endsWith(`.${domain}`);
                    });
                    allowed = allowedHostname || allowedDomain;
                  }
                } catch (e) {
                  allowed = false;
                }
                if (!allowed) {
                  delete frame.attribs[a];
                  return;
                }
              }
              if (name === "iframe" && a === "src") {
                let allowed = true;
                try {
                  const parsed = parseUrl(value);
                  if (parsed.isRelativeUrl) {
                    allowed = has(options, "allowIframeRelativeUrls") ? options.allowIframeRelativeUrls : !options.allowedIframeHostnames && !options.allowedIframeDomains;
                  } else if (options.allowedIframeHostnames || options.allowedIframeDomains) {
                    const allowedHostname = (options.allowedIframeHostnames || []).find(function(hostname) {
                      return hostname === parsed.url.hostname;
                    });
                    const allowedDomain = (options.allowedIframeDomains || []).find(function(domain) {
                      return parsed.url.hostname === domain || parsed.url.hostname.endsWith(`.${domain}`);
                    });
                    allowed = allowedHostname || allowedDomain;
                  }
                } catch (e) {
                  allowed = false;
                }
                if (!allowed) {
                  delete frame.attribs[a];
                  return;
                }
              }
              if (a === "srcset") {
                try {
                  let parsed = parseSrcset2(value);
                  parsed.forEach(function(value2) {
                    if (naughtyHref("srcset", value2.url)) {
                      value2.evil = true;
                    }
                  });
                  parsed = filter(parsed, function(v) {
                    return !v.evil;
                  });
                  if (!parsed.length) {
                    delete frame.attribs[a];
                    return;
                  } else {
                    value = stringifySrcset(filter(parsed, function(v) {
                      return !v.evil;
                    }));
                    frame.attribs[a] = value;
                  }
                } catch (e) {
                  delete frame.attribs[a];
                  return;
                }
              }
              if (a === "class") {
                const allowedSpecificClasses = allowedClassesMap[name];
                const allowedWildcardClasses = allowedClassesMap["*"];
                const allowedSpecificClassesGlob = allowedClassesGlobMap[name];
                const allowedSpecificClassesRegex = allowedClassesRegexMap[name];
                const allowedWildcardClassesRegex = allowedClassesRegexMap["*"];
                const allowedWildcardClassesGlob = allowedClassesGlobMap["*"];
                const allowedClassesGlobs = [
                  allowedSpecificClassesGlob,
                  allowedWildcardClassesGlob
                ].concat(allowedSpecificClassesRegex, allowedWildcardClassesRegex).filter(function(t) {
                  return t;
                });
                if (allowedSpecificClasses && allowedWildcardClasses) {
                  value = filterClasses(
                    value,
                    deepmerge(allowedSpecificClasses, allowedWildcardClasses),
                    allowedClassesGlobs
                  );
                } else {
                  value = filterClasses(
                    value,
                    allowedSpecificClasses || allowedWildcardClasses,
                    allowedClassesGlobs
                  );
                }
                if (!value.length) {
                  delete frame.attribs[a];
                  return;
                }
              }
              if (a === "style") {
                if (options.parseStyleAttributes) {
                  try {
                    const abstractSyntaxTree = postcssParse(name + " {" + value + "}", { map: false });
                    const filteredAST = filterCss(
                      abstractSyntaxTree,
                      options.allowedStyles
                    );
                    value = stringifyStyleAttributes(filteredAST);
                    if (value.length === 0) {
                      delete frame.attribs[a];
                      return;
                    }
                  } catch (e) {
                    if (typeof window !== "undefined") {
                      console.warn('Failed to parse "' + name + " {" + value + `}", If you're running this in a browser, we recommend to disable style parsing: options.parseStyleAttributes: false, since this only works in a node environment due to a postcss dependency, More info: https://github.com/apostrophecms/sanitize-html/issues/547`);
                    }
                    delete frame.attribs[a];
                    return;
                  }
                } else if (options.allowedStyles) {
                  throw new Error("allowedStyles option cannot be used together with parseStyleAttributes: false.");
                }
              }
              result2 += " " + a;
              if (value && value.length) {
                result2 += '="' + escapeHtml(value, true) + '"';
              } else if (options.allowedEmptyAttributes.includes(a)) {
                result2 += '=""';
              }
            } else {
              delete frame.attribs[a];
            }
          });
        }
        if (options.selfClosing.indexOf(name) !== -1) {
          result2 += " />";
        } else {
          result2 += ">";
          if (frame.innerText && !hasText && !options.textFilter) {
            result2 += escapeHtml(frame.innerText);
            addedText = true;
          }
        }
        if (skip) {
          result2 = tempResult + escapeHtml(result2);
          tempResult = "";
        }
        frame.openingTagLength = result2.length - frame.tagPosition;
      },
      ontext: function(text) {
        if (skipText) {
          return;
        }
        const lastFrame = stack[stack.length - 1];
        let tag;
        if (lastFrame) {
          tag = lastFrame.tag;
          text = lastFrame.innerText !== void 0 ? lastFrame.innerText : text;
        }
        if (options.disallowedTagsMode === "completelyDiscard" && !tagAllowed(tag)) {
          text = "";
        } else if ((options.disallowedTagsMode === "discard" || options.disallowedTagsMode === "completelyDiscard") && (tag === "script" || tag === "style")) {
          result2 += text;
        } else if (!addedText) {
          const escaped = escapeHtml(text, false);
          if (options.textFilter) {
            result2 += options.textFilter(escaped, tag);
          } else {
            result2 += escaped;
          }
        }
        if (stack.length) {
          const frame = stack[stack.length - 1];
          frame.text += text;
        }
      },
      onclosetag: function(name, isImplied) {
        if (options.onCloseTag) {
          options.onCloseTag(name, isImplied);
        }
        if (skipText) {
          skipTextDepth--;
          if (!skipTextDepth) {
            skipText = false;
          } else {
            return;
          }
        }
        const frame = stack.pop();
        if (!frame) {
          return;
        }
        if (frame.tag !== name) {
          stack.push(frame);
          return;
        }
        skipText = options.enforceHtmlBoundary ? name === "html" : false;
        depth--;
        const skip = skipMap[depth];
        if (skip) {
          delete skipMap[depth];
          if (options.disallowedTagsMode === "discard" || options.disallowedTagsMode === "completelyDiscard") {
            frame.updateParentNodeText();
            return;
          }
          tempResult = result2;
          result2 = "";
        }
        if (transformMap[depth]) {
          name = transformMap[depth];
          delete transformMap[depth];
        }
        if (options.exclusiveFilter) {
          const filterResult = options.exclusiveFilter(frame);
          if (filterResult === "excludeTag") {
            if (skip) {
              result2 = tempResult;
              tempResult = "";
            }
            result2 = result2.substring(0, frame.tagPosition) + result2.substring(frame.tagPosition + frame.openingTagLength);
            return;
          } else if (filterResult) {
            result2 = result2.substring(0, frame.tagPosition);
            return;
          }
        }
        frame.updateParentNodeMediaChildren();
        frame.updateParentNodeText();
        if (
          // Already output />
          options.selfClosing.indexOf(name) !== -1 || // Escaped tag, closing tag is implied
          isImplied && !tagAllowed(name) && ["escape", "recursiveEscape"].indexOf(options.disallowedTagsMode) >= 0
        ) {
          if (skip) {
            result2 = tempResult;
            tempResult = "";
          }
          return;
        }
        result2 += "</" + name + ">";
        if (skip) {
          result2 = tempResult + escapeHtml(result2);
          tempResult = "";
        }
        addedText = false;
      }
    }, options.parser);
    parser2.write(html);
    parser2.end();
    if (options.disallowedTagsMode === "escape" || options.disallowedTagsMode === "recursiveEscape") {
      const lastParsedIndex = parser2.endIndex;
      if (lastParsedIndex != null && lastParsedIndex >= 0 && lastParsedIndex < html.length) {
        const unparsed = html.substring(lastParsedIndex);
        result2 += escapeHtml(unparsed);
      } else if ((lastParsedIndex == null || lastParsedIndex < 0) && html.length > 0 && result2 === "") {
        result2 = escapeHtml(html);
      }
    }
    return result2;
    function initializeState() {
      result2 = "";
      depth = 0;
      stack = [];
      skipMap = {};
      transformMap = {};
      skipText = false;
      skipTextDepth = 0;
    }
    function escapeHtml(s, quote) {
      if (typeof s !== "string") {
        s = s + "";
      }
      if (options.parser.decodeEntities) {
        s = s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        if (quote) {
          s = s.replace(/"/g, "&quot;");
        }
      }
      s = s.replace(/&(?![a-zA-Z0-9#]{1,20};)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      if (quote) {
        s = s.replace(/"/g, "&quot;");
      }
      return s;
    }
    function naughtyHref(name, href) {
      href = href.replace(/[\x00-\x20]+/g, "");
      while (true) {
        const firstIndex = href.indexOf("<!--");
        if (firstIndex === -1) {
          break;
        }
        const lastIndex = href.indexOf("-->", firstIndex + 4);
        if (lastIndex === -1) {
          break;
        }
        href = href.substring(0, firstIndex) + href.substring(lastIndex + 3);
      }
      const matches = href.match(/^([a-zA-Z][a-zA-Z0-9.\-+]*):/);
      if (!matches) {
        if (href.match(/^[/\\]{2}/)) {
          return !options.allowProtocolRelative;
        }
        return false;
      }
      const scheme = matches[1].toLowerCase();
      if (has(options.allowedSchemesByTag, name)) {
        return options.allowedSchemesByTag[name].indexOf(scheme) === -1;
      }
      return !options.allowedSchemes || options.allowedSchemes.indexOf(scheme) === -1;
    }
    function parseUrl(value) {
      value = value.replace(/^(\w+:)?\s*[\\/]\s*[\\/]/, "$1//");
      if (value.startsWith("relative:")) {
        throw new Error("relative: exploit attempt");
      }
      let base = "relative://relative-site";
      for (let i = 0; i < 100; i++) {
        base += `/${i}`;
      }
      const parsed = new URL(value, base);
      const isRelativeUrl = parsed && parsed.hostname === "relative-site" && parsed.protocol === "relative:";
      return {
        isRelativeUrl,
        url: parsed
      };
    }
    function filterCss(abstractSyntaxTree, allowedStyles) {
      if (!allowedStyles) {
        return abstractSyntaxTree;
      }
      const astRules = abstractSyntaxTree.nodes[0];
      let selectedRule;
      if (allowedStyles[astRules.selector] && allowedStyles["*"]) {
        selectedRule = deepmerge(
          allowedStyles[astRules.selector],
          allowedStyles["*"]
        );
      } else {
        selectedRule = allowedStyles[astRules.selector] || allowedStyles["*"];
      }
      if (selectedRule) {
        abstractSyntaxTree.nodes[0].nodes = astRules.nodes.reduce(filterDeclarations(selectedRule), []);
      }
      return abstractSyntaxTree;
    }
    function stringifyStyleAttributes(filteredAST) {
      return filteredAST.nodes[0].nodes.reduce(function(extractedAttributes, attrObject) {
        extractedAttributes.push(
          `${attrObject.prop}:${attrObject.value}${attrObject.important ? " !important" : ""}`
        );
        return extractedAttributes;
      }, []).join(";");
    }
    function filterDeclarations(selectedRule) {
      return function(allowedDeclarationsList, attributeObject) {
        if (has(selectedRule, attributeObject.prop)) {
          const matchesRegex = selectedRule[attributeObject.prop].some(function(regularExpression) {
            return regularExpression.test(attributeObject.value);
          });
          if (matchesRegex) {
            allowedDeclarationsList.push(attributeObject);
          }
        }
        return allowedDeclarationsList;
      };
    }
    function filterClasses(classes, allowed, allowedGlobs) {
      if (!allowed) {
        return classes;
      }
      classes = classes.split(/\s+/);
      return classes.filter(function(clss) {
        return allowed.indexOf(clss) !== -1 || allowedGlobs.some(function(glob) {
          return glob.test(clss);
        });
      }).join(" ");
    }
  }
  const htmlParserDefaults = {
    decodeEntities: true
  };
  sanitizeHtml2.defaults = {
    allowedTags: [
      // Sections derived from MDN element categories and limited to the more
      // benign categories.
      // https://developer.mozilla.org/en-US/docs/Web/HTML/Element
      // Content sectioning
      "address",
      "article",
      "aside",
      "footer",
      "header",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "hgroup",
      "main",
      "nav",
      "section",
      // Text content
      "blockquote",
      "dd",
      "div",
      "dl",
      "dt",
      "figcaption",
      "figure",
      "hr",
      "li",
      "menu",
      "ol",
      "p",
      "pre",
      "ul",
      // Inline text semantics
      "a",
      "abbr",
      "b",
      "bdi",
      "bdo",
      "br",
      "cite",
      "code",
      "data",
      "dfn",
      "em",
      "i",
      "kbd",
      "mark",
      "q",
      "rb",
      "rp",
      "rt",
      "rtc",
      "ruby",
      "s",
      "samp",
      "small",
      "span",
      "strong",
      "sub",
      "sup",
      "time",
      "u",
      "var",
      "wbr",
      // Table content
      "caption",
      "col",
      "colgroup",
      "table",
      "tbody",
      "td",
      "tfoot",
      "th",
      "thead",
      "tr"
    ],
    // Tags that cannot be boolean
    nonBooleanAttributes: [
      "abbr",
      "accept",
      "accept-charset",
      "accesskey",
      "action",
      "allow",
      "alt",
      "as",
      "autocapitalize",
      "autocomplete",
      "blocking",
      "charset",
      "cite",
      "class",
      "color",
      "cols",
      "colspan",
      "content",
      "contenteditable",
      "coords",
      "crossorigin",
      "data",
      "datetime",
      "decoding",
      "dir",
      "dirname",
      "download",
      "draggable",
      "enctype",
      "enterkeyhint",
      "fetchpriority",
      "for",
      "form",
      "formaction",
      "formenctype",
      "formmethod",
      "formtarget",
      "headers",
      "height",
      "hidden",
      "high",
      "href",
      "hreflang",
      "http-equiv",
      "id",
      "imagesizes",
      "imagesrcset",
      "inputmode",
      "integrity",
      "is",
      "itemid",
      "itemprop",
      "itemref",
      "itemtype",
      "kind",
      "label",
      "lang",
      "list",
      "loading",
      "low",
      "max",
      "maxlength",
      "media",
      "method",
      "min",
      "minlength",
      "name",
      "nonce",
      "optimum",
      "pattern",
      "ping",
      "placeholder",
      "popover",
      "popovertarget",
      "popovertargetaction",
      "poster",
      "preload",
      "referrerpolicy",
      "rel",
      "rows",
      "rowspan",
      "sandbox",
      "scope",
      "shape",
      "size",
      "sizes",
      "slot",
      "span",
      "spellcheck",
      "src",
      "srcdoc",
      "srclang",
      "srcset",
      "start",
      "step",
      "style",
      "tabindex",
      "target",
      "title",
      "translate",
      "type",
      "usemap",
      "value",
      "width",
      "wrap",
      // Event handlers
      "onauxclick",
      "onafterprint",
      "onbeforematch",
      "onbeforeprint",
      "onbeforeunload",
      "onbeforetoggle",
      "onblur",
      "oncancel",
      "oncanplay",
      "oncanplaythrough",
      "onchange",
      "onclick",
      "onclose",
      "oncontextlost",
      "oncontextmenu",
      "oncontextrestored",
      "oncopy",
      "oncuechange",
      "oncut",
      "ondblclick",
      "ondrag",
      "ondragend",
      "ondragenter",
      "ondragleave",
      "ondragover",
      "ondragstart",
      "ondrop",
      "ondurationchange",
      "onemptied",
      "onended",
      "onerror",
      "onfocus",
      "onformdata",
      "onhashchange",
      "oninput",
      "oninvalid",
      "onkeydown",
      "onkeypress",
      "onkeyup",
      "onlanguagechange",
      "onload",
      "onloadeddata",
      "onloadedmetadata",
      "onloadstart",
      "onmessage",
      "onmessageerror",
      "onmousedown",
      "onmouseenter",
      "onmouseleave",
      "onmousemove",
      "onmouseout",
      "onmouseover",
      "onmouseup",
      "onoffline",
      "ononline",
      "onpagehide",
      "onpageshow",
      "onpaste",
      "onpause",
      "onplay",
      "onplaying",
      "onpopstate",
      "onprogress",
      "onratechange",
      "onreset",
      "onresize",
      "onrejectionhandled",
      "onscroll",
      "onscrollend",
      "onsecuritypolicyviolation",
      "onseeked",
      "onseeking",
      "onselect",
      "onslotchange",
      "onstalled",
      "onstorage",
      "onsubmit",
      "onsuspend",
      "ontimeupdate",
      "ontoggle",
      "onunhandledrejection",
      "onunload",
      "onvolumechange",
      "onwaiting",
      "onwheel"
    ],
    disallowedTagsMode: "discard",
    allowedAttributes: {
      a: ["href", "name", "target"],
      // We don't currently allow img itself by default, but
      // these attributes would make sense if we did.
      img: ["src", "srcset", "alt", "title", "width", "height", "loading"]
    },
    allowedEmptyAttributes: [
      "alt"
    ],
    // Lots of these won't come up by default because we don't allow them
    selfClosing: ["img", "br", "hr", "area", "base", "basefont", "input", "link", "meta"],
    // URL schemes we permit
    allowedSchemes: ["http", "https", "ftp", "mailto", "tel"],
    allowedSchemesByTag: {},
    allowedSchemesAppliedToAttributes: ["href", "src", "cite"],
    allowProtocolRelative: true,
    enforceHtmlBoundary: false,
    parseStyleAttributes: true,
    preserveEscapedAttributes: false
  };
  sanitizeHtml2.simpleTransform = function(newTagName, newAttribs, merge) {
    merge = merge === void 0 ? true : merge;
    newAttribs = newAttribs || {};
    return function(tagName, attribs) {
      let attrib;
      if (merge) {
        for (attrib in newAttribs) {
          attribs[attrib] = newAttribs[attrib];
        }
      } else {
        attribs = newAttribs;
      }
      return {
        tagName: newTagName,
        attribs
      };
    };
  };
  return sanitizeHtml_1;
}
var sanitizeHtmlExports = /* @__PURE__ */ requireSanitizeHtml();
const sanitizeHtml = /* @__PURE__ */ getDefaultExportFromCjs(sanitizeHtmlExports);
function sanitizeContent(html) {
  return sanitizeHtml(html, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, "img", "span", "iframe"],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      "*": ["class", "id", "data-*"],
      iframe: ["src", "width", "height", "frameborder", "allow", "allowfullscreen"],
      img: ["src", "srcset", "alt", "title", "width", "height", "loading"]
    },
    allowedIframeHostnames: ["www.youtube.com", "player.vimeo.com"]
  });
}
const $$Embed = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Embed;
  const { node: node2 } = Astro2.props;
  if (!node2?.url) {
    return null;
  }
  const { url: rawUrl, provider, html, caption } = node2;
  const url = sanitizeHref(rawUrl);
  const YOUTUBE_ID_PATTERN = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const VIMEO_ID_PATTERN = /vimeo\.com\/(\d+)/;
  function getYouTubeId(input2) {
    const match = input2.match(YOUTUBE_ID_PATTERN);
    return match?.[1] || null;
  }
  function getVimeoId(input2) {
    const match = input2.match(VIMEO_ID_PATTERN);
    return match?.[1] || null;
  }
  const youtubeId = getYouTubeId(url);
  const vimeoId = getVimeoId(url);
  const isSelfHostedVideo = provider === "video";
  const isSelfHostedAudio = provider === "audio";
  return renderTemplate`${maybeRenderHead()}<figure class="emdash-embed" data-astro-cid-nkc3q6cn> ${isSelfHostedVideo ? renderTemplate`<div class="emdash-embed-video" data-astro-cid-nkc3q6cn> <video controls preload="metadata" data-astro-cid-nkc3q6cn> <source${addAttribute(url, "src")} data-astro-cid-nkc3q6cn>
Your browser does not support the video element.
</video> </div>` : isSelfHostedAudio ? renderTemplate`<div class="emdash-embed-audio" data-astro-cid-nkc3q6cn> <audio controls preload="metadata" data-astro-cid-nkc3q6cn> <source${addAttribute(url, "src")} data-astro-cid-nkc3q6cn>
Your browser does not support the audio element.
</audio> </div>` : youtubeId ? renderTemplate`<div class="emdash-embed-video" data-astro-cid-nkc3q6cn> <iframe${addAttribute(`https://www.youtube.com/embed/${youtubeId}`, "src")} title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen data-astro-cid-nkc3q6cn></iframe> </div>` : vimeoId ? renderTemplate`<div class="emdash-embed-video" data-astro-cid-nkc3q6cn> <iframe${addAttribute(`https://player.vimeo.com/video/${vimeoId}`, "src")} title="Vimeo video" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen data-astro-cid-nkc3q6cn></iframe> </div>` : html ? renderTemplate`<div class="emdash-embed-html" data-astro-cid-nkc3q6cn>${unescapeHTML(sanitizeContent(html))}</div>` : renderTemplate`<a${addAttribute(url, "href")} target="_blank" rel="noopener noreferrer" data-astro-cid-nkc3q6cn> ${url} </a>`} ${caption && renderTemplate`<figcaption data-astro-cid-nkc3q6cn>${caption}</figcaption>`} </figure>`;
}, "/Users/niko/Documents/github/angkor-cms/packages/core/src/components/Embed.astro", void 0);
const $$Gallery = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Gallery;
  const { node: node2 } = Astro2.props;
  const images = node2?.images ?? [];
  const columns = node2?.columns ?? 3;
  if (!images.length) {
    return null;
  }
  return renderTemplate`${maybeRenderHead()}<div class="emdash-gallery"${addAttribute(`--columns: ${columns}`, "style")} data-astro-cid-htzun2uh> ${images.map((image) => {
    const src = image.asset.url || `/_emdash/api/media/file/${image.asset._ref}`;
    const hasSize = image.width && image.height;
    return renderTemplate`<figure class="emdash-gallery-item" data-astro-cid-htzun2uh> ${hasSize ? renderTemplate`${renderComponent($$result, "AstroImage", $$ResponsiveImage, { "src": src, "alt": image.alt || "", "width": image.width, "height": image.height, "layout": "constrained", "data-astro-cid-htzun2uh": true })}` : renderTemplate`<img${addAttribute(src, "src")}${addAttribute(image.alt || "", "alt")} loading="lazy" decoding="async" data-astro-cid-htzun2uh>`} ${image.caption && renderTemplate`<figcaption data-astro-cid-htzun2uh>${image.caption}</figcaption>`} </figure>`;
  })} </div>`;
}, "/Users/niko/Documents/github/angkor-cms/packages/core/src/components/Gallery.astro", void 0);
const $$Columns = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Columns;
  const { node: node2 } = Astro2.props;
  const columns = node2?.columns ?? [];
  if (!columns.length) {
    return null;
  }
  return renderTemplate`${maybeRenderHead()}<div class="emdash-columns"${addAttribute(`--column-count: ${columns.length}`, "style")} data-astro-cid-eyertc4r> ${columns.map((column) => renderTemplate`<div class="emdash-column"${addAttribute(column.width ? `flex-basis: ${column.width}` : void 0, "style")} data-astro-cid-eyertc4r> ${renderComponent($$result, "PortableText", $$PortableText$1, { "value": column.content, "data-astro-cid-eyertc4r": true })} </div>`)} </div>`;
}, "/Users/niko/Documents/github/angkor-cms/packages/core/src/components/Columns.astro", void 0);
const $$Break = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Break;
  const { node: node2 } = Astro2.props;
  const style = node2?.style || "line";
  return renderTemplate`${style === "dots" ? renderTemplate`${maybeRenderHead()}<div class="emdash-break emdash-break-dots" data-astro-cid-gf326xr2>• • •</div>` : style === "space" ? renderTemplate`<div class="emdash-break emdash-break-space" data-astro-cid-gf326xr2></div>` : renderTemplate`<hr class="emdash-break emdash-break-line" data-astro-cid-gf326xr2>`}`;
}, "/Users/niko/Documents/github/angkor-cms/packages/core/src/components/Break.astro", void 0);
const $$HtmlBlock = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$HtmlBlock;
  const { node: node2 } = Astro2.props;
  if (!node2?.html) {
    return null;
  }
  const sanitized = sanitizeContent(node2.html);
  return renderTemplate`${maybeRenderHead()}<div class="emdash-html-block" data-astro-cid-y6m2b7wh>${unescapeHTML(sanitized)}</div>`;
}, "/Users/niko/Documents/github/angkor-cms/packages/core/src/components/HtmlBlock.astro", void 0);
const $$Table = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Table;
  const { node: node2 } = Astro2.props;
  const rows = node2?.rows ?? [];
  if (!rows.length) {
    return null;
  }
  function renderCellText(content) {
    return content.map((span) => span.text).join("");
  }
  return renderTemplate`${() => {
    const hasHeader = node2?.hasHeaderRow;
    const headerRow = hasHeader ? rows[0] : null;
    const bodyRows = hasHeader ? rows.slice(1) : rows;
    return renderTemplate`${maybeRenderHead()}<div class="emdash-table-wrapper" data-astro-cid-sbsvqamw><table class="emdash-table" data-astro-cid-sbsvqamw>${headerRow && renderTemplate`<thead data-astro-cid-sbsvqamw><tr data-astro-cid-sbsvqamw>${headerRow.cells.map((cell) => renderTemplate`<th data-astro-cid-sbsvqamw>${renderCellText(cell.content)}</th>`)}</tr></thead>`}<tbody data-astro-cid-sbsvqamw>${bodyRows.map((row) => renderTemplate`<tr data-astro-cid-sbsvqamw>${row.cells.map((cell) => {
      const CellTag = cell.isHeader ? "th" : "td";
      return renderTemplate`${renderComponent($$result, "CellTag", CellTag, { "data-astro-cid-sbsvqamw": true }, { "default": ($$result2) => renderTemplate`${renderCellText(cell.content)}` })}`;
    })}</tr>`)}</tbody></table></div>`;
  }}`;
}, "/Users/niko/Documents/github/angkor-cms/packages/core/src/components/Table.astro", void 0);
const $$Button = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Button;
  const { node: node2 } = Astro2.props;
  const { text, url: rawUrl, style = "default" } = node2 ?? {};
  const url = rawUrl ? sanitizeHref(rawUrl) : void 0;
  return renderTemplate`${url ? renderTemplate`${maybeRenderHead()}<a${addAttribute(url, "href")}${addAttribute(["emdash-button", `emdash-button--${style}`], "class:list")} data-astro-cid-gwnya5xu>${text}</a>` : renderTemplate`<span${addAttribute(["emdash-button", `emdash-button--${style}`], "class:list")} data-astro-cid-gwnya5xu>${text}</span>`}`;
}, "/Users/niko/Documents/github/angkor-cms/packages/core/src/components/Button.astro", void 0);
const $$Buttons = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Buttons;
  const { node: node2 } = Astro2.props;
  const { buttons = [], layout = "horizontal" } = node2 ?? {};
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(["emdash-buttons", `emdash-buttons--${layout}`], "class:list")} data-astro-cid-c55laq3n> ${buttons.map((button) => renderTemplate`${renderComponent($$result, "Button", $$Button, { "node": button, "data-astro-cid-c55laq3n": true })}`)} </div>`;
}, "/Users/niko/Documents/github/angkor-cms/packages/core/src/components/Buttons.astro", void 0);
const $$Cover = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Cover;
  const { node: node2 } = Astro2.props;
  const {
    backgroundImage,
    backgroundVideo,
    overlayColor,
    overlayOpacity = 0.5,
    content = [],
    minHeight = "300px",
    alignment = "center"
  } = node2 ?? {};
  const hasBackground = backgroundImage || backgroundVideo;
  const overlayStyle = overlayColor ? `background-color: ${overlayColor}; opacity: ${overlayOpacity};` : `background-color: rgba(0, 0, 0, ${overlayOpacity});`;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(["emdash-cover", `emdash-cover--align-${alignment}`], "class:list")}${addAttribute(`min-height: ${minHeight};`, "style")} data-astro-cid-c5bndana> ${backgroundImage && !backgroundVideo && renderTemplate`<img${addAttribute(backgroundImage, "src")} alt="" class="emdash-cover__background" loading="lazy" data-astro-cid-c5bndana>`} ${backgroundVideo && renderTemplate`<video class="emdash-cover__background emdash-cover__video" autoplay muted loop playsinline data-astro-cid-c5bndana> <source${addAttribute(backgroundVideo, "src")} data-astro-cid-c5bndana> </video>`} ${hasBackground && renderTemplate`<div class="emdash-cover__overlay"${addAttribute(overlayStyle, "style")} data-astro-cid-c5bndana></div>`} <div class="emdash-cover__content" data-astro-cid-c5bndana> ${renderComponent($$result, "PortableText", $$PortableText$1, { "value": content, "data-astro-cid-c5bndana": true })} </div> </div>`;
}, "/Users/niko/Documents/github/angkor-cms/packages/core/src/components/Cover.astro", void 0);
const $$File = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$File;
  const { node: node2 } = Astro2.props;
  const { url: rawUrl, filename, showDownloadButton = true } = node2 ?? {};
  const url = sanitizeHref(rawUrl);
  const displayName = filename || url?.split("/").pop()?.split("?")[0] || "Download";
  return renderTemplate`${maybeRenderHead()}<div class="emdash-file" data-astro-cid-mu22s6cv> <a${addAttribute(url, "href")} class="emdash-file__link"${addAttribute(filename, "download")} data-astro-cid-mu22s6cv> <svg class="emdash-file__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-mu22s6cv> <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" data-astro-cid-mu22s6cv></path> <polyline points="14 2 14 8 20 8" data-astro-cid-mu22s6cv></polyline> </svg> <span class="emdash-file__name" data-astro-cid-mu22s6cv>${displayName}</span> </a> ${showDownloadButton && renderTemplate`<a${addAttribute(url, "href")} class="emdash-file__download"${addAttribute(filename, "download")} aria-label="Download file" data-astro-cid-mu22s6cv> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-mu22s6cv> <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" data-astro-cid-mu22s6cv></path> <polyline points="7 10 12 15 17 10" data-astro-cid-mu22s6cv></polyline> <line x1="12" y1="15" x2="12" y2="3" data-astro-cid-mu22s6cv></line> </svg> </a>`} </div>`;
}, "/Users/niko/Documents/github/angkor-cms/packages/core/src/components/File.astro", void 0);
const $$Pullquote = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Pullquote;
  const { node: node2 } = Astro2.props;
  const { text, citation } = node2 ?? {};
  return renderTemplate`${maybeRenderHead()}<figure class="emdash-pullquote" data-astro-cid-lljkacfi> <blockquote class="emdash-pullquote__text" data-astro-cid-lljkacfi> ${text} </blockquote> ${citation && renderTemplate`<figcaption class="emdash-pullquote__citation" data-astro-cid-lljkacfi>&mdash; ${citation}</figcaption>`} </figure>`;
}, "/Users/niko/Documents/github/angkor-cms/packages/core/src/components/Pullquote.astro", void 0);
const $$Superscript = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<sup>${renderSlot($$result, $$slots["default"])}</sup>`;
}, "/Users/niko/Documents/github/angkor-cms/packages/core/src/components/marks/Superscript.astro", void 0);
const $$Subscript = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<sub>${renderSlot($$result, $$slots["default"])}</sub>`;
}, "/Users/niko/Documents/github/angkor-cms/packages/core/src/components/marks/Subscript.astro", void 0);
const $$Underline = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<u>${renderSlot($$result, $$slots["default"])}</u>`;
}, "/Users/niko/Documents/github/angkor-cms/packages/core/src/components/marks/Underline.astro", void 0);
const $$StrikeThrough = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<s>${renderSlot($$result, $$slots["default"])}</s>`;
}, "/Users/niko/Documents/github/angkor-cms/packages/core/src/components/marks/StrikeThrough.astro", void 0);
const $$Link = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Link;
  const { node: node2 } = Astro2.props;
  const href = sanitizeHref(node2?.markDef?.href);
  const blank = node2?.markDef?.blank;
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(href, "href")}${addAttribute(blank ? "_blank" : void 0, "target")}${addAttribute(blank ? "noopener noreferrer" : void 0, "rel")}> ${renderSlot($$result, $$slots["default"])} </a>`;
}, "/Users/niko/Documents/github/angkor-cms/packages/core/src/components/marks/Link.astro", void 0);
const __vite_import_meta_env__ = { "ASSETS_PREFIX": void 0, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": void 0, "SSR": true };
const SAFE_HREF_RE = /^(https?|at):\/\//i;
const HTML_ESCAPE_MAP = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
const HTML_ESCAPE_RE = /[&<>"']/g;
function escapeHtmlAttr(value) {
  return value.replace(HTML_ESCAPE_RE, (ch) => HTML_ESCAPE_MAP[ch] ?? ch);
}
function isSafeHref(url) {
  return SAFE_HREF_RE.test(url);
}
const JSONLD_LT_RE = /</g;
const JSONLD_GT_RE = />/g;
const JSONLD_U2028_RE = /\u2028/g;
const JSONLD_U2029_RE = /\u2029/g;
function safeJsonLdSerialize(value) {
  return JSON.stringify(value).replace(JSONLD_LT_RE, "\\u003c").replace(JSONLD_GT_RE, "\\u003e").replace(JSONLD_U2028_RE, "\\u2028").replace(JSONLD_U2029_RE, "\\u2029");
}
function resolvePageMetadata(contributions) {
  const result2 = {
    meta: [],
    properties: [],
    links: [],
    jsonld: []
  };
  const seenMeta = /* @__PURE__ */ new Set();
  const seenProperties = /* @__PURE__ */ new Set();
  const seenLinks = /* @__PURE__ */ new Set();
  const seenJsonLd = /* @__PURE__ */ new Set();
  for (const c of contributions) {
    switch (c.kind) {
      case "meta": {
        const dedupeKey = c.key ?? c.name;
        if (seenMeta.has(dedupeKey)) continue;
        seenMeta.add(dedupeKey);
        result2.meta.push({ name: c.name, content: c.content });
        break;
      }
      case "property": {
        const dedupeKey = c.key ?? c.property;
        if (seenProperties.has(dedupeKey)) continue;
        seenProperties.add(dedupeKey);
        result2.properties.push({
          property: c.property,
          content: c.content
        });
        break;
      }
      case "link": {
        if (!isSafeHref(c.href)) {
          if (Object.assign(__vite_import_meta_env__, {})?.DEV) {
            console.warn(
              `[page:metadata] Rejected link contribution with unsafe href scheme: ${c.href}`
            );
          }
          continue;
        }
        if (c.rel === "canonical") {
          if (seenLinks.has("canonical")) continue;
          seenLinks.add("canonical");
        } else {
          const dedupeKey = c.key ?? c.hreflang ?? c.href;
          if (seenLinks.has(dedupeKey)) continue;
          seenLinks.add(dedupeKey);
        }
        result2.links.push({
          rel: c.rel,
          href: c.href,
          ...c.hreflang && { hreflang: c.hreflang }
        });
        break;
      }
      case "jsonld": {
        if (c.id) {
          if (seenJsonLd.has(c.id)) continue;
          seenJsonLd.add(c.id);
        }
        result2.jsonld.push({
          id: c.id,
          json: safeJsonLdSerialize(c.graph)
        });
        break;
      }
    }
  }
  return result2;
}
function renderPageMetadata(metadata) {
  const parts = [];
  for (const m of metadata.meta) {
    parts.push(`<meta name="${escapeHtmlAttr(m.name)}" content="${escapeHtmlAttr(m.content)}">`);
  }
  for (const p of metadata.properties) {
    parts.push(
      `<meta property="${escapeHtmlAttr(p.property)}" content="${escapeHtmlAttr(p.content)}">`
    );
  }
  for (const l of metadata.links) {
    let tag = `<link rel="${escapeHtmlAttr(l.rel)}" href="${escapeHtmlAttr(l.href)}"`;
    if (l.hreflang) {
      tag += ` hreflang="${escapeHtmlAttr(l.hreflang)}"`;
    }
    tag += ">";
    parts.push(tag);
  }
  for (const j of metadata.jsonld) {
    parts.push(`<script type="application/ld+json">${j.json}<\/script>`);
  }
  return parts.join("\n");
}
const SCRIPT_CLOSE_RE = /<\//g;
function resolveFragments(contributions, placement) {
  const filtered = contributions.filter((c) => c.placement === placement);
  const seen = /* @__PURE__ */ new Set();
  const result2 = [];
  for (const c of filtered) {
    if (c.key) {
      const dedupeKey = `key:${c.key}`;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);
    } else if (c.kind === "external-script") {
      const dedupeKey = `src:${c.src}`;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);
    }
    result2.push(c);
  }
  return result2;
}
const EVENT_HANDLER_RE = /^on/i;
function renderAttributes(attrs) {
  return Object.entries(attrs).filter(([k]) => !EVENT_HANDLER_RE.test(k)).map(([k, v]) => ` ${escapeHtmlAttr(k)}="${escapeHtmlAttr(v)}"`).join("");
}
function renderFragment(c) {
  switch (c.kind) {
    case "external-script": {
      let tag = `<script src="${escapeHtmlAttr(c.src)}"`;
      if (c.async) tag += " async";
      if (c.defer) tag += " defer";
      if (c.attributes) tag += renderAttributes(c.attributes);
      tag += "><\/script>";
      return tag;
    }
    case "inline-script": {
      let tag = "<script";
      if (c.attributes) tag += renderAttributes(c.attributes);
      tag += `>${c.code.replace(SCRIPT_CLOSE_RE, "<\\/")}<\/script>`;
      return tag;
    }
    case "html":
      return c.html;
  }
}
function renderFragments(contributions, placement) {
  const resolved = resolveFragments(contributions, placement);
  return resolved.map(renderFragment).join("\n");
}
function cleanJsonLd(obj) {
  const cleaned = {};
  for (const [key2, value] of Object.entries(obj)) {
    if (value !== void 0 && value !== null) {
      if (typeof value === "object" && !Array.isArray(value)) {
        cleaned[key2] = cleanJsonLd(value);
      } else {
        cleaned[key2] = value;
      }
    }
  }
  return cleaned;
}
function buildBlogPostingJsonLd(page) {
  if (page.pageType !== "article" || !page.canonical) return null;
  const ogTitle = page.seo?.ogTitle || page.title;
  const description = page.seo?.ogDescription || page.description;
  const ogImage = page.seo?.ogImage || page.image;
  const publishedTime = page.articleMeta?.publishedTime;
  const modifiedTime = page.articleMeta?.modifiedTime;
  const author = page.articleMeta?.author;
  const siteName = page.siteName;
  return cleanJsonLd({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: ogTitle,
    description,
    image: ogImage || void 0,
    url: page.canonical,
    datePublished: publishedTime || void 0,
    dateModified: modifiedTime || publishedTime || void 0,
    author: author ? {
      "@type": "Person",
      name: author
    } : void 0,
    publisher: siteName ? {
      "@type": "Organization",
      name: siteName
    } : void 0,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": page.canonical
    }
  });
}
function buildWebSiteJsonLd(page) {
  const siteName = page.siteName;
  if (!siteName) return null;
  let siteUrl;
  try {
    siteUrl = new URL(page.url).origin;
  } catch {
    siteUrl = page.canonical || page.url;
  }
  return cleanJsonLd({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl
  });
}
function generateBaseSeoContributions(page) {
  const contributions = [];
  const description = page.description;
  const ogTitle = page.seo?.ogTitle || page.title;
  const ogDescription = page.seo?.ogDescription || description;
  const ogImage = page.seo?.ogImage || page.image;
  const robots = page.seo?.robots;
  const canonical = page.canonical;
  const siteName = page.siteName;
  if (description) {
    contributions.push({ kind: "meta", name: "description", content: description });
  }
  if (robots) {
    contributions.push({ kind: "meta", name: "robots", content: robots });
  }
  if (canonical) {
    contributions.push({ kind: "link", rel: "canonical", href: canonical });
  }
  contributions.push({
    kind: "property",
    property: "og:type",
    content: page.pageType === "article" ? "article" : "website"
  });
  if (ogTitle) {
    contributions.push({ kind: "property", property: "og:title", content: ogTitle });
  }
  if (ogDescription) {
    contributions.push({ kind: "property", property: "og:description", content: ogDescription });
  }
  if (ogImage) {
    contributions.push({ kind: "property", property: "og:image", content: ogImage });
  }
  if (canonical) {
    contributions.push({ kind: "property", property: "og:url", content: canonical });
  }
  if (siteName) {
    contributions.push({ kind: "property", property: "og:site_name", content: siteName });
  }
  contributions.push({
    kind: "meta",
    name: "twitter:card",
    content: ogImage ? "summary_large_image" : "summary"
  });
  if (ogTitle) {
    contributions.push({ kind: "meta", name: "twitter:title", content: ogTitle });
  }
  if (ogDescription) {
    contributions.push({ kind: "meta", name: "twitter:description", content: ogDescription });
  }
  if (ogImage) {
    contributions.push({ kind: "meta", name: "twitter:image", content: ogImage });
  }
  if (page.pageType === "article" && page.articleMeta) {
    const { publishedTime, modifiedTime, author } = page.articleMeta;
    if (publishedTime) {
      contributions.push({
        kind: "property",
        property: "article:published_time",
        content: publishedTime
      });
    }
    if (modifiedTime) {
      contributions.push({
        kind: "property",
        property: "article:modified_time",
        content: modifiedTime
      });
    }
    if (author) {
      contributions.push({
        kind: "property",
        property: "article:author",
        content: author
      });
    }
  }
  if (page.pageType === "article") {
    const blogPosting = buildBlogPostingJsonLd(page);
    if (blogPosting) {
      contributions.push({ kind: "jsonld", id: "primary", graph: blogPosting });
    }
  } else if (siteName) {
    const webSite = buildWebSiteJsonLd(page);
    if (webSite) {
      contributions.push({ kind: "jsonld", id: "primary", graph: webSite });
    }
  }
  return contributions;
}
function getPageRuntime(locals) {
  const emdash = locals.emdash;
  if (emdash && typeof emdash === "object" && "collectPageMetadata" in emdash && "collectPageFragments" in emdash) {
    return emdash;
  }
  return void 0;
}
const $$EmDashHead = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$EmDashHead;
  const { page } = Astro2.props;
  const runtime = getPageRuntime(Astro2.locals);
  const baseContributions = generateBaseSeoContributions(page);
  let metadataHtml = "";
  let fragmentsHtml = "";
  if (runtime) {
    const pluginContributions = await runtime.collectPageMetadata(page);
    const allContributions = [...pluginContributions, ...baseContributions];
    const resolved = resolvePageMetadata(allContributions);
    metadataHtml = renderPageMetadata(resolved);
    const fragments = await runtime.collectPageFragments(page);
    fragmentsHtml = renderFragments(fragments, "head");
  } else {
    const resolved = resolvePageMetadata(baseContributions);
    metadataHtml = renderPageMetadata(resolved);
  }
  return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result2) => renderTemplate`${unescapeHTML(metadataHtml)}` })}${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result2) => renderTemplate`${unescapeHTML(fragmentsHtml)}` })}`;
}, "/Users/niko/Documents/github/angkor-cms/packages/core/src/components/EmDashHead.astro", void 0);
const $$EmDashBodyStart = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$EmDashBodyStart;
  const { page } = Astro2.props;
  const runtime = getPageRuntime(Astro2.locals);
  let html = "";
  if (runtime) {
    const contributions = await runtime.collectPageFragments(page);
    html = renderFragments(contributions, "body:start");
  }
  return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result2) => renderTemplate`${unescapeHTML(html)}` })}`;
}, "/Users/niko/Documents/github/angkor-cms/packages/core/src/components/EmDashBodyStart.astro", void 0);
const $$EmDashBodyEnd = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$EmDashBodyEnd;
  const { page } = Astro2.props;
  const runtime = getPageRuntime(Astro2.locals);
  let html = "";
  if (runtime) {
    const contributions = await runtime.collectPageFragments(page);
    html = renderFragments(contributions, "body:end");
  }
  return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result2) => renderTemplate`${unescapeHTML(html)}` })}`;
}, "/Users/niko/Documents/github/angkor-cms/packages/core/src/components/EmDashBodyEnd.astro", void 0);
const emdashComponents = {
  type: {
    image: $$Image,
    code: $$Code,
    embed: $$Embed,
    gallery: $$Gallery,
    columns: $$Columns,
    break: $$Break,
    htmlBlock: $$HtmlBlock,
    table: $$Table,
    button: $$Button,
    buttons: $$Buttons,
    cover: $$Cover,
    file: $$File,
    pullquote: $$Pullquote
  },
  mark: {
    superscript: $$Superscript,
    subscript: $$Subscript,
    underline: $$Underline,
    "strike-through": $$StrikeThrough,
    link: $$Link
  }
};
function isAstroInput(input2) {
  return "Astro" in input2;
}
function createPublicPageContext(input2) {
  let url;
  let path;
  let locale;
  if (isAstroInput(input2)) {
    url = input2.Astro.url.href;
    path = input2.Astro.url.pathname;
    locale = input2.Astro.currentLocale ?? null;
  } else {
    const parsed = typeof input2.url === "string" ? new URL(input2.url) : input2.url;
    url = parsed.href;
    path = parsed.pathname;
    locale = input2.locale ?? null;
  }
  return {
    url,
    path,
    locale,
    kind: input2.kind,
    pageType: input2.pageType ?? (input2.kind === "content" ? "article" : "website"),
    title: input2.title ?? null,
    description: input2.description ?? null,
    canonical: input2.canonical ?? null,
    image: input2.image ?? null,
    content: input2.content ? {
      collection: input2.content.collection,
      id: input2.content.id,
      slug: input2.content.slug ?? null
    } : void 0,
    seo: input2.seo,
    articleMeta: input2.articleMeta,
    siteName: input2.siteName
  };
}
const $$LiveSearch = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$LiveSearch;
  const {
    placeholder = "Search...",
    collections,
    minChars = 2,
    debounce = 300,
    limit = 10,
    class: className = "",
    inputClass = "",
    resultsClass = "",
    resultClass = "",
    showSnippets = true,
    autofocus = false,
    suggestMode = false,
    expandOnFocus
  } = Astro2.props;
  const config = {
    collections: collections?.join(",") ?? "",
    minChars,
    debounce,
    limit,
    showSnippets,
    suggestMode,
    expandOnFocus: expandOnFocus ?? null
  };
  return renderTemplate`${renderComponent($$result, "emdash-live-search", "emdash-live-search", { "class:list": ["emdash-live-search", className], "data-config": JSON.stringify(config), "data-astro-cid-j2amey3n": true }, { "default": () => renderTemplate` ${maybeRenderHead()}<input type="search"${addAttribute(placeholder, "placeholder")}${addAttribute(["emdash-live-search-input", inputClass], "class:list")} autocomplete="off"${addAttribute(autofocus, "autofocus")} data-astro-cid-j2amey3n> <div${addAttribute(["emdash-live-search-results", resultsClass], "class:list")} hidden data-astro-cid-j2amey3n> ${renderSlot($$result, $$slots["loading"], renderTemplate` <div class="emdash-live-search-loading" data-astro-cid-j2amey3n>Searching...</div> `)} ${renderSlot($$result, $$slots["no-results"], renderTemplate` <div class="emdash-live-search-no-results" data-astro-cid-j2amey3n>No results found</div> `)} <template class="emdash-live-search-result-template" data-astro-cid-j2amey3n> ${renderSlot($$result, $$slots["result"], renderTemplate` <a${addAttribute(["emdash-live-search-result", resultClass], "class:list")} href="" data-astro-cid-j2amey3n> <span class="emdash-live-search-result-title" data-astro-cid-j2amey3n></span> <span class="emdash-live-search-result-collection" data-astro-cid-j2amey3n></span> <span class="emdash-live-search-result-snippet" data-astro-cid-j2amey3n></span> </a> `)} </template> <div class="emdash-live-search-results-list" data-astro-cid-j2amey3n></div> </div> ` })} ${renderScript($$result, "/Users/niko/Documents/github/angkor-cms/packages/core/src/components/LiveSearch.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/niko/Documents/github/angkor-cms/packages/core/src/components/LiveSearch.astro", void 0);
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Base = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Base;
  const {
    title,
    description,
    image,
    canonical,
    robots,
    type = "website",
    publishedTime,
    modifiedTime,
    author,
    content
  } = Astro2.props;
  const siteTitle = "Token Press";
  const fullTitle = title.includes(siteTitle) ? title : `${title} — ${siteTitle}`;
  let menu = await getMenu$1("primary");
  if (!menu?.items?.length) menu = await getMenu$1("main");
  if (!menu?.items?.length) menu = await getMenu$1("primary-navigation");
  const { entries: pages } = await getEmDashCollection$1("pages");
  const pageCtx = createPublicPageContext({
    Astro: Astro2,
    kind: content ? "content" : "custom",
    pageType: type,
    title: fullTitle,
    description,
    canonical,
    image,
    content,
    seo: { ogImage: image, robots },
    articleMeta: { publishedTime, modifiedTime, author },
    siteName: siteTitle
  });
  const isLoggedIn = !!Astro2.locals.user;
  return renderTemplate(_a || (_a = __template(['<html lang="en" data-astro-cid-5hce7sga> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"><title>', '</title><link rel="icon" type="image/svg+xml" href="/angkor-ai-favicon.svg">', '<script>\n			// Apply theme immediately to prevent flash\n			(function () {\n				var c = document.cookie;\n				var i = c.indexOf("theme=");\n				var theme = i >= 0 ? c.slice(i + 6).split(";")[0] : null;\n				if (theme === "dark" || theme === "light") {\n					document.documentElement.classList.add(theme);\n				} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {\n					document.documentElement.classList.add("dark");\n				}\n			})();\n		<\/script>', "</head> <body data-astro-cid-5hce7sga> ", ' <header class="site-header" data-astro-cid-5hce7sga> <nav class="nav" data-astro-cid-5hce7sga> <a href="/" class="site-logo"', ' data-astro-cid-5hce7sga> <img src="/angkor-ai-logo.svg"', ' height="36" width="36" data-astro-cid-5hce7sga> <span class="site-logo-text" data-astro-cid-5hce7sga>', '</span> </a> <div class="nav-right" data-astro-cid-5hce7sga> ', ' <div class="nav-links" data-astro-cid-5hce7sga> ', " </div> ", " </div> </nav> </header> <main data-astro-cid-5hce7sga> ", ' </main> <footer class="site-footer" data-astro-cid-5hce7sga> <div class="footer-inner" data-astro-cid-5hce7sga> <div class="footer-grid" data-astro-cid-5hce7sga> <div class="footer-brand" data-astro-cid-5hce7sga> <a href="/" class="footer-logo"', ' data-astro-cid-5hce7sga> <img src="/angkor-ai-logo.svg"', ' height="40" width="40" data-astro-cid-5hce7sga> <span data-astro-cid-5hce7sga>', '</span> </a> <p class="footer-tagline" data-astro-cid-5hce7sga>Insights on AI, technology and innovation.</p> </div> <div class="footer-nav" data-astro-cid-5hce7sga> <h4 class="footer-heading" data-astro-cid-5hce7sga>Navigate</h4> <ul class="footer-links" data-astro-cid-5hce7sga> <li data-astro-cid-5hce7sga><a href="/" data-astro-cid-5hce7sga>Home</a></li> <li data-astro-cid-5hce7sga><a href="/posts" data-astro-cid-5hce7sga>All Posts</a></li> ', ' </ul> </div> <div class="footer-nav" data-astro-cid-5hce7sga> <h4 class="footer-heading" data-astro-cid-5hce7sga>Connect</h4> <ul class="footer-links" data-astro-cid-5hce7sga> ', ' <li data-astro-cid-5hce7sga><a href="/rss.xml" data-astro-cid-5hce7sga>RSS Feed</a></li> </ul> </div> <div class="footer-widgets-section" data-astro-cid-5hce7sga> ', ' </div> </div> <div class="footer-bottom" data-astro-cid-5hce7sga> <p class="footer-copyright" data-astro-cid-5hce7sga>\nPowered by <a href="https://angkorai.com" data-astro-cid-5hce7sga>Token Press</a> by Angkor AI\n</p> <div class="theme-switcher" data-astro-cid-5hce7sga> <button type="button" class="theme-btn" data-theme="light" aria-label="Light mode" data-astro-cid-5hce7sga> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-5hce7sga><circle cx="12" cy="12" r="5" data-astro-cid-5hce7sga></circle><line x1="12" y1="1" x2="12" y2="3" data-astro-cid-5hce7sga></line><line x1="12" y1="21" x2="12" y2="23" data-astro-cid-5hce7sga></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" data-astro-cid-5hce7sga></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" data-astro-cid-5hce7sga></line><line x1="1" y1="12" x2="3" y2="12" data-astro-cid-5hce7sga></line><line x1="21" y1="12" x2="23" y2="12" data-astro-cid-5hce7sga></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" data-astro-cid-5hce7sga></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" data-astro-cid-5hce7sga></line></svg> </button> <button type="button" class="theme-btn" data-theme="dark" aria-label="Dark mode" data-astro-cid-5hce7sga> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-5hce7sga><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" data-astro-cid-5hce7sga></path></svg> </button> <button type="button" class="theme-btn" data-theme="system" aria-label="System theme" data-astro-cid-5hce7sga> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-5hce7sga><rect x="2" y="3" width="20" height="14" rx="2" ry="2" data-astro-cid-5hce7sga></rect><line x1="8" y1="21" x2="16" y2="21" data-astro-cid-5hce7sga></line><line x1="12" y1="17" x2="12" y2="21" data-astro-cid-5hce7sga></line></svg> </button> </div> </div> </div> </footer> ', "   ", " ", " </body></html>"])), fullTitle, renderComponent($$result, "EmDashHead", $$EmDashHead, { "page": pageCtx, "data-astro-cid-5hce7sga": true }), renderHead(), renderComponent($$result, "EmDashBodyStart", $$EmDashBodyStart, { "page": pageCtx, "data-astro-cid-5hce7sga": true }), addAttribute(siteTitle, "aria-label"), addAttribute(siteTitle, "alt"), siteTitle, renderComponent($$result, "LiveSearch", $$LiveSearch, { "placeholder": "Search...", "class": "site-search", "inputClass": "site-search-input", "resultsClass": "site-search-results", "resultClass": "site-search-result", "collections": ["posts", "pages"], "data-astro-cid-5hce7sga": true }), menu?.items.map((item) => renderTemplate`<a${addAttribute(item.url, "href")}${addAttribute(item.target, "target")} data-astro-cid-5hce7sga> ${item.label} </a>`), isLoggedIn && renderTemplate`<a href="/_emdash/admin" class="nav-admin" data-astro-cid-5hce7sga>
Admin
</a>`, renderSlot($$result, $$slots["default"]), addAttribute(siteTitle, "aria-label"), addAttribute(siteTitle, "alt"), siteTitle, pages.slice(0, 3).map((page) => renderTemplate`<li data-astro-cid-5hce7sga> <a${addAttribute(`/pages/${page.data.slug || page.id}`, "href")} data-astro-cid-5hce7sga> ${page.data.title} </a> </li>`), menu?.items.map((item) => renderTemplate`<li data-astro-cid-5hce7sga> <a${addAttribute(item.url, "href")}${addAttribute(item.target, "target")}${addAttribute(
    item.target === "_blank" ? "noopener noreferrer" : void 0,
    "rel"
  )} data-astro-cid-5hce7sga> ${item.label} </a> </li>`), renderComponent($$result, "WidgetArea", $$WidgetArea, { "name": "footer", "data-astro-cid-5hce7sga": true }), renderScript($$result, "/Users/niko/Documents/github/angkor-cms/templates/token-press-starter/src/layouts/Base.astro?astro&type=script&index=0&lang.ts"), renderScript($$result, "/Users/niko/Documents/github/angkor-cms/templates/token-press-starter/src/layouts/Base.astro?astro&type=script&index=1&lang.ts"), renderComponent($$result, "EmDashBodyEnd", $$EmDashBodyEnd, { "page": pageCtx, "data-astro-cid-5hce7sga": true }));
}, "/Users/niko/Documents/github/angkor-cms/templates/token-press-starter/src/layouts/Base.astro", void 0);
export {
  $$EmDashImage as $,
  $$Base as a,
  $$PortableText as b,
  $$Comments as c,
  $$CommentForm as d,
  $$WidgetArea as e,
  getDb as g,
  renderScript as r
};
