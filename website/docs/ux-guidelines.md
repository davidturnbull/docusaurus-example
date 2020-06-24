---
title: "UX guidelines for Canva Apps"
sidebar_label: "UX guidelines"
path: /ux-guidelines/
---

At Canva, we pride ourselves on providing delightful user experiences, and as much as possible, we want to help our developer community to do the same. That's why we've put together this page of UX guidelines.

If you follow our UX guidelines, you'll end up with an app that is:

- Easier to use
- Better integrated with the Canva ecosystem
- More likely to be approved for release in the [Apps Directory](https://canva.com/apps)

If you have any questions about the guidelines, [create a support ticket](https://canvadev.atlassian.net/servicedesk/customer/portal/8) and we'll get back to you.

## Principles

We promote apps based on the quality of the experience they provide to Canva's users. In particular, we look for apps that:

- Reliably solve a problem our user's face
- Unlock new functionality with no better substitute
- Provide an insanely delightful user experience

To achieve these qualities, build your app with the following principles in mind:

### Just simple enough

Provide an experience that can be understood by non-designers. Avoid using jargon or controls that only a professional can understand.

### Great defaults

Use [presets](./editing-extensions/presets.md) and great defaults to help users create their design with fewer clicks. If users don't tweak any settings, they should still end up with a great design.

### Less is more

Focus your app experience on its essential functions. Consider the number of controls you show and optimize the functions that provide the most value without complicating the user experience.

### Words are design

What users read is just as important as what they see and interact with, so make sure that any messaging and labels in your app are clear, concise, and meaningful.

## Copy {#copy}

These guidelines apply to all copy in an app, including descriptions and error messages.

### Avoid idioms

Idioms may not be understood by people from different age groups or cultural backgrounds.

### Be concise

Use short sentences and simple words. Avoid unnecessary modifiers such as "quite", "very", or "really".

### Use sentence case

Sentence case means only capitalizing the first letter of the first word in a sentence. In general, sentence case is easier to read and scan.

## Using the Canva brand

When marketing your app, use the logo marks in [our official brand guidelines](https://www.canva.com/design/DADxJK0fhm0/gdX_ID1ICmqszM40mWddyQ/view?website#2:partner-brand-guidelines).

## App details

These guidelines apply to the fields on the **App details** page.

### App name

- Use fewer than 10 characters, including spaces (more than 10 characters may lead to overflow)
- Use the app's name consistently in your messaging

### Short description

- Use fewer than 50 characters, including spaces (more than 50 characters may lead to overflow)

### Company or developer name

- Use fewer than 20 characters, including spaces (more than 20 characters may lead to overflow)
- URLs are not allowed

### App icon

- Keep the design simple, as small details won't be visible at lower resolutions
- Ensure the icon is recognizable at the smallest display size of 24 x 24 px
- Use fewer than 2-3 colors
- Use adequate padding around elements in the icon

### App featured image

- Keep the design simple, as small details won't be visible at lower resolutions
- Use 1-2 colors that best represent your brand
- Remove UI details that distract from the app's main function

### App tagline

- Use one sentence of fewer than 50 characters, including spaces (more than 50 characters may lead to overflow)

### App description

- Use 2-3 sentences, with fewer than a total of 200 characters, including spaces (more than 200 characters may lead to overflow)
- This description will be translated, so the shorter it is, the easier it will be to translate into languages that require more characters to convey the same meaning

### App images

- Keep the design simple, as smaller details won't be visible at lower resolutions
- Use 1-2 colors that best represent your brand
- Remove UI details that distract from the app's main function
- Demonstrate where your app will be discovered in the Canva editor
- Show how your app works in the Canva editor

## Content extensions

### Layouts

You can configure a content extension to use the **Grid** or **List** layout. The layout affects how content is displayed. Each layout is suitable for different situations.

#### Grid

The **Grid** layout is the default layout that Canva uses to display content.

A content extension should use the **Grid** layout if:

- There is a variability in the dimensions of the content
- There is a mix of transparent and non-transparent content
- The title of the content (and other metadata) is not essential to the user experience
- The extension does not need to organize content into containers
- Thumbnails exactly match the content that will be added to the design

#### List

The **List** layout displays large, full-width thumbnails, and a space for displaying the title of the content (and other metadata).

A content extension should use the **List** layout if:

- There is no variability in the dimensions of the content
- Thumbnails must be displayed at full-width for them to be meaningful
- The title of the content or metadata helps users differentiate between each piece of content (e.g. videos displaying their title and publish date)
- The thumbnail for the content is not an exact match for how it will appear in the user's design (e.g. videos, maps, forms, embeds, etc)

### Containers

You can configure a content extension to support [containers](./content-extensions/containers.md).

Your extension should organize content into containers if:

- The content is more discoverable when organized into containers
- The content has clear, container-like associations (e.g. albums, collections, boards, channels, etc)
- The content exists in containers on the platform it originates from (e.g. file storage services like Dropbox already support their own version of containers)

:::note  
 Only images -- not embeds -- can be organized into containers.  
:::

### Search

Generally, we encourage developers to [add a search field](./content-extensions/search.md) to their content extensions. This field appears at the top of the side panel and contains customizable placeholder text.

If you customize the search field's placeholder text:

- Keep the language functional and concise
- Use fewer than 25 characters to avoid overflow and allow the text to be translated into languages that may require more characters to convey the same meaning

Some good examples of placeholder text include:

- Search images
- Enter a location
- Enter a website URL
- Search your folders

### Empty states

When a user opens a content extension, they should be shown some initial content, rather than an empty screen. Sometimes though, this isn't possible, such as when an authenticated user doesn't have any private content and there isn't any public content to show.

If it's not possible to provide initial content, an extension must provide an empty state message. Canva displays this message when there is no initial content.

If you provide an empty state message:

- Keep the message concise, informative, and actionable
- Use 1-2 sentences
- Use fewer than 150 characters to avoid overflow and allow the text to be translated into languages that may require more characters to convey the same meaning

This is a good example of an empty state message:

> Content from your Dropbox account will appear here. Check you have content in your account with Dropbox.

## Editing extensions

### Presets

You can configure an editing extension to support [presets](./editing-extensions/presets.md). Presets allow users to apply effects to their images in a single click.

It's not always possible to create presets for an editing extension — sometimes, the functionality of the extension just isn't suitable — but if it is possible, we recommend presets as the primary method for applying effects to images. This is because presets:

- Provide users with instant gratification
- Hide the initial complexity of controls

### Controls {#editing-extension-controls}

Controls allow users to customize the effect applied to their image. If you add controls to an editing extension, we encourage you to:

- Use as few controls as possible
- Focus the extension's experience on its essential functions
- Add support for presets (if applicable)

## Publish extensions

### Layouts

You can configure a publish extension to use the **Default**, **List**, or **Nested** layout. The layout affects the appearance and functionality of the extension. Each layout is suitable for different situations.

#### Default

A publish extension should use the **Default** layout if:

- The destination platform doesn't store published designs in a flat or nested structure of containers
- The user's design will be published as a single post on a social media timeline (such as a tweet or an Instagram photo)

#### List

A publish extension should use the **List** layout if the destination platform stores published designs in a flat structure of containers (without sub-containers).

#### Nested

A publish extension should use the **Nested** layout if the destination platform stores published designs in a nested structure of containers (with sub-containers).
