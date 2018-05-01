# RasBUS

A wrapper lib for known `i2c` and `spi` implementations.

Presenting a single API for each type that is Promise based.

## Motivation

A wide range of libs exist and each have unique qualities.  

Thus, an agnostic api is needed to abstract and experiment with each api.
Once unified, this api should be promise based.

This allows for testing the implementations robustness and other qualities, 
but also to test higher level code against a wide set of known libs.  
Allowing for high level code to guard against specific implementation bug / quirks.

### `byname(name)`

static method will return each implementation by npm name (with or without dashes)

### `names(type)`

static method returns all known bus implementation names (filtered by type).  Usefull for command line auto complete of bus names etc.
