# Abstract
Fragdom is a thin wrapper around the DOM that adds fragment nodes.
It is implemented in preparation for a virtual DOM library.

The idea is that this should be able to be a replacement for the
real DOM in virtual DOM implementations. Thus the API is a subset
of the real DOM API.

## Some differences from the real DOM

### Reconciliation
To persist DOM updates, you must call `.reconcile()` on the element.
This reconciles all child nodes as well.

If you want the DOM updates to be applied in the next animation frame,
you can call `.reconcileAsync()`.

### Retrieving real DOM nodes
You can access the real DOM node by using the `.realNode` getter on
Element and Text. On fragment nodes, realNode is an array.

If the node has not been reconsiled, accessing this property throws
an error.

### Instance attributes
When setAttribute or removeAttribute is called with a key
beginning with `$`, it is considered an instance attribute.

This is to simplify reconsiliation of instance attributes.

# Plan
- [ ] Implementation
  - [x] Node.prototype
    - [x] .appendChild(node)
    - [x] .removeChild(node)
    - [x] .contains(node)
    - [x] .remove()
    - [x] .realNode
  - [x] Element.prototype
    - [x] .setAttribute(key, value)
    - [x] .removeAttribute(key)
    - [x] .reconcile()
    - [x] .realNode
    - [ ] .asyncReconcile()
  - [x] Fragment.prototype
    - [x] .reconcile()
    - [x] .realNode
    - [ ] .asyncReconcile()
  - [ ] Text.prototype
    - [ ] .reconcile()
    - [ ] .realNode
    - [ ] .asyncReconcile()
- [ ] Review
  - [ ] Review exposed API. Are more methods needed?
  - [ ] Review #dirty conditions for Fragment agains API
- [ ] Documentation
  - [ ] Node.prototype
    - [ ] .appendChild(node)
    - [ ] .removeChild(node)
    - [ ] .contains(node)
    - [ ] .remove()
    - [ ] .realNode
  - [ ] Element.prototype
    - [ ] .reconcile()
    - [ ] .realNode
  - [ ] Fragment.prototype
    - [ ] .reconcile()
    - [ ] .realNode
  - [ ] Text.prototype
    - [ ] .reconcile()
    - [ ] .realNode
- [ ] Publish to NPM
