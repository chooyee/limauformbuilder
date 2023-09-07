export class BaseControl {
    constructor() {        
    }

    createElement(tagName, { attrs = {}, children = [] } = {}) {
        return {
            tagName,
            attrs,
            children,
        };
    }

    renderElem({ tagName, attrs, children }) {
        const el = document.createElement(tagName);

        for (const [k, v] of Object.entries(attrs)) {
            el.setAttribute(k, v);
        }

        for (const child of children) {
            el.appendChild(this.render(child));
        }
        return el;
    }

    render(vNode) {
        if (typeof vNode === 'string') {
            return document.createTextNode(vNode);
        }
        return this.renderElem(vNode);
    }

    buildElement() {
        throw new Error("Subclasses must implement the 'buildElement' method.");
    }

    mount(target) {
        target.replaceWith(this.element);
        return this.element;
    }
}