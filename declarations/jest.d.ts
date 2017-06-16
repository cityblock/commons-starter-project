// Definitely typed hasn't been updated for jest 20.0.0+ yet, so we're missing some fancy matchers
declare namespace jest {
  interface Matchers {
    resolves: Matchers;
    rejects: Matchers;
  }
}
