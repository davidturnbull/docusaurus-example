---
title: "Verifying timestamps"
sidebar_label: "Verify timestamp"
path: /verify-timestamp/
---

When Canva sends an HTTP request to an app, it includes a UNIX timestamp (in seconds) of when the request was sent. In a `POST` request, the timestamp is available via the `X-Canva-Timestamp` HTTP header. In a `GET` request, the timestamp is available via the `time` query parameter.

Your app is expected to:

1.  Compare the timestamp of when the request was sent with when it was received.
2.  Verify that the timestamps are within 5 minutes (300 seconds) of one another.

When the timestamps are _not_ within 5 minutes of one another, the app should reject the request by returning a `401` status code.

:::note  
 The leniency of 5 minutes allows for the fact that requests are not instantaneous and server clocks may not be synchronized.  
:::

## Step 1: Create a function

You need to verify the timestamp of any request that arrives from Canva, so it makes sense to encapsulate the logic in a reusable function:

```javascript
function verifyTimestamp(sentAtSeconds, receivedAtSeconds) {
  // code goes here
}
```

This function accepts two arguments:

- The timestamp of when the request was sent
- The timestamp of when the request was received

## Step 2: Check if the "received at" timestamp is too far in the future

Subtract the `receivedAtSeconds` timestamp from the `sentAtSeconds` timestamp. If the result is greater than `300`, the `receivedAtSeconds` timestamp is more than 300 seconds ahead of the `sentAtSeconds` timestamp:

```javascript
function verifyTimestamp(sentAtSeconds, receivedAtSeconds) {
  // The timestamp is too far in the future
  if (sentAtSeconds - receivedAtSeconds > 300) {
    return false;
  }
}
```

## Step 3: Check if the "received at" timestamp is too far in the past

Subtract the `sentAtSeconds` timestamp from the `receivedAtSeconds` timestamp. If the result is greater than `300`, the `receivedAtSeconds` timestamp is more than 300 seconds before the `sentAtSeconds` timestamp:

```javascript
function verifyTimestamp(sentAtSeconds, receivedAtSeconds) {
  // The timestamp is too far in the future
  if (sentAtSeconds - receivedAtSeconds > 300) {
    return false;
  }

  // The timestamp is too far in the past
  if (receivedAtSeconds - sentAtSeconds > 300) {
    return false;
  }
}
```

## Step 4: Handle valid timestamps

If neither of the previous conditions are `true`, the timestamp is valid:

```javascript
function verifyTimestamp(sentAtSeconds, receivedAtSeconds) {
  // The timestamp is too far in the future
  if (sentAtSeconds - receivedAtSeconds > 300) {
    return false;
  }

  // The timestamp is too far in the past
  if (receivedAtSeconds - sentAtSeconds > 300) {
    return false;
  }

  // The timestamp is valid
  return true;
}
```

## Step 5: Refactor the function

To make the function more flexible, replace the hard-coded value of `300` with a `leniencyInSeconds` parameter:

```javascript
function verifyTimestamp(
  sentAtSeconds,
  receivedAtSeconds,
  leniencyInSeconds = 300
) {
  // The timestamp is too far in the future
  if (sentAtSeconds - receivedAtSeconds > leniencyInSeconds) {
    return false;
  }

  // The timestamp is too far in the past
  if (receivedAtSeconds - sentAtSeconds > leniencyInSeconds) {
    return false;
  }

  // The timestamp is valid
  return true;
}
```

You can also communicate the same logic in fewer lines by converting the result of the substraction into an absolute (positive) value and checking if the result is _less than_ the value of `leniencyInSeconds`:

```javascript
function verifyTimestamp(
  sentAtSeconds,
  receivedAtSeconds,
  leniencyInSeconds = 300
) {
  return Math.abs(sentAtSeconds - receivedAtSeconds) < leniencyInSeconds;
}
```

## Step 6: Use the function

This code snippet demonstrates how to use the function with Express.js to verify timestamps:

```javascript
const express = require("express");
const app = express();

function verifyTimestamp(
  sentAtSeconds,
  receivedAtSeconds,
  leniencyInSeconds = 300
) {
  return Math.abs(sentAtSeconds - receivedAtSeconds) < leniencyInSeconds;
}

app.use(express.json());

app.post("/content/resources/find", async (request, response) => {
  // Get the timestamps
  const sentAtSeconds = Number(request.headers["X-Canva-Timestamp"]);
  const receivedAtSeconds = new Date().getTime() / 1000;

  // Verify the timestamp of a POST request
  if (!verifyTimestamp(sentAtSeconds, receivedAtSeconds)) {
    console.log("The timestamp is NOT valid");
    response.sendStatus(401);
  }

  console.log("The timestamp is valid");
});

app.get("/my-redirect-url", async (request, response) => {
  // Get the timestamps
  const sentAtSeconds = Number(request.params.time);
  const receivedAtSeconds = new Date().getTime() / 1000;

  // Verify the timestamp of a GET request
  if (!verifyTimestamp(sentAtSeconds, receivedAtSeconds)) {
    console.log("The timestamp is NOT valid");
    response.sendStatus(401);
  }

  console.log("The timestamp is valid");
});

app.listen(process.env.PORT || 3000);
```

:::note  
 You must convert the timestamps from strings into numbers before passing them into the `verifyTimestamp` function.  
:::

## Examples

This section provides functions and test data for verifying timestamps in the following languages:

- [Go](#go)
- [Java](#java)
- [JavaScript](#javascript)
- [PHP](#php)
- [Python](#python)
- [Ruby](#ruby)
- [TypeScript](#typescript)

:::note  
 These examples only demonstrate how to verify timestamps. Your app also needs to [verify the signature](./verify-post-request-signature.md) of each request.  
:::

### Go {#go}

```go
package main

import (
    "fmt"
    "math"
)

func VerifyTimestamp(sentAtSeconds int, receivedAtSeconds int, leniencyInSeconds int) bool {
    return int(math.Abs(float64(sentAtSeconds - receivedAtSeconds))) < leniencyInSeconds
}

func main() {
    // Valid timestamps
    fmt.Println(VerifyTimestamp(1590980773, 1590980773, 300)) // => true
    fmt.Println(VerifyTimestamp(1590980773, 1590980523, 300)) // => true
    fmt.Println(VerifyTimestamp(1590980773, 1590981023, 300)) // => true

    // Invalid timestamps
    fmt.Println(VerifyTimestamp(1590980773, 1590980273, 300)) // => false
    fmt.Println(VerifyTimestamp(1590980773, 1590981273, 300)) // => false
}
```

### Java {#java}

```java
public class Example {
    public static void main(String[] args) {
        // Valid timestamps
        System.out.println(verifyTimestamp(1590980773, 1590980773, 300)); // => true
        System.out.println(verifyTimestamp(1590980773, 1590980523, 300)); // => true
        System.out.println(verifyTimestamp(1590980773, 1590981023, 300)); // => true

        // Invalid timestamps
        System.out.println(verifyTimestamp(1590980773, 1590980273, 300)); // => false
        System.out.println(verifyTimestamp(1590980773, 1590981273, 300)); // => false
    }

    static Boolean verifyTimestamp(Integer sentAtSeconds, Integer receivedAtSeconds, Integer leniencyInSeconds) {
        return Math.abs(sentAtSeconds - receivedAtSeconds) < leniencyInSeconds;
    }
}
```

### JavaScript {#javascript}

```javascript
function verifyTimestamp(
  sentAtSeconds,
  receivedAtSeconds,
  leniencyInSeconds = 300
) {
  return Math.abs(sentAtSeconds - receivedAtSeconds) < leniencyInSeconds;
}

// Valid timestamps
console.log(verifyTimestamp(1590980773, 1590980773)); // => true
console.log(verifyTimestamp(1590980773, 1590981023)); // => true
console.log(verifyTimestamp(1590980773, 1590980523)); // => true

// Invalid timestamps
console.log(verifyTimestamp(1590980773, 1590980273)); // => false
console.log(verifyTimestamp(1590980773, 1590981273)); // => false
```

### PHP {#php}

```php
<?php

function verifyTimestamp(int $sentAtSeconds, int $receivedAtSeconds, int $leniencyInSeconds = 300) {
    return abs($sentAtSeconds - $receivedAtSeconds) < $leniencyInSeconds;
}

// Valid timestamps
var_dump(verifyTimestamp(1590980773, 1590980773)); // => bool(true)
var_dump(verifyTimestamp(1590980773, 1590980523)); // => bool(true)
var_dump(verifyTimestamp(1590980773, 1590981023)); // => bool(true)

// Invalid timestamps
var_dump(verifyTimestamp(1590980773, 1590980273)); // => bool(false)
var_dump(verifyTimestamp(1590980773, 1590981273)); // => bool(false)

?>
```

### Python {#python}

```python
def verify_timestamp(sent_at_seconds, received_at_seconds, leniency_in_seconds = 300):
    return abs(sent_at_seconds - received_at_seconds) < leniency_in_seconds

# Valid timestamps
print(verify_timestamp(1590980773, 1590980773)) # => True
print(verify_timestamp(1590980773, 1590980523)) # => True
print(verify_timestamp(1590980773, 1590981023)) # => True

# Invalid timestamps
print(verify_timestamp(1590980773, 1590980273)) # => False
print(verify_timestamp(1590980773, 1590981273)) # => False
```

### Ruby {#ruby}

```ruby
def verify_timestamp(sent_at_seconds, received_at_seconds, leniency_in_seconds = 300)
    (sent_at_seconds - received_at_seconds).abs < leniency_in_seconds
end

# Valid timestamps
puts verify_timestamp(1590980773, 1590980773) # => true
puts verify_timestamp(1590980773, 1590980523) # => true
puts verify_timestamp(1590980773, 1590981023) # => true

# Invalid timestamps
puts verify_timestamp(1590980773, 1590980273) # => false
puts verify_timestamp(1590980773, 1590981273) # => false
```

### TypeScript {#typescript}

```javascript
function verifyTimestamp(
  sentAtSeconds: number,
  receivedAtSeconds: number,
  leniencyInSeconds: number = 300
): boolean {
  return Math.abs(sentAtSeconds - receivedAtSeconds) < leniencyInSeconds;
}

// Valid timestamps
console.log(verifyTimestamp(1590980773, 1590980773)); // => true
console.log(verifyTimestamp(1590980773, 1590981023)); // => true
console.log(verifyTimestamp(1590980773, 1590980523)); // => true

// Invalid timestamps
console.log(verifyTimestamp(1590980773, 1590980273)); // => false
console.log(verifyTimestamp(1590980773, 1590981273)); // => false
```
