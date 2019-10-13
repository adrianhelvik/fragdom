# @adrianhelvik/fragdom
Fragdom is a thin wrapper around the DOM that adds fragment nodes.
It is implemented in preparation for a virtual DOM library.

The idea is that you should be able to replace usage of the real DOM
with this library and get the addition of fragment nodes.

With normal DOM, you can create document fragments, but these do not
become child nodes of an element they are inserted into. Instead
the child nodes are moved to the new element.

So the core difference with Fragdom is that you get
`document.createFragment()`.

*Note: The DOM is not extended in any way. You must manually
create a Fragdom document*

## Some differences from the real DOM

### Reconciliation
To persist DOM updates, you must call `.reconcile()` on the element.
This reconciles all child nodes as well.

If you want the DOM updates to be applied in the next animation frame,
you can call `.reconcileAsync()`.

### Retrieving real DOM nodes
You can access the real DOM node by using the `.realNode` getter on
Element and Text. On fragment nodes, realNode is an array.

If the node has not been reconciled, accessing this property throws
an error.

### Instance attributes
When setAttribute or removeAttribute is called with a key
beginning with `$`, it is considered an instance attribute.

This is to simplify reconciliation of instance attributes.

# Plan
- [x] Implementation
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
    - [x] .reconcileAsync()
  - [x] Fragment.prototype
    - [x] .reconcile()
    - [x] .realNode
    - [x] .reconcileAsync()
  - [x] Text.prototype
    - [x] .reconcile()
    - [x] .realNode
    - [x] .reconcileAsync()
- [ ] Review
  - [ ] Review exposed API. Are more methods needed?
  - [ ] Review #dirty conditions for Fragment agains API
  - [ ] Review error conditions
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
