---
title: "Submission checklist for Canva Apps"
sidebar_label: "Submission checklist"
path: /submission-checklist/
---

For an app to be approved for release, it must meet the requirements outlined on this page. If your app doesn't meet these requirements, you'll be asked to create a new version of the app and resubmit it.

If you have any questions about the submission requirements, [create a support ticket](https://canvadev.atlassian.net/servicedesk/customer/portal/8) and we'll get back to you.

## Prerequisites

### General

Your app must:

- Solve a clear need for Canva's users
- Be functional and complete

### Copy

An app's copy, from its descriptions to its error messages, must be provided in US English. This allows us to localize the app for 25+ locales.

Your app should also adhere to Canva's [UX guidelines for copy](./ux-guidelines/#copy.md).

### Third-party integration

If your app integrates with a third-party platform, you'll need to provide us with the following details:

- Login details for an account that allows us to test the integration
- Documentation that explains how the platform works
- Documentation that explains where we can find integration points in the platform

## App details

In the Developer Portal, you can configure a number of details about an app, such as the name and description for the app, via the **App details** page. These details affect how the app appears in the Canva editor and Apps Directory.

### App icon

Your app's icon must:

- have an opaque background
- retain its quality when scaled down to 24 x 24 px

It must not include text strings, as they can't be translated during the localization process

### App featured image

Your app's featured image must not include text strings, as they can't be translated during the localization process.

### App images

You must provide at least two images for your app. These images must not include text strings, as they can't be translated during the localization process.

### Privacy policy URL

You must provide a URL for a privacy policy that users can view when connecting the app. This page must be:

- hosted by you, the developer
- viewable on mobile (and other non-desktop) devices

### Terms and conditions URL

You must provide a URL for terms and conditions that users can view when connecting the app. This page must be:

- hosted by you, the developer
- viewable on mobile (and other non-desktop) devices

### Support URL

You must provide a URL for a support or "contact us" page that users can view when connecting the app. This page must be:

- hosted by you, the developer
- viewable on mobile (and other non-desktop) devices

## Authentication

If your app supports authentication, the following requirements apply:

- Users with an account on the integrated platform can log into it
- Users can authenticate on mobile (and other non-desktop) devices
- Users can cancel the authentication flow
- Users can't end up in a dead-end or endless loop during the authentication flow
- The authentication flow can handle common error cases, such incorrect passwords
- At the end of the authentication flow, the pop-up window automatically closes
- Users can revoke any permissions they provide to the integrated platform
- After revoking permissions, users can reconnect to the integrated platform with the same (or a different) account

If you intend to contact your app's users for marketing purposes, the following requirements apply:

- Any marketing communications must be opted into (not out of) during the authentication flow
- If a user opts into marketing communications, they must always be provided with a working "unsubscribe" link

:::note  
 We recommend developers to not send emails for the first 7 days after opting in and to limit the emails thereafter to critical communications.  
:::

## Verification

If your app receives HTTP requests from Canva, it must verify that any requests it receives are actually arriving Canva (and not from some nefarious third-party).

For more information, refer to [Verifying requests](./verifying-requests.md).

## Content extensions

### Content

The content provided by a content extension must be:

- Child-safe
- Inoffensive to Canva's users
- Adherent to the [Canva Apps Terms](https://about.canva.com/policies/apps-terms/)
- From a credible source
- Aligned with user's expectations
- Legally distributed

### Images

If a content extension provides [images](./content-extensions/images.md), the following requirements apply:

- Images meet Canva's [Upload requirements](https://support.canva.com/create-your-design/uploads/photo-file-requirements/)
- Images are either in the JPG, PNG, or SVG format
- JPG and PNG images are less than 25MB
- SVG images are less than 3MB
- Images are added to the design with the correct aspect ratio
- Thumbnails accurately represent the full-sized image
- Full-sized images are of sufficient quality for their intended use

### Embeds

If a content extension provides [embeds](./content-extensions/embeds.md), the following requirements apply:

- The URLs of the embeds are supported by [Iframely](https://iframely.com)
- Embeds are compatible with Canva's [supported browsers](https://support.canva.com/account-basics/change-your-account-settings/supported-browsers/)
- Embeds are added to the design with the correct aspect ratio
- Thumbnails allow the user to identify (and distinguish between) embeds

### Containers

If a content extension supports [containers](./content-extensions/containers.md), the following requirements apply:

- The use of containers improves the user's browsing experience
- Opening a container loads content that belongs to that container
- Pagination is enabled for containers

### Search

If a content extension supports [search](./content-extensions/search.md), the following requirements apply:

- Search results match the user's expectations
- Search results are returned in a logical order
- Users can search for partial words
- Pagination is enabled for search results
- Thumbnails in the search results accurately represent the content
- Thumbnails are clear and not pixelated
- **Search input placeholder message** matches [UX copy guidelines](./ux-guidelines/#copy.md)
- **Empty results message** matches [UX copy guidelines](./ux-guidelines/#copy.md)

## Editing extensions

### General

If your app includes an editing extension, the extension must not crash, throw errors, or cause a negative impact on the average user's system.

### Browsers

Your extension must be compatible with Canva's [supported browsers](https://support.canva.com/account-basics/change-your-account-settings/supported-browsers/).

### Controls

An editing extension's controls must provide a simple and unsurprising user experience. You can achieve this by ensuring that:

- controls have accurate labels
- when a user interacts with a control, it updates the preview of the user's image

For more information, refer to the [UX guidelines for editing extension controls](./ux-guidelines/#editing-extension-controls.md).

### Image output

An editing extension must use the user's input image to produce a valid output image:

- If the input image is a raster image, the output image is a raster image
- If the input image is a vector image, the output image is a vector image
- The output image has at least the same resolution as the input image
- The output image has the same aspect ratio as the input image
- The output image meets Canva's [Upload requirements](https://support.canva.com/create-your-design/uploads/photo-file-requirements/)
- The output image abides by Canva's [content policy](https://about.canva.com/terms-of-use/)

### Presets

If an editing extension supports [presets](./editing-extensions/presets.md), the following requirements apply:

- The extension provides at least four presets
- Preset thumbnails help tjhe user identify the outcome of selecting the preset
- Preset thumbnails generate in two seconds on an average user's system

## Publish extensions

### Pre-publish

- If a publish extension uses the **List** or **Nested** layout, users can select a container to publish their design to a specific location on the destination platform
- If a publish extension supports [search](./publish-extensions/search.md), users can search for containers

### Publishing

- The extension uploads the user's design to the destination platform
- The destination platform accepts the published designs in the configured formats
- If a user publishes multiple pages of a design, each page of the design is uploaded to the destination platform

### Post-publish

- The destination platform equally supports desktop and non-desktop devices
- When referencing Canva, the destination platform adheres to [Canva's Brand Guidelines](https://www.canva.com/design/DADxJK0fhm0/gdX_ID1ICmqszM40mWddyQ/view?website#2:partner-brand-guidelines)
- If a publish extension supports [messages](./publish-extensions/messages.md), users can view the message they've provided after publishing their design.
