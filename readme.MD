In summary, recursive algorithms, while elegant may incur a nonobvious performance penalty.

Within this project you will find two different, seemingly similar, implementations of a utility method to convert JSON keys to camel case from CapCase or snake_case.

Performance of the two implementations is reasonably similar. Memory footprint is drastically different as follows:

{ implementation: 'toCamelCaseRecursive',
  milliseconds: 320,
  memory: '3.90 mb',
  result: 'success',
  kTPS: 187 }
{ implementation: 'toCamelCaseStackImpl',
  milliseconds: 269,
  memory: '216.77 kb',
  result: 'success',
  kTPS: 223 }
