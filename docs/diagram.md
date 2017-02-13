# Diagramming Search Results

To support exploration and understanding use-cases, diagram mode can be used.
The server does a more expansive search, providing the client with more context
to work with.  The client then processes the extra results in a web worker,
creating a graphviz "dot" file, then uses viz.js to render it into an SVG which
is sent back to the page to display.

## Expanded Search

THIS BIT IS CURRENTLY A LIE.

When a "default" search is performed, two things happen:
1. A livegrep fulltext codesearch is performed, providing the "Textual
   Occurrences" results that come last.
2. An identifier search is performed.  First, the "identifiers" data-set is
   binary-searched to locate identifiers that start with the search string.
   This means that a search string of "Window" may be expanded to include
   "WindowEvent", but it will not find "FireWindowEvent".  (Note that there is a
   limit of 5 identifier matches returned to avoid pathological cases where the
   search string is a very common identifier prefix.)  Then the identifiers are
   looked up in the "crossrefs" data-set which provides the more structured
   uses/definitions/etc. results as well as the context in which they occur.

Expanded search processes the fulltext results in an attempt fo find other
identifiers that contain the search string.  For example, if you search for
"pageshow", the textual results may also include "FirePageShowEvent" which the
identifier search won't have found.  Expanded search will run identifier
searches for the extra tokens it finds and return those as well.

Instead of extracting the expanded tokens from the codesearch results, the
identifiers format could be converted to a suffix-tree or similar
representation.  However, that's not trivial to do and livegrep is arguably
doing a lot of that work for us already.

## The Diagram

General approach:
* Cluster references within a single class into a record-style table.
* Show "uses" relationships via edges.
* Maybe: use sub-graphs to cluster classes according to the file-system
  hierarchy.
