---
title: "Client secrets"
sidebar_label: "Client secrets"
path: /client-secret/
---

Every app has a unique _client secret_. This is a sensitive value that's shared between Canva and your app. You need this secret to [verify request signatures](./verify-post-request-signature.md).

:::danger  
 You should never share a client secret or commit it to source control.  
:::

## Getting a client secret

To get your app's client secret:

1.  Navigate to an app via the Developer Portal.
2.  Open the **Verification & Auth** page.
3.  Under the **Client secret key** field, click **Copy**.

:::tip  
 We recommend storing client secrets as environment variables.  
:::

## Regenerating a client secret

If your app's client secret is leaked or committed to source control, the secret is no longer secure and you need to regenerate it. But this poses a problem: disabling the current secret will cause verified requests to fail until the app starts using the new secret.

To avoid this problem, Canva supports _key rotation_. This means you can generate a new secret without immediately disabling the existing secret.

When more than one client secret is active at a time, Canva sends multiple request signatures with every request. Each signature is calculated using one of the active client secrets. The app only needs to verify one of these signatures to confirm the authenticity of the request. This allows you to regenerate client secrets without causing downtime.

To regenerate your app's client secret:

1.  Navigate to an app via the Developer Portal.
2.  Open the **Verification & Auth** page.
3.  Click **Regenerate**.
4.  Indicate how many hours the existing client secret should remain active for.
5.  Click **Regenerate client secret key**.

The new client secret will appear in the **Client secret key** field.

## Decoding a client secret

Canva provides the client secret as a base64url-encoded string. To use the secret to verify request signatures, you need to decode the string into a _byte array_.

This is an example of how to decode a client secret in JavaScript:

```javascript
const secret = process.env.CLIENT_SECRET; // Load the client secret from an environment variable
const key = Buffer.from(secret.replace("-", "+").replace("_", "/"), "base64");
console.log(key);
```

For examples in other languages, refer to [Decoding a client secret](./decode-client-secret.md).

:::note  
 base64url encoding is _not_ the same thing as base64 encoding. The differences are explained in [this StackOverflow answer](https://stackoverflow.com/a/55389212/13227683).  
:::
