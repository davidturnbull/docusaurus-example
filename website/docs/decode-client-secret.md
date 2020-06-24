---
title: "Decoding a client secret"
sidebar_label: "Decode a client secret"
path: /decode-client-secret/
---

Before an extension can generate a request signature, it must decode the app's client secret from a base64url-encoded string into a byte array.

This page demonstrates how to decode a client secret in the following languages:

- [Go {#go}](#go-go)
- [Java {#java}](#java-java)
- [JavaScript {#javascript}](#javascript-javascript)
- [PHP {#php}](#php-php)
- [Python {#python}](#python-python)
- [Ruby {#ruby}](#ruby-ruby)
- [TypeScript {#typescript}](#typescript-typescript)

:::note  
 base64url encoding is _not_ the same thing as base64 encoding. The differences are explained in [this StackOverflow answer](https://stackoverflow.com/a/55389212/13227683).  
:::

## Go {#go}

```go
package main

import (
    b64 "encoding/base64"
    "fmt"
    "log"
)

func main() {
    secret := "CLIENT SECRET GOES HERE"
    key, error := := b64.URLEncoding.DecodeString(secret)

    if error != nil {
        log.Fatal(error)
    }

    fmt.Println(key)
}
```

## Java {#java}

```java
import java.util.Base64;

public class Example {
    public static void main(String[] args) {
        String secret = "CLIENT SECRET GOES HERE";
        byte[] key = Base64.getUrlDecoder().decode(secret);
        System.out.println(key);
    }
}
```

## JavaScript {#javascript}

```javascript
const secret = "CLIENT SECRET GOES HERE";
const key = Buffer.from(secret.replace("-", "+").replace("_", "/"), "base64");
console.log(key);
```

## PHP {#php}

```php
$secret = "CLIENT SECRET GOES HERE";
$key = base64_decode(strtr($secret, '-_', '+/'));
echo($key);
```

## Python {#python}

```python
import base64
secret = "CLIENT SECRET GOES HERE"
key = base64.urlsafe_b64decode(secret)
print(key)
```

## Ruby {#ruby}

```ruby
require "base64"
secret = "CLIENT SECRET GOES HERE"
key = Base64.decode64(secret.tr('-_','+/'))
puts key
```

## TypeScript {#typescript}

```javascript
const secret = "CLIENT SECRET GOES HERE";
const key = Buffer.from(secret.replace("-", "+").replace("_", "/"), "base64");
console.log(key);
```
